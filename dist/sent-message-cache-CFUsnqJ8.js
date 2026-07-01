import { a as normalizeLowercaseStringOrEmpty, c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import { C as resolveExpiresAtMsFromDurationMs, b as parseStrictPositiveInteger, o as asDateTimestampMs, v as parseStrictInteger, y as parseStrictNonNegativeInteger } from "./number-coercion-CJQ8TR--.js";
import { _ as uniqueStrings } from "./string-normalization-CRyoFBPt.js";
import { c as isRecord } from "./utils-BApvfmPs.js";
import { t as createSubsystemLogger } from "./subsystem-yNfG7O3v.js";
import { n as normalizeAccountId } from "./account-id-5IgE9UKY.js";
import { i as logVerbose } from "./globals-BWmHKFNH.js";
import { d as resolveStorePath } from "./paths-CHZBIGhF.js";
import { a as parseAccessGroupAllowFromEntry, i as mergeDmAllowFromSources, n as firstDefined, r as isSenderIdAllowed } from "./allow-from-o-cfFFcK.js";
import "./number-runtime-DBLVDypr.js";
import "./runtime-env-oOti2yy7.js";
import "./security-runtime-ZGC3cmUc.js";
import { t as expandAllowFromWithAccessGroups } from "./access-groups-QbJVwfug.js";
import "./string-coerce-runtime-BiZzULo_.js";
import { t as resolveCommandAuthorization } from "./command-auth-BBZwnH2N.js";
import "./routing-DGrdyZ4S.js";
import { a as readChannelAllowFromStore } from "./pairing-store-uQh6I0SL.js";
import "./allow-from-Do0efkdl.js";
import "./session-store-runtime-BlqMkGtn.js";
import "./conversation-runtime-BHKHaOAa.js";
import "./command-auth-native-FMtoV7Ux.js";
import { o as formatLocationText } from "./channel-inbound-Bc91Wbye.js";
import { n as getTelegramRuntime, t as getOptionalTelegramRuntime } from "./runtime-B_f_VNpK.js";
import { t as resolveTelegramPreviewStreamMode } from "./preview-streaming-dN_t3O3h.js";
import fs from "node:fs";
import { createHash } from "node:crypto";
//#region extensions/telegram/src/outbound-params.ts
function parseIntegerId(value) {
	return parseStrictInteger(value);
}
function parseTelegramMessageThreadId(value) {
	return parseStrictNonNegativeInteger(value);
}
function normalizeTelegramReplyToMessageId(value) {
	if (typeof value !== "string") return parseIntegerId(value);
	const trimmed = value.trim();
	return trimmed ? parseIntegerId(trimmed) : void 0;
}
function parseTelegramReplyToMessageId(replyToId) {
	return normalizeTelegramReplyToMessageId(replyToId);
}
function parseTelegramThreadId(threadId) {
	if (threadId == null) return;
	if (typeof threadId === "number") return parseIntegerId(threadId);
	const trimmed = threadId.trim();
	if (!trimmed) return;
	const topicMatch = /^-?\d+:topic:(\d+)$/.exec(trimmed);
	if (topicMatch) return parseIntegerId(topicMatch[1]);
	const scopedMatch = /^-?\d+:(-?\d+)$/.exec(trimmed);
	return parseIntegerId(scopedMatch ? scopedMatch[1] : trimmed);
}
//#endregion
//#region extensions/telegram/src/bot-access.ts
const warnedInvalidEntries = /* @__PURE__ */ new Set();
const log = createSubsystemLogger("telegram/bot-access");
function warnInvalidAllowFromEntries(entries) {
	if (process.env.VITEST || false) return;
	for (const entry of entries) {
		if (warnedInvalidEntries.has(entry)) continue;
		warnedInvalidEntries.add(entry);
		log.warn([
			"Invalid allowFrom entry:",
			JSON.stringify(entry),
			"- allowFrom/groupAllowFrom authorization expects numeric Telegram sender user IDs only.",
			"To allow a Telegram group or supergroup, add its negative chat ID under \"channels.telegram.groups\" instead.",
			"If you had \"@username\" entries, re-run setup (it resolves @username to IDs) or replace them manually."
		].join(" "));
	}
}
const normalizeAllowFrom = (list) => {
	const entries = (list ?? []).map((value) => normalizeOptionalString(String(value)) ?? "").filter(Boolean);
	const hasWildcard = entries.includes("*");
	const normalized = entries.filter((value) => value !== "*").map((value) => value.replace(/^(telegram|tg):/i, ""));
	const invalidEntries = normalized.filter((value) => !/^\d+$/.test(value));
	if (invalidEntries.length > 0) warnInvalidAllowFromEntries(uniqueStrings(invalidEntries));
	return {
		entries: normalized.filter((value) => /^\d+$/.test(value)),
		hasWildcard,
		hasEntries: entries.length > 0,
		invalidEntries
	};
};
const normalizeDmAllowFromWithStore = (params) => normalizeAllowFrom(mergeDmAllowFromSources(params));
function resolveTelegramEffectiveDmPolicy(params) {
	if (!params.isGroup && params.groupConfig && "dmPolicy" in params.groupConfig) return params.groupConfig.dmPolicy ?? params.dmPolicy ?? "pairing";
	return params.dmPolicy ?? "pairing";
}
const isSenderAllowed = (params) => {
	const { allow, senderId } = params;
	return isSenderIdAllowed(allow, senderId, true);
};
//#endregion
//#region extensions/telegram/src/access-groups.ts
async function expandTelegramAllowFromWithAccessGroups(params) {
	const allowFrom = (params.allowFrom ?? []).map(String);
	const senderId = params.senderId?.trim() ?? "";
	const expanded = params.cfg && senderId ? await expandAllowFromWithAccessGroups({
		cfg: params.cfg,
		allowFrom,
		channel: "telegram",
		accountId: params.accountId ?? "default",
		senderId,
		isSenderAllowed: (candidateSenderId, allowEntries) => isSenderAllowed({
			allow: normalizeAllowFrom(allowEntries),
			senderId: candidateSenderId
		})
	}) : allowFrom;
	const originalEntries = new Set(allowFrom);
	return expanded.some((entry) => !originalEntries.has(entry)) ? expanded.filter((entry) => parseAccessGroupAllowFromEntry(entry) == null) : expanded;
}
async function resolveTelegramDmAllow(params) {
	const allowFrom = params.groupAllowOverride ?? params.allowFrom;
	const expandedAllowFrom = await expandTelegramAllowFromWithAccessGroups({
		cfg: params.cfg,
		allowFrom,
		accountId: params.accountId,
		senderId: params.senderId
	});
	return {
		allowFrom,
		expandedAllowFrom,
		effectiveAllow: normalizeDmAllowFromWithStore({
			allowFrom: expandedAllowFrom,
			storeAllowFrom: params.storeAllowFrom,
			dmPolicy: params.dmPolicy
		})
	};
}
//#endregion
//#region extensions/telegram/src/bot/body-helpers.ts
function buildSenderName(msg) {
	return [msg.from?.first_name, msg.from?.last_name].filter(Boolean).join(" ").trim() || msg.from?.username || void 0;
}
function resolveTelegramPrimaryMedia(msg) {
	if (!msg) return;
	const photo = msg.photo?.[msg.photo.length - 1];
	if (photo) return {
		placeholder: "<media:image>",
		fileRef: photo
	};
	if (msg.video) return {
		placeholder: "<media:video>",
		fileRef: msg.video
	};
	if (msg.video_note) return {
		placeholder: "<media:video>",
		fileRef: msg.video_note
	};
	if (msg.audio) return {
		placeholder: "<media:audio>",
		fileRef: msg.audio
	};
	if (msg.voice) return {
		placeholder: "<media:audio>",
		fileRef: msg.voice
	};
	if (msg.document) return {
		placeholder: "<media:document>",
		fileRef: msg.document
	};
	if (msg.sticker) return {
		placeholder: "<media:sticker>",
		fileRef: msg.sticker
	};
}
function resolveTelegramMediaPlaceholder(msg) {
	return resolveTelegramPrimaryMedia(msg)?.placeholder;
}
function buildSenderLabel(msg, senderId) {
	const name = buildSenderName(msg);
	const username = msg.from?.username ? `@${msg.from.username}` : void 0;
	let label = name;
	if (name && username) label = `${name} (${username})`;
	else if (!name && username) label = username;
	const fallbackId = (senderId != null ? normalizeOptionalString(String(senderId)) : void 0) ?? (msg.from?.id != null ? String(msg.from.id) : void 0);
	const idPart = fallbackId ? `id:${fallbackId}` : void 0;
	if (label && idPart) return `${label} ${idPart}`;
	if (label) return label;
	return idPart ?? "id:unknown";
}
const TELEGRAM_RICH_MESSAGE_PLACEHOLDER = "[unsupported Telegram rich_message received]";
function hasTelegramRichMessage(value) {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}
function resolveTelegramRichMessagePlaceholder(msg) {
	return hasTelegramRichMessage(msg.rich_message) ? TELEGRAM_RICH_MESSAGE_PLACEHOLDER : void 0;
}
function isBinaryContent(text) {
	for (let i = 0; i < text.length; i++) {
		const code = text.charCodeAt(i);
		if (code <= 31 && code !== 9 && code !== 10 && code !== 13) return true;
	}
	return false;
}
function resolveTelegramTextContent(text, caption) {
	const raw = typeof text === "string" ? text : typeof caption === "string" ? caption : "";
	return isBinaryContent(raw) ? "" : raw;
}
function getTelegramTextParts(msg) {
	const text = resolveTelegramTextContent(msg.text, msg.caption);
	return {
		text,
		entities: text ? msg.entities ?? msg.caption_entities ?? [] : []
	};
}
function isTelegramMentionWordChar(char) {
	return char != null && /[a-z0-9_]/i.test(char);
}
function hasStandaloneTelegramMention(text, mention) {
	let startIndex = 0;
	while (startIndex < text.length) {
		const idx = text.indexOf(mention, startIndex);
		if (idx === -1) return false;
		const prev = idx > 0 ? text[idx - 1] : void 0;
		const next = text[idx + mention.length];
		if (!isTelegramMentionWordChar(prev) && !isTelegramMentionWordChar(next)) return true;
		startIndex = idx + 1;
	}
	return false;
}
function isBotCommandAddressedToMention(command, mention) {
	const normalized = normalizeLowercaseStringOrEmpty(command);
	if (!normalized.startsWith("/") || !normalized.endsWith(mention)) return false;
	return normalized.lastIndexOf(mention) > 1;
}
function hasBotMention(msg, botUsername) {
	const { text, entities } = getTelegramTextParts(msg);
	const mention = normalizeLowercaseStringOrEmpty(`@${botUsername}`);
	if (hasStandaloneTelegramMention(normalizeLowercaseStringOrEmpty(text), mention)) return true;
	for (const ent of entities) {
		const slice = text.slice(ent.offset, ent.offset + ent.length);
		if (ent.type === "mention" && normalizeLowercaseStringOrEmpty(slice) === mention) return true;
		if (ent.type === "bot_command" && isBotCommandAddressedToMention(slice, mention)) return true;
	}
	return false;
}
const TELEGRAM_ENTITY_MARKDOWN_PRIORITY = {
	bold: 10,
	italic: 20,
	underline: 30,
	strikethrough: 40,
	spoiler: 50,
	text_link: 60,
	code: 70,
	pre: 80
};
function longestBacktickRun(text) {
	let longest = 0;
	let current = 0;
	for (const char of text) if (char === "`") {
		current += 1;
		longest = Math.max(longest, current);
	} else current = 0;
	return longest;
}
function markdownInlineCodeDelimiters(content) {
	const delimiter = "`".repeat(longestBacktickRun(content) + 1);
	if (content.startsWith(" ") || content.endsWith(" ")) return [`${delimiter} `, ` ${delimiter}`];
	return [delimiter, delimiter];
}
function markdownPreAffixes(entity, content) {
	const language = entity.language?.replace(/[\s`]+/g, "").trim();
	const fence = "`".repeat(Math.max(3, longestBacktickRun(content) + 1));
	return [language ? `${fence}${language}\n` : `${fence}\n`, content.endsWith("\n") ? fence : `\n${fence}`];
}
function markdownAffixesForTelegramEntity(entity, content) {
	switch (entity.type) {
		case "bold": return ["**", "**"];
		case "italic": return ["_", "_"];
		case "underline": return ["__", "__"];
		case "strikethrough": return ["~~", "~~"];
		case "spoiler": return ["||", "||"];
		case "code": return markdownInlineCodeDelimiters(content);
		case "pre": return markdownPreAffixes(entity, content);
		case "text_link": return entity.url ? ["[", `](${entity.url})`] : null;
		default: return null;
	}
}
function renderTelegramTextEntities(text, entities) {
	if (!text || !entities?.length) return text;
	const boundaries = /* @__PURE__ */ new Map();
	const addBoundary = (offset, boundary) => {
		boundaries.set(offset, [...boundaries.get(offset) ?? [], boundary]);
	};
	entities.forEach((entity, index) => {
		if (!Number.isInteger(entity.offset) || !Number.isInteger(entity.length) || entity.offset < 0 || entity.length <= 0 || entity.offset + entity.length > text.length) return;
		const affixes = markdownAffixesForTelegramEntity(entity, text.slice(entity.offset, entity.offset + entity.length));
		if (!affixes) return;
		const boundary = {
			open: affixes[0],
			close: affixes[1],
			start: entity.offset,
			end: entity.offset + entity.length,
			length: entity.length,
			priority: TELEGRAM_ENTITY_MARKDOWN_PRIORITY[entity.type] ?? 100,
			index
		};
		addBoundary(boundary.start, boundary);
		addBoundary(boundary.end, boundary);
	});
	if (boundaries.size === 0) return text;
	let result = "";
	for (let offset = 0; offset <= text.length; offset += 1) {
		const boundary = boundaries.get(offset);
		if (boundary) {
			boundary.filter((entity) => entity.end === offset).toSorted((a, b) => a.length - b.length || b.priority - a.priority || b.index - a.index).forEach((entity) => {
				result += entity.close;
			});
			boundary.filter((entity) => entity.start === offset).toSorted((a, b) => b.length - a.length || a.priority - b.priority || a.index - b.index).forEach((entity) => {
				result += entity.open;
			});
		}
		if (offset < text.length) result += text[offset];
	}
	return result;
}
function normalizeForwardedUserLabel(user) {
	const name = [user.first_name, user.last_name].filter(Boolean).join(" ").trim();
	const username = normalizeOptionalString(user.username);
	const id = String(user.id);
	return {
		display: (name && username ? `${name} (@${username})` : name || (username ? `@${username}` : void 0)) || `user:${id}`,
		name: name || void 0,
		username,
		id
	};
}
function normalizeForwardedChatLabel(chat, fallbackKind) {
	const title = normalizeOptionalString(chat.title);
	const username = normalizeOptionalString(chat.username);
	const id = String(chat.id);
	return {
		display: title || (username ? `@${username}` : void 0) || `${fallbackKind}:${id}`,
		title,
		username,
		id
	};
}
function buildForwardedContextFromUser(params) {
	const { display, name, username, id } = normalizeForwardedUserLabel(params.user);
	if (!display) return null;
	return {
		from: display,
		date: params.date,
		fromType: params.type,
		fromId: id,
		fromUsername: username,
		fromTitle: name
	};
}
function buildForwardedContextFromHiddenName(params) {
	const trimmed = params.name?.trim();
	if (!trimmed) return null;
	return {
		from: trimmed,
		date: params.date,
		fromType: params.type,
		fromTitle: trimmed
	};
}
function buildForwardedContextFromChat(params) {
	const fallbackKind = params.type === "channel" ? "channel" : "chat";
	const { display, title, username, id } = normalizeForwardedChatLabel(params.chat, fallbackKind);
	if (!display) return null;
	const signature = normalizeOptionalString(params.signature);
	const from = signature ? `${display} (${signature})` : display;
	const chatType = normalizeOptionalString(params.chat.type);
	return {
		from,
		date: params.date,
		fromType: params.type,
		fromId: id,
		fromUsername: username,
		fromTitle: title,
		fromSignature: signature,
		fromChatType: chatType,
		fromMessageId: params.messageId
	};
}
function resolveForwardOrigin(origin) {
	switch (origin.type) {
		case "user": return buildForwardedContextFromUser({
			user: origin.sender_user,
			date: origin.date,
			type: "user"
		});
		case "hidden_user": return buildForwardedContextFromHiddenName({
			name: origin.sender_user_name,
			date: origin.date,
			type: "hidden_user"
		});
		case "chat": return buildForwardedContextFromChat({
			chat: origin.sender_chat,
			date: origin.date,
			type: "chat",
			signature: origin.author_signature
		});
		case "channel": return buildForwardedContextFromChat({
			chat: origin.chat,
			date: origin.date,
			type: "channel",
			signature: origin.author_signature,
			messageId: origin.message_id
		});
		default: return null;
	}
}
function normalizeForwardedContext(msg) {
	if (!msg.forward_origin) return null;
	return resolveForwardOrigin(msg.forward_origin);
}
function extractTelegramLocation(msg) {
	const { venue, location } = msg;
	if (venue) return {
		latitude: venue.location.latitude,
		longitude: venue.location.longitude,
		accuracy: venue.location.horizontal_accuracy,
		name: venue.title,
		address: venue.address,
		source: "place",
		isLive: false
	};
	if (location) {
		const isLive = typeof location.live_period === "number" && location.live_period > 0;
		return {
			latitude: location.latitude,
			longitude: location.longitude,
			accuracy: location.horizontal_accuracy,
			source: isLive ? "live" : "pin",
			isLive
		};
	}
	return null;
}
//#endregion
//#region extensions/telegram/src/bot/helpers.ts
const TELEGRAM_GENERAL_TOPIC_ID = 1;
const TELEGRAM_FORUM_FLAG_CACHE_MAX_CHATS = 1024;
const TELEGRAM_FORUM_FLAG_CACHE_TTL_MS = 10 * 6e4;
const telegramForumFlagByChatId = /* @__PURE__ */ new Map();
function resetTelegramForumFlagCacheForTest() {
	telegramForumFlagByChatId.clear();
}
function cacheTelegramForumFlag(chatId, isForum, nowMs = Date.now()) {
	const cacheKey = String(chatId);
	const expiresAtMs = resolveExpiresAtMsFromDurationMs(TELEGRAM_FORUM_FLAG_CACHE_TTL_MS, { nowMs });
	if (expiresAtMs === void 0) {
		telegramForumFlagByChatId.delete(cacheKey);
		return;
	}
	if (!telegramForumFlagByChatId.has(cacheKey) && telegramForumFlagByChatId.size >= TELEGRAM_FORUM_FLAG_CACHE_MAX_CHATS) {
		const oldestKey = telegramForumFlagByChatId.keys().next().value;
		if (oldestKey !== void 0) telegramForumFlagByChatId.delete(oldestKey);
	}
	telegramForumFlagByChatId.set(cacheKey, {
		expiresAtMs,
		isForum
	});
}
function hadUnsafeTelegramText(raw, sanitized) {
	return typeof raw === "string" && raw.trim().length > 0 && sanitized.trim().length === 0;
}
function shouldUseTelegramDmThreadSession(params) {
	return params.dmThreadId != null && params.botHasTopicsEnabled === true;
}
function resolveTelegramBotHasTopicsEnabled(me) {
	return me !== null && typeof me === "object" && "has_topics_enabled" in me && me.has_topics_enabled === true;
}
function extractTelegramForumFlag(value) {
	if (!value || typeof value !== "object" || !("is_forum" in value)) return;
	const forum = value.is_forum;
	return typeof forum === "boolean" ? forum : void 0;
}
function resolveTelegramMessageForumFlagHint(params) {
	if (params.chatType === "supergroup" && params.isTopicMessage === true) return true;
	return typeof params.isForum === "boolean" ? params.isForum : void 0;
}
async function resolveTelegramForumFlag(params) {
	const forumHint = resolveTelegramMessageForumFlagHint({
		chatType: params.chatType,
		isForum: params.isForum,
		isTopicMessage: params.isTopicMessage
	});
	if (typeof forumHint === "boolean") {
		if (params.isGroup && params.chatType === "supergroup") cacheTelegramForumFlag(params.chatId, forumHint);
		return forumHint;
	}
	if (!params.isGroup || params.chatType !== "supergroup" || !params.getChat) return false;
	const cacheKey = String(params.chatId);
	const rawNowMs = Date.now();
	const nowMs = asDateTimestampMs(rawNowMs);
	const cached = telegramForumFlagByChatId.get(cacheKey);
	if (cached) {
		if (nowMs !== void 0 && asDateTimestampMs(cached.expiresAtMs) !== void 0 && cached.expiresAtMs > nowMs) return cached.isForum;
		telegramForumFlagByChatId.delete(cacheKey);
	}
	try {
		const resolved = extractTelegramForumFlag(await params.getChat(params.chatId)) === true;
		cacheTelegramForumFlag(params.chatId, resolved, rawNowMs);
		return resolved;
	} catch {
		return false;
	}
}
function withResolvedTelegramForumFlag(message, isForum) {
	if (extractTelegramForumFlag(message.chat) === isForum) return message;
	return {
		...message,
		chat: {
			...message.chat,
			is_forum: isForum
		}
	};
}
async function resolveTelegramGroupAllowFromContext(params) {
	const accountId = normalizeAccountId(params.accountId);
	const threadSpec = resolveTelegramThreadSpec({
		isGroup: params.isGroup ?? false,
		isForum: params.isForum,
		messageThreadId: params.messageThreadId
	});
	const resolvedThreadId = threadSpec.scope === "forum" ? threadSpec.id : void 0;
	const dmThreadId = threadSpec.scope === "dm" ? threadSpec.id : void 0;
	const threadIdForConfig = resolvedThreadId ?? dmThreadId;
	const { groupConfig, topicConfig } = params.resolveTelegramGroupConfig(params.chatId, threadIdForConfig);
	const groupAllowOverride = firstDefined(topicConfig?.allowFrom, groupConfig?.allowFrom);
	const effectiveDmPolicy = resolveTelegramEffectiveDmPolicy({
		isGroup: params.isGroup ?? false,
		groupConfig,
		dmPolicy: params.dmPolicy
	});
	return {
		resolvedThreadId,
		dmThreadId,
		storeAllowFrom: await loadTelegramPairingStoreIfNeeded({
			cfg: params.cfg,
			allowFrom: params.allowFrom,
			groupAllowOverride,
			accountId,
			senderId: params.senderId,
			isGroup: params.isGroup ?? false,
			effectiveDmPolicy,
			skipPairingStoreRead: params.skipPairingStoreRead,
			readChannelAllowFromStore: params.readChannelAllowFromStore
		}),
		groupConfig,
		topicConfig,
		groupAllowOverride,
		effectiveGroupAllow: normalizeAllowFrom(await expandTelegramAllowFromWithAccessGroups({
			cfg: params.cfg,
			allowFrom: groupAllowOverride ?? params.groupAllowFrom,
			accountId,
			senderId: params.senderId
		})),
		hasGroupAllowOverride: groupAllowOverride !== void 0
	};
}
async function isTelegramDmAllowedByConfiguredAllowFrom(params) {
	const configuredAllowFrom = params.groupAllowOverride ?? params.allowFrom;
	if (!configuredAllowFrom || configuredAllowFrom.length === 0) return false;
	const normalizedAllowFrom = normalizeAllowFrom(await expandTelegramAllowFromWithAccessGroups({
		cfg: params.cfg,
		allowFrom: configuredAllowFrom,
		accountId: params.accountId,
		senderId: params.senderId
	}));
	return normalizedAllowFrom.hasEntries && isSenderAllowed({
		allow: normalizedAllowFrom,
		senderId: params.senderId
	});
}
var TelegramPairingStoreReadError = class extends Error {
	constructor(cause) {
		super(`Telegram pairing store read failed: ${String(cause)}`);
		this.name = "TelegramPairingStoreReadError";
		this.cause = cause;
	}
};
async function loadTelegramPairingStoreIfNeeded(params) {
	if (params.skipPairingStoreRead || params.isGroup || params.effectiveDmPolicy !== "pairing") return [];
	if (await isTelegramDmAllowedByConfiguredAllowFrom({
		cfg: params.cfg,
		allowFrom: params.allowFrom,
		groupAllowOverride: params.groupAllowOverride,
		accountId: params.accountId,
		senderId: params.senderId
	})) return [];
	try {
		return await (params.readChannelAllowFromStore ?? readChannelAllowFromStore)("telegram", process.env, params.accountId);
	} catch (cause) {
		throw new TelegramPairingStoreReadError(cause);
	}
}
/**
* Resolve the thread ID for Telegram forum topics.
* For non-forum groups, returns undefined even if messageThreadId is present
* (reply threads in regular groups should not create separate sessions).
* For forum groups, returns the topic ID (or General topic ID=1 if unspecified).
*/
function resolveTelegramForumThreadId(params) {
	if (!params.isForum) return;
	if (params.messageThreadId == null) return TELEGRAM_GENERAL_TOPIC_ID;
	return params.messageThreadId;
}
function resolveTelegramThreadSpec(params) {
	if (params.isGroup) return {
		id: resolveTelegramForumThreadId({
			isForum: params.isForum,
			messageThreadId: params.messageThreadId
		}),
		scope: params.isForum ? "forum" : "none"
	};
	if (params.messageThreadId == null) return { scope: "dm" };
	return {
		id: params.messageThreadId,
		scope: "dm"
	};
}
/**
* Build thread params for Telegram API calls (messages, media).
*
* IMPORTANT: Thread IDs behave differently based on chat type:
* - DMs (private chats): Include message_thread_id when present (DM topics)
* - Forum topics: Skip thread_id=1 (General topic), include others
* - Regular groups: Thread IDs are ignored by Telegram
*
* General forum topic (id=1) must be treated like a regular supergroup send:
* Telegram rejects sendMessage/sendMedia with message_thread_id=1 ("thread not found").
*
* @param thread - Thread specification with ID and scope
* @returns API params object or undefined if thread_id should be omitted
*/
function buildTelegramThreadParams(thread) {
	if (thread?.id == null) return;
	const normalized = Math.trunc(thread.id);
	if (thread.scope === "dm") return normalized > 0 ? { message_thread_id: normalized } : void 0;
	if (normalized === TELEGRAM_GENERAL_TOPIC_ID) return;
	return { message_thread_id: normalized };
}
/**
* Build a Telegram routing target that keeps real topic/thread ids in-band.
*
* This is used by generic reply plumbing that may not always carry a separate
* `threadId` field through every hop. General forum topic stays chat-scoped
* because Telegram rejects `message_thread_id=1` for message sends.
*/
function buildTelegramRoutingTarget(chatId, thread) {
	const base = `telegram:${chatId}`;
	const messageThreadId = buildTelegramThreadParams(thread)?.message_thread_id;
	if (typeof messageThreadId !== "number") return base;
	return `${base}:topic:${messageThreadId}`;
}
/**
* Build the canonical Telegram inbound origin used by queued follow-up routing.
* DM thread ids remain metadata-only; real forum topics must be in-band.
*/
function buildTelegramInboundOriginTarget(chatId, thread) {
	if (thread?.scope !== "forum") return `telegram:${chatId}`;
	return buildTelegramRoutingTarget(chatId, thread);
}
/**
* Build thread params for typing indicators (sendChatAction).
* Empirically, General topic (id=1) needs message_thread_id for typing to appear.
*/
function buildTypingThreadParams(messageThreadId) {
	if (messageThreadId == null) return;
	return { message_thread_id: Math.trunc(messageThreadId) };
}
function resolveTelegramStreamMode(telegramCfg) {
	return resolveTelegramPreviewStreamMode(telegramCfg);
}
function buildTelegramGroupPeerId(chatId, messageThreadId) {
	return messageThreadId != null ? `${chatId}:topic:${messageThreadId}` : String(chatId);
}
/**
* Resolve the direct-message peer identifier for Telegram routing/session keys.
*
* In some Telegram DM deliveries (for example certain business/chat bridge flows),
* `chat.id` can differ from the actual sender user id. Prefer sender id when present
* so per-peer DM scopes isolate users correctly.
*/
function resolveTelegramDirectPeerId(params) {
	const senderId = params.senderId != null ? normalizeOptionalString(String(params.senderId)) ?? "" : "";
	if (senderId) return senderId;
	return String(params.chatId);
}
function buildTelegramGroupFrom(chatId, messageThreadId) {
	return `telegram:group:${buildTelegramGroupPeerId(chatId, messageThreadId)}`;
}
function isTelegramCommandsAllowFromConfigured(cfg) {
	const commandsAllowFrom = cfg.commands?.allowFrom;
	return commandsAllowFrom != null && typeof commandsAllowFrom === "object" && (Array.isArray(commandsAllowFrom.telegram) || Array.isArray(commandsAllowFrom["*"]));
}
function resolveTelegramCommandAuthorization(params) {
	return resolveCommandAuthorization({
		ctx: {
			Provider: "telegram",
			Surface: "telegram",
			OriginatingChannel: "telegram",
			AccountId: params.accountId,
			ChatType: params.isGroup ? "group" : "direct",
			From: params.isGroup ? buildTelegramGroupFrom(params.chatId, params.resolvedThreadId) : `telegram:${params.chatId}`,
			SenderId: params.senderId || void 0,
			SenderUsername: params.senderUsername || void 0
		},
		cfg: params.cfg,
		commandAuthorized: false
	});
}
/**
* Build parentPeer for forum topic binding inheritance.
* When a message comes from a forum topic, the peer ID includes the topic suffix
* (e.g., `-1001234567890:topic:99`). To allow bindings configured for the base
* group ID to match, we provide the parent group as `parentPeer` so the routing
* layer can fall back to it when the exact peer doesn't match.
*/
function buildTelegramParentPeer(params) {
	if (!params.isGroup || params.resolvedThreadId == null) return;
	return {
		kind: "group",
		id: String(params.chatId)
	};
}
function buildGroupLabel(msg, chatId, messageThreadId) {
	const title = msg.chat?.title;
	const topicSuffix = messageThreadId != null ? ` topic:${messageThreadId}` : "";
	if (title) return `${title} id:${chatId}${topicSuffix}`;
	return `group:${chatId}${topicSuffix}`;
}
function resolveTelegramReplyId(raw) {
	return normalizeTelegramReplyToMessageId(raw);
}
function describeReplyTarget(msg) {
	const reply = msg.reply_to_message;
	const externalReply = msg.external_reply;
	const quote = msg.quote ?? externalReply?.quote;
	const rawQuoteText = quote?.text;
	const quoteText = resolveTelegramTextContent(rawQuoteText);
	let body;
	let kind = "reply";
	const filteredQuoteText = hadUnsafeTelegramText(rawQuoteText, quoteText);
	body = quoteText.trim();
	if (body) kind = "quote";
	const replyLike = reply ?? externalReply;
	const rawReplyText = replyLike && typeof replyLike.text === "string" ? replyLike.text : replyLike && typeof replyLike.caption === "string" ? replyLike.caption : void 0;
	const replyTextParts = replyLike ? getTelegramTextParts(replyLike) : void 0;
	const safeReplyText = replyTextParts?.text ?? "";
	let filteredReplyText = false;
	if (!body && replyLike) {
		const replyBody = safeReplyText.trim() || resolveTelegramRichMessagePlaceholder(replyLike) || "";
		filteredReplyText = hadUnsafeTelegramText(rawReplyText, replyBody);
		body = replyBody;
		if (!body) {
			body = resolveTelegramMediaPlaceholder(replyLike) ?? "";
			if (!body) {
				const locationData = extractTelegramLocation(replyLike);
				if (locationData) body = formatLocationText(locationData);
			}
		}
	}
	if (!body && !replyLike) return null;
	if (!body && !filteredQuoteText && !filteredReplyText) return null;
	const senderLabel = (replyLike ? buildSenderName(replyLike) : void 0) ?? "unknown sender";
	const source = reply ? "reply_to_message" : "external_reply";
	const quotePosition = kind === "quote" && typeof quote?.position === "number" && Number.isFinite(quote.position) ? Math.trunc(quote.position) : void 0;
	const quoteEntities = kind === "quote" && Array.isArray(quote?.entities) ? quote.entities : void 0;
	const forwardedFrom = replyLike ? normalizeForwardedContext(replyLike) ?? void 0 : void 0;
	return {
		id: replyLike?.message_id ? String(replyLike.message_id) : void 0,
		sender: senderLabel,
		senderId: replyLike?.from?.id != null ? String(replyLike.from.id) : void 0,
		senderUsername: replyLike?.from?.username ?? void 0,
		body: body || void 0,
		kind,
		source,
		quoteText: kind === "quote" ? quoteText : void 0,
		quotePosition,
		quoteEntities,
		forwardedFrom,
		quoteSourceText: replyTextParts?.text || void 0,
		quoteSourceEntities: replyTextParts?.entities
	};
}
//#endregion
//#region extensions/telegram/src/message-cache.ts
const DEFAULT_MAX_MESSAGES = 5e3;
const TELEGRAM_MESSAGE_CACHE_PERSISTENT_MAX_MESSAGES = 3e3;
const TELEGRAM_MESSAGE_CACHE_PERSISTENT_NAMESPACE = "telegram.message-cache";
const PERSISTENT_BUCKET_KEY = `plugin-state:${TELEGRAM_MESSAGE_CACHE_PERSISTENT_NAMESPACE}`;
const persistedMessageCacheBuckets = /* @__PURE__ */ new Map();
function telegramMessageCacheKey(params) {
	const key = `${params.accountId}:${params.chatId}:${params.messageId}`;
	return params.scopeKey ? `${params.scopeKey}:${key}` : key;
}
function telegramMessageCacheKeyPrefix(params) {
	const prefix = `${params.accountId}:${params.chatId}:`;
	return params.scopeKey ? `${params.scopeKey}:${prefix}` : prefix;
}
function resolveTelegramMessageCachePath(storePath) {
	return `${storePath}.telegram-messages.json`;
}
function resolveTelegramMessageCacheScope(storePath) {
	return resolveTelegramMessageCachePath(storePath);
}
function resolveReplyMessage(msg) {
	const externalReply = msg.external_reply;
	return msg.reply_to_message ?? externalReply;
}
function resolveEmbeddedReplyMessage(msg) {
	return msg.reply_to_message;
}
function resolveMessageBody(msg) {
	const text = getTelegramTextParts(msg).text.trim();
	if (text) return text;
	const location = extractTelegramLocation(msg);
	if (location) return formatLocationText(location);
	return resolveTelegramRichMessagePlaceholder(msg) ?? resolveTelegramPrimaryMedia(msg)?.placeholder;
}
function resolveMediaType(placeholder) {
	return placeholder?.match(/^<media:([^>]+)>$/)?.[1];
}
function normalizeMessageNode(msg, params) {
	if (typeof msg.message_id !== "number") return null;
	const media = resolveTelegramPrimaryMedia(msg);
	const fileId = media?.fileRef.file_id;
	const forwardedFrom = normalizeForwardedContext(msg);
	const replyMessage = resolveReplyMessage(msg);
	const body = resolveMessageBody(msg);
	const threadId = normalizeTelegramCacheThreadId(params.threadId);
	return {
		sourceMessage: msg,
		messageId: String(msg.message_id),
		sender: buildSenderName(msg) ?? "unknown sender",
		...msg.from?.id != null ? { senderId: String(msg.from.id) } : {},
		...msg.from?.username ? { senderUsername: msg.from.username } : {},
		...msg.date ? { timestamp: msg.date * 1e3 } : {},
		...body ? { body } : {},
		...media ? { mediaType: resolveMediaType(media.placeholder) ?? media.placeholder } : {},
		...fileId ? { mediaRef: `telegram:file/${fileId}` } : {},
		...replyMessage?.message_id != null ? { replyToId: String(replyMessage.message_id) } : {},
		...forwardedFrom?.from ? { forwardedFrom: forwardedFrom.from } : {},
		...forwardedFrom?.fromId ? { forwardedFromId: forwardedFrom.fromId } : {},
		...forwardedFrom?.fromUsername ? { forwardedFromUsername: forwardedFrom.fromUsername } : {},
		...forwardedFrom?.date ? { forwardedDate: forwardedFrom.date * 1e3 } : {},
		...threadId !== void 0 ? { threadId: String(threadId) } : {}
	};
}
function normalizeRequiredMessageNode(msg, params) {
	const node = normalizeMessageNode(msg, params);
	if (!node) throw new Error("Telegram message cache node missing message id");
	return node;
}
function resolveMessageThreadId(msg) {
	const threadId = msg.message_thread_id;
	return normalizeTelegramCacheThreadId(threadId);
}
function normalizeMessageNodes(msg, params) {
	const observations = [];
	const visited = /* @__PURE__ */ new Set();
	const nodeThreadId = (node) => parseCachedThreadId(node.threadId);
	const visit = (message, inheritedThreadId, mode) => {
		const node = normalizeMessageNode(message, { threadId: resolveMessageThreadId(message) ?? inheritedThreadId });
		if (!node?.messageId || visited.has(node.messageId)) return;
		visited.add(node.messageId);
		const replyMessage = resolveEmbeddedReplyMessage(message);
		if (replyMessage?.message_id != null) visit(replyMessage, nodeThreadId(node) ?? inheritedThreadId, "partial");
		observations.push({
			node,
			mode
		});
	};
	visit(msg, params.threadId, "authoritative");
	return observations;
}
function isString(value) {
	return typeof value === "string" && value.length > 0;
}
function readOptionalString(record, key) {
	const value = record[key];
	return isString(value) ? value : void 0;
}
function parseSafeMessageId(value) {
	return value === void 0 ? void 0 : parseStrictPositiveInteger(value);
}
function parseCachedThreadId(value) {
	return normalizeTelegramCacheThreadId(value);
}
function normalizeTelegramCacheThreadId(value) {
	return parseTelegramMessageThreadId(value);
}
function isTelegramSourceMessage(value) {
	return isRecord(value) && typeof value.message_id === "number" && Number.isFinite(value.message_id) && typeof value.date === "number" && Number.isFinite(value.date);
}
function parsePersistedEntry(value) {
	if (!isRecord(value) || !isString(value.key)) return [];
	const separatorIndex = value.key.lastIndexOf(":");
	if (separatorIndex === -1 || !isRecord(value.node) || !isTelegramSourceMessage(value.node.sourceMessage)) return [];
	const keyPrefix = value.key.slice(0, separatorIndex + 1);
	const threadId = parseCachedThreadId(readOptionalString(value.node, "threadId"));
	const sourceMessageId = String(value.node.sourceMessage.message_id);
	const threadParams = threadId !== void 0 ? { threadId } : {};
	return normalizeMessageNodes(value.node.sourceMessage, threadParams).map(({ node, mode }) => ({
		key: `${keyPrefix}${node.messageId}`,
		node,
		mode: node.messageId === sourceMessageId ? "authoritative" : mode
	}));
}
function persistedValueToEntry(key, value) {
	return {
		key,
		node: {
			sourceMessage: value.sourceMessage,
			...value.threadId ? { threadId: value.threadId } : {}
		}
	};
}
function findJsonArrayEnd(text) {
	let depth = 0;
	let inString = false;
	let escaped = false;
	let started = false;
	for (let index = 0; index < text.length; index++) {
		const char = text[index];
		if (!started) {
			if (char.trim() === "") continue;
			if (char !== "[") return -1;
			started = true;
			depth = 1;
			continue;
		}
		if (inString) {
			if (escaped) escaped = false;
			else if (char === "\\") escaped = true;
			else if (char === "\"") inString = false;
			continue;
		}
		if (char === "\"") inString = true;
		else if (char === "[") depth++;
		else if (char === "]") {
			depth--;
			if (depth === 0) return index + 1;
		}
	}
	return -1;
}
function readPersistedEntryValues(raw) {
	const values = [];
	const readLines = (text) => {
		for (const line of text.split("\n")) {
			if (!line.trim()) continue;
			try {
				const value = JSON.parse(line);
				values.push(value);
			} catch {}
		}
	};
	const trimmedStart = raw.trimStart();
	if (trimmedStart.startsWith("[")) {
		const startOffset = raw.length - trimmedStart.length;
		const arrayEnd = findJsonArrayEnd(raw.slice(startOffset));
		if (arrayEnd === -1) {
			readLines(raw);
			return values;
		}
		const legacyValue = JSON.parse(raw.slice(startOffset, startOffset + arrayEnd));
		if (Array.isArray(legacyValue)) values.push(...legacyValue);
		readLines(raw.slice(startOffset + arrayEnd));
		return values;
	}
	readLines(raw);
	return values;
}
function trimMessages(messages, maxMessages) {
	while (messages.size > maxMessages) {
		const oldest = messages.keys().next().value;
		if (oldest === void 0) break;
		messages.delete(oldest);
	}
}
function mergeTelegramSourceMessage(existing, incoming) {
	const existingReply = resolveEmbeddedReplyMessage(existing);
	const incomingReply = resolveEmbeddedReplyMessage(incoming);
	if (existingReply?.message_id != null && incomingReply?.message_id === existingReply.message_id) return Object.assign({}, existing, incoming, { reply_to_message: mergeTelegramSourceMessage(existingReply, incomingReply) });
	return Object.assign({}, existing, incoming);
}
function mergeAuthoritativeTelegramSourceMessage(existing, incoming) {
	const existingReply = resolveEmbeddedReplyMessage(existing);
	const incomingReply = resolveEmbeddedReplyMessage(incoming);
	if (existingReply?.message_id != null && incomingReply?.message_id === existingReply.message_id) return Object.assign({}, incoming, { reply_to_message: mergeTelegramSourceMessage(existingReply, incomingReply) });
	return incoming;
}
function mergeCachedMessageNode(existing, incoming, mode) {
	const threadId = parseCachedThreadId(incoming.threadId ?? existing.threadId);
	return normalizeRequiredMessageNode(mode === "authoritative" ? mergeAuthoritativeTelegramSourceMessage(existing.sourceMessage, incoming.sourceMessage) : mergeTelegramSourceMessage(existing.sourceMessage, incoming.sourceMessage), threadId !== void 0 ? { threadId } : {});
}
function upsertCachedMessageNode(params) {
	const existing = params.messages.get(params.key);
	const node = existing ? mergeCachedMessageNode(existing, params.node, params.mode) : params.node;
	params.messages.delete(params.key);
	params.messages.set(params.key, node);
	return node;
}
function readPersistedMessages(filePath, maxMessages) {
	const messages = /* @__PURE__ */ new Map();
	if (!fs.existsSync(filePath)) return { messages };
	try {
		for (const value of readPersistedEntryValues(fs.readFileSync(filePath, "utf-8"))) for (const entry of parsePersistedEntry(value)) {
			upsertCachedMessageNode({
				messages,
				key: entry.key,
				node: entry.node,
				mode: entry.mode
			});
			trimMessages(messages, maxMessages);
		}
	} catch (error) {
		logVerbose(`telegram: failed to read message cache: ${String(error)}`);
	}
	return { messages };
}
function toPersistedCacheValue(node) {
	return {
		sourceMessage: node.sourceMessage,
		...node.threadId ? { threadId: node.threadId } : {}
	};
}
function resolvePersistentScopeKey(scope) {
	return createHash("sha256").update(scope).digest("hex").slice(0, 24);
}
function resolveTelegramMessageCachePersistentScopeKey(scope) {
	return resolvePersistentScopeKey(scope);
}
function listTelegramLegacyMessageCacheEntries(params) {
	const persisted = readPersistedMessages(params.persistedPath, params.maxMessages ?? 3e3);
	return Array.from(persisted.messages, ([key, node]) => ({
		key,
		value: toPersistedCacheValue(node)
	}));
}
function resolveDefaultPersistentStore() {
	const runtime = getOptionalTelegramRuntime();
	if (!runtime) return;
	try {
		return runtime.state.openKeyedStore({
			namespace: TELEGRAM_MESSAGE_CACHE_PERSISTENT_NAMESPACE,
			maxEntries: TELEGRAM_MESSAGE_CACHE_PERSISTENT_MAX_MESSAGES
		});
	} catch (error) {
		logVerbose(`telegram: failed to open message cache plugin state: ${String(error)}`);
		return;
	}
}
function resolveMessageCacheBucket(params) {
	const { bucketKey } = params;
	if (!bucketKey) return {
		messages: /* @__PURE__ */ new Map(),
		hydrated: true
	};
	const existing = persistedMessageCacheBuckets.get(bucketKey);
	if (existing) {
		existing.persistentStore = params.persistentStore ?? existing.persistentStore;
		return existing;
	}
	const bucket = {
		messages: /* @__PURE__ */ new Map(),
		hydrated: false,
		...params.persistentStore ? { persistentStore: params.persistentStore } : {}
	};
	persistedMessageCacheBuckets.set(bucketKey, bucket);
	return bucket;
}
async function hydrateMessageCacheBucket(bucket, maxMessages, scopeKey) {
	if (bucket.hydrated) return;
	if (bucket.hydratePromise) {
		await bucket.hydratePromise;
		return;
	}
	bucket.hydratePromise = (async () => {
		let storeEntries = [];
		try {
			storeEntries = await bucket.persistentStore?.entries() ?? [];
		} catch (error) {
			logVerbose(`telegram: failed to hydrate message cache from plugin state: ${String(error)}`);
		}
		const scopedStoreEntries = scopeKey ? storeEntries.filter(({ key }) => key.startsWith(`${scopeKey}:`)) : storeEntries;
		for (const { key, value } of scopedStoreEntries) for (const entry of parsePersistedEntry(persistedValueToEntry(key, value))) {
			upsertCachedMessageNode({
				messages: bucket.messages,
				key: entry.key,
				node: entry.node,
				mode: entry.mode
			});
			trimMessages(bucket.messages, maxMessages);
		}
		bucket.hydrated = true;
	})().finally(() => {
		bucket.hydratePromise = void 0;
	});
	await bucket.hydratePromise;
}
async function persistCachedNode(params) {
	const { persistentStore } = params.bucket;
	if (!persistentStore) return;
	try {
		await persistentStore.register(params.key, toPersistedCacheValue(params.node));
	} catch (error) {
		logVerbose(`telegram: failed to persist message cache: ${String(error)}`);
	}
}
function createTelegramMessageCache(params) {
	const persistentStore = params?.persistentStore ?? resolveDefaultPersistentStore();
	const maxMessages = params?.maxMessages ?? (persistentStore ? 3e3 : DEFAULT_MAX_MESSAGES);
	const scopeKey = persistentStore ? resolvePersistentScopeKey(params?.scope ?? "default") : void 0;
	const bucket = resolveMessageCacheBucket({
		bucketKey: params?.bucketKey ?? (persistentStore ? `${PERSISTENT_BUCKET_KEY}:${scopeKey}` : void 0),
		maxMessages,
		...persistentStore ? { persistentStore } : {}
	});
	const { messages } = bucket;
	const get = async ({ accountId, chatId, messageId }) => {
		await hydrateMessageCacheBucket(bucket, maxMessages, scopeKey);
		if (!messageId) return null;
		const key = telegramMessageCacheKey({
			scopeKey,
			accountId,
			chatId,
			messageId
		});
		const entry = messages.get(key);
		if (!entry) return null;
		messages.delete(key);
		messages.set(key, entry);
		return entry;
	};
	const listChatMessages = async (paramsLocal) => {
		await hydrateMessageCacheBucket(bucket, maxMessages, scopeKey);
		const prefix = telegramMessageCacheKeyPrefix({
			scopeKey,
			...paramsLocal
		});
		const normalizedThreadId = normalizeTelegramCacheThreadId(paramsLocal.threadId);
		if (paramsLocal.threadId != null && normalizedThreadId === void 0) return [];
		const threadId = normalizedThreadId !== void 0 ? String(normalizedThreadId) : void 0;
		return Array.from(messages, ([key, node]) => ({
			key,
			node
		})).filter(({ key, node }) => {
			if (!key.startsWith(prefix)) return false;
			return threadId === void 0 || node.threadId === threadId;
		}).map(({ node }) => node).toSorted(compareCachedMessageNodes);
	};
	return {
		record: async ({ accountId, chatId, msg, threadId }) => {
			await hydrateMessageCacheBucket(bucket, maxMessages, scopeKey);
			const observations = normalizeMessageNodes(msg, { threadId });
			const currentObservation = observations.at(-1);
			if (!currentObservation) return null;
			let recordedEntry = null;
			for (const { node, mode } of observations) {
				const { messageId } = node;
				if (!messageId) continue;
				const key = telegramMessageCacheKey({
					scopeKey,
					accountId,
					chatId,
					messageId
				});
				const cachedNode = upsertCachedMessageNode({
					messages,
					key,
					node,
					mode
				});
				if (messageId === currentObservation.node.messageId) recordedEntry = cachedNode;
				trimMessages(messages, maxMessages);
				await persistCachedNode({
					bucket,
					key,
					node: cachedNode
				});
			}
			return recordedEntry ?? currentObservation.node;
		},
		get,
		recentBefore: async ({ accountId, chatId, messageId, threadId, limit }) => {
			if (!messageId || limit <= 0) return [];
			const targetId = parseSafeMessageId(messageId);
			if (targetId === void 0) return [];
			return (await listChatMessages({
				accountId,
				chatId,
				threadId
			})).filter((entry) => {
				const entryId = parseSafeMessageId(entry.messageId);
				return entryId !== void 0 && entryId < targetId;
			}).slice(-limit);
		},
		around: async ({ accountId, chatId, messageId, threadId, before, after }) => {
			if (!messageId) return [];
			const entries = await listChatMessages({
				accountId,
				chatId,
				threadId
			});
			const targetIndex = entries.findIndex((entry) => entry.messageId === messageId);
			if (targetIndex === -1) return [];
			return entries.slice(Math.max(0, targetIndex - Math.max(0, before)), targetIndex + Math.max(0, after) + 1);
		},
		latestMatchingAtOrBefore: async ({ accountId, chatId, messageId, threadId, matches }) => {
			if (!messageId) return null;
			const targetId = parseSafeMessageId(messageId);
			if (targetId === void 0) return null;
			await hydrateMessageCacheBucket(bucket, maxMessages, scopeKey);
			const prefix = telegramMessageCacheKeyPrefix({
				scopeKey,
				accountId,
				chatId
			});
			const normalizedThreadId = normalizeTelegramCacheThreadId(threadId);
			if (threadId != null && normalizedThreadId === void 0) return null;
			const normalizedThread = normalizedThreadId !== void 0 ? String(normalizedThreadId) : void 0;
			let latest = null;
			for (const [key, entry] of messages) {
				if (!key.startsWith(prefix)) continue;
				if (normalizedThread !== void 0 && entry.threadId !== normalizedThread) continue;
				const entryId = parseSafeMessageId(entry.messageId);
				if (entryId === void 0 || entryId > targetId || !matches(entry)) continue;
				if (!latest || compareCachedMessageNodes(entry, latest) > 0) latest = entry;
			}
			return latest;
		}
	};
}
function compareCachedMessageNodes(left, right) {
	const leftId = parseSafeMessageId(left.messageId);
	const rightId = parseSafeMessageId(right.messageId);
	if (leftId !== void 0 && rightId !== void 0) return leftId - rightId;
	return (left.messageId ?? "").localeCompare(right.messageId ?? "");
}
const SESSION_BOUNDARY_COMMAND_RE = /^\/(?:new|reset)(?:@[A-Za-z0-9_]+)?(?:\s|$)/i;
const SOFT_RESET_COMMAND_RE = /^\/reset(?:@[A-Za-z0-9_]+)?\s+soft(?:\s|$)/i;
function isTelegramSessionBoundaryCommandText(text) {
	const body = text?.trim();
	return Boolean(body && SESSION_BOUNDARY_COMMAND_RE.test(body) && !SOFT_RESET_COMMAND_RE.test(body));
}
function isSessionBoundaryCommandNode(node) {
	return isTelegramSessionBoundaryCommandText(node.body);
}
function isAfterSessionBoundary(node, boundary) {
	if (!boundary) return true;
	const nodeId = parseSafeMessageId(node.messageId);
	const boundaryId = parseSafeMessageId(boundary.messageId);
	if (nodeId !== void 0 && boundaryId !== void 0) return nodeId > boundaryId;
	if (typeof node.timestamp === "number" && Number.isFinite(node.timestamp) && typeof boundary.timestamp === "number" && Number.isFinite(boundary.timestamp)) return node.timestamp > boundary.timestamp;
	return true;
}
function normalizeSessionBoundaryTimestamp(timestampMs) {
	if (typeof timestampMs !== "number" || !Number.isFinite(timestampMs)) return;
	return Math.floor(timestampMs / 1e3) * 1e3;
}
function isAtOrAfterSessionBoundaryTimestamp(node, boundaryTimestampMs) {
	if (boundaryTimestampMs === void 0) return true;
	return typeof node.timestamp !== "number" || !Number.isFinite(node.timestamp) ? true : node.timestamp >= boundaryTimestampMs;
}
async function resolveSessionBoundaryNode(params) {
	if (!params.messageId) return;
	return await params.cache.latestMatchingAtOrBefore({
		accountId: params.accountId,
		chatId: params.chatId,
		messageId: params.messageId,
		...params.threadId !== void 0 ? { threadId: params.threadId } : {},
		matches: isSessionBoundaryCommandNode
	}) ?? void 0;
}
async function buildTelegramReplyChain(params) {
	const replyMessage = resolveReplyMessage(params.msg);
	if (!replyMessage?.message_id) return [];
	const maxDepth = params.maxDepth ?? 4;
	const visited = /* @__PURE__ */ new Set();
	const chain = [];
	let current = await params.cache.get({
		accountId: params.accountId,
		chatId: params.chatId,
		messageId: String(replyMessage.message_id)
	}) ?? normalizeMessageNode(replyMessage, {});
	while (current?.messageId && chain.length < maxDepth && !visited.has(current.messageId)) {
		visited.add(current.messageId);
		chain.push(current);
		current = await params.cache.get({
			accountId: params.accountId,
			chatId: params.chatId,
			messageId: current.replyToId
		});
	}
	return chain;
}
async function buildTelegramConversationContext(params) {
	const selected = /* @__PURE__ */ new Map();
	const replyTargetIds = /* @__PURE__ */ new Set();
	const sessionBoundary = await resolveSessionBoundaryNode(params);
	const sessionBoundaryTimestamp = normalizeSessionBoundaryTimestamp(params.minTimestampMs);
	const addNode = (node, flags) => {
		if (!node.messageId || node.messageId === params.messageId) return false;
		if (!isAfterSessionBoundary(node, sessionBoundary)) return false;
		if (!isAtOrAfterSessionBoundaryTimestamp(node, sessionBoundaryTimestamp)) return false;
		if (params.includeNode && !params.includeNode(node)) return false;
		const existing = selected.get(node.messageId);
		const isReplyTarget = existing?.isReplyTarget === true || flags?.replyTarget === true;
		selected.set(node.messageId, {
			node: existing?.node ?? node,
			isReplyTarget: isReplyTarget ? true : void 0
		});
		return true;
	};
	const addReplyTargetWindow = async (messageId) => {
		replyTargetIds.add(messageId);
		for (const node of await params.cache.around({
			accountId: params.accountId,
			chatId: params.chatId,
			messageId,
			...params.threadId !== void 0 ? { threadId: params.threadId } : {},
			before: params.replyTargetWindowSize,
			after: params.replyTargetWindowSize
		})) addNode(node, { replyTarget: node.messageId === messageId });
	};
	const currentWindow = await params.cache.recentBefore({
		accountId: params.accountId,
		chatId: params.chatId,
		messageId: params.messageId,
		...params.threadId !== void 0 ? { threadId: params.threadId } : {},
		limit: params.recentLimit
	});
	for (const node of currentWindow) if (addNode(node) && node.replyToId) await addReplyTargetWindow(node.replyToId);
	for (const [index, node] of params.replyChainNodes.entries()) {
		const added = addNode(node, { replyTarget: index === 0 });
		if (added && index === 0 && node.messageId) await addReplyTargetWindow(node.messageId);
		if (added && node.replyToId) replyTargetIds.add(node.replyToId);
	}
	for (const messageId of replyTargetIds) {
		const node = await params.cache.get({
			accountId: params.accountId,
			chatId: params.chatId,
			messageId
		});
		if (node) addNode(node, { replyTarget: true });
	}
	return Array.from(selected.values()).toSorted((left, right) => compareCachedMessageNodes(left.node, right.node));
}
//#endregion
//#region extensions/telegram/src/sent-message-cache.ts
const TTL_MS = 1440 * 60 * 1e3;
const TELEGRAM_SENT_MESSAGE_CACHE_NAMESPACE = "telegram.sent-messages";
const TELEGRAM_SENT_MESSAGE_CACHE_MAX_ENTRIES = 1e4;
const TELEGRAM_SENT_MESSAGES_STATE_KEY = Symbol.for("openclaw.telegramSentMessagesState");
const TELEGRAM_SENT_MESSAGES_STORE_FOR_TEST_KEY = Symbol.for("openclaw.telegramSentMessagesStoreForTest");
function getSentMessageStoreForTest() {
	return globalThis[TELEGRAM_SENT_MESSAGES_STORE_FOR_TEST_KEY];
}
function getSentMessageState() {
	const globalStore = globalThis;
	const existing = globalStore[TELEGRAM_SENT_MESSAGES_STATE_KEY];
	if (existing) return existing;
	const state = { bucketsByScope: /* @__PURE__ */ new Map() };
	globalStore[TELEGRAM_SENT_MESSAGES_STATE_KEY] = state;
	return state;
}
function createSentMessageStore() {
	return /* @__PURE__ */ new Map();
}
function resolveSentMessageStorePath(cfg) {
	return `${resolveStorePath(cfg?.session?.store)}.telegram-sent-messages.json`;
}
function resolveSentMessageScopeKey(cfg) {
	const storePath = resolveStorePath(cfg?.session?.store);
	return createHash("sha256").update(storePath, "utf8").digest("hex").slice(0, 24);
}
function sentMessageEntryKey(scopeKey, chatId, messageId) {
	return createHash("sha256").update(`${scopeKey}\0${chatId}\0${messageId}`, "utf8").digest("hex").slice(0, 32);
}
function openSentMessageStore() {
	return getSentMessageStoreForTest() ?? getTelegramRuntime().state.openSyncKeyedStore({
		namespace: "telegram.sent-messages",
		maxEntries: 1e4
	});
}
function cleanupExpired(store, scopeKey, entry, now) {
	for (const [id, timestamp] of entry) if (now - timestamp >= TTL_MS) entry.delete(id);
	if (entry.size === 0) store.delete(scopeKey);
}
function readLegacySentMessages(filePath) {
	try {
		const raw = fs.readFileSync(filePath, "utf-8");
		const parsed = JSON.parse(raw);
		const now = Date.now();
		const store = createSentMessageStore();
		for (const [chatId, entry] of Object.entries(parsed)) {
			const messages = /* @__PURE__ */ new Map();
			for (const [messageId, timestamp] of Object.entries(entry)) if (typeof timestamp === "number" && Number.isFinite(timestamp) && now - timestamp <= TTL_MS) messages.set(messageId, timestamp);
			if (messages.size > 0) store.set(chatId, messages);
		}
		return store;
	} catch (error) {
		logVerbose(`telegram: failed to read sent-message cache: ${String(error)}`);
		return createSentMessageStore();
	}
}
function readPersistedSentMessages(scopeKey) {
	const now = Date.now();
	const store = createSentMessageStore();
	try {
		for (const entry of openSentMessageStore().entries()) {
			if (entry.value.scopeKey !== scopeKey || now - entry.value.timestamp > TTL_MS) continue;
			let messages = store.get(entry.value.chatId);
			if (!messages) {
				messages = /* @__PURE__ */ new Map();
				store.set(entry.value.chatId, messages);
			}
			messages.set(entry.value.messageId, entry.value.timestamp);
		}
	} catch (error) {
		logVerbose(`telegram: failed to read sent-message cache: ${String(error)}`);
	}
	return store;
}
function getSentMessageBucket(cfg) {
	const state = getSentMessageState();
	const scopeKey = resolveSentMessageScopeKey(cfg);
	const existing = state.bucketsByScope.get(scopeKey);
	if (existing) return existing;
	const bucket = {
		scopeKey,
		store: readPersistedSentMessages(scopeKey)
	};
	state.bucketsByScope.set(scopeKey, bucket);
	return bucket;
}
function getSentMessages(cfg) {
	return getSentMessageBucket(cfg).store;
}
function persistSentMessages(bucket) {
	const { store, scopeKey } = bucket;
	const now = Date.now();
	for (const [chatId, entry] of store) {
		cleanupExpired(store, chatId, entry, now);
		for (const [messageId, timestamp] of entry) {
			const ttlMs = TTL_MS - Math.max(0, now - timestamp);
			if (ttlMs <= 0) continue;
			openSentMessageStore().register(sentMessageEntryKey(scopeKey, chatId, messageId), {
				scopeKey,
				chatId,
				messageId,
				timestamp
			}, { ttlMs });
		}
	}
}
function recordSentMessage(chatId, messageId, cfg) {
	const scopeKey = String(chatId);
	const idKey = String(messageId);
	const now = Date.now();
	const bucket = getSentMessageBucket(cfg);
	const { store } = bucket;
	let entry = store.get(scopeKey);
	if (!entry) {
		entry = /* @__PURE__ */ new Map();
		store.set(scopeKey, entry);
	}
	entry.set(idKey, now);
	if (entry.size > 100) cleanupExpired(store, scopeKey, entry, now);
	try {
		persistSentMessages(bucket);
	} catch (error) {
		logVerbose(`telegram: failed to persist sent-message cache: ${String(error)}`);
	}
}
function wasSentByBot(chatId, messageId, cfg) {
	const scopeKey = String(chatId);
	const idKey = String(messageId);
	const store = getSentMessages(cfg);
	const entry = store.get(scopeKey);
	if (!entry) return false;
	cleanupExpired(store, scopeKey, entry, Date.now());
	return entry.has(idKey);
}
function listTelegramLegacySentMessageCacheEntries(params) {
	const scopeKey = resolveSentMessageScopeKey(params.cfg);
	const filePath = params.persistedPath ?? resolveSentMessageStorePath(params.cfg);
	return [...(fs.existsSync(filePath) ? readLegacySentMessages(filePath) : createSentMessageStore()).entries()].flatMap(([chatId, messages]) => [...messages.entries()].map(([messageId, timestamp]) => ({
		key: sentMessageEntryKey(scopeKey, chatId, messageId),
		value: {
			scopeKey,
			chatId,
			messageId,
			timestamp
		},
		ttlMs: Math.max(1, TTL_MS - Math.max(0, Date.now() - timestamp))
	})));
}
//#endregion
export { expandTelegramAllowFromWithAccessGroups as $, resolveTelegramBotHasTopicsEnabled as A, shouldUseTelegramDmThreadSession as B, buildTelegramThreadParams as C, isTelegramCommandsAllowFromConfigured as D, extractTelegramForumFlag as E, resolveTelegramGroupAllowFromContext as F, getTelegramTextParts as G, buildSenderLabel as H, resolveTelegramMessageForumFlagHint as I, normalizeForwardedContext as J, hasBotMention as K, resolveTelegramReplyId as L, resolveTelegramDirectPeerId as M, resolveTelegramForumFlag as N, loadTelegramPairingStoreIfNeeded as O, resolveTelegramForumThreadId as P, resolveTelegramRichMessagePlaceholder as Q, resolveTelegramStreamMode as R, buildTelegramRoutingTarget as S, describeReplyTarget as T, buildSenderName as U, withResolvedTelegramForumFlag as V, extractTelegramLocation as W, resolveTelegramMediaPlaceholder as X, renderTelegramTextEntities as Y, resolveTelegramPrimaryMedia as Z, buildGroupLabel as _, wasSentByBot as a, normalizeTelegramReplyToMessageId as at, buildTelegramInboundOriginTarget as b, buildTelegramConversationContext as c, isTelegramSessionBoundaryCommandText as d, resolveTelegramDmAllow as et, listTelegramLegacyMessageCacheEntries as f, TelegramPairingStoreReadError as g, resolveTelegramMessageCacheScope as h, recordSentMessage as i, resolveTelegramEffectiveDmPolicy as it, resolveTelegramCommandAuthorization as j, resetTelegramForumFlagCacheForTest as k, buildTelegramReplyChain as l, resolveTelegramMessageCachePersistentScopeKey as m, TELEGRAM_SENT_MESSAGE_CACHE_NAMESPACE as n, normalizeAllowFrom as nt, TELEGRAM_MESSAGE_CACHE_PERSISTENT_MAX_MESSAGES as o, parseTelegramReplyToMessageId as ot, resolveTelegramMessageCachePath as p, isBinaryContent as q, listTelegramLegacySentMessageCacheEntries as r, normalizeDmAllowFromWithStore as rt, TELEGRAM_MESSAGE_CACHE_PERSISTENT_NAMESPACE as s, parseTelegramThreadId as st, TELEGRAM_SENT_MESSAGE_CACHE_MAX_ENTRIES as t, isSenderAllowed as tt, createTelegramMessageCache as u, buildTelegramGroupFrom as v, buildTypingThreadParams as w, buildTelegramParentPeer as x, buildTelegramGroupPeerId as y, resolveTelegramThreadSpec as z };
