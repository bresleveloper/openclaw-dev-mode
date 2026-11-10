import { l as normalizeOptionalString, m as readNonBlankString } from "./string-coerce-1VuiLaaR.mjs";
import { o as asDateTimestampMs, s as asFiniteNumber } from "./number-coercion-CkhMiRw8.mjs";
import { a as resolveGlobalSingleton, r as resolveGlobalMap } from "./global-singleton-DrXvEBww.mjs";
import { t as asBoolean } from "./boolean-CFfzB3ix.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { p as normalizeTrimmedStringList } from "./string-normalization-D6DKCpwE.mjs";
import { a as coerceSecretRef, h as parseSecretRef, l as isLegacySecretRefWithoutProvider } from "./types.secrets-Dgbd2kyP.mjs";
import { r as resolveStateDir } from "./state-dir-C8s3cOPX.mjs";
import "./paths-orClZ-2Z.mjs";
import { t as createSubsystemLogger } from "./subsystem-mStysHHC.mjs";
import { r as normalizeProviderId } from "./provider-id-D1VImdKk.mjs";
import { r as cloneEnvWithPlatformSemantics } from "./config-env-vars-BHneg24Q.mjs";
import { p as resolveDatabasePathKey } from "./sqlite-worker-identity-DLqVBf5J.mjs";
import { o as runWithSqliteCleanup } from "./sqlite-lifecycle-errors-Ca_9goHE.mjs";
import { c as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-D3nUb_uk.mjs";
import { l as getOpenClawDatabaseMaintenanceScope } from "./openclaw-state-db-async-lifecycle-CtHZ7B35.mjs";
import { Jn as string, Lt as boolean, Pn as number, Un as record, Yt as discriminatedUnion, qn as strictObject, xn as literal } from "./schemas-BOYIvvln.mjs";
import { a as captureGatewayStateOwner, c as getStateDatabaseSchemaLease, n as acquireStateDatabaseSchemaLease } from "./gateway-state-owner-X3EqhtYx.mjs";
import { i as sqlPublicationAnchor } from "./sql-connection-DmQzXTVz.mjs";
import { l as getSqliteDatabaseAdmissionIdentityForPath } from "./sqlite-database-admission-CqdNF9iE.mjs";
import { r as hasSqlitePostCommitScope, s as stageSqliteTransactionState, t as deferSqlitePostCommitPublication } from "./sqlite-post-commit-22SfWsLt.mjs";
import { s as registerOpenClawAgentDatabaseReadCandidateResource } from "./openclaw-agent-db-resources-DIwq7LM6.mjs";
import { b as registerOpenClawStateDatabaseLifecycleListener } from "./openclaw-state-db-cache-R1v7ogY0.mjs";
import { i as createSqliteWorkerOperationAdmission, o as observeSqliteWorkerCommittedFacts, p as currentSqliteWorkerOperationAdmission } from "./sqlite-worker-operation-admission-puNZKEvP.mjs";
import { a as readTrackedStateDatabaseIdentity } from "./openclaw-state-db-handle-B6qa1Bui.mjs";
import { o as getRuntimeConfigSnapshot } from "./runtime-snapshot-BBYDJbw9.mjs";
import { a as getSqliteWorkerStateIntegrityAdmission } from "./sqlite-worker-state-context-QuvwmAax.mjs";
import { t as GATEWAY_OWNER_PROFILE_ID } from "./user-profile-constants-DfyZS95p.mjs";
import { i as copyAuthProfileAuthorizationIntent } from "./authorization-lifetime-CLdd1God.mjs";
import { n as normalizeSecretInput } from "./normalize-secret-input-DBJvdk-L.mjs";
import { t as isStringOption } from "./string-readers-V5CfgPTP.mjs";
import { n as loadPluginMetadataSnapshotRuntime, t as getCurrentPluginMetadataSnapshotRequiredRuntime } from "./plugin-metadata-snapshot-required-ylXiwW1c.mjs";
import { r as findOpenClawAgentDatabaseIdentity } from "./openclaw-agent-db-identity-CnM2kzVa.mjs";
import { r as createStateDomainPublication } from "./state-domain-publication-CEKqcWHX.mjs";
import { t as AuthProfileAuthorizationError } from "./authorization-contract-BOF8YHOo.mjs";
import { t as readProfileAuthority } from "./user-profile-authority-BGrgUb8e.mjs";
import { n as captureUserProfileAuthorityRead } from "./user-profile-events-CXjmX5Qy.mjs";
import path from "node:path";
import { isMainThread } from "node:worker_threads";
import { AsyncLocalStorage } from "node:async_hooks";
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
//#region src/agents/auth-profiles/constants.ts
/** Cross-agent lock policy for claiming and settling OAuth generations, not provider I/O. */
const OAUTH_REFRESH_LOCK_OPTIONS = {
	retries: {
		retries: 20,
		factor: 2,
		minTimeout: 100,
		maxTimeout: 1e4,
		randomize: true
	},
	stale: 18e4
};
/** Caller observation deadline; the refresh owner must still durably settle after timeout. */
const OAUTH_REFRESH_CALL_TIMEOUT_MS = 12e4;
/** Freshness window for syncing external CLI auth into auth profiles. */
const EXTERNAL_CLI_SYNC_TTL_MS = 9e5;
const authProfilesLog = createSubsystemLogger("agents/auth-profiles");
/** Post-commit diagnostics cannot replace an acknowledged durable result. */
function reportCommittedInlineAuthFailure(message, error) {
	try {
		authProfilesLog.warn(message, { error });
	} catch {}
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
//#region src/agents/auth-profiles/legacy-oauth-ref.ts
/**
* Legacy OAuth reference recognizer.
* Used by migration/health code to detect older Codex/OpenClaw credential
* sidecar references without accepting arbitrary ref-like objects.
*/
/** Legacy OAuth ref source persisted by older credential stores. */
const LEGACY_OAUTH_REF_SOURCE = "openclaw-credentials";
/** Legacy OAuth ref provider persisted by older credential stores. */
const LEGACY_OAUTH_REF_PROVIDER = "openai-codex";
/** Return true for the legacy OAuth reference shape persisted by older stores. */
function isLegacyOAuthRef(value) {
	if (!isRecord(value)) return false;
	return value.source === LEGACY_OAUTH_REF_SOURCE && value.provider === "openai-codex" && typeof value.id === "string" && /^[a-f0-9]{32}$/.test(value.id);
}
//#endregion
//#region src/agents/auth-profiles/persisted-credential.ts
function normalizeExpiryField(value) {
	if (value === void 0) return;
	return typeof value === "number" && Number.isFinite(value) && value > 0 ? value : 0;
}
function normalizeCredentialMetadata(value) {
	if (!isRecord(value)) return;
	const metadata = {};
	for (const [key, entry] of Object.entries(value)) if (typeof entry === "string") metadata[key] = entry;
	return Object.keys(metadata).length > 0 ? metadata : void 0;
}
function normalizeSavedSetupCredential(value) {
	if (!isRecord(value) || typeof value.replacement !== "boolean") return;
	const modelRef = readNonBlankString(value.modelRef);
	const configJson = readNonBlankString(value.configJson);
	if (!modelRef || !configJson) return;
	const authChoice = readNonBlankString(value.authChoice);
	const pluginId = readNonBlankString(value.pluginId);
	const agentRuntimeId = readNonBlankString(value.agentRuntimeId);
	return {
		replacement: value.replacement,
		modelRef,
		configJson,
		...value.apiKeyHeader === true ? { apiKeyHeader: true } : {},
		...agentRuntimeId ? { agentRuntimeId } : {},
		...authChoice ? { authChoice } : {},
		...pluginId ? { pluginId } : {}
	};
}
function normalizeCommonCredentialFields(entry) {
	const normalized = { provider: typeof entry.provider === "string" ? normalizeProviderId(entry.provider) : "" };
	const setup = normalizeSavedSetupCredential(entry.setup);
	if (setup) normalized.setup = setup;
	const copyToAgents = asBoolean(entry.copyToAgents);
	if (copyToAgents !== void 0) normalized.copyToAgents = copyToAgents;
	for (const field of ["email", "displayName"]) {
		const value = readNonBlankString(entry[field]);
		if (value !== void 0) normalized[field] = value;
	}
	return normalized;
}
function normalizeRawCredentialEntry(entry) {
	const type = entry.type;
	if (type !== "api_key" && type !== "token" && type !== "oauth") return;
	const normalized = {
		type,
		...normalizeCommonCredentialFields(entry)
	};
	if (normalized.type === "api_key") {
		const key = readNonBlankString(entry.key);
		const keyRef = parseSecretRef(entry.keyRef);
		const metadata = normalizeCredentialMetadata(entry.metadata);
		if (keyRef) normalized.keyRef = structuredClone(keyRef);
		else if (key !== void 0) normalized.key = key;
		if (metadata) normalized.metadata = metadata;
	} else if (normalized.type === "token") {
		const token = readNonBlankString(entry.token);
		const tokenRef = parseSecretRef(entry.tokenRef);
		if (token !== void 0) normalized.token = token;
		if (tokenRef) normalized.tokenRef = structuredClone(tokenRef);
	} else if (normalized.type === "oauth") {
		if (isLegacyOAuthRef(entry.oauthRef)) normalized.oauthRef = structuredClone(entry.oauthRef);
		const fields = [
			"access",
			"refresh",
			...oauthCredentialMetadataSchema.keyof().options
		];
		for (const field of fields) {
			const value = readNonBlankString(entry[field]);
			if (value !== void 0) normalized[field] = value;
		}
	}
	if (normalized.type === "token" || normalized.type === "oauth") {
		const expires = normalizeExpiryField(entry.expires);
		if (expires !== void 0) normalized.expires = expires;
	}
	return normalized;
}
/** Secret references persist without their resolved literals; native write intent follows the projection. */
function serializeAuthProfileCredential(credential) {
	if (credential.type === "api_key" && credential.keyRef && credential.key !== void 0) {
		const { key: _key, ...sanitized } = credential;
		copyAuthProfileAuthorizationIntent(credential, sanitized);
		return sanitized;
	}
	if (credential.type === "token" && credential.tokenRef && credential.token !== void 0) {
		const { token: _token, ...sanitized } = credential;
		copyAuthProfileAuthorizationIntent(credential, sanitized);
		return sanitized;
	}
	return credential;
}
//#endregion
//#region src/plugins/provider-availability-policy.ts
/** Reads static provider availability ownership without loading provider runtime. */
function resolveProviderManagesOwnAvailability(providerId) {
	const provider = normalizeProviderId(providerId);
	if (!provider) return false;
	return (getCurrentPluginMetadataSnapshotRequiredRuntime({
		allowScopedSnapshot: true,
		allowWorkspaceScopedSnapshot: true
	}) ?? loadPluginMetadataSnapshotRuntime({ config: getRuntimeConfigSnapshot() ?? {} })).owners.providersManagingOwnAvailability?.has(provider) === true;
}
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
const [blockedFields, cooldownFields, disabledFields] = [
	[
		"blockedUntil",
		"blockedReason",
		"blockedSource",
		"blockedModel",
		"blockedScope"
	],
	[
		"cooldownUntil",
		"cooldownReason",
		"cooldownClassification",
		"cooldownModel"
	],
	["disabledUntil", "disabledReason"]
];
const expiryWindows = [
	cooldownFields,
	blockedFields,
	disabledFields
];
const clearedWindows = Object.fromEntries([
	...blockedFields,
	...cooldownFields,
	...disabledFields
].map((field) => [field, void 0]));
/** Clears failure windows while preserving unrelated usage history. */
function resetAuthProfileFailureState(existing, overrides, successfulModel) {
	return {
		...existing,
		errorCount: 0,
		...clearedWindows,
		failureCounts: void 0,
		lastRateLimitAt: void 0,
		...successfulModel && existing.cooldownModel && existing.cooldownModel !== successfulModel ? {
			cooldownUntil: existing.cooldownUntil,
			lastRateLimitAt: existing.lastRateLimitAt,
			cooldownReason: existing.cooldownReason,
			cooldownClassification: existing.cooldownClassification,
			cooldownModel: existing.cooldownModel,
			errorCount: existing.errorCount,
			failureCounts: existing.failureCounts
		} : {},
		...overrides
	};
}
/** Only provider-managed transient capacity failures bypass the local cooldown. */
function isAuthCooldownBypassedForProvider(provider, reason) {
	return (reason === "rate_limit" || reason === "overloaded") && resolveProviderManagesOwnAvailability(provider ?? "");
}
/** Projects enforced health while preserving stored evidence and permanent failures. */
function readAuthProfileUsageStats(store, profileId) {
	const stats = store.usageStats?.[profileId];
	if (!stats || !isAuthCooldownBypassedForProvider(store.profiles[profileId]?.provider, stats.cooldownReason)) return stats;
	return {
		...stats,
		cooldownUntil: void 0,
		cooldownReason: void 0,
		cooldownClassification: void 0,
		cooldownModel: void 0
	};
}
function resolveInlineProviderApiKeyUsageId(provider) {
	return `inline-api-key:${normalizeProviderId(provider)}`;
}
/** Reads health recorded for the canonical inline API-key identity. */
function readInlineProviderApiKeyUsage(store, provider) {
	const stats = store.usageStats?.[resolveInlineProviderApiKeyUsageId(provider)];
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
	const stats = readAuthProfileUsageStats(store, profileId);
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
		const stats = readAuthProfileUsageStats(store, id);
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
		for (const fields of expiryWindows) if (expired(stats[fields[0]])) {
			for (const field of fields) stats[field] = void 0;
			profileMutated = true;
		}
		if (profileMutated && !resolveProfileUnusableUntil(stats)) {
			stats.errorCount = 0;
			stats.failureCounts = void 0;
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
		const stats = readAuthProfileUsageStats(params.store, profileId);
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
	const stats = readAuthProfileUsageStats(store, profileId);
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
		if (reason === void 0 || reason === "rate_limit") continue;
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
	setStat("lastRateLimitAt", asFiniteNumber(raw.lastRateLimitAt));
	setStat("lastProbeAt", asFiniteNumber(raw.lastProbeAt));
	releaseRetiredRateLimitBackoff(stats, raw.failureCounts);
	return Object.keys(stats).length > 0 ? stats : void 0;
}
/**
* Releases state written by the retired local rate-limit backoff. Only that writer
* persisted `failureCounts.rate_limit`, so its rate-limit window has no provider
* basis; the next provider-timed failure records a fresh one. The count survives
* only as the session-recovery fact it also served.
*/
function releaseRetiredRateLimitBackoff(stats, rawCounts) {
	const legacyCount = isRecord(rawCounts) ? asFiniteNumber(rawCounts.rate_limit) : void 0;
	if (legacyCount === void 0 || legacyCount <= 0) return;
	stats.lastRateLimitAt ??= stats.lastFailureAt ?? 0;
	if (stats.cooldownReason === "rate_limit") {
		delete stats.cooldownUntil;
		delete stats.cooldownReason;
		delete stats.cooldownClassification;
		delete stats.cooldownModel;
		delete stats.errorCount;
	}
}
//#endregion
//#region src/agents/auth-profiles/state-normalization.ts
function normalizeAuthProfileEntries(raw, normalizeKey, normalizeValue) {
	if (!isRecord(raw)) return;
	const normalized = {};
	for (const [rawKey, rawValue] of Object.entries(raw)) {
		const key = normalizeKey(rawKey);
		const value = normalizeValue(rawValue);
		if (!key || value === void 0) continue;
		normalized[key] = value;
	}
	return Object.keys(normalized).length > 0 ? normalized : void 0;
}
/** Coerces persisted auth profile runtime state into the current shape. */
function coerceAuthProfileState(raw) {
	if (!isRecord(raw)) return {};
	return {
		order: normalizeAuthProfileEntries(raw.order, normalizeProviderId, (value) => {
			const ids = Array.isArray(value) ? normalizeTrimmedStringList(value) : [];
			return ids.length > 0 ? ids : void 0;
		}),
		lastGood: normalizeAuthProfileEntries(raw.lastGood, normalizeProviderId, normalizeOptionalString),
		usageStats: normalizeAuthProfileEntries(raw.usageStats, normalizeOptionalString, coerceProfileUsageStats)
	};
}
//#endregion
//#region src/agents/auth-profiles/persisted-store.ts
const AUTH_PROFILE_TYPES = /* @__PURE__ */ new Set([
	"api_key",
	"oauth",
	"token"
]);
function parseCredentialEntry(raw, fallbackProvider) {
	if (!isRecord(raw)) return {
		ok: false,
		reason: "non_object"
	};
	const typed = normalizeRawCredentialEntry(raw);
	if (!typed) return {
		ok: false,
		reason: "invalid_type"
	};
	const provider = typed.provider || (typeof fallbackProvider === "string" ? normalizeProviderId(fallbackProvider) : "");
	if (!provider) return {
		ok: false,
		reason: "missing_provider"
	};
	return {
		ok: true,
		credential: {
			...typed,
			provider
		}
	};
}
/** Parses canonical credential fields without importing retired encodings. */
function parseAuthProfileCredential(raw, fallbackProvider) {
	const parsed = parseCredentialEntry(raw, fallbackProvider);
	return parsed.ok ? parsed.credential : null;
}
function warnRejectedCredentialEntries(source, rejected) {
	if (rejected.length === 0) return;
	const reasons = rejected.reduce((acc, current) => {
		acc[current.reason] = (acc[current.reason] ?? 0) + 1;
		return acc;
	}, {});
	authProfilesLog.warn("ignored invalid auth profile entries during store load", {
		source,
		dropped: rejected.length,
		reasons,
		...reasons.invalid_type ? { validTypes: [...AUTH_PROFILE_TYPES] } : {},
		keys: rejected.slice(0, 10).map((entry) => entry.key)
	});
}
/** Coerces a persisted auth profile store payload into the current store shape. */
function coercePersistedAuthProfileStore(raw) {
	if (!isRecord(raw)) return null;
	const record = raw;
	if (!isRecord(record.profiles)) return null;
	const profiles = record.profiles;
	const normalized = {};
	const rejected = [];
	for (const [key, value] of Object.entries(profiles)) {
		const declaredType = isRecord(value) ? Object.hasOwn(value, "type") ? value.type : value.mode : void 0;
		if ((declaredType === "apiKey" || declaredType === "api_key" || declaredType === "token" || declaredType === "oauth") && isRecord(value) && typeof value.provider === "string" && normalizeProviderId(value.provider) && (!Object.hasOwn(value, "type") || value.type === "apiKey" || declaredType === "api_key" && isLegacySecretRefWithoutProvider(value.keyRef) || declaredType === "token" && isLegacySecretRefWithoutProvider(value.tokenRef) || declaredType === "api_key" && !coerceSecretRef(value.keyRef) && (isRecord(value.key) && coerceSecretRef(value.key) !== null || !readNonBlankString(value.key) && !coerceSecretRef(value.key) && (readNonBlankString(value.apiKey) !== void 0 || coerceSecretRef(value.apiKey) !== null || readNonBlankString(value.api_key) !== void 0 || coerceSecretRef(value.api_key) !== null)) || declaredType === "token" && !coerceSecretRef(value.tokenRef) && isRecord(value.token) && coerceSecretRef(value.token) !== null)) throw new Error("Auth profile credential fields require migration; run openclaw doctor --fix.");
		const parsed = parseCredentialEntry(value);
		if (!parsed.ok) {
			rejected.push({
				key,
				reason: parsed.reason
			});
			continue;
		}
		normalized[key] = parsed.credential;
	}
	warnRejectedCredentialEntries("auth-profiles.json", rejected);
	const version = Number(record.version ?? 1);
	return {
		version: Number.isFinite(version) && version > 0 ? version : 1,
		profiles: normalized,
		...coerceAuthProfileState(record)
	};
}
//#endregion
//#region src/agents/auth-profiles/runtime-scope.ts
const authProfileRuntimeMode = new AsyncLocalStorage();
const workerAuthProfileWrites = resolveGlobalSingleton(Symbol.for("openclaw.workerAuthProfileWrites"), () => new AsyncLocalStorage());
/** The request's work owner admits writes and closes this adapter after settlement. */
function withWorkerAuthProfileWrites(env, work, run) {
	if (isMainThread) throw new Error("Native auth writes require a worker-owned request");
	const ownedEnv = cloneEnvWithPlatformSemantics(env);
	const stateDir = path.resolve(resolveStateDir(ownedEnv));
	const databasePath = resolveOpenClawStateSqlitePath(ownedEnv);
	const canonicalPath = resolveDatabasePathKey(databasePath);
	return workerAuthProfileWrites.run({
		env: ownedEnv,
		assertOwner: (currentEnv) => {
			if (path.resolve(resolveStateDir(currentEnv)) !== stateDir) throw new Error("Native auth write differs from its worker state owner");
		},
		run: (operation) => work.track(operation),
		runSync: (currentPath, operation) => {
			if (currentPath !== databasePath && currentPath !== canonicalPath) throw new Error("Native auth write differs from its worker state owner");
			return work.run(operation);
		}
	}, run);
}
function getWorkerAuthProfileWrites() {
	return workerAuthProfileWrites.getStore();
}
function assertPersonalAuthProfileRuntime() {
	if (authProfileRuntimeMode.getStore()) throw new Error("Personal model accounts are unavailable in an isolated auth-store scope.");
}
//#endregion
//#region src/agents/auth-profiles/credential-write-custody.ts
const retainedTransactions = resolveGlobalSingleton(Symbol.for("openclaw.authProfileCredentialWriteCustody"), () => /* @__PURE__ */ new WeakMap());
/** Reuse native custody; standalone SDK callers take the existing exclusive offline lease. */
function withAuthProfileCredentialOwner(databasePath, operation, database) {
	const retained = database && retainedTransactions.get(sqlPublicationAnchor(database));
	if (retained) {
		if (retained.unknown) throw new Error("Auth profile credential write outcome is unknown; restart its owner");
		return retained.lease.run(operation);
	}
	const admission = currentSqliteWorkerOperationAdmission.getStore();
	if (admission) {
		const owner = getSqliteWorkerStateIntegrityAdmission()?.identity;
		const target = databasePath === owner?.canonicalPath ? owner : getSqliteDatabaseAdmissionIdentityForPath(databasePath);
		if (!admission.active || !owner || target?.key !== owner.key || target?.birthtime !== owner.birthtime) throw new Error("Auth profile credential writes require an admitted worker");
		return operation();
	}
	const catalog = getWorkerAuthProfileWrites();
	if (catalog) return catalog.runSync(databasePath, operation);
	const maintenance = getOpenClawDatabaseMaintenanceScope();
	if (maintenance?.ownsSchemaMaintenance) {
		maintenance.assertDatabaseAccess(databasePath);
		return operation();
	}
	if (getStateDatabaseSchemaLease(databasePath) || captureGatewayStateOwner(databasePath)) return operation();
	if (!isMainThread) throw new Error("Auth profile credential writes require an admitted worker");
	const lease = acquireStateDatabaseSchemaLease(databasePath);
	let transactionOwnsLease = false;
	const retainTransaction = (db) => {
		if (!hasSqlitePostCommitScope(sqlPublicationAnchor(db))) return;
		const owner = {
			lease,
			unknown: false
		};
		const release = () => {
			retainedTransactions.delete(sqlPublicationAnchor(db));
			lease.release();
		};
		transactionOwnsLease = stageSqliteTransactionState(sqlPublicationAnchor(db), {
			stage: () => retainedTransactions.set(sqlPublicationAnchor(db), owner),
			commit() {},
			rollback: release,
			invalidate: () => {
				owner.unknown = true;
			}
		});
		deferSqlitePostCommitPublication(sqlPublicationAnchor(db), release);
	};
	return runWithSqliteCleanup({ release: () => {
		if (!transactionOwnsLease) lease.release();
	} }, "auth profile credential custody", () => lease.run(() => operation(retainTransaction)));
}
/** The native opener captures the shared root, including agents outside the state directory. */
function withAuthProfileCredentialWriteCustody(database, operation) {
	if (database.isTransaction && !hasSqlitePostCommitScope(sqlPublicationAnchor(database))) throw new Error("Credential writes require their owning transaction publication scope");
	const databasePath = findOpenClawAgentDatabaseIdentity({ db: sqlPublicationAnchor(database) })?.ownerDatabasePath ?? readTrackedStateDatabaseIdentity(sqlPublicationAnchor(database))?.canonicalPath;
	if (!databasePath) throw new Error("Auth profile credential database has no captured state owner");
	return withAuthProfileCredentialOwner(databasePath, (retain) => {
		retain?.(database);
		return operation();
	}, database);
}
//#endregion
//#region src/state/user-model-account-authority.ts
const personalCredentialPublication = createStateDomainPublication({
	domain: "personal-model-credentials",
	keyOf: (fact) => fact.id,
	isValue: (value) => isRecord(value) && typeof value.id === "string" && parseUserModelAuthProfileId(value.id) !== void 0 && typeof value.replacement === "boolean" && (value.authorizationId === void 0 || typeof value.authorizationId === "string") && inlineAuthProfileCredentialSchema.safeParse(value.credential).success
});
const owners = resolveGlobalMap(Symbol.for("openclaw.personalCredentialAuthority"), "close-and-restart");
function ownerFor(identity) {
	let owner = owners.get(identity);
	if (!owner) {
		owner = {
			cells: /* @__PURE__ */ new Map(),
			pending: /* @__PURE__ */ new Set(),
			uncertain: false
		};
		owners.set(identity, owner);
	}
	return owner;
}
personalCredentialPublication.subscribeFacts((change) => {
	const identity = change.kind === "committed" ? change.receipt.source.identity : change.identity;
	if (typeof identity !== "string") return;
	const owner = ownerFor(identity);
	if (change.kind === "pending") owner.pending.add(change.operationId);
	else if (change.kind === "settled") owner.pending.delete(change.operationId);
	else if (change.kind === "unknown") {
		owner.uncertain = true;
		owner.cells.clear();
	} else if (change.kind === "committed") for (const [id, fact] of change.receipt.facts) {
		const cell = owner.cells.get(id);
		if (fact.kind !== "postimage") owner.cells.delete(id);
		else if (cell) {
			const next = fact.value.replacement ? { ...cell } : cell;
			next.credential = fact.value.credential;
			next.authorizationId = fact.value.authorizationId;
			next.authorizationObserved = true;
			owner.cells.set(id, next);
		}
	}
});
registerOpenClawStateDatabaseLifecycleListener((event) => {
	if (event.kind !== "opened") {
		if (event.identity) {
			const rootKey = `${event.identity.key}:${event.identity.birthtime ?? ""}`;
			for (const identity of [
				event.identity.key,
				rootKey,
				...owners.get(rootKey)?.sources ?? []
			]) {
				owners.get(identity)?.dispose?.();
				owners.delete(identity);
			}
		} else {
			for (const owner of owners.values()) owner.dispose?.();
			owners.clear();
		}
	}
});
/** The existing identity owner fences merge, including every flattened source alias. */
async function capturePersonalCredentialAuthority(context, profileId) {
	const locator = parseUserModelAuthProfileId(profileId);
	if (!locator) throw new Error("Personal credential authority requires an exact account ID");
	const identity = context.admission.identity.key;
	const owner = ownerFor(identity);
	const identityCurrent = (await captureUserProfileAuthorityRead(context.admission, void 0, "identity")).bind(locator.ownerProfileId);
	if (!identityCurrent) throw new Error("Personal model account ownership changed during preparation; retry");
	let cell = owner.cells.get(profileId);
	if (!cell?.identityCurrent()) {
		cell = {
			identityCurrent,
			identityStatus: () => readProfileAuthority(identityCurrent.transferable)
		};
		owner.cells.set(profileId, cell);
	}
	let retained = cell;
	const assertCurrent = () => {
		if (owners.get(identity) !== owner || owner.cells.get(profileId) !== retained || owner.pending.size || owner.uncertain || !retained.identityCurrent()) throw new Error("Personal model account authority is unavailable; retry after owner recovery");
	};
	assertCurrent();
	return {
		observeAuthorizationId(authorizationId) {
			const current = owner.cells.get(profileId);
			if (current?.authorizationObserved && current.authorizationId === authorizationId) retained = current;
			assertCurrent();
			if (retained.authorizationObserved && retained.authorizationId !== authorizationId) {
				retained = {
					identityCurrent,
					identityStatus: retained.identityStatus
				};
				owner.cells.set(profileId, retained);
			}
			retained.authorizationId = authorizationId;
			retained.authorizationObserved = true;
		},
		assertAuthorizationCurrent(authorizationId) {
			const identityStatus = retained.identityStatus?.();
			if (owners.get(identity) !== owner || owner.cells.get(profileId) !== retained || identityStatus === "revoked" || retained.authorizationObserved && retained.authorizationId !== authorizationId) throw new AuthProfileAuthorizationError("retired");
			if (identityStatus !== "current" || owner.pending.size || owner.uncertain || !retained.authorizationObserved) throw new AuthProfileAuthorizationError("unavailable");
		},
		observe(credential) {
			assertCurrent();
			retained.credential ??= credential && structuredClone(credential);
		},
		readCurrentCredential() {
			assertCurrent();
			return retained.credential && structuredClone(retained.credential);
		}
	};
}
/** Denial starts before dispatch and survives an unacknowledged native outcome. */
function withPersonalCredentialPublication(createAdmission, context) {
	return (operation) => {
		const retained = createAdmission(operation);
		const { admission } = retained;
		const publication = personalCredentialPublication.begin({
			identity: context.admission.identity.key,
			assertCurrent: context.assertPublicationCurrent ?? context.admission.assertCurrent
		});
		observeSqliteWorkerCommittedFacts(admission, ({ facts }) => {
			publication.committed(isRecord(facts) ? facts.personalCredentials : void 0);
		});
		const finish = admission.finish.bind(admission);
		admission.finish = () => {
			try {
				finish();
			} finally {
				if (admission.settlement) {
					const confirmed = admission.settlement.kind === "completed";
					publication.finish(confirmed, confirmed && !admission.committed);
				}
			}
		};
		operation.settled.then((outcome) => {
			const known = outcome.kind !== "unknown";
			publication.finish(known, known && !admission.committed);
		});
		return retained;
	};
}
/** Shared and agent rows use the physical identity already admitted by their database owner. */
const nativeAuthProfileCredentialPublication = createStateDomainPublication({
	domain: "auth-profile-credentials",
	sourceIdentity(db) {
		const shared = readTrackedStateDatabaseIdentity(db);
		if (shared) return `${shared.key}:${shared.birthtime ?? ""}`;
		const agent = findOpenClawAgentDatabaseIdentity({ db: sqlPublicationAnchor(db) });
		if (!agent || typeof agent.identity !== "string") return Symbol("auth-profile-credentials");
		const identity = `file:${agent.identity}:${agent.birthtime ?? ""}`;
		ownerFor(identity).canonicalPath = agent.canonicalPath;
		return identity;
	},
	keyOf: () => "store",
	isValue: (_value) => true
});
const authProfileCredentialPublication = {
	...nativeAuthProfileCredentialPublication,
	bound(receipt) {
		return {
			...nativeAuthProfileCredentialPublication.bound(receipt),
			canonicalPath: typeof receipt.source.identity === "string" ? ownerFor(receipt.source.identity).canonicalPath : void 0
		};
	},
	begin(owner) {
		if (typeof owner.identity === "string" && owner.canonicalPath) ownerFor(owner.identity).canonicalPath = owner.canonicalPath;
		return nativeAuthProfileCredentialPublication.begin(owner);
	}
};
const authCapture = resolveGlobalSingleton(Symbol.for("openclaw.authProfileCredentialCapture"), () => new AsyncLocalStorage());
authProfileCredentialPublication.subscribeFacts((change) => {
	const identity = change.kind === "committed" ? change.receipt.source.identity : change.identity;
	if (typeof identity !== "string") return;
	const owner = ownerFor(identity);
	if (change.kind === "committed" || change.kind === "unknown") authCapture.getStore()?.push(change.kind === "committed" ? authProfileCredentialPublication.bound(change.receipt) : {
		...change,
		canonicalPath: owner.canonicalPath
	});
	const affected = [owner];
	const absentIdentity = `path:${owner.canonicalPath}:`;
	const absent = owner.canonicalPath && owners.get(absentIdentity);
	if (absent) {
		affected.push(absent);
		for (const root of owners.values()) if (root.sources?.has(absentIdentity)) root.sources.add(identity);
	}
	if (change.kind === "pending") for (const target of affected) target.pending.add(change.operationId);
	else if (change.kind === "settled") for (const target of affected) target.pending.delete(change.operationId);
	else if (change.kind === "unknown") for (const target of affected) target.uncertain = true;
	else if (change.kind === "committed") {
		const fact = change.receipt.facts.get("store");
		if (!fact || fact.kind === "unchanged") return;
		if (fact.kind === "unknown") {
			for (const target of affected) target.uncertain = true;
			return;
		}
		const profiles = fact.kind === "postimage" ? coercePersistedAuthProfileStore(fact.value)?.profiles : {};
		if (!profiles) {
			for (const target of affected) target.uncertain = true;
			return;
		}
		for (const target of affected) for (const [id, cell] of target.cells) {
			cell.credential = profiles[id];
			cell.observed = true;
		}
	}
});
/** Deny before the native effect; managed settlement installs all facts before releasing denial. */
function withAuthProfileCredentialWrite(db, payload, write, didWrite = () => true) {
	return withAuthProfileCredentialWriteCustody(db, () => {
		const identity = authProfileCredentialPublication.receipt(sqlPublicationAnchor(db), /* @__PURE__ */ new Map()).source.identity;
		const publication = authProfileCredentialPublication.begin({
			identity,
			assertCurrent() {}
		});
		let failed = false;
		const managed = stageSqliteTransactionState(sqlPublicationAnchor(db), {
			stage() {},
			commit() {
				if (failed) publication.finish(false);
			},
			prepareObservers: () => publication.finish(true, true),
			invalidate: () => publication.finish(false),
			rollback: () => publication.finish(true, true)
		});
		try {
			const result = write();
			if (didWrite(result)) {
				if (payload === void 0) authProfileCredentialPublication.stageDeletions(sqlPublicationAnchor(db), ["store"]);
				else authProfileCredentialPublication.stagePostimages(sqlPublicationAnchor(db), [payload]);
			}
			if (!managed) publication.finish(true, true);
			return result;
		} catch (error) {
			failed = true;
			if (!managed) publication.finish(false);
			throw error;
		}
	});
}
/** Generic shared-state writes publish through their existing request and native receipt. */
function createAuthProfileCredentialWriteAdmission(context) {
	return (operation) => {
		const publication = authProfileCredentialPublication.begin({
			identity: `${context.admission.identity.key}:${context.admission.identity.birthtime ?? ""}`,
			assertCurrent: context.admission.assertCurrent
		});
		const admission = createSqliteWorkerOperationAdmission(() => {
			throw new Error("Machine-state writes do not request separate domain admission");
		});
		observeSqliteWorkerCommittedFacts(admission, ({ facts }) => {
			publication.committed(isRecord(facts) ? facts.authCredentials : void 0);
		});
		const finish = admission.finish.bind(admission);
		admission.finish = () => {
			try {
				finish();
			} finally {
				if (admission.settlement) {
					const confirmed = admission.settlement.kind === "completed";
					publication.finish(confirmed, confirmed && !admission.committed);
				}
			}
		};
		operation.settled.then((outcome) => {
			const known = outcome.kind !== "unknown";
			publication.finish(known, known && !admission.committed);
		});
		return {
			admission,
			nativeLocations: [context.admission.databasePath]
		};
	};
}
function captureAuthProfileCredentialAuthority(context, source, profileId) {
	const rootIdentity = `${context.admission.identity.key}:${context.admission.identity.birthtime ?? ""}`;
	const root = ownerFor(rootIdentity);
	(root.sources ??= /* @__PURE__ */ new Set()).add(source.identity);
	const owner = ownerFor(source.identity);
	if (source.identity !== rootIdentity && !owner.dispose) owner.dispose = registerOpenClawAgentDatabaseReadCandidateResource({
		path: source.databasePath,
		revoke: () => {
			owner.uncertain = true;
		},
		close: async () => {
			owner.dispose?.();
			owners.delete(source.identity);
		}
	});
	let cell = owner.cells.get(profileId);
	if (!cell) {
		cell = { identityCurrent: () => true };
		owner.cells.set(profileId, cell);
	}
	const retained = cell;
	const assertCurrent = () => {
		context.admission.assertCurrent();
		if (owners.get(rootIdentity) !== root || owners.get(source.identity) !== owner || root.pending.size || root.uncertain || owner.pending.size || owner.uncertain) throw new Error("Auth profile credential authority is unavailable; retry after owner recovery");
	};
	return {
		observe(credential) {
			if (!retained.observed) {
				retained.credential = credential && structuredClone(credential);
				retained.observed = true;
			}
		},
		readCurrentCredential() {
			assertCurrent();
			return retained.credential && structuredClone(retained.credential);
		}
	};
}
/** A catalog task can change any known source; one transport carries all committed postimages. */
function beginAuthProfileCredentialBatch(context) {
	const identity = `${context.admission.identity.key}:${context.admission.identity.birthtime ?? ""}`;
	const root = ownerFor(identity);
	const publications = new Map([.../* @__PURE__ */ new Set([identity, ...root.sources ?? []])].map((source) => [source, authProfileCredentialPublication.begin({
		identity: source,
		assertCurrent: context.admission.assertCurrent
	})]));
	const changedSources = /* @__PURE__ */ new Set();
	const unsubscribe = authProfileCredentialPublication.subscribeFacts((change) => {
		if (change.kind !== "committed" && change.kind !== "unknown") return;
		const source = change.kind === "committed" ? change.receipt.source.identity : change.identity;
		if (typeof source === "string" && !publications.has(source)) changedSources.add(source);
	});
	return {
		committed(receipts) {
			for (const receipt of receipts) {
				const source = "source" in receipt ? receipt.source.identity : receipt.identity;
				if (typeof source === "string") {
					if (receipt.canonicalPath) ownerFor(source).canonicalPath = receipt.canonicalPath;
					let publication = publications.get(source);
					if (!publication) {
						(root.sources ??= /* @__PURE__ */ new Set()).add(source);
						publication = authProfileCredentialPublication.begin({
							identity: source,
							assertCurrent: context.admission.assertCurrent
						});
						publications.set(source, publication);
					}
					publication.committed(changedSources.has(source) ? {
						kind: "unknown",
						identity: source
					} : receipt);
				}
			}
		},
		finish(known) {
			unsubscribe();
			for (const publication of publications.values()) publication.finish(known, known);
		}
	};
}
async function captureAuthProfileCredentialCommits(operation) {
	const receipts = [];
	return {
		result: await authCapture.run(receipts, operation),
		receipts
	};
}
//#endregion
export { resetAuthProfileFailureState as A, OAUTH_REFRESH_CALL_TIMEOUT_MS as B, isAuthCooldownBypassedForProvider as C, isProfileInCooldown as D, isModelScopedCooldownReason as E, serializeAuthProfileCredential as F, parseUserModelAuthProfileId as G, authProfilesLog as H, LEGACY_OAUTH_REF_PROVIDER as I, isLegacyOAuthRef as L, resolveProfileUnusableUntil as M, resolveProfileUnusableUntilForDisplay as N, readAuthProfileUsageStats as O, resolveProfilesUnavailableReason as P, inlineAuthProfileCredentialSchema as R, isActiveUnusableWindow as S, isCooldownScopedToDifferentModel as T, reportCommittedInlineAuthFailure as U, OAUTH_REFRESH_LOCK_OPTIONS as V, isUserModelAuthProfileId as W, parseAuthProfileCredential as _, capturePersonalCredentialAuthority as a, clearExpiredCooldowns as b, withAuthProfileCredentialWrite as c, withAuthProfileCredentialWriteCustody as d, assertPersonalAuthProfileRuntime as f, coercePersistedAuthProfileStore as g, withWorkerAuthProfileWrites as h, captureAuthProfileCredentialCommits as i, resolveInlineProviderApiKeyUsageId as j, readInlineProviderApiKeyUsage as k, withPersonalCredentialPublication as l, getWorkerAuthProfileWrites as m, beginAuthProfileCredentialBatch as n, createAuthProfileCredentialWriteAdmission as o, authProfileRuntimeMode as p, captureAuthProfileCredentialAuthority as r, personalCredentialPublication as s, authProfileCredentialPublication as t, withAuthProfileCredentialOwner as u, coerceAuthProfileState as v, isBlockedWindowActiveForModel as w, getSoonestCooldownExpiry as x, coerceProfileUsageStats as y, EXTERNAL_CLI_SYNC_TTL_MS as z };
