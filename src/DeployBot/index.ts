import 'source-map-support/register'
import * as dotenv from 'dotenv'
console.log(dotenv.config())

import * as Sentry from '@sentry/node'
import { deployBot } from './Handler'
import { getMongoSSLOptions } from '../Config'
import { Publisher, KafkaClient } from '@bahasa-ai/articuno-js'
import Database from '@bahasa-ai/engine-database'
import { logger } from '../Util/Logger'
import { messagePrefixBreadcrumbHandler } from '../Util/Sentry'

(async () => {
  try {
    // init sentry
    Sentry.init({
      dsn: process.env.SENTRY_DSN || null,
      environment: process.env.ENVIRONMENT || 'develop',
      beforeBreadcrumb: (breadcrumb, hint) => messagePrefixBreadcrumbHandler(breadcrumb, hint)
    })

    logger.info('Starting kafka client...')
    const kafkaClient = new KafkaClient({
      kafkaHost: process.env.KAFKA_HOST,
    })

    Publisher.build(kafkaClient, {
      partitions: parseInt(process.env.TOPICS_PARTITION) || 4,
      replicationFactor: parseInt(process.env.TOPICS_REPLICATION) || 1
    })

    logger.info('Connecting to db...')
    const mongoSSLOptions = getMongoSSLOptions()
    const DB = await Database.connect({
      mongoConnectURI: process.env.DATABASE_URI || 'mongodb://test_db_user:test_db_password@13.251.68.101:27017/bahasaTestDB',
      mongoConnectOptions: {
        sslValidate: false,
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        ...mongoSSLOptions
      }
    })

    await deployBot(DB)

    kafkaClient.close(() => {
      logger.info('Terminating kafka client...')
      process.exit(0)
    })

  } catch (error) {
    logger.error(error)
    Sentry.captureException(error)
    process.exit(1)
  }
})()