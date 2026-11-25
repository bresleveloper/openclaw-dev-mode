import { t as openclaw_plugin_default } from "./.setup/openclaw.plugin-CE_cMy1x.mjs";
import { buildManifestModelProviderConfig } from "openclaw/plugin-sdk/provider-catalog-shared";
// extensions/deepseek/models.ts
const DEEPSEEK_MANIFEST_CATALOG = openclaw_plugin_default.modelCatalog.providers.deepseek;
const DEEPSEEK_BASE_URL = DEEPSEEK_MANIFEST_CATALOG.baseUrl;
const DEEPSEEK_MODEL_CATALOG = buildManifestModelProviderConfig({
	providerId: "deepseek",
	catalog: DEEPSEEK_MANIFEST_CATALOG
}).models.map((model) => Object.assign(model, { api: "openai-completions" }));
const DEEPSEEK_V4_MODEL_IDS = new Set(DEEPSEEK_MODEL_CATALOG.map((model) => model.id));
function isDeepSeekV4ModelId(modelId) {
	return DEEPSEEK_V4_MODEL_IDS.has(modelId.toLowerCase());
}
function isDeepSeekV4ModelRef(model) {
	return model.provider === "deepseek" && isDeepSeekV4ModelId(model.id);
}
export { DEEPSEEK_BASE_URL, DEEPSEEK_MODEL_CATALOG, isDeepSeekV4ModelId, isDeepSeekV4ModelRef };
