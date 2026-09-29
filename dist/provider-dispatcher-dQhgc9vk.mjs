import { n as dispatchInboundMessageWithBufferedDispatcher, r as dispatchInboundMessageWithDispatcher } from "./dispatch-0xqXE-dj.mjs";
//#region src/auto-reply/reply/provider-dispatcher.ts
/** Dispatch a reply using the buffered block dispatcher path. */
const dispatchReplyWithBufferedBlockDispatcherCore = async (params) => {
	return await dispatchInboundMessageWithBufferedDispatcher({
		ctx: params.ctx,
		cfg: params.cfg,
		dispatcherOptions: params.dispatcherOptions,
		toolsAllow: params.toolsAllow,
		replyResolver: params.replyResolver,
		replyOptions: params.replyOptions,
		dispatchReplyFromConfig: params.dispatchReplyFromConfig
	});
};
/** Dispatch a reply using the standard dispatcher path. */
const dispatchReplyWithDispatcherCore = async (params) => {
	return await dispatchInboundMessageWithDispatcher({
		ctx: params.ctx,
		cfg: params.cfg,
		dispatcherOptions: params.dispatcherOptions,
		toolsAllow: params.toolsAllow,
		replyResolver: params.replyResolver,
		replyOptions: params.replyOptions
	});
};
//#endregion
export { dispatchReplyWithDispatcherCore as n, dispatchReplyWithBufferedBlockDispatcherCore as t };
