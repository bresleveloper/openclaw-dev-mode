import { r as isDeepSeekV4ModelId } from "./.setup/models-D843Tvyg.mjs";
//#region extensions/deepseek/thinking.ts
const DEEPSEEK_V4_THINKING_PROFILE = {
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
function resolveDeepSeekV4ThinkingProfile(modelId) {
	return isDeepSeekV4ModelId(modelId) ? DEEPSEEK_V4_THINKING_PROFILE : void 0;
}
//#endregion
export { resolveDeepSeekV4ThinkingProfile };
