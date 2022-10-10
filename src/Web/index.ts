import { NextFunction, Request, Response, Router } from '@bahasa-ai/articuno-js'
import { CE } from '@bahasa-ai/copywriter'
import Database from '@bahasa-ai/engine-database'
import { readFileSync } from 'fs'
import { deployBot } from '../DeployBot/Handler'

export function defaultRouter(): Router {
  const route: Router = Router()

  route.get('/version', (_: Request, res: Response) => {
    const pkg: { version: string } = JSON.parse(readFileSync(__dirname + '/../../package.json', 'utf-8'))
    return res.send({ version: pkg.version })
  })

  route.get('/ping', (_: Request, res: Response) => {
    return res.send({ ping: 'pong' })
  })

  route.post('/updateCopywriting', async (_: Request, res: Response) => {
    await CE.pull()
    return res.send({ status: 'ok' })
  })

  return route
}

export function trainBotRouter(DB: typeof Database): Router {
  const route: Router = Router()

  route.post('/train', async (_: Request, res: Response, next: NextFunction) => {
    try {
      await deployBot(DB)
      return res.status(200).send('Train success')
    } catch (error) {
      next(error)
    }
  })

  return route
}

export function VersionOne(): Router {
  const route: Router = Router()

  route.post('/sample', async (_: Request, res: Response, next: NextFunction) => {
    try {
      return res.status(200).send({})
    } catch (error) {
      return next(error)
    }
  })

  return route
}