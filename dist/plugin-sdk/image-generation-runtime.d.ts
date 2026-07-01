import { i as OpenClawConfig } from "./types.openclaw-R57aE8ho.js";
import { Ul as GenerateImageParams, Wl as GenerateImageRuntimeResult } from "./types-CXLy55Xw.js";
import { t as SubsystemLogger } from "./subsystem-Boo2DQIV.js";
import { n as getProviderEnvVars } from "./provider-env-vars-hRQuBoEz.js";
import { l as ImageGenerationProvider } from "./types-CE_V9G1S.js";
import { n as listImageGenerationProviders, t as getImageGenerationProvider } from "./provider-registry-m1FCRsXk.js";

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
export { type GenerateImageParams, type GenerateImageRuntimeResult, generateImage, listRuntimeImageGenerationProviders };