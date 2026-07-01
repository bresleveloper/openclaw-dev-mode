//#region packages/terminal-core/src/string.ts
/** Normalize string input to lowercase, returning empty string for non-strings. */
function normalizeLowercaseStringOrEmpty(value) {
	if (typeof value !== "string") return "";
	return value.trim().toLowerCase();
}
//#endregion
export { normalizeLowercaseStringOrEmpty as t };
