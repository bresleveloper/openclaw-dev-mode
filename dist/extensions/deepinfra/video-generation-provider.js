import { DEEPINFRA_BASE_URL, DEEPINFRA_VIDEO_ASPECT_RATIOS, DEEPINFRA_VIDEO_DURATIONS, DEEPINFRA_VIDEO_FALLBACK_MODELS, normalizeDeepInfraBaseUrl, normalizeDeepInfraModelRef } from "./media-models.js";
import { resolveDeepInfraVideoModelCapabilities } from "./surface-model-catalogs.js";
import { asSafeIntegerInRange, normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
import { isProviderApiKeyConfigured } from "openclaw/plugin-sdk/provider-auth";
import { resolveGeneratedMediaMaxBytes } from "openclaw/plugin-sdk/media-generation-runtime";
import { detectMime, extensionForMime, mediaKindFromMime, normalizeMimeType } from "openclaw/plugin-sdk/media-mime";
import { canonicalizeBase64, estimateBase64DecodedBytes } from "openclaw/plugin-sdk/media-runtime";
import { resolveApiKeyForProvider } from "openclaw/plugin-sdk/provider-auth-runtime";
import { assertOkOrThrowHttpError, createProviderOperationDeadline, pollProviderOperationJson, postJsonRequest, readProviderJsonResponse, resolveProviderHttpRequestConfig, resolveProviderOperationTimeoutMs, sanitizeConfiguredModelProviderRequest } from "openclaw/plugin-sdk/provider-http";
//#region extensions/deepinfra/video-generation-provider.ts
const DEFAULT_HTTP_TIMEOUT_MS = 6e4;
const POLL_INTERVAL_MS = 5e3;
const MAX_POLL_ATTEMPTS = 120;
function normalizeDeepInfraVideoUrl(url, baseUrl) {
	if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("data:")) return url;
	return new URL(url, baseUrl).href;
}
async function parseVideoDataUrl(url, maxBytes) {
	if (!url.startsWith("data:")) return;
	const match = /^data:([^;,]+);base64,(.*)$/su.exec(url);
	if (!match) throw new Error("DeepInfra video response: malformed video response");
	const mimeType = normalizeMimeType(match[1]);
	if (!mimeType || mediaKindFromMime(mimeType) !== "video" && mimeType !== "application/octet-stream") throw new Error("DeepInfra video response: malformed video response");
	const base64 = match[2] ?? "";
	if (!base64) throw new Error("DeepInfra video response: malformed video response");
	if (estimateBase64DecodedBytes(base64) > maxBytes) throw new Error(`DeepInfra generated video exceeds ${maxBytes} bytes`);
	const canonicalBase64 = canonicalizeBase64(base64);
	if (!canonicalBase64) throw new Error("DeepInfra video response returned malformed data URL base64");
	const buffer = Buffer.from(canonicalBase64, "base64");
	const detectedMime = await detectMime({ buffer });
	if (!detectedMime || mediaKindFromMime(detectedMime) !== "video") throw new Error("DeepInfra video response: malformed video response");
	return {
		buffer,
		mimeType: detectedMime,
		fileName: `video-1.${extensionForMime(detectedMime)?.slice(1) ?? "mp4"}`
	};
}
function resolveDurationSeconds(value) {
	if (typeof value !== "number" || !Number.isFinite(value)) return;
	return value <= 6.5 ? 5 : 8;
}
function resolveSeed(value) {
	return asSafeIntegerInRange(value, {
		min: 0,
		max: 4294967295
	});
}
function buildDeepInfraVideoBody(req, model) {
	const options = req.providerOptions ?? {};
	const body = {
		model,
		prompt: req.prompt
	};
	const aspectRatio = normalizeOptionalString(req.aspectRatio);
	if (aspectRatio) body.aspect_ratio = aspectRatio;
	const duration = resolveDurationSeconds(req.durationSeconds);
	if (duration) body.seconds = duration;
	const seed = resolveSeed(options.seed);
	if (seed != null) body.seed = seed;
	const negativePrompt = normalizeOptionalString(options.negative_prompt) ?? normalizeOptionalString(options.negativePrompt);
	if (negativePrompt) body.negative_prompt = negativePrompt;
	const style = normalizeOptionalString(options.style);
	if (style) body.style = style;
	return body;
}
function firstDeepInfraVideoUrl(job) {
	for (const entry of job.data ?? []) {
		const videoUrl = entry ? normalizeOptionalString(entry.url) : void 0;
		if (videoUrl) return videoUrl;
	}
}
async function extractDeepInfraVideoAsset(job, baseUrl, maxBytes) {
	const videoUrl = firstDeepInfraVideoUrl(job);
	if (!videoUrl) throw new Error("DeepInfra video response missing video URL");
	const normalizedUrl = normalizeDeepInfraVideoUrl(videoUrl, baseUrl);
	const dataAsset = await parseVideoDataUrl(normalizedUrl, maxBytes);
	if (dataAsset) return dataAsset;
	return {
		url: normalizedUrl,
		mimeType: "video/mp4",
		fileName: "video-1.mp4"
	};
}
function resolveDeepInfraVideoBaseUrl(req) {
	const providerConfig = req.cfg?.models?.providers?.deepinfra;
	const baseUrl = normalizeDeepInfraBaseUrl(providerConfig?.baseUrl, DEEPINFRA_BASE_URL);
	if (baseUrl.includes("/v1/inference")) throw new Error("DeepInfra video generation requires an OpenAI-compatible endpoint, but models.providers.deepinfra.baseUrl targets the retired native /v1/inference surface. Run \"openclaw doctor --fix\" (api.deepinfra.com migrates automatically; custom hosts must set baseUrl to an OpenAI-compatible videos endpoint).");
	return baseUrl;
}
function buildDeepInfraVideoGenerationProvider(options) {
	const ids = options?.videoGenModels && options.videoGenModels.length > 0 ? options.videoGenModels.map((model) => model.id) : [...DEEPINFRA_VIDEO_FALLBACK_MODELS];
	const defaultModel = ids[0] ?? DEEPINFRA_VIDEO_FALLBACK_MODELS[0];
	return {
		id: "deepinfra",
		label: "DeepInfra",
		defaultModel,
		models: ids,
		resolveModelCapabilities: resolveDeepInfraVideoModelCapabilities,
		isConfigured: (ctx) => isProviderApiKeyConfigured({
			provider: "deepinfra",
			...ctx
		}),
		capabilities: {
			generate: {
				maxVideos: 1,
				maxDurationSeconds: 8,
				supportedDurationSeconds: [...DEEPINFRA_VIDEO_DURATIONS],
				supportsAspectRatio: true,
				aspectRatios: [...DEEPINFRA_VIDEO_ASPECT_RATIOS],
				providerOptions: {
					seed: "number",
					negative_prompt: "string",
					negativePrompt: "string",
					style: "string"
				}
			},
			imageToVideo: { enabled: false },
			videoToVideo: { enabled: false }
		},
		async generateVideo(req) {
			if ((req.inputImages?.length ?? 0) > 0) throw new Error("DeepInfra video generation currently supports text-to-video only.");
			if ((req.inputVideos?.length ?? 0) > 0) throw new Error("DeepInfra video generation does not support video reference inputs.");
			const auth = await resolveApiKeyForProvider({
				provider: "deepinfra",
				cfg: req.cfg,
				agentDir: req.agentDir,
				store: req.authStore
			});
			if (!auth.apiKey) throw new Error("DeepInfra API key missing");
			const model = normalizeDeepInfraModelRef(req.model, defaultModel);
			const deadline = createProviderOperationDeadline({
				timeoutMs: req.timeoutMs,
				label: "DeepInfra video generation"
			});
			const { baseUrl, allowPrivateNetwork, headers, dispatcherPolicy } = resolveProviderHttpRequestConfig({
				baseUrl: resolveDeepInfraVideoBaseUrl(req),
				defaultBaseUrl: DEEPINFRA_BASE_URL,
				defaultHeaders: {
					Authorization: `Bearer ${auth.apiKey}`,
					"Content-Type": "application/json"
				},
				provider: "deepinfra",
				capability: "video",
				transport: "http",
				request: sanitizeConfiguredModelProviderRequest(req.cfg?.models?.providers?.deepinfra?.request)
			});
			const { response, release } = await postJsonRequest({
				url: `${baseUrl}/videos`,
				headers,
				body: buildDeepInfraVideoBody(req, model),
				timeoutMs: resolveProviderOperationTimeoutMs({
					deadline,
					defaultTimeoutMs: DEFAULT_HTTP_TIMEOUT_MS
				}),
				fetchFn: fetch,
				allowPrivateNetwork,
				dispatcherPolicy
			});
			let submitted;
			try {
				await assertOkOrThrowHttpError(response, "DeepInfra video generation failed");
				submitted = await readProviderJsonResponse(response, "DeepInfra video generation failed");
			} finally {
				await release();
			}
			const jobId = normalizeOptionalString(submitted.id);
			if (!jobId) throw new Error("DeepInfra video generation response missing job id");
			if (submitted.status === "failed") throw new Error(normalizeOptionalString(submitted.error) ?? "DeepInfra video generation failed");
			const completed = submitted.status === "succeeded" ? submitted : await pollProviderOperationJson({
				url: `${baseUrl}/videos/${encodeURIComponent(jobId)}`,
				headers,
				deadline,
				defaultTimeoutMs: DEFAULT_HTTP_TIMEOUT_MS,
				fetchFn: fetch,
				maxAttempts: MAX_POLL_ATTEMPTS,
				pollIntervalMs: POLL_INTERVAL_MS,
				requestFailedMessage: "DeepInfra video status request failed",
				timeoutMessage: `DeepInfra video generation job ${jobId} did not finish in time`,
				allowPrivateNetwork,
				dispatcherPolicy,
				auditContext: "deepinfra-video-status",
				isComplete: (payload) => payload.status === "succeeded",
				getFailureMessage: (payload) => payload.status === "failed" ? normalizeOptionalString(payload.error) ?? "DeepInfra video generation failed" : void 0
			});
			return {
				videos: [await extractDeepInfraVideoAsset(completed, baseUrl, resolveGeneratedMediaMaxBytes(req.cfg, "video"))],
				model: normalizeOptionalString(completed.model) ?? model,
				metadata: {
					jobId,
					status: completed.status
				}
			};
		}
	};
}
//#endregion
export { buildDeepInfraVideoGenerationProvider };
