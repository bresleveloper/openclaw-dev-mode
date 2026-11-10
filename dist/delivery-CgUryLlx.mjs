import { t as normalizeAnyChannelId } from "./registry-normalize-DKVgg-js.mjs";
import { i as getLoadedChannelPluginForRead } from "./registry-loaded-B-WQB-l0.mjs";
import { o as hasReplyPayloadContent } from "./payload-qyD1vby_.mjs";
import { o as resolveCronNotificationSessionKey } from "./session-target-d98pYOqN.mjs";
import { t as createOutboundSendDeps } from "./outbound-send-deps-CvOi7xsU.mjs";
import { n as sendDurableMessageBatchCore, t as durableMessageBatchMayHaveReachedRecipient } from "./send-Ccg5tbzy.mjs";
import { l as outboundDeliveryQueueName } from "./delivery-queue-namespaces-DQeyCJNT.mjs";
import "./runtime-DV2_kfTG.mjs";
import { r as createChannelReplyTransform } from "./reply-transform-CXErM5gk.mjs";
import { t as buildOutboundSessionContext } from "./session-context-ClwiWEpN.mjs";
import { t as resolveAgentOutboundIdentity } from "./identity-vjAGrTvy.mjs";
import "./delivery-plan-BCh_72BD.mjs";
import { a as isCompletedDirectCronDelivery, f as retryTransientDirectCronDelivery, i as buildDirectCronDeliveryIdempotencyKey, n as normalizeDirectCronDeliveryPayloads, o as logCronDeliveryWarn, p as waitForCompletedDirectCronDelivery, r as DIRECT_CRON_DELIVERY_COMPLETION_RETENTION, s as maybeApplyTtsToCronPayloads, t as appendCronRunInspectionLink } from "./delivery-payload-normalization-CTaUlqpR.mjs";
//#region src/cron/delivery.ts
/** Sends only the configured notification. It never selects or writes a model transcript. */
async function sendCronAnnouncePayloadStrict(params) {
	const delivery = params.target;
	params.abortSignal.throwIfAborted();
	const channelId = normalizeAnyChannelId(delivery.channel) ?? delivery.channel;
	const transform = createChannelReplyTransform({
		cfg: params.cfg,
		accountId: delivery.accountId,
		messaging: getLoadedChannelPluginForRead(channelId)?.messaging
	});
	const normalized = normalizeDirectCronDeliveryPayloads({
		deliveryPayloads: Array.isArray(params.payload) ? params.payload : [params.payload],
		channelTransform: transform ? { apply: transform } : void 0
	});
	if (normalized.kind === "suppress") return {
		status: "suppressed",
		reason: normalized.reason,
		skipReason: normalized.reason
	};
	const fence = params.completion?.deliveryAttemptFence;
	const id = params.completion ? buildDirectCronDeliveryIdempotencyKey({
		jobId: params.jobId,
		runStartedAt: params.completion.runStartedAt,
		delivery
	}) : void 0;
	const queueName = outboundDeliveryQueueName({ sessionGeneration: params.sessionGeneration });
	if (id) try {
		if (await isCompletedDirectCronDelivery(id, queueName)) {
			fence?.assertCurrent();
			params.onDeliveryAttempt?.(true);
			return {
				status: "sent",
				payloads: []
			};
		}
	} catch (error) {
		if (!params.bestEffort) throw error;
		await logCronDeliveryWarn(`[cron:${params.jobId}] delivery receipt unavailable; continuing best-effort notification`);
	}
	const prepared = params.tts ? await maybeApplyTtsToCronPayloads({
		cfg: params.cfg,
		payloads: normalized.payload,
		delivery,
		agentId: params.agentId,
		ttsAuto: params.tts.auto
	}) : normalized.payload;
	const payloads = appendCronRunInspectionLink(prepared.filter((payload) => hasReplyPayloadContent(payload, { trimText: true })), params.inspectionUrl);
	if (payloads.length === 0) return {
		status: "suppressed",
		reason: "empty_after_tts"
	};
	const session = buildOutboundSessionContext({
		cfg: params.cfg,
		agentId: params.agentId,
		sessionKey: resolveCronNotificationSessionKey({
			jobId: params.jobId,
			sessionKey: params.target.sessionKey
		})
	});
	const identity = resolveAgentOutboundIdentity(params.cfg, params.agentId);
	let recipientReached = false;
	return await retryTransientDirectCronDelivery({
		jobId: params.jobId,
		signal: params.abortSignal,
		shouldRetryError: () => !recipientReached,
		run: async () => {
			const deliveredPayloads = [];
			await fence?.beforeAttempt();
			params.abortSignal.throwIfAborted();
			fence?.assertCurrent();
			const result = await sendDurableMessageBatchCore({
				cfg: params.cfg,
				channel: delivery.channel,
				to: delivery.to,
				accountId: delivery.accountId,
				threadId: delivery.threadId,
				payloads,
				session,
				identity,
				bestEffort: params.bestEffort === true,
				durability: params.bestEffort === true ? "best_effort" : "required",
				...id ? {
					deliveryIntentId: id,
					reusePendingDeliveryIntent: true,
					completionRetention: DIRECT_CRON_DELIVERY_COMPLETION_RETENTION
				} : {},
				deps: createOutboundSendDeps(params.deps),
				signal: params.abortSignal,
				assertDirectAdapterHandoff: fence?.assertCurrent,
				onDeliveredPayload: ({ hookContent, ...payload }) => deliveredPayloads.push({
					...payload,
					spokenText: hookContent
				}),
				onDeliveryResult: () => {
					if (!recipientReached) {
						recipientReached = true;
						params.onDeliveryAttempt?.(true);
					}
				}
			}, void 0, void 0, params.sessionGeneration);
			if (!recipientReached) {
				recipientReached = durableMessageBatchMayHaveReachedRecipient(result);
				params.onDeliveryAttempt?.(recipientReached);
			}
			if (result.status === "failed" && id && await waitForCompletedDirectCronDelivery({
				id,
				queueName,
				signal: params.abortSignal
			})) {
				fence?.assertCurrent();
				return {
					status: "sent",
					payloads: deliveredPayloads
				};
			}
			if (result.status === "failed" || result.status === "partial_failed") throw result.error;
			return result.status === "sent" ? {
				status: "sent",
				payloads: deliveredPayloads
			} : {
				status: "suppressed",
				reason: recipientReached ? "adapter_returned_no_identity" : result.reason
			};
		}
	});
}
//#endregion
export { sendCronAnnouncePayloadStrict as t };
