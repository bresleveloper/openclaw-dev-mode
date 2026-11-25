import { DEEPINFRA_BASE_URL, DEEPINFRA_VIDEO_FALLBACK_MODELS, normalizeDeepInfraBaseUrl, normalizeDeepInfraModelRef } from "./media-models.js";
import { buildDeepInfraVideoModelCapabilities } from "./surface-model-catalogs.js";
import { asSafeIntegerInRange, normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
import { isProviderApiKeyConfiguredAsync } from "openclaw/plugin-sdk/provider-auth";
import { resolveGeneratedMediaMaxBytes } from "openclaw/plugin-sdk/media-generation-runtime";
import { detectMime, extensionForMime, mediaKindFromMime, normalizeMimeType } from "openclaw/plugin-sdk/media-mime";
import { canonicalizeBase64, estimateBase64DecodedBytes } from "openclaw/plugin-sdk/media-runtime";
import { createProviderOperationDeadline, pollProviderOperationJson, postJsonResponse, resolveProviderApiKeyHttpRequestConfig, resolveProviderOperationTimeoutMs, sanitizeConfiguredModelProviderRequest } from "openclaw/plugin-sdk/provider-http";
// extensions/deepinfra/video-generation-provider.ts
const DEFAULT_HTTP_TIMEOUT_MS = 6e4;
const POLL_INTERVAL_MS = 5e3;
const MAX_POLL_ATTEMPTS = 120;
function isDeepInfraVideoJobComplete(payload) {
	if (payload.status === "failed") throw new Error(normalizeOptionalString(payload.error) ?? "DeepInfra video generation failed");
	return payload.status === "succeeded";
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
function buildDeepInfraVideoGenerationProvider(options) {
	const ids = options?.videoGenModels && options.videoGenModels.length > 0 ? options.videoGenModels.map((model) => model.id) : [...DEEPINFRA_VIDEO_FALLBACK_MODELS];
	const defaultModel = ids[0] ?? DEEPINFRA_VIDEO_FALLBACK_MODELS[0];
	const { providerOptions, ...capabilities } = buildDeepInfraVideoModelCapabilities();
	return {
		id: "deepinfra",
		label: "DeepInfra",
		defaultModel,
		models: ids,
		isConfiguredAsync: (ctx) => isProviderApiKeyConfiguredAsync({
			provider: "deepinfra",
			...ctx
		}),
		capabilities: {
			...capabilities,
			generate: {
				...capabilities.generate,
				providerOptions
			}
		},
		async generateVideo(req) {
			if ((req.inputImages?.length ?? 0) > 0) throw new Error("DeepInfra video generation currently supports text-to-video only.");
			if ((req.inputVideos?.length ?? 0) > 0) throw new Error("DeepInfra video generation does not support video reference inputs.");
			const model = normalizeDeepInfraModelRef(req.model, defaultModel);
			const providerConfig = req.cfg?.models?.providers?.deepinfra;
			const configuredBaseUrl = normalizeDeepInfraBaseUrl(providerConfig?.baseUrl, DEEPINFRA_BASE_URL);
			if (configuredBaseUrl.includes("/v1/inference")) throw new Error("DeepInfra video generation requires an OpenAI-compatible endpoint, but models.providers.deepinfra.baseUrl targets the retired native /v1/inference surface. Run \"openclaw doctor --fix\" (api.deepinfra.com migrates automatically; custom hosts must set baseUrl to an OpenAI-compatible videos endpoint).");
			const { baseUrl, allowPrivateNetwork, headers, dispatcherPolicy } = await resolveProviderApiKeyHttpRequestConfig({
				req,
				missingApiKeyMessage: "DeepInfra API key missing",
				baseUrl: configuredBaseUrl,
				defaultBaseUrl: DEEPINFRA_BASE_URL,
				provider: "deepinfra",
				capability: "video",
				request: sanitizeConfiguredModelProviderRequest(req.cfg?.models?.providers?.deepinfra?.request)
			});
			const deadline = createProviderOperationDeadline({
				timeoutMs: req.timeoutMs,
				label: "DeepInfra video generation"
			});
			const bodyOptions = req.providerOptions ?? {};
			const body = {
				model,
				prompt: req.prompt
			};
			const aspectRatio = normalizeOptionalString(req.aspectRatio);
			if (aspectRatio) body.aspect_ratio = aspectRatio;
			const duration = req.durationSeconds;
			if (typeof duration === "number" && Number.isFinite(duration)) body.seconds = duration <= 6.5 ? 5 : 8;
			const seed = asSafeIntegerInRange(bodyOptions.seed, {
				min: 0,
				max: 4294967295
			});
			if (seed != null) body.seed = seed;
			const negativePrompt = normalizeOptionalString(bodyOptions.negative_prompt) ?? normalizeOptionalString(bodyOptions.negativePrompt);
			if (negativePrompt) body.negative_prompt = negativePrompt;
			const style = normalizeOptionalString(bodyOptions.style);
			if (style) body.style = style;
			const submitted = await postJsonResponse({
				url: `${baseUrl}/videos`,
				headers,
				body,
				timeoutMs: resolveProviderOperationTimeoutMs({
					deadline,
					defaultTimeoutMs: DEFAULT_HTTP_TIMEOUT_MS
				}),
				fetchFn: fetch,
				allowPrivateNetwork,
				dispatcherPolicy,
				errorLabel: "DeepInfra video generation failed"
			});
			const jobId = normalizeOptionalString(submitted.id);
			if (!jobId) throw new Error("DeepInfra video generation response missing job id");
			const completed = isDeepInfraVideoJobComplete(submitted) ? submitted : await pollProviderOperationJson({
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
				isComplete: isDeepInfraVideoJobComplete
			});
			let videoUrl;
			for (const entry of completed.data ?? []) {
				videoUrl = entry ? normalizeOptionalString(entry.url) : void 0;
				if (videoUrl) break;
			}
			if (!videoUrl) throw new Error("DeepInfra video response missing video URL");
			const normalizedUrl = videoUrl.startsWith("http://") || videoUrl.startsWith("https://") || videoUrl.startsWith("data:") ? videoUrl : new URL(videoUrl, baseUrl).href;
			return {
				videos: [await parseVideoDataUrl(normalizedUrl, resolveGeneratedMediaMaxBytes(req.cfg, "video")) ?? {
					url: normalizedUrl,
					mimeType: "video/mp4",
					fileName: "video-1.mp4"
				}],
				model: normalizeOptionalString(completed.model) ?? model,
				metadata: {
					jobId,
					status: completed.status
				}
			};
		}
	};
}
export { buildDeepInfraVideoGenerationProvider };
