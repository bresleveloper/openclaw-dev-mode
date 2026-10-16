import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { r as resolveOsHomeRelativePath } from "./home-dir-Dc6nN6HB.mjs";
import { c as isRecord, t as asNonArrayRecord } from "./record-coerce-TIsquoVR.mjs";
import "./types.secrets-DsPRn9Dz.mjs";
import "./provider-env-vars-C_lyIdYO.mjs";
import "./provider-openai-chatgpt-auth-fIvYFuQh.mjs";
import "./persisted-BVyWmvfF.mjs";
import "./credential-state-WXO5HScp.mjs";
import { t as loadJsonFileThroughSymlink } from "./json-file-5C1aYJVp.mjs";
import "./cli-credentials-iMPJTQjZ.mjs";
import "./profiles-bOpxmzRV.mjs";
import "./order-B7W96aON.mjs";
import "./model-auth-markers-Cuz_bq6T.mjs";
import "./model-auth-env-CI3qSPg4.mjs";
import "./store-runtime-CzCCJ_Oe.mjs";
import "./repair-CkThvU-e.mjs";
import "./models-config.providers.secret-helpers-Dr-x8G9F.mjs";
import "./provider-auth-availability-BmVs5Dky.mjs";
import "./copilot-dynamic-headers-C8eJEO7a.mjs";
import "./provider-auth-helpers-DYE6_4KQ.mjs";
import "./provider-env-vars-DC-s-8go.mjs";
import "./provider-auth-write-compat-B5xygsJD.mjs";
import "./provider-auth-input-DbalvXU_.mjs";
import "./provider-api-key-auth-Cg1OHhgW.mjs";
import "./provider-auth-result-BIBiHM9E.mjs";
import fs from "node:fs";
import path from "node:path";
import { userInfo } from "node:os";
import { execSync } from "node:child_process";
import { createHash } from "node:crypto";
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
	const subscriptionType = normalizeOptionalString(data.subscriptionType);
	const rateLimitTier = normalizeOptionalString(data.rateLimitTier);
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
	return normalizeOptionalString(email);
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
export { normalizeGithubCopilotDomain as n, readClaudeCliCredentialsCached as t };
