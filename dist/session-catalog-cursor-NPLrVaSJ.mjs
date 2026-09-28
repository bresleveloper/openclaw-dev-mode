//#region extensions/anthropic/session-catalog-cursor.ts
const CLAUDE_SESSION_CURSOR_MAX_LENGTH = 256;
function isExactClaudeSessionCursor(value) {
	return typeof value === "string" && value.length > 0 && value.length <= CLAUDE_SESSION_CURSOR_MAX_LENGTH && value === value.trim();
}
//#endregion
export { isExactClaudeSessionCursor as t };
