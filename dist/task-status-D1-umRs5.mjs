import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import "./utils-aKqR_F_U.mjs";
import { p as stripInternalRuntimeContext, t as INTERNAL_RUNTIME_CONTEXT_BEGIN } from "./internal-runtime-context-BH-o1oq1.mjs";
import { i as matchesTaskStatusFilter } from "./task-registry.types-CkM1jc3D.mjs";
import { n as renderUserFacingText } from "./user-facing-text-D8c_iKUB.mjs";
//#region src/tasks/task-status.ts
const FAILURE_TASK_STATUSES = /* @__PURE__ */ new Set([
	"failed",
	"timed_out",
	"lost",
	"blocked"
]);
/** Window for showing recently completed tasks in compact status output. */
const TASK_STATUS_RECENT_WINDOW_MS = 3e5;
const TASK_STATUS_TITLE_MAX_CHARS = 80;
function formatTaskStatus(task) {
	return matchesTaskStatusFilter(task, "blocked") ? "blocked" : task.status;
}
function isTaskStatusIssue(task) {
	return FAILURE_TASK_STATUSES.has(formatTaskStatus(task));
}
/** Applies a task display limit to text that its caller has already sanitized. */
function truncateTaskStatusText(value, maxChars) {
	const trimmed = value.trim();
	if (trimmed.length <= maxChars) return trimmed;
	return `${truncateUtf16Safe(trimmed, Math.max(0, maxChars - 1)).trimEnd()}…`;
}
function stripInlineLeakedInternalContext(value) {
	const beginIndex = value.indexOf(INTERNAL_RUNTIME_CONTEXT_BEGIN);
	if (beginIndex !== -1 && (value.includes("<<<END_OPENCLAW_INTERNAL_CONTEXT>>>") || value.includes("OpenClaw runtime context (internal):") || value.includes("[Internal task completion event]"))) return value.slice(0, beginIndex);
	const legacyHeaderIndex = value.indexOf("OpenClaw runtime context (internal):");
	if (legacyHeaderIndex !== -1 && (value.includes("Keep internal details private.") || value.includes("[Internal task completion event]"))) return value.slice(0, legacyHeaderIndex);
	return value;
}
function sanitizeTaskStatusValue(value, errorContext) {
	if (typeof value === "string") return renderUserFacingText(stripInlineLeakedInternalContext(value), { errorContext }).replace(/\s+/g, " ").trim() || void 0;
	if (Array.isArray(value)) {
		const next = value.map((entry) => sanitizeTaskStatusValue(entry, errorContext)).filter((entry) => entry !== void 0);
		return next.length > 0 ? next : void 0;
	}
	if (value && typeof value === "object") {
		const nextEntries = Object.entries(value).map(([key, entry]) => [key, sanitizeTaskStatusValue(entry, errorContext)]).filter(([, entry]) => entry !== void 0);
		if (nextEntries.length === 0) return;
		return Object.fromEntries(nextEntries);
	}
	return value;
}
function sanitizeTaskStatusText(value, opts) {
	const sanitizedValue = sanitizeTaskStatusValue(value, opts?.errorContext ?? false);
	const sanitized = (typeof sanitizedValue === "string" ? sanitizedValue : sanitizedValue == null ? "" : JSON.stringify(sanitizedValue) ?? "").replace(/\s+/g, " ").trim();
	if (!sanitized) return "";
	if (typeof opts?.maxChars === "number") return truncateTaskStatusText(sanitized, opts.maxChars);
	return sanitized;
}
/** Explicit task lookups retain the sanitized input; list/event titles stay bounded. */
function sanitizeTaskPromptText(value) {
	if (typeof value !== "string") return "";
	return stripInlineLeakedInternalContext(stripInternalRuntimeContext(value, { preserveSurroundingWhitespace: true })).trim();
}
function formatTaskStatusTitleText(value, fallback = "Background task") {
	return sanitizeTaskStatusText(value, { maxChars: TASK_STATUS_TITLE_MAX_CHARS }) || fallback;
}
function formatTaskStatusTitle(task) {
	return formatTaskStatusTitleText(task.label?.trim() || task.task.trim());
}
function formatTaskStatusDetail(task) {
	if (task.status === "running" || task.status === "queued") return sanitizeTaskStatusText(task.progressSummary, { maxChars: 120 }) || void 0;
	const sanitizedError = sanitizeTaskStatusText(task.error, {
		errorContext: true,
		maxChars: 120
	});
	if (sanitizedError) return sanitizedError;
	return sanitizeTaskStatusText(task.terminalSummary, {
		errorContext: true,
		maxChars: 120
	}) || void 0;
}
function buildTaskStatusSnapshot(tasks, opts) {
	const now = opts?.now ?? Date.now();
	const active = [];
	const recentTerminal = [];
	let firstIssue;
	let recentFailureCount = 0;
	for (const task of tasks) {
		if (typeof task.cleanupAfter === "number" && task.cleanupAfter <= now) continue;
		if (task.status === "queued" || task.status === "running") {
			active.push(task);
			continue;
		}
		if (now - (task.endedAt ?? task.lastEventAt ?? task.startedAt ?? task.createdAt) <= TASK_STATUS_RECENT_WINDOW_MS) {
			recentTerminal.push(task);
			if (isTaskStatusIssue(task)) {
				firstIssue ??= task;
				recentFailureCount += 1;
			}
		}
	}
	const visible = active.length > 0 ? [...active, ...recentTerminal] : recentTerminal;
	const focus = active[0] ?? firstIssue ?? recentTerminal[0];
	return {
		latest: active[0] ?? recentTerminal[0],
		focus,
		visible,
		active,
		recentTerminal,
		activeCount: active.length,
		totalCount: visible.length,
		recentFailureCount
	};
}
//#endregion
export { formatTaskStatusTitleText as a, sanitizeTaskStatusText as c, formatTaskStatusTitle as i, truncateTaskStatusText as l, formatTaskStatus as n, isTaskStatusIssue as o, formatTaskStatusDetail as r, sanitizeTaskPromptText as s, buildTaskStatusSnapshot as t };
