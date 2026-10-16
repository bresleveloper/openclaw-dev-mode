import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
//#region src/agents/model-selection-display.ts
/**
* Formats selected model references for UI/session display.
*/
/** Resolves the most specific provider/model ref for display. */
function resolveModelDisplayRef(params) {
	for (const [modelKey, providerKey] of [["runtimeModel", "runtimeProvider"], ["overrideModel", "overrideProvider"]]) {
		const model = normalizeOptionalString(params[modelKey]);
		const provider = normalizeOptionalString(params[providerKey]);
		if (model) return provider && !model.includes("/") ? `${provider}/${model}` : model;
		if (provider) return provider;
	}
	return normalizeOptionalString(params.fallbackModel);
}
/** Resolves the model name shown in compact status output. */
function resolveModelDisplayName(params) {
	const modelRef = resolveModelDisplayRef(params);
	if (!modelRef) return "model n/a";
	const slash = modelRef.lastIndexOf("/");
	if (slash >= 0 && slash < modelRef.length - 1) return modelRef.slice(slash + 1);
	return modelRef;
}
/** Resolves session-info model selection from entry, override, and fallback data. */
function resolveSessionInfoModelSelection(params) {
	const fallbackProvider = normalizeOptionalString(params.currentProvider) ?? normalizeOptionalString(params.defaultProvider);
	const fallbackModel = normalizeOptionalString(params.currentModel) ?? normalizeOptionalString(params.defaultModel);
	if (params.entryProvider !== void 0 || params.entryModel !== void 0) return {
		modelProvider: normalizeOptionalString(params.entryProvider) ?? fallbackProvider,
		model: normalizeOptionalString(params.entryModel) ?? fallbackModel
	};
	const overrideModel = normalizeOptionalString(params.overrideModel);
	if (overrideModel) return {
		modelProvider: normalizeOptionalString(params.overrideProvider) || fallbackProvider,
		model: overrideModel
	};
	return {
		modelProvider: fallbackProvider,
		model: fallbackModel
	};
}
//#endregion
export { resolveModelDisplayRef as n, resolveSessionInfoModelSelection as r, resolveModelDisplayName as t };
