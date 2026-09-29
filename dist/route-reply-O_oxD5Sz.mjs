import { c as normalizeOptionalLowercaseString } from "./string-coerce-CIXf7egm.mjs";
import { t as createLazyImportLoader } from "./lazy-promise-DGqyc4Y4.mjs";
import { n as normalizeAccountId } from "./account-id-B1bfbA5J.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { i as normalizeChatChannelId } from "./ids-NACrHrny.mjs";
import { n as getBundledChannelPlugin } from "./bundled-D8dZgG2d.mjs";
import { _ as resolveSessionAgentId } from "./agent-scope-CTuYDtny.mjs";
import "./message-channel-constants-Cd7Eq8Zi.mjs";
import { n as normalizeMessageChannel } from "./message-channel-core-CxyiAx1U.mjs";
import "./registry-BKdVEB34.mjs";
import "./message-channel-DDcHHhpX.mjs";
import { t as normalizeChatType } from "./chat-type-Dbv0JQHI.mjs";
import { o as hasReplyPayloadContent } from "./payload-COvcWceu.mjs";
import { E as shouldSuppressReasoningPayload, a as copyReplyPayloadMetadata, o as formatBtwTextForExternalDelivery, s as getReplyPayloadMetadata } from "./reply-payload-B2ZQhznY.mjs";
import { i as normalizeChannelId, n as getLoadedChannelPlugin } from "./registry-D3wOWFDo.mjs";
import "./plugins-BEpDh--e.mjs";
import { r as PlatformMessageNotDispatchedError, s as isOutboundDeliveryError } from "./deliver-types-Diy-VQKA.mjs";
import { n as createStructuredOutboundPayloadPlan } from "./payloads-Ce1fWBq6.mjs";
import { r as normalizeReplyPayloadOutcome } from "./normalize-reply-gZujyBo1.mjs";
import { r as resolveEffectiveMessagesConfig } from "./identity-DdUdpaIE.mjs";
import { t as buildOutboundSessionContext } from "./session-context-B-tubEEv.mjs";
import { r as createChannelReplyTransform } from "./reply-transform-C-o_JYnv.mjs";
import "./reply-payloads-dedupe-DBMvHabb.mjs";
//#region src/auto-reply/reply/route-reply.ts
/**
* Provider-agnostic reply router.
*
* Routes replies to the originating channel based on OriginatingChannel/OriginatingTo
* instead of using the session's lastChannel. This ensures replies go back to the
* provider where the message originated, even when the main session is shared
* across multiple providers.
*/
const messageRuntimeLoader = createLazyImportLoader(() => import("./runtime-D4NP4Fhn.mjs"));
const BLOCK_REPLY_COMPLETION_RETENTION = {
	idPrefix: "block-reply:v1:",
	maxAgeMs: 864e5,
	maxEntries: 2e3
};
function loadDeliverRuntime() {
	return messageRuntimeLoader.load();
}
function replyDeliverySourceMatchesRoute(params) {
	return (normalizeMessageChannel(params.source.channel) ?? normalizeOptionalLowercaseString(params.source.channel)) === (normalizeMessageChannel(params.channel) ?? normalizeOptionalLowercaseString(params.channel)) && normalizeAccountId(params.source.accountId) === normalizeAccountId(params.accountId) && normalizeChatType(params.payloadDelivery.chatType ?? void 0) === normalizeChatType(params.routeDelivery.chatType ?? void 0);
}
function summarizeVisibleRouteReplyDelivery(results) {
	let delivered = false;
	let lastVisibleMessageId;
	for (let index = results.length - 1; index >= 0; index -= 1) {
		const result = results[index];
		if (!result) continue;
		const messageId = result.messageId?.trim().toLowerCase();
		if (messageId === "skipped" || messageId === "suppressed") continue;
		if (!delivered) {
			delivered = true;
			if (!messageId) lastVisibleMessageId = result.messageId;
		}
		if (messageId && messageId !== "unknown" && messageId !== "ok") return {
			delivered: true,
			messageId: result.messageId
		};
	}
	return {
		delivered,
		messageId: delivered ? lastVisibleMessageId : void 0
	};
}
/**
* Routes a reply payload to the specified channel.
*
* This function provides a unified interface for sending messages to any
* supported provider. It's used by the followup queue to route replies
* back to the originating channel when OriginatingChannel/OriginatingTo
* are set.
*/
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
	const payload = operation.kind === "raw" ? operation.payload : operation.plan.payload;
	if (shouldSuppressReasoningPayload(payload)) return {
		ok: true,
		delivered: false,
		suppressed: true,
		reason: "reasoning_payload_not_external"
	};
	const normalizedChannel = normalizeMessageChannel(channel);
	const channelId = normalizeChannelId(channel) ?? normalizeOptionalLowercaseString(channel) ?? null;
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
	if (normalization.kind === "suppress") {
		if (normalization.reason === "channel_transform") return {
			ok: true,
			delivered: false,
			suppressed: true,
			reason: normalization.reason
		};
		return {
			ok: true,
			delivered: false
		};
	}
	const normalized = normalization.payload;
	const externalPayload = {
		...normalized,
		text: operation.kind === "raw" ? formatBtwTextForExternalDelivery(normalized) : normalized.text
	};
	const text = externalPayload.text ?? "";
	let mediaUrls = [];
	for (const url of externalPayload.mediaUrls ?? []) if (url) mediaUrls.push(url);
	if (mediaUrls.length === 0 && externalPayload.mediaUrl) mediaUrls = [externalPayload.mediaUrl];
	const replyToId = externalPayload.replyToId;
	const hasChannelData = messaging?.hasStructuredReplyPayload?.({ payload: externalPayload });
	if (!hasReplyPayloadContent({
		...externalPayload,
		text,
		mediaUrls
	}, { hasChannelData })) return {
		ok: true,
		delivered: false
	};
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
	const replyDelivery = (payloadReplyDelivery && params.replyDelivery && payloadMetadata.replyDeliverySource ? replyDeliverySourceMatchesRoute({
		source: payloadMetadata.replyDeliverySource,
		payloadDelivery: payloadReplyDelivery,
		routeDelivery: params.replyDelivery,
		channel: channelId,
		accountId
	}) : false) ? payloadReplyDelivery : params.replyDelivery ?? payloadReplyDelivery;
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
		const { durableMessageBatchMayHaveReachedRecipient, sendDurableMessageBatchCore, sendStructuredDurableMessageBatchCore } = await loadDeliverRuntime();
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
		if (send.status === "suppressed" && (send.reason === "cancelled_by_message_sending_hook" || send.reason === "adapter_returned_no_send" || send.reason === "cancelled_by_reply_payload_sending_hook" || send.reason === "empty_after_message_sending_hook" || send.reason === "empty_after_reply_payload_sending_hook")) return {
			ok: true,
			delivered: false,
			suppressed: true,
			reason: send.reason
		};
		if (send.status === "suppressed" && durableMessageBatchMayHaveReachedRecipient(send)) return {
			ok: true,
			delivered: false,
			ambiguous: true,
			reason: "adapter_returned_no_identity"
		};
		const delivery = summarizeVisibleRouteReplyDelivery(send.status === "sent" ? send.results : []);
		return {
			ok: true,
			delivered: delivery.delivered,
			messageId: delivery.messageId
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
/**
* Checks if a channel type is routable via routeReply.
*
* Some channels (webchat) require special handling and cannot be routed through
* this generic interface.
*/
function isRoutableChannel(channel) {
	if (!channel || channel === "webchat") return false;
	return normalizeChatChannelId(channel) !== null || normalizeChannelId(channel) !== null;
}
//#endregion
export { routePreparedReply as n, routeReply as r, isRoutableChannel as t };
