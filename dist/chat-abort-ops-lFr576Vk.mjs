//#region src/gateway/chat-abort-ops.ts
function createChatAbortOps(context) {
	return {
		chatAbortControllers: context.chatAbortControllers,
		chatRunState: context.chatRunState,
		removeChatRun: context.removeChatRun,
		agentRunSeq: context.agentRunSeq,
		getRuntimeConfig: context.getRuntimeConfig,
		broadcast: context.broadcast,
		nodeSendToSession: context.nodeSendToSession,
		onRunAborted: (runId) => {
			context.cancelRunBoundApprovals?.(runId).catch(() => {});
		}
	};
}
//#endregion
export { createChatAbortOps as t };
