//#region src/auto-reply/reply/history-limit.ts
const DEFAULT_GROUP_HISTORY_LIMIT = 50;
/** Hard cap for prompt-injected history windows. JSON-schema integer maximum is not a window. */
const MAX_PROMPT_HISTORY_LIMIT = 200;
/** Resolves one bounded observed-message window without rewriting saved configuration. */
function resolvePromptHistoryLimit(configured, fallback = 50) {
	const isSchemaMaximum = typeof configured === "number" && Number.isInteger(configured) && configured >= Number.MAX_SAFE_INTEGER;
	const selected = typeof configured === "number" && Number.isFinite(configured) && !isSchemaMaximum ? configured : fallback;
	return Number.isFinite(selected) ? Math.min(Math.max(0, Math.trunc(selected)), MAX_PROMPT_HISTORY_LIMIT) : 0;
}
//#endregion
export { resolvePromptHistoryLimit as n, DEFAULT_GROUP_HISTORY_LIMIT as t };
