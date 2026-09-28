import { n as openclaw_plugin_default, t as buildMetaProvider } from "./.setup/provider-catalog-Br7h254v.mjs";
//#region extensions/meta/models.ts
const META_MANIFEST_CATALOG = openclaw_plugin_default.modelCatalog.providers["meta"];
/** Base URL for Meta OpenAI-compatible inference. */
const META_BASE_URL = META_MANIFEST_CATALOG.baseUrl;
/** Meta model catalog entries from the plugin manifest. */
const META_MODEL_CATALOG = META_MANIFEST_CATALOG.models;
/** Builds normalized Meta catalog model definitions. */
function buildMetaCatalogModels() {
	return buildMetaProvider().models;
}
//#endregion
export { META_BASE_URL, META_MODEL_CATALOG, buildMetaCatalogModels };
