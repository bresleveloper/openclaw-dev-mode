import { c as withTimeout$1 } from "./fs-safe-aqmM_n6V.js";
import { s as resolveDefaultAgentDir } from "./agent-scope-config-C3ijpoNo.js";
import { r as resolveProviderIdForAuth } from "./provider-auth-aliases-CNlVI3wV.js";
import { F as hasUsableOAuthCredential, a as findPersistedAuthProfileCredential, f as resolvePersistedAuthProfileOwnerAgentDir, l as loadAuthProfileStoreForSecretsRuntime, n as ensureAuthProfileStore } from "./store-SfOB_T2S.js";
import { n as resolveApiKeyForProfile, t as refreshOAuthCredentialForRuntime } from "./oauth-De-NOeYf.js";
import { i as resolveAuthProfileOrder } from "./order-DO7M8GzY.js";
import "./security-runtime-ZGC3cmUc.js";
import "./provider-auth-DKbeFxjY.js";
import "./agent-runtime-BmugPmWq.js";
import { d as resolveCodexAppServerRuntimeOptions, r as codexAppServerStartOptionsKey } from "./config-BtjLOBqH.js";
import { c as resolveCodexAppServerSpawnEnv, o as MANAGED_CODEX_APP_SERVER_PACKAGE, t as CodexAppServerClient } from "./client-DLIo_o44.js";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import fs, { constants, readFileSync } from "node:fs";
import path from "node:path";
import fs$1, { access } from "node:fs/promises";
import os from "node:os";
import { createHash } from "node:crypto";
import { isDeepStrictEqual } from "node:util";
//#region extensions/codex/src/app-server/auth-bridge.ts
const CODEX_APP_SERVER_AUTH_PROVIDER = "openai";
const OPENAI_CODEX_APP_SERVER_AUTH_PROVIDER = "openai-codex";
const LEGACY_CODEX_APP_SERVER_AUTH_PROVIDER = "codex-cli";
const CODEX_APP_SERVER_EXTERNAL_CLI_PROVIDER_IDS = [CODEX_APP_SERVER_AUTH_PROVIDER, LEGACY_CODEX_APP_SERVER_AUTH_PROVIDER];
const OPENAI_PROVIDER = "openai";
const OPENAI_CODEX_DEFAULT_PROFILE_ID = "openai:default";
const CODEX_HOME_ENV_VAR = "CODEX_HOME";
const HOME_ENV_VAR = "HOME";
const CODEX_APP_SERVER_HOME_DIRNAME = "codex-home";
const CODEX_APP_SERVER_API_KEY_ENV_VARS = ["CODEX_API_KEY", "OPENAI_API_KEY"];
const CODEX_APP_SERVER_HOME_ENV_VARS = [CODEX_HOME_ENV_VAR, HOME_ENV_VAR];
const CODEX_AUTH_JSON_FILENAME = "auth.json";
const CODEX_HOME_DIRNAME = ".codex";
const scopedOAuthRefreshQueues = /* @__PURE__ */ new WeakMap();
async function bridgeCodexAppServerStartOptions(params) {
	if (params.startOptions.transport !== "stdio") return params.startOptions;
	const isolatedStartOptions = await withAgentCodexHomeEnvironment(params.startOptions, params.agentDir);
	if (params.authProfileId === null) return isolatedStartOptions;
	const store = resolveCodexAppServerAuthProfileStore({
		agentDir: params.agentDir,
		authProfileId: params.authProfileId,
		authProfileStore: params.authProfileStore,
		config: params.config
	});
	return shouldClearOpenAiApiKeyForCodexAuthProfile({
		store,
		authProfileId: resolveCodexAppServerAuthProfileId({
			authProfileId: params.authProfileId,
			store,
			config: params.config
		}),
		config: params.config
	}) ? withClearedEnvironmentVariables(isolatedStartOptions, CODEX_APP_SERVER_API_KEY_ENV_VARS) : isolatedStartOptions;
}
function resolveCodexAppServerAuthProfileId(params) {
	const requested = params.authProfileId?.trim();
	if (requested) return requested;
	return resolveAuthProfileOrder({
		cfg: params.config,
		store: params.store,
		provider: CODEX_APP_SERVER_AUTH_PROVIDER
	})[0]?.trim();
}
function resolveCodexAppServerAuthProfileIdForAgent(params) {
	const store = resolveCodexAppServerAuthProfileStore({
		agentDir: params.agentDir?.trim() || resolveDefaultAgentDir(params.config ?? {}),
		authProfileId: params.authProfileId,
		authProfileStore: params.authProfileStore,
		config: params.config
	});
	return resolveCodexAppServerAuthProfileId({
		authProfileId: params.authProfileId,
		store,
		config: params.config
	});
}
function ensureCodexAppServerAuthProfileStore(params) {
	return ensureAuthProfileStore(params.agentDir, {
		allowKeychainPrompt: false,
		config: params.config,
		externalCliProviderIds: CODEX_APP_SERVER_EXTERNAL_CLI_PROVIDER_IDS,
		...params.authProfileId ? { externalCliProfileIds: [params.authProfileId] } : {}
	});
}
function resolveCodexAppServerAuthProfileStore(params) {
	if (params.authProfileStore) {
		const providedProfileId = resolveCodexAppServerAuthProfileId({
			authProfileId: params.authProfileId,
			store: params.authProfileStore,
			config: params.config
		});
		if (providedProfileId && params.authProfileStore.profiles[providedProfileId]) return params.authProfileStore;
	}
	const overlaidStore = ensureCodexAppServerAuthProfileStore({
		agentDir: params.agentDir,
		authProfileId: params.authProfileId,
		config: params.config
	});
	if (!params.authProfileStore) return overlaidStore;
	const order = params.authProfileStore.order || overlaidStore.order ? {
		...overlaidStore.order,
		...params.authProfileStore.order
	} : void 0;
	const profiles = {
		...overlaidStore.profiles,
		...params.authProfileStore.profiles
	};
	const suppliedProfileIds = new Set(Object.keys(params.authProfileStore.profiles));
	const mergeRuntimeProfileIds = (overlaidIds, suppliedIds) => [...(overlaidIds ?? []).filter((profileId) => !suppliedProfileIds.has(profileId)), ...suppliedIds ?? []];
	const runtimePersistedProfileIds = mergeRuntimeProfileIds(overlaidStore.runtimePersistedProfileIds, params.authProfileStore.runtimePersistedProfileIds).filter((profileId) => profiles[profileId]);
	const runtimeExternalProfileIds = mergeRuntimeProfileIds(overlaidStore.runtimeExternalProfileIds, params.authProfileStore.runtimeExternalProfileIds).filter((profileId) => profiles[profileId]);
	const runtimeExternalProfileIdsAuthoritative = overlaidStore.runtimeExternalProfileIdsAuthoritative === true || params.authProfileStore.runtimeExternalProfileIdsAuthoritative === true;
	return {
		...params.authProfileStore,
		...order ? { order } : {},
		profiles,
		...runtimePersistedProfileIds.length > 0 ? { runtimePersistedProfileIds: [...new Set(runtimePersistedProfileIds)] } : {},
		...runtimeExternalProfileIds.length > 0 || runtimeExternalProfileIdsAuthoritative ? {
			runtimeExternalProfileIds: [...new Set(runtimeExternalProfileIds)],
			...runtimeExternalProfileIdsAuthoritative ? { runtimeExternalProfileIdsAuthoritative: true } : {}
		} : {}
	};
}
async function resolveCodexAppServerAuthAccountCacheKey(params) {
	const agentDir = params.agentDir?.trim() || resolveDefaultAgentDir(params.config ?? {});
	const store = resolveCodexAppServerAuthProfileStore({
		agentDir,
		authProfileId: params.authProfileId,
		authProfileStore: params.authProfileStore,
		config: params.config
	});
	const profileId = resolveCodexAppServerAuthProfileId({
		authProfileId: params.authProfileId,
		store,
		config: params.config
	});
	if (!profileId) return;
	const credential = store.profiles[profileId];
	if (!credential || !isCodexAppServerAuthProfileCredential(credential, params.config)) return;
	if (credential.type === "api_key") {
		const apiKey = (await resolveApiKeyForProfile({
			store,
			profileId,
			agentDir
		}))?.apiKey?.trim();
		return apiKey ? `${resolveChatgptAccountId(profileId, credential)}:${fingerprintApiKeyAuthProfileCacheKey(apiKey)}` : resolveChatgptAccountId(profileId, credential);
	}
	if (credential.type === "token") {
		const accessToken = (await resolveApiKeyForProfile({
			store,
			profileId,
			agentDir
		}))?.apiKey?.trim();
		return accessToken ? `${resolveChatgptAccountId(profileId, credential)}:${fingerprintTokenAuthProfileCacheKey(accessToken)}` : resolveChatgptAccountId(profileId, credential);
	}
	return resolveChatgptAccountId(profileId, credential);
}
function resolveCodexAppServerEnvApiKeyCacheKey(params) {
	if (params.startOptions.transport !== "stdio") return;
	const apiKey = readFirstNonEmptyEnvEntry(resolveCodexAppServerSpawnEnv(params.startOptions, params.baseEnv ?? process.env, params.platform ?? process.platform), CODEX_APP_SERVER_API_KEY_ENV_VARS);
	if (!apiKey) return;
	const hash = createHash("sha256");
	hash.update("openclaw:codex:app-server-env-api-key:v1");
	hash.update("\0");
	hash.update(apiKey.key);
	hash.update("\0");
	hash.update(apiKey.value);
	return `${apiKey.key}:sha256:${hash.digest("hex")}`;
}
function resolveCodexAppServerFallbackApiKeyCacheKey(params) {
	if (params.startOptions.transport !== "stdio") return;
	return resolveCodexAppServerEnvApiKeyCacheKey(params) ?? resolveCodexCliAuthFileApiKeyCacheKey(params.baseEnv ?? process.env);
}
function fingerprintApiKeyAuthProfileCacheKey(apiKey) {
	const hash = createHash("sha256");
	hash.update("openclaw:codex:app-server-auth-profile-api-key:v1");
	hash.update("\0");
	hash.update(apiKey);
	return `api_key:sha256:${hash.digest("hex")}`;
}
function fingerprintTokenAuthProfileCacheKey(accessToken) {
	const hash = createHash("sha256");
	hash.update("openclaw:codex:app-server-auth-profile-token:v1");
	hash.update("\0");
	hash.update(accessToken);
	return `token:sha256:${hash.digest("hex")}`;
}
function fingerprintCodexCliAuthFileApiKeyCacheKey(apiKey) {
	const hash = createHash("sha256");
	hash.update("openclaw:codex:app-server-cli-auth-json-api-key:v1");
	hash.update("\0");
	hash.update(apiKey);
	return `CODEX_AUTH_JSON:sha256:${hash.digest("hex")}`;
}
function resolveCodexAppServerHomeDir(agentDir) {
	return path.join(path.resolve(agentDir), CODEX_APP_SERVER_HOME_DIRNAME);
}
async function withAgentCodexHomeEnvironment(startOptions, agentDir) {
	const codexHome = startOptions.env?.[CODEX_HOME_ENV_VAR]?.trim() ? startOptions.env[CODEX_HOME_ENV_VAR] : resolveCodexAppServerHomeDir(agentDir);
	const nativeHome = startOptions.env?.[HOME_ENV_VAR]?.trim() ? startOptions.env[HOME_ENV_VAR] : void 0;
	await fs$1.mkdir(codexHome, { recursive: true });
	if (nativeHome) await fs$1.mkdir(nativeHome, { recursive: true });
	const nextStartOptions = {
		...startOptions,
		env: {
			...startOptions.env,
			[CODEX_HOME_ENV_VAR]: codexHome,
			...nativeHome ? { [HOME_ENV_VAR]: nativeHome } : {}
		}
	};
	const clearEnv = withoutClearedCodexHomeEnv(startOptions.clearEnv);
	if (clearEnv) nextStartOptions.clearEnv = clearEnv;
	else delete nextStartOptions.clearEnv;
	return nextStartOptions;
}
function withoutClearedCodexHomeEnv(clearEnv) {
	if (!clearEnv) return;
	const reserved = new Set(CODEX_APP_SERVER_HOME_ENV_VARS);
	const filtered = clearEnv.filter((envVar) => !reserved.has(envVar.trim().toUpperCase()));
	return filtered.length === clearEnv.length ? clearEnv : filtered;
}
async function applyCodexAppServerAuthProfile(params) {
	if (params.authProfileId === null) return;
	const loginParams = await resolveCodexAppServerAuthProfileLoginParams({
		agentDir: params.agentDir,
		authProfileId: params.authProfileId,
		authProfileStore: params.authProfileStore,
		config: params.config
	});
	if (!loginParams) {
		if (params.startOptions?.transport !== "stdio") return;
		const env = resolveCodexAppServerSpawnEnv(params.startOptions, process.env);
		const fallbackLoginParams = await resolveCodexAppServerFallbackApiKeyLoginParams({
			client: params.client,
			env,
			codexCliAuthEnv: process.env
		});
		if (fallbackLoginParams) await params.client.request("account/login/start", fallbackLoginParams);
		return;
	}
	await params.client.request("account/login/start", loginParams);
}
function resolveCodexAppServerAuthProfileLoginParams(params) {
	return resolveCodexAppServerAuthProfileLoginParamsInternal(params);
}
async function refreshCodexAppServerAuthTokens(params) {
	const loginParams = await resolveCodexAppServerAuthProfileLoginParamsInternal({
		...params,
		forceOAuthRefresh: true
	});
	if (!loginParams || loginParams.type !== "chatgptAuthTokens") throw new Error("Codex app-server ChatGPT token refresh requires an OAuth auth profile.");
	return {
		accessToken: loginParams.accessToken,
		chatgptAccountId: loginParams.chatgptAccountId,
		chatgptPlanType: loginParams.chatgptPlanType ?? null
	};
}
async function resolveCodexAppServerAuthProfileLoginParamsInternal(params) {
	const store = resolveCodexAppServerAuthProfileStore({
		agentDir: params.agentDir,
		authProfileId: params.authProfileId,
		authProfileStore: params.authProfileStore,
		config: params.config
	});
	const profileId = resolveCodexAppServerAuthProfileId({
		authProfileId: params.authProfileId,
		store,
		config: params.config
	});
	if (!profileId) return;
	const credential = store.profiles[profileId];
	if (!credential) throw new Error(`Codex app-server auth profile "${profileId}" was not found.`);
	if (!isCodexAppServerAuthProfileCredential(credential, params.config)) throw new Error(`Codex app-server auth profile "${profileId}" must be OpenAI Codex auth or an OpenAI API-key backup.`);
	const loginParams = await resolveLoginParamsForCredential(profileId, credential, {
		agentDir: params.agentDir,
		store,
		preferStoreCredential: Boolean(params.authProfileStore?.profiles[profileId]),
		forceOAuthRefresh: params.forceOAuthRefresh === true,
		config: params.config
	});
	if (!loginParams) throw new Error(`Codex app-server auth profile "${profileId}" does not contain usable credentials.`);
	return loginParams;
}
async function resolveCodexAppServerFallbackApiKeyLoginParams(params) {
	const apiKey = readFirstNonEmptyEnv(params.env, CODEX_APP_SERVER_API_KEY_ENV_VARS) ?? await readCodexCliAuthFileApiKey(params.codexCliAuthEnv);
	if (!apiKey) return;
	if ((await params.client.request("account/read", { refreshToken: false })).account) return;
	return {
		type: "apiKey",
		apiKey
	};
}
function resolveCodexCliAuthFilePath(env) {
	const configuredCodexHome = env[CODEX_HOME_ENV_VAR]?.trim();
	if (configuredCodexHome) return path.join(resolveHomeRelativePath(configuredCodexHome, env), CODEX_AUTH_JSON_FILENAME);
	const home = env[HOME_ENV_VAR]?.trim() || env.USERPROFILE?.trim() || os.homedir();
	return path.join(home, CODEX_HOME_DIRNAME, CODEX_AUTH_JSON_FILENAME);
}
function resolveHomeRelativePath(value, env) {
	if (value === "~" || value.startsWith("~/") || value.startsWith("~\\")) {
		const home = env[HOME_ENV_VAR]?.trim() || env.USERPROFILE?.trim() || os.homedir();
		return path.join(home, value.slice(value === "~" ? 1 : 2));
	}
	return value;
}
function parseCodexCliAuthFileApiKey(raw) {
	let parsed;
	try {
		parsed = JSON.parse(raw);
	} catch {
		return;
	}
	if (!parsed || typeof parsed !== "object") return;
	const apiKey = parsed.OPENAI_API_KEY;
	return typeof apiKey === "string" && apiKey.trim() ? apiKey.trim() : void 0;
}
async function readCodexCliAuthFileApiKey(env) {
	try {
		return parseCodexCliAuthFileApiKey(await fs$1.readFile(resolveCodexCliAuthFilePath(env), "utf8"));
	} catch {
		return;
	}
}
function resolveCodexCliAuthFileApiKeyCacheKey(env) {
	try {
		const apiKey = parseCodexCliAuthFileApiKey(fs.readFileSync(resolveCodexCliAuthFilePath(env), "utf8"));
		return apiKey ? fingerprintCodexCliAuthFileApiKeyCacheKey(apiKey) : void 0;
	} catch {
		return;
	}
}
async function resolveLoginParamsForCredential(profileId, credential, params) {
	if (credential.type === "api_key") {
		const apiKey = (await resolveApiKeyForProfile({
			store: params.preferStoreCredential ? params.store : ensureAuthProfileStore(params.agentDir, { allowKeychainPrompt: false }),
			profileId,
			agentDir: params.agentDir
		}))?.apiKey?.trim();
		return apiKey ? {
			type: "apiKey",
			apiKey
		} : void 0;
	}
	if (credential.type === "token") {
		const accessToken = (await resolveApiKeyForProfile({
			store: params.preferStoreCredential ? params.store : ensureAuthProfileStore(params.agentDir, { allowKeychainPrompt: false }),
			profileId,
			agentDir: params.agentDir
		}))?.apiKey?.trim();
		return accessToken ? buildChatgptAuthTokensParams(profileId, credential, accessToken) : void 0;
	}
	if (credential.type !== "oauth") return;
	const resolvedCredential = await resolveOAuthCredentialForCodexAppServer(profileId, credential, {
		agentDir: params.agentDir,
		store: params.store,
		preferStoreCredential: params.preferStoreCredential,
		forceRefresh: params.forceOAuthRefresh,
		config: params.config
	});
	const accessToken = resolvedCredential.access?.trim();
	return accessToken ? buildChatgptAuthTokensParams(profileId, resolvedCredential, accessToken) : void 0;
}
async function resolveOAuthCredentialForCodexAppServer(profileId, credential, params) {
	const ownerAgentDir = resolvePersistedAuthProfileOwnerAgentDir({
		agentDir: params.agentDir,
		profileId
	});
	const persistedCredential = findPersistedAuthProfileCredential({
		agentDir: ownerAgentDir,
		profileId
	});
	const useScopedCredential = params.preferStoreCredential && shouldUseScopedOAuthCredential({
		store: params.store,
		profileId,
		persistedCredential,
		suppliedCredential: credential,
		config: params.config
	});
	const store = useScopedCredential ? params.store : ensureCodexAppServerAuthProfileStore({
		agentDir: ownerAgentDir,
		authProfileId: profileId,
		config: params.config
	});
	const persistedOAuthCredential = !useScopedCredential && persistedCredential?.type === "oauth" && isCodexAppServerAuthProvider(persistedCredential.provider, params.config) ? persistedCredential : void 0;
	const ownerCredential = store.profiles[profileId];
	const overlaidOAuthCredential = ownerCredential?.type === "oauth" && isCodexAppServerAuthProvider(ownerCredential.provider, params.config) ? ownerCredential : void 0;
	if (useScopedCredential && overlaidOAuthCredential) return await resolveScopedOAuthCredential({
		store,
		profileId,
		credential: overlaidOAuthCredential,
		forceRefresh: params.forceRefresh
	});
	if (params.forceRefresh && !persistedOAuthCredential && overlaidOAuthCredential) {
		const refreshedRuntimeCredential = await refreshOAuthCredentialForRuntime({ credential: overlaidOAuthCredential });
		if (!refreshedRuntimeCredential?.access?.trim()) throw new Error(`Codex app-server auth profile "${profileId}" could not refresh.`);
		store.profiles[profileId] = refreshedRuntimeCredential;
		return refreshedRuntimeCredential;
	}
	const resolved = await resolveApiKeyForProfile({
		store,
		profileId,
		agentDir: ownerAgentDir,
		forceRefresh: params.forceRefresh && Boolean(persistedOAuthCredential)
	});
	const refreshed = useScopedCredential ? void 0 : loadAuthProfileStoreForSecretsRuntime(ownerAgentDir).profiles[profileId];
	const refreshedOAuthCredential = refreshed?.type === "oauth" && isCodexAppServerAuthProvider(refreshed.provider, params.config) ? refreshed : void 0;
	if (refreshedOAuthCredential && isDeepStrictEqual(params.store.profiles[profileId], credential)) params.store.profiles[profileId] = refreshedOAuthCredential;
	const storedCredential = store.profiles[profileId];
	const candidate = refreshedOAuthCredential ? refreshedOAuthCredential : storedCredential?.type === "oauth" && isCodexAppServerAuthProvider(storedCredential.provider, params.config) ? storedCredential : credential;
	return resolved?.apiKey ? {
		...candidate,
		access: resolved.apiKey
	} : candidate;
}
function shouldUseScopedOAuthCredential(params) {
	if (!params.store.runtimePersistedProfileIds?.includes(params.profileId)) return true;
	const persisted = params.persistedCredential;
	if (persisted?.type !== "oauth") return true;
	if (resolveProviderIdForAuth(persisted.provider, { config: params.config }) !== resolveProviderIdForAuth(params.suppliedCredential.provider, { config: params.config })) return true;
	return !isDeepStrictEqual(persisted, params.suppliedCredential) && !hasMatchingOAuthIdentity(persisted, params.suppliedCredential);
}
function hasMatchingOAuthIdentity(persisted, supplied) {
	const persistedAccountId = persisted.accountId?.trim();
	const suppliedAccountId = supplied.accountId?.trim();
	if (persistedAccountId && suppliedAccountId) return persistedAccountId === suppliedAccountId;
	const persistedEmail = persisted.email?.trim().toLowerCase();
	const suppliedEmail = supplied.email?.trim().toLowerCase();
	return Boolean(persistedEmail && suppliedEmail && persistedEmail === suppliedEmail);
}
async function resolveScopedOAuthCredential(params) {
	const existingRefresh = scopedOAuthRefreshQueues.get(params.store)?.get(params.profileId);
	if (existingRefresh) return await existingRefresh;
	if (!params.forceRefresh && hasUsableOAuthCredential(params.credential)) return params.credential;
	const storeRefreshes = scopedOAuthRefreshQueues.get(params.store) ?? /* @__PURE__ */ new Map();
	scopedOAuthRefreshQueues.set(params.store, storeRefreshes);
	const refresh = (async () => {
		const current = params.store.profiles[params.profileId];
		const credential = current?.type === "oauth" ? current : params.credential;
		if (!params.forceRefresh && hasUsableOAuthCredential(credential)) return credential;
		const refreshed = await refreshOAuthCredentialForRuntime({ credential });
		if (!refreshed?.access?.trim()) throw new Error(`Codex app-server auth profile "${params.profileId}" could not refresh.`);
		if (!isDeepStrictEqual(params.store.profiles[params.profileId], credential)) throw new Error(`Codex app-server auth profile "${params.profileId}" changed while refreshing.`);
		params.store.profiles[params.profileId] = refreshed;
		return refreshed;
	})();
	storeRefreshes.set(params.profileId, refresh);
	try {
		return await refresh;
	} finally {
		if (storeRefreshes.get(params.profileId) === refresh) storeRefreshes.delete(params.profileId);
	}
}
function isCodexAppServerAuthProvider(provider, config) {
	const resolvedProvider = resolveProviderIdForAuth(provider, { config });
	return resolvedProvider === CODEX_APP_SERVER_AUTH_PROVIDER || resolvedProvider === OPENAI_CODEX_APP_SERVER_AUTH_PROVIDER || resolvedProvider === LEGACY_CODEX_APP_SERVER_AUTH_PROVIDER;
}
function isOpenAIApiKeyBackupCredential(credential, config) {
	return credential.type === "api_key" && resolveProviderIdForAuth(credential.provider, { config }) === OPENAI_PROVIDER;
}
function isCodexAppServerAuthProfileCredential(credential, config) {
	return isCodexAppServerAuthProvider(credential.provider, config) || isOpenAIApiKeyBackupCredential(credential, config);
}
function shouldClearOpenAiApiKeyForCodexAuthProfile(params) {
	const profileId = params.authProfileId?.trim();
	return isCodexSubscriptionCredential(profileId ? params.store.profiles[profileId] : params.store.profiles[OPENAI_CODEX_DEFAULT_PROFILE_ID], params.config);
}
function isCodexSubscriptionCredential(credential, config) {
	if (!credential || !isCodexAppServerAuthProvider(credential.provider, config)) return false;
	return credential.type === "oauth" || credential.type === "token";
}
function withClearedEnvironmentVariables(startOptions, envVars) {
	const clearEnv = startOptions.clearEnv ?? [];
	const missingEnvVars = envVars.filter((envVar) => !clearEnv.includes(envVar));
	if (missingEnvVars.length === 0) return startOptions;
	return {
		...startOptions,
		clearEnv: [...clearEnv, ...missingEnvVars]
	};
}
function readFirstNonEmptyEnv(env, keys) {
	return readFirstNonEmptyEnvEntry(env, keys)?.value;
}
function readFirstNonEmptyEnvEntry(env, keys) {
	for (const key of keys) {
		const value = env[key]?.trim();
		if (value) return {
			key,
			value
		};
	}
}
function buildChatgptAuthTokensParams(profileId, credential, accessToken) {
	return {
		type: "chatgptAuthTokens",
		accessToken,
		chatgptAccountId: resolveChatgptAccountId(profileId, credential),
		chatgptPlanType: resolveChatgptPlanType(credential)
	};
}
function resolveChatgptPlanType(credential) {
	const record = credential;
	const planType = record.chatgptPlanType ?? record.planType;
	return typeof planType === "string" && planType.trim() ? planType.trim() : null;
}
function resolveChatgptAccountId(profileId, credential) {
	if ("accountId" in credential && typeof credential.accountId === "string") {
		const accountId = credential.accountId.trim();
		if (accountId) return accountId;
	}
	return credential.email?.trim() || profileId;
}
//#endregion
//#region extensions/codex/src/app-server/managed-binary.ts
/**
* Resolves the managed Codex app-server binary shipped with or installed beside
* the Codex plugin before stdio startup.
*/
const CODEX_PLUGIN_ROOT = resolveDefaultCodexPluginRoot(path.dirname(fileURLToPath(import.meta.url)));
/** Rewrites managed stdio start options to point at an executable Codex binary path. */
async function resolveManagedCodexAppServerStartOptions(startOptions, options = {}) {
	if (startOptions.transport !== "stdio" || startOptions.commandSource !== "managed") return startOptions;
	const platform = options.platform ?? process.platform;
	const paths = resolveManagedCodexAppServerPaths({
		platform,
		pluginRoot: options.pluginRoot
	});
	const pathExists = options.pathExists ?? commandPathExists;
	const commandPath = await findManagedCodexAppServerCommandPath({
		candidateCommandPaths: paths.candidateCommandPaths,
		pathExists,
		platform
	});
	return {
		...startOptions,
		command: commandPath,
		commandSource: "resolved-managed"
	};
}
/** Returns the preferred and fallback managed Codex binary paths for a plugin root. */
function resolveManagedCodexAppServerPaths(params) {
	const platform = params.platform ?? process.platform;
	const candidateCommandPaths = resolveManagedCodexAppServerCommandCandidates(params.pluginRoot ?? CODEX_PLUGIN_ROOT, platform);
	return {
		commandPath: candidateCommandPaths[0] ?? "",
		candidateCommandPaths
	};
}
function resolveManagedCodexAppServerCommandCandidates(pluginRoot, platform) {
	const pathApi = pathForPlatform(platform);
	const commandName = platform === "win32" ? "codex.cmd" : "codex";
	const roots = resolveManagedCodexAppServerCandidateRoots(pluginRoot, platform);
	return [...new Set([...roots.map((root) => pathApi.join(root, "node_modules", ".bin", commandName)), ...resolveManagedCodexPackageBinCandidates(roots, platform)])];
}
function resolveDefaultCodexPluginRoot(moduleDir) {
	const moduleBaseName = path.basename(moduleDir);
	if (moduleBaseName === "dist" || moduleBaseName === "dist-runtime") return path.dirname(moduleDir);
	return path.resolve(moduleDir, "..", "..");
}
function resolveManagedCodexAppServerCandidateRoots(pluginRoot, platform) {
	const pathApi = pathForPlatform(platform);
	const directRoots = [
		pluginRoot,
		pathApi.dirname(pluginRoot),
		pathApi.dirname(pathApi.dirname(pluginRoot)),
		isDistExtensionRoot(pluginRoot, platform) ? pathApi.dirname(pathApi.dirname(pathApi.dirname(pluginRoot))) : null
	].filter((root) => Boolean(root));
	return [...new Set([...directRoots, ...resolveNearestNodeModulesProjectRoots(directRoots, platform)])];
}
function resolveNearestNodeModulesProjectRoots(roots, platform) {
	const pathApi = pathForPlatform(platform);
	const projectRoots = [];
	for (const root of roots) {
		let current = pathApi.resolve(root);
		while (true) {
			if (pathApi.basename(current) === "node_modules") {
				projectRoots.push(pathApi.dirname(current));
				break;
			}
			const parent = pathApi.dirname(current);
			if (parent === current) break;
			current = parent;
		}
	}
	return projectRoots;
}
function resolveManagedCodexPackageBinCandidates(roots, platform) {
	if (platform === "win32") return [];
	const candidates = [];
	for (const root of roots) {
		const candidate = resolveManagedCodexPackageBinCandidate(root);
		if (candidate) candidates.push(candidate);
	}
	return candidates;
}
function resolveManagedCodexPackageBinCandidate(root) {
	try {
		const packageJsonPath = createRequire(path.join(root, "package.json")).resolve(`${MANAGED_CODEX_APP_SERVER_PACKAGE}/package.json`);
		const packageRoot = path.dirname(packageJsonPath);
		const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf8"));
		const binPath = typeof packageJson.bin === "string" ? packageJson.bin : isRecord(packageJson.bin) && typeof packageJson.bin.codex === "string" ? packageJson.bin.codex : null;
		return binPath ? path.resolve(packageRoot, binPath) : null;
	} catch {
		return null;
	}
}
function isRecord(value) {
	return typeof value === "object" && value !== null;
}
function isDistExtensionRoot(pluginRoot, platform) {
	const pathApi = pathForPlatform(platform);
	const extensionsDir = pathApi.dirname(pluginRoot);
	const distDir = pathApi.dirname(extensionsDir);
	return pathApi.basename(extensionsDir) === "extensions" && (pathApi.basename(distDir) === "dist" || pathApi.basename(distDir) === "dist-runtime");
}
function pathForPlatform(platform) {
	return platform === "win32" ? path.win32 : path.posix;
}
async function findManagedCodexAppServerCommandPath(params) {
	for (const commandPath of params.candidateCommandPaths) if (await params.pathExists(commandPath, params.platform)) return commandPath;
	throw new Error([
		`Managed Codex app-server binary was not found for ${MANAGED_CODEX_APP_SERVER_PACKAGE}.`,
		"Reinstall or update OpenClaw, or run pnpm install in a source checkout.",
		"Set plugins.entries.codex.config.appServer.command or OPENCLAW_CODEX_APP_SERVER_BIN to use a custom Codex binary."
	].join(" "));
}
async function commandPathExists(filePath, platform) {
	try {
		await access(filePath, platform === "win32" ? constants.F_OK : constants.X_OK);
		return true;
	} catch {
		return false;
	}
}
//#endregion
//#region extensions/codex/src/app-server/timeout.ts
/**
* Thin Codex app-server timeout adapter around OpenClaw's shared security
* runtime timeout helper.
*/
/** Awaits a promise with a Codex-specific timeout error message. */
async function withTimeout(promise, timeoutMs, timeoutMessage) {
	return await withTimeout$1(promise, timeoutMs, { message: timeoutMessage });
}
//#endregion
//#region extensions/codex/src/app-server/shared-client.ts
/**
* Owns shared and isolated Codex app-server client startup, auth application,
* lease tracking, and teardown.
*/
const SHARED_CODEX_APP_SERVER_CLIENT_STATE = Symbol.for("openclaw.codexAppServerClientState");
function getSharedCodexAppServerClientState() {
	const globalState = globalThis;
	const state = globalState[SHARED_CODEX_APP_SERVER_CLIENT_STATE];
	const keyedState = readKeyedSharedCodexAppServerClientState(state);
	if (keyedState) {
		const clients = keyedState.clients;
		for (const entry of clients.values()) {
			entry.activeLeases ??= 0;
			entry.pendingAcquires ??= 0;
			entry.closeWhenIdle ??= false;
		}
		const nextState = {
			clients,
			leasedReleases: keyedState.leasedReleases instanceof WeakMap ? keyedState.leasedReleases : /* @__PURE__ */ new WeakMap()
		};
		globalState[SHARED_CODEX_APP_SERVER_CLIENT_STATE] = nextState;
		return nextState;
	}
	const legacyState = readLegacySharedCodexAppServerClientState(state);
	const clients = /* @__PURE__ */ new Map();
	if (legacyState?.key && (legacyState.client || legacyState.promise)) {
		const legacyKey = legacyState.key;
		clients.set(legacyKey, {
			client: legacyState.client,
			promise: legacyState.promise,
			activeLeases: 0,
			pendingAcquires: 0,
			closeWhenIdle: false
		});
		legacyState.client?.addCloseHandler((closedClient) => clearSharedClientEntryIfCurrent(legacyKey, closedClient));
	}
	const nextState = {
		clients,
		leasedReleases: /* @__PURE__ */ new WeakMap()
	};
	globalState[SHARED_CODEX_APP_SERVER_CLIENT_STATE] = nextState;
	return nextState;
}
function readKeyedSharedCodexAppServerClientState(value) {
	return value !== null && typeof value === "object" && value.clients instanceof Map ? value : void 0;
}
function readLegacySharedCodexAppServerClientState(value) {
	if (value === null || typeof value !== "object") return;
	return value;
}
async function resolveCodexAppServerClientStartContext(options) {
	const agentDir = options?.agentDir ?? resolveDefaultAgentDir(options?.config ?? {});
	const usesNativeAuth = options?.authProfileId === null;
	const requestedAuthProfileId = options?.authProfileId === null ? void 0 : options?.authProfileId;
	const authProfileStore = !usesNativeAuth && options?.authProfileStore ? resolveCodexAppServerAuthProfileStore({
		agentDir,
		authProfileId: requestedAuthProfileId,
		authProfileStore: options.authProfileStore,
		config: options.config
	}) : options?.authProfileStore;
	const authProfileId = usesNativeAuth ? void 0 : resolveCodexAppServerAuthProfileIdForAgent({
		authProfileId: requestedAuthProfileId,
		agentDir,
		config: options?.config,
		...authProfileStore ? { authProfileStore } : {}
	});
	return {
		agentDir,
		usesNativeAuth,
		authProfileId,
		authProfileStore,
		startOptions: await bridgeCodexAppServerStartOptions({
			startOptions: await resolveManagedCodexAppServerStartOptions(options?.startOptions ?? resolveCodexAppServerRuntimeOptions().start),
			agentDir,
			authProfileId: usesNativeAuth ? null : authProfileId,
			config: options?.config,
			...authProfileStore ? { authProfileStore } : {}
		})
	};
}
/** Gets or starts a shared Codex app-server client without retaining a lease. */
async function getSharedCodexAppServerClient(options) {
	return (await acquireSharedCodexAppServerClient(options)).client;
}
/** Gets or starts a shared Codex app-server client and records a release lease. */
async function getLeasedSharedCodexAppServerClient(options) {
	const acquired = await acquireSharedCodexAppServerClient(options, { leased: true });
	const state = getSharedCodexAppServerClientState();
	const releases = state.leasedReleases.get(acquired.client) ?? [];
	releases.push(acquired.release);
	state.leasedReleases.set(acquired.client, releases);
	return acquired.client;
}
/** Releases one outstanding lease for a shared Codex app-server client. */
function releaseLeasedSharedCodexAppServerClient(client) {
	const state = getSharedCodexAppServerClientState();
	const releases = state.leasedReleases.get(client);
	if (!releases) return false;
	const release = releases.pop();
	if (!release) return false;
	if (releases.length === 0) state.leasedReleases.delete(client);
	release();
	return true;
}
async function acquireSharedCodexAppServerClient(options, leaseOptions) {
	const { agentDir, usesNativeAuth, authProfileId, startOptions } = await resolveCodexAppServerClientStartContext(options);
	const fallbackApiKeyCacheKey = authProfileId ? void 0 : resolveCodexAppServerFallbackApiKeyCacheKey({ startOptions });
	const key = codexAppServerStartOptionsKey(startOptions, {
		authProfileId,
		agentDir: usesNativeAuth ? void 0 : agentDir,
		fallbackApiKeyCacheKey
	});
	const state = getSharedCodexAppServerClientState();
	const entry = getOrCreateSharedClientEntry(state, key);
	const releasePendingAcquire = retainPendingSharedClientAcquire(entry);
	let cleanupAbandonSignal;
	if (options?.abandonSignal) {
		const abandon = () => {
			releasePendingAcquire();
			closeSharedClientEntryIfUnclaimed(key, entry);
		};
		options.abandonSignal.addEventListener("abort", abandon, { once: true });
		cleanupAbandonSignal = () => options.abandonSignal?.removeEventListener("abort", abandon);
		if (options.abandonSignal.aborted) abandon();
	}
	const sharedPromise = entry.promise ?? (entry.promise = (async () => {
		const client = CodexAppServerClient.start(startOptions);
		entry.client = client;
		options?.onStartedClient?.(client);
		client.setActiveSharedLeaseCountProviderForUnscopedNotifications(() => entry.activeLeases);
		client.addCloseHandler((closedClient) => clearSharedClientEntryIfCurrent(key, closedClient));
		try {
			await client.initialize();
			await applyCodexAppServerAuthProfile({
				client,
				agentDir,
				authProfileId: usesNativeAuth ? null : authProfileId,
				startOptions,
				config: options?.config
			});
			return client;
		} catch (error) {
			client.close();
			throw error;
		}
	})());
	try {
		const client = await withTimeout(sharedPromise, options?.timeoutMs ?? 0, "codex app-server initialize timed out");
		client.setActiveSharedLeaseCountProviderForUnscopedNotifications(() => entry.activeLeases);
		const release = leaseOptions?.leased ? retainSharedClientEntry(entry) : void 0;
		return release ? {
			client,
			release
		} : { client };
	} catch (error) {
		const currentEntry = state.clients.get(key);
		if (currentEntry?.promise === sharedPromise) clearSharedClientEntry(key, currentEntry);
		throw error;
	} finally {
		cleanupAbandonSignal?.();
		releasePendingAcquire();
	}
}
/** Starts a non-shared Codex app-server client owned entirely by the caller. */
async function createIsolatedCodexAppServerClient(options) {
	const { agentDir, usesNativeAuth, authProfileId, authProfileStore, startOptions } = await resolveCodexAppServerClientStartContext(options);
	const client = CodexAppServerClient.start(startOptions);
	if (authProfileId) client.addRequestHandler(async (request) => {
		if (request.method !== "account/chatgptAuthTokens/refresh") return;
		return await refreshCodexAppServerAuthTokens({
			agentDir,
			authProfileId,
			...authProfileStore ? { authProfileStore } : {},
			config: options?.config
		});
	});
	const initialize = client.initialize();
	try {
		await withTimeout(initialize, options?.timeoutMs ?? 0, "codex app-server initialize timed out");
		await applyCodexAppServerAuthProfile({
			client,
			agentDir,
			authProfileId: usesNativeAuth ? null : authProfileId,
			startOptions,
			config: options?.config,
			...authProfileStore ? { authProfileStore } : {}
		});
		return client;
	} catch (error) {
		client.close();
		initialize.catch(() => void 0);
		throw error;
	}
}
/** Clears and closes all shared clients for deterministic tests. */
function resetSharedCodexAppServerClientForTests() {
	const state = getSharedCodexAppServerClientState();
	const clients = collectSharedClients(state);
	state.clients.clear();
	state.leasedReleases = /* @__PURE__ */ new WeakMap();
	for (const client of clients) client.close();
}
/** Clears and closes all shared clients. */
function clearSharedCodexAppServerClient() {
	const state = getSharedCodexAppServerClientState();
	const clients = collectSharedClients(state);
	state.clients.clear();
	for (const client of clients) client.close();
}
/** Clears and closes the shared entry only if it still owns the supplied client. */
function clearSharedCodexAppServerClientIfCurrent(client) {
	if (!client) return false;
	const state = getSharedCodexAppServerClientState();
	for (const [key, entry] of state.clients) if (entry.client === client) {
		state.clients.delete(key);
		client.close();
		return true;
	}
	return false;
}
/** Detaches the shared entry without closing the client when it still matches. */
function detachSharedCodexAppServerClientIfCurrent(client) {
	if (!client) return false;
	const state = getSharedCodexAppServerClientState();
	for (const [key, entry] of state.clients) if (entry.client === client) {
		state.clients.delete(key);
		return true;
	}
	return false;
}
/** Retains the matching shared client and returns a release callback. */
function retainSharedCodexAppServerClientIfCurrent(client) {
	if (!client) return;
	const state = getSharedCodexAppServerClientState();
	for (const entry of state.clients.values()) if (entry.client === client) return retainSharedClientEntry(entry);
}
/** Marks a matching shared client to close after active leases/acquires drain. */
function retireSharedCodexAppServerClientIfCurrent(client) {
	if (!client) return;
	const state = getSharedCodexAppServerClientState();
	for (const [key, entry] of state.clients) if (entry.client === client) {
		state.clients.delete(key);
		entry.closeWhenIdle = true;
		const closed = closeRetiredSharedClientEntryIfIdle(entry);
		return {
			activeLeases: entry.activeLeases,
			closed
		};
	}
	const activeLeases = state.leasedReleases.get(client)?.length ?? 0;
	if (activeLeases > 0) return {
		activeLeases,
		closed: false
	};
}
/** Clears a matching shared client and waits for its process to exit. */
async function clearSharedCodexAppServerClientIfCurrentAndWait(client, options) {
	if (!client) return false;
	const state = getSharedCodexAppServerClientState();
	for (const [key, entry] of state.clients) if (entry.client === client) {
		state.clients.delete(key);
		await client.closeAndWait(options);
		return true;
	}
	return false;
}
/** Clears all shared clients and waits for their processes to exit. */
async function clearSharedCodexAppServerClientAndWait(options) {
	const state = getSharedCodexAppServerClientState();
	const clients = collectSharedClients(state);
	state.clients.clear();
	await Promise.all(clients.map((client) => client.closeAndWait(options)));
}
function getOrCreateSharedClientEntry(state, key) {
	let entry = state.clients.get(key);
	if (!entry) {
		entry = {
			activeLeases: 0,
			pendingAcquires: 0,
			closeWhenIdle: false
		};
		state.clients.set(key, entry);
	}
	return entry;
}
function clearSharedClientEntry(key, entry) {
	const state = getSharedCodexAppServerClientState();
	if (state.clients.get(key) !== entry) return;
	state.clients.delete(key);
	entry.client?.close();
}
function clearSharedClientEntryIfCurrent(key, client) {
	const state = getSharedCodexAppServerClientState();
	if (state.clients.get(key)?.client === client) state.clients.delete(key);
}
/** Clears a matching shared client only when no lease or acquire currently claims it. */
function clearSharedCodexAppServerClientIfCurrentAndUnclaimed(client) {
	if (!client) return {
		found: false,
		closed: false,
		activeLeases: 0,
		pendingAcquires: 0
	};
	const state = getSharedCodexAppServerClientState();
	for (const [key, entry] of state.clients) if (entry.client === client) return {
		found: true,
		closed: closeSharedClientEntryIfUnclaimed(key, entry),
		activeLeases: entry.activeLeases,
		pendingAcquires: entry.pendingAcquires
	};
	return {
		found: false,
		closed: false,
		activeLeases: 0,
		pendingAcquires: 0
	};
}
function retainPendingSharedClientAcquire(entry) {
	let released = false;
	entry.pendingAcquires += 1;
	return () => {
		if (released) return;
		released = true;
		entry.pendingAcquires = Math.max(0, entry.pendingAcquires - 1);
		closeRetiredSharedClientEntryIfIdle(entry);
	};
}
function retainSharedClientEntry(entry) {
	let released = false;
	entry.activeLeases += 1;
	return () => {
		if (released) return;
		released = true;
		entry.activeLeases = Math.max(0, entry.activeLeases - 1);
		closeRetiredSharedClientEntryIfIdle(entry);
	};
}
function closeRetiredSharedClientEntryIfIdle(entry) {
	if (!entry.closeWhenIdle || entry.activeLeases > 0 || entry.pendingAcquires > 0 || !entry.client) return false;
	const client = entry.client;
	entry.closeWhenIdle = false;
	entry.client = void 0;
	client.close();
	return true;
}
function closeSharedClientEntryIfUnclaimed(key, entry) {
	if (entry.activeLeases > 0 || entry.pendingAcquires > 0) return false;
	const state = getSharedCodexAppServerClientState();
	if (state.clients.get(key) !== entry) return false;
	state.clients.delete(key);
	entry.client?.close();
	return Boolean(entry.client);
}
function collectSharedClients(state) {
	return [...new Set([...state.clients.values()].map((entry) => entry.client).filter((client) => Boolean(client)))];
}
//#endregion
export { resolveCodexAppServerAuthProfileId as _, clearSharedCodexAppServerClientIfCurrentAndWait as a, resolveCodexAppServerHomeDir as b, getLeasedSharedCodexAppServerClient as c, resetSharedCodexAppServerClientForTests as d, retainSharedCodexAppServerClientIfCurrent as f, resolveCodexAppServerAuthAccountCacheKey as g, refreshCodexAppServerAuthTokens as h, clearSharedCodexAppServerClientIfCurrentAndUnclaimed as i, getSharedCodexAppServerClient as l, withTimeout as m, clearSharedCodexAppServerClientAndWait as n, createIsolatedCodexAppServerClient as o, retireSharedCodexAppServerClientIfCurrent as p, clearSharedCodexAppServerClientIfCurrent as r, detachSharedCodexAppServerClientIfCurrent as s, clearSharedCodexAppServerClient as t, releaseLeasedSharedCodexAppServerClient as u, resolveCodexAppServerAuthProfileIdForAgent as v, resolveCodexAppServerFallbackApiKeyCacheKey as y };
