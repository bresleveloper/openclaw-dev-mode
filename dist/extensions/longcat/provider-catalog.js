import { t as openclaw_plugin_default } from "./.setup/openclaw.plugin-Dpq7k0_2.mjs";
import { buildManifestModelProviderConfig } from "openclaw/plugin-sdk/provider-catalog-shared";
// extensions/longcat/provider-catalog.ts
function buildLongCatProvider() {
	return buildManifestModelProviderConfig({
		providerId: "longcat",
		catalog: openclaw_plugin_default.modelCatalog.providers.longcat
	});
}
export { buildLongCatProvider };
