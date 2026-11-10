import { m as readNonBlankString } from "./string-coerce-1VuiLaaR.mjs";
import { s as asFiniteNumber } from "./number-coercion-CkhMiRw8.mjs";
import "./src-Djeo9OvP.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { a as asOptionalRecord, i as asOptionalObjectRecord, r as asNullableRecord } from "./record-coerce-TIsquoVR.mjs";
import { n as safeParseJsonRecord } from "./json-coercion-pfKbZnCJ.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { n as findMarkdownCodeRegions } from "./reasoning-tags-DOZ8HVZL.mjs";
import { a as isInsideCode } from "./code-regions-Cy_WAn7O.mjs";
import { y as truncateChatHistoryText } from "./chat-display-projection.helpers-DvBIoDrj.mjs";
import { i as isToolResultContentType, n as isToolCallContentType } from "./tool-content-CCdCNdqN.mjs";
//#region src/chat/canvas-render.ts
function coerceMcpAppDescriptor(record) {
	const viewId = readNonBlankString(record?.viewId);
	if (!viewId || viewId.length > 128) return;
	const serverName = readNonBlankString(record?.serverName);
	const toolName = readNonBlankString(record?.toolName);
	const uiResourceUri = readNonBlankString(record?.uiResourceUri);
	const toolCallId = readNonBlankString(record?.toolCallId);
	const originSessionKey = readNonBlankString(record?.originSessionKey);
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
function normalizePreferredHeight(value) {
	return typeof value === "number" && Number.isFinite(value) && value >= 160 ? Math.min(Math.trunc(value), 1200) : void 0;
}
function isCanvasBoardWidgetName(value) {
	return typeof value === "string" && /^[a-z0-9][a-z0-9._-]{0,63}$/u.test(value);
}
function coerceCanvasPreview(record) {
	if (!record) return;
	if (readNonBlankString(record?.kind)?.trim().toLowerCase() !== "canvas") return;
	const presentation = asOptionalRecord(record.presentation);
	const view = asOptionalRecord(record.view);
	const source = asOptionalRecord(record.source);
	const mcpApp = coerceMcpAppDescriptor(asOptionalRecord(record.mcpApp));
	const mcpAppViewId = mcpApp?.viewId;
	const surface = readNonBlankString(presentation?.target) ?? readNonBlankString(record?.target) ?? "assistant_message";
	if (surface !== "assistant_message" && surface !== "node_panel") return;
	const title = readNonBlankString(presentation?.title) ?? readNonBlankString(view?.title);
	const preferredHeight = normalizePreferredHeight(asFiniteNumber(presentation?.preferred_height) ?? asFiniteNumber(presentation?.preferredHeight) ?? asFiniteNumber(view?.preferred_height) ?? asFiniteNumber(view?.preferredHeight));
	const className = readNonBlankString(presentation?.class_name) ?? readNonBlankString(presentation?.className);
	const style = readNonBlankString(presentation?.style);
	const sandbox = readNonBlankString(presentation?.sandbox);
	const viewUrl = readNonBlankString(view?.url) ?? readNonBlankString(view?.entryUrl);
	const viewId = readNonBlankString(view?.id) ?? readNonBlankString(view?.docId);
	const requestedBoardWidgetName = readNonBlankString(view?.boardWidgetName);
	const boardWidgetName = isCanvasBoardWidgetName(requestedBoardWidgetName) ? requestedBoardWidgetName : void 0;
	const preview = {
		kind: "canvas",
		surface,
		render: "url",
		...title ? { title } : {},
		...preferredHeight ? { preferredHeight } : {},
		...sandbox === "strict" || sandbox === "scripts" ? { sandbox } : {},
		...mcpApp ? { mcpApp } : {}
	};
	if (mcpAppViewId && viewId === mcpAppViewId) return {
		...preview,
		viewId
	};
	const url = viewUrl ?? (readNonBlankString(source?.type)?.trim().toLowerCase() === "url" ? readNonBlankString(source?.url) : void 0);
	if (!url) return;
	return {
		...preview,
		url,
		...viewUrl && viewId ? { viewId } : {},
		...className ? { className } : {},
		...style ? { style } : {},
		...viewUrl && boardWidgetName ? { boardWidgetName } : {}
	};
}
/** Extracts an MCP App Canvas preview from sanitized tool-result details. */
function extractCanvasFromDetails(value) {
	const details = asOptionalRecord(value);
	return coerceCanvasPreview(asOptionalRecord(details?.mcpAppPreview));
}
function parseCanvasAttributes(raw) {
	const attrs = {};
	const re = /([A-Za-z_][A-Za-z0-9_-]*)\s*=\s*(?:"([^"]*)"|'([^']*)')/g;
	let match;
	while (match = re.exec(raw)) {
		const key = match[1]?.toLowerCase();
		const value = (match[2] ?? match[3] ?? "").trim();
		if (key && value) attrs[key] = value;
	}
	return attrs;
}
function previewFromShortcode(attrs) {
	if (attrs.target && attrs.target !== "assistant_message") return;
	const { title, style, ref, url } = attrs;
	const preferredHeight = normalizePreferredHeight(Number(attrs.height));
	const className = attrs.class ?? attrs.class_name;
	if (url || ref) return {
		kind: "canvas",
		surface: "assistant_message",
		render: "url",
		url: url ?? `/__openclaw__/canvas/documents/${encodeURIComponent(expectDefined(ref, "canvas reference"))}/index.html`,
		...ref ? { viewId: ref } : {},
		...title ? { title } : {},
		...preferredHeight ? { preferredHeight } : {},
		...className ? { className } : {},
		...style ? { style } : {}
	};
}
/** Extracts a canvas preview from a JSON-shaped tool or assistant payload. */
function extractCanvasFromText(outputText) {
	return coerceCanvasPreview(outputText ? safeParseJsonRecord(outputText) : void 0);
}
/** Extracts [embed ...] shortcodes outside Markdown code and returns stripped text. */
function extractCanvasShortcodes(text, includePreview) {
	if (!text?.trim() || !text.toLowerCase().includes("[embed")) return {
		text: text ?? "",
		previews: []
	};
	const codeRegions = findMarkdownCodeRegions(text);
	const matches = [];
	for (const re of [/\[embed\s+([^\]]*?[^\]/]|)\]([\s\S]*?)\[\/embed\]/gi, /\[embed\s+([^\]]*?)\/\]/gi]) {
		let match;
		while (match = re.exec(text)) {
			const start = match.index;
			if (isInsideCode(start, codeRegions)) continue;
			matches.push({
				start,
				end: start + match[0].length,
				attrs: parseCanvasAttributes(match[1] ?? "")
			});
		}
	}
	if (matches.length === 0) return {
		text,
		previews: []
	};
	matches.sort((a, b) => a.start - b.start);
	const previews = [];
	let cursor = 0;
	let stripped = "";
	for (const match of matches) {
		if (match.start < cursor) continue;
		stripped += text.slice(cursor, match.start);
		const preview = previewFromShortcode(match.attrs);
		if (!preview || includePreview && !includePreview(preview)) stripped += text.slice(match.start, match.end);
		else previews.push(preview);
		cursor = match.end;
	}
	stripped += text.slice(cursor);
	return {
		text: stripped,
		previews
	};
}
//#endregion
//#region src/shared/tool-approval-reviews.ts
const REVIEW_STATUSES = /* @__PURE__ */ new Set([
	"in_progress",
	"approved",
	"denied",
	"timed_out",
	"aborted"
]);
function boundedString(value, maxChars) {
	const text = typeof value === "string" ? value.trim() : "";
	return text ? truncateUtf16Safe(text, maxChars) : void 0;
}
function isReviewStatus(value) {
	return value !== void 0 && REVIEW_STATUSES.has(value);
}
function normalizeToolApprovalReview(value) {
	const review = asNullableRecord(value);
	const id = boundedString(review?.id, 256);
	const label = boundedString(review?.label, 80);
	const status = boundedString(review?.status, 32);
	if (!id || !label || !isReviewStatus(status)) return null;
	const riskLevel = boundedString(review?.riskLevel, 40);
	const userAuthorization = boundedString(review?.userAuthorization, 40);
	const rationale = boundedString(review?.rationale, 2e3);
	return {
		id,
		label,
		status,
		...riskLevel ? { riskLevel } : {},
		...userAuthorization ? { userAuthorization } : {},
		...rationale ? { rationale } : {}
	};
}
//#endregion
//#region src/gateway/chat-display-projection.canvas.ts
function isDisplayRouteIdentifier(value, maxChars) {
	return typeof value === "string" && value.length > 0 && value.length <= maxChars && value.trim() === value;
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
	if (isDisplayRouteIdentifier(browserTab?.targetId, 128) && isDisplayRouteIdentifier(browserTab?.profile, 128) && (browserTab?.target === "host" && browserTab.node === void 0 || browserTab?.target === "node" && isDisplayRouteIdentifier(browserTab.node, 256))) projected.browserTab = {
		targetId: browserTab.targetId,
		profile: browserTab.profile,
		target: browserTab.target,
		...browserTab.target === "node" ? { node: browserTab.node } : {},
		...typeof browserTab.url === "string" ? { url: truncateUtf16Safe(browserTab.url, 2048) } : {},
		...typeof browserTab.title === "string" ? { title: truncateUtf16Safe(browserTab.title, 512) } : {}
	};
	let truncated = false;
	for (const key of ["exitCode", "durationMs"]) {
		const value = record[key];
		if (typeof value === "number" && Number.isFinite(value)) projected[key] = value;
	}
	if (typeof record.cwd === "string") {
		const cwd = truncateChatHistoryText(record.cwd, maxChars);
		projected.cwd = cwd.text;
		truncated ||= cwd.truncated;
	}
	if (isDisplayRouteIdentifier(record.sessionKey, maxChars)) projected.sessionKey = record.sessionKey;
	for (const key of [
		"ok",
		"changed",
		"created"
	]) if (typeof record[key] === "boolean") projected[key] = record[key];
	if (typeof record.diff === "string" && record.diff.trim()) {
		const diff = truncateChatHistoryText(record.diff, maxChars);
		projected.diff = diff.text;
		truncated ||= diff.truncated;
	}
	if (Array.isArray(record.approvalReviews)) {
		const reviews = record.approvalReviews.slice(-16).flatMap((review) => normalizeToolApprovalReview(review) ?? []);
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
	if (content.some((block) => isToolResultHistoryBlockType(asOptionalObjectRecord(block)?.type))) return true;
	const hasToolCallBlock = content.some((block) => {
		const type = asOptionalObjectRecord(block)?.type;
		return isToolHistoryBlockType(type) && !isToolResultHistoryBlockType(type);
	});
	const hasToolId = typeof message.toolCallId === "string" || typeof message.tool_call_id === "string" || typeof message.toolUseId === "string" || typeof message.tool_use_id === "string";
	const hasToolName = typeof message.toolName === "string" || typeof message.tool_name === "string";
	return hasToolId && hasToolName && !hasToolCallBlock;
}
function extractChatHistoryBlockText(message) {
	const entry = asOptionalObjectRecord(message);
	if (!entry) return;
	if (typeof entry.content === "string") return entry.content;
	if (typeof entry.text === "string") return entry.text;
	if (!Array.isArray(entry.content)) return;
	const textParts = entry.content.map((block) => asOptionalObjectRecord(block)?.text).filter((value) => typeof value === "string");
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
		const typed = asOptionalObjectRecord(block);
		const existing = typed?.type === "canvas" ? asOptionalObjectRecord(typed.preview) : void 0;
		return Boolean(existing && (existing.viewId && existing.viewId === preview.viewId || existing.url && existing.url === preview.url));
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
function messageContainsToolHistoryContent(entry) {
	if (typeof entry.toolCallId === "string" || typeof entry.tool_call_id === "string" || typeof entry.toolName === "string" || typeof entry.tool_name === "string") return true;
	if (!Array.isArray(entry.content)) return false;
	return entry.content.some((block) => isToolHistoryBlockType(asOptionalObjectRecord(block)?.type));
}
function augmentChatHistoryWithCanvasBlocks(messages) {
	if (messages.length === 0) return messages;
	const next = [...messages];
	let changed = false;
	let lastAssistantIndex = -1;
	let lastRenderableAssistantIndex = -1;
	const pending = [];
	for (let index = 0; index < next.length; index++) {
		const entry = asOptionalObjectRecord(next[index]);
		if (!entry) continue;
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
export { extractChatToolResultCanvasPreview as a, messageHasToolResultShape as c, extractChatHistoryBlockText as i, projectToolResultDetails as l, appendChatCanvasBlocksToMessage as n, isToolHistoryBlockType as o, augmentChatHistoryWithCanvasBlocks as r, isToolResultHistoryBlockType as s, appendChatCanvasBlocks as t, extractCanvasShortcodes as u };
