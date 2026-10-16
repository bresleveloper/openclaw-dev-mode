import { r as calculateCost } from "./llm--QylqK5V.mjs";
import { l as makeZeroUsageSnapshot, u as normalizeUsage } from "./usage-XmAH1cfG.mjs";
import "./agent-harness-runtime-BxShxpgh.mjs";
import "./agent-harness-attempt-runtime-Dv3UHbll.mjs";
//#region extensions/agentsapi/agentsapi-usage.ts
function aggregateAgentsApiUsage(model, contributions) {
	const usage = makeAgentsApiZeroUsage();
	let observed = false;
	let reasoningTokens;
	for (const normalized of contributions) {
		observed = true;
		usage.input += normalized.input ?? 0;
		usage.output += normalized.output ?? 0;
		usage.cacheRead += normalized.cacheRead ?? 0;
		usage.cacheWrite += normalized.cacheWrite ?? 0;
		usage.totalTokens += normalized.total ?? (normalized.input ?? 0) + (normalized.output ?? 0) + (normalized.cacheRead ?? 0) + (normalized.cacheWrite ?? 0);
		if (normalized.reasoningTokens !== void 0) reasoningTokens = (reasoningTokens ?? 0) + normalized.reasoningTokens;
	}
	if (observed) {
		calculateCost(model, usage);
		return {
			usage: {
				...normalizeUsage(usage),
				...reasoningTokens !== void 0 ? { reasoningTokens } : {}
			},
			assistantUsage: usage
		};
	}
	return {
		usage: { contextUsage: { state: "unavailable" } },
		assistantUsage: usage
	};
}
function makeAgentsApiZeroUsage() {
	return {
		...makeZeroUsageSnapshot(),
		contextUsage: { state: "unavailable" }
	};
}
//#endregion
export { makeAgentsApiZeroUsage as n, aggregateAgentsApiUsage as t };
