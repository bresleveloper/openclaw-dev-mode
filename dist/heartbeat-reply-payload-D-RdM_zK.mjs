import { c as getReplyPayloadMetadata } from "./reply-payload-NzglYOOT.mjs";
import { a as hasOutboundReplyContent, s as isReasoningReplyPayload } from "./reply-payload-DEDOYf-L.mjs";
//#region src/auto-reply/heartbeat-reply-payload.ts
/** Resolve structured terminal tool-failure state carried by an agent reply. */
function resolveHeartbeatTerminalToolFailure(replyResult) {
	if (!replyResult) return;
	const payload = (Array.isArray(replyResult) ? replyResult : [replyResult]).findLast((entry) => entry && getReplyPayloadMetadata(entry)?.heartbeatTerminalToolFailure);
	return payload ? getReplyPayloadMetadata(payload)?.heartbeatTerminalToolFailure : void 0;
}
/**
* Pick the last outbound-capable reply, excluding flagged and text-prefixed reasoning.
* Scalar replies intentionally need no outbound-content check.
*/
function resolveHeartbeatReplyPayload(replyResult) {
	if (!replyResult) return;
	if (!Array.isArray(replyResult)) return isReasoningReplyPayload(replyResult) ? void 0 : replyResult;
	return replyResult.findLast((payload) => payload && !isReasoningReplyPayload(payload) && hasOutboundReplyContent(payload));
}
//#endregion
export { resolveHeartbeatTerminalToolFailure as n, resolveHeartbeatReplyPayload as t };
