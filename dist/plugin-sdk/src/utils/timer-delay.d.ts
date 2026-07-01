export { addSafeTimeoutDelayGraceMs, MAX_SAFE_TIMEOUT_DELAY_MS, resolveFiniteTimeoutDelayMs, resolveSafeTimeoutDelayMs, } from "../../packages/gateway-client/src/timeouts.js";
/** Wrapper around setTimeout that clamps unsafe or invalid delays before arming the timer. */
export declare function setSafeTimeout(callback: () => void, delayMs: number, opts?: {
    minMs?: number;
}): NodeJS.Timeout;
