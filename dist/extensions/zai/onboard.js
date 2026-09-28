import { c as buildZaiCatalogModels, o as ZAI_DEFAULT_MODEL_ID, r as ZAI_CODING_DEFAULT_MODEL_ID, u as resolveZaiBaseUrl } from "./.setup/model-definitions-GiWvkL3t.mjs";
import { normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
import { applyProviderConfigWithModelCatalogPreset, applyProviderConnectionConfig } from "openclaw/plugin-sdk/provider-onboard";
//#region extensions/zai/onboard.ts
const ZAI_DEFAULT_MODEL_REF = `zai/${ZAI_DEFAULT_MODEL_ID}`;
function resolveZaiPresetBaseUrl(cfg, endpoint) {
	const existingProvider = cfg.models?.providers?.zai;
	const existingBaseUrl = normalizeOptionalString(existingProvider?.baseUrl) ?? "";
	return endpoint ? resolveZaiBaseUrl(endpoint) : existingBaseUrl || resolveZaiBaseUrl();
}
function resolveZaiModelId(params) {
	const explicitModelId = normalizeOptionalString(params?.modelId);
	if (explicitModelId) return explicitModelId;
	const baseUrl = normalizeOptionalString(params?.baseUrl)?.replace(/\/+$/, "");
	return params?.endpoint?.startsWith("coding-") || baseUrl === "https://api.z.ai/api/coding/paas/v4" || baseUrl === "https://open.bigmodel.cn/api/coding/paas/v4" ? ZAI_CODING_DEFAULT_MODEL_ID : ZAI_DEFAULT_MODEL_ID;
}
function applyZaiPreset(cfg, params, primaryModelRef, applyPreset = applyProviderConfigWithModelCatalogPreset) {
	const baseUrl = resolveZaiPresetBaseUrl(cfg, params?.endpoint);
	const modelRef = `zai/${resolveZaiModelId({
		...params,
		baseUrl
	})}`;
	return applyPreset(cfg, {
		providerId: "zai",
		api: "openai-completions",
		baseUrl,
		catalogModels: buildZaiCatalogModels,
		aliases: [{
			modelRef,
			alias: "GLM"
		}],
		primaryModelRef
	});
}
function applyZaiProviderConfig(cfg, params) {
	return applyZaiPreset(cfg, params);
}
function applyZaiConfig(cfg, params) {
	const baseUrl = resolveZaiPresetBaseUrl(cfg, params?.endpoint);
	const modelId = resolveZaiModelId({
		...params,
		baseUrl
	});
	return applyZaiPreset(cfg, params, modelId === ZAI_DEFAULT_MODEL_ID ? ZAI_DEFAULT_MODEL_REF : `zai/${modelId}`);
}
function applyZaiProviderConnectionConfig(cfg, params) {
	return applyZaiPreset(cfg, params, void 0, applyProviderConnectionConfig);
}
function applyZaiConnectionConfig(cfg, params) {
	const baseUrl = resolveZaiPresetBaseUrl(cfg, params?.endpoint);
	return applyZaiPreset(cfg, params, `zai/${resolveZaiModelId({
		...params,
		baseUrl
	})}`, applyProviderConnectionConfig);
}
//#endregion
export { ZAI_DEFAULT_MODEL_REF, applyZaiConfig, applyZaiConnectionConfig, applyZaiProviderConfig, applyZaiProviderConnectionConfig, resolveZaiModelId };
