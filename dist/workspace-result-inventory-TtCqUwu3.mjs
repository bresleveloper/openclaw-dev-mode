//#region src/gateway/worker-environments/workspace-result-inventory.ts
const WORKER_RESULT_REF_PREFIX = "refs/openclaw/worker-results";
const WORKER_RESULT_CANDIDATE_REF_PREFIX = "refs/openclaw/worker-result-candidates";
const WORKER_RESULT_CLEANUP_REF_PREFIX = "refs/openclaw/worker-result-cleanup";
const STAGED_RESULT_MESSAGE = "OpenClaw worker workspace result";
function requireWorkerResultStorageRef(ref) {
	if (!new RegExp(`^(?:refs/openclaw/worker-results|refs/openclaw/worker-result-candidates|refs/openclaw/worker-result-cleanup)/[A-Za-z0-9-]+$`, "u").test(ref)) throw new Error("Cloud workspace staged result reference is invalid");
	return ref;
}
const STAGED_WORKSPACE_READ_MAX_BYTES = 8388608;
function stagedWorkspaceEntryBytes(entry) {
	return entry.type === "file" ? entry.size : Buffer.byteLength(entry.target);
}
function resolveStagedWorkspaceReadEntry(objectsByPath, entry) {
	const object = objectsByPath.get(entry.path);
	if (!object) throw new Error(`Cloud workspace result has no payload for ${entry.path}`);
	return {
		object,
		entry
	};
}
//#endregion
export { WORKER_RESULT_REF_PREFIX as a, stagedWorkspaceEntryBytes as c, WORKER_RESULT_CLEANUP_REF_PREFIX as i, STAGED_WORKSPACE_READ_MAX_BYTES as n, requireWorkerResultStorageRef as o, WORKER_RESULT_CANDIDATE_REF_PREFIX as r, resolveStagedWorkspaceReadEntry as s, STAGED_RESULT_MESSAGE as t };
