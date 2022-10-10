import { NextFunction, Request, Response } from '@bahasa-ai/articuno-js'
import { logger } from '../Util/Logger'

export function BasicAuth(authKey: string | { config: Function, key: string }) {
  return (req: Request, res: Response, next: NextFunction) => {
    const headers = req.headers

    if (!headers.authorization) {
      logger.error('Authorization header needed')
      return res.status(401).send({ reason: 'Authorization header needed' })
    }

    const authorizationType = (headers.authorization as string).split(' ')[0]

    if (authorizationType !== 'Basic') {
      logger.error('Authorization type not allowed')
      return res.status(401).send({ reason: 'Authorization type not allowed' })
    }

    const authorizationKey = (headers.authorization as string).split(' ')[1]

    if (typeof authKey !== 'string') {
      authKey = authKey.config(req.params.config)[authKey.key]
    }

    if (authorizationKey !== authKey) {
      logger.error(`Auth key: ${authorizationKey}`)
      logger.error(`Must be: ${authKey}`)
      logger.error('Authorization key invalid')
      return res.status(401).send({ reason: 'Authorization key invalid' })
    }

    return next()
  }
}