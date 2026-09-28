import { h as createDefaultModelsPresetAppliers, m as createDefaultModelsConnectionPresetAppliers } from "./provider-onboard-Be0xLg2V.mjs";
import { i as buildSelectableNvidiaProvider, t as NVIDIA_DEFAULT_MODEL_ID } from "./provider-catalog-65GFTEeQ.mjs";
//#region extensions/nvidia/onboard.ts
const NVIDIA_DEFAULT_MODEL_REF = NVIDIA_DEFAULT_MODEL_ID;
const nvidiaPreset = {
	primaryModelRef: NVIDIA_DEFAULT_MODEL_REF,
	resolveParams: () => {
		const defaultProvider = buildSelectableNvidiaProvider();
		return {
			providerId: "nvidia",
			api: defaultProvider.api ?? "openai-completions",
			baseUrl: defaultProvider.baseUrl,
			defaultModels: () => defaultProvider.models ?? [],
			defaultModelId: NVIDIA_DEFAULT_MODEL_ID,
			aliases: [{
				modelRef: NVIDIA_DEFAULT_MODEL_REF,
				alias: "NVIDIA"
			}]
		};
	}
};
const { applyConfig: applyNvidiaConfig, applyProviderConfig: applyNvidiaProviderConfig } = createDefaultModelsPresetAppliers(nvidiaPreset);
const { applyConfig: applyNvidiaConnectionConfig } = createDefaultModelsConnectionPresetAppliers(nvidiaPreset);
//#endregion
export { applyNvidiaProviderConfig as i, applyNvidiaConfig as n, applyNvidiaConnectionConfig as r, NVIDIA_DEFAULT_MODEL_REF as t };
