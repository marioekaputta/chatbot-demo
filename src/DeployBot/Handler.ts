import { Publisher } from '@bahasa-ai/articuno-js'
import { Build } from '@bahasa-ai/plugins-botbuilder'
import Config from '../Config'
import Database from '@bahasa-ai/engine-database'
import { Management } from '@bahasa-ai/plugins-core-engine'
import { CoreAITrainData } from '@bahasa-ai/plugins-core-engine/dist/Types/AI'
import { logger } from '../Util/Logger'

export const deployBot = async (DB: typeof Database) => {
  // set db
  Management.setDatabaseConnection(DB.connection)

  logger.info('Building YAML...')
  const resultParsed = Build(__dirname + '/../Bot')

  const result: CoreAITrainData = await Management.saveConversationDesign(resultParsed, Config.agentId)
  logger.debug('save yaml, convDesign: %j', result.conversationDesignId)

  logger.info('Sending YAML to Kafka...')
  const send = await Publisher.instance.send('training', result)
  logger.debug('Send %j', send)
}