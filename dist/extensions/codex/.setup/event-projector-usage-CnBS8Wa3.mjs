import { i as isJsonObject } from "./protocol-CANUwXJ3.mjs";
import { asSafeIntegerInRange, readStringField } from "openclaw/plugin-sdk/string-coerce-runtime";
import { normalizeUsage } from "openclaw/plugin-sdk/agent-harness-runtime";
//#region extensions/codex/src/app-server/attempt-notifications.ts
const CODEX_TURN_ABORT_MARKER_START = "<turn_aborted>";
const CODEX_TURN_ABORT_MARKER_END = "</turn_aborted>";
/** Tracks actual native items for explicit terminal-tool batching. */
function updateActiveTurnItemIds(notification, activeItemIds) {
	if (notification.method !== "item/started" && notification.method !== "item/completed") return;
	const itemId = readNotificationItemId(notification);
	if (!itemId) return;
	if (notification.method === "item/started") {
		activeItemIds.add(itemId);
		return;
	}
	activeItemIds.delete(itemId);
}
/** Reads an item id from supported notification envelope shapes. */
function readNotificationItemId(notification) {
	if (!isJsonObject(notification.params)) return;
	const item = isJsonObject(notification.params.item) ? notification.params.item : void 0;
	return (item ? readStringField(item, "id") : void 0) ?? readStringField(notification.params, "itemId") ?? readStringField(notification.params, "id");
}
/** Detects completion for an OpenClaw dynamic tool result still awaited by Codex. */
function isPendingOpenClawDynamicToolCompletionNotification(notification, pendingOpenClawDynamicToolCompletionIds) {
	if (notification.method !== "item/completed" || !isJsonObject(notification.params)) return false;
	const itemId = readNotificationItemId(notification);
	if (!itemId || !pendingOpenClawDynamicToolCompletionIds.has(itemId)) return false;
	const item = isJsonObject(notification.params.item) ? notification.params.item : void 0;
	const itemType = item ? readStringField(item, "type") : void 0;
	return itemType === void 0 || itemType === "dynamicToolCall";
}
function isRawFunctionToolOutputCompletionNotification(notification) {
	if (notification.method !== "rawResponseItem/completed" || !isJsonObject(notification.params)) return false;
	const item = isJsonObject(notification.params.item) ? notification.params.item : void 0;
	return item ? readStringField(item, "type") === "function_call_output" : false;
}
/** Returns true for terminal app-server thread status strings. */
function isTerminalTurnStatus(status) {
	return status === "completed" || status === "interrupted" || status === "failed";
}
/** Detects Codex's interrupted-turn marker, not user-authored copies of it. */
function isCodexTurnAbortMarkerNotification(notification, options = {}) {
	if (notification.method !== "rawResponseItem/completed" || !isJsonObject(notification.params)) return false;
	const item = notification.params.item;
	const role = isJsonObject(item) ? readStringField(item, "role") : void 0;
	if (!isJsonObject(item) || readStringField(item, "type") !== "message" || role !== "user" && role !== "developer") return false;
	const text = extractRawResponseItemText(item).trim();
	const currentPromptTexts = [options.currentPromptText, ...options.currentPromptTexts ?? []].filter(isNonEmptyString).map((prompt) => prompt.trim());
	if (role === "user" && currentPromptTexts.includes(text)) return false;
	return readCodexTurnAbortMarkerBody(text) !== void 0;
}
function readCodexTurnAbortMarkerBody(text) {
	if (!text.startsWith(CODEX_TURN_ABORT_MARKER_START) || !text.endsWith(CODEX_TURN_ABORT_MARKER_END)) return;
	return text.slice(14, -15).trim();
}
function extractRawResponseItemText(item) {
	const content = item.content;
	if (!Array.isArray(content)) return "";
	return content.flatMap((entry) => {
		if (!isJsonObject(entry)) return [];
		const type = readStringField(entry, "type");
		if (type !== "input_text" && type !== "text") return [];
		const text = readStringField(entry, "text");
		return text ? [text] : [];
	}).join("");
}
/** Reads a typed Codex item from notification params when id/type are present. */
function readCodexNotificationItem(params) {
	if (!isJsonObject(params) || !isJsonObject(params.item)) return;
	const item = params.item;
	return typeof item.id === "string" && typeof item.type === "string" ? item : void 0;
}
/** Reads the stable call id from a model-emitted raw tool item. */
function readRawResponseToolCallId(notification) {
	if (notification.method !== "rawResponseItem/completed" || !isJsonObject(notification.params)) return;
	const item = isJsonObject(notification.params.item) ? notification.params.item : void 0;
	if (!item) return;
	switch (readStringField(item, "type")) {
		case "custom_tool_call":
		case "function_call":
		case "local_shell_call":
		case "tool_search_call": return readStringField(item, "call_id");
		case "image_generation_call":
		case "web_search_call": return readStringField(item, "id");
		default: return;
	}
}
/** Maps Codex item types to the tool name shown in execution progress. */
function codexExecutionToolName(item) {
	if (item.type === "dynamicToolCall" && typeof item.tool === "string") return item.tool;
	if (item.type === "mcpToolCall" && typeof item.tool === "string") {
		const server = typeof item.server === "string" && item.server ? item.server : void 0;
		return server ? `${server}.${item.tool}` : item.tool;
	}
	if (item.type === "commandExecution") return "bash";
	if (item.type === "fileChange") return "apply_patch";
	if (item.type === "webSearch") return "web_search";
}
function isNonEmptyString(value) {
	return typeof value === "string" && value.length > 0;
}
//#endregion
//#region extensions/codex/src/app-server/event-projector-usage.ts
function readTokenCount(record, key) {
	return asSafeIntegerInRange(record[key], { min: 0 });
}
function readCodexThreadTokenUsage(params) {
	const tokenUsage = isJsonObject(params.tokenUsage) ? params.tokenUsage : void 0;
	const last = tokenUsage && isJsonObject(tokenUsage.last) ? tokenUsage.last : void 0;
	return last ? normalizeCodexResponseTokenUsage(last) : void 0;
}
function readCodexThreadContextSnapshot(params) {
	const tokenUsage = isJsonObject(params.tokenUsage) ? params.tokenUsage : void 0;
	const last = tokenUsage && isJsonObject(tokenUsage.last) ? tokenUsage.last : void 0;
	const modelContextWindow = tokenUsage ? readTokenCount(tokenUsage, "modelContextWindow") : void 0;
	const activeContextTokens = last ? readTokenCount(last, "totalTokens") : void 0;
	const inputTokens = last ? readTokenCount(last, "inputTokens") : void 0;
	const cachedInputTokens = last ? readTokenCount(last, "cachedInputTokens") : void 0;
	const cacheWriteInputTokens = last ? readTokenCount(last, "cacheWriteInputTokens") : void 0;
	const reasoningOutputTokens = last ? readTokenCount(last, "reasoningOutputTokens") : void 0;
	return {
		...activeContextTokens !== void 0 ? { activeContextTokens } : {},
		...cachedInputTokens !== void 0 ? { cachedInputTokens } : {},
		...cacheWriteInputTokens !== void 0 ? { cacheWriteInputTokens } : {},
		...inputTokens !== void 0 ? { inputTokens } : {},
		...modelContextWindow && modelContextWindow > 0 ? { modelContextWindow } : {},
		...inputTokens !== void 0 ? { promptTokens: inputTokens } : {},
		...reasoningOutputTokens !== void 0 ? { reasoningOutputTokens } : {}
	};
}
function normalizeCodexResponseTokenUsage(record) {
	const totalTokens = readTokenCount(record, "totalTokens");
	const inputTokens = readTokenCount(record, "inputTokens");
	const cacheRead = readTokenCount(record, "cachedInputTokens");
	const output = readTokenCount(record, "outputTokens");
	const reasoningTokens = readTokenCount(record, "reasoningOutputTokens");
	const cacheWrite = record.cacheWriteInputTokens === void 0 ? 0 : readTokenCount(record, "cacheWriteInputTokens");
	const hasCoherentInput = inputTokens !== void 0 && cacheRead !== void 0 && cacheWrite !== void 0 && cacheRead + cacheWrite <= inputTokens;
	const hasCoherentContext = hasCoherentInput && totalTokens !== void 0 && output !== void 0 && totalTokens === inputTokens + output;
	const usage = normalizeUsage({
		input: hasCoherentInput ? inputTokens - cacheRead - cacheWrite : void 0,
		output,
		cacheRead,
		cacheWrite,
		reasoningTokens,
		total: totalTokens
	});
	if (!usage) return;
	return {
		...usage,
		contextUsage: hasCoherentContext ? {
			state: "available",
			promptTokens: inputTokens,
			totalTokens
		} : { state: "unavailable" }
	};
}
var CodexUsageProjection = class {
	constructor() {
		this.responseIds = /* @__PURE__ */ new Set();
	}
	get usage() {
		const usage = this.responseUsage ?? this.threadUsage;
		return usage ? {
			...usage,
			contextUsage: this.contextUsage
		} : void 0;
	}
	get modelIterations() {
		return this.responseIds.size;
	}
	invalidateContext() {
		this.contextUsage = { state: "unavailable" };
	}
	recordThread(params) {
		const usage = readCodexThreadTokenUsage(params);
		this.threadUsage = usage ?? this.threadUsage;
		if (!this.responseUsage && usage) this.contextUsage = usage.contextUsage;
		return readCodexThreadContextSnapshot(params);
	}
	record(params, reportOutputTokens) {
		const responseId = readStringField(params, "responseId");
		if (!responseId || this.responseIds.has(responseId)) return;
		this.responseIds.add(responseId);
		const usage = isJsonObject(params.usage) ? normalizeCodexResponseTokenUsage(params.usage) : void 0;
		this.contextUsage = usage?.contextUsage ?? { state: "unavailable" };
		this.responseUsage ??= {};
		for (const field of [
			"input",
			"output",
			"cacheRead",
			"cacheWrite",
			"reasoningTokens",
			"total"
		]) if (usage?.[field] !== void 0) this.responseUsage[field] = (this.responseUsage[field] ?? 0) + usage[field];
		const outputTokens = usage?.output;
		if (outputTokens !== void 0) reportOutputTokens?.(outputTokens);
	}
};
//#endregion
export { isPendingOpenClawDynamicToolCompletionNotification as a, readCodexNotificationItem as c, updateActiveTurnItemIds as d, isCodexTurnAbortMarkerNotification as i, readNotificationItemId as l, readCodexThreadContextSnapshot as n, isRawFunctionToolOutputCompletionNotification as o, codexExecutionToolName as r, isTerminalTurnStatus as s, CodexUsageProjection as t, readRawResponseToolCallId as u };
