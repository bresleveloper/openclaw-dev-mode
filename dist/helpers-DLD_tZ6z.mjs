import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { D as resolveExpiresAtMsFromDurationMs, S as parseStrictInteger, o as asDateTimestampMs, w as parseStrictPositiveInteger } from "./number-coercion-CuVhdCBs.mjs";
import { y as uniqueStrings } from "./string-normalization-CECOqf64.mjs";
import { t as pruneMapToMaxSize } from "./map-size-BlrH_CnE.mjs";
import { t as createSubsystemLogger } from "./subsystem-I-uqdx4f.mjs";
import { n as normalizeAccountId } from "./account-id-DbRsdayc.mjs";
import { t as createDedupeCache } from "./dedupe-qhwfyIea.mjs";
import { a as parseAccessGroupAllowFromEntry, i as mergeDmAllowFromSources, n as firstDefined, r as isSenderIdAllowed } from "./allow-from-C_5BIb-Y.mjs";
import "./channel-outbound-DBuu65Vg.mjs";
import "./string-coerce-runtime-50qKeWeL.mjs";
import "./security-runtime-CpTHQYW2.mjs";
import { t as expandAllowFromWithAccessGroups } from "./access-groups-D-Ncd63h.mjs";
import { t as formatLocationText } from "./location-Dba72-LP.mjs";
import { g as resolveChannelPreviewStreamMode } from "./streaming-CHnBADiw.mjs";
import "./runtime-env-BjPzo7IN.mjs";
import "./number-runtime-CgyXj1A5.mjs";
import "./routing-CEr1aXk1.mjs";
import { s as readChannelAllowFromStore } from "./pairing-store-DEvhBgUm.mjs";
import "./channel-inbound-3pp2RVN7.mjs";
import "./dedupe-runtime-BEuVlvXg.mjs";
import "./conversation-runtime-De-TwUwt.mjs";
import "./allow-from-BjoTaQXB.mjs";
import { t as buildTelegramConversationId } from "./topic-conversation-C-lzScEI.mjs";
//#region extensions/telegram/src/outbound-params.ts
function parseTelegramReplyToMessageId(replyToId) {
	return parseStrictInteger(replyToId);
}
function parseTelegramThreadId(threadId) {
	if (typeof threadId !== "string") return parseStrictInteger(threadId);
	const trimmed = threadId.trim();
	const topicMatch = /^-?\d+:topic:(\d+)$/.exec(trimmed);
	if (topicMatch) return parseStrictInteger(topicMatch[1]);
	const scopedMatch = /^-?\d+:(-?\d+)$/.exec(trimmed);
	const rawThreadId = scopedMatch ? scopedMatch[1] : trimmed;
	return parseStrictInteger(rawThreadId);
}
//#endregion
//#region extensions/telegram/src/bot-access.ts
const warnedInvalidEntries = createDedupeCache({
	ttlMs: 0,
	maxSize: 256
});
const log = createSubsystemLogger("telegram/bot-access");
function warnInvalidAllowFromEntries(entries) {
	if (process.env.VITEST || false) return;
	for (const entry of entries) {
		if (warnedInvalidEntries.check(entry)) continue;
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
	const video = msg.video ?? msg.video_note;
	if (video) return {
		kind: "video",
		fileRef: video
	};
	const audio = msg.audio ?? msg.voice;
	if (audio) return {
		kind: "audio",
		fileRef: audio
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
function joinRichText(parts) {
	return parts.map(compactRichText).filter(Boolean).join("\n");
}
function renderRichInlineText(value) {
	if (value === void 0) return "";
	if (typeof value === "string") return value;
	if (Array.isArray(value)) return value.map(renderRichInlineText).filter(Boolean).join("");
	switch (value.type) {
		case "anchor": return "";
		case "button": return renderRichInlineText(value.button.text);
		case "custom_emoji": return value.alternative_text;
		case "mathematical_expression": return value.expression;
		default: return renderRichInlineText(value.text);
	}
}
function renderRichCaption(caption) {
	return caption ? joinRichText([renderRichInlineText(caption.text), renderRichInlineText(caption.credit)]) : "";
}
function renderRichBlock(block) {
	switch (block.type) {
		case "paragraph":
		case "heading":
		case "pre":
		case "footer":
		case "thinking": return renderRichInlineText(block.text);
		case "expandable_blockquote":
		case "pullquote": return renderRichCaption(block);
		case "mathematical_expression": return block.expression;
		case "blockquote": return joinRichText([renderRichInlineText(block.credit), renderRichBlocks(block.blocks)]);
		case "collage":
		case "slideshow": return joinRichText([renderRichCaption(block.caption), renderRichBlocks(block.blocks)]);
		case "details": return joinRichText([renderRichInlineText(block.summary), renderRichBlocks(block.blocks)]);
		case "list": return joinRichText(block.items.map((item) => joinRichText([item.label, renderRichBlocks(item.blocks)])));
		case "table": return joinRichText([renderRichInlineText(block.caption), ...block.cells.flatMap((row) => row.map((cell) => renderRichInlineText(cell.text)))]);
		case "animation":
		case "audio":
		case "document":
		case "map":
		case "photo":
		case "video":
		case "voice_note": return renderRichCaption(block.caption);
		case "buttons": return joinRichText(block.buttons.map((button) => renderRichInlineText(button.text)));
		case "anchor":
		case "divider": return "";
	}
	return "";
}
function renderRichBlocks(blocks) {
	return joinRichText(blocks.map(renderRichBlock));
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
function normalizeForwardedContext(msg) {
	const origin = msg.forward_origin;
	if (!origin) return null;
	const context = {
		date: origin.date,
		fromType: origin.type
	};
	switch (origin.type) {
		case "user": {
			const user = origin.sender_user;
			const name = [user.first_name, user.last_name].filter(Boolean).join(" ").trim();
			const username = normalizeOptionalString(user.username);
			const id = String(user.id);
			const from = (name && username ? `${name} (@${username})` : name || (username ? `@${username}` : void 0)) || `user:${id}`;
			return {
				...context,
				from,
				fromId: id,
				fromUsername: username,
				fromTitle: name || void 0
			};
		}
		case "hidden_user": {
			const name = origin.sender_user_name?.trim();
			return name ? {
				...context,
				from: name,
				fromTitle: name
			} : null;
		}
		case "chat":
		case "channel": {
			const chat = origin.type === "channel" ? origin.chat : origin.sender_chat;
			const title = normalizeOptionalString(chat.title);
			const username = normalizeOptionalString(chat.username);
			const id = String(chat.id);
			const display = title || (username ? `@${username}` : void 0) || `${origin.type}:${id}`;
			const signature = normalizeOptionalString(origin.author_signature);
			return {
				...context,
				from: signature ? `${display} (${signature})` : display,
				fromId: id,
				fromUsername: username,
				fromTitle: title,
				fromSignature: signature,
				fromChatType: normalizeOptionalString(chat.type),
				fromMessageId: origin.type === "channel" ? origin.message_id : void 0
			};
		}
		default: return null;
	}
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
//#region extensions/telegram/src/preview-streaming.ts
function resolveTelegramPreviewStreamMode(params = {}) {
	return resolveChannelPreviewStreamMode(params, "progress");
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
	telegramForumFlagByChatId.set(cacheKey, {
		expiresAtMs,
		isForum
	});
	pruneMapToMaxSize(telegramForumFlagByChatId, TELEGRAM_FORUM_FLAG_CACHE_MAX_CHATS);
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
function resolveTelegramForumThreadId(params) {
	return params.isForum ? params.messageThreadId ?? 1 : void 0;
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
function buildTelegramRoutingTarget(chatId, thread) {
	const base = `telegram:${chatId}`;
	const threadParams = buildTelegramThreadParams(thread);
	if (threadParams?.direct_messages_topic_id != null) return `${base}:direct-topic:${threadParams.direct_messages_topic_id}`;
	return threadParams?.message_thread_id != null ? `${base}:topic:${threadParams.message_thread_id}` : base;
}
function buildTelegramInboundOriginTarget(chatId, thread) {
	if (thread?.scope !== "forum" && thread?.scope !== "direct-messages") return `telegram:${chatId}`;
	return buildTelegramRoutingTarget(chatId, thread);
}
function buildTypingThreadParams(messageThreadId) {
	if (messageThreadId == null) return;
	return { message_thread_id: Math.trunc(messageThreadId) };
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
function describeReplyTarget(msg) {
	const reply = msg.reply_to_message;
	const externalReply = msg.external_reply;
	const quote = msg.quote ?? externalReply?.quote;
	const rawQuoteText = quote?.text;
	const quoteText = resolveTelegramTextContent(rawQuoteText);
	let body = quoteText.trim();
	const kind = body ? "quote" : "reply";
	const filteredQuoteText = hadUnsafeTelegramText(rawQuoteText, quoteText);
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
export { hasLeadingBotCommandAddressedToOtherBot as A, resolveTelegramDmAllow as B, resolveTelegramPreviewStreamMode as C, getTelegramTextParts as D, extractTelegramLocation as E, resolveTelegramRichMessageBody as F, parseTelegramReplyToMessageId as G, normalizeAllowFrom as H, resolveTelegramRichMessagePlaceholder as I, parseTelegramThreadId as K, resolveTelegramRichMessageText as L, joinTelegramTextParts as M, normalizeForwardedContext as N, hasBotMention as O, resolveTelegramPrimaryMedia as P, renderTelegramTextEntities as R, withResolvedTelegramForumFlag as S, buildSenderName as T, normalizeDmAllowFromWithStore as U, isSenderAllowed as V, resolveTelegramEffectiveDmPolicy as W, resolveTelegramGroupAllowFromContext as _, buildTelegramInboundOriginTarget as a, resolveTelegramThreadSpec as b, buildTelegramThreadParams as c, extractTelegramForumFlag as d, getCachedTelegramForumFlag as f, resolveTelegramForumThreadId as g, resolveTelegramForumFlag as h, buildTelegramGroupPeerId as i, isBinaryContent as j, hasBotMentionInText as k, buildTypingThreadParams as l, resolveTelegramBotHasTopicsEnabled as m, buildGroupLabel as n, buildTelegramParentPeer as o, isTelegramCommandsAllowFromConfigured as p, buildTelegramGroupFrom as r, buildTelegramRoutingTarget as s, TelegramPairingStoreReadError as t, describeReplyTarget as u, resolveTelegramMessageForumFlagHint as v, buildSenderLabel as w, shouldUseTelegramDmThreadSession as x, resolveTelegramMessageThreadSpec as y, expandTelegramAllowFromWithAccessGroups as z };
