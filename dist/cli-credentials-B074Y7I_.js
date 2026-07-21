import { C as resolveExpiresAtMsFromDurationMs, P as timestampMsToIsoString, o as asDateTimestampMs } from "./number-coercion-CJQ8TR--.js";
import { m as resolveUserPath } from "./utils-CRO4LGEB.js";
import { t as createSubsystemLogger } from "./subsystem-C3fiUGN1.js";
import { t as loadJsonFile } from "./json-file-BDBAJUrO.js";
import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import { createHash } from "node:crypto";
//#region src/agents/cli-credentials.ts
/**
* Reads and refreshes credentials stored by external CLI runtimes such as
* Claude Code, Codex, Gemini, and MiniMax.
*/
const log = createSubsystemLogger("agents/auth-profiles");
const CLAUDE_CLI_CREDENTIALS_RELATIVE_PATH = ".claude/.credentials.json";
const CODEX_CLI_AUTH_FILENAME = "auth.json";
const MINIMAX_CLI_CREDENTIALS_RELATIVE_PATH = ".minimax/oauth_creds.json";
const GEMINI_CLI_CREDENTIALS_RELATIVE_PATH = ".gemini/oauth_creds.json";
const CODEX_CLI_FALLBACK_EXPIRY_MS = 3600 * 1e3;
const CLAUDE_CLI_KEYCHAIN_SERVICE = "Claude Code-credentials";
let claudeCliCache = null;
let codexCliCache = null;
let minimaxCliCache = null;
let geminiCliCache = null;
function resolveClaudeCliCredentialsPath(homeDir) {
	const baseDir = homeDir ?? resolveUserPath("~");
	return path.join(baseDir, CLAUDE_CLI_CREDENTIALS_RELATIVE_PATH);
}
function parseClaudeCliOauthCredential(claudeOauth) {
	if (!claudeOauth || typeof claudeOauth !== "object") return null;
	const accessToken = claudeOauth.accessToken;
	const refreshToken = claudeOauth.refreshToken;
	const expiresAt = claudeOauth.expiresAt;
	if (typeof accessToken !== "string" || !accessToken) return null;
	if (typeof expiresAt !== "number" || !Number.isFinite(expiresAt) || expiresAt <= 0) return null;
	if (typeof refreshToken === "string" && refreshToken) return {
		type: "oauth",
		provider: "anthropic",
		access: accessToken,
		refresh: refreshToken,
		expires: expiresAt
	};
	return {
		type: "token",
		provider: "anthropic",
		token: accessToken,
		expires: expiresAt
	};
}
function resolveCodexHomePath(codexHome) {
	const configured = codexHome ?? process.env.CODEX_HOME;
	const home = configured ? resolveUserPath(configured) : resolveUserPath("~/.codex");
	try {
		return fs.realpathSync.native(home);
	} catch {
		return home;
	}
}
function codexAuthJsonUsesChatGptTokens(data) {
	const authMode = typeof data.auth_mode === "string" ? data.auth_mode.toLowerCase() : void 0;
	if (authMode) return authMode === "chatgpt" || authMode === "chatgptauthtokens";
	return typeof data.OPENAI_API_KEY !== "string";
}
function resolveMiniMaxCliCredentialsPath(homeDir) {
	const baseDir = homeDir ?? resolveUserPath("~");
	return path.join(baseDir, MINIMAX_CLI_CREDENTIALS_RELATIVE_PATH);
}
function resolveGeminiCliCredentialsPath(homeDir) {
	const baseDir = homeDir ?? resolveUserPath("~");
	return path.join(baseDir, GEMINI_CLI_CREDENTIALS_RELATIVE_PATH);
}
function readFileMtimeMs(filePath) {
	try {
		return fs.statSync(filePath).mtimeMs;
	} catch {
		return null;
	}
}
function readCachedCliCredential(options) {
	const { ttlMs, cache, cacheKey, read, setCache, readSourceFingerprint } = options;
	if (ttlMs <= 0) return read();
	const now = Date.now();
	const sourceFingerprint = readSourceFingerprint?.();
	if (cache && cache.cacheKey === cacheKey && cache.sourceFingerprint === sourceFingerprint && now - cache.readAt < ttlMs) return cache.value;
	const value = read();
	const cachedSourceFingerprint = readSourceFingerprint?.();
	if (!readSourceFingerprint || cachedSourceFingerprint === sourceFingerprint) setCache({
		value,
		readAt: now,
		cacheKey,
		sourceFingerprint: cachedSourceFingerprint
	});
	else setCache(null);
	return value;
}
function computeCodexKeychainAccount(codexHome) {
	return `cli|${createHash("sha256").update(codexHome).digest("hex").slice(0, 16)}`;
}
function resolveCodexKeychainParams(options) {
	return {
		platform: options?.platform ?? process.platform,
		execSyncImpl: options?.execSync ?? execSync,
		codexHome: resolveCodexHomePath(options?.codexHome)
	};
}
function decodeJwtExpiryMs(token) {
	const parts = token.split(".");
	if (parts.length < 2) return null;
	try {
		const payloadRaw = Buffer.from(parts[1], "base64url").toString("utf8");
		const payload = JSON.parse(payloadRaw);
		if (typeof payload.exp !== "number" || !Number.isFinite(payload.exp) || payload.exp <= 0) return null;
		return asDateTimestampMs(payload.exp * 1e3) ?? null;
	} catch {
		return null;
	}
}
function decodeJwtIdentityClaims(token) {
	const parts = token.split(".");
	if (parts.length < 2) return {};
	try {
		const payloadRaw = Buffer.from(parts[1], "base64url").toString("utf8");
		const payload = JSON.parse(payloadRaw);
		return {
			sub: typeof payload.sub === "string" && payload.sub ? payload.sub : void 0,
			email: typeof payload.email === "string" && payload.email ? payload.email : void 0
		};
	} catch {
		return {};
	}
}
function readCodexKeychainAuthRecord(options) {
	const { platform, execSyncImpl, codexHome } = resolveCodexKeychainParams(options);
	if (platform !== "darwin" || options?.allowKeychainPrompt === false) return null;
	const account = computeCodexKeychainAccount(codexHome);
	try {
		const secret = execSyncImpl(`security find-generic-password -s "Codex Auth" -a "${account}" -w`, {
			encoding: "utf8",
			timeout: 5e3,
			stdio: [
				"pipe",
				"pipe",
				"pipe"
			]
		}).trim();
		return JSON.parse(secret);
	} catch {
		return null;
	}
}
function resolveCodexFallbackExpiryMs(nowMs) {
	return resolveExpiresAtMsFromDurationMs(CODEX_CLI_FALLBACK_EXPIRY_MS, { nowMs: nowMs === void 0 ? void 0 : Math.floor(nowMs) });
}
function readCodexKeychainCredentials(options) {
	const parsed = readCodexKeychainAuthRecord(options);
	if (!parsed) return null;
	const tokens = parsed.tokens;
	try {
		const accessToken = tokens?.access_token;
		const refreshToken = tokens?.refresh_token;
		if (typeof accessToken !== "string" || !accessToken) return null;
		if (typeof refreshToken !== "string" || !refreshToken) return null;
		const lastRefreshRaw = parsed.last_refresh;
		const fallbackExpiry = resolveCodexFallbackExpiryMs(typeof lastRefreshRaw === "string" || typeof lastRefreshRaw === "number" ? new Date(lastRefreshRaw).getTime() : Date.now()) ?? resolveCodexFallbackExpiryMs();
		const expires = decodeJwtExpiryMs(accessToken) ?? fallbackExpiry;
		if (expires === void 0) return null;
		const accountId = typeof tokens?.account_id === "string" ? tokens.account_id : void 0;
		const idToken = typeof tokens?.id_token === "string" ? tokens.id_token : void 0;
		log.info("read codex credentials from keychain", {
			source: "keychain",
			expires: timestampMsToIsoString(expires)
		});
		return {
			type: "oauth",
			provider: "openai",
			access: accessToken,
			refresh: refreshToken,
			expires,
			accountId,
			idToken
		};
	} catch {
		return null;
	}
}
function readCliOauthTokenFields(data) {
	const accessToken = data.access_token;
	const refreshToken = data.refresh_token;
	const expiresAt = data.expiry_date;
	if (typeof accessToken !== "string" || !accessToken) return null;
	if (typeof refreshToken !== "string" || !refreshToken) return null;
	if (typeof expiresAt !== "number" || !Number.isFinite(expiresAt)) return null;
	return {
		access: accessToken,
		refresh: refreshToken,
		expires: expiresAt
	};
}
function readPortalCliOauthCredentials(credPath, provider) {
	const raw = loadJsonFile(credPath);
	if (!raw || typeof raw !== "object") return null;
	const tokens = readCliOauthTokenFields(raw);
	return tokens ? {
		type: "oauth",
		provider,
		...tokens
	} : null;
}
function readMiniMaxCliCredentials(options) {
	return readPortalCliOauthCredentials(resolveMiniMaxCliCredentialsPath(options?.homeDir), "minimax-portal");
}
function readGeminiCliCredentials(options) {
	const raw = loadJsonFile(resolveGeminiCliCredentialsPath(options?.homeDir));
	if (!raw || typeof raw !== "object") return null;
	const data = raw;
	const tokens = readCliOauthTokenFields(data);
	if (!tokens) return null;
	const idTokenRaw = data.id_token;
	const identity = typeof idTokenRaw === "string" && idTokenRaw ? decodeJwtIdentityClaims(idTokenRaw) : {};
	return {
		type: "oauth",
		provider: "google-gemini-cli",
		...tokens,
		...identity.email ? { email: identity.email } : {},
		...identity.sub ? { accountId: identity.sub } : {}
	};
}
function readClaudeCliKeychainCredentials(execSyncImpl = execSync) {
	try {
		const result = execSyncImpl(`security find-generic-password -s "${CLAUDE_CLI_KEYCHAIN_SERVICE}" -w`, {
			encoding: "utf8",
			timeout: 5e3,
			stdio: [
				"pipe",
				"pipe",
				"pipe"
			]
		});
		return parseClaudeCliOauthCredential(JSON.parse(result.trim())?.claudeAiOauth);
	} catch {
		return null;
	}
}
/** Reads Claude CLI credentials from macOS Keychain or the CLI credential file. */
function readClaudeCliCredentials(options) {
	if ((options?.platform ?? process.platform) === "darwin" && options?.allowKeychainPrompt !== false) {
		const keychainCreds = readClaudeCliKeychainCredentials(options?.execSync);
		if (keychainCreds) {
			log.info("read anthropic credentials from claude cli keychain", { type: keychainCreds.type });
			return keychainCreds;
		}
	}
	const raw = loadJsonFile(resolveClaudeCliCredentialsPath(options?.homeDir));
	if (!raw || typeof raw !== "object") return null;
	return parseClaudeCliOauthCredential(raw.claudeAiOauth);
}
/** @deprecated Anthropic provider-owned CLI credential helper; do not use from third-party plugins. */
function readClaudeCliCredentialsCached(options) {
	const platform = options?.platform ?? process.platform;
	const ttlMs = options?.ttlMs ?? 0;
	const credentialsPath = resolveClaudeCliCredentialsPath(options?.homeDir);
	const keychainIntent = platform === "darwin" && options?.allowKeychainPrompt !== false ? "keychain" : "file";
	return readCachedCliCredential({
		ttlMs,
		cache: claudeCliCache,
		cacheKey: `${credentialsPath}:${keychainIntent}`,
		read: () => readClaudeCliCredentials({
			allowKeychainPrompt: options?.allowKeychainPrompt,
			platform,
			homeDir: options?.homeDir,
			execSync: options?.execSync
		}),
		setCache: (next) => {
			claudeCliCache = next;
		}
	});
}
/** Reads Codex CLI OAuth credentials from Keychain or CODEX_HOME auth.json. */
function readCodexCliCredentials(options) {
	const keychain = readCodexKeychainCredentials({
		codexHome: options?.codexHome,
		allowKeychainPrompt: options?.allowKeychainPrompt,
		platform: options?.platform,
		execSync: options?.execSync
	});
	if (keychain) return keychain;
	const authPath = path.join(resolveCodexHomePath(options?.codexHome), CODEX_CLI_AUTH_FILENAME);
	const raw = loadJsonFile(authPath);
	if (!raw || typeof raw !== "object") return null;
	const data = raw;
	if (!codexAuthJsonUsesChatGptTokens(data)) return null;
	const tokens = data.tokens;
	if (!tokens || typeof tokens !== "object") return null;
	const accessToken = tokens.access_token;
	const refreshToken = tokens.refresh_token;
	if (typeof accessToken !== "string" || !accessToken) return null;
	if (typeof refreshToken !== "string" || !refreshToken) return null;
	let fallbackExpiry;
	try {
		fallbackExpiry = resolveCodexFallbackExpiryMs(fs.statSync(authPath).mtimeMs);
	} catch {
		fallbackExpiry = resolveCodexFallbackExpiryMs();
	}
	const expires = decodeJwtExpiryMs(accessToken) ?? fallbackExpiry;
	if (expires === void 0) return null;
	return {
		type: "oauth",
		provider: "openai",
		access: accessToken,
		refresh: refreshToken,
		expires,
		accountId: typeof tokens.account_id === "string" ? tokens.account_id : void 0,
		idToken: typeof tokens.id_token === "string" ? tokens.id_token : void 0
	};
}
/** Reads Codex CLI credentials with optional short-lived cache and file fingerprinting. */
function readCodexCliCredentialsCached(options) {
	const platform = options?.platform ?? process.platform;
	const ttlMs = options?.ttlMs ?? 0;
	const authPath = path.join(resolveCodexHomePath(options?.codexHome), CODEX_CLI_AUTH_FILENAME);
	const keychainIntent = platform === "darwin" && options?.allowKeychainPrompt !== false ? "keychain" : "file";
	return readCachedCliCredential({
		ttlMs,
		cache: codexCliCache,
		cacheKey: `${platform}|${authPath}:${keychainIntent}`,
		read: () => readCodexCliCredentials({
			codexHome: options?.codexHome,
			allowKeychainPrompt: options?.allowKeychainPrompt,
			platform: options?.platform,
			execSync: options?.execSync
		}),
		setCache: (next) => {
			codexCliCache = next;
		},
		readSourceFingerprint: () => readFileMtimeMs(authPath)
	});
}
/** Reads MiniMax CLI credentials with optional short-lived cache. */
function readMiniMaxCliCredentialsCached(options) {
	const credPath = resolveMiniMaxCliCredentialsPath(options?.homeDir);
	return readCachedCliCredential({
		ttlMs: options?.ttlMs ?? 0,
		cache: minimaxCliCache,
		cacheKey: credPath,
		read: () => readMiniMaxCliCredentials({ homeDir: options?.homeDir }),
		setCache: (next) => {
			minimaxCliCache = next;
		},
		readSourceFingerprint: () => readFileMtimeMs(credPath)
	});
}
/** Reads Gemini CLI credentials with optional short-lived cache. */
function readGeminiCliCredentialsCached(options) {
	const credPath = resolveGeminiCliCredentialsPath(options?.homeDir);
	return readCachedCliCredential({
		ttlMs: options?.ttlMs ?? 0,
		cache: geminiCliCache,
		cacheKey: credPath,
		read: () => readGeminiCliCredentials({ homeDir: options?.homeDir }),
		setCache: (next) => {
			geminiCliCache = next;
		},
		readSourceFingerprint: () => readFileMtimeMs(credPath)
	});
}
//#endregion
export { readMiniMaxCliCredentialsCached as i, readCodexCliCredentialsCached as n, readGeminiCliCredentialsCached as r, readClaudeCliCredentialsCached as t };
