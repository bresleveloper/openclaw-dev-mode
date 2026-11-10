import { t as createSubsystemLogger } from "./subsystem-mStysHHC.mjs";
import { c as resolveAgentModelTimeoutMsValue } from "./model-input-CeM8o97s.mjs";
import "./provider-env-vars-D43Pu6eG.mjs";
import { r as withAcquiredPluginCapabilityProviders } from "./capability-provider-acquisition-DtncA4c0.mjs";
import { t as createMediaProviderLookup } from "./provider-registry-B3wPy8kk.mjs";
import { a as listMusicGenerationProviders, n as getMusicGenerationProvider } from "./registry-DB8J1c3I.mjs";
import { d as resolveReferenceImageCapabilityError, f as runMediaGenerationCandidates, r as normalizeDurationToClosestMax, t as buildMediaGenerationNormalizationMetadata } from "./runtime-shared-DrcE5eH-.mjs";
//#region src/music-generation/capabilities.ts
/** List modes supported by a provider in stable display order. */
function listSupportedMusicGenerationModes(provider) {
	const modes = ["generate"];
	if (provider.capabilities.edit?.enabled) modes.push("edit");
	return modes;
}
/** Resolve the active mode and provider capability contract for one request. */
function resolveMusicGenerationModeCapabilities(params) {
	const mode = (params.inputImageCount ?? 0) > 0 ? "edit" : "generate";
	return {
		mode,
		capabilities: params.provider?.capabilities?.[mode]
	};
}
//#endregion
//#region src/music-generation/normalization.ts
/** Sanitize caller overrides against provider capabilities before invoking a provider. */
function resolveMusicGenerationOverrides(params) {
	const { capabilities: caps } = resolveMusicGenerationModeCapabilities({
		provider: params.provider,
		inputImageCount: params.inputImages?.length ?? 0
	});
	const ignoredOverrides = [];
	const normalization = {};
	let { lyrics, instrumental, durationSeconds, format } = params;
	if (!caps) return {
		lyrics,
		instrumental,
		durationSeconds,
		format,
		ignoredOverrides
	};
	if (lyrics?.trim() && !(caps.supportsLyricsByModel?.[params.model] ?? caps.supportsLyrics === true)) {
		ignoredOverrides.push({
			key: "lyrics",
			value: lyrics
		});
		lyrics = void 0;
	}
	if (typeof instrumental === "boolean" && !(caps.supportsInstrumentalByModel?.[params.model] ?? caps.supportsInstrumental === true)) {
		ignoredOverrides.push({
			key: "instrumental",
			value: instrumental
		});
		instrumental = void 0;
	}
	if (typeof durationSeconds === "number" && !caps.supportsDuration) {
		ignoredOverrides.push({
			key: "durationSeconds",
			value: durationSeconds
		});
		durationSeconds = void 0;
	} else if (typeof durationSeconds === "number") {
		const normalizedDurationSeconds = normalizeDurationToClosestMax(durationSeconds, caps.maxDurationSeconds);
		if (typeof normalizedDurationSeconds === "number" && normalizedDurationSeconds !== durationSeconds) normalization.durationSeconds = {
			requested: durationSeconds,
			applied: normalizedDurationSeconds
		};
		durationSeconds = normalizedDurationSeconds;
	}
	if (format) {
		const supportedFormats = caps.supportedFormatsByModel?.[params.model] ?? caps.supportedFormats ?? [];
		if (!caps.supportsFormat || supportedFormats.length > 0 && !supportedFormats.includes(format)) {
			ignoredOverrides.push({
				key: "format",
				value: format
			});
			format = void 0;
		}
	}
	return {
		lyrics,
		instrumental,
		durationSeconds,
		format,
		ignoredOverrides,
		normalization: normalization.durationSeconds ? normalization : void 0
	};
}
//#endregion
//#region src/music-generation/runtime.ts
const log = createSubsystemLogger("music-generation");
/** List runtime-visible music generation providers for a config snapshot. */
function listRuntimeMusicGenerationProviders(params, deps = {}) {
	return (deps.listProviders ?? listMusicGenerationProviders)(params?.config);
}
/** Generate music with provider fallback and capability-aware request normalization. */
async function generateMusic(params, deps = {}) {
	if (deps.getProvider && deps.listProviders) return runMusicGeneration(params, deps);
	return withAcquiredPluginCapabilityProviders({
		key: "musicGenerationProviders",
		cfg: params.cfg
	}, (providers) => {
		const lookup = createMediaProviderLookup(providers);
		return runMusicGeneration(params, {
			...deps,
			getProvider: deps.getProvider ?? lookup.getProvider,
			listProviders: deps.listProviders ?? lookup.listProviders
		});
	});
}
async function runMusicGeneration(params, deps) {
	const getProvider = deps.getProvider ?? getMusicGenerationProvider;
	const listProviders = deps.listProviders ?? listMusicGenerationProviders;
	const logger = deps.log ?? log;
	const timeoutMs = params.timeoutMs ?? resolveAgentModelTimeoutMsValue(params.cfg.agents?.defaults?.mediaModels?.music);
	return runMediaGenerationCandidates({
		request: params,
		listProviders,
		getProviderEnvVars: deps.getProviderEnvVars,
		capability: "music",
		getProvider: (providerId) => getProvider(providerId, params.cfg),
		onFailure: (attempt) => {
			logger.warn(`music-generation candidate failed: ${attempt.provider}/${attempt.model}: ${attempt.error}`);
		},
		prepareCandidate(candidate, provider) {
			const referenceImageError = resolveReferenceImageCapabilityError({
				candidateRef: `${candidate.provider}/${candidate.model}`,
				inputImageCount: params.inputImages?.length ?? 0,
				edit: provider.capabilities.edit
			});
			if (referenceImageError) {
				logger.debug(`music-generation candidate skipped: ${referenceImageError}`);
				return referenceImageError;
			}
			return async (attempts) => {
				const sanitized = resolveMusicGenerationOverrides({
					provider,
					model: candidate.model,
					lyrics: params.lyrics,
					instrumental: params.instrumental,
					durationSeconds: params.durationSeconds,
					format: params.format,
					inputImages: params.inputImages
				});
				const result = await provider.generateMusic({
					provider: candidate.provider,
					model: candidate.model,
					prompt: params.prompt,
					cfg: params.cfg,
					agentDir: params.agentDir,
					authStore: params.authStore,
					lyrics: sanitized.lyrics,
					instrumental: sanitized.instrumental,
					durationSeconds: sanitized.durationSeconds,
					format: sanitized.format,
					inputImages: params.inputImages,
					...timeoutMs !== void 0 ? { timeoutMs } : {}
				});
				if (!Array.isArray(result.tracks) || result.tracks.length === 0) throw new Error("Music generation provider returned no tracks.");
				const emptyTrackIndex = result.tracks.findIndex((track) => track.buffer.byteLength === 0);
				if (emptyTrackIndex >= 0) throw new Error(`Music generation provider returned an empty track buffer at index ${emptyTrackIndex}.`);
				return {
					tracks: result.tracks,
					provider: candidate.provider,
					model: result.model ?? candidate.model,
					attempts,
					lyrics: result.lyrics,
					normalization: sanitized.normalization,
					metadata: {
						...result.metadata,
						...buildMediaGenerationNormalizationMetadata({ normalization: sanitized.normalization })
					},
					ignoredOverrides: sanitized.ignoredOverrides
				};
			};
		}
	});
}
//#endregion
export { listRuntimeMusicGenerationProviders as n, listSupportedMusicGenerationModes as r, generateMusic as t };
