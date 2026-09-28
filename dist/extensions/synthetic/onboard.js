import { SYNTHETIC_BASE_URL, SYNTHETIC_DEFAULT_MODEL_REF, SYNTHETIC_MODEL_CATALOG, buildSyntheticModelDefinition } from "./models.js";
import { createModelCatalogPresetAppliers, createProviderConnectionPresetAppliers } from "openclaw/plugin-sdk/provider-onboard";
//#region extensions/synthetic/onboard.ts
const syntheticPreset = {
	primaryModelRef: SYNTHETIC_DEFAULT_MODEL_REF,
	resolveParams: () => ({
		providerId: "synthetic",
		api: "anthropic-messages",
		baseUrl: SYNTHETIC_BASE_URL,
		catalogModels: () => SYNTHETIC_MODEL_CATALOG.map(buildSyntheticModelDefinition),
		aliases: [{
			modelRef: SYNTHETIC_DEFAULT_MODEL_REF,
			alias: "MiniMax M3"
		}]
	})
};
const { applyConfig: applySyntheticConfig, applyProviderConfig: applySyntheticProviderConfig } = createModelCatalogPresetAppliers(syntheticPreset);
const { applyConfig: applySyntheticConnectionConfig } = createProviderConnectionPresetAppliers(syntheticPreset);
//#endregion
export { SYNTHETIC_DEFAULT_MODEL_REF, applySyntheticConfig, applySyntheticConnectionConfig, applySyntheticProviderConfig };
