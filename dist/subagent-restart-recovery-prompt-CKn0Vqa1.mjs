import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { T as recordLatestSubagentRun } from "./subagent-registry.store.sqlite-DIYyRjhZ.mjs";
import { r as wrapPromptDataBlock } from "./sanitize-for-prompt-bzCyHFCH.mjs";
//#region src/agents/subagents/subagent-restart-recovery-prompt.ts
const MAX_RECOVERY_CHILDREN = 32;
const MAX_RECOVERY_LABEL_CHARS = 256;
const SUBAGENT_RESTART_RECOVERY_INSTRUCTION = "Interrupted subagents are not automatically relaunched. Reconcile every listed unfinished child against its saved history, current status, and the user's requested outcome. Prefer a follow-up in the same retained child session when its task is still needed; confirm the previous execution has stopped and verify uncertain tool effects before continuing it. Do not duplicate running work or blindly replay commands. If retained work already satisfies the task, use its result; otherwise continue it, assign replacement work, or finish it yourself. A restart interruption alone is not a blocker. Finish the original task or report the specific remaining blocker that requires user input or unavailable authority.";
function buildSubagentRestartRecoveryRoster(children) {
	const latest = /* @__PURE__ */ new Map();
	for (const child of children) recordLatestSubagentRun(latest, child.childSessionKey, child);
	const unfinished = [...latest.values()].filter((child) => !child.killIntent && !child.killReconciliation && !child.suppressCompletionDelivery && (child.execution.interruptionReason === "gateway-restart" || child.execution.status !== "terminal" || child.pauseReason === "sessions_yield")).toSorted((a, b) => a.createdAt - b.createdAt || (a.childSessionKey < b.childSessionKey ? -1 : a.childSessionKey > b.childSessionKey ? 1 : 0));
	if (unfinished.length === 0) return "";
	const rows = unfinished.slice(0, MAX_RECOVERY_CHILDREN).map((child) => {
		const label = child.taskName?.trim() || child.label?.trim();
		return {
			sessionKey: child.childSessionKey,
			runId: child.runId,
			state: child.execution.interruptionReason === "gateway-restart" ? "interrupted by gateway restart" : child.pauseReason === "sessions_yield" ? "paused awaiting continuation" : child.execution.status,
			label: label ? truncateUtf16Safe(label, MAX_RECOVERY_LABEL_CHARS) : void 0
		};
	});
	return [
		"Unfinished child sessions to reconcile:",
		wrapPromptDataBlock({
			label: "Child session facts",
			text: JSON.stringify(rows, null, 2)
		}),
		...unfinished.length > rows.length ? [`${unfinished.length - rows.length} additional unfinished children are not shown. Inspect the remaining child sessions before completing recovery.`] : []
	].join("\n");
}
//#endregion
export { buildSubagentRestartRecoveryRoster as n, SUBAGENT_RESTART_RECOVERY_INSTRUCTION as t };
