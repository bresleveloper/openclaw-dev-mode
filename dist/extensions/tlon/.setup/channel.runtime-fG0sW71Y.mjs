import { i as __reExport, r as __exportAll } from "./doctor-contract-bInPRAQZ.mjs";
import { createDedupeCache, createLoggerBackedRuntime } from "../runtime-api.js";
import { c as resolveTlonAccount, d as parseChannelNest, f as parseTlonTarget, l as formatTargetHint, o as validateUrbitBaseUrl, u as normalizeShip } from "./setup-core-CDShPwjB.mjs";
import { t as getTlonRuntime } from "./runtime-Ck3lNvST.mjs";
import { t as tlonSetupWizard } from "./setup-surface-o-30U28J.mjs";
import { fetchWithSsrFGuard, ssrfPolicyFromDangerouslyAllowPrivateNetwork } from "openclaw/plugin-sdk/ssrf-runtime";
import { bindIngressLifecycleToReplyOptions, createChannelIngressError, createChannelIngressMonitor, createMessageReceiptFromOutboundResults, waitUntilAbort } from "openclaw/plugin-sdk/channel-outbound";
import { expectDefined } from "openclaw/plugin-sdk/expect-runtime";
import { asBoolean, asFiniteNumber, asNullableRecord, filterStringEntries, normalizeLowercaseStringOrEmpty, normalizeNullableString, readStringField, uniqueStrings } from "openclaw/plugin-sdk/string-coerce-runtime";
import crypto, { randomBytes, randomUUID } from "node:crypto";
import { readProviderJsonResponse, readResponseTextLimited } from "openclaw/plugin-sdk/provider-http";
import { escapeRegExp, runChannelProbe, sliceUtf16Safe } from "openclaw/plugin-sdk/text-utility-runtime";
import { resolveHumanDelayConfig } from "openclaw/plugin-sdk/agent-runtime";
import { createChannelInboundEnvelopeBuilder, formatAgentEnvelope, formatInboundMediaUnavailableText, resolveEnvelopeFormatOptions } from "openclaw/plugin-sdk/channel-inbound";
import { collectErrorGraphCandidates, formatErrorMessage } from "openclaw/plugin-sdk/error-runtime";
import { retryAsync } from "openclaw/plugin-sdk/retry-runtime";
import { sleepWithAbort } from "openclaw/plugin-sdk/runtime-env";
import { da, scot } from "@urbit/aura";
import { Readable } from "node:stream";
import { resolveTimerTimeoutMs } from "openclaw/plugin-sdk/number-runtime";
import { resolveAllowlistMatchByCandidates } from "openclaw/plugin-sdk/allow-from";
import { MAX_IMAGE_BYTES, readRemoteMediaBuffer, saveRemoteMedia } from "openclaw/plugin-sdk/media-runtime";
import { resolveChannelImplicitMentions } from "openclaw/plugin-sdk/channel-ingress-runtime";
import { bufferToBlobPart } from "openclaw/plugin-sdk/blob-runtime";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { extensionForMime } from "openclaw/plugin-sdk/media-mime";
//#region extensions/tlon/src/settings.ts
const SETTINGS_DESK = "moltbot";
const SETTINGS_BUCKET = "tlon";
function parseJsonSetting(value) {
	if (typeof value !== "string") return value;
	try {
		return JSON.parse(value);
	} catch {
		return;
	}
}
function parseChannelRules(value) {
	const parsed = parseJsonSetting(value);
	return isChannelRulesObject(parsed) ? parsed : void 0;
}
/**
* Parse settings from the raw Urbit settings-store response.
* The response shape is: { [bucket]: { [key]: value } }
*/
function parseSettingsResponse(raw) {
	if (!raw || typeof raw !== "object") return {};
	const bucket = raw[SETTINGS_BUCKET];
	if (!bucket || typeof bucket !== "object") return {};
	const settings = bucket;
	return {
		groupChannels: Array.isArray(settings.groupChannels) ? filterStringEntries(settings.groupChannels) : void 0,
		dmAllowlist: Array.isArray(settings.dmAllowlist) ? filterStringEntries(settings.dmAllowlist) : void 0,
		autoDiscoverChannels: asBoolean(settings.autoDiscoverChannels),
		showModelSig: asBoolean(settings.showModelSig),
		autoAcceptDmInvites: asBoolean(settings.autoAcceptDmInvites),
		autoAcceptGroupInvites: asBoolean(settings.autoAcceptGroupInvites),
		groupInviteAllowlist: Array.isArray(settings.groupInviteAllowlist) ? filterStringEntries(settings.groupInviteAllowlist) : void 0,
		channelRules: parseChannelRules(settings.channelRules),
		defaultAuthorizedShips: Array.isArray(settings.defaultAuthorizedShips) ? filterStringEntries(settings.defaultAuthorizedShips) : void 0,
		ownerShip: typeof settings.ownerShip === "string" ? settings.ownerShip : void 0,
		pendingApprovals: parsePendingApprovals(settings.pendingApprovals)
	};
}
function isChannelRulesObject(val) {
	if (!val || typeof val !== "object" || Array.isArray(val)) return false;
	for (const [, rule] of Object.entries(val)) if (!rule || typeof rule !== "object") return false;
	return true;
}
function parsePendingApprovals(value) {
	const parsed = parseJsonSetting(value);
	if (!Array.isArray(parsed)) return;
	return parsed.filter((item) => {
		if (!item || typeof item !== "object") return false;
		const obj = item;
		return typeof obj.id === "string" && (obj.type === "dm" || obj.type === "channel" || obj.type === "group") && typeof obj.requestingShip === "string" && typeof obj.timestamp === "number" && (obj.clubId === void 0 || typeof obj.clubId === "string") && (obj.verifiedDirect === void 0 || typeof obj.verifiedDirect === "boolean");
	});
}
function parseSettingsEvent(event) {
	if (!event || typeof event !== "object") return null;
	const evt = event;
	const operation = evt["put-entry"] ? "put-entry" : "del-entry";
	const entry = evt[operation];
	if (!entry || entry.desk !== SETTINGS_DESK || entry["bucket-key"] !== SETTINGS_BUCKET) return null;
	return {
		key: typeof entry["entry-key"] === "string" ? entry["entry-key"] : "",
		value: operation === "put-entry" ? entry.value : void 0
	};
}
function applySettingsUpdate(current, key, value) {
	const parsed = parseSettingsResponse({ [SETTINGS_BUCKET]: { [key]: value } });
	return Object.hasOwn(parsed, key) ? {
		...current,
		[key]: parsed[key]
	} : { ...current };
}
async function putTlonSetting(api, key, value) {
	await api.poke({
		app: "settings",
		mark: "settings-event",
		json: { "put-entry": {
			desk: SETTINGS_DESK,
			"bucket-key": SETTINGS_BUCKET,
			"entry-key": key,
			value
		} }
	});
}
function createSettingsManager(api, logger) {
	let current = {};
	return {
		async load() {
			try {
				const deskData = (await api.scry("/settings/all.json"))?.all?.[SETTINGS_DESK];
				current = parseSettingsResponse(deskData ?? {});
				logger?.log?.(`[settings] Loaded: ${JSON.stringify(current)}`);
				return current;
			} catch (err) {
				logger?.log?.(`[settings] No settings found (using defaults): ${String(err)}`);
				current = {};
				return current;
			}
		},
		async startSubscription(onChange) {
			await api.subscribe({
				app: "settings",
				path: "/desk/moltbot",
				event: (event) => {
					const update = parseSettingsEvent(event);
					if (!update) return;
					logger?.log?.(`[settings] Update: ${update.key} = ${JSON.stringify(update.value)}`);
					current = applySettingsUpdate(current, update.key, update.value);
					try {
						onChange(current);
					} catch (err) {
						logger?.error?.(`[settings] Listener error: ${String(err)}`);
					}
				},
				err: (error) => {
					logger?.error?.(`[settings] Subscription error: ${String(error)}`);
				},
				quit: () => {
					logger?.log?.("[settings] Subscription ended");
				}
			});
			logger?.log?.("[settings] Subscribed to settings updates");
		}
	};
}
//#endregion
//#region extensions/tlon/src/urbit/errors.ts
var UrbitError = class extends Error {
	constructor(code, message, options) {
		super(message, options);
		this.name = "UrbitError";
		this.code = code;
	}
};
var UrbitUrlError = class extends UrbitError {
	constructor(message, options) {
		super("invalid_url", message, options);
		this.name = "UrbitUrlError";
	}
};
var UrbitHttpError = class extends UrbitError {
	constructor(params) {
		const suffix = params.bodyText ? ` - ${params.bodyText}` : "";
		super("http_error", `${params.operation} failed: ${params.status}${suffix}`, { cause: params.cause });
		this.name = "UrbitHttpError";
		this.status = params.status;
		this.operation = params.operation;
		this.bodyText = params.bodyText;
	}
};
var UrbitAuthError = class extends UrbitError {
	constructor(code, message, options) {
		super(code, message, options);
		this.name = "UrbitAuthError";
	}
};
//#endregion
//#region extensions/tlon/src/urbit/fetch.ts
async function urbitFetch(params) {
	const validated = validateUrbitBaseUrl(params.baseUrl);
	if (!validated.ok) throw new UrbitUrlError(validated.error);
	const url = new URL(params.path, validated.baseUrl).toString();
	const guarded = await fetchWithSsrFGuard({
		url,
		fetchImpl: params.fetchImpl,
		beforeRequest: params.beforeRequest,
		init: params.init,
		timeoutMs: params.timeoutMs,
		maxRedirects: params.maxRedirects,
		signal: params.signal,
		policy: params.ssrfPolicy,
		lookupFn: params.lookupFn,
		auditContext: params.auditContext
	});
	return {
		...guarded,
		release: async () => {
			if (!guarded.response.bodyUsed) guarded.response.body?.cancel().catch(() => void 0);
			await guarded.release();
		}
	};
}
//#endregion
//#region extensions/tlon/src/urbit/auth.ts
const MAX_AUTH_BODY_DRAIN_BYTES = 65536;
async function authenticate(url, code, options = {}) {
	const { response, release } = await urbitFetch({
		baseUrl: url,
		path: "/~/login",
		init: {
			method: "POST",
			headers: { "Content-Type": "application/x-www-form-urlencoded" },
			body: new URLSearchParams({ password: code }).toString()
		},
		ssrfPolicy: options.ssrfPolicy,
		lookupFn: options.lookupFn,
		fetchImpl: options.fetchImpl,
		beforeRequest: options.beforeRequest,
		timeoutMs: 15e3,
		maxRedirects: 3,
		auditContext: "tlon-urbit-login"
	});
	try {
		if (!response.ok) throw new UrbitAuthError("auth_failed", `Login failed with status ${response.status}`);
		await readResponseTextLimited(response, MAX_AUTH_BODY_DRAIN_BYTES).catch(() => void 0);
		const cookie = response.headers.get("set-cookie");
		if (!cookie) throw new UrbitAuthError("missing_cookie", "No authentication cookie received");
		return cookie;
	} finally {
		await release();
	}
}
//#endregion
//#region extensions/tlon/src/urbit/context.ts
function normalizeUrbitCookie(cookie) {
	return cookie.split(";")[0] ?? cookie;
}
function getUrbitContext(url, ship) {
	const validated = validateUrbitBaseUrl(url);
	if (!validated.ok) throw new UrbitUrlError(validated.error);
	return {
		baseUrl: validated.baseUrl,
		hostname: validated.hostname,
		ship: (ship?.replace(/^~/, "") ?? validated.hostname.split(".")[0] ?? validated.hostname).trim()
	};
}
//#endregion
//#region extensions/tlon/src/urbit/story.ts
const INLINE_MARKDOWN_RULES = [
	{
		pattern: /^(~[a-z][-a-z0-9]*)/,
		render: (match) => ({ ship: expectDefined(match[1], "ship mention capture") })
	},
	{
		pattern: /^\*\*(.+?)\*\*|^__(.+?)__/,
		render: (match) => ({ bold: parseInlineMarkdown(expectDefined(match[1] ?? match[2], "bold body capture")) })
	},
	{
		pattern: /^\*([^*]+?)\*|^_([^_]+?)_(?![a-zA-Z0-9])/,
		render: (match) => ({ italics: parseInlineMarkdown(expectDefined(match[1] ?? match[2], "italic body capture")) })
	},
	{
		pattern: /^~~(.+?)~~/,
		render: (match) => ({ strike: parseInlineMarkdown(expectDefined(match[1], "strikethrough body capture")) })
	},
	{
		pattern: /^`([^`]+)`/,
		render: (match) => ({ "inline-code": expectDefined(match[1], "inline code capture") })
	},
	{
		pattern: /^\[([^\]]+)\]\(([^)]+)\)/,
		render: (match) => ({ link: {
			href: expectDefined(match[2], "link URL capture"),
			content: expectDefined(match[1], "link text capture")
		} })
	},
	{
		pattern: /^!\[([^\]]*)\]\(([^)]+)\)/,
		render: (match) => ({ imageBlock: {
			src: expectDefined(match[2], "image URL capture"),
			alt: expectDefined(match[1], "image alt capture")
		} })
	},
	{
		pattern: /^(https?:\/\/[^\s<>"\]]+)/,
		render: (match) => {
			const url = expectDefined(match[1], "plain URL capture");
			return { link: {
				href: url,
				content: url
			} };
		}
	},
	{
		pattern: /^[^*_`~[#\n:/]+/,
		render: (match) => expectDefined(match[0], "plain text match")
	}
];
function parseInlineMarkdown(text) {
	const result = [];
	let remaining = text;
	while (remaining.length > 0) {
		let consumed = 1;
		let inline = remaining.charAt(0);
		for (const rule of INLINE_MARKDOWN_RULES) {
			const match = remaining.match(rule.pattern);
			if (match) {
				inline = rule.render(match);
				consumed = match[0].length;
				break;
			}
		}
		result.push(inline);
		remaining = remaining.slice(consumed);
	}
	return mergeAdjacentStrings(result);
}
const HEADING_TAGS = [
	"h1",
	"h2",
	"h3",
	"h4",
	"h5",
	"h6"
];
function mergeAdjacentStrings(inlines) {
	const result = [];
	for (const item of inlines) {
		const last = result.at(-1);
		if (typeof item === "string" && typeof last === "string") result.splice(-1, 1, last + item);
		else result.push(item);
	}
	return result;
}
function createImageBlock(src, alt = "") {
	return { block: { image: {
		src,
		height: 0,
		width: 0,
		alt
	} } };
}
function isImageUrl(url) {
	const imageExtensions = /\.(jpg|jpeg|png|gif|webp|svg|bmp|ico)$/i;
	let path = url.split(/[?#]/, 1)[0] ?? url;
	try {
		path = new URL(url).pathname;
	} catch {}
	return imageExtensions.test(path);
}
function parseInlinesWithBreaks(text) {
	const withBreaks = [];
	const imageBlocks = [];
	for (const inline of parseInlineMarkdown(text)) {
		if (typeof inline === "object" && "imageBlock" in inline) {
			imageBlocks.push(createImageBlock(inline.imageBlock.src, inline.imageBlock.alt));
			continue;
		}
		if (typeof inline !== "string" || !inline.includes("\n")) {
			withBreaks.push(inline);
			continue;
		}
		const parts = inline.split("\n");
		for (const [index, part] of parts.entries()) {
			if (part) withBreaks.push(part);
			if (index < parts.length - 1) withBreaks.push({ break: null });
		}
	}
	return {
		inlines: withBreaks,
		imageBlocks
	};
}
const MARKDOWN_LIST_ITEM_PATTERN = /^([ \t]*)([-+*]|\d{1,9}[.)])(?:([ \t]+)(.*))?$/;
function isMarkdownThematicBreak(text) {
	return /^(?:(?:\*\s*){3,}|(?:-\s*){3,}|(?:_\s*){3,})$/.test(text);
}
function startsListBlockSyntax(text) {
	return /^(`{3,}|~{3,})/.test(text) || text.startsWith(">") || /^#{1,6}(?:\s|$)/.test(text) || isMarkdownThematicBreak(text) || /^(?:[-+*]|\d{1,9}[.)])(?:\s|$)/.test(text);
}
function whitespaceColumns(text, startColumn = 0) {
	let column = startColumn;
	for (const char of text) column += char === "	" ? 4 - column % 4 : 1;
	return column;
}
function parseMarkdownListItem(line) {
	const match = line.match(MARKDOWN_LIST_ITEM_PATTERN);
	if (!match || isMarkdownThematicBreak(line.trim())) return;
	const marker = expectDefined(match[2], "list marker capture");
	const markerType = /^\d/.test(marker) ? "ordered" : "unordered";
	const padding = match[3] ?? " ";
	const sourceBody = match[4] ?? "";
	let body = sourceBody;
	const task = body.match(/^\[([\t xX])\](?:\s+(.*))?$/);
	let checked;
	if (task) {
		checked = expectDefined(task[1], "task state capture").toLowerCase() === "x";
		body = task[2] ?? "";
	}
	const { inlines, imageBlocks } = parseInlinesWithBreaks(body);
	const indent = whitespaceColumns(expectDefined(match[1], "list indent capture"));
	const markerEnd = indent + marker.length;
	const contentIndent = whitespaceColumns(padding, markerEnd);
	return {
		indent,
		contentIndent,
		markerType,
		markerKey: markerType === "ordered" ? marker.slice(-1) : marker,
		...markerType === "ordered" ? { orderedStart: Number.parseInt(marker, 10) } : {},
		hasSourceBody: sourceBody.length > 0,
		hasBlockBody: sourceBody.length > 0 && (contentIndent - markerEnd >= 5 || startsListBlockSyntax(sourceBody)),
		hasImages: imageBlocks.length > 0,
		content: inlines,
		...checked === void 0 ? {} : { checked }
	};
}
function lineIndent(line) {
	return whitespaceColumns(line.match(/^[ \t]*/)?.[0] ?? "");
}
function startsTopLevelStoryBlock(line) {
	return /^(#{1,6})\s+(.+)$/.test(line) || line.startsWith("```") || line.startsWith("> ") || /^(-{3,}|\*{3,})$/.test(line.trim());
}
function listItemContent(item) {
	return item.checked === void 0 ? item.content : [{ task: {
		checked: item.checked,
		content: item.content
	} }];
}
function canInterruptWithListItem(item) {
	return item.hasSourceBody && (item.markerType === "unordered" || item.orderedStart === 1);
}
function parseListingBlock(lines, startIndex) {
	const first = parseMarkdownListItem(expectDefined(lines[startIndex], "list start line"));
	if (!first) return;
	if (first.indent >= 4 || first.markerType === "ordered" && first.orderedStart !== 1) return;
	function parseLevel(index, minIndent, markerKey) {
		const firstItem = parseMarkdownListItem(expectDefined(lines[index], "list level start"));
		if (!firstItem || firstItem.indent < minIndent || firstItem.indent > minIndent + 3 || firstItem.markerType === "ordered" && firstItem.orderedStart !== 1) return;
		const items = [];
		const markerType = firstItem.markerType;
		let allTasks = true;
		let cursor = index;
		while (cursor < lines.length) {
			const item = parseMarkdownListItem(expectDefined(lines[cursor], "list line index"));
			if (!item || item.indent < minIndent || item.indent > minIndent + 3 || item.markerKey !== markerKey) break;
			if (item.hasBlockBody || item.hasImages) return;
			allTasks &&= item.checked !== void 0;
			cursor++;
			while (cursor < lines.length) {
				const continuationLine = expectDefined(lines[cursor], "continuation line index");
				if (continuationLine.trim() === "") {
					let nextContentIndex = cursor + 1;
					while (lines[nextContentIndex]?.trim() === "") nextContentIndex++;
					const nextContent = lines.at(nextContentIndex);
					if (nextContent === void 0) break;
					if (parseMarkdownListItem(nextContent)) {
						cursor = nextContentIndex;
						continue;
					}
					if (lineIndent(nextContent) > item.indent) return;
					break;
				}
				if (parseMarkdownListItem(continuationLine)) break;
				if (lineIndent(continuationLine) <= item.indent && startsTopLevelStoryBlock(continuationLine)) break;
				return;
			}
			const childLine = lines.at(cursor);
			const child = childLine === void 0 ? void 0 : parseMarkdownListItem(childLine);
			if (child !== void 0 && child.markerKey === markerKey && child.indent >= minIndent && child.indent <= minIndent + 3 && child.indent < item.contentIndent) {
				items.push({ item: listItemContent(item) });
				continue;
			}
			if (child && child.markerKey !== markerKey && !canInterruptWithListItem(child)) return;
			if (child && child.indent >= item.contentIndent && !canInterruptWithListItem(child)) return;
			if (child && child.indent > item.indent) {
				if (child.indent < item.contentIndent || child.indent >= item.contentIndent + 4) return;
				const nested = parseLevel(cursor, item.contentIndent, child.markerKey);
				if (!nested) return;
				items.push({ list: {
					type: nested.type,
					contents: listItemContent(item),
					items: nested.items
				} });
				cursor = nested.nextIndex;
				const strandedChildLine = lines.at(cursor);
				const strandedChild = strandedChildLine === void 0 ? void 0 : parseMarkdownListItem(strandedChildLine);
				if (!(strandedChild !== void 0 && strandedChild.markerKey === markerKey && strandedChild.indent >= minIndent && strandedChild.indent <= minIndent + 3 && strandedChild.indent < item.contentIndent) && strandedChild && strandedChild.indent > item.indent) return;
				let trailingIndex = cursor;
				while (lines[trailingIndex]?.trim() === "") trailingIndex++;
				const trailingLine = lines.at(trailingIndex);
				if (trailingLine !== void 0 && !parseMarkdownListItem(trailingLine) && lineIndent(trailingLine) > item.indent) return;
			} else items.push({ item: listItemContent(item) });
		}
		return {
			type: markerType === "unordered" && allTasks && items.length > 0 ? "tasklist" : markerType,
			items,
			nextIndex: cursor
		};
	}
	const parsed = parseLevel(startIndex, 0, first.markerKey);
	if (!parsed) return;
	return {
		verses: [{ block: { listing: { list: {
			type: parsed.type,
			contents: [],
			items: parsed.items
		} } } }],
		nextIndex: parsed.nextIndex
	};
}
function markdownToStory(markdown) {
	const story = [];
	const lines = markdown.split("\n");
	let i = 0;
	let preservedListMarkerKey;
	while (i < lines.length) {
		const line = expectDefined(lines[i], "Markdown line index is in bounds");
		const lineListItem = parseMarkdownListItem(line);
		if (line.trim() !== "" && preservedListMarkerKey !== void 0 && (lineListItem !== void 0 ? lineListItem.markerKey !== preservedListMarkerKey : lineIndent(line) === 0)) preservedListMarkerKey = void 0;
		if (line.startsWith("```")) {
			const lang = line.slice(3).trim() || "plaintext";
			const codeLines = [];
			i++;
			while (true) {
				const codeLine = lines.at(i);
				if (codeLine === void 0 || codeLine.startsWith("```")) break;
				codeLines.push(codeLine);
				i++;
			}
			story.push({ block: { code: {
				code: codeLines.join("\n"),
				lang
			} } });
			i++;
			continue;
		}
		const headerMatch = line.match(/^(#{1,6})\s+(.+)$/);
		if (headerMatch) {
			const tag = HEADING_TAGS[expectDefined(headerMatch[1], "header marker capture").length - 1] ?? "h6";
			story.push({ block: { header: {
				tag,
				content: parseInlineMarkdown(expectDefined(headerMatch[2], "header body capture"))
			} } });
			i++;
			continue;
		}
		if (/^(-{3,}|\*{3,})$/.test(line.trim())) {
			story.push({ block: { rule: null } });
			i++;
			continue;
		}
		if (line.startsWith("> ")) {
			const quoteLines = [];
			while (true) {
				const quoteLine = lines.at(i);
				if (quoteLine === void 0 || !quoteLine.startsWith("> ")) break;
				quoteLines.push(quoteLine.slice(2));
				i++;
			}
			const quoteText = quoteLines.join("\n");
			story.push({ inline: [{ blockquote: parseInlineMarkdown(quoteText) }] });
			continue;
		}
		if (line.trim() === "") {
			i++;
			continue;
		}
		const preservesLooseList = preservedListMarkerKey !== void 0 && lineListItem?.markerKey === preservedListMarkerKey;
		const listing = preservesLooseList ? void 0 : parseListingBlock(lines, i);
		if (listing) {
			story.push(...listing.verses);
			i = listing.nextIndex;
			preservedListMarkerKey = void 0;
			continue;
		}
		if (lineListItem) preservedListMarkerKey = lineListItem.markerKey;
		let preserveListText = preservesLooseList || MARKDOWN_LIST_ITEM_PATTERN.test(line);
		const paragraphLines = [];
		while (true) {
			const paragraphLine = lines.at(i);
			if (paragraphLine === void 0 || paragraphLine.trim() === "" || startsTopLevelStoryBlock(paragraphLine)) break;
			if (!preserveListText && MARKDOWN_LIST_ITEM_PATTERN.test(paragraphLine)) {
				const item = parseMarkdownListItem(paragraphLine);
				const candidate = parseListingBlock(lines, i);
				if (item?.hasSourceBody === true && candidate) break;
				preserveListText = true;
				if (item) preservedListMarkerKey = item.markerKey;
			}
			paragraphLines.push(paragraphLine);
			i++;
		}
		if (paragraphLines.length > 0) {
			const { inlines, imageBlocks } = parseInlinesWithBreaks(paragraphLines.join("\n"));
			if (inlines.length > 0) story.push({ inline: inlines });
			story.push(...imageBlocks);
		}
	}
	return story;
}
//#endregion
//#region extensions/tlon/src/urbit/send.ts
function createTlonSendReceipt(params) {
	return createMessageReceiptFromOutboundResults({
		results: [{
			channel: "tlon",
			messageId: params.messageId,
			conversationId: params.conversationId
		}],
		threadId: params.conversationId,
		kind: params.kind
	});
}
async function sendDm({ text, ...params }) {
	return sendDmWithStory({
		...params,
		story: markdownToStory(text),
		kind: "text"
	});
}
async function sendDmWithStory({ api, fromShip, toShip, story, kind = "unknown" }) {
	const sentAt = Date.now();
	const id = `${fromShip}/${scot("ud", da.fromUnix(sentAt))}`;
	const action = {
		ship: toShip,
		diff: {
			id,
			delta: { add: {
				memo: {
					content: story,
					author: fromShip,
					sent: sentAt
				},
				kind: null,
				time: null
			} }
		}
	};
	await api.poke({
		app: "chat",
		mark: "chat-dm-action",
		json: action
	});
	return {
		channel: "tlon",
		messageId: id,
		receipt: createTlonSendReceipt({
			messageId: id,
			conversationId: toShip,
			kind
		})
	};
}
async function sendGroupMessage({ text, ...params }) {
	return sendGroupMessageWithStory({
		...params,
		story: markdownToStory(text),
		kind: "text"
	});
}
async function sendGroupMessageWithStory({ api, fromShip, hostShip, channelName, story, replyToId, kind = "unknown" }) {
	const sentAt = Date.now();
	let formattedReplyId = replyToId;
	if (replyToId && /^\d+$/.test(replyToId)) try {
		formattedReplyId = scot("ud", BigInt(replyToId));
	} catch {}
	const memo = {
		content: story,
		author: fromShip,
		sent: sentAt
	};
	const action = { channel: {
		nest: `chat/${hostShip}/${channelName}`,
		action: { post: formattedReplyId ? { reply: {
			id: formattedReplyId,
			action: { add: memo }
		} } : { add: {
			...memo,
			kind: "/chat",
			blob: null,
			meta: null
		} } }
	} };
	await api.poke({
		app: "channels",
		mark: "channel-action-1",
		json: action
	});
	const messageId = `${fromShip}/${sentAt}`;
	return {
		channel: "tlon",
		messageId,
		receipt: createTlonSendReceipt({
			messageId,
			conversationId: `${hostShip}/${channelName}`,
			kind
		})
	};
}
function buildMediaStory(text, mediaUrl) {
	const story = [];
	const cleanText = text?.trim() ?? "";
	const cleanUrl = mediaUrl?.trim() ?? "";
	if (cleanText) story.push(...markdownToStory(cleanText));
	if (cleanUrl && isImageUrl(cleanUrl)) story.push(createImageBlock(cleanUrl, ""));
	else if (cleanUrl) story.push({ inline: [{ link: {
		href: cleanUrl,
		content: cleanUrl
	} }] });
	return story.length > 0 ? story : [{ inline: [""] }];
}
//#endregion
//#region extensions/tlon/src/urbit/channel-ops.ts
async function putUrbitChannel(deps, params) {
	return await urbitFetch({
		baseUrl: deps.baseUrl,
		path: `/~/channel/${deps.channelId}`,
		init: {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				Cookie: deps.cookie
			},
			body: JSON.stringify(params.body)
		},
		ssrfPolicy: deps.ssrfPolicy,
		lookupFn: deps.lookupFn,
		fetchImpl: deps.fetchImpl,
		timeoutMs: params.timeoutMs,
		auditContext: params.auditContext,
		beforeRequest: params.beforeRequest
	});
}
const TLON_ERROR_BODY_LIMIT_BYTES = 16384;
async function pokeUrbitChannel(deps, params) {
	const pokeId = Date.now();
	const { response, release } = await putUrbitChannel(deps, {
		body: [{
			id: pokeId,
			action: "poke",
			ship: deps.ship,
			app: params.app,
			mark: params.mark,
			json: params.json
		}],
		auditContext: params.auditContext,
		timeoutMs: 3e4
	});
	try {
		if (!response.ok && response.status !== 204) {
			const errorText = await readResponseTextLimited(response, TLON_ERROR_BODY_LIMIT_BYTES).catch(() => "");
			throw new UrbitHttpError({
				operation: "Poke",
				status: response.status,
				bodyText: errorText || void 0
			});
		}
		return pokeId;
	} finally {
		await release();
	}
}
async function scryUrbitPath(deps, params) {
	const scryPath = `/~/scry${params.path}`;
	const { response, release } = await urbitFetch({
		baseUrl: deps.baseUrl,
		path: scryPath,
		init: {
			method: "GET",
			headers: { Cookie: deps.cookie }
		},
		ssrfPolicy: deps.ssrfPolicy,
		lookupFn: deps.lookupFn,
		fetchImpl: deps.fetchImpl,
		beforeRequest: deps.beforeRequest,
		timeoutMs: 3e4,
		auditContext: params.auditContext
	});
	try {
		if (!response.ok) throw new UrbitHttpError({
			operation: `Scry for path ${params.path}`,
			status: response.status
		});
		return await readProviderJsonResponse(response, `Tlon scry response for path ${params.path}`);
	} finally {
		await release();
	}
}
async function openUrbitChannelStep(deps, params) {
	const { response, release } = await putUrbitChannel(deps, {
		...params,
		timeoutMs: 3e4
	});
	try {
		if (!response.ok && response.status !== 204) throw new UrbitHttpError({
			operation: params.operation,
			status: response.status
		});
	} finally {
		await release();
	}
}
async function ensureUrbitChannelOpen(deps, params) {
	await openUrbitChannelStep(deps, {
		body: params.createBody,
		auditContext: params.createAuditContext,
		operation: "Channel creation"
	});
	await openUrbitChannelStep(deps, {
		body: [{
			id: Date.now(),
			action: "poke",
			ship: deps.ship,
			app: "hood",
			mark: "helm-hi",
			json: "Opening API channel"
		}],
		auditContext: "tlon-urbit-channel-wake",
		operation: "Channel activation"
	});
}
//#endregion
//#region extensions/tlon/src/urbit/sse-client.ts
const MAX_SSE_PAYLOAD_BYTES = 16777216;
function parseUrbitSsePayload(data) {
	if (Buffer.byteLength(data, "utf8") > MAX_SSE_PAYLOAD_BYTES) throw new Error("Tlon Urbit SSE payload exceeds 16 MiB limit");
	try {
		return JSON.parse(data);
	} catch (cause) {
		throw new Error("Tlon Urbit SSE event was malformed JSON", { cause });
	}
}
function parseUrbitSseEventId(value) {
	const trimmed = value.trim();
	if (!/^\d+$/.test(trimmed)) return null;
	const parsed = Number(trimmed);
	return Number.isSafeInteger(parsed) ? parsed : null;
}
var UrbitSSEClient = class {
	constructor(url, cookie, options = {}) {
		this.subscriptions = [];
		this.eventHandlers = /* @__PURE__ */ new Map();
		this.aborted = false;
		this.streamController = null;
		this.reconnectAttempts = 0;
		this.isConnected = false;
		this.streamRelease = null;
		this.lastHeardEventId = -1;
		this.lastAcknowledgedEventId = -1;
		this.ackThreshold = 20;
		this.reconnectAbortController = new AbortController();
		const ctx = getUrbitContext(url, options.ship);
		this.url = ctx.baseUrl;
		this.cookie = normalizeUrbitCookie(cookie);
		this.ship = ctx.ship;
		this.channelId = `${Math.floor(Date.now() / 1e3)}-${randomUUID()}`;
		this.onReconnect = options.onReconnect ?? null;
		this.autoReconnect = options.autoReconnect !== false;
		this.maxReconnectAttempts = options.maxReconnectAttempts ?? 10;
		this.reconnectDelay = resolveTimerTimeoutMs(options.reconnectDelay, 1e3);
		this.maxReconnectDelay = resolveTimerTimeoutMs(options.maxReconnectDelay, 3e4);
		this.logger = options.logger ?? {};
		this.ssrfPolicy = options.ssrfPolicy;
		this.lookupFn = options.lookupFn;
		this.fetchImpl = options.fetchImpl;
	}
	channelRequestContext() {
		return {
			baseUrl: this.url,
			cookie: this.cookie,
			ship: this.ship,
			channelId: this.channelId,
			ssrfPolicy: this.ssrfPolicy,
			lookupFn: this.lookupFn,
			fetchImpl: this.fetchImpl
		};
	}
	resetChannelIdentity() {
		this.channelId = `${Math.floor(Date.now() / 1e3)}-${randomUUID()}`;
		this.lastHeardEventId = -1;
		this.lastAcknowledgedEventId = -1;
	}
	async createCurrentChannel() {
		await ensureUrbitChannelOpen(this.channelRequestContext(), {
			createBody: this.subscriptions,
			createAuditContext: "tlon-urbit-channel-create"
		});
	}
	async subscribe(params) {
		const subId = this.subscriptions.length + 1;
		const subscription = {
			id: subId,
			action: "subscribe",
			ship: this.ship,
			app: params.app,
			path: params.path
		};
		this.subscriptions.push(subscription);
		this.eventHandlers.set(subId, {
			event: params.event,
			err: params.err,
			quit: params.quit
		});
		if (this.isConnected) try {
			await this.sendSubscription(subscription);
		} catch (error) {
			this.eventHandlers.get(subId)?.err?.(error);
		}
		return subId;
	}
	async sendSubscription(subscription) {
		const { response, release } = await putUrbitChannel(this.channelRequestContext(), {
			body: [subscription],
			timeoutMs: 3e4,
			auditContext: "tlon-urbit-subscribe"
		});
		try {
			if (!response.ok && response.status !== 204) {
				const errorText = await readResponseTextLimited(response, 16384).catch(() => "");
				throw new Error(`Subscribe failed: ${response.status}${errorText ? ` - ${errorText}` : ""}`);
			}
		} finally {
			await release();
		}
	}
	async connect() {
		this.lastHeardEventId = -1;
		this.lastAcknowledgedEventId = -1;
		await this.createCurrentChannel();
		await this.openStream();
		this.isConnected = true;
		this.reconnectAttempts = 0;
	}
	async openStream() {
		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), 6e4);
		this.streamController = controller;
		let stream;
		try {
			stream = await urbitFetch({
				baseUrl: this.url,
				path: `/~/channel/${this.channelId}`,
				init: {
					method: "GET",
					headers: {
						Accept: "text/event-stream",
						Cookie: this.cookie
					}
				},
				ssrfPolicy: this.ssrfPolicy,
				lookupFn: this.lookupFn,
				fetchImpl: this.fetchImpl,
				signal: controller.signal,
				auditContext: "tlon-urbit-sse-stream"
			});
		} finally {
			clearTimeout(timeoutId);
		}
		const { response, release } = stream;
		this.streamRelease = release;
		if (!response.ok) {
			this.streamRelease = null;
			await release();
			throw new UrbitHttpError({
				operation: "Stream connection",
				status: response.status
			});
		}
		this.processStream(response.body).catch((error) => {
			if (!this.aborted) {
				this.logger.error?.(`Stream error: ${String(error)}`);
				for (const { err } of this.eventHandlers.values()) err?.(error);
			}
		});
	}
	async processStream(body) {
		if (!body) return;
		const stream = body instanceof ReadableStream ? Readable.fromWeb(body) : body;
		const decoder = new TextDecoder();
		let buffer = "";
		let bufferBytes = 0;
		let pendingDelimiterNewline = false;
		const appendPending = (text) => {
			const previousCodeUnit = buffer.charCodeAt(buffer.length - 1);
			const firstCodeUnit = text.charCodeAt(0);
			const joinsSurrogatePair = previousCodeUnit >= 55296 && previousCodeUnit <= 56319 && firstCodeUnit >= 56320 && firstCodeUnit <= 57343;
			const nextBytes = bufferBytes + Buffer.byteLength(text, "utf8") - (joinsSurrogatePair ? 2 : 0);
			if (nextBytes > MAX_SSE_PAYLOAD_BYTES) throw new Error("Tlon Urbit SSE stream buffer exceeded 16 MiB limit");
			buffer += text;
			bufferBytes = nextBytes;
		};
		const consumeText = async (text) => {
			let offset = 0;
			if (pendingDelimiterNewline && text.length > 0) {
				pendingDelimiterNewline = false;
				if (text.startsWith("\n")) {
					await this.processEvent(buffer);
					buffer = "";
					bufferBytes = 0;
					offset = 1;
				} else appendPending("\n");
			}
			while (offset < text.length) {
				const eventEnd = text.indexOf("\n\n", offset);
				if (eventEnd === -1) {
					const endsWithNewline = text.endsWith("\n");
					appendPending(text.slice(offset, endsWithNewline ? -1 : void 0));
					pendingDelimiterNewline = endsWithNewline;
					return;
				}
				appendPending(text.slice(offset, eventEnd));
				await this.processEvent(buffer);
				buffer = "";
				bufferBytes = 0;
				offset = eventEnd + 2;
			}
		};
		try {
			for await (const chunk of stream) {
				if (this.aborted) break;
				if (typeof chunk === "string") {
					await consumeText(decoder.decode());
					await consumeText(chunk);
				} else await consumeText(decoder.decode(chunk, { stream: true }));
			}
			await consumeText(decoder.decode());
		} finally {
			if (this.streamRelease) {
				const release = this.streamRelease;
				this.streamRelease = null;
				await release();
			}
			this.streamController = null;
			if (!this.aborted && this.autoReconnect) {
				this.isConnected = false;
				this.logger.log?.("[SSE] Stream ended, attempting reconnection...");
				await this.attemptReconnect();
			}
		}
	}
	async processEvent(eventData) {
		const lines = eventData.split("\n");
		let data = null;
		let eventId = null;
		for (const line of lines) {
			if (line.startsWith("id:")) eventId = parseUrbitSseEventId(line.slice(3).trim());
			if (line.startsWith("data:")) data = line.slice(5).trim();
		}
		if (!data) return;
		let parsed;
		try {
			parsed = parseUrbitSsePayload(data);
		} catch (error) {
			this.logger.error?.(`Error parsing SSE event: ${String(error)}`);
			await this.acknowledgeHandledEventIfNeeded(eventId);
			return;
		}
		if (parsed.response === "quit") {
			if (parsed.id) {
				const handlers = this.eventHandlers.get(parsed.id);
				if (handlers?.quit) handlers.quit();
			}
		} else if (parsed.id && this.eventHandlers.has(parsed.id)) {
			const { event } = this.eventHandlers.get(parsed.id) ?? {};
			if (event && parsed.json) await event(parsed.json);
		} else if (parsed.json) {
			for (const { event } of this.eventHandlers.values()) if (event) await event(parsed.json);
		}
		await this.acknowledgeHandledEventIfNeeded(eventId);
	}
	async acknowledgeHandledEventIfNeeded(eventId) {
		if (eventId === null || eventId <= this.lastAcknowledgedEventId) return;
		this.lastHeardEventId = Math.max(this.lastHeardEventId, eventId);
		if (this.lastHeardEventId - this.lastAcknowledgedEventId <= this.ackThreshold) return;
		this.logger.log?.(`[SSE] Acking event ${this.lastHeardEventId} (last acked: ${this.lastAcknowledgedEventId})`);
		await this.ack(this.lastHeardEventId);
	}
	async poke(params) {
		return await pokeUrbitChannel(this.channelRequestContext(), {
			...params,
			auditContext: "tlon-urbit-poke"
		});
	}
	async scry(path) {
		return await scryUrbitPath({
			baseUrl: this.url,
			cookie: this.cookie,
			ssrfPolicy: this.ssrfPolicy,
			lookupFn: this.lookupFn,
			fetchImpl: this.fetchImpl
		}, {
			path,
			auditContext: "tlon-urbit-scry"
		});
	}
	updateCookie(newCookie) {
		this.cookie = normalizeUrbitCookie(newCookie);
	}
	async ack(eventId) {
		const ackData = {
			id: Date.now(),
			action: "ack",
			"event-id": eventId
		};
		const { response, release } = await putUrbitChannel(this.channelRequestContext(), {
			body: [ackData],
			timeoutMs: 1e4,
			auditContext: "tlon-urbit-ack"
		});
		try {
			if (!response.ok) throw new Error(`Ack failed with status ${response.status}`);
			this.lastAcknowledgedEventId = eventId;
		} finally {
			await release();
		}
	}
	async attemptReconnect() {
		if (this.aborted || !this.autoReconnect) {
			this.logger.log?.("[SSE] Reconnection aborted or disabled");
			return;
		}
		if (this.reconnectAttempts >= this.maxReconnectAttempts) {
			this.logger.log?.(`[SSE] Max reconnection attempts (${this.maxReconnectAttempts}) reached. Waiting 10s before resetting...`);
			if (!await this.waitForReconnectDelay(1e4) || this.aborted) return;
			this.reconnectAttempts = 0;
			this.logger.log?.("[SSE] Reconnection attempts reset, resuming reconnection...");
		}
		this.reconnectAttempts += 1;
		const delay = Math.min(this.reconnectDelay * 2 ** (this.reconnectAttempts - 1), this.maxReconnectDelay);
		this.logger.log?.(`[SSE] Reconnection attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts} in ${delay}ms...`);
		if (!await this.waitForReconnectDelay(delay) || this.aborted || !this.autoReconnect) return;
		try {
			if (this.onReconnect) await this.onReconnect(this);
			try {
				await this.openStream();
			} catch (error) {
				if (!(error instanceof UrbitHttpError) || error.status !== 404) throw error;
				this.resetChannelIdentity();
				await this.createCurrentChannel();
				await this.openStream();
			}
			this.isConnected = true;
			this.reconnectAttempts = 0;
			this.logger.log?.("[SSE] Reconnection successful!");
		} catch (error) {
			this.logger.error?.(`[SSE] Reconnection failed: ${String(error)}`);
			await this.attemptReconnect();
		}
	}
	stopReceiving() {
		this.aborted = true;
		this.isConnected = false;
		this.reconnectAbortController.abort();
		this.streamController?.abort();
	}
	async close() {
		this.stopReceiving();
		try {
			const unsubscribes = this.subscriptions.map((sub) => ({
				id: sub.id,
				action: "unsubscribe",
				subscription: sub.id
			}));
			{
				const { release } = await putUrbitChannel(this.channelRequestContext(), {
					body: unsubscribes,
					timeoutMs: 3e4,
					auditContext: "tlon-urbit-unsubscribe"
				});
				await release();
			}
			{
				const { release } = await urbitFetch({
					baseUrl: this.url,
					path: `/~/channel/${this.channelId}`,
					init: {
						method: "DELETE",
						headers: { Cookie: this.cookie }
					},
					ssrfPolicy: this.ssrfPolicy,
					lookupFn: this.lookupFn,
					fetchImpl: this.fetchImpl,
					timeoutMs: 3e4,
					auditContext: "tlon-urbit-channel-close"
				});
				await release();
			}
		} catch (error) {
			this.logger.error?.(`Error closing channel: ${String(error)}`);
		}
		if (this.streamRelease) {
			const release = this.streamRelease;
			this.streamRelease = null;
			await release();
		}
	}
	async waitForReconnectDelay(delayMs) {
		try {
			await sleepWithAbort(delayMs, this.reconnectAbortController.signal);
			return true;
		} catch (error) {
			if (this.reconnectAbortController.signal.aborted) return false;
			throw error;
		}
	}
};
//#endregion
//#region extensions/tlon/src/monitor/approval.ts
function generateApprovalId(type) {
	return `${type}-${Date.now()}-${randomBytes(3).toString("hex")}`;
}
function createPendingApproval(params) {
	return {
		id: generateApprovalId(params.type),
		type: params.type,
		requestingShip: params.requestingShip,
		...params.clubId !== void 0 ? { clubId: params.clubId } : {},
		...params.verifiedDirect === true ? { verifiedDirect: true } : {},
		channelNest: params.channelNest,
		groupFlag: params.groupFlag,
		messagePreview: params.messagePreview != null ? sliceUtf16Safe(params.messagePreview, 0, 100) : void 0,
		originalMessage: params.originalMessage,
		timestamp: Date.now()
	};
}
function truncate(text, maxLength) {
	if (text.length <= maxLength) return text;
	return sliceUtf16Safe(text, 0, maxLength - 3) + "...";
}
function formatApprovalRequest(approval) {
	const preview = approval.messagePreview ? `\n"${truncate(approval.messagePreview, 100)}"` : "";
	switch (approval.type) {
		case "dm":
			if (approval.clubId !== void 0) {
				const replayLine = approval.originalMessage ? `The message is answered as an unverified group DM sender, never as ${approval.requestingShip}.` : `The message is not kept, so it will not be answered; have ${approval.requestingShip} send it again in a normal direct message to get a reply.`;
				return `New group DM message claiming to be from ${approval.requestingShip} (unverified; group DM ${approval.clubId}):${preview}\n\nApproving adds ${approval.requestingShip} to the DM allowlist. ${replayLine}\nReply "approve", "deny", or "block" (ID: ${approval.id})`;
			}
			return `New DM request from ${approval.requestingShip}:${preview}\n\nReply "approve", "deny", or "block" (ID: ${approval.id})`;
		case "channel": return `${approval.requestingShip} mentioned you in ${approval.channelNest}:${preview}\n\nReply "approve", "deny", or "block"\n(ID: ${approval.id})`;
		case "group": return `Group invite from ${approval.requestingShip} to join ${approval.groupFlag}\n\nReply "approve", "deny", or "block"\n(ID: ${approval.id})`;
	}
	throw new Error("Unsupported approval type");
}
function parseApprovalResponse(text) {
	const match = normalizeLowercaseStringOrEmpty(text).match(/^(approve|deny|block)(?:\s+(.+))?$/);
	if (!match) return null;
	return {
		action: match[1],
		id: match[2]?.trim()
	};
}
function findPendingApproval(pendingApprovals, id) {
	if (id) return pendingApprovals.find((a) => a.id === id);
	return pendingApprovals[pendingApprovals.length - 1];
}
function removePendingApproval(pendingApprovals, id) {
	return pendingApprovals.filter((a) => a.id !== id);
}
/**
* DM requests saved before sender provenance was recorded cannot be told apart from unverified
* group DM claims, so their stored message is never replayed; the sender must send it again.
*/
function requiresResendAfterApproval(approval) {
	return approval.type === "dm" && approval.originalMessage !== void 0 && approval.clubId === void 0 && approval.verifiedDirect !== true;
}
function formatApprovalConfirmation(approval, action) {
	if (action === "block") return `Blocked ${approval.requestingShip}. They will no longer be able to contact the bot.`;
	const actionText = action === "approve" ? "Approved" : "Denied";
	switch (approval.type) {
		case "dm":
			if (action === "approve") {
				if (requiresResendAfterApproval(approval)) return `${actionText} DM access for ${approval.requestingShip}. They can now message the bot.\nTheir earlier message was saved before this version and its sender cannot be verified, so it was not processed. Ask ${approval.requestingShip} to send it again.`;
				return `${actionText} DM access for ${approval.requestingShip}. They can now message the bot.`;
			}
			return `${actionText} DM request from ${approval.requestingShip}.`;
		case "channel":
			if (action === "approve") return `${actionText} ${approval.requestingShip} for ${approval.channelNest}. They can now interact in this channel.`;
			return `${actionText} ${approval.requestingShip} for ${approval.channelNest}.`;
		case "group":
			if (action === "approve") return `${actionText} group invite from ${approval.requestingShip} to ${approval.groupFlag}. Joining group...`;
			return `${actionText} group invite from ${approval.requestingShip} to ${approval.groupFlag}.`;
	}
	throw new Error("Unsupported approval type");
}
function parseAdminCommand(text) {
	const trimmed = normalizeLowercaseStringOrEmpty(text);
	if (trimmed === "blocked") return { type: "blocked" };
	if (trimmed === "pending") return { type: "pending" };
	const unblockMatch = trimmed.match(/^unblock\s+(~[\w-]+)$/);
	if (unblockMatch) return {
		type: "unblock",
		ship: expectDefined(unblockMatch[1], "unblock ship capture")
	};
	return null;
}
function formatBlockedList(ships) {
	if (ships.length === 0) return "No ships are currently blocked.";
	return `Blocked ships (${ships.length}):\n${ships.map((s) => `• ${s}`).join("\n")}`;
}
function formatPendingList(approvals) {
	if (approvals.length === 0) return "No pending approval requests.";
	return `Pending approvals (${approvals.length}):\n${approvals.map((a) => `• ${a.id}: ${a.type} from ${a.requestingShip}`).join("\n")}`;
}
//#endregion
//#region extensions/tlon/src/monitor/approval-runtime.ts
function createTlonApprovalRuntime(params) {
	const { api, runtime, botShipName, getPendingApprovals, setPendingApprovals, getCurrentSettings, setCurrentSettings, getEffectiveDmAllowlist, setEffectiveDmAllowlist, getEffectiveOwnerShip, processApprovedMessage, refreshWatchedChannels } = params;
	let approvalOverflowNoticeSent = false;
	let approvalOverflowNoticeAttempts = 0;
	const savePendingApprovals = async (required = false) => {
		try {
			await putTlonSetting(api, "pendingApprovals", JSON.stringify(getPendingApprovals()));
		} catch (err) {
			runtime.error?.(`[tlon] Failed to save pending approvals: ${String(err)}`);
			if (required) throw err;
		}
	};
	const addToDmAllowlist = async (ship) => {
		const normalizedShip = normalizeShip(ship);
		const nextAllowlist = getEffectiveDmAllowlist().includes(normalizedShip) ? getEffectiveDmAllowlist() : [...getEffectiveDmAllowlist(), normalizedShip];
		setEffectiveDmAllowlist(nextAllowlist);
		try {
			await putTlonSetting(api, "dmAllowlist", nextAllowlist);
			runtime.log?.(`[tlon] Added ${normalizedShip} to dmAllowlist`);
		} catch (err) {
			runtime.error?.(`[tlon] Failed to update dmAllowlist: ${String(err)}`);
		}
	};
	const addToChannelAllowlist = async (ship, channelNest) => {
		const normalizedShip = normalizeShip(ship);
		const currentSettings = getCurrentSettings();
		const channelRules = currentSettings.channelRules ?? {};
		const rule = channelRules[channelNest] ?? {
			mode: "restricted",
			allowedShips: []
		};
		const allowedShips = [...rule.allowedShips ?? []];
		if (!allowedShips.includes(normalizedShip)) allowedShips.push(normalizedShip);
		const updatedRules = {
			...channelRules,
			[channelNest]: {
				...rule,
				allowedShips
			}
		};
		setCurrentSettings({
			...currentSettings,
			channelRules: updatedRules
		});
		try {
			await putTlonSetting(api, "channelRules", JSON.stringify(updatedRules));
			runtime.log?.(`[tlon] Added ${normalizedShip} to ${channelNest} allowlist`);
		} catch (err) {
			runtime.error?.(`[tlon] Failed to update channelRules: ${String(err)}`);
		}
	};
	const blockShip = async (ship) => {
		const normalizedShip = normalizeShip(ship);
		try {
			await api.poke({
				app: "chat",
				mark: "chat-block-ship",
				json: { ship: normalizedShip }
			});
			runtime.log?.(`[tlon] Blocked ship ${normalizedShip}`);
		} catch (err) {
			runtime.error?.(`[tlon] Failed to block ship ${normalizedShip}: ${String(err)}`);
		}
	};
	const isShipBlocked = async (ship) => {
		const normalizedShip = normalizeShip(ship);
		try {
			const blocked = await api.scry("/chat/blocked.json");
			return Array.isArray(blocked) && blocked.some((item) => normalizeShip(item) === normalizedShip);
		} catch (err) {
			runtime.log?.(`[tlon] Failed to check blocked list: ${String(err)}`);
			return false;
		}
	};
	const getBlockedShips = async () => {
		try {
			const blocked = await api.scry("/chat/blocked.json");
			return Array.isArray(blocked) ? blocked : [];
		} catch (err) {
			runtime.log?.(`[tlon] Failed to get blocked list: ${String(err)}`);
			return [];
		}
	};
	const unblockShip = async (ship) => {
		const normalizedShip = normalizeShip(ship);
		try {
			await api.poke({
				app: "chat",
				mark: "chat-unblock-ship",
				json: { ship: normalizedShip }
			});
			runtime.log?.(`[tlon] Unblocked ship ${normalizedShip}`);
			return true;
		} catch (err) {
			runtime.error?.(`[tlon] Failed to unblock ship ${normalizedShip}: ${String(err)}`);
			return false;
		}
	};
	const sendOwnerNotification = async (message) => {
		const ownerShip = getEffectiveOwnerShip();
		if (!ownerShip) {
			runtime.log?.("[tlon] No ownerShip configured, cannot send notification");
			return false;
		}
		try {
			await sendDm({
				api,
				fromShip: botShipName,
				toShip: ownerShip,
				text: message
			});
			runtime.log?.(`[tlon] Sent notification to owner ${ownerShip}`);
			return true;
		} catch (err) {
			runtime.error?.(`[tlon] Failed to send notification to owner: ${String(err)}`);
			return false;
		}
	};
	const queueApprovalRequest = async (approval) => {
		if (await isShipBlocked(approval.requestingShip)) {
			runtime.log?.(`[tlon] Ignoring request from blocked ship ${approval.requestingShip}`);
			return false;
		}
		const approvals = getPendingApprovals();
		const existing = approvals.find((item) => item.type === approval.type && item.requestingShip === approval.requestingShip && item.clubId === approval.clubId && (approval.type !== "channel" || item.channelNest === approval.channelNest) && (approval.type !== "group" || item.groupFlag === approval.groupFlag));
		if (existing) {
			if (approval.originalMessage) {
				existing.originalMessage = approval.originalMessage;
				existing.messagePreview = approval.messagePreview;
				if (approval.verifiedDirect === true) existing.verifiedDirect = true;
				else delete existing.verifiedDirect;
			}
			runtime.log?.(`[tlon] Updated existing approval for ${approval.requestingShip} (${approval.type}) - re-sending notification`);
			await savePendingApprovals(true);
			await sendOwnerNotification(formatApprovalRequest(existing));
			return true;
		}
		if (approvals.length >= 100) {
			runtime.log?.(`[tlon] Pending approval limit reached; ignoring ${approval.type} request from ${approval.requestingShip}`);
			if (!approvalOverflowNoticeSent && approvalOverflowNoticeAttempts < 3) {
				approvalOverflowNoticeAttempts += 1;
				approvalOverflowNoticeSent = await sendOwnerNotification(`Pending approval queue is full (${approvals.length}). Resolve existing requests with approve, deny, or block before asking rejected requesters to retry.`);
			}
			return false;
		}
		approvalOverflowNoticeSent = false;
		approvalOverflowNoticeAttempts = 0;
		setPendingApprovals([...approvals, approval]);
		await savePendingApprovals(true);
		await sendOwnerNotification(formatApprovalRequest(approval));
		runtime.log?.(`[tlon] Queued approval request: ${approval.id} (${approval.type} from ${approval.requestingShip})`);
		return true;
	};
	const handleApprovalResponse = async (text) => {
		const parsed = parseApprovalResponse(text);
		if (!parsed) return false;
		const approval = findPendingApproval(getPendingApprovals(), parsed.id);
		if (!approval) {
			await sendOwnerNotification(`No pending approval found${parsed.id ? ` for ID: ${parsed.id}` : ""}`);
			return true;
		}
		if (parsed.action === "approve") {
			switch (approval.type) {
				case "dm":
					await addToDmAllowlist(approval.requestingShip);
					if (requiresResendAfterApproval(approval)) runtime.log?.(`[tlon] Not replaying pre-upgrade DM request from ${approval.requestingShip}: sender provenance unknown; owner told to request a resend`);
					else if (approval.originalMessage) {
						runtime.log?.(`[tlon] Processing original message from ${approval.requestingShip} after approval`);
						await processApprovedMessage(approval);
					}
					break;
				case "channel":
					if (approval.channelNest) {
						await addToChannelAllowlist(approval.requestingShip, approval.channelNest);
						if (approval.originalMessage) {
							runtime.log?.(`[tlon] Processing original message from ${approval.requestingShip} in ${approval.channelNest} after approval`);
							await processApprovedMessage(approval);
						}
					}
					break;
				case "group": if (approval.groupFlag) try {
					await api.poke({
						app: "groups",
						mark: "group-join",
						json: {
							flag: approval.groupFlag,
							"join-all": true
						}
					});
					runtime.log?.(`[tlon] Joined group ${approval.groupFlag} after approval`);
					setTimeout(() => {
						(async () => {
							try {
								const newCount = await refreshWatchedChannels();
								if (newCount > 0) runtime.log?.(`[tlon] Discovered ${newCount} new channel(s) after joining group`);
							} catch (err) {
								runtime.log?.(`[tlon] Channel discovery after group join failed: ${String(err)}`);
							}
						})();
					}, 2e3);
				} catch (err) {
					runtime.error?.(`[tlon] Failed to join group ${approval.groupFlag}: ${String(err)}`);
				}
			}
			await sendOwnerNotification(formatApprovalConfirmation(approval, "approve"));
		} else if (parsed.action === "block") {
			await blockShip(approval.requestingShip);
			await sendOwnerNotification(formatApprovalConfirmation(approval, "block"));
		} else await sendOwnerNotification(formatApprovalConfirmation(approval, "deny"));
		setPendingApprovals(removePendingApproval(getPendingApprovals(), approval.id));
		await savePendingApprovals();
		return true;
	};
	const handleAdminCommand = async (text) => {
		const command = parseAdminCommand(text);
		if (!command) return false;
		switch (command.type) {
			case "blocked": {
				const blockedShips = await getBlockedShips();
				await sendOwnerNotification(formatBlockedList(blockedShips));
				runtime.log?.(`[tlon] Owner requested blocked ships list (${blockedShips.length} ships)`);
				return true;
			}
			case "pending":
				await sendOwnerNotification(formatPendingList(getPendingApprovals()));
				runtime.log?.(`[tlon] Owner requested pending approvals list (${getPendingApprovals().length} pending)`);
				return true;
			case "unblock": {
				const shipToUnblock = command.ship;
				if (!await isShipBlocked(shipToUnblock)) {
					await sendOwnerNotification(`${shipToUnblock} is not blocked.`);
					return true;
				}
				const success = await unblockShip(shipToUnblock);
				await sendOwnerNotification(success ? `Unblocked ${shipToUnblock}.` : `Failed to unblock ${shipToUnblock}.`);
				return true;
			}
		}
		throw new Error("Unsupported Tlon admin command");
	};
	return {
		queueApprovalRequest,
		handleApprovalResponse,
		handleAdminCommand
	};
}
//#endregion
//#region extensions/tlon/src/monitor/authorization.ts
function resolveChannelAuthorization(cfg, channelNest, settings) {
	const tlonConfig = cfg.channels?.tlon;
	const fileRules = tlonConfig?.authorization?.channelRules ?? {};
	const settingsRules = settings?.channelRules ?? {};
	const fileRule = fileRules[channelNest];
	const settingsRule = settingsRules[channelNest];
	const rule = settingsRule ?? fileRule;
	const defaultShips = settings?.defaultAuthorizedShips ?? tlonConfig?.defaultAuthorizedShips ?? [];
	const requireMentionInBotThreads = typeof settingsRule?.requireMentionInBotThreads === "boolean" ? settingsRule.requireMentionInBotThreads : fileRule?.requireMentionInBotThreads;
	return {
		mode: rule?.mode ?? "restricted",
		allowedShips: rule?.allowedShips ?? defaultShips,
		requireMentionInBotThreads: typeof requireMentionInBotThreads === "boolean" ? requireMentionInBotThreads : void 0
	};
}
//#endregion
//#region extensions/tlon/src/monitor/utils.ts
function formatModelName(modelString) {
	if (!modelString) return "AI";
	const modelName = modelString.includes("/") ? expectDefined(modelString.split("/").at(1), "provider/model second segment") : modelString;
	const modelMappings = {
		"claude-opus-4-5": "Claude Opus 4.5",
		"claude-sonnet-4-5": "Claude Sonnet 4.5",
		"claude-sonnet-3-5": "Claude Sonnet 3.5",
		"gpt-4o": "GPT-4o",
		"gpt-4-turbo": "GPT-4 Turbo",
		"gpt-4": "GPT-4",
		"gemini-2.0-flash": "Gemini 2.0 Flash",
		"gemini-pro": "Gemini Pro"
	};
	const mappedName = Object.hasOwn(modelMappings, modelName) ? modelMappings[modelName] : void 0;
	if (mappedName !== void 0) return mappedName;
	return modelName.replace(/-/g, " ").split(" ").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
}
function isBotMentioned(messageText, botShipName, nickname) {
	if (!messageText || !botShipName) return false;
	if (/@all\b/i.test(messageText)) return true;
	const normalizedBotShip = normalizeShip(botShipName);
	const escapedShip = escapeRegExp(normalizedBotShip);
	if (new RegExp(`(^|\\s)${escapedShip}(?=\\s|$)`, "i").test(messageText)) return true;
	if (nickname) {
		const escapedNickname = escapeRegExp(nickname);
		if (new RegExp(`(^|\\s)${escapedNickname}(?=\\s|$|[,!?.])`, "i").test(messageText)) return true;
	}
	return false;
}
function stripBotMention(messageText, botShipName) {
	if (!messageText || !botShipName) return messageText;
	return messageText.replace(normalizeShip(botShipName), "").trim();
}
function extractDmPartnerShip(whom) {
	const raw = typeof whom === "string" ? whom : whom && typeof whom === "object" && "ship" in whom && typeof whom.ship === "string" ? whom.ship : "";
	const normalized = normalizeShip(raw);
	return /^~?[a-z-]+$/i.test(normalized) ? normalized : "";
}
const tlonIngressIdentity = {
	key: "sender-ship",
	normalize: normalizeShip,
	sensitivity: "pii",
	isWildcardEntry: () => false,
	entryIdPrefix: "tlon-entry"
};
async function isDmAllowedWithIngress(senderShip, allowlist) {
	return (await resolveTlonMessageIngress({
		senderShip,
		allowFrom: allowlist ?? [],
		conversation: {
			kind: "direct",
			id: "direct"
		}
	})).senderAccess.allowed;
}
async function resolveTlonMessageIngress(params) {
	return await getTlonRuntime().channel.inbound.ingress.resolveStable({
		channelId: "tlon",
		accountId: params.accountId ?? "default",
		identity: tlonIngressIdentity,
		subject: { stableId: params.senderShip },
		conversation: params.conversation,
		contextBinding: params.contextBinding,
		dmPolicy: "allowlist",
		groupPolicy: params.groupPolicy ?? "open",
		allowFrom: params.allowFrom,
		groupAllowFrom: params.allowFrom
	});
}
async function resolveTlonCommandAuthorizationWithIngress(params) {
	const normalizedOwner = params.ownerShip ? normalizeShip(params.ownerShip) : null;
	return await getTlonRuntime().channel.inbound.ingress.resolveStable({
		channelId: "tlon",
		accountId: "default",
		identity: tlonIngressIdentity,
		useAccessGroups: true,
		subject: { stableId: params.senderShip },
		conversation: {
			kind: "direct",
			id: "command"
		},
		event: {
			authMode: "none",
			mayPair: false
		},
		dmPolicy: "allowlist",
		groupPolicy: "open",
		allowFrom: normalizedOwner ? [normalizedOwner] : [],
		command: {}
	});
}
function isGroupInviteAllowed(inviterShip, allowlist) {
	const normalizedInviter = normalizeShip(inviterShip);
	return resolveAllowlistMatchByCandidates({
		allowList: (allowlist ?? []).map((ship) => normalizeShip(ship)),
		candidates: [{
			value: normalizedInviter,
			source: "ship"
		}]
	}).allowed;
}
function renderInlineItem(item, topLevel = false) {
	if (typeof item === "string") return item;
	const record = asNullableRecord(item);
	if (!record) return "";
	const ship = readStringField(record, "ship");
	if (ship) return ship;
	if ("sect" in record) {
		const sect = record.sect;
		if (typeof sect === "string") return `@${sect || "all"}`;
		if (sect === null) return "@all";
	}
	if (topLevel && "break" in record) return "\n";
	const code = readStringField(record, "inline-code") || readStringField(record, "code");
	if (code) return `\`${code}\``;
	const link = asNullableRecord(record.link);
	const linkHref = link ? readStringField(link, "href") : void 0;
	if (link && linkHref) {
		const linkContent = readStringField(link, "content");
		return topLevel ? linkHref : linkContent || linkHref;
	}
	if (Array.isArray(record.bold)) return `**${extractInlineText(record.bold)}**`;
	if (Array.isArray(record.italics)) return `*${extractInlineText(record.italics)}*`;
	if (Array.isArray(record.strike)) return `~~${extractInlineText(record.strike)}~~`;
	if (topLevel && Array.isArray(record.blockquote)) return `> ${extractInlineText(record.blockquote)}`;
	return "";
}
function extractInlineText(items) {
	return items.map((item) => renderInlineItem(item)).join("");
}
function extractMessageText(content) {
	if (!content || !Array.isArray(content)) return "";
	return content.map((verse) => {
		const verseRecord = asNullableRecord(verse);
		if (!verseRecord) return "";
		if (Array.isArray(verseRecord.inline)) return verseRecord.inline.map((item) => renderInlineItem(item, true)).join("");
		const block = asNullableRecord(verseRecord.block);
		if (block) {
			const image = asNullableRecord(block.image);
			if (image) {
				const imageSrc = readStringField(image, "src");
				if (imageSrc) {
					const altText = readStringField(image, "alt");
					return `\n${imageSrc}${altText ? ` (${altText})` : ""}\n`;
				}
			}
			const codeBlock = asNullableRecord(block.code);
			if (codeBlock) return `\n\`\`\`${readStringField(codeBlock, "lang") ?? ""}\n${readStringField(codeBlock, "code") ?? ""}\n\`\`\`\n`;
			const header = asNullableRecord(block.header);
			if (header) return `\n## ${(Array.isArray(header.content) ? header.content : []).map((item) => typeof item === "string" ? item : "").join("") || ""}\n`;
			const cite = asNullableRecord(block.cite);
			if (cite) {
				const chanCite = asNullableRecord(cite.chan);
				if (chanCite) {
					const nest = readStringField(chanCite, "nest");
					const whereMatch = readStringField(chanCite, "where")?.match(/\/msg\/(~[a-z-]+)\/(.+)/);
					if (whereMatch) {
						const [, author, _postId] = whereMatch;
						return `\n> [quoted: ${author} in ${nest}]\n`;
					}
					return `\n> [quoted from ${nest}]\n`;
				}
				const group = readStringField(cite, "group");
				if (group) return `\n> [ref: group ${group}]\n`;
				const desk = asNullableRecord(cite.desk);
				if (desk) {
					const flag = readStringField(desk, "flag");
					if (flag) return `\n> [ref: ${flag}]\n`;
				}
				const bait = asNullableRecord(cite.bait);
				if (bait) {
					const graph = readStringField(bait, "graph");
					const groupName = readStringField(bait, "group");
					if (graph && groupName) return `\n> [ref: ${graph} in ${groupName}]\n`;
				}
				return `\n> [quoted message]\n`;
			}
		}
		return "";
	}).join("\n").trim();
}
function isSummarizationRequest(messageText) {
	return [
		/summarize\s+(this\s+)?(channel|chat|conversation)/i,
		/what\s+did\s+i\s+miss/i,
		/catch\s+me\s+up/i,
		/channel\s+summary/i,
		/tldr/i
	].some((pattern) => pattern.test(messageText));
}
/**
* Formats channel history for a summarization request. Each entry is rendered
* through the shared inbound envelope so timestamps honor the configured user
* timezone instead of the host process zone (matches Mattermost/Feishu).
*/
function formatSummarizationHistoryText(history, cfg) {
	const envelopeOptions = resolveEnvelopeFormatOptions(cfg);
	return history.map((msg) => formatAgentEnvelope({
		channel: "Tlon",
		from: msg.author,
		timestamp: msg.timestamp,
		body: msg.content,
		envelope: envelopeOptions
	})).join("\n");
}
//#endregion
//#region extensions/tlon/src/monitor/cites.ts
const CITE_PATH_SEGMENT_RE = /^[A-Za-z0-9._~-]+$/;
const CITE_PATH_NORMALIZATION_BASE = "https://tlon.invalid";
function isSafeCitePathSegment(segment) {
	if (segment === "." || segment === "..") return false;
	return CITE_PATH_SEGMENT_RE.test(segment);
}
/**
* Build the channel-post scry path for a citation, or return null when the cited
* identifiers cannot address exactly that resource. The normalization check is the
* boundary guarantee: `scryUrbitPath` prefixes `/~/scry` and `urbitFetch` resolves the
* result through `new URL`, so a path that changes under normalization would leave the
* channel-post namespace while still carrying the Urbit auth cookie.
*/
function buildCitedPostScryPath(nest, postId) {
	const nestSegments = nest.split("/");
	if (nestSegments.length !== 3 || !nestSegments.every(isSafeCitePathSegment)) return null;
	if (!isSafeCitePathSegment(postId)) return null;
	const scryPath = `/channels/v4/${nest}/posts/post/${postId}.json`;
	if (new URL(scryPath, CITE_PATH_NORMALIZATION_BASE).pathname !== scryPath) return null;
	return scryPath;
}
function createTlonCitationResolver(params) {
	const { api, runtime } = params;
	const resolveCiteContent = async (nest, postId) => {
		const scryPath = buildCitedPostScryPath(nest, postId);
		if (!scryPath) {
			runtime.log?.("[tlon] Skipping cited post: citation does not name a channel post");
			return null;
		}
		try {
			runtime.log?.(`[tlon] Fetching cited post: ${scryPath}`);
			const data = asNullableRecord(await api.scry(scryPath));
			const essay = asNullableRecord(data?.essay);
			if (essay?.content) return extractMessageText(essay.content) || null;
			return null;
		} catch (err) {
			runtime.log?.(`[tlon] Failed to fetch cited post: ${String(err)}`);
			return null;
		}
	};
	const resolveAllCites = async (content) => {
		if (!Array.isArray(content)) return "";
		const resolved = [];
		for (const verse of content) {
			const block = asNullableRecord(asNullableRecord(verse)?.block);
			const chan = asNullableRecord(asNullableRecord(block?.cite)?.chan);
			const nest = readStringField(chan, "nest");
			const whereMatch = readStringField(chan, "where")?.match(/\/msg\/(~[a-z-]+)\/(.+)/);
			const postId = whereMatch?.[2];
			if (!nest || !postId) continue;
			const text = await resolveCiteContent(nest, postId);
			if (text) resolved.push(`> ${whereMatch?.[1] || "unknown"} wrote: ${text}`);
		}
		return resolved.length > 0 ? `${resolved.join("\n")}\n\n` : "";
	};
	return { resolveAllCites };
}
//#endregion
//#region extensions/tlon/src/monitor/discovery.ts
/**
* Fetch groups-ui init data, returning channels and foreigns.
* This is a single scry that provides both channel discovery and pending invites.
*/
async function fetchInitData(api, runtime) {
	try {
		runtime.log?.("[tlon] Fetching groups-ui init data...");
		const initData = asNullableRecord(await api.scry("/groups-ui/v6/init.json"));
		const channels = Object.values(asNullableRecord(initData?.groups) ?? {}).flatMap((group) => Object.keys(asNullableRecord(asNullableRecord(group)?.channels) ?? {}).filter((nest) => nest.startsWith("chat/")));
		if (channels.length > 0) runtime.log?.(`[tlon] Auto-discovered ${channels.length} chat channel(s)`);
		else runtime.log?.("[tlon] No chat channels found via auto-discovery");
		const foreignsValue = asNullableRecord(initData?.foreigns);
		const foreigns = foreignsValue ? foreignsValue : null;
		if (foreigns) {
			const pendingCount = Object.values(foreigns).filter((f) => f.invites?.some((i) => i.valid)).length;
			if (pendingCount > 0) runtime.log?.(`[tlon] Found ${pendingCount} pending group invite(s)`);
		}
		return {
			channels,
			foreigns
		};
	} catch (error) {
		runtime.log?.(`[tlon] Init data fetch failed: ${formatErrorMessage(error)}`);
		return {
			channels: [],
			foreigns: null
		};
	}
}
//#endregion
//#region extensions/tlon/src/monitor/history.ts
/**
* Format a number as @ud (with dots every 3 digits from the right)
* e.g., 170141184507799509469114119040828178432 -> 170.141.184.507.799.509.469.114.119.040.828.178.432
*/
function formatUd(id) {
	const str = String(id).replace(/\./g, "");
	const chunks = [];
	for (let end = str.length; end > 0; end -= 3) chunks.push(str.slice(Math.max(0, end - 3), end));
	return chunks.toReversed().join(".");
}
function createHistoryEntryFromMemo(params) {
	const { memo, seal, fallbackId } = params;
	return {
		author: typeof memo?.author === "string" ? memo.author : "unknown",
		content: extractMessageText(memo?.content || []),
		timestamp: typeof memo?.sent === "number" ? memo.sent : Date.now(),
		id: typeof seal?.id === "string" ? seal.id : typeof fallbackId === "string" ? fallbackId : void 0
	};
}
const MAX_CACHED_MESSAGES = 100;
async function fetchChannelHistory(api, channelNest, count = 50, runtime) {
	try {
		const scryPath = `/channels/v4/${channelNest}/posts/newest/${count}/outline.json`;
		runtime?.log?.(`[tlon] Fetching history: ${scryPath}`);
		const data = await api.scry(scryPath);
		if (!data) return [];
		const dataRecord = asNullableRecord(data);
		const messages = (Array.isArray(data) ? data : Object.values(asNullableRecord(dataRecord?.posts) ?? dataRecord ?? {})).map((item) => {
			const itemRecord = asNullableRecord(item);
			const replyPost = asNullableRecord(itemRecord?.["r-post"]);
			const replyPostSet = asNullableRecord(replyPost?.set);
			return createHistoryEntryFromMemo({
				memo: asNullableRecord(itemRecord?.essay) ?? asNullableRecord(replyPostSet?.essay),
				seal: asNullableRecord(itemRecord?.seal) ?? asNullableRecord(replyPostSet?.seal)
			});
		}).filter((msg) => msg.content);
		runtime?.log?.(`[tlon] Extracted ${messages.length} messages from history`);
		return messages;
	} catch (error) {
		runtime?.log?.(`[tlon] Error fetching channel history: ${formatErrorMessage(error)}`);
		return [];
	}
}
function createChannelHistoryCache() {
	const messageCache = /* @__PURE__ */ new Map();
	return {
		cacheMessage(channelNest, message) {
			const cache = messageCache.get(channelNest) ?? [];
			cache.unshift(message);
			if (cache.length > MAX_CACHED_MESSAGES) cache.pop();
			messageCache.set(channelNest, cache);
		},
		async getChannelHistory(api, channelNest, count = 50, runtime) {
			const cache = messageCache.get(channelNest) ?? [];
			if (cache.length >= count) {
				runtime?.log?.(`[tlon] Using cached messages (${cache.length} available)`);
				return cache.slice(0, count);
			}
			runtime?.log?.(`[tlon] Cache has ${cache.length} messages, need ${count}, fetching from scry...`);
			return await fetchChannelHistory(api, channelNest, count, runtime);
		}
	};
}
async function fetchThreadRootAuthor(api, channelNest, parentId, runtime) {
	if (!/^chat\/~?[a-z-]+\/[a-z0-9-]+$/i.test(channelNest) || !/^\d+(?:\.\d{3})*$/.test(parentId)) return null;
	try {
		const data = asNullableRecord(await api.scry(`/channels/v4/${channelNest}/posts/post/id/${formatUd(parentId)}.json`));
		const essay = asNullableRecord(data?.essay);
		return typeof essay?.author === "string" ? essay.author : null;
	} catch (error) {
		runtime?.log?.(`[tlon] Could not identify thread root author: ${formatErrorMessage(error)}`);
		return null;
	}
}
/**
* Fetch thread/reply history for a specific parent post.
* Used to get context when entering a thread conversation.
*/
async function fetchThreadHistory(api, channelNest, parentId, count = 50, runtime) {
	try {
		const formattedParentId = formatUd(parentId);
		runtime?.log?.(`[tlon] Thread history - parentId: ${parentId} -> formatted: ${formattedParentId}`);
		const scryPath = `/channels/v4/${channelNest}/posts/post/id/${formattedParentId}/replies/newest/${count}.json`;
		runtime?.log?.(`[tlon] Fetching thread history: ${scryPath}`);
		const data = await api.scry(scryPath);
		if (!data) {
			runtime?.log?.(`[tlon] No thread history data returned`);
			return [];
		}
		let replies = [];
		if (Array.isArray(data)) replies = data;
		else {
			const dataRecord = asNullableRecord(data);
			const replyValue = dataRecord?.replies;
			if (Array.isArray(replyValue)) replies = replyValue;
			else if (typeof replyValue === "object" && replyValue) replies = Object.values(replyValue);
			else if (dataRecord) replies = Object.values(dataRecord);
		}
		const messages = replies.map((item) => {
			const itemRecord = asNullableRecord(item);
			const replyRecord = asNullableRecord(itemRecord?.["r-reply"]);
			const replySet = asNullableRecord(replyRecord?.set);
			return createHistoryEntryFromMemo({
				memo: asNullableRecord(itemRecord?.memo) ?? asNullableRecord(replySet?.memo) ?? itemRecord,
				seal: asNullableRecord(itemRecord?.seal) ?? asNullableRecord(replySet?.seal),
				fallbackId: itemRecord?.id
			});
		}).filter((msg) => msg.content);
		runtime?.log?.(`[tlon] Extracted ${messages.length} thread replies from history`);
		return messages;
	} catch (error) {
		runtime?.log?.(`[tlon] Error fetching thread history: ${formatErrorMessage(error)}`);
		try {
			const altPath = `/channels/v4/${channelNest}/posts/post/id/${formatUd(parentId)}.json`;
			runtime?.log?.(`[tlon] Trying alternate path: ${altPath}`);
			const data = asNullableRecord(await api.scry(altPath));
			const dataSeal = asNullableRecord(data?.seal);
			const dataMeta = asNullableRecord(dataSeal?.meta);
			const repliesValue = data?.replies;
			if (typeof dataMeta?.replyCount === "number" && dataMeta.replyCount > 0 && repliesValue) {
				const messages = (Array.isArray(repliesValue) ? repliesValue : Object.values(repliesValue)).map((reply) => {
					const replyRecord = asNullableRecord(reply);
					return createHistoryEntryFromMemo({
						memo: asNullableRecord(replyRecord?.memo),
						seal: asNullableRecord(replyRecord?.seal)
					});
				}).filter((msg) => msg.content);
				runtime?.log?.(`[tlon] Extracted ${messages.length} replies from post data`);
				return messages;
			}
		} catch (altError) {
			runtime?.log?.(`[tlon] Alternate path also failed: ${formatErrorMessage(altError)}`);
		}
		return [];
	}
}
//#endregion
//#region extensions/tlon/src/monitor/ingress.ts
const TLON_INGRESS_PAYLOAD_VERSION = 1;
const TLON_INGRESS_POLL_INTERVAL_MS = 1e3;
const TlonIngressPermanentError = createChannelIngressError("TlonIngressPermanentError", { withReason: true });
function inspectChannelsEvent(event) {
	const envelope = asNullableRecord(event);
	const nest = normalizeNullableString(envelope?.nest);
	const response = asNullableRecord(envelope?.response);
	const post = asNullableRecord(response?.post);
	const rPost = asNullableRecord(post?.["r-post"]);
	const set = asNullableRecord(rPost?.set);
	const reply = asNullableRecord(rPost?.reply);
	const rReply = asNullableRecord(reply?.["r-reply"]);
	const replySet = asNullableRecord(rReply?.set);
	if (!nest || !asNullableRecord(set?.essay) && !asNullableRecord(replySet?.memo)) return null;
	const eventId = normalizeNullableString(asNullableRecord(replySet?.memo) ? reply?.id : post?.id);
	return eventId ? {
		eventId,
		laneKey: `group:${nest}`
	} : null;
}
function inspectChatEvent(event) {
	const envelope = asNullableRecord(event);
	const response = asNullableRecord(envelope?.response);
	const add = asNullableRecord(response?.add);
	const essay = asNullableRecord(add?.essay);
	const eventId = normalizeNullableString(envelope?.id);
	if (!essay || !eventId) return null;
	const whom = normalizeNullableString(asNullableRecord(envelope?.whom)?.ship);
	const peer = normalizeNullableString(envelope?.whom) ?? whom ?? normalizeNullableString(essay.author);
	return {
		eventId,
		laneKey: peer ? `direct:${peer}` : `event:${eventId}`
	};
}
function inspectTlonIngressEvent(source, event) {
	return source === "channels" ? inspectChannelsEvent(event) : inspectChatEvent(event);
}
function decodeTlonIngressPayload(payload, claimedId) {
	if (payload.source !== "channels" && payload.source !== "chat" || typeof payload.rawEvent !== "string") throw new TlonIngressPermanentError("invalid-event", `Tlon ingress row ${claimedId} has an invalid payload.`);
	return {
		version: payload.version,
		body: {
			receivedAt: payload.receivedAt,
			source: payload.source,
			rawEvent: payload.rawEvent
		}
	};
}
function deserializeTlonIngressEvent(body, claimedId) {
	let event;
	try {
		event = JSON.parse(body.rawEvent);
	} catch (error) {
		throw new TlonIngressPermanentError("invalid-event", `Tlon ingress row ${claimedId} contains invalid JSON.`, { cause: error });
	}
	return {
		source: body.source,
		event
	};
}
function resolveTlonIngressNonRetryableFailure(error) {
	if (error instanceof TlonIngressPermanentError) return {
		reason: error.reason,
		message: error.message
	};
	for (const candidate of collectErrorGraphCandidates(error, (current) => [current.cause])) if (candidate instanceof UrbitAuthError || candidate instanceof UrbitHttpError && (candidate.status === 401 || candidate.status === 403)) return {
		reason: "tlon-auth",
		message: formatErrorMessage(candidate)
	};
	return null;
}
function createTlonIngressMonitor(options) {
	const monitor = createChannelIngressMonitor({
		queue: options.queue ?? (() => getTlonRuntime().state.openChannelIngressQueue({ accountId: options.accountId })),
		inspect: (raw) => inspectTlonIngressEvent(raw.source, raw.event),
		payload: {
			version: TLON_INGRESS_PAYLOAD_VERSION,
			serialize: (raw, { receivedAt }) => ({
				receivedAt,
				source: raw.source,
				rawEvent: JSON.stringify(raw.event)
			}),
			deserialize: (body, { claim }) => deserializeTlonIngressEvent(body, claim.id),
			encode: ({ body }) => ({
				version: TLON_INGRESS_PAYLOAD_VERSION,
				...body
			}),
			decode: (payload, { claim }) => decodeTlonIngressPayload(payload, claim.id),
			createClaimError: (kind, claim) => new TlonIngressPermanentError("invalid-event", kind === "invalid-version" ? `Tlon ingress row ${claim.id} has an invalid payload.` : `Tlon ingress row ${claim.id} has invalid message identity.`)
		},
		deliver: (raw, lifecycle) => options.dispatch(raw.source, raw.event, lifecycle),
		pollIntervalMs: options.pollIntervalMs ?? TLON_INGRESS_POLL_INTERVAL_MS,
		retention: {
			completedTtlMs: void 0,
			completedMaxEntries: 2e3,
			failedMaxEntries: 2e3
		},
		appendRetryDelaysMs: [0],
		drain: {
			resolveNonRetryableFailure: resolveTlonIngressNonRetryableFailure,
			...options.adoptionStallTimeoutMs === void 0 ? {} : { adoptionStallTimeoutMs: options.adoptionStallTimeoutMs },
			onLog: (message) => options.runtime.log?.(`tlon ${message}`)
		},
		...options.abortSignal ? { abortSignal: options.abortSignal } : {},
		createStoppedError: () => /* @__PURE__ */ new Error("Tlon ingress stopped before dispatch adoption."),
		onError: (error) => options.runtime.error?.(`tlon ingress drain failed: ${formatErrorMessage(error)}`)
	});
	return {
		receive: async ({ source, event }) => {
			return { kind: (await monitor.admit({
				source,
				event
			})).kind === "durable" ? "accepted" : "ignored" };
		},
		start: monitor.start,
		stop: monitor.stop,
		waitForIdle: monitor.waitForIdle
	};
}
//#endregion
//#region extensions/tlon/src/media-fetch-timeouts.ts
const TLON_MEDIA_FETCH_TIMEOUTS = {
	responseHeaderTimeoutMs: 12e4,
	readIdleTimeoutMs: 3e4
};
//#endregion
//#region extensions/tlon/src/monitor/media.ts
const MAX_IMAGES_PER_MESSAGE = 8;
/** Keeps Tlon's shipped path-duplicating prompt bytes paired with ordered facts. */
function buildTlonInboundMediaPrompt(messageText, attachments) {
	const media = attachments.map((attachment) => ({ ...attachment }));
	if (media.length === 0) return {
		body: messageText,
		media
	};
	return {
		body: `${media.map((attachment) => `[media attached: ${attachment.path} (${attachment.contentType}) | ${attachment.path}]`).join("\n")}\n${messageText}`,
		media
	};
}
/**
* Extract image blocks from Tlon message content.
* Returns up to the download cap plus the number omitted by that cap.
*/
function extractImageBlocks(content) {
	if (!content || !Array.isArray(content)) return {
		images: [],
		unavailableCount: 0
	};
	const images = [];
	let unavailableCount = 0;
	for (const verse of content) if (verse?.block?.image?.src) {
		if (images.length >= MAX_IMAGES_PER_MESSAGE) {
			unavailableCount++;
			continue;
		}
		images.push({ url: verse.block.image.src });
	}
	return {
		images,
		unavailableCount
	};
}
async function downloadMedia(url, maxBytes) {
	try {
		const parsedUrl = new URL(url);
		if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
			console.warn(`[tlon-media] Rejected non-http(s) URL: ${url}`);
			return null;
		}
		const saved = await saveRemoteMedia({
			url,
			maxBytes: Math.min(maxBytes ?? MAX_IMAGE_BYTES, MAX_IMAGE_BYTES),
			...TLON_MEDIA_FETCH_TIMEOUTS,
			ssrfPolicy: void 0,
			requestInit: { method: "GET" }
		});
		return {
			path: saved.path,
			contentType: saved.contentType ?? "application/octet-stream"
		};
	} catch (error) {
		console.error(`[tlon-media] Error downloading ${url}: ${formatErrorMessage(error)}`);
		return null;
	}
}
/**
* Download all images from a message and return attachment metadata.
* Format matches OpenClaw's expected attachment structure.
*/
async function downloadMessageImages(content, maxBytes) {
	const { images, unavailableCount: overCapCount } = extractImageBlocks(content);
	const attachments = [];
	let unavailableCount = overCapCount;
	for (const image of images) {
		const downloaded = await downloadMedia(image.url, maxBytes);
		if (downloaded) attachments.push(downloaded);
		else unavailableCount++;
	}
	return {
		attachments,
		unavailableCount
	};
}
//#endregion
//#region src/channels/mention-gating.ts
function resolveBotThreadMentionPolicy(params) {
	if (!params.isBotOwnedThread || params.requireMentionInBotThreads === void 0) return {
		requireMention: params.requireMention,
		implicitMentionKinds: params.implicitMentionKinds
	};
	return {
		requireMention: params.requireMentionInBotThreads,
		implicitMentionKinds: params.requireMentionInBotThreads ? params.implicitMentionKinds?.filter((kind) => kind === "native") : params.implicitMentionKinds
	};
}
//#endregion
//#region \0openclaw:bundled-sdk:openclaw/plugin-sdk/channel-mention-gating
var channel_mention_gating_exports = /* @__PURE__ */ __exportAll({ resolveBotThreadMentionPolicy: () => resolveBotThreadMentionPolicy });
import * as import_openclaw_plugin_sdk_channel_mention_gating from "openclaw/plugin-sdk/channel-mention-gating";
__reExport(channel_mention_gating_exports, import_openclaw_plugin_sdk_channel_mention_gating);
//#endregion
//#region extensions/tlon/src/monitor/mentions.ts
function resolveTlonGroupMentionDecision(params) {
	const implicitMentions = resolveChannelImplicitMentions({
		cfg: params.cfg,
		channel: "tlon",
		accountId: params.accountId
	});
	const threadPolicy = resolveBotThreadMentionPolicy({
		isBotOwnedThread: params.isBotOwnedThread === true,
		requireMentionInBotThreads: params.requireMentionInBotThreads,
		requireMention: true,
		implicitMentionKinds: (0, channel_mention_gating_exports.implicitMentionKindWhen)("bot_thread_participant", params.botParticipatedInThread)
	});
	return (0, channel_mention_gating_exports.resolveInboundMentionDecision)({
		facts: {
			canDetectMention: true,
			wasMentioned: params.wasMentioned,
			implicitMentionKinds: threadPolicy.implicitMentionKinds
		},
		policy: {
			isGroup: true,
			requireMention: threadPolicy.requireMention,
			implicitMentions,
			allowTextCommands: false,
			hasControlCommand: false,
			commandAuthorized: false
		}
	});
}
async function prepareTlonGroupAdmission(params) {
	const { cfg, account, channelNest, botShipName, runtime } = params;
	const parentId = readStringField(params.messageSeal, "parent-id") ?? readStringField(params.messageSeal, "parent") ?? null;
	const mentioned = isBotMentioned(params.rawText, botShipName, params.botNickname ?? void 0);
	const configuredThreadMention = resolveChannelAuthorization(cfg, channelNest, params.getSettings()).requireMentionInBotThreads ?? account.requireMentionInBotThreads;
	const botParticipatedInThread = Boolean(params.isThreadReply && parentId && params.hasParticipatedInThread(parentId));
	const threadRootAuthor = !mentioned && params.isThreadReply && parentId && (configuredThreadMention !== void 0 || botParticipatedInThread) ? await fetchThreadRootAuthor(params.api, channelNest, parentId, runtime) : null;
	const isBotOwnedThread = Boolean(threadRootAuthor && normalizeShip(threadRootAuthor) === botShipName);
	const resolveCurrentAdmission = () => {
		const authorization = resolveChannelAuthorization(cfg, channelNest, params.getSettings());
		return {
			...authorization,
			senderAllowed: params.isOwner(params.senderShip) || authorization.mode === "open" || authorization.allowedShips.some((ship) => normalizeShip(ship) === params.senderShip),
			mentionDecision: resolveTlonGroupMentionDecision({
				cfg,
				accountId: account.accountId,
				wasMentioned: mentioned,
				botParticipatedInThread,
				isBotOwnedThread,
				requireMentionInBotThreads: authorization.requireMentionInBotThreads ?? account.requireMentionInBotThreads
			})
		};
	};
	const admission = resolveCurrentAdmission();
	const { mentionDecision } = admission;
	if (mentionDecision.implicitMention && !mentioned && !mentionDecision.shouldSkip) runtime.log?.(`[tlon] Responding to thread we participated in (no mention): ${parentId}`);
	return {
		...admission,
		parentId,
		isAdmissionAllowed: () => {
			const current = resolveCurrentAdmission();
			return current.senderAllowed && !current.mentionDecision.shouldSkip;
		}
	};
}
//#endregion
//#region extensions/tlon/src/monitor/settings-helpers.ts
function buildTlonSettingsMigrations(account, currentSettings) {
	return [...[
		"dmAllowlist",
		"groupInviteAllowlist",
		"groupChannels",
		"defaultAuthorizedShips",
		"autoDiscoverChannels",
		"autoAcceptDmInvites",
		"autoAcceptGroupInvites"
	].map((key) => ({
		key,
		fileValue: account[key],
		settingsValue: currentSettings[key]
	})), {
		key: "showModelSig",
		fileValue: account.showModelSignature,
		settingsValue: currentSettings.showModelSig
	}];
}
function shouldMigrateTlonSetting(fileValue, settingsValue) {
	return (Array.isArray(fileValue) ? fileValue.length > 0 : fileValue != null) && !(settingsValue != null);
}
function applyTlonSettingsOverrides(params) {
	const { account, currentSettings: settings, log } = params;
	if (settings.defaultAuthorizedShips?.length) log?.(`[tlon] Using defaultAuthorizedShips from settings store: ${settings.defaultAuthorizedShips.join(", ")}`);
	for (const key of [
		"autoDiscoverChannels",
		"dmAllowlist",
		"autoAcceptDmInvites",
		"autoAcceptGroupInvites",
		"groupInviteAllowlist"
	]) {
		const value = settings[key];
		if (value !== void 0) log?.(`[tlon] Using ${key} from settings store: ${Array.isArray(value) ? value.join(", ") : value}`);
	}
	const effectiveOwnerShip = settings.ownerShip ? normalizeShip(settings.ownerShip) : account.ownerShip ? normalizeShip(account.ownerShip) : null;
	if (settings.ownerShip) log?.(`[tlon] Using ownerShip from settings store: ${effectiveOwnerShip}`);
	if (settings.pendingApprovals?.length) log?.(`[tlon] Loaded ${settings.pendingApprovals.length} pending approval(s) from settings`);
	return {
		effectiveDmAllowlist: settings.dmAllowlist ?? account.dmAllowlist,
		effectiveShowModelSig: settings.showModelSig ?? account.showModelSignature ?? false,
		effectiveAutoAcceptDmInvites: settings.autoAcceptDmInvites ?? account.autoAcceptDmInvites ?? false,
		effectiveAutoAcceptGroupInvites: settings.autoAcceptGroupInvites ?? account.autoAcceptGroupInvites ?? false,
		effectiveGroupInviteAllowlist: settings.groupInviteAllowlist ?? account.groupInviteAllowlist,
		effectiveAutoDiscoverChannels: settings.autoDiscoverChannels ?? account.autoDiscoverChannels ?? false,
		effectiveOwnerShip,
		pendingApprovals: settings.pendingApprovals?.length ? settings.pendingApprovals : [],
		currentSettings: settings
	};
}
function mergeUniqueStrings(base, next) {
	return uniqueStrings([...base, ...next ?? []]);
}
//#endregion
//#region extensions/tlon/src/monitor/tracking.ts
const TLON_PARTICIPATED_THREAD_LIMIT = 2e3;
function createParticipatedThreadTracker(limit = TLON_PARTICIPATED_THREAD_LIMIT) {
	const cache = createDedupeCache({
		ttlMs: 0,
		maxSize: limit
	});
	return {
		add: (parentId) => {
			cache.check(parentId);
		},
		has: (parentId) => {
			if (!cache.peek(parentId)) return false;
			cache.check(parentId);
			return true;
		}
	};
}
function createActiveSnapshotTracker() {
	const processed = /* @__PURE__ */ new Set();
	return {
		beginSnapshot: (keys) => {
			const active = new Set(keys);
			for (const key of processed) if (!active.has(key)) processed.delete(key);
			return active;
		},
		has: (key) => processed.has(key),
		add: (key) => processed.add(key),
		addIfAccepted: (key, accepted) => accepted && processed.add(key)
	};
}
//#endregion
//#region extensions/tlon/src/monitor/index.ts
/** Identity for an unverified group DM (club) author claim; never matches a bare ship. */
function clubSenderId(clubId, claimedShip) {
	return `club:${clubId}:${claimedShip}`;
}
async function monitorTlonProvider(opts) {
	const discoveryScheduler = opts.scheduler.scope();
	const core = getTlonRuntime();
	const cfg = core.config.current();
	if (cfg.channels?.tlon?.enabled === false) return;
	const logger = core.logging.getChildLogger({ module: "tlon-auto-reply" });
	const runtime = opts.runtime ?? createLoggerBackedRuntime({ logger });
	const account = resolveTlonAccount(cfg, opts.accountId ?? void 0);
	if (!account.enabled) return;
	if (!account.configured || !account.ship || !account.url || !account.code) throw new Error("Tlon account not configured (ship/url/code required)");
	const botShipName = normalizeShip(account.ship);
	runtime.log?.(`[tlon] Starting monitor for ${botShipName}`);
	const ssrfPolicy = ssrfPolicyFromDangerouslyAllowPrivateNetwork(account.dangerouslyAllowPrivateNetwork);
	const accountUrl = account.url;
	const accountCode = account.code;
	async function authenticateWithRetry(maxAttempts = 10) {
		let authAttempt = 0;
		return await retryAsync(async () => {
			authAttempt += 1;
			if (opts.abortSignal?.aborted) throw new Error("Aborted while waiting to authenticate");
			try {
				runtime.log?.(`[tlon] Attempting authentication to ${accountUrl}...`);
				return await authenticate(accountUrl, accountCode, { ssrfPolicy });
			} catch (error) {
				runtime.error?.(`[tlon] Failed to authenticate (attempt ${authAttempt}): ${formatErrorMessage(error)}`);
				throw error;
			}
		}, {
			attempts: Math.max(1, maxAttempts),
			minDelayMs: 0,
			shouldRetry: () => !opts.abortSignal?.aborted,
			delayMs: ({ attempt }) => Math.min(3e4, 1e3 * 2 ** (attempt - 1)),
			onRetry: ({ delayMs }) => {
				runtime.log?.(`[tlon] Retrying authentication in ${delayMs}ms...`);
			},
			sleep: (delayMs) => sleepWithAbort(delayMs, opts.abortSignal)
		});
	}
	const cookie = await authenticateWithRetry();
	const api = new UrbitSSEClient(account.url, cookie, {
		ship: botShipName,
		ssrfPolicy,
		logger: {
			log: (message) => runtime.log?.(message),
			error: (message) => runtime.error?.(message)
		},
		onReconnect: async (client) => {
			runtime.log?.("[tlon] Re-authenticating on SSE reconnect...");
			const newCookie = await authenticateWithRetry(5);
			client.updateCookie(newCookie);
			runtime.log?.("[tlon] Re-authentication successful");
		}
	});
	let groupChannels = [];
	let botNickname = null;
	const settingsManager = createSettingsManager(api, {
		log: (msg) => runtime.log?.(msg),
		error: (msg) => runtime.error?.(msg)
	});
	let effectiveDmAllowlist = account.dmAllowlist;
	let effectiveShowModelSig = account.showModelSignature ?? false;
	let effectiveAutoAcceptDmInvites = account.autoAcceptDmInvites ?? false;
	let effectiveAutoAcceptGroupInvites = account.autoAcceptGroupInvites ?? false;
	let effectiveGroupInviteAllowlist = account.groupInviteAllowlist;
	let effectiveAutoDiscoverChannels = account.autoDiscoverChannels ?? false;
	let effectiveOwnerShip = account.ownerShip ? normalizeShip(account.ownerShip) : null;
	let pendingApprovals = [];
	let currentSettings = {};
	const participatedThreads = createParticipatedThreadTracker();
	const channelHistory = createChannelHistoryCache();
	const dmSendersBySession = /* @__PURE__ */ new Map();
	let sharedSessionWarningSent = false;
	try {
		const selfProfile = await api.scry("/contacts/v1/self.json");
		if (selfProfile && typeof selfProfile === "object") {
			botNickname = selfProfile.nickname?.value || null;
			if (botNickname) runtime.log?.(`[tlon] Bot nickname: ${botNickname}`);
		}
	} catch (error) {
		runtime.log?.(`[tlon] Could not fetch nickname: ${formatErrorMessage(error)}`);
	}
	let initForeigns = null;
	async function migrateConfigToSettings() {
		const migrations = buildTlonSettingsMigrations(account, currentSettings);
		for (const { key, fileValue, settingsValue } of migrations) if (shouldMigrateTlonSetting(fileValue, settingsValue)) try {
			await putTlonSetting(api, key, fileValue);
			runtime.log?.(`[tlon] Migrated ${key} from config to settings store`);
		} catch (err) {
			runtime.log?.(`[tlon] Failed to migrate ${key}: ${String(err)}`);
		}
	}
	try {
		currentSettings = await settingsManager.load();
		await migrateConfigToSettings();
		({effectiveDmAllowlist, effectiveShowModelSig, effectiveAutoAcceptDmInvites, effectiveAutoAcceptGroupInvites, effectiveGroupInviteAllowlist, effectiveAutoDiscoverChannels, effectiveOwnerShip, pendingApprovals, currentSettings} = applyTlonSettingsOverrides({
			account,
			currentSettings,
			log: (message) => runtime.log?.(message)
		}));
	} catch (err) {
		runtime.log?.(`[tlon] Settings store not available, using file config: ${String(err)}`);
	}
	if (effectiveAutoDiscoverChannels) try {
		const initData = await fetchInitData(api, runtime);
		if (initData.channels.length > 0) groupChannels = initData.channels;
		initForeigns = initData.foreigns;
	} catch (error) {
		runtime.error?.(`[tlon] Auto-discovery failed: ${formatErrorMessage(error)}`);
	}
	if (account.groupChannels.length > 0) {
		groupChannels = mergeUniqueStrings(groupChannels, account.groupChannels);
		runtime.log?.(`[tlon] Added ${account.groupChannels.length} manual groupChannels to monitoring`);
	}
	groupChannels = mergeUniqueStrings(groupChannels, currentSettings.groupChannels);
	if (groupChannels.length > 0) runtime.log?.(`[tlon] Monitoring ${groupChannels.length} group channel(s): ${groupChannels.join(", ")}`);
	else runtime.log?.("[tlon] No group channels to monitor (DMs only)");
	function isOwner(ship) {
		if (!effectiveOwnerShip) return false;
		return normalizeShip(ship) === effectiveOwnerShip;
	}
	/** DM ingress allowlist for one chat event; club claims only match as their club-scoped id. */
	function resolveChatAllowFrom(params) {
		if (params.ownerDm) return [params.senderShip];
		if (!params.isClubMessage) return effectiveDmAllowlist;
		return effectiveDmAllowlist.some((ship) => normalizeShip(ship) === params.senderShip) ? [params.senderId] : [];
	}
	const processMessage = async (params) => {
		const { messageId, senderShip, isGroup, channelNest, timestamp, parentId, isThreadReply, isAdmissionAllowed, messageContent, turnAdoptionLifecycle, resolveChannelIngress } = params;
		let messageText = params.messageText;
		const clubId = params.clubId;
		const senderId = clubId === void 0 ? senderShip : clubSenderId(clubId, senderShip);
		let attachments = [];
		let unavailableMediaCount = 0;
		if (messageContent) try {
			({attachments, unavailableCount: unavailableMediaCount} = await downloadMessageImages(messageContent, account.mediaMaxBytes));
			if (attachments.length > 0) runtime.log?.(`[tlon] Downloaded ${attachments.length} image(s) from message`);
		} catch (error) {
			runtime.log?.(`[tlon] Failed to download images: ${formatErrorMessage(error)}`);
		}
		if (isThreadReply && parentId && channelNest) try {
			const threadHistory = await fetchThreadHistory(api, channelNest, parentId, 20, runtime);
			if (threadHistory.length > 0) {
				const threadContext = threadHistory.slice(-10).map((msg) => `${msg.author}: ${msg.content}`).join("\n");
				messageText = `${`[Thread conversation - ${threadHistory.length} previous replies. You are participating in this thread. Only respond if relevant or helpful - you don't need to reply to every message.]`}\n\n[Previous messages]\n${threadContext}\n\n[Current message]\n${messageText}`;
				runtime?.log?.(`[tlon] Added thread context (${threadHistory.length} replies) to message`);
			}
		} catch (error) {
			runtime?.log?.(`[tlon] Could not fetch thread context: ${formatErrorMessage(error)}`);
		}
		if (isGroup && channelNest && isSummarizationRequest(messageText)) try {
			const history = await channelHistory.getChannelHistory(api, channelNest, 50, runtime);
			if (history.length === 0) {
				const noHistoryMsg = "I couldn't fetch any messages for this channel. It might be empty or there might be a permissions issue.";
				const parsed = parseChannelNest(channelNest);
				if (parsed && isAdmissionAllowed?.() !== false) await sendGroupMessage({
					api,
					fromShip: botShipName,
					hostShip: parsed.hostShip,
					channelName: parsed.channelName,
					text: noHistoryMsg
				});
				return;
			}
			const historyText = formatSummarizationHistoryText(history, cfg);
			messageText = `Please summarize this channel conversation (${history.length} recent messages):\n\n${historyText}\n\nProvide a concise summary highlighting:
1. Main topics discussed
2. Key decisions or conclusions
3. Action items if any
4. Notable participants`;
		} catch (error) {
			const errorMsg = `Sorry, I encountered an error while fetching the channel history: ${formatErrorMessage(error)}`;
			const parsed = parseChannelNest(channelNest);
			if (parsed && isAdmissionAllowed?.() !== false) await sendGroupMessage({
				api,
				fromShip: botShipName,
				hostShip: parsed.hostShip,
				channelName: parsed.channelName,
				text: errorMsg
			});
			return;
		}
		const route = core.channel.routing.resolveAgentRoute({
			cfg,
			channel: "tlon",
			accountId: opts.accountId ?? void 0,
			peer: {
				kind: isGroup ? "group" : "direct",
				id: isGroup ? channelNest ?? senderShip : senderShip
			}
		});
		const channelIngress = await resolveChannelIngress({
			agentId: route.agentId,
			sessionKey: route.sessionKey,
			messageId,
			inboundEventKind: "user_request"
		});
		if (!channelIngress.senderAccess.allowed) {
			runtime.log?.(`[tlon] Authorization changed before dispatch for ${senderShip}`);
			return;
		}
		if (!isGroup) {
			const sessionKey = route.sessionKey;
			if (!dmSendersBySession.has(sessionKey)) dmSendersBySession.set(sessionKey, /* @__PURE__ */ new Set());
			const senders = dmSendersBySession.get(sessionKey);
			if (senders.size > 0 && !senders.has(senderShip)) {
				runtime.log?.("[tlon] ⚠️ SECURITY: Multiple users sharing DM session. Configure \"session.dmScope: per-channel-peer\" in OpenClaw config.");
				if (!sharedSessionWarningSent && effectiveOwnerShip) {
					sharedSessionWarningSent = true;
					sendDm({
						api,
						fromShip: botShipName,
						toShip: effectiveOwnerShip,
						text: "⚠️ Security Warning: Multiple users are sharing a DM session with this bot. This can leak conversation context between users.\n\nFix: Add to your OpenClaw config:\nsession:\n  dmScope: \"per-channel-peer\"\n\nDocs: https://docs.openclaw.ai/concepts/session#dm-isolation"
					}).catch((err) => runtime.error?.(`[tlon] Failed to send security warning to owner: ${formatErrorMessage(err)}`));
				}
			}
			senders.add(senderShip);
		}
		const senderRole = clubId === void 0 && isOwner(senderShip) ? "owner" : "user";
		const fromLabel = isGroup ? `${senderShip} [${senderRole}] in ${channelNest}` : clubId !== void 0 ? `${senderShip} (unverified) [${senderRole}] in group DM ${clubId}` : `${senderShip} [${senderRole}]`;
		const shouldComputeAuth = core.channel.commands.shouldComputeCommandAuthorized(messageText, cfg);
		let commandAuthorized = false;
		if (shouldComputeAuth) {
			commandAuthorized = (await resolveTlonCommandAuthorizationWithIngress({
				senderShip: senderId,
				ownerShip: effectiveOwnerShip
			})).commandAccess.authorized;
			if (!commandAuthorized) console.log(`[tlon] Command attempt denied: ${senderShip} is not owner (owner=${effectiveOwnerShip ?? "not configured"})`);
		}
		const promptMedia = buildTlonInboundMediaPrompt(messageText, attachments);
		const body = createChannelInboundEnvelopeBuilder({
			cfg,
			route
		})({
			channel: "Tlon",
			from: fromLabel,
			timestamp,
			body: promptMedia.body
		});
		const commandBody = isGroup ? stripBotMention(messageText, botShipName) : messageText;
		const bodyForAgent = unavailableMediaCount > 0 ? formatInboundMediaUnavailableText({
			body: commandBody,
			notice: `[tlon ${unavailableMediaCount > 1 ? `${unavailableMediaCount} attachments` : "attachment"} unavailable]`
		}) : commandBody;
		const tlonConversationId = isGroup ? channelNest ?? senderShip : senderShip;
		const ctxPayload = core.channel.inbound.buildContext({
			channel: "tlon",
			accountId: route.accountId,
			messageId,
			timestamp,
			from: isGroup ? `tlon:group:${channelNest}` : `tlon:${senderId}`,
			sender: {
				id: senderId,
				name: clubId === void 0 ? senderShip : senderId,
				roles: [senderRole]
			},
			conversation: {
				kind: isGroup ? "group" : "direct",
				id: tlonConversationId,
				label: fromLabel
			},
			route: {
				agentId: route.agentId,
				dmScope: route.dmScope,
				accountId: route.accountId,
				routeSessionKey: route.sessionKey
			},
			reply: {
				to: `tlon:${botShipName}`,
				originatingTo: `tlon:${isGroup ? channelNest : botShipName}`,
				replyToId: parentId ?? void 0
			},
			message: {
				body,
				bodyForAgent,
				rawBody: messageText,
				commandBody
			},
			channelIngress,
			extra: {
				GroupSubject: void 0,
				SenderRole: senderRole,
				CommandAuthorized: commandAuthorized,
				CommandSource: "text",
				...attachments.length > 0 && { Attachments: attachments },
				...parentId && { ThreadId: parentId }
			}
		});
		const dispatchStartTime = Date.now();
		const humanDelay = resolveHumanDelayConfig(cfg, route.agentId);
		const deliveryTarget = isGroup ? channelNest : senderShip;
		const prepareReplyPayload = (payload) => {
			const replyText = payload.text;
			if (!replyText || !effectiveShowModelSig) return payload;
			const extPayload = payload;
			const defaultModel = cfg.agents?.defaults?.model;
			const modelInfo = extPayload.metadata?.model || extPayload.model || (typeof defaultModel === "string" ? defaultModel : defaultModel?.primary);
			return {
				...payload,
				text: `${replyText}\n\n_[Generated by ${formatModelName(modelInfo)}]_`
			};
		};
		const rememberThreadParticipation = (result) => {
			if (!isGroup || !channelNest || !parentId || result?.visibleReplySent === false) return;
			participatedThreads.add(parentId);
			runtime.log?.(`[tlon] Now tracking thread for future replies: ${parentId}`);
		};
		const replyOptions = {
			...turnAdoptionLifecycle ? bindIngressLifecycleToReplyOptions(turnAdoptionLifecycle) : {},
			...promptMedia.media.length > 0 ? { media: promptMedia.media } : {}
		};
		if (isAdmissionAllowed?.() === false) return;
		await core.channel.inbound.dispatch({
			channel: "tlon",
			accountId: route.accountId,
			cfg,
			route: {
				agentId: route.agentId,
				dmScope: route.dmScope,
				sessionKey: route.sessionKey
			},
			ctxPayload,
			replyPipeline: {},
			delivery: {
				preparePayload: prepareReplyPayload,
				durable: deliveryTarget ? () => ({
					to: deliveryTarget,
					replyToId: parentId ?? void 0,
					threadId: parentId ?? void 0
				}) : false,
				deliver: async (payload) => {
					const replyText = payload.text;
					if (!replyText) return { visibleReplySent: false };
					if (isGroup && channelNest) {
						const parsed = parseChannelNest(channelNest);
						if (!parsed) return { visibleReplySent: false };
						await sendGroupMessage({
							api,
							fromShip: botShipName,
							hostShip: parsed.hostShip,
							channelName: parsed.channelName,
							text: replyText,
							replyToId: parentId ?? void 0
						});
						return {
							visibleReplySent: true,
							replyToId: parentId ?? void 0
						};
					}
					await sendDm({
						api,
						fromShip: botShipName,
						toShip: senderShip,
						text: replyText
					});
					return { visibleReplySent: true };
				},
				onDelivered: (_payload, _info, result) => {
					rememberThreadParticipation(result);
				},
				onError: (err, info) => {
					const dispatchDuration = Date.now() - dispatchStartTime;
					runtime.error?.(`[tlon] ${info.kind} reply failed after ${dispatchDuration}ms: ${String(err)}`);
				}
			},
			dispatcherOptions: { humanDelay },
			...turnAdoptionLifecycle || promptMedia.media.length > 0 ? { replyOptions } : {},
			record: { onRecordError: (err) => {
				runtime.error?.(`[tlon] failed updating session meta: ${String(err)}`);
			} }
		});
	};
	const watchedChannels = new Set(groupChannels);
	const addWatchedChannels = (channels, logPrefix) => {
		const previousCount = watchedChannels.size;
		for (const channelNest of channels) if (!watchedChannels.has(channelNest)) {
			watchedChannels.add(channelNest);
			if (logPrefix) runtime.log?.(`${logPrefix}${channelNest}`);
		}
		return watchedChannels.size - previousCount;
	};
	const refreshWatchedChannels = async () => {
		const { channels: discoveredChannels } = await fetchInitData(api, runtime);
		return addWatchedChannels(discoveredChannels);
	};
	const { resolveAllCites } = createTlonCitationResolver({
		api,
		runtime
	});
	const { queueApprovalRequest, handleApprovalResponse, handleAdminCommand } = createTlonApprovalRuntime({
		api,
		runtime,
		botShipName,
		getPendingApprovals: () => pendingApprovals,
		setPendingApprovals: (approvals) => {
			pendingApprovals = approvals;
		},
		getCurrentSettings: () => currentSettings,
		setCurrentSettings: (settings) => {
			currentSettings = settings;
		},
		getEffectiveDmAllowlist: () => effectiveDmAllowlist,
		setEffectiveDmAllowlist: (ships) => {
			effectiveDmAllowlist = ships;
		},
		getEffectiveOwnerShip: () => effectiveOwnerShip,
		processApprovedMessage: async (approval) => {
			if (!approval.originalMessage || approval.type === "group") return;
			const isGroup = approval.type === "channel";
			const conversationId = isGroup ? approval.channelNest ?? "" : approval.requestingShip;
			if (isGroup && !conversationId) return;
			const clubId = !isGroup ? approval.clubId : void 0;
			if (!isGroup && clubId === void 0 && approval.verifiedDirect !== true) {
				runtime.log?.(`[tlon] Not replaying pre-upgrade DM request from ${approval.requestingShip}: sender provenance unknown`);
				return;
			}
			const replaySenderId = clubId === void 0 ? approval.requestingShip : clubSenderId(clubId, approval.requestingShip);
			await processMessage({
				messageId: approval.originalMessage.messageId,
				senderShip: approval.requestingShip,
				clubId,
				messageText: approval.originalMessage.messageText,
				messageContent: approval.originalMessage.messageContent,
				timestamp: approval.originalMessage.timestamp,
				isGroup,
				...isGroup ? {
					channelNest: conversationId,
					parentId: approval.originalMessage.parentId,
					isThreadReply: approval.originalMessage.isThreadReply
				} : {},
				resolveChannelIngress: async (contextBinding) => await resolveTlonMessageIngress({
					senderShip: replaySenderId,
					accountId: account.accountId,
					conversation: {
						kind: isGroup ? "group" : "direct",
						id: conversationId
					},
					allowFrom: [replaySenderId],
					...isGroup ? { groupPolicy: "allowlist" } : {},
					contextBinding
				})
			});
		},
		refreshWatchedChannels
	});
	const handleChannelsFirehose = async (event, turnAdoptionLifecycle) => {
		try {
			const eventRecord = asNullableRecord(event);
			const nest = readStringField(eventRecord, "nest");
			if (!nest) return;
			if (!watchedChannels.has(nest)) return;
			const response = asNullableRecord(eventRecord?.response);
			if (!response) return;
			const post = asNullableRecord(response.post);
			const rPost = asNullableRecord(post?.["r-post"]);
			const set = asNullableRecord(rPost?.set);
			const reply = asNullableRecord(rPost?.reply);
			const replyPayload = asNullableRecord(reply?.["r-reply"]);
			const replySet = asNullableRecord(replyPayload?.set);
			const essay = asNullableRecord(set?.essay);
			const memo = asNullableRecord(replySet?.memo);
			const content = memo ?? essay;
			if (!content) return;
			const isThreadReply = Boolean(memo);
			const messageId = isThreadReply ? readStringField(reply, "id") : readStringField(post, "id");
			if (!messageId) return;
			const senderShip = normalizeShip(readStringField(content, "author") ?? "");
			if (!senderShip || senderShip === botShipName) return;
			const rawText = extractMessageText(content.content);
			if (!rawText.trim()) return;
			const contentBody = content.content;
			const sentAt = asFiniteNumber(content?.sent) ?? Date.now();
			channelHistory.cacheMessage(nest, {
				author: senderShip,
				content: rawText,
				timestamp: sentAt,
				id: messageId
			});
			const { allowedShips, senderAllowed, mentionDecision, parentId, isAdmissionAllowed } = await prepareTlonGroupAdmission({
				cfg,
				account,
				api,
				channelNest: nest,
				senderShip,
				isOwner,
				botShipName,
				botNickname,
				rawText,
				messageSeal: isThreadReply ? asNullableRecord(replySet?.seal) : asNullableRecord(set?.seal),
				isThreadReply,
				hasParticipatedInThread: participatedThreads.has,
				getSettings: () => currentSettings,
				runtime
			});
			if (mentionDecision.shouldSkip) return;
			if (!senderAllowed) {
				if (effectiveOwnerShip) {
					const approval = createPendingApproval({
						type: "channel",
						requestingShip: senderShip,
						channelNest: nest,
						messagePreview: sliceUtf16Safe(rawText, 0, 100),
						originalMessage: {
							messageId,
							messageText: rawText,
							messageContent: contentBody,
							timestamp: sentAt,
							parentId: parentId ?? void 0,
							isThreadReply
						}
					});
					await queueApprovalRequest(approval);
				} else runtime.log?.(`[tlon] Access denied: ${senderShip} in ${nest} (allowed: ${allowedShips.join(", ")})`);
				return;
			}
			const messageText = await resolveAllCites(contentBody) + rawText;
			await processMessage({
				messageId,
				senderShip,
				messageText,
				messageContent: contentBody,
				isGroup: true,
				channelNest: nest,
				timestamp: sentAt,
				parentId,
				isThreadReply,
				turnAdoptionLifecycle,
				isAdmissionAllowed,
				resolveChannelIngress: async (contextBinding) => {
					const { mode, allowedShips: currentAllowedShips } = resolveChannelAuthorization(cfg, nest, currentSettings);
					return await resolveTlonMessageIngress({
						senderShip,
						accountId: account.accountId,
						conversation: {
							kind: "group",
							id: nest
						},
						allowFrom: [...currentAllowedShips.map(normalizeShip), ...effectiveOwnerShip ? [normalizeShip(effectiveOwnerShip)] : []],
						groupPolicy: mode === "restricted" ? "allowlist" : "open",
						contextBinding
					});
				}
			});
		} catch (error) {
			runtime.error?.(`[tlon] Error handling channel firehose event: ${formatErrorMessage(error)}`);
			throw error;
		}
	};
	const processedDmInvites = createActiveSnapshotTracker();
	const handleChatFirehose = async (event, turnAdoptionLifecycle) => {
		try {
			if (Array.isArray(event)) {
				const ships = processedDmInvites.beginSnapshot(event.map((invite) => normalizeShip(invite.ship || "")).filter(Boolean));
				for (const ship of ships) {
					if (processedDmInvites.has(ship)) continue;
					const ownerInvite = isOwner(ship);
					const allowed = ownerInvite || await isDmAllowedWithIngress(ship, effectiveDmAllowlist);
					if (ownerInvite || effectiveAutoAcceptDmInvites && allowed) {
						try {
							await api.poke({
								app: "chat",
								mark: "chat-dm-rsvp",
								json: {
									ship,
									ok: true
								}
							});
							processedDmInvites.add(ship);
							runtime.log?.(ownerInvite ? `[tlon] Auto-accepted DM invite from owner ${ship}` : `[tlon] Auto-accepted DM invite from ${ship}`);
						} catch (err) {
							runtime.error?.(ownerInvite ? `[tlon] Failed to auto-accept DM from owner: ${String(err)}` : `[tlon] Failed to auto-accept DM from ${ship}: ${String(err)}`);
							throw err;
						}
						continue;
					}
					if (effectiveOwnerShip && !allowed) {
						const approval = createPendingApproval({
							type: "dm",
							requestingShip: ship,
							messagePreview: "(DM invite - no message yet)"
						});
						processedDmInvites.addIfAccepted(ship, await queueApprovalRequest(approval));
					}
				}
				return;
			}
			const eventRecord = asNullableRecord(event);
			if (!eventRecord) return;
			const whom = eventRecord.whom;
			const messageId = readStringField(eventRecord, "id");
			const response = asNullableRecord(eventRecord.response);
			if (!messageId || !response) return;
			const essay = asNullableRecord(asNullableRecord(response.add)?.essay);
			if (!essay) return;
			const authorShip = normalizeShip(readStringField(essay, "author") ?? "");
			const partnerShip = extractDmPartnerShip(whom);
			const senderShip = partnerShip || authorShip;
			const clubId = partnerShip ? void 0 : typeof whom === "string" && whom ? whom : "unknown";
			const isClubMessage = clubId !== void 0;
			const senderId = isClubMessage ? clubSenderId(clubId, senderShip) : senderShip;
			if (authorShip === botShipName) return;
			if (!senderShip || senderShip === botShipName) return;
			if (authorShip && partnerShip && authorShip !== partnerShip) runtime.log?.(`[tlon] DM ship mismatch (author=${authorShip}, partner=${partnerShip}) - routing to partner`);
			const rawText = extractMessageText(essay.content);
			if (!rawText.trim()) return;
			const messageText = rawText;
			const ownerDm = !isClubMessage && isOwner(senderShip);
			if (ownerDm && await handleApprovalResponse(messageText)) {
				runtime.log?.(`[tlon] Processed approval response from owner: ${messageText}`);
				return;
			}
			if (ownerDm && await handleAdminCommand(messageText)) {
				runtime.log?.(`[tlon] Processed admin command from owner: ${messageText}`);
				return;
			}
			const resolveChannelIngress = async (contextBinding) => await resolveTlonMessageIngress({
				senderShip: senderId,
				accountId: account.accountId,
				conversation: {
					kind: "direct",
					id: senderShip
				},
				allowFrom: resolveChatAllowFrom({
					ownerDm,
					isClubMessage,
					senderShip,
					senderId
				}),
				contextBinding
			});
			if (!ownerDm && !(await resolveChannelIngress()).senderAccess.allowed) {
				if (effectiveOwnerShip) {
					const approval = createPendingApproval({
						type: "dm",
						requestingShip: senderShip,
						messagePreview: sliceUtf16Safe(messageText, 0, 100),
						...isClubMessage ? { clubId } : { verifiedDirect: true },
						...isClubMessage && isOwner(senderShip) ? {} : { originalMessage: {
							messageId,
							messageText,
							messageContent: essay.content,
							timestamp: asFiniteNumber(essay?.sent) ?? Date.now()
						} }
					});
					await queueApprovalRequest(approval);
				} else runtime.log?.(`[tlon] Blocked DM from ${senderShip}: not in allowlist`);
				return;
			}
			const resolvedMessageText = await resolveAllCites(essay.content) + rawText;
			if (ownerDm) runtime.log?.(`[tlon] Processing DM from owner ${senderShip}`);
			await processMessage({
				messageText: resolvedMessageText,
				messageId,
				senderShip,
				clubId,
				messageContent: essay.content,
				isGroup: false,
				timestamp: asFiniteNumber(essay?.sent) ?? Date.now(),
				turnAdoptionLifecycle,
				resolveChannelIngress
			});
		} catch (error) {
			runtime.error?.(`[tlon] Error handling chat firehose event: ${formatErrorMessage(error)}`);
			throw error;
		}
	};
	const ingress = createTlonIngressMonitor({
		accountId: account.accountId,
		runtime,
		abortSignal: opts.abortSignal,
		dispatch: async (source, event, turnAdoptionLifecycle) => {
			if (source === "channels") {
				await handleChannelsFirehose(event, turnAdoptionLifecycle);
				return;
			}
			await handleChatFirehose(event, turnAdoptionLifecycle);
		}
	});
	try {
		runtime.log?.("[tlon] Subscribing to firehose updates...");
		for (const [source, path, label, handleEvent] of [[
			"channels",
			"/v2",
			"Channels",
			handleChannelsFirehose
		], [
			"chat",
			"/v3",
			"Chat",
			handleChatFirehose
		]]) {
			await api.subscribe({
				app: source,
				path,
				event: async (event) => {
					if ((await ingress.receive({
						source,
						event
					})).kind === "ignored") await handleEvent(event);
				},
				err: (error) => {
					runtime.error?.(`[tlon] ${label} firehose error: ${String(error)}`);
				},
				quit: () => {
					runtime.log?.(`[tlon] ${label} firehose subscription ended`);
				}
			});
			runtime.log?.(`[tlon] Subscribed to ${source} firehose (${path})`);
		}
		await api.subscribe({
			app: "contacts",
			path: "/v1/news",
			event: (event) => {
				try {
					const eventRecord = asNullableRecord(event);
					if (eventRecord?.self) {
						const selfUpdate = asNullableRecord(eventRecord.self);
						const contact = asNullableRecord(selfUpdate?.contact);
						const nickname = asNullableRecord(contact?.nickname);
						if (nickname && "value" in nickname) {
							const newNickname = readStringField(nickname, "value") ?? null;
							if (newNickname !== botNickname) {
								botNickname = newNickname;
								runtime.log?.(`[tlon] Nickname updated: ${botNickname}`);
							}
						}
					}
				} catch (error) {
					runtime.error?.(`[tlon] Error handling contacts event: ${formatErrorMessage(error)}`);
				}
			},
			err: (error) => {
				runtime.error?.(`[tlon] Contacts subscription error: ${String(error)}`);
			},
			quit: () => {
				runtime.log?.("[tlon] Contacts subscription ended");
			}
		});
		runtime.log?.("[tlon] Subscribed to contacts updates (/v1/news)");
		try {
			await settingsManager.startSubscription((newSettings) => {
				currentSettings = newSettings;
				addWatchedChannels(newSettings.groupChannels ?? [], "[tlon] Settings: now watching channel ");
				({effectiveDmAllowlist, effectiveShowModelSig, effectiveAutoAcceptDmInvites, effectiveAutoAcceptGroupInvites, effectiveGroupInviteAllowlist, effectiveAutoDiscoverChannels, effectiveOwnerShip, pendingApprovals} = applyTlonSettingsOverrides({
					account,
					currentSettings: newSettings,
					log: (message) => runtime.log?.(message)
				}));
			});
		} catch (err) {
			runtime.log?.(`[tlon] Settings subscription not available: ${String(err)}`);
		}
		try {
			await api.subscribe({
				app: "groups",
				path: "/groups/ui",
				event: async (event) => {
					try {
						const eventRecord = asNullableRecord(event);
						if (!eventRecord) return;
						const join = asNullableRecord(eventRecord.join);
						const joinedChannels = Array.isArray(join?.channels) ? join.channels : [];
						const discoveredChannels = mergeUniqueStrings(Object.keys(asNullableRecord(eventRecord.channels) ?? {}), joinedChannels.filter((channel) => typeof channel === "string")).filter((channel) => channel.startsWith("chat/"));
						addWatchedChannels(discoveredChannels, "[tlon] Auto-detected new channel: ");
						if (!effectiveAutoAcceptGroupInvites) return;
						const currentChannels = currentSettings.groupChannels ?? [];
						const unpersistedChannels = discoveredChannels.filter((channel) => !currentChannels.includes(channel));
						if (unpersistedChannels.length === 0) return;
						const updatedChannels = mergeUniqueStrings(currentChannels, unpersistedChannels);
						await putTlonSetting(api, "groupChannels", updatedChannels);
						currentSettings = {
							...currentSettings,
							groupChannels: updatedChannels
						};
						runtime.log?.(`[tlon] Persisted ${unpersistedChannels.join(", ")} to settings store`);
					} catch (error) {
						runtime.error?.(`[tlon] Error handling groups-ui event: ${formatErrorMessage(error)}`);
						throw error;
					}
				},
				err: (error) => {
					runtime.error?.(`[tlon] Groups-ui subscription error: ${String(error)}`);
				},
				quit: () => {
					runtime.log?.("[tlon] Groups-ui subscription ended");
				}
			});
			runtime.log?.("[tlon] Subscribed to groups-ui for real-time channel detection");
		} catch (err) {
			runtime.log?.(`[tlon] Groups-ui subscription failed (will rely on polling): ${String(err)}`);
		}
		{
			const processedGroupInvites = /* @__PURE__ */ new Set();
			const processPendingInvites = async (foreigns, propagateWriteFailures = false) => {
				if (!foreigns || typeof foreigns !== "object") return;
				let firstWriteError;
				for (const [groupFlag, foreign] of Object.entries(foreigns)) {
					const validInvite = foreign.invites?.find((invite) => invite.valid);
					if (foreign.progress === "done" || !validInvite) {
						processedGroupInvites.delete(groupFlag);
						continue;
					}
					if (processedGroupInvites.has(groupFlag)) continue;
					const inviterShip = validInvite.from;
					const ownerInvite = isOwner(inviterShip);
					if (ownerInvite || effectiveAutoAcceptGroupInvites && isGroupInviteAllowed(inviterShip, effectiveGroupInviteAllowlist)) {
						try {
							await api.poke({
								app: "groups",
								mark: "group-join",
								json: {
									flag: groupFlag,
									"join-all": true
								}
							});
							processedGroupInvites.add(groupFlag);
							runtime.log?.(ownerInvite ? `[tlon] Auto-accepted group invite from owner: ${groupFlag}` : `[tlon] Auto-accepted group invite: ${groupFlag} (from ${inviterShip})`);
						} catch (err) {
							runtime.error?.(ownerInvite ? `[tlon] Failed to accept group invite from owner: ${String(err)}` : `[tlon] Failed to auto-accept group ${groupFlag}: ${String(err)}`);
							if (propagateWriteFailures && firstWriteError === void 0) firstWriteError = err instanceof Error ? err : new Error(formatErrorMessage(err));
						}
						continue;
					}
					if (effectiveOwnerShip) {
						const approval = createPendingApproval({
							type: "group",
							requestingShip: inviterShip,
							groupFlag
						});
						if (await queueApprovalRequest(approval)) processedGroupInvites.add(groupFlag);
						continue;
					}
					if (effectiveAutoAcceptGroupInvites) {
						runtime.log?.(`[tlon] Rejected group invite from ${inviterShip} (not in groupInviteAllowlist): ${groupFlag}`);
						processedGroupInvites.add(groupFlag);
					}
				}
				if (firstWriteError !== void 0) throw firstWriteError;
			};
			if (initForeigns) try {
				await processPendingInvites(initForeigns);
			} catch (error) {
				runtime.error?.(`[tlon] Error handling initial foreigns: ${formatErrorMessage(error)}`);
			}
			try {
				await api.subscribe({
					app: "groups",
					path: "/v1/foreigns",
					event: async (data) => {
						try {
							await processPendingInvites(data, true);
						} catch (error) {
							runtime.error?.(`[tlon] Error handling foreigns event: ${formatErrorMessage(error)}`);
							throw error;
						}
					},
					err: (error) => {
						runtime.error?.(`[tlon] Foreigns subscription error: ${String(error)}`);
					},
					quit: () => {
						runtime.log?.("[tlon] Foreigns subscription ended");
					}
				});
				runtime.log?.("[tlon] Subscribed to foreigns (/v1/foreigns) for auto-accepting group invites");
			} catch (err) {
				runtime.log?.(`[tlon] Foreigns subscription failed: ${String(err)}`);
			}
		}
		if (effectiveAutoDiscoverChannels) {
			const { channels: discoveredChannels } = await fetchInitData(api, runtime);
			addWatchedChannels(discoveredChannels);
			runtime.log?.(`[tlon] Watching ${watchedChannels.size} channel(s)`);
		}
		for (const channelNest of watchedChannels) runtime.log?.(`[tlon] Watching channel: ${channelNest}`);
		runtime.log?.("[tlon] All subscriptions registered, connecting to SSE stream...");
		await api.connect();
		if (discoveryScheduler.signal.aborted) return;
		ingress.start();
		runtime.log?.("[tlon] Connected! Firehose subscriptions active");
		discoveryScheduler.schedule({
			id: "channel-discovery",
			delayMs: 12e4,
			everyMs: 12e4,
			run: async () => {
				if (!effectiveAutoDiscoverChannels) return;
				try {
					const { channels: discoveredChannels } = await fetchInitData(api, runtime);
					if (discoveryScheduler.signal.aborted) return;
					addWatchedChannels(discoveredChannels, "[tlon] Now watching new channel: ");
				} catch (error) {
					runtime.error?.(`[tlon] Channel refresh error: ${formatErrorMessage(error)}`);
				}
			}
		});
		await waitUntilAbort(opts.abortSignal);
	} finally {
		discoveryScheduler.beginClose();
		api.stopReceiving();
		await discoveryScheduler.stop();
		await ingress.stop();
		try {
			await api.close();
		} catch (error) {
			runtime.error?.(`[tlon] Cleanup error: ${formatErrorMessage(error)}`);
		}
	}
}
//#endregion
//#region extensions/tlon/src/tlon-api.ts
const MEMEX_BASE_URL = "https://memex.tlon.network";
/** Max bytes to read from the Memex upload JSON response. */
const MEMEX_UPLOAD_RESPONSE_MAX_BYTES = 65536;
/** Total deadline for the Memex upload URL lookup, including DNS and response reading. */
const TLON_MEMEX_UPLOAD_URL_TIMEOUT_MS = 3e4;
/** Total deadline for Memex and custom S3 PUTs, including DNS and the full upload. */
const TLON_UPLOAD_TIMEOUT_MS = 3e5;
async function releaseUploadResponse(guarded) {
	if (!guarded) return;
	try {
		if (!guarded.response.bodyUsed) await guarded.response.body?.cancel();
	} catch {} finally {
		await guarded.release();
	}
}
function hasCustomS3Creds(credentials) {
	return Boolean(credentials?.accessKeyId && credentials?.endpoint && credentials?.secretAccessKey);
}
function isStorageCredentials(value) {
	if (!value || typeof value !== "object") return false;
	const record = value;
	return typeof record.endpoint === "string" && typeof record.accessKeyId === "string" && typeof record.secretAccessKey === "string";
}
function hostnameMatchesDomainBoundary(hostname, domain) {
	return hostname === domain || hostname.endsWith(`.${domain}`);
}
function isHostedShipUrl(shipUrl) {
	const trimmed = shipUrl.trim();
	if (!trimmed) return false;
	const normalized = /^[a-zA-Z][\w+.-]*:\/\//.test(trimmed) ? trimmed : `https://${trimmed}`;
	try {
		return isHostedTlonHostname(new URL(normalized).hostname);
	} catch {
		return false;
	}
}
function isHostedTlonHostname(hostname) {
	return hostnameMatchesDomainBoundary(hostname, "tlon.network") || hostnameMatchesDomainBoundary(hostname, "test.tlon.systems");
}
function assertTrustedMemexUploadUrl(rawUrl, label) {
	let parsed;
	try {
		parsed = new URL(rawUrl);
	} catch {
		throw new Error(`${label} must be a valid https URL`);
	}
	if (parsed.protocol !== "https:") throw new Error(`${label} must use https`);
	if (!isHostedTlonHostname(parsed.hostname)) throw new Error(`${label} must target a trusted hosted Tlon domain`);
	if (parsed.port && parsed.port !== "443") throw new Error(`${label} must not specify a non-standard port`);
	return parsed.toString();
}
function assertSafeUploadResultUrl(rawUrl, label) {
	let parsed;
	try {
		parsed = new URL(rawUrl);
	} catch {
		throw new Error(`${label} must be a valid http(s) URL`);
	}
	if (parsed.protocol !== "http:" && parsed.protocol !== "https:") throw new Error(`${label} must use http or https`);
	return parsed.toString();
}
function prefixEndpoint(endpoint) {
	return /https?:\/\//.test(endpoint) ? endpoint : `https://${endpoint}`;
}
function sanitizeFileName(fileName) {
	return fileName.split(/[/\\]/).pop() || fileName;
}
async function scryJson(config, cookie, path) {
	return await scryUrbitPath({
		baseUrl: config.shipUrl,
		cookie,
		ssrfPolicy: ssrfPolicyFromDangerouslyAllowPrivateNetwork(config.dangerouslyAllowPrivateNetwork),
		beforeRequest: config.assertDirectAdapterHandoff
	}, {
		path,
		auditContext: "tlon-storage-scry"
	});
}
async function getStorageConfiguration(config, cookie) {
	const result = await scryJson(config, cookie, "/storage/configuration.json");
	if ("storage-update" in result && result["storage-update"]?.configuration) return result["storage-update"].configuration;
	if ("currentBucket" in result) return result;
	throw new Error("Invalid storage configuration response");
}
async function getStorageCredentials(config, cookie) {
	const result = await scryJson(config, cookie, "/storage/credentials.json");
	if ("storage-update" in result) return result["storage-update"]?.credentials ?? null;
	if (isStorageCredentials(result)) return result;
	return null;
}
async function getMemexUploadUrl(params) {
	const token = await scryJson(params.config, params.cookie, "/genuine/secret.json");
	const resolvedToken = typeof token === "string" ? token : token.secret;
	if (!resolvedToken) throw new Error("Missing genuine secret");
	const endpoint = `${MEMEX_BASE_URL}/v1/${params.config.shipName}/upload`;
	let guarded;
	try {
		guarded = await fetchWithSsrFGuard({
			url: endpoint,
			init: {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					token: resolvedToken,
					contentLength: params.contentLength,
					contentType: params.contentType,
					fileName: params.fileName
				})
			},
			auditContext: "tlon-memex-upload-url",
			capture: false,
			maxRedirects: 0,
			timeoutMs: TLON_MEMEX_UPLOAD_URL_TIMEOUT_MS,
			beforeRequest: params.config.assertDirectAdapterHandoff
		});
		if (!guarded.response.ok) throw new Error(`Memex upload request failed: ${guarded.response.status}`);
		const data = await readProviderJsonResponse(guarded.response, "Memex upload", { maxBytes: MEMEX_UPLOAD_RESPONSE_MAX_BYTES });
		if (!data?.url || !data.filePath) throw new Error("Invalid response from Memex");
		return {
			hostedUrl: data.filePath,
			uploadUrl: data.url
		};
	} finally {
		await releaseUploadResponse(guarded);
	}
}
async function uploadFile(params, clientConfig) {
	const config = {
		...clientConfig,
		shipName: clientConfig.shipName.replace(/^~/, "")
	};
	const cookie = await authenticate(config.shipUrl, await config.getCode(), {
		ssrfPolicy: ssrfPolicyFromDangerouslyAllowPrivateNetwork(config.dangerouslyAllowPrivateNetwork),
		beforeRequest: config.assertDirectAdapterHandoff
	});
	const privateNetworkPolicy = ssrfPolicyFromDangerouslyAllowPrivateNetwork(config.dangerouslyAllowPrivateNetwork);
	const [storageConfig, credentials] = await Promise.all([getStorageConfiguration(config, cookie), getStorageCredentials(config, cookie)]);
	const contentType = params.contentType || params.blob.type || "application/octet-stream";
	const extension = extensionForMime(contentType) || ".jpg";
	const fileName = sanitizeFileName(params.fileName || `upload${extension}`);
	const fileKey = `${config.shipName}/${Date.now()}-${crypto.randomUUID()}-${fileName}`;
	const useMemex = isHostedShipUrl(config.shipUrl) && (storageConfig.service === "presigned-url" || !hasCustomS3Creds(credentials));
	const uploadBlob = async (url, headers) => {
		let guarded;
		try {
			guarded = await fetchWithSsrFGuard({
				url,
				init: {
					method: "PUT",
					body: params.blob,
					headers
				},
				auditContext: useMemex ? "tlon-memex-upload" : "tlon-custom-s3-upload",
				capture: false,
				maxRedirects: 0,
				...useMemex ? {} : { policy: privateNetworkPolicy },
				timeoutMs: TLON_UPLOAD_TIMEOUT_MS,
				beforeRequest: config.assertDirectAdapterHandoff
			});
			if (useMemex) assertTrustedMemexUploadUrl(guarded.finalUrl, "Memex final upload URL");
			if (!guarded.response.ok) throw new Error(`Upload failed: ${guarded.response.status}`);
		} finally {
			await releaseUploadResponse(guarded);
		}
	};
	if (useMemex) {
		const { hostedUrl, uploadUrl } = await getMemexUploadUrl({
			config,
			cookie,
			contentLength: params.blob.size,
			contentType,
			fileName: fileKey
		});
		await uploadBlob(assertTrustedMemexUploadUrl(uploadUrl, "Memex upload URL"), {
			"Cache-Control": "public, max-age=3600",
			"Content-Type": contentType
		});
		return { url: assertTrustedMemexUploadUrl(hostedUrl, "Memex hosted URL") };
	}
	if (!hasCustomS3Creds(credentials)) throw new Error("No storage credentials configured");
	const client = new S3Client({
		endpoint: prefixEndpoint(credentials.endpoint),
		region: storageConfig.region || "us-east-1",
		credentials: {
			accessKeyId: credentials.accessKeyId,
			secretAccessKey: credentials.secretAccessKey
		},
		forcePathStyle: true
	});
	const headers = {
		"Cache-Control": "public, max-age=3600",
		"Content-Type": contentType,
		"x-amz-acl": "public-read"
	};
	const command = new PutObjectCommand({
		Bucket: storageConfig.currentBucket,
		Key: fileKey,
		ContentType: headers["Content-Type"],
		CacheControl: headers["Cache-Control"],
		ACL: "public-read"
	});
	const signedUrl = await getSignedUrl(client, command, { expiresIn: 3600 });
	await uploadBlob(signedUrl, signedUrl.includes("digitaloceanspaces.com") ? headers : void 0);
	return { url: assertSafeUploadResultUrl(storageConfig.publicUrlBase ? new URL(fileKey, storageConfig.publicUrlBase).toString() : expectDefined(signedUrl.split("?").at(0), "signed URL base segment"), "Upload result URL") };
}
//#endregion
//#region extensions/tlon/src/urbit/upload.ts
/**
* Fetch an image from a URL and upload it to Tlon storage.
* Falls back to the original URL on error, but only after a bounded download when a cap is set.
*/
async function uploadImageFromUrl(imageUrl, clientConfig, maxBytes) {
	let sourceSizeVerified = false;
	const assertCurrent = clientConfig.assertDirectAdapterHandoff;
	let authorityRejection;
	const beforeRequest = assertCurrent ? () => {
		try {
			return assertCurrent();
		} catch (error) {
			authorityRejection ??= { error };
			throw error;
		}
	} : void 0;
	try {
		const url = new URL(imageUrl);
		if (url.protocol !== "http:" && url.protocol !== "https:") throw new Error("Tlon image URL must use HTTP or HTTPS");
		const fetched = await readRemoteMediaBuffer({
			url: imageUrl,
			maxBytes: Math.min(maxBytes ?? MAX_IMAGE_BYTES, MAX_IMAGE_BYTES),
			...TLON_MEDIA_FETCH_TIMEOUTS,
			ssrfPolicy: void 0,
			beforeRequest,
			requestInit: { method: "GET" }
		});
		sourceSizeVerified = true;
		const contentType = fetched.contentType || "image/png";
		return (await uploadFile({
			blob: new Blob([bufferToBlobPart(fetched.buffer)], { type: contentType }),
			fileName: url.pathname.split("/").pop() || `upload-${Date.now()}.png`,
			contentType
		}, {
			...clientConfig,
			assertDirectAdapterHandoff: beforeRequest
		})).url;
	} catch (err) {
		if (authorityRejection) throw authorityRejection.error;
		assertCurrent?.();
		if (maxBytes !== void 0 && !sourceSizeVerified) throw err;
		console.warn(`[tlon] Failed to upload image, using original URL: ${String(err)}`);
		return imageUrl;
	}
}
//#endregion
//#region extensions/tlon/src/channel.runtime.ts
async function createHttpPokeApi(params) {
	const ssrfPolicy = ssrfPolicyFromDangerouslyAllowPrivateNetwork(params.dangerouslyAllowPrivateNetwork);
	const cookie = await authenticate(params.url, params.code, {
		ssrfPolicy,
		beforeRequest: params.assertDirectAdapterHandoff
	});
	const channelId = `${Math.floor(Date.now() / 1e3)}-${crypto.randomUUID()}`;
	const shipName = params.ship.replace(/^~/, "");
	return { poke: async (pokeParams) => {
		const pokeId = Date.now();
		const pokeData = {
			id: pokeId,
			action: "poke",
			ship: shipName,
			app: pokeParams.app,
			mark: pokeParams.mark,
			json: pokeParams.json
		};
		params.assertDirectAdapterHandoff?.();
		await params.onPlatformSendDispatch?.();
		const { response, release } = await putUrbitChannel({
			baseUrl: params.url,
			channelId,
			ship: shipName,
			cookie: normalizeUrbitCookie(cookie),
			ssrfPolicy
		}, {
			body: [pokeData],
			auditContext: "tlon-poke",
			beforeRequest: params.assertDirectAdapterHandoff
		});
		try {
			if (!response.ok && response.status !== 204) {
				const errorText = await readResponseTextLimited(response, 16384);
				throw new Error(`Poke failed: ${response.status} - ${errorText}`);
			}
			return pokeId;
		} finally {
			await release();
		}
	} };
}
function resolveOutboundContext(params) {
	const account = resolveTlonAccount(params.cfg, params.accountId ?? void 0);
	if (!account.configured || !account.ship || !account.url || !account.code) {
		const missingFields = [
			account.ship ? void 0 : "ship",
			account.url ? void 0 : "url",
			account.code ? void 0 : "code"
		].filter((field) => field !== void 0);
		throw new Error(`Tlon account ${account.accountId} not configured (missing ${missingFields.join(", ")})`);
	}
	const parsed = parseTlonTarget(params.to);
	if (!parsed) throw new Error(`Invalid Tlon target. Use ${formatTargetHint()}`);
	return {
		account,
		parsed
	};
}
function resolveReplyId(replyToId, threadId) {
	return replyToId ?? threadId ? String(replyToId ?? threadId) : void 0;
}
async function sendTlonOutbound(params, kind) {
	const { cfg, to, text, accountId, replyToId, threadId, assertDirectAdapterHandoff } = params;
	const { account, parsed } = resolveOutboundContext({
		cfg,
		accountId,
		to
	});
	let uploadedUrl;
	if (kind === "media") {
		const { mediaUrl } = params;
		uploadedUrl = mediaUrl ? await uploadImageFromUrl(mediaUrl, {
			shipUrl: account.url,
			shipName: account.ship,
			verbose: false,
			getCode: async () => account.code,
			dangerouslyAllowPrivateNetwork: account.dangerouslyAllowPrivateNetwork ?? void 0,
			assertDirectAdapterHandoff
		}, account.mediaMaxBytes) : void 0;
	}
	const api = await createHttpPokeApi({
		url: account.url,
		ship: account.ship,
		code: account.code,
		dangerouslyAllowPrivateNetwork: account.dangerouslyAllowPrivateNetwork ?? void 0,
		assertDirectAdapterHandoff,
		onPlatformSendDispatch: params.onPlatformSendDispatch
	});
	const fromShip = normalizeShip(account.ship);
	const story = kind === "media" ? buildMediaStory(text, uploadedUrl) : markdownToStory(text);
	if (parsed.kind === "dm") return await sendDmWithStory({
		api,
		fromShip,
		toShip: parsed.ship,
		story,
		kind
	});
	return await sendGroupMessageWithStory({
		api,
		fromShip,
		hostShip: parsed.hostShip,
		channelName: parsed.channelName,
		story,
		replyToId: resolveReplyId(replyToId, threadId),
		kind
	});
}
const tlonRuntimeOutbound = {
	sendText: (params) => sendTlonOutbound(params, "text"),
	sendMedia: (params) => sendTlonOutbound(params, "media")
};
async function probeTlonAccount(account, timeoutMs) {
	return await runChannelProbe(timeoutMs, async () => {
		const ssrfPolicy = ssrfPolicyFromDangerouslyAllowPrivateNetwork(account.dangerouslyAllowPrivateNetwork);
		const cookie = await authenticate(account.url, account.code, { ssrfPolicy });
		const { response, release } = await urbitFetch({
			baseUrl: account.url,
			path: "/~/name",
			init: {
				method: "GET",
				headers: { Cookie: cookie }
			},
			ssrfPolicy,
			timeoutMs: 3e4,
			auditContext: "tlon-probe-account"
		});
		try {
			if (!response.ok) return {
				ok: false,
				error: `Name request failed: ${response.status}`
			};
			return { ok: true };
		} finally {
			await release();
		}
	}, (error) => ({
		ok: false,
		error: error?.message ?? String(error)
	}));
}
async function startTlonGatewayAccount(ctx) {
	const account = ctx.account;
	ctx.setStatus({
		accountId: account.accountId,
		ship: account.ship,
		url: account.url
	});
	ctx.log?.info(`[${account.accountId}] starting Tlon provider for ${account.ship ?? "tlon"}`);
	return monitorTlonProvider({
		scheduler: ctx.scheduler,
		runtime: ctx.runtime,
		abortSignal: ctx.abortSignal,
		accountId: account.accountId
	});
}
//#endregion
export { probeTlonAccount, startTlonGatewayAccount, tlonRuntimeOutbound, tlonSetupWizard };
