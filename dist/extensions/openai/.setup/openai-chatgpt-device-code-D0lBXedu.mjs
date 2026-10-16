import { n as withOpenAIOAuthResponse, t as createOpenAIAuthorizationCodeForm } from "./openai-oauth-http.runtime-CYYBufQ-.mjs";
import { asNullableObjectRecord, normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
import { positiveSecondsToSafeMilliseconds, resolveExpiresAtMsFromDurationSeconds } from "openclaw/plugin-sdk/number-runtime";
import { collectErrorGraphCandidates, extractErrorCode } from "openclaw/plugin-sdk/error-runtime";
import { shouldUseEnvHttpProxyForUrl, withTrustedEnvProxyGuardedFetchMode } from "openclaw/plugin-sdk/fetch-runtime";
import { resolveOpenAICodexAccessTokenExpiry } from "openclaw/plugin-sdk/provider-auth";
import { readResponseTextLimited } from "openclaw/plugin-sdk/provider-http";
import { classifyTransientNetworkErrorCode } from "openclaw/plugin-sdk/retry-runtime";
//#region extensions/openai/openai-chatgpt-device-code.ts
const OPENAI_AUTH_BASE_URL = "https://auth.openai.com";
const OPENAI_CODEX_CLIENT_ID = "app_EMoamEEZ73f0CkXaXp7hrann";
const OPENAI_CODEX_DEVICE_CODE_TIMEOUT_MS = 9e5;
const OPENAI_CODEX_DEVICE_REQUEST_TIMEOUT_MS = 3e4;
const OPENAI_CODEX_DEVICE_CODE_DEFAULT_INTERVAL_MS = 5e3;
const OPENAI_CODEX_DEVICE_CODE_MIN_INTERVAL_MS = 1e3;
const OPENAI_CODEX_DEVICE_CALLBACK_URL = `${OPENAI_AUTH_BASE_URL}/deviceauth/callback`;
const OPENAI_CODEX_DEVICE_ERROR_BODY_LIMIT_BYTES = 8192;
const OPENAI_CODEX_DEVICE_JSON_BODY_LIMIT_BYTES = 262144;
function resolveOpenAICodexDeviceCodeHeaders(contentType) {
	const version = process.env.OPENCLAW_VERSION?.trim();
	return {
		"Content-Type": contentType,
		originator: "openclaw",
		...version ? { version } : {},
		"User-Agent": version ? `openclaw/${version}` : "openclaw"
	};
}
function parseJsonObject(text) {
	try {
		return asNullableObjectRecord(JSON.parse(text));
	} catch {
		return null;
	}
}
function sanitizeDeviceCodeErrorText(value) {
	const esc = String.fromCharCode(27);
	const ansiCsiRegex = new RegExp(`${esc}\\[[\\u0020-\\u003f]*[\\u0040-\\u007e]`, "g");
	const osc8Regex = new RegExp(`${esc}\\]8;;.*?${esc}\\\\|${esc}\\]8;;${esc}\\\\`, "g");
	const controlCharsRegex = new RegExp(`[${String.fromCharCode(0)}-${String.fromCharCode(31)}${String.fromCharCode(127)}${String.fromCharCode(128)}-${String.fromCharCode(159)}]`, "g");
	return value.replace(osc8Regex, "").replace(ansiCsiRegex, "").replace(controlCharsRegex, " ").replace(/\s+/g, " ").trim();
}
function resolveNextDeviceCodePollDelayMs(intervalMs, deadlineMs) {
	const remainingMs = Math.max(0, deadlineMs - Date.now());
	return Math.min(Math.max(intervalMs, OPENAI_CODEX_DEVICE_CODE_MIN_INTERVAL_MS), remainingMs);
}
function resolveDeviceCodePollRequestTimeoutMs(deadlineMs) {
	return Math.min(OPENAI_CODEX_DEVICE_REQUEST_TIMEOUT_MS, Math.max(0, deadlineMs - Date.now()));
}
function isDeviceCodeOperationTimeoutError(error) {
	return error instanceof Error && (error.name === "TimeoutError" || error.name === "AbortError");
}
function rethrowIfDeviceCodeCallerAborted(signal, error) {
	if (signal?.aborted) throw signal.reason instanceof Error ? signal.reason : error;
}
function formatDeviceCodeError(params) {
	const body = parseJsonObject(params.bodyText);
	const error = normalizeOptionalString(body?.error);
	const description = normalizeOptionalString(body?.error_description);
	const safeError = error ? sanitizeDeviceCodeErrorText(error) : void 0;
	const safeDescription = description ? sanitizeDeviceCodeErrorText(description) : void 0;
	if (safeError && safeDescription) return `${params.prefix}: ${safeError} (${safeDescription})`;
	if (safeError) return `${params.prefix}: ${safeError}`;
	const bodyText = sanitizeDeviceCodeErrorText(params.bodyText);
	return bodyText ? `${params.prefix}: HTTP ${params.status} ${bodyText}` : `${params.prefix}: HTTP ${params.status}`;
}
async function runOpenAICodexDeviceRequest(params) {
	const guardedOptions = {
		url: params.url,
		fetchImpl: params.fetchFn,
		init: params.init,
		timeoutMs: params.timeoutMs,
		...params.signal ? { signal: params.signal } : {},
		beforeRequest: params.assertCurrent,
		requireHttps: true,
		auditContext: "openai-chatgpt-device-code"
	};
	return await withOpenAIOAuthResponse(shouldUseEnvHttpProxyForUrl(params.url) ? withTrustedEnvProxyGuardedFetchMode(guardedOptions) : guardedOptions, async (response) => ({
		ok: response.ok,
		status: response.status,
		bodyText: await readResponseTextLimited(response, response.ok ? OPENAI_CODEX_DEVICE_JSON_BODY_LIMIT_BYTES : OPENAI_CODEX_DEVICE_ERROR_BODY_LIMIT_BYTES, { chunkTimeoutMs: params.timeoutMs })
	}));
}
async function fetchOpenAICodexDeviceCode(params) {
	try {
		return await runOpenAICodexDeviceRequest({
			...params,
			timeoutMs: OPENAI_CODEX_DEVICE_REQUEST_TIMEOUT_MS
		});
	} catch (error) {
		rethrowIfDeviceCodeCallerAborted(params.signal, error);
		if (isDeviceCodeOperationTimeoutError(error)) throw new Error(`OpenAI device code ${params.timeoutOperation} timed out after ${OPENAI_CODEX_DEVICE_REQUEST_TIMEOUT_MS}ms`, { cause: error });
		throw error;
	}
}
async function requestOpenAICodexDeviceCode(fetchFn, signal, assertCurrent) {
	signal?.throwIfAborted();
	const result = await fetchOpenAICodexDeviceCode({
		fetchFn,
		url: `${OPENAI_AUTH_BASE_URL}/api/accounts/deviceauth/usercode`,
		init: {
			method: "POST",
			headers: resolveOpenAICodexDeviceCodeHeaders("application/json"),
			body: JSON.stringify({ client_id: OPENAI_CODEX_CLIENT_ID })
		},
		timeoutOperation: "user code request",
		...signal ? { signal } : {},
		assertCurrent
	});
	if (!result.ok) {
		if (result.status === 404) throw new Error("OpenAI Codex device code login is not enabled for this server. Use ChatGPT OAuth instead.");
		throw new Error(formatDeviceCodeError({
			prefix: "OpenAI device code request failed",
			status: result.status,
			bodyText: result.bodyText
		}));
	}
	const body = parseJsonObject(result.bodyText);
	const deviceAuthId = normalizeOptionalString(body?.device_auth_id);
	const userCode = normalizeOptionalString(body?.user_code) ?? normalizeOptionalString(body?.usercode);
	if (!deviceAuthId || !userCode) throw new Error("OpenAI device code response was missing the device code or user code.");
	return {
		deviceAuthId,
		userCode,
		verificationUrl: `${OPENAI_AUTH_BASE_URL}/codex/device`,
		intervalMs: positiveSecondsToSafeMilliseconds(body?.interval) ?? OPENAI_CODEX_DEVICE_CODE_DEFAULT_INTERVAL_MS
	};
}
async function pollOpenAICodexDeviceCode(params) {
	const deadline = Date.now() + OPENAI_CODEX_DEVICE_CODE_TIMEOUT_MS;
	while (Date.now() < deadline) {
		params.signal?.throwIfAborted();
		const requestTimeoutMs = resolveDeviceCodePollRequestTimeoutMs(deadline);
		if (requestTimeoutMs <= 0) break;
		let result;
		try {
			result = await runOpenAICodexDeviceRequest({
				fetchFn: params.fetchFn,
				url: `${OPENAI_AUTH_BASE_URL}/api/accounts/deviceauth/token`,
				init: {
					method: "POST",
					headers: resolveOpenAICodexDeviceCodeHeaders("application/json"),
					body: JSON.stringify({
						device_auth_id: params.deviceAuthId,
						user_code: params.userCode
					})
				},
				timeoutMs: requestTimeoutMs,
				...params.signal ? { signal: params.signal } : {},
				assertCurrent: params.assertCurrent
			});
		} catch (error) {
			rethrowIfDeviceCodeCallerAborted(params.signal, error);
			if (isDeviceCodeOperationTimeoutError(error)) continue;
			if (!collectErrorGraphCandidates(error, (candidate) => [candidate.cause]).some((candidate) => classifyTransientNetworkErrorCode(extractErrorCode(candidate)) !== void 0)) throw error;
			await waitForDeviceCodePoll(resolveNextDeviceCodePollDelayMs(params.intervalMs, deadline), params.signal);
			continue;
		}
		if (result.ok) {
			const body = parseJsonObject(result.bodyText);
			const authorizationCode = normalizeOptionalString(body?.authorization_code);
			const codeVerifier = normalizeOptionalString(body?.code_verifier);
			if (!authorizationCode || !codeVerifier) throw new Error("OpenAI device authorization response was missing the exchange code.");
			return {
				authorizationCode,
				codeVerifier
			};
		}
		if (result.status === 403 || result.status === 404) {
			await waitForDeviceCodePoll(resolveNextDeviceCodePollDelayMs(params.intervalMs, deadline), params.signal);
			continue;
		}
		throw new Error(formatDeviceCodeError({
			prefix: "OpenAI device authorization failed",
			status: result.status,
			bodyText: result.bodyText
		}));
	}
	throw new Error("OpenAI device authorization timed out after 15 minutes.");
}
async function exchangeOpenAICodexDeviceCode(params) {
	params.signal?.throwIfAborted();
	const result = await fetchOpenAICodexDeviceCode({
		fetchFn: params.fetchFn,
		url: `${OPENAI_AUTH_BASE_URL}/oauth/token`,
		init: {
			method: "POST",
			headers: resolveOpenAICodexDeviceCodeHeaders("application/x-www-form-urlencoded"),
			body: createOpenAIAuthorizationCodeForm({
				code: params.authorizationCode,
				redirectUri: OPENAI_CODEX_DEVICE_CALLBACK_URL,
				clientId: OPENAI_CODEX_CLIENT_ID,
				verifier: params.codeVerifier
			})
		},
		timeoutOperation: "token exchange",
		...params.signal ? { signal: params.signal } : {},
		assertCurrent: params.assertCurrent
	});
	if (!result.ok) throw new Error(formatDeviceCodeError({
		prefix: "OpenAI device token exchange failed",
		status: result.status,
		bodyText: result.bodyText
	}));
	const body = parseJsonObject(result.bodyText);
	const access = normalizeOptionalString(body?.access_token);
	const refresh = normalizeOptionalString(body?.refresh_token);
	if (!access || !refresh) throw new Error("OpenAI token exchange succeeded but did not return OAuth tokens.");
	return {
		access,
		refresh,
		expires: resolveExpiresAtMsFromDurationSeconds(body?.expires_in) ?? resolveOpenAICodexAccessTokenExpiry(access) ?? Date.now()
	};
}
async function loginOpenAICodexDeviceCode(params) {
	const fetchFn = params.fetchFn ?? fetch;
	params.onProgress?.("Requesting device code…");
	const deviceCode = await requestOpenAICodexDeviceCode(fetchFn, params.signal, params.assertCurrent);
	await params.onVerification({
		verificationUrl: deviceCode.verificationUrl,
		userCode: deviceCode.userCode,
		expiresInMs: OPENAI_CODEX_DEVICE_CODE_TIMEOUT_MS
	});
	params.onProgress?.("Waiting for device authorization…");
	const authorization = await pollOpenAICodexDeviceCode({
		fetchFn,
		deviceAuthId: deviceCode.deviceAuthId,
		userCode: deviceCode.userCode,
		intervalMs: deviceCode.intervalMs,
		...params.signal ? { signal: params.signal } : {},
		assertCurrent: params.assertCurrent
	});
	params.onProgress?.("Exchanging device code…");
	return await exchangeOpenAICodexDeviceCode({
		fetchFn,
		authorizationCode: authorization.authorizationCode,
		codeVerifier: authorization.codeVerifier,
		...params.signal ? { signal: params.signal } : {},
		assertCurrent: params.assertCurrent
	});
}
function waitForDeviceCodePoll(ms, signal) {
	if (!signal) return new Promise((resolve) => {
		setTimeout(resolve, ms);
	});
	signal.throwIfAborted();
	return new Promise((resolve, reject) => {
		const timer = setTimeout(() => {
			signal.removeEventListener("abort", onAbort);
			resolve();
		}, ms);
		const onAbort = () => {
			clearTimeout(timer);
			reject(signal.reason instanceof Error ? signal.reason : /* @__PURE__ */ new Error("Device login cancelled"));
		};
		signal.addEventListener("abort", onAbort, { once: true });
	});
}
//#endregion
export { loginOpenAICodexDeviceCode };
