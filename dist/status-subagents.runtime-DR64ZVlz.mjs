import { n as hasSubagentRunEnded } from "./subagent-run-liveness-DPrFEcUI.mjs";
import { t as formatDurationCompact } from "./format-duration-CyyGVUjR.mjs";
import { t as sanitizeRunStatusText } from "./run-status-text-dSOTErxL.mjs";
import { t as formatRunLabel } from "./subagents-utils-DV33DlwQ.mjs";
import { n as buildControlledSubagentRunsReadContext } from "./subagent-control-scope-DL-koOaU.mjs";
import "./subagent-control-WFcqo9OA.mjs";
//#region src/auto-reply/reply/commands-status-subagents.ts
const WAIT_LABELS = /* @__PURE__ */ new Map([
	["approval", "approval"],
	["user_input", "input"],
	["agent_messages", "agent messages"],
	["children", "child tasks"]
]);
function formatExecutionObservation(observation) {
	switch (observation.state) {
		case "running": {
			const tool = sanitizeRunStatusText(observation.currentTool?.name, { maxChars: 60 });
			return tool ? `running ${tool}` : "running";
		}
		case "queued": return "queued";
		case "waiting": return `waiting for ${WAIT_LABELS.get(observation.wait?.kind ?? "") ?? "external work"}`;
		case "finished": return "finished · settlement pending";
		default: return "current activity unavailable";
	}
}
/** Builds the compact status line from the controller's ordered snapshot and descendant index. */
function buildSubagentsStatusLine(params) {
	const { context, verboseEnabled } = params;
	if (context.runs.length === 0) return;
	const now = params.now ?? Date.now();
	const activeRuns = new Set(context.list.view.active);
	const active = activeRuns.size;
	const done = context.runs.filter((entry) => !activeRuns.has(entry) && hasSubagentRunEnded(entry) && (context.list.pendingDescendants.get(entry.childSessionKey) ?? 0) === 0).length;
	if (active === 0) return verboseEnabled && done > 0 ? `🤖 Subagents: 0 active · ${done} done` : void 0;
	const detailLines = [...activeRuns].slice(0, 3).map((entry) => {
		const pendingDescendants = context.list.pendingDescendants.get(entry.childSessionKey) ?? 0;
		const startedAt = entry.execution.startedAt ?? entry.sessionStartedAt ?? entry.createdAt;
		const durationMs = Math.max(0, (entry.execution.endedAt && pendingDescendants === 0 ? entry.execution.endedAt : now) - startedAt);
		const duration = formatDurationCompact(durationMs, { spaced: true }) ?? "0s";
		return `  • ${formatRunLabel(entry, { maxLength: 56 })} · ${duration} · ${formatExecutionObservation(context.getExecutionObservation(entry))}${pendingDescendants > 0 ? ` · ${pendingDescendants} child${pendingDescendants === 1 ? "" : "ren"} pending` : ""}`;
	});
	return [`🤖 Subagents: ${active} active${done > 0 ? ` · ${done} done` : ""}`, ...detailLines].join("\n");
}
//#endregion
export { buildControlledSubagentRunsReadContext, buildSubagentsStatusLine };
