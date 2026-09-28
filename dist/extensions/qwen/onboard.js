import { S as QWEN_STANDARD_GLOBAL_BASE_URL, T as QWEN_TOKEN_PLAN_DEFAULT_MODEL_REF, h as QWEN_CN_BASE_URL, k as QWEN_TOKEN_PLAN_PROVIDER_ID, q as resolveQwenTokenPlanBaseUrl, v as QWEN_DEFAULT_MODEL_REF, x as QWEN_STANDARD_CN_BASE_URL, y as QWEN_GLOBAL_BASE_URL } from "./.setup/models-DIZ7f-Lx.mjs";
import { buildQwenProvider, buildQwenTokenPlanProvider } from "./provider-catalog.js";
import { createModelCatalogPresetAppliers } from "openclaw/plugin-sdk/provider-onboard";
//#region extensions/qwen/onboard.ts
const qwenPresetAppliers = createModelCatalogPresetAppliers({
	primaryModelRef: QWEN_DEFAULT_MODEL_REF,
	resolveParams: (cfg, baseUrl) => {
		const provider = buildQwenProvider({ baseUrl });
		return {
			providerId: "qwen",
			api: provider.api ?? "openai-completions",
			baseUrl,
			catalogModels: cfg.models?.mode === "replace" ? provider.models ?? [] : [],
			aliases: [...(provider.models ?? []).flatMap((model) => [`qwen/${model.id}`, `modelstudio/${model.id}`]), {
				modelRef: QWEN_DEFAULT_MODEL_REF,
				alias: "Qwen"
			}]
		};
	}
});
const qwenTokenPlanPresetAppliers = createModelCatalogPresetAppliers({
	primaryModelRef: QWEN_TOKEN_PLAN_DEFAULT_MODEL_REF,
	resolveParams: (cfg, baseUrl) => {
		const provider = buildQwenTokenPlanProvider({ baseUrl });
		return {
			providerId: QWEN_TOKEN_PLAN_PROVIDER_ID,
			api: provider.api ?? "openai-completions",
			baseUrl,
			catalogModels: cfg.models?.mode === "replace" ? provider.models ?? [] : [],
			aliases: [...(provider.models ?? []).map((model) => `${QWEN_TOKEN_PLAN_PROVIDER_ID}/${model.id}`), {
				modelRef: QWEN_TOKEN_PLAN_DEFAULT_MODEL_REF,
				alias: "Qwen Token Plan"
			}]
		};
	}
});
function applyQwenConfig(cfg) {
	return qwenPresetAppliers.applyConfig(cfg, QWEN_GLOBAL_BASE_URL);
}
function applyQwenConfigCn(cfg) {
	return qwenPresetAppliers.applyConfig(cfg, QWEN_CN_BASE_URL);
}
function applyQwenStandardConfig(cfg) {
	return qwenPresetAppliers.applyConfig(cfg, QWEN_STANDARD_GLOBAL_BASE_URL);
}
function applyQwenStandardConfigCn(cfg) {
	return qwenPresetAppliers.applyConfig(cfg, QWEN_STANDARD_CN_BASE_URL);
}
function applyQwenTokenPlanConfig(cfg, region) {
	return qwenTokenPlanPresetAppliers.applyConfig(cfg, resolveQwenTokenPlanBaseUrl(region));
}
//#endregion
export { applyQwenConfig, applyQwenConfigCn, applyQwenStandardConfig, applyQwenStandardConfigCn, applyQwenTokenPlanConfig };
