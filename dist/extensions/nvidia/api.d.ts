import { U as ModelProviderDeclarationConfig } from "../../types-D7I_F5Ux.js";
import "../../provider-model-shared-uYxY__EE.js";
import { t as ProviderOnboardPresetAppliers } from "../../provider-onboard-BNuhTHon.js";
//#region extensions/nvidia/provider-catalog.d.ts
export declare const NVIDIA_DEFAULT_MODEL_ID = "nvidia/nemotron-3-ultra-550b-a55b";
export declare function buildNvidiaProvider(): ModelProviderDeclarationConfig;
//#endregion
//#region extensions/nvidia/onboard.d.ts
export declare const NVIDIA_DEFAULT_MODEL_REF = "nvidia/nemotron-3-ultra-550b-a55b";
declare const { applyConfig: applyNvidiaConfig, applyProviderConfig: applyNvidiaProviderConfig }: ProviderOnboardPresetAppliers<[]>;
declare const { applyConfig: applyNvidiaConnectionConfig }: ProviderOnboardPresetAppliers<[]>;
//#endregion
export { applyNvidiaConfig, applyNvidiaProviderConfig };