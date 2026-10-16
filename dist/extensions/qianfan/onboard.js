import { n as QIANFAN_DEFAULT_MODEL_ID, r as buildQianfanProvider } from "./.setup/provider-catalog-BO8z61BO.mjs";
import { createDefaultModelsConnectionPresetAppliers } from "openclaw/plugin-sdk/provider-onboard";
//#region extensions/qianfan/onboard.ts
const QIANFAN_DEFAULT_MODEL_REF = `qianfan/${QIANFAN_DEFAULT_MODEL_ID}`;
const { applyConfig: applyQianfanConfig } = createDefaultModelsConnectionPresetAppliers({
	primaryModelRef: QIANFAN_DEFAULT_MODEL_REF,
	resolveParams: (cfg) => {
		const existingProvider = cfg.models?.providers?.qianfan;
		const existingBaseUrl = typeof existingProvider?.baseUrl === "string" ? existingProvider.baseUrl.trim() : "";
		return {
			providerId: "qianfan",
			api: typeof existingProvider?.api === "string" ? existingProvider.api : "openai-completions",
			baseUrl: existingBaseUrl || "https://qianfan.baidubce.com/v2",
			defaultModels: () => buildQianfanProvider().models,
			defaultModelId: QIANFAN_DEFAULT_MODEL_ID,
			aliases: [{
				modelRef: QIANFAN_DEFAULT_MODEL_REF,
				alias: "QIANFAN"
			}]
		};
	}
});
//#endregion
export { QIANFAN_DEFAULT_MODEL_REF, applyQianfanConfig };
