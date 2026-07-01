export declare const DEFAULT_UNDICI_STREAM_TIMEOUT_MS: number;
/**
 * Module-level bridge so `resolveDispatcherTimeoutMs` in fetch-guard.ts
 * can read the global dispatcher timeout without relying on Undici's
 * non-public `.options` field.
 */
export declare let globalUndiciStreamTimeoutMs: number | undefined;
/** Installs the env-proxy global dispatcher once proxy env is available. */
export declare function ensureGlobalUndiciEnvProxyDispatcher(): void;
/**
 * Records the stream timeout bridge and applies it only when the current global
 * dispatcher already uses env or managed proxy routing.
 */
export declare function ensureGlobalUndiciStreamTimeouts(opts?: {
    timeoutMs?: number;
}): void;
/** Forces timeout/family policy onto the current supported global dispatcher. */
export declare function ensureGlobalUndiciDispatcherStreamTimeouts(opts?: {
    timeoutMs?: number;
}): void;
/** Clears module-level dispatcher bookkeeping between isolated tests. */
export declare function resetGlobalUndiciStreamTimeoutsForTests(): void;
/**
 * Re-evaluate proxy env changes for root undici imports. Installs
 * EnvHttpProxyAgent when proxy env is present, and restores a direct Agent
 * after proxy env is cleared.
 */
export declare function forceResetGlobalDispatcher(opts?: {
    preserveProxylineManaged?: boolean;
}): void;
