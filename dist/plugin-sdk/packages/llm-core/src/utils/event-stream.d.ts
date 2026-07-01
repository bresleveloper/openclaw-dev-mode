import type { AssistantMessage, AssistantMessageEvent, AssistantMessageEventStreamContract } from "../types.js";
/** Generic async-iterable event stream with a separately awaited final result. */
export declare class EventStream<T, R = T> implements AsyncIterable<T> {
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
export declare class AssistantMessageEventStream extends EventStream<AssistantMessageEvent, AssistantMessage> implements AssistantMessageEventStreamContract {
    constructor();
}
/** Creates an assistant-message stream for provider and plugin adapters. */
export declare function createAssistantMessageEventStream(): AssistantMessageEventStream;
