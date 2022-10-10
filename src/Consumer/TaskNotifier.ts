import { HandlerNextFunction, KafkaMessage } from '@bahasa-ai/articuno-js'
import Database from '@bahasa-ai/engine-database'
import Config from '../Config'
import { deployBot } from '../DeployBot/Handler'
import { logger } from '../Util/Logger'

type TaskNotifier = {
  task: string,
  agentId?: string[]
}

let DBInstance: typeof Database

export const setTaskNotifierDBInstance = (DB: typeof Database) => {
  DBInstance = DB
}

export const taskNotifier = async (msg: KafkaMessage<TaskNotifier>, _: HandlerNextFunction) => {
  logger.debug(`Received task notifier ${JSON.stringify(msg.body)}`)

  const { task, agentId } = msg.body

  if (task === 'train') {
    if (agentId.includes(Config.agentId)) {
      await deployBot(DBInstance)
    } else {
      logger.info('Receive train task but no agentId included')
    }
  }
}