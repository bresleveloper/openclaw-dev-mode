import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { D as resolveProjectedAgentRunProgressState } from "./agent-run-registry-gmaPgO-n.mjs";
import { n as resolveAgentIdentity } from "./identity-VQc9B4RO.mjs";
import { n as projectGatewaySessionRunState } from "./session-utils-display-DdkO-Qt-.mjs";
import { i as resolveProjectedControlUiSessionPrTarget } from "./control-ui-session-pr-read-CfmRdkBJ.mjs";
//#region src/gateway/control-ui-public-session-card-facts.ts
const PR_STATES = {
	merged: "Merged",
	open: "Open",
	draft: "Draft",
	closed: "Closed"
};
function cardText(value, limit) {
	return value && truncateUtf16Safe(value, limit).trim() || void 0;
}
function checkSummary(checks) {
	if (!checks) return;
	return [
		checks.passed ? `${checks.passed} passed` : "",
		checks.failed ? `${checks.failed} failed` : "",
		checks.running ? `${checks.running} running` : "",
		checks.skipped ? `${checks.skipped} skipped` : ""
	].filter(Boolean).join(" · ") || void 0;
}
/** The caller admits publication; this projects only its recorded and already cached facts. */
function resolvePublicSessionCardFacts(params) {
	const { cfg, record, rowContext } = params;
	const { entry } = record;
	const now = params.now ?? Date.now();
	const temporal = projectGatewaySessionRunState({
		key: record.key,
		entry,
		now,
		rowContext: {
			...rowContext,
			subagentRuns: rowContext.subagentRuns.atTime(now)
		}
	}).fields;
	const running = resolveProjectedAgentRunProgressState({
		sessionKeys: [record.key],
		sessionId: entry.sessionId,
		agentId: record.agentId,
		index: rowContext.projectedAgentRuns
	}) !== void 0 || temporal.hasActiveSubagentRun === true || temporal.status === "running" || temporal.status === "queued";
	const status = running ? "Running" : temporal.status === "done" ? "Done" : temporal.status !== void 0 ? "Failed" : void 0;
	const startedAt = temporal.startedAt ?? entry.sessionStartedAt;
	const durationMs = temporal.runtimeMs ?? (startedAt !== void 0 && (temporal.endedAt !== void 0 || running) ? (temporal.endedAt ?? now) - startedAt : void 0);
	const agentName = cardText(resolveAgentIdentity(cfg, record.agentId)?.name, 80);
	const target = entry.worktree || entry.projectId ? resolveProjectedControlUiSessionPrTarget(cfg, record) : void 0;
	const snapshot = target ? params.pullRequests?.readPrepared(target, () => false) : void 0;
	const branch = cardText(entry.worktree?.branch, 180);
	const branchFacts = snapshot?.branch?.branch === entry.worktree?.branch ? snapshot?.branch : void 0;
	const pullRequest = snapshot?.pullRequests.find((pull) => pull.branch === entry.worktree?.branch);
	const repository = snapshot?.repository ?? branchFacts ?? pullRequest;
	const repoSlug = repository ? cardText(`${repository.owner}/${repository.repo}`, 160) : void 0;
	const additions = branchFacts?.additions ?? pullRequest?.additions;
	const deletions = branchFacts?.deletions ?? pullRequest?.deletions;
	const files = branchFacts?.changedFiles ?? pullRequest?.changedFiles;
	const checks = checkSummary(pullRequest?.checks);
	return {
		...agentName ? { agentName } : {},
		...status ? { status } : {},
		...durationMs !== void 0 && Number.isFinite(durationMs) && durationMs >= 0 ? { durationMinutes: Math.round(durationMs / 6e4) } : {},
		...repoSlug ? { repoSlug } : {},
		...branch ? { worktree: {
			branch,
			...additions !== void 0 ? { additions } : {},
			...deletions !== void 0 ? { deletions } : {},
			...files !== void 0 ? { files } : {},
			...pullRequest ? { prState: PR_STATES[pullRequest.state] } : {},
			...checks ? { checks } : {}
		} } : {}
	};
}
//#endregion
export { resolvePublicSessionCardFacts };
