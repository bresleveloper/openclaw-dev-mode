type EventSink<T> = {
    push(event: T): void;
};
export declare function createDeferredEventBuffer<T>(sink: EventSink<T>, onBufferedEvent?: () => void): {
    push(event: T): void;
    flush(): void;
    discard(): void;
};
export {};
