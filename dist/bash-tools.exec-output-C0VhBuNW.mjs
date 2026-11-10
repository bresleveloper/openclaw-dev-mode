import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
//#region src/agents/bash-tools.exec-output.ts
/**
* Rendering helpers for exec output/status updates.
* Keeps no-output placeholders and warning placement consistent across exec
* progress, polling, and completion surfaces.
*/
const EXEC_NO_OUTPUT_PLACEHOLDER = "(no output)";
const EXEC_MANUAL_COLLECTION_FOLLOW_UP = "Automatic completion wake is disabled for this command. If the task needs this result, use poll with a timeout to collect it before ending the turn, unless another continuation is already arranged.";
const EXEC_TIMEOUT_RETRY_GUIDANCE = "The command was terminated, but external side effects may already have completed. Verify the resulting state before retrying. Do not automatically rerun commands unless repeating them is safe. Use a higher timeout only when the command is known to be safe to retry.";
const EXEC_RETENTION_CAP_NOTE = "[earlier output was discarded at the retention cap and cannot be recovered]\n\n";
/** Render command output with a stable placeholder for empty output. */
function renderExecOutputText(value) {
	return value || "(no output)";
}
/** Render the authoritative process exit without inventing a successful code. */
function renderExecExitLabel(exit) {
	if (exit.exitSignal != null) return `signal ${exit.exitSignal}`;
	return typeof exit.exitCode === "number" ? `code ${exit.exitCode}` : "unknown exit code";
}
/** Render the text shown in exec progress updates, including warnings first. */
function renderExecUpdateText(params) {
	return (params.warnings.length ? `${params.warnings.join("\n")}\n\n` : "") + renderExecOutputText(params.tailText);
}
/** Add retry-safety guidance only for supervisor timeout exits. */
function appendExecTimeoutRetryGuidance(text, exitReason) {
	if (exitReason !== "overall-timeout" && exitReason !== "no-output-timeout") return text;
	return `${text}\n\n${EXEC_TIMEOUT_RETRY_GUIDANCE}`;
}
const DEFAULT_NOTIFY_SNIPPET_CHARS = 180;
/** Normalizes notification snippets to a compact single-line form. */
function normalizeNotifyOutput(value) {
	return value.replace(/\s+/g, " ").trim();
}
function compactNotifyOutput(value, maxChars = DEFAULT_NOTIFY_SNIPPET_CHARS) {
	const normalized = normalizeNotifyOutput(value);
	if (!normalized) return "";
	if (normalized.length <= maxChars) return normalized;
	const safe = Math.max(1, maxChars - 1);
	return `${truncateUtf16Safe(normalized, safe)}…`;
}
//#endregion
export { appendExecTimeoutRetryGuidance as a, renderExecExitLabel as c, EXEC_TIMEOUT_RETRY_GUIDANCE as i, renderExecOutputText as l, EXEC_NO_OUTPUT_PLACEHOLDER as n, compactNotifyOutput as o, EXEC_RETENTION_CAP_NOTE as r, normalizeNotifyOutput as s, EXEC_MANUAL_COLLECTION_FOLLOW_UP as t, renderExecUpdateText as u };
