import { i as resolveEffortThinkingProfile } from "./provider-thinking-runtime-BjDyROFK.mjs";
import { t as isOpenRouterDeepSeekV4ModelId } from "./models-DFeYq0pM.mjs";
//#region extensions/openrouter/thinking-policy.ts
const OPENROUTER_DEEPSEEK_V4_THINKING_PROFILE = {
	levels: [
		"off",
		"minimal",
		"low",
		"medium",
		"high",
		"xhigh"
	].map((id) => ({ id })),
	defaultLevel: "high"
};
function resolveOpenRouterThinkingProfile(modelId, context) {
	if (context?.compat?.supportsReasoningEffort === false || context?.compat?.supportedReasoningEfforts?.length === 0) return { levels: context?.thinkingLevelMap?.off === null ? [{
		id: "low",
		label: "always on"
	}] : [{ id: "off" }, {
		id: "low",
		label: "on"
	}] };
	const profile = resolveEffortThinkingProfile(context?.compat?.supportedReasoningEfforts);
	if (profile) {
		const levels = profile.levels.filter((level) => level.id !== "off" || context?.thinkingLevelMap?.off !== null);
		return {
			levels,
			...levels.some((level) => level.id === profile.defaultLevel) ? { defaultLevel: profile.defaultLevel } : {}
		};
	}
	return isOpenRouterDeepSeekV4ModelId(modelId) ? OPENROUTER_DEEPSEEK_V4_THINKING_PROFILE : void 0;
}
//#endregion
export { resolveOpenRouterThinkingProfile as t };
