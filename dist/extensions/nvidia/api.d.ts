import { Jt as OpenClawConfig, Zt as ModelProviderDeclarationConfig } from "../../runtime-api-Bekxb7wO.js";
import "../../provider-model-shared-D4njaASJ.js";
//#region extensions/nvidia/provider-catalog.d.ts
export declare const NVIDIA_DEFAULT_MODEL_ID = "nvidia/nemotron-3-ultra-550b-a55b";
export declare function buildNvidiaProvider(): ModelProviderDeclarationConfig;
//#endregion
//#region extensions/nvidia/onboard.d.ts
export declare const NVIDIA_DEFAULT_MODEL_REF = "nvidia/nemotron-3-ultra-550b-a55b";
export declare const applyNvidiaConfig: (cfg: OpenClawConfig) => OpenClawConfig, applyNvidiaProviderConfig: (cfg: OpenClawConfig) => OpenClawConfig;
//#endregion