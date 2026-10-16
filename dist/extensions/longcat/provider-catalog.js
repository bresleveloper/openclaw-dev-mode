import { t as openclaw_plugin_default } from "./.setup/openclaw.plugin-Bv6LEgMG.mjs";
import { buildManifestModelProviderConfig } from "openclaw/plugin-sdk/provider-catalog-shared";
//#region extensions/longcat/provider-catalog.ts
function buildLongCatProvider() {
	return buildManifestModelProviderConfig({
		providerId: "longcat",
		catalog: openclaw_plugin_default.modelCatalog.providers.longcat
	});
}
//#endregion
export { buildLongCatProvider };
