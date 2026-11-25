import { p as ModelProviderDeclarationConfig } from "../../types.openclaw-D8uW-XQA.js";
import "../../provider-model-shared-OQQj5XdR.js";
import { t as ProviderOnboardPresetAppliers } from "../../provider-onboard-BitR1dNE.js";
export declare const NVIDIA_DEFAULT_MODEL_ID = "nvidia/nemotron-3-ultra-550b-a55b";
export declare function buildNvidiaProvider(): ModelProviderDeclarationConfig;
export declare const NVIDIA_DEFAULT_MODEL_REF = "nvidia/nemotron-3-ultra-550b-a55b";
declare const { applyConfig: applyNvidiaConfig, applyProviderConfig: applyNvidiaProviderConfig }: ProviderOnboardPresetAppliers<[]>;
declare const { applyConfig: applyNvidiaConnectionConfig }: ProviderOnboardPresetAppliers<[]>;
export { applyNvidiaConfig, applyNvidiaProviderConfig };