import { i as __exportAll } from "./doctor-contract-w11JEjcg.mjs";
import { a as loadStoredZaloCredentials, c as refreshStoredZaloCredentials, d as saveStoredZaloCredentials, n as captureZalouserCredentialsEnv, r as clearStoredZaloCredentials, s as normalizeZalouserCredentialProfile } from "./session-state-B2n6XQX_.mjs";
import { createRequire } from "node:module";
import { createMessageReceiptFromOutboundResults } from "openclaw/plugin-sdk/channel-outbound";
import { createLazyRuntimeModule } from "openclaw/plugin-sdk/lazy-runtime";
import { normalizeLowercaseStringOrEmpty, normalizeOptionalLowercaseString, normalizeOptionalString, normalizeOptionalStringifiedId } from "openclaw/plugin-sdk/string-coerce-runtime";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { pruneMapToMaxSize } from "openclaw/plugin-sdk/collection-runtime";
import { formatErrorMessage } from "openclaw/plugin-sdk/error-runtime";
import { expectDefined } from "openclaw/plugin-sdk/expect-runtime";
import { asDateTimestampMs, asFiniteNumberInRange, isFutureDateTimestampMs, parseStrictFiniteNumber, parseStrictNonNegativeInteger, resolveExpiresAtMsFromDurationMs, resolveTimerTimeoutMs } from "openclaw/plugin-sdk/number-runtime";
import { withTimeout } from "openclaw/plugin-sdk/security-runtime";
import { sleep, truncateUtf16Safe } from "openclaw/plugin-sdk/text-utility-runtime";
import { extensionForMime } from "openclaw/plugin-sdk/media-mime";
import { loadOutboundMediaFromUrl } from "openclaw/plugin-sdk/outbound-media";
import { AsyncLocalStorage } from "node:async_hooks";
import { resolveFetch } from "openclaw/plugin-sdk/fetch-runtime";
import { fetchWithRuntimeDispatcher } from "openclaw/plugin-sdk/runtime-fetch";
//#region extensions/zalouser/src/credential-persistence.ts
function credentialSignature(credentials) {
	return JSON.stringify({
		imei: credentials.imei,
		cookie: canonicalCredentialCookie(credentials.cookie),
		userAgent: credentials.userAgent,
		language: credentials.language
	});
}
function stableCanonicalValue(value) {
	if (Array.isArray(value)) return value.map(stableCanonicalValue);
	if (!value || typeof value !== "object") return value;
	return Object.fromEntries(Object.entries(value).toSorted(([left], [right]) => left.localeCompare(right)).map(([key, entry]) => [key, stableCanonicalValue(entry)]));
}
function stableSignatureValue(value) {
	return JSON.stringify(stableCanonicalValue(value)) ?? "undefined";
}
function canonicalCookieArray(value) {
	return value.map(stableCanonicalValue).toSorted((left, right) => stableSignatureValue(left).localeCompare(stableSignatureValue(right)));
}
function canonicalCredentialCookie(cookie) {
	if (Array.isArray(cookie)) return canonicalCookieArray(cookie);
	if (!cookie || typeof cookie !== "object") return cookie;
	return Object.fromEntries(Object.entries(cookie).toSorted(([left], [right]) => left.localeCompare(right)).map(([key, entry]) => [key, key === "cookies" && Array.isArray(entry) ? canonicalCookieArray(entry) : stableCanonicalValue(entry)]));
}
function snapshotApiCredentials(api, fallback) {
	const ctx = api.getContext();
	const cookieJson = api.getCookie().toJSON();
	const refreshedCookies = Array.isArray(cookieJson?.cookies) && cookieJson.cookies.length > 0 ? cookieJson.cookies : fallback?.cookie;
	const imei = normalizeOptionalString(ctx.imei) ?? normalizeOptionalString(fallback?.imei);
	const userAgent = normalizeOptionalString(ctx.userAgent) ?? normalizeOptionalString(fallback?.userAgent);
	if (!imei || !refreshedCookies || !userAgent) throw new Error("Zalo API session did not expose refreshed credentials");
	const language = normalizeOptionalString(ctx.language) ?? normalizeOptionalString(fallback?.language);
	return {
		imei,
		cookie: refreshedCookies,
		userAgent,
		...language ? { language } : {}
	};
}
var ZaloCredentialPersistence = class {
	constructor(isCurrentApi) {
		this.isCurrentApi = isCurrentApi;
		this.credentialSignaturesByProfile = /* @__PURE__ */ new Map();
		this.credentialRefreshesByProfile = /* @__PURE__ */ new Map();
		this.credentialRevocationsByProfile = /* @__PURE__ */ new Map();
	}
	pendingRevocation(profile) {
		return this.credentialRevocationsByProfile.get(profile);
	}
	rememberCredentials(profile, credentials) {
		this.credentialSignaturesByProfile.set(profile, credentialSignature(credentials));
	}
	async writeCredentials(profile, credentials, assertCurrent) {
		const env = captureZalouserCredentialsEnv();
		await this.credentialRevocationsByProfile.get(profile);
		assertCurrent();
		const existing = await loadStoredZaloCredentials(profile, env).catch(() => null);
		assertCurrent();
		const now = (/* @__PURE__ */ new Date()).toISOString();
		const next = {
			profile,
			...credentials,
			createdAt: existing?.createdAt ?? now,
			lastUsedAt: now
		};
		const { profile: _profile, ...stored } = next;
		await saveStoredZaloCredentials(profile, stored, env, assertCurrent);
		assertCurrent();
		this.credentialSignaturesByProfile.set(profile, credentialSignature(next));
	}
	async writeApiCredentials(profile, api, assertCurrent, fallback) {
		await this.writeCredentials(profile, snapshotApiCredentials(api, fallback), assertCurrent);
	}
	async persistApiCredentialsIfChanged(profile, api) {
		const refresh = (this.credentialRefreshesByProfile.get(profile) ?? Promise.resolve()).then(async () => {
			try {
				const isCurrent = () => this.isCurrentApi(profile, api);
				if (!isCurrent()) return;
				const credentials = snapshotApiCredentials(api);
				const signature = credentialSignature(credentials);
				if (this.credentialSignaturesByProfile.get(profile) === signature) return;
				if (await refreshStoredZaloCredentials(profile, credentials, isCurrent) && isCurrent()) this.credentialSignaturesByProfile.set(profile, signature);
			} catch {}
		});
		this.credentialRefreshesByProfile.set(profile, refresh);
		try {
			await refresh;
		} finally {
			if (this.credentialRefreshesByProfile.get(profile) === refresh) this.credentialRefreshesByProfile.delete(profile);
		}
	}
	async clearCredentials(profile, assertCurrent) {
		const env = captureZalouserCredentialsEnv();
		const previous = this.credentialRevocationsByProfile.get(profile);
		const pending = (async () => {
			await previous;
			try {
				const cleared = await clearStoredZaloCredentials(profile, env, assertCurrent);
				this.credentialSignaturesByProfile.delete(profile);
				return cleared;
			} catch {
				return false;
			}
		})();
		this.credentialRevocationsByProfile.set(profile, pending);
		try {
			return await pending;
		} finally {
			if (this.credentialRevocationsByProfile.get(profile) === pending) this.credentialRevocationsByProfile.delete(profile);
		}
	}
};
//#endregion
//#region extensions/zalouser/src/directory-index.ts
function buildZaloNameIndex(items, nameFn) {
	const index = /* @__PURE__ */ new Map();
	for (const item of items) {
		const name = normalizeOptionalLowercaseString(nameFn(item));
		if (!name) continue;
		const list = index.get(name) ?? [];
		list.push(item);
		index.set(name, list);
	}
	return index;
}
//#endregion
//#region extensions/zalouser/src/zca-constants.ts
const ThreadType = {
	User: 0,
	Group: 1
};
const LoginQRCallbackEventType = {
	QRCodeGenerated: 0,
	QRCodeExpired: 1,
	QRCodeScanned: 2,
	QRCodeDeclined: 3,
	GotLoginInfo: 4
};
const Reactions = {
	HEART: "/-heart",
	LIKE: "/-strong",
	HAHA: ":>",
	WOW: ":o",
	CRY: ":-((",
	ANGRY: ":-h",
	NONE: ""
};
const TextStyle = {
	Bold: "b",
	Italic: "i",
	Underline: "u",
	StrikeThrough: "s",
	Red: "c_db342e",
	Orange: "c_f27806",
	Yellow: "c_f7b503",
	Green: "c_15a85f",
	Small: "f_13",
	Big: "f_18",
	UnorderedList: "lst_1",
	OrderedList: "lst_2",
	Indent: "ind_$"
};
//#endregion
//#region extensions/zalouser/src/reaction.ts
const REACTION_ALIAS_MAP = /* @__PURE__ */ new Map([
	["like", Reactions.LIKE],
	["👍", Reactions.LIKE],
	[":+1:", Reactions.LIKE],
	["heart", Reactions.HEART],
	["❤️", Reactions.HEART],
	["<3", Reactions.HEART],
	["haha", Reactions.HAHA],
	["laugh", Reactions.HAHA],
	["😂", Reactions.HAHA],
	["wow", Reactions.WOW],
	["😮", Reactions.WOW],
	["cry", Reactions.CRY],
	["😢", Reactions.CRY],
	["angry", Reactions.ANGRY],
	["😡", Reactions.ANGRY]
]);
function normalizeZaloReactionIcon(raw) {
	const trimmed = raw.trim();
	if (!trimmed) return Reactions.LIKE;
	return REACTION_ALIAS_MAP.get(normalizeLowercaseStringOrEmpty(trimmed)) ?? trimmed;
}
//#endregion
//#region extensions/zalouser/src/send-context.ts
const sendContext = new AsyncLocalStorage();
const MESSAGE_REQUEST_PATH = /^\/api\/(?:message|group)\/(?:sms|sendmsg|link|sendlink|photo_original\/send|asyncfile\/msg|gif|forward)$/u;
function assertCurrent(context) {
	if (!context.active) throw new Error("Zalouser send is no longer active");
	context.signal?.throwIfAborted();
	context.assertDirectAdapterHandoff?.();
}
async function withZaloSendContext(handoff, operation) {
	const context = {
		signal: handoff.signal,
		assertDirectAdapterHandoff: handoff.assertDirectAdapterHandoff,
		onPlatformSendDispatch: handoff.onPlatformSendDispatch,
		active: true
	};
	try {
		return await sendContext.run(context, () => {
			assertCurrent(context);
			return operation();
		});
	} finally {
		context.active = false;
	}
}
const fetchWithZaloSendContext = async (input, init) => {
	const fetchImpl = resolveFetch();
	if (!fetchImpl) throw new Error("fetch is not available");
	const context = sendContext.getStore();
	if (context) {
		assertCurrent(context);
		if (context.onPlatformSendDispatch) {
			const method = init?.method ?? (input instanceof Request ? input.method : "GET");
			const url = new URL(input instanceof Request ? input.url : input);
			if (method === "POST" && MESSAGE_REQUEST_PATH.test(url.pathname)) {
				await context.onPlatformSendDispatch();
				assertCurrent(context);
			}
		}
	}
	return fetchImpl(input, init);
};
function fetchMediaWithZaloSendContext(input, init) {
	const context = sendContext.getStore();
	if (context) assertCurrent(context);
	return fetchWithRuntimeDispatcher(input, init);
}
//#endregion
//#region extensions/zalouser/src/send-receipt.ts
function createZalouserSendReceipt(params) {
	const platformMessageIds = (params.platformMessageIds ?? [params.messageId]).map((messageId) => messageId?.trim()).filter((messageId) => Boolean(messageId));
	const threadId = params.threadId?.trim();
	return createMessageReceiptFromOutboundResults({
		results: platformMessageIds.map((messageId) => threadId ? {
			channel: "zalouser",
			messageId,
			conversationId: threadId
		} : {
			channel: "zalouser",
			messageId
		}),
		...threadId ? { threadId } : {},
		kind: params.kind ?? "unknown"
	});
}
//#endregion
//#region extensions/zalouser/src/text-styles-shared.ts
const TAG_STYLE_MAP = {
	red: TextStyle.Red,
	orange: TextStyle.Orange,
	yellow: TextStyle.Yellow,
	green: TextStyle.Green,
	small: null,
	big: TextStyle.Big,
	underline: TextStyle.Underline
};
const ZALOUSER_STYLE_MAP = {
	bold: TextStyle.Bold,
	italic: TextStyle.Italic,
	underline: TextStyle.Underline,
	strikethrough: TextStyle.StrikeThrough,
	heading_1: TextStyle.Bold,
	heading_2: TextStyle.Bold,
	heading_3: TextStyle.Bold,
	heading_4: TextStyle.Bold
};
const LOCAL_TAG_PATTERN = new RegExp(`\\{(${Object.keys(TAG_STYLE_MAP).join("|")})\\}(.+?)\\{/\\1\\}`, "g");
const UNICODE_SEPARATOR_PATTERN = /[\u00A0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000]/u;
function projectOffset(offsets, offset) {
	return offsets[Math.max(0, Math.min(offset, offsets.length - 1))] ?? offsets.at(-1) ?? 0;
}
function normalizeCodeBlockLeadingWhitespace(line) {
	return line.replace(/^[ \t]+/, (leadingWhitespace) => leadingWhitespace.replace(/\t/g, "\xA0\xA0\xA0\xA0").replace(/ /g, "\xA0"));
}
//#endregion
//#region extensions/zalouser/src/text-styles-ranges.ts
function collectStructuralStyles(ir, offsets, projectedText) {
	const styles = ir.styles.flatMap((span) => span.style === "heading_1" ? [{
		start: projectOffset(offsets, span.start),
		end: projectOffset(offsets, span.end),
		style: TextStyle.Big,
		priority: 1
	}] : []);
	const items = [...ir.listItems ?? []].toSorted((left, right) => (left.start ?? 0) - (right.start ?? 0) || (left.depth ?? 0) - (right.depth ?? 0));
	const listRanges = [];
	const quoteBlocks = (ir.blocks ?? []).filter((block) => block.kind === "blockquote");
	for (const item of items) {
		const materializedRanges = (ir.blocks ?? []).flatMap((block) => block.kind === "code_block" && item.start !== void 0 && item.end !== void 0 && block.start >= item.start && block.end <= item.end ? [{
			start: block.start,
			end: block.end,
			preserveWhitespace: true
		}] : []);
		const ownedRanges = item.contentStart !== void 0 && item.contentEnd !== void 0 ? subtractRanges({
			start: item.contentStart,
			end: item.contentEnd
		}, items.filter((candidate) => candidate.start !== void 0 && candidate.end !== void 0 && (candidate.depth ?? 0) > (item.depth ?? 0) && candidate.end > item.contentStart && candidate.start < item.contentEnd).map((candidate) => ({
			start: candidate.start,
			end: candidate.end
		}))).map(({ start, end }) => ({
			start,
			end,
			preserveWhitespace: false
		})) : materializedRanges;
		for (const ownedRange of ownedRanges) {
			let contentStart = ownedRange.start;
			let contentEnd = ownedRange.end;
			if (!ownedRange.preserveWhitespace) {
				while (contentStart < contentEnd && /[ \t\r\n]/u.test(ir.text[contentStart] ?? "")) contentStart += 1;
				while (contentEnd > contentStart && /[ \t\r\n]/u.test(ir.text[contentEnd - 1] ?? "")) contentEnd -= 1;
			}
			if (contentEnd <= contentStart) continue;
			const start = projectOffset(offsets, contentStart);
			const end = projectOffset(offsets, contentEnd);
			if (end <= start) continue;
			listRanges.push({
				start,
				end
			});
			if (!item.task) styles.push({
				start,
				end,
				style: item.kind === "ordered" ? TextStyle.OrderedList : TextStyle.UnorderedList,
				priority: 3
			});
			if (ownedRange.preserveWhitespace) continue;
			const quoteBoundaries = quoteBlocks.flatMap((block) => [block.start, block.end]);
			for (const line of splitRangeAtOffsets({
				start: contentStart,
				end: contentEnd
			}, quoteBoundaries, ir.text)) {
				const quoteDepth = quoteBlocks.filter((block) => block.start < line.end && block.end > line.start).length;
				const indentSize = Math.min(5, (item.depth ?? 0) + quoteDepth);
				if (indentSize === 0) continue;
				styles.push({
					start: projectOffset(offsets, line.start),
					end: projectOffset(offsets, line.end),
					style: TextStyle.Indent,
					indentSize,
					priority: 2
				});
			}
		}
	}
	const codeRanges = (ir.blocks ?? []).filter((block) => block.kind === "code_block").map((block) => ({
		start: projectOffset(offsets, block.start),
		end: projectOffset(offsets, block.end)
	}));
	const quotedLines = /* @__PURE__ */ new Map();
	for (const block of quoteBlocks) {
		const start = projectOffset(offsets, block.start);
		const end = projectOffset(offsets, block.end);
		for (const line of splitLines({
			start,
			end
		}, projectedText)) {
			if ([...listRanges, ...codeRanges].some((range) => range.start < line.end && range.end > line.start)) continue;
			const key = `${line.start}:${line.end}`;
			const indentSize = Math.min(5, block.depth);
			const current = quotedLines.get(key);
			if (!current || (current.indentSize ?? 0) < indentSize) quotedLines.set(key, {
				...line,
				style: TextStyle.Indent,
				indentSize,
				priority: 2
			});
		}
	}
	styles.push(...quotedLines.values());
	return styles;
}
function splitRangeAtOffsets(range, offsets, text) {
	const boundaries = [
		range.start,
		...offsets.filter((offset) => offset > range.start && offset < range.end),
		range.end
	].toSorted((left, right) => left - right);
	return boundaries.flatMap((start, index) => {
		const end = boundaries[index + 1];
		return end === void 0 ? [] : splitLines({
			start,
			end
		}, text);
	});
}
function subtractRanges(range, exclusions) {
	const result = [];
	let cursor = range.start;
	for (const exclusion of exclusions.toSorted((left, right) => left.start - right.start)) {
		const start = Math.max(range.start, exclusion.start);
		const end = Math.min(range.end, exclusion.end);
		if (end <= cursor) continue;
		if (start > cursor) result.push({
			start: cursor,
			end: start
		});
		cursor = end;
	}
	if (cursor < range.end) result.push({
		start: cursor,
		end: range.end
	});
	return result;
}
function splitLines(range, text) {
	return splitStyledLines(range, text).filter(({ start, end }) => text.slice(start, end).replace(/[ \t\r\n]/gu, ""));
}
function applyTextEdits(text, inlineStyles, structuralStyles, edits) {
	let output = "";
	let cursor = 0;
	for (const edit of edits) {
		output += text.slice(cursor, edit.start) + edit.text;
		cursor = edit.end;
	}
	output += text.slice(cursor);
	const ordered = [...inlineStyles.map((style, sequence) => ({
		start: style.start,
		end: style.start + style.len,
		style: style.st,
		...style.st === TextStyle.Indent ? { indentSize: style.indentSize } : {},
		priority: 0,
		sequence
	})), ...structuralStyles.map((style, sequence) => Object.assign({}, style, { sequence }))].map((style) => Object.assign(style, {
		start: mapEditedOffset(style.start, edits, false, style.priority > 0),
		end: mapEditedOffset(style.end, edits, true, style.priority > 0)
	})).flatMap((style) => style.style === TextStyle.Indent ? splitStyledLines(style, output) : [style]).filter((style) => style.end > style.start);
	for (const [editIndex, edit] of edits.entries()) {
		if (!edit.indentSize && !edit.listStyle || !edit.text) continue;
		const start = editedInsertionStart(edits, editIndex);
		const range = {
			start,
			end: start + edit.text.length
		};
		if (edit.indentSize) ordered.push(...splitStyledLines({
			...range,
			style: TextStyle.Indent,
			indentSize: edit.indentSize,
			priority: 2,
			sequence: structuralStyles.length + editIndex
		}, output));
		if (edit.listStyle) ordered.push(...splitStyledLines({
			...range,
			style: edit.listStyle,
			priority: 3,
			sequence: structuralStyles.length + editIndex
		}, output));
	}
	ordered.sort((left, right) => left.start - right.start || left.priority - right.priority || left.sequence - right.sequence);
	const styles = [];
	for (const style of ordered.map((orderedStyle) => orderedStyle.style === TextStyle.Indent ? {
		start: orderedStyle.start,
		len: orderedStyle.end - orderedStyle.start,
		st: TextStyle.Indent,
		indentSize: orderedStyle.indentSize
	} : {
		start: orderedStyle.start,
		len: orderedStyle.end - orderedStyle.start,
		st: orderedStyle.style
	})) {
		const previous = styles.at(-1);
		if (previous?.st === TextStyle.Indent && style.st === TextStyle.Indent && previous.start === style.start && previous.len === style.len) previous.indentSize = Math.min(5, (previous.indentSize ?? 1) + (style.indentSize ?? 1));
		else styles.push(style);
	}
	return {
		text: output,
		styles
	};
}
function editedInsertionStart(edits, targetIndex) {
	let delta = 0;
	for (let index = 0; index < targetIndex; index += 1) {
		const edit = edits[index];
		if (edit) delta += edit.text.length - (edit.end - edit.start);
	}
	return (edits[targetIndex]?.start ?? 0) + delta;
}
function splitStyledLines(style, text) {
	const lines = [];
	let start = style.start;
	while (start < style.end) {
		const newline = text.indexOf("\n", start);
		const end = newline === -1 ? style.end : Math.min(newline, style.end);
		if (end > start) lines.push({
			...style,
			start,
			end
		});
		start = end + 1;
	}
	return lines;
}
function mapEditedOffset(offset, edits, preferEnd, includeBoundaryInsertions = false) {
	let delta = 0;
	for (const edit of edits) {
		if (edit.end < offset || edit.end === offset && edit.start < edit.end) {
			delta += edit.text.length - (edit.end - edit.start);
			continue;
		}
		if (edit.start > offset) break;
		if (edit.start === edit.end && offset === edit.start) {
			if (!preferEnd && !includeBoundaryInsertions || preferEnd && includeBoundaryInsertions) delta += edit.text.length;
			continue;
		}
		if (offset === edit.start) return edit.start + delta;
		if (offset < edit.end) return edit.start + delta + (preferEnd ? edit.text.length : 0);
	}
	return offset + delta;
}
function restoreTrailingNewlines(text, source, ir) {
	const sourceLines = source.split("\n");
	let lastContentLine = sourceLines.length - 1;
	while (lastContentLine >= 0 && !(ir.blocks ?? []).some((block) => block.kind === "code_block" && lastContentLine >= (block.sourceStartLine ?? 0) && lastContentLine < (block.sourceEndLine ?? 0)) && (/^[ \t]*$/u.test(sourceLines[lastContentLine] ?? "") || /^(?: {0,3}>[ \t]?)+[ \t]*$/u.test(sourceLines[lastContentLine] ?? ""))) lastContentLine -= 1;
	const trailingNewlines = sourceLines.length - 1 - Math.max(0, lastContentLine);
	const renderedTrailingNewlines = text.match(/\n*$/u)?.[0].length ?? 0;
	return `${text}${"\n".repeat(Math.max(0, trailingNewlines - renderedTrailingNewlines))}`;
}
function sliceTextStyles(styles, start, end) {
	if (!styles || styles.length === 0) return;
	const chunkStyles = styles.map((style) => {
		const overlapStart = Math.max(style.start, start);
		const overlapEnd = Math.min(style.start + style.len, end);
		if (overlapEnd <= overlapStart) return null;
		if (style.st === TextStyle.Indent) return {
			start: overlapStart - start,
			len: overlapEnd - overlapStart,
			st: style.st,
			indentSize: style.indentSize
		};
		return {
			start: overlapStart - start,
			len: overlapEnd - overlapStart,
			st: style.st
		};
	}).filter((style) => style !== null);
	return chunkStyles.length > 0 ? chunkStyles : void 0;
}
//#endregion
//#region extensions/zalouser/src/send-api.ts
function extractSendMessageId(result) {
	if (!result || typeof result !== "object") return;
	const messageId = result.msgId ?? result.message?.msgId ?? result.attachment?.[0]?.msgId;
	return messageId == null ? void 0 : String(messageId);
}
function resolveMediaFileName(params) {
	const explicit = params.fileName?.trim();
	if (explicit) return explicit;
	try {
		const parsed = new URL(params.mediaUrl);
		const fromPath = path.basename(parsed.pathname).trim();
		if (fromPath) return fromPath;
	} catch {}
	return `upload.${extensionForMime(params.contentType)?.replace(/^\./u, "") ?? (params.kind === "video" ? "mp4" : params.kind === "audio" ? "mp3" : params.kind === "image" ? "jpg" : "bin")}`;
}
function hasAttachmentExtension(fileName) {
	return fileName.includes(".");
}
function resolveUploadedVoiceUrl(uploaded) {
	for (const item of uploaded) {
		if (!item || typeof item !== "object") continue;
		const fileType = normalizeOptionalLowercaseString(item.fileType);
		const fileUrl = item.fileUrl?.trim();
		if (!fileUrl) continue;
		if (fileType === "others" || fileType === "video") return fileUrl;
	}
}
async function sendZaloTextWithApi(api, trimmedThreadId, text, options, onDeliveryResult) {
	const type = options.isGroup ? ThreadType.Group : ThreadType.User;
	let textMessageId;
	try {
		const mediaUrl = options.mediaUrl?.trim();
		const media = mediaUrl ? await loadOutboundMediaFromUrl(mediaUrl, {
			maxBytes: options.mediaMaxBytes,
			mediaLocalRoots: options.mediaLocalRoots,
			mediaReadFile: options.mediaReadFile,
			fetchImpl: fetchMediaWithZaloSendContext
		}) : void 0;
		const attachments = [];
		if (media && mediaUrl) {
			const fileName = resolveMediaFileName({
				mediaUrl: options.mediaUrl ?? mediaUrl,
				fileName: media.fileName,
				contentType: media.contentType,
				kind: media.kind
			});
			attachments.push({
				data: media.buffer,
				filename: hasAttachmentExtension(fileName) ? fileName : `${fileName}.bin`,
				metadata: { totalSize: media.buffer.length }
			});
		}
		const payloadText = truncateUtf16Safe(media ? text || options.caption || "" : text, 2e3);
		const textStyles = sliceTextStyles(options.textStyles, 0, payloadText.length);
		if (media?.kind === "audio") {
			if (payloadText) {
				textMessageId = extractSendMessageId(await api.sendMessage(textStyles ? {
					msg: payloadText,
					styles: textStyles
				} : payloadText, trimmedThreadId, type));
				await onDeliveryResult?.({
					ok: true,
					messageId: textMessageId,
					receipt: createZalouserSendReceipt({
						messageId: textMessageId,
						threadId: trimmedThreadId,
						kind: "text"
					})
				});
			}
			const voiceUrl = resolveUploadedVoiceUrl(await api.uploadAttachment(attachments, trimmedThreadId, type));
			if (!voiceUrl) throw new Error("Failed to resolve uploaded audio URL for voice message");
			const voiceMessageId = extractSendMessageId(await api.sendVoice({ voiceUrl }, trimmedThreadId, type));
			return {
				ok: true,
				messageId: voiceMessageId ?? textMessageId,
				receipt: createZalouserSendReceipt({
					platformMessageIds: [textMessageId, voiceMessageId],
					threadId: trimmedThreadId,
					kind: "voice"
				})
			};
		}
		const messageId = extractSendMessageId(await api.sendMessage(media ? {
			msg: payloadText,
			...textStyles ? { styles: textStyles } : {},
			attachments
		} : textStyles ? {
			msg: payloadText,
			styles: textStyles
		} : payloadText, trimmedThreadId, type));
		return {
			ok: true,
			messageId,
			receipt: createZalouserSendReceipt({
				messageId,
				threadId: trimmedThreadId,
				kind: media ? "media" : "text"
			})
		};
	} catch (error) {
		return {
			ok: false,
			error: formatErrorMessage(error),
			receipt: createZalouserSendReceipt({
				messageId: textMessageId,
				threadId: trimmedThreadId,
				kind: textMessageId ? "text" : "unknown"
			})
		};
	}
}
//#endregion
//#region extensions/zalouser/src/zca-client.ts
const require = createRequire(import.meta.url);
const loadZcaJsRuntime = createLazyRuntimeModule(async () => {
	return require("zca-js");
});
async function createZalo(options) {
	const Zalo = (await loadZcaJsRuntime()).Zalo;
	return new Zalo({
		...options,
		polyfill: fetchWithZaloSendContext
	});
}
//#endregion
//#region extensions/zalouser/src/zalo-js.ts
var zalo_js_exports = /* @__PURE__ */ __exportAll({
	checkZaloAuthenticated: () => checkZaloAuthenticated,
	getZaloUserInfo: () => getZaloUserInfo,
	listZaloFriends: () => listZaloFriends,
	listZaloFriendsMatching: () => listZaloFriendsMatching,
	listZaloGroupMembers: () => listZaloGroupMembers,
	listZaloGroups: () => listZaloGroups,
	listZaloGroupsMatching: () => listZaloGroupsMatching,
	logoutZaloProfile: () => logoutZaloProfile,
	normalizeZaloInboundMessage: () => normalizeZaloInboundMessage,
	resolveZaloAllowFromEntries: () => resolveZaloAllowFromEntries,
	resolveZaloGroupContext: () => resolveZaloGroupContext,
	resolveZaloGroupsByEntries: () => resolveZaloGroupsByEntries,
	resolveZaloOwnUserId: () => resolveZaloOwnUserId,
	sendZaloDeliveredEvent: () => sendZaloDeliveredEvent,
	sendZaloLink: () => sendZaloLink,
	sendZaloReaction: () => sendZaloReaction,
	sendZaloSeenEvent: () => sendZaloSeenEvent,
	sendZaloTextMessage: () => sendZaloTextMessage,
	sendZaloTypingEvent: () => sendZaloTypingEvent,
	startZaloListener: () => startZaloListener,
	startZaloQrLogin: () => startZaloQrLogin,
	waitForZaloQrLogin: () => waitForZaloQrLogin
});
const API_LOGIN_TIMEOUT_MS = 2e4;
const QR_LOGIN_TTL_MS = 18e4;
const DEFAULT_QR_START_TIMEOUT_MS = 3e4;
const DEFAULT_QR_WAIT_TIMEOUT_MS = 12e4;
const GROUP_INFO_CHUNK_SIZE = 80;
const GROUP_CONTEXT_CACHE_TTL_MS = 3e5;
const GROUP_CONTEXT_CACHE_MAX_ENTRIES = 500;
const LISTENER_WATCHDOG_INTERVAL_MS = 3e4;
const LISTENER_WATCHDOG_MAX_GAP_MS = 35e3;
const LISTENER_HANDSHAKE_TIMEOUT_MS = 3e4;
const ZALO_TIMESTAMP_MS_THRESHOLD = 0xe8d4a51000;
const MAX_SAFE_ZALO_TIMESTAMP_SECONDS = Number.MAX_SAFE_INTEGER / 1e3;
const apiByProfile = /* @__PURE__ */ new Map();
const apiInitByProfile = /* @__PURE__ */ new Map();
const credentials = new ZaloCredentialPersistence((profile, api) => apiByProfile.get(profile) === api);
const activeQrLogins = /* @__PURE__ */ new Map();
const activeListeners = /* @__PURE__ */ new Map();
const groupContextCache = /* @__PURE__ */ new Map();
function toNumberId(value) {
	if (typeof value === "number" && Number.isFinite(value)) return String(Math.trunc(value));
	if (typeof value === "string") {
		const trimmed = value.trim();
		if (trimmed.length > 0) return trimmed.replace(/_\d+$/, "");
	}
	return "";
}
function toStringValue(value) {
	return normalizeOptionalStringifiedId(value) ?? "";
}
function normalizeAccountInfoUser(info) {
	if (!info || typeof info !== "object") return null;
	if ("profile" in info) {
		const profile = info.profile;
		if (profile && typeof profile === "object") return profile;
		return null;
	}
	return info;
}
function toInteger(value) {
	if (typeof value === "number" && Number.isFinite(value)) return Math.trunc(value);
	const parsed = Number.parseInt(typeof value === "string" ? value : typeof value === "number" ? String(value) : "", 10);
	return Number.isFinite(parsed) ? parsed : 0;
}
function normalizeMessageContent(content) {
	if (typeof content === "string") return content;
	if (!content || typeof content !== "object") return "";
	const record = content;
	const combined = [
		typeof record.title === "string" ? record.title.trim() : "",
		typeof record.description === "string" ? record.description.trim() : "",
		typeof record.href === "string" ? record.href.trim() : ""
	].filter(Boolean).join("\n").trim();
	if (combined) return combined;
	try {
		return JSON.stringify(content);
	} catch {
		return "";
	}
}
function resolveInboundTimestamp(rawTs) {
	const fallbackTimestamp = () => asDateTimestampMs(Date.now()) ?? 0;
	const parsed = typeof rawTs === "number" ? rawTs : typeof rawTs === "string" ? parseStrictFiniteNumber(rawTs) : void 0;
	const timestamp = asFiniteNumberInRange(parsed, {
		min: 0,
		minExclusive: true,
		max: Number.MAX_SAFE_INTEGER
	});
	if (timestamp === void 0) return fallbackTimestamp();
	if (timestamp > ZALO_TIMESTAMP_MS_THRESHOLD) return asDateTimestampMs(Math.trunc(timestamp)) ?? fallbackTimestamp();
	if (timestamp > MAX_SAFE_ZALO_TIMESTAMP_SECONDS) return fallbackTimestamp();
	return asDateTimestampMs(Math.trunc(timestamp * 1e3)) ?? fallbackTimestamp();
}
function extractMentionIds(rawMentions) {
	if (!Array.isArray(rawMentions)) return [];
	const sink = /* @__PURE__ */ new Set();
	for (const entry of rawMentions) {
		if (!entry || typeof entry !== "object") continue;
		const id = toNumberId(entry.uid);
		if (id) sink.add(id);
	}
	return Array.from(sink);
}
function toNonNegativeInteger(value) {
	if (typeof value === "number" && Number.isFinite(value)) {
		const normalized = Math.trunc(value);
		return normalized >= 0 ? normalized : null;
	}
	if (typeof value === "string" && value.trim().length > 0) return parseStrictNonNegativeInteger(value) ?? null;
	return null;
}
function extractOwnMentionSpans(rawMentions, ownUserId, contentLength) {
	if (!Array.isArray(rawMentions) || !ownUserId || contentLength <= 0) return [];
	const spans = [];
	for (const entry of rawMentions) {
		if (!entry || typeof entry !== "object") continue;
		const record = entry;
		const uid = toNumberId(record.uid);
		if (!uid || uid !== ownUserId) continue;
		const startRaw = toNonNegativeInteger(record.pos ?? record.start ?? record.offset);
		const lengthRaw = toNonNegativeInteger(record.len ?? record.length);
		if (startRaw === null || lengthRaw === null || lengthRaw <= 0) continue;
		const start = Math.min(startRaw, contentLength);
		const end = Math.min(start + lengthRaw, contentLength);
		if (end <= start) continue;
		spans.push({
			start,
			end
		});
	}
	if (spans.length <= 1) return spans;
	spans.sort((a, b) => a.start - b.start);
	const merged = [];
	for (const span of spans) {
		const last = merged[merged.length - 1];
		if (!last || span.start > last.end) {
			merged.push({ ...span });
			continue;
		}
		last.end = Math.max(last.end, span.end);
	}
	return merged;
}
function stripOwnMentionsForCommandBody(content, rawMentions, ownUserId) {
	if (!content || !ownUserId) return content;
	const spans = extractOwnMentionSpans(rawMentions, ownUserId, content.length);
	if (spans.length === 0) return stripLeadingAtMentionForCommand(content);
	let cursor = 0;
	let output = "";
	for (const span of spans) {
		if (span.start > cursor) output += content.slice(cursor, span.start);
		cursor = Math.max(cursor, span.end);
	}
	if (cursor < content.length) output += content.slice(cursor);
	return output.replace(/\s+/g, " ").trim();
}
function stripLeadingAtMentionForCommand(content) {
	const fallbackMatch = content.match(/^\s*@[^\s]+(?:\s+|[:,-]\s*)([/!][\s\S]*)$/);
	if (!fallbackMatch) return content;
	return expectDefined(fallbackMatch[1], "leading mention command capture").trim();
}
function resolveGroupNameFromMessageData(data) {
	const candidates = [
		data.groupName,
		data.gName,
		data.idToName,
		data.threadName,
		data.roomName
	];
	for (const candidate of candidates) {
		const value = toStringValue(candidate);
		if (value) return value;
	}
}
function buildEventMessage(data) {
	const msgId = toStringValue(data.msgId);
	const cliMsgId = toStringValue(data.cliMsgId);
	const uidFrom = toStringValue(data.uidFrom);
	const idTo = toStringValue(data.idTo);
	if (!msgId || !cliMsgId || !uidFrom || !idTo) return;
	return {
		msgId,
		cliMsgId,
		uidFrom,
		idTo,
		msgType: toStringValue(data.msgType) || "webchat",
		st: toInteger(data.st),
		at: toInteger(data.at),
		cmd: toInteger(data.cmd),
		ts: toStringValue(data.ts) || Date.now()
	};
}
function mapFriend(friend) {
	return {
		userId: friend.userId,
		displayName: friend.displayName || friend.zaloName || friend.username || friend.userId,
		avatar: friend.avatar || void 0
	};
}
function mapGroup(groupId, group) {
	const totalMember = typeof group.totalMember === "number" && Number.isFinite(group.totalMember) ? group.totalMember : void 0;
	return {
		groupId,
		name: group.name?.trim() || groupId,
		memberCount: totalMember
	};
}
async function ensureApi(profileInput, timeoutMs = API_LOGIN_TIMEOUT_MS, credentialPersistence = "persist") {
	const profile = normalizeZalouserCredentialProfile(profileInput);
	const env = captureZalouserCredentialsEnv();
	const pendingRevocation = credentials.pendingRevocation(profile);
	if (pendingRevocation) await pendingRevocation;
	const cached = apiByProfile.get(profile);
	if (cached) return cached;
	const pending = apiInitByProfile.get(profile);
	if (pending) return await pending;
	const initPromise = (async () => {
		const isCurrent = () => apiInitByProfile.get(profile) === initPromise;
		const stored = await loadStoredZaloCredentials(profile, env).catch(() => null);
		if (!stored || !isCurrent()) throw new Error(`No saved Zalo session for profile "${profile}"`);
		const zalo = await createZalo({
			logging: false,
			selfListen: false
		});
		const api = await withTimeout(zalo.login({
			imei: stored.imei,
			cookie: stored.cookie,
			userAgent: stored.userAgent,
			language: stored.language
		}), timeoutMs, { message: `Timed out restoring Zalo session for profile "${profile}"` });
		const persisted = credentialPersistence === "persist" ? await refreshStoredZaloCredentials(profile, snapshotApiCredentials(api, stored), isCurrent, env) : stored;
		if (!isCurrent() || !persisted) throw new Error(`Zalo session restore was superseded for profile "${profile}"`);
		credentials.rememberCredentials(profile, persisted);
		apiByProfile.set(profile, api);
		return api;
	})();
	apiInitByProfile.set(profile, initPromise);
	try {
		return await initPromise;
	} catch (error) {
		if (apiInitByProfile.get(profile) === initPromise) apiByProfile.delete(profile);
		throw error;
	} finally {
		if (apiInitByProfile.get(profile) === initPromise) apiInitByProfile.delete(profile);
	}
}
async function withZaloApi(profileInput, operation, options = {}) {
	const profile = normalizeZalouserCredentialProfile(profileInput);
	const credentialPersistence = options.credentialPersistence ?? "persist";
	options.handoff?.signal?.throwIfAborted();
	options.handoff?.assertDirectAdapterHandoff?.();
	const api = await ensureApi(profile, options.timeoutMs, credentialPersistence);
	const result = options.handoff ? await withZaloSendContext(options.handoff, () => operation(api)) : await operation(api);
	if (credentialPersistence === "persist" && (options.shouldPersist?.(result) ?? true)) await credentials.persistApiCredentialsIfChanged(profile, api);
	return result;
}
function invalidateApi(profileInput) {
	const profile = normalizeZalouserCredentialProfile(profileInput);
	const api = apiByProfile.get(profile);
	if (api) try {
		api.listener.stop();
	} catch {}
	apiByProfile.delete(profile);
	apiInitByProfile.delete(profile);
}
function isQrLoginFresh(login) {
	return Date.now() - login.startedAt < QR_LOGIN_TTL_MS;
}
function resetQrLogin(profileInput) {
	const profile = normalizeZalouserCredentialProfile(profileInput);
	const active = activeQrLogins.get(profile);
	if (!active) return;
	try {
		active.abort?.();
	} catch {}
	activeQrLogins.delete(profile);
}
async function fetchGroupsByIds(api, ids) {
	const result = /* @__PURE__ */ new Map();
	for (let index = 0; index < ids.length; index += GROUP_INFO_CHUNK_SIZE) {
		const chunk = ids.slice(index, index + GROUP_INFO_CHUNK_SIZE);
		const map = (await api.getGroupInfo(chunk)).gridInfoMap ?? {};
		for (const [groupId, info] of Object.entries(map)) result.set(groupId, info);
	}
	return result;
}
function readCachedGroupContext(profile, groupId) {
	const key = `${profile}:${groupId}`;
	const cached = groupContextCache.get(key);
	if (!cached) return null;
	if (!isFutureDateTimestampMs(cached.expiresAt)) {
		groupContextCache.delete(key);
		return null;
	}
	groupContextCache.delete(key);
	groupContextCache.set(key, cached);
	return cached.value;
}
function trimGroupContextCache(now) {
	for (const [key, value] of groupContextCache) {
		if (isFutureDateTimestampMs(value.expiresAt, { nowMs: now })) continue;
		groupContextCache.delete(key);
	}
	pruneMapToMaxSize(groupContextCache, GROUP_CONTEXT_CACHE_MAX_ENTRIES);
}
function writeCachedGroupContext(profile, context) {
	const now = Date.now();
	const key = `${profile}:${context.groupId}`;
	if (groupContextCache.has(key)) groupContextCache.delete(key);
	const expiresAt = resolveExpiresAtMsFromDurationMs(GROUP_CONTEXT_CACHE_TTL_MS, { nowMs: now });
	if (expiresAt === void 0) return;
	groupContextCache.set(key, {
		value: context,
		expiresAt
	});
	trimGroupContextCache(now);
}
function clearCachedGroupContext(profile) {
	for (const key of groupContextCache.keys()) if (key.startsWith(`${profile}:`)) groupContextCache.delete(key);
}
function extractGroupMembersFromInfo(groupInfo) {
	if (!groupInfo || !Array.isArray(groupInfo.currentMems)) return;
	const members = groupInfo.currentMems.map((member) => {
		if (!member || typeof member !== "object") return "";
		const record = member;
		return toStringValue(record.dName) || toStringValue(record.zaloName);
	}).filter(Boolean);
	if (members.length === 0) return;
	return members;
}
function normalizeZaloInboundMessage(message, ownUserId) {
	const data = message.data;
	const isGroup = message.type === ThreadType.Group;
	const senderId = toNumberId(data.uidFrom);
	const threadId = isGroup ? toNumberId(data.idTo) : toNumberId(data.uidFrom) || toNumberId(data.idTo);
	if (!threadId || !senderId) return null;
	const content = normalizeMessageContent(data.content);
	const normalizedOwnUserId = toNumberId(ownUserId);
	const mentionIds = extractMentionIds(data.mentions);
	const quote = data.quote && typeof data.quote === "object" ? data.quote : void 0;
	const quoteOwnerId = toNumberId(quote?.ownerId);
	const quotedGlobalMsgId = toStringValue(quote?.globalMsgId);
	const quotedBody = toStringValue(quote?.msg);
	const hasAnyMention = mentionIds.length > 0;
	const canResolveExplicitMention = Boolean(normalizedOwnUserId);
	const wasExplicitlyMentioned = Boolean(normalizedOwnUserId && mentionIds.some((id) => id === normalizedOwnUserId));
	const commandContent = wasExplicitlyMentioned ? stripOwnMentionsForCommandBody(content, data.mentions, normalizedOwnUserId) : hasAnyMention && !canResolveExplicitMention ? stripLeadingAtMentionForCommand(content) : content;
	const implicitMention = Boolean(normalizedOwnUserId && quoteOwnerId && quoteOwnerId === normalizedOwnUserId);
	const eventMessage = buildEventMessage(data);
	return {
		threadId,
		isGroup,
		senderId,
		senderName: typeof data.dName === "string" ? data.dName.trim() || void 0 : void 0,
		groupName: isGroup ? resolveGroupNameFromMessageData(data) : void 0,
		content,
		commandContent,
		timestampMs: resolveInboundTimestamp(data.ts),
		msgId: typeof data.msgId === "string" ? data.msgId : void 0,
		cliMsgId: typeof data.cliMsgId === "string" ? data.cliMsgId : void 0,
		hasAnyMention,
		canResolveExplicitMention,
		wasExplicitlyMentioned,
		implicitMention,
		quotedGlobalMsgId: quotedGlobalMsgId || void 0,
		quotedOwnerId: quoteOwnerId || void 0,
		quotedBody: quotedBody || void 0,
		eventMessage,
		raw: message
	};
}
async function checkZaloAuthenticated(profileInput, options) {
	const profile = normalizeZalouserCredentialProfile(profileInput);
	if (!await loadStoredZaloCredentials(profile).catch(() => null)) return false;
	try {
		await withZaloApi(profile, async (api) => {
			try {
				return await withTimeout(api.fetchAccountInfo(), 12e3, { message: "Timed out checking Zalo session" });
			} catch (error) {
				if (apiByProfile.get(profile) === api) invalidateApi(profile);
				throw error;
			}
		}, {
			timeoutMs: 12e3,
			credentialPersistence: options?.credentialPersistence ?? "persist"
		});
		return true;
	} catch {
		return false;
	}
}
async function getZaloUserInfo(profileInput) {
	return await withZaloApi(profileInput, async (api) => {
		const user = normalizeAccountInfoUser(await api.fetchAccountInfo());
		if (!user?.userId) return null;
		return {
			userId: user.userId,
			displayName: user.displayName || user.zaloName || user.userId,
			avatar: user.avatar || void 0
		};
	});
}
async function listZaloFriends(profileInput, options) {
	return await withZaloApi(profileInput, async (api) => {
		return (await api.getAllFriends()).map(mapFriend);
	}, { credentialPersistence: options?.credentialPersistence ?? "persist" });
}
async function listZaloFriendsMatching(profileInput, query) {
	const friends = await listZaloFriends(profileInput);
	const q = normalizeOptionalLowercaseString(query);
	if (!q) return friends;
	return friends.map((friend) => {
		const id = normalizeLowercaseStringOrEmpty(friend.userId);
		const name = normalizeLowercaseStringOrEmpty(friend.displayName);
		return {
			friend,
			exact: id === q || name === q,
			includes: id.includes(q) || name.includes(q)
		};
	}).filter((entry) => entry.includes).toSorted((a, b) => Number(b.exact) - Number(a.exact)).map((entry) => entry.friend);
}
async function listZaloGroups(profileInput, options) {
	return await withZaloApi(profileInput, async (api) => {
		const allGroups = await api.getAllGroups();
		const ids = Object.keys(allGroups.gridVerMap ?? {});
		if (ids.length === 0) return [];
		const details = await fetchGroupsByIds(api, ids);
		return ids.map((id) => {
			const info = details.get(id);
			return info ? mapGroup(id, info) : {
				groupId: id,
				name: id
			};
		});
	}, { credentialPersistence: options?.credentialPersistence ?? "persist" });
}
async function listZaloGroupsMatching(profileInput, query) {
	const groups = await listZaloGroups(profileInput);
	const q = normalizeOptionalLowercaseString(query);
	if (!q) return groups;
	return groups.filter((group) => {
		const id = normalizeLowercaseStringOrEmpty(group.groupId);
		const name = normalizeLowercaseStringOrEmpty(group.name);
		return id.includes(q) || name.includes(q);
	});
}
async function listZaloGroupMembers(profileInput, groupId) {
	return await withZaloApi(profileInput, async (api) => {
		const groupInfo = (await api.getGroupInfo(groupId)).gridInfoMap?.[groupId];
		if (!groupInfo) return [];
		const memberIds = Array.isArray(groupInfo.memberIds) ? groupInfo.memberIds.map((id) => toNumberId(id)).filter(Boolean) : [];
		const memVerIds = Array.isArray(groupInfo.memVerList) ? groupInfo.memVerList.map((id) => toNumberId(id)).filter(Boolean) : [];
		const currentMembers = Array.isArray(groupInfo.currentMems) ? groupInfo.currentMems : [];
		const currentById = /* @__PURE__ */ new Map();
		for (const member of currentMembers) {
			const id = toNumberId(member?.id);
			if (!id) continue;
			currentById.set(id, {
				displayName: normalizeOptionalString(member.dName) ?? normalizeOptionalString(member.zaloName),
				avatar: member.avatar || void 0
			});
		}
		const uniqueIds = Array.from(/* @__PURE__ */ new Set([
			...memberIds,
			...memVerIds,
			...currentById.keys()
		]));
		const profileMap = /* @__PURE__ */ new Map();
		if (uniqueIds.length > 0) {
			const profiles = await api.getGroupMembersInfo(uniqueIds);
			for (const [rawId, profileValue] of Object.entries(profiles.profiles)) {
				const id = toNumberId(rawId) || toNumberId(profileValue?.id);
				if (!id || !profileValue) continue;
				profileMap.set(id, {
					displayName: normalizeOptionalString(profileValue.displayName) ?? normalizeOptionalString(profileValue.zaloName),
					avatar: profileValue.avatar || void 0
				});
			}
		}
		return uniqueIds.map((id) => ({
			userId: id,
			displayName: profileMap.get(id)?.displayName || currentById.get(id)?.displayName || id,
			avatar: profileMap.get(id)?.avatar || currentById.get(id)?.avatar
		}));
	});
}
async function resolveZaloGroupContext(profileInput, groupId) {
	const profile = normalizeZalouserCredentialProfile(profileInput);
	const normalizedGroupId = toNumberId(groupId) || groupId.trim();
	if (!normalizedGroupId) throw new Error("groupId is required");
	const cached = readCachedGroupContext(profile, normalizedGroupId);
	if (cached) return cached;
	return await withZaloApi(profile, async (api) => {
		const groupInfo = (await api.getGroupInfo(normalizedGroupId)).gridInfoMap?.[normalizedGroupId];
		const context = {
			groupId: normalizedGroupId,
			name: normalizeOptionalString(groupInfo?.name),
			members: extractGroupMembersFromInfo(groupInfo)
		};
		writeCachedGroupContext(profile, context);
		return context;
	});
}
async function sendZaloTextMessage(threadId, text, options = {}, onDeliveryResult) {
	const trimmedThreadId = threadId.trim();
	if (!trimmedThreadId) return {
		ok: false,
		error: "No threadId provided",
		receipt: createZalouserSendReceipt({
			threadId,
			kind: "unknown"
		})
	};
	return await withZaloApi(options.profile, (api) => sendZaloTextWithApi(api, trimmedThreadId, text, options, onDeliveryResult), {
		shouldPersist: (result) => result.ok,
		handoff: options
	});
}
async function sendZaloTypingEvent(threadId, options = {}) {
	const trimmedThreadId = threadId.trim();
	if (!trimmedThreadId) throw new Error("No threadId provided");
	await withZaloApi(options.profile, async (api) => {
		const type = options.isGroup ? ThreadType.Group : ThreadType.User;
		await api.sendTypingEvent(trimmedThreadId, type);
	});
}
async function resolveOwnUserId(api) {
	try {
		const resolved = toNumberId(normalizeAccountInfoUser(await api.fetchAccountInfo())?.userId);
		if (resolved) return resolved;
	} catch {}
	try {
		const ownId = toNumberId(api.getOwnId());
		if (ownId) return ownId;
	} catch {}
	return "";
}
async function resolveZaloOwnUserId(profileInput) {
	return await withZaloApi(profileInput, resolveOwnUserId);
}
async function sendZaloReaction(params) {
	const threadId = params.threadId.trim();
	const msgId = toStringValue(params.msgId);
	const cliMsgId = toStringValue(params.cliMsgId);
	if (!threadId || !msgId || !cliMsgId) return {
		ok: false,
		error: "threadId, msgId, and cliMsgId are required"
	};
	try {
		return await withZaloApi(params.profile, async (api) => {
			const type = params.isGroup ? ThreadType.Group : ThreadType.User;
			const icon = params.remove ? {
				rType: -1,
				source: 6,
				icon: ""
			} : normalizeZaloReactionIcon(params.emoji);
			await api.addReaction(icon, {
				data: {
					msgId,
					cliMsgId
				},
				threadId,
				type
			});
			return { ok: true };
		}, { shouldPersist: (result) => result.ok });
	} catch (error) {
		return {
			ok: false,
			error: formatErrorMessage(error)
		};
	}
}
async function sendZaloDeliveredEvent(params) {
	await withZaloApi(params.profile, async (api) => {
		const type = params.isGroup ? ThreadType.Group : ThreadType.User;
		await api.sendDeliveredEvent(params.isSeen === true, params.message, type);
	});
}
async function sendZaloSeenEvent(params) {
	await withZaloApi(params.profile, async (api) => {
		const type = params.isGroup ? ThreadType.Group : ThreadType.User;
		await api.sendSeenEvent(params.message, type);
	});
}
async function sendZaloLink(threadId, url, options = {}) {
	const trimmedThreadId = threadId.trim();
	const trimmedUrl = url.trim();
	if (!trimmedThreadId) return {
		ok: false,
		error: "No threadId provided",
		receipt: createZalouserSendReceipt({
			threadId,
			kind: "unknown"
		})
	};
	if (!trimmedUrl) return {
		ok: false,
		error: "No URL provided",
		receipt: createZalouserSendReceipt({
			threadId: trimmedThreadId,
			kind: "card"
		})
	};
	try {
		return await withZaloApi(options.profile, async (api) => {
			const type = options.isGroup ? ThreadType.Group : ThreadType.User;
			const response = await api.sendLink({
				link: trimmedUrl,
				msg: options.caption
			}, trimmedThreadId, type);
			const messageId = String(response.msgId);
			return {
				ok: true,
				messageId,
				receipt: createZalouserSendReceipt({
					messageId,
					threadId: trimmedThreadId,
					kind: "card"
				})
			};
		}, {
			shouldPersist: (result) => result.ok,
			handoff: options
		});
	} catch (error) {
		return {
			ok: false,
			error: formatErrorMessage(error),
			receipt: createZalouserSendReceipt({
				threadId: trimmedThreadId,
				kind: "card"
			})
		};
	}
}
async function startZaloQrLogin(params) {
	const profile = normalizeZalouserCredentialProfile(params.profile);
	if (!params.force && await checkZaloAuthenticated(profile)) {
		const info = await getZaloUserInfo(profile).catch(() => null);
		return { message: `Zalo is already linked${info?.displayName ? ` (${info.displayName})` : ""}.` };
	}
	params.assertCredentialPersistenceCurrent?.();
	if (params.force) await logoutZaloProfile(profile, { assertCurrent: params.assertCredentialPersistenceCurrent });
	let existing = activeQrLogins.get(profile);
	if (existing && (params.beforeCredentialPersistence && existing.beforeCredentialPersistence !== params.beforeCredentialPersistence || params.assertCredentialPersistenceCurrent && existing.assertCredentialPersistenceCurrent !== params.assertCredentialPersistenceCurrent)) {
		resetQrLogin(profile);
		existing = void 0;
	}
	if (existing && isQrLoginFresh(existing)) {
		if (existing.qrDataUrl) return {
			qrDataUrl: existing.qrDataUrl,
			message: "QR already active. Scan it with the Zalo app."
		};
	} else if (existing) resetQrLogin(profile);
	if (!activeQrLogins.has(profile)) {
		const login = {
			id: randomUUID(),
			startedAt: Date.now(),
			...params.beforeCredentialPersistence ? { beforeCredentialPersistence: params.beforeCredentialPersistence } : {},
			...params.assertCredentialPersistenceCurrent ? { assertCredentialPersistenceCurrent: params.assertCredentialPersistenceCurrent } : {},
			connected: false,
			waitPromise: Promise.resolve()
		};
		login.waitPromise = (async () => {
			let capturedCredentials = null;
			try {
				const api = await (await createZalo({
					logging: false,
					selfListen: false
				})).loginQR(void 0, (event) => {
					const current = activeQrLogins.get(profile);
					if (!current || current.id !== login.id) return;
					if (event.actions?.abort) current.abort = () => {
						try {
							event.actions?.abort?.();
						} catch {}
					};
					switch (event.type) {
						case LoginQRCallbackEventType.QRCodeGenerated: {
							const image = event.data.image.replace(/^data:image\/png;base64,/, "");
							current.qrDataUrl = image.startsWith("data:image") ? image : `data:image/png;base64,${image}`;
							break;
						}
						case LoginQRCallbackEventType.QRCodeExpired:
							try {
								event.actions.retry();
							} catch {
								current.error = "QR expired before confirmation. Start login again.";
							}
							break;
						case LoginQRCallbackEventType.QRCodeDeclined:
							current.error = "QR login was declined on the phone.";
							break;
						case LoginQRCallbackEventType.GotLoginInfo: capturedCredentials = {
							imei: event.data.imei,
							cookie: event.data.cookie,
							userAgent: event.data.userAgent
						};
					}
				});
				const current = activeQrLogins.get(profile);
				if (!current || current.id !== login.id) return;
				if (!capturedCredentials) {
					const ctx = api.getContext();
					const cookieJson = api.getCookie().toJSON();
					capturedCredentials = {
						imei: ctx.imei,
						cookie: cookieJson?.cookies ?? [],
						userAgent: ctx.userAgent,
						language: ctx.language
					};
				}
				const assertCurrent = () => {
					login.assertCredentialPersistenceCurrent?.();
					if (activeQrLogins.get(profile)?.id !== login.id) throw new Error("Zalo QR login was superseded before credential persistence");
				};
				assertCurrent();
				await login.beforeCredentialPersistence?.();
				assertCurrent();
				await credentials.writeApiCredentials(profile, api, assertCurrent, capturedCredentials ?? void 0);
				assertCurrent();
				invalidateApi(profile);
				apiByProfile.set(profile, api);
				current.connected = true;
			} catch (error) {
				const current = activeQrLogins.get(profile);
				if (current && current.id === login.id) current.error = formatErrorMessage(error);
			}
		})();
		activeQrLogins.set(profile, login);
	}
	const active = activeQrLogins.get(profile);
	if (!active) return { message: "Failed to initialize Zalo QR login." };
	const timeoutMs = resolveTimerTimeoutMs(params.timeoutMs, DEFAULT_QR_START_TIMEOUT_MS, 3e3);
	const deadline = Date.now() + timeoutMs;
	while (Date.now() < deadline) {
		if (active.error) {
			resetQrLogin(profile);
			return { message: `Failed to start QR login: ${active.error}` };
		}
		if (active.connected) {
			resetQrLogin(profile);
			return { message: "Zalo already connected." };
		}
		if (active.qrDataUrl) return {
			qrDataUrl: active.qrDataUrl,
			message: "Scan this QR with the Zalo app."
		};
		await sleep(150);
	}
	return { message: "Still preparing QR. Call wait to continue checking login status." };
}
async function waitForZaloQrLogin(params) {
	const profile = normalizeZalouserCredentialProfile(params.profile);
	const active = activeQrLogins.get(profile);
	if (!active) {
		const connected = await checkZaloAuthenticated(profile);
		return {
			connected,
			message: connected ? "Zalo session is ready." : "No active Zalo QR login in progress."
		};
	}
	if (!isQrLoginFresh(active)) {
		resetQrLogin(profile);
		return {
			connected: false,
			message: "QR login expired. Start again to generate a fresh QR code."
		};
	}
	const timeoutMs = resolveTimerTimeoutMs(params.timeoutMs, DEFAULT_QR_WAIT_TIMEOUT_MS, 1e3);
	const deadline = Date.now() + timeoutMs;
	while (Date.now() < deadline) {
		if (active.error) {
			const message = `Zalo login failed: ${active.error}`;
			resetQrLogin(profile);
			return {
				connected: false,
				message
			};
		}
		if (active.connected) {
			resetQrLogin(profile);
			return {
				connected: true,
				message: "Login successful."
			};
		}
		await Promise.race([active.waitPromise, sleep(400)]);
	}
	return {
		connected: false,
		message: "Still waiting for QR scan confirmation."
	};
}
async function logoutZaloProfile(profileInput, options) {
	const profile = normalizeZalouserCredentialProfile(profileInput);
	options?.assertCurrent?.();
	resetQrLogin(profile);
	clearCachedGroupContext(profile);
	const listener = activeListeners.get(profile);
	if (listener) {
		try {
			listener.stop();
		} catch {}
		activeListeners.delete(profile);
	}
	invalidateApi(profile);
	const cleared = await credentials.clearCredentials(profile, options?.assertCurrent);
	return {
		cleared,
		loggedOut: true,
		message: cleared ? "Logged out and cleared local session." : "No local session to clear."
	};
}
async function startZaloListener(params) {
	const profile = normalizeZalouserCredentialProfile(params.profile);
	const api = await withZaloApi(profile, async (apiLocal) => apiLocal);
	const existing = activeListeners.get(profile);
	if (existing) throw new Error(`Zalo listener already running for profile "${profile}" (account "${existing.accountId}")`);
	if (params.abortSignal.aborted) return { stop: () => {} };
	let stopped = false;
	let lastWatchdogTickAt = Date.now();
	const onConnected = () => clearTimeout(connectTimer);
	const detachTerminalHandlers = () => {
		api.listener.off("error", onError);
		api.listener.off("closed", onClosed);
	};
	const cleanup = () => {
		if (stopped) return;
		stopped = true;
		clearTimeout(connectTimer);
		clearInterval(watchdogTimer);
		params.abortSignal.removeEventListener("abort", cleanup);
		api.listener.off("message", onMessage);
		api.listener.off("connected", onConnected);
		activeListeners.delete(profile);
		invalidateApi(profile);
	};
	const failListener = (error) => {
		if (stopped || params.abortSignal.aborted) return;
		cleanup();
		params.onError(error);
	};
	const onError = (error) => {
		failListener(error instanceof Error ? error : new Error(String(error)));
	};
	const onMessage = (incoming) => {
		if (incoming.isSelf) return;
		Promise.resolve(params.onMessage(incoming)).catch(onError);
	};
	const onClosed = (code, reason) => {
		detachTerminalHandlers();
		failListener(/* @__PURE__ */ new Error(`Zalo listener closed (${code}): ${reason || "no reason"}`));
	};
	const connectTimer = setTimeout(() => {
		failListener(/* @__PURE__ */ new Error("Zalo listener websocket handshake timed out"));
	}, LISTENER_HANDSHAKE_TIMEOUT_MS);
	connectTimer.unref?.();
	const watchdogTimer = setInterval(() => {
		const now = Date.now();
		const gapMs = now - lastWatchdogTickAt;
		lastWatchdogTickAt = now;
		if (gapMs <= LISTENER_WATCHDOG_MAX_GAP_MS) return;
		failListener(/* @__PURE__ */ new Error(`Zalo listener watchdog gap detected (${Math.round(gapMs / 1e3)}s): forcing reconnect`));
	}, LISTENER_WATCHDOG_INTERVAL_MS);
	watchdogTimer.unref?.();
	api.listener.on("message", onMessage);
	api.listener.on("error", onError);
	api.listener.on("closed", onClosed);
	api.listener.on("connected", onConnected);
	params.abortSignal.addEventListener("abort", cleanup, { once: true });
	activeListeners.set(profile, {
		accountId: params.accountId,
		stop: cleanup
	});
	try {
		api.listener.start({ retryOnClose: false });
	} catch (error) {
		cleanup();
		detachTerminalHandlers();
		throw error;
	}
	return { stop: cleanup };
}
async function resolveZaloGroupsByEntries(params) {
	const byName = buildZaloNameIndex(await listZaloGroups(params.profile, { credentialPersistence: params.credentialPersistence ?? "persist" }), (group) => group.name);
	return params.entries.map((input) => {
		const trimmed = input.trim();
		if (!trimmed) return {
			input,
			resolved: false
		};
		if (/^\d+$/.test(trimmed)) return {
			input,
			resolved: true,
			id: trimmed
		};
		const match = (byName.get(normalizeLowercaseStringOrEmpty(trimmed)) ?? [])[0];
		return match ? {
			input,
			resolved: true,
			id: match.groupId
		} : {
			input,
			resolved: false
		};
	});
}
async function resolveZaloAllowFromEntries(params) {
	const byName = buildZaloNameIndex(await listZaloFriends(params.profile, { credentialPersistence: params.credentialPersistence ?? "persist" }), (friend) => friend.displayName);
	return params.entries.map((input) => {
		const trimmed = input.trim();
		if (!trimmed) return {
			input,
			resolved: false
		};
		if (/^\d+$/.test(trimmed)) return {
			input,
			resolved: true,
			id: trimmed
		};
		const matches = byName.get(normalizeLowercaseStringOrEmpty(trimmed)) ?? [];
		const match = matches[0];
		if (!match) return {
			input,
			resolved: false
		};
		return {
			input,
			resolved: true,
			id: match.userId,
			note: matches.length > 1 ? "multiple matches; chose first" : void 0
		};
	});
}
//#endregion
export { UNICODE_SEPARATOR_PATTERN as A, zalo_js_exports as C, sliceTextStyles as D, restoreTrailingNewlines as E, TextStyle as F, ThreadType as I, buildZaloNameIndex as L, normalizeCodeBlockLeadingWhitespace as M, projectOffset as N, LOCAL_TAG_PATTERN as O, createZalouserSendReceipt as P, waitForZaloQrLogin as S, collectStructuralStyles as T, sendZaloSeenEvent as _, listZaloGroupMembers as a, startZaloListener as b, logoutZaloProfile as c, resolveZaloGroupContext as d, resolveZaloGroupsByEntries as f, sendZaloReaction as g, sendZaloLink as h, listZaloFriendsMatching as i, ZALOUSER_STYLE_MAP as j, TAG_STYLE_MAP as k, normalizeZaloInboundMessage as l, sendZaloDeliveredEvent as m, getZaloUserInfo as n, listZaloGroups as o, resolveZaloOwnUserId as p, listZaloFriends as r, listZaloGroupsMatching as s, checkZaloAuthenticated as t, resolveZaloAllowFromEntries as u, sendZaloTextMessage as v, applyTextEdits as w, startZaloQrLogin as x, sendZaloTypingEvent as y };
