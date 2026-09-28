import { N as GatewayAuthRateLimitConfig } from "./types.openclaw-LzSbb55e.js";
//#region src/gateway/auth-rate-limit.d.ts
interface RateLimitConfig extends GatewayAuthRateLimitConfig {
  /** Background prune interval in milliseconds; set <= 0 to disable auto-prune.  @default 60_000 */
  pruneIntervalMs?: number;
  /** Maximum tracked client identities before old unlocked entries are evicted.  @default 10_000 */
  maxEntries?: number;
}
interface RateLimitCheckResult {
  /** Whether the request is allowed to proceed. */
  allowed: boolean;
  /** Number of remaining attempts before the limit is reached. */
  remaining: number;
  /** Milliseconds until the lockout expires (0 when not locked). */
  retryAfterMs: number;
}
interface AuthRateLimiter {
  /** Check whether `ip` is currently allowed to attempt authentication. */
  check(ip: string | undefined, scope?: string): RateLimitCheckResult;
  /** Record a failed authentication attempt for `ip`. */
  recordFailure(ip: string | undefined, scope?: string): void;
  /**
   * Record a failed attempt and await any loopback penalty delay.
   *
   * Deliberately post-verification: it prices repeated guessing from one loopback
   * source without ever gating a request before its credentials are checked.
   * Gating earlier would stop parallel fan-out, but would also let a bad local
   * peer stall the operator's own correct-credential CLI, which loopback must
   * never do. Fan-out from loopback is out of scope for this limiter by design.
   */
  recordFailureAndDelay(ip: string | undefined, scope?: string): Promise<void>;
  /** Reset the rate-limit state for `ip` (e.g. after a successful login). */
  reset(ip: string | undefined, scope?: string): void;
  /** Return the current number of tracked IPs (useful for diagnostics). */
  size(): number;
  /** Remove expired entries and release memory. */
  prune(): void;
  /** Dispose the limiter and cancel periodic cleanup timers. */
  dispose(): void;
}
declare function createAuthRateLimiter(config?: RateLimitConfig): AuthRateLimiter & {
  updateConfig: (config?: GatewayAuthRateLimitConfig) => void;
};
//#endregion
export { RateLimitConfig as n, createAuthRateLimiter as r, AuthRateLimiter as t };