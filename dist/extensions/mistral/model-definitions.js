import { n as openclaw_plugin_default, t as buildMistralProvider } from "./.setup/provider-catalog-DV4UQ-rA.mjs";
import { readManifestProviderDefaultModelRef } from "openclaw/plugin-sdk/provider-catalog-shared";
const MISTRAL_BASE_URL = openclaw_plugin_default.modelCatalog.providers.mistral.baseUrl;
const MISTRAL_DEFAULT_MODEL_REF = readManifestProviderDefaultModelRef(openclaw_plugin_default, "mistral");
const MISTRAL_DEFAULT_MODEL_ID = MISTRAL_DEFAULT_MODEL_REF.slice(8);
function buildMistralModelDefinition() {
	const model = buildMistralProvider().models.find((entry) => entry.id === MISTRAL_DEFAULT_MODEL_ID);
	if (!model) throw new Error(`Missing Mistral provider model ${MISTRAL_DEFAULT_MODEL_ID}`);
	return model;
}
//#endregion
export { MISTRAL_BASE_URL, MISTRAL_DEFAULT_MODEL_ID, MISTRAL_DEFAULT_MODEL_REF, buildMistralModelDefinition };
