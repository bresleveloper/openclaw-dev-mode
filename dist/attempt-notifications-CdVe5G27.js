import { t as asBoolean } from "./boolean-CrriykWV.js";
import "./string-coerce-runtime-BiZzULo_.js";
import { n as isJsonObject } from "./protocol-dh-ETiNd.js";
import { B as isCodexNotificationForTurn } from "./thread-lifecycle-Dape8CUT.js";
//#region extensions/codex/src/app-server/attempt-notifications.ts
/**
* Predicates and readers for Codex app-server notification envelopes.
*/
const CODEX_TURN_ABORT_MARKER_START = "<turn_aborted>";
const CODEX_TURN_ABORT_MARKER_END = "</turn_aborted>";
const CODEX_INTERRUPTED_USER_GUIDANCE = "The user interrupted the previous turn on purpose. Any running unified exec processes may still be running in the background. If any tools/commands were aborted, they may have partially executed.";
const CODEX_INTERRUPTED_DEVELOPER_GUIDANCE = "The previous turn was interrupted on purpose. Any running unified exec processes may still be running in the background. If any tools/commands were aborted, they may have partially executed.";
/** Builds compact activity metadata for watchdog and diagnostic updates. */
function describeNotificationActivity(notification) {
	if (!isJsonObject(notification.params)) return { lastNotificationMethod: notification.method };
	if (notification.method !== "rawResponseItem/completed") return { lastNotificationMethod: notification.method };
	const item = isJsonObject(notification.params.item) ? notification.params.item : void 0;
	if (!item) return { lastNotificationMethod: notification.method };
	return {
		lastNotificationMethod: notification.method,
		lastNotificationItemId: readString(item, "id"),
		lastNotificationItemType: readString(item, "type"),
		lastNotificationItemRole: readString(item, "role"),
		lastAssistantTextPreview: readRawAssistantTextPreview(item)
	};
}
/** Tracks active app-server item ids from item start/completion notifications. */
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
function isCompletedAssistantNotification(notification) {
	if (!isJsonObject(notification.params)) return false;
	if (notification.method !== "item/completed") return false;
	const item = isJsonObject(notification.params.item) ? notification.params.item : void 0;
	return Boolean(item && readString(item, "type") === "agentMessage" && readString(item, "phase") !== "commentary");
}
/** Returns true for completed app-server reasoning items. */
function isReasoningItemCompletionNotification(notification) {
	if (!isJsonObject(notification.params) || notification.method !== "item/completed") return false;
	const item = isJsonObject(notification.params.item) ? notification.params.item : void 0;
	return item ? readString(item, "type") === "reasoning" : false;
}
/** Returns true for completed assistant commentary items. */
function isAssistantCommentaryCompletionNotification(notification) {
	if (!isJsonObject(notification.params) || notification.method !== "item/completed") return false;
	const item = isJsonObject(notification.params.item) ? notification.params.item : void 0;
	return Boolean(item && readString(item, "type") === "agentMessage" && readString(item, "phase") === "commentary");
}
/** Returns true for completed raw response reasoning items. */
function isRawReasoningCompletionNotification(notification) {
	if (!isJsonObject(notification.params) || notification.method !== "rawResponseItem/completed") return false;
	const item = isJsonObject(notification.params.item) ? notification.params.item : void 0;
	return item ? readString(item, "type") === "reasoning" : false;
}
/** Returns true for streamed app-server reasoning progress. */
function isReasoningProgressNotification(notification) {
	return notification.method === "item/reasoning/textDelta" || notification.method === "item/reasoning/summaryTextDelta" || notification.method === "item/reasoning/summaryPartAdded";
}
/** Returns true when assistant completion can release the short idle watch. */
function isAssistantCompletionReleaseNotification(notification, turnCrossedToolHandoff) {
	if (isCompletedAssistantNotification(notification)) return true;
	return !turnCrossedToolHandoff && isRawAssistantCompletionNotification(notification);
}
/** Returns true when a notification proves assistant output is still active. */
function shouldDisarmAssistantCompletionIdleWatch(notification) {
	if (!isJsonObject(notification.params)) return false;
	if (notification.method === "item/started") return true;
	if (notification.method === "item/agentMessage/delta") return true;
	return false;
}
/** Reads an item id from supported notification envelope shapes. */
function readNotificationItemId(notification) {
	if (!isJsonObject(notification.params)) return;
	const item = isJsonObject(notification.params.item) ? notification.params.item : void 0;
	return (item ? readString(item, "id") : void 0) ?? readString(notification.params, "itemId") ?? readString(notification.params, "id");
}
/** Detects completion for an OpenClaw dynamic tool result still awaited by Codex. */
function isPendingOpenClawDynamicToolCompletionNotification(notification, pendingOpenClawDynamicToolCompletionIds) {
	if (notification.method !== "item/completed" || !isJsonObject(notification.params)) return false;
	const itemId = readNotificationItemId(notification);
	if (!itemId || !pendingOpenClawDynamicToolCompletionIds.has(itemId)) return false;
	const item = isJsonObject(notification.params.item) ? notification.params.item : void 0;
	const itemType = item ? readString(item, "type") : void 0;
	return itemType === void 0 || itemType === "dynamicToolCall";
}
/** Returns true for raw response tool-output completion notifications. */
function isRawToolOutputCompletionNotification(notification) {
	if (notification.method !== "rawResponseItem/completed" || !isJsonObject(notification.params)) return false;
	const item = isJsonObject(notification.params.item) ? notification.params.item : void 0;
	switch (item ? readString(item, "type") : void 0) {
		case "custom_tool_call_output":
		case "function_call_output": return true;
		default: return false;
	}
}
function isRawFunctionToolOutputCompletionNotification(notification) {
	if (notification.method !== "rawResponseItem/completed" || !isJsonObject(notification.params)) return false;
	const item = isJsonObject(notification.params.item) ? notification.params.item : void 0;
	return item ? readString(item, "type") === "function_call_output" : false;
}
/** Returns true for progress on Codex-native tool item types. */
function isNativeToolProgressNotification(notification) {
	if (notification.method !== "item/started" && notification.method !== "item/completed" && notification.method !== "item/updated") return false;
	if (!isJsonObject(notification.params)) return false;
	const item = isJsonObject(notification.params.item) ? notification.params.item : void 0;
	switch (item ? readString(item, "type") : void 0) {
		case "commandExecution":
		case "fileChange":
		case "mcpToolCall":
		case "webSearch": return true;
		default: return false;
	}
}
/** Returns true for raw native response stream delta events. */
function isNativeResponseStreamDeltaNotification(notification) {
	return notification.method.startsWith("response.") && notification.method.endsWith(".delta");
}
/** Returns true for file-change patch update notifications. */
function isFileChangePatchUpdatedNotification(notification) {
	return notification.method === "item/fileChange/patchUpdated" && isJsonObject(notification.params);
}
/** Returns true for raw assistant message progress with readable text. */
function isRawAssistantProgressNotification(notification) {
	if (notification.method !== "rawResponseItem/completed" || !isJsonObject(notification.params)) return false;
	const item = isJsonObject(notification.params.item) ? notification.params.item : void 0;
	return Boolean(item && readString(item, "type") === "message" && readString(item, "role") === "assistant" && readRawAssistantTextPreview(item));
}
/** Returns true for raw assistant completion outside commentary phase. */
function isRawAssistantCompletionNotification(notification) {
	if (!isRawAssistantProgressNotification(notification) || !isJsonObject(notification.params)) return false;
	const item = isJsonObject(notification.params.item) ? notification.params.item : void 0;
	return Boolean(item && readString(item, "phase") !== "commentary");
}
function readRawAssistantTextPreview(item) {
	if (readString(item, "role") !== "assistant" || !Array.isArray(item.content)) return;
	const text = item.content.flatMap((content) => {
		if (!isJsonObject(content)) return [];
		const contentText = readString(content, "text");
		return contentText ? [contentText] : [];
	}).join("\n").trim();
	if (!text) return;
	return text.length > 240 ? `${text.slice(0, 237)}...` : text;
}
/** Returns true when notification params correlate to a specific thread/turn. */
function isTurnNotification(value, threadId, turnId) {
	return isCodexNotificationForTurn(value, threadId, turnId);
}
/** Returns true when a correlated notification belongs to another active run. */
function isCodexNotificationOutsideActiveRun(correlation) {
	if (!Boolean(correlation.threadId || correlation.nestedTurnThreadId)) return false;
	if (!correlation.matchesActiveThread) return true;
	return Boolean(correlation.turnId || correlation.nestedTurnId) && correlation.matchesActiveTurn === false;
}
/** Checks request params that must contain the current thread and turn ids. */
function isCurrentThreadTurnRequestParams(value, threadId, turnId) {
	if (!isJsonObject(value)) return false;
	return readString(value, "threadId") === threadId && readString(value, "turnId") === turnId;
}
/** Checks approval request params, accepting `conversationId` as thread id. */
function isCurrentApprovalTurnRequestParams(value, threadId, turnId) {
	if (!isJsonObject(value)) return false;
	return (readString(value, "threadId") ?? readString(value, "conversationId")) === threadId && readString(value, "turnId") === turnId;
}
/** Checks request params where `turnId` may be omitted or null for the thread. */
function isCurrentThreadOptionalTurnRequestParams(value, threadId, turnId) {
	if (!isJsonObject(value) || readString(value, "threadId") !== threadId) return false;
	const requestTurnId = value.turnId;
	return requestTurnId === null || requestTurnId === void 0 || requestTurnId === turnId;
}
/** Returns true for app-server error notifications that will retry. */
function isRetryableErrorNotification(value) {
	if (!isJsonObject(value)) return false;
	return readBoolean(value, "willRetry") === true || readBoolean(value, "will_retry") === true;
}
/** Returns true for terminal app-server thread status strings. */
function isTerminalTurnStatus(status) {
	return status === "completed" || status === "interrupted" || status === "failed";
}
/**
* Detects Codex's synthetic interrupted-turn marker while ignoring the current
* user prompt echoed through raw response events.
*/
function isCodexTurnAbortMarkerNotification(notification, options = {}) {
	if (notification.method !== "rawResponseItem/completed" || !isJsonObject(notification.params)) return false;
	const item = notification.params.item;
	const role = isJsonObject(item) ? readString(item, "role") : void 0;
	if (!isJsonObject(item) || role !== "user" && role !== "developer") return false;
	const text = extractRawResponseItemText(item).trim();
	const currentPromptTexts = [options.currentPromptText, ...options.currentPromptTexts ?? []].filter(isNonEmptyString).map((prompt) => prompt.trim());
	if (role === "user" && currentPromptTexts.includes(text)) return false;
	const markerBody = readCodexTurnAbortMarkerBody(text);
	return markerBody === CODEX_INTERRUPTED_USER_GUIDANCE || markerBody === CODEX_INTERRUPTED_DEVELOPER_GUIDANCE;
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
		const type = readString(entry, "type");
		if (type !== "input_text" && type !== "text") return [];
		const text = readString(entry, "text");
		return text ? [text] : [];
	}).join("");
}
function readString(record, key) {
	const value = record[key];
	return typeof value === "string" ? value : void 0;
}
function readBoolean(record, key) {
	return asBoolean(record[key]);
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
	switch (readString(item, "type")) {
		case "custom_tool_call":
		case "function_call":
		case "local_shell_call":
		case "tool_search_call": return readString(item, "call_id");
		case "image_generation_call":
		case "web_search_call": return readString(item, "id");
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
export { readCodexNotificationItem as C, updateActiveTurnItemIds as D, shouldDisarmAssistantCompletionIdleWatch as E, isTurnNotification as S, readRawResponseToolCallId as T, isRawToolOutputCompletionNotification as _, isCodexNotificationOutsideActiveRun as a, isRetryableErrorNotification as b, isCurrentThreadOptionalTurnRequestParams as c, isNativeResponseStreamDeltaNotification as d, isNativeToolProgressNotification as f, isRawReasoningCompletionNotification as g, isRawFunctionToolOutputCompletionNotification as h, isAssistantCompletionReleaseNotification as i, isCurrentThreadTurnRequestParams as l, isRawAssistantProgressNotification as m, describeNotificationActivity as n, isCodexTurnAbortMarkerNotification as o, isPendingOpenClawDynamicToolCompletionNotification as p, isAssistantCommentaryCompletionNotification as r, isCurrentApprovalTurnRequestParams as s, codexExecutionToolName as t, isFileChangePatchUpdatedNotification as u, isReasoningItemCompletionNotification as v, readNotificationItemId as w, isTerminalTurnStatus as x, isReasoningProgressNotification as y };
