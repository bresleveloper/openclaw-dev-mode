import { y as parseDateStringTimestampMs } from "./number-coercion-CuVhdCBs.mjs";
import { a as wrapExternalContent } from "./external-content-Bkm4w5qo.mjs";
import { l as makeZeroUsageSnapshot } from "./usage-XmAH1cfG.mjs";
import { m as withSessionTranscriptWriteLock } from "./session-transcript-runtime-Bo9r2tlZ.mjs";
import { createHash } from "node:crypto";
//#region src/plugins/session-catalog-history-import.ts
const SESSION_CATALOG_CONTINUATION_LIMITS = {
	maxItems: 200,
	maxBytes: 524288
};
const SESSION_CATALOG_TRANSCRIPT_IMPORT_LIMITS = {
	maxItems: 5e4,
	maxBytes: 67108864
};
const SESSION_CATALOG_HISTORY_IMPORT_PAGE_LIMIT = 50;
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
	return sessionCatalogAssistantMessage(`${params.item.type === "reasoning" ? "Thinking\n\n" : params.item.type === "toolCall" ? "Tool call\n\n" : params.item.type === "toolResult" ? "Tool result\n\n" : params.item.type === "other" ? "Other\n\n" : ""}${text}`, timestamp, params.catalogId, params.item.model ?? "native-history");
}
function sessionCatalogAssistantMessage(text, timestamp, provider, model) {
	return {
		role: "assistant",
		content: [{
			type: "text",
			text
		}],
		timestamp,
		api: "openai-responses",
		provider,
		model,
		usage: makeZeroUsageSnapshot(),
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
async function readBoundedSessionCatalogHistory(params) {
	const items = [];
	let cursor;
	let bytes = 0;
	let totalItems = 0;
	let complete = true;
	const result = (retainedAll) => ({
		items: items.toReversed(),
		totalItems,
		complete: complete && retainedAll
	});
	while (items.length < params.limits.maxItems) {
		const page = await params.read({
			limit: Math.min(SESSION_CATALOG_HISTORY_IMPORT_PAGE_LIMIT, params.limits.maxItems - items.length),
			...cursor ? { cursor } : {}
		});
		totalItems += page.items.length;
		for (const [index, item] of page.items.entries()) {
			const { raw: _raw, ...importableItem } = item;
			const itemBytes = Buffer.byteLength(JSON.stringify(importableItem), "utf8");
			const remainingBytes = params.limits.maxBytes - bytes;
			if (items.length > 0 && itemBytes > remainingBytes) return result(false);
			const retainedItem = itemBytes <= remainingBytes ? importableItem : fitSessionCatalogItemToBytes(importableItem, remainingBytes);
			if (retainedItem !== importableItem) complete = false;
			if (!retainedItem) continue;
			const retainedItemBytes = Buffer.byteLength(JSON.stringify(retainedItem), "utf8");
			items.push(retainedItem);
			bytes += retainedItemBytes;
			if (items.length === params.limits.maxItems || bytes === params.limits.maxBytes) return result(index === page.items.length - 1 && !page.nextCursor);
		}
		if (!page.nextCursor) return result(true);
		if (page.nextCursor === cursor) return result(false);
		cursor = page.nextCursor;
	}
	return result(false);
}
async function importSessionCatalogHistory(params) {
	const { items } = await readBoundedSessionCatalogHistory({
		read: params.read,
		limits: SESSION_CATALOG_CONTINUATION_LIMITS
	});
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
				...sessionCatalogAssistantMessage(notice, fallbackTimestamp + items.length, "openclaw", "session-catalog"),
				idempotencyKey: `${params.catalogId}-catalog:${params.threadId}:continuation-notice`
			},
			idempotencyLookup: "scan",
			cwd: params.cwd,
			...params.commitGuard ? { beforeCommitInTransaction: params.commitGuard } : {}
		});
	});
}
/** Preserve a prepared catalog snapshot without binding the session to its source runtime. */
async function preserveSessionCatalogHistory(params) {
	const fallbackTimestamp = Date.now();
	const occurrences = /* @__PURE__ */ new Map();
	let importedItems = 0;
	params.commitGuard?.();
	await withSessionTranscriptWriteLock(params, async (transcript) => {
		params.commitGuard?.();
		await transcript.appendMessage({
			message: {
				...sessionCatalogAssistantMessage(params.notice, fallbackTimestamp, "openclaw", "session-catalog"),
				idempotencyKey: "catalog-preservation:notice"
			},
			idempotencyLookup: "scan",
			prepareMessageAfterIdempotencyCheck: (message) => message,
			beforeFreshMessageCommit: params.commitGuard
		});
		for (const [index, item] of params.history.items.entries()) {
			const imported = importedSessionCatalogMessage({
				catalogId: params.catalogId,
				item,
				fallbackTimestamp: fallbackTimestamp + index + 1
			});
			if (!imported) continue;
			let identity;
			if (item.id) identity = ["id", item.id];
			else {
				const hash = createHash("sha256").update(JSON.stringify([
					item.type,
					item.text ?? null,
					item.timestamp ?? null,
					item.model ?? null
				])).digest("hex");
				const ordinal = occurrences.get(hash) ?? 0;
				occurrences.set(hash, ordinal + 1);
				identity = [
					"content",
					hash,
					ordinal
				];
			}
			const idempotencyKey = `catalog-preservation:${JSON.stringify([
				params.catalogId,
				params.threadId,
				...identity
			])}`;
			params.commitGuard?.();
			if ((await transcript.appendMessage({
				message: {
					...imported,
					idempotencyKey
				},
				idempotencyLookup: "scan",
				prepareMessageAfterIdempotencyCheck: (message) => {
					const wrapped = importedSessionCatalogMessage({
						catalogId: params.catalogId,
						item: {
							...item,
							text: wrapExternalContent(item.text?.trim() || "[Unsupported catalog transcript item]", {
								source: "unknown",
								includeWarning: false
							})
						},
						fallbackTimestamp: fallbackTimestamp + index + 1
					});
					return wrapped ? {
						...wrapped,
						idempotencyKey
					} : message;
				},
				beforeFreshMessageCommit: params.commitGuard
			}))?.appended) importedItems += 1;
		}
	});
	return { importedItems };
}
//#endregion
export { readBoundedSessionCatalogHistory as i, importSessionCatalogHistory as n, preserveSessionCatalogHistory as r, SESSION_CATALOG_TRANSCRIPT_IMPORT_LIMITS as t };
