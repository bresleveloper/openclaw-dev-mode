//#region src/infra/system-message.ts
const SYSTEM_MARK = "⚙️";
/** Return true when text already carries the system-message prefix. */
function hasSystemMark(text) {
	return text.trim().startsWith(SYSTEM_MARK);
}
/** Prefix non-empty text as a system message without double-prefixing. */
function prefixSystemMessage(text) {
	const normalized = text.trim();
	if (!normalized || normalized.startsWith("⚙️")) return normalized;
	return `${SYSTEM_MARK} ${normalized}`;
}
//#endregion
export { hasSystemMark as n, prefixSystemMessage as r, SYSTEM_MARK as t };
