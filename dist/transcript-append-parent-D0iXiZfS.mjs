//#region src/config/sessions/transcript-append-parent.ts
/** Storage adapters supply ancestry from their admitted transcript. */
function resolveTranscriptAppendParent(params) {
	if (params.parentId === void 0) return params.tailId;
	if (params.appendIntent !== "active-branch" || params.tailId === params.parentId || params.tailId === null) return params.parentId;
	return params.isAncestor(params.tailId, params.parentId) ? params.tailId : params.parentId;
}
const PREPARED_ASSISTANT_MAX_NEWER_BYTES = 1048576;
const PREPARED_ASSISTANT_MAX_ANCESTORS = 4096;
/** Only the admitted user, context-free commands, and final Talk records are transparent. */
function preparedAssistantMessagesPreserveTurn(messages, admittedUserId, isAdmittedQuestionAnswer) {
	return messages.every((message) => {
		if (message.message_role !== "user" || message.event_id === admittedUserId || message.context_free_command === 1) return true;
		if (message.provenance_kind === "realtime_voice" && message.provenance_source_channel === "talk") return true;
		return isAdmittedQuestionAnswer(message);
	});
}
//#endregion
export { resolveTranscriptAppendParent as i, PREPARED_ASSISTANT_MAX_NEWER_BYTES as n, preparedAssistantMessagesPreserveTurn as r, PREPARED_ASSISTANT_MAX_ANCESTORS as t };
