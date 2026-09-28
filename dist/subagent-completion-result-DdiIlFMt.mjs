import { a as selectDeliverableSessionsReply } from "./sessions-send-tokens-Dy3kgMtK.mjs";
//#region src/agents/subagents/completion/subagent-completion-result.ts
/** Selects the canonical operator-visible result from captured completion state. */
function resolveSubagentCompletionResultText(entry) {
	const terminalReply = entry.completion?.terminalReply;
	if (terminalReply) return terminalReply.disposition === "visible" ? terminalReply.text : void 0;
	const primary = entry.completion?.resultText;
	const fallback = entry.completion?.fallbackResultText;
	if (entry.execution.outcome?.status === "ok") return selectDeliverableSessionsReply(primary, fallback);
	return primary?.trim() || fallback?.trim() || void 0;
}
//#endregion
export { resolveSubagentCompletionResultText as t };
