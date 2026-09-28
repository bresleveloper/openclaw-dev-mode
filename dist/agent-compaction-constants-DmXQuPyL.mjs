//#region src/agents/agent-compaction-constants.ts
const MAX_COMPACTION_RESERVE_RATIO = .25;
/** Caps compaction headroom so prompts retain at least three quarters of the model window. */
function resolveEffectiveCompactionReserveTokens(params) {
	const contextTokenBudget = Math.max(1, Math.floor(params.contextTokenBudget));
	return Math.min(Math.max(0, Math.floor(params.reserveTokens)), Math.floor(contextTokenBudget * MAX_COMPACTION_RESERVE_RATIO));
}
//#endregion
export { resolveEffectiveCompactionReserveTokens as t };
