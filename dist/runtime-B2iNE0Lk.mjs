import { t as createSubsystemLogger } from "./subsystem-I-uqdx4f.mjs";
import { c as resolveAgentModelTimeoutMsValue } from "./model-input-C9K4a_6k.mjs";
import "./provider-env-vars-C_lyIdYO.mjs";
import { t as createMediaProviderLookup } from "./provider-registry-BoMdoLRw.mjs";
import { l as withVideoGenerationProviders, o as listVideoGenerationProviders, r as getVideoGenerationProvider } from "./registry-B1Y9Uoiz.mjs";
import { c as resolveMediaProviderRequestTimeoutMs, i as resolveCapabilityModelCandidates, n as buildNoCapabilityModelConfiguredMessage, t as buildMediaGenerationNormalizationMetadata, u as runMediaGenerationCandidates } from "./runtime-shared-26hQf7I9.mjs";
import { t as parseGenerationModelRef } from "./model-ref-BPLi1CUl.mjs";
import { t as resolveMediaGeometryOverrides } from "./geometry-normalization-xsUxOM1J.mjs";
import { a as resolveVideoGenerationModeCapabilities, n as resolveVideoGenerationSupportedDurations, t as normalizeVideoGenerationDuration } from "./duration-support-BfgJ7oBc.mjs";
//#region src/video-generation/capability-overlays.ts
function buildVideoGenerationCapabilityFailure(params) {
	const { providerId, model, provider, inputImageCount, inputVideoCount, inputAudioCount } = params;
	const label = `${providerId}/${model}`;
	const { mode, capabilities } = resolveVideoGenerationModeCapabilities({
		provider,
		model,
		inputImageCount,
		inputVideoCount
	});
	const catalogModes = provider.catalogByModel?.[model]?.modes;
	if (mode && catalogModes && !catalogModes.includes(mode)) return `${label} does not support ${mode === "generate" ? "text-to-video generation" : mode === "imageToVideo" ? "image-to-video generation" : "video-to-video generation"}; skipping`;
	if (inputImageCount > 0 || inputVideoCount > 0) {
		const visualLabel = inputImageCount > 0 && inputVideoCount > 0 ? "combined image/video reference inputs" : inputImageCount > 0 ? "reference image inputs" : "reference video inputs";
		if (!capabilities || !("enabled" in capabilities) || !capabilities.enabled) return `${label} does not support ${visualLabel}; skipping to avoid silent reference drop`;
	}
	for (const [kind, count, limitKey] of [
		[
			"image",
			inputImageCount,
			"maxInputImages"
		],
		[
			"video",
			inputVideoCount,
			"maxInputVideos"
		],
		[
			"audio",
			inputAudioCount,
			"maxInputAudios"
		]
	]) {
		const limit = capabilities?.[limitKey] ?? provider.capabilities[limitKey] ?? 0;
		if (count > 0 && count > limit) return limit === 0 ? `${label} does not support reference ${kind} inputs; skipping to avoid silent ${kind} drop` : `${label} supports at most ${limit} reference ${kind}(s), ${count} requested; skipping`;
	}
}
function mergeVideoGenerationCapabilities(base, overlay) {
	const overlayOptions = overlay.providerOptions;
	const mergedProviderOptions = Object.hasOwn(overlay, "providerOptions") && overlayOptions && Object.keys(overlayOptions).length === 0 ? overlayOptions : base.providerOptions || overlayOptions ? {
		...base.providerOptions,
		...overlayOptions
	} : void 0;
	return {
		...base,
		...overlay,
		...mergedProviderOptions ? { providerOptions: mergedProviderOptions } : {}
	};
}
function mergeVideoGenerationModeCapabilities(base, overlay) {
	if (!overlay) return base;
	if (!base) return overlay;
	return mergeVideoGenerationCapabilities(base, overlay);
}
function mergeVideoGenerationProviderCapabilities(base, overlay) {
	return {
		...mergeVideoGenerationCapabilities(base, overlay),
		generate: mergeVideoGenerationModeCapabilities(base.generate, overlay.generate),
		imageToVideo: mergeVideoGenerationModeCapabilities(base.imageToVideo, overlay.imageToVideo),
		videoToVideo: mergeVideoGenerationModeCapabilities(base.videoToVideo, overlay.videoToVideo)
	};
}
async function resolveProviderWithModelCapabilities(params) {
	if (!params.provider.resolveModelCapabilities) return params.provider;
	try {
		const modelCapabilities = await params.provider.resolveModelCapabilities({
			provider: params.providerId,
			model: params.model,
			cfg: params.cfg,
			agentDir: params.agentDir,
			authStore: params.authStore,
			...params.timeoutMs !== void 0 ? { timeoutMs: params.timeoutMs } : {}
		});
		if (!modelCapabilities) return params.provider;
		return {
			...params.provider,
			capabilities: mergeVideoGenerationProviderCapabilities(params.provider.capabilities, modelCapabilities)
		};
	} catch (err) {
		params.log.debug(`video-generation model capability lookup failed for ${params.providerId}/${params.model}: ${err instanceof Error ? err.message : String(err)}`);
		return params.provider;
	}
}
//#endregion
//#region src/video-generation/normalization.ts
const VIDEO_RESOLUTION_ORDER = [
	"360P",
	"480P",
	"540P",
	"720P",
	"768P",
	"1080P"
];
function resolveVideoGenerationOverrides(params) {
	const { capabilities: caps } = resolveVideoGenerationModeCapabilities({
		provider: params.provider,
		model: params.model,
		inputImageCount: params.inputImageCount,
		inputVideoCount: params.inputVideoCount
	});
	const sanitized = resolveMediaGeometryOverrides({
		size: params.size,
		aspectRatio: params.aspectRatio,
		resolution: params.resolution,
		capabilities: caps,
		resolutionOrder: VIDEO_RESOLUTION_ORDER,
		reportUnrecognizedOverrides: true,
		useAspectRatioForRequestedSize: true
	});
	const ignoredOverrides = sanitized.ignoredOverrides;
	const normalization = sanitized.normalization;
	let { audio, watermark } = params;
	if (caps && typeof audio === "boolean" && !caps.supportsAudio) {
		ignoredOverrides.push({
			key: "audio",
			value: audio
		});
		audio = void 0;
	}
	if (caps && typeof watermark === "boolean" && !caps.supportsWatermark) {
		ignoredOverrides.push({
			key: "watermark",
			value: watermark
		});
		watermark = void 0;
	}
	const requestedDurationSeconds = typeof params.durationSeconds === "number" && Number.isFinite(params.durationSeconds) ? Math.max(1, Math.round(params.durationSeconds)) : void 0;
	const durationSeconds = normalizeVideoGenerationDuration({
		provider: params.provider,
		model: params.model,
		durationSeconds: requestedDurationSeconds,
		inputImageCount: params.inputImageCount ?? 0,
		inputVideoCount: params.inputVideoCount ?? 0
	});
	const supportedDurationSeconds = resolveVideoGenerationSupportedDurations({
		provider: params.provider,
		model: params.model,
		inputImageCount: params.inputImageCount ?? 0,
		inputVideoCount: params.inputVideoCount ?? 0
	});
	if (typeof requestedDurationSeconds === "number" && typeof durationSeconds === "number" && requestedDurationSeconds !== durationSeconds) normalization.durationSeconds = {
		requested: requestedDurationSeconds,
		applied: durationSeconds,
		...supportedDurationSeconds?.length ? { supportedValues: supportedDurationSeconds } : {}
	};
	return {
		size: sanitized.size,
		aspectRatio: sanitized.aspectRatio,
		resolution: sanitized.resolution,
		durationSeconds,
		supportedDurationSeconds,
		audio,
		watermark,
		ignoredOverrides,
		normalization: Object.keys(normalization).length ? normalization : void 0
	};
}
//#endregion
//#region src/video-generation/runtime.ts
const log = createSubsystemLogger("video-generation");
const MODEL_CAPABILITY_LOOKUP_TIMEOUT_MS = 5e3;
const SUPPORTED_DURATIONS_HINT = Symbol.for("openclaw.videoGeneration.supportedDurations");
/**
* Missing declarations preserve legacy providerOptions passthrough; an empty
* declaration rejects options. Declared keys require their specified types.
*/
function validateProviderOptionsAgainstDeclaration(params) {
	const { providerId, model, providerOptions, declaration } = params;
	const keys = Object.keys(providerOptions);
	if (keys.length === 0) return;
	if (declaration === void 0) return;
	if (Object.keys(declaration).length === 0) return `${providerId}/${model} does not accept providerOptions (caller supplied: ${keys.join(", ")}); skipping`;
	const unknown = keys.filter((key) => !Object.hasOwn(declaration, key));
	if (unknown.length > 0) {
		const accepted = Object.keys(declaration).join(", ");
		return `${providerId}/${model} does not accept providerOptions keys: ${unknown.join(", ")} (accepted: ${accepted}); skipping`;
	}
	for (const key of keys) {
		const expected = declaration[key];
		const value = providerOptions[key];
		const actual = typeof value;
		if (expected === "number" && (actual !== "number" || !Number.isFinite(value))) return `${providerId}/${model} expects providerOptions.${key} to be a finite number, got ${actual}; skipping`;
		if (expected === "boolean" && actual !== "boolean") return `${providerId}/${model} expects providerOptions.${key} to be a boolean, got ${actual}; skipping`;
		if (expected === "string" && actual !== "string") return `${providerId}/${model} expects providerOptions.${key} to be a string, got ${actual}; skipping`;
	}
}
function listRuntimeVideoGenerationProviders(params, deps = {}) {
	return (deps.listProviders ?? listVideoGenerationProviders)(params?.config);
}
async function generateVideo(params, deps = {}) {
	if (deps.getProvider && deps.listProviders) return runVideoGeneration(params, deps);
	return withVideoGenerationProviders(params.cfg, (providers) => {
		const lookup = createMediaProviderLookup(providers);
		return runVideoGeneration(params, {
			...deps,
			getProvider: deps.getProvider ?? lookup.getProvider,
			listProviders: deps.listProviders ?? lookup.listProviders
		});
	});
}
async function runVideoGeneration(params, deps) {
	const getProvider = deps.getProvider ?? getVideoGenerationProvider;
	const listProviders = deps.listProviders ?? listVideoGenerationProviders;
	const logger = deps.log ?? log;
	const requestedTimeoutMs = params.timeoutMs ?? resolveAgentModelTimeoutMsValue(params.cfg.agents?.defaults?.mediaModels?.video);
	const candidates = resolveCapabilityModelCandidates({
		cfg: params.cfg,
		modelConfig: params.cfg.agents?.defaults?.mediaModels?.video,
		modelOverride: params.modelOverride,
		parseModelRef: parseGenerationModelRef,
		agentDir: params.agentDir,
		listProviders,
		autoProviderFallback: params.autoProviderFallback
	});
	if (candidates.length === 0) throw new Error(buildNoCapabilityModelConfiguredMessage({
		capabilityLabel: "video-generation",
		modelConfigKey: "mediaModels.video",
		providers: listProviders(params.cfg),
		getProviderEnvVars: deps.getProviderEnvVars
	}));
	let skipWarnEmitted = false;
	const warnOnFirstSkip = (reason) => {
		if (!skipWarnEmitted) {
			skipWarnEmitted = true;
			logger.warn(`video-generation candidate skipped: ${reason}`);
		}
	};
	return runMediaGenerationCandidates({
		candidates,
		capability: "video",
		getProvider: (providerId) => getProvider(providerId, params.cfg),
		onFailure: (attempt) => {
			logger.warn(`video-generation candidate failed: ${attempt.provider}/${attempt.model}: ${attempt.error}`);
		},
		async prepareCandidate(candidate, provider) {
			const timeoutMs = resolveMediaProviderRequestTimeoutMs({
				timeoutMs: requestedTimeoutMs,
				providerDefaultTimeoutMs: provider.defaultTimeoutMs
			});
			const activeProvider = await resolveProviderWithModelCapabilities({
				provider,
				providerId: candidate.provider,
				model: candidate.model,
				cfg: params.cfg,
				agentDir: params.agentDir,
				authStore: params.authStore,
				timeoutMs: MODEL_CAPABILITY_LOOKUP_TIMEOUT_MS,
				log: logger
			});
			const inputImageCount = params.inputImages?.length ?? 0;
			const inputVideoCount = params.inputVideos?.length ?? 0;
			const inputAudioCount = params.inputAudios?.length ?? 0;
			const capabilityMismatch = buildVideoGenerationCapabilityFailure({
				providerId: candidate.provider,
				model: candidate.model,
				provider: activeProvider,
				inputImageCount,
				inputVideoCount,
				inputAudioCount
			});
			if (capabilityMismatch) {
				warnOnFirstSkip(capabilityMismatch);
				logger.debug(`video-generation candidate skipped (mode or reference capability): ${candidate.provider}/${candidate.model}`);
				return capabilityMismatch;
			}
			if (params.providerOptions && typeof params.providerOptions === "object" && Object.keys(params.providerOptions).length > 0) {
				const { capabilities: optCaps } = resolveVideoGenerationModeCapabilities({
					provider: activeProvider,
					model: candidate.model,
					inputImageCount,
					inputVideoCount
				});
				const declaredOptions = optCaps?.providerOptions ?? activeProvider.capabilities.providerOptions ?? void 0;
				const mismatch = validateProviderOptionsAgainstDeclaration({
					providerId: candidate.provider,
					model: candidate.model,
					providerOptions: params.providerOptions,
					declaration: declaredOptions
				});
				if (mismatch) {
					warnOnFirstSkip(mismatch);
					logger.debug(`video-generation candidate skipped (providerOptions): ${candidate.provider}/${candidate.model}`);
					return mismatch;
				}
			}
			const supportedDurations = resolveVideoGenerationSupportedDurations({
				provider: activeProvider,
				model: candidate.model,
				inputImageCount,
				inputVideoCount
			});
			const requestedDuration = params.durationSeconds;
			if (typeof requestedDuration === "number" && Number.isFinite(requestedDuration)) {
				const { capabilities: durCaps } = resolveVideoGenerationModeCapabilities({
					provider: activeProvider,
					model: candidate.model,
					inputImageCount,
					inputVideoCount
				});
				const maxDuration = durCaps?.maxDurationSeconds ?? activeProvider.capabilities.maxDurationSeconds;
				if (!supportedDurations && typeof maxDuration === "number" && Math.round(requestedDuration) > maxDuration) {
					const error = `${candidate.provider}/${candidate.model} supports at most ${maxDuration}s per video, ${requestedDuration}s requested; skipping`;
					warnOnFirstSkip(error);
					logger.debug(`video-generation candidate skipped (duration capability): ${candidate.provider}/${candidate.model}`);
					return error;
				}
			}
			return async (attempts) => {
				const sanitized = resolveVideoGenerationOverrides({
					provider: activeProvider,
					model: candidate.model,
					size: params.size,
					aspectRatio: params.aspectRatio,
					resolution: params.resolution,
					durationSeconds: params.durationSeconds,
					audio: params.audio,
					watermark: params.watermark,
					inputImageCount,
					inputVideoCount
				});
				const generationRequest = {
					provider: candidate.provider,
					model: candidate.model,
					prompt: params.prompt,
					cfg: params.cfg,
					agentDir: params.agentDir,
					authStore: params.authStore,
					size: sanitized.size,
					aspectRatio: sanitized.aspectRatio,
					resolution: sanitized.resolution,
					durationSeconds: sanitized.durationSeconds,
					audio: sanitized.audio,
					watermark: sanitized.watermark,
					inputImages: params.inputImages,
					inputVideos: params.inputVideos,
					inputAudios: params.inputAudios,
					providerOptions: params.providerOptions,
					...timeoutMs !== void 0 ? { timeoutMs } : {}
				};
				if (supportedDurations) generationRequest[SUPPORTED_DURATIONS_HINT] = supportedDurations;
				const result = await provider.generateVideo(generationRequest);
				if (!Array.isArray(result.videos) || result.videos.length === 0) throw new Error("Video generation provider returned no videos.");
				return {
					videos: result.videos.map((video, index) => {
						if (video.buffer?.byteLength === 0) {
							if (video.url) {
								const { buffer: _emptyBuffer, ...urlOnlyVideo } = video;
								return urlOnlyVideo;
							}
							throw new Error(`Video generation provider returned an empty video buffer at index ${index}.`);
						}
						if (!video.buffer && !video.url) throw new Error(`Video generation provider returned an undeliverable asset at index ${index}: neither buffer nor url is set.`);
						return video;
					}),
					provider: candidate.provider,
					model: result.model ?? candidate.model,
					attempts,
					normalization: sanitized.normalization,
					ignoredOverrides: sanitized.ignoredOverrides,
					metadata: {
						...result.metadata,
						...buildMediaGenerationNormalizationMetadata({
							normalization: sanitized.normalization,
							requestedSizeForDerivedAspectRatio: params.size,
							includeSupportedDurationSeconds: true
						})
					}
				};
			};
		}
	});
}
//#endregion
export { listRuntimeVideoGenerationProviders as n, generateVideo as t };
