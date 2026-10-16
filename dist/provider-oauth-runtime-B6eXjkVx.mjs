import { D as resolveExpiresAtMsFromDurationMs, F as resolveTimerTimeoutMs, T as positiveSecondsToSafeMilliseconds } from "./number-coercion-CuVhdCBs.mjs";
import { u as toErrorObject } from "./error-coercion-CvJK4lmH.mjs";
import { s as generatePkceVerifierChallenge } from "./provider-openai-chatgpt-auth-fIvYFuQh.mjs";
import { randomBytes } from "node:crypto";
//#region src/plugin-sdk/provider-oauth-runtime.ts
/** Generates an OAuth PKCE verifier and SHA-256 challenge using base64url encoding. */
async function generatePKCE() {
	return generatePkceVerifierChallenge();
}
/** Generates a random base64url OAuth state value for CSRF protection. */
function generateBase64UrlOAuthState() {
	return randomBytes(32).toString("base64url");
}
/**
* Parses callback URLs, raw query strings, `code#state`, or plain pasted codes.
* Empty input returns an empty object so callers can keep prompting.
*/
function parseOAuthAuthorizationInput(input) {
	const value = input.trim();
	if (!value) return {};
	try {
		const url = new URL(value);
		return {
			code: url.searchParams.get("code") ?? void 0,
			state: url.searchParams.get("state") ?? void 0
		};
	} catch {}
	if (value.includes("#")) {
		const [code, state] = value.split("#", 2);
		return {
			code,
			state
		};
	}
	if (value.includes("code=")) {
		const params = new URLSearchParams(value);
		return {
			code: params.get("code") ?? void 0,
			state: params.get("state") ?? void 0
		};
	}
	return { code: value };
}
/** Converts provider `expires_in` seconds into safe positive milliseconds. */
function resolveOAuthTokenLifetimeMs(value) {
	return positiveSecondsToSafeMilliseconds(value);
}
/** Resolves provider token lifetime into an absolute expiry timestamp with optional refresh skew. */
function resolveOAuthTokenExpiresAt(value, options = {}) {
	const lifetimeMs = resolveOAuthTokenLifetimeMs(value);
	return lifetimeMs === void 0 ? void 0 : resolveExpiresAtMsFromDurationMs(lifetimeMs, {
		nowMs: options.nowMs,
		bufferMs: options.refreshSkewMs
	});
}
/**
* Creates the shared cancellation error used by abortable OAuth login flows.
*/
function createOAuthLoginCancelledError() {
	return /* @__PURE__ */ new Error("Login cancelled");
}
/** Throws the shared OAuth cancellation error when a login signal is already aborted. */
function throwIfOAuthLoginAborted(signal) {
	if (signal?.aborted) throw createOAuthLoginCancelledError();
}
/** Races a pending OAuth login step against the login abort signal and normalizes rejections. */
function withOAuthLoginAbort(promise, signal, onAbort) {
	if (!signal) return promise;
	return new Promise((resolve, reject) => {
		const cleanup = () => {
			signal.removeEventListener("abort", abort);
		};
		const abort = () => {
			cleanup();
			onAbort?.();
			reject(createOAuthLoginCancelledError());
		};
		if (signal.aborted) {
			abort();
			return;
		}
		signal.addEventListener("abort", abort, { once: true });
		promise.then((value) => {
			cleanup();
			resolve(value);
		}, (error) => {
			cleanup();
			reject(toErrorObject(error, "Non-Error rejection"));
		});
	});
}
/** Combines a caller abort signal with a bounded timeout signal for OAuth HTTP requests. */
function buildOAuthRequestSignal(options) {
	const timeoutSignal = AbortSignal.timeout(resolveTimerTimeoutMs(options.timeoutMs, 0, 0));
	if (!options.signal) return timeoutSignal;
	return AbortSignal.any([options.signal, timeoutSignal]);
}
//#endregion
export { parseOAuthAuthorizationInput as a, throwIfOAuthLoginAborted as c, generatePKCE as i, withOAuthLoginAbort as l, createOAuthLoginCancelledError as n, resolveOAuthTokenExpiresAt as o, generateBase64UrlOAuthState as r, resolveOAuthTokenLifetimeMs as s, buildOAuthRequestSignal as t };
