import { n as buildManifestModelProviderConfig } from "./provider-catalog-shared-D_YliG-V.js";
import { t as modelCatalog } from "./openclaw.plugin-Ca6Sljk7.js";
//#region extensions/byteplus/models.ts
/**
* BytePlus model catalog helpers derived from the plugin manifest.
*/
const BYTEPLUS_MANIFEST_PROVIDER = buildManifestModelProviderConfig({
	providerId: "byteplus",
	catalog: modelCatalog.providers.byteplus
});
const BYTEPLUS_CODING_MANIFEST_PROVIDER = buildManifestModelProviderConfig({
	providerId: "byteplus-plan",
	catalog: modelCatalog.providers["byteplus-plan"]
});
/** Base URL for BytePlus chat/model APIs from the manifest catalog. */
const BYTEPLUS_BASE_URL = BYTEPLUS_MANIFEST_PROVIDER.baseUrl;
/** Base URL for BytePlus Plan coding APIs from the manifest catalog. */
const BYTEPLUS_CODING_BASE_URL = BYTEPLUS_CODING_MANIFEST_PROVIDER.baseUrl;
/** BytePlus general model catalog entries. */
const BYTEPLUS_MODEL_CATALOG = BYTEPLUS_MANIFEST_PROVIDER.models;
/** BytePlus coding/planning model catalog entries. */
const BYTEPLUS_CODING_MODEL_CATALOG = BYTEPLUS_CODING_MANIFEST_PROVIDER.models;
/** Clones one manifest model definition so callers can mutate safely. */
function buildBytePlusModelDefinition(entry) {
	return {
		...entry,
		input: [...entry.input],
		cost: { ...entry.cost }
	};
}
//#endregion
export { buildBytePlusModelDefinition as a, BYTEPLUS_MODEL_CATALOG as i, BYTEPLUS_CODING_BASE_URL as n, BYTEPLUS_CODING_MODEL_CATALOG as r, BYTEPLUS_BASE_URL as t };
