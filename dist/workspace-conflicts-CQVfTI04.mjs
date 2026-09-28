//#region src/gateway/worker-environments/workspace-conflicts.ts
const WORKSPACE_CONFLICT_TRANSCRIPT_TYPE = "cloud-workspace-conflict";
const WORKSPACE_CONFLICT_CLEARED_TRANSCRIPT_TYPE = "cloud-workspace-conflict-cleared";
const WORKSPACE_RECOVERY_FAILURE_TRANSCRIPT_TYPE = "cloud-workspace-recovery-failed";
const MAX_PROJECTED_CONFLICT_PATHS = 256;
const MAX_PROJECTED_CONFLICT_PATH_BYTES = 32768;
function projectWorkspaceResultConflict(paths, stagedResultRef, knownTotalCount) {
	const uniquePaths = [...new Set(paths)].toSorted();
	const projectedPaths = [];
	let projectedBytes = 0;
	for (const entryPath of uniquePaths) {
		const bytes = Buffer.byteLength(entryPath);
		if (projectedPaths.length >= MAX_PROJECTED_CONFLICT_PATHS || projectedBytes + bytes > MAX_PROJECTED_CONFLICT_PATH_BYTES) break;
		projectedPaths.push(entryPath);
		projectedBytes += bytes;
	}
	if (projectedPaths.length === 0) throw new Error("Cloud workspace result conflict projection has no bounded path");
	return {
		paths: projectedPaths,
		stagedResultRef,
		totalCount: Math.max(knownTotalCount ?? uniquePaths.length, uniquePaths.length)
	};
}
function formatWorkspaceConflictSummary(paths, stagedResultRef, totalCount = paths.length) {
	const visiblePaths = paths.slice(0, 20);
	return `Cloud result applied with ${totalCount} conflict(s); kept local versions: ${visiblePaths.join(", ")}${totalCount > visiblePaths.length ? ` (+${totalCount - visiblePaths.length} more)` : ""}. Cloud versions staged at ${stagedResultRef}.`;
}
//#endregion
export { projectWorkspaceResultConflict as a, formatWorkspaceConflictSummary as i, WORKSPACE_CONFLICT_TRANSCRIPT_TYPE as n, WORKSPACE_RECOVERY_FAILURE_TRANSCRIPT_TYPE as r, WORKSPACE_CONFLICT_CLEARED_TRANSCRIPT_TYPE as t };
