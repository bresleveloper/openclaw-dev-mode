import { c as normalizeOptionalLowercaseString } from "./string-coerce-1VuiLaaR.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { t as createLazyImportLoader } from "./lazy-promise-DGqyc4Y4.mjs";
import { i as normalizeChatChannelId } from "./ids-DhLNdNuz.mjs";
import { n as normalizeAccountId } from "./account-id-ifCOO7_9.mjs";
import "./registry-DqsL4UWB.mjs";
import { t as normalizeAnyChannelId } from "./registry-normalize-DKVgg-js.mjs";
import { t as normalizeChatType } from "./chat-type-qwvaeaJu.mjs";
import { h as resolveSessionAgentId } from "./agent-scope-DXrnO3F4.mjs";
import "./message-channel-constants-B3vfipkP.mjs";
import { n as getBundledChannelPlugin } from "./bundled-CEh6W_x7.mjs";
import { n as normalizeMessageChannel } from "./message-channel-core-BBQx3_oI.mjs";
import { n as getLoadedChannelPlugin } from "./registry-B91r5qN6.mjs";
import "./message-channel-DmAdWHmL.mjs";
import { o as hasReplyPayloadContent } from "./payload-qyD1vby_.mjs";
import { c as getReplyPayloadMetadata, k as shouldSuppressReasoningPayload, o as copyReplyPayloadMetadata, s as formatBtwTextForExternalDelivery } from "./reply-payload-BLX_BF2U.mjs";
import "./plugins-CCVkYF8m.mjs";
import { r as resolveEffectiveMessagesConfig } from "./identity-VQc9B4RO.mjs";
import { r as PlatformMessageNotDispatchedError, s as isOutboundDeliveryError } from "./deliver-types-ChQJdCfP.mjs";
import { n as createStructuredOutboundPayloadPlan } from "./payloads-CZkv8Yff.mjs";
import { r as normalizeReplyPayloadOutcome } from "./normalize-reply-Bw7WQh_g.mjs";
import { r as createChannelReplyTransform } from "./reply-transform-CXErM5gk.mjs";
import { t as buildOutboundSessionContext } from "./session-context-ClwiWEpN.mjs";
//#region src/auto-reply/reply/route-reply.ts
const messageRuntimeLoader = createLazyImportLoader(() => import("./runtime-Csbs5mx8.mjs"));
const BLOCK_REPLY_COMPLETION_RETENTION = {
	idPrefix: "block-reply:v1:",
	maxAgeMs: 864e5,
	maxEntries: 2e3
};
function summarizeVisibleRouteReplyDelivery(results) {
	let delivery;
	for (let index = results.length - 1; index >= 0; index -= 1) {
		const result = results[index];
		if (!result) continue;
		const messageId = result.messageId?.trim().toLowerCase();
		if (messageId === "skipped" || messageId === "suppressed") continue;
		delivery ??= {
			delivered: true,
			messageId: messageId ? void 0 : result.messageId
		};
		if (messageId && messageId !== "unknown" && messageId !== "ok") return {
			delivered: true,
			messageId: result.messageId
		};
	}
	return delivery ?? {
		delivered: false,
		messageId: void 0
	};
}
/** Routes to the originating channel; shared sessions may have a different last channel. */
async function routeReply(params) {
	const { payload, ...route } = params;
	return await routeReplyOperation(route, {
		kind: "raw",
		payload
	});
}
/** Routes a prepared reply without reinterpreting its text as delivery directives. */
async function routePreparedReply(params) {
	const { plan, ...route } = params;
	return await routeReplyOperation(route, {
		kind: "prepared",
		plan
	});
}
async function routeReplyOperation(params, operation) {
	const { channel, to, accountId, threadId, cfg, abortSignal } = params;
	const suppress = (reason) => ({
		ok: true,
		delivered: false,
		...reason ? {
			suppressed: true,
			reason
		} : {}
	});
	const payload = operation.kind === "raw" ? operation.payload : operation.plan.payload;
	if (shouldSuppressReasoningPayload(payload)) return suppress("reasoning_payload_not_external");
	const normalizedChannel = normalizeMessageChannel(channel);
	const channelId = normalizeAnyChannelId(channel) ?? normalizeOptionalLowercaseString(channel) ?? null;
	const loadedPlugin = channelId ? getLoadedChannelPlugin(channelId) : void 0;
	const bundledPlugin = channelId && !loadedPlugin ? getBundledChannelPlugin(channelId) : void 0;
	const messaging = loadedPlugin?.messaging ?? bundledPlugin?.messaging;
	const threading = loadedPlugin?.threading ?? bundledPlugin?.threading;
	const resolvedAgentId = resolveSessionAgentId({
		sessionKey: params.sessionKey,
		config: cfg,
		fallbackAgentId: params.agentId
	});
	const responsePrefix = resolveEffectiveMessagesConfig(cfg, resolvedAgentId, {
		channel: normalizedChannel,
		accountId
	}).responsePrefix;
	const transformReplyPayload = createChannelReplyTransform({
		messaging,
		cfg,
		accountId
	});
	const normalization = normalizeReplyPayloadOutcome(payload, {
		responsePrefix,
		responsePrefixContext: params.responsePrefixContext,
		transformReplyPayload
	});
	if (normalization.kind === "suppress") return suppress(normalization.reason === "channel_transform" ? normalization.reason : void 0);
	const normalized = normalization.payload;
	const externalPayload = {
		...normalized,
		text: operation.kind === "raw" ? formatBtwTextForExternalDelivery(normalized) : normalized.text
	};
	const text = externalPayload.text ?? "";
	let mediaUrls = externalPayload.mediaUrls?.filter(Boolean) ?? [];
	if (mediaUrls.length === 0 && externalPayload.mediaUrl) mediaUrls = [externalPayload.mediaUrl];
	const replyToId = externalPayload.replyToId;
	const hasChannelData = messaging?.hasStructuredReplyPayload?.({ payload: externalPayload });
	if (!hasReplyPayloadContent({
		...externalPayload,
		text,
		mediaUrls
	}, { hasChannelData })) return suppress();
	const rejectBeforeSend = (error) => ({
		ok: false,
		delivered: false,
		error,
		cause: new PlatformMessageNotDispatchedError(error, { cause: void 0 })
	});
	if (channel === "webchat") return rejectBeforeSend("Webchat routing not supported for queued replies");
	if (!channelId) return rejectBeforeSend(`Unknown channel: ${String(channel)}`);
	if (abortSignal?.aborted) return rejectBeforeSend("Reply routing aborted");
	const payloadMetadata = getReplyPayloadMetadata(normalized);
	const payloadReplyDelivery = payloadMetadata?.replyDelivery;
	const replyDeliverySource = payloadMetadata?.replyDeliverySource;
	const replyDelivery = payloadReplyDelivery && params.replyDelivery && replyDeliverySource && (normalizeMessageChannel(replyDeliverySource.channel) ?? normalizeOptionalLowercaseString(replyDeliverySource.channel)) === (normalizeMessageChannel(channelId) ?? normalizeOptionalLowercaseString(channelId)) && normalizeAccountId(replyDeliverySource.accountId) === normalizeAccountId(accountId) && normalizeChatType(payloadReplyDelivery.chatType ?? void 0) === normalizeChatType(params.replyDelivery.chatType ?? void 0) ? payloadReplyDelivery : params.replyDelivery ?? payloadReplyDelivery;
	const replyTransport = threading?.resolveReplyTransport?.({
		cfg,
		accountId,
		threadId,
		replyToId,
		currentMessageId: params.currentMessageId,
		replyToIsExplicit: Boolean(payloadMetadata?.replyToIdExplicit || normalized.replyToTag || normalized.replyToCurrent),
		replyToCurrent: normalized.replyToCurrent,
		replyDelivery
	}) ?? null;
	const resolvedReplyToId = replyTransport?.replyToId === null ? void 0 : replyTransport?.replyToId ?? replyToId ?? void 0;
	const resolvedThreadId = replyTransport && Object.hasOwn(replyTransport, "threadId") ? replyTransport.threadId ?? null : threadId ?? null;
	const inferredReplyTarget = replyTransport?.replyToIdSource === "implicit";
	const deliveryPayload = copyReplyPayloadMetadata(normalized, {
		...externalPayload,
		replyToId: inferredReplyTarget ? void 0 : resolvedReplyToId
	});
	try {
		const { durableMessageBatchMayHaveReachedRecipient, sendDurableMessageBatchCore, sendStructuredDurableMessageBatchCore } = await messageRuntimeLoader.load();
		const outboundSession = buildOutboundSessionContext({
			cfg,
			agentId: resolvedAgentId,
			sessionKey: params.sessionKey,
			policySessionKey: params.policySessionKey,
			conversationType: params.policyConversationType,
			isGroup: params.policySessionKey || params.policyConversationType ? void 0 : params.isGroup,
			requesterSenderId: params.requesterSenderId,
			requesterSenderName: params.requesterSenderName,
			requesterSenderUsername: params.requesterSenderUsername,
			requesterSenderE164: params.requesterSenderE164
		});
		const sendParams = {
			cfg,
			channel: channelId,
			to,
			accountId: accountId ?? void 0,
			replyPayloadSendingHook: {
				kind: params.replyKind,
				channel: channelId,
				...params.sessionKey ? { sessionKey: params.sessionKey } : {},
				...params.runId ? { runId: params.runId } : {},
				context: {
					channelId,
					...accountId ? { accountId } : {},
					conversationId: to,
					...params.sessionKey ? { sessionKey: params.sessionKey } : {},
					...params.requesterSenderId ? { senderId: params.requesterSenderId } : {},
					...params.runId ? { runId: params.runId } : {}
				}
			},
			replyToId: resolvedReplyToId ?? null,
			...inferredReplyTarget ? { replyToMode: replyDelivery?.replyToMode ?? "all" } : {},
			threadId: resolvedThreadId,
			session: outboundSession,
			signal: abortSignal,
			onPlatformSendDispatch: params.beforeDeliver,
			assertDirectAdapterHandoff: params.assertCurrent,
			...params.assertCurrent ? { deliveryRetryOwner: "caller" } : {},
			...params.deliveryIntentId ? {
				deliveryIntentId: params.deliveryIntentId,
				reusePendingDeliveryIntent: true,
				completionRetention: BLOCK_REPLY_COMPLETION_RETENTION,
				durability: "required"
			} : {},
			mirror: params.mirror !== false && params.sessionKey ? {
				sessionKey: params.sessionKey,
				agentId: resolvedAgentId,
				text,
				mediaUrls,
				...params.isGroup != null ? { isGroup: params.isGroup } : {},
				...params.groupId ? { groupId: params.groupId } : {}
			} : void 0
		};
		const send = operation.kind === "prepared" ? await sendStructuredDurableMessageBatchCore({
			...sendParams,
			plan: createStructuredOutboundPayloadPlan([deliveryPayload])
		}) : await sendDurableMessageBatchCore({
			...sendParams,
			payloads: [deliveryPayload]
		});
		if (send.status === "failed" || send.status === "partial_failed") {
			const delivery = summarizeVisibleRouteReplyDelivery(send.status === "failed" ? [] : send.results);
			return {
				ok: false,
				delivered: delivery.delivered,
				error: `Failed to route reply to ${channel}: ${formatErrorMessage(send.error)}`,
				cause: send.error,
				messageId: delivery.messageId,
				...!delivery.delivered && durableMessageBatchMayHaveReachedRecipient(send) ? { ambiguous: true } : {},
				...isOutboundDeliveryError(send.error) && send.error.queueCustody ? { queueCustody: send.error.queueCustody } : {}
			};
		}
		if (send.status === "suppressed" && (send.reason === "cancelled_by_message_sending_hook" || send.reason === "adapter_returned_no_send" || send.reason === "cancelled_by_reply_payload_sending_hook" || send.reason === "empty_after_message_sending_hook" || send.reason === "empty_after_reply_payload_sending_hook")) return suppress(send.reason);
		if (send.status === "suppressed" && durableMessageBatchMayHaveReachedRecipient(send)) return {
			ok: true,
			delivered: false,
			ambiguous: true,
			reason: "adapter_returned_no_identity"
		};
		return {
			ok: true,
			...summarizeVisibleRouteReplyDelivery(send.status === "sent" ? send.results : [])
		};
	} catch (err) {
		const message = formatErrorMessage(err);
		return {
			ok: false,
			delivered: false,
			...isOutboundDeliveryError(err) ? {
				queueCustody: err.queueCustody,
				...err.sentBeforeError ? { ambiguous: true } : {}
			} : {},
			error: `Failed to route reply to ${channel}: ${message}`,
			cause: err
		};
	}
}
function isRoutableChannel(channel) {
	if (!channel || channel === "webchat") return false;
	return normalizeChatChannelId(channel) !== null || normalizeAnyChannelId(channel) !== null;
}
//#endregion
export { routePreparedReply as n, routeReply as r, isRoutableChannel as t };
