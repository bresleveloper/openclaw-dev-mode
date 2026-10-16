import { h as normalizeOllamaCloudModelId } from "./defaults-Dkg1KktH.mjs";
//#region extensions/ollama/src/model-reasoning.ts
const OLLAMA_CLOUD_FULL_THINKING_EFFORT_MODEL_IDS = /* @__PURE__ */ new Set([
	"deepseek-v4-flash",
	"deepseek-v4-pro",
	"deepseek-v4.1-flash",
	"glm-5.2",
	"glm-5.3",
	"glm-5.3-flash",
	"kimi-k3"
]);
function supportsOllamaCloudFullThinkingEffort(modelId) {
	return OLLAMA_CLOUD_FULL_THINKING_EFFORT_MODEL_IDS.has(normalizeOllamaCloudModelId(modelId));
}
const OLLAMA_CLOUD_THINKING_FLOOR_MODEL_IDS = /* @__PURE__ */ new Set(["glm-5.3", "glm-5.3-flash"]);
function applyOllamaThinkingFloor(payload, modelId) {
	if (typeof payload !== "object" || payload === null || !("think" in payload) || payload.think !== false || !OLLAMA_CLOUD_THINKING_FLOOR_MODEL_IDS.has(normalizeOllamaCloudModelId(modelId))) return payload;
	return {
		...payload,
		think: "low"
	};
}
//#endregion
export { supportsOllamaCloudFullThinkingEffort as n, applyOllamaThinkingFloor as t };
