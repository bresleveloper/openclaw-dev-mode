import { c as withTimeout$1 } from "./fs-safe-RNq3oO57.js";
import { n as VERSION } from "./version-CeFj_iGk.js";
import { s as resolveDefaultAgentDir } from "./agent-scope-config-BxAUeF6t.js";
import { r as resolveProviderIdForAuth } from "./provider-auth-aliases-BMy8GnRz.js";
import { r as hasUsableOAuthCredential } from "./credential-state-BY-oz-QV.js";
import { a as findPersistedAuthProfileCredential, f as resolvePersistedAuthProfileOwnerAgentDir, l as loadAuthProfileStoreForSecretsRuntime, n as ensureAuthProfileStore } from "./store-9jfx-1KO.js";
import { n as resolveApiKeyForProfile, t as refreshOAuthCredentialForRuntime } from "./oauth-CNbgPg6s.js";
import { i as resolveAuthProfileOrder } from "./order-DjOYyPH4.js";
import { t as log } from "./logger-rC_P-huq.js";
import { a as resolveWindowsSpawnProgram, r as materializeWindowsSpawnProgram } from "./windows-spawn-C5RDaB22.js";
import "./security-runtime-B2x5tet5.js";
import "./provider-auth-tQ9Jbip5.js";
import "./agent-runtime-CjR-oxBM.js";
import "./agent-harness-runtime-DtJXSLg5.js";
import { i as isRpcResponse, r as isJsonObject$1 } from "./protocol-2POPqAY4.js";
import { d as resolveCodexAppServerRuntimeOptions, f as resolveCodexAppServerUserHomeDir, r as codexAppServerStartOptionsKey } from "./config-DxEPz1k2.js";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import fs, { constants, readFileSync } from "node:fs";
import path from "node:path";
import fs$1, { access } from "node:fs/promises";
import os from "node:os";
import { spawn } from "node:child_process";
import { createHash } from "node:crypto";
import { PassThrough, Writable } from "node:stream";
import { isDeepStrictEqual } from "node:util";
import WebSocket$1 from "ws";
import { createInterface } from "node:readline";
import { EventEmitter } from "node:events";
//#region extensions/codex/src/app-server/transport-stdio.ts
/**
* Creates and configures stdio-backed Codex app-server transports, including
* Windows spawn normalization and environment filtering.
*/
const UNSAFE_ENVIRONMENT_KEYS = /* @__PURE__ */ new Set([
	"__proto__",
	"constructor",
	"prototype"
]);
const QA_PARENT_PID_ENV = "OPENCLAW_QA_PARENT_PID";
const DEFAULT_SPAWN_RUNTIME = {
	platform: process.platform,
	env: process.env,
	execPath: process.execPath
};
/** Resolves the concrete command/argv/shell settings used to spawn Codex app-server. */
function resolveCodexAppServerSpawnInvocation(options, runtime = DEFAULT_SPAWN_RUNTIME) {
	if (options.commandSource === "managed") throw new Error("Managed Codex app-server start options must be resolved before spawn.");
	const resolved = materializeWindowsSpawnProgram(resolveWindowsSpawnProgram({
		command: options.command,
		platform: runtime.platform,
		env: runtime.env,
		execPath: runtime.execPath,
		packageName: "@openai/codex"
	}), options.args);
	return {
		command: resolved.command,
		args: resolved.argv,
		shell: resolved.shell,
		windowsHide: resolved.windowsHide
	};
}
/** Merges app-server environment overrides while honoring clearEnv and unsafe key filtering. */
function resolveCodexAppServerSpawnEnv(options, baseEnv = process.env, platform = process.platform) {
	const env = Object.create(null);
	copySafeEnvironmentEntries(env, baseEnv);
	copySafeEnvironmentEntries(env, options.env ?? {});
	const keysToClear = normalizedEnvironmentKeys(options.clearEnv ?? []);
	if (platform === "win32") {
		const lowerCaseKeysToClear = new Set(keysToClear.map((key) => key.toLowerCase()));
		for (const candidate of Object.keys(env)) if (lowerCaseKeysToClear.has(candidate.toLowerCase())) delete env[candidate];
	} else for (const key of keysToClear) delete env[key];
	return env;
}
/** Keeps QA-owned app-server processes inside the gateway process-group cleanup boundary. */
function resolveCodexAppServerDetachedMode(env, platform = process.platform) {
	return platform !== "win32" && !env[QA_PARENT_PID_ENV]?.trim();
}
function normalizedEnvironmentKeys(rawKeys) {
	const keys = [];
	for (const rawKey of rawKeys) {
		const key = rawKey.trim();
		if (key.length > 0) keys.push(key);
	}
	return keys;
}
function copySafeEnvironmentEntries(target, source) {
	for (const [key, value] of Object.entries(source)) {
		if (UNSAFE_ENVIRONMENT_KEYS.has(key)) continue;
		target[key] = value;
	}
}
/** Spawns the Codex app-server process and returns the shared transport interface. */
function createStdioTransport(options) {
	const env = resolveCodexAppServerSpawnEnv(options);
	const invocation = resolveCodexAppServerSpawnInvocation(options, {
		platform: process.platform,
		env,
		execPath: process.execPath
	});
	return spawn(invocation.command, invocation.args, {
		env,
		detached: resolveCodexAppServerDetachedMode(env),
		shell: invocation.shell,
		stdio: [
			"pipe",
			"pipe",
			"pipe"
		],
		windowsHide: invocation.windowsHide
	});
}
//#endregion
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
	const scopedStartOptions = await withCodexHomeEnvironment(params.startOptions, params.agentDir);
	if (params.authProfileId === null) return scopedStartOptions;
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
	}) ? withClearedEnvironmentVariables(scopedStartOptions, CODEX_APP_SERVER_API_KEY_ENV_VARS) : scopedStartOptions;
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
async function withCodexHomeEnvironment(startOptions, agentDir) {
	const codexHome = startOptions.env?.[CODEX_HOME_ENV_VAR]?.trim() ? startOptions.env[CODEX_HOME_ENV_VAR] : startOptions.homeScope === "user" ? resolveCodexAppServerUserHomeDir(process.env) : resolveCodexAppServerHomeDir(agentDir);
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
//#region extensions/codex/src/app-server/rate-limit-cache.ts
const DEFAULT_CODEX_RATE_LIMIT_CACHE_MAX_AGE_MS = 10 * 6e4;
const SPARSE_ACCOUNT_METADATA_KEYS = [
	"credits",
	"individualLimit",
	"planType"
];
const rateLimitsByClient = /* @__PURE__ */ new WeakMap();
/** Replaces one physical client's cache with an authoritative rate-limit read response. */
function rememberCodexRateLimitsRead(client, value, nowMs = Date.now()) {
	if (value !== void 0) {
		const revisionsByLimitId = { ...rateLimitsByClient.get(client)?.revisionsByLimitId };
		for (const limitId of readRateLimitIds(value)) revisionsByLimitId[limitId] = (revisionsByLimitId[limitId] ?? 0) + 1;
		rateLimitsByClient.set(client, {
			value,
			updatedAtMs: nowMs,
			revisionsByLimitId
		});
	}
}
/** Merges a sparse rolling notification into one physical client's latest read response. */
function mergeCodexRateLimitsUpdate(client, value, nowMs = Date.now()) {
	const update = isJsonObject$1(value) && isJsonObject$1(value.rateLimits) ? value.rateLimits : void 0;
	if (!update) return;
	const currentState = rateLimitsByClient.get(client);
	const current = currentState?.value;
	const limitId = readLimitId(update);
	rateLimitsByClient.set(client, {
		value: mergeRateLimitUpdate(current, update),
		updatedAtMs: nowMs,
		revisionsByLimitId: {
			...currentState?.revisionsByLimitId,
			[limitId]: (currentState?.revisionsByLimitId[limitId] ?? 0) + 1
		}
	});
}
/** Per-limit marker used to trust only primary Codex updates from one turn startup. */
function readCodexRateLimitsRevision(client, limitId = "codex") {
	return rateLimitsByClient.get(client)?.revisionsByLimitId[limitId] ?? 0;
}
/** Reads one physical client's cached rate-limit payload within the max-age window. */
function readRecentCodexRateLimits(client, options) {
	const state = rateLimitsByClient.get(client);
	if (!state) return;
	const nowMs = options?.nowMs ?? Date.now();
	const maxAgeMs = options?.maxAgeMs ?? DEFAULT_CODEX_RATE_LIMIT_CACHE_MAX_AGE_MS;
	return maxAgeMs >= 0 && nowMs - state.updatedAtMs > maxAgeMs ? void 0 : state.value;
}
function mergeRateLimitUpdate(current, update) {
	const currentEnvelope = isJsonObject$1(current) ? current : void 0;
	const currentPrimary = currentEnvelope && isJsonObject$1(currentEnvelope.rateLimits) ? currentEnvelope.rateLimits : void 0;
	const currentByLimitId = currentEnvelope && isJsonObject$1(currentEnvelope.rateLimitsByLimitId) ? currentEnvelope.rateLimitsByLimitId : void 0;
	const limitId = readLimitId(update);
	const currentPrimaryLimitId = currentPrimary ? readLimitId(currentPrimary) : void 0;
	const currentForLimit = (currentByLimitId && isJsonObject$1(currentByLimitId[limitId]) ? currentByLimitId[limitId] : void 0) ?? (currentPrimaryLimitId === limitId ? currentPrimary : void 0);
	const merged = mergeSparseSnapshot(isJsonObject$1(currentForLimit) ? currentForLimit : void 0, currentPrimary, update, limitId);
	const nextPrimary = !currentPrimary || currentPrimaryLimitId === limitId ? merged : currentPrimary;
	let nextByLimitId;
	if (currentByLimitId) nextByLimitId = {
		...currentByLimitId,
		[limitId]: merged
	};
	else if (currentPrimary && currentPrimaryLimitId && currentPrimaryLimitId !== limitId) nextByLimitId = {
		[currentPrimaryLimitId]: currentPrimary,
		[limitId]: merged
	};
	return {
		...currentEnvelope,
		rateLimits: nextPrimary,
		...nextByLimitId ? { rateLimitsByLimitId: nextByLimitId } : {}
	};
}
function readRateLimitIds(value) {
	if (!isJsonObject$1(value)) return [];
	const ids = /* @__PURE__ */ new Set();
	if (isJsonObject$1(value.rateLimits)) ids.add(readLimitId(value.rateLimits));
	if (isJsonObject$1(value.rateLimitsByLimitId)) for (const [key, snapshot] of Object.entries(value.rateLimitsByLimitId)) {
		const snapshotLimitId = isJsonObject$1(snapshot) && typeof snapshot.limitId === "string" ? snapshot.limitId.trim() : "";
		ids.add(snapshotLimitId || key);
	}
	return [...ids];
}
function mergeSparseSnapshot(current, accountFallback, update, limitId) {
	const merged = {
		...update,
		limitId
	};
	for (const key of SPARSE_ACCOUNT_METADATA_KEYS) {
		const previous = current?.[key] ?? accountFallback?.[key];
		if (merged[key] == null && previous != null) merged[key] = previous;
	}
	return merged;
}
function readLimitId(snapshot) {
	const value = snapshot.limitId;
	return typeof value === "string" && value.trim() ? value.trim() : "codex";
}
//#endregion
//#region extensions/codex/src/app-server/client-runtime.ts
/** Client-scoped Codex auth and account observers. */
const configuredClients = /* @__PURE__ */ new WeakMap();
/** Installs one auth-refresh handler and one rate-limit observer per physical client. */
function ensureCodexAppServerClientRuntime(client, context) {
	const existing = configuredClients.get(client);
	if (existing) {
		existing.context = context;
		return;
	}
	const runtime = { context };
	configuredClients.set(client, runtime);
	client.addRequestHandler(async (request) => {
		if (request.method !== "account/chatgptAuthTokens/refresh") return;
		return await refreshCodexAppServerAuthTokens({
			agentDir: runtime.context.agentDir,
			authProfileId: runtime.context.authProfileId,
			...runtime.context.authProfileStore ? { authProfileStore: runtime.context.authProfileStore } : {},
			config: runtime.context.config
		});
	});
	client.addNotificationHandler((notification) => {
		if (notification.method === "account/rateLimits/updated") mergeCodexRateLimitsUpdate(client, notification.params);
	});
}
//#endregion
//#region extensions/codex/src/app-server/transport-websocket.ts
/**
* Adapts a remote Codex app-server WebSocket endpoint to the shared stdio-like
* transport interface.
*/
/** Opens a WebSocket app-server transport and maps newline-delimited frames to stdout/stdin. */
function createWebSocketTransport(options) {
	if (!options.url) throw new Error("codex app-server websocket transport requires plugins.entries.codex.config.appServer.url");
	const events = new EventEmitter();
	const stdout = new PassThrough();
	const stderr = new PassThrough();
	const headers = {
		...options.headers,
		...options.authToken ? { Authorization: `Bearer ${options.authToken}` } : {}
	};
	const socket = new WebSocket$1(options.url, { headers });
	const pendingFrames = [];
	let killed = false;
	const sendFrame = (frame) => {
		const trimmed = frame.trim();
		if (!trimmed) return;
		if (socket.readyState === WebSocket$1.OPEN) {
			socket.send(trimmed);
			return;
		}
		pendingFrames.push(trimmed);
	};
	socket.once("open", () => {
		for (const frame of pendingFrames.splice(0)) socket.send(frame);
	});
	socket.once("error", (error) => events.emit("error", error));
	socket.once("close", (code, reason) => {
		killed = true;
		events.emit("exit", code, reason.toString("utf8"));
	});
	socket.on("message", (data) => {
		const text = websocketFrameToText(data);
		stdout.write(text.endsWith("\n") ? text : `${text}\n`);
	});
	const stdin = new Writable({ write(chunk, _encoding, callback) {
		for (const frame of chunk.toString("utf8").split("\n")) sendFrame(frame);
		callback();
	} });
	const closeSocket = () => {
		if (socket.readyState === WebSocket$1.CLOSED || socket.readyState === WebSocket$1.CLOSING) return;
		socket.close();
	};
	stdin.once("finish", closeSocket);
	stdin.once("close", closeSocket);
	return {
		stdin,
		stdout,
		stderr,
		get killed() {
			return killed;
		},
		kill: () => {
			killed = true;
			socket.close();
		},
		once: (event, listener) => events.once(event, listener)
	};
}
function websocketFrameToText(data) {
	if (typeof data === "string") return data;
	if (Buffer.isBuffer(data)) return data.toString("utf8");
	if (Array.isArray(data)) return Buffer.concat(data).toString("utf8");
	return Buffer.from(data).toString("utf8");
}
//#endregion
//#region extensions/codex/src/app-server/transport.ts
/** Starts graceful transport shutdown and schedules a force kill fallback. */
function closeCodexAppServerTransport(child, options = {}) {
	child.stdin.end?.();
	child.stdin.destroy?.();
	const forceKillDelayMs = options.forceKillDelayMs ?? 1e3;
	const forceKill = setTimeout(() => {
		if (hasCodexAppServerTransportExited(child)) return;
		signalCodexAppServerTransport(child, "SIGKILL");
	}, Math.max(1, forceKillDelayMs));
	forceKill.unref?.();
	child.once("exit", () => {
		clearTimeout(forceKill);
		child.stdout.destroy?.();
		child.stderr.destroy?.();
	});
	child.unref?.();
	child.stdout.unref?.();
	child.stderr.unref?.();
	child.stdin.unref?.();
}
/** Closes a transport and waits briefly for an exit event. */
async function closeCodexAppServerTransportAndWait(child, options = {}) {
	if (!hasCodexAppServerTransportExited(child)) closeCodexAppServerTransport(child, options);
	return await waitForCodexAppServerTransportExit(child, options.exitTimeoutMs ?? 2e3);
}
function hasCodexAppServerTransportExited(child) {
	return child.exitCode !== null && child.exitCode !== void 0 ? true : child.signalCode !== null && child.signalCode !== void 0;
}
async function waitForCodexAppServerTransportExit(child, timeoutMs) {
	if (hasCodexAppServerTransportExited(child)) return true;
	return await new Promise((resolve) => {
		let settled = false;
		const onExit = () => {
			if (settled) return;
			settled = true;
			clearTimeout(timeout);
			resolve(true);
		};
		const timeout = setTimeout(() => {
			if (settled) return;
			settled = true;
			child.off?.("exit", onExit);
			resolve(false);
		}, Math.max(1, timeoutMs));
		child.once("exit", onExit);
	});
}
function signalCodexAppServerTransport(child, signal) {
	if (child.pid && process.platform !== "win32") try {
		process.kill(-child.pid, signal);
		return;
	} catch {}
	child.kill?.(signal);
}
//#endregion
//#region extensions/codex/src/app-server/version.ts
/**
* Version and package pins for the managed Codex app-server runtime.
*/
/** Minimum Codex app-server version supported by the OpenClaw Codex bridge. */
const MIN_CODEX_APP_SERVER_VERSION = "0.143.0";
/** npm package name for the managed Codex app-server binary. */
const MANAGED_CODEX_APP_SERVER_PACKAGE = "@openai/codex";
//#endregion
//#region extensions/codex/src/app-server/client.ts
/**
* JSON-RPC client for Codex app-server transports, including request/response
* routing, notification fanout, server request handlers, and version checks.
*/
const CODEX_APP_SERVER_PARSE_LOG_MAX = 500;
const CODEX_APP_SERVER_PARSE_BUFFER_MAX = 1e6;
const CODEX_APP_SERVER_PARSE_BUFFER_MAX_LINES = 1e3;
const CODEX_DYNAMIC_TOOL_SERVER_REQUEST_TIMEOUT_MS = 6e5;
const CODEX_APP_SERVER_STDERR_TAIL_MAX = 2e3;
const UNPAIRED_SURROGATE_RE = /[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?<![\uD800-\uDBFF])[\uDC00-\uDFFF]/g;
/** RPC error wrapper that preserves app-server error code and data. */
var CodexAppServerRpcError = class extends Error {
	constructor(error, method) {
		super(formatCodexAppServerRpcErrorMessage(error, method));
		this.name = "CodexAppServerRpcError";
		this.code = error.code;
		this.data = error.data;
	}
};
function formatCodexAppServerRpcErrorMessage(error, method) {
	const message = error.message || `${method} failed`;
	const detail = readCodexAppServerRpcReloginDetail(error.data);
	return detail && !message.includes(detail) ? `${message}: ${detail}` : message;
}
function readCodexAppServerRpcReloginDetail(data) {
	const record = isJsonObject(data) ? data : void 0;
	const nested = isJsonObject(record?.error) ? record.error : record;
	if (!nested) return;
	const isRelogin = nested.action === "relogin" || nested.reason === "cloudRequirements" && nested.errorCode === "Auth";
	const detail = typeof nested.detail === "string" ? nested.detail.trim() : "";
	return isRelogin && detail ? detail : void 0;
}
function isJsonObject(value) {
	return Boolean(value && typeof value === "object" && !Array.isArray(value));
}
/** Returns true for errors that mean the app-server transport is closed. */
function isCodexAppServerConnectionClosedError(error) {
	if (!(error instanceof Error)) return false;
	return error.message === "codex app-server client is closed" || error.message.startsWith("codex app-server exited:");
}
/** Stateful app-server JSON-RPC client over stdio or websocket transport. */
var CodexAppServerClient = class CodexAppServerClient {
	constructor(child) {
		this.pending = /* @__PURE__ */ new Map();
		this.requestHandlers = /* @__PURE__ */ new Set();
		this.notificationHandlers = /* @__PURE__ */ new Set();
		this.closeHandlers = /* @__PURE__ */ new Set();
		this.nextId = 1;
		this.initialized = false;
		this.closed = false;
		this.stderrTail = "";
		this.child = child;
		this.lines = createInterface({ input: child.stdout });
		this.lines.on("line", (line) => this.handleLine(line));
		this.lines.on("error", (error) => this.closeWithError(error instanceof Error ? error : new Error(String(error))));
		child.stdout.on("error", (error) => this.closeWithError(error instanceof Error ? error : new Error(String(error))));
		child.stderr.on("data", (chunk) => {
			const text = chunk.toString("utf8");
			this.stderrTail = appendBoundedTail(this.stderrTail, text, CODEX_APP_SERVER_STDERR_TAIL_MAX);
			const trimmed = text.trim();
			if (trimmed) log.debug(`codex app-server stderr: ${trimmed}`);
		});
		child.stderr.on("error", (error) => {
			log.warn("codex app-server stderr stream failed", { error });
		});
		child.once("error", (error) => this.closeWithError(error instanceof Error ? error : new Error(String(error))));
		child.once("exit", (code, signal) => {
			this.closeWithError(buildCodexAppServerExitError(code, signal, this.stderrTail));
		});
		child.stdin.on?.("error", (error) => this.closeWithError(error instanceof Error ? error : new Error(String(error))));
	}
	/** Starts a new app-server client using resolved runtime start options. */
	static start(options) {
		const defaults = resolveCodexAppServerRuntimeOptions().start;
		const startOptions = {
			...defaults,
			...options,
			headers: options?.headers ?? defaults.headers
		};
		if (startOptions.transport === "stdio" && startOptions.commandSource === "managed") throw new Error("Managed Codex app-server start options must be resolved before spawn.");
		if (startOptions.transport === "websocket") return new CodexAppServerClient(createWebSocketTransport(startOptions));
		return new CodexAppServerClient(createStdioTransport(startOptions));
	}
	/** Builds a client around a fake transport for tests. */
	static fromTransportForTests(child) {
		return new CodexAppServerClient(child);
	}
	/** Performs the app-server initialize handshake and validates protocol version. */
	async initialize() {
		if (this.initialized) return;
		const response = await this.request("initialize", {
			clientInfo: {
				name: "openclaw",
				title: "OpenClaw",
				version: VERSION
			},
			capabilities: { experimentalApi: true }
		});
		this.serverVersion = assertSupportedCodexAppServerVersion(response);
		this.runtimeIdentity = buildCodexAppServerRuntimeIdentity(response, this.serverVersion);
		this.notify("initialized");
		this.initialized = true;
	}
	/** Returns the version detected during initialize. */
	getServerVersion() {
		return this.serverVersion;
	}
	/** Returns runtime metadata detected during initialize. */
	getRuntimeIdentity() {
		return this.runtimeIdentity ? { ...this.runtimeIdentity } : void 0;
	}
	request(method, params, optionsInput) {
		let options = optionsInput;
		options ??= {};
		if (this.closed) return Promise.reject(this.closeError ?? /* @__PURE__ */ new Error("codex app-server client is closed"));
		if (options.signal?.aborted) return Promise.reject(/* @__PURE__ */ new Error(`${method} aborted`));
		const id = this.nextId++;
		const message = {
			id,
			method,
			params
		};
		return new Promise((resolve, reject) => {
			let timeout;
			let cleanupAbort;
			const cleanup = () => {
				if (timeout) {
					clearTimeout(timeout);
					timeout = void 0;
				}
				cleanupAbort?.();
				cleanupAbort = void 0;
			};
			const rejectPending = (error) => {
				if (!this.pending.has(id)) return;
				this.pending.delete(id);
				cleanup();
				reject(error);
			};
			if (options.timeoutMs && Number.isFinite(options.timeoutMs) && options.timeoutMs > 0) {
				timeout = setTimeout(() => rejectPending(/* @__PURE__ */ new Error(`${method} timed out`)), Math.max(100, options.timeoutMs));
				timeout.unref?.();
			}
			if (options.signal) {
				const abortListener = () => rejectPending(/* @__PURE__ */ new Error(`${method} aborted`));
				options.signal.addEventListener("abort", abortListener, { once: true });
				cleanupAbort = () => options.signal?.removeEventListener("abort", abortListener);
			}
			this.pending.set(id, {
				method,
				resolve: (value) => {
					cleanup();
					resolve(value);
				},
				reject: (error) => {
					cleanup();
					reject(error);
				},
				cleanup
			});
			if (options.signal?.aborted) {
				rejectPending(/* @__PURE__ */ new Error(`${method} aborted`));
				return;
			}
			try {
				this.writeMessage(message, (error) => rejectPending(error));
			} catch (error) {
				rejectPending(error instanceof Error ? error : new Error(String(error)));
			}
		});
	}
	/** Sends a fire-and-forget JSON-RPC notification to the app-server. */
	notify(method, params) {
		this.writeMessage({
			method,
			params
		});
	}
	/** Registers a handler for app-server requests sent back to OpenClaw. */
	addRequestHandler(handler) {
		this.requestHandlers.add(handler);
		return () => this.requestHandlers.delete(handler);
	}
	/** Registers a notification handler and returns its disposer. */
	addNotificationHandler(handler) {
		this.notificationHandlers.add(handler);
		return () => this.notificationHandlers.delete(handler);
	}
	/** Registers a close handler and returns its disposer. */
	addCloseHandler(handler) {
		this.closeHandlers.add(handler);
		return () => this.closeHandlers.delete(handler);
	}
	/** Closes the transport without waiting for process/socket shutdown. */
	close() {
		if (!this.markClosed(/* @__PURE__ */ new Error("codex app-server client is closed"))) return;
		closeCodexAppServerTransport(this.child);
	}
	/** Closes the transport and waits for shutdown according to transport policy. */
	async closeAndWait(options) {
		this.markClosed(/* @__PURE__ */ new Error("codex app-server client is closed"));
		return await closeCodexAppServerTransportAndWait(this.child, options);
	}
	writeMessage(message, onError) {
		if (this.closed) return;
		const id = "id" in message ? message.id : void 0;
		const method = "method" in message ? message.method : void 0;
		this.child.stdin.write(`${stringifyCodexAppServerMessage(message)}\n`, (error) => {
			if (error) {
				log.warn("codex app-server write failed", {
					error,
					id,
					method
				});
				onError?.(error);
			}
		});
	}
	handleLine(line) {
		const rawLine = line.endsWith("\r") ? line.slice(0, -1) : line;
		if (this.pendingParse) {
			this.handlePendingParseLine(rawLine);
			return;
		}
		const trimmed = rawLine.trim();
		if (!trimmed) return;
		let parsed;
		try {
			parsed = JSON.parse(trimmed);
		} catch (error) {
			if (shouldBufferCodexAppServerParseFailure(trimmed, error)) {
				this.pendingParse = {
					text: trimmed,
					lineCount: 1,
					firstError: error
				};
				return;
			}
			logCodexAppServerParseFailure(trimmed, error, 1);
			return;
		}
		this.handleParsedMessage(parsed);
	}
	handlePendingParseLine(line) {
		const pending = this.pendingParse;
		if (!pending) return;
		const candidate = `${pending.text}\\n${line}`;
		let parsed;
		try {
			parsed = JSON.parse(candidate);
		} catch (error) {
			const lineCount = pending.lineCount + 1;
			if (shouldBufferCodexAppServerParseFailure(candidate.trim(), error) && candidate.length <= CODEX_APP_SERVER_PARSE_BUFFER_MAX && lineCount <= CODEX_APP_SERVER_PARSE_BUFFER_MAX_LINES) {
				this.pendingParse = {
					text: candidate,
					lineCount,
					firstError: pending.firstError
				};
				return;
			}
			this.pendingParse = void 0;
			logCodexAppServerParseFailure(candidate, error, lineCount);
			return;
		}
		this.pendingParse = void 0;
		this.handleParsedMessage(parsed);
	}
	handleParsedMessage(parsed) {
		if (!parsed || typeof parsed !== "object") return;
		const message = parsed;
		if (isRpcResponse(message)) {
			this.handleResponse(message);
			return;
		}
		if (!("method" in message)) return;
		if ("id" in message && message.id !== void 0) {
			this.handleServerRequest({
				id: message.id,
				method: message.method,
				params: message.params
			});
			return;
		}
		this.handleNotification({
			method: message.method,
			params: message.params
		});
	}
	handleResponse(response) {
		const pending = this.pending.get(response.id);
		if (!pending) return;
		this.pending.delete(response.id);
		if (response.error) {
			pending.reject(new CodexAppServerRpcError(response.error, pending.method));
			return;
		}
		pending.resolve(response.result);
	}
	async handleServerRequest(request) {
		try {
			const result = await this.runServerRequestHandlers(request);
			if (result !== void 0) {
				this.writeMessage({
					id: request.id,
					result
				});
				return;
			}
			this.writeMessage({
				id: request.id,
				result: defaultServerRequestResponse(request)
			});
		} catch (error) {
			const message = error instanceof Error ? error.message : String(error);
			log.warn("codex app-server server request handler failed", {
				id: request.id,
				method: request.method,
				error
			});
			this.writeMessage({
				id: request.id,
				error: {
					code: -32603,
					message
				}
			});
		}
	}
	async runServerRequestHandlers(request) {
		const timeoutResponse = timeoutServerRequestResponse(request);
		if (!timeoutResponse) return await this.runServerRequestHandlersWithoutTimeout(request);
		let timeout;
		try {
			return await Promise.race([this.runServerRequestHandlersWithoutTimeout(request), new Promise((resolve) => {
				timeout = setTimeout(() => {
					log.warn("codex app-server server request timed out", {
						id: request.id,
						method: request.method,
						timeoutMs: CODEX_DYNAMIC_TOOL_SERVER_REQUEST_TIMEOUT_MS
					});
					resolve(timeoutResponse);
				}, CODEX_DYNAMIC_TOOL_SERVER_REQUEST_TIMEOUT_MS);
				timeout.unref?.();
			})]);
		} finally {
			if (timeout) clearTimeout(timeout);
		}
	}
	async runServerRequestHandlersWithoutTimeout(request) {
		for (const handler of this.requestHandlers) {
			const result = await handler(request);
			if (result !== void 0) return result;
		}
	}
	handleNotification(notification) {
		for (const handler of this.notificationHandlers) Promise.resolve(handler(notification)).catch((error) => {
			log.warn("codex app-server notification handler failed", { error });
		});
	}
	closeWithError(error) {
		if (this.markClosed(error)) closeCodexAppServerTransport(this.child);
	}
	markClosed(error) {
		if (this.closed) return false;
		this.closed = true;
		this.closeError = error;
		this.lines.close();
		this.rejectPendingRequests(error);
		return true;
	}
	rejectPendingRequests(error) {
		for (const pending of this.pending.values()) {
			pending.cleanup();
			pending.reject(error);
		}
		this.pending.clear();
		for (const handler of this.closeHandlers) handler(this);
	}
};
function defaultServerRequestResponse(request) {
	if (request.method === "item/tool/call") return {
		contentItems: [{
			type: "inputText",
			text: "OpenClaw did not register a handler for this app-server tool call."
		}],
		success: false
	};
	if (request.method === "item/commandExecution/requestApproval" || request.method === "item/fileChange/requestApproval") return { decision: "decline" };
	if (request.method === "item/permissions/requestApproval") return {
		permissions: {},
		scope: "turn"
	};
	if (request.method === "item/tool/requestUserInput") return { answers: {} };
	if (request.method === "mcpServer/elicitation/request") return { action: "decline" };
	return {};
}
function stringifyCodexAppServerMessage(message) {
	return JSON.stringify(message, (_key, value) => typeof value === "string" ? value.replace(UNPAIRED_SURROGATE_RE, "") : value) ?? "null";
}
function timeoutServerRequestResponse(request) {
	if (request.method !== "item/tool/call") return;
	return {
		contentItems: [{
			type: "inputText",
			text: `OpenClaw dynamic tool call timed out after ${CODEX_DYNAMIC_TOOL_SERVER_REQUEST_TIMEOUT_MS}ms before sending a response to Codex.`
		}],
		success: false
	};
}
/** Raised when the initialize handshake detects an unsupported app-server version. */
var CodexAppServerVersionError = class extends Error {
	constructor(detectedVersion) {
		const detected = detectedVersion ? `detected ${detectedVersion}` : "OpenClaw could not determine the running Codex version";
		super(`Codex app-server ${MIN_CODEX_APP_SERVER_VERSION} or newer is required, but ${detected}. Update the configured Codex app-server binary, or remove custom command overrides to use the managed binary.`);
		this.name = "CodexAppServerVersionError";
		this.detectedVersion = detectedVersion;
	}
};
function assertSupportedCodexAppServerVersion(response) {
	const detectedVersion = readCodexVersionFromUserAgent(response.userAgent);
	if (!detectedVersion || compareCodexAppServerVersions(detectedVersion, "0.143.0") < 0) throw new CodexAppServerVersionError(detectedVersion);
	return detectedVersion;
}
function isUnsupportedCodexAppServerVersionError(error) {
	return error instanceof CodexAppServerVersionError;
}
function buildCodexAppServerRuntimeIdentity(response, serverVersion) {
	const userAgent = readNonEmptyInitializeString(response.userAgent);
	const codexHome = readNonEmptyInitializeString(response.codexHome);
	const platformFamily = readNonEmptyInitializeString(response.platformFamily);
	const platformOs = readNonEmptyInitializeString(response.platformOs);
	return {
		serverVersion,
		...userAgent ? { userAgent } : {},
		...codexHome ? { codexHome } : {},
		...platformFamily ? { platformFamily } : {},
		...platformOs ? { platformOs } : {}
	};
}
function readNonEmptyInitializeString(value) {
	const trimmed = value?.trim();
	return trimmed ? trimmed : void 0;
}
/** Extracts the Codex version from the app-server initialize user-agent field. */
function readCodexVersionFromUserAgent(userAgent) {
	return (userAgent?.match(/^[^/]+\/(\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?)(?:[\s(]|$)/))?.[1];
}
/** Compares stable Codex app-server versions for protocol floor checks. */
function compareCodexAppServerVersions(left, right) {
	const leftVersion = parseVersionForComparison(left);
	const rightVersion = parseVersionForComparison(right);
	const leftParts = leftVersion.parts;
	const rightParts = rightVersion.parts;
	for (let index = 0; index < Math.max(leftParts.length, rightParts.length); index += 1) {
		const leftPart = leftParts[index] ?? 0;
		const rightPart = rightParts[index] ?? 0;
		if (leftPart !== rightPart) return leftPart < rightPart ? -1 : 1;
	}
	if (leftVersion.unstableSuffix && !rightVersion.unstableSuffix) return -1;
	if (!leftVersion.unstableSuffix && rightVersion.unstableSuffix) return 1;
	return 0;
}
function parseVersionForComparison(version) {
	const hasBuildMetadata = version.includes("+");
	const [withoutBuild = version] = version.split("+", 1);
	const prereleaseIndex = withoutBuild.indexOf("-");
	return {
		parts: (prereleaseIndex >= 0 ? withoutBuild.slice(0, prereleaseIndex) : withoutBuild).split(".").map((part) => Number.parseInt(part, 10)).map((part) => Number.isFinite(part) ? part : 0),
		unstableSuffix: prereleaseIndex >= 0 || hasBuildMetadata
	};
}
function redactCodexAppServerLinePreview(value) {
	const redacted = value.replace(/\s+/g, " ").trim().replace(/(Bearer\s+)[A-Za-z0-9._~+/-]+/gi, "$1<redacted>").replace(/("(?:api_?key|authorization|token|access_token|refresh_token)"\s*:\s*")([^"]+)(")/gi, "$1<redacted>$3").replace(/\b([a-z0-9_]*(?:api_?key|authorization|access_token|refresh_token|token))(\s*=\s*)(["']?)[^\s"']+(\3)/gi, "$1$2$3<redacted>$4");
	return redacted.length > CODEX_APP_SERVER_PARSE_LOG_MAX ? `${redacted.slice(0, CODEX_APP_SERVER_PARSE_LOG_MAX)}...` : redacted;
}
function appendBoundedTail(current, next, maxLength) {
	const combined = `${current}${next}`;
	return combined.length > maxLength ? combined.slice(combined.length - maxLength) : combined;
}
function buildCodexAppServerExitError(code, signal, stderrTail) {
	const stderrPreview = redactCodexAppServerLinePreview(stderrTail);
	const suffix = stderrPreview ? ` stderr=${JSON.stringify(stderrPreview)}` : "";
	return /* @__PURE__ */ new Error(`codex app-server exited: code=${formatExitValue(code)} signal=${formatExitValue(signal)}${suffix}`);
}
function shouldBufferCodexAppServerParseFailure(value, error) {
	if (!value.startsWith("{") && !value.startsWith("[")) return false;
	const message = error instanceof Error ? error.message : String(error);
	return message.includes("Unterminated string") || message.includes("Unexpected end of JSON input");
}
function logCodexAppServerParseFailure(value, error, fragmentCount) {
	const linePreview = redactCodexAppServerLinePreview(value);
	const suffix = fragmentCount > 1 ? ` fragments=${fragmentCount}` : "";
	log.warn("failed to parse codex app-server message", {
		error,
		errorMessage: error instanceof Error ? error.message : String(error),
		fragmentCount,
		linePreview,
		consoleMessage: `failed to parse codex app-server message${suffix}: preview=${JSON.stringify(linePreview)}`
	});
}
const CODEX_APP_SERVER_APPROVAL_REQUEST_METHODS = /* @__PURE__ */ new Set([
	"item/commandExecution/requestApproval",
	"item/fileChange/requestApproval",
	"item/permissions/requestApproval"
]);
/** Returns true for app-server approval request methods OpenClaw can answer. */
function isCodexAppServerApprovalRequest(method) {
	return CODEX_APP_SERVER_APPROVAL_REQUEST_METHODS.has(method);
}
function formatExitValue(value) {
	if (value === null || value === void 0) return "null";
	if (typeof value === "string" || typeof value === "number") return String(value);
	return "unknown";
}
//#endregion
//#region extensions/codex/src/app-server/managed-binary.ts
/**
* Resolves the managed Codex app-server binary shipped with or installed beside
* the Codex plugin before stdio startup.
*/
const CODEX_PLUGIN_ROOT = resolveDefaultCodexPluginRoot(path.dirname(fileURLToPath(import.meta.url)));
const MACOS_DESKTOP_CODEX_APP_SERVER_COMMAND = "/Applications/Codex.app/Contents/Resources/codex";
/** Rewrites managed stdio start options to point at an executable Codex binary path. */
async function resolveManagedCodexAppServerStartOptions(startOptions, options = {}) {
	if (startOptions.transport !== "stdio" || startOptions.commandSource !== "managed") return startOptions;
	const platform = options.platform ?? process.platform;
	const paths = resolveManagedCodexAppServerPaths({
		platform,
		pluginRoot: options.pluginRoot
	});
	const pathExists = options.pathExists ?? commandPathExists;
	const commandPaths = await findManagedCodexAppServerCommandPaths({
		candidateCommandPaths: paths.candidateCommandPaths,
		pathExists,
		platform
	});
	const commandPath = commandPaths[0];
	const managedFallbackCommandPaths = commandPaths.slice(1);
	return {
		...startOptions,
		command: commandPath,
		commandSource: "resolved-managed",
		...managedFallbackCommandPaths.length > 0 ? { managedFallbackCommandPaths } : {}
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
	return [.../* @__PURE__ */ new Set([
		...resolveDesktopCodexAppServerCommandCandidates(platform),
		...roots.map((root) => pathApi.join(root, "node_modules", ".bin", commandName)),
		...resolveManagedCodexPackageBinCandidates(roots, platform)
	])];
}
function resolveDesktopCodexAppServerCommandCandidates(platform) {
	return platform === "darwin" ? [MACOS_DESKTOP_CODEX_APP_SERVER_COMMAND] : [];
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
	return [.../* @__PURE__ */ new Set([...directRoots, ...resolveNearestNodeModulesProjectRoots(directRoots, platform)])];
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
async function findManagedCodexAppServerCommandPaths(params) {
	const commandPaths = [];
	for (const commandPath of params.candidateCommandPaths) if (await params.pathExists(commandPath, params.platform)) commandPaths.push(commandPath);
	if (commandPaths.length > 0) return commandPaths;
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
	globalState[SHARED_CODEX_APP_SERVER_CLIENT_STATE] ??= {
		clients: /* @__PURE__ */ new Map(),
		leasedReleases: /* @__PURE__ */ new WeakMap()
	};
	return globalState[SHARED_CODEX_APP_SERVER_CLIENT_STATE];
}
async function resolveCodexAppServerClientStartContext(options) {
	const agentDir = options?.agentDir ?? resolveDefaultAgentDir(options?.config ?? {});
	const requestedStartOptions = options?.startOptions ?? resolveCodexAppServerRuntimeOptions().start;
	const usesNativeAuth = options?.authProfileId === null || requestedStartOptions.homeScope === "user";
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
			startOptions: await resolveManagedCodexAppServerStartOptions(requestedStartOptions),
			agentDir,
			authProfileId: usesNativeAuth ? null : authProfileId,
			config: options?.config,
			...authProfileStore ? { authProfileStore } : {}
		})
	};
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
		const client = await startInitializedCodexAppServerClient({
			startOptions,
			agentDir,
			authProfileId: usesNativeAuth ? null : authProfileId,
			config: options?.config,
			onStartedClient: (startedClient) => {
				entry.client = startedClient;
				options?.onStartedClient?.(startedClient);
			}
		});
		entry.client = client;
		client.addCloseHandler((closedClient) => clearSharedClientEntryIfCurrent(key, closedClient));
		return client;
	})());
	try {
		const client = await withTimeout(sharedPromise, options?.timeoutMs ?? 0, "codex app-server initialize timed out");
		ensureCodexAppServerClientRuntime(client, {
			agentDir,
			authProfileId: usesNativeAuth ? void 0 : authProfileId,
			config: options?.config
		});
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
	return await startInitializedCodexAppServerClient({
		startOptions,
		agentDir,
		authProfileId: usesNativeAuth ? null : authProfileId,
		authProfileStore,
		config: options?.config,
		timeoutMs: options?.timeoutMs,
		onStartedClient: options?.onStartedClient
	});
}
async function startInitializedCodexAppServerClient(params) {
	const startOptionsCandidates = resolveManagedFallbackStartOptions(params.startOptions);
	for (let index = 0; index < startOptionsCandidates.length; index += 1) {
		const startOptions = startOptionsCandidates[index];
		const client = CodexAppServerClient.start(startOptions);
		params.onStartedClient?.(client);
		const initialize = client.initialize();
		try {
			await withTimeout(initialize, params.timeoutMs ?? 0, "codex app-server initialize timed out");
		} catch (error) {
			client.close();
			initialize.catch(() => void 0);
			if (shouldTryManagedFallbackStartOption(error, startOptions, index, startOptionsCandidates)) continue;
			throw error;
		}
		ensureCodexAppServerClientRuntime(client, {
			agentDir: params.agentDir,
			authProfileId: params.authProfileId ?? void 0,
			...params.authProfileStore ? { authProfileStore: params.authProfileStore } : {},
			config: params.config
		});
		try {
			await applyCodexAppServerAuthProfile({
				client,
				agentDir: params.agentDir,
				authProfileId: params.authProfileId,
				startOptions,
				config: params.config,
				...params.authProfileStore ? { authProfileStore: params.authProfileStore } : {}
			});
			return client;
		} catch (error) {
			client.close();
			throw error;
		}
	}
	throw new Error("Managed Codex app-server fallback candidates were exhausted.");
}
function resolveManagedFallbackStartOptions(startOptions) {
	const commands = [startOptions.command, ...startOptions.managedFallbackCommandPaths ?? []];
	const candidates = [];
	for (let index = 0; index < commands.length; index += 1) {
		const command = commands[index];
		const managedFallbackCommandPaths = commands.slice(index + 1);
		const candidate = {
			...startOptions,
			command
		};
		if (managedFallbackCommandPaths.length === 0) delete candidate.managedFallbackCommandPaths;
		else candidate.managedFallbackCommandPaths = managedFallbackCommandPaths;
		candidates.push(candidate);
	}
	return candidates;
}
function shouldTryManagedFallbackStartOption(error, startOptions, index, startOptionsCandidates) {
	return startOptions.commandSource === "resolved-managed" && index < startOptionsCandidates.length - 1 && isUnsupportedCodexAppServerVersionError(error);
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
export { resolveCodexAppServerAuthAccountCacheKey as _, createIsolatedCodexAppServerClient as a, resolveCodexAppServerFallbackApiKeyCacheKey as b, retireSharedCodexAppServerClientIfCurrent as c, isCodexAppServerApprovalRequest as d, isCodexAppServerConnectionClosedError as f, rememberCodexRateLimitsRead as g, readRecentCodexRateLimits as h, clearSharedCodexAppServerClientIfCurrentAndWait as i, withTimeout as l, readCodexRateLimitsRevision as m, clearSharedCodexAppServerClientIfCurrent as n, getLeasedSharedCodexAppServerClient as o, ensureCodexAppServerClientRuntime as p, clearSharedCodexAppServerClientIfCurrentAndUnclaimed as r, releaseLeasedSharedCodexAppServerClient as s, clearSharedCodexAppServerClientAndWait as t, CodexAppServerRpcError as u, resolveCodexAppServerAuthProfileId as v, resolveCodexAppServerHomeDir as x, resolveCodexAppServerAuthProfileIdForAgent as y };
