import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
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
//#endregion
export { readToolErrorFlag as a, isToolResultContentType as i, isToolCallContentType as n, resolveToolUseId as o, isToolResultBlock as r, isToolCallBlock as t };
