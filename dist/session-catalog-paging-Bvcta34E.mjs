import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { i as normalizeBoundedOptionalString } from "./string-coerce-CIXf7egm.mjs";
//#region src/plugin-sdk/session-catalog-paging.ts
/** Keep a host's publication owned until its callback finishes, even after a fail-soft list. */
function publishSessionCatalogHost(params, pendingHost) {
	const { onHost, waitUntil } = params;
	const published = pendingHost.then((host) => onHost?.(host));
	published.catch(() => void 0);
	waitUntil?.(published);
}
const DEFAULT_PAGE_LIMIT = 20;
const MAX_PAGE_LIMIT = 100;
const MAX_CURSOR_LENGTH = 128;
const MAX_TRANSCRIPT_ITEM_BYTES = 524288;
const MAX_TRANSCRIPT_PAGE_BYTES = 20971520;
function boundedSessionCatalogLimit(value, fallback = DEFAULT_PAGE_LIMIT) {
	if (value === void 0) return fallback;
	if (!Number.isInteger(value) || Number(value) < 1 || Number(value) > MAX_PAGE_LIMIT) throw new Error(`limit must be an integer between 1 and ${String(MAX_PAGE_LIMIT)}`);
	return Number(value);
}
function encodeSessionCatalogCursor(offset) {
	return Buffer.from(JSON.stringify({ offset }), "utf8").toString("base64url");
}
function optionalSessionCatalogCursor(value, maxLength = MAX_CURSOR_LENGTH) {
	if (value === void 0) return;
	if (typeof value !== "string" || value.length === 0 || value.length > maxLength) throw new Error("cursor is invalid");
	return value;
}
function parseSessionCatalogListParams(value, options) {
	if (value === void 0 || value === null) return { limit: DEFAULT_PAGE_LIMIT };
	if (!isRecord(value)) throw new Error(options.messages.listNotObject);
	const unknown = Object.keys(value).find((key) => ![
		"searchTerm",
		"limit",
		"cursor"
	].includes(key));
	if (unknown) throw new Error(options.messages.unknownListParameter(unknown));
	const searchTerm = normalizeBoundedOptionalString(value.searchTerm, options.searchMaxLength);
	if (value.searchTerm !== void 0 && !searchTerm) throw new Error(options.messages.invalidSearchTerm);
	const cursor = optionalSessionCatalogCursor(value.cursor);
	return {
		limit: boundedSessionCatalogLimit(value.limit),
		...searchTerm ? { searchTerm } : {},
		...cursor ? { cursor } : {}
	};
}
function parseSessionCatalogReadParams(value, options) {
	if (!isRecord(value)) throw new Error(options.messages.readNotObject);
	const unknown = Object.keys(value).find((key) => ![
		"threadId",
		"limit",
		"cursor"
	].includes(key));
	if (unknown) throw new Error(options.messages.unknownReadParameter(unknown));
	const threadId = normalizeBoundedOptionalString(value.threadId, options.threadIdMaxLength);
	if (!threadId || !options.threadIdPattern.test(threadId)) throw new Error(options.messages.invalidThreadId);
	const cursor = optionalSessionCatalogCursor(value.cursor, options.cursorMaxLength);
	return {
		threadId,
		limit: boundedSessionCatalogLimit(value.limit),
		...cursor ? { cursor } : {}
	};
}
function decodeSessionCatalogCursor(value) {
	const cursor = optionalSessionCatalogCursor(value);
	if (cursor === void 0) return 0;
	try {
		const bytes = Buffer.from(cursor, "base64url");
		if (bytes.toString("base64url") !== cursor) throw new Error("non-canonical base64url");
		const parsed = JSON.parse(bytes.toString("utf8"));
		if (!isRecord(parsed) || !Number.isSafeInteger(parsed.offset) || Number(parsed.offset) < 0) throw new Error("invalid offset");
		const offset = Number(parsed.offset);
		if (encodeSessionCatalogCursor(offset) !== cursor) throw new Error("non-canonical cursor payload");
		return offset;
	} catch (error) {
		throw new Error("cursor is invalid", { cause: error });
	}
}
function isExactSessionCatalogCursor(value) {
	if (typeof value !== "string") return false;
	try {
		decodeSessionCatalogCursor(value);
		return true;
	} catch {
		return false;
	}
}
function truncateUtf8(text, maxBytes) {
	if (Buffer.byteLength(text, "utf8") <= maxBytes) return text;
	let low = 0;
	let high = text.length;
	while (low < high) {
		const middle = Math.ceil((low + high) / 2);
		if (Buffer.byteLength(text.slice(0, middle), "utf8") <= maxBytes - 3) low = middle;
		else high = middle - 1;
	}
	const end = low > 0 && /[\uD800-\uDBFF]/u.test(text.charAt(low - 1)) ? low - 1 : low;
	return `${text.slice(0, end)}…`;
}
/** Page chronological source items newest-first, bounding per-item and per-page byte budgets. */
function boundSessionCatalogTranscriptPage(items, limit, offset) {
	const end = Math.max(0, items.length - offset);
	const start = Math.max(0, end - limit);
	const page = [];
	let pageBytes = 2;
	for (let index = end - 1; index >= start; index -= 1) {
		const item = items[index];
		if (!item) continue;
		const bounded = {
			...item,
			text: truncateUtf8(item.text ?? "", MAX_TRANSCRIPT_ITEM_BYTES)
		};
		const itemBytes = Buffer.byteLength(JSON.stringify(bounded), "utf8") + 1;
		if (page.length > 0 && pageBytes + itemBytes > MAX_TRANSCRIPT_PAGE_BYTES) break;
		page.push(bounded);
		pageBytes += itemBytes;
	}
	const consumed = offset + page.length;
	return {
		items: page,
		...consumed < items.length ? { nextCursor: encodeSessionCatalogCursor(consumed) } : {}
	};
}
/** Canonical bounded parameter, base64url cursor, and UTF-8 transcript paging contract. */
const sessionCatalogPaging = {
	boundedLimit: boundedSessionCatalogLimit,
	encodeCursor: encodeSessionCatalogCursor,
	optionalCursor: optionalSessionCatalogCursor,
	parseListParams: parseSessionCatalogListParams,
	parseReadParams: parseSessionCatalogReadParams,
	decodeCursor: decodeSessionCatalogCursor,
	isExactCursor: isExactSessionCatalogCursor,
	boundTranscriptPage: boundSessionCatalogTranscriptPage
};
//#endregion
export { sessionCatalogPaging as n, publishSessionCatalogHost as t };
