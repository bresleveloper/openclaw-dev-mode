import { F as resolveTimerTimeoutMs, j as resolveIntegerOption } from "./number-coercion-CLj0HTDM.mjs";
import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { a as isLoopbackAddress, h as resolveClientIp } from "./net-DU4aWKLv.mjs";
//#region src/gateway/auth-rate-limit.ts
/**
* In-memory sliding-window rate limiter for gateway authentication attempts.
*
* Tracks failed auth attempts by {scope, clientIp}. A scope lets callers keep
* independent counters for different credential classes (for example, shared
* gateway token/password vs device-token auth) while still sharing one
* limiter instance.
*
* Design decisions:
* - Pure in-memory Map – no external dependencies; suitable for a single
*   gateway process. The Map is periodically pruned and capped to avoid
*   unbounded growth.
* - Loopback addresses (127.0.0.1 / ::1) are exempt from denial by default so
*   local CLI sessions are never locked out. Failed auth still incurs a
*   bounded, escalating delay.
* - The module is side-effect-free: callers create an instance via
*   {@link createAuthRateLimiter} and pass it where needed.
*/
const AUTH_RATE_LIMIT_SCOPE_DEFAULT = "default";
const AUTH_RATE_LIMIT_SCOPE_SHARED_SECRET = "shared-secret";
const AUTH_RATE_LIMIT_SCOPE_DEVICE_TOKEN = "device-token";
const AUTH_RATE_LIMIT_SCOPE_NODE_PAIRING = "node-pairing";
const AUTH_RATE_LIMIT_SCOPE_NODE_REAPPROVAL = "node-reapproval";
const AUTH_RATE_LIMIT_SCOPE_BOOTSTRAP_TOKEN = "bootstrap-token";
const AUTH_RATE_LIMIT_SCOPE_DEVICE_JOIN = "device-join";
const AUTH_RATE_LIMIT_SCOPE_WATCH_CHALLENGE = "watch-challenge";
const AUTH_RATE_LIMIT_SCOPE_WORKER_ADMISSION = "worker-admission";
const AUTH_RATE_LIMIT_SCOPE_WORKER_TRANSFER = "worker-transfer";
const AUTH_RATE_LIMIT_SCOPE_HOOK_AUTH = "hook-auth";
const BROWSER_ORIGIN_RATE_LIMIT_KEY_PREFIX = "browser-origin:";
const IDENTITY_RATE_LIMIT_KEY_PREFIX = "identity:";
const authRateLimiterExemptionChecks = /* @__PURE__ */ new WeakMap();
/** Whether a limiter created by this module exempts the prepared client identity. */
function isAuthRateLimitClientExempt(limiter, ip) {
	return authRateLimiterExemptionChecks.get(limiter)?.(ip) ?? false;
}
const DEFAULT_MAX_ATTEMPTS = 10;
const DEFAULT_WINDOW_MS = 6e4;
const DEFAULT_LOCKOUT_MS = 3e5;
const PRUNE_INTERVAL_MS = 6e4;
const DEFAULT_MAX_ENTRIES = 1e4;
const LOOPBACK_FAILURE_DELAY_BASE_MS = 250;
const LOOPBACK_FAILURE_DELAY_MAX_MS = 5e3;
const LOOPBACK_FAILURE_HISTORY_LIMIT = Math.ceil(Math.log2(LOOPBACK_FAILURE_DELAY_MAX_MS / LOOPBACK_FAILURE_DELAY_BASE_MS)) + 1;
/**
* Canonicalize client IPs used for auth throttling so all call sites
* share one representation (including IPv4-mapped IPv6 forms).
*/
function normalizeRateLimitClientIp(ip) {
	if (typeof ip === "string" && (ip.startsWith(BROWSER_ORIGIN_RATE_LIMIT_KEY_PREFIX) || ip.startsWith(IDENTITY_RATE_LIMIT_KEY_PREFIX))) return ip;
	return resolveClientIp({ remoteAddr: ip }) ?? "unknown";
}
/** Build an opaque limiter identity that is not subject to loopback IP exemptions. */
function buildRateLimitIdentityKey(namespace, identity) {
	return `${IDENTITY_RATE_LIMIT_KEY_PREFIX}${namespace}:${identity}`;
}
function resolvePruneIntervalMs(value) {
	if (value === void 0) return PRUNE_INTERVAL_MS;
	if (Number.isFinite(value) && value <= 0) return 0;
	return resolveTimerTimeoutMs(value, PRUNE_INTERVAL_MS);
}
function resolveAuthRateLimitPolicy(config) {
	return {
		maxAttempts: config?.maxAttempts ?? DEFAULT_MAX_ATTEMPTS,
		windowMs: resolveTimerTimeoutMs(config?.windowMs, DEFAULT_WINDOW_MS, 0),
		lockoutMs: resolveTimerTimeoutMs(config?.lockoutMs, DEFAULT_LOCKOUT_MS, 0),
		exemptLoopback: config?.exemptLoopback ?? true
	};
}
function createAuthRateLimiter(config) {
	let policy = resolveAuthRateLimitPolicy(config);
	const pruneIntervalMs = resolvePruneIntervalMs(config?.pruneIntervalMs);
	const maxEntries = resolveIntegerOption(config?.maxEntries, DEFAULT_MAX_ENTRIES, { min: 1 });
	const entries = /* @__PURE__ */ new Map();
	const loopbackPenaltyWaiters = /* @__PURE__ */ new Map();
	let overflowLockedUntil;
	const pruneTimer = pruneIntervalMs > 0 ? setInterval(() => prune(), pruneIntervalMs) : null;
	if (pruneTimer?.unref) pruneTimer.unref();
	function resolveKey(rawIp, rawScope) {
		const ip = normalizeRateLimitClientIp(rawIp);
		return {
			key: `${rawScope?.trim() || "default"}:${ip}`,
			ip
		};
	}
	function isExempt(ip) {
		return policy.exemptLoopback && isLoopbackAddress(ip);
	}
	function refreshEntry(entry, now) {
		if (entry.lockedUntil && now >= entry.lockedUntil) {
			entry.lockedUntil = void 0;
			entry.attempts = [];
		}
		const cutoff = now - policy.windowMs;
		entry.attempts = entry.attempts.filter((ts) => ts > cutoff);
	}
	function check(rawIp, rawScope) {
		const { key, ip } = resolveKey(rawIp, rawScope);
		if (isExempt(ip)) return {
			allowed: true,
			remaining: policy.maxAttempts,
			retryAfterMs: 0
		};
		const now = Date.now();
		const entry = entries.get(key);
		if (!entry) {
			const overflowLock = checkOverflowLock(now);
			if (overflowLock) return overflowLock;
			return {
				allowed: true,
				remaining: policy.maxAttempts,
				retryAfterMs: 0
			};
		}
		refreshEntry(entry, now);
		if (!entry.lockedUntil && entry.attempts.length >= policy.maxAttempts) entry.lockedUntil = now + policy.lockoutMs;
		if (entry.lockedUntil && now < entry.lockedUntil) return {
			allowed: false,
			remaining: 0,
			retryAfterMs: entry.lockedUntil - now
		};
		const remaining = Math.max(0, policy.maxAttempts - entry.attempts.length);
		return {
			allowed: remaining > 0,
			remaining,
			retryAfterMs: 0
		};
	}
	function recordFailure(rawIp, rawScope) {
		const { key, ip } = resolveKey(rawIp, rawScope);
		const exempt = isExempt(ip);
		const now = Date.now();
		let entry = entries.get(key);
		if (!entry) {
			if (!enforceMaxEntries(now)) {
				overflowLockedUntil = Math.max(overflowLockedUntil ?? 0, now + policy.lockoutMs);
				return;
			}
			entry = { attempts: [] };
			entries.set(key, entry);
		}
		if (!exempt && entry.lockedUntil && now < entry.lockedUntil) return;
		refreshEntry(entry, now);
		entry.attempts.push(now);
		if (exempt && entry.attempts.length > LOOPBACK_FAILURE_HISTORY_LIMIT) entry.attempts.splice(0, entry.attempts.length - LOOPBACK_FAILURE_HISTORY_LIMIT);
		else if (!exempt && entry.attempts.length >= policy.maxAttempts) entry.lockedUntil = now + policy.lockoutMs;
	}
	function recordFailureAndDelay(rawIp, rawScope) {
		const { key, ip } = resolveKey(rawIp, rawScope);
		recordFailure(rawIp, rawScope);
		if (!isExempt(ip)) return Promise.resolve();
		const failureCount = entries.get(key)?.attempts.length ?? 1;
		const penaltyMs = Math.min(LOOPBACK_FAILURE_DELAY_BASE_MS * 2 ** Math.min(failureCount - 1, 30), LOOPBACK_FAILURE_DELAY_MAX_MS);
		const deadline = Date.now() + penaltyMs;
		let waiters = loopbackPenaltyWaiters.get(key);
		if (!waiters) {
			waiters = {
				...createDeferredCore(),
				deadline,
				timer: scheduleRelease(key, deadline)
			};
			loopbackPenaltyWaiters.set(key, waiters);
		} else if (deadline > waiters.deadline) {
			waiters.deadline = deadline;
			clearTimeout(waiters.timer);
			waiters.timer = scheduleRelease(key, deadline);
		}
		return waiters.promise;
	}
	function scheduleRelease(key, deadline) {
		const timer = setTimeout(() => releaseLoopbackWaiters(key), Math.max(0, deadline - Date.now()));
		timer.unref?.();
		return timer;
	}
	function releaseLoopbackWaiters(key) {
		const waiters = loopbackPenaltyWaiters.get(key);
		if (!waiters) return;
		loopbackPenaltyWaiters.delete(key);
		clearTimeout(waiters.timer);
		waiters.resolve();
	}
	function reset(rawIp, rawScope) {
		const { key } = resolveKey(rawIp, rawScope);
		entries.delete(key);
	}
	function pruneExpiredEntries(now) {
		for (const [key, entry] of entries) {
			if (entry.lockedUntil && now < entry.lockedUntil) continue;
			refreshEntry(entry, now);
			if (entry.attempts.length === 0) entries.delete(key);
		}
	}
	function checkOverflowLock(now) {
		if (!overflowLockedUntil) return;
		if (now >= overflowLockedUntil) {
			overflowLockedUntil = void 0;
			return;
		}
		if (entries.size >= maxEntries) pruneExpiredEntries(now);
		if (entries.size < maxEntries) {
			overflowLockedUntil = void 0;
			return;
		}
		return {
			allowed: false,
			remaining: 0,
			retryAfterMs: overflowLockedUntil - now
		};
	}
	function enforceMaxEntries(now) {
		if (entries.size < maxEntries) return true;
		pruneExpiredEntries(now);
		if (entries.size < maxEntries) return true;
		for (const [entryKey, entry] of entries) if (!entry.lockedUntil || now >= entry.lockedUntil) {
			entries.delete(entryKey);
			return true;
		}
		return false;
	}
	function prune() {
		pruneExpiredEntries(Date.now());
	}
	function size() {
		return entries.size;
	}
	function dispose() {
		if (pruneTimer) clearInterval(pruneTimer);
		entries.clear();
		overflowLockedUntil = void 0;
		for (const key of loopbackPenaltyWaiters.keys()) releaseLoopbackWaiters(key);
	}
	const limiter = {
		check,
		recordFailure,
		recordFailureAndDelay,
		reset,
		size,
		prune,
		dispose,
		updateConfig: (next) => {
			policy = resolveAuthRateLimitPolicy(next);
		}
	};
	authRateLimiterExemptionChecks.set(limiter, (rawIp) => isExempt(normalizeRateLimitClientIp(rawIp)));
	return limiter;
}
//#endregion
export { AUTH_RATE_LIMIT_SCOPE_HOOK_AUTH as a, AUTH_RATE_LIMIT_SCOPE_SHARED_SECRET as c, AUTH_RATE_LIMIT_SCOPE_WORKER_TRANSFER as d, buildRateLimitIdentityKey as f, normalizeRateLimitClientIp as h, AUTH_RATE_LIMIT_SCOPE_DEVICE_TOKEN as i, AUTH_RATE_LIMIT_SCOPE_WATCH_CHALLENGE as l, isAuthRateLimitClientExempt as m, AUTH_RATE_LIMIT_SCOPE_DEFAULT as n, AUTH_RATE_LIMIT_SCOPE_NODE_PAIRING as o, createAuthRateLimiter as p, AUTH_RATE_LIMIT_SCOPE_DEVICE_JOIN as r, AUTH_RATE_LIMIT_SCOPE_NODE_REAPPROVAL as s, AUTH_RATE_LIMIT_SCOPE_BOOTSTRAP_TOKEN as t, AUTH_RATE_LIMIT_SCOPE_WORKER_ADMISSION as u };
