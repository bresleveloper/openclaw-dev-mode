import { a as hasBillableUsage, c as hasRecordedUsageCost, t as USAGE_COST_COMPONENTS } from "./usage-XXLoqJQC.mjs";
//#region src/agents/embedded-agent-runner/usage-accumulator.ts
/**
* Accumulates per-call token usage and monetary totals across embedded runs.
*/
const createUsageAccumulator = () => ({
	input: 0,
	output: 0,
	cacheRead: 0,
	cacheWrite: 0,
	cacheWrite1h: 0,
	reasoningTokens: 0,
	total: 0,
	cost: void 0,
	assistantTurns: 0
});
const mergeUsageIntoAccumulator = (target, usage) => {
	if (!hasBillableUsage(usage)) return;
	const callTotal = usage.total ?? (usage.input ?? 0) + (usage.output ?? 0) + (usage.cacheRead ?? 0) + (usage.cacheWrite ?? 0);
	if (usage.cacheRead !== void 0) target.cacheReadReported = true;
	if (usage.cacheWrite !== void 0) target.cacheWriteReported = true;
	target.input += usage.input ?? 0;
	target.output += usage.output ?? 0;
	target.cacheRead += usage.cacheRead ?? 0;
	target.cacheWrite += usage.cacheWrite ?? 0;
	target.cacheWrite1h += usage.cacheWrite1h ?? 0;
	target.reasoningTokens += usage.reasoningTokens ?? 0;
	target.total += callTotal;
	if (target.cost === "unavailable" || !usage.cost) {
		target.cost = "unavailable";
		return;
	}
	const cost = { total: (target.cost?.total ?? 0) + usage.cost.total };
	if (usage.cost.totalOrigin === "provider-billed" && (!target.cost || target.cost.totalOrigin === "provider-billed")) cost.totalOrigin = "provider-billed";
	if (cost.total === 0 && hasRecordedUsageCost(usage.cost) && (!target.cost || hasRecordedUsageCost(target.cost))) for (const key of USAGE_COST_COMPONENTS) {
		const component = (target.cost?.[key] ?? 0) + (usage.cost[key] ?? 0);
		if (component !== 0) cost[key] = component;
	}
	target.cost = cost;
};
/**
* Folds one attempt's run stats into the accumulator. Attempt cleanup clears
* the per-attempt tool-search catalog, so retries would otherwise discard
* earlier bridge counts and undercount the documented cumulative run totals.
*/
const mergeAttemptRunStatsIntoAccumulator = (target, attempt) => {
	target.assistantTurns += attempt.assistantTurns ?? 0;
	if (!attempt.bridgeCalls) return;
	const bridgeCalls = target.bridgeCalls ?? {
		search: 0,
		describe: 0,
		call: 0
	};
	bridgeCalls.search += attempt.bridgeCalls.search;
	bridgeCalls.describe += attempt.bridgeCalls.describe;
	bridgeCalls.call += attempt.bridgeCalls.call;
	target.bridgeCalls = bridgeCalls;
};
const toNormalizedUsage = (usage) => {
	const hasUsage = usage.input > 0 || usage.output > 0 || usage.cacheRead > 0 || usage.cacheWrite > 0 || usage.reasoningTokens > 0 || usage.total > 0;
	const cost = usage.cost === "unavailable" ? void 0 : usage.cost;
	if (!hasUsage && !cost) return;
	const derivedTotal = usage.input + usage.output + usage.cacheRead + usage.cacheWrite;
	return {
		input: usage.input || void 0,
		output: usage.output || void 0,
		cacheRead: usage.cacheReadReported ? usage.cacheRead : usage.cacheRead || void 0,
		cacheWrite: usage.cacheWriteReported ? usage.cacheWrite : usage.cacheWrite || void 0,
		...usage.cacheWrite1h > 0 ? { cacheWrite1h: usage.cacheWrite1h } : {},
		...usage.reasoningTokens > 0 ? { reasoningTokens: usage.reasoningTokens } : {},
		total: usage.total || derivedTotal || void 0,
		...cost ? { cost: { ...cost } } : {}
	};
};
//#endregion
export { toNormalizedUsage as i, mergeAttemptRunStatsIntoAccumulator as n, mergeUsageIntoAccumulator as r, createUsageAccumulator as t };
