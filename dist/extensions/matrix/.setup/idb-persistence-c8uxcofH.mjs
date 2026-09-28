import { t as getMatrixRuntime } from "./runtime-1kn1P6io.mjs";
import { C as writeMatrixIdbSnapshotJson, o as MATRIX_IDB_SNAPSHOT_FILENAME, y as readMatrixIdbSnapshotJson } from "./storage-metadata-fHN6Df2m.mjs";
import { n as LogService } from "./logger-xBjiRIp1.mjs";
import { n as MATRIX_IDB_SNAPSHOT_LOCK_OPTIONS } from "./idb-persistence-lock-B3fZXyF_.mjs";
import path from "node:path";
import { toErrorObject } from "openclaw/plugin-sdk/error-runtime";
import fs from "node:fs";
import { withFileLock } from "openclaw/plugin-sdk/file-lock";
import { indexedDB } from "fake-indexeddb";
//#region extensions/matrix/src/matrix/sdk/idb-persistence.ts
const LEGACY_SNAPSHOT_DIAGNOSTIC = {
	code: "matrix-idb-snapshot-requires-doctor",
	message: "Matrix IndexedDB snapshot exists outside canonical SQLite state",
	remediation: "openclaw doctor --fix"
};
var MatrixIdbSnapshotMigrationRequiredError = class extends Error {
	constructor() {
		super(`${LEGACY_SNAPSHOT_DIAGNOSTIC.message}; run ${LEGACY_SNAPSHOT_DIAGNOSTIC.remediation}`);
		this.code = LEGACY_SNAPSHOT_DIAGNOSTIC.code;
		this.remediation = LEGACY_SNAPSHOT_DIAGNOSTIC.remediation;
		this.name = "MatrixIdbSnapshotMigrationRequiredError";
	}
};
function isValidIdbIndexSnapshot(value) {
	if (!value || typeof value !== "object") return false;
	const candidate = value;
	return typeof candidate.name === "string" && (typeof candidate.keyPath === "string" || Array.isArray(candidate.keyPath) && candidate.keyPath.every((entry) => typeof entry === "string")) && typeof candidate.multiEntry === "boolean" && typeof candidate.unique === "boolean";
}
function isValidIdbRecordSnapshot(value) {
	if (!value || typeof value !== "object") return false;
	return "key" in value && "value" in value;
}
function isValidIdbStoreSnapshot(value) {
	if (!value || typeof value !== "object") return false;
	const candidate = value;
	const validKeyPath = candidate.keyPath === null || typeof candidate.keyPath === "string" || Array.isArray(candidate.keyPath) && candidate.keyPath.every((entry) => typeof entry === "string");
	return typeof candidate.name === "string" && validKeyPath && typeof candidate.autoIncrement === "boolean" && Array.isArray(candidate.indexes) && candidate.indexes.every((entry) => isValidIdbIndexSnapshot(entry)) && Array.isArray(candidate.records) && candidate.records.every((entry) => isValidIdbRecordSnapshot(entry));
}
function isValidIdbDatabaseSnapshot(value) {
	if (!value || typeof value !== "object") return false;
	const candidate = value;
	return typeof candidate.name === "string" && typeof candidate.version === "number" && Number.isFinite(candidate.version) && candidate.version > 0 && Array.isArray(candidate.stores) && candidate.stores.every((entry) => isValidIdbStoreSnapshot(entry));
}
function parseSnapshotPayload(data) {
	const parsed = JSON.parse(data);
	if (!Array.isArray(parsed) || parsed.length === 0) return null;
	if (!parsed.every((entry) => isValidIdbDatabaseSnapshot(entry))) throw new Error("Malformed IndexedDB snapshot payload");
	return parsed;
}
function isValidMatrixIdbSnapshotJson(data) {
	try {
		return parseSnapshotPayload(data) !== null;
	} catch {
		return false;
	}
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
		const db = await new Promise((resolve, reject) => {
			const r = idb.open(name, version);
			r.addEventListener("success", () => resolve(r.result), { once: true });
			r.addEventListener("error", () => reject(toErrorObject(r.error, "Non-Error rejection")), { once: true });
		});
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
async function restoreIndexedDatabases(snapshot) {
	const idb = indexedDB;
	for (const dbSnap of snapshot) await new Promise((resolve, reject) => {
		const r = idb.open(dbSnap.name, dbSnap.version);
		r.addEventListener("upgradeneeded", () => {
			const db = r.result;
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
		r.addEventListener("success", () => {
			(async () => {
				const db = r.result;
				for (const storeSnap of dbSnap.stores) {
					if (storeSnap.records.length === 0) continue;
					const tx = db.transaction(storeSnap.name, "readwrite");
					const store = tx.objectStore(storeSnap.name);
					for (const rec of storeSnap.records) if (storeSnap.keyPath !== null) store.put(rec.value);
					else store.put(rec.value, rec.key);
					await new Promise((res) => {
						tx.addEventListener("complete", () => res(), { once: true });
					});
				}
				db.close();
				resolve();
			})().catch(reject);
		}, { once: true });
		r.addEventListener("error", () => reject(toErrorObject(r.error, "Non-Error rejection")), { once: true });
	});
}
function resolveDefaultIdbSnapshotPath() {
	const stateDir = process.env.OPENCLAW_STATE_DIR || path.join(process.env.HOME || "/tmp", ".openclaw");
	return path.join(stateDir, "matrix", "crypto-idb-snapshot.json");
}
async function restoreIdbFromDisk(snapshotPath, stateRuntime) {
	const resolvedPath = snapshotPath ?? resolveDefaultIdbSnapshotPath();
	const storageRootDir = path.dirname(resolvedPath);
	let callbackStarted = false;
	try {
		const snapshotStateRuntime = stateRuntime ?? getMatrixRuntime().state;
		return await withFileLock(resolvedPath, MATRIX_IDB_SNAPSHOT_LOCK_OPTIONS, async () => {
			callbackStarted = true;
			let storedSnapshotJson;
			try {
				storedSnapshotJson = await readMatrixIdbSnapshotJson(storageRootDir, snapshotStateRuntime);
			} catch (err) {
				if (fs.existsSync(resolvedPath)) throwLegacySnapshotMigrationRequired();
				throw err;
			}
			throwIfLegacySnapshotNeedsDoctor(resolvedPath, storedSnapshotJson);
			if (!storedSnapshotJson) return false;
			const snapshot = parseSnapshotPayload(storedSnapshotJson);
			if (!snapshot) return false;
			await restoreIndexedDatabases(snapshot);
			LogService.info("IdbPersistence", `Restored ${snapshot.length} IndexedDB database(s) from Matrix SQLite state`);
			return true;
		});
	} catch (err) {
		if (err instanceof MatrixIdbSnapshotMigrationRequiredError) throw err;
		if (!callbackStarted && fs.existsSync(resolvedPath)) throwLegacySnapshotMigrationRequired();
		LogService.warn("IdbPersistence", "Failed to restore IndexedDB snapshot from SQLite:", err);
		return false;
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
			let storedSnapshotJson;
			try {
				storedSnapshotJson = await readMatrixIdbSnapshotJson(storageRootDir, stateRuntime);
			} catch (err) {
				if (fs.existsSync(snapshotPath)) throwLegacySnapshotMigrationRequired();
				throw err;
			}
			throwIfLegacySnapshotNeedsDoctor(snapshotPath, storedSnapshotJson);
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
function readLegacyMatrixIdbSnapshotStateUnlocked(storageRootDir) {
	const snapshotPath = path.join(storageRootDir, MATRIX_IDB_SNAPSHOT_FILENAME);
	if (!fs.existsSync(snapshotPath)) return null;
	const data = fs.readFileSync(snapshotPath, "utf8");
	try {
		return parseSnapshotPayload(data);
	} catch {
		return null;
	}
}
function throwIfLegacySnapshotNeedsDoctor(snapshotPath, storedSnapshotJson) {
	if (fs.existsSync(snapshotPath) && (!storedSnapshotJson || !isValidMatrixIdbSnapshotJson(storedSnapshotJson))) throwLegacySnapshotMigrationRequired();
}
function throwLegacySnapshotMigrationRequired() {
	LogService.warn("IdbPersistence", LEGACY_SNAPSHOT_DIAGNOSTIC);
	throw new MatrixIdbSnapshotMigrationRequiredError();
}
//#endregion
export { restoreIdbFromDisk as i, persistIdbToDisk as n, readLegacyMatrixIdbSnapshotStateUnlocked as r, isValidMatrixIdbSnapshotJson as t };
