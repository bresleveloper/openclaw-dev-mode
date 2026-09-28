import { r as withAcquiredPluginCapabilityProviders } from "./capability-provider-acquisition-DUOoduAx.mjs";
import { t as createMediaProviderRegistry } from "./provider-registry-Cj7EioxL.mjs";
//#region src/media-generation/registry.ts
/** Registry for image-generation providers contributed by plugin capabilities. */
const { listProviders: listImageGenerationProviders, getProvider: getImageGenerationProvider } = createMediaProviderRegistry("imageGenerationProviders");
/** Registry for music-generation providers contributed by plugin capabilities. */
const { listProviders: listMusicGenerationProviders, getProvider: getMusicGenerationProvider } = createMediaProviderRegistry("musicGenerationProviders");
/** Registry for video-generation providers contributed by plugin capabilities. */
const { listProviders: listVideoGenerationProviders, getProvider: getVideoGenerationProvider } = createMediaProviderRegistry("videoGenerationProviders");
/** Owns providers loaded for one buffered image-generation operation. */
function withImageGenerationProviders(cfg, run) {
	return withAcquiredPluginCapabilityProviders({
		key: "imageGenerationProviders",
		cfg
	}, run);
}
/** Owns providers through generation of completed video assets. */
function withVideoGenerationProviders(cfg, run) {
	return withAcquiredPluginCapabilityProviders({
		key: "videoGenerationProviders",
		cfg
	}, run);
}
/** Owns providers loaded for one buffered music-generation operation. */
function withMusicGenerationProviders(cfg, run) {
	return withAcquiredPluginCapabilityProviders({
		key: "musicGenerationProviders",
		cfg
	}, run);
}
//#endregion
export { listMusicGenerationProviders as a, withMusicGenerationProviders as c, listImageGenerationProviders as i, withVideoGenerationProviders as l, getMusicGenerationProvider as n, listVideoGenerationProviders as o, getVideoGenerationProvider as r, withImageGenerationProviders as s, getImageGenerationProvider as t };
