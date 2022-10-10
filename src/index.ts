import 'source-map-support/register'
import 'reflect-metadata'
import * as dotenv from 'dotenv'
console.log(dotenv.config())

// load apm
import * as apm from 'elastic-apm-node'

apm.start({
  // Override service name from package.json
  // Allowed characters: a-z, A-Z, 0-9, -, _, and space
  serviceName: 'bot-framework-test',
  environment: process.env.ENVIRONMENT || 'develop',
})

import Axios from 'axios'
import * as Sentry from '@sentry/node'
import Articuno, { Publisher } from '@bahasa-ai/articuno-js'
import * as cors from 'cors'
import Database from '@bahasa-ai/engine-database'
import { Engine, Framework } from '@bahasa-ai/plugins-core-engine'

import Config, { GetConfig, getMongoSSLOptions } from './Config'
import ErrorMiddleware from './Action/ErrorMiddleware'
import { VersionOne, defaultRouter, trainBotRouter } from './Web'
import { processMessageFromPI, processMessageFromAI } from './Consumer/KafkaConsumer'
import { taskNotifier, setTaskNotifierDBInstance } from './Consumer/TaskNotifier'
import { logger } from './Util/Logger'
import { messagePrefixBreadcrumbHandler } from './Util/Sentry'

if (process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN || null,
    release: process.env.npm_package_version,
    environment: process.env.ENVIRONMENT || 'develop',
    beforeBreadcrumb: (breadcrumb, hint) => messagePrefixBreadcrumbHandler(breadcrumb, hint),
    integrations: defaults => defaults.filter(integration => integration.name !== 'OnUnhandledRejection' && integration.name !== 'OnUncaughtException')
  })
}

process.on('uncaughtException', (error) => {
  logger.error('Uncaught exception!!!')
  logger.error('Exception:', error)
  Sentry.captureException(error)
})

process.on('unhandledRejection', (error) => {
  logger.error('unhandledRejection!!!')
  logger.error(error)
  Sentry.captureException(error)
});

(async () => {
  try {
    // Axios default configuration
    Axios.defaults.validateStatus = _ => true
    Axios.defaults.timeout = 15000

    // init database
    const mongoSSLOptions = getMongoSSLOptions()
    const DBInstance = await Database.connect({
      mongoConnectURI: process.env.DATABASE_URI || 'mongodb://localhost:27017/bahasa',
      mongoConnectOptions: {
        sslValidate: false,
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        ...mongoSSLOptions
      }
    })

    // init Framework MiddlewareHandler
    new Framework.MiddlewareApp({
      Config: GetConfig,
      BotDirectory: __dirname + '/Bot',
      errorMiddleware: ErrorMiddleware
    })

    let kafkaSASL = {}
    let kafkaSSL = {}

    if (process.env.KAFKA_USE_SSL === 'true') {
      kafkaSSL = {
        sslOptions: {
          rejectUnauthorized: false
        },
        ssl: true
      }
    }

    if (process.env.KAFKA_USE_SASL === 'true') {
      kafkaSASL = {
        sasl: {
          mechanism: 'plain',
          username: process.env.KAFKA_SASL_USERNAME,
          password: process.env.KAFKA_SASL_PASSWORD
        }
      }
    }

    // init articuno framework
    const App = new Articuno({
      kafka: {
        client: {
          kafkaHost: process.env.KAFKA_HOST || 'localhost:9092',
          autoConnect: true,
          ...kafkaSSL,
          ...kafkaSASL
        },
        consumer: {
          groupId: process.env.KAFKA_GROUP_ID || `BOT-FRAMEWORK-${Config.agentId}`,
          ...kafkaSSL,
          ...kafkaSASL
        },
        topics: {
          partitions: parseInt(process.env.TOPICS_PARTITION) || 4,
          replicationFactor: parseInt(process.env.TOPICS_REPLICATION) || 1
        }
      }
    })
    const express = App.buildServer()

    express.use(cors({
      credentials: true,
      origin: ['https://prototyper.dev.bahasalab.com']
    }))

    express.use(defaultRouter())
    express.use(trainBotRouter(DBInstance))
    express.use('/v1', VersionOne())

    App.useSentryErrorHandler()
    App.useServerErrorHandler()
    App.useNotFoundErrorHandler()

    express.listen(process.env.PORT || 4000, () => logger.info(`App started at http://localhost:${process.env.PORT || 4000} ...`))

    Engine.setDatabaseConnection(DBInstance.connection)

    // Build kafka service
    const kafka = App.buildQueue()

    // init publisher
    Publisher.build(kafka.client, {
      partitions: parseInt(process.env.TOPICS_PARTITION) || 4,
      replicationFactor: parseInt(process.env.TOPICS_REPLICATION) || 1
    })

    kafka.subscribe(`${Config.integration}-${Config.agentId}`, processMessageFromPI)
    kafka.subscribe(`ai-res-${Config.agentId}`, processMessageFromAI)

    setTaskNotifierDBInstance(DBInstance)
    kafka.subscribe('task-notifier', taskNotifier)

    kafka.listen(() => logger.info('Kafka consumer connected...'))
  } catch (error) {
    logger.error(error)
    Sentry.captureException(error)
    process.exit(1)
  }
})()