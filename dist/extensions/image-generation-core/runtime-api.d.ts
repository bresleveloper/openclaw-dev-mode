import { b as ImageGenerationProvider, n as GenerateImageRuntimeResult, q as OpenClawConfig, s as getProviderEnvVarsCore, t as GenerateImageParams, w as SubsystemLogger } from "../../runtime-types-D_4MTyiD.js";
//#region src/media-generation/registry.d.ts
/** Registry for image-generation providers contributed by plugin capabilities. */
declare const listImageGenerationProviders: (cfg?: OpenClawConfig, additionalProviderIds?: readonly string[]) => ImageGenerationProvider[], getImageGenerationProvider: (providerId: string | undefined, cfg?: OpenClawConfig) => ImageGenerationProvider | undefined;
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