import { i as extractErrorCode, u as toErrorObject } from "./error-coercion-C787aVxk.mjs";
import { o as resolveUserPath } from "./home-dir-BKwhAL2c.mjs";
import { s as sleepWithAbort } from "./src-D4OikzaT.mjs";
import { b as isCronRunSessionKey } from "./session-key-CBvmC8zz.mjs";
import { t as openNodeSqliteDatabase } from "./node-sqlite-BO6jRFcG.mjs";
import { o as runSqliteImmediateTransactionSync } from "./sqlite-transaction-DKSXLQhb.mjs";
import { l as MEMORY_INDEX_STATE_TABLE, s as MEMORY_INDEX_DERIVED_TABLES, t as ensureMemoryIndexSchema } from "./memory-schema-CkxujvZk.mjs";
import { n as openOpenClawAgentDatabaseReadOnly } from "./openclaw-agent-db-readonly-open-_lavN1YB.mjs";
import { t as loadSqliteVecExtension } from "./sqlite-vec-BskpG3v_.mjs";
import "./error-runtime-Bf1fYXFh.mjs";
import { n as configureMemorySqliteWalMaintenance, t as closeMemorySqliteWalMaintenance } from "./engine-storage-8YoODh2M.mjs";
import "./memory-core-host-engine-storage-BwYLAX9e.mjs";
import "./sqlite-runtime-DhVTOiCi.mjs";
import { i as tableExists, r as readMemoryDatabaseRevision } from "./manager-db-kernel-Dc2ThViV.mjs";
import "./runtime-env-BaPIl5PP.mjs";
import "./memory-core-host-engine-fs-BixOt6Kf.mjs";
import { i as isDreamingNarrativeSessionStoreKey } from "./openclaw-runtime-session-12_u1-ft.mjs";
import "./memory-core-host-engine-sessions-Dsaoiw9O.mjs";
import { g as withMemoryWorkspaceLock } from "./dreaming-dreams-file-BZjYHlPi.mjs";
import path from "node:path";
import fs from "node:fs/promises";
//#region extensions/memory-core/src/memory/manager-sqlite-lease.ts
const MEMORY_SQLITE_LEASE_RETRY_DELAY_MS = 25;
function isSqliteBusyError(err) {
	const code = extractErrorCode(err);
	if (code === "SQLITE_BUSY" || code === "SQLITE_LOCKED") return true;
	const message = err instanceof Error ? err.message : String(err);
	return /SQLITE_(?:BUSY|LOCKED)|database is locked/iu.test(message);
}
function openMemoryLeaseDatabase(location) {
	const database = openNodeSqliteDatabase(location);
	try {
		database.exec("PRAGMA busy_timeout = 0");
		return database;
	} catch (err) {
		database.close();
		throw err;
	}
}
function createMemorySqliteLeaseHandle(database, transactionActive) {
	return { release: async () => {
		let releaseError;
		if (transactionActive) try {
			database.exec("ROLLBACK");
		} catch (err) {
			releaseError = err;
		}
		try {
			database.close();
		} catch (err) {
			releaseError ??= err;
		}
		if (releaseError) throw toErrorObject(releaseError, "Failed to release memory SQLite lease");
	} };
}
async function tryAcquireMemorySqliteLease(location, mode) {
	const database = openMemoryLeaseDatabase(location);
	try {
		if (mode === "exclusive") database.exec("BEGIN EXCLUSIVE");
		else {
			database.exec("BEGIN");
			database.prepare("SELECT name FROM sqlite_schema LIMIT 1").get();
		}
	} catch (err) {
		database.close();
		if (isSqliteBusyError(err)) return;
		throw err;
	}
	return createMemorySqliteLeaseHandle(database, true);
}
/** Acquire writer admission without dropping PENDING intent after the first reader collision. */
async function acquireMemorySqliteWriterLease(location, signal) {
	while (true) {
		signal?.throwIfAborted();
		const database = openMemoryLeaseDatabase(location);
		try {
			database.exec("PRAGMA locking_mode = EXCLUSIVE");
			database.exec("BEGIN IMMEDIATE");
			database.exec("PRAGMA user_version = 0");
		} catch (err) {
			database.close();
			if (!isSqliteBusyError(err)) throw err;
			await sleepWithAbort(MEMORY_SQLITE_LEASE_RETRY_DELAY_MS, signal);
			continue;
		}
		while (true) try {
			database.exec("COMMIT");
			return createMemorySqliteLeaseHandle(database, false);
		} catch (err) {
			if (!isSqliteBusyError(err)) {
				await createMemorySqliteLeaseHandle(database, true).release();
				throw err;
			}
			try {
				await sleepWithAbort(MEMORY_SQLITE_LEASE_RETRY_DELAY_MS, signal);
			} catch (sleepError) {
				await createMemorySqliteLeaseHandle(database, true).release();
				throw sleepError;
			}
		}
	}
}
//#endregion
//#region extensions/memory-core/src/memory/manager-index-generation-lease.ts
const states = /* @__PURE__ */ new Map();
const CROSS_PROCESS_RETRY_DELAY_MS = 25;
function createGenerationLeaseAbortError(signal) {
	return new Error("Memory index generation lease acquisition aborted", { cause: signal?.reason });
}
function throwIfGenerationLeaseAborted(signal) {
	if (signal?.aborted) throw createGenerationLeaseAbortError(signal);
}
async function acquireCrossProcessLease(databasePath, kind, signal) {
	const acquireSqliteLease = async (location, mode) => {
		while (true) {
			throwIfGenerationLeaseAborted(signal);
			const lease = await tryAcquireMemorySqliteLease(location, mode);
			if (lease) {
				if (signal?.aborted) {
					await lease.release();
					throw createGenerationLeaseAbortError(signal);
				}
				return lease;
			}
			try {
				await sleepWithAbort(CROSS_PROCESS_RETRY_DELAY_MS, signal);
			} catch (err) {
				throw signal?.aborted ? createGenerationLeaseAbortError(signal) : err;
			}
		}
	};
	const admissionLocation = `${databasePath}.generation-writer.sqlite`;
	let admission;
	try {
		admission = kind === "read" ? await acquireSqliteLease(admissionLocation, "shared") : await acquireMemorySqliteWriterLease(admissionLocation, signal);
	} catch (err) {
		throw signal?.aborted ? createGenerationLeaseAbortError(signal) : err;
	}
	let generation;
	try {
		generation = await acquireSqliteLease(`${databasePath}.generation-lock.sqlite`, kind === "read" ? "shared" : "exclusive");
	} catch (err) {
		await admission.release();
		throw err;
	}
	if (kind === "read") {
		try {
			await admission.release();
		} catch (err) {
			await generation.release();
			throw err;
		}
		if (signal?.aborted) {
			await generation.release();
			throw createGenerationLeaseAbortError(signal);
		}
		return generation;
	}
	return { release: async () => {
		try {
			await generation.release();
		} finally {
			await admission.release();
		}
	} };
}
function stateFor(key) {
	const existing = states.get(key);
	if (existing) return existing;
	const created = {
		readers: 0,
		writer: false,
		queue: []
	};
	states.set(key, created);
	return created;
}
function drain(key, state) {
	if (state.writer) return;
	if (state.readers > 0) {
		while (state.queue[0]?.kind === "read") {
			const reader = state.queue.shift();
			state.readers += 1;
			reader.resolve(() => {
				state.readers -= 1;
				drain(key, state);
			});
		}
		return;
	}
	const first = state.queue.shift();
	if (!first) {
		states.delete(key);
		return;
	}
	if (first.kind === "write") {
		state.writer = true;
		first.resolve(() => {
			state.writer = false;
			drain(key, state);
		});
		return;
	}
	const readers = [first];
	while (state.queue[0]?.kind === "read") readers.push(state.queue.shift());
	state.readers = readers.length;
	for (const reader of readers) reader.resolve(() => {
		state.readers -= 1;
		drain(key, state);
	});
}
async function acquireLocal(key, kind, signal) {
	throwIfGenerationLeaseAborted(signal);
	const state = stateFor(key);
	return await new Promise((resolve, reject) => {
		let admitted = false;
		const waiter = {
			kind,
			resolve: (release) => {
				admitted = true;
				signal?.removeEventListener("abort", onAbort);
				if (signal?.aborted) {
					release();
					reject(createGenerationLeaseAbortError(signal));
					return;
				}
				resolve(release);
			}
		};
		const onAbort = () => {
			if (admitted) return;
			const index = state.queue.indexOf(waiter);
			if (index < 0) return;
			state.queue.splice(index, 1);
			signal?.removeEventListener("abort", onAbort);
			drain(key, state);
			reject(createGenerationLeaseAbortError(signal));
		};
		signal?.addEventListener("abort", onAbort, { once: true });
		state.queue.push(waiter);
		if (signal?.aborted) {
			onAbort();
			return;
		}
		drain(key, state);
	});
}
async function acquire(databasePath, kind, signal) {
	const key = resolveUserPath(databasePath);
	const releaseLocal = await acquireLocal(key, kind, signal);
	let crossProcess;
	try {
		throwIfGenerationLeaseAborted(signal);
		crossProcess = await acquireCrossProcessLease(key, kind, signal);
		if (signal?.aborted) {
			await crossProcess.release();
			throw createGenerationLeaseAbortError(signal);
		}
	} catch (err) {
		releaseLocal();
		throw err;
	}
	return async () => {
		try {
			await crossProcess.release();
		} finally {
			releaseLocal();
		}
	};
}
async function withLease(key, kind, run) {
	const release = await acquire(key, kind);
	try {
		return await run();
	} finally {
		await release();
	}
}
async function acquireMemoryIndexReadGeneration(databasePath, signal) {
	return await acquire(databasePath, "read", signal);
}
async function withMemoryIndexPublishGeneration(databasePath, run) {
	return await withLease(databasePath, "write", run);
}
//#endregion
//#region extensions/memory-core/src/memory/manager-reindex-lock.ts
const REINDEX_LOCK_WAIT_TIMEOUT_MS = 2e3;
function createMemoryReindexBusyError(lockPath) {
	return Object.assign(/* @__PURE__ */ new Error(`Memory reindex lock is held at ${lockPath}; another reindex is active.`), { code: "SQLITE_BUSY" });
}
/** Wait asynchronously for the exclusive build lock without blocking the Node event loop. */
async function waitForMemoryReindexLock(dbPath, options = {}) {
	const lockPath = `${dbPath}.reindex-lock.sqlite`;
	const timeout = options.waitForActive ? void 0 : AbortSignal.timeout(REINDEX_LOCK_WAIT_TIMEOUT_MS);
	try {
		return await acquireMemorySqliteWriterLease(lockPath, timeout);
	} catch (error) {
		if (timeout?.aborted) throw createMemoryReindexBusyError(lockPath);
		throw error;
	}
}
//#endregion
//#region extensions/memory-core/src/memory/manager-db.ts
const MEMORY_DATABASE_FILE_SUFFIXES = [
	"",
	"-wal",
	"-shm",
	"-journal"
];
const MEMORY_REINDEX_ENTRY_SUFFIXES = [
	"-wal",
	"-shm",
	"-journal",
	""
];
const MEMORY_REINDEX_UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
const MEMORY_REINDEX_ORPHAN_MIN_AGE_MS = 864e5;
function resolveMemoryReindexBaseName(databaseBaseName, entryName) {
	for (const suffix of MEMORY_REINDEX_ENTRY_SUFFIXES) {
		if (!entryName.endsWith(suffix)) continue;
		const baseName = entryName.slice(0, entryName.length - suffix.length);
		const prefix = `${databaseBaseName}.memory-reindex-`;
		if (baseName.startsWith(prefix) && MEMORY_REINDEX_UUID_PATTERN.test(baseName.slice(prefix.length))) return baseName;
	}
}
async function isRegularFile(filePath) {
	try {
		return (await fs.stat(filePath)).isFile();
	} catch {
		return false;
	}
}
function hasSqliteVecExtension(db) {
	try {
		const row = db.prepare("SELECT vec_version() AS version").get();
		return typeof row?.version === "string" && row.version.trim().length > 0;
	} catch {
		return false;
	}
}
/** Reset derived content without replacing the shared agent database or its schema. */
async function resetMemoryDatabase(params) {
	const db = params.targetDb;
	const lock = await waitForMemoryReindexLock(params.dbPath);
	try {
		return await withMemoryWorkspaceLock(params.workspaceDir, async () => withMemoryIndexPublishGeneration(params.dbPath, async () => {
			if (tableExists(db, "main", "memory_index_chunks_vec") && !hasSqliteVecExtension(db)) {
				const loaded = await loadSqliteVecExtension({
					db,
					extensionPath: params.vectorExtensionPath
				});
				if (!loaded.ok) throw new Error(`Memory reset requires sqlite-vec to clear the vector index: ${loaded.error}`);
			}
			return runSqliteImmediateTransactionSync(db, () => {
				const tables = MEMORY_INDEX_DERIVED_TABLES.filter((table) => tableExists(db, "main", table));
				if (!tables.some((table) => table !== "memory_index_state" && db.prepare(`SELECT 1 FROM ${table} LIMIT 1`).get())) return false;
				const revision = readMemoryDatabaseRevision(db);
				const schema = tables.flatMap((table) => db.prepare("SELECT type, name, sql FROM main.sqlite_schema WHERE tbl_name = ? AND sql IS NOT NULL ORDER BY name").all(table));
				for (const entry of schema.filter((candidate) => candidate.type === "trigger")) db.exec(`DROP TRIGGER "${entry.name.replaceAll("\"", "\"\"")}"`);
				for (const table of tables) db.exec(`DROP TABLE main.${table}`);
				for (const type of [
					"table",
					"index",
					"trigger"
				]) for (const entry of schema.filter((candidate) => candidate.type === type)) db.exec(entry.sql);
				db.prepare(`INSERT INTO ${MEMORY_INDEX_STATE_TABLE} (id, revision) VALUES (?, ?)`).run(1, revision + 1);
				return true;
			});
		}));
	} finally {
		await lock.release();
	}
}
/** Remove one closed shadow memory database and its journal-mode sidecars. */
async function removeMemoryDatabaseFiles(dbPath) {
	for (const suffix of MEMORY_DATABASE_FILE_SUFFIXES) await fs.rm(`${dbPath}${suffix}`, { force: true });
}
/** Remove crash-left shadows while the caller owns the reindex lease. */
async function cleanupAgedMemoryReindexTempFiles(dbPath, nowMs = Date.now()) {
	if (!await isRegularFile(dbPath)) return;
	const dir = path.dirname(dbPath);
	const databaseBaseName = path.basename(dbPath);
	const shadowBaseNames = /* @__PURE__ */ new Set();
	let entries;
	try {
		entries = await fs.readdir(dir, { withFileTypes: true });
	} catch {
		return;
	}
	for (const entry of entries) {
		if (!entry.isFile()) continue;
		const shadowBaseName = resolveMemoryReindexBaseName(databaseBaseName, entry.name);
		if (shadowBaseName) shadowBaseNames.add(shadowBaseName);
	}
	for (const shadowBaseName of shadowBaseNames) {
		const filePaths = MEMORY_DATABASE_FILE_SUFFIXES.map((suffix) => path.join(dir, `${shadowBaseName}${suffix}`));
		const stats = [];
		let hasUnknownFileState = false;
		for (const filePath of filePaths) try {
			stats.push(await fs.stat(filePath));
		} catch (err) {
			if (err.code !== "ENOENT") {
				hasUnknownFileState = true;
				break;
			}
		}
		if (hasUnknownFileState || stats.length === 0) continue;
		if (nowMs - Math.max(...stats.map((stat) => stat.mtimeMs)) < MEMORY_REINDEX_ORPHAN_MIN_AGE_MS) continue;
		for (const filePath of filePaths) try {
			await fs.rm(filePath, { force: true });
		} catch {}
	}
}
function openMemoryDatabaseAtPath(dbPath, allowExtension, runMaintenance) {
	const db = openNodeSqliteDatabase(dbPath, { allowExtension });
	try {
		configureMemorySqliteWalMaintenance(db, {
			busyTimeoutMs: 5e3,
			databasePath: dbPath,
			...runMaintenance ? { runMaintenance } : {}
		});
		return db;
	} catch (err) {
		try {
			closeMemorySqliteWalMaintenance(db);
			db.close();
		} catch {}
		throw err;
	}
}
function openUninitializedMemoryDatabase(allowExtension) {
	const database = openNodeSqliteDatabase(":memory:", { allowExtension });
	try {
		ensureMemoryIndexSchema({
			cacheEnabled: true,
			db: database,
			ftsEnabled: true
		});
		database.exec("PRAGMA query_only = ON");
		return {
			db: database,
			release: () => database.close()
		};
	} catch (error) {
		database.close();
		throw error;
	}
}
/** Open an existing memory index through the agent database query-only owner. */
function openMemoryDatabaseReadOnlyAtPath(dbPath, allowExtension, agentId) {
	const opened = openOpenClawAgentDatabaseReadOnly({
		agentId,
		path: dbPath
	}, { allowExtension });
	if (!opened.found) {
		if (opened.reason === "database-missing") return openUninitializedMemoryDatabase(allowExtension);
		throw new Error(`Memory index database schema is missing: ${dbPath}`);
	}
	const { database } = opened;
	if (!tableExists(database.db, "main", "memory_index_state")) {
		database.close();
		return openUninitializedMemoryDatabase(allowExtension);
	}
	return {
		db: database.db,
		release: database.close
	};
}
function closeMemoryDatabase(db) {
	closeMemorySqliteWalMaintenance(db);
	if (db.isOpen) db.close();
}
//#endregion
//#region extensions/memory-core/src/memory/manager-session-sync-state.ts
function isMemorySessionIndexable(entry, archivedSessionKey) {
	return !(entry.generatedByDreamingNarrative || entry.generatedByCronRun || entry.sessionKind === "cron" || entry.sessionKind === "heartbeat" || archivedSessionKey !== void 0 && (isDreamingNarrativeSessionStoreKey(archivedSessionKey) || isCronRunSessionKey(archivedSessionKey) || archivedSessionKey.endsWith(":heartbeat")) || entry.lineProvenance !== void 0 && entry.lineProvenance.length > 0 && entry.lineProvenance.every((line) => line.originClass === "system"));
}
function resolveMemorySessionStartupState(params) {
	const existingRows = params.existingRows ?? [];
	const indexedRows = new Map(existingRows.map((row) => [row.path, row]));
	const activePaths = new Set(params.files.map((file) => file.path));
	const dirtyFiles = [];
	for (const file of params.files) {
		const existing = indexedRows.get(file.path);
		if (!existing || existing.hash === "") {
			dirtyFiles.push(file.absPath);
			continue;
		}
		const indexedMtimeMs = Number(existing.mtime);
		const indexedSize = Number(existing.size);
		if (!Number.isFinite(indexedMtimeMs) || !Number.isFinite(indexedSize)) {
			dirtyFiles.push(file.absPath);
			continue;
		}
		if (file.size !== indexedSize || file.mtimeMs !== indexedMtimeMs || file.revisionMs !== void 0 && !existing.hash.startsWith(`sqlite:${file.revisionMs}:`)) dirtyFiles.push(file.absPath);
	}
	return {
		dirtyFiles,
		hasStaleIndexedPaths: existingRows.some((row) => !activePaths.has(row.path))
	};
}
function resolveMemorySessionSyncPlan(params) {
	const activePaths = params.targetSessionFiles ? null : new Set(params.files.map((file) => params.sessionPathForFile(file)));
	const existingRows = activePaths === null ? null : params.existingRows ?? [];
	return {
		activePaths,
		existingRows,
		existingHashes: existingRows ? new Map(existingRows.map((row) => [row.path, row.hash])) : null,
		indexAll: params.needsFullReindex || Boolean(params.targetSessionFiles)
	};
}
//#endregion
//#region extensions/memory-core/src/memory/manager-vector-warning.ts
function formatMemoryVectorDegradedWriteReason(loadError) {
	return loadError ? `sqlite-vec unavailable: ${loadError}` : "semantic vector embeddings unavailable — no vector dimensions resolved";
}
function logMemoryVectorDegradedWrite(params) {
	if (!params.vectorEnabled || params.vectorReady || params.chunkCount <= 0 || params.warningShown) return params.warningShown;
	params.warn(`memory_index_chunks_vec not updated — ${formatMemoryVectorDegradedWriteReason(params.loadError)}. Vector recall degraded. Further duplicate warnings suppressed.`);
	return true;
}
//#endregion
export { resolveMemorySessionSyncPlan as a, openMemoryDatabaseAtPath as c, resetMemoryDatabase as d, waitForMemoryReindexLock as f, resolveMemorySessionStartupState as i, openMemoryDatabaseReadOnlyAtPath as l, withMemoryIndexPublishGeneration as m, logMemoryVectorDegradedWrite as n, cleanupAgedMemoryReindexTempFiles as o, acquireMemoryIndexReadGeneration as p, isMemorySessionIndexable as r, closeMemoryDatabase as s, formatMemoryVectorDegradedWriteReason as t, removeMemoryDatabaseFiles as u };
