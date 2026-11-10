//#region src/agents/worktrees/gc-result.ts
function formatWorktreeGcResult(result) {
	const outcome = "state" in result && result.state !== "completed" ? result.state : result.outcome;
	const limits = result.limitsSatisfied === null ? "unknown" : result.limitsSatisfied ? "satisfied" : "exceeded";
	const shown = result.issues.map((issue) => `${issue.id ?? issue.stage}: ${issue.reason}`).join("; ");
	const omitted = result.issueCount - result.issues.length;
	return [
		`Managed worktree cleanup ${outcome}: removed ${result.removed.length}`,
		`deleted ${result.orphansDeleted} orphans`,
		`retired ${result.orphansRetired} orphan records`,
		...result.retiredCheckoutPaths.map((checkoutPath) => `preserved checkout: ${checkoutPath}`),
		`pruned ${result.snapshotsPruned} snapshots`,
		result.gitMaintenance && `Git ${result.gitMaintenance.stage}: ${result.gitMaintenance.repoRoot}`,
		result.gitMaintenance?.packsBefore !== void 0 && `packs ${result.gitMaintenance.packsBefore} → ${result.gitMaintenance.packsAfter ?? "pending"}`,
		result.packsRemoved !== void 0 && `removed ${result.packsRemoved} packs`,
		result.eligibleCount !== void 0 && `eligible ${result.eligibleCount}`,
		result.deferredCount !== void 0 && `deferred ${result.deferredCount}`,
		result.failedCount !== void 0 && `failed ${result.failedCount}`,
		`protected ${result.protectedCount}`,
		...Object.entries(result.protectionReasons).map(([reason, count]) => `${reason}: ${count}`),
		`limits ${limits}`,
		...Object.entries(result.evictions ?? {}).map(([reason, count]) => `${reason}: ${count}`),
		shown && `${shown}${omitted > 0 ? `; plus ${omitted} more` : ""}`
	].filter(Boolean).join("; ") + ".";
}
//#endregion
export { formatWorktreeGcResult as t };
