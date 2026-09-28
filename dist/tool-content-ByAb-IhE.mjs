import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
//#region src/chat/tool-content.ts
const TOOL_USE_ID_FIELDS = [
	"id",
	"tool_call_id",
	"toolCallId",
	"tool_use_id",
	"toolUseId"
];
function normalizeToolContentType(value) {
	return typeof value === "string" ? value.toLowerCase() : "";
}
/** Accepts tool-call content type spellings used by provider SDKs and persisted transcripts. */
function isToolCallContentType(value) {
	const type = normalizeToolContentType(value);
	return type === "toolcall" || type === "tool_call" || type === "tooluse" || type === "tool_use";
}
/** Accepts tool-result content type spellings used by provider SDKs and persisted transcripts. */
function isToolResultContentType(value) {
	const type = normalizeToolContentType(value);
	return type === "toolresult" || type === "tool_result";
}
/** Narrows unknown chat content blocks to provider-shaped tool-call blocks. */
function isToolCallBlock(block) {
	return isToolCallContentType(block.type);
}
/** Narrows unknown chat content blocks to provider-shaped tool-result blocks. */
function isToolResultBlock(block) {
	return isToolResultContentType(block.type);
}
/** Reads the stable tool-use id across snake_case and camelCase provider field names. */
function resolveToolUseId(block) {
	for (const field of TOOL_USE_ID_FIELDS) {
		const id = normalizeOptionalString(block[field]);
		if (id) return id;
	}
}
function readToolErrorFlag(value) {
	const raw = value.isError ?? value.is_error;
	return typeof raw === "boolean" ? raw : void 0;
}
const TOOL_NOT_FOUND_PATTERN = /^tool not found\.?$/i;
const MAX_ERROR_DETECT_CHARS = 2e4;
const TOOL_ERROR_STATUSES = /* @__PURE__ */ new Set([
	"error",
	"failed",
	"timeout"
]);
function hasToolErrorStatus(value) {
	return typeof value === "string" && TOOL_ERROR_STATUSES.has(value.trim().toLowerCase());
}
function isToolErrorOutput(outputText) {
	if (!outputText) return false;
	const trimmed = outputText.trim();
	if (!trimmed) return false;
	if (TOOL_NOT_FOUND_PATTERN.test(trimmed)) return true;
	if (trimmed.length > MAX_ERROR_DETECT_CHARS) return false;
	if (!trimmed.startsWith("{") || !trimmed.endsWith("}")) return false;
	let parsed;
	try {
		parsed = JSON.parse(trimmed);
	} catch {
		return false;
	}
	if (!isRecord(parsed)) return false;
	const obj = parsed;
	const explicitErrorFlag = readToolErrorFlag(obj);
	if (explicitErrorFlag !== void 0) return explicitErrorFlag;
	if ("error" in obj) {
		const value = obj.error;
		if (typeof value === "string") return value.trim().length > 0;
		if (typeof value === "boolean") return value;
		if (value && typeof value === "object") return true;
	}
	return hasToolErrorStatus(obj.status);
}
//#endregion
export { isToolResultContentType as a, isToolResultBlock as i, isToolCallContentType as n, readToolErrorFlag as o, isToolErrorOutput as r, resolveToolUseId as s, isToolCallBlock as t };
