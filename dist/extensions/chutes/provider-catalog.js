import { n as CHUTES_MODEL_CATALOG, r as discoverChutesModels, t as CHUTES_BASE_URL } from "./.setup/models-DnSR_ZQn.mjs";
// extensions/chutes/provider-catalog.ts
function buildStaticChutesProvider() {
	return {
		baseUrl: CHUTES_BASE_URL,
		api: "openai-completions",
		models: CHUTES_MODEL_CATALOG
	};
}
async function buildChutesProvider(accessToken, options = {}) {
	return {
		baseUrl: CHUTES_BASE_URL,
		api: "openai-completions",
		models: await discoverChutesModels(accessToken, options)
	};
}
export { buildChutesProvider, buildStaticChutesProvider };
