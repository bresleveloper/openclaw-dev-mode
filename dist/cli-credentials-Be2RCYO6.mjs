import { D as resolveExpiresAtMsFromDurationMs, o as asDateTimestampMs } from "./number-coercion-CLj0HTDM.mjs";
import { r as resolveOsHomeRelativePath } from "./home-dir-BKwhAL2c.mjs";
import { t as loadJsonFileThroughSymlink } from "./json-file-BY7NXKEu.mjs";
import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import { createHash } from "node:crypto";
//#region src/agents/cli-credentials.ts
/**
* Reads and refreshes credentials stored by external CLI runtimes such as
* Codex, Gemini, and MiniMax.
*/
const CODEX_CLI_AUTH_FILENAME = "auth.json";
const MINIMAX_CLI_CREDENTIALS_RELATIVE_PATH = ".minimax/oauth_creds.json";
const GEMINI_CLI_CREDENTIALS_RELATIVE_PATH = ".gemini/oauth_creds.json";
const CODEX_CLI_FALLBACK_EXPIRY_MS = 36e5;
let codexCliCache = null;
let minimaxCliCache = null;
let geminiCliCache = null;
function resolveCodexCliHomePath(codexHome, env = process.env) {
	const configured = codexHome ?? env.CODEX_HOME;
	const home = resolveOsHomeRelativePath(configured || "~/.codex", { env });
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
function codexAuthJsonUsesApiKey(data) {
	const authMode = typeof data.auth_mode === "string" ? data.auth_mode.toLowerCase() : void 0;
	if (authMode) return authMode === "apikey" || authMode === "api_key";
	return typeof data.OPENAI_API_KEY === "string";
}
function resolveMiniMaxCliCredentialsPath(homeDir) {
	const baseDir = resolveOsHomeRelativePath(homeDir ?? "~");
	return path.join(baseDir, MINIMAX_CLI_CREDENTIALS_RELATIVE_PATH);
}
function resolveGeminiCliCredentialsPath(homeDir) {
	const baseDir = resolveOsHomeRelativePath(homeDir ?? "~");
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
		codexHome: resolveCodexCliHomePath(options?.codexHome)
	};
}
function decodeJwtExpiryMs(token) {
	const parts = token.split(".");
	if (parts.length < 2) return null;
	const encodedPayload = parts.at(1);
	if (!encodedPayload) return null;
	try {
		const payloadRaw = Buffer.from(encodedPayload, "base64url").toString("utf8");
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
	const encodedPayload = parts.at(1);
	if (!encodedPayload) return {};
	try {
		const payloadRaw = Buffer.from(encodedPayload, "base64url").toString("utf8");
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
function parseCodexOauthCredential(data, fallbackExpiry) {
	if (!codexAuthJsonUsesChatGptTokens(data)) return null;
	const tokens = data.tokens;
	const accessToken = tokens?.access_token;
	const refreshToken = tokens?.refresh_token;
	if (typeof accessToken !== "string" || !accessToken) return null;
	if (typeof refreshToken !== "string" || !refreshToken) return null;
	const expires = decodeJwtExpiryMs(accessToken) ?? fallbackExpiry;
	if (expires === void 0) return null;
	return {
		type: "oauth",
		provider: "openai",
		access: accessToken,
		refresh: refreshToken,
		expires,
		accountId: typeof tokens?.account_id === "string" ? tokens.account_id : void 0,
		idToken: typeof tokens?.id_token === "string" ? tokens.id_token : void 0
	};
}
function parseCodexApiKeyCredential(data) {
	if (!codexAuthJsonUsesApiKey(data)) return null;
	const key = typeof data.OPENAI_API_KEY === "string" ? data.OPENAI_API_KEY.trim() : "";
	return key ? {
		type: "api_key",
		provider: "openai",
		key
	} : null;
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
	const raw = loadJsonFileThroughSymlink(credPath);
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
	const credPath = resolveGeminiCliCredentialsPath(options?.homeDir);
	const raw = loadJsonFileThroughSymlink(credPath);
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
function formatCodexApiKeyForLoginStatus(key) {
	return key.length <= 13 ? "***" : `${key.slice(0, 8)}***${key.slice(-5)}`;
}
/** Reads an API key only when Codex confirms that exact credential is active. */
function readCodexCliActiveApiKey(options) {
	const { execSyncImpl, codexHome } = resolveCodexKeychainParams(options);
	let status;
	try {
		status = execSyncImpl("codex login status 2>&1", {
			encoding: "utf8",
			timeout: 5e3,
			stdio: [
				"pipe",
				"pipe",
				"pipe"
			],
			env: {
				...process.env,
				CODEX_HOME: codexHome
			}
		}).trim();
	} catch {
		return null;
	}
	const activeFingerprint = /^Logged in using an API key - (.+)$/mu.exec(status)?.[1]?.trim();
	const legacyApiKeyStatus = status.trim() === "Logged in using an API key";
	if (!activeFingerprint && !legacyApiKeyStatus) return null;
	const candidates = [];
	const authPath = path.join(codexHome, CODEX_CLI_AUTH_FILENAME);
	const raw = loadJsonFileThroughSymlink(authPath);
	if (raw && typeof raw === "object") {
		const fileCredential = parseCodexApiKeyCredential(raw);
		if (fileCredential) candidates.push(fileCredential);
	}
	const keychainRecord = readCodexKeychainAuthRecord({
		codexHome,
		allowKeychainPrompt: options?.allowKeychainPrompt,
		platform: options?.platform,
		execSync: options?.execSync
	});
	if (keychainRecord) {
		const keychainCredential = parseCodexApiKeyCredential(keychainRecord);
		if (keychainCredential) candidates.push(keychainCredential);
	}
	const matchingKeys = new Set(candidates.filter((candidate) => legacyApiKeyStatus || formatCodexApiKeyForLoginStatus(candidate.key) === activeFingerprint).map((candidate) => candidate.key));
	if (matchingKeys.size !== 1) return null;
	const key = [...matchingKeys][0];
	return key ? {
		type: "api_key",
		provider: "openai",
		key
	} : null;
}
/** Reads Codex CLI OAuth credentials from Keychain or CODEX_HOME auth.json. */
function readCodexCliCredentials(options) {
	const keychainRecord = readCodexKeychainAuthRecord(options);
	if (keychainRecord) {
		const lastRefreshRaw = keychainRecord.last_refresh;
		const keychainCredential = parseCodexOauthCredential(keychainRecord, resolveCodexFallbackExpiryMs(typeof lastRefreshRaw === "string" || typeof lastRefreshRaw === "number" ? new Date(lastRefreshRaw).getTime() : Date.now()) ?? resolveCodexFallbackExpiryMs());
		if (keychainCredential) return keychainCredential;
	}
	const authPath = path.join(resolveCodexCliHomePath(options?.codexHome), CODEX_CLI_AUTH_FILENAME);
	const raw = loadJsonFileThroughSymlink(authPath);
	if (!raw || typeof raw !== "object") return null;
	let fallbackExpiry;
	try {
		fallbackExpiry = resolveCodexFallbackExpiryMs(fs.statSync(authPath).mtimeMs);
	} catch {
		fallbackExpiry = resolveCodexFallbackExpiryMs();
	}
	return parseCodexOauthCredential(raw, fallbackExpiry);
}
/** Reads Codex CLI credentials with optional short-lived cache and file fingerprinting. */
function readCodexCliCredentialsCached(options) {
	const platform = options?.platform ?? process.platform;
	const ttlMs = options?.ttlMs ?? 0;
	const authPath = path.join(resolveCodexCliHomePath(options?.codexHome), CODEX_CLI_AUTH_FILENAME);
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
export { resolveCodexCliHomePath as a, readMiniMaxCliCredentialsCached as i, readCodexCliCredentialsCached as n, readGeminiCliCredentialsCached as r, readCodexCliActiveApiKey as t };
