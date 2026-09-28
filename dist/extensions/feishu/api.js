import { a as parseFeishuTargetId, i as parseFeishuDirectConversationId, n as buildFeishuModelOverrideParentCandidates, r as parseFeishuConversationId, t as buildFeishuConversationId } from "./.setup/conversation-id-H-lUayji.mjs";
import { a as setFeishuNamedAccountEnabled, i as feishuSetupAdapter, n as feishuSetupWizard, r as runFeishuLogin, t as feishuPlugin } from "./.setup/channel-DsndN1sp.mjs";
import { J as toolExecutionErrorResult, K as registerFeishuDriveTools, Q as resolveFeishuToolAccount, X as createFeishuToolClient, Y as unknownToolActionResult, Z as resolveAnyEnabledFeishuToolsConfig, dt as chunkFeishuMarkdown, mt as parseFeishuMarkdown, q as feishuExternalToolResult } from "./.setup/reply-delivery-result-CRIHpSze.mjs";
import { t as getFeishuRuntime } from "./.setup/runtime-C5JxBWZp.mjs";
import { f as resolveConfiguredHttpTimeoutMs, r as createFeishuClient } from "./.setup/client-DCwNVFZg.mjs";
import { o as registerFeishuChatTools } from "./.setup/chat-BlvUjdN9.mjs";
import { n as getFeishuThreadBindingManager, t as createFeishuThreadBindingManager } from "./.setup/thread-bindings-BiL1wGqK.mjs";
import { n as handleFeishuSubagentEnded, t as handleFeishuSubagentDeliveryTarget } from "./.setup/subagent-hooks-BBfF1hZk.mjs";
import { optionalPositiveIntegerSchema } from "openclaw/plugin-sdk/channel-actions";
import { formatErrorMessage } from "openclaw/plugin-sdk/error-runtime";
import { normalizeLowercaseStringOrEmpty, normalizeOptionalString, readStringValue, uniqueStrings } from "openclaw/plugin-sdk/string-coerce-runtime";
import { existsSync } from "node:fs";
import { homedir } from "node:os";
import { basename, isAbsolute, resolve } from "node:path";
import { readPositiveIntegerParam } from "openclaw/plugin-sdk/param-readers";
import { Type } from "typebox";
import { canonicalizeBase64, estimateBase64DecodedBytes, extensionForMime } from "openclaw/plugin-sdk/media-runtime";
import { createClackPrompter } from "openclaw/plugin-sdk/setup-runtime";
//#region extensions/feishu/src/doc-schema.ts
const tableCreationProperties = {
	doc_token: Type.String({ description: "Document token" }),
	parent_block_id: Type.Optional(Type.String({ description: "Parent block ID (default: document root)" })),
	row_size: Type.Integer({
		description: "Table row count",
		minimum: 1
	}),
	column_size: Type.Integer({
		description: "Table column count",
		minimum: 1
	}),
	column_width: Type.Optional(Type.Array(Type.Number({ minimum: 1 }), { description: "Column widths in px (length should match column_size)" }))
};
const FeishuDocSchema = Type.Union([
	Type.Object({
		action: Type.Literal("read"),
		doc_token: Type.String({ description: "Document token (extract from URL /docx/XXX)" })
	}),
	Type.Object({
		action: Type.Literal("write"),
		doc_token: Type.String({ description: "Document token" }),
		content: Type.String({ description: "Markdown content to write (replaces entire document content)" })
	}),
	Type.Object({
		action: Type.Literal("append"),
		doc_token: Type.String({ description: "Document token" }),
		content: Type.String({ description: "Markdown content to append to end of document" })
	}),
	Type.Object({
		action: Type.Literal("insert"),
		doc_token: Type.String({ description: "Document token" }),
		content: Type.String({ description: "Markdown content to insert" }),
		after_block_id: Type.String({ description: "Insert content after this block ID. Use list_blocks to find block IDs." })
	}),
	Type.Object({
		action: Type.Literal("create"),
		title: Type.String({ description: "Document title" }),
		folder_token: Type.Optional(Type.String({ description: "Target folder token (optional)" })),
		grant_to_requester: Type.Optional(Type.Boolean({ description: "Grant edit permission to the trusted requesting Feishu user from runtime context (default: true)." }))
	}),
	Type.Object({
		action: Type.Literal("list_blocks"),
		doc_token: Type.String({ description: "Document token" })
	}),
	Type.Object({
		action: Type.Literal("get_block"),
		doc_token: Type.String({ description: "Document token" }),
		block_id: Type.String({ description: "Block ID (from list_blocks)" })
	}),
	Type.Object({
		action: Type.Literal("update_block"),
		doc_token: Type.String({ description: "Document token" }),
		block_id: Type.String({ description: "Block ID (from list_blocks)" }),
		content: Type.String({ description: "New text content" })
	}),
	Type.Object({
		action: Type.Literal("delete_block"),
		doc_token: Type.String({ description: "Document token" }),
		block_id: Type.String({ description: "Block ID" })
	}),
	Type.Object({
		action: Type.Literal("create_table"),
		...tableCreationProperties
	}),
	Type.Object({
		action: Type.Literal("write_table_cells"),
		doc_token: Type.String({ description: "Document token" }),
		table_block_id: Type.String({ description: "Table block ID" }),
		values: Type.Array(Type.Array(Type.String()), {
			description: "2D matrix values[row][col] to write into table cells",
			minItems: 1
		})
	}),
	Type.Object({
		action: Type.Literal("create_table_with_values"),
		...tableCreationProperties,
		values: Type.Array(Type.Array(Type.String()), {
			description: "2D matrix values[row][col] to write into table cells",
			minItems: 1
		})
	}),
	Type.Object({
		action: Type.Literal("insert_table_row"),
		doc_token: Type.String({ description: "Document token" }),
		block_id: Type.String({ description: "Table block ID" }),
		row_index: Type.Optional(Type.Number({ description: "Row index to insert at (-1 for end, default: -1)" }))
	}),
	Type.Object({
		action: Type.Literal("insert_table_column"),
		doc_token: Type.String({ description: "Document token" }),
		block_id: Type.String({ description: "Table block ID" }),
		column_index: Type.Optional(Type.Number({ description: "Column index to insert at (-1 for end, default: -1)" }))
	}),
	Type.Object({
		action: Type.Literal("delete_table_rows"),
		doc_token: Type.String({ description: "Document token" }),
		block_id: Type.String({ description: "Table block ID" }),
		row_start: Type.Number({ description: "Start row index (0-based)" }),
		row_count: Type.Optional(Type.Number({ description: "Number of rows to delete (default: 1)" }))
	}),
	Type.Object({
		action: Type.Literal("delete_table_columns"),
		doc_token: Type.String({ description: "Document token" }),
		block_id: Type.String({ description: "Table block ID" }),
		column_start: Type.Number({ description: "Start column index (0-based)" }),
		column_count: Type.Optional(Type.Number({ description: "Number of columns to delete (default: 1)" }))
	}),
	Type.Object({
		action: Type.Literal("merge_table_cells"),
		doc_token: Type.String({ description: "Document token" }),
		block_id: Type.String({ description: "Table block ID" }),
		row_start: Type.Number({ description: "Start row index" }),
		row_end: Type.Number({ description: "End row index (exclusive)" }),
		column_start: Type.Number({ description: "Start column index" }),
		column_end: Type.Number({ description: "End column index (exclusive)" })
	}),
	Type.Object({
		action: Type.Literal("upload_image"),
		doc_token: Type.String({ description: "Document token" }),
		url: Type.Optional(Type.String({ description: "Remote image URL (http/https)" })),
		file_path: Type.Optional(Type.String({ description: "Local image file path" })),
		image: Type.Optional(Type.String({ description: "Image as data URI (data:image/png;base64,...) or plain base64 string. Use instead of url/file_path for DALL-E outputs, canvas screenshots, etc." })),
		parent_block_id: Type.Optional(Type.String({ description: "Parent block ID (default: document root)" })),
		filename: Type.Optional(Type.String({ description: "Optional filename override" })),
		index: Type.Optional(Type.Integer({
			minimum: 0,
			description: "Insert position (0-based index among siblings). Omit to append."
		}))
	}),
	Type.Object({
		action: Type.Literal("upload_file"),
		doc_token: Type.String({ description: "Document token" }),
		url: Type.Optional(Type.String({ description: "Remote file URL (http/https)" })),
		file_path: Type.Optional(Type.String({ description: "Local file path" })),
		parent_block_id: Type.Optional(Type.String({ description: "Parent block ID (default: document root)" })),
		filename: Type.Optional(Type.String({ description: "Optional filename override" }))
	}),
	Type.Object({
		action: Type.Literal("color_text"),
		doc_token: Type.String({ description: "Document token" }),
		block_id: Type.String({ description: "Text block ID to update" }),
		content: Type.String({ description: "Text with color markup. Tags: [red], [green], [blue], [orange], [yellow], [purple], [grey], [bold], [bg:yellow]. Example: \"Revenue [green]+15%[/green] YoY\"" })
	})
]);
//#endregion
//#region extensions/feishu/src/docx-table-ops.ts
const MIN_COLUMN_WIDTH = 50;
const MAX_COLUMN_WIDTH = 400;
const DEFAULT_TABLE_WIDTH = 730;
function normalizeChildBlockIds(children) {
	if (Array.isArray(children)) return children;
	return typeof children === "string" ? [children] : [];
}
function omitParentId(block) {
	const cleanBlock = { ...block };
	delete cleanBlock.parent_id;
	return cleanBlock;
}
function createDescendantTable(table, adaptiveWidths) {
	const { row_size, column_size } = table.property || {};
	return { property: {
		row_size,
		column_size,
		...adaptiveWidths?.length ? { column_width: adaptiveWidths } : {}
	} };
}
function calculateAdaptiveColumnWidths(blocks, tableBlockId, getBlockMap) {
	const tableBlock = blocks.find((b) => b.block_id === tableBlockId && b.block_type === 31);
	if (!tableBlock?.table?.property) return [];
	const { row_size, column_size, column_width: originalWidths } = tableBlock.table.property;
	if (!row_size || !column_size) return [];
	const totalWidth = originalWidths && originalWidths.length > 0 ? originalWidths.reduce((a, b) => a + b, 0) : DEFAULT_TABLE_WIDTH;
	const cellIds = normalizeChildBlockIds(tableBlock.children);
	const blockMap = getBlockMap();
	function getCellText(cellId) {
		const cell = blockMap.get(cellId);
		let text = "";
		const childIds = normalizeChildBlockIds(cell?.children);
		for (const childId of childIds) {
			const child = blockMap.get(childId);
			if (child?.text?.elements) {
				for (const elem of child.text.elements) if (elem.text_run?.content) text += elem.text_run.content;
			}
		}
		return text;
	}
	function getWeightedLength(text) {
		let length = 0;
		for (let index = 0; index < text.length; index += 1) {
			const code = text.charCodeAt(index);
			length += code > 255 ? 2 : 1;
			if (code >= 55296 && code <= 56319) {
				const next = text.charCodeAt(index + 1);
				if (next >= 56320 && next <= 57343) index += 1;
			}
		}
		return length;
	}
	const maxLengths = Array.from({ length: column_size }, () => 0);
	for (let row = 0; row < row_size; row++) for (let col = 0; col < column_size; col++) {
		const cellId = cellIds[row * column_size + col];
		if (cellId) {
			const length = getWeightedLength(getCellText(cellId));
			maxLengths[col] = Math.max(maxLengths[col] ?? 0, length);
		}
	}
	const totalLength = maxLengths.reduce((a, b) => a + b, 0);
	if (totalLength === 0) {
		const equalWidth = Math.max(MIN_COLUMN_WIDTH, Math.min(MAX_COLUMN_WIDTH, Math.floor(totalWidth / column_size)));
		return Array.from({ length: column_size }, () => equalWidth);
	}
	let widths = maxLengths.map((len) => {
		const proportion = len / totalLength;
		return Math.round(proportion * totalWidth);
	});
	widths = widths.map((w) => Math.max(MIN_COLUMN_WIDTH, Math.min(MAX_COLUMN_WIDTH, w)));
	let remaining = totalWidth - widths.reduce((a, b) => a + b, 0);
	while (remaining > 0) {
		const growable = widths.map((w, i) => w < MAX_COLUMN_WIDTH ? i : -1).filter((i) => i >= 0);
		if (growable.length === 0) break;
		const perColumn = Math.floor(remaining / growable.length);
		if (perColumn === 0) break;
		for (const i of growable) {
			const width = widths[i];
			if (width === void 0) continue;
			const add = Math.min(perColumn, MAX_COLUMN_WIDTH - width);
			widths[i] = width + add;
			remaining -= add;
		}
	}
	return widths;
}
/**
* Clean blocks for Descendant API with adaptive column widths.
*
* - Removes parent_id from all blocks
* - Fixes children type (string → array) for TableCell blocks
* - Removes merge_info (read-only, causes API error)
* - Calculates and applies adaptive column_width for tables
*
* @param blocks - Array of blocks from Convert API
* @returns Cleaned blocks ready for Descendant API
*/
function cleanBlocksForDescendant(blocks) {
	let blockMap;
	const getBlockMap = () => {
		if (!blockMap) {
			blockMap = /* @__PURE__ */ new Map();
			for (const block of blocks) if (block.block_id) blockMap.set(block.block_id, block);
		}
		return blockMap;
	};
	const tableWidths = /* @__PURE__ */ new Map();
	for (const block of blocks) if (block.block_type === 31 && block.block_id) {
		const widths = calculateAdaptiveColumnWidths(blocks, block.block_id, getBlockMap);
		tableWidths.set(block.block_id, widths);
	}
	return blocks.map((block) => {
		const cleanBlock = omitParentId(block);
		if (cleanBlock.block_type === 32 && typeof cleanBlock.children === "string") cleanBlock.children = [cleanBlock.children];
		if (cleanBlock.block_type === 31 && cleanBlock.table) {
			const adaptiveWidths = block.block_id ? tableWidths.get(block.block_id) : void 0;
			cleanBlock.table = createDescendantTable(cleanBlock.table, adaptiveWidths);
		}
		return cleanBlock;
	});
}
async function patchTable(client, params) {
	const { doc_token, block_id } = params;
	let data;
	const counts = {};
	switch (params.action) {
		case "insert_table_row": {
			const { row_index = -1 } = params;
			data = { insert_table_row: { row_index } };
			break;
		}
		case "insert_table_column": {
			const { column_index = -1 } = params;
			data = { insert_table_column: { column_index } };
			break;
		}
		case "delete_table_rows": {
			const { row_start, row_count = 1 } = params;
			data = { delete_table_rows: {
				row_start_index: row_start,
				row_end_index: row_start + row_count
			} };
			counts.rows_deleted = row_count;
			break;
		}
		case "delete_table_columns": {
			const { column_start, column_count = 1 } = params;
			data = { delete_table_columns: {
				column_start_index: column_start,
				column_end_index: column_start + column_count
			} };
			counts.columns_deleted = column_count;
			break;
		}
		case "merge_table_cells": {
			const { row_start, row_end, column_start, column_end } = params;
			data = { merge_table_cells: {
				row_start_index: row_start,
				row_end_index: row_end,
				column_start_index: column_start,
				column_end_index: column_end
			} };
			break;
		}
	}
	const res = await client.docx.documentBlock.patch({
		path: {
			document_id: doc_token,
			block_id
		},
		data
	});
	if (res.code !== 0) throw new Error(res.msg);
	return {
		success: true,
		...counts,
		block: res.data?.block
	};
}
//#endregion
//#region extensions/feishu/src/docx-batch-insert.ts
const BATCH_SIZE = 1e3;
function normalizeChildIds$1(children) {
	if (Array.isArray(children)) return children;
	const child = readStringValue(children);
	return child ? [child] : void 0;
}
function toDescendantBlock$1(block) {
	const children = normalizeChildIds$1(block.children);
	return {
		...block,
		...children ? { children } : {}
	};
}
/**
* Collect all descendant blocks for a given first-level block ID.
* Recursively traverses the block tree to gather all children.
*/
function collectDescendants(blockMap, rootId) {
	const result = [];
	const visited = /* @__PURE__ */ new Set();
	function collect(blockId) {
		if (visited.has(blockId)) return;
		visited.add(blockId);
		const block = blockMap.get(blockId);
		if (!block) return;
		result.push(block);
		const children = block.children;
		if (Array.isArray(children)) for (const childId of children) collect(childId);
		else if (typeof children === "string") collect(children);
	}
	collect(rootId);
	return result;
}
/**
* Insert a single batch of blocks using Descendant API.
*
* @param parentBlockId - Parent block to insert into (defaults to docToken)
* @param index - Position within parent's children (-1 = end)
*/
async function insertBatch(client, docToken, blocks, firstLevelBlockIds, parentBlockId = docToken, index = -1) {
	const descendants = cleanBlocksForDescendant(blocks);
	if (descendants.length === 0) return [];
	const res = await client.docx.documentBlockDescendant.create({
		path: {
			document_id: docToken,
			block_id: parentBlockId
		},
		data: {
			children_id: firstLevelBlockIds,
			descendants: descendants.map(toDescendantBlock$1),
			index
		}
	});
	if (res.code !== 0) throw new Error(`${res.msg} (code: ${res.code})`);
	return res.data?.children ?? [];
}
/**
* Insert blocks in batches for large documents (>1000 blocks).
*
* Batches are split to ensure BOTH children_id AND descendants
* arrays stay under the 1000 block API limit.
*
* @param client - Feishu API client
* @param docToken - Document ID
* @param blocks - All blocks from Convert API
* @param firstLevelBlockIds - IDs of top-level blocks to insert
* @param logger - Optional logger for progress updates
* @param parentBlockId - Parent block to insert into (defaults to docToken = document root)
* @param startIndex - Starting position within parent (-1 = end). For multi-batch inserts,
*   each batch advances this by the number of first-level IDs inserted so far.
* @returns Inserted children blocks and any skipped block IDs
*/
async function insertBlocksInBatches(client, docToken, blocks, firstLevelBlockIds, logger, parentBlockId = docToken, startIndex = -1) {
	const allChildren = [];
	const batches = [];
	let currentBatch = {
		firstLevelIds: [],
		blocks: []
	};
	const usedBlockIds = /* @__PURE__ */ new Set();
	const blockMap = /* @__PURE__ */ new Map();
	for (const block of blocks) if (block.block_id) blockMap.set(block.block_id, block);
	for (const firstLevelId of firstLevelBlockIds) {
		const newBlocks = collectDescendants(blockMap, firstLevelId).filter((b) => b.block_id && !usedBlockIds.has(b.block_id));
		if (newBlocks.length > 1e3) throw new Error(`Block "${firstLevelId}" has ${newBlocks.length} descendants, which exceeds the Feishu API limit of ${BATCH_SIZE} blocks per request. Please split the content into smaller sections.`);
		if (currentBatch.blocks.length + newBlocks.length > 1e3 && currentBatch.blocks.length > 0) {
			batches.push(currentBatch);
			currentBatch = {
				firstLevelIds: [],
				blocks: []
			};
		}
		currentBatch.firstLevelIds.push(firstLevelId);
		for (const block of newBlocks) {
			currentBatch.blocks.push(block);
			if (block.block_id) usedBlockIds.add(block.block_id);
		}
	}
	if (currentBatch.blocks.length > 0) batches.push(currentBatch);
	let currentIndex = startIndex;
	for (const [i, batch] of batches.entries()) {
		logger?.info?.(`feishu_doc: Inserting batch ${i + 1}/${batches.length} (${batch.blocks.length} blocks)...`);
		const children = await insertBatch(client, docToken, batch.blocks, batch.firstLevelIds, parentBlockId, currentIndex);
		allChildren.push(...children);
		if (currentIndex !== -1) currentIndex += batch.firstLevelIds.length;
	}
	return {
		children: allChildren,
		skipped: []
	};
}
//#endregion
//#region extensions/feishu/src/docx-color-text.ts
const TEXT_COLOR = {
	red: 1,
	orange: 2,
	yellow: 3,
	green: 4,
	blue: 5,
	purple: 6,
	grey: 7,
	gray: 7
};
const BACKGROUND_COLOR = {
	red: 1,
	orange: 2,
	yellow: 3,
	green: 4,
	blue: 5,
	purple: 6,
	grey: 7,
	gray: 7
};
/**
* Parse color markup into segments.
*
* Supports:
*   [red]text[/red]               → red text
*   [bg:yellow]text[/bg]          → yellow background
*   [bold]text[/bold]             → bold
*   [green bold]text[/green]      → green + bold
*/
function parseColorMarkup(content) {
	const segments = [];
	const KNOWN = "(?:bg:[a-z]+|bold|red|orange|yellow|green|blue|purple|gr[ae]y)";
	const tagPattern = new RegExp(`\\[(${KNOWN}(?:\\s+${KNOWN})*)\\](.*?)\\[\\/(?:[^\\]]+)\\]|([^[]+|\\[)`, "gis");
	let match;
	while ((match = tagPattern.exec(content)) !== null) if (match[3] !== void 0) {
		if (match[3]) segments.push({ text: match[3] });
	} else {
		const tagStr = normalizeLowercaseStringOrEmpty(match[1]);
		const text = match[2];
		if (text === void 0) continue;
		const tags = tagStr.split(/\s+/);
		const segment = { text };
		for (const tag of tags) if (tag.startsWith("bg:")) {
			const color = tag.slice(3);
			if (BACKGROUND_COLOR[color]) segment.bgColor = BACKGROUND_COLOR[color];
		} else if (tag === "bold") segment.bold = true;
		else if (TEXT_COLOR[tag]) segment.textColor = TEXT_COLOR[tag];
		if (text) segments.push(segment);
	}
	return segments;
}
/**
* Update a text block with colored segments.
*/
async function updateColorText(client, docToken, blockId, content) {
	const segments = parseColorMarkup(content);
	const elements = segments.map((seg) => ({ text_run: {
		content: seg.text,
		text_element_style: {
			...seg.textColor && { text_color: seg.textColor },
			...seg.bgColor && { background_color: seg.bgColor },
			...seg.bold && { bold: true }
		}
	} }));
	const res = await client.docx.documentBlock.patch({
		path: {
			document_id: docToken,
			block_id: blockId
		},
		data: { update_text_elements: { elements } }
	});
	if (res.code !== 0) throw new Error(res.msg);
	return {
		success: true,
		segments: segments.length,
		block: res.data?.block
	};
}
//#endregion
//#region extensions/feishu/src/docx-markdown.ts
const MAX_BREAK_PROBES = 32;
const STABLE_LINE_CONTAINER_TYPES = /* @__PURE__ */ new Set([
	"list",
	"blockquote",
	"code"
]);
function visitMarkdown(root, visitor) {
	const pending = [root];
	while (pending.length > 0) {
		const node = pending.pop();
		if (!node) continue;
		visitor(node);
		if (!node.children) continue;
		for (let index = node.children.length - 1; index >= 0; index -= 1) {
			const child = node.children[index];
			if (child) pending.push(child);
		}
	}
}
function resolveRemoteImageUrl(value) {
	if (!value) return;
	try {
		const url = new URL(value);
		return url.protocol === "http:" || url.protocol === "https:" ? value : void 0;
	} catch {
		return;
	}
}
function collectMarkdownImages(root) {
	const definitions = /* @__PURE__ */ new Map();
	const imageNodes = [];
	visitMarkdown(root, (node) => {
		if (node.type === "definition" && node.identifier && node.url) {
			if (!definitions.has(node.identifier)) definitions.set(node.identifier, node.url);
		} else if (node.type === "image" || node.type === "imageReference") imageNodes.push(node);
	});
	return imageNodes.map((node) => ({ url: resolveRemoteImageUrl(node.type === "image" ? node.url : node.identifier ? definitions.get(node.identifier) : void 0) }));
}
function splitSourceAtOffsets(source, offsets) {
	const chunks = [];
	let start = 0;
	for (const offset of offsets) {
		if (offset <= start || offset >= source.length) continue;
		chunks.push(source.slice(start, offset));
		start = offset;
	}
	chunks.push(source.slice(start));
	return chunks;
}
function headingOffsets(source, root) {
	const offsets = [];
	for (const node of root.children ?? []) {
		if (node.type !== "heading" || node.depth === void 0 || node.depth > 2) continue;
		const offset = node.position?.start.offset;
		if (offset !== void 0 && source[offset] === "#") offsets.push(offset);
	}
	return offsets;
}
function blockBreakOffsets(root) {
	const offsets = [];
	for (const block of root.children ?? []) {
		const blockStart = block.position?.start.offset;
		if (blockStart !== void 0 && blockStart > 0) offsets.push(blockStart);
	}
	return offsets;
}
function paragraphBreakOffsets(source, root) {
	const offsets = [];
	for (const block of root.children ?? []) {
		if (block.type !== "paragraph") continue;
		for (const child of block.children ?? []) {
			if (child.type !== "text") continue;
			const start = child.position?.start.offset;
			const end = child.position?.end.offset;
			if (start === void 0 || end === void 0) continue;
			for (let offset = start; offset < end; offset += 1) {
				const char = source[offset];
				if (char === " " || char === "	" || char === "\n" || char === "\r") offsets.push(offset + 1);
			}
		}
	}
	return offsets;
}
function lineBreakOffsets(source) {
	const offsets = [];
	for (let offset = 0; offset < source.length; offset += 1) if (source[offset] === "\n" && offset + 1 < source.length) offsets.push(offset + 1);
	return offsets;
}
function nearestOffset(offsets, target, sourceLength) {
	return offsets.filter((offset) => offset > 0 && offset < sourceLength).toSorted((left, right) => Math.abs(left - target) - Math.abs(right - target) || left - right);
}
function isStableParagraphBreak(source, offset) {
	const before = parseFeishuMarkdown(source.slice(0, offset)).children?.at(-1);
	const after = parseFeishuMarkdown(source.slice(offset)).children?.[0];
	return before?.type === "paragraph" && after?.type === "paragraph";
}
function isStableContainerBreak(source, offset, containerType) {
	const before = parseFeishuMarkdown(source.slice(0, offset)).children;
	const after = parseFeishuMarkdown(source.slice(offset)).children;
	return before?.length === 1 && after?.length === 1 && before[0]?.type === containerType && after[0]?.type === containerType;
}
function splitTableAtRow(source, root, target) {
	const table = root.children?.length === 1 ? root.children[0] : void 0;
	if (table?.type !== "table") return;
	const rows = table.children ?? [];
	const firstBodyOffset = rows[1]?.position?.start.offset;
	const splitOffset = nearestOffset(rows.slice(2).map((row) => row.position?.start.offset).filter((offset) => offset !== void 0), target, source.length)[0];
	if (firstBodyOffset === void 0 || splitOffset === void 0) return;
	const tableStart = table.position?.start.offset ?? 0;
	const repeatedHeader = source.slice(tableStart, firstBodyOffset);
	const chunks = [source.slice(0, splitOffset), `${repeatedHeader}${source.slice(splitOffset)}`];
	if (chunks.every((chunk) => parseFeishuMarkdown(chunk).children?.[0]?.type === "table")) return chunks;
}
function isFencedCodeSource(source) {
	const firstLineEnd = source.indexOf("\n");
	const firstLine = source.slice(0, firstLineEnd === -1 ? source.length : firstLineEnd);
	let indent = 0;
	while (indent < firstLine.length && firstLine[indent] === " ") indent += 1;
	if (indent > 3) return false;
	const marker = firstLine.slice(indent);
	return marker.startsWith("```") || marker.startsWith("~~~");
}
function createDocxMarkdownChunk(markdown) {
	return {
		markdown,
		images: collectMarkdownImages(parseFeishuMarkdown(markdown))
	};
}
function createDocxMarkdownPlan(markdown) {
	const root = parseFeishuMarkdown(markdown);
	return { chunks: splitSourceAtOffsets(markdown, headingOffsets(markdown, root)).map((chunk) => chunk === markdown ? {
		markdown,
		images: collectMarkdownImages(root)
	} : createDocxMarkdownChunk(chunk)) };
}
function splitDocxMarkdownBySize(markdown, maxChars) {
	if (markdown.length <= maxChars) return [markdown];
	const root = parseFeishuMarkdown(markdown);
	const target = Math.min(markdown.length - 1, Math.max(1, maxChars));
	const splitOffset = nearestOffset(blockBreakOffsets(root), target, markdown.length)[0];
	if (splitOffset !== void 0) return [markdown.slice(0, splitOffset), markdown.slice(splitOffset)];
	const paragraphOffset = nearestOffset(paragraphBreakOffsets(markdown, root), target, markdown.length).slice(0, MAX_BREAK_PROBES).find((offset) => isStableParagraphBreak(markdown, offset));
	if (paragraphOffset !== void 0) return [markdown.slice(0, paragraphOffset), markdown.slice(paragraphOffset)];
	if (root.children?.length === 1 && root.children[0]?.type === "code" && isFencedCodeSource(markdown)) return chunkFeishuMarkdown(markdown, maxChars);
	const tableChunks = splitTableAtRow(markdown, root, target);
	if (tableChunks) return tableChunks;
	const containerType = root.children?.length === 1 ? root.children[0]?.type : void 0;
	if (containerType && STABLE_LINE_CONTAINER_TYPES.has(containerType)) {
		const containerOffset = nearestOffset(lineBreakOffsets(markdown), target, markdown.length).slice(0, MAX_BREAK_PROBES).find((offset) => isStableContainerBreak(markdown, offset, containerType));
		if (containerOffset !== void 0) return [markdown.slice(0, containerOffset), markdown.slice(containerOffset)];
	}
	return [markdown];
}
//#endregion
//#region extensions/feishu/src/docx-upload-input.ts
function decodeBase64Image(params) {
	const estimatedBytes = estimateBase64DecodedBytes(params.payload);
	if (estimatedBytes > params.maxBytes) throw new Error(`${params.oversizedLabel} exceeds limit: estimated ${estimatedBytes} bytes > ${params.maxBytes} bytes`);
	const canonical = canonicalizeBase64(params.payload);
	if (!canonical) throw new Error(params.invalidMessage);
	return Buffer.from(canonical, "base64");
}
function resolveDataUriImage(image, maxBytes, fileName) {
	const commaIndex = image.indexOf(",");
	if (commaIndex === -1) throw new Error("Invalid data URI: missing comma separator.");
	const metadata = image.slice(5, commaIndex).split(";");
	if (!metadata.slice(1).map((value) => value.trim().toLowerCase()).includes("base64")) throw new Error("Invalid data URI: missing ';base64' marker. Expected format: data:image/png;base64,<base64data>");
	const buffer = decodeBase64Image({
		payload: image.slice(commaIndex + 1),
		maxBytes,
		invalidMessage: "Invalid data URI: base64 payload is malformed.",
		oversizedLabel: "Image data URI"
	});
	const mime = metadata[0]?.trim();
	const extension = extensionForMime(mime)?.slice(1) ?? "png";
	return {
		buffer,
		fileName: fileName ?? `image.${extension}`
	};
}
async function resolveLocalUpload(filePath, maxBytes, localRoots, fileName) {
	return {
		buffer: (await getFeishuRuntime().media.loadWebMedia(resolve(filePath), {
			maxBytes,
			optimizeImages: false,
			localRoots
		})).buffer,
		fileName: fileName ?? basename(filePath)
	};
}
function resolveImageLocalPath(image) {
	const candidate = image.startsWith("~") ? `${homedir()}${image.slice(1)}` : image;
	const unambiguousPath = image.startsWith("~") || image.startsWith("./") || image.startsWith("../");
	const absolutePath = isAbsolute(image);
	if (unambiguousPath || absolutePath && existsSync(candidate)) return candidate;
	if (absolutePath) throw new Error(`File not found: "${candidate}". If you intended to pass image binary data, use a data URI instead: data:image/jpeg;base64,...`);
}
async function resolveRemoteUpload(input) {
	const fetched = await getFeishuRuntime().channel.media.readRemoteMediaBuffer({
		url: input.url,
		maxBytes: input.maxBytes,
		...input.remoteReadTimeoutMs !== void 0 ? {
			responseHeaderTimeoutMs: input.remoteReadTimeoutMs,
			readIdleTimeoutMs: input.remoteReadTimeoutMs
		} : {}
	});
	const urlFileName = new URL(input.url).pathname.split("/").pop() || "upload.bin";
	return {
		buffer: fetched.buffer,
		fileName: input.fileName ?? fetched.fileName ?? urlFileName
	};
}
async function resolveDocxUploadInput(input) {
	const sources = [
		input.url && "url",
		input.filePath && "file_path",
		input.image && "image"
	].filter((source) => Boolean(source));
	if (sources.length !== 1) throw new Error(sources.length === 0 ? "Either url, file_path, or image (base64/data URI) must be provided" : `Provide only one upload source; got: ${sources.join(", ")}`);
	if (input.url) return await resolveRemoteUpload({
		...input,
		url: input.url
	});
	if (input.filePath) return await resolveLocalUpload(input.filePath, input.maxBytes, input.localRoots, input.fileName);
	const image = input.image;
	if (!image) throw new Error("Image input must not be empty");
	if (image.startsWith("data:")) return resolveDataUriImage(image, input.maxBytes, input.fileName);
	const localPath = resolveImageLocalPath(image);
	if (localPath) return await resolveLocalUpload(localPath, input.maxBytes, input.localRoots, input.fileName);
	return {
		buffer: decodeBase64Image({
			payload: image,
			maxBytes: input.maxBytes,
			invalidMessage: "Invalid base64: image input is malformed. Use a data URI (data:image/png;base64,...) or a local file path instead.",
			oversizedLabel: "Base64 image"
		}),
		fileName: input.fileName ?? "image.png"
	};
}
//#endregion
//#region extensions/feishu/src/docx.ts
function resolveDocToolLocalRoots(ctx) {
	if (ctx.fsPolicy?.workspaceOnly !== true) return;
	const workspaceDir = ctx.workspaceDir?.trim();
	if (!workspaceDir) return [];
	return [resolve(workspaceDir)];
}
const BLOCK_TYPE_NAMES = {
	1: "Page",
	2: "Text",
	3: "Heading1",
	4: "Heading2",
	5: "Heading3",
	12: "Bullet",
	13: "Ordered",
	14: "Code",
	15: "Quote",
	17: "Todo",
	18: "Bitable",
	21: "Diagram",
	22: "Divider",
	23: "File",
	27: "Image",
	30: "Sheet",
	31: "Table",
	32: "TableCell"
};
const UNSUPPORTED_CREATE_TYPES = /* @__PURE__ */ new Set([31, 32]);
/** Remove block types unsupported by the children insertion API. */
function cleanBlocksForInsert(blocks) {
	const skipped = [];
	return {
		cleaned: blocks.filter((block) => {
			if (UNSUPPORTED_CREATE_TYPES.has(block.block_type)) {
				const typeName = BLOCK_TYPE_NAMES[block.block_type] || `type_${block.block_type}`;
				skipped.push(typeName);
				return false;
			}
			return true;
		}),
		skipped
	};
}
/** Max blocks per documentBlockChildren.create request */
const MAX_CONVERT_RETRY_DEPTH = 8;
function assertFeishuDocApiSuccess(response) {
	if (response.code !== 0) throw new Error(response.msg);
}
async function convertMarkdown(client, markdown) {
	const res = await client.docx.document.convert({ data: {
		content_type: "markdown",
		content: markdown
	} });
	assertFeishuDocApiSuccess(res);
	return {
		blocks: res.data?.blocks ?? [],
		firstLevelBlockIds: res.data?.first_level_block_ids ?? []
	};
}
function normalizeChildIds(children) {
	if (Array.isArray(children)) return children.filter((child) => typeof child === "string");
	if (typeof children === "string") return [children];
	return [];
}
function toCreateChildBlock(block) {
	return block;
}
function toDescendantBlock(block) {
	const children = normalizeChildIds(block.children);
	return {
		...block.block_id ? { block_id: block.block_id } : {},
		...children.length > 0 ? { children } : {},
		...block
	};
}
function normalizeInsertedChildBlocks(children) {
	if (!Array.isArray(children)) return [];
	return children.filter((child) => typeof child === "object" && child !== null);
}
function normalizeConvertedBlockTree(blocks, firstLevelIds) {
	if (blocks.length <= 1) return {
		orderedBlocks: blocks,
		rootIds: blocks.length === 1 && typeof blocks[0]?.block_id === "string" ? [blocks[0].block_id] : []
	};
	const byId = /* @__PURE__ */ new Map();
	const originalOrder = /* @__PURE__ */ new Map();
	for (const [index, block] of blocks.entries()) if (typeof block?.block_id === "string") {
		byId.set(block.block_id, block);
		originalOrder.set(block.block_id, index);
	}
	const childIds = /* @__PURE__ */ new Set();
	for (const block of blocks) for (const childId of normalizeChildIds(block?.children)) childIds.add(childId);
	const inferredTopLevelIds = blocks.filter((block) => {
		const blockId = block?.block_id;
		if (typeof blockId !== "string") return false;
		const parentId = typeof block?.parent_id === "string" ? block.parent_id : "";
		return !childIds.has(blockId) && (!parentId || !byId.has(parentId));
	}).toSorted((a, b) => (originalOrder.get(a.block_id ?? "__missing__") ?? 0) - (originalOrder.get(b.block_id ?? "__missing__") ?? 0)).map((block) => block.block_id).filter((blockId) => typeof blockId === "string");
	const rootIds = (firstLevelIds && firstLevelIds.length > 0 ? firstLevelIds : inferredTopLevelIds).filter((id) => typeof id === "string" && byId.has(id));
	const uniqueRootIds = uniqueStrings(rootIds);
	const orderedBlocks = [];
	const visited = /* @__PURE__ */ new Set();
	const visit = (blockId) => {
		if (!byId.has(blockId) || visited.has(blockId)) return;
		visited.add(blockId);
		const block = byId.get(blockId);
		if (!block) return;
		orderedBlocks.push(block);
		for (const childId of normalizeChildIds(block?.children)) visit(childId);
	};
	for (const rootId of uniqueRootIds) visit(rootId);
	for (const block of blocks) if (typeof block?.block_id === "string") visit(block.block_id);
	else orderedBlocks.push(block);
	return {
		orderedBlocks,
		rootIds: uniqueRootIds
	};
}
async function insertBlocks(client, docToken, blocks, parentBlockId, index) {
	const { cleaned, skipped } = cleanBlocksForInsert(blocks);
	const blockId = parentBlockId ?? docToken;
	if (cleaned.length === 0) return {
		children: [],
		skipped
	};
	const allInserted = [];
	for (const [offset, block] of cleaned.entries()) {
		const res = await client.docx.documentBlockChildren.create({
			path: {
				document_id: docToken,
				block_id: blockId
			},
			data: {
				children: [toCreateChildBlock(block)],
				...index !== void 0 ? { index: index + offset } : {}
			}
		});
		assertFeishuDocApiSuccess(res);
		allInserted.push(...res.data?.children ?? []);
	}
	return {
		children: allInserted,
		skipped
	};
}
async function convertMarkdownWithFallback(client, chunk, depth = 0) {
	try {
		return {
			...await convertMarkdown(client, chunk.markdown),
			images: chunk.images
		};
	} catch (error) {
		if (depth >= MAX_CONVERT_RETRY_DEPTH || chunk.markdown.length < 2) throw error;
		const splitTarget = Math.max(256, Math.floor(chunk.markdown.length / 2));
		const chunks = splitDocxMarkdownBySize(chunk.markdown, splitTarget).map(createDocxMarkdownChunk);
		if (chunks.length <= 1) throw error;
		const blocks = [];
		const firstLevelBlockIds = [];
		const images = [];
		for (const fallbackChunk of chunks) {
			const converted = await convertMarkdownWithFallback(client, fallbackChunk, depth + 1);
			blocks.push(...converted.blocks);
			firstLevelBlockIds.push(...converted.firstLevelBlockIds);
			images.push(...converted.images);
		}
		return {
			blocks,
			firstLevelBlockIds,
			images
		};
	}
}
/** Convert markdown in chunks to avoid document.convert content size limits */
async function chunkedConvertMarkdown(client, chunks) {
	const allBlocks = [];
	const allRootIds = [];
	const allImages = [];
	for (const chunk of chunks) {
		const { blocks, firstLevelBlockIds, images } = await convertMarkdownWithFallback(client, chunk);
		const { orderedBlocks, rootIds } = normalizeConvertedBlockTree(blocks, firstLevelBlockIds);
		allBlocks.push(...orderedBlocks);
		allRootIds.push(...rootIds);
		allImages.push(...images);
	}
	return {
		blocks: allBlocks,
		firstLevelBlockIds: allRootIds,
		images: allImages
	};
}
/**
* Insert blocks using the Descendant API (supports tables, nested lists, large docs).
* Unlike the Children API, this supports block_type 31/32 (Table/TableCell).
*
* @param parentBlockId - Parent block to insert into (defaults to docToken = document root)
* @param index - Position within parent's children (-1 = end, 0 = first)
*/
async function insertBlocksWithDescendant(client, docToken, blocks, firstLevelBlockIds, { parentBlockId = docToken, index = -1 } = {}) {
	const descendants = cleanBlocksForDescendant(blocks);
	if (descendants.length === 0) return { children: [] };
	const res = await client.docx.documentBlockDescendant.create({
		path: {
			document_id: docToken,
			block_id: parentBlockId
		},
		data: {
			children_id: firstLevelBlockIds,
			descendants: descendants.map(toDescendantBlock),
			index
		}
	});
	if (res.code !== 0) throw new Error(`${res.msg} (code: ${res.code})`);
	return { children: res.data?.children ?? [] };
}
async function clearDocumentContent(client, docToken) {
	const existing = await client.docx.documentBlock.list({ path: { document_id: docToken } });
	assertFeishuDocApiSuccess(existing);
	const childIds = existing.data?.items?.filter((b) => b.parent_id === docToken && b.block_type !== 1).map((b) => b.block_id) ?? [];
	if (childIds.length > 0) assertFeishuDocApiSuccess(await client.docx.documentBlockChildren.batchDelete({
		path: {
			document_id: docToken,
			block_id: docToken
		},
		data: {
			start_index: 0,
			end_index: childIds.length
		}
	}));
	return childIds.length;
}
async function uploadImageToDocx(client, blockId, imageBuffer, fileName, docToken) {
	const fileToken = (await client.drive.media.uploadAll({ data: {
		file_name: fileName,
		parent_type: "docx_image",
		parent_node: blockId,
		size: imageBuffer.length,
		file: imageBuffer,
		...docToken ? { extra: JSON.stringify({ drive_route_token: docToken }) } : {}
	} }))?.file_token;
	if (!fileToken) throw new Error("Image upload failed: no file_token returned");
	return fileToken;
}
async function processImages(client, docToken, images, insertedBlocks, maxBytes, imageReadTimeoutMs) {
	if (images.length === 0) return 0;
	const imageBlocks = insertedBlocks.filter((b) => b.block_type === 27);
	let processed = 0;
	for (let i = 0; i < Math.min(images.length, imageBlocks.length); i++) {
		const url = images[i]?.url;
		const blockId = imageBlocks[i]?.block_id;
		if (!url || !blockId) continue;
		try {
			const upload = await resolveDocxUploadInput({
				url,
				maxBytes,
				remoteReadTimeoutMs: imageReadTimeoutMs
			});
			const fileToken = await uploadImageToDocx(client, blockId, upload.buffer, upload.fileName, docToken);
			assertFeishuDocApiSuccess(await client.docx.documentBlock.patch({
				path: {
					document_id: docToken,
					block_id: blockId
				},
				data: { replace_image: { token: fileToken } }
			}));
			processed++;
		} catch (err) {
			console.error(`Failed to process image ${url}:`, err);
		}
	}
	return processed;
}
async function convertInsertAndProcessDocx(params) {
	const { client, docToken, logger, target } = params;
	logger?.info?.("feishu_doc: Converting markdown...");
	const { blocks, firstLevelBlockIds, images } = await chunkedConvertMarkdown(client, createDocxMarkdownPlan(params.markdown).chunks);
	await params.onConverted(blocks.length);
	if (blocks.length === 0) return {
		blocks,
		inserted: [],
		imagesProcessed: 0
	};
	const { orderedBlocks, rootIds } = normalizeConvertedBlockTree(blocks, firstLevelBlockIds);
	logger?.info?.(`feishu_doc: Converted to ${blocks.length} blocks, inserting${target ? ` at index ${target.index}` : ""}...`);
	const { children: inserted } = blocks.length > 1e3 ? await insertBlocksInBatches(client, docToken, orderedBlocks, rootIds, logger, target?.parentBlockId, target?.index) : await insertBlocksWithDescendant(client, docToken, orderedBlocks, rootIds, target);
	const imagesProcessed = await processImages(client, docToken, images, inserted, params.maxBytes, params.imageReadTimeoutMs);
	logger?.info?.(`feishu_doc: Done (${blocks.length} blocks, ${imagesProcessed} images)`);
	return {
		blocks,
		inserted,
		imagesProcessed
	};
}
async function uploadImageBlock(client, docToken, maxBytes, imageReadTimeoutMs, localRoots, url, filePath, parentBlockId, filename, index, imageInput) {
	const upload = await resolveDocxUploadInput({
		url,
		filePath,
		image: imageInput,
		maxBytes,
		localRoots,
		fileName: filename,
		remoteReadTimeoutMs: imageReadTimeoutMs
	});
	const insertRes = await client.docx.documentBlockChildren.create({
		path: {
			document_id: docToken,
			block_id: parentBlockId ?? docToken
		},
		params: { document_revision_id: -1 },
		data: {
			children: [{
				block_type: 27,
				image: {}
			}],
			index: index ?? -1
		}
	});
	if (insertRes.code !== 0) throw new Error(`Failed to create image block: ${insertRes.msg}`);
	const imageBlockId = insertRes.data?.children?.find((b) => b.block_type === 27)?.block_id;
	if (!imageBlockId) throw new Error("Failed to create image block");
	const fileToken = await uploadImageToDocx(client, imageBlockId, upload.buffer, upload.fileName, docToken);
	assertFeishuDocApiSuccess(await client.docx.documentBlock.patch({
		path: {
			document_id: docToken,
			block_id: imageBlockId
		},
		data: { replace_image: { token: fileToken } }
	}));
	return {
		success: true,
		block_id: imageBlockId,
		file_token: fileToken,
		file_name: upload.fileName,
		size: upload.buffer.length
	};
}
async function uploadFileBlock(client, docToken, maxBytes, localRoots, url, filePath, parentBlockId, filename) {
	const blockId = parentBlockId ?? docToken;
	const upload = await resolveDocxUploadInput({
		url,
		filePath,
		maxBytes,
		localRoots,
		fileName: filename
	});
	const converted = await convertMarkdown(client, "[file](https://example.com/placeholder)");
	const { orderedBlocks } = normalizeConvertedBlockTree(converted.blocks, converted.firstLevelBlockIds);
	const { children: inserted } = await insertBlocks(client, docToken, orderedBlocks, blockId);
	const placeholderBlock = inserted[0];
	if (!placeholderBlock?.block_id) throw new Error("Failed to create placeholder block for file upload");
	const parentId = placeholderBlock.parent_id ?? blockId;
	const childrenRes = await client.docx.documentBlockChildren.get({ path: {
		document_id: docToken,
		block_id: parentId
	} });
	assertFeishuDocApiSuccess(childrenRes);
	const placeholderIdx = (childrenRes.data?.items ?? []).findIndex((item) => item.block_id === placeholderBlock.block_id);
	if (placeholderIdx >= 0) assertFeishuDocApiSuccess(await client.docx.documentBlockChildren.batchDelete({
		path: {
			document_id: docToken,
			block_id: parentId
		},
		data: {
			start_index: placeholderIdx,
			end_index: placeholderIdx + 1
		}
	}));
	const fileToken = (await client.drive.media.uploadAll({ data: {
		file_name: upload.fileName,
		parent_type: "docx_file",
		parent_node: docToken,
		size: upload.buffer.length,
		file: upload.buffer
	} }))?.file_token;
	if (!fileToken) throw new Error("File upload failed: no file_token returned");
	return {
		success: true,
		file_token: fileToken,
		file_name: upload.fileName,
		size: upload.buffer.length,
		note: "File uploaded to drive. Use the file_token to reference it. Direct file block creation is not supported by the Feishu API."
	};
}
const STRUCTURED_BLOCK_TYPES = /* @__PURE__ */ new Set([
	14,
	18,
	21,
	23,
	27,
	30,
	31,
	32
]);
async function readDoc(client, docToken) {
	const [contentRes, infoRes, blocksRes] = await Promise.all([
		client.docx.document.rawContent({ path: { document_id: docToken } }),
		client.docx.document.get({ path: { document_id: docToken } }),
		client.docx.documentBlock.list({ path: { document_id: docToken } })
	]);
	assertFeishuDocApiSuccess(contentRes);
	const blocks = blocksRes.data?.items ?? [];
	const blockCounts = {};
	const structuredTypes = [];
	for (const b of blocks) {
		const type = b.block_type ?? 0;
		const name = BLOCK_TYPE_NAMES[type] || `type_${type}`;
		blockCounts[name] = (blockCounts[name] || 0) + 1;
		if (STRUCTURED_BLOCK_TYPES.has(type) && !structuredTypes.includes(name)) structuredTypes.push(name);
	}
	let hint;
	if (structuredTypes.length > 0) hint = `This document contains ${structuredTypes.join(", ")} which are NOT included in the plain text above. Use feishu_doc with action: "list_blocks" to get full content.`;
	return {
		title: infoRes.data?.document?.title,
		content: contentRes.data?.content,
		revision_id: infoRes.data?.document?.revision_id,
		block_count: blocks.length,
		block_types: blockCounts,
		...hint && { hint }
	};
}
async function createDoc(client, title, folderToken, options) {
	const res = await client.docx.document.create({ data: {
		title,
		folder_token: folderToken
	} });
	assertFeishuDocApiSuccess(res);
	const doc = res.data?.document;
	const docToken = doc?.document_id;
	if (!docToken) throw new Error("Document creation succeeded but no document_id was returned");
	const shouldGrantToRequester = options?.grantToRequester !== false;
	const requesterOpenId = options?.requesterOpenId?.trim();
	const requesterPermType = "edit";
	let requesterPermissionAdded = false;
	let requesterPermissionSkippedReason;
	let requesterPermissionError;
	if (shouldGrantToRequester) {
		if (!requesterOpenId) requesterPermissionSkippedReason = "trusted requester identity unavailable";
		else try {
			assertFeishuDocApiSuccess(await client.drive.permissionMember.create({
				path: { token: docToken },
				params: {
					type: "docx",
					need_notification: false
				},
				data: {
					member_type: "openid",
					member_id: requesterOpenId,
					perm: requesterPermType
				}
			}));
			requesterPermissionAdded = true;
		} catch (err) {
			requesterPermissionError = formatErrorMessage(err);
		}
	}
	return {
		document_id: docToken,
		title: doc?.title,
		url: `https://feishu.cn/docx/${docToken}`,
		...shouldGrantToRequester && {
			requester_permission_added: requesterPermissionAdded,
			...requesterOpenId && { requester_open_id: requesterOpenId },
			requester_perm_type: requesterPermType,
			...requesterPermissionSkippedReason && { requester_permission_skipped_reason: requesterPermissionSkippedReason },
			...requesterPermissionError && { requester_permission_error: requesterPermissionError }
		}
	};
}
async function writeDoc(client, docToken, markdown, maxBytes, imageReadTimeoutMs, logger) {
	let deleted = 0;
	const { blocks, imagesProcessed } = await convertInsertAndProcessDocx({
		client,
		docToken,
		markdown,
		maxBytes,
		imageReadTimeoutMs,
		logger,
		onConverted: async () => {
			deleted = await clearDocumentContent(client, docToken);
		}
	});
	return {
		success: true,
		blocks_deleted: deleted,
		blocks_added: blocks.length,
		images_processed: imagesProcessed
	};
}
async function appendDoc(client, docToken, markdown, maxBytes, imageReadTimeoutMs, logger) {
	const { blocks, inserted, imagesProcessed } = await convertInsertAndProcessDocx({
		client,
		docToken,
		markdown,
		maxBytes,
		imageReadTimeoutMs,
		logger,
		onConverted: (blockCount) => {
			if (blockCount === 0) throw new Error("Content is empty");
		}
	});
	return {
		success: true,
		blocks_added: blocks.length,
		images_processed: imagesProcessed,
		block_ids: inserted.map((b) => b.block_id)
	};
}
async function insertDoc(client, docToken, markdown, afterBlockId, maxBytes, imageReadTimeoutMs, logger) {
	const blockInfo = await client.docx.documentBlock.get({ path: {
		document_id: docToken,
		block_id: afterBlockId
	} });
	assertFeishuDocApiSuccess(blockInfo);
	const parentId = blockInfo.data?.block?.parent_id ?? docToken;
	const items = [];
	let pageToken;
	const seenPageTokens = /* @__PURE__ */ new Set();
	while (true) {
		const childrenRes = await client.docx.documentBlockChildren.get({
			path: {
				document_id: docToken,
				block_id: parentId
			},
			params: pageToken ? { page_token: pageToken } : {}
		});
		assertFeishuDocApiSuccess(childrenRes);
		items.push(...childrenRes.data?.items ?? []);
		if (childrenRes.data?.has_more !== true) break;
		const nextPageToken = childrenRes.data.page_token?.trim();
		if (!nextPageToken) throw new Error(`Feishu document children pagination is missing its next page token for parent block "${parentId}"`);
		if (seenPageTokens.has(nextPageToken)) throw new Error(`Feishu document children pagination repeated token for parent block "${parentId}"`);
		seenPageTokens.add(nextPageToken);
		pageToken = nextPageToken;
	}
	const blockIndex = items.findIndex((item) => item.block_id === afterBlockId);
	if (blockIndex === -1) throw new Error(`after_block_id "${afterBlockId}" was not found among the children of parent block "${parentId}". Use list_blocks to verify the block ID.`);
	const { blocks, inserted, imagesProcessed } = await convertInsertAndProcessDocx({
		client,
		docToken,
		markdown,
		maxBytes,
		imageReadTimeoutMs,
		logger,
		target: {
			parentBlockId: parentId,
			index: blockIndex + 1
		},
		onConverted: (blockCount) => {
			if (blockCount === 0) throw new Error("Content is empty");
		}
	});
	return {
		success: true,
		blocks_added: blocks.length,
		images_processed: imagesProcessed,
		block_ids: inserted.map((b) => b.block_id)
	};
}
async function createTable(client, docToken, rowSize, columnSize, parentBlockId, columnWidth) {
	if (columnWidth && columnWidth.length !== columnSize) throw new Error("column_width length must equal column_size");
	const blockId = parentBlockId ?? docToken;
	const res = await client.docx.documentBlockChildren.create({
		path: {
			document_id: docToken,
			block_id: blockId
		},
		data: { children: [{
			block_type: 31,
			table: { property: {
				row_size: rowSize,
				column_size: columnSize,
				...columnWidth && columnWidth.length > 0 ? { column_width: columnWidth } : {}
			} }
		}] }
	});
	assertFeishuDocApiSuccess(res);
	const tableBlock = res.data?.children?.find((b) => b.block_type === 31);
	const cells = normalizeInsertedChildBlocks(tableBlock?.children);
	return {
		success: true,
		table_block_id: tableBlock?.block_id,
		row_size: rowSize,
		column_size: columnSize,
		table_cell_block_ids: cells.map((c) => c.block_id).filter(Boolean),
		raw_children_count: res.data?.children?.length ?? 0
	};
}
async function writeTableCells(client, docToken, tableBlockId, values) {
	if (!values.length || !values[0]?.length) throw new Error("values must be a non-empty 2D array");
	const tableRes = await client.docx.documentBlock.get({ path: {
		document_id: docToken,
		block_id: tableBlockId
	} });
	assertFeishuDocApiSuccess(tableRes);
	const tableBlock = tableRes.data?.block;
	if (tableBlock?.block_type !== 31) throw new Error("table_block_id is not a table block");
	const tableData = tableBlock.table;
	const rows = tableData?.property?.row_size;
	const cols = tableData?.property?.column_size;
	const cellIds = tableData?.cells ?? [];
	if (!rows || !cols || !cellIds.length) throw new Error("Table cell IDs unavailable from table block. Use list_blocks/get_block and pass explicit cell block IDs if needed.");
	const writeRows = Math.min(values.length, rows);
	let written = 0;
	for (let r = 0; r < writeRows; r++) {
		const rowValues = values[r] ?? [];
		const writeCols = Math.min(rowValues.length, cols);
		for (let c = 0; c < writeCols; c++) {
			const cellId = cellIds[r * cols + c];
			if (!cellId) continue;
			const childrenRes = await client.docx.documentBlockChildren.get({ path: {
				document_id: docToken,
				block_id: cellId
			} });
			assertFeishuDocApiSuccess(childrenRes);
			const existingChildren = childrenRes.data?.items ?? [];
			if (existingChildren.length > 0) assertFeishuDocApiSuccess(await client.docx.documentBlockChildren.batchDelete({
				path: {
					document_id: docToken,
					block_id: cellId
				},
				data: {
					start_index: 0,
					end_index: existingChildren.length
				}
			}));
			const converted = await convertMarkdown(client, rowValues[c] ?? "");
			const { orderedBlocks } = normalizeConvertedBlockTree(converted.blocks, converted.firstLevelBlockIds);
			if (orderedBlocks.length > 0) await insertBlocks(client, docToken, orderedBlocks, cellId);
			written++;
		}
	}
	return {
		success: true,
		table_block_id: tableBlockId,
		cells_written: written,
		table_size: {
			rows,
			cols
		}
	};
}
async function createTableWithValues(client, docToken, rowSize, columnSize, values, parentBlockId, columnWidth) {
	const tableBlockId = (await createTable(client, docToken, rowSize, columnSize, parentBlockId, columnWidth)).table_block_id;
	if (!tableBlockId) throw new Error("create_table succeeded but table_block_id is missing");
	return {
		success: true,
		table_block_id: tableBlockId,
		row_size: rowSize,
		column_size: columnSize,
		cells_written: (await writeTableCells(client, docToken, tableBlockId, values)).cells_written
	};
}
async function updateBlock(client, docToken, blockId, content) {
	assertFeishuDocApiSuccess(await client.docx.documentBlock.get({ path: {
		document_id: docToken,
		block_id: blockId
	} }));
	assertFeishuDocApiSuccess(await client.docx.documentBlock.patch({
		path: {
			document_id: docToken,
			block_id: blockId
		},
		data: { update_text_elements: { elements: [{ text_run: { content } }] } }
	}));
	return {
		success: true,
		block_id: blockId
	};
}
async function deleteBlock(client, docToken, blockId) {
	const blockInfo = await client.docx.documentBlock.get({ path: {
		document_id: docToken,
		block_id: blockId
	} });
	assertFeishuDocApiSuccess(blockInfo);
	const parentId = blockInfo.data?.block?.parent_id ?? docToken;
	const children = await client.docx.documentBlockChildren.get({ path: {
		document_id: docToken,
		block_id: parentId
	} });
	assertFeishuDocApiSuccess(children);
	const index = (children.data?.items ?? []).findIndex((item) => item.block_id === blockId);
	if (index === -1) throw new Error("Block not found");
	assertFeishuDocApiSuccess(await client.docx.documentBlockChildren.batchDelete({
		path: {
			document_id: docToken,
			block_id: parentId
		},
		data: {
			start_index: index,
			end_index: index + 1
		}
	}));
	return {
		success: true,
		deleted_block_id: blockId
	};
}
async function listBlocks(client, docToken) {
	const res = await client.docx.documentBlock.list({ path: { document_id: docToken } });
	assertFeishuDocApiSuccess(res);
	return { blocks: res.data?.items ?? [] };
}
async function getBlock(client, docToken, blockId) {
	const res = await client.docx.documentBlock.get({ path: {
		document_id: docToken,
		block_id: blockId
	} });
	assertFeishuDocApiSuccess(res);
	return { block: res.data?.block };
}
async function listAppScopes(client) {
	const res = await client.application.scope.list({});
	assertFeishuDocApiSuccess(res);
	const scopes = res.data?.scopes ?? [];
	const granted = scopes.filter((s) => s.grant_status === 1);
	const pending = scopes.filter((s) => s.grant_status !== 1);
	return {
		granted: granted.map((s) => ({
			name: s.scope_name,
			type: s.scope_type
		})),
		pending: pending.map((s) => ({
			name: s.scope_name,
			type: s.scope_type
		})),
		summary: `${granted.length} granted, ${pending.length} pending`
	};
}
function registerFeishuDocTools(api) {
	api.registerTool((ctx) => {
		const cfg = ctx.runtimeConfig ?? ctx.config ?? api.config;
		if (!cfg || !resolveAnyEnabledFeishuToolsConfig(cfg).doc) return null;
		const defaultAccountId = ctx.agentAccountId;
		const mediaLocalRoots = resolveDocToolLocalRoots(ctx);
		const trustedRequesterOpenId = ctx.messageChannel === "feishu" ? normalizeOptionalString(ctx.requesterSenderId) : void 0;
		return {
			name: "feishu_doc",
			resultContentSource: "network",
			label: "Feishu Doc",
			description: "Feishu document operations. Actions: read, write, append, insert, create, list_blocks, get_block, update_block, delete_block, create_table, write_table_cells, create_table_with_values, insert_table_row, insert_table_column, delete_table_rows, delete_table_columns, merge_table_cells, upload_image, upload_file, color_text",
			parameters: FeishuDocSchema,
			async execute(_toolCallId, params) {
				const p = params;
				try {
					if (p.action === "create" && Object.hasOwn(p, "content")) return feishuExternalToolResult({ error: "Feishu document creation does not support content. Call action \"create\" first, then call action \"write\" with the returned document_id as doc_token." });
					const account = resolveFeishuToolAccount({
						cfg,
						executeParams: p,
						defaultAccountId,
						requiredTool: {
							family: "doc",
							label: "Doc"
						}
					});
					const client = createFeishuClient(account);
					const mediaMaxBytes = (account.config.mediaMaxMb ?? 30) * 1024 * 1024;
					const imageReadTimeoutMs = resolveConfiguredHttpTimeoutMs(account);
					switch (p.action) {
						case "read": return feishuExternalToolResult(await readDoc(client, p.doc_token));
						case "write": return feishuExternalToolResult(await writeDoc(client, p.doc_token, p.content, mediaMaxBytes, imageReadTimeoutMs, api.logger));
						case "append": return feishuExternalToolResult(await appendDoc(client, p.doc_token, p.content, mediaMaxBytes, imageReadTimeoutMs, api.logger));
						case "insert": return feishuExternalToolResult(await insertDoc(client, p.doc_token, p.content, p.after_block_id, mediaMaxBytes, imageReadTimeoutMs, api.logger));
						case "create": return feishuExternalToolResult(await createDoc(client, p.title, p.folder_token, {
							grantToRequester: p.grant_to_requester,
							requesterOpenId: trustedRequesterOpenId
						}));
						case "list_blocks": return feishuExternalToolResult(await listBlocks(client, p.doc_token));
						case "get_block": return feishuExternalToolResult(await getBlock(client, p.doc_token, p.block_id));
						case "update_block": return feishuExternalToolResult(await updateBlock(client, p.doc_token, p.block_id, p.content));
						case "delete_block": return feishuExternalToolResult(await deleteBlock(client, p.doc_token, p.block_id));
						case "create_table": return feishuExternalToolResult(await createTable(client, p.doc_token, p.row_size, p.column_size, p.parent_block_id, p.column_width));
						case "write_table_cells": return feishuExternalToolResult(await writeTableCells(client, p.doc_token, p.table_block_id, p.values));
						case "create_table_with_values": return feishuExternalToolResult(await createTableWithValues(client, p.doc_token, p.row_size, p.column_size, p.values, p.parent_block_id, p.column_width));
						case "upload_image": return feishuExternalToolResult(await uploadImageBlock(client, p.doc_token, mediaMaxBytes, imageReadTimeoutMs, mediaLocalRoots, p.url, p.file_path, p.parent_block_id, p.filename, p.index, p.image));
						case "upload_file": return feishuExternalToolResult(await uploadFileBlock(client, p.doc_token, mediaMaxBytes, mediaLocalRoots, p.url, p.file_path, p.parent_block_id, p.filename));
						case "color_text": return feishuExternalToolResult(await updateColorText(client, p.doc_token, p.block_id, p.content));
						case "insert_table_row":
						case "insert_table_column":
						case "delete_table_rows":
						case "delete_table_columns":
						case "merge_table_cells": return feishuExternalToolResult(await patchTable(client, p));
						default: return feishuExternalToolResult({ error: "Unknown action" });
					}
				} catch (err) {
					return feishuExternalToolResult({ error: formatErrorMessage(err) });
				}
			}
		};
	}, { name: "feishu_doc" });
	api.registerTool((ctx) => {
		const cfg = ctx.runtimeConfig ?? ctx.config ?? api.config;
		if (!cfg || !resolveAnyEnabledFeishuToolsConfig(cfg).scopes) return null;
		return {
			name: "feishu_app_scopes",
			resultContentSource: "network",
			label: "Feishu App Scopes",
			description: "List current app permissions (scopes). Use to debug permission issues or check available capabilities.",
			parameters: Type.Object({}),
			async execute() {
				try {
					const result = await listAppScopes(createFeishuToolClient({
						cfg,
						defaultAccountId: ctx.agentAccountId,
						requiredTool: {
							family: "scopes",
							label: "App Scopes"
						}
					}));
					return feishuExternalToolResult(result);
				} catch (err) {
					return feishuExternalToolResult({ error: formatErrorMessage(err) });
				}
			}
		};
	}, { name: "feishu_app_scopes" });
}
//#endregion
//#region extensions/feishu/src/wiki-schema.ts
const WIKI_SPACE_ID_DESCRIPTION = "Knowledge space ID. Treat as an opaque string and keep it quoted; never pass numeric-looking IDs as numbers.";
const FeishuWikiSchema = Type.Union([
	Type.Object({
		action: Type.Literal("spaces"),
		page_size: optionalPositiveIntegerSchema({
			maximum: 50,
			description: "Page size (1-50, default 50)"
		}),
		page_token: Type.Optional(Type.String({ description: "Pagination token" }))
	}),
	Type.Object({
		action: Type.Literal("nodes"),
		space_id: Type.String({ description: WIKI_SPACE_ID_DESCRIPTION }),
		parent_node_token: Type.Optional(Type.String({ description: "Parent node token (optional, omit for root)" })),
		page_size: optionalPositiveIntegerSchema({
			maximum: 50,
			description: "Page size (1-50, default 50)"
		}),
		page_token: Type.Optional(Type.String({ description: "Pagination token" }))
	}),
	Type.Object({
		action: Type.Literal("get"),
		token: Type.String({ description: "Wiki node token (from URL /wiki/XXX)" })
	}),
	Type.Object({
		action: Type.Literal("search"),
		query: Type.String({ description: "Search query" }),
		space_id: Type.Optional(Type.String({ description: "Limit search to this knowledge space. Treat as an opaque string and keep it quoted; never pass numeric-looking IDs as numbers." }))
	}),
	Type.Object({
		action: Type.Literal("create"),
		space_id: Type.String({ description: WIKI_SPACE_ID_DESCRIPTION }),
		title: Type.String({ description: "Node title" }),
		obj_type: Type.Optional(Type.Union([
			Type.Literal("docx"),
			Type.Literal("sheet"),
			Type.Literal("bitable")
		], { description: "Object type (default: docx)" })),
		parent_node_token: Type.Optional(Type.String({ description: "Parent node token (optional, omit for root)" }))
	}),
	Type.Object({
		action: Type.Literal("move"),
		space_id: Type.String({ description: "Source knowledge space ID. Treat as an opaque string and keep it quoted; never pass numeric-looking IDs as numbers." }),
		node_token: Type.String({ description: "Node token to move" }),
		target_space_id: Type.Optional(Type.String({ description: "Target knowledge space ID (optional, same space if omitted). Treat as an opaque string and keep it quoted; never pass numeric-looking IDs as numbers." })),
		target_parent_token: Type.Optional(Type.String({ description: "Target parent node token (optional, root if omitted)" }))
	}),
	Type.Object({
		action: Type.Literal("rename"),
		space_id: Type.String({ description: WIKI_SPACE_ID_DESCRIPTION }),
		node_token: Type.String({ description: "Node token to rename" }),
		title: Type.String({ description: "New title" })
	})
]);
//#endregion
//#region extensions/feishu/src/wiki.ts
const WIKI_PAGE_SIZE = 50;
const WIKI_ACCESS_HINT = "To grant wiki access: Open wiki space → Settings → Members → Add the bot. See: https://open.feishu.cn/document/server-docs/docs/wiki-v2/wiki-qa#a40ad4ca";
function requireWikiSpaceId(value, fieldName) {
	if (typeof value !== "string") throw new Error(`${fieldName} must be a string. Feishu wiki space IDs are opaque identifiers; pass them quoted to avoid JavaScript number precision loss.`);
	const trimmed = value.trim();
	if (!trimmed) throw new Error(`${fieldName} must not be empty.`);
	return trimmed;
}
function optionalWikiSpaceId(value, fieldName) {
	if (value === void 0 || value === null || value === "") return;
	return requireWikiSpaceId(value, fieldName);
}
function readWikiPageSize(params) {
	return readPositiveIntegerParam(params, "page_size", {
		max: WIKI_PAGE_SIZE,
		message: "page_size must be a positive integer between 1 and 50"
	}) ?? WIKI_PAGE_SIZE;
}
async function listSpaces(client, pageSize, pageToken) {
	const res = await client.wiki.space.list({ params: {
		page_size: pageSize,
		page_token: pageToken
	} });
	if (res.code !== 0) throw new Error(res.msg);
	const spaces = res.data?.items?.map((s) => ({
		space_id: s.space_id,
		name: s.name,
		description: s.description,
		visibility: s.visibility
	})) ?? [];
	return {
		spaces,
		has_more: res.data?.has_more ?? false,
		page_token: res.data?.page_token,
		...spaces.length === 0 && pageToken === void 0 && res.data?.has_more !== true && { hint: WIKI_ACCESS_HINT }
	};
}
async function listNodes(client, spaceId, parentNodeToken, pageSize, pageToken) {
	const res = await client.wiki.spaceNode.list({
		path: { space_id: spaceId },
		params: {
			parent_node_token: parentNodeToken,
			page_size: pageSize,
			page_token: pageToken
		}
	});
	if (res.code !== 0) throw new Error(res.msg);
	return {
		nodes: res.data?.items?.map((n) => ({
			node_token: n.node_token,
			obj_token: n.obj_token,
			obj_type: n.obj_type,
			title: n.title,
			has_child: n.has_child
		})) ?? [],
		has_more: res.data?.has_more ?? false,
		page_token: res.data?.page_token
	};
}
async function getNode(client, token) {
	const res = await client.wiki.space.getNode({ params: { token } });
	if (res.code !== 0) throw new Error(res.msg);
	const node = res.data?.node;
	return {
		node_token: node?.node_token,
		space_id: node?.space_id,
		obj_token: node?.obj_token,
		obj_type: node?.obj_type,
		title: node?.title,
		parent_node_token: node?.parent_node_token,
		has_child: node?.has_child,
		creator: node?.creator,
		create_time: node?.node_create_time
	};
}
async function createNode(client, spaceId, title, objType, parentNodeToken) {
	const res = await client.wiki.spaceNode.create({
		path: { space_id: spaceId },
		data: {
			obj_type: objType || "docx",
			node_type: "origin",
			title,
			parent_node_token: parentNodeToken
		}
	});
	if (res.code !== 0) throw new Error(res.msg);
	const node = res.data?.node;
	return {
		node_token: node?.node_token,
		obj_token: node?.obj_token,
		obj_type: node?.obj_type,
		title: node?.title
	};
}
async function moveNode(client, spaceId, nodeToken, targetSpaceId, targetParentToken) {
	const res = await client.wiki.spaceNode.move({
		path: {
			space_id: spaceId,
			node_token: nodeToken
		},
		data: {
			target_space_id: targetSpaceId || spaceId,
			target_parent_token: targetParentToken
		}
	});
	if (res.code !== 0) throw new Error(res.msg);
	return {
		success: true,
		node_token: res.data?.node?.node_token
	};
}
async function renameNode(client, spaceId, nodeToken, title) {
	const res = await client.wiki.spaceNode.updateTitle({
		path: {
			space_id: spaceId,
			node_token: nodeToken
		},
		data: { title }
	});
	if (res.code !== 0) throw new Error(res.msg);
	return {
		success: true,
		node_token: nodeToken,
		title
	};
}
function registerFeishuWikiTools(api) {
	api.registerTool((ctx) => {
		const cfg = ctx.runtimeConfig ?? ctx.config ?? api.config;
		if (!cfg || !resolveAnyEnabledFeishuToolsConfig(cfg).wiki) return null;
		const defaultAccountId = ctx.agentAccountId;
		return {
			name: "feishu_wiki",
			resultContentSource: "network",
			label: "Feishu Wiki",
			description: "Feishu knowledge base operations. Actions: spaces, nodes, get, create, move, rename",
			parameters: FeishuWikiSchema,
			async execute(_toolCallId, params) {
				const p = params;
				try {
					const createClient = () => createFeishuToolClient({
						cfg,
						executeParams: p,
						defaultAccountId,
						requiredTool: {
							family: "wiki",
							label: "Wiki"
						}
					});
					switch (p.action) {
						case "spaces": return feishuExternalToolResult(await listSpaces(createClient(), readWikiPageSize(p), p.page_token));
						case "nodes": {
							const spaceId = requireWikiSpaceId(p.space_id, "space_id");
							return feishuExternalToolResult(await listNodes(createClient(), spaceId, p.parent_node_token, readWikiPageSize(p), p.page_token));
						}
						case "get": return feishuExternalToolResult(await getNode(createClient(), p.token));
						case "search":
							optionalWikiSpaceId(p.space_id, "space_id");
							createClient();
							return feishuExternalToolResult({ error: "Search is not available. Use feishu_wiki with action: 'nodes' to browse or action: 'get' to lookup by token." });
						case "create": {
							const spaceId = requireWikiSpaceId(p.space_id, "space_id");
							return feishuExternalToolResult(await createNode(createClient(), spaceId, p.title, p.obj_type, p.parent_node_token));
						}
						case "move": {
							const spaceId = requireWikiSpaceId(p.space_id, "space_id");
							return feishuExternalToolResult(await moveNode(createClient(), spaceId, p.node_token, optionalWikiSpaceId(p.target_space_id, "target_space_id"), p.target_parent_token));
						}
						case "rename": {
							const spaceId = requireWikiSpaceId(p.space_id, "space_id");
							return feishuExternalToolResult(await renameNode(createClient(), spaceId, p.node_token, p.title));
						}
						default: return unknownToolActionResult(p.action);
					}
				} catch (err) {
					return toolExecutionErrorResult(err);
				}
			}
		};
	}, { name: "feishu_wiki" });
}
//#endregion
//#region extensions/feishu/src/perm-schema.ts
const TokenType = Type.Union([
	Type.Literal("doc"),
	Type.Literal("docx"),
	Type.Literal("sheet"),
	Type.Literal("bitable"),
	Type.Literal("folder"),
	Type.Literal("file"),
	Type.Literal("wiki"),
	Type.Literal("mindnote")
]);
const MemberType = Type.Union([
	Type.Literal("email"),
	Type.Literal("openid"),
	Type.Literal("userid"),
	Type.Literal("unionid"),
	Type.Literal("openchat"),
	Type.Literal("opendepartmentid")
]);
const Permission = Type.Union([
	Type.Literal("view"),
	Type.Literal("edit"),
	Type.Literal("full_access")
]);
const FeishuPermSchema = Type.Union([
	Type.Object({
		action: Type.Literal("list"),
		token: Type.String({ description: "File token" }),
		type: TokenType
	}),
	Type.Object({
		action: Type.Literal("add"),
		token: Type.String({ description: "File token" }),
		type: TokenType,
		member_type: MemberType,
		member_id: Type.String({ description: "Member ID (email, open_id, user_id, etc.)" }),
		perm: Permission
	}),
	Type.Object({
		action: Type.Literal("remove"),
		token: Type.String({ description: "File token" }),
		type: TokenType,
		member_type: MemberType,
		member_id: Type.String({ description: "Member ID to remove" })
	})
]);
//#endregion
//#region extensions/feishu/src/perm.ts
async function listMembers(client, token, type) {
	const res = await client.drive.permissionMember.list({
		path: { token },
		params: { type }
	});
	if (res.code !== 0) throw new Error(res.msg);
	return { members: res.data?.items?.map((m) => ({
		member_type: m.member_type,
		member_id: m.member_id,
		perm: m.perm,
		name: m.name
	})) ?? [] };
}
async function addMember(client, token, type, memberType, memberId, perm) {
	const res = await client.drive.permissionMember.create({
		path: { token },
		params: {
			type,
			need_notification: false
		},
		data: {
			member_type: memberType,
			member_id: memberId,
			perm
		}
	});
	if (res.code !== 0) throw new Error(res.msg);
	return {
		success: true,
		member: res.data?.member
	};
}
async function removeMember(client, token, type, memberType, memberId) {
	const res = await client.drive.permissionMember.delete({
		path: {
			token,
			member_id: memberId
		},
		params: {
			type,
			member_type: memberType
		}
	});
	if (res.code !== 0) throw new Error(res.msg);
	return { success: true };
}
function registerFeishuPermTools(api) {
	api.registerTool((ctx) => {
		const cfg = ctx.runtimeConfig ?? ctx.config ?? api.config;
		if (!cfg || !resolveAnyEnabledFeishuToolsConfig(cfg).perm) return null;
		const defaultAccountId = ctx.agentAccountId;
		return {
			name: "feishu_perm",
			resultContentSource: "network",
			label: "Feishu Perm",
			description: "Feishu permission management. Actions: list, add, remove",
			parameters: FeishuPermSchema,
			async execute(_toolCallId, params) {
				const p = params;
				try {
					const client = createFeishuToolClient({
						cfg,
						executeParams: p,
						defaultAccountId,
						requiredTool: {
							family: "perm",
							label: "Perm"
						}
					});
					switch (p.action) {
						case "list": return feishuExternalToolResult(await listMembers(client, p.token, p.type));
						case "add": return feishuExternalToolResult(await addMember(client, p.token, p.type, p.member_type, p.member_id, p.perm));
						case "remove": return feishuExternalToolResult(await removeMember(client, p.token, p.type, p.member_type, p.member_id));
						default: return unknownToolActionResult(p.action);
					}
				} catch (err) {
					return toolExecutionErrorResult(err);
				}
			}
		};
	}, { name: "feishu_perm" });
}
//#endregion
//#region extensions/feishu/src/bitable.ts
var LarkApiError = class extends Error {
	constructor(code, message, api, context) {
		super(`[${api}] code=${code} message=${message}`);
		this.name = "LarkApiError";
		this.code = code;
		this.api = api;
		this.context = context;
	}
};
function ensureLarkSuccess(res, api, context) {
	if (res.code !== 0) throw new LarkApiError(res.code ?? -1, res.msg ?? "unknown error", api, context);
}
/** Field type ID to human-readable name */
const FIELD_TYPE_NAMES = {
	1: "Text",
	2: "Number",
	3: "SingleSelect",
	4: "MultiSelect",
	5: "DateTime",
	7: "Checkbox",
	11: "User",
	13: "Phone",
	15: "URL",
	17: "Attachment",
	18: "SingleLink",
	19: "Lookup",
	20: "Formula",
	21: "DuplexLink",
	22: "Location",
	23: "GroupChat",
	1001: "CreatedTime",
	1002: "ModifiedTime",
	1003: "CreatedUser",
	1004: "ModifiedUser",
	1005: "AutoNumber"
};
/** Parse bitable URL and extract tokens */
function parseBitableUrl(url) {
	try {
		const u = new URL(url);
		const tableId = u.searchParams.get("table") ?? void 0;
		const wikiMatch = u.pathname.match(/\/wiki\/([A-Za-z0-9]+)/);
		if (wikiMatch) {
			const wikiPathSegment = wikiMatch[1];
			return wikiPathSegment === void 0 ? null : {
				token: wikiPathSegment,
				tableId,
				isWiki: true
			};
		}
		const baseMatch = u.pathname.match(/\/base\/([A-Za-z0-9]+)/);
		if (baseMatch) {
			const basePathSegment = baseMatch[1];
			return basePathSegment === void 0 ? null : {
				token: basePathSegment,
				tableId,
				isWiki: false
			};
		}
		return null;
	} catch {
		return null;
	}
}
/** Get app_token from wiki node_token */
async function getAppTokenFromWiki(client, nodeToken) {
	const res = await client.wiki.space.getNode({ params: { token: nodeToken } });
	ensureLarkSuccess(res, "wiki.space.getNode", { nodeToken });
	const node = res.data?.node;
	if (!node) throw new Error("Node not found");
	if (node.obj_type !== "bitable") throw new Error(`Node is not a bitable (type: ${node.obj_type})`);
	return node.obj_token;
}
/** Get bitable metadata from URL (handles both /base/ and /wiki/ URLs) */
async function getBitableMeta(client, url) {
	const parsed = parseBitableUrl(url);
	if (!parsed) throw new Error("Invalid URL format. Expected /base/XXX or /wiki/XXX URL");
	let appToken;
	if (parsed.isWiki) appToken = await getAppTokenFromWiki(client, parsed.token);
	else appToken = parsed.token;
	const res = await client.bitable.app.get({ path: { app_token: appToken } });
	ensureLarkSuccess(res, "bitable.app.get", { appToken });
	let tables = [];
	if (!parsed.tableId) {
		const tablesRes = await client.bitable.appTable.list({ path: { app_token: appToken } });
		if (tablesRes.code === 0) tables = (tablesRes.data?.items ?? []).map((t) => ({
			table_id: t.table_id,
			name: t.name
		}));
	}
	return {
		app_token: appToken,
		table_id: parsed.tableId,
		name: res.data?.app?.name,
		url_type: parsed.isWiki ? "wiki" : "base",
		...tables.length > 0 && { tables },
		hint: parsed.tableId ? `Use app_token="${appToken}" and table_id="${parsed.tableId}" for other bitable tools` : `Use app_token="${appToken}" for other bitable tools. Select a table_id from the tables list.`
	};
}
async function listFields(client, appToken, tableId) {
	const res = await client.bitable.appTableField.list({ path: {
		app_token: appToken,
		table_id: tableId
	} });
	ensureLarkSuccess(res, "bitable.appTableField.list", {
		appToken,
		tableId
	});
	const fields = res.data?.items ?? [];
	return {
		fields: fields.map((f) => ({
			field_id: f.field_id,
			field_name: f.field_name,
			type: f.type,
			type_name: FIELD_TYPE_NAMES[f.type ?? 0] || `type_${f.type}`,
			is_primary: f.is_primary,
			...f.property && { property: f.property }
		})),
		total: fields.length
	};
}
async function listRecords(client, appToken, tableId, pageSize, pageToken) {
	const res = await client.bitable.appTableRecord.list({
		path: {
			app_token: appToken,
			table_id: tableId
		},
		params: {
			page_size: pageSize ?? 100,
			...pageToken && { page_token: pageToken }
		}
	});
	ensureLarkSuccess(res, "bitable.appTableRecord.list", {
		appToken,
		tableId,
		pageSize
	});
	return {
		records: res.data?.items ?? [],
		has_more: res.data?.has_more ?? false,
		page_token: res.data?.page_token,
		total: res.data?.total
	};
}
function readBitableListRecordsPageSize(params) {
	return readPositiveIntegerParam(params, "page_size", {
		max: 500,
		message: "page_size must be a positive integer between 1 and 500"
	});
}
async function getRecord(client, appToken, tableId, recordId) {
	const res = await client.bitable.appTableRecord.get({ path: {
		app_token: appToken,
		table_id: tableId,
		record_id: recordId
	} });
	ensureLarkSuccess(res, "bitable.appTableRecord.get", {
		appToken,
		tableId,
		recordId
	});
	return { record: res.data?.record };
}
async function createRecord(client, appToken, tableId, fields) {
	const res = await client.bitable.appTableRecord.create({
		path: {
			app_token: appToken,
			table_id: tableId
		},
		data: { fields }
	});
	ensureLarkSuccess(res, "bitable.appTableRecord.create", {
		appToken,
		tableId
	});
	return { record: res.data?.record };
}
/** Default field types created for new Bitable tables (to be cleaned up) */
const DEFAULT_CLEANUP_FIELD_TYPES = /* @__PURE__ */ new Set([
	3,
	5,
	17
]);
function isDefaultEmptyBitableFieldValue(value) {
	if (value === void 0 || value === null || value === "") return true;
	if (Array.isArray(value)) return value.every(isDefaultEmptyBitableFieldValue);
	if (typeof value === "object") {
		const record = value;
		const keys = Object.keys(record);
		if (keys.length === 0) return true;
		if ("text" in record && keys.every((key) => key === "text" || key === "type")) return record.text === void 0 || record.text === null || record.text === "";
		return Object.values(record).every(isDefaultEmptyBitableFieldValue);
	}
	return false;
}
function isPlaceholderBitableRecord(fields) {
	if (!fields || typeof fields !== "object" || Array.isArray(fields)) return true;
	return Object.values(fields).every(isDefaultEmptyBitableFieldValue);
}
/** Clean up default placeholder rows and fields in a newly created Bitable table */
async function cleanupNewBitable(client, appToken, tableId, tableName, logger) {
	let cleanedRows = 0;
	let cleanedFields = 0;
	const fieldsRes = await client.bitable.appTableField.list({ path: {
		app_token: appToken,
		table_id: tableId
	} });
	if (fieldsRes.code === 0 && fieldsRes.data?.items) {
		const primaryField = fieldsRes.data.items.find((f) => f.is_primary);
		if (primaryField?.field_id) try {
			const newFieldName = tableName.length <= 20 ? tableName : "Name";
			await client.bitable.appTableField.update({
				path: {
					app_token: appToken,
					table_id: tableId,
					field_id: primaryField.field_id
				},
				data: {
					field_name: newFieldName,
					type: 1
				}
			});
			cleanedFields++;
		} catch (err) {
			logger.debug(`Failed to rename primary field: ${String(err)}`);
		}
		const defaultFieldsToDelete = fieldsRes.data.items.filter((f) => !f.is_primary && DEFAULT_CLEANUP_FIELD_TYPES.has(f.type ?? 0));
		for (const field of defaultFieldsToDelete) if (field.field_id) try {
			await client.bitable.appTableField.delete({ path: {
				app_token: appToken,
				table_id: tableId,
				field_id: field.field_id
			} });
			cleanedFields++;
		} catch (err) {
			logger.debug(`Failed to delete default field ${field.field_name}: ${String(err)}`);
		}
	}
	const recordsRes = await client.bitable.appTableRecord.list({
		path: {
			app_token: appToken,
			table_id: tableId
		},
		params: { page_size: 100 }
	});
	if (recordsRes.code === 0 && recordsRes.data?.items) {
		const emptyRecordIds = recordsRes.data.items.filter((r) => isPlaceholderBitableRecord(r.fields)).map((r) => r.record_id).filter((id) => Boolean(id));
		if (emptyRecordIds.length > 0) try {
			await client.bitable.appTableRecord.batchDelete({
				path: {
					app_token: appToken,
					table_id: tableId
				},
				data: { records: emptyRecordIds }
			});
			cleanedRows = emptyRecordIds.length;
		} catch {
			for (const recordId of emptyRecordIds) try {
				await client.bitable.appTableRecord.delete({ path: {
					app_token: appToken,
					table_id: tableId,
					record_id: recordId
				} });
				cleanedRows++;
			} catch (err) {
				logger.debug(`Failed to delete empty row ${recordId}: ${String(err)}`);
			}
		}
	}
	return {
		cleanedRows,
		cleanedFields
	};
}
async function createApp(client, name, folderToken, logger) {
	const res = await client.bitable.app.create({ data: {
		name,
		...folderToken && { folder_token: folderToken }
	} });
	ensureLarkSuccess(res, "bitable.app.create", {
		name,
		folderToken
	});
	const appToken = res.data?.app?.app_token;
	if (!appToken) throw new Error("Failed to create Bitable: no app_token returned");
	const log = logger ?? {
		debug: () => {},
		warn: () => {}
	};
	let tableId;
	let cleanedRows = 0;
	let cleanedFields = 0;
	try {
		const tablesRes = await client.bitable.appTable.list({ path: { app_token: appToken } });
		if (tablesRes.code === 0 && tablesRes.data?.items && tablesRes.data.items.length > 0) {
			tableId = tablesRes.data.items.at(0)?.table_id;
			if (tableId) {
				const cleanup = await cleanupNewBitable(client, appToken, tableId, name, log);
				cleanedRows = cleanup.cleanedRows;
				cleanedFields = cleanup.cleanedFields;
			}
		}
	} catch (err) {
		log.debug(`Cleanup failed (non-critical): ${String(err)}`);
	}
	return {
		app_token: appToken,
		table_id: tableId,
		name: res.data?.app?.name,
		url: res.data?.app?.url,
		cleaned_placeholder_rows: cleanedRows,
		cleaned_default_fields: cleanedFields,
		hint: tableId ? `Table created. Use app_token="${appToken}" and table_id="${tableId}" for other bitable tools.` : "Application created, but table metadata was not retrieved. Inspect the existing application using the returned app_token or URL; do not create it again."
	};
}
async function createField(client, appToken, tableId, fieldName, fieldType, property) {
	const res = await client.bitable.appTableField.create({
		path: {
			app_token: appToken,
			table_id: tableId
		},
		data: {
			field_name: fieldName,
			type: fieldType,
			...property && { property }
		}
	});
	ensureLarkSuccess(res, "bitable.appTableField.create", {
		appToken,
		tableId,
		fieldName,
		fieldType
	});
	return {
		field_id: res.data?.field?.field_id,
		field_name: res.data?.field?.field_name,
		type: res.data?.field?.type,
		type_name: FIELD_TYPE_NAMES[res.data?.field?.type ?? 0] || `type_${res.data?.field?.type}`
	};
}
async function updateRecord(client, appToken, tableId, recordId, fields) {
	const res = await client.bitable.appTableRecord.update({
		path: {
			app_token: appToken,
			table_id: tableId,
			record_id: recordId
		},
		data: { fields }
	});
	ensureLarkSuccess(res, "bitable.appTableRecord.update", {
		appToken,
		tableId,
		recordId
	});
	return { record: res.data?.record };
}
const BITABLE_APP_TOKEN_DESCRIPTION = "Bitable application token (the /base/ URL identifier, or app_token from metadata). Not the node token in a /wiki/ URL.";
const BITABLE_RECORD_FIELDS_DESCRIPTION = "Field values keyed by field name. Format by type: Text='string', Number=123, SingleSelect='Option', MultiSelect=['A','B'], DateTime=timestamp_ms, User=[{id:'ou_xxx'}], URL={text:'Display',link:'https://...'}";
const GetMetaSchema = Type.Object({ url: Type.String({ description: "Bitable URL. Supports both formats: /base/XXX?table=YYY or /wiki/XXX?table=YYY" }) });
const ListFieldsSchema = Type.Object({
	app_token: Type.String({ description: BITABLE_APP_TOKEN_DESCRIPTION }),
	table_id: Type.String({ description: "Table ID (from URL: ?table=YYY)" })
});
const ListRecordsSchema = Type.Object({
	app_token: Type.String({ description: BITABLE_APP_TOKEN_DESCRIPTION }),
	table_id: Type.String({ description: "Table ID (from URL: ?table=YYY)" }),
	page_size: optionalPositiveIntegerSchema({
		description: "Number of records per page (1-500, default 100)",
		maximum: 500
	}),
	page_token: Type.Optional(Type.String({ description: "Pagination token from previous response" }))
});
const GetRecordSchema = Type.Object({
	app_token: Type.String({ description: BITABLE_APP_TOKEN_DESCRIPTION }),
	table_id: Type.String({ description: "Table ID (from URL: ?table=YYY)" }),
	record_id: Type.String({ description: "Record ID to retrieve" })
});
const BitableFieldValueSchema = Type.Unsafe({ type: [
	"string",
	"number",
	"boolean",
	"object",
	"array",
	"null"
] });
const CreateRecordSchema = Type.Object({
	app_token: Type.String({ description: BITABLE_APP_TOKEN_DESCRIPTION }),
	table_id: Type.String({ description: "Table ID (from URL: ?table=YYY)" }),
	fields: Type.Record(Type.String(), BitableFieldValueSchema, { description: BITABLE_RECORD_FIELDS_DESCRIPTION })
});
const CreateAppSchema = Type.Object({
	name: Type.String({ description: "Name for the new Bitable application" }),
	folder_token: Type.Optional(Type.String({ description: "Optional folder token to place the Bitable in a specific folder" }))
});
const CreateFieldSchema = Type.Object({
	app_token: Type.String({ description: BITABLE_APP_TOKEN_DESCRIPTION }),
	table_id: Type.String({ description: "Table ID (from URL: ?table=YYY)" }),
	field_name: Type.String({ description: "Name for the new field" }),
	field_type: Type.Number({
		description: "Field type ID: 1=Text, 2=Number, 3=SingleSelect, 4=MultiSelect, 5=DateTime, 7=Checkbox, 11=User, 13=Phone, 15=URL, 17=Attachment, 18=SingleLink, 19=Lookup, 20=Formula, 21=DuplexLink, 22=Location, 23=GroupChat, 1001=CreatedTime, 1002=ModifiedTime, 1003=CreatedUser, 1004=ModifiedUser, 1005=AutoNumber",
		minimum: 1
	}),
	property: Type.Optional(Type.Record(Type.String(), BitableFieldValueSchema, { description: "Field-specific properties (e.g., options for SingleSelect, format for Number)" }))
});
const UpdateRecordSchema = Type.Object({
	app_token: Type.String({ description: BITABLE_APP_TOKEN_DESCRIPTION }),
	table_id: Type.String({ description: "Table ID (from URL: ?table=YYY)" }),
	record_id: Type.String({ description: "Record ID to update" }),
	fields: Type.Record(Type.String(), BitableFieldValueSchema, { description: BITABLE_RECORD_FIELDS_DESCRIPTION })
});
function registerFeishuBitableTools(api) {
	const registerBitableTool = (params) => {
		api.registerTool((ctx) => {
			const cfg = ctx.runtimeConfig ?? ctx.config ?? api.config;
			if (!cfg || !resolveAnyEnabledFeishuToolsConfig(cfg).bitable) return null;
			return {
				name: params.name,
				resultContentSource: "network",
				label: params.label,
				description: params.description,
				parameters: params.parameters,
				async execute(_toolCallId, rawParams) {
					const executeParams = rawParams;
					try {
						return feishuExternalToolResult(await params.execute({
							params: executeParams,
							client: createFeishuToolClient({
								cfg,
								executeParams,
								defaultAccountId: ctx.agentAccountId,
								requiredTool: {
									family: "bitable",
									label: "Bitable"
								}
							})
						}));
					} catch (err) {
						return feishuExternalToolResult({ error: formatErrorMessage(err) });
					}
				}
			};
		}, { name: params.name });
	};
	registerBitableTool({
		name: "feishu_bitable_get_meta",
		label: "Feishu Bitable Get Meta",
		description: "Parse a Bitable URL and get app_token, table_id, and table list. Use this first when given a /wiki/ or /base/ URL.",
		parameters: GetMetaSchema,
		async execute({ params, client }) {
			return getBitableMeta(client, params.url);
		}
	});
	registerBitableTool({
		name: "feishu_bitable_list_fields",
		label: "Feishu Bitable List Fields",
		description: "List all fields (columns) in a Bitable table with their types and properties",
		parameters: ListFieldsSchema,
		async execute({ params, client }) {
			return listFields(client, params.app_token, params.table_id);
		}
	});
	registerBitableTool({
		name: "feishu_bitable_list_records",
		label: "Feishu Bitable List Records",
		description: "List records (rows) from a Bitable table with pagination support",
		parameters: ListRecordsSchema,
		async execute({ params, client }) {
			return listRecords(client, params.app_token, params.table_id, readBitableListRecordsPageSize(params), params.page_token);
		}
	});
	registerBitableTool({
		name: "feishu_bitable_get_record",
		label: "Feishu Bitable Get Record",
		description: "Get a single record by ID from a Bitable table",
		parameters: GetRecordSchema,
		async execute({ params, client }) {
			return getRecord(client, params.app_token, params.table_id, params.record_id);
		}
	});
	registerBitableTool({
		name: "feishu_bitable_create_record",
		label: "Feishu Bitable Create Record",
		description: "Create a new record (row) in a Bitable table",
		parameters: CreateRecordSchema,
		async execute({ params, client }) {
			return createRecord(client, params.app_token, params.table_id, params.fields);
		}
	});
	registerBitableTool({
		name: "feishu_bitable_update_record",
		label: "Feishu Bitable Update Record",
		description: "Update an existing record (row) in a Bitable table",
		parameters: UpdateRecordSchema,
		async execute({ params, client }) {
			return updateRecord(client, params.app_token, params.table_id, params.record_id, params.fields);
		}
	});
	registerBitableTool({
		name: "feishu_bitable_create_app",
		label: "Feishu Bitable Create App",
		description: "Create a new Bitable (multidimensional table) application",
		parameters: CreateAppSchema,
		async execute({ params, client }) {
			return createApp(client, params.name, params.folder_token, {
				debug: (msg) => api.logger.debug?.(msg),
				warn: (msg) => api.logger.warn?.(msg)
			});
		}
	});
	registerBitableTool({
		name: "feishu_bitable_create_field",
		label: "Feishu Bitable Create Field",
		description: "Create a new field (column) in a Bitable table",
		parameters: CreateFieldSchema,
		async execute({ params, client }) {
			return createField(client, params.app_token, params.table_id, params.field_name, params.field_type, params.property);
		}
	});
}
//#endregion
export { buildFeishuConversationId, buildFeishuModelOverrideParentCandidates, createClackPrompter, createFeishuThreadBindingManager, feishuPlugin, feishuSetupAdapter, feishuSetupWizard, getFeishuThreadBindingManager, handleFeishuSubagentDeliveryTarget, handleFeishuSubagentEnded, parseFeishuConversationId, parseFeishuDirectConversationId, parseFeishuTargetId, registerFeishuBitableTools, registerFeishuChatTools, registerFeishuDocTools, registerFeishuDriveTools, registerFeishuPermTools, registerFeishuWikiTools, runFeishuLogin, setFeishuNamedAccountEnabled };
