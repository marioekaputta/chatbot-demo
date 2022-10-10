import * as chalk from 'chalk'
import * as util from 'util'

class Logger {
  private static _instance: Logger

  public static get Instance() {
    return this._instance || (this._instance = new this())
  }

  private getTime() {
    return `[${new Date().toISOString()}]`
  }

  public trace(message: any, ...optionalParams: any[]) {
    const structuredMessage = util.format(message, ...optionalParams)
    console.trace(this.getTime(), chalk.cyan('[MIDDLEWARE]'), 'TRACE', structuredMessage)
  }

  public debug(message: any, ...optionalParams: any[]) {
    const structuredMessage = util.format(message, ...optionalParams)
    console.debug(this.getTime(), chalk.cyan('[MIDDLEWARE]'), chalk.green('[DEBUG]'), structuredMessage)
  }

  public info(message: any, ...optionalParams: any[]) {
    const structuredMessage = util.format(message, ...optionalParams)
    console.info(this.getTime(), chalk.cyan('[MIDDLEWARE]'), chalk.cyan('[INFO]'), structuredMessage)
  }

  public warn(message: any, ...optionalParams: any[]) {
    const structuredMessage = util.format(message, ...optionalParams)
    console.warn(this.getTime(), chalk.cyan('[MIDDLEWARE]'), chalk.yellow('[WARN]'), structuredMessage)
  }

  public error(message: any, ...optionalParams: any[]) {
    const structuredMessage = util.format(message, ...optionalParams)
    console.error(this.getTime(), chalk.cyan('[MIDDLEWARE]'), chalk.red('[ERROR]'), structuredMessage)
  }

  /**
   * There is no console.fatal
   */
  public fatal(message: any, ...optionalParams: any[]) {
    const structuredMessage = util.format(message, ...optionalParams)
    console.error(this.getTime(), chalk.cyan('[MIDDLEWARE]'), chalk.red.bold('[FATAL]'), structuredMessage)
  }
}

export const logger = Logger.Instance