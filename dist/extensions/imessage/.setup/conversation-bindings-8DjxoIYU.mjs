import { createAccountScopedConversationBindingManager, createAccountScopedConversationBindingManagerV2 } from "openclaw/plugin-sdk/thread-bindings-runtime";
import { warnPluginSdkDeprecation } from "openclaw/plugin-sdk/thread-bindings-session-runtime";
// extensions/imessage/src/conversation-bindings.ts
const IMESSAGE_CONVERSATION_BINDINGS_STATE_KEY = Symbol.for("openclaw.imessageConversationBindingsState");
function toSessionBindingTargetKind(raw) {
	return raw === "subagent" ? "subagent" : "session";
}
function toIMessageTargetKind(raw) {
	return raw === "subagent" ? "subagent" : "acp";
}
/** @deprecated Use createIMessageConversationBindingManagerV2; final compatibility day: 2026-12-31. Removal in the first January 2027 stable release. */
function createIMessageConversationBindingManager(params) {
	warnPluginSdkDeprecation({
		family: "conversation-bindings",
		method: "createIMessageConversationBindingManager",
		replacement: "createIMessageConversationBindingManagerV2"
	});
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
export { createIMessageConversationBindingManagerV2 as n, createIMessageConversationBindingManager as t };
