import { t as openclaw_plugin_default } from "./.setup/openclaw.plugin-Bi0KIJRp.mjs";
import { MOONSHOT_BASE_URL, MOONSHOT_CN_BASE_URL, isNativeMoonshotBaseUrl } from "./provider-policy-api.js";
import { buildManifestModelProviderConfig, readManifestProviderDefaultModelRef } from "openclaw/plugin-sdk/provider-catalog-shared";
// extensions/moonshot/provider-catalog.ts
const MOONSHOT_DEFAULT_MODEL_REF = readManifestProviderDefaultModelRef(openclaw_plugin_default, "moonshot");
const MOONSHOT_DEFAULT_MODEL_ID = MOONSHOT_DEFAULT_MODEL_REF.slice(9);
function buildMoonshotProvider() {
	return buildManifestModelProviderConfig({
		providerId: "moonshot",
		catalog: openclaw_plugin_default.modelCatalog.providers.moonshot
	});
}
export { MOONSHOT_BASE_URL, MOONSHOT_CN_BASE_URL, MOONSHOT_DEFAULT_MODEL_ID, MOONSHOT_DEFAULT_MODEL_REF, buildMoonshotProvider, isNativeMoonshotBaseUrl };
