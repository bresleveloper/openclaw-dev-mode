import { n as HEARTBEAT_TOKEN, r as SILENT_REPLY_TOKEN, s as isSilentReplyText } from "./tokens-D4ghQG_g.mjs";
//#region src/agents/tools/sessions-send-tokens.ts
const NON_DELIVERABLE_REPLY_TOKENS = [SILENT_REPLY_TOKEN, HEARTBEAT_TOKEN];
function isNonDeliverableSessionsReply(text) {
	return NON_DELIVERABLE_REPLY_TOKENS.some((token) => isSilentReplyText(text, token));
}
/** Selects a deliverable reply while allowing NO_REPLY to use captured fallback output. */
function selectDeliverableSessionsReply(primary, fallback) {
	const primaryReply = primary?.trim();
	if (primaryReply && !isNonDeliverableSessionsReply(primaryReply)) return primaryReply;
	if (primaryReply && !isSilentReplyText(primaryReply, "NO_REPLY")) return;
	const fallbackReply = fallback?.trim();
	return fallbackReply && !isNonDeliverableSessionsReply(fallbackReply) ? fallbackReply : void 0;
}
//#endregion
//#region src/agents/subagents/completion/subagent-completion-result.ts
function resolveSubagentCompletionResultText(entry) {
	const terminalReply = entry.completion?.terminalReply;
	if (terminalReply) {
		if (terminalReply.disposition !== "visible") return;
		return entry.execution.outcome?.status === "ok" ? selectDeliverableSessionsReply(terminalReply.text) : terminalReply.text;
	}
	const primary = entry.completion?.resultText;
	const fallback = entry.completion?.fallbackResultText;
	if (entry.execution.outcome?.status === "ok") return selectDeliverableSessionsReply(primary, fallback);
	return primary?.trim() || fallback?.trim() || void 0;
}
//#endregion
export { isNonDeliverableSessionsReply as n, selectDeliverableSessionsReply as r, resolveSubagentCompletionResultText as t };
