import { g as readStringValue, l as normalizeOptionalString, m as readNonBlankString } from "../../string-coerce-1VuiLaaR.mjs";
import { A as resolveExpiresAtMsFromEpochSeconds, T as positiveSecondsToSafeMilliseconds, k as resolveExpiresAtMsFromDurationSeconds } from "../../number-coercion-CuVhdCBs.mjs";
import { a as asOptionalRecord } from "../../record-coerce-TIsquoVR.mjs";
import { h as sleep } from "../../utils-DgZn2dLu.mjs";
import { t as formatErrorMessage } from "../../errors-O33D01XW.mjs";
import { i as readResponseWithLimit } from "../../http-response-body-umfRGZ-E.mjs";
import { a as resolveEnvHttpProxyAgentOptions, i as matchesNoProxy } from "../../proxy-env-DlRjxK5F.mjs";
import { i as fetchWithSsrFGuard } from "../../fetch-guard-DI6biu8d.mjs";
import { c as toFormUrlEncoded } from "../../provider-openai-chatgpt-auth-fIvYFuQh.mjs";
import "../../error-runtime-BmospGvZ.mjs";
import "../../string-coerce-runtime-50qKeWeL.mjs";
import "../../fetch-runtime-DT4gd-qk.mjs";
import "../../response-limit-runtime-CpfmMF5T.mjs";
import "../../runtime-env-BjPzo7IN.mjs";
import "../../number-runtime-CgyXj1A5.mjs";
import "../../ssrf-runtime-BzkFo_VJ.mjs";
import "../../provider-auth-C3BBF7yn.mjs";
import { t as buildOauthProviderAuthResult } from "../../provider-auth-result-BIBiHM9E.mjs";
import { r as applyXaiOAuthConfig, t as XAI_DEFAULT_MODEL_REF } from "../../onboard-CnuA5-ZT.mjs";
import { r as buildXaiProvider, t as buildLiveXaiOAuthProvider } from "../../provider-catalog-CAX97roz.mjs";
import { t as xaiUserAgent } from "../../xai-user-agent-DDm_lbFO.mjs";
//#region extensions/xai/xai-oauth.ts
const PROVIDER_ID = "xai";
const XAI_OAUTH_CLIENT_ID = "b1a00492-073a-47ea-816f-4c329264a828";
const XAI_OAUTH_SCOPE = "openid profile email offline_access grok-cli:access api:access";
const XAI_OAUTH_ISSUER = "https://auth.x.ai";
const XAI_OAUTH_DISCOVERY_URL = `${XAI_OAUTH_ISSUER}/.well-known/openid-configuration`;
const XAI_LEGACY_OAUTH_TOKEN_ENDPOINT = `${XAI_OAUTH_ISSUER}/oauth/token`;
const XAI_OAUTH_TIMEOUT_MS = 3e5;
const XAI_OAUTH_FETCH_TIMEOUT_MS = 3e4;
const XAI_OAUTH_RESPONSE_MAX_BYTES = 16777216;
const XAI_OAUTH_REFRESH_MAX_ATTEMPTS = 3;
const XAI_OAUTH_REFRESH_RETRY_DELAY_MS = 250;
const XAI_DEVICE_CODE_DEFAULT_INTERVAL_MS = 5e3;
const XAI_DEVICE_CODE_MIN_INTERVAL_MS = 1e3;
const XAI_DEVICE_CODE_SLOW_DOWN_INCREMENT_MS = 5e3;
const XAI_DEVICE_CODE_GRANT_TYPE = "urn:ietf:params:oauth:grant-type:device_code";
function fetchXaiOAuth(url, options, body) {
	return fetchWithSsrFGuard({
		url,
		fetchImpl: options.fetchImpl,
		beforeRequest: options.assertCurrent,
		mode: "trusted_explicit_proxy",
		resolveDispatcherPolicy: (target) => {
			const proxies = resolveEnvHttpProxyAgentOptions();
			const proxyUrl = target.protocol === "https:" ? proxies?.httpsProxy : proxies?.httpProxy;
			return proxyUrl && !matchesNoProxy(target.toString()) ? {
				mode: "explicit-proxy",
				proxyUrl,
				allowPrivateProxy: true
			} : void 0;
		},
		signal: options.signal,
		timeoutMs: XAI_OAUTH_FETCH_TIMEOUT_MS,
		requireHttps: true,
		auditContext: "xai-oauth",
		init: {
			headers: {
				Accept: "application/json",
				"User-Agent": xaiUserAgent(),
				...body ? { "Content-Type": "application/x-www-form-urlencoded" } : {}
			},
			...body ? {
				method: "POST",
				body: toFormUrlEncoded(body)
			} : {}
		}
	});
}
function requireTrustedXaiOAuthEndpoint(endpoint, label) {
	const url = URL.parse(endpoint);
	if (url?.protocol === "https:" && (url.hostname === "x.ai" || url.hostname.endsWith(".x.ai"))) return endpoint;
	throw new Error(`xAI OAuth discovery returned untrusted ${label}`);
}
async function readResponseBody({ response, release }, options = {}) {
	try {
		const buffer = await readResponseWithLimit(response, XAI_OAUTH_RESPONSE_MAX_BYTES, { onOverflow: ({ maxBytes }) => /* @__PURE__ */ new Error(`xAI OAuth response exceeds ${maxBytes} bytes`) });
		const text = new TextDecoder("utf-8", { fatal: options.fatalUtf8 }).decode(buffer);
		let json;
		try {
			json = JSON.parse(text);
		} catch {
			json = null;
		}
		return {
			json,
			text
		};
	} finally {
		await release();
	}
}
async function readJsonResponse(result, context) {
	const { response } = result;
	const body = await readResponseBody(result);
	if (!response.ok) {
		const json = asOptionalRecord(body.json);
		const errorText = json?.error_description ?? json?.error;
		throw new Error(`${context} failed (${response.status})${typeof errorText === "string" ? `: ${errorText}` : ""}`);
	}
	return body.json;
}
async function fetchXaiOAuthDiscoveryDocument(options = {}) {
	const response = await fetchXaiOAuth(XAI_OAUTH_DISCOVERY_URL, options);
	return asOptionalRecord(await readJsonResponse(response, "xAI OAuth discovery")) ?? {};
}
async function fetchXaiDeviceCodeDiscovery(options = {}) {
	const json = await fetchXaiOAuthDiscoveryDocument(options);
	const deviceAuthorizationEndpoint = json.device_authorization_endpoint;
	const tokenEndpoint = json.token_endpoint;
	if (typeof deviceAuthorizationEndpoint !== "string" || typeof tokenEndpoint !== "string") throw new Error("xAI OAuth discovery response is missing device code endpoints");
	return {
		deviceAuthorizationEndpoint: requireTrustedXaiOAuthEndpoint(deviceAuthorizationEndpoint, "device authorization endpoint"),
		tokenEndpoint: requireTrustedXaiOAuthEndpoint(tokenEndpoint, "token endpoint")
	};
}
function parseXaiOAuthTokenResponse(value, now, options = {}) {
	const json = asOptionalRecord(value) ?? {};
	const accessToken = readNonBlankString(json.access_token);
	if (!accessToken) throw new Error("xAI OAuth token response is missing access_token");
	const refreshToken = readNonBlankString(json.refresh_token);
	if (options.requireRefreshToken && !refreshToken) throw new Error("xAI OAuth token response is missing refresh_token. Re-run the login; if the issue persists, the OAuth client is not configured to issue refresh tokens (commonly because the offline_access scope was rejected).");
	const idToken = readNonBlankString(json.id_token);
	const expires = resolveExpiresAtMsFromDurationSeconds(json.expires_in, { nowMs: now() }) ?? resolveExpiresAtMsFromEpochSeconds(decodeJwtPayload(accessToken).exp);
	return {
		accessToken,
		...refreshToken ? { refreshToken } : {},
		...idToken ? { idToken } : {},
		...expires ? { expires } : {}
	};
}
function formatXaiOAuthError(params) {
	const body = asOptionalRecord(params.body);
	const error = readStringValue(body?.error);
	const description = readStringValue(body?.error_description);
	const prefix = `${params.context} failed (${params.status})`;
	return error ? `${prefix}: ${error}${description ? ` (${description})` : ""}` : prefix;
}
function isLikelyXaiCloudflareChallenge(params) {
	const contentType = params.response.headers.get("content-type") ?? "";
	return params.response.headers.get("cf-mitigated") === "challenge" || /text\/html/i.test(contentType) || /<!doctype html|<html\b/i.test(params.bodyText) || /\b(?:cloudflare|attention required|just a moment|enable javascript and cookies|challenge-platform)\b/i.test(params.bodyText);
}
function formatXaiOAuthCloudflareChallengeError(params) {
	return `${params.context} failed (${params.status}): xAI returned an HTML/Cloudflare challenge instead of OAuth JSON. xAI may be blocking the automated token refresh; try again later or re-run xAI OAuth login.`;
}
function describeXaiOAuthTokenFailure(params) {
	const { context, response, body } = params;
	const status = response.status;
	const isCloudflareChallenge = !Boolean(readStringValue(asOptionalRecord(body.json)?.error)) && isLikelyXaiCloudflareChallenge({
		response,
		bodyText: body.text
	});
	return {
		message: isCloudflareChallenge ? formatXaiOAuthCloudflareChallengeError({
			context,
			status
		}) : formatXaiOAuthError({
			context,
			status,
			body: body.json
		}),
		retryable: isCloudflareChallenge
	};
}
async function requestXaiOAuthRefresh(tokenEndpoint, refreshToken, options) {
	const endpoint = requireTrustedXaiOAuthEndpoint(tokenEndpoint, "token endpoint");
	const context = "xAI OAuth refresh";
	for (let attempt = 1;; attempt += 1) {
		let response;
		let body;
		try {
			const result = await fetchXaiOAuth(endpoint, options, {
				grant_type: "refresh_token",
				client_id: XAI_OAUTH_CLIENT_ID,
				refresh_token: refreshToken
			});
			response = result.response;
			body = await readResponseBody(result, { fatalUtf8: response.ok });
		} catch (err) {
			throw new Error(`${context} failed: ${formatErrorMessage(err)}`, { cause: err });
		}
		if (response.ok) return parseXaiOAuthTokenResponse(body.json, options.now ?? Date.now);
		const failure = describeXaiOAuthTokenFailure({
			context,
			response,
			body
		});
		if (attempt >= XAI_OAUTH_REFRESH_MAX_ATTEMPTS || !failure.retryable) throw new Error(failure.message);
		await sleep(XAI_OAUTH_REFRESH_RETRY_DELAY_MS);
	}
}
async function requestXaiDeviceCode(params) {
	const response = await fetchXaiOAuth(requireTrustedXaiOAuthEndpoint(params.deviceAuthorizationEndpoint, "device authorization endpoint"), params, {
		client_id: XAI_OAUTH_CLIENT_ID,
		scope: XAI_OAUTH_SCOPE
	});
	const json = asOptionalRecord(await readJsonResponse(response, "xAI device code request")) ?? {};
	const deviceCode = readNonBlankString(json.device_code);
	const userCode = readNonBlankString(json.user_code);
	const verificationUri = readNonBlankString(json.verification_uri);
	const verificationUriComplete = readNonBlankString(json.verification_uri_complete);
	if (!deviceCode || !userCode || !verificationUri) throw new Error("xAI device code response is missing device_code, user_code, or verification_uri");
	const trustedVerificationUri = requireTrustedXaiOAuthEndpoint(verificationUri, "device verification URI");
	const trustedVerificationUriComplete = verificationUriComplete ? requireTrustedXaiOAuthEndpoint(verificationUriComplete, "complete device verification URI") : void 0;
	return {
		deviceCode,
		userCode,
		verificationUri: trustedVerificationUri,
		...trustedVerificationUriComplete ? { verificationUriComplete: trustedVerificationUriComplete } : {},
		expiresInMs: positiveSecondsToSafeMilliseconds(json.expires_in) ?? XAI_OAUTH_TIMEOUT_MS,
		intervalMs: positiveSecondsToSafeMilliseconds(json.interval) ?? XAI_DEVICE_CODE_DEFAULT_INTERVAL_MS
	};
}
function resolveNextXaiDeviceCodePollDelayMs(intervalMs, deadlineMs) {
	const remainingMs = Math.max(0, deadlineMs - Date.now());
	return Math.min(Math.max(intervalMs, XAI_DEVICE_CODE_MIN_INTERVAL_MS), remainingMs);
}
async function pollXaiDeviceCodeToken(params) {
	const deadlineMs = Date.now() + params.expiresInMs;
	let intervalMs = params.intervalMs;
	while (Date.now() < deadlineMs) {
		const result = await fetchXaiOAuth(requireTrustedXaiOAuthEndpoint(params.tokenEndpoint, "token endpoint"), params, {
			grant_type: XAI_DEVICE_CODE_GRANT_TYPE,
			client_id: XAI_OAUTH_CLIENT_ID,
			device_code: params.deviceCode
		});
		const { response } = result;
		let body;
		try {
			body = (await readResponseBody(result, { fatalUtf8: true })).json;
		} catch {
			body = null;
		}
		if (response.ok) return parseXaiOAuthTokenResponse(body, params.now ?? Date.now, { requireRefreshToken: true });
		const error = readStringValue(asOptionalRecord(body)?.error);
		if (error === "authorization_pending" || error === "slow_down") {
			if (error === "slow_down") intervalMs += XAI_DEVICE_CODE_SLOW_DOWN_INCREMENT_MS;
			await waitForXaiDeviceCodePoll(resolveNextXaiDeviceCodePollDelayMs(intervalMs, deadlineMs), params.signal);
			continue;
		}
		if (error === "access_denied" || error === "authorization_denied") throw new Error("xAI device authorization was denied");
		if (error === "expired_token") throw new Error("xAI device code expired. Re-run the login.");
		throw new Error(formatXaiOAuthError({
			context: "xAI device token exchange",
			status: response.status,
			body
		}));
	}
	throw new Error("xAI device authorization timed out");
}
async function waitForXaiDeviceCodePoll(delayMs, signal) {
	if (!signal) {
		await new Promise((resolve) => {
			setTimeout(resolve, delayMs);
		});
		return;
	}
	await new Promise((resolve, reject) => {
		const onAbort = () => {
			clearTimeout(timeout);
			reject(signal.reason instanceof Error ? signal.reason : /* @__PURE__ */ new Error("xAI login cancelled"));
		};
		const timeout = setTimeout(() => {
			signal.removeEventListener("abort", onAbort);
			resolve();
		}, delayMs);
		signal.addEventListener("abort", onAbort, { once: true });
		if (signal.aborted) onAbort();
	});
}
function decodeJwtPayload(token) {
	if (!token) return {};
	const part = token.split(".")[1];
	if (!part) return {};
	try {
		return asOptionalRecord(JSON.parse(Buffer.from(part, "base64url").toString("utf8"))) ?? {};
	} catch {
		return {};
	}
}
function resolveXaiOAuthIdentity(tokens) {
	const payload = decodeJwtPayload(tokens.idToken ?? tokens.accessToken);
	const email = typeof payload.email === "string" ? payload.email : void 0;
	const name = typeof payload.name === "string" ? payload.name : void 0;
	const sub = typeof payload.sub === "string" ? payload.sub : void 0;
	return {
		...email ? { email } : {},
		...name ? { displayName: name } : {},
		...sub ? { accountId: sub } : {}
	};
}
function isLegacyXaiOAuthTokenEndpoint(endpoint) {
	const url = URL.parse(endpoint);
	return url !== null && `${url.origin}${url.pathname}` === XAI_LEGACY_OAUTH_TOKEN_ENDPOINT;
}
async function resolveXaiOAuthRefreshTokenEndpoint(credential, options) {
	const cachedEndpoint = normalizeOptionalString(credential.tokenEndpoint);
	if (!cachedEndpoint || isLegacyXaiOAuthTokenEndpoint(cachedEndpoint)) {
		const discovery = await fetchXaiOAuthDiscoveryDocument(options);
		if (typeof discovery.token_endpoint !== "string") throw new Error("xAI OAuth discovery response is missing the token endpoint");
		return requireTrustedXaiOAuthEndpoint(discovery.token_endpoint, "token endpoint");
	}
	return cachedEndpoint;
}
async function noteXaiDeviceCode(ctx, deviceCode) {
	const expiresInMinutes = Math.max(1, Math.round(deviceCode.expiresInMs / 6e4));
	if (ctx.prompter.deviceCode) {
		await ctx.prompter.deviceCode({
			title: "xAI OAuth",
			code: deviceCode.userCode,
			expiresInMinutes,
			message: "Enter this one-time code on the sign-in page."
		});
		return;
	}
	await ctx.prompter.note([
		ctx.isRemote ? "Open this URL in your LOCAL browser and enter the code below." : "Open this URL in your browser and enter the code below.",
		`URL: <${deviceCode.verificationUriComplete ?? deviceCode.verificationUri}>`,
		`Code: ${deviceCode.userCode}`,
		`Code expires in ${expiresInMinutes} minutes. Never share it.`
	].join("\n"), "xAI OAuth");
}
async function loginXaiDeviceCode(ctx) {
	const progress = ctx.prompter.progress("Starting xAI OAuth...");
	const requestOptions = {
		signal: ctx.signal,
		assertCurrent: ctx.assertCurrent
	};
	try {
		const discovery = await fetchXaiDeviceCodeDiscovery(requestOptions);
		progress.update("Requesting xAI OAuth device code...");
		const deviceCode = await requestXaiDeviceCode({
			deviceAuthorizationEndpoint: discovery.deviceAuthorizationEndpoint,
			...requestOptions
		});
		const browserUrl = deviceCode.verificationUriComplete ?? deviceCode.verificationUri;
		let openedBrowser = false;
		try {
			await ctx.openUrl(browserUrl);
			openedBrowser = true;
		} catch {
			ctx.runtime.log(`Open manually: ${deviceCode.verificationUri}`);
		}
		await noteXaiDeviceCode(ctx, deviceCode);
		const logUrl = deviceCode.verificationUri;
		if (ctx.isRemote) ctx.runtime.log(`\nOpen this URL in your LOCAL browser:\n\n${logUrl}\n`);
		else if (openedBrowser) ctx.runtime.log(`Open: ${logUrl}`);
		progress.update("Waiting for xAI device authorization...");
		const tokens = await pollXaiDeviceCodeToken({
			tokenEndpoint: discovery.tokenEndpoint,
			deviceCode: deviceCode.deviceCode,
			expiresInMs: deviceCode.expiresInMs,
			intervalMs: deviceCode.intervalMs,
			...requestOptions
		});
		const identity = resolveXaiOAuthIdentity(tokens);
		const provider = ctx.credentialOnly ? buildXaiProvider("openai-responses", "oauth") : await buildLiveXaiOAuthProvider({
			discoveryApiKey: tokens.accessToken,
			signal: ctx.signal,
			fetchGuard: (params) => fetchWithSsrFGuard({
				...params,
				beforeRequest: ctx.assertCurrent
			})
		});
		progress.stop("xAI OAuth complete");
		return buildOauthProviderAuthResult({
			providerId: PROVIDER_ID,
			defaultModel: XAI_DEFAULT_MODEL_REF,
			access: tokens.accessToken,
			refresh: tokens.refreshToken,
			expires: tokens.expires,
			email: identity.email,
			displayName: identity.displayName,
			profileName: identity.email ?? identity.accountId,
			configPatch: applyXaiOAuthConfig(ctx.credentialOnly ? {} : ctx.config, provider),
			credentialExtra: {
				tokenEndpoint: discovery.tokenEndpoint,
				deviceAuthorizationEndpoint: discovery.deviceAuthorizationEndpoint,
				issuer: XAI_OAUTH_ISSUER,
				authFlow: "device-code",
				...tokens.idToken ? { idToken: tokens.idToken } : {},
				...identity.accountId ? { accountId: identity.accountId } : {}
			},
			notes: ["xAI OAuth uses device-code verification without requiring a localhost callback.", "xAI may label the consent app as Grok Build because OpenClaw uses xAI's shared OAuth client."]
		});
	} catch (err) {
		progress.stop("xAI OAuth failed");
		throw new Error(`xAI OAuth failed: ${formatErrorMessage(err)}`, { cause: err });
	}
}
async function refreshXaiOAuthCredential(credential, options = {}) {
	const refreshToken = credential.refresh;
	if (!refreshToken) throw new Error("xAI OAuth credential is missing refresh token");
	const tokenEndpoint = await resolveXaiOAuthRefreshTokenEndpoint(credential, options);
	const tokens = await requestXaiOAuthRefresh(tokenEndpoint, refreshToken, options);
	return {
		...credential,
		type: "oauth",
		provider: PROVIDER_ID,
		access: tokens.accessToken,
		refresh: tokens.refreshToken ?? refreshToken,
		...tokens.expires ? { expires: tokens.expires } : {},
		...tokens.idToken ? { idToken: tokens.idToken } : {},
		...resolveXaiOAuthIdentity(tokens),
		tokenEndpoint,
		issuer: XAI_OAUTH_ISSUER
	};
}
//#endregion
export { loginXaiDeviceCode, refreshXaiOAuthCredential };
