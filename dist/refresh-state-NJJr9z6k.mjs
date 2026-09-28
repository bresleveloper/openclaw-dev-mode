import { n as sha256Hex } from "./node-crypto-Df3MIs6V.mjs";
import "./crypto-digest-D9Nqq3c7.mjs";
import path from "node:path";
//#region src/skills/loading/workspace-skill-roots.ts
function normalizeWorkspaceSkillRoots(roots) {
	const agentWorkspaceDir = path.resolve(roots.agentWorkspaceDir);
	const executionWorkspaceDir = roots.executionWorkspaceDir ? path.resolve(roots.executionWorkspaceDir) : void 0;
	return executionWorkspaceDir && executionWorkspaceDir !== agentWorkspaceDir ? {
		agentWorkspaceDir,
		executionWorkspaceDir
	} : { agentWorkspaceDir };
}
function resolveWorkspaceSkillDirectories(workspaceDir, workspaceOnly = false) {
	const workspace = {
		dir: path.resolve(workspaceDir, "skills"),
		source: "openclaw-workspace"
	};
	return workspaceOnly ? [workspace] : [{
		dir: path.resolve(workspaceDir, ".agents", "skills"),
		source: "agents-skills-project"
	}, workspace];
}
//#endregion
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
const workspaceSources = /* @__PURE__ */ new Map();
const reconcilingWorkspaces = /* @__PURE__ */ new Set();
const INITIAL_SKILLS_SNAPSHOT_VERSION = Date.now();
let versionClock = INITIAL_SKILLS_SNAPSHOT_VERSION;
let globalVersion = INITIAL_SKILLS_SNAPSHOT_VERSION;
let sourceClock = INITIAL_SKILLS_SNAPSHOT_VERSION;
let globalSourceVersion = sourceClock;
let listenerErrorHandler;
function bumpVersion(current) {
	const now = Date.now();
	return now <= current ? current + 1 : now;
}
function emit(event) {
	for (const listener of listeners) try {
		listener(event);
	} catch (err) {
		listenerErrorHandler?.(err);
	}
}
function publishChange(event) {
	versionClock = bumpVersion(versionClock);
	if (event.workspaceDir) workspaceVersions.set(event.workspaceDir, versionClock);
	else globalVersion = versionClock;
	emit(event);
	return versionClock;
}
function setSkillsChangeListenerErrorHandler(handler) {
	listenerErrorHandler = handler;
}
function registerSkillsChangeListener(listener) {
	listeners.add(listener);
	return () => {
		listeners.delete(listener);
	};
}
function sourceScopeKey(workspaceDir, scope = {}) {
	const { executionWorkspaceDir } = normalizeWorkspaceSkillRoots({
		agentWorkspaceDir: workspaceDir,
		executionWorkspaceDir: scope.executionWorkspaceDir
	});
	return executionWorkspaceDir ?? "";
}
/** Record resolved file-backed winners at the discovery boundary, before session filtering. */
function observeSkillsSnapshotSource(params) {
	const fingerprint = sha256Hex(JSON.stringify(params.entries.map(({ skill, skillKey }) => [
		skill.name,
		skillKey,
		skill.source,
		skill.filePath,
		skill.contentHash
	])));
	let sources = workspaceSources.get(params.workspaceDir);
	if (!sources) {
		sources = /* @__PURE__ */ new Map();
		workspaceSources.set(params.workspaceDir, sources);
	}
	const previous = sources.get(params.sourceKey);
	sources.set(params.sourceKey, {
		scopeKey: sourceScopeKey(params.workspaceDir, params.sourceScope),
		fingerprint,
		reconcile: params.reconcile,
		suspend: params.suspend
	});
	if (previous && previous.fingerprint !== fingerprint && !reconcilingWorkspaces.has(params.workspaceDir)) publishChange({
		workspaceDir: params.workspaceDir,
		reason: "manual"
	});
}
function suspendSkillsSnapshotSources(workspaceDir, scope) {
	const key = sourceScopeKey(workspaceDir, scope);
	for (const source of workspaceSources.get(workspaceDir)?.values() ?? []) if (source.scopeKey === key) {
		source.suspend();
		source.suspended = true;
	}
}
function reconcileWorkspaceSources(workspaceDir, scopes, inputs) {
	const sources = workspaceSources.get(workspaceDir);
	if (!sources?.size) return true;
	const selectedScopes = scopes && new Set(scopes.map((scope) => sourceScopeKey(workspaceDir, scope)));
	let changed = false;
	reconcilingWorkspaces.add(workspaceDir);
	try {
		for (const [key, previous] of Array.from(sources)) {
			if (selectedScopes && !selectedScopes.has(previous.scopeKey)) continue;
			if (previous.suspended && (!inputs || previous.scopeKey !== "" && previous.scopeKey !== sourceScopeKey(workspaceDir, inputs.sourceScope))) continue;
			const nextKey = previous.reconcile(inputs);
			changed ||= sources.get(nextKey)?.fingerprint !== previous.fingerprint;
			if (nextKey !== key) sources.delete(key);
		}
	} catch (error) {
		listenerErrorHandler?.(error);
		changed = true;
	} finally {
		reconcilingWorkspaces.delete(workspaceDir);
	}
	return changed;
}
function bumpSkillsSnapshotVersion(params) {
	const event = {
		workspaceDir: params?.workspaceDir,
		reason: params?.reason ?? "manual",
		changedPath: params?.changedPath
	};
	const semanticChange = event.reason === "config-change" || event.reason === "remote-node" || event.reason === "watch-unavailable";
	sourceClock = bumpVersion(sourceClock);
	if (!params?.workspaceDir) {
		globalSourceVersion = sourceClock;
		if (semanticChange || workspaceSources.size === 0) return publishChange(event);
		for (const workspaceDir of workspaceSources.keys()) if (reconcileWorkspaceSources(workspaceDir)) publishChange({
			...event,
			workspaceDir
		});
		return getSkillsSnapshotVersion();
	}
	const workspaceDir = params.workspaceDir;
	recordSourceVersion(discoveryVersions, workspaceDir, params.sourceScopes);
	if (!semanticChange && !reconcileWorkspaceSources(workspaceDir, params.sourceScopes, params.refreshInputs)) return getSkillsSnapshotVersion(workspaceDir);
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
	workspaceSources.clear();
	reconcilingWorkspaces.clear();
	globalVersion = INITIAL_SKILLS_SNAPSHOT_VERSION;
	versionClock = globalVersion;
	sourceClock = bumpVersion(sourceClock);
	globalSourceVersion = sourceClock;
	listenerErrorHandler = void 0;
}
//#endregion
export { markSkillsSupportingFilesChanged as a, resetSkillsRefreshStateForTest as c, suspendSkillsSnapshotSources as d, normalizeWorkspaceSkillRoots as f, getSkillsSourceVersion as i, setSkillsChangeListenerErrorHandler as l, getSkillsResourceVersion as n, observeSkillsSnapshotSource as o, resolveWorkspaceSkillDirectories as p, getSkillsSnapshotVersion as r, registerSkillsChangeListener as s, bumpSkillsSnapshotVersion as t, shouldRefreshSnapshotForVersion as u };
