import { a as isGpt5ModelId, c as resolveGpt5SystemPromptContribution, s as resolveGpt5PromptOverlayMode } from "./gpt5-prompt-overlay-BWi_VFCL.mjs";
import "./provider-model-metadata-GUXZiNxy.mjs";
//#region extensions/openai/prompt-overlay.ts
const OPENAI_PROVIDER_IDS = /* @__PURE__ */ new Set(["openai"]);
function resolveOpenAIPromptOverlayMode(pluginConfig) {
	return resolveGpt5PromptOverlayMode(void 0, pluginConfig);
}
function shouldApplyOpenAIPromptOverlay(params) {
	return OPENAI_PROVIDER_IDS.has(params.modelProviderId ?? "") && isGpt5ModelId(params.modelId);
}
function resolveOpenAISystemPromptContribution(params) {
	return resolveGpt5SystemPromptContribution({
		config: params.config,
		legacyPluginConfig: params.mode === void 0 ? params.legacyPluginConfig : { personality: params.mode },
		modelId: params.modelId,
		trigger: params.trigger,
		enabled: shouldApplyOpenAIPromptOverlay({
			modelProviderId: params.modelProviderId,
			modelId: params.modelId
		})
	});
}
//#endregion
export { resolveOpenAISystemPromptContribution as n, resolveOpenAIPromptOverlayMode as t };
