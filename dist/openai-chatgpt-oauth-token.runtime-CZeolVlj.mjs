import { a as asOptionalRecord, c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { i as normalizeBoundedOptionalString, l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { _ as redactSensitiveText } from "./redact-B5EGyLvV.mjs";
import { i as readResponseWithLimit } from "./http-response-body-DXfezLdR.mjs";
import { i as fetchWithSsrFGuard } from "./fetch-guard-EFfAF2PS.mjs";
import { c as resolveOAuthTokenExpiresAt, l as resolveOAuthTokenLifetimeMs, u as throwIfOAuthLoginAborted } from "./provider-oauth-runtime-HklxkwLy.mjs";
import "./string-coerce-runtime-C_MKhRVt.mjs";
import "./response-limit-runtime-Wtkm2X7a.mjs";
import "./ssrf-runtime-Darh53Ay.mjs";
import "./security-runtime-HdPo6iAV.mjs";
//#region extensions/openai/openai-chatgpt-oauth-token.runtime.ts
const CLIENT_ID = "app_EMoamEEZ73f0CkXaXp7hrann";
const TOKEN_URL = "https://auth.openai.com/oauth/token";
const OAUTH_TOKEN_SSRF_POLICY = {
	allowRfc2544BenchmarkRange: true,
	allowIpv6UniqueLocalRange: true,
	hostnameAllowlist: ["auth.openai.com"]
};
const TOKEN_REQUEST_TIMEOUT_MS = 3e4;
const OAUTH_TOKEN_RESPONSE_BODY_LIMIT_BYTES = 1048576;
const OAUTH_TOKEN_ERROR_SUMMARY_MAX_CHARS = 500;
const TOKEN_FAILURE_REASON_BY_CODE = {
	invalid_grant: "invalid_grant",
	invalid_refresh_token: "invalid_refresh_token",
	refresh_token_expired: "expired",
	refresh_token_invalidated: "token_invalidated",
	refresh_token_reused: "refresh_token_reused"
};
const TOKEN_FAILURE_CODES = new Set(Object.keys(TOKEN_FAILURE_REASON_BY_CODE));
function normalizeTokenErrorSummary(value) {
	const normalized = normalizeBoundedOptionalString(value, OAUTH_TOKEN_ERROR_SUMMARY_MAX_CHARS * 4)?.replace(/\s+/gu, " ").trim();
	return normalized ? normalizeBoundedOptionalString(redactSensitiveText(normalized, { mode: "tools" }), OAUTH_TOKEN_ERROR_SUMMARY_MAX_CHARS) : void 0;
}
function normalizeTokenErrorFact(value, allowlist) {
	const normalized = normalizeOptionalString(value)?.toLowerCase();
	return normalized && allowlist.has(normalized) ? normalized : void 0;
}
function buildTokenResponseFailure(params) {
	let body;
	try {
		body = asOptionalRecord(JSON.parse(params.text));
	} catch {}
	const error = asOptionalRecord(body?.error);
	const code = normalizeTokenErrorFact(error?.code ?? (typeof body?.error === "string" ? body.error : body?.code), TOKEN_FAILURE_CODES);
	const rawType = normalizeOptionalString(error?.type ?? body?.type)?.toLowerCase();
	const errorType = rawType === "invalid_grant" || rawType === "invalid_request_error" ? rawType : void 0;
	const reason = code ? TOKEN_FAILURE_REASON_BY_CODE[code] : void 0;
	const summary = normalizeTokenErrorSummary(error?.message ?? body?.error_description ?? body?.message) ?? `OpenAI Codex token ${params.operation} failed (HTTP ${params.response.status}).`;
	return {
		type: "failed",
		operation: params.operation,
		summary,
		status: params.response.status,
		...code ? { code } : {},
		...errorType ? { errorType } : {},
		...reason ? { reason } : {}
	};
}
function formatMissingTokenResponseFields(json, existingRefreshToken) {
	const missing = [];
	if (!json.access_token) missing.push("access_token");
	if (!json.refresh_token && !existingRefreshToken) missing.push("refresh_token");
	if (resolveOAuthTokenLifetimeMs(json.expires_in) === void 0) missing.push("expires_in");
	return missing.join(", ");
}
function formatTokenRequestError(operation, error, timeoutMs, signal) {
	if (signal?.aborted) return "Login cancelled";
	if (error instanceof Error && (error.name === "AbortError" || error.name === "TimeoutError")) return `OpenAI Codex token ${operation} timed out after ${timeoutMs}ms`;
	const detail = normalizeTokenErrorSummary(error instanceof Error ? error.message : String(error));
	return normalizeTokenErrorSummary(`OpenAI Codex token ${operation} error${detail ? `: ${detail}` : ""}`) ?? `OpenAI Codex token ${operation} error`;
}
async function postTokenForm(body, options = {}) {
	const timeoutMs = options.timeoutMs ?? TOKEN_REQUEST_TIMEOUT_MS;
	throwIfOAuthLoginAborted(options.signal);
	const { response, release } = await fetchWithSsrFGuard({
		url: TOKEN_URL,
		mode: "trusted_env_proxy",
		policy: OAUTH_TOKEN_SSRF_POLICY,
		init: {
			method: "POST",
			headers: { "Content-Type": "application/x-www-form-urlencoded" },
			body
		},
		timeoutMs,
		signal: options.signal,
		beforeRequest: options.assertCurrent,
		auditContext: "openai-chatgpt-oauth-token"
	});
	try {
		const responseBody = await readResponseWithLimit(response, OAUTH_TOKEN_RESPONSE_BODY_LIMIT_BYTES, { onOverflow: ({ size, maxBytes }) => /* @__PURE__ */ new Error(`OpenAI Codex OAuth token response body too large: ${size} bytes (limit: ${maxBytes} bytes)`) });
		return new Response(new Uint8Array(responseBody), {
			status: response.status,
			statusText: response.statusText,
			headers: response.headers
		});
	} finally {
		await release();
	}
}
async function readOpenAITokenResponse(response, operation, existingRefreshToken) {
	if (!response.ok) return buildTokenResponseFailure({
		response,
		operation,
		text: await response.text().catch(() => "")
	});
	let json;
	try {
		json = await response.json();
	} catch {
		return {
			type: "failed",
			operation,
			summary: `OpenAI Codex token ${operation} failed: response is not valid JSON`
		};
	}
	if (!isRecord(json)) return {
		type: "failed",
		operation,
		summary: `OpenAI Codex token ${operation} failed: expected JSON object response`
	};
	const expires = resolveOAuthTokenExpiresAt(json.expires_in);
	const refreshToken = json.refresh_token || existingRefreshToken;
	if (!json.access_token || !refreshToken || expires === void 0) return {
		type: "failed",
		operation,
		summary: `OpenAI Codex token ${operation} response missing fields: ${formatMissingTokenResponseFields(json, existingRefreshToken)}`
	};
	return {
		type: "success",
		access: json.access_token,
		refresh: refreshToken,
		expires
	};
}
async function exchangeOpenAIAuthorizationCode(code, verifier, redirectUri, options = {}) {
	const timeoutMs = options.timeoutMs ?? TOKEN_REQUEST_TIMEOUT_MS;
	let response;
	try {
		response = await postTokenForm(new URLSearchParams({
			grant_type: "authorization_code",
			client_id: CLIENT_ID,
			code,
			code_verifier: verifier,
			redirect_uri: redirectUri
		}), {
			...options,
			timeoutMs
		});
	} catch (error) {
		return {
			type: "failed",
			operation: "exchange",
			...options.signal?.aborted ? { cancelled: true } : {},
			summary: formatTokenRequestError("exchange", error, timeoutMs, options.signal)
		};
	}
	return await readOpenAITokenResponse(response, "exchange");
}
async function refreshOpenAIAccessToken(refreshToken, options = {}) {
	const timeoutMs = options.timeoutMs ?? TOKEN_REQUEST_TIMEOUT_MS;
	try {
		return await readOpenAITokenResponse(await postTokenForm(new URLSearchParams({
			grant_type: "refresh_token",
			refresh_token: refreshToken,
			client_id: CLIENT_ID
		}), {
			...options,
			timeoutMs
		}), "refresh", refreshToken);
	} catch (error) {
		return {
			type: "failed",
			operation: "refresh",
			...options.signal?.aborted ? { cancelled: true } : {},
			summary: formatTokenRequestError("refresh", error, timeoutMs, options.signal)
		};
	}
}
//#endregion
export { refreshOpenAIAccessToken as n, exchangeOpenAIAuthorizationCode as t };
