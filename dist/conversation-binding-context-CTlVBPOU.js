import { n as resolveCommandConversationResolution } from "./conversation-resolution-BNDeZowL.js";
//#region src/channels/conversation-binding-context.ts
/**
* Resolves the canonical channel/account/conversation tuple used for conversation bindings.
*/
function resolveConversationBindingContext(params) {
	const resolution = resolveCommandConversationResolution({
		...params,
		includePlacementHint: false
	});
	if (!resolution) return null;
	return {
		channel: resolution.canonical.channel,
		accountId: resolution.canonical.accountId,
		conversationId: resolution.canonical.conversationId,
		...resolution.canonical.parentConversationId ? { parentConversationId: resolution.canonical.parentConversationId } : {},
		...resolution.threadId ? { threadId: resolution.threadId } : {}
	};
}
//#endregion
export { resolveConversationBindingContext as t };
