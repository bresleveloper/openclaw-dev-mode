import { n as normalizeLowercaseStringOrEmpty } from "../string-coerce-fsri9iCu.mjs";
//#region packages/ai/src/internal/google-model-family.ts
function isGoogleGemini3ProModel(modelId) {
	const normalized = normalizeLowercaseStringOrEmpty(modelId);
	return /(?:^|\/)gemini-(?:3(?:\.\d+)?-pro|pro-latest)(?:-|$)/.test(normalized);
}
function isGoogleGemini3FlashModel(modelId) {
	const normalized = normalizeLowercaseStringOrEmpty(modelId);
	return /(?:^|\/)gemini-(?:3(?:\.\d+)?-flash|flash(?:-lite)?-latest)(?:-|$)/.test(normalized);
}
function isGoogleGemini3ThinkingLevelModel(modelId) {
	return isGoogleGemini3ProModel(modelId) || isGoogleGemini3FlashModel(modelId);
}
//#endregion
export { isGoogleGemini3FlashModel, isGoogleGemini3ProModel, isGoogleGemini3ThinkingLevelModel };
