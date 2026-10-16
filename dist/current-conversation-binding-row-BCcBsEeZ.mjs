import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import "./session-key-C09ow4h0.mjs";
import { n as normalizeAccountId } from "./account-id-DbRsdayc.mjs";
//#region src/infra/outbound/session-binding-normalization.ts
/**
* Normalizes conversation ids and drops self-referential parent ids.
*/
function normalizeConversationTargetRef(ref) {
	const conversationId = normalizeOptionalString(ref.conversationId) ?? "";
	const parentConversationId = normalizeOptionalString(ref.parentConversationId);
	const { parentConversationId: _ignoredParentConversationId, ...rest } = ref;
	return {
		...rest,
		conversationId,
		...parentConversationId && parentConversationId !== conversationId ? { parentConversationId } : {}
	};
}
/**
* Normalizes a full conversation reference for stable binding keys.
*/
function normalizeConversationRef(ref) {
	return {
		...normalizeConversationTargetRef(ref),
		channel: normalizeLowercaseStringOrEmpty(ref.channel),
		accountId: normalizeAccountId(ref.accountId)
	};
}
/** Capture only canonical identity fields; caller context must not cross IPC. */
function captureConversationRef(ref) {
	const { channel, accountId, conversationId, parentConversationId } = ref;
	return normalizeConversationRef({
		channel,
		accountId,
		conversationId,
		...parentConversationId !== void 0 ? { parentConversationId } : {}
	});
}
/**
* Builds the adapter registry key shared by channel/account scoped bindings.
*/
function buildChannelAccountKey(params) {
	return `${normalizeLowercaseStringOrEmpty(params.channel)}:${normalizeAccountId(params.accountId)}`;
}
const INSPECTED_CONVERSATION = Symbol.for("openclaw.sessionBinding.inspectedConversation");
function withSessionBindingInspectionConversation(inspection, conversation) {
	return Object.assign(inspection, { [INSPECTED_CONVERSATION]: Object.freeze({ ...conversation }) });
}
function readSessionBindingInspectionConversation(inspection) {
	return inspection[INSPECTED_CONVERSATION];
}
//#endregion
//#region src/infra/outbound/current-conversation-binding-row.ts
function currentConversationBindingRow(record, conversation, bindingKey) {
	return {
		binding_key: bindingKey,
		binding_id: record.bindingId,
		target_session_key: record.targetSessionKey,
		channel: conversation.channel,
		account_id: conversation.accountId,
		conversation_kind: "current",
		parent_conversation_id: conversation.parentConversationId ?? null,
		conversation_id: conversation.conversationId,
		target_kind: record.targetKind,
		status: record.status,
		bound_at: record.boundAt,
		expires_at: record.expiresAt ?? null,
		metadata_json: record.metadata ? JSON.stringify(record.metadata) : null,
		record_json: JSON.stringify(record),
		updated_at: Date.now()
	};
}
//#endregion
export { normalizeConversationTargetRef as a, normalizeConversationRef as i, buildChannelAccountKey as n, readSessionBindingInspectionConversation as o, captureConversationRef as r, withSessionBindingInspectionConversation as s, currentConversationBindingRow as t };
