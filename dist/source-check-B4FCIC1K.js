import { d as resolveLegacyAuthStorePath, l as resolveAuthStorePath, n as getRuntimeAuthProfileStoreSnapshot, r as hasAnyRuntimeAuthProfileStoreSource, s as resolveAuthStatePath } from "./runtime-snapshots-BrKHRFr0.js";
import { n as readPersistedAuthProfileStateRaw, r as readPersistedAuthProfileStoreRaw } from "./sqlite-DsZClgCP.js";
import fs from "node:fs";
//#region src/agents/auth-profiles/source-check.ts
/**
* Auth-profile source probes for runtime and persisted stores.
* These checks intentionally avoid loading secret-bearing credential payloads.
*/
function hasStoredAuthProfileFiles(agentDir) {
	return fs.existsSync(resolveAuthStorePath(agentDir)) || fs.existsSync(resolveAuthStatePath(agentDir)) || fs.existsSync(resolveLegacyAuthStorePath(agentDir));
}
/** Returns true when any local/runtime/main auth profile source exists. */
function hasAnyAuthProfileStoreSource(agentDir) {
	if (hasLocalAuthProfileStoreSource(agentDir)) return true;
	if (hasAnyRuntimeAuthProfileStoreSource(agentDir)) return true;
	const authPath = resolveAuthStorePath(agentDir);
	const mainAuthPath = resolveAuthStorePath();
	if (agentDir && authPath !== mainAuthPath && (hasStoredAuthProfileFiles(void 0) || readPersistedAuthProfileStoreRaw(void 0) || readPersistedAuthProfileStateRaw(void 0))) return true;
	return false;
}
/** Returns true when the requested agent dir has a local auth profile source. */
function hasLocalAuthProfileStoreSource(agentDir) {
	const runtimeStore = getRuntimeAuthProfileStoreSnapshot(agentDir);
	if (runtimeStore && Object.keys(runtimeStore.profiles).length > 0) return true;
	if (hasStoredAuthProfileFiles(agentDir)) return true;
	return Boolean(readPersistedAuthProfileStoreRaw(agentDir) || readPersistedAuthProfileStateRaw(agentDir));
}
//#endregion
export { hasLocalAuthProfileStoreSource as n, hasAnyAuthProfileStoreSource as t };
