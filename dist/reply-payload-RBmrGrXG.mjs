import { a as asOptionalRecord } from "./record-coerce-DItp3I4t.mjs";
import { g as readStringValue, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { o as hasReplyPayloadContent } from "./payload-COvcWceu.mjs";
import "./reply-payload-B2ZQhznY.mjs";
import { u as projectMediaFacts } from "./media-facts-BEHTU0wM.mjs";
import { n as normalizeOutboundLocation } from "./location-Ce8_SVWn.mjs";
import { a as resolveSendableOutboundReplyParts, i as resolveOutboundMediaUrls } from "./reply-payload-parts-G378iYNJ.mjs";
import { n as createReplyToFanout } from "./reply-policy-B3zWXBNP.mjs";
//#region src/infra/outbound/reply-payload-normalize.ts
/** Extract the supported outbound reply fields from loose tool or agent payload objects. */
function normalizeOutboundReplyPayloadCore(payload) {
	const text = readStringValue(payload.text);
	const mediaUrls = Array.isArray(payload.mediaUrls) ? payload.mediaUrls.filter((entry) => typeof entry === "string" && entry.length > 0) : void 0;
	const mediaUrl = readStringValue(payload.mediaUrl);
	const presentation = asOptionalRecord(payload.presentation);
	const presentationTextMode = payload.presentationTextMode === "fallback" ? "fallback" : void 0;
	const interactive = asOptionalRecord(payload.interactive);
	const channelData = asOptionalRecord(payload.channelData);
	const sensitiveMedia = payload.sensitiveMedia === true ? true : void 0;
	const replyToId = readStringValue(payload.replyToId);
	const location = normalizeOutboundLocation(payload.location);
	const videoAsNote = payload.videoAsNote === true ? true : void 0;
	return {
		text,
		mediaUrls,
		mediaUrl,
		presentation,
		...presentationTextMode ? { presentationTextMode } : {},
		interactive,
		channelData,
		sensitiveMedia,
		replyToId,
		...location ? { location } : {},
		...videoAsNote ? { videoAsNote: true } : {}
	};
}
//#endregion
//#region src/channels/plugins/media-payload.ts
/**
* Builds single-item and list legacy media fields.
* @deprecated Inbound contexts use `media`; outbound replies use lowercase
* `ReplyPayload.mediaUrl`/`mediaUrls`.
*/
function buildMediaPayload(mediaList, opts) {
	const projected = projectMediaFacts(mediaList, "compact");
	return opts?.preserveMediaTypeCardinality ? {
		...projected,
		MediaTypes: mediaList.map((entry) => entry.contentType ?? "")
	} : projected;
}
//#endregion
//#region src/plugin-sdk/reply-payload.ts
/** Read bounded Gateway-owned option ordering for one native ask_user question. */
function resolveAskUserQuestionOptionIndices(payload) {
	const askUser = payload.channelData?.askUser;
	if (!askUser || typeof askUser !== "object" || Array.isArray(askUser)) return;
	const { questionId, optionValues } = askUser;
	if (typeof questionId !== "string" || !questionId || !Array.isArray(optionValues) || optionValues.length < 2 || optionValues.length > 4) return;
	const optionIndices = /* @__PURE__ */ new Map();
	for (const [optionIndex, optionValue] of optionValues.entries()) {
		if (typeof optionValue !== "string") return;
		const normalizedOptionValue = optionValue.trim().toLowerCase();
		if (!normalizedOptionValue || optionIndices.has(normalizedOptionValue)) return;
		optionIndices.set(normalizedOptionValue, optionIndex);
	}
	return /* @__PURE__ */ new Map([[questionId, optionIndices]]);
}
/** Match one presented choice to its Gateway-owned option index. */
function resolveAskUserQuestionOptionIndex(params) {
	return params.questionOptionIndices?.get(params.questionId)?.get(params.optionValue.trim().toLowerCase());
}
const REASONING_PREFIX_RE = /^(?:reasoning:|thinking\.{0,3}(?=\s*(?:>\s*)?_))/u;
function trimLeadingMarkdownQuoteMarkers(text) {
	let candidate = text.trimStart();
	while (candidate.startsWith(">")) candidate = candidate.replace(/^(?:>[ \t]?)+/, "").trimStart();
	return candidate;
}
/** Detect reasoning replies from explicit flags or common reasoning text prefixes. */
function isReasoningReplyPayload(payload) {
	if (payload.isReasoning === true) return true;
	const text = payload.text;
	if (typeof text !== "string") return false;
	const normalized = normalizeLowercaseStringOrEmpty(text.trimStart());
	if (REASONING_PREFIX_RE.test(normalized)) return true;
	const unquoted = normalizeLowercaseStringOrEmpty(trimLeadingMarkdownQuoteMarkers(text));
	return REASONING_PREFIX_RE.test(unquoted);
}
/** Extract the supported outbound reply fields from loose tool or agent payload objects. */
function normalizeOutboundReplyPayload(payload) {
	return normalizeOutboundReplyPayloadCore(payload);
}
/** Wrap a deliverer so callers can hand it arbitrary payloads while channels receive normalized data. */
function createNormalizedOutboundDeliverer(handler) {
	return async (payload) => {
		await handler(payload && typeof payload === "object" ? normalizeOutboundReplyPayload(payload) : {});
	};
}
/** Resolve media URLs from a channel sendPayload context after legacy fallback normalization. */
function resolvePayloadMediaUrls(payload) {
	return resolveOutboundMediaUrls(payload);
}
/** Check whether an outbound payload includes any sendable text, media, or rich reply content. */
function hasOutboundReplyContent(payload, options) {
	return hasReplyPayloadContent(payload, { trimText: options?.trimText });
}
/** Preserve caller-provided chunking, but fall back to the full text when chunkers return nothing. */
function resolveTextChunksWithFallback(text, chunks) {
	if (chunks.length > 0) return [...chunks];
	if (!text) return [];
	return [text];
}
/** Send media-first payloads intact, or chunk text-only payloads through the caller's transport hooks. */
async function sendPayloadWithChunkedTextAndMedia(params) {
	const payload = params.ctx.payload;
	const text = payload.text ?? "";
	const urls = resolveOutboundMediaUrls(payload);
	if (!text && urls.length === 0) return params.emptyResult;
	const [firstUrl, ...remainingUrls] = urls;
	if (firstUrl !== void 0) {
		let lastResult = await params.sendMedia({
			...params.ctx,
			text,
			mediaUrl: firstUrl
		});
		await params.onResult?.(lastResult);
		for (const mediaUrl of remainingUrls) {
			lastResult = await params.sendMedia({
				...params.ctx,
				text: "",
				mediaUrl
			});
			await params.onResult?.(lastResult);
		}
		return lastResult;
	}
	const limit = params.textChunkLimit;
	const [firstChunk, ...remainingChunks] = resolveTextChunksWithFallback(text, limit && params.chunker ? params.chunker(text, limit) : [text]);
	if (firstChunk === void 0) return params.emptyResult;
	let lastResult = await params.sendText({
		...params.ctx,
		text: firstChunk
	});
	await params.onResult?.(lastResult);
	for (const chunk of remainingChunks) {
		lastResult = await params.sendText({
			...params.ctx,
			text: chunk
		});
		await params.onResult?.(lastResult);
	}
	return lastResult;
}
/**
* Sends non-empty media URLs with caption text on the first actual send.
* Returns the last send result, or undefined when every URL is empty.
*/
async function sendPayloadMediaSequence(params) {
	let lastResult;
	let hasSent = false;
	for (let i = 0; i < params.mediaUrls.length; i += 1) {
		const mediaUrl = params.mediaUrls[i];
		if (!mediaUrl) continue;
		const isFirst = !hasSent;
		lastResult = await params.send({
			text: isFirst ? params.text : "",
			mediaUrl,
			index: i,
			isFirst
		});
		hasSent = true;
		await params.onResult?.(lastResult);
	}
	return lastResult;
}
/** Sends text chunks sequentially and returns the last send result. */
async function sendPayloadTextChunkSequence(params) {
	let lastResult;
	for (let index = 0; index < params.chunks.length; index += 1) {
		lastResult = await params.send({
			text: params.chunks[index],
			index,
			isFirst: index === 0
		});
		await params.onResult?.(lastResult);
	}
	return lastResult;
}
/** Sends a media sequence or returns a fallback when no media item is sent. */
async function sendPayloadMediaSequenceOrFallback(params) {
	let hasSent = false;
	let lastResult = params.fallbackResult;
	await sendPayloadMediaSequence({
		...params,
		send: async (input) => {
			const result = await params.send(input);
			hasSent = true;
			lastResult = result;
			return result;
		}
	});
	if (hasSent) return lastResult;
	return params.sendNoMedia ? await params.sendNoMedia() : params.fallbackResult;
}
/** Sends media when present, then always runs finalization and returns its result. */
async function sendPayloadMediaSequenceAndFinalize(params) {
	if (params.mediaUrls.length > 0) await sendPayloadMediaSequence(params);
	return await params.finalize();
}
/** Sends normalized text/media payloads through a channel outbound adapter. */
async function sendTextMediaPayload(params) {
	const text = params.ctx.payload.text ?? "";
	const urls = resolvePayloadMediaUrls(params.ctx.payload);
	if (!text && urls.length === 0) return {
		channel: params.channel,
		messageId: ""
	};
	const nextReplyToId = createReplyToFanout(params.ctx);
	if (urls.length > 0) {
		const audioAsVoice = params.ctx.payload.audioAsVoice ?? params.ctx.audioAsVoice;
		let hasSent = false;
		const lastResult = await sendPayloadMediaSequence({
			text,
			mediaUrls: urls,
			send: async ({ text: textLocal, mediaUrl }) => {
				let childReported = false;
				const result = await params.adapter.sendMedia({
					...params.ctx,
					text: textLocal,
					mediaUrl,
					...audioAsVoice === void 0 ? {} : { audioAsVoice },
					replyToId: nextReplyToId(),
					onDeliveryResult: async (deliveryResult) => {
						childReported = true;
						await params.ctx.onDeliveryResult?.(deliveryResult);
					}
				});
				if (!childReported) await params.ctx.onDeliveryResult?.(result);
				hasSent = true;
				return result;
			}
		});
		if (hasSent) return lastResult;
	}
	if (!text) return {
		channel: params.channel,
		messageId: ""
	};
	const limit = params.adapter.textChunkLimit;
	const chunks = resolveTextChunksWithFallback(text, limit && params.adapter.chunker ? params.adapter.chunker(text, limit, { formatting: params.ctx.formatting }) : [text]);
	let lastResult;
	for (const chunk of chunks) {
		let childReported = false;
		lastResult = await params.adapter.sendText({
			...params.ctx,
			text: chunk,
			replyToId: nextReplyToId(),
			onDeliveryResult: async (deliveryResult) => {
				childReported = true;
				await params.ctx.onDeliveryResult?.(deliveryResult);
			}
		});
		if (!childReported) await params.ctx.onDeliveryResult?.(lastResult);
	}
	return lastResult;
}
/** Detect numeric-looking target ids for channels that distinguish ids from handles. */
function isNumericTargetId(raw) {
	const trimmed = raw.trim();
	if (!trimmed) return false;
	return /^\d{3,}$/.test(trimmed);
}
/** Append attachment links to plain text when the channel cannot send media inline. */
function formatTextWithAttachmentLinks(text, mediaUrls) {
	const trimmedText = text?.trim() ?? "";
	if (!trimmedText && mediaUrls.length === 0) return "";
	const mediaBlock = mediaUrls.length ? mediaUrls.map((url) => `Attachment: ${url}`).join("\n") : "";
	if (!trimmedText) return mediaBlock;
	if (!mediaBlock) return trimmedText;
	return `${trimmedText}\n\n${mediaBlock}`;
}
/** Send a caption with only the first media item, mirroring caption-limited channel transports. */
async function sendMediaWithLeadingCaption(params) {
	if (params.mediaUrls.length === 0) return false;
	for (const [index, mediaUrl] of params.mediaUrls.entries()) {
		const isFirst = index === 0;
		const caption = isFirst ? params.caption : void 0;
		try {
			await params.send({
				mediaUrl,
				caption
			});
		} catch (error) {
			if (params.onError) {
				await params.onError({
					error,
					mediaUrl,
					caption,
					index,
					isFirst
				});
				continue;
			}
			throw error;
		}
	}
	return true;
}
/** Deliver media with leading caption when possible, otherwise fall back to chunked text. */
async function deliverTextOrMediaReply(params) {
	const { mediaUrls } = resolveSendableOutboundReplyParts(params.payload, { text: params.text });
	if (await sendMediaWithLeadingCaption({
		mediaUrls,
		caption: params.text,
		send: params.sendMedia,
		onError: params.onMediaError
	})) return "media";
	if (!params.text) return "empty";
	const chunks = resolveTextChunksWithFallback(params.text.trim() ? params.text : "", params.chunkText ? params.chunkText(params.text) : [params.text]);
	let sentText = false;
	for (const chunk of chunks) {
		if (!chunk) continue;
		await params.sendText(chunk);
		sentText = true;
	}
	return sentText ? "text" : "empty";
}
/** Send text with attachment links appended for channels without native media upload. */
async function deliverFormattedTextWithAttachments(params) {
	const text = formatTextWithAttachmentLinks(params.payload.text, resolveOutboundMediaUrls(params.payload));
	if (!text) return false;
	await params.send({
		text,
		replyToId: params.payload.replyToId
	});
	return true;
}
//#endregion
export { sendPayloadTextChunkSequence as _, hasOutboundReplyContent as a, buildMediaPayload as b, normalizeOutboundReplyPayload as c, resolvePayloadMediaUrls as d, resolveTextChunksWithFallback as f, sendPayloadMediaSequenceOrFallback as g, sendPayloadMediaSequenceAndFinalize as h, formatTextWithAttachmentLinks as i, resolveAskUserQuestionOptionIndex as l, sendPayloadMediaSequence as m, deliverFormattedTextWithAttachments as n, isNumericTargetId as o, sendMediaWithLeadingCaption as p, deliverTextOrMediaReply as r, isReasoningReplyPayload as s, createNormalizedOutboundDeliverer as t, resolveAskUserQuestionOptionIndices as u, sendPayloadWithChunkedTextAndMedia as v, normalizeOutboundReplyPayloadCore as x, sendTextMediaPayload as y };
