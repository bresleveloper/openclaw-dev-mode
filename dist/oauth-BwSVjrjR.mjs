import { O as resolveExpiresAtMsFromDurationOrEpoch, P as resolvePositiveTimerTimeoutMs, f as asSafeIntegerInRange, t as MAX_DATE_TIMESTAMP_MS } from "./number-coercion-CLj0HTDM.mjs";
import { r as ensureGlobalUndiciEnvProxyDispatcher } from "./undici-global-dispatcher-CKERJRZ6.mjs";
import { g as readResponseTextLimited, m as readProviderJsonResponse } from "./provider-http-errors-CTY_-ABT.mjs";
import { i as fetchWithSsrFGuard } from "./fetch-guard-EFfAF2PS.mjs";
import "./runtime-env-BaPIl5PP.mjs";
import "./number-runtime-CGwowceO.mjs";
import "./ssrf-runtime-Darh53Ay.mjs";
import "./provider-http-Dn9NddwC.mjs";
import { a as generatePkceVerifierChallenge, o as toFormUrlEncoded } from "./provider-auth-C_UP8nFt.mjs";
import { randomBytes, randomUUID } from "node:crypto";
//#region extensions/minimax/oauth.ts
const MINIMAX_OAUTH_CONFIG = {
	cn: {
		baseUrl: "https://api.minimaxi.com",
		oauthBaseUrl: "https://account.minimaxi.com",
		clientId: "78257093-7e40-4613-99e0-527b14b39113"
	},
	global: {
		baseUrl: "https://api.minimax.io",
		oauthBaseUrl: "https://account.minimax.io",
		clientId: "78257093-7e40-4613-99e0-527b14b39113"
	}
};
const MINIMAX_OAUTH_SCOPE = "group_id profile model.completion";
const MINIMAX_OAUTH_GRANT_TYPE = "urn:ietf:params:oauth:grant-type:user_code";
const MINIMAX_RELATIVE_EXPIRY_SECONDS_THRESHOLD = 1e9;
const MINIMAX_ABSOLUTE_EXPIRY_MS_THRESHOLD = 0xe8d4a51000;
const MINIMAX_OAUTH_ERROR_BODY_LIMIT_BYTES = 8192;
const MINIMAX_OAUTH_FETCH_TIMEOUT_MS = 3e4;
function getOAuthEndpoints(region) {
	const config = MINIMAX_OAUTH_CONFIG[region];
	return {
		codeEndpoint: `${config.oauthBaseUrl}/oauth2/device/code`,
		tokenEndpoint: `${config.oauthBaseUrl}/oauth2/token`,
		clientId: config.clientId,
		baseUrl: config.baseUrl,
		hostname: new URL(config.oauthBaseUrl).hostname
	};
}
/**
* Normalize MiniMax token endpoint `expired_in` values to the auth-profile
* contract: absolute Unix milliseconds.
*/
function normalizeOAuthExpires(expiredIn, now = Date.now()) {
	return resolveExpiresAtMsFromDurationOrEpoch(expiredIn, {
		nowMs: now,
		relativeSecondsThreshold: MINIMAX_RELATIVE_EXPIRY_SECONDS_THRESHOLD,
		absoluteMillisecondsThreshold: MINIMAX_ABSOLUTE_EXPIRY_MS_THRESHOLD
	});
}
function normalizeOAuthAuthorizationExpires(expiredIn) {
	return asSafeIntegerInRange(expiredIn, {
		min: 1,
		max: MAX_DATE_TIMESTAMP_MS
	});
}
function generatePkce() {
	const { verifier, challenge } = generatePkceVerifierChallenge();
	return {
		verifier,
		challenge,
		state: randomBytes(16).toString("base64url")
	};
}
async function requestOAuthCode(params) {
	const endpoints = getOAuthEndpoints(params.region);
	const { response, release } = await fetchWithSsrFGuard({
		url: endpoints.codeEndpoint,
		init: {
			method: "POST",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
				Accept: "application/json",
				"x-request-id": randomUUID()
			},
			body: toFormUrlEncoded({
				response_type: "code",
				client_id: endpoints.clientId,
				scope: MINIMAX_OAUTH_SCOPE,
				code_challenge: params.challenge,
				code_challenge_method: "S256",
				state: params.state
			})
		},
		...params.signal ? { signal: params.signal } : {},
		beforeRequest: params.assertCurrent,
		timeoutMs: MINIMAX_OAUTH_FETCH_TIMEOUT_MS,
		policy: { allowedHostnames: [endpoints.hostname] },
		auditContext: "minimax.oauth.code"
	});
	try {
		if (!response.ok) {
			const text = await readResponseTextLimited(response, MINIMAX_OAUTH_ERROR_BODY_LIMIT_BYTES);
			throw new Error(`MiniMax OAuth authorization failed: ${text || response.statusText}`);
		}
		const payload = await readProviderJsonResponse(response, "minimax.oauth-code");
		if (!payload.user_code || !payload.verification_uri) throw new Error(payload.error ?? "MiniMax OAuth authorization returned an incomplete payload (missing user_code or verification_uri).");
		if (payload.state !== params.state) throw new Error("MiniMax OAuth state mismatch: possible CSRF attack or session corruption.");
		const expiredIn = normalizeOAuthAuthorizationExpires(payload.expired_in);
		if (expiredIn === void 0) throw new Error("MiniMax OAuth authorization returned invalid expired_in.");
		return {
			...payload,
			expired_in: expiredIn
		};
	} finally {
		await release();
	}
}
async function pollOAuthToken(params) {
	const endpoints = getOAuthEndpoints(params.region);
	const { response, release } = await fetchWithSsrFGuard({
		url: endpoints.tokenEndpoint,
		init: {
			method: "POST",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
				Accept: "application/json"
			},
			body: toFormUrlEncoded({
				grant_type: MINIMAX_OAUTH_GRANT_TYPE,
				client_id: endpoints.clientId,
				user_code: params.userCode,
				code_verifier: params.verifier
			})
		},
		...params.signal ? { signal: params.signal } : {},
		beforeRequest: params.assertCurrent,
		timeoutMs: MINIMAX_OAUTH_FETCH_TIMEOUT_MS,
		policy: { allowedHostnames: [endpoints.hostname] },
		auditContext: "minimax.oauth.token"
	});
	try {
		return await parseMiniMaxOAuthTokenResponse(response);
	} finally {
		await release();
	}
}
async function parseMiniMaxOAuthTokenResponse(response) {
	const text = await readResponseTextLimited(response, MINIMAX_OAUTH_ERROR_BODY_LIMIT_BYTES);
	let payload;
	if (text) try {
		payload = JSON.parse(text);
	} catch {
		payload = void 0;
	}
	if (!response.ok) return {
		status: "error",
		message: (payload?.base_resp?.status_msg ?? text) || "MiniMax OAuth failed to parse response."
	};
	if (!payload) return {
		status: "error",
		message: "MiniMax OAuth failed to parse response."
	};
	const tokenPayload = payload;
	if (tokenPayload.status === "error") return {
		status: "error",
		message: "An error occurred. Please try again later"
	};
	if (tokenPayload.status !== "success") return {
		status: "pending",
		message: "current user code is not authorized"
	};
	if (!tokenPayload.access_token || !tokenPayload.refresh_token || !tokenPayload.expired_in) return {
		status: "error",
		message: "MiniMax OAuth returned incomplete token payload."
	};
	const expires = normalizeOAuthExpires(tokenPayload.expired_in);
	if (expires === void 0) return {
		status: "error",
		message: "MiniMax OAuth returned invalid token expiry."
	};
	return {
		status: "success",
		token: {
			access: tokenPayload.access_token,
			refresh: tokenPayload.refresh_token,
			expires,
			resourceUrl: tokenPayload.resource_url,
			notification_message: tokenPayload.notification_message
		}
	};
}
async function loginMiniMaxPortalOAuth(params) {
	ensureGlobalUndiciEnvProxyDispatcher();
	const region = params.region ?? "global";
	const assertCurrent = () => {
		params.signal?.throwIfAborted();
		params.assertCurrent?.();
	};
	const { verifier, challenge, state } = generatePkce();
	const oauth = await requestOAuthCode({
		challenge,
		state,
		region,
		...params.signal ? { signal: params.signal } : {},
		assertCurrent
	});
	assertCurrent();
	const verificationUrl = oauth.verification_uri;
	const noteLines = [
		`Open ${verificationUrl} to approve access.`,
		`If prompted, enter the code ${oauth.user_code}.`,
		`Interval: ${oauth.interval ?? "default (2000ms)"}, Expires at: ${new Date(oauth.expired_in).toISOString()}`
	];
	try {
		await params.openUrl(verificationUrl);
	} catch {}
	assertCurrent();
	if (params.deviceCode) await params.deviceCode({
		title: "MiniMax OAuth",
		code: oauth.user_code,
		expiresInMinutes: Math.ceil((oauth.expired_in - Date.now()) / 6e4),
		message: "Enter this one-time code to approve access."
	});
	else await params.note(noteLines.join("\n"), "MiniMax OAuth");
	assertCurrent();
	let pollIntervalMs = resolvePositiveTimerTimeoutMs(oauth.interval, 2e3);
	const expireTimeMs = oauth.expired_in;
	while (Date.now() < expireTimeMs) {
		params.progress.update("Waiting for MiniMax OAuth approval…");
		const result = await pollOAuthToken({
			userCode: oauth.user_code,
			verifier,
			region,
			...params.signal ? { signal: params.signal } : {},
			assertCurrent
		});
		assertCurrent();
		if (result.status === "success") return result.token;
		if (result.status === "error") throw new Error(result.message);
		const remainingMs = Math.max(0, expireTimeMs - Date.now());
		if (remainingMs <= 0) break;
		await waitForMiniMaxOAuthPoll(Math.min(pollIntervalMs, remainingMs), params.signal);
		assertCurrent();
		pollIntervalMs = Math.max(pollIntervalMs, 2e3);
	}
	throw new Error("MiniMax OAuth timed out before authorization completed.");
}
async function waitForMiniMaxOAuthPoll(delayMs, signal) {
	if (!signal) {
		await new Promise((resolve) => {
			setTimeout(resolve, delayMs);
		});
		return;
	}
	if (signal.aborted) throw signal.reason;
	await new Promise((resolve, reject) => {
		const onAbort = () => {
			clearTimeout(timeout);
			reject(signal.reason instanceof Error ? signal.reason : /* @__PURE__ */ new Error("MiniMax login cancelled"));
		};
		const timeout = setTimeout(() => {
			signal.removeEventListener("abort", onAbort);
			resolve();
		}, delayMs);
		signal.addEventListener("abort", onAbort, { once: true });
	});
}
//#endregion
export { loginMiniMaxPortalOAuth as t };
