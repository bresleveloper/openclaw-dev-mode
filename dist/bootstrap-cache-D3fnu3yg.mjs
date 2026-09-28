import { t as pruneMapToMaxSize } from "./map-size-CNcWiFKu.mjs";
import { m as workspaceFileSourceIdentitiesMatch, s as loadWorkspaceBootstrapFiles } from "./workspace-mlzi3k1x.mjs";
//#region src/agents/bootstrap-cache.ts
/**
* Per-session workspace bootstrap snapshot cache.
* Reuses unchanged bootstrap file arrays while refreshing each turn so edits
* become visible to long-lived agent sessions.
*/
const MAX_BOOTSTRAP_SNAPSHOTS = 64;
const cache = /* @__PURE__ */ new Map();
function bootstrapFilesEqual(previous, next) {
	if (previous.length !== next.length) return false;
	return previous.every((file, index) => {
		const updated = next[index];
		return updated !== void 0 && file.name === updated.name && file.path === updated.path && file.content === updated.content && file.missing === updated.missing && workspaceFileSourceIdentitiesMatch(file, updated);
	});
}
/** Load bootstrap files for a session, reusing the prior snapshot when content is unchanged. */
async function getOrLoadBootstrapFiles(params) {
	pruneMapToMaxSize(cache, MAX_BOOTSTRAP_SNAPSHOTS);
	const existing = cache.get(params.sessionKey);
	const files = await loadWorkspaceBootstrapFiles(params.workspaceDir);
	if (existing && existing.workspaceDir === params.workspaceDir && bootstrapFilesEqual(existing.files, files)) {
		cache.delete(params.sessionKey);
		cache.set(params.sessionKey, existing);
		return existing.files;
	}
	cache.set(params.sessionKey, {
		workspaceDir: params.workspaceDir,
		files
	});
	pruneMapToMaxSize(cache, MAX_BOOTSTRAP_SNAPSHOTS);
	return files;
}
/** Drop one cached bootstrap snapshot. */
function clearBootstrapSnapshot(sessionKey) {
	cache.delete(sessionKey);
}
/** Clear bootstrap state when a visible session rolls over to a new backing session. */
function clearBootstrapSnapshotOnSessionRollover(params) {
	if (!params.sessionKey || !params.previousSessionId) return;
	clearBootstrapSnapshot(params.sessionKey);
}
/** Clear bootstrap state after an in-log lifecycle boundary is durably appended. */
function clearBootstrapSnapshotOnSessionBoundary(params) {
	if (!params.boundaryAppended || !params.sessionKey) return;
	clearBootstrapSnapshot(params.sessionKey);
}
//#endregion
export { getOrLoadBootstrapFiles as i, clearBootstrapSnapshotOnSessionBoundary as n, clearBootstrapSnapshotOnSessionRollover as r, clearBootstrapSnapshot as t };
