import { i as OpenClawConfig } from "./types.openclaw-DlpCUWMr.js";
import { Ul as GenerateImageParams, Wl as GenerateImageRuntimeResult } from "./types-BVLQjFJF.js";
import { t as SubsystemLogger } from "./subsystem-CfQVin8T.js";
import { n as getProviderEnvVars } from "./provider-env-vars-DM7qqb0Y.js";
import { l as ImageGenerationProvider } from "./types-DTAnsFzV.js";
import { n as listImageGenerationProviders, t as getImageGenerationProvider } from "./provider-registry-O1oihPVJ.js";

//#region src/image-generation/runtime.d.ts
declare const log: SubsystemLogger;
/** Dependency seam used by image-generation runtime tests and plugin host callers. */
type ImageGenerationRuntimeDeps = {
  getProvider?: typeof getImageGenerationProvider;
  listProviders?: typeof listImageGenerationProviders;
  getProviderEnvVars?: typeof getProviderEnvVars;
  log?: Pick<typeof log, "warn">;
};
/** Lists image-generation providers visible for the current config. */
declare function listRuntimeImageGenerationProviders(params?: {
  config?: OpenClawConfig;
}, deps?: ImageGenerationRuntimeDeps): ImageGenerationProvider[];
declare function generateImage(params: GenerateImageParams, deps?: ImageGenerationRuntimeDeps): Promise<GenerateImageRuntimeResult>;
//#endregion
export { listRuntimeImageGenerationProviders as n, generateImage as t };