//#region src/skills/runtime/skill-snapshot-provenance.ts
const EXECUTION_WORKSPACE_FILE_HOST = "executionWorkspaceFileHost";
function recordSkillRootsExecutionFileHost(roots, host) {
	if (host === void 0) Reflect.deleteProperty(roots, EXECUTION_WORKSPACE_FILE_HOST);
	else Reflect.set(roots, EXECUTION_WORKSPACE_FILE_HOST, host);
	return roots;
}
function resolveSkillSnapshotExecutionFileHost(snapshot) {
	const roots = snapshot?.skillRoots;
	if (!roots) return;
	return Reflect.get(roots, EXECUTION_WORKSPACE_FILE_HOST) === "gateway" ? "gateway" : void 0;
}
function copySkillSnapshotExecutionFileHost(source, target) {
	if (target.skillRoots) recordSkillRootsExecutionFileHost(target.skillRoots, resolveSkillSnapshotExecutionFileHost(source));
	return target;
}
//#endregion
export { recordSkillRootsExecutionFileHost as n, resolveSkillSnapshotExecutionFileHost as r, copySkillSnapshotExecutionFileHost as t };
