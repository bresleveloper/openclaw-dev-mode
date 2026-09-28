import { s as __toESM } from "./rolldown-runtime-Dr7-SnC6.mjs";
import { D as resolveExpiresAtMsFromDurationMs, k as resolveExpiresAtMsFromDurationSeconds, o as asDateTimestampMs } from "./number-coercion-CLj0HTDM.mjs";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { k as withTimeout } from "./fs-safe-BAPek8At.mjs";
import { i as readResponseWithLimit } from "./http-response-body-DXfezLdR.mjs";
import { n as buildTimeoutAbortSignal } from "./fetch-timeout-BOG6Do5a.mjs";
import "./string-coerce-runtime-C_MKhRVt.mjs";
import "./text-utility-runtime-D7I29NA0.mjs";
import "./response-limit-runtime-Wtkm2X7a.mjs";
import "./number-runtime-CGwowceO.mjs";
import "./extension-shared-N0S3ppSB.mjs";
import { n as readGoogleAdcCredentials, r as resolveGoogleApplicationCredentialsPath } from "./vertex-adc-config-DuKAthGG.mjs";
import { gunzipSync } from "node:zlib";
//#region extensions/google/vertex-adc.ts
const GOOGLE_OAUTH_TOKEN_URL = "https://oauth2.googleapis.com/token";
const GOOGLE_VERTEX_OAUTH_SCOPE = "https://www.googleapis.com/auth/cloud-platform";
const GOOGLE_VERTEX_ADC_TOKEN_REFRESH_TIMEOUT_MS = 3e4;
const GOOGLE_VERTEX_TOKEN_EXPIRY_BUFFER_MS = 6e4;
const GOOGLE_VERTEX_DEFAULT_TOKEN_LIFETIME_SECONDS = 3600;
const GOOGLE_VERTEX_AUTHLIB_TOKEN_CACHE_MS = 3e5;
const GOOGLE_OAUTH_TOKEN_RESPONSE_MAX_BYTES = 1048576;
const VERTEX_ADC_TEST_API_KEY = Symbol.for("openclaw.google.vertexAdcTestApi");
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
if (process.env.VITEST) globalThis[VERTEX_ADC_TEST_API_KEY] = { reset: resetGoogleVertexAuthorizedUserTokenCacheForTest };
function resolveGoogleAuthorizedUserCredentials(adcConfig) {
	const record = adcConfig;
	if (record.type !== "authorized_user") return;
	return {
		type: "authorized_user",
		client_id: normalizeOptionalString(record.client_id),
		client_secret: normalizeOptionalString(record.client_secret),
		refresh_token: normalizeOptionalString(record.refresh_token)
	};
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
	const { signal, cleanup } = buildTimeoutAbortSignal({
		timeoutMs: GOOGLE_VERTEX_ADC_TOKEN_REFRESH_TIMEOUT_MS,
		operation: "google-vertex-adc-token-refresh",
		url: GOOGLE_OAUTH_TOKEN_URL
	});
	let response;
	let payload;
	try {
		response = await (params.fetchImpl ?? fetch)(GOOGLE_OAUTH_TOKEN_URL, {
			method: "POST",
			headers: { "Content-Type": "application/x-www-form-urlencoded" },
			body,
			signal
		});
		payload = await readGoogleOauthTokenResponsePayload(response);
	} finally {
		cleanup();
	}
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
	const text = decodeGoogleOauthTokenResponseBody(await readResponseWithLimit(response, GOOGLE_OAUTH_TOKEN_RESPONSE_MAX_BYTES, { onOverflow: ({ maxBytes }) => /* @__PURE__ */ new Error(`Google OAuth token response exceeds ${maxBytes} bytes`) }), response.headers.get("content-encoding"));
	if (!text.trim()) return;
	try {
		return JSON.parse(text);
	} catch {
		return;
	}
}
function decodeGoogleOauthTokenResponseBody(bytes, contentEncoding) {
	if (shouldGunzipGoogleOauthTokenResponse(bytes, contentEncoding)) try {
		return gunzipSync(bytes, { maxOutputLength: GOOGLE_OAUTH_TOKEN_RESPONSE_MAX_BYTES }).toString("utf8");
	} catch (error) {
		if (typeof error === "object" && error !== null && "code" in error && error.code === "ERR_BUFFER_TOO_LARGE") throw new Error(`Google OAuth token response exceeds ${GOOGLE_OAUTH_TOKEN_RESPONSE_MAX_BYTES} decompressed bytes`, { cause: error });
		return bytes.toString("utf8");
	}
	return bytes.toString("utf8");
}
function shouldGunzipGoogleOauthTokenResponse(bytes, contentEncoding) {
	if (bytes[0] === 31 && bytes[1] === 139) return true;
	return (contentEncoding ?? "").split(",").map((encoding) => encoding.trim().toLowerCase()).includes("gzip");
}
async function resolveGoogleVertexAccessTokenViaGoogleAuth(adcConfig) {
	if (!cachedGoogleAuthClient) cachedGoogleAuthClient = { promise: import("./src-B0SYd4Mk.mjs").then((m) => /* @__PURE__ */ __toESM(m.default, 1)).then(({ GoogleAuth }) => {
		return new GoogleAuth({
			scopes: [GOOGLE_VERTEX_OAUTH_SCOPE],
			...adcConfig ? { credentials: adcConfig } : {},
			clientOptions: { transporterOptions: { timeout: GOOGLE_VERTEX_ADC_TOKEN_REFRESH_TIMEOUT_MS } }
		});
	}) };
	const authClient = cachedGoogleAuthClient;
	const auth = await authClient.promise;
	const cached = cachedGoogleVertexAdcToken;
	if (cached && isGoogleVertexTokenFresh(cached.expiresAtMs)) return cached.token;
	let token;
	try {
		token = await withTimeout(auth.getAccessToken(), GOOGLE_VERTEX_ADC_TOKEN_REFRESH_TIMEOUT_MS, { createError: () => new DOMException("request timed out", "TimeoutError") });
	} catch (error) {
		if (error instanceof DOMException && error.name === "TimeoutError" && cachedGoogleAuthClient === authClient) cachedGoogleAuthClient = void 0;
		throw error;
	}
	const normalized = normalizeOptionalString(token);
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
	const adcPath = resolveGoogleApplicationCredentialsPath();
	const adcConfig = adcPath ? readGoogleAdcCredentials(adcPath) : void 0;
	const userAdc = adcConfig ? resolveGoogleAuthorizedUserCredentials(adcConfig) : void 0;
	const token = userAdc && adcPath ? await refreshGoogleVertexAuthorizedUserAccessToken({
		credentialsPath: adcPath,
		credentials: userAdc,
		fetchImpl
	}) : await resolveGoogleVertexAccessTokenViaGoogleAuth(adcConfig);
	const quotaProject = normalizeOptionalString(process.env.GOOGLE_CLOUD_QUOTA_PROJECT) ?? normalizeOptionalString(adcConfig?.quota_project_id);
	return {
		Authorization: `Bearer ${token}`,
		...quotaProject ? { "x-goog-user-project": quotaProject } : {}
	};
}
//#endregion
export { resolveGoogleVertexAuthorizedUserHeaders as t };
