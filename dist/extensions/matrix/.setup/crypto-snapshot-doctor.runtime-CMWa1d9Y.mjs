import { b as readMatrixIdbSnapshotJsonFromStore, o as MATRIX_IDB_SNAPSHOT_FILENAME, p as openMatrixIdbSnapshotStoreOptions, w as writeMatrixIdbSnapshotJsonToStore } from "./storage-metadata-fHN6Df2m.mjs";
import { n as MATRIX_IDB_SNAPSHOT_LOCK_OPTIONS } from "./idb-persistence-lock-B3fZXyF_.mjs";
import { r as readLegacyMatrixIdbSnapshotStateUnlocked, t as isValidMatrixIdbSnapshotJson } from "./idb-persistence-c8uxcofH.mjs";
import { randomUUID } from "node:crypto";
import path from "node:path";
import fs from "node:fs";
import fs$1 from "node:fs/promises";
import { isDeepStrictEqual } from "node:util";
import { withFileLock } from "openclaw/plugin-sdk/file-lock";
//#region extensions/matrix/src/matrix/crypto-snapshot-doctor.runtime.ts
async function migrateLegacyMatrixIdbSnapshot(params) {
	const snapshotPath = path.join(params.storageRootDir, MATRIX_IDB_SNAPSHOT_FILENAME);
	try {
		await withFileLock(snapshotPath, MATRIX_IDB_SNAPSHOT_LOCK_OPTIONS, () => migrateLegacyMatrixIdbSnapshotLocked(params));
	} catch (err) {
		params.warnings.push(`Failed locking Matrix IndexedDB snapshot for ${params.storageRootDir}: ${String(err)}; left legacy source in place`);
	}
}
async function migrateLegacyMatrixIdbSnapshotLocked(params) {
	const sourcePath = path.join(params.storageRootDir, MATRIX_IDB_SNAPSHOT_FILENAME);
	let snapshot;
	try {
		snapshot = readLegacyMatrixIdbSnapshotStateUnlocked(params.storageRootDir);
	} catch (err) {
		params.warnings.push(`Failed reading Matrix IndexedDB snapshot legacy source for ${params.storageRootDir}: ${String(err)}; left source in place`);
		return;
	}
	if (!snapshot) {
		if (!fs.existsSync(sourcePath)) return;
		const archived = await archiveLegacyMatrixIdbSnapshot(params);
		params.warnings.push(archived ? `Matrix IndexedDB snapshot legacy source is invalid for ${params.storageRootDir}; archived without import` : `Matrix IndexedDB snapshot legacy source is invalid for ${params.storageRootDir}; left active because archival failed`);
		return;
	}
	const snapshotJson = JSON.stringify(snapshot);
	const store = params.context.openPluginStateKeyedStore(openMatrixIdbSnapshotStoreOptions(params.storageRootDir));
	let persisted;
	let hadPartialState;
	try {
		persisted = await readMatrixIdbSnapshotJsonFromStore({ store });
		const persistedIsValid = persisted ? isValidMatrixIdbSnapshotJson(persisted) : false;
		hadPartialState = !persistedIsValid && (await store.entries()).length > 0;
		if (!persistedIsValid) persisted = null;
	} catch (err) {
		params.warnings.push(`Failed inspecting Matrix IndexedDB snapshot SQLite state for ${params.storageRootDir}: ${String(err)}; left legacy source in place`);
		return;
	}
	if (persisted && !snapshotContentMatches(persisted, snapshot)) {
		if (await archiveLegacyMatrixIdbSnapshot(params)) params.notices.push(`Kept the canonical Matrix IndexedDB snapshot in SQLite and archived a differing legacy source for ${params.storageRootDir}`);
		return;
	}
	if (!persisted) {
		try {
			await writeMatrixIdbSnapshotJsonToStore({
				snapshotJson,
				databaseCount: snapshot.length,
				store
			});
			persisted = await readMatrixIdbSnapshotJsonFromStore({ store });
		} catch (err) {
			params.warnings.push(`Failed importing Matrix IndexedDB snapshot for ${params.storageRootDir}: ${String(err)}; left legacy source in place`);
			return;
		}
		if (!persisted || !snapshotContentMatches(persisted, snapshot)) {
			params.warnings.push(`Failed verifying Matrix IndexedDB snapshot for ${params.storageRootDir}; left legacy source in place`);
			return;
		}
		params.changes.push(hadPartialState ? `Repaired partial or invalid Matrix IndexedDB snapshot SQLite state for ${params.storageRootDir}` : `Migrated Matrix IndexedDB snapshot JSON to SQLite for ${params.storageRootDir}`);
	}
	await archiveLegacyMatrixIdbSnapshot(params);
}
function snapshotContentMatches(persistedJson, snapshot) {
	try {
		return isDeepStrictEqual(JSON.parse(persistedJson), snapshot);
	} catch {
		return false;
	}
}
async function archiveLegacyMatrixIdbSnapshot(params) {
	const sourcePath = path.join(params.storageRootDir, MATRIX_IDB_SNAPSHOT_FILENAME);
	const archivePath = `${sourcePath}.migrated-${(/* @__PURE__ */ new Date()).toISOString().replaceAll(":", "-")}-${randomUUID()}`;
	try {
		await fs$1.rename(sourcePath, archivePath);
		params.changes.push(`Archived Matrix IndexedDB snapshot legacy source -> ${archivePath}`);
		return true;
	} catch (err) {
		params.warnings.push(`Failed archiving Matrix IndexedDB snapshot legacy source: ${String(err)}`);
		return false;
	}
}
//#endregion
export { migrateLegacyMatrixIdbSnapshot };
