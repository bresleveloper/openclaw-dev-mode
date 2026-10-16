import { n as normalizeAgentModelMapForConfig, r as normalizeAgentModelRefForConfig } from "./model-input-C9K4a_6k.mjs";
//#region src/plugins/provider-model-primary.ts
/** Applies a primary model to agent defaults while preserving model fallback metadata. */
function applyPrimaryModel(cfg, model, opts) {
	const normalizedModel = normalizeAgentModelRefForConfig(model);
	const models = { ...normalizeAgentModelMapForConfig(cfg.agents?.defaults?.models ?? {}) };
	models[normalizedModel] = models[normalizedModel] ?? {};
	const existingModel = cfg.agents?.defaults?.model;
	const existingPrimary = typeof existingModel === "string" ? existingModel : typeof existingModel === "object" ? existingModel?.primary : void 0;
	const normalizedExistingPrimary = existingPrimary ? normalizeAgentModelRefForConfig(existingPrimary) : void 0;
	const existingFallbacks = typeof existingModel === "object" ? existingModel?.fallbacks?.map(normalizeAgentModelRefForConfig) : void 0;
	return {
		...cfg,
		agents: {
			...cfg.agents,
			defaults: {
				...cfg.agents?.defaults,
				models,
				model: {
					...existingFallbacks ? { fallbacks: existingFallbacks } : void 0,
					primary: opts?.preserveExistingPrimary === true ? normalizedExistingPrimary ?? normalizedModel : normalizedModel
				}
			}
		}
	};
}
//#endregion
export { applyPrimaryModel as t };
