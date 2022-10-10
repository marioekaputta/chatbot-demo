import Response from '../Util/Response'
import { FallbackIntent, PushIntent } from '../Bot'

/**
 * Context's name can be anything, but usually
 * started with 'c' and it's in camelCase format
 * Example: 'cGreeting'
 *
 * Don't forget to add the contexts in intents
 * in this const, otherwise there will be error
 * when deploying the bot
 */
export const Context = [
  'cGreeting',
  'cOfferHelp',
  'cOfferHelpClosing'
]

/**
 * Entity's name can be anything
 *
 * Don't forget to define the entity here,
 * otherwise there will be error
 * when deploying the bot
 */
export const Entity = {
  any: '.*',
  location: '(?i)(?<=location\:\ )[0-9\-\,\.]+',
  error: '(?i)^error title\: .* details\: .*$',
  image: '(?i)^url\: .* mime\_type\: .* caption\: .*$',
  video: '(?i)^url\: .* mime\_type\: .* caption\: .*$',
  reply: '(?i)^context\: .* reply\: .*',
  contact: '(?i)^contact\: .*',
  interactive: '(?i)^interactive\\\|id:.*;title:.*'
}

export class Maintenance {
  static response = {
    ['wa']: [
      Response.text(['Saat ini sedang dalam perbaikan'])
    ]
  }
}

export class DefaultFallback extends FallbackIntent {
  static response = {
    ['wa']: [
      Response.text([
        'Maaf kami belum mengerti maksud Anda 🙁'
      ])
    ]
  }
}

export class MiddlewareError extends PushIntent {
  public push(event: EventMiddleware, error?: string) {
    return this.trigger(event, {
      response: Response.text([error || [
        'Saat ini layanan WhatsApp sedang mengalami gangguan',
        '',
        'Silakan tunggu beberapa saat lagi'
      ].join('\n')])
    })
  }
}

/**
 * Example of intent that have an actions() method with push intent
 *
 */

// export class Greeting extends InitialIntent {
//   static userExpression = [
//     'halo',
//     'hai'
//   ]
//   static response = {
//     ['wa']: [
//       Response.text(['greeting'])
//     ]
//   }

//   public actions() {
//     return this.run(LogEvent)  // you can call action function from ../Action directory
//       .run(async (event: EventMiddleware, data: DataMiddleware, next: StoryNextFunction) => {  // or, you can define directly that function, not recommended if the functions are redundant or complex
//         return await new ExamplePush().push(event)
//         // or you can `return next(event, data)` if there are actions after this
//       })
//   }
// }

export class ExamplePush extends PushIntent {
  public async push(event: EventMiddleware) {
    return await this.trigger(event, {
      response: Response.text(['response from intent push'])
      // or you can define for other integrations, if needed
      // response: {
      //   wa: ResponseBuilder.build('wa').text(['response from intent push']),
      //   fb: ResponseBuilder.build('fb').text(['response from intent push']),
      //   telegram: ResponseBuilder.build('telegram').text(['response from intent push']),
      //   line: ResponseBuilder.build('line').text(['response from intent push'])
      // }
    })
  }
}
