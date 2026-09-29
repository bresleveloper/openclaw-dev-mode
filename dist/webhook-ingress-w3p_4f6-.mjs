import { j as resolveIntegerOption } from "./number-coercion-CLj0HTDM.mjs";
import { i as getPluginRuntimeGatewayRequestScope } from "./gateway-request-scope-BLBH-Gpf.mjs";
import { t as pruneMapToMaxSize } from "./map-size-CNcWiFKu.mjs";
import { x as resolveRequestClientIpFromHeaders } from "./net-DU4aWKLv.mjs";
import "./auth-rate-limit-DuWYneOU.mjs";
import "./http-body-Bl_jph25.mjs";
import "./webhook-request-guards-CccCHICi.mjs";
import "./webhook-targets-DEaCj9F6.mjs";
//#region src/plugin-sdk/webhook-memory-guards.ts
/** Default webhook ingress rate-limit settings for plugin monitors. */
const WEBHOOK_RATE_LIMIT_DEFAULTS = Object.freeze({
	windowMs: 6e4,
	maxRequests: 120,
	maxTrackedKeys: 4096
});
/** Default cardinality and sampling settings for webhook anomaly counters. */
const WEBHOOK_ANOMALY_COUNTER_DEFAULTS = Object.freeze({
	maxTrackedKeys: 4096,
	ttlMs: 216e5,
	logEvery: 25
});
/** HTTP status codes counted as anomalous webhook request outcomes. */
const WEBHOOK_ANOMALY_STATUS_CODES = Object.freeze([
	400,
	401,
	408,
	413,
	415,
	429
]);
/** Create a simple fixed-window rate limiter for in-memory webhook protection. */
function createFixedWindowRateLimiter(options) {
	const windowMs = resolveIntegerOption(options.windowMs, WEBHOOK_RATE_LIMIT_DEFAULTS.windowMs, { min: 1 });
	const maxRequests = resolveIntegerOption(options.maxRequests, WEBHOOK_RATE_LIMIT_DEFAULTS.maxRequests, { min: 1 });
	const maxTrackedKeys = resolveIntegerOption(options.maxTrackedKeys, WEBHOOK_RATE_LIMIT_DEFAULTS.maxTrackedKeys, { min: 1 });
	const pruneIntervalMs = resolveIntegerOption(options.pruneIntervalMs, windowMs, { min: 1 });
	const state = /* @__PURE__ */ new Map();
	let lastPruneMs = 0;
	const touch = (key, value) => {
		state.delete(key);
		state.set(key, value);
	};
	const prune = (nowMs) => {
		for (const [key, entry] of state) if (nowMs - entry.windowStartMs >= windowMs) state.delete(key);
	};
	return {
		isRateLimited: (key, nowMs = Date.now()) => {
			if (!key) return false;
			if (nowMs - lastPruneMs >= pruneIntervalMs) {
				prune(nowMs);
				lastPruneMs = nowMs;
			}
			const existing = state.get(key);
			if (!existing || nowMs - existing.windowStartMs >= windowMs) {
				touch(key, {
					count: 1,
					windowStartMs: nowMs
				});
				pruneMapToMaxSize(state, maxTrackedKeys);
				return false;
			}
			const nextCount = existing.count + 1;
			touch(key, {
				count: nextCount,
				windowStartMs: existing.windowStartMs
			});
			pruneMapToMaxSize(state, maxTrackedKeys);
			return nextCount > maxRequests;
		},
		size: () => state.size,
		clear: () => {
			state.clear();
			lastPruneMs = 0;
		}
	};
}
/** Count keyed events in memory with optional TTL pruning and bounded cardinality. */
function createBoundedCounter(options) {
	const maxTrackedKeys = resolveIntegerOption(options.maxTrackedKeys, WEBHOOK_ANOMALY_COUNTER_DEFAULTS.maxTrackedKeys, { min: 1 });
	const ttlMs = resolveIntegerOption(options.ttlMs, 0, { min: 0 });
	const pruneIntervalMs = resolveIntegerOption(options.pruneIntervalMs, ttlMs > 0 ? ttlMs : 6e4, { min: 1 });
	const counters = /* @__PURE__ */ new Map();
	let lastPruneMs = 0;
	const touch = (key, value) => {
		counters.delete(key);
		counters.set(key, value);
	};
	const isExpired = (entry, nowMs) => ttlMs > 0 && nowMs - entry.updatedAtMs >= ttlMs;
	const prune = (nowMs) => {
		if (ttlMs > 0) {
			for (const [key, entry] of counters) if (isExpired(entry, nowMs)) counters.delete(key);
		}
	};
	return {
		increment: (key, nowMs = Date.now()) => {
			if (!key) return 0;
			if (nowMs - lastPruneMs >= pruneIntervalMs) {
				prune(nowMs);
				lastPruneMs = nowMs;
			}
			const existing = counters.get(key);
			const nextCount = (existing && !isExpired(existing, nowMs) ? existing.count : 0) + 1;
			touch(key, {
				count: nextCount,
				updatedAtMs: nowMs
			});
			pruneMapToMaxSize(counters, maxTrackedKeys);
			return nextCount;
		},
		size: () => counters.size,
		clear: () => {
			counters.clear();
			lastPruneMs = 0;
		}
	};
}
/** Track repeated webhook failures and emit sampled logs for suspicious request patterns. */
function createWebhookAnomalyTracker(options) {
	const maxTrackedKeys = resolveIntegerOption(options?.maxTrackedKeys, WEBHOOK_ANOMALY_COUNTER_DEFAULTS.maxTrackedKeys, { min: 1 });
	const ttlMs = resolveIntegerOption(options?.ttlMs, WEBHOOK_ANOMALY_COUNTER_DEFAULTS.ttlMs, { min: 0 });
	const logEvery = resolveIntegerOption(options?.logEvery, WEBHOOK_ANOMALY_COUNTER_DEFAULTS.logEvery, { min: 1 });
	const trackedStatusCodes = new Set(options?.trackedStatusCodes ?? WEBHOOK_ANOMALY_STATUS_CODES);
	const counter = createBoundedCounter({
		maxTrackedKeys,
		ttlMs
	});
	return {
		record: ({ key, statusCode, message, log, nowMs }) => {
			if (!trackedStatusCodes.has(statusCode)) return 0;
			const next = counter.increment(key, nowMs);
			if (log && (next === 1 || next % logEvery === 0)) log(message(next));
			return next;
		},
		size: () => counter.size(),
		clear: () => counter.clear()
	};
}
//#endregion
//#region src/plugin-sdk/webhook-ingress.ts
function resolveRequestClientIp(req, trustedProxies, allowRealIpFallback = false) {
	return getPluginRuntimeGatewayRequestScope()?.client?.clientIp ?? resolveRequestClientIpFromHeaders(req, trustedProxies, allowRealIpFallback);
}
//#endregion
export { createBoundedCounter as a, WEBHOOK_RATE_LIMIT_DEFAULTS as i, WEBHOOK_ANOMALY_COUNTER_DEFAULTS as n, createFixedWindowRateLimiter as o, WEBHOOK_ANOMALY_STATUS_CODES as r, createWebhookAnomalyTracker as s, resolveRequestClientIp as t };
