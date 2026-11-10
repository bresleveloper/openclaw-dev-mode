import { n as registerListener, t as notifyListeners } from "./listeners-BogSNJ-R.mjs";
import { t as normalizeWorkspaceSkillRoots } from "./workspace-skill-roots-CL28VeX5.mjs";
//#region src/skills/runtime/refresh-state.ts
const listeners = /* @__PURE__ */ new Set();
const workspaceVersions = /* @__PURE__ */ new Map();
const discoveryVersions = {
	workspace: /* @__PURE__ */ new Map(),
	scopes: /* @__PURE__ */ new Map()
};
const supportingFileVersions = {
	workspace: /* @__PURE__ */ new Map(),
	scopes: /* @__PURE__ */ new Map()
};
const INITIAL_SKILLS_SNAPSHOT_VERSION = Date.now();
let versionClock = INITIAL_SKILLS_SNAPSHOT_VERSION;
let globalVersion = INITIAL_SKILLS_SNAPSHOT_VERSION;
let sourceClock = INITIAL_SKILLS_SNAPSHOT_VERSION;
let globalSourceVersion = sourceClock;
function bumpVersion(current) {
	const now = Date.now();
	return now <= current ? current + 1 : now;
}
function emit(event) {
	notifyListeners(listeners, event);
}
function publishChange(event) {
	versionClock = bumpVersion(versionClock);
	if (event.workspaceDir) workspaceVersions.set(event.workspaceDir, versionClock);
	else globalVersion = versionClock;
	emit(event);
	return versionClock;
}
function registerSkillsChangeListener(listener) {
	return registerListener(listeners, listener);
}
/** Coverage recovery follows content reconciliation; it never creates a source revision. */
function notifySkillsWatchAvailable(params) {
	emit({
		...params,
		reason: "watch-available"
	});
}
function sourceScopeKey(workspaceDir, scope = {}) {
	const { executionWorkspaceDir } = normalizeWorkspaceSkillRoots({
		agentWorkspaceDir: workspaceDir,
		executionWorkspaceDir: scope.executionWorkspaceDir,
		executionWorkspaceFileHost: scope.executionWorkspaceFileHost
	});
	return executionWorkspaceDir ? JSON.stringify([executionWorkspaceDir, scope.executionWorkspaceFileHost]) : "";
}
/** Publish completed discovery facts without doing filesystem work. */
function bumpSkillsSnapshotVersion(params) {
	const event = {
		workspaceDir: params?.workspaceDir,
		reason: params?.reason ?? "manual",
		changedPath: params?.changedPath
	};
	sourceClock = bumpVersion(sourceClock);
	if (!params?.workspaceDir) globalSourceVersion = sourceClock;
	else recordSourceVersion(discoveryVersions, params.workspaceDir, params.sourceScopes);
	return publishChange(event);
}
function recordSourceVersion(versions, workspaceDir, scopes) {
	if (!scopes) {
		versions.workspace.set(workspaceDir, sourceClock);
		return;
	}
	let revisions = versions.scopes.get(workspaceDir);
	if (!revisions) {
		revisions = /* @__PURE__ */ new Map();
		versions.scopes.set(workspaceDir, revisions);
	}
	for (const scope of scopes) revisions.set(sourceScopeKey(workspaceDir, scope), sourceClock);
}
function readSourceVersion(versions, workspaceDir, scope) {
	return Math.max(versions.workspace.get(workspaceDir) ?? 0, versions.scopes.get(workspaceDir)?.get(sourceScopeKey(workspaceDir, scope)) ?? 0);
}
/** Supporting-file changes refresh copies without rebuilding discovery or publishing snapshots. */
function markSkillsSupportingFilesChanged(params) {
	sourceClock = bumpVersion(sourceClock);
	recordSourceVersion(supportingFileVersions, params.workspaceDir, params.sourceScopes);
}
/** Source revisions invalidate discovery and in-flight reads, never consumer generation facts. */
function getSkillsSourceVersion(workspaceDir, scope) {
	return Math.max(globalSourceVersion, readSourceVersion(discoveryVersions, workspaceDir, scope));
}
function getSkillsResourceVersion(workspaceDir, scope) {
	return Math.max(getSkillsSourceVersion(workspaceDir, scope), readSourceVersion(supportingFileVersions, workspaceDir, scope));
}
function getSkillsSnapshotVersion(workspaceDir) {
	if (!workspaceDir) return globalVersion;
	return Math.max(globalVersion, workspaceVersions.get(workspaceDir) ?? 0);
}
function shouldRefreshSnapshotForVersion(cachedVersion, nextVersion) {
	const cached = typeof cachedVersion === "number" ? cachedVersion : 0;
	const next = typeof nextVersion === "number" ? nextVersion : 0;
	return next === 0 ? cached > 0 : cached < next;
}
function resetSkillsRefreshStateForTest() {
	listeners.clear();
	workspaceVersions.clear();
	for (const versions of [discoveryVersions, supportingFileVersions]) {
		versions.workspace.clear();
		versions.scopes.clear();
	}
	globalVersion = INITIAL_SKILLS_SNAPSHOT_VERSION;
	versionClock = globalVersion;
	sourceClock = bumpVersion(sourceClock);
	globalSourceVersion = sourceClock;
}
//#endregion
export { markSkillsSupportingFilesChanged as a, resetSkillsRefreshStateForTest as c, getSkillsSourceVersion as i, shouldRefreshSnapshotForVersion as l, getSkillsResourceVersion as n, notifySkillsWatchAvailable as o, getSkillsSnapshotVersion as r, registerSkillsChangeListener as s, bumpSkillsSnapshotVersion as t };
