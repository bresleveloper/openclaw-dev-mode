import { r as createLazyRuntimeModule } from "./lazy-runtime-BPNHa36e.mjs";
import { i as resolveOpenAICodexAuthIdentity } from "./provider-openai-chatgpt-auth-2jKJupls.mjs";
import { a as oauthErrorHtml, d as withOAuthLoginAbort, n as createOAuthLoginCancelledError, o as oauthSuccessHtml, s as parseOAuthAuthorizationInput, u as throwIfOAuthLoginAborted } from "./provider-oauth-runtime-HklxkwLy.mjs";
import "./provider-auth-C_UP8nFt.mjs";
import { n as resolveOpenAICallbackHost, r as resolveOpenAIRedirectUri, t as createOpenAIAuthorizationFlow } from "./openai-chatgpt-oauth-authorization.runtime.js";
import { n as refreshOpenAIAccessToken, t as exchangeOpenAIAuthorizationCode } from "./openai-chatgpt-oauth-token.runtime.js";
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
	const accountId = resolveOpenAICodexAuthIdentity({ access: result.access }).accountId;
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
