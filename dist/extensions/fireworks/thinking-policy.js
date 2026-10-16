import { isFireworksKimiModelId } from "./model-id.js";
//#region extensions/fireworks/thinking-policy.ts
const FIREWORKS_KIMI_THINKING_PROFILE = {
	levels: [{ id: "off" }],
	defaultLevel: "off"
};
function resolveFireworksThinkingProfile(modelId) {
	return isFireworksKimiModelId(modelId) ? FIREWORKS_KIMI_THINKING_PROFILE : void 0;
}
//#endregion
export { resolveFireworksThinkingProfile };
