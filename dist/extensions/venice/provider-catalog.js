import { r as VENICE_MODEL_CATALOG, t as VENICE_BASE_URL } from "./.setup/models-CX--kzd2.mjs";
//#region extensions/venice/provider-catalog.ts
function buildStaticVeniceProvider() {
	return {
		baseUrl: VENICE_BASE_URL,
		api: "openai-completions",
		models: structuredClone(VENICE_MODEL_CATALOG)
	};
}
//#endregion
export { buildStaticVeniceProvider };
