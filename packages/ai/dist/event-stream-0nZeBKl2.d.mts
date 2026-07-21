import { a as AssistantMessageEvent, i as AssistantMessage, o as AssistantMessageEventStreamContract } from "./types-DRgdPqaZ.mjs";

//#region packages/llm-core/src/utils/event-stream.d.ts
/** Generic async-iterable event stream with a separately awaited final result. */
declare class EventStream<T, R = T> implements AsyncIterable<T> {
  private queue;
  private waiting;
  private done;
  private finalResultPromise;
  private resolveFinalResult;
  private isComplete;
  private extractResult;
  constructor(isComplete: (event: T) => boolean, extractResult: (event: T) => R);
  push(event: T): void;
  end(result?: R): void;
  [Symbol.asyncIterator](): AsyncIterator<T>;
  result(): Promise<R>;
}
/** Assistant-message event stream that resolves on done/error terminal events. */
declare class AssistantMessageEventStream extends EventStream<AssistantMessageEvent, AssistantMessage> implements AssistantMessageEventStreamContract {
  constructor();
}
/** Creates an assistant-message stream for provider and plugin adapters. */
declare function createAssistantMessageEventStream(): AssistantMessageEventStream;
//#endregion
export { EventStream as n, createAssistantMessageEventStream as r, AssistantMessageEventStream as t };