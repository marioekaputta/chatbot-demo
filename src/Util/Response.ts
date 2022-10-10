/**
 * !Please update response body based on platform you integrated
 */


/**
 * Example: Line doesn't support Document Response
 */
type UnsupportedResponseType = {
  url: string,
  caption?: string
}

namespace WAType {
  export type Text = {
    text: string,
    preview_url?: boolean
  }

  export type Image = {
    s3key?: string,
    link?: string,
    caption?: string
  }

  export type Audio = {
    link?: string
  }

  export type Video = {
    link?: string,
    caption?: string
  }

  export type Document = {
    link: string,
    caption?: string
  }

  export type ButtonAction = {
    type: 'reply',
    reply: {
      id: string,
      title: string
    }
  }

  export type InteractiveListItem = {
    id: string,
    title: string,
    description?: string
  }

  export type InteractiveButton = {
    header?: string,
    body: string,
    buttons: ButtonAction[]
  }

  export type InteractiveList = {
    header?: string,
    body: string,
    buttonTitle: string,
    listTitle: string,
    list: InteractiveListItem[]
  }
}

namespace FBType {
  export type Image = {
    url?: string,
    attachment_id?: string,
    is_reusable?: boolean
  }

  export type Audio = {
    url?: string,
    attachment_id?: string,
    is_reusable?: boolean
  }

  export type Video = {
    url?: string,
    attachment_id?: string,
    is_reusable?: boolean
  }

  export type Document = {
    url?: string,
    attachment_id?: string,
    is_reusable?: boolean
  }
}

namespace LineType {
  export type Image = {
    originalContentUrl: string,
    previewImageUrl: string
  }

  export type Video = {
    originalContentUrl: string,
    previewImageUrl: string
  }

  export type Audio = UnsupportedResponseType
  export type Document = UnsupportedResponseType
}

namespace TelegramType {
  export type Image = {
    photo: string,
    caption?: string
  }

  export type Video = UnsupportedResponseType
  export type Audio = UnsupportedResponseType
  export type Document = UnsupportedResponseType
}

namespace ZendeskChatWidgetType {
  type QuickReply = {
    action: {
      value: string
    },
    text: string
  }

  type Button = {
    action: {
      type: 'QUICK_REPLY_ACTION' | 'LINK_ACTION',
      value: string
    },
    text: string
  }

  export type Text = {
    text: string,
    /**
     * value in array: min 1, max 11
     */
    quick_replies?: QuickReply[],
    /**
     * value in array: min 1, max 3
     */
    buttons?: Button[]
  }

  export type Image = UnsupportedResponseType
  export type Video = UnsupportedResponseType
  export type Audio = UnsupportedResponseType
  export type Document = UnsupportedResponseType
}

namespace LivechatType {
  export type Text = {
    text: string,
    quickReplies?: {
      text: string,
      type: 'message' | 'url',
      value: string
    }[]
  }

  export type Image = {
    url: string,
    caption?: string
  }

  export type Video = UnsupportedResponseType
  export type Audio = UnsupportedResponseType
  export type Document = UnsupportedResponseType
}

namespace GBMType {
  export type Text = {
    text: string
  }

  export type Image = {
    fileURL: string,
    altText: string,
    thumbnailURL?: string
  }

  export type Video = UnsupportedResponseType
  export type Audio = UnsupportedResponseType
  export type Document = UnsupportedResponseType
}

class BaseResponse {
  public merge(...responses): any[] {
    return responses.reduce((result, resp) => {
      return result.concat(resp)
    }, [])
  }
}

namespace TokopediaType {
  export type Text = {
    text: string
  }

  export type Image = {
    url: string
  }

  export type Video = UnsupportedResponseType
  export type Audio = UnsupportedResponseType
  export type Document = UnsupportedResponseType
}

class WAResponse extends BaseResponse {
  public text(messages: (string | WAType.Text)[]): any[] {
    return (messages as any[]).map(message => {
      return typeof message === 'string' ? {
        type: 'text',
        text: { body: message }
      } : {
        type: 'text',
        preview_url: message.preview_url,
        text: { body: message.text }
      }
    })
  }

  public audio(audios: Partial<WAType.Audio>[]): any[] {
    return audios.map(audio => {
      return {
        type: 'audio',
        audio
      }
    })
  }

  public image(images: Partial<WAType.Image>[]): any[] {
    return images.map(image => {
      return {
        type: 'image',
        image: {
          S3Key: image.s3key,
          ...image
        }
      }
    })
  }

  public document(documents: Partial<WAType.Document>[]): any[] {
    return documents.map(document => {
      return {
        type: 'document',
        document
      }
    })
  }

  public video(videos: Partial<WAType.Video>[]): any[] {
    return videos.map(video => {
      return {
        type: 'video',
        video
      }
    })
  }

  public interactiveButton(param: WAType.InteractiveButton): any[] {
    const response: any = {
      type: 'interactive',
      interactive: {
        type: 'button',
        body: {
          text: param.body
        },
        action: {
          buttons: param.buttons
        }
      }
    }
    if (param.header) {
      response.interactive = {
        ...response.interactive,
        header: {
          type: 'text',
          text: param.header
        }
      }
    }

    return [
      response
    ]
  }

  public interactiveList(param: WAType.InteractiveList): any[] {
    const response: any = {
      type: 'interactive',
      interactive: {
        type: 'list',
        body: {
          text: param.body
        },
        action: {
          button: param.buttonTitle,
          sections: [
            {
              title: param.listTitle,
              rows: param.list
            }
          ]
        }
      }
    }
    if (param.header) {
      response.interactive = {
        ...response.interactive,
        header: {
          type: 'text',
          text: param.header
        }
      }
    }

    return [
      response
    ]
  }
}

class FBResponse extends BaseResponse {
  public text(messages: (string | any)[]): any[] {
    return messages.map(body => {
      return {
        message: {
          text: body
        }
      }
    })
  }

  public image(images: Partial<FBType.Image>[]): any[] {
    return images.map(image => {
      return {
        message: {
          attachment: {
            type: 'image',
            payload: image
          }
        }
      }
    })
  }

  public video(videos: Partial<FBType.Video>[]): any[] {
    return videos.map(video => {
      return {
        message: {
          attachment: {
            type: 'video',
            payload: video
          }
        }
      }
    })
  }

  public audio(audios: Partial<FBType.Audio>[]): any[] {
    return audios.map(audio => {
      return {
        message: {
          attachment: {
            type: 'audio',
            payload: audio
          }
        }
      }
    })
  }

  public document(documents: Partial<FBType.Document>[]): any[] {
    return documents.map(document => {
      return {
        message: {
          attachment: {
            type: 'file',
            payload: document
          }
        }
      }
    })
  }
}

class LineResponse extends BaseResponse {
  public text(messages: (string | any)[]): any[] {
    const returnedMessages = []

    // can't use map function because line can't
    // send empty text message
    messages.forEach(body => {
      if (body) {
        returnedMessages.push({
          type: 'text',
          text: body
        })
      }
    })

    return returnedMessages
  }

  public image(images: Partial<LineType.Image>[]): any[] {
    return images.map(image => {
      return {
        type: 'image',
        ...image
      }
    })
  }

  public video(videos: Partial<LineType.Video>[]): any[] {
    return videos.map(video => {
      return {
        type: 'video',
        ...video
      }
    })
  }

  private unsupportedType(chats: Partial<UnsupportedResponseType>[]): any[] {
    return chats.map(chat => {
      return {
        type: 'text',
        text: `${chat.url}` + chat.caption ? `\n${chat.caption}` : ''
      }
    })
  }

  public audio(audios: Partial<LineType.Audio>[]): any[] {
    return this.unsupportedType(audios)
  }

  public document(documents: Partial<LineType.Document>[]): any[] {
    return this.unsupportedType(documents)
  }
}

class TelegramResponse extends BaseResponse {
  public text(messages: (string | any)[]): any[] {
    return messages.map(body => {
      return {
        type: 'text',
        text: body
      }
    })
  }

  public image(images: Partial<TelegramType.Image>[]): any[] {
    return images.map(image => {
      return {
        type: 'image',
        ...image
      }
    })
  }

  private unsupportedType(chats: Partial<UnsupportedResponseType>[]): any[] {
    return chats.map(chat => {
      return {
        type: 'text',
        text: `${chat.url}` + chat.caption ? `\n${chat.caption}` : ''
      }
    })
  }

  public video(videos: Partial<TelegramType.Video>[]): any[] {
    return this.unsupportedType(videos)
  }

  public audio(audios: Partial<TelegramType.Audio>[]): any[] {
    return this.unsupportedType(audios)
  }

  public document(documents: Partial<TelegramType.Document>[]): any[] {
    return this.unsupportedType(documents)
  }
}

class ZendeskChatWidgetResponse extends BaseResponse {
  public text(messages: (string | ZendeskChatWidgetType.Text)[]): any[] {
    return (messages as any[]).map(message => {
      return typeof message === 'string' ? {
        type: 'text',
        text: message
      } : {
        type: 'text',
        ...message
      }
    })
  }

  private unsupportedType(chats: Partial<UnsupportedResponseType>[]): any[] {
    return chats.map(chat => {
      return {
        type: 'text',
        text: `${chat.url}` + chat.caption ? `\n${chat.caption}` : ''
      }
    })
  }

  public image(images: Partial<ZendeskChatWidgetType.Image>[]): any[] {
    return this.unsupportedType(images)
  }

  public video(videos: Partial<ZendeskChatWidgetType.Video>[]): any[] {
    return this.unsupportedType(videos)
  }

  public audio(audios: Partial<ZendeskChatWidgetType.Audio>[]): any[] {
    return this.unsupportedType(audios)
  }

  public document(documents: Partial<ZendeskChatWidgetType.Document>[]): any[] {
    return this.unsupportedType(documents)
  }
}

class LivechatResponse extends BaseResponse {
  public text(messages: (string | LivechatType.Text)[]): any[] {
    return (messages as any[]).map(message => {
      return typeof message === 'string' ? {
        type: 'message',
        text: message
      } : {
        type: 'message',
        ...message
      }
    })
  }

  public image(images: Partial<LivechatType.Image>[]): any[] {
    return images.map(image => {
      return {
        type: 'image',
        ...image
      }
    })
  }

  private unsupportedType(chats: Partial<UnsupportedResponseType>[]): any[] {
    return chats.map(chat => {
      return {
        type: 'message',
        text: `${chat.url}` + chat.caption ? `\n${chat.caption}` : ''
      }
    })
  }

  public video(videos: Partial<LivechatType.Video>[]): any[] {
    return this.unsupportedType(videos)
  }

  public audio(audios: Partial<LivechatType.Audio>[]): any[] {
    return this.unsupportedType(audios)
  }

  public document(documents: Partial<LivechatType.Document>[]): any[] {
    return this.unsupportedType(documents)
  }
}


class GBMResponse extends BaseResponse {
  public text(messages: (string | GBMType.Text)[]): any[] {
    return (messages as any[]).map(message => {
      return typeof message === 'string' ? {
        type: 'text',
        text: message
      } : {
        type: 'text',
        ...message
      }
    })
  }

  public image(images: Partial<GBMType.Image>[]): any[] {
    return images.map(image => {
      return {
        type: 'image',
        ...image
      }
    })
  }

  private unsupportedType(chats: Partial<UnsupportedResponseType>[]): any[] {
    return chats.map(chat => {
      return {
        type: 'text',
        text: `${chat.url}` + chat.caption ? `\n${chat.caption}` : ''
      }
    })
  }

  public video(videos: Partial<GBMType.Video>[]): any[] {
    return this.unsupportedType(videos)
  }

  public audio(audios: Partial<GBMType.Audio>[]): any[] {
    return this.unsupportedType(audios)
  }

  public document(documents: Partial<GBMType.Document>[]): any[] {
    return this.unsupportedType(documents)
  }
}

class TokopediaResponse extends BaseResponse {
  public text(messages: (string | TokopediaType.Text)[]): any[] {
    return (messages as any[]).map(message => {
      return typeof message === 'string' ? {
        type: 'text',
        text: message
      } : {
        type: 'text',
        ...message
      }
    })
  }

  public image(images: Partial<TokopediaType.Image>[]): any[] {
    return images.map(image => {
      return {
        type: 'image',
        ...image
      }
    })
  }

  private unsupportedType(chats: Partial<UnsupportedResponseType>[]): any[] {
    return chats.map(chat => {
      return {
        type: 'text',
        text: `${chat.url}` + chat.caption ? `\n${chat.caption}` : ''
      }
    })
  }

  public video(videos: Partial<TokopediaType.Video>[]): any[] {
    return this.unsupportedType(videos)
  }

  public audio(audios: Partial<TokopediaType.Audio>[]): any[] {
    return this.unsupportedType(audios)
  }

  public document(documents: Partial<TokopediaType.Document>[]): any[] {
    return this.unsupportedType(documents)
  }
}

export class ResponseBuilder {
  public static build(integration: 'wa' | 'internal-wa' | 'jatis-wa' | 'dam-wa' | 'wavecell-wa' | 'fb' | 'line' | 'telegram' | 'tg' | 'zendesk-chat-widget' | 'livechat' | 'gbm' | 'tokopedia') {
    if (integration === 'wa' || integration === 'internal-wa' || integration === 'jatis-wa' || integration === 'dam-wa' || integration === 'wavecell-wa') {
      return new WAResponse()
    }
    if (integration === 'fb') {
      return new FBResponse()
    }
    if (integration === 'line') {
      return new LineResponse()
    }
    if (integration === 'telegram' || integration === 'tg') {
      return new TelegramResponse()
    }
    if (integration === 'zendesk-chat-widget') {
      return new ZendeskChatWidgetResponse()
    }
    if (integration === 'livechat') {
      return new LivechatResponse()
    }
    if (integration === 'gbm') {
      return new GBMResponse()
    }
    if (integration === 'tokopedia') {
      return new TokopediaResponse()
    }

    throw Error('Integration not defined in response module yet.')
  }
}

export default ResponseBuilder.build('wa') as WAResponse