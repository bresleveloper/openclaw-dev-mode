import { g as isFutureDateTimestampMs, o as asDateTimestampMs } from "./number-coercion-CuVhdCBs.mjs";
import { r as normalizeProviderId } from "./provider-id-D1VImdKk.mjs";
import { a as isAuthCooldownBypassedForProvider, o as isBlockedWindowActiveForModel } from "./profile-usage-stats-BLwxBqRR.mjs";
import { n as resolveUsageWindowUntil, t as computeNextProfileUsageStats } from "./usage-failure-state-DUw1b0dj.mjs";
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
	if (!cooldownClassification && !params.whamResult.available && (params.computed.cooldownReason === "rate_limit" || params.computed.blockedReason === "subscription_limit" && isBlockedWindowActiveForModel(params.computed, params.now))) return {
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
	return stats?.blockedUntil === generation?.blockedUntil && stats?.blockedReason === generation?.blockedReason && stats?.blockedSource === generation?.blockedSource && stats?.blockedModel === generation?.blockedModel && stats?.blockedScope === generation?.blockedScope && stats?.lastProbeAt === generation?.lastProbeAt && stats?.lastFailureAt === generation?.lastFailureAt && stats?.failureCounts?.rate_limit === generation?.failureCounts?.rate_limit;
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
	if (!profile || profile.setup?.replacement || isAuthCooldownBypassedForProvider(profile.provider)) return;
	const { expectedProfile, reason, modelId, whamResult, observedProfile, blockGeneration } = input;
	const currentWhamResult = whamResult && input.probeEligible && profile.type === "oauth" && isFutureDateTimestampMs(profile.expires, { nowMs: now }) && isSameWhamCredential(expectedProfile, profile) && (!whamResult.available && !whamResult.blockedUntil || observedProfile && isSameWhamCredential(expectedProfile, observedProfile) && matchesWhamBlockGeneration(previousStats, blockGeneration)) ? whamResult : null;
	if (reason === "no_error_details" && !currentWhamResult) return;
	const existing = currentWhamResult?.available && previousStats?.blockedReason === "subscription_limit" ? reconcileWhamBlock(previousStats, currentWhamResult, now) : previousStats ?? {};
	const computed = computeNextProfileUsageStats({
		existing,
		now,
		reason,
		modelId
	});
	return currentWhamResult ? applyWhamCooldownResult({
		existing,
		computed,
		now,
		whamResult: currentWhamResult
	}) : computed;
}
//#endregion
export { resolveActiveWindowUntil as a, reduceAuthProfileFailure as i, matchesWhamBlockGeneration as n, reconcileWhamBlock as r, isSameWhamCredential as t };
