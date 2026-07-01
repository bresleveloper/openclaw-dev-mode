/**
 * Process-global context-window runtime state.
 * Keeps discovery loads, config backoff, and token cache reset behavior
 * shared across module reloads and runtime seams.
 */
import type { OpenClawConfig } from "../config/types.openclaw.js";
import { type LazyPromiseLoader } from "../shared/lazy-promise.js";
type ContextWindowRuntimeState = {
    generation: number;
    loadPromise: Promise<void> | null;
    loadGeneration: number | null;
    configuredConfig: OpenClawConfig | undefined;
    configLoadFailures: number;
    nextConfigLoadAttemptAtMs: number;
    modelsConfigRuntimeLoader: LazyPromiseLoader<typeof import("./models-config.runtime.js")>;
};
/** Shared mutable state for context-window resolution and model discovery. */
export declare const CONTEXT_WINDOW_RUNTIME_STATE: ContextWindowRuntimeState;
/** Invalidate prepared context metadata while a replacement load is staged. */
export declare function beginContextWindowCacheRefresh(): void;
/** Reset context-window runtime state and token cache for isolated tests. */
export declare function resetContextWindowCacheForTest(): void;
export {};
