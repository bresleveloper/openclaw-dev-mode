import { D as resolveExpiresAtMsFromDurationMs, R as timestampMsToIsoString, g as isFutureDateTimestampMs, o as asDateTimestampMs, s as asFiniteNumber, w as parseStrictPositiveInteger } from "./number-coercion-CLj0HTDM.mjs";
import { t as asNonArrayRecord } from "./record-coerce-DItp3I4t.mjs";
import { c as normalizeOptionalLowercaseString } from "./string-coerce-CIXf7egm.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { r as createLazyRuntimeModule } from "./lazy-runtime-BPNHa36e.mjs";
import { n as computeBackoff, s as sleepWithAbort } from "./src-D4OikzaT.mjs";
import { a as resolveAgentDir, r as resolveAgentConfig } from "./agent-scope-config-IQKOEtZ4.mjs";
import { E as resolveStateDir } from "./paths-DehQwyE0.mjs";
import { f as resolveThreadSessionKeys } from "./session-key-CBvmC8zz.mjs";
import { n as normalizeAccountId } from "./account-id-B1bfbA5J.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { t as createSubsystemLogger } from "./subsystem-DleLyu58.mjs";
import { n as findModelInCatalog } from "./model-catalog-lookup-C3iQmurZ.mjs";
import { t as resolveDefaultModelForAgent } from "./model-selection-config-DZ4sk4C2.mjs";
import { i as logVerbose, o as shouldLogVerbose, t as danger } from "./globals-QODkv80i.mjs";
import { h as fireAndForgetHook, x as getGroupThreadDeliverySession } from "./hooks-DuXrq03h.mjs";
import { t as getGlobalHookRunner } from "./hook-runner-global-tOGjxVvH.mjs";
import { f as normalizeMessagePresentation } from "./payload-COvcWceu.mjs";
import { a as copyReplyPayloadMetadata, c as getReplyPayloadTtsSupplement, d as isFastModeAutoProgressPayload, i as buildTtsSupplementMediaPayload, p as isReplyPayloadNonTerminalToolErrorWarning } from "./reply-payload-B2ZQhznY.mjs";
import { t as collectReplyMediaEntries } from "./reply-media-entries-BifhlC95.mjs";
import { n as implicitMentionKindWhen, r as resolveInboundMentionDecision } from "./mention-gating-Cqy7URJJ.mjs";
import { n as firstDefined } from "./allow-from-Dq2DvsNl.mjs";
import { c as resolveTranscriptBackedChannelFinalText, l as selectLongerFinalText, r as preserveReplyPayloadMediaSelection, s as isPotentialTruncatedFinal, y as resolveChannelDraftStreamingChunking } from "./channel-outbound-r_EvcKqq.mjs";
import { r as modelSupportsVision } from "./model-catalog-Dt2JkTIv.mjs";
import { a as isInsideCode, r as findCodeRegions } from "./code-regions-NxEObIZm.mjs";
import { s as stripInlineDirectiveTagsForDelivery } from "./directive-tags-D9uZSb5h.mjs";
import "./error-runtime-Bf1fYXFh.mjs";
import "./string-coerce-runtime-C_MKhRVt.mjs";
import "./text-utility-runtime-D7I29NA0.mjs";
import { n as resolvePromptHistoryLimit } from "./history-limit-CbktwEI_.mjs";
import { h as stripReasoningTagsFromText } from "./assistant-visible-text-CVgfl6Gk.mjs";
import { r as normalizeCommandBody } from "./commands-registry-normalize-DJeLLZwD.mjs";
import { t as hasControlCommand } from "./command-detection-CzqdezWl.mjs";
import { r as toLocationContext, t as formatLocationText } from "./location-Ce8_SVWn.mjs";
import { n as createStructuredOutboundPayloadPlan, t as createOutboundPayloadPlan } from "./payloads-Ce1fWBq6.mjs";
import { a as resolveSendableOutboundReplyParts } from "./reply-payload-parts-G378iYNJ.mjs";
import { i as resolveHumanDelayConfig, t as resolveAckReaction } from "./identity-DdUdpaIE.mjs";
import { a as toInternalMessageReceivedContext } from "./message-hook-mappers-OANlfuGW.mjs";
import { u as resolveAskUserQuestionOptionIndices } from "./reply-payload-RBmrGrXG.mjs";
import { n as isSingleUseReplyToMode } from "./reply-reference-DtUaHKzS.mjs";
import { n as getAgentScopedMediaLocalRoots } from "./local-roots-CfRBR4Iu.mjs";
import { n as readAgentRunTerminalOutcome } from "./agent-run-terminal-outcome-gv15pQgO.mjs";
import { n as deriveLastRoutePolicy } from "./resolve-route-zfKT6ZcU.mjs";
import { r as matchesMentionWithExplicit, t as buildMentionRegexes } from "./mentions-BKW6zinj.mjs";
import { l as resolveGroupThreadMentionFacts } from "./dispatch-UrRhZie5.mjs";
import { n as createInternalHookEvent, u as triggerInternalHook } from "./internal-hooks-CUWGd3wf.mjs";
import { t as deriveDurableFinalDeliveryRequirements } from "./capabilities-CnBInN_D.mjs";
import { c as resolveTextChunkLimit, s as resolveChunkMode } from "./chunk-D0NagiTt.mjs";
import { C as resolveChannelStreamingBlockEnabled, D as resolveChannelStreamingPreviewToolProgress, b as resolveChannelProgressDraftMaxLineChars, x as resolveChannelProgressDraftMaxLines } from "./streaming-BRWehz40.mjs";
import { d as createChannelPartialDeliveryError, f as isChannelPartialDeliveryError, r as createPreviewMessageReceipt } from "./live-CJusMVR5.mjs";
import { n as resolveStoredModelOverride } from "./stored-model-overrides-Covy02dM.mjs";
import { i as PLUGIN_COMMAND_DISPATCH } from "./plugin-command-runtime-C0a5Fuzh.mjs";
import { n as isAbortRequestText } from "./abort-primitives-BbtQkqTs.mjs";
import "./runtime-env-BaPIl5PP.mjs";
import "./number-runtime-CGwowceO.mjs";
import "./routing-JKvWkBDR.mjs";
import "./agent-scope-runtime-OY7yRyJL.mjs";
import { a as resolveEnvelopeFormatOptions, r as formatInboundEnvelope } from "./envelope-Bh9h9lS4.mjs";
import { i as shouldAckReaction } from "./ack-reactions-BCgn-tQT.mjs";
import { t as evaluateSupplementalContextVisibility } from "./context-visibility-C5CaKMWO.mjs";
import { n as formatInboundMediaUnavailableText, r as formatMediaPlaceholderText } from "./media-EVtUZUR6.mjs";
import { t as resolveMarkdownTableMode } from "./markdown-tables-Cz69cRSY.mjs";
import { d as upsertChannelPairingRequest } from "./pairing-store-Cvj6ctV_.mjs";
import { u as formatReasoningMessage } from "./embedded-agent-utils-C9EyRsVl.mjs";
import { s as readLatestAssistantTextByIdentity, t as appendAssistantMirrorMessageByIdentity } from "./session-transcript-runtime-CcxVjmxZ.mjs";
import { n as resolveAmbientTranscriptWatermarkKey } from "./ambient-transcript-watermark-CHGJD06v.mjs";
import { h as resolveStorePath, i as getSessionEntry, l as readAmbientTranscriptWatermark } from "./session-store-runtime-XTMMGjZf.mjs";
import { t as resolveChannelContextVisibilityMode } from "./context-visibility-K6SDBmMz.mjs";
import { n as createChannelProgressDraftCompositor } from "./progress-draft-compositor-BiyWLSal.mjs";
import { t as generateConversationLabel } from "./conversation-label-generator-XEcSTTxI.mjs";
import "./reply-dispatch-runtime-grHURw9w.mjs";
import "./reply-reference-BbSBfc8h.mjs";
import "./reply-chunking-DVKHfn6G.mjs";
import { n as hasFinalChannelTurnDispatch } from "./dispatch-result-B75usq__.mjs";
import { t as createChannelReplyPipeline } from "./reply-pipeline-Ch5hnWyF.mjs";
import { a as runChannelInboundEvent, d as resolveUnmentionedGroupInboundPolicy, u as classifyChannelInboundEvent } from "./channel-inbound-DcAqUPMY.mjs";
import { n as logInboundDrop, r as logTypingFailure } from "./logging-skHYNt5A.mjs";
import "./media-runtime-CPk2kXLr.mjs";
import "./conversation-runtime-BdU2H6Dm.mjs";
import "./text-chunking-zFGQSbFt.mjs";
import { n as loadPreparedModelCatalog } from "./agent-runtime-vMVS3kbD.mjs";
import "./plugin-command-runtime-DXiBlOuP.mjs";
import "./plugin-runtime-BUxbDDeH.mjs";
import "./security-runtime-HdPo6iAV.mjs";
import "./hook-runtime-DeoQXeGo.mjs";
import "./markdown-table-runtime-DPs3qHnT.mjs";
import "./command-auth-native-l-wQHDTC.mjs";
import "./command-primitives-runtime-D37GE05g.mjs";
import "./command-detection-BoX4adnw.mjs";
import "./command-surface-CYAcQ-zz.mjs";
import "./channel-feedback-DMcRvvIi.mjs";
import { t as createChannelPairingChallengeIssuer } from "./channel-pairing-xxFGpirY.mjs";
import "./context-visibility-runtime-B2PdgaoL.mjs";
import { n as formatAudioTranscriptForAgent } from "./media-understanding-runtime-DLSLwAaH.mjs";
import "./state-paths-Bk2vDLZh.mjs";
import { i as normalizeAllowFrom, n as resolveTelegramDmAllow, o as resolveTelegramEffectiveDmPolicy, r as isSenderAllowed, t as expandTelegramAllowFromWithAccessGroups } from "./access-groups-Brlf3mfl.mjs";
import { a as resolveDefaultTelegramAccountId, o as resolveTelegramAccount } from "./accounts-ByNW1Cs3.mjs";
import { c as resolveTelegramTargetChatType, t as buildTelegramConversationId } from "./topic-conversation-BlxRQJEK.mjs";
import { d as shouldSuppressLocalTelegramExecApprovalPrompt } from "./exec-approvals-A4VORbgc.mjs";
import { n as getTelegramRuntime } from "./runtime-DiTlx7dk.mjs";
import { t as normalizeTelegramStateAccountId } from "./state-account-id-CdS1ON70.mjs";
import { A as hasBotMentionInText, C as shouldUseTelegramDmThreadSession, D as extractTelegramLocation, E as buildSenderName, F as resolveTelegramPrimaryMedia, L as resolveTelegramRichMessagePlaceholder, O as getTelegramTextParts, P as normalizeForwardedContext, R as resolveTelegramRichMessageText, T as buildSenderLabel, a as buildTelegramInboundOriginTarget, b as resolveTelegramReplyId, c as buildTelegramThreadParams, d as extractTelegramForumFlag, h as resolveTelegramForumFlag, i as buildTelegramGroupPeerId, j as hasLeadingBotCommandAddressedToOtherBot, k as hasBotMention, l as buildTypingThreadParams, m as resolveTelegramBotHasTopicsEnabled, n as buildGroupLabel, o as buildTelegramParentPeer, r as buildTelegramGroupFrom, u as describeReplyTarget, x as resolveTelegramStreamMode, y as resolveTelegramMessageThreadSpec, z as renderTelegramTextEntities } from "./helpers-TUQ5gNqR.mjs";
import { i as resolveTelegramTargetSession, n as resolveTelegramConversationBaseSessionKey, o as resolveTelegramDirectPeerId, r as resolveTelegramConversationRoute } from "./conversation-route-CYERzKEU.mjs";
import { C as resolveCompleteTelegramPromptContextProjectionIds, E as withTelegramPromptContextSource, F as renderTelegramHtmlText, G as resolveTelegramGroupPromptSettings, U as resolveTelegramDirectToolPolicy, W as resolveTelegramGroupIngestEnabled, a as buildTelegramRichMarkdown, r as TELEGRAM_RICH_TEXT_LIMIT, t as TELEGRAM_TEXT_CHUNK_LIMIT, w as resolveTelegramPromptContextDeliverySignature, x as createTelegramPromptContextProjectionSequence } from "./text-chunk-limit-Bdq_2BA_.mjs";
import { t as resolveTelegramAccountOwnerAgentId } from "./account-owner-CELLJV4K.mjs";
import { a as resolveTelegramInlineButtons, t as appendTelegramDroppedControlFallback } from "./button-types-B1wFSdoZ.mjs";
import { t as canonicalizeTelegramPresentationPayload } from "./interactive-fallback-JkJu-q0X.mjs";
import { i as registerTelegramQuestionDelivery } from "./outbound-adapter-xaYtouUN.mjs";
import { n as cacheSticker, t as describeStickerImage } from "./sticker-cache-BuShjoA8.mjs";
import { $ as isTelegramMessageFromCurrentBot, B as resolveTelegramStatusReactionEmojis, C as editMessageReplyMarkupTelegram, H as reportTelegramProviderDelivery, I as buildTelegramStatusReactionVariants, J as recordOutboundMessageForPromptContext, L as resolveTelegramAllowedReactions, R as resolveTelegramReactionEmoji, U as recordSentMessage, X as buildTelegramReplyChain, Y as buildTelegramConversationContext, Z as createTelegramMessageCache, at as selectTelegramGroupPromptContext, et as resolveProviderObservedTelegramThreadSpec, h as mergeTelegramPartialDeliveryError, it as isTelegramSelfSenderName, m as failPromptContextSequence, mt as TELEGRAM_CHAT_ACTION_INTERVAL_MS, nt as isTelegramChatWindowPromptContext, ot as telegramPromptContextHistory, rt as isTelegramHistoryEntryAfterAmbientWatermark, tt as buildTelegramSelfSenderName, vt as evaluateTelegramGroupBaseAccess, w as editMessageTelegram, z as resolveTelegramReactionVariant } from "./send-DZq2Pk_C.mjs";
import { t as withTelegramApiErrorLogging } from "./api-logging-DUw1mOtG.mjs";
import { p as resolveTelegramMessageCacheScope } from "./sent-message-cache.legacy-state-Ckozzcje.mjs";
import { c as createTelegramIngressResolver, f as resolveTelegramNativeCommandAdmission, l as createTelegramIngressSubject, m as telegramAllowEntries, n as telegramInboundEventDelivery, o as readTelegramHistoryWindow, p as resolveTelegramNativeCommandBody, r as isTelegramHistoryNodeAllowed, t as renderTelegramProgressDraftPreview, u as resolveTelegramCommandIngressAuthorization } from "./progress-draft-preview-DJV2Ac47.mjs";
import { n as getTopicName, o as resolveTopicNameCacheScope, s as updateTopicName } from "./topic-name-cache-DVMmy0yC.mjs";
import { a as emitTelegramMessageSentHooks, i as buildTelegramNativeQuoteCandidate, n as deliverStructuredReplies, r as addTelegramNativeQuoteCandidate, t as deliverReplies } from "./delivery-BFgt5rf6.mjs";
import { t as createTelegramDraftStream } from "./draft-stream-C4PptHzM.mjs";
import path from "node:path";
import { AsyncLocalStorage } from "node:async_hooks";
import os from "node:os";
//#region extensions/telegram/src/forum-service-message.ts
/** Telegram forum-topic service-message fields (Bot API). */
const TELEGRAM_FORUM_SERVICE_FIELDS = [
	"forum_topic_created",
	"forum_topic_edited",
	"forum_topic_closed",
	"forum_topic_reopened",
	"general_forum_topic_hidden",
	"general_forum_topic_unhidden"
];
/**
* Returns `true` when the message is a Telegram forum service message (e.g.
* "Topic created"). These auto-generated messages carry one of the
* `forum_topic_*` / `general_forum_topic_*` fields and should not count as
* regular bot replies for implicit-mention purposes.
*/
function isTelegramForumServiceMessage(msg) {
	if (!msg || typeof msg !== "object") return false;
	const messageRecord = msg;
	return TELEGRAM_FORUM_SERVICE_FIELDS.some((field) => field in messageRecord && messageRecord[field] != null);
}
//#endregion
//#region extensions/telegram/src/bot-message-context.body.ts
const loadStickerVisionRuntime = createLazyRuntimeModule(() => import("./sticker-vision.runtime.js"));
const loadMediaUnderstandingRuntime = createLazyRuntimeModule(() => import("./media-understanding.runtime.js"));
function resolveTelegramMentionFacts(params) {
	let mentionSource;
	if (params.explicitlyMentionedBot) mentionSource = "explicit_bot";
	else if (params.computedWasMentioned) mentionSource = "mention_pattern";
	else if (params.implicitMentionKinds && params.implicitMentionKinds.length > 0) mentionSource = "implicit_thread";
	else if (params.shouldBypassMention) mentionSource = "command_bypass";
	return {
		canDetectMention: params.canDetectMention,
		wasMentioned: params.effectiveWasMentioned,
		explicitlyMentionedBot: params.explicitlyMentionedBot,
		mentionSource,
		implicitMentionKinds: params.implicitMentionKinds,
		effectiveWasMentioned: params.effectiveWasMentioned,
		requireMention: params.requireMention
	};
}
async function resolveStickerVisionSupport$1(params) {
	try {
		const { resolveStickerVisionSupportRuntime } = await loadStickerVisionRuntime();
		return await resolveStickerVisionSupportRuntime(params);
	} catch {
		return false;
	}
}
async function resolveTelegramInboundBody(params) {
	const { cfg, primaryCtx, msg, allMedia, isGroup, chatId, accountId, senderId, senderUsername, sessionKey, resolvedThreadId, replyThreadId, threadSpec, originatingTo: providedOriginatingTo, routeAgentId, effectiveGroupAllow, effectiveDmAllow, groupConfig, topicConfig, providerMentionPatterns, requireMention, options, logger } = params;
	const botUsername = normalizeOptionalLowercaseString(primaryCtx.me?.username);
	const mentionRegexes = buildMentionRegexes(cfg, routeAgentId, {
		provider: "telegram",
		conversationId: isGroup ? buildTelegramGroupPeerId(chatId, threadSpec) : String(chatId),
		providerPolicy: providerMentionPatterns
	});
	const messageTextParts = getTelegramTextParts(msg);
	if (botUsername && hasLeadingBotCommandAddressedToOtherBot(msg, botUsername)) {
		logInboundDrop({
			log: logVerbose,
			channel: "telegram",
			reason: "command addressed to another bot",
			target: senderId ?? "unknown"
		});
		return null;
	}
	const allowForCommands = isGroup ? effectiveGroupAllow : effectiveDmAllow;
	const hasControlCommandInMessage = hasControlCommand(messageTextParts.text, cfg, { botUsername });
	const commandGate = await resolveTelegramCommandIngressAuthorization({
		accountId: accountId ?? "default",
		cfg,
		dmPolicy: "pairing",
		isGroup,
		chatId,
		resolvedThreadId,
		senderId,
		effectiveDmAllow,
		effectiveGroupAllow,
		eventKind: "message",
		allowTextCommands: true,
		hasControlCommand: hasControlCommandInMessage,
		modeWhenAccessGroupsOff: "allow",
		includeDmAllowForGroupCommands: false
	});
	const commandAuthorized = commandGate.authorized;
	const nativeCommandBody = resolveTelegramNativeCommandBody({
		msg,
		nativeCommandNames: params.nativeCommandNames,
		botUsername
	});
	const commandSource = options?.commandSource ?? (nativeCommandBody !== void 0 ? "native" : commandAuthorized && hasControlCommandInMessage ? "text" : void 0);
	const historyKey = isGroup ? buildTelegramGroupPeerId(chatId, threadSpec) : void 0;
	const originatingTo = providedOriginatingTo ?? buildTelegramInboundOriginTarget(chatId, threadSpec);
	const primaryMedia = resolveTelegramPrimaryMedia(msg);
	const nativeMediaFacts = allMedia.length > 0 ? allMedia : primaryMedia ? [{ kind: primaryMedia.kind }] : [];
	const cachedStickerDescription = allMedia[0]?.stickerMetadata?.cachedDescription;
	const stickerHasMedia = Boolean(msg.sticker) && allMedia.some((media) => media.kind === "sticker" && media.path);
	const stickerSupportsVision = stickerHasMedia ? await resolveStickerVisionSupport$1({
		cfg,
		agentId: routeAgentId
	}) : false;
	const stickerCacheHit = Boolean(cachedStickerDescription) && !stickerSupportsVision;
	let formattedStickerDescription;
	if (stickerCacheHit) {
		const emoji = allMedia[0]?.stickerMetadata?.emoji;
		const setName = allMedia[0]?.stickerMetadata?.setName;
		const stickerContext = [emoji, setName ? `from "${setName}"` : null].filter(Boolean).join(" ");
		formattedStickerDescription = `[Sticker${stickerContext ? ` ${stickerContext}` : ""}] ${cachedStickerDescription}`;
	}
	const locationData = extractTelegramLocation(msg);
	const locationText = locationData ? formatLocationText(locationData) : void 0;
	const rawText = renderTelegramTextEntities(messageTextParts.text, messageTextParts.entities).trim();
	const richText = resolveTelegramRichMessageText(msg);
	const hasUserText = Boolean(rawText || locationText);
	let rawBody = [rawText, locationText].filter(Boolean).join("\n").trim();
	if (!rawBody) rawBody = richText ?? resolveTelegramRichMessagePlaceholder(msg) ?? "";
	if (!rawBody && msg.sticker && !stickerHasMedia && !formattedStickerDescription) rawBody = msg.sticker.emoji?.trim() || formatMediaPlaceholderText(nativeMediaFacts);
	if (!rawBody && nativeMediaFacts.length === 0) return null;
	let bodyText = rawBody;
	if (formattedStickerDescription) bodyText = [formattedStickerDescription, rawBody].filter(Boolean).join("\n");
	const isAudioMedia = (media) => media.kind === "audio" || media.contentType?.startsWith("audio/") === true;
	const hasAudio = nativeMediaFacts.some(isAudioMedia);
	const materializedMedia = allMedia.filter((media) => Boolean(media.path));
	const materializedAudioIndex = allMedia.findIndex((media) => Boolean(media.path) && isAudioMedia(media));
	const disableAudioPreflight = (topicConfig?.disableAudioPreflight ?? groupConfig?.disableAudioPreflight) === true;
	const senderAllowedForAudioPreflight = !allowForCommands.hasEntries || commandAuthorized;
	let preflightTranscript;
	if (hasAudio && materializedAudioIndex >= 0 && !hasUserText && (!isGroup || requireMention && mentionRegexes.length > 0 && !disableAudioPreflight && senderAllowedForAudioPreflight)) try {
		const { transcribeFirstAudio } = await loadMediaUnderstandingRuntime();
		preflightTranscript = await transcribeFirstAudio({
			ctx: {
				Provider: "telegram",
				Surface: "telegram",
				OriginatingChannel: "telegram",
				OriginatingTo: originatingTo,
				AccountId: accountId,
				MessageThreadId: replyThreadId,
				media: materializedMedia
			},
			cfg,
			agentDir: void 0
		});
	} catch (err) {
		logVerbose(`telegram: audio preflight transcription failed: ${String(err)}`);
	}
	const audioTranscribedMediaIndex = preflightTranscript === void 0 ? void 0 : materializedAudioIndex;
	if (hasAudio && !rawBody && preflightTranscript) bodyText = formatAudioTranscriptForAgent(preflightTranscript);
	const historyBody = rawBody || formattedStickerDescription || formatMediaPlaceholderText(nativeMediaFacts);
	const hasAnyMention = messageTextParts.entities.some((ent) => ent.type === "mention");
	const explicitlyMentioned = botUsername ? hasBotMention(msg, botUsername, primaryCtx.me?.id) || (richText ? hasBotMentionInText(richText, botUsername) : false) : false;
	const groupThread = resolveGroupThreadMentionFacts({
		cfg,
		channel: "telegram",
		peerId: isGroup ? String(chatId) : resolveTelegramDirectPeerId({
			chatId,
			senderId
		}),
		text: [
			messageTextParts.text,
			richText,
			preflightTranscript
		].filter(Boolean).join("\n"),
		sessionKey: params.sessionKey,
		acpBinding: params.acpBinding
	});
	const computedWasMentioned = Boolean(groupThread?.mentionedAgentIds.length) || matchesMentionWithExplicit({
		text: messageTextParts.text || richText || "",
		mentionRegexes,
		explicit: {
			hasAnyMention,
			isExplicitlyMentioned: explicitlyMentioned,
			canResolveExplicit: Boolean(botUsername)
		},
		transcript: preflightTranscript
	});
	const wasMentioned = options?.forceWasMentioned === true || commandSource === "native" && commandAuthorized || computedWasMentioned;
	if (isGroup && (commandGate.shouldBlockControlCommand || commandSource === "native" && !commandAuthorized)) {
		logInboundDrop({
			log: logVerbose,
			channel: "telegram",
			reason: "control command (unauthorized)",
			target: senderId ?? "unknown"
		});
		return null;
	}
	const botId = primaryCtx.me?.id;
	const replyFromId = msg.reply_to_message?.from?.id;
	const replyToBotMessage = botId != null && replyFromId === botId;
	const isReplyToServiceMessage = replyToBotMessage && isTelegramForumServiceMessage(msg.reply_to_message);
	const implicitMentionKinds = implicitMentionKindWhen("reply_to_bot", replyToBotMessage && !isReplyToServiceMessage);
	const canDetectMention = Boolean(groupThread) || Boolean(botUsername) || mentionRegexes.length > 0;
	const mentionDecision = resolveInboundMentionDecision({
		facts: {
			canDetectMention,
			wasMentioned,
			hasAnyMention,
			implicitMentionKinds: isGroup ? implicitMentionKinds : []
		},
		policy: {
			isGroup,
			requireMention: Boolean(requireMention),
			allowTextCommands: true,
			hasControlCommand: hasControlCommandInMessage,
			commandAuthorized
		}
	});
	const effectiveWasMentioned = mentionDecision.effectiveWasMentioned;
	const inboundEventKind = classifyChannelInboundEvent({
		conversation: { kind: isGroup ? "group" : "direct" },
		unmentionedGroupPolicy: resolveUnmentionedGroupInboundPolicy({
			cfg,
			agentId: routeAgentId
		}),
		wasMentioned: effectiveWasMentioned,
		hasControlCommand: hasControlCommandInMessage,
		hasAbortRequest: isAbortRequestText(rawBody, { botUsername }),
		commandSource
	});
	if (isGroup && requireMention && canDetectMention && mentionDecision.shouldSkip) {
		logger.info({
			chatId,
			reason: "no-mention"
		}, "skipping group message");
		if (sessionKey && resolveTelegramGroupIngestEnabled({
			cfg,
			chatId,
			accountId,
			topicConfig
		})) fireAndForgetHook(triggerInternalHook(createInternalHookEvent("message", "received", sessionKey, toInternalMessageReceivedContext({
			from: `telegram:group:${historyKey ?? chatId}`,
			to: originatingTo,
			content: historyBody,
			timestamp: msg.date ? msg.date * 1e3 : void 0,
			channelId: "telegram",
			accountId,
			conversationId: originatingTo,
			messageId: typeof msg.message_id === "number" ? String(msg.message_id) : void 0,
			senderId: senderId || void 0,
			senderName: buildSenderName(msg),
			senderUsername: senderUsername || void 0,
			provider: "telegram",
			surface: "telegram",
			threadId: resolvedThreadId,
			originatingChannel: "telegram",
			originatingTo,
			isGroup: true,
			groupId: `telegram:${chatId}`,
			media: materializedMedia.map(({ path, contentType, kind, sourceMessageId }) => ({
				path,
				contentType,
				kind,
				messageId: sourceMessageId ?? String(msg.message_id)
			}))
		}))), "telegram: mention-skip message hook failed");
		return null;
	}
	return {
		bodyText,
		rawBody,
		historyKey,
		commandAuthorized,
		effectiveWasMentioned,
		inboundEventKind,
		groupThread,
		mentionFacts: resolveTelegramMentionFacts({
			canDetectMention,
			effectiveWasMentioned,
			explicitlyMentionedBot: explicitlyMentioned,
			computedWasMentioned,
			implicitMentionKinds,
			requireMention: Boolean(requireMention),
			shouldBypassMention: mentionDecision.shouldBypassMention
		}),
		canDetectMention,
		shouldBypassMention: mentionDecision.shouldBypassMention,
		commandSource,
		nativeCommandBody,
		...audioTranscribedMediaIndex !== void 0 && audioTranscribedMediaIndex >= 0 ? { audioTranscribedMediaIndex } : {},
		stickerCacheHit,
		locationData: locationData ?? void 0
	};
}
//#endregion
//#region extensions/telegram/src/prompt-media-path.ts
function resolveTelegramInboundMediaUri(id) {
	if (!id || id === "." || id === ".." || id.includes("/") || id.includes("\\") || id.includes("\0")) return;
	return `media://inbound/${encodeURIComponent(id)}`;
}
function decodeInboundMediaId(id) {
	try {
		return decodeURIComponent(id);
	} catch {
		return;
	}
}
function resolveTelegramPromptMediaPath(mediaPath) {
	const canonicalMatch = /^media:\/\/inbound\/([^/\\]+)$/i.exec(mediaPath);
	if (canonicalMatch?.[1]) {
		const id = decodeInboundMediaId(canonicalMatch[1]);
		return id ? resolveTelegramInboundMediaUri(id) : void 0;
	}
	const normalized = mediaPath.replace(/\\/g, "/");
	if (!normalized.includes("/media/inbound/")) return;
	return resolveTelegramInboundMediaUri(path.posix.basename(normalized));
}
//#endregion
//#region extensions/telegram/src/bot-message-context.session.ts
const sessionRuntimeMethods = [
	"buildChannelInboundEventContext",
	"readAmbientTranscriptWatermark",
	"readSessionUpdatedAt",
	"recordInboundSession",
	"resolveAmbientTranscriptWatermarkKey",
	"resolveInboundLastRouteSessionKey",
	"resolvePinnedMainDmOwnerFromAllowlist",
	"resolveStorePath"
];
function hasCompleteSessionRuntime(runtime) {
	return Boolean(runtime && sessionRuntimeMethods.every((method) => typeof runtime[method] === "function"));
}
async function loadTelegramMessageContextSessionRuntime(runtime) {
	if (hasCompleteSessionRuntime(runtime)) return runtime;
	return {
		...await import("./bot-message-context.session.runtime.js"),
		...runtime
	};
}
async function resolveTelegramMessageContextStorePath(params) {
	return (await loadTelegramMessageContextSessionRuntime(params.sessionRuntime)).resolveStorePath(params.cfg.session?.store, { agentId: params.agentId });
}
function replyTargetToChainEntry(replyTarget, media) {
	return {
		...replyTarget.id ? { messageId: replyTarget.id } : {},
		sender: replyTarget.sender,
		...replyTarget.senderId ? { senderId: replyTarget.senderId } : {},
		...replyTarget.senderUsername ? { senderUsername: replyTarget.senderUsername } : {},
		...replyTarget.body ? { body: replyTarget.body } : {},
		...replyTarget.mediaType ? {
			mediaKind: replyTarget.mediaType,
			mediaType: replyTarget.mediaType
		} : {},
		...media?.path ? {
			mediaPath: media.path,
			mediaKind: media.kind,
			...media.contentType ? { mediaType: media.contentType } : {}
		} : {},
		...replyTarget.kind === "quote" ? { isQuote: true } : {},
		...replyTarget.forwardedFrom?.from ? { forwardedFrom: replyTarget.forwardedFrom.from } : {},
		...replyTarget.forwardedFrom?.fromId ? { forwardedFromId: replyTarget.forwardedFrom.fromId } : {},
		...replyTarget.forwardedFrom?.fromUsername ? { forwardedFromUsername: replyTarget.forwardedFrom.fromUsername } : {},
		...replyTarget.forwardedFrom?.date ? { forwardedDate: replyTarget.forwardedFrom.date * 1e3 } : {}
	};
}
function stripReplyChainForwarded(entry) {
	const { forwardedFrom: _forwardedFrom, forwardedFromId: _forwardedFromId, forwardedFromUsername: _forwardedFromUsername, forwardedDate: _forwardedDate, ...withoutForwarded } = entry;
	return withoutForwarded;
}
function formatTelegramForwardedMessageBody(params) {
	const forwardedAt = timestampMsToIsoString(params.forwardedDate);
	return [params.forwardedFrom ? `[Forwarded from ${params.forwardedFrom}${forwardedAt ? ` at ${forwardedAt}` : ""}]` : void 0, params.body].filter(Boolean).join("\n");
}
function formatReplyChainEntry(entry, index) {
	const mediaPath = entry.mediaPath ? resolveTelegramPromptMediaPath(entry.mediaPath) : void 0;
	const labels = [
		`${index + 1}. ${entry.sender ?? "unknown sender"}`,
		entry.messageId ? `id:${entry.messageId}` : void 0,
		entry.replyToId ? `reply_to:${entry.replyToId}` : void 0,
		entry.timestamp ? timestampMsToIsoString(entry.timestamp) : void 0
	].filter(Boolean);
	const bodyLines = [
		formatTelegramForwardedMessageBody({
			body: entry.isQuote && entry.body ? `"${entry.body}"` : entry.body ?? "",
			forwardedFrom: entry.forwardedFrom,
			forwardedDate: entry.forwardedDate
		}),
		entry.mediaKind || entry.mediaType ? formatMediaPlaceholderText([entry.mediaKind ? { kind: entry.mediaKind } : isTelegramMediaKind(entry.mediaType ?? "") ? { kind: entry.mediaType } : { contentType: entry.mediaType }]) : void 0,
		mediaPath ? `[media_path:${mediaPath}]` : void 0,
		entry.mediaRef ? `[media_ref:${entry.mediaRef}]` : void 0
	].filter(Boolean);
	return `[${labels.join(" ")}]\n${bodyLines.join("\n")}`;
}
const TELEGRAM_MEDIA_KINDS = /* @__PURE__ */ new Set([
	"audio",
	"document",
	"image",
	"sticker",
	"video"
]);
function isTelegramMediaKind(value) {
	return TELEGRAM_MEDIA_KINDS.has(value);
}
async function buildTelegramInboundContextPayload(params) {
	const { cfg, primaryCtx, msg, allMedia, replyMedia, replyChain, promptContext, isGroup, isForum, chatId, senderId, senderUsername, resolvedThreadId, dmThreadId, threadSpec, route, rawBody, bodyText, historyKey, historyLimit, dmHistoryLimit, groupConfig, topicConfig, effectiveWasMentioned, inboundEventKind, groupRequireMention, mentionFacts, commandSource, nativeCommandBody, stickerCacheHit, audioTranscribedMediaIndex, commandAuthorized, locationData, options, dmAllowFrom, effectiveGroupAllow, topicName, sessionRuntime: sessionRuntimeOverride } = params;
	const replyTarget = describeReplyTarget(msg);
	const bufferedMessages = options?.bufferedMessages ?? [];
	const shouldRenderBufferedBody = bufferedMessages.length > 1 && options?.ingressBuffer !== "text-batch";
	const forwardOrigin = shouldRenderBufferedBody ? null : normalizeForwardedContext(msg);
	const contextVisibilityMode = resolveChannelContextVisibilityMode({
		cfg,
		channel: "telegram",
		accountId: route.accountId
	});
	const shouldIncludeGroupSupplementalContext = (paramsLocal) => {
		if (!isGroup) return true;
		const senderAllowed = effectiveGroupAllow?.hasEntries ? isSenderAllowed({
			allow: effectiveGroupAllow,
			senderId: paramsLocal.senderId,
			senderUsername: paramsLocal.senderUsername
		}) : true;
		return evaluateSupplementalContextVisibility({
			mode: contextVisibilityMode,
			kind: paramsLocal.kind,
			senderAllowed
		}).include;
	};
	const resolveVisibleReplyTarget = (target) => {
		if (!target || !shouldIncludeGroupSupplementalContext({
			kind: "quote",
			senderId: target.senderId,
			senderUsername: target.senderUsername
		})) return null;
		const forwardedFrom = target.forwardedFrom && shouldIncludeGroupSupplementalContext({
			kind: "forwarded",
			senderId: target.forwardedFrom.fromId,
			senderUsername: target.forwardedFrom.fromUsername
		}) ? target.forwardedFrom : void 0;
		return {
			...target,
			forwardedFrom
		};
	};
	const includeForwardOrigin = forwardOrigin ? shouldIncludeGroupSupplementalContext({
		kind: "forwarded",
		senderId: forwardOrigin.fromId,
		senderUsername: forwardOrigin.fromUsername
	}) : false;
	const visibleReplyTarget = resolveVisibleReplyTarget(replyTarget);
	const visibleReplyTargetEntry = visibleReplyTarget ? replyTargetToChainEntry(visibleReplyTarget, replyChain.length === 0 ? replyMedia[0] : void 0) : void 0;
	const inheritedReplyChain = replyChain.length > 0 ? replyChain : visibleReplyTargetEntry ? [visibleReplyTargetEntry] : [];
	const seenReplyMessageIds = /* @__PURE__ */ new Set();
	const rawReplyChain = [];
	const appendReplyChainEntry = (entry) => {
		if (!entry || rawReplyChain.length >= 4) return;
		if (entry.messageId !== void 0) {
			if (seenReplyMessageIds.has(entry.messageId)) return;
			seenReplyMessageIds.add(entry.messageId);
		}
		rawReplyChain.push(entry);
	};
	for (let index = bufferedMessages.length - 1; index >= 1 && rawReplyChain.length < 4; index -= 1) {
		const bufferedMessage = bufferedMessages[index];
		if (!bufferedMessage) continue;
		const visible = resolveVisibleReplyTarget(describeReplyTarget(bufferedMessage));
		appendReplyChainEntry(visible ? replyTargetToChainEntry(visible) : void 0);
	}
	for (const entry of inheritedReplyChain) {
		if (rawReplyChain.length >= 4) break;
		appendReplyChainEntry(entry);
	}
	const visibleReplyChain = rawReplyChain.flatMap((entry) => {
		const selectedReplyEntry = entry.messageId === visibleReplyTargetEntry?.messageId ? visibleReplyTargetEntry : void 0;
		const visibleEntry = {
			...entry,
			...selectedReplyEntry,
			sender: entry.sender,
			senderId: entry.senderId,
			senderUsername: entry.senderUsername
		};
		if (!shouldIncludeGroupSupplementalContext({
			kind: "quote",
			senderId: visibleEntry.senderId,
			senderUsername: visibleEntry.senderUsername
		})) return [];
		return [visibleEntry.forwardedFrom && shouldIncludeGroupSupplementalContext({
			kind: "forwarded",
			senderId: visibleEntry.forwardedFromId,
			senderUsername: visibleEntry.forwardedFromUsername
		}) ? visibleEntry : stripReplyChainForwarded(visibleEntry)];
	});
	const visibleForwardOrigin = includeForwardOrigin ? forwardOrigin : null;
	const bufferedBodySegments = shouldRenderBufferedBody ? bufferedMessages.flatMap((bufferedMessage) => {
		const bufferedMedia = resolveTelegramPrimaryMedia(bufferedMessage);
		const textParts = getTelegramTextParts(bufferedMessage);
		const segmentBody = renderTelegramTextEntities(textParts.text, textParts.entities) || formatMediaPlaceholderText(bufferedMedia ? [{ kind: bufferedMedia.kind }] : []);
		if (!segmentBody) return [];
		const bufferedForwardOrigin = normalizeForwardedContext(bufferedMessage);
		const visibleBufferedForwardOrigin = bufferedForwardOrigin && shouldIncludeGroupSupplementalContext({
			kind: "forwarded",
			senderId: bufferedForwardOrigin.fromId,
			senderUsername: bufferedForwardOrigin.fromUsername
		}) ? bufferedForwardOrigin : null;
		return [formatTelegramForwardedMessageBody({
			body: segmentBody,
			forwardedFrom: visibleBufferedForwardOrigin?.from,
			forwardedDate: visibleBufferedForwardOrigin?.date ? visibleBufferedForwardOrigin.date * 1e3 : void 0
		})];
	}) : void 0;
	const visibleBodyText = bufferedBodySegments?.length ? bufferedBodySegments.join("\n") : formatTelegramForwardedMessageBody({
		body: bodyText,
		forwardedFrom: visibleForwardOrigin?.from,
		forwardedDate: visibleForwardOrigin?.date ? visibleForwardOrigin.date * 1e3 : void 0
	});
	const unavailableMedia = allMedia.flatMap((media) => media.unavailable ? [media.unavailable] : []);
	const unavailableReason = allMedia.length > 1 ? `${unavailableMedia.length} of ${allMedia.length} attachments could not be downloaded` : unavailableMedia[0]?.reason === "oversize" ? `file exceeds ${unavailableMedia[0].limitMb}MB limit` : "download failed";
	const appendMediaUnavailableNotice = (text) => unavailableMedia.length > 0 ? formatInboundMediaUnavailableText({
		body: text,
		notice: `[media unavailable: ${unavailableReason}]`
	}) : text;
	const replySuffix = visibleReplyChain.length > 0 ? `\n\n[Reply chain - nearest first]\n${visibleReplyChain.map(formatReplyChainEntry).join("\n")}\n[/Reply chain]` : "";
	const groupLabel = isGroup ? buildGroupLabel(msg, chatId, resolvedThreadId) : void 0;
	const senderName = buildSenderName(msg);
	const conversationLabel = isGroup ? groupLabel ?? `group:${chatId}` : buildSenderLabel(msg, senderId || chatId);
	const sessionRuntime = await loadTelegramMessageContextSessionRuntime(sessionRuntimeOverride);
	const storePath = await resolveTelegramMessageContextStorePath({
		cfg,
		agentId: route.agentId,
		sessionRuntime: sessionRuntimeOverride
	});
	const envelopeOptions = resolveEnvelopeFormatOptions(cfg);
	const previousTimestamp = sessionRuntime.readSessionUpdatedAt({
		storePath,
		sessionKey: route.sessionKey
	});
	const ambientTranscriptWatermarkKey = isGroup && historyKey ? sessionRuntime.resolveAmbientTranscriptWatermarkKey({
		channel: "telegram",
		accountId: route.accountId,
		conversationId: String(chatId),
		...resolvedThreadId !== void 0 ? { threadId: resolvedThreadId } : {}
	}) : void 0;
	const ambientTranscriptWatermark = ambientTranscriptWatermarkKey ? sessionRuntime.readAmbientTranscriptWatermark({
		storePath,
		sessionKey: route.sessionKey,
		key: ambientTranscriptWatermarkKey
	}) : void 0;
	const baseVisiblePromptContext = !isGroup && previousTimestamp !== void 0 && dmThreadId == null && visibleReplyChain.length === 0 && !visibleReplyTarget ? promptContext.filter((entry) => !isTelegramChatWindowPromptContext(entry)) : promptContext;
	const body = formatInboundEnvelope({
		channel: "Telegram",
		from: conversationLabel,
		timestamp: msg.date ? msg.date * 1e3 : void 0,
		body: `${appendMediaUnavailableNotice(visibleBodyText)}${replySuffix}`,
		chatType: isGroup ? "group" : "direct",
		sender: {
			name: senderName,
			username: senderUsername || void 0,
			id: senderId || void 0
		},
		previousTimestamp,
		envelope: envelopeOptions
	});
	const hasGroupHistoryContext = isGroup;
	const commandBody = normalizeCommandBody(nativeCommandBody ?? rawBody, {
		botUsername: normalizeOptionalLowercaseString(primaryCtx.me?.username),
		preserveArguments: true
	});
	const conversationKind = isGroup ? "group" : "direct";
	const visiblePromptContext = isGroup ? selectTelegramGroupPromptContext({
		promptContext: baseVisiblePromptContext,
		historyLimit,
		ambientWatermark: ambientTranscriptWatermark,
		includeBeforeSelf: inboundEventKind === "room_event"
	}) : baseVisiblePromptContext;
	const groupHistoryPromptEntries = telegramPromptContextHistory(visiblePromptContext);
	const { skillFilter, groupSystemPrompt } = resolveTelegramGroupPromptSettings({
		groupConfig,
		topicConfig
	});
	const replyHead = visibleReplyChain[0];
	const toInboundMedia = (media, index) => ({
		...media.path ? {
			path: media.path,
			url: media.path
		} : {},
		contentType: media.contentType,
		...media.fileName ? { fileName: media.fileName } : {},
		kind: media.kind,
		transcribed: index !== void 0 && audioTranscribedMediaIndex === index
	});
	const currentMediaFacts = allMedia.map(toInboundMedia);
	const toReplyChainMediaFact = (entry) => entry.mediaPath || entry.mediaKind || entry.mediaType ? {
		...entry.mediaPath ? {
			path: entry.mediaPath,
			url: entry.mediaPath
		} : {},
		...entry.mediaKind ? { kind: entry.mediaKind } : {},
		...entry.mediaType ? isTelegramMediaKind(entry.mediaType) ? entry.mediaKind ? {} : { kind: entry.mediaType } : { contentType: entry.mediaType } : {}
	} : void 0;
	const replyMediaFacts = visibleReplyChain.length > 0 ? visibleReplyChain.flatMap((entry) => {
		const media = toReplyChainMediaFact(entry);
		return media ? [media] : [];
	}) : visibleReplyTarget ? replyMedia.length > 0 ? replyMedia.map((media) => toInboundMedia(media)) : visibleReplyTarget.mediaType ? [{ kind: visibleReplyTarget.mediaType }] : [] : [];
	const replyTargetMedia = (replyHead ? toReplyChainMediaFact(replyHead) : void 0) ?? (visibleReplyTarget?.mediaType ? { kind: visibleReplyTarget.mediaType } : void 0);
	const replyBody = replyHead?.body ?? visibleReplyTarget?.body ?? (replyTargetMedia ? formatMediaPlaceholderText([replyTargetMedia]) : void 0);
	const telegramFrom = isGroup ? buildTelegramGroupFrom(chatId, threadSpec) : `telegram:${chatId}`;
	const telegramTo = buildTelegramInboundOriginTarget(chatId, threadSpec);
	const locationContext = locationData ? toLocationContext(locationData) : void 0;
	const telegramUpdate = primaryCtx.update;
	const providerUpdateKind = telegramUpdate ? "edited_message" in telegramUpdate ? "edited_message" : "message" in telegramUpdate ? "message" : "edited_channel_post" in telegramUpdate ? "edited_channel_post" : "channel_post" in telegramUpdate ? "channel_post" : void 0 : void 0;
	const inboundHistory = hasGroupHistoryContext && historyKey && historyLimit > 0 ? groupHistoryPromptEntries.length > 0 ? groupHistoryPromptEntries : void 0 : void 0;
	const messageId = options?.messageIdOverride ?? String(msg.message_id);
	const ingressContextBinding = Object.freeze({
		agentId: route.agentId,
		sessionKey: route.sessionKey,
		messageId,
		inboundEventKind
	});
	const channelIngress = options?.channelIngressResolvers ? await Promise.all(options.channelIngressResolvers.map((resolveChannelIngress) => resolveChannelIngress(ingressContextBinding))) : void 0;
	const ctxPayload = await sessionRuntime.buildChannelInboundEventContext({
		channel: "telegram",
		channelIngress,
		resolveSupplementalMedia: true,
		accountId: route.accountId,
		messageId,
		timestamp: msg.date ? msg.date * 1e3 : void 0,
		from: telegramFrom,
		sender: {
			...senderId ? { id: senderId } : {},
			name: senderName,
			username: senderUsername || void 0,
			isBot: msg.from?.is_bot
		},
		conversation: {
			kind: conversationKind,
			id: String(chatId),
			routePeer: {
				kind: conversationKind,
				id: isGroup ? buildTelegramConversationId({
					chatId,
					thread: threadSpec
				}) : resolveTelegramDirectPeerId({
					chatId,
					senderId
				})
			},
			label: conversationLabel,
			parentId: buildTelegramParentPeer({
				isGroup,
				resolvedThreadId: threadSpec.id,
				chatId
			})?.id,
			threadId: threadSpec.id != null ? String(threadSpec.id) : void 0
		},
		route: {
			...route,
			routeSessionKey: route.sessionKey,
			mainSessionKey: route.mainSessionKey
		},
		reply: {
			to: telegramTo,
			replyToId: replyHead?.messageId ?? visibleReplyTarget?.id,
			messageThreadId: threadSpec.id
		},
		message: {
			inboundEventKind,
			body,
			rawBody,
			bodyForAgent: appendMediaUnavailableNotice(shouldRenderBufferedBody ? visibleBodyText : bodyText),
			commandBody,
			inboundHistory,
			sourceModality: msg.voice ? "voice" : void 0
		},
		sessionTranscript: {
			chatWindow: true,
			historyLimit: isGroup ? historyLimit : dmHistoryLimit,
			beforeTimestampMs: options?.receivedAtMs ?? (msg.date ? msg.date * 1e3 : void 0),
			minTimestampMs: options?.promptContextMinTimestampMs,
			senderLabels: {
				assistant: "OpenClaw",
				user: "User"
			}
		},
		access: {
			commands: { authorized: commandAuthorized },
			toolPolicy: isGroup ? void 0 : resolveTelegramDirectToolPolicy({
				directConfig: groupConfig,
				senderId,
				senderName,
				senderUsername
			}),
			mentions: mentionFacts
		},
		command: commandSource === "native" ? {
			kind: "native",
			authorized: commandAuthorized,
			body: commandBody
		} : commandSource === "text" ? {
			kind: "text-slash",
			authorized: commandAuthorized,
			body: commandBody
		} : void 0,
		media: currentMediaFacts,
		supplemental: {
			quote: replyHead || visibleReplyTarget ? {
				id: replyHead?.messageId ?? visibleReplyTarget?.id,
				body: replyBody,
				sender: replyHead?.sender ?? visibleReplyTarget?.sender,
				senderAllowed: true,
				isQuote: replyHead?.isQuote ?? (visibleReplyTarget?.kind === "quote" ? true : void 0),
				media: replyMediaFacts
			} : void 0,
			forwarded: visibleForwardOrigin ? {
				from: visibleForwardOrigin.from,
				fromType: visibleForwardOrigin.fromType,
				fromId: visibleForwardOrigin.fromId,
				date: visibleForwardOrigin.date ? visibleForwardOrigin.date * 1e3 : void 0,
				senderAllowed: true
			} : void 0,
			groupSystemPrompt: isGroup || !isGroup && groupConfig ? groupSystemPrompt : void 0,
			channelStructuredContext: visiblePromptContext.length > 0 ? visiblePromptContext : void 0
		},
		contextVisibility: contextVisibilityMode,
		extra: {
			GroupThread: params.groupThread,
			BotUsername: primaryCtx.me?.username ?? void 0,
			AmbientTranscriptWatermarkKey: ambientTranscriptWatermarkKey,
			AmbientTranscriptBody: options?.ambientTranscriptBody,
			AmbientTranscriptMessageId: ambientTranscriptWatermarkKey ? options?.messageIdOverride ?? String(msg.message_id) : void 0,
			AmbientTranscriptTimestampMs: ambientTranscriptWatermarkKey ? msg.date ? msg.date * 1e3 : void 0 : void 0,
			AmbientTranscriptPreviousMessageId: ambientTranscriptWatermark?.messageId,
			AmbientTranscriptPreviousTimestampMs: ambientTranscriptWatermark?.timestampMs,
			GroupSubject: isGroup ? msg.chat.title ?? void 0 : void 0,
			GroupRequireMention: isGroup ? groupRequireMention : void 0,
			ReplyChain: visibleReplyChain.length > 0 ? visibleReplyChain : void 0,
			ReplyToIsExternal: visibleReplyTarget?.source === "external_reply" ? true : void 0,
			ReplyToQuoteText: visibleReplyTarget?.quoteText,
			ReplyToQuotePosition: visibleReplyTarget?.quotePosition,
			ReplyToQuoteEntities: visibleReplyTarget?.quoteEntities,
			ReplyToQuoteSourceText: visibleReplyTarget?.quoteSourceText,
			ReplyToQuoteSourceEntities: visibleReplyTarget?.quoteSourceEntities,
			ReplyToForwardedFrom: visibleReplyTarget?.forwardedFrom?.from,
			ReplyToForwardedFromType: visibleReplyTarget?.forwardedFrom?.fromType,
			ReplyToForwardedFromId: visibleReplyTarget?.forwardedFrom?.fromId,
			ReplyToForwardedFromUsername: visibleReplyTarget?.forwardedFrom?.fromUsername,
			ReplyToForwardedFromTitle: visibleReplyTarget?.forwardedFrom?.fromTitle,
			ReplyToForwardedDate: visibleReplyTarget?.forwardedFrom?.date ? visibleReplyTarget.forwardedFrom.date * 1e3 : void 0,
			ForwardedFromUsername: visibleForwardOrigin?.fromUsername,
			ForwardedFromTitle: visibleForwardOrigin?.fromTitle,
			ForwardedFromSignature: visibleForwardOrigin?.fromSignature,
			ForwardedFromChatType: visibleForwardOrigin?.fromChatType,
			ForwardedFromMessageId: visibleForwardOrigin?.fromMessageId,
			WasMentioned: isGroup ? effectiveWasMentioned : void 0,
			Sticker: allMedia[0]?.stickerMetadata,
			StickerMediaIncluded: allMedia[0]?.stickerMetadata ? currentMediaFacts.length > 0 : void 0,
			SkipStickerMediaUnderstanding: stickerCacheHit ? true : void 0,
			...locationContext,
			ProviderUpdateId: typeof telegramUpdate?.update_id === "number" ? String(telegramUpdate.update_id) : void 0,
			ProviderUpdateKind: providerUpdateKind,
			ProviderMessageTimestamp: primaryCtx.message?.date ? primaryCtx.message.date * 1e3 : void 0,
			ProviderEditTimestamp: primaryCtx.message?.edit_date ? primaryCtx.message.edit_date * 1e3 : void 0,
			LocationLivePeriodSeconds: primaryCtx.message?.location?.live_period,
			IsForum: isForum,
			TopicName: isForum && topicName ? topicName : void 0
		}
	});
	const pinnedMainDmOwner = !isGroup ? sessionRuntime.resolvePinnedMainDmOwnerFromAllowlist({
		dmScope: cfg.session?.dmScope,
		allowFrom: dmAllowFrom,
		normalizeEntry: (entry) => normalizeAllowFrom([entry]).entries[0]
	}) : null;
	const updateLastRouteSessionKey = sessionRuntime.resolveInboundLastRouteSessionKey({
		route,
		sessionKey: route.sessionKey
	});
	const shouldPersistGroupLastRouteThread = isGroup && route.matchedBy !== "binding.channel";
	const updateLastRouteThreadId = isGroup ? shouldPersistGroupLastRouteThread && resolvedThreadId != null ? String(resolvedThreadId) : void 0 : dmThreadId != null ? String(dmThreadId) : void 0;
	const updateLastRoute = !isGroup || updateLastRouteThreadId != null ? {
		sessionKey: updateLastRouteSessionKey,
		channel: "telegram",
		to: telegramTo,
		accountId: route.accountId,
		threadId: updateLastRouteThreadId,
		mainDmOwnerPin: !isGroup && updateLastRouteSessionKey === route.mainSessionKey && pinnedMainDmOwner && senderId ? {
			ownerRecipient: pinnedMainDmOwner,
			senderRecipient: senderId,
			onSkip: (skipParams) => {
				logVerbose(`telegram: skip main-session last route for ${skipParams.senderRecipient} (pinned owner ${skipParams.ownerRecipient})`);
			}
		} : void 0
	} : void 0;
	if (visibleReplyTarget && shouldLogVerbose()) {
		const preview = truncateUtf16Safe((visibleReplyTarget.body ?? "").replace(/\s+/g, " "), 120);
		logVerbose(`telegram reply-context: replyToId=${visibleReplyTarget.id} replyToSender=${visibleReplyTarget.sender} replyToBody="${preview}"`);
	}
	if (visibleForwardOrigin && shouldLogVerbose()) logVerbose(`telegram forward-context: forwardedFrom="${visibleForwardOrigin.from}" type=${visibleForwardOrigin.fromType}`);
	if (shouldLogVerbose()) {
		const preview = truncateUtf16Safe(body, 200).replace(/\n/g, "\\n");
		const mediaInfo = allMedia.length > 1 ? ` mediaCount=${allMedia.length}` : "";
		const topicInfo = resolvedThreadId != null ? ` topic=${resolvedThreadId}` : "";
		logVerbose(`telegram inbound: chatId=${chatId} from=${ctxPayload.From} len=${body.length}${mediaInfo}${topicInfo} preview="${preview}"`);
	}
	return {
		ctxPayload,
		skillFilter,
		turn: {
			storePath,
			recordInboundSession: sessionRuntime.recordInboundSession,
			record: {
				updateLastRoute,
				onRecordError: (err) => {
					logVerbose(`telegram: failed updating session meta: ${String(err)}`);
				}
			}
		}
	};
}
//#endregion
//#region extensions/telegram/src/dm-access.ts
function resolveTelegramSenderIdentity(msg, chatId) {
	const from = msg.from;
	const userId = from?.id != null ? String(from.id) : null;
	return {
		username: from?.username ?? "",
		userId,
		candidateId: userId ?? String(chatId),
		firstName: from?.first_name,
		lastName: from?.last_name
	};
}
async function decideTelegramDmAccess(params) {
	return (await createTelegramIngressResolver({ accountId: params.accountId }).message({
		subject: createTelegramIngressSubject(params.sender.candidateId),
		conversation: {
			kind: "direct",
			id: params.sender.candidateId
		},
		dmPolicy: params.dmPolicy,
		groupPolicy: "disabled",
		allowFrom: telegramAllowEntries(params.effectiveDmAllow)
	})).ingress;
}
async function isTelegramDmAccessAllowed(params) {
	if (params.dmPolicy === "disabled") return false;
	const sender = resolveTelegramSenderIdentity(params.msg, params.chatId);
	return (await decideTelegramDmAccess({
		accountId: params.accountId,
		dmPolicy: params.dmPolicy,
		sender,
		effectiveDmAllow: params.effectiveDmAllow
	})).decision === "allow";
}
async function enforceTelegramDmAccess(params) {
	const { isGroup, dmPolicy, msg, chatId, effectiveDmAllow, accountId, bot, logger, upsertPairingRequest } = params;
	if (isGroup) return true;
	if (dmPolicy === "disabled") return false;
	const sender = resolveTelegramSenderIdentity(msg, chatId);
	const access = await decideTelegramDmAccess({
		accountId,
		dmPolicy,
		sender,
		effectiveDmAllow
	});
	if (access.decision === "allow") return true;
	if (dmPolicy === "open") {
		logVerbose(`Blocked unauthorized telegram sender ${sender.candidateId} (dmPolicy=open)`);
		return false;
	}
	if (access.decision === "pairing") {
		try {
			const telegramUserId = sender.userId ?? sender.candidateId;
			await createChannelPairingChallengeIssuer({
				channel: "telegram",
				accountId,
				upsertPairingRequest: async ({ id, meta }) => await (upsertPairingRequest ?? upsertChannelPairingRequest)({
					channel: "telegram",
					id,
					accountId,
					meta
				})
			})({
				senderId: telegramUserId,
				senderIdLine: `Your Telegram user id: ${telegramUserId}`,
				meta: {
					username: sender.username || void 0,
					firstName: sender.firstName,
					lastName: sender.lastName
				},
				onCreated: () => {
					logger.info({
						chatId: String(chatId),
						senderUserId: sender.userId ?? void 0,
						username: sender.username || void 0,
						firstName: sender.firstName,
						lastName: sender.lastName
					}, "telegram pairing request");
				},
				sendPairingReply: async (text) => {
					const html = renderTelegramHtmlText(text);
					await withTelegramApiErrorLogging({
						operation: "sendMessage",
						fn: () => bot.api.sendMessage(chatId, html, { parse_mode: "HTML" })
					});
				},
				onReplyError: (err) => {
					logVerbose(`telegram pairing reply failed for chat ${chatId}: ${String(err)}`);
				}
			});
		} catch (err) {
			logVerbose(`telegram pairing reply failed for chat ${chatId}: ${String(err)}`);
		}
		return false;
	}
	logVerbose(`Blocked unauthorized telegram sender ${sender.candidateId} (dmPolicy=${dmPolicy})`);
	return false;
}
//#endregion
//#region extensions/telegram/src/bot-message-context.ts
const loadTelegramMessageContextRuntime = createLazyRuntimeModule(() => import("./bot-message-context.runtime.js"));
const buildTelegramMessageContext = async ({ nativeCommandNames, primaryCtx, allMedia, replyMedia = [], replyChain = [], promptContext = [], storeAllowFrom, options, bot, cfg, account, ownerAgentId, historyLimit, dmHistoryLimit, dmPolicy, allowFrom, groupAllowFrom, ackReactionScope, logger, resolveGroupActivation, resolveGroupRequireMention, resolveTelegramGroupConfig, runtime, sessionRuntime, upsertPairingRequest, sendChatActionHandler }) => {
	const msg = primaryCtx.message;
	const chatId = msg.chat.id;
	const isGroup = msg.chat.type === "group" || msg.chat.type === "supergroup";
	const senderId = msg.from?.id ? String(msg.from.id) : "";
	const isDirectMessagesChat = msg.chat.is_direct_messages === true;
	const reactionApi = typeof bot.api.setMessageReaction === "function" ? bot.api.setMessageReaction.bind(bot.api) : null;
	const getChatApi = typeof bot.api.getChat === "function" ? bot.api.getChat.bind(bot.api) : void 0;
	const isForum = isDirectMessagesChat ? false : await resolveTelegramForumFlag({
		chatId,
		chatType: msg.chat.type,
		isGroup,
		isForum: extractTelegramForumFlag(msg.chat),
		isTopicMessage: msg.is_topic_message,
		getChat: getChatApi
	});
	const threadSpec = options?.threadSpec ?? resolveTelegramMessageThreadSpec(msg, isForum);
	const resolvedThreadId = threadSpec.scope === "forum" || threadSpec.scope === "direct-messages" ? threadSpec.id : void 0;
	const replyThreadId = threadSpec.id;
	const dmThreadId = threadSpec.scope === "dm" ? threadSpec.id : void 0;
	let topicName;
	if (isForum && resolvedThreadId != null) {
		const topicNameCacheScope = resolveTopicNameCacheScope(await resolveTelegramMessageContextStorePath({
			cfg,
			agentId: ownerAgentId?.trim() || resolveTelegramAccountOwnerAgentId({
				cfg,
				accountId: account.accountId
			}),
			sessionRuntime
		}));
		const ftCreated = msg.forum_topic_created;
		const ftEdited = msg.forum_topic_edited;
		const ftClosed = msg.forum_topic_closed;
		const ftReopened = msg.forum_topic_reopened;
		const topicPatch = ftCreated?.name ? {
			name: ftCreated.name,
			iconColor: ftCreated.icon_color,
			iconCustomEmojiId: ftCreated.icon_custom_emoji_id,
			closed: false
		} : ftEdited?.name ? {
			name: ftEdited.name,
			iconCustomEmojiId: ftEdited.icon_custom_emoji_id
		} : ftClosed ? { closed: true } : ftReopened ? { closed: false } : void 0;
		if (topicPatch) await updateTopicName(chatId, resolvedThreadId, topicPatch, topicNameCacheScope);
		topicName = await getTopicName(chatId, resolvedThreadId, topicNameCacheScope);
		if (!topicName) {
			const replyFtCreated = msg.reply_to_message?.forum_topic_created;
			if (replyFtCreated?.name) {
				await updateTopicName(chatId, resolvedThreadId, {
					name: replyFtCreated.name,
					iconColor: replyFtCreated.icon_color,
					iconCustomEmojiId: replyFtCreated.icon_custom_emoji_id
				}, topicNameCacheScope);
				topicName = replyFtCreated.name;
			}
		}
	}
	const { groupConfig, topicConfig } = resolveTelegramGroupConfig(chatId, resolvedThreadId ?? dmThreadId, cfg);
	const directConfig = !isGroup ? groupConfig : void 0;
	const telegramGroupConfig = isGroup ? groupConfig : void 0;
	const effectiveDmPolicy = resolveTelegramEffectiveDmPolicy({
		isGroup,
		groupConfig,
		dmPolicy
	});
	const conversationRoute = resolveTelegramConversationRoute({
		cfg,
		accountId: account.accountId,
		chatId,
		isGroup,
		threadSpec,
		senderId,
		topicAgentId: topicConfig?.agentId
	});
	const { bindingMode } = conversationRoute;
	let { route } = conversationRoute;
	const requiresExplicitAccountBinding = (candidate) => normalizeAccountId(candidate.accountId) !== normalizeAccountId(resolveDefaultTelegramAccountId(cfg)) && candidate.matchedBy === "default";
	const isNamedAccountFallback = requiresExplicitAccountBinding(route);
	const hasExplicitTopicRoute = isGroup && Boolean(topicConfig?.agentId?.trim());
	if (isNamedAccountFallback && isGroup && !hasExplicitTopicRoute) {
		logInboundDrop({
			log: logVerbose,
			channel: "telegram",
			reason: "non-default account requires explicit binding",
			target: route.accountId
		});
		return null;
	}
	const groupAllowOverride = firstDefined(topicConfig?.allowFrom, groupConfig?.allowFrom);
	const dmAllow = await resolveTelegramDmAllow({
		cfg,
		groupAllowOverride,
		allowFrom,
		accountId: account.accountId,
		senderId,
		storeAllowFrom,
		dmPolicy: effectiveDmPolicy
	});
	const expandedGroupAllowFrom = await expandTelegramAllowFromWithAccessGroups({
		cfg,
		allowFrom: groupAllowOverride ?? groupAllowFrom,
		accountId: account.accountId,
		senderId
	});
	const effectiveGroupAllow = normalizeAllowFrom(expandedGroupAllowFrom);
	const hasGroupAllowOverride = groupAllowOverride !== void 0;
	const senderUsername = msg.from?.username ?? "";
	const commandAuthorizedByConfig = await resolveTelegramNativeCommandAdmission({
		msg,
		nativeCommandNames,
		botUsername: primaryCtx.me?.username,
		cfg,
		accountId: account.accountId,
		dmPolicy: effectiveDmPolicy,
		isGroup,
		chatId,
		senderId
	});
	const baseAccess = evaluateTelegramGroupBaseAccess({
		isGroup,
		groupConfig,
		topicConfig,
		hasGroupAllowOverride,
		effectiveGroupAllow,
		senderId,
		senderUsername,
		enforceAllowOverride: true,
		requireSenderForAllowOverride: false
	});
	if (!baseAccess.allowed) {
		if (baseAccess.reason === "group-disabled") {
			logVerbose(`Blocked telegram group ${chatId} (group disabled)`);
			return null;
		}
		if (baseAccess.reason === "topic-disabled") {
			logVerbose(`Blocked telegram topic ${chatId} (${resolvedThreadId ?? "unknown"}) (topic disabled)`);
			return null;
		}
		logVerbose(isGroup ? `Blocked telegram group sender ${senderId || "unknown"} (group allowFrom override)` : `Blocked telegram DM sender ${senderId || "unknown"} (DM allowFrom override)`);
		return null;
	}
	const requireTopic = directConfig?.requireTopic;
	if (!isGroup && requireTopic === true && dmThreadId == null) {
		logVerbose(`Blocked telegram DM ${chatId}: requireTopic=true but no topic present`);
		return null;
	}
	const sendTyping = async () => {
		if (threadSpec.scope === "direct-messages") return;
		await withTelegramApiErrorLogging({
			operation: "sendChatAction",
			fn: () => sendChatActionHandler.sendChatAction(chatId, "typing", buildTypingThreadParams(replyThreadId))
		});
	};
	const sendRecordVoice = async () => {
		if (threadSpec.scope === "direct-messages") return;
		try {
			await withTelegramApiErrorLogging({
				operation: "sendChatAction",
				fn: () => sendChatActionHandler.sendChatAction(chatId, "record_voice", buildTypingThreadParams(replyThreadId))
			});
		} catch (err) {
			logVerbose(`telegram record_voice cue failed for chat ${chatId}: ${String(err)}`);
		}
	};
	if (!commandAuthorizedByConfig && !await enforceTelegramDmAccess({
		isGroup,
		dmPolicy: effectiveDmPolicy,
		msg,
		chatId,
		effectiveDmAllow: dmAllow.effectiveAllow,
		accountId: account.accountId,
		bot,
		logger,
		upsertPairingRequest
	})) return null;
	let initialTypingCueSent = false;
	const ensureConfiguredBindingReady = async () => {
		if (bindingMode.kind !== "configured") return true;
		const ensured = await (runtime?.ensureConfiguredBindingRouteReady ?? (await loadTelegramMessageContextRuntime()).ensureConfiguredBindingRouteReady)({
			cfg,
			bindingResolution: bindingMode.binding
		});
		if (ensured.ok) {
			logVerbose(`telegram: using configured ACP binding for ${bindingMode.binding.record.conversation.conversationId} -> ${bindingMode.sessionKey}`);
			return true;
		}
		logVerbose(`telegram: configured ACP binding unavailable for ${bindingMode.binding.record.conversation.conversationId}: ${ensured.error}`);
		logInboundDrop({
			log: logVerbose,
			channel: "telegram",
			reason: "configured ACP binding unavailable",
			target: bindingMode.binding.record.conversation.conversationId
		});
		return false;
	};
	const baseSessionKey = resolveTelegramConversationBaseSessionKey({
		cfg,
		route,
		chatId,
		isGroup,
		senderId
	});
	const sessionKey = (shouldUseTelegramDmThreadSession({
		dmThreadId,
		botHasTopicsEnabled: threadSpec.scope === "dm" && msg.is_topic_message === true || resolveTelegramBotHasTopicsEnabled(primaryCtx.me)
	}) && dmThreadId != null ? resolveThreadSessionKeys({
		baseSessionKey,
		threadId: `${chatId}:${dmThreadId}`
	}) : null)?.sessionKey ?? baseSessionKey;
	route = {
		...route,
		sessionKey,
		lastRoutePolicy: deriveLastRoutePolicy({
			sessionKey,
			mainSessionKey: route.mainSessionKey
		})
	};
	const activationOverride = resolveGroupActivation({
		sessionKey,
		agentId: route.agentId,
		cfg
	});
	const baseRequireMention = resolveGroupRequireMention(chatId, cfg);
	const groupRequireMention = firstDefined(topicConfig?.requireMention, activationOverride, telegramGroupConfig?.requireMention, baseRequireMention);
	const requireMention = isGroup && bindingMode.kind === "plugin-owned-runtime" ? false : groupRequireMention;
	(runtime?.recordChannelActivity ?? (await loadTelegramMessageContextRuntime()).recordChannelActivity)({
		channel: "telegram",
		accountId: account.accountId,
		direction: "inbound"
	});
	const originatingTo = buildTelegramInboundOriginTarget(chatId, threadSpec);
	const bodyResult = await resolveTelegramInboundBody({
		nativeCommandNames,
		cfg,
		primaryCtx,
		msg,
		allMedia,
		isGroup,
		chatId,
		accountId: account.accountId,
		senderId,
		senderUsername,
		resolvedThreadId,
		replyThreadId,
		threadSpec,
		originatingTo,
		routeAgentId: route.agentId,
		sessionKey,
		acpBinding: bindingMode.kind === "configured",
		effectiveGroupAllow,
		effectiveDmAllow: dmAllow.effectiveAllow,
		groupConfig,
		topicConfig,
		providerMentionPatterns: cfg.channels?.telegram?.accounts?.[account.accountId]?.mentionPatterns,
		requireMention: Boolean(requireMention),
		options,
		logger
	});
	if (!bodyResult) return null;
	if (!await ensureConfiguredBindingReady()) return null;
	if (bodyResult.inboundEventKind !== "room_event") {
		initialTypingCueSent = true;
		sendTyping().catch((err) => {
			logVerbose(`telegram early typing cue failed for chat ${chatId}: ${String(err)}`);
		});
	}
	const { ctxPayload, skillFilter, turn } = await buildTelegramInboundContextPayload({
		cfg,
		primaryCtx,
		msg,
		allMedia,
		replyMedia,
		replyChain,
		promptContext,
		isGroup,
		isForum,
		chatId,
		senderId,
		senderUsername,
		resolvedThreadId,
		dmThreadId,
		threadSpec,
		route,
		rawBody: bodyResult.rawBody,
		bodyText: bodyResult.bodyText,
		historyKey: bodyResult.historyKey ?? "",
		historyLimit,
		dmHistoryLimit,
		groupConfig,
		topicConfig,
		effectiveWasMentioned: bodyResult.effectiveWasMentioned,
		inboundEventKind: bodyResult.inboundEventKind,
		groupRequireMention: Boolean(groupRequireMention),
		mentionFacts: bodyResult.mentionFacts,
		groupThread: bodyResult.groupThread,
		commandSource: bodyResult.commandSource,
		nativeCommandBody: bodyResult.nativeCommandBody,
		stickerCacheHit: bodyResult.stickerCacheHit,
		...bodyResult.audioTranscribedMediaIndex !== void 0 ? { audioTranscribedMediaIndex: bodyResult.audioTranscribedMediaIndex } : {},
		locationData: bodyResult.locationData,
		options,
		dmAllowFrom: dmAllow.allowFrom,
		effectiveGroupAllow,
		commandAuthorized: bodyResult.commandAuthorized,
		topicName,
		sessionRuntime
	});
	const canShowStatusReaction = !(ctxPayload.InboundEventKind === "room_event");
	const ackReaction = resolveAckReaction(cfg, route.agentId, {
		channel: "telegram",
		accountId: account.accountId
	});
	const ackReactionEmoji = ackReaction ? resolveTelegramReactionEmoji(ackReaction) : void 0;
	const shouldSendAckReaction = Boolean(ackReaction && shouldAckReaction({
		scope: ackReactionScope,
		inboundEventKind: ctxPayload.InboundEventKind,
		isDirect: !isGroup,
		isGroup,
		isMentionableGroup: isGroup,
		canDetectMention: bodyResult.canDetectMention,
		effectiveWasMentioned: bodyResult.effectiveWasMentioned,
		shouldBypassMention: bodyResult.shouldBypassMention
	}));
	const statusReactionsConfig = cfg.messages?.statusReactions;
	const statusReactionsEnabled = canShowStatusReaction && statusReactionsConfig?.enabled === true && Boolean(reactionApi) && shouldSendAckReaction;
	const resolvedStatusReactionEmojis = statusReactionsEnabled ? resolveTelegramStatusReactionEmojis({
		initialEmoji: ackReaction,
		overrides: void 0
	}) : null;
	const statusReactionVariantsByEmoji = resolvedStatusReactionEmojis ? buildTelegramStatusReactionVariants(resolvedStatusReactionEmojis) : /* @__PURE__ */ new Map();
	let allowedStatusReactionEmojisPromise = null;
	const createStatusReactionController = statusReactionsEnabled && resolvedStatusReactionEmojis && msg.message_id ? runtime?.createStatusReactionController ?? (await loadTelegramMessageContextRuntime()).createStatusReactionController : null;
	const statusReactionController = createStatusReactionController ? createStatusReactionController({
		enabled: true,
		adapter: { setReaction: async (emoji) => {
			if (reactionApi) {
				if (!allowedStatusReactionEmojisPromise) allowedStatusReactionEmojisPromise = resolveTelegramAllowedReactions({
					chat: msg.chat,
					chatId,
					getChat: getChatApi ?? void 0
				}).then((reactions) => reactions ? new Set(reactions.flatMap((reaction) => reaction.type === "emoji" ? [reaction.emoji] : [])) : null).catch((err) => {
					logVerbose(`telegram status-reaction available_reactions lookup failed for chat ${chatId}: ${String(err)}`);
					return null;
				});
				const allowedStatusReactionEmojis = await allowedStatusReactionEmojisPromise;
				const resolvedEmoji = resolveTelegramReactionVariant({
					requestedEmoji: emoji,
					variantsByRequestedEmoji: statusReactionVariantsByEmoji,
					allowedEmojiReactions: allowedStatusReactionEmojis
				});
				if (!resolvedEmoji) return;
				await reactionApi(chatId, msg.message_id, [{
					type: "emoji",
					emoji: resolvedEmoji
				}]);
			}
		} },
		initialEmoji: ackReaction,
		emojis: resolvedStatusReactionEmojis ?? void 0,
		onError: (err) => {
			logVerbose(`telegram status-reaction error for chat ${chatId}: ${String(err)}`);
		}
	}) : null;
	const ackReactionPromise = statusReactionController ? shouldSendAckReaction ? Promise.resolve(statusReactionController.setQueued()).then(() => true, () => false) : null : shouldSendAckReaction && msg.message_id && reactionApi && ackReactionEmoji ? withTelegramApiErrorLogging({
		operation: "setMessageReaction",
		fn: () => reactionApi(chatId, msg.message_id, [{
			type: "emoji",
			emoji: ackReactionEmoji
		}])
	}).then(() => true, (err) => {
		logVerbose(`telegram react failed for chat ${chatId}: ${String(err)}`);
		return false;
	}) : null;
	return {
		cfg,
		ctxPayload,
		turn,
		primaryCtx,
		msg,
		chatId,
		isGroup,
		groupConfig,
		topicConfig,
		resolvedThreadId,
		threadSpec,
		replyThreadId,
		isForum,
		historyKey: bodyResult.historyKey ?? "",
		historyLimit,
		route,
		skillFilter,
		sendTyping,
		sendRecordVoice,
		sendChatActionHandler,
		initialTypingCueSent,
		ackReactionPromise,
		reactionApi,
		statusReactionController,
		accountId: account.accountId
	};
};
//#endregion
//#region extensions/telegram/src/dm-history.ts
const DEFAULT_TELEGRAM_DM_HISTORY_LIMIT = 10;
function resolveTelegramDmHistoryLimit(params) {
	const senderId = params.senderId === void 0 ? void 0 : String(params.senderId);
	const override = senderId ? params.config.dms?.[senderId]?.historyLimit : void 0;
	return resolvePromptHistoryLimit(override ?? params.config.dmHistoryLimit, DEFAULT_TELEGRAM_DM_HISTORY_LIMIT);
}
//#endregion
//#region extensions/telegram/src/bot-handlers.message-context.ts
function legacyAssistantTextKey(node, botUserId) {
	if (node.promptContextProjectionMarker) return;
	const timestamp = node.sourceMessage.openclaw_prompt_context_timestamp_ms;
	const legacySelf = isTelegramMessageFromCurrentBot(node.sourceMessage, botUserId) || node.sourceMessage.from?.id === 0 && node.sourceMessage.from.is_bot;
	const body = stripInlineDirectiveTagsForDelivery(node.body ?? "").text.trim();
	return legacySelf && typeof timestamp === "number" && body ? `text:${timestamp}:${body}` : void 0;
}
const normalizePromptContextMinTimestampMs = (timestampMs) => asFiniteNumber(timestampMs);
function promptContextBoundaryOptions(timestampMs, ambientWatermark) {
	const promptContextMinTimestampMs = normalizePromptContextMinTimestampMs(timestampMs);
	return {
		...promptContextMinTimestampMs === void 0 ? {} : { promptContextMinTimestampMs },
		...ambientWatermark === void 0 ? {} : { promptContextAmbientWatermark: ambientWatermark }
	};
}
function latestPromptContextMinTimestampMs(...timestamps) {
	let latest;
	for (const timestampMs of timestamps) {
		const normalized = normalizePromptContextMinTimestampMs(timestampMs);
		if (normalized !== void 0) latest = latest === void 0 ? normalized : Math.max(latest, normalized);
	}
	return latest;
}
const latestPromptContextAmbientWatermark = (...watermarks) => watermarks.findLast((watermark) => watermark !== void 0);
function buildSyntheticTextMessage(params) {
	const message = {
		...params.base,
		...params.from ? { from: params.from } : {},
		text: params.text,
		...params.date != null ? { date: params.date } : {}
	};
	delete message.caption;
	delete message.caption_entities;
	if (params.entities?.length) message.entities = params.entities;
	else delete message.entities;
	return message;
}
const buildSyntheticContext = (ctx, message) => ({
	message,
	update: ctx.update,
	me: ctx.me,
	getFile: ctx.getFile.bind(ctx)
});
function formatTelegramAmbientTranscriptBody(messages) {
	const lines = messages.map((msg) => {
		const text = getTelegramTextParts(msg).text.trim();
		const media = resolveTelegramPrimaryMedia(msg);
		const body = text || formatMediaPlaceholderText(media ? [{ kind: media.kind }] : [{}]);
		const prefix = [msg.message_id ? `#${msg.message_id}` : void 0, buildSenderName(msg)].filter(Boolean).join(" ");
		return prefix ? `${prefix}: ${body}` : body;
	});
	return lines.length > 0 ? lines.join("\n") : void 0;
}
function createTelegramMessageSessionRuntime({ accountId, resolveTelegramGroupConfig, telegramDeps }) {
	const loadSessionEntry = telegramDeps.getSessionEntry ?? getSessionEntry;
	const resolveTelegramSessionState = (params) => {
		const dmThreadId = params.threadSpec.scope === "dm" ? params.threadSpec.id : void 0;
		const topicThreadId = params.threadSpec.id;
		const { topicConfig } = resolveTelegramGroupConfig(params.chatId, topicThreadId, params.runtimeCfg);
		const { route } = resolveTelegramConversationRoute({
			cfg: params.runtimeCfg,
			accountId,
			chatId: params.chatId,
			isGroup: params.isGroup,
			threadSpec: params.threadSpec,
			senderId: params.senderId,
			topicAgentId: topicConfig?.agentId
		});
		const sessionKey = resolveTelegramTargetSession({
			cfg: params.runtimeCfg,
			route,
			chatId: params.chatId,
			isGroup: params.isGroup,
			senderId: params.senderId,
			dmThreadId,
			botHasTopicsEnabled: params.botHasTopicsEnabled
		});
		const storePath = telegramDeps.resolveStorePath(params.runtimeCfg.session?.store, { agentId: route.agentId });
		const entry = loadSessionEntry({
			storePath,
			sessionKey
		});
		const storedOverride = resolveStoredModelOverride({
			sessionEntry: entry,
			loadSessionEntry: (parentSessionKey) => loadSessionEntry({
				storePath,
				sessionKey: parentSessionKey
			}),
			sessionKey,
			defaultProvider: resolveDefaultModelForAgent({
				cfg: params.runtimeCfg,
				agentId: route.agentId
			}).provider
		});
		if (storedOverride) return {
			agentId: route.agentId,
			sessionEntry: entry,
			sessionKey,
			storePath,
			model: storedOverride.provider ? `${storedOverride.provider}/${storedOverride.model}` : storedOverride.model
		};
		const provider = entry?.modelProvider?.trim();
		const model = entry?.model?.trim();
		if (provider && model) return {
			agentId: route.agentId,
			sessionEntry: entry,
			sessionKey,
			storePath,
			model: `${provider}/${model}`
		};
		const modelCfg = params.runtimeCfg.agents?.defaults?.model;
		return {
			agentId: route.agentId,
			sessionEntry: entry,
			sessionKey,
			storePath,
			model: typeof modelCfg === "string" ? modelCfg : modelCfg?.primary
		};
	};
	const resolvePromptContextAmbientWatermark = (params) => {
		if (!params.isGroup) return;
		const key = (telegramDeps.resolveAmbientTranscriptWatermarkKey ?? resolveAmbientTranscriptWatermarkKey)({
			channel: "telegram",
			accountId,
			conversationId: String(params.chatId),
			...params.resolvedThreadId !== void 0 ? { threadId: params.resolvedThreadId } : {}
		});
		return (telegramDeps.readAmbientTranscriptWatermark ?? readAmbientTranscriptWatermark)({
			storePath: params.storePath,
			sessionKey: params.sessionKey,
			key
		});
	};
	return {
		resolveTelegramSessionState,
		resolvePromptContextAmbientWatermark
	};
}
function createTelegramMessageContextRuntime({ cfg, accountId, ownerAgentId, opts, telegramCfg, telegramDeps }) {
	const messageCache = createTelegramMessageCache({ scope: resolveTelegramMessageCacheScope(telegramDeps.resolveStorePath(cfg.session?.store, { agentId: ownerAgentId })) });
	const resolvePromptSender = (node, ctx) => {
		const botInfo = ctx.me ?? opts.botInfo;
		if (botInfo?.id != null && (node.senderId === String(botInfo.id) || node.sourceMessage.sender_business_bot?.id === botInfo.id)) return buildTelegramSelfSenderName(telegramCfg.name, botInfo);
		if (node.senderId === "0" && node.sourceMessage.from?.is_bot === true) return node.sender;
		return isTelegramSelfSenderName(node.sender) ? `${node.sender} (Telegram sender)` : node.sender;
	};
	const recordMessageForReplyChain = (msg, providerObservedThread, botUserId) => messageCache.record({
		accountId,
		chatId: msg.chat.id,
		msg,
		historyEligible: true,
		...botUserId !== void 0 ? { botUserId } : {},
		...providerObservedThread ? { providerObservedThread } : {},
		...providerObservedThread?.id != null ? { threadId: providerObservedThread.id } : {}
	});
	const recordMessageResolvedMedia = (params) => messageCache.recordResolvedMedia({
		accountId,
		chatId: params.msg.chat.id,
		messageId: String(params.msg.message_id),
		media: params.media,
		...params.botUserId !== void 0 ? { botUserId: params.botUserId } : {}
	});
	const recordReplyMessageResolvedMedia = async (params) => {
		if (!await messageCache.get({
			accountId,
			chatId: params.chatId,
			messageId: params.messageId
		})) return;
		await messageCache.recordResolvedMedia({
			accountId,
			chatId: params.chatId,
			messageId: params.messageId,
			media: params.media,
			...params.botUserId !== void 0 ? { botUserId: params.botUserId } : {}
		});
	};
	const resolveCachedMessageThreadSpec = async (params) => {
		const node = await messageCache.get({
			accountId,
			chatId: params.chatId,
			messageId: String(params.messageId)
		});
		return resolveProviderObservedTelegramThreadSpec(node);
	};
	const buildReplyChainForMessage = (msg) => buildTelegramReplyChain({
		cache: messageCache,
		accountId,
		chatId: msg.chat.id,
		msg
	});
	const toReplyChainEntry = (node, ctx, media) => {
		const { sourceMessage: _sourceMessage, resolvedMedia: _resolvedMedia, promptContextProjectionMarker: _promptContextProjectionMarker, threadBinding: _threadBinding, ...entry } = node;
		const projectedEntry = {
			...entry,
			sender: resolvePromptSender(node, ctx)
		};
		if (!media?.path) return projectedEntry;
		const { mediaRef: _mediaRef, ...entryWithoutProviderMediaRef } = projectedEntry;
		return {
			...entryWithoutProviderMediaRef,
			mediaPath: media.path,
			mediaKind: media.kind,
			...media.contentType ? { mediaType: media.contentType } : {}
		};
	};
	const toPromptContextMessage = (node, ctx, flags, media) => ({
		message_id: node.messageId,
		thread_id: node.threadId,
		sender: resolvePromptSender(node, ctx),
		sender_id: node.senderId,
		sender_username: node.senderUsername,
		timestamp_ms: node.timestamp,
		body: node.body,
		media_type: media?.contentType ?? media?.kind ?? node.mediaType,
		media_path: media?.path,
		media_ref: media?.path ? void 0 : node.mediaRef,
		reply_to_id: node.replyToId,
		is_reply_target: flags?.replyTarget === true ? true : void 0
	});
	const buildPromptContextForMessage = async (ctx, msg, replyChainNodes, runtimeCfg, runtimeTelegramCfg, options, mediaByMessageId, selectedMessageIds) => {
		const body = getTelegramTextParts(msg).text.trim();
		if (/^\/(?:new|reset)(?:@[A-Za-z0-9_]+)?(?:\s|$)/i.test(body) && !/^\/reset(?:@[A-Za-z0-9_]+)?\s+soft(?:\s|$)/i.test(body)) return [];
		const isGroup = msg.chat.type === "group" || msg.chat.type === "supergroup";
		const groupHistoryLimit = resolvePromptHistoryLimit(runtimeTelegramCfg.historyLimit ?? runtimeCfg.messages?.groupChat?.historyLimit);
		const dmHistoryLimit = resolveTelegramDmHistoryLimit({
			config: runtimeTelegramCfg,
			senderId: msg.from?.id
		});
		if ((isGroup ? groupHistoryLimit : dmHistoryLimit) === 0 && replyChainNodes.length === 0 && !selectedMessageIds?.size) return [];
		const messageId = typeof msg.message_id === "number" ? String(msg.message_id) : void 0;
		const currentNode = await messageCache.get({
			accountId,
			chatId: msg.chat.id,
			messageId
		});
		const threadId = options?.threadSpec?.id ?? (currentNode?.threadId ? Number(currentNode.threadId) : void 0);
		const historyScope = {
			cache: messageCache,
			cfg: runtimeCfg,
			accountId,
			chatId: msg.chat.id,
			...Number.isFinite(threadId) ? { threadId } : {},
			botUserId: ctx.me?.id ?? opts.botInfo?.id
		};
		const conversationContext = await buildTelegramConversationContext({
			cache: messageCache,
			messageId,
			accountId,
			chatId: msg.chat.id,
			...Number.isFinite(threadId) ? { threadId } : {},
			replyChainNodes,
			recentLimit: isGroup ? 0 : dmHistoryLimit,
			replyTargetWindowSize: isGroup ? 0 : dmHistoryLimit > 0 ? 2 : 0,
			...options?.promptContextMinTimestampMs !== void 0 ? { minTimestampMs: options.promptContextMinTimestampMs } : {}
		});
		const conversationContextById = new Map(conversationContext.flatMap((entry) => entry.node.messageId ? [[entry.node.messageId, entry]] : []));
		if (isGroup && groupHistoryLimit > 0) {
			const history = await readTelegramHistoryWindow({
				...historyScope,
				before: messageId,
				limit: groupHistoryLimit
			});
			for (const node of history) {
				if (options?.promptContextMinTimestampMs !== void 0 && node.timestamp !== void 0 && node.timestamp < options.promptContextMinTimestampMs || !isTelegramHistoryEntryAfterAmbientWatermark(node, options?.promptContextAmbientWatermark)) continue;
				if (node.messageId && !conversationContextById.has(node.messageId)) conversationContextById.set(node.messageId, { node });
			}
		}
		for (const [selectedMessageId, selection] of selectedMessageIds ?? []) {
			if (selection === "exclude") {
				conversationContextById.delete(selectedMessageId);
				continue;
			}
			if (selectedMessageId === messageId || conversationContextById.has(selectedMessageId)) continue;
			const node = await messageCache.get({
				accountId,
				chatId: msg.chat.id,
				messageId: selectedMessageId
			});
			if (node?.messageId && (!isGroup || await isTelegramHistoryNodeAllowed({
				...historyScope,
				node
			}))) conversationContextById.set(node.messageId, { node });
		}
		const cacheEntries = Array.from(conversationContextById.values()).toSorted((left, right) => Number(left.node.messageId) - Number(right.node.messageId)).map((entry) => ({
			node: entry.node,
			message: toPromptContextMessage(entry.node, ctx, { replyTarget: entry.isReplyTarget }, entry.node.messageId ? mediaByMessageId?.get(entry.node.messageId) : void 0)
		}));
		const completeProjectionIds = resolveCompleteTelegramPromptContextProjectionIds(cacheEntries.map((entry) => entry.node.promptContextProjectionMarker));
		const legacyAssistantTextKeys = cacheEntries.flatMap(({ node }) => {
			const key = legacyAssistantTextKey(node, ctx.me?.id ?? opts.botInfo?.id);
			return key ? [key] : [];
		});
		const messages = cacheEntries.map((entry) => entry.message);
		return messages.length > 0 ? [{
			label: "Conversation context",
			source: "telegram",
			type: "chat_window",
			...completeProjectionIds.size > 0 ? { sessionTranscriptDedupeMessageIds: [...completeProjectionIds] } : {},
			...legacyAssistantTextKeys.length > 0 ? { sessionTranscriptAssistantTextDedupeKeys: legacyAssistantTextKeys } : {},
			payload: {
				order: "chronological",
				relation: "selected_for_current_message",
				messages
			}
		}] : [];
	};
	return {
		recordMessageForReplyChain,
		recordMessageResolvedMedia,
		recordReplyMessageResolvedMedia,
		resolveCachedMessageThreadSpec,
		buildReplyChainForMessage,
		toReplyChainEntry,
		buildPromptContextForMessage
	};
}
//#endregion
//#region extensions/telegram/src/bot-message-dispatch-context.ts
const TELEGRAM_GENERAL_TOPIC_ID = 1;
function normalizeTelegramThreadId(value) {
	return parseStrictPositiveInteger(value);
}
function resolveTelegramForumThreadScopeFromSessionKey(sessionKey) {
	if (typeof sessionKey !== "string") return;
	const match = /:telegram:group:(-?\d+):topic:(\d+)(?::|$)/.exec(sessionKey);
	const threadId = normalizeTelegramThreadId(match?.[2]);
	if (!match?.[1] || threadId == null) return;
	return {
		chatId: match[1],
		threadId
	};
}
function resolveDispatchTelegramThreadSpec(params) {
	if (params.threadSpec.scope !== "forum" || params.threadSpec.id != null && params.threadSpec.id !== TELEGRAM_GENERAL_TOPIC_ID) return params.threadSpec;
	const scopedThread = resolveTelegramForumThreadScopeFromSessionKey(params.ctxPayload.SessionKey);
	const scopedThreadId = scopedThread?.chatId === String(params.chatId) ? scopedThread.threadId : void 0;
	const payloadThreadId = normalizeTelegramThreadId(params.ctxPayload.MessageThreadId) ?? normalizeTelegramThreadId(params.ctxPayload.TransportThreadId);
	const recoveredThreadId = scopedThreadId ?? payloadThreadId;
	return recoveredThreadId == null || recoveredThreadId === params.threadSpec.id ? params.threadSpec : {
		...params.threadSpec,
		id: recoveredThreadId
	};
}
function normalizeDispatchTelegramThreadPayload(params) {
	if (params.threadSpec.scope !== "forum" || params.threadSpec.id == null) return params.context;
	const messageThreadId = normalizeTelegramThreadId(params.context.ctxPayload.MessageThreadId);
	const transportThreadId = normalizeTelegramThreadId(params.context.ctxPayload.TransportThreadId);
	if (messageThreadId === params.threadSpec.id && transportThreadId === params.threadSpec.id) return params.context;
	Object.assign(params.context.ctxPayload, {
		MessageThreadId: params.threadSpec.id,
		TransportThreadId: params.threadSpec.id
	});
	return params.context;
}
function buildRecoveredTelegramChatActionSender(params) {
	return async () => {
		try {
			await withTelegramApiErrorLogging({
				operation: "sendChatAction",
				fn: () => params.context.sendChatActionHandler.sendChatAction(params.context.chatId, params.action, buildTypingThreadParams(params.threadId))
			});
		} catch (err) {
			if (params.action !== "record_voice") throw err;
			logVerbose(`telegram record_voice cue failed for chat ${params.context.chatId}: ${String(err)}`);
		}
	};
}
async function resolveDispatchTelegramContext(params) {
	const threadSpec = resolveDispatchTelegramThreadSpec({
		chatId: params.context.chatId,
		ctxPayload: params.context.ctxPayload,
		threadSpec: params.context.threadSpec
	});
	if (threadSpec === params.context.threadSpec || threadSpec.scope !== "forum") return normalizeDispatchTelegramThreadPayload({
		context: params.context,
		threadSpec
	});
	const recoveredRoutingTarget = buildTelegramInboundOriginTarget(params.context.chatId, threadSpec);
	const recoveredFrom = params.context.isGroup ? buildTelegramGroupFrom(params.context.chatId, threadSpec) : params.context.ctxPayload.From;
	const recoveredUpdateLastRoute = params.context.turn.record.updateLastRoute && threadSpec.id != null ? {
		...params.context.turn.record.updateLastRoute,
		to: `telegram:${params.context.chatId}:topic:${threadSpec.id}`,
		threadId: String(threadSpec.id)
	} : params.context.turn.record.updateLastRoute;
	const recoveredHistoryKey = params.context.isGroup ? buildTelegramGroupPeerId(params.context.chatId, threadSpec) : params.context.historyKey;
	const promptContext = params.context.ctxPayload.ChannelStructuredContext ?? [];
	let recoveredPromptContext = params.context.historyLimit > 0 ? promptContext.filter((entry) => !isTelegramChatWindowPromptContext(entry)) : selectTelegramGroupPromptContext({
		promptContext,
		historyLimit: 0,
		includeBeforeSelf: false
	});
	if (params.context.isGroup && params.context.historyLimit > 0) {
		const telegramCfg = resolveTelegramAccount({
			cfg: params.context.cfg,
			accountId: params.context.accountId
		}).config;
		const runtime = createTelegramMessageContextRuntime({
			cfg: params.context.cfg,
			accountId: params.context.accountId,
			ownerAgentId: resolveTelegramAccountOwnerAgentId({
				cfg: params.context.cfg,
				accountId: params.context.accountId
			}),
			telegramCfg,
			opts: { botInfo: params.context.primaryCtx.me },
			telegramDeps: { resolveStorePath }
		});
		const ambientWatermark = params.context.ctxPayload.AmbientTranscriptPreviousMessageId ? {
			messageId: params.context.ctxPayload.AmbientTranscriptPreviousMessageId,
			timestampMs: params.context.ctxPayload.AmbientTranscriptPreviousTimestampMs
		} : void 0;
		const replyChain = await runtime.buildReplyChainForMessage(params.context.msg);
		recoveredPromptContext = selectTelegramGroupPromptContext({
			promptContext: [...recoveredPromptContext, ...await runtime.buildPromptContextForMessage(params.context.primaryCtx, params.context.msg, replyChain, params.context.cfg, {
				...telegramCfg,
				historyLimit: params.context.historyLimit
			}, {
				threadSpec,
				promptContextMinTimestampMs: params.context.ctxPayload.SessionTranscriptContext?.minTimestampMs,
				promptContextAmbientWatermark: ambientWatermark
			})],
			historyLimit: params.context.historyLimit,
			ambientWatermark,
			includeBeforeSelf: params.context.ctxPayload.InboundEventKind === "room_event"
		});
	}
	const recoveredHistory = telegramPromptContextHistory(recoveredPromptContext);
	const recoveredInboundHistory = recoveredHistory.length > 0 ? recoveredHistory : void 0;
	const recoveredSendTyping = buildRecoveredTelegramChatActionSender({
		context: params.context,
		threadId: threadSpec.id,
		action: "typing"
	});
	const recoveredSendRecordVoice = buildRecoveredTelegramChatActionSender({
		context: params.context,
		threadId: threadSpec.id,
		action: "record_voice"
	});
	if (threadSpec.id != null) Object.assign(params.context.ctxPayload, {
		From: recoveredFrom,
		InboundHistory: recoveredInboundHistory,
		MessageThreadId: threadSpec.id,
		OriginatingTo: recoveredRoutingTarget,
		To: recoveredRoutingTarget,
		TransportThreadId: threadSpec.id,
		ChannelStructuredContext: recoveredPromptContext.length > 0 ? recoveredPromptContext : void 0
	});
	return {
		...params.context,
		historyKey: recoveredHistoryKey,
		threadSpec,
		resolvedThreadId: threadSpec.id,
		replyThreadId: threadSpec.id,
		sendTyping: recoveredSendTyping,
		sendRecordVoice: recoveredSendRecordVoice,
		turn: {
			...params.context.turn,
			record: {
				...params.context.turn.record,
				updateLastRoute: recoveredUpdateLastRoute
			}
		},
		ctxPayload: params.context.ctxPayload
	};
}
//#endregion
//#region extensions/telegram/src/draft-chunking.ts
function resolveTelegramDraftStreamingChunking(cfg, accountId) {
	return resolveChannelDraftStreamingChunking(cfg, "telegram", accountId, { fallbackLimit: TELEGRAM_TEXT_CHUNK_LIMIT });
}
//#endregion
//#region extensions/telegram/src/reasoning-lane-coordinator.ts
const REASONING_MESSAGE_RE = /^🧠\s+_/u;
const CORE_THINKING_HEADER_RE = /^Thinking\.{0,3}\s*\n+/u;
function markReasoningMessage(formatted) {
	return formatted.replace(CORE_THINKING_HEADER_RE, "").replace(/^_/u, "🧠 _");
}
const REASONING_TAG_PREFIXES = [
	"<think",
	"<thinking",
	"<thought",
	"<internal",
	"<antthinking",
	"<mm:think",
	"</think",
	"</thinking",
	"</thought",
	"</internal",
	"</antthinking",
	"</mm:think"
];
const THINKING_TAG_RE = /<\s*(\/?)\s*(?:(?:antml:|mm:)?(?:think(?:ing)?|thought)|antthinking)\b[^<>]*>/gi;
function extractThinkingFromTaggedStreamOutsideCode(text) {
	if (!text) return "";
	const codeRegions = findCodeRegions(text);
	let result = "";
	let lastIndex = 0;
	let inThinking = false;
	THINKING_TAG_RE.lastIndex = 0;
	for (const match of text.matchAll(THINKING_TAG_RE)) {
		const idx = match.index ?? 0;
		if (isInsideCode(idx, codeRegions)) continue;
		if (inThinking) result += text.slice(lastIndex, idx);
		inThinking = !(match[1] === "/");
		lastIndex = idx + match[0].length;
	}
	if (inThinking) result += text.slice(lastIndex);
	return result.trim();
}
function isPartialReasoningTagPrefix(text) {
	const trimmed = text.trim().replace(/^<\s*(\/?)\s+/u, "<$1");
	if (!trimmed.startsWith("<")) return false;
	if (trimmed.includes(">")) return false;
	return REASONING_TAG_PREFIXES.some((prefix) => prefix.startsWith(trimmed.toLowerCase()));
}
function splitTelegramReasoningText(text, isReasoning) {
	if (typeof text !== "string") return {};
	if (isReasoning !== true) return { answerText: text };
	const trimmed = text.trim();
	if (isPartialReasoningTagPrefix(trimmed)) return {};
	if (REASONING_MESSAGE_RE.test(trimmed)) return { reasoningText: trimmed };
	if (CORE_THINKING_HEADER_RE.test(trimmed)) return { reasoningText: markReasoningMessage(trimmed) };
	const taggedReasoning = extractThinkingFromTaggedStreamOutsideCode(text);
	const strippedAnswer = stripReasoningTagsFromText(text, {
		mode: "strict",
		trim: "both"
	});
	const reasoningText = taggedReasoning || strippedAnswer;
	if (!reasoningText) return {};
	return { reasoningText: markReasoningMessage(formatReasoningMessage(reasoningText)) };
}
function createTelegramReasoningStepState() {
	let reasoningStatus = "none";
	let bufferedFinalAnswer;
	const noteReasoningHint = () => {
		if (reasoningStatus === "none") reasoningStatus = "hinted";
	};
	const noteReasoningDelivered = () => {
		reasoningStatus = "delivered";
	};
	const shouldBufferFinalAnswer = () => {
		return reasoningStatus === "hinted" && !bufferedFinalAnswer;
	};
	const bufferFinalAnswer = (value) => {
		bufferedFinalAnswer = value;
	};
	const takeBufferedFinalAnswer = () => {
		const value = bufferedFinalAnswer;
		bufferedFinalAnswer = void 0;
		return value;
	};
	const resetForNextStep = () => {
		reasoningStatus = "none";
		bufferedFinalAnswer = void 0;
	};
	return {
		noteReasoningHint,
		noteReasoningDelivered,
		shouldBufferFinalAnswer,
		bufferFinalAnswer,
		takeBufferedFinalAnswer,
		resetForNextStep
	};
}
//#endregion
//#region extensions/telegram/src/bot-message-dispatch-draft.ts
const draftLogger = createSubsystemLogger("telegram/draft-stream");
const DRAFT_MIN_INITIAL_CHARS = 30;
function resolveDraftPartialText(previous, update) {
	const nextText = update.replace || update.isReasoningSnapshot || update.delta === void 0 ? update.text : `${previous}${update.delta}`;
	return nextText === previous ? void 0 : nextText;
}
function renderStreamText(turn, text) {
	return turn.telegramCfg.richMessages === true ? {
		text,
		richMessage: buildTelegramRichMarkdown(text, {
			tableMode: turn.tableMode,
			skipEntityDetection: turn.telegramCfg.linkPreview === false
		})
	} : {
		text,
		markdownSource: {
			text,
			tableMode: turn.tableMode
		}
	};
}
function createDraftState(params) {
	const isRoomEvent = params.context.ctxPayload.InboundEventKind === "room_event";
	const forceBlockStreamingForReasoning = params.resolvedReasoningLevel === "on" && params.streamMode !== "progress";
	const streamDeliveryEnabled = !isRoomEvent && params.streamMode !== "off";
	const previewAvailable = params.allowProviderPreview && streamDeliveryEnabled && !(params.replyToMode !== "off" && params.replyQuoteText != null) && !forceBlockStreamingForReasoning;
	const accountBlockStreamingEnabled = resolveChannelStreamingBlockEnabled(params.telegramCfg, {
		previewAvailable,
		blockStreamingDefault: params.cfg.agents?.defaults?.blockStreamingDefault
	});
	const canStreamAnswerDraft = previewAvailable && !accountBlockStreamingEnabled;
	const streamReasoningDraft = params.resolvedReasoningLevel === "stream";
	const streamReasoningInProgressDraft = streamReasoningDraft && params.streamMode === "progress" && canStreamAnswerDraft;
	const canStreamReasoningDraft = params.allowProviderPreview && !isRoomEvent && streamReasoningDraft && !streamReasoningInProgressDraft;
	const draftMaxChars = params.streamMode === "block" ? Math.min(resolveTelegramDraftStreamingChunking(params.cfg, params.context.route.accountId).maxChars, params.textLimit) : Math.min(params.textLimit, params.telegramCfg.richMessages === true ? TELEGRAM_RICH_TEXT_LIMIT : TELEGRAM_TEXT_CHUNK_LIMIT);
	const renderDraftText = (text) => renderStreamText(params, text);
	const createDraftLane = (laneName, enabled) => {
		return {
			stream: enabled ? (params.telegramDeps.createTelegramDraftStream ?? createTelegramDraftStream)({
				api: params.bot.api,
				chatId: params.context.chatId,
				maxChars: draftMaxChars,
				thread: params.context.threadSpec,
				replyToMessageId: params.draftReplyToMessageId,
				replyToMode: params.replyToMode,
				replyQuote: params.draftReplyToMessageId != null ? params.replyQuoteByMessageId[String(params.draftReplyToMessageId)] : void 0,
				richMessages: params.telegramCfg.richMessages,
				linkPreview: params.telegramCfg.linkPreview,
				minInitialChars: DRAFT_MIN_INITIAL_CHARS,
				renderText: renderDraftText,
				onRetainedPage: (page) => {
					lanes[laneName].retainedPromptContextPages.push({
						messageId: page.messageId,
						text: page.textSnapshot
					});
				},
				...params.context.threadSpec.id !== void 0 ? { validateProviderMessage: async (message) => {
					await reportTelegramProviderDelivery({
						message,
						messageId: message.message_id,
						fallbackChatId: params.context.chatId,
						successfulSendThread: params.context.threadSpec
					});
				} } : {},
				onProviderMessage: async (message) => {
					await recordSentMessage(params.context.chatId, message.message_id, params.cfg, {
						accountId: params.context.route.accountId,
						agentId: params.opts.ownerAgentId
					});
					await (params.telegramDeps.recordOutboundMessageForPromptContext ?? recordOutboundMessageForPromptContext)({
						cfg: params.cfg,
						ownerAgentId: params.opts.ownerAgentId,
						account: {
							accountId: params.context.route.accountId,
							...params.telegramCfg.name !== void 0 ? { name: params.telegramCfg.name } : {}
						},
						chatId: params.context.chatId,
						message,
						messageId: message.message_id,
						...params.context.threadSpec.id !== void 0 ? { messageThreadId: params.context.threadSpec.id } : {},
						successfulSendThread: params.context.threadSpec
					});
				},
				log: logVerbose,
				warn: (message) => draftLogger.warn(message, {
					lane: laneName,
					chatId: params.context.chatId,
					threadId: params.context.threadSpec.id
				})
			}) : void 0,
			lastPartialText: "",
			hasStreamedMessage: false,
			finalized: false,
			retainedPromptContextPages: []
		};
	};
	const lanes = {
		answer: createDraftLane("answer", canStreamAnswerDraft),
		reasoning: createDraftLane("reasoning", canStreamReasoningDraft)
	};
	const resolvedBlockStreamingEnabled = resolveChannelStreamingBlockEnabled(params.telegramCfg);
	const disableBlockStreaming = !streamDeliveryEnabled ? true : forceBlockStreamingForReasoning ? false : typeof resolvedBlockStreamingEnabled === "boolean" ? !resolvedBlockStreamingEnabled : canStreamAnswerDraft ? true : void 0;
	return {
		answerLane: lanes.answer,
		reasoningLane: lanes.reasoning,
		lanes,
		streamDeliveryEnabled,
		streamReasoningInProgressDraft,
		disableBlockStreaming,
		durableReasoningPayloadsEnabled: params.resolvedReasoningLevel === "on" || Boolean(lanes.reasoning.stream),
		lastAnswerPartialText: "",
		activeAnswerDraftIsToolProgressOnly: false,
		activeAnswerBlockAssistantMessageIndex: void 0,
		activeAnswerBlockDelivery: void 0,
		queuedAnswerBlockRotations: [],
		queuedAnswerBlockAssistantMessageIndex: void 0,
		pendingAnswerBlockAssistantMessageIndex: void 0,
		rotateAnswerLaneWhenQueuedBlocksSettle: false,
		draftEventQueue: Promise.resolve()
	};
}
function resetLaneState(turn, lane) {
	lane.lastPartialText = "";
	if (lane === turn.answerLane) turn.lastAnswerPartialText = "";
	lane.hasStreamedMessage = false;
	lane.finalized = false;
	lane.retainedPromptContextPages = [];
	if (lane === turn.answerLane) {
		turn.activeAnswerDraftIsToolProgressOnly = false;
		turn.pendingAnswerBlockAssistantMessageIndex = void 0;
		turn.activeAnswerBlockDelivery = void 0;
	}
}
function repositionLaneForNewMessage(turn, lane) {
	lane.stream?.rotateToNewMessageDeferringDelete();
	resetLaneState(turn, lane);
}
async function rotateLaneForNewMessage(turn, lane) {
	if (!lane.hasStreamedMessage && typeof lane.stream?.messageId() !== "number") {
		resetLaneState(turn, lane);
		return;
	}
	await lane.stream?.stop();
	lane.stream?.forceNewMessage();
	resetLaneState(turn, lane);
}
async function retireAnswerLane(turn, previewCleanup = "defer") {
	const lane = turn.answerLane;
	if (lane.finalized) await rotateLaneForNewMessage(turn, lane);
	else if (previewCleanup === "defer") repositionLaneForNewMessage(turn, lane);
	else {
		await lane.stream?.clear();
		lane.stream?.forceNewMessage();
		resetLaneState(turn, lane);
	}
}
async function rotateAnswerLaneForNewMessage(turn) {
	await turn.materializeAnswerLaneBeforeRotation();
	await retireAnswerLane(turn);
}
async function rotateAnswerLaneAfterToolProgress(turn) {
	if (!turn.activeAnswerDraftIsToolProgressOnly) return false;
	await retireAnswerLane(turn);
	turn.progressCompositor.resetActivity({ suppressed: true });
	turn.rotateAnswerLaneWhenQueuedBlocksSettle = false;
	return true;
}
async function rotateAnswerLaneAfterQueuedBlocksSettle(turn) {
	if (!turn.rotateAnswerLaneWhenQueuedBlocksSettle || turn.queuedAnswerBlockRotations.length > 0) return false;
	turn.rotateAnswerLaneWhenQueuedBlocksSettle = false;
	if (!turn.answerLane.hasStreamedMessage || turn.activeAnswerDraftIsToolProgressOnly) return false;
	await rotateAnswerLaneForNewMessage(turn);
	return true;
}
async function prepareAnswerLaneForText(turn) {
	if (turn.streamMode === "progress") return false;
	if (await rotateAnswerLaneAfterToolProgress(turn)) return true;
	if (await rotateAnswerLaneAfterQueuedBlocksSettle(turn)) return true;
	if (!turn.answerLane.finalized) return false;
	turn.answerLane.stream?.forceNewMessage();
	resetLaneState(turn, turn.answerLane);
	turn.rotateAnswerLaneWhenQueuedBlocksSettle = false;
	return true;
}
async function prepareAnswerLaneForToolProgress(turn) {
	if (turn.answerLane.finalized) {
		turn.answerLane.stream?.forceNewMessage();
		resetLaneState(turn, turn.answerLane);
	}
	if (turn.activeAnswerDraftIsToolProgressOnly) return;
	if (turn.streamMode !== "progress" && turn.answerLane.hasStreamedMessage) await rotateAnswerLaneForNewMessage(turn);
	turn.activeAnswerDraftIsToolProgressOnly = true;
}
function splitTextIntoLaneSegments(turn, update, isReasoning) {
	const split = splitTelegramReasoningText(update.text, isReasoning);
	const splitSegments = [];
	const useDelta = !update.replace && update.isReasoningSnapshot !== true && update.delta !== void 0;
	const suppressReasoning = turn.resolvedReasoningLevel === "off";
	if (split.reasoningText && !suppressReasoning) splitSegments.push({
		lane: "reasoning",
		text: split.reasoningText
	});
	if (split.answerText) splitSegments.push({
		lane: "answer",
		text: split.answerText
	});
	return {
		segments: splitSegments.map((segment) => ({
			lane: segment.lane,
			update: {
				text: segment.text,
				...!useDelta || splitSegments.length !== 1 ? {} : { delta: update.delta },
				...update.replace ? { replace: true } : {},
				...update.isReasoningSnapshot ? { isReasoningSnapshot: true } : {}
			}
		})),
		suppressedReasoningOnly: isReasoning === true && !split.answerText && (suppressReasoning || !split.reasoningText)
	};
}
function updateTelegramDraftFromPartial(turn, lane, update, schedule = true) {
	if (!lane.stream || !update.text) return;
	const nextText = resolveDraftPartialText(lane === turn.answerLane ? turn.lastAnswerPartialText : lane.lastPartialText, update);
	if (!nextText || lane === turn.answerLane && turn.streamMode === "progress") return;
	if (lane === turn.answerLane) {
		turn.activeAnswerDraftIsToolProgressOnly = false;
		turn.progressCompositor.resetActivity({ suppressed: true });
		turn.lastAnswerPartialText = nextText;
	}
	lane.hasStreamedMessage = true;
	lane.finalized = false;
	lane.lastPartialText = nextText;
	if (schedule) lane.stream.update(nextText);
	return nextText;
}
async function ingestDraftLaneSegments(turn, update, isReasoning) {
	if (isReasoning !== true) {
		const stream = turn.answerLane.stream;
		if (!stream) return;
		if (turn.streamMode !== "progress" && (turn.activeAnswerDraftIsToolProgressOnly || turn.answerLane.finalized || turn.rotateAnswerLaneWhenQueuedBlocksSettle && turn.queuedAnswerBlockRotations.length === 0 && turn.answerLane.hasStreamedMessage)) {
			const text = update.text;
			if (!text) return;
			await prepareAnswerLaneForText(turn);
			updateTelegramDraftFromPartial(turn, turn.answerLane, {
				text,
				replace: true
			});
			return;
		}
		let didMaterialize = false;
		let materialized;
		stream.updateLazy(() => {
			if (!didMaterialize) {
				const text = update.text;
				materialized = text ? updateTelegramDraftFromPartial(turn, turn.answerLane, {
					text,
					replace: true
				}, false) : void 0;
				didMaterialize = true;
			}
			return materialized;
		});
		return;
	}
	const split = splitTextIntoLaneSegments(turn, update, isReasoning);
	for (const segment of split.segments) {
		if (segment.lane === "answer") await prepareAnswerLaneForText(turn);
		if (segment.lane === "reasoning") {
			turn.reasoningStepState.noteReasoningHint();
			turn.reasoningStepState.noteReasoningDelivered();
		}
		updateTelegramDraftFromPartial(turn, turn.lanes[segment.lane], segment.update);
	}
}
function enqueueDraftEvent(turn, task) {
	turn.draftEventQueue = turn.draftEventQueue.then(async () => {
		if (!turn.isSuperseded()) await task();
	}).catch((err) => {
		logVerbose(`telegram: draft lane callback failed: ${String(err)}`);
	});
	return turn.draftEventQueue;
}
function recomputeTelegramQueuedAnswerBlockRotations(turn) {
	let previous = turn.activeAnswerBlockAssistantMessageIndex ?? turn.pendingAnswerBlockAssistantMessageIndex;
	turn.queuedAnswerBlockAssistantMessageIndex = void 0;
	for (const entry of turn.queuedAnswerBlockRotations) {
		if (entry.assistantMessageIndex === void 0) continue;
		entry.shouldRotateBeforeDelivery = previous !== void 0 && entry.assistantMessageIndex !== previous;
		previous = entry.assistantMessageIndex;
		turn.queuedAnswerBlockAssistantMessageIndex = entry.assistantMessageIndex;
	}
}
function telegramQueuedRotationMatches(entry, payload, assistantMessageIndex) {
	return assistantMessageIndex !== void 0 && entry.assistantMessageIndex !== void 0 ? assistantMessageIndex === entry.assistantMessageIndex : entry.text !== void 0 && payload.text !== void 0 && entry.text === payload.text;
}
async function prepareQueuedAnswerBlock(turn, payload, blockContext) {
	if (!splitTextIntoLaneSegments(turn, { text: payload.text }, payload.isReasoning).segments.some((segment) => segment.lane === "answer")) return;
	if (turn.streamMode !== "progress") turn.progressCompositor.resetActivity();
	const assistantMessageIndex = blockContext?.assistantMessageIndex;
	if (assistantMessageIndex === void 0) {
		turn.queuedAnswerBlockRotations.push({
			text: payload.text,
			shouldRotateBeforeDelivery: false
		});
		return;
	}
	const previous = turn.queuedAnswerBlockAssistantMessageIndex ?? turn.activeAnswerBlockAssistantMessageIndex ?? turn.pendingAnswerBlockAssistantMessageIndex;
	turn.queuedAnswerBlockRotations.push({
		assistantMessageIndex,
		text: payload.text,
		shouldRotateBeforeDelivery: previous !== void 0 && assistantMessageIndex !== previous
	});
	turn.queuedAnswerBlockAssistantMessageIndex = assistantMessageIndex;
}
function takeQueuedAnswerBlockRotation(turn, payload, assistantMessageIndex) {
	if (turn.queuedAnswerBlockRotations.length === 0) return false;
	const matchIndex = turn.queuedAnswerBlockRotations.findIndex((entry) => telegramQueuedRotationMatches(entry, payload, assistantMessageIndex));
	const matched = turn.queuedAnswerBlockRotations.splice(0, Math.max(matchIndex, 0) + 1).at(-1);
	if (matched?.assistantMessageIndex !== void 0) {
		turn.activeAnswerBlockAssistantMessageIndex = matched.assistantMessageIndex;
		turn.pendingAnswerBlockAssistantMessageIndex = void 0;
	}
	recomputeTelegramQueuedAnswerBlockRotations(turn);
	return matched?.shouldRotateBeforeDelivery ?? false;
}
function dropQueuedAnswerBlockRotation(turn, payload, assistantMessageIndex) {
	let matchIndex = turn.queuedAnswerBlockRotations.findIndex((entry) => telegramQueuedRotationMatches(entry, payload, assistantMessageIndex));
	if (matchIndex < 0 && assistantMessageIndex === void 0) matchIndex = turn.queuedAnswerBlockRotations.findIndex((entry) => entry.assistantMessageIndex === void 0);
	if (matchIndex < 0) return;
	const [matched] = turn.queuedAnswerBlockRotations.splice(matchIndex, 1);
	if (matchIndex === 0 && matched?.assistantMessageIndex !== void 0 && turn.rotateAnswerLaneWhenQueuedBlocksSettle && turn.activeAnswerBlockAssistantMessageIndex === void 0 && turn.answerLane.hasStreamedMessage) turn.pendingAnswerBlockAssistantMessageIndex = matched.assistantMessageIndex;
	recomputeTelegramQueuedAnswerBlockRotations(turn);
}
function isQueuedAnswerBlock(turn, payload, assistantMessageIndex) {
	return turn.queuedAnswerBlockRotations.some((entry) => telegramQueuedRotationMatches(entry, payload, assistantMessageIndex));
}
function beginDraftQueuedFollowup(turn) {
	turn.progressContinuationAdopted = false;
	for (const lane of [turn.answerLane, turn.reasoningLane]) {
		if (!lane.stream) continue;
		lane.stream.forceNewMessage();
		resetLaneState(turn, lane);
	}
}
async function cleanupDrafts(turn, superseded) {
	for (const lane of [turn.answerLane, turn.reasoningLane]) {
		const stream = lane.stream;
		if (!stream) continue;
		if (superseded) await stream.discard();
		else if (lane.finalized) await stream.stop();
		else await stream.clear();
	}
}
const waitForDraftEvents = (turn) => turn.draftEventQueue;
const flushDraftLane = (_turn, lane) => lane.stream?.flush();
//#endregion
//#region extensions/telegram/src/bot-message-dispatch-payload.ts
const applyTextToPayload = (payload, text) => payload.text === text ? payload : copyReplyPayloadMetadata(payload, {
	...payload,
	text
});
const projectPayloadForDelivery = (turn, payload, delivery) => {
	const projected = createOutboundPayloadPlan([payload])[0]?.payload;
	if (projected && delivery) {
		if (payload.replyToId !== void 0 || payload.replyToCurrent === true) {
			projected.replyToId = payload.replyToId;
			projected.replyToCurrent = payload.replyToCurrent;
			projected.replyToTag = payload.replyToTag || payload.replyToCurrent === true;
		} else if (delivery.replyToId !== void 0 || delivery.replyToCurrent === true) {
			projected.replyToId = delivery.replyToId;
			projected.replyToCurrent = delivery.replyToCurrent;
			projected.replyToTag = true;
		}
		projected.audioAsVoice = payload.audioAsVoice ?? delivery.audioAsVoice ?? projected.audioAsVoice;
		if (delivery.mediaUrls?.length) projected.mediaUrls = [...projected.mediaUrls ?? [], ...delivery.mediaUrls];
	}
	if (projected?.replyToCurrent && projected.replyToId === void 0) projected.replyToId = turn.context.ctxPayload.MessageSidFull ?? turn.context.ctxPayload.MessageSid;
	return projected ? createStructuredOutboundPayloadPlan([projected])[0]?.payload : void 0;
};
function normalizeDeliveryPayload(turn, payload) {
	const keepReasoningLane = payload.isReasoning === true && turn.durableReasoningPayloadsEnabled;
	const payloadForPlan = keepReasoningLane ? copyReplyPayloadMetadata(payload, { ...payload }) : payload;
	if (keepReasoningLane) delete payloadForPlan.isReasoning;
	const normalized = projectPayloadForDelivery(turn, payloadForPlan);
	if (!normalized) return;
	return normalizePreparedDeliveryPayload(turn, normalized);
}
function normalizePreparedDeliveryPayload(turn, payload) {
	if (turn.telegramCfg.richMessages === true && payload.presentation) return payload;
	return canonicalizeTelegramPresentationPayload(payload, {
		allowWebAppButtons: resolveTelegramTargetChatType(String(turn.context.chatId)) === "direct",
		richTables: false
	});
}
function applyQuoteReplyTarget(turn, payload) {
	if (!turn.implicitQuoteReplyTargetId || !turn.currentMessageIdForQuoteReply || payload.replyToId !== turn.currentMessageIdForQuoteReply || payload.replyToTag || payload.replyToCurrent) return payload;
	return copyReplyPayloadMetadata(payload, {
		...payload,
		replyToId: turn.implicitQuoteReplyTargetId
	});
}
//#endregion
//#region extensions/telegram/src/bot-message-dispatch-progress.ts
function buildTelegramThinkingProgressLine(progressTokens) {
	const label = `Thinking… (~${Math.round(progressTokens)} tokens)`;
	return {
		id: "reasoning:token-progress",
		kind: "item",
		icon: "🧠",
		label,
		text: `🧠 ${label}`,
		prefix: false
	};
}
function buildTelegramTextToolProgressLine(text, id) {
	return {
		...id ? { id } : {},
		kind: "item",
		label: "",
		text,
		prefix: false
	};
}
const TELEGRAM_COMPACTION_PROGRESS_ID = "context-compaction";
function buildTelegramCompactionProgressLine(phase) {
	const label = {
		start: "Compacting context...",
		complete: "Compaction complete",
		incomplete: "Compaction incomplete"
	}[phase];
	return {
		id: TELEGRAM_COMPACTION_PROGRESS_ID,
		kind: "item",
		icon: "🧹",
		label,
		text: `🧹 ${label}`,
		prefix: false
	};
}
function createProgressState(config, draftState, getTurn) {
	const progressState = {
		finalAnswerDeliveryStarted: false,
		finalAnswerDelivered: false,
		verboseProgressActive: () => false
	};
	const progressCompositor = createChannelProgressDraftCompositor({
		preparedItems: true,
		entry: config.telegramCfg,
		mode: config.streamMode,
		active: Boolean(draftState.answerLane.stream),
		seed: `${config.context.route.accountId}:${config.context.chatId}:${config.context.threadSpec.id ?? ""}`,
		reasoningGate: draftState.streamReasoningInProgressDraft,
		reasoningLinePrefix: "🧠 ",
		commentaryLinePrefix: "💬 ",
		commentaryItalics: false,
		updateOnLineChange: true,
		shouldStartNow: (line) => typeof line !== "string" && Boolean(line?.toolName),
		update: async (streamText, options) => {
			await prepareAnswerLaneForToolProgress(getTurn());
			draftState.answerLane.lastPartialText = streamText;
			draftState.answerLane.hasStreamedMessage = true;
			draftState.answerLane.finalized = false;
			draftState.answerLane.stream?.updatePreview(renderTelegramProgressDraftPreview(options.snapshot, {
				toolProgress: progressCompositor.previewToolProgressEnabled,
				richMessages: config.telegramCfg.richMessages === true,
				maxLines: resolveChannelProgressDraftMaxLines(config.telegramCfg),
				maxLineChars: resolveChannelProgressDraftMaxLineChars(config.telegramCfg)
			}));
			if (options.flush) await draftState.answerLane.stream?.flush();
		},
		deleteCurrent: async () => await retireAnswerLane(getTurn(), "clear")
	});
	return Object.assign(progressState, {
		progressCompositor,
		commentaryProgressEnabled: progressCompositor.commentaryProgressEnabled,
		progressPreambleEnabled: config.streamMode === "progress" && draftState.answerLane.stream ? true : void 0
	});
}
function canPushToolProgress(turn) {
	return Boolean(turn.answerLane.stream && !turn.verboseProgressActive() && !turn.answerLane.finalized && !turn.finalAnswerDeliveryStarted && !turn.finalAnswerDelivered);
}
function canPushCompactionProgress(turn) {
	return Boolean(turn.answerLane.stream && !turn.answerLane.finalized && !turn.finalAnswerDeliveryStarted && !turn.finalAnswerDelivered);
}
async function pushProgressEvent(turn, event) {
	return canPushToolProgress(turn) ? await event() : false;
}
async function pushToolProgress(turn, line, options) {
	if (!canPushToolProgress(turn)) return false;
	if (options?.id && turn.progressCompositor.getSnapshot().lines.some((entry) => typeof entry === "object" && entry.id === options.id)) return true;
	return await turn.progressCompositor.pushToolProgress(typeof line === "string" ? buildTelegramTextToolProgressLine(line, options?.id) : line, options);
}
async function pushReasoningProgress(turn, payload) {
	return await turn.progressCompositor.pushReasoningProgress(payload.text, { snapshot: payload.isReasoningSnapshot === true });
}
async function pushThinkingTokenProgress(turn, progressTokens) {
	return await pushToolProgress(turn, buildTelegramThinkingProgressLine(progressTokens), { startImmediately: true });
}
function markFinalStarted(turn) {
	turn.finalAnswerDeliveryStarted = true;
	turn.progressCompositor.markFinalReplyStarted();
}
function markFinalDelivered(turn) {
	turn.finalAnswerDelivered = true;
	turn.progressCompositor.markFinalReplyDelivered();
}
async function teardownProgressWindow(turn) {
	if (turn.activeAnswerDraftIsToolProgressOnly) {
		await rotateAnswerLaneAfterToolProgress(turn);
		return;
	}
	await retireAnswerLane(turn, "clear");
}
async function handleToolStart(turn, payload) {
	const toolName = payload.name?.trim();
	const progressPromise = pushProgressEvent(turn, () => turn.progressCompositor.pushToolEvent(payload));
	if (turn.statusReactionController && toolName) await turn.statusReactionController.setTool(toolName);
	return await progressPromise;
}
async function handleCompactionStart(turn) {
	const progress = canPushCompactionProgress(turn) ? turn.progressCompositor.pushToolProgress(buildTelegramCompactionProgressLine("start"), {
		startImmediately: true,
		flush: true
	}) : Promise.resolve(false);
	await turn.statusReactionController?.setCompacting();
	return await progress;
}
async function handleCompactionEnd(turn, payload) {
	const progress = canPushCompactionProgress(turn) ? turn.progressCompositor.pushToolProgress(buildTelegramCompactionProgressLine(payload?.completed === false ? "incomplete" : "complete"), {
		startImmediately: true,
		flush: true
	}) : Promise.resolve(false);
	turn.statusReactionController?.cancelPending();
	await turn.statusReactionController?.setThinking();
	return await progress;
}
async function handleItemEvent(turn, payload) {
	let rendered = false;
	await enqueueDraftEvent(turn, async () => {
		if (turn.finalAnswerDeliveryStarted || turn.finalAnswerDelivered) return;
		if (payload.phase === "start" && payload.kind === "tool" && turn.answerLane.stream && turn.streamMode !== "progress" && !turn.activeAnswerDraftIsToolProgressOnly) {
			await rotateAnswerLaneForNewMessage(turn);
			turn.progressCompositor.resetActivity();
		}
		rendered = payload.kind === "preamble" ? await turn.progressCompositor.pushItemEvent(payload) : await pushProgressEvent(turn, () => turn.progressCompositor.pushItemEvent(payload));
	});
	return rendered;
}
async function handlePlanUpdate(turn, payload) {
	return payload.phase === "update" && canPushToolProgress(turn) ? await turn.progressCompositor.pushPlanProgress(payload.steps, {
		explanation: payload.explanation,
		explanationFormat: payload.explanationFormat
	}) : false;
}
async function handleApprovalEvent(turn, payload) {
	return await pushProgressEvent(turn, () => turn.progressCompositor.pushApprovalEvent(payload));
}
//#endregion
//#region extensions/telegram/src/agent-config.ts
function resolveTelegramConfigReasoningDefault(cfg, agentId) {
	return resolveAgentConfig(cfg, agentId)?.reasoningDefault ?? cfg.agents?.defaults?.reasoningDefault ?? "off";
}
//#endregion
//#region extensions/telegram/src/auto-topic-label-config.ts
const AUTO_TOPIC_LABEL_DEFAULT_PROMPT = "Generate a very short topic label (2-4 words, max 25 chars) for a chat conversation based on the user's first message below. No emoji. Use the same language as the message, in sentence case: capitalize only the first word and words that language always capitalizes. Be concise and descriptive. Return ONLY the topic name, nothing else.";
function resolveAutoTopicLabelConfig(directConfig, accountConfig) {
	const config = directConfig ?? accountConfig;
	if (config === void 0 || config === true) return {
		enabled: true,
		prompt: AUTO_TOPIC_LABEL_DEFAULT_PROMPT
	};
	if (config === false || config.enabled === false) return null;
	return {
		enabled: true,
		prompt: config.prompt?.trim() || AUTO_TOPIC_LABEL_DEFAULT_PROMPT
	};
}
//#endregion
//#region extensions/telegram/src/auto-topic-label.ts
async function generateTelegramTopicLabel(params) {
	return await generateConversationLabel({
		...params,
		maxLength: 128
	});
}
//#endregion
//#region extensions/telegram/src/bot-message-dispatch-session.ts
function createFreshTelegramSessionEntryLoader(params) {
	const entriesByPathAndKey = /* @__PURE__ */ new Map();
	const load = ((agentId, sessionKey) => {
		const storePath = params.telegramDeps.resolveStorePath(params.cfg.session?.store, { agentId });
		const cacheKey = `${storePath}\0${sessionKey}`;
		if (entriesByPathAndKey.has(cacheKey)) return {
			storePath,
			entry: entriesByPathAndKey.get(cacheKey)
		};
		const entry = (params.telegramDeps.getSessionEntry ?? getSessionEntry)({
			storePath,
			sessionKey,
			readConsistency: "latest"
		});
		entriesByPathAndKey.set(cacheKey, entry);
		return {
			storePath,
			entry
		};
	});
	load.clear = () => entriesByPathAndKey.clear();
	return load;
}
function resolveTelegramReasoningLevel(params) {
	const configDefault = resolveTelegramConfigReasoningDefault(params.cfg, params.agentId);
	if (!params.sessionKey) return configDefault;
	try {
		const { entry } = params.loadFreshSessionEntry(params.agentId, params.sessionKey);
		const level = entry?.reasoningLevel;
		return level === "on" || level === "stream" || level === "off" ? level : configDefault;
	} catch {
		return "off";
	}
}
function resolveTelegramMirroredTranscriptText(payload) {
	const mediaUrls = payload.mediaUrls?.filter((url) => url.trim()) ?? [];
	if (mediaUrls.length > 0) return mediaUrls.map((url) => {
		const pathname = url.split("#")[0]?.split("?")[0] ?? url;
		const base = path.basename(pathname);
		return base && base !== "." && base !== "/" ? base : "media";
	}).join(", ");
	return payload.text?.trim() || null;
}
function resolveTelegramScopedTranscriptSession(params) {
	const { entry, storePath } = params.loadFreshSessionEntry(params.agentId, params.sessionKey);
	const sessionId = entry?.sessionId?.trim();
	return sessionId ? {
		sessionId,
		storePath
	} : void 0;
}
async function mirrorTelegramAssistantReplyToTranscript(params) {
	const text = resolveTelegramMirroredTranscriptText(params.payload);
	if (!text) return;
	const session = resolveTelegramScopedTranscriptSession({
		agentId: params.route.agentId,
		loadFreshSessionEntry: params.loadFreshSessionEntry,
		sessionKey: params.sessionKey
	});
	if (!session) return;
	const appended = await appendAssistantMirrorMessageByIdentity({
		agentId: params.route.agentId,
		config: params.cfg,
		idempotencyKey: params.idempotencyKey,
		deliveryMirror: {
			kind: "channel-final",
			sourceMessageId: params.idempotencyKey
		},
		sessionId: session.sessionId,
		sessionKey: params.sessionKey,
		storePath: session.storePath,
		text
	});
	if (!appended.ok && appended.code !== "session-rebound") logVerbose(`telegram transcript mirror append failed: ${appended.reason}`);
}
function createCurrentTurnTranscriptFinalResolver(params) {
	return async () => {
		if (!params.sessionKey) return;
		try {
			const { entry, storePath } = params.loadFreshSessionEntry(params.agentId, params.sessionKey);
			if (!entry?.sessionId) return;
			const latest = await readLatestAssistantTextByIdentity({
				agentId: params.agentId,
				sessionId: entry.sessionId,
				sessionKey: params.sessionKey,
				storePath
			});
			if (!latest?.timestamp || latest.timestamp < params.dispatchStartedAt) return;
			return {
				...latest.id ? { messageId: latest.id } : {},
				text: latest.text,
				...latest.openclawDelivery ? { openclawDelivery: latest.openclawDelivery } : {}
			};
		} catch (err) {
			logVerbose(`telegram transcript final candidate lookup failed: ${formatErrorMessage(err)}`);
			return;
		}
	};
}
//#endregion
//#region extensions/telegram/src/bot-message-dispatch.media-dedup.ts
function deduplicateBlockSentMedia(payload, sentBlockMediaUrls) {
	if (!payload.mediaUrls?.length || sentBlockMediaUrls.size === 0) return payload;
	const remainingMedia = payload.mediaUrls.filter((url) => !sentBlockMediaUrls.has(url));
	if (remainingMedia.length === payload.mediaUrls.length) return payload;
	if (remainingMedia.length === 0 && !payload.text) return;
	const mediaUrl = sentBlockMediaUrls.has(payload.mediaUrl?.trim() ?? "") ? void 0 : payload.mediaUrl;
	return copyReplyPayloadMetadata(payload, {
		...payload,
		mediaUrls: remainingMedia,
		mediaUrl,
		...payload.attachments ? { attachments: collectReplyMediaEntries(payload, [...remainingMedia, ...mediaUrl ? [mediaUrl] : []]).map(({ attachment }) => attachment ?? {}) } : {}
	});
}
//#endregion
//#region extensions/telegram/src/lane-delivery-state.ts
function createLaneDeliveryStateTracker() {
	const state = {
		delivered: false,
		skippedNonSilent: 0,
		failedNonSilent: 0
	};
	return {
		markDelivered: () => {
			state.delivered = true;
		},
		markNonSilentSkip: () => {
			state.skippedNonSilent += 1;
		},
		markNonSilentFailure: () => {
			state.failedNonSilent += 1;
		},
		snapshot: () => ({ ...state })
	};
}
//#endregion
//#region extensions/telegram/src/lane-delivery-text-deliverer.ts
function createLaneTextDeliverer(params) {
	const mediaChannelData = (channelData, options) => {
		if (!options?.stripButtons) return channelData;
		const telegramData = channelData?.telegram;
		if (!telegramData || typeof telegramData !== "object" || Array.isArray(telegramData)) return channelData;
		const { buttons: _buttons, ...telegramRest } = telegramData;
		if (_buttons === void 0) return channelData;
		const next = { ...channelData };
		if (Object.keys(telegramRest).length > 0) next.telegram = telegramRest;
		else delete next.telegram;
		return Object.keys(next).length > 0 ? next : void 0;
	};
	const withMediaChannelData = (payload, options) => {
		const channelData = mediaChannelData(payload.channelData, options);
		if (channelData === payload.channelData) return payload;
		if (channelData) return copyReplyPayloadMetadata(payload, {
			...payload,
			channelData
		});
		const { channelData: _channelData, ...rest } = payload;
		return copyReplyPayloadMetadata(payload, rest);
	};
	const withFallbackTelegramButtons = (payload, buttons) => {
		if (!buttons) return payload;
		const channelData = payload.channelData ?? {};
		const telegramData = channelData.telegram;
		if (telegramData && typeof telegramData === "object" && !Array.isArray(telegramData) && "buttons" in telegramData) return payload;
		const telegramRest = asNonArrayRecord(telegramData);
		return copyReplyPayloadMetadata(payload, {
			...payload,
			channelData: {
				...channelData,
				telegram: {
					...telegramRest,
					buttons
				}
			}
		});
	};
	const mediaOnlyPayload = (payload, text, options) => {
		if (getReplyPayloadTtsSupplement(payload)) return withFallbackTelegramButtons(withMediaChannelData(buildTtsSupplementMediaPayload(params.applyTextToPayload(payload, text)), options), options?.fallbackButtons);
		if (payload.audioAsVoice === true) {
			const { text: _text, presentation: _presentation, interactive: _interactive, btw: _btw, spokenText: _spokenText, ...voicePayload } = params.applyTextToPayload(payload, text);
			return withFallbackTelegramButtons(withMediaChannelData(copyReplyPayloadMetadata(payload, {
				...voicePayload,
				spokenText: text
			}), options), options?.fallbackButtons);
		}
		const { text: _text, presentation: _presentation, interactive: _interactive, btw: _btw, ...rest } = payload;
		return withFallbackTelegramButtons(withMediaChannelData(copyReplyPayloadMetadata(payload, rest), options), options?.fallbackButtons);
	};
	const clearUnfinalizedStream = async (lane) => {
		if (!lane.stream || lane.finalized) return;
		await params.clearDraftLane(lane);
		lane.lastPartialText = "";
		lane.hasStreamedMessage = false;
	};
	const discardUnmaterializedStream = async (lane) => {
		const stream = lane.stream;
		if (stream) {
			await stream.discard();
			stream.forceNewMessage();
		}
		lane.lastPartialText = "";
		lane.hasStreamedMessage = false;
		lane.finalized = false;
	};
	const rotateFinalizedStream = (lane) => {
		if (!lane.stream || !lane.finalized) return;
		lane.stream.forceNewMessage();
		lane.lastPartialText = "";
		lane.hasStreamedMessage = false;
		lane.finalized = false;
	};
	const recordRetainedPromptContextPages = async (lane, sequence) => {
		for (const page of lane.retainedPromptContextPages.splice(0)) await sequence.accept(page);
	};
	const streamText = async (laneName, lane, text, payload, useFinalTextRecovery, finalizePreview, buttons, promptContextSequence, followedByDurablePayload = false, allowErrorPayload = false, onPlatformSendDispatch, assertPlatformSendAuthorized) => {
		const stream = lane.stream;
		if (!stream || text.length === 0 || payload.isError && !allowErrorPayload) return;
		rotateFinalizedStream(lane);
		const finalText = text.trimEnd();
		const previewText = useFinalTextRecovery ? await resolveTranscriptBackedChannelFinalText({
			payload,
			finalText,
			resolveCandidateText: async () => selectLongerFinalText({
				finalText,
				candidateTexts: [stream.lastDeliveredText(), lane.lastPartialText]
			})
		}) : finalText;
		lane.lastPartialText = previewText;
		lane.hasStreamedMessage = true;
		lane.finalized = false;
		const previewAlreadyVisible = stream.lastDeliveredText() === previewText;
		if (!previewAlreadyVisible) {
			if (finalizePreview && onPlatformSendDispatch) stream.update(previewText, {
				onPlatformSendDispatch,
				assertPlatformSendAuthorized
			});
			else stream.update(previewText);
		} else if (finalizePreview) {
			await onPlatformSendDispatch?.();
			assertPlatformSendAuthorized?.();
		}
		if (finalizePreview) {
			if (previewAlreadyVisible) await params.stopDraftLane(lane).catch(() => void 0);
			else await params.stopDraftLane(lane);
		} else {
			await params.flushDraftLane(lane);
			if (buttons) await stream.waitForInFlight();
		}
		const messageId = stream.messageId();
		if (typeof messageId !== "number") {
			if (finalizePreview && stream.sendMayHaveLanded()) {
				await recordRetainedPromptContextPages(lane, promptContextSequence);
				await promptContextSequence.fail();
				lane.finalized = true;
				params.markDelivered();
				return { kind: "preview-retained" };
			}
			if (!finalizePreview) await discardUnmaterializedStream(lane);
			return;
		}
		if (finalizePreview && stream.lastDeliveredText() !== previewText) {
			if (!lane.retainedPromptContextPages.length || !stream.remainingFinalContent()?.text.trimEnd()) promptContextSequence.invalidate();
			return;
		}
		params.markDelivered();
		const activeSnapshot = finalizePreview || buttons ? stream.currentMessageSnapshot() : void 0;
		let buttonsAttached = false;
		let buttonAttachmentError;
		if (buttons && activeSnapshot) try {
			await onPlatformSendDispatch?.();
			assertPlatformSendAuthorized?.();
			await params.editStreamMessage({
				laneName,
				messageId,
				text: activeSnapshot.sourceText,
				...activeSnapshot.sourceTextMode ? { textMode: activeSnapshot.sourceTextMode } : {},
				buttons
			});
			buttonsAttached = true;
		} catch (err) {
			buttonAttachmentError = err;
			params.log(`telegram: ${laneName} stream button edit failed: ${String(err)}`);
		}
		if (!finalizePreview && buttonAttachmentError === void 0) return { kind: "preview-updated" };
		if (!activeSnapshot) {
			if (finalizePreview) promptContextSequence.invalidate();
			return;
		}
		lane.finalized = true;
		const delivery = {
			content: previewText,
			messageId,
			buttonsAttached,
			receipt: createPreviewMessageReceipt({ id: messageId })
		};
		try {
			await recordRetainedPromptContextPages(lane, promptContextSequence);
			await promptContextSequence.accept({
				messageId,
				text: activeSnapshot.text
			});
			if (!followedByDurablePayload) await promptContextSequence.finish();
		} catch (error) {
			promptContextSequence.invalidate();
			return {
				kind: "preview-finalized-partial",
				delivery,
				error
			};
		}
		return buttonAttachmentError ? {
			kind: "preview-finalized-partial",
			delivery,
			error: buttonAttachmentError
		} : {
			kind: "preview-finalized",
			delivery
		};
	};
	return async ({ laneName, text: initialText, payload: initialPayload, replyTargetBeforeRecovery = initialPayload, infoKind, buttons, finalizePreview: requestedFinalizePreview, durable: requestedDurable, allowStream = true, promptContextSequence: suppliedPromptContextSequence, onPlatformSendDispatch, assertPlatformSendAuthorized, bindPendingFinalDelivery, onMediaAccepted }) => {
		let text = initialText;
		let payload = initialPayload;
		const lane = params.lanes[laneName];
		const promptContextSequence = suppliedPromptContextSequence ?? params.createPromptContextSequence();
		const originalReplyToId = replyTargetBeforeRecovery.replyToId;
		let reply = resolveSendableOutboundReplyParts(payload, { text });
		const isDurableFinal = infoKind === "final";
		const finalizePreview = requestedFinalizePreview ?? isDurableFinal;
		const durable = requestedDurable ?? isDurableFinal;
		let streamedErrorDraftText = isDurableFinal && payload.isError === true && laneName === "answer" && lane.stream && lane.hasStreamedMessage && !lane.finalized && !reply.hasMedia && text.trim() ? (() => {
			const existing = (lane.lastPartialText || lane.stream?.lastDeliveredText() || "").trimEnd();
			const notice = text.trim();
			return existing && !existing.endsWith(notice) ? `${existing}\n\n${notice}` : existing || notice;
		})() : void 0;
		const recoveryText = streamedErrorDraftText ?? text;
		const canRecoverFromTextPreview = allowStream && !reply.hasMedia && (!payload.isError || streamedErrorDraftText !== void 0);
		const canRecoverFromMediaPreview = finalizePreview && reply.hasMedia && lane.hasStreamedMessage && !lane.finalized && !payload.isError;
		if (isDurableFinal && lane.stream && (canRecoverFromTextPreview || canRecoverFromMediaPreview) && isPotentialTruncatedFinal(recoveryText)) {
			let candidate;
			await resolveTranscriptBackedChannelFinalText({
				payload,
				finalText: recoveryText,
				resolveCandidateText: async () => {
					candidate = await params.resolveFinalPayloadCandidate?.({
						finalText: recoveryText,
						laneName,
						payload,
						candidateTexts: [lane.stream?.lastDeliveredText(), lane.lastPartialText]
					});
					return candidate?.text;
				}
			});
			if (candidate) {
				payload = candidate;
				text = candidate.text ?? "";
				reply = resolveSendableOutboundReplyParts(payload, { text });
				streamedErrorDraftText = streamedErrorDraftText === void 0 ? void 0 : text;
			}
		}
		const preservesPreviewReplyTarget = payload.replyToId === void 0 || payload.replyToId === originalReplyToId;
		const streamed = preservesPreviewReplyTarget && allowStream && !reply.hasMedia ? await streamText(laneName, lane, streamedErrorDraftText ?? text, payload, isDurableFinal, finalizePreview, buttons, promptContextSequence, false, streamedErrorDraftText !== void 0, onPlatformSendDispatch, assertPlatformSendAuthorized) : void 0;
		if (streamed) return streamed;
		if (preservesPreviewReplyTarget && finalizePreview && reply.hasMedia && lane.stream && lane.hasStreamedMessage && !lane.finalized && text.trim().length > 0) {
			const finalizedPreview = await streamText(laneName, lane, text, payload, isDurableFinal, true, buttons, promptContextSequence, true, false, onPlatformSendDispatch, assertPlatformSendAuthorized);
			if (finalizedPreview) {
				if (finalizedPreview.kind === "preview-finalized-partial") return finalizedPreview;
				const stripButtons = finalizedPreview.kind === "preview-finalized" && finalizedPreview.delivery.buttonsAttached === true;
				const mediaText = finalizedPreview.kind === "preview-finalized" ? finalizedPreview.delivery.content : text;
				try {
					await params.sendPayload(mediaOnlyPayload(payload, mediaText, {
						stripButtons,
						fallbackButtons: stripButtons ? void 0 : buttons
					}), {
						afterAcceptedDraft: true,
						durable,
						promptContextSequence,
						onPlatformSendDispatch,
						assertPlatformSendAuthorized,
						bindPendingFinalDelivery,
						onMediaAccepted
					});
				} catch (error) {
					if (durable && finalizedPreview.kind === "preview-finalized") return {
						...finalizedPreview,
						kind: "preview-finalized-partial",
						error
					};
					throw error;
				}
				return finalizedPreview;
			}
		}
		const retainedFinalContent = preservesPreviewReplyTarget && finalizePreview && lane.retainedPromptContextPages.length > 0 ? lane.stream?.remainingFinalContent() : void 0;
		const afterAcceptedDraft = retainedFinalContent !== void 0 || lane.stream?.hasConsumedReplyTarget() === true;
		if (finalizePreview) {
			await recordRetainedPromptContextPages(lane, promptContextSequence);
			await clearUnfinalizedStream(lane);
		}
		const delivered = await params.sendPayload(params.applyTextToPayload(payload, retainedFinalContent?.sourceText ?? text), {
			afterAcceptedDraft,
			durable,
			promptContextSequence,
			onPlatformSendDispatch,
			assertPlatformSendAuthorized,
			bindPendingFinalDelivery,
			onMediaAccepted,
			...retainedFinalContent?.sourceTextMode === "html" ? { textMode: "html" } : {}
		});
		if (delivered && finalizePreview) lane.finalized = true;
		return { kind: delivered ? "sent" : "skipped" };
	};
}
//#endregion
//#region extensions/telegram/src/bot-message-dispatch-delivery.ts
const promptContextDeliverySignature = (payload) => {
	const projected = createStructuredOutboundPayloadPlan([payload])[0]?.payload;
	return projected ? resolveTelegramPromptContextDeliverySignature(projected) : void 0;
};
function resolvePromptContextSource(turn, final, ...payloads) {
	const finalPayload = final ? projectPayloadForDelivery(turn, { text: final.text }, final.openclawDelivery) : void 0;
	const finalSignature = finalPayload ? promptContextDeliverySignature(finalPayload) : void 0;
	if (!final?.messageId || !finalSignature) return;
	return payloads.some((payload) => promptContextDeliverySignature(payload) === finalSignature) ? { transcriptMessageId: final.messageId } : void 0;
}
async function recordPromptContextMessage(turn, record) {
	const { context } = turn;
	return await (turn.telegramDeps.recordOutboundMessageForPromptContext ?? recordOutboundMessageForPromptContext)({
		cfg: turn.cfg,
		ownerAgentId: turn.opts.ownerAgentId,
		account: {
			accountId: context.route.accountId,
			...turn.telegramCfg.name !== void 0 ? { name: turn.telegramCfg.name } : {},
			...context.primaryCtx.me ? { bot: context.primaryCtx.me } : {}
		},
		...context.primaryCtx.me?.id !== void 0 ? { botUserId: context.primaryCtx.me.id } : {},
		chatId: String(context.chatId),
		message: record.message ?? { message_id: record.messageId },
		messageId: record.messageId,
		...record.text ? { text: record.text } : {},
		...record.projection ? { promptContextProjection: record.projection } : {},
		...turn.context.threadSpec.id !== void 0 ? { messageThreadId: turn.context.threadSpec.id } : {},
		successfulSendThread: turn.context.threadSpec
	});
}
const createPromptContextSequence = (turn, source) => createTelegramPromptContextProjectionSequence({
	...source ? { source } : {},
	record: async (record) => await recordPromptContextMessage(turn, record)
});
function createTranscriptMirror(turn, sequenceOwner = turn) {
	const sessionKey = turn.context.ctxPayload.SessionKey;
	return sessionKey ? async (payload) => {
		const idempotencyKey = `telegram-final:${sessionKey}:${turn.transcriptMirrorTurnId}:${sequenceOwner.transcriptMirrorSequence++}`;
		await mirrorTelegramAssistantReplyToTranscript({
			cfg: turn.cfg,
			idempotencyKey,
			loadFreshSessionEntry: turn.loadFreshSessionEntry,
			route: turn.context.route,
			sessionKey,
			payload
		});
	} : void 0;
}
function createDeliveryBaseOptions(turn) {
	const { context } = turn;
	return {
		cfg: turn.cfg,
		ownerAgentId: turn.opts.ownerAgentId,
		chatId: String(context.chatId),
		accountId: context.route.accountId,
		sessionKeyForInternalHooks: context.ctxPayload.SessionKey,
		mirrorIsGroup: context.isGroup,
		mirrorGroupId: context.isGroup ? String(context.chatId) : void 0,
		token: turn.opts.token,
		runtime: turn.runtime,
		bot: turn.bot,
		mediaLocalRoots: turn.mediaLocalRoots,
		mediaMaxBytes: (turn.opts.mediaMaxMb ?? turn.telegramCfg.mediaMaxMb ?? 100) * 1024 * 1024,
		replyToMode: turn.replyToMode,
		textLimit: turn.textLimit,
		thread: turn.context.threadSpec,
		tableMode: turn.tableMode,
		chunkMode: turn.chunkMode,
		richMessages: turn.telegramCfg.richMessages,
		linkPreview: turn.telegramCfg.linkPreview,
		replyQuoteMessageId: turn.replyQuoteMessageId,
		replyQuoteText: turn.replyQuoteText,
		replyQuotePosition: turn.replyQuotePosition,
		replyQuoteEntities: turn.replyQuoteEntities,
		replyQuoteByMessageId: turn.replyQuoteByMessageId,
		transcriptMirror: createTranscriptMirror(turn)
	};
}
const usesNativeTelegramQuote = (turn, payload) => turn.replyQuoteText != null || payload.replyToId != null && turn.replyQuoteByMessageId[payload.replyToId] != null;
async function sendPayload(sourceTurn, payload, options) {
	if (sourceTurn.isSuperseded()) {
		await options?.promptContextSequence?.fail();
		return false;
	}
	const deliverySession = getGroupThreadDeliverySession();
	const turn = deliverySession ? {
		...sourceTurn,
		context: {
			...sourceTurn.context,
			route: {
				...sourceTurn.context.route,
				...deliverySession
			},
			ctxPayload: {
				...sourceTurn.context.ctxPayload,
				AgentId: deliverySession.agentId,
				SessionKey: deliverySession.sessionKey,
				RuntimePolicySessionKey: deliverySession.sessionKey
			}
		},
		mediaLocalRoots: getAgentScopedMediaLocalRoots(sourceTurn.cfg, deliverySession.agentId)
	} : sourceTurn;
	const targetedPayload = applyQuoteReplyTarget(turn, payload);
	const finalReplyTargetId = resolveTelegramReplyId(targetedPayload.replyToId);
	const targetsDifferentMessage = finalReplyTargetId != null && finalReplyTargetId !== turn.draftReplyToMessageId;
	const consumedSingleUseReply = options?.afterAcceptedDraft === true && isSingleUseReplyToMode(turn.replyToMode) && !targetsDifferentMessage;
	const deliverablePayload = consumedSingleUseReply ? copyReplyPayloadMetadata(targetedPayload, (({ replyToId: _replyToId, replyToTag: _tag, replyToCurrent: _current, ...rest }) => rest)(targetedPayload)) : targetedPayload;
	const effectiveReplyToMode = consumedSingleUseReply ? "off" : turn.replyToMode;
	const projectionSequence = options?.promptContextSequence ?? createPromptContextSequence(turn, options?.durable ? resolvePromptContextSource(turn, await turn.resolveCurrentTurnTranscriptFinal(), deliverablePayload) : void 0);
	const projectedPayload = withTelegramPromptContextSource(deliverablePayload, projectionSequence.source);
	const effectivePayload = options?.bindPendingFinalDelivery ? options.bindPendingFinalDelivery(projectedPayload) : projectedPayload;
	const silent = options?.silent ?? (turn.telegramCfg.silentErrorReplies === true && payload.isError === true);
	const durableDelivery = turn.telegramDeps.deliverStructuredInboundReplyWithMessageSendContext;
	if (options?.durable && durableDelivery && projectionSequence.isFresh()) {
		const plan = createStructuredOutboundPayloadPlan([effectivePayload])[0];
		if (!plan) {
			await projectionSequence.fail();
			return false;
		}
		const durable = await durableDelivery({
			cfg: turn.cfg,
			channel: "telegram",
			to: turn.context.ctxPayload.OriginatingTo ?? turn.context.ctxPayload.To ?? `telegram:${turn.context.chatId}`,
			accountId: turn.context.route.accountId,
			agentId: turn.context.route.agentId,
			ctxPayload: turn.context.ctxPayload,
			plan,
			info: { kind: "final" },
			replyToMode: effectiveReplyToMode,
			threadId: turn.context.threadSpec.id,
			formatting: {
				textLimit: turn.textLimit,
				tableMode: turn.tableMode,
				chunkMode: turn.chunkMode,
				...options?.textMode === "html" ? { parseMode: "HTML" } : {}
			},
			silent,
			requiredCapabilities: deriveDurableFinalDeliveryRequirements({
				payload: effectivePayload,
				replyToId: effectivePayload.replyToId,
				threadId: turn.context.threadSpec.id,
				silent,
				payloadTransport: true,
				extraCapabilities: { nativeQuote: !consumedSingleUseReply && usesNativeTelegramQuote(turn, effectivePayload) }
			})
		});
		if (durable.status === "failed") return await failPromptContextSequence(projectionSequence, durable.error);
		if (durable.status === "handled_visible") {
			turn.deliveryState.markDelivered();
			return true;
		}
		if (durable.status === "handled_no_send") {
			await projectionSequence.fail();
			return false;
		}
	}
	try {
		const transcriptMirror = createTranscriptMirror(turn, sourceTurn);
		const result = await (turn.telegramDeps.deliverStructuredReplies ?? deliverStructuredReplies)({
			...createDeliveryBaseOptions(turn),
			replyToMode: effectiveReplyToMode,
			transcriptMirror: options?.durable && options?.mirrorTranscript !== false ? transcriptMirror : void 0,
			replies: [effectivePayload],
			onMediaAccepted: options?.onMediaAccepted,
			onVoiceRecording: turn.context.sendRecordVoice,
			silent,
			mediaLoader: turn.telegramDeps.loadWebMedia,
			promptContextSequence: projectionSequence,
			onPlatformSendDispatch: options?.onPlatformSendDispatch,
			assertPlatformSendAuthorized: options?.assertPlatformSendAuthorized,
			...options?.textMode ? { textMode: options.textMode } : {}
		});
		if (!result.delivered) {
			await projectionSequence.fail();
			return false;
		}
		try {
			await projectionSequence.finish();
		} catch (error) {
			if (!result.receipt?.platformMessageIds.length) throw error;
			throw mergeTelegramPartialDeliveryError(error, {
				receipt: result.receipt,
				messageIds: result.receipt.platformMessageIds,
				visibleReplySent: true
			});
		}
		turn.deliveryState.markDelivered();
		return true;
	} catch (error) {
		return await failPromptContextSequence(projectionSequence, error);
	}
}
async function emitPreviewFinalizedHook(turn, result) {
	if (turn.isSuperseded() || result.kind !== "preview-finalized" && result.kind !== "preview-finalized-partial") return;
	(turn.telegramDeps.emitTelegramMessageSentHooks ?? emitTelegramMessageSentHooks)({
		sessionKeyForInternalHooks: turn.context.ctxPayload.SessionKey,
		chatId: String(turn.context.chatId),
		accountId: turn.context.route.accountId,
		content: result.delivery.content,
		success: result.kind === "preview-finalized",
		messageId: result.delivery.messageId,
		isGroup: turn.context.isGroup,
		groupId: turn.context.isGroup ? String(turn.context.chatId) : void 0
	});
	const transcriptMirror = createTranscriptMirror(turn);
	if (transcriptMirror && result.delivery.content) transcriptMirror({ text: result.delivery.content }).catch((err) => {
		logVerbose(`telegram preview-finalized transcriptMirror failed: ${formatErrorMessage(err)}`);
	});
}
async function handlePreviewFinalizedResult(turn, result) {
	if (result.kind !== "preview-finalized" && result.kind !== "preview-finalized-partial") return;
	await emitPreviewFinalizedHook(turn, result);
	if (result.kind === "preview-finalized-partial") {
		markFinalDelivered(turn);
		throw mergeTelegramPartialDeliveryError(result.error, {
			receipt: result.delivery.receipt,
			content: result.delivery.content,
			messageIds: result.delivery.receipt.platformMessageIds,
			visibleReplySent: true
		});
	}
}
function registerTelegramQuestionDeliveryForMessage(turn, payload, delivery) {
	const { chatId } = turn.context;
	const accountId = turn.context.route.accountId;
	const api = turn.bot.api;
	const cfg = turn.cfg;
	const linkPreview = turn.telegramCfg.linkPreview;
	const editText = turn.telegramDeps.editMessageTelegram ?? editMessageTelegram;
	const { messageId, text } = delivery;
	registerTelegramQuestionDelivery({
		accountId,
		chatId: String(chatId),
		messageId,
		payload,
		text,
		textLimit: turn.textLimit,
		clearButtons: async () => {
			await editMessageReplyMarkupTelegram(chatId, messageId, [], {
				api,
				cfg,
				accountId
			});
		},
		annotate: async (finalText) => {
			await editText(chatId, messageId, finalText, {
				api,
				cfg,
				accountId,
				linkPreview
			});
		}
	});
}
async function materializeAnswerLaneBeforeRotation(turn) {
	const block = turn.activeAnswerBlockDelivery;
	const lane = turn.answerLane;
	if (!block || !lane.stream || !lane.hasStreamedMessage || lane.finalized || turn.activeAnswerDraftIsToolProgressOnly) return;
	const text = lane.lastPartialText || turn.lastAnswerPartialText || block.text;
	if (!text?.trim()) return;
	const result = await turn.deliverLaneText({
		laneName: "answer",
		text,
		payload: block.payload,
		infoKind: "block",
		buttons: block.buttons,
		finalizePreview: true,
		durable: false
	});
	turn.activeAnswerBlockDelivery = void 0;
	await handlePreviewFinalizedResult(turn, result);
}
async function cleanupProgressWithoutBlockingFinal(phase, cleanup) {
	try {
		await cleanup();
	} catch (err) {
		logVerbose(`telegram progress ${phase} failed before final delivery: ${formatErrorMessage(err)}`);
	}
}
async function deliverTelegramProgressModeFinalAnswer(turn, payload, text, promptContextSequence, onPlatformSendDispatch, assertPlatformSendAuthorized, bindPendingFinalDelivery) {
	const afterAcceptedDraft = turn.answerLane.stream?.hasConsumedReplyTarget() === true;
	await cleanupProgressWithoutBlockingFinal("discard", async () => {
		await turn.answerLane.stream?.discard();
	});
	if (payload.isError === true) await cleanupProgressWithoutBlockingFinal("teardown", async () => {
		await teardownProgressWindow(turn);
	});
	const delivered = await sendPayload(turn, applyTextToPayload(payload, text), {
		afterAcceptedDraft,
		durable: true,
		promptContextSequence,
		onPlatformSendDispatch,
		assertPlatformSendAuthorized,
		bindPendingFinalDelivery
	});
	if (payload.isError !== true) await cleanupProgressWithoutBlockingFinal("teardown", async () => {
		await teardownProgressWindow(turn);
	});
	if (!delivered) return { kind: "skipped" };
	turn.answerLane.finalized = true;
	markFinalDelivered(turn);
	return { kind: "sent" };
}
function recoverFinalPayload(turn, payload, text, final) {
	const projected = projectPayloadForDelivery(turn, applyTextToPayload(payload, text), final?.openclawDelivery);
	return projected ? deduplicateBlockSentMedia(preserveReplyPayloadMediaSelection(payload, projected), turn.sentBlockMediaUrls) : void 0;
}
async function deliverFinalAnswerText(turn, answerPayload, text, buttons, onPlatformSendDispatch, assertPlatformSendAuthorized, bindPendingFinalDelivery) {
	const transcriptFinal = await turn.resolveCurrentTurnTranscriptFinal();
	const selectedText = await resolveTranscriptBackedChannelFinalText({
		payload: answerPayload,
		finalText: text,
		resolveCandidateText: async () => transcriptFinal?.text
	});
	const finalPayload = selectedText === text ? answerPayload : recoverFinalPayload(turn, answerPayload, selectedText, transcriptFinal);
	if (!finalPayload) return { kind: "skipped" };
	const finalText = selectedText === text ? text : finalPayload.text ?? "";
	const source = resolvePromptContextSource(turn, transcriptFinal, answerPayload, applyTextToPayload(finalPayload, finalText));
	const promptContextSequence = createPromptContextSequence(turn, source);
	const isFollowUp = turn.finalAnswerDelivered;
	let result;
	if (!isFollowUp && turn.streamMode === "progress") result = await deliverTelegramProgressModeFinalAnswer(turn, finalPayload, finalText, promptContextSequence, onPlatformSendDispatch, assertPlatformSendAuthorized, bindPendingFinalDelivery);
	else {
		if (isFollowUp) await prepareAnswerLaneForText(turn);
		else if (!await rotateAnswerLaneAfterToolProgress(turn)) await rotateAnswerLaneAfterQueuedBlocksSettle(turn);
		result = await turn.deliverLaneText({
			laneName: "answer",
			text: finalText,
			payload: finalPayload,
			replyTargetBeforeRecovery: answerPayload,
			infoKind: "final",
			buttons,
			allowStream: !usesNativeTelegramQuote(turn, finalPayload) || turn.replyQuoteText == null && resolveTelegramReplyId(finalPayload.replyToId) === turn.answerLane.stream?.currentMessageSnapshot()?.replyToMessageId,
			promptContextSequence,
			onPlatformSendDispatch,
			assertPlatformSendAuthorized,
			bindPendingFinalDelivery
		});
		if (!isFollowUp && result.kind !== "skipped") markFinalDelivered(turn);
	}
	await handlePreviewFinalizedResult(turn, result);
	if (result.kind === "preview-finalized") registerTelegramQuestionDeliveryForMessage(turn, finalPayload, {
		messageId: result.delivery.messageId,
		text: result.delivery.content
	});
	return result;
}
async function finalizePendingAnswerBlockDraft(turn) {
	const block = turn.activeAnswerBlockDelivery;
	if (!block || turn.queuedFinal || turn.dispatchError || turn.isSuperseded() || turn.answerLane.finalized) return;
	const content = block.text.trimEnd();
	if (!content) return;
	markFinalStarted(turn);
	await deliverFinalAnswerText(turn, block.payload, content, block.buttons);
	turn.activeAnswerBlockDelivery = void 0;
}
async function deliverFallback(turn, replies, silent) {
	return await (turn.telegramDeps.deliverReplies ?? deliverReplies)({
		replies,
		...createDeliveryBaseOptions(turn),
		silent,
		mediaLoader: turn.telegramDeps.loadWebMedia
	});
}
function createDeliveryState(config, getTurn) {
	const { context } = config;
	const sessionKey = context.ctxPayload.SessionKey;
	const implicitQuoteReplyTargetId = context.ctxPayload.ReplyToIsQuote && !context.msg.reply_to_message?.from?.is_bot && config.replyQuoteMessageId != null ? String(config.replyQuoteMessageId) : void 0;
	const currentMessageIdForQuoteReply = implicitQuoteReplyTargetId && context.ctxPayload.MessageSid ? context.ctxPayload.MessageSid : void 0;
	const deliveryState = createLaneDeliveryStateTracker();
	return {
		deliveryState,
		deliverLaneText: createLaneTextDeliverer({
			lanes: config.lanes,
			applyTextToPayload,
			sendPayload: async (payload, options) => await sendPayload(getTurn(), payload, options),
			flushDraftLane: async (lane) => await flushDraftLane(getTurn(), lane),
			stopDraftLane: async (lane) => await lane.stream?.stop(),
			clearDraftLane: async (lane) => await lane.stream?.clear(),
			editStreamMessage: async ({ messageId, text, textMode, buttons }) => {
				const turn = getTurn();
				if (!turn.isSuperseded()) await (turn.telegramDeps.editMessageTelegram ?? editMessageTelegram)(turn.context.chatId, messageId, text, {
					api: turn.bot.api,
					cfg: turn.cfg,
					accountId: turn.context.route.accountId,
					linkPreview: turn.telegramCfg.linkPreview,
					textMode,
					buttons
				});
			},
			createPromptContextSequence: () => createPromptContextSequence(getTurn()),
			resolveFinalPayloadCandidate: async ({ finalText, payload, candidateTexts }) => {
				const turn = getTurn();
				const transcriptFinal = await turn.resolveCurrentTurnTranscriptFinal();
				const previewText = selectLongerFinalText({
					finalText,
					candidateTexts
				});
				const selectedText = await resolveTranscriptBackedChannelFinalText({
					payload,
					finalText,
					resolveCandidateText: async () => transcriptFinal?.text
				});
				if (selectedText === finalText) return;
				const recovered = recoverFinalPayload(turn, payload, selectedText, transcriptFinal);
				return recovered && previewText && previewText.length > (recovered.text ?? "").trimEnd().length ? applyTextToPayload(recovered, previewText) : recovered;
			},
			log: logVerbose,
			markDelivered: deliveryState.markDelivered
		}),
		materializeAnswerLaneBeforeRotation: async () => await materializeAnswerLaneBeforeRotation(getTurn()),
		resolveCurrentTurnTranscriptFinal: context.ctxPayload.GroupThread ? async () => void 0 : createCurrentTurnTranscriptFinalResolver({
			agentId: context.route.agentId,
			dispatchStartedAt: config.dispatchStartedAt,
			loadFreshSessionEntry: config.loadFreshSessionEntry,
			sessionKey
		}),
		transcriptMirrorSequence: 0,
		transcriptMirrorTurnId: `${context.chatId}:${context.ctxPayload.MessageSid ?? context.msg.message_id ?? config.dispatchStartedAt}`,
		implicitQuoteReplyTargetId,
		currentMessageIdForQuoteReply
	};
}
//#endregion
//#region extensions/telegram/src/error-policy.ts
const errorCooldownStore = /* @__PURE__ */ new Map();
const DEFAULT_ERROR_COOLDOWN_MS = 144e5;
function pruneExpiredCooldowns(messageStore, now) {
	for (const [message, expiresAt] of messageStore) if (!isFutureDateTimestampMs(expiresAt, { nowMs: now })) messageStore.delete(message);
}
function resolveTelegramErrorPolicy(params) {
	const configs = [
		params.accountConfig,
		params.groupConfig,
		params.topicConfig
	];
	let policy = "always";
	for (const config of configs) if (config?.errorPolicy) policy = config.errorPolicy;
	return {
		policy,
		cooldownMs: DEFAULT_ERROR_COOLDOWN_MS
	};
}
function buildTelegramErrorScopeKey(params) {
	return `${params.accountId}:${buildTelegramGroupPeerId(params.chatId, params.threadSpec ?? { scope: "none" })}`;
}
function shouldSuppressTelegramError(params) {
	const { scopeKey, cooldownMs, errorMessage } = params;
	const now = asDateTimestampMs(Date.now());
	const messageKey = errorMessage ?? "";
	const scopeStore = errorCooldownStore.get(scopeKey);
	if (now === void 0) {
		errorCooldownStore.delete(scopeKey);
		return false;
	}
	if (scopeStore) {
		pruneExpiredCooldowns(scopeStore, now);
		if (scopeStore.size === 0) errorCooldownStore.delete(scopeKey);
	}
	if (errorCooldownStore.size > 100) for (const [scope, messageStore] of errorCooldownStore) {
		pruneExpiredCooldowns(messageStore, now);
		if (messageStore.size === 0) errorCooldownStore.delete(scope);
	}
	const expiresAt = scopeStore?.get(messageKey);
	if (isFutureDateTimestampMs(expiresAt, { nowMs: now })) return true;
	const nextExpiresAt = resolveExpiresAtMsFromDurationMs(cooldownMs, { nowMs: now });
	if (nextExpiresAt === void 0) {
		scopeStore?.delete(messageKey);
		return false;
	}
	const nextScopeStore = scopeStore ?? /* @__PURE__ */ new Map();
	nextScopeStore.set(messageKey, nextExpiresAt);
	errorCooldownStore.set(scopeKey, nextScopeStore);
	return false;
}
function isSilentErrorPolicy(policy) {
	return policy === "silent";
}
//#endregion
//#region extensions/telegram/src/bot-message-dispatch-reply.ts
function toTelegramReplyDeliveryResult(visibleReplySent, finalization) {
	if (finalization) return {
		visibleReplySent,
		finalization
	};
	return visibleReplySent ? { visibleReplySent: true } : {
		visibleReplySent: false,
		suppression: { reason: "no_visible_result" }
	};
}
function toTelegramVisiblePartialDeliveryError(error) {
	return isChannelPartialDeliveryError(error) ? error : createChannelPartialDeliveryError(error, { visibleReplySent: true });
}
function resolvePayloadTelegramControls(turn, payload) {
	const telegramData = payload.channelData?.telegram;
	const droppedControls = [];
	const buttons = resolveTelegramInlineButtons({
		buttons: telegramData?.buttons,
		presentation: normalizeMessagePresentation(payload.presentation),
		interactive: payload.interactive
	}, {
		allowWebAppButtons: resolveTelegramTargetChatType(String(turn.context.chatId)) === "direct",
		onDroppedControl: (control) => droppedControls.push(control),
		questionOptionIndices: resolveAskUserQuestionOptionIndices(payload)
	});
	const text = appendTelegramDroppedControlFallback(payload.text ?? "", droppedControls);
	return {
		payload: text === (payload.text ?? "") ? payload : applyTextToPayload(payload, text),
		buttons
	};
}
function hasExecApprovalPayload(payload) {
	return payload.channelData?.execApproval !== void 0;
}
function createReplyState() {
	return {
		reasoningStepState: createTelegramReasoningStepState(),
		bufferedFinalSettlement: void 0,
		sentBlockMediaUrls: /* @__PURE__ */ new Set(),
		splitReasoningOnNextStream: false
	};
}
function settleBufferedFinalAsNotVisible(turn) {
	if (turn.bufferedFinalSettlement) turn.bufferedFinalSettlement.resolve({ visibleReplySent: turn.bufferedFinalSettlement.visibleReplySent });
	turn.bufferedFinalSettlement = void 0;
}
function resetReasoningStepState(turn) {
	settleBufferedFinalAsNotVisible(turn);
	turn.reasoningStepState.resetForNextStep();
}
async function flushBufferedFinalAnswer(turn, currentPayloadVisible = false) {
	const settlement = turn.bufferedFinalSettlement;
	const buffered = turn.reasoningStepState.takeBufferedFinalAnswer();
	turn.bufferedFinalSettlement = void 0;
	if (!buffered) {
		settlement?.resolve({ visibleReplySent: settlement.visibleReplySent });
		turn.reasoningStepState.resetForNextStep();
		return;
	}
	try {
		const controls = resolvePayloadTelegramControls(turn, buffered);
		const result = await deliverFinalAnswerText(turn, controls.payload, controls.payload.text ?? "", controls.buttons, settlement?.onPlatformSendDispatch, settlement?.assertPlatformSendAuthorized, settlement?.bindPendingFinalDelivery);
		if (settlement) settlement.resolve({ visibleReplySent: settlement.visibleReplySent || result.kind !== "skipped" });
		resetReasoningStepState(turn);
	} catch (error) {
		if (settlement) settlement.reject(settlement.visibleReplySent ? toTelegramVisiblePartialDeliveryError(error) : error);
		throw currentPayloadVisible ? toTelegramVisiblePartialDeliveryError(error) : error;
	}
}
async function stopTelegramReplyLanesAndFlushBufferedFinal(turn) {
	await rotateAnswerLaneAfterToolProgress(turn);
	await turn.answerLane.stream?.stop();
	await turn.reasoningLane.stream?.stop();
	await flushBufferedFinalAnswer(turn);
}
async function settleTerminalNoVisibleDelivery(turn, info, options) {
	if (options?.abandonBufferedFinal) resetReasoningStepState(turn);
	else if (info.kind === "final") await flushBufferedFinalAnswer(turn);
	return toTelegramReplyDeliveryResult(false);
}
function trackBlockMedia(turn, payload, acceptedMediaUrls) {
	for (const { url, sourceUrls } of collectReplyMediaEntries(payload, acceptedMediaUrls)) {
		turn.sentBlockMediaUrls.add(url);
		for (const source of sourceUrls ?? []) turn.sentBlockMediaUrls.add(source);
	}
}
async function adoptProgressContinuation(turn, payload, info) {
	if (info.kind !== "final" || payload.isError === true || typeof info.adoptProgressContinuation !== "function") return false;
	const adopt = info.adoptProgressContinuation;
	await waitForDraftEvents(turn);
	const stream = turn.answerLane.stream;
	if (!stream || turn.answerLane.finalized || turn.isSuperseded()) return false;
	if (!turn.progressCompositor.isVisible && !turn.progressCompositor.hasStarted && (turn.progressCompositor.hasStatusHeadline || turn.progressCompositor.hasPlanProgress || turn.progressCompositor.getSnapshot().lines.length > 0)) {
		info.assertPlatformSendAuthorized?.();
		await turn.progressCompositor.start();
	}
	if (!turn.progressCompositor.isVisible || turn.isSuperseded()) return false;
	turn.progressCompositor.cancel();
	info.assertPlatformSendAuthorized?.();
	await stream.flush();
	const messageId = stream.messageId();
	const text = stream.lastDeliveredText();
	if (typeof messageId !== "number" || !Number.isFinite(messageId) || !text || turn.isSuperseded()) return false;
	info.assertPlatformSendAuthorized?.();
	if (!await adopt({
		channel: "telegram",
		accountId: turn.context.route.accountId,
		to: String(turn.context.chatId),
		threadId: turn.context.threadSpec.id,
		messageId: String(messageId),
		text,
		snapshot: turn.progressCompositor.getSnapshot()
	})) return false;
	turn.answerLane.stream = void 0;
	turn.progressContinuationAdopted = true;
	resetLaneState(turn, turn.answerLane);
	resetReasoningStepState(turn);
	turn.deliveryState.markDelivered();
	await stream.discard();
	return true;
}
function formatTelegramGroupThreadReply(text, participant) {
	return `**${participant.name.replace(/[\\`*_{}[\]()<>#!|]/g, "\\$&").replace(/\s+/g, " ")}**\n${text}`;
}
async function deliverReply(turn, payload, info) {
	return deliverReplyWithNormalization(turn, payload, info, normalizeDeliveryPayload);
}
async function deliverPreparedReply(turn, plan, info) {
	return deliverReplyWithNormalization(turn, plan.payload, info, normalizePreparedDeliveryPayload);
}
async function deliverReplyWithNormalization(turn, incomingPayload, info, normalizePayload) {
	if (turn.isSuperseded()) return await settleTerminalNoVisibleDelivery(turn, info, { abandonBufferedFinal: true });
	let payload = incomingPayload;
	if (info.participant && (payload.text || payload.mediaUrl || payload.mediaUrls?.length)) payload = applyTextToPayload(payload, formatTelegramGroupThreadReply(payload.text ?? "", info.participant));
	const normalizedPayload = normalizePayload(turn, payload);
	if (!normalizedPayload) return await settleTerminalNoVisibleDelivery(turn, info);
	const deduped = info.kind === "final" ? deduplicateBlockSentMedia(normalizedPayload, turn.sentBlockMediaUrls) : normalizedPayload;
	if (!deduped) return await settleTerminalNoVisibleDelivery(turn, info);
	const controls = resolvePayloadTelegramControls(turn, deduped);
	const effectivePayload = controls.payload;
	const onMediaAccepted = info.kind === "block" ? (mediaUrls) => trackBlockMedia(turn, effectivePayload, mediaUrls) : void 0;
	if (shouldSuppressLocalTelegramExecApprovalPrompt({
		cfg: turn.cfg,
		accountId: turn.context.route.accountId,
		payload: effectivePayload
	})) {
		turn.queuedFinal = true;
		return await settleTerminalNoVisibleDelivery(turn, info);
	}
	const telegramButtons = controls.buttons;
	const reply = resolveSendableOutboundReplyParts(effectivePayload);
	if (!reply.hasMedia && telegramButtons === void 0 && effectivePayload.interactive === void 0 && effectivePayload.presentation === void 0 && effectivePayload.channelData?.askUser === void 0 && !hasExecApprovalPayload(effectivePayload) && await adoptProgressContinuation(turn, incomingPayload, info)) return toTelegramReplyDeliveryResult(true);
	const lanePayload = info.kind === "block" && typeof payload.text === "string" && typeof effectivePayload.text === "string" && payload.text !== effectivePayload.text && payload.text.trimEnd() === effectivePayload.text && !effectivePayload.mediaUrl && !effectivePayload.mediaUrls?.length ? applyTextToPayload(effectivePayload, payload.text) : effectivePayload;
	const split = splitTextIntoLaneSegments(turn, { text: lanePayload.text }, payload.isReasoning);
	const segments = split.segments;
	if (info.kind === "final" && (reply.text.length > 0 || reply.hasMedia)) markFinalStarted(turn);
	if (info.kind === "final") await enqueueDraftEvent(turn, async () => {});
	const isToolPayloadAfterFinal = info.kind === "tool" && (turn.finalAnswerDeliveryStarted || turn.finalAnswerDelivered);
	const isNonTerminalWarningAfterDeliveredFinal = isReplyPayloadNonTerminalToolErrorWarning(payload) && turn.finalAnswerDelivered;
	if ((isToolPayloadAfterFinal || isNonTerminalWarningAfterDeliveredFinal) && !reply.hasMedia && !hasExecApprovalPayload(effectivePayload)) return await settleTerminalNoVisibleDelivery(turn, info);
	if (payload.isError === true) turn.hadErrorReplyFailureOrSkip = true;
	let blockDelivered = false;
	let finalization;
	const hasAnswerSegment = segments.some((segment) => segment.lane === "answer");
	if (info.kind === "block" && !hasAnswerSegment) dropQueuedAnswerBlockRotation(turn, effectivePayload, info.assistantMessageIndex);
	for (const segment of segments) {
		if (segment.lane === "answer" && info.kind === "final" && turn.reasoningStepState.shouldBufferFinalAnswer()) {
			let resolveFinalization;
			let rejectFinalization;
			finalization = new Promise((resolve, reject) => {
				resolveFinalization = resolve;
				rejectFinalization = reject;
			});
			settleBufferedFinalAsNotVisible(turn);
			turn.bufferedFinalSettlement = {
				visibleReplySent: blockDelivered,
				onPlatformSendDispatch: info.onPlatformSendDispatch,
				assertPlatformSendAuthorized: info.assertPlatformSendAuthorized,
				bindPendingFinalDelivery: info.bindPendingFinalDelivery,
				resolve: resolveFinalization,
				reject: rejectFinalization
			};
			turn.reasoningStepState.bufferFinalAnswer(applyTextToPayload(effectivePayload, segment.update.text));
			continue;
		}
		if (segment.lane === "reasoning") turn.reasoningStepState.noteReasoningHint();
		if (segment.lane === "answer" && info.kind === "tool") {
			if (turn.verboseProgressActive()) {
				if (await sendPayload(turn, applyTextToPayload(effectivePayload, segment.update.text))) blockDelivered = true;
				continue;
			}
			const canRepresentAsTransientProgress = !reply.hasMedia && telegramButtons === void 0 && effectivePayload.channelData?.askUser === void 0 && !hasExecApprovalPayload(effectivePayload);
			const isFastModeProgressPayload = isFastModeAutoProgressPayload(effectivePayload);
			if (turn.streamMode === "progress") {
				if (canRepresentAsTransientProgress && turn.answerLane.stream && !isFastModeProgressPayload) continue;
				if ((canRepresentAsTransientProgress || isFastModeProgressPayload) && await pushToolProgress(turn, segment.update.text, { startImmediately: true })) {
					blockDelivered = true;
					continue;
				}
			}
			await prepareAnswerLaneForToolProgress(turn);
		}
		const ownedByQueuedRotation = isQueuedAnswerBlock(turn, lanePayload, info.assistantMessageIndex);
		const skipTextOnlyBlock = turn.streamMode === "partial" && info.kind === "block" && segment.lane === "answer" && !reply.hasMedia && !hasExecApprovalPayload(effectivePayload) && telegramButtons === void 0 && turn.answerLane.hasStreamedMessage && !turn.activeAnswerDraftIsToolProgressOnly && !ownedByQueuedRotation && segment.update.text.trimEnd() === turn.answerLane.lastPartialText.trimEnd();
		const suppressProgressAnswerBlock = turn.streamMode === "progress" && info.kind === "block" && segment.lane === "answer" && !reply.hasMedia && !hasExecApprovalPayload(effectivePayload) && telegramButtons === void 0;
		if (skipTextOnlyBlock || suppressProgressAnswerBlock) {
			turn.activeAnswerBlockDelivery = {
				payload: effectivePayload,
				text: segment.update.text,
				buttons: telegramButtons
			};
			turn.activeAnswerDraftIsToolProgressOnly = false;
			if (!suppressProgressAnswerBlock) turn.progressCompositor.resetActivity();
			blockDelivered = true;
			continue;
		}
		if (segment.lane === "answer" && info.kind === "block") {
			const prepared = await prepareAnswerLaneForText(turn);
			const shouldRotate = takeQueuedAnswerBlockRotation(turn, lanePayload, info.assistantMessageIndex);
			if (turn.streamMode !== "progress" && shouldRotate && !prepared) {
				await rotateAnswerLaneForNewMessage(turn);
				turn.rotateAnswerLaneWhenQueuedBlocksSettle = false;
			}
			turn.activeAnswerDraftIsToolProgressOnly = false;
			turn.progressCompositor.resetActivity();
		}
		const isAskUserPayload = effectivePayload.channelData?.askUser !== void 0;
		const result = segment.lane === "answer" && info.kind === "final" ? await deliverFinalAnswerText(turn, effectivePayload, segment.update.text, telegramButtons, info.onPlatformSendDispatch, info.assertPlatformSendAuthorized, info.bindPendingFinalDelivery) : await turn.deliverLaneText({
			laneName: segment.lane,
			text: segment.update.text,
			payload: lanePayload,
			infoKind: info.kind,
			buttons: telegramButtons,
			...isAskUserPayload ? { finalizePreview: true } : {},
			onPlatformSendDispatch: info.onPlatformSendDispatch,
			assertPlatformSendAuthorized: info.assertPlatformSendAuthorized,
			bindPendingFinalDelivery: info.bindPendingFinalDelivery,
			onMediaAccepted
		});
		if (segment.lane === "answer" && info.kind !== "final" && (result.kind === "preview-finalized" || result.kind === "preview-finalized-partial")) {
			await handlePreviewFinalizedResult(turn, result);
			if (isAskUserPayload && result.kind === "preview-finalized") registerTelegramQuestionDeliveryForMessage(turn, effectivePayload, {
				messageId: result.delivery.messageId,
				text: result.delivery.content
			});
		}
		if (segment.lane === "answer" && info.kind === "block" && result.kind === "preview-updated") turn.activeAnswerBlockDelivery = {
			payload: lanePayload,
			text: segment.update.text,
			buttons: telegramButtons
		};
		blockDelivered ||= result.kind !== "skipped";
		if (segment.lane === "reasoning") {
			if (result.kind !== "skipped") {
				turn.reasoningStepState.noteReasoningDelivered();
				if (finalization && turn.bufferedFinalSettlement) turn.bufferedFinalSettlement.visibleReplySent ||= blockDelivered;
				await flushBufferedFinalAnswer(turn, blockDelivered);
			}
		} else if (info.kind === "final") resetReasoningStepState(turn);
	}
	if (segments.length > 0) {
		if (finalization && turn.bufferedFinalSettlement) turn.bufferedFinalSettlement.visibleReplySent ||= blockDelivered;
		return toTelegramReplyDeliveryResult(blockDelivered, finalization);
	}
	if (split.suppressedReasoningOnly) {
		let delivered = false;
		if (info.kind === "final") await stopTelegramReplyLanesAndFlushBufferedFinal(turn);
		if (reply.hasMedia) delivered = await sendPayload(turn, typeof effectivePayload.text === "string" ? applyTextToPayload(effectivePayload, "") : effectivePayload, {
			durable: info.kind === "final",
			onPlatformSendDispatch: info.onPlatformSendDispatch,
			assertPlatformSendAuthorized: info.assertPlatformSendAuthorized,
			bindPendingFinalDelivery: info.bindPendingFinalDelivery,
			onMediaAccepted
		});
		if (info.kind === "final" && delivered) markFinalDelivered(turn);
		return toTelegramReplyDeliveryResult(delivered);
	}
	if (info.kind === "final") await stopTelegramReplyLanesAndFlushBufferedFinal(turn);
	if (!reply.hasMedia && reply.text.length === 0) {
		if (info.kind === "final") await flushBufferedFinalAnswer(turn);
		return toTelegramReplyDeliveryResult(false);
	}
	const delivered = await sendPayload(turn, effectivePayload, {
		durable: info.kind === "final",
		onPlatformSendDispatch: info.onPlatformSendDispatch,
		assertPlatformSendAuthorized: info.assertPlatformSendAuthorized,
		bindPendingFinalDelivery: info.bindPendingFinalDelivery,
		onMediaAccepted
	});
	if (info.kind === "final" && delivered) markFinalDelivered(turn);
	return toTelegramReplyDeliveryResult(delivered);
}
function handleReplySkip(turn, payload, info) {
	if (info.kind === "block") enqueueDraftEvent(turn, async () => {
		dropQueuedAnswerBlockRotation(turn, payload, info.assistantMessageIndex);
	});
	if (payload.isError === true) turn.hadErrorReplyFailureOrSkip = true;
	if (info.reason !== "silent") turn.deliveryState.markNonSilentSkip();
}
function handleReplyError(turn, err, info) {
	if (info.kind === "final") {
		if (isChannelPartialDeliveryError(err)) {
			turn.deliveryState.markDelivered();
			markFinalDelivered(turn);
		} else turn.finalReplyOutcome = "failed";
	}
	const errorPolicy = resolveTelegramErrorPolicy({
		accountConfig: turn.telegramCfg,
		groupConfig: turn.context.groupConfig,
		topicConfig: turn.context.topicConfig
	});
	if (isSilentErrorPolicy(errorPolicy.policy)) return;
	if (errorPolicy.policy === "once" && shouldSuppressTelegramError({
		scopeKey: buildTelegramErrorScopeKey({
			accountId: turn.context.route.accountId,
			chatId: turn.context.chatId,
			threadSpec: turn.context.threadSpec
		}),
		cooldownMs: errorPolicy.cooldownMs,
		errorMessage: String(err)
	})) return;
	turn.deliveryState.markNonSilentFailure();
	turn.runtime.error?.(danger(`telegram ${info.kind} reply failed: ${String(err)}`));
}
function handleBeforeDeliverCancelled(turn, payload, info) {
	return info.kind === "block" ? enqueueDraftEvent(turn, async () => {
		dropQueuedAnswerBlockRotation(turn, payload, info.assistantMessageIndex);
	}) : void 0;
}
//#endregion
//#region extensions/telegram/src/bot-message-dispatch-status.ts
function createTelegramDispatchStatus(params) {
	const { context } = params;
	const controller = context.ctxPayload.InboundEventKind === "room_event" ? null : context.statusReactionController;
	const finalize = async (final) => {
		if (!controller) return;
		if (final.outcome === "done") await controller.setDone();
		else if (final.outcome === "error") await controller.setError();
		await controller.restoreInitial();
	};
	const finalizeInBackground = (final, label) => {
		finalize(final).catch((err) => {
			logVerbose(`telegram: status reaction ${label} failed: ${String(err)}`);
		});
	};
	return {
		controller,
		finalizeInBackground
	};
}
//#endregion
//#region extensions/telegram/src/bot-message-dispatch-turn.ts
const TELEGRAM_MAX_CONSECUTIVE_TYPING_FAILURES = 5;
async function runTelegramDispatchTurn(turn) {
	const { context } = turn;
	let sessionMetaTask;
	const isRoomEvent = context.ctxPayload.InboundEventKind === "room_event";
	const toolProgressEnabled = turn.streamMode !== "off" && resolveChannelStreamingPreviewToolProgress(turn.telegramCfg, turn.streamMode !== "progress", turn.streamMode);
	const beginDeliveryCorrelation = () => telegramInboundEventDelivery.begin(context.ctxPayload.SessionKey, {
		outboundTo: context.historyKey || String(context.chatId),
		outboundAccountId: context.route.accountId,
		markInboundEventDelivered: turn.deliveryState.markDelivered
	}, { inboundEventKind: context.ctxPayload.InboundEventKind });
	const endDeliveryCorrelation = beginDeliveryCorrelation();
	try {
		const { onModelSelected, ...replyPipeline } = (turn.telegramDeps.createChannelMessageReplyPipeline ?? createChannelReplyPipeline)({
			cfg: turn.cfg,
			agentId: context.route.agentId,
			channel: "telegram",
			accountId: context.route.accountId,
			typing: {
				start: context.sendTyping,
				keepaliveIntervalMs: TELEGRAM_CHAT_ACTION_INTERVAL_MS,
				maxDurationMs: 0,
				maxConsecutiveFailures: TELEGRAM_MAX_CONSECUTIVE_TYPING_FAILURES,
				onStartError: (err) => {
					logTypingFailure({
						log: logVerbose,
						channel: "telegram",
						target: String(context.chatId),
						error: err
					});
				}
			}
		});
		const handleDeliveryError = async (err, info) => {
			await Promise.resolve(handleReplyError(turn, err, info)).catch((callbackError) => {
				logVerbose(`telegram reply error callback failed: ${String(callbackError)}`);
			});
		};
		const turnResult = await runChannelInboundEvent({
			channel: "telegram",
			accountId: context.route.accountId,
			raw: context,
			adapter: {
				ingest: () => ({
					id: context.ctxPayload.MessageSid ?? `${context.chatId}:${Date.now()}`,
					timestamp: typeof context.ctxPayload.Timestamp === "number" ? context.ctxPayload.Timestamp : void 0,
					rawText: context.ctxPayload.RawBody ?? "",
					textForAgent: context.ctxPayload.BodyForAgent,
					textForCommands: context.ctxPayload.CommandBody,
					raw: context
				}),
				resolveTurn: () => ({
					cfg: turn.cfg,
					channel: "telegram",
					accountId: context.route.accountId,
					route: {
						agentId: context.route.agentId,
						sessionKey: context.route.sessionKey
					},
					ctxPayload: context.ctxPayload,
					record: {
						...context.turn.record,
						trackSessionMetaTask: (task) => {
							sessionMetaTask = task;
						}
					},
					afterRecord: async () => {
						await sessionMetaTask;
					},
					dispatchReplyFromConfig: turn.opts.dispatchReplyFromConfig,
					delivery: {
						deliverWithProviderMessageSending: async (payload, info) => await deliverReply(turn, payload, info),
						deliverPreparedWithProviderMessageSending: async (plan, info) => await deliverPreparedReply(turn, plan, info),
						onError: handleDeliveryError,
						onDelivered: (_payload, info, result) => {
							const reason = result?.suppression?.reason;
							if (info.kind === "final" && turn.finalReplyOutcome !== "failed" && (reason === "cancelled_by_reply_payload_sending_hook" || reason === "empty_after_reply_payload_sending_hook")) turn.finalReplyOutcome = "suppressed";
						}
					},
					dispatcherOptions: {
						...replyPipeline,
						humanDelay: resolveHumanDelayConfig(turn.cfg, context.route.agentId),
						beforeDeliver: async (payload) => payload,
						onBeforeDeliverCancelled: (payload, info) => handleBeforeDeliverCancelled(turn, payload, info),
						onSkip: (payload, info) => handleReplySkip(turn, payload, info)
					},
					replyOptions: {
						...context.ctxPayload.CommandSource === "native" ? { [PLUGIN_COMMAND_DISPATCH]: { kind: "non-plugin" } } : {},
						groupThreadReplyFormatter: formatTelegramGroupThreadReply,
						skillFilter: context.skillFilter,
						disableBlockStreaming: turn.disableBlockStreaming,
						preserveProgressCallbackStartOrder: true,
						abortSignal: turn.turnAdoptionLifecycle?.abortSignal,
						turnAdoptionLifecycle: turn.turnAdoptionLifecycle ? {
							...turn.turnAdoptionLifecycle,
							admission: turn.turnAdoptionLifecycle.admission ?? "exclusive"
						} : void 0,
						sourceReplyDeliveryMode: isRoomEvent ? "message_tool_only" : void 0,
						queuedDeliveryCorrelations: isRoomEvent ? [{ begin: beginDeliveryCorrelation }] : void 0,
						suppressTyping: isRoomEvent,
						onObservedReplyDelivery: async () => {
							markFinalStarted(turn);
							await waitForDraftEvents(turn);
							markFinalDelivered(turn);
							turn.deliveryState.markDelivered();
							await cleanupDrafts(turn, turn.isSuperseded());
						},
						onPartialReply: turn.answerLane.stream || turn.reasoningLane.stream ? (payload) => {
							return enqueueDraftEvent(turn, async () => {
								await ingestDraftLaneSegments(turn, payload);
							}).then(async () => {
								const answerStream = turn.answerLane.stream;
								await answerStream?.waitForInFlight();
								const providerMessageId = answerStream?.messageId();
								return typeof providerMessageId === "number" && Number.isFinite(providerMessageId);
							});
						} : void 0,
						onBlockReplyQueued: turn.answerLane.stream ? (payload, blockContext) => {
							return enqueueDraftEvent(turn, async () => {
								await prepareQueuedAnswerBlock(turn, payload, blockContext);
							}).then(() => false);
						} : void 0,
						onReasoningStream: turn.reasoningLane.stream ? (payload) => {
							return enqueueDraftEvent(turn, async () => {
								if (turn.splitReasoningOnNextStream) {
									repositionLaneForNewMessage(turn, turn.reasoningLane);
									turn.splitReasoningOnNextStream = false;
								}
								await ingestDraftLaneSegments(turn, payload, true);
							}).then(() => false);
						} : turn.streamReasoningInProgressDraft ? (payload) => {
							return enqueueDraftEvent(turn, async () => {
								await pushReasoningProgress(turn, payload);
							}).then(() => false);
						} : void 0,
						onReasoningProgress: turn.answerLane.stream ? (payload) => enqueueDraftEvent(turn, async () => {
							await pushThinkingTokenProgress(turn, payload.progressTokens);
						}) : void 0,
						onAssistantMessageStart: turn.answerLane.stream ? () => {
							return enqueueDraftEvent(turn, async () => {
								resetReasoningStepState(turn);
								turn.finalAnswerDelivered = false;
								turn.progressCompositor.beginAssistantMessage();
								if (turn.answerLane.finalized) {
									await rotateLaneForNewMessage(turn, turn.answerLane);
									turn.rotateAnswerLaneWhenQueuedBlocksSettle = false;
								} else if (turn.answerLane.hasStreamedMessage && !turn.activeAnswerDraftIsToolProgressOnly && (turn.activeAnswerBlockDelivery || turn.queuedAnswerBlockRotations.length > 0)) turn.rotateAnswerLaneWhenQueuedBlocksSettle = true;
							}).then(() => false);
						} : void 0,
						onReasoningEnd: turn.reasoningLane.stream ? () => {
							return enqueueDraftEvent(turn, async () => {
								turn.splitReasoningOnNextStream = turn.reasoningLane.hasStreamedMessage;
								turn.progressCompositor.resetReasoningProgress();
							}).then(() => false);
						} : () => false,
						onQueuedFollowupAdmitted: () => {
							beginDraftQueuedFollowup(turn);
							turn.finalAnswerDeliveryStarted = false;
							turn.finalAnswerDelivered = false;
							turn.progressCompositor.beginNewTurn({ force: true });
						},
						onQueuedFollowupSettled: async () => {
							turn.progressCompositor.cancel();
							await waitForDraftEvents(turn);
							await cleanupDrafts(turn, turn.isSuperseded());
						},
						suppressDefaultToolProgressMessages: !turn.streamDeliveryEnabled || Boolean(turn.answerLane.stream),
						suppressToolProgressMessages: !toolProgressEnabled,
						allowProgressCallbacksWhenSourceDeliverySuppressed: !isRoomEvent && Boolean(turn.answerLane.stream),
						onVerboseProgressVisibility: (isActive) => {
							turn.verboseProgressActive = isActive;
						},
						commentaryProgressEnabled: turn.streamMode === "progress" ? turn.commentaryProgressEnabled : void 0,
						progressPreambleEnabled: turn.progressPreambleEnabled,
						commentaryPayloadsEnabled: turn.progressPreambleEnabled,
						shouldDeliverCommentaryPayloads: turn.progressPreambleEnabled === true ? () => false : void 0,
						reasoningPayloadsEnabled: turn.durableReasoningPayloadsEnabled,
						onToolStart: (payload) => handleToolStart(turn, payload),
						onItemEvent: (payload) => handleItemEvent(turn, payload),
						onPlanUpdate: (payload) => handlePlanUpdate(turn, payload),
						onApprovalEvent: (payload) => handleApprovalEvent(turn, payload),
						onToolResult: async (payload) => {
							const text = payload.text?.trim();
							if (!text) return false;
							const progressId = payload.channelData?.openclawToolProgressId;
							if (await pushToolProgress(turn, text, {
								startImmediately: true,
								id: typeof progressId === "string" ? progressId : void 0
							})) return true;
							if (isFastModeAutoProgressPayload(payload) && !canPushToolProgress(turn)) {
								await sendPayload(turn, payload);
								return true;
							}
							return false;
						},
						onCompactionStart: isRoomEvent ? void 0 : async () => await handleCompactionStart(turn),
						onCompactionEnd: isRoomEvent ? void 0 : async (payload) => await handleCompactionEnd(turn, payload),
						onModelSelected
					}
				})
			}
		});
		if (!turnResult.dispatched) return false;
		turn.queuedFinal ||= hasFinalChannelTurnDispatch(turnResult.dispatchResult);
		turn.agentRunFailed = readAgentRunTerminalOutcome(turnResult.dispatchResult) === "failed";
		turn.sendPolicyDenied = turnResult.dispatchResult.sendPolicyDenied === true;
		turn.noVisibleReplyFallbackEligible = turnResult.dispatchResult.noVisibleReplyFallbackEligible === true;
		turn.suppressSilentReplyFallback = turnResult.dispatchResult.sourceReplyDeliveryMode === "message_tool_only";
		return true;
	} finally {
		endDeliveryCorrelation();
	}
}
//#endregion
//#region extensions/telegram/src/bot-message-dispatch.ts
const EMPTY_RESPONSE_FALLBACK = "No response generated. Please try again.";
const silentReplyDispatchLogger = createSubsystemLogger("telegram/silent-reply-dispatch");
async function resolveStickerVisionSupport(cfg, agentId) {
	try {
		const catalog = await loadPreparedModelCatalog({
			config: cfg,
			agentId,
			agentDir: resolveAgentDir(cfg, agentId),
			readOnly: true
		});
		const defaultModel = resolveDefaultModelForAgent({
			cfg,
			agentId
		});
		const entry = findModelInCatalog(catalog, defaultModel.provider, defaultModel.model);
		return entry ? modelSupportsVision(entry) : false;
	} catch {
		return false;
	}
}
function includeStickerDescription(params) {
	if (!params.body) return params.formattedDescription;
	if (!params.body.trim()) return params.formattedDescription;
	if (params.body.includes(params.formattedDescription)) return params.body;
	return `${params.formattedDescription}\n${params.body}`;
}
function resolveTelegramQuoteContext(params) {
	const { context, replyToMode } = params;
	const rawReplyQuoteText = context.ctxPayload.ReplyToIsQuote && typeof context.ctxPayload.ReplyToQuoteText === "string" ? context.ctxPayload.ReplyToQuoteText : void 0;
	const replyQuoteText = context.ctxPayload.ReplyToIsQuote ? rawReplyQuoteText?.trim() ? rawReplyQuoteText : context.ctxPayload.ReplyToBody?.trim() || void 0 : void 0;
	const replyQuoteMessageId = replyQuoteText && !context.ctxPayload.ReplyToIsExternal ? resolveTelegramReplyId(context.ctxPayload.ReplyToId) : void 0;
	const replyQuoteTargetsBotMessage = context.msg.reply_to_message?.from?.is_bot === true;
	const replyQuoteByMessageId = {};
	if (replyToMode !== "off") {
		if (replyQuoteText && replyQuoteMessageId != null) addTelegramNativeQuoteCandidate(replyQuoteByMessageId, replyQuoteMessageId, {
			text: replyQuoteText,
			...typeof context.ctxPayload.ReplyToQuotePosition === "number" ? { position: context.ctxPayload.ReplyToQuotePosition } : {},
			...Array.isArray(context.ctxPayload.ReplyToQuoteEntities) ? { entities: context.ctxPayload.ReplyToQuoteEntities } : {}
		});
		addTelegramNativeQuoteCandidate(replyQuoteByMessageId, context.ctxPayload.MessageSid ?? context.msg.message_id, buildTelegramNativeQuoteCandidate(getTelegramTextParts(context.msg)));
		if (!context.ctxPayload.ReplyToIsExternal && typeof context.ctxPayload.ReplyToQuoteSourceText === "string") addTelegramNativeQuoteCandidate(replyQuoteByMessageId, context.ctxPayload.ReplyToId, buildTelegramNativeQuoteCandidate({
			text: context.ctxPayload.ReplyToQuoteSourceText,
			entities: Array.isArray(context.ctxPayload.ReplyToQuoteSourceEntities) ? context.ctxPayload.ReplyToQuoteSourceEntities : void 0
		}));
	}
	return {
		draftReplyToMessageId: replyToMode !== "off" && typeof context.msg.message_id === "number" ? replyQuoteTargetsBotMessage ? context.msg.message_id : replyQuoteMessageId ?? context.msg.message_id : void 0,
		replyQuoteByMessageId,
		replyQuoteEntities: Array.isArray(context.ctxPayload.ReplyToQuoteEntities) ? context.ctxPayload.ReplyToQuoteEntities : void 0,
		replyQuoteMessageId,
		replyQuotePosition: typeof context.ctxPayload.ReplyToQuotePosition === "number" ? context.ctxPayload.ReplyToQuotePosition : void 0,
		replyQuoteText
	};
}
async function prepareTelegramSticker(params) {
	const { context } = params;
	const sticker = context.ctxPayload.Sticker;
	const stickerFact = context.ctxPayload.media?.find((media) => media.kind === "sticker");
	const stickerPath = stickerFact?.path ?? (!stickerFact && context.ctxPayload.StickerMediaIncluded ? context.ctxPayload.media?.[0]?.path : void 0);
	if (!sticker?.fileId || !sticker.fileUniqueId || !stickerPath) return;
	const agentDir = resolveAgentDir(params.cfg, context.route.agentId);
	const stickerSupportsVision = await resolveStickerVisionSupport(params.cfg, context.route.agentId);
	const description = sticker.cachedDescription || await describeStickerImage({
		imagePath: stickerPath,
		cfg: params.cfg,
		agentDir,
		agentId: context.route.agentId
	});
	if (!description) return;
	const stickerContext = [sticker.emoji, sticker.setName ? `from "${sticker.setName}"` : null].filter(Boolean).join(" ");
	const formattedDescription = `[Sticker${stickerContext ? ` ${stickerContext}` : ""}] ${description}`;
	sticker.cachedDescription = description;
	if (!stickerSupportsVision) {
		context.ctxPayload.Body = includeStickerDescription({
			body: context.ctxPayload.Body,
			formattedDescription
		});
		context.ctxPayload.agentText = includeStickerDescription({
			body: context.ctxPayload.agentText ?? context.ctxPayload.BodyForAgent,
			formattedDescription
		});
		context.ctxPayload.BodyForAgent = context.ctxPayload.agentText;
		context.ctxPayload.SkipStickerMediaUnderstanding = true;
	}
	await cacheSticker({
		fileId: sticker.fileId,
		fileUniqueId: sticker.fileUniqueId,
		emoji: sticker.emoji,
		setName: sticker.setName,
		description,
		cachedAt: (/* @__PURE__ */ new Date()).toISOString(),
		receivedFrom: context.ctxPayload.From
	});
	logVerbose(`telegram: cached sticker description for ${sticker.fileUniqueId}`);
}
function scheduleDmTopicLabel(params) {
	const { context } = params;
	if (!(!context.isGroup && context.threadSpec.scope === "dm" && context.threadSpec.id != null) || !params.isFirstTurnInSession) return;
	const userMessage = truncateUtf16Safe(context.ctxPayload.RawBody ?? context.ctxPayload.Body ?? "", 500);
	if (!userMessage.trim()) return;
	const autoTopicConfig = resolveAutoTopicLabelConfig(context.groupConfig && "autoTopicLabel" in context.groupConfig ? context.groupConfig.autoTopicLabel : void 0, params.telegramCfg.autoTopicLabel);
	if (!autoTopicConfig) return;
	const topicThreadId = context.threadSpec.id;
	(async () => {
		try {
			const label = await generateTelegramTopicLabel({
				userMessage,
				prompt: autoTopicConfig.prompt,
				cfg: params.cfg,
				agentId: context.route.agentId,
				agentDir: resolveAgentDir(params.cfg, context.route.agentId)
			});
			if (!label) {
				logVerbose("auto-topic-label: LLM returned empty label");
				return;
			}
			logVerbose(`auto-topic-label: generated label (len=${label.length})`);
			await params.bot.api.editForumTopic(context.chatId, topicThreadId, { name: label });
			logVerbose(`auto-topic-label: renamed topic ${context.chatId}/${topicThreadId}`);
		} catch (err) {
			logVerbose(`auto-topic-label: failed: ${String(err)}`);
		}
	})();
}
const dispatchTelegramMessage = async (dispatchParams) => {
	const { context, bot, cfg, runtime, replyToMode, telegramCfg, telegramDeps: injectedTelegramDeps, retryDispatchErrors = false, suppressFailureFallback = false, turnAdoptionLifecycle } = dispatchParams;
	const dispatchStartedAt = Date.now();
	const dispatchContext = await resolveDispatchTelegramContext({ context });
	const telegramDeps = injectedTelegramDeps ?? (await import("./bot-deps-BLh7QztC.mjs")).defaultTelegramBotDeps;
	const loadFreshSessionEntry = createFreshTelegramSessionEntryLoader({
		cfg,
		telegramDeps
	});
	const isRoomEvent = dispatchContext.ctxPayload.InboundEventKind === "room_event";
	const status = createTelegramDispatchStatus({ context: dispatchContext });
	const tableMode = resolveMarkdownTableMode({
		cfg,
		channel: "telegram",
		accountId: dispatchContext.route.accountId,
		supportsBlockTables: telegramCfg.richMessages === true
	});
	const resolvedReasoningLevel = resolveTelegramReasoningLevel({
		cfg,
		sessionKey: dispatchContext.ctxPayload.SessionKey,
		agentId: dispatchContext.route.agentId,
		loadFreshSessionEntry
	});
	const quote = resolveTelegramQuoteContext({
		context: dispatchContext,
		replyToMode
	});
	const hookRunner = getGlobalHookRunner();
	const allowProviderPreview = !dispatchContext.ctxPayload.GroupThread && !((hookRunner?.hasHooks("reply_payload_sending") ?? false) || (hookRunner?.hasHooks("message_sending") ?? false));
	const isDispatchSuperseded = () => turnAdoptionLifecycle?.abortSignal?.aborted === true;
	const turnConfig = {
		...dispatchParams,
		allowProviderPreview,
		chunkMode: resolveChunkMode(cfg, "telegram", dispatchContext.route.accountId),
		context: dispatchContext,
		dispatchStartedAt,
		draftReplyToMessageId: quote.draftReplyToMessageId,
		isSuperseded: isDispatchSuperseded,
		loadFreshSessionEntry,
		mediaLocalRoots: getAgentScopedMediaLocalRoots(cfg, dispatchContext.route.agentId),
		replyQuoteByMessageId: quote.replyQuoteByMessageId,
		replyQuoteEntities: quote.replyQuoteEntities,
		replyQuoteMessageId: quote.replyQuoteMessageId,
		replyQuotePosition: quote.replyQuotePosition,
		replyQuoteText: quote.replyQuoteText,
		resolvedReasoningLevel,
		statusReactionController: status.controller,
		tableMode,
		telegramDeps
	};
	const draftState = createDraftState(turnConfig);
	const progressState = createProgressState(turnConfig, draftState, () => turn);
	const deliveryState = createDeliveryState({
		...turnConfig,
		lanes: draftState.lanes
	}, () => turn);
	const turn = {
		...turnConfig,
		...draftState,
		...progressState,
		...deliveryState,
		...createReplyState(),
		queuedFinal: false,
		noVisibleReplyFallbackEligible: false,
		suppressSilentReplyFallback: false,
		hadErrorReplyFailureOrSkip: false
	};
	let isFirstTurnInSession = false;
	let dispatchWasSuperseded;
	let turnDispatched;
	const isDmTopic = !dispatchContext.isGroup && dispatchContext.threadSpec.scope === "dm" && dispatchContext.threadSpec.id != null;
	try {
		await prepareTelegramSticker({
			cfg,
			context: dispatchContext
		});
		if (isDmTopic) try {
			const sessionKey = dispatchContext.ctxPayload.SessionKey;
			if (sessionKey) isFirstTurnInSession = !loadFreshSessionEntry(dispatchContext.route.agentId, sessionKey).entry?.systemSent;
			else logVerbose("auto-topic-label: SessionKey is absent, skipping first-turn detection");
		} catch (err) {
			logVerbose(`auto-topic-label: session store error: ${String(err)}`);
		}
		loadFreshSessionEntry.clear();
		if (isDispatchSuperseded()) {
			status.finalizeInBackground({ outcome: "cancelled" }, "cancelled finalize");
			return { kind: "completed" };
		}
		if (status.controller && !isRoomEvent) status.controller.setThinking();
		try {
			turnDispatched = await runTelegramDispatchTurn(turn);
		} catch (err) {
			turn.dispatchError = err;
			runtime.error?.(danger(`telegram dispatch failed: ${String(err)}`));
		} finally {
			turn.progressCompositor.cancel();
			await waitForDraftEvents(turn);
			try {
				await finalizePendingAnswerBlockDraft(turn);
			} catch (err) {
				turn.dispatchError ??= err;
				runtime.error?.(danger(`telegram terminal block delivery failed: ${String(err)}`));
			}
			await cleanupDrafts(turn, isDispatchSuperseded());
		}
	} finally {
		dispatchWasSuperseded = isDispatchSuperseded();
	}
	if (turnDispatched === false) return { kind: "completed" };
	if (dispatchWasSuperseded) {
		if (status.controller) status.finalizeInBackground({ outcome: "done" }, "finalize");
		return { kind: "completed" };
	}
	const deliverySummary = turn.deliveryState.snapshot();
	let sentFallback = false;
	const terminalFailure = turn.dispatchError || turn.agentRunFailed;
	if (!isRoomEvent && turn.finalReplyOutcome !== "suppressed" && !turn.sendPolicyDenied && (!suppressFailureFallback || turn.agentRunFailed) && !turn.finalAnswerDelivered && (terminalFailure || !turn.progressContinuationAdopted && (deliverySummary.failedNonSilent > 0 || deliverySummary.skippedNonSilent > 0 && !turn.suppressSilentReplyFallback))) sentFallback = (await deliverFallback(turn, [{ text: terminalFailure ? "Something went wrong while processing your request. Please try again." : EMPTY_RESPONSE_FALLBACK }], telegramCfg.silentErrorReplies === true && Boolean(terminalFailure || turn.hadErrorReplyFailureOrSkip))).delivered;
	if (!sentFallback && turn.finalReplyOutcome !== "suppressed" && !turn.sendPolicyDenied && !turn.dispatchError && !deliverySummary.delivered && !turn.suppressSilentReplyFallback && !turn.queuedFinal && turn.noVisibleReplyFallbackEligible) {
		sentFallback = (await deliverFallback(turn, [{ text: EMPTY_RESPONSE_FALLBACK }], false)).delivered;
		silentReplyDispatchLogger.debug("telegram recovered eligible turn without visible response", {
			hasSessionKey: Boolean(dispatchContext.ctxPayload.SessionKey),
			hasChatId: dispatchContext.chatId != null,
			queuedFinal: turn.queuedFinal,
			sentFallback
		});
	}
	const hasFinalResponse = turn.finalReplyOutcome === "suppressed" || turn.finalAnswerDelivered || turn.progressContinuationAdopted || sentFallback || turn.suppressSilentReplyFallback || turn.queuedFinal;
	const hasVisibleResponse = turn.finalReplyOutcome === "suppressed" || deliverySummary.delivered || sentFallback || turn.suppressSilentReplyFallback || turn.queuedFinal;
	const deliveryFailureWithoutFinalResponse = turn.finalReplyOutcome !== "suppressed" && !turn.finalAnswerDelivered && !turn.progressContinuationAdopted && (deliverySummary.skippedNonSilent > 0 || deliverySummary.failedNonSilent > 0);
	const retryableDispatchFailure = turn.dispatchError ?? (deliveryFailureWithoutFinalResponse ? /* @__PURE__ */ new Error(`Telegram reply delivery failed without a final response (failed=${deliverySummary.failedNonSilent}, skipped=${deliverySummary.skippedNonSilent})`) : null);
	if (status.controller && !hasVisibleResponse) status.finalizeInBackground({ outcome: "error" }, "error finalize");
	const shouldReturnRetryableDispatchFailure = retryDispatchErrors && (turn.dispatchError != null && !hasFinalResponse || turn.dispatchError == null && deliveryFailureWithoutFinalResponse && !hasVisibleResponse);
	if (retryableDispatchFailure && shouldReturnRetryableDispatchFailure) return {
		kind: "failed-retryable",
		error: retryableDispatchFailure
	};
	if (!hasVisibleResponse) return { kind: "completed" };
	scheduleDmTopicLabel({
		bot,
		cfg,
		context: dispatchContext,
		isFirstTurnInSession,
		telegramCfg
	});
	if (status.controller) status.finalizeInBackground({ outcome: turn.agentRunFailed || turn.dispatchError != null || !turn.finalAnswerDelivered && sentFallback ? "error" : "done" }, "finalize");
	return { kind: "completed" };
};
//#endregion
//#region extensions/telegram/src/bot-processing-outcome.ts
const telegramUpdateProcessingFrames = new AsyncLocalStorage();
const telegramSpooledReplayFrames = new AsyncLocalStorage();
const telegramSpooledReplayUpdates = /* @__PURE__ */ new WeakSet();
var TelegramSpooledReplayProcessingError = class extends Error {
	constructor(cause) {
		super(`telegram spooled update processing failed: ${String(cause)}`);
		this.name = "TelegramSpooledReplayProcessingError";
		this.cause = cause;
	}
};
async function runWithTelegramUpdateProcessingFrame(fn) {
	const inheritedFrame = telegramUpdateProcessingFrames.getStore();
	const frame = inheritedFrame ?? {};
	const value = inheritedFrame ? await fn() : await telegramUpdateProcessingFrames.run(frame, fn);
	return frame.result ? {
		value,
		result: frame.result
	} : { value };
}
/** Records a default only when a handler has not already chosen its terminal disposition. */
function ensureTelegramMessageProcessingResult(result) {
	const frame = telegramUpdateProcessingFrames.getStore();
	if (frame && !frame.result) frame.result = result;
}
function recordTelegramMessageProcessingResult(result) {
	const frame = telegramUpdateProcessingFrames.getStore();
	if (!frame) return;
	if (result.kind === "failed-retryable") {
		frame.result = result;
		return;
	}
	if (!frame.result || frame.result.kind === "skipped") frame.result = result;
}
function createTelegramSpooledReplayParticipant(key) {
	const abortController = new AbortController();
	const ownerAbortSignal = telegramSpooledReplayFrames.getStore()?.lifecycle?.abortSignal;
	const abortSignal = ownerAbortSignal ? AbortSignal.any([abortController.signal, ownerAbortSignal]) : abortController.signal;
	let settled = false;
	let ownerAbortedWhilePending = ownerAbortSignal?.aborted === true;
	let settlementHeld = false;
	let pendingSettlement;
	let resolveTask = () => {};
	const task = new Promise((resolve) => {
		resolveTask = resolve;
	});
	const onOwnerAbort = () => {
		if (!settled) {
			ownerAbortedWhilePending = true;
			if (!settlementHeld) settleNow({
				kind: "failed-retryable",
				error: ownerAbortSignal?.reason ?? /* @__PURE__ */ new Error("telegram spooled replay owner aborted")
			});
		}
	};
	ownerAbortSignal?.addEventListener("abort", onOwnerAbort, { once: true });
	const settleNow = (result) => {
		if (settled) return;
		settled = true;
		ownerAbortSignal?.removeEventListener("abort", onOwnerAbort);
		if (result.kind !== "completed") abortController.abort(result.kind === "failed-retryable" ? result.error : result.kind);
		resolveTask(result);
	};
	if (ownerAbortSignal?.aborted) onOwnerAbort();
	return {
		key,
		abortSignal,
		task,
		isSettled: () => settled,
		wasOwnerAbortedWhilePending: () => ownerAbortedWhilePending,
		beginSettlementHold: () => {
			if (settled || settlementHeld) return;
			settlementHeld = true;
			telegramSpooledReplayFrames.getStore()?.lifecycle?.onAdoptionFinalizing?.();
			let released = false;
			return { release: (mode) => {
				if (released) return;
				released = true;
				settlementHeld = false;
				const pending = pendingSettlement;
				pendingSettlement = void 0;
				if (mode === "replay-pending" && pending) settleNow(pending);
			} };
		},
		settle: (result) => {
			if (settled) return;
			if (settlementHeld) {
				pendingSettlement ??= result;
				return;
			}
			settleNow(result);
		}
	};
}
function createTelegramSpooledReplayDeferredParticipant(key) {
	const frame = telegramSpooledReplayFrames.getStore();
	if (!frame) return null;
	const participant = createTelegramSpooledReplayParticipant(key);
	frame.deferredWork = participant;
	return participant;
}
function getTelegramSpooledReplayDeferredParticipant() {
	return telegramSpooledReplayFrames.getStore()?.deferredWork;
}
async function runWithTelegramSpooledReplayUpdate(update, fn, lifecycle) {
	const frame = lifecycle ? { lifecycle } : {};
	telegramSpooledReplayUpdates.add(update);
	try {
		const value = await telegramSpooledReplayFrames.run(frame, fn);
		return frame.deferredWork ? {
			value,
			deferredWork: frame.deferredWork
		} : { value };
	} finally {
		telegramSpooledReplayUpdates.delete(update);
	}
}
/** Drain lifecycle for the active spooled-replay ALS frame, if any. */
function getTelegramSpooledReplayLifecycle() {
	return telegramSpooledReplayFrames.getStore()?.lifecycle;
}
function isTelegramSpooledReplayUpdate(update) {
	return telegramSpooledReplayFrames.getStore() !== void 0 || typeof update === "object" && update !== null && telegramSpooledReplayUpdates.has(update);
}
//#endregion
//#region extensions/telegram/src/telegram-ingress-spool.ts
const TELEGRAM_INGRESS_SPOOL_PREFIX = "ingress-spool-";
const TELEGRAM_SPOOLED_COMPLETION_RETRY_POLICY = {
	initialMs: 250,
	maxMs: 5e3,
	factor: 2,
	jitter: .2
};
function isValidUpdateId(value) {
	return typeof value === "number" && Number.isSafeInteger(value) && value >= 0;
}
function resolveTelegramIngressSpoolDir(params) {
	const stateDir = resolveStateDir(params.env, os.homedir);
	return path.join(stateDir, "telegram", `${TELEGRAM_INGRESS_SPOOL_PREFIX}${normalizeTelegramStateAccountId(params.accountId)}`);
}
function resolveTelegramUpdateId(update) {
	if (!update || typeof update !== "object") return null;
	const value = update.update_id;
	return isValidUpdateId(value) ? value : null;
}
function telegramQueueEventId(updateId) {
	return String(updateId).padStart(16, "0");
}
function resolveQueueParts(spoolDir) {
	const basename = path.basename(spoolDir);
	return {
		accountId: normalizeTelegramStateAccountId(basename.startsWith(TELEGRAM_INGRESS_SPOOL_PREFIX) ? basename.slice(14) : basename),
		stateDir: basename.startsWith(TELEGRAM_INGRESS_SPOOL_PREFIX) && path.basename(path.dirname(spoolDir)) === "telegram" ? path.dirname(path.dirname(spoolDir)) : spoolDir
	};
}
/** Open the account-scoped durable ingress queue for this spool directory. */
function openTelegramIngressQueue(spoolDir) {
	const parts = resolveQueueParts(spoolDir);
	return getTelegramRuntime().state.openChannelIngressQueue({
		accountId: parts.accountId,
		stateDir: parts.stateDir
	});
}
/** Backoff for irrevocable-adoption completion retries (bot-message only). */
function resolveSpooledUpdatePersistenceRetryDelayMs(attempt) {
	return computeBackoff(TELEGRAM_SPOOLED_COMPLETION_RETRY_POLICY, attempt);
}
//#endregion
//#region extensions/telegram/src/bot-message.ts
const telegramInboundLog = createSubsystemLogger("gateway/channels/telegram").child("inbound");
function formatTelegramInboundLogLine(params) {
	const kindLabel = params.mediaType ? `, ${params.mediaType}` : "";
	return `Inbound message ${params.from} -> ${params.to} (${params.chatType}${kindLabel}, ${params.body.length} chars)`;
}
function resolveTelegramMessageTurnSettings(params) {
	const allowFrom = params.opts.allowFrom ?? params.telegramCfg.allowFrom;
	const telegramTextLimit = params.telegramCfg.richMessages === true ? TELEGRAM_RICH_TEXT_LIMIT : TELEGRAM_TEXT_CHUNK_LIMIT;
	return {
		ackReactionScope: params.cfg.messages?.ackReactionScope ?? "group-mentions",
		allowFrom,
		dmPolicy: params.telegramCfg.dmPolicy ?? "pairing",
		dmHistoryLimit: resolveTelegramDmHistoryLimit({
			config: params.telegramCfg,
			senderId: params.senderId
		}),
		groupAllowFrom: params.opts.groupAllowFrom ?? params.telegramCfg.groupAllowFrom ?? params.telegramCfg.allowFrom ?? allowFrom,
		historyLimit: resolvePromptHistoryLimit(params.telegramCfg.historyLimit ?? params.cfg.messages?.groupChat?.historyLimit),
		replyToMode: params.opts.replyToMode ?? params.telegramCfg.replyToMode ?? "off",
		streamMode: resolveTelegramStreamMode(params.telegramCfg),
		textLimit: Math.min(resolveTextChunkLimit(params.cfg, "telegram", params.accountId, { fallbackLimit: telegramTextLimit }), telegramTextLimit)
	};
}
const createTelegramMessageProcessor = (deps) => {
	const { bot, account, logger, resolveGroupActivation, resolveGroupRequireMention, resolveTelegramGroupConfig, sendChatActionHandler, runtime, telegramDeps, buildContext, opts } = deps;
	const sessionRuntime = {
		...buildContext ?? telegramDeps.buildChannelInboundEventContext ? { buildChannelInboundEventContext: buildContext ?? telegramDeps.buildChannelInboundEventContext } : {},
		...telegramDeps.readSessionUpdatedAt ? { readSessionUpdatedAt: telegramDeps.readSessionUpdatedAt } : {},
		...telegramDeps.readAmbientTranscriptWatermark ? { readAmbientTranscriptWatermark: telegramDeps.readAmbientTranscriptWatermark } : {},
		...telegramDeps.recordInboundSession ? { recordInboundSession: telegramDeps.recordInboundSession } : {},
		...telegramDeps.resolveAmbientTranscriptWatermarkKey ? { resolveAmbientTranscriptWatermarkKey: telegramDeps.resolveAmbientTranscriptWatermarkKey } : {},
		...telegramDeps.resolveInboundLastRouteSessionKey ? { resolveInboundLastRouteSessionKey: telegramDeps.resolveInboundLastRouteSessionKey } : {},
		...telegramDeps.resolvePinnedMainDmOwnerFromAllowlist ? { resolvePinnedMainDmOwnerFromAllowlist: telegramDeps.resolvePinnedMainDmOwnerFromAllowlist } : {},
		resolveStorePath: telegramDeps.resolveStorePath
	};
	const contextRuntime = telegramDeps.recordChannelActivity ? { recordChannelActivity: telegramDeps.recordChannelActivity } : void 0;
	return async (primaryCtx, allMedia, storeAllowFrom, turnContext, options, replyMedia, replyChain, promptContext) => {
		const turnCfg = turnContext.cfg;
		const turnTelegramCfg = turnContext.telegramCfg;
		const turnSettings = resolveTelegramMessageTurnSettings({
			accountId: account.accountId,
			senderId: primaryCtx.message.from?.id,
			cfg: turnCfg,
			telegramCfg: turnTelegramCfg,
			opts
		});
		const ingressReceivedAtMs = typeof options?.receivedAtMs === "number" && Number.isFinite(options.receivedAtMs) ? options.receivedAtMs : void 0;
		const ingressDebugEnabled = shouldLogVerbose() || process.env.OPENCLAW_DEBUG_TELEGRAM_INGRESS === "1";
		const ingressContextStartMs = ingressReceivedAtMs ? Date.now() : void 0;
		const context = await buildTelegramMessageContext({
			nativeCommandNames: deps.nativeCommandNames,
			primaryCtx,
			allMedia,
			replyMedia,
			replyChain,
			promptContext,
			storeAllowFrom,
			options,
			bot,
			cfg: turnCfg,
			account,
			ownerAgentId: opts.ownerAgentId,
			historyLimit: turnSettings.historyLimit,
			dmHistoryLimit: turnSettings.dmHistoryLimit,
			dmPolicy: turnSettings.dmPolicy,
			allowFrom: turnSettings.allowFrom,
			groupAllowFrom: turnSettings.groupAllowFrom,
			ackReactionScope: turnSettings.ackReactionScope,
			logger,
			resolveGroupActivation,
			resolveGroupRequireMention,
			resolveTelegramGroupConfig,
			sendChatActionHandler,
			runtime: contextRuntime,
			sessionRuntime,
			upsertPairingRequest: telegramDeps.upsertChannelPairingRequest
		});
		if (!context) {
			if (ingressDebugEnabled && ingressReceivedAtMs && ingressContextStartMs) logVerbose(`telegram ingress: chatId=${primaryCtx.message.chat.id} dropped after ${Date.now() - ingressReceivedAtMs}ms` + (options?.ingressBuffer ? ` buffer=${options.ingressBuffer}` : ""));
			return { kind: "skipped" };
		}
		if (ingressDebugEnabled && ingressReceivedAtMs && ingressContextStartMs) logVerbose(`telegram ingress: chatId=${context.chatId} contextReadyMs=${Date.now() - ingressReceivedAtMs} preDispatchMs=${Date.now() - ingressContextStartMs}` + (options?.ingressBuffer ? ` buffer=${options.ingressBuffer}` : ""));
		if (context.ctxPayload.InboundEventKind !== "room_event" && context.initialTypingCueSent !== true) context.sendTyping().catch((err) => {
			logVerbose(`telegram early typing cue failed for chat ${context.chatId}: ${String(err)}`);
		});
		telegramInboundLog.info(formatTelegramInboundLogLine({
			from: context.ctxPayload.From,
			to: context.primaryCtx.me?.username ? `@${context.primaryCtx.me.username}` : context.ctxPayload.To,
			chatType: context.ctxPayload.ChatType,
			body: context.ctxPayload.RawBody,
			mediaType: allMedia[0]?.contentType ?? allMedia[0]?.kind
		}));
		const spooledReplay = options?.spooledReplay === true || isTelegramSpooledReplayUpdate(primaryCtx.update);
		if (!spooledReplay) await turnContext.onDispatchStart?.();
		const runTelegramDispatch = async (params) => {
			try {
				const dispatchResult = await dispatchTelegramMessage({
					context,
					bot,
					cfg: context.cfg,
					runtime,
					replyToMode: turnSettings.replyToMode,
					streamMode: turnSettings.streamMode,
					textLimit: turnSettings.textLimit,
					telegramCfg: turnTelegramCfg,
					telegramDeps,
					opts,
					retryDispatchErrors: spooledReplay,
					suppressFailureFallback: spooledReplay,
					turnAdoptionLifecycle: params.turnAdoptionLifecycle
				});
				if (dispatchResult?.kind === "failed-retryable") return {
					kind: "failed-retryable",
					error: dispatchResult.error
				};
				if (ingressDebugEnabled && ingressReceivedAtMs) logVerbose(`telegram ingress: chatId=${context.chatId} dispatchCompleteMs=${Date.now() - ingressReceivedAtMs}` + (options?.ingressBuffer ? ` buffer=${options.ingressBuffer}` : ""));
				return { kind: "completed" };
			} catch (err) {
				runtime.error?.(danger(`telegram message processing failed: ${String(err)}`));
				if (!spooledReplay) try {
					await bot.api.sendMessage(context.chatId, "Something went wrong while processing your request. Please try again.", buildTelegramThreadParams(context.threadSpec));
				} catch {}
				return {
					kind: "failed-retryable",
					error: err
				};
			}
		};
		if (spooledReplay) {
			const participant = turnContext.spooledReplayParticipant ?? (options?.isolateSpooledReplaySettlement ? void 0 : getTelegramSpooledReplayDeferredParticipant()) ?? (options?.isolateSpooledReplaySettlement ? void 0 : createTelegramSpooledReplayDeferredParticipant(`agent-turn:${context.chatId}:${context.ctxPayload.MessageSid ?? Date.now()}`)) ?? createTelegramSpooledReplayParticipant(`agent-turn:${context.chatId}:${context.ctxPayload.MessageSid ?? Date.now()}`);
			let adopted = false;
			let adoptionAttempted = false;
			let adoptionFinalizationError;
			let deferred = false;
			let settledResult;
			let settlement;
			const settle = async (result, phase) => {
				if (settledResult) return settledResult;
				if (settlement) return await settlement;
				settlement = (async () => {
					let finalized;
					try {
						finalized = turnContext.finalizeSpooledReplayResult ? await turnContext.finalizeSpooledReplayResult(result, phase) : result;
					} catch (error) {
						finalized = {
							kind: "failed-retryable",
							error
						};
					}
					if (phase === "adopted" && finalized.kind !== "completed") return finalized;
					if (phase === "adopted" && finalized.kind === "completed") adopted = true;
					settledResult = finalized;
					participant.settle(finalized);
					return finalized;
				})();
				try {
					return await settlement;
				} finally {
					if (!settledResult) settlement = void 0;
				}
			};
			const run = async () => {
				const drainLifecycle = getTelegramSpooledReplayLifecycle();
				const turnAbortSignal = (() => {
					const extras = [turnContext.spooledReplayAbortSignal, drainLifecycle?.abortSignal].filter((signal) => signal !== void 0);
					if (extras.length === 0) return participant.abortSignal;
					return AbortSignal.any([participant.abortSignal, ...extras]);
				})();
				const result = await runTelegramDispatch({ turnAdoptionLifecycle: {
					admission: "exclusive",
					abortSignal: turnAbortSignal,
					onAdopted: async () => {
						if (adopted) return;
						adoptionAttempted = true;
						const adoptedResult = await settle({ kind: "completed" }, "adopted");
						if (adoptedResult.kind !== "completed") {
							adoptionFinalizationError = adoptedResult.kind === "failed-retryable" ? adoptedResult.error : /* @__PURE__ */ new Error("telegram spooled turn adoption was not completed");
							throw adoptedResult.kind === "failed-retryable" ? adoptedResult.error : /* @__PURE__ */ new Error("telegram spooled turn adoption was not completed");
						}
						await drainLifecycle?.onAdopted();
					},
					onDeferred: () => {
						deferred = true;
						drainLifecycle?.onDeferred();
					},
					onDeferredHeartbeat: () => drainLifecycle?.onDeferredHeartbeat?.(),
					deferredHeartbeatIntervalMs: drainLifecycle?.deferredHeartbeatIntervalMs,
					onAbandoned: () => {
						if (!adopted) settle({
							kind: "failed-retryable",
							error: "turn-abandoned"
						}, "terminal");
						drainLifecycle?.onAbandoned();
					}
				} });
				if (adopted) return { kind: "completed" };
				if (settledResult) return settledResult;
				if (turnAbortSignal.aborted) {
					const abortResult = turnAbortSignal.reason === "skipped" ? { kind: "skipped" } : {
						kind: "failed-retryable",
						error: turnAbortSignal.reason ?? /* @__PURE__ */ new Error("telegram spooled replay owner cancelled before adoption")
					};
					return await settle(abortResult, "terminal");
				}
				if (adoptionAttempted && !deferred && result.kind === "completed") {
					runtime.error?.(danger(`telegram spooled turn adoption finalization failed after active steer commit: ${String(adoptionFinalizationError)}`));
					let retryError = adoptionFinalizationError;
					let retryAttempt = 0;
					while (!turnAbortSignal.aborted) {
						retryAttempt += 1;
						try {
							const completed = await turnContext.completeSpooledReplayAfterIrrevocableAdoption?.(retryError) ?? { kind: "completed" };
							if (completed.kind === "completed") {
								adopted = true;
								settledResult = completed;
								participant.settle(completed);
								return completed;
							}
							retryError = completed.kind === "failed-retryable" ? completed.error : /* @__PURE__ */ new Error("telegram spooled turn adoption was not completed");
						} catch (error) {
							retryError = error;
						}
						const delayMs = resolveSpooledUpdatePersistenceRetryDelayMs(retryAttempt);
						runtime.error?.(danger(`telegram spooled turn durable replay protection retry ${retryAttempt} failed after active steer commit; retrying in ${delayMs}ms: ${String(retryError)}`));
						try {
							await sleepWithAbort(delayMs, turnAbortSignal);
						} catch {
							break;
						}
					}
					if (turnAbortSignal.aborted && !participant.abortSignal.aborted) {
						const abortResult = turnAbortSignal.reason === "skipped" ? { kind: "skipped" } : {
							kind: "failed-retryable",
							error: turnAbortSignal.reason ?? /* @__PURE__ */ new Error("telegram spooled replay owner cancelled")
						};
						participant.settle(abortResult);
					}
					return await participant.task;
				}
				if (deferred) return await participant.task;
				return await settle(result, "terminal");
			};
			run();
			return await participant.task;
		}
		return await runTelegramDispatch({});
	};
};
//#endregion
export { isTelegramForumServiceMessage as A, latestPromptContextMinTimestampMs as C, isTelegramDmAccessAllowed as D, enforceTelegramDmAccess as E, resolveTelegramInboundMediaUri as O, latestPromptContextAmbientWatermark as S, promptContextBoundaryOptions as T, buildSyntheticContext as _, resolveTelegramUpdateId as a, createTelegramMessageSessionRuntime as b, createTelegramSpooledReplayDeferredParticipant as c, getTelegramSpooledReplayDeferredParticipant as d, getTelegramSpooledReplayLifecycle as f, runWithTelegramUpdateProcessingFrame as g, runWithTelegramSpooledReplayUpdate as h, resolveTelegramIngressSpoolDir as i, resolveTelegramPromptMediaPath as k, createTelegramSpooledReplayParticipant as l, recordTelegramMessageProcessingResult as m, resolveTelegramMessageTurnSettings as n, telegramQueueEventId as o, isTelegramSpooledReplayUpdate as p, openTelegramIngressQueue as r, TelegramSpooledReplayProcessingError as s, createTelegramMessageProcessor as t, ensureTelegramMessageProcessingResult as u, buildSyntheticTextMessage as v, normalizePromptContextMinTimestampMs as w, formatTelegramAmbientTranscriptBody as x, createTelegramMessageContextRuntime as y };
