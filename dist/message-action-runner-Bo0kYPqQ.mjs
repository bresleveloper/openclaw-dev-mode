import { u as toErrorObject } from "./error-coercion-C787aVxk.mjs";
import "./src-CZ2wJvNB.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { a as asOptionalRecord } from "./record-coerce-DItp3I4t.mjs";
import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { r as createLazyRuntimeModule } from "./lazy-runtime-BPNHa36e.mjs";
import { r as isPathInside } from "./path-guards-D5kuI0Tv.mjs";
import { l as resolveAgentWorkspaceDir } from "./agent-scope-config-IQKOEtZ4.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { t as createSubsystemLogger } from "./subsystem-DleLyu58.mjs";
import { l as resolveSessionStorePathCore } from "./paths-CcMbq5NY.mjs";
import { n as readTrimmedStringAlias } from "./string-readers-Dkx3Z36w.mjs";
import { _ as resolveSessionAgentId } from "./agent-scope-CTuYDtny.mjs";
import { t as INTERNAL_MESSAGE_CHANNEL } from "./message-channel-constants-Cd7Eq8Zi.mjs";
import { n as normalizeMessageChannel } from "./message-channel-core-CxyiAx1U.mjs";
import "./message-channel-DDcHHhpX.mjs";
import { r as GatewayErrorDetailCodes, t as ErrorCodes } from "./gateway-error-details-D85F07e9.mjs";
import { n as GatewayProtocolRequestTimeoutError } from "./protocol-request-BMUN1re6.mjs";
import { t as normalizeChatType } from "./chat-type-Dbv0JQHI.mjs";
import { d as normalizeLegacyInteractiveReply, f as normalizeMessagePresentation, n as hasLegacyInteractiveReplyBlocks, o as hasReplyPayloadContent, r as hasMessagePresentationBlocks, v as renderMessagePresentationFallbackText } from "./payload-COvcWceu.mjs";
import { T as setReplyPayloadMetadata, a as copyReplyPayloadMetadata, n as appendReplyMediaFailures, s as getReplyPayloadMetadata } from "./reply-payload-B2ZQhznY.mjs";
import { s as getOwnedSessionTranscriptWriterFence } from "./transcript-write-context-MlBhwaKa.mjs";
import { r as shouldAttemptTtsPayload } from "./tts-config-DK27R_zM.mjs";
import { r as findCodeRegions } from "./code-regions-NxEObIZm.mjs";
import { n as parseInlineDirectives } from "./directive-tags-D9uZSb5h.mjs";
import { t as readSnakeCaseParamRaw } from "./param-key-J0cnwxlA.mjs";
import { d as readPositiveIntegerParam, h as readToolStringParam, p as readStringArrayParam } from "./common-XfKigJno.mjs";
import { l as loadSessionEntryReadOnly } from "./session-accessor.sqlite-entry-BTkJgNr-.mjs";
import "./session-accessor-C05KQ5A3.mjs";
import { s as stripPlainTextToolCallBlocks } from "./src-D2JRn00t.mjs";
import { n as getRuntimeVisibleChannelPlugin } from "./runtime-visible-channels-CiwNdke1.mjs";
import "./sessions-Cesa3L0p.mjs";
import { t as appendAssistantMessageToSessionTranscript } from "./transcript-DEj31pAK.mjs";
import { n as normalizeOutboundLocation } from "./location-Ce8_SVWn.mjs";
import { d as stripUnsupportedCitationControlMarkers } from "./payloads-Ce1fWBq6.mjs";
import { a as resolveSendableOutboundReplyParts } from "./reply-payload-parts-G378iYNJ.mjs";
import { a as resolveResponsePrefixTemplate } from "./normalize-reply-gZujyBo1.mjs";
import { a as throwIfAborted } from "./deliver-prepare-Rgnsll-n.mjs";
import { n as resolveAgentIdentity, o as resolveResponsePrefix } from "./identity-DdUdpaIE.mjs";
import "./reply-payload-RBmrGrXG.mjs";
import { i as withChannelReadAuthority } from "./channel-read-authority-CLJnqxr1.mjs";
import { t as resolveLocalMediaPath } from "./local-media-path-Buj_gOGY.mjs";
import { t as resolveAgentScopedOutboundMediaAccess } from "./read-capability-6BYNCORY.mjs";
import { o as OutboundHandoffRejectedError, s as assertOutboundHandoffCurrent } from "./delivery-queue-reconciliation-Di9zMXli.mjs";
import { t as MessageActionDeniedError } from "./message-action-denial-DOmE5Ll7.mjs";
import { a as normalizeTargetForProvider } from "./target-normalization-DqKkj4kz.mjs";
import { i as resolveChannelTarget } from "./target-resolver-BGltLgX1.mjs";
import { i as missingMessageActionTargetError, n as invalidMessageActionTargetError } from "./target-errors-BPI2bPFa.mjs";
import { i as enforceMessageActionAllowlist, n as buildCrossContextDecoration, o as resolveEffectiveMessageToolsConfig, r as enforceCrossContextPolicy, s as shouldApplyCrossContextMarker, t as applyCrossContextDecoration } from "./outbound-policy-DIF7S8WA.mjs";
import { i as isMessagingToolDeliveryAction } from "./embedded-agent-messaging-D4Zw3sB3.mjs";
import { r as resolveOutboundMediaMaxBytes } from "./configured-max-bytes-Cf0SSUBz.mjs";
import { f as isChannelPartialDeliveryError } from "./live-CJusMVR5.mjs";
import { n as resolveOutboundAttachmentFromUrl } from "./outbound-attachment-CkZRbKkg.mjs";
import { t as readBooleanParam } from "./boolean-param-DmR0WqRm.mjs";
import { _ as parseJsonMessageParam, b as hasPotentialPluginActionParam, d as collectActionMediaSourceHints, f as collectAttachmentSources, g as parseInteractiveParam, h as normalizeSandboxMediaSource, i as actionRequiresTarget, l as prepareExternalMessageActionTargetForResolution, m as normalizeSandboxMediaParams, n as resolveImplicitMessageActionTarget, o as dispatchChannelMessageAction, p as hydrateAttachmentParamsForAction, t as normalizeMessageActionInput, u as shouldDeferExternalMessageActionTargetResolution, v as resolveAttachmentMediaPolicy, y as resolveExtraActionMediaSourceParamKeys } from "./message-action-normalization-BV8cl6P0.mjs";
import { a as pluginEnvelopeHas, o as projectEmbeddedMessageDeliveryFact, s as projectPluginMessageDeliveryFact } from "./embedded-agent-message-delivery-BkG-vmHL.mjs";
import { i as isDeliveredCurrentSourceReplyAsync, n as cancelTerminalSourceReplyDelivery, o as reconcileTerminalSourceReplyDelivery, t as beginTerminalSourceReplyDelivery } from "./source-reply-mirror-BVzhleac.mjs";
import { t as normalizeConversationReadInvocationOrigin } from "./conversation-read-origin-E3olMOwo.mjs";
import { r as resolvePollMaxSelections } from "./polls-C-v11_tu.mjs";
import { n as listConfiguredMessageChannels, r as resolveMessageChannelSelection } from "./channel-selection-DMoOHJCh.mjs";
import { n as sendPoll, r as resolveOutboundMessageGatewayOptions, t as sendMessage } from "./message-Bist4AXY.mjs";
import { i as resolveChannelDefaultAccountId } from "./helpers-t_ym8v5h.mjs";
import { r as validateExplicitMessageAccountSelection } from "./message-account-selection-CUe0piJd.mjs";
import { a as resolveOutboundSessionRoute, r as ensureOutboundSessionEntry } from "./outbound-session-kP4MplS_.mjs";
import { t as extractToolPayload } from "./tool-payload-C3fv8w4C.mjs";
import { n as resolveMessageActionOutcome } from "./message-action-contracts-B8BlEOFc.mjs";
import { n as readClawHubRecommendations, t as CLAWHUB_RECOMMENDATIONS_CHANNEL_DATA_KEY } from "./clawhub-recommendations-Da9BiasP.mjs";
import { t as shouldUseInternalSourceReplySink } from "./internal-source-reply-R34TAD7p.mjs";
import { t as resolveFirstBoundAccountId } from "./bound-account-read-POAubLd3.mjs";
import { t as stripFormattedReasoningMessage } from "./formatted-reasoning-message-CyXwargt.mjs";
import path from "node:path";
//#region src/infra/outbound/message-action-result-acceptance.ts
function hasAcceptedMessageActionResult(result, acceptOwnerConfirmedMutation = false) {
	if (result.kind === "broadcast" || result.dryRun || !isMessagingToolDeliveryAction("message", { action: result.action })) return false;
	const values = [result.payload, result.toolResult];
	const envelopes = values.map(projectPluginMessageDeliveryFact);
	const delivery = projectEmbeddedMessageDeliveryFact(result, true);
	if (delivery?.status === "dryRun" || envelopes.some((envelope) => envelope?.status === "dryRun")) return false;
	if (!resolveMessageActionOutcome(result).ok) return delivery?.partialDelivery || envelopes.some((envelope) => envelope?.partialDelivery);
	if (values.some((value) => pluginEnvelopeHas(value, "failure")) || envelopes.some((envelope) => envelope && (envelope.status !== "settled" || envelope.partialDelivery)) || result.handledBy === "plugin" && !pluginEnvelopeHas(result.payload, "ok")) return false;
	const ownerConfirmedMutation = acceptOwnerConfirmedMutation && result.kind === "action" && result.handledBy === "plugin" && pluginEnvelopeHas(result.payload, "ok");
	return delivery?.status === "settled" && !delivery.partialDelivery && (result.kind === "send" && result.handledBy === "core" && result.sendResult?.deliveryStatus === "sent" || delivery.primaryPlatformMessageId && delivery.primaryPlatformMessageId.toLowerCase() !== "unknown" || ownerConfirmedMutation);
}
async function annotateSourceDelivery(result, ctx, replyToIsExplicit) {
	const authorization = ctx.input.messageActionAuthorization;
	if (result.kind === "broadcast" || !authorization?.toolContext) return result;
	const mirrorParams = {
		action: result.action,
		channel: ctx.channel,
		actionParams: ctx.params,
		cfg: ctx.cfg,
		accountId: ctx.accountId,
		currentAccountId: authorization.requesterAccountId ?? ctx.input.defaultAccountId,
		sessionKey: ctx.input.sessionKey,
		sessionId: ctx.input.sessionId,
		agentId: ctx.agentId,
		toolContext: authorization.toolContext,
		deliveredPayload: result.payload,
		replyToIsExplicit
	};
	let matches;
	try {
		throwIfAborted(ctx.abortSignal);
		ctx.input.assertDirectAdapterHandoff?.();
		matches = await isDeliveredCurrentSourceReplyAsync(mirrorParams);
		throwIfAborted(ctx.abortSignal);
		ctx.input.assertDirectAdapterHandoff?.();
	} catch (error) {
		if (hasAcceptedMessageActionResult(result, authorization.scheduled !== void 0)) return result;
		throw error;
	}
	if (!matches) return result;
	const payload = asOptionalRecord(result.payload);
	const details = asOptionalRecord(result.toolResult?.details);
	return {
		...result,
		payload: payload ? {
			...payload,
			sourceReplyRoute: "current-source"
		} : result.payload,
		...result.toolResult ? { toolResult: {
			...result.toolResult,
			details: {
				...details,
				sourceReplyRoute: "current-source"
			}
		} } : {}
	};
}
//#endregion
//#region src/infra/outbound/message-action-threading.ts
function suppressesImplicitThreading(actionParams) {
	return actionParams.topLevel === true || actionParams.threadId === null;
}
/** Resolves and writes the outbound thread id used by message-action sends. */
function resolveAndApplyOutboundThreadId(actionParams, context) {
	const threadId = readToolStringParam(actionParams, "threadId");
	if (!threadId && suppressesImplicitThreading(actionParams)) return;
	const replyToId = readToolStringParam(actionParams, "replyTo");
	const autoResolvedThreadId = threadId ? void 0 : context.resolveAutoThreadId?.({
		cfg: context.cfg,
		accountId: context.accountId,
		to: context.to,
		toolContext: context.toolContext,
		replyToId: context.replyToIsExplicit === false ? void 0 : replyToId
	});
	const resolvedThreadId = threadId ?? autoResolvedThreadId;
	if (autoResolvedThreadId && !actionParams.threadId) actionParams.threadId = autoResolvedThreadId;
	if (replyToId && resolvedThreadId) {
		const canonicalReplyToId = context.resolveReplyTransport?.({
			cfg: context.cfg,
			accountId: context.accountId,
			threadId: resolvedThreadId,
			replyToId,
			replyToIsExplicit: context.replyToIsExplicit
		})?.replyToId;
		if (canonicalReplyToId && replyToId !== canonicalReplyToId) actionParams.replyTo = canonicalReplyToId;
	}
	return resolvedThreadId ?? void 0;
}
function isSameConversationTarget(actionParams, channel, toolContext, matchesToolContextTarget) {
	const currentChannelId = toolContext?.currentChannelId?.trim();
	const currentMessagingTarget = toolContext?.currentMessagingTarget?.trim();
	if (!currentChannelId && !currentMessagingTarget) return false;
	const currentChannelProvider = toolContext?.currentChannelProvider?.trim();
	if (currentChannelProvider && currentChannelProvider !== channel) return false;
	const explicitTarget = readToolStringParam(actionParams, "target") ?? readToolStringParam(actionParams, "to") ?? readToolStringParam(actionParams, "channelId");
	if (!explicitTarget) return true;
	const target = explicitTarget.trim();
	if (toolContext && matchesToolContextTarget?.({
		target,
		toolContext
	})) return true;
	return target === currentMessagingTarget || target === currentChannelId;
}
/** Resolves and writes reply-to metadata for same-conversation message-action sends. */
function resolveAndApplyOutboundReplyToId(actionParams, context) {
	const explicitReplyToId = readToolStringParam(actionParams, "replyTo");
	const configuredMode = context.toolContext?.replyToMode ?? "off";
	const mode = configuredMode === "batched" ? "first" : configuredMode;
	if (explicitReplyToId) {
		if (mode === "first") {
			const hasRepliedRef = context.toolContext?.hasRepliedRef;
			if (hasRepliedRef) hasRepliedRef.value = true;
		}
		return {
			replyToId: explicitReplyToId,
			source: "explicit"
		};
	}
	if (suppressesImplicitThreading(actionParams)) return;
	if (!isSameConversationTarget(actionParams, context.channel, context.toolContext, context.matchesToolContextTarget)) return;
	const currentMessageId = context.toolContext?.currentMessageId;
	if (currentMessageId == null) return;
	if (mode === "off") return;
	if (mode === "first") {
		const hasRepliedRef = context.toolContext?.hasRepliedRef;
		if (hasRepliedRef?.value) return;
		if (hasRepliedRef) hasRepliedRef.value = true;
	}
	const resolvedReplyToId = typeof currentMessageId === "number" ? String(currentMessageId) : currentMessageId.trim();
	if (!resolvedReplyToId) return;
	actionParams.replyTo = resolvedReplyToId;
	return {
		replyToId: resolvedReplyToId,
		source: "implicit",
		mode
	};
}
/** Prepares outbound session mirroring metadata for message-action sends. */
async function prepareOutboundMirrorRoute(params) {
	const resolvedThreadId = resolveAndApplyOutboundThreadId(params.actionParams, {
		cfg: params.cfg,
		to: params.to,
		accountId: params.accountId,
		toolContext: params.toolContext,
		resolveAutoThreadId: params.resolveAutoThreadId,
		resolveReplyTransport: params.resolveReplyTransport,
		replyToIsExplicit: params.replyToIsExplicit
	});
	const replyToId = readToolStringParam(params.actionParams, "replyTo");
	const outboundRoute = params.agentId && !params.dryRun ? await params.resolveOutboundSessionRoute({
		cfg: params.cfg,
		channel: params.channel,
		agentId: params.agentId,
		accountId: params.accountId,
		target: params.to,
		currentSessionKey: params.currentSessionKey,
		resolvedTarget: params.resolvedTarget,
		replyToId,
		threadId: resolvedThreadId
	}) : null;
	if (outboundRoute && !params.dryRun) params.actionParams["__sessionKey"] = outboundRoute.sessionKey;
	if (params.agentId) params.actionParams["__agentId"] = params.agentId;
	return {
		resolvedThreadId,
		outboundRoute
	};
}
//#endregion
//#region src/infra/outbound/outbound-send-service.ts
const log$1 = createSubsystemLogger("outbound/send-service");
function materializeMessagePresentationFallback(params) {
	const presentation = normalizeMessagePresentation(params.payload.presentation);
	const text = (params.text ?? params.payload.text ?? "").trim();
	if (!presentation) return text;
	const fallback = renderMessagePresentationFallbackText({ presentation });
	if (!fallback || text.includes(fallback)) return text;
	return [text, fallback].filter(Boolean).join("\n\n");
}
function hasCorePresentationDelivery(outbound) {
	return Boolean(outbound?.sendPayload || outbound?.sendText || outbound?.sendFormattedText);
}
async function sendCoreMessage(params) {
	const deliveredPayloads = [];
	const result = await sendMessage({
		cfg: params.ctx.cfg,
		to: params.to,
		content: params.message,
		...params.payloads ? { payloads: params.payloads } : {},
		agentId: params.ctx.agentId,
		requesterSessionKey: params.ctx.input.sessionKey,
		requesterAccountId: params.ctx.input.requesterAccountId ?? params.ctx.accountId ?? void 0,
		requesterSenderId: params.ctx.input.requesterSenderId ?? void 0,
		requesterSenderName: params.ctx.input.requesterSenderName ?? void 0,
		requesterSenderUsername: params.ctx.input.requesterSenderUsername ?? void 0,
		requesterSenderE164: params.ctx.input.requesterSenderE164 ?? void 0,
		mediaUrl: params.mediaUrl || void 0,
		mediaUrls: params.mediaUrls,
		buffer: params.buffer,
		filename: params.filename,
		contentType: params.contentType,
		asVoice: params.asVoice,
		channel: params.ctx.channel || void 0,
		accountId: params.ctx.accountId ?? void 0,
		conversationType: params.ctx.conversationType,
		conversationReadOrigin: normalizeConversationReadInvocationOrigin(params.ctx.input.conversationReadOrigin),
		reply: params.reply,
		threadId: params.threadId,
		gifPlayback: params.gifPlayback,
		forceDocument: params.forceDocument,
		dryRun: params.ctx.dryRun,
		bestEffort: params.bestEffort ?? void 0,
		queuePolicy: params.queuePolicy,
		deps: params.ctx.input.deps,
		gateway: params.ctx.gateway,
		idempotencyKey: params.ctx.idempotencyKey,
		runId: params.ctx.input.runId,
		executionIdentityToken: params.ctx.input.executionIdentityToken,
		mirror: params.ctx.mirror,
		abortSignal: params.ctx.abortSignal,
		silent: params.ctx.silent,
		mediaAccess: params.ctx.mediaAccess,
		preparedMessageId: params.ctx.input.preparedMessageId,
		preparedPlugin: params.ctx.channelPlugin,
		gatewayOwnedDelivery: params.ctx.input.gatewayOwnedDelivery,
		deliveryIntentId: params.ctx.input.deliveryIntentId,
		deliveryCompletion: params.ctx.input.deliveryCompletion,
		conversationDeliveryTarget: params.ctx.input.conversationDeliveryTarget,
		deliveryRetryOwner: params.ctx.deliveryRetryOwner,
		requireUnknownSendReconciliation: params.ctx.input.requireQueuePersistence ? false : void 0,
		onDeliveryIntent: params.ctx.input.onDeliveryIntent,
		onDeliveryAttempt: params.ctx.input.onDeliveryAttempt,
		onDeliveryResult: async (evidence) => {
			await params.ctx.onSendAccepted?.();
			await params.ctx.input.onDeliveryResult?.(evidence);
		},
		onPlatformSendDispatch: params.ctx.input.onPlatformSendDispatch,
		assertDirectAdapterHandoff: params.ctx.input.assertDirectAdapterHandoff,
		skipQueue: params.ctx.input.skipQueue,
		onDeliveredPayload: (payload) => deliveredPayloads.push(payload)
	});
	const deliveredText = result.deliveryStatus === "sent" && deliveredPayloads.every((payload) => payload.mediaUrls.length === 0 && payload.audioAsVoice !== true) ? deliveredPayloads.map((payload) => payload.text).filter((text) => text.trim()).join("\n") : "";
	return {
		result,
		...deliveredText ? { deliveredText } : {}
	};
}
async function tryHandleWithPluginAction(params) {
	if (params.ctx.dryRun) return null;
	const mediaAccess = resolveAgentScopedOutboundMediaAccess({
		cfg: params.ctx.cfg,
		agentId: params.ctx.agentId ?? params.ctx.mirror?.agentId,
		mediaSources: collectActionMediaSourceHints(params.ctx.params, void 0, { structuredAttachments: params.action === "send" ? "all" : void 0 }),
		sessionKey: params.ctx.input.sessionKey,
		messageProvider: params.ctx.input.sessionKey ? void 0 : params.ctx.channel,
		accountId: (params.ctx.input.sessionKey ? params.ctx.input.requesterAccountId ?? params.ctx.accountId : params.ctx.accountId) ?? void 0,
		requesterSenderId: params.ctx.input.requesterSenderId ?? void 0,
		requesterSenderName: params.ctx.input.requesterSenderName ?? void 0,
		requesterSenderUsername: params.ctx.input.requesterSenderUsername ?? void 0,
		requesterSenderE164: params.ctx.input.requesterSenderE164 ?? void 0,
		mediaAccess: params.ctx.mediaAccess
	});
	const handled = await dispatchChannelMessageAction(createChannelActionContext({
		ctx: params.ctx,
		action: params.action,
		mediaAccess,
		reply: params.reply
	}));
	if (!handled) return null;
	const deliveryFact = projectPluginMessageDeliveryFact(handled);
	if (!deliveryFact || deliveryFact.status === "settled") await params.onHandled?.({ partialDelivery: deliveryFact?.partialDelivery === true });
	return {
		handledBy: "plugin",
		payload: extractToolPayload(handled),
		toolResult: handled
	};
}
function createChannelActionContext(params) {
	const mediaAccess = params.mediaAccess ?? params.ctx.mediaAccess;
	return {
		channel: params.ctx.channel,
		action: params.action,
		cfg: params.ctx.cfg,
		params: params.ctx.params,
		...params.reply ? { reply: params.reply } : {},
		...mediaAccess ? { mediaAccess } : {},
		mediaLocalRoots: mediaAccess?.localRoots,
		mediaReadFile: mediaAccess?.readFile,
		accountId: params.ctx.accountId ?? void 0,
		requesterAccountId: params.ctx.input.requesterAccountId ?? void 0,
		requesterSenderId: params.ctx.input.requesterSenderId ?? void 0,
		senderIsOwner: params.ctx.input.senderIsOwner,
		conversationReadOrigin: normalizeConversationReadInvocationOrigin(params.ctx.input.conversationReadOrigin),
		sessionKey: params.ctx.input.sessionKey,
		sessionId: params.ctx.input.sessionId,
		inboundEventKind: params.ctx.input.inboundEventKind,
		agentId: params.ctx.agentId,
		gateway: params.ctx.gateway,
		toolContext: params.ctx.input.toolContext,
		dryRun: params.ctx.dryRun,
		onPlatformSendDispatch: params.ctx.input.onPlatformSendDispatch,
		assertDirectAdapterHandoff: params.ctx.input.assertDirectAdapterHandoff,
		...params.action === "send" ? { skipQueue: params.ctx.input.skipQueue } : {}
	};
}
async function preparePluginSendPayload(params) {
	const plugin = params.ctx.channelPlugin;
	if (!plugin?.outbound) return { kind: "unavailable" };
	const prepareSendPayload = plugin?.actions?.prepareSendPayload;
	if (!prepareSendPayload) return { kind: "unavailable" };
	const payload = await prepareSendPayload({
		ctx: createChannelActionContext({
			ctx: params.ctx,
			action: "send",
			reply: params.reply
		}),
		to: params.to,
		payload: params.payload,
		replyToId: params.reply?.replyToId,
		replyToIdSource: params.reply?.source,
		threadId: params.threadId
	});
	return payload ? {
		kind: "prepared",
		payload
	} : { kind: "declined" };
}
/** Executes a message-tool send through plugin handlers or the core outbound path. */
async function executeSendAction(params) {
	throwIfAborted(params.ctx.abortSignal);
	const defaultPayload = params.payload ?? {
		text: params.message,
		mediaUrl: params.mediaUrl,
		mediaUrls: params.mediaUrls,
		audioAsVoice: params.asVoice === true
	};
	const queuePolicy = params.bestEffort === false || params.ctx.input.requireQueuePersistence ? "required" : "best_effort";
	const requiresCoreDelivery = params.ctx.input.forceCoreDelivery === true || params.ctx.input.requireQueuePersistence === true;
	const pluginPreparation = requiresCoreDelivery ? { kind: "unavailable" } : await preparePluginSendPayload({
		ctx: params.ctx,
		to: params.to,
		payload: defaultPayload,
		reply: params.reply,
		threadId: params.threadId
	});
	const channelPlugin = params.ctx.channelPlugin;
	const presentation = normalizeMessagePresentation(defaultPayload.presentation);
	const corePayload = requiresCoreDelivery ? defaultPayload : pluginPreparation.kind === "prepared" ? pluginPreparation.payload : pluginPreparation.kind === "unavailable" && presentation && hasCorePresentationDelivery(channelPlugin?.outbound) ? defaultPayload : null;
	if (!corePayload) {
		const pluginMessage = presentation ? materializeMessagePresentationFallback({
			payload: defaultPayload,
			text: params.message
		}) : params.message;
		const pluginCtx = pluginMessage === params.message ? params.ctx : {
			...params.ctx,
			params: {
				...params.ctx.params,
				message: pluginMessage
			}
		};
		let pluginHandled;
		try {
			pluginHandled = await tryHandleWithPluginAction({
				ctx: pluginCtx,
				action: "send",
				reply: params.reply,
				onHandled: async ({ partialDelivery }) => {
					await params.ctx.onSendAccepted?.();
					if (partialDelivery || !params.ctx.mirror) return;
					const mirrorText = pluginMessage !== params.message ? pluginMessage : params.ctx.mirror.text?.trim() || pluginMessage;
					const mirrorMediaUrls = params.ctx.mirror.mediaUrls ?? params.mediaUrls ?? (params.mediaUrl ? [params.mediaUrl] : void 0);
					try {
						const writerFence = getOwnedSessionTranscriptWriterFence({ sessionKey: params.ctx.mirror.sessionKey });
						const mirrorResult = await appendAssistantMessageToSessionTranscript({
							agentId: params.ctx.mirror.agentId,
							sessionKey: params.ctx.mirror.sessionKey,
							expectedSessionId: params.ctx.mirror.expectedSessionId,
							...writerFence?.expectedLifecycleRevision !== void 0 ? { expectedLifecycleRevision: writerFence.expectedLifecycleRevision } : {},
							...writerFence ? { expectedWriterRunId: writerFence.expectedWriterRunId } : {},
							text: mirrorText,
							mediaUrls: mirrorMediaUrls,
							idempotencyKey: params.ctx.mirror.idempotencyKey,
							deliveryMirror: params.ctx.mirror.deliveryMirror,
							config: params.ctx.cfg
						});
						if (!mirrorResult.ok) log$1.warn(`failed to mirror plugin-handled delivery; channel send already succeeded: ${mirrorResult.reason}`);
					} catch (error) {
						log$1.warn(`failed to mirror plugin-handled delivery; channel send already succeeded: ${formatErrorMessage(error)}`);
					}
				}
			});
		} catch (error) {
			if (isChannelPartialDeliveryError(error)) await params.ctx.onSendAccepted?.();
			throw error;
		}
		if (pluginHandled) return pluginHandled;
	}
	throwIfAborted(params.ctx.abortSignal);
	const message = corePayload && normalizeMessagePresentation(corePayload.presentation) && channelPlugin?.outbound?.deliveryMode === "gateway" ? materializeMessagePresentationFallback({
		payload: corePayload,
		text: params.message
	}) : params.message;
	const delivery = await sendCoreMessage({
		...params,
		message,
		...corePayload ? { payloads: [corePayload] } : {},
		queuePolicy
	});
	return {
		handledBy: "core",
		payload: delivery.result,
		...delivery.deliveredText ? { deliveredText: delivery.deliveredText } : {},
		sendResult: delivery.result
	};
}
/** Executes a message-tool poll through plugin handlers or the core poll path. */
async function executePollAction(params) {
	const pluginHandled = await tryHandleWithPluginAction({
		ctx: params.ctx,
		action: "poll"
	});
	if (pluginHandled) return pluginHandled;
	const corePoll = params.resolveCorePoll();
	const result = await sendPoll({
		cfg: params.ctx.cfg,
		to: corePoll.to,
		question: corePoll.question,
		content: corePoll.content,
		options: corePoll.options,
		maxSelections: corePoll.maxSelections,
		durationSeconds: corePoll.durationSeconds ?? void 0,
		durationHours: corePoll.durationHours ?? void 0,
		channel: params.ctx.channel,
		accountId: params.ctx.accountId ?? void 0,
		threadId: corePoll.threadId ?? void 0,
		silent: params.ctx.silent ?? void 0,
		isAnonymous: corePoll.isAnonymous ?? void 0,
		dryRun: params.ctx.dryRun,
		gateway: params.ctx.gateway,
		idempotencyKey: params.ctx.idempotencyKey,
		preparedPlugin: params.ctx.channelPlugin,
		gatewayOwnedDelivery: params.ctx.input.gatewayOwnedDelivery,
		sessionKey: params.ctx.input.sessionKey,
		inboundEventKind: params.ctx.input.inboundEventKind,
		onPlatformSendDispatch: params.ctx.input.onPlatformSendDispatch,
		assertDirectAdapterHandoff: params.ctx.input.assertDirectAdapterHandoff
	});
	return {
		handledBy: "core",
		payload: result,
		pollResult: result
	};
}
//#endregion
//#region src/infra/outbound/message-action-execution.ts
const log = createSubsystemLogger("outbound/message-action");
const loadMessageActionGatewayRuntime = createLazyRuntimeModule(() => import("./message.gateway.runtime.js"));
const MESSAGE_ACTION_RECONCILIATION_TIMEOUT_MS = 6e4;
const MESSAGE_ACTION_RECONCILIATION_MAX_MS = 54e4;
const MESSAGE_ACTION_INITIAL_SEND_TIMEOUT_MAX_MS = 3e4;
async function callGatewayMessageAction(params) {
	const { callGatewayLeastPrivilege, isGatewayTransportError } = await loadMessageActionGatewayRuntime();
	const gateway = resolveOutboundMessageGatewayOptions(params.gateway);
	const timeoutMs = params.actionParams.action === "send" ? Math.min(gateway.timeoutMs, MESSAGE_ACTION_INITIAL_SEND_TIMEOUT_MAX_MS) : gateway.timeoutMs;
	const call = {
		...gateway,
		method: "message.action",
		params: params.actionParams,
		timeoutMs,
		signal: params.abortSignal,
		agentRuntimeIdentityToken: params.agentRuntimeIdentityToken
	};
	const request = (options) => params.gateway?.request ? params.gateway.request(options, params.requestContext) : callGatewayLeastPrivilege(options);
	try {
		return await request(call);
	} catch (error) {
		if (!(isGatewayTransportError(error) && error.kind === "timeout" || error instanceof GatewayProtocolRequestTimeoutError && error.requestSent) || params.actionParams.action !== "send") throw error;
		params.onUnknownDeliveryOutcome?.();
		throwIfAborted(params.abortSignal);
	}
	const reconciliationSignal = params.abortSignal ? AbortSignal.any([params.abortSignal, AbortSignal.timeout(MESSAGE_ACTION_RECONCILIATION_MAX_MS)]) : void 0;
	return await request({
		...call,
		timeoutMs: params.abortSignal ? null : Math.max(call.timeoutMs, MESSAGE_ACTION_RECONCILIATION_TIMEOUT_MS),
		signal: reconciliationSignal
	});
}
function isConfirmedGatewayMessageActionRejection(error) {
	if (!(error instanceof Error) || error.name !== "GatewayClientRequestError") return false;
	const requestError = error;
	if (typeof requestError.gatewayCode !== "string" || requestError.gatewayCode.length === 0) return false;
	if (requestError.gatewayCode !== ErrorCodes.UNAVAILABLE) return true;
	const details = requestError.details;
	return details !== null && typeof details === "object" && details.method === "message.action";
}
function projectMessageActionPartialDelivery(error) {
	const directDelivery = isChannelPartialDeliveryError(error) ? error.deliveryResult : void 0;
	const gatewayDelivery = error instanceof Error && error.name === "GatewayClientRequestError" ? asOptionalRecord(asOptionalRecord(error)?.details)?.partialDelivery : void 0;
	const deliveryResult = directDelivery ?? gatewayDelivery;
	return deliveryResult === void 0 ? void 0 : {
		ok: false,
		deliveryStatus: "partial_failed",
		sentBeforeError: true,
		error: formatErrorMessage(error),
		result: deliveryResult
	};
}
function projectGatewayQueuedDeliveryResult(error) {
	if (!(error instanceof Error) || error.name !== "GatewayClientRequestError") return;
	if (asOptionalRecord(asOptionalRecord(error)?.details)?.code !== GatewayErrorDetailCodes.OUTBOUND_DELIVERY_QUEUED) return;
	return {
		status: "delivery_queued",
		delivered: false,
		message: `Delivery is pending: ${error.message}. The gateway owns retry or reconciliation; delivery is not yet confirmed. Do not resend it.`
	};
}
async function resolveGatewayActionIdempotencyKey(idempotencyKey) {
	if (idempotencyKey) return idempotencyKey;
	const { randomIdempotencyKey } = await loadMessageActionGatewayRuntime();
	return randomIdempotencyKey();
}
function applyCrossContextMessageDecoration({ params, message, decoration, preferPresentation }) {
	const applied = applyCrossContextDecoration({
		message,
		decoration,
		preferPresentation
	});
	params.message = applied.message;
	if (applied.presentation) {
		const existing = normalizeMessagePresentation(params.presentation);
		params.presentation = existing ? {
			...existing,
			blocks: [...applied.presentation.blocks, ...existing.blocks]
		} : applied.presentation;
	}
	return applied.message;
}
async function applyMessageCrossContextMarker(params) {
	if (!shouldApplyCrossContextMarker(params.action) || !params.toolContext) return params.message;
	const decoration = await buildCrossContextDecoration({
		cfg: params.cfg,
		channel: params.channel,
		target: params.target,
		toolContext: params.toolContext,
		accountId: params.accountId ?? void 0,
		agentId: params.agentId ?? void 0
	});
	if (!decoration) return params.message;
	return applyCrossContextMessageDecoration({
		params: params.args,
		message: params.message,
		decoration,
		preferPresentation: params.preferPresentation
	});
}
async function executeGatewayAction(ctx, params) {
	if (ctx.dryRun || !ctx.gateway) return null;
	const channelPlugin = ctx.channelPlugin;
	const supportsCanonicalGatewayDelivery = Boolean(ctx.input.messageActionAuthorization?.scheduled && ctx.gateway.request) && channelPlugin?.outbound?.deliveryMode === "gateway" && (params.action === "send" && Boolean(channelPlugin.message?.send?.text || channelPlugin.outbound.sendText) || params.action === "poll" && Boolean(channelPlugin.outbound.sendPoll)) && (!channelPlugin.actions?.handleAction || channelPlugin.actions.supportsAction?.({ action: params.action }) === false);
	if (!channelPlugin?.actions?.handleAction && !supportsCanonicalGatewayDelivery) return null;
	if ((channelPlugin.actions?.resolveExecutionMode?.({ action: params.action }) ?? "local") !== "gateway" && !supportsCanonicalGatewayDelivery) return null;
	const conversationReadOrigin = normalizeConversationReadInvocationOrigin(ctx.input.conversationReadOrigin);
	const idempotencyKey = await resolveGatewayActionIdempotencyKey(normalizeOptionalString(ctx.params.idempotencyKey));
	const callerOwnsTerminalReceipt = ctx.gateway.terminalSourceReplyReceiptOwner === "caller" && ctx.input.sourceReplyFinal === true;
	const requestContext = {
		sourceReplyFinal: ctx.input.sourceReplyFinal,
		sourceReplyToolCallId: ctx.input.sourceReplyToolCallId
	};
	const agentRuntimeIdentityToken = ctx.gateway.request ? void 0 : await ctx.gateway.resolveAgentRuntimeIdentityToken?.(requestContext);
	const sourceReplyMirror = {
		action: params.action,
		channel: ctx.channel,
		actionParams: ctx.params,
		cfg: ctx.cfg,
		accountId: ctx.accountId,
		currentAccountId: ctx.input.messageActionAuthorization?.requesterAccountId ?? ctx.input.defaultAccountId,
		sessionKey: ctx.input.sourceReplySessionKey ?? ctx.input.sessionKey,
		sessionId: ctx.input.sessionId,
		agentId: ctx.agentId,
		toolContext: ctx.input.messageActionAuthorization?.toolContext,
		replyToIsExplicit: params.reply?.source === "explicit",
		idempotencyKey,
		sourceReplyFinal: ctx.input.sourceReplyFinal,
		toolCallId: ctx.input.sourceReplyToolCallId
	};
	const terminalDeliveryStart = callerOwnsTerminalReceipt ? await beginTerminalSourceReplyDelivery(sourceReplyMirror) : void 0;
	if (terminalDeliveryStart && "outcome" in terminalDeliveryStart) return params.result(terminalDeliveryStart.result);
	const terminalDeliveryReceipt = terminalDeliveryStart;
	let hadUnknownDeliveryOutcome = false;
	let payload;
	try {
		assertOutboundHandoffCurrent(ctx.input.assertDirectAdapterHandoff);
		payload = await callGatewayMessageAction({
			gateway: ctx.gateway,
			abortSignal: ctx.input.abortSignal,
			agentRuntimeIdentityToken,
			requestContext,
			onUnknownDeliveryOutcome: () => {
				hadUnknownDeliveryOutcome = true;
			},
			actionParams: {
				channel: ctx.channel,
				action: params.action,
				params: ctx.params,
				...params.reply ? { reply: params.reply } : {},
				accountId: ctx.accountId ?? void 0,
				senderIsOwner: ctx.input.senderIsOwner,
				sessionKey: ctx.input.sessionKey,
				sessionId: ctx.input.sessionId,
				inboundTurnKind: ctx.input.inboundEventKind,
				agentId: ctx.agentId,
				...conversationReadOrigin === "direct-operator" ? { conversationReadOrigin } : {},
				idempotencyKey
			}
		});
	} catch (error) {
		const partialDelivery = ctx.input.messageActionAuthorization?.scheduled ? projectMessageActionPartialDelivery(error) : void 0;
		if (partialDelivery !== void 0) payload = partialDelivery;
		else {
			if (callerOwnsTerminalReceipt && !hadUnknownDeliveryOutcome && (error instanceof OutboundHandoffRejectedError || isConfirmedGatewayMessageActionRejection(error))) await cancelTerminalSourceReplyDelivery(terminalDeliveryReceipt);
			throw error;
		}
	}
	if (callerOwnsTerminalReceipt) try {
		await reconcileTerminalSourceReplyDelivery({
			deliveredPayload: payload,
			mirror: sourceReplyMirror,
			receipt: terminalDeliveryReceipt,
			...hadUnknownDeliveryOutcome ? { preservePendingOnExplicitFailure: true } : {}
		});
	} catch (error) {
		log.warn("Terminal source reply receipt reconciliation failed.", {
			channel: ctx.channel,
			sessionKey: ctx.input.sessionKey,
			error: formatErrorMessage(error)
		});
	}
	const result = params.result(payload);
	if (!supportsCanonicalGatewayDelivery) return result;
	const partialDelivery = asOptionalRecord(payload)?.deliveryStatus === "partial_failed";
	if (result.kind === "send") return {
		...result,
		handledBy: "core",
		...partialDelivery ? {} : { sendResult: payload }
	};
	if (result.kind === "poll") return {
		...result,
		handledBy: "core",
		...partialDelivery ? {} : { pollResult: payload }
	};
	return result;
}
async function executeMessagePoll(ctx) {
	const { cfg, params, channel, channelPlugin, accountId, dryRun, input, agentId, abortSignal } = ctx;
	throwIfAborted(abortSignal);
	const action = "poll";
	const to = readToolStringParam(params, "to", { required: true });
	const silent = readBooleanParam(params, "silent");
	const resolvedThreadId = resolveAndApplyOutboundThreadId(params, {
		cfg,
		to,
		accountId,
		toolContext: input.toolContext,
		resolveAutoThreadId: channelPlugin?.threading?.resolveAutoThreadId
	});
	const base = typeof params.message === "string" ? params.message : "";
	await applyMessageCrossContextMarker({
		cfg,
		channel,
		action,
		target: to,
		toolContext: input.toolContext,
		accountId,
		agentId,
		args: params,
		message: base,
		preferPresentation: false
	});
	const gatewayPluginAction = await executeGatewayAction(ctx, {
		action,
		result: (payload) => ({
			kind: "poll",
			channel,
			action,
			to,
			handledBy: "plugin",
			payload,
			dryRun
		})
	});
	const pollReplyToIsExplicit = Boolean(readToolStringParam(params, "replyTo"));
	if (gatewayPluginAction) return await annotateSourceDelivery(gatewayPluginAction, ctx, pollReplyToIsExplicit);
	const poll = await executePollAction({
		ctx: {
			...ctx,
			mediaAccess: void 0,
			input: {
				cfg,
				action,
				params,
				requesterAccountId: input.requesterAccountId,
				requesterSenderId: input.requesterSenderId,
				conversationReadOrigin: input.conversationReadOrigin,
				sessionKey: input.sessionKey,
				sessionId: input.sessionId,
				inboundEventKind: input.inboundEventKind,
				toolContext: input.toolContext,
				messageActionAuthorization: input.messageActionAuthorization,
				gatewayOwnedDelivery: input.gatewayOwnedDelivery,
				onPlatformSendDispatch: input.onPlatformSendDispatch,
				assertDirectAdapterHandoff: input.assertDirectAdapterHandoff
			},
			silent: silent ?? void 0
		},
		resolveCorePoll: () => {
			const question = readToolStringParam(params, "pollQuestion", { required: true });
			const options = readStringArrayParam(params, "pollOption", { required: true });
			if (options.length < 2) throw new Error("pollOption requires at least two values");
			let content = readToolStringParam(params, "message", {
				allowEmpty: true,
				trim: false
			});
			if (content !== void 0 && !content.trim()) content = "";
			const allowMultiselect = readBooleanParam(params, "pollMulti") ?? false;
			const durationHours = readPositiveIntegerParam(params, "pollDurationHours", { message: "pollDurationHours must be a positive integer" });
			return {
				to,
				question,
				content,
				options,
				maxSelections: resolvePollMaxSelections(options.length, allowMultiselect),
				durationHours: durationHours ?? void 0,
				threadId: resolvedThreadId ?? void 0
			};
		}
	});
	return await annotateSourceDelivery({
		kind: "poll",
		channel,
		action,
		to,
		handledBy: poll.handledBy,
		payload: poll.payload,
		toolResult: poll.toolResult,
		pollResult: poll.pollResult,
		dryRun
	}, ctx, pollReplyToIsExplicit);
}
async function executeMessagePlugin(ctx) {
	const { cfg, params, channel, channelPlugin, mediaAccess, accountId, dryRun, gateway, input, abortSignal, agentId } = ctx;
	throwIfAborted(abortSignal);
	const action = input.action;
	if (dryRun) return {
		kind: "action",
		channel,
		action,
		handledBy: "dry-run",
		payload: {
			ok: true,
			dryRun: true,
			channel,
			action
		},
		dryRun: true
	};
	if (!channelPlugin?.actions?.handleAction) throw new Error(`Channel ${channel} is unavailable for message actions (plugin not loaded).`);
	const rawActionMessage = params.message;
	if (typeof rawActionMessage === "string" && rawActionMessage) params.message = stripPlainTextToolCallBlocks(stripUnsupportedCitationControlMarkers(rawActionMessage));
	const targetForThreading = normalizeOptionalString(params.to) ?? normalizeOptionalString(params.channelId) ?? "";
	if (targetForThreading && action !== "download-file") resolveAndApplyOutboundThreadId(params, {
		cfg,
		to: targetForThreading,
		accountId,
		toolContext: input.toolContext,
		resolveAutoThreadId: channelPlugin.threading?.resolveAutoThreadId,
		resolveReplyTransport: channelPlugin.threading?.resolveReplyTransport,
		replyToIsExplicit: Boolean(readToolStringParam(params, "replyTo"))
	});
	const gatewayPluginAction = await executeGatewayAction(ctx, {
		action,
		result: (payload) => ({
			kind: "action",
			channel,
			action,
			handledBy: "plugin",
			payload,
			dryRun
		})
	});
	const replyToIsExplicit = Boolean(readToolStringParam(params, "replyTo"));
	if (gatewayPluginAction) return await annotateSourceDelivery(gatewayPluginAction, ctx, replyToIsExplicit);
	const authorization = input.messageActionAuthorization;
	let handled;
	try {
		handled = await dispatchChannelMessageAction({
			channel,
			action,
			cfg,
			params,
			progressSnapshot: input.progressSnapshot,
			mediaAccess,
			mediaLocalRoots: mediaAccess.localRoots,
			mediaReadFile: mediaAccess.readFile,
			accountId: accountId ?? void 0,
			requesterAccountId: authorization !== void 0 ? authorization.requesterAccountId : input.requesterAccountId ?? void 0,
			requesterSenderId: authorization !== void 0 ? authorization.requesterSenderId : input.requesterSenderId ?? void 0,
			senderIsOwner: input.senderIsOwner,
			conversationReadOrigin: normalizeConversationReadInvocationOrigin(input.conversationReadOrigin),
			sessionKey: input.sessionKey,
			sessionId: input.sessionId,
			inboundEventKind: input.inboundEventKind,
			agentId,
			gateway,
			toolContext: authorization !== void 0 ? authorization.toolContext : input.toolContext,
			messageActionAuthorization: authorization,
			deliveryRetryOwner: input.actionOrigin === "message-tool" ? "caller" : void 0,
			assertDirectAdapterHandoff: input.assertDirectAdapterHandoff,
			onPlatformSendDispatch: input.onPlatformSendDispatch,
			skipQueue: input.skipQueue,
			dryRun
		});
	} catch (error) {
		const partialDelivery = input.messageActionAuthorization?.scheduled ? projectMessageActionPartialDelivery(error) : void 0;
		if (partialDelivery) return await annotateSourceDelivery({
			kind: "action",
			channel,
			action,
			handledBy: "plugin",
			payload: partialDelivery,
			dryRun
		}, ctx, replyToIsExplicit);
		throw error;
	}
	if (!handled) throw new Error(`Message action ${action} not supported for channel ${channel}.`);
	return await annotateSourceDelivery({
		kind: "action",
		channel,
		action,
		handledBy: "plugin",
		payload: extractToolPayload(handled),
		toolResult: handled,
		dryRun
	}, ctx, replyToIsExplicit);
}
//#endregion
//#region src/poll-params.ts
const SHARED_POLL_CREATION_PARAM_DEFS = {
	pollQuestion: { kind: "string" },
	pollOption: { kind: "stringArray" },
	pollDurationHours: { kind: "positiveInteger" },
	pollMulti: { kind: "boolean" }
};
const POLL_CREATION_PARAM_DEFS = SHARED_POLL_CREATION_PARAM_DEFS;
const SHARED_POLL_CREATION_PARAM_NAMES = Object.keys(SHARED_POLL_CREATION_PARAM_DEFS);
function readPollParamRaw(params, key) {
	return readSnakeCaseParamRaw(params, key);
}
const CONTENT_BEARING_SHARED_POLL_PARAM_NAMES = ["pollQuestion", "pollOption"];
function hasContentBearingPollCreationParam(params) {
	for (const key of CONTENT_BEARING_SHARED_POLL_PARAM_NAMES) {
		const def = expectDefined(POLL_CREATION_PARAM_DEFS[key], "poll creation param defs entry at key");
		const value = readPollParamRaw(params, key);
		if (def.kind === "string" && typeof value === "string" && value.trim().length > 0) return true;
		if (def.kind === "stringArray") {
			if (Array.isArray(value) && value.some((entry) => typeof entry === "string" && entry.trim())) return true;
			if (typeof value === "string" && value.trim().length > 0) return true;
		}
	}
	return false;
}
function hasPollCreationParams(params) {
	return hasContentBearingPollCreationParam(params);
}
//#endregion
//#region src/infra/outbound/message-action-routing.ts
async function resolveChannel(cfg, params, toolContext, action, agentId) {
	const channel = readToolStringParam(params, "channel");
	const fallbackChannel = action === "read" && channel ? void 0 : toolContext?.currentChannelProvider;
	const selection = await resolveMessageChannelSelection({
		cfg,
		channel,
		fallbackChannel,
		agentId
	});
	if (selection.source === "tool-context-fallback") params.channel = selection.channel;
	return selection;
}
function enforceCrossProviderEgressPolicyBeforeTargetResolution(params) {
	const currentProvider = params.toolContext?.currentChannelProvider;
	if (!currentProvider || currentProvider === params.channel) return;
	enforceCrossContextPolicy(params);
}
function addCandidateAndUnprefixedAlias(candidates, value) {
	const normalized = normalizeOptionalString(value);
	if (!normalized) return;
	candidates.add(normalized);
	const unprefixed = normalized.replace(/^(channel|group|user):/i, "").trim();
	if (unprefixed && unprefixed !== normalized) candidates.add(unprefixed);
}
function normalizeTargetForAccountBinding(channel, target) {
	try {
		return normalizeTargetForProvider(channel, target);
	} catch {
		return;
	}
}
function inferPeerKindForAccountBinding(channel, target, channelPlugin) {
	const inferred = normalizeChatType(channelPlugin?.messaging?.inferTargetChatType?.({ to: target }));
	if (inferred) return inferred;
	const candidates = [target, normalizeTargetForAccountBinding(channel, target)].filter((value) => Boolean(value));
	if (candidates.some((value) => /^user:/i.test(value))) return "direct";
	if (candidates.some((value) => /^(channel|group):/i.test(value))) return "channel";
}
function resolveTargetBoundAccountId(params) {
	if (!params.agentId) return;
	const target = normalizeOptionalString(params.args.to) ?? normalizeOptionalString(params.args.channelId) ?? "";
	if (!target) return resolveFirstBoundAccountId({
		cfg: params.cfg,
		channelId: params.channel,
		agentId: params.agentId
	});
	const candidates = /* @__PURE__ */ new Set();
	addCandidateAndUnprefixedAlias(candidates, target);
	addCandidateAndUnprefixedAlias(candidates, normalizeTargetForAccountBinding(params.channel, target));
	const [peerId, ...exactPeerIdAliases] = Array.from(candidates);
	return resolveFirstBoundAccountId({
		cfg: params.cfg,
		channelId: params.channel,
		agentId: params.agentId,
		peerId,
		exactPeerIdAliases,
		peerKind: inferPeerKindForAccountBinding(params.channel, target, params.channelPlugin)
	});
}
async function resolveActionTarget(params) {
	let resolvedTarget;
	const toRaw = normalizeOptionalString(params.args.to) ?? "";
	if (toRaw) {
		const resolved = await resolveResolvedTargetOrThrow({
			cfg: params.cfg,
			channel: params.channel,
			input: toRaw,
			accountId: params.accountId ?? void 0,
			plugin: params.plugin
		});
		params.args.to = resolved.to;
		resolvedTarget = resolved;
	}
	const channelIdRaw = normalizeOptionalString(params.args.channelId) ?? "";
	if (channelIdRaw) {
		const resolved = await resolveResolvedTargetOrThrow({
			cfg: params.cfg,
			channel: params.channel,
			input: channelIdRaw,
			accountId: params.accountId ?? void 0,
			plugin: params.plugin,
			preferredKind: "group",
			validateResolvedTarget: (target) => target.kind === "user" ? `Channel id "${channelIdRaw}" resolved to a user target.` : void 0
		});
		params.args.channelId = sanitizeGroupTargetId(resolved.to);
	}
	return resolvedTarget;
}
function sanitizeGroupTargetId(target) {
	return target.replace(/^(channel|group):/i, "");
}
async function resolveResolvedTargetOrThrow(params) {
	const resolved = await resolveChannelTarget({
		cfg: params.cfg,
		channel: params.channel,
		input: params.input,
		accountId: params.accountId,
		preferredKind: params.preferredKind,
		plugin: params.plugin
	});
	if (!resolved.ok) throw resolved.error;
	const validationError = params.validateResolvedTarget?.(resolved.target);
	if (validationError) throw invalidMessageActionTargetError(validationError);
	return resolved.target;
}
function hasExplicitSingularTargetParam(params) {
	return readTrimmedStringAlias(params, [
		"target",
		"to",
		"channelId"
	]) !== void 0;
}
function hasExplicitTargetParam(params) {
	return hasExplicitSingularTargetParam(params) || Array.isArray(params.targets) && params.targets.some((value) => normalizeOptionalString(value));
}
function hasPotentialActionTargetInput(input, params) {
	return Boolean(hasExplicitSingularTargetParam(params) || resolveImplicitMessageActionTarget(input.toolContext) || hasPotentialPluginActionParam(params));
}
function isCurrentSourceTargetParam(input, params) {
	const currentChannelId = normalizeOptionalString(input.toolContext?.currentChannelId);
	const currentMessagingTarget = normalizeOptionalString(input.toolContext?.currentMessagingTarget);
	if (!currentChannelId && !currentMessagingTarget) return false;
	const currentChannelProvider = normalizeOptionalLowercaseString(input.toolContext?.currentChannelProvider);
	const explicitChannel = normalizeOptionalLowercaseString(params.channel);
	if (explicitChannel && currentChannelProvider && explicitChannel !== currentChannelProvider) return false;
	const explicitTarget = normalizeOptionalString(params.target) ?? normalizeOptionalString(params.to) ?? normalizeOptionalString(params.channelId);
	if (!explicitTarget) return false;
	const provider = explicitChannel ?? currentChannelProvider;
	const currentCandidates = /* @__PURE__ */ new Set();
	for (const currentTarget of [currentMessagingTarget, currentChannelId]) {
		if (!currentTarget) continue;
		addCandidateAndUnprefixedAlias(currentCandidates, currentTarget);
		if (provider) addCandidateAndUnprefixedAlias(currentCandidates, normalizeTargetForAccountBinding(provider, currentTarget));
	}
	const explicitCandidates = /* @__PURE__ */ new Set();
	addCandidateAndUnprefixedAlias(explicitCandidates, explicitTarget);
	if (provider) addCandidateAndUnprefixedAlias(explicitCandidates, normalizeTargetForAccountBinding(provider, explicitTarget));
	return Array.from(explicitCandidates).some((candidate) => currentCandidates.has(candidate));
}
function hasExplicitNonCurrentChannelParam(input, params) {
	const explicitChannel = normalizeOptionalLowercaseString(params.channel);
	if (!explicitChannel) return false;
	const currentChannelProvider = normalizeOptionalLowercaseString(input.toolContext?.currentChannelProvider);
	return !currentChannelProvider || explicitChannel !== currentChannelProvider;
}
function applyImplicitSourceReplySendPolicy(input, params) {
	if (input.action !== "send" || input.sourceReplyDeliveryMode !== "message_tool_only") return;
	if (hasExplicitNonCurrentChannelParam(input, params)) return;
	if (hasExplicitTargetParam(params) && !isCurrentSourceTargetParam(input, params)) return;
	params.bestEffort = true;
}
async function prepareMessageRoute(params) {
	const { input, agentId } = params;
	const cfg = input.cfg;
	const action = input.action;
	let actionParams = params.actionParams;
	applyImplicitSourceReplySendPolicy(input, actionParams);
	if (actionRequiresTarget(action) && !hasPotentialActionTargetInput(input, actionParams)) throw missingMessageActionTargetError(action);
	const { channel, plugin: channelPlugin } = await resolveChannel(cfg, actionParams, input.toolContext, action, agentId);
	actionParams.channel = channel;
	const explicitAccountId = validateExplicitMessageAccountSelection({
		cfg,
		channel,
		accountId: readToolStringParam(actionParams, "accountId"),
		plugin: channelPlugin
	});
	if (action !== "send" && action !== "poll" && channelPlugin?.actions?.supportsAction && !channelPlugin.actions.supportsAction({ action })) throw new Error(`Message action ${action} not supported for channel ${channel}.`);
	actionParams = normalizeMessageActionInput({
		action,
		args: actionParams,
		toolContext: input.toolContext,
		targetAliasSpec: channelPlugin?.actions?.messageActionTargetAliases?.[action] ?? null,
		allowResourceOnly: input.conversationReadOrigin === "direct-operator"
	});
	let accountId = explicitAccountId ?? input.defaultAccountId;
	if (!accountId && agentId) accountId = resolveTargetBoundAccountId({
		cfg,
		channel,
		channelPlugin,
		args: actionParams,
		agentId
	});
	const delegatesActionToGateway = Boolean(input.gateway) && channelPlugin?.actions?.resolveExecutionMode?.({ action }) === "gateway";
	if (!accountId && action === "send" && !delegatesActionToGateway && (channelPlugin.outbound?.deliveryMode !== "gateway" || input.gatewayOwnedDelivery === true)) accountId = resolveChannelDefaultAccountId({
		plugin: channelPlugin,
		cfg
	});
	if (accountId) actionParams.accountId = accountId;
	const dryRun = Boolean(input.dryRun ?? readBooleanParam(actionParams, "dryRun"));
	enforceCrossProviderEgressPolicyBeforeTargetResolution({
		channel,
		action,
		args: actionParams,
		toolContext: input.toolContext,
		cfg,
		agentId
	});
	const defersExternalTargetResolution = delegatesActionToGateway && !dryRun && shouldDeferExternalMessageActionTargetResolution({
		channel,
		action,
		cfg,
		params: actionParams,
		accountId: accountId ?? void 0,
		conversationReadOrigin: normalizeConversationReadInvocationOrigin(input.conversationReadOrigin),
		messageActionAuthorization: input.messageActionAuthorization
	});
	let assertReadAuthorityCurrent;
	let assertTargetAuthorityCurrent;
	if (!delegatesActionToGateway || dryRun) {
		const authorization = input.messageActionAuthorization;
		const preparedRead = prepareExternalMessageActionTargetForResolution({
			channel,
			action,
			cfg,
			params: actionParams,
			accountId: accountId ?? void 0,
			agentId,
			sessionKey: input.sessionKey,
			sessionId: input.sessionId,
			requesterAccountId: authorization !== void 0 ? authorization.requesterAccountId : input.requesterAccountId ?? void 0,
			requesterSenderId: authorization !== void 0 ? authorization.requesterSenderId : input.requesterSenderId ?? void 0,
			senderIsOwner: input.senderIsOwner,
			conversationReadOrigin: normalizeConversationReadInvocationOrigin(input.conversationReadOrigin),
			toolContext: authorization !== void 0 ? authorization.toolContext : input.toolContext,
			messageActionAuthorization: authorization,
			assertDirectAdapterHandoff: input.assertDirectAdapterHandoff
		});
		actionParams = preparedRead.params;
		accountId = preparedRead.accountId ?? accountId;
		assertReadAuthorityCurrent = preparedRead.assertReadAuthorityCurrent;
		assertTargetAuthorityCurrent = preparedRead.assertTargetAuthorityCurrent;
	}
	return {
		params: actionParams,
		channel,
		channelPlugin,
		accountId,
		dryRun,
		defersExternalTargetResolution,
		assertReadAuthorityCurrent,
		assertTargetAuthorityCurrent
	};
}
async function resolveMessageTarget(params) {
	const resolvedTarget = params.deferExternalTargetResolution ? void 0 : await resolveActionTarget({
		cfg: params.cfg,
		channel: params.channel,
		action: params.action,
		args: params.args,
		accountId: params.accountId,
		plugin: params.plugin
	});
	enforceCrossContextPolicy({
		channel: params.channel,
		action: params.action,
		args: params.args,
		toolContext: params.toolContext,
		cfg: params.cfg,
		agentId: params.agentId
	});
	return resolvedTarget;
}
//#endregion
//#region src/infra/outbound/message-action-send-payload.ts
const LEGACY_SEND_MEDIA_SOURCE_KEYS = [
	"path",
	"filePath",
	"fileUrl",
	"image"
];
function updateSendPayloadPartsFromReplyPayload(parts, payload) {
	const sendable = resolveSendableOutboundReplyParts(payload);
	const mediaUrls = sendable.mediaUrls.length > 0 ? sendable.mediaUrls : void 0;
	return {
		...parts,
		message: payload.text ?? "",
		payload,
		mediaUrl: mediaUrls?.[0],
		mediaUrls,
		asVoice: payload.audioAsVoice === true
	};
}
function applySendLocationToActionParams(actionParams, location) {
	if (location) actionParams.location = location;
	else delete actionParams.location;
}
function applySendPayloadPartsToActionParams(actionParams, parts) {
	if (parts.message || !parts.payload.presentation) actionParams.message = parts.message;
	else delete actionParams.message;
	actionParams.media = parts.mediaUrl;
	actionParams.mediaUrl = parts.mediaUrl;
	actionParams.mediaUrls = parts.mediaUrls;
	actionParams.attachments = parts.payload.attachments?.map((attachment) => ({ ...attachment }));
	for (const key of LEGACY_SEND_MEDIA_SOURCE_KEYS) delete actionParams[key];
	actionParams.asVoice = parts.asVoice || void 0;
	actionParams.audioAsVoice = parts.asVoice || void 0;
	actionParams.asVideoNote = parts.payload.videoAsNote || void 0;
	applySendLocationToActionParams(actionParams, parts.payload.location);
}
function withSendNormalization(result, normalization) {
	return normalization && result.kind === "send" ? {
		...result,
		normalization
	} : result;
}
//#endregion
//#region src/infra/outbound/message-action-gateway-media.ts
async function stageGatewayWorkspaceMedia(params) {
	const mediaUrls = params.mediaUrls;
	const workspaceRoots = params.workspaceMediaAccess?.localRoots ?? [];
	if (!mediaUrls?.length || workspaceRoots.length === 0) return params.payload;
	const maxBytes = resolveOutboundMediaMaxBytes({
		cfg: params.cfg,
		channel: params.channel,
		accountId: params.accountId
	});
	const stagedMediaUrls = await Promise.all(mediaUrls.map(async (mediaUrl) => {
		const localPath = resolveLocalMediaPath(mediaUrl);
		if (!localPath || !workspaceRoots.some((root) => isPathInside(path.resolve(root), path.resolve(localPath)))) return mediaUrl;
		return (await resolveOutboundAttachmentFromUrl(mediaUrl, maxBytes, { mediaAccess: params.mediaAccess })).path;
	}));
	if (stagedMediaUrls.every((mediaUrl, index) => mediaUrl === mediaUrls[index])) return params.payload;
	const stagedAttachments = params.payload.attachments?.map((attachment, index) => {
		const stagedAttachment = {
			...attachment,
			path: stagedMediaUrls[index]
		};
		delete stagedAttachment.url;
		delete stagedAttachment.mediaUrl;
		delete stagedAttachment.filePath;
		return stagedAttachment;
	});
	return {
		...params.payload,
		mediaUrl: stagedMediaUrls[0],
		mediaUrls: stagedMediaUrls,
		...stagedAttachments ? { attachments: stagedAttachments } : {}
	};
}
//#endregion
//#region src/infra/outbound/message-action-tts.ts
const loadMessageActionTtsRuntime = createLazyRuntimeModule(() => import("./tts.runtime.js"));
/** Reads the session-level TTS auto mode for a message-action send. */
function resolveMessageActionSessionTtsAuto(params) {
	const sessionKey = params.sessionKey?.trim();
	if (!sessionKey) return;
	try {
		const storePath = resolveSessionStorePathCore(params.cfg.session?.store, { agentId: params.agentId });
		return loadSessionEntryReadOnly({
			agentId: params.agentId,
			sessionKey,
			storePath
		})?.ttsAuto;
	} catch {
		return;
	}
}
/** Applies automatic TTS to a message-action send payload when config/session policy allows it. */
async function maybeApplyTtsToMessageActionSendPayload(params) {
	if (params.dryRun) return params.payload;
	const ttsAuto = resolveMessageActionSessionTtsAuto({
		cfg: params.cfg,
		sessionKey: params.sessionKey,
		agentId: params.agentId
	});
	if (!(getReplyPayloadMetadata(params.payload)?.ttsExplicit === true) && !shouldAttemptTtsPayload({
		cfg: params.cfg,
		ttsAuto,
		agentId: params.agentId,
		channelId: params.channel,
		accountId: params.accountId ?? void 0
	})) return params.payload;
	const { maybeApplyTtsToPayload } = await loadMessageActionTtsRuntime();
	return await maybeApplyTtsToPayload({
		payload: params.payload,
		cfg: params.cfg,
		channel: params.channel,
		kind: "final",
		inboundAudio: params.inboundAudio,
		ttsAuto,
		agentId: params.agentId,
		accountId: params.accountId ?? void 0
	});
}
//#endregion
//#region src/infra/outbound/message-action-send.ts
function resolveReplyMediaAttachmentType(value) {
	return value === "image" || value === "audio" || value === "video" || value === "file" ? value : void 0;
}
async function buildMessagePayload(params) {
	const { actionParams, input } = params;
	if (actionParams.pin === true && actionParams.delivery == null) actionParams.delivery = { pin: { enabled: true } };
	if (typeof actionParams.message !== "string" || !actionParams.message.trim()) for (const alias of [
		"SendMessage",
		"content",
		"text"
	]) {
		const value = actionParams[alias];
		if (typeof value === "string" && value.trim()) {
			actionParams.message = stripFormattedReasoningMessage(value);
			console.warn(`[message-tool] normalized alias "${alias}" to "message" for send action`);
			break;
		}
	}
	const mediaHint = readToolStringParam(actionParams, "media", { trim: false }) ?? readToolStringParam(actionParams, "mediaUrl", { trim: false }) ?? readToolStringParam(actionParams, "path", { trim: false }) ?? readToolStringParam(actionParams, "filePath", { trim: false }) ?? readToolStringParam(actionParams, "fileUrl", { trim: false }) ?? readToolStringParam(actionParams, "image", { trim: false });
	const mediaUrlHints = readStringArrayParam(actionParams, "mediaUrls") ?? [];
	const attachmentSources = collectAttachmentSources(actionParams);
	const hasBuffer = Boolean(readToolStringParam(actionParams, "buffer", { trim: false }));
	const hasMediaHint = hasBuffer || Boolean(mediaHint) || mediaUrlHints.length > 0 || attachmentSources.length > 0;
	const hasPresentation = hasMessagePresentationBlocks(actionParams.presentation);
	const hasInteractive = hasLegacyInteractiveReplyBlocks(actionParams.interactive);
	const rawLocation = actionParams.location;
	let location = typeof rawLocation === "string" && normalizeOptionalString(rawLocation) === void 0 ? void 0 : normalizeOutboundLocation(rawLocation);
	const caption = readToolStringParam(actionParams, "caption", { trim: false }) ?? "";
	const voiceText = readToolStringParam(actionParams, "voiceText");
	const voiceProvider = readToolStringParam(actionParams, "voiceProvider");
	const voiceId = readToolStringParam(actionParams, "voiceId");
	let message = readToolStringParam(actionParams, "message", {
		required: !hasMediaHint && !hasPresentation && !hasInteractive && !location && !voiceText,
		allowEmpty: true,
		trim: false
	}) ?? "";
	if (message.includes("\\n")) message = message.replaceAll("\\n", "\n");
	if (!message.trim()) message = caption.trim() ? caption : "";
	const parsed = parseInlineDirectives(message, {
		stripAudioTag: true,
		stripReplyTags: true
	});
	const topLevelFilename = readToolStringParam(actionParams, "filename");
	const topLevelMimeType = readToolStringParam(actionParams, "contentType");
	const attachmentByUrl = new Map(attachmentSources.map((source) => [normalizeOptionalString(source.value), {
		filename: source.filename,
		mimeType: source.contentType,
		type: resolveReplyMediaAttachmentType(source.attachment.type)
	}]));
	const mediaEntries = [];
	const pushMedia = (value, metadata) => {
		const trimmed = normalizeOptionalString(value);
		if (!trimmed) return;
		mediaEntries.push({
			url: trimmed,
			...metadata
		});
	};
	pushMedia(mediaHint, {
		...attachmentByUrl.get(normalizeOptionalString(mediaHint)),
		filename: topLevelFilename ?? attachmentByUrl.get(normalizeOptionalString(mediaHint))?.filename,
		mimeType: topLevelMimeType ?? attachmentByUrl.get(normalizeOptionalString(mediaHint))?.mimeType
	});
	for (const mediaUrlHint of mediaUrlHints) pushMedia(mediaUrlHint, attachmentByUrl.get(normalizeOptionalString(mediaUrlHint)));
	for (const attachmentSource of attachmentSources) pushMedia(attachmentSource.value, {
		filename: attachmentSource.filename,
		mimeType: attachmentSource.contentType,
		type: resolveReplyMediaAttachmentType(attachmentSource.attachment.type)
	});
	const normalizedMedia = await Promise.all(mediaEntries.map(async (entry) => {
		entry.url = await normalizeSandboxMediaSource({
			value: entry.url,
			sandboxRoot: input.sandboxRoot,
			sandboxContainerWorkdir: input.sandboxContainerWorkdir
		});
		return entry;
	}));
	const seenMedia = /* @__PURE__ */ new Set();
	const preparedMedia = normalizedMedia.filter((entry) => {
		if (seenMedia.has(entry.url)) return false;
		seenMedia.add(entry.url);
		return true;
	});
	const mergedMediaUrls = preparedMedia.map((entry) => entry.url);
	const mediaAttachments = preparedMedia.map((entry) => Object.assign({ path: entry.url }, entry.type ? { type: entry.type } : {}, entry.filename ? { name: entry.filename } : {}, entry.mimeType ? { mimeType: entry.mimeType } : {}));
	message = stripPlainTextToolCallBlocks(stripUnsupportedCitationControlMarkers(parsed.text), { resolveProtectedRanges: findCodeRegions });
	if (message || !hasPresentation) actionParams.message = message;
	else delete actionParams.message;
	if (!actionParams.replyTo && parsed.replyToId) actionParams.replyTo = parsed.replyToId;
	if (!actionParams.media) actionParams.media = mergedMediaUrls[0] || void 0;
	actionParams.mediaUrls = mergedMediaUrls.length > 0 ? [...mergedMediaUrls] : void 0;
	const hasLocationConflict = Boolean(location && (message.trim() || voiceText || hasBuffer || mergedMediaUrls.length > 0 || hasPresentation || hasInteractive));
	const normalization = hasLocationConflict && input.actionOrigin === "message-tool" ? {
		locationOmitted: true,
		notice: "Content sent; location omitted because locations must be sent separately. Do not retry this send. Send a standalone location only if the user explicitly requested it."
	} : void 0;
	if (hasLocationConflict && !normalization) throw new Error("Location sends cannot be combined with message text or media.");
	if (normalization) location = void 0;
	applySendLocationToActionParams(actionParams, location);
	if (params.channel && params.target) {
		const channel = params.channel;
		const target = params.target;
		message = await withChannelReadAuthority(input.messageActionAuthorization?.scheduled ? input.assertDirectAdapterHandoff : void 0, () => applyMessageCrossContextMarker({
			cfg: params.cfg,
			channel,
			action: "send",
			target,
			toolContext: input.toolContext,
			accountId: params.accountId,
			agentId: params.agentId,
			args: actionParams,
			message,
			preferPresentation: true
		}));
	}
	const mediaUrl = readToolStringParam(actionParams, "media", { trim: false });
	if (!voiceText && !hasReplyPayloadContent({
		text: message,
		mediaUrl,
		mediaUrls: mergedMediaUrls,
		presentation: actionParams.presentation,
		interactive: actionParams.interactive,
		location
	})) throw new Error("send requires text or media or location");
	if (message || !hasPresentation) actionParams.message = message;
	else delete actionParams.message;
	const gifPlayback = readBooleanParam(actionParams, "gifPlayback") ?? false;
	const forceDocument = readBooleanParam(actionParams, "forceDocument") ?? readBooleanParam(actionParams, "asDocument") ?? false;
	const asVoice = readBooleanParam(actionParams, "asVoice") ?? readBooleanParam(actionParams, "audioAsVoice") ?? parsed.audioAsVoice;
	const asVideoNote = readBooleanParam(actionParams, "asVideoNote") ?? false;
	const bestEffort = readBooleanParam(actionParams, "bestEffort");
	const silent = readBooleanParam(actionParams, "silent");
	const mirrorMediaUrls = mergedMediaUrls.length > 0 ? mergedMediaUrls : mediaUrl ? [mediaUrl] : void 0;
	const rawDelivery = actionParams.delivery;
	const delivery = rawDelivery && typeof rawDelivery === "object" && !Array.isArray(rawDelivery) ? rawDelivery : void 0;
	const rawChannelData = actionParams.channelData;
	const channelData = rawChannelData && typeof rawChannelData === "object" && !Array.isArray(rawChannelData) ? rawChannelData : void 0;
	const presentation = normalizeMessagePresentation(actionParams.presentation);
	const interactive = normalizeLegacyInteractiveReply(actionParams.interactive);
	const payload = {
		text: message,
		...mediaUrl ? { mediaUrl } : {},
		...mergedMediaUrls.length ? { mediaUrls: mergedMediaUrls } : {},
		...mediaAttachments.some((attachment) => Object.keys(attachment).length > 1) ? { attachments: mediaAttachments } : {},
		...asVoice ? { audioAsVoice: true } : {},
		...asVideoNote ? { videoAsNote: true } : {},
		...location ? { location } : {},
		...presentation ? { presentation } : {},
		...interactive ? { interactive } : {},
		...delivery ? { delivery } : {},
		...channelData ? { channelData } : {}
	};
	const ttsFacts = voiceText || voiceProvider || voiceId ? {
		tagged: true,
		...voiceText ? { text: voiceText } : {},
		...voiceProvider || voiceId ? { directives: [{
			...voiceProvider ? { provider: voiceProvider.toLowerCase() } : {},
			values: voiceId ? { voiceid: voiceId } : {}
		}] } : {}
	} : void 0;
	return {
		message,
		payload: ttsFacts ? setReplyPayloadMetadata(payload, {
			tts: ttsFacts,
			ttsExplicit: true
		}) : payload,
		...mediaUrl ? { mediaUrl } : {},
		...mirrorMediaUrls ? { mediaUrls: mirrorMediaUrls } : {},
		asVoice,
		gifPlayback,
		forceDocument,
		...bestEffort !== void 0 ? { bestEffort } : {},
		...silent !== void 0 ? { silent } : {},
		...normalization ? { normalization } : {}
	};
}
const UNRESOLVED_PREFIX_VAR_PATTERN = /\{[a-zA-Z][a-zA-Z0-9.]*\}/;
async function executeMessageSend(ctx) {
	const { cfg, params, channel, channelPlugin, accountId, dryRun, gateway, input, agentId, resolvedTarget, abortSignal } = ctx;
	throwIfAborted(abortSignal);
	const action = "send";
	const to = readToolStringParam(params, "to", { required: true });
	let sendPayload = await buildMessagePayload({
		cfg,
		actionParams: params,
		input,
		channel,
		target: to,
		accountId,
		agentId
	});
	const responsePrefix = resolveResponsePrefixTemplate(resolveResponsePrefix(cfg, agentId ?? "", {
		channel,
		accountId: accountId ?? void 0
	}), { identityName: normalizeOptionalString(resolveAgentIdentity(cfg, agentId ?? "")?.name) });
	const prefixHasUnresolvedVar = responsePrefix !== void 0 && UNRESOLVED_PREFIX_VAR_PATTERN.test(responsePrefix);
	if (responsePrefix && !prefixHasUnresolvedVar && sendPayload.message && !sendPayload.message.startsWith(responsePrefix)) {
		const prefixedMessage = `${responsePrefix} ${sendPayload.message}`;
		sendPayload = {
			...sendPayload,
			message: prefixedMessage,
			payload: copyReplyPayloadMetadata(sendPayload.payload, {
				...sendPayload.payload,
				text: prefixedMessage
			})
		};
		applySendPayloadPartsToActionParams(params, sendPayload);
	}
	const initialReply = resolveAndApplyOutboundReplyToId(params, {
		channel,
		toolContext: input.toolContext,
		matchesToolContextTarget: channelPlugin?.threading?.matchesToolContextTarget
	});
	const { resolvedThreadId, outboundRoute } = await prepareOutboundMirrorRoute({
		cfg,
		channel,
		to,
		actionParams: params,
		accountId,
		toolContext: input.toolContext,
		agentId,
		currentSessionKey: input.sessionKey,
		dryRun,
		resolvedTarget,
		resolveAutoThreadId: channelPlugin?.threading?.resolveAutoThreadId,
		resolveReplyTransport: channelPlugin?.threading?.resolveReplyTransport,
		replyToIsExplicit: initialReply?.source === "explicit",
		resolveOutboundSessionRoute
	});
	const canonicalReplyToId = readToolStringParam(params, "replyTo");
	const reply = initialReply && canonicalReplyToId && canonicalReplyToId !== initialReply.replyToId ? {
		...initialReply,
		replyToId: canonicalReplyToId
	} : initialReply;
	let outboundRoutePersisted = false;
	const commitOutboundSessionRoute = async () => {
		if (outboundRoutePersisted || !outboundRoute) return;
		outboundRoutePersisted = true;
		await ensureOutboundSessionEntry({
			cfg,
			channel,
			accountId,
			route: outboundRoute,
			sourceSessionKey: input.sessionKey
		});
	};
	throwIfAborted(abortSignal);
	const ttsPayload = await maybeApplyTtsToMessageActionSendPayload({
		payload: sendPayload.payload,
		cfg,
		channel,
		accountId,
		agentId,
		sessionKey: input.sessionKey,
		inboundAudio: input.inboundAudio,
		dryRun
	});
	if (ttsPayload !== sendPayload.payload) {
		sendPayload = updateSendPayloadPartsFromReplyPayload(sendPayload, ttsPayload);
		applySendPayloadPartsToActionParams(params, sendPayload);
	}
	delete params.voiceText;
	delete params.voiceProvider;
	delete params.voiceId;
	throwIfAborted(abortSignal);
	const mediaAccess = input.mediaAccess ?? resolveAgentScopedOutboundMediaAccess({
		cfg,
		agentId,
		mediaSources: sendPayload.mediaUrls,
		workspaceMediaAccess: input.workspaceMediaAccess,
		sessionKey: input.sessionKey,
		messageProvider: input.sessionKey ? void 0 : channel,
		accountId: input.sessionKey ? input.requesterAccountId ?? accountId : accountId,
		requesterSenderId: input.requesterSenderId,
		requesterSenderName: input.requesterSenderName,
		requesterSenderUsername: input.requesterSenderUsername,
		requesterSenderE164: input.requesterSenderE164
	});
	const requiresCoreDelivery = input.forceCoreDelivery === true || input.requireQueuePersistence === true;
	if (!requiresCoreDelivery && Boolean(gateway) && (channelPlugin?.actions?.resolveExecutionMode?.({ action }) === "gateway" || channelPlugin?.outbound?.deliveryMode === "gateway") && !dryRun) {
		const stagedPayload = await stageGatewayWorkspaceMedia({
			cfg,
			channel,
			accountId,
			payload: sendPayload.payload,
			mediaUrls: sendPayload.mediaUrls,
			mediaAccess,
			workspaceMediaAccess: input.workspaceMediaAccess
		});
		sendPayload = updateSendPayloadPartsFromReplyPayload(sendPayload, stagedPayload);
		applySendPayloadPartsToActionParams(params, sendPayload);
	}
	const gatewayPluginAction = requiresCoreDelivery ? null : await executeGatewayAction(ctx, {
		action,
		reply,
		result: (payload) => ({
			kind: "send",
			channel,
			action,
			to,
			handledBy: "plugin",
			payload,
			dryRun
		})
	});
	if (gatewayPluginAction) {
		const deliveryFact = projectPluginMessageDeliveryFact(gatewayPluginAction.payload);
		if (!deliveryFact || deliveryFact.status === "settled") await commitOutboundSessionRoute();
		return await annotateSourceDelivery(withSendNormalization(gatewayPluginAction, sendPayload.normalization), ctx, reply?.source === "explicit");
	}
	const useCorePresentationDelivery = Boolean(sendPayload.payload.presentation && hasCorePresentationDelivery(channelPlugin?.outbound));
	if (sendPayload.payload.presentation && !useCorePresentationDelivery) {
		const fallbackMessage = materializeMessagePresentationFallback({
			payload: sendPayload.payload,
			text: sendPayload.message
		});
		sendPayload = {
			...sendPayload,
			message: fallbackMessage,
			payload: {
				...sendPayload.payload,
				text: fallbackMessage
			}
		};
		applySendPayloadPartsToActionParams(params, sendPayload);
	}
	const send = await executeSendAction({
		ctx: {
			...ctx,
			mediaAccess,
			conversationType: outboundRoute?.chatType,
			deliveryRetryOwner: input.actionOrigin === "message-tool" ? "caller" : void 0,
			onSendAccepted: commitOutboundSessionRoute,
			mirror: !dryRun && input.transcriptMirror ? {
				...input.transcriptMirror,
				text: sendPayload.message,
				mediaUrls: sendPayload.mediaUrls
			} : outboundRoute && !dryRun && input.suppressTranscriptMirror !== true ? {
				sessionKey: outboundRoute.sessionKey,
				agentId,
				text: sendPayload.message,
				mediaUrls: sendPayload.mediaUrls,
				idempotencyKey: normalizeOptionalString(params.idempotencyKey) ?? void 0
			} : void 0,
			silent: sendPayload.silent ?? void 0
		},
		to,
		message: sendPayload.message,
		payload: sendPayload.payload,
		mediaUrl: sendPayload.mediaUrl,
		mediaUrls: sendPayload.mediaUrls,
		buffer: readToolStringParam(params, "buffer", { trim: false }) ?? void 0,
		filename: readToolStringParam(params, "filename") ?? void 0,
		contentType: readToolStringParam(params, "contentType") ?? void 0,
		asVoice: sendPayload.asVoice,
		gifPlayback: sendPayload.gifPlayback,
		forceDocument: sendPayload.forceDocument,
		bestEffort: sendPayload.bestEffort,
		reply,
		threadId: resolvedThreadId ?? void 0
	});
	if (send.handledBy === "core") {
		const coreDeliveryStatus = send.sendResult?.deliveryStatus;
		const deliveryFact = projectPluginMessageDeliveryFact(send.payload);
		if (coreDeliveryStatus !== "failed" && coreDeliveryStatus !== "suppressed" && (!deliveryFact || deliveryFact.status === "settled")) await commitOutboundSessionRoute();
	}
	return await annotateSourceDelivery(withSendNormalization({
		kind: "send",
		channel,
		action,
		to,
		handledBy: send.handledBy,
		payload: send.payload,
		...send.deliveredText ? { deliveredText: send.deliveredText } : {},
		toolResult: send.toolResult,
		sendResult: send.sendResult,
		dryRun
	}, sendPayload.normalization), ctx, reply?.source === "explicit");
}
//#endregion
//#region src/infra/outbound/message-action-runner.ts
const loadInternalSourceReplyPersistence = createLazyRuntimeModule(() => import("./internal-source-reply-persistence-CCvoTe9Z.mjs"));
const loadClawHubRecommendations = createLazyRuntimeModule(() => import("./clawhub-recommendations-qU8Ck5mU.mjs"));
function getToolResult(result) {
	return "toolResult" in result ? result.toolResult : void 0;
}
function withMessageTargetPreparation(assertCallerCurrent, prepare, signal) {
	const assertCurrent = signal ? () => {
		throwIfAborted(signal);
		assertCallerCurrent?.();
	} : assertCallerCurrent;
	return withChannelReadAuthority(assertCurrent, prepare, signal).catch((error) => {
		assertOutboundHandoffCurrent(assertCurrent);
		throw error;
	});
}
async function handleBroadcastAction(input, params) {
	if (!(resolveEffectiveMessageToolsConfig({
		cfg: input.cfg,
		agentId: input.agentId
	})?.broadcast?.enabled !== false)) throw new MessageActionDeniedError("Broadcast is disabled. Set tools.message.broadcast.enabled to true.", "message_broadcast_disabled", "message-broadcast:enabled");
	const rawTargets = readStringArrayParam(params, "targets", { required: true });
	if (rawTargets.length === 0) throw new Error("Broadcast requires at least one target in --targets.");
	const channelHint = readToolStringParam(params, "channel");
	const explicitAccountId = validateExplicitMessageAccountSelection({
		cfg: input.cfg,
		accountId: readToolStringParam(params, "accountId"),
		checkResolvedAccount: false
	});
	if (input.broadcastAccountPlan && input.broadcastAccountPlan.accountId !== explicitAccountId) throw new Error("Broadcast account plan does not match the requested account.");
	const targetChannels = channelHint && normalizeOptionalLowercaseString(channelHint) !== "all" ? [await resolveMessageChannelSelection({
		cfg: input.cfg,
		channel: channelHint,
		fallbackChannel: input.toolContext?.currentChannelProvider,
		agentId: input.agentId
	})] : input.broadcastAccountPlan ? input.broadcastAccountPlan.candidateChannels.map((channel) => ({
		channel,
		plugin: getRuntimeVisibleChannelPlugin(channel)
	})) : await (async () => {
		const configured = await listConfiguredMessageChannels(input.cfg);
		if (configured.length === 0) throw new Error("Broadcast requires at least one configured channel.");
		return configured.map((channel) => ({
			channel,
			plugin: getRuntimeVisibleChannelPlugin(channel)
		}));
	})();
	if (targetChannels.length === 0) throw new Error("Broadcast requires at least one configured channel.");
	const results = [];
	const parentIdempotencyKey = input.messageActionAuthorization?.scheduled ? normalizeOptionalString(params.idempotencyKey) : void 0;
	const hasAcceptedResult = () => !input.dryRun && results.some((result) => result.ok || result.sentBeforeError);
	const errorSentBefore = (error) => error !== null && typeof error === "object" && error.sentBeforeError === true;
	const captureInterruption = () => {
		try {
			throwIfAborted(input.abortSignal);
			input.assertDirectAdapterHandoff?.();
		} catch (interruption) {
			return toErrorObject(interruption, "Message action interrupted");
		}
	};
	let attemptIndex = 0;
	let interrupted = false;
	for (const { channel: targetChannel, plugin: targetChannelPlugin } of targetChannels) for (const target of rawTargets) {
		const receiptDiscriminator = `broadcast:${attemptIndex++}`;
		if (interrupted) {
			results.push({
				channel: targetChannel,
				to: target,
				ok: false,
				attempted: false,
				error: "Broadcast canceled before this target was attempted."
			});
			continue;
		}
		const hadAcceptedResult = hasAcceptedResult();
		try {
			throwIfAborted(input.abortSignal);
			input.assertDirectAdapterHandoff?.();
		} catch (err) {
			if (!hadAcceptedResult) throw err;
			interrupted = true;
			results.push({
				channel: targetChannel,
				to: target,
				ok: false,
				attempted: false,
				error: "Broadcast canceled before this target was attempted."
			});
			continue;
		}
		try {
			const targetAccountId = validateExplicitMessageAccountSelection({
				cfg: input.cfg,
				channel: targetChannel,
				accountId: explicitAccountId
			});
			const targetArgs = { to: target };
			const resolved = await withMessageTargetPreparation(input.assertDirectAdapterHandoff, () => resolveMessageTarget({
				cfg: input.cfg,
				channel: targetChannel,
				action: "send",
				args: targetArgs,
				accountId: targetAccountId,
				plugin: targetChannelPlugin
			}), input.abortSignal);
			if (!resolved) throw new Error("Broadcast target resolution unexpectedly deferred.");
			const sendResult = await runMessageAction({
				...input,
				action: "send",
				params: {
					...params,
					channel: targetChannel,
					target: resolved.to,
					...parentIdempotencyKey ? { idempotencyKey: `${parentIdempotencyKey}:${receiptDiscriminator}` } : {}
				}
			});
			const outcome = resolveMessageActionOutcome(sendResult, "Broadcast");
			const entry = {
				channel: targetChannel,
				to: resolved.to,
				...outcome,
				payload: sendResult.kind === "send" ? sendResult.payload : void 0,
				result: sendResult.kind === "send" ? sendResult.sendResult : void 0
			};
			const interruption = outcome.ok ? void 0 : captureInterruption();
			if (interruption) {
				if (!hadAcceptedResult && !outcome.ok && !outcome.sentBeforeError) throw interruption;
				interrupted = true;
			}
			results.push(entry);
		} catch (err) {
			if (err instanceof MessageActionDeniedError) input.onActionDenied?.(err, targetChannel, receiptDiscriminator);
			if (err instanceof OutboundHandoffRejectedError ? err : captureInterruption()) {
				const sentBeforeError = errorSentBefore(err);
				if (!hadAcceptedResult && !sentBeforeError) throw err;
				interrupted = true;
				results.push({
					channel: targetChannel,
					to: target,
					ok: false,
					...!sentBeforeError && err instanceof OutboundHandoffRejectedError ? {
						attempted: false,
						error: "Broadcast canceled before this target was attempted."
					} : {
						error: formatErrorMessage(err),
						...sentBeforeError ? { sentBeforeError: true } : {}
					}
				});
				continue;
			}
			results.push({
				channel: targetChannel,
				to: target,
				ok: false,
				error: formatErrorMessage(err),
				...errorSentBefore(err) ? { sentBeforeError: true } : {}
			});
		}
	}
	return {
		kind: "broadcast",
		channel: targetChannels[0]?.channel ?? normalizeOptionalLowercaseString(channelHint) ?? "unknown",
		action: "broadcast",
		handledBy: input.dryRun ? "dry-run" : "core",
		payload: { results },
		dryRun: Boolean(input.dryRun)
	};
}
async function handleInternalSourceReplySendAction(input, params) {
	throwIfAborted(input.abortSignal);
	const dryRun = Boolean(input.dryRun ?? readBooleanParam(params, "dryRun"));
	const agentId = input.agentId ?? (input.sessionKey ? resolveSessionAgentId({
		sessionKey: input.sessionKey,
		config: input.cfg
	}) : void 0);
	let recommendations;
	if (params.clawhub !== void 0) {
		if (normalizeMessageChannel(input.toolContext?.currentChannelProvider) !== "webchat") throw new Error("ClawHub recommendation cards require the current Control UI conversation.");
		const { resolveClawHubRecommendations } = await loadClawHubRecommendations();
		recommendations = await resolveClawHubRecommendations({
			request: params.clawhub,
			config: input.cfg,
			agentId,
			workspaceDir: input.workspaceDir ?? (agentId ? resolveAgentWorkspaceDir(input.cfg, agentId) : void 0)
		});
		throwIfAborted(input.abortSignal);
		if (!recommendations.cards.length || !normalizeOptionalString(params.message)) params.message = recommendations.text;
	}
	const mediaAccess = input.mediaAccess ?? resolveAgentScopedOutboundMediaAccess({
		cfg: input.cfg,
		agentId,
		workspaceDir: input.workspaceDir,
		mediaSources: collectActionMediaSourceHints(params, [], { structuredAttachments: "all" }),
		workspaceMediaAccess: input.workspaceMediaAccess,
		sessionKey: input.sessionKey,
		messageProvider: input.sessionKey ? void 0 : "webchat",
		accountId: input.sessionKey ? input.requesterAccountId : void 0,
		requesterSenderId: input.requesterSenderId,
		requesterSenderName: input.requesterSenderName,
		requesterSenderUsername: input.requesterSenderUsername,
		requesterSenderE164: input.requesterSenderE164
	});
	const sandboxMediaReadFile = input.workspaceMediaAccess?.readFile ? mediaAccess.readFile : void 0;
	await hydrateAttachmentParamsForAction({
		cfg: input.cfg,
		channel: INTERNAL_MESSAGE_CHANNEL,
		args: params,
		action: "send",
		dryRun,
		mediaPolicy: resolveAttachmentMediaPolicy({
			sandboxRoot: input.sandboxRoot,
			sandboxContainerWorkdir: input.sandboxContainerWorkdir,
			mediaAccess,
			mediaReadFile: sandboxMediaReadFile
		})
	});
	const sourceReply = await buildMessagePayload({
		cfg: input.cfg,
		actionParams: params,
		input,
		agentId
	});
	let sourceReplyPayload = sourceReply.payload;
	if (recommendations) sourceReplyPayload = {
		...sourceReplyPayload,
		channelData: {
			...sourceReplyPayload.channelData,
			[CLAWHUB_RECOMMENDATIONS_CHANNEL_DATA_KEY]: recommendations.cards
		}
	};
	const requestedMediaCount = resolveSendableOutboundReplyParts(sourceReplyPayload).mediaUrls.length;
	if (!dryRun && requestedMediaCount > 0) {
		const workspaceDir = input.workspaceDir ?? mediaAccess.workspaceDir ?? (agentId ? resolveAgentWorkspaceDir(input.cfg, agentId) : void 0);
		if (!workspaceDir) throw new Error("Current-source media requires an agent workspace.");
		const { createReplyMediaPathNormalizer } = await import("./reply-media-paths.runtime.js");
		sourceReplyPayload = await createReplyMediaPathNormalizer({
			cfg: input.cfg,
			sessionKey: input.sessionKey,
			agentId,
			workspaceDir,
			messageProvider: INTERNAL_MESSAGE_CHANNEL,
			requesterSenderId: input.requesterSenderId ?? void 0,
			requesterSenderName: input.requesterSenderName ?? void 0,
			requesterSenderUsername: input.requesterSenderUsername ?? void 0,
			requesterSenderE164: input.requesterSenderE164 ?? void 0,
			mediaAccess,
			workspaceMediaAccess: input.workspaceMediaAccess,
			sandboxRoot: input.sandboxRoot,
			sandboxContainerWorkdir: input.sandboxContainerWorkdir
		})(sourceReplyPayload);
		if (resolveSendableOutboundReplyParts(sourceReplyPayload).mediaUrls.length !== requestedMediaCount) {
			const failureMessage = appendReplyMediaFailures(void 0, getReplyPayloadMetadata(sourceReplyPayload)?.assistantMediaFailures ?? []);
			throw new Error(failureMessage ? `Current-source media could not be staged.\n${failureMessage}` : "Current-source media could not be staged. Use an accessible URL, a file inside the agent workspace, or the buffer field.");
		}
	}
	const sourceReplyMediaUrls = resolveSendableOutboundReplyParts(sourceReplyPayload).mediaUrls;
	const sourceReplyMessage = sourceReplyPayload.text ?? sourceReply.message;
	const idempotencyKey = normalizeOptionalString(params.idempotencyKey);
	let persistedIdempotencyKey;
	let persistedTranscriptOwner = false;
	if (!dryRun && input.sessionId) {
		const sessionKey = input.sourceReplySessionKey ?? input.sessionKey;
		if (!sessionKey) throw new Error("Internal source reply requires a session key");
		const { persistInternalSourceReply } = await loadInternalSourceReplyPersistence();
		await persistInternalSourceReply({
			cfg: input.cfg,
			sessionKey,
			expectedSessionId: input.sessionId,
			agentId: input.agentId ?? resolveSessionAgentId({
				sessionKey,
				config: input.cfg
			}),
			payload: sourceReplyPayload,
			idempotencyKey,
			runId: input.runId,
			sourceReplyFinal: input.sourceReplyFinal,
			toolCallId: input.sourceReplyToolCallId,
			sourceTurnId: input.messageActionAuthorization?.toolContext?.currentSourceTurnId
		});
		persistedIdempotencyKey = idempotencyKey;
		persistedTranscriptOwner = true;
	}
	const payload = {
		status: "ok",
		deliveryStatus: dryRun ? "dry_run" : "sent",
		channel: INTERNAL_MESSAGE_CHANNEL,
		target: "current-run",
		sourceReplyDeliveryMode: input.sourceReplyDeliveryMode,
		...persistedIdempotencyKey ? { idempotencyKey: persistedIdempotencyKey } : {},
		...persistedTranscriptOwner ? { sourceReplyTranscriptOwner: true } : {},
		...dryRun ? {} : { sourceReplySink: "internal-ui" },
		sourceReply: sourceReplyPayload,
		...sourceReplyMessage ? { message: sourceReplyMessage } : {},
		...sourceReplyMediaUrls[0] ? { mediaUrl: sourceReplyMediaUrls[0] } : {},
		...sourceReplyMediaUrls.length ? { mediaUrls: sourceReplyMediaUrls } : {},
		dryRun
	};
	return withSendNormalization({
		kind: "send",
		channel: INTERNAL_MESSAGE_CHANNEL,
		action: "send",
		to: "current-run",
		handledBy: "internal-source",
		payload,
		toolResult: buildInternalSourceReplyToolResult(payload),
		dryRun
	}, sourceReply.normalization);
}
function buildInternalSourceReplyToolResult(payload) {
	const action = payload.dryRun ? "Prepared" : "Sent";
	const sink = payload.sourceReplySink ? ` via ${payload.sourceReplySink}` : "";
	const cards = readClawHubRecommendations(payload.sourceReply.channelData);
	const recommendationSummary = cards.length ? cards.map((card) => `${card.name}: ${card.installed ? "Installed" : "Available to install"}.`).join("\n") : payload.sourceReply.channelData?.["openclawClawHubRecommendations"] ? payload.sourceReply.text : void 0;
	return {
		content: [{
			type: "text",
			text: `${action} visible reply to the current source conversation${sink}.${recommendationSummary ? `\n${recommendationSummary}` : ""}`
		}],
		details: {
			status: payload.status,
			deliveryStatus: payload.deliveryStatus,
			channel: payload.channel,
			target: payload.target,
			...payload.sourceReplyDeliveryMode ? { sourceReplyDeliveryMode: payload.sourceReplyDeliveryMode } : {},
			...payload.idempotencyKey ? { idempotencyKey: payload.idempotencyKey } : {},
			...payload.sourceReplyTranscriptOwner ? { sourceReplyTranscriptOwner: true } : {},
			...payload.sourceReplySink ? { sourceReplySink: payload.sourceReplySink } : {},
			sourceReply: payload.sourceReply,
			...payload.message ? { message: payload.message } : {},
			...payload.mediaUrl ? { mediaUrl: payload.mediaUrl } : {},
			...payload.mediaUrls?.length ? { mediaUrls: payload.mediaUrls } : {},
			dryRun: payload.dryRun
		}
	};
}
async function runMessageAction(input) {
	throwIfAborted(input.abortSignal);
	const cfg = input.cfg;
	let params = { ...input.params };
	const resolvedAgentId = input.agentId ?? (input.sessionKey ? resolveSessionAgentId({
		sessionKey: input.sessionKey,
		config: cfg
	}) : void 0);
	parseJsonMessageParam(params, "presentation");
	parseJsonMessageParam(params, "delivery");
	parseInteractiveParam(params);
	const action = input.action;
	enforceMessageActionAllowlist({
		cfg,
		agentId: resolvedAgentId,
		action
	});
	if (params.clawhub !== void 0 && action !== "send") throw new Error("ClawHub recommendations require action=\"send\".");
	if (action === "broadcast") return handleBroadcastAction({
		...input,
		agentId: resolvedAgentId
	}, params);
	if (action === "send" && hasPollCreationParams(params)) throw new Error("Poll fields require action \"poll\"; use action \"poll\" instead of \"send\".");
	if (await shouldUseInternalSourceReplySink(input, params)) return handleInternalSourceReplySendAction({
		...input,
		agentId: resolvedAgentId
	}, params);
	if (params.clawhub !== void 0) throw new Error("ClawHub recommendation cards require action=\"send\" to the current Control UI conversation; omit channel and target.");
	const route = await prepareMessageRoute({
		input,
		actionParams: params,
		agentId: resolvedAgentId
	});
	return await withChannelReadAuthority(route.assertReadAuthorityCurrent, async () => {
		const context = await withMessageTargetPreparation(route.assertTargetAuthorityCurrent ?? input.assertDirectAdapterHandoff, async () => {
			params = route.params;
			const { channel, channelPlugin, accountId, dryRun, defersExternalTargetResolution } = route;
			const extraActionMediaSourceParamKeys = resolveExtraActionMediaSourceParamKeys({
				cfg,
				action,
				args: params,
				channel,
				accountId,
				sessionKey: input.sessionKey,
				sessionId: input.sessionId,
				agentId: resolvedAgentId,
				requesterSenderId: input.requesterSenderId,
				senderIsOwner: input.senderIsOwner
			});
			const structuredAttachmentMode = action === "send" ? "all" : "selected";
			const resolveMediaAccess = () => input.mediaAccess ?? resolveAgentScopedOutboundMediaAccess({
				cfg,
				agentId: resolvedAgentId,
				mediaSources: collectActionMediaSourceHints(params, extraActionMediaSourceParamKeys, { structuredAttachments: structuredAttachmentMode }),
				workspaceMediaAccess: input.workspaceMediaAccess,
				sessionKey: input.sessionKey,
				messageProvider: input.sessionKey ? void 0 : channel,
				accountId: input.sessionKey ? input.requesterAccountId ?? accountId : accountId,
				requesterSenderId: input.requesterSenderId,
				requesterSenderName: input.requesterSenderName,
				requesterSenderUsername: input.requesterSenderUsername,
				requesterSenderE164: input.requesterSenderE164
			});
			const mediaAccess = resolveMediaAccess();
			const sandboxMediaReadFile = input.workspaceMediaAccess?.readFile ? mediaAccess.readFile : void 0;
			const normalizationPolicy = resolveAttachmentMediaPolicy({
				sandboxRoot: input.sandboxRoot,
				sandboxContainerWorkdir: input.sandboxContainerWorkdir,
				mediaAccess,
				mediaReadFile: sandboxMediaReadFile
			});
			await normalizeSandboxMediaParams({
				args: params,
				mediaPolicy: normalizationPolicy,
				extraParamKeys: extraActionMediaSourceParamKeys,
				structuredAttachments: structuredAttachmentMode
			});
			const mediaPolicy = resolveAttachmentMediaPolicy({
				sandboxRoot: input.sandboxRoot,
				sandboxContainerWorkdir: input.sandboxContainerWorkdir,
				mediaAccess,
				mediaReadFile: sandboxMediaReadFile
			});
			const gateway = input.gateway;
			const preserveSendBuffer = action === "send" && Boolean(gateway) && (channelPlugin?.actions?.resolveExecutionMode?.({ action: "send" }) === "gateway" || channelPlugin?.outbound?.deliveryMode === "gateway");
			const hydrateActionAttachmentParams = () => hydrateAttachmentParamsForAction({
				cfg,
				channel,
				accountId,
				args: params,
				action,
				dryRun,
				preserveSendBuffer,
				mediaPolicy,
				extraParamKeys: extraActionMediaSourceParamKeys
			});
			if (action !== "send") await hydrateActionAttachmentParams();
			const resolvedTarget = await resolveMessageTarget({
				cfg,
				channel,
				action,
				args: params,
				accountId,
				toolContext: input.toolContext,
				agentId: resolvedAgentId,
				deferExternalTargetResolution: defersExternalTargetResolution,
				plugin: channelPlugin
			});
			if (action === "send") await hydrateActionAttachmentParams();
			return {
				cfg,
				params,
				idempotencyKey: normalizeOptionalString(params.idempotencyKey),
				channel,
				channelPlugin,
				mediaAccess,
				extraActionMediaSourceParamKeys,
				accountId,
				dryRun,
				gateway,
				input: route.assertTargetAuthorityCurrent ? {
					...input,
					assertDirectAdapterHandoff: route.assertTargetAuthorityCurrent
				} : input,
				agentId: resolvedAgentId,
				resolvedTarget,
				abortSignal: input.abortSignal
			};
		}, input.abortSignal);
		if (action === "send") return executeMessageSend(context);
		if (action === "poll") return executeMessagePoll(context);
		return executeMessagePlugin(context);
	}, input.abortSignal);
}
//#endregion
export { projectGatewayQueuedDeliveryResult as a, SHARED_POLL_CREATION_PARAM_NAMES as i, runMessageAction as n, projectMessageActionPartialDelivery as o, POLL_CREATION_PARAM_DEFS as r, hasAcceptedMessageActionResult as s, getToolResult as t };
