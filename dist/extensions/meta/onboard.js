import { n as openclaw_plugin_default } from "./.setup/provider-catalog-Br7h254v.mjs";
import { META_BASE_URL, buildMetaCatalogModels } from "./models.js";
import { readManifestProviderDefaultModelRef } from "openclaw/plugin-sdk/provider-catalog-shared";
import { createModelCatalogPresetAppliers, createProviderConnectionPresetAppliers } from "openclaw/plugin-sdk/provider-onboard";
//#region extensions/meta/onboard.ts
/**
* Meta onboarding config helpers.
*/
/** Default Meta model reference used after onboarding. */
const META_DEFAULT_MODEL_REF = readManifestProviderDefaultModelRef(openclaw_plugin_default, "meta");
/** Applies Meta provider/catalog config and default model aliases. */
const metaPreset = {
	primaryModelRef: META_DEFAULT_MODEL_REF,
	resolveParams: () => ({
		providerId: "meta",
		api: "openai-responses",
		baseUrl: META_BASE_URL,
		catalogModels: buildMetaCatalogModels,
		aliases: [{
			modelRef: META_DEFAULT_MODEL_REF,
			alias: "Muse Spark 1.3"
		}]
	})
};
const { applyConfig: applyMetaConfig } = createModelCatalogPresetAppliers(metaPreset);
const { applyConfig: applyMetaConnectionConfig } = createProviderConnectionPresetAppliers(metaPreset);
//#endregion
export { META_DEFAULT_MODEL_REF, applyMetaConfig, applyMetaConnectionConfig };
