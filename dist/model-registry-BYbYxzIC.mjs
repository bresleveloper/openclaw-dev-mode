import { r as normalizeProviderId } from "./provider-id-DCtsDflE.mjs";
import { l as resolveAgentWorkspaceDir, m as resolveDefaultAgentId } from "./agent-scope-config-IQKOEtZ4.mjs";
import { l as runPluginStreamConsumer } from "./plugin-instance-scope-C9hxyH_A.mjs";
import { t as createSubsystemLogger } from "./subsystem-DleLyu58.mjs";
import { a as isCurrentPluginMetadataSnapshotRuntimeGeneration, i as getCurrentPluginMetadataSnapshot } from "./current-plugin-metadata-snapshot-BU2mC0-C.mjs";
import { u as resolvePluginMetadataSnapshot } from "./plugin-metadata-snapshot-pEXzzTbU.mjs";
import { t as modelTransportRoutesMatch } from "./model-compat-catalog-DU9GPmr_.mjs";
import { n as projectConfigOntoRuntimeSourceSnapshot } from "./runtime-source-projection-D2uZ1zpS.mjs";
import "./agent-scope-CTuYDtny.mjs";
import { s as withFileLock } from "./file-lock-BmQQ9PQF.mjs";
import "./file-lock-DJoMQumt.mjs";
import { r as getRuntimeConfig } from "./io.runtime-CZWcIUDk.mjs";
import "./config-DryArA1l.mjs";
import { n as OAuthProviderRegistry, t as OAuthProviderConfiguredUnavailableError } from "./provider-runtime.errors-D_TbqqY9.mjs";
import { c as resolveProviderOAuthRefreshCapabilityWithPlugin, i as loginProviderOAuthWithPlugin, s as resolveProviderOAuthCredentialWithPlugin } from "./provider-runtime.runtime.js";
import { _ as runAuthProfileWriteTransaction, a as inspectPersistedAuthProfileStoreRaw, h as resolveAuthProfileDatabasePath, i as inspectPersistedAuthProfileStateRaw } from "./sqlite-BIg_k8qE.mjs";
import { t as normalizeOptionalSecretInput } from "./normalize-secret-input-Df_qhWv_.mjs";
import { E as OAUTH_REFRESH_LOCK_OPTIONS, T as OAUTH_REFRESH_CALL_TIMEOUT_MS, a as loadPersistedAuthProfileStore, f as AuthProfileStoreUnreadableError, h as loadPersistedAuthProfileState } from "./persisted-B486xwB_.mjs";
import { l as isOAuthRefreshFence, u as isPendingOAuthRefreshFence } from "./credential-state-CWZ_V0ds.mjs";
import { V as normalizeOAuthRefreshCredential, W as refreshSerializedOAuthCredential } from "./runtime-snapshots-CBozwlR0.mjs";
import { i as assertAuthProfileMigrationReady, t as AuthProfileMigrationRequiredError } from "./legacy-source-diagnostic-_PHHNz0J.mjs";
import { _ as hasUsableCustomProviderApiKey } from "./loader-runtime-load-DitY2Htf.mjs";
import { f as saveAuthProfileStoreWithPreparedOwner, t as createAuthProfileStoreReadScope } from "./store-runtime-CzCVI_rv.mjs";
import { r as normalizeResolvedPricing } from "./usage-cost-Va5dwVFW.mjs";
import "./src-BpANEEBH.mjs";
import { t as getAgentDir } from "./config-CvRJ7U0Z.mjs";
import { a as getBashShellEnv, i as getBashShellConfig, t as buildShellCommandInvocation } from "./shell-utils-D_gDHHBQ.mjs";
import { a as sanitizeModelHeaders } from "./model.inline-provider-BrhnLKm5.mjs";
import { t as parseModelCatalogJson } from "./model-catalog-json-CxUsDrkg.mjs";
import { a as normalizeProviderMapKeys, n as mergeProviderModels, t as buildSourceModelFields } from "./models-config.merge-Deg2vlWf.mjs";
import { t as materializeConfiguredProviderCatalogModels } from "./models-config.providers.catalog-DfEcuWtR.mjs";
import { a as loadPersistedPluginModelCatalogsReadOnly, d as isGeneratedPluginModelCatalog, i as inspectLegacyPluginModelCatalogs, r as filterGeneratedPluginModelCatalogProviders } from "./plugin-model-catalog-DoLlP-mj.mjs";
import { r as bindStreamLlmRuntime } from "./model-runtime-binding-DgnrsJj9.mjs";
import fs, { existsSync, readFileSync } from "node:fs";
import { isDeepStrictEqual } from "node:util";
import { dirname, join } from "node:path";
import { execSync, spawnSync } from "node:child_process";
import { Type } from "typebox";
import { Compile } from "typebox/compile";
import { findEnvKeys, getEnvApiKey } from "@openclaw/ai/internal/runtime";
import { createApiRegistry, createLlmRuntime } from "@openclaw/ai";
import { registerBuiltInApiProviders } from "@openclaw/ai/providers";
//#region src/agents/model-discovery-context.ts
/**
* Shared context resolvers for model discovery.
* Keeps callers from reaching into runtime config or plugin metadata snapshot
* plumbing directly.
*/
/** Resolve the workspace directory model discovery should use for agent scope. */
function resolveModelWorkspaceDir(cfg, explicitWorkspaceDir, agentId) {
	if (explicitWorkspaceDir !== void 0 || !cfg) return explicitWorkspaceDir;
	return resolveAgentWorkspaceDir(cfg, agentId ?? resolveDefaultAgentId(cfg));
}
/**
* Resolve the plugin metadata snapshot for model discovery.
*
* Explicit snapshots win for tests and prepared runtimes. Otherwise we prefer
* the current process snapshot, then fall back to resolving from config/env.
*/
function resolveModelPluginMetadataSnapshot(params) {
	if (params.pluginMetadataSnapshot) return params.pluginMetadataSnapshot;
	const env = params.env ?? process.env;
	try {
		if (!params.config && params.useRuntimeConfig) {
			const current = getCurrentPluginMetadataSnapshot({
				allowWorkspaceScopedSnapshot: true,
				allowSynchronousPolicyRead: false,
				env,
				...params.workspaceDir ? { workspaceDir: params.workspaceDir } : {}
			});
			if (current && isCurrentPluginMetadataSnapshotRuntimeGeneration(current)) return current;
		}
		const config = params.config ?? (params.useRuntimeConfig ? getRuntimeConfig() : void 0);
		return getCurrentPluginMetadataSnapshot({
			allowWorkspaceScopedSnapshot: true,
			env,
			...config ? { config } : {},
			...params.workspaceDir ? { workspaceDir: params.workspaceDir } : {}
		}) ?? resolvePluginMetadataSnapshot({
			config: config ?? {},
			env,
			...params.workspaceDir ? { workspaceDir: params.workspaceDir } : {},
			...params.allowWorkspaceScopedCurrent !== void 0 ? { allowWorkspaceScopedCurrent: params.allowWorkspaceScopedCurrent } : {}
		});
	} catch {
		return;
	}
}
//#endregion
//#region src/agents/sessions/auth-storage-error.ts
var AuthStoragePersistenceError = class extends Error {
	constructor(message, cause) {
		super(message, { cause });
		this.name = "AuthStoragePersistenceError";
	}
};
//#endregion
//#region src/agents/sessions/auth-storage-oauth-registry.ts
const registries = /* @__PURE__ */ new WeakMap();
function getAuthStorageOAuthProviderRegistry(authStorage) {
	let registry = registries.get(authStorage);
	if (!registry) {
		registry = new OAuthProviderRegistry();
		registries.set(authStorage, registry);
	}
	return registry;
}
async function loginAuthStorageOAuthProvider(authStorage, providerId, callbacks) {
	const provider = getAuthStorageOAuthProviderRegistry(authStorage).get(providerId);
	if (provider) return await provider.login(callbacks);
	const resolved = await loginProviderOAuthWithPlugin({
		provider: providerId,
		context: callbacks
	});
	if (resolved.status === "unowned") throw new Error(`Unknown OAuth provider: ${providerId}`);
	if (resolved.status !== "available") throw new OAuthProviderConfiguredUnavailableError(providerId);
	return resolved.credentials;
}
async function resolveAuthStoragePluginOAuthCredential(providerId, credential, refresh) {
	const resolved = await resolveProviderOAuthCredentialWithPlugin({
		provider: providerId,
		credential: {
			...credential,
			type: "oauth",
			provider: providerId
		},
		refresh
	});
	if (resolved.status === "configured-unavailable") throw new OAuthProviderConfiguredUnavailableError(providerId);
	return resolved.status === "available" ? {
		apiKey: resolved.apiKey,
		newCredentials: resolved.credential
	} : null;
}
async function canResolveAuthStoragePluginOAuthRefresh(providerId) {
	const capability = await resolveProviderOAuthRefreshCapabilityWithPlugin({ provider: providerId });
	if (capability.status === "configured-unavailable") throw new OAuthProviderConfiguredUnavailableError(providerId);
	return capability.status === "available";
}
//#endregion
//#region src/agents/sessions/auth-storage-oauth-refresh.ts
function isAuthStorageOAuthRefreshFence(provider, credential) {
	return credential?.type === "oauth" && isOAuthRefreshFence(normalizeOAuthRefreshCredential(credential, provider));
}
async function refreshAuthStorageOAuthCredential(params) {
	const provider = getAuthStorageOAuthProviderRegistry(params.authStorage).get(params.providerId);
	const result = await refreshSerializedOAuthCredential({
		backend: params.storage,
		provider: params.providerId,
		profileId: `${params.providerId}:default`,
		label: `AuthStorage.refresh(${params.providerId})`,
		timeoutMs: OAUTH_REFRESH_CALL_TIMEOUT_MS,
		parse: params.parse,
		serialize: (data) => JSON.stringify(data, null, 2),
		readCredential: (data) => {
			const credential = data[params.providerId];
			return normalizeOAuthRefreshCredential(credential?.type === "oauth" ? credential : void 0, params.providerId);
		},
		writeCredential: (data, credential) => ({
			...data,
			[params.providerId]: credential
		}),
		canRefresh: async () => Boolean(provider) || await canResolveAuthStoragePluginOAuthRefresh(params.providerId),
		commit: (data) => {
			const expected = params.parse(JSON.stringify(data));
			const current = params.storage.withLock((raw) => {
				const authoritative = params.parse(raw);
				if (!isDeepStrictEqual(authoritative[params.providerId], expected[params.providerId])) throw new AuthStoragePersistenceError("Auth storage credentials changed before refresh publication.", void 0);
				return { result: authoritative };
			});
			params.commit(current);
		},
		refresh: async (credential, data) => {
			const oauthCredentials = Object.fromEntries(Object.entries(data).filter((entry) => {
				return entry[1].type === "oauth";
			}));
			const refreshed = provider ? await getAuthStorageOAuthProviderRegistry(params.authStorage).getApiKey(params.providerId, oauthCredentials) : await resolveAuthStoragePluginOAuthCredential(params.providerId, credential, true);
			return refreshed ? {
				apiKey: refreshed.apiKey,
				credential: {
					...credential,
					...refreshed.newCredentials,
					type: "oauth",
					provider: credential.provider
				}
			} : null;
		},
		resolve: async (credential) => {
			if (provider) return {
				apiKey: provider.getApiKey(credential),
				credential
			};
			const resolved = await resolveAuthStoragePluginOAuthCredential(params.providerId, credential, false);
			return resolved ? {
				apiKey: resolved.apiKey,
				credential: {
					...credential,
					...resolved.newCredentials,
					type: "oauth",
					provider: credential.provider
				}
			} : null;
		}
	});
	return result ? {
		apiKey: result.apiKey,
		newCredentials: result.credential
	} : null;
}
//#endregion
//#region src/agents/sessions/auth-storage-projection.ts
function materializeAuthStorageStore(store, snapshots) {
	if (snapshots.length === 0) return store;
	const profiles = Object.fromEntries(Object.entries(store.profiles).map(([profileId, credential]) => {
		const runtimeCredential = snapshots.map((snapshot) => snapshot.profiles[profileId]).find((candidate) => credential.type === "api_key" && credential.keyRef ? candidate?.type === "api_key" && Boolean(candidate.key) && candidate.provider === credential.provider && isDeepStrictEqual(candidate.keyRef, credential.keyRef) : credential.type === "token" && credential.tokenRef ? candidate?.type === "token" && Boolean(candidate.token) && candidate.provider === credential.provider && isDeepStrictEqual(candidate.tokenRef, credential.tokenRef) : false);
		return [profileId, (credential.type === "api_key" && Boolean(credential.keyRef) || credential.type === "token" && Boolean(credential.tokenRef)) && runtimeCredential ? runtimeCredential : credential];
	}));
	return {
		...store,
		profiles
	};
}
function projectAuthStorageData(store) {
	const projected = {};
	for (const [profileId, credential] of Object.entries(store?.profiles ?? {})) {
		if (profileId !== `${credential.provider}:default`) continue;
		if (credential.type === "api_key" && credential.key) projected[credential.provider] = {
			type: "api_key",
			key: credential.key
		};
		else if (credential.type === "token" && credential.token) projected[credential.provider] = {
			type: "token",
			token: credential.token,
			...credential.expires !== void 0 ? { expires: credential.expires } : {}
		};
		else if (credential.type === "oauth") projected[credential.provider] = { ...credential };
	}
	return projected;
}
function assertAuthStorageSecretRefsMaterialized(store) {
	for (const [profileId, credential] of Object.entries(store.profiles)) {
		if (profileId !== `${credential.provider}:default`) continue;
		if (credential.type === "api_key" && credential.keyRef && !credential.key || credential.type === "token" && credential.tokenRef && !credential.token) throw new AuthStoragePersistenceError("AuthStorage.forAgent requires the active secrets runtime to materialize SecretRef credentials.", void 0);
	}
}
function projectAuthoritativeAuthStorageData(store, snapshots) {
	const materialized = materializeAuthStorageStore(store, snapshots);
	assertAuthStorageSecretRefsMaterialized(materialized);
	return projectAuthStorageData(materialized);
}
function applyAuthStorageData(store, data, materializedBaseline) {
	const profiles = { ...store.profiles };
	const projectedProviders = /* @__PURE__ */ new Set([...Object.keys(materializedBaseline), ...Object.entries(store.profiles).flatMap(([profileId, credential]) => profileId === `${credential.provider}:default` ? [credential.provider] : [])]);
	for (const provider of projectedProviders) if (!data[provider]) delete profiles[`${provider}:default`];
	for (const [provider, credential] of Object.entries(data)) {
		const profileId = `${provider}:default`;
		const existing = profiles[profileId];
		if (credential.type === "api_key" && existing?.type === "api_key" && existing.keyRef && materializedBaseline[provider]?.type === "api_key" && materializedBaseline[provider].key === credential.key) {
			profiles[profileId] = existing;
			continue;
		}
		if (credential.type === "token" && existing?.type === "token" && existing.tokenRef && materializedBaseline[provider]?.type === "token" && materializedBaseline[provider].token === credential.token) {
			profiles[profileId] = existing;
			continue;
		}
		profiles[profileId] = credential.type === "api_key" ? {
			type: "api_key",
			provider,
			key: credential.key
		} : credential.type === "token" ? {
			type: "token",
			provider,
			token: credential.token,
			expires: credential.expires
		} : {
			...credential,
			provider
		};
	}
	return {
		...store,
		profiles
	};
}
//#endregion
//#region src/agents/sessions/resolve-config-value.ts
/**
* Resolve configuration values that may be shell commands, environment variables, or literals.
* Used by auth-storage.ts and model-registry.ts.
*/
const commandResultCache = /* @__PURE__ */ new Map();
/**
* Resolve a config value (API key, header value, etc.) to an actual value.
* - If starts with "!", executes the rest as a shell command and uses stdout (cached)
* - Otherwise checks environment variable first, then treats as literal (not cached)
*/
function resolveConfigValue(config) {
	if (config.startsWith("!")) return executeCommand(config);
	return process.env[config] || config;
}
function executeWithConfiguredShell(command) {
	try {
		const shellConfig = getBashShellConfig();
		const invocation = buildShellCommandInvocation(command, shellConfig);
		const [shell, ...args] = invocation.argv;
		const result = spawnSync(shell, args, {
			encoding: "utf-8",
			...invocation.input === void 0 ? {} : { input: invocation.input },
			timeout: 1e4,
			stdio: [
				invocation.stdin,
				"pipe",
				"ignore"
			],
			shell: false,
			windowsHide: true,
			env: getBashShellEnv(shellConfig.shell)
		});
		if (result.error) {
			if (result.error.code === "ENOENT") return {
				executed: false,
				value: void 0
			};
			return {
				executed: true,
				value: void 0
			};
		}
		if (result.status !== 0) return {
			executed: true,
			value: void 0
		};
		return {
			executed: true,
			value: (result.stdout ?? "").trim() || void 0
		};
	} catch {
		return {
			executed: false,
			value: void 0
		};
	}
}
function executeWithDefaultShell(command) {
	try {
		return execSync(command, {
			encoding: "utf-8",
			timeout: 1e4,
			stdio: [
				"ignore",
				"pipe",
				"ignore"
			]
		}).trim() || void 0;
	} catch {
		return;
	}
}
function executeCommandUncached(commandConfig) {
	const command = commandConfig.slice(1);
	return process.platform === "win32" ? (() => {
		const configuredResult = executeWithConfiguredShell(command);
		return configuredResult.executed ? configuredResult.value : executeWithDefaultShell(command);
	})() : executeWithDefaultShell(command);
}
function executeCommand(commandConfig) {
	if (commandResultCache.has(commandConfig)) return commandResultCache.get(commandConfig);
	const result = executeCommandUncached(commandConfig);
	commandResultCache.set(commandConfig, result);
	return result;
}
/**
* Resolve all header values using the same resolution logic as API keys.
*/
function resolveConfigValueUncached(config) {
	if (config.startsWith("!")) return executeCommandUncached(config);
	return process.env[config] || config;
}
function resolveConfigValueOrThrow(config, description) {
	const resolvedValue = resolveConfigValueUncached(config);
	if (resolvedValue !== void 0) return resolvedValue;
	if (config.startsWith("!")) throw new Error(`Failed to resolve ${description} from shell command: ${config.slice(1)}`);
	throw new Error(`Failed to resolve ${description}`);
}
function resolveHeadersOrThrow(headers, description) {
	if (!headers) return;
	const resolved = {};
	for (const [key, value] of Object.entries(headers)) resolved[key] = resolveConfigValueOrThrow(value, `${description} header "${key}"`);
	return Object.keys(resolved).length > 0 ? resolved : void 0;
}
//#endregion
//#region src/agents/sessions/auth-storage.ts
/**
* Credential storage facade for API keys and OAuth tokens.
* Canonical persistence is the per-agent SQLite auth-profile store.
*
* The backend contract keeps the upstream session SDK shape while OpenClaw
* projects provider-default profiles into it.
*/
const AUTH_STORAGE_CREATE_DEPRECATION_CODE = "AUTH_STORAGE_CREATE_DEPRECATED";
const FILE_AUTH_STORAGE_BACKEND_DEPRECATION_CODE = "FILE_AUTH_STORAGE_BACKEND_DEPRECATED";
let authStorageCreateWarningEmitted = false;
let fileAuthStorageBackendWarningEmitted = false;
function emitAuthStorageDeprecationWarning(params) {
	process.emitWarning(params.message, {
		code: params.code,
		type: "DeprecationWarning"
	});
}
var AuthStorageLegacyPathMigrationRequiredError = class extends Error {
	constructor() {
		super("Deprecated AuthStorage path contains unmigrated credentials; run openclaw doctor --fix for standard agent auth.json or migrate plugin storage to AuthStorage.forAgent(agentDir).");
		this.code = "AUTH_PROFILE_MIGRATION_REQUIRED";
		this.action = "migrate to AuthStorage.forAgent(agentDir)";
		this.name = "AuthStorageLegacyPathMigrationRequiredError";
	}
};
function assertDeprecatedAuthStoragePathAbsent(authPath) {
	if (authPath && fs.existsSync(authPath)) throw new AuthStorageLegacyPathMigrationRequiredError();
}
function collectStateOnlyAuthProfileIds(store) {
	return [.../* @__PURE__ */ new Set([
		...Object.values(store.order ?? {}).flat(),
		...Object.values(store.lastGood ?? {}),
		...Object.keys(store.usageStats ?? {})
	])].filter((profileId) => !store.profiles[profileId]);
}
function loadSqliteAuthStorageStore(agentDir, database) {
	const inspection = inspectPersistedAuthProfileStoreRaw(agentDir, database);
	if (inspection.status === "missing") {
		if (inspectPersistedAuthProfileStateRaw(agentDir, database).status === "unreadable") throw new AuthProfileStoreUnreadableError(database?.path ?? resolveAuthProfileDatabasePath(agentDir));
		return {
			version: 1,
			profiles: {},
			...loadPersistedAuthProfileState(agentDir, database)
		};
	}
	const store = loadPersistedAuthProfileStore(agentDir, database ? { database } : void 0);
	if (inspection.status === "unreadable" || !store) throw new AuthProfileStoreUnreadableError(database?.path ?? resolveAuthProfileDatabasePath(agentDir));
	return store;
}
var SqliteAuthStorageBackend = class {
	constructor(scope, preparedStore) {
		this.scope = scope;
		this.preparedStore = preparedStore;
		this.credentialSources = /* @__PURE__ */ new Map();
	}
	get agentDir() {
		return this.scope.agentDir;
	}
	assertProviderReady(provider, baseUrl) {
		this.scope.assertProviderReady(provider, baseUrl);
	}
	getCredentialSource(provider) {
		return this.credentialSources.get(provider);
	}
	assertCredentialReady(source, baseUrl) {
		this.scope.assertCredentialReady(source, baseUrl);
	}
	captureCredentialSources(store, databasePath) {
		const persisted = new Set(store.runtimePersistedProfileIds ?? []);
		this.credentialSources = new Map(Object.entries(store.profiles).flatMap(([profileId, credential]) => {
			if (profileId !== `${credential.provider}:default`) return [];
			const source = databasePath ? {
				databasePath,
				provider: credential.provider
			} : store.runtimeCredentialSources?.[profileId];
			if (!source && persisted.has(profileId)) throw new AuthStoragePersistenceError("Canonical auth credential is missing its source owner.", void 0);
			return source ? [[credential.provider, source]] : [];
		}));
	}
	read() {
		const store = this.scope.read();
		const content = JSON.stringify(projectAuthoritativeAuthStorageData(store, this.resolveMaterializedRuntimeStores()));
		this.captureCredentialSources(store);
		return content;
	}
	resolveMaterializedRuntimeStores() {
		const current = this.scope.getRuntimeSnapshots();
		return current.length > 0 ? current : [this.preparedStore];
	}
	readRaw() {
		assertAuthProfileMigrationReady(this.agentDir);
		return loadSqliteAuthStorageStore(this.agentDir);
	}
	withLock(fn) {
		assertAuthProfileMigrationReady(this.agentDir);
		const snapshots = this.resolveMaterializedRuntimeStores();
		assertAuthProfileMigrationReady(this.agentDir);
		const selected = runAuthProfileWriteTransaction(this.agentDir, (database, owner) => {
			const store = loadSqliteAuthStorageStore(this.agentDir, database);
			const materializedData = projectAuthoritativeAuthStorageData(store, snapshots);
			const { result, next } = fn(JSON.stringify(materializedData));
			let selectedStore = store;
			if (next !== void 0) {
				const nextStore = applyAuthStorageData(store, JSON.parse(next), materializedData);
				saveAuthProfileStoreWithPreparedOwner(nextStore, this.agentDir, {
					filterExternalAuthProfiles: false,
					preserveStateProfileIds: collectStateOnlyAuthProfileIds(store),
					syncExternalCli: false
				}, database, owner);
				selectedStore = nextStore;
			}
			return {
				result,
				store: selectedStore,
				databasePath: owner.databasePath
			};
		});
		this.captureCredentialSources(selected.store, selected.databasePath);
		return selected.result;
	}
	async withLockAsync(fn) {
		assertAuthProfileMigrationReady(this.agentDir);
		return await withFileLock(resolveAuthProfileDatabasePath(this.agentDir), OAUTH_REFRESH_LOCK_OPTIONS, async () => {
			const initialRaw = this.readRaw();
			const initialData = projectAuthoritativeAuthStorageData(initialRaw, this.resolveMaterializedRuntimeStores());
			const { result, next } = await fn(JSON.stringify(initialData));
			if (next === void 0) {
				this.captureCredentialSources(initialRaw, resolveAuthProfileDatabasePath(this.agentDir));
				return result;
			}
			assertAuthProfileMigrationReady(this.agentDir);
			const selected = runAuthProfileWriteTransaction(this.agentDir, (database, owner) => {
				const authoritative = loadSqliteAuthStorageStore(this.agentDir, database);
				if (!isDeepStrictEqual(authoritative.profiles, initialRaw.profiles)) throw new AuthStoragePersistenceError("Cannot update auth storage because its SQLite credentials changed concurrently.", void 0);
				const nextStore = applyAuthStorageData(authoritative, JSON.parse(next), initialData);
				saveAuthProfileStoreWithPreparedOwner(nextStore, this.agentDir, {
					filterExternalAuthProfiles: false,
					preserveStateProfileIds: collectStateOnlyAuthProfileIds(authoritative),
					syncExternalCli: false
				}, database, owner);
				return {
					store: nextStore,
					databasePath: owner.databasePath
				};
			});
			this.captureCredentialSources(selected.store, selected.databasePath);
			return result;
		});
	}
};
function createSqliteAuthStorageBackend(agentDir, config) {
	const scope = createAuthProfileStoreReadScope(agentDir, config);
	const preparedStore = materializeAuthStorageStore(scope.store, scope.getRuntimeSnapshots());
	assertAuthStorageSecretRefsMaterialized(preparedStore);
	return new SqliteAuthStorageBackend(scope, preparedStore);
}
/**
* @deprecated Use AuthStorage.forAgent(agentDir). This compatibility adapter
* derives the owning agent directory from the old path and persists only to SQLite.
* It is eligible for removal after 2026-10-01 and a clean published-plugin sweep.
*/
var FileAuthStorageBackend = class {
	constructor(authPath) {
		if (!fileAuthStorageBackendWarningEmitted) {
			fileAuthStorageBackendWarningEmitted = true;
			emitAuthStorageDeprecationWarning({
				code: FILE_AUTH_STORAGE_BACKEND_DEPRECATION_CODE,
				message: "FileAuthStorageBackend(path) is deprecated; use AuthStorage.forAgent(agentDir). The compatibility adapter persists to SQLite and never reads or writes auth.json."
			});
		}
		assertDeprecatedAuthStoragePathAbsent(authPath);
		this.agentDir = authPath ? dirname(authPath) : getAgentDir();
	}
	getDelegate() {
		return this.delegate ??= createSqliteAuthStorageBackend(this.agentDir, void 0);
	}
	read() {
		return this.getDelegate().read();
	}
	assertProviderReady(provider, baseUrl) {
		this.getDelegate().assertProviderReady(provider, baseUrl);
	}
	getCredentialSource(provider) {
		return this.getDelegate().getCredentialSource(provider);
	}
	assertCredentialReady(source, baseUrl) {
		this.getDelegate().assertCredentialReady(source, baseUrl);
	}
	withLock(fn) {
		return this.getDelegate().withLock(fn);
	}
	async withLockAsync(fn) {
		return await this.getDelegate().withLockAsync(fn);
	}
};
var InMemoryAuthStorageBackend = class {
	withLock(fn) {
		const { result, next } = fn(this.value);
		if (next !== void 0) this.value = next;
		return result;
	}
	async withLockAsync(fn) {
		const { result, next } = await fn(this.value);
		if (next !== void 0) this.value = next;
		return result;
	}
};
/**
* Provider-keyed credential facade backed by the canonical auth-profile store.
*/
var AuthStorage = class AuthStorage {
	constructor(storage) {
		this.data = {};
		this.credentialSources = /* @__PURE__ */ new Map();
		this.runtimeOverrides = /* @__PURE__ */ new Map();
		this.loadError = null;
		this.errors = [];
		this.storage = storage;
		this.reload();
	}
	static forAgent(agentDir = getAgentDir(), config) {
		return new AuthStorage(createSqliteAuthStorageBackend(agentDir, config));
	}
	/**
	* @deprecated Use AuthStorage.forAgent(agentDir). The path-taking compatibility
	* form is eligible for removal after 2026-10-01 and a clean published-plugin
	* reader sweep; it no longer reads or writes JSON.
	*/
	static create(authPath) {
		if (!authStorageCreateWarningEmitted) {
			authStorageCreateWarningEmitted = true;
			emitAuthStorageDeprecationWarning({
				code: AUTH_STORAGE_CREATE_DEPRECATION_CODE,
				message: "AuthStorage.create(path) is deprecated; use AuthStorage.forAgent(agentDir). The compatibility adapter persists to SQLite and never reads or writes auth.json."
			});
		}
		assertDeprecatedAuthStoragePathAbsent(authPath);
		return AuthStorage.forAgent(authPath ? dirname(authPath) : getAgentDir(), void 0);
	}
	static fromStorage(storage) {
		return new AuthStorage(storage);
	}
	static inMemory(data = {}) {
		const storage = new InMemoryAuthStorageBackend();
		storage.withLock(() => ({
			result: void 0,
			next: JSON.stringify(data, null, 2)
		}));
		return AuthStorage.fromStorage(storage);
	}
	/**
	* Set a runtime API key override (not persisted to disk).
	* Used for CLI --api-key flag.
	*/
	setRuntimeApiKey(provider, apiKey) {
		this.runtimeOverrides.set(provider, apiKey);
	}
	/**
	* Remove a runtime API key override.
	*/
	removeRuntimeApiKey(provider) {
		this.runtimeOverrides.delete(provider);
	}
	/**
	* Set a fallback resolver for API keys not found in auth.json or env vars.
	* Used for custom provider keys from models.json.
	*/
	setFallbackResolver(resolver) {
		this.fallbackResolver = resolver;
	}
	recordError(error) {
		const normalizedError = error instanceof Error ? error : new Error(String(error));
		this.errors.push(normalizedError);
	}
	getCanonicalLoadError() {
		if (!this.loadError) return null;
		return this.storage.assertProviderReady || this.loadError instanceof AuthProfileMigrationRequiredError || this.loadError instanceof AuthProfileStoreUnreadableError ? this.loadError : null;
	}
	parseStorageData(content) {
		if (!content) return {};
		return JSON.parse(content);
	}
	setData(data) {
		this.data = data;
		this.credentialSources = new Map(Object.keys(data).flatMap((provider) => {
			const source = this.storage.getCredentialSource?.(provider);
			return source ? [[provider, source]] : [];
		}));
	}
	/**
	* Reload credentials from storage.
	*/
	reload() {
		let content;
		try {
			if (this.storage.read) content = this.storage.read();
			else this.storage.withLock((current) => {
				content = current;
				return { result: void 0 };
			});
			this.setData(this.parseStorageData(content));
			this.loadError = null;
		} catch (error) {
			this.loadError = error;
			this.recordError(error);
		}
	}
	persistProviderChange(provider, credential) {
		if (this.loadError) this.reload();
		if (this.loadError) {
			const error = new AuthStoragePersistenceError(`Cannot update auth storage because it could not be loaded: ${this.loadError.message}`, this.loadError);
			this.recordError(error);
			throw error;
		}
		try {
			const persistedData = this.storage.withLock((current) => {
				const merged = { ...this.parseStorageData(current) };
				if (credential) merged[provider] = credential;
				else delete merged[provider];
				return {
					result: merged,
					next: JSON.stringify(merged, null, 2)
				};
			});
			this.loadError = null;
			this.setData(persistedData);
		} catch (error) {
			const persistenceError = error instanceof AuthStoragePersistenceError ? error : new AuthStoragePersistenceError(`Failed to persist auth storage update for provider "${provider}": ${error instanceof Error ? error.message : String(error)}`, error);
			this.recordError(persistenceError);
			throw persistenceError;
		}
	}
	/**
	* Get credential for a provider.
	*/
	get(provider) {
		const credential = this.data[provider];
		return isAuthStorageOAuthRefreshFence(provider, credential) ? void 0 : credential;
	}
	/**
	* Set credential for a provider.
	*/
	set(provider, credential) {
		this.persistProviderChange(provider, credential);
	}
	/**
	* Remove credential for a provider.
	*/
	remove(provider) {
		this.persistProviderChange(provider, void 0);
	}
	/**
	* List all providers with credentials.
	*/
	list() {
		return Object.keys(this.data).filter((provider) => !isAuthStorageOAuthRefreshFence(provider, this.data[provider]));
	}
	/**
	* Check if credentials exist for a provider in auth.json.
	*/
	has(provider) {
		return this.get(provider) !== void 0;
	}
	/**
	* Check if any form of auth is configured for a provider.
	* Unlike getApiKey(), this doesn't refresh OAuth tokens.
	*/
	hasAuth(provider) {
		if (this.runtimeOverrides.has(provider)) return true;
		if (this.get(provider)) return true;
		if (getEnvApiKey(provider)) return true;
		if (this.fallbackResolver?.(provider)) return true;
		return false;
	}
	/**
	* Return auth status without exposing credential values or refreshing tokens.
	*/
	getAuthStatus(provider) {
		if (this.get(provider)) return {
			configured: true,
			source: "stored"
		};
		if (this.runtimeOverrides.has(provider)) return {
			configured: false,
			source: "runtime",
			label: "--api-key"
		};
		const envKeys = findEnvKeys(provider);
		if (envKeys?.[0]) return {
			configured: false,
			source: "environment",
			label: envKeys[0]
		};
		if (this.fallbackResolver?.(provider)) return {
			configured: false,
			source: "fallback",
			label: "custom provider config"
		};
		return { configured: false };
	}
	/**
	* Get all credentials (for passing to getOAuthApiKey).
	*/
	getAll() {
		return Object.fromEntries(Object.entries(this.data).filter(([provider, credential]) => !isAuthStorageOAuthRefreshFence(provider, credential)));
	}
	drainErrors() {
		const drained = [...this.errors];
		this.errors = [];
		return drained;
	}
	/**
	* Login to an OAuth provider.
	*/
	async login(providerId, callbacks) {
		const credentials = await loginAuthStorageOAuthProvider(this, providerId, callbacks);
		this.set(providerId, {
			type: "oauth",
			...credentials
		});
	}
	/**
	* Logout from a provider.
	*/
	logout(provider) {
		this.remove(provider);
	}
	/**
	* Refresh OAuth token with backend locking to prevent race conditions.
	* Multiple agent sessions may try to refresh simultaneously when tokens expire.
	*/
	async refreshOAuthTokenWithLock(providerId) {
		let source;
		const result = await refreshAuthStorageOAuthCredential({
			authStorage: this,
			storage: this.storage,
			providerId,
			parse: (current) => this.parseStorageData(current),
			commit: (data) => {
				this.setData(data);
				source = this.credentialSources.get(providerId);
				this.loadError = null;
			}
		});
		if (!result) {
			this.reload();
			return null;
		}
		return {
			...result,
			source
		};
	}
	/**
	* Get API key for a provider.
	* Priority:
	* 1. Runtime override (CLI --api-key)
	* 2. API key from auth.json
	* 3. OAuth token from auth.json (auto-refreshed with locking)
	* 4. Environment variable
	* 5. Fallback resolver (models.json custom providers)
	*/
	async getApiKey(providerId, options) {
		const runtimeKey = this.runtimeOverrides.get(providerId);
		if (runtimeKey) return runtimeKey;
		this.storage.assertProviderReady?.(providerId, options?.baseUrl);
		const canonicalLoadError = this.getCanonicalLoadError();
		if (canonicalLoadError) throw canonicalLoadError;
		const { apiKey, source } = await this.resolveStoredOrFallbackApiKey(providerId, options);
		this.storage.assertProviderReady?.(providerId, options?.baseUrl);
		const reloadedError = this.getCanonicalLoadError();
		if (reloadedError) throw reloadedError;
		if (source) this.storage.assertCredentialReady?.(source, options?.baseUrl);
		return apiKey;
	}
	async resolveStoredOrFallbackApiKey(providerId, options) {
		let cred = this.data[providerId];
		if (isAuthStorageOAuthRefreshFence(providerId, cred)) {
			this.reload();
			cred = this.data[providerId];
			const normalizedFence = cred?.type === "oauth" ? normalizeOAuthRefreshCredential(cred, providerId) : void 0;
			if (isOAuthRefreshFence(normalizedFence) && !isPendingOAuthRefreshFence(normalizedFence)) cred = void 0;
		}
		let source = this.credentialSources.get(providerId);
		if (source) this.storage.assertCredentialReady?.(source, options?.baseUrl);
		const resolved = (apiKey) => ({
			apiKey,
			source
		});
		if (cred?.type === "api_key") return resolved(resolveConfigValue(cred.key));
		if (cred?.type === "token") {
			if (cred.expires === void 0 || Date.now() < cred.expires) return resolved(resolveConfigValue(cred.token));
		}
		if (cred?.type === "oauth") {
			const provider = getAuthStorageOAuthProviderRegistry(this).get(providerId);
			if (Date.now() >= cred.expires) try {
				const result = await this.refreshOAuthTokenWithLock(providerId);
				if (result) return {
					apiKey: result.apiKey,
					source: result.source
				};
			} catch (error) {
				if (error instanceof OAuthProviderConfiguredUnavailableError) throw error;
				this.recordError(error);
				this.reload();
				const canonicalStoreError = error instanceof AuthProfileMigrationRequiredError || error instanceof AuthProfileStoreUnreadableError ? error : this.getCanonicalLoadError();
				if (canonicalStoreError) throw canonicalStoreError;
				const updatedCred = this.data[providerId];
				source = this.credentialSources.get(providerId);
				if (source) this.storage.assertCredentialReady?.(source, options?.baseUrl);
				if (updatedCred?.type === "oauth" && Date.now() < updatedCred.expires) {
					if (provider) return resolved(provider.getApiKey(updatedCred));
					return resolved((await resolveAuthStoragePluginOAuthCredential(providerId, updatedCred, false))?.apiKey);
				}
				return resolved(void 0);
			}
			else {
				if (provider) return resolved(provider.getApiKey(cred));
				return resolved((await resolveAuthStoragePluginOAuthCredential(providerId, cred, false))?.apiKey);
			}
		}
		const envKey = getEnvApiKey(providerId);
		if (envKey) return resolved(envKey);
		if (options?.includeFallback !== false) return resolved(this.fallbackResolver?.(providerId) ?? void 0);
		return resolved(void 0);
	}
	/**
	* Get all OAuth providers registered for this auth/session runtime.
	*/
	getOAuthProviders() {
		return getAuthStorageOAuthProviderRegistry(this).getAll();
	}
};
//#endregion
//#region src/agents/sessions/model-registry-runtime.ts
const modelRegistryRuntimes = /* @__PURE__ */ new WeakMap();
function resetApiRegistry(runtime) {
	runtime.apiRegistry.clearApiProviders();
	registerBuiltInApiProviders(runtime.apiRegistry);
}
/** Creates the runtime facts owned by one model-registry lifecycle. */
function initializeModelRegistryRuntime(owner) {
	const apiRegistry = createApiRegistry();
	const llmRuntime = {
		...createLlmRuntime(apiRegistry),
		runStream: runPluginStreamConsumer
	};
	const runtime = {
		apiRegistry,
		llmRuntime
	};
	bindStreamLlmRuntime(llmRuntime.streamSimple, llmRuntime);
	resetApiRegistry(runtime);
	modelRegistryRuntimes.set(owner, runtime);
}
/** Returns the prepared runtime facts for one model-registry lifecycle. */
function getModelRegistryRuntime(owner) {
	const runtime = modelRegistryRuntimes.get(owner);
	if (!runtime) throw new Error("Model registry runtime is not initialized");
	return runtime;
}
function resetModelRegistryRuntime(owner) {
	resetApiRegistry(getModelRegistryRuntime(owner));
}
//#endregion
//#region src/agents/sessions/model-registry-schema.ts
/** Validation for authored and generated model registry catalogs. */
const PercentileCutoffsSchema = Type.Object({
	p50: Type.Optional(Type.Number()),
	p75: Type.Optional(Type.Number()),
	p90: Type.Optional(Type.Number()),
	p99: Type.Optional(Type.Number())
});
const OpenRouterRoutingSchema = Type.Object({
	allow_fallbacks: Type.Optional(Type.Boolean()),
	require_parameters: Type.Optional(Type.Boolean()),
	data_collection: Type.Optional(Type.Union([Type.Literal("deny"), Type.Literal("allow")])),
	zdr: Type.Optional(Type.Boolean()),
	enforce_distillable_text: Type.Optional(Type.Boolean()),
	order: Type.Optional(Type.Array(Type.String())),
	only: Type.Optional(Type.Array(Type.String())),
	ignore: Type.Optional(Type.Array(Type.String())),
	quantizations: Type.Optional(Type.Array(Type.String())),
	sort: Type.Optional(Type.Union([Type.String(), Type.Object({
		by: Type.Optional(Type.String()),
		partition: Type.Optional(Type.Union([Type.String(), Type.Null()]))
	})])),
	max_price: Type.Optional(Type.Object({
		prompt: Type.Optional(Type.Union([Type.Number(), Type.String()])),
		completion: Type.Optional(Type.Union([Type.Number(), Type.String()])),
		image: Type.Optional(Type.Union([Type.Number(), Type.String()])),
		audio: Type.Optional(Type.Union([Type.Number(), Type.String()])),
		request: Type.Optional(Type.Union([Type.Number(), Type.String()]))
	})),
	preferred_min_throughput: Type.Optional(Type.Union([Type.Number(), PercentileCutoffsSchema])),
	preferred_max_latency: Type.Optional(Type.Union([Type.Number(), PercentileCutoffsSchema]))
});
const VercelGatewayRoutingSchema = Type.Object({
	only: Type.Optional(Type.Array(Type.String())),
	order: Type.Optional(Type.Array(Type.String()))
});
const ThinkingLevelMapValueSchema = Type.Union([Type.String(), Type.Null()]);
const ThinkingLevelMapSchema = Type.Object({
	off: Type.Optional(ThinkingLevelMapValueSchema),
	minimal: Type.Optional(ThinkingLevelMapValueSchema),
	low: Type.Optional(ThinkingLevelMapValueSchema),
	medium: Type.Optional(ThinkingLevelMapValueSchema),
	high: Type.Optional(ThinkingLevelMapValueSchema),
	xhigh: Type.Optional(ThinkingLevelMapValueSchema),
	max: Type.Optional(ThinkingLevelMapValueSchema)
});
const OpenAICompletionsCompatSchema = Type.Object({
	supportsStore: Type.Optional(Type.Boolean()),
	supportsDeveloperRole: Type.Optional(Type.Boolean()),
	supportsReasoningEffort: Type.Optional(Type.Boolean()),
	supportsUsageInStreaming: Type.Optional(Type.Boolean()),
	maxTokensField: Type.Optional(Type.Union([Type.Literal("max_completion_tokens"), Type.Literal("max_tokens")])),
	requiresToolResultName: Type.Optional(Type.Boolean()),
	requiresAssistantAfterToolResult: Type.Optional(Type.Boolean()),
	requiresThinkingAsText: Type.Optional(Type.Boolean()),
	requiresReasoningContentOnAssistantMessages: Type.Optional(Type.Boolean()),
	thinkingFormat: Type.Optional(Type.Union([
		Type.Literal("openai"),
		Type.Literal("openrouter"),
		Type.Literal("together"),
		Type.Literal("deepseek"),
		Type.Literal("zai"),
		Type.Literal("qwen"),
		Type.Literal("qwen-chat-template")
	])),
	cacheControlFormat: Type.Optional(Type.Literal("anthropic")),
	openRouterRouting: Type.Optional(OpenRouterRoutingSchema),
	vercelGatewayRouting: Type.Optional(VercelGatewayRoutingSchema),
	supportsStrictMode: Type.Optional(Type.Boolean()),
	supportsJsonSchemaResponseFormat: Type.Optional(Type.Boolean()),
	supportsLongCacheRetention: Type.Optional(Type.Boolean())
});
const OpenAIResponsesCompatSchema = Type.Object({
	supportsTemperature: Type.Optional(Type.Boolean()),
	supportsInstructions: Type.Optional(Type.Boolean()),
	sendSessionIdHeader: Type.Optional(Type.Boolean()),
	supportsLongCacheRetention: Type.Optional(Type.Boolean())
});
const AnthropicMessagesCompatSchema = Type.Object({
	supportsEagerToolInputStreaming: Type.Optional(Type.Boolean()),
	supportsLongCacheRetention: Type.Optional(Type.Boolean())
});
const ProviderCompatSchema = Type.Union([
	OpenAICompletionsCompatSchema,
	OpenAIResponsesCompatSchema,
	AnthropicMessagesCompatSchema
]);
const ProviderAuthModeSchema = Type.Union([
	Type.Literal("api-key"),
	Type.Literal("aws-sdk"),
	Type.Literal("oauth"),
	Type.Literal("token")
]);
const ModelDefinitionSchema = Type.Object({
	id: Type.String({ minLength: 1 }),
	name: Type.Optional(Type.String({ minLength: 1 })),
	api: Type.Optional(Type.String({ minLength: 1 })),
	baseUrl: Type.Optional(Type.String({ minLength: 1 })),
	reasoning: Type.Optional(Type.Boolean()),
	thinkingLevelMap: Type.Optional(ThinkingLevelMapSchema),
	input: Type.Optional(Type.Array(Type.Union([
		Type.Literal("text"),
		Type.Literal("image"),
		Type.Literal("audio"),
		Type.Literal("video")
	]))),
	cost: Type.Optional(Type.Object({
		input: Type.Number(),
		output: Type.Number(),
		cacheRead: Type.Number(),
		cacheWrite: Type.Number()
	})),
	contextWindow: Type.Optional(Type.Number()),
	contextTokens: Type.Optional(Type.Number()),
	maxTokens: Type.Optional(Type.Number()),
	params: Type.Optional(Type.Record(Type.String(), Type.Unknown())),
	headers: Type.Optional(Type.Record(Type.String(), Type.String())),
	compat: Type.Optional(ProviderCompatSchema)
});
const ProviderConfigSchema = Type.Object({
	name: Type.Optional(Type.String({ minLength: 1 })),
	baseUrl: Type.Optional(Type.String({ minLength: 1 })),
	apiKey: Type.Optional(Type.String({ minLength: 1 })),
	auth: Type.Optional(ProviderAuthModeSchema),
	api: Type.Optional(Type.String({ minLength: 1 })),
	headers: Type.Optional(Type.Record(Type.String(), Type.String())),
	compat: Type.Optional(ProviderCompatSchema),
	authHeader: Type.Optional(Type.Boolean()),
	models: Type.Optional(Type.Array(ModelDefinitionSchema))
});
const ModelsConfigSchema = Type.Object({
	generatedBy: Type.Optional(Type.String()),
	providers: Type.Record(Type.String(), ProviderConfigSchema)
});
const validateModelsConfig = Compile(ModelsConfigSchema);
function formatValidationPath(error) {
	if (error.keyword === "required") {
		const requiredProperty = error.params.requiredProperties[0];
		if (requiredProperty) {
			const basePath = error.instancePath.replace(/^\//, "").replace(/\//g, ".");
			return basePath ? `${basePath}.${requiredProperty}` : requiredProperty;
		}
	}
	return error.instancePath.replace(/^\//, "").replace(/\//g, ".") || "root";
}
//#endregion
//#region src/agents/sessions/provider-display-names.ts
/**
* Built-in provider labels shown in session/model UI when plugin metadata does
* not supply a display name.
*/
const BUILT_IN_PROVIDER_DISPLAY_NAMES = {
	anthropic: "Anthropic",
	"amazon-bedrock": "Amazon Bedrock",
	"azure-openai-responses": "Azure OpenAI Responses",
	cerebras: "Cerebras",
	"cloudflare-ai-gateway": "Cloudflare AI Gateway",
	"cloudflare-workers-ai": "Cloudflare Workers AI",
	deepseek: "DeepSeek",
	fireworks: "Fireworks",
	google: "Google Gemini",
	"google-vertex": "Google Vertex AI",
	groq: "Groq",
	huggingface: "Hugging Face",
	"kimi-coding": "Kimi For Coding",
	meta: "Meta",
	mistral: "Mistral",
	minimax: "MiniMax",
	"minimax-cn": "MiniMax (China)",
	moonshotai: "Moonshot AI",
	"moonshotai-cn": "Moonshot AI (China)",
	opencode: "OpenCode Zen",
	"opencode-go": "OpenCode Go",
	openai: "OpenAI",
	openrouter: "OpenRouter",
	together: "Together AI",
	"vercel-ai-gateway": "Vercel AI Gateway",
	xai: "xAI",
	zai: "ZAI",
	xiaomi: "Xiaomi MiMo",
	"xiaomi-token-plan-cn": "Xiaomi MiMo Token Plan (China)",
	"xiaomi-token-plan-ams": "Xiaomi MiMo Token Plan (Amsterdam)",
	"xiaomi-token-plan-sgp": "Xiaomi MiMo Token Plan (Singapore)"
};
//#endregion
//#region src/agents/sessions/model-registry.ts
/**
* Model registry - manages configured/provider-owned models and API key resolution.
*/
const log = createSubsystemLogger("agents/model-registry");
function captureInventoryProvider(provider, source) {
	return {
		api: provider.api,
		baseUrl: provider.baseUrl,
		compat: provider.compat,
		models: provider.models?.map(({ headers: _headers, ...model }) => ({
			...model,
			api: model.api ?? provider.api,
			baseUrl: model.baseUrl ?? provider.baseUrl,
			maxTokensSource: source === "static" ? "discovered" : model.maxTokensSource,
			compat: source === "static" ? mergeCompat(provider.compat, model.compat) : model.compat
		}))
	};
}
function emptyCustomModelsResult(error) {
	return {
		providers: {},
		error
	};
}
function mergeCompat(baseCompat, overrideCompat) {
	if (!overrideCompat) return baseCompat;
	const base = baseCompat;
	const override = overrideCompat;
	const merged = {
		...base,
		...override
	};
	const baseCompletions = base;
	const overrideCompletions = override;
	const mergedCompletions = merged;
	if (baseCompletions?.openRouterRouting || overrideCompletions.openRouterRouting) mergedCompletions.openRouterRouting = {
		...baseCompletions?.openRouterRouting,
		...overrideCompletions.openRouterRouting
	};
	if (baseCompletions?.vercelGatewayRouting || overrideCompletions.vercelGatewayRouting) mergedCompletions.vercelGatewayRouting = {
		...baseCompletions?.vercelGatewayRouting,
		...overrideCompletions.vercelGatewayRouting
	};
	return merged;
}
/**
* Model registry - loads and manages models, resolves API keys via AuthStorage.
*/
var ModelRegistry = class ModelRegistry {
	constructor(authStorage, modelsJsonPath, options = {}, publishedModels) {
		this.models = [];
		this.providerRequestConfigs = /* @__PURE__ */ new Map();
		this.modelRequestHeaders = /* @__PURE__ */ new Map();
		this.registeredProviders = /* @__PURE__ */ new Map();
		this.loadError = void 0;
		this.includePluginCatalogs = true;
		this.authStorage = authStorage;
		this.config = options.config ?? options.sourceSnapshot?.config;
		this.includePluginCatalogs = options.includePluginCatalogs !== false;
		initializeModelRegistryRuntime(this);
		if (options.sourceSnapshot) {
			const source = options.sourceSnapshot;
			const captured = source.baseCatalogSnapshot ?? source.captureCatalogSnapshot();
			const sourceSnapshot = publishedModels ? {
				...captured,
				models: [...captured.models.filter((model) => !publishedModels.has(model.provider)), ...[...publishedModels.values()].flat()]
			} : captured;
			this.sourceSnapshot = sourceSnapshot;
			this.baseCatalogSnapshot = sourceSnapshot;
			this.restoreSourceCatalog(sourceSnapshot);
			this.registeredProviders = new Map([...source.registeredProviders].map(([provider, config]) => [provider, { ...config }]));
			getAuthStorageOAuthProviderRegistry(authStorage).reset();
			for (const oauthProvider of sourceSnapshot.oauthProviders) getAuthStorageOAuthProviderRegistry(authStorage).register(oauthProvider);
			for (const [providerName, config] of this.registeredProviders.entries()) this.applyProviderConfig(providerName, config);
			return;
		}
		this.modelsJsonPath = modelsJsonPath;
		this.modelsJsonContents = options.modelsJsonContents;
		this.pluginCatalogs = options.pluginCatalogs;
		this.staticProviderConfigs = options.staticProviderConfigs;
		this.pluginMetadataSnapshot = resolveModelPluginMetadataSnapshot({
			config: this.config,
			...options.pluginMetadataSnapshot ? { pluginMetadataSnapshot: options.pluginMetadataSnapshot } : {},
			...options.workspaceDir ? { workspaceDir: options.workspaceDir } : {},
			allowWorkspaceScopedCurrent: true,
			useRuntimeConfig: true
		});
		this.loadModels();
		this.baseCatalogSnapshot = this.captureCatalogSnapshot();
	}
	captureCatalogSnapshot() {
		return {
			models: structuredClone(this.models),
			providerRequestConfigs: new Map([...this.providerRequestConfigs].map(([provider, config]) => [provider, { ...config }])),
			modelRequestHeaders: new Map([...this.modelRequestHeaders].map(([key, headers]) => [key, { ...headers }])),
			loadError: this.loadError,
			pluginMetadataSnapshot: this.pluginMetadataSnapshot,
			oauthProviders: [...this.authStorage.getOAuthProviders()]
		};
	}
	restoreSourceCatalog(source) {
		this.models = structuredClone(source.models);
		this.providerRequestConfigs = new Map([...source.providerRequestConfigs].map(([provider, config]) => [provider, { ...config }]));
		this.modelRequestHeaders = new Map([...source.modelRequestHeaders].map(([key, headers]) => [key, { ...headers }]));
		this.loadError = source.loadError;
		this.pluginMetadataSnapshot = source.pluginMetadataSnapshot;
	}
	static create(authStorage, modelsJsonPath = join(getAgentDir(), "models.json"), options = {}) {
		return new ModelRegistry(authStorage, modelsJsonPath, options);
	}
	static inMemory(authStorage) {
		return new ModelRegistry(authStorage, void 0);
	}
	/** Creates a request-isolated registry from this lifecycle-owned catalog snapshot. */
	fork(authStorage, publishedModels) {
		return new ModelRegistry(authStorage, void 0, { sourceSnapshot: this }, publishedModels);
	}
	/**
	* Reload models from disk (models.json).
	*/
	refresh() {
		this.providerRequestConfigs.clear();
		this.modelRequestHeaders.clear();
		this.loadError = void 0;
		resetModelRegistryRuntime(this);
		getAuthStorageOAuthProviderRegistry(this.authStorage).reset();
		if (this.sourceSnapshot) {
			this.restoreSourceCatalog(this.sourceSnapshot);
			for (const oauthProvider of this.sourceSnapshot.oauthProviders) getAuthStorageOAuthProviderRegistry(this.authStorage).register(oauthProvider);
		} else {
			this.loadModels();
			this.baseCatalogSnapshot = this.captureCatalogSnapshot();
		}
		for (const [providerName, config] of this.registeredProviders.entries()) this.applyProviderConfig(providerName, config);
	}
	/** Get any root or generated plugin catalog load error. */
	getError() {
		return this.loadError;
	}
	/** Returns the exact plugin metadata generation captured with this registry. */
	getProviderMetadataOwners() {
		return this.pluginMetadataSnapshot?.owners;
	}
	loadModels() {
		const replace = this.config?.models?.mode === "replace";
		const customResult = !replace && this.modelsJsonPath && this.modelsJsonContents !== null ? this.loadCustomModels(this.modelsJsonPath, {
			...this.modelsJsonContents !== void 0 ? { contents: this.modelsJsonContents } : {},
			includePluginCatalogs: this.includePluginCatalogs && this.pluginCatalogs === void 0
		}) : emptyCustomModelsResult();
		const capturedPluginResult = !replace && this.includePluginCatalogs && this.pluginCatalogs !== void 0 ? this.loadCapturedPluginCatalogs(this.pluginCatalogs) : emptyCustomModelsResult();
		const errors = [customResult.error, capturedPluginResult.error].filter((error) => Boolean(error));
		if (!replace && this.modelsJsonPath && this.modelsJsonContents === void 0 && this.pluginCatalogs === void 0 && this.staticProviderConfigs === void 0 && this.includePluginCatalogs) {
			const inspected = inspectLegacyPluginModelCatalogs(dirname(this.modelsJsonPath));
			const diagnostics = [...inspected.warnings, ...inspected.catalogs.map(({ pathname }) => `Legacy generated provider catalog: ${pathname}`)];
			if (diagnostics.length > 0) errors.push(`${diagnostics.join("\n")}\nRun openclaw doctor --fix to verify and import legacy provider catalogs.`);
		}
		if (errors.length > 0) {
			this.loadError = errors.join("\n\n");
			log.warn(`model catalog load issue: ${this.loadError}`);
		}
		const providers = this.mergeProviderSources(replace ? {} : Object.fromEntries(Object.entries(this.staticProviderConfigs ?? {}).map(([provider, config]) => [provider, captureInventoryProvider(config, "static")])), capturedPluginResult.providers, customResult.providers);
		const sourceFields = buildSourceModelFields(materializeConfiguredProviderCatalogModels(this.config && projectConfigOntoRuntimeSourceSnapshot(this.config).models?.providers, { manifestPlugins: this.pluginMetadataSnapshot }));
		for (const [providerId, configured] of Object.entries(normalizeProviderMapKeys(materializeConfiguredProviderCatalogModels(this.config?.models?.providers, { manifestPlugins: this.pluginMetadataSnapshot })))) {
			const inherited = providers[providerId];
			const accepted = new Map(inherited?.models?.map((model) => [model.id, model]));
			const current = {
				api: configured.api,
				baseUrl: configured.baseUrl,
				models: configured.models?.map((model) => ({
					...model,
					api: model.api ?? accepted.get(model.id)?.api ?? configured.api,
					baseUrl: model.baseUrl ?? accepted.get(model.id)?.baseUrl ?? configured.baseUrl,
					maxTokensSource: "configured",
					headers: sanitizeModelHeaders(model.headers, { stripSecretRefMarkers: true })
				}))
			};
			providers[providerId] = inherited ? mergeProviderModels(captureInventoryProvider(inherited, "composed"), current, {
				providerId,
				modelIdMatching: "exact",
				sourceModelFields: sourceFields
			}) : current;
			this.providerRequestConfigs.delete(providerId);
			this.storeProviderRequestConfig(providerId, {
				apiKey: normalizeOptionalSecretInput(configured.apiKey),
				auth: configured.auth,
				authHeader: configured.authHeader,
				headers: sanitizeModelHeaders(configured.headers, { stripSecretRefMarkers: true })
			});
		}
		let combined = this.parseModels(providers);
		for (const oauthProvider of this.authStorage.getOAuthProviders()) {
			const cred = this.authStorage.get(oauthProvider.id);
			if (cred?.type === "oauth" && oauthProvider.modifyModels) combined = oauthProvider.modifyModels(combined, cred);
		}
		this.models = combined;
	}
	mergeProviderSources(...sources) {
		const providers = {};
		for (const source of sources) for (const [providerId, provider] of Object.entries(source)) {
			const existing = providers[providerId];
			providers[providerId] = existing ? mergeProviderModels(existing, provider, {
				providerId,
				modelIdMatching: "exact"
			}) : provider;
		}
		return providers;
	}
	loadCapturedPluginCatalogs(pluginCatalogs) {
		let providers = {};
		const errors = [];
		for (const pluginCatalog of pluginCatalogs) {
			const result = this.loadCustomModels(`sqlite:plugin-model-catalog/${pluginCatalog.pluginId}`, {
				catalogPluginId: pluginCatalog.pluginId,
				contents: pluginCatalog.contents,
				includePluginCatalogs: false,
				requireGeneratedCatalog: true
			});
			providers = this.mergeProviderSources(providers, result.providers);
			if (result.error) errors.push(result.error);
		}
		return {
			providers,
			error: errors.join("\n\n") || void 0
		};
	}
	loadCustomModels(modelsJsonPath, options = { includePluginCatalogs: true }) {
		if (options.contents === void 0 && !existsSync(modelsJsonPath)) return emptyCustomModelsResult();
		try {
			const content = options.contents ?? readFileSync(modelsJsonPath, "utf-8");
			const parsed = parseModelCatalogJson(content);
			if (options.requireGeneratedCatalog === true && !isGeneratedPluginModelCatalog(parsed)) return emptyCustomModelsResult();
			if (!validateModelsConfig.Check(parsed)) return emptyCustomModelsResult(`Invalid models.json schema:\n${validateModelsConfig.Errors(parsed).map((error) => `  - ${formatValidationPath(error)}: ${error.message}`).join("\n") || "Unknown schema error"}\n\nFile: ${modelsJsonPath}`);
			const config = parsed;
			const providers = options.requireGeneratedCatalog === true ? filterGeneratedPluginModelCatalogProviders({
				catalogPluginId: options.catalogPluginId,
				config: this.config,
				isProviderAvailable: (providerId) => this.authStorage.hasAuth(normalizeProviderId(providerId)) || hasUsableCustomProviderApiKey(this.config, providerId),
				parsedCatalog: parsed,
				pluginMetadataSnapshot: this.pluginMetadataSnapshot,
				providers: config.providers
			}) : config.providers;
			const configForUse = {
				...config,
				providers
			};
			if (options.requireGeneratedCatalog === true && Object.keys(providers).length === 0) return emptyCustomModelsResult();
			this.validateConfig(configForUse);
			const generated = options.requireGeneratedCatalog === true;
			const maxTokensSource = generated ? "discovered" : "configured";
			let sourceProviders = {};
			for (const [providerName, providerConfig] of Object.entries(configForUse.providers)) {
				if (!generated && (providerConfig.models ?? []).length > 0) this.storeProviderRequestConfig(providerName, providerConfig);
				sourceProviders[providerName] = {
					...generated ? {
						api: providerConfig.api,
						baseUrl: providerConfig.baseUrl,
						compat: providerConfig.compat
					} : providerConfig,
					models: providerConfig.models?.map((model) => {
						const { headers: _headers, ...inventory } = model;
						return Object.assign(generated ? inventory : model, {
							maxTokensSource,
							api: model.api ?? providerConfig.api,
							baseUrl: model.baseUrl ?? providerConfig.baseUrl,
							compat: mergeCompat(providerConfig.compat, model.compat)
						});
					})
				};
			}
			const pluginCatalogErrors = [];
			if (options.includePluginCatalogs !== false) {
				let pluginCatalogs = [];
				try {
					pluginCatalogs = loadPersistedPluginModelCatalogsReadOnly(dirname(modelsJsonPath));
				} catch (error) {
					pluginCatalogErrors.push(`Failed to load generated plugin model catalogs: ${error instanceof Error ? error.message : String(error)}`);
				}
				const pluginResult = this.loadCapturedPluginCatalogs(pluginCatalogs);
				sourceProviders = this.mergeProviderSources(pluginResult.providers, sourceProviders);
				if (pluginResult.error) pluginCatalogErrors.push(`${pluginResult.error}\nRun openclaw doctor --fix to repair persisted generated provider catalogs.`);
			}
			return {
				providers: sourceProviders,
				error: pluginCatalogErrors.join("\n\n") || void 0
			};
		} catch (error) {
			if (error instanceof SyntaxError) {
				if (options.requireGeneratedCatalog === true) return emptyCustomModelsResult();
				return emptyCustomModelsResult(`Failed to parse models.json: ${error.message}\n\nFile: ${modelsJsonPath}`);
			}
			return emptyCustomModelsResult(`Failed to load models.json: ${error instanceof Error ? error.message : String(error)}\n\nFile: ${modelsJsonPath}`);
		}
	}
	validateConfig(config) {
		for (const [providerName, providerConfig] of Object.entries(config.providers)) {
			const hasProviderApi = Boolean(providerConfig.api);
			const models = providerConfig.models ?? [];
			if (models.length === 0) continue;
			if (!providerConfig.baseUrl) throw new Error(`Provider ${providerName}: "baseUrl" is required when defining custom models.`);
			for (const modelDef of models) {
				const hasModelApi = Boolean(modelDef.api);
				if (!hasProviderApi && !hasModelApi) throw new Error(`Provider ${providerName}, model ${modelDef.id}: no "api" specified. Set at provider or model level.`);
				if (!modelDef.id) throw new Error(`Provider ${providerName}: model missing "id"`);
				if (modelDef.contextWindow !== void 0 && modelDef.contextWindow <= 0) throw new Error(`Provider ${providerName}, model ${modelDef.id}: invalid contextWindow`);
				if (modelDef.maxTokens !== void 0 && modelDef.maxTokens <= 0) throw new Error(`Provider ${providerName}, model ${modelDef.id}: invalid maxTokens`);
			}
		}
	}
	parseModels(providers) {
		const models = [];
		for (const [providerName, providerConfig] of Object.entries(providers)) {
			const modelDefs = providerConfig.models ?? [];
			if (modelDefs.length === 0) continue;
			for (const modelDef of modelDefs) {
				const api = modelDef.api ?? providerConfig.api;
				if (!api) continue;
				const baseUrl = modelDef.baseUrl ?? providerConfig.baseUrl;
				if (!baseUrl) continue;
				const runtimeInput = (modelDef.input ?? ["text"]).filter((input) => input === "text" || input === "image");
				if ((modelDef.input?.length ?? 0) > 0 && runtimeInput.length === 0) continue;
				this.storeModelHeaders(providerName, modelDef.id, modelDef.headers);
				models.push({
					id: modelDef.id,
					name: modelDef.name ?? modelDef.id,
					api,
					provider: providerName,
					baseUrl,
					reasoning: modelDef.reasoning ?? false,
					thinkingLevelMap: modelDef.thinkingLevelMap,
					input: runtimeInput,
					cost: normalizeResolvedPricing(modelDef.cost ?? {}),
					contextWindow: modelDef.contextWindow ?? 128e3,
					contextTokens: modelDef.contextTokens,
					contextWindows: modelDef.contextWindows,
					contextWindowDefault: modelDef.contextWindowDefault,
					maxTokens: modelDef.maxTokens ?? 16384,
					...modelDef.maxTokens !== void 0 ? { maxTokensSource: modelDef.maxTokensSource } : {},
					params: modelDef.params,
					headers: void 0,
					compat: modelDef.compat
				});
			}
		}
		return models;
	}
	/**
	* Get all configured models.
	*/
	getAll() {
		return this.models;
	}
	/**
	* Get only models that have auth configured.
	* This is a fast check that doesn't refresh OAuth tokens.
	*/
	getAvailable() {
		return this.models.filter((m) => this.hasConfiguredAuth(m));
	}
	/**
	* Find a model by provider and ID.
	*/
	find(provider, modelId) {
		return this.models.find((m) => m.provider === provider && m.id === modelId);
	}
	/**
	* Get API key for a model.
	*/
	hasConfiguredAuth(model) {
		const providerConfig = this.getModelProviderRequestConfig(model);
		return this.authStorage.hasAuth(model.provider) || providerConfig?.auth === "aws-sdk" || providerConfig?.apiKey !== void 0;
	}
	getModelProviderRequestConfig(model) {
		const config = this.providerRequestConfigs.get(model.provider);
		if (config?.baseUrls && !config.baseUrls.some((baseUrl) => modelTransportRoutesMatch({ baseUrl }, { baseUrl: model.baseUrl }))) return;
		return config;
	}
	getModelRequestKey(provider, modelId) {
		return JSON.stringify([provider, modelId]);
	}
	storeProviderRequestConfig(providerName, config) {
		if (!config.apiKey && !config.auth && !config.headers && !config.authHeader) return;
		this.providerRequestConfigs.set(providerName, {
			baseUrls: config.baseUrl ? [config.baseUrl, ...(config.models ?? []).flatMap((model) => model.baseUrl ?? [])] : void 0,
			apiKey: config.apiKey,
			auth: config.auth,
			headers: config.headers,
			authHeader: config.authHeader
		});
	}
	storeModelHeaders(providerName, modelId, headers) {
		const key = this.getModelRequestKey(providerName, modelId);
		if (!headers || Object.keys(headers).length === 0) {
			this.modelRequestHeaders.delete(key);
			return;
		}
		this.modelRequestHeaders.set(key, headers);
	}
	/**
	* Get API key and request headers for a model.
	*/
	async getApiKeyAndHeaders(model) {
		try {
			const providerConfig = this.getModelProviderRequestConfig(model);
			const usesAwsSdkAuth = providerConfig?.auth === "aws-sdk";
			const apiKey = (usesAwsSdkAuth ? void 0 : await this.authStorage.getApiKey(model.provider, {
				includeFallback: false,
				baseUrl: model.baseUrl
			})) ?? (!usesAwsSdkAuth && providerConfig?.apiKey ? resolveConfigValueOrThrow(providerConfig.apiKey, `API key for provider "${model.provider}"`) : void 0);
			const providerHeaders = resolveHeadersOrThrow(providerConfig?.headers, `provider "${model.provider}"`);
			const modelHeaders = resolveHeadersOrThrow(this.modelRequestHeaders.get(this.getModelRequestKey(model.provider, model.id)), `model "${model.provider}/${model.id}"`);
			let headers = model.headers || providerHeaders || modelHeaders ? {
				...model.headers,
				...providerHeaders,
				...modelHeaders
			} : void 0;
			if (providerConfig?.authHeader) {
				if (!apiKey) return {
					ok: false,
					error: `No API key found for "${model.provider}"`
				};
				headers = {
					...headers,
					Authorization: `Bearer ${apiKey}`
				};
			}
			return {
				ok: true,
				apiKey,
				headers: headers && Object.keys(headers).length > 0 ? headers : void 0
			};
		} catch (error) {
			return {
				ok: false,
				error: error instanceof Error ? error.message : String(error)
			};
		}
	}
	/**
	* Return auth status for a provider, including request auth configured in models.json.
	* This intentionally does not execute command-backed config values.
	*/
	getProviderAuthStatus(provider) {
		const providerRequestConfig = this.providerRequestConfigs.get(provider);
		if (providerRequestConfig?.auth === "aws-sdk") return {
			configured: true,
			source: "models_json_key",
			label: providerRequestConfig.auth
		};
		const authStatus = this.authStorage.getAuthStatus(provider);
		if (authStatus.source) return authStatus;
		const providerApiKey = providerRequestConfig?.apiKey;
		if (!providerApiKey) return authStatus;
		if (providerApiKey.startsWith("!")) return {
			configured: true,
			source: "models_json_command"
		};
		if (process.env[providerApiKey]) return {
			configured: true,
			source: "environment",
			label: providerApiKey
		};
		return {
			configured: true,
			source: "models_json_key"
		};
	}
	/**
	* Get display name for a provider.
	*/
	getProviderDisplayName(provider) {
		const registeredProvider = this.registeredProviders.get(provider);
		const oauthProvider = this.authStorage.getOAuthProviders().find((p) => p.id === provider);
		return registeredProvider?.name ?? registeredProvider?.oauth?.name ?? oauthProvider?.name ?? BUILT_IN_PROVIDER_DISPLAY_NAMES[provider] ?? provider;
	}
	/**
	* Get API key for a provider.
	*/
	async getApiKeyForProvider(provider) {
		const apiKey = await this.authStorage.getApiKey(provider, { includeFallback: false });
		if (apiKey !== void 0) return apiKey;
		const providerApiKey = this.providerRequestConfigs.get(provider)?.apiKey;
		return providerApiKey ? resolveConfigValueUncached(providerApiKey) : void 0;
	}
	/**
	* Check if a model is using OAuth credentials (subscription).
	*/
	isUsingOAuth(model) {
		return this.authStorage.get(model.provider)?.type === "oauth";
	}
	/**
	* Register a provider dynamically (from extensions).
	*
	* If provider has models: replaces all existing models for this provider.
	* Provider-level request settings are stored for already-known models but
	* never create implicit model rows.
	* If provider has oauth: registers OAuth provider for /login support.
	*/
	registerProvider(providerName, config) {
		this.validateProviderConfig(providerName, config);
		this.applyProviderConfig(providerName, config);
		this.upsertRegisteredProvider(providerName, config);
	}
	/**
	* Unregister a previously registered provider.
	*
	* Removes the provider from the registry and reloads models from disk.
	* Also resets dynamic OAuth and API stream registrations before reapplying
	* remaining dynamic providers.
	* Has no effect if the provider was never registered.
	*/
	unregisterProvider(providerName) {
		if (!this.registeredProviders.has(providerName)) return;
		this.registeredProviders.delete(providerName);
		this.refresh();
	}
	/**
	* Upsert a provider config into registeredProviders.
	* If the provider is already registered, defined values in the incoming config
	* override existing ones; undefined values are preserved from the stored config.
	* If the provider is not registered, the incoming config is stored as-is.
	*/
	upsertRegisteredProvider(providerName, config) {
		const existing = this.registeredProviders.get(providerName);
		if (!existing) {
			this.registeredProviders.set(providerName, config);
			return;
		}
		for (const k of Object.keys(config)) if (config[k] !== void 0) existing[k] = config[k];
	}
	validateProviderConfig(providerName, config) {
		if (config.streamSimple && !config.api) throw new Error(`Provider ${providerName}: "api" is required when registering streamSimple.`);
		if (!config.models || config.models.length === 0) return;
		if (!config.baseUrl) throw new Error(`Provider ${providerName}: "baseUrl" is required when defining models.`);
		for (const modelDef of config.models) if (!(modelDef.api || config.api)) throw new Error(`Provider ${providerName}, model ${modelDef.id}: no "api" specified.`);
	}
	applyProviderConfig(providerName, config) {
		if (config.oauth) {
			const oauthProvider = {
				...config.oauth,
				id: providerName
			};
			getAuthStorageOAuthProviderRegistry(this.authStorage).register(oauthProvider);
		}
		if (config.streamSimple) {
			const streamSimple = config.streamSimple;
			getModelRegistryRuntime(this).apiRegistry.registerApiProvider({
				api: config.api,
				stream: (model, context, options) => streamSimple(model, context, options),
				streamSimple
			}, `provider:${providerName}`);
		}
		this.storeProviderRequestConfig(providerName, config);
		if (config.models && config.models.length > 0) {
			this.models = this.models.filter((m) => m.provider !== providerName);
			for (const modelDef of config.models) {
				const api = modelDef.api || config.api;
				this.storeModelHeaders(providerName, modelDef.id, modelDef.headers);
				this.models.push({
					id: modelDef.id,
					name: modelDef.name,
					api,
					provider: providerName,
					baseUrl: modelDef.baseUrl ?? config.baseUrl,
					reasoning: modelDef.reasoning,
					thinkingLevelMap: modelDef.thinkingLevelMap,
					input: modelDef.input,
					cost: modelDef.cost,
					contextWindow: modelDef.contextWindow,
					contextTokens: modelDef.contextTokens,
					contextWindows: modelDef.contextWindows,
					contextWindowDefault: modelDef.contextWindowDefault,
					maxTokens: modelDef.maxTokens,
					params: modelDef.params,
					headers: void 0,
					compat: modelDef.compat
				});
			}
			if (config.oauth?.modifyModels) {
				const cred = this.authStorage.get(providerName);
				if (cred?.type === "oauth") this.models = config.oauth.modifyModels(this.models, cred);
			}
		}
	}
};
//#endregion
export { FILE_AUTH_STORAGE_BACKEND_DEPRECATION_CODE as a, resolveModelPluginMetadataSnapshot as c, AuthStorage as i, resolveModelWorkspaceDir as l, getModelRegistryRuntime as n, FileAuthStorageBackend as o, AUTH_STORAGE_CREATE_DEPRECATION_CODE as r, InMemoryAuthStorageBackend as s, ModelRegistry as t };
