import { t as BYTEPLUS_BASE_URL } from "./.setup/models-B35FIrA-.mjs";
import { toImageDataUrl } from "openclaw/plugin-sdk/image-generation";
import { downloadGeneratedVideoAsset, resolveGeneratedMediaMaxBytes } from "openclaw/plugin-sdk/media-generation-runtime";
import { isProviderApiKeyConfigured } from "openclaw/plugin-sdk/provider-auth";
import { resolveApiKeyForProvider } from "openclaw/plugin-sdk/provider-auth-runtime";
import { assertOkOrThrowHttpError, createProviderOperationDeadline, createProviderOperationTimeoutResolver, pollProviderOperationJson, postJsonRequest, readProviderJsonObjectResponse, resolveProviderHttpRequestConfig, resolveProviderOperationTimeoutMs } from "openclaw/plugin-sdk/provider-http";
import { asSafeIntegerInRange, isRecord, normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
//#region extensions/byteplus/video-generation-provider.ts
const DEFAULT_BYTEPLUS_VIDEO_MODEL = "seedance-1-0-pro-250528";
const DEFAULT_TIMEOUT_MS = 12e4;
const POLL_INTERVAL_MS = 5e3;
const MAX_POLL_ATTEMPTS = 120;
const BYTEPLUS_SEED_MAX = 2147483647;
const BYTEPLUS_MIN_DURATION_SECONDS = 2;
const BYTEPLUS_MAX_DURATION_SECONDS = 12;
function readBytePlusTaskStatus(payload) {
	const status = normalizeOptionalString(payload.status);
	switch (status) {
		case "running":
		case "failed":
		case "queued":
		case "succeeded":
		case "cancelled": return status;
		case void 0: throw new Error("BytePlus video status response missing task status");
		default: throw new Error(`BytePlus video status response returned unknown task status: ${status}`);
	}
}
function readBytePlusErrorMessage(error) {
	return isRecord(error) ? normalizeOptionalString(error.message) : void 0;
}
function readBytePlusVideoUrl(payload) {
	const content = payload.content;
	if (content !== void 0 && !isRecord(content)) throw new Error("BytePlus video generation completed with malformed content");
	const videoUrl = normalizeOptionalString(content?.video_url);
	if (!videoUrl) throw new Error("BytePlus video generation completed without a video URL");
	return videoUrl;
}
function resolveBytePlusImageUrl(req) {
	const input = req.inputImages?.[0];
	if (!input) return;
	const inputUrl = normalizeOptionalString(input.url);
	if (inputUrl) return inputUrl;
	if (!input.buffer) throw new Error("BytePlus reference image is missing image data.");
	return toImageDataUrl({
		...input,
		buffer: input.buffer,
		defaultMimeType: "image/png"
	});
}
function resolveBytePlusDurationSeconds(value) {
	if (typeof value !== "number" || !Number.isFinite(value)) return;
	return asSafeIntegerInRange(Math.round(value), {
		min: BYTEPLUS_MIN_DURATION_SECONDS,
		max: BYTEPLUS_MAX_DURATION_SECONDS
	});
}
function buildBytePlusVideoGenerationProvider() {
	return {
		id: "byteplus",
		label: "BytePlus",
		defaultModel: DEFAULT_BYTEPLUS_VIDEO_MODEL,
		models: [DEFAULT_BYTEPLUS_VIDEO_MODEL, "seedance-1-5-pro-251215"],
		isConfigured: (ctx) => isProviderApiKeyConfigured({
			provider: "byteplus",
			...ctx
		}),
		capabilities: {
			providerOptions: {
				seed: "number",
				draft: "boolean",
				camera_fixed: "boolean"
			},
			generate: {
				maxVideos: 1,
				maxDurationSeconds: 12,
				supportsAspectRatio: true,
				supportsResolution: true,
				supportsAudio: true,
				supportsWatermark: true
			},
			imageToVideo: {
				enabled: true,
				maxVideos: 1,
				maxInputImages: 1,
				maxDurationSeconds: 12,
				supportsAspectRatio: true,
				supportsResolution: true,
				supportsAudio: true,
				supportsWatermark: true
			},
			videoToVideo: { enabled: false }
		},
		async generateVideo(req) {
			if ((req.inputVideos?.length ?? 0) > 0) throw new Error("BytePlus video generation does not support video reference inputs.");
			const auth = await resolveApiKeyForProvider({
				provider: "byteplus",
				cfg: req.cfg,
				agentDir: req.agentDir,
				store: req.authStore
			});
			if (!auth.apiKey) throw new Error("BytePlus API key missing");
			const fetchFn = fetch;
			const deadline = createProviderOperationDeadline({
				timeoutMs: req.timeoutMs,
				label: "BytePlus video generation"
			});
			const { baseUrl, allowPrivateNetwork, headers, dispatcherPolicy } = resolveProviderHttpRequestConfig({
				baseUrl: normalizeOptionalString(req.cfg?.models?.providers?.byteplus?.baseUrl) ?? BYTEPLUS_BASE_URL,
				defaultBaseUrl: BYTEPLUS_BASE_URL,
				allowPrivateNetwork: false,
				defaultHeaders: {
					Authorization: `Bearer ${auth.apiKey}`,
					"Content-Type": "application/json"
				},
				provider: "byteplus",
				capability: "video",
				transport: "http"
			});
			const resolvedModel = normalizeOptionalString(req.model) || DEFAULT_BYTEPLUS_VIDEO_MODEL;
			const content = [{
				type: "text",
				text: req.prompt
			}];
			const imageUrl = resolveBytePlusImageUrl(req);
			if (imageUrl) content.push({
				type: "image_url",
				image_url: { url: imageUrl },
				role: "first_frame"
			});
			const body = {
				model: resolvedModel,
				content
			};
			const aspectRatio = normalizeOptionalString(req.aspectRatio);
			if (aspectRatio) body.ratio = aspectRatio;
			const resolution = normalizeOptionalString(req.resolution)?.toLowerCase();
			if (resolution) body.resolution = resolution;
			const duration = resolveBytePlusDurationSeconds(req.durationSeconds);
			if (duration !== void 0) body.duration = duration;
			if (typeof req.audio === "boolean") body.generate_audio = req.audio;
			if (typeof req.watermark === "boolean") body.watermark = req.watermark;
			const opts = req.providerOptions ?? {};
			const seed = asSafeIntegerInRange(opts.seed, {
				min: -1,
				max: BYTEPLUS_SEED_MAX
			});
			const draft = opts.draft === true;
			const cameraFixed = typeof opts.camera_fixed === "boolean" ? opts.camera_fixed : void 0;
			if (seed != null) body.seed = seed;
			if (draft && !body.resolution) body.resolution = "480p";
			if (cameraFixed != null) body.camera_fixed = cameraFixed;
			const { response, release } = await postJsonRequest({
				url: `${baseUrl}/contents/generations/tasks`,
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
				await assertOkOrThrowHttpError(response, "BytePlus video generation failed");
				const submitted = await readProviderJsonObjectResponse(response, "BytePlus video generation failed");
				const taskId = normalizeOptionalString(submitted.id);
				if (!taskId) throw new Error("BytePlus video generation response missing task id");
				const completed = await pollProviderOperationJson({
					url: `${baseUrl}/contents/generations/tasks/${taskId}`,
					headers,
					deadline: createProviderOperationDeadline({
						timeoutMs: resolveProviderOperationTimeoutMs({
							deadline,
							defaultTimeoutMs: DEFAULT_TIMEOUT_MS
						}),
						label: `BytePlus video generation task ${taskId}`
					}),
					defaultTimeoutMs: DEFAULT_TIMEOUT_MS,
					fetchFn,
					maxAttempts: MAX_POLL_ATTEMPTS,
					pollIntervalMs: POLL_INTERVAL_MS,
					requestFailedMessage: "BytePlus video status request failed",
					timeoutMessage: `BytePlus video generation task ${taskId} did not finish in time`,
					isComplete: (payload) => readBytePlusTaskStatus(payload) === "succeeded",
					getFailureMessage: (payload) => {
						const status = readBytePlusTaskStatus(payload);
						return status === "failed" || status === "cancelled" ? readBytePlusErrorMessage(payload.error) || "BytePlus video generation failed" : void 0;
					}
				});
				const videoUrl = readBytePlusVideoUrl(completed);
				return {
					videos: [await downloadGeneratedVideoAsset({
						url: videoUrl,
						timeoutMs: createProviderOperationTimeoutResolver({
							deadline,
							defaultTimeoutMs: DEFAULT_TIMEOUT_MS
						}),
						defaultTimeoutMs: DEFAULT_TIMEOUT_MS,
						fetchFn,
						provider: "byteplus",
						label: "BytePlus generated video download",
						requestFailedMessage: "BytePlus generated video download failed",
						maxBytes: resolveGeneratedMediaMaxBytes(req.cfg, "video"),
						validateBinaryResponse: true
					})],
					model: normalizeOptionalString(completed.model) ?? resolvedModel,
					metadata: {
						taskId,
						status: normalizeOptionalString(completed.status),
						videoUrl,
						ratio: normalizeOptionalString(completed.ratio),
						resolution: normalizeOptionalString(completed.resolution),
						duration: asSafeIntegerInRange(completed.duration, {
							min: BYTEPLUS_MIN_DURATION_SECONDS,
							max: BYTEPLUS_MAX_DURATION_SECONDS
						})
					}
				};
			} finally {
				await release();
			}
		}
	};
}
//#endregion
export { buildBytePlusVideoGenerationProvider };
