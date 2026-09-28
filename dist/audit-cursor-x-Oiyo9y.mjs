import { w as parseStrictPositiveInteger } from "./number-coercion-CLj0HTDM.mjs";
//#region src/audit/audit-cursor.ts
/** Parse the digit-only positive cursor grammar shared by audit CLI and Gateway paging. */
function parsePositiveAuditCursor(cursor) {
	if (cursor === void 0) return;
	const trimmed = cursor.trim();
	if (!/^\d+$/.test(trimmed)) return null;
	return parseStrictPositiveInteger(trimmed) ?? null;
}
//#endregion
export { parsePositiveAuditCursor as t };
