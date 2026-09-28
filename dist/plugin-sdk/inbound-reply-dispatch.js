import { t as deliverInboundReplyWithMessageSendContext } from "../channel-outbound-r_EvcKqq.mjs";
import { c as mapReplyDispatchCounts } from "../reply-dispatcher-GD4z6YqB.mjs";
import { x as normalizeOutboundReplyPayloadCore } from "../reply-payload-RBmrGrXG.mjs";
import { i as throwIfDurableInboundReplyDeliveryFailed, r as isDurableInboundReplyDeliveryHandled, t as deliverInboundReplyWithMessageSendContextCore } from "../durable-delivery-BVThud1f.mjs";
import { i as resolveChannelTurnDispatchCounts, n as hasFinalChannelTurnDispatch, r as hasVisibleChannelTurnDispatch } from "../dispatch-result-B75usq__.mjs";
import { r as recordChannelBotPairLoopAndCheckSuppression } from "../execution-CljeOpMw.mjs";
import { t as recordDroppedChannelTurnHistory } from "../run-channel-turn-D71-pSK7.mjs";
import { a as runChannelInboundEvent, n as dispatchChannelInboundReply, o as runPreparedInboundReply } from "../channel-inbound-DcAqUPMY.mjs";
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
async function recordInboundSessionAndDispatchReply(params) {
	await dispatchChannelInboundReply({
		cfg: params.cfg,
		channel: params.channel,
		accountId: params.accountId,
		agentId: params.agentId,
		routeSessionKey: params.routeSessionKey,
		storePath: params.storePath,
		ctxPayload: params.ctxPayload,
		recordInboundSession: params.recordInboundSession,
		dispatchReplyWithBufferedBlockDispatcher: params.dispatchReplyWithBufferedBlockDispatcher,
		delivery: {
			preparePayload: (payload) => payload && typeof payload === "object" ? normalizeOutboundReplyPayloadCore(payload) : {},
			deliver: async (payload, info) => {
				if (params.durable) {
					const durable = await deliverInboundReplyWithMessageSendContextCore({
						cfg: params.cfg,
						channel: params.channel,
						accountId: params.accountId,
						agentId: params.agentId,
						ctxPayload: params.ctxPayload,
						payload,
						info,
						...params.durable
					});
					throwIfDurableInboundReplyDeliveryFailed(durable);
					if (isDurableInboundReplyDeliveryHandled(durable)) return durable.delivery;
				}
				return await params.deliver(payload);
			},
			onError: params.onDispatchError
		},
		replyPipeline: {},
		replyOptions: params.replyOptions,
		record: { onRecordError: params.onRecordError }
	});
}
async function dispatchInboundReplyWithBase(params) {
	await recordInboundSessionAndDispatchReply({
		...buildInboundReplyDispatchBase(params),
		deliver: params.deliver,
		durable: params.durable,
		onRecordError: params.onRecordError,
		onDispatchError: params.onDispatchError,
		replyOptions: params.replyOptions
	});
}
//#endregion
export { deliverInboundReplyWithMessageSendContext, dispatchChannelInboundReply, dispatchInboundReplyWithBase, hasFinalChannelTurnDispatch as hasFinalInboundReplyDispatch, hasVisibleChannelTurnDispatch as hasVisibleInboundReplyDispatch, recordChannelBotPairLoopAndCheckSuppression, recordDroppedChannelTurnHistory as recordDroppedChannelInboundHistory, recordDroppedChannelTurnHistory, resolveChannelTurnDispatchCounts as resolveInboundReplyDispatchCounts, runChannelInboundEvent, runPreparedInboundReply };
