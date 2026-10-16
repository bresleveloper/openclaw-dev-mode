import { I as SubsystemLogger, X as OpenClawConfig, _ as ImageGenerationProvider, l as VideoGenerationProvider, m as MusicGenerationProvider, n as GenerateImageRuntimeResult, r as getProviderEnvVarsCore, t as GenerateImageParams } from "../../runtime-types-LI_BBveH.js";
//#region src/media-generation/registry.d.ts
/** Registry for image-generation providers contributed by plugin capabilities. */
declare const { listProviders: listImageGenerationProviders, getProvider: getImageGenerationProvider }: {
  listProviders: (cfg?: OpenClawConfig, additionalProviderIds?: readonly string[]) => ImageGenerationProvider[];
  getProvider: (providerId: string | undefined, cfg?: OpenClawConfig) => ImageGenerationProvider | undefined;
};
/** Registry for music-generation providers contributed by plugin capabilities. */
declare const { listProviders: listMusicGenerationProviders, getProvider: getMusicGenerationProvider }: {
  listProviders: (cfg?: OpenClawConfig, additionalProviderIds?: readonly string[]) => MusicGenerationProvider[];
  getProvider: (providerId: string | undefined, cfg?: OpenClawConfig) => MusicGenerationProvider | undefined;
};
/** Registry for video-generation providers contributed by plugin capabilities. */
declare const { listProviders: listVideoGenerationProviders, getProvider: getVideoGenerationProvider }: {
  listProviders: (cfg?: OpenClawConfig, additionalProviderIds?: readonly string[]) => VideoGenerationProvider[];
  getProvider: (providerId: string | undefined, cfg?: OpenClawConfig) => VideoGenerationProvider | undefined;
};
//#endregion
//#region src/image-generation/runtime.d.ts
declare const log: SubsystemLogger;
/** Dependency seam used by image-generation runtime tests and plugin host callers. */
type ImageGenerationRuntimeDeps = {
  getProvider?: typeof getImageGenerationProvider;
  listProviders?: typeof listImageGenerationProviders;
  getProviderEnvVars?: typeof getProviderEnvVarsCore;
  log?: Pick<typeof log, "warn">;
};
/** Lists image-generation providers visible for the current config. */
export declare function listRuntimeImageGenerationProviders(params?: {
  config?: OpenClawConfig;
}, deps?: ImageGenerationRuntimeDeps): ImageGenerationProvider[];
export declare function generateImage(params: GenerateImageParams, deps?: ImageGenerationRuntimeDeps): Promise<GenerateImageRuntimeResult>;
//#endregion
export type { GenerateImageParams, GenerateImageRuntimeResult };