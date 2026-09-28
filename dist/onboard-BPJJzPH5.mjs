import { s as readManifestProviderDefaultModelRef } from "./provider-catalog-DaDnKUnq.mjs";
import { _ as createProviderConnectionPresetAppliers, g as createModelCatalogPresetAppliers } from "./provider-onboard-Be0xLg2V.mjs";
import "./provider-catalog-shared-D7_lTYyN.mjs";
import { t as openclaw_plugin_default } from "./openclaw.plugin-DQQO5-vQ.mjs";
import { n as TOGETHER_MODEL_CATALOG, t as TOGETHER_BASE_URL } from "./models-CgWCh9vc.mjs";
//#region extensions/together/onboard.ts
const TOGETHER_DEFAULT_MODEL_REF = readManifestProviderDefaultModelRef(openclaw_plugin_default, "together");
const togetherPreset = {
	primaryModelRef: TOGETHER_DEFAULT_MODEL_REF,
	resolveParams: () => ({
		providerId: "together",
		api: "openai-completions",
		baseUrl: TOGETHER_BASE_URL,
		catalogModels: () => structuredClone(TOGETHER_MODEL_CATALOG),
		aliases: [{
			modelRef: TOGETHER_DEFAULT_MODEL_REF,
			alias: "Together AI"
		}]
	})
};
const { applyConfig: applyTogetherConfig } = createModelCatalogPresetAppliers(togetherPreset);
const { applyConfig: applyTogetherConnectionConfig } = createProviderConnectionPresetAppliers(togetherPreset);
//#endregion
export { applyTogetherConfig as n, applyTogetherConnectionConfig as r, TOGETHER_DEFAULT_MODEL_REF as t };
