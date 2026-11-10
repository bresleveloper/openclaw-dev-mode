import { a as asOptionalRecord } from "./record-coerce-TIsquoVR.mjs";
import { s as readSessionTranscriptRunId } from "./transcript-events-D3brcRJS.mjs";
import { r as readTranscriptMessageIdempotencyKey, t as attachOpenClawTranscriptMeta } from "./session-transcript-entry-message-Q75Efb-t.mjs";
import { t as resolveCurrentUserProfileDisplay } from "./current-user-profile-display-84IsFWS2.mjs";
import { c as projectChatDisplayMessagesWithState, i as isPendingAssistantError, n as createCurrentUserProfileMessageProjector, o as projectChatDisplayMessage } from "./chat-display-projection.core-DdRZ3VIg.mjs";
import "./chat-display-projection-CHqVAi8U.mjs";
import { r as readChatHistoryReplyMessageId } from "./chat-history-reply-messages-Cs9kWyEM.mjs";
//#region src/gateway/session-transcript-message.ts
function readTranscriptMessageSenderIsOwner(message) {
	const value = asOptionalRecord(asOptionalRecord(message)?.["__openclaw"])?.senderIsOwner;
	return typeof value === "boolean" ? value : void 0;
}
/** Project one transcript message into the exact payload emitted as session.message. */
function projectSessionMessagePayload(params) {
	const idempotencyKey = readTranscriptMessageIdempotencyKey(params.message);
	const senderIsOwner = readTranscriptMessageSenderIsOwner(params.message);
	const messageRunId = readSessionTranscriptRunId(params.message) ?? params.runId;
	const rawMessage = attachOpenClawTranscriptMeta(params.message, {
		...messageRunId ? { runId: messageRunId } : {},
		transcriptPosition: params.transcriptPosition,
		...params.messageId ? { id: params.messageId } : {},
		...idempotencyKey ? { idempotencyKey } : {},
		...params.messageSeq !== void 0 ? { seq: params.messageSeq } : {}
	});
	const historyProjection = params.historyDelta ? projectChatDisplayMessagesWithState([rawMessage], {
		...params.projectionState,
		subagentCoordination: params.subagentCoordination,
		resolveCronJobName: params.resolveCronJobName,
		includeCommentaryFallbacks: true,
		toolResultMaxChars: params.toolResultMaxChars,
		activity: false
	}) : void 0;
	if (historyProjection && historyProjection.messages.length > 1 || historyProjection?.messages.some((message) => asOptionalRecord(message.openclawStreamFallback)?.source === "segment")) return {
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
		toolResultMaxChars: params.toolResultMaxChars,
		subagentCoordination: params.subagentCoordination,
		resolveCronJobName: params.resolveCronJobName
	}) : {
		messages: [projectChatDisplayMessage(rawMessage, {
			subagentCoordination: params.subagentCoordination,
			resolveCronJobName: params.resolveCronJobName
		})],
		assistantErrorPending: isPendingAssistantError(rawMessage),
		turnBoundaryPending: false
	};
	const projectionState = {
		assistantErrorPending: projected.assistantErrorPending,
		turnBoundaryPending: projected.turnBoundaryPending
	};
	const message = projected.messages[0];
	if (!message) return {
		projectionState,
		...isPendingAssistantError(rawMessage) ? { deferredAssistantError: true } : {}
	};
	if (readChatHistoryReplyMessageId(message)) return {
		projectionState,
		requiresHistoryReset: true
	};
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
