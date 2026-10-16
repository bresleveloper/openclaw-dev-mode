import { l as normalizeOptionalString, m as readNonBlankString } from "./string-coerce-1VuiLaaR.mjs";
import { t as asBoolean } from "./boolean-BEb0Fdt8.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { p as normalizeTrimmedStringList, y as uniqueStrings } from "./string-normalization-CECOqf64.mjs";
import { a as coerceSecretRef, h as parseSecretRef, l as isLegacySecretRefWithoutProvider } from "./types.secrets-DsPRn9Dz.mjs";
import { p as shortenHomePath } from "./utils-DgZn2dLu.mjs";
import { t as createSubsystemLogger } from "./subsystem-I-uqdx4f.mjs";
import { r as normalizeProviderId } from "./provider-id-D1VImdKk.mjs";
import { d as readPersistedAuthProfileStoreRaw, f as readPersistedSharedAuthProfileStateRaw, p as readPersistedSharedAuthProfileStoreRaw, r as inspectAuthProfileJsonCellReadOnly, u as readPersistedAuthProfileStateRaw } from "./sqlite-CW8wNN4G.mjs";
import { _ as oauthCredentialMetadataSchema, t as coerceProfileUsageStats, v as isUserModelAuthProfileId } from "./profile-usage-stats-BLwxBqRR.mjs";
import { r as hasUsableOAuthCredential } from "./credential-state-WXO5HScp.mjs";
import { _ as cloneAuthProfileStore, d as hasOidcRegistration, f as isSafeToCopyOAuthIdentity, h as normalizeAuthIdentityToken, m as normalizeAuthEmailToken, o as isSafeToAdoptMainStoreOAuthIdentity, u as hasOAuthIdentity } from "./oauth-shared-CFtD6sCU.mjs";
import { n as isLegacyOAuthRef } from "./legacy-oauth-ref-B5rOFWjL.mjs";
import { isDeepStrictEqual } from "node:util";
//#region src/agents/auth-profiles/constants.ts
/**
* Shared auth-profile constants.
* Defines store versions, built-in CLI profile ids, lock budgets, refresh
* timing, and logging used by auth profile runtime modules.
*/
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
/** Auth profile subsystem logger. */
const authProfilesLog = createSubsystemLogger("agents/auth-profiles");
/** Post-commit diagnostics cannot replace an acknowledged durable result. */
function reportCommittedInlineAuthFailure(message, error) {
	try {
		authProfilesLog.warn(message, { error });
	} catch {}
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
	return {
		replacement: value.replacement,
		modelRef,
		configJson,
		...value.apiKeyHeader === true ? { apiKeyHeader: true } : {},
		...readNonBlankString(value.agentRuntimeId) ? { agentRuntimeId: readNonBlankString(value.agentRuntimeId) } : {},
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
	const email = readNonBlankString(entry.email);
	if (email !== void 0) normalized.email = email;
	const displayName = readNonBlankString(entry.displayName);
	if (displayName !== void 0) normalized.displayName = displayName;
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
//#endregion
//#region src/agents/auth-profiles/runtime-external-profile-references.ts
function getRuntimeExternalCliProfileIds(store) {
	return store.runtimeExternalCliProfileIds ?? [];
}
function setRuntimeExternalCliProfileIds(store, profileIds) {
	const ids = [...new Set(profileIds)].filter((profileId) => store.profiles[profileId]).toSorted();
	const runtimeStore = store;
	runtimeStore.runtimeExternalCliProfileIds = ids.length > 0 ? ids : void 0;
}
function getRuntimeLocalProfileIds(store) {
	return store.runtimeLocalProfileIds ?? [];
}
function setRuntimeLocalProfileIds(store, profileIds) {
	const ids = [...new Set(profileIds)].filter((profileId) => store.profiles[profileId]).toSorted();
	const runtimeStore = store;
	runtimeStore.runtimeLocalProfileIds = ids.length > 0 ? ids : void 0;
}
function removeRuntimeExternalProfileReferences(params) {
	if (params.profileIds.size === 0) return params.store;
	const next = cloneAuthProfileStore(params.store);
	const runtimeNext = next;
	for (const profileId of params.profileIds) {
		delete next.profiles[profileId];
		delete runtimeNext.runtimeCredentialSources?.[profileId];
		if (next.usageStats) delete next.usageStats[profileId];
	}
	if (next.order) {
		const order = Object.fromEntries(Object.entries(next.order).map(([provider, profileIds]) => [provider, profileIds.filter((profileId) => !params.profileIds.has(profileId))]).filter(([, profileIds]) => profileIds.length > 0));
		next.order = Object.keys(order).length > 0 ? order : void 0;
	}
	if (next.lastGood) {
		const lastGood = Object.fromEntries(Object.entries(next.lastGood).filter(([, profileId]) => !params.profileIds.has(profileId)));
		next.lastGood = Object.keys(lastGood).length > 0 ? lastGood : void 0;
	}
	if (next.usageStats && Object.keys(next.usageStats).length === 0) next.usageStats = void 0;
	next.runtimePersistedProfileIds = next.runtimePersistedProfileIds?.filter((profileId) => !params.profileIds.has(profileId));
	if (next.runtimePersistedProfileIds?.length === 0) next.runtimePersistedProfileIds = void 0;
	setRuntimeLocalProfileIds(next, getRuntimeLocalProfileIds(next).filter((profileId) => !params.profileIds.has(profileId)));
	next.runtimeExternalProfileIds = next.runtimeExternalProfileIds?.filter((profileId) => !params.profileIds.has(profileId));
	if (next.runtimeExternalProfileIds?.length === 0 && next.runtimeExternalProfileIdsAuthoritative !== true) next.runtimeExternalProfileIds = void 0;
	setRuntimeExternalCliProfileIds(next, getRuntimeExternalCliProfileIds(next).filter((profileId) => !params.profileIds.has(profileId)));
	return next;
}
/** Shared persistence and snapshots never retain a turn's selected personal account. */
function removePersonalAuthProfileReferences(store) {
	return removeRuntimeExternalProfileReferences({
		store,
		profileIds: new Set([
			...Object.keys(store.profiles),
			...Object.keys(store.usageStats ?? {}),
			...Object.values(store.order ?? {}).flat(),
			...Object.values(store.lastGood ?? {}),
			...store.runtimePersistedProfileIds ?? [],
			...store.runtimeExternalProfileIds ?? [],
			...getRuntimeLocalProfileIds(store),
			...getRuntimeExternalCliProfileIds(store)
		].filter(isUserModelAuthProfileId))
	});
}
/** Carries lifecycle-owned external profiles across a durable-store refresh. */
function mergeRuntimeExternalProfileReferences(params) {
	const runtimeExternalProfileIds = new Set(params.existing.runtimeExternalProfileIds ?? []);
	const externalRefresh = params.externalRefresh === true && runtimeExternalProfileIds.size > 0;
	if (!externalRefresh && params.next.runtimeExternalProfileIdsAuthoritative === true) return params.next;
	if (runtimeExternalProfileIds.size === 0 && params.existing.runtimeExternalProfileIdsAuthoritative !== true) return params.next;
	const merged = cloneAuthProfileStore(params.next);
	const mergedRuntimeExternalProfileIds = new Set(merged.runtimeExternalProfileIds ?? []);
	const mergedRuntimeExternalCliProfileIds = new Set(getRuntimeExternalCliProfileIds(merged));
	const existingRuntimeExternalCliProfileIds = new Set(getRuntimeExternalCliProfileIds(params.existing));
	const retainedStateProfileIds = /* @__PURE__ */ new Set();
	for (const profileId of runtimeExternalProfileIds) {
		const existingCredential = params.existing.profiles[profileId];
		const nextCredential = merged.profiles[profileId];
		if (externalRefresh && (!existingCredential || params.next.runtimeExternalProfileIdsAuthoritative === true && !mergedRuntimeExternalProfileIds.has(profileId))) continue;
		if (nextCredential) {
			if (!mergedRuntimeExternalProfileIds.has(profileId) && (!existingCredential || !isDeepStrictEqual(nextCredential, existingCredential))) continue;
		} else if (existingCredential) merged.profiles[profileId] = existingCredential;
		else continue;
		mergedRuntimeExternalProfileIds.add(profileId);
		if (existingRuntimeExternalCliProfileIds.has(profileId)) mergedRuntimeExternalCliProfileIds.add(profileId);
		if (externalRefresh || !nextCredential) retainedStateProfileIds.add(profileId);
	}
	if (externalRefresh && retainedStateProfileIds.size === 0) return params.next;
	for (const profileId of retainedStateProfileIds) if (params.existing.usageStats?.[profileId]) merged.usageStats = {
		...merged.usageStats,
		[profileId]: params.existing.usageStats[profileId]
	};
	for (const [provider, profileIds] of Object.entries(params.existing.order ?? {})) {
		const externalProfileIds = profileIds.filter((profileId) => retainedStateProfileIds.has(profileId));
		if (externalProfileIds.length === 0 || merged.order?.[provider]) continue;
		merged.order = {
			...merged.order,
			[provider]: externalProfileIds
		};
	}
	for (const [provider, profileId] of Object.entries(params.existing.lastGood ?? {})) {
		if (!retainedStateProfileIds.has(profileId) || merged.lastGood?.[provider]) continue;
		merged.lastGood = {
			...merged.lastGood,
			[provider]: profileId
		};
	}
	const profileIds = [...mergedRuntimeExternalProfileIds].toSorted();
	merged.runtimeExternalProfileIds = profileIds.length > 0 || params.existing.runtimeExternalProfileIdsAuthoritative === true ? profileIds : void 0;
	merged.runtimeExternalProfileIdsAuthoritative = params.existing.runtimeExternalProfileIdsAuthoritative === true ? true : void 0;
	setRuntimeExternalCliProfileIds(merged, mergedRuntimeExternalCliProfileIds);
	return merged;
}
//#endregion
//#region src/agents/auth-profiles/state.ts
/**
* Runtime-state normalization and persistence for auth profile selection.
* This state tracks order, last-good profile, and cooldown/failure metadata
* separately from secret-bearing credentials.
*/
function normalizeAuthProfileOrder(raw) {
	if (!isRecord(raw)) return;
	const normalized = Object.entries(raw).reduce((acc, [provider, value]) => {
		if (!Array.isArray(value)) return acc;
		const providerKey = normalizeProviderId(provider);
		if (!providerKey) return acc;
		const list = normalizeTrimmedStringList(value);
		if (list.length > 0) acc[providerKey] = list;
		return acc;
	}, {});
	return Object.keys(normalized).length > 0 ? normalized : void 0;
}
function normalizeLastGood(raw) {
	if (!isRecord(raw)) return;
	const normalized = {};
	for (const [provider, profileId] of Object.entries(raw)) {
		const providerKey = normalizeProviderId(provider);
		const normalizedProfileId = normalizeOptionalString(profileId);
		if (!providerKey || !normalizedProfileId) continue;
		normalized[providerKey] = normalizedProfileId;
	}
	return Object.keys(normalized).length > 0 ? normalized : void 0;
}
function normalizeUsageStats(raw) {
	if (!isRecord(raw)) return;
	const normalized = {};
	for (const [profileId, value] of Object.entries(raw)) {
		const normalizedProfileId = normalizeOptionalString(profileId);
		const stats = coerceProfileUsageStats(value);
		if (!normalizedProfileId || !stats) continue;
		normalized[normalizedProfileId] = stats;
	}
	return Object.keys(normalized).length > 0 ? normalized : void 0;
}
/** Coerces persisted auth profile runtime state into the current shape. */
function coerceAuthProfileState(raw) {
	if (!isRecord(raw)) return {};
	return {
		order: normalizeAuthProfileOrder(raw.order),
		lastGood: normalizeLastGood(raw.lastGood),
		usageStats: normalizeUsageStats(raw.usageStats)
	};
}
/** Merges auth profile runtime state, with override records winning per key. */
function mergeAuthProfileState(base, override) {
	const mergeRecord = (left, right) => {
		if (!left && !right) return;
		return {
			...left,
			...right
		};
	};
	return {
		order: mergeRecord(base.order, override.order),
		lastGood: mergeRecord(base.lastGood, override.lastGood),
		usageStats: mergeRecord(base.usageStats, override.usageStats)
	};
}
/** Loads persisted auth profile runtime state from SQLite. */
function loadPersistedAuthProfileState(agentDir, database) {
	return coerceAuthProfileState(readPersistedAuthProfileStateRaw(agentDir, database));
}
/** Builds the persisted auth profile runtime state payload. */
function buildPersistedAuthProfileState(store) {
	const state = coerceAuthProfileState(store);
	if (!state.order && !state.lastGood && !state.usageStats) return null;
	return {
		version: 1,
		...state.order ? { order: state.order } : {},
		...state.lastGood ? { lastGood: state.lastGood } : {},
		...state.usageStats ? { usageStats: state.usageStats } : {}
	};
}
//#endregion
//#region src/agents/auth-profiles/store-unreadable-error.ts
const AUTH_PROFILE_MIGRATION_COMMAND = "openclaw doctor --fix";
var AuthProfileStoreUnreadableError = class extends Error {
	constructor(databasePath) {
		super(`Auth profile store ${shortenHomePath(databasePath)} is unreadable; run ${AUTH_PROFILE_MIGRATION_COMMAND}.`);
		this.databasePath = databasePath;
		this.code = "AUTH_PROFILE_STORE_UNREADABLE";
		this.action = AUTH_PROFILE_MIGRATION_COMMAND;
		this.name = "AuthProfileStoreUnreadableError";
	}
};
//#endregion
//#region src/agents/auth-profiles/persisted.ts
/**
* Canonical persisted auth profile loading, runtime metadata, and store merging.
*/
const AUTH_PROFILE_TYPES = /* @__PURE__ */ new Set([
	"api_key",
	"oauth",
	"token"
]);
const INLINE_API_KEY_USAGE_ID_PREFIX = "inline-api-key:";
function isRetainedUsageStatsId(profileId, profiles) {
	return Boolean(profiles[profileId]) || profileId.startsWith(INLINE_API_KEY_USAGE_ID_PREFIX);
}
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
	const provider = typed.provider || fallbackProvider;
	const normalizedProvider = typeof provider === "string" ? normalizeProviderId(provider) : "";
	if (!normalizedProvider) return {
		ok: false,
		reason: "missing_provider"
	};
	return {
		ok: true,
		credential: {
			...typed,
			provider: normalizedProvider
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
function groupProfileIdsByProvider(profiles) {
	const grouped = /* @__PURE__ */ new Map();
	for (const [profileId, credential] of Object.entries(profiles)) {
		const providerKey = normalizeProviderId(credential.provider);
		const profileIds = grouped.get(providerKey) ?? [];
		profileIds.push(profileId);
		grouped.set(providerKey, profileIds);
	}
	return grouped;
}
function findOrderEntryKey(order, providerKey) {
	return Object.keys(order ?? {}).find((key) => normalizeProviderId(key) === providerKey);
}
function mergeProfileRecordsWithOverridePrecedence(base, override) {
	const overrideProfileIds = new Set(Object.keys(override));
	return Object.fromEntries([...Object.entries(override), ...Object.entries(base).filter(([profileId]) => !overrideProfileIds.has(profileId))]);
}
function mergeProfileOrderWithOverridePrecedence(params) {
	const { mergedOrder } = params;
	if (!mergedOrder) return;
	for (const [providerKey, overrideProfileIds] of groupProfileIdsByProvider(params.overrideProfiles)) {
		const baseOrderKey = findOrderEntryKey(params.baseOrder, providerKey);
		const overrideOrderKey = findOrderEntryKey(params.overrideOrder, providerKey);
		const mergedOrderKey = overrideOrderKey ?? baseOrderKey;
		if (!mergedOrderKey) continue;
		for (const provider of Object.keys(mergedOrder)) if (provider !== mergedOrderKey && normalizeProviderId(provider) === providerKey) delete mergedOrder[provider];
		if (overrideOrderKey) {
			mergedOrder[mergedOrderKey] = uniqueStrings(params.overrideOrder?.[overrideOrderKey] ?? []);
			continue;
		}
		const baseOrderIds = baseOrderKey ? params.baseOrder?.[baseOrderKey] ?? [] : [];
		mergedOrder[mergedOrderKey] = uniqueStrings([
			...overrideProfileIds,
			...baseOrderIds,
			...mergedOrder[mergedOrderKey] ?? []
		]);
	}
	return mergedOrder;
}
function hasComparableOAuthIdentityConflict(existing, candidate) {
	if (hasOidcRegistration(existing) || hasOidcRegistration(candidate)) return !isSafeToCopyOAuthIdentity(existing, candidate);
	const existingAccountId = normalizeAuthIdentityToken(existing.accountId);
	const candidateAccountId = normalizeAuthIdentityToken(candidate.accountId);
	if (existingAccountId !== void 0 && candidateAccountId !== void 0 && existingAccountId !== candidateAccountId) return true;
	const existingEmail = normalizeAuthEmailToken(existing.email);
	const candidateEmail = normalizeAuthEmailToken(candidate.email);
	return existingEmail !== void 0 && candidateEmail !== void 0 && existingEmail !== candidateEmail;
}
function isLegacyDefaultOAuthProfile(profileId, credential) {
	return profileId === `${normalizeProviderId(credential.provider)}:default`;
}
function isNewerUsableOAuthCredential(existing, candidate) {
	if (!hasUsableOAuthCredential(candidate)) return false;
	if (!hasUsableOAuthCredential(existing)) return true;
	return candidate.expires > existing.expires;
}
function findMainStoreOAuthReplacement(params) {
	const providerKey = normalizeProviderId(params.legacyCredential.provider);
	const candidates = Object.entries(params.base.profiles).flatMap(([profileId, credential]) => {
		if (profileId === params.legacyProfileId || credential.type !== "oauth" || credential.setup?.replacement || normalizeProviderId(credential.provider) !== providerKey) return [];
		return [[profileId, credential]];
	}).filter(([, credential]) => isNewerUsableOAuthCredential(params.legacyCredential, credential)).toSorted(([leftId, leftCredential], [rightId, rightCredential]) => {
		const leftExpires = Number.isFinite(leftCredential.expires) ? leftCredential.expires : 0;
		const rightExpires = Number.isFinite(rightCredential.expires) ? rightCredential.expires : 0;
		if (rightExpires !== leftExpires) return rightExpires - leftExpires;
		return leftId.localeCompare(rightId);
	});
	const exactIdentityCandidates = candidates.filter(([, credential]) => isSafeToAdoptMainStoreOAuthIdentity(params.legacyCredential, credential));
	if (exactIdentityCandidates.length > 0) {
		if (!hasOAuthIdentity(params.legacyCredential) && exactIdentityCandidates.length > 1) return;
		return exactIdentityCandidates[0]?.[0];
	}
	if (hasUsableOAuthCredential(params.legacyCredential)) return;
	const fallbackCandidates = candidates.filter(([, credential]) => !hasComparableOAuthIdentityConflict(params.legacyCredential, credential));
	if (fallbackCandidates.length !== 1) return;
	return fallbackCandidates[0]?.[0];
}
function replaceMergedProfileReferences(params) {
	const { store, base, replacements } = params;
	if (replacements.size === 0) return store;
	const profiles = { ...store.profiles };
	for (const [legacyProfileId, replacementProfileId] of replacements) {
		const baseCredential = base.profiles[legacyProfileId];
		if (baseCredential) profiles[legacyProfileId] = baseCredential;
		else delete profiles[legacyProfileId];
		const replacementBaseCredential = base.profiles[replacementProfileId];
		const replacementCredential = profiles[replacementProfileId];
		if (replacementBaseCredential && (!replacementCredential || replacementCredential.type === "oauth" && replacementBaseCredential.type === "oauth" && isNewerUsableOAuthCredential(replacementCredential, replacementBaseCredential))) profiles[replacementProfileId] = replacementBaseCredential;
	}
	const order = store.order ? Object.fromEntries(Object.entries(store.order).map(([provider, profileIds]) => [provider, uniqueStrings(profileIds.map((profileId) => replacements.get(profileId) ?? profileId))])) : void 0;
	const lastGood = store.lastGood ? Object.fromEntries(Object.entries(store.lastGood).map(([provider, profileId]) => [provider, replacements.get(profileId) ?? profileId])) : void 0;
	const usageStats = store.usageStats ? { ...store.usageStats } : void 0;
	if (usageStats) for (const legacyProfileId of replacements.keys()) {
		const baseStats = base.usageStats?.[legacyProfileId];
		if (baseStats) usageStats[legacyProfileId] = baseStats;
		else delete usageStats[legacyProfileId];
	}
	const next = {
		...store,
		profiles,
		...order && Object.keys(order).length > 0 ? { order } : { order: void 0 },
		...lastGood && Object.keys(lastGood).length > 0 ? { lastGood } : { lastGood: void 0 },
		...usageStats && Object.keys(usageStats).length > 0 ? { usageStats } : { usageStats: void 0 }
	};
	setRuntimeExternalCliProfileIds(next, getRuntimeExternalCliProfileIds(store).map((profileId) => replacements.get(profileId) ?? profileId));
	return next;
}
function reconcileMainStoreOAuthProfileDrift(params) {
	const replacements = /* @__PURE__ */ new Map();
	for (const [profileId, credential] of Object.entries(params.override.profiles)) {
		if (credential.type !== "oauth") continue;
		const replacementProfileId = isLegacyDefaultOAuthProfile(profileId, credential) ? findMainStoreOAuthReplacement({
			base: params.base,
			legacyProfileId: profileId,
			legacyCredential: credential
		}) : void 0;
		if (replacementProfileId) replacements.set(profileId, replacementProfileId);
	}
	return replaceMergedProfileReferences({
		store: params.merged,
		base: params.base,
		replacements
	});
}
/** Merges two auth profile stores, preserving valid runtime external profile metadata. */
function mergeAuthProfileStores(base, override, options) {
	if (Object.keys(override.profiles).length === 0 && !override.order && !override.lastGood && !override.usageStats && override.runtimePersistedProfileIds === void 0 && override.runtimeLocalProfileIds === void 0 && override.runtimeLocalOrderProviderIds === void 0 && override.runtimeInheritsMainState === void 0 && override.runtimeExternalProfileIds === void 0 && override.runtimeExternalProfileIdsAuthoritative !== true && getRuntimeExternalCliProfileIds(override).length === 0) return base;
	const overrideProfileIds = new Set(Object.keys(override.profiles));
	const overrideRuntimeExternalProfileIds = new Set(override.runtimeExternalProfileIds ?? []);
	const removedRuntimeExternalProfileIds = new Set(override.runtimeExternalProfileIdsAuthoritative === true && options?.preserveBaseRuntimeExternalProfiles !== true ? (base.runtimeExternalProfileIds ?? []).filter((profileId) => !overrideRuntimeExternalProfileIds.has(profileId) && !overrideProfileIds.has(profileId)) : []);
	const profiles = mergeProfileRecordsWithOverridePrecedence(base.profiles, override.profiles);
	for (const profileId of removedRuntimeExternalProfileIds) delete profiles[profileId];
	const mergedState = mergeAuthProfileState(base, override);
	const mergedOrder = mergeProfileOrderWithOverridePrecedence({
		baseOrder: base.order,
		overrideOrder: override.order,
		overrideProfiles: override.profiles,
		mergedOrder: mergedState.order
	});
	const order = mergedOrder ? Object.fromEntries(Object.entries(mergedOrder).map(([provider, profileIds]) => [provider, profileIds.filter((profileId) => profiles[profileId] || !removedRuntimeExternalProfileIds.has(profileId))]).filter(([, profileIds]) => Array.isArray(profileIds) && profileIds.length > 0)) : void 0;
	const lastGood = mergedState.lastGood ? Object.fromEntries(Object.entries(mergedState.lastGood).filter(([, profileId]) => profiles[profileId])) : void 0;
	const usageStats = mergedState.usageStats ? Object.fromEntries(Object.entries(mergedState.usageStats).filter(([profileId]) => isRetainedUsageStatsId(profileId, profiles))) : void 0;
	const merged = {
		version: Math.max(base.version, override.version ?? base.version),
		profiles,
		order,
		lastGood,
		usageStats
	};
	const runtimePersistedProfileIds = [...(base.runtimePersistedProfileIds ?? []).filter((profileId) => !overrideProfileIds.has(profileId)), ...override.runtimePersistedProfileIds ?? []].filter((profileId) => merged.profiles[profileId]).toSorted();
	const runtimeLocalProfileIds = override.runtimeLocalProfileIds?.filter((profileId) => merged.profiles[profileId]).toSorted();
	const runtimeExternalProfileIds = [...override.runtimeExternalProfileIdsAuthoritative === true && options?.preserveBaseRuntimeExternalProfiles !== true ? [] : (base.runtimeExternalProfileIds ?? []).filter((profileId) => !overrideProfileIds.has(profileId)), ...override.runtimeExternalProfileIds ?? []].filter((profileId) => merged.profiles[profileId]).toSorted();
	const runtimeExternalProfileIdsAuthoritative = base.runtimeExternalProfileIdsAuthoritative === true || override.runtimeExternalProfileIdsAuthoritative === true;
	const runtimeExternalProfileMetadata = runtimeExternalProfileIds.length > 0 || runtimeExternalProfileIdsAuthoritative ? {
		runtimeExternalProfileIds: [...new Set(runtimeExternalProfileIds)],
		...runtimeExternalProfileIdsAuthoritative ? { runtimeExternalProfileIdsAuthoritative: true } : {}
	} : {};
	const runtimeExternalCliProfileIds = [...getRuntimeExternalCliProfileIds(base).filter((profileId) => !overrideProfileIds.has(profileId) && !removedRuntimeExternalProfileIds.has(profileId)), ...getRuntimeExternalCliProfileIds(override)];
	const result = reconcileMainStoreOAuthProfileDrift({
		base,
		override,
		merged: {
			...merged,
			...runtimePersistedProfileIds.length > 0 ? { runtimePersistedProfileIds: [...new Set(runtimePersistedProfileIds)] } : {},
			...runtimeLocalProfileIds ? { runtimeLocalProfileIds } : {},
			...override.runtimeLocalOrderProviderIds !== void 0 ? { runtimeLocalOrderProviderIds: [...override.runtimeLocalOrderProviderIds] } : {},
			...override.runtimeInheritsMainState !== void 0 ? { runtimeInheritsMainState: override.runtimeInheritsMainState } : {},
			...runtimeExternalProfileMetadata
		}
	});
	setRuntimeExternalCliProfileIds(result, runtimeExternalCliProfileIds);
	if (base.runtimeCredentialSources || override.runtimeCredentialSources) result.runtimeCredentialSources = Object.fromEntries(Object.entries(result.profiles).flatMap(([profileId, credential]) => {
		const source = credential === override.profiles[profileId] ? override.runtimeCredentialSources?.[profileId] : credential === base.profiles[profileId] ? base.runtimeCredentialSources?.[profileId] : void 0;
		return source ? [[profileId, source]] : [];
	}));
	return result;
}
/** Builds the persisted secrets store, stripping resolved literals when refs exist. */
function buildPersistedAuthProfileSecretsStore(store, shouldPersistProfile) {
	const profiles = { ...store.profiles };
	for (const [profileId, credential] of Object.entries(profiles)) if (isUserModelAuthProfileId(profileId) || shouldPersistProfile && !shouldPersistProfile({
		profileId,
		credential
	})) delete profiles[profileId];
	else if (credential.type === "api_key" && credential.keyRef && credential.key !== void 0) {
		const { key: _key, ...sanitized } = credential;
		profiles[profileId] = sanitized;
	} else if (credential.type === "token" && credential.tokenRef && credential.token !== void 0) {
		const { token: _token, ...sanitized } = credential;
		profiles[profileId] = sanitized;
	}
	return {
		version: 1,
		profiles
	};
}
function mergePersistedAuthProfileState(raw, readState) {
	const store = coercePersistedAuthProfileStore(raw);
	if (!store) return null;
	return removePersonalAuthProfileReferences({
		...store,
		...mergeAuthProfileState(store, coerceAuthProfileState(readState()))
	});
}
/** Loads the persisted auth profile store and merges runtime state. */
function loadPersistedAuthProfileStore(agentDir, options) {
	return mergePersistedAuthProfileState(readPersistedAuthProfileStoreRaw(agentDir, options?.database), () => readPersistedAuthProfileStateRaw(agentDir, options?.database));
}
/** Read an already selected owner without rediscovering an environment or opening a writer. */
function loadPersistedAuthProfileStoreAtDatabasePath(databasePath, kind) {
	const target = {
		path: databasePath,
		kind
	};
	const credentials = inspectAuthProfileJsonCellReadOnly(target, "store");
	if (credentials.status === "missing") return null;
	if (credentials.status === "unreadable") throw new AuthProfileStoreUnreadableError(databasePath);
	const state = inspectAuthProfileJsonCellReadOnly(target, "state");
	const store = mergePersistedAuthProfileState(credentials.raw, () => state.status === "readable" ? state.raw : null);
	if (!store) throw new AuthProfileStoreUnreadableError(databasePath);
	return store;
}
/** Load the shared auth store from an explicit state root. */
function loadPersistedSharedAuthProfileStore(env) {
	return mergePersistedAuthProfileState(readPersistedSharedAuthProfileStoreRaw(env), () => readPersistedSharedAuthProfileStateRaw(env));
}
//#endregion
export { authProfilesLog as C, OAUTH_REFRESH_LOCK_OPTIONS as S, removePersonalAuthProfileReferences as _, loadPersistedSharedAuthProfileStore as a, EXTERNAL_CLI_SYNC_TTL_MS as b, parseAuthProfileCredential as c, buildPersistedAuthProfileState as d, coerceAuthProfileState as f, mergeRuntimeExternalProfileReferences as g, getRuntimeExternalCliProfileIds as h, loadPersistedAuthProfileStoreAtDatabasePath as i, AUTH_PROFILE_MIGRATION_COMMAND as l, mergeAuthProfileState as m, coercePersistedAuthProfileStore as n, mergeAuthProfileStores as o, loadPersistedAuthProfileState as p, loadPersistedAuthProfileStore as r, mergePersistedAuthProfileState as s, buildPersistedAuthProfileSecretsStore as t, AuthProfileStoreUnreadableError as u, removeRuntimeExternalProfileReferences as v, reportCommittedInlineAuthFailure as w, OAUTH_REFRESH_CALL_TIMEOUT_MS as x, setRuntimeExternalCliProfileIds as y };
