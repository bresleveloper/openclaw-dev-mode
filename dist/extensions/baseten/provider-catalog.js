import { o as buildStaticBasetenModels, t as BASETEN_BASE_URL } from "./.setup/models-BOkRtUeP.mjs";
//#region extensions/baseten/provider-catalog.ts
function buildStaticBasetenProvider() {
	return {
		baseUrl: BASETEN_BASE_URL,
		api: "openai-completions",
		models: buildStaticBasetenModels()
	};
}
//#endregion
export { buildStaticBasetenProvider };
