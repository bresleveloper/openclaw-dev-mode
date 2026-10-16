import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
//#region src/shared/model-key.ts
/** Join provider and model into the canonical provider/model key. */
function modelKey(provider, model) {
	const providerId = provider.trim();
	const modelId = model.trim();
	if (!providerId) return modelId;
	if (!modelId) return providerId;
	return normalizeLowercaseStringOrEmpty(modelId).startsWith(`${normalizeLowercaseStringOrEmpty(providerId)}/`) ? modelId : `${providerId}/${modelId}`;
}
//#endregion
export { modelKey as t };
