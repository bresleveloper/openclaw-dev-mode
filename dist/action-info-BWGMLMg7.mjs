import { R as timestampMsToIsoString } from "./number-coercion-CkhMiRw8.mjs";
import { O as isSameSubagentRun, k as isSameSubagentRunOwner } from "./subagent-session-read-scope-7jPlY84h.mjs";
import { h as subagentRuns } from "./subagent-registry-memory-DE7WJHOr.mjs";
import { d as resolveSubagentDisplayStatus } from "./subagent-run-liveness-DPrFEcUI.mjs";
import { i as createSubagentSessionListReadView } from "./subagent-registry-state-DBdy-FdI.mjs";
import { t as formatDurationCompact } from "./format-duration-CyyGVUjR.mjs";
import { n as commandReply } from "./command-gates-Dcr0LjaJ.mjs";
import { n as formatTimeAgo } from "./format-relative-DP9tOdyD.mjs";
import { o as withSubagentSessionEntry } from "./subagent-session-reconciliation-DBq1r5kk.mjs";
import { t as sanitizeRunStatusText } from "./run-status-text-dSOTErxL.mjs";
import { t as formatRunLabel } from "./subagents-utils-DV33DlwQ.mjs";
import { n as resolveSubagentEntryForToken } from "./shared-Bkwy9Rzk.mjs";
//#region src/auto-reply/reply/commands-subagents/action-info.ts
function formatTimestampWithAge(valueMs) {
	if (!valueMs || !Number.isFinite(valueMs) || valueMs <= 0) return "n/a";
	const timestamp = timestampMsToIsoString(valueMs);
	if (!timestamp) return "n/a";
	return `${timestamp} (${formatTimeAgo(Date.now() - valueMs, { fallback: "n/a" })})`;
}
async function handleSubagentsInfoAction(ctx) {
	const { params, readContext, restTokens } = ctx;
	const target = restTokens[0];
	if (!target) return commandReply("ℹ️ Usage: /subagents info <id|#>");
	const targetResolution = resolveSubagentEntryForToken(readContext.list.view, target);
	if ("reply" in targetResolution) return targetResolution.reply;
	const run = targetResolution.entry;
	const registry = createSubagentSessionListReadView({ env: process.env });
	const selectedRunIds = /* @__PURE__ */ new Set([run.runId]);
	const resident = subagentRuns.get(run.runId);
	const assertCurrent = () => {
		const current = registry.runs(selectedRunIds).get(run.runId);
		if (!isSameSubagentRun(current, run) || current?.controllerSessionKey !== run.controllerSessionKey || current?.controllerStorePath !== run.controllerStorePath || resident && !isSameSubagentRunOwner(subagentRuns.get(run.runId), resident)) throw new Error("The selected subagent run changed while reading its info");
	};
	return withSubagentSessionEntry({
		childSessionKey: run.childSessionKey,
		childAgentId: run.childAgentId,
		cfg: params.cfg,
		assertCurrent
	}, (sessionEntry) => {
		const runtime = run.execution.startedAt && Number.isFinite(run.execution.startedAt) ? formatDurationCompact((run.execution.endedAt ?? Date.now()) - run.execution.startedAt) ?? "n/a" : "n/a";
		const outcomeError = sanitizeRunStatusText(run.execution.outcome?.error, { errorContext: true });
		const outcome = run.execution.outcome ? `${run.execution.outcome.status}${outcomeError ? ` (${outcomeError})` : ""}` : "n/a";
		const taskText = sanitizeRunStatusText(run.task) || "n/a";
		const progressText = sanitizeRunStatusText(run.completion?.resultText);
		const taskSummaryText = sanitizeRunStatusText(run.delivery?.lastError ?? run.delivery?.discardedPayloadSummary?.lastError, { errorContext: true });
		const lines = [
			"ℹ️ Subagent info",
			`Status: ${resolveSubagentDisplayStatus(run, readContext.list.pendingDescendants.get(run.childSessionKey) ?? 0)}`,
			`Label: ${formatRunLabel(run)}`,
			`Task: ${taskText}`,
			`Run: ${run.runId}`,
			`Session: ${run.childSessionKey}`,
			`SessionId: ${sessionEntry?.sessionId ?? "n/a"}`,
			`Runtime: ${runtime}`,
			`Created: ${formatTimestampWithAge(run.createdAt)}`,
			`Started: ${formatTimestampWithAge(run.execution.startedAt)}`,
			`Ended: ${formatTimestampWithAge(run.execution.endedAt)}`,
			`Cleanup: ${run.cleanup}`,
			run.archiveAtMs ? `Archive: ${formatTimestampWithAge(run.archiveAtMs)}` : void 0,
			run.cleanupHandled ? "Cleanup handled: yes" : void 0,
			`Outcome: ${outcome}`,
			progressText ? `Progress: ${progressText}` : void 0,
			taskSummaryText ? `Task summary: ${taskSummaryText}` : void 0,
			outcomeError ? `Task error: ${outcomeError}` : void 0,
			run.delivery ? `Delivery: ${run.delivery.status}` : void 0,
			run.delivery?.discardReason ? `Delivery disposition: ${run.delivery.discardReason}` : void 0,
			run.delivery?.discardedAt ? `Delivery retired: ${formatTimestampWithAge(run.delivery.discardedAt)}` : void 0
		].filter(Boolean);
		return commandReply(lines.join("\n"));
	});
}
//#endregion
export { handleSubagentsInfoAction };
