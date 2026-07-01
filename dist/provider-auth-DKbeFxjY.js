import { a as normalizeLowercaseStringOrEmpty, c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import { E as resolveExpiresAtMsFromEpochSeconds, o as asDateTimestampMs, y as parseStrictNonNegativeInteger } from "./number-coercion-CJQ8TR--.js";
import { y as resolveStateDir } from "./paths-DyelItkH.js";
import "./types.secrets-lIZQEgMF.js";
import "./ref-contract-BWYV5Pqz.js";
import { s as resolveDefaultAgentDir } from "./agent-scope-config-C3ijpoNo.js";
import "./provider-env-vars-DFJoFB6-.js";
import { l as loadAuthProfileStoreForSecretsRuntime, n as ensureAuthProfileStore, u as loadAuthProfileStoreWithoutExternalProfiles } from "./store-SfOB_T2S.js";
import { n as saveJsonFile, t as loadJsonFile } from "./json-file-CVAOif1i.js";
import { n as resolveApiKeyForProfile } from "./oauth-De-NOeYf.js";
import { n as externalCliDiscoveryForProviderAuth } from "./external-cli-discovery-DX_pyqms.js";
import "./profiles-DswMRdru.js";
import { n as listProfilesForProvider } from "./profile-list-CtT2BW_g.js";
import "./repair-DBYGZN0_.js";
import { i as resolveAuthProfileOrder } from "./order-DO7M8GzY.js";
import { i as COPILOT_INTEGRATION_ID, s as buildCopilotIdeHeaders } from "./copilot-dynamic-headers-CF9zPORX.js";
import { n as resolveProviderEndpoint } from "./provider-attribution-8gdGyO--.js";
import "./model-auth-markers-C4s6SbvA.js";
import { t as resolveEnvApiKey } from "./model-auth-env-W5zTaRQi.js";
import "./models-config.providers.secrets-CeEgoaNO.js";
import "./provider-model-shared-pp09751S.js";
import "./provider-auth-input-Bxx5NKk7.js";
import "./provider-auth-helpers-sTwxNMVI.js";
import "./provider-api-key-auth-BJsVS391.js";
import "./agent-dir-compat-vEbxJgD6.js";
import "./provider-auth-result-_VrXMg4X.js";
import path from "node:path";
import { createHash, randomBytes } from "node:crypto";
//#region src/plugin-sdk/provider-openai-chatgpt-auth.ts
const OPENAI_CODEX_AUTH_CLAIM = "https://api.openai.com/auth";
const OPENAI_CODEX_PROFILE_CLAIM = "https://api.openai.com/profile";
/**
* Decodes a JWT payload without verifying signatures for local metadata extraction.
*/
function decodeOpenAICodexJwtPayload(token) {
	const payload = token.split(".")[1];
	if (!payload) return;
	try {
		const parsed = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
		return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : void 0;
	} catch {
		return;
	}
}
function readRecord(value) {
	return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}
/**
* Resolves stable account/profile metadata from OpenAI Codex OAuth access-token claims.
*/
function resolveOpenAICodexAuthIdentity(params) {
	const payload = decodeOpenAICodexJwtPayload(params.access);
	const auth = readRecord(payload?.[OPENAI_CODEX_AUTH_CLAIM]);
	const email = normalizeOptionalString(readRecord(payload?.[OPENAI_CODEX_PROFILE_CLAIM]).email);
	const accountId = params.accountId ?? normalizeOptionalString(auth.chatgpt_account_id);
	const chatgptPlanType = normalizeOptionalString(auth.chatgpt_plan_type);
	if (email) return {
		...accountId ? { accountId } : {},
		...chatgptPlanType ? { chatgptPlanType } : {},
		email,
		profileName: email
	};
	const stableSubject = normalizeOptionalString(auth.chatgpt_account_user_id) ?? normalizeOptionalString(auth.chatgpt_user_id) ?? normalizeOptionalString(auth.user_id) ?? normalizeOptionalString(payload?.sub) ?? accountId;
	return {
		...accountId ? { accountId } : {},
		...chatgptPlanType ? { chatgptPlanType } : {},
		...stableSubject ? { profileName: `id-${Buffer.from(stableSubject).toString("base64url")}` } : {}
	};
}
/**
* Resolves the OAuth access-token expiry timestamp in milliseconds.
*/
function resolveOpenAICodexAccessTokenExpiry(access) {
	const exp = decodeOpenAICodexJwtPayload(access)?.exp;
	return resolveExpiresAtMsFromEpochSeconds(exp);
}
/**
* Builds persisted credential metadata for OpenAI Codex OAuth profiles.
*/
function buildOpenAICodexCredentialExtra(identity) {
	const extra = {
		...identity.accountId ? { accountId: identity.accountId } : {},
		...identity.chatgptPlanType ? { chatgptPlanType: identity.chatgptPlanType } : {},
		...identity.idToken ? { idToken: identity.idToken } : {}
	};
	return Object.keys(extra).length > 0 ? extra : void 0;
}
/**
* Picks the imported profile name used when migrating OpenAI Codex auth.
*/
function resolveOpenAICodexImportProfileName(identity, fallback) {
	if (identity.accountId) return `account-${identity.accountId.replaceAll(/[^A-Za-z0-9._-]+/gu, "-")}`;
	if (identity.profileName?.startsWith("id-")) return identity.profileName;
	return fallback;
}
//#endregion
//#region src/plugin-sdk/oauth-utils.ts
/**
* Encode a flat object as application/x-www-form-urlencoded form data.
*
* @deprecated OAuth provider-owned helper; keep this local to provider plugins instead.
*/
function toFormUrlEncoded(data) {
	return Object.entries(data).map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`).join("&");
}
/**
* Generate a PKCE verifier/challenge pair suitable for OAuth authorization flows.
*
* @deprecated OAuth provider-owned helper; keep this local to provider plugins instead.
*/
function generatePkceVerifierChallenge() {
	const verifier = randomBytes(32).toString("base64url");
	return {
		verifier,
		challenge: createHash("sha256").update(verifier).digest("base64url")
	};
}
/** Generate a PKCE verifier/challenge pair with a 64-character hex verifier. */
function generateHexPkceVerifierChallenge() {
	const verifier = randomBytes(32).toString("hex");
	return {
		verifier,
		challenge: createHash("sha256").update(verifier).digest("base64url")
	};
}
//#endregion
//#region src/plugin-sdk/provider-auth.ts
const COPILOT_TOKEN_URL = "https://api.github.com/copilot_internal/v2/token";
/** @deprecated GitHub Copilot provider-owned helper; do not use from third-party plugins. */
const DEFAULT_COPILOT_API_BASE_URL = "https://api.individual.githubcopilot.com";
function resolveCopilotTokenCachePath(env = process.env) {
	return path.join(resolveStateDir(env), "credentials", "github-copilot.token.json");
}
function isCopilotTokenUsable(cache, now = Date.now()) {
	const expiresAt = asDateTimestampMs(cache.expiresAt);
	return cache.integrationId === "vscode-chat" && expiresAt !== void 0 && expiresAt - now > 300 * 1e3;
}
function resolveCopilotTokenExpiresAtMs(expiresAt) {
	const parsed = typeof expiresAt === "number" && Number.isFinite(expiresAt) ? expiresAt : typeof expiresAt === "string" && expiresAt.trim().length > 0 ? parseStrictNonNegativeInteger(expiresAt) : void 0;
	if (parsed === void 0) return;
	return parsed < 1e11 ? resolveExpiresAtMsFromEpochSeconds(parsed) : asDateTimestampMs(parsed);
}
function parseCopilotTokenResponse(value) {
	if (!value || typeof value !== "object") throw new Error("Unexpected response from GitHub Copilot token endpoint");
	const asRecord = value;
	const token = asRecord.token;
	const expiresAt = asRecord.expires_at;
	if (typeof token !== "string" || token.trim().length === 0) throw new Error("Copilot token response missing token");
	const expiresAtMs = resolveCopilotTokenExpiresAtMs(expiresAt);
	if (expiresAt === void 0 || expiresAt === null || typeof expiresAt === "string" && expiresAt.trim().length === 0) throw new Error("Copilot token response missing expires_at");
	if (expiresAtMs === void 0) throw new Error("Copilot token response has invalid expires_at");
	return {
		token,
		expiresAt: expiresAtMs
	};
}
async function cancelUnreadResponseBody(response) {
	if (!response.bodyUsed) await response.body?.cancel().catch(() => void 0);
}
function resolveCopilotProxyHost(proxyEp) {
	const trimmed = proxyEp.trim();
	if (!trimmed) return null;
	const urlText = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
	try {
		const url = new URL(urlText);
		if (url.protocol !== "http:" && url.protocol !== "https:") return null;
		return normalizeLowercaseStringOrEmpty(url.hostname);
	} catch {
		return null;
	}
}
/** @deprecated GitHub Copilot provider-owned helper; do not use from third-party plugins. */
function deriveCopilotApiBaseUrlFromToken(token) {
	const trimmed = token.trim();
	if (!trimmed) return null;
	const proxyEp = trimmed.match(/(?:^|;)\s*proxy-ep=([^;\s]+)/i)?.[1]?.trim();
	if (!proxyEp) return null;
	const proxyHost = resolveCopilotProxyHost(proxyEp);
	if (!proxyHost) return null;
	const baseUrl = `https://${proxyHost.replace(/^proxy\./i, "api.")}`;
	return resolveProviderEndpoint(baseUrl).endpointClass === "invalid" ? null : baseUrl;
}
/**
* @deprecated GitHub Copilot provider-owned helper; do not use from third-party plugins.
*/
async function resolveCopilotApiToken(params) {
	const env = params.env ?? process.env;
	const cachePath = params.cachePath?.trim() || resolveCopilotTokenCachePath(env);
	const loadJsonFileFn = params.loadJsonFileImpl ?? loadJsonFile;
	const saveJsonFileFn = params.saveJsonFileImpl ?? saveJsonFile;
	const cached = loadJsonFileFn(cachePath);
	if (cached && typeof cached.token === "string" && typeof cached.expiresAt === "number") {
		if (isCopilotTokenUsable(cached)) return {
			token: cached.token,
			expiresAt: cached.expiresAt,
			source: `cache:${cachePath}`,
			baseUrl: deriveCopilotApiBaseUrlFromToken(cached.token) ?? "https://api.individual.githubcopilot.com"
		};
	}
	const res = await (params.fetchImpl ?? fetch)(COPILOT_TOKEN_URL, {
		method: "GET",
		headers: {
			Accept: "application/json",
			Authorization: `Bearer ${params.githubToken}`,
			"Copilot-Integration-Id": COPILOT_INTEGRATION_ID,
			...buildCopilotIdeHeaders({ includeApiVersion: true })
		}
	});
	if (!res.ok) {
		await cancelUnreadResponseBody(res);
		throw new Error(`Copilot token exchange failed: HTTP ${res.status}`);
	}
	const json = parseCopilotTokenResponse(await res.json());
	const payload = {
		token: json.token,
		expiresAt: json.expiresAt,
		updatedAt: Date.now(),
		integrationId: COPILOT_INTEGRATION_ID
	};
	saveJsonFileFn(cachePath, payload);
	return {
		token: payload.token,
		expiresAt: payload.expiresAt,
		source: `fetched:${COPILOT_TOKEN_URL}`,
		baseUrl: deriveCopilotApiBaseUrlFromToken(payload.token) ?? "https://api.individual.githubcopilot.com"
	};
}
/**
* Checks whether a provider has either env auth or matching local auth profiles configured.
*/
function isProviderApiKeyConfigured(params) {
	if (resolveEnvApiKey(params.provider)?.apiKey) return true;
	const agentDir = params.agentDir?.trim();
	if (!agentDir) return false;
	const store = ensureAuthProfileStore(agentDir, { allowKeychainPrompt: false });
	const profileIds = listProfilesForProvider(store, params.provider);
	if (!params.profileTypes?.length) return profileIds.length > 0;
	const allowedTypes = new Set(params.profileTypes);
	return profileIds.some((profileId) => {
		const type = store.profiles[profileId]?.type;
		return type !== void 0 && allowedTypes.has(type);
	});
}
/**
* Lists auth profile ids usable for a provider without throwing on missing stores or keychain access.
*/
function listUsableProviderAuthProfileIds(params) {
	try {
		const { agentDir, profileIds, store } = resolveUsableProviderAuthProfiles(params);
		return {
			agentDir,
			profileIds: filterAuthProfileIdsByType(store, profileIds, params)
		};
	} catch {
		return {
			agentDir: "",
			profileIds: []
		};
	}
}
/**
* Checks whether any usable auth profile exists for a provider.
*/
function isProviderAuthProfileConfigured(params) {
	return listUsableProviderAuthProfileIds(params).profileIds.length > 0;
}
/**
* Resolves the first usable auth-profile API key for a provider in configured profile order.
*/
async function resolveProviderAuthProfileApiKey(params) {
	const { agentDir, profileIds, store } = resolveUsableProviderAuthProfiles(params);
	if (!agentDir || profileIds.length === 0) return;
	for (const profileId of filterAuthProfileIdsByType(store, profileIds, params)) {
		const resolved = await resolveApiKeyForProfile({
			cfg: params.cfg,
			store,
			agentDir,
			profileId
		});
		if (resolved?.apiKey) return resolved.apiKey;
	}
}
function resolveUsableProviderAuthProfiles(params) {
	const agentDir = params.agentDir?.trim() || resolveDefaultAgentDir(params.cfg ?? {});
	const externalCli = params.includeExternalCliAuth ? externalCliDiscoveryForProviderAuth({
		cfg: params.cfg,
		provider: params.provider,
		allowKeychainPrompt: params.allowKeychainPrompt
	}) : void 0;
	const store = externalCli ? loadAuthProfileStoreForSecretsRuntime(agentDir, { externalCli }) : loadAuthProfileStoreForSecretsRuntime(agentDir);
	const profileIds = resolveAuthProfileOrder({
		cfg: params.cfg,
		store,
		provider: params.provider
	});
	if (profileIds.length > 0) return {
		agentDir,
		profileIds,
		store
	};
	const fallbackStore = loadAuthProfileStoreWithoutExternalProfiles(agentDir, { allowKeychainPrompt: params.allowKeychainPrompt ?? false });
	return {
		agentDir,
		profileIds: resolveAuthProfileOrder({
			cfg: params.cfg,
			store: fallbackStore,
			provider: params.provider
		}),
		store: fallbackStore
	};
}
function filterAuthProfileIdsByType(store, profileIds, params) {
	if (!params.profileTypes?.length) return [...profileIds];
	const allowedTypes = new Set(params.profileTypes);
	return profileIds.filter((profileId) => {
		const type = store.profiles[profileId]?.type;
		return type !== void 0 && allowedTypes.has(type);
	});
}
//#endregion
export { listUsableProviderAuthProfileIds as a, generateHexPkceVerifierChallenge as c, buildOpenAICodexCredentialExtra as d, decodeOpenAICodexJwtPayload as f, resolveOpenAICodexImportProfileName as h, isProviderAuthProfileConfigured as i, generatePkceVerifierChallenge as l, resolveOpenAICodexAuthIdentity as m, deriveCopilotApiBaseUrlFromToken as n, resolveCopilotApiToken as o, resolveOpenAICodexAccessTokenExpiry as p, isProviderApiKeyConfigured as r, resolveProviderAuthProfileApiKey as s, DEFAULT_COPILOT_API_BASE_URL as t, toFormUrlEncoded as u };
