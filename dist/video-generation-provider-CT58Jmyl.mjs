import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { f as asSafeIntegerInRange } from "./number-coercion-CkhMiRw8.mjs";
import { m as readProviderJsonResponse, n as assertOkOrThrowHttpError } from "./provider-http-errors-CjVOxCE5.mjs";
import { l as normalizeBaseUrl } from "./provider-request-config-WdycwKIG.mjs";
import "./string-coerce-runtime-BbIJhy7G.mjs";
import { i as resolveGeneratedMediaMaxBytes } from "./configured-max-bytes-BaCve0jk.mjs";
import { _ as resolveProviderOperationTimeoutMs, a as createProviderOperationTimeoutResolver, d as postJsonRequest, h as resolveProviderHttpRequestConfig, r as createProviderOperationDeadline, u as pollProviderOperationJson } from "./shared-BMUa_P4s.mjs";
import { n as isProviderApiKeyConfiguredAsync } from "./provider-auth-availability-CfYdMNuk.mjs";
import { t as downloadGeneratedVideoAsset } from "./media-generation-runtime-BgMYgoiy.mjs";
import { a as resolveApiKeyForProvider } from "./provider-auth-runtime-CMRSW7VK.mjs";
import "./provider-http-BuV15s4V.mjs";
import { u as toImageDataUrl } from "./image-assets-PTBoX6Eo.mjs";
import "./image-generation-DwjRbF_L.mjs";
import "./provider-auth-JCvgbsWg.mjs";
import { t as TOGETHER_BASE_URL } from "./models-CWpYsJ_W.mjs";
//#region extensions/together/video-generation-provider.ts
const DEFAULT_TOGETHER_VIDEO_MODEL = "Wan-AI/wan2.7-t2v";
const TOGETHER_IMAGE_TO_VIDEO_MODELS = /* @__PURE__ */ new Set(["Wan-AI/wan2.7-i2v"]);
const TOGETHER_VIDEO_BASE_URL = "https://api.together.xyz/v2";
const DEFAULT_TIMEOUT_MS = 12e4;
const DEFAULT_OPERATION_TIMEOUT_MS = 12e5;
const POLL_INTERVAL_MS = 5e3;
const MAX_POLL_ATTEMPTS = 240;
const TOGETHER_MIN_DURATION_SECONDS = 1;
const TOGETHER_MAX_DURATION_SECONDS = 10;
const TOGETHER_WAN_DURATIONS = [
	2,
	3,
	4,
	5,
	6,
	7,
	8,
	9,
	10
];
const TOGETHER_MODEL_DURATIONS = {
	"Wan-AI/wan2.7-t2v": TOGETHER_WAN_DURATIONS,
	"Wan-AI/wan2.7-i2v": TOGETHER_WAN_DURATIONS
};
const TOGETHER_WAN_SIZES = {
	"1280x720": {
		resolution: "720P",
		ratio: "16:9"
	},
	"1920x1080": {
		resolution: "1080P",
		ratio: "16:9"
	},
	"720x1280": {
		resolution: "720P",
		ratio: "9:16"
	},
	"1080x1920": {
		resolution: "1080P",
		ratio: "9:16"
	},
	"960x960": {
		resolution: "720P",
		ratio: "1:1"
	},
	"1440x1440": {
		resolution: "1080P",
		ratio: "1:1"
	},
	"1104x832": {
		resolution: "720P",
		ratio: "4:3"
	},
	"1648x1248": {
		resolution: "1080P",
		ratio: "4:3"
	},
	"832x1104": {
		resolution: "720P",
		ratio: "3:4"
	},
	"1248x1648": {
		resolution: "1080P",
		ratio: "3:4"
	}
};
function resolveTogetherVideoBaseUrl(req) {
	const configuredBaseUrl = normalizeOptionalString(req.cfg?.models?.providers?.together?.baseUrl);
	if (!configuredBaseUrl || normalizeBaseUrl(configuredBaseUrl) === normalizeBaseUrl(TOGETHER_BASE_URL)) return TOGETHER_VIDEO_BASE_URL;
	return configuredBaseUrl;
}
function extractTogetherVideoUrl(payload) {
	if (Array.isArray(payload.outputs)) {
		for (const entry of payload.outputs) {
			const url = normalizeOptionalString(entry.video_url) ?? normalizeOptionalString(entry.url);
			if (url) return url;
		}
		return;
	}
	return normalizeOptionalString(payload.outputs?.video_url) ?? normalizeOptionalString(payload.outputs?.url);
}
function readTogetherVideoFailureMessage(payload) {
	return payload.status === "failed" ? normalizeOptionalString(payload.error?.message) ?? "Together video generation failed" : void 0;
}
function resolveTogetherDurationSeconds(value, min) {
	if (typeof value !== "number" || !Number.isFinite(value)) return;
	const duration = asSafeIntegerInRange(Math.round(value), {
		min,
		max: TOGETHER_MAX_DURATION_SECONDS
	});
	return duration === void 0 ? void 0 : String(duration);
}
function buildTogetherVideoGenerationProvider() {
	return {
		id: "together",
		label: "Together",
		defaultModel: DEFAULT_TOGETHER_VIDEO_MODEL,
		models: [
			DEFAULT_TOGETHER_VIDEO_MODEL,
			"Wan-AI/wan2.7-i2v",
			"minimax/hailuo-02"
		],
		isConfiguredAsync: (ctx) => isProviderApiKeyConfiguredAsync({
			provider: "together",
			...ctx
		}),
		capabilities: {
			generate: {
				maxVideos: 1,
				maxDurationSeconds: TOGETHER_MAX_DURATION_SECONDS,
				supportedDurationSecondsByModel: TOGETHER_MODEL_DURATIONS,
				supportsSize: true
			},
			imageToVideo: {
				enabled: true,
				maxInputImagesByModel: { "Wan-AI/wan2.7-i2v": 1 },
				maxDurationSeconds: TOGETHER_MAX_DURATION_SECONDS,
				supportedDurationSecondsByModel: TOGETHER_MODEL_DURATIONS,
				supportsSize: true
			},
			videoToVideo: { enabled: false }
		},
		async generateVideo(req) {
			if ((req.inputVideos?.length ?? 0) > 0) throw new Error("Together video generation does not support video reference inputs.");
			const auth = await resolveApiKeyForProvider({
				provider: "together",
				cfg: req.cfg,
				agentDir: req.agentDir,
				store: req.authStore
			});
			if (!auth.apiKey) throw new Error("Together API key missing");
			const fetchFn = fetch;
			const deadline = createProviderOperationDeadline({
				timeoutMs: req.timeoutMs,
				label: "Together video generation"
			});
			const { baseUrl, allowPrivateNetwork, headers, dispatcherPolicy } = resolveProviderHttpRequestConfig({
				baseUrl: resolveTogetherVideoBaseUrl(req),
				defaultBaseUrl: TOGETHER_VIDEO_BASE_URL,
				allowPrivateNetwork: false,
				defaultHeaders: {
					Authorization: `Bearer ${auth.apiKey}`,
					"Content-Type": "application/json"
				},
				provider: "together",
				capability: "video",
				transport: "http"
			});
			const model = normalizeOptionalString(req.model) ?? DEFAULT_TOGETHER_VIDEO_MODEL;
			const isWanModel = model === DEFAULT_TOGETHER_VIDEO_MODEL || TOGETHER_IMAGE_TO_VIDEO_MODELS.has(model);
			const body = {
				model,
				prompt: req.prompt
			};
			const duration = resolveTogetherDurationSeconds(req.durationSeconds, isWanModel ? TOGETHER_WAN_DURATIONS[0] : TOGETHER_MIN_DURATION_SECONDS);
			if (duration !== void 0) body.seconds = duration;
			const size = normalizeOptionalString(req.size);
			if (size && isWanModel) {
				const dimensions = TOGETHER_WAN_SIZES[size];
				if (!dimensions) throw new Error(`Together video model ${model} does not support size ${size}. Use ${Object.keys(TOGETHER_WAN_SIZES).join(", ")} or omit size.`);
				Object.assign(body, dimensions);
			} else if (size) {
				const match = /^(\d+)x(\d+)$/u.exec(size);
				if (match) {
					body.width = Number.parseInt(match[1] ?? "", 10);
					body.height = Number.parseInt(match[2] ?? "", 10);
				}
			}
			if (req.inputImages?.[0]) {
				if (!TOGETHER_IMAGE_TO_VIDEO_MODELS.has(model)) throw new Error(`Together video model ${model} does not support image reference inputs. Use Wan-AI/wan2.7-i2v or omit input images.`);
				const input = req.inputImages[0];
				const value = normalizeOptionalString(input.url) ?? (input.buffer ? toImageDataUrl({
					...input,
					buffer: input.buffer,
					defaultMimeType: "image/png"
				}) : void 0);
				if (!value) throw new Error("Together reference image is missing image data.");
				body.media = { frame_images: [{
					input_image: value,
					frame: "first"
				}] };
			}
			const { response, release } = await postJsonRequest({
				url: `${baseUrl}/videos`,
				headers,
				body,
				timeoutMs: resolveProviderOperationTimeoutMs({
					deadline,
					defaultTimeoutMs: DEFAULT_TIMEOUT_MS
				}),
				fetchFn,
				allowPrivateNetwork,
				dispatcherPolicy
			});
			try {
				await assertOkOrThrowHttpError(response, "Together video generation failed");
				const submitted = await readProviderJsonResponse(response, "Together video generation failed");
				const failureMessage = readTogetherVideoFailureMessage(submitted);
				if (failureMessage) throw new Error(failureMessage);
				const videoId = normalizeOptionalString(submitted.id);
				if (!videoId) throw new Error("Together video generation response missing id");
				const completed = submitted.status === "completed" ? submitted : await pollProviderOperationJson({
					url: `${baseUrl}/videos/${videoId}`,
					headers,
					deadline: deadline.deadlineAtMs === void 0 ? createProviderOperationDeadline({
						timeoutMs: DEFAULT_OPERATION_TIMEOUT_MS,
						label: `Together video generation task ${videoId}`
					}) : {
						...deadline,
						label: `Together video generation task ${videoId}`
					},
					defaultTimeoutMs: DEFAULT_TIMEOUT_MS,
					fetchFn,
					maxAttempts: MAX_POLL_ATTEMPTS,
					pollIntervalMs: POLL_INTERVAL_MS,
					requestFailedMessage: "Together video status request failed",
					timeoutMessage: `Together video generation task ${videoId} did not finish in time`,
					isComplete: (payload) => payload.status === "completed",
					getFailureMessage: readTogetherVideoFailureMessage
				});
				const videoUrl = extractTogetherVideoUrl(completed);
				if (!videoUrl) throw new Error("Together video generation completed without an output URL");
				return {
					videos: [await downloadGeneratedVideoAsset({
						url: videoUrl,
						timeoutMs: createProviderOperationTimeoutResolver({
							deadline,
							defaultTimeoutMs: DEFAULT_TIMEOUT_MS
						}),
						defaultTimeoutMs: DEFAULT_TIMEOUT_MS,
						fetchFn,
						provider: "together",
						label: "Together generated video download",
						requestFailedMessage: "Together generated video download failed",
						maxBytes: resolveGeneratedMediaMaxBytes(req.cfg, "video"),
						validateBinaryResponse: true,
						chunkTimeoutMs: 0
					})],
					model: completed.model ?? req.model ?? DEFAULT_TOGETHER_VIDEO_MODEL,
					metadata: {
						videoId,
						status: completed.status,
						videoUrl
					}
				};
			} finally {
				await release();
			}
		}
	};
}
//#endregion
export { buildTogetherVideoGenerationProvider as t };
