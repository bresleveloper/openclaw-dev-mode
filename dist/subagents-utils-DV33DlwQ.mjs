import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import "./utils-gjJ-tD2q.mjs";
import { t as sanitizeRunStatusText } from "./run-status-text-dSOTErxL.mjs";
//#region src/auto-reply/reply/subagents-utils.ts
function resolveSubagentLabel(entry, fallback = "subagent") {
	return normalizeOptionalString(entry.label) ?? normalizeOptionalString(entry.task) ?? fallback;
}
function formatRunLabel(entry, options) {
	const raw = sanitizeRunStatusText(resolveSubagentLabel(entry)) || "subagent";
	const maxLength = options?.maxLength ?? 72;
	if (!Number.isFinite(maxLength) || maxLength <= 0) return raw;
	return raw.length > maxLength ? `${truncateUtf16Safe(raw, maxLength).trimEnd()}…` : raw;
}
//#endregion
export { resolveSubagentLabel as n, formatRunLabel as t };
