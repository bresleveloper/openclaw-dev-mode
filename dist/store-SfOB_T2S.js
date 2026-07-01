import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import { o as isRecord } from "./record-coerce-DHZ4bFlT.js";
import { C as resolveExpiresAtMsFromDurationMs, P as timestampMsToIsoString, o as asDateTimestampMs, s as asFiniteNumber } from "./number-coercion-CJQ8TR--.js";
import { v as resolveOAuthPath } from "./paths-DyelItkH.js";
import { _ as uniqueStrings, d as normalizeTrimmedStringList } from "./string-normalization-CRyoFBPt.js";
import { c as isRecord$1, m as resolveUserPath } from "./utils-BApvfmPs.js";
import "./number-coercion-EqFmHmOw.js";
import { p as normalizeSecretInputString, s as coerceSecretRef } from "./types.secrets-lIZQEgMF.js";
import { t as createSubsystemLogger } from "./subsystem-yNfG7O3v.js";
import { i as normalizeProviderId } from "./provider-id-Dq06Bcx6.js";
import { a as replaceRuntimeAuthProfileStoreSnapshots$1, d as resolveLegacyAuthStorePath, g as cloneAuthProfileStore, i as hasRuntimeAuthProfileStoreSnapshot, l as resolveAuthStorePath, n as getRuntimeAuthProfileStoreSnapshot$1, o as setRuntimeAuthProfileStoreSnapshot, t as clearRuntimeAuthProfileStoreSnapshots$1 } from "./runtime-snapshots-BrKHRFr0.js";
import { x as resolveExternalAuthProfilesWithPlugins } from "./provider-runtime-D4NEMgBr.js";
import { t as loadJsonFile } from "./json-file-CVAOif1i.js";
import { c as writePersistedAuthProfileStoreRaw, n as readPersistedAuthProfileStateRaw, o as runAuthProfileWriteTransaction, r as readPersistedAuthProfileStoreRaw, s as writePersistedAuthProfileStateRaw } from "./sqlite-DsZClgCP.js";
import { t as asBoolean } from "./boolean-CrriykWV.js";
import "./source-check-B4FCIC1K.js";
import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import { createHash } from "node:crypto";
import { isDeepStrictEqual } from "node:util";
//#region src/agents/auth-profiles/constants.ts
/**
* Shared auth-profile constants.
* Defines store versions, built-in CLI profile ids, lock budgets, refresh
* timing, and logging used by auth profile runtime modules.
*/
/** @deprecated Anthropic provider-owned CLI profile id; do not use from third-party plugins. */
const CLAUDE_CLI_PROFILE_ID = "anthropic:claude-cli";
/** @deprecated OpenAI provider-owned CLI profile id; do not use from third-party plugins. */
const CODEX_CLI_PROFILE_ID = "openai:codex-cli";
/** Default OpenAI/Codex OAuth profile id used for migrated stores. */
const OPENAI_CODEX_DEFAULT_PROFILE_ID = "openai:default";
/** @deprecated MiniMax provider-owned CLI profile id; do not use from third-party plugins. */
const MINIMAX_CLI_PROFILE_ID = "minimax-portal:minimax-cli";
/** Cross-agent lock policy for shared OAuth refresh operations. */
const OAUTH_REFRESH_LOCK_OPTIONS = {
	retries: {
		retries: 20,
		factor: 2,
		minTimeout: 100,
		maxTimeout: 1e4,
		randomize: true
	},
	stale: 18e4
};
/** Maximum duration for one OAuth refresh call inside the refresh lock. */
const OAUTH_REFRESH_CALL_TIMEOUT_MS = 12e4;
/** Freshness window for syncing external CLI auth into auth profiles. */
const EXTERNAL_CLI_SYNC_TTL_MS = 900 * 1e3;
/** Auth profile subsystem logger. */
const log$1 = createSubsystemLogger("agents/auth-profiles");
//#endregion
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
function readPortalCliOauthCredentials(credPath, provider) {
	const raw = loadJsonFile(credPath);
	if (!raw || typeof raw !== "object") return null;
	const data = raw;
	const accessToken = data.access_token;
	const refreshToken = data.refresh_token;
	const expiresAt = data.expiry_date;
	if (typeof accessToken !== "string" || !accessToken) return null;
	if (typeof refreshToken !== "string" || !refreshToken) return null;
	if (typeof expiresAt !== "number" || !Number.isFinite(expiresAt)) return null;
	return {
		type: "oauth",
		provider,
		access: accessToken,
		refresh: refreshToken,
		expires: expiresAt
	};
}
function readMiniMaxCliCredentials(options) {
	return readPortalCliOauthCredentials(resolveMiniMaxCliCredentialsPath(options?.homeDir), "minimax-portal");
}
function readGeminiCliCredentials(options) {
	const raw = loadJsonFile(resolveGeminiCliCredentialsPath(options?.homeDir));
	if (!raw || typeof raw !== "object") return null;
	const data = raw;
	const accessToken = data.access_token;
	const refreshToken = data.refresh_token;
	const expiresAt = data.expiry_date;
	if (typeof accessToken !== "string" || !accessToken) return null;
	if (typeof refreshToken !== "string" || !refreshToken) return null;
	if (typeof expiresAt !== "number" || !Number.isFinite(expiresAt)) return null;
	const idTokenRaw = data.id_token;
	const identity = typeof idTokenRaw === "string" && idTokenRaw ? decodeJwtIdentityClaims(idTokenRaw) : {};
	return {
		type: "oauth",
		provider: "google-gemini-cli",
		access: accessToken,
		refresh: refreshToken,
		expires: expiresAt,
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
	const tokens = raw.tokens;
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
//#region src/agents/auth-profiles/oauth-identity.ts
/**
* OAuth identity comparison and mirroring decisions.
* Guards cross-agent credential copy/adoption so refreshed credentials cannot
* overwrite a different account's local auth state.
*/
/** Normalize account-id style identity tokens for exact comparison. */
function normalizeAuthIdentityToken(value) {
	const trimmed = value?.trim();
	return trimmed ? trimmed : void 0;
}
/** Normalize email identity tokens for case-insensitive comparison. */
function normalizeAuthEmailToken(value) {
	return normalizeAuthIdentityToken(value)?.toLowerCase();
}
/**
* One-sided copy gate for both directions:
* - mirror: sub-agent refresh -> main-agent store
* - adopt: main-agent store -> sub-agent store
*/
function isSafeToCopyOAuthIdentity(existing, incoming) {
	const aAcct = normalizeAuthIdentityToken(existing.accountId);
	const bAcct = normalizeAuthIdentityToken(incoming.accountId);
	const aEmail = normalizeAuthEmailToken(existing.email);
	const bEmail = normalizeAuthEmailToken(incoming.email);
	if (aAcct !== void 0 && bAcct !== void 0) return aAcct === bAcct;
	if (aEmail !== void 0 && bEmail !== void 0) return aEmail === bEmail;
	if (aAcct !== void 0 || aEmail !== void 0) return false;
	return true;
}
/** Decide whether a refreshed OAuth credential should mirror into another store. */
function shouldMirrorRefreshedOAuthCredential(params) {
	const { existing, refreshed } = params;
	if (!existing) return {
		shouldMirror: true,
		reason: "no-existing-credential"
	};
	if (existing.type !== "oauth") return {
		shouldMirror: false,
		reason: "non-oauth-existing-credential"
	};
	if (existing.provider !== refreshed.provider) return {
		shouldMirror: false,
		reason: "provider-mismatch"
	};
	if (!isSafeToCopyOAuthIdentity(existing, refreshed)) return {
		shouldMirror: false,
		reason: "identity-mismatch-or-regression"
	};
	const refreshedExpires = asDateTimestampMs(refreshed.expires);
	if (refreshedExpires === void 0) return {
		shouldMirror: false,
		reason: "incoming-not-fresher"
	};
	const existingExpires = asDateTimestampMs(existing.expires);
	if (existingExpires !== void 0 && existingExpires >= refreshedExpires) return {
		shouldMirror: false,
		reason: "incoming-not-fresher"
	};
	return {
		shouldMirror: true,
		reason: "incoming-fresher"
	};
}
//#endregion
//#region src/agents/auth-profiles/credential-state.ts
/**
* Credential state classification for auth profiles.
* Centralizes expiry, missing-secret, and unresolved-reference checks used by
* auth selection, refresh, health, and doctor flows.
*/
/** Default OAuth access-token refresh margin before expiry. */
const DEFAULT_OAUTH_REFRESH_MARGIN_MS = 300 * 1e3;
/** Classifies a token expiry timestamp for auth selection and refresh logic. */
function resolveTokenExpiryState(expires, now = Date.now(), opts) {
	if (expires === void 0) return "missing";
	if (typeof expires !== "number") return "invalid_expires";
	if (!Number.isFinite(expires) || expires <= 0 || expires > 864e13) return "invalid_expires";
	const remainingMs = expires - now;
	if (remainingMs <= 0) return "expired";
	const expiringWithinMs = Math.max(0, opts?.expiringWithinMs ?? 0);
	if (expiringWithinMs > 0 && remainingMs <= expiringWithinMs) return "expiring";
	return "valid";
}
/** Returns true when an OAuth credential has a non-expiring access token. */
function hasUsableOAuthCredential$1(credential, opts) {
	if (!credential || credential.type !== "oauth") return false;
	if (typeof credential.access !== "string" || credential.access.trim().length === 0) return false;
	const now = opts?.now ?? Date.now();
	const refreshMarginMs = Math.max(0, opts?.refreshMarginMs ?? 3e5);
	return resolveTokenExpiryState(credential.expires, now, { expiringWithinMs: refreshMarginMs }) === "valid";
}
function hasConfiguredSecretRef(value) {
	return coerceSecretRef(value) !== null;
}
function hasConfiguredSecretString(value) {
	return normalizeSecretInputString(value) !== void 0;
}
/** Classifies whether a stored credential is eligible for auth selection. */
function evaluateStoredCredentialEligibility(params) {
	const now = params.now ?? Date.now();
	const credential = params.credential;
	if (credential.type === "api_key") {
		const hasKey = hasConfiguredSecretString(credential.key);
		const hasKeyRef = hasConfiguredSecretRef(credential.keyRef);
		if (!hasKey && !hasKeyRef) return {
			eligible: false,
			reasonCode: "missing_credential"
		};
		return {
			eligible: true,
			reasonCode: "ok"
		};
	}
	if (credential.type === "token") {
		const hasToken = hasConfiguredSecretString(credential.token);
		const hasTokenRef = hasConfiguredSecretRef(credential.tokenRef);
		if (!hasToken && !hasTokenRef) return {
			eligible: false,
			reasonCode: "missing_credential"
		};
		const expiryState = resolveTokenExpiryState(credential.expires, now);
		if (expiryState === "invalid_expires") return {
			eligible: false,
			reasonCode: "invalid_expires"
		};
		if (expiryState === "expired") return {
			eligible: false,
			reasonCode: "expired"
		};
		return {
			eligible: true,
			reasonCode: "ok"
		};
	}
	if (normalizeSecretInputString(credential.access) === void 0 && normalizeSecretInputString(credential.refresh) === void 0) {
		if (credential.oauthRef) return {
			eligible: false,
			reasonCode: "unresolved_ref"
		};
		return {
			eligible: false,
			reasonCode: "missing_credential"
		};
	}
	return {
		eligible: true,
		reasonCode: "ok"
	};
}
//#endregion
//#region src/agents/auth-profiles/oauth-shared.ts
/**
* Shared OAuth credential replacement and identity policy.
* Used by manager, external CLI overlays, and persistence paths to decide when
* incoming runtime credentials may replace or bootstrap stored profiles.
*/
/** Returns true when two OAuth credentials contain the same token/identity data. */
function areOAuthCredentialsEquivalent(a, b) {
	if (!a || a.type !== "oauth") return false;
	return a.provider === b.provider && a.access === b.access && a.refresh === b.refresh && a.expires === b.expires && a.email === b.email && a.enterpriseUrl === b.enterpriseUrl && a.projectId === b.projectId && a.accountId === b.accountId && a.idToken === b.idToken;
}
function hasNewerStoredOAuthCredential(existing, incoming) {
	const existingExpires = asDateTimestampMs(existing?.expires);
	const incomingExpires = asDateTimestampMs(incoming.expires);
	return Boolean(existing && existing.provider === incoming.provider && existingExpires !== void 0 && (incomingExpires === void 0 || existingExpires > incomingExpires));
}
/** Returns true when an incoming OAuth credential should replace stored state. */
function shouldReplaceStoredOAuthCredential(existing, incoming) {
	if (!existing || existing.type !== "oauth") return true;
	if (areOAuthCredentialsEquivalent(existing, incoming)) return false;
	return !hasNewerStoredOAuthCredential(existing, incoming);
}
/** Returns true when an OAuth credential has a usable access token. */
function hasUsableOAuthCredential(credential, now = Date.now()) {
	return hasUsableOAuthCredential$1(credential, { now });
}
/** Returns true when an OAuth credential has account or email identity. */
function hasOAuthIdentity(credential) {
	return normalizeAuthIdentityToken(credential.accountId) !== void 0 || normalizeAuthEmailToken(credential.email) !== void 0;
}
/** Returns true when OAuth identity fields match by account id or email. */
function hasMatchingOAuthIdentity(existing, incoming) {
	return hasOAuthIdentity(existing) && isSafeToCopyOAuthIdentity(existing, incoming);
}
function isSafeOAuthIdentityTransition(existing, incoming, policy) {
	if (!existing || existing.type !== "oauth") return policy.whenExistingCredentialMissing;
	if (existing.provider !== incoming.provider) return false;
	if (areOAuthCredentialsEquivalent(existing, incoming)) return true;
	if (!hasOAuthIdentity(existing)) return policy.whenExistingIdentityMissing;
	return hasMatchingOAuthIdentity(existing, incoming);
}
/** Returns true when bootstrap may adopt an external OAuth identity. */
function isSafeToAdoptBootstrapOAuthIdentity(existing, incoming) {
	return isSafeOAuthIdentityTransition(existing, incoming, {
		whenExistingCredentialMissing: true,
		whenExistingIdentityMissing: true
	});
}
/** Returns true when agent-local state may adopt a main-store OAuth identity. */
function isSafeToAdoptMainStoreOAuthIdentity(existing, incoming) {
	return isSafeOAuthIdentityTransition(existing, incoming, {
		whenExistingCredentialMissing: false,
		whenExistingIdentityMissing: true
	});
}
/** Returns true when an external CLI credential should bootstrap stored OAuth. */
function shouldBootstrapFromExternalCliCredential(params) {
	const now = params.now ?? Date.now();
	if (hasUsableOAuthCredential(params.existing, now)) return false;
	return hasUsableOAuthCredential(params.imported, now);
}
/** Overlays runtime external OAuth profiles on a cloned store. */
function overlayRuntimeExternalOAuthProfiles(store, profiles, options) {
	const externalProfiles = Array.from(profiles);
	const next = cloneAuthProfileStore(store);
	const overlaidProfileIds = new Set(externalProfiles.map((profile) => profile.profileId));
	for (const profile of externalProfiles) next.profiles[profile.profileId] = profile.credential;
	next.runtimePersistedProfileIds = store.runtimePersistedProfileIds?.filter((profileId) => next.profiles[profileId] && !overlaidProfileIds.has(profileId)).toSorted();
	if (next.runtimePersistedProfileIds?.length === 0) next.runtimePersistedProfileIds = void 0;
	const runtimeOnlyProfileIds = new Set(externalProfiles.filter((profile) => profile.persistence !== "persisted").map((profile) => profile.profileId));
	for (const profileId of store.runtimeExternalProfileIds ?? []) if (next.profiles[profileId]) runtimeOnlyProfileIds.add(profileId);
	next.runtimeExternalProfileIds = runtimeOnlyProfileIds.size > 0 || options?.runtimeExternalProfileIdsAuthoritative === true ? [...runtimeOnlyProfileIds].toSorted() : void 0;
	next.runtimeExternalProfileIdsAuthoritative = options?.runtimeExternalProfileIdsAuthoritative === true ? true : void 0;
	return next;
}
/** Returns true when a runtime external OAuth profile should be persisted. */
function shouldPersistRuntimeExternalOAuthProfile(params) {
	for (const profile of params.profiles) {
		if (profile.profileId !== params.profileId) continue;
		if (profile.persistence === "persisted") return true;
		return !areOAuthCredentialsEquivalent(profile.credential, params.credential);
	}
	return true;
}
//#endregion
//#region src/agents/auth-profiles/external-cli-sync.ts
/**
* External CLI OAuth synchronization.
* Reads supported CLI credential stores, decides whether those credentials can
* safely bootstrap local auth profiles, and returns runtime/persisted overlays.
*/
/** Return true when imported CLI credentials match an existing profile identity. */
function isSafeToUseExternalCliCredential(existing, imported) {
	if (!existing) return true;
	if (existing.provider !== imported.provider) return false;
	return isSafeToCopyOAuthIdentity(existing, imported);
}
const EXTERNAL_CLI_SYNC_PROVIDERS = [
	{
		profileId: OPENAI_CODEX_DEFAULT_PROFILE_ID,
		profileAliases: ["openai:default"],
		provider: "openai",
		aliases: [
			"openai",
			"codex",
			"codex-cli",
			"codex-app-server"
		],
		readCredentials: (options) => readCodexCliCredentialsCached({
			ttlMs: EXTERNAL_CLI_SYNC_TTL_MS,
			allowKeychainPrompt: options?.allowKeychainPrompt
		}),
		bootstrapOnly: true
	},
	{
		profileId: CLAUDE_CLI_PROFILE_ID,
		provider: "claude-cli",
		readCredentials: (options) => {
			const credential = readClaudeCliCredentialsCached({
				ttlMs: EXTERNAL_CLI_SYNC_TTL_MS,
				allowKeychainPrompt: options?.allowKeychainPrompt
			});
			if (credential?.type !== "oauth") return null;
			return {
				...credential,
				provider: "claude-cli"
			};
		}
	},
	{
		profileId: MINIMAX_CLI_PROFILE_ID,
		provider: "minimax-portal",
		aliases: ["minimax", "minimax-cli"],
		readCredentials: () => readMiniMaxCliCredentialsCached({ ttlMs: EXTERNAL_CLI_SYNC_TTL_MS })
	}
];
function resolveExternalCliSyncProvider(params) {
	const provider = EXTERNAL_CLI_SYNC_PROVIDERS.find((entry) => externalCliProfileIdMatches(entry, params.profileId));
	if (!provider) return null;
	if (params.credential && !listExternalCliProviderIds(provider).includes(params.credential.provider)) return null;
	return provider;
}
function listExternalCliProfileIds(providerConfig) {
	return [providerConfig.profileId, ...providerConfig.profileAliases ?? []];
}
function listExternalCliProviderIds(providerConfig) {
	return [providerConfig.provider, ...providerConfig.aliases ?? []];
}
function normalizeExternalCliCredentialProvider(credential, provider) {
	return credential ? {
		...credential,
		provider
	} : null;
}
function getAuthProfileProviderPrefix(profileId) {
	return profileId.split(":", 1)[0]?.trim() ?? "";
}
function externalCliProfileIdMatches(providerConfig, profileId, options) {
	if (listExternalCliProfileIds(providerConfig).includes(profileId)) return true;
	if (!options?.allowLegacyNamespace || providerConfig.profileId !== "openai:default") return false;
	return normalizeProviderId(getAuthProfileProviderPrefix(profileId)) === "openai";
}
function hasInlineOAuthTokenMaterial$1(credential) {
	return [
		credential.access,
		credential.refresh,
		credential.idToken
	].some((value) => typeof value === "string" && value.trim().length > 0);
}
/** Read a CLI credential only for safe bootstrap of an unusable local profile. */
function readExternalCliBootstrapCredential(params) {
	const provider = resolveExternalCliSyncProvider(params);
	if (!provider) return null;
	if (provider.bootstrapOnly && !params.allowInlineOAuthTokenMaterial && hasInlineOAuthTokenMaterial$1(params.credential)) return null;
	return normalizeExternalCliCredentialProvider(provider.readCredentials({ allowKeychainPrompt: params.allowKeychainPrompt }), params.credential.provider);
}
/** Read a CLI credential as a fallback for refresh/runtime auth recovery. */
function readExternalCliFallbackCredential(params) {
	const provider = resolveExternalCliSyncProvider(params) ?? EXTERNAL_CLI_SYNC_PROVIDERS.find((entry) => listExternalCliProviderIds(entry).includes(params.credential.provider));
	if (!provider) return null;
	return normalizeExternalCliCredentialProvider(provider.readCredentials({ allowKeychainPrompt: params.allowKeychainPrompt }), params.credential.provider);
}
function normalizeProviderScope(values) {
	if (values === void 0) return;
	const out = /* @__PURE__ */ new Set();
	for (const value of values) {
		const raw = value.trim();
		if (!raw) continue;
		out.add(raw.toLowerCase());
		const normalized = normalizeProviderId(raw);
		if (normalized) out.add(normalized);
	}
	return out;
}
function isExternalCliProviderInScope(params) {
	const { providerConfig, options, store } = params;
	const providerScope = normalizeProviderScope(options?.providerIds);
	if (providerScope === void 0 && options?.profileIds === void 0) return Object.entries(store.profiles).some(([profileId, existing]) => {
		return externalCliProfileIdMatches(providerConfig, profileId) && existing?.type === "oauth" && listExternalCliProviderIds(providerConfig).includes(existing.provider);
	});
	if (Array.from(options?.profileIds ?? []).some((profileId) => externalCliProfileIdMatches(providerConfig, profileId.trim(), { allowLegacyNamespace: true }))) return true;
	if (!providerScope || providerScope.size === 0) return false;
	return listExternalCliProviderIds(providerConfig).some((alias) => {
		const raw = alias.trim().toLowerCase();
		const normalized = normalizeProviderId(alias);
		return providerScope.has(raw) || (normalized ? providerScope.has(normalized) : false);
	});
}
function listScopedExternalCliProfileIds(params) {
	const { options, providerConfig, store } = params;
	const requestedProfileIds = Array.from(options?.profileIds ?? []).map((value) => value.trim()).filter((value) => value.length > 0);
	if (requestedProfileIds.length > 0) return requestedProfileIds.filter((profileId) => externalCliProfileIdMatches(providerConfig, profileId, { allowLegacyNamespace: true }));
	const existingProfileIds = Object.keys(store.profiles).filter((profileId) => externalCliProfileIdMatches(providerConfig, profileId));
	if (existingProfileIds.length > 0) return existingProfileIds;
	return options?.providerIds ? [providerConfig.profileId] : [];
}
/** Resolve scoped external CLI auth profiles available to overlay or persist. */
function resolveExternalCliAuthProfiles(store, options) {
	const profiles = [];
	const now = Date.now();
	for (const providerConfig of EXTERNAL_CLI_SYNC_PROVIDERS) {
		if (!isExternalCliProviderInScope({
			providerConfig,
			store,
			options
		})) continue;
		const scopedProfileIds = listScopedExternalCliProfileIds({
			providerConfig,
			store,
			options
		});
		for (const profileId of scopedProfileIds) {
			const existing = store.profiles[profileId];
			const existingOAuth = existing?.type === "oauth" && listExternalCliProviderIds(providerConfig).includes(existing.provider) ? existing : void 0;
			if (existing && !existingOAuth) {
				log$1.debug("kept explicit local auth over external cli bootstrap", {
					profileId,
					provider: providerConfig.provider,
					localType: existing.type,
					localProvider: existing.provider
				});
				continue;
			}
			if (providerConfig.bootstrapOnly && existingOAuth && hasInlineOAuthTokenMaterial$1(existingOAuth)) {
				log$1.debug("kept local oauth over external cli bootstrap-only provider", {
					profileId,
					provider: providerConfig.provider
				});
				continue;
			}
			if (existingOAuth && !providerConfig.bootstrapOnly && hasUsableOAuthCredential(existingOAuth, now)) continue;
			const creds = normalizeExternalCliCredentialProvider(providerConfig.readCredentials({ allowKeychainPrompt: options?.allowKeychainPrompt }), existingOAuth?.provider ?? providerConfig.provider);
			if (!creds) continue;
			if (existingOAuth && !isSafeToUseExternalCliCredential(existingOAuth, creds)) {
				log$1.warn("refused external cli oauth bootstrap: identity mismatch", {
					profileId,
					provider: providerConfig.provider
				});
				continue;
			}
			if (existingOAuth && !isSafeToAdoptBootstrapOAuthIdentity(existingOAuth, creds) && !areOAuthCredentialsEquivalent(existingOAuth, creds)) {
				log$1.warn("refused external cli oauth bootstrap: identity mismatch or missing binding", {
					profileId,
					provider: providerConfig.provider
				});
				continue;
			}
			if (!shouldBootstrapFromExternalCliCredential({
				existing: existingOAuth,
				imported: creds,
				now
			})) {
				if (existingOAuth) log$1.debug("kept usable local oauth over external cli bootstrap", {
					profileId,
					provider: providerConfig.provider,
					localExpires: existingOAuth.expires,
					externalExpires: creds.expires
				});
				continue;
			}
			log$1.debug("used external cli oauth bootstrap because local oauth was missing or unusable", {
				profileId,
				provider: providerConfig.provider,
				localExpires: existingOAuth?.expires,
				externalExpires: creds.expires
			});
			profiles.push({
				profileId,
				credential: creds,
				persistence: providerConfig.bootstrapOnly ? "runtime-only" : "persisted"
			});
		}
	}
	return profiles;
}
function normalizeExternalAuthProfile(profile) {
	if (!profile?.profileId || !profile.credential) return null;
	return {
		...profile,
		persistence: profile.persistence ?? "runtime-only"
	};
}
function resolveExternalAuthProfileMap(params) {
	const env = params.env ?? process.env;
	const profiles = resolveExternalAuthProfilesWithPlugins({
		env,
		config: params.externalCli?.config,
		context: {
			config: params.externalCli?.config,
			agentDir: params.agentDir,
			workspaceDir: void 0,
			env,
			store: params.store
		}
	});
	const resolved = /* @__PURE__ */ new Map();
	const cliProfiles = resolveExternalCliAuthProfiles?.(params.store, {
		allowKeychainPrompt: params.externalCli?.allowKeychainPrompt,
		providerIds: params.externalCli?.externalCliProviderIds,
		profileIds: params.externalCli?.externalCliProfileIds
	}) ?? [];
	for (const profile of cliProfiles) resolved.set(profile.profileId, {
		profileId: profile.profileId,
		credential: profile.credential,
		persistence: profile.persistence ?? "runtime-only"
	});
	for (const rawProfile of profiles) {
		const profile = normalizeExternalAuthProfile(rawProfile);
		if (!profile) continue;
		resolved.set(profile.profileId, profile);
	}
	return resolved;
}
/** List runtime-only and persisted external auth profiles for this store. */
function listRuntimeExternalAuthProfiles(params) {
	return Array.from(resolveExternalAuthProfileMap({
		store: params.store,
		agentDir: params.agentDir,
		env: params.env,
		externalCli: params.externalCli
	}).values());
}
function hasPersistableExternalCliSyncCandidate(store, params) {
	if (params?.externalCliProviderIds || params?.externalCliProfileIds) return true;
	for (const profileId of [CLAUDE_CLI_PROFILE_ID, MINIMAX_CLI_PROFILE_ID]) if (store.profiles[profileId]?.type === "oauth") return true;
	return false;
}
function hasScopedExternalCliOverlay$1(params) {
	return Boolean(params?.externalCliProviderIds || params?.externalCliProfileIds);
}
/** Overlay external auth profiles onto a cloned auth store for runtime use. */
function overlayExternalAuthProfiles(store, params) {
	return overlayRuntimeExternalOAuthProfiles(store, listRuntimeExternalAuthProfiles({
		store,
		agentDir: params?.agentDir,
		env: params?.env,
		externalCli: params
	}), { runtimeExternalProfileIdsAuthoritative: !hasScopedExternalCliOverlay$1(params) });
}
/** Persist safe external CLI OAuth profiles that own their local profile slot. */
function syncPersistedExternalCliAuthProfiles(store, params) {
	if (!hasPersistableExternalCliSyncCandidate(store, params)) return store;
	const persistedProfiles = (resolveExternalCliAuthProfiles?.(store, {
		allowKeychainPrompt: params?.allowKeychainPrompt,
		providerIds: params?.externalCliProviderIds,
		profileIds: params?.externalCliProfileIds
	}) ?? []).filter((profile) => profile.persistence === "persisted");
	if (persistedProfiles.length === 0) return store;
	let next;
	for (const profile of persistedProfiles) {
		const existing = (next ?? store).profiles[profile.profileId];
		if (existing?.type === "oauth" && areOAuthCredentialsEquivalent(existing, profile.credential)) continue;
		next ??= cloneAuthProfileStore(store);
		next.profiles[profile.profileId] = profile.credential;
	}
	return next ?? store;
}
//#endregion
//#region src/agents/auth-profiles/legacy-oauth-ref.ts
/**
* Legacy OAuth reference recognizer.
* Used by migration/health code to detect older Codex/OpenClaw credential
* sidecar references without accepting arbitrary ref-like objects.
*/
/** Legacy OAuth ref source persisted by older credential stores. */
const LEGACY_OAUTH_REF_SOURCE = "openclaw-credentials";
/** Legacy OAuth ref provider persisted by older credential stores. */
const LEGACY_OAUTH_REF_PROVIDER = "openai-codex";
/** Return true for the legacy OAuth reference shape persisted by older stores. */
function isLegacyOAuthRef(value) {
	if (!isRecord(value)) return false;
	return value.source === LEGACY_OAUTH_REF_SOURCE && value.provider === "openai-codex" && typeof value.id === "string" && /^[a-f0-9]{32}$/.test(value.id);
}
//#endregion
//#region src/agents/auth-profiles/state.ts
/**
* Runtime-state normalization and persistence for auth profile selection.
* This state tracks order, last-good profile, and cooldown/failure metadata
* separately from secret-bearing credentials.
*/
const AUTH_FAILURE_REASONS = new Set([
	"auth",
	"auth_permanent",
	"format",
	"overloaded",
	"rate_limit",
	"billing",
	"timeout",
	"model_not_found",
	"session_expired",
	"empty_response",
	"no_error_details",
	"unclassified",
	"unknown"
]);
const AUTH_BLOCKED_REASONS = new Set(["subscription_limit"]);
const AUTH_BLOCKED_SOURCES = new Set(["codex_rate_limits", "wham"]);
function normalizeFiniteNumber(value) {
	return asFiniteNumber(value);
}
function normalizeEnumValue(value, allowed) {
	if (typeof value !== "string") return;
	return allowed.has(value) ? value : void 0;
}
function normalizeFailureCounts(raw) {
	if (!isRecord(raw)) return;
	const normalized = {};
	for (const [reason, count] of Object.entries(raw)) {
		if (!AUTH_FAILURE_REASONS.has(reason)) continue;
		if (typeof count !== "number" || !Number.isFinite(count) || count <= 0) continue;
		normalized[reason] = Math.trunc(count);
	}
	return Object.keys(normalized).length > 0 ? normalized : void 0;
}
function normalizeAuthProfileOrder(raw) {
	if (!isRecord(raw)) return;
	const normalized = Object.entries(raw).reduce((acc, [provider, value]) => {
		if (!Array.isArray(value)) return acc;
		const providerKey = normalizeProviderId(provider);
		if (!providerKey) return acc;
		const list = normalizeTrimmedStringList(value);
		if (list.length > 0) acc[providerKey] = list;
		return acc;
	}, {});
	return Object.keys(normalized).length > 0 ? normalized : void 0;
}
function normalizeLastGood(raw) {
	if (!isRecord(raw)) return;
	const normalized = {};
	for (const [provider, profileId] of Object.entries(raw)) {
		const providerKey = normalizeProviderId(provider);
		const normalizedProfileId = normalizeOptionalString(profileId);
		if (!providerKey || !normalizedProfileId) continue;
		normalized[providerKey] = normalizedProfileId;
	}
	return Object.keys(normalized).length > 0 ? normalized : void 0;
}
function normalizeUsageStatsEntry(raw) {
	if (!isRecord(raw)) return;
	const stats = {
		lastUsed: normalizeFiniteNumber(raw.lastUsed),
		blockedUntil: normalizeFiniteNumber(raw.blockedUntil),
		blockedReason: normalizeEnumValue(raw.blockedReason, AUTH_BLOCKED_REASONS),
		blockedSource: normalizeEnumValue(raw.blockedSource, AUTH_BLOCKED_SOURCES),
		blockedModel: normalizeOptionalString(raw.blockedModel),
		cooldownUntil: normalizeFiniteNumber(raw.cooldownUntil),
		cooldownReason: normalizeEnumValue(raw.cooldownReason, AUTH_FAILURE_REASONS),
		cooldownModel: normalizeOptionalString(raw.cooldownModel),
		disabledUntil: normalizeFiniteNumber(raw.disabledUntil),
		disabledReason: normalizeEnumValue(raw.disabledReason, AUTH_FAILURE_REASONS),
		errorCount: normalizeFiniteNumber(raw.errorCount),
		failureCounts: normalizeFailureCounts(raw.failureCounts),
		lastFailureAt: normalizeFiniteNumber(raw.lastFailureAt)
	};
	for (const key of Object.keys(stats)) if (stats[key] === void 0) delete stats[key];
	return Object.keys(stats).length > 0 ? stats : void 0;
}
function normalizeUsageStats(raw) {
	if (!isRecord(raw)) return;
	const normalized = {};
	for (const [profileId, value] of Object.entries(raw)) {
		const normalizedProfileId = normalizeOptionalString(profileId);
		const stats = normalizeUsageStatsEntry(value);
		if (!normalizedProfileId || !stats) continue;
		normalized[normalizedProfileId] = stats;
	}
	return Object.keys(normalized).length > 0 ? normalized : void 0;
}
/** Coerces persisted auth profile runtime state into the current shape. */
function coerceAuthProfileState(raw) {
	if (!isRecord(raw)) return {};
	return {
		order: normalizeAuthProfileOrder(raw.order),
		lastGood: normalizeLastGood(raw.lastGood),
		usageStats: normalizeUsageStats(raw.usageStats)
	};
}
/** Merges auth profile runtime state, with override records winning per key. */
function mergeAuthProfileState(base, override) {
	const mergeRecord = (left, right) => {
		if (!left && !right) return;
		if (!left) return { ...right };
		if (!right) return { ...left };
		return {
			...left,
			...right
		};
	};
	return {
		order: mergeRecord(base.order, override.order),
		lastGood: mergeRecord(base.lastGood, override.lastGood),
		usageStats: mergeRecord(base.usageStats, override.usageStats)
	};
}
/** Loads persisted auth profile runtime state from SQLite. */
function loadPersistedAuthProfileState(agentDir, database) {
	return coerceAuthProfileState(readPersistedAuthProfileStateRaw(agentDir, database));
}
/** Builds the persisted auth profile runtime state payload. */
function buildPersistedAuthProfileState(store) {
	const state = coerceAuthProfileState(store);
	if (!state.order && !state.lastGood && !state.usageStats) return null;
	return {
		version: 1,
		...state.order ? { order: state.order } : {},
		...state.lastGood ? { lastGood: state.lastGood } : {},
		...state.usageStats ? { usageStats: state.usageStats } : {}
	};
}
/** Saves auth profile runtime state when it differs from the persisted payload. */
function savePersistedAuthProfileState(store, agentDir) {
	const payload = buildPersistedAuthProfileState(store);
	const existingRaw = readPersistedAuthProfileStateRaw(agentDir);
	if (!payload || !isDeepStrictEqual(existingRaw, payload)) writePersistedAuthProfileStateRaw(payload, agentDir);
	return payload;
}
//#endregion
//#region src/agents/auth-profiles/persisted.ts
/**
* Persisted auth profile store loading and migration.
* Normalizes legacy JSON stores, SQLite/raw payloads, runtime state metadata,
* legacy OAuth files, and merged main/agent stores.
*/
const AUTH_PROFILE_TYPES = new Set([
	"api_key",
	"oauth",
	"token"
]);
function normalizeOptionalCredentialString(value) {
	if (typeof value !== "string") return;
	return value.trim() ? value : void 0;
}
function normalizeExpiryField(value) {
	if (value === void 0) return;
	return typeof value === "number" && Number.isFinite(value) && value > 0 ? value : 0;
}
function normalizeCredentialMetadata(value) {
	if (!isRecord(value)) return;
	const metadata = {};
	for (const [key, entry] of Object.entries(value)) if (typeof entry === "string") metadata[key] = entry;
	return Object.keys(metadata).length > 0 ? metadata : void 0;
}
function normalizeSecretBackedField(params) {
	const value = params.entry[params.valueField];
	if (value == null || typeof value === "string") return;
	const ref = coerceSecretRef(value);
	if (ref && !coerceSecretRef(params.entry[params.refField])) params.entry[params.refField] = ref;
	delete params.entry[params.valueField];
}
function normalizeCommonCredentialFields(entry) {
	const normalized = { provider: typeof entry.provider === "string" ? normalizeProviderId(entry.provider) : "" };
	const copyToAgents = asBoolean(entry.copyToAgents);
	if (copyToAgents !== void 0) normalized.copyToAgents = copyToAgents;
	const email = normalizeOptionalCredentialString(entry.email);
	if (email !== void 0) normalized.email = email;
	const displayName = normalizeOptionalCredentialString(entry.displayName);
	if (displayName !== void 0) normalized.displayName = displayName;
	return normalized;
}
function normalizeRawCredentialEntry(raw) {
	const entry = { ...raw };
	if (!("type" in entry) && typeof entry["mode"] === "string") entry["type"] = entry["mode"];
	if (entry.type === "apiKey") entry.type = "api_key";
	if (!("key" in entry) && !coerceSecretRef(entry["keyRef"]) && typeof entry["apiKey"] === "string") entry["key"] = entry["apiKey"];
	normalizeSecretBackedField({
		entry,
		valueField: "key",
		refField: "keyRef"
	});
	normalizeSecretBackedField({
		entry,
		valueField: "token",
		refField: "tokenRef"
	});
	if (entry.type === "api_key") {
		const normalized = {
			type: "api_key",
			...normalizeCommonCredentialFields(entry)
		};
		const key = normalizeOptionalCredentialString(entry.key);
		const keyRef = coerceSecretRef(entry.keyRef);
		const metadata = normalizeCredentialMetadata(entry.metadata);
		if (keyRef) normalized.keyRef = keyRef;
		else if (key !== void 0) normalized.key = key;
		if (metadata) normalized.metadata = metadata;
		return normalized;
	}
	if (entry.type === "token") {
		const normalized = {
			type: "token",
			...normalizeCommonCredentialFields(entry)
		};
		const token = normalizeOptionalCredentialString(entry.token);
		const tokenRef = coerceSecretRef(entry.tokenRef);
		const expires = normalizeExpiryField(entry.expires);
		if (token !== void 0) normalized.token = token;
		if (tokenRef) normalized.tokenRef = tokenRef;
		if (expires !== void 0) normalized.expires = expires;
		return normalized;
	}
	if (entry.type === "oauth") {
		const normalized = {
			type: "oauth",
			...normalizeCommonCredentialFields(entry)
		};
		if (isLegacyOAuthRef(entry.oauthRef)) normalized.oauthRef = entry.oauthRef;
		for (const field of [
			"access",
			"refresh",
			"idToken",
			"clientId",
			"enterpriseUrl",
			"projectId",
			"accountId",
			"chatgptPlanType"
		]) {
			const value = normalizeOptionalCredentialString(entry[field]);
			if (value !== void 0) normalized[field] = value;
		}
		const expires = normalizeExpiryField(entry.expires);
		if (expires !== void 0) normalized.expires = expires;
		return normalized;
	}
	return entry;
}
function parseCredentialEntry(raw, fallbackProvider) {
	if (!isRecord(raw)) return {
		ok: false,
		reason: "non_object"
	};
	const typed = normalizeRawCredentialEntry(raw);
	if (!AUTH_PROFILE_TYPES.has(typed.type)) return {
		ok: false,
		reason: "invalid_type"
	};
	const provider = typed.provider ?? fallbackProvider;
	const normalizedProvider = typeof provider === "string" ? normalizeProviderId(provider) : "";
	if (!normalizedProvider) return {
		ok: false,
		reason: "missing_provider"
	};
	return {
		ok: true,
		credential: {
			...typed,
			provider: normalizedProvider
		}
	};
}
function warnRejectedCredentialEntries(source, rejected) {
	if (rejected.length === 0) return;
	const reasons = rejected.reduce((acc, current) => {
		acc[current.reason] = (acc[current.reason] ?? 0) + 1;
		return acc;
	}, {});
	log$1.warn("ignored invalid auth profile entries during store load", {
		source,
		dropped: rejected.length,
		reasons,
		...reasons.invalid_type ? { validTypes: [...AUTH_PROFILE_TYPES] } : {},
		keys: rejected.slice(0, 10).map((entry) => entry.key)
	});
}
function coerceLegacyAuthStore(raw) {
	if (!isRecord(raw)) return null;
	const record = raw;
	if ("profiles" in record) return null;
	const entries = {};
	const rejected = [];
	for (const [key, value] of Object.entries(record)) {
		const parsed = parseCredentialEntry(value, key);
		if (!parsed.ok) {
			rejected.push({
				key,
				reason: parsed.reason
			});
			continue;
		}
		entries[key] = parsed.credential;
	}
	warnRejectedCredentialEntries("auth.json", rejected);
	return Object.keys(entries).length > 0 ? entries : null;
}
/** Coerces a persisted auth profile store payload into the current store shape. */
function coercePersistedAuthProfileStore(raw) {
	if (!isRecord(raw)) return null;
	const record = raw;
	if (!isRecord(record.profiles)) return null;
	const profiles = record.profiles;
	const normalized = {};
	const rejected = [];
	for (const [key, value] of Object.entries(profiles)) {
		const parsed = parseCredentialEntry(value);
		if (!parsed.ok) {
			rejected.push({
				key,
				reason: parsed.reason
			});
			continue;
		}
		normalized[key] = parsed.credential;
	}
	warnRejectedCredentialEntries("auth-profiles.json", rejected);
	const version = Number(record.version ?? 1);
	return {
		version: Number.isFinite(version) && version > 0 ? version : 1,
		profiles: normalized,
		...coerceAuthProfileState(record)
	};
}
function mergeRecord(base, override) {
	if (!base && !override) return;
	if (!base) return { ...override };
	if (!override) return { ...base };
	return {
		...base,
		...override
	};
}
function dedupeMergedProfileOrder(profileIds) {
	return uniqueStrings(profileIds);
}
function groupProfileIdsByProvider(profiles) {
	const grouped = /* @__PURE__ */ new Map();
	for (const [profileId, credential] of Object.entries(profiles)) {
		const providerKey = normalizeProviderId(credential.provider);
		grouped.set(providerKey, [...grouped.get(providerKey) ?? [], profileId]);
	}
	return grouped;
}
function findOrderEntryKey(order, providerKey) {
	return Object.keys(order ?? {}).find((key) => normalizeProviderId(key) === providerKey);
}
function mergeProfileRecordsWithOverridePrecedence(base, override) {
	const overrideProfileIds = new Set(Object.keys(override));
	return Object.fromEntries([...Object.entries(override), ...Object.entries(base).filter(([profileId]) => !overrideProfileIds.has(profileId))]);
}
function mergeProfileOrderWithOverridePrecedence(params) {
	const mergedOrder = mergeRecord(params.baseOrder, params.overrideOrder);
	if (!mergedOrder) return;
	for (const [providerKey, overrideProfileIds] of groupProfileIdsByProvider(params.overrideProfiles)) {
		const baseOrderKey = findOrderEntryKey(params.baseOrder, providerKey);
		const overrideOrderKey = findOrderEntryKey(params.overrideOrder, providerKey);
		const mergedOrderKey = overrideOrderKey ?? baseOrderKey;
		if (!mergedOrderKey) continue;
		for (const provider of Object.keys(mergedOrder)) if (provider !== mergedOrderKey && normalizeProviderId(provider) === providerKey) delete mergedOrder[provider];
		if (overrideOrderKey) {
			mergedOrder[mergedOrderKey] = dedupeMergedProfileOrder(params.overrideOrder?.[overrideOrderKey] ?? []);
			continue;
		}
		const baseOrderIds = baseOrderKey ? params.baseOrder?.[baseOrderKey] ?? [] : [];
		mergedOrder[mergedOrderKey] = dedupeMergedProfileOrder([
			...overrideProfileIds,
			...baseOrderIds,
			...mergedOrder[mergedOrderKey] ?? []
		]);
	}
	return mergedOrder;
}
function hasComparableOAuthIdentityConflict(existing, candidate) {
	const existingAccountId = normalizeAuthIdentityToken(existing.accountId);
	const candidateAccountId = normalizeAuthIdentityToken(candidate.accountId);
	if (existingAccountId !== void 0 && candidateAccountId !== void 0 && existingAccountId !== candidateAccountId) return true;
	const existingEmail = normalizeAuthEmailToken(existing.email);
	const candidateEmail = normalizeAuthEmailToken(candidate.email);
	return existingEmail !== void 0 && candidateEmail !== void 0 && existingEmail !== candidateEmail;
}
function isLegacyDefaultOAuthProfile(profileId, credential) {
	return profileId === `${normalizeProviderId(credential.provider)}:default`;
}
function isNewerUsableOAuthCredential(existing, candidate) {
	if (!hasUsableOAuthCredential(candidate)) return false;
	if (!hasUsableOAuthCredential(existing)) return true;
	return Number.isFinite(candidate.expires) && (!Number.isFinite(existing.expires) || candidate.expires > existing.expires);
}
function findMainStoreOAuthReplacement(params) {
	const providerKey = normalizeProviderId(params.legacyCredential.provider);
	const candidates = Object.entries(params.base.profiles).flatMap(([profileId, credential]) => {
		if (profileId === params.legacyProfileId || credential.type !== "oauth" || normalizeProviderId(credential.provider) !== providerKey) return [];
		return [[profileId, credential]];
	}).filter(([, credential]) => isNewerUsableOAuthCredential(params.legacyCredential, credential)).toSorted(([leftId, leftCredential], [rightId, rightCredential]) => {
		const leftExpires = Number.isFinite(leftCredential.expires) ? leftCredential.expires : 0;
		const rightExpires = Number.isFinite(rightCredential.expires) ? rightCredential.expires : 0;
		if (rightExpires !== leftExpires) return rightExpires - leftExpires;
		return leftId.localeCompare(rightId);
	});
	const exactIdentityCandidates = candidates.filter(([, credential]) => isSafeToAdoptMainStoreOAuthIdentity(params.legacyCredential, credential));
	if (exactIdentityCandidates.length > 0) {
		if (!hasOAuthIdentity(params.legacyCredential) && exactIdentityCandidates.length > 1) return;
		return exactIdentityCandidates[0]?.[0];
	}
	if (hasUsableOAuthCredential(params.legacyCredential)) return;
	const fallbackCandidates = candidates.filter(([, credential]) => !hasComparableOAuthIdentityConflict(params.legacyCredential, credential));
	if (fallbackCandidates.length !== 1) return;
	return fallbackCandidates[0]?.[0];
}
function replaceMergedProfileReferences(params) {
	const { store, base, replacements } = params;
	if (replacements.size === 0) return store;
	const profiles = { ...store.profiles };
	for (const [legacyProfileId, replacementProfileId] of replacements) {
		const baseCredential = base.profiles[legacyProfileId];
		if (baseCredential) profiles[legacyProfileId] = baseCredential;
		else delete profiles[legacyProfileId];
		const replacementBaseCredential = base.profiles[replacementProfileId];
		const replacementCredential = profiles[replacementProfileId];
		if (replacementBaseCredential && (!replacementCredential || replacementCredential.type === "oauth" && replacementBaseCredential.type === "oauth" && isNewerUsableOAuthCredential(replacementCredential, replacementBaseCredential))) profiles[replacementProfileId] = replacementBaseCredential;
	}
	const order = store.order ? Object.fromEntries(Object.entries(store.order).map(([provider, profileIds]) => [provider, dedupeMergedProfileOrder(profileIds.map((profileId) => replacements.get(profileId) ?? profileId))])) : void 0;
	const lastGood = store.lastGood ? Object.fromEntries(Object.entries(store.lastGood).map(([provider, profileId]) => [provider, replacements.get(profileId) ?? profileId])) : void 0;
	const usageStats = store.usageStats ? { ...store.usageStats } : void 0;
	if (usageStats) for (const legacyProfileId of replacements.keys()) {
		const baseStats = base.usageStats?.[legacyProfileId];
		if (baseStats) usageStats[legacyProfileId] = baseStats;
		else delete usageStats[legacyProfileId];
	}
	return {
		...store,
		profiles,
		...order && Object.keys(order).length > 0 ? { order } : { order: void 0 },
		...lastGood && Object.keys(lastGood).length > 0 ? { lastGood } : { lastGood: void 0 },
		...usageStats && Object.keys(usageStats).length > 0 ? { usageStats } : { usageStats: void 0 }
	};
}
function reconcileMainStoreOAuthProfileDrift(params) {
	const replacements = /* @__PURE__ */ new Map();
	for (const [profileId, credential] of Object.entries(params.override.profiles)) {
		if (credential.type !== "oauth") continue;
		const replacementProfileId = isLegacyDefaultOAuthProfile(profileId, credential) ? findMainStoreOAuthReplacement({
			base: params.base,
			legacyProfileId: profileId,
			legacyCredential: credential
		}) : void 0;
		if (replacementProfileId) replacements.set(profileId, replacementProfileId);
	}
	return replaceMergedProfileReferences({
		store: params.merged,
		base: params.base,
		replacements
	});
}
/** Merges two auth profile stores, preserving valid runtime external profile metadata. */
function mergeAuthProfileStores(base, override, options) {
	if (Object.keys(override.profiles).length === 0 && !override.order && !override.lastGood && !override.usageStats && override.runtimePersistedProfileIds === void 0 && override.runtimeExternalProfileIds === void 0 && override.runtimeExternalProfileIdsAuthoritative !== true) return base;
	const overrideProfileIds = new Set(Object.keys(override.profiles));
	const overrideRuntimeExternalProfileIds = new Set(override.runtimeExternalProfileIds ?? []);
	const removedRuntimeExternalProfileIds = new Set(override.runtimeExternalProfileIdsAuthoritative === true && options?.preserveBaseRuntimeExternalProfiles !== true ? (base.runtimeExternalProfileIds ?? []).filter((profileId) => !overrideRuntimeExternalProfileIds.has(profileId) && !overrideProfileIds.has(profileId)) : []);
	const profiles = mergeProfileRecordsWithOverridePrecedence(base.profiles, override.profiles);
	for (const profileId of removedRuntimeExternalProfileIds) delete profiles[profileId];
	const mergedOrder = mergeProfileOrderWithOverridePrecedence({
		baseOrder: base.order,
		overrideOrder: override.order,
		overrideProfiles: override.profiles
	});
	const order = mergedOrder ? Object.fromEntries(Object.entries(mergedOrder).map(([provider, profileIds]) => [provider, profileIds.filter((profileId) => profiles[profileId] || !removedRuntimeExternalProfileIds.has(profileId))]).filter(([, profileIds]) => profileIds.length > 0)) : void 0;
	const mergedLastGood = mergeRecord(base.lastGood, override.lastGood);
	const lastGood = mergedLastGood ? Object.fromEntries(Object.entries(mergedLastGood).filter(([, profileId]) => profiles[profileId])) : void 0;
	const mergedUsageStats = mergeRecord(base.usageStats, override.usageStats);
	const usageStats = mergedUsageStats ? Object.fromEntries(Object.entries(mergedUsageStats).filter(([profileId]) => profiles[profileId])) : void 0;
	const merged = {
		version: Math.max(base.version, override.version ?? base.version),
		profiles,
		order,
		lastGood,
		usageStats
	};
	const runtimePersistedProfileIds = [...(base.runtimePersistedProfileIds ?? []).filter((profileId) => !overrideProfileIds.has(profileId)), ...override.runtimePersistedProfileIds ?? []].filter((profileId) => merged.profiles[profileId]).toSorted();
	const runtimeExternalProfileIds = [...override.runtimeExternalProfileIdsAuthoritative === true && options?.preserveBaseRuntimeExternalProfiles !== true ? [] : (base.runtimeExternalProfileIds ?? []).filter((profileId) => !overrideProfileIds.has(profileId)), ...override.runtimeExternalProfileIds ?? []].filter((profileId) => merged.profiles[profileId]).toSorted();
	const runtimeExternalProfileIdsAuthoritative = base.runtimeExternalProfileIdsAuthoritative === true || override.runtimeExternalProfileIdsAuthoritative === true;
	const runtimeExternalProfileMetadata = runtimeExternalProfileIds.length > 0 || runtimeExternalProfileIdsAuthoritative ? {
		runtimeExternalProfileIds: [...new Set(runtimeExternalProfileIds)],
		...runtimeExternalProfileIdsAuthoritative ? { runtimeExternalProfileIdsAuthoritative: true } : {}
	} : {};
	return reconcileMainStoreOAuthProfileDrift({
		base,
		override,
		merged: {
			...merged,
			...runtimePersistedProfileIds.length > 0 ? { runtimePersistedProfileIds: [...new Set(runtimePersistedProfileIds)] } : {},
			...runtimeExternalProfileMetadata
		}
	});
}
/** Builds the persisted secrets store, stripping resolved literals when refs exist. */
function buildPersistedAuthProfileSecretsStore(store, shouldPersistProfile) {
	return {
		version: 1,
		profiles: Object.fromEntries(Object.entries(store.profiles).flatMap(([profileId, credential]) => {
			if (shouldPersistProfile && !shouldPersistProfile({
				profileId,
				credential
			})) return [];
			if (credential.type === "api_key" && credential.keyRef && credential.key !== void 0) {
				const sanitized = { ...credential };
				delete sanitized.key;
				return [[profileId, sanitized]];
			}
			if (credential.type === "token" && credential.tokenRef && credential.token !== void 0) {
				const sanitized = { ...credential };
				delete sanitized.token;
				return [[profileId, sanitized]];
			}
			return [[profileId, credential]];
		}))
	};
}
/** Applies legacy auth.json credentials into an auth profile store. */
function applyLegacyAuthStore(store, legacy) {
	for (const [provider, cred] of Object.entries(legacy)) {
		const profileId = `${provider}:default`;
		const credentialProvider = cred.provider ?? provider;
		if (cred.type === "api_key") {
			store.profiles[profileId] = {
				type: "api_key",
				provider: credentialProvider,
				key: cred.key,
				...cred.email ? { email: cred.email } : {}
			};
			continue;
		}
		if (cred.type === "token") {
			store.profiles[profileId] = {
				type: "token",
				provider: credentialProvider,
				token: cred.token,
				...typeof cred.expires === "number" ? { expires: cred.expires } : {},
				...cred.email ? { email: cred.email } : {}
			};
			continue;
		}
		store.profiles[profileId] = {
			type: "oauth",
			provider: credentialProvider,
			access: cred.access,
			refresh: cred.refresh,
			expires: cred.expires,
			...cred.enterpriseUrl ? { enterpriseUrl: cred.enterpriseUrl } : {},
			...cred.projectId ? { projectId: cred.projectId } : {},
			...cred.accountId ? { accountId: cred.accountId } : {},
			...cred.email ? { email: cred.email } : {}
		};
	}
}
/** Imports the legacy oauth.json file into missing default OAuth profiles. */
function mergeOAuthFileIntoStore(store) {
	const oauthRaw = loadJsonFile(resolveOAuthPath());
	if (!oauthRaw || typeof oauthRaw !== "object") return false;
	const oauthEntries = oauthRaw;
	let mutated = false;
	for (const [provider, creds] of Object.entries(oauthEntries)) {
		if (!creds || typeof creds !== "object") continue;
		const profileId = `${provider}:default`;
		if (store.profiles[profileId]) continue;
		store.profiles[profileId] = {
			type: "oauth",
			provider,
			...creds
		};
		mutated = true;
	}
	return mutated;
}
/** Loads the persisted auth profile store and merges runtime state. */
function loadPersistedAuthProfileStore(agentDir, options) {
	const raw = readPersistedAuthProfileStoreRaw(agentDir, options?.database);
	const store = coercePersistedAuthProfileStore(raw);
	if (!store) return null;
	return {
		...store,
		...mergeAuthProfileState(coerceAuthProfileState(raw), loadPersistedAuthProfileState(agentDir, options?.database))
	};
}
/** Loads the legacy auth.json auth profile store if present. */
function loadLegacyAuthProfileStore(agentDir) {
	return coerceLegacyAuthStore(loadJsonFile(resolveLegacyAuthStorePath(agentDir)));
}
//#endregion
//#region src/agents/auth-profiles/store.ts
/**
* Auth profile store orchestration.
* Merges persisted stores, runtime snapshots, inherited main-agent OAuth
* profiles, and external CLI overlays while keeping save paths local.
*/
const INLINE_OAUTH_TOKEN_FIELDS = [
	"access",
	"refresh",
	"idToken"
];
function hasInlineOAuthTokenMaterial(credential) {
	return INLINE_OAUTH_TOKEN_FIELDS.some((field) => credential[field] !== void 0);
}
function hasChangedInlineOAuthTokenMaterial(params) {
	return INLINE_OAUTH_TOKEN_FIELDS.some((field) => {
		if (params.credential[field] === void 0) return false;
		return !isDeepStrictEqual(params.credential[field], params.existingCredential[field]);
	});
}
function preserveLegacyOAuthRefsOnSave(params) {
	if (!isRecord$1(params.existingRaw) || !isRecord$1(params.existingRaw.profiles)) return params.payload;
	let nextProfiles;
	for (const [profileId, credential] of Object.entries(params.payload.profiles)) {
		if (!isRecord$1(credential) || credential.oauthRef !== void 0 || credential.type !== "oauth") continue;
		const existingCredential = params.existingRaw.profiles[profileId];
		if (!isRecord$1(existingCredential) || existingCredential.oauthRef === void 0 || existingCredential.type !== "oauth") continue;
		if (hasInlineOAuthTokenMaterial(credential) && hasChangedInlineOAuthTokenMaterial({
			credential,
			existingCredential
		})) continue;
		nextProfiles ??= { ...params.payload.profiles };
		nextProfiles[profileId] = {
			...credential,
			oauthRef: existingCredential.oauthRef
		};
	}
	return nextProfiles ? {
		...params.payload,
		profiles: nextProfiles
	} : params.payload;
}
function resolvePersistedLoadOptions(options) {
	return {
		...options?.allowKeychainPrompt !== void 0 ? { allowKeychainPrompt: options.allowKeychainPrompt } : {},
		...options?.database ? { database: options.database } : {}
	};
}
function isInheritedMainOAuthCredential(params) {
	if (!params.agentDir || params.credential.type !== "oauth") return false;
	if (resolveAuthStorePath(params.agentDir) === resolveAuthStorePath()) return false;
	if (loadPersistedAuthProfileStore(params.agentDir)?.profiles[params.profileId]) return false;
	const mainCredential = loadPersistedAuthProfileStore()?.profiles[params.profileId];
	return mainCredential?.type === "oauth" && (isDeepStrictEqual(mainCredential, params.credential) || shouldUseMainOwnerForLocalOAuthCredential({
		local: params.credential,
		main: mainCredential
	}));
}
function shouldUseMainOwnerForLocalOAuthCredential(params) {
	if (params.local.type !== "oauth" || params.main?.type !== "oauth") return false;
	if (!isSafeToAdoptMainStoreOAuthIdentity(params.local, params.main)) return false;
	if (isDeepStrictEqual(params.local, params.main)) return true;
	const mainExpires = asDateTimestampMs(params.main.expires);
	if (mainExpires === void 0) return false;
	const localExpires = asDateTimestampMs(params.local.expires);
	return localExpires === void 0 || mainExpires >= localExpires;
}
function resolveRuntimeAuthProfileStore(agentDir, options) {
	const mainKey = resolveAuthStorePath(void 0);
	const requestedKey = resolveAuthStorePath(agentDir);
	const mainStore = getRuntimeAuthProfileStoreSnapshot$1(void 0);
	const requestedStore = getRuntimeAuthProfileStoreSnapshot$1(agentDir);
	if (!agentDir || requestedKey === mainKey) {
		if (!mainStore) return null;
		return mainStore;
	}
	if (mainStore && requestedStore) return mergeAuthProfileStores(mainStore, requestedStore, { preserveBaseRuntimeExternalProfiles: true });
	if (requestedStore) return mergeAuthProfileStores(loadAuthProfileStoreForAgent(void 0, {
		readOnly: true,
		syncExternalCli: false,
		...resolvePersistedLoadOptions(options)
	}), requestedStore, { preserveBaseRuntimeExternalProfiles: true });
	if (mainStore) return mainStore;
	return null;
}
function resolveExternalCliOverlayOptions(options) {
	const discovery = options?.externalCli;
	if (!discovery) return {
		...options?.allowKeychainPrompt !== void 0 ? { allowKeychainPrompt: options.allowKeychainPrompt } : {},
		...options?.config ? { config: options.config } : {},
		...options?.externalCliProviderIds ? { externalCliProviderIds: options.externalCliProviderIds } : {},
		...options?.externalCliProfileIds ? { externalCliProfileIds: options.externalCliProfileIds } : {}
	};
	if (discovery.mode === "none") {
		const config = discovery.config ?? options?.config;
		return {
			allowKeychainPrompt: false,
			...config ? { config } : {},
			externalCliProviderIds: [],
			externalCliProfileIds: []
		};
	}
	if (discovery.mode === "existing") {
		const allowKeychainPrompt = discovery.allowKeychainPrompt ?? options?.allowKeychainPrompt;
		const config = discovery.config ?? options?.config;
		return {
			...allowKeychainPrompt !== void 0 ? { allowKeychainPrompt } : {},
			...config ? { config } : {}
		};
	}
	const allowKeychainPrompt = discovery.allowKeychainPrompt ?? options?.allowKeychainPrompt;
	const config = discovery.config ?? options?.config;
	return {
		...allowKeychainPrompt !== void 0 ? { allowKeychainPrompt } : {},
		...config ? { config } : {},
		...discovery.providerIds ? { externalCliProviderIds: discovery.providerIds } : {},
		...discovery.profileIds ? { externalCliProfileIds: discovery.profileIds } : {}
	};
}
function hasScopedExternalCliOverlay(options) {
	return options.externalCliProviderIds !== void 0 || options.externalCliProfileIds !== void 0;
}
function maybeSyncPersistedExternalCliAuthProfiles(params) {
	if (params.options?.readOnly === true || params.options?.syncExternalCli === false || process.env.OPENCLAW_AUTH_STORE_READONLY === "1") return {
		store: params.store,
		cacheable: true
	};
	const synced = syncPersistedExternalCliAuthProfiles(params.store, {
		agentDir: params.agentDir,
		...resolveExternalCliOverlayOptions(params.options)
	});
	if (synced === params.store) return {
		store: params.store,
		cacheable: true
	};
	const changedProfiles = Object.entries(synced.profiles).filter(([profileId, credential]) => {
		const previous = params.store.profiles[profileId];
		return !isDeepStrictEqual(previous, credential);
	});
	if (changedProfiles.length === 0) return {
		store: synced,
		cacheable: true
	};
	try {
		return runAuthProfileWriteTransaction(params.agentDir, (database) => {
			const latestStore = loadPersistedAuthProfileStore(params.agentDir, {
				...resolvePersistedLoadOptions(params.options),
				database
			}) ?? {
				version: 1,
				profiles: {}
			};
			let changed = false;
			for (const [profileId, credential] of changedProfiles) {
				const previous = params.store.profiles[profileId];
				const latest = latestStore.profiles[profileId];
				if (!isDeepStrictEqual(latest, previous)) {
					log$1.debug("skipped persisted external cli auth sync for concurrently changed profile", { profileId });
					continue;
				}
				latestStore.profiles[profileId] = credential;
				changed = true;
			}
			if (changed) saveAuthProfileStore(latestStore, params.agentDir, { filterExternalAuthProfiles: false }, database);
			return {
				store: latestStore,
				cacheable: true
			};
		});
	} catch (err) {
		log$1.warn("skipped persisted external cli auth sync because auth store write failed", { err });
		return {
			store: params.store,
			cacheable: false
		};
	}
}
function shouldKeepProfileInLocalStore(params) {
	if (params.credential.type !== "oauth") return true;
	if (isInheritedMainOAuthCredential({
		agentDir: params.agentDir,
		profileId: params.profileId,
		credential: params.credential
	})) return false;
	if (params.options?.filterExternalAuthProfiles === false) return true;
	if (params.store.runtimeExternalProfileIds?.includes(params.profileId)) {
		if (loadPersistedAuthProfileStore(params.agentDir)?.profiles[params.profileId]) return shouldPersistRuntimeExternalOAuthProfile({
			profileId: params.profileId,
			credential: params.credential,
			profiles: params.externalProfiles()
		});
		const runtimeCredential = getRuntimeAuthProfileStoreSnapshot(params.agentDir)?.profiles[params.profileId];
		if (!runtimeCredential || isDeepStrictEqual(runtimeCredential, params.credential)) return false;
	}
	return shouldPersistRuntimeExternalOAuthProfile({
		profileId: params.profileId,
		credential: params.credential,
		profiles: params.externalProfiles()
	});
}
function pruneAuthProfileStoreReferences(store, keptProfileIds, keptOrderProfileIds = keptProfileIds) {
	store.order = store.order ? Object.fromEntries(Object.entries(store.order).map(([provider, profileIds]) => [provider, profileIds.filter((profileId) => keptOrderProfileIds.has(profileId))]).filter(([, profileIds]) => profileIds.length > 0)) : void 0;
	store.lastGood = store.lastGood ? Object.fromEntries(Object.entries(store.lastGood).filter(([, profileId]) => keptProfileIds.has(profileId))) : void 0;
	store.usageStats = store.usageStats ? Object.fromEntries(Object.entries(store.usageStats).filter(([profileId]) => keptProfileIds.has(profileId))) : void 0;
	store.runtimePersistedProfileIds = store.runtimePersistedProfileIds?.filter((profileId) => keptProfileIds.has(profileId)).toSorted();
	if (store.runtimePersistedProfileIds?.length === 0) store.runtimePersistedProfileIds = void 0;
	store.runtimeExternalProfileIds = store.runtimeExternalProfileIds?.filter((profileId) => keptProfileIds.has(profileId)).toSorted();
	if (store.runtimeExternalProfileIds?.length === 0 && store.runtimeExternalProfileIdsAuthoritative !== true) store.runtimeExternalProfileIds = void 0;
	if (store.runtimeExternalProfileIdsAuthoritative === true) store.runtimeExternalProfileIds ??= [];
}
function buildLocalAuthProfileStoreForSave(params) {
	const localStore = cloneAuthProfileStore(params.store);
	let externalProfiles;
	const getExternalProfiles = () => externalProfiles ??= listRuntimeExternalAuthProfiles({
		store: params.store,
		agentDir: params.agentDir
	});
	localStore.profiles = Object.fromEntries(Object.entries(localStore.profiles).filter(([profileId, credential]) => shouldKeepProfileInLocalStore({
		store: params.store,
		profileId,
		credential,
		agentDir: params.agentDir,
		options: params.options,
		externalProfiles: getExternalProfiles
	})));
	const keptProfileIds = new Set(Object.keys(localStore.profiles));
	const keptOrderProfileIds = new Set(keptProfileIds);
	for (const profileId of params.options?.preserveStateProfileIds ?? []) {
		const normalizedProfileId = profileId.trim();
		if (normalizedProfileId) {
			keptProfileIds.add(normalizedProfileId);
			keptOrderProfileIds.add(normalizedProfileId);
		}
	}
	for (const profileIds of Object.values(loadPersistedAuthProfileState(params.agentDir).order ?? {})) for (const profileId of profileIds) keptOrderProfileIds.add(profileId);
	for (const profileId of params.options?.preserveOrderProfileIds ?? []) {
		const normalizedProfileId = profileId.trim();
		if (normalizedProfileId) keptOrderProfileIds.add(normalizedProfileId);
	}
	const prunedOrderProfileIds = /* @__PURE__ */ new Set();
	for (const profileId of params.options?.pruneOrderProfileIds ?? []) {
		const normalizedProfileId = profileId.trim();
		if (normalizedProfileId) prunedOrderProfileIds.add(normalizedProfileId);
	}
	for (const profileId of prunedOrderProfileIds) keptOrderProfileIds.delete(profileId);
	pruneAuthProfileStoreReferences(localStore, keptProfileIds, keptOrderProfileIds);
	if (params.options?.filterExternalAuthProfiles !== false) {
		localStore.runtimeExternalProfileIds = void 0;
		localStore.runtimeExternalProfileIdsAuthoritative = void 0;
	}
	return localStore;
}
function buildAuthProfileStoreWithoutExternalProfiles(params) {
	const runtimeExternalProfileIds = new Set(params.store.runtimeExternalProfileIds ?? []);
	const localStore = cloneAuthProfileStore(params.store);
	if (runtimeExternalProfileIds.size === 0) return stripRuntimeExternalProfileMetadata(localStore);
	for (const profileId of runtimeExternalProfileIds) delete localStore.profiles[profileId];
	pruneAuthProfileStoreReferences(localStore, new Set(Object.keys(localStore.profiles)));
	return stripRuntimeExternalProfileMetadata(mergeAuthProfileStores(loadAuthProfileStoreWithoutExternalProfiles(params.agentDir, params.options), localStore));
}
function stripRuntimeExternalProfileMetadata(store) {
	const stripped = { ...store };
	delete stripped.runtimeExternalProfileIds;
	delete stripped.runtimeExternalProfileIdsAuthoritative;
	return stripped;
}
function markRuntimePersistedProfiles(store, persistedStore = store) {
	const profileIds = Object.entries(persistedStore.profiles).flatMap(([profileId, credential]) => isDeepStrictEqual(store.profiles[profileId], credential) ? [profileId] : []).toSorted();
	return {
		...store,
		runtimePersistedProfileIds: profileIds.length > 0 ? profileIds : void 0
	};
}
function buildRuntimeAuthProfileStoreForSave(params) {
	return buildLocalAuthProfileStoreForSave({
		...params,
		options: {
			...params.options,
			filterExternalAuthProfiles: false
		}
	});
}
function setRuntimeExternalProfileMetadata(params) {
	const profileIds = [...params.profileIds].toSorted();
	params.store.runtimeExternalProfileIds = profileIds.length > 0 || params.authoritative ? profileIds : void 0;
	params.store.runtimeExternalProfileIdsAuthoritative = params.authoritative ? true : void 0;
}
function mergeRuntimeExternalProfileReferences(params) {
	const runtimeExternalProfileIds = new Set(params.existing.runtimeExternalProfileIds ?? []);
	if (params.next.runtimeExternalProfileIdsAuthoritative === true) return params.next;
	if (runtimeExternalProfileIds.size === 0) return params.next;
	const merged = cloneAuthProfileStore(params.next);
	const mergedRuntimeExternalProfileIds = new Set(merged.runtimeExternalProfileIds ?? []);
	const backfilledRuntimeExternalProfileIds = /* @__PURE__ */ new Set();
	for (const profileId of runtimeExternalProfileIds) {
		const existingCredential = params.existing.profiles[profileId];
		const nextCredential = merged.profiles[profileId];
		if (nextCredential) {
			if (mergedRuntimeExternalProfileIds.has(profileId) || existingCredential && isDeepStrictEqual(nextCredential, existingCredential)) mergedRuntimeExternalProfileIds.add(profileId);
			continue;
		}
		if (!existingCredential) continue;
		merged.profiles[profileId] = existingCredential;
		mergedRuntimeExternalProfileIds.add(profileId);
		backfilledRuntimeExternalProfileIds.add(profileId);
		if (params.existing.usageStats?.[profileId]) merged.usageStats = {
			...merged.usageStats,
			[profileId]: params.existing.usageStats[profileId]
		};
	}
	for (const [provider, profileIds] of Object.entries(params.existing.order ?? {})) {
		const externalProfileIds = profileIds.filter((profileId) => backfilledRuntimeExternalProfileIds.has(profileId));
		if (externalProfileIds.length === 0) continue;
		if (merged.order?.[provider]) continue;
		const existingOrder = merged.order?.[provider] ?? [];
		merged.order = {
			...merged.order,
			[provider]: [...externalProfileIds, ...existingOrder.filter((profileId) => !externalProfileIds.includes(profileId))]
		};
	}
	for (const [provider, profileId] of Object.entries(params.existing.lastGood ?? {})) {
		if (!backfilledRuntimeExternalProfileIds.has(profileId) || merged.lastGood?.[provider]) continue;
		merged.lastGood = {
			...merged.lastGood,
			[provider]: profileId
		};
	}
	setRuntimeExternalProfileMetadata({
		store: merged,
		profileIds: mergedRuntimeExternalProfileIds,
		authoritative: params.existing.runtimeExternalProfileIdsAuthoritative === true
	});
	return merged;
}
function mergeRuntimeExternalProfileState(params) {
	const existingRuntimeProfileIds = new Set(params.existing.runtimeExternalProfileIds ?? []);
	if (existingRuntimeProfileIds.size === 0) return params.next;
	const merged = cloneAuthProfileStore(params.next);
	const mergedRuntimeProfileIds = new Set(merged.runtimeExternalProfileIds ?? []);
	const activeRuntimeProfileIds = /* @__PURE__ */ new Set();
	const nextRuntimeProfileIdsAuthoritative = params.next.runtimeExternalProfileIdsAuthoritative === true;
	for (const profileId of existingRuntimeProfileIds) {
		if (nextRuntimeProfileIdsAuthoritative && !mergedRuntimeProfileIds.has(profileId)) continue;
		const existingCredential = params.existing.profiles[profileId];
		if (!existingCredential) continue;
		const nextCredential = merged.profiles[profileId];
		if (nextCredential) {
			if (mergedRuntimeProfileIds.has(profileId) || isDeepStrictEqual(nextCredential, existingCredential)) {
				mergedRuntimeProfileIds.add(profileId);
				activeRuntimeProfileIds.add(profileId);
			}
			continue;
		}
		merged.profiles[profileId] = existingCredential;
		mergedRuntimeProfileIds.add(profileId);
		activeRuntimeProfileIds.add(profileId);
	}
	if (activeRuntimeProfileIds.size === 0) return params.next;
	for (const profileId of activeRuntimeProfileIds) if (params.existing.usageStats?.[profileId]) merged.usageStats = {
		...merged.usageStats,
		[profileId]: params.existing.usageStats[profileId]
	};
	for (const [provider, profileIds] of Object.entries(params.existing.order ?? {})) {
		const externalProfileIds = profileIds.filter((profileId) => activeRuntimeProfileIds.has(profileId));
		if (externalProfileIds.length === 0 || merged.order?.[provider]) continue;
		merged.order = {
			...merged.order,
			[provider]: externalProfileIds
		};
	}
	for (const [provider, profileId] of Object.entries(params.existing.lastGood ?? {})) {
		if (!activeRuntimeProfileIds.has(profileId) || merged.lastGood?.[provider]) continue;
		merged.lastGood = {
			...merged.lastGood,
			[provider]: profileId
		};
	}
	setRuntimeExternalProfileMetadata({
		store: merged,
		profileIds: mergedRuntimeProfileIds,
		authoritative: params.existing.runtimeExternalProfileIdsAuthoritative === true
	});
	return merged;
}
/** Apply an auth store update inside the SQLite write lock. */
async function updateAuthProfileStoreWithLock(params) {
	try {
		return runAuthProfileWriteTransaction(params.agentDir, (database) => {
			const store = loadAuthProfileStoreForAgent(params.agentDir, {
				database,
				readOnly: true,
				syncExternalCli: false
			});
			if (params.updater(store)) saveAuthProfileStore(store, params.agentDir, params.saveOptions, database);
			return store;
		});
	} catch {
		return null;
	}
}
/** Load the main auth profile store with runtime external profiles overlaid. */
function loadAuthProfileStore() {
	const asStore = loadPersistedAuthProfileStore();
	if (asStore) return overlayExternalAuthProfiles(markRuntimePersistedProfiles(asStore));
	return overlayExternalAuthProfiles(markRuntimePersistedProfiles({
		version: 1,
		profiles: {}
	}));
}
function loadAuthProfileStoreForAgent(agentDir, options) {
	const readOnly = options?.readOnly === true;
	const asStore = loadPersistedAuthProfileStore(agentDir, resolvePersistedLoadOptions(options));
	if (asStore) return markRuntimePersistedProfiles(maybeSyncPersistedExternalCliAuthProfiles({
		store: asStore,
		agentDir,
		options
	}).store);
	const store = {
		version: 1,
		profiles: {}
	};
	const mergedOAuth = mergeOAuthFileIntoStore(store);
	const forceReadOnly = process.env.OPENCLAW_AUTH_STORE_READONLY === "1";
	if (!readOnly && !forceReadOnly && mergedOAuth) saveAuthProfileStore(store, agentDir);
	return markRuntimePersistedProfiles(maybeSyncPersistedExternalCliAuthProfiles({
		store,
		agentDir,
		options
	}).store);
}
/** Loads the effective runtime store for an agent, including inherited main profiles. */
function loadAuthProfileStoreForRuntime(agentDir, options) {
	const store = loadAuthProfileStoreForAgent(agentDir, options);
	const authPath = resolveAuthStorePath(agentDir);
	const mainAuthPath = resolveAuthStorePath();
	const externalCli = resolveExternalCliOverlayOptions(options);
	if (!agentDir || authPath === mainAuthPath) return overlayExternalAuthProfiles(store, {
		agentDir,
		...externalCli
	});
	return overlayExternalAuthProfiles(mergeAuthProfileStores(loadAuthProfileStoreForAgent(void 0, options), store, { preserveBaseRuntimeExternalProfiles: true }), {
		agentDir,
		...externalCli
	});
}
/** Load auth profiles for secret resolution without keychain prompts or writes. */
function loadAuthProfileStoreForSecretsRuntime(agentDir, options) {
	return loadAuthProfileStoreForRuntime(agentDir, {
		...options,
		readOnly: true,
		allowKeychainPrompt: false
	});
}
/** Load auth profiles with runtime external profiles removed from the result. */
function loadAuthProfileStoreWithoutExternalProfiles(agentDir, loadOptions) {
	const options = {
		readOnly: true,
		allowKeychainPrompt: loadOptions?.allowKeychainPrompt ?? false
	};
	const store = loadAuthProfileStoreForAgent(agentDir, options);
	const authPath = resolveAuthStorePath(agentDir);
	const mainAuthPath = resolveAuthStorePath();
	if (!agentDir || authPath === mainAuthPath) return stripRuntimeExternalProfileMetadata(store);
	return stripRuntimeExternalProfileMetadata(mergeAuthProfileStores(loadAuthProfileStoreForAgent(void 0, options), store, { preserveBaseRuntimeExternalProfiles: true }));
}
/** Ensure an auth store is available, including runtime/external profile overlays. */
function ensureAuthProfileStore(agentDir, options) {
	const externalCli = resolveExternalCliOverlayOptions(options);
	const runtimeStore = resolveRuntimeAuthProfileStore(agentDir, options);
	const store = overlayExternalAuthProfiles(ensureAuthProfileStoreWithoutExternalProfiles(agentDir, options), {
		agentDir,
		...externalCli
	});
	if (!runtimeStore || hasScopedExternalCliOverlay(externalCli)) return store;
	return mergeRuntimeExternalProfileState({
		next: store,
		existing: runtimeStore
	});
}
/** Ensure an auth store is available without external profile overlays. */
function ensureAuthProfileStoreWithoutExternalProfiles(agentDir, options) {
	const effectiveOptions = { ...options };
	const runtimeStore = resolveRuntimeAuthProfileStore(agentDir, effectiveOptions);
	if (runtimeStore) return buildAuthProfileStoreWithoutExternalProfiles({
		store: runtimeStore,
		agentDir,
		options: effectiveOptions
	});
	const store = loadAuthProfileStoreForAgent(agentDir, effectiveOptions);
	const authPath = resolveAuthStorePath(agentDir);
	const mainAuthPath = resolveAuthStorePath();
	if (!agentDir || authPath === mainAuthPath) return stripRuntimeExternalProfileMetadata(store);
	return stripRuntimeExternalProfileMetadata(mergeAuthProfileStores(loadAuthProfileStoreForAgent(void 0, effectiveOptions), store, { preserveBaseRuntimeExternalProfiles: true }));
}
/** Find a persisted credential in the scoped store, falling back to the main store. */
function findPersistedAuthProfileCredential(params) {
	const requestedProfile = loadPersistedAuthProfileStore(params.agentDir)?.profiles[params.profileId];
	if (requestedProfile || !params.agentDir) return requestedProfile;
	if (resolveAuthStorePath(params.agentDir) === resolveAuthStorePath()) return requestedProfile;
	return loadPersistedAuthProfileStore()?.profiles[params.profileId];
}
/** Resolve which agent dir owns a persisted profile, accounting for inherited OAuth. */
function resolvePersistedAuthProfileOwnerAgentDir(params) {
	if (!params.agentDir) return;
	const requestedStore = loadPersistedAuthProfileStore(params.agentDir);
	if (resolveAuthStorePath(params.agentDir) === resolveAuthStorePath()) return;
	const mainStore = loadPersistedAuthProfileStore();
	const requestedProfile = requestedStore?.profiles[params.profileId];
	if (requestedProfile) return shouldUseMainOwnerForLocalOAuthCredential({
		local: requestedProfile,
		main: mainStore?.profiles[params.profileId]
	}) ? void 0 : params.agentDir;
	return mainStore?.profiles[params.profileId] ? void 0 : params.agentDir;
}
/** Load the store shape used when applying local-only auth updates. */
function ensureAuthProfileStoreForLocalUpdate(agentDir) {
	const store = loadAuthProfileStoreForAgent(agentDir, { syncExternalCli: false });
	const authPath = resolveAuthStorePath(agentDir);
	const mainAuthPath = resolveAuthStorePath();
	if (!agentDir || authPath === mainAuthPath) return store;
	return mergeAuthProfileStores(loadAuthProfileStoreForAgent(void 0, {
		readOnly: true,
		syncExternalCli: false
	}), store, { preserveBaseRuntimeExternalProfiles: true });
}
/** Return the current runtime auth-profile snapshot for an agent dir. */
function getRuntimeAuthProfileStoreSnapshot(agentDir) {
	return getRuntimeAuthProfileStoreSnapshot$1(agentDir);
}
/** Replace runtime auth-profile snapshots, used by tests and prepared runtimes. */
function replaceRuntimeAuthProfileStoreSnapshots(entries) {
	replaceRuntimeAuthProfileStoreSnapshots$1(entries);
}
/** Clear all runtime auth-profile snapshots. */
function clearRuntimeAuthProfileStoreSnapshots() {
	clearRuntimeAuthProfileStoreSnapshots$1();
}
/** Save the auth profile store plus sidecar state, preserving runtime overlay metadata. */
function saveAuthProfileStore(store, agentDir, options, database) {
	const localStore = buildLocalAuthProfileStoreForSave({
		store,
		agentDir,
		options
	});
	const existingRaw = readPersistedAuthProfileStoreRaw(agentDir, database);
	const payload = preserveLegacyOAuthRefsOnSave({
		payload: buildPersistedAuthProfileSecretsStore(localStore),
		existingRaw
	});
	if (!isDeepStrictEqual(existingRaw, payload)) writePersistedAuthProfileStoreRaw(payload, agentDir, database);
	if (database) writePersistedAuthProfileStateRaw(buildPersistedAuthProfileState(localStore), agentDir, database);
	else savePersistedAuthProfileState(localStore, agentDir);
	if (hasRuntimeAuthProfileStoreSnapshot(agentDir)) {
		const existingRuntimeStore = getRuntimeAuthProfileStoreSnapshot(agentDir);
		const nextRuntimeStore = markRuntimePersistedProfiles(buildRuntimeAuthProfileStoreForSave({
			store,
			agentDir,
			options
		}), localStore);
		setRuntimeAuthProfileStoreSnapshot(existingRuntimeStore ? mergeRuntimeExternalProfileReferences({
			next: nextRuntimeStore,
			existing: existingRuntimeStore
		}) : nextRuntimeStore, agentDir);
	}
}
//#endregion
export { overlayRuntimeExternalOAuthProfiles as A, readGeminiCliCredentialsCached as B, readExternalCliFallbackCredential as C, hasUsableOAuthCredential as D, hasMatchingOAuthIdentity as E, hasUsableOAuthCredential$1 as F, log$1 as G, CODEX_CLI_PROFILE_ID as H, resolveTokenExpiryState as I, shouldMirrorRefreshedOAuthCredential as L, shouldReplaceStoredOAuthCredential as M, DEFAULT_OAUTH_REFRESH_MARGIN_MS as N, isSafeToAdoptBootstrapOAuthIdentity as O, evaluateStoredCredentialEligibility as P, readClaudeCliCredentialsCached as R, readExternalCliBootstrapCredential as S, areOAuthCredentialsEquivalent as T, OAUTH_REFRESH_CALL_TIMEOUT_MS as U, CLAUDE_CLI_PROFILE_ID as V, OAUTH_REFRESH_LOCK_OPTIONS as W, loadLegacyAuthProfileStore as _, findPersistedAuthProfileCredential as a, LEGACY_OAUTH_REF_PROVIDER as b, loadAuthProfileStoreForRuntime as c, replaceRuntimeAuthProfileStoreSnapshots as d, resolvePersistedAuthProfileOwnerAgentDir as f, coercePersistedAuthProfileStore as g, applyLegacyAuthStore as h, ensureAuthProfileStoreWithoutExternalProfiles as i, shouldBootstrapFromExternalCliCredential as j, isSafeToAdoptMainStoreOAuthIdentity as k, loadAuthProfileStoreForSecretsRuntime as l, updateAuthProfileStoreWithLock as m, ensureAuthProfileStore as n, getRuntimeAuthProfileStoreSnapshot as o, saveAuthProfileStore as p, ensureAuthProfileStoreForLocalUpdate as r, loadAuthProfileStore as s, clearRuntimeAuthProfileStoreSnapshots as t, loadAuthProfileStoreWithoutExternalProfiles as u, loadPersistedAuthProfileStore as v, resolveExternalCliAuthProfiles as w, isLegacyOAuthRef as x, coerceAuthProfileState as y, readCodexCliCredentialsCached as z };
