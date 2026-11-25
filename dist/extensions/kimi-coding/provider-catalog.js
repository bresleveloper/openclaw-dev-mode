import { t as openclaw_plugin_default } from "./.setup/openclaw.plugin-IIHLKnoD.mjs";
import { buildManifestModelProviderConfig } from "openclaw/plugin-sdk/provider-catalog-shared";
// extensions/kimi-coding/provider-catalog.ts
const KIMI_PROVIDER_ID = "kimi";
const KIMI_CODING_CATALOG = openclaw_plugin_default.modelCatalog.providers.kimi;
const KIMI_MODEL_ALIASES = new Map(Object.entries(openclaw_plugin_default.modelIdNormalization.providers.kimi.aliases));
const KIMI_CODING_BASE_URL = KIMI_CODING_CATALOG.baseUrl;
const KIMI_CODING_DEFAULT_MODEL_ID = KIMI_CODING_CATALOG.defaultModel;
const KIMI_CODING_LEGACY_MODEL_IDS = ["kimi-code", "k2p5"];
function buildKimiCodingProvider() {
	return buildManifestModelProviderConfig({
		providerId: KIMI_PROVIDER_ID,
		catalog: KIMI_CODING_CATALOG
	});
}
function normalizeKimiCodingModelId(modelId) {
	return KIMI_MODEL_ALIASES.get(modelId) ?? modelId;
}
export { KIMI_CODING_BASE_URL, KIMI_CODING_DEFAULT_MODEL_ID, KIMI_CODING_LEGACY_MODEL_IDS, buildKimiCodingProvider, normalizeKimiCodingModelId };
