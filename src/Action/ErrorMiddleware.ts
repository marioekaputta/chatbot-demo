import Config from '../Config'
import * as Sentry from '@sentry/node'
import { MiddlewareError } from '../Bot/Base'
import { logger } from '../Util/Logger'
import { setMessageInfoContext } from '../Util/Sentry'

export default async (error: Error, event: EventMiddleware, _: DataMiddleware) => {
  logger.error(`\n\n=========== ${new Date().toISOString()} →  ${event.query || event.intent.name} ===========\nEvent: %j`, event)

  await new MiddlewareError().push(event, Config.debug ? error.message : null)

  logger.error(error)
  Sentry.captureException(error, setMessageInfoContext(event))
}