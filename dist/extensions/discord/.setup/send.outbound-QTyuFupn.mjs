import { C as withDiscordRequestAuthority, ct as createThread, st as createChannelMessage } from "./discord-BXpHW-cu.mjs";
import { i as normalizeDiscordHandleKey, o as resolveDiscordDirectoryUserId } from "./directory-live--EGTH0DC.mjs";
import { c as createDiscordSendReceiptFromResults, d as createReusableDiscordReplyReference, l as createDiscordSendResult } from "./retry-BEYkDy0P.mjs";
import { A as resolveDiscordSendComponents, D as buildDiscordMessageRequest, K as parseAndResolveChannelRecipient, M as resolveDiscordSuppressEmbeds, N as createDiscordClient, O as createDiscordMessageNonce, a as normalizeDiscordPollInput, c as normalizeStickerIds, f as sendDiscordMedia, j as resolveDiscordSendEmbeds, k as resolveDiscordMessageFlags, l as resolveChannelId, n as buildDiscordTextChunks, p as sendDiscordText, t as buildDiscordSendError, u as resolveDiscordChannel } from "./send.shared-VNvWfX2T.mjs";
import { ChannelType } from "discord-api-types/v10";
import { expectDefined } from "openclaw/plugin-sdk/expect-runtime";
import { normalizeLowercaseStringOrEmpty, normalizeOptionalString, normalizeOptionalStringifiedId } from "openclaw/plugin-sdk/string-coerce-runtime";
import { recordChannelActivity } from "openclaw/plugin-sdk/channel-activity-runtime";
import { requireRuntimeConfig } from "openclaw/plugin-sdk/plugin-config-runtime";
import { truncateUtf16Safe } from "openclaw/plugin-sdk/text-utility-runtime";
import { resolveChunkMode } from "openclaw/plugin-sdk/reply-chunking";
import { resolveMarkdownTableMode } from "openclaw/plugin-sdk/markdown-table-runtime";
import { fromMarkdown } from "mdast-util-from-markdown";
import { convertMarkdownTables } from "openclaw/plugin-sdk/text-chunking";
//#region extensions/discord/src/mentions.ts
const MENTION_CANDIDATE_PATTERN = /(^|[\s([{"'.,;:!?])@([a-z0-9_.-]{2,32}(?:#[0-9]{4})?)/gi;
const DISCORD_RESERVED_MENTIONS = /* @__PURE__ */ new Set(["everyone", "here"]);
const DISCORD_DISCRIMINATOR_SUFFIX = /#\d{4}$/;
const DISCORD_BROADCAST_MENTION_PATTERN = /@(everyone|here)\b/;
function normalizeSnowflake(value) {
	const text = normalizeOptionalStringifiedId(value) ?? "";
	if (!/^\d+$/.test(text)) return null;
	return text;
}
function formatMention(params) {
	const userId = params.userId == null ? null : normalizeSnowflake(params.userId);
	const roleId = params.roleId == null ? null : normalizeSnowflake(params.roleId);
	const channelId = params.channelId == null ? null : normalizeSnowflake(params.channelId);
	const values = [
		userId ? {
			kind: "user",
			id: userId
		} : null,
		roleId ? {
			kind: "role",
			id: roleId
		} : null,
		channelId ? {
			kind: "channel",
			id: channelId
		} : null
	].filter((entry) => Boolean(entry));
	if (values.length !== 1) throw new Error("formatMention requires exactly one of userId, roleId, or channelId");
	const target = expectDefined(values.at(0), "single Discord mention target");
	if (target.kind === "user") return `<@${target.id}>`;
	if (target.kind === "role") return `<@&${target.id}>`;
	return `<#${target.id}>`;
}
function resolveConfiguredMentionAlias(handle, mentionAliases) {
	const key = normalizeDiscordHandleKey(handle);
	if (!key || !mentionAliases) return;
	const withoutDiscriminator = key.replace(DISCORD_DISCRIMINATOR_SUFFIX, "");
	for (const [rawAlias, rawUserId] of Object.entries(mentionAliases)) {
		const alias = normalizeDiscordHandleKey(rawAlias);
		if (!alias) continue;
		const aliasWithoutDiscriminator = alias.replace(DISCORD_DISCRIMINATOR_SUFFIX, "");
		if (alias === key || withoutDiscriminator && withoutDiscriminator !== key && alias === withoutDiscriminator || aliasWithoutDiscriminator && aliasWithoutDiscriminator !== alias && aliasWithoutDiscriminator === key) {
			const userId = normalizeSnowflake(rawUserId);
			if (userId) return userId;
		}
	}
}
function rewritePlainTextMentions(text, params) {
	if (!text.includes("@")) return text;
	return text.replace(MENTION_CANDIDATE_PATTERN, (match, prefix, rawHandle) => {
		const handle = normalizeOptionalString(rawHandle) ?? "";
		if (!handle) return match;
		const lookup = normalizeLowercaseStringOrEmpty(handle);
		if (DISCORD_RESERVED_MENTIONS.has(lookup)) return match;
		const userId = resolveConfiguredMentionAlias(handle, params.mentionAliases) ?? resolveDiscordDirectoryUserId({
			accountId: params.accountId,
			handle
		});
		if (!userId) return match;
		return `${String(prefix ?? "")}${formatMention({ userId })}`;
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
//#endregion
//#region extensions/discord/src/markdown.ts
const DISCORD_NATIVE_TOKEN_RE = /<a?:[A-Za-z0-9_]+:\d+>|<\/[^>]+:\d+>/giu;
const DISCORD_URL_START_RE = /(?:[A-Za-z][A-Za-z0-9+.-]*:\/\/|www\.)/giu;
function findDiscordUrlRanges(markdown) {
	const ranges = [];
	for (const match of markdown.matchAll(DISCORD_URL_START_RE)) {
		const start = match.index;
		if (start === void 0) continue;
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
		ranges.push({
			start,
			end
		});
	}
	return ranges;
}
function markdownSemanticSignature(root) {
	const parts = [];
	const pending = [{
		node: root,
		parentStrong: false
	}];
	while (pending.length > 0) {
		const event = pending.pop();
		if (!event) continue;
		if (event.exiting) {
			parts.push(")");
			continue;
		}
		const { node } = event;
		const redundantStrong = event.parentStrong && node.type === "strong";
		const fields = Object.fromEntries(Object.entries(node).filter(([key]) => key !== "children" && key !== "position"));
		const children = node.children ?? [];
		if (!redundantStrong) {
			parts.push(`(${JSON.stringify(fields)}`);
			pending.push({
				node,
				parentStrong: event.parentStrong,
				exiting: true
			});
		}
		const parentStrong = event.parentStrong || node.type === "strong";
		for (let index = children.length - 1; index >= 0; index -= 1) {
			const child = children[index];
			if (child) pending.push({
				node: child,
				parentStrong
			});
		}
	}
	return parts.join("\n");
}
function normalizeDiscordBold(markdown) {
	if (!markdown.includes("__")) return markdown;
	const spans = [];
	const contentEdits = [];
	const starEmphasisDelimiters = /* @__PURE__ */ new Set();
	const astLinkRanges = [];
	const sourceTree = fromMarkdown(markdown);
	const activeSpanIds = [];
	const pending = [{ node: sourceTree }];
	while (pending.length > 0) {
		const event = pending.pop();
		if (!event) continue;
		if (event.exiting !== void 0) {
			activeSpanIds.pop();
			continue;
		}
		const { node } = event;
		const start = node.position?.start.offset;
		const end = node.position?.end.offset;
		if (node.type === "link" && start !== void 0 && end !== void 0 && markdown[start] === "<" && markdown[end - 1] === ">") astLinkRanges.push({
			start,
			end
		});
		let enteredSpanId;
		if (node.type === "strong" && start !== void 0 && end !== void 0 && markdown.startsWith("__", start) && markdown.slice(end - 2, end) === "__") {
			enteredSpanId = spans.length;
			spans.push({
				start,
				end
			});
			activeSpanIds.push(enteredSpanId);
		}
		const spanId = activeSpanIds.at(-1);
		if (spanId !== void 0 && start !== void 0 && end !== void 0) {
			if (node.type === "strong" && enteredSpanId === void 0 && markdown.startsWith("**", start) && markdown.slice(end - 2, end) === "**") contentEdits.push({
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
		if (enteredSpanId !== void 0) pending.push({
			node,
			exiting: enteredSpanId
		});
		const children = node.children ?? [];
		for (let index = children.length - 1; index >= 0; index -= 1) {
			const child = children[index];
			if (child) pending.push({ node: child });
		}
	}
	if (spans.length === 0) return markdown;
	const strongInteriorStartByEnd = /* @__PURE__ */ new Map();
	for (const span of spans) {
		const interiorStart = span.start + 2;
		strongInteriorStartByEnd.set(span.end, Math.min(strongInteriorStartByEnd.get(span.end) ?? interiorStart, interiorStart));
	}
	const nativeTokenRanges = [...markdown.matchAll(DISCORD_NATIVE_TOKEN_RE)].flatMap((match) => match.index === void 0 ? [] : [{
		start: match.index,
		end: match.index + match[0].length
	}]);
	const protectedRanges = [
		...findDiscordUrlRanges(markdown),
		...astLinkRanges,
		...nativeTokenRanges
	].toSorted((left, right) => left.start - right.start).map(({ start, end: rawEnd }) => {
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
	}))), ...contentEdits].toSorted((left, right) => left.start - right.start);
	const editsBySpan = /* @__PURE__ */ new Map();
	for (const edit of edits) {
		const spanEdits = editsBySpan.get(edit.spanId);
		if (spanEdits) spanEdits.push(edit);
		else editsBySpan.set(edit.spanId, [edit]);
	}
	const renderEdits = (selectedEdits, start = 0, end = markdown.length) => {
		let cursor = start;
		let rendered = "";
		for (const edit of selectedEdits) {
			rendered += `${markdown.slice(cursor, edit.start)}${edit.marker}`;
			cursor = edit.start + edit.consume;
		}
		return rendered + markdown.slice(cursor, end);
	};
	const protectedSpanIds = /* @__PURE__ */ new Set();
	const protectedEditKeys = /* @__PURE__ */ new Set();
	const spansWithProtectedContent = /* @__PURE__ */ new Set();
	let rangeIndex = 0;
	for (const edit of edits) {
		while ((protectedRanges[rangeIndex]?.end ?? Number.POSITIVE_INFINITY) <= edit.start) rangeIndex += 1;
		const range = protectedRanges[rangeIndex];
		if (range && (edit.consume === 0 ? edit.start >= range.start && edit.start < range.end : edit.start < range.end && edit.start + edit.consume > range.start)) {
			if (edit.delimiter) protectedSpanIds.add(edit.spanId);
			else {
				protectedEditKeys.add(`${edit.start}:${edit.consume}:${edit.marker}`);
				spansWithProtectedContent.add(edit.spanId);
			}
		}
	}
	for (const spanId of spansWithProtectedContent) {
		const span = spans[spanId];
		if (!span) continue;
		const localRendered = renderEdits((editsBySpan.get(spanId) ?? []).filter((edit) => {
			const key = `${edit.start}:${edit.consume}:${edit.marker}`;
			return !protectedEditKeys.has(key);
		}), span.start, span.end);
		const localSource = markdown.slice(span.start, span.end);
		if (markdownSemanticSignature(fromMarkdown(localRendered)) !== markdownSemanticSignature(fromMarkdown(localSource))) protectedSpanIds.add(spanId);
	}
	const seenEdits = /* @__PURE__ */ new Set();
	const rendered = renderEdits(edits.filter((edit) => {
		const key = `${edit.start}:${edit.consume}:${edit.marker}`;
		if (protectedSpanIds.has(edit.spanId) || protectedEditKeys.has(key) || seenEdits.has(key)) return false;
		seenEdits.add(key);
		return true;
	}));
	return markdownSemanticSignature(fromMarkdown(rendered)) === markdownSemanticSignature(sourceTree) ? rendered : markdown;
}
function renderDiscordMarkdown(markdown, tableMode) {
	return normalizeDiscordBold(convertMarkdownTables(markdown, tableMode));
}
//#endregion
//#region extensions/discord/src/outbound-text.ts
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
//#endregion
//#region extensions/discord/src/send.outbound.ts
const DEFAULT_DISCORD_MEDIA_MAX_MB = 100;
/** Discord's ChannelFlags.RequireTag is bit 4 on forum/media parent channels. */
const DISCORD_FORUM_REQUIRE_TAG_FLAG = 16;
async function sendDiscordThreadTextChunks(params) {
	for (const chunk of params.chunks) await sendDiscordText({
		rest: params.rest,
		channelId: params.threadId,
		text: chunk,
		request: params.request,
		maxLinesPerMessage: params.maxLinesPerMessage,
		chunkMode: params.chunkMode,
		silent: params.silent,
		suppressEmbeds: params.suppressEmbeds,
		allowedMentions: params.allowedMentions,
		maxChars: params.maxChars,
		onResult: params.onResult,
		onPlatformSendDispatch: params.onPlatformSendDispatch,
		assertPlatformSendAuthorized: params.assertPlatformSendAuthorized
	});
}
/** Discord thread names are capped at 100 characters. */
const DISCORD_THREAD_NAME_LIMIT = 100;
/** Derive a thread title from the first non-empty line of the message text. */
function deriveForumThreadName(text) {
	const firstLine = normalizeOptionalString(text.split("\n").find((line) => normalizeOptionalString(line))) ?? "";
	return truncateUtf16Safe(firstLine, DISCORD_THREAD_NAME_LIMIT) || (/* @__PURE__ */ new Date()).toISOString().slice(0, 16);
}
/** Forum/Media channels cannot receive regular messages; detect them here. */
function isForumLikeChannel(channel) {
	return channel?.type === ChannelType.GuildForum || channel?.type === ChannelType.GuildMedia;
}
function toDiscordSendResult(result, fallbackChannelId, params = {}) {
	const resultParams = {
		result,
		fallbackChannelId,
		kind: params.kind ?? "text"
	};
	if (params.threadId != null) resultParams.threadId = params.threadId;
	if (params.reply) resultParams.reply = params.reply;
	return createDiscordSendResult(resultParams);
}
async function resolveDiscordSendTarget(to, opts) {
	const cfg = requireRuntimeConfig(opts.cfg, "Discord send target resolution");
	const { rest, request, account } = createDiscordClient({
		...opts,
		cfg
	});
	const recipient = await parseAndResolveChannelRecipient(to, cfg, account.accountId);
	const { channelId } = await resolveChannelId(rest, recipient, request);
	return {
		rest,
		request,
		channelId,
		account
	};
}
async function sendMessageDiscord(to, text, opts) {
	return await withDiscordRequestAuthority(opts.assertPlatformSendAuthorized, () => sendMessageDiscordInternal(to, text, opts));
}
async function sendMessageDiscordInternal(to, text, opts) {
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
	const recipient = await parseAndResolveChannelRecipient(to, cfg, accountInfo.accountId);
	const { channelId } = await resolveChannelId(rest, recipient, request);
	const channel = await resolveDiscordChannel(rest, channelId);
	const deliveredResults = [];
	let deliveryThreadId;
	const reportResult = async (progressResult, kind, replyToId) => {
		const deliveredResult = toDiscordSendResult(progressResult, deliveryThreadId ?? channelId, {
			kind,
			threadId: deliveryThreadId,
			reply: createReusableDiscordReplyReference(replyToId)
		});
		deliveredResults.push(deliveredResult);
		await opts.onDeliveryResult?.(deliveredResult);
	};
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
		let threadRes;
		try {
			threadRes = await request(async () => {
				await opts.onPlatformSendDispatch?.();
				opts.assertPlatformSendAuthorized?.();
				return createThread(rest, channelId, { body: {
					name: threadName,
					...channel.default_auto_archive_duration === void 0 ? {} : { auto_archive_duration: channel.default_auto_archive_duration },
					message: starterBody
				} });
			}, "forum-thread", { safety: "non-idempotent-create" });
		} catch (err) {
			throw await buildDiscordSendError(err, {
				channelId,
				cfg,
				rest,
				token,
				hasMedia: Boolean(opts.mediaUrl)
			});
		}
		const threadId = threadRes.id;
		deliveryThreadId = threadId;
		const messageId = threadRes.message?.id ?? threadId;
		const resultChannelId = threadRes.message?.channel_id ?? threadId;
		const remainingChunks = chunks.slice(1);
		const starterResult = toDiscordSendResult({
			id: messageId,
			channel_id: resultChannelId
		}, channelId, {
			kind: "text",
			threadId
		});
		deliveredResults.push(starterResult);
		await opts.onDeliveryResult?.(starterResult);
		try {
			if (opts.mediaUrl) {
				const [mediaCaption, ...afterMediaChunks] = remainingChunks;
				await sendDiscordMedia({
					rest,
					channelId: threadId,
					text: mediaCaption ?? "",
					mediaUrl: opts.mediaUrl,
					filename: opts.filename,
					mediaAccess: opts.mediaAccess,
					mediaLocalRoots: opts.mediaLocalRoots,
					mediaReadFile: opts.mediaReadFile,
					maxBytes: mediaMaxBytes,
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
				});
				await sendDiscordThreadTextChunks({
					rest,
					threadId,
					chunks: afterMediaChunks,
					request,
					maxLinesPerMessage,
					chunkMode,
					maxChars: textLimit,
					silent: opts.silent,
					suppressEmbeds,
					allowedMentions: opts.allowedMentions,
					onResult: reportResult,
					onPlatformSendDispatch: opts.onPlatformSendDispatch,
					assertPlatformSendAuthorized: opts.assertPlatformSendAuthorized
				});
			} else await sendDiscordThreadTextChunks({
				rest,
				threadId,
				chunks: remainingChunks,
				request,
				maxLinesPerMessage,
				chunkMode,
				maxChars: textLimit,
				silent: opts.silent,
				suppressEmbeds,
				allowedMentions: opts.allowedMentions,
				onResult: reportResult,
				onPlatformSendDispatch: opts.onPlatformSendDispatch,
				assertPlatformSendAuthorized: opts.assertPlatformSendAuthorized
			});
		} catch (err) {
			throw await buildDiscordSendError(err, {
				channelId: threadId,
				cfg,
				rest,
				token,
				hasMedia: Boolean(opts.mediaUrl)
			});
		}
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
	let result;
	try {
		if (opts.mediaUrl) result = await sendDiscordMedia({
			rest,
			channelId,
			text: textWithMentions,
			mediaUrl: opts.mediaUrl,
			filename: opts.filename,
			mediaAccess: opts.mediaAccess,
			mediaLocalRoots: opts.mediaLocalRoots,
			mediaReadFile: opts.mediaReadFile,
			maxBytes: mediaMaxBytes,
			reply: opts.reply,
			request,
			maxLinesPerMessage,
			components: opts.components,
			embeds: opts.embeds,
			chunkMode,
			silent: opts.silent,
			suppressEmbeds,
			allowedMentions: opts.allowedMentions,
			maxChars: textLimit,
			onResult: reportResult,
			onPlatformSendDispatch: opts.onPlatformSendDispatch,
			assertPlatformSendAuthorized: opts.assertPlatformSendAuthorized
		});
		else result = await sendDiscordText({
			rest,
			channelId,
			text: textWithMentions,
			reply: opts.reply,
			request,
			maxLinesPerMessage,
			components: opts.components,
			embeds: opts.embeds,
			chunkMode,
			silent: opts.silent,
			suppressEmbeds,
			allowedMentions: opts.allowedMentions,
			maxChars: textLimit,
			onResult: reportResult,
			onPlatformSendDispatch: opts.onPlatformSendDispatch,
			assertPlatformSendAuthorized: opts.assertPlatformSendAuthorized
		});
	} catch (err) {
		throw await buildDiscordSendError(err, {
			channelId,
			cfg,
			rest,
			token,
			hasMedia: Boolean(opts.mediaUrl)
		});
	}
	recordChannelActivity({
		channel: "discord",
		accountId: accountInfo.accountId,
		direction: "outbound"
	});
	return {
		...toDiscordSendResult(result, channelId),
		receipt: createDiscordSendReceiptFromResults({ results: deliveredResults })
	};
}
async function sendStickerDiscord(to, stickerIds, opts) {
	return await withDiscordRequestAuthority(opts.assertPlatformSendAuthorized, () => sendStickerDiscordInternal(to, stickerIds, opts));
}
async function sendStickerDiscordInternal(to, stickerIds, opts) {
	const context = await resolveDiscordStructuredSendContext(to, opts);
	const { rewrittenContent, suppressEmbeds } = context;
	const stickers = normalizeStickerIds(stickerIds);
	const flags = resolveDiscordMessageFlags({
		silent: opts.silent,
		suppressEmbeds
	});
	const body = {
		content: rewrittenContent || void 0,
		sticker_ids: stickers,
		nonce: createDiscordMessageNonce(),
		enforce_nonce: true,
		...flags ? { flags } : {}
	};
	return context.send("sticker", body);
}
async function sendPollDiscord(to, poll, opts) {
	return await withDiscordRequestAuthority(opts.assertPlatformSendAuthorized, () => sendPollDiscordInternal(to, poll, opts));
}
async function sendPollDiscordInternal(to, poll, opts) {
	const context = await resolveDiscordStructuredSendContext(to, opts);
	const { rewrittenContent, suppressEmbeds } = context;
	if (poll.durationSeconds !== void 0) throw new Error("Discord polls do not support durationSeconds; use durationHours");
	const payload = normalizeDiscordPollInput(poll);
	const flags = resolveDiscordMessageFlags({
		silent: opts.silent,
		suppressEmbeds
	});
	const body = {
		content: rewrittenContent || void 0,
		poll: payload,
		nonce: createDiscordMessageNonce(),
		enforce_nonce: true,
		...flags ? { flags } : {}
	};
	return context.send("poll", body);
}
async function resolveDiscordStructuredSendContext(to, opts) {
	requireRuntimeConfig(opts.cfg, "Discord structured send");
	const { rest, request, channelId, account: accountInfo } = await resolveDiscordSendTarget(to, opts);
	const content = opts.content;
	return {
		send: async (kind, body) => {
			const result = await request(async () => {
				await opts.onPlatformSendDispatch?.();
				opts.assertPlatformSendAuthorized?.();
				return createChannelMessage(rest, channelId, { body });
			}, kind, { safety: "nonce-protected-create" });
			recordChannelActivity({
				channel: "discord",
				accountId: accountInfo.accountId,
				direction: "outbound"
			});
			return toDiscordSendResult(result, channelId, {
				kind: kind === "poll" ? "poll" : "card",
				threadId: kind === "poll" ? opts.threadId : void 0
			});
		},
		rewrittenContent: content?.trim() ? rewriteDiscordKnownMentions(content, {
			accountId: accountInfo.accountId,
			mentionAliases: accountInfo.config.mentionAliases
		}) : void 0,
		suppressEmbeds: resolveDiscordSuppressEmbeds({
			configured: accountInfo.config.suppressEmbeds,
			override: opts.suppressEmbeds
		})
	};
}
//#endregion
export { discordTextHasBroadcastMention as a, prepareDiscordOutboundText as i, sendPollDiscord as n, formatMention as o, sendStickerDiscord as r, sendMessageDiscord as t };
