import { promisifyAll } from 'bluebird'
import { RedisClient } from 'redis'

export class Cache {

  private static instance: Cache

  private client: any

  private prefix: string = process.env.REDIS_PREFIX || 'bot'

  private constructor() {
    promisifyAll(RedisClient.prototype)
    this.client = new RedisClient({ host: process.env.REDIS_HOST || '127.0.0.1', port: parseInt(process.env.REDIS_PORT || '6379'), password: process.env.REDIS_AUTH })
  }

  public static build() {
    if (!Cache.instance) {
      Cache.instance = new Cache()
    }
    return Cache.instance
  }

  public async get(key: string) {
    const value = await this.client.getAsync(`${this.prefix}:${key}`)

    if (value) {
      return JSON.parse(value)
    }
  }

  public async set(key: string, value: any, type?: string, ttl?: number) {
    try {
      value = JSON.stringify(value)
    } catch {
      // don't do anything
    }

    if (type && ttl) {
      return await this.client.setAsync(`${this.prefix}:${key}`, value, type, ttl)
    }
    return await this.client.setAsync(`${this.prefix}:${key}`, value)
  }

  public async del(key: string) {
    return await this.client.delAsync(`${this.prefix}:${key}`)
  }
}