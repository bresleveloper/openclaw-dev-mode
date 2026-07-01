/** Maximum delay Node timers can represent without overflow warnings. */
export declare const MAX_SAFE_TIMEOUT_DELAY_MS = 2147483647;
/** Default server-side window for gateway preauth handshakes. */
export declare const DEFAULT_PREAUTH_HANDSHAKE_TIMEOUT_MS = 15000;
/** Minimum client watchdog delay for connect challenge setup. */
export declare const MIN_CONNECT_CHALLENGE_TIMEOUT_MS = 250;
/** Default maximum client watchdog delay, aligned with the preauth server timeout. */
export declare const MAX_CONNECT_CHALLENGE_TIMEOUT_MS = 15000;
/** Clamps arbitrary timer delays to Node's safe range and an optional floor. */
export declare function resolveSafeTimeoutDelayMs(delayMs: number, opts?: {
    minMs?: number;
}): number;
/** Adds grace time while preserving safe timer bounds if inputs overflow or are invalid. */
export declare function addSafeTimeoutDelayGraceMs(delayMs: number, graceMs: number, opts?: {
    minMs?: number;
}): number;
/** Resolves optional timeout values through a fallback and safe timer clamp. */
export declare function resolveFiniteTimeoutDelayMs(delayMs: number | null | undefined, fallbackMs: number, opts?: {
    minMs?: number;
}): number;
/** Clamps connect challenge watchdog timeouts to the gateway-supported range. */
export declare function clampConnectChallengeTimeoutMs(timeoutMs: number, maxTimeoutMs?: number): number;
/** Reads the connect challenge watchdog override from the process environment. */
export declare function getConnectChallengeTimeoutMsFromEnv(env?: NodeJS.ProcessEnv): number | undefined;
/** Resolves the client watchdog timeout using explicit, env, then preauth defaults. */
export declare function resolveConnectChallengeTimeoutMs(timeoutMs?: number | null, params?: {
    env?: NodeJS.ProcessEnv;
    configuredTimeoutMs?: number | null;
}): number;
/** Reads the preauth handshake timeout override from environment variables. */
export declare function getPreauthHandshakeTimeoutMsFromEnv(env?: NodeJS.ProcessEnv): number;
/** Resolves the server preauth timeout from env, explicit config, or default. */
export declare function resolvePreauthHandshakeTimeoutMs(params?: {
    env?: NodeJS.ProcessEnv;
    configuredTimeoutMs?: number | null;
}): number;
