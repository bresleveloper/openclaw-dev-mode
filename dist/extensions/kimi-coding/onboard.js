import { KIMI_CODING_BASE_URL, KIMI_CODING_DEFAULT_MODEL_ID, buildKimiCodingProvider } from "./provider-catalog.js";
import { createDefaultModelsPresetAppliers } from "openclaw/plugin-sdk/provider-onboard";
// extensions/kimi-coding/onboard.ts
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
export { KIMI_CODING_MODEL_REF, KIMI_MODEL_REF, applyKimiCodeConfig };
