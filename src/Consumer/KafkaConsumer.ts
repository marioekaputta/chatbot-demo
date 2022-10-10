import { HandlerNextFunction, KafkaMessage, Publisher } from '@bahasa-ai/articuno-js'
import { AI, Engine, PI } from '@bahasa-ai/plugins-core-engine'
import { captureException } from '@sentry/node'
import { Cache } from '../Service/Cache'
import { logger } from '../Util/Logger'

export const processMessageFromPI = async (msg: KafkaMessage<PI.MessageFromPI>, _: HandlerNextFunction) => {
  logger.info(`Received message from pi: ${msg.body.message.text} => (${msg.body.integration} - ${msg.body.sourceId})`)
  logger.debug(`Detailed message from pi: ${JSON.stringify(msg.body)}`)

  const isMessageIdExist = await Cache.build().get(`${msg.body.agentId}:fromPI:${msg.body.messageId}`)
  const ttl = parseInt(process.env.REDIS_MULTIPLE_MESSAGE_TTL) || 300

  if (!isMessageIdExist) {
    await Cache.build().set(`${msg.body.agentId}:fromPI:${msg.body.messageId}`, 'true', 'EX', ttl)

    Engine.processMessage(msg.body, async (AIMessage) => {
      logger.debug(`AI Payload ${JSON.stringify(AIMessage)}`)
      try {
        logger.info('sending to kafka topic getIntentAndEntity')
        await Publisher.instance.send('getIntentAndEntity', AIMessage)
        logger.info('successfully send to kafka topic getIntentAndEntity')
      } catch (error) {
        logger.error('Error ', error)
        captureException(error)
      }
    })
  } else {
    await Cache.build().set(`${msg.body.agentId}:fromPI:${msg.body.messageId}`, 'true', 'EX', ttl)
    logger.error(`Received message with the same messageId ${msg.body.messageId}`)
  }
}

export const processMessageFromAI = async (msg: KafkaMessage<AI.AIPayload>, _: HandlerNextFunction) => {
  const isMessageIdExist = await Cache.build().get(`${msg.body.agentId}:fromAI:${msg.body.messageId}`)
  const ttl = parseInt(process.env.REDIS_MULTIPLE_MESSAGE_TTL) || 3600

  if (!isMessageIdExist) {
    await Cache.build().set(`${msg.body.agentId}:fromAI:${msg.body.messageId}`, 'true', 'EX', ttl)

    logger.debug(`Received ai res: ${JSON.stringify(msg.body)}`)

    logger.info('building bot response')
    const botResponse = await Engine.buildResponse(msg.body)
    logger.debug(`bot response ${JSON.stringify(botResponse)}`)
    logger.info('successfully building bot response')

    logger.info(`Sending to send-response-${botResponse.integration}`)
    await Publisher.instance.send(`send-response-${botResponse.integration}`, botResponse)
    logger.info(`successfully send to send-response-${botResponse.integration}`)
  } else {
    await Cache.build().set(`${msg.body.agentId}:fromAI:${msg.body.messageId}`, 'true', 'EX', ttl)
    logger.error(`Received message with the same messageId ${msg.body.messageId}`)
  }
}