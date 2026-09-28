import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
//#region src/shared/tool-block-contract.ts
const TOOL_CALL_BLOCK_TYPES = /* @__PURE__ */ new Set([
	"toolCall",
	"toolUse",
	"functionCall",
	"tool_call",
	"tool_use",
	"function_call"
]);
const TOOL_RESULT_BLOCK_TYPES = /* @__PURE__ */ new Set([
	"toolResult",
	"tool_result",
	"tool_result_error",
	"function_call_output"
]);
function isToolCallBlockType(value) {
	return typeof value === "string" && TOOL_CALL_BLOCK_TYPES.has(value);
}
function isToolResultBlockType(value) {
	return typeof value === "string" && TOOL_RESULT_BLOCK_TYPES.has(value);
}
function isContractToolCallBlock(value) {
	return isRecord(value) && isToolCallBlockType(value.type);
}
function isContractToolResultBlock(value) {
	return isRecord(value) && isToolResultBlockType(value.type);
}
function readToolCallName(block) {
	for (const candidate of [block, block.function]) {
		const direct = normalizeOptionalString(candidate);
		if (direct) return direct;
		if (!isRecord(candidate)) continue;
		for (const key of [
			"name",
			"toolName",
			"tool_name",
			"functionName",
			"function_name"
		]) {
			const name = normalizeOptionalString(candidate[key]);
			if (name) return name;
		}
	}
}
function collectToolCallIds(block) {
	const ids = /* @__PURE__ */ new Set();
	for (const key of [
		"call_id",
		"tool_call_id",
		"toolCallId",
		"tool_use_id",
		"toolUseId",
		"id"
	]) {
		const id = normalizeOptionalString(block[key]);
		if (id) ids.add(id);
	}
	return [...ids];
}
//#endregion
export { readToolCallName as a, isToolCallBlockType as i, isContractToolCallBlock as n, isContractToolResultBlock as r, collectToolCallIds as t };
