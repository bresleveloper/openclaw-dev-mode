import { createAccountScopedConversationBindingManager, createAccountScopedConversationBindingManagerV2, resetAccountScopedConversationBindingsForTests } from "openclaw/plugin-sdk/thread-bindings-runtime";
//#region extensions/imessage/src/conversation-bindings.ts
const IMESSAGE_CONVERSATION_BINDINGS_STATE_KEY = Symbol.for("openclaw.imessageConversationBindingsState");
function toSessionBindingTargetKind(raw) {
	return raw === "subagent" ? "subagent" : "session";
}
function toIMessageTargetKind(raw) {
	return raw === "subagent" ? "subagent" : "acp";
}
/** @deprecated Use createIMessageConversationBindingManagerV2; final compatibility day: 2026-12-31. */
function createIMessageConversationBindingManager(params) {
	return createAccountScopedConversationBindingManager({
		channel: "imessage",
		cfg: params.cfg,
		accountId: params.accountId,
		stateKey: IMESSAGE_CONVERSATION_BINDINGS_STATE_KEY,
		toStoredTargetKind: toIMessageTargetKind,
		toSessionBindingTargetKind
	});
}
/** Worker-owned manager used by bundled channel startup. */
function createIMessageConversationBindingManagerV2(params) {
	return createAccountScopedConversationBindingManagerV2({
		channel: "imessage",
		cfg: params.cfg,
		accountId: params.accountId,
		stateKey: IMESSAGE_CONVERSATION_BINDINGS_STATE_KEY,
		toStoredTargetKind: toIMessageTargetKind,
		toSessionBindingTargetKind
	});
}
const testing = { resetIMessageConversationBindingsForTests() {
	resetAccountScopedConversationBindingsForTests({ stateKey: IMESSAGE_CONVERSATION_BINDINGS_STATE_KEY });
} };
//#endregion
export { createIMessageConversationBindingManagerV2 as n, testing as r, createIMessageConversationBindingManager as t };
