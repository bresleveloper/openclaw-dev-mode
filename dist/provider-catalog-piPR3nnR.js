import { n as buildManifestModelProviderConfig } from "./provider-catalog-shared-D_YliG-V.js";
import { t as modelCatalog } from "./openclaw.plugin-Ca6Sljk7.js";
//#region extensions/byteplus/provider-catalog.ts
/**
* BytePlus model provider builders backed by the plugin manifest catalog.
*/
/** Builds the standard BytePlus model provider config. */
function buildBytePlusProvider() {
	return buildManifestModelProviderConfig({
		providerId: "byteplus",
		catalog: modelCatalog.providers.byteplus
	});
}
/** Builds the BytePlus Plan coding-provider config. */
function buildBytePlusCodingProvider() {
	return buildManifestModelProviderConfig({
		providerId: "byteplus-plan",
		catalog: modelCatalog.providers["byteplus-plan"]
	});
}
//#endregion
export { buildBytePlusProvider as n, buildBytePlusCodingProvider as t };
