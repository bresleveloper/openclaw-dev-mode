import { generatePkceVerifierChallenge } from "openclaw/plugin-sdk/provider-auth";
import { normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
import { randomBytes } from "node:crypto";
import { resolveExpiresAtMsFromDurationSeconds } from "openclaw/plugin-sdk/number-runtime";
import { parseOAuthCallbackInput, waitForLocalOAuthCallback } from "openclaw/plugin-sdk/provider-auth-runtime";
import { assertOkOrThrowProviderError, readProviderJsonResponse } from "openclaw/plugin-sdk/provider-http";
import { buildOAuthRequestSignal } from "openclaw/plugin-sdk/provider-oauth-runtime";
//#region extensions/chutes/oauth.ts
/**
* Chutes OAuth PKCE login flow.
*/
const CHUTES_AUTHORIZE_ENDPOINT = "https://api.chutes.ai/idp/authorize";
const CHUTES_TOKEN_ENDPOINT = "https://api.chutes.ai/idp/token";
const CHUTES_USERINFO_ENDPOINT = "https://api.chutes.ai/idp/userinfo";
const CHUTES_OAUTH_REQUEST_TIMEOUT_MS = 3e4;
function parseRedirectUri(redirectUri) {
	const url = new URL(redirectUri);
	if (url.protocol !== "http:") throw new Error(`Chutes OAuth redirect URI must be http:// (got ${redirectUri})`);
	const hostname = url.hostname || "127.0.0.1";
	if (hostname !== "localhost" && hostname !== "127.0.0.1" && hostname !== "::1") throw new Error(`Chutes OAuth redirect hostname must be loopback (got ${hostname}). Use http://127.0.0.1:<port>/...`);
	return {
		hostname,
		port: url.port ? Number.parseInt(url.port, 10) : 80,
		pathname: url.pathname || "/"
	};
}
function parseManualOAuthInput(input, expectedState) {
	const parsed = parseOAuthCallbackInput(input, {
		invalidInput: "Paste the full redirect URL (must include code + state).",
		missingState: "Missing 'state' parameter. Paste the full redirect URL."
	});
	if ("error" in parsed) throw new Error(parsed.error);
	if (parsed.state !== expectedState) throw new Error("OAuth state mismatch - possible CSRF attack. Please retry login.");
	return parsed;
}
function buildAuthorizeUrl(params) {
	const qs = new URLSearchParams({
		client_id: params.clientId,
		redirect_uri: params.redirectUri,
		response_type: "code",
		scope: params.scopes.join(" "),
		state: params.state,
		code_challenge: params.challenge,
		code_challenge_method: "S256"
	});
	return `${CHUTES_AUTHORIZE_ENDPOINT}?${qs.toString()}`;
}
function resolveChutesExpiresAt(value, now) {
	return resolveExpiresAtMsFromDurationSeconds(value, {
		nowMs: now,
		bufferMs: 3e5,
		minRemainingMs: 3e4
	});
}
async function requestChutesTokenGrant(params) {
	const response = await (params.fetchFn ?? fetch)(CHUTES_TOKEN_ENDPOINT, {
		method: "POST",
		headers: { "Content-Type": "application/x-www-form-urlencoded" },
		body: params.body,
		signal: buildOAuthRequestSignal({
			timeoutMs: CHUTES_OAUTH_REQUEST_TIMEOUT_MS,
			...params.signal ? { signal: params.signal } : {}
		})
	});
	await assertOkOrThrowProviderError(response, `${params.responseLabel} failed`);
	const data = await readProviderJsonResponse(response, params.responseLabel);
	const access = normalizeOptionalString(data.access_token);
	const expires = resolveChutesExpiresAt(data.expires_in, params.now ?? Date.now());
	if (!access) throw new Error(`${params.responseLabel} returned no access_token`);
	if (expires === void 0) throw new Error(`${params.responseLabel} returned invalid expires_in`);
	return {
		access,
		refresh: normalizeOptionalString(data.refresh_token),
		expires
	};
}
async function fetchChutesUserInfo(params) {
	const response = await (params.fetchFn ?? fetch)(CHUTES_USERINFO_ENDPOINT, {
		headers: { Authorization: `Bearer ${params.accessToken}` },
		signal: buildOAuthRequestSignal({
			timeoutMs: CHUTES_OAUTH_REQUEST_TIMEOUT_MS,
			...params.signal ? { signal: params.signal } : {}
		})
	});
	if (!response.ok) {
		await response.body?.cancel().catch(() => void 0);
		return null;
	}
	const data = await readProviderJsonResponse(response, "Chutes userinfo");
	return data && typeof data === "object" ? data : null;
}
async function exchangeChutesCodeForTokens(params) {
	const fetchFn = params.fetchFn ?? fetch;
	const now = params.now ?? Date.now();
	const body = new URLSearchParams({
		grant_type: "authorization_code",
		client_id: params.app.clientId,
		code: params.code,
		redirect_uri: params.app.redirectUri,
		code_verifier: params.codeVerifier
	});
	if (params.app.clientSecret) body.set("client_secret", params.app.clientSecret);
	const token = await requestChutesTokenGrant({
		body,
		responseLabel: "Chutes token exchange",
		fetchFn,
		now,
		...params.signal ? { signal: params.signal } : {}
	});
	if (!token.refresh) throw new Error("Chutes token exchange returned no refresh_token");
	let info = null;
	try {
		info = await fetchChutesUserInfo({
			accessToken: token.access,
			fetchFn,
			...params.signal ? { signal: params.signal } : {}
		});
	} catch (error) {
		if (params.signal?.aborted) throw error;
	}
	return {
		access: token.access,
		refresh: token.refresh,
		expires: token.expires,
		email: info?.username,
		accountId: info?.sub,
		clientId: params.app.clientId
	};
}
/** Refreshes a stored Chutes OAuth credential through the provider token endpoint. */
async function refreshChutesOAuthCredential(credential, options = {}) {
	const refreshToken = normalizeOptionalString(credential.refresh);
	if (!refreshToken) throw new Error("Chutes OAuth credential is missing refresh token");
	const clientId = normalizeOptionalString(credential.clientId ?? process.env.CHUTES_CLIENT_ID);
	if (!clientId) throw new Error("Missing CHUTES_CLIENT_ID for Chutes OAuth refresh (set env var or re-auth).");
	const clientSecret = normalizeOptionalString(process.env.CHUTES_CLIENT_SECRET);
	const body = new URLSearchParams({
		grant_type: "refresh_token",
		client_id: clientId,
		refresh_token: refreshToken
	});
	if (clientSecret) body.set("client_secret", clientSecret);
	const token = await requestChutesTokenGrant({
		body,
		responseLabel: "Chutes token refresh",
		fetchFn: options.fetchFn,
		now: options.now
	});
	return {
		...credential,
		access: token.access,
		refresh: token.refresh ?? refreshToken,
		expires: token.expires,
		clientId
	};
}
/** Runs Chutes OAuth and returns refreshable stored credentials. */
async function loginChutes(params) {
	const { verifier, challenge } = generatePkceVerifierChallenge();
	const state = params.createState?.() ?? randomBytes(16).toString("hex");
	const timeoutMs = params.timeoutMs ?? 18e4;
	const url = buildAuthorizeUrl({
		clientId: params.app.clientId,
		redirectUri: params.app.redirectUri,
		scopes: params.app.scopes,
		state,
		challenge
	});
	let codeAndState;
	if (params.manual) {
		await params.onAuth({ url });
		params.onProgress?.("Waiting for redirect URL...");
		codeAndState = parseManualOAuthInput(await params.onPrompt({
			message: "Paste the redirect URL",
			placeholder: `${params.app.redirectUri}?code=...&state=...`
		}), state);
	} else {
		const redirect = parseRedirectUri(params.app.redirectUri);
		const callback = waitForLocalOAuthCallback({
			expectedState: state,
			timeoutMs,
			port: redirect.port,
			callbackPath: redirect.pathname,
			redirectUri: params.app.redirectUri,
			successTitle: "Chutes OAuth complete",
			hostname: redirect.hostname,
			onProgress: params.onProgress,
			...params.signal ? { signal: params.signal } : {}
		}).catch(async (error) => {
			if (params.signal?.aborted) throw error;
			params.onProgress?.("OAuth callback not detected; paste redirect URL...");
			return parseManualOAuthInput(await params.onPrompt({
				message: "Paste the redirect URL",
				placeholder: `${params.app.redirectUri}?code=...&state=...`
			}), state);
		});
		await params.onAuth({ url });
		codeAndState = await callback;
	}
	params.onProgress?.("Exchanging code for tokens...");
	return await exchangeChutesCodeForTokens({
		app: params.app,
		code: codeAndState.code,
		codeVerifier: verifier,
		fetchFn: params.fetchFn,
		...params.signal ? { signal: params.signal } : {}
	});
}
//#endregion
export { loginChutes, refreshChutesOAuthCredential };
