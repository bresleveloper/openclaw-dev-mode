import { r as cloneEnvWithPlatformSemantics } from "./config-env-vars-DjPHKieF.mjs";
import { r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-DRG_I6tz.mjs";
import { l as resolveSharedMainAuthAgentDir, s as resolveSharedAuthStoreOwnershipAsync } from "./path-resolve-CIRhdX6A.mjs";
import { g as resolveAuthProfileDatabasePath, h as resolveAuthProfileDatabaseOwnerId } from "./sqlite-CW8wNN4G.mjs";
import { x as withCanonicalAuthProfileCredentialObserver } from "./oauth-shared-CFtD6sCU.mjs";
import { n as prepareAgentAuthProfileRowsRead, r as readSharedAuthProfileRows, t as loadPersistedAuthProfileStoreFromRows } from "./sqlite-read-Ct0XVCT8.mjs";
import path from "node:path";
//#region src/agents/plugin-model-catalog-auth.ts
function pluginModelCatalogCredentialValues(credential) {
	if (!credential) return [];
	return (credential.type === "api_key" ? [credential.key] : credential.type === "token" ? [credential.token] : [credential.access, credential.refresh]).filter((value) => typeof value === "string" && value.length > 0);
}
/** Retain credentials acquired during discovery, even if logout removes them before it settles. */
async function withPluginModelCatalogAuthObservations(snapshot, run) {
	const captured = new Map(snapshot.map((owner) => [path.resolve(owner.databasePath), new Map(Object.entries(owner.credentials).map(([id, values]) => [id, new Set(values)]))]));
	const result = await withCanonicalAuthProfileCredentialObserver(({ databasePath, profiles }) => {
		const owner = captured.get(path.resolve(databasePath));
		if (!owner) return;
		for (const [id, credential] of Object.entries(profiles)) {
			const values = owner.get(id) ?? /* @__PURE__ */ new Set();
			for (const value of pluginModelCatalogCredentialValues(credential)) values.add(value);
			owner.set(id, values);
		}
	}, run);
	for (const owner of snapshot) owner.credentials = Object.fromEntries([...captured.get(path.resolve(owner.databasePath))].map(([id, values]) => [id, [...values]]));
	return result;
}
/** Capture only existing canonical owners; catalog-only credentials retain their recovery policy. */
async function capturePluginModelCatalogAuth(agentDir, env) {
	const capturedEnv = cloneEnvWithPlatformSemantics(env);
	const state = captureOpenClawStateWorkerContext({ env: capturedEnv });
	const sharedDir = resolveSharedMainAuthAgentDir(capturedEnv);
	const localPath = resolveAuthProfileDatabasePath(agentDir);
	const sharedOwnership = await resolveSharedAuthStoreOwnershipAsync(state);
	const sharedPath = sharedOwnership.location === "state-db" ? state.admission.databasePath : resolveAuthProfileDatabasePath(sharedDir);
	const owners = [{
		databasePath: sharedPath,
		kind: sharedOwnership.location === "state-db" ? "shared-state" : "agent",
		agentDir: sharedDir
	}, ...localPath === sharedPath ? [] : [{
		databasePath: localPath,
		kind: "agent",
		agentDir
	}]];
	const snapshot = [];
	for (const owner of owners) {
		const reader = owner.kind === "agent" ? prepareAgentAuthProfileRowsRead({
			databasePath: owner.databasePath,
			agentId: resolveAuthProfileDatabaseOwnerId(owner.agentDir),
			env: capturedEnv
		}) : void 0;
		let rows;
		try {
			rows = reader ? await reader.read() : await readSharedAuthProfileRows(state);
			state.admission.assertCurrent();
		} finally {
			await reader?.dispose();
		}
		const store = loadPersistedAuthProfileStoreFromRows(rows, owner.databasePath);
		snapshot.push({
			databasePath: owner.databasePath,
			kind: owner.kind,
			credentials: Object.fromEntries(Object.entries(store?.profiles ?? {}).map(([id, credential]) => [id, pluginModelCatalogCredentialValues(credential)]))
		});
	}
	return snapshot;
}
//#endregion
export { pluginModelCatalogCredentialValues as n, withPluginModelCatalogAuthObservations as r, capturePluginModelCatalogAuth as t };
