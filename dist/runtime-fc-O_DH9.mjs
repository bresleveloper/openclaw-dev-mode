import { t as createSubsystemLogger } from "./subsystem-I-uqdx4f.mjs";
import { c as resolveAgentModelTimeoutMsValue } from "./model-input-C9K4a_6k.mjs";
import "./provider-env-vars-C_lyIdYO.mjs";
import { t as createMediaProviderLookup } from "./provider-registry-Cdqgifi-.mjs";
import { i as listImageGenerationProviders, s as withImageGenerationProviders, t as getImageGenerationProvider } from "./registry-BF8aiTGP.mjs";
import { c as resolveMediaProviderRequestTimeoutMs, i as resolveCapabilityModelCandidates, l as resolveReferenceImageCapabilityError, n as buildNoCapabilityModelConfiguredMessage, t as buildMediaGenerationNormalizationMetadata, u as runMediaGenerationCandidates } from "./runtime-shared-CTVspboB.mjs";
import { t as parseGenerationModelRef } from "./model-ref-BPLi1CUl.mjs";
import { t as resolveMediaGeometryOverrides } from "./geometry-normalization-BNA0cGpB.mjs";
//#region src/image-generation/capabilities.ts
function resolveImageGenerationMaxInputImages(params) {
	const model = params.model?.trim();
	let prefixLimit;
	let prefixLength = -1;
	if (model) {
		for (const [prefix, limit] of Object.entries(params.provider.capabilities.edit.maxInputImagesByModelPrefix ?? {})) if (prefix.length > prefixLength && model.startsWith(prefix)) {
			prefixLimit = limit;
			prefixLength = prefix.length;
		}
	}
	return (model ? params.provider.capabilities.edit.maxInputImagesByModel?.[model] : void 0) ?? prefixLimit ?? params.provider.capabilities.edit.maxInputImages;
}
//#endregion
//#region src/image-generation/normalization.ts
/** Normalizes image generation request overrides against provider/model capabilities. */
/** Returns supported image overrides plus ignored/normalized override metadata for replies. */
function resolveImageGenerationOverrides(params) {
	const modeCaps = params.inputImages?.length ? params.provider.capabilities.edit : params.provider.capabilities.generate;
	const geometry = params.provider.capabilities.geometry;
	const sanitized = resolveMediaGeometryOverrides({
		size: params.size,
		aspectRatio: params.aspectRatio,
		resolution: params.resolution,
		capabilities: {
			...modeCaps,
			sizes: params.model ? geometry?.sizesByModel?.[params.model] ?? geometry?.sizes : geometry?.sizes,
			aspectRatios: params.model ? geometry?.aspectRatiosByModel?.[params.model] ?? geometry?.aspectRatios : geometry?.aspectRatios,
			resolutions: params.model ? geometry?.resolutionsByModel?.[params.model] ?? geometry?.resolutions : geometry?.resolutions
		},
		fallbackSizes: geometry?.sizes
	});
	const ignoredOverrides = sanitized.ignoredOverrides;
	let { quality, outputFormat, background } = params;
	const output = params.provider.capabilities.output;
	const qualities = (params.model ? output?.qualitiesByModel?.[params.model] : void 0) ?? output?.qualities;
	const formats = (params.model ? output?.formatsByModel?.[params.model] : void 0) ?? output?.formats;
	const backgrounds = (params.model ? output?.backgroundsByModel?.[params.model] : void 0) ?? output?.backgrounds;
	if (quality && !(qualities ?? []).includes(quality)) {
		ignoredOverrides.push({
			key: "quality",
			value: quality
		});
		quality = void 0;
	}
	if (outputFormat && !(formats ?? []).includes(outputFormat)) {
		ignoredOverrides.push({
			key: "outputFormat",
			value: outputFormat
		});
		outputFormat = void 0;
	}
	if (background && !(backgrounds ?? []).includes(background)) {
		ignoredOverrides.push({
			key: "background",
			value: background
		});
		background = void 0;
	}
	const { normalization } = sanitized;
	return {
		size: sanitized.size,
		aspectRatio: sanitized.aspectRatio,
		resolution: sanitized.resolution,
		quality,
		outputFormat,
		background,
		ignoredOverrides,
		normalization: Object.keys(normalization).length ? normalization : void 0
	};
}
//#endregion
//#region src/image-generation/runtime.ts
/** Runtime entrypoint for image generation with provider fallback and override normalization. */
const log = createSubsystemLogger("image-generation");
/** Lists image-generation providers visible for the current config. */
function listRuntimeImageGenerationProviders(params, deps = {}) {
	return (deps.listProviders ?? listImageGenerationProviders)(params?.config);
}
async function generateImage(params, deps = {}) {
	if (deps.getProvider && deps.listProviders) return runImageGeneration(params, deps);
	return withImageGenerationProviders(params.cfg, (providers) => {
		const lookup = createMediaProviderLookup(providers);
		return runImageGeneration(params, {
			...deps,
			getProvider: deps.getProvider ?? lookup.getProvider,
			listProviders: deps.listProviders ?? lookup.listProviders
		});
	});
}
async function runImageGeneration(params, deps) {
	const getProvider = deps.getProvider ?? getImageGenerationProvider;
	const listProviders = deps.listProviders ?? listImageGenerationProviders;
	const logger = deps.log ?? log;
	const requestedTimeoutMs = params.timeoutMs ?? resolveAgentModelTimeoutMsValue(params.cfg.agents?.defaults?.mediaModels?.image);
	const candidates = resolveCapabilityModelCandidates({
		cfg: params.cfg,
		modelConfig: params.cfg.agents?.defaults?.mediaModels?.image,
		modelOverride: params.modelOverride,
		parseModelRef: parseGenerationModelRef,
		agentDir: params.agentDir,
		listProviders,
		autoProviderFallback: params.autoProviderFallback
	});
	if (candidates.length === 0) throw new Error(buildNoCapabilityModelConfiguredMessage({
		capabilityLabel: "image-generation",
		modelConfigKey: "mediaModels.image",
		providers: listProviders(params.cfg),
		getProviderEnvVars: deps.getProviderEnvVars
	}));
	return runMediaGenerationCandidates({
		candidates,
		capability: "image",
		getProvider: (providerId) => getProvider(providerId, params.cfg),
		includeSkipFailureDetails: true,
		onMissingProvider: (attempt) => {
			logger.warn(`image-generation candidate failed: ${attempt.provider}/${attempt.model}: ${attempt.error}`);
		},
		onFailure: (attempt) => {
			logger.warn(`image-generation candidate failed: ${attempt.provider}/${attempt.model}: ${attempt.error}`);
		},
		prepareCandidate(candidate, provider) {
			const inputImageCount = params.inputImages?.length ?? 0;
			const maxInputImages = resolveImageGenerationMaxInputImages({
				provider,
				model: candidate.model
			});
			const referenceImageError = resolveReferenceImageCapabilityError({
				candidateRef: `${candidate.provider}/${candidate.model}`,
				inputImageCount,
				edit: {
					enabled: provider.capabilities.edit.enabled,
					...maxInputImages !== void 0 ? { maxInputImages } : {}
				}
			});
			if (referenceImageError) {
				logger.warn(`image-generation candidate skipped: ${referenceImageError}`);
				return referenceImageError;
			}
			return async (attempts) => {
				const timeoutMs = resolveMediaProviderRequestTimeoutMs({
					timeoutMs: requestedTimeoutMs,
					providerDefaultTimeoutMs: provider.defaultTimeoutMs
				});
				const modelResolutions = provider.capabilities.geometry?.resolutionsByModel?.[candidate.model];
				const inferredResolution = (params.inputImages?.length ? provider.capabilities.edit : provider.capabilities.generate).supportsResolution === false || modelResolutions?.length === 0 ? void 0 : params.inferredResolution;
				const sanitized = resolveImageGenerationOverrides({
					provider,
					model: candidate.model,
					size: params.size,
					aspectRatio: params.aspectRatio,
					resolution: params.resolution ?? inferredResolution,
					quality: params.quality,
					outputFormat: params.outputFormat,
					background: params.background,
					inputImages: params.inputImages
				});
				const result = await provider.generateImage({
					provider: candidate.provider,
					model: candidate.model,
					prompt: params.prompt,
					cfg: params.cfg,
					agentDir: params.agentDir,
					authStore: params.authStore,
					count: params.count,
					size: sanitized.size,
					aspectRatio: sanitized.aspectRatio,
					resolution: sanitized.resolution,
					quality: sanitized.quality,
					outputFormat: sanitized.outputFormat,
					background: sanitized.background,
					inputImages: params.inputImages,
					...timeoutMs !== void 0 ? { timeoutMs } : {},
					providerOptions: params.providerOptions,
					ssrfPolicy: params.ssrfPolicy
				});
				if (!Array.isArray(result.images) || result.images.length === 0) throw new Error("Image generation provider returned no images.");
				const emptyImageIndex = result.images.findIndex((image) => image.buffer.byteLength === 0);
				if (emptyImageIndex >= 0) throw new Error(`Image generation provider returned an empty image buffer at index ${emptyImageIndex}.`);
				return {
					images: result.images,
					provider: candidate.provider,
					model: result.model ?? candidate.model,
					attempts,
					...sanitized.resolution ? { appliedResolution: sanitized.resolution } : {},
					normalization: sanitized.normalization,
					metadata: {
						...result.metadata,
						...buildMediaGenerationNormalizationMetadata({
							normalization: sanitized.normalization,
							requestedSizeForDerivedAspectRatio: params.size
						})
					},
					ignoredOverrides: sanitized.ignoredOverrides
				};
			};
		}
	});
}
//#endregion
export { listRuntimeImageGenerationProviders as n, generateImage as t };
