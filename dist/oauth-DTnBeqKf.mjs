import { O as resolveExpiresAtMsFromDurationOrEpoch, P as resolvePositiveTimerTimeoutMs, f as asSafeIntegerInRange, t as MAX_DATE_TIMESTAMP_MS } from "./number-coercion-CuVhdCBs.mjs";
import { d as sleepWithAbort } from "./src-D1BHGNTj.mjs";
import { g as readResponseTextLimited, m as readProviderJsonResponse } from "./provider-http-errors-DmewLLH7.mjs";
import { i as fetchWithSsrFGuard } from "./fetch-guard-DI6biu8d.mjs";
import { r as ensureGlobalUndiciEnvProxyDispatcher } from "./undici-global-dispatcher-DH6sagj7.mjs";
import { c as toFormUrlEncoded, s as generatePkceVerifierChallenge } from "./provider-openai-chatgpt-auth-fIvYFuQh.mjs";
import "./runtime-env-BjPzo7IN.mjs";
import "./number-runtime-CgyXj1A5.mjs";
import "./ssrf-runtime-BzkFo_VJ.mjs";
import "./provider-http-CuRGJD0L.mjs";
import "./provider-auth-BGYKg9mW.mjs";
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
		const expiredIn = asSafeIntegerInRange(payload.expired_in, {
			min: 1,
			max: MAX_DATE_TIMESTAMP_MS
		});
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
async function parseMiniMaxOAuthTokenResponse(response, previousRefresh) {
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
	if (payload.status === "error") return {
		status: "error",
		message: payload.base_resp?.status_msg || "An error occurred. Please try again later"
	};
	if (payload.status !== "success") return {
		status: "pending",
		message: "current user code is not authorized"
	};
	const refresh = payload.refresh_token || previousRefresh;
	if (!payload.access_token || !refresh || !payload.expired_in) return {
		status: "error",
		message: "MiniMax OAuth returned incomplete token payload."
	};
	const expires = resolveExpiresAtMsFromDurationOrEpoch(payload.expired_in, {
		nowMs: Date.now(),
		relativeSecondsThreshold: MINIMAX_RELATIVE_EXPIRY_SECONDS_THRESHOLD,
		absoluteMillisecondsThreshold: MINIMAX_ABSOLUTE_EXPIRY_MS_THRESHOLD
	});
	if (expires === void 0) return {
		status: "error",
		message: "MiniMax OAuth returned invalid token expiry."
	};
	return {
		status: "success",
		token: {
			access: payload.access_token,
			refresh,
			expires,
			resourceUrl: payload.resource_url,
			notification_message: payload.notification_message
		}
	};
}
function resolveMiniMaxRegionFromBaseUrl(baseUrl) {
	let hostname;
	try {
		hostname = new URL(baseUrl ?? "").hostname.toLowerCase();
	} catch {
		return;
	}
	if (hostname === "api.minimax.cn") return "cn";
	return ["global", "cn"].find((region) => new URL(MINIMAX_OAUTH_CONFIG[region].baseUrl).hostname === hostname);
}
const MINIMAX_SIGN_IN_AGAIN = "Run `openclaw models auth login --provider minimax-portal` to sign in again.";
/**
* Refresh a MiniMax Portal OAuth credential at the token endpoint its login
* recorded. The refresh token is only sent back to that regional endpoint:
* credentials without a recorded endpoint (saved before refresh existed) and
* credentials whose configured base URL now names the other region are refused
* before any request, since either could send the token across regions.
*/
async function refreshMiniMaxPortalOAuthCredential(credential, providerBaseUrl) {
	const region = ["global", "cn"].find((candidate) => getOAuthEndpoints(candidate).tokenEndpoint === credential.tokenEndpoint);
	if (!region) throw new Error(`MiniMax OAuth credential does not record the account region it was issued for. ${MINIMAX_SIGN_IN_AGAIN}`);
	const configuredRegion = resolveMiniMaxRegionFromBaseUrl(providerBaseUrl);
	if (configuredRegion && configuredRegion !== region) throw new Error(`MiniMax OAuth credential was issued for the ${region === "cn" ? "CN" : "Global"} region, but models.providers.minimax-portal.baseUrl now points to ${MINIMAX_OAUTH_CONFIG[configuredRegion].baseUrl}. ${MINIMAX_SIGN_IN_AGAIN}`);
	if (!credential.refresh) throw new Error(`MiniMax OAuth credential has no refresh token. ${MINIMAX_SIGN_IN_AGAIN}`);
	ensureGlobalUndiciEnvProxyDispatcher();
	const endpoints = getOAuthEndpoints(region);
	const { response, release } = await fetchWithSsrFGuard({
		url: endpoints.tokenEndpoint,
		init: {
			method: "POST",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
				Accept: "application/json"
			},
			body: toFormUrlEncoded({
				grant_type: "refresh_token",
				client_id: endpoints.clientId,
				refresh_token: credential.refresh
			})
		},
		timeoutMs: MINIMAX_OAUTH_FETCH_TIMEOUT_MS,
		policy: { allowedHostnames: [endpoints.hostname] },
		auditContext: "minimax.oauth.refresh"
	});
	let result;
	try {
		result = await parseMiniMaxOAuthTokenResponse(response, credential.refresh);
	} finally {
		await release();
	}
	if (result.status !== "success") throw new Error(`MiniMax OAuth refresh failed: ${result.message ?? "token not issued"}`);
	return {
		...credential,
		access: result.token.access,
		refresh: result.token.refresh,
		expires: result.token.expires
	};
}
async function loginMiniMaxPortalOAuth(params) {
	ensureGlobalUndiciEnvProxyDispatcher();
	const region = params.region ?? "global";
	const assertCurrent = () => {
		params.signal?.throwIfAborted();
		params.assertCurrent?.();
	};
	const { verifier, challenge } = generatePkceVerifierChallenge();
	const oauth = await requestOAuthCode({
		challenge,
		state: randomBytes(16).toString("base64url"),
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
		if (result.status === "success") return {
			...result.token,
			tokenEndpoint: getOAuthEndpoints(region).tokenEndpoint
		};
		if (result.status === "error") throw new Error(result.message);
		const remainingMs = Math.max(0, expireTimeMs - Date.now());
		if (remainingMs <= 0) break;
		params.signal?.throwIfAborted();
		await sleepWithAbort(Math.min(pollIntervalMs, remainingMs), params.signal).catch(() => {
			throw params.signal?.reason instanceof Error ? params.signal.reason : /* @__PURE__ */ new Error("MiniMax login cancelled");
		});
		assertCurrent();
		pollIntervalMs = Math.max(pollIntervalMs, 2e3);
	}
	throw new Error("MiniMax OAuth timed out before authorization completed.");
}
//#endregion
export { refreshMiniMaxPortalOAuthCredential as n, loginMiniMaxPortalOAuth as t };
