import { s as buildStaticBasetenModels, t as BASETEN_BASE_URL } from "./.setup/models-B0xCZcxx.mjs";
// extensions/baseten/provider-catalog.ts
function buildStaticBasetenProvider() {
	return {
		baseUrl: BASETEN_BASE_URL,
		api: "openai-completions",
		models: buildStaticBasetenModels()
	};
}
export { buildStaticBasetenProvider };
