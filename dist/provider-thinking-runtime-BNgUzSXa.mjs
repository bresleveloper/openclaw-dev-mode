import { n as MODEL_CATALOG_THINKING_LEVELS } from "./model-catalog-types-BUOf2O4u.mjs";
import { isGoogleGemini3FlashModel as isGoogleGemini3FlashModel$1, isGoogleGemini3ProModel as isGoogleGemini3ProModel$1, isGoogleGemini3ThinkingLevelModel as isGoogleGemini3ThinkingLevelModel$1 } from "@openclaw/ai/internal/google-model-family";
//#region src/plugin-sdk/provider-thinking-runtime.ts
function resolveEffortThinkingProfile(efforts) {
	if (!efforts || efforts.length === 0) return;
	const acceptedLevelIds = /* @__PURE__ */ new Set(["off", ...efforts.map((effort) => effort === "none" ? "off" : effort)]);
	return {
		levels: MODEL_CATALOG_THINKING_LEVELS.filter((id) => acceptedLevelIds.has(id)).map((id) => ({ id })),
		defaultLevel: acceptedLevelIds.has("medium") ? "medium" : acceptedLevelIds.has("high") ? "high" : acceptedLevelIds.has("low") ? "low" : "off"
	};
}
//#endregion
export { resolveEffortThinkingProfile as i, isGoogleGemini3ProModel$1 as n, isGoogleGemini3ThinkingLevelModel$1 as r, isGoogleGemini3FlashModel$1 as t };
