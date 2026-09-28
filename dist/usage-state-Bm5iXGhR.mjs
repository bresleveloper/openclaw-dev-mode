import { o as asDateTimestampMs } from "./number-coercion-CLj0HTDM.mjs";
import { r as normalizeProviderId } from "./provider-id-DCtsDflE.mjs";
//#region src/agents/auth-profiles/usage-state.ts
/**
* Pure cooldown and unusable-window helpers for auth profile usage state.
* Mutation and persistence live in usage.ts; this module owns reusable state
* predicates used by rotation and failure handling.
*/
const FAILURE_REASON_PRIORITY = [
	"auth_permanent",
	"auth",
	"session_expired",
	"billing",
	"format",
	"model_not_found",
	"overloaded",
	"timeout",
	"rate_limit",
	"empty_response",
	"no_error_details",
	"unclassified",
	"unknown"
];
const FAILURE_REASON_SET = new Set(FAILURE_REASON_PRIORITY);
function isAuthProfileFailureReason(reason) {
	return FAILURE_REASON_SET.has(reason);
}
/** Clears failure windows while preserving unrelated usage history. */
function resetAuthProfileFailureState(existing, overrides) {
	return {
		...existing,
		errorCount: 0,
		blockedUntil: void 0,
		blockedReason: void 0,
		blockedSource: void 0,
		blockedModel: void 0,
		blockedScope: void 0,
		cooldownUntil: void 0,
		cooldownReason: void 0,
		cooldownClassification: void 0,
		cooldownModel: void 0,
		disabledUntil: void 0,
		disabledReason: void 0,
		failureCounts: void 0,
		...overrides
	};
}
/** Returns true for providers whose auth-profile cooldowns are provider-managed. */
function isAuthCooldownBypassedForProvider(provider) {
	const normalized = normalizeProviderId(provider ?? "");
	return normalized === "openrouter" || normalized === "kilocode";
}
function resolveInlineProviderApiKeyUsageId(provider) {
	return `inline-api-key:${normalizeProviderId(provider)}`;
}
/** Reads inline-key health using the same identity and bypass policy as its writer. */
function readInlineProviderApiKeyUsage(store, provider) {
	const stats = isAuthCooldownBypassedForProvider(provider) ? void 0 : store.usageStats?.[resolveInlineProviderApiKeyUsageId(provider)];
	return {
		stats,
		unusableUntil: stats ? resolveProfileUnusableUntil(stats) : null
	};
}
/** Returns true when a failure should only cool down the failing model. */
function isModelScopedCooldownReason(reason) {
	return reason === "rate_limit" || reason === "timeout" || reason === "model_not_found";
}
/** Resolves the latest active blocked/cooldown/disabled timestamp for a profile. */
function resolveProfileUnusableUntil(stats, forModel) {
	const values = [
		isBlockScopedToDifferentModel(stats, forModel) ? void 0 : stats.blockedUntil,
		forModel === null && isModelScopedCooldownReason(stats.cooldownReason) && stats.cooldownModel ? void 0 : stats.cooldownUntil,
		stats.disabledUntil
	].map((value) => asDateTimestampMs(value)).filter((value) => value !== void 0 && value > 0);
	return values.length > 0 ? Math.max(...values) : null;
}
/** Returns true when an unusable timestamp is active at the supplied clock time. */
function isActiveUnusableWindow(until, now) {
	const timestamp = asDateTimestampMs(until);
	return timestamp !== void 0 && timestamp > 0 && now < timestamp;
}
function isBlockedWindowActiveForModel(stats, now, forModel) {
	return !isBlockScopedToDifferentModel(stats, forModel) && isActiveUnusableWindow(stats.blockedUntil, now);
}
function isBlockScopedToDifferentModel(stats, forModel) {
	return Boolean((forModel === null || forModel) && stats.blockedScope === "model" && stats.blockedModel && (forModel === null || stats.blockedModel !== forModel));
}
function isCooldownScopedToDifferentModel(stats, forModel) {
	return Boolean((forModel === null || forModel) && isModelScopedCooldownReason(stats.cooldownReason) && stats.cooldownModel && (forModel === null || stats.cooldownModel !== forModel));
}
function shouldBypassModelScopedCooldown(stats, now, forModel) {
	return isCooldownScopedToDifferentModel(stats, forModel) && !isBlockedWindowActiveForModel(stats, now, forModel) && !isActiveUnusableWindow(stats.disabledUntil, now);
}
/**
* Check if a profile is currently in cooldown (due to rate limits, overload, or other transient failures).
*/
function isProfileInCooldown(store, profileId, now, forModel) {
	if (isAuthCooldownBypassedForProvider(store.profiles[profileId]?.provider)) return false;
	const stats = store.usageStats?.[profileId];
	if (!stats) return false;
	const ts = now ?? Date.now();
	if (shouldBypassModelScopedCooldown(stats, ts, forModel)) return false;
	const unusableUntil = resolveProfileUnusableUntil(stats, forModel);
	return unusableUntil ? ts < unusableUntil : false;
}
/**
* Return the soonest `unusableUntil` timestamp (ms epoch) among the given
* profiles, or `null` when no profile has a recorded cooldown. Note: the
* returned timestamp may be in the past if the cooldown has already expired.
*/
function getSoonestCooldownExpiry(store, profileIds, options) {
	const ts = options?.now ?? Date.now();
	let soonest = null;
	let latestMatchingModelCooldown = null;
	for (const id of profileIds) {
		const stats = store.usageStats?.[id];
		if (!stats) continue;
		if (shouldBypassModelScopedCooldown(stats, ts, options?.forModel)) continue;
		const until = resolveProfileUnusableUntil(stats, options?.forModel);
		if (typeof until !== "number" || !Number.isFinite(until) || until <= 0) continue;
		if (options?.forModel && stats.cooldownReason === "rate_limit" && stats.cooldownModel === options.forModel && !isBlockedWindowActiveForModel(stats, ts, options.forModel) && !isActiveUnusableWindow(stats.disabledUntil, ts)) {
			latestMatchingModelCooldown = latestMatchingModelCooldown === null ? until : Math.max(latestMatchingModelCooldown, until);
			continue;
		}
		if (soonest === null || until < soonest) soonest = until;
	}
	if (soonest === null) return latestMatchingModelCooldown;
	if (latestMatchingModelCooldown === null) return soonest;
	return Math.min(soonest, latestMatchingModelCooldown);
}
/**
* Clear expired cooldowns from all profiles in the store.
*
* When `cooldownUntil` or `disabledUntil` has passed, the corresponding fields
* are removed. Most error counters reset so the profile gets a fresh start
* (circuit-breaker half-open -> closed). Rate-limit counters instead persist
* across failed half-open probes so missing provider reset times use capped
* exponential backoff; a successful request or manual clear resets them.
*
* `cooldownUntil` and `disabledUntil` are handled independently: if a profile
* has both and only one has expired, only that field is cleared.
*
* Mutates the in-memory store; disk persistence happens lazily on the next
* store write (e.g. `markAuthProfileSuccess` / `markAuthProfileFailure`), which
* matches the existing save pattern throughout the auth-profiles module.
*
* @returns `true` if any profile was modified.
*/
function clearExpiredCooldowns(store, now) {
	const usageStats = store.usageStats;
	if (!usageStats) return false;
	const ts = now ?? Date.now();
	let mutated = false;
	for (const [profileId, stats] of Object.entries(usageStats)) {
		if (!stats) continue;
		let profileMutated = false;
		const cooldownExpired = typeof stats.cooldownUntil === "number" && Number.isFinite(stats.cooldownUntil) && stats.cooldownUntil > 0 && ts >= stats.cooldownUntil;
		const blockedExpired = typeof stats.blockedUntil === "number" && Number.isFinite(stats.blockedUntil) && stats.blockedUntil > 0 && ts >= stats.blockedUntil;
		const disabledExpired = typeof stats.disabledUntil === "number" && Number.isFinite(stats.disabledUntil) && stats.disabledUntil > 0 && ts >= stats.disabledUntil;
		if (cooldownExpired) {
			stats.cooldownUntil = void 0;
			stats.cooldownReason = void 0;
			stats.cooldownClassification = void 0;
			stats.cooldownModel = void 0;
			profileMutated = true;
		}
		if (blockedExpired) {
			stats.blockedUntil = void 0;
			stats.blockedReason = void 0;
			stats.blockedSource = void 0;
			stats.blockedModel = void 0;
			stats.blockedScope = void 0;
			profileMutated = true;
		}
		if (disabledExpired) {
			stats.disabledUntil = void 0;
			stats.disabledReason = void 0;
			profileMutated = true;
		}
		if (profileMutated && !resolveProfileUnusableUntil(stats)) {
			stats.errorCount = 0;
			const rateLimitFailureCount = stats.failureCounts?.rate_limit;
			stats.failureCounts = rateLimitFailureCount ? { rate_limit: rateLimitFailureCount } : void 0;
		}
		if (profileMutated) {
			usageStats[profileId] = stats;
			mutated = true;
		}
	}
	return mutated;
}
/**
* Infer the most likely reason all candidate profiles are currently unavailable.
*
* We prefer explicit active `disabledReason` values (for example billing/auth)
* over generic cooldown buckets, then fall back to failure-count signals.
*/
function resolveProfilesUnavailableReason(params) {
	const now = params.now ?? Date.now();
	const scores = /* @__PURE__ */ new Map();
	const addScore = (reason, value) => {
		if (!FAILURE_REASON_SET.has(reason) || value <= 0 || !Number.isFinite(value)) return;
		scores.set(reason, (scores.get(reason) ?? 0) + value);
	};
	for (const profileId of params.profileIds) {
		const stats = params.store.usageStats?.[profileId];
		if (!stats) continue;
		if (isActiveUnusableWindow(stats.disabledUntil, now) && stats.disabledReason && FAILURE_REASON_SET.has(stats.disabledReason)) {
			addScore(stats.disabledReason, 1e3);
			continue;
		}
		if (isActiveUnusableWindow(stats.blockedUntil, now)) {
			addScore("rate_limit", 1e3);
			continue;
		}
		if (!isActiveUnusableWindow(stats.cooldownUntil, now)) continue;
		if (stats.cooldownReason && FAILURE_REASON_SET.has(stats.cooldownReason)) {
			addScore(stats.cooldownReason, 1e3);
			continue;
		}
		let recordedReason = false;
		for (const [reason, rawCount] of Object.entries(stats.failureCounts ?? {})) {
			const count = typeof rawCount === "number" ? rawCount : 0;
			if (!isAuthProfileFailureReason(reason) || count <= 0) continue;
			addScore(reason, count);
			recordedReason = true;
		}
		if (!recordedReason) addScore("unknown", 1);
	}
	let best = null;
	let bestScore = -1;
	for (const reason of FAILURE_REASON_PRIORITY) {
		const score = scores.get(reason);
		if (score !== void 0 && score > bestScore) {
			best = reason;
			bestScore = score;
		}
	}
	return best;
}
/** Resolves the display-facing unusable timestamp, honoring provider bypasses. */
function resolveProfileUnusableUntilForDisplay(store, profileId) {
	if (isAuthCooldownBypassedForProvider(store.profiles[profileId]?.provider)) return null;
	const stats = store.usageStats?.[profileId];
	if (!stats) return null;
	return resolveProfileUnusableUntil(stats);
}
//#endregion
export { isBlockedWindowActiveForModel as a, isProfileInCooldown as c, resolveInlineProviderApiKeyUsageId as d, resolveProfileUnusableUntil as f, isAuthCooldownBypassedForProvider as i, readInlineProviderApiKeyUsage as l, resolveProfilesUnavailableReason as m, getSoonestCooldownExpiry as n, isCooldownScopedToDifferentModel as o, resolveProfileUnusableUntilForDisplay as p, isActiveUnusableWindow as r, isModelScopedCooldownReason as s, clearExpiredCooldowns as t, resetAuthProfileFailureState as u };
