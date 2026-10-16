//#region src/agents/ultra-orchestration.ts
/** Run-scoped Ultra guidance shared by host harnesses; tools remain policy-owned. */
function buildProactiveSubagentOrchestrationSection(params) {
	if (!params.enabled) return [];
	return [
		params.hasSessionsSpawn ? "## Proactive Sub-Agent Orchestration" : "## Ultra Execution",
		"Ultra active for this turn. Plan the work, carry it through, and verify the result before replying.",
		...params.hasSessionsSpawn ? [
			"Use `sessions_spawn` when independent work improves speed/quality.",
			"- Parallelize independent investigation, implementation, verification.",
			"- Simple/tightly coupled stays local.",
			"- Give bounded objectives; synthesize results before replying."
		] : [],
		""
	];
}
//#endregion
export { buildProactiveSubagentOrchestrationSection as t };
