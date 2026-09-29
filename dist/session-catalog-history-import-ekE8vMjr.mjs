import { y as parseDateStringTimestampMs } from "./number-coercion-CLj0HTDM.mjs";
import { m as withSessionTranscriptWriteLock } from "./session-transcript-runtime-BW5gMlRE.mjs";
//#region src/plugins/session-catalog-history-import.ts
const SESSION_CATALOG_HISTORY_IMPORT_MAX_ITEMS = 200;
const SESSION_CATALOG_HISTORY_IMPORT_MAX_BYTES = 524288;
const SESSION_CATALOG_HISTORY_IMPORT_PAGE_LIMIT = 100;
function importedSessionCatalogMessage(params) {
	const timestamp = parseDateStringTimestampMs(params.item.timestamp) ?? params.fallbackTimestamp;
	const importedText = params.item.text?.trim();
	if (!importedText && params.item.type === "reasoning") return;
	const text = importedText || "[Unsupported catalog transcript item]";
	if (params.item.type === "userMessage") return {
		role: "user",
		content: text,
		timestamp,
		__openclaw: { mirrorOrigin: `${params.catalogId}-catalog-import` }
	};
	return {
		role: "assistant",
		content: [{
			type: "text",
			text: `${params.item.type === "reasoning" ? "Thinking\n\n" : params.item.type === "toolCall" ? "Tool call\n\n" : params.item.type === "toolResult" ? "Tool result\n\n" : params.item.type === "other" ? "Other\n\n" : ""}${text}`
		}],
		timestamp,
		api: "openai-responses",
		provider: params.catalogId,
		model: params.item.model ?? "native-history",
		usage: {
			input: 0,
			output: 0,
			cacheRead: 0,
			cacheWrite: 0,
			totalTokens: 0,
			cost: {
				input: 0,
				output: 0,
				cacheRead: 0,
				cacheWrite: 0,
				total: 0
			}
		},
		stopReason: "stop"
	};
}
function sessionCatalogContinuationNotice(text, timestamp) {
	return {
		role: "assistant",
		content: [{
			type: "text",
			text
		}],
		timestamp,
		api: "openai-responses",
		provider: "openclaw",
		model: "session-catalog",
		usage: {
			input: 0,
			output: 0,
			cacheRead: 0,
			cacheWrite: 0,
			totalTokens: 0,
			cost: {
				input: 0,
				output: 0,
				cacheRead: 0,
				cacheWrite: 0,
				total: 0
			}
		},
		stopReason: "stop"
	};
}
function fitSessionCatalogItemToBytes(item, maxBytes) {
	if (Buffer.byteLength(JSON.stringify(item), "utf8") <= maxBytes) return item;
	const text = item.text;
	if (typeof text !== "string") return;
	const candidate = (length) => {
		const safeLength = length > 0 && /[\uD800-\uDBFF]/u.test(text.charAt(length - 1)) ? length - 1 : length;
		return {
			...item,
			text: `${text.slice(0, safeLength)}…`,
			truncated: true
		};
	};
	let low = 0;
	let high = text.length;
	while (low < high) {
		const middle = Math.ceil((low + high) / 2);
		if (Buffer.byteLength(JSON.stringify(candidate(middle)), "utf8") <= maxBytes) low = middle;
		else high = middle - 1;
	}
	const bounded = candidate(low);
	return Buffer.byteLength(JSON.stringify(bounded), "utf8") <= maxBytes ? bounded : void 0;
}
function importableSessionCatalogItem(item) {
	const { raw: _raw, ...importable } = item;
	return importable;
}
async function readBoundedSessionCatalogHistory(params) {
	const items = [];
	let cursor;
	let bytes = 0;
	while (items.length < SESSION_CATALOG_HISTORY_IMPORT_MAX_ITEMS) {
		const page = await params.read({
			limit: Math.min(SESSION_CATALOG_HISTORY_IMPORT_PAGE_LIMIT, SESSION_CATALOG_HISTORY_IMPORT_MAX_ITEMS - items.length),
			...cursor ? { cursor } : {}
		});
		for (const item of page.items) {
			const importableItem = importableSessionCatalogItem(item);
			const itemBytes = Buffer.byteLength(JSON.stringify(importableItem), "utf8");
			const remainingBytes = SESSION_CATALOG_HISTORY_IMPORT_MAX_BYTES - bytes;
			if (items.length > 0 && itemBytes > remainingBytes) return items.toReversed();
			const retainedItem = itemBytes <= remainingBytes ? importableItem : fitSessionCatalogItemToBytes(importableItem, remainingBytes);
			if (!retainedItem) continue;
			const retainedItemBytes = Buffer.byteLength(JSON.stringify(retainedItem), "utf8");
			items.push(retainedItem);
			bytes += retainedItemBytes;
			if (items.length === SESSION_CATALOG_HISTORY_IMPORT_MAX_ITEMS || bytes === SESSION_CATALOG_HISTORY_IMPORT_MAX_BYTES) return items.toReversed();
		}
		if (!page.nextCursor || page.nextCursor === cursor) break;
		cursor = page.nextCursor;
	}
	return items.toReversed();
}
async function importSessionCatalogHistory(params) {
	const items = await readBoundedSessionCatalogHistory({ read: params.read });
	const fallbackTimestamp = Date.now();
	await withSessionTranscriptWriteLock(params, async (transcript) => {
		for (const [index, item] of items.entries()) {
			const imported = importedSessionCatalogMessage({
				catalogId: params.catalogId,
				item,
				fallbackTimestamp: fallbackTimestamp + index
			});
			if (!imported) continue;
			const message = {
				...imported,
				idempotencyKey: `${params.catalogId}-catalog:${params.threadId}:${item.id ?? index}`
			};
			await transcript.appendMessage({
				message,
				idempotencyLookup: "scan",
				cwd: params.cwd,
				...params.commitGuard ? { beforeCommitInTransaction: params.commitGuard } : {}
			});
		}
		const notice = params.continuationNotice?.trim();
		if (notice) await transcript.appendMessage({
			message: {
				...sessionCatalogContinuationNotice(notice, fallbackTimestamp + items.length),
				idempotencyKey: `${params.catalogId}-catalog:${params.threadId}:continuation-notice`
			},
			idempotencyLookup: "scan",
			cwd: params.cwd,
			...params.commitGuard ? { beforeCommitInTransaction: params.commitGuard } : {}
		});
	});
}
//#endregion
export { importSessionCatalogHistory as t };
