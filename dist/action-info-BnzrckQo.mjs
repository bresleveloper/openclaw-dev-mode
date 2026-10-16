import { R as timestampMsToIsoString } from "./number-coercion-CuVhdCBs.mjs";
import { M as parseAgentSessionKey } from "./session-key-C09ow4h0.mjs";
import { l as resolveSessionStorePathCore } from "./paths-dpReqUI8.mjs";
import { t as formatDurationCompact } from "./format-duration-BIQQYTeV.mjs";
import { o as loadSessionEntryReadOnly } from "./session-accessor.sqlite-entry-AwYVLytL.mjs";
import "./session-accessor-cUVSaeKy.mjs";
import { n as commandReply } from "./command-gates-BzqqR9SG.mjs";
import { n as formatTimeAgo } from "./format-relative-Bcp7RoO9.mjs";
import { r as resolveSubagentDisplayStatus } from "./subagent-session-metrics-BCHEYB6I.mjs";
import { r as sanitizeRunStatusText, t as formatRunLabel } from "./subagents-utils-DtuM-aOJ.mjs";
import { r as resolveSubagentEntryForToken } from "./shared-BZfsOBpm.mjs";
//#region src/auto-reply/reply/commands-subagents/action-info.ts
function formatTimestampWithAge(valueMs) {
	if (!valueMs || !Number.isFinite(valueMs) || valueMs <= 0) return "n/a";
	const timestamp = timestampMsToIsoString(valueMs);
	if (!timestamp) return "n/a";
	return `${timestamp} (${formatTimeAgo(Date.now() - valueMs, { fallback: "n/a" })})`;
}
function handleSubagentsInfoAction(ctx) {
	const { params, readContext, restTokens } = ctx;
	const target = restTokens[0];
	if (!target) return commandReply("ℹ️ Usage: /subagents info <id|#>");
	const targetResolution = resolveSubagentEntryForToken(readContext.list.view, target);
	if ("reply" in targetResolution) return targetResolution.reply;
	const run = targetResolution.entry;
	const sessionEntry = loadSessionEntryReadOnly({
		storePath: resolveSessionStorePathCore(params.cfg.session?.store, { agentId: parseAgentSessionKey(run.childSessionKey)?.agentId }),
		sessionKey: run.childSessionKey,
		clone: false
	});
	const runtime = run.execution.startedAt && Number.isFinite(run.execution.startedAt) ? formatDurationCompact((run.execution.endedAt ?? Date.now()) - run.execution.startedAt) ?? "n/a" : "n/a";
	const outcomeError = sanitizeRunStatusText(run.execution.outcome?.error, { errorContext: true });
	const outcome = run.execution.outcome ? `${run.execution.outcome.status}${outcomeError ? ` (${outcomeError})` : ""}` : "n/a";
	const taskText = sanitizeRunStatusText(run.task) || "n/a";
	const progressText = sanitizeRunStatusText(run.completion?.resultText);
	const taskSummaryText = sanitizeRunStatusText(run.delivery?.lastError, { errorContext: true });
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
}
//#endregion
export { handleSubagentsInfoAction };
