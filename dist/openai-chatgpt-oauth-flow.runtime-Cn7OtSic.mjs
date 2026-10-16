import { r as createLazyRuntimeModule } from "./lazy-runtime-CJrzFzqU.mjs";
import { n as oauthErrorHtml, r as oauthSuccessHtml } from "./oauth-page-CdAMKCs_.mjs";
import { i as resolveOpenAICodexAuthIdentity } from "./provider-openai-chatgpt-auth-fIvYFuQh.mjs";
import { a as parseOAuthAuthorizationInput, c as throwIfOAuthLoginAborted, l as withOAuthLoginAbort, n as createOAuthLoginCancelledError } from "./provider-oauth-runtime-B6eXjkVx.mjs";
import { n as resolveOpenAICallbackHost, r as resolveOpenAIRedirectUri, t as createOpenAIAuthorizationFlow } from "./openai-chatgpt-oauth-authorization.runtime.js";
import { n as refreshOpenAIAccessToken, t as exchangeOpenAIAuthorizationCode } from "./openai-chatgpt-oauth-token.runtime.js";
//#region extensions/openai/openai-chatgpt-oauth-flow.runtime.ts
const CALLBACK_HOST = resolveOpenAICallbackHost();
const REDIRECT_URI = resolveOpenAIRedirectUri(CALLBACK_HOST);
const MANUAL_PROMPT_FALLBACK_MS = 15e3;
const loadOAuthCallbackServer = createLazyRuntimeModule(() => import("./plugin-sdk/provider-auth-runtime.js").then(({ startProviderOAuthLoopbackCallbackServer }) => startProviderOAuthLoopbackCallbackServer));
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
