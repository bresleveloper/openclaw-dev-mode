import { r as VENICE_MODEL_CATALOG, t as VENICE_BASE_URL } from "./.setup/models-ZOIqXP1y.mjs";
// extensions/venice/provider-catalog.ts
function buildStaticVeniceProvider() {
	return {
		baseUrl: VENICE_BASE_URL,
		api: "openai-completions",
		models: VENICE_MODEL_CATALOG
	};
}
export { buildStaticVeniceProvider };
