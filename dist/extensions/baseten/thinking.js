import { l as usesBasetenChatTemplateThinking } from "./.setup/models-BOkRtUeP.mjs";
//#region extensions/baseten/thinking.ts
const BASETEN_BINARY_THINKING_PROFILE = {
	levels: [{ id: "off" }, {
		id: "low",
		label: "on"
	}],
	defaultLevel: "off"
};
const BASETEN_GLM_52_THINKING_PROFILE = {
	levels: [
		{ id: "off" },
		{ id: "high" },
		{ id: "max" }
	],
	defaultLevel: "off"
};
const BASETEN_DEEPSEEK_THINKING_PROFILE = { levels: [
	{ id: "off" },
	{ id: "low" },
	{ id: "high" },
	{ id: "max" }
] };
const BASETEN_DEEPSEEK_V41_THINKING_PROFILE = {
	...BASETEN_DEEPSEEK_THINKING_PROFILE,
	defaultLevel: "high"
};
/** Exposes only the thinking levels that Baseten actually accepts for opt-in models. */
function resolveBasetenThinkingProfile(modelId) {
	const normalized = modelId.trim().toLowerCase();
	if (normalized === "deepseek-ai/deepseek-v4.1-flash") return BASETEN_DEEPSEEK_V41_THINKING_PROFILE;
	if (normalized === "deepseek-ai/deepseek-v4-pro-0813") return BASETEN_DEEPSEEK_THINKING_PROFILE;
	if (normalized === "zai-org/glm-5.2" || normalized === "zai-org/glm-5.2-fast") return BASETEN_GLM_52_THINKING_PROFILE;
	return usesBasetenChatTemplateThinking(normalized) ? BASETEN_BINARY_THINKING_PROFILE : void 0;
}
//#endregion
export { resolveBasetenThinkingProfile };
