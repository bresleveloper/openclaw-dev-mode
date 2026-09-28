import { t as isXaiProviderId } from "./provider-id-dn9RuxC0.mjs";
//#region extensions/xai/fast-mode.ts
const XAI_FAST_MODEL_IDS = /* @__PURE__ */ new Map([
	["grok-3", "grok-3-fast"],
	["grok-3-mini", "grok-3-mini-fast"],
	["grok-4", "grok-4-fast"],
	["grok-4-0709", "grok-4-fast"]
]);
function resolveXaiFastModelId(model) {
	return (model.api === "openai-completions" || model.api === "openai-responses") && isXaiProviderId(model.provider) ? XAI_FAST_MODEL_IDS.get(model.id.trim()) : void 0;
}
//#endregion
export { resolveXaiFastModelId as t };
