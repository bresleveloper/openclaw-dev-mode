import { DEFAULT_VYDRA_BASE_URL, normalizeVydraBaseUrl } from "./defaults.js";
import { asOptionalRecord, normalizeOptionalLowercaseString, normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
import { resolveGeneratedMediaMaxBytes } from "openclaw/plugin-sdk/media-generation-runtime";
import { extensionForMime } from "openclaw/plugin-sdk/media-mime";
import { resolveApiKeyForProvider } from "openclaw/plugin-sdk/provider-auth-runtime";
import { assertOkOrThrowHttpError, createProviderOperationDeadline, createProviderOperationTimeoutError, createProviderOperationTimeoutResolver, fetchWithTimeoutGuarded, pollProviderOperationJson, postJsonRequest, readProviderBinaryResponse, readProviderJsonResponse, resolveProviderHttpRequestConfig, resolveProviderOperationTimeoutMs, sanitizeConfiguredModelProviderRequest } from "openclaw/plugin-sdk/provider-http";
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
function resolveVydraResponseJobId(payload) {
	const object = asOptionalRecord(payload);
	return normalizeOptionalString(object?.jobId) ?? normalizeOptionalString(object?.id);
}
function resolveVydraResponseStatus(payload) {
	return normalizeOptionalLowercaseString(asOptionalRecord(payload)?.status);
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
	const urlKeys = [
		`${kind}Url`,
		`${kind}Urls`,
		"resultUrl",
		"resultUrls",
		"outputUrl",
		"outputUrls",
		"url",
		"urls"
	];
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
async function downloadVydraAsset(params) {
	const requestedTimeoutMs = typeof params.timeoutMs === "function" ? params.timeoutMs() : params.timeoutMs;
	const timeoutMs = typeof requestedTimeoutMs === "number" && Number.isFinite(requestedTimeoutMs) && requestedTimeoutMs > 0 ? requestedTimeoutMs : DEFAULT_HTTP_TIMEOUT_MS;
	const deadline = createProviderOperationDeadline({
		timeoutMs,
		label: `Vydra ${params.kind} download`
	});
	const resolveTimeoutMs = createProviderOperationTimeoutResolver({
		deadline,
		defaultTimeoutMs: timeoutMs
	});
	const policy = params.requestPolicy;
	const headers = URL.parse(params.url)?.origin === policy.headerOrigin ? policy.headers : void 0;
	const ssrfPolicy = policy.allowPrivateNetwork ? {
		...policy.ssrfPolicy,
		allowPrivateNetwork: true
	} : policy.ssrfPolicy;
	const result = await fetchWithTimeoutGuarded(params.url, {
		method: "GET",
		...headers ? { headers } : {}
	}, resolveTimeoutMs(), params.fetchFn, {
		...ssrfPolicy ? { ssrfPolicy } : {},
		...policy.dispatcherPolicy ? { dispatcherPolicy: policy.dispatcherPolicy } : {},
		auditContext: "vydra-media-download"
	});
	try {
		await assertOkOrThrowHttpError(result.response, `Vydra ${params.kind} download failed`, {
			bodyTimeoutMs: resolveTimeoutMs,
			onBodyTimeout: () => createProviderOperationTimeoutError(deadline)
		});
		const mimeType = result.response.headers.get("content-type")?.trim() || (params.kind === "image" ? "image/png" : params.kind === "audio" ? "audio/mpeg" : "video/mp4");
		const buffer = await readProviderBinaryResponse(result.response, deadline.label, params.kind, {
			maxBytes: params.maxBytes,
			chunkTimeoutMs: 0,
			timeoutMs: resolveTimeoutMs,
			onTimeout: () => createProviderOperationTimeoutError(deadline),
			onOverflow: ({ maxBytes }) => /* @__PURE__ */ new Error(`${deadline.label} exceeds ${maxBytes} bytes`)
		});
		const extension = extensionForMime(mimeType)?.slice(1) ?? (params.kind === "image" ? "png" : params.kind === "audio" ? "mp3" : "mp4");
		return {
			buffer,
			mimeType,
			fileName: `${params.kind}-1.${extension}`
		};
	} catch (error) {
		if (error instanceof Error && error.name === "TimeoutError") throw createProviderOperationTimeoutError(deadline);
		throw error;
	} finally {
		await result.release();
	}
}
async function runVydraGeneration(params) {
	const auth = await resolveApiKeyForProvider({
		provider: "vydra",
		cfg: params.cfg,
		agentDir: params.agentDir,
		store: params.authStore
	});
	if (!auth.apiKey) throw new Error("Vydra API key missing");
	const fetchFn = fetch;
	const providerConfig = params.cfg.models?.providers?.vydra;
	const { baseUrl, ...http } = resolveProviderHttpRequestConfig({
		baseUrl: normalizeVydraBaseUrl(providerConfig?.baseUrl),
		defaultBaseUrl: DEFAULT_VYDRA_BASE_URL,
		defaultHeaders: {
			Authorization: `Bearer ${auth.apiKey}`,
			"Content-Type": "application/json"
		},
		provider: "vydra",
		capability: params.kind,
		transport: "http",
		request: sanitizeConfiguredModelProviderRequest(providerConfig?.request)
	});
	const requestPolicy = {
		...http,
		headerOrigin: new URL(baseUrl).origin,
		...params.ssrfPolicy ? { ssrfPolicy: params.ssrfPolicy } : {}
	};
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
		const isComplete = (payload) => resolveVydraResponseStatus(payload) === "completed" || extractVydraResultUrls(payload, params.kind).length > 0;
		let completedPayload = submitted;
		if (!isComplete(submitted)) {
			const jobId = resolveVydraResponseJobId(submitted);
			if (!jobId) throw new Error(resolveVydraErrorMessage(submitted) ?? `${operationLabel} response missing job id`);
			completedPayload = await pollProviderOperationJson({
				url: `${baseUrl}/jobs/${jobId}`,
				headers: requestPolicy.headers,
				deadline: deadline ?? createProviderOperationDeadline({
					timeoutMs: params.timeoutMs,
					label: `Vydra job ${jobId}`
				}),
				defaultTimeoutMs: DEFAULT_HTTP_TIMEOUT_MS,
				fetchFn,
				maxAttempts: MAX_POLL_ATTEMPTS,
				pollIntervalMs: POLL_INTERVAL_MS,
				requestFailedMessage: "Vydra job status request failed",
				timeoutMessage: `Vydra job ${jobId} did not finish in time`,
				allowPrivateNetwork: requestPolicy.allowPrivateNetwork,
				ssrfPolicy: requestPolicy.ssrfPolicy,
				dispatcherPolicy: requestPolicy.dispatcherPolicy,
				auditContext: "vydra-job-status",
				isComplete,
				getFailureMessage: (payload) => {
					const status = resolveVydraResponseStatus(payload);
					return status === "failed" || status === "error" || status === "cancelled" ? resolveVydraErrorMessage(payload) ?? `Vydra job ${jobId} failed` : void 0;
				}
			});
		}
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
export { downloadVydraAsset, extractVydraResultUrls, runVydraGeneration };
