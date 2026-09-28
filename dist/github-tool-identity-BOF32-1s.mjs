import { F as resolveTimerTimeoutMs } from "./number-coercion-CLj0HTDM.mjs";
import { a as asOptionalRecord, c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { m as readNonBlankString } from "./string-coerce-CIXf7egm.mjs";
import { i as getOrCreatePromise } from "./lazy-promise-DGqyc4Y4.mjs";
import { r as resolveEnvironmentValue, t as mergeProcessEnv } from "./process-env-DlZFJzq6.mjs";
import { c as readSecretFile } from "./fs-safe-advanced-CJC-NYf3.mjs";
import { Et as _enum, Jn as string, qn as strictObject, sr as unknown, xn as literal } from "./schemas-BOYIvvln.mjs";
import { t as hasErrnoCode } from "./errno-CkbDOfLk.mjs";
import { n as normalizeAgentId } from "./agent-id-GA8mwdTG.mjs";
import { l as resolveAgentWorkspaceDir, r as resolveAgentConfig } from "./agent-scope-config-IQKOEtZ4.mjs";
import { E as resolveStateDir } from "./paths-DehQwyE0.mjs";
import "./session-key-CBvmC8zz.mjs";
import { t as pruneMapToMaxSize } from "./map-size-CNcWiFKu.mjs";
import { c as isSecretRef, l as isValidEnvSecretRefId } from "./ref-contract-BVi3ykLT.mjs";
import "./types.secrets-B5xWSzLp.mjs";
import { s as registerSecretValueForRedaction } from "./secret-redaction-registry-CKxLTepq.mjs";
import { o as resolveExecutablePath } from "./executable-path-BMRdcL7i.mjs";
import "./agent-scope-CTuYDtny.mjs";
import { n as isManagedGitHubProfileId } from "./github-identity-profile-id-BJzGq1wi.mjs";
import { t as runCommandBuffered } from "./exec-shcN2-sN.mjs";
import { a as deleteHiddenGitHubSecretRecord, l as writeHiddenGitHubSecretRecord, o as listHiddenGitHubSecretRecordNames, s as readHiddenGitHubSecretRecord } from "./secret-store-hidden-github-B2SEsxSq.mjs";
import "./secret-store-BjhT4Kcc.mjs";
import { i as readResponseWithLimit } from "./http-response-body-DXfezLdR.mjs";
import "./http-body-Bl_jph25.mjs";
import { i as githubOAuthScopes, n as githubOAuthProfileId, o as githubOAuthTimestamp, r as githubOAuthRefreshFields, s as validGitHubDeviceTiming, t as githubOAuthDeviceFields } from "./github-oauth-values-mlPBB9E9.mjs";
import path from "node:path";
import fs from "node:fs/promises";
import { createHash, randomBytes } from "node:crypto";
import { parseDocument, stringify } from "yaml";
//#region src/agents/github-read-identity.ts
const GITHUB_IDENTITY_COMMAND_TIMEOUT_MS = 15e3;
const GITHUB_IDENTITY_OUTPUT_LIMIT_BYTES = 32768;
const NATIVE_GITHUB_TOKEN_TTL_MS = 6e4;
let nativeTokens = /* @__PURE__ */ new Map();
const pendingNativeTokens = /* @__PURE__ */ new Map();
function clearNativeGitHubTokenCache() {
	nativeTokens = /* @__PURE__ */ new Map();
	pendingNativeTokens.clear();
}
async function readCachedNativeGitHubToken(env, requireAbsentProof = false) {
	const effectiveEnv = mergeProcessEnv([process.env, env]);
	const token = resolveEnvironmentValue(effectiveEnv, "GH_TOKEN") || resolveEnvironmentValue(effectiveEnv, "GITHUB_TOKEN");
	if (token) return normalizeGitHubToken(token);
	const key = createHash("sha256").update(JSON.stringify([
		process.cwd(),
		Object.entries(effectiveEnv).toSorted(([left], [right]) => left.localeCompare(right)),
		requireAbsentProof
	])).digest("hex");
	const cache = nativeTokens;
	const cached = cache.get(key);
	if (cached && cached.expiresAt > Date.now()) return cached.token;
	cache.delete(key);
	return getOrCreatePromise(pendingNativeTokens, key, async () => {
		const current = await readNativeGitHubToken(env, requireAbsentProof);
		if (current !== void 0) {
			cache.set(key, {
				token: current,
				expiresAt: Date.now() + NATIVE_GITHUB_TOKEN_TTL_MS
			});
			pruneMapToMaxSize(cache, 32);
		}
		return current;
	}, { evictOnSettled: true });
}
async function runGitHubIdentityCommand(argv, env, cwd, timeoutMs = GITHUB_IDENTITY_COMMAND_TIMEOUT_MS) {
	return await runCommandBuffered(argv, {
		env: env ? { ...env } : {},
		cwd,
		timeoutMs,
		maxOutputBytes: GITHUB_IDENTITY_OUTPUT_LIMIT_BYTES
	});
}
function normalizeGitHubToken(token) {
	const normalized = token.trim();
	if (!normalized || normalized.length > 2048 || /\s/u.test(normalized)) throw new Error("Managed GitHub credential must be one non-empty line.");
	registerSecretValueForRedaction(normalized);
	return normalized;
}
async function assertNoNativeGitHubConfiguration(env, cwd) {
	const value = (name) => resolveEnvironmentValue(env, name);
	const windows = process.platform === "win32";
	const nativePath = windows ? path.win32 : path.posix;
	const home = value(windows ? "USERPROFILE" : "HOME");
	const xdg = value("XDG_CONFIG_HOME");
	const appData = value("APPDATA");
	const configured = value("GH_CONFIG_DIR") || (xdg ? nativePath.join(xdg, "gh") : void 0) || (windows && appData ? nativePath.join(appData, "GitHub CLI") : void 0) || (home ? nativePath.join(home, ".config", "gh") : void 0);
	if (!configured) throw new GitHubIdentityError("unverified");
	const directory = nativePath.resolve(cwd, configured);
	for (const file of [
		directory,
		nativePath.join(directory, "config.yml"),
		nativePath.join(directory, "hosts.yml")
	]) try {
		const stat = await fs.lstat(file);
		if (file !== directory || !stat.isDirectory() || stat.isSymbolicLink()) throw new GitHubIdentityError("unavailable");
	} catch (error) {
		if (error instanceof GitHubIdentityError) throw error;
		if (!hasErrnoCode(error, "ENOENT")) throw new GitHubIdentityError("unverified");
	}
}
async function readNativeGitHubToken(env, requireAbsentProof = false) {
	const effectiveEnv = mergeProcessEnv([process.env, env]);
	const token = resolveEnvironmentValue(effectiveEnv, "GH_TOKEN") || resolveEnvironmentValue(effectiveEnv, "GITHUB_TOKEN");
	if (token) return normalizeGitHubToken(token);
	const startedAt = performance.now();
	const result = await runGitHubIdentityCommand([
		"gh",
		"auth",
		"token",
		"--hostname",
		"github.com"
	], env);
	try {
		if (result.code === 0) return normalizeGitHubToken(result.stdout.toString("utf8"));
	} finally {
		result.stdout.fill(0);
		result.stderr.fill(0);
	}
	if (!requireAbsentProof) return;
	if (result.termination === "error") try {
		const cwd = process.cwd();
		if (!hasErrnoCode(result.error, "ENOENT") || !(await fs.stat(cwd)).isDirectory() || resolveExecutablePath("gh", {
			env: effectiveEnv,
			cwd,
			useCache: false
		})) throw new GitHubIdentityError("unverified");
		await assertNoNativeGitHubConfiguration(effectiveEnv, cwd);
		return;
	} catch (error) {
		throw error instanceof GitHubIdentityError ? error : new GitHubIdentityError("unverified");
	}
	if (result.termination !== "exit") throw new GitHubIdentityError("unverified");
	const remainingMs = GITHUB_IDENTITY_COMMAND_TIMEOUT_MS - Math.ceil(performance.now() - startedAt);
	if (remainingMs <= 0) throw new GitHubIdentityError("unverified");
	const observed = await runGitHubIdentityCommand([
		"gh",
		"auth",
		"status",
		"--active",
		"--hostname",
		"github.com",
		"--json",
		"hosts"
	], env, void 0, remainingMs);
	try {
		if (observed.code !== 0) throw new GitHubIdentityError("unverified");
		let value;
		try {
			value = JSON.parse(observed.stdout.toString("utf8"));
		} catch {
			throw new GitHubIdentityError("unverified");
		}
		if (!isRecord(value) || !isRecord(value.hosts) || Object.keys(value).length !== 1) throw new GitHubIdentityError("unverified");
		if (Object.keys(value.hosts).length !== 0) throw new GitHubIdentityError("unavailable");
		return;
	} finally {
		observed.stdout.fill(0);
		observed.stderr.fill(0);
	}
}
/** The caller's owner admits the operation; selection is checked inside that admission. */
function startGitHubIdentityOperation(operation, authority) {
	authority.assertCurrent?.();
	return authority.startCurrent ? authority.startCurrent(() => {
		authority.assertCurrent?.();
		return operation();
	}) : operation();
}
var GitHubIdentityError = class extends Error {
	constructor(reason) {
		super(reason === "changed" ? "GitHub identity changed; reload the dashboard and retry." : reason === "rate_limited" ? "GitHub identity verification is rate limited; wait and retry." : reason === "unverified" ? "The effective GitHub identity could not be verified; retry or reconnect the agent's GitHub identity." : "The selected GitHub credential is unavailable; reconnect the agent's GitHub identity in Settings.");
		this.reason = reason;
	}
};
function createGitHubReadIdentity(params) {
	const { token, selection, assertSelected, startActive, readToken } = params;
	const caller = {
		assertCurrent: assertSelected,
		startCurrent: startActive
	};
	const start = async (operation) => {
		const current = await startGitHubIdentityOperation(readToken, caller);
		return await startGitHubIdentityOperation(() => {
			if (current !== token) throw new GitHubIdentityError("changed");
			return operation();
		}, caller);
	};
	const authority = {
		cacheScope: selection.source === "anonymous" ? "anonymous" : createHash("sha256").update(JSON.stringify([
			selection.source,
			selection.profileId,
			selection.accountId,
			token
		])).digest("hex"),
		assertSelected,
		revalidate: () => start(() => void 0),
		start
	};
	return params.token === void 0 ? {
		...authority,
		token: void 0,
		selection: Object.freeze(params.selection)
	} : {
		...authority,
		token: params.token,
		selection: Object.freeze(params.selection)
	};
}
//#endregion
//#region src/agents/github-oauth-client.ts
const GITHUB_OAUTH_CLIENT_ID = "Ov23liUjOXHi28w2fDlH";
const GITHUB_OAUTH_DEVICE_CODE_URL = "https://github.com/login/device/code";
const GITHUB_OAUTH_ACCESS_TOKEN_URL = "https://github.com/login/oauth/access_token";
const GITHUB_OAUTH_VERIFICATION_URL = "https://github.com/login/device";
const GITHUB_OAUTH_SCOPE = "repo workflow read:org gist offline_access";
const GITHUB_OAUTH_REQUEST_TIMEOUT_MS = 3e4;
const GITHUB_OAUTH_RESPONSE_MAX_BYTES = 16384;
const GITHUB_OAUTH_STRING_MAX_CHARS = 2048;
const GITHUB_OAUTH_SCOPE_MAX_CHARS = 4096;
const GITHUB_OAUTH_SCOPE_MAX_COUNT = 32;
const GITHUB_OAUTH_SCOPE_MAX_LENGTH = 64;
const GITHUB_OAUTH_ERROR_TEXT_MAX_CHARS = 2048;
const GITHUB_OAUTH_MAX_DURATION_SECONDS = 31622400;
const GITHUB_OAUTH_MAX_INTERVAL_SECONDS = 3600;
const GITHUB_CREDENTIAL_VERIFICATION_TTL_MS = 6e4;
const GITHUB_CREDENTIAL_VERIFICATION_MAX_ENTRIES = 32;
let verifiedCredentials = /* @__PURE__ */ new Map();
const pending = /* @__PURE__ */ new Map();
function clearGitHubCredentialVerificationCache() {
	clearNativeGitHubTokenCache();
	verifiedCredentials = /* @__PURE__ */ new Map();
	pending.clear();
}
function githubOAuthProtocolError(surface) {
	return /* @__PURE__ */ new Error(`GitHub OAuth ${surface} response was invalid`);
}
function readBoundedString(value, surface, maxChars = GITHUB_OAUTH_STRING_MAX_CHARS) {
	if (typeof value !== "string" || value.length === 0 || value.length > maxChars || value.trim() !== value) throw githubOAuthProtocolError(surface);
	return value;
}
function readOptionalBoundedString(value, surface, maxChars) {
	if (value === void 0) return;
	return readBoundedString(value, surface, maxChars);
}
function readPositiveInteger(value, surface, max) {
	if (typeof value !== "number" || !Number.isSafeInteger(value) || value <= 0 || value > max) throw githubOAuthProtocolError(surface);
	return value;
}
function readOptionalErrorUri(value, surface) {
	const raw = readOptionalBoundedString(value, surface, GITHUB_OAUTH_ERROR_TEXT_MAX_CHARS);
	if (raw === void 0) return;
	let parsed;
	try {
		parsed = new URL(raw);
	} catch {
		throw githubOAuthProtocolError(surface);
	}
	if (parsed.protocol !== "https:" || parsed.username || parsed.password) throw githubOAuthProtocolError(surface);
	return raw;
}
function normalizeGitHubScopes(value, surface) {
	if (typeof value !== "string" || value.length > GITHUB_OAUTH_SCOPE_MAX_CHARS) throw githubOAuthProtocolError(surface);
	const scopes = value.split(/[\s,]+/u).filter(Boolean).map((scope) => {
		if (scope.length > GITHUB_OAUTH_SCOPE_MAX_LENGTH || !/^[a-z0-9:_-]+$/u.test(scope)) throw githubOAuthProtocolError(surface);
		return scope;
	});
	const normalized = [...new Set(scopes)].toSorted();
	if (normalized.length > GITHUB_OAUTH_SCOPE_MAX_COUNT) throw githubOAuthProtocolError(surface);
	return normalized;
}
function parseGitHubOAuthTokenPair(record, surface) {
	if (record.token_type !== "bearer") throw githubOAuthProtocolError(surface);
	const scopes = normalizeGitHubScopes(record.scope, surface);
	if (!scopes.includes("repo") || !scopes.includes("workflow") || !scopes.includes("read:org") || !scopes.includes("gist")) throw githubOAuthProtocolError(surface);
	const accessToken = readBoundedString(record.access_token, surface);
	const refreshToken = readBoundedString(record.refresh_token, surface);
	registerSecretValueForRedaction(accessToken);
	registerSecretValueForRedaction(refreshToken);
	return {
		accessToken,
		tokenType: "bearer",
		scopes,
		expiresInSeconds: readPositiveInteger(record.expires_in, surface, GITHUB_OAUTH_MAX_DURATION_SECONDS),
		refreshToken,
		refreshTokenExpiresInSeconds: readPositiveInteger(record.refresh_token_expires_in, surface, GITHUB_OAUTH_MAX_DURATION_SECONDS)
	};
}
const GITHUB_OAUTH_ERROR_CODES = /* @__PURE__ */ new Set([
	"authorization_pending",
	"slow_down",
	"expired_token",
	"unsupported_grant_type",
	"incorrect_client_credentials",
	"incorrect_device_code",
	"bad_verification_code",
	"access_denied",
	"device_flow_disabled",
	"unverified_user_email",
	"bad_refresh_token"
]);
function isGitHubOAuthErrorCode(value) {
	return typeof value === "string" && GITHUB_OAUTH_ERROR_CODES.has(value);
}
function parseGitHubOAuthError(record, surface) {
	const code = record.error;
	if (!isGitHubOAuthErrorCode(code)) throw githubOAuthProtocolError(surface);
	const intervalSeconds = record.interval === void 0 ? void 0 : readPositiveInteger(record.interval, surface, GITHUB_OAUTH_MAX_INTERVAL_SECONDS);
	const errorDescription = readOptionalBoundedString(record.error_description, surface, GITHUB_OAUTH_ERROR_TEXT_MAX_CHARS);
	const errorUri = readOptionalErrorUri(record.error_uri, surface);
	return {
		code,
		...errorDescription !== void 0 ? { errorDescription } : {},
		...errorUri !== void 0 ? { errorUri } : {},
		...intervalSeconds !== void 0 ? { intervalSeconds } : {}
	};
}
function parseJsonObject(bytes, surface) {
	let parsed;
	try {
		parsed = JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes));
	} catch {
		throw githubOAuthProtocolError(surface);
	}
	const record = asOptionalRecord(parsed);
	if (!record) throw githubOAuthProtocolError(surface);
	return record;
}
async function postGitHubOAuthForm(url, form, surface, options) {
	const timeoutMs = resolveTimerTimeoutMs(options.timeoutMs, GITHUB_OAUTH_REQUEST_TIMEOUT_MS, 1);
	const timeoutSignal = AbortSignal.timeout(timeoutMs);
	const signal = options.signal ? AbortSignal.any([options.signal, timeoutSignal]) : timeoutSignal;
	const response = await fetch(url, {
		method: "POST",
		redirect: "error",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/x-www-form-urlencoded"
		},
		body: form,
		signal
	});
	return {
		response,
		body: await readGitHubResponse(response, surface, timeoutMs)
	};
}
async function readGitHubResponse(response, surface, timeoutMs) {
	return parseJsonObject(await readResponseWithLimit(response, GITHUB_OAUTH_RESPONSE_MAX_BYTES, {
		chunkTimeoutMs: timeoutMs,
		timeoutMs,
		onOverflow: () => githubOAuthProtocolError(surface),
		onIdleTimeout: () => githubOAuthProtocolError(surface),
		onTimeout: () => githubOAuthProtocolError(surface)
	}), surface);
}
/** Verifies only the supplied credential at GitHub's fixed account endpoint. */
async function verifyGitHubCredential(token, options = {}) {
	registerSecretValueForRedaction(token);
	try {
		readBoundedString(token, "account");
		if (/\s/u.test(token)) return { status: "unavailable" };
		const key = createHash("sha256").update(token).digest("hex");
		const cache = verifiedCredentials;
		const cached = cache.get(key);
		if (cached && cached.expiresAt > Date.now()) return cached.result;
		cache.delete(key);
		const create = async () => {
			const timeoutMs = resolveTimerTimeoutMs(options.timeoutMs, GITHUB_OAUTH_REQUEST_TIMEOUT_MS, 1);
			const timeout = AbortSignal.timeout(timeoutMs);
			const response = await fetch("https://api.github.com/user", {
				method: "GET",
				redirect: "error",
				headers: {
					Accept: "application/vnd.github+json",
					Authorization: `Bearer ${token}`
				},
				signal: options.signal ? AbortSignal.any([options.signal, timeout]) : timeout
			});
			if (response.status !== 200) {
				response.body?.cancel().catch(() => void 0);
				const rateLimited = response.status === 429 || response.status === 403 && (response.headers.get("x-ratelimit-remaining") === "0" || response.headers.has("retry-after"));
				return { status: response.status === 401 ? "unavailable" : rateLimited ? "rate_limited" : "unverified" };
			}
			const body = await readGitHubResponse(response, "account", timeoutMs);
			const accountId = readPositiveInteger(body.id, "account", Number.MAX_SAFE_INTEGER);
			const login = readBoundedString(body.login, "account", 100);
			const avatarUrl = body.avatar_url == null ? null : readBoundedString(body.avatar_url, "account");
			const scopes = normalizeGitHubScopes(response.headers.get("x-oauth-scopes") ?? "", "account");
			const result = {
				status: "available",
				account: {
					accountId,
					login,
					avatarUrl
				},
				scopes
			};
			Object.freeze(result.account);
			Object.freeze(result.scopes);
			Object.freeze(result);
			cache.set(key, {
				result,
				expiresAt: Date.now() + GITHUB_CREDENTIAL_VERIFICATION_TTL_MS
			});
			pruneMapToMaxSize(cache, GITHUB_CREDENTIAL_VERIFICATION_MAX_ENTRIES);
			return result;
		};
		return await (options.signal || options.timeoutMs !== void 0 ? create() : getOrCreatePromise(pending, key, create, { evictOnSettled: true }));
	} catch {
		return { status: "unverified" };
	}
}
function throwGitHubOAuthHttpError(response, surface) {
	throw new Error(`GitHub OAuth ${surface} request failed (HTTP ${response.status})`);
}
async function requestGitHubOAuthDeviceCode(options = {}) {
	const { response, body } = await postGitHubOAuthForm(GITHUB_OAUTH_DEVICE_CODE_URL, new URLSearchParams({
		client_id: GITHUB_OAUTH_CLIENT_ID,
		scope: GITHUB_OAUTH_SCOPE
	}), "device authorization", options);
	if (!response.ok) throwGitHubOAuthHttpError(response, "device authorization");
	const deviceCode = readBoundedString(body.device_code, "device authorization");
	const userCode = readBoundedString(body.user_code, "device authorization", 64);
	if (!/^[A-Za-z0-9_-]{40}$/u.test(deviceCode) || !/^[A-Z0-9]{4}-[A-Z0-9]{4}$/u.test(userCode)) throw githubOAuthProtocolError("device authorization");
	if (body.verification_uri !== GITHUB_OAUTH_VERIFICATION_URL) throw githubOAuthProtocolError("device authorization");
	return {
		deviceCode,
		userCode,
		verificationUri: GITHUB_OAUTH_VERIFICATION_URL,
		expiresInSeconds: readPositiveInteger(body.expires_in, "device authorization", GITHUB_OAUTH_MAX_DURATION_SECONDS),
		intervalSeconds: readPositiveInteger(body.interval, "device authorization", GITHUB_OAUTH_MAX_INTERVAL_SECONDS)
	};
}
async function pollGitHubOAuthDeviceToken(params) {
	const deviceCode = readBoundedString(params.deviceCode, "device token");
	if (!/^[A-Za-z0-9_-]{40}$/u.test(deviceCode)) throw githubOAuthProtocolError("device token");
	const { response, body } = await postGitHubOAuthForm(GITHUB_OAUTH_ACCESS_TOKEN_URL, new URLSearchParams({
		client_id: GITHUB_OAUTH_CLIENT_ID,
		device_code: deviceCode,
		grant_type: "urn:ietf:params:oauth:grant-type:device_code"
	}), "device token", params);
	if (body.error !== void 0 && body.access_token !== void 0) throw githubOAuthProtocolError("device token");
	if (body.error !== void 0) {
		const { code, intervalSeconds, ...details } = parseGitHubOAuthError(body, "device token");
		switch (code) {
			case "authorization_pending": return {
				status: code,
				...details
			};
			case "slow_down": return {
				status: code,
				...details,
				...intervalSeconds !== void 0 ? { intervalSeconds } : {}
			};
			case "expired_token":
			case "access_denied": return {
				status: code,
				...details
			};
			default: return {
				status: "error",
				code,
				...details
			};
		}
	}
	if (!response.ok) throwGitHubOAuthHttpError(response, "device token");
	return {
		status: "authorized",
		tokens: parseGitHubOAuthTokenPair(body, "device token")
	};
}
async function refreshGitHubOAuthToken(params) {
	const refreshToken = readBoundedString(params.refreshToken, "token refresh");
	const { response, body } = await postGitHubOAuthForm(GITHUB_OAUTH_ACCESS_TOKEN_URL, new URLSearchParams({
		client_id: GITHUB_OAUTH_CLIENT_ID,
		grant_type: "refresh_token",
		refresh_token: refreshToken
	}), "token refresh", params);
	if (body.error !== void 0 && body.access_token !== void 0) throw githubOAuthProtocolError("token refresh");
	if (body.error !== void 0) {
		const { code, errorDescription, errorUri } = parseGitHubOAuthError(body, "token refresh");
		return {
			status: "error",
			code,
			...errorDescription !== void 0 ? { errorDescription } : {},
			...errorUri !== void 0 ? { errorUri } : {}
		};
	}
	if (!response.ok) throwGitHubOAuthHttpError(response, "token refresh");
	return {
		status: "refreshed",
		tokens: parseGitHubOAuthTokenPair(body, "token refresh")
	};
}
//#endregion
//#region src/agents/github-oauth-records.ts
const OAUTH_RECORD_PREFIX = "github-oauth-";
const OPAQUE_ID_PATTERN = /^[a-f0-9]{32}$/u;
const DEVICE_REQUEST_ID_PATTERN = /^github-device-[a-f0-9]{32}$/u;
const requestIdSchema = string().regex(DEVICE_REQUEST_ID_PATTERN);
const scope = _enum(["system", "agent"]);
const agentId = string().min(1).max(128).refine((value) => normalizeAgentId(value) === value);
const authorValue = string().refine((value) => value.trim().length > 0);
function strictRecord(shape) {
	return unknown().refine((value) => value === null || typeof value !== "object" || !Object.hasOwn(value, "__proto__")).pipe(strictObject(shape));
}
const identityConfig = strictRecord({
	profileId: githubOAuthProfileId,
	kind: literal("oauth").optional(),
	gitAuthor: strictRecord({
		name: authorValue.optional(),
		email: authorValue.optional()
	}).refine((author) => Object.keys(author).length > 0).optional()
}).nullable();
const authorizationFields = {
	agentId,
	scope,
	expectedIdentity: identityConfig,
	agentLifecycleBinding: strictRecord({
		agentId,
		provenance: strictRecord({
			agentId,
			createdVia: _enum([
				"operator",
				"agent",
				"claw"
			]),
			creatorAgentId: agentId.nullable(),
			createdAtMs: githubOAuthTimestamp
		}).nullable()
	}).refine((binding) => binding.provenance === null || binding.provenance.agentId === binding.agentId).optional().catch(void 0)
};
function validAgentBinding(record) {
	return record.scope === "agent" ? record.agentLifecycleBinding?.agentId === record.agentId : record.agentLifecycleBinding === void 0;
}
function omitMissingAgentBinding(record) {
	if (record.agentLifecycleBinding === void 0) delete record.agentLifecycleBinding;
	return record;
}
const deviceRecordSchema = strictRecord({
	version: literal(1),
	requestId: requestIdSchema,
	...githubOAuthDeviceFields,
	...authorizationFields
}).refine(validAgentBinding).refine(validGitHubDeviceTiming).transform(omitMissingAgentBinding);
const pendingInitialSchema = strictRecord({
	requestId: requestIdSchema,
	scope,
	agentId,
	expectedIdentity: identityConfig,
	agentLifecycleBinding: authorizationFields.agentLifecycleBinding
}).refine(validAgentBinding).transform(omitMissingAgentBinding);
const oauthRecordSchema = strictRecord({
	version: literal(1),
	profileId: githubOAuthProfileId,
	agentId,
	scope,
	...githubOAuthRefreshFields,
	scopes: githubOAuthScopes.refine((values) => {
		const canonical = [...new Set(values)].toSorted((left, right) => left.localeCompare(right));
		return canonical.length === values.length && canonical.every((value, index) => value === values[index]);
	}),
	createdAtMs: githubOAuthTimestamp,
	pendingInitial: pendingInitialSchema.optional(),
	pendingRefresh: literal(true).optional(),
	refreshFailure: _enum(["expired", "failed"]).optional()
}).refine((record) => record.accessExpiresAtMs > record.createdAtMs && record.refreshExpiresAtMs > record.accessExpiresAtMs && (!record.pendingInitial || record.pendingInitial.scope === record.scope && record.pendingInitial.agentId === record.agentId) && !(record.pendingInitial && record.pendingRefresh) && !(record.pendingRefresh && record.refreshFailure));
function createGitHubOAuthRecord(params) {
	return {
		version: 1,
		profileId: params.profileId,
		scope: params.scope,
		agentId: params.agentId,
		accountId: params.account.accountId,
		login: params.account.login,
		refreshToken: params.tokens.refreshToken,
		accessExpiresAtMs: params.now + params.tokens.expiresInSeconds * 1e3,
		refreshExpiresAtMs: params.now + params.tokens.refreshTokenExpiresInSeconds * 1e3,
		scopes: params.tokens.scopes,
		createdAtMs: params.now,
		...params.pendingInitial ? { pendingInitial: params.pendingInitial } : {},
		...params.pendingRefresh ? { pendingRefresh: true } : {}
	};
}
function githubDeviceRecordName(requestId) {
	if (!DEVICE_REQUEST_ID_PATTERN.test(requestId)) throw new Error("GitHub device authorization request id is invalid.");
	return requestId;
}
function githubOAuthRecordName(profileId) {
	if (!isManagedGitHubProfileId(profileId)) throw new Error("Managed GitHub profile id is invalid.");
	return `${OAUTH_RECORD_PREFIX}${profileId.slice(4)}`;
}
function parseGitHubOAuthProfileId(name) {
	const opaqueId = name.startsWith(OAUTH_RECORD_PREFIX) ? name.slice(13) : "";
	return OPAQUE_ID_PATTERN.test(opaqueId) ? `ghp_${opaqueId}` : void 0;
}
function parseGitHubRecord(raw, schema) {
	let value;
	try {
		value = JSON.parse(raw);
	} catch {
		return;
	}
	const result = schema.safeParse(value);
	return result.success ? result.data : void 0;
}
function writeGitHubDeviceAuthorizationRecord(record) {
	const parsed = parseGitHubRecord(JSON.stringify(record), deviceRecordSchema);
	if (!parsed || parsed.requestId !== record.requestId) throw new Error("GitHub device authorization record is invalid.");
	writeHiddenGitHubSecretRecord({
		name: githubDeviceRecordName(record.requestId),
		value: JSON.stringify(parsed)
	});
}
function readGitHubDeviceAuthorizationRecord(requestId) {
	const raw = readHiddenGitHubSecretRecord({ name: githubDeviceRecordName(requestId) });
	const record = raw === void 0 ? void 0 : parseGitHubRecord(raw, deviceRecordSchema);
	return record?.requestId === requestId ? record : void 0;
}
function deleteGitHubDeviceAuthorizationRecord(requestId) {
	deleteHiddenGitHubSecretRecord({ name: githubDeviceRecordName(requestId) });
}
function listGitHubDeviceAuthorizationRecords() {
	return listHiddenGitHubSecretRecordNames({ prefix: "github-device" }).flatMap((name) => {
		const requestId = name;
		if (!DEVICE_REQUEST_ID_PATTERN.test(requestId)) return [];
		return [{
			requestId,
			record: readGitHubDeviceAuthorizationRecord(requestId)
		}];
	});
}
function writeGitHubOAuthRecord(record) {
	const parsed = parseGitHubRecord(JSON.stringify(record), oauthRecordSchema);
	if (!parsed || parsed.profileId !== record.profileId) throw new Error("GitHub OAuth record is invalid.");
	writeHiddenGitHubSecretRecord({
		name: githubOAuthRecordName(record.profileId),
		value: JSON.stringify(parsed)
	});
}
function readGitHubOAuthRecord(profileId) {
	const raw = readHiddenGitHubSecretRecord({ name: githubOAuthRecordName(profileId) });
	const record = raw === void 0 ? void 0 : parseGitHubRecord(raw, oauthRecordSchema);
	return record?.profileId === profileId ? record : void 0;
}
function inspectGitHubOAuthRecord(profileId) {
	const raw = readHiddenGitHubSecretRecord({ name: githubOAuthRecordName(profileId) });
	if (raw === void 0) return { state: "missing" };
	const record = parseGitHubRecord(raw, oauthRecordSchema);
	return record?.profileId === profileId ? {
		state: "valid",
		record
	} : { state: "invalid" };
}
function deleteGitHubOAuthRecord(profileId) {
	deleteHiddenGitHubSecretRecord({ name: githubOAuthRecordName(profileId) });
}
function listGitHubOAuthRecords() {
	return listHiddenGitHubSecretRecordNames({ prefix: "github-oauth" }).flatMap((name) => {
		const profileId = parseGitHubOAuthProfileId(name);
		if (!profileId) return [];
		return [{
			profileId,
			record: readGitHubOAuthRecord(profileId)
		}];
	});
}
//#endregion
//#region src/agents/github-tool-identity.ts
const GITHUB_HOST = "github.com";
const MANAGED_GITHUB_ROOT_SEGMENTS = ["credentials", "github"];
var GitHubAccountMismatchError = class extends Error {};
function createManagedGitHubProfileId() {
	return `ghp_${randomBytes(16).toString("hex")}`;
}
function resolveManagedGitHubProfileDir(params) {
	if (!isManagedGitHubProfileId(params.profileId)) throw new Error("Managed GitHub profile id is invalid.");
	const root = resolveManagedGitHubProfileRoot(params);
	return path.join(root, params.profileId);
}
function resolveManagedGitHubProfileRoot(params) {
	const root = path.join(resolveStateDir(params.env), ...MANAGED_GITHUB_ROOT_SEGMENTS);
	return params.scope === "agent" ? path.join(root, "agents", resolveManagedGitHubAgentKey(params.agentId)) : path.join(root, params.scope);
}
function resolveManagedGitHubAgentKey(agentId) {
	return createHash("sha256").update(normalizeAgentId(agentId), "utf8").digest("hex");
}
function resolveConfiguredGitHubToolIdentity(params) {
	return params.scope === "agent" ? resolveAgentConfig(params.config, params.agentId)?.tools?.github : params.config.tools?.github;
}
function resolveSystemGitHubToolIdentity(params) {
	const config = params.config.tools?.github;
	return config ? {
		source: "system-configured",
		config,
		profileDir: resolveManagedGitHubProfileDir({
			agentId: "",
			scope: "system",
			profileId: config.profileId,
			env: params.env
		})
	} : { source: "system-detected" };
}
function resolveGitHubToolIdentity(params) {
	return resolveScopedGitHubToolIdentity({
		...params,
		scope: "agent"
	}) ?? resolveSystemGitHubToolIdentity(params);
}
function resolveScopedGitHubToolIdentity(params) {
	if (params.scope === "system") return resolveSystemGitHubToolIdentity(params);
	const config = resolveConfiguredGitHubToolIdentity(params);
	return config ? {
		source: "agent-override",
		config,
		profileDir: resolveManagedGitHubProfileDir({
			agentId: params.agentId,
			env: params.env,
			scope: "agent",
			profileId: config.profileId
		})
	} : void 0;
}
function managedGitHubIdentityEnvironment(params) {
	const author = params.gitAuthor;
	const gitConfigEntries = [...params.gitConfig ?? [], ...Object.entries({
		...author?.name ? { "user.name": author.name } : {},
		...author?.email ? { "user.email": author.email } : {}
	})];
	const gitConfigEnv = Object.fromEntries(gitConfigEntries.flatMap(([key, value], index) => [[`GIT_CONFIG_KEY_${index}`, key], [`GIT_CONFIG_VALUE_${index}`, value]]));
	return {
		GH_CONFIG_DIR: params.profileDir,
		...gitConfigEntries.length > 0 ? {
			GIT_CONFIG_COUNT: String(gitConfigEntries.length),
			...gitConfigEnv
		} : {},
		...author?.name ? {
			GIT_AUTHOR_NAME: author.name,
			GIT_COMMITTER_NAME: author.name
		} : {},
		...author?.email ? {
			GIT_AUTHOR_EMAIL: author.email,
			GIT_COMMITTER_EMAIL: author.email
		} : {}
	};
}
/** Prepares the non-secret child overlay and store exclusions once per agent run. */
function prepareGitHubToolEnvironment(params) {
	return prepareGitHubToolEnvironmentForIdentity(params, resolveGitHubToolIdentity(params));
}
function prepareGitHubToolEnvironmentForIdentity(params, identity) {
	const managedLocalIdentity = identity.source !== "system-detected";
	const previewToken = params.sourceConfig?.gateway?.controlUi?.github?.token ?? params.config.gateway?.controlUi?.github?.token;
	const credentialScrubEnv = managedLocalIdentity ? {
		GH_TOKEN: "",
		GITHUB_TOKEN: ""
	} : {};
	const excludedStoreNames = [];
	if (isSecretRef(previewToken)) {
		if (previewToken.source === "env" && isValidEnvSecretRefId(previewToken.id)) credentialScrubEnv[previewToken.id] = "";
		else if (previewToken.source === "store") {
			credentialScrubEnv[previewToken.id] = "";
			excludedStoreNames.push(previewToken.id);
		}
	}
	return Object.freeze({
		credentialScrubEnv: Object.freeze(credentialScrubEnv),
		localIdentityEnv: Object.freeze(managedLocalIdentity ? managedGitHubIdentityEnvironment({
			profileDir: identity.profileDir,
			gitAuthor: identity.config.gitAuthor
		}) : {}),
		excludedStoreNames: Object.freeze(excludedStoreNames),
		managedLocalIdentity
	});
}
function githubIdentityProbeEnvironment(params, identity) {
	const overlay = prepareGitHubToolEnvironmentForIdentity(params, identity);
	return {
		...params.env ?? process.env,
		...Object.fromEntries(Object.keys(overlay.credentialScrubEnv).map((name) => [name, void 0])),
		...overlay.localIdentityEnv
	};
}
async function readManagedGitHubToken(profileDir) {
	if (!await isPrivateManagedGitHubProfile(profileDir)) return;
	try {
		let hosts;
		for (const name of ["hosts.yml", "config.yml"]) {
			const filePath = path.join(profileDir, name);
			const stat = await fs.lstat(filePath).catch((error) => {
				if (name === "config.yml" && hasErrnoCode(error, "ENOENT")) return;
				throw error;
			});
			if (!stat) continue;
			if (process.platform !== "win32" && (stat.mode & 63) !== 0) return;
			const raw = await readSecretFile(filePath, "Managed GitHub profile", {
				maxBytes: GITHUB_IDENTITY_OUTPUT_LIMIT_BYTES,
				rejectSymlink: true
			});
			const document = parseDocument(raw, { prettyErrors: false });
			if (document.errors.length || document.warnings.length) return;
			const value = document.toJS({ maxAliasCount: 0 });
			if (!isRecord(value)) return;
			if (name === "hosts.yml") hosts = value;
		}
		const host = isRecord(hosts) ? hosts[GITHUB_HOST] : void 0;
		return isRecord(host) && typeof host.oauth_token === "string" ? normalizeGitHubToken(host.oauth_token) : void 0;
	} catch {
		return;
	}
}
async function readGitAuthor(env, cwd) {
	const result = await runGitHubIdentityCommand([
		"git",
		"config",
		"--null",
		"--get-regexp",
		"^user\\.(name|email)$"
	], env, cwd);
	const author = {
		name: null,
		email: null
	};
	if (result.code !== 0) return author;
	for (const entry of result.stdout.toString("utf8").split("\0")) {
		const separator = entry.indexOf("\n");
		if (separator < 0) continue;
		const key = entry.slice(0, separator);
		const value = readNonBlankString(entry.slice(separator + 1))?.trim() ?? null;
		if (key === "user.name") author.name = value;
		else if (key === "user.email") author.email = value;
	}
	return author;
}
async function isPrivateManagedGitHubProfile(profileDir) {
	try {
		const [profile, hosts] = await Promise.all([fs.lstat(profileDir), fs.lstat(path.join(profileDir, "hosts.yml"))]);
		if (!profile.isDirectory() || profile.isSymbolicLink() || !hosts.isFile() || hosts.isSymbolicLink()) return false;
		return process.platform === "win32" || (profile.mode & 63) === 0 && (hosts.mode & 63) === 0;
	} catch {
		return false;
	}
}
async function resolveGitHubToolIdentityStatus(params) {
	const effectiveIdentity = resolveGitHubToolIdentity(params);
	const selectedIdentity = resolveScopedGitHubToolIdentity({
		...params,
		scope: params.selectedScope
	});
	const probe = {
		config: params.config,
		sourceConfig: params.sourceConfig,
		cwd: resolveAgentWorkspaceDir(params.config, params.agentId),
		env: params.env
	};
	const effective = await resolveGitHubIdentityFacts({
		...probe,
		identity: effectiveIdentity
	});
	const selectedMatchesEffective = selectedIdentity?.source === effectiveIdentity.source && (selectedIdentity?.source === "system-detected" || effectiveIdentity.source !== "system-detected" && selectedIdentity?.config.profileId === effectiveIdentity.config.profileId);
	const selected = !selectedIdentity ? null : selectedMatchesEffective ? effective : await resolveGitHubIdentityFacts({
		...probe,
		identity: selectedIdentity
	});
	return {
		agentId: params.agentId,
		selectedScope: params.selectedScope,
		selected: {
			scope: params.selectedScope,
			configured: selectedIdentity?.source !== "system-detected" && selectedIdentity !== void 0,
			identity: selected
		},
		effective
	};
}
async function resolveSystemGitHubIdentityStatus(params) {
	return resolveGitHubIdentityFacts({
		...params,
		identity: resolveSystemGitHubToolIdentity(params),
		cwd: resolveStateDir(params.env)
	});
}
async function resolveGitHubIdentityFacts(params) {
	const identity = params.identity;
	const managed = identity.source !== "system-detected";
	const probeEnv = githubIdentityProbeEnvironment(params, identity);
	const token = managed ? await readManagedGitHubToken(identity.profileDir) : await readNativeGitHubToken(probeEnv);
	const [probe, author] = await Promise.all([token ? verifyGitHubCredential(token) : void 0, readGitAuthor(probeEnv, params.cwd)]);
	const account = probe?.status === "available" ? probe.account : null;
	const credentialState = probe?.status === "unavailable" || !probe ? managed ? "configured_unavailable" : "unavailable" : probe.status;
	const oauth = managed && identity.config.kind === "oauth" ? inspectGitHubOAuthRecord(identity.config.profileId) : { state: "missing" };
	const oauthRecord = oauth.state === "valid" ? oauth.record : void 0;
	const refreshState = !managed || identity.config.kind !== "oauth" ? "not_applicable" : oauth.state !== "valid" ? "unavailable" : oauth.record.pendingRefresh ? "refreshing" : oauth.record.refreshFailure ?? (oauth.record.refreshExpiresAtMs <= Date.now() ? "expired" : "available");
	return {
		source: identity.source,
		credentialKind: !managed ? "native" : identity.config.kind === "oauth" ? "managed-oauth" : "managed-pat",
		credentialState,
		account: account ? { login: account.login } : null,
		gitAuthor: author,
		evidence: account ? "github-api" : probe?.status === "rate_limited" ? "rate-limited" : probe ? "unverified" : "none",
		accessExpiresAtMs: oauthRecord?.accessExpiresAtMs ?? null,
		refreshState,
		oauthScopes: [...oauthRecord?.scopes ?? []],
		repositoryGrants: "unknown"
	};
}
/** Only the personal publication broker receives this environment; never agent execution. */
async function preparePersonalGitHubPublicationIdentity(params) {
	params.assertCurrent();
	const profileDir = resolveManagedGitHubProfileDir({
		agentId: "",
		scope: "personal",
		profileId: params.profileId
	});
	const token = await readManagedGitHubToken(profileDir);
	if (!token) throw new Error("My GitHub profile is unavailable; reconnect My GitHub.");
	params.assertCurrent();
	const env = {
		...process.env,
		GH_TOKEN: token,
		GITHUB_TOKEN: void 0,
		GH_CONFIG_DIR: profileDir,
		GH_PROMPT_DISABLED: "1"
	};
	const probe = await verifyGitHubCredential(token);
	params.assertCurrent();
	if (probe.status !== "available") throw new Error("My GitHub credential could not be verified; reconnect My GitHub.");
	if (probe.account.accountId !== params.accountId) throw new GitHubAccountMismatchError("My GitHub account changed; reconnect My GitHub.");
	return Object.freeze({
		source: "personal",
		profileId: params.profileId,
		account: probe.account,
		env: Object.freeze(env)
	});
}
/** Confirms the current config still selects the prepared publication profile. */
function matchesPreparedGitHubPublicationIdentity(params) {
	const current = resolveGitHubToolIdentity(params);
	return current.source === params.identity.source && (current.source === "system-detected" || current.config.profileId === params.identity.profileId);
}
async function prepareSharedGitHubIdentity(params, readNativeToken = readNativeGitHubToken) {
	const identity = resolveGitHubToolIdentity(params);
	const managed = identity.source !== "system-detected";
	const currentEnvironment = () => ({
		...githubIdentityProbeEnvironment(params, identity),
		GH_PROMPT_DISABLED: "1"
	});
	const env = currentEnvironment();
	const readToken = () => managed ? readManagedGitHubToken(identity.profileDir) : readNativeToken(currentEnvironment(), params.allowAnonymous === true);
	const token = await startGitHubIdentityOperation(readToken, params);
	if (!token) return startGitHubIdentityOperation(() => {
		if (!managed && params.allowAnonymous) return {
			prepared: void 0,
			token: void 0,
			readToken
		};
		throw new GitHubIdentityError("unavailable");
	}, params);
	const probe = await startGitHubIdentityOperation(() => verifyGitHubCredential(token), params);
	return startGitHubIdentityOperation(() => {
		if (probe.status !== "available") throw new GitHubIdentityError(probe.status);
		return {
			prepared: Object.freeze({
				source: identity.source,
				...managed ? { profileId: identity.config.profileId } : {},
				account: probe.account,
				env: Object.freeze({
					...env,
					GH_TOKEN: token,
					GITHUB_TOKEN: void 0
				})
			}),
			token,
			readToken
		};
	}, params);
}
/** Publication owns a fixed credential snapshot for its already-admitted operation. */
async function prepareGitHubPublicationIdentity(params) {
	const { prepared } = await prepareSharedGitHubIdentity(params);
	if (!prepared) throw new GitHubIdentityError("unavailable");
	return prepared;
}
/** Options expose account facts only; publication obtains its own live credential. */
async function prepareGitHubPublicationOptionsIdentity(params) {
	const { prepared } = await prepareSharedGitHubIdentity(params, readCachedNativeGitHubToken);
	if (!prepared) throw new GitHubIdentityError("unavailable");
	return {
		source: prepared.source,
		account: prepared.account
	};
}
/** Read authority tracks current selection and token rotation, without exporting a child environment. */
async function prepareGitHubReadIdentity(params) {
	const selected = resolveGitHubToolIdentity(params);
	const profileId = selected.source === "system-detected" ? void 0 : selected.config.profileId;
	const kind = selected.source === "system-detected" ? void 0 : selected.config.kind;
	const assertSelected = () => {
		params.assertActive();
		const current = resolveGitHubToolIdentity({
			...params,
			config: params.getCurrentConfig()
		});
		if (current.source !== selected.source || current.source !== "system-detected" && (current.config.profileId !== profileId || current.config.kind !== kind)) throw new GitHubIdentityError("changed");
	};
	const caller = {
		assertCurrent: assertSelected,
		startCurrent: params.startActive
	};
	await startGitHubIdentityOperation(params.refresh, caller);
	assertSelected();
	const { token, readToken, prepared } = await prepareSharedGitHubIdentity({
		...params,
		...caller
	}, readCachedNativeGitHubToken);
	assertSelected();
	return createGitHubReadIdentity({
		assertSelected,
		startActive: params.startActive,
		readToken,
		...!prepared || token === void 0 ? {
			token: void 0,
			selection: { source: "anonymous" }
		} : {
			token,
			selection: {
				source: selected.source,
				...profileId ? { profileId } : {},
				accountId: prepared.account.accountId
			}
		}
	});
}
async function removeManagedGitHubProfile(profileDir) {
	await fs.rm(profileDir, {
		recursive: true,
		force: true
	});
	clearNativeGitHubTokenCache();
}
async function stageManagedGitHubProfile(parent, token) {
	await fs.mkdir(parent, {
		recursive: true,
		mode: 448
	});
	await fs.chmod(parent, 448);
	const stagingRoot = await fs.mkdtemp(path.join(parent, ".github-profile.staging-"));
	const stagedProfile = path.join(stagingRoot, "profile");
	try {
		const credential = normalizeGitHubToken(token);
		const verified = await verifyGitHubCredential(credential);
		if (verified.status !== "available") throw new Error("GitHub could not verify the managed credential.");
		const scopes = verified.scopes;
		if (scopes.length && (!scopes.includes("repo") || ![
			"read:org",
			"write:org",
			"admin:org"
		].some((scope) => scopes.includes(scope)))) throw new Error("GitHub credential is missing required repo or read:org scopes.");
		await writeManagedGitHubProfileFiles(stagedProfile, {
			login: verified.account.login,
			token: credential
		});
		return {
			account: verified.account,
			stagedProfile,
			stagingRoot
		};
	} catch (error) {
		await fs.rm(stagingRoot, {
			recursive: true,
			force: true
		});
		throw error;
	}
}
/** Write gh's external file contract without touching its OS keyring or verifying again. */
async function writeManagedGitHubProfileFiles(profileDir, identity) {
	await fs.mkdir(profileDir, {
		recursive: true,
		mode: 448
	});
	await fs.chmod(profileDir, 448);
	const temporaryHosts = path.join(profileDir, `.hosts-${randomBytes(16).toString("hex")}.tmp`);
	try {
		await fs.writeFile(temporaryHosts, stringify({ [GITHUB_HOST]: {
			user: identity.login,
			oauth_token: identity.token,
			users: { [identity.login]: { oauth_token: identity.token } }
		} }), {
			mode: 384,
			flag: "wx"
		});
		await fs.writeFile(path.join(profileDir, "config.yml"), stringify({ version: "1" }), { mode: 384 });
		await fs.rename(temporaryHosts, path.join(profileDir, "hosts.yml"));
	} finally {
		await fs.rm(temporaryHosts, { force: true });
	}
}
/** Verifies a rotated token, then atomically replaces credentials in one stable profile. */
async function refreshManagedGitHubProfile(params) {
	if (!await isPrivateManagedGitHubProfile(params.profileDir)) throw new Error("The configured GitHub identity profile is unavailable.");
	const staged = await stageManagedGitHubProfile(path.dirname(params.profileDir), params.token);
	const targetHosts = path.join(params.profileDir, "hosts.yml");
	const replacementHosts = path.join(params.profileDir, `.hosts.yml.refresh-${randomBytes(16).toString("hex")}`);
	try {
		params.assertCurrent?.();
		if (staged.account.accountId !== params.expectedAccountId) throw new GitHubAccountMismatchError("GitHub OAuth refresh returned a different account.");
		const targetStat = await fs.lstat(targetHosts);
		if (!targetStat.isFile() || targetStat.isSymbolicLink()) throw new Error("The configured GitHub identity profile is unavailable.");
		await fs.copyFile(path.join(staged.stagedProfile, "hosts.yml"), replacementHosts);
		await fs.chmod(replacementHosts, 384);
		params.assertCurrent?.();
		await fs.rename(replacementHosts, targetHosts);
		clearNativeGitHubTokenCache();
		params.assertCurrent?.();
		return staged.account;
	} finally {
		await fs.rm(replacementHosts, { force: true });
		await fs.rm(staged.stagingRoot, {
			recursive: true,
			force: true
		});
	}
}
/** Publishes a new inactive profile and switches config without retiring in-use generations. */
async function installManagedGitHubProfile(params) {
	const staged = await stageManagedGitHubProfile(path.dirname(params.profileDir), params.token);
	let published = false;
	let committed = false;
	try {
		params.assertCurrent?.();
		await fs.rename(staged.stagedProfile, params.profileDir);
		published = true;
		params.assertCurrent?.();
		await params.commitConfig(staged.account);
		clearNativeGitHubTokenCache();
		committed = true;
		return staged.account;
	} finally {
		if (published && !committed && !params.retainProfileOnCommitFailure) await fs.rm(params.profileDir, {
			recursive: true,
			force: true
		});
		await fs.rm(staged.stagingRoot, {
			recursive: true,
			force: true
		});
	}
}
//#endregion
export { pollGitHubOAuthDeviceToken as A, inspectGitHubOAuthRecord as C, writeGitHubDeviceAuthorizationRecord as D, readGitHubDeviceAuthorizationRecord as E, requestGitHubOAuthDeviceCode as M, GitHubIdentityError as N, writeGitHubOAuthRecord as O, clearNativeGitHubTokenCache as P, deleteGitHubOAuthRecord as S, listGitHubOAuthRecords as T, resolveManagedGitHubProfileRoot as _, matchesPreparedGitHubPublicationIdentity as a, createGitHubOAuthRecord as b, prepareGitHubReadIdentity as c, refreshManagedGitHubProfile as d, removeManagedGitHubProfile as f, resolveManagedGitHubProfileDir as g, resolveManagedGitHubAgentKey as h, managedGitHubIdentityEnvironment as i, refreshGitHubOAuthToken as j, clearGitHubCredentialVerificationCache as k, prepareGitHubToolEnvironment as l, resolveGitHubToolIdentityStatus as m, createManagedGitHubProfileId as n, prepareGitHubPublicationIdentity as o, resolveConfiguredGitHubToolIdentity as p, installManagedGitHubProfile as r, prepareGitHubPublicationOptionsIdentity as s, GitHubAccountMismatchError as t, preparePersonalGitHubPublicationIdentity as u, resolveSystemGitHubIdentityStatus as v, listGitHubDeviceAuthorizationRecords as w, deleteGitHubDeviceAuthorizationRecord as x, writeManagedGitHubProfileFiles as y };
