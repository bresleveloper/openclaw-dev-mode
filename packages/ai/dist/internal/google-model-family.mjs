import { r as normalizeLowercaseStringOrEmpty } from "../string-coerce-Cj8sqWHx.mjs";
//#region packages/ai/src/internal/google-model-family.ts
function isGoogleGemini3ProModel(modelId) {
	const normalized = normalizeLowercaseStringOrEmpty(modelId);
	return /(?:^|\/)gemini-(?:3(?:\.\d+)?-pro|pro-latest)(?:-|$)/.test(normalized);
}
function isGoogleGemini3FlashModel(modelId) {
	const normalized = normalizeLowercaseStringOrEmpty(modelId);
	return /(?:^|\/)gemini-(?:3(?:\.\d+)?-flash|flash(?:-lite)?-latest)(?:-|$)/.test(normalized);
}
function isGoogleGemini4Model(modelId) {
	return /(?:^|\/)gemini-4(?:[-.]|$)/.test(normalizeLowercaseStringOrEmpty(modelId));
}
/** Identifies thinkingLevel-family Gemini models (3.x and 4). */
function isGoogleGemini3ThinkingLevelModel(modelId) {
	return isGoogleGemini3ProModel(modelId) || isGoogleGemini3FlashModel(modelId) || isGoogleGemini4Model(modelId);
}
//#endregion
export { isGoogleGemini3FlashModel, isGoogleGemini3ProModel, isGoogleGemini3ThinkingLevelModel, isGoogleGemini4Model };
