import { DEFAULT_PIXVERSE_REGION, PIXVERSE_BASE_URL_BY_REGION, PIXVERSE_PROVIDER_ID } from "./constants.js";
import { asFiniteNumber, asSafeIntegerInRange, normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
import { randomUUID } from "node:crypto";
import { bufferToBlobPart } from "openclaw/plugin-sdk/blob-runtime";
import { extensionForMime } from "openclaw/plugin-sdk/media-mime";
import { isProviderApiKeyConfigured } from "openclaw/plugin-sdk/provider-auth";
import { resolveApiKeyForProvider } from "openclaw/plugin-sdk/provider-auth-runtime";
import { assertOkOrThrowHttpError, createProviderOperationDeadline, pollProviderOperationJson, postJsonRequest, postMultipartRequest, readProviderJsonResponse, resolveProviderHttpRequestConfig, resolveProviderOperationTimeoutMs, sanitizeConfiguredModelProviderRequest } from "openclaw/plugin-sdk/provider-http";
//#region extensions/pixverse/video-generation-provider.ts
const DEFAULT_PIXVERSE_BASE_URL = PIXVERSE_BASE_URL_BY_REGION[DEFAULT_PIXVERSE_REGION];
const DEFAULT_PIXVERSE_QUALITY = "540p";
const DEFAULT_TIMEOUT_MS = 3e5;
const POLL_INTERVAL_MS = 5e3;
const MAX_POLL_ATTEMPTS = 180;
const MAX_DURATION_SECONDS = 15;
const PIXVERSE_SEED_MAX = 2147483647;
const PIXVERSE_VIDEO_MODELS = ["v6", "c1"];
const PIXVERSE_TEXT_ASPECT_RATIOS = [
	"16:9",
	"4:3",
	"1:1",
	"3:4",
	"9:16",
	"2:3",
	"3:2",
	"21:9"
];
const PIXVERSE_QUALITIES = [
	"360p",
	"540p",
	"720p",
	"1080p"
];
function resolvePixVerseBaseUrl(req) {
	const provider = req.cfg?.models?.providers?.[PIXVERSE_PROVIDER_ID];
	const configuredBaseUrl = normalizeOptionalString(provider?.baseUrl);
	if (configuredBaseUrl) return configuredBaseUrl;
	const region = resolvePixVerseApiRegion(provider?.region);
	return PIXVERSE_BASE_URL_BY_REGION[region];
}
function resolvePixVerseApiRegion(value) {
	const region = normalizeOptionalString(value)?.toLowerCase();
	switch (region) {
		case "cn":
		case "china":
		case "mainland":
		case "pai": return "cn";
		case "global":
		case "intl":
		case "international":
		case void 0: return DEFAULT_PIXVERSE_REGION;
		default: throw new Error(`Unsupported PixVerse API region "${region}". Use "international" or "cn".`);
	}
}
function normalizePixVerseModel(model) {
	return (normalizeOptionalString(model)?.replace(/^pixverse\//iu, ""))?.toLowerCase() || "v6";
}
function resolvePixVerseQuality(req) {
	const requested = normalizeOptionalString(req.providerOptions?.quality) ?? normalizeOptionalString(req.resolution) ?? normalizeOptionalString(req.size);
	if (!requested) return DEFAULT_PIXVERSE_QUALITY;
	const normalized = requested.toLowerCase() === "480p" ? "540p" : requested.toLowerCase();
	return PIXVERSE_QUALITIES.includes(normalized) ? normalized : DEFAULT_PIXVERSE_QUALITY;
}
function resolvePixVerseDurationSeconds(value) {
	if (typeof value !== "number" || !Number.isFinite(value)) return 5;
	return Math.max(1, Math.min(MAX_DURATION_SECONDS, Math.round(value)));
}
function appendOptionalNumber(body, key, value) {
	const numberValue = asFiniteNumber(value);
	if (numberValue != null) body[key] = numberValue;
}
function appendOptionalInt32Seed(body, value) {
	const seed = asSafeIntegerInRange(value, {
		min: 0,
		max: PIXVERSE_SEED_MAX
	});
	if (seed !== void 0) body.seed = seed;
}
function readPixVerseSeed(value) {
	return asSafeIntegerInRange(value, {
		min: 0,
		max: PIXVERSE_SEED_MAX
	});
}
function appendOptionalString(body, key, value) {
	const stringValue = normalizeOptionalString(value);
	if (stringValue) body[key] = stringValue;
}
function buildPixVerseHeaders(headers, contentType) {
	const next = new Headers(headers);
	next.set("Ai-trace-id", randomUUID());
	if (contentType) next.set("Content-Type", contentType);
	else next.delete("Content-Type");
	return next;
}
function readPixVerseSuccess(payload, label) {
	if (!payload || typeof payload !== "object") throw new Error(`${label}: malformed JSON response`);
	if (asFiniteNumber(payload.ErrCode) !== 0) {
		const message = normalizeOptionalString(payload.ErrMsg) ?? `ErrCode ${String(payload.ErrCode)}`;
		throw new Error(`${label}: ${message}`);
	}
	if (payload.Resp === void 0 || payload.Resp === null) throw new Error(`${label}: response missing Resp`);
	return payload.Resp;
}
async function readPixVerseJson(response, label) {
	return readPixVerseSuccess(await readProviderJsonResponse(response, label), label);
}
function readPixVerseVideoId(payload) {
	const videoId = asSafeIntegerInRange(payload.video_id, { min: 0 });
	if (videoId == null) throw new Error("PixVerse video generation response missing video_id");
	return videoId;
}
function readPixVerseImageId(payload) {
	const imageId = asSafeIntegerInRange(payload.img_id, { min: 0 });
	if (imageId == null) throw new Error("PixVerse image upload response missing img_id");
	return imageId;
}
function readPixVerseStatus(payload) {
	const status = asSafeIntegerInRange(payload.status, { min: 0 });
	if (status == null) throw new Error("PixVerse video status response missing status");
	return status;
}
function buildUploadImageForm(asset) {
	const form = new FormData();
	const url = normalizeOptionalString(asset.url);
	if (url) {
		form.set("image_url", url);
		return form;
	}
	if (!asset.buffer) throw new Error("PixVerse image-to-video input is missing image data.");
	const mimeType = normalizeOptionalString(asset.mimeType) ?? "image/png";
	const extension = extensionForMime(mimeType)?.slice(1) ?? "png";
	const fileName = normalizeOptionalString(asset.fileName) ?? `image.${extension}`;
	const file = new File([bufferToBlobPart(asset.buffer)], fileName, { type: mimeType });
	form.set("image", file);
	return form;
}
function buildVideoBody(req, model, imageId) {
	const options = req.providerOptions ?? {};
	const body = {
		duration: resolvePixVerseDurationSeconds(req.durationSeconds),
		model,
		prompt: req.prompt,
		quality: resolvePixVerseQuality(req)
	};
	if (imageId !== void 0) {
		body.img_id = imageId;
		body.motion_mode = normalizeOptionalString(options.motion_mode) ?? normalizeOptionalString(options.motionMode) ?? "normal";
	} else body.aspect_ratio = normalizeOptionalString(req.aspectRatio) ?? "16:9";
	appendOptionalString(body, "negative_prompt", normalizeOptionalString(options.negative_prompt) ?? normalizeOptionalString(options.negativePrompt));
	appendOptionalString(body, "camera_movement", normalizeOptionalString(options.camera_movement) ?? normalizeOptionalString(options.cameraMovement));
	appendOptionalNumber(body, "template_id", asFiniteNumber(options.template_id) ?? asFiniteNumber(options.templateId));
	appendOptionalInt32Seed(body, options.seed);
	if (req.audio !== void 0) body.generate_audio_switch = req.audio;
	return body;
}
function readPixVerseFailureMessage(payload) {
	switch (readPixVerseStatus(payload)) {
		case 7: return "PixVerse video generation failed content moderation";
		case 8: return "PixVerse video generation failed";
		case 6: return "PixVerse video generation was deleted before completion";
		default: return;
	}
}
async function pollPixVerseVideo(params) {
	const readResult = (payload) => readPixVerseSuccess(payload, "PixVerse video status request failed");
	return readResult(await pollProviderOperationJson({
		url: `${params.baseUrl}/video/result/${params.videoId}`,
		headers: () => buildPixVerseHeaders(params.headers),
		deadline: params.deadline,
		defaultTimeoutMs: DEFAULT_TIMEOUT_MS,
		fetchFn: params.fetchFn,
		maxAttempts: MAX_POLL_ATTEMPTS,
		pollIntervalMs: POLL_INTERVAL_MS,
		requestFailedMessage: "PixVerse video status request failed",
		timeoutMessage: `PixVerse video generation task ${params.videoId} did not finish in time`,
		isComplete: (candidate) => readPixVerseStatus(readResult(candidate)) === 1,
		getFailureMessage: (candidate) => readPixVerseFailureMessage(readResult(candidate)),
		allowPrivateNetwork: params.allowPrivateNetwork,
		dispatcherPolicy: params.dispatcherPolicy
	}));
}
function extractPixVerseVideo(payload) {
	const url = normalizeOptionalString(payload.url);
	if (!url) throw new Error("PixVerse video generation completed without output URL");
	return {
		url,
		mimeType: "video/mp4",
		fileName: "video-1.mp4",
		metadata: {
			sourceUrl: url,
			outputWidth: asFiniteNumber(payload.outputWidth),
			outputHeight: asFiniteNumber(payload.outputHeight)
		}
	};
}
function buildPixVerseVideoGenerationProvider() {
	return {
		id: PIXVERSE_PROVIDER_ID,
		label: "PixVerse",
		defaultModel: "v6",
		defaultTimeoutMs: DEFAULT_TIMEOUT_MS,
		models: [...PIXVERSE_VIDEO_MODELS],
		isConfigured: (ctx) => isProviderApiKeyConfigured({
			provider: PIXVERSE_PROVIDER_ID,
			...ctx
		}),
		capabilities: {
			generate: {
				maxVideos: 1,
				maxDurationSeconds: MAX_DURATION_SECONDS,
				supportedDurationSeconds: Array.from({ length: MAX_DURATION_SECONDS }, (_, index) => index + 1),
				aspectRatios: [...PIXVERSE_TEXT_ASPECT_RATIOS],
				resolutions: [
					"360P",
					"540P",
					"720P",
					"1080P"
				],
				supportsAspectRatio: true,
				supportsResolution: true,
				supportsAudio: true,
				providerOptions: {
					seed: "number",
					negative_prompt: "string",
					negativePrompt: "string",
					quality: "string",
					camera_movement: "string",
					cameraMovement: "string",
					template_id: "number",
					templateId: "number"
				}
			},
			imageToVideo: {
				enabled: true,
				maxVideos: 1,
				maxInputImages: 1,
				maxDurationSeconds: MAX_DURATION_SECONDS,
				supportedDurationSeconds: Array.from({ length: MAX_DURATION_SECONDS }, (_, index) => index + 1),
				resolutions: [
					"360P",
					"540P",
					"720P",
					"1080P"
				],
				supportsResolution: true,
				supportsAudio: true,
				providerOptions: {
					seed: "number",
					negative_prompt: "string",
					negativePrompt: "string",
					quality: "string",
					motion_mode: "string",
					motionMode: "string",
					camera_movement: "string",
					cameraMovement: "string",
					template_id: "number",
					templateId: "number"
				}
			},
			videoToVideo: { enabled: false }
		},
		async generateVideo(req) {
			if ((req.inputVideos?.length ?? 0) > 0) throw new Error("PixVerse video generation does not support video reference inputs.");
			if ((req.inputImages?.length ?? 0) > 1) throw new Error("PixVerse image-to-video supports at most one input image.");
			const auth = await resolveApiKeyForProvider({
				provider: PIXVERSE_PROVIDER_ID,
				cfg: req.cfg,
				agentDir: req.agentDir,
				store: req.authStore
			});
			if (!auth.apiKey) throw new Error("PixVerse API key missing");
			const model = normalizePixVerseModel(req.model);
			const fetchFn = fetch;
			const providerConfig = req.cfg?.models?.providers?.[PIXVERSE_PROVIDER_ID];
			const deadline = createProviderOperationDeadline({
				timeoutMs: req.timeoutMs,
				label: "PixVerse video generation"
			});
			const { baseUrl, allowPrivateNetwork, headers, dispatcherPolicy } = resolveProviderHttpRequestConfig({
				baseUrl: resolvePixVerseBaseUrl(req),
				defaultBaseUrl: DEFAULT_PIXVERSE_BASE_URL,
				request: sanitizeConfiguredModelProviderRequest(providerConfig?.request),
				defaultHeaders: { "API-KEY": auth.apiKey },
				provider: PIXVERSE_PROVIDER_ID,
				capability: "video",
				transport: "http"
			});
			const image = req.inputImages?.[0];
			let imageId;
			if (image) {
				const upload = await postMultipartRequest({
					url: `${baseUrl}/image/upload`,
					headers: buildPixVerseHeaders(headers),
					body: buildUploadImageForm(image),
					timeoutMs: resolveProviderOperationTimeoutMs({
						deadline,
						defaultTimeoutMs: DEFAULT_TIMEOUT_MS
					}),
					fetchFn,
					allowPrivateNetwork,
					dispatcherPolicy
				});
				try {
					await assertOkOrThrowHttpError(upload.response, "PixVerse image upload failed");
					imageId = readPixVerseImageId(await readPixVerseJson(upload.response, "PixVerse image upload failed"));
				} finally {
					await upload.release();
				}
			}
			const endpoint = imageId === void 0 ? "/video/text/generate" : "/video/img/generate";
			const create = await postJsonRequest({
				url: `${baseUrl}${endpoint}`,
				headers: buildPixVerseHeaders(headers, "application/json"),
				body: buildVideoBody(req, model, imageId),
				timeoutMs: resolveProviderOperationTimeoutMs({
					deadline,
					defaultTimeoutMs: DEFAULT_TIMEOUT_MS
				}),
				fetchFn,
				allowPrivateNetwork,
				dispatcherPolicy
			});
			try {
				await assertOkOrThrowHttpError(create.response, "PixVerse video generation failed");
				const videoId = readPixVerseVideoId(await readPixVerseJson(create.response, "PixVerse video generation failed"));
				const completed = await pollPixVerseVideo({
					videoId,
					baseUrl,
					deadline,
					fetchFn,
					allowPrivateNetwork,
					dispatcherPolicy,
					headers
				});
				return {
					videos: [extractPixVerseVideo(completed)],
					model,
					metadata: {
						endpoint,
						videoId,
						status: readPixVerseStatus(completed),
						seed: readPixVerseSeed(completed.seed),
						size: asFiniteNumber(completed.size)
					}
				};
			} finally {
				await create.release();
			}
		}
	};
}
//#endregion
export { buildPixVerseVideoGenerationProvider };
