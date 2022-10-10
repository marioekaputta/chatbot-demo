import { EventMiddleware as BaseEventMiddleware, BaseDataMiddleware, StoryNextFunction as BaseStoryNextFunction } from '@bahasa-ai/plugins-core-engine'

declare global {
  export type MemorySTM = {}

  export type MemoryLTM = {}

  export type EventMiddleware = BaseEventMiddleware<MemorySTM, MemoryLTM>

  export interface DataMiddleware extends BaseDataMiddleware<MemorySTM, MemoryLTM> {}

  export type StoryNextFunction = BaseStoryNextFunction
}