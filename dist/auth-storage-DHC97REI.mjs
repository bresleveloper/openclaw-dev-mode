import { _ as AuthProfileStoreUnreadableError } from "./openclaw-state-worker-error-B93Lf_P2.mjs";
import { B as OAUTH_REFRESH_CALL_TIMEOUT_MS } from "./user-model-account-authority-DFFjC5J5.mjs";
import { i as isPendingOAuthRefreshFence, r as isOAuthRefreshFence } from "./oauth-refresh-marker-Dio1lCzm.mjs";
import { c as loadPersistedAuthProfileState, n as loadPersistedAuthProfileStore } from "./persisted-DbIYEoQ3.mjs";
import { L as resolveLegacyAuthProfileSourceCandidates, a as inspectPersistedAuthProfileStoreRaw, b as runAuthProfileWriteTransaction, i as inspectPersistedAuthProfileStateRaw, v as resolveAuthProfileDatabasePath } from "./sqlite-BlFpr2YD.mjs";
import { i as assertAuthProfileMigrationReady, r as assertAuthProfileMigrationCandidates, t as AuthProfileMigrationRequiredError } from "./legacy-source-diagnostic-CLlkIevG.mjs";
import { t as warnPluginSdkDeprecation } from "./sdk-deprecation-DjTmOhOX.mjs";
import { c as resolveProviderOAuthRefreshCapabilityWithPlugin, i as loginProviderOAuthWithPlugin, s as resolveProviderOAuthCredentialWithPlugin } from "./provider-runtime.runtime.js";
import { g as runAuthProfileStoreUpdate, x as publishAuthProfileStoreUpdate } from "./store-BPXZsh12.mjs";
import { S as saveAuthProfileStoreWithPreparedOwner, n as createAuthProfileStoreReadScopeAsync, t as createAuthProfileStoreReadScope } from "./store-runtime-CwqGD12G.mjs";
import { t as getAgentDir } from "./config-BWKdpC6X.mjs";
import { a as getBashShellEnv, i as getBashShellConfig, t as buildShellCommandInvocation } from "./shell-utils-bJwhgbCe.mjs";
import { n as OAuthProviderRegistry, t as OAuthProviderConfiguredUnavailableError } from "./provider-runtime.errors-VKEdQVPy.mjs";
import { a as refreshSerializedOAuthCredential, l as resolveAuthStorePathForDisplayAsync, n as normalizeOAuthRefreshCredential } from "./oauth-refresh-fence-eL04wGfj.mjs";
import fs from "node:fs";
import { dirname } from "node:path";
import { isDeepStrictEqual } from "node:util";
import { execSync, spawnSync } from "node:child_process";
import { findEnvKeys, getEnvApiKey } from "@openclaw/ai/internal/runtime";
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
function mergeResolvedOAuthCredential(credential, resolved) {
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
		commit: async (data) => {
			const expected = params.parse(JSON.stringify(data));
			const current = await params.storage.withLock((raw) => {
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
			return mergeResolvedOAuthCredential(credential, provider ? await getAuthStorageOAuthProviderRegistry(params.authStorage).getApiKey(params.providerId, oauthCredentials) : await resolveAuthStoragePluginOAuthCredential(params.providerId, credential, true));
		},
		resolve: async (credential) => {
			if (provider) return {
				apiKey: provider.getApiKey(credential),
				credential
			};
			return mergeResolvedOAuthCredential(credential, await resolveAuthStoragePluginOAuthCredential(params.providerId, credential, false));
		}
	});
	return result ? { apiKey: result.apiKey } : null;
}
//#endregion
//#region src/agents/sessions/auth-storage-projection.ts
function materializeAuthStorageStore(store, snapshots) {
	if (snapshots.length === 0) return store;
	const profiles = Object.fromEntries(Object.entries(store.profiles).map(([profileId, credential]) => {
		return [profileId, snapshots.map((snapshot) => snapshot.profiles[profileId]).find((candidate) => credential.type === "api_key" && credential.keyRef ? candidate?.type === "api_key" && Boolean(candidate.key) && candidate.provider === credential.provider && isDeepStrictEqual(candidate.keyRef, credential.keyRef) : credential.type === "token" && credential.tokenRef ? candidate?.type === "token" && Boolean(candidate.token) && candidate.provider === credential.provider && isDeepStrictEqual(candidate.tokenRef, credential.tokenRef) : false) ?? credential];
	}));
	return {
		...store,
		profiles
	};
}
function projectAuthoritativeAuthStorageData(store, snapshots) {
	const materialized = materializeAuthStorageStore(store, snapshots);
	assertAuthStorageSecretRefsMaterialized(materialized);
	const projected = {};
	for (const [profileId, credential] of Object.entries(materialized.profiles)) {
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
function applyAuthStorageData(store, data, materializedBaseline) {
	const profiles = { ...store.profiles };
	const projectedProviders = /* @__PURE__ */ new Set([...Object.keys(materializedBaseline), ...Object.entries(store.profiles).flatMap(([profileId, credential]) => profileId === `${credential.provider}:default` ? [credential.provider] : [])]);
	for (const provider of projectedProviders) if (!data[provider]) delete profiles[`${provider}:default`];
	for (const [provider, credential] of Object.entries(data)) {
		const profileId = `${provider}:default`;
		const existing = profiles[profileId];
		if (credential.type === "api_key" && existing?.type === "api_key" && existing.keyRef && materializedBaseline[provider]?.type === "api_key" && materializedBaseline[provider].key === credential.key || credential.type === "token" && existing?.type === "token" && existing.tokenRef && materializedBaseline[provider]?.type === "token" && materializedBaseline[provider].token === credential.token) {
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
	if (!config.startsWith("!")) return resolveConfigValueUncached(config);
	if (!commandResultCache.has(config)) commandResultCache.set(config, executeCommandUncached(config));
	return commandResultCache.get(config);
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
		if (result.error || result.status !== 0) return {
			executed: result.error?.code !== "ENOENT",
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
	if (process.platform === "win32") {
		const configuredResult = executeWithConfiguredShell(command);
		if (configuredResult.executed) return configuredResult.value;
	}
	return executeWithDefaultShell(command);
}
function resolveConfigValueUncached(config) {
	if (config.startsWith("!")) return executeCommandUncached(config);
	if (Object.hasOwn(process.env, config)) return process.env[config] || void 0;
	return config;
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
function warnSynchronousAuthStorage(method, replacement) {
	warnPluginSdkDeprecation({
		family: "auth-profile-sync-operations",
		method: `AuthStorage.${method}`,
		replacement: `AuthStorage.${replacement}`
	});
}
var AuthStorageLegacyPathMigrationRequiredError = class extends Error {
	constructor() {
		super("Deprecated AuthStorage path contains unmigrated credentials; run openclaw doctor --fix for standard agent auth.json or migrate plugin storage to AuthStorage.forAgentAsync(agentDir).");
		this.code = "AUTH_PROFILE_MIGRATION_REQUIRED";
		this.action = "migrate to AuthStorage.forAgentAsync(agentDir)";
		this.name = "AuthStorageLegacyPathMigrationRequiredError";
	}
};
function assertDeprecatedAuthStoragePathAbsent(authPath) {
	if (authPath && fs.existsSync(authPath)) throw new AuthStorageLegacyPathMigrationRequiredError();
}
function parseStorageData(content) {
	if (!content) return {};
	return JSON.parse(content);
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
	constructor(scope, preparedStore, asyncOnly = false) {
		this.scope = scope;
		this.preparedStore = preparedStore;
		this.asyncOnly = asyncOnly;
		this.credentialSources = /* @__PURE__ */ new Map();
		this.captureCredentialSources(preparedStore);
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
		this.assertSynchronousAccess("reloadAsync");
		return this.projectRead(this.scope.read());
	}
	async readAsync() {
		return this.projectRead(await this.scope.readAsync());
	}
	projectRead(store) {
		const content = JSON.stringify(projectAuthoritativeAuthStorageData(store, this.resolveMaterializedRuntimeStores()));
		this.captureCredentialSources(store);
		return content;
	}
	assertSynchronousAccess(replacement) {
		if (this.asyncOnly) throw new Error(`This AuthStorage instance requires ${replacement}().`);
	}
	resolveMaterializedRuntimeStores() {
		const current = this.scope.getRuntimeSnapshots();
		return current.length > 0 ? current : [this.preparedStore];
	}
	withLock(fn) {
		this.assertSynchronousAccess("setAsync() or removeAsync");
		const snapshots = this.resolveMaterializedRuntimeStores();
		assertAuthProfileMigrationReady(this.agentDir);
		const selected = runAuthProfileWriteTransaction(this.agentDir, (database, owner) => {
			const store = loadSqliteAuthStorageStore(this.agentDir, database);
			const materializedData = projectAuthoritativeAuthStorageData(store, snapshots);
			const { result, next } = fn(JSON.stringify(materializedData));
			let selectedStore = store;
			if (next !== void 0) {
				selectedStore = applyAuthStorageData(store, parseStorageData(next), materializedData);
				saveAuthProfileStoreWithPreparedOwner(selectedStore, this.agentDir, {
					filterExternalAuthProfiles: false,
					preserveStateProfileIds: collectStateOnlyAuthProfileIds(store),
					syncExternalCli: false
				}, database, owner);
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
	async updateAsync(fn) {
		let selected;
		await runAuthProfileStoreUpdate({
			agentDir: this.agentDir,
			envOnly: this.scope.envOnly,
			options: { env: this.scope.env },
			update: ({ store }, owner) => {
				assertAuthProfileMigrationCandidates({
					databasePath: owner.databasePath,
					candidates: resolveLegacyAuthProfileSourceCandidates({
						agentDir: this.agentDir,
						env: owner.env
					}),
					hasCredentials: () => Object.keys(store.profiles).length > 0
				});
				const materializedData = projectAuthoritativeAuthStorageData(store, this.resolveMaterializedRuntimeStores());
				const { result, next } = fn(JSON.stringify(materializedData));
				const nextStore = next === void 0 ? store : applyAuthStorageData(store, parseStorageData(next), materializedData);
				selected = {
					result,
					store: nextStore,
					databasePath: owner.databasePath
				};
				return next === void 0 ? { save: false } : {
					save: true,
					store: nextStore,
					externalProfiles: [],
					options: {
						filterExternalAuthProfiles: false,
						preserveStateProfileIds: collectStateOnlyAuthProfileIds(store),
						syncExternalCli: false
					}
				};
			},
			async publish(committed, owner, assertCurrent, nativeCommits, committedIsCurrent) {
				if (committed) await publishAuthProfileStoreUpdate(owner, committed, assertCurrent, nativeCommits, committedIsCurrent);
			}
		});
		this.captureCredentialSources(selected.store, selected.databasePath);
		return selected.result;
	}
};
var InMemoryAuthStorageBackend = class {
	withLock(fn) {
		const { result, next } = fn(this.value);
		if (next !== void 0) this.value = next;
		return result;
	}
};
/**
* Provider-keyed credential facade backed by the canonical auth-profile store.
*/
var AuthStorage = class AuthStorage {
	static {
		this.resolvePathForDisplayAsync = resolveAuthStorePathForDisplayAsync;
	}
	constructor(storage, data) {
		this.data = {};
		this.credentialSources = /* @__PURE__ */ new Map();
		this.runtimeOverrides = /* @__PURE__ */ new Map();
		this.loadError = null;
		this.errors = [];
		this.storage = storage;
		if (data) this.setData(data);
		else this.loadFromStorage();
	}
	/** @deprecated Use forAgentAsync. Supported through 2026-12-31. */
	static forAgent(agentDir = getAgentDir(), config) {
		warnSynchronousAuthStorage("forAgent", "forAgentAsync");
		const scope = createAuthProfileStoreReadScope(agentDir, config);
		const preparedStore = materializeAuthStorageStore(scope.store, scope.getRuntimeSnapshots());
		assertAuthStorageSecretRefsMaterialized(preparedStore);
		return new AuthStorage(new SqliteAuthStorageBackend(scope, preparedStore));
	}
	static async forAgentAsync(agentDir = getAgentDir(), config) {
		const scope = await createAuthProfileStoreReadScopeAsync(agentDir, config);
		const preparedStore = materializeAuthStorageStore(scope.store, scope.getRuntimeSnapshots());
		assertAuthStorageSecretRefsMaterialized(preparedStore);
		const backend = new SqliteAuthStorageBackend(scope, preparedStore, true);
		const data = projectAuthoritativeAuthStorageData(scope.store, scope.getRuntimeSnapshots());
		return new AuthStorage(backend, data);
	}
	/**
	* @deprecated Use AuthStorage.forAgentAsync(agentDir). The path-taking compatibility
	* form remains supported through 2026-12-31; removal ships in the first
	* January 2027 stable. It no longer reads or writes JSON.
	*/
	static create(authPath) {
		warnSynchronousAuthStorage("create", "forAgentAsync");
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
		return new AuthStorage(storage);
	}
	/**
	* Set a runtime API key override (not persisted to disk).
	* Used for CLI --api-key flag.
	*/
	setRuntimeApiKey(provider, apiKey) {
		this.runtimeOverrides.set(provider, apiKey);
	}
	removeRuntimeApiKey(provider) {
		this.runtimeOverrides.delete(provider);
	}
	/**
	* Set a fallback resolver for API keys not found in canonical storage or env vars.
	* Used for custom provider keys from models.json.
	*/
	setFallbackResolver(resolver) {
		this.fallbackResolver = resolver;
	}
	recordError(error) {
		const normalizedError = error instanceof Error ? error : new Error(String(error));
		this.errors.push(normalizedError);
		return normalizedError;
	}
	getCanonicalLoadError() {
		if (!this.loadError) return null;
		return this.storage.assertProviderReady || this.loadError instanceof AuthProfileMigrationRequiredError || this.loadError instanceof AuthProfileStoreUnreadableError ? this.loadError : null;
	}
	assertProviderReady(providerId, options) {
		this.storage.assertProviderReady?.(providerId, options?.baseUrl);
		const error = this.getCanonicalLoadError();
		if (error) throw error;
	}
	setData(data) {
		this.data = data;
		this.credentialSources = new Map(Object.keys(data).flatMap((provider) => {
			const source = this.storage.getCredentialSource?.(provider);
			return source ? [[provider, source]] : [];
		}));
	}
	/** @deprecated Use reloadAsync. Supported through 2026-12-31. */
	reload() {
		warnSynchronousAuthStorage("reload", "reloadAsync");
		this.loadFromStorage();
	}
	loadFromStorage() {
		try {
			const content = this.storage.read ? this.storage.read() : this.storage.withLock((current) => ({ result: current }));
			this.setData(parseStorageData(content));
			this.loadError = null;
		} catch (error) {
			this.loadError = this.recordError(error);
		}
	}
	async reloadAsync() {
		try {
			const content = this.storage.readAsync ? await this.storage.readAsync() : this.storage.read ? this.storage.read() : this.storage.withLock((current) => ({ result: current }));
			this.setData(parseStorageData(content));
			this.loadError = null;
		} catch (error) {
			this.loadError = this.recordError(error);
		}
	}
	mergeProviderChange(current, provider, credential) {
		const merged = { ...parseStorageData(current) };
		if (credential) merged[provider] = credential;
		else delete merged[provider];
		return {
			result: merged,
			next: JSON.stringify(merged, null, 2)
		};
	}
	persistProviderChange(provider, credential) {
		if (this.loadError) this.loadFromStorage();
		if (this.loadError) {
			const error = new AuthStoragePersistenceError(`Cannot update auth storage because it could not be loaded: ${this.loadError.message}`, this.loadError);
			this.recordError(error);
			throw error;
		}
		try {
			const persistedData = this.storage.withLock((current) => this.mergeProviderChange(current, provider, credential));
			this.loadError = null;
			this.setData(persistedData);
		} catch (error) {
			this.failProviderChange(provider, error);
		}
	}
	async persistProviderChangeAsync(provider, credential) {
		try {
			const update = (current) => this.mergeProviderChange(current, provider, credential);
			const persistedData = this.storage.updateAsync ? await this.storage.updateAsync(update) : this.storage.withLock(update);
			this.loadError = null;
			this.setData(persistedData);
		} catch (error) {
			this.failProviderChange(provider, error);
		}
	}
	failProviderChange(provider, error) {
		const persistenceError = error instanceof AuthStoragePersistenceError ? error : new AuthStoragePersistenceError(`Failed to persist auth storage update for provider "${provider}": ${error instanceof Error ? error.message : String(error)}`, error);
		this.recordError(persistenceError);
		throw persistenceError;
	}
	get(provider) {
		const credential = this.data[provider];
		return isAuthStorageOAuthRefreshFence(provider, credential) ? void 0 : credential;
	}
	/** @deprecated Use setAsync. Supported through 2026-12-31. */
	set(provider, credential) {
		warnSynchronousAuthStorage("set", "setAsync");
		this.persistProviderChange(provider, credential);
	}
	setAsync(provider, credential) {
		return this.persistProviderChangeAsync(provider, credential);
	}
	/** @deprecated Use removeAsync. Supported through 2026-12-31. */
	remove(provider) {
		warnSynchronousAuthStorage("remove", "removeAsync");
		this.persistProviderChange(provider, void 0);
	}
	removeAsync(provider) {
		return this.persistProviderChangeAsync(provider, void 0);
	}
	list() {
		return Object.keys(this.data).filter((provider) => !isAuthStorageOAuthRefreshFence(provider, this.data[provider]));
	}
	has(provider) {
		return this.get(provider) !== void 0;
	}
	/**
	* Check if any form of auth is configured for a provider.
	* Unlike getApiKey(), this doesn't refresh OAuth tokens.
	*/
	hasAuth(provider) {
		return Boolean(this.runtimeOverrides.has(provider) || this.get(provider) || getEnvApiKey(provider) || this.fallbackResolver?.(provider));
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
	async login(providerId, callbacks) {
		const credentials = await loginAuthStorageOAuthProvider(this, providerId, callbacks);
		await this.setAsync(providerId, {
			type: "oauth",
			...credentials
		});
	}
	/** @deprecated Use logoutAsync. Supported through 2026-12-31. */
	logout(provider) {
		warnSynchronousAuthStorage("logout", "logoutAsync");
		this.remove(provider);
	}
	logoutAsync(provider) {
		return this.removeAsync(provider);
	}
	/**
	* Refresh OAuth token with backend locking to prevent race conditions.
	* Multiple agent sessions may try to refresh simultaneously when tokens expire.
	*/
	async refreshOAuthTokenWithLock(providerId) {
		let source;
		const result = await refreshAuthStorageOAuthCredential({
			authStorage: this,
			storage: { withLock: (update) => this.storage.updateAsync ? this.storage.updateAsync(update) : this.storage.withLock(update) },
			providerId,
			parse: parseStorageData,
			commit: (data) => {
				this.setData(data);
				source = this.credentialSources.get(providerId);
				this.loadError = null;
			}
		});
		if (!result) {
			await this.reloadAsync();
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
	* 2. API key from canonical storage
	* 3. OAuth token from canonical storage (auto-refreshed with locking)
	* 4. Environment variable
	* 5. Fallback resolver (models.json custom providers)
	*/
	async getApiKey(providerId, options) {
		const runtimeKey = this.runtimeOverrides.get(providerId);
		if (runtimeKey) return runtimeKey;
		if (this.storage.readAsync) await this.reloadAsync();
		this.assertProviderReady(providerId, options);
		const { apiKey, source } = await this.resolveStoredOrFallbackApiKey(providerId, options);
		this.assertProviderReady(providerId, options);
		if (source) this.storage.assertCredentialReady?.(source, options?.baseUrl);
		return apiKey;
	}
	async resolveStoredOrFallbackApiKey(providerId, options) {
		let cred = this.data[providerId];
		if (isAuthStorageOAuthRefreshFence(providerId, cred)) {
			await this.reloadAsync();
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
		if (cred?.type === "api_key" && !cred.nativeAuth) return resolved(resolveConfigValue(cred.key));
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
				await this.reloadAsync();
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
	getOAuthProviders() {
		return getAuthStorageOAuthProviderRegistry(this).getAll();
	}
};
//#endregion
export { getAuthStorageOAuthProviderRegistry as a, resolveHeadersOrThrow as i, resolveConfigValueOrThrow as n, resolveConfigValueUncached as r, AuthStorage as t };
