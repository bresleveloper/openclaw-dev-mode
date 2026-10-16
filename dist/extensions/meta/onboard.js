import { a as openclaw_plugin_default, r as buildMetaCatalogModels, t as META_BASE_URL } from "./.setup/provider-catalog-BNTlqvTm.mjs";
import { readManifestProviderDefaultModelRef } from "openclaw/plugin-sdk/provider-catalog-shared";
import { createModelCatalogPresetAppliers, createProviderConnectionPresetAppliers } from "openclaw/plugin-sdk/provider-onboard";
//#region extensions/meta/onboard.ts
const META_DEFAULT_MODEL_REF = readManifestProviderDefaultModelRef(openclaw_plugin_default, "meta");
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
		}, {
			modelRef: "meta/muse-wonder-1.0",
			alias: "Muse Wonder"
		}]
	})
};
const { applyConfig: applyMetaConfig } = createModelCatalogPresetAppliers(metaPreset);
const { applyConfig: applyMetaConnectionConfig } = createProviderConnectionPresetAppliers(metaPreset);
//#endregion
export { META_DEFAULT_MODEL_REF, applyMetaConfig, applyMetaConnectionConfig };
