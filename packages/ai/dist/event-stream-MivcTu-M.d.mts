import { a as AssistantMessage, lt as ThinkingContent, o as AssistantMessageEvent, s as AssistantMessageEventStreamContract } from "./types-B1ZIh9Ch.mjs";
/** Returns only an append whose current and previously observed snapshots still match. */
declare function readAssistantThinkingAppend(block: ThinkingContent, previous: string): string | undefined;
/** Observe native producer settlement without invoking consumer result decorators. */
declare function getEventStreamCompletion(stream: object): Promise<unknown> | undefined;
/** Generic async-iterable event stream with a separately awaited final result. */
declare class EventStream<T, R = T> implements AsyncIterable<T> {
  protected queue: (T | undefined)[];
  private queueHead;
  private waiting;
  protected done: boolean;
  private resultSettled;
  private finalResultPromise;
  private resolveFinalResult;
  private rejectFinalResult;
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
  private activeThinkingBlocks?;
  push(event: AssistantMessageEvent): void;
  end(result?: AssistantMessage): void;
  private clearThinkingAppends;
  constructor();
}
/** Creates an assistant-message stream for provider and plugin adapters. */
declare function createAssistantMessageEventStream(): AssistantMessageEventStream;
export { readAssistantThinkingAppend as a, getEventStreamCompletion as i, EventStream as n, createAssistantMessageEventStream as r, AssistantMessageEventStream as t };