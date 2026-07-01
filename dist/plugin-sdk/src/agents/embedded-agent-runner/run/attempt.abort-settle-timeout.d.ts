type AbortSettleTimeoutEnv = Partial<Pick<NodeJS.ProcessEnv, "OPENCLAW_EMBEDDED_ABORT_SETTLE_TIMEOUT_MS" | "OPENCLAW_TEST_FAST">>;
/**
 * Resolves how long embedded-run cleanup waits for abort side effects to settle.
 * The explicit env override is strict decimal milliseconds; invalid values fall
 * back to the normal/test defaults instead of silently widening cleanup waits.
 */
export declare function resolveEmbeddedAbortSettleTimeoutMs(env?: AbortSettleTimeoutEnv): number;
export {};
