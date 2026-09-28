import { i as normalizeConversationTargetRef } from "./current-conversation-binding-row-De9sUoDf.mjs";
import { i as resolveConversationBindingContextFromAcpCommand, n as resolveConversationBindingAccountIdFromMessage, o as resolveConversationBindingThreadIdFromMessage, r as resolveConversationBindingChannelFromMessage } from "./acp-reset-target-rsWh_4b4.mjs";
//#region src/auto-reply/reply/commands-acp/context.ts
function resolveAcpCommandChannel(params) {
	return resolveConversationBindingChannelFromMessage(params.ctx, params.command.channel);
}
function resolveAcpCommandThreadId(params) {
	return resolveConversationBindingThreadIdFromMessage(params.ctx);
}
function resolveAcpCommandBindingContext(params) {
	const resolved = resolveConversationBindingContextFromAcpCommand(params);
	if (resolved) return normalizeConversationTargetRef(resolved);
	return {
		channel: resolveAcpCommandChannel(params),
		accountId: resolveConversationBindingAccountIdFromMessage({
			ctx: params.ctx,
			cfg: params.cfg,
			commandChannel: params.command.channel
		}),
		threadId: resolveAcpCommandThreadId(params)
	};
}
//#endregion
export { resolveAcpCommandChannel as n, resolveAcpCommandThreadId as r, resolveAcpCommandBindingContext as t };
