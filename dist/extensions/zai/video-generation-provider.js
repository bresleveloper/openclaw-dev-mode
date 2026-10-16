import { u as resolveZaiBaseUrl } from "./.setup/model-definitions-DjGQ-3Uy.mjs";
import { isRecord, normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
import { assertOkOrThrowHttpError, createProviderOperationDeadline, createProviderOperationTimeoutResolver, pollProviderOperationJson, postJsonRequest, readProviderJsonObjectResponse, resolveProviderHttpRequestConfig, sanitizeConfiguredModelProviderRequest } from "openclaw/plugin-sdk/provider-http";
import { toImageDataUrl } from "openclaw/plugin-sdk/image-generation";
import { downloadGeneratedVideoAsset, resolveClosestSize, resolveGeneratedMediaMaxBytes } from "openclaw/plugin-sdk/media-generation-runtime";
import { isProviderApiKeyConfigured } from "openclaw/plugin-sdk/provider-auth";
import { resolveApiKeyForProvider } from "openclaw/plugin-sdk/provider-auth-runtime";
//#region extensions/zai/video-generation-provider.ts
const DEFAULT_MODEL = "cogvideox-3";
const DEFAULT_TIMEOUT_MS = 6e5;
const POLL_INTERVAL_MS = 5e3;
const MAX_IMAGE_BYTES = 5242880;
const SIZES = [
	"1280x720",
	"720x1280",
	"1024x1024",
	"1920x1080",
	"1080x1920",
	"2048x1080",
	"3840x2160"
];
const MODE_CAPABILITIES = {
	maxVideos: 1,
	maxDurationSeconds: 10,
	supportedDurationSeconds: [5, 10],
	sizes: SIZES,
	aspectRatios: [
		"16:9",
		"9:16",
		"1:1"
	],
	supportsSize: true,
	supportsAspectRatio: true,
	supportsAudio: true,
	providerOptions: {
		quality: "string",
		fps: "number"
	}
};
function resolveVideoBaseUrl(configured) {
	const baseUrl = normalizeOptionalString(configured)?.replace(/\/+$/u, "") ?? resolveZaiBaseUrl();
	if (baseUrl === "https://open.bigmodel.cn/api/coding/paas/v4") return resolveZaiBaseUrl("cn");
	if (baseUrl === "https://api.z.ai/api/coding/paas/v4") return resolveZaiBaseUrl("global");
	return baseUrl;
}
function buildCreateBody(req) {
	const model = normalizeOptionalString(req.model) ?? DEFAULT_MODEL;
	if (model !== DEFAULT_MODEL) throw new Error(`Z.AI video generation does not support model ${model}. Use ${DEFAULT_MODEL}.`);
	if ((req.inputVideos?.length ?? 0) > 0 || (req.inputAudios?.length ?? 0) > 0) throw new Error("Z.AI video generation does not support video or audio reference inputs.");
	if ((req.inputImages?.length ?? 0) > 1) throw new Error("Z.AI video generation supports at most one input image.");
	const quality = req.providerOptions?.quality ?? "speed";
	if (quality !== "speed" && quality !== "quality") throw new Error("Z.AI video quality must be \"speed\" or \"quality\".");
	const fps = req.providerOptions?.fps ?? 30;
	if (fps !== 30 && fps !== 60) throw new Error("Z.AI video fps must be 30 or 60.");
	const duration = req.durationSeconds;
	const body = {
		model,
		prompt: req.prompt,
		quality,
		fps,
		duration: typeof duration === "number" && Number.isFinite(duration) && duration > 7.5 ? 10 : 5,
		size: resolveClosestSize({
			requestedSize: req.size,
			requestedAspectRatio: req.aspectRatio,
			supportedSizes: SIZES
		}) ?? "1280x720",
		with_audio: req.audio ?? false
	};
	const image = req.inputImages?.[0];
	if (image) {
		if (image.role && image.role !== "first_frame") throw new Error("Z.AI image-to-video supports only an ordinary or first_frame image.");
		const url = normalizeOptionalString(image.url);
		if (url) body.image_url = url;
		else {
			if (!image.buffer) throw new Error("Z.AI image-to-video input is missing image data.");
			if (image.buffer.length > MAX_IMAGE_BYTES) throw new Error("Z.AI image-to-video requires a PNG or JPEG image no larger than 5 MB.");
			if (image.mimeType && image.mimeType !== "image/png" && image.mimeType !== "image/jpeg") throw new Error("Z.AI image-to-video requires a PNG or JPEG image.");
			body.image_url = toImageDataUrl({
				...image,
				buffer: image.buffer,
				defaultMimeType: "image/png"
			});
		}
	}
	return body;
}
function readTaskStatus(payload) {
	const status = normalizeOptionalString(payload.task_status);
	if (status !== "PROCESSING" && status !== "SUCCESS" && status !== "FAIL") throw new Error("Z.AI video status response missing or unknown task_status");
	return status;
}
function buildZaiVideoGenerationProvider() {
	return {
		id: "zai",
		label: "Z.AI",
		defaultModel: DEFAULT_MODEL,
		defaultTimeoutMs: DEFAULT_TIMEOUT_MS,
		models: [DEFAULT_MODEL],
		isConfigured: (ctx) => isProviderApiKeyConfigured({
			provider: "zai",
			...ctx
		}),
		capabilities: {
			generate: MODE_CAPABILITIES,
			imageToVideo: {
				...MODE_CAPABILITIES,
				enabled: true,
				maxInputImages: 1
			},
			videoToVideo: { enabled: false }
		},
		async generateVideo(req) {
			const body = buildCreateBody(req);
			const auth = await resolveApiKeyForProvider({
				provider: "zai",
				cfg: req.cfg,
				agentDir: req.agentDir,
				store: req.authStore
			});
			if (!auth.apiKey) throw new Error("Z.AI API key missing");
			const deadline = createProviderOperationDeadline({
				timeoutMs: req.timeoutMs ?? DEFAULT_TIMEOUT_MS,
				label: "Z.AI video generation"
			});
			const timeoutMs = createProviderOperationTimeoutResolver({
				deadline,
				defaultTimeoutMs: DEFAULT_TIMEOUT_MS
			});
			const providerConfig = req.cfg.models?.providers?.zai;
			const { baseUrl, headers, allowPrivateNetwork, dispatcherPolicy } = resolveProviderHttpRequestConfig({
				baseUrl: resolveVideoBaseUrl(providerConfig?.baseUrl),
				defaultBaseUrl: resolveZaiBaseUrl(),
				defaultHeaders: {
					Authorization: `Bearer ${auth.apiKey}`,
					"Content-Type": "application/json"
				},
				provider: "zai",
				capability: "video",
				transport: "http",
				request: sanitizeConfiguredModelProviderRequest(providerConfig?.request)
			});
			const { response, release } = await postJsonRequest({
				url: `${baseUrl}/videos/generations`,
				headers,
				body,
				timeoutMs: timeoutMs(),
				fetchFn: fetch,
				allowPrivateNetwork,
				dispatcherPolicy
			});
			let taskId;
			try {
				await assertOkOrThrowHttpError(response, "Z.AI video generation failed", {
					bodyTimeoutMs: timeoutMs,
					requestHeaders: headers
				});
				const submitted = await readProviderJsonObjectResponse(response, "Z.AI video generation", { timeoutMs });
				const id = normalizeOptionalString(submitted.id);
				if (!id) throw new Error("Z.AI video generation response missing task id");
				taskId = id;
			} finally {
				await release();
			}
			const completed = await pollProviderOperationJson({
				url: `${baseUrl}/async-result/${encodeURIComponent(taskId)}`,
				headers,
				deadline,
				defaultTimeoutMs: DEFAULT_TIMEOUT_MS,
				fetchFn: fetch,
				allowPrivateNetwork,
				dispatcherPolicy,
				maxAttempts: 120,
				pollIntervalMs: POLL_INTERVAL_MS,
				requestFailedMessage: "Z.AI video status request failed",
				timeoutMessage: `Z.AI video generation task ${taskId} did not finish in time`,
				isComplete: (payload) => readTaskStatus(payload) === "SUCCESS",
				getFailureMessage: (payload) => readTaskStatus(payload) === "FAIL" ? normalizeOptionalString(isRecord(payload.error) ? payload.error.message : payload.message) ?? "Z.AI video generation failed" : void 0
			});
			const output = Array.isArray(completed.video_result) ? completed.video_result[0] : void 0;
			const videoUrl = isRecord(output) ? normalizeOptionalString(output.url) : void 0;
			if (!videoUrl) throw new Error("Z.AI video generation completed without a video URL");
			return {
				videos: [await downloadGeneratedVideoAsset({
					url: videoUrl,
					timeoutMs,
					defaultTimeoutMs: DEFAULT_TIMEOUT_MS,
					fetchFn: fetch,
					provider: "zai",
					label: "Z.AI generated video download",
					requestFailedMessage: "Z.AI generated video download failed",
					maxBytes: resolveGeneratedMediaMaxBytes(req.cfg, "video"),
					validateBinaryResponse: true,
					metadata: { sourceUrl: videoUrl }
				})],
				model: DEFAULT_MODEL,
				metadata: {
					taskId,
					status: completed.task_status,
					videoUrl
				}
			};
		}
	};
}
//#endregion
export { buildZaiVideoGenerationProvider };
