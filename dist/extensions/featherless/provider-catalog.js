import { c as FEATHERLESS_DYNAMIC_MAX_TOKENS, d as openclaw_plugin_default, i as FEATHERLESS_DEFAULT_MODEL_ID, o as FEATHERLESS_DYNAMIC_COMPAT, s as FEATHERLESS_DYNAMIC_CONTEXT_WINDOW, t as FEATHERLESS_BASE_URL, u as isFeatherlessCatalogModelId } from "./.setup/models-J3WOft2N.mjs";
import { buildManifestModelProviderConfig } from "openclaw/plugin-sdk/provider-catalog-shared";
//#region extensions/featherless/provider-catalog.ts
function buildFeatherlessProvider() {
	return buildManifestModelProviderConfig({
		providerId: "featherless",
		catalog: openclaw_plugin_default.modelCatalog.providers.featherless
	});
}
//#endregion
export { FEATHERLESS_BASE_URL, FEATHERLESS_DEFAULT_MODEL_ID, FEATHERLESS_DYNAMIC_COMPAT, FEATHERLESS_DYNAMIC_CONTEXT_WINDOW, FEATHERLESS_DYNAMIC_MAX_TOKENS, buildFeatherlessProvider, isFeatherlessCatalogModelId };
