import { r as createLazyRuntimeModule } from "./lazy-runtime-CJrzFzqU.mjs";
import { t as warnPluginSdkDeprecation } from "./sdk-deprecation-DjTmOhOX.mjs";
import "./errors-BYR7FGxG.mjs";
import "./registry-S4l3N3eT.mjs";
import { n as finalizeInboundContextForSdk, r as isFinalizedInboundContext } from "./inbound-context-DnPzLOsP.mjs";
import { t as hasExplicitCommandContextText } from "./context-text-XBr5_KXU.mjs";
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
	if (!event.shouldSendToolSummariesAsync || !event.shouldSendFullToolDetailsAsync) warnPluginSdkDeprecation({
		family: "reply-visibility",
		method: "tryDispatchAcpReplyHook boolean visibility inputs",
		replacement: "shouldSendToolSummariesAsync and shouldSendFullToolDetailsAsync predicates"
	});
	const legacyFullToolDetails = event.shouldSendFullToolDetailsAsync ? void 0 : event.shouldSendFullToolDetails;
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
		shouldSendToolSummaries: async () => event.shouldSendToolSummariesAsync ? await event.shouldSendToolSummariesAsync() : event.shouldSendToolSummaries,
		shouldSendFullToolDetails: async () => event.shouldSendFullToolDetailsAsync ? await event.shouldSendFullToolDetailsAsync() : legacyFullToolDetails === true,
		bypassForCommand,
		onReplyStart: ctx.onReplyStart,
		onAgentRunStart: ctx.onAgentRunStart,
		onPreparedAgentRunStart: ctx.onPreparedAgentRunStart,
		turnAdoption: ctx.turnAdoption,
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
