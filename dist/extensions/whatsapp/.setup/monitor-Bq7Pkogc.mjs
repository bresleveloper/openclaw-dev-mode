import { a as resolveWhatsAppAccount, s as resolveWhatsAppMediaMaxBytes } from "./accounts-D_NGDjCx.mjs";
import { c as normalizeWhatsAppPayloadTextPreservingIndentation, d as listWhatsAppSendResultMessageIds, f as mergeWhatsAppAcceptedSendError, g as withWhatsAppLogicalDeliveryActivity, h as rememberWhatsAppPartialSend, l as prepareWhatsAppOutboundMedia, m as rememberWhatsAppAcceptedSend, o as normalizeWhatsAppOutboundPayload, p as normalizeWhatsAppSendResult, r as sendReactionWhatsApp, v as resolveWhatsAppReactionLevel } from "./send-C6jDmcL9.mjs";
import { i as getWhatsAppRuntime, r as getWhatsAppChannelRuntime } from "./runtime-BLlToOi6.mjs";
import { r as getWhatsAppConnectionController } from "./connection-controller-runtime-context-hgLJoRc8.mjs";
import { a as markdownToWhatsAppChunks, c as toWhatsappJid, l as toWhatsappJidWithLid, n as isSelfChatMode, o as resolveEquivalentWhatsAppDirectChatJids, r as jidToE164, s as resolveJidToE164 } from "./targets-runtime-RBjx3pg_.mjs";
import { t as normalizeE164 } from "./text-runtime-CHl0iPYe.mjs";
import { a as cacheInboundMessageMeta, i as buildQuotedMessageOptions, n as resolveWhatsAppGroupSessionRoute, o as lookupInboundMessageMeta, r as resolveWhatsAppLegacyGroupSessionKey } from "./group-session-key-D22hYMdE.mjs";
import { C as getMentionIdentities, D as getSenderIdentity, E as getSelfIdentity, O as identitiesOverlap, S as getComparableIdentityValues, T as getReplyContext, g as readWebSelfId, k as resolveComparableIdentity, o as getWebAuthAgeMs, r as WhatsAppAuthUnstableError, v as readWebSelfIdentityForDecision, w as getPrimaryIdentityId } from "./auth-store-Dh8a3cba.mjs";
import { n as resolveWhatsAppGroupsConfigPath } from "./group-config-path-BGyzT9Lg.mjs";
import { a as waitForWaConnection, c as isWhatsAppSocketOperationTimeoutError, d as withWhatsAppSocketOperationTimeout, l as resolveWhatsAppSocketOperationTimeoutMs, r as createWaSocket, s as createWhatsAppSocketOperationTimeoutAdapter, u as resolveWhatsAppSocketTiming } from "./socket-close-YDZcXb67.mjs";
import { n as getStatusCode, t as formatError } from "./session-errors-JuazczrA.mjs";
import { t as BufferJSON } from "./session.runtime-DcJuO42v.mjs";
import { _ as resolveInboundMediaMimetype, a as addWhatsAppImagePreviewFields, c as extractContextInfo, d as extractMediaKind, f as extractMentionedJids, g as projectWhatsAppInboundMessage, h as hasInboundUserContent, i as resolveWhatsAppOutboundMentions, l as extractExternalAdReplyContext, n as addWhatsAppOutboundMentionsToContent, o as describeReplyContext, p as extractText, r as mayContainWhatsAppOutboundMention, s as extractContactContext, t as createWebSendApi, u as extractLocationData } from "./send-api-B4DOt2RJ.mjs";
import { t as resolveWhatsAppRuntimeGroupPolicy } from "./runtime-group-policy-DeSRFXEV.mjs";
import { c as computeBackoff, d as resolveReconnectPolicy, f as sleepWithAbort, l as newConnectionId, n as WHATSAPP_WATCHDOG_TIMEOUT_ERROR, r as WhatsAppConnectionController, s as DEFAULT_RECONNECT_POLICY, u as resolveHeartbeatSeconds } from "./connection-controller-BHY-8r1P.mjs";
import { n as maybeResolveWhatsAppApprovalReaction } from "./approval-reactions-BnXw-UZI.mjs";
import { t as maybeResolveWhatsAppQuestionReaction } from "./question-reactions-D3Zq9Gbn.mjs";
import { normalizeLowercaseStringOrEmpty, normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
import { createAckReactionHandle, createStatusReactionController, logAckFailure, removeAckReactionHandleAfterReply, shouldAckReaction } from "openclaw/plugin-sdk/channel-feedback";
import { bindIngressLifecycleToReplyOptions, createChannelIngressMonitor, createChannelMessageReplyPipeline, createMessageReceiptFromOutboundResults, listMessageReceiptPlatformIds, resolveChannelMessageSourceReplyDeliveryMode, resolveChannelStreamingBlockEnabled } from "openclaw/plugin-sdk/channel-outbound";
import { formatCliCommand } from "openclaw/plugin-sdk/cli-runtime";
import { PlatformMessageNotDispatchedError } from "openclaw/plugin-sdk/error-runtime";
import { createSubsystemLogger, getChildLogger, redactToolPayloadText } from "openclaw/plugin-sdk/logging-core";
import { resolveMarkdownTableMode as resolveMarkdownTableMode$1 } from "openclaw/plugin-sdk/markdown-table-runtime";
import { createSubsystemLogger as createSubsystemLogger$1, defaultRuntime, formatDurationPrecise, getChildLogger as getChildLogger$1, logVerbose, logVerbose as logVerbose$1, registerUnhandledRejectionHandler, shouldLogVerbose, shouldLogVerbose as shouldLogVerbose$1, warn } from "openclaw/plugin-sdk/runtime-env";
import { registerChannelRuntimeContext } from "openclaw/plugin-sdk/channel-runtime-context";
import { recordChannelActivity } from "openclaw/plugin-sdk/channel-activity-runtime";
import { buildChannelInboundEventContext, createChannelPartialDeliveryError, filterChannelInboundQuoteContext, formatInboundEnvelope, formatInboundEnvelope as formatInboundEnvelope$1, formatInboundMediaUnavailableText, formatLocationText, formatMediaPlaceholderText, hasVisibleInboundReplyDispatch, isChannelPartialDeliveryError, readAgentRunTerminalOutcome, resolveGroupThreadConfig, resolveInboundSessionEnvelopeContext, resolveInboundSupplementalSenderAllowed, runChannelInboundEvent, runGroupThread, shouldDebounceTextInbound, toInboundMediaFactsWithMetadata, toLocationContext } from "openclaw/plugin-sdk/channel-inbound";
import { getAgentScopedMediaLocalRoots } from "openclaw/plugin-sdk/media-runtime";
import { isReasoningReplyPayload, resolveSendableOutboundReplyParts, resolveTextChunksWithFallback, sendMediaWithLeadingCaption } from "openclaw/plugin-sdk/reply-payload";
import { truncateUtf16Safe } from "openclaw/plugin-sdk/text-utility-runtime";
import { createLazyRuntimeModule } from "openclaw/plugin-sdk/lazy-runtime";
import { DisconnectReason, downloadMediaMessage, isHostedLidUser, isHostedPnUser, isJidGroup, isJidGroup as isJidGroup$1, jidDecode, jidEncode, jidNormalizedUser, normalizeMessageContent as normalizeMessageContent$1 } from "baileys";
import { DEFAULT_ACCOUNT_ID, DEFAULT_MAIN_KEY, buildAgentMainSessionKey, buildAgentSessionKey, buildGroupHistoryKey, deriveLastRoutePolicy, normalizeAccountId, resolveAgentRoute, resolveInboundLastRouteSessionKey } from "openclaw/plugin-sdk/routing";
import { asDateTimestampMs, parseStrictFiniteNumber, resolveExpiresAtMsFromDurationMs, resolvePromptHistoryLimit } from "openclaw/plugin-sdk/number-runtime";
import { filterSupplementalContextItems, resolvePinnedMainDmOwnerFromAllowlist } from "openclaw/plugin-sdk/security-runtime";
import { resolveChannelGroupPolicy, resolveChannelGroupRequireMention } from "openclaw/plugin-sdk/channel-policy";
import { createChannelPairingChallengeIssuer } from "openclaw/plugin-sdk/channel-pairing";
import { createHash } from "node:crypto";
import { resolveDefaultGroupPolicy, warnMissingProviderGroupPolicyFallbackOnce } from "openclaw/plugin-sdk/runtime-group-policy";
import { resolveChunkMode, resolveTextChunkLimit } from "openclaw/plugin-sdk/reply-runtime";
import { CHANNEL_APPROVAL_NATIVE_RUNTIME_CONTEXT_CAPABILITY } from "openclaw/plugin-sdk/approval-handler-runtime";
import { drainPendingDeliveries } from "openclaw/plugin-sdk/delivery-queue-runtime";
import { enqueueSystemEvent } from "openclaw/plugin-sdk/system-event-runtime";
import { getSessionEntry, patchSessionEntry, resolveGroupSessionKey, resolveStorePath, resolveStorePath as resolveStorePath$1, updateLastRoute } from "openclaw/plugin-sdk/session-store-runtime";
import { createInboundDebouncer, resolveInboundDebounceMs } from "openclaw/plugin-sdk/channel-inbound-debounce";
import { fanInChannelIngressLifecycles } from "openclaw/plugin-sdk/channel-ingress-runtime";
import { saveMediaStream } from "openclaw/plugin-sdk/media-store";
import { upsertChannelPairingRequest } from "openclaw/plugin-sdk/conversation-runtime";
import { createDedupeCache } from "openclaw/plugin-sdk/dedupe-runtime";
import { getRuntimeConfig as getRuntimeConfig$1 } from "openclaw/plugin-sdk/runtime-config-snapshot";
import { resolveChannelContextVisibilityMode } from "openclaw/plugin-sdk/context-visibility-runtime";
import { buildMentionRegexes, implicitMentionKindWhen, normalizeMentionText, resolveInboundMentionDecision } from "openclaw/plugin-sdk/channel-mention-gating";
import { channelReadyPatch, channelStoppedPatch, createTransportActivityStatusPatch } from "openclaw/plugin-sdk/gateway-runtime";
import { ensureConfiguredBindingRouteReady, resolveConfiguredBindingRoute } from "openclaw/plugin-sdk/conversation-binding-runtime";
import { resolveAgentIdentity, resolveIdentityNamePrefix } from "openclaw/plugin-sdk/agent-runtime";
import { normalizeGroupActivation, parseActivationCommand } from "openclaw/plugin-sdk/group-activation";
import { formatAudioTranscriptForAgent } from "openclaw/plugin-sdk/media-understanding-runtime";
import { hasControlCommand, isControlCommandMessage, shouldComputeCommandAuthorized } from "openclaw/plugin-sdk/command-detection";
import { buildHistoryContextFromEntries, buildInboundHistoryFromEntries, createChannelHistoryWindow } from "openclaw/plugin-sdk/reply-history";
import { createInternalHookEvent, deriveInboundMessageHookContext, fireAndForgetBoundedHook, toInternalMessageReceivedContext, toPluginMessageContext, toPluginMessageReceivedEvent, triggerInternalHook } from "openclaw/plugin-sdk/hook-runtime";
import { getGlobalHookRunner } from "openclaw/plugin-sdk/plugin-runtime";
import { resolveBatchedReplyThreadingPolicy } from "openclaw/plugin-sdk/reply-reference";
import { LocalMediaAccessError, getDefaultLocalRoots, loadWebMedia, loadWebMediaRaw, optimizeImageToJpeg, optimizeImageToPng } from "openclaw/plugin-sdk/web-media";
import { createChannelApiRetryRunner } from "openclaw/plugin-sdk/retry-runtime";
//#region extensions/whatsapp/src/inbound/group-conversation.ts
function resolveWhatsAppGroupConversationId(conversationId) {
	return resolveGroupSessionKey({
		From: conversationId,
		ChatType: "group",
		Provider: "whatsapp"
	})?.id ?? conversationId;
}
//#endregion
//#region extensions/whatsapp/src/inbound/admission.ts
const ingressResolverByAdmission = /* @__PURE__ */ new WeakMap();
function copyAccount(account) {
	const copied = {
		accountId: account.accountId,
		enabled: account.enabled,
		sendReadReceipts: account.sendReadReceipts
	};
	if (account.name) copied.name = account.name;
	if (typeof account.selfChatMode === "boolean") copied.selfChatMode = account.selfChatMode;
	if (account.replyToMode) copied.replyToMode = account.replyToMode;
	return copied;
}
function buildWhatsAppInboundAdmission(params) {
	const admission = {
		channelIngress: params.channelIngress,
		accountId: params.policy.account.accountId,
		isSelfChat: params.policy.isSelfChat,
		account: copyAccount(params.policy.account),
		conversation: {
			kind: params.isGroup ? "group" : "direct",
			id: params.conversationId,
			groupSessionId: resolveWhatsAppGroupConversationId(params.conversationId)
		},
		sender: {
			id: params.senderId,
			isSamePhone: params.policy.isSamePhone(params.senderId)
		},
		ingress: {
			admission: params.access.ingress.admission,
			decision: params.access.ingress.decision,
			decisiveGateId: params.access.ingress.decisiveGateId,
			reasonCode: params.access.ingress.reasonCode
		},
		senderAccess: {
			allowed: params.access.senderAccess.allowed,
			decision: params.access.senderAccess.decision,
			reasonCode: params.access.senderAccess.reasonCode,
			providerMissingFallbackApplied: params.access.senderAccess.providerMissingFallbackApplied
		},
		commandAccess: {
			requested: params.access.commandAccess.requested,
			authorized: params.access.commandAccess.authorized,
			shouldBlockControlCommand: params.access.commandAccess.shouldBlockControlCommand,
			reasonCode: params.access.commandAccess.reasonCode
		},
		activationAccess: {
			ran: params.access.activationAccess.ran,
			allowed: params.access.activationAccess.allowed,
			shouldSkip: params.access.activationAccess.shouldSkip,
			reasonCode: params.access.activationAccess.reasonCode
		}
	};
	if (params.resolveChannelIngress) ingressResolverByAdmission.set(admission, params.resolveChannelIngress);
	return admission;
}
async function resolveWhatsAppAdmissionChannelIngress(admission, contextBinding) {
	return await ingressResolverByAdmission.get(admission)?.(contextBinding);
}
function requireWhatsAppInboundAdmission(params) {
	if (!params.admission) throw new Error("WhatsApp inbound message is missing admission facts");
	return params.admission;
}
//#endregion
//#region extensions/whatsapp/src/inbound-policy.ts
function normalizeWhatsAppIngressPhone(value) {
	const trimmed = value.trim();
	if (!trimmed) return null;
	return normalizeE164(trimmed);
}
function buildResolvedWhatsAppGroupConfig(params) {
	return { channels: { whatsapp: {
		groupPolicy: params.groupPolicy,
		groups: params.groups
	} } };
}
function resolveWhatsAppInboundPolicy(params) {
	const account = resolveWhatsAppAccount({
		cfg: params.cfg,
		accountId: params.accountId
	});
	const configuredAllowFrom = account.allowFrom ?? [];
	const dmPolicy = account.dmPolicy ?? "pairing";
	const dmAllowFrom = configuredAllowFrom.length > 0 ? configuredAllowFrom : params.selfE164 ? [params.selfE164] : [];
	const groupAllowFrom = (Array.isArray(account.groupAllowFrom) && account.groupAllowFrom.length > 0 ? account.groupAllowFrom : void 0) ?? (configuredAllowFrom.length > 0 ? configuredAllowFrom : void 0) ?? [];
	const defaultGroupPolicy = resolveDefaultGroupPolicy(params.cfg);
	const { groupPolicy, providerMissingFallbackApplied } = resolveWhatsAppRuntimeGroupPolicy({
		providerConfigPresent: params.cfg.channels?.whatsapp !== void 0,
		groupPolicy: account.groupPolicy,
		defaultGroupPolicy
	});
	const resolvedGroupCfg = buildResolvedWhatsAppGroupConfig({
		groupPolicy,
		groups: account.groups
	});
	const isSamePhone = (value) => typeof value === "string" && typeof params.selfE164 === "string" && value === params.selfE164;
	return {
		account,
		dmPolicy,
		groupPolicy,
		configuredAllowFrom,
		dmAllowFrom,
		groupAllowFrom,
		isSelfChat: account.selfChatMode ?? isSelfChatMode(params.selfE164, configuredAllowFrom),
		providerMissingFallbackApplied,
		isSamePhone,
		resolveConversationGroupPolicy: (conversationId) => resolveChannelGroupPolicy({
			cfg: resolvedGroupCfg,
			channel: "whatsapp",
			groupId: resolveWhatsAppGroupConversationId(conversationId),
			hasGroupAllowFrom: groupAllowFrom.length > 0
		}),
		resolveConversationRequireMention: (conversationId) => resolveChannelGroupRequireMention({
			cfg: resolvedGroupCfg,
			channel: "whatsapp",
			groupId: resolveWhatsAppGroupConversationId(conversationId)
		})
	};
}
async function resolveWhatsAppIngressAccess(params) {
	return await getWhatsAppChannelRuntime().inbound.ingress.resolveStable({
		channelId: "whatsapp",
		accountId: params.policy.account.accountId,
		identity: {
			key: "whatsapp-sender-phone",
			kind: "phone",
			normalize: normalizeWhatsAppIngressPhone,
			sensitivity: "pii",
			entryIdPrefix: "whatsapp-entry"
		},
		cfg: params.cfg,
		useDefaultPairingStore: true,
		subject: { stableId: params.senderId ?? "" },
		conversation: {
			kind: params.isGroup ? "group" : "direct",
			id: params.conversationId
		},
		contextBinding: params.contextBinding,
		dmPolicy: params.policy.dmPolicy,
		groupPolicy: params.policy.groupPolicy,
		policy: { groupAllowFromFallbackToAllowFrom: false },
		providerMissingFallbackApplied: params.policy.providerMissingFallbackApplied,
		allowFrom: !params.isGroup && params.policy.account.selfChatMode !== false && params.senderId && params.policy.isSamePhone(params.senderId) ? [...params.policy.dmAllowFrom, params.senderId] : params.policy.dmAllowFrom,
		groupAllowFrom: params.policy.groupAllowFrom,
		command: params.includeCommand === true ? {} : void 0
	});
}
async function resolveWhatsAppCommandAuthorized(params) {
	const self = getSelfIdentity(params.msg, params.authDir);
	const admission = requireWhatsAppInboundAdmission(params.msg);
	const policy = params.policy ?? resolveWhatsAppInboundPolicy({
		cfg: params.cfg,
		accountId: admission.accountId,
		selfE164: self.e164 ?? null
	});
	const isGroup = admission.conversation.kind === "group";
	const sender = getSenderIdentity(params.msg, params.authDir);
	const dmSender = sender.e164 ?? admission.conversation.id;
	const groupSender = sender.e164 ?? "";
	if (!normalizeE164(isGroup ? groupSender : dmSender)) return false;
	return (await resolveWhatsAppIngressAccess({
		cfg: params.cfg,
		policy,
		isGroup,
		conversationId: admission.conversation.id,
		senderId: isGroup ? groupSender : dmSender,
		includeCommand: true
	})).commandAccess.authorized;
}
//#endregion
//#region extensions/whatsapp/src/inbound/baileys-cache.ts
const WHATSAPP_BAILEYS_CACHE_MAX_ENTRIES = 500;
function rememberWhatsAppBaileysCacheEntry(cache, key, value, ttlMs) {
	if (!cache) return;
	if (cache.has(key)) cache.delete(key);
	cache.set(key, {
		expiresAt: Date.now() + ttlMs,
		value
	});
	while (cache.size > WHATSAPP_BAILEYS_CACHE_MAX_ENTRIES) {
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
//#endregion
//#region extensions/whatsapp/src/inbound/durable-payload.ts
var WhatsAppIngressPermanentError = class extends Error {
	constructor(reason, message, options) {
		super(message, options);
		this.reason = reason;
		this.name = "WhatsAppIngressPermanentError";
	}
};
function serializeWhatsAppDurableInboundMessage(message) {
	const timestamp = message.messageTimestamp;
	let serializedMessage = message;
	if (timestamp != null && typeof timestamp === "object") try {
		const numericTimestamp = Number(timestamp);
		if (Number.isFinite(numericTimestamp)) serializedMessage = {
			...message,
			messageTimestamp: numericTimestamp
		};
	} catch {}
	return JSON.parse(JSON.stringify(serializedMessage, BufferJSON.replacer));
}
function deserializeWhatsAppDurableInboundMessage(message) {
	try {
		return JSON.parse(JSON.stringify(message), BufferJSON.reviver);
	} catch (error) {
		throw new WhatsAppIngressPermanentError("invalid-payload", "WhatsApp ingress row contains an invalid serialized message", { cause: error });
	}
}
//#endregion
//#region extensions/whatsapp/src/inbound/durable-receive.ts
const WHATSAPP_DURABLE_INBOUND_PAYLOAD_VERSION = 1;
function hashNamespacePart(value) {
	return createHash("sha256").update(value).digest("hex").slice(0, 24);
}
function createWhatsAppDurableInboundMessageId(params) {
	return createHash("sha256").update(`${params.remoteJid}\n${params.id}`).digest("hex");
}
function inspectWhatsAppIngressMessage(message) {
	const remoteJid = message.key?.remoteJid?.trim();
	const id = message.key?.id?.trim();
	if (!remoteJid || !id) throw new WhatsAppIngressPermanentError("missing-message-key", "WhatsApp ingress message is missing key.remoteJid or key.id");
	return {
		eventId: createWhatsAppDurableInboundMessageId({
			remoteJid,
			id
		}),
		laneKey: remoteJid
	};
}
/** Account-scoped queue shared with the pre-drain WhatsApp receive journal. */
function createWhatsAppDurableInboundQueue(accountId) {
	return getWhatsAppRuntime().state.openChannelIngressQueue({
		accountId: hashNamespacePart(accountId),
		stateDir: getWhatsAppRuntime().state.resolveStateDir()
	});
}
function resolveWhatsAppIngressNonRetryableFailure(error) {
	return error instanceof WhatsAppIngressPermanentError ? {
		reason: error.reason,
		message: error.message
	} : null;
}
/** Shared monitor with per-conversation lanes and completion at reply-lane adoption. */
function createWhatsAppIngressMonitor(params) {
	return createChannelIngressMonitor({
		queue: params.queue,
		inspect: (admission) => inspectWhatsAppIngressMessage(admission.message),
		payload: {
			version: WHATSAPP_DURABLE_INBOUND_PAYLOAD_VERSION,
			serialize: (admission, { receivedAt }) => ({
				...admission,
				message: serializeWhatsAppDurableInboundMessage(admission.message),
				receivedAt
			}),
			deserialize: (payload) => ({
				...payload,
				message: deserializeWhatsAppDurableInboundMessage(payload.message)
			}),
			encode: ({ body }) => body,
			decode: (payload) => ({
				version: WHATSAPP_DURABLE_INBOUND_PAYLOAD_VERSION,
				body: payload
			}),
			createClaimError: (kind) => new WhatsAppIngressPermanentError(kind === "invalid-version" ? "invalid-payload" : "event-id-mismatch", kind === "invalid-version" ? "WhatsApp ingress row has an invalid payload version" : "WhatsApp ingress row identity does not match its transport message key")
		},
		deliver: (admission, lifecycle) => params.dispatch(admission, lifecycle),
		pollIntervalMs: params.pollIntervalMs,
		retention: {
			completedTtlMs: 6048e5,
			completedMaxEntries: 5e3,
			failedMaxEntries: 450
		},
		drain: {
			deferredLaneOccupancy: "release",
			resolveNonRetryableFailure: resolveWhatsAppIngressNonRetryableFailure,
			deriveLaneKey: (record) => {
				try {
					return inspectWhatsAppIngressMessage(deserializeWhatsAppDurableInboundMessage(record.payload.message)).laneKey;
				} catch {
					return record.id;
				}
			},
			...params.onLog ? { onLog: params.onLog } : {}
		},
		...params.abortSignal ? { abortSignal: params.abortSignal } : {},
		admissionMode: "while-running",
		createStoppedError: () => /* @__PURE__ */ new Error("WhatsApp ingress monitor is stopped."),
		...params.onError ? { onError: params.onError } : {},
		...params.onActivityChange ? { onActivityChange: params.onActivityChange } : {}
	});
}
//#endregion
//#region extensions/whatsapp/src/inbound/group-metadata-cache.ts
const GROUP_META_TTL_MS = 3e5;
const WHATSAPP_GROUP_METADATA_CACHE_MAX_ENTRIES = 500;
function resolveGroupMetadataExpiresAt(nowRaw = Date.now()) {
	const now = asDateTimestampMs(nowRaw);
	return now === void 0 ? void 0 : resolveExpiresAtMsFromDurationMs(GROUP_META_TTL_MS, { nowMs: now });
}
function rememberGroupMetadataCacheEntry(cache, jid, entry) {
	if (asDateTimestampMs(entry.expires) === void 0) {
		cache.delete(jid);
		return;
	}
	if (cache.has(jid)) cache.delete(jid);
	cache.set(jid, entry);
	while (cache.size > WHATSAPP_GROUP_METADATA_CACHE_MAX_ENTRIES) {
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
function createWhatsAppGroupMetadataCacheOwner(params) {
	const reconnectCache = params.reconnectCache ?? /* @__PURE__ */ new Map();
	const localCache = /* @__PURE__ */ new Map();
	const groupMetadataGenerations = /* @__PURE__ */ new Map();
	const detachListeners = [];
	let closed = false;
	let started = false;
	const summarize = async (meta) => {
		const participantEntries = await Promise.all(meta.participants?.map(async (participant) => {
			const mapped = await params.resolveInboundJid(participant.id);
			return {
				display: mapped ?? participant.id,
				mention: {
					id: participant.id,
					lid: participant.lid,
					phoneNumber: participant.phoneNumber,
					e164: mapped
				}
			};
		}) ?? []);
		return {
			subject: meta.subject,
			participants: participantEntries.map((entry) => entry.display).filter(Boolean),
			mentionParticipants: participantEntries.map((entry) => entry.mention),
			expires: resolveGroupMetadataExpiresAt() ?? 0
		};
	};
	const summarizeForReconnect = (meta) => ({
		subject: meta.subject,
		expires: resolveGroupMetadataExpiresAt() ?? NaN
	});
	const rememberFullUpdate = (jid, meta) => {
		if (closed) return;
		groupMetadataGenerations.set(jid, {});
		rememberWhatsAppBaileysCacheEntry(params.baileysCache, jid, meta, GROUP_META_TTL_MS);
		rememberGroupMetadataCacheEntry(reconnectCache, jid, summarizeForReconnect(meta));
		localCache.delete(jid);
	};
	const forgetFullMetadata = (jid) => {
		groupMetadataGenerations.set(jid, {});
		params.baileysCache?.delete(jid);
		reconnectCache.delete(jid);
		localCache.delete(jid);
	};
	const get = async (jid) => {
		for (;;) {
			if (closed) return { expires: resolveGroupMetadataExpiresAt() ?? 0 };
			const cached = readGroupMetadataCacheEntry(localCache, jid);
			if (cached) return cached;
			const generation = groupMetadataGenerations.get(jid);
			try {
				const hydratedEntry = params.baileysCache?.get(jid);
				const providerMetadata = params.baileysCache ? readWhatsAppBaileysCacheEntry(params.baileysCache, jid) : void 0;
				const hydratedMetadata = providerMetadata?.participants?.length ? providerMetadata : void 0;
				const meta = hydratedMetadata ?? await (params.getCurrentSock() ?? params.sock).groupMetadata(jid);
				if (closed || groupMetadataGenerations.get(jid) !== generation) continue;
				const entry = await summarize(meta);
				if (closed || groupMetadataGenerations.get(jid) !== generation) continue;
				if (hydratedMetadata && hydratedEntry) entry.expires = hydratedEntry.expiresAt;
				else rememberWhatsAppBaileysCacheEntry(params.baileysCache, jid, meta, GROUP_META_TTL_MS);
				groupMetadataGenerations.set(jid, {});
				rememberGroupMetadataCacheEntry(reconnectCache, jid, {
					subject: entry.subject,
					expires: entry.expires
				});
				rememberGroupMetadataCacheEntry(localCache, jid, entry);
				return entry;
			} catch (error) {
				if (closed || groupMetadataGenerations.get(jid) !== generation) continue;
				const hydrated = readGroupMetadataCacheEntry(reconnectCache, jid);
				if (hydrated) {
					rememberGroupMetadataCacheEntry(localCache, jid, hydrated);
					params.logVerbose(`Using cached group metadata for ${jid} after fetch failure: ${String(error)}`);
					return hydrated;
				}
				params.logVerbose(`Failed to fetch group metadata for ${jid}: ${String(error)}`);
				return { expires: resolveGroupMetadataExpiresAt() ?? 0 };
			}
		}
	};
	const resolveOutboundMentions = async (jid, text) => {
		if (isJidGroup$1(jid) !== true || !mayContainWhatsAppOutboundMention(text)) return {
			text,
			mentionedJids: []
		};
		const meta = await get(jid);
		return resolveWhatsAppOutboundMentions({
			chatJid: jid,
			text,
			participants: meta.mentionParticipants
		});
	};
	const applyOutboundMentions = async (jid, content) => {
		if ("text" in content && typeof content.text === "string") {
			const resolved = await resolveOutboundMentions(jid, content.text);
			return addWhatsAppOutboundMentionsToContent({
				...content,
				text: resolved.text
			}, resolved.mentionedJids);
		}
		const caption = content.caption;
		if (typeof caption === "string") {
			const resolved = await resolveOutboundMentions(jid, caption);
			return addWhatsAppOutboundMentionsToContent({
				...content,
				caption: resolved.text
			}, resolved.mentionedJids);
		}
		return content;
	};
	const start = () => {
		if (started || closed) return;
		started = true;
		const listen = (event, listener) => {
			detachListeners.push(params.listen(event, listener));
		};
		listen("groups.upsert", (groups) => {
			for (const group of groups) if (group.id) rememberFullUpdate(group.id, group);
		});
		listen("groups.update", (updates) => {
			for (const update of updates) {
				if (!update.id) continue;
				if (typeof update.subject === "string" && Array.isArray(update.participants)) {
					rememberFullUpdate(update.id, update);
					continue;
				}
				forgetFullMetadata(update.id);
			}
		});
		listen("group-participants.update", (update) => {
			forgetFullMetadata(update.id);
		});
		(async () => {
			try {
				const groups = await params.sock.groupFetchAllParticipating();
				if (closed) return;
				for (const [jid, meta] of Object.entries(groups ?? {})) if (meta && !groupMetadataGenerations.has(jid)) {
					rememberGroupMetadataCacheEntry(reconnectCache, jid, summarizeForReconnect(meta));
					rememberWhatsAppBaileysCacheEntry(params.baileysCache, jid, meta, GROUP_META_TTL_MS);
					groupMetadataGenerations.set(jid, {});
				}
				params.logVerbose(`Hydrated ${Object.keys(groups ?? {}).length} participating groups on connect`);
			} catch (error) {
				const formatted = String(error);
				params.logHydrationWarning(formatted);
				params.logVerbose(`Failed to hydrate participating groups on connect: ${formatted}`);
			}
		})();
	};
	const close = () => {
		closed = true;
		for (const detach of detachListeners.splice(0)) detach();
	};
	return {
		start,
		close,
		get,
		resolveOutboundMentions,
		applyOutboundMentions
	};
}
//#endregion
//#region extensions/whatsapp/src/inbound/lifecycle.ts
function attachEmitterListener(emitter, event, listener) {
	emitter.on(event, listener);
	return () => emitter.off(event, listener);
}
function closeInboundMonitorSocket(sock) {
	if (typeof sock.end === "function") {
		sock.end(/* @__PURE__ */ new Error("OpenClaw WhatsApp listener close"));
		return;
	}
	sock.ws?.close?.();
}
//#endregion
//#region extensions/whatsapp/src/inbound/ingress-lifecycle.ts
const ingressLifecycleKey = Symbol("whatsappIngressLifecycle");
function attachWhatsAppIngressLifecycle(message, lifecycle) {
	if (lifecycle) message[ingressLifecycleKey] = lifecycle;
	return message;
}
function resolveWhatsAppIngressLifecycle(message) {
	return message[ingressLifecycleKey];
}
//#endregion
//#region extensions/whatsapp/src/inbound/message-debounce.ts
function createWhatsAppInboundMessageDebouncer(options) {
	const pendingKeys = /* @__PURE__ */ new Map();
	const activeFlushes = /* @__PURE__ */ new Set();
	const workWaiters = /* @__PURE__ */ new Set();
	const notifyWork = () => {
		const waiters = [...workWaiters];
		workWaiters.clear();
		for (const resolve of waiters) resolve();
	};
	const buildKey = (msg) => {
		const admission = requireWhatsAppInboundAdmission(msg);
		return `${admission.accountId}:${admission.conversation.id}`;
	};
	const resolveSenderKey = (msg) => {
		const admission = requireWhatsAppInboundAdmission(msg);
		const sender = msg.platform.sender;
		return admission.conversation.kind === "group" ? getPrimaryIdentityId(sender ?? null) ?? msg.platform.senderJid ?? msg.platform.senderE164 ?? msg.platform.senderName ?? admission.sender.id : admission.conversation.id;
	};
	const shouldDebounce = (msg) => options.shouldDebounce?.(msg) ?? true;
	const trackKey = (key, senderKey) => {
		pendingKeys.set(key, {
			count: (pendingKeys.get(key)?.count ?? 0) + 1,
			senderKey
		});
	};
	const releaseKey = (entry) => {
		if (!entry.debounceKey || entry.debounceKeyTracked !== true) return;
		const pending = pendingKeys.get(entry.debounceKey);
		if (pending && pending.count > 1) pending.count -= 1;
		else pendingKeys.delete(entry.debounceKey);
	};
	const orderEntries = (entries) => entries.toSorted((a, b) => {
		const timestampDiff = (a.event.timestamp ?? 0) - (b.event.timestamp ?? 0);
		return timestampDiff !== 0 ? timestampDiff : (a.receiveOrder ?? 0) - (b.receiveOrder ?? 0);
	});
	const debouncer = createInboundDebouncer({
		debounceMs: options.resolveDebounceMs(),
		resolveDebounceMs: (entry) => entry.debounceMs,
		buildKey: (msg) => msg.debounceKey ?? buildKey(msg),
		shouldDebounce,
		onFlush: (entries, createFlush) => {
			for (const entry of entries) releaseKey(entry);
			const orderedEntries = orderEntries(entries);
			const { lifecycle, settle, abandon } = fanInChannelIngressLifecycles(orderedEntries.map((entry) => entry.turnAdoptionLifecycle));
			const flush = createFlush({
				lifecycle,
				dispatch: async (admissionLifecycle) => {
					const last = orderedEntries.at(-1);
					if (!last) return;
					try {
						if (orderedEntries.length === 1) {
							await options.onMessage(attachWhatsAppIngressLifecycle(last, admissionLifecycle));
							await settle();
							await Promise.all(orderedEntries.map((entry) => options.markRead(entry.readReceipt)));
							return;
						}
						const mentioned = /* @__PURE__ */ new Set();
						for (const entry of orderedEntries) for (const jid of entry.group?.mentions?.jids ?? []) mentioned.add(jid);
						const combinedBody = orderedEntries.map((entry) => entry.payload.body).filter(Boolean).join("\n");
						const combinedCommandBody = orderedEntries.map((entry) => entry.payload.commandBody ?? entry.payload.body).filter(Boolean).join("\n");
						const combinedMentions = mentioned.size > 0 ? {
							...last.group?.mentions,
							jids: Array.from(mentioned)
						} : last.group?.mentions;
						const combinedGroup = last.group || combinedMentions ? {
							...last.group,
							mentions: combinedMentions
						} : void 0;
						const combinedMessage = attachWhatsAppIngressLifecycle({
							...last,
							turnAdoptionLifecycle: admissionLifecycle,
							payload: {
								...last.payload,
								body: combinedBody,
								commandBody: combinedCommandBody
							},
							group: combinedGroup,
							event: {
								...last.event,
								isBatched: true
							}
						}, admissionLifecycle);
						await options.onMessage(combinedMessage);
						await settle();
						await Promise.all(orderedEntries.map((entry) => options.markRead(entry.readReceipt)));
					} catch (error) {
						await abandon();
						throw error;
					}
				}
			});
			activeFlushes.add(flush.completion);
			options.onPendingWorkChanged();
			notifyWork();
			const cleanup = () => {
				activeFlushes.delete(flush.completion);
				options.onPendingWorkChanged();
			};
			flush.completion.then(cleanup, cleanup);
			return flush;
		},
		onError: options.onError
	});
	const enqueue = async (input) => {
		const message = {
			...input,
			debounceMs: options.resolveDebounceMs()
		};
		const key = buildKey(message);
		if (key) {
			message.debounceKey = key;
			const senderKey = resolveSenderKey(message);
			const pending = pendingKeys.get(key);
			if (pending && pending.senderKey !== senderKey) await debouncer.flushKey(key);
			if (message.debounceMs > 0 && shouldDebounce(message)) {
				message.debounceKeyTracked = true;
				trackKey(key, senderKey);
				options.onPendingWorkChanged();
				notifyWork();
			}
		}
		await debouncer.enqueue(message);
	};
	const hasPendingWork = () => pendingKeys.size > 0 || activeFlushes.size > 0;
	const pendingWorkCount = () => pendingKeys.size + activeFlushes.size;
	const waitForWorkOrIdle = (handlers, handlersIdle) => {
		if (hasPendingWork() || handlersIdle) return Promise.resolve();
		return new Promise((resolve) => {
			const finish = () => {
				workWaiters.delete(finish);
				resolve();
			};
			workWaiters.add(finish);
			Promise.allSettled(handlers).then(finish);
		});
	};
	const drain = async () => {
		while (hasPendingWork()) {
			const keys = Array.from(pendingKeys.keys());
			if (keys.length > 0) await Promise.all(keys.map((key) => debouncer.flushKey(key)));
			await debouncer.drain();
			await Promise.resolve();
		}
	};
	return {
		enqueue,
		drain,
		hasPendingWork,
		pendingWorkCount,
		waitForWorkOrIdle
	};
}
//#endregion
//#region extensions/whatsapp/src/inbound/media.ts
function unwrapMessage(message) {
	return normalizeMessageContent$1(message);
}
async function downloadInboundMedia(msg, sock, maxBytes = 52428800, normalizedMessage) {
	const message = normalizedMessage ?? unwrapMessage(msg.message);
	if (!message) return;
	const mimetype = resolveInboundMediaMimetype(message);
	const fileName = message.documentMessage?.fileName ?? void 0;
	if (!message.imageMessage && !message.videoMessage && !message.ptvMessage && !message.documentMessage && !message.audioMessage && !message.stickerMessage) return;
	const stream = await downloadMediaMessage(msg, "stream", {}, {
		reuploadRequest: sock.updateMediaMessage,
		logger: sock.logger
	});
	return {
		saved: await saveMediaStream(stream, mimetype, "inbound", maxBytes, fileName),
		mimetype,
		fileName
	};
}
async function downloadQuotedInboundMedia(msg, sock, maxBytes = 52428800) {
	const message = unwrapMessage(msg.message);
	const contextInfo = extractContextInfo(message);
	if (!contextInfo?.quotedMessage) return;
	const quotedMessage = contextInfo.quotedMessage;
	const self = sock.user;
	const quotedFromMe = identitiesOverlap({ jid: contextInfo.participant }, {
		jid: self?.id,
		lid: self?.lid,
		e164: self?.phoneNumber
	});
	return downloadInboundMedia({
		key: {
			id: contextInfo?.stanzaId || void 0,
			remoteJid: contextInfo.remoteJid ?? msg.key?.remoteJid ?? void 0,
			participant: contextInfo?.participant ?? void 0,
			fromMe: quotedFromMe
		},
		message: quotedMessage,
		messageTimestamp: msg.messageTimestamp
	}, sock, maxBytes);
}
//#endregion
//#region extensions/whatsapp/src/inbound/message-enrichment.ts
const inboundMediaLogger = createSubsystemLogger("gateway/channels/whatsapp").child("inbound");
const MAX_MEDIA_ERROR_MESSAGE_CHARS = 256;
function sanitizeMediaErrorMessage(error) {
	const rawMessage = error instanceof Error ? error.message : String(error);
	const redacted = redactToolPayloadText(rawMessage).replace(/https?:\/\/\S+/giu, "[redacted-url]").replace(/\b[^@\s]+@[a-z][a-z\d.-]*\b/giu, "[redacted-jid]").replace(/\+?\d[\d ().-]{6,}\d/gu, "[redacted-phone]");
	return truncateUtf16Safe(redacted.split("\n", 1)[0]?.trim() || "unknown error", MAX_MEDIA_ERROR_MESSAGE_CHARS);
}
function logMediaMaterializationFailure(params) {
	const errorClass = params.error instanceof Error && /^[A-Za-z][A-Za-z0-9_.-]{0,63}$/u.test(params.error.name) ? params.error.name : "Error";
	const statusCode = getStatusCode(params.error);
	const errorMessage = sanitizeMediaErrorMessage(params.error);
	const failureDetails = [
		`stage=${params.failureStage}`,
		...params.mediaKind ? [`kind=${params.mediaKind}`] : [],
		...typeof statusCode === "number" ? [`status=${statusCode}`] : []
	].join(" ");
	inboundMediaLogger.warn("WhatsApp inbound media materialization failed", {
		channel: "whatsapp",
		messageId: params.messageId ?? void 0,
		mediaKind: params.mediaKind,
		mimeType: params.mimeType,
		failureStage: params.failureStage,
		errorClass,
		...typeof statusCode === "number" ? { statusCode } : {},
		errorMessage,
		consoleMessage: `WhatsApp inbound media materialization failed (${failureDetails}): ${errorMessage}`
	});
}
async function enrichWhatsAppInboundMessage(params) {
	const { msg, sock } = params;
	const messageProjection = projectWhatsAppInboundMessage(msg.message ?? void 0);
	const location = extractLocationData(messageProjection);
	const locationText = location ? formatLocationText(location) : void 0;
	const contactContext = extractContactContext(messageProjection);
	const externalAdReplyContext = extractExternalAdReplyContext(messageProjection);
	let mediaKind = extractMediaKind(messageProjection);
	let body = extractText(messageProjection);
	if (locationText) body = [body, locationText].filter(Boolean).join("\n").trim();
	if (!body && !mediaKind) return null;
	body = body ?? "";
	const commandBody = body;
	const replyContext = describeReplyContext(messageProjection);
	let mediaPath;
	let mediaType = mediaKind ? resolveInboundMediaMimetype(msg.message) : void 0;
	const nativeMedia = mediaKind ? {
		contentType: mediaType,
		kind: mediaKind
	} : void 0;
	let mediaFileName;
	const maxBytes = (typeof params.mediaMaxMb === "number" && params.mediaMaxMb > 0 ? params.mediaMaxMb : 50) * 1024 * 1024;
	const saveInboundMedia = async (inboundMedia) => {
		if (!inboundMedia) return;
		mediaPath = inboundMedia.saved.path;
		mediaType = inboundMedia.mimetype;
		mediaFileName = inboundMedia.fileName;
	};
	try {
		await saveInboundMedia(await downloadInboundMedia(msg, sock, maxBytes, messageProjection[0]));
	} catch (error) {
		logMediaMaterializationFailure({
			messageId: msg.key?.id,
			mediaKind,
			mimeType: mediaType,
			failureStage: "direct",
			error
		});
		params.logVerbose(`Inbound media download failed: ${String(error)}`);
		body = formatInboundMediaUnavailableText({
			body,
			notice: "[whatsapp attachment unavailable]"
		});
	}
	if (!mediaPath && !mediaKind && replyContext?.media) try {
		await saveInboundMedia(await downloadQuotedInboundMedia(msg, sock, maxBytes));
		mediaKind = replyContext.media.kind ?? void 0;
		mediaType = mediaType ?? replyContext.media.contentType ?? void 0;
	} catch (error) {
		logMediaMaterializationFailure({
			messageId: msg.key?.id,
			mediaKind: replyContext.media.kind ?? void 0,
			mimeType: replyContext.media.contentType ?? void 0,
			failureStage: "quoted",
			error
		});
		params.logVerbose(`Quoted media download failed: ${String(error)}`);
		body = formatInboundMediaUnavailableText({
			body,
			notice: "[whatsapp quoted attachment unavailable]"
		});
	}
	return {
		body,
		commandBody,
		location: location ?? void 0,
		contactContext,
		externalAdReplyContext,
		replyContext,
		mediaPath,
		mediaType,
		mediaFileName,
		mediaKind,
		nativeMedia,
		mentionedJids: extractMentionedJids(messageProjection)
	};
}
//#endregion
//#region extensions/whatsapp/src/inbound/access-control.ts
const PAIRING_REPLY_HISTORY_GRACE_MS = 3e4;
function logWhatsAppVerbose$2(enabled, message) {
	if (!enabled) return;
	defaultRuntime.log(message);
}
function blockedInboundAccess(policy) {
	return {
		allowed: false,
		shouldMarkRead: false,
		isSelfChat: policy.isSelfChat,
		resolvedAccountId: policy.account.accountId
	};
}
async function checkInboundAccessControl(params) {
	const policy = resolveWhatsAppInboundPolicy({
		cfg: params.cfg,
		accountId: params.accountId,
		selfE164: params.selfE164
	});
	const pairingGraceMs = typeof params.pairingGraceMs === "number" && params.pairingGraceMs > 0 ? params.pairingGraceMs : PAIRING_REPLY_HISTORY_GRACE_MS;
	const suppressPairingReply = typeof params.connectedAtMs === "number" && typeof params.messageTimestampMs === "number" && params.messageTimestampMs < params.connectedAtMs - pairingGraceMs;
	warnMissingProviderGroupPolicyFallbackOnce({
		providerMissingFallbackApplied: policy.providerMissingFallbackApplied,
		providerKey: "whatsapp",
		accountId: policy.account.accountId,
		log: (message) => logWhatsAppVerbose$2(params.verbose, message)
	});
	const conversationId = params.group ? params.remoteJid : params.from;
	const accessSenderId = params.group ? params.senderE164 : params.from;
	const admissionSenderId = params.group ? params.senderE164 ?? params.senderJid ?? params.from : params.from;
	const resolveChannelIngress = async (contextBinding) => await resolveWhatsAppIngressAccess({
		cfg: params.cfg,
		policy,
		isGroup: params.group,
		conversationId,
		senderId: accessSenderId,
		contextBinding
	});
	const access = await resolveChannelIngress();
	const { senderAccess } = access;
	if (params.group && senderAccess.decision !== "allow") {
		if (senderAccess.reasonCode === "group_policy_disabled") logWhatsAppVerbose$2(params.verbose, "Blocked group message (groupPolicy: disabled)");
		else if (senderAccess.reasonCode === "group_policy_empty_allowlist") logWhatsAppVerbose$2(params.verbose, "Blocked group message (groupPolicy: allowlist, no groupAllowFrom)");
		else logWhatsAppVerbose$2(params.verbose, `Blocked group message from ${params.senderE164 ?? "unknown sender"} (groupPolicy: allowlist)`);
		return blockedInboundAccess(policy);
	}
	if (!params.group) {
		if (params.isFromMe && (policy.account.selfChatMode === false || !policy.isSamePhone(params.from))) {
			logWhatsAppVerbose$2(params.verbose, "Skipping outbound DM (fromMe); no pairing reply needed.");
			return blockedInboundAccess(policy);
		}
		if (senderAccess.decision === "block" && senderAccess.reasonCode === "dm_policy_disabled") {
			logWhatsAppVerbose$2(params.verbose, "Blocked dm (dmPolicy: disabled)");
			return blockedInboundAccess(policy);
		}
		if (senderAccess.decision === "pairing" && !policy.isSamePhone(params.from)) {
			const candidate = params.from;
			if (suppressPairingReply) logWhatsAppVerbose$2(params.verbose, `Skipping pairing reply for historical DM from ${candidate}.`);
			else await createChannelPairingChallengeIssuer({
				channel: "whatsapp",
				accountId: policy.account.accountId,
				upsertPairingRequest: async ({ id, meta }) => await upsertChannelPairingRequest({
					channel: "whatsapp",
					id,
					accountId: policy.account.accountId,
					meta
				})
			})({
				senderId: candidate,
				senderIdLine: `Your WhatsApp phone number: ${candidate}`,
				meta: { name: (params.pushName ?? "").trim() || void 0 },
				onCreated: () => {
					logWhatsAppVerbose$2(params.verbose, `whatsapp pairing request sender=${candidate} name=${params.pushName ?? "unknown"}`);
				},
				sendPairingReply: async (text) => {
					await params.sock.sendMessage(params.remoteJid, { text });
				},
				onReplyError: (err) => {
					logWhatsAppVerbose$2(params.verbose, `whatsapp pairing reply failed for ${candidate}: ${String(err)}`);
				}
			});
			return blockedInboundAccess(policy);
		}
		if (senderAccess.decision !== "allow") {
			logWhatsAppVerbose$2(params.verbose, `Blocked unauthorized sender ${params.from} (dmPolicy=${policy.dmPolicy})`);
			return blockedInboundAccess(policy);
		}
	}
	return {
		allowed: true,
		shouldMarkRead: true,
		isSelfChat: policy.isSelfChat,
		resolvedAccountId: policy.account.accountId,
		admission: buildWhatsAppInboundAdmission({
			policy,
			access,
			channelIngress: access,
			resolveChannelIngress,
			isGroup: params.group,
			conversationId,
			senderId: admissionSenderId
		})
	};
}
//#endregion
//#region extensions/whatsapp/src/inbound/dedupe.ts
const recentOutboundMessages = createDedupeCache({
	ttlMs: 12e5,
	maxSize: 5e3
});
function buildMessageKey(params) {
	const accountId = params.accountId.trim();
	const rawRemoteJid = params.remoteJid.trim();
	const hostedPhone = isHostedPnUser(rawRemoteJid);
	let remoteJid;
	if (hostedPhone || isHostedLidUser(rawRemoteJid)) {
		const decodedJid = jidDecode(rawRemoteJid);
		if (!decodedJid) return null;
		remoteJid = jidEncode(decodedJid.user, hostedPhone ? "s.whatsapp.net" : "lid");
	} else remoteJid = jidNormalizedUser(rawRemoteJid);
	const messageId = params.messageId.trim();
	if (!accountId || !remoteJid || !messageId || messageId === "unknown") return null;
	return `${accountId}:${remoteJid}:${messageId}`;
}
function resetWebInboundDedupe() {
	recentOutboundMessages.clear();
}
function rememberRecentOutboundMessage(params) {
	const key = buildMessageKey(params);
	if (!key) return;
	recentOutboundMessages.check(key);
}
function isRecentOutboundMessage(params) {
	const key = buildMessageKey(params);
	if (!key) return false;
	if (recentOutboundMessages.peek(key)) return true;
	if (!params.alternateRemoteJid || isJidGroup(params.remoteJid)) return false;
	const alternateKey = buildMessageKey({
		...params,
		remoteJid: params.alternateRemoteJid
	});
	return alternateKey !== null && recentOutboundMessages.peek(alternateKey);
}
//#endregion
//#region extensions/whatsapp/src/inbound/message-normalization.ts
function createWhatsAppInboundMessageNormalizer(options) {
	const { socketSession, groupMetadata } = options;
	const shouldSkipRecentOutboundEcho = (msg) => {
		const id = msg.key?.id ?? void 0;
		const remoteJid = msg.key?.remoteJid;
		if (!msg.key?.fromMe || !id || !remoteJid || !isRecentOutboundMessage({
			accountId: options.accountId,
			remoteJid,
			alternateRemoteJid: msg.key?.remoteJidAlt,
			messageId: id
		})) return false;
		options.logVerbose(`Skipping recent outbound WhatsApp echo ${id} for ${remoteJid}`);
		return true;
	};
	const normalize = async (msg) => {
		const id = msg.key?.id ?? void 0;
		const remoteJid = msg.key?.remoteJid;
		if (!remoteJid || remoteJid.endsWith("@status") || remoteJid.endsWith("@broadcast")) return null;
		const group = isJidGroup$1(remoteJid) === true;
		if (shouldSkipRecentOutboundEcho(msg)) return null;
		if (!hasInboundUserContent(msg.message ?? void 0)) return null;
		const participantJid = msg.key?.participant ?? void 0;
		const from = group ? remoteJid : await socketSession.resolveInboundJid(remoteJid);
		if (!from) return null;
		const senderE164 = group ? participantJid ? await socketSession.resolveInboundJid(participantJid) : null : from;
		let groupSubject;
		let groupParticipants;
		if (group) {
			const meta = await groupMetadata.get(remoteJid);
			groupSubject = meta.subject;
			groupParticipants = meta.participants;
		}
		const messageTimestampSeconds = options.parseTimestampSeconds(msg.messageTimestamp);
		const messageTimestampMs = messageTimestampSeconds !== void 0 ? messageTimestampSeconds * 1e3 : void 0;
		const access = await checkInboundAccessControl({
			cfg: options.loadConfig?.() ?? options.cfg,
			accountId: options.accountId,
			from,
			selfE164: socketSession.self.e164 ?? null,
			senderE164,
			senderJid: participantJid,
			group,
			pushName: msg.pushName ?? void 0,
			isFromMe: Boolean(msg.key?.fromMe),
			messageTimestampMs,
			connectedAtMs: socketSession.connectedAtMs,
			verbose: options.verbose,
			sock: { sendMessage: (jid, content) => socketSession.sendTrackedMessage(jid, content) },
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
	return {
		normalize,
		shouldSkipRecentOutboundEcho
	};
}
//#endregion
//#region extensions/whatsapp/src/inbound/message-delivery.ts
const INBOUND_CLOSE_DRAIN_TIMEOUT_MS = 5e3;
const WHATSAPP_INGRESS_DRAIN_INTERVAL_MS = 1e3;
function parseWhatsAppTimestampSeconds(value) {
	if (value == null) return;
	if (typeof value === "string") return parseStrictFiniteNumber(value);
	const parsed = Number(value);
	return Number.isFinite(parsed) ? parsed : void 0;
}
function logWhatsAppVerbose$1(enabled, message) {
	if (!enabled) return;
	defaultRuntime.log(message);
}
function recordAcceptedInboundActivity(accountId) {
	recordChannelActivity({
		channel: "whatsapp",
		accountId,
		direction: "inbound"
	});
}
function createWhatsAppMessageDeliveryCoordinator(options) {
	const inboundLogger = getChildLogger({ module: "web-inbound" });
	const inboundConsoleLog = createSubsystemLogger$1("gateway/channels/whatsapp").child("inbound");
	const sock = options.sock;
	const socketSession = options.socketSession;
	const groupMetadata = options.groupMetadata;
	const { connectedAtMs, self, getCurrentSock, resolveInboundJid, resolveReactionTargetJids, rememberBaileysMessage, assertCanSendToJid, sendTrackedMessage, socketOperations } = socketSession;
	const durableInboundQueue = options.durableInboundQueue ?? createWhatsAppDurableInboundQueue(options.accountId);
	const pendingMessageHandlers = /* @__PURE__ */ new Set();
	let durableIngressActive = false;
	let nextReceiveOrder = 0;
	const publishPendingWorkState = (at = Date.now()) => {
		options.onPendingWorkChanged?.(pendingMessageHandlers.size + messageDebouncer.pendingWorkCount() + (durableIngressActive ? 1 : 0), at);
	};
	const messageNormalizer = createWhatsAppInboundMessageNormalizer({
		cfg: options.cfg,
		loadConfig: options.loadConfig,
		accountId: options.accountId,
		verbose: options.verbose,
		socketSession,
		groupMetadata,
		parseTimestampSeconds: parseWhatsAppTimestampSeconds,
		logVerbose: (message) => logWhatsAppVerbose$1(options.verbose, message)
	});
	const normalizeInboundMessage = messageNormalizer.normalize;
	const shouldSkipRecentOutboundEcho = messageNormalizer.shouldSkipRecentOutboundEcho;
	const buildReadReceiptTarget = (inbound) => inbound.id ? {
		remoteJid: inbound.remoteJid,
		id: inbound.id,
		...inbound.participantJid ? { participant: inbound.participantJid } : {}
	} : void 0;
	const maybeMarkInboundAsRead = async (target) => {
		if (!target || options.sendReadReceipts === false) return;
		const { id, remoteJid, participant } = target;
		try {
			await socketSession.markRead(target);
			const suffix = participant ? ` (participant ${participant})` : "";
			logWhatsAppVerbose$1(options.verbose, `Marked message ${id} as read for ${remoteJid}${suffix}`);
		} catch (err) {
			logWhatsAppVerbose$1(options.verbose, `Failed to mark message ${id} read: ${String(err)}`);
		}
	};
	const maybeLogSkippedSelfChatReadReceipt = (inbound, target) => {
		if (target?.id && inbound.access.isSelfChat && options.verbose) logWhatsAppVerbose$1(options.verbose, `Self-chat mode: skipping read receipt for ${target.id}`);
	};
	const maybeMarkNonSelfChatReadReceipt = async (inbound, target) => {
		if (inbound.access.isSelfChat) {
			maybeLogSkippedSelfChatReadReceipt(inbound, target);
			return;
		}
		await maybeMarkInboundAsRead(target);
	};
	const messageDebouncer = createWhatsAppInboundMessageDebouncer({
		resolveDebounceMs: () => resolveInboundDebounceMs({
			cfg: options.loadConfig?.() ?? options.cfg,
			channel: "whatsapp",
			overrideMs: options.debounceMs
		}),
		onMessage: options.onMessage,
		shouldDebounce: options.shouldDebounce,
		markRead: maybeMarkInboundAsRead,
		onPendingWorkChanged: publishPendingWorkState,
		onError: (error) => {
			inboundLogger.error({ error: String(error) }, "failed handling inbound web message");
			inboundConsoleLog.error(`Failed handling inbound web message: ${String(error)}`);
		}
	});
	const shouldSkipStaleAppend = (msg, upsertType) => {
		if (upsertType !== "append") return false;
		const APPEND_RECENT_GRACE_MS = 6e4;
		const msgTsSeconds = parseWhatsAppTimestampSeconds(msg.messageTimestamp);
		const msgTsMs = msgTsSeconds !== void 0 ? msgTsSeconds * 1e3 : 0;
		const nowMs = Date.now();
		return msgTsMs < (options.appendReplyWindow && nowMs <= options.appendReplyWindow.untilMs ? Math.max(options.appendReplyWindow.afterMs, nowMs - options.appendReplyWindow.maxAgeMs) : connectedAtMs - APPEND_RECENT_GRACE_MS);
	};
	const preparedInboundByDurableId = /* @__PURE__ */ new Map();
	const enqueueInboundMessage = async (msg, inbound, enriched, durable) => {
		const chatJid = inbound.remoteJid;
		const sendComposing = async () => {
			const currentSock = getCurrentSock();
			if (!currentSock) return;
			try {
				await assertCanSendToJid(chatJid, currentSock);
				await socketOperations.sendPresenceUpdate("composing", chatJid);
			} catch (err) {
				logWhatsAppVerbose$1(options.verbose, `Presence update failed: ${String(err)}`);
			}
		};
		const reply = async (text, optionsResult) => {
			const resolved = await groupMetadata.resolveOutboundMentions(chatJid, text);
			const result = await sendTrackedMessage(chatJid, addWhatsAppOutboundMentionsToContent({ text: resolved.text }, resolved.mentionedJids), optionsResult);
			return normalizeWhatsAppSendResult(result, "text");
		};
		const sendMedia = async (payload, optionsValue) => {
			const previewPayload = await addWhatsAppImagePreviewFields(payload);
			const result = await sendTrackedMessage(chatJid, await groupMetadata.applyOutboundMentions(chatJid, previewPayload), optionsValue);
			return normalizeWhatsAppSendResult(result, "media");
		};
		const timestamp = inbound.messageTimestampMs;
		const mentionedJids = enriched.mentionedJids;
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
		const media = enriched.mediaPath || enriched.mediaType || enriched.mediaFileName || enriched.mediaKind ? {
			path: enriched.mediaPath,
			type: enriched.mediaType,
			fileName: enriched.mediaFileName,
			kind: enriched.mediaKind
		} : void 0;
		const groupMentions = mentionedJids ? { jids: mentionedJids } : void 0;
		const group = inbound.group && (inbound.groupSubject || inbound.groupParticipants?.length || groupMentions) ? {
			subject: inbound.groupSubject,
			participants: inbound.groupParticipants,
			mentions: groupMentions
		} : void 0;
		const channelStructuredContext = [
			...enriched.nativeMedia ? [{
				label: "WhatsApp media",
				source: "whatsapp",
				type: "media",
				payload: enriched.nativeMedia
			}] : [],
			...enriched.contactContext ? [{
				label: "WhatsApp contact",
				source: "whatsapp",
				type: enriched.contactContext.kind,
				payload: enriched.contactContext
			}] : [],
			...enriched.externalAdReplyContext ? [{
				label: "WhatsApp external ad reply",
				source: "whatsapp",
				type: "external_ad_reply",
				payload: enriched.externalAdReplyContext
			}] : []
		];
		const inboundMessage = {
			admission: inbound.access.admission,
			event: {
				id: inbound.id,
				timestamp
			},
			payload: {
				body: enriched.body,
				commandBody: enriched.commandBody,
				location: enriched.location ?? void 0,
				channelStructuredContext: channelStructuredContext.length > 0 ? channelStructuredContext : void 0,
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
				media: enriched.replyContext.media,
				sender: {
					displayName: enriched.replyContext.sender?.label ?? void 0,
					jid: enriched.replyContext.sender?.jid ?? void 0,
					e164: enriched.replyContext.sender?.e164 ?? void 0
				}
			} : void 0,
			group,
			turnAdoptionLifecycle: durable.turnAdoptionLifecycle,
			readReceipt: durable.readReceipt,
			receiveOrder: durable.receiveOrder
		};
		if (inboundMessage.event.id) {
			const admission = requireWhatsAppInboundAdmission(inboundMessage);
			cacheInboundMessageMeta(admission.accountId, inboundMessage.platform.chatJid, inboundMessage.event.id, {
				participant: inboundMessage.platform.senderJid,
				participantE164: admission.conversation.kind === "direct" ? inboundMessage.platform.senderE164 : void 0,
				body: inboundMessage.payload.body,
				media: enriched.nativeMedia,
				fromMe: inboundMessage.platform.fromMe
			});
		}
		await messageDebouncer.enqueue(inboundMessage);
	};
	const processDurableInboundMessage = async (admission, lifecycle) => {
		const { message: msg, ...context } = admission;
		rememberBaileysMessage(msg.key?.remoteJid, msg.key?.id, msg.message);
		const remoteJid = msg.key?.remoteJid;
		const id = msg.key?.id;
		const durableId = remoteJid && id ? createHash("sha256").update(`${remoteJid}\n${id}`).digest("hex") : void 0;
		const preparation = durableId ? preparedInboundByDurableId.get(durableId) : void 0;
		if (durableId) preparedInboundByDurableId.delete(durableId);
		if (context.skipRecentOutboundEcho === true) return "completed";
		if (await maybeResolveWhatsAppApprovalReaction({
			cfg: options.loadConfig?.() ?? options.cfg,
			accountId: options.accountId,
			msg,
			selfJid: self.jid,
			selfLid: self.lid,
			resolveInboundJid,
			resolveReactionTargetJids,
			logVerboseMessage: (message) => logWhatsAppVerbose$1(options.verbose, message)
		})) return "completed";
		const prepared = await preparation;
		if (prepared === null) return "completed";
		const inbound = prepared ?? await normalizeInboundMessage(msg);
		if (!inbound) return "completed";
		if (await maybeResolveWhatsAppQuestionReaction({
			cfg: options.loadConfig?.() ?? options.cfg,
			accountId: options.accountId,
			msg,
			senderId: inbound.senderE164 ?? inbound.from,
			resolveReactionTargetJids,
			logDebug: (message) => logWhatsAppVerbose$1(options.verbose, message)
		})) return "completed";
		const readReceipt = buildReadReceiptTarget(inbound);
		const deliveryReadReceipt = inbound.access.isSelfChat ? void 0 : readReceipt;
		if (context.skipStaleAppend === true) {
			await maybeMarkNonSelfChatReadReceipt(inbound, readReceipt);
			return "completed";
		}
		const enriched = await enrichWhatsAppInboundMessage({
			msg,
			sock,
			mediaMaxMb: options.mediaMaxMb,
			logVerbose: (message) => logWhatsAppVerbose$1(options.verbose, message)
		});
		if (!enriched) {
			await maybeMarkNonSelfChatReadReceipt(inbound, deliveryReadReceipt);
			return "completed";
		}
		recordAcceptedInboundActivity(options.accountId);
		await enqueueInboundMessage(msg, inbound, enriched, {
			readReceipt: deliveryReadReceipt,
			receiveOrder: context.receiveOrder ?? context.receivedAt,
			turnAdoptionLifecycle: lifecycle
		});
		return "deferred";
	};
	const durableInboundMonitor = createWhatsAppIngressMonitor({
		queue: durableInboundQueue,
		dispatch: async (admission, lifecycle) => ({ kind: await processDurableInboundMessage(admission, lifecycle) }),
		pollIntervalMs: WHATSAPP_INGRESS_DRAIN_INTERVAL_MS,
		onLog: (message) => inboundLogger.warn({ message }, "whatsapp ingress drain"),
		onError: (error) => inboundLogger.error({ error: formatError(error) }, "whatsapp durable inbound drain failed"),
		onActivityChange: (active) => {
			durableIngressActive = active;
			publishPendingWorkState();
		}
	});
	const handleMessagesUpsert = async (upsert) => {
		if (upsert.type !== "notify" && upsert.type !== "append") return;
		for (const msg of upsert.messages ?? []) {
			rememberBaileysMessage(msg.key?.remoteJid, msg.key?.id, msg.message);
			const receiveOrder = nextReceiveOrder++;
			let approvalReactionResolved = false;
			try {
				approvalReactionResolved = await maybeResolveWhatsAppApprovalReaction({
					cfg: options.loadConfig?.() ?? options.cfg,
					accountId: options.accountId,
					msg,
					selfJid: self.jid,
					selfLid: self.lid,
					resolveInboundJid,
					resolveReactionTargetJids,
					logVerboseMessage: (message) => logWhatsAppVerbose$1(options.verbose, message)
				});
			} catch (error) {
				inboundLogger.warn({ error: formatError(error) }, "whatsapp approval reaction resolution failed; admitting reaction for durable replay");
			}
			if (approvalReactionResolved) continue;
			const receivedAt = Date.now();
			const skipStaleAppend = shouldSkipStaleAppend(msg, upsert.type);
			const skipRecentOutboundEcho = shouldSkipRecentOutboundEcho(msg);
			const remoteJid = msg.key?.remoteJid;
			const id = msg.key?.id;
			const durableId = remoteJid && id ? createHash("sha256").update(`${remoteJid}\n${id}`).digest("hex") : void 0;
			let resolvePrepared;
			if (durableId && !preparedInboundByDurableId.has(durableId)) {
				if (preparedInboundByDurableId.size >= 1e3) {
					const oldest = preparedInboundByDurableId.keys().next().value;
					if (oldest !== void 0) preparedInboundByDurableId.delete(oldest);
				}
				preparedInboundByDurableId.set(durableId, new Promise((resolve) => {
					resolvePrepared = resolve;
				}));
			}
			const finishPreparation = (inbound, keepForDrain = false) => {
				resolvePrepared?.(inbound);
				if (!keepForDrain && durableId && resolvePrepared) preparedInboundByDurableId.delete(durableId);
			};
			let result;
			try {
				result = await durableInboundMonitor.admit({
					message: msg,
					upsertType: upsert.type,
					skipStaleAppend,
					skipRecentOutboundEcho,
					receivedAt,
					receiveOrder
				}, { receivedAt });
			} catch (error) {
				finishPreparation(void 0);
				const formattedError = formatError(error);
				inboundLogger.error({ error: formattedError }, "failed persisting durable WhatsApp inbound after retries; message dropped");
				inboundConsoleLog.error(`Failed persisting durable WhatsApp inbound after retries; message dropped: ${formattedError}`);
				continue;
			}
			if (result.kind === "durable" && result.queueResult.kind === "completed") {
				finishPreparation(void 0);
				const inbound = await normalizeInboundMessage(msg);
				if (inbound) await maybeMarkNonSelfChatReadReceipt(inbound, buildReadReceiptTarget(inbound));
			} else if (result.kind === "durable" && result.queueResult.kind === "accepted") {
				if (skipRecentOutboundEcho) finishPreparation(null);
				else try {
					finishPreparation(await normalizeInboundMessage(msg), true);
				} catch (error) {
					finishPreparation(void 0);
					inboundLogger.warn({ error: formatError(error) }, "failed preparing WhatsApp inbound identity; durable drain will normalize again");
				}
			} else finishPreparation(void 0);
		}
	};
	const handleMessagesUpsertEvent = (upsert) => {
		const task = handleMessagesUpsert(upsert).catch((err) => {
			inboundLogger.error({ error: String(err) }, "messages.upsert handler error");
			inboundConsoleLog.error(`Messages upsert handler error: ${String(err)}`);
		});
		pendingMessageHandlers.add(task);
		publishPendingWorkState();
		task.finally(() => {
			pendingMessageHandlers.delete(task);
			publishPendingWorkState();
		});
	};
	const drainDebouncedInboundMessages = async () => {
		await messageDebouncer.drain();
	};
	const drainInboundBeforeSocketClose = async () => {
		for (;;) {
			await drainDebouncedInboundMessages();
			if (pendingMessageHandlers.size === 0) break;
			const handlers = Array.from(pendingMessageHandlers);
			await Promise.race([Promise.allSettled(handlers), messageDebouncer.waitForWorkOrIdle(handlers, pendingMessageHandlers.size === 0)]);
			if (pendingMessageHandlers.size === 0 && !messageDebouncer.hasPendingWork()) break;
		}
		await drainDebouncedInboundMessages();
		for (;;) {
			await durableInboundMonitor.waitForIdle();
			if (!messageDebouncer.hasPendingWork()) break;
			await drainDebouncedInboundMessages();
		}
		await durableInboundMonitor.stop();
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
			durableInboundMonitor.stop();
		}
	};
	let detachMessagesUpsert;
	const start = () => {
		if (detachMessagesUpsert) return;
		detachMessagesUpsert = socketSession.listen("messages.upsert", handleMessagesUpsertEvent);
		durableInboundMonitor.start();
	};
	const stopIntake = () => {
		detachMessagesUpsert?.();
		detachMessagesUpsert = void 0;
	};
	return {
		start,
		stopIntake,
		drain: drainInboundBeforeSocketCloseWithTimeout
	};
}
//#endregion
//#region extensions/whatsapp/src/inbound/socket-session.ts
const LOGGED_OUT_STATUS = DisconnectReason.loggedOut;
const RECONNECT_IN_PROGRESS_ERROR = "no active socket - reconnection in progress";
const BAILEYS_MESSAGE_TTL_MS = 6e5;
function isDirectUserJid(jid) {
	return /^(\d+)(?::\d+)?@(s\.whatsapp\.net|c\.us|lid|hosted|hosted\.lid)$/i.test(jid.trim());
}
function getActiveReachoutTimelock(state) {
	if (state?.isActive !== true) return;
	const endsAt = state.timeEnforcementEnds?.getTime();
	return endsAt === void 0 || !Number.isFinite(endsAt) || endsAt > Date.now() ? state : void 0;
}
function formatReachoutTimelockError(state) {
	const details = [state.enforcementType ? `type=${state.enforcementType}` : void 0, state.timeEnforcementEnds instanceof Date && Number.isFinite(state.timeEnforcementEnds.getTime()) ? `until=${state.timeEnforcementEnds.toISOString()}` : void 0].filter(Boolean);
	return `WhatsApp reachout timelock is active; direct messages are temporarily blocked${details.length ? ` (${details.join(", ")})` : ""}`;
}
function isRetryableSendDisconnectError(error) {
	if (isWhatsAppSocketOperationTimeoutError(error)) return false;
	return /closed|reset|timed\s*out|disconnect|no active socket/i.test(formatError(error));
}
function shouldClearSocketRefAfterSendFailure(error) {
	return /closed|reset|disconnect|no active socket/i.test(formatError(error));
}
async function createWhatsAppAttachedSocketSession(options) {
	const { sock } = options;
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
		options.logVerbose(`Sent global '${presence}' presence on connect`);
	} catch (error) {
		options.logVerbose(`Failed to send '${presence}' presence on connect: ${String(error)}`);
	}
	const selfIdentity = await readWebSelfIdentityForDecision(options.authDir, sock.user);
	if (selfIdentity.outcome === "unstable") throw new WhatsAppAuthUnstableError("WhatsApp auth state is still stabilizing; retrying inbox attach.");
	const self = selfIdentity.identity;
	const getCurrentSock = () => {
		if (!options.socketRef) return sock;
		if (options.socketRef.current) return options.socketRef.current;
		if (!self.e164 && !self.jid && !self.lid) return null;
		const successor = getWhatsAppConnectionController(options.accountId);
		if (!successor) return null;
		const successorIdentity = successor.getSelfIdentity();
		if (!successorIdentity || !identitiesOverlap(self, successorIdentity)) return null;
		return successor.getCurrentSock();
	};
	const lidLookup = sock.signalRepository?.lidMapping;
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
		const message = typeof result === "object" && result && "message" in result ? result.message : void 0;
		rememberBaileysMessage(remoteJid, messageId, message);
		cacheInboundMessageMeta(options.accountId, remoteJid, messageId, {
			fromMe: true,
			body: extractText(message ?? void 0)
		});
	};
	const trackLateAcceptedSend = (jid, promise) => {
		promise.then((result) => {
			rememberOutboundMessage(jid, result);
		}, () => {});
	};
	let reachoutTimeLock;
	let reachoutTimeLockFetch;
	let reachoutTimeLockVersion = 0;
	let verifiedSendReady;
	const rememberReachoutTimeLock = (state) => {
		reachoutTimeLock = state;
		reachoutTimeLockVersion += 1;
		verifiedSendReady = void 0;
	};
	const fetchReachoutTimeLock = async (currentSock) => {
		if (typeof currentSock.fetchAccountReachoutTimelock !== "function") return;
		if (!reachoutTimeLockFetch) reachoutTimeLockFetch = currentSock.fetchAccountReachoutTimelock().then((state) => {
			rememberReachoutTimeLock(state);
			return state;
		}).catch((error) => {
			options.logVerbose(`Failed fetching WhatsApp reachout timelock before send: ${formatError(error)}`);
		}).finally(() => {
			reachoutTimeLockFetch = void 0;
		});
		return await reachoutTimeLockFetch;
	};
	const rememberVerifiedSendReady = (jid, currentSock) => {
		verifiedSendReady = {
			jid,
			sock: currentSock,
			reachoutTimeLockVersion
		};
	};
	const consumeVerifiedSendReady = (jid, currentSock) => {
		if (verifiedSendReady?.jid !== jid || verifiedSendReady.sock !== currentSock || verifiedSendReady.reachoutTimeLockVersion !== reachoutTimeLockVersion) return false;
		verifiedSendReady = void 0;
		return true;
	};
	const assertCanSendToJid = async (jid, currentSock, readinessOptions) => {
		if (!isDirectUserJid(jid)) return;
		if (readinessOptions?.useVerifiedReady && consumeVerifiedSendReady(jid, currentSock)) return;
		const state = getActiveReachoutTimelock(reachoutTimeLock) ?? await fetchReachoutTimeLock(currentSock);
		const activeState = getActiveReachoutTimelock(state);
		if (activeState) {
			const error = new Error(formatReachoutTimelockError(activeState));
			throw readinessOptions?.rememberReady ? new PlatformMessageNotDispatchedError(error.message, { cause: error }) : error;
		}
		if (readinessOptions?.rememberReady && state) rememberVerifiedSendReady(jid, currentSock);
	};
	const assertSendReady = async (to) => {
		const currentSock = getCurrentSock();
		if (!currentSock) throw new Error(RECONNECT_IN_PROGRESS_ERROR);
		const jid = options.authDir ? toWhatsappJidWithLid(to, { authDir: options.authDir }) : toWhatsappJid(to);
		await assertCanSendToJid(jid, currentSock, { rememberReady: true });
	};
	const sendTrackedMessage = async (jid, content, sendOptions) => {
		let lastError = /* @__PURE__ */ new Error(RECONNECT_IN_PROGRESS_ERROR);
		for (let attempt = 1;; attempt += 1) {
			const currentSock = getCurrentSock();
			if (currentSock) try {
				await assertCanSendToJid(jid, currentSock, { useVerifiedReady: true });
				const result = await createWhatsAppSocketOperationTimeoutAdapter(currentSock, sendOperationTimeoutMs, { onSendMessageTimeout: ({ jid: timedOutJid, promise }) => {
					trackLateAcceptedSend(timedOutJid, promise);
				} }).sendMessage(jid, content, sendOptions);
				rememberOutboundMessage(jid, result);
				return result;
			} catch (error) {
				if (!shouldRetryDisconnect() || !isRetryableSendDisconnectError(error)) throw error;
				lastError = error;
				if (shouldClearSocketRefAfterSendFailure(error) && options.socketRef?.current === currentSock) options.socketRef.current = null;
			}
			else if (!shouldRetryDisconnect()) throw lastError;
			if (attempt >= sendRetryMaxAttempts) throw lastError;
			const delayMs = computeBackoff(disconnectRetryPolicy, attempt);
			options.logVerbose(`Waiting ${delayMs}ms for WhatsApp reconnect before retrying send to ${jid}: ${formatError(lastError)}`);
			try {
				await sleepWithAbort(delayMs, options.disconnectRetryAbortSignal);
			} catch {
				throw lastError;
			}
		}
	};
	const socketOperations = {
		sendMessage: (jid, content, sendOptions) => sendTrackedMessage(jid, content, sendOptions),
		sendPresenceUpdate: async (presenceLocal, jid) => {
			const currentSock = getCurrentSock();
			if (!currentSock) throw new Error(RECONNECT_IN_PROGRESS_ERROR);
			return await createWhatsAppSocketOperationTimeoutAdapter(currentSock, sendOperationTimeoutMs).sendPresenceUpdate(presenceLocal, jid);
		}
	};
	const markRead = async (target) => {
		const { id, remoteJid, participant } = target;
		await withWhatsAppSocketOperationTimeout("readMessages", (getCurrentSock() ?? sock).readMessages([{
			remoteJid,
			id,
			participant,
			fromMe: false
		}]), sendOperationTimeoutMs);
	};
	const attachSockListener = (event, listener) => attachEmitterListener(sock.ev, event, listener);
	const handleConnectionUpdate = (update) => {
		try {
			if ("reachoutTimeLock" in update) rememberReachoutTimeLock(update.reachoutTimeLock);
			if (update.connection === "close") {
				if (options.socketRef?.current === sock) options.socketRef.current = null;
				const status = getStatusCode(update.lastDisconnect?.error);
				resolveClose({
					status,
					isLoggedOut: status === LOGGED_OUT_STATUS,
					error: update.lastDisconnect?.error
				});
			}
		} catch (error) {
			options.logConnectionError(error);
			resolveClose({
				status: void 0,
				isLoggedOut: false,
				error
			});
		}
	};
	let detachConnectionUpdate;
	const start = () => {
		detachConnectionUpdate ??= attachSockListener("connection.update", handleConnectionUpdate);
	};
	const stop = () => {
		detachConnectionUpdate?.();
		detachConnectionUpdate = void 0;
	};
	const closeSocket = () => {
		try {
			closeInboundMonitorSocket(sock);
		} catch (error) {
			options.logVerbose(`Socket close failed: ${String(error)}`);
		}
	};
	return {
		connectedAtMs,
		self,
		onClose,
		signalClose: (reason) => {
			resolveClose(reason ?? {
				status: void 0,
				isLoggedOut: false,
				error: "closed"
			});
		},
		start,
		stop,
		closeSocket,
		listen: attachSockListener,
		getCurrentSock,
		resolveInboundJid,
		resolveReactionTargetJids,
		rememberBaileysMessage,
		assertCanSendToJid,
		assertSendReady,
		sendTrackedMessage,
		socketOperations,
		markRead
	};
}
//#endregion
//#region extensions/whatsapp/src/inbound/monitor.ts
function logWhatsAppVerbose(enabled, message) {
	if (enabled) defaultRuntime.log(message);
}
async function attachWebInboxToSocket(options) {
	const inboundLogger = getChildLogger({ module: "web-inbound" });
	const inboundConsoleLog = createSubsystemLogger$1("gateway/channels/whatsapp").child("inbound");
	const socketSession = await createWhatsAppAttachedSocketSession({
		sock: options.sock,
		socketRef: options.socketRef,
		accountId: options.accountId,
		authDir: options.authDir,
		selfChatMode: options.selfChatMode,
		socketTiming: options.socketTiming,
		shouldRetryDisconnect: options.shouldRetryDisconnect,
		disconnectRetryPolicy: options.disconnectRetryPolicy,
		disconnectRetryAbortSignal: options.disconnectRetryAbortSignal,
		recentMessageKeys: options.recentMessageKeys,
		logVerbose: (message) => logWhatsAppVerbose(options.verbose, message),
		logConnectionError: (error) => {
			inboundLogger.error({ error: String(error) }, "connection.update handler error");
		}
	});
	const groupMetadata = createWhatsAppGroupMetadataCacheOwner({
		sock: options.sock,
		getCurrentSock: socketSession.getCurrentSock,
		resolveInboundJid: socketSession.resolveInboundJid,
		reconnectCache: options.groupMetadataCache,
		baileysCache: options.baileysGroupMetaCache,
		listen: socketSession.listen,
		logVerbose: (message) => logWhatsAppVerbose(options.verbose, message),
		logHydrationWarning: (error) => {
			inboundLogger.warn({ error }, "failed hydrating participating groups on connect");
			inboundConsoleLog.warn(`Failed hydrating participating groups on connect: ${error}`);
		}
	});
	const delivery = createWhatsAppMessageDeliveryCoordinator({
		cfg: options.cfg,
		loadConfig: options.loadConfig,
		verbose: options.verbose,
		accountId: options.accountId,
		sock: options.sock,
		socketSession,
		groupMetadata,
		onMessage: options.onMessage,
		mediaMaxMb: options.mediaMaxMb,
		sendReadReceipts: options.sendReadReceipts,
		debounceMs: options.debounceMs,
		appendReplyWindow: options.appendReplyWindow,
		shouldDebounce: options.shouldDebounce,
		onPendingWorkChanged: options.onPendingWorkChanged,
		durableInboundQueue: options.durableInboundQueue ?? createWhatsAppDurableInboundQueue(options.accountId)
	});
	const sendApi = createWebSendApi({
		sock: socketSession.socketOperations,
		defaultAccountId: options.accountId,
		resolveOutboundMentions: ({ jid, text }) => groupMetadata.resolveOutboundMentions(jid, text),
		authDir: options.authDir
	});
	delivery.start();
	socketSession.start();
	groupMetadata.start();
	return {
		close: async () => {
			delivery.stopIntake();
			socketSession.stop();
			groupMetadata.close();
			try {
				await delivery.drain();
			} catch (error) {
				logWhatsAppVerbose(options.verbose, `Inbound close drain failed: ${String(error)}`);
			} finally {
				socketSession.closeSocket();
			}
		},
		onClose: socketSession.onClose,
		signalClose: socketSession.signalClose,
		assertSendReady: socketSession.assertSendReady,
		sendComposingTo: sendApi.sendComposingTo,
		sendMessage: sendApi.sendMessage,
		sendPoll: sendApi.sendPoll,
		sendReaction: sendApi.sendReaction
	};
}
async function monitorWebInbox(options) {
	const socketTiming = options.socketTiming ?? resolveWhatsAppSocketTiming();
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
	} catch (error) {
		closeInboundMonitorSocket(sock);
		throw error;
	}
	return attachWebInboxToSocket({
		...options,
		socketTiming,
		sock,
		recentMessageKeys,
		baileysGroupMetaCache
	});
}
//#endregion
//#region extensions/whatsapp/src/auto-reply/loggers.ts
const whatsappLog = createSubsystemLogger$1("gateway/channels/whatsapp");
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
	const hasNativeMentionsOutsideSelfChat = hasMentions && !isSelfChat;
	if (hasNativeMentionsOutsideSelfChat) {
		for (const mention of targets.normalizedMentions) if (identitiesOverlap(targets.self, mention)) return true;
	} else if (hasMentions && isSelfChat) {}
	const bodyClean = clean(msg.payload.body);
	if (mentionCfg.mentionRegexes.some((re) => re.test(bodyClean))) return true;
	if (hasNativeMentionsOutsideSelfChat) return false;
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
const LIFECYCLE_BY_HEALTH_STATE = {
	starting: "starting",
	healthy: "ready",
	stale: "recovering",
	reconnecting: "recovering",
	conflict: "blocked",
	"logged-out": "blocked",
	stopped: "blocked"
};
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
		busy: false,
		lastRunActivityAt: null,
		healthState: "starting",
		lifecycle: "starting"
	};
	const emit = () => {
		statusSink?.(cloneStatus(status));
	};
	return {
		emit,
		snapshot: () => status,
		noteConnected(at = Date.now()) {
			Object.assign(status, channelReadyPatch({
				lastConnectedAt: at,
				lastEventAt: at
			}));
			Object.assign(status, createTransportActivityStatusPatch(at));
			if (lastDisconnectWasWatchdogRecovery) {
				status.lastDisconnect = null;
				status.reconnectAttempts = 0;
				lastDisconnectWasWatchdogRecovery = false;
			}
			status.healthState = "healthy";
			emit();
		},
		noteInbound(at = Date.now()) {
			status.lastInboundAt = at;
			status.lastMessageAt = at;
			status.lastEventAt = at;
			Object.assign(status, createTransportActivityStatusPatch(at));
			if (status.connected) {
				status.healthState = "healthy";
				status.lifecycle = "ready";
			}
			emit();
		},
		noteTransportActivity(at = Date.now()) {
			if (status.lastTransportActivityAt === at) return;
			Object.assign(status, createTransportActivityStatusPatch(at));
			emit();
		},
		noteBusy(busy, at = Date.now()) {
			if (status.busy === busy && status.lastRunActivityAt === at) return;
			status.busy = busy;
			status.lastRunActivityAt = at;
			if (status.connected && busy) {
				status.healthState = "healthy";
				status.lifecycle = "ready";
			}
			emit();
		},
		noteWatchdogStale(at = Date.now()) {
			status.lastEventAt = at;
			if (status.connected) {
				status.healthState = "stale";
				status.lifecycle = "recovering";
			}
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
			status.lifecycle = LIFECYCLE_BY_HEALTH_STATE[params.healthState];
			emit();
		},
		markStopped(at = Date.now()) {
			const terminalDisconnect = status.lifecycle === "blocked";
			if (!isTerminalHealthState(status.healthState)) {
				Object.assign(status, channelStoppedPatch({
					lastEventAt: at,
					terminalDisconnect
				}));
				status.healthState = "stopped";
			} else Object.assign(status, {
				running: false,
				connected: false,
				lastEventAt: at,
				terminalDisconnect
			});
			emit();
		}
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
//#region extensions/whatsapp/src/dev-mode/echo-guard.ts
const SELF_CHAT_REASONING_ECHO_RE = /^(?:\[[^\]\n]*\]\s*)?(?:💭\s*)?Reasoning:/u;
/** True when a dev-mode self-chat inbound is our own reasoning message bouncing back. */
function isDevModeSelfChatReasoningEcho(msg, conversationId) {
	if (process.env.OPENCLAW_DEV_MODE !== "1" || conversationId !== msg.platform.recipientJid) return false;
	if (!SELF_CHAT_REASONING_ECHO_RE.test(msg.payload.body.trimStart())) return false;
	whatsappInboundLog.info(`Dropped self-chat reasoning echo (dev-mode safety net) for ${conversationId}`);
	return true;
}
//#endregion
//#region extensions/whatsapp/src/auto-reply/monitor/ack-emoji.ts
const DEFAULT_WHATSAPP_ACK_REACTION = "👀";
function resolveWhatsAppAckEmoji(params) {
	if (!params.ackConfig) return "";
	return (typeof params.ackConfig === "string" ? params.ackConfig : params.ackConfig.emoji)?.trim() || resolveAgentIdentityEmoji(params.cfg, params.agentId) || DEFAULT_WHATSAPP_ACK_REACTION;
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
/** Resolves group activation for a WhatsApp conversation and backfills scoped session metadata. */
async function resolveGroupActivationFor(params) {
	const sessionScope = {
		storePath: resolveStorePath(params.cfg.session?.store, { agentId: params.agentId }),
		agentId: params.agentId
	};
	const legacySessionKey = resolveWhatsAppLegacyGroupSessionKey({
		sessionKey: params.sessionKey,
		accountId: params.accountId
	});
	const legacyEntry = legacySessionKey ? getSessionEntry({
		...sessionScope,
		sessionKey: legacySessionKey
	}) : void 0;
	const scopedEntry = getSessionEntry({
		...sessionScope,
		sessionKey: params.sessionKey
	});
	const activation = (normalizeAccountId(params.accountId) === DEFAULT_ACCOUNT_ID && hasNamedWhatsAppAccounts(params.cfg) && isActivationOnlyEntry(scopedEntry) ? void 0 : scopedEntry?.groupActivation) ?? legacyEntry?.groupActivation;
	if (activation !== void 0 && scopedEntry?.groupActivation === void 0) {
		if (scopedEntry) await patchSessionEntry({
			...sessionScope,
			sessionKey: params.sessionKey,
			replaceEntry: true,
			update: (entry) => {
				if (entry.groupActivation !== void 0) return null;
				return {
					...entry,
					groupActivation: activation
				};
			}
		});
	}
	const defaultActivation = !resolveWhatsAppInboundPolicy({
		cfg: params.cfg,
		accountId: params.accountId
	}).resolveConversationRequireMention(params.conversationId) ? "always" : "mention";
	return normalizeGroupActivation(activation) ?? defaultActivation;
}
//#endregion
//#region extensions/whatsapp/src/auto-reply/monitor/reaction-participant.ts
function resolveReactionParticipant(msg) {
	const sender = getSenderIdentity(msg);
	return sender.jid ?? sender.lid ?? void 0;
}
//#endregion
//#region extensions/whatsapp/src/auto-reply/monitor/reaction-eligibility.ts
const DISABLED_REACTION = { status: "disabled" };
async function resolveWhatsAppReactionEligibility(params) {
	const messageId = params.msg.event.id;
	if (!messageId) return DISABLED_REACTION;
	const admission = requireWhatsAppInboundAdmission(params.msg);
	const accountId = admission.accountId;
	if (resolveWhatsAppReactionLevel({
		cfg: params.cfg,
		accountId
	}).level === "off") return DISABLED_REACTION;
	const scope = params.cfg.messages?.ackReactionScope ?? "group-mentions";
	if (scope === "off" || scope === "none") return DISABLED_REACTION;
	const emoji = resolveWhatsAppAckEmoji({
		cfg: params.cfg,
		agentId: params.agentId,
		ackConfig: params.cfg.messages?.ackReaction
	});
	const isGroup = admission.conversation.kind === "group";
	const activation = isGroup ? await resolveGroupActivationFor({
		cfg: params.cfg,
		accountId,
		agentId: params.agentId,
		sessionKey: params.sessionKey,
		conversationId: admission.conversation.id
	}) : null;
	if (!emoji || !shouldAckReaction({
		scope,
		isDirect: admission.conversation.kind === "direct",
		isGroup,
		isMentionableGroup: isGroup,
		canDetectMention: isGroup,
		effectiveWasMentioned: (params.msg.groupMention?.wasMentioned ?? params.msg.wasMentioned) === true,
		shouldBypassMention: activation === "always"
	})) return DISABLED_REACTION;
	const participant = resolveReactionParticipant(params.msg);
	return {
		status: "prepared",
		chatId: params.msg.platform.chatJid,
		messageId,
		emoji,
		reactionOptions: {
			verbose: params.verbose,
			fromMe: params.msg.platform.fromMe === true,
			...participant ? { participant } : {},
			accountId,
			cfg: params.cfg
		}
	};
}
//#endregion
//#region extensions/whatsapp/src/auto-reply/monitor/ack-reaction.ts
async function maybeSendAckReaction(params) {
	const eligibility = await resolveWhatsAppReactionEligibility({
		cfg: params.cfg,
		msg: params.msg,
		agentId: params.agentId,
		sessionKey: params.sessionKey,
		verbose: params.verbose
	});
	if (eligibility.status === "disabled") return null;
	const { chatId, messageId, emoji, reactionOptions } = eligibility;
	params.info({
		chatId,
		messageId,
		emoji
	}, "sending ack reaction");
	return createAckReactionHandle({
		ackReactionValue: emoji,
		send: () => sendReactionWhatsApp(chatId, messageId, emoji, reactionOptions),
		remove: () => sendReactionWhatsApp(chatId, messageId, "", reactionOptions),
		onSendError: (err) => {
			params.warn({
				error: formatError(err),
				chatId,
				messageId
			}, "failed to send ack reaction");
			logVerbose(`WhatsApp ack reaction failed for chat ${chatId}: ${formatError(err)}`);
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
	const group = resolveGroupThreadConfig({
		cfg: params.cfg,
		channel: "whatsapp",
		peerId: params.peerId
	});
	if (!group) return false;
	whatsappInboundLog.info(`Broadcasting message to ${group.agents.length} agents (${group.strategy})`);
	const isGroupConversation = requireWhatsAppInboundAdmission(params.msg).conversation.kind === "group";
	const groupHistorySnapshot = isGroupConversation ? [...params.groupHistories.get(params.groupHistoryKey) ?? []] : void 0;
	await runGroupThread({
		cfg: params.cfg,
		group,
		channel: "whatsapp",
		accountId: params.route.accountId,
		peerId: params.peerId,
		messageId: params.msg.event.id,
		text: [params.msg.payload.body, params.preflightAudioTranscript].filter(Boolean).join("\n"),
		onError: (err, turn) => {
			whatsappInboundLog.error(`Broadcast agent ${turn.agentId} failed: ${formatError(err)}`);
		},
		runTurn: async (turn) => {
			const routeKeys = buildBroadcastRouteKeys({
				cfg: params.cfg,
				msg: params.msg,
				route: params.route,
				peerId: params.peerId,
				agentId: turn.agentId
			});
			const baseAgentRoute = {
				...params.route,
				agentId: turn.agentId,
				...routeKeys
			};
			const agentRoute = isGroupConversation ? resolveWhatsAppGroupSessionRoute(baseAgentRoute) : baseAgentRoute;
			return params.processMessage(params.msg, agentRoute, params.groupHistoryKey, {
				groupHistory: turn.round === 1 ? groupHistorySnapshot : [],
				suppressGroupHistoryClear: true,
				...params.preflightAudioTranscript !== void 0 ? { preflightAudioTranscript: params.preflightAudioTranscript } : {},
				...params.ackAlreadySent === true || turn.round > 1 ? { ackAlreadySent: true } : {},
				...params.ackReaction !== void 0 && turn.round === 1 ? { ackReaction: params.ackReaction } : {}
			});
		}
	});
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
const groupDropWarned = createDedupeCache({
	ttlMs: 0,
	maxSize: 100
});
function shouldWarnForGroupDrop(warnKey) {
	return !groupDropWarned.check(warnKey);
}
function isOwnerSender(baseMentionConfig, msg, authDir) {
	const sender = normalizeE164(getSenderIdentity(msg, authDir).e164 ?? "");
	if (!sender) return false;
	return resolveOwnerList(baseMentionConfig, getSelfIdentity(msg, authDir).e164 ?? void 0).includes(sender);
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
			senderJid: senderIdentity.jid ?? params.msg.platform.senderJid,
			...params.msg.payload.media ? { media: [{
				path: params.msg.payload.media.path,
				url: params.msg.payload.media.url ?? params.msg.payload.media.path,
				contentType: params.msg.payload.media.type,
				kind: params.msg.payload.media.kind ?? void 0
			}] } : {}
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
		if (shouldWarnForGroupDrop(JSON.stringify([
			accountId,
			conversationId,
			"group registry"
		]))) {
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
	} : {
		...params.msg,
		payload: {
			...params.msg.payload,
			body: params.msg.payload.commandBody ?? params.msg.payload.body
		}
	};
	const commandBody = stripMentionsForCommand(mentionMsg.payload.body, mentionConfig.mentionRegexes, self.e164);
	const activationCommand = parseActivationCommand(commandBody);
	const owner = isOwnerSender(baseMentionConfig, params.msg, params.authDir);
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
	const implicitReplyToSelf = params.selfChatMode === true && identitiesOverlap(self, sender);
	const implicitMentionKinds = implicitMentionKindWhen("quoted_bot", !implicitReplyToSelf && identitiesOverlap(self, replyContext?.sender));
	const mentionDecision = resolveInboundMentionDecision({
		facts: {
			canDetectMention: true,
			wasMentioned,
			implicitMentionKinds
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
	params.msg.groupMention = {
		wasMentioned: effectiveWasMentioned,
		requireMention
	};
	if (!shouldBypassMention && requireMention && mentionDecision.shouldSkip) {
		if (params.deferMissingMention === true) {
			params.logVerbose(`Deferring group mention skip until audio preflight completes in ${conversationId}`);
			return {
				shouldProcess: false,
				needsMentionText: true
			};
		}
		const accountId = inboundPolicy.account.accountId;
		if (shouldWarnForGroupDrop(JSON.stringify([
			accountId,
			conversationId,
			"no mention"
		]))) {
			const groupsPath = resolveWhatsAppGroupsConfigPath({
				cfg: params.cfg,
				accountId
			});
			params.replyLogger.warn({
				conversationId,
				accountId,
				groupsPath
			}, `WhatsApp group ${conversationId}: skipping messages without a mention. Mention patterns can be derived from the agent identity name. Use /activation always for this session, or set ${groupsPath}[${JSON.stringify(conversationId)}].requireMention=false for the default. Preserve existing groups entries; when adding the first groups map, include "*": {} to keep other chats admitted.`);
		}
		const pendingHistoryBody = params.mentionText === void 0 ? void 0 : formatAudioTranscriptForAgent(params.mentionText);
		return skipGroupMessageAndStoreHistory(params, `Group message stored for context (no mention detected) in ${conversationId}: ${mentionMsg.payload.body}`, pendingHistoryBody);
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
	const storePath = resolveStorePath$1(params.cfg.session?.store, { agentId: params.storeAgentId });
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
function resolveWhatsAppSystemPrompt(prompts, targetId) {
	if (!targetId) return;
	return (prompts?.[targetId]?.systemPrompt ?? prompts?.["*"]?.systemPrompt)?.trim() || void 0;
}
function resolveWhatsAppGroupSystemPrompt(params) {
	return resolveWhatsAppSystemPrompt(params.accountConfig?.groups, params.groupId);
}
function resolveWhatsAppDirectSystemPrompt(params) {
	return resolveWhatsAppSystemPrompt(params.accountConfig?.direct, params.peerId);
}
//#endregion
//#region extensions/whatsapp/src/dev-mode/reasoning.ts
const REASONING_PREAMBLE_RE = /^(?:>[ \t]?)*(?:reasoning:|thinking\.{0,3})[ \t]*(?:\r?\n|$)/iu;
function italicizeLines(body) {
	return body.split("\n").map((line) => {
		const trimmed = line.trim();
		if (!trimmed || trimmed.startsWith("_") && trimmed.endsWith("_")) return trimmed;
		return `_${trimmed}_`;
	}).join("\n");
}
/** Returns the payload rewritten as a visible 💭 message, or undefined when it is not reasoning. */
function formatDevModeReasoningPayload(payload, responsePrefix) {
	if (process.env.OPENCLAW_DEV_MODE !== "1" || typeof payload.text !== "string") return;
	let text = payload.text.trim();
	if (responsePrefix && text.startsWith(responsePrefix)) text = text.slice(responsePrefix.length).trimStart();
	const preamble = REASONING_PREAMBLE_RE.exec(text);
	if (payload.isReasoning !== true && !preamble) return;
	const body = (preamble ? text.slice(preamble[0].length) : text).trim();
	if (!body) return;
	return {
		...payload,
		isReasoning: void 0,
		text: `💭 Reasoning:\n${italicizeLines(body)}`
	};
}
//#endregion
//#region extensions/whatsapp/src/outbound-retry.ts
const WHATSAPP_OUTBOUND_MAX_ATTEMPTS = 3;
const WHATSAPP_OUTBOUND_MIN_DELAY_MS = 500;
const WHATSAPP_OUTBOUND_MAX_DELAY_MS = 1e3;
const WHATSAPP_RETRYABLE_OUTBOUND_ERROR_PATTERN = /closed|reset|timed\s*out|disconnect/i;
var WhatsAppOutboundRetryError = class extends Error {
	constructor(original) {
		super(formatError(original), { cause: original });
		this.original = original;
	}
};
function isRetryableWhatsAppOutboundError(error) {
	if (isChannelPartialDeliveryError(error) || isWhatsAppSocketOperationTimeoutError(error)) return false;
	return WHATSAPP_RETRYABLE_OUTBOUND_ERROR_PATTERN.test(formatError(error));
}
async function sendWhatsAppOutboundWithRetry(params) {
	const runWithRetry = createChannelApiRetryRunner({
		retry: {
			attempts: WHATSAPP_OUTBOUND_MAX_ATTEMPTS,
			minDelayMs: WHATSAPP_OUTBOUND_MIN_DELAY_MS,
			maxDelayMs: WHATSAPP_OUTBOUND_MAX_DELAY_MS,
			jitter: 0
		},
		strictShouldRetry: true,
		retryAfterMs: () => void 0,
		shouldRetry: (error, attempt) => {
			if (!(error instanceof WhatsAppOutboundRetryError) || !isRetryableWhatsAppOutboundError(error.original)) return false;
			params.onRetry?.({
				attempt,
				maxAttempts: WHATSAPP_OUTBOUND_MAX_ATTEMPTS,
				backoffMs: Math.min(WHATSAPP_OUTBOUND_MIN_DELAY_MS * 2 ** (attempt - 1), WHATSAPP_OUTBOUND_MAX_DELAY_MS),
				error: error.original,
				errorText: formatError(error.original)
			});
			return true;
		}
	});
	try {
		return await runWithRetry(async () => {
			try {
				return await params.send();
			} catch (error) {
				throw new WhatsAppOutboundRetryError(error);
			}
		});
	} catch (error) {
		if (error instanceof WhatsAppOutboundRetryError) throw error.original;
		throw error;
	}
}
//#endregion
//#region extensions/whatsapp/src/auto-reply/util.ts
function elide(text, limit = 400) {
	if (!text) return text;
	if (text.length <= limit) return text;
	const truncated = truncateUtf16Safe(text, limit);
	return `${truncated}… (truncated ${text.length - truncated.length} chars)`;
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
	const raw = reason instanceof Error ? `${reason.message}\n${reason.stack ?? ""}` : formatReason(reason);
	const haystack = normalizeLowercaseStringOrEmpty(raw);
	if (!(haystack.includes("unsupported state or unable to authenticate data") || haystack.includes("bad mac"))) return false;
	return haystack.includes("baileys") || haystack.includes("noise-handler") || haystack.includes("aesdecryptgcm");
}
//#endregion
//#region extensions/whatsapp/src/auto-reply/deliver-reply.ts
function createWhatsAppReplyTransportContext(msg) {
	const admission = requireWhatsAppInboundAdmission(msg);
	return {
		accountId: admission.accountId,
		conversationId: admission.conversation.id,
		conversationKind: admission.conversation.kind,
		chatJid: msg.platform.chatJid,
		senderJid: msg.platform.senderJid,
		recipientJid: msg.platform.recipientJid,
		correlationId: msg.event.id,
		reply: msg.platform.reply,
		sendMedia: msg.platform.sendMedia
	};
}
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
	return await withWhatsAppLogicalDeliveryActivity(() => deliverWebReplyInActivityScope(params));
}
async function deliverWebReplyInActivityScope(params) {
	const { transport, maxMediaBytes, textLimit, replyLogger, connectionId, skipLog } = params;
	const replyResult = formatDevModeReasoningPayload(params.replyResult) ?? params.replyResult;
	const conversationId = transport.conversationId;
	const isGroupConversation = transport.conversationKind === "group";
	const replyStarted = Date.now();
	const sendResults = [];
	const acceptedMediaUrls = /* @__PURE__ */ new Set();
	const recordMediaAccepted = (mediaUrl) => {
		acceptedMediaUrls.add(mediaUrl);
		params.onMediaAccepted?.(mediaUrl);
	};
	const finishDelivery = () => {
		const receipt = createWhatsAppReplyDeliveryReceipt(sendResults);
		return {
			results: sendResults,
			receipt,
			providerAccepted: sendResults.some((result) => result.providerAccepted)
		};
	};
	const preserveAcceptedDeliveryError = (error, kind, mediaUrl) => {
		const sendKind = kind ?? sendResults[0]?.kind ?? "text";
		if (isChannelPartialDeliveryError(error)) {
			if (rememberWhatsAppPartialSend({
				error,
				kind: sendKind,
				results: sendResults
			}) && mediaUrl) recordMediaAccepted(mediaUrl);
		}
		return mergeWhatsAppAcceptedSendError({
			error,
			kind: sendKind,
			results: sendResults
		});
	};
	const rememberSendResult = (result, mediaUrl) => {
		if (!result) return;
		try {
			rememberWhatsAppAcceptedSend({
				accountId: transport.accountId,
				result,
				results: sendResults
			});
		} catch (error) {
			if (sendResults.some((accepted) => accepted.providerAccepted)) throw preserveAcceptedDeliveryError(error, result.kind);
			throw error;
		} finally {
			if (mediaUrl && sendResults.includes(result)) recordMediaAccepted(mediaUrl);
		}
	};
	if (isReasoningReplyPayload(replyResult)) {
		whatsappOutboundLog.debug(`Suppressed reasoning payload to ${conversationId}`);
		return finishDelivery();
	}
	const tableMode = params.tableMode ?? "code";
	const chunkMode = params.chunkMode ?? "length";
	const normalizedReply = params.normalizedReplyResult ?? normalizeWhatsAppOutboundPayload(replyResult, { normalizeText: normalizeWhatsAppPayloadTextPreservingIndentation });
	const text = normalizedReply.text ?? "";
	const textChunks = resolveTextChunksWithFallback(text, markdownToWhatsAppChunks(text, textLimit, tableMode, chunkMode));
	const mediaList = normalizedReply.mediaUrls ?? [];
	const getQuote = () => {
		if (!replyResult.replyToId) return;
		const cached = lookupInboundMessageMeta(transport.accountId, transport.chatJid, replyResult.replyToId);
		return buildQuotedMessageOptions({
			messageId: replyResult.replyToId,
			remoteJid: transport.chatJid,
			fromMe: cached?.fromMe ?? false,
			participant: cached?.participant ?? (isGroupConversation ? transport.senderJid : void 0),
			messageText: cached?.body ?? "",
			media: cached?.media
		});
	};
	const sendWithRetry = async (fn, label, kind, mediaUrl) => {
		try {
			return await sendWhatsAppOutboundWithRetry({
				send: fn,
				onRetry: ({ attempt, maxAttempts: retryMaxAttempts, backoffMs, errorText }) => {
					logVerbose(`Retrying ${label} to ${conversationId} after failure (${attempt}/${retryMaxAttempts - 1}) in ${backoffMs}ms: ${errorText}`);
				}
			});
		} catch (error) {
			if (isChannelPartialDeliveryError(error) || sendResults.some((result) => result.providerAccepted)) throw preserveAcceptedDeliveryError(error, kind, mediaUrl);
			throw error;
		}
	};
	if (mediaList.length === 0 && textChunks.length) {
		const totalChunks = textChunks.length;
		for (const [index, chunk] of textChunks.entries()) {
			const chunkStarted = Date.now();
			const quote = getQuote();
			rememberSendResult(await sendWithRetry(() => transport.reply(chunk, quote), "text", "text"));
			if (!skipLog) {
				const durationMs = Date.now() - chunkStarted;
				whatsappOutboundLog.debug(`Sent chunk ${index + 1}/${totalChunks} to ${conversationId} (${durationMs.toFixed(0)}ms)`);
			}
		}
		const delivery = finishDelivery();
		const logPayload = {
			correlationId: transport.correlationId ?? newConnectionId(),
			connectionId: connectionId ?? null,
			to: conversationId,
			from: transport.recipientJid,
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
	const leadingCaption = remainingText.shift() || "";
	await sendMediaWithLeadingCaption({
		mediaUrls: mediaList,
		caption: leadingCaption,
		send: async ({ mediaUrl, caption }) => {
			const media = await prepareWhatsAppOutboundMedia(await loadWebMedia(mediaUrl, {
				maxBytes: maxMediaBytes,
				localRoots: params.mediaLocalRoots
			}), mediaUrl);
			if (shouldLogVerbose()) {
				logVerbose(`Web auto-reply media size: ${(media.buffer.length / 1048576).toFixed(2)}MB`);
				logVerbose(`Web auto-reply media source: ${mediaUrl} (kind ${media.kind})`);
			}
			const quote = getQuote();
			const mediaContent = media.kind === "image" ? {
				image: media.buffer,
				caption
			} : media.kind === "audio" ? {
				audio: media.buffer,
				ptt: true
			} : media.kind === "video" ? {
				video: media.buffer,
				caption
			} : {
				document: media.buffer,
				fileName: media.fileName,
				caption
			};
			rememberSendResult(await sendWithRetry(() => transport.sendMedia({
				...mediaContent,
				mimetype: media.mimetype
			}, quote), `media:${media.kind}`, "media", mediaUrl), mediaUrl);
			if (media.kind === "audio" && caption) rememberSendResult(await sendWithRetry(() => transport.reply(caption, quote), "media:audio-text", "text"));
			whatsappOutboundLog.info(`Sent media reply to ${conversationId} (${(media.buffer.length / 1048576).toFixed(2)}MB)`);
			replyLogger.info({
				correlationId: transport.correlationId ?? newConnectionId(),
				connectionId: connectionId ?? null,
				to: conversationId,
				from: transport.recipientJid,
				text: caption ?? null,
				mediaUrl,
				mediaSizeBytes: media.buffer.length,
				mediaKind: media.kind,
				durationMs: Date.now() - replyStarted
			}, "auto-reply sent (media)");
		},
		onError: async ({ error, mediaUrl, caption, isFirst }) => {
			if (acceptedMediaUrls.has(mediaUrl)) throw preserveAcceptedDeliveryError(error);
			whatsappOutboundLog.error(`Failed sending web media to ${conversationId}: ${formatError(error)}`);
			replyLogger.warn({
				err: error,
				mediaUrl
			}, "failed to send web media reply");
			if (!isFirst) {
				whatsappOutboundLog.warn(`Trailing media failed; sent warning to ${conversationId}`);
				rememberSendResult(await sendWithRetry(() => transport.reply("⚠️ Media unavailable.", getQuote()), "media:fallback-unavailable", "text"));
				return;
			}
			const fallbackText = [caption ?? "", "⚠️ Media failed."].filter(Boolean).join("\n");
			if (!fallbackText) return;
			whatsappOutboundLog.warn(`Media skipped; sent text-only to ${conversationId}`);
			rememberSendResult(await sendWithRetry(() => transport.reply(fallbackText, getQuote()), "media:fallback-text", "text"));
		}
	});
	for (const chunk of remainingText) rememberSendResult(await sendWithRetry(() => transport.reply(chunk, getQuote()), "media:text", "text"));
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
	return filterSupplementalContextItems({
		items: params.history,
		mode: params.mode,
		kind: "history",
		isSenderAllowed: (entry) => resolveInboundSupplementalSenderAllowed({
			isGroup: true,
			groupPolicy: params.groupPolicy,
			allowFrom: params.groupAllowFrom,
			isSenderAllowed: (allowFrom) => isWhatsAppSupplementalSenderAllowed({
				allowFrom,
				authDir: params.authDir,
				sender: entry.senderJid ? { jid: entry.senderJid } : null
			})
		})
	}).items;
}
function resolveVisibleWhatsAppReplyContext(params) {
	const replyTo = getReplyContext(params.msg, params.authDir);
	if (!replyTo) return null;
	const admission = requireWhatsAppInboundAdmission(params.msg);
	const previewBody = [replyTo.body, formatMediaPlaceholderText(replyTo.media ? [replyTo.media] : [])].filter(Boolean).join("\n");
	const senderAllowed = resolveInboundSupplementalSenderAllowed({
		isGroup: admission.conversation.kind === "group",
		groupPolicy: params.groupPolicy,
		allowFrom: params.groupAllowFrom,
		isSenderAllowed: (allowFrom) => isWhatsAppSupplementalSenderAllowed({
			allowFrom,
			authDir: params.authDir,
			sender: replyTo.sender
		})
	});
	const visible = filterChannelInboundQuoteContext(params.mode, {
		id: replyTo.id,
		body: previewBody,
		sender: replyTo.sender?.label ?? void 0,
		senderAllowed
	});
	return visible ? {
		...replyTo,
		body: visible.body ?? ""
	} : null;
}
//#endregion
//#region extensions/whatsapp/src/auto-reply/monitor/prepared-inbound.ts
function resolvePreparedCommandFacts(command) {
	if (!command) return;
	const { authorization, ...facts } = command;
	return {
		...facts,
		...authorization.kind === "not_checked" ? {} : { authorized: authorization.kind === "authorized" }
	};
}
function projectPreparedChannelInbound(params) {
	const { inbound, control } = params;
	const command = resolvePreparedCommandFacts(inbound.command);
	const commandAuthorization = inbound.command?.authorization;
	const commandAccess = commandAuthorization && commandAuthorization.kind !== "not_checked" ? { authorized: commandAuthorization.kind === "authorized" } : void 0;
	return {
		input: {
			id: inbound.event.id,
			timestamp: inbound.event.timestamp,
			rawText: inbound.message.rawBody,
			textForAgent: inbound.message.bodyForAgent,
			textForCommands: inbound.message.commandBody,
			raw: inbound
		},
		context: params.buildContext({
			...inbound,
			messageId: inbound.event.id,
			messageIdFull: inbound.event.fullId,
			timestamp: inbound.event.timestamp,
			command,
			access: inbound.mentions || commandAccess ? {
				mentions: inbound.mentions,
				commands: commandAccess
			} : void 0,
			extra: {
				Transcript: inbound.context?.transcript,
				...inbound.context && "groupSubject" in inbound.context ? { GroupSubject: inbound.context.groupSubject ?? void 0 } : {},
				GroupMembers: inbound.context?.groupMembers,
				SenderE164: inbound.context?.senderE164,
				ReplyThreading: inbound.context?.replyThreading,
				SuppressMessageReceivedHooks: control.messageReceivedHooks === "channel",
				...inbound.context?.location ? toLocationContext(inbound.context.location) : {}
			}
		})
	};
}
/** Keeps WhatsApp reply-policy mapping beside the transport that applies it. */
function resolveWhatsAppInboundReplyPolicy(params) {
	const sourceReplyDeliveryMode = params.ctx.ChatType === "group" || params.ctx.ChatType === "channel" ? resolveChannelMessageSourceReplyDeliveryMode({
		cfg: params.cfg,
		ctx: params.ctx
	}) : void 0;
	const sourceRepliesAreToolOnly = sourceReplyDeliveryMode === "message_tool_only";
	return {
		sourceReplyDeliveryMode,
		disableBlockStreaming: sourceRepliesAreToolOnly ? true : typeof params.blockStreamingEnabled === "boolean" ? !params.blockStreamingEnabled : void 0,
		suppressTyping: sourceRepliesAreToolOnly && params.ctx.ChatType === "group" && params.ctx.WasMentioned !== true
	};
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
function createWhatsAppChannelDeliveryResult(params) {
	const messageIds = listMessageReceiptPlatformIds(params.delivery.receipt);
	return {
		receipt: params.delivery.receipt,
		...messageIds.length > 0 ? { messageIds } : {},
		content: params.content,
		visibleReplySent: params.delivery.providerAccepted
	};
}
function isWhatsAppVisibleDeliveryError(error) {
	return typeof error === "object" && error !== null && !Array.isArray(error) && error.visibleReplySent === true || isChannelPartialDeliveryError(error) && error.deliveryResult.visibleReplySent;
}
function readTrimmedString(value) {
	return normalizeOptionalString(value) ?? "";
}
function markWhatsAppReplyDeliveryErrorVisibleAfterFlush(error, flushResult) {
	if (flushResult.delivered === 0) return error;
	if (isWhatsAppVisibleDeliveryError(error)) return error;
	return markWhatsAppVisibleDeliveryError(new Error("deferred WhatsApp media delivery failed after an earlier visible send", { cause: error }));
}
function logWhatsAppReplyDeliveryError(params) {
	params.replyLogger.error({
		err: normalizeErrForLog(params.err),
		replyKind: params.info.kind,
		correlationId: params.transport.correlationId ?? null,
		connectionId: params.connectionId,
		conversationId: params.transport.conversationId,
		chatId: params.transport.chatJid,
		to: params.transport.conversationId,
		from: params.transport.recipientJid
	}, "auto-reply delivery failed");
}
function resolveWhatsAppDurableReplyToId(params) {
	if (params.payload.replyToId === null) return null;
	const explicitPayloadReplyToId = readTrimmedString(params.payload.replyToId);
	if (explicitPayloadReplyToId) return explicitPayloadReplyToId;
	const hasVisibleInboundReplyTarget = Boolean(readTrimmedString(params.context.ReplyToId)) || Boolean(readTrimmedString(params.context.ReplyToIdFull));
	const currentInboundMessageId = readTrimmedString(params.currentMessageId);
	if (params.info.kind === "final" && hasVisibleInboundReplyTarget && currentInboundMessageId) return currentInboundMessageId;
	return null;
}
function resolveWhatsAppDeliverablePayload(payload, info) {
	if (payload.isReasoning === true || payload.isCompactionNotice === true) return null;
	if (payload.isError === true && info.kind !== "final") return null;
	if (info.kind === "tool") {
		if (!resolveSendableOutboundReplyParts(payload).hasMedia) return null;
		return {
			...payload,
			text: void 0
		};
	}
	return payload;
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
	const flushWhere = async (shouldFlush) => {
		const flushResult = {
			delivered: 0,
			droppedDuplicateMedia: 0
		};
		const candidates = [];
		const retained = [];
		for (const pending of pendingMediaOnlyPayloads.splice(0)) if (shouldFlush(pending)) candidates.push(pending);
		else retained.push(pending);
		pendingMediaOnlyPayloads.push(...retained);
		for (const [index, candidate] of candidates.entries()) try {
			const delivery = await params.deliver(candidate);
			candidate.resolveFinalization(delivery);
			if (delivery.visibleReplySent) flushResult.delivered += 1;
		} catch (error) {
			const visibleError = markWhatsAppReplyDeliveryErrorVisibleAfterFlush(error, flushResult);
			candidate.rejectFinalization(error);
			for (const remaining of candidates.slice(index + 1)) remaining.rejectFinalization(new Error("deferred WhatsApp media delivery was not attempted", { cause: error }));
			throw visibleError;
		}
		return flushResult;
	};
	return {
		defer(pending) {
			let resolveFinalization;
			let rejectFinalization;
			const finalization = new Promise((resolve, reject) => {
				resolveFinalization = resolve;
				rejectFinalization = reject;
			});
			pendingMediaOnlyPayloads.push({
				...pending,
				resolveFinalization,
				rejectFinalization
			});
			return finalization;
		},
		flushNonDuplicateMedia: (mediaUrls) => flushWhere((pending) => !hasWhatsAppMediaUrlOverlap(pending.mediaUrls, mediaUrls)),
		supersedeMedia(mediaUrl) {
			const flushResult = {
				delivered: 0,
				droppedDuplicateMedia: 0
			};
			const retained = [];
			for (const pending of pendingMediaOnlyPayloads.splice(0)) {
				if (pending.mediaUrls.delete(mediaUrl)) {
					flushResult.droppedDuplicateMedia += 1;
					const mediaUrls = [...pending.mediaUrls];
					pending.payload = {
						...pending.payload,
						mediaUrl: mediaUrls[0],
						mediaUrls
					};
				}
				if (pending.mediaUrls.size === 0) {
					pending.resolveFinalization(whatsAppReplyDeliveryVisibility(false));
					continue;
				}
				retained.push(pending);
			}
			pendingMediaOnlyPayloads.push(...retained);
			return flushResult;
		},
		flushAll: () => flushWhere(() => true)
	};
}
function logWhatsAppMediaOnlyFlushResult(result) {
	if (!shouldLogVerbose$1()) return;
	if (result.droppedDuplicateMedia > 0) logVerbose$1(`Superseded ${result.droppedDuplicateMedia} deferred WhatsApp attachment(s) with accepted replacement media`);
	if (result.delivered > 0) logVerbose$1(`Flushed ${result.delivered} deferred media-only WhatsApp reply payload(s)`);
}
function resolveWhatsAppResponsePrefix(params) {
	const configuredResponsePrefix = params.cfg.messages?.responsePrefix;
	return params.pipelineResponsePrefix ?? (configuredResponsePrefix === "auto" ? resolveIdentityNamePrefix(params.cfg, params.agentId) : configuredResponsePrefix) ?? (params.isSelfChat ? resolveIdentityNamePrefix(params.cfg, params.agentId) : void 0);
}
function buildWhatsAppInboundTransportContext(msg) {
	return {
		...createWhatsAppReplyTransportContext(msg),
		sendComposing: msg.platform.sendComposing
	};
}
async function prepareWhatsAppInboundContext(params) {
	const admission = requireWhatsAppInboundAdmission(params.msg);
	const conversationId = admission.conversation.id;
	const conversationKind = admission.conversation.kind;
	const eventId = params.msg.event.id ?? `${conversationId}:${newConnectionId()}`;
	const channelIngress = await resolveWhatsAppAdmissionChannelIngress(admission, {
		agentId: params.route.agentId,
		sessionKey: params.route.sessionKey,
		messageId: eventId,
		inboundEventKind: "user_request"
	}) ?? admission.channelIngress;
	const wasMentioned = params.msg.groupMention?.wasMentioned ?? params.msg.wasMentioned;
	const inboundHistory = conversationKind === "group" ? buildInboundHistoryFromEntries({
		entries: (params.groupHistory ?? []).map((entry) => ({
			sender: entry.sender,
			body: entry.body,
			timestamp: entry.timestamp,
			messageId: entry.id,
			media: entry.media
		})),
		limit: params.groupHistory?.length ?? 1
	}) : void 0;
	const media = await toInboundMediaFactsWithMetadata(params.msg.payload.media ? [{
		path: params.msg.payload.media?.path,
		url: params.msg.payload.media?.url ?? params.msg.payload.media?.path,
		contentType: params.msg.payload.media?.type,
		kind: params.msg.payload.media?.kind
	}] : void 0, { transcribed: (_entry, index) => params.mediaTranscribedIndexes?.includes(index) === true });
	const control = { messageReceivedHooks: params.suppressMessageReceivedHooks ? "channel" : "core" };
	const inbound = {
		channelIngress,
		channel: "whatsapp",
		supplemental: {
			quote: params.visibleReplyTo ? {
				id: params.visibleReplyTo.id,
				body: params.visibleReplyTo.body,
				sender: params.visibleReplyTo.sender?.label ?? void 0
			} : void 0,
			groupSystemPrompt: params.groupSystemPrompt,
			channelStructuredContext: params.msg.payload.channelStructuredContext
		},
		media,
		event: {
			id: eventId,
			timestamp: params.msg.event.timestamp
		},
		from: conversationId,
		sender: {
			id: params.sender.id ?? params.sender.e164,
			name: params.sender.name,
			isSelf: params.msg.platform.fromMe === true
		},
		conversation: {
			kind: conversationKind,
			id: conversationId,
			label: conversationId
		},
		route: {
			agentId: params.route.agentId,
			dmScope: params.route.dmScope,
			accountId: params.route.accountId,
			routeSessionKey: params.route.sessionKey
		},
		reply: {
			to: params.msg.platform.recipientJid,
			originatingTo: conversationId,
			replyToId: params.visibleReplyTo?.id
		},
		message: {
			body: params.combinedBody,
			bodyForAgent: params.bodyForAgent ?? params.msg.payload.body,
			inboundHistory,
			rawBody: params.rawBody ?? params.msg.payload.body,
			commandBody: params.command?.body ?? params.msg.payload.body
		},
		sessionTranscript: { historyLimit: conversationKind === "group" ? params.groupHistoryLimit ?? params.groupHistory?.length ?? 0 : 0 },
		mentions: wasMentioned !== void 0 ? {
			canDetectMention: conversationKind === "group",
			wasMentioned,
			requireMention: params.msg.groupMention?.requireMention
		} : void 0,
		command: params.command,
		context: {
			transcript: params.transcript,
			groupSubject: params.msg.group?.subject ?? null,
			groupMembers: formatGroupMembers({
				participants: params.msg.group?.participants,
				roster: params.groupMemberRoster,
				fallbackE164: params.sender.e164
			}),
			senderE164: params.sender.e164,
			replyThreading: params.replyThreading,
			location: params.msg.payload.location
		}
	};
	const projected = projectPreparedChannelInbound({
		inbound,
		control,
		buildContext: params.buildContext ?? buildChannelInboundEventContext
	});
	return {
		inbound,
		control,
		turnInput: projected.input,
		ctxPayload: projected.context
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
	if (params.dmRouteTarget && inboundLastRouteSessionKey === params.route.mainSessionKey && params.pinnedMainDmRecipient) logVerbose$1(`Skipping main-session last route update for ${params.dmRouteTarget} (pinned owner ${params.pinnedMainDmRecipient})`);
}
function createWhatsAppReplyPlan(params) {
	const conversationId = params.inbound.conversation.id;
	const statusReactionController = params.statusReactionController ?? null;
	const textLimit = params.maxMediaTextChunkLimit ?? resolveTextChunkLimit(params.cfg, "whatsapp");
	const chunkMode = resolveChunkMode(params.cfg, "whatsapp", params.route.accountId);
	const tableMode = resolveMarkdownTableMode$1({
		cfg: params.cfg,
		channel: "whatsapp",
		accountId: params.route.accountId
	});
	const mediaLocalRoots = getAgentScopedMediaLocalRoots(params.cfg, params.route.agentId);
	const replyPolicy = resolveWhatsAppInboundReplyPolicy({
		cfg: params.cfg,
		ctx: params.context,
		blockStreamingEnabled: resolveChannelStreamingBlockEnabled(params.cfg.channels?.whatsapp)
	});
	let didSendReply = false;
	let didLogHeartbeatStrip = false;
	const recordDeliveredPayload = (payload) => {
		didSendReply = true;
		if (shouldLogVerbose$1()) {
			const reply = resolveSendableOutboundReplyParts(payload);
			const preview = payload.text != null ? reply.text : "<media>";
			logVerbose$1(`Reply body: ${preview}${reply.hasMedia ? " (media)" : ""} -> ${conversationId}`);
		}
	};
	const deliverNormalizedPayload = async (normalizedDeliveryPayload, info, options) => {
		const reply = resolveSendableOutboundReplyParts(normalizedDeliveryPayload);
		if (!reply.hasMedia && !reply.text.trim()) return whatsAppReplyDeliveryVisibility(false);
		let delivery;
		try {
			delivery = await params.deliverReply({
				replyResult: normalizedDeliveryPayload,
				normalizedReplyResult: normalizedDeliveryPayload,
				transport: params.transport,
				mediaLocalRoots,
				maxMediaBytes: params.maxMediaBytes,
				textLimit,
				chunkMode,
				replyLogger: params.replyLogger,
				connectionId: params.connectionId,
				skipLog: false,
				tableMode,
				onMediaAccepted: options?.onMediaAccepted
			});
		} catch (error) {
			if (isWhatsAppVisibleDeliveryError(error) && !isChannelPartialDeliveryError(error)) throw createChannelPartialDeliveryError(error, {
				content: reply.text,
				visibleReplySent: true
			});
			throw error;
		}
		const result = createWhatsAppChannelDeliveryResult({
			content: reply.text,
			delivery
		});
		if (!result.visibleReplySent) {
			params.replyLogger.warn({
				correlationId: params.transport.correlationId ?? null,
				connectionId: params.connectionId,
				conversationId,
				chatId: params.transport.chatJid,
				to: conversationId,
				from: params.transport.recipientJid,
				replyKind: info.kind
			}, "auto-reply was not accepted by WhatsApp provider");
			return result;
		}
		if (options?.recordDelivery !== false) recordDeliveredPayload(normalizedDeliveryPayload);
		return result;
	};
	const mediaOnlyCoalescer = createWhatsAppMediaOnlyReplyCoalescer({ deliver: async (pending) => {
		return await deliverNormalizedPayload(pending.payload, pending.info);
	} });
	return {
		afterRecord: () => {
			if (statusReactionController) statusReactionController.setThinking();
		},
		dispatcherOptions: {
			...params.replyPipeline,
			onHeartbeatStrip: () => {
				if (!didLogHeartbeatStrip) {
					didLogHeartbeatStrip = true;
					logVerbose$1("Stripped stray HEARTBEAT_OK token from web reply");
				}
			},
			onSettled: async () => {
				const flushResult = await mediaOnlyCoalescer.flushAll();
				logWhatsAppMediaOnlyFlushResult(flushResult);
				return whatsAppReplyDeliveryVisibility(didSendReply || flushResult.delivered > 0);
			},
			onReplyStart: params.transport.sendComposing
		},
		delivery: {
			observeMessageSent: true,
			preparePayload: async (payload, info) => {
				const deliveryPayload = resolveWhatsAppDeliverablePayload(formatDevModeReasoningPayload(payload, params.replyPipeline.responsePrefix) ?? payload, info);
				if (!deliveryPayload) return null;
				const normalizedOutboundPayload = normalizeWhatsAppOutboundPayload(deliveryPayload, { normalizeText: normalizeWhatsAppPayloadTextPreservingIndentation });
				const normalizedDeliveryPayload = deliveryPayload.text === void 0 ? {
					...normalizedOutboundPayload,
					text: void 0
				} : normalizedOutboundPayload;
				const reply = resolveSendableOutboundReplyParts(normalizedDeliveryPayload);
				if (!reply.hasMedia && !reply.text.trim()) return normalizedDeliveryPayload;
				const mediaUrls = new Set(normalizedDeliveryPayload.mediaUrls);
				logWhatsAppMediaOnlyFlushResult(reply.hasMedia ? shouldDeferWhatsAppMediaOnlyPayload({
					info,
					mediaUrls,
					reply
				}) ? {
					delivered: 0,
					droppedDuplicateMedia: 0
				} : await mediaOnlyCoalescer.flushNonDuplicateMedia(mediaUrls) : await mediaOnlyCoalescer.flushAll());
				return normalizedDeliveryPayload;
			},
			durable: (payload, info) => {
				const reply = resolveSendableOutboundReplyParts(payload);
				if (reply.hasMedia || !reply.text.trim()) return false;
				return {
					to: conversationId,
					replyToId: resolveWhatsAppDurableReplyToId({
						context: params.context,
						info,
						currentMessageId: params.transport.correlationId,
						payload
					}),
					formatting: {
						textLimit,
						tableMode,
						chunkMode
					}
				};
			},
			deliver: async (payload, info) => {
				const normalizedDeliveryPayload = payload;
				const reply = resolveSendableOutboundReplyParts(normalizedDeliveryPayload);
				if (!reply.hasMedia && !reply.text.trim()) return whatsAppReplyDeliveryVisibility(false);
				if (!reply.hasMedia) return await deliverNormalizedPayload(normalizedDeliveryPayload, info, { recordDelivery: false });
				const mediaUrls = new Set(normalizedDeliveryPayload.mediaUrls);
				if (shouldDeferWhatsAppMediaOnlyPayload({
					info,
					mediaUrls,
					reply
				})) return {
					visibleReplySent: false,
					finalization: mediaOnlyCoalescer.defer({
						info,
						mediaUrls,
						payload: normalizedDeliveryPayload
					})
				};
				return await deliverNormalizedPayload(normalizedDeliveryPayload, info, { onMediaAccepted: (mediaUrl) => {
					didSendReply = true;
					logWhatsAppMediaOnlyFlushResult(mediaOnlyCoalescer.supersedeMedia(mediaUrl));
				} });
			},
			onDelivered: (payload, _info, result) => {
				if (!resolveSendableOutboundReplyParts(payload).hasMedia && result?.visibleReplySent === true) recordDeliveredPayload(payload);
			},
			onError: (err, info) => {
				if (didSendReply) markWhatsAppVisibleDeliveryError(err);
				logWhatsAppReplyDeliveryError({
					err,
					info,
					connectionId: params.connectionId,
					transport: params.transport,
					replyLogger: params.replyLogger
				});
			}
		},
		replyOptions: {
			...params.turnAdoptionLifecycle ? { turnAdoptionLifecycle: params.turnAdoptionLifecycle } : {},
			suppressTyping: replyPolicy.suppressTyping,
			disableBlockStreaming: replyPolicy.disableBlockStreaming,
			...process.env.OPENCLAW_DEV_MODE === "1" ? { reasoningPayloadsEnabled: true } : {},
			...replyPolicy.sourceReplyDeliveryMode ? { sourceReplyDeliveryMode: replyPolicy.sourceReplyDeliveryMode } : {},
			onModelSelected: params.onModelSelected,
			...statusReactionController ? {
				onToolStart: async (payload) => {
					const toolName = payload.name?.trim();
					if (toolName) await statusReactionController.setTool(toolName);
					return false;
				},
				onCompactionStart: async () => {
					await statusReactionController.setCompacting();
					return false;
				},
				onCompactionEnd: async () => {
					statusReactionController.cancelPending();
					await statusReactionController.setThinking();
					return false;
				}
			} : {}
		},
		replyResolver: params.replyResolver,
		finalize: (dispatchResult) => {
			const didQueueVisibleReply = hasVisibleInboundReplyDispatch(dispatchResult);
			const didDeliverVisibleReply = didSendReply || dispatchResult.observedReplyDelivery === true;
			if (!didQueueVisibleReply && !didDeliverVisibleReply) {
				if (statusReactionController) finalizeWhatsAppStatusReaction({
					controller: statusReactionController,
					outcome: "error"
				});
				if (params.shouldClearGroupHistory) params.groupHistories.set(params.groupHistoryKey, []);
				logVerbose$1("Skipping auto-reply: silent token or no text/media returned from resolver");
				return false;
			}
			if (statusReactionController) finalizeWhatsAppStatusReaction({
				controller: statusReactionController,
				outcome: readAgentRunTerminalOutcome(dispatchResult) === "failed" || !didDeliverVisibleReply ? "error" : "done"
			});
			if (params.shouldClearGroupHistory) params.groupHistories.set(params.groupHistoryKey, []);
			return didDeliverVisibleReply;
		}
	};
}
async function finalizeWhatsAppStatusReaction(params) {
	if (params.outcome === "done") await params.controller.setDone();
	else await params.controller.setError();
	await params.controller.restoreInitial();
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
	const { msg, previousTimestamp, envelope } = params;
	const admission = requireWhatsAppInboundAdmission(msg);
	const conversationId = admission.conversation.id;
	const conversationKind = admission.conversation.kind;
	const replyContext = params.visibleReplyTo === void 0 ? formatReplyContext(msg) : formatReplyTarget(params.visibleReplyTo);
	const baseLine = `${msg.payload.body}${replyContext ? `\n\n${replyContext}` : ""}`;
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
	if ((params.cfg.messages?.statusReactions)?.enabled !== true) return null;
	const eligibility = await resolveWhatsAppReactionEligibility({
		cfg: params.cfg,
		msg: params.msg,
		agentId: params.agentId,
		sessionKey: params.sessionKey,
		verbose: params.verbose
	});
	if (eligibility.status === "disabled") return null;
	const { chatId, messageId, emoji: initialEmoji, reactionOptions } = eligibility;
	return createStatusReactionController({
		enabled: true,
		adapter: {
			setReaction: async (emoji) => {
				await sendReactionWhatsApp(chatId, messageId, emoji, reactionOptions);
			},
			clearReaction: async () => {
				await sendReactionWhatsApp(chatId, messageId, "", reactionOptions);
			}
		},
		initialEmoji,
		emojis: void 0,
		onError: (err) => {
			logVerbose(`WhatsApp status-reaction error for chat ${chatId}/${messageId}: ${String(err)}`);
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
	const hasAudioBody = (params.msg.payload.media?.kind === "audio" || params.msg.payload.media?.type?.startsWith("audio/") === true) && !params.msg.payload.body.trim();
	if (params.preflightAudioTranscript === void 0 && hasAudioBody && params.msg.payload.media?.path) try {
		const { transcribeFirstAudio } = await import("./audio-preflight.runtime-C_glQhZY.mjs");
		audioTranscript = await transcribeFirstAudio({
			ctx: {
				media: [{
					path: params.msg.payload.media.path,
					contentType: params.msg.payload.media.type,
					kind: params.msg.payload.media.kind ?? void 0
				}],
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
		if (shouldLogVerbose$1()) logVerbose$1("whatsapp: audio preflight transcription failed, keeping structured audio");
	}
	const msgForAgent = audioTranscript !== void 0 ? {
		...params.msg,
		payload: {
			...params.msg.payload,
			body: formatAudioTranscriptForAgent(audioTranscript)
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
		msg: msgForAgent,
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
		if (history.length > 0) {
			const historyEntries = history.map((m) => ({
				sender: m.sender,
				body: m.body,
				timestamp: m.timestamp,
				media: m.media
			}));
			combinedBody = buildHistoryContextFromEntries({
				entries: historyEntries,
				currentMessage: combinedBody,
				excludeLast: false,
				formatEntry: (entry) => {
					return formatInboundEnvelope$1({
						channel: "WhatsApp",
						from: conversationId,
						timestamp: entry.timestamp,
						body: [entry.body, formatMediaPlaceholderText(entry.media ?? [])].filter(Boolean).join("\n"),
						chatType: "group",
						senderLabel: entry.sender,
						envelope: envelopeOptions
					});
				}
			});
		}
		shouldClearGroupHistory = !(params.suppressGroupHistoryClear ?? false);
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
	if (shouldLogVerbose$1()) whatsappInboundLog.debug(`Inbound body: ${elide(combinedBody, 400)}`);
	const sender = getSenderIdentity(params.msg);
	const commandBody = params.msg.payload.commandBody ?? params.msg.payload.body;
	const dmRouteTarget = resolveWhatsAppDmRouteTarget({
		msg: params.msg,
		senderE164: sender.e164 ?? void 0,
		normalizeE164
	});
	const shouldCheckCommandAuth = shouldComputeCommandAuthorized(commandBody, params.cfg);
	const isTextCommand = isControlCommandMessage(commandBody, params.cfg);
	const commandAuthorized = shouldCheckCommandAuth ? await resolveWhatsAppCommandAuthorized({
		cfg: params.cfg,
		msg: params.msg,
		policy: inboundPolicy,
		authDir: account.authDir
	}) : void 0;
	const { onModelSelected, ...replyPipeline } = createChannelMessageReplyPipeline({
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
	const commandAuthorization = commandAuthorized === void 0 ? { kind: "not_checked" } : commandAuthorized ? { kind: "authorized" } : { kind: "denied" };
	const { inbound, turnInput, ctxPayload } = await prepareWhatsAppInboundContext({
		bodyForAgent: msgForAgent.payload.body,
		combinedBody,
		command: {
			kind: isTextCommand ? "text-slash" : "normal",
			body: commandBody,
			authorization: commandAuthorization
		},
		groupHistory: visibleGroupHistory,
		groupHistoryLimit: params.groupHistoryLimit,
		groupMemberRoster: params.groupMemberNames.get(params.groupHistoryKey),
		groupSystemPrompt: conversationSystemPrompt,
		msg: params.msg,
		rawBody: commandBody,
		route: params.route,
		buildContext: params.buildContext,
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
	const transport = buildWhatsAppInboundTransportContext(params.msg);
	const ingressLifecycle = resolveWhatsAppIngressLifecycle(params.msg);
	const turnAdoptionLifecycle = ingressLifecycle ? bindIngressLifecycleToReplyOptions(ingressLifecycle).turnAdoptionLifecycle : void 0;
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
	let finalizeReply;
	const turnResult = await runChannelInboundEvent({
		channel: "whatsapp",
		accountId: params.route.accountId,
		raw: inbound,
		...turnAdoptionLifecycle ? { turnAdoptionLifecycle } : {},
		adapter: {
			ingest: () => turnInput,
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
			resolveTurn: () => {
				const { finalize, ...replyPlan } = createWhatsAppReplyPlan({
					cfg: params.cfg,
					connectionId: params.connectionId,
					context: ctxPayload,
					deliverReply: deliverWebReply,
					groupHistories: params.groupHistories,
					groupHistoryKey: params.groupHistoryKey,
					maxMediaBytes: params.maxMediaBytes,
					maxMediaTextChunkLimit: params.maxMediaTextChunkLimit,
					inbound,
					onModelSelected,
					replyLogger: params.replyLogger,
					replyPipeline: {
						...replyPipeline,
						responsePrefix
					},
					replyResolver: params.replyResolver,
					route: params.route,
					shouldClearGroupHistory,
					statusReactionController,
					transport,
					turnAdoptionLifecycle
				});
				finalizeReply = finalize;
				return {
					cfg: params.cfg,
					channel: "whatsapp",
					accountId: params.route.accountId,
					route: {
						agentId: params.route.agentId,
						sessionKey: params.route.sessionKey
					},
					ctxPayload,
					dispatchReplyFromConfig: params.dispatchReplyFromConfig,
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
					...replyPlan
				};
			}
		}
	});
	const didSendReply = turnResult.dispatched ? finalizeReply?.(turnResult.dispatchResult) ?? false : false;
	removeAckReactionHandleAfterReply({
		removeAfterReply: false,
		ackReaction,
		onError: (err) => {
			logAckFailure({
				log: logVerbose$1,
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
	const hasExplicitlyPassedInboundAccess = (msg) => msg.admission.ingress.decision === "allow";
	const withDirectSenderPeer = (msg, peerId) => {
		if (requireWhatsAppInboundAdmission(msg).conversation.kind === "group" || msg.platform.sender?.e164 || msg.platform.senderE164 || !peerId.startsWith("+")) return msg;
		const normalized = normalizeE164(peerId);
		if (!normalized) return msg;
		return {
			...msg,
			platform: {
				...msg.platform,
				sender: {
					...msg.platform.sender,
					e164: normalized
				},
				senderE164: normalized
			}
		};
	};
	const processForRoute = async (cfg, msg, route, groupHistoryKey, opts) => {
		const processParams = {
			cfg,
			msg,
			route,
			groupHistoryKey,
			groupHistories: params.groupHistories,
			groupHistoryLimit: params.groupHistoryLimit,
			groupMemberNames: params.groupMemberNames,
			connectionId: params.connectionId,
			verbose: params.verbose,
			maxMediaBytes: params.maxMediaBytes,
			replyResolver: params.replyResolver,
			replyLogger: params.replyLogger,
			backgroundTasks: params.backgroundTasks,
			buildContext: params.buildContext,
			dispatchReplyFromConfig: params.dispatchReplyFromConfig
		};
		if (opts?.groupHistory !== void 0) processParams.groupHistory = opts.groupHistory;
		if (opts?.suppressGroupHistoryClear !== void 0) processParams.suppressGroupHistoryClear = opts.suppressGroupHistoryClear;
		if (opts?.preflightAudioTranscript !== void 0) processParams.preflightAudioTranscript = opts.preflightAudioTranscript;
		if (opts?.ackAlreadySent === true) processParams.ackAlreadySent = true;
		if (opts?.ackReaction !== void 0) processParams.ackReaction = opts.ackReaction;
		if (opts?.statusReactionController !== void 0) processParams.statusReactionController = opts.statusReactionController;
		return processMessage(processParams);
	};
	return async (normalizedMsg) => {
		const canRunDirectEarlyAudioPreflight = hasExplicitlyPassedInboundAccess(normalizedMsg);
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
		if (isDevModeSelfChatReasoningEcho(msg, conversationId)) return;
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
		const hasAudioBody = (msg.payload.media?.kind === "audio" || msg.payload.media?.type?.startsWith("audio/") === true) && !msg.payload.body.trim();
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
				const { transcribeFirstAudio } = await import("./audio-preflight.runtime-C_glQhZY.mjs");
				preflightAudioTranscript = await transcribeFirstAudio({
					ctx: {
						media: [{
							path: msg.payload.media.path,
							contentType: msg.payload.media.type,
							kind: msg.payload.media.kind ?? void 0
						}],
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
		const hasBroadcastTargets = !configuredRoute.bindingResolution && resolveGroupThreadConfig({
			cfg,
			channel: "whatsapp",
			peerId
		}) !== void 0;
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
const loadReplyResolverRuntime = createLazyRuntimeModule(() => import("./reply-resolver.runtime-Ded8D58Y.mjs"));
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
					responsePrefix: account.messagePrefix,
					allowFrom: account.allowFrom,
					groupAllowFrom: account.groupAllowFrom,
					groupPolicy: account.groupPolicy,
					textChunkLimit: account.textChunkLimit,
					streaming: account.streaming,
					mediaMaxMb: account.mediaMaxMb,
					groups: account.groups
				}
			}
		},
		account
	};
}
function isNoListenerReconnectError(lastError) {
	return typeof lastError === "string" && /No active WhatsApp Web listener/i.test(lastError);
}
function normalizeReconnectAccountId(accountId) {
	return (accountId ?? "").trim() || "default";
}
function isRetryableAuthUnstableError(error) {
	return error instanceof WhatsAppAuthUnstableError || typeof error === "object" && error !== null && "code" in error && error.code === "whatsapp-auth-unstable";
}
const DEFAULT_TRANSPORT_TIMEOUT_MS = 3e5;
const WHATSAPP_RECONNECT_CATCH_UP_MAX_MS = 12e5;
async function monitorWebChannel(verbose, listenerFactory = attachWebInboxToSocket, keepAlive = true, replyResolver, runtime = defaultRuntime, abortSignal, tuning = {}) {
	const activeReplyResolver = replyResolver ?? (await loadReplyResolverRuntime()).getReplyFromConfig;
	const runId = newConnectionId();
	const replyLogger = getChildLogger$1({
		module: "web-auto-reply",
		runId
	});
	const heartbeatLogger = getChildLogger$1({
		module: "web-heartbeat",
		runId
	});
	const reconnectLogger = getChildLogger$1({
		module: "web-reconnect",
		runId
	});
	const { cfg, account } = resolveWebMonitorConfigSnapshot({
		cfg: getRuntimeConfig$1(),
		accountId: tuning.accountId
	});
	const loadCurrentMonitorConfig = () => resolveWebMonitorConfigSnapshot({
		cfg: getRuntimeConfig$1(),
		accountId: account.accountId
	}).cfg;
	const maxMediaBytes = resolveWhatsAppMediaMaxBytes(account);
	const heartbeatSeconds = resolveHeartbeatSeconds(cfg, tuning.heartbeatSeconds);
	const reconnectPolicy = resolveReconnectPolicy(cfg, tuning.reconnect);
	const socketTiming = resolveWhatsAppSocketTiming(tuning.socketTiming);
	const baseMentionConfig = buildMentionConfig(cfg);
	const groupHistoryLimit = resolvePromptHistoryLimit(account.historyLimit ?? cfg.channels?.whatsapp?.historyLimit ?? cfg.messages?.groupChat?.historyLimit);
	const groupHistories = /* @__PURE__ */ new Map();
	const groupMemberNames = /* @__PURE__ */ new Map();
	const groupMetadataCache = /* @__PURE__ */ new Map();
	const recentMessageKeys = /* @__PURE__ */ new Map();
	const baileysGroupMetaCache = /* @__PURE__ */ new Map();
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
	const messageTimeoutMs = tuning.messageTimeoutMs ?? 18e5;
	const reconnectCatchUpWindowMs = Math.min(Math.max(messageTimeoutMs, 6e4), WHATSAPP_RECONNECT_CATCH_UP_MAX_MS);
	const watchdogCheckMs = tuning.watchdogCheckMs ?? 6e4;
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
			const shouldDebounce = (msg) => shouldDebounceTextInbound({
				text: msg.payload.commandBody ?? msg.payload.body,
				cfg,
				hasMedia: Boolean(msg.payload.media?.path || msg.payload.media?.type),
				allowDebounce: !(msg.payload.location || msg.quote?.id || msg.quote?.body)
			});
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
						const pluginChannelRuntime = tuning.channelRuntime;
						const onMessage = createWebOnMessageHandler({
							cfg,
							loadConfig: loadCurrentMonitorConfig,
							verbose,
							connectionId,
							maxMediaBytes,
							groupHistoryLimit,
							groupHistories,
							groupMemberNames,
							backgroundTasks: connectionLocal.backgroundTasks,
							replyResolver: activeReplyResolver,
							replyLogger,
							baseMentionConfig,
							account,
							buildContext: pluginChannelRuntime?.inbound.buildContext,
							dispatchReplyFromConfig: pluginChannelRuntime?.reply?.dispatchReplyFromConfig
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
							debounceMs: tuning.debounceMs,
							appendReplyWindow: connectionLocal.openedAfterRecentInbound ? {
								afterMs: connectionLocal.startedAt - reconnectCatchUpWindowMs,
								untilMs: connectionLocal.startedAt + reconnectCatchUpWindowMs,
								maxAgeMs: reconnectCatchUpWindowMs
							} : void 0,
							shouldDebounce,
							socketRef: controller.socketRef,
							shouldRetryDisconnect: () => !sigintStop && controller.shouldRetryDisconnect(),
							disconnectRetryPolicy: reconnectPolicy,
							disconnectRetryAbortSignal: controller.getDisconnectRetryAbortSignal(),
							groupMetadataCache,
							recentMessageKeys,
							baileysGroupMetaCache,
							onMessage: async (msg) => {
								const inboundAt = Date.now();
								controller.noteInbound(inboundAt);
								statusController.noteInbound(inboundAt);
								await onMessage(msg);
							},
							onPendingWorkChanged: (pendingWorkCount, at) => {
								statusController.noteBusy(pendingWorkCount > 0, at);
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
export { loadWebMediaRaw as a, monitorWebInbox as c, loadWebMedia as i, resetWebInboundDedupe as l, LocalMediaAccessError as n, optimizeImageToJpeg as o, getDefaultLocalRoots as r, optimizeImageToPng as s, monitorWebChannel as t };
