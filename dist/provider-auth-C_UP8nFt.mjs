import { A as resolveExpiresAtMsFromEpochSeconds, C as parseStrictNonNegativeInteger, o as asDateTimestampMs } from "./number-coercion-CLj0HTDM.mjs";
import { c as isRecord, t as asNonArrayRecord } from "./record-coerce-DItp3I4t.mjs";
import { r as resolveOsHomeRelativePath } from "./home-dir-BKwhAL2c.mjs";
import { E as resolveStateDir } from "./paths-DehQwyE0.mjs";
import "./types.secrets-B5xWSzLp.mjs";
import "./provider-env-vars-BM4XH1SL.mjs";
import { i as logWarn } from "./logger-BHMMVs5C.mjs";
import { t as cancelUnreadResponseBody } from "./http-response-body-DXfezLdR.mjs";
import "./http-body-Bl_jph25.mjs";
import { m as readProviderJsonResponse } from "./provider-http-errors-CTY_-ABT.mjs";
import "./provider-openai-chatgpt-auth-2jKJupls.mjs";
import "./persisted-B486xwB_.mjs";
import "./credential-state-CWZ_V0ds.mjs";
import { r as writeJsonTarget, t as loadJsonFileThroughSymlink } from "./json-file-BY7NXKEu.mjs";
import "./cli-credentials-Be2RCYO6.mjs";
import "./profiles-B-MkhBI8.mjs";
import "./order-BQhYF772.mjs";
import "./model-auth-markers-BfYDKFYI.mjs";
import "./model-auth-env-CmdBc7TL.mjs";
import "./store-runtime-CzCVI_rv.mjs";
import "./repair-BcSbbkEG.mjs";
import "./models-config.providers.secret-helpers-kIZAIANY.mjs";
import { i as COPILOT_INTEGRATION_ID, s as buildCopilotIdeHeaders } from "./copilot-dynamic-headers-C8eJEO7a.mjs";
import "./provider-auth-availability-DlkWkL2p.mjs";
import "./provider-auth-helpers-CqP4hf2X.mjs";
import "./provider-env-vars-BVYgJD4_.mjs";
import "./provider-auth-write-compat-CMQIlTLf.mjs";
import "./provider-auth-input-Bs4B3uJA.mjs";
import "./provider-api-key-auth-hH2FGen5.mjs";
import "./provider-auth-result-ByCutRUI.mjs";
import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import { userInfo } from "node:os";
import { createHash, randomBytes } from "node:crypto";
//#region src/plugin-sdk/github-copilot-domain.ts
const DEFAULT_GITHUB_COPILOT_DOMAIN = "github.com";
const GHE_DATA_RESIDENCY_HOST = /^[a-z0-9-]+\.ghe\.com$/;
/**
* Whether a host may be templated into a Copilot endpoint: the public host or a
* data-residency GHE tenant (`*.ghe.com`). An absent value counts as supported
* because callers fall back to the public default. Anything else (a scheme,
* path, credentials, or an off-allowlist host) is not, so a persisted or
* injected origin can be rejected before any token is sent to it.
*/
function isSupportedGithubCopilotDomain(raw) {
	const trimmed = (raw ?? "").trim().toLowerCase();
	if (!trimmed) return true;
	if (!/^[a-z0-9.-]+$/.test(trimmed)) return false;
	return trimmed === "github.com" || GHE_DATA_RESIDENCY_HOST.test(trimmed);
}
/**
* Coerce a user/config-supplied GitHub host to a safe bare lowercase hostname.
*
* Fails closed to public `github.com`: only the public host and data-residency
* GHE tenants (`*.ghe.com`) are trusted. Any other value falls back to the
* default rather than being used verbatim, because the resolved host becomes the
* `api.<host>` endpoint that receives the GitHub OAuth token during exchange — a
* typo or injected value like `evil.com` must never redirect that token.
* (Classic self-hosted GHE Server uses arbitrary hostnames but does not host
* Copilot, so it is deliberately out of scope.) Config-supplied hosts coerce
* rather than throw; persisted credential origins are rejected upstream with
* `isSupportedGithubCopilotDomain` before reaching a token request.
*/
function normalizeGithubCopilotDomain(raw) {
	const trimmed = (raw ?? "").trim().toLowerCase();
	if (trimmed && isSupportedGithubCopilotDomain(trimmed)) return trimmed;
	return DEFAULT_GITHUB_COPILOT_DOMAIN;
}
//#endregion
//#region src/plugin-sdk/github-copilot-token-endpoint.ts
function isSupportedGithubCopilotApiHost(host, enterpriseDomain) {
	if (host === "copilot-proxy.githubusercontent.com" || host.endsWith(".githubcopilot.com")) return true;
	if (!enterpriseDomain || !isSupportedGithubCopilotDomain(enterpriseDomain) || normalizeGithubCopilotDomain(enterpriseDomain) === "github.com") return false;
	const tenant = normalizeGithubCopilotDomain(enterpriseDomain);
	return host === tenant || host.endsWith(`.${tenant}`);
}
/**
* Resolves the optional `proxy-ep` hint embedded in a Copilot API token.
* The hint is untrusted credential data: only GitHub-owned Copilot hosts, or
* service hosts below the credential's validated GHE.com tenant, may receive it.
*/
function resolveGithubCopilotTokenEndpoint(token, enterpriseDomain) {
	const proxyEndpoint = token.trim().match(/(?:^|;)\s*proxy-ep=([^;\s]+)/i)?.[1]?.trim();
	if (!proxyEndpoint) return {
		hasProxyEndpoint: false,
		baseUrl: null
	};
	const urlText = /^https?:\/\//i.test(proxyEndpoint) ? proxyEndpoint : `https://${proxyEndpoint}`;
	try {
		const url = new URL(urlText);
		if (url.protocol !== "http:" && url.protocol !== "https:") return {
			hasProxyEndpoint: true,
			baseUrl: null
		};
		const apiHost = url.hostname.toLowerCase().replace(/^proxy\./, "api.");
		return {
			hasProxyEndpoint: true,
			baseUrl: isSupportedGithubCopilotApiHost(apiHost, enterpriseDomain) ? `https://${apiHost}` : null
		};
	} catch {
		return {
			hasProxyEndpoint: true,
			baseUrl: null
		};
	}
}
//#endregion
//#region src/plugin-sdk/provider-auth-copilot-cache.ts
const COPILOT_CACHE_NAMESPACE = "github-copilot-token";
const COPILOT_TOKEN_CACHE_MAX_ENTRIES = 8;
function resolveLegacyCopilotTokenCachePath(env) {
	return path.join(resolveStateDir(env), "credentials", "github-copilot.token.json");
}
function fingerprintCopilotSourceCredential(githubToken) {
	return createHash("sha256").update(githubToken).digest("hex");
}
function isCopilotTokenUsable(params) {
	const expiresAt = asDateTimestampMs(params.cache.expiresAt);
	const cacheDomain = params.cache.domain ?? "github.com";
	return params.cache.integrationId === "vscode-chat" && cacheDomain === params.domain && params.cache.sourceCredentialFingerprint === params.sourceCredentialFingerprint && expiresAt !== void 0 && expiresAt - (params.now ?? Date.now()) > 3e5;
}
async function resolveCopilotTokenCache(params) {
	if (params.cachePath !== void 0 || params.loadJsonFileImpl !== void 0 || params.saveJsonFileImpl !== void 0) {
		const cachePath = params.cachePath?.trim() || resolveLegacyCopilotTokenCachePath(params.env);
		const loadJsonFileFn = params.loadJsonFileImpl ?? loadJsonFileThroughSymlink;
		const saveJsonFileFn = params.saveJsonFileImpl ?? writeJsonTarget;
		return {
			path: cachePath,
			load: async () => loadJsonFileFn(cachePath),
			save: async (value) => saveJsonFileFn(cachePath, value)
		};
	}
	const { createCorePluginStateKeyedStore } = await import("./plugin-state-store-Bm-w12Xn.mjs");
	const store = createCorePluginStateKeyedStore({
		ownerId: "core:provider-auth",
		namespace: COPILOT_CACHE_NAMESPACE,
		maxEntries: COPILOT_TOKEN_CACHE_MAX_ENTRIES,
		overflowPolicy: "evict-oldest",
		env: params.env
	});
	const key = `${params.domain}:${params.sourceCredentialFingerprint}`;
	return {
		path: "plugin-state",
		load: () => store.lookup(key),
		save: (value) => store.register(key, value, { ttlMs: Math.max(1, value.expiresAt - Date.now()) })
	};
}
//#endregion
//#region src/plugin-sdk/provider-auth-claude-compat.ts
const CLAUDE_CLI_CREDENTIALS_FILE = ".credentials.json";
const CLAUDE_CLI_USER_SETTINGS_FILE = "settings.json";
const CLAUDE_CLI_KEYCHAIN_SERVICE = "Claude Code-credentials";
const CLAUDE_CLI_KEYCHAIN_TIMEOUT_MS = 2e3;
const CLAUDE_CLI_KEYCHAIN_ACCOUNT_FALLBACK = "claude-code-user";
const MACOS_SECURITY_PATH = "/usr/bin/security";
const SAFE_KEYCHAIN_ACCOUNT_PATTERN = /^[a-zA-Z0-9._-]+$/u;
let claudeCliCache = null;
function resolveClaudeCliConfigDir(homeDir) {
	if (homeDir !== void 0) return path.join(resolveOsHomeRelativePath(homeDir), ".claude");
	const configuredDir = process.env.CLAUDE_CONFIG_DIR;
	return configuredDir ? path.resolve(configuredDir) : path.join(resolveOsHomeRelativePath("~"), ".claude");
}
function resolveClaudeCliPath(homeDir, fileName) {
	return path.join(resolveClaudeCliConfigDir(homeDir), fileName);
}
function resolveClaudeCliCredentialsPath(homeDir) {
	if (homeDir !== void 0) return path.join(resolveClaudeCliConfigDir(homeDir), CLAUDE_CLI_CREDENTIALS_FILE);
	const secureStorageDir = process.env.CLAUDE_SECURESTORAGE_CONFIG_DIR;
	if (secureStorageDir === void 0) return resolveClaudeCliPath(void 0, CLAUDE_CLI_CREDENTIALS_FILE);
	const credentialDir = secureStorageDir ? path.resolve(secureStorageDir) : path.join(resolveOsHomeRelativePath("~"), ".claude");
	return path.join(credentialDir, CLAUDE_CLI_CREDENTIALS_FILE);
}
function resolveClaudeCliAccountPath(homeDir) {
	if (homeDir !== void 0) return path.join(resolveOsHomeRelativePath(homeDir), ".claude.json");
	const configuredDir = process.env.CLAUDE_CONFIG_DIR;
	return configuredDir ? path.join(path.resolve(configuredDir), ".claude.json") : path.join(resolveOsHomeRelativePath("~"), ".claude.json");
}
function resolveClaudeCliKeychainService(homeDir) {
	if (homeDir !== void 0) return CLAUDE_CLI_KEYCHAIN_SERVICE;
	const secureStorageDir = process.env.CLAUDE_SECURESTORAGE_CONFIG_DIR;
	const configDir = process.env.CLAUDE_CONFIG_DIR;
	const selectedDir = secureStorageDir !== void 0 ? secureStorageDir : configDir;
	if (!selectedDir) return CLAUDE_CLI_KEYCHAIN_SERVICE;
	const suffix = createHash("sha256").update(selectedDir.normalize("NFC")).digest("hex").slice(0, 8);
	return `${CLAUDE_CLI_KEYCHAIN_SERVICE}-${suffix}`;
}
function readFileMtimeMs(filePath) {
	try {
		return fs.statSync(filePath).mtimeMs;
	} catch {
		return null;
	}
}
function parseClaudeCliOauthCredential(value) {
	if (!value || typeof value !== "object") return null;
	const data = asNonArrayRecord(value);
	const accessToken = data.accessToken;
	const refreshToken = data.refreshToken;
	const expiresAt = data.expiresAt;
	if (typeof accessToken !== "string" || !accessToken || typeof expiresAt !== "number" || !Number.isFinite(expiresAt) || expiresAt <= 0) return null;
	const subscriptionType = typeof data.subscriptionType === "string" && data.subscriptionType.trim() ? data.subscriptionType.trim() : void 0;
	const rateLimitTier = typeof data.rateLimitTier === "string" && data.rateLimitTier.trim() ? data.rateLimitTier.trim() : void 0;
	const plan = {
		...subscriptionType ? { subscriptionType } : {},
		...rateLimitTier ? { rateLimitTier } : {}
	};
	return typeof refreshToken === "string" && refreshToken ? {
		type: "oauth",
		provider: "anthropic",
		access: accessToken,
		refresh: refreshToken,
		expires: expiresAt,
		...plan
	} : {
		type: "token",
		provider: "anthropic",
		token: accessToken,
		expires: expiresAt,
		...plan
	};
}
function readClaudeAccountEmail(homeDir) {
	const raw = loadJsonFileThroughSymlink(resolveClaudeCliAccountPath(homeDir));
	const account = asNonArrayRecord(raw).oauthAccount;
	const email = asNonArrayRecord(account).emailAddress;
	return typeof email === "string" && email.trim() ? email.trim() : void 0;
}
function withClaudeAccountEmail(credential, homeDir) {
	if (!credential || credential.type === "api_key_helper") return credential;
	if (path.dirname(resolveClaudeCliCredentialsPath(homeDir)) !== resolveClaudeCliConfigDir(homeDir)) return credential;
	const email = readClaudeAccountEmail(homeDir);
	return email ? {
		...credential,
		email
	} : credential;
}
function readClaudeApiKeyHelper(homeDir) {
	const raw = loadJsonFileThroughSymlink(resolveClaudeCliPath(homeDir, CLAUDE_CLI_USER_SETTINGS_FILE));
	const helper = asNonArrayRecord(raw).apiKeyHelper;
	return typeof helper === "string" && helper.trim() ? {
		type: "api_key_helper",
		provider: "anthropic",
		helperHash: createHash("sha256").update(helper.trim()).digest("hex")
	} : null;
}
function readClaudeKeychain(execSyncImpl, timeout, service) {
	try {
		const account = resolveClaudeCliKeychainAccount();
		const result = execSyncImpl(`${MACOS_SECURITY_PATH} find-generic-password -a "${account}" -w -s "${service}"`, {
			encoding: "utf8",
			stdio: [
				"pipe",
				"pipe",
				"pipe"
			],
			...timeout === void 0 ? {} : { timeout }
		});
		const parsed = JSON.parse(result.trim());
		return isRecord(parsed) ? parsed : null;
	} catch {
		return null;
	}
}
function hasClaudeKeychainItem(execSyncImpl, service) {
	try {
		const account = resolveClaudeCliKeychainAccount();
		execSyncImpl(`${MACOS_SECURITY_PATH} find-generic-password -a "${account}" -s "${service}"`, {
			encoding: "utf8",
			timeout: CLAUDE_CLI_KEYCHAIN_TIMEOUT_MS,
			stdio: [
				"pipe",
				"pipe",
				"pipe"
			]
		});
		return true;
	} catch {
		return false;
	}
}
function resolveClaudeCliKeychainAccount() {
	let account;
	try {
		account = process.env.USER || userInfo().username;
	} catch {
		account = void 0;
	}
	return account && SAFE_KEYCHAIN_ACCOUNT_PATTERN.test(account) ? account : CLAUDE_CLI_KEYCHAIN_ACCOUNT_FALLBACK;
}
function readClaudeCliCredentials(options) {
	const helper = readClaudeApiKeyHelper(options.homeDir);
	if (helper) return helper;
	const platform = options.platform ?? process.platform;
	const execSyncImpl = options.execSync ?? execSync;
	const keychainService = resolveClaudeCliKeychainService(options.homeDir);
	if (platform === "darwin" && options.allowKeychainPrompt !== false) {
		const credential = parseClaudeCliOauthCredential(readClaudeKeychain(execSyncImpl, options.tryKeychainWithoutPrompt ? CLAUDE_CLI_KEYCHAIN_TIMEOUT_MS : void 0, keychainService)?.claudeAiOauth);
		if (credential) return withClaudeAccountEmail(credential, options.homeDir);
	}
	const credentialsPath = resolveClaudeCliCredentialsPath(options.homeDir);
	const raw = loadJsonFileThroughSymlink(credentialsPath);
	const credential = withClaudeAccountEmail(parseClaudeCliOauthCredential(asNonArrayRecord(raw).claudeAiOauth), options.homeDir);
	if (credential) return credential;
	if (options.onStoredCredentialUnreadable && options.tryKeychainWithoutPrompt && (fs.existsSync(credentialsPath) || platform === "darwin" && hasClaudeKeychainItem(execSyncImpl, keychainService))) options.onStoredCredentialUnreadable();
	return null;
}
/**
* @deprecated Claude CLI owns native login. Kept functional for shipped Plugin SDK callers only.
* Scheduled for removal after v2026.10.
*/
function readClaudeCliCredentialsCached(options = {}) {
	const platform = options.platform ?? process.platform;
	const ttlMs = options.ttlMs ?? 0;
	const credentialsPath = resolveClaudeCliCredentialsPath(options.homeDir);
	const settingsPath = resolveClaudeCliPath(options.homeDir, CLAUDE_CLI_USER_SETTINGS_FILE);
	const accountPath = resolveClaudeCliAccountPath(options.homeDir);
	const keychainService = resolveClaudeCliKeychainService(options.homeDir);
	const cacheKey = `${credentialsPath}:${settingsPath}:${accountPath}:${platform !== "darwin" ? "file" : options.allowKeychainPrompt === false ? options.tryKeychainWithoutPrompt ? "keychain-presence" : "file" : options.tryKeychainWithoutPrompt ? "keychain-bounded" : "keychain"}:${keychainService}:${options.onStoredCredentialUnreadable && options.tryKeychainWithoutPrompt ? "notify" : "silent"}`;
	const sourceFingerprint = `${readFileMtimeMs(credentialsPath) ?? "missing"}:${readFileMtimeMs(settingsPath) ?? "missing"}:${readFileMtimeMs(accountPath) ?? "missing"}`;
	const now = Date.now();
	if (ttlMs > 0 && claudeCliCache?.cacheKey === cacheKey && claudeCliCache.sourceFingerprint === sourceFingerprint && now - claudeCliCache.readAt < ttlMs) return claudeCliCache.value;
	const value = readClaudeCliCredentials({
		...options,
		platform
	});
	const nextFingerprint = `${readFileMtimeMs(credentialsPath) ?? "missing"}:${readFileMtimeMs(settingsPath) ?? "missing"}:${readFileMtimeMs(accountPath) ?? "missing"}`;
	claudeCliCache = ttlMs > 0 && nextFingerprint === sourceFingerprint ? {
		value,
		readAt: now,
		cacheKey,
		sourceFingerprint: nextFingerprint
	} : null;
	return value;
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
/** @deprecated GitHub Copilot provider-owned helper; do not use from third-party plugins. */
const DEFAULT_COPILOT_API_BASE_URL = "https://api.individual.githubcopilot.com";
/**
* Data-residency GitHub Enterprise (`*.ghe.com`) support.
*
* Copilot on a data-residency GHE tenant lives at `<domain>` / `api.<domain>` /
* `copilot-api.<domain>` rather than the public github.com endpoints. The host
* is resolved (in priority order) from the `COPILOT_GITHUB_DOMAIN` env override,
* the persisted `models.providers.github-copilot.params.githubDomain` config, and
* finally public `github.com`.
*/
const COPILOT_PROVIDER_ID = "github-copilot";
const COPILOT_TOKEN_EXCHANGE_TIMEOUT_MS = 3e4;
function readGithubCopilotDomainFromConfig(config) {
	const params = config?.models?.providers?.[COPILOT_PROVIDER_ID]?.params;
	const value = params && typeof params === "object" ? params.githubDomain : void 0;
	if (typeof value !== "string" || value.trim().length === 0) return;
	const trimmed = value.trim();
	warnOnceOnRejectedConfigDomain(trimmed);
	return trimmed;
}
const warnedRejectedConfigDomains = /* @__PURE__ */ new Set();
function warnOnceOnRejectedConfigDomain(configured) {
	const lowered = configured.toLowerCase();
	if (lowered === "github.com") return;
	if (normalizeGithubCopilotDomain(configured) !== "github.com") return;
	if (warnedRejectedConfigDomains.has(lowered)) return;
	warnedRejectedConfigDomains.add(lowered);
	logWarn(`Ignoring configured GitHub Copilot domain "${configured}": only github.com and *.ghe.com tenants are accepted. Falling back to github.com.`);
}
function resolveGithubCopilotDomain(params) {
	const fromEnv = (params?.env ?? process.env).COPILOT_GITHUB_DOMAIN?.trim();
	if (fromEnv) return normalizeGithubCopilotDomain(fromEnv);
	if (params?.explicit) return normalizeGithubCopilotDomain(params.explicit);
	return normalizeGithubCopilotDomain(readGithubCopilotDomainFromConfig(params?.config));
}
/**
* Data-residency GHE Copilot tokens carry no `proxy-ep`, so the completions base
* URL cannot be derived from the token. Point it at the tenant Copilot proxy
* (`copilot-api.<domain>`) instead of the public individual endpoint.
*/
function copilotTokenUrl(domain) {
	return `https://api.${domain}/copilot_internal/v2/token`;
}
function copilotApiBaseFallback(domain) {
	return domain === "github.com" ? DEFAULT_COPILOT_API_BASE_URL : `https://copilot-api.${domain}`;
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
/** @deprecated GitHub Copilot provider-owned helper; do not use from third-party plugins. */
function deriveCopilotApiBaseUrlFromToken(token) {
	return resolveGithubCopilotTokenEndpoint(token).baseUrl;
}
/**
* @deprecated GitHub Copilot provider-owned helper; do not use from third-party plugins.
*/
async function resolveCopilotApiToken(params) {
	const env = params.env ?? process.env;
	const domain = resolveGithubCopilotDomain({
		env,
		explicit: params.githubDomain,
		config: params.config
	});
	const tokenUrl = copilotTokenUrl(domain);
	const apiBaseFallback = copilotApiBaseFallback(domain);
	const sourceCredentialFingerprint = fingerprintCopilotSourceCredential(params.githubToken);
	const cache = await resolveCopilotTokenCache({
		env,
		domain,
		sourceCredentialFingerprint,
		...params.cachePath !== void 0 ? { cachePath: params.cachePath } : {},
		...params.loadJsonFileImpl ? { loadJsonFileImpl: params.loadJsonFileImpl } : {},
		...params.saveJsonFileImpl ? { saveJsonFileImpl: params.saveJsonFileImpl } : {}
	});
	const cachePath = cache.path;
	const cached = await cache.load();
	if (cached && typeof cached.token === "string" && typeof cached.expiresAt === "number") {
		if (isCopilotTokenUsable({
			cache: cached,
			domain,
			sourceCredentialFingerprint
		})) return {
			token: cached.token,
			expiresAt: cached.expiresAt,
			source: `cache:${cachePath}`,
			baseUrl: deriveCopilotApiBaseUrlFromToken(cached.token) ?? apiBaseFallback
		};
	}
	const fetchImpl = params.fetchImpl ?? fetch;
	const signal = AbortSignal.timeout(COPILOT_TOKEN_EXCHANGE_TIMEOUT_MS);
	let json;
	try {
		const res = await fetchImpl(tokenUrl, {
			method: "GET",
			headers: {
				Accept: "application/json",
				Authorization: `Bearer ${params.githubToken}`,
				"Copilot-Integration-Id": COPILOT_INTEGRATION_ID,
				...buildCopilotIdeHeaders({ includeApiVersion: true })
			},
			signal
		});
		if (!res.ok) {
			await cancelUnreadResponseBody(res);
			throw new Error(`Copilot token exchange failed: HTTP ${res.status}`);
		}
		json = parseCopilotTokenResponse(await readProviderJsonResponse(res, "github-copilot.token"));
	} catch (error) {
		if (signal.aborted && error === signal.reason) throw new Error(`Copilot token exchange failed: timed out after ${COPILOT_TOKEN_EXCHANGE_TIMEOUT_MS}ms`, { cause: error });
		throw error;
	}
	const payload = {
		token: json.token,
		expiresAt: json.expiresAt,
		updatedAt: Date.now(),
		integrationId: COPILOT_INTEGRATION_ID,
		sourceCredentialFingerprint,
		domain
	};
	await cache.save(payload);
	return {
		token: payload.token,
		expiresAt: payload.expiresAt,
		source: `fetched:${tokenUrl}`,
		baseUrl: deriveCopilotApiBaseUrlFromToken(payload.token) ?? apiBaseFallback
	};
}
//#endregion
export { generatePkceVerifierChallenge as a, normalizeGithubCopilotDomain as c, generateHexPkceVerifierChallenge as i, deriveCopilotApiBaseUrlFromToken as n, toFormUrlEncoded as o, resolveCopilotApiToken as r, readClaudeCliCredentialsCached as s, DEFAULT_COPILOT_API_BASE_URL as t };
