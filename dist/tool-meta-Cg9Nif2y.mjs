import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { f as shortenHomeInString } from "./utils-aKqR_F_U.mjs";
import { n as formatInlineCodeSpan } from "./markdown-code-Buzx6wvi.mjs";
import { a as isShellToolDisplayName, o as resolveToolDisplay } from "./tool-display-DjrvDE8J.mjs";
//#region src/auto-reply/tool-meta.ts
/** Formats compact tool metadata labels for auto-reply progress/status messages. */
/**
* Formats one grouped tool-progress label and returns the detail segment it was
* composed from. Callers that need both must not re-parse the label: recovering
* the detail by stripping the rendered prefix silently yields nothing whenever
* the prefix shape changes.
*/
function formatToolAggregateParts(toolName, metas, options) {
	const filtered = (metas ?? []).filter(Boolean).map(shortenHomeInString);
	const display = resolveToolDisplay({ name: toolName });
	const compactCommandSummary = filtered.length > 0 && isShellToolDisplayName(toolName);
	const prefix = compactCommandSummary ? display.emoji : `${display.emoji} ${display.label}`;
	if (!filtered.length) return { text: `${display.emoji} ${display.label}` };
	const rawSegments = [];
	const grouped = {};
	for (const m of filtered) {
		if (!isPathLike(m)) {
			rawSegments.push(m);
			continue;
		}
		if (m.includes("→")) {
			rawSegments.push(m);
			continue;
		}
		const slash = m.lastIndexOf("/");
		const dir = m.slice(0, slash);
		const base = m.slice(slash + 1);
		if (!grouped[dir]) grouped[dir] = [];
		grouped[dir].push(base);
	}
	const segments = Object.entries(grouped).map(([dir, files]) => {
		return `${dir}/${files.length > 1 ? `{${files.join(", ")}}` : files[0]}`;
	});
	const detail = formatMetaForDisplay(toolName, [...rawSegments, ...segments].join("; "), options?.markdown);
	return {
		text: compactCommandSummary ? `${prefix} ${detail}` : `${prefix}: ${detail}`,
		detail
	};
}
/** Formats one grouped tool-progress label from a tool name and metadata entries. */
function formatToolAggregate(toolName, metas, options) {
	return formatToolAggregateParts(toolName, metas, options).text;
}
function formatMetaForDisplay(toolName, meta, markdown) {
	const normalized = normalizeLowercaseStringOrEmpty(toolName);
	if (normalized === "exec" || normalized === "bash") {
		const { flags, body } = splitExecFlags(meta);
		if (flags.length > 0) {
			if (!body) return flags.join(" · ");
			return `${flags.join(" · ")} · ${maybeWrapMarkdown(body, markdown)}`;
		}
	}
	return maybeWrapMarkdown(meta, markdown);
}
function splitExecFlags(meta) {
	const parts = meta.split(" · ").map((part) => part.trim()).filter(Boolean);
	if (parts.length === 0) return {
		flags: [],
		body: ""
	};
	const flags = [];
	const bodyParts = [];
	for (const part of parts) {
		if (part === "elevated" || part === "pty") {
			flags.push(part);
			continue;
		}
		bodyParts.push(part);
	}
	return {
		flags,
		body: bodyParts.join(" · ")
	};
}
function isPathLike(value) {
	if (!value) return false;
	if (value.includes(" ")) return false;
	if (value.includes("://")) return false;
	if (value.includes("·")) return false;
	if (value.includes("&&") || value.includes("||")) return false;
	return /^~?(\/[^\s]+)+$/.test(value);
}
function maybeWrapMarkdown(value, markdown) {
	return markdown ? formatInlineCodeSpan(value) : value;
}
//#endregion
export { formatToolAggregateParts as n, formatToolAggregate as t };
