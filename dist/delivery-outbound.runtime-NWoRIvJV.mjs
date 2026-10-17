import { t as normalizeAnyChannelId } from "./registry-normalize-BvpWSO2L.mjs";
import { i as getLoadedChannelPluginForRead } from "./registry-loaded-BugfxX6l.mjs";
import { i as enqueueSystemEvent } from "./system-events-BD0JkU8V.mjs";
import { t as buildOutboundSessionContext } from "./session-context-Kov7ff_A.mjs";
import { n as sendDurableMessageBatchCore, t as durableMessageBatchMayHaveReachedRecipient } from "./send-BzkES8OD.mjs";
import "./runtime-DGYnncpD.mjs";
import { r as createChannelReplyTransform } from "./reply-transform-DtO7xscM.mjs";
import { t as resolveAgentOutboundIdentity } from "./identity-BLDSV5e3.mjs";
import { t as createOutboundSendDeps } from "./outbound-send-deps-CvOi7xsU.mjs";
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
