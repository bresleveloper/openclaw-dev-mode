import { generatePkceVerifierChallenge } from "openclaw/plugin-sdk/provider-auth";
import { normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
import { randomBytes } from "node:crypto";
import { withTrustedEnvProxyGuardedFetchMode } from "openclaw/plugin-sdk/fetch-runtime";
import { resolveExpiresAtMsFromDurationSeconds } from "openclaw/plugin-sdk/number-runtime";
import { parseOAuthCallbackInput, waitForLocalOAuthCallback } from "openclaw/plugin-sdk/provider-auth-runtime";
import { assertOkOrThrowProviderError, readProviderJsonResponse } from "openclaw/plugin-sdk/provider-http";
import { buildOAuthRequestSignal, createOAuthRefreshError, createOAuthRefreshResponseError } from "openclaw/plugin-sdk/provider-oauth-runtime";
import { fetchWithSsrFGuard } from "openclaw/plugin-sdk/ssrf-runtime";
// extensions/chutes/oauth.ts
const CHUTES_AUTHORIZE_ENDPOINT = "https://api.chutes.ai/idp/authorize";
const CHUTES_TOKEN_ENDPOINT = "https://api.chutes.ai/idp/token";
const CHUTES_USERINFO_ENDPOINT = "https://api.chutes.ai/idp/userinfo";
const CHUTES_OAUTH_REQUEST_TIMEOUT_MS = 3e4;
async function requestChutesTokenGrant(params) {
	const { response, release } = await fetchWithSsrFGuard(withTrustedEnvProxyGuardedFetchMode({
		url: CHUTES_TOKEN_ENDPOINT,
		init: {
			method: "POST",
			headers: { "Content-Type": "application/x-www-form-urlencoded" },
			body: params.body
		},
		signal: buildOAuthRequestSignal({
			timeoutMs: CHUTES_OAUTH_REQUEST_TIMEOUT_MS,
			...params.signal ? { signal: params.signal } : {}
		})
	}));
	try {
		if (params.responseLabel === "Chutes token exchange") await assertOkOrThrowProviderError(response, `${params.responseLabel} failed`);
		const data = await readProviderJsonResponse(response, params.responseLabel);
		if (!response.ok || data.error !== void 0) throw createOAuthRefreshResponseError(params.responseLabel, response.status, data);
		const access = normalizeOptionalString(data.access_token);
		const expires = resolveExpiresAtMsFromDurationSeconds(data.expires_in, {
			nowMs: params.now ?? Date.now(),
			bufferMs: 3e5,
			minRemainingMs: 3e4
		});
		if (!access) throw createOAuthRefreshError(`${params.responseLabel} returned no access_token`, {
			version: 1,
			phase: "after-token-response",
			outcome: "unknown",
			status: response.status
		});
		if (expires === void 0) throw createOAuthRefreshError(`${params.responseLabel} returned invalid expires_in`, {
			version: 1,
			phase: "after-token-response",
			outcome: "unknown",
			status: response.status
		});
		const refresh = normalizeOptionalString(data.refresh_token);
		if (data.refresh_token !== void 0 && !refresh) throw createOAuthRefreshError(`${params.responseLabel} returned invalid refresh_token`, {
			version: 1,
			phase: "after-token-response",
			outcome: "unknown",
			status: response.status
		});
		return {
			access,
			refresh,
			expires
		};
	} finally {
		await release();
	}
}
async function fetchChutesUserInfo(params) {
	const { response, release } = await fetchWithSsrFGuard(withTrustedEnvProxyGuardedFetchMode({
		url: CHUTES_USERINFO_ENDPOINT,
		init: { headers: { Authorization: `Bearer ${params.accessToken}` } },
		signal: buildOAuthRequestSignal({
			timeoutMs: CHUTES_OAUTH_REQUEST_TIMEOUT_MS,
			...params.signal ? { signal: params.signal } : {}
		})
	}));
	try {
		if (!response.ok) return null;
		const data = await readProviderJsonResponse(response, "Chutes userinfo");
		return data && typeof data === "object" ? data : null;
	} finally {
		await release();
	}
}
/** Refreshes a stored Chutes OAuth credential through the provider token endpoint. */
async function refreshChutesOAuthCredential(credential) {
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
		responseLabel: "Chutes token refresh"
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
	const state = randomBytes(16).toString("hex");
	const query = new URLSearchParams({
		client_id: params.app.clientId,
		redirect_uri: params.app.redirectUri,
		response_type: "code",
		scope: params.app.scopes.join(" "),
		state,
		code_challenge: challenge,
		code_challenge_method: "S256"
	});
	const url = `${CHUTES_AUTHORIZE_ENDPOINT}?${query}`;
	const promptForCode = async () => {
		const parsed = parseOAuthCallbackInput(await params.onPrompt({
			message: "Paste the redirect URL",
			placeholder: `${params.app.redirectUri}?code=...&state=...`
		}), {
			invalidInput: "Paste the full redirect URL (must include code + state).",
			missingState: "Missing 'state' parameter. Paste the full redirect URL."
		});
		if ("error" in parsed) throw new Error(parsed.error);
		if (parsed.state !== state) throw new Error("OAuth state mismatch - possible CSRF attack. Please retry login.");
		return parsed;
	};
	let codeAndState;
	if (params.manual) {
		await params.onAuth({ url });
		params.onProgress?.("Waiting for redirect URL...");
		codeAndState = await promptForCode();
	} else {
		const redirectUri = params.app.redirectUri;
		const redirect = new URL(redirectUri);
		if (redirect.protocol !== "http:") throw new Error(`Chutes OAuth redirect URI must be http:// (got ${redirectUri})`);
		const hostname = redirect.hostname === "[::1]" ? "::1" : redirect.hostname || "127.0.0.1";
		if (hostname !== "localhost" && hostname !== "127.0.0.1" && hostname !== "::1") throw new Error(`Chutes OAuth redirect hostname must be loopback (got ${hostname}). Use http://127.0.0.1:<port>/...`);
		const port = redirect.port ? Number.parseInt(redirect.port, 10) : 80;
		const pathname = redirect.pathname || "/";
		const callback = waitForLocalOAuthCallback({
			expectedState: state,
			timeoutMs: 18e4,
			port,
			callbackPath: pathname,
			redirectUri: params.app.redirectUri,
			successTitle: "Chutes authorization received",
			hostname,
			onProgress: params.onProgress,
			...params.signal ? { signal: params.signal } : {}
		}).catch(async (error) => {
			if (params.signal?.aborted) throw error;
			params.onProgress?.("OAuth callback not detected; paste redirect URL...");
			return await promptForCode();
		});
		await params.onAuth({ url });
		codeAndState = await callback;
	}
	params.onProgress?.("Exchanging code for tokens...");
	const app = params.app;
	const signal = params.signal;
	const now = Date.now();
	const body = new URLSearchParams({
		grant_type: "authorization_code",
		client_id: app.clientId,
		code: codeAndState.code,
		redirect_uri: app.redirectUri,
		code_verifier: verifier
	});
	if (app.clientSecret) body.set("client_secret", app.clientSecret);
	const token = await requestChutesTokenGrant({
		body,
		responseLabel: "Chutes token exchange",
		now,
		...signal ? { signal } : {}
	});
	if (!token.refresh) throw new Error("Chutes token exchange returned no refresh_token");
	let info = null;
	try {
		info = await fetchChutesUserInfo({
			accessToken: token.access,
			...signal ? { signal } : {}
		});
	} catch (error) {
		if (signal?.aborted) throw error;
	}
	return {
		access: token.access,
		refresh: token.refresh,
		expires: token.expires,
		email: info?.username,
		accountId: info?.sub,
		clientId: app.clientId
	};
}
export { loginChutes, refreshChutesOAuthCredential };
