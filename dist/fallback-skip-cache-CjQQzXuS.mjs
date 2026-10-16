import { C as parseStrictNonNegativeInteger } from "./number-coercion-CuVhdCBs.mjs";
import "./model-ref-shared-KBg0y299.mjs";
import { t as modelKey } from "./model-key-5zORvMDY.mjs";
//#region src/agents/fallback-skip-cache.ts
const DEFAULT_FALLBACK_SKIP_TTL_MS = 0;
const FALLBACK_SKIP_TTL_ENV = "OPENCLAW_FALLBACK_SKIP_TTL_MS";
const FALLBACK_SKIP_TTL_MIN_MS = 1e3;
const FALLBACK_SKIP_TTL_MAX_MS = 6e5;
function resolveConfiguredSkipTtlMs(env = process.env) {
	const parsed = parseStrictNonNegativeInteger(env[FALLBACK_SKIP_TTL_ENV]);
	if (parsed === void 0) return DEFAULT_FALLBACK_SKIP_TTL_MS;
	if (parsed === 0) return 0;
	return Math.min(FALLBACK_SKIP_TTL_MAX_MS, Math.max(FALLBACK_SKIP_TTL_MIN_MS, parsed));
}
const GLOBAL_PRUNE_INTERVAL_MS = 5e3;
function getState() {
	const globalStore = globalThis;
	return globalStore.openclawFallbackSkipCacheState ??= {
		buckets: /* @__PURE__ */ new Map(),
		lastGlobalPruneAtMs: 0
	};
}
function candidateKey(provider, model, authScope) {
	return JSON.stringify([modelKey(provider, model), authScope?.trim() || null]);
}
function pruneExpired(bucket, now) {
	for (const [key, entry] of bucket.entries()) if (entry.expiresAtMs <= now) bucket.delete(key);
}
function pruneAllExpired(now) {
	const state = getState();
	if (now - state.lastGlobalPruneAtMs < GLOBAL_PRUNE_INTERVAL_MS) return;
	state.lastGlobalPruneAtMs = now;
	for (const [sessionId, bucket] of state.buckets.entries()) {
		pruneExpired(bucket, now);
		if (bucket.size === 0) state.buckets.delete(sessionId);
	}
}
function markFallbackCandidateSkipped(params) {
	if (!params.sessionId || !params.provider || !params.model) return;
	const now = params.now ?? Date.now();
	const ttlMs = params.ttlMs ?? resolveConfiguredSkipTtlMs();
	if (ttlMs <= 0) return;
	pruneAllExpired(now);
	const buckets = getState().buckets;
	let bucket = buckets.get(params.sessionId);
	if (!bucket) {
		bucket = /* @__PURE__ */ new Map();
		buckets.set(params.sessionId, bucket);
	}
	bucket.set(candidateKey(params.provider, params.model, params.authScope), {
		expiresAtMs: now + ttlMs,
		reason: params.reason
	});
}
function isFallbackCandidateSkipped(params) {
	if (!params.sessionId || !params.provider || !params.model) return false;
	const now = params.now ?? Date.now();
	pruneAllExpired(now);
	const buckets = getState().buckets;
	const bucket = buckets.get(params.sessionId);
	if (!bucket) return false;
	pruneExpired(bucket, now);
	if (bucket.size === 0) {
		buckets.delete(params.sessionId);
		return false;
	}
	const entry = bucket.get(candidateKey(params.provider, params.model, params.authScope));
	return Boolean(entry && entry.expiresAtMs > now);
}
function getFallbackCandidateSkipReason(params) {
	if (!params.sessionId || !params.provider || !params.model) return;
	const bucket = getState().buckets.get(params.sessionId);
	if (!bucket) return;
	const now = params.now ?? Date.now();
	const entry = bucket.get(candidateKey(params.provider, params.model, params.authScope));
	if (!entry || entry.expiresAtMs <= now) return;
	return entry.reason;
}
//#endregion
export { isFallbackCandidateSkipped as n, markFallbackCandidateSkipped as r, getFallbackCandidateSkipReason as t };
