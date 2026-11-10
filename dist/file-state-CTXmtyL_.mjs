import { t as hasErrnoCode } from "./errno-FR4CRyya.mjs";
import { d as readDatabasePathIdentity, i as databaseFileIdentityKey, o as inspectDatabasePathIdentitySync, u as readDatabaseIdentityBirthtime } from "./sqlite-worker-identity-DLqVBf5J.mjs";
import { l as getOpenClawDatabaseMaintenanceScope } from "./openclaw-state-db-async-lifecycle-CtHZ7B35.mjs";
import { n as runWithSpawnBroker, t as getSpawnBroker } from "./context-JTQRB4fe.mjs";
import { n as isArtifactPreservingStateRead } from "./artifact-preserving-state-reads-CSUBkGbZ.mjs";
import { r as readOnlyWorkerScope, t as captureSqliteReadOnlyWorkerScope } from "./sqlite-readonly-worker-context-DNk9aB7C.mjs";
import { c as registerAgentDatabaseReaderCloser, s as matchesAgentDatabaseReadCandidatePath } from "./agent-database-readers-DSwi8tar.mjs";
import { y as registerOpenClawStateDatabaseAsyncResource } from "./openclaw-state-db-cache-R1v7ogY0.mjs";
import { t as observeOwnedDirectory } from "./owned-directory-observation-DGvnK2He.mjs";
import fs from "node:fs";
import { stat as stat$1 } from "node:fs/promises";
import path from "node:path";
import { isMainThread } from "node:worker_threads";
//#region src/agents/auth-profiles/file-state.ts
const directories = /* @__PURE__ */ new Map();
let gatewayFileChangePublisher;
const listeners = /* @__PURE__ */ new Set();
const legacyNames = /* @__PURE__ */ new Set([
	"auth-profiles.json",
	"auth-state.json",
	"auth.json",
	"oauth.json"
]);
function missingFile(error) {
	return hasErrnoCode(error, "ENOENT") ? null : void 0;
}
function retireDirectory(directory, state) {
	state.observation.close();
	directories.delete(directory);
}
registerOpenClawStateDatabaseAsyncResource({ close: async () => closeAuthProfileFileState() });
registerAgentDatabaseReaderCloser((candidates, retainedPaths) => {
	for (const [directory, state] of directories) {
		for (const databasePath of state.identities.keys()) if (!retainedPaths?.has(path.resolve(databasePath)) && candidates.some((candidate) => matchesAgentDatabaseReadCandidatePath(candidate, databasePath))) state.identities.delete(databasePath);
		if (!state.identities.size && candidates.some(({ path: pathname }) => path.dirname(path.resolve(pathname)) === directory && !retainedPaths?.has(path.resolve(pathname)))) retireDirectory(directory, state);
	}
});
function refreshDirectory(directory, state) {
	state.dirty = true;
	state.refresh ??= Promise.resolve().then(async () => {
		try {
			while (state.dirty && directories.get(directory) === state) {
				state.dirty = false;
				let identityChanged = false;
				const createdPaths = [];
				let sourcesChanged = false;
				for (const [databasePath, previous] of state.identities) {
					const file = await stat$1(databasePath, { bigint: true }).catch(missingFile);
					const current = file === void 0 ? void 0 : file?.isFile() && previous?.key === `file:${databaseFileIdentityKey(file)}` && previous.birthtime === readDatabaseIdentityBirthtime(file) ? previous : await readDatabasePathIdentity(databasePath).catch(() => void 0);
					if (directories.get(directory) !== state) return;
					if (state.identities.get(databasePath) !== previous) {
						state.dirty = true;
						continue;
					}
					if (current?.key !== previous?.key || current?.birthtime !== previous?.birthtime) {
						if (previous?.key.startsWith("path:") && current?.key.startsWith("file:")) createdPaths.push(databasePath);
						else identityChanged = true;
						state.identities.set(databasePath, current);
					}
				}
				for (const [sourcePath, previous] of state.presence) {
					const current = await stat$1(sourcePath).then(() => true, () => false);
					if (directories.get(directory) !== state) return;
					if (current !== previous) {
						sourcesChanged = true;
						state.presence.set(sourcePath, current);
					}
				}
				if (state.identities.size || sourcesChanged) await state.publishChange({
					directory,
					identityChanged,
					sourcesChanged,
					createdPaths
				});
			}
		} finally {
			state.refresh = void 0;
		}
	});
	return state.refresh;
}
function captureFileChangePublisher() {
	const broker = getSpawnBroker();
	const runWithReaders = captureSqliteReadOnlyWorkerScope();
	const signal = readOnlyWorkerScope.getStore()?.controller.signal;
	return async (change) => {
		if (signal?.aborted) return;
		await runWithSpawnBroker(broker, () => runWithReaders(() => Promise.all(Array.from(listeners, (listener) => Promise.resolve(listener(change))))));
	};
}
/** Retained observers must use the current Gateway's host bindings after a restart. */
function bindAuthProfileFileObservationReaders() {
	const publishChange = captureFileChangePublisher();
	gatewayFileChangePublisher = publishChange;
	for (const state of directories.values()) state.publishChange = publishChange;
}
function directoryState(directory) {
	const existing = directories.get(directory);
	if (existing) return existing;
	const identities = /* @__PURE__ */ new Map();
	const state = {
		identities,
		presence: /* @__PURE__ */ new Map(),
		dirty: false,
		publishChange: gatewayFileChangePublisher ?? captureFileChangePublisher(),
		observation: observeOwnedDirectory(directory, (filename) => {
			if (filename === void 0 || legacyNames.has(filename) || [...identities.keys()].some((databasePath) => filename === path.basename(databasePath))) refreshDirectory(directory, state);
		}, { recoveryIntervalMs: 3e4 })
	};
	directories.set(directory, state);
	return state;
}
/** File facts belong to the auth owner; observation re-admits changed paths off-thread. */
function readAuthProfileDatabaseIdentity(databasePath) {
	const state = directoryState(path.dirname(databasePath));
	if (!state.identities.has(databasePath)) {
		const identity = inspectDatabasePathIdentitySync(databasePath);
		state.identities.set(databasePath, identity);
	}
	return state.identities.get(databasePath);
}
function captureAuthProfileFileIdentity(databasePath) {
	const identity = readAuthProfileDatabaseIdentity(databasePath);
	const state = directoryState(path.dirname(databasePath));
	return {
		identity,
		assertCurrent() {
			if (!state.identities.has(databasePath) || state.identities.get(databasePath) !== identity || directories.get(path.dirname(databasePath)) !== state) throw new Error("Auth profile database file identity changed");
		}
	};
}
/** A first owner write makes an admitted absence available to subsequent readers immediately. */
function noteAuthProfileFileWrite(databasePath) {
	const absent = [...directories.values()].flatMap((state) => [...state.identities].flatMap(([pathname, identity]) => identity?.key.startsWith("file:") ? [] : [{
		state,
		pathname,
		identity
	}]));
	if (!absent.length) return;
	const written = inspectDatabasePathIdentitySync(databasePath);
	for (const { state, pathname, identity } of absent) if (pathname === databasePath || written && identity?.canonicalPath === written.canonicalPath) state.identities.set(pathname, written);
}
function authProfileSourceExists(sourcePath) {
	if (!isMainThread || isArtifactPreservingStateRead() || getOpenClawDatabaseMaintenanceScope()) return fs.existsSync(sourcePath);
	const state = directoryState(path.dirname(sourcePath));
	if (!state.presence.has(sourcePath)) state.presence.set(sourcePath, fs.existsSync(sourcePath));
	return state.presence.get(sourcePath);
}
/** Cold credential admission revalidates migration inputs before publishing a new owner. */
function admitAuthProfileLegacySources(sourcePaths) {
	for (const sourcePath of new Set(sourcePaths)) directoryState(path.dirname(sourcePath)).presence.set(sourcePath, fs.existsSync(sourcePath));
}
function registerAuthProfileFileChangeListener(listener) {
	listeners.add(listener);
	return () => {
		listeners.delete(listener);
	};
}
/** Explicit refresh joins observation without retiring unchanged file authority. */
async function refreshAuthProfileFileState() {
	await Promise.all([...directories].map(([directory, state]) => refreshDirectory(directory, state)));
}
function closeAuthProfileFileState() {
	gatewayFileChangePublisher = void 0;
	for (const [directory, state] of directories) retireDirectory(directory, state);
}
//#endregion
export { noteAuthProfileFileWrite as a, registerAuthProfileFileChangeListener as c, captureAuthProfileFileIdentity as i, authProfileSourceExists as n, readAuthProfileDatabaseIdentity as o, bindAuthProfileFileObservationReaders as r, refreshAuthProfileFileState as s, admitAuthProfileLegacySources as t };
