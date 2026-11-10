import { c as OLLAMA_DEFAULT_COST, m as normalizeOllamaCloudModelId, s as OLLAMA_DEFAULT_CONTEXT_WINDOW } from "./defaults-CDpC0pZy.mjs";
//#region extensions/ollama/src/model-reasoning.ts
const OLLAMA_THINKING_EFFORTS = [
	"minimal",
	"low",
	"medium",
	"high",
	"xhigh",
	"max"
];
function readOllamaThinkingMapValue(value) {
	return value === "false" ? false : value === "true" ? true : OLLAMA_THINKING_EFFORTS.find((effort) => effort === value);
}
/** Prepare native wire values once, inside the discovery/cache lifecycle. */
async function buildOllamaThinkingLevelMap(modelId, thinking) {
	if (!thinking || typeof thinking !== "object" || !("values" in thinking) || !Array.isArray(thinking.values)) return;
	const values = thinking.values;
	const levels = ["off", ...OLLAMA_THINKING_EFFORTS];
	const nativeMap = Object.fromEntries(levels.map((level) => [level, level === "off" ? values.includes(false) ? "false" : null : values.includes(level) ? level : level === "low" && values.includes(true) ? "true" : null]));
	if (!Object.values(nativeMap).some((value) => value !== null)) return;
	const { clampThinkingLevel } = await import("./plugin-sdk/llm.js");
	const model = {
		id: modelId,
		name: modelId,
		provider: "ollama",
		api: "ollama",
		baseUrl: "",
		reasoning: true,
		input: ["text"],
		cost: OLLAMA_DEFAULT_COST,
		contextWindow: OLLAMA_DEFAULT_CONTEXT_WINDOW,
		maxTokens: OLLAMA_DEFAULT_CONTEXT_WINDOW,
		thinkingLevelMap: nativeMap
	};
	return {
		...Object.fromEntries(levels.map((level) => [level, nativeMap[clampThinkingLevel(model, level)]])),
		minimal: nativeMap.minimal,
		xhigh: nativeMap.xhigh
	};
}
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
function applyOllamaThinkingFloor(payload, model) {
	if (typeof payload !== "object" || payload === null || !("think" in payload) || payload.think !== false) return payload;
	const floor = readOllamaThinkingMapValue(model.thinkingLevelMap?.off) ?? (OLLAMA_CLOUD_THINKING_FLOOR_MODEL_IDS.has(normalizeOllamaCloudModelId(model.id)) ? "low" : false);
	return floor === false ? payload : {
		...payload,
		think: floor
	};
}
//#endregion
//#region extensions/ollama/src/provider-base-url.ts
function resolveOllamaBaseUrlForRun(params) {
	return params.providerBaseUrl?.trim() || params.modelBaseUrl?.trim() || "http://127.0.0.1:11434";
}
function readProviderBaseUrl(provider) {
	if (!provider) return;
	if (Object.hasOwn(provider, "baseUrl") && typeof provider.baseUrl === "string" && provider.baseUrl.trim()) return provider.baseUrl.trim();
	const alternate = provider;
	if (Object.hasOwn(alternate, "baseURL") && typeof alternate.baseURL === "string" && alternate.baseURL.trim()) return alternate.baseURL.trim();
}
//#endregion
export { readOllamaThinkingMapValue as a, buildOllamaThinkingLevelMap as i, resolveOllamaBaseUrlForRun as n, supportsOllamaCloudFullThinkingEffort as o, applyOllamaThinkingFloor as r, readProviderBaseUrl as t };
