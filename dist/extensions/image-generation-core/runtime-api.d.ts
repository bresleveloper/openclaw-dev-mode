import { BD as ImageGenerationProvider, bS as getProviderEnvVarsCore, gD as VideoGenerationProvider, gl as GenerateImageRuntimeResult, hl as GenerateImageParams, zD as MusicGenerationProvider } from "../../config-contracts-hzlacViZ.js";
import { r as OpenClawConfig } from "../../types.openclaw-D8uW-XQA.js";
import { t as SubsystemLogger } from "../../subsystem-wnS6DJyq.js";
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
export type { GenerateImageParams, GenerateImageRuntimeResult };