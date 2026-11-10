import { r as resolveAgentAssistantTurnId } from "./tool-execution-context-BwYF5HLu.mjs";
import { i as extractToolAuthoredSourceReplyPayload } from "./embedded-agent-messaging-extraction-DjEst-db.mjs";
//#region src/agents/embedded-agent-tool-authored-source-reply.ts
/** Capture of replies authored by `canDeliverSourceReply` tools. */
/**
* Reads the final reply a `canDeliverSourceReply` tool authored and keys it to its
* tool call. The host delivers the payload and writes its transcript row after a
* successful send, so nothing is persisted here. Callers must already have verified
* the tool's capability, that the result is not an error, and that the call is a
* direct model call rather than a nested program call. Returns undefined when the
* result carries no deliverable reply.
*/
function captureToolAuthoredSourceReply(params) {
	const extracted = extractToolAuthoredSourceReplyPayload(params.result);
	if (!extracted) return;
	return {
		...extracted,
		idempotencyKey: extracted.idempotencyKey ?? `${params.idempotencyScope}:tool-source-reply:${params.toolCallId}`,
		sourceReplyFinal: true,
		toolAuthored: true,
		toolAuthoredForToolCallId: params.toolCallId
	};
}
/** Matches the final assistant for one input, never an attempt-wide presence flag. */
function isToolAuthoredSourceReplyForAssistant(payload, assistant) {
	return payload.toolAuthored === true && Boolean(assistant && assistant.stopReason !== "error" && assistant.stopReason !== "aborted" && (payload.toolAuthoredForTurnId ? payload.toolAuthoredForTurnId === resolveAgentAssistantTurnId(assistant) : assistant.content.some((block) => block.type === "toolCall" && block.id === payload.toolAuthoredForToolCallId)));
}
//#endregion
export { isToolAuthoredSourceReplyForAssistant as n, captureToolAuthoredSourceReply as t };
