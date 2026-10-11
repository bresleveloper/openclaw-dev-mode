import { t as normalizeAnyChannelId } from "./registry-normalize-X0yNhfFZ.mjs";
import { r as getLoadedChannelPluginForRead } from "./registry-loaded-CYq2sa_C.mjs";
import { i as enqueueSystemEvent } from "./system-events-ANKIkU0W.mjs";
import { t as buildOutboundSessionContext } from "./session-context-B-tubEEv.mjs";
import { n as sendDurableMessageBatchCore, t as durableMessageBatchMayHaveReachedRecipient } from "./send-C7R-T1bd.mjs";
import "./runtime-DMaOfXfZ.mjs";
import { r as createChannelReplyTransform } from "./reply-transform-C-o_JYnv.mjs";
import { n as resolveAgentOutboundIdentity } from "./identity-jTDeyBYK.mjs";
import { t as createOutboundSendDeps } from "./outbound-send-deps-DOTLPxsJ.mjs";
//#region src/cron/isolated-agent/delivery-outbound.runtime.ts
function resolveCronChannelReplyTransform(params) {
	const channelId = normalizeAnyChannelId(params.channel) ?? params.channel;
	const messaging = getLoadedChannelPluginForRead(channelId)?.messaging;
	const transform = createChannelReplyTransform({
		...params,
		messaging
	});
	return transform ? { apply: transform } : void 0;
}
//#endregion
export { buildOutboundSessionContext, createOutboundSendDeps, durableMessageBatchMayHaveReachedRecipient, enqueueSystemEvent, resolveAgentOutboundIdentity, resolveCronChannelReplyTransform, sendDurableMessageBatchCore };
