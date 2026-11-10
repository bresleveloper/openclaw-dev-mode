import { t as getMatrixRuntime } from "./runtime-1kn1P6io.mjs";
import { n as RETIRED_MATRIX_STATE_REMEDIATION } from "./retired-state-C4UnLIg4.mjs";
import { c as writeMatrixIdbSnapshotJson, r as readMatrixIdbSnapshotJson } from "./crypto-state-store-DclM-fO5.mjs";
import { t as LogService } from "./logger-CuAzdD8Q.mjs";
import { n as MATRIX_IDB_SNAPSHOT_LOCK_OPTIONS } from "./idb-persistence-lock-Bh3ZLIsE.mjs";
import { toErrorObject } from "openclaw/plugin-sdk/error-runtime";
import { asOptionalObjectRecord } from "openclaw/plugin-sdk/string-coerce-runtime";
import path from "node:path";
import fs from "node:fs";
import { withFileLock } from "openclaw/plugin-sdk/file-lock";
import { IDBFactory, indexedDB } from "fake-indexeddb";
//#region extensions/matrix/src/matrix/sdk/idb-persistence.ts
const LEGACY_SNAPSHOT_DIAGNOSTIC = {
	code: "matrix-idb-snapshot-requires-doctor",
	message: "Matrix IndexedDB snapshot exists outside the current SQLite state",
	remediation: RETIRED_MATRIX_STATE_REMEDIATION
};
var MatrixIdbSnapshotMigrationRequiredError = class extends Error {
	constructor() {
		super(`${LEGACY_SNAPSHOT_DIAGNOSTIC.message}; ${LEGACY_SNAPSHOT_DIAGNOSTIC.remediation}`);
		this.code = LEGACY_SNAPSHOT_DIAGNOSTIC.code;
		this.remediation = LEGACY_SNAPSHOT_DIAGNOSTIC.remediation;
		this.name = "MatrixIdbSnapshotMigrationRequiredError";
	}
};
function isValidIdbIndexSnapshot(value) {
	const candidate = asOptionalObjectRecord(value);
	return typeof candidate?.name === "string" && (typeof candidate.keyPath === "string" || Array.isArray(candidate.keyPath) && candidate.keyPath.every((entry) => typeof entry === "string")) && typeof candidate.multiEntry === "boolean" && typeof candidate.unique === "boolean";
}
function isValidIdbRecordSnapshot(value) {
	const candidate = asOptionalObjectRecord(value);
	return Boolean(candidate && "key" in candidate && "value" in candidate);
}
function isValidIdbStoreSnapshot(value) {
	const candidate = asOptionalObjectRecord(value);
	const keyPath = candidate?.keyPath;
	const validKeyPath = keyPath === null || typeof keyPath === "string" || Array.isArray(keyPath) && keyPath.every((entry) => typeof entry === "string");
	return typeof candidate?.name === "string" && validKeyPath && typeof candidate.autoIncrement === "boolean" && Array.isArray(candidate.indexes) && candidate.indexes.every((entry) => isValidIdbIndexSnapshot(entry)) && Array.isArray(candidate.records) && candidate.records.every((entry) => isValidIdbRecordSnapshot(entry));
}
function isValidIdbDatabaseSnapshot(value) {
	const candidate = asOptionalObjectRecord(value);
	return typeof candidate?.name === "string" && typeof candidate.version === "number" && Number.isFinite(candidate.version) && candidate.version > 0 && Array.isArray(candidate.stores) && candidate.stores.every((entry) => isValidIdbStoreSnapshot(entry));
}
function parseSnapshotPayload(data) {
	const parsed = JSON.parse(data);
	if (!Array.isArray(parsed) || parsed.length === 0) return null;
	if (!parsed.every((entry) => isValidIdbDatabaseSnapshot(entry))) throw new Error("Malformed IndexedDB snapshot payload");
	return parsed;
}
async function validateMatrixIdbSnapshotJson(data) {
	const snapshot = parseSnapshotPayload(data);
	if (!snapshot) throw new Error("Malformed IndexedDB snapshot payload");
	await preflightIndexedDatabases(snapshot);
}
function idbReq(req) {
	return new Promise((resolve, reject) => {
		req.addEventListener("success", () => resolve(req.result), { once: true });
		req.addEventListener("error", () => reject(toErrorObject(req.error, "Non-Error rejection")), { once: true });
	});
}
async function dumpIndexedDatabases(databasePrefix) {
	const idb = indexedDB;
	const dbList = await idb.databases();
	const snapshot = [];
	const expectedPrefix = databasePrefix ? `${databasePrefix}::` : null;
	for (const { name, version } of dbList) {
		if (!name || !version) continue;
		if (expectedPrefix && !name.startsWith(expectedPrefix)) continue;
		const db = await idbReq(idb.open(name, version));
		const stores = [];
		for (const storeName of db.objectStoreNames) {
			const store = db.transaction(storeName, "readonly").objectStore(storeName);
			const storeInfo = {
				name: storeName,
				keyPath: store.keyPath,
				autoIncrement: store.autoIncrement,
				indexes: [],
				records: []
			};
			for (const idxName of store.indexNames) {
				const idx = store.index(idxName);
				storeInfo.indexes.push({
					name: idxName,
					keyPath: idx.keyPath,
					multiEntry: idx.multiEntry,
					unique: idx.unique
				});
			}
			const keys = await idbReq(store.getAllKeys());
			const values = await idbReq(store.getAll());
			storeInfo.records = keys.map((k, i) => ({
				key: k,
				value: values[i]
			}));
			stores.push(storeInfo);
		}
		snapshot.push({
			name,
			version,
			stores
		});
		db.close();
	}
	return snapshot;
}
async function clearAccountIndexedDatabases(databasePrefix) {
	if (!databasePrefix) return;
	const names = await indexedDB.databases();
	for (const { name } of names) if (name?.startsWith(`${databasePrefix}::`)) await idbReq(indexedDB.deleteDatabase(name));
}
async function restoreIndexedDatabases(snapshot, idb) {
	for (const dbSnap of snapshot) {
		const request = idb.open(dbSnap.name, dbSnap.version);
		request.addEventListener("upgradeneeded", () => {
			const db = request.result;
			for (const storeSnap of dbSnap.stores) {
				const opts = {};
				if (storeSnap.keyPath !== null) opts.keyPath = storeSnap.keyPath;
				if (storeSnap.autoIncrement) opts.autoIncrement = true;
				const store = db.createObjectStore(storeSnap.name, opts);
				for (const idx of storeSnap.indexes) store.createIndex(idx.name, idx.keyPath, {
					unique: idx.unique,
					multiEntry: idx.multiEntry
				});
			}
		});
		const db = await idbReq(request);
		try {
			for (const storeSnap of dbSnap.stores) {
				if (storeSnap.records.length === 0) continue;
				const tx = db.transaction(storeSnap.name, "readwrite");
				await new Promise((resolve, reject) => {
					let enqueueError;
					tx.addEventListener("complete", () => resolve(), { once: true });
					tx.addEventListener("abort", () => reject(enqueueError ?? toErrorObject(tx.error, "IndexedDB restore transaction aborted")), { once: true });
					try {
						const store = tx.objectStore(storeSnap.name);
						for (const rec of storeSnap.records) if (storeSnap.keyPath !== null) store.put(rec.value);
						else store.put(rec.value, rec.key);
					} catch (err) {
						enqueueError = toErrorObject(err, "IndexedDB restore enqueue failed");
						tx.abort();
					}
				});
			}
		} finally {
			db.close();
		}
	}
}
function resolveDefaultIdbSnapshotPath() {
	const stateDir = process.env.OPENCLAW_STATE_DIR || path.join(process.env.HOME || "/tmp", ".openclaw");
	return path.join(stateDir, "matrix", "crypto-idb-snapshot.json");
}
async function preflightIndexedDatabases(snapshot, databasePrefix) {
	const names = /* @__PURE__ */ new Set();
	for (const { name } of snapshot) {
		if (names.has(name) || databasePrefix && !name.startsWith(`${databasePrefix}::`)) throw new Error("Malformed IndexedDB snapshot database names");
		names.add(name);
	}
	await restoreIndexedDatabases(snapshot, new IDBFactory());
}
async function readCanonicalSnapshot(snapshotPath, stateRuntime) {
	throwIfLegacySnapshotNeedsDoctor(snapshotPath);
	const snapshotJson = await readMatrixIdbSnapshotJson(path.dirname(snapshotPath), stateRuntime);
	if (snapshotJson === null) return null;
	const snapshot = parseSnapshotPayload(snapshotJson);
	if (!snapshot) throw new Error("Malformed IndexedDB snapshot payload");
	return snapshot;
}
async function restoreIdbFromDisk(snapshotPath, stateRuntime, databasePrefix) {
	const resolvedPath = snapshotPath ?? resolveDefaultIdbSnapshotPath();
	let callbackStarted = false;
	try {
		const snapshotStateRuntime = stateRuntime ?? getMatrixRuntime().state;
		return await withFileLock(resolvedPath, MATRIX_IDB_SNAPSHOT_LOCK_OPTIONS, async () => {
			callbackStarted = true;
			const snapshot = await readCanonicalSnapshot(resolvedPath, snapshotStateRuntime);
			if (snapshot === null) {
				await clearAccountIndexedDatabases(databasePrefix);
				return false;
			}
			await preflightIndexedDatabases(snapshot, databasePrefix);
			await clearAccountIndexedDatabases(databasePrefix);
			await restoreIndexedDatabases(snapshot, indexedDB);
			LogService.info("IdbPersistence", `Restored ${snapshot.length} IndexedDB database(s) from Matrix SQLite state`);
			return true;
		});
	} catch (err) {
		if (err instanceof MatrixIdbSnapshotMigrationRequiredError) throw err;
		if (!callbackStarted && fs.existsSync(resolvedPath)) throwLegacySnapshotMigrationRequired();
		LogService.warn("IdbPersistence", "Failed to restore IndexedDB snapshot from SQLite:", err);
		throw err;
	}
}
async function persistIdbToDisk(params) {
	const snapshotPath = params?.snapshotPath ?? resolveDefaultIdbSnapshotPath();
	let callbackStarted = false;
	try {
		const stateRuntime = params?.stateRuntime ?? getMatrixRuntime().state;
		fs.mkdirSync(path.dirname(snapshotPath), { recursive: true });
		const persistedCount = await withFileLock(snapshotPath, MATRIX_IDB_SNAPSHOT_LOCK_OPTIONS, async () => {
			callbackStarted = true;
			const storageRootDir = path.dirname(snapshotPath);
			await readCanonicalSnapshot(snapshotPath, stateRuntime);
			const snapshot = await dumpIndexedDatabases(params?.databasePrefix);
			if (params?.abortSignal?.aborted || snapshot.length === 0) return 0;
			await writeMatrixIdbSnapshotJson({
				storageRootDir,
				snapshotJson: JSON.stringify(snapshot),
				databaseCount: snapshot.length,
				stateRuntime
			});
			return snapshot.length;
		});
		if (persistedCount === 0) return;
		LogService.debug("IdbPersistence", `Persisted ${persistedCount} IndexedDB database(s) to Matrix SQLite state`);
	} catch (err) {
		if (err instanceof MatrixIdbSnapshotMigrationRequiredError) throw err;
		if (!callbackStarted && fs.existsSync(snapshotPath)) throwLegacySnapshotMigrationRequired();
		LogService.warn("IdbPersistence", "Failed to persist IndexedDB snapshot:", err);
		if (params?.strict) throw err;
	}
}
function throwIfLegacySnapshotNeedsDoctor(snapshotPath) {
	if (fs.existsSync(snapshotPath)) throwLegacySnapshotMigrationRequired();
}
function throwLegacySnapshotMigrationRequired() {
	LogService.warn("IdbPersistence", LEGACY_SNAPSHOT_DIAGNOSTIC);
	throw new MatrixIdbSnapshotMigrationRequiredError();
}
//#endregion
export { persistIdbToDisk, resolveDefaultIdbSnapshotPath, restoreIdbFromDisk, validateMatrixIdbSnapshotJson };
