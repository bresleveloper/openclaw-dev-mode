import { DEFAULT_VYDRA_BASE_URL, DEFAULT_VYDRA_IMAGE_MODEL, DEFAULT_VYDRA_VIDEO_MODEL, normalizeVydraBaseUrl } from "./defaults.js";
import { resolveGeneratedMediaMaxBytes } from "openclaw/plugin-sdk/media-generation-runtime";
import { extensionForMime } from "openclaw/plugin-sdk/media-mime";
import { resolveApiKeyForProvider } from "openclaw/plugin-sdk/provider-auth-runtime";
import { assertOkOrThrowHttpError, createProviderOperationDeadline, createProviderOperationTimeoutResolver, fetchWithTimeoutGuarded, pollProviderOperationJson, postJsonRequest, readProviderBinaryResponse, readProviderJsonResponse, resolveProviderHttpRequestConfig, resolveProviderOperationTimeoutMs, sanitizeConfiguredModelProviderRequest } from "openclaw/plugin-sdk/provider-http";
import { asOptionalRecord, normalizeOptionalLowercaseString, normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
//#region extensions/vydra/shared.ts
const DEFAULT_HTTP_TIMEOUT_MS = 12e4;
const POLL_INTERVAL_MS = 2500;
const MAX_POLL_ATTEMPTS = 120;
function addUrlValue(value, urls) {
	const normalized = normalizeOptionalString(value);
	if (normalized !== void 0) {
		if (/^https?:\/\//iu.test(normalized)) urls.add(normalized);
		return;
	}
	if (Array.isArray(value)) for (const entry of value) addUrlValue(entry, urls);
}
function resolveVydraBaseUrlFromConfig(cfg) {
	const models = asOptionalRecord(asOptionalRecord(cfg)?.models);
	const providers = asOptionalRecord(models?.providers);
	const vydra = asOptionalRecord(providers?.vydra);
	return normalizeVydraBaseUrl(normalizeOptionalString(vydra?.baseUrl));
}
async function resolveVydraRequestContext(params) {
	const auth = await resolveApiKeyForProvider({
		provider: "vydra",
		cfg: params.cfg,
		agentDir: params.agentDir,
		store: params.authStore
	});
	if (!auth.apiKey) throw new Error("Vydra API key missing");
	const fetchFn = fetch;
	const providerConfig = params.cfg.models?.providers?.vydra;
	const { baseUrl, allowPrivateNetwork, headers, dispatcherPolicy } = resolveProviderHttpRequestConfig({
		baseUrl: resolveVydraBaseUrlFromConfig(params.cfg),
		defaultBaseUrl: DEFAULT_VYDRA_BASE_URL,
		defaultHeaders: {
			Authorization: `Bearer ${auth.apiKey}`,
			"Content-Type": "application/json"
		},
		provider: "vydra",
		capability: params.capability,
		transport: "http",
		request: sanitizeConfiguredModelProviderRequest(providerConfig?.request)
	});
	return {
		fetchFn,
		baseUrl,
		requestPolicy: {
			allowPrivateNetwork,
			dispatcherPolicy,
			headers,
			headerOrigin: new URL(baseUrl).origin,
			...params.ssrfPolicy ? { ssrfPolicy: params.ssrfPolicy } : {}
		}
	};
}
function resolveVydraResponseJobId(payload) {
	const object = asOptionalRecord(payload);
	return normalizeOptionalString(object?.jobId) ?? normalizeOptionalString(object?.id);
}
function resolveVydraResponseStatus(payload) {
	return normalizeOptionalLowercaseString(normalizeOptionalString(asOptionalRecord(payload)?.status));
}
function resolveVydraErrorMessage(payload) {
	const object = asOptionalRecord(payload);
	const error = object?.error;
	if (typeof error === "string" && error.trim()) return error.trim();
	const errorObject = asOptionalRecord(error);
	return normalizeOptionalString(errorObject?.message) ?? normalizeOptionalString(errorObject?.detail) ?? normalizeOptionalString(object?.message);
}
function extractVydraResultUrls(payload, kind) {
	const urls = /* @__PURE__ */ new Set();
	const urlKeys = kind === "audio" ? ["audioUrl", "audioUrls"] : kind === "image" ? ["imageUrl", "imageUrls"] : ["videoUrl", "videoUrls"];
	urlKeys.push("resultUrl", "resultUrls", "outputUrl", "outputUrls", "url", "urls");
	const recurseKeys = [
		"output",
		"outputs",
		"result",
		"results",
		"data",
		"asset",
		"assets"
	];
	const visit = (value, depth = 0) => {
		if (depth > 5) return;
		if (Array.isArray(value)) {
			for (const entry of value) visit(entry, depth + 1);
			return;
		}
		const object = asOptionalRecord(value);
		if (!object) return;
		for (const key of urlKeys) addUrlValue(object[key], urls);
		for (const key of recurseKeys) if (key in object) visit(object[key], depth + 1);
	};
	visit(payload);
	return [...urls];
}
function resolveVydraFileExtension(kind, mimeType) {
	return extensionForMime(mimeType)?.slice(1) ?? (kind === "image" ? "png" : kind === "audio" ? "mp3" : "mp4");
}
function resolveVydraHttpTimeoutMs(timeoutMs) {
	const resolved = typeof timeoutMs === "function" ? timeoutMs() : timeoutMs;
	if (typeof resolved !== "number" || !Number.isFinite(resolved) || resolved <= 0) return DEFAULT_HTTP_TIMEOUT_MS;
	return resolved;
}
function createVydraTimeoutError(deadline) {
	const timeoutLabel = typeof deadline.timeoutMs === "number" ? ` after ${deadline.timeoutMs}ms` : "";
	return /* @__PURE__ */ new Error(`${deadline.label} timed out${timeoutLabel}`);
}
function resolveVydraGuardedRequestOptions(policy) {
	const ssrfPolicy = policy.allowPrivateNetwork ? {
		...policy.ssrfPolicy,
		allowPrivateNetwork: true
	} : policy.ssrfPolicy;
	return {
		...ssrfPolicy ? { ssrfPolicy } : {},
		...policy.dispatcherPolicy ? { dispatcherPolicy: policy.dispatcherPolicy } : {},
		auditContext: "vydra-media-download"
	};
}
function resolveVydraAssetRequestHeaders(url, policy) {
	try {
		return new URL(url).origin === policy.headerOrigin ? policy.headers : void 0;
	} catch {
		return;
	}
}
async function downloadVydraAsset(params) {
	const timeoutMs = resolveVydraHttpTimeoutMs(params.timeoutMs);
	const deadline = createProviderOperationDeadline({
		timeoutMs,
		label: `Vydra ${params.kind} download`
	});
	const resolveTimeoutMs = createProviderOperationTimeoutResolver({
		deadline,
		defaultTimeoutMs: timeoutMs
	});
	const headers = resolveVydraAssetRequestHeaders(params.url, params.requestPolicy);
	const result = await fetchWithTimeoutGuarded(params.url, {
		method: "GET",
		...headers ? { headers } : {}
	}, resolveTimeoutMs(), params.fetchFn, resolveVydraGuardedRequestOptions(params.requestPolicy));
	try {
		try {
			await assertOkOrThrowHttpError(result.response, `Vydra ${params.kind} download failed`, {
				bodyTimeoutMs: resolveTimeoutMs,
				onBodyTimeout: () => createVydraTimeoutError(deadline)
			});
			const mimeType = result.response.headers.get("content-type")?.trim() || (params.kind === "image" ? "image/png" : params.kind === "audio" ? "audio/mpeg" : "video/mp4");
			const buffer = await readProviderBinaryResponse(result.response, deadline.label, params.kind, {
				maxBytes: params.maxBytes,
				chunkTimeoutMs: 0,
				timeoutMs: resolveTimeoutMs,
				onTimeout: () => createVydraTimeoutError(deadline),
				onOverflow: ({ maxBytes }) => /* @__PURE__ */ new Error(`${deadline.label} exceeds ${maxBytes} bytes`)
			});
			const extension = resolveVydraFileExtension(params.kind, mimeType);
			return {
				buffer,
				mimeType,
				fileName: `${params.kind === "image" ? "image" : params.kind === "audio" ? "audio" : "video"}-1.${extension}`
			};
		} catch (error) {
			if (error instanceof Error && error.name === "TimeoutError") throw createVydraTimeoutError(deadline);
			throw error;
		}
	} finally {
		await result.release();
	}
}
async function waitForVydraJob(params) {
	const deadline = params.deadline ?? createProviderOperationDeadline({
		timeoutMs: params.timeoutMs,
		label: `Vydra job ${params.jobId}`
	});
	return await pollProviderOperationJson({
		url: `${params.baseUrl}/jobs/${params.jobId}`,
		headers: params.requestPolicy.headers,
		deadline,
		defaultTimeoutMs: DEFAULT_HTTP_TIMEOUT_MS,
		fetchFn: params.fetchFn,
		maxAttempts: MAX_POLL_ATTEMPTS,
		pollIntervalMs: POLL_INTERVAL_MS,
		requestFailedMessage: "Vydra job status request failed",
		timeoutMessage: `Vydra job ${params.jobId} did not finish in time`,
		allowPrivateNetwork: params.requestPolicy.allowPrivateNetwork,
		ssrfPolicy: params.requestPolicy.ssrfPolicy,
		dispatcherPolicy: params.requestPolicy.dispatcherPolicy,
		auditContext: "vydra-job-status",
		isComplete: (payload) => resolveVydraResponseStatus(payload) === "completed" || extractVydraResultUrls(payload, params.kind).length > 0,
		getFailureMessage: (payload) => {
			const status = resolveVydraResponseStatus(payload);
			return status === "failed" || status === "error" || status === "cancelled" ? resolveVydraErrorMessage(payload) ?? `Vydra job ${params.jobId} failed` : void 0;
		}
	});
}
async function resolveCompletedVydraPayload(params) {
	if (resolveVydraResponseStatus(params.submitted) === "completed" || extractVydraResultUrls(params.submitted, params.kind).length > 0) return params.submitted;
	const jobId = resolveVydraResponseJobId(params.submitted);
	if (!jobId) throw new Error(resolveVydraErrorMessage(params.submitted) ?? params.missingJobIdMessage);
	return waitForVydraJob({
		baseUrl: params.baseUrl,
		jobId,
		timeoutMs: params.timeoutMs,
		...params.deadline ? { deadline: params.deadline } : {},
		fetchFn: params.fetchFn,
		kind: params.kind,
		requestPolicy: params.requestPolicy
	});
}
async function runVydraGeneration(params) {
	const { fetchFn, baseUrl, requestPolicy } = await resolveVydraRequestContext({
		cfg: params.cfg,
		agentDir: params.agentDir,
		authStore: params.authStore,
		capability: params.kind,
		...params.ssrfPolicy ? { ssrfPolicy: params.ssrfPolicy } : {}
	});
	const operationLabel = `Vydra ${params.kind} generation`;
	const deadline = params.deadlineTimeoutMs === void 0 ? void 0 : createProviderOperationDeadline({
		timeoutMs: params.deadlineTimeoutMs,
		label: operationLabel
	});
	const timeoutMs = deadline ? resolveProviderOperationTimeoutMs({
		deadline,
		defaultTimeoutMs: DEFAULT_HTTP_TIMEOUT_MS
	}) : params.timeoutMs;
	const { response, release } = await postJsonRequest({
		url: `${baseUrl}/models/${params.model}`,
		headers: requestPolicy.headers,
		body: params.body,
		timeoutMs,
		fetchFn,
		allowPrivateNetwork: requestPolicy.allowPrivateNetwork,
		...requestPolicy.ssrfPolicy ? { ssrfPolicy: requestPolicy.ssrfPolicy } : {},
		dispatcherPolicy: requestPolicy.dispatcherPolicy
	});
	try {
		await assertOkOrThrowHttpError(response, `${operationLabel} failed`);
		const submitted = await readProviderJsonResponse(response, params.kind === "image" ? "vydra.image-generation" : operationLabel);
		const completedPayload = await resolveCompletedVydraPayload({
			submitted,
			baseUrl,
			...deadline ? { deadline } : { timeoutMs: params.timeoutMs },
			fetchFn,
			kind: params.kind,
			missingJobIdMessage: `${operationLabel} response missing job id`,
			requestPolicy
		});
		const resultUrl = extractVydraResultUrls(completedPayload, params.kind)[0];
		if (!resultUrl) throw new Error(`${operationLabel} completed without a ${params.kind} URL`);
		const asset = await downloadVydraAsset({
			url: resultUrl,
			kind: params.kind,
			timeoutMs: deadline ? createProviderOperationTimeoutResolver({
				deadline,
				defaultTimeoutMs: DEFAULT_HTTP_TIMEOUT_MS
			}) : params.timeoutMs,
			fetchFn,
			maxBytes: resolveGeneratedMediaMaxBytes(params.cfg, params.kind),
			requestPolicy
		});
		const jobId = resolveVydraResponseJobId(completedPayload) ?? resolveVydraResponseJobId(submitted);
		return {
			asset,
			...jobId ? { jobId } : {},
			resultUrl,
			status: resolveVydraResponseStatus(completedPayload) ?? "completed"
		};
	} finally {
		await release();
	}
}
//#endregion
export { DEFAULT_VYDRA_IMAGE_MODEL, DEFAULT_VYDRA_VIDEO_MODEL, downloadVydraAsset, extractVydraResultUrls, runVydraGeneration };
