import { logger } from '../Util/Logger'

export default async (event: EventMiddleware, data: DataMiddleware, next: StoryNextFunction) => {
  logger.info(`=========== ${new Date().toISOString()} →  ${event.query || event.intent.name} ===========`)
  logger.debug(`Event: ${JSON.stringify(event)}`)
  return next(event, data)
}
