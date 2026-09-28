//#region src/agents/bash-tools.exec-output.ts
const EXEC_NO_OUTPUT_PLACEHOLDER = "(no output)";
const EXEC_TIMEOUT_RETRY_GUIDANCE = "The command was terminated, but external side effects may already have completed. Verify the resulting state before retrying. Do not automatically rerun non-idempotent commands. Use a higher timeout only when the command is known to be safe to retry.";
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
//#endregion
export { renderExecOutputText as a, renderExecExitLabel as i, EXEC_RETENTION_CAP_NOTE as n, renderExecUpdateText as o, appendExecTimeoutRetryGuidance as r, EXEC_NO_OUTPUT_PLACEHOLDER as t };
