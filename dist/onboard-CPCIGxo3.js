import { p as createModelCatalogPresetAppliers } from "./provider-onboard-MdDwXiF1.js";
import { i as buildCohereModelDefinition, n as COHERE_MODEL_CATALOG, t as COHERE_BASE_URL } from "./models-BeT8KXER.js";
//#region extensions/cohere/onboard.ts
const COHERE_DEFAULT_MODEL_ID = "command-a-03-2025";
const COHERE_DEFAULT_MODEL_REF = `cohere/${COHERE_DEFAULT_MODEL_ID}`;
const coherePresetAppliers = createModelCatalogPresetAppliers({
	primaryModelRef: COHERE_DEFAULT_MODEL_REF,
	resolveParams: (_cfg) => ({
		providerId: "cohere",
		api: "openai-completions",
		baseUrl: COHERE_BASE_URL,
		catalogModels: COHERE_MODEL_CATALOG.map(buildCohereModelDefinition),
		aliases: [{
			modelRef: COHERE_DEFAULT_MODEL_REF,
			alias: "Cohere Command A"
		}]
	})
});
function applyCohereConfig(cfg) {
	return coherePresetAppliers.applyConfig(cfg);
}
//#endregion
export { COHERE_DEFAULT_MODEL_REF as n, applyCohereConfig as r, COHERE_DEFAULT_MODEL_ID as t };
