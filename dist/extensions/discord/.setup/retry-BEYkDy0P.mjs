import { v as RateLimitError } from "./discord-BXpHW-cu.mjs";
import { parseStrictNonNegativeInteger, resolveIntegerOption } from "openclaw/plugin-sdk/number-runtime";
import { expectDefined } from "openclaw/plugin-sdk/expect-runtime";
import { collectErrorGraphCandidates, extractErrorCode, formatErrorMessage, readErrorName } from "openclaw/plugin-sdk/error-runtime";
import { classifyTransientNetworkErrorCode, createChannelApiRetryRunner, resolveRetryConfig, retryAsync } from "openclaw/plugin-sdk/retry-runtime";
import { buildMessagingTarget, parseMentionPrefixOrAtUserTarget, requireTargetKind } from "openclaw/plugin-sdk/channel-targets";
import { sleepWithAbort } from "openclaw/plugin-sdk/runtime-env";
import { resolveAllowlistMatchByCandidates } from "openclaw/plugin-sdk/allow-from";
import { chunkByParagraph } from "openclaw/plugin-sdk/reply-chunking";
import { chunkTextForOutbound, findCodeRegions } from "openclaw/plugin-sdk/text-chunking";
import { isSingleUseReplyToMode } from "openclaw/plugin-sdk/reply-reference";
import { createMessageReceiptFromOutboundResults } from "openclaw/plugin-sdk/channel-outbound";
import { attachChannelToResults } from "openclaw/plugin-sdk/channel-send-result";
//#region extensions/discord/src/target-parsing.ts
function parseDiscordTarget(raw, options = {}) {
	const trimmed = raw.trim();
	if (!trimmed) return;
	const providerPrefixedTarget = parseDiscordProviderPrefixedTarget(trimmed);
	if (providerPrefixedTarget) return providerPrefixedTarget;
	const userTarget = parseMentionPrefixOrAtUserTarget({
		raw: trimmed,
		mentionPattern: /^<@!?(\d+)>$/,
		prefixes: [
			{
				prefix: "user:",
				kind: "user"
			},
			{
				prefix: "channel:",
				kind: "channel"
			},
			{
				prefix: "discord:",
				kind: "user"
			}
		],
		atUserPattern: /^\d+$/,
		atUserErrorMessage: "Discord DMs require a user id (use user:<id> or a <@id> mention)"
	});
	if (userTarget) return userTarget;
	if (/^\d+$/.test(trimmed)) {
		if (options.defaultKind) return buildMessagingTarget(options.defaultKind, trimmed, trimmed);
		throw new Error(options.ambiguousMessage ?? `Ambiguous Discord recipient "${trimmed}". For DMs use "user:${trimmed}" or "<@${trimmed}>"; for channels use "channel:${trimmed}".`);
	}
	return buildMessagingTarget("channel", trimmed, trimmed);
}
function parseDiscordProviderPrefixedTarget(raw) {
	const match = /^discord:(channel|user):(.+)$/i.exec(raw);
	if (!match) return;
	const kind = match[1]?.toLowerCase();
	const id = match[2]?.trim();
	if (!kind || !id) return;
	return buildMessagingTarget(kind, id, `${kind}:${id}`);
}
function resolveDiscordChannelId(raw) {
	const target = parseDiscordTarget(raw, { defaultKind: "channel" });
	return requireTargetKind({
		platform: "Discord",
		target,
		kind: "channel"
	});
}
//#endregion
//#region extensions/discord/src/normalize.ts
function normalizeDiscordMessagingTarget(raw) {
	return parseDiscordTarget(raw, { defaultKind: "channel" })?.normalized;
}
function matchesDiscordToolContextTarget(params) {
	const target = normalizeDiscordMessagingTarget(params.target);
	if (!target) return false;
	return [params.toolContext.currentChannelId, params.toolContext.currentMessagingTarget].some((currentTarget) => currentTarget !== void 0 && normalizeDiscordMessagingTarget(currentTarget) === target);
}
/**
* Normalize a Discord outbound target for delivery. Bare numeric IDs are
* prefixed with "channel:" to avoid the ambiguous-target error in
* parseDiscordTarget, unless the ID is explicitly configured as an allowed DM
* sender. All other formats pass through unchanged.
*/
function normalizeDiscordOutboundTarget(to, allowFrom) {
	const trimmed = to?.trim();
	if (!trimmed) return {
		ok: false,
		error: /* @__PURE__ */ new Error("Discord recipient is required. Use \"channel:<id>\" for channels or \"user:<id>\" for DMs.")
	};
	if (/^\d+$/.test(trimmed)) {
		if (allowFromContainsDiscordUserId(allowFrom, trimmed)) return {
			ok: true,
			to: `user:${trimmed}`
		};
		return {
			ok: true,
			to: `channel:${trimmed}`
		};
	}
	return {
		ok: true,
		to: trimmed
	};
}
function allowFromContainsDiscordUserId(allowFrom, userId) {
	const normalizedUserId = userId.trim();
	if (!normalizedUserId) return false;
	const normalizedAllowFrom = (allowFrom ?? []).map(normalizeAllowFromDiscordUserId).filter((entry) => Boolean(entry));
	return resolveAllowlistMatchByCandidates({
		allowList: normalizedAllowFrom,
		candidates: [{
			value: normalizedUserId,
			source: "id"
		}]
	}).allowed;
}
function normalizeAllowFromDiscordUserId(entry) {
	const trimmed = entry.trim().toLowerCase();
	if (!trimmed || trimmed === "*") return;
	const mentionMatch = /^<@!?(\d+)>$/.exec(trimmed);
	if (mentionMatch) return mentionMatch[1];
	const prefixedMatch = /^(?:discord:)?user:(\d+)$/.exec(trimmed);
	if (prefixedMatch) return prefixedMatch[1];
	const discordMatch = /^discord:(\d+)$/.exec(trimmed);
	if (discordMatch) return discordMatch[1];
	return /^\d+$/.test(trimmed) ? trimmed : void 0;
}
function looksLikeDiscordTargetId(raw) {
	const trimmed = raw.trim();
	if (!trimmed) return false;
	if (/^<@!?\d+>$/.test(trimmed)) return true;
	if (/^(?:(?:user|channel|discord):\d+|discord:(?:user|channel):\d+)$/i.test(trimmed)) return true;
	if (/^\d{6,}$/.test(trimmed)) return true;
	return false;
}
//#endregion
//#region extensions/discord/src/reply-reference.ts
function resolveDiscordReplyReference(params) {
	if (!params.replyToId) return;
	const singleUse = params.replyToIdSource !== "explicit" && params.replyToMode !== void 0 && isSingleUseReplyToMode(params.replyToMode);
	return {
		messageId: params.replyToId,
		scope: singleUse ? "first" : "all"
	};
}
function createReusableDiscordReplyReference(messageId) {
	return messageId ? {
		messageId,
		scope: "all"
	} : void 0;
}
function resolveDiscordReplyMessageId(reply, isFirst) {
	return reply && (isFirst || reply.scope === "all") ? reply.messageId : void 0;
}
//#endregion
//#region extensions/discord/src/send.receipt.ts
function toDiscordOutboundDeliveryResult(result) {
	const { channelId, ...delivery } = result;
	return {
		...delivery,
		target: {
			kind: "channel",
			id: channelId
		}
	};
}
function createDiscordSendReceiptFromResults(params) {
	const receipt = createMessageReceiptFromOutboundResults({
		results: attachChannelToResults("discord", params.results),
		threadId: params.threadId
	});
	return {
		...receipt,
		parts: receipt.parts.map(({ platformMessageId, kind, threadId, replyToId, raw }, index) => ({
			platformMessageId,
			kind,
			index,
			threadId,
			replyToId,
			raw
		}))
	};
}
function createDiscordSendReceipt(params) {
	const results = params.platformMessageIds.map((messageId) => messageId.trim()).filter(Boolean).map((messageId, index) => {
		const result = {
			channel: "discord",
			messageId
		};
		if (params.channelId) result.channelId = params.channelId;
		if (params.reply?.scope === "first" && index === 0) {
			const rawResult = {
				channel: "discord",
				messageId
			};
			if (params.channelId) rawResult.channelId = params.channelId;
			result.receipt = createMessageReceiptFromOutboundResults({
				results: [rawResult],
				kind: params.kind,
				threadId: params.threadId,
				replyToId: params.reply.messageId
			});
		}
		return result;
	});
	return createMessageReceiptFromOutboundResults({
		results,
		kind: params.kind,
		threadId: params.threadId,
		replyToId: params.reply?.scope === "all" ? params.reply.messageId : void 0
	});
}
function createDiscordSendResult(params) {
	const messageId = params.result.id ?? "";
	const channelId = params.result.channel_id ?? params.fallbackChannelId;
	const receiptParams = {
		platformMessageIds: params.result.platformMessageIds?.length ? params.result.platformMessageIds : [messageId],
		channelId,
		kind: params.kind
	};
	if (params.threadId != null) receiptParams.threadId = String(params.threadId);
	if (params.reply) receiptParams.reply = params.reply;
	return {
		messageId,
		channelId,
		receipt: createDiscordSendReceipt(receiptParams)
	};
}
//#endregion
//#region packages/normalization-core/src/utf16-slice.ts
function isHighSurrogate(codeUnit) {
	return codeUnit >= 55296 && codeUnit <= 56319;
}
function isLowSurrogate(codeUnit) {
	return codeUnit >= 56320 && codeUnit <= 57343;
}
/** Moves a chunk boundary away from the middle of a UTF-16 surrogate pair. */
function avoidTrailingHighSurrogateBreak(text, start, end) {
	if (end <= start || end >= text.length || !isHighSurrogate(text.charCodeAt(end - 1)) || !isLowSurrogate(text.charCodeAt(end))) return end;
	const adjusted = end - 1;
	return adjusted > start ? adjusted : end + 1;
}
//#endregion
//#region packages/normalization-core/src/grapheme.ts
let graphemeSegmenter;
function getGraphemeSegmenter() {
	graphemeSegmenter ??= new Intl.Segmenter(void 0, { granularity: "grapheme" });
	return graphemeSegmenter;
}
/**
* Chooses a whole-grapheme cut within the hard budget, honoring a usable preference.
* If no whole grapheme fits, allowPartial permits a surrogate-safe progress cut;
* a leading surrogate pair can exceed maxEnd by one code unit.
*/
function findGraphemeChunkEnd(text, start, maxEnd, preferredEnd = maxEnd, allowPartial = true) {
	const hardEnd = Math.min(maxEnd, text.length);
	if (hardEnd <= start) return start;
	const preferred = Number.isInteger(preferredEnd) && preferredEnd > start && preferredEnd <= hardEnd ? preferredEnd : hardEnd;
	if (preferred === text.length) return preferred;
	const segments = getGraphemeSegmenter().segment(text);
	let end = segments.containing(preferred)?.index ?? preferred;
	if (end <= start && preferred < hardEnd) end = hardEnd === text.length ? hardEnd : segments.containing(hardEnd)?.index ?? hardEnd;
	return end > start ? end : allowPartial ? avoidTrailingHighSurrogateBreak(text, start, hardEnd) : start;
}
//#endregion
//#region extensions/discord/src/chunk.ts
const DEFAULT_MAX_CHARS = 2e3;
const DEFAULT_MAX_LINES = 17;
const REASONING_ITALICS_MARKER_CHARS = 2;
const MIN_REASONING_ITALICS_CHUNK_CHARS = 4;
const FENCE_RE = /^( {0,3})(`{3,}|~{3,})(.*)$/;
function hasReasoningItalics(text) {
	return /^(?:Reasoning:|Thinking\.{0,3})\n+_/u.test(text) && text.trimEnd().endsWith("_");
}
function resolveDiscordChunkLimit(value, fallback) {
	return resolveIntegerOption(value, fallback, { min: 1 });
}
function countLines(text) {
	if (!text) return 0;
	let count = 1;
	for (let index = text.indexOf("\n"); index !== -1; index = text.indexOf("\n", index + 1)) count += 1;
	return count;
}
function parseFenceLine(line, maxChars = Number.POSITIVE_INFINITY) {
	const match = line.match(FENCE_RE);
	if (!match) return null;
	const marker = match[2] ?? "";
	const closeLine = (match[1] ?? "") + marker;
	const canBalance = closeLine.length * 2 + 3 <= maxChars;
	const reopenLine = line.length + closeLine.length + 3 <= maxChars ? line : closeLine;
	return {
		marker,
		closeLine,
		reopenLine: canBalance ? reopenLine : null
	};
}
function closesFence(open, close) {
	return open.marker[0] === close.marker[0] && close.marker.length >= open.marker.length;
}
function chunkDiscordText(text, opts = {}) {
	const hardMaxChars = resolveDiscordChunkLimit(opts.maxChars, DEFAULT_MAX_CHARS);
	const maxLines = resolveDiscordChunkLimit(opts.maxLines, DEFAULT_MAX_LINES);
	if (!text) return [];
	if (text.length <= hardMaxChars && countLines(text) <= maxLines) return [text];
	const maxChars = hardMaxChars >= MIN_REASONING_ITALICS_CHUNK_CHARS && hasReasoningItalics(text) ? hardMaxChars - REASONING_ITALICS_MARKER_CHARS : hardMaxChars;
	const ranges = createDiscordRanges(text, maxChars, maxLines);
	const chunks = [];
	let current;
	let consumed = 0;
	let lineStart = 0;
	const raw = (frame) => {
		const prefix = ranges.fenceAt(frame.start)?.reopenLine ?? "";
		const body = text.slice(frame.start, frame.end);
		return prefix + (prefix ? "\n" : "") + body;
	};
	const render = (frame) => {
		const body = ranges.render(frame.start, frame.end);
		if (body === void 0) return;
		const prefix = ranges.fenceAt(frame.start)?.reopenLine ?? "";
		const result = prefix + (prefix ? "\n" : "") + body;
		const close = ranges.fenceAt(frame.end);
		return close?.reopenLine ? result + (result.endsWith("\n") ? "" : "\n") + close.closeLine : result;
	};
	const fits = (frame) => {
		const payload = render(frame);
		return payload !== void 0 && payload.length <= maxChars && countLines(payload) <= Math.max(maxLines, ranges.fenceAt(frame.start)?.reopenLine || ranges.fenceAt(frame.end)?.reopenLine ? 3 : 1);
	};
	const flush = (frame) => {
		let end = ranges.overlaps(frame.start, frame.end) ? ranges.cutBoundary(frame.start, frame.end) : ranges.boundary(frame.start, frame.end);
		if (frame.end > frame.start && end <= frame.start) return frame;
		const minimum = ranges.boundary(frame.start, frame.start + 1);
		while (end > minimum && !fits({
			...frame,
			end
		})) {
			const cut = ranges.cutBoundary(frame.start, end - 1);
			end = cut > frame.start ? cut : minimum;
		}
		const payload = expectDefined(render({
			...frame,
			end
		}), "renderable Discord source range");
		if (payload.trim()) chunks.push(payload);
		consumed = end;
		return end < frame.end ? {
			start: end,
			end: frame.end
		} : void 0;
	};
	for (const line of text.split("\n")) {
		const openFence = ranges.fenceAt(lineStart - 1);
		const candidateFence = ranges.fenceAt(lineStart + line.length) ?? openFence;
		const fence = candidateFence?.reopenLine ? candidateFence : null;
		const charLimit = maxChars - (fence ? fence.closeLine.length + 1 : 0);
		const lineLimit = Math.max(1, maxLines - (fence ? 1 : 0));
		const content = current ? raw(current) : ranges.fenceAt(consumed)?.reopenLine ?? "";
		const segmentLimit = openFence?.reopenLine && openFence.closeStart === lineStart && fits({
			start: lineStart,
			end: lineStart + line.length
		}) ? maxChars : Math.max(1, charLimit - Math.max(content ? content.length + 1 : 0, fence?.reopenLine ? fence.reopenLine.length + 1 : 0));
		let segmentStart = lineStart;
		for (const segment of chunkTextForOutbound(line, segmentLimit, { preserveWhitespace: Boolean(openFence) })) {
			const end = segmentStart + segment.length;
			const start = current?.start ?? (ranges.joins(consumed, segmentStart) ? consumed : segmentStart);
			const candidate = {
				start,
				end
			};
			const closesBlock = openFence && !ranges.fenceAt(end);
			let candidateText = raw(candidate);
			const exceeds = closesBlock ? !fits(candidate) : candidateText.length > charLimit || countLines(candidateText) > lineLimit || ranges.overlaps(start, end) && !fits(candidate);
			if (current && exceeds) {
				current = flush(current);
				candidate.start = current?.start ?? (ranges.joins(consumed, segmentStart) ? consumed : segmentStart);
				candidateText = raw(candidate);
			}
			current = candidateText ? candidate : void 0;
			segmentStart = end;
		}
		lineStart += line.length + 1;
	}
	while (current) current = flush(current);
	return rebalanceReasoningItalics(text, chunks, hardMaxChars);
}
function chunkDiscordTextWithMode(text, opts) {
	if ((opts.chunkMode ?? "length") !== "newline") return chunkDiscordText(text, opts);
	return chunkByParagraph(text, resolveDiscordChunkLimit(opts.maxChars, DEFAULT_MAX_CHARS), { splitLongParagraphs: false }).flatMap((line) => {
		const chunks = chunkDiscordText(line, opts);
		return chunks.length || !line ? chunks : [line];
	});
}
function leadingCodePrefixEnd(body) {
	let offset = 0;
	let prefixEnd = -1;
	while (offset < body.length) {
		const rest = body.slice(offset);
		const fence = parseFenceLine(rest.split("\n", 1)[0] ?? "");
		const marker = fence?.marker ?? /^`+/.exec(rest)?.[0];
		if (!marker) return prefixEnd;
		const pattern = fence ? `\\n( {0,3}${marker[0]}{${marker.length},} *)(?=[\\t ]*_?[\\t ]*(?:\\n|$))` : "(?<!`)`{" + marker.length + "}(?!`)";
		const delimiter = new RegExp(pattern, "g");
		delimiter.lastIndex = fence ? 0 : marker.length;
		const match = delimiter.exec(rest);
		if (!match) return fence ? body.length : prefixEnd;
		prefixEnd = offset + match.index + match[0].length;
		const separator = /^\s+/u.exec(body.slice(prefixEnd))?.[0];
		if (!separator) return prefixEnd;
		offset = prefixEnd + separator.length;
	}
	return prefixEnd;
}
function rebalanceReasoningItalics(source, chunks, maxChars) {
	if (chunks.length <= 1 || maxChars < MIN_REASONING_ITALICS_CHUNK_CHARS || !hasReasoningItalics(source)) return chunks;
	return chunks.map((chunk, index) => {
		const leadingWhitespace = chunk.length - chunk.trimStart().length;
		const codeEnd = leadingCodePrefixEnd(chunk.slice(leadingWhitespace));
		const prefixEnd = leadingWhitespace + Math.max(0, codeEnd);
		const prefix = chunk.slice(0, prefixEnd);
		let body = chunk.slice(prefixEnd);
		if (index > 0) {
			if (codeEnd >= 0 && /^\s*_\s*$/.test(body)) return prefix;
			const content = body.trimStart();
			if (content && !content.startsWith("_")) body = `${body.slice(0, body.length - content.length)}_${content}`;
		}
		if (!body.trimEnd().endsWith("_") && /^(?:_|(?:Reasoning:|Thinking\.{0,3})\n+_)/u.test(body.trimStart())) body += "_";
		return prefix + body;
	});
}
function renderInlineCode(body, delimiter) {
	const runs = new Set(Array.from(body.matchAll(/`+/g), (match) => match[0].length));
	let marker = delimiter;
	if (runs.has(marker.length) || marker.length >= 3 && /[\r\n]/.test(body)) {
		marker = "`";
		while (runs.has(marker.length)) marker += "`";
	}
	if (marker.length >= 3 && /[\r\n]/.test(body) && !body.split(/\r\n|[\r\n]/, 1)[0]?.includes("`")) return;
	const normalized = body.replace(/\r\n|[\r\n]/g, " ");
	const padding = body.startsWith("`") || body.endsWith("`") || normalized.startsWith(" ") && normalized.endsWith(" ") && /[^ ]/.test(normalized) ? " " : "";
	return marker + padding + body + padding + marker;
}
function createDiscordRanges(source, maxChars, maxLines) {
	const spans = [];
	const fences = [];
	let offset = 0;
	let plainStart = 0;
	let fence;
	const collect = (end) => {
		for (const span of findCodeRegions(source.slice(plainStart, end), {
			includeSource: true,
			syntax: "commonmark"
		})) {
			if (span.block) continue;
			const start = plainStart + span.start;
			const finish = plainStart + span.end;
			const marker = /^`+/.exec(source.slice(start, finish))?.[0];
			if (!marker) continue;
			const code = expectDefined(span.source, "inline code source map");
			const atomicTicks = (renderInlineCode("`", marker)?.length ?? Infinity) + code.prefix.text.length > maxChars;
			const pattern = atomicTicks ? /`+|\r\n|[\s\S]/gu : /\r\n|[\s\S]/gu;
			let fits = true;
			for (const { index, 0: raw } of source.slice(start, finish).matchAll(pattern)) {
				const value = code.value.slice(code.offsets[index], code.offsets[index + raw.length]);
				fits = !value || (renderInlineCode(value, marker)?.length ?? Infinity) + code.prefix.text.length <= maxChars;
				if (!fits) break;
			}
			if (fits && (maxLines > 1 || !code.value.includes("\n"))) spans.push({
				start,
				end: finish,
				code,
				base: plainStart,
				marker,
				atomicTicks
			});
		}
	};
	for (const line of source.split("\n")) {
		const info = parseFenceLine(line, maxChars);
		if (info && !fence) {
			collect(offset);
			fence = {
				start: offset,
				bodyStart: offset + line.length + 1,
				closeStart: source.length,
				end: source.length,
				...info
			};
			fences.push(fence);
		} else if (info && fence && closesFence(fence, info)) {
			fence.closeStart = offset;
			fence.end = offset + line.length;
			fence = void 0;
			plainStart = offset + line.length + 1;
		}
		offset += line.length + 1;
	}
	if (!fence) collect(source.length);
	const firstSpanEndingAfter = (position) => {
		let low = 0;
		let high = spans.length;
		while (low < high) {
			const middle = low + Math.floor((high - low) / 2);
			if (expectDefined(spans[middle], "Discord inline span").end <= position) low = middle + 1;
			else high = middle;
		}
		return low;
	};
	const firstPrefixEndingAfter = (position) => {
		let low = 0;
		let high = spans.length;
		while (low < high) {
			const middle = low + Math.floor((high - low) / 2);
			const span = expectDefined(spans[middle], "Discord inline span");
			if (span.base + span.code.prefix.end <= position) low = middle + 1;
			else high = middle;
		}
		return spans[low];
	};
	const overlaps = (start, end) => {
		const span = spans[firstSpanEndingAfter(start)];
		return Boolean(span && span.start < end);
	};
	const joins = (end, start) => {
		if (end > start) return false;
		const span = spans[firstSpanEndingAfter(end)];
		return Boolean(span && span.start < end && start < span.end);
	};
	const boundary = (start, end) => {
		let safe = findGraphemeChunkEnd(source, start, end);
		if (safe === end - 1 && source[end - 1] === "\r" && source[end] === "\n") safe = end;
		const prefixSpan = firstPrefixEndingAfter(safe);
		if (prefixSpan && prefixSpan.base + prefixSpan.code.prefix.start < safe) return prefixSpan.base + prefixSpan.code.prefix.start;
		const span = spans[firstSpanEndingAfter(safe)];
		if (span && span.start < safe) {
			if (source[safe - 1] === "\r" && source[safe] === "\n") safe -= 1;
			if (span.atomicTicks) while (source[safe - 1] === "`" && source[safe] === "`") safe -= 1;
		}
		return safe;
	};
	const render = (start, end) => {
		let cursor = start, text = "";
		for (let index = firstSpanEndingAfter(start); index < spans.length; index += 1) {
			const span = expectDefined(spans[index], "Discord inline span");
			if (span.start >= end) break;
			const prefix = span.code.prefix;
			const prefixStart = span.base + prefix.start;
			if (start > span.base + prefix.ownerStart && cursor <= prefixStart) {
				text += source.slice(cursor, prefixStart) + prefix.text;
				cursor = span.base + prefix.end;
			}
			text += source.slice(cursor, Math.max(cursor, span.start));
			if (span.start >= start && span.end <= end) text += source.slice(span.start, span.end);
			else {
				const body = span.code.value.slice(span.code.offsets[Math.max(start, span.start) - span.start], span.code.offsets[Math.min(end, span.end) - span.start]);
				if (body) {
					const value = renderInlineCode(body, span.marker);
					if (value === void 0) return;
					text += (span.start < start ? span.code.prefix.text : "") + value;
				}
			}
			cursor = Math.min(end, span.end);
		}
		return text + source.slice(cursor, end);
	};
	const fenceEndingAtOrAfter = (position) => {
		let low = 0;
		let high = fences.length;
		while (low < high) {
			const middle = low + Math.floor((high - low) / 2);
			if (expectDefined(fences[middle], "Discord fence range").end < position) low = middle + 1;
			else high = middle;
		}
		return fences[low];
	};
	const fenceAt = (position) => {
		const range = fenceEndingAtOrAfter(position);
		return range && range.bodyStart - 1 <= position && (position < range.end || position === range.end && range.closeStart === range.end) ? range : void 0;
	};
	const cutBoundary = (start, end) => {
		const safe = boundary(start, end);
		const range = fenceEndingAtOrAfter(safe);
		if (range) {
			if (start < range.start && range.start < safe && safe <= range.bodyStart) return range.start;
			if (range.closeStart < safe && safe < range.end) return range.closeStart;
		}
		return safe;
	};
	return {
		render,
		overlaps,
		joins,
		boundary,
		fenceAt,
		cutBoundary
	};
}
//#endregion
//#region extensions/discord/src/retry.ts
const DISCORD_RETRY_DEFAULTS = {
	attempts: 3,
	minDelayMs: 500,
	maxDelayMs: 3e4,
	jitter: .1
};
const DISCORD_GATEWAY_RECONNECT_EXTRA_ATTEMPTS = 2;
const DISCORD_TRANSIENT_MESSAGE_RE = /\b(?:bad gateway|fetch failed|network error|networkerror|service unavailable|socket hang up|temporarily unavailable|timed out|timeout)\b|connection (?:closed|reset|refused)/i;
const ambiguousDiscordMessageCreates = /* @__PURE__ */ new WeakSet();
function readDiscordErrorStatus(err) {
	if (!err || typeof err !== "object") return;
	const raw = "status" in err && err.status !== void 0 ? err.status : "statusCode" in err && err.statusCode !== void 0 ? err.statusCode : void 0;
	return parseStrictNonNegativeInteger(raw);
}
function classifyDiscordDeliveryFailure(error) {
	const candidates = collectErrorGraphCandidates(error, (current) => [current.cause, current.error]);
	for (const candidate of candidates) {
		const status = readDiscordErrorStatus(candidate);
		if (status !== void 0) {
			if (status === 408 || status >= 500) return "ambiguous";
			if (status >= 400) return "rejected";
		}
	}
	if (candidates.some((candidate) => readErrorName(candidate) === "AbortError" || classifyTransientNetworkErrorCode(extractErrorCode(candidate)) === "ambiguous")) return "ambiguous";
	if (candidates.some((candidate) => classifyTransientNetworkErrorCode(extractErrorCode(candidate)) === "pre-connect")) return "pre-connect";
	return candidates.some((candidate) => (candidate instanceof Error || candidate !== null && typeof candidate === "object") && DISCORD_TRANSIENT_MESSAGE_RE.test(formatErrorMessage(candidate))) ? "ambiguous" : "unknown";
}
function recordDiscordMessageCreateAmbiguity(error) {
	if (error !== null && typeof error === "object") ambiguousDiscordMessageCreates.add(error);
}
function hasDiscordMessageCreateAmbiguity(error) {
	return collectErrorGraphCandidates(error, (current) => [current.cause, current.error]).some((candidate) => candidate !== null && typeof candidate === "object" && ambiguousDiscordMessageCreates.has(candidate));
}
function canFallbackDiscordWebhookSend(error) {
	if (hasDiscordMessageCreateAmbiguity(error)) return false;
	const failure = classifyDiscordDeliveryFailure(error);
	return failure === "rejected" || failure === "pre-connect";
}
function hasDiscordRateLimitRejection(error) {
	return error instanceof RateLimitError || collectErrorGraphCandidates(error, (current) => [current.cause, current.error]).some((candidate) => readDiscordErrorStatus(candidate) === 429);
}
function isRetryableDiscordTransientError(error) {
	const failure = classifyDiscordDeliveryFailure(error);
	return failure === "ambiguous" || failure === "pre-connect" || hasDiscordRateLimitRejection(error);
}
function isRetryableDiscordPreConnectError(error) {
	const failure = classifyDiscordDeliveryFailure(error);
	return failure === "pre-connect" || failure === "rejected" && hasDiscordRateLimitRejection(error);
}
function resolveDiscordRetryPredicate(safety) {
	return safety === "non-idempotent-create" ? isRetryableDiscordPreConnectError : isRetryableDiscordTransientError;
}
function isRetryableDiscordGatewayTransportError(err) {
	if (!isRetryableDiscordTransientError(err) || err instanceof RateLimitError) return false;
	return !collectErrorGraphCandidates(err, (current) => [current.cause, current.error]).some((candidate) => readDiscordErrorStatus(candidate) !== void 0);
}
function createDiscordRetryRunner(params) {
	const retryConfig = resolveRetryConfig(DISCORD_RETRY_DEFAULTS, params.retry);
	const attempts = retryConfig.attempts > 1 ? retryConfig.attempts + DISCORD_GATEWAY_RECONNECT_EXTRA_ATTEMPTS : retryConfig.attempts;
	return (fn, label, options) => {
		const isRetryable = resolveDiscordRetryPredicate(options?.safety ?? "idempotent");
		let observedGatewayDisconnect = false;
		const runRequest = async () => {
			if (params.signal?.aborted) throw params.signal.reason instanceof Error ? params.signal.reason : /* @__PURE__ */ new Error("Discord request aborted");
			observedGatewayDisconnect ||= params.isGatewayDisconnected?.() === true;
			try {
				return await fn();
			} catch (err) {
				observedGatewayDisconnect ||= params.isGatewayDisconnected?.() === true;
				throw err;
			}
		};
		const shouldRetry = (err, attempt) => isRetryable(err) && (attempt < retryConfig.attempts || observedGatewayDisconnect && isRetryableDiscordGatewayTransportError(err));
		const retryAfterMs = (err) => err instanceof RateLimitError ? err.retryAfter * 1e3 : void 0;
		const signal = params.signal;
		if (signal) return retryAsync(runRequest, {
			...retryConfig,
			attempts,
			label,
			shouldRetry,
			retryAfterMs,
			sleep: async (delayMs) => {
				try {
					await sleepWithAbort(delayMs, signal);
				} catch (error) {
					throw signal.aborted && signal.reason instanceof Error ? signal.reason : error;
				}
			}
		});
		return createChannelApiRetryRunner({
			retry: {
				...retryConfig,
				attempts
			},
			shouldRetry,
			strictShouldRetry: true,
			retryAfterMs,
			verbose: params.verbose
		})(runRequest, label);
	};
}
//#endregion
export { normalizeDiscordMessagingTarget as _, recordDiscordMessageCreateAmbiguity as a, resolveDiscordChannelId as b, createDiscordSendReceiptFromResults as c, createReusableDiscordReplyReference as d, resolveDiscordReplyMessageId as f, matchesDiscordToolContextTarget as g, looksLikeDiscordTargetId as h, hasDiscordMessageCreateAmbiguity as i, createDiscordSendResult as l, allowFromContainsDiscordUserId as m, classifyDiscordDeliveryFailure as n, chunkDiscordTextWithMode as o, resolveDiscordReplyReference as p, createDiscordRetryRunner as r, createDiscordSendReceipt as s, canFallbackDiscordWebhookSend as t, toDiscordOutboundDeliveryResult as u, normalizeDiscordOutboundTarget as v, parseDiscordTarget as y };
