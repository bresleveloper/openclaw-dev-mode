import { C as resolveExpiresAtMsFromDurationMs, j as resolveTimerTimeoutMs, x as positiveSecondsToSafeMilliseconds } from "./number-coercion-CJQ8TR--.js";
//#region src/plugin-sdk/provider-oauth-runtime.ts
const LOGO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" aria-hidden="true"><path fill="#fff" fill-rule="evenodd" d="M165.29 165.29 H517.36 V400 H400 V517.36 H282.65 V634.72 H165.29 Z M282.65 282.65 V400 H400 V282.65 Z"/><path fill="#fff" d="M517.36 400 H634.72 V634.72 H517.36 Z"/></svg>`;
function escapeHtml(value) {
	return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll("\"", "&quot;").replaceAll("'", "&#39;");
}
function renderOAuthPage(options) {
	const title = escapeHtml(options.title);
	const heading = escapeHtml(options.heading);
	const message = escapeHtml(options.message);
	const details = options.details ? escapeHtml(options.details) : void 0;
	return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${title}</title>
  <style>
    :root {
      --text: #fafafa;
      --text-dim: #a1a1aa;
      --page-bg: #09090b;
      --font-sans: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
      --font-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
    }
    * { box-sizing: border-box; }
    html { color-scheme: dark; }
    body {
      margin: 0;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
      background: var(--page-bg);
      color: var(--text);
      font-family: var(--font-sans);
      text-align: center;
    }
    main {
      width: 100%;
      max-width: 560px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
    .logo {
      width: 72px;
      height: 72px;
      display: block;
      margin-bottom: 24px;
    }
    h1 {
      margin: 0 0 10px;
      font-size: 28px;
      line-height: 1.15;
      font-weight: 650;
      color: var(--text);
    }
    p {
      margin: 0;
      line-height: 1.7;
      color: var(--text-dim);
      font-size: 15px;
    }
    .details {
      margin-top: 16px;
      font-family: var(--font-mono);
      font-size: 13px;
      color: var(--text-dim);
      white-space: pre-wrap;
      word-break: break-word;
    }
  </style>
</head>
<body>
  <main>
    <div class="logo">${LOGO_SVG}</div>
    <h1>${heading}</h1>
    <p>${message}</p>
    ${details ? `<div class="details">${details}</div>` : ""}
  </main>
</body>
</html>`;
}
/**
* Renders the local OAuth callback success page after provider authentication completes.
*/
function oauthSuccessHtml(message) {
	return renderOAuthPage({
		title: "Authentication successful",
		heading: "Authentication successful",
		message
	});
}
/**
* Renders the local OAuth callback error page without exposing raw credential material.
*/
function oauthErrorHtml(message, details) {
	return renderOAuthPage({
		title: "Authentication failed",
		heading: "Authentication failed",
		message,
		details
	});
}
function base64urlEncode(bytes) {
	let binary = "";
	for (const byte of bytes) binary += String.fromCharCode(byte);
	return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/[=]/g, "");
}
/** Generates an OAuth PKCE verifier and SHA-256 challenge using base64url encoding. */
async function generatePKCE() {
	const verifierBytes = new Uint8Array(32);
	crypto.getRandomValues(verifierBytes);
	const verifier = base64urlEncode(verifierBytes);
	const data = new TextEncoder().encode(verifier);
	const hashBuffer = await crypto.subtle.digest("SHA-256", data);
	return {
		verifier,
		challenge: base64urlEncode(new Uint8Array(hashBuffer))
	};
}
/** Generates a random base64url OAuth state value for CSRF protection. */
function generateOAuthState() {
	const stateBytes = new Uint8Array(32);
	crypto.getRandomValues(stateBytes);
	return base64urlEncode(stateBytes);
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
			reject(toLintErrorObject(error, "Non-Error rejection"));
		});
	});
}
/** Combines a caller abort signal with a bounded timeout signal for OAuth HTTP requests. */
function buildOAuthRequestSignal(options) {
	const timeoutSignal = AbortSignal.timeout(resolveTimerTimeoutMs(options.timeoutMs, 0, 0));
	if (!options.signal) return timeoutSignal;
	return AbortSignal.any([options.signal, timeoutSignal]);
}
function toLintErrorObject(value, fallbackMessage) {
	if (value instanceof Error) return value;
	if (typeof value === "string") return new Error(value);
	const error = new Error(fallbackMessage, { cause: value });
	if (typeof value === "object" && value !== null || typeof value === "function") Object.assign(error, value);
	return error;
}
//#endregion
export { oauthErrorHtml as a, resolveOAuthTokenExpiresAt as c, withOAuthLoginAbort as d, generatePKCE as i, resolveOAuthTokenLifetimeMs as l, createOAuthLoginCancelledError as n, oauthSuccessHtml as o, generateOAuthState as r, parseOAuthAuthorizationInput as s, buildOAuthRequestSignal as t, throwIfOAuthLoginAborted as u };
