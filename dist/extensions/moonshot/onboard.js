import { MOONSHOT_BASE_URL, MOONSHOT_CN_BASE_URL } from "./provider-policy-api.js";
import { MOONSHOT_DEFAULT_MODEL_ID, MOONSHOT_DEFAULT_MODEL_REF, buildMoonshotProvider } from "./provider-catalog.js";
import { createDefaultModelsPresetAppliers } from "openclaw/plugin-sdk/provider-onboard";
//#region extensions/moonshot/onboard.ts
const moonshotPresetAppliers = createDefaultModelsPresetAppliers({
	primaryModelRef: MOONSHOT_DEFAULT_MODEL_REF,
	resolveParams: (cfg, baseUrl) => {
		const defaultModel = buildMoonshotProvider().models.find(({ id }) => id === MOONSHOT_DEFAULT_MODEL_ID);
		return defaultModel ? {
			providerId: "moonshot",
			api: "openai-completions",
			baseUrl,
			defaultModels: cfg.models?.mode === "replace" ? [defaultModel] : [],
			defaultModelId: MOONSHOT_DEFAULT_MODEL_ID,
			aliases: [{
				modelRef: MOONSHOT_DEFAULT_MODEL_REF,
				alias: "Kimi"
			}]
		} : null;
	}
});
function applyMoonshotConfig(cfg) {
	return moonshotPresetAppliers.applyConfig(cfg, MOONSHOT_BASE_URL);
}
function applyMoonshotConfigCn(cfg) {
	return moonshotPresetAppliers.applyConfig(cfg, MOONSHOT_CN_BASE_URL);
}
//#endregion
export { applyMoonshotConfig, applyMoonshotConfigCn };
