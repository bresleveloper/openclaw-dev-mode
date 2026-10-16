import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { o as asDateTimestampMs, s as asFiniteNumber } from "./number-coercion-CuVhdCBs.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { a as coerceSecretRef } from "./types.secrets-DsPRn9Dz.mjs";
import { Jn as string, Lt as boolean, Pn as number, Un as record, Yt as discriminatedUnion, qn as strictObject, xn as literal } from "./schemas-BOYIvvln.mjs";
import { r as normalizeProviderId } from "./provider-id-D1VImdKk.mjs";
import { t as isStringOption } from "./string-readers-V5CfgPTP.mjs";
import { t as GATEWAY_OWNER_PROFILE_ID } from "./user-profile-constants-DfyZS95p.mjs";
import { n as normalizeSecretInput } from "./normalize-secret-input-DBJvdk-L.mjs";
//#region src/state/user-model-account-id.ts
const UUID_PATTERN = "[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}";
const PERSONAL_AUTH_PROFILE_PATTERN = new RegExp(`^personal:(${UUID_PATTERN}|${GATEWAY_OWNER_PROFILE_ID}):${UUID_PATTERN}$`, "u");
function isUserModelAuthProfileId(authProfileId) {
	return parseUserModelAuthProfileId(authProfileId) !== void 0;
}
/** A storage locator only; the live owner and exact credential still need to exist. */
function parseUserModelAuthProfileId(authProfileId) {
	const ownerProfileId = PERSONAL_AUTH_PROFILE_PATTERN.exec(authProfileId)?.[1];
	return ownerProfileId ? { ownerProfileId } : void 0;
}
//#endregion
//#region src/agents/auth-profiles/credential-schema.ts
/** Provider-owned fields retained with OAuth material through storage and refresh. */
const oauthCredentialMetadataSchema = strictObject({
	idToken: string().optional(),
	clientId: string().optional(),
	/** Scope vocabulary approved for this OAuth registration's authorization requests. */
	authorizationScope: string().optional(),
	/** Actual scopes returned by the token endpoint, independent of the requested permissions. */
	grantedScope: string().optional(),
	enterpriseUrl: string().optional(),
	projectId: string().optional(),
	/** Provider-owned identity; issuer/clientId registrations bind their verified subject here. */
	accountId: string().optional(),
	chatgptPlanType: string().optional(),
	/** Non-secret subscription plan captured from external CLI logins. */
	subscriptionType: string().optional(),
	/** Non-secret rate-limit tier captured from external CLI logins. */
	rateLimitTier: string().optional(),
	tokenEndpoint: string().optional(),
	deviceAuthorizationEndpoint: string().optional(),
	issuer: string().optional(),
	authFlow: string().optional()
});
const literalSecretSchema = string().min(1).refine((value) => coerceSecretRef(value) === null, "A literal credential is required.");
const normalizedSecretSchema = string().transform(normalizeSecretInput).pipe(literalSecretSchema);
const commonCredentialFields = {
	provider: string().min(1),
	email: string().optional(),
	displayName: string().optional(),
	/** Explicit copy policy: API keys and static tokens copy by default; OAuth does not. */
	copyToAgents: boolean().optional()
};
/** Current inline credentials, without legacy aliases or host-owned secret references. */
const inlineAuthProfileCredentialSchema = discriminatedUnion("type", [
	strictObject({
		...commonCredentialFields,
		type: literal("api_key"),
		key: normalizedSecretSchema,
		/** Optional provider-specific metadata (e.g., account IDs, gateway IDs). */
		metadata: record(string(), string()).optional()
	}),
	strictObject({
		...commonCredentialFields,
		type: literal("token"),
		token: normalizedSecretSchema,
		/** Optional expiry timestamp (ms since epoch). */
		expires: number().positive().optional()
	}),
	strictObject({
		...commonCredentialFields,
		...oauthCredentialMetadataSchema.shape,
		type: literal("oauth"),
		access: literalSecretSchema,
		refresh: literalSecretSchema,
		expires: number().positive()
	})
]);
//#endregion
//#region src/agents/auth-profiles/usage-state.ts
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
const AUTH_PROFILE_FAILURE_REASONS = new Set(FAILURE_REASON_PRIORITY);
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
		if (until === null) continue;
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
/** Clear each expired window in memory; the next store write persists it. */
function clearExpiredCooldowns(store, now) {
	const usageStats = store.usageStats;
	if (!usageStats) return false;
	const ts = now ?? Date.now();
	const expired = (until) => typeof until === "number" && Number.isFinite(until) && until > 0 && ts >= until;
	let mutated = false;
	for (const [profileId, stats] of Object.entries(usageStats)) {
		if (!stats) continue;
		let profileMutated = false;
		if (expired(stats.cooldownUntil)) {
			stats.cooldownUntil = void 0;
			stats.cooldownReason = void 0;
			stats.cooldownClassification = void 0;
			stats.cooldownModel = void 0;
			profileMutated = true;
		}
		if (expired(stats.blockedUntil)) {
			stats.blockedUntil = void 0;
			stats.blockedReason = void 0;
			stats.blockedSource = void 0;
			stats.blockedModel = void 0;
			stats.blockedScope = void 0;
			profileMutated = true;
		}
		if (expired(stats.disabledUntil)) {
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
		if (!AUTH_PROFILE_FAILURE_REASONS.has(reason) || value <= 0 || !Number.isFinite(value)) return;
		scores.set(reason, (scores.get(reason) ?? 0) + value);
	};
	for (const profileId of params.profileIds) {
		const stats = params.store.usageStats?.[profileId];
		if (!stats) continue;
		if (isActiveUnusableWindow(stats.disabledUntil, now) && stats.disabledReason && AUTH_PROFILE_FAILURE_REASONS.has(stats.disabledReason)) {
			addScore(stats.disabledReason, 1e3);
			continue;
		}
		if (isActiveUnusableWindow(stats.blockedUntil, now)) {
			addScore("rate_limit", 1e3);
			continue;
		}
		if (!isActiveUnusableWindow(stats.cooldownUntil, now)) continue;
		if (stats.cooldownReason && AUTH_PROFILE_FAILURE_REASONS.has(stats.cooldownReason)) {
			addScore(stats.cooldownReason, 1e3);
			continue;
		}
		let recordedReason = false;
		for (const [reason, rawCount] of Object.entries(stats.failureCounts ?? {})) {
			const count = typeof rawCount === "number" ? rawCount : 0;
			if (!isStringOption(reason, AUTH_PROFILE_FAILURE_REASONS) || count <= 0) continue;
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
//#region src/agents/auth-profiles/profile-usage-stats.ts
const AUTH_COOLDOWN_CLASSIFICATIONS = /* @__PURE__ */ new Set(["wham_token_expired", "wham_account_dead"]);
const AUTH_BLOCKED_REASONS = /* @__PURE__ */ new Set(["subscription_limit"]);
const AUTH_BLOCKED_SOURCES = /* @__PURE__ */ new Set(["codex_rate_limits", "wham"]);
function normalizeEnumValue(value, allowed) {
	return isStringOption(value, allowed) ? value : void 0;
}
function normalizeFailureCounts(raw) {
	if (!isRecord(raw)) return;
	const normalized = {};
	for (const [rawReason, count] of Object.entries(raw)) {
		const reason = normalizeEnumValue(rawReason, AUTH_PROFILE_FAILURE_REASONS);
		if (reason === void 0) continue;
		if (typeof count !== "number" || !Number.isFinite(count) || count <= 0) continue;
		normalized[reason] = Math.trunc(count);
	}
	return Object.keys(normalized).length > 0 ? normalized : void 0;
}
/** Normalizes one credential owner's persisted cooldown and usage record. */
function coerceProfileUsageStats(raw) {
	if (!isRecord(raw)) return;
	const cooldownReason = normalizeEnumValue(raw.cooldownReason, AUTH_PROFILE_FAILURE_REASONS);
	const cooldownClassification = normalizeEnumValue(raw.cooldownClassification, AUTH_COOLDOWN_CLASSIFICATIONS);
	const stats = {};
	function setStat(key, value) {
		if (value !== void 0) stats[key] = value;
	}
	setStat("lastUsed", asFiniteNumber(raw.lastUsed));
	setStat("blockedUntil", asFiniteNumber(raw.blockedUntil));
	setStat("blockedReason", normalizeEnumValue(raw.blockedReason, AUTH_BLOCKED_REASONS));
	setStat("blockedSource", normalizeEnumValue(raw.blockedSource, AUTH_BLOCKED_SOURCES));
	setStat("blockedModel", normalizeOptionalString(raw.blockedModel));
	setStat("blockedScope", raw.blockedScope === "model" ? "model" : void 0);
	setStat("cooldownUntil", asFiniteNumber(raw.cooldownUntil));
	setStat("cooldownReason", cooldownReason);
	setStat("cooldownClassification", cooldownClassification === "wham_token_expired" && cooldownReason === "auth" || cooldownClassification === "wham_account_dead" && cooldownReason === "auth_permanent" ? cooldownClassification : void 0);
	setStat("cooldownModel", normalizeOptionalString(raw.cooldownModel));
	setStat("disabledUntil", asFiniteNumber(raw.disabledUntil));
	setStat("disabledReason", normalizeEnumValue(raw.disabledReason, AUTH_PROFILE_FAILURE_REASONS));
	setStat("errorCount", asFiniteNumber(raw.errorCount));
	setStat("failureCounts", normalizeFailureCounts(raw.failureCounts));
	setStat("lastFailureAt", asFiniteNumber(raw.lastFailureAt));
	setStat("lastProbeAt", asFiniteNumber(raw.lastProbeAt));
	return Object.keys(stats).length > 0 ? stats : void 0;
}
//#endregion
export { oauthCredentialMetadataSchema as _, isAuthCooldownBypassedForProvider as a, isModelScopedCooldownReason as c, resetAuthProfileFailureState as d, resolveInlineProviderApiKeyUsageId as f, inlineAuthProfileCredentialSchema as g, resolveProfilesUnavailableReason as h, isActiveUnusableWindow as i, isProfileInCooldown as l, resolveProfileUnusableUntilForDisplay as m, clearExpiredCooldowns as n, isBlockedWindowActiveForModel as o, resolveProfileUnusableUntil as p, getSoonestCooldownExpiry as r, isCooldownScopedToDifferentModel as s, coerceProfileUsageStats as t, readInlineProviderApiKeyUsage as u, isUserModelAuthProfileId as v, parseUserModelAuthProfileId as y };
