import { s as normalizeOptionalLowercaseString } from "./string-coerce-DW4mBlAt.js";
import { i as formatErrorMessage } from "./errors-DCRXIYSQ.js";
import { t as createLazyImportLoader } from "./lazy-promise-BONnzNfb.js";
import { r as normalizeChatChannelId } from "./ids-CkMlu8FB.js";
import { v as resolveSessionAgentId } from "./agent-scope-CDZXADgT.js";
import { n as normalizeAccountId } from "./account-id-5IgE9UKY.js";
import { r as getBundledChannelPlugin } from "./bundled-rTRi0B0q.js";
import "./registry-B5Y8tTE-.js";
import { a as getReplyPayloadMetadata } from "./reply-payload-HLWc9ssO.js";
import "./message-channel-constants-Z0pS5ykd.js";
import { a as normalizeChannelId, n as getLoadedChannelPlugin } from "./registry-Ba1KQQW12.js";
import { t as normalizeChatType } from "./chat-type-BARlA53h.js";
import "./plugins-DnKj2WmH.js";
import { i as normalizeMessageChannel } from "./message-channel-normalize-DleKV4yQ.js";
import "./message-channel-B4LS2Kcc.js";
import { a as hasReplyPayloadContent } from "./payload-BCsfdv86.js";
import { r as resolveEffectiveMessagesConfig } from "./identity-Bc-uwZ_Y.js";
import { t as buildOutboundSessionContext } from "./session-context-BWvkIb6x.js";
import { t as normalizeReplyPayload } from "./normalize-reply-CZRULv1j.js";
import { a as shouldSuppressReasoningPayload, r as formatBtwTextForExternalDelivery } from "./reply-payloads-D3nOygL1.js";
//#region src/auto-reply/reply/route-reply.ts
/**
* Provider-agnostic reply router.
*
* Routes replies to the originating channel based on OriginatingChannel/OriginatingTo
* instead of using the session's lastChannel. This ensures replies go back to the
* provider where the message originated, even when the main session is shared
* across multiple providers.
*/
const messageRuntimeLoader = createLazyImportLoader(() => import("./runtime-_IZpcvl2.js"));
function loadDeliverRuntime() {
	return messageRuntimeLoader.load();
}
function replyDeliverySourceMatchesRoute(params) {
	return (normalizeMessageChannel(params.source.channel) ?? normalizeOptionalLowercaseString(params.source.channel)) === (normalizeMessageChannel(params.channel) ?? normalizeOptionalLowercaseString(params.channel)) && normalizeAccountId(params.source.accountId) === normalizeAccountId(params.accountId) && normalizeChatType(params.payloadDelivery.chatType ?? void 0) === normalizeChatType(params.routeDelivery.chatType ?? void 0);
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
	const { payload, channel, to, accountId, threadId, cfg, abortSignal } = params;
	if (shouldSuppressReasoningPayload(payload)) return { ok: true };
	const normalizedChannel = normalizeMessageChannel(channel);
	const channelId = normalizeChannelId(channel) ?? normalizeOptionalLowercaseString(channel) ?? null;
	const loadedPlugin = channelId ? getLoadedChannelPlugin(channelId) : void 0;
	const bundledPlugin = channelId && !loadedPlugin ? getBundledChannelPlugin(channelId) : void 0;
	const messaging = loadedPlugin?.messaging ?? bundledPlugin?.messaging;
	const threading = loadedPlugin?.threading ?? bundledPlugin?.threading;
	const resolvedAgentId = params.sessionKey ? resolveSessionAgentId({
		sessionKey: params.sessionKey,
		config: cfg
	}) : void 0;
	const normalized = normalizeReplyPayload(payload, {
		responsePrefix: params.sessionKey ? resolveEffectiveMessagesConfig(cfg, resolvedAgentId ?? resolveSessionAgentId({ config: cfg }), {
			channel: normalizedChannel,
			accountId
		}).responsePrefix : cfg.messages?.responsePrefix === "auto" ? void 0 : cfg.messages?.responsePrefix,
		transformReplyPayload: messaging?.transformReplyPayload ? (nextPayload) => messaging.transformReplyPayload?.({
			payload: nextPayload,
			cfg,
			accountId
		}) ?? nextPayload : void 0
	});
	if (!normalized) return { ok: true };
	const externalPayload = {
		...normalized,
		text: formatBtwTextForExternalDelivery(normalized)
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
	}, { hasChannelData })) return { ok: true };
	if (channel === "webchat") return {
		ok: false,
		error: "Webchat routing not supported for queued replies"
	};
	if (!channelId) return {
		ok: false,
		error: `Unknown channel: ${String(channel)}`
	};
	if (abortSignal?.aborted) return {
		ok: false,
		error: "Reply routing aborted"
	};
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
		replyToIsExplicit: Boolean(payloadMetadata?.replyToIdExplicit || normalized.replyToTag || normalized.replyToCurrent),
		replyDelivery
	}) ?? null;
	const resolvedReplyToId = replyTransport?.replyToId === null ? void 0 : replyTransport?.replyToId ?? replyToId ?? void 0;
	const resolvedThreadId = replyTransport && Object.hasOwn(replyTransport, "threadId") ? replyTransport.threadId ?? null : threadId ?? null;
	const deliveryPayload = {
		...externalPayload,
		replyToId: resolvedReplyToId
	};
	try {
		const { sendDurableMessageBatch } = await loadDeliverRuntime();
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
		const send = await sendDurableMessageBatch({
			cfg,
			channel: channelId,
			to,
			accountId: accountId ?? void 0,
			payloads: [deliveryPayload],
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
			threadId: resolvedThreadId,
			session: outboundSession,
			signal: abortSignal,
			mirror: params.mirror !== false && params.sessionKey ? {
				sessionKey: params.sessionKey,
				agentId: resolvedAgentId,
				text,
				mediaUrls,
				...params.isGroup != null ? { isGroup: params.isGroup } : {},
				...params.groupId ? { groupId: params.groupId } : {}
			} : void 0
		});
		if (send.status === "failed" || send.status === "partial_failed") throw send.error;
		if (send.status === "suppressed" && (send.reason === "cancelled_by_reply_payload_sending_hook" || send.reason === "empty_after_reply_payload_sending_hook")) return {
			ok: true,
			suppressed: true,
			reason: send.reason
		};
		return {
			ok: true,
			messageId: (send.status === "sent" ? send.results : []).at(-1)?.messageId
		};
	} catch (err) {
		return {
			ok: false,
			error: `Failed to route reply to ${channel}: ${formatErrorMessage(err)}`
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
export { routeReply as n, isRoutableChannel as t };
