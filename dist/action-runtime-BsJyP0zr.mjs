import { w as parseStrictPositiveInteger } from "./number-coercion-CkhMiRw8.mjs";
import { a as asOptionalRecord, c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { _ as normalizeUniqueTrimmedStringList } from "./string-normalization-D6DKCpwE.mjs";
import { r as createRuntimeConfigReader } from "./runtime-snapshot-BBYDJbw9.mjs";
import { r as normalizeOptionalAccountId } from "./account-id-ifCOO7_9.mjs";
import { c as resolveSessionStorePathCore } from "./paths-YgcBNLgG.mjs";
import { f as normalizeMessagePresentation, v as renderMessagePresentationFallbackText } from "./payload-qyD1vby_.mjs";
import { t as jsonResult } from "./tool-results-BCM3fdVS.mjs";
import { d as readReactionParams, f as readStringArrayParam, m as readToolStringParam, p as readStringOrNumberParam, u as readPositiveIntegerParam } from "./common-BofcG96e.mjs";
import { a as sendDurableMessageBatch } from "./channel-outbound-BbIm36V0.mjs";
import { n as normalizeOutboundLocation } from "./location-CxESZbHi.mjs";
import "./string-coerce-runtime-BbIJhy7G.mjs";
import { t as captureChannelReadAuthority } from "./channel-read-authority-DeXfvJjt.mjs";
import "./fetch-runtime-Dg4wMDiG.mjs";
import "./number-runtime-D3v2w3D4.mjs";
import "./account-core-DB3MSA02.mjs";
import { n as resolveTelegramToken } from "./token-CWjkP5nY.mjs";
import "./session-store-runtime-DVNFhqCK.mjs";
import { t as buildOutboundSessionContext } from "./session-context-ClwiWEpN.mjs";
import { r as resolvePollMaxSelections } from "./polls-C-v11_tu.mjs";
import { t as readBooleanParam } from "./boolean-param-Cb1071iT.mjs";
import { t as resolveReactionMessageId } from "./reaction-message-id-DT0v2AYr.mjs";
import "./channel-inbound-C0d69q8b.mjs";
import "./runtime-config-snapshot-kTPhBdOK.mjs";
import "./channel-actions-CaJbCkxs.mjs";
import { r as resolveDefaultTelegramAccountId, s as resolveTelegramPollActionGateState, t as createTelegramActionGate } from "./accounts-CHcpIFN8.mjs";
import { r as inspectTelegramAccount } from "./account-inspect-Dp1wulI-.mjs";
import { z as resolveTelegramAccountOwnerAgentId } from "./text-chunk-limit-BsO9A8Z8.mjs";
import { c as normalizeTelegramOutboundTarget, l as parseTelegramTarget, u as resolveTelegramTargetChatType } from "./topic-conversation-S0gZB4iY.mjs";
import { n as TELEGRAM_MESSAGE_ACTION_MAP, t as rejectTelegramNativeButtonParams } from "./native-button-params-Bcrlo_Bc.mjs";
import { r as resolveTelegramInlineButtonsScope } from "./inline-buttons-CK1XNGpd.mjs";
import { t as resolveTelegramReactionLevel } from "./reaction-level-DK8ulBdI.mjs";
import { a as resolveTelegramButtonsFromParams, n as buildTelegramControlDegradation, t as appendTelegramDroppedControlFallback } from "./button-types-DtegLouf.mjs";
import { o as resolveTelegramInteractiveTextFallback } from "./interactive-fallback-CnFs49uF.mjs";
import { i as getCacheStats, o as searchStickers } from "./sticker-cache-Byk3T8mu.mjs";
import { $ as hasProviderObservedTelegramThreadBinding, C as editMessageTelegram, D as editForumTopicTelegram, E as createForumTopicTelegram, I as reactMessageTelegram, M as updateTopicName, N as deleteMessageTelegram, P as getTelegramAllowedReactions, Q as createTelegramMessageCache, S as editMessageReplyMarkupTelegram, n as sendStickerTelegram, nt as resolveTelegramMessageCacheScope, t as sendPollTelegram, z as TELEGRAM_SUPPORTED_REACTION_EMOJI_LIST } from "./send-DWoEOMF4.mjs";
import { t as resolveTelegramPollVisibility } from "./poll-visibility-DJinse6r.mjs";
import { a as isTelegramHistorySenderAllowed, i as isTelegramHistoryNodeAllowed, o as readTelegramHistory, r as telegramInboundEventDelivery, t as renderTelegramAccountProgressDraftPreview } from "./progress-draft-preview-DtwdAQc0.mjs";
//#region extensions/telegram/src/action-params.ts
const TELEGRAM_FORUM_TOPIC_ICON_COLORS = [
	7322096,
	16766590,
	13338331,
	9367192,
	16749490,
	16478047
];
const SEND_MEDIA_FIELDS = [
	"mediaUrl",
	"media",
	"path",
	"filePath",
	"fileUrl"
];
const ATTACHMENT_MEDIA_FIELDS = [
	"media",
	"mediaUrl",
	"path",
	"filePath",
	"fileUrl",
	"url"
];
function readTelegramPositiveIntegerParam(params, key) {
	return readPositiveIntegerParam(params, key, { message: `${key} must be a positive integer.` });
}
function readTelegramForumTopicIconColor(params) {
	const iconColor = readPositiveIntegerParam(params, "iconColor", { message: "iconColor must be one of Telegram's supported forum topic colors." });
	const supportedColor = TELEGRAM_FORUM_TOPIC_ICON_COLORS.find((color) => color === iconColor);
	if (iconColor != null && supportedColor === void 0) throw new Error("iconColor must be one of Telegram's supported forum topic colors.");
	return supportedColor;
}
function readTelegramChatId(params) {
	return readStringOrNumberParam(params, "chatId") ?? readStringOrNumberParam(params, "channelId") ?? readStringOrNumberParam(params, "to", { required: true });
}
function readTelegramThreadId(params) {
	return readTelegramPositiveIntegerParam(params, "messageThreadId") ?? readTelegramPositiveIntegerParam(params, "threadId");
}
function readTelegramReplyToMessageId(params) {
	return readTelegramPositiveIntegerParam(params, "replyToMessageId") ?? readTelegramPositiveIntegerParam(params, "replyTo");
}
function readTelegramSendMediaUrls(params) {
	const attachments = Array.isArray(params.attachments) ? params.attachments.filter(isRecord) : [];
	return normalizeUniqueTrimmedStringList([
		...SEND_MEDIA_FIELDS.map((field) => params[field]),
		...Array.isArray(params.mediaUrls) ? params.mediaUrls : [],
		...attachments.flatMap((attachment) => ATTACHMENT_MEDIA_FIELDS.map((field) => attachment[field]))
	]);
}
//#endregion
//#region extensions/telegram/src/history-read.ts
const HISTORY_SCOPE_ERROR = "Telegram history read requires the authenticated current group session, account, chat, and exact topic.";
function resolveReadScope(params, context) {
	const toolContext = context?.toolContext;
	const accountId = normalizeOptionalAccountId(context?.requesterAccountId);
	const requestedAccount = normalizeOptionalAccountId(readStringOrNumberParam(params, "accountId"));
	const senderId = context?.requesterSenderId?.trim();
	if (!context?.sessionKey?.trim() || !accountId || requestedAccount !== void 0 && requestedAccount !== accountId || !senderId || !/^\d+$/.test(senderId) || toolContext?.currentChannelProvider?.trim().toLowerCase() !== "telegram" || toolContext.currentChatType !== void 0 && toolContext.currentChatType !== "group") throw new Error(HISTORY_SCOPE_ERROR);
	const currentTargets = [toolContext.currentChannelId, toolContext.currentMessagingTarget].filter((value) => typeof value === "string" && Boolean(value.trim())).map(parseTelegramTarget);
	const chatId = currentTargets[0]?.chatId;
	const contextThread = parseStrictPositiveInteger(toolContext.currentThreadTs);
	if (toolContext.currentThreadTs != null && contextThread === void 0) throw new Error(HISTORY_SCOPE_ERROR);
	const threadIds = [...currentTargets.map((target) => target.messageThreadId), contextThread].filter((value) => value !== void 0);
	const threadId = threadIds[0];
	if (!chatId || !/^-\d+$/.test(chatId) || currentTargets.some((target) => target.chatId !== chatId || target.directMessagesTopicId !== void 0) || threadIds.some((id) => id !== threadId || id <= 0)) throw new Error(HISTORY_SCOPE_ERROR);
	for (const key of [
		"target",
		"to",
		"chatId",
		"channelId"
	]) {
		const requested = readStringOrNumberParam(params, key);
		if (requested === void 0) continue;
		const target = parseTelegramTarget(requested);
		if (target.chatId !== chatId || target.directMessagesTopicId !== void 0 || target.messageThreadId !== void 0 && target.messageThreadId !== threadId) throw new Error(HISTORY_SCOPE_ERROR);
	}
	for (const key of ["threadId", "messageThreadId"]) {
		const requested = readPositiveIntegerParam(params, key);
		if (requested !== void 0 && requested !== threadId) throw new Error(HISTORY_SCOPE_ERROR);
	}
	return {
		accountId,
		chatId,
		threadId,
		senderId,
		sessionKey: context.sessionKey,
		currentMessageId: parseStrictPositiveInteger(toolContext.currentMessageId)
	};
}
async function readTelegramHistoryAction(params, cfg, context) {
	const assertReadAuthority = captureChannelReadAuthority();
	assertReadAuthority?.();
	context?.assertDirectAdapterHandoff?.();
	const scope = resolveReadScope(params, context);
	const getConfig = createRuntimeConfigReader(cfg);
	const currentConfig = getConfig();
	const currentToolContext = { ...context?.toolContext };
	const requesterAccountId = context?.requesterAccountId;
	const requesterSenderId = context?.requesterSenderId;
	const assertCurrent = () => {
		assertReadAuthority?.();
		context?.assertDirectAdapterHandoff?.();
		const current = context?.toolContext;
		if (getConfig() !== currentConfig || context?.requesterAccountId !== requesterAccountId || context?.requesterSenderId !== requesterSenderId || context?.sessionKey !== scope.sessionKey || current?.currentChannelProvider !== currentToolContext.currentChannelProvider || current?.currentChatType !== currentToolContext.currentChatType || current?.currentChannelId !== currentToolContext.currentChannelId || current?.currentMessagingTarget !== currentToolContext.currentMessagingTarget || current?.currentThreadTs !== currentToolContext.currentThreadTs || current?.currentMessageId !== currentToolContext.currentMessageId) throw new Error(HISTORY_SCOPE_ERROR);
	};
	const account = inspectTelegramAccount({
		cfg: currentConfig,
		accountId: scope.accountId
	});
	if (!account.enabled || !account.configured || account.accountId !== scope.accountId) throw new Error("Telegram history is unavailable for the current account.");
	const policy = {
		cfg: currentConfig,
		accountId: scope.accountId,
		chatId: scope.chatId,
		threadId: scope.threadId,
		botUserId: parseStrictPositiveInteger(account.token.split(":", 1)[0]),
		assertCurrent
	};
	if (!await isTelegramHistorySenderAllowed({
		...policy,
		senderId: scope.senderId
	})) throw new Error("Telegram history read is not permitted by the current group policy.");
	assertCurrent();
	const cache = createTelegramMessageCache({ scope: resolveTelegramMessageCacheScope(resolveSessionStorePathCore(currentConfig.session?.store, { agentId: resolveTelegramAccountOwnerAgentId({
		cfg: currentConfig,
		accountId: scope.accountId
	}) })) });
	const messageId = readPositiveIntegerParam(params, "messageId");
	const before = readPositiveIntegerParam(params, "before");
	const after = readPositiveIntegerParam(params, "after");
	if (params.around != null) throw new Error("Telegram history supports messageId for an exact message, or before/after for paging.");
	if (messageId !== void 0 && (before !== void 0 || after !== void 0)) throw new Error("Use messageId alone for an exact Telegram history read.");
	const limit = Math.min(readPositiveIntegerParam(params, "limit") ?? 50, 100);
	assertCurrent();
	let result;
	if (messageId !== void 0) {
		const node = await cache.get({
			...scope,
			messageId: String(messageId)
		});
		assertCurrent();
		const allowed = node && await isTelegramHistoryNodeAllowed({
			...policy,
			node
		});
		assertCurrent();
		result = {
			messages: node && allowed ? [node] : [],
			hasMore: false
		};
	} else {
		const anchor = before ?? (after === void 0 ? scope.currentMessageId : void 0);
		result = await readTelegramHistory({
			...policy,
			cache,
			before: anchor === void 0 ? void 0 : String(anchor),
			after: after === void 0 ? void 0 : String(after),
			limit
		});
		assertCurrent();
	}
	if (!await isTelegramHistorySenderAllowed({
		...policy,
		senderId: scope.senderId
	})) throw new Error("Telegram history read is not permitted by the current group policy.");
	assertCurrent();
	return jsonResult({
		ok: true,
		chatId: scope.chatId,
		...scope.threadId !== void 0 ? { threadId: scope.threadId } : {},
		messages: result.messages.map((node) => ({
			messageId: node.messageId,
			sender: node.sender,
			senderId: node.senderId,
			senderUsername: node.senderUsername,
			timestamp: node.timestamp,
			body: node.body,
			mediaType: node.mediaType,
			mediaRef: node.mediaRef,
			replyToId: node.replyToId
		})),
		hasMore: result.hasMore,
		oldestMessageId: result.messages[0]?.messageId,
		newestMessageId: result.messages.at(-1)?.messageId
	});
}
//#endregion
//#region extensions/telegram/src/message-topic-binding.ts
const TOPIC_BINDING_ERROR = "Delegated Telegram message mutation requires a provider-observed binding to the exact current topic and account.";
const CONVERSATION_BINDING_ERROR = "Delegated Telegram conversation read requires the exact current chat and account.";
function resolveCurrentTelegramConversation(toolContext, chatId) {
	if (toolContext?.currentChannelProvider?.trim().toLowerCase() !== "telegram") return { matchesChat: false };
	const targets = [toolContext.currentChannelId, toolContext.currentMessagingTarget].filter((value) => typeof value === "string" && Boolean(value.trim()));
	const parsedTargets = targets.map((value) => parseTelegramTarget(value));
	const threadIds = [...parsedTargets.map((target) => target.messageThreadId), parseStrictPositiveInteger(toolContext.currentThreadTs)].filter((value) => value !== void 0);
	const threadId = threadIds[0];
	return {
		matchesChat: targets.length > 0 && parsedTargets.every((target) => target.chatId === chatId) && (threadId === void 0 || threadIds.every((value) => value === threadId)),
		threadId
	};
}
function resolveMatchingTelegramRequesterAccount(params) {
	const accountId = normalizeOptionalAccountId(params.accountId ?? resolveDefaultTelegramAccountId(params.cfg));
	const requesterAccountId = normalizeOptionalAccountId(params.context?.requesterAccountId);
	return accountId && accountId === requesterAccountId ? accountId : void 0;
}
function resolveTelegramConversationReadChatId(params) {
	const currentTarget = params.context?.toolContext?.currentChannelId ?? params.context?.toolContext?.currentMessagingTarget;
	const requestedTarget = params.chatId ?? currentTarget;
	if (requestedTarget == null || !String(requestedTarget).trim()) throw new Error("Telegram emoji-list requires a chatId or current Telegram conversation.");
	const target = parseTelegramTarget(String(requestedTarget));
	if (params.context?.conversationReadOrigin === "direct-operator") return target.chatId;
	const currentConversation = resolveCurrentTelegramConversation(params.context?.toolContext, target.chatId);
	if (!resolveMatchingTelegramRequesterAccount(params) || !currentConversation.matchesChat || target.messageThreadId !== void 0 && target.messageThreadId !== currentConversation.threadId) throw new Error(CONVERSATION_BINDING_ERROR);
	return target.chatId;
}
async function resolveTelegramMessageMutationChatId(params) {
	const target = parseTelegramTarget(String(params.chatId));
	if (params.context?.conversationReadOrigin === "direct-operator") return target.messageThreadId === void 0 ? params.chatId : target.chatId;
	const currentConversation = resolveCurrentTelegramConversation(params.context?.toolContext, target.chatId);
	const selectedAccountId = resolveMatchingTelegramRequesterAccount(params);
	if (!selectedAccountId || !currentConversation.matchesChat) throw new Error(TOPIC_BINDING_ERROR);
	const threadId = target.messageThreadId ?? currentConversation.threadId;
	if (threadId === void 0) return target.chatId;
	if (currentConversation.threadId !== threadId) throw new Error(TOPIC_BINDING_ERROR);
	if (parseStrictPositiveInteger(params.context?.toolContext?.currentMessageId) === params.messageId) return target.chatId;
	const cached = await createTelegramMessageCache({ scope: resolveTelegramMessageCacheScope(resolveSessionStorePathCore(params.cfg.session?.store, { agentId: resolveTelegramAccountOwnerAgentId({
		cfg: params.cfg,
		accountId: selectedAccountId
	}) })) }).get({
		accountId: selectedAccountId,
		chatId: target.chatId,
		messageId: String(params.messageId)
	});
	if (!hasProviderObservedTelegramThreadBinding(cached, threadId)) throw new Error(TOPIC_BINDING_ERROR);
	return target.chatId;
}
//#endregion
//#region extensions/telegram/src/action-runtime.ts
const TELEGRAM_EMOJI_LIST_LIMIT = 100;
const TELEGRAM_REACTION_HINT_LIMIT = 20;
const TELEGRAM_DEFAULT_REACTIONS = TELEGRAM_SUPPORTED_REACTION_EMOJI_LIST.map((emoji) => ({
	type: "emoji",
	emoji
}));
const TELEGRAM_ACTION_ALIASES = {
	...TELEGRAM_MESSAGE_ACTION_MAP,
	createForumTopic: "createForumTopic",
	deleteMessage: "deleteMessage",
	editForumTopic: "editForumTopic",
	editMessage: "editMessage",
	searchSticker: "searchSticker",
	sendMessage: "sendMessage",
	sendSticker: "sendSticker",
	stickerCacheStats: "stickerCacheStats"
};
function normalizeTelegramActionName(action) {
	const normalized = TELEGRAM_ACTION_ALIASES[action];
	if (!normalized) throw new Error(`Unsupported Telegram action: ${action}`);
	return normalized;
}
function resolveActionTopicNameCacheScope(cfg, accountId) {
	const resolvedAccountId = accountId ?? resolveDefaultTelegramAccountId(cfg);
	return resolveSessionStorePathCore(cfg.session?.store, { agentId: resolveTelegramAccountOwnerAgentId({
		cfg,
		accountId: resolvedAccountId
	}) });
}
function formatTelegramDeliveryTarget(to, messageThreadId) {
	const parsed = parseTelegramTarget(to);
	const directTopicId = parsed.directMessagesTopicId;
	if (directTopicId != null) return `${parsed.chatId}:direct-topic:${directTopicId}`;
	const topicId = messageThreadId ?? parsed.messageThreadId;
	if (topicId == null) return to;
	return `${parsed.chatId}:topic:${topicId}`;
}
function readTelegramSendContent(params) {
	const explicitContent = readToolStringParam(params.args, "content", { allowEmpty: true }) ?? readToolStringParam(params.args, "message", { allowEmpty: true }) ?? readToolStringParam(params.args, "caption", { allowEmpty: true });
	const unsupportedBlocks = params.presentation?.blocks.filter((block) => block.type === "chart" || block.type === "table") ?? [];
	const presentationText = explicitContent == null && params.presentation ? renderMessagePresentationFallbackText({ presentation: params.presentation }) : explicitContent != null && unsupportedBlocks.length > 0 ? renderMessagePresentationFallbackText({
		text: explicitContent,
		presentation: {
			...params.presentation,
			blocks: unsupportedBlocks
		}
	}) : void 0;
	const interactiveText = explicitContent == null && !params.presentation ? resolveTelegramInteractiveTextFallback({ interactive: params.interactive }) : void 0;
	const content = (presentationText?.trim() ? presentationText : void 0) ?? explicitContent ?? (interactiveText?.trim() ? interactiveText : void 0);
	if (content == null && !params.mediaUrl && !params.hasButtons && !params.hasLocation) throw new Error("content required.");
	return {
		content: content ?? "",
		hasExplicitContent: explicitContent != null
	};
}
function normalizeTelegramDeliveryPin(params) {
	const delivery = asOptionalRecord(params.delivery);
	const pin = delivery ? delivery.pin : params.pin === true ? true : void 0;
	if (pin === true) return { enabled: true };
	const raw = asOptionalRecord(pin);
	if (raw?.enabled !== true) return;
	return {
		enabled: true,
		...raw.notify === true ? { notify: true } : {},
		...raw.required === true ? { required: true } : {}
	};
}
async function handleTelegramAction(params, cfg, options) {
	rejectTelegramNativeButtonParams(params);
	const action = normalizeTelegramActionName(readToolStringParam(params, "action", { required: true }));
	const accountId = readToolStringParam(params, "accountId");
	const isActionEnabled = createTelegramActionGate({
		cfg,
		accountId
	});
	const apiOptions = {
		cfg,
		accountId,
		gatewayClientScopes: options?.gatewayClientScopes,
		assertPlatformSendAuthorized: options?.assertDirectAdapterHandoff
	};
	const requireToken = () => {
		const token = resolveTelegramToken(cfg, { accountId }).token;
		if (!token) throw new Error("Telegram bot token missing. Set TELEGRAM_BOT_TOKEN or channels.telegram.botToken.");
		return token;
	};
	const notifyVisibleOutboundSuccess = (to, messageThreadId) => {
		telegramInboundEventDelivery.notify({
			sessionKey: options?.sessionKey ?? void 0,
			to: formatTelegramDeliveryTarget(to, messageThreadId),
			accountId,
			inboundEventKind: options?.inboundEventKind
		});
	};
	const droppedControls = [];
	const resolveButtons = (to, presentation) => resolveTelegramButtonsFromParams(params, presentation, {
		allowWebAppButtons: resolveTelegramTargetChatType(to) === "direct",
		onDroppedControl: (control) => droppedControls.push(control)
	});
	const requireInlineButtonsScope = () => {
		const scope = resolveTelegramInlineButtonsScope({
			cfg,
			accountId
		});
		if (scope === "off") throw new Error("Telegram inline buttons are disabled. Set channels.telegram.capabilities.inlineButtons to \"dm\", \"group\", \"all\", or \"allowlist\".");
		return scope;
	};
	if (action === "read") return await readTelegramHistoryAction(params, cfg, options);
	if (action === "emoji-list") {
		if (!isActionEnabled("reactions")) throw new Error("Telegram reactions are disabled via actions.reactions.");
		const chatId = resolveTelegramConversationReadChatId({
			chatId: readStringOrNumberParam(params, "chatId") ?? readStringOrNumberParam(params, "channelId") ?? readStringOrNumberParam(params, "to"),
			cfg,
			accountId,
			context: options
		});
		const token = requireToken();
		const limit = Math.min(readTelegramPositiveIntegerParam(params, "limit") ?? TELEGRAM_EMOJI_LIST_LIMIT, TELEGRAM_EMOJI_LIST_LIMIT);
		const allowed = await getTelegramAllowedReactions(chatId, {
			cfg,
			token,
			accountId
		});
		return jsonResult({
			ok: true,
			emojis: (allowed ?? TELEGRAM_DEFAULT_REACTIONS).slice(0, limit).map((reaction) => reaction.type === "emoji" ? {
				name: reaction.emoji,
				identifier: reaction.emoji
			} : {
				identifier: reaction.custom_emoji_id,
				type: "custom_emoji"
			}),
			...allowed === null ? { note: "All standard Telegram reactions are allowed." } : {}
		});
	}
	if (action === "react") {
		const rejectReaction = (reason, hint) => jsonResult({
			ok: false,
			reason,
			hint
		});
		const missingMessageId = () => rejectReaction("missing_message_id", "Telegram reaction requires a valid messageId (or inbound context fallback). Do not retry.");
		const reactionLevelInfo = resolveTelegramReactionLevel({
			cfg,
			accountId
		});
		if (!reactionLevelInfo.agentReactionsEnabled) return rejectReaction("disabled", `Telegram agent reactions disabled (reactionLevel="${reactionLevelInfo.level}"). Do not retry.`);
		if (!isActionEnabled("reactions")) return rejectReaction("disabled", "Telegram reactions are disabled via actions.reactions. Do not retry.");
		const chatId = readTelegramChatId(params);
		let explicitMessageId;
		try {
			explicitMessageId = readTelegramPositiveIntegerParam(params, "messageId");
		} catch {
			return missingMessageId();
		}
		const messageId = explicitMessageId ?? resolveReactionMessageId({ args: params });
		if (typeof messageId !== "number" || !Number.isFinite(messageId) || messageId <= 0) return missingMessageId();
		const { emoji, remove, isEmpty } = readReactionParams(params, { removeErrorMessage: "Emoji is required to remove a Telegram reaction." });
		const token = resolveTelegramToken(cfg, { accountId }).token;
		if (!token) return rejectReaction("missing_token", "Telegram bot token missing. Do not retry.");
		let reactionResult;
		let authorizedChatId = chatId ?? "";
		const describeAllowedReactions = async () => {
			const reactions = await getTelegramAllowedReactions(authorizedChatId, {
				cfg,
				token,
				accountId
			}).catch(() => void 0);
			if (reactions === void 0) return "";
			const allowed = reactions ?? TELEGRAM_DEFAULT_REACTIONS;
			const emojis = allowed.filter((reaction) => reaction.type === "emoji").slice(0, TELEGRAM_REACTION_HINT_LIMIT).map((reaction) => reaction.emoji);
			const customIds = allowed.filter((reaction) => reaction.type === "custom_emoji").slice(0, TELEGRAM_REACTION_HINT_LIMIT - emojis.length).map((reaction) => reaction.custom_emoji_id);
			const customSample = customIds.length ? `numeric custom IDs ${customIds.join(", ")}` : "";
			const sample = [emojis.join(" "), customSample].filter(Boolean).join("; ");
			return sample ? ` This chat allows: ${sample}.` : "";
		};
		try {
			authorizedChatId = await resolveTelegramMessageMutationChatId({
				chatId: chatId ?? "",
				messageId,
				cfg,
				accountId,
				context: options
			});
			reactionResult = await reactMessageTelegram(authorizedChatId, messageId, emoji ?? "", {
				...apiOptions,
				token,
				remove
			});
		} catch (err) {
			const isInvalid = String(err).includes("REACTION_INVALID");
			return jsonResult({
				ok: false,
				reason: isInvalid ? "REACTION_INVALID" : "error",
				emoji,
				hint: isInvalid ? `This reaction is unavailable.${await describeAllowedReactions()}` : "Reaction failed. Do not retry."
			});
		}
		const change = remove || isEmpty ? { removed: true } : { added: emoji };
		if (!reactionResult.ok) {
			const allowedHint = await describeAllowedReactions();
			return jsonResult({
				ok: false,
				warning: `${reactionResult.warning}${allowedHint}`,
				...change
			});
		}
		return jsonResult({
			ok: true,
			...change
		});
	}
	if (action === "sendMessage") {
		if (!isActionEnabled("sendMessage")) throw new Error("Telegram sendMessage is disabled.");
		const to = normalizeTelegramOutboundTarget(readToolStringParam(params, "to", { required: true }));
		const mediaUrls = readTelegramSendMediaUrls(params);
		const firstMediaUrl = mediaUrls[0];
		const location = normalizeOutboundLocation(params.location);
		const presentation = normalizeMessagePresentation(params.presentation);
		const buttons = resolveButtons(to, presentation);
		const resolvedContent = readTelegramSendContent({
			args: params,
			mediaUrl: firstMediaUrl,
			hasButtons: Array.isArray(buttons) && buttons.length > 0,
			hasLocation: Boolean(location),
			interactive: params.interactive,
			presentation
		});
		const content = droppedControls.length > 0 && resolvedContent.hasExplicitContent ? appendTelegramDroppedControlFallback(resolvedContent.content, droppedControls) : resolvedContent.content;
		const droppedControlFallback = appendTelegramDroppedControlFallback("", droppedControls);
		const hasOnlyDroppedControlFallback = !resolvedContent.hasExplicitContent && droppedControlFallback.length > 0 && content.trim() === droppedControlFallback.trim();
		const asVideoNote = readBooleanParam(params, "asVideoNote") ?? false;
		if (location && (content.trim() && !hasOnlyDroppedControlFallback || mediaUrls.length > 0 || asVideoNote)) throw new Error("Telegram location sends cannot be combined with message text or media.");
		if (asVideoNote && mediaUrls.length !== 1) throw new Error("Telegram video notes require exactly one media attachment.");
		if (buttons) {
			const inlineButtonsScope = requireInlineButtonsScope();
			if (inlineButtonsScope === "dm" || inlineButtonsScope === "group") {
				const targetType = resolveTelegramTargetChatType(to);
				if (targetType === "unknown") throw new Error(`Telegram inline buttons require a numeric chat id when inlineButtons="${inlineButtonsScope}".`);
				if (inlineButtonsScope === "dm" && targetType !== "direct") throw new Error("Telegram inline buttons are limited to DMs when inlineButtons=\"dm\".");
				if (inlineButtonsScope === "group" && targetType !== "group") throw new Error("Telegram inline buttons are limited to groups when inlineButtons=\"group\".");
			}
		}
		const replyToMessageId = readTelegramReplyToMessageId(params);
		const messageThreadId = readTelegramThreadId(params);
		const quoteText = readToolStringParam(params, "quoteText", { trim: false });
		requireToken();
		const asVoice = readBooleanParam(params, "asVoice");
		const silent = readBooleanParam(params, "silent");
		const forceDocument = readBooleanParam(params, "forceDocument") ?? readBooleanParam(params, "asDocument") ?? false;
		const pin = normalizeTelegramDeliveryPin(params);
		const telegramData = buttons || quoteText ? {
			...buttons ? { buttons } : {},
			...quoteText ? { quoteText } : {}
		} : void 0;
		const payload = {
			text: content,
			...mediaUrls.length > 0 ? { mediaUrls } : {},
			...asVoice === true ? { audioAsVoice: true } : {},
			...asVideoNote ? { videoAsNote: true } : {},
			...location ? { location } : {},
			...pin ? { delivery: { pin } } : {},
			...telegramData ? { channelData: { telegram: telegramData } } : {}
		};
		const mediaAccess = options?.mediaAccess ?? (options?.mediaLocalRoots || options?.mediaReadFile ? {
			...options.mediaLocalRoots ? { localRoots: options.mediaLocalRoots } : {},
			...options.mediaReadFile ? { readFile: options.mediaReadFile } : {}
		} : void 0);
		const outboundSession = buildOutboundSessionContext({
			cfg,
			sessionKey: options?.sessionKey,
			requesterAccountId: accountId
		});
		const durableResult = await sendDurableMessageBatch({
			cfg,
			channel: "telegram",
			to,
			accountId,
			payloads: [payload],
			...options?.reply ? { reply: options.reply } : { replyToId: replyToMessageId == null ? void 0 : String(replyToMessageId) },
			threadId: messageThreadId,
			forceDocument,
			silent,
			durability: "required",
			gatewayClientScopes: options?.gatewayClientScopes,
			deliveryRetryOwner: options?.deliveryRetryOwner,
			onPlatformSendDispatch: options?.onPlatformSendDispatch,
			assertDirectAdapterHandoff: options?.assertDirectAdapterHandoff,
			skipQueue: options?.skipQueue,
			...mediaAccess ? { mediaAccess } : {},
			...outboundSession ? { session: outboundSession } : {}
		});
		if (durableResult.status === "failed" || durableResult.status === "partial_failed") throw durableResult.error;
		if (durableResult.status === "suppressed") {
			if (durableResult.reason === "adapter_returned_no_identity" || durableResult.payloadOutcomes?.some((outcome) => outcome.status === "failed" ? outcome.sentBeforeError : outcome.status === "sent" || outcome.reason === "adapter_returned_no_identity")) throw new Error("Telegram sendMessage was suppressed before delivery.");
			return jsonResult({
				status: "suppressed",
				reason: durableResult.reason
			});
		}
		const result = durableResult.results.at(-1);
		const receipt = durableResult.receipt;
		notifyVisibleOutboundSuccess(to, messageThreadId);
		return jsonResult({
			ok: true,
			messageId: result?.messageId ?? receipt.primaryPlatformMessageId ?? receipt.platformMessageIds.at(-1),
			chatId: result?.target?.kind === "chat" ? result.target.id : void 0,
			receipt: {
				threadId: receipt.threadId,
				replyToId: receipt.replyToId
			},
			...buildTelegramControlDegradation(droppedControls, Boolean(content.trim()))
		});
	}
	if (action === "poll") {
		const pollActionState = resolveTelegramPollActionGateState(isActionEnabled);
		if (!pollActionState.sendMessageEnabled) throw new Error("Telegram sendMessage is disabled.");
		if (!pollActionState.pollEnabled) throw new Error("Telegram polls are disabled.");
		const to = readToolStringParam(params, "to", { required: true });
		const question = readToolStringParam(params, "question") ?? readToolStringParam(params, "pollQuestion", { required: true });
		const answers = readStringArrayParam(params, "answers") ?? readStringArrayParam(params, "pollOption", { required: true });
		const allowMultiselect = readBooleanParam(params, "allowMultiselect") ?? readBooleanParam(params, "pollMulti");
		const durationSeconds = readTelegramPositiveIntegerParam(params, "durationSeconds") ?? readTelegramPositiveIntegerParam(params, "pollDurationSeconds");
		const durationHours = readTelegramPositiveIntegerParam(params, "durationHours") ?? readTelegramPositiveIntegerParam(params, "pollDurationHours");
		const replyToMessageId = readTelegramReplyToMessageId(params);
		const messageThreadId = readTelegramThreadId(params);
		const isAnonymous = readBooleanParam(params, "isAnonymous") ?? resolveTelegramPollVisibility({
			pollAnonymous: readBooleanParam(params, "pollAnonymous"),
			pollPublic: readBooleanParam(params, "pollPublic")
		});
		const silent = readBooleanParam(params, "silent");
		const token = requireToken();
		const result = await sendPollTelegram(to, {
			question,
			options: answers,
			maxSelections: resolvePollMaxSelections(answers.length, allowMultiselect ?? false),
			durationSeconds,
			durationHours
		}, {
			...apiOptions,
			token,
			replyToMessageId,
			messageThreadId,
			isAnonymous,
			silent
		});
		notifyVisibleOutboundSuccess(to, messageThreadId);
		return jsonResult({
			ok: true,
			messageId: result.messageId,
			chatId: result.chatId,
			pollId: result.pollId,
			...result.pollAnswerRouting ? { pollAnswerRouting: result.pollAnswerRouting } : {},
			...result.warning ? { warning: result.warning } : {}
		});
	}
	if (action === "deleteMessage" || action === "editMessage") {
		if (!isActionEnabled(action)) throw new Error(`Telegram ${action} is disabled.`);
		const chatId = readTelegramChatId(params);
		const messageId = readTelegramPositiveIntegerParam(params, "messageId");
		if (messageId === void 0) throw new Error("messageId required");
		const authorizedChatId = await resolveTelegramMessageMutationChatId({
			chatId: chatId ?? "",
			messageId,
			cfg,
			accountId,
			context: options
		});
		if (action === "deleteMessage") {
			const result = await deleteMessageTelegram(authorizedChatId, messageId, { ...apiOptions });
			if (!result.ok) return jsonResult({
				ok: false,
				deleted: false,
				warning: result.warning
			});
			return jsonResult({
				ok: true,
				deleted: true
			});
		}
		let content = readToolStringParam(params, "content", { allowEmpty: false }) ?? readToolStringParam(params, "message", { allowEmpty: false });
		let caption = readToolStringParam(params, "caption", { allowEmpty: true });
		let progressPreview;
		if (options?.progressSnapshot) {
			progressPreview = renderTelegramAccountProgressDraftPreview(options.progressSnapshot, {
				cfg,
				accountId
			});
			content = progressPreview.text;
		}
		const buttons = resolveButtons(chatId ?? "");
		if (droppedControls.length > 0) {
			if (caption != null) caption = appendTelegramDroppedControlFallback(caption, droppedControls);
			else if (content != null) content = appendTelegramDroppedControlFallback(content, droppedControls);
		}
		if (content == null && caption == null && buttons === void 0) {
			const degradation = buildTelegramControlDegradation(droppedControls, false);
			if (degradation) return jsonResult({
				ok: false,
				...degradation
			});
			throw new Error("content required.");
		}
		if (buttons !== void 0) requireInlineButtonsScope();
		const token = requireToken();
		const markupOnly = content == null && caption == null && buttons !== void 0;
		const editOptions = {
			...apiOptions,
			token
		};
		const result = markupOnly ? await editMessageReplyMarkupTelegram(authorizedChatId, messageId, buttons, editOptions) : await editMessageTelegram(authorizedChatId, messageId, progressPreview?.parseMode === "HTML" ? progressPreview.text.replaceAll("<br>", "\n") : progressPreview?.text ?? caption ?? content ?? "", {
			...editOptions,
			buttons,
			editMode: progressPreview ? "text" : caption != null ? "caption" : "auto",
			...progressPreview ? {
				textMode: progressPreview.parseMode === "HTML" ? "html" : "markdown",
				richMessage: progressPreview.richMessage
			} : {}
		});
		return jsonResult({
			ok: true,
			messageId: result.messageId,
			chatId: result.chatId,
			...buildTelegramControlDegradation(droppedControls, !markupOnly)
		});
	}
	if (action === "sendSticker" || action === "searchSticker") {
		if (!isActionEnabled("sticker", false)) throw new Error("Telegram sticker actions are disabled. Set channels.telegram.actions.sticker to true.");
	}
	if (action === "sendSticker") {
		const to = readToolStringParam(params, "to") ?? readToolStringParam(params, "target", { required: true });
		const fileId = readToolStringParam(params, "fileId") ?? readStringArrayParam(params, "stickerId")?.[0];
		if (!fileId) throw new Error("fileId is required.");
		const replyToMessageId = readTelegramReplyToMessageId(params);
		const messageThreadId = readTelegramThreadId(params);
		const token = requireToken();
		const result = await sendStickerTelegram(to, fileId, {
			...apiOptions,
			token,
			replyToMessageId,
			messageThreadId
		});
		notifyVisibleOutboundSuccess(to, messageThreadId);
		return jsonResult({
			ok: true,
			messageId: result.messageId,
			chatId: result.chatId
		});
	}
	if (action === "searchSticker") {
		const query = readToolStringParam(params, "query", { required: true });
		const limit = readTelegramPositiveIntegerParam(params, "limit") ?? 5;
		const results = await searchStickers(query, limit);
		return jsonResult({
			ok: true,
			count: results.length,
			stickers: results.map((s) => ({
				fileId: s.fileId,
				emoji: s.emoji,
				description: s.description,
				setName: s.setName
			}))
		});
	}
	if (action === "stickerCacheStats") {
		const stats = await getCacheStats();
		return jsonResult({
			ok: true,
			...stats
		});
	}
	if (action === "createForumTopic" || action === "editForumTopic") {
		if (!isActionEnabled(action)) throw new Error(`Telegram ${action} is disabled.`);
		const chatId = readTelegramChatId(params);
		if (action === "createForumTopic") {
			const name = readToolStringParam(params, "name") ?? readToolStringParam(params, "threadName", {
				required: true,
				label: "name"
			});
			const iconColor = readTelegramForumTopicIconColor(params);
			const iconCustomEmojiId = readToolStringParam(params, "iconCustomEmojiId");
			const token = requireToken();
			const result = await createForumTopicTelegram(chatId ?? "", name, {
				...apiOptions,
				token,
				iconColor,
				iconCustomEmojiId
			});
			return jsonResult({
				ok: true,
				topicId: result.topicId,
				name: result.name,
				chatId: result.chatId
			});
		}
		const messageThreadId = readTelegramThreadId(params);
		if (typeof messageThreadId !== "number") throw new Error("messageThreadId or threadId is required.");
		const name = readToolStringParam(params, "name") ?? readToolStringParam(params, "threadName");
		const iconCustomEmojiId = readToolStringParam(params, "iconCustomEmojiId");
		const token = requireToken();
		const result = await editForumTopicTelegram(chatId ?? "", messageThreadId, {
			...apiOptions,
			token,
			name,
			iconCustomEmojiId
		});
		if (result.chatId) {
			const patch = {
				...name ? { name } : {},
				...iconCustomEmojiId ? { iconCustomEmojiId } : {}
			};
			if (Object.keys(patch).length > 0) await updateTopicName(result.chatId, result.messageThreadId, patch, resolveActionTopicNameCacheScope(cfg, accountId)).catch(() => {});
		}
		return jsonResult(result);
	}
	throw new Error(`Unsupported Telegram action: ${String(action)}`);
}
//#endregion
export { handleTelegramAction };
