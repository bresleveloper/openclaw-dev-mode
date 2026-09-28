import { i as isJsonObject } from "./protocol-CANUwXJ3.mjs";
import { asFiniteNumber, normalizeOptionalString as normalizeOptionalString$1, readStringField } from "openclaw/plugin-sdk/string-coerce-runtime";
import { Buffer } from "node:buffer";
//#region extensions/codex/src/app-server/event-projector-values.ts
const BIO_POLICY_SAFETY_ACCESS_BLOCK_PREFIX = "This content was flagged for possible biological risk.";
/** Decode app-server v2 findings with the Codex UI's UTF-8 limits; never truncate a steer. */
function readCodexMisalignmentReview(value) {
	if (!isJsonObject(value)) return;
	const explanation = value.detailedExplanation;
	if (typeof explanation !== "string" || !explanation.trim() || Buffer.byteLength(explanation, "utf8") > 65536) return;
	const message = isJsonObject(value.steer) ? value.steer.message : void 0;
	return {
		explanation,
		...typeof message === "string" && message.trim() && Buffer.byteLength(message, "utf8") <= 1024 ? { continuation: { message } } : {},
		...typeof value.errorType === "string" && value.errorType.trim() ? { errorType: value.errorType } : {}
	};
}
/** Project only Codex's explicit refusal contracts; other policy errors retain their own paths. */
function readCodexProviderRefusal(message, codexErrorInfo, options) {
	if (!message) return;
	if (codexErrorInfo === "cyberPolicy") return {
		category: "cyber",
		message
	};
	if (codexErrorInfo === "misalignmentPolicyViolation") {
		const review = readCodexMisalignmentReview(options?.misalignment);
		return {
			category: "misalignment",
			message,
			...review ? { review } : {},
			...options?.nativeThreadId ? { nativeThreadId: options.nativeThreadId } : {},
			...options?.nativeTurnId ? { nativeTurnId: options.nativeTurnId } : {}
		};
	}
	return message.startsWith(BIO_POLICY_SAFETY_ACCESS_BLOCK_PREFIX) ? {
		category: "bio",
		message
	} : void 0;
}
function codexProviderRefusalDetails(refusal) {
	return {
		provider: "openai",
		category: refusal.category,
		...refusal.review ? { review: refusal.review } : {},
		...refusal.nativeThreadId ? { nativeThreadId: refusal.nativeThreadId } : {},
		...refusal.nativeTurnId ? { nativeTurnId: refusal.nativeTurnId } : {}
	};
}
function readNonEmptyString(record, key) {
	return normalizeOptionalString$1(record[key]);
}
function readNonEmptyStringArray(record, key) {
	const value = record[key];
	if (!Array.isArray(value)) return [];
	const entries = [];
	for (const entry of value) {
		const normalized = normalizeOptionalString$1(entry);
		if (normalized) entries.push(normalized);
	}
	return entries;
}
function readNullableString(record, key) {
	const value = record[key];
	if (value === null) return null;
	return typeof value === "string" ? value : void 0;
}
function readNonNegativeInteger(record, key) {
	const value = asFiniteNumber(record[key]);
	return value !== void 0 && Number.isInteger(value) && value >= 0 ? value : void 0;
}
function readCodexErrorNotificationMessage(record) {
	const error = record.error;
	return isJsonObject(error) ? readStringField(error, "message") : void 0;
}
function readHookOutputEntries(value) {
	if (!Array.isArray(value)) return [];
	return value.flatMap((entry) => {
		if (!isJsonObject(entry)) return [];
		const text = readStringField(entry, "text");
		if (!text) return [];
		const kind = readStringField(entry, "kind");
		return [{
			...kind ? { kind } : {},
			text
		}];
	});
}
function splitPlanText(text) {
	return text.split(/\r?\n/).map((line) => line.trim().replace(/^[-*]\s+/, "")).filter((line) => line.length > 0);
}
function extractRawAssistantText(item) {
	const parts = (Array.isArray(item.content) ? item.content : []).flatMap((entry) => {
		if (!isJsonObject(entry)) return [];
		const type = readStringField(entry, "type");
		if (type !== "output_text" && type !== "text") return [];
		const value = readStringField(entry, "text");
		return value === void 0 ? [] : [value];
	});
	return parts.length > 0 ? parts.join("").trim() : void 0;
}
function readItemString(item, key) {
	const value = item[key];
	return typeof value === "string" ? value : void 0;
}
function readItem(value) {
	if (!isJsonObject(value)) return;
	const type = typeof value.type === "string" ? value.type : void 0;
	const id = typeof value.id === "string" ? value.id : void 0;
	if (!type || !id) return;
	return value;
}
//#endregion
//#region extensions/codex/src/app-server/event-projector-items.ts
function matchesCodexSnapshotTurn(item, turnId) {
	const itemTurnId = readItemString(item, "turnId");
	return itemTurnId === void 0 || itemTurnId === turnId;
}
function itemKind(item) {
	switch (item.type) {
		case "dynamicToolCall":
		case "mcpToolCall": return "tool";
		case "commandExecution": return "command";
		case "fileChange": return "patch";
		case "webSearch": return "search";
		case "reasoning":
		case "contextCompaction": return "analysis";
		default: return;
	}
}
function itemTitle(item) {
	switch (item.type) {
		case "commandExecution": return "Command";
		case "fileChange": return "File change";
		case "mcpToolCall": return "MCP tool";
		case "dynamicToolCall": return "Tool";
		case "webSearch": return "Web search";
		case "contextCompaction": return "Context compaction";
		case "reasoning": return "Reasoning";
		default: return item.type;
	}
}
function itemStatus(item) {
	const status = readItemString(item, "status");
	if (status === "failed" || status === "error") return "failed";
	if (status === "declined") return "blocked";
	if (status === "inProgress" || status === "in_progress" || status === "running") return "running";
	return "completed";
}
function unknownItemStatus(item) {
	const status = readItemString(item, "status");
	switch (status) {
		case void 0:
		case "completed":
		case "failed":
		case "error":
		case "declined":
		case "inProgress":
		case "in_progress":
		case "running": return;
		default: return status;
	}
}
function auditNativeToolTerminalStatus(item) {
	if (item.type === "imageView" || item.type === "sleep") return "completed";
	const status = readItemString(item, "status");
	if (status === "completed") return "completed";
	if (status === "failed" || status === "error") return "failed";
	if (status === "declined") return "blocked";
	return "unknown";
}
function auditNativeToolUnfinishedStatus(item) {
	return item.type === "webSearch" || item.type === "imageGeneration" ? "unknown" : "failed";
}
function isNonSuccessItemStatus(status) {
	return status === "failed" || status === "blocked";
}
function itemName(item) {
	if (item.type === "dynamicToolCall" && typeof item.tool === "string") return item.tool;
	if (item.type === "mcpToolCall" && typeof item.tool === "string") {
		const server = typeof item.server === "string" ? item.server : void 0;
		return server ? `${server}.${item.tool}` : item.tool;
	}
	if (item.type === "commandExecution") return "bash";
	if (item.type === "fileChange") return "apply_patch";
	if (item.type === "webSearch") return "web_search";
}
function auditNativeToolName(item) {
	if (item.type === "dynamicToolCall") return;
	const progressName = itemName(item);
	if (progressName) return progressName;
	if (item.type === "collabAgentToolCall") return typeof item.tool === "string" && item.tool.trim() ? `collab.${item.tool.trim()}` : "collab_agent";
	if (item.type === "imageGeneration") return "image_generation";
	if (item.type === "imageView") return "image_view";
	if (item.type === "sleep") return "sleep";
}
function isSideEffectingNativeToolItem(item) {
	return itemStatus(item) !== "blocked" && (isMutatingNativeToolItem(item) || item.type === "mcpToolCall");
}
function shouldSynthesizeToolProgressForItem(item) {
	switch (item.type) {
		case "commandExecution":
		case "fileChange":
		case "webSearch":
		case "mcpToolCall": return true;
		default: return false;
	}
}
function shouldRecordNativeToolTranscript(item) {
	switch (item.type) {
		case "commandExecution":
		case "fileChange":
		case "webSearch":
		case "mcpToolCall": return true;
		default: return false;
	}
}
function isMutatingNativeToolItem(item) {
	if (item.type === "commandExecution") return true;
	return item.type === "fileChange" || item.type === "collabAgentToolCall" || item.type === "imageGeneration";
}
function shouldClearTerminalPresentationForNativeItem(item) {
	switch (item.type) {
		case "collabAgentToolCall":
		case "commandExecution":
		case "fileChange":
		case "imageGeneration":
		case "imageView":
		case "mcpToolCall":
		case "webSearch": return true;
		default: return false;
	}
}
//#endregion
export { readItemString as C, readNullableString as D, readNonNegativeInteger as E, splitPlanText as O, readItem as S, readNonEmptyStringArray as T, extractRawAssistantText as _, isNonSuccessItemStatus as a, readCodexProviderRefusal as b, itemName as c, matchesCodexSnapshotTurn as d, shouldClearTerminalPresentationForNativeItem as f, codexProviderRefusalDetails as g, unknownItemStatus as h, isMutatingNativeToolItem as i, itemStatus as l, shouldSynthesizeToolProgressForItem as m, auditNativeToolTerminalStatus as n, isSideEffectingNativeToolItem as o, shouldRecordNativeToolTranscript as p, auditNativeToolUnfinishedStatus as r, itemKind as s, auditNativeToolName as t, itemTitle as u, normalizeOptionalString$1 as v, readNonEmptyString as w, readHookOutputEntries as x, readCodexErrorNotificationMessage as y };
