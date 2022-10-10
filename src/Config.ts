import * as fs from 'fs'
import { ConnectionOptions } from 'mongoose'

/**
 * !Important
 * You should update this value based on your need.
 *
 * authKey:
 * Random string which authorize agent, put in Authorization header in YAML (you can get at: https://www.uuidgenerator.net/)
 * webhook:
 *  url: https://your-webhook
 *  header:
 *    Authorization: Basic ${authKey}
 *
 * agentId:
 * Select agent with bahasa-cli by run `bahasa set-agent` and get the ID
 *
 * agentAccessToken:
 * Issue agent token with bahasa-cli by run `bahasa issue-agent-token` and select `Access Token`
 *
 * sentryDSN:
 * Get SENTRY_DSN from here: https://sentry.bahasalab.com/organizations/sentry/projects/new/
 *
 * **Select by environment**
 *
 * Develop:
 * brapiURL: 'http://13.251.56.70:6969/v1/client'
 * appledoreURL: 'http://13.251.56.70:8181'
 *
 * Staging:
 * brapiURL: 'https://api.stage.bahasalab.com/v1/client'
 * appledoreURL: 'https://appledore.stage.bahasalab.com'
 *
 * Production:
 * brapiURL: 'https://api.bahasa.ai/v1/client'
 * appledoreURL: 'https://appledore.bahasa.ai'
 *
 */

type ConfigsType = {
  [name: string]: {
    debug: boolean,
    authKey: string,
    agentId: string,
    integration: string,
    agentAccessToken: string,
    dbServiceURL: string }
}

const baseConfig = {
  debug: process.env.ENVIRONMENT == 'develop' || process.env.ENVIRONMENT == 'stage',
  authKey: process.env.AUTH_KEY || null,
  agentId: process.env.AGENT_ID || null,
  integration: process.env.INTEGRATION || null,
  agentAccessToken: process.env.AGENT_ACCESS_TOKEN || null,
  dbServiceURL: process.env.DB_URL || null
}

export const Configs: ConfigsType = {
  default: baseConfig,
}

export function GetConfig(configName: string = 'default') {
  return Configs[configName]
}

export default GetConfig()

export const getMongoSSLOptions = () => {
  const mongoSSLOptions: ConnectionOptions = {}
  if (process.env.DATABASE_DB_USE_SSL === 'true') {
    if (process.env.DB_KEY_PATH) {
      mongoSSLOptions.sslKey = fs.readFileSync(process.env.DB_KEY_PATH).toString()
    }

    if (process.env.DB_CERT_PATH) {
      mongoSSLOptions.sslCert = fs.readFileSync(process.env.DB_CERT_PATH).toString()
    }

    mongoSSLOptions.ssl = true
    mongoSSLOptions.checkServerIdentity = false
  }

  return mongoSSLOptions
}