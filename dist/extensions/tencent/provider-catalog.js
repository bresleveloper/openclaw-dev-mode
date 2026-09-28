import { a as TOKENPLAN_MODEL_CATALOG, i as TOKENPLAN_BASE_URL, n as TOKENHUB_MODEL_CATALOG, t as TOKENHUB_BASE_URL } from "./.setup/models-CeL6cmHz.mjs";
//#region extensions/tencent/provider-catalog.ts
function buildTokenHubProvider() {
	return {
		baseUrl: TOKENHUB_BASE_URL,
		api: "openai-completions",
		models: structuredClone(TOKENHUB_MODEL_CATALOG)
	};
}
function buildTokenPlanProvider() {
	return {
		baseUrl: TOKENPLAN_BASE_URL,
		api: "openai-completions",
		models: structuredClone(TOKENPLAN_MODEL_CATALOG)
	};
}
//#endregion
export { buildTokenHubProvider, buildTokenPlanProvider };
