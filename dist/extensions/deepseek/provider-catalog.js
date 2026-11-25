import { DEEPSEEK_BASE_URL, DEEPSEEK_MODEL_CATALOG } from "./models.js";
// extensions/deepseek/provider-catalog.ts
function buildDeepSeekProvider() {
	return {
		baseUrl: DEEPSEEK_BASE_URL,
		api: "openai-completions",
		models: DEEPSEEK_MODEL_CATALOG
	};
}
export { buildDeepSeekProvider };
