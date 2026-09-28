import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { r as extensionForMime } from "./mime-1zBUMwu6.mjs";
import "./string-coerce-runtime-C_MKhRVt.mjs";
import { t as bufferToBlobPart } from "./blob-runtime-CBGGTQ96.mjs";
import "./media-mime-D8SxWw0k.mjs";
import { i as resolveConfiguredOpenAIBaseUrl } from "./shared-CdZcYfxW.mjs";
//#region extensions/openai/video-generation-provider.ts
const DEFAULT_OPENAI_VIDEO_BASE_URL = "https://api.openai.com/v1";
const DEFAULT_OPENAI_VIDEO_MODEL = "sora-2";
const DEFAULT_TIMEOUT_MS = 12e4;
const POLL_INTERVAL_MS = 2500;
const MAX_POLL_ATTEMPTS = 120;
const OPENAI_VIDEO_SECONDS = [
	4,
	8,
	12
];
const OPENAI_VIDEO_SIZES = [
	"720x1280",
	"1280x720",
	"1024x1792",
	"1792x1024"
];
function readOpenAIVideoFailureMessage(payload) {
	return payload.status === "failed" ? normalizeOptionalString(payload.error?.message) ?? "OpenAI video generation failed" : void 0;
}
function resolveDurationSeconds(durationSeconds) {
	if (typeof durationSeconds !== "number" || !Number.isFinite(durationSeconds)) return;
	const rounded = Math.max(OPENAI_VIDEO_SECONDS[0], Math.round(durationSeconds));
	const nearest = OPENAI_VIDEO_SECONDS.reduce((best, current) => Math.abs(current - rounded) < Math.abs(best - rounded) ? current : best);
	return String(nearest);
}
function resolveSize(params) {
	const explicitSize = normalizeOptionalString(params.size);
	if (explicitSize && OPENAI_VIDEO_SIZES.includes(explicitSize)) return explicitSize;
	switch (normalizeOptionalString(params.aspectRatio)) {
		case "9:16": return "720x1280";
		case "16:9": return "1280x720";
		case "4:7": return "1024x1792";
		case "7:4": return "1792x1024";
	}
	if (params.resolution === "1080P") return "1792x1024";
}
function resolveReferenceAsset(req) {
	const allAssets = [...req.inputImages ?? [], ...req.inputVideos ?? []];
	if (allAssets.length === 0) return null;
	if (allAssets.length > 1) throw new Error("OpenAI video generation supports at most one reference image or video.");
	const [asset] = allAssets;
	if (!asset?.buffer) throw new Error("OpenAI video generation currently requires local image/video uploads for reference assets.");
	const kind = (req.inputVideos?.length ?? 0) > 0 ? "video" : "image";
	const mimeType = normalizeOptionalString(asset.mimeType) || (kind === "video" ? "video/mp4" : "image/png");
	const extension = extensionForMime(mimeType)?.slice(1) ?? (mimeType.startsWith("video/") ? "mp4" : "png");
	const fileName = normalizeOptionalString(asset.fileName) || `${kind === "video" ? "reference-video" : "reference-image"}.${extension}`;
	return {
		kind,
		file: new File([bufferToBlobPart(asset.buffer)], fileName, { type: mimeType })
	};
}
async function pollOpenAIVideo(params, operations) {
	const { createProviderOperationDeadline, pollProviderOperationJson } = operations;
	const deadline = createProviderOperationDeadline({
		timeoutMs: params.timeoutMs,
		label: `OpenAI video generation task ${params.videoId}`
	});
	return await pollProviderOperationJson({
		url: `${params.baseUrl}/videos/${params.videoId}`,
		headers: params.headers,
		deadline,
		defaultTimeoutMs: DEFAULT_TIMEOUT_MS,
		fetchFn: params.fetchFn,
		maxAttempts: MAX_POLL_ATTEMPTS,
		pollIntervalMs: POLL_INTERVAL_MS,
		requestFailedMessage: "OpenAI video status request failed",
		timeoutMessage: `OpenAI video generation task ${params.videoId} did not finish in time`,
		allowPrivateNetwork: params.allowPrivateNetwork,
		dispatcherPolicy: params.dispatcherPolicy,
		auditContext: "openai-video-status",
		isComplete: (payload) => payload.status === "completed",
		getFailureMessage: readOpenAIVideoFailureMessage
	});
}
async function fetchOpenAIVideoDownload(params) {
	const { assertOkOrThrowHttpError, createProviderOperationTimeoutResolver, executeProviderOperationWithRetry, fetchProviderDownloadResponse, fetchWithTimeoutGuarded } = await import("./plugin-sdk/provider-http.js");
	const timeoutMs = createProviderOperationTimeoutResolver({
		deadline: params.deadline,
		defaultTimeoutMs: params.deadline.timeoutMs ?? DEFAULT_TIMEOUT_MS
	});
	if (!params.allowPrivateNetwork && !params.dispatcherPolicy) return {
		response: await fetchProviderDownloadResponse({
			url: params.url,
			init: params.init,
			deadline: params.deadline,
			fetchFn: params.fetchFn,
			provider: "openai",
			requestFailedMessage: "OpenAI video download failed"
		}),
		release: async () => {}
	};
	return await executeProviderOperationWithRetry({
		provider: "openai",
		stage: "download",
		operation: async () => {
			const result = await fetchWithTimeoutGuarded(params.url, params.init, timeoutMs(), params.fetchFn, {
				...params.allowPrivateNetwork ? { ssrfPolicy: { allowPrivateNetwork: true } } : {},
				...params.dispatcherPolicy ? { dispatcherPolicy: params.dispatcherPolicy } : {},
				auditContext: "openai-video-download"
			});
			try {
				await assertOkOrThrowHttpError(result.response, "OpenAI video download failed");
				return result;
			} catch (error) {
				await result.release();
				throw error;
			}
		}
	});
}
async function downloadOpenAIVideo(params) {
	const { downloadGeneratedVideoAsset } = await import("./plugin-sdk/media-generation-runtime.js");
	const url = new URL(`${params.baseUrl}/videos/${params.videoId}/content`);
	url.searchParams.set("variant", "video");
	return await downloadGeneratedVideoAsset({
		url: url.toString(),
		timeoutMs: params.timeoutMs ?? DEFAULT_TIMEOUT_MS,
		defaultTimeoutMs: DEFAULT_TIMEOUT_MS,
		fetchFn: params.fetchFn,
		provider: "openai",
		label: "OpenAI generated video download",
		requestFailedMessage: "OpenAI video download failed",
		maxBytes: params.maxBytes,
		validateBinaryResponse: true,
		fetchResponse: async ({ deadline }) => await fetchOpenAIVideoDownload({
			url: url.toString(),
			init: {
				method: "GET",
				headers: new Headers({
					...Object.fromEntries(params.headers.entries()),
					Accept: "application/binary"
				})
			},
			deadline,
			fetchFn: params.fetchFn,
			allowPrivateNetwork: params.allowPrivateNetwork,
			dispatcherPolicy: params.dispatcherPolicy
		})
	});
}
function buildOpenAIVideoGenerationProvider({ isProviderApiKeyConfigured }) {
	return {
		id: "openai",
		label: "OpenAI",
		defaultModel: DEFAULT_OPENAI_VIDEO_MODEL,
		models: [DEFAULT_OPENAI_VIDEO_MODEL, "sora-2-pro"],
		isConfigured: (ctx) => isProviderApiKeyConfigured({
			provider: "openai",
			...ctx,
			profileTypes: ["api_key"]
		}),
		capabilities: {
			generate: {
				maxVideos: 1,
				maxDurationSeconds: 12,
				supportedDurationSeconds: OPENAI_VIDEO_SECONDS,
				supportsSize: true,
				sizes: OPENAI_VIDEO_SIZES
			},
			imageToVideo: {
				enabled: true,
				maxVideos: 1,
				maxInputImages: 1,
				maxDurationSeconds: 12,
				supportedDurationSeconds: OPENAI_VIDEO_SECONDS,
				supportsSize: true,
				sizes: OPENAI_VIDEO_SIZES
			},
			videoToVideo: {
				enabled: true,
				maxVideos: 1,
				maxInputVideos: 1
			}
		},
		async generateVideo(req) {
			const { resolveApiKeyForProvider } = await import("./plugin-sdk/provider-auth-runtime.js");
			const auth = await resolveApiKeyForProvider({
				provider: "openai",
				cfg: req.cfg,
				agentDir: req.agentDir,
				store: req.authStore,
				modelApi: "openai-responses"
			});
			if (!auth.apiKey || auth.mode !== void 0 && auth.mode !== "api-key") throw new Error("OpenAI API key missing");
			const [{ assertOkOrThrowHttpError, createProviderOperationDeadline, createProviderOperationTimeoutResolver, pollProviderOperationJson, postMultipartRequest, readProviderJsonResponse, resolveProviderOperationTimeoutMs, resolveProviderHttpRequestConfig, sanitizeConfiguredModelProviderRequest }, { resolveGeneratedMediaMaxBytes }] = await Promise.all([import("./plugin-sdk/provider-http.js"), import("./plugin-sdk/media-generation-runtime.js")]);
			const fetchFn = fetch;
			const deadline = createProviderOperationDeadline({
				timeoutMs: req.timeoutMs,
				label: "OpenAI video generation"
			});
			const providerConfig = req.cfg.models?.providers?.openai;
			const { baseUrl, allowPrivateNetwork, headers, dispatcherPolicy } = resolveProviderHttpRequestConfig({
				baseUrl: resolveConfiguredOpenAIBaseUrl(req.cfg),
				defaultBaseUrl: DEFAULT_OPENAI_VIDEO_BASE_URL,
				request: sanitizeConfiguredModelProviderRequest(providerConfig?.request),
				defaultHeaders: { Authorization: `Bearer ${auth.apiKey}` },
				provider: "openai",
				capability: "video",
				transport: "http"
			});
			const model = normalizeOptionalString(req.model) ?? DEFAULT_OPENAI_VIDEO_MODEL;
			const seconds = resolveDurationSeconds(req.durationSeconds);
			const size = resolveSize({
				size: req.size,
				aspectRatio: req.aspectRatio,
				resolution: req.resolution
			});
			const referenceAsset = resolveReferenceAsset(req);
			const isVideoEdit = referenceAsset?.kind === "video";
			const form = new FormData();
			form.set("prompt", req.prompt);
			if (isVideoEdit) form.set("video", referenceAsset.file);
			else {
				form.set("model", model);
				if (seconds) form.set("seconds", seconds);
				if (size) form.set("size", size);
				if (referenceAsset) form.set("input_reference", referenceAsset.file);
			}
			const multipartHeaders = new Headers(headers);
			multipartHeaders.delete("Content-Type");
			const { response, release } = await postMultipartRequest({
				url: `${baseUrl}/videos${isVideoEdit ? "/edits" : ""}`,
				headers: multipartHeaders,
				body: form,
				timeoutMs: resolveProviderOperationTimeoutMs({
					deadline,
					defaultTimeoutMs: DEFAULT_TIMEOUT_MS
				}),
				fetchFn,
				allowPrivateNetwork,
				dispatcherPolicy
			});
			let submitted;
			try {
				await assertOkOrThrowHttpError(response, "OpenAI video generation failed");
				submitted = await readProviderJsonResponse(response, "OpenAI video generation failed");
			} finally {
				await release();
			}
			const failureMessage = readOpenAIVideoFailureMessage(submitted);
			if (failureMessage) throw new Error(failureMessage);
			const videoId = normalizeOptionalString(submitted.id);
			if (!videoId) throw new Error("OpenAI video generation response missing video id");
			const completed = submitted.status === "completed" ? submitted : await pollOpenAIVideo({
				videoId,
				headers,
				timeoutMs: resolveProviderOperationTimeoutMs({
					deadline,
					defaultTimeoutMs: DEFAULT_TIMEOUT_MS
				}),
				baseUrl,
				fetchFn,
				allowPrivateNetwork,
				dispatcherPolicy
			}, {
				createProviderOperationDeadline,
				pollProviderOperationJson
			});
			return {
				videos: [await downloadOpenAIVideo({
					videoId,
					headers,
					timeoutMs: createProviderOperationTimeoutResolver({
						deadline,
						defaultTimeoutMs: DEFAULT_TIMEOUT_MS
					}),
					baseUrl,
					fetchFn,
					allowPrivateNetwork,
					dispatcherPolicy,
					maxBytes: resolveGeneratedMediaMaxBytes(req.cfg, "video")
				})],
				model: completed.model ?? submitted.model ?? model,
				metadata: {
					videoId,
					status: completed.status,
					seconds: completed.seconds ?? submitted.seconds,
					size: completed.size ?? submitted.size
				}
			};
		}
	};
}
//#endregion
export { buildOpenAIVideoGenerationProvider as t };
