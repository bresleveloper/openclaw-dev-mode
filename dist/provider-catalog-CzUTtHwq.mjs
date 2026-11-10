import { n as buildManifestModelProviderConfig } from "./provider-catalog-D0GOHaAj.mjs";
import "./provider-catalog-shared-Di2nlF3g.mjs";
import { t as openclaw_plugin_default } from "./openclaw.plugin-D5sHRK8Y.mjs";
//#region extensions/together/provider-catalog.ts
function buildTogetherProvider() {
	return buildManifestModelProviderConfig({
		providerId: "together",
		catalog: openclaw_plugin_default.modelCatalog.providers.together
	});
}
//#endregion
export { buildTogetherProvider as t };
