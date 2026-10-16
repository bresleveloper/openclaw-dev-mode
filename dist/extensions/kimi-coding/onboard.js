import { i as buildKimiCodingProvider, n as KIMI_CODING_DEFAULT_MODEL_ID, t as KIMI_CODING_BASE_URL } from "./.setup/provider-catalog-Bc73oFLX.mjs";
import { createDefaultModelsPresetAppliers } from "openclaw/plugin-sdk/provider-onboard";
//#region extensions/kimi-coding/onboard.ts
const KIMI_MODEL_REF = `kimi/${KIMI_CODING_DEFAULT_MODEL_ID}`;
const KIMI_CODING_MODEL_REF = KIMI_MODEL_REF;
const { applyConfig: applyKimiCodeConfig } = createDefaultModelsPresetAppliers({
	primaryModelRef: KIMI_MODEL_REF,
	resolveParams: (cfg) => {
		const defaultModel = buildKimiCodingProvider().models.find(({ id }) => id === KIMI_CODING_DEFAULT_MODEL_ID);
		if (!defaultModel) return null;
		return {
			providerId: "kimi",
			api: "anthropic-messages",
			baseUrl: KIMI_CODING_BASE_URL,
			defaultModels: cfg.models?.mode === "replace" ? [defaultModel] : [],
			defaultModelId: KIMI_CODING_DEFAULT_MODEL_ID,
			aliases: [{
				modelRef: KIMI_MODEL_REF,
				alias: "Kimi"
			}]
		};
	}
});
//#endregion
export { KIMI_CODING_MODEL_REF, KIMI_MODEL_REF, applyKimiCodeConfig };
