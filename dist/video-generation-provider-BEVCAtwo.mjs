import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { m as readProviderJsonResponse, n as assertOkOrThrowHttpError } from "./provider-http-errors-DmewLLH7.mjs";
import "./string-coerce-runtime-50qKeWeL.mjs";
import { r as resolveGeneratedMediaMaxBytes } from "./configured-max-bytes-CtwRSse3.mjs";
import { _ as resolveProviderOperationTimeoutMs, d as postJsonRequest, l as pollProviderOperation, r as createProviderOperationDeadline, v as waitProviderOperationPollInterval } from "./shared-DcnGQdHV.mjs";
import { t as isProviderApiKeyConfigured } from "./provider-auth-availability-BmVs5Dky.mjs";
import { r as selectSupportedVideoDuration } from "./duration-support-BfgJ7oBc.mjs";
import { n as readGeneratedVideoAsset } from "./media-generation-runtime-D1HcnVCx.mjs";
import "./provider-http-CuRGJD0L.mjs";
import { u as toImageDataUrl } from "./image-assets-DT0442If.mjs";
import "./image-generation-OBYa9Syc.mjs";
import "./video-generation-D5W8W7TP.mjs";
import "./provider-auth-C3BBF7yn.mjs";
import { t as resolveOpenRouterGenerationRequestContext } from "./generation-request-context-BeJZpqVc.mjs";
import { n as resolveOpenRouterVideoUrl, t as fetchOpenRouterVideoGet } from "./video-http-B9DrLYlY.mjs";
import { n as resolveOpenRouterVideoModelCapabilities } from "./video-model-catalog-ChjmsaA6.mjs";
//#region extensions/openrouter/video-generation-provider.ts
const DEFAULT_MODEL = "google/veo-3.1-fast";
const DEFAULT_TIMEOUT_MS = 6e5;
const DEFAULT_HTTP_TIMEOUT_MS = 6e4;
const POLL_INTERVAL_MS = 5e3;
const MAX_POLL_ATTEMPTS = 120;
const SUPPORTED_ASPECT_RATIOS = ["16:9", "9:16"];
const OPENROUTER_VIDEO_MALFORMED_RESPONSE = "OpenRouter video generation response malformed";
const SUPPORTED_DURATION_SECONDS = [
	4,
	6,
	8
];
const SUPPORTED_DURATIONS_HINT = Symbol.for("openclaw.videoGeneration.supportedDurations");
const SUPPORTED_RESOLUTIONS = ["720P", "1080P"];
async function readOpenRouterVideoJson(response) {
	let payload;
	try {
		payload = await readProviderJsonResponse(response, "OpenRouter video generation");
	} catch (error) {
		if (error instanceof Error && error.message.endsWith(": malformed JSON response")) throw new Error(OPENROUTER_VIDEO_MALFORMED_RESPONSE, { cause: error });
		throw error;
	}
	if (!isRecord(payload)) throw new Error(OPENROUTER_VIDEO_MALFORMED_RESPONSE);
	return payload;
}
function readOpenRouterVideoResponse(payload) {
	const unsignedUrls = payload.unsigned_urls;
	if (unsignedUrls !== void 0 && unsignedUrls !== null && !Array.isArray(unsignedUrls)) throw new Error(OPENROUTER_VIDEO_MALFORMED_RESPONSE);
	const usage = payload.usage;
	if (usage !== void 0 && usage !== null && !isRecord(usage)) throw new Error(OPENROUTER_VIDEO_MALFORMED_RESPONSE);
	return {
		id: normalizeOptionalString(payload.id),
		generation_id: normalizeOptionalString(payload.generation_id) ?? null,
		polling_url: normalizeOptionalString(payload.polling_url),
		status: normalizeOptionalString(payload.status),
		unsigned_urls: Array.isArray(unsignedUrls) ? unsignedUrls.map((url) => {
			const normalized = normalizeOptionalString(url);
			if (!normalized) throw new Error(OPENROUTER_VIDEO_MALFORMED_RESPONSE);
			return normalized;
		}) : void 0,
		error: normalizeOptionalString(payload.error) ?? null,
		model: normalizeOptionalString(payload.model) ?? null,
		usage: isRecord(usage) ? {
			cost: typeof usage.cost === "number" ? usage.cost : null,
			is_byok: typeof usage.is_byok === "boolean" ? usage.is_byok : void 0
		} : void 0
	};
}
function toDataUrl(asset) {
	if (asset.buffer) return toImageDataUrl({
		...asset,
		buffer: asset.buffer,
		defaultMimeType: "image/png"
	});
	const url = normalizeOptionalString(asset.url);
	if (url) return url;
	throw new Error("OpenRouter video generation requires image references to include a URL or buffer.");
}
function toImagePart(asset) {
	return {
		type: "image_url",
		image_url: { url: toDataUrl(asset) }
	};
}
function buildImageInputs(inputImages) {
	const frameImages = [];
	const inputReferences = [];
	const frameTypes = /* @__PURE__ */ new Set();
	for (const image of inputImages ?? []) {
		const role = normalizeOptionalString(image.role);
		if (role === "reference_image") {
			inputReferences.push(toImagePart(image));
			continue;
		}
		const frameType = role === "first_frame" || role === "last_frame" ? role : frameTypes.has("first_frame") ? "last_frame" : "first_frame";
		if (!frameTypes.has(frameType)) {
			frameImages.push({
				...toImagePart(image),
				frame_type: frameType
			});
			frameTypes.add(frameType);
			continue;
		}
		inputReferences.push(toImagePart(image));
	}
	return {
		frameImages,
		inputReferences
	};
}
function resolveDurationSeconds(durationSeconds, supportedDurations = SUPPORTED_DURATION_SECONDS) {
	if (typeof durationSeconds !== "number" || !Number.isFinite(durationSeconds)) return;
	const effectiveDurations = supportedDurations.length > 0 ? supportedDurations : SUPPORTED_DURATION_SECONDS;
	const rounded = Math.max(1, Math.round(durationSeconds));
	if (durationSeconds === rounded && effectiveDurations.includes(rounded)) return rounded;
	return selectSupportedVideoDuration(rounded, effectiveDurations);
}
function resolveSeed(seed) {
	if (typeof seed !== "number") return;
	if (!Number.isSafeInteger(seed)) throw new Error("OpenRouter video seed must be an integer");
	return seed;
}
function buildRequestBody(req, model) {
	const { frameImages, inputReferences } = buildImageInputs(req.inputImages);
	const supportedDurations = req[SUPPORTED_DURATIONS_HINT] ?? SUPPORTED_DURATION_SECONDS;
	const body = {
		model,
		prompt: req.prompt
	};
	const duration = resolveDurationSeconds(req.durationSeconds, supportedDurations);
	if (duration != null) body.duration = duration;
	const resolution = normalizeOptionalString(req.resolution)?.toLowerCase();
	if (resolution) body.resolution = resolution;
	const aspectRatio = normalizeOptionalString(req.aspectRatio);
	if (aspectRatio) body.aspect_ratio = aspectRatio;
	const size = normalizeOptionalString(req.size);
	if (size) body.size = size;
	if (typeof req.audio === "boolean") body.generate_audio = req.audio;
	if (frameImages.length > 0) body.frame_images = frameImages;
	if (inputReferences.length > 0) body.input_references = inputReferences;
	const seed = resolveSeed(req.providerOptions?.seed);
	if (seed !== void 0) body.seed = seed;
	const callbackUrl = typeof req.providerOptions?.callback_url === "string" ? normalizeOptionalString(req.providerOptions.callback_url) : void 0;
	if (callbackUrl) body.callback_url = callbackUrl;
	return body;
}
function resolveVideoJobState(status) {
	if (status === "completed") return "completed";
	if (status === "failed" || status === "cancelled" || status === "expired") return "failure";
	if (status && [
		"queued",
		"pending",
		"in_progress",
		"processing",
		"running"
	].includes(status)) return "active";
	throw new Error(OPENROUTER_VIDEO_MALFORMED_RESPONSE);
}
async function pollOpenRouterVideo(params) {
	const deadline = createProviderOperationDeadline({
		timeoutMs: params.timeoutMs,
		label: "OpenRouter video generation"
	});
	return await pollProviderOperation({
		maxAttempts: MAX_POLL_ATTEMPTS,
		timeoutMessage: "OpenRouter video generation did not finish in time",
		wait: () => waitProviderOperationPollInterval({
			deadline,
			pollIntervalMs: POLL_INTERVAL_MS
		}),
		read: async () => {
			const { response, release } = await fetchOpenRouterVideoGet({
				url: params.pollingUrl,
				baseUrl: params.baseUrl,
				headers: params.headers,
				timeoutMs: resolveProviderOperationTimeoutMs({
					deadline,
					defaultTimeoutMs: DEFAULT_HTTP_TIMEOUT_MS
				}),
				allowPrivateNetwork: params.allowPrivateNetwork,
				dispatcherPolicy: params.dispatcherPolicy,
				auditContext: "openrouter-video-status"
			});
			try {
				await assertOkOrThrowHttpError(response, "OpenRouter video status request failed");
				return readOpenRouterVideoResponse(await readOpenRouterVideoJson(response));
			} finally {
				await release();
			}
		},
		isComplete: (payload) => resolveVideoJobState(payload.status) === "completed",
		getFailureMessage: (payload) => resolveVideoJobState(payload.status) === "failure" ? payload.error || `OpenRouter video generation ${payload.status}` : void 0
	});
}
function resolveDeliverableOpenRouterVideoUrl(value) {
	const normalized = normalizeOptionalString(value);
	if (!normalized) return;
	const url = URL.parse(normalized);
	return url?.protocol === "https:" || url?.protocol === "http:" ? normalized : void 0;
}
async function downloadOpenRouterVideo(params) {
	const { response, release } = await fetchOpenRouterVideoGet({
		...params,
		auditContext: "openrouter-video-download"
	});
	try {
		await assertOkOrThrowHttpError(response, "OpenRouter generated video download failed");
		return await readGeneratedVideoAsset(response, {
			label: "OpenRouter generated video download",
			maxBytes: params.maxBytes,
			validateBinaryResponse: true,
			overflowUrl: params.deliveryUrl,
			readOptions: { chunkTimeoutMs: 0 }
		});
	} finally {
		await release();
	}
}
function buildOpenRouterVideoGenerationProvider() {
	return {
		id: "openrouter",
		label: "OpenRouter",
		defaultModel: DEFAULT_MODEL,
		models: [DEFAULT_MODEL],
		isConfigured: (ctx) => isProviderApiKeyConfigured({
			provider: "openrouter",
			...ctx
		}),
		resolveModelCapabilities: resolveOpenRouterVideoModelCapabilities,
		capabilities: {
			providerOptions: {
				callback_url: "string",
				seed: "number"
			},
			generate: {
				maxVideos: 1,
				supportedDurationSeconds: [...SUPPORTED_DURATION_SECONDS],
				supportsAspectRatio: true,
				supportsResolution: true,
				supportsSize: true,
				supportsAudio: true,
				aspectRatios: [...SUPPORTED_ASPECT_RATIOS],
				resolutions: [...SUPPORTED_RESOLUTIONS]
			},
			imageToVideo: {
				enabled: true,
				maxVideos: 1,
				maxInputImages: 4,
				supportedDurationSeconds: [...SUPPORTED_DURATION_SECONDS],
				supportsAspectRatio: true,
				supportsResolution: true,
				supportsSize: true,
				supportsAudio: true,
				aspectRatios: [...SUPPORTED_ASPECT_RATIOS],
				resolutions: [...SUPPORTED_RESOLUTIONS]
			},
			videoToVideo: { enabled: false }
		},
		async generateVideo(req) {
			if ((req.inputVideos?.length ?? 0) > 0) throw new Error("OpenRouter video generation does not support video reference inputs.");
			const model = normalizeOptionalString(req.model) ?? DEFAULT_MODEL;
			const { baseUrl, allowPrivateNetwork, headers, dispatcherPolicy } = await resolveOpenRouterGenerationRequestContext({
				cfg: req.cfg,
				agentDir: req.agentDir,
				authStore: req.authStore,
				capability: "video",
				jsonContentType: true
			});
			const deadline = createProviderOperationDeadline({
				timeoutMs: req.timeoutMs,
				label: "OpenRouter video generation"
			});
			const { response, release } = await postJsonRequest({
				url: `${baseUrl}/videos`,
				headers,
				body: buildRequestBody(req, model),
				timeoutMs: resolveProviderOperationTimeoutMs({
					deadline,
					defaultTimeoutMs: DEFAULT_HTTP_TIMEOUT_MS
				}),
				fetchFn: fetch,
				allowPrivateNetwork,
				dispatcherPolicy,
				auditContext: "openrouter-video-submit"
			});
			try {
				await assertOkOrThrowHttpError(response, "OpenRouter video generation failed");
				const submitted = readOpenRouterVideoResponse(await readOpenRouterVideoJson(response));
				const jobId = submitted.id;
				const pollingUrl = submitted.polling_url;
				if (!jobId || !pollingUrl) throw new Error("OpenRouter video generation response missing job details");
				const submittedStatus = submitted.status;
				const submittedState = submittedStatus ? resolveVideoJobState(submittedStatus) : "active";
				if (submittedState === "failure") throw new Error(submitted.error ?? `OpenRouter video generation ${submittedStatus}`);
				const completed = submittedState === "completed" ? submitted : await pollOpenRouterVideo({
					pollingUrl,
					baseUrl,
					headers,
					timeoutMs: resolveProviderOperationTimeoutMs({
						deadline,
						defaultTimeoutMs: DEFAULT_TIMEOUT_MS
					}),
					allowPrivateNetwork,
					dispatcherPolicy
				});
				const completedJobId = completed.id ?? jobId;
				const unsignedUrl = completed.unsigned_urls?.[0];
				return {
					videos: [await downloadOpenRouterVideo({
						url: unsignedUrl ?? resolveOpenRouterVideoUrl(`videos/${encodeURIComponent(completedJobId)}/content?index=0`, baseUrl),
						deliveryUrl: resolveDeliverableOpenRouterVideoUrl(unsignedUrl),
						baseUrl,
						headers,
						timeoutMs: resolveProviderOperationTimeoutMs({
							deadline,
							defaultTimeoutMs: DEFAULT_HTTP_TIMEOUT_MS
						}),
						allowPrivateNetwork,
						dispatcherPolicy,
						maxBytes: resolveGeneratedMediaMaxBytes(req.cfg, "video")
					})],
					model: completed.model ?? model,
					metadata: {
						jobId,
						status: completed.status,
						...completed.generation_id ? { generationId: completed.generation_id } : {},
						...completed.usage ? { usage: completed.usage } : {}
					}
				};
			} finally {
				await release();
			}
		}
	};
}
//#endregion
export { buildOpenRouterVideoGenerationProvider as t };
