import { MiddlewareFunction, Framework, TriggerIntentPayload } from '@bahasa-ai/plugins-core-engine'
import { Publisher } from '@bahasa-ai/articuno-js'
import { logger } from './Util/Logger'

type BotResponse = any[] | {
  ['wa']?: any[],
  ['internal-wa']?: any[],
  ['jatis-wa']?: any[],
  ['wavecell-wa']?: any[],
  ['fb']?: any[],
  ['line']?: any[],
  ['telegram']?: any[],
  ['tg']?: any[],
  ['livechat']?: any[],
  ['gbm']?: any[],
  ['tokopedia']?: any[]
}

class Base {
  static userExpression: (string | {
    sentence: string,
    parameter: {
      [entityName: string]: string
    }
  })[]
  static webhook: {
    url: string,
    header: {
      [key: string]: string
    }
  }
  static contextIn: string[]
  static contextOut: string[]
  static parameter: {
    [parameterName: string]: {
      isList?: boolean,
      isRequired?: boolean,
      isMemory?: boolean,
      entity: string
    }
  }
  static isHumanFallback: boolean

  /**
   * @deprecated Use intent push to reply as a response
   */
  static response: {
    [integration: string]: any[][]
  }

  protected run(fn: MiddlewareFunction) {
    return new Framework.Receiver().run(fn)
  }

  public actions() { }
}

export class InitialIntent extends Base { }

export class TerminalIntent extends Base { }

export class FallbackIntent extends Base { }

export class PushIntent extends Base {
  static isContextReplaced: boolean

  public async trigger(event: EventMiddleware, responses: { parameter?: any, response?: BotResponse } = {}): Promise<any> {
    const trigger = await new Framework.Trigger({
      ...event,
      agentId: event.agentId,
      integration: event.integration,
      intentSlug: this.constructor.name,
      sourceId: event.sourceId,
      messageId: event.messageId
    }).trigger(responses)

    logger.info(`intent ${trigger.intent.name} triggered`)
    logger.debug(`trigger intent ${JSON.stringify(trigger)}`)

    // send to pi
    logger.info(`sending response to send-response-${trigger.integration}`)
    await Publisher.instance.send(`send-response-${trigger.integration}`, trigger)
    logger.info(`successfully sending response to send-response-${trigger.integration}`)

    return trigger
  }

  public async triggerWithoutEvent(payload: TriggerIntentPayload, responses: { parameter?: any, response?: BotResponse } = {}): Promise<any> {
    const trigger = await new Framework.Trigger(payload).trigger(responses)

    // send to pi
    await Publisher.instance.send(`send-response-${trigger.integration}`, trigger)

    return trigger
  }

  public async push(_event: EventMiddleware, ..._options: any) { }
  public async pushWithoutEvent(_payload: TriggerIntentPayload, ..._options: any) { }
}
