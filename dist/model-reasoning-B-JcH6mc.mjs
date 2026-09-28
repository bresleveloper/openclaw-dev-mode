import { h as normalizeOllamaCloudModelId } from "./defaults-Dkg1KktH.mjs";
//#region extensions/ollama/src/model-reasoning.ts
function supportsOllamaCloudFullThinkingEffort(modelId) {
	const normalized = normalizeOllamaCloudModelId(modelId);
	return normalized === "glm-5.2" || /^deepseek-v4-(?:flash|pro)$/.test(normalized);
}
//#endregion
export { supportsOllamaCloudFullThinkingEffort as t };
