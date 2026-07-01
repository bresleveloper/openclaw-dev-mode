import { i as formatErrorMessage } from "./errors-DCRXIYSQ.js";
import { h as readResponseTextLimited } from "./provider-http-errors-DLfoTBpx.js";
import "./error-runtime-Ck1CsJM-.js";
import { n as buildApiKeyCredential } from "./provider-auth-helpers-sTwxNMVI.js";
import { l as generatePkceVerifierChallenge } from "./provider-auth-DKbeFxjY.js";
import { n as generateOAuthState } from "./provider-auth-runtime-BHIzEsu_.js";
import "./provider-http-B13K4lug.js";
import { n as applyOpenrouterConfig, t as OPENROUTER_DEFAULT_MODEL_REF } from "./onboard-Bwp44C3C.js";
import { createServer } from "node:http";
//#region extensions/openrouter/oauth.ts
const PROVIDER_ID = "openrouter";
const OPENROUTER_OAUTH_METHOD_ID = "oauth";
const OPENROUTER_OAUTH_CHOICE_ID = "openrouter-oauth";
const OPENROUTER_OAUTH_AUTHORIZE_URL = "https://openrouter.ai/auth";
const OPENROUTER_OAUTH_TOKEN_URL = "https://openrouter.ai/api/v1/auth/keys";
const OPENROUTER_OAUTH_CALLBACK_HOST = "localhost";
const OPENROUTER_OAUTH_CALLBACK_PORT = 3e3;
const OPENROUTER_OAUTH_CALLBACK_PATH = "/openrouter-oauth/callback";
const OPENROUTER_OAUTH_REDIRECT_URI = `http://${OPENROUTER_OAUTH_CALLBACK_HOST}:${OPENROUTER_OAUTH_CALLBACK_PORT}${OPENROUTER_OAUTH_CALLBACK_PATH}`;
const OPENROUTER_OAUTH_CODE_CHALLENGE_METHOD = "S256";
const OPENROUTER_OAUTH_TIMEOUT_MS = 300 * 1e3;
const OPENROUTER_OAUTH_FETCH_TIMEOUT_MS = 30 * 1e3;
const OPENROUTER_OAUTH_ERROR_BODY_LIMIT_BYTES = 8 * 1024;
const OPENROUTER_OAUTH_PROFILE_ID = "openrouter:default";
function isRecord(value) {
	return value !== null && typeof value === "object" && !Array.isArray(value);
}
function readString(value) {
	return typeof value === "string" && value.trim().length > 0 ? value.trim() : void 0;
}
function extractOpenRouterError(value) {
	if (typeof value === "string") return value.trim() || void 0;
	if (!isRecord(value)) return;
	const direct = readString(value.message) ?? readString(value.error_description);
	if (direct) return direct;
	const error = value.error;
	if (typeof error === "string") return error.trim() || void 0;
	if (isRecord(error)) return readString(error.message) ?? readString(error.code);
}
async function readResponseBody(response) {
	const text = response.ok ? await response.text() : await readResponseTextLimited(response, OPENROUTER_OAUTH_ERROR_BODY_LIMIT_BYTES).catch(() => "");
	if (!text.trim()) return null;
	try {
		return JSON.parse(text);
	} catch {
		return text;
	}
}
function parseOpenRouterKeyResponse(value) {
	if (!isRecord(value)) throw new Error("OpenRouter OAuth key exchange returned an unexpected response.");
	const key = readString(value.key);
	if (!key) throw new Error("OpenRouter OAuth key exchange returned no API key.");
	const userId = readString(value.user_id) ?? readString(value.userId);
	return {
		key,
		...userId ? { userId } : {}
	};
}
function buildOpenRouterOAuthRedirectUri(params) {
	const url = new URL(OPENROUTER_OAUTH_REDIRECT_URI);
	url.searchParams.set("state", params.state);
	return url.toString();
}
function buildOpenRouterOAuthAuthorizeUrl(params) {
	const url = new URL(OPENROUTER_OAUTH_AUTHORIZE_URL);
	url.searchParams.set("callback_url", buildOpenRouterOAuthRedirectUri({ state: params.state }));
	url.searchParams.set("code_challenge", params.codeChallenge);
	url.searchParams.set("code_challenge_method", OPENROUTER_OAUTH_CODE_CHALLENGE_METHOD);
	return url.toString();
}
function requireOpenRouterOAuthState(state, expectedState) {
	if (!state) throw new Error("Missing OpenRouter OAuth state. Paste the full redirect URL.");
	if (state !== expectedState) throw new Error("OpenRouter OAuth state mismatch. Please retry login.");
	return state;
}
function parseOpenRouterOAuthCallbackInput(input, expectedState) {
	const trimmed = input.trim();
	if (!trimmed) throw new Error("No input provided.");
	const parseParams = (params) => {
		const code = readString(params.get("code"));
		if (!code) throw new Error("Missing 'code' parameter in redirect URL.");
		return {
			code,
			state: requireOpenRouterOAuthState(readString(params.get("state")), expectedState)
		};
	};
	try {
		return parseParams(new URL(trimmed).searchParams);
	} catch (err) {
		if (err instanceof TypeError) {
			if (trimmed.includes("code=")) return parseParams(new URLSearchParams(trimmed));
			throw new Error("Paste the full OpenRouter redirect URL, not just the code.", { cause: err });
		}
		throw err;
	}
}
async function exchangeOpenRouterOAuthCode(params) {
	const response = await (params.fetchImpl ?? fetch)(OPENROUTER_OAUTH_TOKEN_URL, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Accept: "application/json"
		},
		body: JSON.stringify({
			code: params.code,
			code_verifier: params.codeVerifier,
			code_challenge_method: OPENROUTER_OAUTH_CODE_CHALLENGE_METHOD
		}),
		signal: AbortSignal.timeout(OPENROUTER_OAUTH_FETCH_TIMEOUT_MS)
	});
	const body = await readResponseBody(response);
	if (!response.ok) {
		const message = extractOpenRouterError(body);
		throw new Error(`OpenRouter OAuth key exchange failed (${response.status})${message ? `: ${message}` : ""}`);
	}
	return parseOpenRouterKeyResponse(body);
}
async function waitForOpenRouterOAuthCallback(params) {
	const timeoutMs = params.timeoutMs ?? OPENROUTER_OAUTH_TIMEOUT_MS;
	return new Promise((resolve, reject) => {
		let settled = false;
		const timeout = setTimeout(() => {
			finish(/* @__PURE__ */ new Error("OpenRouter OAuth callback timeout"));
		}, timeoutMs);
		const server = createServer((req, res) => {
			try {
				const requestUrl = new URL(req.url ?? "/", `http://${OPENROUTER_OAUTH_CALLBACK_HOST}:${OPENROUTER_OAUTH_CALLBACK_PORT}`);
				if (requestUrl.pathname !== "/openrouter-oauth/callback") {
					res.statusCode = 404;
					res.setHeader("Content-Type", "text/plain");
					res.end("Not found");
					return;
				}
				if (req.method !== "GET") {
					res.statusCode = 405;
					res.setHeader("Allow", "GET");
					res.setHeader("Content-Type", "text/plain");
					res.end("Method not allowed");
					return;
				}
				const error = readString(requestUrl.searchParams.get("error"));
				if (error) {
					res.statusCode = 400;
					res.setHeader("Content-Type", "text/plain");
					res.end(`OpenRouter authentication failed: ${error}`);
					finish(/* @__PURE__ */ new Error(`OpenRouter OAuth error: ${error}`));
					return;
				}
				const code = readString(requestUrl.searchParams.get("code"));
				if (!code) {
					res.statusCode = 400;
					res.setHeader("Content-Type", "text/plain");
					res.end("Missing OAuth code");
					finish(/* @__PURE__ */ new Error("Missing OpenRouter OAuth code"));
					return;
				}
				const state = readString(requestUrl.searchParams.get("state"));
				try {
					requireOpenRouterOAuthState(state, params.expectedState);
				} catch (err) {
					res.statusCode = 400;
					res.setHeader("Content-Type", "text/plain");
					res.end("Invalid OAuth state");
					finish(err instanceof Error ? err : /* @__PURE__ */ new Error("OpenRouter OAuth state mismatch"));
					return;
				}
				res.statusCode = 200;
				res.setHeader("Content-Type", "text/html; charset=utf-8");
				res.end("<!doctype html><html><head><meta charset='utf-8'/></head><body><h2>OpenRouter OAuth complete</h2><p>You can close this window and return to OpenClaw.</p></body></html>");
				finish(void 0, {
					code,
					state: params.expectedState
				});
			} catch (err) {
				finish(err instanceof Error ? err : /* @__PURE__ */ new Error("OpenRouter OAuth callback failed"));
			}
		});
		const finish = (err, result) => {
			if (settled) return;
			settled = true;
			if (timeout) clearTimeout(timeout);
			try {
				server.close();
			} catch {}
			if (err) {
				reject(err);
				return;
			}
			if (result) resolve(result);
		};
		server.once("error", (err) => {
			finish(err instanceof Error ? err : /* @__PURE__ */ new Error("OpenRouter OAuth callback server error"));
		});
		server.listen(OPENROUTER_OAUTH_CALLBACK_PORT, OPENROUTER_OAUTH_CALLBACK_HOST, () => {
			params.onProgress?.(`Waiting for OpenRouter OAuth callback on ${OPENROUTER_OAUTH_REDIRECT_URI}...`);
		});
	});
}
async function promptForOpenRouterRedirect(ctx, expectedState) {
	return parseOpenRouterOAuthCallbackInput(await ctx.prompter.text({
		message: "Paste the OpenRouter redirect URL",
		placeholder: `${OPENROUTER_OAUTH_REDIRECT_URI}?state=...&code=...`,
		validate: (value) => value.trim().length > 0 ? void 0 : "Required"
	}), expectedState).code;
}
async function resolveOpenRouterOAuthCode(ctx, params) {
	await ctx.prompter.note(ctx.isRemote ? [
		"Open this URL in your LOCAL browser.",
		"After signing in, paste the redirect URL back here.",
		"",
		`Redirect URI: ${OPENROUTER_OAUTH_REDIRECT_URI}`
	].join("\n") : [
		"Browser will open for OpenRouter authentication.",
		"If the callback does not auto-complete, paste the redirect URL.",
		"",
		`Redirect URI: ${OPENROUTER_OAUTH_REDIRECT_URI}`
	].join("\n"), "OpenRouter OAuth");
	if (ctx.isRemote) {
		ctx.runtime.log(`\nOpen this URL in your LOCAL browser:\n\n${params.authorizeUrl}\n`);
		return await promptForOpenRouterRedirect(ctx, params.state);
	}
	const callbackPromise = params.waitForCallback({
		expectedState: params.state,
		onProgress: params.onProgress
	}).catch(async () => {
		params.onProgress("OAuth callback not detected; waiting for redirect URL...");
		return {
			code: await promptForOpenRouterRedirect(ctx, params.state),
			state: params.state
		};
	});
	callbackPromise.catch(() => void 0);
	try {
		await ctx.openUrl(params.authorizeUrl);
		ctx.runtime.log(`Open: ${params.authorizeUrl}`);
	} catch {
		ctx.runtime.log(`Open manually: ${params.authorizeUrl}`);
	}
	return (await callbackPromise).code;
}
async function loginOpenRouterOAuth(ctx, options = {}) {
	const progress = ctx.prompter.progress("Starting OpenRouter OAuth...");
	try {
		const pkce = options.createPkce?.() ?? generatePkceVerifierChallenge();
		const state = options.createState?.() ?? generateOAuthState();
		const code = await resolveOpenRouterOAuthCode(ctx, {
			authorizeUrl: buildOpenRouterOAuthAuthorizeUrl({
				codeChallenge: pkce.challenge,
				state
			}),
			state,
			waitForCallback: options.waitForCallback ?? waitForOpenRouterOAuthCallback,
			onProgress: (message) => progress.update(message)
		});
		progress.update("Exchanging OpenRouter OAuth code...");
		const token = await exchangeOpenRouterOAuthCode({
			code,
			codeVerifier: pkce.verifier,
			fetchImpl: options.fetchImpl
		});
		progress.stop("OpenRouter OAuth complete");
		const metadata = {
			authFlow: "oauth-pkce",
			...token.userId ? { userId: token.userId } : {}
		};
		return {
			profiles: [{
				profileId: OPENROUTER_OAUTH_PROFILE_ID,
				credential: {
					...buildApiKeyCredential(PROVIDER_ID, token.key, metadata),
					displayName: token.userId ? `OpenRouter ${token.userId}` : "OpenRouter OAuth"
				}
			}],
			configPatch: applyOpenrouterConfig(ctx.config),
			defaultModel: OPENROUTER_DEFAULT_MODEL_REF,
			notes: ["OpenRouter OAuth issued an OpenRouter API key and stored it in the default OpenRouter auth profile.", "Re-run OpenRouter OAuth to rotate that key or use the API-key setup path for a key you manage manually."]
		};
	} catch (err) {
		progress.stop("OpenRouter OAuth failed");
		throw new Error(`OpenRouter OAuth failed: ${formatErrorMessage(err)}`, { cause: err });
	}
}
function createOpenRouterOAuthAuthMethod() {
	return {
		id: OPENROUTER_OAUTH_METHOD_ID,
		label: "OpenRouter OAuth",
		hint: "Browser sign-in",
		kind: "oauth",
		wizard: {
			choiceId: OPENROUTER_OAUTH_CHOICE_ID,
			choiceLabel: "OpenRouter OAuth",
			choiceHint: "Browser sign-in",
			groupId: PROVIDER_ID,
			groupLabel: "OpenRouter",
			groupHint: "OAuth or API key",
			methodId: OPENROUTER_OAUTH_METHOD_ID,
			onboardingScopes: ["text-inference", "music-generation"],
			onboardingFeatured: true
		},
		run: async (ctx) => await loginOpenRouterOAuth(ctx)
	};
}
//#endregion
export { OPENROUTER_OAUTH_CHOICE_ID as a, OPENROUTER_OAUTH_REDIRECT_URI as c, buildOpenRouterOAuthRedirectUri as d, createOpenRouterOAuthAuthMethod as f, waitForOpenRouterOAuthCallback as g, parseOpenRouterOAuthCallbackInput as h, OPENROUTER_OAUTH_CALLBACK_PORT as i, OPENROUTER_OAUTH_TOKEN_URL as l, loginOpenRouterOAuth as m, OPENROUTER_OAUTH_CALLBACK_HOST as n, OPENROUTER_OAUTH_CODE_CHALLENGE_METHOD as o, exchangeOpenRouterOAuthCode as p, OPENROUTER_OAUTH_CALLBACK_PATH as r, OPENROUTER_OAUTH_METHOD_ID as s, OPENROUTER_OAUTH_AUTHORIZE_URL as t, buildOpenRouterOAuthAuthorizeUrl as u };
