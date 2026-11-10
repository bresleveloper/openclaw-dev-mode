import { D as resolveExpiresAtMsFromDurationMs, g as isFutureDateTimestampMs, o as asDateTimestampMs } from "./number-coercion-CkhMiRw8.mjs";
import { r as normalizeProviderId } from "./provider-id-D1VImdKk.mjs";
import { E as isModelScopedCooldownReason, M as resolveProfileUnusableUntil, S as isActiveUnusableWindow, w as isBlockedWindowActiveForModel } from "./user-model-account-authority-DFFjC5J5.mjs";
//#region src/agents/auth-profiles/usage-failure-state.ts
function resolveUsageWindowUntil(now, durationMs) {
	if (!Number.isFinite(durationMs) || durationMs <= 0) return now;
	return resolveExpiresAtMsFromDurationMs(Math.max(1, Math.floor(durationMs)), { nowMs: now }) ?? now;
}
/** Returns the regular transient-failure cooldown duration for an error count. */
function calculateAuthProfileCooldownMs(errorCount) {
	const normalized = Math.max(1, errorCount);
	if (normalized <= 1) return 3e4;
	if (normalized <= 2) return 6e4;
	return 3e5;
}
const FAILURE_WINDOW_MS = 864e5;
const FAILURE_BACKOFF_POLICIES = {
	billing: {
		baseMs: 6e5,
		maxMs: 864e5
	},
	auth_permanent: {
		baseMs: 6e5,
		maxMs: 36e5
	}
};
function calculateCappedExponentialBackoffMs(params) {
	const normalized = Math.max(1, params.errorCount);
	const baseMs = Math.max(1, params.baseMs);
	const maxMs = Math.max(baseMs, params.maxMs);
	const maxExponent = Math.max(0, Math.ceil(Math.log2(maxMs / baseMs)));
	const raw = baseMs * 2 ** Math.min(normalized - 1, maxExponent);
	return Math.min(maxMs, raw);
}
function resolveNextCooldownModel(existing, now, reason, modelId) {
	if (!isModelScopedCooldownReason(reason)) return;
	if (!isActiveUnusableWindow(existing.cooldownUntil, now)) return modelId;
	const previousModel = existing.cooldownModel;
	return !previousModel || previousModel === modelId ? previousModel : void 0;
}
/**
* Provider timing alone bounds a rate limit: there is no local counter, backoff or
* cap. A later provider deadline extends the shared window; an earlier one cannot
* shorten it. Without usable timing the profile stays available, and
* lastRateLimitAt lets session recovery return to it after a fallback.
*/
function computeRateLimitUsageStats(params) {
	const { existing, now } = params;
	const providerUntil = resolveUsageWindowUntil(now, params.retryAfterMs ?? 0);
	if (providerUntil <= now) return {
		...existing,
		lastRateLimitAt: now
	};
	const activeUntil = isActiveUnusableWindow(existing.cooldownUntil, now) ? existing.cooldownUntil ?? 0 : 0;
	return {
		...existing,
		lastRateLimitAt: now,
		cooldownUntil: Math.max(activeUntil, providerUntil),
		cooldownReason: "rate_limit",
		cooldownClassification: void 0,
		cooldownModel: resolveNextCooldownModel(existing, now, "rate_limit", params.modelId)
	};
}
function computeNextProfileUsageStats(params) {
	if (params.reason === "rate_limit") return params.existing.blockedReason === "subscription_limit" && isBlockedWindowActiveForModel(params.existing, params.now, params.modelId ?? null) ? params.existing : computeRateLimitUsageStats(params);
	const windowExpired = typeof params.existing.lastFailureAt === "number" && params.existing.lastFailureAt > 0 && params.now - params.existing.lastFailureAt > FAILURE_WINDOW_MS;
	const unusableUntil = resolveProfileUnusableUntil(params.existing);
	const previousCooldownExpired = typeof unusableUntil === "number" && params.now >= unusableUntil;
	const shouldResetCounters = windowExpired || previousCooldownExpired;
	const nextErrorCount = (shouldResetCounters ? 0 : params.existing.errorCount ?? 0) + 1;
	const failureCounts = shouldResetCounters ? {} : { ...params.existing.failureCounts };
	failureCounts[params.reason] = (failureCounts[params.reason] ?? 0) + 1;
	const updatedStats = {
		...params.existing,
		cooldownClassification: void 0,
		errorCount: nextErrorCount,
		failureCounts,
		lastFailureAt: params.now
	};
	const disabledFailureReason = params.reason === "billing" || params.reason === "auth_permanent" ? params.reason : null;
	const backoffMs = disabledFailureReason ? calculateCappedExponentialBackoffMs({
		errorCount: failureCounts[disabledFailureReason] ?? 1,
		...FAILURE_BACKOFF_POLICIES[disabledFailureReason]
	}) : calculateAuthProfileCooldownMs(nextErrorCount);
	const window = disabledFailureReason ? "disabledUntil" : "cooldownUntil";
	const existingUntil = params.existing[window];
	const recomputedUntil = resolveUsageWindowUntil(params.now, backoffMs);
	updatedStats[window] = typeof existingUntil === "number" && Number.isFinite(existingUntil) && existingUntil > params.now ? existingUntil : recomputedUntil;
	if (disabledFailureReason) updatedStats.disabledReason = disabledFailureReason;
	else {
		updatedStats.cooldownReason = params.reason;
		updatedStats.cooldownModel = resolveNextCooldownModel(params.existing, params.now, params.reason, params.modelId);
	}
	return updatedStats;
}
//#endregion
//#region src/agents/auth-profiles/usage-reduction.ts
function isSameWhamCredential(expected, current) {
	return expected.type === "oauth" && current?.type === "oauth" && normalizeProviderId(expected.provider) === normalizeProviderId(current.provider) && expected.access === current.access && expected.accountId === current.accountId;
}
function resolveActiveWindowUntil(value, now) {
	const timestampMs = asDateTimestampMs(value);
	return timestampMs !== void 0 && timestampMs > now ? timestampMs : 0;
}
function applyWhamCooldownResult(params) {
	const existingActiveCooldownUntil = resolveActiveWindowUntil(params.existing.cooldownUntil, params.now);
	const existingActiveBlockedUntil = resolveActiveWindowUntil(params.existing.blockedUntil, params.now);
	if (params.whamResult.blockedUntil) return {
		...params.computed,
		lastProbeAt: params.now,
		blockedUntil: Math.max(existingActiveBlockedUntil, params.whamResult.blockedUntil),
		blockedReason: "subscription_limit",
		blockedSource: "wham",
		blockedModel: void 0,
		blockedScope: void 0,
		cooldownUntil: void 0,
		cooldownReason: void 0,
		cooldownClassification: void 0,
		cooldownModel: void 0
	};
	const { cooldownClassification } = params.whamResult;
	if (!cooldownClassification && (params.reason === "rate_limit" || !params.whamResult.available && params.computed.blockedReason === "subscription_limit" && isBlockedWindowActiveForModel(params.computed, params.now))) return {
		...params.computed,
		lastProbeAt: params.now
	};
	return {
		...params.computed,
		lastProbeAt: params.now,
		cooldownUntil: Math.max(existingActiveCooldownUntil, resolveUsageWindowUntil(params.now, params.whamResult.cooldownMs)),
		cooldownReason: cooldownClassification ? cooldownClassification === "wham_token_expired" ? "auth" : "auth_permanent" : params.computed.cooldownReason,
		cooldownClassification,
		cooldownModel: cooldownClassification ? void 0 : params.computed.cooldownModel
	};
}
function matchesWhamBlockGeneration(stats, generation) {
	return stats?.blockedUntil === generation?.blockedUntil && stats?.blockedReason === generation?.blockedReason && stats?.blockedSource === generation?.blockedSource && stats?.blockedModel === generation?.blockedModel && stats?.blockedScope === generation?.blockedScope && stats?.lastProbeAt === generation?.lastProbeAt && stats?.lastFailureAt === generation?.lastFailureAt && stats?.lastRateLimitAt === generation?.lastRateLimitAt;
}
function reconcileWhamBlock(stats, result, now) {
	return {
		...stats,
		blockedUntil: result.blockedUntil,
		blockedReason: result.available ? void 0 : "subscription_limit",
		blockedSource: result.available ? void 0 : "wham",
		blockedModel: result.available ? void 0 : stats.blockedModel,
		blockedScope: result.available ? void 0 : stats.blockedScope,
		...stats.cooldownReason === "rate_limit" && isBlockedWindowActiveForModel(stats, now, stats.cooldownModel ?? null) ? {
			cooldownUntil: void 0,
			cooldownReason: void 0,
			cooldownClassification: void 0,
			cooldownModel: void 0
		} : {}
	};
}
/** Both writers reduce their current row using the same prepared provider observation. */
function reduceAuthProfileFailure(profile, previousStats, input, now) {
	if (!profile || profile.setup?.replacement) return;
	const { expectedProfile, reason, modelId, retryAfterMs, whamResult, observedProfile, blockGeneration } = input;
	const currentWhamResult = whamResult && input.probeEligible && profile.type === "oauth" && isFutureDateTimestampMs(profile.expires, { nowMs: now }) && isSameWhamCredential(expectedProfile, profile) && (!whamResult.available && !whamResult.blockedUntil || observedProfile && isSameWhamCredential(expectedProfile, observedProfile) && matchesWhamBlockGeneration(previousStats, blockGeneration)) ? whamResult : null;
	if (reason === "no_error_details" && !currentWhamResult) return;
	const existing = currentWhamResult?.available && previousStats?.blockedReason === "subscription_limit" ? reconcileWhamBlock(previousStats, currentWhamResult, now) : previousStats ?? {};
	const computed = computeNextProfileUsageStats({
		existing,
		now,
		reason,
		modelId,
		retryAfterMs
	});
	return currentWhamResult ? applyWhamCooldownResult({
		existing,
		computed,
		now,
		reason,
		whamResult: currentWhamResult
	}) : computed;
}
//#endregion
export { resolveActiveWindowUntil as a, reduceAuthProfileFailure as i, matchesWhamBlockGeneration as n, computeNextProfileUsageStats as o, reconcileWhamBlock as r, resolveUsageWindowUntil as s, isSameWhamCredential as t };
