import type { OpenClawConfig } from "../config/types.openclaw.js";
/** Resolve effective inbound debounce milliseconds from explicit, channel, and global config. */
export declare function resolveInboundDebounceMs(params: {
    cfg: OpenClawConfig;
    channel: string;
    overrideMs?: number;
}): number;
/** Options for creating a keyed inbound debouncer. */
export type InboundDebounceCreateParams<T> = {
    debounceMs: number;
    maxTrackedKeys?: number;
    buildKey: (item: T) => string | null | undefined;
    shouldDebounce?: (item: T) => boolean;
    resolveDebounceMs?: (item: T) => number | undefined;
    serializeImmediate?: boolean;
    onFlush: (items: T[]) => Promise<void>;
    onError?: (err: unknown, items: T[]) => void;
    onCancel?: (items: T[]) => void;
};
/** Create a keyed debouncer with flush/cancel controls and same-key serialization. */
export declare function createInboundDebouncer<T>(params: InboundDebounceCreateParams<T>): {
    enqueue: (item: T) => Promise<void>;
    flushKey: (key: string) => Promise<void>;
    cancelKey: (key: string) => boolean;
};
