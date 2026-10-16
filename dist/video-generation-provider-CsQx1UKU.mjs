import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { P as resolvePositiveTimerTimeoutMs } from "./number-coercion-CuVhdCBs.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { m as readProviderJsonResponse, n as assertOkOrThrowHttpError } from "./provider-http-errors-DmewLLH7.mjs";
import { i as fetchWithSsrFGuard } from "./fetch-guard-DI6biu8d.mjs";
import "./string-coerce-runtime-50qKeWeL.mjs";
import { r as resolveGeneratedMediaMaxBytes } from "./configured-max-bytes-CtwRSse3.mjs";
import { r as createProviderOperationDeadline } from "./shared-DcnGQdHV.mjs";
import "./number-runtime-CgyXj1A5.mjs";
import { t as isProviderApiKeyConfigured } from "./provider-auth-availability-BmVs5Dky.mjs";
import "./ssrf-runtime-BzkFo_VJ.mjs";
import { n as readGeneratedVideoAsset } from "./media-generation-runtime-D1HcnVCx.mjs";
import "./provider-http-CuRGJD0L.mjs";
import "./provider-auth-C3BBF7yn.mjs";
import { t as resolveFalHttpRequestConfig } from "./http-config-BLzt5JZr.mjs";
//#region extensions/fal/video-generation-provider.ts
const DEFAULT_FAL_QUEUE_BASE_URL = "https://queue.fal.run";
const DEFAULT_FAL_VIDEO_MODEL = "fal-ai/minimax/video-01-live";
const HEYGEN_VIDEO_AGENT_MODEL = "fal-ai/heygen/v2/video-agent";
const SEEDANCE_2_TEXT_IMAGE_VIDEO_MODELS = [
	"bytedance/seedance-2.0/fast/text-to-video",
	"bytedance/seedance-2.0/fast/image-to-video",
	"bytedance/seedance-2.0/text-to-video",
	"bytedance/seedance-2.0/image-to-video"
];
const SEEDANCE_2_REFERENCE_VIDEO_MODELS = ["bytedance/seedance-2.0/fast/reference-to-video", "bytedance/seedance-2.0/reference-to-video"];
const SEEDANCE_2_VIDEO_MODELS = [...SEEDANCE_2_TEXT_IMAGE_VIDEO_MODELS, ...SEEDANCE_2_REFERENCE_VIDEO_MODELS];
const SEEDANCE_2_DURATION_SECONDS = [
	4,
	5,
	6,
	7,
	8,
	9,
	10,
	11,
	12,
	13,
	14,
	15
];
const SEEDANCE_REFERENCE_MAX_IMAGES = 9;
const SEEDANCE_REFERENCE_MAX_VIDEOS = 3;
const SEEDANCE_REFERENCE_MAX_AUDIOS = 3;
const SEEDANCE_REFERENCE_MAX_FILES = 12;
const SEEDANCE_REFERENCE_MAX_IMAGES_BY_MODEL = Object.fromEntries(SEEDANCE_2_REFERENCE_VIDEO_MODELS.map((model) => [model, SEEDANCE_REFERENCE_MAX_IMAGES]));
const SEEDANCE_REFERENCE_MAX_VIDEOS_BY_MODEL = Object.fromEntries(SEEDANCE_2_REFERENCE_VIDEO_MODELS.map((model) => [model, SEEDANCE_REFERENCE_MAX_VIDEOS]));
const SEEDANCE_REFERENCE_MAX_AUDIOS_BY_MODEL = Object.fromEntries(SEEDANCE_2_REFERENCE_VIDEO_MODELS.map((model) => [model, SEEDANCE_REFERENCE_MAX_AUDIOS]));
const DEFAULT_HTTP_TIMEOUT_MS = 3e4;
const DEFAULT_OPERATION_TIMEOUT_MS = 12e5;
const POLL_INTERVAL_MS = 5e3;
const FAL_VIDEO_MALFORMED_RESPONSE = "fal video generation response malformed";
const FAL_VIDEO_PENDING_STATUSES = /* @__PURE__ */ new Set([
	"IN_QUEUE",
	"IN_PROGRESS",
	"PROCESSING",
	"QUEUED",
	"STARTED"
]);
function normalizeFalVideoUrl(value) {
	const normalized = normalizeOptionalString(value);
	if (!normalized && value !== void 0 && value !== null) throw new Error(FAL_VIDEO_MALFORMED_RESPONSE);
	return normalized;
}
function readFalVideoPayload(payload) {
	if (!isRecord(payload)) throw new Error(FAL_VIDEO_MALFORMED_RESPONSE);
	const video = payload.video;
	const videos = payload.videos;
	if (video !== void 0 && video !== null && !isRecord(video)) throw new Error(FAL_VIDEO_MALFORMED_RESPONSE);
	if (videos !== void 0 && videos !== null && !Array.isArray(videos)) throw new Error(FAL_VIDEO_MALFORMED_RESPONSE);
	return {
		video: isRecord(video) ? {
			url: normalizeFalVideoUrl(video.url),
			content_type: normalizeOptionalString(video.content_type)
		} : void 0,
		videos: Array.isArray(videos) ? videos.map((entry) => {
			if (!isRecord(entry)) throw new Error(FAL_VIDEO_MALFORMED_RESPONSE);
			return {
				url: normalizeFalVideoUrl(entry.url),
				content_type: normalizeOptionalString(entry.content_type)
			};
		}) : void 0,
		prompt: normalizeOptionalString(payload.prompt),
		seed: typeof payload.seed === "number" ? payload.seed : void 0
	};
}
function readFalQueueResponse(payload) {
	if (!isRecord(payload)) throw new Error(FAL_VIDEO_MALFORMED_RESPONSE);
	const error = payload.error;
	if (error !== void 0 && error !== null && !isRecord(error)) throw new Error(FAL_VIDEO_MALFORMED_RESPONSE);
	return {
		status: normalizeOptionalString(payload.status),
		request_id: normalizeOptionalString(payload.request_id),
		response_url: normalizeOptionalString(payload.response_url),
		status_url: normalizeOptionalString(payload.status_url),
		detail: normalizeOptionalString(payload.detail),
		response: payload.response === void 0 ? void 0 : readFalVideoPayload(payload.response),
		prompt: normalizeOptionalString(payload.prompt),
		error: isRecord(error) ? { message: normalizeOptionalString(error.message) } : void 0
	};
}
function readFalCompletedQueueResult(payload) {
	if (!isRecord(payload)) throw new Error(FAL_VIDEO_MALFORMED_RESPONSE);
	if (payload.response !== void 0 || payload.video === void 0 && payload.videos === void 0) return readFalQueueResponse(payload);
	return { response: readFalVideoPayload(payload) };
}
function toDataUrl(buffer, mimeType) {
	return `data:${mimeType};base64,${buffer.toString("base64")}`;
}
async function downloadFalVideo(url, maxBytes) {
	const { response, release } = await fetchWithSsrFGuard({
		url,
		timeoutMs: DEFAULT_HTTP_TIMEOUT_MS,
		auditContext: "fal-video-download"
	});
	try {
		await assertOkOrThrowHttpError(response, "fal generated video download failed");
		return {
			url,
			...await readGeneratedVideoAsset(response, {
				label: "fal generated video download",
				maxBytes,
				validateBinaryResponse: true,
				overflowUrl: url,
				readOptions: { chunkTimeoutMs: 0 }
			})
		};
	} finally {
		await release();
	}
}
function resolveFalQueueBaseUrl(baseUrl) {
	const url = URL.parse(baseUrl);
	if (!url) return DEFAULT_FAL_QUEUE_BASE_URL;
	if (url.hostname === "fal.run") {
		url.hostname = "queue.fal.run";
		return url.toString().replace(/\/$/, "");
	}
	return baseUrl.replace(/\/$/, "");
}
function isFalSeedance2Model(model) {
	return SEEDANCE_2_VIDEO_MODELS.includes(model);
}
function isFalSeedance2ReferenceModel(model) {
	return SEEDANCE_2_REFERENCE_VIDEO_MODELS.includes(model);
}
function resolveFalDuration(durationSeconds, model) {
	if (typeof durationSeconds !== "number" || !Number.isFinite(durationSeconds)) return;
	const duration = Math.max(1, Math.round(durationSeconds));
	if (isFalSeedance2Model(model)) return SEEDANCE_2_DURATION_SECONDS.includes(duration) ? String(duration) : void 0;
	return duration;
}
function resolveFalReferenceUrl(asset, defaultMimeType, label) {
	const assetUrl = normalizeOptionalString(asset?.url);
	if (assetUrl) return assetUrl;
	if (!asset?.buffer) throw new Error(`fal ${label} is missing media data.`);
	return toDataUrl(asset.buffer, normalizeOptionalString(asset.mimeType) ?? defaultMimeType);
}
function applyFalSeedanceControls(req, model, body) {
	const aspectRatio = normalizeOptionalString(req.aspectRatio);
	if (aspectRatio) body.aspect_ratio = aspectRatio;
	const size = normalizeOptionalString(req.size);
	if (size) body.size = size;
	if (req.resolution) body.resolution = isFalSeedance2Model(model) ? req.resolution.toLowerCase() : req.resolution;
	const duration = resolveFalDuration(req.durationSeconds, model);
	if (duration) body.duration = duration;
	if (isFalSeedance2Model(model) && typeof req.audio === "boolean") body.generate_audio = req.audio;
}
function buildFalVideoRequestBody(req, model) {
	const requestBody = { prompt: req.prompt };
	if (isFalSeedance2ReferenceModel(model)) {
		for (const [field, assets, mimeType, label] of [
			[
				"image_urls",
				req.inputImages,
				"image/png",
				"reference image"
			],
			[
				"video_urls",
				req.inputVideos,
				"video/mp4",
				"reference video"
			],
			[
				"audio_urls",
				req.inputAudios,
				"audio/mpeg",
				"reference audio"
			]
		]) {
			const urls = (assets ?? []).map((asset) => resolveFalReferenceUrl(asset, mimeType, label));
			if (urls.length > 0) requestBody[field] = urls;
		}
		applyFalSeedanceControls(req, model, requestBody);
		return requestBody;
	}
	const input = req.inputImages?.[0];
	if (input) requestBody.image_url = normalizeOptionalString(input.url) ?? (input.buffer ? toDataUrl(input.buffer, normalizeOptionalString(input.mimeType) ?? "image/png") : void 0);
	const normalizedModel = normalizeLowercaseStringOrEmpty(model);
	if (normalizedModel === DEFAULT_FAL_VIDEO_MODEL || normalizedModel === HEYGEN_VIDEO_AGENT_MODEL) return requestBody;
	applyFalSeedanceControls(req, model, requestBody);
	return requestBody;
}
function validateFalVideoReferenceInputs(req, model) {
	const imageCount = req.inputImages?.length ?? 0;
	const videoCount = req.inputVideos?.length ?? 0;
	const audioCount = req.inputAudios?.length ?? 0;
	if (isFalSeedance2ReferenceModel(model)) {
		for (const [count, max, label] of [
			[
				imageCount,
				SEEDANCE_REFERENCE_MAX_IMAGES,
				"reference images"
			],
			[
				videoCount,
				SEEDANCE_REFERENCE_MAX_VIDEOS,
				"reference videos"
			],
			[
				audioCount,
				SEEDANCE_REFERENCE_MAX_AUDIOS,
				"reference audios"
			],
			[
				imageCount + videoCount + audioCount,
				SEEDANCE_REFERENCE_MAX_FILES,
				"total reference files"
			]
		]) if (count > max) throw new Error(`fal Seedance reference-to-video supports at most ${max} ${label}.`);
		if (audioCount > 0 && imageCount === 0 && videoCount === 0) throw new Error("fal Seedance reference-to-video requires at least one image or video reference when audio references are provided.");
		return;
	}
	if (videoCount > 0) throw new Error("fal video generation does not support video reference inputs.");
	if (audioCount > 0) throw new Error("fal video generation does not support audio reference inputs.");
	if (imageCount > 1) throw new Error("fal video generation supports at most one image reference.");
}
async function fetchFalJson(params) {
	const { errorContext, ...request } = params;
	const { response, release } = await fetchWithSsrFGuard(request);
	try {
		await assertOkOrThrowHttpError(response, errorContext);
		try {
			return await readProviderJsonResponse(response, errorContext);
		} catch (error) {
			if (error instanceof Error && error.message.endsWith(": malformed JSON response")) throw new Error(FAL_VIDEO_MALFORMED_RESPONSE, { cause: error });
			throw error;
		}
	} finally {
		await release();
	}
}
async function waitForFalQueueResult(params) {
	let lastStatus = "unknown";
	for (;;) {
		const requestTimeoutMs = resolveFalQueueRemainingMs(params.deadline, lastStatus, DEFAULT_HTTP_TIMEOUT_MS);
		const payload = readFalQueueResponse(await fetchFalJson({
			url: params.statusUrl,
			init: {
				method: "GET",
				headers: params.headers
			},
			timeoutMs: requestTimeoutMs,
			dispatcherPolicy: params.dispatcherPolicy,
			auditContext: "fal-video-status",
			errorContext: "fal video status request failed"
		}));
		const status = payload.status?.toUpperCase();
		if (!status) throw new Error(FAL_VIDEO_MALFORMED_RESPONSE);
		lastStatus = status;
		if (status === "COMPLETED") return readFalCompletedQueueResult(await fetchFalJson({
			url: params.responseUrl,
			init: {
				method: "GET",
				headers: params.headers
			},
			timeoutMs: resolveFalQueueRemainingMs(params.deadline, lastStatus, DEFAULT_HTTP_TIMEOUT_MS),
			dispatcherPolicy: params.dispatcherPolicy,
			auditContext: "fal-video-result",
			errorContext: "fal video result request failed"
		}));
		if (status === "FAILED" || status === "CANCELLED") throw new Error(payload.detail || payload.error?.message || `fal video generation ${normalizeLowercaseStringOrEmpty(status)}`);
		if (!FAL_VIDEO_PENDING_STATUSES.has(status)) throw new Error(FAL_VIDEO_MALFORMED_RESPONSE);
		const pollDelayMs = resolveFalQueueRemainingMs(params.deadline, lastStatus, POLL_INTERVAL_MS);
		await new Promise((resolve) => {
			setTimeout(resolve, pollDelayMs);
		});
	}
}
function resolveFalQueueRemainingMs(deadline, lastStatus, defaultTimeoutMs) {
	const defaultMs = resolvePositiveTimerTimeoutMs(defaultTimeoutMs, 1);
	if (typeof deadline.deadlineAtMs !== "number") return defaultMs;
	const remainingMs = deadline.deadlineAtMs - Date.now();
	if (remainingMs <= 0) throw new Error(`fal video generation did not finish in time (last status: ${lastStatus})`);
	return Math.max(1, Math.min(defaultMs, remainingMs));
}
function buildFalVideoModeCapabilities(models) {
	return {
		maxVideos: 1,
		supportedDurationSecondsByModel: Object.fromEntries(models.map((model) => [model, SEEDANCE_2_DURATION_SECONDS])),
		supportsAspectRatio: true,
		supportsResolution: true,
		supportsSize: true,
		supportsAudio: true
	};
}
function buildFalVideoGenerationProvider() {
	return {
		id: "fal",
		label: "fal",
		defaultModel: DEFAULT_FAL_VIDEO_MODEL,
		models: [
			DEFAULT_FAL_VIDEO_MODEL,
			HEYGEN_VIDEO_AGENT_MODEL,
			...SEEDANCE_2_VIDEO_MODELS,
			"fal-ai/kling-video/v2.1/master/text-to-video",
			"fal-ai/wan/v2.2-a14b/text-to-video",
			"fal-ai/wan/v2.2-a14b/image-to-video"
		],
		isConfigured: (ctx) => isProviderApiKeyConfigured({
			provider: "fal",
			...ctx
		}),
		capabilities: {
			generate: buildFalVideoModeCapabilities(SEEDANCE_2_VIDEO_MODELS),
			imageToVideo: {
				enabled: true,
				...buildFalVideoModeCapabilities(SEEDANCE_2_VIDEO_MODELS),
				maxInputImages: 1,
				maxInputImagesByModel: SEEDANCE_REFERENCE_MAX_IMAGES_BY_MODEL,
				maxInputAudiosByModel: SEEDANCE_REFERENCE_MAX_AUDIOS_BY_MODEL
			},
			videoToVideo: {
				enabled: true,
				...buildFalVideoModeCapabilities(SEEDANCE_2_REFERENCE_VIDEO_MODELS),
				maxInputImages: 0,
				maxInputImagesByModel: SEEDANCE_REFERENCE_MAX_IMAGES_BY_MODEL,
				maxInputVideos: 0,
				maxInputVideosByModel: SEEDANCE_REFERENCE_MAX_VIDEOS_BY_MODEL,
				maxInputAudiosByModel: SEEDANCE_REFERENCE_MAX_AUDIOS_BY_MODEL
			}
		},
		async generateVideo(req) {
			const model = normalizeOptionalString(req.model) || DEFAULT_FAL_VIDEO_MODEL;
			validateFalVideoReferenceInputs(req, model);
			const { baseUrl, headers, dispatcherPolicy } = await resolveFalHttpRequestConfig({
				req,
				capability: "video"
			});
			const requestBody = buildFalVideoRequestBody(req, model);
			const submitted = readFalQueueResponse(await fetchFalJson({
				url: `${resolveFalQueueBaseUrl(baseUrl)}/${model}`,
				init: {
					method: "POST",
					headers,
					body: JSON.stringify(requestBody)
				},
				timeoutMs: DEFAULT_HTTP_TIMEOUT_MS,
				dispatcherPolicy,
				auditContext: "fal-video-submit",
				errorContext: "fal video generation failed"
			}));
			const statusUrl = submitted.status_url;
			const responseUrl = submitted.response_url;
			if (!statusUrl || !responseUrl) throw new Error("fal video generation response missing queue URLs");
			const operationTimeoutMs = resolvePositiveTimerTimeoutMs(req.timeoutMs, DEFAULT_OPERATION_TIMEOUT_MS);
			const payload = await waitForFalQueueResult({
				statusUrl,
				responseUrl,
				headers,
				deadline: createProviderOperationDeadline({
					timeoutMs: operationTimeoutMs,
					label: "fal video generation"
				}),
				dispatcherPolicy
			});
			const videoPayload = payload.response || readFalVideoPayload(payload);
			const url = (videoPayload.video?.url ? videoPayload.video : videoPayload.videos?.find((video) => video.url))?.url;
			if (!url) throw new Error("fal video generation response missing output URL");
			return {
				videos: [await downloadFalVideo(url, resolveGeneratedMediaMaxBytes(req.cfg, "video"))],
				model,
				metadata: {
					...submitted.request_id ? { requestId: submitted.request_id } : {},
					...videoPayload.prompt ? { prompt: videoPayload.prompt } : {},
					...typeof videoPayload.seed === "number" ? { seed: videoPayload.seed } : {}
				}
			};
		}
	};
}
//#endregion
export { buildFalVideoGenerationProvider as t };
