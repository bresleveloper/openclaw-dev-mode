import { w as parseStrictPositiveInteger } from "./number-coercion-CLj0HTDM.mjs";
import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { n as normalizeAccountId, r as normalizeOptionalAccountId } from "./account-id-B1bfbA5J.mjs";
import { r as createRuntimeConfigReader } from "./runtime-snapshot-DbgWcCyV.mjs";
import { f as normalizeMessagePresentation, v as renderMessagePresentationFallbackText } from "./payload-COvcWceu.mjs";
import { a as sendDurableMessageBatch } from "./channel-outbound-Bk5sWC85.mjs";
import { t as jsonResult } from "./tool-results-BCM3fdVS.mjs";
import { d as readPositiveIntegerParam, f as readReactionParams, h as readToolStringParam, m as readStringOrNumberParam, p as readStringArrayParam } from "./common-XfKigJno.mjs";
import "./string-coerce-runtime-C_MKhRVt.mjs";
import { n as normalizeOutboundLocation } from "./location-Ce8_SVWn.mjs";
import { t as captureChannelReadAuthority } from "./channel-read-authority-CLJnqxr1.mjs";
import { t as buildOutboundSessionContext } from "./session-context-B-tubEEv.mjs";
import { D as resolveChannelStreamingPreviewToolProgress, b as resolveChannelProgressDraftMaxLineChars, x as resolveChannelProgressDraftMaxLines } from "./streaming-BRWehz40.mjs";
import "./fetch-runtime-CknSDlAV.mjs";
import "./number-runtime-CGwowceO.mjs";
import "./account-core-CZZ_BKA9.mjs";
import { t as resolveTelegramToken } from "./token-BNdINpaE.mjs";
import { t as readBooleanParam } from "./boolean-param-DmR0WqRm.mjs";
import { r as resolvePollMaxSelections } from "./polls-C-v11_tu.mjs";
import { h as resolveStorePath } from "./session-store-runtime-DhcFNaWV.mjs";
import "./channel-inbound-X7KrQT_y.mjs";
import "./runtime-config-snapshot-Bm2YKbTW.mjs";
import { t as resolveReactionMessageId } from "./channel-actions-BjxmEiuN.mjs";
import { a as resolveDefaultTelegramAccountId, c as resolveTelegramPollActionGateState, o as resolveTelegramAccount, t as createTelegramActionGate } from "./accounts-ByNW1Cs3.mjs";
import { r as inspectTelegramAccount } from "./account-inspect-3RXAaivH.mjs";
import { c as resolveTelegramTargetChatType, o as normalizeTelegramOutboundTarget, s as parseTelegramTarget } from "./topic-conversation-BlxRQJEK.mjs";
import { r as resolveTelegramInlineButtonsScope } from "./inline-buttons-CjVgT32H.mjs";
import { t as rejectTelegramNativeButtonParams } from "./native-button-params-CIR-Zlcc.mjs";
import { t as resolveTelegramReactionLevel } from "./reaction-level-CEZmt52d.mjs";
import { x as resolveTelegramStreamMode } from "./helpers-Cx99qZMj.mjs";
import { t as resolveTelegramAccountOwnerAgentId } from "./account-owner-CELLJV4K.mjs";
import { i as resolveTelegramButtonsFromParams, n as buildTelegramControlDegradation, t as appendTelegramDroppedControlFallback } from "./button-types-BUjE4RHp.mjs";
import { n as resolveTelegramInteractiveTextFallback } from "./interactive-fallback-D7FqlWWt.mjs";
import { i as getCacheStats, o as searchStickers } from "./sticker-cache-Hh627Mws.mjs";
import { A as getTelegramAllowedReactions, C as editMessageReplyMarkupTelegram, D as editForumTopicTelegram, E as createForumTopicTelegram, F as TELEGRAM_SUPPORTED_REACTION_EMOJI_LIST, M as reactMessageTelegram, Q as hasProviderObservedTelegramThreadBinding, Z as createTelegramMessageCache, d as sendMessageTelegram, j as pinMessageTelegram, k as deleteMessageTelegram, n as sendStickerTelegram, t as sendPollTelegram, w as editMessageTelegram } from "./send-Cox8AAme.mjs";
import { p as resolveTelegramMessageCacheScope } from "./sent-message-cache.legacy-state-Ckozzcje.mjs";
import { t as resolveTelegramPollVisibility } from "./poll-visibility-Ds4ydsWS.mjs";
import { a as readTelegramHistory, i as isTelegramHistorySenderAllowed, n as telegramInboundEventDelivery, r as isTelegramHistoryNodeAllowed, t as renderTelegramProgressDraftPreview } from "./progress-draft-preview-DmmR0JX2.mjs";
import { o as resolveTopicNameCacheScope, s as updateTopicName } from "./topic-name-cache-DVMmy0yC.mjs";
//#region extensions/telegram/src/action-params.ts
const TELEGRAM_FORUM_TOPIC_ICON_COLORS = [
	7322096,
	16766590,
	13338331,
	9367192,
	16749490,
	16478047
];
function readTelegramForumTopicIconColor(params) {
	const iconColor = readPositiveIntegerParam(params, "iconColor", { message: "iconColor must be one of Telegram's supported forum topic colors." });
	if (iconColor == null) return;
	const supportedColor = TELEGRAM_FORUM_TOPIC_ICON_COLORS.find((color) => color === iconColor);
	if (supportedColor === void 0) throw new Error("iconColor must be one of Telegram's supported forum topic colors.");
	return supportedColor;
}
function readTelegramChatId(params) {
	return readStringOrNumberParam(params, "chatId") ?? readStringOrNumberParam(params, "channelId") ?? readStringOrNumberParam(params, "to", { required: true });
}
function readTelegramThreadId(params) {
	return readPositiveIntegerParam(params, "messageThreadId", { message: "messageThreadId must be a positive integer." }) ?? readPositiveIntegerParam(params, "threadId", { message: "threadId must be a positive integer." });
}
function readTelegramReplyToMessageId(params) {
	return readPositiveIntegerParam(params, "replyToMessageId", { message: "replyToMessageId must be a positive integer." }) ?? readPositiveIntegerParam(params, "replyTo", { message: "replyTo must be a positive integer." });
}
function pushTelegramMediaUrl(mediaUrls, seen, value) {
	if (typeof value !== "string") return;
	const normalized = value.trim();
	if (!normalized || seen.has(normalized)) return;
	seen.add(normalized);
	mediaUrls.push(normalized);
}
function readTelegramSendMediaUrls(params) {
	const mediaUrls = [];
	const seen = /* @__PURE__ */ new Set();
	pushTelegramMediaUrl(mediaUrls, seen, params.mediaUrl);
	pushTelegramMediaUrl(mediaUrls, seen, params.media);
	pushTelegramMediaUrl(mediaUrls, seen, params.path);
	pushTelegramMediaUrl(mediaUrls, seen, params.filePath);
	pushTelegramMediaUrl(mediaUrls, seen, params.fileUrl);
	if (Array.isArray(params.mediaUrls)) for (const mediaUrl of params.mediaUrls) pushTelegramMediaUrl(mediaUrls, seen, mediaUrl);
	if (Array.isArray(params.attachments)) for (const attachment of params.attachments) {
		if (!isRecord(attachment)) continue;
		pushTelegramMediaUrl(mediaUrls, seen, attachment.media);
		pushTelegramMediaUrl(mediaUrls, seen, attachment.mediaUrl);
		pushTelegramMediaUrl(mediaUrls, seen, attachment.path);
		pushTelegramMediaUrl(mediaUrls, seen, attachment.filePath);
		pushTelegramMediaUrl(mediaUrls, seen, attachment.fileUrl);
		pushTelegramMediaUrl(mediaUrls, seen, attachment.url);
	}
	return mediaUrls;
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
	const cache = createTelegramMessageCache({ scope: resolveTelegramMessageCacheScope(resolveStorePath(currentConfig.session?.store, { agentId: resolveTelegramAccountOwnerAgentId({
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
function rejectUnboundTopicMutation() {
	throw new Error(TOPIC_BINDING_ERROR);
}
function resolveCurrentTelegramConversation(toolContext, chatId) {
	if (toolContext?.currentChannelProvider?.trim().toLowerCase() !== "telegram") return {
		hasThreadContext: false,
		matchesChat: false
	};
	const targets = [toolContext.currentChannelId, toolContext.currentMessagingTarget].filter((value) => typeof value === "string" && Boolean(value.trim()));
	const parsedTargets = targets.map((value) => parseTelegramTarget(value));
	const threadIds = [...parsedTargets.map((target) => target.messageThreadId), parseStrictPositiveInteger(toolContext.currentThreadTs)].filter((value) => value !== void 0);
	const threadId = threadIds[0];
	const matchesChat = targets.length > 0 && parsedTargets.every((target) => target.chatId === chatId) && (threadId === void 0 || threadIds.every((value) => value === threadId));
	return {
		hasThreadContext: threadIds.length > 0,
		matchesChat,
		...threadId !== void 0 ? { threadId } : {}
	};
}
function resolveMatchingTelegramRequesterAccount(params) {
	const accountId = normalizeOptionalAccountId(params.accountId ?? resolveDefaultTelegramAccountId(params.cfg));
	const requesterAccountId = normalizeOptionalAccountId(params.context?.requesterAccountId);
	return accountId && requesterAccountId && normalizeAccountId(accountId) === normalizeAccountId(requesterAccountId) ? accountId : void 0;
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
	if (!selectedAccountId || !currentConversation.matchesChat) return rejectUnboundTopicMutation();
	const threadId = target.messageThreadId ?? currentConversation.threadId;
	if (threadId === void 0 && !currentConversation.hasThreadContext) return target.chatId;
	if (threadId === void 0 || currentConversation.threadId !== threadId) return rejectUnboundTopicMutation();
	if (parseStrictPositiveInteger(params.context?.toolContext?.currentMessageId) === params.messageId) return target.chatId;
	const cached = await createTelegramMessageCache({ scope: resolveTelegramMessageCacheScope(resolveStorePath(params.cfg.session?.store, { agentId: resolveTelegramAccountOwnerAgentId({
		cfg: params.cfg,
		accountId: selectedAccountId
	}) })) }).get({
		accountId: selectedAccountId,
		chatId: target.chatId,
		messageId: String(params.messageId)
	});
	if (!hasProviderObservedTelegramThreadBinding(cached, threadId)) return rejectUnboundTopicMutation();
	return target.chatId;
}
//#endregion
//#region extensions/telegram/src/action-runtime.ts
const telegramActionRuntime = {
	createForumTopicTelegram,
	deleteMessageTelegram,
	editForumTopicTelegram,
	editMessageReplyMarkupTelegram,
	editMessageTelegram,
	getTelegramAllowedReactions,
	getCacheStats,
	pinMessageTelegram,
	reactMessageTelegram,
	searchStickers,
	sendDurableMessageBatch,
	sendMessageTelegram,
	sendPollTelegram,
	sendStickerTelegram
};
const TELEGRAM_EMOJI_LIST_LIMIT = 100;
const TELEGRAM_REACTION_HINT_LIMIT = 20;
const TELEGRAM_ACTION_ALIASES = {
	createForumTopic: "createForumTopic",
	delete: "deleteMessage",
	deleteMessage: "deleteMessage",
	edit: "editMessage",
	editForumTopic: "editForumTopic",
	editMessage: "editMessage",
	"emoji-list": "emoji-list",
	poll: "poll",
	react: "react",
	read: "read",
	searchSticker: "searchSticker",
	send: "sendMessage",
	sendMessage: "sendMessage",
	sendSticker: "sendSticker",
	sticker: "sendSticker",
	stickerCacheStats: "stickerCacheStats",
	"sticker-search": "searchSticker",
	"topic-create": "createForumTopic",
	"topic-edit": "editForumTopic"
};
function normalizeTelegramActionName(action) {
	const normalized = TELEGRAM_ACTION_ALIASES[action];
	if (!normalized) throw new Error(`Unsupported Telegram action: ${action}`);
	return normalized;
}
function resolveActionTopicNameCacheScope(cfg, accountId) {
	const resolvedAccountId = accountId ?? resolveDefaultTelegramAccountId(cfg);
	const storePath = resolveStorePath(cfg.session?.store, { agentId: resolveTelegramAccountOwnerAgentId({
		cfg,
		accountId: resolvedAccountId
	}) });
	return resolveTopicNameCacheScope(storePath);
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
	let content = (presentationText?.trim() ? presentationText : void 0) ?? explicitContent ?? (interactiveText?.trim() ? interactiveText : void 0);
	if ((content == null || content.trim().length === 0) && !params.mediaUrl && params.hasButtons) {
		const fallback = presentationText?.trim() ? presentationText : interactiveText;
		if (fallback?.trim()) content = fallback;
	}
	if (content == null && !params.mediaUrl && !params.hasButtons && !params.hasLocation) throw new Error("content required.");
	return {
		content: content ?? "",
		hasExplicitContent: explicitContent != null
	};
}
function normalizeTelegramDeliveryPin(params) {
	const delivery = params.delivery;
	const pin = delivery && typeof delivery === "object" && !Array.isArray(delivery) ? delivery.pin : params.pin === true ? true : void 0;
	if (pin === true) return { enabled: true };
	if (!pin || typeof pin !== "object" || Array.isArray(pin)) return;
	const raw = pin;
	if (raw.enabled !== true) return;
	return {
		enabled: true,
		...raw.notify === true ? { notify: true } : {},
		...raw.required === true ? { required: true } : {}
	};
}
function buildTelegramActionSendPayload(params) {
	const telegramData = params.buttons || params.quoteText ? {
		...params.buttons ? { buttons: params.buttons } : {},
		...params.quoteText ? { quoteText: params.quoteText } : {}
	} : void 0;
	return {
		text: params.content,
		...params.mediaUrls.length > 0 ? { mediaUrls: params.mediaUrls } : {},
		...params.asVoice === true ? { audioAsVoice: true } : {},
		...params.asVideoNote === true ? { videoAsNote: true } : {},
		...params.location ? { location: params.location } : {},
		...params.pin ? { delivery: { pin: params.pin } } : {},
		...telegramData ? { channelData: { telegram: telegramData } } : {}
	};
}
function getLastDurableTelegramActionResult(result) {
	const lastResult = result.results.at(-1);
	const receipt = result.receipt;
	return {
		messageId: lastResult?.messageId ?? receipt.primaryPlatformMessageId ?? receipt.platformMessageIds.at(-1),
		chatId: lastResult?.target?.kind === "chat" ? lastResult.target.id : void 0,
		receipt: {
			threadId: receipt.threadId,
			replyToId: receipt.replyToId
		}
	};
}
async function describeTelegramAllowedReactionSample(params) {
	const reactions = await telegramActionRuntime.getTelegramAllowedReactions(params.chatId, {
		cfg: params.cfg,
		token: params.token,
		accountId: params.accountId
	}).catch(() => void 0);
	if (reactions === void 0) return "";
	const allowed = reactions ?? TELEGRAM_SUPPORTED_REACTION_EMOJI_LIST.map((emoji) => ({
		type: "emoji",
		emoji
	}));
	const emojis = allowed.filter((reaction) => reaction.type === "emoji").slice(0, TELEGRAM_REACTION_HINT_LIMIT).map((reaction) => reaction.emoji);
	const customIds = allowed.filter((reaction) => reaction.type === "custom_emoji").slice(0, TELEGRAM_REACTION_HINT_LIMIT - emojis.length).map((reaction) => reaction.custom_emoji_id);
	const customSample = customIds.length ? `numeric custom IDs ${customIds.join(", ")}` : "";
	const sample = [emojis.join(" "), customSample].filter(Boolean).join("; ");
	return sample ? ` This chat allows: ${sample}.` : "";
}
async function handleTelegramAction(params, cfg, options) {
	rejectTelegramNativeButtonParams(params);
	const { action, accountId } = {
		action: normalizeTelegramActionName(readToolStringParam(params, "action", { required: true })),
		accountId: readToolStringParam(params, "accountId")
	};
	const isActionEnabled = createTelegramActionGate({
		cfg,
		accountId
	});
	const notifyVisibleOutboundSuccess = (to, messageThreadId) => {
		telegramInboundEventDelivery.notify({
			sessionKey: options?.sessionKey ?? void 0,
			to: formatTelegramDeliveryTarget(to, messageThreadId),
			accountId,
			inboundEventKind: options?.inboundEventKind
		});
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
		const token = resolveTelegramToken(cfg, { accountId }).token;
		if (!token) throw new Error("Telegram bot token missing. Set TELEGRAM_BOT_TOKEN or channels.telegram.botToken.");
		const limit = Math.min(readPositiveIntegerParam(params, "limit", { message: "limit must be a positive integer." }) ?? TELEGRAM_EMOJI_LIST_LIMIT, TELEGRAM_EMOJI_LIST_LIMIT);
		const allowed = await telegramActionRuntime.getTelegramAllowedReactions(chatId, {
			cfg,
			token,
			accountId: accountId ?? void 0
		});
		const reactions = allowed ?? TELEGRAM_SUPPORTED_REACTION_EMOJI_LIST.map((emoji) => ({
			type: "emoji",
			emoji
		}));
		return jsonResult({
			ok: true,
			emojis: reactions.slice(0, limit).map((reaction) => reaction.type === "emoji" ? {
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
		const reactionLevelInfo = resolveTelegramReactionLevel({
			cfg,
			accountId: accountId ?? void 0
		});
		if (!reactionLevelInfo.agentReactionsEnabled) return jsonResult({
			ok: false,
			reason: "disabled",
			hint: `Telegram agent reactions disabled (reactionLevel="${reactionLevelInfo.level}"). Do not retry.`
		});
		if (!isActionEnabled("reactions")) return jsonResult({
			ok: false,
			reason: "disabled",
			hint: "Telegram reactions are disabled via actions.reactions. Do not retry."
		});
		const chatId = readTelegramChatId(params);
		let explicitMessageId;
		try {
			explicitMessageId = readPositiveIntegerParam(params, "messageId", { message: "messageId must be a positive integer." });
		} catch {
			return jsonResult({
				ok: false,
				reason: "missing_message_id",
				hint: "Telegram reaction requires a valid messageId (or inbound context fallback). Do not retry."
			});
		}
		const messageId = explicitMessageId ?? resolveReactionMessageId({ args: params });
		if (typeof messageId !== "number" || !Number.isFinite(messageId) || messageId <= 0) return jsonResult({
			ok: false,
			reason: "missing_message_id",
			hint: "Telegram reaction requires a valid messageId (or inbound context fallback). Do not retry."
		});
		const { emoji, remove, isEmpty } = readReactionParams(params, { removeErrorMessage: "Emoji is required to remove a Telegram reaction." });
		const token = resolveTelegramToken(cfg, { accountId }).token;
		if (!token) return jsonResult({
			ok: false,
			reason: "missing_token",
			hint: "Telegram bot token missing. Do not retry."
		});
		let reactionResult;
		let authorizedChatId = chatId ?? "";
		try {
			authorizedChatId = await resolveTelegramMessageMutationChatId({
				chatId: chatId ?? "",
				messageId,
				cfg,
				accountId,
				context: options
			});
			reactionResult = await telegramActionRuntime.reactMessageTelegram(authorizedChatId, messageId ?? 0, emoji ?? "", {
				cfg,
				token,
				remove,
				accountId: accountId ?? void 0,
				gatewayClientScopes: options?.gatewayClientScopes
			});
		} catch (err) {
			const isInvalid = String(err).includes("REACTION_INVALID");
			return jsonResult({
				ok: false,
				reason: isInvalid ? "REACTION_INVALID" : "error",
				emoji,
				hint: isInvalid ? `This reaction is unavailable.${await describeTelegramAllowedReactionSample({
					chatId: authorizedChatId,
					cfg,
					token,
					accountId: accountId ?? void 0
				})}` : "Reaction failed. Do not retry."
			});
		}
		if (!reactionResult.ok) {
			const allowedHint = await describeTelegramAllowedReactionSample({
				chatId: authorizedChatId,
				cfg,
				token,
				accountId: accountId ?? void 0
			});
			return jsonResult({
				ok: false,
				warning: `${reactionResult.warning}${allowedHint}`,
				...remove || isEmpty ? { removed: true } : { added: emoji }
			});
		}
		if (!remove && !isEmpty) return jsonResult({
			ok: true,
			added: emoji
		});
		return jsonResult({
			ok: true,
			removed: true
		});
	}
	if (action === "sendMessage") {
		if (!isActionEnabled("sendMessage")) throw new Error("Telegram sendMessage is disabled.");
		const to = normalizeTelegramOutboundTarget(readToolStringParam(params, "to", { required: true }));
		const mediaUrls = readTelegramSendMediaUrls(params);
		const firstMediaUrl = mediaUrls[0];
		const location = normalizeOutboundLocation(params.location);
		const presentation = normalizeMessagePresentation(params.presentation);
		const droppedControls = [];
		const buttons = resolveTelegramButtonsFromParams(params, presentation, {
			allowWebAppButtons: resolveTelegramTargetChatType(to) === "direct",
			onDroppedControl: (control) => droppedControls.push(control)
		});
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
			const inlineButtonsScope = resolveTelegramInlineButtonsScope({
				cfg,
				accountId: accountId ?? void 0
			});
			if (inlineButtonsScope === "off") throw new Error("Telegram inline buttons are disabled. Set channels.telegram.capabilities.inlineButtons to \"dm\", \"group\", \"all\", or \"allowlist\".");
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
		if (!resolveTelegramToken(cfg, { accountId }).token) throw new Error("Telegram bot token missing. Set TELEGRAM_BOT_TOKEN or channels.telegram.botToken.");
		const sendOptions = {
			cfg,
			accountId: accountId ?? void 0,
			gatewayClientScopes: options?.gatewayClientScopes,
			replyToMessageId: replyToMessageId ?? void 0,
			messageThreadId: messageThreadId ?? void 0,
			quoteText: quoteText ?? void 0,
			asVoice: readBooleanParam(params, "asVoice"),
			asVideoNote,
			silent: readBooleanParam(params, "silent"),
			forceDocument: readBooleanParam(params, "forceDocument") ?? readBooleanParam(params, "asDocument") ?? false
		};
		const payload = buildTelegramActionSendPayload({
			content,
			mediaUrls,
			asVoice: sendOptions.asVoice,
			asVideoNote: sendOptions.asVideoNote,
			location,
			pin: normalizeTelegramDeliveryPin(params),
			buttons,
			quoteText
		});
		const mediaAccess = options?.mediaAccess ?? (options?.mediaLocalRoots || options?.mediaReadFile ? {
			...options.mediaLocalRoots ? { localRoots: options.mediaLocalRoots } : {},
			...options.mediaReadFile ? { readFile: options.mediaReadFile } : {}
		} : void 0);
		const outboundSession = buildOutboundSessionContext({
			cfg,
			sessionKey: options?.sessionKey,
			requesterAccountId: accountId
		});
		const durableResult = await telegramActionRuntime.sendDurableMessageBatch({
			cfg,
			channel: "telegram",
			to,
			accountId: accountId ?? void 0,
			payloads: [payload],
			...options?.reply ? { reply: options.reply } : { replyToId: replyToMessageId == null ? void 0 : String(replyToMessageId) },
			threadId: messageThreadId,
			forceDocument: sendOptions.forceDocument,
			silent: sendOptions.silent,
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
		const result = getLastDurableTelegramActionResult(durableResult);
		notifyVisibleOutboundSuccess(to, messageThreadId);
		return jsonResult({
			ok: true,
			messageId: result.messageId,
			chatId: result.chatId,
			receipt: result.receipt,
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
		const durationSeconds = readPositiveIntegerParam(params, "durationSeconds", { message: "durationSeconds must be a positive integer." }) ?? readPositiveIntegerParam(params, "pollDurationSeconds", { message: "pollDurationSeconds must be a positive integer." });
		const durationHours = readPositiveIntegerParam(params, "durationHours", { message: "durationHours must be a positive integer." }) ?? readPositiveIntegerParam(params, "pollDurationHours", { message: "pollDurationHours must be a positive integer." });
		const replyToMessageId = readTelegramReplyToMessageId(params);
		const messageThreadId = readTelegramThreadId(params);
		const isAnonymous = readBooleanParam(params, "isAnonymous") ?? resolveTelegramPollVisibility({
			pollAnonymous: readBooleanParam(params, "pollAnonymous"),
			pollPublic: readBooleanParam(params, "pollPublic")
		});
		const silent = readBooleanParam(params, "silent");
		const token = resolveTelegramToken(cfg, { accountId }).token;
		if (!token) throw new Error("Telegram bot token missing. Set TELEGRAM_BOT_TOKEN or channels.telegram.botToken.");
		const result = await telegramActionRuntime.sendPollTelegram(to, {
			question,
			options: answers,
			maxSelections: resolvePollMaxSelections(answers.length, allowMultiselect ?? false),
			durationSeconds: durationSeconds ?? void 0,
			durationHours: durationHours ?? void 0
		}, {
			cfg,
			token,
			accountId: accountId ?? void 0,
			replyToMessageId: replyToMessageId ?? void 0,
			messageThreadId: messageThreadId ?? void 0,
			isAnonymous: isAnonymous ?? void 0,
			silent: silent ?? void 0,
			gatewayClientScopes: options?.gatewayClientScopes
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
	if (action === "deleteMessage") {
		if (!isActionEnabled("deleteMessage")) throw new Error("Telegram deleteMessage is disabled.");
		const chatId = readTelegramChatId(params);
		const messageId = readPositiveIntegerParam(params, "messageId", { message: "messageId must be a positive integer." });
		if (messageId === void 0) throw new Error("messageId required");
		const authorizedChatId = await resolveTelegramMessageMutationChatId({
			chatId: chatId ?? "",
			messageId,
			cfg,
			accountId,
			context: options
		});
		const result = await telegramActionRuntime.deleteMessageTelegram(authorizedChatId, messageId, {
			cfg,
			accountId: accountId ?? void 0,
			gatewayClientScopes: options?.gatewayClientScopes,
			assertPlatformSendAuthorized: options?.assertDirectAdapterHandoff
		});
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
	if (action === "editMessage") {
		if (!isActionEnabled("editMessage")) throw new Error("Telegram editMessage is disabled.");
		const chatId = readTelegramChatId(params);
		const messageId = readPositiveIntegerParam(params, "messageId", { message: "messageId must be a positive integer." });
		if (messageId === void 0) throw new Error("messageId required");
		const authorizedChatId = await resolveTelegramMessageMutationChatId({
			chatId: chatId ?? "",
			messageId,
			cfg,
			accountId,
			context: options
		});
		let content = readToolStringParam(params, "content", { allowEmpty: false }) ?? readToolStringParam(params, "message", { allowEmpty: false });
		let caption = readToolStringParam(params, "caption", { allowEmpty: true });
		let progressPreview;
		if (options?.progressSnapshot) {
			const telegramCfg = resolveTelegramAccount({
				cfg,
				accountId
			}).config;
			const streamMode = resolveTelegramStreamMode(telegramCfg);
			progressPreview = renderTelegramProgressDraftPreview(options.progressSnapshot, {
				richMessages: telegramCfg.richMessages === true,
				toolProgress: resolveChannelStreamingPreviewToolProgress(telegramCfg, streamMode !== "progress", streamMode),
				maxLines: resolveChannelProgressDraftMaxLines(telegramCfg),
				maxLineChars: resolveChannelProgressDraftMaxLineChars(telegramCfg)
			});
			content = progressPreview.text;
		}
		const droppedControls = [];
		const buttons = resolveTelegramButtonsFromParams(params, void 0, {
			allowWebAppButtons: resolveTelegramTargetChatType(chatId ?? "") === "direct",
			onDroppedControl: (control) => droppedControls.push(control)
		});
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
		if (buttons !== void 0) {
			if (resolveTelegramInlineButtonsScope({
				cfg,
				accountId: accountId ?? void 0
			}) === "off") throw new Error("Telegram inline buttons are disabled. Set channels.telegram.capabilities.inlineButtons to \"dm\", \"group\", \"all\", or \"allowlist\".");
		}
		const token = resolveTelegramToken(cfg, { accountId }).token;
		if (!token) throw new Error("Telegram bot token missing. Set TELEGRAM_BOT_TOKEN or channels.telegram.botToken.");
		if (content == null && caption == null && buttons !== void 0) {
			const result = await telegramActionRuntime.editMessageReplyMarkupTelegram(authorizedChatId, messageId ?? 0, buttons, {
				cfg,
				token,
				accountId: accountId ?? void 0,
				gatewayClientScopes: options?.gatewayClientScopes,
				assertPlatformSendAuthorized: options?.assertDirectAdapterHandoff
			});
			return jsonResult({
				ok: true,
				messageId: result.messageId,
				chatId: result.chatId,
				...buildTelegramControlDegradation(droppedControls, false)
			});
		}
		const result = await telegramActionRuntime.editMessageTelegram(authorizedChatId, messageId ?? 0, progressPreview?.parseMode === "HTML" ? progressPreview.text.replaceAll("<br>", "\n") : progressPreview?.text ?? caption ?? content ?? "", {
			cfg,
			token,
			accountId: accountId ?? void 0,
			buttons,
			editMode: progressPreview ? "text" : caption != null ? "caption" : "auto",
			...progressPreview ? {
				textMode: progressPreview.parseMode === "HTML" ? "html" : "markdown",
				richMessage: progressPreview.richMessage
			} : {},
			gatewayClientScopes: options?.gatewayClientScopes,
			assertPlatformSendAuthorized: options?.assertDirectAdapterHandoff
		});
		return jsonResult({
			ok: true,
			messageId: result.messageId,
			chatId: result.chatId,
			...buildTelegramControlDegradation(droppedControls, true)
		});
	}
	if (action === "sendSticker") {
		if (!isActionEnabled("sticker", false)) throw new Error("Telegram sticker actions are disabled. Set channels.telegram.actions.sticker to true.");
		const to = readToolStringParam(params, "to") ?? readToolStringParam(params, "target", { required: true });
		const fileId = readToolStringParam(params, "fileId") ?? readStringArrayParam(params, "stickerId")?.[0];
		if (!fileId) throw new Error("fileId is required.");
		const replyToMessageId = readTelegramReplyToMessageId(params);
		const messageThreadId = readTelegramThreadId(params);
		const token = resolveTelegramToken(cfg, { accountId }).token;
		if (!token) throw new Error("Telegram bot token missing. Set TELEGRAM_BOT_TOKEN or channels.telegram.botToken.");
		const result = await telegramActionRuntime.sendStickerTelegram(to, fileId, {
			cfg,
			token,
			accountId: accountId ?? void 0,
			replyToMessageId: replyToMessageId ?? void 0,
			messageThreadId: messageThreadId ?? void 0,
			gatewayClientScopes: options?.gatewayClientScopes
		});
		notifyVisibleOutboundSuccess(to, messageThreadId);
		return jsonResult({
			ok: true,
			messageId: result.messageId,
			chatId: result.chatId
		});
	}
	if (action === "searchSticker") {
		if (!isActionEnabled("sticker", false)) throw new Error("Telegram sticker actions are disabled. Set channels.telegram.actions.sticker to true.");
		const query = readToolStringParam(params, "query", { required: true });
		const limit = readPositiveIntegerParam(params, "limit", { message: "limit must be a positive integer." }) ?? 5;
		const results = await telegramActionRuntime.searchStickers(query, limit);
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
		const stats = await telegramActionRuntime.getCacheStats();
		return jsonResult({
			ok: true,
			...stats
		});
	}
	if (action === "createForumTopic") {
		if (!isActionEnabled("createForumTopic")) throw new Error("Telegram createForumTopic is disabled.");
		const chatId = readTelegramChatId(params);
		const name = readToolStringParam(params, "name") ?? readToolStringParam(params, "threadName", {
			required: true,
			label: "name"
		});
		const iconColor = readTelegramForumTopicIconColor(params);
		const iconCustomEmojiId = readToolStringParam(params, "iconCustomEmojiId");
		const token = resolveTelegramToken(cfg, { accountId }).token;
		if (!token) throw new Error("Telegram bot token missing. Set TELEGRAM_BOT_TOKEN or channels.telegram.botToken.");
		const result = await telegramActionRuntime.createForumTopicTelegram(chatId ?? "", name, {
			cfg,
			token,
			accountId: accountId ?? void 0,
			iconColor,
			iconCustomEmojiId: iconCustomEmojiId ?? void 0,
			gatewayClientScopes: options?.gatewayClientScopes
		});
		if (result.topicId != null && result.chatId) await updateTopicName(result.chatId, result.topicId, {
			name,
			...iconColor != null ? { iconColor } : {},
			...iconCustomEmojiId ? { iconCustomEmojiId } : {}
		}, resolveActionTopicNameCacheScope(cfg, accountId)).catch(() => {});
		return jsonResult({
			ok: true,
			topicId: result.topicId,
			name: result.name,
			chatId: result.chatId
		});
	}
	if (action === "editForumTopic") {
		if (!isActionEnabled("editForumTopic")) throw new Error("Telegram editForumTopic is disabled.");
		const chatId = readTelegramChatId(params);
		const messageThreadId = readTelegramThreadId(params);
		if (typeof messageThreadId !== "number") throw new Error("messageThreadId or threadId is required.");
		const name = readToolStringParam(params, "name") ?? readToolStringParam(params, "threadName");
		const iconCustomEmojiId = readToolStringParam(params, "iconCustomEmojiId");
		const token = resolveTelegramToken(cfg, { accountId }).token;
		if (!token) throw new Error("Telegram bot token missing. Set TELEGRAM_BOT_TOKEN or channels.telegram.botToken.");
		const result = await telegramActionRuntime.editForumTopicTelegram(chatId ?? "", messageThreadId, {
			cfg,
			token,
			accountId: accountId ?? void 0,
			name: name ?? void 0,
			iconCustomEmojiId: iconCustomEmojiId ?? void 0,
			gatewayClientScopes: options?.gatewayClientScopes
		});
		if (result.chatId) {
			const patch = {};
			if (name) patch.name = name;
			if (iconCustomEmojiId) patch.iconCustomEmojiId = iconCustomEmojiId;
			if (Object.keys(patch).length > 0) await updateTopicName(result.chatId, result.messageThreadId, patch, resolveActionTopicNameCacheScope(cfg, accountId)).catch(() => {});
		}
		return jsonResult(result);
	}
	throw new Error(`Unsupported Telegram action: ${String(action)}`);
}
//#endregion
export { handleTelegramAction, telegramActionRuntime };
