import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { y as uniqueStrings } from "./string-normalization-_gRhJUDw.mjs";
import { d as readProviderBinaryResponse, m as readProviderJsonResponse, n as assertOkOrThrowHttpError } from "./provider-http-errors-CTY_-ABT.mjs";
import { n as buildTimeoutAbortSignal } from "./fetch-timeout-BOG6Do5a.mjs";
import { p as sanitizeConfiguredModelProviderRequest } from "./provider-request-config-DOrVD029.mjs";
import { d as normalizeMimeType, l as kindFromMime } from "./mime-1zBUMwu6.mjs";
import { n as resolveGeneratedMediaMaxBytes } from "./configured-max-bytes-CWCWnxsU.mjs";
import { t as executeProviderOperationWithRetry } from "./operation-retry-Dopl7EnK.mjs";
import { g as waitProviderOperationPollInterval, h as resolveProviderOperationTimeoutMs, i as createProviderOperationTimeoutResolver, l as postJsonRequest, p as resolveProviderHttpRequestConfig, r as createProviderOperationDeadline, s as fetchWithTimeoutGuarded } from "./shared-BLFkM12I.mjs";
import { t as isProviderApiKeyConfigured } from "./provider-auth-availability-BdVQKAmB.mjs";
import { a as resolveApiKeyForProvider } from "./provider-auth-runtime-CYwZwijM.mjs";
import "./provider-http-Dn9NddwC.mjs";
import "./provider-auth-eHeoP8se.mjs";
//#region src/video-generation/dashscope-compatible.ts
const DEFAULT_DASHSCOPE_WAN_VIDEO_MODEL = "wan2.6-t2v";
const DASHSCOPE_WAN_VIDEO_MODELS = [
	DEFAULT_DASHSCOPE_WAN_VIDEO_MODEL,
	"wan2.6-i2v",
	"wan2.6-r2v",
	"wan2.6-r2v-flash",
	"wan2.7-r2v"
];
const DASHSCOPE_WAN_VIDEO_RESOLUTIONS = ["720P", "1080P"];
const DASHSCOPE_WAN_VIDEO_ASPECT_RATIOS = [
	"16:9",
	"9:16",
	"1:1",
	"4:3",
	"3:4"
];
const DASHSCOPE_WAN_LONG_VIDEO_DURATIONS = [
	2,
	3,
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
const DASHSCOPE_WAN_SHORT_VIDEO_DURATIONS = [
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
const DASHSCOPE_WAN_VIDEO_SIZE_BY_GEOMETRY = {
	"480P": {
		"16:9": "832*480",
		"9:16": "480*832",
		"1:1": "624*624"
	},
	"720P": {
		"16:9": "1280*720",
		"9:16": "720*1280",
		"1:1": "960*960",
		"4:3": "1088*832",
		"3:4": "832*1088"
	},
	"1080P": {
		"16:9": "1920*1080",
		"9:16": "1080*1920",
		"1:1": "1440*1440",
		"4:3": "1632*1248",
		"3:4": "1248*1632"
	}
};
const DASHSCOPE_WAN_VIDEO_SIZES = DASHSCOPE_WAN_VIDEO_RESOLUTIONS.flatMap((resolution) => Object.values(DASHSCOPE_WAN_VIDEO_SIZE_BY_GEOMETRY[resolution] ?? {}));
const DASHSCOPE_WAN_VIDEO_CAPABILITIES = {
	generate: {
		maxVideos: 1,
		maxDurationSeconds: 15,
		supportedDurationSeconds: DASHSCOPE_WAN_LONG_VIDEO_DURATIONS,
		sizes: DASHSCOPE_WAN_VIDEO_SIZES,
		aspectRatios: DASHSCOPE_WAN_VIDEO_ASPECT_RATIOS,
		resolutions: DASHSCOPE_WAN_VIDEO_RESOLUTIONS,
		supportsSize: true,
		supportsAspectRatio: true,
		supportsResolution: true,
		supportsAudio: true,
		supportsWatermark: true
	},
	imageToVideo: {
		enabled: true,
		maxVideos: 1,
		maxInputImages: 1,
		maxDurationSeconds: 15,
		supportedDurationSeconds: DASHSCOPE_WAN_LONG_VIDEO_DURATIONS,
		resolutions: DASHSCOPE_WAN_VIDEO_RESOLUTIONS,
		supportsSize: false,
		supportsAspectRatio: false,
		supportsResolution: true,
		supportsAudio: true,
		supportsWatermark: true
	},
	videoToVideo: {
		enabled: true,
		maxVideos: 1,
		maxInputImages: 5,
		maxInputVideos: 3,
		maxDurationSeconds: 10,
		supportedDurationSeconds: DASHSCOPE_WAN_SHORT_VIDEO_DURATIONS,
		sizes: DASHSCOPE_WAN_VIDEO_SIZES,
		aspectRatios: DASHSCOPE_WAN_VIDEO_ASPECT_RATIOS,
		resolutions: DASHSCOPE_WAN_VIDEO_RESOLUTIONS,
		supportsSize: true,
		supportsAspectRatio: true,
		supportsResolution: true,
		supportsAudio: true,
		supportsWatermark: true
	}
};
const disabledVideoTransform = { enabled: false };
const dashscopeWanR2vCapabilities = {
	...DASHSCOPE_WAN_VIDEO_CAPABILITIES,
	imageToVideo: {
		...DASHSCOPE_WAN_VIDEO_CAPABILITIES.videoToVideo,
		enabled: true
	}
};
const DASHSCOPE_WAN_VIDEO_CATALOG_BY_MODEL = {
	"wan2.6-t2v": {
		modes: ["generate"],
		capabilities: {
			generate: DASHSCOPE_WAN_VIDEO_CAPABILITIES.generate,
			imageToVideo: disabledVideoTransform,
			videoToVideo: disabledVideoTransform
		}
	},
	"wan2.6-i2v": {
		modes: ["imageToVideo"],
		capabilities: {
			imageToVideo: DASHSCOPE_WAN_VIDEO_CAPABILITIES.imageToVideo,
			videoToVideo: disabledVideoTransform
		}
	},
	"wan2.6-r2v": {
		modes: ["imageToVideo", "videoToVideo"],
		capabilities: dashscopeWanR2vCapabilities
	},
	"wan2.6-r2v-flash": {
		modes: ["imageToVideo", "videoToVideo"],
		capabilities: dashscopeWanR2vCapabilities
	},
	"wan2.7-r2v": {
		modes: ["imageToVideo", "videoToVideo"],
		capabilities: {
			...dashscopeWanR2vCapabilities,
			imageToVideo: {
				...dashscopeWanR2vCapabilities.imageToVideo,
				supportsAspectRatio: true,
				supportsAudio: false
			},
			videoToVideo: {
				...dashscopeWanR2vCapabilities.videoToVideo,
				supportsAspectRatio: true,
				supportsAudio: false
			}
		}
	}
};
const DEFAULT_VIDEO_GENERATION_DURATION_SECONDS = 5;
const DEFAULT_VIDEO_GENERATION_TIMEOUT_MS = 12e4;
const DEFAULT_VIDEO_RESOLUTION_TO_SIZE = {
	"480P": "832*480",
	"720P": "1280*720",
	"1080P": "1920*1080"
};
const DEFAULT_VIDEO_GENERATION_POLL_INTERVAL_MS = 2500;
const DEFAULT_VIDEO_GENERATION_MAX_POLL_ATTEMPTS = 120;
function resolveDashscopeWanVideoMode(req) {
	const model = req.model.trim().toLowerCase();
	if (model.includes("-i2v")) return "i2v";
	if (model.includes("-r2v")) return "r2v";
	if (model.includes("-t2v")) return "t2v";
	if ((req.inputVideos?.length ?? 0) > 0 || (req.inputImages?.length ?? 0) > 1) return "r2v";
	return (req.inputImages?.length ?? 0) === 1 ? "i2v" : "t2v";
}
function isDashscopeWan27Model(model) {
	return model.trim().toLowerCase().startsWith("wan2.7");
}
function assertDashscopeWanVideoInputs(params) {
	const imageCount = params.req.inputImages?.length ?? 0;
	const videoCount = params.req.inputVideos?.length ?? 0;
	if (params.mode === "t2v" && imageCount + videoCount > 0) throw new Error(`${params.providerLabel} model ${params.req.model} is text-to-video and does not accept reference media; use an i2v or r2v Wan model.`);
	if (params.mode === "i2v" && (imageCount !== 1 || videoCount > 0)) throw new Error(`${params.providerLabel} model ${params.req.model} requires exactly one reference image and no reference videos.`);
	if (params.mode === "r2v") {
		const total = imageCount + videoCount;
		if (total === 0 || total > 5 || videoCount > 3) throw new Error(`${params.providerLabel} model ${params.req.model} requires 1-5 reference images/videos, with at most 3 videos.`);
	}
}
function buildDashscopeVideoGenerationInput(params) {
	if ([...params.req.inputImages ?? [], ...params.req.inputVideos ?? []].some((asset) => !asset.url?.trim())) throw new Error(`${params.providerLabel} video generation currently requires remote http(s) URLs for reference images/videos.`);
	const input = { prompt: params.req.prompt };
	const mode = resolveDashscopeWanVideoMode(params.req);
	assertDashscopeWanVideoInputs({
		...params,
		mode
	});
	const referenceUrls = resolveVideoGenerationReferenceUrls(params.req.inputImages, params.req.inputVideos);
	if (mode === "i2v") input.img_url = referenceUrls[0];
	else if (mode === "r2v" && isDashscopeWan27Model(params.req.model)) input.media = [...(params.req.inputImages ?? []).map((asset) => ({
		type: asset.role?.trim() || "reference_image",
		url: asset.url?.trim() ?? ""
	})), ...(params.req.inputVideos ?? []).map((asset) => ({
		type: asset.role?.trim() || "reference_video",
		url: asset.url?.trim() ?? ""
	}))];
	else if (mode === "r2v") input.reference_urls = referenceUrls;
	return input;
}
function resolveVideoGenerationReferenceUrls(inputImages, inputVideos) {
	return [...inputImages ?? [], ...inputVideos ?? []].map((asset) => asset.url?.trim()).filter((value) => Boolean(value));
}
function buildDashscopeVideoGenerationParameters(req, resolutionToSize = DEFAULT_VIDEO_RESOLUTION_TO_SIZE) {
	const parameters = {};
	const mode = resolveDashscopeWanVideoMode(req);
	const wan27 = isDashscopeWan27Model(req.model);
	const requestedSize = req.size?.trim();
	const sizeGeometry = requestedSize ? resolveDashscopeWanVideoSizeGeometry(requestedSize) : void 0;
	if (wan27 || mode === "i2v") {
		const resolution = req.resolution?.trim() || sizeGeometry?.resolution;
		if (resolution) parameters.resolution = resolution;
		if (wan27 && mode !== "i2v") {
			const ratio = req.aspectRatio?.trim() || sizeGeometry?.aspectRatio;
			if (ratio) parameters.ratio = ratio;
		}
	} else {
		const ratio = req.aspectRatio?.trim() || "16:9";
		const size = requestedSize || (req.resolution ? DASHSCOPE_WAN_VIDEO_SIZE_BY_GEOMETRY[req.resolution]?.[ratio] ?? resolutionToSize[req.resolution] : void 0);
		if (size) parameters.size = size;
	}
	if (typeof req.durationSeconds === "number" && Number.isFinite(req.durationSeconds)) parameters.duration = Math.max(1, Math.round(req.durationSeconds));
	if (typeof req.audio === "boolean" && !wan27) parameters.audio = req.audio;
	if (typeof req.watermark === "boolean") parameters.watermark = req.watermark;
	return Object.keys(parameters).length > 0 ? parameters : void 0;
}
function resolveDashscopeWanVideoSizeGeometry(size) {
	const normalizedSize = size.trim().toLowerCase().replace("x", "*");
	for (const [resolution, sizes] of Object.entries(DASHSCOPE_WAN_VIDEO_SIZE_BY_GEOMETRY)) for (const [aspectRatio, candidate] of Object.entries(sizes)) if (candidate.toLowerCase() === normalizedSize) return {
		resolution,
		aspectRatio
	};
}
function extractDashscopeVideoUrls(payload) {
	const urls = [...payload.output?.results?.map((entry) => entry.video_url).filter(Boolean) ?? [], payload.output?.video_url].filter((value) => typeof value === "string" && value.trim().length > 0);
	return uniqueStrings(urls);
}
function createDashscopeBodyReadOptions(params) {
	return {
		timeoutMs: params.timeoutMs,
		onTimeout: ({ timeoutMs }) => /* @__PURE__ */ new Error(`${params.label} timed out after ${params.totalTimeoutMs ?? timeoutMs}ms`)
	};
}
async function fetchDashscopeGuardedResponse(params) {
	const retryController = new AbortController();
	const initialTimeoutMs = params.bodyReadOptions.timeoutMs();
	const { signal, cleanup } = buildTimeoutAbortSignal({
		timeoutMs: initialTimeoutMs,
		signal: retryController.signal,
		operation: `${params.providerLabel} ${params.stage}`,
		url: params.url
	});
	let nextTimeoutMs = initialTimeoutMs;
	try {
		return await executeProviderOperationWithRetry({
			provider: params.providerLabel,
			stage: params.stage,
			signal,
			operation: async () => {
				let timeoutMs;
				try {
					timeoutMs = nextTimeoutMs ?? params.bodyReadOptions.timeoutMs();
					nextTimeoutMs = void 0;
				} catch (error) {
					retryController.abort(error);
					throw error;
				}
				const guarded = await fetchWithTimeoutGuarded(params.url, {
					method: "GET",
					...params.headers ? { headers: params.headers } : {}
				}, timeoutMs, params.fetchFn, {
					...params.allowPrivateNetwork ? { ssrfPolicy: { allowPrivateNetwork: true } } : {},
					...params.dispatcherPolicy ? { dispatcherPolicy: params.dispatcherPolicy } : {}
				});
				try {
					await assertOkOrThrowHttpError(guarded.response, params.failureLabel, {
						bodyTimeoutMs: params.bodyReadOptions.timeoutMs,
						onBodyTimeout: (timeout) => {
							const error = params.bodyReadOptions.onTimeout(timeout);
							retryController.abort(error);
							return error;
						}
					});
					return guarded;
				} catch (error) {
					await guarded.release();
					throw error;
				}
			}
		});
	} catch (error) {
		if (signal?.aborted && !retryController.signal.aborted) throw params.bodyReadOptions.onTimeout({ timeoutMs: initialTimeoutMs });
		throw error;
	} finally {
		cleanup();
	}
}
async function pollDashscopeVideoTaskUntilComplete(params) {
	const defaultTimeoutMs = params.defaultTimeoutMs ?? 12e4;
	const deadline = params.deadline ?? createProviderOperationDeadline({
		timeoutMs: params.timeoutMs ?? defaultTimeoutMs,
		label: `${params.providerLabel} video generation task ${params.taskId}`
	});
	const bodyReadOptions = createDashscopeBodyReadOptions({
		label: deadline.label,
		timeoutMs: createProviderOperationTimeoutResolver({
			deadline,
			defaultTimeoutMs
		}),
		totalTimeoutMs: deadline.timeoutMs
	});
	for (let attempt = 0; attempt < DEFAULT_VIDEO_GENERATION_MAX_POLL_ATTEMPTS; attempt += 1) {
		const pollResult = await fetchDashscopeGuardedResponse({
			providerLabel: params.providerLabel,
			stage: "poll",
			url: `${params.baseUrl}/api/v1/tasks/${params.taskId}`,
			headers: params.headers,
			bodyReadOptions,
			failureLabel: `${params.providerLabel} video-generation task poll failed`,
			fetchFn: params.fetchFn,
			allowPrivateNetwork: params.allowPrivateNetwork,
			dispatcherPolicy: params.dispatcherPolicy
		});
		let payload;
		try {
			payload = await readProviderJsonResponse(pollResult.response, `${params.providerLabel} video-generation task poll`, bodyReadOptions);
		} finally {
			await pollResult.release();
		}
		const status = payload.output?.task_status?.trim().toUpperCase();
		if (status === "SUCCEEDED") return payload;
		if (status === "UNKNOWN") {
			const reason = payload.output?.message?.trim() || payload.message?.trim();
			throw new Error(`${params.providerLabel} video generation task ${params.taskId} is unknown or expired${reason ? `: ${reason}` : ""}`);
		}
		if (status === "FAILED" || status === "CANCELED") throw new Error(payload.output?.message?.trim() || payload.message?.trim() || `${params.providerLabel} video generation task ${params.taskId} ${normalizeLowercaseStringOrEmpty(status)}`);
		await waitProviderOperationPollInterval({
			deadline,
			pollIntervalMs: DEFAULT_VIDEO_GENERATION_POLL_INTERVAL_MS
		});
	}
	throw new Error(`${params.providerLabel} video generation task ${params.taskId} did not finish in time`);
}
async function runDashscopeVideoGenerationTask(params) {
	const defaultTimeoutMs = params.defaultTimeoutMs ?? 12e4;
	const deadline = createProviderOperationDeadline({
		timeoutMs: params.timeoutMs ?? defaultTimeoutMs,
		label: `${params.providerLabel} video generation`
	});
	const bodyReadOptions = createDashscopeBodyReadOptions({
		label: deadline.label,
		timeoutMs: createProviderOperationTimeoutResolver({
			deadline,
			defaultTimeoutMs
		}),
		totalTimeoutMs: deadline.timeoutMs
	});
	const { response, release } = await postJsonRequest({
		url: params.url,
		headers: params.headers,
		body: {
			model: params.model,
			input: buildDashscopeVideoGenerationInput({
				providerLabel: params.providerLabel,
				req: params.req
			}),
			parameters: buildDashscopeVideoGenerationParameters({
				...params.req,
				durationSeconds: params.req.durationSeconds ?? 5
			}, DEFAULT_VIDEO_RESOLUTION_TO_SIZE)
		},
		timeoutMs: resolveProviderOperationTimeoutMs({
			deadline,
			defaultTimeoutMs
		}),
		fetchFn: params.fetchFn,
		allowPrivateNetwork: params.allowPrivateNetwork,
		dispatcherPolicy: params.dispatcherPolicy
	});
	let submitted;
	try {
		await assertOkOrThrowHttpError(response, `${params.providerLabel} video generation failed`, {
			bodyTimeoutMs: bodyReadOptions.timeoutMs,
			onBodyTimeout: bodyReadOptions.onTimeout
		});
		submitted = await readProviderJsonResponse(response, `${params.providerLabel} video generation`, bodyReadOptions);
	} finally {
		await release();
	}
	const taskId = submitted.output?.task_id?.trim();
	if (!taskId) throw new Error(`${params.providerLabel} video generation response missing task_id`);
	const completed = await pollDashscopeVideoTaskUntilComplete({
		providerLabel: params.providerLabel,
		taskId,
		deadline,
		headers: params.headers,
		fetchFn: params.fetchFn,
		baseUrl: params.baseUrl,
		allowPrivateNetwork: params.allowPrivateNetwork,
		dispatcherPolicy: params.dispatcherPolicy,
		defaultTimeoutMs
	});
	const urls = extractDashscopeVideoUrls(completed);
	if (urls.length === 0) throw new Error(`${params.providerLabel} video generation completed without output video URLs`);
	return {
		videos: await downloadDashscopeGeneratedVideos({
			providerLabel: params.providerLabel,
			urls,
			deadline,
			fetchFn: params.fetchFn,
			allowPrivateNetwork: params.allowPrivateNetwork,
			dispatcherPolicy: params.dispatcherPolicy,
			defaultTimeoutMs,
			maxBytes: resolveGeneratedMediaMaxBytes(params.req.cfg, "video")
		}),
		model: params.model,
		metadata: {
			requestId: submitted.request_id,
			taskId,
			taskStatus: completed.output?.task_status
		}
	};
}
function resolveDashscopeVideoDownloadTimeoutMs(providerLabel, timeoutMs, defaultTimeoutMs) {
	const resolved = typeof timeoutMs === "function" ? timeoutMs() : timeoutMs;
	const downloadTimeoutMs = typeof resolved === "number" && Number.isFinite(resolved) ? Math.max(0, Math.floor(resolved)) : defaultTimeoutMs ?? 12e4;
	if (downloadTimeoutMs <= 0) throw new Error(`${providerLabel} generated video download stalled: remaining budget exhausted`);
	return downloadTimeoutMs;
}
async function downloadDashscopeGeneratedVideos(params) {
	if (params.urls.length === 0) return [];
	const defaultTimeoutMs = params.defaultTimeoutMs ?? 12e4;
	const downloadLabel = `${params.providerLabel} generated video download`;
	let deadline = params.deadline;
	const resolveTimeoutMs = () => {
		const timeoutMs = resolveDashscopeVideoDownloadTimeoutMs(params.providerLabel, params.timeoutMs, defaultTimeoutMs);
		deadline ??= createProviderOperationDeadline({
			timeoutMs,
			label: downloadLabel
		});
		return resolveProviderOperationTimeoutMs({
			deadline,
			defaultTimeoutMs: timeoutMs
		});
	};
	const bodyReadOptions = createDashscopeBodyReadOptions({
		label: downloadLabel,
		timeoutMs: resolveTimeoutMs,
		totalTimeoutMs: deadline?.timeoutMs
	});
	const videos = [];
	for (const [index, url] of params.urls.entries()) {
		const result = await fetchDashscopeGuardedResponse({
			providerLabel: params.providerLabel,
			stage: "download",
			url,
			bodyReadOptions,
			failureLabel: `${params.providerLabel} generated video download failed`,
			fetchFn: params.fetchFn,
			allowPrivateNetwork: params.allowPrivateNetwork,
			dispatcherPolicy: params.dispatcherPolicy
		});
		let buffer;
		let mimeType;
		try {
			try {
				const contentType = normalizeMimeType(result.response.headers.get("content-type"));
				if (contentType && contentType !== "application/octet-stream" && kindFromMime(contentType) !== "video") throw new Error(`${downloadLabel}: malformed video response`);
			} catch (error) {
				result.response.body?.cancel(error).catch(() => void 0);
				throw error;
			}
			buffer = await readProviderBinaryResponse(result.response, downloadLabel, "video", {
				...bodyReadOptions,
				maxBytes: params.maxBytes,
				chunkTimeoutMs: defaultTimeoutMs,
				onOverflow: ({ maxBytes }) => /* @__PURE__ */ new Error(`${params.providerLabel} generated video download exceeds ${maxBytes} bytes`)
			});
			mimeType = result.response.headers.get("content-type")?.trim() || "video/mp4";
		} finally {
			await result.release();
		}
		videos.push({
			buffer,
			mimeType,
			fileName: `video-${index + 1}.mp4`,
			metadata: { sourceUrl: url }
		});
	}
	return videos;
}
//#endregion
//#region src/plugin-sdk/video-generation.ts
/** Builds one provider descriptor for the shared DashScope async video task protocol. */
function buildDashscopeVideoGenerationProvider(options) {
	const resolveRequestBaseUrl = options.resolveRequestBaseUrl ?? ((configuredBaseUrl) => configuredBaseUrl?.trim() || options.defaultBaseUrl);
	const resolveAigcBaseUrl = options.resolveAigcBaseUrl ?? ((baseUrl) => baseUrl.replace(/\/+$/u, ""));
	return {
		id: options.providerId,
		label: options.label,
		defaultModel: DEFAULT_DASHSCOPE_WAN_VIDEO_MODEL,
		models: [...DASHSCOPE_WAN_VIDEO_MODELS],
		catalogByModel: DASHSCOPE_WAN_VIDEO_CATALOG_BY_MODEL,
		resolveModelCapabilities: ({ model }) => DASHSCOPE_WAN_VIDEO_CATALOG_BY_MODEL[model]?.capabilities,
		isConfigured: (ctx) => {
			const baseUrl = ctx.cfg?.models?.providers?.[options.providerId]?.baseUrl;
			if (options.credentialPolicy?.acceptsBaseUrl?.(baseUrl) === false) return false;
			return isProviderApiKeyConfigured({
				provider: options.providerId,
				...ctx,
				profileTypes: options.credentialPolicy ? ["api_key"] : void 0,
				acceptsApiKey: options.credentialPolicy?.acceptsApiKey
			});
		},
		capabilities: DASHSCOPE_WAN_VIDEO_CAPABILITIES,
		async generateVideo(req) {
			const providerConfig = req.cfg?.models?.providers?.[options.providerId];
			if (options.credentialPolicy?.acceptsBaseUrl?.(providerConfig?.baseUrl) === false) throw new Error(options.credentialPolicy.unsupportedMessage);
			const auth = await resolveApiKeyForProvider({
				provider: options.providerId,
				cfg: req.cfg,
				agentDir: req.agentDir,
				store: req.authStore
			});
			if (!auth.apiKey) throw new Error(`${options.apiKeyLabel ?? options.label} API key missing`);
			if (options.credentialPolicy?.acceptsApiKey(auth.apiKey) === false) throw new Error(options.credentialPolicy.unsupportedMessage);
			const requestBaseUrl = resolveRequestBaseUrl(providerConfig?.baseUrl);
			const { baseUrl, allowPrivateNetwork, headers, dispatcherPolicy } = resolveProviderHttpRequestConfig({
				baseUrl: requestBaseUrl,
				defaultBaseUrl: options.defaultBaseUrl,
				defaultHeaders: {
					Authorization: `Bearer ${auth.apiKey}`,
					"Content-Type": "application/json",
					"X-DashScope-Async": "enable"
				},
				provider: options.providerId,
				capability: "video",
				transport: "http",
				request: sanitizeConfiguredModelProviderRequest(providerConfig?.request)
			});
			const aigcBaseUrl = resolveAigcBaseUrl(baseUrl);
			return await runDashscopeVideoGenerationTask({
				providerLabel: options.taskLabel,
				model: req.model?.trim() || "wan2.6-t2v",
				req,
				url: `${aigcBaseUrl}/api/v1/services/aigc/video-generation/video-synthesis`,
				headers,
				baseUrl: aigcBaseUrl,
				timeoutMs: req.timeoutMs,
				fetchFn: fetch,
				allowPrivateNetwork,
				dispatcherPolicy,
				defaultTimeoutMs: DEFAULT_VIDEO_GENERATION_TIMEOUT_MS
			});
		}
	};
}
//#endregion
export { DEFAULT_VIDEO_GENERATION_DURATION_SECONDS as a, buildDashscopeVideoGenerationInput as c, extractDashscopeVideoUrls as d, pollDashscopeVideoTaskUntilComplete as f, DEFAULT_DASHSCOPE_WAN_VIDEO_MODEL as i, buildDashscopeVideoGenerationParameters as l, runDashscopeVideoGenerationTask as m, DASHSCOPE_WAN_VIDEO_CAPABILITIES as n, DEFAULT_VIDEO_GENERATION_TIMEOUT_MS as o, resolveVideoGenerationReferenceUrls as p, DASHSCOPE_WAN_VIDEO_MODELS as r, DEFAULT_VIDEO_RESOLUTION_TO_SIZE as s, buildDashscopeVideoGenerationProvider as t, downloadDashscopeGeneratedVideos as u };
