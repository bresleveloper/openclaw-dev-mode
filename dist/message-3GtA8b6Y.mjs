import { F as resolveTimerTimeoutMs } from "./number-coercion-CLj0HTDM.mjs";
import { r as createLazyRuntimeModule } from "./lazy-runtime-BPNHa36e.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { i as GATEWAY_CLIENT_NAMES, r as GATEWAY_CLIENT_MODES } from "./client-info-B_ICKCYw.mjs";
import "./message-channel-DDcHHhpX.mjs";
import { a as projectOutboundPayloadPlanForDelivery, s as projectOutboundPayloadPlanForMirror, t as createOutboundPayloadPlan } from "./payloads-Ce1fWBq6.mjs";
import { i as resolveOutboundDurableFinalDeliverySupport } from "./deliver-prepare-CcRB3z1q.mjs";
import { r as normalizeOutboundReplyFacts } from "./reply-policy-B3zWXBNP.mjs";
import { c as findOutboundHandoffRejectedError, s as assertOutboundHandoffCurrent } from "./delivery-queue-reconciliation-CRIys7F4.mjs";
import { t as buildOutboundSessionContext } from "./session-context-B-tubEEv.mjs";
import { i as serializeDurableMessagePayloadOutcomes, n as sendDurableMessageBatchCore, t as durableMessageBatchMayHaveReachedRecipient } from "./send-BzEwoibi.mjs";
import { n as deriveDurableFinalDeliveryRequirementsForBatch } from "./capabilities-CnBInN_D.mjs";
import "./deliver-C2Ns6Xwz.mjs";
import { d as createChannelPartialDeliveryError } from "./live-CJusMVR5.mjs";
import "./runtime-BbyACrqB.mjs";
import { n as normalizePollInput } from "./polls-C-v11_tu.mjs";
import { r as resolveMessageChannelSelection } from "./channel-selection-DF4EarV9.mjs";
import { a as resolveOutboundTarget } from "./targets-mANr-dJe.mjs";
//#region src/infra/outbound/message-gateway-options.ts
/** Normalizes outbound gateway options and fills CLI defaults. */
function resolveOutboundMessageGatewayOptions(gateway) {
	const clientName = gateway?.clientName ?? GATEWAY_CLIENT_NAMES.CLI;
	const mode = gateway?.mode ?? GATEWAY_CLIENT_MODES.CLI;
	const url = mode === GATEWAY_CLIENT_MODES.BACKEND || clientName === GATEWAY_CLIENT_NAMES.GATEWAY_CLIENT ? void 0 : gateway?.url;
	return {
		config: gateway?.config,
		localPortOverride: gateway?.localPortOverride,
		ignoreEnvUrlOverride: gateway?.ignoreEnvUrlOverride,
		tlsFingerprint: gateway?.tlsFingerprint,
		url,
		token: gateway?.token,
		timeoutMs: resolveTimerTimeoutMs(gateway?.timeoutMs, 1e4),
		clientName,
		clientDisplayName: gateway?.clientDisplayName,
		mode
	};
}
//#endregion
//#region src/infra/outbound/message.ts
const SEND_BUFFER_MEDIA_URL = "buffer://message-send/attachment";
const loadMessageConfigRuntime = createLazyRuntimeModule(() => import("./message.config.runtime.js"));
const loadMessageGatewayRuntime = createLazyRuntimeModule(() => import("./message.gateway.runtime.js"));
function normalizeMessagePollDeliveryResult(result) {
	const { channelId, conversationId, ...delivery } = result;
	return {
		...delivery,
		...channelId ? { target: {
			kind: "channel",
			id: channelId
		} } : conversationId ? { target: {
			kind: "conversation",
			id: conversationId
		} } : {}
	};
}
function buildMessagePollResult(params) {
	return {
		channel: params.channel,
		to: params.to,
		question: params.normalized.question,
		options: params.normalized.options,
		maxSelections: params.normalized.maxSelections,
		durationSeconds: params.normalized.durationSeconds ?? null,
		durationHours: params.normalized.durationHours ?? null,
		via: params.via,
		...params.dryRun ? { dryRun: true } : { result: params.result }
	};
}
function assertPollOptionSupport(params) {
	if (typeof params.durationSeconds === "number" && params.outbound.supportsPollDurationSeconds !== true) throw new Error(`durationSeconds is not supported for ${params.channel} polls`);
	if (typeof params.isAnonymous === "boolean" && params.outbound.supportsAnonymousPolls !== true) throw new Error(`isAnonymous is not supported for ${params.channel} polls`);
}
async function resolveRequiredChannel(params) {
	return await resolveMessageChannelSelection({
		cfg: params.cfg,
		channel: params.channel
	});
}
function deriveRequiredMessageSendCapabilities(params) {
	return deriveDurableFinalDeliveryRequirementsForBatch({
		...params,
		reconcileUnknownSend: true
	});
}
async function assertRequiredMessageSendDurability(params) {
	const support = await resolveOutboundDurableFinalDeliverySupport({
		cfg: params.cfg,
		agentId: params.agentId,
		channel: params.channel,
		requirements: deriveRequiredMessageSendCapabilities(params)
	});
	if (support.ok) return;
	const suffix = support.reason === "capability_mismatch" && support.capability ? `missing ${support.capability}` : support.reason;
	throw new Error(`Required durable message send is unsupported for ${params.channel}: ${suffix}. Use queuePolicy:"best_effort" for best-effort delivery, omit bestEffort:false in message-tool calls, or use a channel with required durable delivery support.`);
}
function resolveGatewayOptions(opts) {
	return resolveOutboundMessageGatewayOptions(opts);
}
async function callMessageGateway(params) {
	const gateway = resolveGatewayOptions(params.gateway);
	const agentRuntimeIdentityToken = params.gateway?.request ? void 0 : await params.gateway?.resolveAgentRuntimeIdentityToken?.();
	await params.onPlatformSendDispatch?.();
	assertOutboundHandoffCurrent(params.assertDirectAdapterHandoff);
	if (params.gateway?.request) return await params.gateway.request({
		method: params.method,
		params: params.params,
		timeoutMs: gateway.timeoutMs
	});
	const { callGatewayLeastPrivilege } = await loadMessageGatewayRuntime();
	return await callGatewayLeastPrivilege({
		...gateway,
		method: params.method,
		params: params.params,
		agentRuntimeIdentityToken
	});
}
async function resolveMessageConfig(cfg) {
	if (cfg) return cfg;
	const { getRuntimeConfig } = await loadMessageConfigRuntime();
	return getRuntimeConfig();
}
async function resolveGatewayIdempotencyKey(idempotencyKey) {
	if (idempotencyKey) return idempotencyKey;
	const { randomIdempotencyKey } = await loadMessageGatewayRuntime();
	return randomIdempotencyKey();
}
async function sendMessage(params) {
	const cfg = await resolveMessageConfig(params.cfg);
	const reply = normalizeOutboundReplyFacts({
		reply: params.reply,
		replyToId: params.replyToId
	});
	const { channel, plugin } = params.preparedPlugin ? {
		channel: params.preparedPlugin.id,
		plugin: params.preparedPlugin
	} : await resolveRequiredChannel({
		cfg,
		channel: params.channel
	});
	const deliveryMode = plugin.outbound?.deliveryMode ?? "direct";
	const hasRealMediaSource = [params.mediaUrl, ...params.mediaUrls ?? []].filter((source) => Boolean(source)).some((source) => source !== SEND_BUFFER_MEDIA_URL);
	const shouldForwardBuffer = deliveryMode === "gateway" && Boolean(params.buffer) && !hasRealMediaSource;
	const mediaUrl = params.mediaUrl ?? (shouldForwardBuffer ? SEND_BUFFER_MEDIA_URL : void 0);
	const mediaUrls = params.mediaUrls ?? (shouldForwardBuffer ? [SEND_BUFFER_MEDIA_URL] : void 0);
	const outboundPayloads = params.payloads && params.payloads.length > 0 ? params.payloads : [{
		text: params.content,
		mediaUrl,
		mediaUrls,
		audioAsVoice: params.asVoice === true
	}];
	const outboundPlan = createOutboundPayloadPlan(outboundPayloads);
	const normalizedPayloads = projectOutboundPayloadPlanForDelivery(outboundPlan);
	const mirrorProjection = projectOutboundPayloadPlanForMirror(outboundPlan);
	const mirrorText = mirrorProjection.text;
	const mirrorMediaUrls = mirrorProjection.mediaUrls;
	const primaryMediaUrl = mirrorMediaUrls[0] ?? mediaUrl ?? null;
	if (params.dryRun) return {
		channel,
		to: params.to,
		via: deliveryMode === "gateway" ? "gateway" : "direct",
		mediaUrl: primaryMediaUrl,
		mediaUrls: mirrorMediaUrls.length ? mirrorMediaUrls : void 0,
		dryRun: true
	};
	if (deliveryMode !== "gateway" || params.gatewayOwnedDelivery === true) {
		const outboundChannel = channel;
		const resolvedTarget = resolveOutboundTarget({
			channel: outboundChannel,
			plugin,
			to: params.to,
			cfg,
			accountId: params.accountId,
			mode: "explicit"
		});
		if (!resolvedTarget.ok) throw resolvedTarget.error;
		const outboundSession = buildOutboundSessionContext({
			cfg,
			agentId: params.agentId,
			sessionKey: params.requesterSessionKey ?? params.mirror?.sessionKey,
			conversationType: params.conversationType,
			requesterAccountId: params.requesterAccountId ?? params.accountId,
			requesterSenderId: params.requesterSenderId,
			requesterSenderName: params.requesterSenderName,
			requesterSenderUsername: params.requesterSenderUsername,
			requesterSenderE164: params.requesterSenderE164
		});
		const requireUnknownSendReconciliation = params.requireUnknownSendReconciliation ?? params.queuePolicy === "required";
		if (requireUnknownSendReconciliation) await assertRequiredMessageSendDurability({
			cfg,
			agentId: params.agentId,
			channel: outboundChannel,
			payloads: normalizedPayloads,
			replyToId: reply?.replyToId,
			threadId: params.threadId,
			silent: params.silent
		});
		const send = await sendDurableMessageBatchCore({
			cfg,
			channel: outboundChannel,
			to: resolvedTarget.to,
			session: outboundSession,
			runId: params.runId,
			executionIdentityToken: params.executionIdentityToken,
			accountId: params.accountId,
			conversationReadOrigin: params.conversationReadOrigin,
			payloads: normalizedPayloads,
			reply,
			threadId: params.threadId,
			gifPlayback: params.gifPlayback,
			forceDocument: params.forceDocument,
			deps: params.deps,
			bestEffort: params.bestEffort,
			...requireUnknownSendReconciliation ? { requireUnknownSendReconciliation: true } : {},
			durability: params.bestEffort || params.queuePolicy === "best_effort" ? "best_effort" : "required",
			signal: params.abortSignal,
			silent: params.silent,
			mediaAccess: params.mediaAccess,
			formatting: params.parseMode ? { parseMode: params.parseMode } : void 0,
			preparedMessageId: params.preparedMessageId,
			deliveryIntentId: params.deliveryIntentId,
			deliveryCompletion: params.deliveryCompletion,
			reusePendingDeliveryIntent: params.reusePendingDeliveryIntent,
			deliveryRetryOwner: params.deliveryRetryOwner,
			completionRetention: params.completionRetention,
			...params.onDeliveryIntent ? { onDeliveryIntent: params.onDeliveryIntent } : {},
			...params.onDeliveryAttempt ? { onDeliveryAttempt: params.onDeliveryAttempt } : {},
			...params.onDeliveryResult ? { onDeliveryResult: params.onDeliveryResult } : {},
			...params.onPlatformSendDispatch ? { onPlatformSendDispatch: params.onPlatformSendDispatch } : {},
			assertDirectAdapterHandoff: params.assertDirectAdapterHandoff,
			skipQueue: params.skipQueue,
			...params.onDeliveredPayload ? { onDeliveredPayload: params.onDeliveredPayload } : {},
			mirror: params.mirror ? {
				...params.mirror,
				text: mirrorText || params.content,
				mediaUrls: mirrorMediaUrls.length ? mirrorMediaUrls : void 0,
				idempotencyKey: params.mirror.idempotencyKey ?? params.idempotencyKey
			} : void 0
		}, params.conversationDeliveryTarget);
		const sendMayHaveReachedRecipient = durableMessageBatchMayHaveReachedRecipient(send);
		const handoffRejection = send.status === "failed" && !sendMayHaveReachedRecipient ? send.payloadOutcomes?.map((outcome) => outcome.status === "failed" ? findOutboundHandoffRejectedError(outcome.error) : void 0).find((error) => error !== void 0) ?? findOutboundHandoffRejectedError(send.error) : void 0;
		if (handoffRejection) throw handoffRejection;
		if (!params.bestEffort && params.gateway?.clientName !== GATEWAY_CLIENT_NAMES.CLI && (send.status === "failed" || send.status === "partial_failed")) {
			if (send.status === "partial_failed") throw createChannelPartialDeliveryError(send.error, {
				messageIds: send.results.map((result) => result.messageId),
				receipt: send.receipt,
				visibleReplySent: true
			});
			throw send.error;
		}
		const results = send.status === "sent" || send.status === "partial_failed" ? send.results : [];
		const payloadOutcomes = serializeDurableMessagePayloadOutcomes(send.payloadOutcomes);
		const sentBeforeError = send.status !== "sent" && sendMayHaveReachedRecipient;
		return {
			channel,
			to: params.to,
			via: deliveryMode === "gateway" ? "gateway" : "direct",
			mediaUrl: primaryMediaUrl,
			mediaUrls: mirrorMediaUrls.length ? mirrorMediaUrls : void 0,
			result: results.at(-1),
			deliveryStatus: send.status,
			...send.status === "suppressed" ? { suppressionReason: send.reason } : {},
			...send.status === "failed" || send.status === "partial_failed" ? { error: formatErrorMessage(send.error) } : {},
			...sentBeforeError ? { sentBeforeError: true } : {},
			...payloadOutcomes ? { payloadOutcomes } : {}
		};
	}
	const result = await callMessageGateway({
		gateway: params.gateway,
		method: "send",
		onPlatformSendDispatch: params.onPlatformSendDispatch,
		assertDirectAdapterHandoff: params.assertDirectAdapterHandoff,
		params: {
			to: params.to,
			message: params.content,
			mediaUrl,
			mediaUrls: mirrorMediaUrls.length ? mirrorMediaUrls : mediaUrls,
			buffer: shouldForwardBuffer ? params.buffer : void 0,
			filename: shouldForwardBuffer ? params.filename : void 0,
			contentType: shouldForwardBuffer ? params.contentType : void 0,
			asVoice: params.asVoice,
			gifPlayback: params.gifPlayback,
			accountId: params.accountId,
			agentId: params.agentId,
			channel,
			replyToId: reply?.replyToId,
			threadId: params.threadId != null ? String(params.threadId) : void 0,
			forceDocument: params.forceDocument,
			silent: params.silent,
			parseMode: params.parseMode,
			sessionKey: params.mirror?.sessionKey,
			idempotencyKey: await resolveGatewayIdempotencyKey(params.idempotencyKey)
		}
	});
	return {
		channel,
		to: params.to,
		via: "gateway",
		mediaUrl: primaryMediaUrl,
		mediaUrls: mirrorMediaUrls.length ? mirrorMediaUrls : void 0,
		result
	};
}
async function sendPoll(params) {
	const cfg = await resolveMessageConfig(params.cfg);
	const { channel, plugin } = params.preparedPlugin ? {
		channel: params.preparedPlugin.id,
		plugin: params.preparedPlugin
	} : await resolveRequiredChannel({
		cfg,
		channel: params.channel
	});
	const pollInput = {
		question: params.question,
		options: params.options,
		maxSelections: params.maxSelections,
		durationSeconds: params.durationSeconds,
		durationHours: params.durationHours
	};
	const outbound = plugin.outbound;
	if (!outbound?.sendPoll) throw new Error(`Unsupported poll channel: ${channel}`);
	const deliveryMode = outbound.deliveryMode ?? "direct";
	const normalized = outbound.pollMaxOptions ? normalizePollInput(pollInput, { maxOptions: outbound.pollMaxOptions }) : normalizePollInput(pollInput);
	if (params.dryRun) return buildMessagePollResult({
		channel,
		to: params.to,
		normalized,
		via: deliveryMode === "gateway" ? "gateway" : "direct",
		dryRun: true
	});
	assertPollOptionSupport({
		channel,
		outbound,
		durationSeconds: params.durationSeconds,
		isAnonymous: params.isAnonymous
	});
	if (deliveryMode !== "gateway" || params.gatewayOwnedDelivery === true) {
		const resolvedTarget = resolveOutboundTarget({
			channel,
			plugin,
			to: params.to,
			cfg,
			accountId: params.accountId,
			mode: "explicit"
		});
		if (!resolvedTarget.ok) throw resolvedTarget.error;
		params.assertDirectAdapterHandoff?.();
		const result = await outbound.sendPoll({
			cfg,
			to: resolvedTarget.to,
			poll: normalized,
			content: params.content,
			accountId: params.accountId,
			threadId: params.threadId,
			silent: params.silent,
			isAnonymous: params.isAnonymous,
			sessionKey: params.sessionKey,
			inboundEventKind: params.inboundEventKind,
			onPlatformSendDispatch: params.onPlatformSendDispatch,
			assertDirectAdapterHandoff: params.assertDirectAdapterHandoff
		});
		return buildMessagePollResult({
			channel,
			to: params.to,
			normalized,
			via: deliveryMode === "gateway" ? "gateway" : "direct",
			result: normalizeMessagePollDeliveryResult(result)
		});
	}
	const result = await callMessageGateway({
		gateway: params.gateway,
		method: "poll",
		onPlatformSendDispatch: params.onPlatformSendDispatch,
		assertDirectAdapterHandoff: params.assertDirectAdapterHandoff,
		params: {
			to: params.to,
			question: normalized.question,
			options: normalized.options,
			maxSelections: normalized.maxSelections,
			durationSeconds: normalized.durationSeconds,
			durationHours: normalized.durationHours,
			threadId: params.threadId,
			silent: params.silent,
			isAnonymous: params.isAnonymous,
			channel,
			accountId: params.accountId,
			idempotencyKey: await resolveGatewayIdempotencyKey(params.idempotencyKey)
		}
	});
	return buildMessagePollResult({
		channel,
		to: params.to,
		normalized,
		via: "gateway",
		result: normalizeMessagePollDeliveryResult(result)
	});
}
//#endregion
export { sendPoll as n, resolveOutboundMessageGatewayOptions as r, sendMessage as t };
