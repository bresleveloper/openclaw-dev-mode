import { a as asOptionalRecord } from "./record-coerce-DItp3I4t.mjs";
import { r as readTranscriptMessageIdempotencyKey, t as attachOpenClawTranscriptMeta } from "./session-transcript-entry-message-COJ0koI7.mjs";
import { p as resolveCurrentUserProfileDisplay } from "./session-identity-projection-Bz5hvxHJ.mjs";
import { i as projectChatDisplayMessage, n as createCurrentUserProfileMessageProjector, o as projectChatDisplayMessagesWithState } from "./chat-display-projection.core-x-JzVWZh.mjs";
import "./chat-display-projection-BuAz8rxu.mjs";
//#region src/gateway/session-transcript-message.ts
function readTranscriptMessageSenderIsOwner(message) {
	const value = asOptionalRecord(asOptionalRecord(message)?.["__openclaw"])?.senderIsOwner;
	return typeof value === "boolean" ? value : void 0;
}
/** Project one transcript message into the exact payload emitted as session.message. */
function projectSessionMessagePayload(params) {
	const idempotencyKey = readTranscriptMessageIdempotencyKey(params.message);
	const senderIsOwner = readTranscriptMessageSenderIsOwner(params.message);
	const rawMessage = attachOpenClawTranscriptMeta(params.message, {
		transcriptPosition: params.transcriptPosition,
		...params.messageId ? { id: params.messageId } : {},
		...idempotencyKey ? { idempotencyKey } : {},
		...params.messageSeq !== void 0 ? { seq: params.messageSeq } : {}
	});
	const historyProjection = params.historyDelta ? projectChatDisplayMessagesWithState([rawMessage], {
		...params.projectionState,
		subagentCoordination: params.subagentCoordination,
		includeCommentaryFallbacks: true,
		activity: false
	}) : void 0;
	if (historyProjection?.messages.some((message) => asOptionalRecord(message.openclawStreamFallback)?.source === "segment")) return {
		projectionState: {
			assistantErrorPending: historyProjection.assistantErrorPending,
			turnBoundaryPending: historyProjection.turnBoundaryPending
		},
		requiresHistoryReset: true
	};
	const projected = historyProjection && !historyProjection.commentaryFallbacksObserved ? historyProjection : params.projectionState ? projectChatDisplayMessagesWithState([rawMessage], {
		assistantErrorPending: params.projectionState.assistantErrorPending,
		turnBoundaryPending: params.projectionState.turnBoundaryPending,
		activity: false,
		subagentCoordination: params.subagentCoordination
	}) : {
		messages: [projectChatDisplayMessage(rawMessage, { subagentCoordination: params.subagentCoordination })],
		assistantErrorPending: false,
		turnBoundaryPending: false
	};
	const projectionState = {
		assistantErrorPending: projected.assistantErrorPending,
		turnBoundaryPending: projected.turnBoundaryPending
	};
	const message = projected.messages[0];
	if (!message) return { projectionState };
	const projectedMessage = (params.projectCurrentUserProfile ?? createCurrentUserProfileMessageProjector(resolveCurrentUserProfileDisplay))(message);
	params.subagentCoordination?.assertCurrent?.();
	return {
		payload: {
			sessionKey: params.sessionKey,
			...senderIsOwner === void 0 ? {} : { senderIsOwner },
			...params.agentId ? { agentId: params.agentId } : {},
			message: projectedMessage,
			...params.messageId ? { messageId: params.messageId } : {},
			...params.messageSeq !== void 0 ? { messageSeq: params.messageSeq } : {},
			...params.sessionSnapshot,
			...params.runId ? { runId: params.runId } : {}
		},
		projectionState
	};
}
//#endregion
export { projectSessionMessagePayload as t };
