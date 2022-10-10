export const InteractiveExpression = {
  parameter: {
    interactive: {
      entity: 'interactive'
    }
  },
  userExpression: [
    {
      sentence: 'interactive|id:id;title:title',
      parameter: {
        interactive: '0,0'
      }
    }
  ]
}

export const AnyExpression = {
  parameter: {
    data: {
      entity: 'any'
    }
  },
  userExpression: [
    {
      sentence: 'any',
      parameter: {
        ['any']: '0,0'
      }
    }
  ]
}

export const ImageExpression = {
  parameter: {
    image: {
      entity: 'image'
    }
  },
  userExpression: [
    {
      sentence: 'url: https://google.com/image.jpg mime_type: image/jpg caption: test',
      parameter: {
        ['image']: '0,5'
      }
    }
  ]
}

export const VideoExpression = {
  parameter: {
    video: {
      entity: 'video'
    }
  },
  userExpression: [
    {
      sentence: 'url: https://google.com/video.mp4 mime_type: video/mp4 caption: test',
      parameter: {
        ['video']: '0,5'
      }
    }
  ]
}

export const EmailExpression = {
  parameter: {
    email: {
      entity: 'system.email'
    }
  },
  userExpression: [
    {
      sentence: 'system.email',
      parameter: {
        'system.email': '0,0'
      }
    }
  ]
}

export const PhoneExpression = {
  parameter: {
    phone: {
      entity: 'system.phone'
    }
  },
  userExpression: [
    {
      sentence: 'system.phone',
      parameter: {
        'system.phone': '0,0'
      }
    }
  ]
}

export const NumberExpression = {
  parameter: {
    option: {
      entity: 'system.numberv2'
    }
  },
  userExpression: [
    {
      sentence: 'system.numberv2',
      parameter: {
        'system.numberv2': '0,0'
      }
    }
  ]
}

export const DateExpression = {
  parameter: {
    date: {
      entity: 'system.date'
    }
  },
  userExpression: [
    {
      sentence: 'system.date',
      parameter: {
        'system.date': '0,0'
      }
    }
  ]
}