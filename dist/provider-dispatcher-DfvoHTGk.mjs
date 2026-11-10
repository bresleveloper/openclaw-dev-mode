import { n as dispatchInboundMessageWithBufferedDispatcher, r as dispatchInboundMessageWithDispatcher } from "./dispatch-CZQ0DxJx.mjs";
//#region src/auto-reply/reply/provider-dispatcher.ts
function projectDispatchParams(params) {
	return {
		ctx: params.ctx,
		cfg: params.cfg,
		dispatcherOptions: params.dispatcherOptions,
		toolsAllow: params.toolsAllow,
		replyResolver: params.replyResolver,
		replyOptions: params.replyOptions
	};
}
/** Dispatch a reply using the buffered block dispatcher path. */
const dispatchReplyWithBufferedBlockDispatcherCore = async (params) => await dispatchInboundMessageWithBufferedDispatcher({
	...projectDispatchParams(params),
	dispatchReplyFromConfig: params.dispatchReplyFromConfig
});
/** Dispatch a reply using the standard dispatcher path. */
const dispatchReplyWithDispatcherCore = async (params) => await dispatchInboundMessageWithDispatcher(projectDispatchParams(params));
//#endregion
export { dispatchReplyWithDispatcherCore as n, dispatchReplyWithBufferedBlockDispatcherCore as t };
