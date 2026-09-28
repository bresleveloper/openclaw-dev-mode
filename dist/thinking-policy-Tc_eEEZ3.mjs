import { r as normalizeProviderId } from "./provider-id-DCtsDflE.mjs";
import "./provider-model-metadata-GUXZiNxy.mjs";
//#region extensions/vllm/thinking-policy.ts
const VLLM_BINARY_THINKING_PROFILE = {
	levels: [{ id: "off" }, {
		id: "low",
		label: "on"
	}],
	defaultLevel: "off"
};
function resolveVllmQwenThinkingFormatFromCompat(compat) {
	switch (compat?.thinkingFormat) {
		case "qwen-chat-template": return "chat-template";
		case "qwen": return "top-level";
		default: return;
	}
}
function isVllmNemotronThinkingModel(modelId) {
	return /\bnemotron-3(?:[-_](?:nano|super|ultra))?\b/i.test(modelId);
}
function resolveThinkingProfile(ctx) {
	if (normalizeProviderId(ctx.provider) !== "vllm" || ctx.reasoning === false) return null;
	if (resolveVllmQwenThinkingFormatFromCompat(ctx.compat) || ctx.reasoning === true && isVllmNemotronThinkingModel(ctx.modelId)) return VLLM_BINARY_THINKING_PROFILE;
	return null;
}
//#endregion
export { resolveThinkingProfile as n, resolveVllmQwenThinkingFormatFromCompat as r, isVllmNemotronThinkingModel as t };
