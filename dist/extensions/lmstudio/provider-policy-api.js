import { i as normalizeLmstudioTransportReasoningCompat } from "../../model-reasoning-BBtIgenw.mjs";
//#region extensions/lmstudio/provider-policy-api.ts
/** LM Studio serves operator-hosted inference, including networked model hosts. */
function resolveToolSearchMode() {
	return "tools";
}
/** Normalize saved reasoning metadata without activating provider runtime or changing transport. */
function normalizeConfig({ provider, providerConfig }) {
	if (provider.trim().toLowerCase() !== "lmstudio" || !Array.isArray(providerConfig.models)) return providerConfig;
	const models = providerConfig.models.map((model) => {
		const compat = model.compat;
		if (!compat || typeof compat !== "object" || Array.isArray(compat)) return model;
		const normalized = normalizeLmstudioTransportReasoningCompat(compat);
		return normalized === compat ? model : {
			...model,
			compat: normalized
		};
	});
	return models.some((model, index) => model !== providerConfig.models[index]) ? {
		...providerConfig,
		models
	} : providerConfig;
}
//#endregion
export { normalizeConfig, resolveToolSearchMode };
