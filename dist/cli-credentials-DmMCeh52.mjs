import { D as resolveExpiresAtMsFromDurationMs, o as asDateTimestampMs } from "./number-coercion-CkhMiRw8.mjs";
import { r as resolveOsHomeRelativePath } from "./home-dir-CtsdYvX3.mjs";
import { a as asOptionalRecord } from "./record-coerce-TIsquoVR.mjs";
import { t as loadJsonFileThroughSymlink } from "./json-file-5C1aYJVp.mjs";
import fs from "node:fs";
import { createHash } from "node:crypto";
import path from "node:path";
import { execSync } from "node:child_process";
//#region src/agents/cli-credentials.ts
const CODEX_CLI_AUTH_FILENAME = "auth.json";
const MINIMAX_CLI_CREDENTIALS_RELATIVE_PATH = ".minimax/oauth_creds.json";
const GEMINI_CLI_CREDENTIALS_RELATIVE_PATH = ".gemini/oauth_creds.json";
const CODEX_CLI_FALLBACK_EXPIRY_MS = 36e5;
const readCachedCodexCredential = createCachedCliCredentialReader();
function resolveCodexCliHomePath(codexHome, env = process.env) {
	const configured = codexHome ?? env.CODEX_HOME;
	const home = resolveOsHomeRelativePath(configured || "~/.codex", { env });
	try {
		return fs.realpathSync.native(home);
	} catch {
		return home;
	}
}
function readCodexAuthMode(data) {
	return (typeof data.auth_mode === "string" ? data.auth_mode.toLowerCase() : void 0) || (typeof data.OPENAI_API_KEY === "string" ? "api_key" : "chatgpt");
}
/** Presence is only a discovery hint; Codex verifies the login without exporting its tokens. */
function hasCodexCliAuthFile(codexHome) {
	try {
		const file = fs.statSync(path.join(resolveCodexCliHomePath(codexHome), CODEX_CLI_AUTH_FILENAME));
		return file.isFile() && file.size > 0;
	} catch {
		return false;
	}
}
function readFileMtimeMs(filePath) {
	try {
		return fs.statSync(filePath).mtimeMs;
	} catch {
		return null;
	}
}
function createCachedCliCredentialReader() {
	let cache = null;
	return (options) => {
		const { ttlMs, cacheKey, read, sourcePath } = options;
		if (ttlMs <= 0) return read();
		const now = Date.now();
		const sourceFingerprint = readFileMtimeMs(sourcePath);
		if (cache && cache.cacheKey === cacheKey && cache.sourceFingerprint === sourceFingerprint && now - cache.readAt < ttlMs) return cache.value;
		const value = read();
		const cachedSourceFingerprint = readFileMtimeMs(sourcePath);
		if (cachedSourceFingerprint === sourceFingerprint) cache = {
			value,
			readAt: now,
			cacheKey,
			sourceFingerprint: cachedSourceFingerprint
		};
		else cache = null;
		return value;
	};
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
function decodeJwtPayload(token) {
	const encodedPayload = token.split(".").at(1);
	if (!encodedPayload) return;
	try {
		const payload = JSON.parse(Buffer.from(encodedPayload, "base64url").toString("utf8"));
		return asOptionalRecord(payload);
	} catch {
		return;
	}
}
function decodeJwtExpiryMs(token) {
	const exp = decodeJwtPayload(token)?.exp;
	return typeof exp === "number" && Number.isFinite(exp) && exp > 0 ? asDateTimestampMs(exp * 1e3) ?? null : null;
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
	if (!["chatgpt", "chatgptauthtokens"].includes(readCodexAuthMode(data))) return null;
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
	if (!["apikey", "api_key"].includes(readCodexAuthMode(data))) return null;
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
function readMiniMaxCliCredentials(credPath) {
	const raw = loadJsonFileThroughSymlink(credPath);
	if (!raw || typeof raw !== "object") return null;
	const tokens = readCliOauthTokenFields(raw);
	return tokens ? {
		type: "oauth",
		provider: "minimax-portal",
		...tokens
	} : null;
}
function readGeminiCliCredentials(credPath) {
	const raw = loadJsonFileThroughSymlink(credPath);
	if (!raw || typeof raw !== "object") return null;
	const data = raw;
	const tokens = readCliOauthTokenFields(data);
	if (!tokens) return null;
	const idTokenRaw = data.id_token;
	const identity = typeof idTokenRaw === "string" && idTokenRaw ? decodeJwtPayload(idTokenRaw) : void 0;
	return {
		type: "oauth",
		provider: "google-gemini-cli",
		...tokens,
		...typeof identity?.email === "string" && identity.email ? { email: identity.email } : {},
		...typeof identity?.sub === "string" && identity.sub ? { accountId: identity.sub } : {}
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
function readCodexCliCredentialsCached(options) {
	const platform = options?.platform ?? process.platform;
	const ttlMs = options?.ttlMs ?? 0;
	const authPath = path.join(resolveCodexCliHomePath(options?.codexHome), CODEX_CLI_AUTH_FILENAME);
	const keychainIntent = platform === "darwin" && options?.allowKeychainPrompt !== false ? "keychain" : "file";
	return readCachedCodexCredential({
		ttlMs,
		cacheKey: `${platform}|${authPath}:${keychainIntent}`,
		read: () => readCodexCliCredentials({
			codexHome: options?.codexHome,
			allowKeychainPrompt: options?.allowKeychainPrompt,
			platform: options?.platform,
			execSync: options?.execSync
		}),
		sourcePath: authPath
	});
}
function createCachedCliFileReader(relativePath, read) {
	const readCached = createCachedCliCredentialReader();
	return (options) => {
		const credPath = path.join(resolveOsHomeRelativePath(options?.homeDir ?? "~"), relativePath);
		return readCached({
			ttlMs: options?.ttlMs ?? 0,
			cacheKey: credPath,
			read: () => read(credPath),
			sourcePath: credPath
		});
	};
}
const readCachedMiniMax = createCachedCliFileReader(MINIMAX_CLI_CREDENTIALS_RELATIVE_PATH, readMiniMaxCliCredentials);
const readCachedGemini = createCachedCliFileReader(GEMINI_CLI_CREDENTIALS_RELATIVE_PATH, readGeminiCliCredentials);
function readMiniMaxCliCredentialsCached(options) {
	return readCachedMiniMax(options);
}
function readGeminiCliCredentialsCached(options) {
	return readCachedGemini(options);
}
//#endregion
export { readMiniMaxCliCredentialsCached as a, readGeminiCliCredentialsCached as i, readCodexCliActiveApiKey as n, resolveCodexCliHomePath as o, readCodexCliCredentialsCached as r, hasCodexCliAuthFile as t };
