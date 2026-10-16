import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { i as truncateWithMarker, r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import "./utils-DgZn2dLu.mjs";
import { n as INTERNAL_RUNTIME_CONTEXT_END, t as INTERNAL_RUNTIME_CONTEXT_BEGIN } from "./internal-runtime-context-CAWYwg4i.mjs";
import { n as renderUserFacingText } from "./user-facing-text-DC1sCo4O.mjs";
//#region src/agents/run-status-text.ts
function stripInlineLeakedInternalContext(value) {
	const beginIndex = value.indexOf(INTERNAL_RUNTIME_CONTEXT_BEGIN);
	if (beginIndex !== -1 && (value.includes(INTERNAL_RUNTIME_CONTEXT_END) || value.includes("OpenClaw runtime context (internal):") || value.includes("[Internal task completion event]"))) return value.slice(0, beginIndex);
	const legacyHeaderIndex = value.indexOf("OpenClaw runtime context (internal):");
	if (legacyHeaderIndex !== -1 && (value.includes("Keep internal details private.") || value.includes("[Internal task completion event]"))) return value.slice(0, legacyHeaderIndex);
	return value;
}
function sanitizeRunStatusValue(value, errorContext) {
	if (typeof value === "string") return renderUserFacingText(stripInlineLeakedInternalContext(value), { errorContext }).replace(/\s+/g, " ").trim() || void 0;
	if (Array.isArray(value)) {
		const next = value.map((entry) => sanitizeRunStatusValue(entry, errorContext)).filter((entry) => entry !== void 0);
		return next.length > 0 ? next : void 0;
	}
	if (value && typeof value === "object") {
		const nextEntries = Object.entries(value).map(([key, entry]) => [key, sanitizeRunStatusValue(entry, errorContext)]).filter(([, entry]) => entry !== void 0);
		if (nextEntries.length === 0) return;
		return Object.fromEntries(nextEntries);
	}
	return value;
}
function sanitizeRunStatusText(value, opts) {
	const sanitizedValue = sanitizeRunStatusValue(value, opts?.errorContext ?? false);
	const sanitized = (typeof sanitizedValue === "string" ? sanitizedValue : sanitizedValue == null ? "" : JSON.stringify(sanitizedValue) ?? "").replace(/\s+/g, " ").trim();
	if (!sanitized) return "";
	if (typeof opts?.maxChars === "number") return truncateWithMarker(sanitized, opts.maxChars, {
		marker: "…",
		reserve: 1,
		trimEnd: true
	});
	return sanitized;
}
//#endregion
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
export { resolveSubagentLabel as n, sanitizeRunStatusText as r, formatRunLabel as t };
