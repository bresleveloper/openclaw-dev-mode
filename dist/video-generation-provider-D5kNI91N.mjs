import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { d as readProviderBinaryResponse, m as readProviderJsonResponse, n as assertOkOrThrowHttpError } from "./provider-http-errors-CTY_-ABT.mjs";
import { r as extensionForMime } from "./mime-1zBUMwu6.mjs";
import "./string-coerce-runtime-C_MKhRVt.mjs";
import { n as resolveGeneratedMediaMaxBytes } from "./configured-max-bytes-Cf0SSUBz.mjs";
import { g as waitProviderOperationPollInterval, h as resolveProviderOperationTimeoutMs, l as postJsonRequest, r as createProviderOperationDeadline } from "./shared-BLFkM12I.mjs";
import { t as isProviderApiKeyConfigured } from "./provider-auth-availability-DlkWkL2p.mjs";
import "./media-mime-D8SxWw0k.mjs";
import "./media-generation-runtime-D5Q_N64V.mjs";
import "./provider-http-Dn9NddwC.mjs";
import { d as toImageDataUrl } from "./image-generation-DuVGq5Z_.mjs";
import "./provider-auth-C_UP8nFt.mjs";
import { t as resolveOpenRouterGenerationRequestContext } from "./generation-request-context-404cMz_Z.mjs";
import { n as resolveOpenRouterVideoUrl, t as fetchOpenRouterVideoGet } from "./video-http-F-k-YClw.mjs";
import { n as resolveOpenRouterVideoModelCapabilities } from "./video-model-catalog-DbCHjplV.mjs";
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
	let hasFirstFrame = false;
	let hasLastFrame = false;
	for (const image of inputImages ?? []) {
		const role = normalizeOptionalString(image.role);
		if (role === "reference_image") {
			inputReferences.push(toImagePart(image));
			continue;
		}
		const frameType = role === "last_frame" ? "last_frame" : role === "first_frame" ? "first_frame" : hasFirstFrame ? "last_frame" : "first_frame";
		if (frameType === "first_frame" && !hasFirstFrame) {
			frameImages.push({
				...toImagePart(image),
				frame_type: "first_frame"
			});
			hasFirstFrame = true;
			continue;
		}
		if (frameType === "last_frame" && !hasLastFrame) {
			frameImages.push({
				...toImagePart(image),
				frame_type: "last_frame"
			});
			hasLastFrame = true;
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
	return effectiveDurations.reduce((best, current) => {
		const currentDistance = Math.abs(current - rounded);
		const bestDistance = Math.abs(best - rounded);
		if (currentDistance < bestDistance) return current;
		if (currentDistance === bestDistance && current > best) return current;
		return best;
	});
}
function resolveResolution(resolution) {
	const normalized = normalizeOptionalString(resolution);
	return normalized ? normalized.toLowerCase() : void 0;
}
function resolveSeed(seed) {
	if (seed === void 0) return;
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
	const resolution = resolveResolution(req.resolution);
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
async function fetchOpenRouterJson(params) {
	const { response, release } = await fetchOpenRouterVideoGet(params);
	try {
		await assertOkOrThrowHttpError(response, params.errorContext);
		return readOpenRouterVideoResponse(await readOpenRouterVideoJson(response));
	} finally {
		await release();
	}
}
async function pollOpenRouterVideo(params) {
	const deadline = createProviderOperationDeadline({
		timeoutMs: params.timeoutMs,
		label: "OpenRouter video generation"
	});
	for (let attempt = 0; attempt < MAX_POLL_ATTEMPTS; attempt += 1) {
		const payload = await fetchOpenRouterJson({
			url: params.pollingUrl,
			baseUrl: params.baseUrl,
			headers: params.headers,
			timeoutMs: resolveProviderOperationTimeoutMs({
				deadline,
				defaultTimeoutMs: DEFAULT_HTTP_TIMEOUT_MS
			}),
			allowPrivateNetwork: params.allowPrivateNetwork,
			dispatcherPolicy: params.dispatcherPolicy,
			errorContext: "OpenRouter video status request failed",
			auditContext: "openrouter-video-status"
		});
		const status = normalizeOptionalString(payload.status);
		const state = resolveVideoJobState(status);
		if (state === "completed") return payload;
		if (state === "failure") throw new Error(normalizeOptionalString(payload.error) ?? `OpenRouter video generation ${status}`);
		await waitProviderOperationPollInterval({
			deadline,
			pollIntervalMs: POLL_INTERVAL_MS
		});
	}
	throw new Error("OpenRouter video generation did not finish in time");
}
function resolveOpenRouterContentUrl(params) {
	return resolveOpenRouterVideoUrl(`videos/${encodeURIComponent(params.jobId)}/content?index=0`, params.baseUrl);
}
function resolveDeliverableOpenRouterVideoUrl(value) {
	const normalized = normalizeOptionalString(value);
	if (!normalized) return;
	try {
		const url = new URL(normalized);
		return url.protocol === "https:" || url.protocol === "http:" ? normalized : void 0;
	} catch {
		return;
	}
}
async function downloadOpenRouterVideo(params) {
	const { response, release } = await fetchOpenRouterVideoGet({
		...params,
		auditContext: "openrouter-video-download"
	});
	try {
		await assertOkOrThrowHttpError(response, "OpenRouter generated video download failed");
		const mimeType = normalizeOptionalString(response.headers.get("content-type")) ?? "video/mp4";
		const fileName = `video-1.${extensionForMime(mimeType)?.slice(1) ?? "mp4"}`;
		let exceededMaxBytes = false;
		let buffer;
		const downloadLabel = "OpenRouter generated video download";
		try {
			buffer = await readProviderBinaryResponse(response, downloadLabel, "video", {
				maxBytes: params.maxBytes,
				chunkTimeoutMs: 0,
				onOverflow: ({ maxBytes }) => {
					exceededMaxBytes = true;
					return /* @__PURE__ */ new Error(`${downloadLabel} exceeds ${maxBytes} bytes`);
				}
			});
		} catch (error) {
			if (exceededMaxBytes && params.deliveryUrl) return {
				url: params.deliveryUrl,
				mimeType,
				fileName
			};
			throw error;
		}
		return {
			buffer,
			mimeType,
			fileName
		};
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
				const jobId = normalizeOptionalString(submitted.id);
				const pollingUrl = normalizeOptionalString(submitted.polling_url);
				if (!jobId || !pollingUrl) throw new Error("OpenRouter video generation response missing job details");
				const submittedStatus = normalizeOptionalString(submitted.status);
				const submittedState = submittedStatus ? resolveVideoJobState(submittedStatus) : "active";
				if (submittedState === "failure") throw new Error(normalizeOptionalString(submitted.error) ?? `OpenRouter video generation ${submittedStatus}`);
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
				const completedJobId = normalizeOptionalString(completed.id) ?? jobId;
				const unsignedUrl = completed.unsigned_urls?.find((url) => normalizeOptionalString(url));
				return {
					videos: [await downloadOpenRouterVideo({
						url: unsignedUrl ?? resolveOpenRouterContentUrl({
							baseUrl,
							jobId: completedJobId
						}),
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
					model: normalizeOptionalString(completed.model) ?? model,
					metadata: {
						jobId,
						status: completed.status,
						...normalizeOptionalString(completed.generation_id) ? { generationId: normalizeOptionalString(completed.generation_id) } : {},
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
