import { r as normalizeProviderId } from "./provider-id-D1VImdKk.mjs";
import "./provider-model-metadata-DkObn07R.mjs";
import { i as resolveEffortThinkingProfile } from "./provider-thinking-runtime-DlkIARoV.mjs";
//#region extensions/vllm/thinking-policy.ts
const VLLM_BINARY_THINKING_PROFILE = {
	levels: [{ id: "off" }, {
		id: "low",
		label: "on"
	}],
	defaultLevel: "off"
};
function resolveVllmEffortProfile(model) {
	const { compat } = model;
	const efforts = compat?.supportedReasoningEfforts?.map((effort) => effort.trim()).filter(Boolean);
	if (compat?.supportsReasoningEffort === false || !efforts?.length) return;
	const mappedLevels = Object.entries({
		...model.thinkingLevelMap,
		...compat?.reasoningEffortMap
	}).filter(([, effort]) => typeof effort === "string" && efforts.includes(effort.trim())).map(([level]) => level.trim().toLowerCase());
	const profile = resolveEffortThinkingProfile([...efforts, ...mappedLevels]);
	return profile?.levels.some(({ id }) => id !== "off") ? {
		...profile,
		defaultLevel: "off"
	} : void 0;
}
function resolveVllmQwenThinkingFormatFromCompat(compat) {
	switch (compat?.thinkingFormat) {
		case "qwen-chat-template": return "chat-template";
		case "qwen": return "top-level";
		default: return;
	}
}
function isVllmNemotronThinkingModel(modelId) {
	return /nemotron-3(?:[-_](?:nano|super|ultra))?\b/i.test(modelId);
}
function resolveThinkingProfile(ctx) {
	if (normalizeProviderId(ctx.provider) !== "vllm" || ctx.reasoning === false) return null;
	if (resolveVllmQwenThinkingFormatFromCompat(ctx.compat)) return resolveVllmEffortProfile(ctx) ?? VLLM_BINARY_THINKING_PROFILE;
	if (ctx.reasoning === true && isVllmNemotronThinkingModel(ctx.modelId)) return VLLM_BINARY_THINKING_PROFILE;
	return null;
}
//#endregion
export { resolveVllmQwenThinkingFormatFromCompat as i, resolveThinkingProfile as n, resolveVllmEffortProfile as r, isVllmNemotronThinkingModel as t };
