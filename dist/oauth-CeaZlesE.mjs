import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { g as readResponseTextLimited, m as readProviderJsonResponse } from "./provider-http-errors-CTY_-ABT.mjs";
import "./error-runtime-Bf1fYXFh.mjs";
import "./string-coerce-runtime-C_MKhRVt.mjs";
import { n as buildApiKeyCredential } from "./provider-auth-helpers-CqP4hf2X.mjs";
import { n as generateHexOAuthState, s as startProviderOAuthLoopbackCallbackServer } from "./provider-auth-runtime-BveQzsWa.mjs";
import "./provider-http-Dn9NddwC.mjs";
import { a as generatePkceVerifierChallenge } from "./provider-auth-C_UP8nFt.mjs";
import { n as applyOpenrouterConfig, t as OPENROUTER_DEFAULT_MODEL_REF } from "./onboard-CoEH85EE.mjs";
//#region extensions/openrouter/oauth.ts
const PROVIDER_ID = "openrouter";
const OPENROUTER_OAUTH_METHOD_ID = "oauth";
const OPENROUTER_OAUTH_CHOICE_ID = "openrouter-oauth";
const OPENROUTER_OAUTH_AUTHORIZE_URL = "https://openrouter.ai/auth";
const OPENROUTER_OAUTH_TOKEN_URL = "https://openrouter.ai/api/v1/auth/keys";
const OPENROUTER_OAUTH_REDIRECT_URI = `http://localhost:3000/openrouter-oauth/callback`;
const OPENROUTER_OAUTH_CODE_CHALLENGE_METHOD = "S256";
const OPENROUTER_OAUTH_TIMEOUT_MS = 3e5;
const OPENROUTER_OAUTH_FETCH_TIMEOUT_MS = 3e4;
const OPENROUTER_OAUTH_ERROR_BODY_LIMIT_BYTES = 8192;
const OPENROUTER_OAUTH_PROFILE_ID = "openrouter:default";
function extractOpenRouterError(value) {
	if (typeof value === "string") return value.trim() || void 0;
	if (!isRecord(value)) return;
	const direct = normalizeOptionalString(value.message) ?? normalizeOptionalString(value.error_description);
	if (direct) return direct;
	const error = value.error;
	if (typeof error === "string") return error.trim() || void 0;
	if (isRecord(error)) return normalizeOptionalString(error.message) ?? normalizeOptionalString(error.code);
}
async function readResponseBody(response) {
	if (response.ok) return await readProviderJsonResponse(response, "OpenRouter OAuth key exchange");
	const text = await readResponseTextLimited(response, OPENROUTER_OAUTH_ERROR_BODY_LIMIT_BYTES).catch(() => "");
	if (!text.trim()) return null;
	try {
		return JSON.parse(text);
	} catch {
		return text;
	}
}
function parseOpenRouterKeyResponse(value) {
	if (!isRecord(value)) throw new Error("OpenRouter OAuth key exchange returned an unexpected response.");
	const key = normalizeOptionalString(value.key);
	if (!key) throw new Error("OpenRouter OAuth key exchange returned no API key.");
	const userId = normalizeOptionalString(value.user_id) ?? normalizeOptionalString(value.userId);
	return {
		key,
		...userId ? { userId } : {}
	};
}
function buildOpenRouterOAuthAuthorizeUrl(params) {
	const callbackUrl = new URL(params.redirectUrl);
	callbackUrl.searchParams.set("state", params.state);
	const url = new URL(OPENROUTER_OAUTH_AUTHORIZE_URL);
	url.searchParams.set("callback_url", callbackUrl.toString());
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
		const state = requireOpenRouterOAuthState(normalizeOptionalString(params.get("state")), expectedState);
		const error = normalizeOptionalString(params.get("error"));
		if (error) {
			const description = normalizeOptionalString(params.get("error_description"));
			throw new Error(`OpenRouter OAuth error: ${description ? `${error}: ${description}` : error}`);
		}
		const code = normalizeOptionalString(params.get("code"));
		if (!code) throw new Error("Missing 'code' parameter in redirect URL.");
		return {
			code,
			state
		};
	};
	try {
		return parseParams(new URL(trimmed).searchParams);
	} catch (err) {
		if (err instanceof TypeError) {
			if (trimmed.includes("code=") || trimmed.includes("error=")) return parseParams(new URLSearchParams(trimmed));
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
		signal: params.signal ? AbortSignal.any([params.signal, AbortSignal.timeout(OPENROUTER_OAUTH_FETCH_TIMEOUT_MS)]) : AbortSignal.timeout(OPENROUTER_OAUTH_FETCH_TIMEOUT_MS)
	});
	const body = await readResponseBody(response);
	if (!response.ok) {
		const message = extractOpenRouterError(body);
		throw new Error(`OpenRouter OAuth key exchange failed (${response.status})${message ? `: ${message}` : ""}`);
	}
	return parseOpenRouterKeyResponse(body);
}
async function promptForOpenRouterRedirect(ctx, expectedState) {
	return parseOpenRouterOAuthCallbackInput(await ctx.prompter.text({
		message: "Paste the OpenRouter redirect URL",
		placeholder: `${OPENROUTER_OAUTH_REDIRECT_URI}?state=...&code=...`,
		validate: (value) => {
			try {
				parseOpenRouterOAuthCallbackInput(value, expectedState);
				return;
			} catch (error) {
				return formatErrorMessage(error);
			}
		}
	}), expectedState).code;
}
async function resolveOpenRouterOAuthCode(ctx, params) {
	if (ctx.oauth.authorize) return (await ctx.oauth.authorize({
		state: params.state,
		timeoutMs: OPENROUTER_OAUTH_TIMEOUT_MS,
		buildAuthorizationUrl: params.buildAuthorizationUrl
	})).code;
	const authorizeUrl = params.buildAuthorizationUrl(OPENROUTER_OAUTH_REDIRECT_URI);
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
		ctx.runtime.log(`\nOpen this URL in your LOCAL browser:\n\n${authorizeUrl}\n`);
		await ctx.openUrl(authorizeUrl);
		await ctx.prompter.note(`Open this URL in your LOCAL browser:\n\n${authorizeUrl}`, "OpenRouter OAuth");
		return await promptForOpenRouterRedirect(ctx, params.state);
	}
	let callback;
	try {
		callback = await params.startCallback({
			redirectUrl: OPENROUTER_OAUTH_REDIRECT_URI,
			expectedState: params.state,
			timeoutMs: OPENROUTER_OAUTH_TIMEOUT_MS,
			...ctx.signal ? { signal: ctx.signal } : {},
			renderSuccess: () => ({
				body: "<!doctype html><html><head><meta charset='utf-8'/></head><body><h2>OpenRouter OAuth complete</h2><p>You can close this window and return to OpenClaw.</p></body></html>",
				contentType: "text/html; charset=utf-8"
			})
		});
		params.onProgress(`Waiting for OpenRouter OAuth callback on ${OPENROUTER_OAUTH_REDIRECT_URI}...`);
	} catch (error) {
		if (ctx.signal?.aborted) throw error;
		params.onProgress("OAuth callback not detected; waiting for redirect URL...");
	}
	try {
		await ctx.openUrl(authorizeUrl);
		ctx.runtime.log(`Open: ${authorizeUrl}`);
	} catch {
		ctx.runtime.log(`Open manually: ${authorizeUrl}`);
	}
	if (!callback) return await promptForOpenRouterRedirect(ctx, params.state);
	let result;
	try {
		try {
			result = await callback.waitForCallback();
		} finally {
			await callback.close();
		}
	} catch (error) {
		if (ctx.signal?.aborted) throw error;
		params.onProgress("OAuth callback not detected; waiting for redirect URL...");
		return await promptForOpenRouterRedirect(ctx, params.state);
	}
	if (result.type === "oauth_error") {
		const detail = result.errorDescription ? `${result.error}: ${result.errorDescription}` : result.error;
		throw new Error(`OpenRouter OAuth error: ${detail}`);
	}
	return result.code;
}
async function loginOpenRouterOAuth(ctx, options = {}) {
	const progress = ctx.prompter.progress("Starting OpenRouter OAuth...");
	try {
		const pkce = options.createPkce?.() ?? generatePkceVerifierChallenge();
		const state = options.createState?.() ?? generateHexOAuthState();
		const code = await resolveOpenRouterOAuthCode(ctx, {
			buildAuthorizationUrl: (redirectUrl) => buildOpenRouterOAuthAuthorizeUrl({
				codeChallenge: pkce.challenge,
				redirectUrl,
				state
			}),
			state,
			startCallback: options.startCallback ?? startProviderOAuthLoopbackCallbackServer,
			onProgress: (message) => progress.update(message)
		});
		progress.update("Exchanging OpenRouter OAuth code...");
		ctx.signal?.throwIfAborted();
		ctx.assertCurrent?.();
		const token = await exchangeOpenRouterOAuthCode({
			code,
			codeVerifier: pkce.verifier,
			fetchImpl: options.fetchImpl,
			...ctx.signal ? { signal: ctx.signal } : {}
		});
		progress.stop("OpenRouter credential received");
		const metadata = {
			authFlow: "oauth-pkce",
			...token.userId ? { userId: token.userId } : {}
		};
		const credential = {
			...buildApiKeyCredential(PROVIDER_ID, token.key, metadata),
			displayName: token.userId ? `OpenRouter ${token.userId}` : "OpenRouter OAuth"
		};
		return {
			profiles: [{
				profileId: OPENROUTER_OAUTH_PROFILE_ID,
				credential
			}],
			configPatch: applyOpenrouterConfig(ctx.config),
			defaultModel: OPENROUTER_DEFAULT_MODEL_REF,
			notes: ["OpenRouter OAuth issued an OpenRouter API key for the default OpenRouter auth profile.", "Re-run OpenRouter OAuth to rotate that key or use the API-key setup path for a key you manage manually."]
		};
	} catch (err) {
		progress.stop("OpenRouter OAuth failed");
		throw new Error(`OpenRouter OAuth failed: ${formatErrorMessage(err)}`, { cause: err });
	}
}
function createOpenRouterOAuthAuthMethod(options = {}) {
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
		run: async (ctx) => await loginOpenRouterOAuth(ctx, options)
	};
}
//#endregion
export { createOpenRouterOAuthAuthMethod as t };
