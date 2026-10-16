import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { i as getWorkerInferenceSessionControl } from "./inference-control-internal-h8yXQYae.mjs";
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
function captureWorkerInferenceForSession(params) {
	const sessionId = normalizeOptionalString(params.sessionId);
	if (!sessionId) return;
	return getWorkerInferenceSessionControl(params.context.workerEnvironmentService)?.captureSessionCancellation(sessionId, params.runId);
}
//#endregion
export { createChatAbortOps as n, captureWorkerInferenceForSession as t };
