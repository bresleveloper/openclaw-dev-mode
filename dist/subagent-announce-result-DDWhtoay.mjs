import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { o as isSilentReplyText } from "./tokens-BTKQYTUd.mjs";
import { a as readSessionTranscriptRunId, s as resolveTerminalAssistantTranscriptRunId } from "./transcript-events-DukKauix.mjs";
import "./subagent-lifecycle-events-CDQCTuLB.mjs";
import { t as resolveSubagentCompletionResultText } from "./subagent-completion-result-DdiIlFMt.mjs";
import { r as wrapPromptDataBlock } from "./sanitize-for-prompt-bzCyHFCH.mjs";
import { t as extractStoredAssistantText } from "./chat-history-text-ZJR9s0Sl.mjs";
//#region src/agents/subagents/announce/subagent-announce-result.ts
/** Exact-run final answer reads for subagent completion announcements. */
const MAX_CHILD_COMPLETION_FIELD_CHARS = 256;
function captureAnnounceResultAuthority(child) {
	const { runId, childSessionKey } = child;
	const terminalReply = child.completion?.terminalReply;
	const outcome = child.execution.outcome;
	const target = child.execution.transcriptTarget;
	const targetIdentity = target ? { ...target } : void 0;
	return () => {
		const currentTarget = child.execution.transcriptTarget;
		return child.runId === runId && child.childSessionKey === childSessionKey && child.completion?.terminalReply === terminalReply && child.execution.outcome === outcome && currentTarget === target && currentTarget?.sessionId === targetIdentity?.sessionId && currentTarget?.agentId === targetIdentity?.agentId && currentTarget?.storePath === targetIdentity?.storePath;
	};
}
function isVisibleSubagentResultEventForRun(event, runId) {
	if (!isRecord(event) || !isRecord(event.message) || readSessionTranscriptRunId(event.message) !== runId || resolveTerminalAssistantTranscriptRunId(event.message, runId) === void 0) return false;
	const mirror = event.message.openclawDeliveryMirror;
	if (isRecord(mirror) && mirror.kind === "message-tool-source-reply" && mirror.final !== true) return false;
	const text = extractStoredAssistantText(event.message);
	return Boolean(text?.trim()) && !isSilentReplyText(text, "NO_REPLY");
}
/** Read the final assistant message from the transcript identity owned by this run. */
async function readSubagentRunAnnounceResultUsing(child, deps) {
	const isCurrent = captureAnnounceResultAuthority(child);
	const terminalReply = child.completion?.terminalReply;
	if (terminalReply?.disposition !== "visible" || child.execution.outcome?.status !== "ok") return {
		text: resolveSubagentCompletionResultText(child),
		isCurrent
	};
	const runId = child.runId;
	const childSessionKey = child.childSessionKey;
	const target = child.execution.transcriptTarget;
	const agentId = target?.agentId ?? deps.resolveAgentIdFromSessionKey(childSessionKey);
	const storePath = target?.storePath ?? deps.resolveSessionStorePathCore(deps.getRuntimeConfig().session?.store, { agentId });
	const sessionKey = target?.sessionKey ?? childSessionKey;
	const sessionId = target?.sessionId ?? deps.readSubagentSessionEntry(storePath, sessionKey)?.sessionId;
	const scope = {
		agentId,
		storePath,
		sessionKey
	};
	const matchesRun = (event) => isVisibleSubagentResultEventForRun(event, runId);
	let event = (sessionId ? await deps.findTranscriptEvent({
		...scope,
		sessionId
	}, matchesRun) : void 0)?.event;
	if (!event) event = (await deps.findSessionTranscriptArchiveEventReadOnly({
		...scope,
		sessionId
	}, runId))?.event;
	if (!isCurrent()) throw new Error("The completed child run's transcript identity changed during announcement.");
	const answer = isRecord(event) ? extractStoredAssistantText(event.message) : void 0;
	if (!answer) return {
		text: `[truncated-by-retention: complete child answer unavailable]\n${terminalReply.text}`,
		isCurrent
	};
	return {
		text: answer,
		isCurrent
	};
}
function describeSubagentOutcome(child) {
	const outcome = child.execution.outcome;
	if (child.endedReason === "subagent-killed") {
		const error = outcome?.error?.trim();
		return error ? `cancelled: ${error}` : "cancelled";
	}
	if (!outcome) return "unknown";
	if (outcome.status === "ok") return "ok";
	if (outcome.status === "timeout" || outcome.status === "error") {
		const error = outcome.error?.trim();
		return error ? `${outcome.status}: ${error}` : outcome.status;
	}
	return "unknown";
}
function formatChildResultData(resultText) {
	return wrapPromptDataBlock({
		label: "Child result",
		text: resultText?.trim() || "(no output)"
	}) || "Child result: (no output)";
}
function truncateChildCompletionField(value) {
	return value.length > MAX_CHILD_COMPLETION_FIELD_CHARS ? `${truncateUtf16Safe(value, 255)}…` : value;
}
function hasCapturedChildCompletionReply(child) {
	return Boolean(child.completion?.terminalReply || child.completion?.resultText?.trim() || child.completion?.fallbackResultText?.trim());
}
function buildChildCompletionFindings(children) {
	const sorted = [...children].toSorted((a, b) => {
		if (a.createdAt !== b.createdAt) return a.createdAt - b.createdAt;
		const aEnded = typeof a.execution.endedAt === "number" ? a.execution.endedAt : Number.MAX_SAFE_INTEGER;
		const bEnded = typeof b.execution.endedAt === "number" ? b.execution.endedAt : Number.MAX_SAFE_INTEGER;
		if (aEnded !== bEnded) return aEnded - bEnded;
		return a.childSessionKey < b.childSessionKey ? -1 : a.childSessionKey > b.childSessionKey ? 1 : 0;
	});
	const sections = [];
	for (const [index, child] of sorted.entries()) {
		const resultText = child.announceResult ?? resolveSubagentCompletionResultText(child);
		const outcome = describeSubagentOutcome(child);
		if (child.execution.outcome?.status === "ok" && !resultText && hasCapturedChildCompletionReply(child)) continue;
		const title = child.taskName?.trim() || child.label?.trim() || child.task.trim() || child.childSessionKey.trim() || `child ${index + 1}`;
		const displayIndex = sections.length + 1;
		sections.push([
			wrapPromptDataBlock({
				label: `${displayIndex}. Child task`,
				text: title,
				maxEscapedChars: MAX_CHILD_COMPLETION_FIELD_CHARS,
				truncationMarker: "…"
			}),
			`status: ${truncateChildCompletionField(outcome)}`,
			formatChildResultData(resultText)
		].join("\n"));
	}
	if (sections.length === 0) return;
	return [
		"Child completion results:",
		"",
		...sections
	].join("\n\n");
}
//#endregion
export { isVisibleSubagentResultEventForRun as n, readSubagentRunAnnounceResultUsing as r, buildChildCompletionFindings as t };
