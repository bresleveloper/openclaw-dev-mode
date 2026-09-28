import { a as TOKENPLAN_MODEL_CATALOG, i as TOKENPLAN_BASE_URL, n as TOKENHUB_MODEL_CATALOG, o as TOKENPLAN_PROVIDER_ID, r as TOKENHUB_PROVIDER_ID, s as openclaw_plugin_default, t as TOKENHUB_BASE_URL } from "./.setup/models-CeL6cmHz.mjs";
import { readManifestProviderDefaultModelRef } from "openclaw/plugin-sdk/provider-catalog-shared";
import { createModelCatalogPresetAppliers } from "openclaw/plugin-sdk/provider-onboard";
//#region extensions/tencent/onboard.ts
const TOKENHUB_HY3_MODEL_REF = `${TOKENHUB_PROVIDER_ID}/hy3`;
const TOKENHUB_HY3_PREVIEW_MODEL_REF = `${TOKENHUB_PROVIDER_ID}/hy3-preview`;
const TOKENHUB_HY4_PREVIEW_MODEL_REF = `${TOKENHUB_PROVIDER_ID}/hy4-preview`;
const TOKENHUB_DEFAULT_MODEL_REF = readManifestProviderDefaultModelRef(openclaw_plugin_default, TOKENHUB_PROVIDER_ID);
const { applyConfig: applyTokenHubConfig } = createModelCatalogPresetAppliers({
	primaryModelRef: TOKENHUB_DEFAULT_MODEL_REF,
	resolveParams: (cfg) => ({
		providerId: TOKENHUB_PROVIDER_ID,
		api: "openai-completions",
		baseUrl: TOKENHUB_BASE_URL,
		catalogModels: cfg.models?.mode === "replace" ? structuredClone(TOKENHUB_MODEL_CATALOG) : [],
		aliases: [
			{
				modelRef: TOKENHUB_HY4_PREVIEW_MODEL_REF,
				alias: "Hy4 preview (TokenHub)"
			},
			{
				modelRef: TOKENHUB_HY3_MODEL_REF,
				alias: "Hy3 (TokenHub)"
			},
			{
				modelRef: TOKENHUB_HY3_PREVIEW_MODEL_REF,
				alias: "Hy3 preview (TokenHub)"
			}
		]
	})
});
const TOKENPLAN_HY3_MODEL_REF = `${TOKENPLAN_PROVIDER_ID}/hy3`;
const TOKENPLAN_HY4_PREVIEW_MODEL_REF = `${TOKENPLAN_PROVIDER_ID}/hy4-preview`;
const TOKENPLAN_DEFAULT_MODEL_REF = readManifestProviderDefaultModelRef(openclaw_plugin_default, TOKENPLAN_PROVIDER_ID);
const { applyConfig: applyTokenPlanConfig } = createModelCatalogPresetAppliers({
	primaryModelRef: TOKENPLAN_DEFAULT_MODEL_REF,
	resolveParams: (cfg) => ({
		providerId: TOKENPLAN_PROVIDER_ID,
		api: "openai-completions",
		baseUrl: TOKENPLAN_BASE_URL,
		catalogModels: cfg.models?.mode === "replace" ? structuredClone(TOKENPLAN_MODEL_CATALOG) : [],
		aliases: [{
			modelRef: TOKENPLAN_HY4_PREVIEW_MODEL_REF,
			alias: "Hy4 preview (TokenPlan)"
		}, {
			modelRef: TOKENPLAN_HY3_MODEL_REF,
			alias: "Hy3 (TokenPlan)"
		}]
	})
});
//#endregion
export { TOKENHUB_DEFAULT_MODEL_REF, TOKENPLAN_DEFAULT_MODEL_REF, applyTokenHubConfig, applyTokenPlanConfig };
