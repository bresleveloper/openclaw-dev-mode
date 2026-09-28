import { D as resolveExpiresAtMsFromDurationMs, o as asDateTimestampMs, w as parseStrictPositiveInteger } from "./number-coercion-CLj0HTDM.mjs";
import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { n as normalizeAccountId } from "./account-id-B1bfbA5J.mjs";
import { n as firstDefined } from "./allow-from-Dq2DvsNl.mjs";
import "./channel-outbound-r_EvcKqq.mjs";
import "./string-coerce-runtime-C_MKhRVt.mjs";
import { t as formatLocationText } from "./location-Ce8_SVWn.mjs";
import { _ as resolveChannelPreviewStreamMode } from "./streaming-BRWehz40.mjs";
import "./number-runtime-CGwowceO.mjs";
import "./routing-JKvWkBDR.mjs";
import { s as readChannelAllowFromStore } from "./pairing-store-Cvj6ctV_.mjs";
import "./channel-inbound-DcAqUPMY.mjs";
import "./conversation-runtime-BdU2H6Dm.mjs";
import { i as normalizeAllowFrom, o as resolveTelegramEffectiveDmPolicy, r as isSenderAllowed, t as expandTelegramAllowFromWithAccessGroups } from "./access-groups-Brlf3mfl.mjs";
import { t as buildTelegramConversationId } from "./topic-conversation-BlxRQJEK.mjs";
import { t as normalizeTelegramReplyToMessageId } from "./outbound-params-CEIp4vNq.mjs";
//#region extensions/telegram/src/preview-streaming.ts
function resolveTelegramPreviewStreamMode(params = {}) {
	return resolveChannelPreviewStreamMode(params, "progress");
}
//#endregion
//#region extensions/telegram/src/bot/inbound-text-entities.ts
const TELEGRAM_ENTITY_MARKDOWN_PRIORITY = {
	blockquote: 0,
	expandable_blockquote: 0,
	bold: 10,
	italic: 20,
	underline: 30,
	strikethrough: 40,
	spoiler: 50,
	text_link: 60,
	code: 70,
	pre: 80
};
const SPLITTABLE_FORMATTING_ENTITY_TYPES = /* @__PURE__ */ new Set([
	"bold",
	"italic",
	"underline",
	"strikethrough",
	"spoiler"
]);
function isTelegramBlockquoteEntity(entity) {
	return entity.type === "blockquote" || entity.type === "expandable_blockquote";
}
function hasValidTelegramEntityRange(text, entity) {
	return Number.isInteger(entity.offset) && Number.isInteger(entity.length) && entity.offset >= 0 && entity.length > 0 && entity.offset + entity.length <= text.length;
}
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
	const padding = /^[ \r\n`]|[ \r\n`]$/u.test(content) && /[^ \r\n]/u.test(content) ? " " : "";
	return [`${delimiter}${padding}`, `${padding}${delimiter}`];
}
function markdownPreAffixes(entity, content) {
	const language = entity.language?.replace(/[\s`]+/g, "").trim();
	const fence = "`".repeat(Math.max(3, longestBacktickRun(content) + 1));
	return [language ? `${fence}${language}\n` : `${fence}\n`, content.endsWith("\n") ? fence : `\n${fence}`];
}
function markdownAffixesForTelegramEntity(entity, content) {
	switch (entity.type) {
		case "blockquote":
		case "expandable_blockquote": return ["> ", ""];
		case "bold": return ["**", "**"];
		case "italic": return ["_", "_"];
		case "underline": return ["__", "__"];
		case "strikethrough": return ["~~", "~~"];
		case "spoiler": return ["||", "||"];
		case "code": return markdownInlineCodeDelimiters(content);
		case "pre": return markdownPreAffixes(entity, content);
		case "text_link": return ["[", `](${entity.url.replace(/[\\()<>\s]/gu, (character) => character === "(" || character === ")" ? `\\${character}` : encodeURIComponent(character))})`];
		default: return null;
	}
}
function splitTelegramFormattingAtQuoteEdges(text, entity, quoteEdges) {
	if (!SPLITTABLE_FORMATTING_ENTITY_TYPES.has(entity.type)) return [entity];
	const entityEnd = entity.offset + entity.length;
	const interiorEdges = quoteEdges.filter((offset) => entity.offset < offset && offset < entityEnd);
	if (interiorEdges.length === 0) return [entity];
	const segments = [];
	let segmentStart = entity.offset;
	for (const edge of [...interiorEdges, entityEnd]) {
		let segmentEnd = edge;
		while (segmentStart < segmentEnd && /\s/u.test(text.charAt(segmentStart))) segmentStart += 1;
		while (segmentEnd > segmentStart && /\s/u.test(text.charAt(segmentEnd - 1))) segmentEnd -= 1;
		if (segmentStart < segmentEnd) segments.push({
			...entity,
			offset: segmentStart,
			length: segmentEnd - segmentStart
		});
		segmentStart = edge;
	}
	return segments;
}
function resolveTelegramBlockquoteClose(text, start, end) {
	let presentBreaks = 0;
	let offset = end;
	while (offset > start && text.charAt(offset - 1) === "\n") {
		presentBreaks += 1;
		offset -= text.charAt(offset - 2) === "\r" ? 2 : 1;
	}
	offset = end;
	while (offset < text.length) if (text.charAt(offset) === "\n") {
		presentBreaks += 1;
		offset += 1;
	} else if (text.charAt(offset) === "\r" && text.charAt(offset + 1) === "\n") {
		presentBreaks += 1;
		offset += 2;
	} else break;
	const missingBreaks = (end < text.length ? 2 : 1) - presentBreaks;
	return (text.charAt(end) === "\r" || text.charAt(end - 2) === "\r" ? "\r\n" : "\n").repeat(Math.max(0, missingBreaks));
}
function renderTelegramTextEntities(text, entities) {
	if (!text || !entities?.length) return text;
	const quotedLineStarts = /* @__PURE__ */ new Set();
	const quoteEdges = /* @__PURE__ */ new Set();
	for (const entity of entities) {
		if (!isTelegramBlockquoteEntity(entity) || !hasValidTelegramEntityRange(text, entity)) continue;
		const end = entity.offset + entity.length;
		quoteEdges.add(entity.offset);
		quoteEdges.add(end);
		for (let offset = entity.offset + 1; offset < end; offset += 1) if (text[offset - 1] === "\n") quotedLineStarts.add(offset);
	}
	const sortedQuoteEdges = [...quoteEdges].toSorted((left, right) => left - right);
	const boundaries = /* @__PURE__ */ new Map();
	const escapedLinkLabelOffsets = /* @__PURE__ */ new Set();
	const addBoundary = (offset, boundary) => {
		const entries = boundaries.get(offset);
		if (entries) entries.push(boundary);
		else boundaries.set(offset, [boundary]);
	};
	entities.forEach((entity, index) => {
		if (!hasValidTelegramEntityRange(text, entity)) return;
		for (const segment of splitTelegramFormattingAtQuoteEdges(text, entity, sortedQuoteEdges)) {
			const content = text.slice(segment.offset, segment.offset + segment.length);
			if (segment.type === "text_link") for (const match of content.matchAll(/[\\[\]]/gu)) escapedLinkLabelOffsets.add(segment.offset + match.index);
			const affixes = markdownAffixesForTelegramEntity(segment, content);
			if (!affixes) continue;
			const end = segment.offset + segment.length;
			if (isTelegramBlockquoteEntity(segment)) affixes[1] = resolveTelegramBlockquoteClose(text, segment.offset, end);
			const boundary = {
				open: affixes[0],
				close: affixes[1],
				start: segment.offset,
				end,
				length: segment.length,
				priority: TELEGRAM_ENTITY_MARKDOWN_PRIORITY[segment.type] ?? 100,
				index
			};
			addBoundary(boundary.start, boundary);
			addBoundary(boundary.end, boundary);
		}
	});
	if (boundaries.size === 0) return text;
	let result = "";
	for (let offset = 0; offset <= text.length; offset += 1) {
		if (quotedLineStarts.has(offset)) result += "> ";
		const boundary = boundaries.get(offset);
		if (boundary) {
			boundary.filter((entity) => entity.end === offset).toSorted((a, b) => a.length - b.length || b.priority - a.priority || b.index - a.index).forEach((entity) => {
				result += entity.close;
			});
			boundary.filter((entity) => entity.start === offset).toSorted((a, b) => b.length - a.length || a.priority - b.priority || a.index - b.index).forEach((entity) => {
				result += entity.open;
			});
		}
		if (offset < text.length) result += escapedLinkLabelOffsets.has(offset) ? `\\${text[offset]}` : text[offset];
	}
	return result;
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
		kind: "image",
		fileRef: photo
	};
	if (msg.video) return {
		kind: "video",
		fileRef: msg.video
	};
	if (msg.video_note) return {
		kind: "video",
		fileRef: msg.video_note
	};
	if (msg.audio) return {
		kind: "audio",
		fileRef: msg.audio
	};
	if (msg.voice) return {
		kind: "audio",
		fileRef: msg.voice
	};
	if (msg.document) return {
		kind: "document",
		fileRef: msg.document
	};
	if (msg.sticker) return {
		kind: "sticker",
		fileRef: msg.sticker
	};
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
function compactRichText(value) {
	return value.split("\n").map((line) => line.trim()).filter(Boolean).join("\n");
}
function joinRichText(parts, separator) {
	return parts.map(compactRichText).filter(Boolean).join(separator);
}
function renderRichMessageButton(button) {
	return renderRichInlineText(button.text);
}
function renderRichInlineText(value) {
	if (value === void 0) return "";
	if (typeof value === "string") return value;
	if (Array.isArray(value)) return value.map(renderRichInlineText).filter(Boolean).join("");
	switch (value.type) {
		case "anchor": return "";
		case "button": return renderRichMessageButton(value.button);
		case "custom_emoji": return value.alternative_text;
		case "mathematical_expression": return value.expression;
		default: return renderRichInlineText(value.text);
	}
}
function renderRichCaption(caption) {
	return caption ? joinRichText([renderRichInlineText(caption.text), renderRichInlineText(caption.credit ?? "")], "\n") : "";
}
function renderRichBlock(block) {
	switch (block.type) {
		case "paragraph":
		case "heading":
		case "pre":
		case "footer":
		case "thinking": return renderRichInlineText(block.text);
		case "expandable_blockquote":
		case "pullquote": return joinRichText([renderRichInlineText(block.text), renderRichInlineText(block.credit ?? "")], "\n");
		case "mathematical_expression": return block.expression;
		case "blockquote": return joinRichText([renderRichInlineText(block.credit ?? ""), renderRichBlocks(block.blocks)], "\n");
		case "collage":
		case "slideshow": return joinRichText([renderRichCaption(block.caption), renderRichBlocks(block.blocks)], "\n");
		case "details": return joinRichText([renderRichInlineText(block.summary), renderRichBlocks(block.blocks)], "\n");
		case "list": return joinRichText(block.items.map((item) => joinRichText([item.label, renderRichBlocks(item.blocks)], "\n")), "\n");
		case "table": return joinRichText([renderRichInlineText(block.caption ?? ""), ...block.cells.flatMap((row) => row.map((cell) => renderRichInlineText(cell.text ?? "")))], "\n");
		case "animation":
		case "audio":
		case "document":
		case "map":
		case "photo":
		case "video":
		case "voice_note": return renderRichCaption(block.caption);
		case "buttons": return joinRichText(block.buttons.map(renderRichMessageButton), "\n");
		case "anchor":
		case "divider": return "";
	}
	return "";
}
function renderRichBlocks(blocks) {
	return joinRichText(blocks.map(renderRichBlock), "\n");
}
function resolveTelegramRichMessagePlaceholder(msg) {
	return msg.rich_message ? TELEGRAM_RICH_MESSAGE_PLACEHOLDER : void 0;
}
function resolveTelegramRichMessageText(msg) {
	if (!msg.rich_message) return;
	return compactRichText(renderRichBlocks(msg.rich_message.blocks)) || void 0;
}
function resolveTelegramRichMessageBody(msg) {
	return resolveTelegramRichMessageText(msg) ?? resolveTelegramRichMessagePlaceholder(msg);
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
function formatTelegramPollText(poll) {
	const correctOptionIds = new Set(poll.correct_option_ids ?? []);
	const optionLines = poll.options.map((option, index) => {
		const optionText = renderTelegramTextEntities(option.text, option.text_entities);
		const voteLabel = option.voter_count === 1 ? "vote" : "votes";
		const correctLabel = correctOptionIds.has(index) ? " (correct)" : "";
		return `${index + 1}. ${optionText} — ${option.voter_count} ${voteLabel}${correctLabel}`;
	});
	return [
		`[Poll] ${renderTelegramTextEntities(poll.question, poll.question_entities)}`,
		...poll.description ? [renderTelegramTextEntities(poll.description, poll.description_entities)] : [],
		...optionLines,
		`Total voters: ${poll.total_voter_count}`,
		`Type: ${poll.type}`,
		`Visibility: ${poll.is_anonymous ? "anonymous" : "public"}`,
		`Selection: ${poll.allows_multiple_answers ? "multiple answers" : "single answer"}`,
		`Status: ${poll.is_closed ? "closed" : "open"}`,
		...poll.explanation ? [`Explanation: ${renderTelegramTextEntities(poll.explanation, poll.explanation_entities)}`] : []
	].join("\n");
}
function getTelegramTextParts(msg) {
	const text = resolveTelegramTextContent(msg.text, msg.caption);
	if (text) return {
		text,
		entities: msg.entities ?? msg.caption_entities ?? []
	};
	return {
		text: msg.poll ? formatTelegramPollText(msg.poll) : "",
		entities: []
	};
}
function joinTelegramTextParts(messages, separator) {
	const textParts = [];
	const entities = [];
	let offset = 0;
	let previous;
	for (const message of messages) {
		const textPart = getTelegramTextParts(message);
		if (!textPart.text) continue;
		if (previous) {
			const gap = typeof separator === "string" ? separator : separator(previous);
			textParts.push(gap);
			offset += gap.length;
		}
		entities.push(...textPart.entities.map((entity) => ({
			...entity,
			offset: entity.offset + offset
		})));
		textParts.push(textPart.text);
		offset += textPart.text.length;
		previous = message;
	}
	return {
		text: textParts.join(""),
		entities
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
function hasBotMention(msg, botUsername, botId) {
	const { text, entities } = getTelegramTextParts(msg);
	const mention = normalizeLowercaseStringOrEmpty(`@${botUsername}`);
	if (hasStandaloneTelegramMention(normalizeLowercaseStringOrEmpty(text), mention)) return true;
	for (const ent of entities) {
		const slice = text.slice(ent.offset, ent.offset + ent.length);
		if (ent.type === "mention" && normalizeLowercaseStringOrEmpty(slice) === mention) return true;
		if (ent.type === "bot_command" && isBotCommandAddressedToMention(slice, mention)) return true;
		if (ent.type === "text_mention" && botId !== void 0 && ent.user?.id === botId) return true;
	}
	return false;
}
function hasLeadingBotCommandAddressedToOtherBot(msg, botUsername) {
	const { text, entities } = getTelegramTextParts(msg);
	const normalizedBotUsername = normalizeLowercaseStringOrEmpty(botUsername).replace(/^@/u, "");
	if (!normalizedBotUsername) return false;
	const leadingCommand = entities.find((entity) => entity.type === "bot_command" && entity.offset === 0);
	if (!leadingCommand) return false;
	const target = text.slice(0, leadingCommand.length).match(/^\/[^@\s]+@([a-z0-9_]+)$/iu)?.[1];
	return Boolean(target && target.toLowerCase() !== normalizedBotUsername);
}
function hasBotMentionInText(text, botUsername) {
	return hasStandaloneTelegramMention(normalizeLowercaseStringOrEmpty(text), normalizeLowercaseStringOrEmpty(`@${botUsername}`));
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
const TELEGRAM_FORUM_FLAG_CACHE_MAX_CHATS = 1024;
const TELEGRAM_FORUM_FLAG_CACHE_TTL_MS = 6e5;
const telegramForumFlagByChatId = /* @__PURE__ */ new Map();
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
function getCachedTelegramForumFlag(chatId, nowMs) {
	const cacheKey = String(chatId);
	const cached = telegramForumFlagByChatId.get(cacheKey);
	if (!cached) return;
	const effectiveNow = nowMs ?? Date.now();
	if (cached.expiresAtMs <= effectiveNow) return;
	return cached.isForum;
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
	const threadSpec = params.threadSpec ?? resolveTelegramThreadSpec({
		isGroup: params.isGroup ?? false,
		isForum: params.isForum,
		messageThreadId: params.messageThreadId
	});
	const resolvedThreadId = threadSpec.scope === "forum" || threadSpec.scope === "direct-messages" ? threadSpec.id : void 0;
	const dmThreadId = threadSpec.scope === "dm" ? threadSpec.id : void 0;
	const threadIdForConfig = resolvedThreadId ?? dmThreadId;
	const { groupConfig, topicConfig } = params.resolveTelegramGroupConfig(params.chatId, threadIdForConfig, params.cfg);
	const groupAllowOverride = firstDefined(topicConfig?.allowFrom, groupConfig?.allowFrom);
	const effectiveDmPolicy = resolveTelegramEffectiveDmPolicy({
		isGroup: params.isGroup ?? false,
		groupConfig,
		dmPolicy: params.dmPolicy
	});
	const storeAllowFrom = await loadTelegramPairingStoreIfNeeded({
		cfg: params.cfg,
		allowFrom: params.allowFrom,
		groupAllowOverride,
		accountId,
		senderId: params.senderId,
		isGroup: params.isGroup ?? false,
		effectiveDmPolicy,
		skipPairingStoreRead: params.skipPairingStoreRead,
		readChannelAllowFromStore: params.readChannelAllowFromStore
	});
	const expandedGroupAllowFrom = await expandTelegramAllowFromWithAccessGroups({
		cfg: params.cfg,
		allowFrom: groupAllowOverride ?? params.groupAllowFrom,
		accountId,
		senderId: params.senderId
	});
	return {
		threadSpec,
		resolvedThreadId,
		dmThreadId,
		storeAllowFrom,
		groupConfig,
		topicConfig,
		groupAllowOverride,
		effectiveGroupAllow: normalizeAllowFrom(expandedGroupAllowFrom),
		hasGroupAllowOverride: groupAllowOverride !== void 0
	};
}
async function isTelegramDmAllowedByConfiguredAllowFrom(params) {
	const configuredAllowFrom = params.groupAllowOverride ?? params.allowFrom;
	if (!configuredAllowFrom || configuredAllowFrom.length === 0) return false;
	const expandedAllowFrom = await expandTelegramAllowFromWithAccessGroups({
		cfg: params.cfg,
		allowFrom: configuredAllowFrom,
		accountId: params.accountId,
		senderId: params.senderId
	});
	const normalizedAllowFrom = normalizeAllowFrom(expandedAllowFrom);
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
	if (params.messageThreadId == null) return 1;
	return params.messageThreadId;
}
function resolveTelegramThreadSpec(params) {
	if (params.isGroup) {
		const id = resolveTelegramForumThreadId({
			isForum: params.isForum,
			messageThreadId: params.messageThreadId
		});
		return id === void 0 ? { scope: "none" } : {
			id,
			scope: "forum"
		};
	}
	if (params.messageThreadId == null) return { scope: "dm" };
	return {
		id: params.messageThreadId,
		scope: "dm"
	};
}
function resolveTelegramMessageThreadSpec(message, isForum) {
	if (message.chat.is_direct_messages === true) {
		const id = parseStrictPositiveInteger(message.direct_messages_topic?.topic_id);
		return id === void 0 ? { scope: "none" } : {
			id,
			scope: "direct-messages"
		};
	}
	return resolveTelegramThreadSpec({
		isGroup: message.chat.type === "group" || message.chat.type === "supergroup",
		isForum: isForum ?? resolveTelegramMessageForumFlagHint({
			chatType: message.chat.type,
			isForum: message.chat.is_forum,
			isTopicMessage: message.is_topic_message
		}),
		messageThreadId: message.message_thread_id
	});
}
/**
* Build thread params for Telegram API calls (messages, media).
*
* IMPORTANT: Thread IDs behave differently based on chat type:
* - Bot-private topics: Include message_thread_id when present
* - Forum topics: Skip thread_id=1 (General topic), include others
* - Channel Direct Messages topics: Include direct_messages_topic_id
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
	if (!Number.isFinite(normalized)) return;
	if (thread.scope === "dm") return normalized > 0 ? { message_thread_id: normalized } : void 0;
	if (thread.scope === "direct-messages") return normalized > 0 ? { direct_messages_topic_id: normalized } : void 0;
	if (thread.scope === "none") return;
	if (normalized === 1) return;
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
	const threadParams = buildTelegramThreadParams(thread);
	if (threadParams?.direct_messages_topic_id != null) return `${base}:direct-topic:${threadParams.direct_messages_topic_id}`;
	return threadParams?.message_thread_id != null ? `${base}:topic:${threadParams.message_thread_id}` : base;
}
/**
* Build the canonical Telegram inbound origin used by queued follow-up routing.
* Bot-private thread ids remain metadata-only; group topic ids must be in-band.
*/
function buildTelegramInboundOriginTarget(chatId, thread) {
	if (thread?.scope !== "forum" && thread?.scope !== "direct-messages") return `telegram:${chatId}`;
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
function buildTelegramGroupPeerId(chatId, thread) {
	return buildTelegramConversationId({
		chatId,
		thread: (typeof thread === "number" ? {
			id: thread,
			scope: "forum"
		} : thread) ?? { scope: "none" }
	});
}
function buildTelegramGroupFrom(chatId, thread) {
	return `telegram:group:${buildTelegramGroupPeerId(chatId, thread)}`;
}
function isTelegramCommandsAllowFromConfigured(cfg) {
	const commandsAllowFrom = cfg.commands?.allowFrom;
	return commandsAllowFrom != null && typeof commandsAllowFrom === "object" && (Array.isArray(commandsAllowFrom.telegram) || Array.isArray(commandsAllowFrom["*"]));
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
	const externalOrigin = reply ? void 0 : msg.external_reply?.origin;
	const senderMessage = replyLike && externalOrigin?.type === "user" ? {
		...replyLike,
		from: externalOrigin.sender_user
	} : replyLike;
	const replyMedia = resolveTelegramPrimaryMedia(replyLike);
	const rawReplyText = replyLike && typeof replyLike.text === "string" ? replyLike.text : replyLike && typeof replyLike.caption === "string" ? replyLike.caption : void 0;
	const replyTextParts = replyLike ? getTelegramTextParts(replyLike) : void 0;
	const safeReplyText = replyTextParts?.text ?? "";
	let filteredReplyText = false;
	if (!body && replyLike) {
		const replyBody = safeReplyText.trim() || resolveTelegramRichMessageBody(replyLike) || "";
		filteredReplyText = hadUnsafeTelegramText(rawReplyText, replyBody);
		body = replyBody;
		if (!body) {
			const locationData = extractTelegramLocation(replyLike);
			if (locationData) body = formatLocationText(locationData);
		}
	}
	if (!body && !replyLike) return null;
	if (!body && !replyMedia && !filteredQuoteText && !filteredReplyText) return null;
	const senderLabel = (senderMessage ? buildSenderName(senderMessage) : void 0) ?? "unknown sender";
	const source = reply ? "reply_to_message" : "external_reply";
	const quotePosition = kind === "quote" && typeof quote?.position === "number" && Number.isFinite(quote.position) ? Math.trunc(quote.position) : void 0;
	const quoteEntities = kind === "quote" && Array.isArray(quote?.entities) ? quote.entities : void 0;
	const forwardedFrom = replyLike ? normalizeForwardedContext(replyLike) ?? void 0 : void 0;
	return {
		id: replyLike?.message_id ? String(replyLike.message_id) : void 0,
		sender: senderLabel,
		senderId: senderMessage?.from?.id != null ? String(senderMessage.from.id) : void 0,
		senderUsername: senderMessage?.from?.username ?? void 0,
		body: body || void 0,
		mediaType: replyMedia?.kind,
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
export { hasBotMentionInText as A, resolveTelegramPreviewStreamMode as B, shouldUseTelegramDmThreadSession as C, extractTelegramLocation as D, buildSenderName as E, resolveTelegramPrimaryMedia as F, resolveTelegramRichMessageBody as I, resolveTelegramRichMessagePlaceholder as L, isBinaryContent as M, joinTelegramTextParts as N, getTelegramTextParts as O, normalizeForwardedContext as P, resolveTelegramRichMessageText as R, resolveTelegramThreadSpec as S, buildSenderLabel as T, resolveTelegramGroupAllowFromContext as _, buildTelegramInboundOriginTarget as a, resolveTelegramReplyId as b, buildTelegramThreadParams as c, extractTelegramForumFlag as d, getCachedTelegramForumFlag as f, resolveTelegramForumThreadId as g, resolveTelegramForumFlag as h, buildTelegramGroupPeerId as i, hasLeadingBotCommandAddressedToOtherBot as j, hasBotMention as k, buildTypingThreadParams as l, resolveTelegramBotHasTopicsEnabled as m, buildGroupLabel as n, buildTelegramParentPeer as o, isTelegramCommandsAllowFromConfigured as p, buildTelegramGroupFrom as r, buildTelegramRoutingTarget as s, TelegramPairingStoreReadError as t, describeReplyTarget as u, resolveTelegramMessageForumFlagHint as v, withResolvedTelegramForumFlag as w, resolveTelegramStreamMode as x, resolveTelegramMessageThreadSpec as y, renderTelegramTextEntities as z };
