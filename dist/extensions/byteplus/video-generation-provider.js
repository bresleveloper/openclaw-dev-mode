import { t as BYTEPLUS_BASE_URL } from "./.setup/models-OLdcJ20o.mjs";
import { resolveImageSourceUrl } from "openclaw/plugin-sdk/image-generation";
import { downloadGeneratedVideoAsset, resolveGeneratedMediaMaxBytes } from "openclaw/plugin-sdk/media-generation-runtime";
import { isProviderApiKeyConfiguredAsync } from "openclaw/plugin-sdk/provider-auth";
import { createProviderOperationDeadline, createProviderOperationTimeoutResolver, pollProviderOperationJson, postJsonResponse, resolveProviderApiKeyHttpRequestConfig, resolveProviderOperationTimeoutMs, sanitizeConfiguredModelProviderRequest } from "openclaw/plugin-sdk/provider-http";
import { asSafeIntegerInRange, isRecord, normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
// extensions/byteplus/video-generation-provider.ts
const DEFAULT_BYTEPLUS_VIDEO_MODEL = "seedance-1-0-pro-250528";
const DEFAULT_TIMEOUT_MS = 12e4;
const POLL_INTERVAL_MS = 5e3;
const MAX_POLL_ATTEMPTS = 120;
const BYTEPLUS_SEED_MAX = 2147483647;
const BYTEPLUS_MIN_DURATION_SECONDS = 2;
const BYTEPLUS_MAX_DURATION_SECONDS = 12;
function isBytePlusTaskComplete(payload) {
	const status = normalizeOptionalString(payload.status);
	switch (status) {
		case "running":
		case "queued": return false;
		case "succeeded": return true;
		case "failed":
		case "cancelled": throw new Error(readBytePlusErrorMessage(payload.error) || "BytePlus video generation failed");
		case void 0: throw new Error("BytePlus video status response missing task status");
		default: throw new Error(`BytePlus video status response returned unknown task status: ${status}`);
	}
}
function readBytePlusErrorMessage(error) {
	return isRecord(error) ? normalizeOptionalString(error.message) : void 0;
}
function buildBytePlusVideoGenerationProvider() {
	return {
		id: "byteplus",
		label: "BytePlus",
		defaultModel: DEFAULT_BYTEPLUS_VIDEO_MODEL,
		models: [DEFAULT_BYTEPLUS_VIDEO_MODEL, "seedance-1-5-pro-251215"],
		isConfiguredAsync: (ctx) => isProviderApiKeyConfiguredAsync({
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
			const fetchFn = fetch;
			const { baseUrl, allowPrivateNetwork, headers, dispatcherPolicy } = await resolveProviderApiKeyHttpRequestConfig({
				req,
				missingApiKeyMessage: "BytePlus API key missing",
				baseUrl: req.cfg?.models?.providers?.byteplus?.baseUrl,
				defaultBaseUrl: BYTEPLUS_BASE_URL,
				request: sanitizeConfiguredModelProviderRequest(req.cfg?.models?.providers?.byteplus?.request),
				allowPrivateNetwork: false,
				provider: "byteplus",
				capability: "video"
			});
			const deadline = createProviderOperationDeadline({
				timeoutMs: req.timeoutMs,
				label: "BytePlus video generation"
			});
			const resolvedModel = normalizeOptionalString(req.model) || DEFAULT_BYTEPLUS_VIDEO_MODEL;
			const content = [{
				type: "text",
				text: req.prompt
			}];
			const imageUrl = resolveImageSourceUrl(req.inputImages?.[0], "BytePlus reference image is missing image data.");
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
			const requestedDuration = req.durationSeconds;
			if (typeof requestedDuration === "number" && Number.isFinite(requestedDuration)) {
				const duration = asSafeIntegerInRange(Math.round(requestedDuration), {
					min: BYTEPLUS_MIN_DURATION_SECONDS,
					max: BYTEPLUS_MAX_DURATION_SECONDS
				});
				if (duration !== void 0) body.duration = duration;
			}
			if (req.audio !== void 0) body.generate_audio = req.audio;
			if (req.watermark !== void 0) body.watermark = req.watermark;
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
			const submitted = await postJsonResponse({
				url: `${baseUrl}/contents/generations/tasks`,
				headers,
				body,
				timeoutMs: resolveProviderOperationTimeoutMs({
					deadline,
					defaultTimeoutMs: DEFAULT_TIMEOUT_MS
				}),
				fetchFn,
				allowPrivateNetwork,
				dispatcherPolicy,
				errorLabel: "BytePlus video generation failed",
				objectResponse: true
			});
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
				ssrfPolicy: { allowPrivateNetwork },
				dispatcherPolicy,
				pollIntervalMs: POLL_INTERVAL_MS,
				requestFailedMessage: "BytePlus video status request failed",
				timeoutMessage: `BytePlus video generation task ${taskId} did not finish in time`,
				isComplete: isBytePlusTaskComplete
			});
			const completedContent = completed.content;
			if (completedContent !== void 0 && !isRecord(completedContent)) throw new Error("BytePlus video generation completed with malformed content");
			const videoUrl = normalizeOptionalString(completedContent?.video_url);
			if (!videoUrl) throw new Error("BytePlus video generation completed without a video URL");
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
					validateBinaryResponse: true,
					dispatcherPolicy
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
		}
	};
}
export { buildBytePlusVideoGenerationProvider };
