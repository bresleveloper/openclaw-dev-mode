import { b as uniqueValues } from "./string-normalization-_gRhJUDw.mjs";
import { t as createSubsystemLogger } from "./subsystem-DleLyu58.mjs";
import { c as resolveAgentModelTimeoutMsValue } from "./model-input-DKxKaZGG.mjs";
import "./provider-env-vars-BM4XH1SL.mjs";
import { i as normalizeCapabilityProviderId, t as buildCapabilityProviderIndex } from "./provider-registry-shared-CGngP_UC.mjs";
import { l as withVideoGenerationProviders, o as listVideoGenerationProviders, r as getVideoGenerationProvider } from "./registry-D9StkV9M.mjs";
import { c as resolveMediaProviderRequestTimeoutMs, i as resolveCapabilityModelCandidates, n as buildNoCapabilityModelConfiguredMessage, t as buildMediaGenerationNormalizationMetadata, u as runMediaGenerationCandidates } from "./runtime-shared-B1C-7v_z.mjs";
import { t as parseGenerationModelRef } from "./model-ref-4WSJM5TU.mjs";
import { t as hasMediaNormalizationEntry } from "./normalization-CJ51nPmx.mjs";
import { t as resolveMediaGeometryOverrides } from "./geometry-normalization-L_PhVqiE.mjs";
//#region src/video-generation/capabilities.ts
function resolveVideoGenerationMode(params) {
	const inputImageCount = params.inputImageCount ?? 0;
	const inputVideoCount = params.inputVideoCount ?? 0;
	if (inputImageCount > 0 && inputVideoCount > 0) return null;
	if (inputVideoCount > 0) return "videoToVideo";
	if (inputImageCount > 0) return "imageToVideo";
	return "generate";
}
function listSupportedVideoGenerationModes(provider) {
	const modes = ["generate"];
	if (provider.capabilities.imageToVideo?.enabled) modes.push("imageToVideo");
	if (provider.capabilities.videoToVideo?.enabled) modes.push("videoToVideo");
	return modes;
}
function resolveVideoGenerationModeCapabilities(params) {
	const inputImageCount = params.inputImageCount ?? 0;
	const inputVideoCount = params.inputVideoCount ?? 0;
	const mode = resolveVideoGenerationMode(params);
	const capabilities = params.provider?.capabilities;
	const withModelLimits = (caps) => {
		const model = params.model?.trim();
		if (!caps || !model) return caps;
		const maxInputImages = caps.maxInputImagesByModel?.[model];
		const maxInputVideos = caps.maxInputVideosByModel?.[model];
		const maxInputAudios = caps.maxInputAudiosByModel?.[model];
		if (typeof maxInputImages !== "number" && typeof maxInputVideos !== "number" && typeof maxInputAudios !== "number") return caps;
		return {
			...caps,
			...typeof maxInputImages === "number" ? { maxInputImages } : {},
			...typeof maxInputVideos === "number" ? { maxInputVideos } : {},
			...typeof maxInputAudios === "number" ? { maxInputAudios } : {}
		};
	};
	if (!capabilities) return {
		mode,
		capabilities: void 0
	};
	if (mode === "generate") return {
		mode,
		capabilities: withModelLimits(capabilities.generate)
	};
	if (mode === "imageToVideo") return {
		mode,
		capabilities: withModelLimits(capabilities.imageToVideo)
	};
	if (mode === "videoToVideo") return {
		mode,
		capabilities: withModelLimits(capabilities.videoToVideo)
	};
	const videoToVideoCapabilities = withModelLimits(capabilities.videoToVideo);
	if (inputImageCount > 0 && inputVideoCount > 0 && videoToVideoCapabilities?.enabled && (videoToVideoCapabilities.maxInputImages ?? 0) > 0) return {
		mode,
		capabilities: videoToVideoCapabilities
	};
	return {
		mode,
		capabilities: void 0
	};
}
//#endregion
//#region src/video-generation/capability-overlays.ts
function isVideoGenerationTransformCapabilities(capabilities) {
	return Boolean(capabilities && "enabled" in capabilities);
}
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
		if (!capabilities || !isVideoGenerationTransformCapabilities(capabilities)) return `${label} does not support ${visualLabel}; skipping to avoid silent reference drop`;
		if (!capabilities.enabled) return `${label} does not support ${visualLabel}; skipping to avoid silent reference drop`;
	}
	if (inputImageCount > 0) {
		const maxImages = capabilities?.maxInputImages ?? provider.capabilities.maxInputImages ?? 0;
		if (inputImageCount > maxImages) return maxImages === 0 ? `${label} does not support reference image inputs; skipping to avoid silent image drop` : `${label} supports at most ${maxImages} reference image(s), ${inputImageCount} requested; skipping`;
	}
	if (inputVideoCount > 0) {
		const maxVideos = capabilities?.maxInputVideos ?? provider.capabilities.maxInputVideos ?? 0;
		if (inputVideoCount > maxVideos) return maxVideos === 0 ? `${label} does not support reference video inputs; skipping to avoid silent video drop` : `${label} supports at most ${maxVideos} reference video(s), ${inputVideoCount} requested; skipping`;
	}
	if (inputAudioCount > 0) {
		const maxAudio = capabilities?.maxInputAudios ?? provider.capabilities.maxInputAudios ?? 0;
		if (inputAudioCount > maxAudio) return maxAudio === 0 ? `${label} does not support reference audio inputs; skipping to avoid silent audio drop` : `${label} supports at most ${maxAudio} reference audio(s), ${inputAudioCount} requested; skipping`;
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
//#region src/video-generation/duration-support.ts
function normalizeSupportedDurationValues(values) {
	if (!Array.isArray(values) || values.length === 0) return;
	const normalized = uniqueValues(values).filter((value) => Number.isFinite(value) && value > 0).map((value) => Math.round(value)).filter((value) => value > 0).toSorted((left, right) => left - right);
	return normalized.length > 0 ? normalized : void 0;
}
function resolveVideoGenerationSupportedDurations(params) {
	const { capabilities: caps } = resolveVideoGenerationModeCapabilities({
		provider: params.provider,
		model: params.model,
		inputImageCount: params.inputImageCount,
		inputVideoCount: params.inputVideoCount
	});
	const model = params.model?.trim();
	return normalizeSupportedDurationValues((model && caps?.supportedDurationSecondsByModel ? caps.supportedDurationSecondsByModel[model] : void 0) ?? caps?.supportedDurationSeconds);
}
function normalizeVideoGenerationDuration(params) {
	if (typeof params.durationSeconds !== "number" || !Number.isFinite(params.durationSeconds)) return;
	const rounded = Math.max(1, Math.round(params.durationSeconds));
	const supported = resolveVideoGenerationSupportedDurations(params);
	if (!supported || supported.length === 0) return rounded;
	return supported.reduce((best, current) => {
		const currentDistance = Math.abs(current - rounded);
		const bestDistance = Math.abs(best - rounded);
		if (currentDistance < bestDistance) return current;
		if (currentDistance === bestDistance && current > best) return current;
		return best;
	});
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
		normalization: hasMediaNormalizationEntry(normalization.size) || hasMediaNormalizationEntry(normalization.aspectRatio) || hasMediaNormalizationEntry(normalization.resolution) || hasMediaNormalizationEntry(normalization.durationSeconds) ? normalization : void 0
	};
}
//#endregion
//#region src/video-generation/runtime.ts
const log = createSubsystemLogger("video-generation");
const MODEL_CAPABILITY_LOOKUP_TIMEOUT_MS = 5e3;
const SUPPORTED_DURATIONS_HINT = Symbol.for("openclaw.videoGeneration.supportedDurations");
/**
* Validate agent-supplied providerOptions against the candidate's declared
* schema. Returns a human-readable skip reason when the candidate cannot
* accept the supplied options, or undefined when everything checks out.
*
* Backward-compatible behavior:
* - Provider declares no schema (undefined): pass options through as-is.
*   The provider receives them and may silently ignore unknown keys. This is
*   the safe default for legacy / not-yet-migrated providers.
* - Provider explicitly declares an empty schema ({}): rejects any options.
*   This is the opt-in signal that the provider has been audited and truly
*   supports no options.
* - Provider declares a typed schema: validates each key name and value type,
*   skipping the candidate on any mismatch.
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
function buildNoVideoGenerationModelConfiguredMessage(cfg, deps) {
	const listProviders = deps.listProviders ?? listVideoGenerationProviders;
	return buildNoCapabilityModelConfiguredMessage({
		capabilityLabel: "video-generation",
		modelConfigKey: "mediaModels.video",
		providers: listProviders(cfg),
		getProviderEnvVars: deps.getProviderEnvVars
	});
}
function listRuntimeVideoGenerationProviders(params, deps = {}) {
	return (deps.listProviders ?? listVideoGenerationProviders)(params?.config);
}
async function generateVideo(params, deps = {}) {
	if (deps.getProvider && deps.listProviders) return runVideoGeneration(params, deps);
	return withVideoGenerationProviders(params.cfg, (providers) => {
		const canonical = buildCapabilityProviderIndex(providers, "canonical");
		const aliases = buildCapabilityProviderIndex(providers, "aliases");
		return runVideoGeneration(params, {
			...deps,
			getProvider: deps.getProvider ?? ((id) => {
				const normalized = normalizeCapabilityProviderId(id);
				return normalized ? aliases.get(normalized) : void 0;
			}),
			listProviders: deps.listProviders ?? (() => [...canonical.values()])
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
	if (candidates.length === 0) throw new Error(buildNoVideoGenerationModelConfiguredMessage(params.cfg, deps));
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
			logger.debug(`video-generation candidate failed: ${attempt.provider}/${attempt.model}`);
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
export { listRuntimeVideoGenerationProviders as n, listSupportedVideoGenerationModes as r, generateVideo as t };
