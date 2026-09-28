import { D as resolveExpiresAtMsFromDurationMs, E as resolveDateTimestampMs, F as resolveTimerTimeoutMs } from "./number-coercion-CLj0HTDM.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { c as shouldUseEnvHttpProxyForUrl } from "./proxy-env-BwCPCI9p.mjs";
import { n as assertOkOrThrowHttpError, o as createProviderHttpError, p as readProviderJsonObjectResponse } from "./provider-http-errors-CTY_-ABT.mjs";
import { r as fetchWithTimeout } from "./fetch-timeout-BOG6Do5a.mjs";
import { i as fetchWithSsrFGuard, t as GUARDED_FETCH_MODE } from "./fetch-guard-EFfAF2PS.mjs";
import { f as resolveProviderRequestPolicyConfig, i as buildProviderRequestDispatcherPolicy } from "./provider-request-config-DOrVD029.mjs";
import { t as bufferToBlobPart } from "./blob-runtime-CBGGTQ96.mjs";
import { n as isTransientProviderHttpStatus, t as executeProviderOperationWithRetry } from "./operation-retry-Dopl7EnK.mjs";
import path from "node:path";
//#region src/media-understanding/shared.ts
const DEFAULT_GUARDED_HTTP_TIMEOUT_MS = 6e4;
const MAX_AUDIT_CONTEXT_CHARS = 80;
function buildOpenAiCompatibleAuthHeaders(params) {
	const apiKey = params.auth?.kind === "api-key" ? params.auth.apiKey : params.apiKey;
	return params.auth?.kind === "none" || !apiKey ? void 0 : { authorization: `Bearer ${apiKey}` };
}
/** Resolves the multipart upload filename, mapping AAC inputs to provider-friendly `.m4a`. */
function resolveAudioTranscriptionUploadFileName(fileName, mime) {
	const trimmed = fileName?.trim();
	const baseName = trimmed ? path.basename(trimmed) : "audio";
	const lowerMime = mime?.trim().toLowerCase();
	if (/\.aac$/i.test(baseName)) return `${baseName.slice(0, -4) || "audio"}.m4a`;
	if (!path.extname(baseName) && lowerMime === "audio/aac") return `${baseName || "audio"}.m4a`;
	return baseName;
}
/** Places options before the audio file so streaming multipart parsers can apply them. */
function buildAudioTranscriptionFormData(params) {
	const form = new FormData();
	const blob = new Blob([bufferToBlobPart(params.buffer)], { type: params.mime ?? "application/octet-stream" });
	for (const [name, value] of Object.entries(params.fields ?? {})) {
		const text = typeof value === "string" ? value.trim() : value == null ? "" : String(value);
		if (text) form.append(name, text);
	}
	form.append("file", blob, resolveAudioTranscriptionUploadFileName(params.fileName, params.mime));
	return form;
}
/** Creates a timer-safe absolute deadline, resolving a lazy total timeout exactly once. */
function createProviderOperationDeadline(params) {
	const timeoutMs = typeof params.timeoutMs === "function" ? params.timeoutMs() : params.timeoutMs;
	if (typeof timeoutMs !== "number" || !Number.isFinite(timeoutMs) || timeoutMs <= 0) return { label: params.label };
	const resolvedTimeoutMs = resolveTimerTimeoutMs(timeoutMs, 1);
	return {
		deadlineAtMs: resolveExpiresAtMsFromDurationMs(resolvedTimeoutMs) ?? resolveDateTimestampMs(Date.now()),
		label: params.label,
		timeoutMs: resolvedTimeoutMs
	};
}
/** Resolves a per-request timeout without exceeding the remaining operation deadline. */
function resolveProviderOperationTimeoutMs(params) {
	const defaultTimeoutMs = resolveTimerTimeoutMs(params.defaultTimeoutMs, 1);
	const deadlineAtMs = params.deadline.deadlineAtMs;
	if (typeof deadlineAtMs !== "number") return defaultTimeoutMs;
	const remainingMs = deadlineAtMs - Date.now();
	if (remainingMs <= 0) throw createProviderOperationTimeoutError(params.deadline);
	return Math.max(1, Math.min(defaultTimeoutMs, remainingMs));
}
/** Builds the canonical error for an exhausted provider operation deadline. */
function createProviderOperationTimeoutError(deadline) {
	const timeoutLabel = typeof deadline.timeoutMs === "number" ? ` after ${deadline.timeoutMs}ms` : "";
	return /* @__PURE__ */ new Error(`${deadline.label} timed out${timeoutLabel}`);
}
/** Resolves a static or lazy request timeout with a validated fallback. */
function resolveProviderRequestTimeoutMs(params) {
	const resolved = typeof params.timeoutMs === "function" ? params.timeoutMs() : params.timeoutMs;
	const fallback = resolveTimerTimeoutMs(params.defaultTimeoutMs, DEFAULT_GUARDED_HTTP_TIMEOUT_MS);
	if (typeof resolved !== "number" || !Number.isFinite(resolved) || resolved <= 0) return fallback;
	return resolveTimerTimeoutMs(resolved, fallback);
}
/** Returns lazy body-read options tied to the same absolute provider operation deadline. */
function createProviderOperationBodyReadOptions(params) {
	return {
		timeoutMs: createProviderOperationTimeoutResolver(params),
		onTimeout: () => createProviderOperationTimeoutError(params.deadline)
	};
}
/** Returns a lazy timeout resolver for code paths that retry or poll multiple HTTP calls. */
function createProviderOperationTimeoutResolver(params) {
	return () => resolveProviderOperationTimeoutMs(params);
}
/** Waits for the next poll interval while respecting the total provider operation deadline. */
async function waitProviderOperationPollInterval(params) {
	const pollIntervalMs = resolveTimerTimeoutMs(params.pollIntervalMs, 1);
	const deadlineAtMs = params.deadline.deadlineAtMs;
	if (typeof deadlineAtMs !== "number") {
		await new Promise((resolve) => {
			setTimeout(resolve, pollIntervalMs);
		});
		return;
	}
	const remainingMs = deadlineAtMs - Date.now();
	if (remainingMs <= 0) throw createProviderOperationTimeoutError(params.deadline);
	await new Promise((resolve) => {
		setTimeout(resolve, Math.min(pollIntervalMs, remainingMs));
	});
}
async function pollProviderOperationJson(params) {
	const bodyReadOptions = createProviderOperationBodyReadOptions({
		deadline: params.deadline,
		defaultTimeoutMs: params.defaultTimeoutMs
	});
	for (let attempt = 0; attempt < params.maxAttempts; attempt += 1) {
		const init = {
			method: "GET",
			headers: typeof params.headers === "function" ? params.headers() : params.headers
		};
		const timeoutMs = createProviderOperationTimeoutResolver({
			deadline: params.deadline,
			defaultTimeoutMs: params.defaultTimeoutMs
		});
		const guardedOptions = resolveGuardedRequestOptions(params);
		const payload = guardedOptions ? await (async () => {
			const result = await fetchGuardedProviderOperationResponse({
				stage: "poll",
				url: params.url,
				init,
				timeoutMs,
				fetchFn: params.fetchFn,
				requestFailedMessage: params.requestFailedMessage,
				guardedOptions
			});
			try {
				return await readProviderJsonObjectResponse(result.response, params.requestFailedMessage, bodyReadOptions);
			} finally {
				await result.release();
			}
		})() : await readProviderJsonObjectResponse(await fetchProviderOperationResponse({
			stage: "poll",
			url: params.url,
			init,
			timeoutMs,
			fetchFn: params.fetchFn,
			requestFailedMessage: params.requestFailedMessage
		}), params.requestFailedMessage, bodyReadOptions);
		if (params.isComplete(payload)) return payload;
		const failureMessage = params.getFailureMessage?.(payload);
		if (failureMessage) throw new Error(failureMessage);
		await waitProviderOperationPollInterval({
			deadline: params.deadline,
			pollIntervalMs: params.pollIntervalMs
		});
	}
	throw new Error(params.timeoutMessage);
}
async function fetchProviderOperationResponse(params) {
	return await executeProviderOperationWithRetry({
		provider: params.provider ?? "provider-http",
		stage: params.stage,
		retry: params.retry,
		operation: async () => {
			const timeoutMs = resolveProviderRequestTimeoutMs({
				timeoutMs: params.timeoutMs,
				defaultTimeoutMs: DEFAULT_GUARDED_HTTP_TIMEOUT_MS
			});
			const requestDeadline = createProviderOperationDeadline({
				timeoutMs,
				label: params.requestFailedMessage ?? `${params.provider ?? "provider"} ${params.stage}`
			});
			const response = await fetchWithTimeout(params.url, params.init ?? {}, timeoutMs, params.fetchFn);
			if (params.requestFailedMessage) await assertOkOrThrowHttpError(response, params.requestFailedMessage, {
				bodyTimeoutMs: createProviderOperationTimeoutResolver({
					deadline: requestDeadline,
					defaultTimeoutMs: timeoutMs
				}),
				onBodyTimeout: () => createProviderOperationTimeoutError(requestDeadline)
			});
			return response;
		}
	});
}
/**
* Fetches generated-asset response headers and bounded error details under an absolute deadline.
* Successful-body readers must reuse the same deadline so header time cannot reset the budget.
*/
async function fetchProviderDownloadResponse(params) {
	const deadline = params.deadline ?? createProviderOperationDeadline({
		timeoutMs: params.timeoutMs,
		label: params.requestFailedMessage
	});
	return await fetchProviderOperationResponse({
		stage: "download",
		url: params.url,
		init: params.init,
		timeoutMs: createProviderOperationTimeoutResolver({
			deadline,
			defaultTimeoutMs: deadline.timeoutMs ?? DEFAULT_GUARDED_HTTP_TIMEOUT_MS
		}),
		fetchFn: params.fetchFn,
		provider: params.provider,
		requestFailedMessage: params.requestFailedMessage,
		retry: params.retry
	});
}
function resolveGuardedHttpTimeoutMs(timeoutMs) {
	if (typeof timeoutMs !== "number" || !Number.isFinite(timeoutMs) || timeoutMs <= 0) return DEFAULT_GUARDED_HTTP_TIMEOUT_MS;
	return timeoutMs;
}
function sanitizeAuditContext(auditContext) {
	const cleaned = auditContext?.replace(/\p{Cc}+/gu, " ").replace(/\s+/g, " ").trim();
	if (!cleaned) return;
	return truncateUtf16Safe(cleaned, MAX_AUDIT_CONTEXT_CHARS);
}
function resolveProviderHttpRequestConfigWithOriginTrustInternal(params) {
	const requestConfig = resolveProviderRequestPolicyConfig({
		provider: params.provider ?? "",
		baseUrl: params.baseUrl,
		defaultBaseUrl: params.defaultBaseUrl,
		capability: params.capability ?? "other",
		transport: params.transport ?? "http",
		callerHeaders: params.headers ? Object.fromEntries(new Headers(params.headers).entries()) : void 0,
		providerHeaders: params.defaultHeaders,
		precedence: "caller-wins",
		allowPrivateNetwork: params.allowPrivateNetwork,
		api: params.api,
		request: params.request
	});
	const headers = new Headers(requestConfig.headers);
	if (!requestConfig.baseUrl) throw new Error("Missing baseUrl: provide baseUrl or defaultBaseUrl");
	return {
		baseUrl: requestConfig.baseUrl,
		allowPrivateNetwork: requestConfig.allowPrivateNetwork,
		headers,
		dispatcherPolicy: buildProviderRequestDispatcherPolicy(requestConfig),
		trustConfiguredBaseUrlOrigin: requestConfig.trustConfiguredBaseUrlOrigin
	};
}
function resolveProviderHttpRequestConfig(params) {
	const resolved = resolveProviderHttpRequestConfigWithOriginTrustInternal(params);
	return {
		baseUrl: resolved.baseUrl,
		allowPrivateNetwork: resolved.allowPrivateNetwork,
		headers: resolved.headers,
		dispatcherPolicy: resolved.dispatcherPolicy
	};
}
function resolveProviderHttpRequestConfigWithOriginTrust(params) {
	return resolveProviderHttpRequestConfigWithOriginTrustInternal(params);
}
/**
* Decide whether to auto-upgrade a provider HTTP request into
* `TRUSTED_ENV_PROXY` mode based on the runtime environment.
*
* This is gated conservatively to avoid the SSRF bypasses the initial
* auto-upgrade path exposed (see openclaw#64974 review threads):
*
* 1. If the caller supplied an explicit `dispatcherPolicy` — custom proxy URL,
*    `proxyTls`, or `connect` options — do NOT override it. Trusted-env mode
*    builds an `EnvHttpProxyAgent` that would silently drop those overrides,
*    breaking enterprise proxy/mTLS configs.
*
* 2. Only auto-upgrade when `HTTP_PROXY` or `HTTPS_PROXY` (lower- or
*    upper-case) is configured for the target protocol. `ALL_PROXY` is
*    explicitly ignored by `EnvHttpProxyAgent`, so counting it would
*    auto-upgrade requests that then make direct connections while skipping
*    pinned-DNS/SSRF hostname checks.
*
* 3. If `NO_PROXY` would bypass the proxy for this target, do NOT auto-upgrade.
*    `EnvHttpProxyAgent` makes direct connections for `NO_PROXY` matches, but
*    in `TRUSTED_ENV_PROXY` mode `fetchWithSsrFGuard` skips
*    `resolvePinnedHostnameWithPolicy` — so those direct connections would
*    bypass SSRF protection. Keep strict mode for `NO_PROXY` matches.
*/
function shouldAutoUpgradeToTrustedEnvProxy(params) {
	if (params.dispatcherPolicy) return false;
	return shouldUseEnvHttpProxyForUrl(params.url);
}
async function fetchWithTimeoutGuarded(url, init, timeoutMs, fetchFn, options) {
	const resolvedMode = options?.mode ?? (shouldAutoUpgradeToTrustedEnvProxy({
		url,
		dispatcherPolicy: options?.dispatcherPolicy
	}) ? GUARDED_FETCH_MODE.TRUSTED_ENV_PROXY : void 0);
	return await fetchWithSsrFGuard({
		url,
		fetchImpl: fetchFn,
		init,
		timeoutMs: resolveGuardedHttpTimeoutMs(timeoutMs),
		policy: options?.ssrfPolicy,
		lookupFn: options?.lookupFn,
		pinDns: options?.pinDns,
		dispatcherPolicy: options?.dispatcherPolicy,
		auditContext: sanitizeAuditContext(options?.auditContext),
		...resolvedMode ? { mode: resolvedMode } : {}
	});
}
function mergeGuardedRequestSsrfPolicy(params) {
	if (!params.ssrfPolicy) return params.allowPrivateNetwork ? { allowPrivateNetwork: true } : void 0;
	if (!params.allowPrivateNetwork) return params.ssrfPolicy;
	return {
		...params.ssrfPolicy,
		allowPrivateNetwork: true
	};
}
function resolveGuardedRequestOptions(params) {
	if (!params.allowPrivateNetwork && !params.ssrfPolicy && !params.dispatcherPolicy && params.pinDns === void 0 && !params.auditContext && params.mode === void 0) return;
	const ssrfPolicy = mergeGuardedRequestSsrfPolicy(params);
	return {
		...ssrfPolicy ? { ssrfPolicy } : {},
		...params.pinDns !== void 0 ? { pinDns: params.pinDns } : {},
		...params.dispatcherPolicy ? { dispatcherPolicy: params.dispatcherPolicy } : {},
		...params.auditContext ? { auditContext: params.auditContext } : {},
		...params.mode !== void 0 ? { mode: params.mode } : {}
	};
}
async function fetchGuardedProviderOperationResponse(params) {
	return await executeProviderOperationWithRetry({
		provider: params.provider ?? "provider-http",
		stage: params.stage,
		retry: params.retry,
		operation: async () => {
			const timeoutMs = resolveProviderRequestTimeoutMs({
				timeoutMs: params.timeoutMs,
				defaultTimeoutMs: DEFAULT_GUARDED_HTTP_TIMEOUT_MS
			});
			const requestDeadline = createProviderOperationDeadline({
				timeoutMs,
				label: params.requestFailedMessage ?? `${params.provider ?? "provider"} ${params.stage}`
			});
			const result = await fetchWithTimeoutGuarded(params.url, params.init, timeoutMs, params.fetchFn, params.guardedOptions);
			try {
				if (params.requestFailedMessage) await assertOkOrThrowHttpError(result.response, params.requestFailedMessage, {
					bodyTimeoutMs: createProviderOperationTimeoutResolver({
						deadline: requestDeadline,
						defaultTimeoutMs: timeoutMs
					}),
					onBodyTimeout: () => createProviderOperationTimeoutError(requestDeadline)
				});
				return result;
			} catch (error) {
				await result.release();
				throw error;
			}
		}
	});
}
async function postGuardedRequest(params) {
	const operation = async () => {
		params.init.signal?.throwIfAborted();
		const result = await fetchWithTimeoutGuarded(params.url, params.init, params.timeoutMs, params.fetchFn, params.guardedOptions);
		if (params.retryStage && isTransientProviderHttpStatus(result.response.status)) try {
			throw await createProviderHttpError(result.response, "provider POST request failed", { statusPrefix: "HTTP " });
		} finally {
			await result.release();
		}
		return result;
	};
	if (!params.retryStage) return await operation();
	return await executeProviderOperationWithRetry({
		provider: "provider-http",
		stage: params.retryStage,
		retry: params.retry,
		signal: params.init.signal ?? void 0,
		operation
	});
}
async function postJsonRequest(params) {
	return await postGuardedRequest({
		url: params.url,
		init: {
			method: "POST",
			headers: params.headers,
			body: JSON.stringify(params.body),
			...params.signal ? { signal: params.signal } : {}
		},
		timeoutMs: params.timeoutMs,
		fetchFn: params.fetchFn,
		guardedOptions: resolveGuardedRequestOptions(params),
		retryStage: params.retryStage,
		retry: params.retry
	});
}
async function postMultipartRequest(params) {
	return await postGuardedRequest({
		url: params.url,
		init: {
			method: "POST",
			headers: params.headers,
			body: params.body,
			...params.signal ? { signal: params.signal } : {}
		},
		timeoutMs: params.timeoutMs,
		fetchFn: params.fetchFn,
		guardedOptions: resolveGuardedRequestOptions(params),
		retryStage: params.retryStage,
		retry: params.retry
	});
}
function requireTranscriptionText(value, missingMessage) {
	const text = value?.trim();
	if (!text) throw new Error(missingMessage);
	return text;
}
//#endregion
export { fetchProviderDownloadResponse as a, pollProviderOperationJson as c, requireTranscriptionText as d, resolveAudioTranscriptionUploadFileName as f, waitProviderOperationPollInterval as g, resolveProviderOperationTimeoutMs as h, createProviderOperationTimeoutResolver as i, postJsonRequest as l, resolveProviderHttpRequestConfigWithOriginTrust as m, buildOpenAiCompatibleAuthHeaders as n, fetchProviderOperationResponse as o, resolveProviderHttpRequestConfig as p, createProviderOperationDeadline as r, fetchWithTimeoutGuarded as s, buildAudioTranscriptionFormData as t, postMultipartRequest as u };
