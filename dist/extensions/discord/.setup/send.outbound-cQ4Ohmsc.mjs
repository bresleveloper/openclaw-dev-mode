import { t as __exportAll } from "./rolldown-runtime-nwUcYXjP.mjs";
import { u as createDiscordClient } from "./send.permissions-BvH_Dr8p.mjs";
import { T as createThread, q as withDiscordRequestAuthority, w as createChannelMessage } from "./discord-cXPUdHQi.mjs";
import { d as normalizeDiscordSnowflake, m as createReusableDiscordReplyReference, n as createDiscordSendReceiptFromResults, p as resolveDiscordDirectoryUserId, r as createDiscordSendResult, u as normalizeDiscordHandleKey } from "./send.receipt-CZ7ks6g7.mjs";
import { C as resolveDiscordSuppressEmbeds, S as resolveDiscordSendEmbeds, b as resolveDiscordMessageFlags, c as resolveChannelId, d as sendDiscordChunks, f as sendDiscordMedia, i as normalizeDiscordPollInput, l as resolveDiscordChannel, n as buildDiscordTextChunks, s as normalizeStickerIds, t as buildDiscordSendError, v as buildDiscordMessageRequest, x as resolveDiscordSendComponents, y as createDiscordMessageNonce } from "./send.shared-D2lh737v.mjs";
import { t as parseAndResolveDiscordTarget } from "./target-resolver-48znkzky.mjs";
import { normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
import { ChannelType } from "discord-api-types/v10";
import { requireRuntimeConfig } from "openclaw/plugin-sdk/plugin-config-runtime";
import { expectDefined } from "openclaw/plugin-sdk/expect-runtime";
import { resolveChunkMode } from "openclaw/plugin-sdk/reply-chunking";
import { convertMarkdownTables } from "openclaw/plugin-sdk/text-chunking";
import { truncateUtf16Safe } from "openclaw/plugin-sdk/text-utility-runtime";
import { recordChannelActivity } from "openclaw/plugin-sdk/channel-activity-runtime";
import { resolveMarkdownTableMode } from "openclaw/plugin-sdk/markdown-table-runtime";
import { fromMarkdown } from "mdast-util-from-markdown";
// extensions/discord/src/url-ranges.ts
const DISCORD_URL_START_RE = /(?:[A-Za-z][A-Za-z0-9+.-]*:\/\/|www\.|\/\/|mailto:)/giu;
function findDiscordUrlRanges(markdown) {
	const ranges = [];
	for (const match of markdown.matchAll(DISCORD_URL_START_RE)) {
		const start = match.index;
		const preceding = markdown[start - 1] ?? "";
		if (/[\p{L}\p{N}]/u.test(preceding) || preceding === "_" && markdown[start - 2] !== "_") continue;
		let end = start + match[0].length;
		let parenthesisDepth = 0;
		while (end < markdown.length) {
			const char = markdown[end];
			if (!char || /[\s<>]/u.test(char)) break;
			if (char === "(") parenthesisDepth += 1;
			else if (char === ")") {
				if (parenthesisDepth === 0) break;
				parenthesisDepth -= 1;
			}
			end += 1;
		}
		while (/[.,!?;:'"]/u.test(markdown[end - 1] ?? "")) end -= 1;
		ranges.push({
			start,
			end
		});
	}
	return ranges;
}
// extensions/discord/src/mentions.ts
const MENTION_CANDIDATE_PATTERN = /(^|[\s([{"'.,;:!?])@([a-z0-9_.-]{2,32}(?:#[0-9]{4})?)/gi;
const DISCORD_RESERVED_MENTIONS = /* @__PURE__ */ new Set(["everyone", "here"]);
const DISCORD_DISCRIMINATOR_SUFFIX = /#\d{4}$/;
const DISCORD_BROADCAST_MENTION_PATTERN = /@(everyone|here)\b/;
function formatMention(params) {
	const userId = params.userId == null ? null : normalizeDiscordSnowflake(params.userId);
	const channelId = params.channelId == null ? null : normalizeDiscordSnowflake(params.channelId);
	const mentions = [userId ? `<@${userId}>` : null, channelId ? `<#${channelId}>` : null].filter((entry) => Boolean(entry));
	if (mentions.length !== 1) throw new Error("formatMention requires exactly one of userId or channelId");
	return expectDefined(mentions.at(0), "single Discord mention target");
}
function resolveConfiguredMentionAlias(handle, mentionAliases) {
	const key = normalizeDiscordHandleKey(handle);
	if (!key || !mentionAliases) return;
	const withoutDiscriminator = key.replace(DISCORD_DISCRIMINATOR_SUFFIX, "");
	for (const [rawAlias, rawUserId] of Object.entries(mentionAliases)) {
		const alias = normalizeDiscordHandleKey(rawAlias);
		if (!alias) continue;
		const aliasWithoutDiscriminator = alias.replace(DISCORD_DISCRIMINATOR_SUFFIX, "");
		if (alias === key || alias === withoutDiscriminator || aliasWithoutDiscriminator === key) {
			const userId = normalizeDiscordSnowflake(rawUserId);
			if (userId) return userId;
		}
	}
}
function rewritePlainTextMentions(text, params) {
	const urlRanges = findDiscordUrlRanges(text);
	return text.replace(MENTION_CANDIDATE_PATTERN, (match, prefix, handle, offset) => {
		const mentionStart = offset + prefix.length;
		if (urlRanges.some(({ start, end }) => start <= mentionStart && mentionStart < end)) return match;
		for (let candidate = handle; candidate.length >= 2; candidate = candidate.slice(0, -1)) {
			if (DISCORD_RESERVED_MENTIONS.has(candidate.toLowerCase())) return match;
			const userId = resolveConfiguredMentionAlias(candidate, params.mentionAliases) ?? resolveDiscordDirectoryUserId({
				accountId: params.accountId,
				handle: candidate
			});
			if (userId) return `${prefix}${formatMention({ userId })}${handle.slice(candidate.length)}`;
			if (!candidate.endsWith(".")) return match;
		}
		return match;
	});
}
function countBacktickRun(text, index) {
	let cursor = index;
	while (text[cursor] === "`") cursor += 1;
	return cursor - index;
}
function findInlineBacktickRun(text, startIndex, runLength) {
	const newlineIndex = runLength >= 3 ? text.indexOf("\n", startIndex) : -1;
	const lineEnd = newlineIndex === -1 ? text.length : newlineIndex;
	const close = new RegExp("(?<!`)`{" + runLength + "}(?!`)").exec(text.slice(startIndex, lineEnd));
	return close ? startIndex + close.index + runLength : null;
}
function findFenceEnd(text, startIndex, runLength) {
	let searchIndex = startIndex + runLength;
	while (searchIndex < text.length) {
		const newlineIndex = text.indexOf("\n", searchIndex);
		if (newlineIndex === -1) return text.length;
		let lineCursor = newlineIndex + 1;
		while (text[lineCursor] === " " && lineCursor - newlineIndex <= 3) lineCursor += 1;
		const closingRunLength = countBacktickRun(text, lineCursor);
		if (closingRunLength >= runLength) return lineCursor + closingRunLength;
		searchIndex = lineCursor + Math.max(closingRunLength, 1);
	}
	return text.length;
}
function findNextMarkdownCodeSegment(text, startIndex) {
	const segmentOffset = text.slice(startIndex).search(/(?<=(?:^|[^\\])(?:\\\\)*)`/);
	if (segmentOffset === -1) return null;
	const segmentStart = startIndex + segmentOffset;
	const runLength = countBacktickRun(text, segmentStart);
	return {
		startIndex: segmentStart,
		endIndex: findInlineBacktickRun(text, segmentStart + runLength, runLength) ?? (runLength >= 3 ? findFenceEnd(text, segmentStart, runLength) : text.length)
	};
}
function rewriteDiscordKnownMentions(text, params) {
	if (!text.includes("@")) return text;
	let rewritten = "";
	let offset = 0;
	let segment = findNextMarkdownCodeSegment(text, offset);
	while (segment) {
		rewritten += rewritePlainTextMentions(text.slice(offset, segment.startIndex), params);
		rewritten += text.slice(segment.startIndex, segment.endIndex);
		offset = segment.endIndex;
		segment = findNextMarkdownCodeSegment(text, offset);
	}
	rewritten += rewritePlainTextMentions(text.slice(offset), params);
	return rewritten;
}
/** Whether text carries an `@everyone`/`@here` broadcast mention. */
function discordTextHasBroadcastMention(text) {
	return DISCORD_BROADCAST_MENTION_PATTERN.test(text);
}
// extensions/discord/src/markdown.ts
const DISCORD_NATIVE_TOKEN_RE = /<a?:[A-Za-z0-9_]+:\d+>|<\/[^>]+:\d+>/giu;
function normalizeDiscordBold(markdown) {
	if (!markdown.includes("__")) return markdown;
	const spans = [];
	const contentEdits = [];
	const starEmphasisDelimiters = /* @__PURE__ */ new Set();
	const astLinkRanges = [];
	const pending = [{ node: fromMarkdown(markdown) }];
	for (let event = pending.pop(); event; event = pending.pop()) {
		const { node } = event;
		const start = node.position?.start.offset;
		const end = node.position?.end.offset;
		if (node.type === "link" && start !== void 0 && end !== void 0 && markdown[start] === "<" && markdown[end - 1] === ">") astLinkRanges.push({
			start,
			end
		});
		let spanId = event.spanId;
		let enteredSpan = false;
		if (node.type === "strong" && start !== void 0 && end !== void 0 && markdown.startsWith("__", start) && markdown.slice(end - 2, end) === "__") {
			spanId = spans.length;
			spans.push({
				start,
				end
			});
			enteredSpan = true;
		}
		if (spanId !== void 0 && start !== void 0 && end !== void 0) {
			if (node.type === "strong" && !enteredSpan && markdown.startsWith("**", start) && markdown.slice(end - 2, end) === "**") contentEdits.push({
				spanId,
				start,
				marker: "****",
				consume: 2,
				delimiter: false
			}, {
				spanId,
				start: end - 2,
				marker: "****",
				consume: 2,
				delimiter: false
			});
			else if (node.type === "emphasis" && markdown[start] === "*" && markdown[end - 1] === "*") {
				starEmphasisDelimiters.add(start);
				starEmphasisDelimiters.add(end - 1);
				if (!(/[\p{L}\p{N}]/u.test(markdown[start - 1] ?? "") || /[\p{L}\p{N}]/u.test(markdown[end] ?? ""))) contentEdits.push({
					spanId,
					start,
					marker: "_",
					consume: 1,
					delimiter: false
				}, {
					spanId,
					start: end - 1,
					marker: "_",
					consume: 1,
					delimiter: false
				});
			} else if (node.type === "text") for (let offset = start; offset < end; offset += 1) {
				if (markdown[offset] !== "*") continue;
				let precedingSlashes = 0;
				for (let index = offset - 1; index >= start && markdown[index] === "\\"; index -= 1) precedingSlashes += 1;
				if (precedingSlashes % 2 === 0) contentEdits.push({
					spanId,
					start: offset,
					marker: "\\",
					consume: 0,
					delimiter: false
				});
			}
		}
		const children = node.children ?? [];
		for (let index = children.length - 1; index >= 0; index -= 1) {
			const child = children[index];
			if (child) pending.push({
				node: child,
				spanId
			});
		}
	}
	if (spans.length === 0) return markdown;
	const strongInteriorStartByEnd = /* @__PURE__ */ new Map();
	for (const span of spans) {
		const interiorStart = span.start + 2;
		strongInteriorStartByEnd.set(span.end, Math.min(strongInteriorStartByEnd.get(span.end) ?? interiorStart, interiorStart));
	}
	const nativeTokenRanges = [...markdown.matchAll(DISCORD_NATIVE_TOKEN_RE)].map((match) => ({
		start: match.index,
		end: match.index + match[0].length
	}));
	const protectedRanges = [
		...findDiscordUrlRanges(markdown),
		...astLinkRanges,
		...nativeTokenRanges
	].sort((left, right) => left.start - right.start).map(({ start, end: rawEnd }) => {
		let end = rawEnd;
		while (/[.,!?;:'"]/u.test(markdown[end - 1] ?? "")) end -= 1;
		let previousEnd = -1;
		while (end !== previousEnd) {
			previousEnd = end;
			while (starEmphasisDelimiters.has(end - 1)) end -= 1;
			let strongInteriorStart = strongInteriorStartByEnd.get(end);
			while (strongInteriorStart !== void 0 && start >= strongInteriorStart) {
				end -= 2;
				strongInteriorStart = strongInteriorStartByEnd.get(end);
			}
		}
		return {
			start,
			end
		};
	});
	const edits = [...spans.flatMap((span, spanId) => [span.start, span.end - 2].map((start) => ({
		spanId,
		start,
		marker: "**",
		consume: 2,
		delimiter: true
	}))), ...contentEdits].sort((left, right) => left.start - right.start);
	const renderEdits = (selectedEdits) => {
		let cursor = 0;
		let rendered = "";
		for (const edit of selectedEdits) {
			rendered += `${markdown.slice(cursor, edit.start)}${edit.marker}`;
			cursor = edit.start + edit.consume;
		}
		return rendered + markdown.slice(cursor);
	};
	const protectedSpanIds = /* @__PURE__ */ new Set();
	const protectedEditKeys = /* @__PURE__ */ new Set();
	let rangeIndex = 0;
	for (const edit of edits) {
		while ((protectedRanges[rangeIndex]?.end ?? Number.POSITIVE_INFINITY) <= edit.start) rangeIndex += 1;
		const range = protectedRanges[rangeIndex];
		if (range && (edit.consume === 0 ? edit.start >= range.start && edit.start < range.end : edit.start < range.end && edit.start + edit.consume > range.start)) {
			if (edit.delimiter || !astLinkRanges.some(({ start, end }) => edit.start >= start && edit.start + edit.consume <= end)) protectedSpanIds.add(edit.spanId);
			else protectedEditKeys.add(`${edit.start}:${edit.consume}:${edit.marker}`);
		}
	}
	const seenEdits = /* @__PURE__ */ new Set();
	return renderEdits(edits.filter((edit) => {
		const key = `${edit.start}:${edit.consume}:${edit.marker}`;
		if (protectedSpanIds.has(edit.spanId) || protectedEditKeys.has(key) || seenEdits.has(key)) return false;
		seenEdits.add(key);
		return true;
	}));
}
function renderDiscordMarkdown(markdown, tableMode) {
	return normalizeDiscordBold(convertMarkdownTables(markdown, tableMode));
}
// extensions/discord/src/outbound-text.ts
function prepareDiscordOutboundText(text, params) {
	const { account } = params;
	const renderedText = renderDiscordMarkdown(text, params.tableMode ?? resolveMarkdownTableMode({
		cfg: params.cfg,
		channel: "discord",
		accountId: account.accountId
	}));
	return {
		renderedText,
		textLimit: typeof params.textLimit === "number" && Number.isFinite(params.textLimit) ? Math.max(1, Math.min(Math.floor(params.textLimit), 2e3)) : void 0,
		textWithMentions: rewriteDiscordKnownMentions(renderedText, {
			accountId: account.accountId,
			mentionAliases: account.config.mentionAliases
		})
	};
}
// extensions/discord/src/send.outbound.ts
var send_outbound_exports = /* @__PURE__ */ __exportAll({
	sendMessageDiscord: () => sendMessageDiscord,
	sendPollDiscord: () => sendPollDiscord,
	sendStickerDiscord: () => sendStickerDiscord
});
const DEFAULT_DISCORD_MEDIA_MAX_MB = 100;
/** Discord's ChannelFlags.RequireTag is bit 4 on forum/media parent channels. */
const DISCORD_FORUM_REQUIRE_TAG_FLAG = 16;
/** Discord thread names are capped at 100 characters. */
const DISCORD_THREAD_NAME_LIMIT = 100;
function deriveForumThreadName(text) {
	const firstLine = normalizeOptionalString(text.split("\n").find((line) => normalizeOptionalString(line))) ?? "";
	return truncateUtf16Safe(firstLine, DISCORD_THREAD_NAME_LIMIT) || (/* @__PURE__ */ new Date()).toISOString().slice(0, 16);
}
/** Forum/Media channels cannot receive regular messages; detect them here. */
function isForumLikeChannel(channel) {
	return channel?.type === ChannelType.GuildForum || channel?.type === ChannelType.GuildMedia;
}
async function sendMessageDiscord(to, text, opts) {
	return await withDiscordRequestAuthority(opts.assertPlatformSendAuthorized, async () => {
		const cfg = requireRuntimeConfig(opts.cfg, "Discord send");
		const { token, rest, request, account: accountInfo } = createDiscordClient({
			...opts,
			cfg
		});
		const chunkMode = opts.chunkMode ?? resolveChunkMode(cfg, "discord", accountInfo.accountId);
		const maxLinesPerMessage = opts.maxLinesPerMessage ?? accountInfo.config.maxLinesPerMessage;
		const suppressEmbeds = resolveDiscordSuppressEmbeds({
			configured: accountInfo.config.suppressEmbeds,
			override: opts.suppressEmbeds
		});
		const mediaMaxBytes = typeof accountInfo.config.mediaMaxMb === "number" ? accountInfo.config.mediaMaxMb * 1024 * 1024 : DEFAULT_DISCORD_MEDIA_MAX_MB * 1024 * 1024;
		const { renderedText, textWithMentions, textLimit } = prepareDiscordOutboundText(text ?? "", {
			cfg,
			account: accountInfo,
			tableMode: opts.tableMode,
			textLimit: opts.textLimit
		});
		const recipient = await parseAndResolveDiscordTarget(to, {
			cfg,
			accountId: accountInfo.accountId
		}, { defaultKind: "channel" });
		const { channelId } = await resolveChannelId(rest, recipient, request);
		const channel = await resolveDiscordChannel(rest, channelId);
		const deliveredResults = [];
		let deliveryThreadId;
		const reportResult = async (progressResult, kind, replyToId) => {
			const deliveredResult = createDiscordSendResult({
				result: progressResult,
				fallbackChannelId: deliveryThreadId ?? channelId,
				kind,
				threadId: deliveryThreadId,
				reply: createReusableDiscordReplyReference(replyToId)
			});
			deliveredResults.push(deliveredResult);
			await opts.onDeliveryResult?.(deliveredResult);
		};
		const textSendOptions = {
			rest,
			request,
			maxLinesPerMessage,
			chunkMode,
			silent: opts.silent,
			suppressEmbeds,
			allowedMentions: opts.allowedMentions,
			maxChars: textLimit,
			onResult: reportResult,
			onPlatformSendDispatch: opts.onPlatformSendDispatch,
			assertPlatformSendAuthorized: opts.assertPlatformSendAuthorized
		};
		const mediaSendOptions = {
			filename: opts.filename,
			mediaAccess: opts.mediaAccess,
			mediaLocalRoots: opts.mediaLocalRoots,
			mediaReadFile: opts.mediaReadFile,
			maxBytes: mediaMaxBytes
		};
		async function sendWithError(targetChannelId, send) {
			try {
				return await send();
			} catch (err) {
				throw await buildDiscordSendError(err, {
					channelId: targetChannelId,
					cfg,
					rest,
					token,
					hasMedia: Boolean(opts.mediaUrl)
				});
			}
		}
		if (isForumLikeChannel(channel)) {
			if (((channel.flags ?? 0) & DISCORD_FORUM_REQUIRE_TAG_FLAG) !== 0) throw new Error(`Discord forum channel ${channelId} requires an applied tag; use thread-create with appliedTags, then send to the created thread.`);
			const threadName = deriveForumThreadName(renderedText);
			const chunks = buildDiscordTextChunks(textWithMentions, {
				maxLinesPerMessage,
				chunkMode,
				maxChars: textLimit
			});
			const starterContent = chunks[0]?.trim() ? chunks[0] : threadName;
			const starterComponents = resolveDiscordSendComponents({
				components: opts.components,
				text: starterContent,
				isFirst: true
			});
			const starterEmbeds = resolveDiscordSendEmbeds({
				embeds: opts.embeds,
				isFirst: true
			});
			const starterFlags = resolveDiscordMessageFlags({
				silent: opts.silent,
				suppressEmbeds: suppressEmbeds && !starterEmbeds?.length
			});
			const starterBody = buildDiscordMessageRequest({
				endpoint: "forum-thread",
				text: starterContent,
				components: starterComponents,
				embeds: starterEmbeds,
				flags: starterFlags,
				allowedMentions: opts.allowedMentions
			});
			const threadRes = await sendWithError(channelId, () => request(async () => {
				await opts.onPlatformSendDispatch?.();
				opts.assertPlatformSendAuthorized?.();
				return createThread(rest, channelId, { body: {
					name: threadName,
					...channel.default_auto_archive_duration === void 0 ? {} : { auto_archive_duration: channel.default_auto_archive_duration },
					message: starterBody
				} });
			}, "forum-thread", { safety: "non-idempotent-create" }));
			const threadId = threadRes.id;
			deliveryThreadId = threadId;
			const messageId = threadRes.message?.id ?? threadId;
			const resultChannelId = threadRes.message?.channel_id ?? threadId;
			const remainingChunks = chunks.slice(1);
			const starterResult = createDiscordSendResult({
				result: {
					id: messageId,
					channel_id: resultChannelId
				},
				fallbackChannelId: channelId,
				kind: "text",
				threadId
			});
			deliveredResults.push(starterResult);
			await opts.onDeliveryResult?.(starterResult);
			await sendWithError(threadId, async () => {
				let textChunks = remainingChunks;
				if (opts.mediaUrl) {
					const [mediaCaption, ...afterMediaChunks] = remainingChunks;
					await sendDiscordMedia({
						...textSendOptions,
						...mediaSendOptions,
						channelId: threadId,
						text: mediaCaption ?? "",
						mediaUrl: opts.mediaUrl
					});
					textChunks = afterMediaChunks;
				}
				for (const chunk of textChunks) await sendDiscordChunks({
					...textSendOptions,
					channelId: threadId,
					text: chunk
				});
			});
			recordChannelActivity({
				channel: "discord",
				accountId: accountInfo.accountId,
				direction: "outbound"
			});
			return {
				...starterResult,
				receipt: createDiscordSendReceiptFromResults({
					results: deliveredResults,
					threadId
				})
			};
		}
		const result = await sendWithError(channelId, async () => {
			const message = {
				...textSendOptions,
				channelId,
				text: textWithMentions,
				reply: opts.reply,
				components: opts.components,
				embeds: opts.embeds
			};
			return opts.mediaUrl ? await sendDiscordMedia({
				...message,
				...mediaSendOptions,
				mediaUrl: opts.mediaUrl
			}) : await sendDiscordChunks(message);
		});
		recordChannelActivity({
			channel: "discord",
			accountId: accountInfo.accountId,
			direction: "outbound"
		});
		return {
			...createDiscordSendResult({
				result,
				fallbackChannelId: channelId,
				kind: "text"
			}),
			receipt: createDiscordSendReceiptFromResults({ results: deliveredResults })
		};
	});
}
async function sendStickerDiscord(to, stickerIds, opts) {
	return sendDiscordStructuredMessage(to, opts, "sticker", () => ({ sticker_ids: normalizeStickerIds(stickerIds) }));
}
async function sendPollDiscord(to, poll, opts) {
	return sendDiscordStructuredMessage(to, opts, "poll", () => {
		if (poll.durationSeconds !== void 0) throw new Error("Discord polls do not support durationSeconds; use durationHours");
		return { poll: normalizeDiscordPollInput(poll) };
	});
}
async function sendDiscordStructuredMessage(to, opts, kind, buildPayload) {
	return withDiscordRequestAuthority(opts.assertPlatformSendAuthorized, async () => {
		const cfg = requireRuntimeConfig(opts.cfg, "Discord structured send");
		const { rest, request, account } = createDiscordClient({
			...opts,
			cfg
		});
		const recipient = await parseAndResolveDiscordTarget(to, {
			cfg,
			accountId: account.accountId
		}, { defaultKind: "channel" });
		const { channelId } = await resolveChannelId(rest, recipient, request);
		const content = opts.content?.trim() ? rewriteDiscordKnownMentions(opts.content, {
			accountId: account.accountId,
			mentionAliases: account.config.mentionAliases
		}) : void 0;
		const suppressEmbeds = resolveDiscordSuppressEmbeds({
			configured: account.config.suppressEmbeds,
			override: opts.suppressEmbeds
		});
		const payload = buildPayload();
		const flags = resolveDiscordMessageFlags({
			silent: opts.silent,
			suppressEmbeds
		});
		const body = {
			content: content || void 0,
			...payload,
			nonce: createDiscordMessageNonce(),
			enforce_nonce: true,
			...flags ? { flags } : {}
		};
		const result = await request(async () => {
			await opts.onPlatformSendDispatch?.();
			opts.assertPlatformSendAuthorized?.();
			return createChannelMessage(rest, channelId, { body });
		}, kind, { safety: "nonce-protected-create" });
		recordChannelActivity({
			channel: "discord",
			accountId: account.accountId,
			direction: "outbound"
		});
		return createDiscordSendResult({
			result,
			fallbackChannelId: channelId,
			kind: kind === "poll" ? "poll" : "card",
			threadId: kind === "poll" ? opts.threadId : void 0
		});
	});
}
export { prepareDiscordOutboundText as a, send_outbound_exports as i, sendPollDiscord as n, discordTextHasBroadcastMention as o, sendStickerDiscord as r, formatMention as s, sendMessageDiscord as t };
