import { r as createLazyRuntimeModule } from "./lazy-runtime-BPNHa36e.mjs";
import "./errors-BeQQKpA8.mjs";
import "./registry-4Q9QHmjA.mjs";
import { n as finalizeInboundContextForSdk, r as isFinalizedInboundContext } from "./inbound-context-BLR5MPPS.mjs";
import { t as hasExplicitCommandContextText } from "./context-text-D3m6Fy9M.mjs";
//#region src/plugin-sdk/acpx.ts
const loadDispatchAcpRuntime = createLazyRuntimeModule(() => import("./dispatch-acp.runtime.js"));
/**
* Dispatch a plugin reply hook through ACP when the event targets an ACP-bound session.
* Returns a handled result only when ACP consumes the reply; otherwise callers continue normal delivery.
*/
async function tryDispatchAcpReplyHook(event, ctx) {
	const finalizedCtx = isFinalizedInboundContext(event.ctx) ? event.ctx : finalizeInboundContextForSdk(event.ctx);
	if (event.sendPolicy === "deny" && !event.suppressUserDelivery && !hasExplicitCommandContextText(finalizedCtx) && !event.isTailDispatch) return;
	const runtime = await loadDispatchAcpRuntime();
	const bypassForCommand = await runtime.shouldBypassAcpDispatchForCommand(finalizedCtx, ctx.cfg);
	if (event.sendPolicy === "deny" && !event.suppressUserDelivery && !bypassForCommand && !event.isTailDispatch) return;
	const result = await runtime.tryDispatchAcpReply({
		ctx: finalizedCtx,
		cfg: ctx.cfg,
		dispatcher: ctx.dispatcher,
		runId: event.runId,
		sessionKey: event.sessionKey,
		toolsAllow: event.toolsAllow,
		images: event.images,
		abortSignal: ctx.abortSignal,
		inboundAudio: event.inboundAudio,
		sessionTtsAuto: event.sessionTtsAuto,
		ttsChannel: event.ttsChannel,
		suppressUserDelivery: event.suppressUserDelivery,
		suppressReplyLifecycle: event.suppressReplyLifecycle === true || event.sendPolicy === "deny",
		sourceReplyDeliveryMode: event.sourceReplyDeliveryMode,
		shouldRouteToOriginating: event.shouldRouteToOriginating,
		originatingChannel: event.originatingChannel,
		originatingTo: event.originatingTo,
		originatingAccountId: event.originatingAccountId,
		originatingThreadId: event.originatingThreadId,
		originatingChatType: event.originatingChatType,
		shouldSendToolSummaries: event.shouldSendToolSummaries,
		shouldSendToolSummariesNow: () => event.shouldSendToolSummaries,
		shouldSendFullToolDetails: event.shouldSendFullToolDetails,
		bypassForCommand,
		onReplyStart: ctx.onReplyStart,
		onAgentRunStart: ctx.onAgentRunStart,
		userTurnTranscriptRecorder: ctx.userTurnTranscriptRecorder,
		prepareAssistantTranscriptMessage: ctx.prepareAssistantTranscriptMessage,
		recordProcessed: ctx.recordProcessed,
		markIdle: ctx.markIdle
	});
	if (!result) return;
	return {
		handled: true,
		queuedFinal: result.queuedFinal,
		counts: result.counts
	};
}
//#endregion
export { tryDispatchAcpReplyHook as t };
