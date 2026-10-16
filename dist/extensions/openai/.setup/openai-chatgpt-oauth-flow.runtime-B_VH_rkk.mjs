import { n as withOpenAIOAuthResponse, t as createOpenAIAuthorizationCodeForm } from "./openai-oauth-http.runtime-CYYBufQ-.mjs";
import { asOptionalRecord, isRecord, normalizeBoundedOptionalString, normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
import { createOAuthLoginCancelledError, generatePKCE, oauthErrorHtml, oauthSuccessHtml, parseOAuthAuthorizationInput, resolveOAuthTokenExpiresAt, resolveOAuthTokenLifetimeMs, resolveOpenAICodexAuthIdentity, throwIfOAuthLoginAborted, withOAuthLoginAbort } from "openclaw/plugin-sdk/provider-oauth-runtime";
import { readResponseWithLimit } from "openclaw/plugin-sdk/response-limit-runtime";
import { createLazyRuntimeModule } from "openclaw/plugin-sdk/lazy-runtime";
import { redactSensitiveText } from "openclaw/plugin-sdk/security-runtime";
//#region extensions/openai/openai-chatgpt-oauth-authorization.runtime.ts
const CLIENT_ID$1 = "app_EMoamEEZ73f0CkXaXp7hrann";
const AUTHORIZE_URL = "https://auth.openai.com/oauth/authorize";
const CALLBACK_PORT = 1455;
const CALLBACK_PATH = "/auth/callback";
const DEFAULT_CALLBACK_HOST = "localhost";
const LOOPBACK_CALLBACK_HOSTS = /* @__PURE__ */ new Set([
	"localhost",
	"127.0.0.1",
	"::1"
]);
const SCOPE = "openid profile email offline_access";
const loadNodeCrypto = createLazyRuntimeModule(() => import("node:crypto").then((cryptoModule) => cryptoModule.randomBytes));
function resolveOpenAICallbackHost(env = process.env) {
	const host = env.OPENCLAW_OAUTH_CALLBACK_HOST?.trim() || DEFAULT_CALLBACK_HOST;
	if (!LOOPBACK_CALLBACK_HOSTS.has(host)) throw new Error("OpenAI Codex OAuth callback host must be localhost, 127.0.0.1, or ::1");
	return host;
}
function resolveOpenAIRedirectUri(host) {
	const url = new URL(`http://${host === "::1" ? "[::1]" : host}:${CALLBACK_PORT}`);
	url.pathname = CALLBACK_PATH;
	return url.toString();
}
async function createOpenAIAuthorizationFlow(originator, redirectUri) {
	if (typeof process === "undefined" || !process.versions?.node && !process.versions?.bun) throw new Error("OpenAI Codex OAuth is only available in Node.js environments");
	const [{ verifier, challenge }, randomBytes] = await Promise.all([generatePKCE(), loadNodeCrypto()]);
	const state = randomBytes(16).toString("hex");
	const url = new URL(AUTHORIZE_URL);
	url.searchParams.set("response_type", "code");
	url.searchParams.set("client_id", CLIENT_ID$1);
	url.searchParams.set("redirect_uri", redirectUri);
	url.searchParams.set("scope", SCOPE);
	url.searchParams.set("code_challenge", challenge);
	url.searchParams.set("code_challenge_method", "S256");
	url.searchParams.set("state", state);
	url.searchParams.set("id_token_add_organizations", "true");
	url.searchParams.set("codex_cli_simplified_flow", "true");
	url.searchParams.set("originator", originator);
	return {
		verifier,
		redirectUri,
		state,
		url: url.toString()
	};
}
//#endregion
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
async function requestOpenAIToken(body, operation, options = {}, existingRefreshToken) {
	const timeoutMs = options.timeoutMs ?? TOKEN_REQUEST_TIMEOUT_MS;
	try {
		throwIfOAuthLoginAborted(options.signal);
		const { response: tokenResponse, text } = await withOpenAIOAuthResponse({
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
		}, async (response) => {
			const bytes = await readResponseWithLimit(response, OAUTH_TOKEN_RESPONSE_BODY_LIMIT_BYTES, { onOverflow: ({ size, maxBytes }) => /* @__PURE__ */ new Error(`OpenAI Codex OAuth token response body too large: ${size} bytes (limit: ${maxBytes} bytes)`) });
			return {
				response,
				text: new TextDecoder().decode(bytes)
			};
		});
		return readOpenAITokenResponse(tokenResponse, text, operation, existingRefreshToken);
	} catch (error) {
		return {
			type: "failed",
			operation,
			...options.signal?.aborted ? { cancelled: true } : {},
			summary: formatTokenRequestError(operation, error, timeoutMs, options.signal)
		};
	}
}
function readOpenAITokenResponse(response, text, operation, existingRefreshToken) {
	if (!response.ok) return buildTokenResponseFailure({
		response,
		operation,
		text
	});
	let json;
	try {
		json = JSON.parse(text);
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
	return await requestOpenAIToken(createOpenAIAuthorizationCodeForm({
		clientId: CLIENT_ID,
		code,
		verifier,
		redirectUri
	}), "exchange", options);
}
async function refreshOpenAIAccessToken(refreshToken, options = {}) {
	return await requestOpenAIToken(new URLSearchParams({
		grant_type: "refresh_token",
		refresh_token: refreshToken,
		client_id: CLIENT_ID
	}), "refresh", options, refreshToken);
}
//#endregion
//#region extensions/openai/openai-chatgpt-oauth-flow.runtime.ts
const CALLBACK_HOST = resolveOpenAICallbackHost();
const REDIRECT_URI = resolveOpenAIRedirectUri(CALLBACK_HOST);
const MANUAL_PROMPT_FALLBACK_MS = 15e3;
const loadOAuthCallbackServer = createLazyRuntimeModule(() => import("openclaw/plugin-sdk/provider-auth-runtime").then(({ startProviderOAuthLoopbackCallbackServer }) => startProviderOAuthLoopbackCallbackServer));
function waitForManualPromptFallback(signal) {
	return new Promise((resolve, reject) => {
		if (signal?.aborted) {
			reject(createOAuthLoginCancelledError());
			return;
		}
		const cleanup = () => {
			signal?.removeEventListener("abort", abort);
		};
		const abort = () => {
			clearTimeout(timeout);
			cleanup();
			reject(createOAuthLoginCancelledError());
		};
		const timeout = setTimeout(() => {
			cleanup();
			resolve(null);
		}, MANUAL_PROMPT_FALLBACK_MS);
		signal?.addEventListener("abort", abort, { once: true });
		timeout.unref?.();
	});
}
function parseAuthorizationCode(input, state) {
	const parsed = parseOAuthAuthorizationInput(input);
	if (parsed.state && parsed.state !== state) throw new Error("State mismatch");
	return parsed.code;
}
async function promptForAuthorizationCode(onPrompt, state) {
	return parseAuthorizationCode(await onPrompt({ message: "Paste the authorization code (or full redirect URL):" }), state);
}
function resolveOpenAICredentials(result) {
	if (result.type !== "success") {
		if (result.cancelled) throw createOAuthLoginCancelledError();
		const facts = [
			result.status ? `HTTP ${result.status}` : void 0,
			result.code ? `code=${result.code}` : void 0,
			result.errorType ? `type=${result.errorType}` : void 0
		].filter((value) => Boolean(value));
		const diagnostic = facts.length > 0 ? `OpenAI Codex token ${result.operation} failed (${facts.join("; ")}).` : void 0;
		throw Object.assign(new Error([result.summary, diagnostic].filter(Boolean).join("\n\n")), { oauthRefreshFailure: {
			summary: result.summary,
			...result.errorType ? { errorType: result.errorType } : {},
			...result.reason ? { reason: result.reason } : {},
			...result.status ? { status: result.status } : {}
		} });
	}
	const accountId = resolveOpenAICodexAuthIdentity({ access: result.access }).accountId;
	if (!accountId) throw new Error("Failed to extract accountId from token");
	return {
		access: result.access,
		refresh: result.refresh,
		expires: result.expires,
		accountId
	};
}
async function loginOpenAICodex(options) {
	options.assertCurrent?.();
	throwIfOAuthLoginAborted(options.signal);
	const { verifier, redirectUri, state, url } = await createOpenAIAuthorizationFlow(options.originator ?? "openclaw", REDIRECT_URI);
	const startCallbackServer = await loadOAuthCallbackServer();
	options.assertCurrent?.();
	throwIfOAuthLoginAborted(options.signal);
	let server;
	try {
		server = await startCallbackServer({
			redirectUrl: REDIRECT_URI,
			expectedState: state,
			bindOnlyHostname: CALLBACK_HOST,
			signal: options.signal,
			renderSuccess: () => ({
				body: oauthSuccessHtml("OpenAI authentication completed. You can close this window."),
				contentType: "text/html; charset=utf-8"
			}),
			renderError: (message) => ({
				body: oauthErrorHtml(message),
				contentType: "text/html; charset=utf-8"
			})
		});
	} catch {
		options.assertCurrent?.();
		throwIfOAuthLoginAborted(options.signal);
	}
	let cancelWait;
	const cancelledWait = new Promise((resolve) => {
		cancelWait = () => resolve(null);
	});
	let code;
	try {
		options.assertCurrent?.();
		throwIfOAuthLoginAborted(options.signal);
		await withOAuthLoginAbort(Promise.resolve(options.onAuth({
			url,
			instructions: "A browser window should open. Complete login to finish."
		})), options.signal, cancelWait);
		throwIfOAuthLoginAborted(options.signal);
		const callbackPromise = Promise.race([server ? server.waitForCallback().then((result) => {
			if (result.type === "oauth_error") throw new Error("OpenAI authorization was not completed.");
			return { code: result.code };
		}) : Promise.resolve(null), cancelledWait]);
		callbackPromise.catch(() => void 0);
		if (options.onManualCodeInput) {
			let manualCode;
			let manualError;
			const manualPromise = options.onManualCodeInput().then((input) => {
				manualCode = input;
				cancelWait();
			}).catch((err) => {
				manualError = err instanceof Error ? err : new Error(String(err));
				cancelWait();
			});
			const result = await withOAuthLoginAbort(callbackPromise, options.signal, cancelWait);
			if (!result?.code && !manualCode && !manualError) await withOAuthLoginAbort(manualPromise, options.signal, cancelWait);
			if (manualError) throw manualError;
			if (result?.code) code = result.code;
			else if (manualCode) code = parseAuthorizationCode(manualCode, state);
		} else {
			const result = await withOAuthLoginAbort(Promise.race([callbackPromise, waitForManualPromptFallback(options.signal)]), options.signal, cancelWait);
			if (result?.code) code = result.code;
			else {
				const promptCodePromise = promptForAuthorizationCode(options.onPrompt, state).then((promptCode) => {
					cancelWait();
					return promptCode;
				});
				code = await withOAuthLoginAbort(Promise.race([callbackPromise.then((callback) => callback?.code), promptCodePromise]), options.signal, cancelWait);
			}
		}
		if (!code) code = await withOAuthLoginAbort(promptForAuthorizationCode(options.onPrompt, state), options.signal, cancelWait);
		if (!code) throw new Error("Missing authorization code");
		return resolveOpenAICredentials(await exchangeOpenAIAuthorizationCode(code, verifier, redirectUri, {
			signal: options.signal,
			assertCurrent: options.assertCurrent
		}));
	} finally {
		await server?.close();
	}
}
async function refreshOpenAICodexToken(refreshToken) {
	return resolveOpenAICredentials(await refreshOpenAIAccessToken(refreshToken));
}
//#endregion
export { refreshOpenAICodexToken as n, loginOpenAICodex as t };
