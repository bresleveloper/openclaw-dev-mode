import { t as clearRuntimeConfigSnapshot, v as setRuntimeConfigSnapshot, y as setRuntimeConfigSnapshotRefreshHandler } from "./runtime-snapshot-D93_HOsR.js";
import { a as replaceRuntimeAuthProfileStoreSnapshots, n as getRuntimeAuthProfileStoreSnapshot, t as clearRuntimeAuthProfileStoreSnapshots } from "./runtime-snapshots-BrKHRFr0.js";
import { r as setActiveRuntimeWebToolsMetadata, t as clearActiveRuntimeWebToolsMetadata } from "./runtime-web-tools-state-fE_he60Y.js";
//#region src/secrets/runtime-state.ts
/** Holds active secrets runtime snapshots, refresh context, and cleanup hooks. */
let activeSnapshot = null;
let activeRefreshContext = null;
const clearHooks = /* @__PURE__ */ new Set();
const preparedSnapshotRefreshContext = /* @__PURE__ */ new WeakMap();
/**
* Clones refresh context while preserving callback identity and isolating mutable maps/config.
*/
function cloneSecretsRuntimeRefreshContext(context) {
	const cloned = {
		env: { ...context.env },
		explicitAgentDirs: context.explicitAgentDirs ? [...context.explicitAgentDirs] : null,
		includeAuthStoreRefs: context.includeAuthStoreRefs,
		loadablePluginOrigins: new Map(context.loadablePluginOrigins),
		...context.manifestRegistry ? { manifestRegistry: structuredClone(context.manifestRegistry) } : {}
	};
	if (context.loadAuthStore) cloned.loadAuthStore = context.loadAuthStore;
	return cloned;
}
function cloneSnapshot(snapshot) {
	return {
		sourceConfig: structuredClone(snapshot.sourceConfig),
		config: structuredClone(snapshot.config),
		authStores: snapshot.authStores.map((entry) => ({
			agentDir: entry.agentDir,
			store: structuredClone(entry.store)
		})),
		warnings: snapshot.warnings.map((warning) => ({ ...warning })),
		webTools: structuredClone(snapshot.webTools)
	};
}
/**
* Associates a prepared snapshot with the refresh context needed after activation.
*/
function setPreparedSecretsRuntimeSnapshotRefreshContext(snapshot, context) {
	preparedSnapshotRefreshContext.set(snapshot, cloneSecretsRuntimeRefreshContext(context));
}
/**
* Returns the refresh context stored for a prepared snapshot, if any.
*/
function getPreparedSecretsRuntimeSnapshotRefreshContext(snapshot) {
	const context = preparedSnapshotRefreshContext.get(snapshot);
	return context ? cloneSecretsRuntimeRefreshContext(context) : null;
}
/**
* Returns the active refresh context without exposing mutable runtime state.
*/
function getActiveSecretsRuntimeRefreshContext() {
	return activeRefreshContext ? cloneSecretsRuntimeRefreshContext(activeRefreshContext) : null;
}
/**
* Returns the env used by the active runtime snapshot, falling back to process env.
*/
function getActiveSecretsRuntimeEnv() {
	return { ...activeRefreshContext?.env ?? process.env };
}
/**
* Registers cleanup hooks that run whenever the active secrets runtime snapshot is cleared.
*/
function registerSecretsRuntimeStateClearHook(clearHook) {
	clearHooks.add(clearHook);
}
/**
* Atomically activates a prepared secrets snapshot across config, auth-store, and web-tool state.
*/
function activateSecretsRuntimeSnapshotState(params) {
	const next = cloneSnapshot(params.snapshot);
	const nextRefreshContext = params.refreshContext ? cloneSecretsRuntimeRefreshContext(params.refreshContext) : null;
	setRuntimeConfigSnapshot(next.config, next.sourceConfig);
	replaceRuntimeAuthProfileStoreSnapshots(next.authStores);
	activeSnapshot = next;
	activeRefreshContext = nextRefreshContext;
	if (nextRefreshContext) preparedSnapshotRefreshContext.set(next, cloneSecretsRuntimeRefreshContext(nextRefreshContext));
	setActiveRuntimeWebToolsMetadata(next.webTools);
	setRuntimeConfigSnapshotRefreshHandler(params.refreshHandler);
}
/**
* Returns a cloned active secrets runtime snapshot for callers that need mutable data.
*/
function getActiveSecretsRuntimeSnapshot() {
	if (!activeSnapshot) return null;
	const snapshot = cloneSnapshot(activeSnapshot);
	if (activeRefreshContext) preparedSnapshotRefreshContext.set(snapshot, cloneSecretsRuntimeRefreshContext(activeRefreshContext));
	return snapshot;
}
function getActiveSecretsRuntimeConfigSnapshot() {
	if (!activeSnapshot) return null;
	return {
		config: activeSnapshot.config,
		sourceConfig: activeSnapshot.sourceConfig
	};
}
/**
* Returns current auth stores, preferring live auth-store snapshots over activation-time clones.
*/
function getLiveSecretsRuntimeAuthStores() {
	if (!activeSnapshot) return [];
	return activeSnapshot.authStores.map((entry) => ({
		agentDir: entry.agentDir,
		store: getRuntimeAuthProfileStoreSnapshot(entry.agentDir) ?? structuredClone(entry.store)
	}));
}
/**
* Clears active secrets runtime state and all linked config/auth/web-tool snapshots.
*/
function clearSecretsRuntimeSnapshot() {
	activeSnapshot = null;
	activeRefreshContext = null;
	clearActiveRuntimeWebToolsMetadata();
	setRuntimeConfigSnapshotRefreshHandler(null);
	clearRuntimeConfigSnapshot();
	clearRuntimeAuthProfileStoreSnapshots();
	for (const clearHook of clearHooks) clearHook();
}
//#endregion
export { getActiveSecretsRuntimeRefreshContext as a, getPreparedSecretsRuntimeSnapshotRefreshContext as c, getActiveSecretsRuntimeEnv as i, registerSecretsRuntimeStateClearHook as l, clearSecretsRuntimeSnapshot as n, getActiveSecretsRuntimeSnapshot as o, getActiveSecretsRuntimeConfigSnapshot as r, getLiveSecretsRuntimeAuthStores as s, activateSecretsRuntimeSnapshotState as t, setPreparedSecretsRuntimeSnapshotRefreshContext as u };
