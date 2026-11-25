import { S as readControlCursor, b as parseTranscriptPage, l as MAX_TRANSCRIPT_PAGE_BYTES, o as CatalogParamsError } from "./session-catalog-parsing-BS06j5dj.mjs";
import { r as isJsonObject } from "./protocol-NX-eGZn-.mjs";
import { d as itemStatus, n as auditNativeToolTerminalStatus, t as auditNativeToolName, u as itemName } from "./event-projector-items-BCAkXl87.mjs";
import { o as readItem } from "./event-projector-values-BxTVI6kj.mjs";
import { _ as collectDynamicToolContentText, a as itemToolArgs, c as itemTranscriptResultText, l as projectCodexToolActivity, s as itemToolResult } from "./event-projector-tool-items-CT-dExQg.mjs";
import { t as jsonObjectSchema } from "./json-schema-b_akzFi4.mjs";
import { r as projectCodexUserItemText } from "./transcript-history-projection-CDmsRTvT.mjs";
import { z } from "zod";
import { sessionCatalogPaging } from "openclaw/plugin-sdk/session-catalog-paging";
// extensions/codex/src/session-catalog-transcript-item.ts
const CODEX_TOOL_TYPES = /* @__PURE__ */ new Set([
	"commandExecution",
	"fileChange",
	"mcpToolCall",
	"dynamicToolCall",
	"collabAgentToolCall",
	"webSearch",
	"imageView",
	"imageGeneration"
]);
function catalogItemType(item) {
	if (item.type === "userMessage" || item.type === "agentMessage" || item.type === "reasoning") return item.type;
	if (!CODEX_TOOL_TYPES.has(item.type)) return "other";
	return itemStatus(item) !== "running" && (auditNativeToolTerminalStatus(item) !== "unknown" || item.exitCode != null || typeof item.success === "boolean" || item.error != null || item.result != null && item.result !== "" || item.contentItems != null || item.aggregatedOutput != null) ? "toolResult" : "toolCall";
}
function toGenericTranscriptItem(item) {
	const type = catalogItemType(item);
	const fallback = item.title ?? item.name ?? item.tool ?? item.command ?? item.query;
	const resultText = item.error?.message ?? item.aggregatedOutput ?? (item.result == null ? void 0 : JSON.stringify(item.result, null, 2)) ?? (item.contentItems == null ? void 0 : collectDynamicToolContentText(item.contentItems));
	const changesText = item.type === "fileChange" && Array.isArray(item.changes) ? itemTranscriptResultText(item) : void 0;
	const text = item.type === "userMessage" ? projectCodexUserItemText(item) : item.type === "reasoning" ? item.text || reasoningText(item) : item.text || (resultText ?? changesText ?? (type === "toolResult" ? "" : fallback));
	return {
		id: item.id,
		type,
		...text != null ? { text } : {},
		raw: item
	};
}
/** Gateway display facts; node source pages retain their released wire shape. */
function codexCatalogDisplayFacts(item) {
	const type = catalogItemType(item);
	if (type !== "toolCall" && type !== "toolResult") return item.type === "agentMessage" && (item.phase === "commentary" || item.phase === "final_answer" || item.phase === "partial_answer") ? {
		type,
		phase: item.phase
	} : { type };
	const activity = projectCodexToolActivity(item, "history");
	const toolInput = itemToolArgs(item) ?? (item.arguments !== void 0 ? item.arguments : item.type === "imageView" && typeof item.path === "string" ? { path: item.path } : void 0);
	const toolDetails = type === "toolResult" ? itemToolResult(item) : void 0;
	return {
		type,
		toolName: itemName(item) ?? auditNativeToolName(item) ?? item.tool ?? item.name ?? item.type,
		toolCallId: item.id,
		...toolInput !== void 0 ? { toolInput } : {},
		...activity ? { activity: {
			...activity,
			...type === "toolCall" ? { unpairedCall: true } : {}
		} } : {},
		...toolDetails !== void 0 ? { toolDetails } : {},
		...type === "toolResult" && typeof item.exitCode === "number" ? { exitCode: item.exitCode } : {},
		...type === "toolResult" && activity?.status ? { isError: activity.status === "failed" || activity.status === "blocked" } : {}
	};
}
function reasoningText(item) {
	return [item.summary, item.content].flatMap((sections) => Array.isArray(sections) ? sections : []).filter((section) => typeof section === "string" && section.trim().length > 0).join("\n\n") || void 0;
}
// extensions/codex/src/session-catalog-transcript.ts
const TURN_ITEM_CURSOR_PREFIX = "turn-item:";
const transcriptPageSchema = z.strictObject({
	items: z.array(z.strictObject({
		id: z.string(),
		type: z.enum([
			"userMessage",
			"agentMessage",
			"reasoning",
			"toolCall",
			"toolResult",
			"other"
		]),
		text: z.string().optional(),
		raw: jsonObjectSchema.optional(),
		truncated: z.boolean().optional()
	})),
	nextCursor: z.string().optional()
});
function parseCodexCatalogTranscriptPage(value) {
	return transcriptPageSchema.parse(value);
}
/** Enrich local and released-node source pages once, without changing their rows or cursor. */
function projectCodexCatalogTranscriptPageForDisplay(page) {
	const projected = {
		...page,
		items: page.items.map((item) => {
			const native = isJsonObject(item.raw) ? readItem(item.raw) : void 0;
			if (!native) return item;
			return {
				...item,
				...codexCatalogDisplayFacts(native)
			};
		})
	};
	return fitDisplayInputsToNodeTransport(projected) ? projected : page;
}
function projectTranscriptPage(entries, limit) {
	const projected = entries.map(({ item }) => toGenericTranscriptItem(item));
	const page = sessionCatalogPaging.boundTranscriptPage(projected.toReversed(), limit, 0).items;
	for (const [index, item] of page.entries()) if (item.text !== projected[index]?.text && projected[index]?.text) item.truncated = true;
	return page;
}
function pageFitsNodeTransport(page) {
	return Buffer.byteLength(JSON.stringify({ payloadJSON: JSON.stringify(page) }), "utf8") <= MAX_TRANSCRIPT_PAGE_BYTES;
}
function fitDisplayInputsToNodeTransport(page) {
	if (pageFitsNodeTransport(page)) return true;
	for (const item of page.items) if (item.toolDetails !== void 0) {
		delete item.toolDetails;
		item.truncated = true;
	}
	if (pageFitsNodeTransport(page)) return true;
	for (const item of page.items) if (item.toolInput !== void 0) {
		delete item.toolInput;
		item.toolInputOmitted = true;
	}
	return pageFitsNodeTransport(page);
}
function encodeTurnItemCursor(turnCursor, itemId) {
	return TURN_ITEM_CURSOR_PREFIX + Buffer.from(JSON.stringify([turnCursor, itemId])).toString("base64url");
}
function decodeTurnItemCursor(cursor) {
	if (!cursor?.startsWith(TURN_ITEM_CURSOR_PREFIX)) return { turnCursor: cursor };
	let value;
	try {
		value = JSON.parse(Buffer.from(cursor.slice(10), "base64url").toString());
	} catch {
		throw new CatalogParamsError("invalid Codex chat history item cursor");
	}
	if (!Array.isArray(value) || value.length !== 2 || typeof value[0] !== "string" || !value[0] || typeof value[1] !== "string" || !value[1]) throw new CatalogParamsError("invalid Codex chat history item cursor");
	return {
		turnCursor: value[0],
		itemId: value[1]
	};
}
/** Legacy stores expose only turn cursors; an item identity preserves paging across appends. */
async function readLegacyCodexTranscriptPage(readTurns, request) {
	const { turnCursor, itemId } = decodeTurnItemCursor(request.cursor);
	const page = parseTranscriptPage(await readTurns({
		threadId: request.threadId,
		limit: 1,
		sortDirection: "desc",
		itemsView: "full",
		...turnCursor ? { cursor: turnCursor } : {}
	}));
	const source = page.data.flatMap(({ items }) => items.toReversed().map((item) => ({ item })));
	const anchorIndex = itemId ? source.findIndex(({ item }) => item.id === itemId) : -1;
	if (itemId && anchorIndex < 0) throw new CatalogParamsError("Codex chat history changed; refresh the session before loading older items");
	const remaining = source.slice(anchorIndex + 1);
	const items = projectTranscriptPage(remaining.slice(0, request.limit), request.limit);
	const result = () => {
		const lastSource = remaining[items.length - 1];
		const partial = lastSource !== void 0 && items.length < remaining.length;
		const nativeCursor = partial ? page.backwardsCursor : page.nextCursor;
		const cursor = nativeCursor ? partial ? encodeTurnItemCursor(nativeCursor, lastSource.item.id) : nativeCursor : void 0;
		if (partial && !cursor) throw new Error("Codex app-server did not provide a chat history continuation anchor");
		return {
			items,
			...cursor ? { nextCursor: cursor } : {}
		};
	};
	let bounded = result();
	while (!pageFitsNodeTransport(bounded)) {
		if (items.length <= 1) throw new Error("Codex chat history item exceeds the safe response size");
		items.pop();
		bounded = result();
	}
	return bounded;
}
/** Uses the native store's item cursor whenever that store supports item history. */
async function readCodexCatalogTranscriptPage(control, request) {
	if ((await control.requireEligibleThread(request.threadId)).historyMode !== "paginated") return readLegacyCodexTranscriptPage((params) => control.listTurnPage(params), request);
	let limit = request.limit;
	for (;;) {
		const page = await control.listItemPage({
			threadId: request.threadId,
			limit,
			sortDirection: "desc",
			...request.cursor ? { cursor: request.cursor } : {}
		});
		const nextCursor = readControlCursor(page.nextCursor, "chat history next response");
		const items = projectTranscriptPage(page.data, limit);
		const result = {
			items,
			...nextCursor ? { nextCursor } : {}
		};
		const fittingCount = items.length - (pageFitsNodeTransport(result) ? 0 : 1);
		if (fittingCount === page.data.length) return result;
		if (fittingCount < 1) throw new Error("Codex chat history item exceeds the safe response size");
		limit = fittingCount;
	}
}
export { parseCodexCatalogTranscriptPage, projectCodexCatalogTranscriptPageForDisplay, readCodexCatalogTranscriptPage, readLegacyCodexTranscriptPage };
