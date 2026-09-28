import { o as buildStaticBasetenModels, t as BASETEN_BASE_URL } from "./.setup/models-CwKDnNIj.mjs";
//#region extensions/baseten/provider-catalog.ts
/** Builds Baseten's network-free fallback provider catalog. */
function buildStaticBasetenProvider() {
	return {
		baseUrl: BASETEN_BASE_URL,
		api: "openai-completions",
		models: buildStaticBasetenModels()
	};
}
//#endregion
export { buildStaticBasetenProvider };
