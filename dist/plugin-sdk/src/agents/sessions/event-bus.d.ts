/** Minimal publish/subscribe interface used by session components. */
export interface EventBus {
    emit(channel: string, data: unknown): void;
    on(channel: string, handler: (data: unknown) => void): () => void;
}
/** Event bus plus lifecycle control for tests and teardown. */
export interface EventBusController extends EventBus {
    clear(): void;
}
/** Creates an in-process event bus with unsubscribe and clear support. */
export declare function createEventBus(): EventBusController;
