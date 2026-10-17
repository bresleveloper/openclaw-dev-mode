import { _ as resolveOpenAIReasoningEffortMapping, g as resolveOpenAIModelReasoningEfforts, h as resolveOpenAIReasoningEffortMap } from "./llm-BoijNIT8.mjs";
import { c as selectSupportedReasoningEffort } from "./agent-harness-attempt-runtime-CuLbs8yz.mjs";
//#region extensions/agentsapi/agentsapi-reasoning.ts
function resolveAgentsApiReasoningEffort(params) {
	if (params.thinkLevel === "ultra") throw new Error("Agents API MVP does not support the ultra delegation mode");
	if (params.thinkLevel === "adaptive") return;
	const supportedEfforts = resolveOpenAIModelReasoningEfforts(params.model);
	const modelMapped = params.model.thinkingLevelMap?.[params.thinkLevel];
	if (!params.model.reasoning || supportedEfforts?.length === 0 || modelMapped === null) return;
	const effort = (resolveOpenAIReasoningEffortMapping(params.thinkLevel, resolveOpenAIReasoningEffortMap(params.model)) ?? modelMapped)?.trim() ?? (params.thinkLevel === "off" ? "none" : params.thinkLevel);
	switch (effort) {
		case "none": return supportedEfforts?.includes("none") ? effort : void 0;
		case "minimal":
		case "low":
		case "medium":
		case "high":
		case "xhigh":
		case "max": return supportedEfforts === void 0 ? effort : selectSupportedReasoningEffort({
			requested: effort,
			supportedEfforts,
			effortOrder: [
				"minimal",
				"low",
				"medium",
				"high",
				"xhigh",
				"max"
			]
		});
		default: throw new Error(`Agents API does not support reasoning effort ${effort}`);
	}
}
//#endregion
export { resolveAgentsApiReasoningEffort as t };
