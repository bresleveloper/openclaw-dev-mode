import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { i as collectCompletedToolCallBlocks } from "./tool-result-pairing-Bky0eubt.mjs";
//#region src/agents/tool-call-shared.ts
const TOOL_CALL_NAME_MAX_CHARS = 64;
const TOOL_CALL_NAME_RE = /^[A-Za-z0-9_:.-]+$/;
/** Normalize an optional iterable of allowed tool names for lookup. */
function normalizeAllowedToolNames(allowedToolNames) {
	if (!allowedToolNames) return null;
	const normalized = /* @__PURE__ */ new Set();
	for (const name of allowedToolNames) {
		if (typeof name !== "string") continue;
		const trimmed = name.trim();
		if (!trimmed) continue;
		normalized.add(normalizeLowercaseStringOrEmpty(trimmed));
	}
	return normalized.size > 0 ? normalized : null;
}
/** Return whether a model-supplied tool call name is syntactically and policy allowed. */
function isAllowedToolCallName(name, allowedToolNames) {
	if (typeof name !== "string") return false;
	const trimmed = name.trim();
	if (!trimmed) return false;
	if (trimmed.length > TOOL_CALL_NAME_MAX_CHARS || !TOOL_CALL_NAME_RE.test(trimmed)) return false;
	if (!allowedToolNames) return true;
	return allowedToolNames.has(normalizeLowercaseStringOrEmpty(trimmed));
}
/** Completed replay facts survive capability removal without granting live tool authority. */
function createCompletedToolCallPredicate(messages) {
	const completed = collectCompletedToolCallBlocks(messages);
	return (block) => completed.has(block) && isAllowedToolCallName(block.name, null);
}
//#endregion
export { isAllowedToolCallName as n, normalizeAllowedToolNames as r, createCompletedToolCallPredicate as t };
