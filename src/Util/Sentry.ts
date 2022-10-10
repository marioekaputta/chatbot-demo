import * as Sentry from '@sentry/node'
import * as SentryTypes from '@sentry/types'

/**
 * Our custom log will something like `[2020-09-21T14:40:01.775Z] [MIDDLEWARE] [INFO] some logging`
 *
 * But we don't need to print the prefix `[2020-09-21T14:40:01.775Z] [MIDDLEWARE] [INFO]` in Sentry Breadcrumb
 *
 * this function is to remove that message prefix
 */
export const messagePrefixBreadcrumbHandler = (breadcrumb: Sentry.Breadcrumb, _hint?: Sentry.BreadcrumbHint) => {
  if (breadcrumb.message) {
    // remove ansi character from string. usage of ansi such as coloring when logging
    const ansiPattern = '[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:[a-zA-Z\\d]*(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)|(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-ntqry=><~]))'
    const ansiRegex = new RegExp(ansiPattern, 'g')
    breadcrumb.message = breadcrumb.message.replace(ansiRegex, '')

    const messagePrefixRegex = /\[(.*)\] \[(.*)\] \[(TRACE|DEBUG|INFO|WARN|ERROR|FATAL)\]/
    const messagePrefix = breadcrumb.message.match(messagePrefixRegex)
    breadcrumb.category = messagePrefix?.length ? messagePrefix[2] : breadcrumb.category
    breadcrumb.message = breadcrumb.message.replace(messagePrefixRegex, '').trim()
  }

  return breadcrumb
}

export const setMessageInfoContext = (event: EventMiddleware) => {
  const sentryEvent = {
    agentId: event.agentId,
    integration: event.integration,
    query: event.query,
    sessionId: event.sessionId,
    sourceId: event.sourceId,
    messageId: event.messageId,
    user: event.user,
    intent: {
      name: event.intent.name,
      contextIn: event.intent.contextIn.reduce((acc, cIn) => `${acc},${cIn.name}`, '').substring(1),
      contextOut: event.intent.contextOut.reduce((acc, cOut) => `${acc},${cOut.name}`, '').substring(1),
      conversationDesignId: event.intent.conversationDesignId,
      threshold: event.intent.threshold,
      isContextReplaced: event.intent.isContextReplaced
    }
  }

  return setSentryContext('Message Info', sentryEvent)
}


const setSentryContext = (contextName: string, event: { [key: string]: any }) => {
  const context: SentryTypes.CaptureContext = {
    contexts: {
      [contextName]: event
    }
  }

  return context
}