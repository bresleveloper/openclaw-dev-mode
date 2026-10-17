import { i as withChannelReadAuthority } from "./channel-read-authority-CyorchNP.mjs";
//#region src/agents/harness/reply-media.ts
/** Capture policy before plugin invocation; the supplied reader only provides workspace bytes. */
function bindHarnessReplyMedia(params) {
	const { attempt, assertActive } = params;
	if (!attempt.workspaceDir) return;
	const context = Object.freeze({
		cfg: params.config ?? {},
		workspaceDir: attempt.workspaceDir,
		agentId: attempt.agentId,
		sessionKey: attempt.sessionKey ?? attempt.sessionId,
		messageProvider: attempt.messageChannel ?? attempt.messageProvider,
		accountId: attempt.agentAccountId,
		groupId: attempt.groupId ?? void 0,
		groupChannel: attempt.groupChannel ?? void 0,
		groupSpace: attempt.groupSpace ?? void 0,
		requesterSenderId: attempt.senderId ?? void 0,
		requesterSenderName: attempt.senderName ?? void 0,
		requesterSenderUsername: attempt.senderUsername ?? void 0,
		requesterSenderE164: attempt.senderE164 ?? void 0,
		sourceReplyDeliveryMode: attempt.sourceReplyDeliveryMode,
		runId: attempt.runId,
		reasoningLevel: attempt.reasoningLevel
	});
	const attemptSignal = attempt.abortSignal;
	return async (request) => {
		const assertSourceCurrent = request.assertCurrent;
		const signal = AbortSignal.any([
			params.signal,
			...attemptSignal ? [attemptSignal] : [],
			...request.signal ? [request.signal] : []
		]);
		const assertCurrent = () => {
			assertActive();
			assertSourceCurrent?.();
			signal.throwIfAborted();
		};
		assertCurrent();
		const { prepareHarnessReplyMedia } = await import("./reply-media-runtime-Ci1uIf2G.mjs");
		assertCurrent();
		const result = await withChannelReadAuthority(assertCurrent, () => prepareHarnessReplyMedia({
			request,
			context,
			signal,
			assertCurrent
		}), signal);
		assertCurrent();
		return result;
	};
}
//#endregion
export { bindHarnessReplyMedia as t };
