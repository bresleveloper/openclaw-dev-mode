import { r as withAcquiredPluginCapabilityProviders } from "./capability-provider-acquisition-DtncA4c0.mjs";
import { n as createMediaProviderRegistry } from "./provider-registry-B3wPy8kk.mjs";
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
//#endregion
export { listMusicGenerationProviders as a, listImageGenerationProviders as i, getMusicGenerationProvider as n, listVideoGenerationProviders as o, getVideoGenerationProvider as r, withImageGenerationProviders as s, getImageGenerationProvider as t };
