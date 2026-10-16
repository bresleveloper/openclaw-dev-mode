import { m as readNonBlankString } from "./string-coerce-1VuiLaaR.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { a as coerceSecretRef, s as hasLegacySecretRefExtraFields } from "./types.secrets-DsPRn9Dz.mjs";
import { p as shortenHomePath } from "./utils-DgZn2dLu.mjs";
import { t as createSubsystemLogger } from "./subsystem-I-uqdx4f.mjs";
import { i as resolveProviderIdForAuth, n as hasUnresolvedProviderAuthEndpoint, t as couldResolveProviderIdForAuth } from "./provider-auth-aliases-15nvbxqy.mjs";
import { c as resolveSharedAuthStorePath, l as resolveSharedMainAuthAgentDir } from "./path-resolve-CIRhdX6A.mjs";
import { A as resolveLegacyAuthProfileSourceCandidates, a as inspectPersistedAuthProfileStoreRaw, g as resolveAuthProfileDatabasePath, k as listLegacyAuthProfileSources, s as inspectPersistedSharedAuthProfileStoreRaw } from "./sqlite-CW8wNN4G.mjs";
import { c as parseAuthProfileCredential, l as AUTH_PROFILE_MIGRATION_COMMAND, n as coercePersistedAuthProfileStore } from "./persisted-BVyWmvfF.mjs";
import fs from "node:fs";
//#region src/agents/auth-profiles/legacy-flat-credential.ts
function inferLegacyCredentialType(record) {
	const explicit = readNonBlankString(record.type) ?? readNonBlankString(record.mode);
	if (explicit === "api_key" || explicit === "token" || explicit === "oauth") return explicit;
	if ((readNonBlankString(record.key) ?? readNonBlankString(record.apiKey)) || coerceSecretRef(record.keyRef)) return "api_key";
	if (readNonBlankString(record.token) || coerceSecretRef(record.tokenRef)) return "token";
	if (readNonBlankString(record.access) && readNonBlankString(record.refresh) && typeof record.expires === "number") return "oauth";
}
function coerceLegacyFlatCredential(providerId, raw) {
	if (!isRecord(raw)) return null;
	const type = inferLegacyCredentialType(raw);
	if (!type) return null;
	const provider = readNonBlankString(raw.provider) ?? providerId;
	const credential = parseLegacyCredentialEntry({
		...raw,
		type,
		provider
	}, providerId);
	if (!credential || !hasUsableAuthProfileCredential(credential)) return null;
	return credential;
}
function hasUsableAuthProfileCredential(credential) {
	if (credential.type === "api_key") return Boolean(readNonBlankString(credential.key) || credential.keyRef);
	if (credential.type === "token") return Boolean(readNonBlankString(credential.token) || credential.tokenRef);
	return Boolean(readNonBlankString(credential.access)) && Boolean(readNonBlankString(credential.refresh)) && typeof credential.expires === "number";
}
/** Doctor normalization also supports provider-scoped refusal diagnostics, never runtime credentials. */
function normalizeLegacyCredentialFields(raw) {
	const entry = { ...raw };
	const mode = entry.mode;
	if (!("type" in entry) && (mode === "apiKey" || mode === "api_key" || mode === "token" || mode === "oauth")) {
		entry.type = mode;
		delete entry.mode;
	}
	if (entry.type === "apiKey") entry.type = "api_key";
	if (entry.type === "api_key" && !readNonBlankString(entry.key) && !coerceSecretRef(entry.key) && !coerceSecretRef(entry.keyRef)) for (const field of ["apiKey", "api_key"]) {
		const key = readNonBlankString(entry[field]) ?? coerceSecretRef(entry[field]);
		if (key != null) {
			entry.key = key;
			delete entry[field];
			break;
		}
	}
	const fields = entry.type === "api_key" ? ["key", "keyRef"] : entry.type === "token" ? ["token", "tokenRef"] : void 0;
	if (fields) {
		const [valueField, refField] = fields;
		const explicitRef = coerceSecretRef(entry[refField]);
		if (explicitRef) entry[refField] = explicitRef;
		const value = entry[valueField];
		const ref = isRecord(value) ? coerceSecretRef(value) : null;
		if (ref && !coerceSecretRef(entry[refField])) {
			entry[refField] = ref;
			delete entry[valueField];
		}
	}
	return entry;
}
function parseLegacyCredentialEntry(raw, fallbackProvider) {
	return isRecord(raw) ? parseAuthProfileCredential(normalizeLegacyCredentialFields(raw), fallbackProvider) : null;
}
function normalizeLegacyAuthProfileFields(raw) {
	if (!isRecord(raw) || !isRecord(raw.profiles)) return 0;
	let refsWithDiscardedFields = 0;
	for (const [id, profile] of Object.entries(raw.profiles)) if (isRecord(profile) && parseLegacyCredentialEntry(profile)) {
		const normalized = normalizeLegacyCredentialFields(profile);
		for (const field of [
			"keyRef",
			"tokenRef",
			"key",
			"token",
			"apiKey",
			"api_key"
		]) if (hasLegacySecretRefExtraFields(profile[field]) && normalized[field] !== profile[field]) refsWithDiscardedFields += 1;
		raw.profiles[id] = normalized;
	}
	return refsWithDiscardedFields;
}
function coerceLegacyAuthProfileStore(raw) {
	const normalized = structuredClone(raw);
	normalizeLegacyAuthProfileFields(normalized);
	return coercePersistedAuthProfileStore(normalized);
}
function coerceLegacyAuthStore(raw) {
	if (!isRecord(raw) || "profiles" in raw) return null;
	const entries = {};
	for (const [key, value] of Object.entries(raw)) {
		const parsed = parseLegacyCredentialEntry(value, key);
		if (parsed) entries[key] = parsed;
	}
	return Object.keys(entries).length > 0 ? entries : null;
}
/** Applies legacy auth.json credentials into an auth profile store. */
function applyLegacyAuthStore(store, legacy) {
	for (const [provider, cred] of Object.entries(legacy)) store.profiles[`${provider}:default`] = {
		...cred,
		provider: cred.provider ?? provider
	};
}
//#endregion
//#region src/agents/auth-profiles/legacy-source-diagnostic.ts
const AUTH_PROFILE_MIGRATION_REQUIRED_CODE = "AUTH_PROFILE_MIGRATION_REQUIRED";
const log = createSubsystemLogger("auth-profiles/persistence");
function isCredentialSource(source) {
	return source.kind !== "auth-state";
}
/** Read provider metadata only; unknown shapes retain the owner-wide refusal. */
function readLegacyAuthProfileProviders(sources) {
	const providers = /* @__PURE__ */ new Set();
	for (const source of sources.filter(isCredentialSource)) {
		if (source.kind !== "auth-profiles") return null;
		try {
			const raw = JSON.parse(fs.readFileSync(source.path, "utf8"));
			if (!isRecord(raw)) return null;
			const nested = Object.hasOwn(raw, "profiles");
			const profiles = nested ? raw.profiles : raw;
			if (!isRecord(profiles) || Object.keys(profiles).length === 0) return null;
			for (const [key, profile] of Object.entries(profiles)) {
				const credential = nested ? parseLegacyCredentialEntry(profile) : coerceLegacyFlatCredential(key, profile);
				if (!credential) return null;
				const provider = credential.provider;
				if (typeof provider !== "string" || !/^[a-z0-9][a-z0-9._-]{0,127}$/i.test(provider)) return null;
				providers.add(provider.toLowerCase());
				if (provider.toLowerCase() === "openai-codex") providers.add("openai");
			}
		} catch {
			return null;
		}
	}
	return providers.size > 0 ? [...providers].toSorted() : null;
}
function resolveAuthProfileOwnerPath(agentDir, env) {
	return agentDir ? resolveAuthProfileDatabasePath(agentDir) : resolveSharedAuthStorePath(env);
}
function hasLegacyAuthProfileCredentialSource(agentDir) {
	return listLegacyAuthProfileSources({ agentDir }).some(isCredentialSource);
}
/**
* True when the canonical SQLite store already holds credentials for this owner.
* A retired JSON file sitting next to a populated store is leftover bytes Doctor
* has not archived yet, not unmigrated credentials: failing runtime closed there
* would strand a working store over a file nothing reads.
*/
function hasMigratedAuthProfileCredentials(agentDir, env) {
	let inspection;
	try {
		inspection = !agentDir && env ? inspectPersistedSharedAuthProfileStoreRaw(env) : inspectPersistedAuthProfileStoreRaw(agentDir);
	} catch {
		return false;
	}
	if (inspection.status !== "readable") return false;
	const profiles = isRecord(inspection.raw) ? inspection.raw.profiles : void 0;
	return isRecord(profiles) && Object.keys(profiles).length > 0;
}
function listStartupLegacyAuthProfileSources(params) {
	const sharedMainDir = resolveSharedMainAuthAgentDir(params.env);
	return [.../* @__PURE__ */ new Set([...params.agentDirs, sharedMainDir])].map((agentDir) => {
		const sources = listLegacyAuthProfileSources({
			agentDir,
			env: params.env
		});
		const credentialSources = sources.filter(isCredentialSource);
		return {
			agentDir,
			sources,
			unmigratedCredentialSources: credentialSources.length > 0 && hasMigratedAuthProfileCredentials(agentDir) ? [] : credentialSources
		};
	});
}
function hasLegacyAuthProfileSourcesForStartup(params) {
	let detected = false;
	for (const { agentDir, sources, unmigratedCredentialSources } of listStartupLegacyAuthProfileSources(params)) {
		detected ||= sources.length > 0;
		if (unmigratedCredentialSources.length > 0) markAuthProfileMigrationRequired(agentDir, new AuthProfileMigrationRequiredError({
			agentDir,
			sources: unmigratedCredentialSources
		}));
	}
	return detected;
}
var AuthProfileMigrationRequiredError = class AuthProfileMigrationRequiredError extends Error {
	constructor(params, previous) {
		const ownerId = params instanceof AuthProfileMigrationRequiredError ? params.ownerId : shortenHomePath(params.databasePath ?? resolveAuthProfileOwnerPath(params.agentDir, params.env));
		const sourceKinds = [.../* @__PURE__ */ new Set([...previous?.sourceKinds ?? [], ...params instanceof AuthProfileMigrationRequiredError ? params.sourceKinds : params.sources.map((source) => source.kind)])].toSorted();
		const providers = params instanceof AuthProfileMigrationRequiredError ? params.affectedProviders : readLegacyAuthProfileProviders(params.sources);
		const affectedProviders = providers && previous?.affectedProviders !== null ? [.../* @__PURE__ */ new Set([...previous?.affectedProviders ?? [], ...providers])].toSorted() : null;
		super(`Auth profile store ${ownerId} requires legacy credential migration; affected providers: ${affectedProviders?.join(", ") ?? "all (legacy provider scope unavailable)"}; run ${AUTH_PROFILE_MIGRATION_COMMAND}.`);
		this.code = AUTH_PROFILE_MIGRATION_REQUIRED_CODE;
		this.action = AUTH_PROFILE_MIGRATION_COMMAND;
		this.name = "AuthProfileMigrationRequiredError";
		this.ownerId = ownerId;
		this.sourceKinds = sourceKinds;
		this.affectedProviders = affectedProviders;
	}
	blocksProvider(provider, config) {
		if (!provider || !this.affectedProviders) return true;
		if (hasUnresolvedProviderAuthEndpoint(provider, { config })) return true;
		const requested = resolveProviderIdForAuth(provider, {
			config,
			storedCredential: config === void 0
		});
		return this.affectedProviders.some((affected) => resolveProviderIdForAuth(affected, {
			config,
			storedCredential: true
		}) === requested);
	}
};
const migrationRequiredByDatabase = /* @__PURE__ */ new Map();
const warnedLegacySourceDatabases = /* @__PURE__ */ new Set();
function warnLegacyAuthProfileSourcesIgnored(params) {
	if (params.sources.length === 0) return;
	const databasePath = params.databasePath ?? resolveAuthProfileOwnerPath(params.agentDir, params.env);
	if (warnedLegacySourceDatabases.has(databasePath)) return;
	warnedLegacySourceDatabases.add(databasePath);
	log.warn("retired auth profile files are ignored by runtime; run Doctor to archive them", {
		code: AUTH_PROFILE_MIGRATION_REQUIRED_CODE,
		ownerId: shortenHomePath(databasePath),
		sourceKinds: [...new Set(params.sources.map((source) => source.kind))].toSorted(),
		action: AUTH_PROFILE_MIGRATION_COMMAND
	});
}
function recordAuthProfileMigrationRequired(databasePath, error) {
	const previous = migrationRequiredByDatabase.get(databasePath);
	const retained = previous ? new AuthProfileMigrationRequiredError(error, previous) : error;
	migrationRequiredByDatabase.set(databasePath, retained);
	if (previous?.message !== retained.message) log.warn(retained.message, {
		code: retained.code,
		affectedProviders: retained.affectedProviders,
		action: retained.action
	});
	return retained;
}
function markAuthProfileMigrationRequired(agentDir, error, env) {
	recordAuthProfileMigrationRequired(resolveAuthProfileOwnerPath(agentDir, env), error);
}
/** Publication must honor a recorded refusal without rediscovering an ambient owner. */
function assertAuthProfileMigrationStateAtDatabasePath(databasePath, provider, config, deferScopedRefusals = false) {
	const error = migrationRequiredByDatabase.get(databasePath);
	if (error && !(deferScopedRefusals && error.affectedProviders !== null) && error.blocksProvider(provider, config)) throw error;
}
/** A selected row cannot escape its own owner's fence by changing endpoint aliases. */
function assertAuthProfileCredentialMigrationStateAtDatabasePath(databasePath, provider, config) {
	const error = migrationRequiredByDatabase.get(databasePath);
	if (!error) return;
	const requested = resolveProviderIdForAuth(provider, { config });
	if (!error.affectedProviders || hasUnresolvedProviderAuthEndpoint(provider, { config }) || error.affectedProviders.some((affected) => couldResolveProviderIdForAuth(affected, requested, { config }))) throw error;
}
function assertAuthProfileMigrationCandidates(params) {
	assertAuthProfileMigrationStateAtDatabasePath(params.databasePath, params.provider, params.config, params.deferScopedRefusals);
	const sources = params.candidates.filter((source) => isCredentialSource(source) && fs.existsSync(source.path));
	if (sources.length === 0) return;
	if (params.hasCredentials()) {
		warnLegacyAuthProfileSourcesIgnored({
			databasePath: params.databasePath,
			sources
		});
		return;
	}
	const migrationError = recordAuthProfileMigrationRequired(params.databasePath, new AuthProfileMigrationRequiredError({
		databasePath: params.databasePath,
		sources
	}));
	if (!(params.deferScopedRefusals && migrationError.affectedProviders !== null) && migrationError.blocksProvider(params.provider, params.config)) throw migrationError;
}
function assertAuthProfileMigrationReady(agentDir, env, provider, config, deferScopedRefusals = false) {
	assertAuthProfileMigrationCandidates({
		databasePath: resolveAuthProfileOwnerPath(agentDir, env),
		candidates: resolveLegacyAuthProfileSourceCandidates({
			agentDir,
			env
		}),
		hasCredentials: () => hasMigratedAuthProfileCredentials(agentDir, env),
		provider,
		config,
		deferScopedRefusals
	});
}
function clearAuthProfileMigrationDiagnostics() {
	migrationRequiredByDatabase.clear();
	warnedLegacySourceDatabases.clear();
}
//#endregion
export { normalizeLegacyAuthProfileFields as _, assertAuthProfileMigrationStateAtDatabasePath as a, hasLegacyAuthProfileSourcesForStartup as c, warnLegacyAuthProfileSourcesIgnored as d, applyLegacyAuthStore as f, hasUsableAuthProfileCredential as g, coerceLegacyFlatCredential as h, assertAuthProfileMigrationReady as i, markAuthProfileMigrationRequired as l, coerceLegacyAuthStore as m, assertAuthProfileCredentialMigrationStateAtDatabasePath as n, clearAuthProfileMigrationDiagnostics as o, coerceLegacyAuthProfileStore as p, assertAuthProfileMigrationCandidates as r, hasLegacyAuthProfileCredentialSource as s, AuthProfileMigrationRequiredError as t, readLegacyAuthProfileProviders as u, normalizeLegacyCredentialFields as v, parseLegacyCredentialEntry as y };
