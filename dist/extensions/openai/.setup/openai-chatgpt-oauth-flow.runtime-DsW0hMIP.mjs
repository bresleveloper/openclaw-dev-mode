import { asOptionalRecord, isRecord, normalizeBoundedOptionalString, normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
import { createOAuthLoginCancelledError, generatePKCE, oauthErrorHtml, oauthSuccessHtml, parseOAuthAuthorizationInput, resolveOAuthTokenExpiresAt, resolveOAuthTokenLifetimeMs, throwIfOAuthLoginAborted, withOAuthLoginAbort } from "openclaw/plugin-sdk/provider-oauth-runtime";
import { readResponseWithLimit } from "openclaw/plugin-sdk/response-limit-runtime";
import { resolveOpenAICodexAuthIdentity as resolveOpenAICodexAuthIdentity$1 } from "openclaw/plugin-sdk/provider-auth";
import { fetchWithSsrFGuard } from "openclaw/plugin-sdk/ssrf-runtime";
import { createLazyRuntimeModule } from "openclaw/plugin-sdk/lazy-runtime";
import { redactSensitiveText } from "openclaw/plugin-sdk/security-runtime";
//#region extensions/openai/openai-chatgpt-oauth-authorization.runtime.ts
const CLIENT_ID$1 = "app_EMoamEEZ73f0CkXaXp7hrann";
const AUTHORIZE_URL = "https://auth.openai.com/oauth/authorize";
const CALLBACK_PORT$1 = 1455;
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
	const url = new URL(`http://${host === "::1" ? "[::1]" : host}:${CALLBACK_PORT$1}`);
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
//#region extensions/openai/openai-chatgpt-oauth-flow.runtime.ts
/**
* OpenAI Codex (ChatGPT OAuth) flow
*
* NOTE: This module uses Node.js crypto and http for the OAuth callback.
* It is only intended for CLI use, not browser environments.
*/
const CALLBACK_PORT = 1455;
const CALLBACK_HOST = resolveOpenAICallbackHost();
const REDIRECT_URI = resolveOpenAIRedirectUri(CALLBACK_HOST);
const MANUAL_PROMPT_FALLBACK_MS = 15e3;
const loadNodeOAuthHttp = createLazyRuntimeModule(() => import("node:http"));
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
function sendOAuthHtmlResponse(res, statusCode, html) {
	res.statusCode = statusCode;
	res.setHeader("Connection", "close");
	res.setHeader("Content-Type", "text/html; charset=utf-8");
	res.end(html);
}
async function startLocalOAuthServer(state, assertCurrent) {
	const http = await loadNodeOAuthHttp();
	assertCurrent?.();
	let settleWait;
	const waitForCodePromise = new Promise((resolve) => {
		settleWait = resolve;
	});
	const server = http.createServer((req, res) => {
		try {
			const url = new URL(req.url || "", "http://localhost");
			if (url.pathname !== "/auth/callback") {
				sendOAuthHtmlResponse(res, 404, oauthErrorHtml("Callback route not found."));
				return;
			}
			if (url.searchParams.get("state") !== state) {
				sendOAuthHtmlResponse(res, 400, oauthErrorHtml("State mismatch."));
				return;
			}
			const code = url.searchParams.get("code");
			if (!code) {
				sendOAuthHtmlResponse(res, 400, oauthErrorHtml("Missing authorization code."));
				return;
			}
			sendOAuthHtmlResponse(res, 200, oauthSuccessHtml("OpenAI authentication completed. You can close this window."));
			settleWait?.({ code });
		} catch {
			sendOAuthHtmlResponse(res, 500, oauthErrorHtml("Internal error while processing OAuth callback."));
		}
	});
	return new Promise((resolve) => {
		server.listen(CALLBACK_PORT, CALLBACK_HOST, () => {
			resolve({
				close: () => {
					server.close();
					server.closeAllConnections();
				},
				cancelWait: () => {
					settleWait?.(null);
				},
				waitForCode: () => waitForCodePromise
			});
		}).on("error", () => {
			settleWait?.(null);
			resolve({
				close: () => {
					try {
						server.close();
					} catch {}
				},
				cancelWait: () => {},
				waitForCode: async () => null
			});
		});
	});
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
	const accountId = resolveOpenAICodexAuthIdentity$1({ access: result.access }).accountId;
	if (!accountId) throw new Error("Failed to extract accountId from token");
	return {
		access: result.access,
		refresh: result.refresh,
		expires: result.expires,
		accountId
	};
}
/**
* Login with OpenAI Codex OAuth
*
* @param options.onAuth - Called with URL and instructions when auth starts
* @param options.onPrompt - Called to prompt user for manual code paste (fallback if no onManualCodeInput)
* @param options.onProgress - Optional progress messages
* @param options.onManualCodeInput - Optional promise that resolves with user-pasted code.
*                                    Races with browser callback - whichever completes first wins.
*                                    Useful for showing paste input immediately alongside browser flow.
* @param options.originator - OAuth originator parameter (defaults to "openclaw")
*/
async function loginOpenAICodex(options) {
	options.assertCurrent?.();
	throwIfOAuthLoginAborted(options.signal);
	const { verifier, redirectUri, state, url } = await createOpenAIAuthorizationFlow(options.originator ?? "openclaw", REDIRECT_URI);
	const server = await startLocalOAuthServer(state, options.assertCurrent);
	let code;
	try {
		options.assertCurrent?.();
		throwIfOAuthLoginAborted(options.signal);
		await withOAuthLoginAbort(Promise.resolve(options.onAuth({
			url,
			instructions: "A browser window should open. Complete login to finish."
		})), options.signal, server.cancelWait);
		throwIfOAuthLoginAborted(options.signal);
		if (options.onManualCodeInput) {
			let manualCode;
			let manualError;
			const manualPromise = options.onManualCodeInput().then((input) => {
				manualCode = input;
				server.cancelWait();
			}).catch((err) => {
				manualError = err instanceof Error ? err : new Error(String(err));
				server.cancelWait();
			});
			const result = await withOAuthLoginAbort(server.waitForCode(), options.signal, server.cancelWait);
			if (!result?.code && !manualCode && !manualError) await withOAuthLoginAbort(manualPromise, options.signal, server.cancelWait);
			if (manualError) throw manualError;
			if (result?.code) code = result.code;
			else if (manualCode) code = parseAuthorizationCode(manualCode, state);
		} else {
			const callbackPromise = server.waitForCode();
			const result = await withOAuthLoginAbort(Promise.race([callbackPromise, waitForManualPromptFallback(options.signal)]), options.signal, server.cancelWait);
			if (result?.code) code = result.code;
			else {
				const promptCodePromise = promptForAuthorizationCode(options.onPrompt, state).then((promptCode) => {
					server.cancelWait();
					return promptCode;
				});
				code = await withOAuthLoginAbort(Promise.race([callbackPromise.then((callback) => callback?.code), promptCodePromise]), options.signal, server.cancelWait);
			}
		}
		if (!code) code = await withOAuthLoginAbort(promptForAuthorizationCode(options.onPrompt, state), options.signal, server.cancelWait);
		if (!code) throw new Error("Missing authorization code");
		return resolveOpenAICredentials(await exchangeOpenAIAuthorizationCode(code, verifier, redirectUri, {
			signal: options.signal,
			assertCurrent: options.assertCurrent
		}));
	} finally {
		server.close();
	}
}
/**
* Refresh OpenAI Codex OAuth token
*/
async function refreshOpenAICodexToken(refreshToken) {
	return resolveOpenAICredentials(await refreshOpenAIAccessToken(refreshToken));
}
//#endregion
export { refreshOpenAICodexToken as n, loginOpenAICodex as t };
