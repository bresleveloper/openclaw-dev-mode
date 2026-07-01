import { a as normalizeLowercaseStringOrEmpty } from "./string-coerce-DW4mBlAt.js";
import { C as resolveExpiresAtMsFromDurationMs, _ as parseStrictFiniteNumber, o as asDateTimestampMs } from "./number-coercion-CJQ8TR--.js";
import { t as formatCliCommand } from "./command-format-2N79m0dg.js";
import { d as registerUnhandledRejectionHandler } from "./unhandled-rejections-QMGVkiWd.js";
import { _ as uniqueStrings, l as normalizeStringEntries } from "./string-normalization-CRyoFBPt.js";
import { l as normalizeE164 } from "./utils-BApvfmPs.js";
import { n as defaultRuntime } from "./runtime-B4lgFmsS.js";
import { r as getChildLogger } from "./logger-ByU25eYB.js";
import { t as createSubsystemLogger } from "./subsystem-yNfG7O3v.js";
import { n as normalizeAccountId, t as DEFAULT_ACCOUNT_ID } from "./account-id-5IgE9UKY.js";
import { h as resolveThreadSessionKeys, i as buildAgentMainSessionKey, n as DEFAULT_MAIN_KEY, o as buildGroupHistoryKey, u as normalizeAgentId$1 } from "./session-key-pTKRJb0m.js";
import { c as warn, i as logVerbose, o as shouldLogVerbose } from "./globals-BWmHKFNH.js";
import { i as getRuntimeConfig } from "./io-BJfjPmGW.js";
import { s as getRuntimeConfigSourceSnapshot } from "./runtime-snapshot-D93_HOsR.js";
import { l as fireAndForgetBoundedHook, t as getGlobalHookRunner } from "./hook-runner-global-D4fQSLSV.js";
import { m as triggerInternalHook, n as createInternalHookEvent } from "./internal-hooks-BGR46Oie.js";
import { _ as updateSessionStore, g as updateLastRoute } from "./store-DJ7wx5_V.js";
import { d as resolveStorePath } from "./paths-CHZBIGhF.js";
import { f as saveMediaStream } from "./store-MjA3hYFB.js";
import { i as shouldComputeCommandAuthorized, r as isControlCommandMessage, t as hasControlCommand } from "./command-detection-RzPDnyTh.js";
import { a as enqueueSystemEvent } from "./system-events-DNR0hK3x.js";
import { n as sleepWithAbort, t as computeBackoff } from "./backoff-DPz-g2bN.js";
import { i as toInternalMessageReceivedContext, l as toPluginMessageContext, n as deriveInboundMessageHookContext, u as toPluginMessageReceivedEvent } from "./message-hook-mappers-kwzGSryO.js";
import { g as sendMediaWithLeadingCaption, m as resolveSendableOutboundReplyParts, u as isReasoningReplyPayload } from "./reply-payload-CBQ2d2jT.js";
import { t as resolveAccountEntry } from "./account-lookup-DjMZZ6go.js";
import { a as resolveInboundLastRouteSessionKey, i as resolveAgentRoute, n as deriveLastRoutePolicy, t as buildAgentSessionKey } from "./resolve-route-BSWTgtc4.js";
import { l as resolvePinnedMainDmOwnerFromAllowlist } from "./dm-policy-shared-COc7no6a.js";
import { r as getAgentScopedMediaLocalRoots } from "./local-roots-ChiBnsqP.js";
import { n as loadWebMedia } from "./web-media-DnX3imnL.js";
import { a as resolveIdentityNamePrefix$1, n as resolveAgentIdentity } from "./identity-Bc-uwZ_Y.js";
import { r as resolveBatchedReplyThreadingPolicy } from "./reply-threading-J9AZHHNY.js";
import { c as resolveTextChunkLimit, i as chunkMarkdownTextWithMode, s as resolveChunkMode } from "./chunk-ulm_3glE.js";
import { t as createMessageReceiptFromOutboundResults } from "./receipt-BDn00i4I.js";
import { r as formatDurationPrecise } from "./format-duration-BrZ-AaEJ.js";
import "./logging-core-D8iC6VAB.js";
import "./media-runtime-BGWQwoXi.js";
import "./number-runtime-DBLVDypr.js";
import "./runtime-config-snapshot-BJVEWeUQ.js";
import "./runtime-env-oOti2yy7.js";
import "./security-runtime-ZGC3cmUc.js";
import { n as filterSupplementalContextItems } from "./context-visibility-C5CaKMWO.js";
import "./string-coerce-runtime-BiZzULo_.js";
import { t as convertMarkdownTables } from "./tables-CNojwOtD.js";
import { a as normalizeMentionText, n as buildMentionRegexes } from "./mentions-B1EJNjZS.js";
import { t as finalizeInboundContext } from "./inbound-context-cqPd3Tht.js";
import { t as dispatchReplyWithBufferedBlockDispatcher } from "./provider-dispatcher-B-jVMqzR.js";
import "./account-core-Dpb-yXIR.js";
import "./routing-DGrdyZ4S.js";
import { r as formatInboundEnvelope } from "./envelope-CZharBzl.js";
import { n as resolveInboundDebounceMs, t as createInboundDebouncer } from "./inbound-debounce-k9j7XKN1.js";
import { a as shouldAckReactionForWhatsApp, r as removeAckReactionHandleAfterReply, t as createAckReactionHandle } from "./ack-reactions-DBk4fpd2.js";
import { E as toInboundMediaFacts, b as filterChannelInboundQuoteContext, g as hasVisibleChannelTurnDispatch, y as buildChannelInboundEventContext } from "./kernel-Bxs7lxfo.js";
import { n as resolveInboundMentionDecision, t as implicitMentionKindWhen } from "./mention-gating-3P8aSD7o.js";
import { t as recordInboundSession } from "./session-DIP_KKAc.js";
import { i as buildHistoryContextFromEntries, o as buildInboundHistoryFromEntries } from "./history-CQ6h-EJb.js";
import { n as resolveChannelSourceReplyDeliveryMode, t as createChannelReplyPipeline } from "./reply-pipeline-up_QEfXn.js";
import { t as createChannelHistoryWindow } from "./history-window-C9gdatqm.js";
import { t as resolveMarkdownTableMode } from "./markdown-tables-BlCHMd5G.js";
import { n as recordChannelActivity } from "./channel-activity-4piA219h.js";
import "./reply-history-BGORyrel.js";
import { i as loadSessionStore } from "./session-store-runtime-BlqMkGtn.js";
import { t as CHANNEL_APPROVAL_NATIVE_RUNTIME_CONTEXT_CAPABILITY } from "./approval-handler-adapter-runtime-DLWtIqHq.js";
import "./approval-handler-runtime-8wuH8Eh6.js";
import { r as registerChannelRuntimeContext } from "./channel-runtime-context-Bx08uB94.js";
import { t as resolveChannelContextVisibilityMode } from "./context-visibility-J_Lhn2al.js";
import { n as parseActivationCommand, t as normalizeGroupActivation } from "./group-activation-MKTJBUwi.js";
import "./reply-runtime-zmYnZriL.js";
import "./reply-reference-Byp4lC3Z.js";
import "./reply-chunking-DDVYtWXI.js";
import { f as runChannelInboundEvent } from "./inbound-reply-dispatch-BtDuEu8E.js";
import { C as createDurableInboundReceiveJournalFromQueue, t as deliverInboundReplyWithMessageSendContext } from "./channel-outbound-BNKGCEf1.js";
import { t as logAckFailure } from "./logging-gUWPKC5g.js";
import "./web-media--IgHJT4v.js";
import { t as drainPendingDeliveries } from "./delivery-queue-runtime-QZHG8tKo.js";
import "./system-event-runtime-7j3mZE-G.js";
import "./media-store-CvjmriWP.js";
import { n as resolveConfiguredBindingRoute, t as ensureConfiguredBindingRouteReady } from "./binding-routing-ToE94Wq6.js";
import "./conversation-binding-runtime-p3fqy8u3.js";
import "./conversation-runtime-DwbK-vz_.js";
import "./agent-runtime-C8Yya-Tu.js";
import "./plugin-runtime-DVoeKmsH.js";
import { n as createTransportActivityStatusPatch, t as createConnectedChannelStatusPatch } from "./gateway-runtime-ArQFAZ7T.js";
import "./cli-runtime-Comrp7kq.js";
import "./hook-runtime-CUCMEHpw.js";
import "./markdown-table-runtime-BLr9kTqt.js";
import "./command-detection-B0C6PCEv.js";
import { a as resolveInboundSessionEnvelopeContext, o as formatLocationText, s as toLocationContext } from "./channel-inbound-amerU1bZ.js";
import { a as DEFAULT_TIMING, c as createStatusReactionController } from "./channel-feedback-Bo1DW6IF.js";
import "./channel-mention-gating-CzIPlkc4.js";
import { t as createClaimableDedupe } from "./persistent-dedupe-Ck7XvmNX.js";
import { a as resolveWhatsAppAccount, s as resolveWhatsAppMediaMaxBytes } from "./accounts-D4l-iMIF.js";
import { t as resolveWhatsAppReactionLevel } from "./reaction-level-DNbrizS1.js";
import { a as normalizeWhatsAppOutboundPayload, c as prepareWhatsAppOutboundMedia, d as maybeResolveWhatsAppApprovalReaction, l as sendWhatsAppOutboundWithRetry, r as sendReactionWhatsApp, s as normalizeWhatsAppPayloadTextPreservingIndentation } from "./send-7D1kc-BQ.js";
import { n as getWhatsAppRuntime } from "./runtime-BRPL03_u.js";
import { n as getStatusCode, r as getRegisteredWhatsAppConnectionController, t as formatError } from "./session-errors-CbsoQqoy.js";
import { a as resolveWhatsAppSocketTiming, i as resolveWhatsAppSocketOperationTimeoutMs, n as createWhatsAppSocketOperationTimeoutAdapter, o as withWhatsAppSocketOperationTimeout, r as isWhatsAppSocketOperationTimeoutError } from "./socket-timing-Fw8AJE9F.js";
import { a as resolveEquivalentWhatsAppDirectChatJids, i as markdownToWhatsApp, n as isSelfChatMode, o as resolveJidToE164, r as jidToE164 } from "./text-runtime-DshxRpTA.js";
import { n as cacheInboundMessageMeta, r as lookupInboundMessageMeta, t as buildQuotedMessageOptions } from "./quoted-message-DKCzkVF7.js";
import { _ as readWebSelfIdentityForDecision, a as getWebAuthAgeMs, h as readWebSelfId, r as WhatsAppAuthUnstableError } from "./auth-store-BERBvAOr.js";
import { a as getSelfIdentity, c as resolveComparableIdentity, i as getReplyContext, n as getMentionIdentities, o as getSenderIdentity, r as getPrimaryIdentityId, s as identitiesOverlap, t as getComparableIdentityValues } from "./identity-B1I7YF2e.js";
import { n as resolveWhatsAppGroupsConfigPath } from "./group-config-path-Bjw5mSIu.js";
import { c as requireWhatsAppInboundAdmission, i as resolveWhatsAppInboundPolicy, l as resolveWhatsAppGroupConversationId, o as buildDeprecatedFlatWhatsAppInboundAdmission, r as resolveWhatsAppCommandAuthorized, s as requireAdmittedWhatsAppInboundMessage, t as checkInboundAccessControl } from "./access-control-DWgcP3EX.js";
import { c as BufferJSON, d as DisconnectReason, i as downloadMediaMessage, s as normalizeMessageContent, u as isJidGroup } from "./session.runtime-1AU-NIKD.js";
import { _ as hasInboundUserContent, a as mayContainWhatsAppOutboundMention, c as resolveInboundMediaMimetype, d as extractContextInfo, f as extractExternalAdReplyContext, g as extractText, h as extractMentionedJids, i as addWhatsAppOutboundMentionsToContent, l as describeReplyContext, m as extractMediaPlaceholder, n as listWhatsAppSendResultMessageIds, o as resolveWhatsAppOutboundMentions, p as extractLocationData, r as normalizeWhatsAppSendResult, s as addWhatsAppImagePreviewFields, t as createWebSendApi, u as extractContactContext } from "./send-api-B0CsQHVI.js";
import { r as waitForWaConnection, t as createWaSocket } from "./session-BkAzTpp0.js";
import { c as newConnectionId, l as resolveHeartbeatSeconds, n as WHATSAPP_WATCHDOG_TIMEOUT_ERROR, r as WhatsAppConnectionController, s as DEFAULT_RECONNECT_POLICY, u as resolveReconnectPolicy } from "./connection-controller-DFjd3zwi.js";
import { createHash } from "node:crypto";
//#region extensions/whatsapp/src/inbound/message-aliases.ts
function normalizeQuoteSender(sender) {
	if (!sender?.displayName && !sender?.jid && !sender?.e164) return;
	return sender;
}
function buildQuoteFromFlatAliases(msg) {
	if (msg.replyTo) return {
		context: msg.replyTo,
		id: msg.replyTo.id,
		body: msg.replyTo.body,
		sender: normalizeQuoteSender({
			displayName: msg.replyTo.sender?.label ?? msg.replyToSender,
			jid: msg.replyTo.sender?.jid ?? msg.replyToSenderJid,
			e164: msg.replyTo.sender?.e164 ?? msg.replyToSenderE164
		})
	};
	if (!msg.replyToId && !msg.replyToBody && !msg.replyToSender && !msg.replyToSenderJid && !msg.replyToSenderE164) return;
	return {
		id: msg.replyToId,
		body: msg.replyToBody,
		sender: normalizeQuoteSender({
			displayName: msg.replyToSender,
			jid: msg.replyToSenderJid,
			e164: msg.replyToSenderE164
		})
	};
}
function buildGroupFromFlatAliases(msg) {
	const mentionJids = msg.mentions ?? msg.mentionedJids;
	if (!msg.groupSubject && !msg.groupParticipants?.length && !mentionJids?.length) return;
	return {
		subject: msg.groupSubject,
		participants: msg.groupParticipants,
		mentions: mentionJids?.length ? { jids: mentionJids } : void 0
	};
}
function ensureQuote(msg) {
	return msg.quote ??= {};
}
function ensureQuoteSender(msg) {
	const quote = ensureQuote(msg);
	return quote.sender ??= {};
}
function ensureGroup(msg) {
	return msg.group ??= {};
}
function ensureGroupMentions(msg) {
	const group = ensureGroup(msg);
	return group.mentions ??= {};
}
function ensureMedia(msg) {
	return msg.payload.media ??= {};
}
function setMediaField(msg, key, value) {
	if (value === void 0 && !msg.payload.media) return;
	ensureMedia(msg)[key] = value;
}
function defineDeprecatedAccessors(msg, descriptors) {
	Object.defineProperties(msg, Object.fromEntries(Object.entries(descriptors).map(([key, descriptor]) => [key, {
		configurable: true,
		enumerable: true,
		get: descriptor.get,
		set: descriptor.set
	}])));
	return msg;
}
function defineDeprecatedAliasAccessors(msg, descriptors) {
	defineDeprecatedAccessors(msg, descriptors);
	return msg;
}
function defineDeprecatedAdmissionTopLevelAccessors(msg) {
	let fallbackConversationId = msg.conversationId || msg.from;
	let fallbackAccountId = msg.accountId;
	let fallbackAccessControlPassed = msg.accessControlPassed;
	let fallbackChatType = msg.chatType;
	const conversationId = () => msg.admission?.conversation.id ?? fallbackConversationId;
	const setConversationId = (value) => {
		const next = value;
		fallbackConversationId = next;
		if (msg.admission) {
			msg.admission.conversation.id = next;
			msg.admission.conversation.groupSessionId = resolveWhatsAppGroupConversationId(next);
		}
	};
	return defineDeprecatedAccessors(msg, {
		from: {
			get: conversationId,
			set: setConversationId
		},
		conversationId: {
			get: conversationId,
			set: setConversationId
		},
		accountId: {
			get: () => msg.admission?.accountId ?? fallbackAccountId,
			set: (value) => {
				const next = value;
				fallbackAccountId = next;
				if (msg.admission) {
					msg.admission.accountId = next;
					msg.admission.account.accountId = next;
				}
			}
		},
		accessControlPassed: {
			get: () => msg.admission ? msg.admission.ingress.decision === "allow" : fallbackAccessControlPassed,
			set: (value) => {
				fallbackAccessControlPassed = value;
			}
		},
		chatType: {
			get: () => msg.admission?.conversation.kind ?? fallbackChatType,
			set: (value) => {
				const next = value;
				fallbackChatType = next;
				if (msg.admission) msg.admission.conversation.kind = next;
			}
		}
	});
}
function withDeprecatedWebInboundMessageFlatAliases(msg) {
	return defineDeprecatedAliasAccessors(defineDeprecatedAdmissionTopLevelAccessors(msg), {
		id: {
			get: () => msg.event.id,
			set: (value) => msg.event.id = value
		},
		to: {
			get: () => msg.platform.recipientJid,
			set: (value) => msg.platform.recipientJid = value
		},
		body: {
			get: () => msg.payload.body,
			set: (value) => msg.payload.body = value
		},
		pushName: {
			get: () => msg.platform.pushName,
			set: (value) => msg.platform.pushName = value
		},
		timestamp: {
			get: () => msg.event.timestamp,
			set: (value) => msg.event.timestamp = value
		},
		chatId: {
			get: () => msg.platform.chatJid,
			set: (value) => msg.platform.chatJid = value
		},
		sender: {
			get: () => msg.platform.sender,
			set: (value) => msg.platform.sender = value
		},
		senderJid: {
			get: () => msg.platform.senderJid,
			set: (value) => msg.platform.senderJid = value
		},
		senderE164: {
			get: () => msg.platform.senderE164,
			set: (value) => msg.platform.senderE164 = value
		},
		senderName: {
			get: () => msg.platform.senderName,
			set: (value) => msg.platform.senderName = value
		},
		replyTo: {
			get: () => msg.quote?.context,
			set: (value) => ensureQuote(msg).context = value
		},
		replyToId: {
			get: () => msg.quote?.id ?? msg.quote?.context?.id,
			set: (value) => ensureQuote(msg).id = value
		},
		replyToBody: {
			get: () => msg.quote?.body ?? msg.quote?.context?.body,
			set: (value) => ensureQuote(msg).body = value
		},
		replyToSender: {
			get: () => msg.quote?.context?.sender?.label ?? msg.quote?.sender?.displayName,
			set: (value) => {
				const sender = ensureQuoteSender(msg);
				sender.displayName = value;
				if (msg.quote?.context?.sender) msg.quote.context.sender.label = value;
			}
		},
		replyToSenderJid: {
			get: () => msg.quote?.context?.sender?.jid ?? msg.quote?.sender?.jid,
			set: (value) => {
				const jid = value;
				ensureQuoteSender(msg).jid = jid;
				if (msg.quote?.context?.sender) msg.quote.context.sender.jid = jid;
			}
		},
		replyToSenderE164: {
			get: () => msg.quote?.context?.sender?.e164 ?? msg.quote?.sender?.e164,
			set: (value) => {
				const e164 = value;
				ensureQuoteSender(msg).e164 = e164;
				if (msg.quote?.context?.sender) msg.quote.context.sender.e164 = e164;
			}
		},
		groupSubject: {
			get: () => msg.group?.subject,
			set: (value) => ensureGroup(msg).subject = value
		},
		groupParticipants: {
			get: () => msg.group?.participants,
			set: (value) => ensureGroup(msg).participants = value
		},
		mentions: {
			get: () => msg.group?.mentions?.jids,
			set: (value) => ensureGroupMentions(msg).jids = value
		},
		mentionedJids: {
			get: () => msg.group?.mentions?.jids,
			set: (value) => ensureGroupMentions(msg).jids = value
		},
		self: {
			get: () => msg.platform.self,
			set: (value) => msg.platform.self = value
		},
		selfJid: {
			get: () => msg.platform.selfJid,
			set: (value) => msg.platform.selfJid = value
		},
		selfLid: {
			get: () => msg.platform.selfLid,
			set: (value) => msg.platform.selfLid = value
		},
		selfE164: {
			get: () => msg.platform.selfE164,
			set: (value) => msg.platform.selfE164 = value
		},
		fromMe: {
			get: () => msg.platform.fromMe,
			set: (value) => msg.platform.fromMe = value
		},
		location: {
			get: () => msg.payload.location,
			set: (value) => msg.payload.location = value
		},
		sendComposing: {
			get: () => msg.platform.sendComposing,
			set: (value) => msg.platform.sendComposing = value
		},
		reply: {
			get: () => msg.platform.reply,
			set: (value) => msg.platform.reply = value
		},
		sendMedia: {
			get: () => msg.platform.sendMedia,
			set: (value) => msg.platform.sendMedia = value
		},
		mediaPath: {
			get: () => msg.payload.media?.path,
			set: (value) => setMediaField(msg, "path", value)
		},
		mediaType: {
			get: () => msg.payload.media?.type,
			set: (value) => setMediaField(msg, "type", value)
		},
		mediaFileName: {
			get: () => msg.payload.media?.fileName,
			set: (value) => setMediaField(msg, "fileName", value)
		},
		mediaUrl: {
			get: () => msg.payload.media?.url,
			set: (value) => setMediaField(msg, "url", value)
		},
		untrustedStructuredContext: {
			get: () => msg.payload.untrustedStructuredContext,
			set: (value) => msg.payload.untrustedStructuredContext = value
		},
		isBatched: {
			get: () => msg.event.isBatched,
			set: (value) => msg.event.isBatched = value
		}
	});
}
function normalizeLegacyFlatWebInboundMessage(msg) {
	const media = msg.mediaPath || msg.mediaType || msg.mediaFileName || msg.mediaUrl ? {
		path: msg.mediaPath,
		type: msg.mediaType,
		fileName: msg.mediaFileName,
		url: msg.mediaUrl
	} : void 0;
	return withDeprecatedWebInboundMessageFlatAliases({
		...msg,
		admission: msg.admission ?? buildDeprecatedFlatWhatsAppInboundAdmission(msg),
		event: {
			id: msg.id,
			timestamp: msg.timestamp,
			isBatched: msg.isBatched
		},
		payload: {
			body: msg.body,
			media,
			location: msg.location,
			untrustedStructuredContext: msg.untrustedStructuredContext
		},
		platform: {
			chatJid: msg.chatId,
			recipientJid: msg.to,
			sender: msg.sender,
			senderJid: msg.senderJid,
			senderE164: msg.senderE164,
			senderName: msg.senderName,
			pushName: msg.pushName,
			self: msg.self,
			selfJid: msg.selfJid,
			selfLid: msg.selfLid,
			selfE164: msg.selfE164,
			fromMe: msg.fromMe,
			sendComposing: msg.sendComposing,
			reply: msg.reply,
			sendMedia: msg.sendMedia
		},
		quote: buildQuoteFromFlatAliases(msg),
		group: buildGroupFromFlatAliases(msg)
	});
}
function normalizeWebInboundMessage(msg) {
	if (msg.event && msg.payload && msg.platform) return withDeprecatedWebInboundMessageFlatAliases(msg);
	if (msg.event || msg.payload || msg.platform || msg.quote || msg.group) throw new Error("WhatsApp inbound messages must be either legacy flat or canonical nested; partial nested contexts are not supported.");
	return normalizeLegacyFlatWebInboundMessage(msg);
}
//#endregion
//#region extensions/whatsapp/src/inbound/dedupe.ts
const RECENT_WEB_MESSAGE_TTL_MS = 20 * 6e4;
const RECENT_WEB_MESSAGE_MAX = 5e3;
const RECENT_OUTBOUND_MESSAGE_TTL_MS = 20 * 6e4;
const RECENT_OUTBOUND_MESSAGE_MAX = 5e3;
const claimableInboundMessages = createClaimableDedupe({
	ttlMs: RECENT_WEB_MESSAGE_TTL_MS,
	memoryMaxSize: RECENT_WEB_MESSAGE_MAX
});
const recentOutboundMessages = createRecentMessageCache({
	ttlMs: RECENT_OUTBOUND_MESSAGE_TTL_MS,
	maxSize: RECENT_OUTBOUND_MESSAGE_MAX
});
function createRecentMessageCache(options) {
	const ttlMs = Math.max(0, options.ttlMs);
	const maxSize = Math.max(0, Math.floor(options.maxSize));
	const cache = /* @__PURE__ */ new Map();
	const prune = (now) => {
		if (ttlMs > 0) {
			const cutoff = now - ttlMs;
			for (const [key, timestamp] of cache) if (timestamp < cutoff) cache.delete(key);
		}
		while (cache.size > maxSize) {
			const oldest = cache.keys().next().value;
			if (!oldest) break;
			cache.delete(oldest);
		}
	};
	const peek = (key, now = Date.now()) => {
		if (!key) return false;
		const timestamp = cache.get(key);
		if (timestamp === void 0) return false;
		if (ttlMs > 0 && now - timestamp >= ttlMs) {
			cache.delete(key);
			return false;
		}
		return true;
	};
	return {
		check: (key, now = Date.now()) => {
			if (!key) return false;
			const existed = peek(key, now);
			cache.delete(key);
			cache.set(key, now);
			prune(now);
			return existed;
		},
		peek,
		clear: () => cache.clear()
	};
}
var WhatsAppRetryableInboundError = class extends Error {
	constructor(message, options) {
		super(message, options);
		this.name = "WhatsAppRetryableInboundError";
	}
};
function buildMessageKey(params) {
	const accountId = params.accountId.trim();
	const remoteJid = params.remoteJid.trim();
	const messageId = params.messageId.trim();
	if (!accountId || !remoteJid || !messageId || messageId === "unknown") return null;
	return `${accountId}:${remoteJid}:${messageId}`;
}
function resetWebInboundDedupe() {
	claimableInboundMessages.clearMemory();
	recentOutboundMessages.clear();
}
async function claimRecentInboundMessageDelivery(key) {
	return (await claimableInboundMessages.claim(key)).kind;
}
async function commitRecentInboundMessage(key) {
	await claimableInboundMessages.commit(key);
}
function releaseRecentInboundMessage(key, error) {
	claimableInboundMessages.release(key, { error });
}
function rememberRecentOutboundMessage(params) {
	const key = buildMessageKey(params);
	if (!key) return;
	recentOutboundMessages.check(key);
}
function isRecentOutboundMessage(params) {
	const key = buildMessageKey(params);
	if (!key) return false;
	return recentOutboundMessages.peek(key);
}
//#endregion
//#region extensions/whatsapp/src/inbound/durable-receive.ts
const WHATSAPP_DURABLE_INBOUND_PENDING_MAX_ENTRIES = 450;
const WHATSAPP_DURABLE_INBOUND_COMPLETED_MAX_ENTRIES = 450;
const WHATSAPP_DURABLE_INBOUND_PENDING_TTL_MS = 720 * 60 * 60 * 1e3;
const WHATSAPP_DURABLE_INBOUND_COMPLETED_TTL_MS = 10080 * 60 * 1e3;
function hashNamespacePart(value) {
	return createHash("sha256").update(value).digest("hex").slice(0, 24);
}
function createWhatsAppDurableInboundMessageId(params) {
	return createHash("sha256").update(`${params.remoteJid}\n${params.id}`).digest("hex");
}
function serializeWhatsAppDurableInboundMessage(message) {
	return JSON.parse(JSON.stringify(message, BufferJSON.replacer));
}
function deserializeWhatsAppDurableInboundMessage(message) {
	return JSON.parse(JSON.stringify(message), BufferJSON.reviver);
}
function createWhatsAppDurableInboundReceiveJournal(accountId) {
	const accountPart = hashNamespacePart(accountId);
	const runtime = getWhatsAppRuntime();
	return createDurableInboundReceiveJournalFromQueue({
		queue: runtime.state.openChannelIngressQueue({
			accountId: accountPart,
			stateDir: runtime.state.resolveStateDir()
		}),
		retention: {
			pendingTtlMs: WHATSAPP_DURABLE_INBOUND_PENDING_TTL_MS,
			completedTtlMs: WHATSAPP_DURABLE_INBOUND_COMPLETED_TTL_MS,
			failedTtlMs: WHATSAPP_DURABLE_INBOUND_PENDING_TTL_MS,
			pendingMaxEntries: WHATSAPP_DURABLE_INBOUND_PENDING_MAX_ENTRIES,
			completedMaxEntries: WHATSAPP_DURABLE_INBOUND_COMPLETED_MAX_ENTRIES,
			failedMaxEntries: WHATSAPP_DURABLE_INBOUND_PENDING_MAX_ENTRIES
		}
	});
}
//#endregion
//#region extensions/whatsapp/src/inbound/lifecycle.ts
function attachEmitterListener(emitter, event, listener) {
	emitter.on(event, listener);
	return () => {
		if (typeof emitter.off === "function") {
			emitter.off(event, listener);
			return;
		}
		if (typeof emitter.removeListener === "function") emitter.removeListener(event, listener);
	};
}
function closeInboundMonitorSocket(sock) {
	if (typeof sock.end === "function") {
		sock.end(/* @__PURE__ */ new Error("OpenClaw WhatsApp listener close"));
		return;
	}
	sock.ws?.close?.();
}
//#endregion
//#region extensions/whatsapp/src/inbound/media.ts
var WhatsAppInboundMediaLimitExceededError = class extends Error {
	constructor(maxBytes) {
		super(`Media exceeds ${Math.round(maxBytes / (1024 * 1024))}MB limit`);
		this.name = "WhatsAppInboundMediaLimitExceededError";
	}
};
function unwrapMessage(message) {
	return normalizeMessageContent(message);
}
async function downloadInboundMedia(msg, sock, maxBytes = 50 * 1024 * 1024) {
	const message = unwrapMessage(msg.message);
	if (!message) return;
	const mimetype = resolveInboundMediaMimetype(message);
	const fileName = message.documentMessage?.fileName ?? void 0;
	if (!message.imageMessage && !message.videoMessage && !message.documentMessage && !message.audioMessage && !message.stickerMessage) return;
	try {
		return {
			saved: await saveMediaStream(await downloadMediaMessage(msg, "stream", {}, {
				reuploadRequest: sock.updateMediaMessage,
				logger: sock.logger
			}), mimetype, "inbound", maxBytes, fileName).catch((err) => {
				if (err instanceof Error && /Media exceeds/i.test(err.message)) throw new WhatsAppInboundMediaLimitExceededError(maxBytes);
				throw err;
			}),
			mimetype,
			fileName
		};
	} catch (err) {
		if (err instanceof WhatsAppInboundMediaLimitExceededError) throw err;
		logVerbose(`downloadMediaMessage failed: ${String(err)}`);
		return;
	}
}
async function downloadQuotedInboundMedia(msg, sock, maxBytes = 50 * 1024 * 1024) {
	const contextInfo = extractContextInfo(unwrapMessage(msg.message));
	if (!contextInfo?.quotedMessage) return;
	const quotedMessage = contextInfo.quotedMessage;
	return downloadInboundMedia({
		key: {
			id: contextInfo?.stanzaId || void 0,
			remoteJid: contextInfo.remoteJid ?? msg.key?.remoteJid ?? void 0,
			participant: contextInfo?.participant ?? void 0,
			fromMe: false
		},
		message: quotedMessage,
		messageTimestamp: msg.messageTimestamp
	}, sock, maxBytes);
}
//#endregion
//#region extensions/whatsapp/src/inbound/monitor.ts
const LOGGED_OUT_STATUS = DisconnectReason?.loggedOut ?? 401;
const RECONNECT_IN_PROGRESS_ERROR = "no active socket - reconnection in progress";
const GROUP_META_TTL_MS = 300 * 1e3;
const BAILEYS_MESSAGE_TTL_MS = 600 * 1e3;
const INBOUND_CLOSE_DRAIN_TIMEOUT_MS = 5e3;
function resolveGroupMetadataExpiresAt(nowRaw = Date.now()) {
	const now = asDateTimestampMs(nowRaw);
	return now === void 0 ? void 0 : resolveExpiresAtMsFromDurationMs(GROUP_META_TTL_MS, { nowMs: now });
}
function parseWhatsAppTimestampSeconds(value) {
	if (value == null) return;
	if (typeof value === "string") return parseStrictFiniteNumber(value);
	const parsed = Number(value);
	return Number.isFinite(parsed) ? parsed : void 0;
}
function rememberGroupMetadataCacheEntry(cache, jid, entry) {
	if (asDateTimestampMs(entry.expires) === void 0) {
		cache.delete(jid);
		return;
	}
	if (cache.has(jid)) cache.delete(jid);
	cache.set(jid, entry);
	while (cache.size > 500) {
		const oldest = cache.keys().next();
		if (oldest.done) break;
		cache.delete(oldest.value);
	}
}
function readGroupMetadataCacheEntry(cache, jid) {
	const entry = cache.get(jid);
	if (!entry) return null;
	const now = asDateTimestampMs(Date.now());
	const expires = asDateTimestampMs(entry.expires);
	if (now === void 0 || expires === void 0 || expires <= now) {
		cache.delete(jid);
		return null;
	}
	cache.delete(jid);
	cache.set(jid, entry);
	return entry;
}
function rememberWhatsAppBaileysCacheEntry(cache, key, value, ttlMs) {
	if (!cache) return;
	if (cache.has(key)) cache.delete(key);
	cache.set(key, {
		expiresAt: Date.now() + ttlMs,
		value
	});
	while (cache.size > 500) {
		const oldest = cache.keys().next();
		if (oldest.done) break;
		cache.delete(oldest.value);
	}
}
function readWhatsAppBaileysCacheEntry(cache, key) {
	const entry = cache.get(key);
	if (!entry) return;
	if (entry.expiresAt <= Date.now()) {
		cache.delete(key);
		return;
	}
	cache.delete(key);
	cache.set(key, entry);
	return entry.value;
}
function logWhatsAppVerbose(enabled, message) {
	if (!enabled) return;
	defaultRuntime.log(message);
}
function isGroupJid(jid) {
	return (typeof isJidGroup === "function" ? isJidGroup(jid) : jid.endsWith("@g.us")) === true;
}
function recordAcceptedInboundActivity(accountId) {
	recordChannelActivity({
		channel: "whatsapp",
		accountId,
		direction: "inbound"
	});
}
function isRetryableSendDisconnectError(err) {
	if (isWhatsAppSocketOperationTimeoutError(err)) return false;
	return /closed|reset|timed\s*out|disconnect|no active socket/i.test(formatError(err));
}
function shouldClearSocketRefAfterSendFailure(err) {
	return /closed|reset|disconnect|no active socket/i.test(formatError(err));
}
function isNonEmptyString(value) {
	return Boolean(value);
}
async function attachWebInboxToSocket(options) {
	const inboundLogger = getChildLogger({ module: "web-inbound" });
	const inboundConsoleLog = createSubsystemLogger("gateway/channels/whatsapp").child("inbound");
	const sock = options.sock;
	const connectedAtMs = Date.now();
	if (options.socketRef) options.socketRef.current = sock;
	const shouldRetryDisconnect = () => options.shouldRetryDisconnect?.() === true;
	const disconnectRetryPolicy = options.disconnectRetryPolicy ?? DEFAULT_RECONNECT_POLICY;
	const sendRetryMaxAttempts = disconnectRetryPolicy.maxAttempts > 0 ? disconnectRetryPolicy.maxAttempts : DEFAULT_RECONNECT_POLICY.maxAttempts;
	const sendOperationTimeoutMs = resolveWhatsAppSocketOperationTimeoutMs(options.socketTiming.defaultQueryTimeoutMs);
	let onCloseResolve = null;
	const onClose = new Promise((resolve) => {
		onCloseResolve = resolve;
	});
	const resolveClose = (reason) => {
		if (!onCloseResolve) return;
		const resolver = onCloseResolve;
		onCloseResolve = null;
		resolver(reason);
	};
	const presence = options.selfChatMode ? "unavailable" : "available";
	try {
		await createWhatsAppSocketOperationTimeoutAdapter(sock, sendOperationTimeoutMs).sendPresenceUpdate(presence);
		logWhatsAppVerbose(options.verbose, `Sent global '${presence}' presence on connect`);
	} catch (err) {
		logWhatsAppVerbose(options.verbose, `Failed to send '${presence}' presence on connect: ${String(err)}`);
	}
	const selfIdentity = await readWebSelfIdentityForDecision(options.authDir, sock.user);
	if (selfIdentity.outcome === "unstable") throw new WhatsAppAuthUnstableError("WhatsApp auth state is still stabilizing; retrying inbox attach.");
	const self = selfIdentity.identity;
	const getCurrentSock = () => {
		if (!options.socketRef) return sock;
		if (options.socketRef.current) return options.socketRef.current;
		if (!self.e164 && !self.jid && !self.lid) return null;
		const successor = getRegisteredWhatsAppConnectionController(options.accountId);
		if (!successor) return null;
		const successorIdentity = successor.getSelfIdentity();
		if (!successorIdentity || !identitiesOverlap(self, successorIdentity)) return null;
		return successor.getCurrentSock();
	};
	const durableInboundJournal = createWhatsAppDurableInboundReceiveJournal(options.accountId);
	const inboundDebounceMs = Math.max(0, Math.trunc(options.debounceMs ?? 0));
	const pendingDebounceKeys = /* @__PURE__ */ new Set();
	const activeInboundFlushes = /* @__PURE__ */ new Set();
	const buildInboundDebounceKey = (msg) => {
		const admission = requireWhatsAppInboundAdmission(msg);
		const sender = msg.platform.sender;
		const senderKey = admission.conversation.kind === "group" ? getPrimaryIdentityId(sender ?? null) ?? msg.platform.senderJid ?? msg.platform.senderE164 ?? msg.platform.senderName ?? admission.sender.id : admission.conversation.id;
		if (!senderKey) return null;
		return `${admission.accountId}:${admission.conversation.id}:${senderKey}`;
	};
	const shouldDebounceInboundMessage = (msg) => options.shouldDebounce?.(msg) ?? true;
	const orderDebouncedInboundEntries = (entries) => entries.toSorted((a, b) => {
		const timestampDiff = (a.event.timestamp ?? 0) - (b.event.timestamp ?? 0);
		if (timestampDiff !== 0) return timestampDiff;
		return (a.receiveOrder ?? 0) - (b.receiveOrder ?? 0);
	});
	const finalizeInboundDelivery = async (entries, error) => {
		const dedupeKeys = uniqueStrings(entries.map((entry) => entry.dedupeKey).filter(isNonEmptyString));
		const durableEntries = entries.filter((entry) => isNonEmptyString(entry.durableId));
		const readReceiptEntries = entries.filter((entry) => Boolean(entry.readReceipt));
		if (error instanceof WhatsAppRetryableInboundError) {
			dedupeKeys.forEach((dedupeKey) => releaseRecentInboundMessage(dedupeKey, error));
			await Promise.all(durableEntries.map((entry) => durableInboundJournal.release(entry.durableId, { lastError: formatError(error) })));
			return;
		}
		await Promise.all([...dedupeKeys.map((dedupeKey) => commitRecentInboundMessage(dedupeKey)), ...durableEntries.map((entry) => durableInboundJournal.complete(entry.durableId, entry.readReceipt ? { metadata: { readReceipt: entry.readReceipt } } : void 0))]);
		await Promise.all(readReceiptEntries.map((entry) => maybeMarkInboundAsRead(entry.readReceipt)));
	};
	const debouncer = createInboundDebouncer({
		debounceMs: inboundDebounceMs,
		buildKey: (msg) => msg.debounceKey ?? buildInboundDebounceKey(msg),
		shouldDebounce: shouldDebounceInboundMessage,
		onFlush: async (entries) => {
			let finishFlush;
			const flushTask = new Promise((resolve) => {
				finishFlush = resolve;
			});
			activeInboundFlushes.add(flushTask);
			try {
				const orderedEntries = orderDebouncedInboundEntries(entries);
				const last = orderedEntries.at(-1);
				if (!last) return;
				try {
					if (orderedEntries.length === 1) {
						await options.onMessage(last);
						await finalizeInboundDelivery(orderedEntries);
						return;
					}
					const mentioned = /* @__PURE__ */ new Set();
					for (const entry of orderedEntries) for (const jid of entry.group?.mentions?.jids ?? []) mentioned.add(jid);
					const combinedBody = orderedEntries.map((entry) => entry.payload.body).filter(Boolean).join("\n");
					const combinedMentions = mentioned.size > 0 ? {
						...last.group?.mentions,
						jids: Array.from(mentioned)
					} : last.group?.mentions;
					const combinedGroup = last.group || combinedMentions ? {
						...last.group,
						mentions: combinedMentions
					} : void 0;
					const combinedMessage = withDeprecatedWebInboundMessageFlatAliases({
						...last,
						payload: {
							...last.payload,
							body: combinedBody
						},
						group: combinedGroup,
						event: {
							...last.event,
							isBatched: true
						}
					});
					await options.onMessage(combinedMessage);
					await finalizeInboundDelivery(orderedEntries);
				} catch (error) {
					await finalizeInboundDelivery(orderedEntries, error);
					throw error;
				}
			} finally {
				for (const entry of entries) if (entry.debounceKey) pendingDebounceKeys.delete(entry.debounceKey);
				activeInboundFlushes.delete(flushTask);
				finishFlush();
			}
		},
		onError: (err) => {
			inboundLogger.error({ error: String(err) }, "failed handling inbound web message");
			inboundConsoleLog.error(`Failed handling inbound web message: ${String(err)}`);
		}
	});
	const groupMetadataCache = options.groupMetadataCache ?? /* @__PURE__ */ new Map();
	const groupMetaCache = /* @__PURE__ */ new Map();
	const lidLookup = sock.signalRepository?.lidMapping;
	const publishedGroupMetadataJids = /* @__PURE__ */ new Set();
	const invalidatedGroupMetadataJids = /* @__PURE__ */ new Set();
	let groupMetadataCacheClosed = false;
	const resolveInboundJid = async (jid) => resolveJidToE164(jid, {
		authDir: options.authDir,
		lidLookup
	});
	const resolveReactionTargetJids = async (jid) => resolveEquivalentWhatsAppDirectChatJids(jid, {
		authDir: options.authDir,
		lidLookup
	});
	const rememberBaileysMessage = (remoteJid, messageId, message) => {
		if (!options.recentMessageKeys || !remoteJid || !messageId || !message) return;
		rememberWhatsAppBaileysCacheEntry(options.recentMessageKeys, `${remoteJid}:${messageId}`, message, BAILEYS_MESSAGE_TTL_MS);
	};
	const rememberOutboundMessage = (remoteJid, result) => {
		const messageId = typeof result === "object" && result && "key" in result ? result.key?.id ?? "" : "";
		if (!messageId) return;
		rememberRecentOutboundMessage({
			accountId: options.accountId,
			remoteJid,
			messageId
		});
		rememberBaileysMessage(remoteJid, messageId, typeof result === "object" && result && "message" in result ? result.message : void 0);
	};
	const trackLateAcceptedSend = (jid, promise) => {
		promise.then((result) => {
			rememberOutboundMessage(jid, result);
		}, () => {});
	};
	const sendTrackedMessage = async (jid, content, sendOptions) => {
		let lastErr = /* @__PURE__ */ new Error(RECONNECT_IN_PROGRESS_ERROR);
		for (let attempt = 1;; attempt++) {
			const currentSock = getCurrentSock();
			if (currentSock) try {
				const result = await createWhatsAppSocketOperationTimeoutAdapter(currentSock, sendOperationTimeoutMs, { onSendMessageTimeout: ({ jid: timedOutJid, promise }) => {
					trackLateAcceptedSend(timedOutJid, promise);
				} }).sendMessage(jid, content, sendOptions);
				rememberOutboundMessage(jid, result);
				return result;
			} catch (err) {
				if (!shouldRetryDisconnect() || !isRetryableSendDisconnectError(err)) throw err;
				lastErr = err;
				if (shouldClearSocketRefAfterSendFailure(err) && options.socketRef?.current === currentSock) options.socketRef.current = null;
			}
			else if (!shouldRetryDisconnect()) throw lastErr;
			if (attempt >= sendRetryMaxAttempts) throw lastErr;
			const delayMs = computeBackoff(disconnectRetryPolicy, attempt);
			logWhatsAppVerbose(options.verbose, `Waiting ${delayMs}ms for WhatsApp reconnect before retrying send to ${jid}: ${formatError(lastErr)}`);
			try {
				await sleepWithAbort(delayMs, options.disconnectRetryAbortSignal);
			} catch {
				throw lastErr;
			}
		}
	};
	const sendApiSocketOperations = {
		sendMessage: (jid, content, sendOptions) => sendTrackedMessage(jid, content, sendOptions),
		sendPresenceUpdate: async (presenceLocal, jid) => {
			const currentSock = getCurrentSock();
			if (!currentSock) throw new Error(RECONNECT_IN_PROGRESS_ERROR);
			return await createWhatsAppSocketOperationTimeoutAdapter(currentSock, sendOperationTimeoutMs).sendPresenceUpdate(presenceLocal, jid);
		}
	};
	const summarizeGroupMeta = async (meta) => {
		const participantEntries = await Promise.all(meta.participants?.map(async (p) => {
			const mapped = await resolveInboundJid(p.id);
			return {
				display: mapped ?? p.id,
				mention: {
					id: p.id,
					lid: p.lid,
					phoneNumber: p.phoneNumber,
					e164: mapped
				}
			};
		}) ?? []);
		const participants = participantEntries.map((entry) => entry.display).filter(Boolean);
		const mentionParticipants = participantEntries.map((entry) => entry.mention);
		return {
			subject: meta.subject,
			participants,
			mentionParticipants,
			expires: resolveGroupMetadataExpiresAt() ?? 0
		};
	};
	const summarizeGroupMetaForReconnectCache = (meta) => ({
		subject: meta.subject,
		expires: resolveGroupMetadataExpiresAt() ?? NaN
	});
	const getGroupMeta = async (jid) => {
		const cached = readGroupMetadataCacheEntry(groupMetaCache, jid);
		if (cached) return cached;
		try {
			const meta = await (getCurrentSock() ?? sock).groupMetadata(jid);
			rememberWhatsAppBaileysCacheEntry(options.baileysGroupMetaCache, jid, meta, GROUP_META_TTL_MS);
			publishedGroupMetadataJids.add(jid);
			const entry = await summarizeGroupMeta(meta);
			rememberGroupMetadataCacheEntry(groupMetadataCache, jid, {
				subject: entry.subject,
				expires: entry.expires
			});
			rememberGroupMetadataCacheEntry(groupMetaCache, jid, entry);
			return entry;
		} catch (err) {
			const hydrated = readGroupMetadataCacheEntry(groupMetadataCache, jid);
			if (hydrated) {
				rememberGroupMetadataCacheEntry(groupMetaCache, jid, hydrated);
				logWhatsAppVerbose(options.verbose, `Using cached group metadata for ${jid} after fetch failure: ${String(err)}`);
				return hydrated;
			}
			logWhatsAppVerbose(options.verbose, `Failed to fetch group metadata for ${jid}: ${String(err)}`);
			return { expires: resolveGroupMetadataExpiresAt() ?? 0 };
		}
	};
	const resolveOutboundMentionsForGroup = async (jid, text) => {
		if (!isGroupJid(jid) || !mayContainWhatsAppOutboundMention(text)) return {
			text,
			mentionedJids: []
		};
		return resolveWhatsAppOutboundMentions({
			chatJid: jid,
			text,
			participants: (await getGroupMeta(jid)).mentionParticipants
		});
	};
	const applyOutboundMentionsToContent = async (jid, content) => {
		if ("text" in content && typeof content.text === "string") {
			const resolved = await resolveOutboundMentionsForGroup(jid, content.text);
			return addWhatsAppOutboundMentionsToContent({
				...content,
				text: resolved.text
			}, resolved.mentionedJids);
		}
		const caption = content.caption;
		if (typeof caption === "string") {
			const resolved = await resolveOutboundMentionsForGroup(jid, caption);
			return addWhatsAppOutboundMentionsToContent({
				...content,
				caption: resolved.text
			}, resolved.mentionedJids);
		}
		return content;
	};
	const normalizeInboundMessage = async (msg) => {
		const id = msg.key?.id ?? void 0;
		const remoteJid = msg.key?.remoteJid;
		if (!remoteJid) return null;
		if (remoteJid.endsWith("@status") || remoteJid.endsWith("@broadcast")) return null;
		const group = isGroupJid(remoteJid);
		if (Boolean(msg.key?.fromMe) && id && isRecentOutboundMessage({
			accountId: options.accountId,
			remoteJid,
			messageId: id
		})) {
			logWhatsAppVerbose(options.verbose, `Skipping recent outbound WhatsApp echo ${id} for ${remoteJid}`);
			return null;
		}
		if (!hasInboundUserContent(msg.message ?? void 0)) return null;
		const participantJid = msg.key?.participant ?? void 0;
		const from = group ? remoteJid : await resolveInboundJid(remoteJid);
		if (!from) return null;
		const senderE164 = group ? participantJid ? await resolveInboundJid(participantJid) : null : from;
		let groupSubject;
		let groupParticipants;
		if (group) {
			const meta = await getGroupMeta(remoteJid);
			groupSubject = meta.subject;
			groupParticipants = meta.participants;
		}
		const messageTimestampSeconds = parseWhatsAppTimestampSeconds(msg.messageTimestamp);
		const messageTimestampMs = messageTimestampSeconds !== void 0 ? messageTimestampSeconds * 1e3 : void 0;
		const access = await checkInboundAccessControl({
			cfg: options.loadConfig?.() ?? options.cfg,
			accountId: options.accountId,
			from,
			selfE164: self.e164 ?? null,
			senderE164,
			senderJid: participantJid,
			group,
			pushName: msg.pushName ?? void 0,
			isFromMe: Boolean(msg.key?.fromMe),
			messageTimestampMs,
			connectedAtMs,
			verbose: options.verbose,
			sock: { sendMessage: (jid, content) => sendTrackedMessage(jid, content) },
			remoteJid
		});
		if (!access.allowed) return null;
		return {
			id,
			remoteJid,
			group,
			participantJid,
			from,
			senderE164,
			groupSubject,
			groupParticipants,
			messageTimestampMs,
			access
		};
	};
	const buildReadReceiptTarget = (inbound) => inbound.id ? {
		remoteJid: inbound.remoteJid,
		id: inbound.id,
		...inbound.participantJid ? { participant: inbound.participantJid } : {}
	} : void 0;
	const maybeMarkInboundAsRead = async (target) => {
		if (!target || options.sendReadReceipts === false) return;
		const { id, remoteJid, participant } = target;
		try {
			await withWhatsAppSocketOperationTimeout("readMessages", (getCurrentSock() ?? sock).readMessages([{
				remoteJid,
				id,
				participant,
				fromMe: false
			}]), sendOperationTimeoutMs);
			const suffix = participant ? ` (participant ${participant})` : "";
			logWhatsAppVerbose(options.verbose, `Marked message ${id} as read for ${remoteJid}${suffix}`);
		} catch (err) {
			logWhatsAppVerbose(options.verbose, `Failed to mark message ${id} read: ${String(err)}`);
		}
	};
	const maybeLogSkippedSelfChatReadReceipt = (inbound, target) => {
		if (target?.id && inbound.access.isSelfChat && options.verbose) logWhatsAppVerbose(options.verbose, `Self-chat mode: skipping read receipt for ${target.id}`);
	};
	const maybeMarkNonSelfChatReadReceipt = async (inbound, target) => {
		if (inbound.access.isSelfChat) {
			maybeLogSkippedSelfChatReadReceipt(inbound, target);
			return;
		}
		await maybeMarkInboundAsRead(target);
	};
	const completeUndeliverableDurableInbound = async (durableId, metadata) => {
		if (!durableId) return;
		await durableInboundJournal.complete(durableId, metadata?.readReceipt ? { metadata: { readReceipt: metadata.readReceipt } } : void 0);
	};
	const buildDurableInboundPayload = (msg, upsertType) => ({
		message: serializeWhatsAppDurableInboundMessage(msg),
		...upsertType ? { upsertType } : {},
		receivedAt: Date.now()
	});
	const shouldSkipStaleAppend = (msg, upsertType) => {
		if (upsertType !== "append") return false;
		const APPEND_RECENT_GRACE_MS = 6e4;
		const msgTsSeconds = parseWhatsAppTimestampSeconds(msg.messageTimestamp);
		return (msgTsSeconds !== void 0 ? msgTsSeconds * 1e3 : 0) < connectedAtMs - APPEND_RECENT_GRACE_MS;
	};
	const processDurableInboundMessage = async (msg, upsertType, receiveOrder, stored) => {
		const inbound = await normalizeInboundMessage(msg);
		if (!inbound) {
			if (stored) await completeUndeliverableDurableInbound(stored.id, stored.metadata);
			return;
		}
		const readReceipt = stored?.metadata?.readReceipt ?? buildReadReceiptTarget(inbound);
		const deliveryReadReceipt = inbound.access.isSelfChat ? void 0 : readReceipt;
		if (!stored && shouldSkipStaleAppend(msg, upsertType)) {
			await maybeMarkNonSelfChatReadReceipt(inbound, readReceipt);
			return;
		}
		let durableId = stored?.id ?? (inbound.id ? createWhatsAppDurableInboundMessageId({
			remoteJid: inbound.remoteJid,
			id: inbound.id
		}) : void 0);
		const durableMetadata = deliveryReadReceipt ? { readReceipt: deliveryReadReceipt } : void 0;
		if (durableId && !stored) try {
			const accepted = await durableInboundJournal.accept(durableId, buildDurableInboundPayload(msg, upsertType), {
				metadata: durableMetadata,
				receivedAt: inbound.messageTimestampMs
			});
			if (accepted.kind === "completed") {
				await maybeMarkNonSelfChatReadReceipt(inbound, accepted.record.metadata?.readReceipt ?? deliveryReadReceipt);
				return;
			}
			if (accepted.kind === "pending" && accepted.record.attempts === 0) return;
		} catch (err) {
			durableId = void 0;
			const error = formatError(err);
			inboundLogger.warn({ error }, "failed persisting durable WhatsApp inbound; delivering live");
			inboundConsoleLog.warn(`Failed persisting durable WhatsApp inbound; delivering live: ${error}`);
		}
		const enriched = await enrichInboundMessage(msg);
		if (!enriched) {
			await completeUndeliverableDurableInbound(durableId, durableMetadata);
			await maybeMarkNonSelfChatReadReceipt(inbound, deliveryReadReceipt);
			return;
		}
		const dedupeKey = inbound.id ? `${options.accountId}:${inbound.remoteJid}:${inbound.id}` : "";
		const dedupeClaim = dedupeKey ? await claimRecentInboundMessageDelivery(dedupeKey) : "claimed";
		if (dedupeClaim !== "claimed") {
			if (dedupeClaim === "duplicate") {
				await completeUndeliverableDurableInbound(durableId, durableMetadata);
				await maybeMarkNonSelfChatReadReceipt(inbound, deliveryReadReceipt);
			}
			return;
		}
		recordAcceptedInboundActivity(options.accountId);
		await enqueueInboundMessage(msg, inbound, enriched, {
			durableId,
			readReceipt: deliveryReadReceipt,
			receiveOrder
		});
	};
	const replayPendingDurableInboundMessages = async () => {
		const pending = await durableInboundJournal.pending();
		for (const record of pending) await processDurableInboundMessage(deserializeWhatsAppDurableInboundMessage(record.payload.message), record.payload.upsertType, record.payload.receivedAt, {
			id: record.id,
			payload: record.payload,
			metadata: record.metadata
		});
	};
	const enrichInboundMessage = async (msg) => {
		const location = extractLocationData(msg.message ?? void 0);
		const locationText = location ? formatLocationText(location) : void 0;
		const contactContext = extractContactContext(msg.message ?? void 0);
		const externalAdReplyContext = extractExternalAdReplyContext(msg.message ?? void 0);
		let body = extractText(msg.message ?? void 0);
		if (locationText) body = [body, locationText].filter(Boolean).join("\n").trim();
		if (!body) {
			body = extractMediaPlaceholder(msg.message ?? void 0);
			if (!body) return null;
		}
		const replyContext = describeReplyContext(msg.message);
		let mediaPath;
		let mediaType;
		let mediaFileName;
		const maxBytes = (typeof options.mediaMaxMb === "number" && options.mediaMaxMb > 0 ? options.mediaMaxMb : 50) * 1024 * 1024;
		const saveInboundMedia = async (inboundMedia) => {
			if (!inboundMedia) return;
			mediaPath = inboundMedia.saved.path;
			mediaType = inboundMedia.mimetype;
			mediaFileName = inboundMedia.fileName;
		};
		try {
			await saveInboundMedia(await downloadInboundMedia(msg, sock, maxBytes));
			if (!mediaPath && replyContext) await saveInboundMedia(await downloadQuotedInboundMedia(msg, sock, maxBytes));
		} catch (err) {
			logWhatsAppVerbose(options.verbose, `Inbound media download failed: ${String(err)}`);
		}
		return {
			body,
			location: location ?? void 0,
			contactContext,
			externalAdReplyContext,
			replyContext,
			mediaPath,
			mediaType,
			mediaFileName
		};
	};
	const enqueueInboundMessage = async (msg, inbound, enriched, durable) => {
		const chatJid = inbound.remoteJid;
		const sendComposing = async () => {
			if (!getCurrentSock()) return;
			try {
				await sendApiSocketOperations.sendPresenceUpdate("composing", chatJid);
			} catch (err) {
				logWhatsAppVerbose(options.verbose, `Presence update failed: ${String(err)}`);
			}
		};
		const reply = async (text, optionsResult) => {
			const resolved = await resolveOutboundMentionsForGroup(chatJid, text);
			return normalizeWhatsAppSendResult(await sendTrackedMessage(chatJid, addWhatsAppOutboundMentionsToContent({ text: resolved.text }, resolved.mentionedJids), optionsResult), "text");
		};
		const sendMedia = async (payload, optionsValue) => {
			return normalizeWhatsAppSendResult(await sendTrackedMessage(chatJid, await applyOutboundMentionsToContent(chatJid, await addWhatsAppImagePreviewFields(payload)), optionsValue), "media");
		};
		const timestamp = inbound.messageTimestampMs;
		const mentionedJids = extractMentionedJids(msg.message);
		const senderName = msg.pushName ?? void 0;
		inboundLogger.info({
			from: inbound.from,
			to: self.e164 ?? "me",
			body: enriched.body,
			mediaPath: enriched.mediaPath,
			mediaType: enriched.mediaType,
			mediaFileName: enriched.mediaFileName,
			timestamp
		}, "inbound message");
		const media = enriched.mediaPath || enriched.mediaType || enriched.mediaFileName ? {
			path: enriched.mediaPath,
			type: enriched.mediaType,
			fileName: enriched.mediaFileName
		} : void 0;
		const groupMentions = mentionedJids ? { jids: mentionedJids } : void 0;
		const group = inbound.group && (inbound.groupSubject || inbound.groupParticipants?.length || groupMentions) ? {
			subject: inbound.groupSubject,
			participants: inbound.groupParticipants,
			mentions: groupMentions
		} : void 0;
		const untrustedStructuredContext = [...enriched.contactContext ? [{
			label: "WhatsApp contact",
			source: "whatsapp",
			type: enriched.contactContext.kind,
			payload: enriched.contactContext
		}] : [], ...enriched.externalAdReplyContext ? [{
			label: "WhatsApp external ad reply",
			source: "whatsapp",
			type: "external_ad_reply",
			payload: enriched.externalAdReplyContext
		}] : []];
		const inboundMessage = withDeprecatedWebInboundMessageFlatAliases({
			admission: inbound.access.admission,
			event: {
				id: inbound.id,
				timestamp
			},
			payload: {
				body: enriched.body,
				location: enriched.location ?? void 0,
				untrustedStructuredContext: untrustedStructuredContext.length > 0 ? untrustedStructuredContext : void 0,
				media
			},
			platform: {
				chatJid: inbound.remoteJid,
				recipientJid: self.e164 ?? "me",
				pushName: senderName,
				sender: resolveComparableIdentity({
					jid: inbound.participantJid,
					e164: inbound.senderE164 ?? void 0,
					name: senderName
				}),
				senderJid: inbound.participantJid,
				senderE164: inbound.senderE164 ?? void 0,
				senderName,
				self,
				selfJid: self.jid ?? void 0,
				selfLid: self.lid ?? void 0,
				selfE164: self.e164 ?? void 0,
				fromMe: Boolean(msg.key?.fromMe),
				sendComposing,
				reply,
				sendMedia
			},
			quote: enriched.replyContext ? {
				context: enriched.replyContext,
				id: enriched.replyContext.id,
				body: enriched.replyContext.body,
				sender: {
					displayName: enriched.replyContext.sender?.label ?? void 0,
					jid: enriched.replyContext.sender?.jid ?? void 0,
					e164: enriched.replyContext.sender?.e164 ?? void 0
				}
			} : void 0,
			group,
			dedupeKey: inbound.id ? `${options.accountId}:${inbound.remoteJid}:${inbound.id}` : void 0,
			durableId: durable.durableId,
			readReceipt: durable.readReceipt,
			receiveOrder: durable.receiveOrder
		});
		const debounceKey = buildInboundDebounceKey(inboundMessage);
		if (debounceKey) {
			inboundMessage.debounceKey = debounceKey;
			if (inboundDebounceMs > 0 && shouldDebounceInboundMessage(inboundMessage)) pendingDebounceKeys.add(debounceKey);
		}
		if (inboundMessage.event.id) {
			const admission = requireWhatsAppInboundAdmission(inboundMessage);
			cacheInboundMessageMeta(admission.accountId, inboundMessage.platform.chatJid, inboundMessage.event.id, {
				participant: inboundMessage.platform.senderJid,
				participantE164: admission.conversation.kind === "direct" ? inboundMessage.platform.senderE164 : void 0,
				body: inboundMessage.payload.body,
				fromMe: inboundMessage.platform.fromMe
			});
		}
		try {
			Promise.resolve(debouncer.enqueue(inboundMessage)).catch((err) => {
				inboundLogger.error({ error: String(err) }, "failed handling inbound web message");
				inboundConsoleLog.error(`Failed handling inbound web message: ${String(err)}`);
			});
		} catch (err) {
			inboundLogger.error({ error: String(err) }, "failed handling inbound web message");
			inboundConsoleLog.error(`Failed handling inbound web message: ${String(err)}`);
		}
	};
	const pendingMessageHandlers = /* @__PURE__ */ new Set();
	let nextReceiveOrder = 0;
	const handleMessagesUpsert = async (upsert) => {
		if (upsert.type !== "notify" && upsert.type !== "append") return;
		for (const msg of upsert.messages ?? []) {
			rememberBaileysMessage(msg.key?.remoteJid, msg.key?.id, msg.message);
			const receiveOrder = nextReceiveOrder++;
			if (await maybeResolveWhatsAppApprovalReaction({
				cfg: options.loadConfig?.() ?? options.cfg,
				accountId: options.accountId,
				msg,
				selfJid: self.jid,
				selfLid: self.lid,
				resolveInboundJid,
				resolveReactionTargetJids,
				logVerboseMessage: (message) => logWhatsAppVerbose(options.verbose, message)
			})) continue;
			await processDurableInboundMessage(msg, upsert.type, receiveOrder);
		}
	};
	const handleMessagesUpsertEvent = (upsert) => {
		const task = handleMessagesUpsert(upsert).catch((err) => {
			inboundLogger.error({ error: String(err) }, "messages.upsert handler error");
			inboundConsoleLog.error(`Messages upsert handler error: ${String(err)}`);
		});
		pendingMessageHandlers.add(task);
		task.finally(() => {
			pendingMessageHandlers.delete(task);
		});
	};
	const waitForPendingMessageHandlers = async () => {
		while (pendingMessageHandlers.size > 0) await Promise.all(Array.from(pendingMessageHandlers));
	};
	const drainDebouncedInboundMessages = async () => {
		while (pendingDebounceKeys.size > 0 || activeInboundFlushes.size > 0) {
			const debounceKeys = Array.from(pendingDebounceKeys);
			if (debounceKeys.length > 0) await Promise.all(debounceKeys.map((key) => debouncer.flushKey(key)));
			const flushes = Array.from(activeInboundFlushes);
			if (flushes.length > 0) await Promise.allSettled(flushes);
			await Promise.resolve();
		}
	};
	const drainInboundBeforeSocketClose = async () => {
		groupMetadataCacheClosed = true;
		await waitForPendingMessageHandlers();
		await drainDebouncedInboundMessages();
	};
	const drainInboundBeforeSocketCloseWithTimeout = async () => {
		let timeout = null;
		try {
			await Promise.race([drainInboundBeforeSocketClose(), new Promise((_, reject) => {
				timeout = setTimeout(() => {
					reject(/* @__PURE__ */ new Error(`Timed out draining WhatsApp inbound debounce after ${INBOUND_CLOSE_DRAIN_TIMEOUT_MS}ms`));
				}, INBOUND_CLOSE_DRAIN_TIMEOUT_MS);
				timeout.unref?.();
			})]);
		} finally {
			if (timeout) clearTimeout(timeout);
		}
	};
	const handleConnectionUpdate = (update) => {
		try {
			if (update.connection === "close") {
				if (options.socketRef?.current === sock) options.socketRef.current = null;
				const status = getStatusCode(update.lastDisconnect?.error);
				resolveClose({
					status,
					isLoggedOut: status === LOGGED_OUT_STATUS,
					error: update.lastDisconnect?.error
				});
			}
		} catch (err) {
			inboundLogger.error({ error: String(err) }, "connection.update handler error");
			resolveClose({
				status: void 0,
				isLoggedOut: false,
				error: err
			});
		}
	};
	const attachSockListener = (event, listener) => attachEmitterListener(sock.ev, event, listener);
	const detachMessagesUpsert = attachSockListener("messages.upsert", handleMessagesUpsertEvent);
	const detachConnectionUpdate = attachSockListener("connection.update", handleConnectionUpdate);
	const isFullGroupMetadataUpdate = (update) => typeof update.id === "string" && typeof update.subject === "string" && Array.isArray(update.participants);
	const rememberFullGroupMetadataUpdate = (jid, meta) => {
		if (groupMetadataCacheClosed) return;
		rememberWhatsAppBaileysCacheEntry(options.baileysGroupMetaCache, jid, meta, GROUP_META_TTL_MS);
		publishedGroupMetadataJids.add(jid);
		invalidatedGroupMetadataJids.delete(jid);
		rememberGroupMetadataCacheEntry(groupMetadataCache, jid, summarizeGroupMetaForReconnectCache(meta));
		groupMetaCache.delete(jid);
	};
	const forgetFullGroupMetadata = (jid) => {
		options.baileysGroupMetaCache?.delete(jid);
		groupMetadataCache.delete(jid);
		groupMetaCache.delete(jid);
		publishedGroupMetadataJids.delete(jid);
		invalidatedGroupMetadataJids.add(jid);
	};
	const detachGroupsUpsert = attachSockListener("groups.upsert", ((groups) => {
		for (const group of groups) if (group.id) rememberFullGroupMetadataUpdate(group.id, group);
	}));
	const detachGroupsUpdate = attachSockListener("groups.update", ((updates) => {
		for (const update of updates) {
			if (!update.id) continue;
			if (isFullGroupMetadataUpdate(update)) {
				rememberFullGroupMetadataUpdate(update.id, update);
				continue;
			}
			forgetFullGroupMetadata(update.id);
		}
	}));
	const detachGroupParticipantsUpdate = attachSockListener("group-participants.update", ((update) => {
		forgetFullGroupMetadata(update.id);
	}));
	const replayTask = replayPendingDurableInboundMessages().catch((err) => {
		inboundLogger.error({ error: String(err) }, "failed replaying durable WhatsApp inbound");
		inboundConsoleLog.error(`Failed replaying durable WhatsApp inbound: ${String(err)}`);
	});
	pendingMessageHandlers.add(replayTask);
	replayTask.finally(() => {
		pendingMessageHandlers.delete(replayTask);
	});
	(async () => {
		try {
			const groups = await sock.groupFetchAllParticipating();
			if (groupMetadataCacheClosed) return;
			for (const [jid, meta] of Object.entries(groups ?? {})) if (meta && !publishedGroupMetadataJids.has(jid) && !invalidatedGroupMetadataJids.has(jid)) {
				rememberGroupMetadataCacheEntry(groupMetadataCache, jid, summarizeGroupMetaForReconnectCache(meta));
				rememberWhatsAppBaileysCacheEntry(options.baileysGroupMetaCache, jid, meta, GROUP_META_TTL_MS);
				publishedGroupMetadataJids.add(jid);
			}
			logWhatsAppVerbose(options.verbose, `Hydrated ${Object.keys(groups ?? {}).length} participating groups on connect`);
		} catch (err) {
			const error = String(err);
			inboundLogger.warn({ error }, "failed hydrating participating groups on connect");
			inboundConsoleLog.warn(`Failed hydrating participating groups on connect: ${error}`);
			logWhatsAppVerbose(options.verbose, `Failed to hydrate participating groups on connect: ${error}`);
		}
	})();
	const sendApi = createWebSendApi({
		sock: sendApiSocketOperations,
		defaultAccountId: options.accountId,
		resolveOutboundMentions: ({ jid, text }) => resolveOutboundMentionsForGroup(jid, text),
		authDir: options.authDir
	});
	return {
		close: async () => {
			try {
				detachMessagesUpsert();
				detachConnectionUpdate();
				detachGroupsUpsert();
				detachGroupsUpdate();
				detachGroupParticipantsUpdate();
				await drainInboundBeforeSocketCloseWithTimeout();
			} catch (err) {
				logWhatsAppVerbose(options.verbose, `Inbound close drain failed: ${String(err)}`);
			}
			try {
				closeInboundMonitorSocket(sock);
			} catch (err) {
				logWhatsAppVerbose(options.verbose, `Socket close failed: ${String(err)}`);
			}
		},
		onClose,
		signalClose: (reason) => {
			resolveClose(reason ?? {
				status: void 0,
				isLoggedOut: false,
				error: "closed"
			});
		},
		sendComposingTo: sendApi.sendComposingTo,
		sendMessage: sendApi.sendMessage,
		sendPoll: sendApi.sendPoll,
		sendReaction: sendApi.sendReaction
	};
}
async function monitorWebInbox(options) {
	const socketTiming = options.socketTiming ?? resolveWhatsAppSocketTiming(options.cfg);
	const recentMessageKeys = options.recentMessageKeys ?? /* @__PURE__ */ new Map();
	const baileysGroupMetaCache = options.baileysGroupMetaCache ?? /* @__PURE__ */ new Map();
	const sock = await createWaSocket(false, options.verbose, {
		authDir: options.authDir,
		...socketTiming,
		getMessage: async (key) => key.id && key.remoteJid ? readWhatsAppBaileysCacheEntry(recentMessageKeys, `${key.remoteJid}:${key.id}`) : void 0,
		cachedGroupMetadata: async (jid) => {
			const meta = readWhatsAppBaileysCacheEntry(baileysGroupMetaCache, jid);
			return meta?.participants?.length ? meta : void 0;
		}
	});
	try {
		await waitForWaConnection(sock, { timeoutMs: socketTiming.connectTimeoutMs });
	} catch (err) {
		closeInboundMonitorSocket(sock);
		throw err;
	}
	const shouldDebounce = options.shouldDebounce;
	const normalizeAdmittedWebInboundMessage = (msg) => requireAdmittedWhatsAppInboundMessage(normalizeWebInboundMessage(msg));
	return attachWebInboxToSocket({
		...options,
		onMessage: async (msg) => {
			await options.onMessage(normalizeAdmittedWebInboundMessage(msg));
		},
		shouldDebounce: shouldDebounce ? (msg) => shouldDebounce(normalizeAdmittedWebInboundMessage(msg)) : void 0,
		socketTiming,
		sock,
		recentMessageKeys,
		baileysGroupMetaCache
	});
}
//#endregion
//#region extensions/whatsapp/src/auto-reply/loggers.ts
const whatsappLog = createSubsystemLogger("gateway/channels/whatsapp");
const whatsappInboundLog = whatsappLog.child("inbound");
const whatsappOutboundLog = whatsappLog.child("outbound");
const whatsappHeartbeatLog = whatsappLog.child("heartbeat");
//#endregion
//#region extensions/whatsapp/src/auto-reply/mentions.ts
function buildMentionConfig(cfg, agentId, options) {
	return {
		mentionRegexes: buildMentionRegexes(cfg, agentId, options),
		allowFrom: cfg.channels?.whatsapp?.allowFrom
	};
}
function resolveMentionTargets(msg, authDir) {
	return {
		normalizedMentions: getMentionIdentities(msg, authDir),
		self: getSelfIdentity(msg, authDir)
	};
}
function isBotMentionedFromTargets(msg, mentionCfg, targets) {
	const clean = (text) => normalizeMentionText(text);
	const explicitSelfChatOverride = typeof mentionCfg.isSelfChat === "boolean";
	const isGroupConversation = requireWhatsAppInboundAdmission(msg).conversation.kind === "group";
	const isSelfChat = explicitSelfChatOverride ? Boolean(mentionCfg.isSelfChat) : isSelfChatMode(targets.self.e164, mentionCfg.allowFrom) && !isGroupConversation;
	const hasMentions = targets.normalizedMentions.length > 0;
	if (hasMentions && !isSelfChat) {
		for (const mention of targets.normalizedMentions) if (identitiesOverlap(targets.self, mention)) return true;
		return false;
	} else if (hasMentions && isSelfChat) {}
	const bodyClean = clean(msg.payload.body);
	if (mentionCfg.mentionRegexes.some((re) => re.test(bodyClean))) return true;
	if (targets.self.e164) {
		const selfDigits = targets.self.e164.replace(/\D/g, "");
		if (selfDigits) {
			if (bodyClean.replace(/[^\d]/g, "").includes(selfDigits)) return true;
			const bodyNoSpace = msg.payload.body.replace(/[\s-]/g, "");
			if (new RegExp(`\\+?${selfDigits}`, "i").test(bodyNoSpace)) return true;
		}
	}
	return false;
}
function debugMention(msg, mentionCfg, authDir) {
	const mentionTargets = resolveMentionTargets(msg, authDir);
	return {
		wasMentioned: isBotMentionedFromTargets(msg, mentionCfg, mentionTargets),
		details: {
			from: requireWhatsAppInboundAdmission(msg).conversation.id,
			body: msg.payload.body,
			bodyClean: normalizeMentionText(msg.payload.body),
			mentionedJids: msg.group?.mentions?.jids ?? null,
			normalizedMentionedJids: mentionTargets.normalizedMentions.length ? mentionTargets.normalizedMentions.map((identity) => getComparableIdentityValues(identity)) : null,
			selfJid: msg.platform.self?.jid ?? msg.platform.selfJid ?? null,
			selfLid: msg.platform.self?.lid ?? msg.platform.selfLid ?? null,
			selfE164: msg.platform.self?.e164 ?? msg.platform.selfE164 ?? null,
			resolvedSelf: mentionTargets.self
		}
	};
}
function resolveOwnerList(mentionCfg, selfE164) {
	const allowFrom = mentionCfg.allowFrom;
	return (Array.isArray(allowFrom) && allowFrom.length > 0 ? allowFrom : selfE164 ? [selfE164] : []).filter((entry) => Boolean(entry && entry !== "*")).map((entry) => normalizeE164(entry)).filter((entry) => Boolean(entry));
}
//#endregion
//#region extensions/whatsapp/src/auto-reply/monitor-state.ts
function cloneStatus(status) {
	return {
		...status,
		lastDisconnect: status.lastDisconnect ? { ...status.lastDisconnect } : null
	};
}
function isTerminalHealthState(healthState) {
	return healthState === "conflict" || healthState === "logged-out" || healthState === "stopped";
}
function createWebChannelStatusController(statusSink) {
	let lastDisconnectWasWatchdogRecovery = false;
	const status = {
		running: true,
		connected: false,
		reconnectAttempts: 0,
		lastConnectedAt: null,
		lastDisconnect: null,
		lastInboundAt: null,
		lastMessageAt: null,
		lastEventAt: null,
		lastError: null,
		healthState: "starting"
	};
	const emit = () => {
		statusSink?.(cloneStatus(status));
	};
	return {
		emit,
		snapshot: () => status,
		noteConnected(at = Date.now()) {
			Object.assign(status, createConnectedChannelStatusPatch(at));
			Object.assign(status, createTransportActivityStatusPatch(at));
			if (lastDisconnectWasWatchdogRecovery) {
				status.lastDisconnect = null;
				status.reconnectAttempts = 0;
				lastDisconnectWasWatchdogRecovery = false;
			}
			status.lastError = null;
			status.healthState = "healthy";
			emit();
		},
		noteInbound(at = Date.now()) {
			status.lastInboundAt = at;
			status.lastMessageAt = at;
			status.lastEventAt = at;
			Object.assign(status, createTransportActivityStatusPatch(at));
			if (status.connected) status.healthState = "healthy";
			emit();
		},
		noteTransportActivity(at = Date.now()) {
			if (status.lastTransportActivityAt === at) return;
			Object.assign(status, createTransportActivityStatusPatch(at));
			emit();
		},
		noteWatchdogStale(at = Date.now()) {
			status.lastEventAt = at;
			if (status.connected) status.healthState = "stale";
			emit();
		},
		noteReconnectAttempts(reconnectAttempts) {
			status.reconnectAttempts = reconnectAttempts;
			emit();
		},
		noteClose(params) {
			const at = params.at ?? Date.now();
			lastDisconnectWasWatchdogRecovery = params.watchdogRecovery === true;
			status.connected = false;
			status.lastEventAt = at;
			status.lastDisconnect = {
				at,
				status: params.statusCode,
				error: params.error,
				loggedOut: Boolean(params.loggedOut)
			};
			status.lastError = params.error ?? null;
			status.reconnectAttempts = params.reconnectAttempts;
			status.healthState = params.healthState;
			emit();
		},
		markStopped(at = Date.now()) {
			status.running = false;
			status.connected = false;
			status.lastEventAt = at;
			if (!isTerminalHealthState(status.healthState)) status.healthState = "stopped";
			emit();
		}
	};
}
//#endregion
//#region extensions/whatsapp/src/auto-reply/monitor/echo.ts
function createEchoTracker(params) {
	const recentlySent = /* @__PURE__ */ new Set();
	const maxItems = Math.max(1, params.maxItems ?? 100);
	const buildCombinedKey = (p) => `combined:${p.sessionKey}:${p.combinedBody}`;
	const trim = () => {
		while (recentlySent.size > maxItems) {
			const firstKey = recentlySent.values().next().value;
			if (!firstKey) break;
			recentlySent.delete(firstKey);
		}
	};
	const rememberText = (text, opts) => {
		if (!text) return;
		recentlySent.add(text);
		if (opts.combinedBody && opts.combinedBodySessionKey) recentlySent.add(buildCombinedKey({
			sessionKey: opts.combinedBodySessionKey,
			combinedBody: opts.combinedBody
		}));
		if (opts.logVerboseMessage) params.logVerbose?.(`Added to echo detection set (size now: ${recentlySent.size}): ${text.slice(0, 50)}...`);
		trim();
	};
	return {
		rememberText,
		has: (key) => recentlySent.has(key),
		forget: (key) => {
			recentlySent.delete(key);
		},
		buildCombinedKey
	};
}
//#endregion
//#region extensions/whatsapp/src/auto-reply/monitor/listener-log.ts
function formatWhatsAppInboundListeningLog(account) {
	if (account.groupPolicy === "disabled") return "Listening for WhatsApp inbound messages (DM + groups disabled by groupPolicy).";
	if (account.groupPolicy === "allowlist" && !account.hasGroupAllowFrom) return "Listening for WhatsApp inbound messages (DM + group inbound blocked by empty groupPolicy allowlist).";
	const groups = account.groups ?? {};
	if (Object.keys(groups).length === 0) return `Listening for WhatsApp inbound messages (DM + all groups; ${account.groupPolicy === "allowlist" ? "sender allowlist configured" : "no group allowlist configured"}).`;
	if (Object.hasOwn(groups, "*")) return "Listening for WhatsApp inbound messages (DM + all groups; wildcard configured).";
	const explicitGroupCount = Object.keys(groups).length;
	return `Listening for WhatsApp inbound messages (DM + ${explicitGroupCount} configured ${explicitGroupCount === 1 ? "group" : "groups"}).`;
}
//#endregion
//#region extensions/whatsapp/src/group-session-key.ts
function resolveWhatsAppGroupAccountThreadId(accountId) {
	return `whatsapp-account-${normalizeAccountId(accountId)}`;
}
function resolveWhatsAppLegacyGroupSessionKey(params) {
	const accountId = normalizeAccountId(params.accountId);
	if (!accountId || accountId === "default" || !params.sessionKey.includes(":group:")) return null;
	const suffix = `:thread:${resolveWhatsAppGroupAccountThreadId(accountId)}`;
	return params.sessionKey.endsWith(suffix) ? params.sessionKey.slice(0, -suffix.length) : null;
}
function resolveWhatsAppGroupSessionRoute(route) {
	if (route.accountId === "default" || !route.sessionKey.includes(":group:")) return route;
	const scopedSession = resolveThreadSessionKeys({
		baseSessionKey: route.sessionKey,
		threadId: resolveWhatsAppGroupAccountThreadId(route.accountId)
	});
	return {
		...route,
		sessionKey: scopedSession.sessionKey
	};
}
//#endregion
//#region extensions/whatsapp/src/auto-reply/monitor/ack-emoji.ts
const DEFAULT_WHATSAPP_ACK_REACTION = "👀";
function resolveWhatsAppAckEmoji(params) {
	if (!params.ackConfig) return "";
	if (params.ackConfig.emoji !== void 0) return params.ackConfig.emoji.trim();
	return resolveAgentIdentityEmoji(params.cfg, params.agentId) ?? DEFAULT_WHATSAPP_ACK_REACTION;
}
function resolveAgentIdentityEmoji(cfg, agentId) {
	return resolveAgentIdentity(cfg, agentId)?.emoji?.trim() || void 0;
}
//#endregion
//#region extensions/whatsapp/src/auto-reply/monitor/group-activation.ts
function hasNamedWhatsAppAccounts(cfg) {
	return Object.keys(cfg.channels?.whatsapp?.accounts ?? {}).some((accountId) => normalizeAccountId(accountId) !== DEFAULT_ACCOUNT_ID);
}
function isActivationOnlyEntry(entry) {
	return entry?.groupActivation !== void 0 && typeof entry?.sessionId !== "string" && typeof entry?.updatedAt !== "number";
}
async function resolveGroupActivationFor(params) {
	const storePath = resolveStorePath(params.cfg.session?.store, { agentId: params.agentId });
	const store = loadSessionStore(storePath);
	const legacySessionKey = resolveWhatsAppLegacyGroupSessionKey({
		sessionKey: params.sessionKey,
		accountId: params.accountId
	});
	const legacyEntry = legacySessionKey ? store[legacySessionKey] : void 0;
	const scopedEntry = store[params.sessionKey];
	const activation = (normalizeAccountId(params.accountId) === "default" && hasNamedWhatsAppAccounts(params.cfg) && isActivationOnlyEntry(scopedEntry) ? void 0 : scopedEntry?.groupActivation) ?? legacyEntry?.groupActivation;
	if (activation !== void 0 && scopedEntry?.groupActivation === void 0) await updateSessionStore(storePath, (nextStore) => {
		const nextScopedEntry = nextStore[params.sessionKey];
		if (nextScopedEntry?.groupActivation !== void 0) return;
		nextStore[params.sessionKey] = {
			...nextScopedEntry,
			groupActivation: activation
		};
	});
	const defaultActivation = !resolveWhatsAppInboundPolicy({
		cfg: params.cfg,
		accountId: params.accountId
	}).resolveConversationRequireMention(params.conversationId) ? "always" : "mention";
	return normalizeGroupActivation(activation) ?? defaultActivation;
}
//#endregion
//#region extensions/whatsapp/src/auto-reply/monitor/ack-reaction.ts
async function maybeSendAckReaction(params) {
	if (!params.msg.event.id) return null;
	const admission = requireWhatsAppInboundAdmission(params.msg);
	const accountId = admission.accountId;
	if (resolveWhatsAppReactionLevel({
		cfg: params.cfg,
		accountId
	}).level === "off") return null;
	const ackConfig = params.cfg.channels?.whatsapp?.ackReaction;
	const emoji = resolveWhatsAppAckEmoji({
		cfg: params.cfg,
		agentId: params.agentId,
		ackConfig
	});
	const directEnabled = ackConfig?.direct ?? true;
	const groupMode = ackConfig?.group ?? "mentions";
	const isGroup = admission.conversation.kind === "group";
	const conversationIdForCheck = admission.conversation.id;
	const activation = isGroup ? await resolveGroupActivationFor({
		cfg: params.cfg,
		accountId,
		agentId: params.agentId,
		sessionKey: params.sessionKey,
		conversationId: conversationIdForCheck
	}) : null;
	const shouldSendReaction = () => shouldAckReactionForWhatsApp({
		emoji,
		isDirect: admission.conversation.kind === "direct",
		isGroup,
		directEnabled,
		groupMode,
		wasMentioned: params.msg.wasMentioned === true,
		groupActivated: activation === "always"
	});
	if (!shouldSendReaction()) return null;
	params.info({
		chatId: params.msg.platform.chatJid,
		messageId: params.msg.event.id,
		emoji
	}, "sending ack reaction");
	const sender = getSenderIdentity(params.msg);
	const reactionOptions = {
		verbose: params.verbose,
		fromMe: false,
		...sender.jid ? { participant: sender.jid } : {},
		accountId,
		cfg: params.cfg
	};
	return createAckReactionHandle({
		ackReactionValue: emoji,
		send: () => sendReactionWhatsApp(params.msg.platform.chatJid, params.msg.event.id, emoji, reactionOptions),
		remove: () => sendReactionWhatsApp(params.msg.platform.chatJid, params.msg.event.id, "", reactionOptions),
		onSendError: (err) => {
			params.warn({
				error: formatError(err),
				chatId: params.msg.platform.chatJid,
				messageId: params.msg.event.id
			}, "failed to send ack reaction");
			logVerbose(`WhatsApp ack reaction failed for chat ${params.msg.platform.chatJid}: ${formatError(err)}`);
		}
	});
}
//#endregion
//#region extensions/whatsapp/src/auto-reply/monitor/broadcast.ts
function buildBroadcastRouteKeys(params) {
	const admission = requireWhatsAppInboundAdmission(params.msg);
	const sessionKey = buildAgentSessionKey({
		agentId: params.agentId,
		channel: "whatsapp",
		accountId: params.route.accountId,
		peer: {
			kind: admission.conversation.kind,
			id: params.peerId
		},
		dmScope: params.cfg.session?.dmScope,
		identityLinks: params.cfg.session?.identityLinks
	});
	const mainSessionKey = buildAgentMainSessionKey({
		agentId: params.agentId,
		mainKey: DEFAULT_MAIN_KEY
	});
	return {
		sessionKey,
		mainSessionKey,
		lastRoutePolicy: deriveLastRoutePolicy({
			sessionKey,
			mainSessionKey
		})
	};
}
async function maybeBroadcastMessage(params) {
	const broadcastAgents = params.cfg.broadcast?.[params.peerId];
	if (!broadcastAgents || !Array.isArray(broadcastAgents)) return false;
	if (broadcastAgents.length === 0) return false;
	const strategy = params.cfg.broadcast?.strategy || "parallel";
	whatsappInboundLog.info(`Broadcasting message to ${broadcastAgents.length} agents (${strategy})`);
	const agentIds = params.cfg.agents?.list?.map((agent) => normalizeAgentId$1(agent.id));
	const hasKnownAgents = (agentIds?.length ?? 0) > 0;
	const isGroupConversation = requireWhatsAppInboundAdmission(params.msg).conversation.kind === "group";
	const groupHistorySnapshot = isGroupConversation ? params.groupHistories.get(params.groupHistoryKey) ?? [] : void 0;
	const processForAgent = async (agentId) => {
		const normalizedAgentId = normalizeAgentId$1(agentId);
		if (hasKnownAgents && !agentIds?.includes(normalizedAgentId)) {
			whatsappInboundLog.warn(`Broadcast agent ${agentId} not found in agents.list; skipping`);
			return false;
		}
		const routeKeys = buildBroadcastRouteKeys({
			cfg: params.cfg,
			msg: params.msg,
			route: params.route,
			peerId: params.peerId,
			agentId: normalizedAgentId
		});
		const baseAgentRoute = {
			...params.route,
			agentId: normalizedAgentId,
			...routeKeys
		};
		const agentRoute = isGroupConversation ? resolveWhatsAppGroupSessionRoute(baseAgentRoute) : baseAgentRoute;
		try {
			const opts = {
				groupHistory: groupHistorySnapshot,
				suppressGroupHistoryClear: true
			};
			if (params.preflightAudioTranscript !== void 0) opts.preflightAudioTranscript = params.preflightAudioTranscript;
			if (params.ackAlreadySent === true) opts.ackAlreadySent = true;
			if (params.ackReaction !== void 0) opts.ackReaction = params.ackReaction;
			return await params.processMessage(params.msg, agentRoute, params.groupHistoryKey, opts);
		} catch (err) {
			whatsappInboundLog.error(`Broadcast agent ${agentId} failed: ${formatError(err)}`);
			return false;
		}
	};
	if (strategy === "sequential") for (const agentId of broadcastAgents) await processForAgent(agentId);
	else await Promise.allSettled(broadcastAgents.map(processForAgent));
	if (isGroupConversation) params.groupHistories.set(params.groupHistoryKey, []);
	return true;
}
//#endregion
//#region extensions/whatsapp/src/auto-reply/monitor/commands.ts
function stripMentionsForCommand(text, mentionRegexes, selfE164) {
	let result = text;
	for (const re of mentionRegexes) result = result.replace(re, " ");
	if (selfE164) {
		const digits = selfE164.replace(/\D/g, "");
		if (digits) {
			const pattern = new RegExp(`\\+?${digits}`, "g");
			result = result.replace(pattern, " ");
		}
	}
	return result.replace(/\s+/g, " ").trim();
}
//#endregion
//#region extensions/whatsapp/src/auto-reply/monitor/group-members.ts
function appendNormalizedUnique(entries, seen, ordered) {
	for (const entry of entries) {
		const normalized = normalizeE164(entry) ?? entry;
		if (!normalized || seen.has(normalized)) continue;
		seen.add(normalized);
		ordered.push(normalized);
	}
}
function noteGroupMember(groupMemberNames, conversationId, e164, name) {
	if (!e164 || !name) return;
	const key = normalizeE164(e164) ?? e164;
	if (!key) return;
	let roster = groupMemberNames.get(conversationId);
	if (!roster) {
		roster = /* @__PURE__ */ new Map();
		groupMemberNames.set(conversationId, roster);
	}
	roster.set(key, name);
}
function formatGroupMembers(params) {
	const { participants, roster, fallbackE164 } = params;
	const seen = /* @__PURE__ */ new Set();
	const ordered = [];
	if (participants?.length) appendNormalizedUnique(participants, seen, ordered);
	if (roster) appendNormalizedUnique(roster.keys(), seen, ordered);
	if (ordered.length === 0 && fallbackE164) {
		const normalized = normalizeE164(fallbackE164) ?? fallbackE164;
		if (normalized) ordered.push(normalized);
	}
	if (ordered.length === 0) return;
	return ordered.map((entry) => {
		const name = roster?.get(entry);
		return name ? `${name} (${entry})` : entry;
	}).join(", ");
}
//#endregion
//#region extensions/whatsapp/src/auto-reply/monitor/group-gating.ts
const MAX_GROUP_DROP_WARNINGS = 100;
const groupDropWarned = /* @__PURE__ */ new Set();
function shouldWarnForGroupDrop(warnKey) {
	if (groupDropWarned.has(warnKey)) return false;
	groupDropWarned.add(warnKey);
	while (groupDropWarned.size > MAX_GROUP_DROP_WARNINGS) {
		const oldest = groupDropWarned.values().next().value;
		if (!oldest) break;
		groupDropWarned.delete(oldest);
	}
	return true;
}
function isOwnerSender(baseMentionConfig, msg) {
	const sender = normalizeE164(getSenderIdentity(msg).e164 ?? "");
	if (!sender) return false;
	return resolveOwnerList(baseMentionConfig, getSelfIdentity(msg).e164 ?? void 0).includes(sender);
}
function recordPendingGroupHistoryEntry(params) {
	const senderIdentity = getSenderIdentity(params.msg);
	const sender = senderIdentity.name && senderIdentity.e164 ? `${senderIdentity.name} (${senderIdentity.e164})` : senderIdentity.name ?? senderIdentity.e164 ?? getPrimaryIdentityId(senderIdentity) ?? "Unknown";
	createChannelHistoryWindow({ historyMap: params.groupHistories }).record({
		historyKey: params.groupHistoryKey,
		limit: params.groupHistoryLimit,
		entry: {
			sender,
			body: params.body ?? params.msg.payload.body,
			timestamp: params.msg.event.timestamp,
			id: params.msg.event.id,
			senderJid: senderIdentity.jid ?? params.msg.platform.senderJid
		}
	});
}
function skipGroupMessageAndStoreHistory(params, verboseMessage, body) {
	params.logVerbose(verboseMessage);
	recordPendingGroupHistoryEntry({
		msg: params.msg,
		body,
		groupHistories: params.groupHistories,
		groupHistoryKey: params.groupHistoryKey,
		groupHistoryLimit: params.groupHistoryLimit
	});
	return { shouldProcess: false };
}
async function applyGroupGating(params) {
	const sender = getSenderIdentity(params.msg);
	const self = getSelfIdentity(params.msg, params.authDir);
	const admission = requireWhatsAppInboundAdmission(params.msg);
	const conversationId = admission.conversation.id;
	const inboundPolicy = resolveWhatsAppInboundPolicy({
		cfg: params.cfg,
		accountId: admission.accountId,
		selfE164: self.e164 ?? null
	});
	const conversationGroupPolicy = inboundPolicy.resolveConversationGroupPolicy(conversationId);
	if (conversationGroupPolicy.allowlistEnabled && !conversationGroupPolicy.allowed) {
		const accountId = inboundPolicy.account.accountId;
		if (shouldWarnForGroupDrop(`${accountId}:${conversationId}`)) {
			const groupsPath = resolveWhatsAppGroupsConfigPath({
				cfg: params.cfg,
				accountId
			});
			params.replyLogger.warn({
				conversationId,
				accountId,
				groupsPath
			}, `WhatsApp group ${conversationId} not in ${groupsPath} — inbound dropped. Add the group JID to ${groupsPath} (or add "*" there to admit all groups). Sender authorization still applies.`);
		}
		params.logVerbose(`Dropping message from unregistered WhatsApp group ${conversationId}. Add the group JID to channels.whatsapp.groups, or add "*" there to admit all groups. Sender authorization still applies.`);
		return { shouldProcess: false };
	}
	noteGroupMember(params.groupMemberNames, params.groupHistoryKey, sender.e164 ?? void 0, sender.name ?? void 0);
	const baseMentionConfig = {
		...params.baseMentionConfig,
		allowFrom: inboundPolicy.configuredAllowFrom
	};
	const mentionConfig = {
		...buildMentionConfig(params.cfg, params.agentId, {
			provider: "whatsapp",
			conversationId,
			providerPolicy: params.providerMentionPatterns
		}),
		allowFrom: inboundPolicy.configuredAllowFrom
	};
	const mentionMsg = params.mentionText !== void 0 ? {
		...params.msg,
		payload: {
			...params.msg.payload,
			body: params.mentionText
		}
	} : params.msg;
	const commandBody = stripMentionsForCommand(mentionMsg.payload.body, mentionConfig.mentionRegexes, self.e164);
	const activationCommand = parseActivationCommand(commandBody);
	const owner = isOwnerSender(baseMentionConfig, params.msg);
	const shouldBypassMention = owner && hasControlCommand(commandBody, params.cfg);
	if (activationCommand.hasCommand && !owner) return skipGroupMessageAndStoreHistory(params, `Ignoring /activation from non-owner in group ${conversationId}`);
	const mentionDebug = debugMention(mentionMsg, mentionConfig, params.authDir);
	params.replyLogger.debug({
		conversationId,
		wasMentioned: mentionDebug.wasMentioned,
		...mentionDebug.details
	}, "group mention debug");
	const wasMentioned = mentionDebug.wasMentioned;
	const requireMention = await resolveGroupActivationFor({
		cfg: params.cfg,
		accountId: inboundPolicy.account.accountId,
		agentId: params.agentId,
		sessionKey: params.sessionKey,
		conversationId
	}) !== "always";
	const replyContext = getReplyContext(params.msg, params.authDir);
	const mentionDecision = resolveInboundMentionDecision({
		facts: {
			canDetectMention: true,
			wasMentioned,
			implicitMentionKinds: implicitMentionKindWhen("quoted_bot", !(params.selfChatMode === true && identitiesOverlap(self, sender)) && identitiesOverlap(self, replyContext?.sender))
		},
		policy: {
			isGroup: true,
			requireMention,
			allowTextCommands: false,
			hasControlCommand: false,
			commandAuthorized: false
		}
	});
	const effectiveWasMentioned = mentionDecision.effectiveWasMentioned || shouldBypassMention;
	params.msg.wasMentioned = effectiveWasMentioned;
	if (!shouldBypassMention && requireMention && mentionDecision.shouldSkip) {
		if (params.deferMissingMention === true) {
			params.logVerbose(`Deferring group mention skip until audio preflight completes in ${conversationId}`);
			return {
				shouldProcess: false,
				needsMentionText: true
			};
		}
		return skipGroupMessageAndStoreHistory(params, `Group message stored for context (no mention detected) in ${conversationId}: ${mentionMsg.payload.body}`, params.mentionText);
	}
	return { shouldProcess: true };
}
//#endregion
//#region extensions/whatsapp/src/auto-reply/monitor/last-route.ts
function trackBackgroundTask(backgroundTasks, task) {
	backgroundTasks.add(task);
	const cleanup = () => {
		backgroundTasks.delete(task);
	};
	task.then(cleanup, cleanup);
}
function updateLastRouteInBackground(params) {
	const storePath = resolveStorePath(params.cfg.session?.store, { agentId: params.storeAgentId });
	const task = updateLastRoute({
		storePath,
		sessionKey: params.sessionKey,
		deliveryContext: {
			channel: params.channel,
			to: params.to,
			accountId: params.accountId
		},
		ctx: params.ctx
	}).catch((err) => {
		params.warn({
			error: formatError(err),
			storePath,
			sessionKey: params.sessionKey,
			to: params.to
		}, "failed updating last route");
	});
	trackBackgroundTask(params.backgroundTasks, task);
}
//#endregion
//#region extensions/whatsapp/src/auto-reply/monitor/peer.ts
function resolvePeerId(msg) {
	const admission = requireWhatsAppInboundAdmission(msg);
	if (admission.conversation.kind === "group") return admission.conversation.id;
	const sender = getSenderIdentity(msg);
	if (sender.e164) return normalizeE164(sender.e164) ?? sender.e164;
	const conversationId = admission.conversation.id;
	if (conversationId.includes("@")) return jidToE164(conversationId) ?? conversationId;
	return normalizeE164(conversationId) ?? conversationId;
}
//#endregion
//#region extensions/whatsapp/src/system-prompt.ts
function resolveWhatsAppGroupSystemPrompt(params) {
	if (!params.groupId) return;
	const groups = params.accountConfig?.groups;
	const specific = groups?.[params.groupId];
	if (specific != null && specific.systemPrompt != null) return specific.systemPrompt.trim() || void 0;
	const wildcard = groups?.["*"]?.systemPrompt;
	return wildcard != null ? wildcard.trim() || void 0 : void 0;
}
function resolveWhatsAppDirectSystemPrompt(params) {
	if (!params.peerId) return;
	const direct = params.accountConfig?.direct;
	const specific = direct?.[params.peerId];
	if (specific != null && specific.systemPrompt != null) return specific.systemPrompt.trim() || void 0;
	const wildcard = direct?.["*"]?.systemPrompt;
	return wildcard != null ? wildcard.trim() || void 0 : void 0;
}
//#endregion
//#region extensions/whatsapp/src/auto-reply/util.ts
function elide(text, limit = 400) {
	if (!text) return text;
	if (text.length <= limit) return text;
	return `${text.slice(0, limit)}… (truncated ${text.length - limit} chars)`;
}
function markWhatsAppVisibleDeliveryError(error) {
	if (typeof error === "object" && error !== null && !Array.isArray(error)) try {
		Object.assign(error, {
			sentBeforeError: true,
			visibleReplySent: true
		});
		return error;
	} catch {}
	const visibleError = new Error("visible WhatsApp reply delivery failed", { cause: error });
	Object.assign(visibleError, {
		sentBeforeError: true,
		visibleReplySent: true
	});
	return visibleError;
}
function isLikelyWhatsAppCryptoError(reason) {
	const formatReason = (value) => {
		if (value == null) return "";
		if (typeof value === "string") return value;
		if (value instanceof Error) return `${value.message}\n${value.stack ?? ""}`;
		if (typeof value === "object") try {
			return JSON.stringify(value);
		} catch {
			return Object.prototype.toString.call(value);
		}
		if (typeof value === "number") return String(value);
		if (typeof value === "boolean") return String(value);
		if (typeof value === "bigint") return String(value);
		if (typeof value === "symbol") return value.description ?? value.toString();
		if (typeof value === "function") return value.name ? `[function ${value.name}]` : "[function]";
		return Object.prototype.toString.call(value);
	};
	const haystack = normalizeLowercaseStringOrEmpty(reason instanceof Error ? `${reason.message}\n${reason.stack ?? ""}` : formatReason(reason));
	if (!(haystack.includes("unsupported state or unable to authenticate data") || haystack.includes("bad mac"))) return false;
	return haystack.includes("baileys") || haystack.includes("noise-handler") || haystack.includes("aesdecryptgcm");
}
//#endregion
//#region extensions/whatsapp/src/auto-reply/deliver-reply.ts
function resolveWhatsAppReceiptKind(results) {
	if (results.length > 0 && results.every((result) => result.kind === "text")) return "text";
	if (results.length > 0 && results.every((result) => result.kind === "media")) return "media";
	return "unknown";
}
function createWhatsAppReplyDeliveryReceipt(results) {
	const receiptResultsById = /* @__PURE__ */ new Map();
	for (const result of results) {
		if (result.receipt?.parts.length) {
			for (const part of result.receipt.parts) receiptResultsById.set(part.platformMessageId, {
				...part.raw ?? {
					channel: "whatsapp",
					messageId: part.platformMessageId
				},
				meta: {
					...part.raw?.meta,
					kind: result.kind,
					providerAccepted: result.providerAccepted
				}
			});
			continue;
		}
		for (const messageId of listWhatsAppSendResultMessageIds(result)) receiptResultsById.set(messageId, {
			channel: "whatsapp",
			messageId,
			meta: {
				kind: result.kind,
				providerAccepted: result.providerAccepted
			}
		});
	}
	return createMessageReceiptFromOutboundResults({
		results: [...receiptResultsById.values()],
		kind: resolveWhatsAppReceiptKind(results)
	});
}
async function deliverWebReply(params) {
	const { replyResult, msg, maxMediaBytes, textLimit, replyLogger, connectionId, skipLog } = params;
	const admission = requireWhatsAppInboundAdmission(msg);
	const conversationId = admission.conversation.id;
	const isGroupConversation = admission.conversation.kind === "group";
	const replyStarted = Date.now();
	if (process.env.OPENCLAW_DEV_MODE === "1" && process.env.OPENCLAW_DEV_MODE_WA_THINKING_MESSAGES === "1" && replyResult.text) replyResult.text = replyResult.text.replace(/^.*?Reasoning:/, "💭 Reasoning:");
	const sendResults = [];
	const rememberSendResult = (result) => {
		if (result) sendResults.push(result);
	};
	const finishDelivery = () => {
		return {
			results: sendResults,
			receipt: createWhatsAppReplyDeliveryReceipt(sendResults),
			providerAccepted: sendResults.some((result) => result.providerAccepted)
		};
	};
	if (isReasoningReplyPayload(replyResult)) {
		whatsappOutboundLog.debug(`Suppressed reasoning payload to ${conversationId}`);
		return finishDelivery();
	}
	const tableMode = params.tableMode ?? "code";
	const chunkMode = params.chunkMode ?? "length";
	const normalizedReply = params.normalizedReplyResult ?? normalizeWhatsAppOutboundPayload(replyResult, { normalizeText: normalizeWhatsAppPayloadTextPreservingIndentation });
	const textChunks = chunkMarkdownTextWithMode(markdownToWhatsApp(convertMarkdownTables(normalizedReply.text ?? "", tableMode)), textLimit, chunkMode);
	const mediaList = normalizedReply.mediaUrls ?? [];
	const getQuote = () => {
		if (!replyResult.replyToId) return;
		const cached = lookupInboundMessageMeta(admission.accountId, msg.platform.chatJid, replyResult.replyToId);
		return buildQuotedMessageOptions({
			messageId: replyResult.replyToId,
			remoteJid: msg.platform.chatJid,
			fromMe: cached?.fromMe ?? false,
			participant: cached?.participant ?? (isGroupConversation ? msg.platform.senderJid : void 0),
			messageText: cached?.body ?? ""
		});
	};
	const sendWithRetry = async (fn, label, maxAttempts = 3) => {
		try {
			return await sendWhatsAppOutboundWithRetry({
				send: fn,
				maxAttempts,
				onRetry: ({ attempt, maxAttempts: retryMaxAttempts, backoffMs, errorText }) => {
					logVerbose(`Retrying ${label} to ${conversationId} after failure (${attempt}/${retryMaxAttempts - 1}) in ${backoffMs}ms: ${errorText}`);
				}
			});
		} catch (error) {
			if (sendResults.some((result) => result.providerAccepted)) throw markWhatsAppVisibleDeliveryError(error);
			throw error;
		}
	};
	if (mediaList.length === 0 && textChunks.length) {
		const totalChunks = textChunks.length;
		for (const [index, chunk] of textChunks.entries()) {
			const chunkStarted = Date.now();
			const quote = getQuote();
			rememberSendResult(await sendWithRetry(() => msg.platform.reply(chunk, quote), "text"));
			if (!skipLog) {
				const durationMs = Date.now() - chunkStarted;
				whatsappOutboundLog.debug(`Sent chunk ${index + 1}/${totalChunks} to ${conversationId} (${durationMs.toFixed(0)}ms)`);
			}
		}
		const delivery = finishDelivery();
		const logPayload = {
			correlationId: msg.event.id ?? newConnectionId(),
			connectionId: connectionId ?? null,
			to: conversationId,
			from: msg.platform.recipientJid,
			text: elide(replyResult.text, 240),
			mediaUrl: null,
			mediaSizeBytes: null,
			mediaKind: null,
			durationMs: Date.now() - replyStarted
		};
		if (delivery.providerAccepted) replyLogger.info(logPayload, "auto-reply sent (text)");
		else replyLogger.warn(logPayload, "auto-reply text was not accepted by WhatsApp provider");
		return delivery;
	}
	const remainingText = [...textChunks];
	await sendMediaWithLeadingCaption({
		mediaUrls: mediaList,
		caption: remainingText.shift() || "",
		send: async ({ mediaUrl, caption }) => {
			const media = await prepareWhatsAppOutboundMedia(await loadWebMedia(mediaUrl, {
				maxBytes: maxMediaBytes,
				localRoots: params.mediaLocalRoots
			}), mediaUrl);
			if (shouldLogVerbose()) {
				logVerbose(`Web auto-reply media size: ${(media.buffer.length / (1024 * 1024)).toFixed(2)}MB`);
				logVerbose(`Web auto-reply media source: ${mediaUrl} (kind ${media.kind})`);
			}
			if (media.kind === "image") {
				const quote = getQuote();
				rememberSendResult(await sendWithRetry(() => msg.platform.sendMedia({
					image: media.buffer,
					caption,
					mimetype: media.mimetype
				}, quote), "media:image"));
			} else if (media.kind === "audio") {
				const quote = getQuote();
				rememberSendResult(await sendWithRetry(() => msg.platform.sendMedia({
					audio: media.buffer,
					ptt: true,
					mimetype: media.mimetype
				}, quote), "media:audio"));
				if (caption) rememberSendResult(await sendWithRetry(() => msg.platform.reply(caption, quote), "media:audio-text"));
			} else if (media.kind === "video") {
				const quote = getQuote();
				rememberSendResult(await sendWithRetry(() => msg.platform.sendMedia({
					video: media.buffer,
					caption,
					mimetype: media.mimetype
				}, quote), "media:video"));
			} else {
				const quote = getQuote();
				rememberSendResult(await sendWithRetry(() => msg.platform.sendMedia({
					document: media.buffer,
					fileName: media.fileName,
					caption,
					mimetype: media.mimetype
				}, quote), "media:document"));
			}
			whatsappOutboundLog.info(`Sent media reply to ${conversationId} (${(media.buffer.length / (1024 * 1024)).toFixed(2)}MB)`);
			replyLogger.info({
				correlationId: msg.event.id ?? newConnectionId(),
				connectionId: connectionId ?? null,
				to: conversationId,
				from: msg.platform.recipientJid,
				text: caption ?? null,
				mediaUrl,
				mediaSizeBytes: media.buffer.length,
				mediaKind: media.kind,
				durationMs: Date.now() - replyStarted
			}, "auto-reply sent (media)");
		},
		onError: async ({ error, mediaUrl, caption, isFirst }) => {
			whatsappOutboundLog.error(`Failed sending web media to ${conversationId}: ${formatError(error)}`);
			replyLogger.warn({
				err: error,
				mediaUrl
			}, "failed to send web media reply");
			if (!isFirst) {
				whatsappOutboundLog.warn(`Trailing media failed; sent warning to ${conversationId}`);
				rememberSendResult(await sendWithRetry(() => msg.platform.reply("⚠️ Media unavailable.", getQuote()), "media:fallback-unavailable"));
				return;
			}
			const fallbackText = [caption ?? "", "⚠️ Media failed."].filter(Boolean).join("\n");
			if (!fallbackText) return;
			whatsappOutboundLog.warn(`Media skipped; sent text-only to ${conversationId}`);
			rememberSendResult(await sendWithRetry(() => msg.platform.reply(fallbackText, getQuote()), "media:fallback-text"));
		}
	});
	for (const chunk of remainingText) rememberSendResult(await sendWithRetry(() => msg.platform.reply(chunk, getQuote()), "media:text"));
	return finishDelivery();
}
//#endregion
//#region extensions/whatsapp/src/auto-reply/monitor/inbound-context.ts
function isWhatsAppSupplementalSenderAllowed(params) {
	if (params.allowFrom.includes("*")) return true;
	const senderValues = new Set(getComparableIdentityValues(resolveComparableIdentity(params.sender, params.authDir)));
	if (senderValues.size === 0) return false;
	for (const entry of params.allowFrom) {
		const rawEntry = entry.trim();
		if (!rawEntry) continue;
		const normalizedEntry = normalizeE164(rawEntry);
		if (normalizedEntry && senderValues.has(normalizedEntry) || senderValues.has(rawEntry)) return true;
	}
	return false;
}
function resolveVisibleWhatsAppGroupHistory(params) {
	if (params.groupPolicy !== "allowlist") return params.history;
	return filterSupplementalContextItems({
		items: params.history,
		mode: params.mode,
		kind: "history",
		isSenderAllowed: (entry) => isWhatsAppSupplementalSenderAllowed({
			allowFrom: params.groupAllowFrom,
			authDir: params.authDir,
			sender: entry.senderJid ? { jid: entry.senderJid } : null
		})
	}).items;
}
function resolveVisibleWhatsAppReplyContext(params) {
	const replyTo = getReplyContext(params.msg, params.authDir);
	if (!replyTo) return null;
	const senderAllowed = requireWhatsAppInboundAdmission(params.msg).conversation.kind !== "group" || params.groupPolicy !== "allowlist" ? true : isWhatsAppSupplementalSenderAllowed({
		allowFrom: params.groupAllowFrom,
		authDir: params.authDir,
		sender: replyTo.sender
	});
	return filterChannelInboundQuoteContext(params.mode, {
		id: replyTo.id,
		body: replyTo.body,
		sender: replyTo.sender?.label ?? void 0,
		senderAllowed
	}) ? replyTo : null;
}
//#endregion
//#region extensions/whatsapp/src/auto-reply/monitor/inbound-dispatch.ts
function normalizeErrForLog(err) {
	if (err instanceof Error) return {
		...Object.fromEntries(Object.entries(err)),
		type: err.name,
		message: err.message,
		stack: err.stack
	};
	return err;
}
function whatsAppReplyDeliveryVisibility(visibleReplySent) {
	return { visibleReplySent };
}
function whatsAppReplyDeliveryVisibilityFromDurableResult(result) {
	return whatsAppReplyDeliveryVisibility(result.visibleReplySent === true);
}
function readTrimmedString(value) {
	return typeof value === "string" ? value.trim() : "";
}
function markWhatsAppReplyDeliveryErrorVisibleAfterFlush(error, flushResult) {
	return flushResult.delivered > 0 ? markWhatsAppVisibleDeliveryError(error) : error;
}
function logWhatsAppReplyDeliveryError(params) {
	const admission = requireWhatsAppInboundAdmission(params.msg);
	params.replyLogger.error({
		err: normalizeErrForLog(params.err),
		replyKind: params.info.kind,
		correlationId: params.msg.event.id ?? null,
		connectionId: params.connectionId,
		conversationId: admission.conversation.id,
		chatId: params.msg.platform.chatJid ?? null,
		to: admission.conversation.id,
		from: params.msg.platform.recipientJid ?? null
	}, "auto-reply delivery failed");
}
function resolveWhatsAppDurableReplyToId(params) {
	if (params.payload.replyToId === null) return null;
	const explicitPayloadReplyToId = readTrimmedString(params.payload.replyToId);
	if (explicitPayloadReplyToId) return explicitPayloadReplyToId;
	const hasVisibleInboundReplyTarget = Boolean(readTrimmedString(params.context.ReplyToId)) || Boolean(readTrimmedString(params.context.ReplyToIdFull));
	const currentInboundMessageId = readTrimmedString(params.msg.event.id);
	if (params.info.kind === "final" && hasVisibleInboundReplyTarget && currentInboundMessageId) return currentInboundMessageId;
	return null;
}
function resolveWhatsAppDisableBlockStreaming(cfg) {
	if (typeof cfg.channels?.whatsapp?.blockStreaming !== "boolean") return;
	return !cfg.channels.whatsapp.blockStreaming;
}
function resolveWhatsAppDeliverablePayload(payload, info) {
	if (payload.isReasoning === true || payload.isCompactionNotice === true) return null;
	if (payload.isError === true) return null;
	if (info.kind === "tool") {
		if (!resolveSendableOutboundReplyParts(payload).hasMedia) return null;
		return {
			...payload,
			text: void 0
		};
	}
	return payload;
}
function getWhatsAppPayloadMediaUrls(payload) {
	return new Set(normalizeStringEntries([...Array.isArray(payload.mediaUrls) ? payload.mediaUrls : [], ...typeof payload.mediaUrl === "string" ? [payload.mediaUrl] : []]));
}
function hasWhatsAppMediaUrlOverlap(left, right) {
	for (const url of left) if (right.has(url)) return true;
	return false;
}
function shouldDeferWhatsAppMediaOnlyPayload(params) {
	return params.info.kind !== "final" && params.reply.hasMedia && !params.reply.text.trim() && params.mediaUrls.size > 0;
}
function createWhatsAppMediaOnlyReplyCoalescer(params) {
	const pendingMediaOnlyPayloads = [];
	const flushExceptDuplicateMedia = async (mediaUrls) => {
		const flushResult = {
			delivered: 0,
			droppedDuplicateMedia: 0
		};
		const pending = pendingMediaOnlyPayloads.splice(0);
		for (const candidate of pending) {
			if (mediaUrls && hasWhatsAppMediaUrlOverlap(candidate.mediaUrls, mediaUrls)) {
				flushResult.droppedDuplicateMedia += 1;
				continue;
			}
			try {
				if ((await params.deliver(candidate)).visibleReplySent) flushResult.delivered += 1;
			} catch (error) {
				throw markWhatsAppReplyDeliveryErrorVisibleAfterFlush(error, flushResult);
			}
		}
		return flushResult;
	};
	return {
		defer(pending) {
			pendingMediaOnlyPayloads.push(pending);
		},
		flushExceptDuplicateMedia,
		flushAll: () => flushExceptDuplicateMedia()
	};
}
function logWhatsAppMediaOnlyFlushResult(result) {
	if (!shouldLogVerbose()) return;
	if (result.droppedDuplicateMedia > 0) logVerbose(`Dropped ${result.droppedDuplicateMedia} deferred media-only WhatsApp reply payload(s) superseded by captioned media`);
	if (result.delivered > 0) logVerbose(`Flushed ${result.delivered} deferred media-only WhatsApp reply payload(s)`);
}
function resolveWhatsAppResponsePrefix(params) {
	const configuredResponsePrefix = params.cfg.messages?.responsePrefix;
	return params.pipelineResponsePrefix ?? (configuredResponsePrefix === void 0 && params.isSelfChat ? resolveIdentityNamePrefix$1(params.cfg, params.agentId) : void 0);
}
async function buildWhatsAppInboundContext(params) {
	const admission = requireWhatsAppInboundAdmission(params.msg);
	const conversationId = admission.conversation.id;
	const conversationKind = admission.conversation.kind;
	const inboundHistory = conversationKind === "group" ? buildInboundHistoryFromEntries({
		entries: (params.groupHistory ?? []).map((entry) => ({
			sender: entry.sender,
			body: entry.body,
			timestamp: entry.timestamp,
			messageId: entry.id
		})),
		limit: params.groupHistory?.length ?? 1
	}) : void 0;
	const media = toInboundMediaFacts(params.msg.payload.media?.path || params.msg.payload.media?.url ? [{
		path: params.msg.payload.media?.path,
		url: params.msg.payload.media?.url ?? params.msg.payload.media?.path,
		contentType: params.msg.payload.media?.type
	}] : void 0, { transcribed: (_entry, index) => params.mediaTranscribedIndexes?.includes(index) === true });
	return buildChannelInboundEventContext({
		channel: "whatsapp",
		finalize: finalizeInboundContext,
		supplemental: {
			quote: params.visibleReplyTo ? {
				id: params.visibleReplyTo.id,
				body: params.visibleReplyTo.body,
				sender: params.visibleReplyTo.sender?.label ?? void 0
			} : void 0,
			groupSystemPrompt: params.groupSystemPrompt,
			untrustedContext: params.msg.payload.untrustedStructuredContext
		},
		media,
		messageId: params.msg.event.id,
		timestamp: params.msg.event.timestamp,
		from: conversationId,
		sender: {
			id: params.sender.id ?? params.sender.e164,
			name: params.sender.name
		},
		conversation: {
			kind: conversationKind,
			id: conversationId,
			label: conversationId
		},
		route: {
			agentId: params.route.agentId,
			accountId: params.route.accountId,
			routeSessionKey: params.route.sessionKey
		},
		reply: {
			to: params.msg.platform.recipientJid,
			originatingTo: conversationId
		},
		message: {
			body: params.combinedBody,
			bodyForAgent: params.bodyForAgent ?? params.msg.payload.body,
			inboundHistory,
			rawBody: params.rawBody ?? params.msg.payload.body,
			commandBody: params.commandBody ?? params.msg.payload.body
		},
		access: {
			...params.msg.wasMentioned !== void 0 ? { mentions: {
				canDetectMention: conversationKind === "group",
				wasMentioned: params.msg.wasMentioned
			} } : {},
			commands: { authorized: params.commandAuthorized }
		},
		commandTurn: params.commandTurn,
		extra: {
			Transcript: params.transcript,
			GroupSubject: params.msg.group?.subject,
			GroupMembers: formatGroupMembers({
				participants: params.msg.group?.participants,
				roster: params.groupMemberRoster,
				fallbackE164: params.sender.e164
			}),
			SenderE164: params.sender.e164,
			CommandSource: params.commandSource ?? (params.commandTurn?.source === "native" || params.commandTurn?.source === "text" ? params.commandTurn.source : void 0),
			ReplyThreading: params.replyThreading,
			SuppressMessageReceivedHooks: params.suppressMessageReceivedHooks,
			...params.msg.payload.location ? toLocationContext(params.msg.payload.location) : {}
		}
	});
}
function normalizeCommandTurnFromContext(value) {
	if (!value || typeof value !== "object") return;
	const record = value;
	const kind = record.kind;
	const source = record.source;
	if (kind === "native" && source === "native" && typeof record.authorized === "boolean") return {
		kind: "native",
		source: "native",
		authorized: record.authorized,
		commandName: typeof record.commandName === "string" ? record.commandName : void 0,
		body: typeof record.body === "string" ? record.body : void 0
	};
	if (kind === "text-slash" && source === "text" && typeof record.authorized === "boolean") return {
		kind: "text-slash",
		source: "text",
		authorized: record.authorized,
		commandName: typeof record.commandName === "string" ? record.commandName : void 0,
		body: typeof record.body === "string" ? record.body : void 0
	};
	if (kind === "normal" && source === "message") return {
		kind: "normal",
		source: "message",
		authorized: false,
		commandName: typeof record.commandName === "string" ? record.commandName : void 0,
		body: typeof record.body === "string" ? record.body : void 0
	};
}
function resolveWhatsAppDmRouteTarget(params) {
	const admission = requireWhatsAppInboundAdmission(params.msg);
	const conversationId = admission.conversation.id;
	if (admission.conversation.kind === "group") return;
	if (params.senderE164) return params.normalizeE164(params.senderE164) ?? void 0;
	if (conversationId.includes("@")) return jidToE164(conversationId) ?? void 0;
	return params.normalizeE164(conversationId) ?? void 0;
}
function updateWhatsAppMainLastRoute(params) {
	const shouldUpdateMainLastRoute = !params.pinnedMainDmRecipient || params.pinnedMainDmRecipient === params.dmRouteTarget;
	const inboundLastRouteSessionKey = resolveInboundLastRouteSessionKey({
		route: params.route,
		sessionKey: params.route.sessionKey
	});
	if (params.dmRouteTarget && inboundLastRouteSessionKey === params.route.mainSessionKey && shouldUpdateMainLastRoute) {
		params.updateLastRoute({
			cfg: params.cfg,
			backgroundTasks: params.backgroundTasks,
			storeAgentId: params.route.agentId,
			sessionKey: params.route.mainSessionKey,
			channel: "whatsapp",
			to: params.dmRouteTarget,
			accountId: params.route.accountId,
			ctx: params.ctx,
			warn: params.warn
		});
		return;
	}
	if (params.dmRouteTarget && inboundLastRouteSessionKey === params.route.mainSessionKey && params.pinnedMainDmRecipient) logVerbose(`Skipping main-session last route update for ${params.dmRouteTarget} (pinned owner ${params.pinnedMainDmRecipient})`);
}
async function dispatchWhatsAppBufferedReply(params) {
	const admission = requireWhatsAppInboundAdmission(params.msg);
	const conversationId = admission.conversation.id;
	const conversationKind = admission.conversation.kind;
	const statusReactionController = params.statusReactionController ?? null;
	const statusReactionTiming = {
		...DEFAULT_TIMING,
		...params.cfg.messages?.statusReactions?.timing
	};
	const removeAckAfterReply = params.cfg.messages?.removeAckAfterReply ?? false;
	const textLimit = params.maxMediaTextChunkLimit ?? resolveTextChunkLimit(params.cfg, "whatsapp");
	const chunkMode = resolveChunkMode(params.cfg, "whatsapp", params.route.accountId);
	const tableMode = resolveMarkdownTableMode({
		cfg: params.cfg,
		channel: "whatsapp",
		accountId: params.route.accountId
	});
	const mediaLocalRoots = getAgentScopedMediaLocalRoots(params.cfg, params.route.agentId);
	const sourceReplyChatType = typeof params.context.ChatType === "string" ? params.context.ChatType : conversationKind;
	const sourceReplyCommandSource = params.context.CommandSource === "native" || params.context.CommandSource === "text" ? params.context.CommandSource : void 0;
	const sourceReplyCommandTurn = normalizeCommandTurnFromContext(params.context.CommandTurn);
	const sourceReplyCommandAuthorized = typeof params.context.CommandAuthorized === "boolean" ? params.context.CommandAuthorized : void 0;
	const sourceReplyDeliveryMode = sourceReplyChatType === "group" || sourceReplyChatType === "channel" ? resolveChannelSourceReplyDeliveryMode({
		cfg: params.cfg,
		ctx: {
			ChatType: sourceReplyChatType,
			CommandTurn: sourceReplyCommandTurn,
			CommandSource: sourceReplyCommandSource,
			CommandAuthorized: sourceReplyCommandAuthorized
		}
	}) : void 0;
	const sourceRepliesAreToolOnly = sourceReplyDeliveryMode === "message_tool_only";
	const disableBlockStreaming = sourceRepliesAreToolOnly ? true : resolveWhatsAppDisableBlockStreaming(params.cfg);
	let didSendReply = false;
	let didLogHeartbeatStrip = false;
	const deliverNormalizedPayload = async (normalizedDeliveryPayload, info) => {
		const reply = resolveSendableOutboundReplyParts(normalizedDeliveryPayload);
		if (!reply.hasMedia && !reply.text.trim()) return whatsAppReplyDeliveryVisibility(false);
		if (!(await params.deliverReply({
			replyResult: normalizedDeliveryPayload,
			normalizedReplyResult: normalizedDeliveryPayload,
			msg: params.msg,
			mediaLocalRoots,
			maxMediaBytes: params.maxMediaBytes,
			textLimit,
			chunkMode,
			replyLogger: params.replyLogger,
			connectionId: params.connectionId,
			skipLog: false,
			tableMode
		})).providerAccepted) {
			params.replyLogger.warn({
				correlationId: params.msg.event.id ?? null,
				connectionId: params.connectionId,
				conversationId,
				chatId: params.msg.platform.chatJid,
				to: conversationId,
				from: params.msg.platform.recipientJid,
				replyKind: info.kind
			}, "auto-reply was not accepted by WhatsApp provider");
			return whatsAppReplyDeliveryVisibility(false);
		}
		didSendReply = true;
		const shouldLog = normalizedDeliveryPayload.text ? true : void 0;
		params.rememberSentText(normalizedDeliveryPayload.text, {
			combinedBody: params.context.Body,
			combinedBodySessionKey: params.route.sessionKey,
			logVerboseMessage: shouldLog
		});
		const fromDisplay = conversationId;
		if (shouldLogVerbose()) logVerbose(`Reply body: ${normalizedDeliveryPayload.text != null ? reply.text : "<media>"}${reply.hasMedia ? " (media)" : ""} -> ${fromDisplay}`);
		return whatsAppReplyDeliveryVisibility(true);
	};
	const mediaOnlyCoalescer = createWhatsAppMediaOnlyReplyCoalescer({ deliver: async (pending) => {
		return await deliverNormalizedPayload(pending.payload, pending.info);
	} });
	if (statusReactionController) statusReactionController.setThinking();
	const dispatchResult = await dispatchReplyWithBufferedBlockDispatcher({
		ctx: params.context,
		cfg: params.cfg,
		replyResolver: params.replyResolver,
		dispatcherOptions: {
			...params.replyPipeline,
			onHeartbeatStrip: () => {
				if (!didLogHeartbeatStrip) {
					didLogHeartbeatStrip = true;
					logVerbose("Stripped stray HEARTBEAT_OK token from web reply");
				}
			},
			deliver: async (payload, info) => {
				const deliveryPayload = resolveWhatsAppDeliverablePayload(payload, info);
				if (!deliveryPayload) return whatsAppReplyDeliveryVisibility(false);
				const normalizedOutboundPayload = normalizeWhatsAppOutboundPayload(deliveryPayload, { normalizeText: normalizeWhatsAppPayloadTextPreservingIndentation });
				const normalizedDeliveryPayload = deliveryPayload.text === void 0 ? {
					...normalizedOutboundPayload,
					text: void 0
				} : normalizedOutboundPayload;
				const reply = resolveSendableOutboundReplyParts(normalizedDeliveryPayload);
				if (!reply.hasMedia && !reply.text.trim()) return whatsAppReplyDeliveryVisibility(false);
				if (!reply.hasMedia) {
					const flushResult = await mediaOnlyCoalescer.flushAll();
					logWhatsAppMediaOnlyFlushResult(flushResult);
					try {
						const durable = await deliverInboundReplyWithMessageSendContext({
							cfg: params.cfg,
							channel: "whatsapp",
							accountId: params.route.accountId,
							agentId: params.route.agentId,
							ctxPayload: params.context,
							payload: normalizedDeliveryPayload,
							info,
							to: conversationId,
							replyToId: resolveWhatsAppDurableReplyToId({
								context: params.context,
								info,
								msg: params.msg,
								payload: normalizedDeliveryPayload
							}),
							formatting: {
								textLimit,
								tableMode,
								chunkMode
							}
						});
						if (durable.status === "failed") {
							if (durable.sentBeforeError === true) throw markWhatsAppVisibleDeliveryError(durable.error);
							throw durable.error;
						}
						if (durable.status === "handled_visible") {
							didSendReply = true;
							const shouldLog = normalizedDeliveryPayload.text ? true : void 0;
							params.rememberSentText(normalizedDeliveryPayload.text, {
								combinedBody: params.context.Body,
								combinedBodySessionKey: params.route.sessionKey,
								logVerboseMessage: shouldLog
							});
							return whatsAppReplyDeliveryVisibilityFromDurableResult(durable.delivery);
						}
						if (durable.status === "handled_no_send") return flushResult.delivered > 0 ? whatsAppReplyDeliveryVisibility(true) : whatsAppReplyDeliveryVisibilityFromDurableResult(durable.delivery);
						const delivery = await deliverNormalizedPayload(normalizedDeliveryPayload, info);
						return flushResult.delivered > 0 && !delivery.visibleReplySent ? whatsAppReplyDeliveryVisibility(true) : delivery;
					} catch (error) {
						throw markWhatsAppReplyDeliveryErrorVisibleAfterFlush(error, flushResult);
					}
				}
				const mediaUrls = getWhatsAppPayloadMediaUrls(normalizedDeliveryPayload);
				if (shouldDeferWhatsAppMediaOnlyPayload({
					info,
					mediaUrls,
					reply
				})) {
					mediaOnlyCoalescer.defer({
						info,
						mediaUrls,
						payload: normalizedDeliveryPayload
					});
					return whatsAppReplyDeliveryVisibility(false);
				}
				const flushResult = await mediaOnlyCoalescer.flushExceptDuplicateMedia(mediaUrls);
				logWhatsAppMediaOnlyFlushResult(flushResult);
				try {
					const delivery = await deliverNormalizedPayload(normalizedDeliveryPayload, info);
					return flushResult.delivered > 0 && !delivery.visibleReplySent ? whatsAppReplyDeliveryVisibility(true) : delivery;
				} catch (error) {
					throw markWhatsAppReplyDeliveryErrorVisibleAfterFlush(error, flushResult);
				}
			},
			onSettled: async () => {
				const flushResult = await mediaOnlyCoalescer.flushAll();
				logWhatsAppMediaOnlyFlushResult(flushResult);
				return whatsAppReplyDeliveryVisibility(flushResult.delivered > 0);
			},
			onReplyStart: params.msg.platform.sendComposing,
			...statusReactionController ? {
				onCompactionStart: async () => {
					await statusReactionController.setCompacting();
				},
				onCompactionEnd: async () => {
					statusReactionController.cancelPending();
					await statusReactionController.setThinking();
				}
			} : {},
			onError: (err, info) => {
				logWhatsAppReplyDeliveryError({
					err,
					info,
					connectionId: params.connectionId,
					msg: params.msg,
					replyLogger: params.replyLogger
				});
			}
		},
		replyOptions: {
			suppressTyping: sourceRepliesAreToolOnly && conversationKind === "group" && !params.msg.wasMentioned,
			disableBlockStreaming,
			...sourceReplyDeliveryMode ? { sourceReplyDeliveryMode } : {},
			onModelSelected: params.onModelSelected,
			...statusReactionController ? { onToolStart: async (payload) => {
				const toolName = payload.name?.trim();
				if (toolName) await statusReactionController.setTool(toolName);
			} } : {}
		}
	});
	const didQueueVisibleReply = hasVisibleChannelTurnDispatch(dispatchResult);
	const didDeliverVisibleReply = didSendReply || dispatchResult.observedReplyDelivery === true;
	if (!didQueueVisibleReply) {
		if (statusReactionController) finalizeWhatsAppStatusReaction({
			controller: statusReactionController,
			outcome: "error",
			hasFinalResponse: false,
			removeAckAfterReply,
			timing: statusReactionTiming
		});
		if (params.shouldClearGroupHistory) params.groupHistories.set(params.groupHistoryKey, []);
		logVerbose("Skipping auto-reply: silent token or no text/media returned from resolver");
		return false;
	}
	if (statusReactionController) finalizeWhatsAppStatusReaction({
		controller: statusReactionController,
		outcome: didDeliverVisibleReply ? "done" : "error",
		hasFinalResponse: didDeliverVisibleReply,
		removeAckAfterReply,
		timing: statusReactionTiming
	});
	if (params.shouldClearGroupHistory) params.groupHistories.set(params.groupHistoryKey, []);
	return didDeliverVisibleReply;
}
async function finalizeWhatsAppStatusReaction(params) {
	if (params.outcome === "done") {
		await params.controller.setDone();
		if (params.removeAckAfterReply) {
			await new Promise((resolve) => {
				setTimeout(resolve, params.timing.doneHoldMs);
			});
			await params.controller.clear();
		} else await params.controller.restoreInitial();
		return;
	}
	await params.controller.setError();
	if (params.hasFinalResponse) {
		if (params.removeAckAfterReply) {
			await new Promise((resolve) => {
				setTimeout(resolve, params.timing.errorHoldMs);
			});
			await params.controller.clear();
		} else await params.controller.restoreInitial();
		return;
	}
	if (params.removeAckAfterReply) await new Promise((resolve) => {
		setTimeout(resolve, params.timing.errorHoldMs);
	});
	await params.controller.restoreInitial();
}
//#endregion
//#region extensions/whatsapp/src/auto-reply/monitor/message-line.runtime.ts
function normalizeAgentId(agentId) {
	return agentId.trim().toLowerCase() || "main";
}
function resolveIdentityNamePrefix(cfg, agentId) {
	const normalizedAgentId = normalizeAgentId(agentId);
	const identityName = cfg.agents?.list?.find((agent) => normalizeAgentId(agent.id ?? "") === normalizedAgentId)?.identity?.name?.trim();
	return identityName ? `[${identityName}]` : void 0;
}
function resolveMessagePrefix(cfg, agentId, opts) {
	const configured = opts?.configured ?? cfg.messages?.messagePrefix;
	if (configured !== void 0) return configured;
	if (opts?.hasAllowFrom === true) return "";
	return resolveIdentityNamePrefix(cfg, agentId) ?? opts?.fallback ?? "[openclaw]";
}
//#endregion
//#region extensions/whatsapp/src/auto-reply/monitor/message-line.ts
function formatReplyTarget(replyTo) {
	if (!replyTo?.body) return null;
	return `[Replying to ${replyTo.sender?.label ?? replyTo.sender?.e164 ?? "unknown sender"}${replyTo.id ? ` id:${replyTo.id}` : ""}]\n${replyTo.body}\n[/Replying]`;
}
function formatReplyContext(msg) {
	return formatReplyTarget(getReplyContext(msg));
}
function buildInboundLine(params) {
	const { cfg, msg, agentId, previousTimestamp, envelope } = params;
	const messagePrefix = resolveMessagePrefix(cfg, agentId, {
		configured: cfg.channels?.whatsapp?.messagePrefix,
		hasAllowFrom: (cfg.channels?.whatsapp?.allowFrom?.length ?? 0) > 0
	});
	const admission = requireWhatsAppInboundAdmission(msg);
	const conversationId = admission.conversation.id;
	const conversationKind = admission.conversation.kind;
	const prefixStr = messagePrefix ? `${messagePrefix} ` : "";
	const replyContext = params.visibleReplyTo === void 0 ? formatReplyContext(msg) : formatReplyTarget(params.visibleReplyTo);
	const baseLine = `${prefixStr}${msg.payload.body}${replyContext ? `\n\n${replyContext}` : ""}`;
	const sender = getSenderIdentity(msg);
	return formatInboundEnvelope({
		channel: "WhatsApp",
		from: conversationKind === "group" ? conversationId : conversationId.replace(/^whatsapp:/, ""),
		timestamp: msg.event.timestamp,
		body: baseLine,
		chatType: conversationKind,
		sender: {
			name: sender.name ?? void 0,
			e164: sender.e164 ?? void 0,
			id: getPrimaryIdentityId(sender) ?? void 0
		},
		previousTimestamp,
		envelope,
		fromMe: msg.platform.fromMe
	});
}
//#endregion
//#region extensions/whatsapp/src/auto-reply/monitor/status-reaction.ts
async function createWhatsAppStatusReactionController(params) {
	if (!params.msg.event.id) return null;
	const statusReactionsConfig = params.cfg.messages?.statusReactions;
	if (statusReactionsConfig?.enabled !== true) return null;
	const admission = requireWhatsAppInboundAdmission(params.msg);
	const accountId = admission.accountId;
	if (resolveWhatsAppReactionLevel({
		cfg: params.cfg,
		accountId
	}).level === "off") return null;
	const ackConfig = params.cfg.channels?.whatsapp?.ackReaction;
	const ackEmoji = resolveWhatsAppAckEmoji({
		cfg: params.cfg,
		agentId: params.agentId,
		ackConfig
	});
	if (!ackEmoji) return null;
	const directEnabled = ackConfig?.direct ?? true;
	const groupMode = ackConfig?.group ?? "mentions";
	const isGroup = admission.conversation.kind === "group";
	const conversationIdForCheck = admission.conversation.id;
	const activation = isGroup ? await resolveGroupActivationFor({
		cfg: params.cfg,
		accountId,
		agentId: params.agentId,
		sessionKey: params.sessionKey,
		conversationId: conversationIdForCheck
	}) : null;
	if (!shouldAckReactionForWhatsApp({
		emoji: ackEmoji,
		isDirect: admission.conversation.kind === "direct",
		isGroup,
		directEnabled,
		groupMode,
		wasMentioned: params.msg.wasMentioned === true,
		groupActivated: activation === "always"
	})) return null;
	const sender = getSenderIdentity(params.msg);
	const reactionOptions = {
		verbose: params.verbose,
		fromMe: false,
		...sender.jid ? { participant: sender.jid } : {},
		accountId,
		cfg: params.cfg
	};
	const chatId = params.msg.platform.chatJid;
	const msgId = params.msg.event.id;
	return createStatusReactionController({
		enabled: true,
		adapter: {
			setReaction: async (emoji) => {
				await sendReactionWhatsApp(chatId, msgId, emoji, reactionOptions);
			},
			clearReaction: async () => {
				await sendReactionWhatsApp(chatId, msgId, "", reactionOptions);
			}
		},
		initialEmoji: ackEmoji,
		emojis: statusReactionsConfig.emojis,
		timing: statusReactionsConfig.timing,
		onError: (err) => {
			logVerbose(`WhatsApp status-reaction error for chat ${chatId}/${msgId}: ${String(err)}`);
		}
	});
}
//#endregion
//#region extensions/whatsapp/src/auto-reply/monitor/process-message.ts
const WHATSAPP_MESSAGE_RECEIVED_HOOK_LIMITS = {
	maxConcurrency: 8,
	maxQueue: 128,
	timeoutMs: 2e3
};
function readWhatsAppMessageReceivedHookOptIn(value) {
	if (!value || typeof value !== "object") return;
	const pluginHooks = value.pluginHooks;
	if (pluginHooks?.messageReceived === void 0) return;
	return pluginHooks.messageReceived;
}
function shouldEmitWhatsAppMessageReceivedHooks(params) {
	const channelConfig = params.cfg.channels?.whatsapp;
	return readWhatsAppMessageReceivedHookOptIn(params.accountId && channelConfig?.accounts ? channelConfig.accounts[params.accountId] : void 0) ?? readWhatsAppMessageReceivedHookOptIn(channelConfig) ?? false;
}
function emitWhatsAppMessageReceivedHooks(params) {
	const canonical = deriveInboundMessageHookContext(params.ctx);
	const hookRunner = getGlobalHookRunner();
	if (hookRunner?.hasHooks("message_received")) fireAndForgetBoundedHook(() => hookRunner.runMessageReceived(toPluginMessageReceivedEvent(canonical), toPluginMessageContext(canonical)), "whatsapp: message_received plugin hook failed", void 0, WHATSAPP_MESSAGE_RECEIVED_HOOK_LIMITS);
	fireAndForgetBoundedHook(() => triggerInternalHook(createInternalHookEvent("message", "received", params.sessionKey, toInternalMessageReceivedContext(canonical))), "whatsapp: message_received internal hook failed", void 0, WHATSAPP_MESSAGE_RECEIVED_HOOK_LIMITS);
}
function emitWhatsAppMessageReceivedHooksIfEnabled(params) {
	if (!shouldEmitWhatsAppMessageReceivedHooks({
		cfg: params.cfg,
		accountId: params.accountId
	})) return;
	emitWhatsAppMessageReceivedHooks({
		ctx: params.ctx,
		sessionKey: params.sessionKey
	});
}
function resolvePinnedMainDmRecipient(params) {
	return resolvePinnedMainDmOwnerFromAllowlist({
		dmScope: params.cfg.session?.dmScope,
		allowFrom: params.allowFrom,
		normalizeEntry: (entry) => normalizeE164(entry)
	});
}
async function processMessage(params) {
	const admission = requireWhatsAppInboundAdmission(params.msg);
	if (admission.ingress.admission !== "dispatch" && admission.ingress.admission !== "observe") return false;
	const conversationId = admission.conversation.id;
	const conversationKind = admission.conversation.kind;
	const self = getSelfIdentity(params.msg);
	const inboundPolicy = resolveWhatsAppInboundPolicy({
		cfg: params.cfg,
		accountId: params.route.accountId ?? admission.accountId,
		selfE164: self.e164 ?? null
	});
	const account = inboundPolicy.account;
	const contextVisibilityMode = resolveChannelContextVisibilityMode({
		cfg: params.cfg,
		channel: "whatsapp",
		accountId: account.accountId
	});
	const { storePath, envelopeOptions, previousTimestamp } = resolveInboundSessionEnvelopeContext({
		cfg: params.cfg,
		agentId: params.route.agentId,
		sessionKey: params.route.sessionKey
	});
	let audioTranscript = params.preflightAudioTranscript ?? void 0;
	const hasAudioBody = params.msg.payload.media?.type?.startsWith("audio/") === true && params.msg.payload.body === "<media:audio>";
	if (params.preflightAudioTranscript === void 0 && hasAudioBody && params.msg.payload.media?.path) try {
		const { transcribeFirstAudio } = await import("./audio-preflight.runtime-zFXqh-cd.js");
		audioTranscript = await transcribeFirstAudio({
			ctx: {
				MediaPaths: [params.msg.payload.media?.path],
				MediaTypes: params.msg.payload.media?.type ? [params.msg.payload.media?.type] : void 0,
				From: conversationId,
				To: params.msg.platform.recipientJid,
				Provider: "whatsapp",
				Surface: "whatsapp",
				OriginatingChannel: "whatsapp",
				OriginatingTo: conversationId,
				AccountId: params.route.accountId
			},
			cfg: params.cfg
		});
	} catch {
		if (shouldLogVerbose()) logVerbose("whatsapp: audio preflight transcription failed, using placeholder");
	}
	const msgForAgent = audioTranscript !== void 0 ? {
		...params.msg,
		payload: {
			...params.msg.payload,
			body: audioTranscript
		}
	} : params.msg;
	const visibleReplyTo = resolveVisibleWhatsAppReplyContext({
		msg: params.msg,
		authDir: account.authDir,
		mode: contextVisibilityMode,
		groupPolicy: inboundPolicy.groupPolicy,
		groupAllowFrom: inboundPolicy.groupAllowFrom
	});
	let combinedBody = buildInboundLine({
		cfg: params.cfg,
		msg: msgForAgent,
		agentId: params.route.agentId,
		previousTimestamp,
		envelope: envelopeOptions,
		visibleReplyTo
	});
	let shouldClearGroupHistory = false;
	const visibleGroupHistory = conversationKind === "group" ? resolveVisibleWhatsAppGroupHistory({
		history: params.groupHistory ?? params.groupHistories.get(params.groupHistoryKey) ?? [],
		mode: contextVisibilityMode,
		groupPolicy: inboundPolicy.groupPolicy,
		groupAllowFrom: inboundPolicy.groupAllowFrom,
		authDir: account.authDir
	}) : void 0;
	if (conversationKind === "group") {
		const history = visibleGroupHistory ?? [];
		if (history.length > 0) combinedBody = buildHistoryContextFromEntries({
			entries: history.map((m) => ({
				sender: m.sender,
				body: m.body,
				timestamp: m.timestamp
			})),
			currentMessage: combinedBody,
			excludeLast: false,
			formatEntry: (entry) => {
				return formatInboundEnvelope({
					channel: "WhatsApp",
					from: conversationId,
					timestamp: entry.timestamp,
					body: entry.body,
					chatType: "group",
					senderLabel: entry.sender,
					envelope: envelopeOptions
				});
			}
		});
		shouldClearGroupHistory = !(params.suppressGroupHistoryClear ?? false);
	}
	const combinedEchoKey = params.buildCombinedEchoKey({
		sessionKey: params.route.sessionKey,
		combinedBody
	});
	if (params.echoHas(combinedEchoKey)) {
		logVerbose("Skipping auto-reply: detected echo for combined message");
		params.echoForget(combinedEchoKey);
		return false;
	}
	const statusReactionController = params.statusReactionController ?? (params.cfg.messages?.statusReactions?.enabled === true && !params.ackAlreadySent ? await createWhatsAppStatusReactionController({
		cfg: params.cfg,
		msg: params.msg,
		agentId: params.route.agentId,
		sessionKey: params.route.sessionKey,
		verbose: params.verbose
	}) : null);
	if (statusReactionController && !params.statusReactionController) statusReactionController.setQueued();
	let ackReaction = params.ackReaction ?? null;
	if (!statusReactionController && !ackReaction && params.ackAlreadySent !== true) ackReaction = await maybeSendAckReaction({
		cfg: params.cfg,
		msg: params.msg,
		agentId: params.route.agentId,
		sessionKey: params.route.sessionKey,
		verbose: params.verbose,
		info: params.replyLogger.info.bind(params.replyLogger),
		warn: params.replyLogger.warn.bind(params.replyLogger)
	});
	const correlationId = params.msg.event.id ?? newConnectionId();
	params.replyLogger.info({
		connectionId: params.connectionId,
		correlationId,
		from: conversationId,
		to: params.msg.platform.recipientJid,
		body: elide(combinedBody, 240),
		mediaType: params.msg.payload.media?.type ?? null,
		mediaPath: params.msg.payload.media?.path ?? null
	}, "inbound web message");
	const fromDisplay = conversationId;
	const kindLabel = params.msg.payload.media?.type ? `, ${params.msg.payload.media?.type}` : "";
	whatsappInboundLog.info(`Inbound message ${fromDisplay} -> ${params.msg.platform.recipientJid} (${conversationKind}${kindLabel}, ${combinedBody.length} chars)`);
	if (shouldLogVerbose()) whatsappInboundLog.debug(`Inbound body: ${elide(combinedBody, 400)}`);
	const sender = getSenderIdentity(params.msg);
	const dmRouteTarget = resolveWhatsAppDmRouteTarget({
		msg: params.msg,
		senderE164: sender.e164 ?? void 0,
		normalizeE164
	});
	const shouldCheckCommandAuth = shouldComputeCommandAuthorized(params.msg.payload.body, params.cfg);
	const isTextCommand = isControlCommandMessage(params.msg.payload.body, params.cfg);
	const commandAuthorized = shouldCheckCommandAuth ? await resolveWhatsAppCommandAuthorized({
		cfg: params.cfg,
		msg: params.msg,
		policy: inboundPolicy
	}) : void 0;
	const commandTurn = isTextCommand ? {
		kind: "text-slash",
		source: "text",
		authorized: Boolean(commandAuthorized),
		body: params.msg.payload.body
	} : {
		kind: "normal",
		source: "message",
		authorized: false,
		body: params.msg.payload.body
	};
	const { onModelSelected, ...replyPipeline } = createChannelReplyPipeline({
		cfg: params.cfg,
		agentId: params.route.agentId,
		channel: "whatsapp",
		accountId: params.route.accountId
	});
	const responsePrefix = resolveWhatsAppResponsePrefix({
		cfg: params.cfg,
		agentId: params.route.agentId,
		isSelfChat: conversationKind !== "group" && inboundPolicy.isSelfChat,
		pipelineResponsePrefix: replyPipeline.responsePrefix
	});
	const replyThreading = resolveBatchedReplyThreadingPolicy(account.replyToMode ?? "off", params.msg.event.isBatched === true);
	const conversationSystemPrompt = conversationKind === "group" ? resolveWhatsAppGroupSystemPrompt({
		accountConfig: account,
		groupId: conversationId
	}) : resolveWhatsAppDirectSystemPrompt({
		accountConfig: account,
		peerId: dmRouteTarget ?? conversationId
	});
	const ctxPayload = await buildWhatsAppInboundContext({
		bodyForAgent: msgForAgent.payload.body,
		combinedBody,
		commandBody: params.msg.payload.body,
		commandAuthorized,
		commandTurn,
		groupHistory: visibleGroupHistory,
		groupMemberRoster: params.groupMemberNames.get(params.groupHistoryKey),
		groupSystemPrompt: conversationSystemPrompt,
		msg: params.msg,
		rawBody: params.msg.payload.body,
		route: params.route,
		sender: {
			id: getPrimaryIdentityId(sender) ?? void 0,
			name: sender.name ?? void 0,
			e164: sender.e164 ?? void 0
		},
		...audioTranscript !== void 0 ? { transcript: audioTranscript } : {},
		...audioTranscript !== void 0 ? { mediaTranscribedIndexes: [0] } : {},
		replyThreading,
		visibleReplyTo: visibleReplyTo ?? void 0,
		suppressMessageReceivedHooks: true
	});
	emitWhatsAppMessageReceivedHooksIfEnabled({
		cfg: params.cfg,
		ctx: ctxPayload,
		accountId: params.route.accountId,
		sessionKey: params.route.sessionKey
	});
	const pinnedMainDmRecipient = resolvePinnedMainDmRecipient({
		cfg: params.cfg,
		allowFrom: inboundPolicy.configuredAllowFrom
	});
	updateWhatsAppMainLastRoute({
		backgroundTasks: params.backgroundTasks,
		cfg: params.cfg,
		ctx: ctxPayload,
		dmRouteTarget,
		pinnedMainDmRecipient,
		route: params.route,
		updateLastRoute: updateLastRouteInBackground,
		warn: params.replyLogger.warn.bind(params.replyLogger)
	});
	const turnResult = await runChannelInboundEvent({
		channel: "whatsapp",
		accountId: params.route.accountId,
		raw: params.msg,
		adapter: {
			ingest: () => ({
				id: params.msg.event.id ?? `${conversationId}:${Date.now()}`,
				timestamp: params.msg.event.timestamp,
				rawText: ctxPayload.RawBody ?? "",
				textForAgent: ctxPayload.BodyForAgent,
				textForCommands: ctxPayload.CommandBody,
				raw: params.msg
			}),
			preflight: () => {
				const reason = admission.ingress.reasonCode;
				if (admission.ingress.admission === "dispatch") return { admission: {
					kind: "dispatch",
					reason
				} };
				if (admission.ingress.admission === "observe") return { admission: {
					kind: "observeOnly",
					reason
				} };
				if (admission.ingress.admission === "skip") return { admission: {
					kind: "handled",
					reason
				} };
				return { admission: {
					kind: "drop",
					reason,
					recordHistory: false
				} };
			},
			resolveTurn: () => ({
				channel: "whatsapp",
				accountId: params.route.accountId,
				routeSessionKey: params.route.sessionKey,
				storePath,
				ctxPayload,
				recordInboundSession,
				record: {
					onRecordError: (err) => {
						params.replyLogger.warn({
							error: formatError(err),
							storePath,
							sessionKey: params.route.sessionKey
						}, "failed updating session meta");
					},
					trackSessionMetaTask: (task) => {
						trackBackgroundTask(params.backgroundTasks, task);
					}
				},
				runDispatch: () => dispatchWhatsAppBufferedReply({
					cfg: params.cfg,
					connectionId: params.connectionId,
					context: ctxPayload,
					deliverReply: deliverWebReply,
					groupHistories: params.groupHistories,
					groupHistoryKey: params.groupHistoryKey,
					maxMediaBytes: params.maxMediaBytes,
					maxMediaTextChunkLimit: params.maxMediaTextChunkLimit,
					msg: params.msg,
					onModelSelected,
					rememberSentText: params.rememberSentText,
					replyLogger: params.replyLogger,
					replyPipeline: {
						...replyPipeline,
						responsePrefix
					},
					replyResolver: params.replyResolver,
					route: params.route,
					shouldClearGroupHistory,
					statusReactionController
				})
			})
		}
	});
	const didSendReply = turnResult.dispatched ? turnResult.dispatchResult : false;
	removeAckReactionHandleAfterReply({
		removeAfterReply: Boolean(params.cfg.messages?.removeAckAfterReply && didSendReply),
		ackReaction,
		onError: (err) => {
			logAckFailure({
				log: logVerbose,
				channel: "whatsapp",
				target: `${params.msg.platform.chatJid ?? conversationId}/${params.msg.event.id ?? "unknown"}`,
				error: err
			});
		}
	});
	return didSendReply;
}
//#endregion
//#region extensions/whatsapp/src/auto-reply/monitor/on-message.ts
function createWebOnMessageHandler(params) {
	const hasExplicitlyPassedInboundAccess = (msg) => msg.admission ? msg.admission.ingress.decision === "allow" : msg.accessControlPassed === true;
	const withDirectSenderPeer = (msg, peerId) => {
		if (requireWhatsAppInboundAdmission(msg).conversation.kind === "group" || msg.platform.sender?.e164 || msg.platform.senderE164 || !peerId.startsWith("+")) return msg;
		const normalized = normalizeE164(peerId);
		if (!normalized) return msg;
		return requireAdmittedWhatsAppInboundMessage(withDeprecatedWebInboundMessageFlatAliases({
			...msg,
			platform: {
				...msg.platform,
				sender: {
					...msg.platform.sender,
					e164: normalized
				},
				senderE164: normalized
			}
		}));
	};
	const processForRoute = async (cfg, msg, route, groupHistoryKey, opts) => {
		const processParams = {
			cfg,
			msg,
			route,
			groupHistoryKey,
			groupHistories: params.groupHistories,
			groupMemberNames: params.groupMemberNames,
			connectionId: params.connectionId,
			verbose: params.verbose,
			maxMediaBytes: params.maxMediaBytes,
			replyResolver: params.replyResolver,
			replyLogger: params.replyLogger,
			backgroundTasks: params.backgroundTasks,
			rememberSentText: params.echoTracker.rememberText,
			echoHas: params.echoTracker.has,
			echoForget: params.echoTracker.forget,
			buildCombinedEchoKey: params.echoTracker.buildCombinedKey
		};
		if (opts?.groupHistory !== void 0) processParams.groupHistory = opts.groupHistory;
		if (opts?.suppressGroupHistoryClear !== void 0) processParams.suppressGroupHistoryClear = opts.suppressGroupHistoryClear;
		if (opts?.preflightAudioTranscript !== void 0) processParams.preflightAudioTranscript = opts.preflightAudioTranscript;
		if (opts?.ackAlreadySent === true) processParams.ackAlreadySent = true;
		if (opts?.ackReaction !== void 0) processParams.ackReaction = opts.ackReaction;
		if (opts?.statusReactionController !== void 0) processParams.statusReactionController = opts.statusReactionController;
		return processMessage(processParams);
	};
	return async (rawMsg) => {
		const canRunDirectEarlyAudioPreflight = hasExplicitlyPassedInboundAccess(rawMsg);
		const normalizedMsg = requireAdmittedWhatsAppInboundMessage(normalizeWebInboundMessage(rawMsg));
		const cfg = params.loadConfig?.() ?? params.cfg;
		const peerId = resolvePeerId(normalizedMsg);
		const msg = withDirectSenderPeer(normalizedMsg, peerId);
		const admission = requireWhatsAppInboundAdmission(msg);
		if (admission.ingress.admission !== "dispatch" && admission.ingress.admission !== "observe") return;
		const conversationId = admission.conversation.id;
		const conversationKind = admission.conversation.kind;
		const baseRoute = resolveAgentRoute({
			cfg,
			channel: "whatsapp",
			accountId: admission.accountId,
			peer: {
				kind: conversationKind,
				id: peerId
			}
		});
		const baseConversationRoute = conversationKind === "group" ? resolveWhatsAppGroupSessionRoute(baseRoute) : baseRoute;
		const routeAccountId = baseConversationRoute.accountId ?? admission.accountId;
		const account = resolveWhatsAppAccount({
			cfg,
			accountId: routeAccountId
		});
		const baseMentionConfig = buildMentionConfig(cfg);
		if (conversationId === msg.platform.recipientJid) logVerbose(`📱 Same-phone mode detected (from === to: ${conversationId})`);
		if (params.echoTracker.has(msg.payload.body)) {
			logVerbose("Skipping auto-reply: detected echo (message matches recently sent text)");
			params.echoTracker.forget(msg.payload.body);
			return;
		}
		if (process.env.OPENCLAW_DEV_MODE === "1" && conversationId === msg.platform.recipientJid) {
			const text = msg.payload.body ?? "";
			if (/(?:^\[.*?\] Reasoning:|^💭 Reasoning:|^Reasoning:)/u.test(text)) {
				logVerbose("Skipping self-chat reasoning echo (dev-mode)");
				return;
			}
		}
		const configuredRoute = resolveConfiguredBindingRoute({
			cfg,
			route: baseConversationRoute,
			channel: "whatsapp",
			accountId: routeAccountId,
			conversationId: peerId
		});
		const route = configuredRoute.route;
		const groupHistoryKey = conversationKind === "group" ? buildGroupHistoryKey({
			channel: "whatsapp",
			accountId: route.accountId,
			peerKind: "group",
			peerId
		}) : route.sessionKey;
		let preflightAudioTranscript;
		const hasAudioBody = msg.payload.media?.type?.startsWith("audio/") === true && msg.payload.body === "<media:audio>";
		const canRunEarlyAudioPreflight = conversationKind === "group" || canRunDirectEarlyAudioPreflight;
		let ackAlreadySent = false;
		let ackReaction = null;
		let statusReactionController = null;
		let recordAcceptedConfiguredGroupRoute = null;
		const clearPreDispatchReaction = async () => {
			try {
				if (statusReactionController) {
					const controller = statusReactionController;
					statusReactionController = null;
					controller.cancelPending();
					await controller.clear();
					return;
				}
				if (ackReaction && await ackReaction.ackReactionPromise) await ackReaction.remove();
			} catch (err) {
				params.replyLogger.warn({ error: String(err) }, "whatsapp: failed to clear pre-dispatch reaction after pre-dispatch rejection");
			}
		};
		const transcribeAudioOnce = async () => {
			if (preflightAudioTranscript !== void 0 || !hasAudioBody || !msg.payload.media?.path) return;
			try {
				const { transcribeFirstAudio } = await import("./audio-preflight.runtime-zFXqh-cd.js");
				preflightAudioTranscript = await transcribeFirstAudio({
					ctx: {
						MediaPaths: [msg.payload.media?.path],
						MediaTypes: msg.payload.media?.type ? [msg.payload.media?.type] : void 0,
						From: conversationId,
						To: msg.platform.recipientJid,
						Provider: "whatsapp",
						Surface: "whatsapp",
						OriginatingChannel: "whatsapp",
						OriginatingTo: conversationId,
						AccountId: route.accountId
					},
					cfg
				}) ?? null;
			} catch {
				preflightAudioTranscript = null;
			}
		};
		const runAudioPreflightOnce = async () => {
			if (preflightAudioTranscript !== void 0 || !canRunEarlyAudioPreflight || !hasAudioBody || !msg.payload.media?.path) return;
			if (cfg.messages?.statusReactions?.enabled === true) {
				statusReactionController = await createWhatsAppStatusReactionController({
					cfg,
					msg,
					agentId: route.agentId,
					sessionKey: route.sessionKey,
					verbose: params.verbose
				});
				if (statusReactionController) await statusReactionController.setQueued();
			} else {
				ackReaction = await maybeSendAckReaction({
					cfg,
					msg,
					agentId: route.agentId,
					sessionKey: route.sessionKey,
					verbose: params.verbose,
					info: params.replyLogger.info.bind(params.replyLogger),
					warn: params.replyLogger.warn.bind(params.replyLogger)
				});
				ackAlreadySent = ackReaction !== null;
			}
			await transcribeAudioOnce();
		};
		if (conversationKind === "group") {
			const sender = getSenderIdentity(msg);
			const metaCtx = {
				From: conversationId,
				To: msg.platform.recipientJid,
				SessionKey: route.sessionKey,
				AccountId: route.accountId,
				ChatType: conversationKind,
				ConversationLabel: conversationId,
				GroupSubject: msg.group?.subject,
				SenderName: sender.name ?? void 0,
				SenderId: getPrimaryIdentityId(sender) ?? void 0,
				SenderE164: sender.e164 ?? void 0,
				Provider: "whatsapp",
				Surface: "whatsapp",
				OriginatingChannel: "whatsapp",
				OriginatingTo: conversationId
			};
			const recordGroupRoute = () => updateLastRouteInBackground({
				cfg,
				backgroundTasks: params.backgroundTasks,
				storeAgentId: route.agentId,
				sessionKey: route.sessionKey,
				channel: "whatsapp",
				to: conversationId,
				accountId: route.accountId,
				ctx: metaCtx,
				warn: params.replyLogger.warn.bind(params.replyLogger)
			});
			recordAcceptedConfiguredGroupRoute = recordGroupRoute;
			let gating = await applyGroupGating({
				cfg,
				msg,
				deferMissingMention: hasAudioBody && Boolean(msg.payload.media?.path),
				groupHistoryKey,
				agentId: route.agentId,
				sessionKey: route.sessionKey,
				baseMentionConfig,
				providerMentionPatterns: account.mentionPatterns,
				authDir: account.authDir,
				selfChatMode: account.selfChatMode,
				groupHistories: params.groupHistories,
				groupHistoryLimit: params.groupHistoryLimit,
				groupMemberNames: params.groupMemberNames,
				logVerbose,
				replyLogger: params.replyLogger
			});
			if (!gating.shouldProcess && "needsMentionText" in gating && gating.needsMentionText === true) {
				await runAudioPreflightOnce();
				gating = await applyGroupGating({
					cfg,
					msg,
					...typeof preflightAudioTranscript === "string" ? { mentionText: preflightAudioTranscript } : {},
					groupHistoryKey,
					agentId: route.agentId,
					sessionKey: route.sessionKey,
					baseMentionConfig,
					providerMentionPatterns: account.mentionPatterns,
					authDir: account.authDir,
					selfChatMode: account.selfChatMode,
					groupHistories: params.groupHistories,
					groupHistoryLimit: params.groupHistoryLimit,
					groupMemberNames: params.groupMemberNames,
					logVerbose,
					replyLogger: params.replyLogger
				});
			}
			if (!gating.shouldProcess) {
				await clearPreDispatchReaction();
				return;
			}
		}
		if (configuredRoute.bindingResolution) {
			const ensured = await ensureConfiguredBindingRouteReady({
				cfg,
				bindingResolution: configuredRoute.bindingResolution
			});
			if (!ensured.ok) {
				params.replyLogger.warn(`whatsapp: configured ACP binding unavailable for conversation ${configuredRoute.bindingResolution.record.conversation.conversationId}: ${ensured.error}`);
				await clearPreDispatchReaction();
				return;
			}
		}
		if (recordAcceptedConfiguredGroupRoute && !configuredRoute.bindingResolution) {
			recordAcceptedConfiguredGroupRoute();
			recordAcceptedConfiguredGroupRoute = null;
		}
		await runAudioPreflightOnce();
		const hasBroadcastTargets = !configuredRoute.bindingResolution && Array.isArray(cfg.broadcast?.[peerId]) && cfg.broadcast[peerId].length > 0;
		if (hasBroadcastTargets && statusReactionController) await clearPreDispatchReaction();
		if (hasBroadcastTargets && !canRunEarlyAudioPreflight) await transcribeAudioOnce();
		if (!configuredRoute.bindingResolution && await maybeBroadcastMessage({
			cfg,
			msg,
			peerId,
			route,
			groupHistoryKey,
			groupHistories: params.groupHistories,
			...preflightAudioTranscript !== void 0 ? { preflightAudioTranscript } : {},
			...ackAlreadySent && conversationKind !== "group" ? { ackAlreadySent: true } : {},
			...ackReaction && conversationKind !== "group" ? { ackReaction } : {},
			...statusReactionController && conversationKind !== "group" ? { ackAlreadySent: true } : {},
			processMessage: (m, r, k, opts) => processForRoute(cfg, m, r, k, opts)
		})) return;
		recordAcceptedConfiguredGroupRoute?.();
		await processForRoute(cfg, msg, route, groupHistoryKey, {
			...preflightAudioTranscript !== void 0 ? { preflightAudioTranscript } : {},
			...ackAlreadySent ? { ackAlreadySent: true } : {},
			...ackReaction ? { ackReaction } : {},
			...statusReactionController ? { statusReactionController } : {}
		});
	};
}
//#endregion
//#region extensions/whatsapp/src/auto-reply/monitor.ts
function isNonRetryableWebCloseStatus(statusCode) {
	return statusCode === 440;
}
let replyResolverRuntimePromise = null;
function loadReplyResolverRuntime() {
	replyResolverRuntimePromise ??= import("./reply-resolver.runtime.js");
	return replyResolverRuntimePromise;
}
function resolveWebMonitorConfigSnapshot(params) {
	const account = resolveWhatsAppAccount({
		cfg: params.cfg,
		accountId: params.accountId
	});
	return {
		cfg: {
			...params.cfg,
			channels: {
				...params.cfg.channels,
				whatsapp: {
					...params.cfg.channels?.whatsapp,
					ackReaction: account.ackReaction,
					messagePrefix: account.messagePrefix,
					allowFrom: account.allowFrom,
					groupAllowFrom: account.groupAllowFrom,
					groupPolicy: account.groupPolicy,
					textChunkLimit: account.textChunkLimit,
					chunkMode: account.chunkMode,
					mediaMaxMb: account.mediaMaxMb,
					blockStreaming: account.blockStreaming,
					groups: account.groups
				}
			}
		},
		account
	};
}
function normalizeReconnectAccountId(accountId) {
	return (accountId ?? "").trim() || "default";
}
function isNoListenerReconnectError(lastError) {
	return typeof lastError === "string" && /No active WhatsApp Web listener/i.test(lastError);
}
function resolveExplicitWhatsAppDebounceOverride(params) {
	const channel = params.sourceCfg?.channels?.whatsapp;
	if (!channel) return;
	const accountId = normalizeReconnectAccountId(params.accountId);
	const accountDebounce = resolveAccountEntry(channel.accounts, accountId)?.debounceMs;
	if (accountDebounce !== void 0) return accountDebounce;
	if (accountId !== "default") {
		const defaultAccountDebounce = resolveAccountEntry(channel.accounts, "default")?.debounceMs;
		if (defaultAccountDebounce !== void 0) return defaultAccountDebounce;
	}
	return channel.debounceMs;
}
function isRetryableAuthUnstableError(error) {
	return error instanceof WhatsAppAuthUnstableError || typeof error === "object" && error !== null && "code" in error && error.code === "whatsapp-auth-unstable";
}
const DEFAULT_TRANSPORT_TIMEOUT_MS = 300 * 1e3;
async function monitorWebChannel(verbose, listenerFactory = attachWebInboxToSocket, keepAlive = true, replyResolver, runtime = defaultRuntime, abortSignal, tuning = {}) {
	const activeReplyResolver = replyResolver ?? (await loadReplyResolverRuntime()).getReplyFromConfig;
	const runId = newConnectionId();
	const replyLogger = getChildLogger({
		module: "web-auto-reply",
		runId
	});
	const heartbeatLogger = getChildLogger({
		module: "web-heartbeat",
		runId
	});
	const reconnectLogger = getChildLogger({
		module: "web-reconnect",
		runId
	});
	const baseCfg = getRuntimeConfig();
	const sourceCfg = getRuntimeConfigSourceSnapshot();
	const { cfg, account } = resolveWebMonitorConfigSnapshot({
		cfg: baseCfg,
		accountId: tuning.accountId
	});
	const loadCurrentMonitorConfig = () => resolveWebMonitorConfigSnapshot({
		cfg: getRuntimeConfig(),
		accountId: account.accountId
	}).cfg;
	const maxMediaBytes = resolveWhatsAppMediaMaxBytes(account);
	const heartbeatSeconds = resolveHeartbeatSeconds(cfg, tuning.heartbeatSeconds);
	const reconnectPolicy = resolveReconnectPolicy(cfg, tuning.reconnect);
	const socketTiming = resolveWhatsAppSocketTiming(cfg, tuning.socketTiming);
	const baseMentionConfig = buildMentionConfig(cfg);
	const groupHistoryLimit = account.historyLimit ?? cfg.channels?.whatsapp?.historyLimit ?? cfg.messages?.groupChat?.historyLimit ?? 50;
	const groupHistories = /* @__PURE__ */ new Map();
	const groupMemberNames = /* @__PURE__ */ new Map();
	const groupMetadataCache = /* @__PURE__ */ new Map();
	const recentMessageKeys = /* @__PURE__ */ new Map();
	const baileysGroupMetaCache = /* @__PURE__ */ new Map();
	const echoTracker = createEchoTracker({
		maxItems: 100,
		logVerbose
	});
	const sleep = tuning.sleep ?? ((ms, signal) => sleepWithAbort(ms, signal ?? abortSignal));
	const stopRequested = () => abortSignal?.aborted === true;
	const currentMaxListeners = process.getMaxListeners?.() ?? 10;
	if (process.setMaxListeners && currentMaxListeners < 50) process.setMaxListeners(50);
	let sigintStop = false;
	const handleSigint = () => {
		sigintStop = true;
	};
	process.once("SIGINT", handleSigint);
	const transportTimeoutMs = tuning.transportTimeoutMs ?? DEFAULT_TRANSPORT_TIMEOUT_MS;
	const messageTimeoutMs = tuning.messageTimeoutMs ?? 1800 * 1e3;
	const watchdogCheckMs = tuning.watchdogCheckMs ?? 60 * 1e3;
	const controller = new WhatsAppConnectionController({
		accountId: account.accountId,
		authDir: account.authDir,
		verbose,
		keepAlive,
		heartbeatSeconds,
		transportTimeoutMs,
		messageTimeoutMs,
		watchdogCheckMs,
		reconnectPolicy,
		socketTiming,
		abortSignal,
		sleep,
		isNonRetryableStatus: isNonRetryableWebCloseStatus
	});
	const statusController = createWebChannelStatusController(tuning.statusSink);
	statusController.emit();
	try {
		while (true) {
			if (stopRequested()) break;
			const connectionId = newConnectionId();
			const inboundDebounceMs = resolveInboundDebounceMs({
				cfg,
				channel: "whatsapp",
				overrideMs: resolveExplicitWhatsAppDebounceOverride({
					cfg,
					sourceCfg,
					accountId: account.accountId
				})
			});
			const shouldDebounce = (msg) => {
				const normalized = normalizeWebInboundMessage(msg);
				if (normalized.payload.media?.path || normalized.payload.media?.type) return false;
				if (normalized.payload.location) return false;
				if (normalized.quote?.id || normalized.quote?.body) return false;
				return !isControlCommandMessage(normalized.payload.body, cfg);
			};
			let connection;
			try {
				connection = await controller.openConnection({
					connectionId,
					getMessage: async (key) => key.id && key.remoteJid ? readWhatsAppBaileysCacheEntry(recentMessageKeys, `${key.remoteJid}:${key.id}`) : void 0,
					cachedGroupMetadata: async (jid) => {
						const meta = readWhatsAppBaileysCacheEntry(baileysGroupMetaCache, jid);
						return meta?.participants?.length ? meta : void 0;
					},
					createListener: async ({ sock, connection: connectionLocal }) => {
						const onMessage = createWebOnMessageHandler({
							cfg,
							loadConfig: loadCurrentMonitorConfig,
							verbose,
							connectionId,
							maxMediaBytes,
							groupHistoryLimit,
							groupHistories,
							groupMemberNames,
							echoTracker,
							backgroundTasks: connectionLocal.backgroundTasks,
							replyResolver: activeReplyResolver,
							replyLogger,
							baseMentionConfig,
							account
						});
						return await (listenerFactory ?? attachWebInboxToSocket)({
							cfg,
							loadConfig: loadCurrentMonitorConfig,
							verbose,
							accountId: account.accountId,
							authDir: account.authDir,
							mediaMaxMb: account.mediaMaxMb,
							selfChatMode: account.selfChatMode,
							sendReadReceipts: account.sendReadReceipts,
							socketTiming,
							debounceMs: inboundDebounceMs,
							shouldDebounce,
							socketRef: controller.socketRef,
							shouldRetryDisconnect: () => !sigintStop && controller.shouldRetryDisconnect(),
							disconnectRetryPolicy: reconnectPolicy,
							disconnectRetryAbortSignal: controller.getDisconnectRetryAbortSignal(),
							groupMetadataCache,
							recentMessageKeys,
							baileysGroupMetaCache,
							onMessage: async (msg) => {
								const normalized = normalizeWebInboundMessage(msg);
								const inboundAt = Date.now();
								controller.noteInbound(inboundAt);
								statusController.noteInbound(inboundAt);
								await onMessage(normalized);
							},
							sock
						});
					},
					onHeartbeat: (snapshot) => {
						const authAgeMs = getWebAuthAgeMs(account.authDir);
						const minutesSinceLastMessage = snapshot.lastInboundAt ? Math.floor((Date.now() - snapshot.lastInboundAt) / 6e4) : null;
						const logData = {
							connectionId: snapshot.connectionId,
							reconnectAttempts: snapshot.reconnectAttempts,
							messagesHandled: snapshot.handledMessages,
							lastInboundAt: snapshot.lastInboundAt,
							lastTransportActivityAt: snapshot.lastTransportActivityAt,
							authAgeMs,
							uptimeMs: snapshot.uptimeMs,
							...minutesSinceLastMessage !== null && minutesSinceLastMessage > 30 ? { minutesSinceLastMessage } : {}
						};
						statusController.noteTransportActivity(snapshot.lastTransportActivityAt);
						if (minutesSinceLastMessage && minutesSinceLastMessage > 30) heartbeatLogger.warn(logData, "⚠️ web gateway heartbeat - no messages in 30+ minutes");
						else heartbeatLogger.info(logData, "web gateway heartbeat");
					},
					onWatchdogTimeout: (snapshot) => {
						const now = Date.now();
						const transportSilentMs = now - snapshot.lastTransportActivityAt;
						const appBaselineAt = snapshot.lastInboundAt ?? snapshot.startedAt;
						const minutesSinceTransportActivity = Math.floor(transportSilentMs / 6e4);
						const minutesSinceAppActivity = Math.floor((now - appBaselineAt) / 6e4);
						const watchdogReason = transportSilentMs > transportTimeoutMs ? "transport-inactive" : "app-silent";
						statusController.noteWatchdogStale();
						heartbeatLogger.warn({
							connectionId: snapshot.connectionId,
							watchdogReason,
							minutesSinceTransportActivity,
							minutesSinceAppActivity,
							lastInboundAt: snapshot.lastInboundAt ? new Date(snapshot.lastInboundAt) : null,
							lastTransportActivityAt: new Date(snapshot.lastTransportActivityAt),
							messagesHandled: snapshot.handledMessages
						}, "WhatsApp watchdog timeout detected - forcing reconnect");
						whatsappHeartbeatLog.warn(`WhatsApp watchdog timeout (${watchdogReason}) - restarting connection`);
					}
				});
			} catch (error) {
				const setupDecision = controller.resolveSetupErrorDecision(error);
				if (setupDecision === "aborted") {
					await controller.shutdown();
					break;
				}
				if (setupDecision) {
					statusController.noteReconnectAttempts(setupDecision.reconnectAttempts);
					statusController.noteClose({
						statusCode: setupDecision.normalized.statusCode,
						error: formatError(error),
						reconnectAttempts: setupDecision.reconnectAttempts,
						healthState: setupDecision.healthState
					});
					if (setupDecision.action === "stop") {
						reconnectLogger.warn({
							connectionId,
							status: setupDecision.normalized.statusLabel,
							reconnectAttempts: setupDecision.reconnectAttempts,
							maxAttempts: reconnectPolicy.maxAttempts
						}, "web reconnect: setup status error; max attempts reached");
						if (setupDecision.healthState === "logged-out") runtime.error(`WhatsApp session logged out during setup. Run \`${formatCliCommand("openclaw channels login --channel whatsapp")}\` to relink.`);
						else if (setupDecision.healthState === "conflict") runtime.error(`WhatsApp Web connection closed during setup (status ${setupDecision.normalized.statusLabel}: session conflict). Resolve conflicting WhatsApp Web sessions, then restart the channel. To force a fresh QR, run \`${formatCliCommand("openclaw channels logout --channel whatsapp")}\` before \`${formatCliCommand("openclaw channels login --channel whatsapp")}\`. Stopping web monitoring.`);
						else runtime.error(`WhatsApp Web connection closed during setup (status ${setupDecision.normalized.statusLabel}) after ${setupDecision.reconnectAttempts}/${reconnectPolicy.maxAttempts} attempts. Relink with \`${formatCliCommand("openclaw channels login --channel whatsapp")}\` if the issue persists.`);
						await controller.shutdown();
						break;
					}
					reconnectLogger.info({
						connectionId,
						status: setupDecision.normalized.statusLabel,
						reconnectAttempts: setupDecision.reconnectAttempts,
						delayMs: setupDecision.delayMs
					}, "web reconnect: setup status error; retrying");
					runtime.error(`WhatsApp Web connection closed during setup (status ${setupDecision.normalized.statusLabel}). Retry ${setupDecision.reconnectAttempts}/${reconnectPolicy.maxAttempts || "∞"} in ${formatDurationPrecise(setupDecision.delayMs ?? 0)}.`);
					try {
						await controller.waitBeforeRetry(setupDecision.delayMs ?? 0);
					} catch {
						break;
					}
					continue;
				}
				if (!isRetryableAuthUnstableError(error)) throw error;
				const retryDecision = controller.consumeReconnectAttempt();
				statusController.noteReconnectAttempts(retryDecision.reconnectAttempts);
				statusController.noteClose({
					error: error.message,
					reconnectAttempts: retryDecision.reconnectAttempts,
					healthState: retryDecision.healthState
				});
				if (retryDecision.action === "stop") {
					reconnectLogger.warn({
						connectionId,
						reconnectAttempts: retryDecision.reconnectAttempts,
						maxAttempts: reconnectPolicy.maxAttempts
					}, "web reconnect: auth state stayed unstable; max attempts reached");
					runtime.error(`WhatsApp auth state is still stabilizing after ${retryDecision.reconnectAttempts}/${reconnectPolicy.maxAttempts} attempts. Stopping web monitoring.`);
					await controller.shutdown();
					break;
				}
				reconnectLogger.info({
					connectionId,
					reconnectAttempts: retryDecision.reconnectAttempts,
					delayMs: retryDecision.delayMs
				}, "web reconnect: auth state still stabilizing during inbox attach; retrying");
				runtime.error(`WhatsApp auth state is still stabilizing. Retry ${retryDecision.reconnectAttempts}/${reconnectPolicy.maxAttempts || "∞"} for inbox attach in ${formatDurationPrecise(retryDecision.delayMs ?? 0)}.`);
				try {
					await controller.waitBeforeRetry(retryDecision.delayMs ?? 0);
				} catch {
					break;
				}
				continue;
			}
			statusController.noteConnected();
			const approvalContextLease = registerChannelRuntimeContext({
				channelRuntime: tuning.channelRuntime,
				channelId: "whatsapp",
				accountId: account.accountId,
				capability: CHANNEL_APPROVAL_NATIVE_RUNTIME_CONTEXT_CAPABILITY,
				context: { accountId: account.accountId },
				abortSignal
			});
			controller.setUnhandledRejectionCleanup(registerUnhandledRejectionHandler((reason) => {
				if (!isLikelyWhatsAppCryptoError(reason)) return false;
				const errorStr = formatError(reason);
				reconnectLogger.warn({
					connectionId: connection.connectionId,
					error: errorStr
				}, "web reconnect: unhandled rejection from WhatsApp socket; forcing reconnect");
				controller.forceClose({
					status: 499,
					isLoggedOut: false,
					error: reason
				});
				return true;
			}));
			const { e164: selfE164 } = readWebSelfId(account.authDir);
			const connectRoute = resolveAgentRoute({
				cfg,
				channel: "whatsapp",
				accountId: account.accountId
			});
			enqueueSystemEvent(`WhatsApp gateway connected${selfE164 ? ` as ${selfE164}` : ""}.`, { sessionKey: connectRoute.sessionKey });
			const normalizedAccountId = normalizeReconnectAccountId(account.accountId);
			drainPendingDeliveries({
				drainKey: `whatsapp:${normalizedAccountId}`,
				logLabel: "WhatsApp reconnect drain",
				cfg,
				log: reconnectLogger,
				selectEntry: (entry) => ({
					match: entry.channel === "whatsapp" && normalizeReconnectAccountId(entry.accountId) === normalizedAccountId,
					bypassBackoff: isNoListenerReconnectError(entry.lastError)
				})
			}).catch((err) => {
				reconnectLogger.warn({
					connectionId: connection.connectionId,
					error: String(err)
				}, "reconnect drain failed");
			});
			const periodicDrainInterval = setInterval(() => {
				drainPendingDeliveries({
					drainKey: `whatsapp:${normalizedAccountId}`,
					logLabel: "WhatsApp periodic drain",
					cfg,
					log: reconnectLogger,
					selectEntry: (entry) => ({
						match: entry.channel === "whatsapp" && normalizeReconnectAccountId(entry.accountId) === normalizedAccountId,
						bypassBackoff: false
					})
				}).catch((err) => {
					reconnectLogger.warn({
						connectionId: connection.connectionId,
						error: String(err)
					}, "periodic drain failed");
				});
			}, 3e4);
			const inboundPolicy = resolveWhatsAppInboundPolicy({
				cfg,
				accountId: account.accountId,
				selfE164: selfE164 ?? null
			});
			whatsappLog.info(formatWhatsAppInboundListeningLog({
				groups: inboundPolicy.account.groups,
				groupPolicy: inboundPolicy.groupPolicy,
				hasGroupAllowFrom: inboundPolicy.groupAllowFrom.length > 0
			}));
			if (process.stdout.isTTY || process.stderr.isTTY) whatsappLog.raw("Ctrl+C to stop.");
			if (!keepAlive) {
				clearInterval(periodicDrainInterval);
				approvalContextLease?.dispose();
				await controller.shutdown();
				return;
			}
			const reason = await controller.waitForClose().finally(() => {
				clearInterval(periodicDrainInterval);
				approvalContextLease?.dispose();
			});
			if (stopRequested() || sigintStop || reason === "aborted") {
				await controller.shutdown();
				break;
			}
			const decision = controller.resolveCloseDecision(reason);
			if (decision === "aborted") {
				await controller.shutdown();
				break;
			}
			statusController.noteReconnectAttempts(controller.getReconnectAttempts());
			reconnectLogger.info({
				connectionId: connection.connectionId,
				status: decision.normalized.statusLabel,
				loggedOut: decision.normalized.isLoggedOut,
				reconnectAttempts: decision.reconnectAttempts,
				error: decision.normalized.errorText
			}, "web reconnect: connection closed");
			enqueueSystemEvent(`WhatsApp gateway disconnected (status ${decision.normalized.statusLabel})`, { sessionKey: connectRoute.sessionKey });
			if (decision.action === "stop") {
				await controller.closeCurrentConnection();
				statusController.noteClose({
					statusCode: decision.normalized.statusCode,
					loggedOut: decision.normalized.isLoggedOut,
					error: decision.normalized.errorText,
					reconnectAttempts: decision.reconnectAttempts,
					healthState: decision.healthState
				});
				if (decision.healthState === "logged-out") runtime.error(`WhatsApp session logged out. Run \`${formatCliCommand("openclaw channels login --channel whatsapp")}\` to relink.`);
				else if (decision.healthState === "conflict") {
					reconnectLogger.warn({
						connectionId: connection.connectionId,
						status: decision.normalized.statusLabel,
						error: decision.normalized.errorText
					}, "web reconnect: non-retryable close status; stopping monitor");
					runtime.error(`WhatsApp Web connection closed (status ${decision.normalized.statusLabel}: session conflict). Resolve conflicting WhatsApp Web sessions, then restart the channel. To force a fresh QR, run \`${formatCliCommand("openclaw channels logout --channel whatsapp")}\` before \`${formatCliCommand("openclaw channels login --channel whatsapp")}\`. Stopping web monitoring.`);
				} else {
					reconnectLogger.warn({
						connectionId: connection.connectionId,
						status: decision.normalized.statusLabel,
						reconnectAttempts: decision.reconnectAttempts,
						maxAttempts: reconnectPolicy.maxAttempts
					}, "web reconnect: max attempts reached; continuing in degraded mode");
					runtime.error(`WhatsApp Web reconnect: max attempts reached (${decision.reconnectAttempts}/${reconnectPolicy.maxAttempts}). Stopping web monitoring.`);
				}
				await controller.shutdown();
				break;
			}
			const isWatchdogRecoveryReconnect = decision.normalized.error === WHATSAPP_WATCHDOG_TIMEOUT_ERROR;
			statusController.noteClose({
				statusCode: decision.normalized.statusCode,
				error: decision.normalized.errorText,
				reconnectAttempts: decision.reconnectAttempts,
				healthState: decision.healthState,
				watchdogRecovery: isWatchdogRecoveryReconnect
			});
			reconnectLogger.info({
				connectionId: connection.connectionId,
				status: decision.normalized.statusLabel,
				reconnectAttempts: decision.reconnectAttempts,
				maxAttempts: reconnectPolicy.maxAttempts || "unlimited",
				delayMs: decision.delayMs
			}, "web reconnect: scheduling retry");
			const reconnectMessage = isWatchdogRecoveryReconnect ? `WhatsApp Web watchdog is recovering a stale connection (status ${decision.normalized.statusLabel}). Retry ${decision.reconnectAttempts}/${reconnectPolicy.maxAttempts || "∞"} in ${formatDurationPrecise(decision.delayMs ?? 0)}.` : `WhatsApp Web connection closed (status ${decision.normalized.statusLabel}). Retry ${decision.reconnectAttempts}/${reconnectPolicy.maxAttempts || "∞"} in ${formatDurationPrecise(decision.delayMs ?? 0)}… (${decision.normalized.errorText})`;
			if (isWatchdogRecoveryReconnect) runtime.log(warn(reconnectMessage));
			else runtime.error(reconnectMessage);
			await controller.closeCurrentConnection();
			try {
				await controller.waitBeforeRetry(decision.delayMs ?? 0);
			} catch {
				break;
			}
		}
	} finally {
		statusController.markStopped();
		process.removeListener("SIGINT", handleSigint);
		await controller.shutdown();
	}
}
//#endregion
export { monitorWebInbox as n, resetWebInboundDedupe as r, monitorWebChannel as t };
