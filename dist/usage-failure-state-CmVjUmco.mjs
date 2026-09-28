import { D as resolveExpiresAtMsFromDurationMs } from "./number-coercion-CLj0HTDM.mjs";
import { a as isBlockedWindowActiveForModel, f as resolveProfileUnusableUntil, s as isModelScopedCooldownReason } from "./usage-state-Bm5iXGhR.mjs";
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
const RATE_LIMIT_BACKOFF_BASE_MS = 3e4;
const RATE_LIMIT_BACKOFF_MAX_MS = 864e5;
const AUTH_COOLDOWN_CONFIG = {
	billingBackoffMs: 6e5,
	billingMaxMs: 864e5,
	authPermanentBackoffMs: 6e5,
	authPermanentMaxMs: 36e5,
	failureWindowMs: 864e5
};
const DISABLED_FAILURE_BACKOFF_POLICIES = {
	billing: {
		baseMs: AUTH_COOLDOWN_CONFIG.billingBackoffMs,
		maxMs: AUTH_COOLDOWN_CONFIG.billingMaxMs
	},
	auth_permanent: {
		baseMs: AUTH_COOLDOWN_CONFIG.authPermanentBackoffMs,
		maxMs: AUTH_COOLDOWN_CONFIG.authPermanentMaxMs
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
function resolveDisabledFailureBackoffMs(params) {
	return calculateCappedExponentialBackoffMs({
		errorCount: params.errorCount,
		...DISABLED_FAILURE_BACKOFF_POLICIES[params.reason]
	});
}
function keepActiveWindowOrRecompute(params) {
	const { existingUntil, now, recomputedUntil } = params;
	return typeof existingUntil === "number" && Number.isFinite(existingUntil) && existingUntil > now ? existingUntil : recomputedUntil;
}
function computeNextProfileUsageStats(params) {
	if (params.reason === "rate_limit" && params.existing.blockedReason === "subscription_limit" && isBlockedWindowActiveForModel(params.existing, params.now, params.modelId ?? null)) return params.existing;
	const windowMs = AUTH_COOLDOWN_CONFIG.failureWindowMs;
	const windowExpired = typeof params.existing.lastFailureAt === "number" && params.existing.lastFailureAt > 0 && params.now - params.existing.lastFailureAt > windowMs;
	const unusableUntil = resolveProfileUnusableUntil(params.existing);
	const previousCooldownExpired = typeof unusableUntil === "number" && params.now >= unusableUntil;
	const shouldResetAggregateCounter = windowExpired || previousCooldownExpired;
	const nextErrorCount = (shouldResetAggregateCounter ? 0 : params.existing.errorCount ?? 0) + 1;
	const preservedRateLimitCount = params.existing.failureCounts?.rate_limit;
	const failureCounts = shouldResetAggregateCounter ? preservedRateLimitCount ? { rate_limit: preservedRateLimitCount } : {} : { ...params.existing.failureCounts };
	failureCounts[params.reason] = (failureCounts[params.reason] ?? 0) + 1;
	const updatedStats = {
		...params.existing,
		cooldownClassification: void 0,
		errorCount: nextErrorCount,
		failureCounts,
		lastFailureAt: params.now
	};
	const disabledFailureReason = params.reason === "billing" || params.reason === "auth_permanent" ? params.reason : null;
	if (disabledFailureReason) {
		const backoffMs = resolveDisabledFailureBackoffMs({
			reason: disabledFailureReason,
			errorCount: failureCounts[disabledFailureReason] ?? 1
		});
		updatedStats.disabledUntil = keepActiveWindowOrRecompute({
			existingUntil: params.existing.disabledUntil,
			now: params.now,
			recomputedUntil: resolveUsageWindowUntil(params.now, backoffMs)
		});
		updatedStats.disabledReason = disabledFailureReason;
	} else {
		const backoffMs = params.reason === "rate_limit" ? calculateCappedExponentialBackoffMs({
			errorCount: failureCounts.rate_limit ?? 1,
			baseMs: RATE_LIMIT_BACKOFF_BASE_MS,
			maxMs: RATE_LIMIT_BACKOFF_MAX_MS
		}) : calculateAuthProfileCooldownMs(nextErrorCount);
		updatedStats.cooldownUntil = keepActiveWindowOrRecompute({
			existingUntil: params.existing.cooldownUntil,
			now: params.now,
			recomputedUntil: resolveUsageWindowUntil(params.now, backoffMs)
		});
		if (typeof params.existing.cooldownUntil === "number" && params.existing.cooldownUntil > params.now) {
			updatedStats.cooldownReason = params.reason;
			if (params.existing.cooldownModel && params.modelId && params.existing.cooldownModel !== params.modelId) updatedStats.cooldownModel = void 0;
			else if (isModelScopedCooldownReason(params.reason) && !params.modelId && params.existing.cooldownModel) updatedStats.cooldownModel = void 0;
			else if (!isModelScopedCooldownReason(params.reason)) updatedStats.cooldownModel = void 0;
			else updatedStats.cooldownModel = params.existing.cooldownModel;
		} else {
			updatedStats.cooldownReason = params.reason;
			updatedStats.cooldownModel = isModelScopedCooldownReason(params.reason) ? params.modelId : void 0;
		}
	}
	return updatedStats;
}
//#endregion
export { resolveUsageWindowUntil as n, computeNextProfileUsageStats as t };
