import { t as openclaw_plugin_default } from "./.setup/openclaw.plugin-Dpq7k0_2.mjs";
import { buildManifestModelProviderConfig } from "openclaw/plugin-sdk/provider-catalog-shared";
// extensions/longcat/models.ts
const LONGCAT_MANIFEST_PROVIDER = buildManifestModelProviderConfig({
	providerId: "longcat",
	catalog: openclaw_plugin_default.modelCatalog.providers.longcat
});
const LONGCAT_BASE_URL = LONGCAT_MANIFEST_PROVIDER.baseUrl;
const LONGCAT_MODEL_CATALOG = LONGCAT_MANIFEST_PROVIDER.models;
const LONGCAT_DEFAULT_MODEL_ID = "LongCat-2.0";
const LONGCAT_DEFAULT_MODEL_REF = `longcat/${LONGCAT_DEFAULT_MODEL_ID}`;
export { LONGCAT_BASE_URL, LONGCAT_DEFAULT_MODEL_ID, LONGCAT_DEFAULT_MODEL_REF, LONGCAT_MODEL_CATALOG };
