import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { p as normalizeTrimmedStringList } from "./string-normalization-CECOqf64.mjs";
import { n as assertOkOrThrowHttpError, p as readProviderJsonObjectResponse } from "./provider-http-errors-DmewLLH7.mjs";
import "./string-coerce-runtime-50qKeWeL.mjs";
import { r as resolveGeneratedMediaMaxBytes } from "./configured-max-bytes-CtwRSse3.mjs";
import { _ as resolveProviderOperationTimeoutMs, a as createProviderOperationTimeoutResolver, d as postJsonRequest, h as resolveProviderHttpRequestConfig, r as createProviderOperationDeadline, u as pollProviderOperationJson } from "./shared-DcnGQdHV.mjs";
import { t as isProviderApiKeyConfigured } from "./provider-auth-availability-BmVs5Dky.mjs";
import { t as downloadGeneratedVideoAsset } from "./media-generation-runtime-D1HcnVCx.mjs";
import { a as resolveApiKeyForProvider } from "./provider-auth-runtime-CpGmMxRN.mjs";
import "./provider-http-CuRGJD0L.mjs";
import "./provider-auth-C3BBF7yn.mjs";
//#region extensions/runway/video-generation-provider.ts
const DEFAULT_RUNWAY_BASE_URL = "https://api.dev.runwayml.com";
const DEFAULT_RUNWAY_MODEL = "gen4.5";
const RUNWAY_API_VERSION = "2024-11-06";
const DEFAULT_TIMEOUT_MS = 12e4;
const POLL_INTERVAL_MS = 5e3;
const MAX_POLL_ATTEMPTS = 120;
const MAX_DURATION_SECONDS = 10;
const TEXT_ONLY_MODELS = /* @__PURE__ */ new Set([
	"gen4.5",
	"veo3.1",
	"veo3.1_fast",
	"veo3"
]);
const IMAGE_MODELS = /* @__PURE__ */ new Set([
	"gen4.5",
	"gen4_turbo",
	"gen3a_turbo",
	"veo3.1",
	"veo3.1_fast",
	"veo3"
]);
const VIDEO_MODELS = /* @__PURE__ */ new Set(["gen4_aleph"]);
const RUNWAY_TEXT_ASPECT_RATIOS = ["16:9", "9:16"];
const RUNWAY_EDIT_ASPECT_RATIOS = [
	"1:1",
	"16:9",
	"9:16",
	"3:4",
	"4:3",
	"21:9"
];
function readRunwayTaskStatus(payload) {
	const status = normalizeOptionalString(payload.status);
	switch (status) {
		case "PENDING":
		case "RUNNING":
		case "THROTTLED":
		case "SUCCEEDED":
		case "FAILED":
		case "CANCELLED": return status;
		case void 0: throw new Error("Runway video status response missing task status");
		default: throw new Error(`Runway video status response returned unknown task status: ${status}`);
	}
}
function readRunwayFailureMessage(failure) {
	if (typeof failure === "string") return normalizeOptionalString(failure);
	if (isRecord(failure)) return normalizeOptionalString(failure.message);
}
function readRunwayOutputUrls(payload) {
	if (!Array.isArray(payload.output)) throw new Error("Runway video generation completed with malformed output URLs");
	const outputUrls = normalizeTrimmedStringList(payload.output);
	if (!outputUrls.length) throw new Error("Runway video generation completed without output URLs");
	return outputUrls;
}
function resolveSourceUri(asset, fallbackMimeType) {
	if (!asset) return;
	const url = normalizeOptionalString(asset.url);
	if (url) return url;
	if (!asset.buffer) return;
	return `data:${normalizeOptionalString(asset.mimeType) ?? fallbackMimeType};base64,${asset.buffer.toString("base64")}`;
}
function resolveDurationSeconds(value) {
	if (value === void 0 || !Number.isSafeInteger(value)) return 5;
	return Math.max(2, Math.min(MAX_DURATION_SECONDS, value));
}
const RUNWAY_RATIO_SIZES = /* @__PURE__ */ new Map([
	["9:16", "720:1280"],
	["16:9", "1280:720"],
	["1:1", "960:960"],
	["3:4", "832:1104"],
	["4:3", "1104:832"],
	["21:9", "1584:672"]
]);
function resolveRunwayRatio(req) {
	const hasImageInput = (req.inputImages?.length ?? 0) > 0;
	const requested = normalizeOptionalString(req.size) || RUNWAY_RATIO_SIZES.get(normalizeOptionalString(req.aspectRatio) ?? "");
	if (requested) {
		if (!hasImageInput && requested !== "1280:720" && requested !== "720:1280") throw new Error("Runway text-to-video currently supports only 16:9 or 9:16 output ratios.");
		return requested;
	}
	return "1280:720";
}
function resolveEndpoint(req) {
	const imageCount = req.inputImages?.length ?? 0;
	const videoCount = req.inputVideos?.length ?? 0;
	if (imageCount > 0 && videoCount > 0) throw new Error("Runway video generation does not support image and video inputs together.");
	if (imageCount > 1 || videoCount > 1) throw new Error("Runway video generation supports at most one input image or one input video.");
	if (videoCount > 0) return "/v1/video_to_video";
	if (imageCount > 0) return "/v1/image_to_video";
	return "/v1/text_to_video";
}
function buildCreateBody(req, endpoint) {
	const duration = resolveDurationSeconds(req.durationSeconds);
	const ratio = resolveRunwayRatio(req);
	const model = normalizeOptionalString(req.model) ?? DEFAULT_RUNWAY_MODEL;
	if (endpoint !== "/v1/video_to_video") {
		const imageToVideo = endpoint === "/v1/image_to_video";
		const models = imageToVideo ? IMAGE_MODELS : TEXT_ONLY_MODELS;
		const mode = imageToVideo ? "image-to-video" : "text-to-video";
		if (!models.has(model)) throw new Error(`Runway ${mode} does not support model ${model}. Use one of: ${[...models].join(", ")}.`);
		const promptImage = imageToVideo ? resolveSourceUri(req.inputImages?.[0], "image/png") : void 0;
		if (imageToVideo && !promptImage) throw new Error("Runway image-to-video input is missing image data.");
		return {
			model,
			promptText: req.prompt,
			...imageToVideo ? { promptImage } : {},
			ratio,
			duration
		};
	}
	if (!VIDEO_MODELS.has(model)) throw new Error("Runway video-to-video currently requires model gen4_aleph.");
	const videoUri = resolveSourceUri(req.inputVideos?.[0], "video/mp4");
	if (!videoUri) throw new Error("Runway video-to-video input is missing video data.");
	return {
		model,
		promptText: req.prompt,
		videoUri,
		ratio
	};
}
function buildRunwayVideoGenerationProvider() {
	return {
		id: "runway",
		label: "Runway",
		defaultModel: DEFAULT_RUNWAY_MODEL,
		models: [
			"gen4.5",
			"gen4_turbo",
			"gen4_aleph",
			"gen3a_turbo",
			"veo3.1",
			"veo3.1_fast",
			"veo3"
		],
		isConfigured: (ctx) => isProviderApiKeyConfigured({
			provider: "runway",
			...ctx
		}),
		capabilities: {
			generate: {
				maxVideos: 1,
				maxDurationSeconds: MAX_DURATION_SECONDS,
				aspectRatios: RUNWAY_TEXT_ASPECT_RATIOS,
				supportsAspectRatio: true
			},
			imageToVideo: {
				enabled: true,
				maxVideos: 1,
				maxInputImages: 1,
				maxDurationSeconds: MAX_DURATION_SECONDS,
				aspectRatios: RUNWAY_EDIT_ASPECT_RATIOS,
				supportsAspectRatio: true
			},
			videoToVideo: {
				enabled: true,
				maxVideos: 1,
				maxInputVideos: 1,
				aspectRatios: RUNWAY_EDIT_ASPECT_RATIOS,
				supportsAspectRatio: true
			}
		},
		async generateVideo(req) {
			const auth = await resolveApiKeyForProvider({
				provider: "runway",
				cfg: req.cfg,
				agentDir: req.agentDir,
				store: req.authStore
			});
			if (!auth.apiKey) throw new Error("Runway API key missing");
			const fetchFn = fetch;
			const deadline = createProviderOperationDeadline({
				timeoutMs: req.timeoutMs,
				label: "Runway video generation"
			});
			const endpoint = resolveEndpoint(req);
			const requestBody = buildCreateBody(req, endpoint);
			const { baseUrl, allowPrivateNetwork, headers, dispatcherPolicy } = resolveProviderHttpRequestConfig({
				baseUrl: normalizeOptionalString(req.cfg?.models?.providers?.runway?.baseUrl) ?? DEFAULT_RUNWAY_BASE_URL,
				defaultBaseUrl: DEFAULT_RUNWAY_BASE_URL,
				defaultHeaders: {
					Authorization: `Bearer ${auth.apiKey}`,
					"Content-Type": "application/json",
					"X-Runway-Version": RUNWAY_API_VERSION
				},
				provider: "runway",
				capability: "video",
				transport: "http"
			});
			const { response, release } = await postJsonRequest({
				url: `${baseUrl}${endpoint}`,
				headers,
				body: requestBody,
				timeoutMs: resolveProviderOperationTimeoutMs({
					deadline,
					defaultTimeoutMs: DEFAULT_TIMEOUT_MS
				}),
				fetchFn,
				allowPrivateNetwork,
				dispatcherPolicy
			});
			try {
				await assertOkOrThrowHttpError(response, "Runway video generation failed");
				const submitted = await readProviderJsonObjectResponse(response, "Runway video generation failed");
				const taskId = normalizeOptionalString(submitted.id);
				if (!taskId) throw new Error("Runway video generation response missing task id");
				const completed = await pollProviderOperationJson({
					url: `${baseUrl}/v1/tasks/${taskId}`,
					headers,
					deadline: deadline.deadlineAtMs === void 0 ? createProviderOperationDeadline({
						timeoutMs: DEFAULT_TIMEOUT_MS,
						label: `Runway video generation task ${taskId}`
					}) : {
						...deadline,
						label: `Runway video generation task ${taskId}`
					},
					defaultTimeoutMs: DEFAULT_TIMEOUT_MS,
					fetchFn,
					maxAttempts: MAX_POLL_ATTEMPTS,
					pollIntervalMs: POLL_INTERVAL_MS,
					requestFailedMessage: "Runway video status request failed",
					timeoutMessage: `Runway video generation task ${taskId} did not finish in time`,
					isComplete: (payload) => readRunwayTaskStatus(payload) === "SUCCEEDED",
					getFailureMessage: (payload) => {
						const status = readRunwayTaskStatus(payload);
						return status === "FAILED" || status === "CANCELLED" ? readRunwayFailureMessage(payload.failure) || `Runway video generation ${normalizeLowercaseStringOrEmpty(status)}` : void 0;
					}
				});
				const outputUrls = readRunwayOutputUrls(completed);
				const timeoutMs = createProviderOperationTimeoutResolver({
					deadline,
					defaultTimeoutMs: DEFAULT_TIMEOUT_MS
				});
				const maxBytes = resolveGeneratedMediaMaxBytes(req.cfg, "video");
				const videos = [];
				for (const [index, url] of outputUrls.entries()) videos.push(await downloadGeneratedVideoAsset({
					url,
					timeoutMs,
					defaultTimeoutMs: DEFAULT_TIMEOUT_MS,
					fetchFn,
					provider: "runway",
					label: "Runway generated video download",
					requestFailedMessage: "Runway generated video download failed",
					index,
					maxBytes,
					validateBinaryResponse: true,
					metadata: { sourceUrl: url }
				}));
				return {
					videos,
					model: normalizeOptionalString(req.model) ?? DEFAULT_RUNWAY_MODEL,
					metadata: {
						taskId,
						status: normalizeOptionalString(completed.status),
						endpoint,
						outputUrls
					}
				};
			} finally {
				await release();
			}
		}
	};
}
//#endregion
export { buildRunwayVideoGenerationProvider as t };
