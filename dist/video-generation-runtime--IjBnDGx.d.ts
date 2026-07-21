import { i as OpenClawConfig } from "./types.openclaw-B5gtuEn_.js";
import { Gu as GenerateVideoRuntimeResult, Wu as GenerateVideoParams } from "./types-BpDhk2ev.js";
import { t as SubsystemLogger } from "./subsystem-CfQVin8T.js";
import { n as getProviderEnvVars } from "./provider-env-vars-T4TLMyOa.js";
import { s as VideoGenerationProvider } from "./types-BOoT2wvR.js";
import { n as listVideoGenerationProviders, t as getVideoGenerationProvider } from "./provider-registry-CpSIxDv4.js";

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
export { listRuntimeVideoGenerationProviders as n, generateVideo as t };