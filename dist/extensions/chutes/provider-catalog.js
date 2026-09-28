import { n as CHUTES_MODEL_CATALOG, r as discoverChutesModels, t as CHUTES_BASE_URL } from "./.setup/models-mjZNwTpp.mjs";
//#region extensions/chutes/provider-catalog.ts
/** Builds the static Chutes provider catalog from bundled model metadata. */
function buildStaticChutesProvider() {
	return {
		baseUrl: CHUTES_BASE_URL,
		api: "openai-completions",
		models: structuredClone(CHUTES_MODEL_CATALOG)
	};
}
/**
* Build the Chutes provider with dynamic model discovery.
* Accepts an optional access token (API key or OAuth access token) for authenticated discovery.
*/
async function buildChutesProvider(accessToken, options = {}) {
	return {
		baseUrl: CHUTES_BASE_URL,
		api: "openai-completions",
		models: await discoverChutesModels(accessToken, options)
	};
}
//#endregion
export { buildChutesProvider, buildStaticChutesProvider };
