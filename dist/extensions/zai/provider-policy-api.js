import { normalizeLowercaseStringOrEmpty } from "openclaw/plugin-sdk/string-coerce-runtime";
//#region extensions/zai/provider-policy-api.ts
const ZAI_REASONING_EFFORT_MAPS = {
	"5.2": {
		low: "high",
		medium: "high",
		high: "high",
		adaptive: "high",
		xhigh: "max",
		max: "max"
	},
	"5.3": {
		off: "low",
		minimal: "low",
		low: "low",
		medium: "high",
		high: "high",
		xhigh: "max",
		adaptive: "max",
		max: "max"
	}
};
function resolveGlmReasoningEffortVersion(modelId) {
	const normalized = normalizeLowercaseStringOrEmpty(modelId);
	if (normalized.startsWith("glm-5.3")) return "5.3";
	return normalized.startsWith("glm-5.2") ? "5.2" : void 0;
}
function resolveZaiReasoningEffort(modelId, thinkingLevel) {
	const version = resolveGlmReasoningEffortVersion(modelId);
	return version && thinkingLevel ? ZAI_REASONING_EFFORT_MAPS[version][thinkingLevel] : void 0;
}
function resolveThinkingProfile(ctx) {
	const version = resolveGlmReasoningEffortVersion(ctx.modelId);
	if (version === "5.3") return {
		levels: [
			{
				id: "low",
				label: "low"
			},
			{
				id: "high",
				label: "high"
			},
			{
				id: "max",
				label: "max"
			}
		],
		defaultLevel: "max"
	};
	if (version === "5.2") return {
		levels: [
			{
				id: "off",
				label: "off"
			},
			{
				id: "low",
				label: "low"
			},
			{
				id: "high",
				label: "high"
			},
			{
				id: "max",
				label: "max"
			}
		],
		defaultLevel: "off"
	};
	return {
		levels: [{
			id: "off",
			label: "off"
		}, {
			id: "low",
			label: "on"
		}],
		defaultLevel: "off"
	};
}
//#endregion
export { resolveThinkingProfile, resolveZaiReasoningEffort };
