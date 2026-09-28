import { M as resolveNonNegativeIntegerOption } from "./number-coercion-CLj0HTDM.mjs";
import { i as resolveGlobalSingleton } from "./global-singleton-Dc_stLtU.mjs";
import { t as pruneMapToMaxSize } from "./map-size-CNcWiFKu.mjs";
//#region src/infra/dedupe.ts
/** Creates a bounded in-memory dedupe cache with optional TTL expiry. */
function createDedupeCache(options) {
	const ttlMs = resolveNonNegativeIntegerOption(options.ttlMs, 0);
	const maxSize = resolveNonNegativeIntegerOption(options.maxSize, 0);
	const cache = /* @__PURE__ */ new Map();
	let oldestRecordedAt = Number.POSITIVE_INFINITY;
	let newestRecordedAt = Number.NEGATIVE_INFINITY;
	let timestampsOrdered = true;
	const prune = (now) => {
		const cutoff = ttlMs > 0 ? now - ttlMs : void 0;
		if (cutoff !== void 0 && cutoff >= oldestRecordedAt) {
			oldestRecordedAt = Number.POSITIVE_INFINITY;
			for (const [entryKey, entry] of cache) if (entry.recordedAt <= cutoff) cache.delete(entryKey);
			else if (entry.recordedAt < oldestRecordedAt) {
				oldestRecordedAt = entry.recordedAt;
				if (timestampsOrdered) break;
			}
		}
		if (maxSize <= 0) {
			cache.clear();
			oldestRecordedAt = Number.POSITIVE_INFINITY;
			return;
		}
		pruneMapToMaxSize(cache, maxSize);
	};
	const hasUnexpired = (key, now, touchOnRead) => {
		const existing = cache.get(key);
		if (!existing) return false;
		if (ttlMs > 0 && now - existing.recordedAt >= ttlMs) {
			cache.delete(key);
			return false;
		}
		if (touchOnRead) {
			existing.recordedAt = now;
			cache.delete(key);
			cache.set(key, existing);
		}
		return true;
	};
	return {
		check: (key, now, ownerToken) => {
			if (!key) return false;
			const checkedAt = now ?? Date.now();
			if (ttlMs > 0) {
				if (checkedAt < oldestRecordedAt) oldestRecordedAt = checkedAt;
				if (timestampsOrdered) {
					timestampsOrdered = checkedAt >= newestRecordedAt;
					newestRecordedAt = checkedAt;
				}
			}
			if (hasUnexpired(key, checkedAt, true)) return true;
			cache.set(key, {
				recordedAt: checkedAt,
				...ownerToken ? { ownerToken } : {}
			});
			prune(checkedAt);
			return false;
		},
		peek: (key, now = Date.now()) => {
			if (!key) return false;
			return hasUnexpired(key, now, false);
		},
		delete: (key, ownerToken) => {
			if (!key) return;
			if (ownerToken && cache.get(key)?.ownerToken !== ownerToken) return;
			cache.delete(key);
		},
		clear: () => {
			cache.clear();
			oldestRecordedAt = Number.POSITIVE_INFINITY;
			newestRecordedAt = Number.NEGATIVE_INFINITY;
			timestampsOrdered = true;
		},
		size: () => cache.size
	};
}
/** Resolves a process-global dedupe cache for hot paths that can load this module twice. */
function resolveGlobalDedupeCache(key, options) {
	return resolveGlobalSingleton(key, () => createDedupeCache(options));
}
//#endregion
export { resolveGlobalDedupeCache as n, createDedupeCache as t };
