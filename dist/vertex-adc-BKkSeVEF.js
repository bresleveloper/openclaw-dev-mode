import { o as __toESM } from "./chunk-CNf5ZN-e.js";
import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import { C as resolveExpiresAtMsFromDurationMs, T as resolveExpiresAtMsFromDurationSeconds, o as asDateTimestampMs } from "./number-coercion-CJQ8TR--.js";
import "./number-runtime-DBLVDypr.js";
import "./string-coerce-runtime-BiZzULo_.js";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { readFile } from "node:fs/promises";
import os from "node:os";
import { gunzipSync } from "node:zlib";
//#region extensions/google/vertex-adc.ts
const GCP_VERTEX_CREDENTIALS_MARKER = "gcp-vertex-credentials";
const GOOGLE_OAUTH_TOKEN_URL = "https://oauth2.googleapis.com/token";
const GOOGLE_VERTEX_OAUTH_SCOPE = "https://www.googleapis.com/auth/cloud-platform";
const GOOGLE_VERTEX_TOKEN_EXPIRY_BUFFER_MS = 6e4;
const GOOGLE_VERTEX_DEFAULT_TOKEN_LIFETIME_SECONDS = 3600;
const GOOGLE_VERTEX_AUTHLIB_TOKEN_CACHE_MS = 5 * 6e4;
let cachedGoogleVertexAuthorizedUserToken;
let cachedGoogleAuthClient;
let cachedGoogleVertexAdcToken;
function isGoogleVertexTokenFresh(expiresAtMsRaw, nowRaw = Date.now()) {
	const expiresAtMs = asDateTimestampMs(expiresAtMsRaw);
	const nowMs = asDateTimestampMs(nowRaw);
	if (expiresAtMs === void 0 || nowMs === void 0) return false;
	const minFreshExpiresAtMs = resolveExpiresAtMsFromDurationMs(GOOGLE_VERTEX_TOKEN_EXPIRY_BUFFER_MS, { nowMs });
	return minFreshExpiresAtMs !== void 0 && expiresAtMs > minFreshExpiresAtMs;
}
function resolveAuthorizedUserTokenExpiresAtMs(value, nowRaw) {
	const nowMs = asDateTimestampMs(nowRaw);
	if (nowMs === void 0) return;
	return resolveExpiresAtMsFromDurationSeconds(typeof value === "number" && Number.isFinite(value) ? Math.max(1, value) : GOOGLE_VERTEX_DEFAULT_TOKEN_LIFETIME_SECONDS, { nowMs }) ?? nowMs;
}
function resolveGoogleAuthLibraryTokenExpiresAtMs(nowRaw = Date.now()) {
	const nowMs = asDateTimestampMs(nowRaw);
	return nowMs === void 0 ? void 0 : resolveExpiresAtMsFromDurationMs(GOOGLE_VERTEX_AUTHLIB_TOKEN_CACHE_MS, { nowMs });
}
function resetGoogleVertexAuthorizedUserTokenCacheForTest() {
	cachedGoogleVertexAuthorizedUserToken = void 0;
	cachedGoogleAuthClient = void 0;
	cachedGoogleVertexAdcToken = void 0;
}
function isGoogleVertexCredentialsMarker(apiKey) {
	return apiKey === void 0 || apiKey === GCP_VERTEX_CREDENTIALS_MARKER;
}
function hasGoogleVertexProjectEnv(env) {
	return Boolean(normalizeOptionalString(env.GOOGLE_CLOUD_PROJECT) || normalizeOptionalString(env.GCLOUD_PROJECT));
}
function hasGoogleVertexLocationEnv(env) {
	return Boolean(normalizeOptionalString(env.GOOGLE_CLOUD_LOCATION));
}
function resolveGoogleApplicationCredentialsPath(env = process.env) {
	const explicit = normalizeOptionalString(env.GOOGLE_APPLICATION_CREDENTIALS);
	if (explicit) return existsSync(explicit) ? explicit : void 0;
	const homeDir = normalizeOptionalString(env.HOME) ?? os.homedir();
	const homeFallback = path.join(homeDir, ".config", "gcloud", "application_default_credentials.json");
	if (existsSync(homeFallback)) return homeFallback;
	const appDataDir = normalizeOptionalString(env.APPDATA);
	if (!appDataDir) return;
	const appDataFallback = path.join(appDataDir, "gcloud", "application_default_credentials.json");
	return existsSync(appDataFallback) ? appDataFallback : void 0;
}
async function readGoogleAuthorizedUserCredentials(credentialsPath) {
	let parsed;
	try {
		parsed = JSON.parse(await readFile(credentialsPath, "utf8"));
	} catch {
		return;
	}
	if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return;
	const record = parsed;
	if (record.type !== "authorized_user") return;
	return {
		type: "authorized_user",
		client_id: normalizeOptionalString(record.client_id),
		client_secret: normalizeOptionalString(record.client_secret),
		refresh_token: normalizeOptionalString(record.refresh_token)
	};
}
function readGoogleAdcCredentialsTypeSync(credentialsPath) {
	try {
		const parsed = JSON.parse(readFileSync(credentialsPath, "utf8"));
		if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return;
		const type = parsed.type;
		return typeof type === "string" ? type : void 0;
	} catch {
		return;
	}
}
/**
* Returns true when a file/env Application Default Credentials source usable
* for Google Vertex AI is detectable synchronously. We still call the function
* `...AuthorizedUserAdcSync` for backwards compatibility with older tests; the
* predicate now also covers:
*
*   1. `authorized_user` credentials file (existing case - `gcloud auth
*      application-default login` produces this).
*   2. `external_account` credentials file (Workload Identity Federation).
*   3. `service_account` credentials file (raw GSA key - rarely used in
*      OpenClaw, included for completeness).
* Metadata-server ADC is intentionally not detected here: `google-auth-library`
* probes the default metadata hosts asynchronously at request time, and the
* provider wires the Vertex transport without this sync predicate.
*/
function hasGoogleVertexAuthorizedUserAdcSync(env = process.env) {
	const credentialsPath = resolveGoogleApplicationCredentialsPath(env);
	if (credentialsPath) {
		const type = readGoogleAdcCredentialsTypeSync(credentialsPath);
		if (type === "authorized_user" || type === "external_account" || type === "service_account") return true;
	}
	return false;
}
function resolveGoogleVertexConfigApiKey(env = process.env) {
	return hasGoogleVertexProjectEnv(env) && hasGoogleVertexLocationEnv(env) && hasGoogleVertexAuthorizedUserAdcSync(env) ? GCP_VERTEX_CREDENTIALS_MARKER : void 0;
}
async function refreshGoogleVertexAuthorizedUserAccessToken(params) {
	const clientId = normalizeOptionalString(params.credentials.client_id);
	const clientSecret = normalizeOptionalString(params.credentials.client_secret);
	const refreshToken = normalizeOptionalString(params.credentials.refresh_token);
	if (!clientId || !clientSecret || !refreshToken) throw new Error("Google Vertex authorized_user ADC is missing client_id, client_secret, or refresh_token.");
	const cached = cachedGoogleVertexAuthorizedUserToken;
	if (cached?.credentialsPath === params.credentialsPath && cached.refreshToken === refreshToken && isGoogleVertexTokenFresh(cached.expiresAtMs)) return cached.token;
	const body = new URLSearchParams({
		client_id: clientId,
		client_secret: clientSecret,
		refresh_token: refreshToken,
		grant_type: "refresh_token"
	});
	const response = await (params.fetchImpl ?? fetch)(GOOGLE_OAUTH_TOKEN_URL, {
		method: "POST",
		headers: { "Content-Type": "application/x-www-form-urlencoded" },
		body
	});
	const payload = await readGoogleOauthTokenResponsePayload(response);
	if (!response.ok) {
		const description = normalizeOptionalString(payload?.error_description);
		const code = normalizeOptionalString(payload?.error);
		throw new Error(`Google Vertex ADC token refresh failed: ${response.status}${code ? ` ${code}` : ""}${description ? ` (${description})` : ""}`);
	}
	if (!payload) throw new Error("Google Vertex ADC token refresh response could not be parsed as JSON.");
	const token = normalizeOptionalString(payload?.access_token);
	if (!token) throw new Error("Google Vertex ADC token refresh response did not include an access_token.");
	const nowMs = Date.now();
	const expiresAtMs = resolveAuthorizedUserTokenExpiresAtMs(payload?.expires_in, nowMs);
	if (expiresAtMs !== void 0) cachedGoogleVertexAuthorizedUserToken = {
		token,
		expiresAtMs,
		credentialsPath: params.credentialsPath,
		refreshToken
	};
	return token;
}
async function readGoogleOauthTokenResponsePayload(response) {
	const text = decodeGoogleOauthTokenResponseBody(Buffer.from(await response.arrayBuffer()), response.headers.get("content-encoding"));
	if (!text.trim()) return;
	try {
		return JSON.parse(text);
	} catch {
		return;
	}
}
function decodeGoogleOauthTokenResponseBody(bytes, contentEncoding) {
	if (shouldGunzipGoogleOauthTokenResponse(bytes, contentEncoding)) try {
		return gunzipSync(bytes).toString("utf8");
	} catch {
		return bytes.toString("utf8");
	}
	return bytes.toString("utf8");
}
function shouldGunzipGoogleOauthTokenResponse(bytes, contentEncoding) {
	if (bytes[0] === 31 && bytes[1] === 139) return true;
	return (contentEncoding ?? "").split(",").map((encoding) => encoding.trim().toLowerCase()).includes("gzip");
}
async function resolveGoogleVertexAccessTokenViaGoogleAuth() {
	if (!cachedGoogleAuthClient) cachedGoogleAuthClient = { promise: import("./src-D_-2L0S5.js").then((m) => /* @__PURE__ */ __toESM(m.default, 1)).then(({ GoogleAuth }) => {
		return new GoogleAuth({ scopes: [GOOGLE_VERTEX_OAUTH_SCOPE] });
	}) };
	const auth = await cachedGoogleAuthClient.promise;
	const cached = cachedGoogleVertexAdcToken;
	if (cached && isGoogleVertexTokenFresh(cached.expiresAtMs)) return cached.token;
	const normalized = normalizeOptionalString(await auth.getAccessToken());
	if (!normalized) throw new Error("Google Vertex ADC fallback (google-auth-library) did not return an access token. Verify the GKE Workload Identity binding (KSA → GSA), `GOOGLE_APPLICATION_CREDENTIALS`, or other ADC source is reachable from this pod.");
	const expiresAtMs = resolveGoogleAuthLibraryTokenExpiresAtMs();
	if (expiresAtMs !== void 0) cachedGoogleVertexAdcToken = {
		token: normalized,
		expiresAtMs
	};
	return normalized;
}
/**
* Resolve `Authorization: Bearer ...` headers for Google Vertex calls.
*
* We try the hand-rolled `authorized_user` refresh path first (preserves the
* existing fetchImpl test seam and the OpenClaw upstream behaviour); when the
* configured ADC source is anything other than `authorized_user` (the common
* production cases on GKE: Workload Identity, Workload Identity Federation,
* service-account JSON keys), we hand off to `google-auth-library` which
* understands all of those natively.
*
* Note: the function is still named `...AuthorizedUserHeaders` to avoid a
* symbol rename across the existing patch surface; the docstring above is
* the truth, the name is legacy.
*/
async function resolveGoogleVertexAuthorizedUserHeaders(fetchImpl) {
	const credentialsPath = resolveGoogleApplicationCredentialsPath();
	if (credentialsPath) {
		const credentials = await readGoogleAuthorizedUserCredentials(credentialsPath);
		if (credentials) return { Authorization: `Bearer ${await refreshGoogleVertexAuthorizedUserAccessToken({
			credentialsPath,
			credentials,
			fetchImpl
		})}` };
	}
	return { Authorization: `Bearer ${await resolveGoogleVertexAccessTokenViaGoogleAuth()}` };
}
//#endregion
export { resolveGoogleVertexConfigApiKey as a, resolveGoogleVertexAuthorizedUserHeaders as i, isGoogleVertexCredentialsMarker as n, resetGoogleVertexAuthorizedUserTokenCacheForTest as r, hasGoogleVertexAuthorizedUserAdcSync as t };
