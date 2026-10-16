import { t as deliverInboundReplyWithMessageSendContext } from "../channel-outbound-DBuu65Vg.mjs";
import { c as mapReplyDispatchCounts } from "../reply-dispatcher-Bvqc2Fae.mjs";
import { x as normalizeOutboundReplyPayloadCore } from "../reply-payload-DEDOYf-L.mjs";
import { i as throwIfDurableInboundReplyDeliveryFailed, r as isDurableInboundReplyDeliveryHandled, t as deliverInboundReplyWithMessageSendContextCore } from "../durable-delivery-CpwhuHRf.mjs";
import { a as resolveChannelTurnDispatchCounts, i as hasVisibleChannelTurnDispatch, o as recordChannelBotPairLoopAndCheckSuppression, r as hasFinalChannelTurnDispatch } from "../execution-BIzcYQQA.mjs";
import { t as recordDroppedChannelTurnHistory } from "../run-channel-turn-BNg5AmNR.mjs";
import { a as runChannelInboundEvent, n as dispatchChannelInboundReply, o as runPreparedInboundReply } from "../channel-inbound-3pp2RVN7.mjs";
//#region src/plugin-sdk/inbound-reply-dispatch.ts
function withLegacyDispatchCounts(dispatch) {
	return async (params) => {
		const result = await dispatch(params);
		const receipt = result.settledReceipt;
		if (!receipt) return result;
		const counts = mapReplyDispatchCounts(receipt.counts, (entry) => entry.delivered);
		const failedCounts = mapReplyDispatchCounts(receipt.counts, (entry) => entry.failedBeforeSend + entry.failedAfterSend);
		return {
			...result,
			queuedFinal: counts.final > 0,
			counts,
			...Object.values(failedCounts).some((count) => count > 0) ? { failedCounts } : {}
		};
	};
}
function buildInboundReplyDispatchBase(params) {
	return {
		cfg: params.cfg,
		channel: params.channel,
		accountId: params.accountId,
		agentId: params.route.agentId,
		routeSessionKey: params.route.sessionKey,
		storePath: params.storePath,
		ctxPayload: params.ctxPayload,
		recordInboundSession: params.core.channel.session.recordInboundSession,
		dispatchReplyWithBufferedBlockDispatcher: withLegacyDispatchCounts(params.core.channel.reply.dispatchReplyWithBufferedBlockDispatcher)
	};
}
async function dispatchInboundReplyWithBase(params) {
	const base = buildInboundReplyDispatchBase(params);
	const { deliver, durable, onDispatchError, onRecordError, replyOptions } = params;
	await dispatchChannelInboundReply({
		...base,
		delivery: {
			preparePayload: (payload) => payload && typeof payload === "object" ? normalizeOutboundReplyPayloadCore(payload) : {},
			deliver: async (payload, info) => {
				if (durable) {
					const result = await deliverInboundReplyWithMessageSendContextCore({
						cfg: base.cfg,
						channel: base.channel,
						accountId: base.accountId,
						agentId: base.agentId,
						ctxPayload: base.ctxPayload,
						payload,
						info,
						...durable
					});
					throwIfDurableInboundReplyDeliveryFailed(result);
					if (isDurableInboundReplyDeliveryHandled(result)) return result.delivery;
				}
				return await deliver(payload);
			},
			onError: onDispatchError
		},
		replyPipeline: {},
		replyOptions,
		record: { onRecordError }
	});
}
//#endregion
export { deliverInboundReplyWithMessageSendContext, dispatchChannelInboundReply, dispatchInboundReplyWithBase, hasFinalChannelTurnDispatch as hasFinalInboundReplyDispatch, hasVisibleChannelTurnDispatch as hasVisibleInboundReplyDispatch, recordChannelBotPairLoopAndCheckSuppression, recordDroppedChannelTurnHistory as recordDroppedChannelInboundHistory, recordDroppedChannelTurnHistory, resolveChannelTurnDispatchCounts as resolveInboundReplyDispatchCounts, runChannelInboundEvent, runPreparedInboundReply };
