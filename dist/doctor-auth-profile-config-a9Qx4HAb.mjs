import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import "./utils-gjJ-tD2q.mjs";
import { P as collectConfiguredModelRefs } from "./runtime-snapshot-BBYDJbw9.mjs";
import { t as splitTrailingAuthProfile } from "./model-ref-profile-BNjB2hED.mjs";
//#region src/commands/doctor-auth-profile-config.ts
/** Protects active auth profile metadata while doctor repairs broader config state. */
function normalizeMode(value) {
	return value === "api_key" || value === "aws-sdk" || value === "oauth" || value === "token" ? value : null;
}
function extractProviderPrefix(value, separator) {
	const index = value.indexOf(separator);
	return index > 0 ? normalizeLowercaseStringOrEmpty(value.slice(0, index)) || null : null;
}
function collectActiveAuthHints(config) {
	const activeProviders = /* @__PURE__ */ new Set();
	const explicitProfileIds = /* @__PURE__ */ new Set();
	const explicitProfileProviders = /* @__PURE__ */ new Map();
	const models = isRecord(config.models) ? config.models : {};
	const providers = isRecord(models.providers) ? models.providers : {};
	for (const providerId of Object.keys(providers)) {
		const normalized = normalizeLowercaseStringOrEmpty(providerId);
		if (normalized) activeProviders.add(normalized);
	}
	for (const { value } of collectConfiguredModelRefs(config)) {
		const { model, profile } = splitTrailingAuthProfile(value);
		const provider = extractProviderPrefix(model, "/");
		if (profile) {
			explicitProfileIds.add(profile);
			if (provider) {
				const providersLocal = explicitProfileProviders.get(profile) ?? /* @__PURE__ */ new Set();
				providersLocal.add(provider);
				explicitProfileProviders.set(profile, providersLocal);
			}
		}
		if (provider) activeProviders.add(provider);
	}
	const auth = isRecord(config.auth) ? config.auth : {};
	const order = isRecord(auth.order) ? auth.order : {};
	for (const [providerId, profileIds] of Object.entries(order)) {
		const provider = normalizeLowercaseStringOrEmpty(providerId);
		if (!provider || !activeProviders.has(provider) || !Array.isArray(profileIds)) continue;
		for (const profileId of profileIds) {
			const normalized = normalizeOptionalString(profileId);
			if (normalized) explicitProfileIds.add(normalized);
		}
	}
	return {
		activeProviders,
		explicitProfileIds,
		explicitProfileProviders
	};
}
function isValidProfileMetadata(value) {
	if (!isRecord(value)) return false;
	return normalizeLowercaseStringOrEmpty(value.provider) !== "" && normalizeMode(value.mode) !== null;
}
function ensureConfigAuthProfiles(config) {
	const root = config;
	const auth = isRecord(root.auth) ? root.auth : {};
	if (root.auth !== auth) root.auth = auth;
	if (!isRecord(auth.profiles)) auth.profiles = {};
	return auth.profiles;
}
/**
* Restores valid metadata for auth profiles still referenced by active model config.
*
* Doctor can rebuild or prune auth config; this guard keeps active profiles usable when their
* provider/mode metadata can be inferred from the before/after config or profile id.
*/
function protectActiveAuthProfileConfig(params) {
	const { activeProviders, explicitProfileIds, explicitProfileProviders } = collectActiveAuthHints(params.before);
	const beforeAuth = isRecord(params.before.auth) ? params.before.auth : {};
	const beforeProfiles = isRecord(beforeAuth.profiles) ? beforeAuth.profiles : {};
	if (Object.keys(beforeProfiles).length === 0) return {
		config: params.after,
		repairs: [],
		warnings: []
	};
	const config = structuredClone(params.after);
	const afterAuth = isRecord(config.auth) ? config.auth : {};
	const afterProfiles = isRecord(afterAuth.profiles) ? afterAuth.profiles : {};
	const repairs = [];
	const warnings = [];
	for (const [profileId, beforeProfile] of Object.entries(beforeProfiles)) {
		const afterProfile = afterProfiles[profileId];
		const after = isRecord(afterProfile) ? afterProfile : {};
		const before = isRecord(beforeProfile) ? beforeProfile : {};
		if (isValidProfileMetadata(afterProfile)) continue;
		let provider = normalizeLowercaseStringOrEmpty(after.provider) || normalizeLowercaseStringOrEmpty(before.provider) || extractProviderPrefix(profileId, ":");
		const protectsActiveProvider = provider !== null && activeProviders.has(provider);
		const protectsExplicitProfile = explicitProfileIds.has(profileId);
		if (!protectsActiveProvider && !protectsExplicitProfile) continue;
		const hints = explicitProfileProviders.get(profileId);
		provider ||= normalizeLowercaseStringOrEmpty(hints?.size === 1 ? [...hints][0] : void 0);
		if (!provider) {
			warnings.push(`auth.profiles.${profileId}: active auth profile metadata could not be inferred; repair manually before running doctor --fix.`);
			continue;
		}
		const repaired = {
			provider,
			mode: normalizeMode(after.mode) ?? normalizeMode(before.mode) ?? "api_key"
		};
		for (const key of ["email", "displayName"]) {
			const value = normalizeOptionalString(after[key]) ?? normalizeOptionalString(before[key]);
			if (value) repaired[key] = value;
		}
		const profiles = ensureConfigAuthProfiles(config);
		profiles[profileId] = repaired;
		repairs.push(`Repaired auth.profiles.${profileId} metadata for active ${repaired.provider} auth.`);
	}
	return {
		config,
		repairs,
		warnings
	};
}
function stripImportedConfigAuthProfileCredentials(cfg, store) {
	const profiles = ensureConfigAuthProfiles(cfg);
	let changed = false;
	for (const [profileId, credential] of Object.entries(store.profiles)) {
		const current = profiles[profileId];
		if (!current) continue;
		profiles[profileId] = {
			provider: current.provider || credential.provider,
			mode: credential.type,
			...current.email ? { email: current.email } : {},
			...current.displayName ? { displayName: current.displayName } : {}
		};
		changed = true;
	}
	return changed;
}
//#endregion
export { protectActiveAuthProfileConfig as n, stripImportedConfigAuthProfileCredentials as r, ensureConfigAuthProfiles as t };
