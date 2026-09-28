//#region src/agents/worktrees/gc-result.ts
function formatWorktreeGcResult(result) {
	const limits = result.limitsSatisfied === null ? "unknown" : result.limitsSatisfied ? "satisfied" : "exceeded";
	const shown = result.issues.map((issue) => `${issue.id ?? issue.stage}: ${issue.reason}`).join("; ");
	const omitted = result.issueCount - result.issues.length;
	return [
		`Managed worktree cleanup ${result.outcome}: removed ${result.removed.length}`,
		`deleted ${result.orphansDeleted} orphans`,
		`pruned ${result.snapshotsPruned} snapshots`,
		`protected ${result.protectedCount}`,
		`limits ${limits}`,
		shown && `${shown}${omitted > 0 ? `; plus ${omitted} more` : ""}`
	].filter(Boolean).join("; ") + ".";
}
//#endregion
export { formatWorktreeGcResult as t };
