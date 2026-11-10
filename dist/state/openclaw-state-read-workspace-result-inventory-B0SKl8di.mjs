const STAGED_RESULT_MESSAGE = "OpenClaw worker workspace result";
function requireWorkerResultStorageRef(ref) {
	if (!new RegExp(`^(?:refs/openclaw/worker-results|refs/openclaw/worker-result-candidates|refs/openclaw/worker-result-cleanup)/[A-Za-z0-9-]+$`, "u").test(ref)) throw new Error("Cloud workspace staged result reference is invalid");
	return ref;
}
const STAGED_WORKSPACE_READ_MAX_BYTES = 8388608;
function stagedWorkspaceEntryBytes(entry) {
	return entry.type === "file" ? entry.size : Buffer.byteLength(entry.target);
}
//#endregion
export { stagedWorkspaceEntryBytes as i, STAGED_WORKSPACE_READ_MAX_BYTES as n, requireWorkerResultStorageRef as r, STAGED_RESULT_MESSAGE as t };
