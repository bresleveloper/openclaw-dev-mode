import { l as usesBasetenChatTemplateThinking } from "./.setup/models-CwKDnNIj.mjs";
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
/** Exposes only the thinking levels that Baseten actually accepts for opt-in models. */
function resolveBasetenThinkingProfile(modelId) {
	const normalized = modelId.trim().toLowerCase();
	if (normalized === "zai-org/glm-5.2" || normalized === "zai-org/glm-5.2-fast") return BASETEN_GLM_52_THINKING_PROFILE;
	return usesBasetenChatTemplateThinking(normalized) ? BASETEN_BINARY_THINKING_PROFILE : void 0;
}
//#endregion
export { resolveBasetenThinkingProfile };
