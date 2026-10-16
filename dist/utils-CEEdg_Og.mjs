import { s as resolveProviderThinkingLevel } from "./thinking-DK1cFezU.mjs";
//#region src/agents/embedded-agent-runner/utils.ts
function normalizeContextTokenBudget(value) {
	return typeof value === "number" && Number.isFinite(value) && value > 0 ? Math.floor(value) : void 0;
}
/** Converts logical product modes into provider-facing effort values. */
function mapThinkingLevelForProvider(level, model) {
	return resolveProviderThinkingLevel({
		provider: model.provider,
		model: model.id,
		catalog: [model],
		agentRuntime: "openclaw",
		level
	});
}
function mapThinkingLevel(providerLevel) {
	return providerLevel === "adaptive" ? "high" : providerLevel || "off";
}
//#endregion
export { mapThinkingLevelForProvider as n, normalizeContextTokenBudget as r, mapThinkingLevel as t };
