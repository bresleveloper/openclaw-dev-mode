import { t as modelCatalog } from "./.setup/openclaw.plugin-BRaVociw.mjs";
import { DEEPINFRA_BASE_URL } from "./media-models.js";
import { buildManifestModelProviderConfig } from "openclaw/plugin-sdk/provider-model-metadata";
//#region extensions/deepinfra/provider-static-catalog.ts
const DEEPINFRA_MANIFEST_PROVIDER = buildManifestModelProviderConfig({
	providerId: "deepinfra",
	catalog: modelCatalog.providers.deepinfra
});
const DEEPINFRA_DEFAULT_MODEL_REF = `deepinfra/deepseek-ai/DeepSeek-V4-Flash`;
const DEEPINFRA_MODEL_CATALOG = DEEPINFRA_MANIFEST_PROVIDER.models;
function resolveDeepInfraThinkingFormat(modelId) {
	return (modelId ?? "").toLowerCase().split("/")[0] === "deepseek-ai" ? "deepseek" : void 0;
}
function buildDeepInfraModelDefinition(model) {
	const thinkingFormat = model.compat?.thinkingFormat ?? resolveDeepInfraThinkingFormat(model.id);
	return {
		...model,
		compat: {
			...model.compat,
			supportsUsageInStreaming: model.compat?.supportsUsageInStreaming ?? true,
			...thinkingFormat ? { thinkingFormat } : {}
		}
	};
}
function buildStaticDeepInfraProvider() {
	return {
		baseUrl: DEEPINFRA_BASE_URL,
		api: "openai-completions",
		models: DEEPINFRA_MODEL_CATALOG.map(buildDeepInfraModelDefinition)
	};
}
//#endregion
export { DEEPINFRA_DEFAULT_MODEL_REF, DEEPINFRA_MODEL_CATALOG, buildDeepInfraModelDefinition, buildStaticDeepInfraProvider };
