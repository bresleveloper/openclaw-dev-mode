import { r as isJsonObject } from "./protocol-NX-eGZn-.mjs";
import { n as extractRawResponseItemText } from "./event-projector-values-BxTVI6kj.mjs";
import { asSafeIntegerInRange, readStringField } from "openclaw/plugin-sdk/string-coerce-runtime";
import { normalizeUsage } from "openclaw/plugin-sdk/agent-harness-runtime";
// extensions/codex/src/app-server/attempt-notifications.ts
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
function readNotificationItemId(notification) {
	if (!isJsonObject(notification.params)) return;
	const item = isJsonObject(notification.params.item) ? notification.params.item : void 0;
	return (item ? readStringField(item, "id") : void 0) ?? readStringField(notification.params, "itemId") ?? readStringField(notification.params, "id");
}
function completePendingOpenClawDynamicToolNotification(notification, pendingOpenClawDynamicToolCompletionIds) {
	if (notification.method !== "item/completed" || !isJsonObject(notification.params)) return;
	const itemId = readNotificationItemId(notification);
	if (!itemId || !pendingOpenClawDynamicToolCompletionIds.has(itemId)) return;
	const item = isJsonObject(notification.params.item) ? notification.params.item : void 0;
	const itemType = item ? readStringField(item, "type") : void 0;
	if (itemType === void 0 || itemType === "dynamicToolCall") pendingOpenClawDynamicToolCompletionIds.delete(itemId);
}
function isRawFunctionToolOutputCompletionNotification(notification) {
	const item = readCompletedRawItem(notification);
	return item ? readStringField(item, "type") === "function_call_output" : false;
}
function isTerminalTurnStatus(status) {
	return status === "completed" || status === "interrupted" || status === "failed";
}
/** Detects Codex's interrupted-turn marker, not user-authored copies of it. */
function isCodexTurnAbortMarkerNotification(notification, options = {}) {
	const item = readCompletedRawItem(notification);
	const role = item ? readStringField(item, "role") : void 0;
	if (!item || readStringField(item, "type") !== "message" || role !== "user" && role !== "developer") return false;
	const text = extractRawResponseItemText(item, "input_text") ?? "";
	if (role === "user" && options.currentPromptText?.trim() === text) return false;
	return text.startsWith(CODEX_TURN_ABORT_MARKER_START) && text.endsWith(CODEX_TURN_ABORT_MARKER_END);
}
function readCodexNotificationItem(params) {
	if (!isJsonObject(params) || !isJsonObject(params.item)) return;
	const item = params.item;
	return typeof item.id === "string" && typeof item.type === "string" ? item : void 0;
}
/** Reads the stable call id from a model-emitted raw tool item. */
function readRawResponseToolCallId(notification) {
	const item = readCompletedRawItem(notification);
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
function readCompletedRawItem(notification) {
	if (notification.method !== "rawResponseItem/completed" || !isJsonObject(notification.params)) return;
	return isJsonObject(notification.params.item) ? notification.params.item : void 0;
}
// extensions/codex/src/app-server/event-projector-usage.ts
function readTokenCount(record, key) {
	return asSafeIntegerInRange(record[key], { min: 0 });
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
function codexCompactionContextUsage(tokensAfter) {
	return tokensAfter === void 0 ? { state: "unavailable" } : {
		state: "available",
		promptTokens: tokensAfter,
		totalTokens: tokensAfter
	};
}
function normalizeCodexResponseTokenUsage(record) {
	const totalTokens = readTokenCount(record, "totalTokens");
	const inputTokens = readTokenCount(record, "inputTokens");
	const cacheRead = readTokenCount(record, "cachedInputTokens");
	const output = readTokenCount(record, "outputTokens");
	const reasoningTokens = readTokenCount(record, "reasoningOutputTokens");
	const reportedCacheWrite = readTokenCount(record, "cacheWriteInputTokens");
	const cacheWrite = record.cacheWriteInputTokens === void 0 ? 0 : reportedCacheWrite;
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
		usage: {
			...usage,
			contextUsage: hasCoherentContext ? {
				state: "available",
				promptTokens: inputTokens,
				totalTokens
			} : { state: "unavailable" }
		},
		observedUsage: {
			...hasCoherentInput && reportedCacheWrite !== void 0 ? { input: inputTokens - cacheRead - reportedCacheWrite } : {},
			...inputTokens !== void 0 ? { promptTokens: inputTokens } : {},
			...output !== void 0 ? { output } : {},
			...cacheRead !== void 0 ? { cacheRead } : {},
			...reportedCacheWrite !== void 0 ? { cacheWrite: reportedCacheWrite } : {},
			...reasoningTokens !== void 0 ? { reasoningTokens } : {},
			...totalTokens !== void 0 ? { total: totalTokens } : {}
		}
	};
}
var CodexUsageProjection = class {
	constructor() {
		this.responseIds = /* @__PURE__ */ new Set();
	}
	get usage() {
		const usage = this.responseUsage ?? this.threadUsage;
		return usage || this.contextUsage ? {
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
	beginCompaction() {
		this.compactionContext = { completed: false };
	}
	completeCompaction() {
		const tokensAfter = this.compactionContext?.tokensAfter;
		this.compactionContext = {
			tokensAfter,
			completed: true
		};
		this.contextUsage = codexCompactionContextUsage(tokensAfter);
		return tokensAfter;
	}
	recordThread(params) {
		const snapshot = readCodexThreadContextSnapshot(params);
		if (this.compactionContext) {
			if (!this.compactionContext.completed) this.compactionContext.tokensAfter = snapshot.activeContextTokens;
			return snapshot;
		}
		const tokenUsage = isJsonObject(params.tokenUsage) ? params.tokenUsage : void 0;
		const last = tokenUsage && isJsonObject(tokenUsage.last) ? tokenUsage.last : void 0;
		const usage = last ? normalizeCodexResponseTokenUsage(last)?.usage : void 0;
		this.threadUsage = usage ?? this.threadUsage;
		if (!this.responseUsage && usage) this.contextUsage = usage.contextUsage;
		return snapshot;
	}
	record(params, reportOutputTokens) {
		const responseId = readStringField(params, "responseId");
		if (!responseId || this.responseIds.has(responseId)) return;
		this.responseIds.add(responseId);
		if (this.compactionContext?.completed) this.compactionContext = void 0;
		const normalized = isJsonObject(params.usage) ? normalizeCodexResponseTokenUsage(params.usage) : void 0;
		const usage = normalized?.usage;
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
		return {
			responseId,
			usage: normalized?.observedUsage
		};
	}
};
export { isCodexTurnAbortMarkerNotification as a, readCodexNotificationItem as c, completePendingOpenClawDynamicToolNotification as i, readRawResponseToolCallId as l, codexCompactionContextUsage as n, isRawFunctionToolOutputCompletionNotification as o, readCodexThreadContextSnapshot as r, isTerminalTurnStatus as s, CodexUsageProjection as t, updateActiveTurnItemIds as u };
