import { i as OpenClawConfig } from "./types.openclaw-R57aE8ho.js";
import { Hl as GenerateVideoRuntimeResult, Vl as GenerateVideoParams } from "./types-CXLy55Xw.js";
import { t as SubsystemLogger } from "./subsystem-Boo2DQIV.js";
import { n as getProviderEnvVars } from "./provider-env-vars-hRQuBoEz.js";
import { s as VideoGenerationProvider } from "./types-DOMhfYsC.js";
import { n as listVideoGenerationProviders, t as getVideoGenerationProvider } from "./provider-registry-B8ztvaIq.js";

//#region src/video-generation/runtime.d.ts
declare const log: SubsystemLogger;
type VideoGenerationRuntimeDeps = {
  getProvider?: typeof getVideoGenerationProvider;
  listProviders?: typeof listVideoGenerationProviders;
  getProviderEnvVars?: typeof getProviderEnvVars;
  log?: Pick<typeof log, "debug" | "warn">;
};
declare function listRuntimeVideoGenerationProviders(params?: {
  config?: OpenClawConfig;
}, deps?: VideoGenerationRuntimeDeps): VideoGenerationProvider[];
declare function generateVideo(params: GenerateVideoParams, deps?: VideoGenerationRuntimeDeps): Promise<GenerateVideoRuntimeResult>;
//#endregion
export { type GenerateVideoParams, type GenerateVideoRuntimeResult, generateVideo, listRuntimeVideoGenerationProviders };