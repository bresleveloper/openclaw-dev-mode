import { t as openclaw_plugin_default } from "./.setup/openclaw.plugin-DHgrttkQ.mjs";
import { buildManifestModelProviderConfig } from "openclaw/plugin-sdk/provider-catalog-shared";
// extensions/mistral/provider-catalog.ts
function buildMistralProvider() {
	return buildManifestModelProviderConfig({
		providerId: "mistral",
		catalog: openclaw_plugin_default.modelCatalog.providers.mistral
	});
}
export { buildMistralProvider };
