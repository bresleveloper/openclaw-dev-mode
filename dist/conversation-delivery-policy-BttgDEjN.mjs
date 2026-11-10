import { n as sha256Hex } from "./node-crypto-BG4u3UnX.mjs";
import { n as parseConversationRouteContext } from "./conversation-route-context-ulGSQNwr.mjs";
//#region src/config/sessions/conversation-route-fingerprint.ts
/** Binds queued authority to the exact route facts admitted by the Gateway. */
function resolveConversationRouteFingerprint(route) {
	const context = route.routeContext ? parseConversationRouteContext(route.routeContext) : void 0;
	return sha256Hex(JSON.stringify([
		route.channel,
		route.accountId,
		route.kind,
		route.peerId,
		route.target,
		route.parentConversationRef ?? null,
		route.threadId ?? null,
		route.nativeChannelId ?? null,
		route.nativeDirectUserId ?? null,
		route.routeContextObserved === true,
		context ?? null
	]));
}
//#endregion
//#region src/config/sessions/conversation-authority.ts
/** The reader or transaction supplies current rows; captured fingerprints alone grant nothing. */
function assertConversationAuthority(conversation, expected) {
	if (!conversation || conversation.conversationRef !== expected.conversationRef || resolveConversationRouteFingerprint(conversation) !== expected.expectedRouteFingerprint || expected.expectedSessionId !== void 0 && conversation.sessionId !== expected.expectedSessionId || expected.expectedSessionKey !== void 0 && conversation.sessionKey !== expected.expectedSessionKey) {
		const error = /* @__PURE__ */ new Error(`Conversation is no longer available to this agent: ${expected.conversationRef}`);
		error.name = "ConversationAuthorityError";
		throw error;
	}
}
//#endregion
//#region src/config/sessions/conversation-delivery-store.types.ts
var ConversationDeliveryInputError = class extends Error {
	constructor(..._args) {
		super(..._args);
		this.name = "ConversationDeliveryInputError";
	}
};
var ConversationDeliveryMissingError = class extends Error {
	constructor(..._args2) {
		super(..._args2);
		this.name = "ConversationDeliveryMissingError";
	}
};
//#endregion
//#region src/config/sessions/conversation-delivery-policy.ts
function normalizeConversationDeliveryOperationId(value) {
	const operationId = value.trim();
	if (!operationId) throw new Error("Conversation delivery operation id is required");
	return operationId;
}
function assertConversationDeliveryInput(record, input, messageHash = sha256Hex(input.message)) {
	if (record.conversationRef !== input.conversationRef || record.operationKind !== input.operationKind || record.sourceSessionKey !== (input.sourceSessionKey?.trim() || void 0) || record.messageHash !== messageHash) throw new ConversationDeliveryInputError(`Conversation delivery operation was reused with different input: ${record.operationId}`);
}
//#endregion
export { assertConversationAuthority as a, ConversationDeliveryMissingError as i, normalizeConversationDeliveryOperationId as n, resolveConversationRouteFingerprint as o, ConversationDeliveryInputError as r, assertConversationDeliveryInput as t };
