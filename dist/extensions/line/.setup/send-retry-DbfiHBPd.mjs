import { i as resolveLineAccount, n as normalizeAccountId, r as resolveDefaultLineAccountId } from "./accounts-BBEFMYbY.mjs";
import { isRecord } from "openclaw/plugin-sdk/string-coerce-runtime";
import { createMessageReceiptFromOutboundResults } from "openclaw/plugin-sdk/channel-outbound";
import { collectErrorGraphCandidates, extractErrorCode, formatErrorMessage } from "openclaw/plugin-sdk/error-runtime";
import { getFileExtension, mimeTypeFromFilePath } from "openclaw/plugin-sdk/media-mime";
import { resolvePinnedHostnameWithPolicy } from "openclaw/plugin-sdk/ssrf-runtime";
import { pruneMapToMaxSize } from "openclaw/plugin-sdk/collection-runtime";
import { logVerbose } from "openclaw/plugin-sdk/runtime-env";
import { runChannelProbe, truncateUtf16Safe } from "openclaw/plugin-sdk/text-utility-runtime";
import { HTTPFetchError } from "@line/bot-sdk";
import { classifyTransientNetworkErrorCode, createChannelApiRetryRunner } from "openclaw/plugin-sdk/retry-runtime";
import { assertOkOrThrowHttpError, createProviderOperationDeadline, createProviderOperationTimeoutResolver, fetchWithTimeout, readProviderJsonResponse } from "openclaw/plugin-sdk/provider-http";
import { fetchWithRuntimeDispatcherOrMockedGlobal } from "openclaw/plugin-sdk/runtime-fetch";
//#region extensions/line/src/messaging-target.ts
function normalizeLineMessagingTarget(target) {
	const trimmed = target.trim();
	if (!trimmed) return;
	return trimmed.replace(/^line:(group|room|user):/i, "").replace(/^line:/i, "");
}
function inferLineTargetChatType(target) {
	const normalized = normalizeLineMessagingTarget(target);
	if (!normalized) return;
	if (/^U[a-f0-9]{32}$/i.test(normalized)) return "direct";
	return /^[CR][a-f0-9]{32}$/i.test(normalized) ? "group" : void 0;
}
//#endregion
//#region extensions/line/src/media-url.ts
function isHttpsUrl(value) {
	if (typeof value !== "string") return false;
	try {
		return new URL(value).protocol === "https:";
	} catch {
		return false;
	}
}
//#endregion
//#region extensions/line/src/outbound-media.ts
const LINE_OUTBOUND_MEDIA_SSRF_POLICY = { allowPrivateNetwork: false };
async function validateLineMediaUrl(url) {
	let parsed;
	try {
		parsed = new URL(url);
	} catch {
		throw new Error("LINE outbound media URL must be a valid URL");
	}
	if (parsed.protocol !== "https:") throw new Error("LINE outbound media URL must use HTTPS");
	if (url.length > 2e3) throw new Error(`LINE outbound media URL must be 2000 chars or less (got ${url.length})`);
	await resolvePinnedHostnameWithPolicy(parsed.hostname, { policy: LINE_OUTBOUND_MEDIA_SSRF_POLICY });
}
const LINE_MEDIA_KIND_BY_MIME = {
	"image/jpeg": "image",
	"image/png": "image",
	"video/mp4": "video",
	"audio/mpeg": "audio",
	"audio/x-m4a": "audio"
};
function detectLineMediaKindFromUrl(url) {
	const mimeType = mimeTypeFromFilePath(url);
	if (mimeType === void 0) return getFileExtension(url) === void 0 ? void 0 : "unsupported";
	return LINE_MEDIA_KIND_BY_MIME[mimeType] ?? "unsupported";
}
function resolveLineMediaKind(url, opts) {
	if (opts.mediaKind !== void 0) return {
		mediaKind: opts.mediaKind,
		kindSource: "declared"
	};
	if (typeof opts.durationMs === "number") return {
		mediaKind: "audio",
		kindSource: "metadata"
	};
	if (opts.trackingId?.trim()) return {
		mediaKind: "video",
		kindSource: "metadata"
	};
	const detected = detectLineMediaKindFromUrl(url);
	return detected === void 0 ? {
		mediaKind: "image",
		kindSource: "fallback"
	} : {
		mediaKind: detected,
		kindSource: "url"
	};
}
async function resolveLineOutboundMedia(mediaUrl, opts = {}) {
	const trimmedUrl = mediaUrl.trim();
	if (isHttpsUrl(trimmedUrl)) {
		await validateLineMediaUrl(trimmedUrl);
		const previewImageUrl = opts.previewImageUrl?.trim();
		if (previewImageUrl) await validateLineMediaUrl(previewImageUrl);
		return {
			mediaUrl: trimmedUrl,
			...resolveLineMediaKind(trimmedUrl, opts),
			...previewImageUrl ? { previewImageUrl } : {},
			...typeof opts.durationMs === "number" ? { durationMs: opts.durationMs } : {},
			...opts.trackingId ? { trackingId: opts.trackingId } : {}
		};
	}
	let parsed;
	try {
		parsed = new URL(trimmedUrl);
	} catch {}
	if (parsed) throw new Error("LINE outbound media URL must use HTTPS");
	throw new Error("LINE outbound media currently requires a public HTTPS URL");
}
function isLineUserTarget(target) {
	const normalized = target.trim().replace(/^line:(group|room|user):/i, "").replace(/^line:/i, "");
	return /^U/i.test(normalized);
}
function createImageMessage(originalContentUrl, previewImageUrl) {
	return {
		type: "image",
		originalContentUrl,
		previewImageUrl: previewImageUrl ?? originalContentUrl
	};
}
function createVideoMessage(originalContentUrl, previewImageUrl, trackingId) {
	return {
		type: "video",
		originalContentUrl,
		previewImageUrl,
		...trackingId ? { trackingId } : {}
	};
}
function createAudioMessage(originalContentUrl, durationMs) {
	return {
		type: "audio",
		originalContentUrl,
		duration: durationMs
	};
}
function lineMediaUrlFallback(mediaUrl) {
	return {
		type: "text",
		text: mediaUrl
	};
}
function buildLineMediaMessageObject(resolved, opts) {
	switch (resolved.mediaKind) {
		case "unsupported": return lineMediaUrlFallback(resolved.mediaUrl);
		case "video": {
			const previewImageUrl = resolved.previewImageUrl?.trim();
			if (previewImageUrl) return createVideoMessage(resolved.mediaUrl, previewImageUrl, opts?.allowTrackingId ? resolved.trackingId : void 0);
			if (resolved.kindSource !== "url") throw new Error("LINE video messages require previewImageUrl to reference an image URL");
			return lineMediaUrlFallback(resolved.mediaUrl);
		}
		case "audio": return createAudioMessage(resolved.mediaUrl, resolved.durationMs ?? 6e4);
		default: return createImageMessage(resolved.mediaUrl, resolved.previewImageUrl);
	}
}
async function buildLineMediaMessage(mediaUrl, opts, target) {
	return buildLineMediaMessageObject(await resolveLineOutboundMedia(mediaUrl, opts), { allowTrackingId: isLineUserTarget(target) });
}
//#endregion
//#region extensions/line/src/quote-tokens.ts
const QUOTE_TOKEN_LIMIT = 500;
const quoteTokensByAccount = /* @__PURE__ */ new Map();
function quoteTokenKey(chatId, messageId) {
	const chat = normalizeLineMessagingTarget(chatId);
	const message = messageId.trim();
	return chat && message ? `${chat}|${message}` : void 0;
}
/** Reads the quote token LINE attaches to the message kinds a person can quote. */
function readLineQuoteToken(message) {
	return message.type === "text" || message.type === "image" || message.type === "video" || message.type === "sticker" ? message.quoteToken : void 0;
}
/** Remembers the token an inbound message can later be quoted with. */
function recordLineQuoteToken(params) {
	const quoteToken = params.quoteToken;
	if (!quoteToken) return;
	const key = quoteTokenKey(params.chatId, params.messageId);
	if (!key) return;
	const tokens = quoteTokensByAccount.get(params.accountId) ?? /* @__PURE__ */ new Map();
	quoteTokensByAccount.set(params.accountId, tokens);
	tokens.delete(key);
	tokens.set(key, quoteToken);
	pruneMapToMaxSize(tokens, QUOTE_TOKEN_LIMIT);
}
/** Resolves the token that quotes one message in one chat, if it is still known. */
function resolveLineQuoteToken(params) {
	const key = params.messageId ? quoteTokenKey(params.chatId, params.messageId) : void 0;
	if (!key) return;
	const accountId = normalizeAccountId(params.accountId ?? resolveDefaultLineAccountId(params.cfg));
	const quoteToken = quoteTokensByAccount.get(accountId)?.get(key);
	if (!quoteToken) logVerbose(`line: account ${accountId} remembers no quote token for ${key}; sending the reply unquoted`);
	return quoteToken;
}
const QUOTABLE_OUTBOUND_TYPES = /* @__PURE__ */ new Set([
	"text",
	"textV2",
	"sticker"
]);
/** True when LINE lets this message carry the quote for its request. */
function canCarryLineQuoteToken(message) {
	return QUOTABLE_OUTBOUND_TYPES.has(message.type);
}
/**
* Reports a reply that answered a message but had nothing able to carry the quote.
*
* Both delivery paths reach this state, and without a line here the silence reads
* as "the quote went out" to anyone who saw the resolve step succeed.
*/
function reportLineQuoteCarrierMissing(chatId) {
	logVerbose(`line: nothing in this reply to ${chatId} can carry a quote; sending it unquoted`);
}
/** Attaches a quote token to the first message in a request that can carry one. */
function applyLineQuoteToken(messages, quoteToken) {
	const target = quoteToken ? messages.findIndex(canCarryLineQuoteToken) : -1;
	return target < 0 ? [...messages] : messages.map((message, index) => index === target ? {
		...message,
		quoteToken
	} : message);
}
/**
* Drops every quote token from a request, or undefined when it carried none.
*
* LINE can refuse a whole request for an invalid quote token without naming a
* field in its error. Offering the same reply without the quote lets delivery
* recover from that rejection.
*/
function withoutLineQuoteTokens(messages) {
	if (!messages.some((message) => "quoteToken" in message)) return;
	return messages.map((message) => "quoteToken" in message ? {
		...message,
		quoteToken: void 0
	} : message);
}
//#endregion
//#region extensions/line/src/flex-templates/message.ts
const LINE_FLEX_BUBBLE_MAX_BYTES = 3e4;
const LINE_FLEX_CAROUSEL_MAX_BYTES = 5e4;
function fitsLineFlexBubble(bubble) {
	return Buffer.byteLength(JSON.stringify(bubble), "utf8") <= LINE_FLEX_BUBBLE_MAX_BYTES;
}
function toFlexMessage(altText, contents) {
	return {
		type: "flex",
		altText,
		contents
	};
}
//#endregion
//#region extensions/line/src/actions.ts
const LINE_ACTION_LABEL_LIMIT = 20;
const LINE_ACTION_DATA_LIMIT = 300;
const LINE_ACTION_URI_LIMIT = 1e3;
const LINE_CLIPBOARD_TEXT_LIMIT = 1e3;
const LINE_RICH_MENU_ALIAS_LIMIT = 32;
const LINE_IMAGEMAP_ACTION_LABEL_LIMIT = 100;
const LINE_IMAGEMAP_MESSAGE_TEXT_LIMIT = 400;
const LINE_IMAGEMAP_EXTERNAL_LINK_LABEL_LIMIT = 30;
const LINE_IMAGEMAP_ACTION_LIMIT = 50;
const graphemeSegmenter = new Intl.Segmenter(void 0, { granularity: "grapheme" });
function truncateLineActionText(text, limit) {
	let result = "";
	let count = 0;
	for (const { segment } of graphemeSegmenter.segment(text)) {
		const codePointCount = Array.from(segment).length;
		if (count + codePointCount > limit) break;
		result += segment;
		count += codePointCount;
	}
	return result;
}
function truncateLineActionLabel(label, limit = LINE_ACTION_LABEL_LIMIT) {
	return truncateLineActionText(label, limit) || (label ? "…" : "");
}
function truncateLineActionData(data) {
	return truncateUtf16Safe(data, LINE_ACTION_DATA_LIMIT);
}
const UNDELIVERABLE_IMAGE_WARNING = "Image unavailable: URL must use HTTPS.";
function flexWarning(text) {
	return {
		type: "text",
		text,
		wrap: true,
		size: "sm",
		color: "#B45309",
		margin: "md"
	};
}
const unavailableActionMarker = Symbol("lineUnavailableAction");
function unavailableAction(kind, reason) {
	const action = {
		type: "message",
		label: "Unavailable",
		text: `${kind} unavailable: ${reason}`
	};
	Object.defineProperty(action, unavailableActionMarker, { value: true });
	return action;
}
const actionTypes = /* @__PURE__ */ new Set([
	"camera",
	"cameraRoll",
	"clipboard",
	"datetimepicker",
	"location",
	"message",
	"postback",
	"richmenuswitch",
	"uri"
]);
function isLineAction(value) {
	return isRecord(value) && typeof value.type === "string" && actionTypes.has(value.type);
}
function isUnavailableAction(action) {
	return action[unavailableActionMarker] === true;
}
function normalizeNestedContent(value, labelLimit, warnings) {
	if (Array.isArray(value)) return value.map((item) => normalizeNestedContent(item, labelLimit, warnings)).filter((item) => item !== void 0);
	if (!isRecord(value)) return value;
	if (warnings && (value.type === "image" || value.type === "icon") && !isHttpsUrl(value.url)) {
		warnings.push(UNDELIVERABLE_IMAGE_WARNING);
		return;
	}
	const normalized = { ...value };
	for (const [key, nested] of Object.entries(value)) if ((key === "action" || key === "defaultAction") && isLineAction(nested)) {
		const action = normalizeLineAction(nested, labelLimit);
		if (warnings && key === "action" && (value.type === "video" && action.type !== "uri" || value.type !== "button" && isUnavailableAction(action))) {
			delete normalized[key];
			warnings.push(isUnavailableAction(action) ? action.text ?? "Action unavailable." : "Action unavailable in this video.");
		} else normalized[key] = action;
	} else if (key === "actions" && Array.isArray(nested)) normalized[key] = nested.map((action) => isLineAction(action) ? normalizeLineAction(action, labelLimit) : action);
	else {
		const content = normalizeNestedContent(nested, labelLimit, warnings);
		if (content === void 0) delete normalized[key];
		else normalized[key] = content;
	}
	if (warnings && value.type === "video") {
		const altContent = normalized.altContent ?? {
			type: "box",
			layout: "vertical",
			contents: [flexWarning(UNDELIVERABLE_IMAGE_WARNING)]
		};
		if (!isHttpsUrl(value.url) || !isHttpsUrl(value.previewUrl)) {
			warnings.push("Video unavailable: video and preview URLs must use HTTPS.");
			return altContent;
		}
		normalized.altContent = altContent;
	}
	return normalized;
}
function normalizeFlexBubble(value, maxBytes = LINE_FLEX_BUBBLE_MAX_BYTES) {
	if (!isRecord(value) || value.type !== "bubble") return normalizeNestedContent(value, 40);
	const warnings = [];
	const normalized = normalizeNestedContent(value, 40, warnings);
	if (!isRecord(normalized) || warnings.length === 0) return normalized;
	const warning = flexWarning([...new Set(warnings)].join("\n"));
	const body = normalized.body;
	const withWarning = {
		...normalized,
		body: isRecord(body) && Array.isArray(body.contents) ? {
			...body,
			contents: [...body.contents, warning]
		} : {
			type: "box",
			layout: "vertical",
			contents: [warning]
		}
	};
	return Buffer.byteLength(JSON.stringify(withWarning), "utf8") <= Math.min(maxBytes, 3e4) ? withWarning : normalized;
}
function normalizeFlexContainer(value) {
	if (!isRecord(value)) return value;
	if (value.type === "bubble") return normalizeFlexBubble(value);
	if (value.type === "carousel" && Array.isArray(value.contents)) {
		let remainingBytes = LINE_FLEX_CAROUSEL_MAX_BYTES - Buffer.byteLength(JSON.stringify(value), "utf8");
		return {
			...value,
			contents: value.contents.map((bubble) => {
				const originalBytes = Buffer.byteLength(JSON.stringify(bubble), "utf8");
				const normalized = normalizeFlexBubble(bubble, originalBytes + remainingBytes);
				remainingBytes += originalBytes - Buffer.byteLength(JSON.stringify(normalized), "utf8");
				return normalized;
			})
		};
	}
	return normalizeNestedContent(value, 40);
}
function unavailableImagemapAction(kind, reason, area) {
	return {
		type: "message",
		label: "Unavailable",
		text: `${kind} unavailable: ${reason}`,
		area
	};
}
function normalizeImagemapAction(action) {
	const label = action.label === void 0 ? void 0 : truncateLineActionText(action.label, LINE_IMAGEMAP_ACTION_LABEL_LIMIT);
	if (action.type === "uri") {
		if (truncateUtf16Safe(action.linkUri, LINE_ACTION_URI_LIMIT) !== action.linkUri) return unavailableImagemapAction("Link", "URL exceeds LINE's limit.", action.area);
		return {
			...action,
			label
		};
	}
	if (action.type === "message") {
		const text = truncateUtf16Safe(action.text, LINE_IMAGEMAP_MESSAGE_TEXT_LIMIT);
		if (text !== action.text) return unavailableImagemapAction("Action", "message text exceeds LINE's limit.", action.area);
		return {
			...action,
			label,
			text
		};
	}
	if (truncateUtf16Safe(action.clipboardText, LINE_CLIPBOARD_TEXT_LIMIT) !== action.clipboardText) return unavailableImagemapAction("Action", "clipboard text exceeds LINE's limit.", action.area);
	return {
		...action,
		label
	};
}
function normalizeImagemapVideo(video) {
	const externalLink = video.externalLink;
	if (!externalLink) return { video };
	const label = externalLink.label === void 0 ? void 0 : truncateUtf16Safe(externalLink.label, LINE_IMAGEMAP_EXTERNAL_LINK_LABEL_LIMIT) || (externalLink.label ? "…" : "");
	if (externalLink.linkUri !== void 0 && truncateUtf16Safe(externalLink.linkUri, LINE_ACTION_URI_LIMIT) !== externalLink.linkUri) {
		const normalizedVideo = { ...video };
		delete normalizedVideo.externalLink;
		return {
			video: normalizedVideo,
			fallbackAction: video.area === void 0 ? void 0 : unavailableImagemapAction("Link", "URL exceeds LINE's limit.", video.area)
		};
	}
	return { video: {
		...video,
		externalLink: {
			...externalLink,
			label
		}
	} };
}
function normalizeLineMessage(message) {
	let normalized;
	if (message.type === "flex") normalized = {
		...message,
		contents: normalizeFlexContainer(message.contents)
	};
	else if (message.type === "template") {
		const labelLimit = message.template.type === "image_carousel" ? 12 : 20;
		const template = normalizeNestedContent(message.template, labelLimit);
		const columns = template.type === "carousel" ? template.columns : template.type === "buttons" ? [template] : [];
		if (columns.some((column) => !isHttpsUrl(column.thumbnailImageUrl))) for (const column of columns) delete column.thumbnailImageUrl;
		normalized = {
			...message,
			template
		};
	} else if (message.type === "imagemap") {
		const actions = message.actions.map(normalizeImagemapAction);
		const videoResult = message.video ? normalizeImagemapVideo(message.video) : void 0;
		if (videoResult?.fallbackAction) {
			if (actions.length < LINE_IMAGEMAP_ACTION_LIMIT) actions.push(videoResult.fallbackAction);
		}
		normalized = {
			...message,
			actions,
			video: videoResult?.video
		};
	} else normalized = { ...message };
	if (message.quickReply) normalized = {
		...normalized,
		quickReply: normalizeNestedContent(message.quickReply, 20)
	};
	return normalized;
}
function normalizeLineAction(action, labelLimit = LINE_ACTION_LABEL_LIMIT) {
	if (isUnavailableAction(action)) return action;
	const label = action.label === void 0 ? void 0 : truncateLineActionLabel(action.label, labelLimit);
	if (action.type === "uri") {
		const uriTooLong = action.uri !== void 0 && truncateUtf16Safe(action.uri, LINE_ACTION_URI_LIMIT) !== action.uri;
		const desktopUri = action.altUri?.desktop;
		const desktopUriTooLong = desktopUri !== void 0 && truncateUtf16Safe(desktopUri, LINE_ACTION_URI_LIMIT) !== desktopUri;
		if (uriTooLong || desktopUriTooLong) return unavailableAction("Link", "URL exceeds LINE's limit.");
		return {
			...action,
			label
		};
	}
	if (action.type === "postback") {
		const data = action.data === void 0 ? void 0 : truncateLineActionData(action.data);
		if (data !== action.data) return unavailableAction("Action", "callback data exceeds LINE's limit.");
		const text = action.text === void 0 ? void 0 : truncateLineActionText(action.text, LINE_ACTION_DATA_LIMIT);
		const fillInText = action.fillInText === void 0 ? void 0 : truncateLineActionText(action.fillInText, LINE_ACTION_DATA_LIMIT);
		if (text !== action.text || fillInText !== action.fillInText) return unavailableAction("Action", "message text exceeds LINE's limit.");
		return {
			...action,
			label,
			data,
			displayText: action.displayText === void 0 ? void 0 : truncateLineActionText(action.displayText, LINE_ACTION_DATA_LIMIT),
			text,
			fillInText
		};
	}
	if (action.type === "datetimepicker") {
		const data = action.data === void 0 ? void 0 : truncateLineActionData(action.data);
		if (data !== action.data) return unavailableAction("Action", "callback data exceeds LINE's limit.");
		return {
			...action,
			label,
			data
		};
	}
	if (action.type === "message") {
		const text = action.text === void 0 ? void 0 : truncateLineActionText(action.text, LINE_ACTION_DATA_LIMIT);
		if (text !== action.text) return unavailableAction("Action", "message text exceeds LINE's limit.");
		return {
			...action,
			label,
			text
		};
	}
	if (action.type === "clipboard") {
		if (truncateUtf16Safe(action.clipboardText, LINE_CLIPBOARD_TEXT_LIMIT) !== action.clipboardText) return unavailableAction("Action", "clipboard text exceeds LINE's limit.");
		return {
			...action,
			label
		};
	}
	if (action.type === "richmenuswitch") {
		const data = action.data === void 0 ? void 0 : truncateLineActionData(action.data);
		const aliasTooLong = action.richMenuAliasId !== void 0 && truncateUtf16Safe(action.richMenuAliasId, LINE_RICH_MENU_ALIAS_LIMIT) !== action.richMenuAliasId;
		if (data !== action.data || aliasTooLong) return unavailableAction("Action", "rich menu data exceeds LINE's limit.");
		return {
			...action,
			label,
			data
		};
	}
	return action.label === label ? action : {
		...action,
		label
	};
}
/**
* Create a message action (sends text when tapped)
*/
function messageAction(label, text) {
	return normalizeLineAction({
		type: "message",
		label,
		text: text ?? label
	});
}
/**
* Create a URI action (opens a URL when tapped)
*/
function uriAction(label, uri) {
	return normalizeLineAction({
		type: "uri",
		label,
		uri
	});
}
/**
* Create a postback action (sends data to webhook when tapped)
*/
function postbackAction(label, data, displayText) {
	return normalizeLineAction({
		type: "postback",
		label,
		data,
		displayText
	});
}
/**
* Create a datetime picker action
*/
function datetimePickerAction(label, data, mode, options) {
	return normalizeLineAction({
		type: "datetimepicker",
		label,
		data,
		mode,
		initial: options?.initial,
		max: options?.max,
		min: options?.min
	});
}
//#endregion
//#region extensions/line/src/flex-templates/common.ts
function attachFooterText(bubble, footer) {
	bubble.footer = {
		type: "box",
		layout: "vertical",
		contents: [{
			type: "text",
			text: footer,
			size: "xs",
			color: "#AAAAAA",
			wrap: true,
			align: "center"
		}],
		paddingAll: "lg",
		backgroundColor: "#FAFAFA"
	};
}
//#endregion
//#region extensions/line/src/flex-templates/basic-cards.ts
/**
* Create an info card with title, body, and optional footer
*
* Editorial design: Clean hierarchy with accent bar, generous spacing,
* and subtle background zones for visual separation.
*/
function createInfoCard(title, body, footer) {
	const bubble = {
		type: "bubble",
		size: "mega",
		body: {
			type: "box",
			layout: "vertical",
			contents: [{
				type: "box",
				layout: "horizontal",
				contents: [{
					type: "box",
					layout: "vertical",
					contents: [],
					width: "4px",
					backgroundColor: "#06C755",
					cornerRadius: "2px"
				}, {
					type: "text",
					text: title,
					weight: "bold",
					size: "xl",
					color: "#111111",
					wrap: true,
					flex: 1,
					margin: "lg"
				}]
			}, ...body ? [{
				type: "box",
				layout: "vertical",
				contents: [{
					type: "text",
					text: body,
					size: "md",
					color: "#444444",
					wrap: true,
					lineSpacing: "6px"
				}],
				margin: "xl",
				paddingAll: "lg",
				backgroundColor: "#F8F9FA",
				cornerRadius: "lg"
			}] : []],
			paddingAll: "xl",
			backgroundColor: "#FFFFFF"
		}
	};
	if (footer) attachFooterText(bubble, footer);
	return bubble;
}
/**
* Create a list card with title and multiple items
*
* Editorial design: Numbered/bulleted list with clear visual hierarchy,
* accent dots for each item, and generous spacing.
*/
function createListCard(title, items) {
	const itemContents = items.slice(0, 8).map((item, index) => {
		const itemContentsLocal = [{
			type: "text",
			text: item.title,
			size: "md",
			weight: "bold",
			color: "#1a1a1a",
			wrap: true
		}];
		if (item.subtitle) itemContentsLocal.push({
			type: "text",
			text: item.subtitle,
			size: "sm",
			color: "#888888",
			wrap: true,
			margin: "xs"
		});
		const itemBox = {
			type: "box",
			layout: "horizontal",
			contents: [{
				type: "box",
				layout: "vertical",
				contents: [{
					type: "box",
					layout: "vertical",
					contents: [],
					width: "8px",
					height: "8px",
					backgroundColor: index === 0 ? "#06C755" : "#DDDDDD",
					cornerRadius: "4px"
				}],
				width: "20px",
				alignItems: "center",
				paddingTop: "sm"
			}, {
				type: "box",
				layout: "vertical",
				contents: itemContentsLocal,
				flex: 1
			}],
			margin: index > 0 ? "lg" : void 0
		};
		if (item.action) itemBox.action = normalizeLineAction(item.action, 40);
		return itemBox;
	});
	return {
		type: "bubble",
		size: "mega",
		body: {
			type: "box",
			layout: "vertical",
			contents: [
				{
					type: "text",
					text: title,
					weight: "bold",
					size: "xl",
					color: "#111111",
					wrap: true
				},
				{
					type: "separator",
					margin: "lg",
					color: "#EEEEEE"
				},
				{
					type: "box",
					layout: "vertical",
					contents: itemContents,
					margin: "lg"
				}
			],
			paddingAll: "xl",
			backgroundColor: "#FFFFFF"
		}
	};
}
/**
* Create an image card with image, title, and optional body text
*/
function createImageCard(imageUrl, title, body, options) {
	const bubble = {
		type: "bubble",
		hero: {
			type: "image",
			url: imageUrl,
			size: "full",
			aspectRatio: options?.aspectRatio ?? "20:13",
			aspectMode: options?.aspectMode ?? "cover",
			action: options?.action === void 0 ? void 0 : normalizeLineAction(options.action, 40)
		},
		body: {
			type: "box",
			layout: "vertical",
			contents: [{
				type: "text",
				text: title,
				weight: "bold",
				size: "xl",
				wrap: true
			}],
			paddingAll: "lg"
		}
	};
	if (body && bubble.body) bubble.body.contents.push({
		type: "text",
		text: body,
		size: "md",
		wrap: true,
		margin: "md",
		color: "#666666"
	});
	return bubble;
}
/**
* Create an action card with title, body, and action buttons
*/
function createActionCard(title, body, actions, options) {
	const bubble = {
		type: "bubble",
		body: {
			type: "box",
			layout: "vertical",
			contents: [{
				type: "text",
				text: title,
				weight: "bold",
				size: "xl",
				wrap: true
			}, ...body ? [{
				type: "text",
				text: body,
				size: "md",
				wrap: true,
				margin: "md",
				color: "#666666"
			}] : []],
			paddingAll: "lg"
		},
		footer: {
			type: "box",
			layout: "vertical",
			contents: actions.slice(0, 4).map((action, index) => ({
				type: "button",
				action: normalizeLineAction(action.action, 40),
				style: index === 0 ? "primary" : "secondary",
				margin: index > 0 ? "sm" : void 0
			})),
			paddingAll: "md"
		}
	};
	if (options?.imageUrl) bubble.hero = {
		type: "image",
		url: options.imageUrl,
		size: "full",
		aspectRatio: options.aspectRatio ?? "20:13",
		aspectMode: "cover"
	};
	return bubble;
}
//#endregion
//#region extensions/line/src/flex-templates/schedule-cards.ts
function buildTitleSubtitleHeader(params) {
	const { title, subtitle } = params;
	const headerContents = [{
		type: "text",
		text: title,
		weight: "bold",
		size: "xl",
		color: "#111111",
		wrap: true
	}];
	if (subtitle) headerContents.push({
		type: "text",
		text: subtitle,
		size: "sm",
		color: "#888888",
		margin: "sm",
		wrap: true
	});
	return headerContents;
}
function buildCardHeaderSections(headerContents) {
	return [{
		type: "box",
		layout: "vertical",
		contents: headerContents,
		paddingBottom: "lg"
	}, {
		type: "separator",
		color: "#EEEEEE"
	}];
}
function createMegaBubbleWithFooter(params) {
	const bubble = {
		type: "bubble",
		size: "mega",
		body: {
			type: "box",
			layout: "vertical",
			contents: params.bodyContents,
			paddingAll: "xl",
			backgroundColor: "#FFFFFF"
		}
	};
	if (params.footer) attachFooterText(bubble, params.footer);
	return bubble;
}
/**
* Create a receipt/summary card (for orders, transactions, data tables)
*
* Editorial design: Clean table layout with alternating row backgrounds,
* prominent total section, and clear visual hierarchy.
*/
function createReceiptCard(params) {
	const { title, subtitle, items, total, footer } = params;
	const itemRows = items.slice(0, 12).map((item, index) => ({
		type: "box",
		layout: "horizontal",
		contents: [{
			type: "text",
			text: item.name,
			size: "sm",
			color: item.highlight ? "#111111" : "#666666",
			weight: item.highlight ? "bold" : "regular",
			flex: 3,
			wrap: true
		}, ...item.value ? [{
			type: "text",
			text: item.value,
			size: "sm",
			color: item.highlight ? "#06C755" : "#333333",
			weight: item.highlight ? "bold" : "regular",
			flex: 2,
			align: "end",
			wrap: true
		}] : []],
		paddingAll: "md",
		backgroundColor: index % 2 === 0 ? "#FFFFFF" : "#FAFAFA"
	}));
	const bodyContents = [...buildCardHeaderSections(buildTitleSubtitleHeader({
		title,
		subtitle
	})), {
		type: "box",
		layout: "vertical",
		contents: itemRows,
		margin: "md",
		cornerRadius: "md",
		borderWidth: "light",
		borderColor: "#EEEEEE"
	}];
	if (total) bodyContents.push({
		type: "box",
		layout: "horizontal",
		contents: [{
			type: "text",
			text: total.label,
			size: "lg",
			weight: "bold",
			color: "#111111",
			flex: 2
		}, {
			type: "text",
			text: total.value,
			size: "xl",
			weight: "bold",
			color: "#06C755",
			flex: 2,
			align: "end"
		}],
		margin: "xl",
		paddingAll: "lg",
		backgroundColor: "#F0FDF4",
		cornerRadius: "lg"
	});
	return createMegaBubbleWithFooter({
		bodyContents,
		footer
	});
}
/**
* Create a calendar event card (for meetings, appointments, reminders)
*
* Editorial design: Date as hero, strong typographic hierarchy,
* color-blocked zones, full text wrapping for readability.
*/
function createEventCard(params) {
	const { title, date, time, location, description, calendar, isAllDay, action } = params;
	const dateBlock = {
		type: "box",
		layout: "vertical",
		contents: [{
			type: "text",
			text: date.toUpperCase(),
			size: "sm",
			weight: "bold",
			color: "#06C755",
			wrap: true
		}, {
			type: "text",
			text: isAllDay ? "ALL DAY" : time ?? "",
			size: "xxl",
			weight: "bold",
			color: "#111111",
			wrap: true,
			margin: "xs"
		}],
		paddingBottom: "lg",
		borderWidth: "none"
	};
	if (!time && !isAllDay) dateBlock.contents = [{
		type: "text",
		text: date,
		size: "xl",
		weight: "bold",
		color: "#111111",
		wrap: true
	}];
	const bodyContents = [dateBlock, {
		type: "box",
		layout: "horizontal",
		contents: [{
			type: "box",
			layout: "vertical",
			contents: [],
			width: "4px",
			backgroundColor: "#06C755",
			cornerRadius: "2px"
		}, {
			type: "box",
			layout: "vertical",
			contents: [{
				type: "text",
				text: title,
				size: "lg",
				weight: "bold",
				color: "#1a1a1a",
				wrap: true
			}, ...calendar ? [{
				type: "text",
				text: calendar,
				size: "xs",
				color: "#888888",
				margin: "sm",
				wrap: true
			}] : []],
			flex: 1,
			paddingStart: "lg"
		}],
		paddingTop: "lg",
		paddingBottom: "lg",
		borderWidth: "light",
		borderColor: "#EEEEEE"
	}];
	if (location || description) {
		const detailItems = [];
		if (location) detailItems.push({
			type: "box",
			layout: "horizontal",
			contents: [{
				type: "text",
				text: "📍",
				size: "sm",
				flex: 0
			}, {
				type: "text",
				text: location,
				size: "sm",
				color: "#444444",
				margin: "md",
				flex: 1,
				wrap: true
			}],
			alignItems: "flex-start"
		});
		if (description) detailItems.push({
			type: "text",
			text: description,
			size: "sm",
			color: "#666666",
			wrap: true,
			margin: location ? "lg" : "none"
		});
		bodyContents.push({
			type: "box",
			layout: "vertical",
			contents: detailItems,
			margin: "lg",
			paddingAll: "lg",
			backgroundColor: "#F8F9FA",
			cornerRadius: "lg"
		});
	}
	return {
		type: "bubble",
		size: "mega",
		body: {
			type: "box",
			layout: "vertical",
			contents: bodyContents,
			paddingAll: "xl",
			backgroundColor: "#FFFFFF",
			action: action === void 0 ? void 0 : normalizeLineAction(action, 40)
		}
	};
}
/**
* Create a calendar agenda card showing multiple events
*
* Editorial timeline design: Time-focused left column with event details
* on the right. Visual accent bars indicate event priority/recency.
*/
function createAgendaCard(params) {
	const { title, subtitle, events, footer } = params;
	const headerContents = buildTitleSubtitleHeader({
		title,
		subtitle
	});
	const eventItems = events.slice(0, 6).map((event, index) => {
		const isActive = event.isNow || index === 0;
		const accentColor = isActive ? "#06C755" : "#E5E5E5";
		const timeColumn = {
			type: "box",
			layout: "vertical",
			contents: [{
				type: "text",
				text: event.time ?? "—",
				size: "sm",
				weight: isActive ? "bold" : "regular",
				color: isActive ? "#06C755" : "#666666",
				align: "end",
				wrap: true
			}],
			width: "65px",
			justifyContent: "flex-start"
		};
		const dotColumn = {
			type: "box",
			layout: "vertical",
			contents: [{
				type: "box",
				layout: "vertical",
				contents: [],
				width: "10px",
				height: "10px",
				backgroundColor: accentColor,
				cornerRadius: "5px"
			}],
			width: "24px",
			alignItems: "center",
			justifyContent: "flex-start",
			paddingTop: "xs"
		};
		const detailContents = [{
			type: "text",
			text: event.title,
			size: "md",
			weight: "bold",
			color: "#1a1a1a",
			wrap: true
		}];
		const secondaryParts = [];
		if (event.location) secondaryParts.push(event.location);
		if (event.calendar) secondaryParts.push(event.calendar);
		if (secondaryParts.length > 0) detailContents.push({
			type: "text",
			text: secondaryParts.join(" · "),
			size: "xs",
			color: "#888888",
			wrap: true,
			margin: "xs"
		});
		return {
			type: "box",
			layout: "horizontal",
			contents: [
				timeColumn,
				dotColumn,
				{
					type: "box",
					layout: "vertical",
					contents: detailContents,
					flex: 1
				}
			],
			margin: index > 0 ? "xl" : void 0,
			alignItems: "flex-start"
		};
	});
	return createMegaBubbleWithFooter({
		bodyContents: [...buildCardHeaderSections(headerContents), {
			type: "box",
			layout: "vertical",
			contents: eventItems,
			paddingTop: "xl"
		}],
		footer
	});
}
//#endregion
//#region extensions/line/src/send-receipt.ts
function createLineSendReceipt(params) {
	const messageIds = (params.messageIds ?? [params.messageId]).map((messageId) => messageId.trim()).filter(Boolean);
	const chatId = params.chatId.trim();
	return createMessageReceiptFromOutboundResults({
		results: messageIds.map((messageId) => ({
			channel: "line",
			messageId,
			chatId,
			conversationId: chatId,
			meta: { messageCount: params.messageCount ?? 1 }
		})),
		...chatId ? { threadId: chatId } : {},
		kind: params.kind ?? "unknown"
	});
}
//#endregion
//#region extensions/line/src/channel-access-token.ts
function resolveLineChannelAccessToken(explicit, params) {
	if (explicit?.trim()) return explicit.trim();
	if (!params.channelAccessToken) throw new Error(params.tokenStatus === "configured_unavailable" ? `LINE channel access token is configured but unavailable for account "${params.accountId}" (check the configured tokenFile).` : `LINE channel access token missing for account "${params.accountId}" (set channels.line.channelAccessToken or LINE_CHANNEL_ACCESS_TOKEN).`);
	return params.channelAccessToken.trim();
}
//#endregion
//#region extensions/line/src/probe.ts
const LINE_QUOTA_TIMEOUT_MS = 2e3;
const LINE_JSON_MAX_BYTES = 16384;
function createLineApiReader(channelAccessToken, timeoutMs) {
	const remaining = createProviderOperationTimeoutResolver({
		deadline: createProviderOperationDeadline({
			timeoutMs,
			label: "LINE API"
		}),
		defaultTimeoutMs: timeoutMs
	});
	const headers = { Authorization: `Bearer ${channelAccessToken}` };
	return async (endpoint) => {
		const response = await fetchWithTimeout(`https://api.line.me/v2/bot/${endpoint}`, { headers }, remaining(), fetchWithRuntimeDispatcherOrMockedGlobal);
		await assertOkOrThrowHttpError(response, "LINE API", {
			bodyTimeoutMs: remaining,
			requestHeaders: headers
		});
		return await readProviderJsonResponse(response, "LINE API", {
			maxBytes: LINE_JSON_MAX_BYTES,
			timeoutMs: remaining,
			requestHeaders: headers
		});
	};
}
async function readLineMessageQuota(channelAccessToken, budgetMs) {
	if (!Number.isFinite(budgetMs) || budgetMs <= 0) return;
	try {
		const read = createLineApiReader(channelAccessToken, budgetMs);
		const quota = await read("message/quota");
		if (quota.type === "none") return { kind: "unlimited" };
		if (quota.type !== "limited" || typeof quota.value !== "number" || !Number.isSafeInteger(quota.value) || quota.value < 0) return;
		const { totalUsage } = await read("message/quota/consumption");
		return typeof totalUsage === "number" && Number.isSafeInteger(totalUsage) && totalUsage >= 0 ? {
			kind: "limited",
			limit: quota.value,
			used: totalUsage
		} : void 0;
	} catch {
		return;
	}
}
async function readLineWebhookState(channelAccessToken, budgetMs) {
	if (!Number.isFinite(budgetMs) || budgetMs <= 0) return;
	try {
		const registered = await createLineApiReader(channelAccessToken, budgetMs)("channel/webhook/endpoint");
		return typeof registered.active === "boolean" ? { status: registered.active ? "active" : "disabled" } : void 0;
	} catch (error) {
		return isRecord(error) && error.status === 404 ? { status: "unset" } : void 0;
	}
}
async function readLineAccountMessageQuota(params) {
	try {
		return await readLineMessageQuota(resolveLineChannelAccessToken(void 0, resolveLineAccount({
			cfg: params.cfg,
			accountId: params.accountId ?? void 0
		})), LINE_QUOTA_TIMEOUT_MS);
	} catch {
		return;
	}
}
async function probeLineBot(channelAccessToken, timeoutMs = 5e3) {
	if (!channelAccessToken?.trim()) return {
		ok: false,
		error: "Channel access token not configured"
	};
	const token = channelAccessToken.trim();
	return await runChannelProbe(timeoutMs, async ({ elapsedMs }) => {
		const profile = await createLineApiReader(token, timeoutMs)("info");
		const optionalBudgetMs = () => Math.floor(Math.max(timeoutMs - elapsedMs(), 0) / 2);
		const quota = await readLineMessageQuota(token, optionalBudgetMs());
		const webhook = await readLineWebhookState(token, optionalBudgetMs());
		return {
			ok: true,
			bot: {
				displayName: profile.displayName,
				userId: profile.userId,
				basicId: profile.basicId,
				pictureUrl: profile.pictureUrl
			},
			...webhook ? { webhook } : {},
			...quota ? { quota } : {}
		};
	}, (error) => ({
		ok: false,
		error: formatErrorMessage(error)
	}));
}
//#endregion
//#region extensions/line/src/send-retry.ts
/** The LINE HTTP response carried by an error graph, when the request reached LINE. */
function findLineHttpError(error) {
	return collectErrorGraphCandidates(error, (candidate) => [candidate.cause, candidate.error]).find((candidate) => candidate instanceof HTTPFetchError);
}
/**
* LINE answered this attempt with a client error, so it rejected the request and
* sent nothing.
*
* A 429 proves this attempt was refused but remains retryable by durable
* delivery. A 408 stays ambiguous because the request may have reached LINE.
*/
function resolveAttemptNonDispatchRetryable(error) {
	const status = findLineHttpError(error)?.status;
	if (status === 429) return true;
	if (status === 409) return;
	return status !== void 0 && status >= 400 && status < 500 && status !== 408 ? false : void 0;
}
const pushErrorsWithAmbiguousAttempt = /* @__PURE__ */ new WeakSet();
/** Retryability when LINE refused every attempt, or undefined when delivery is ambiguous. */
function resolveLineNonDispatchRetryable(error) {
	if (collectErrorGraphCandidates(error, (candidate) => [candidate.cause, candidate.error]).some((candidate) => typeof candidate === "object" && candidate !== null && pushErrorsWithAmbiguousAttempt.has(candidate))) return;
	return resolveAttemptNonDispatchRetryable(error);
}
function isRetryableLinePushError(error) {
	const httpError = findLineHttpError(error);
	if (httpError) return httpError.status >= 500;
	return collectErrorGraphCandidates(error, (candidate) => [candidate.cause, candidate.error]).some((candidate) => classifyTransientNetworkErrorCode(extractErrorCode(candidate)) !== void 0);
}
/**
* Pushes are non-idempotent without a retry key, so the generic message-matching
* fallback stays off and only the classification above may replay a request.
*/
const runLinePushAttempts = createChannelApiRetryRunner({
	shouldRetry: isRetryableLinePushError,
	strictShouldRetry: true,
	verbose: true
});
const runLinePushWithRetries = (fn, label) => {
	let sawAmbiguousAttempt = false;
	return runLinePushAttempts(async () => {
		try {
			return await fn();
		} catch (error) {
			sawAmbiguousAttempt ||= resolveAttemptNonDispatchRetryable(error) === void 0;
			throw error;
		}
	}, label).catch((error) => {
		if (sawAmbiguousAttempt && typeof error === "object" && error !== null) pushErrorsWithAmbiguousAttempt.add(error);
		throw error;
	});
};
async function explainLineRefusal(params) {
	const retryable = resolveLineNonDispatchRetryable(params.error);
	const quota = retryable === true && findLineHttpError(params.error)?.status === 429 ? await readLineAccountMessageQuota(params) : void 0;
	const exhausted = quota?.kind === "limited" && quota.used >= quota.limit;
	return {
		retryable: exhausted ? false : retryable,
		reason: exhausted ? `LINE refused the push: ${quota.used}/${quota.limit} monthly messages used. Check the account allowance or plan before retrying.` : params.error instanceof Error ? params.error.message : "LINE rejected the message"
	};
}
//#endregion
export { withoutLineQuoteTokens as A, toFlexMessage as C, recordLineQuoteToken as D, readLineQuoteToken as E, inferLineTargetChatType as F, normalizeLineMessagingTarget as I, createAudioMessage as M, createImageMessage as N, reportLineQuoteCarrierMissing as O, createVideoMessage as P, fitsLineFlexBubble as S, canCarryLineQuoteToken as T, normalizeLineAction as _, probeLineBot as a, truncateLineActionLabel as b, createAgendaCard as c, createActionCard as d, createImageCard as f, messageAction as g, datetimePickerAction as h, runLinePushWithRetries as i, buildLineMediaMessage as j, resolveLineQuoteToken as k, createEventCard as l, createListCard as m, findLineHttpError as n, resolveLineChannelAccessToken as o, createInfoCard as p, resolveLineNonDispatchRetryable as r, createLineSendReceipt as s, explainLineRefusal as t, createReceiptCard as u, normalizeLineMessage as v, applyLineQuoteToken as w, uriAction as x, postbackAction as y };
