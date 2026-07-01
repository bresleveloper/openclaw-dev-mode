import "./provider-catalog-t2PVXir0.js";
//#region extensions/xiaomi/thinking.ts
const MIMO_REASONING_MODEL_IDS = new Set([
	"mimo-v2-pro",
	"mimo-v2-omni",
	"mimo-v2.5",
	"mimo-v2.5-pro",
	"mimo-v2.6-pro"
]);
function isMiMoReasoningModelId(modelId) {
	return MIMO_REASONING_MODEL_IDS.has(modelId.toLowerCase());
}
function isMiMoProviderId(providerId) {
	return providerId === "xiaomi" || providerId === "xiaomi-token-plan";
}
function isMiMoReasoningModelRef(model) {
	return isMiMoProviderId(model.provider) && typeof model.id === "string" && isMiMoReasoningModelId(model.id);
}
const MIMO_THINKING_PROFILE = {
	levels: [
		"off",
		"minimal",
		"low",
		"medium",
		"high",
		"xhigh",
		"max"
	].map((id) => ({ id })),
	defaultLevel: "high"
};
function resolveMiMoThinkingProfile(modelId) {
	return isMiMoReasoningModelId(modelId) ? MIMO_THINKING_PROFILE : void 0;
}
//#endregion
export { resolveMiMoThinkingProfile as i, isMiMoReasoningModelId as n, isMiMoReasoningModelRef as r, isMiMoProviderId as t };
