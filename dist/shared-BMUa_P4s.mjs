import { D as resolveExpiresAtMsFromDurationMs, E as resolveDateTimestampMs, F as resolveTimerTimeoutMs } from "./number-coercion-CkhMiRw8.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { d as sleepWithAbort } from "./src-Bzfi3cQM.mjs";
import "./backoff-N5Hi0doU.mjs";
import { n as assertOkOrThrowHttpError, o as createProviderHttpError, p as readProviderJsonObjectResponse } from "./provider-http-errors-CjVOxCE5.mjs";
import { f as resolveProviderRequestPolicyConfig, i as buildProviderRequestDispatcherPolicy } from "./provider-request-config-WdycwKIG.mjs";
import { r as fetchWithTimeout } from "./fetch-timeout-AfCp6rSy.mjs";
import { s as shouldUseEnvHttpProxyForUrl } from "./proxy-env-5Nd20RhP.mjs";
import { i as fetchWithSsrFGuard, t as GUARDED_FETCH_MODE } from "./fetch-guard-DRapCKeS.mjs";
import { t as bufferToBlobPart } from "./blob-runtime-CBGGTQ96.mjs";
import { n as isTransientProviderHttpStatus, t as executeProviderOperationWithRetry } from "./operation-retry-B2m6H7IT.mjs";
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
function resolveProviderRequestTimeoutMs(timeoutMs) {
	const resolved = typeof timeoutMs === "function" ? timeoutMs() : timeoutMs;
	if (typeof resolved !== "number" || !Number.isFinite(resolved) || resolved <= 0) return DEFAULT_GUARDED_HTTP_TIMEOUT_MS;
	return resolveTimerTimeoutMs(resolved, DEFAULT_GUARDED_HTTP_TIMEOUT_MS);
}
/** Returns a lazy timeout resolver for code paths that retry or poll multiple HTTP calls. */
function createProviderOperationTimeoutResolver(params) {
	return () => resolveProviderOperationTimeoutMs(params);
}
/** Waits for the next poll interval while respecting the total provider operation deadline. */
async function waitProviderOperationPollInterval(params) {
	const pollIntervalMs = resolveTimerTimeoutMs(params.pollIntervalMs, 1);
	const deadlineAtMs = params.deadline.deadlineAtMs;
	const remainingMs = typeof deadlineAtMs === "number" ? deadlineAtMs - Date.now() : pollIntervalMs;
	if (remainingMs <= 0) throw createProviderOperationTimeoutError(params.deadline);
	await sleepWithAbort(Math.min(pollIntervalMs, remainingMs));
}
/** Poll a provider-owned request without changing its transport or response contract. */
async function pollProviderOperation(params) {
	for (let attempt = 0; attempt < params.maxAttempts; attempt += 1) {
		const payload = await params.read();
		if (params.isComplete(payload)) return payload;
		const failureMessage = params.getFailureMessage?.(payload);
		if (failureMessage) throw new Error(failureMessage);
		await params.wait();
	}
	throw new Error(params.timeoutMessage);
}
async function pollProviderOperationJson(params) {
	const { deadline } = params;
	const bodyReadOptions = {
		timeoutMs: createProviderOperationTimeoutResolver({
			deadline,
			defaultTimeoutMs: params.defaultTimeoutMs
		}),
		onTimeout: () => createProviderOperationTimeoutError(deadline)
	};
	return await pollProviderOperation({
		...params,
		wait: () => waitProviderOperationPollInterval(params),
		read: async () => {
			const init = {
				method: "GET",
				headers: typeof params.headers === "function" ? params.headers() : params.headers
			};
			const timeoutMs = createProviderOperationTimeoutResolver({
				deadline: params.deadline,
				defaultTimeoutMs: params.defaultTimeoutMs
			});
			const result = await fetchProviderOperation({
				stage: "poll",
				url: params.url,
				init,
				timeoutMs,
				fetchFn: params.fetchFn,
				requestFailedMessage: params.requestFailedMessage,
				guardedOptions: resolveGuardedRequestOptions(params)
			});
			try {
				return await readProviderJsonObjectResponse(result.response, params.requestFailedMessage, bodyReadOptions);
			} finally {
				await result.release?.();
			}
		}
	});
}
async function fetchProviderOperationResponse(params) {
	return (await fetchProviderOperation(params)).response;
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
function resolveProviderHttpRequestConfigWithOriginTrust(params) {
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
	const resolved = resolveProviderHttpRequestConfigWithOriginTrust(params);
	return {
		baseUrl: resolved.baseUrl,
		allowPrivateNetwork: resolved.allowPrivateNetwork,
		headers: resolved.headers,
		dispatcherPolicy: resolved.dispatcherPolicy
	};
}
async function fetchWithTimeoutGuarded(url, init, timeoutMs, fetchFn, options) {
	const resolvedMode = options?.mode ?? (!options?.dispatcherPolicy && shouldUseEnvHttpProxyForUrl(url) ? GUARDED_FETCH_MODE.TRUSTED_ENV_PROXY : void 0);
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
function resolveGuardedRequestOptions(params) {
	const ssrfPolicy = params.allowPrivateNetwork ? {
		...params.ssrfPolicy,
		allowPrivateNetwork: true
	} : params.ssrfPolicy;
	const options = {
		...ssrfPolicy ? { ssrfPolicy } : {},
		...params.pinDns !== void 0 ? { pinDns: params.pinDns } : {},
		...params.dispatcherPolicy ? { dispatcherPolicy: params.dispatcherPolicy } : {},
		...params.auditContext ? { auditContext: params.auditContext } : {},
		...params.mode !== void 0 ? { mode: params.mode } : {}
	};
	return Object.keys(options).length > 0 ? options : void 0;
}
async function fetchProviderOperation(params) {
	return await executeProviderOperationWithRetry({
		provider: params.provider ?? "provider-http",
		stage: params.stage,
		retry: params.retry,
		operation: async () => {
			const timeoutMs = resolveProviderRequestTimeoutMs(params.timeoutMs);
			const requestDeadline = createProviderOperationDeadline({
				timeoutMs,
				label: params.requestFailedMessage ?? `${params.provider ?? "provider"} ${params.stage}`
			});
			const result = params.guardedOptions ? await fetchWithTimeoutGuarded(params.url, params.init ?? {}, timeoutMs, params.fetchFn, params.guardedOptions) : {
				response: await fetchWithTimeout(params.url, params.init ?? {}, timeoutMs, params.fetchFn),
				release: void 0
			};
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
				await result.release?.();
				throw error;
			}
		}
	});
}
async function postGuardedRequest(params) {
	const init = {
		method: "POST",
		headers: params.headers,
		body: params.body,
		...params.signal ? { signal: params.signal } : {}
	};
	const guardedOptions = resolveGuardedRequestOptions(params);
	const operation = async () => {
		params.signal?.throwIfAborted();
		const result = await fetchWithTimeoutGuarded(params.url, init, params.timeoutMs, params.fetchFn, guardedOptions);
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
		signal: params.signal,
		operation
	});
}
async function postJsonRequest(params) {
	return await postGuardedRequest({
		...params,
		body: JSON.stringify(params.body)
	});
}
async function postMultipartRequest(params) {
	return await postGuardedRequest(params);
}
/** Empty strings represent silence; missing or non-string transcripts are malformed. */
function requireTranscriptionText(value, missingMessage) {
	if (typeof value !== "string") throw new Error(missingMessage);
	return value.trim();
}
//#endregion
export { resolveProviderOperationTimeoutMs as _, createProviderOperationTimeoutResolver as a, fetchWithTimeoutGuarded as c, postJsonRequest as d, postMultipartRequest as f, resolveProviderHttpRequestConfigWithOriginTrust as g, resolveProviderHttpRequestConfig as h, createProviderOperationTimeoutError as i, pollProviderOperation as l, resolveAudioTranscriptionUploadFileName as m, buildOpenAiCompatibleAuthHeaders as n, fetchProviderDownloadResponse as o, requireTranscriptionText as p, createProviderOperationDeadline as r, fetchProviderOperationResponse as s, buildAudioTranscriptionFormData as t, pollProviderOperationJson as u, waitProviderOperationPollInterval as v };
