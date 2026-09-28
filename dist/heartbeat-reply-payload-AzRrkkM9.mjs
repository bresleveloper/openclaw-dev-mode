import { s as getReplyPayloadMetadata } from "./reply-payload-B2ZQhznY.mjs";
import { a as hasOutboundReplyContent, s as isReasoningReplyPayload } from "./reply-payload-RBmrGrXG.mjs";
//#region src/auto-reply/heartbeat-reply-payload.ts
/** Resolve structured terminal tool-failure state carried by an agent reply. */
function resolveHeartbeatTerminalToolFailure(replyResult) {
	if (!replyResult) return;
	const payloads = Array.isArray(replyResult) ? replyResult : [replyResult];
	for (let idx = payloads.length - 1; idx >= 0; idx -= 1) {
		const payload = payloads[idx];
		if (!payload) continue;
		const failure = getReplyPayloadMetadata(payload)?.heartbeatTerminalToolFailure;
		if (failure) return failure;
	}
}
/**
* Pick the last outbound-capable reply payload for heartbeat delivery.
*
* Reasoning payloads are skipped using the shared SDK classifier
* `isReasoningReplyPayload`, which recognizes the `isReasoning` flag plus the
* common reasoning/thinking text prefixes (including lowercased and Markdown
* blockquoted forms). Heartbeat delivery keeps separate reasoning payloads
* internal; without this guard, a trailing reasoning payload (which reasoning
* models can emit after the final answer) would be selected as the visible
* heartbeat reply.
*/
function resolveHeartbeatReplyPayload(replyResult) {
	if (!replyResult) return;
	if (!Array.isArray(replyResult)) return isReasoningReplyPayload(replyResult) ? void 0 : replyResult;
	for (let idx = replyResult.length - 1; idx >= 0; idx -= 1) {
		const payload = replyResult[idx];
		if (!payload) continue;
		if (isReasoningReplyPayload(payload)) continue;
		if (hasOutboundReplyContent(payload)) return payload;
	}
}
//#endregion
export { resolveHeartbeatTerminalToolFailure as n, resolveHeartbeatReplyPayload as t };
