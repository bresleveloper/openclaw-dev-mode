import { s as asFiniteNumber } from "./number-coercion-CLj0HTDM.mjs";
import "./src-CZ2wJvNB.mjs";
import { a as asOptionalRecord } from "./record-coerce-DItp3I4t.mjs";
import { n as safeParseJsonRecord } from "./json-coercion-C7YSvZ9t.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import "./code-regions-NxEObIZm.mjs";
import { a as isToolResultContentType, n as isToolCallContentType } from "./tool-content-ByAb-IhE.mjs";
import { y as truncateChatHistoryText } from "./chat-display-projection.helpers-BloZC0RQ.mjs";
//#region src/chat/canvas-render.ts
function getRecordStringField(record, key) {
	const value = record?.[key];
	return typeof value === "string" && value.trim() ? value : void 0;
}
function getRecordNumberField(record, key) {
	const value = record?.[key];
	return asFiniteNumber(value);
}
function getNestedRecord(record, key) {
	const value = record?.[key];
	return asOptionalRecord(value);
}
function coerceMcpAppDescriptor(record) {
	const viewId = getRecordStringField(record, "viewId");
	if (!viewId || viewId.length > 128) return;
	const serverName = getRecordStringField(record, "serverName");
	const toolName = getRecordStringField(record, "toolName");
	const uiResourceUri = getRecordStringField(record, "uiResourceUri");
	const toolCallId = getRecordStringField(record, "toolCallId");
	const originSessionKey = getRecordStringField(record, "originSessionKey");
	const resultMetaState = record?.resultMetaState === "unavailable" ? "unavailable" : void 0;
	return Boolean(serverName && serverName.length <= 256 && toolName && toolName.length <= 256 && uiResourceUri?.startsWith("ui://") && uiResourceUri.length <= 2048 && toolCallId && toolCallId.length <= 512) ? {
		viewId,
		serverName,
		toolName,
		uiResourceUri,
		toolCallId,
		...originSessionKey && originSessionKey.length <= 512 ? { originSessionKey } : {},
		...resultMetaState ? { resultMetaState } : {}
	} : { viewId };
}
function normalizeSurface(value) {
	return value === "assistant_message" || value === "node_panel" ? value : void 0;
}
function normalizeSandbox(value) {
	return value === "strict" || value === "scripts" ? value : void 0;
}
function normalizePreferredHeight(value) {
	return typeof value === "number" && Number.isFinite(value) && value >= 160 ? Math.min(Math.trunc(value), 1200) : void 0;
}
function isCanvasBoardWidgetName(value) {
	return typeof value === "string" && /^[a-z0-9][a-z0-9._-]{0,63}$/u.test(value);
}
function coerceCanvasPreview(record) {
	if (!record) return;
	if (getRecordStringField(record, "kind")?.trim().toLowerCase() !== "canvas") return;
	const presentation = getNestedRecord(record, "presentation");
	const view = getNestedRecord(record, "view");
	const source = getNestedRecord(record, "source");
	const mcpApp = coerceMcpAppDescriptor(getNestedRecord(record, "mcpApp"));
	const mcpAppViewId = mcpApp?.viewId;
	const requestedSurface = getRecordStringField(presentation, "target") ?? getRecordStringField(record, "target");
	const surface = requestedSurface ? normalizeSurface(requestedSurface) : "assistant_message";
	if (!surface) return;
	const title = getRecordStringField(presentation, "title") ?? getRecordStringField(view, "title");
	const preferredHeight = normalizePreferredHeight(getRecordNumberField(presentation, "preferred_height") ?? getRecordNumberField(presentation, "preferredHeight") ?? getRecordNumberField(view, "preferred_height") ?? getRecordNumberField(view, "preferredHeight"));
	const className = getRecordStringField(presentation, "class_name") ?? getRecordStringField(presentation, "className");
	const style = getRecordStringField(presentation, "style");
	const sandbox = normalizeSandbox(getRecordStringField(presentation, "sandbox"));
	const viewUrl = getRecordStringField(view, "url") ?? getRecordStringField(view, "entryUrl");
	const viewId = getRecordStringField(view, "id") ?? getRecordStringField(view, "docId");
	const requestedBoardWidgetName = getRecordStringField(view, "boardWidgetName");
	const boardWidgetName = isCanvasBoardWidgetName(requestedBoardWidgetName) ? requestedBoardWidgetName : void 0;
	if (mcpAppViewId && viewId === mcpAppViewId) return {
		kind: "canvas",
		surface,
		render: "url",
		viewId,
		...title ? { title } : {},
		...preferredHeight ? { preferredHeight } : {},
		...sandbox ? { sandbox } : {},
		mcpApp
	};
	if (viewUrl) return {
		kind: "canvas",
		surface,
		render: "url",
		url: viewUrl,
		...viewId ? { viewId } : {},
		...title ? { title } : {},
		...preferredHeight ? { preferredHeight } : {},
		...className ? { className } : {},
		...style ? { style } : {},
		...sandbox ? { sandbox } : {},
		...boardWidgetName ? { boardWidgetName } : {},
		...mcpApp ? { mcpApp } : {}
	};
	if (getRecordStringField(source, "type")?.trim().toLowerCase() === "url") {
		const url = getRecordStringField(source, "url");
		if (!url) return;
		return {
			kind: "canvas",
			surface,
			render: "url",
			url,
			...title ? { title } : {},
			...preferredHeight ? { preferredHeight } : {},
			...className ? { className } : {},
			...style ? { style } : {},
			...sandbox ? { sandbox } : {},
			...mcpApp ? { mcpApp } : {}
		};
	}
}
/** Extracts an MCP App Canvas preview from sanitized tool-result details. */
function extractCanvasFromDetails(value) {
	const details = asOptionalRecord(value);
	return coerceCanvasPreview(asOptionalRecord(details?.mcpAppPreview));
}
/** Extracts a canvas preview from a JSON-shaped tool or assistant payload. */
function extractCanvasFromText(outputText, _toolName) {
	return coerceCanvasPreview(outputText ? safeParseJsonRecord(outputText) : void 0);
}
//#endregion
//#region src/gateway/chat-display-projection.canvas.ts
const TOOL_APPROVAL_REVIEW_STATUSES = /* @__PURE__ */ new Set([
	"in_progress",
	"approved",
	"denied",
	"timed_out",
	"aborted"
]);
function boundedReviewText(value, maxChars) {
	const text = typeof value === "string" ? value.trim() : "";
	return text ? truncateUtf16Safe(text, maxChars) : void 0;
}
function isBrowserRouteIdentifier(value, maxChars) {
	return typeof value === "string" && value.length > 0 && value.length <= maxChars && value.trim() === value;
}
function projectToolApprovalReview(value) {
	const review = asOptionalRecord(value);
	const id = boundedReviewText(review?.id, 256);
	const label = boundedReviewText(review?.label, 80);
	const status = boundedReviewText(review?.status, 32);
	if (!id || !label || !status || !TOOL_APPROVAL_REVIEW_STATUSES.has(status)) return;
	const riskLevel = boundedReviewText(review?.riskLevel, 40);
	const userAuthorization = boundedReviewText(review?.userAuthorization, 40);
	const rationale = boundedReviewText(review?.rationale, 2e3);
	return {
		id,
		label,
		status,
		...riskLevel ? { riskLevel } : {},
		...userAuthorization ? { userAuthorization } : {},
		...rationale ? { rationale } : {}
	};
}
/** Return true for known tool-call/tool-result block type spellings in transcripts. */
function isToolHistoryBlockType(type) {
	if (typeof type !== "string") return false;
	const normalized = type.trim();
	return isToolCallContentType(normalized) || isToolResultContentType(normalized);
}
function isToolResultHistoryBlockType(type) {
	return typeof type === "string" && isToolResultContentType(type.trim());
}
function projectToolResultDetails(details, maxChars) {
	const record = asOptionalRecord(details);
	if (!record) return {
		details: void 0,
		truncated: false
	};
	const projected = {};
	const browserTab = asOptionalRecord(record.browserTab);
	if (isBrowserRouteIdentifier(browserTab?.targetId, 128) && isBrowserRouteIdentifier(browserTab?.profile, 128) && (browserTab?.target === "host" && browserTab.node === void 0 || browserTab?.target === "node" && isBrowserRouteIdentifier(browserTab.node, 256))) projected.browserTab = {
		targetId: browserTab.targetId,
		profile: browserTab.profile,
		target: browserTab.target,
		...browserTab.target === "node" ? { node: browserTab.node } : {},
		...typeof browserTab.url === "string" ? { url: truncateUtf16Safe(browserTab.url, 2048) } : {},
		...typeof browserTab.title === "string" ? { title: truncateUtf16Safe(browserTab.title, 512) } : {}
	};
	let truncated = false;
	for (const key of ["changed", "created"]) if (typeof record[key] === "boolean") projected[key] = record[key];
	if (typeof record.diff === "string" && record.diff.trim()) {
		const diff = truncateChatHistoryText(record.diff, maxChars);
		projected.diff = diff.text;
		truncated = diff.truncated;
	}
	if (Array.isArray(record.approvalReviews)) {
		const reviews = record.approvalReviews.slice(-16).flatMap((review) => projectToolApprovalReview(review) ?? []);
		if (reviews.length > 0) projected.approvalReviews = reviews;
	}
	const reviewOutcome = record.approvalReviewOutcome;
	if (reviewOutcome === "approved" || reviewOutcome === "denied" || reviewOutcome === "reviewing") projected.approvalReviewOutcome = reviewOutcome;
	const preview = extractCanvasFromDetails(record);
	if (preview?.mcpApp && preview.viewId) projected.mcpAppPreview = {
		kind: "canvas",
		view: {
			id: preview.viewId,
			...preview.url ? { url: preview.url } : {},
			...preview.title ? { title: preview.title } : {}
		},
		presentation: {
			target: "assistant_message",
			...preview.title ? { title: preview.title } : {},
			...preview.preferredHeight ? { preferred_height: preview.preferredHeight } : {},
			...preview.sandbox ? { sandbox: preview.sandbox } : {}
		},
		mcpApp: preview.mcpApp
	};
	return {
		details: Object.keys(projected).length > 0 ? projected : void 0,
		truncated
	};
}
function messageHasToolResultShape(message) {
	const role = typeof message.role === "string" ? message.role.toLowerCase() : "";
	if (role === "toolresult" || role === "tool_result" || role === "tool" || role === "function") return true;
	const content = Array.isArray(message.content) ? message.content : [];
	if (content.some((block) => block && typeof block === "object" && isToolResultHistoryBlockType(block.type))) return true;
	const hasToolCallBlock = content.some((block) => block && typeof block === "object" && isToolHistoryBlockType(block.type) && !isToolResultHistoryBlockType(block.type));
	const hasToolId = typeof message.toolCallId === "string" || typeof message.tool_call_id === "string" || typeof message.toolUseId === "string" || typeof message.tool_use_id === "string";
	const hasToolName = typeof message.toolName === "string" || typeof message.tool_name === "string";
	return hasToolId && hasToolName && !hasToolCallBlock;
}
function extractChatHistoryBlockText(message) {
	if (!message || typeof message !== "object") return;
	const entry = message;
	if (typeof entry.content === "string") return entry.content;
	if (typeof entry.text === "string") return entry.text;
	if (!Array.isArray(entry.content)) return;
	const textParts = entry.content.map((block) => {
		if (!block || typeof block !== "object") return;
		const typed = block;
		return typeof typed.text === "string" ? typed.text : void 0;
	}).filter((value) => typeof value === "string");
	return textParts.length > 0 ? textParts.join("\n") : void 0;
}
function extractChatHistoryCanvasPreview(message) {
	const direct = extractCanvasFromDetails(message.details);
	if (direct) return direct;
	if (!Array.isArray(message.content)) return;
	for (const block of message.content) {
		const preview = extractCanvasFromDetails(asOptionalRecord(block)?.details);
		if (preview) return preview;
	}
}
function extractChatToolResultCanvasPreview(message) {
	const entry = asOptionalRecord(message);
	if (!entry) return;
	const detailsPreview = extractChatHistoryCanvasPreview(entry);
	const text = detailsPreview ? void 0 : extractChatHistoryBlockText(entry);
	const preview = detailsPreview ?? extractCanvasFromText(text);
	return preview ? {
		preview,
		rawText: detailsPreview ? null : text ?? null
	} : void 0;
}
function appendChatCanvasBlocks(content, previews) {
	const baseContent = [...content];
	for (const { preview, rawText } of previews) if (!baseContent.some((block) => {
		if (!block || typeof block !== "object") return false;
		const typed = block;
		return typed.type === "canvas" && typed.preview && typeof typed.preview === "object" && (typed.preview.viewId && typed.preview.viewId === preview.viewId || typed.preview.url && typed.preview.url === preview.url);
	})) baseContent.push({
		type: "canvas",
		preview,
		rawText
	});
	return baseContent;
}
function appendChatCanvasBlocksToMessage(message, previews) {
	if (!message || previews.length === 0) return message;
	const content = Array.isArray(message.content) ? message.content : typeof message.content === "string" ? [{
		type: "text",
		text: message.content
	}] : typeof message.text === "string" ? [{
		type: "text",
		text: message.text
	}] : [];
	return {
		...message,
		content: appendChatCanvasBlocks(content, previews)
	};
}
function messageContainsToolHistoryContent(message) {
	if (!message || typeof message !== "object") return false;
	const entry = message;
	if (typeof entry.toolCallId === "string" || typeof entry.tool_call_id === "string" || typeof entry.toolName === "string" || typeof entry.tool_name === "string") return true;
	if (!Array.isArray(entry.content)) return false;
	return entry.content.some((block) => {
		if (!block || typeof block !== "object") return false;
		return isToolHistoryBlockType(block.type);
	});
}
function augmentChatHistoryWithCanvasBlocks(messages) {
	if (messages.length === 0) return messages;
	const next = [...messages];
	let changed = false;
	let lastAssistantIndex = -1;
	let lastRenderableAssistantIndex = -1;
	const pending = [];
	for (let index = 0; index < next.length; index++) {
		const message = next[index];
		if (!message || typeof message !== "object") continue;
		const entry = message;
		if ((typeof entry.role === "string" ? entry.role.toLowerCase() : "") === "assistant") {
			lastAssistantIndex = index;
			if (!messageContainsToolHistoryContent(entry)) {
				lastRenderableAssistantIndex = index;
				if (pending.length > 0) {
					next[index] = appendChatCanvasBlocksToMessage(entry, pending);
					pending.length = 0;
					changed = true;
				}
			}
			continue;
		}
		if (!messageContainsToolHistoryContent(entry)) continue;
		const preview = extractChatToolResultCanvasPreview(entry);
		if (!preview) continue;
		pending.push(preview);
	}
	if (pending.length > 0) {
		const targetIndex = lastRenderableAssistantIndex >= 0 ? lastRenderableAssistantIndex : lastAssistantIndex;
		if (targetIndex >= 0) {
			next[targetIndex] = appendChatCanvasBlocksToMessage(asOptionalRecord(next[targetIndex]), pending);
			changed = true;
		}
	}
	return changed ? next : messages;
}
//#endregion
export { extractChatToolResultCanvasPreview as a, messageHasToolResultShape as c, extractChatHistoryBlockText as i, projectToolResultDetails as l, appendChatCanvasBlocksToMessage as n, isToolHistoryBlockType as o, augmentChatHistoryWithCanvasBlocks as r, isToolResultHistoryBlockType as s, appendChatCanvasBlocks as t };
