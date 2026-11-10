import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { o as resolveUserPath } from "./home-dir-CtsdYvX3.mjs";
import { o as racePromiseWithAbortSignal } from "./src-Bzfi3cQM.mjs";
import { c as MEMORY_INDEX_DERIVED_TABLES, u as MEMORY_INDEX_STATE_TABLE } from "./memory-schema-DY2eOY6N.mjs";
import { n as openOpenClawAgentDatabaseReadOnly } from "./openclaw-agent-db-readonly-open-DcexysGa.mjs";
import { n as enqueueKeyedTask } from "./keyed-async-queue-CTreGrmR.mjs";
import { t as loadSqliteVecExtension } from "./sqlite-vec-DjjFDiM4.mjs";
import { n as configureMemorySqliteWalMaintenance, t as closeMemorySqliteWalMaintenance } from "./engine-storage-DAQECy5K.mjs";
import "./memory-core-host-engine-storage-wV2XR0Rc.mjs";
import { d as sdkRunSqliteImmediateTransactionSync, o as sdkOpenNodeSqliteDatabase } from "./sqlite-runtime-COh9hQA9.mjs";
import { i as tableExists, r as readMemoryDatabaseRevision } from "./manager-db-kernel-WGk4tT1_.mjs";
import "./time-runtime-D6GzEQJ4.mjs";
import "./concurrency-runtime-Eh-iOyQU.mjs";
import "./memory-core-host-engine-fs-DP0bFWD3.mjs";
import { et as withMemoryWorkspaceLock } from "./dreaming-dreams-file-BFl4u8HC.mjs";
import fs from "node:fs/promises";
import path from "node:path";
//#region extensions/memory-core/src/memory/manager-index-generation-lease.ts
const states = /* @__PURE__ */ new Map();
function createGenerationLeaseAbortError(signal) {
	return new Error("Memory index generation lease acquisition aborted", { cause: signal?.reason });
}
function throwIfGenerationLeaseAborted(signal) {
	if (signal?.aborted) throw createGenerationLeaseAbortError(signal);
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
	const first = state.queue[0];
	if (!first) {
		if (state.readers === 0) states.delete(key);
		return;
	}
	if (first.kind === "write") {
		if (state.readers > 0) return;
		state.queue.shift();
		state.writer = true;
		first.resolve(() => {
			state.writer = false;
			drain(key, state);
		});
		return;
	}
	const readers = [];
	while (state.queue[0]?.kind === "read") readers.push(state.queue.shift());
	state.readers += readers.length;
	for (const reader of readers) reader.resolve(() => {
		state.readers -= 1;
		drain(key, state);
	});
}
async function acquireLocal(key, kind, signal) {
	throwIfGenerationLeaseAborted(signal);
	const state = stateFor(key);
	return await new Promise((resolve, reject) => {
		const waiter = {
			kind,
			resolve: (release) => {
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
	const release = await acquireLocal(resolveUserPath(databasePath), kind === "write" ? "write" : "read", signal);
	return async () => release();
}
async function acquireMemoryIndexReadGeneration(databasePath, signal) {
	return await acquire(databasePath, "read", signal);
}
async function withMemoryIndexGeneration(databasePath, kind, run) {
	const release = await acquire(databasePath, kind);
	try {
		return await run();
	} finally {
		await release();
	}
}
//#endregion
//#region extensions/memory-core/src/memory/manager-reindex-lock.ts
const builds = /* @__PURE__ */ new Map();
const REINDEX_LOCK_WAIT_TIMEOUT_MS = 2e3;
function createMemoryReindexBusyError(lockPath) {
	return Object.assign(/* @__PURE__ */ new Error(`Memory reindex lock is held at ${lockPath}; another reindex is active.`), { code: "SQLITE_BUSY" });
}
/** Old on-disk coordination files are inert; foreign writers must stop the Gateway. */
async function waitForMemoryReindexLock(dbPath, options = {}) {
	const lockPath = `${dbPath}.reindex-lock.sqlite`;
	const entered = createDeferredCore();
	const released = createDeferredCore();
	const completed = enqueueKeyedTask({
		tails: builds,
		key: resolveUserPath(dbPath),
		task: async () => {
			entered.resolve();
			await released.promise;
		}
	});
	const timeout = options.waitForActive ? void 0 : AbortSignal.timeout(REINDEX_LOCK_WAIT_TIMEOUT_MS);
	try {
		if (timeout) await racePromiseWithAbortSignal(entered.promise, timeout);
		else await entered.promise;
		return { release: async () => {
			released.resolve();
			await completed;
		} };
	} catch (error) {
		released.resolve();
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
const MEMORY_REINDEX_UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
const MEMORY_REINDEX_ORPHAN_MIN_AGE_MS = 864e5;
function resolveMemoryReindexBaseName(databaseBaseName, entryName) {
	const matchedSuffix = MEMORY_DATABASE_FILE_SUFFIXES.find((suffix) => suffix && entryName.endsWith(suffix)) ?? "";
	const baseName = entryName.slice(0, entryName.length - matchedSuffix.length);
	const prefix = `${databaseBaseName}.memory-reindex-`;
	return baseName.startsWith(prefix) && MEMORY_REINDEX_UUID_PATTERN.test(baseName.slice(prefix.length)) ? baseName : void 0;
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
		return await withMemoryWorkspaceLock(params.workspaceDir, async () => withMemoryIndexGeneration(params.dbPath, "write", async () => {
			if (tableExists(db, "main", "memory_index_chunks_vec") && !hasSqliteVecExtension(db)) {
				const loaded = await loadSqliteVecExtension({
					db,
					extensionPath: params.vectorExtensionPath
				});
				if (!loaded.ok) throw new Error(`Memory reset requires sqlite-vec to clear the vector index: ${loaded.error}`);
			}
			return sdkRunSqliteImmediateTransactionSync(db, () => {
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
async function cleanupAgedMemoryReindexTempFiles(dbPath) {
	const nowMs = Date.now();
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
		let stats = [];
		for (const filePath of filePaths) try {
			stats.push(await fs.stat(filePath));
		} catch (err) {
			if (err.code !== "ENOENT") {
				stats = void 0;
				break;
			}
		}
		if (!stats?.length) continue;
		if (nowMs - Math.max(...stats.map((stat) => stat.mtimeMs)) < MEMORY_REINDEX_ORPHAN_MIN_AGE_MS) continue;
		for (const filePath of filePaths) try {
			await fs.rm(filePath, { force: true });
		} catch {}
	}
}
function openMemoryDatabaseAtPath(dbPath, allowExtension, runMaintenance) {
	const db = sdkOpenNodeSqliteDatabase(dbPath, { allowExtension });
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
	const database = sdkOpenNodeSqliteDatabase(":memory:", {
		readOnly: true,
		allowExtension
	});
	return {
		db: database,
		release: () => database.close(),
		hasIndex: false
	};
}
/** Open an existing memory index through the agent database query-only owner. */
function openMemoryDatabaseReadOnlyAtPath(dbPath, allowExtension, agentId) {
	const opened = openOpenClawAgentDatabaseReadOnly({
		agentId,
		path: dbPath
	}, {
		allowExtension,
		lifecycle: "agent"
	});
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
		release: database.close,
		hasIndex: true
	};
}
function closeMemoryDatabase(db) {
	closeMemorySqliteWalMaintenance(db);
	if (db.isOpen) db.close();
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
export { openMemoryDatabaseAtPath as a, resetMemoryDatabase as c, withMemoryIndexGeneration as d, closeMemoryDatabase as i, waitForMemoryReindexLock as l, logMemoryVectorDegradedWrite as n, openMemoryDatabaseReadOnlyAtPath as o, cleanupAgedMemoryReindexTempFiles as r, removeMemoryDatabaseFiles as s, formatMemoryVectorDegradedWriteReason as t, acquireMemoryIndexReadGeneration as u };
