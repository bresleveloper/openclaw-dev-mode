import { s as resolveGlobalSingleton, u as collectNestedErrorCandidates } from "./openclaw-state-read-listeners-C6ALBiqg.mjs";
import { L as resolveOpenClawStateSqlitePath, M as resolveDatabasePath } from "./openclaw-state-read-worker-cpu-DxXDPrAN.mjs";
import { A as revokeSqliteDatabaseAdmissionsForPath, B as stageSqliteTransactionState, Dt as assertExistingDatabaseIdentity, Ft as resolveDatabasePathKey, G as SqliteCoordinatorError, P as deferSqlitePostCommitPublication, Pt as readDatabasePathIdentitySync, X as OPENCLAW_AGENT_SCHEMA_SQL, Y as OPENCLAW_STATE_SCHEMA_SQL, Z as VERSION, _ as prepareSqliteDatabaseCleanClose, c as getSqliteDatabaseAdmission, lt as STARTUP_ADDITIVE_AGENT_COLUMN_DEFINITIONS, mt as extractSqliteTableSchema, ot as CANONICAL_READY_COLUMN_DEFINITION, q as runWithSqliteCleanup, st as FIRST_USE_ADDITIVE_AGENT_COLUMN_DEFINITIONS, ut as hasPendingAgentStartupColumns, v as publishSqliteDatabaseAdmission, vt as normalizeSchemaSql, w as recordSqliteDatabaseIntegrity, x as readSqliteDatabaseIntegrityVerification } from "./openclaw-state-read-sqlite-database-admission-BXby_hL9.mjs";
import { t as assertNoActiveSqliteReaders } from "./openclaw-state-read-sqlite-reader-lifecycle-CGTFS3iz.mjs";
import { a as isRecord, r as asOptionalRecord } from "./openclaw-state-read-record-coerce-DWp7lFsP.mjs";
import { r as getChildLogger, t as createSubsystemLogger } from "./openclaw-state-read-subsystem-S9LTuPwa.mjs";
import { E as normalizeLowercaseStringOrEmpty, O as normalizeOptionalLowercaseString, k as normalizeOptionalString } from "./openclaw-state-read-types.secrets-Wz8lmfvB.mjs";
import { $ as AgentDatabaseSchemaAdmissionChangedError, B as drainAgentDatabaseResources, C as readSqliteUserVersion, M as runSqliteReadOnlyWorkerSync, V as matchesAgentDatabaseClose, W as revokeAgentDatabaseResources, Z as releaseAgentDeletionDatabaseCleanup, a as SessionMetadataUnavailableError, b as createNewerSqliteSchemaVersionError, et as AgentDatabaseSchemaAdmissionInvalidError, gt as resolveOpenClawAgentSqlitePath, l as OpenClawAgentDatabaseMediaMigrationRequiredError, ot as releaseAgentCreationClaimHandle } from "./openclaw-state-read-sqlite-snapshot-staging-owner-DeVv_bRV.mjs";
import { n as safeParseJsonRecord } from "./openclaw-state-read-json-coercion-CYFfIS_L.mjs";
import { i as runQueuedStoreWrite, p as withSqliteWorkerReservationObservation, r as agentDatabaseWriteAdmissionState } from "./openclaw-state-read-worker-task-pool-CsV_Xz7_.mjs";
import { a as isPathInside } from "./openclaw-state-read-path-DKRN8JwZ.mjs";
import { i as racePromiseWithAbortSignal } from "./openclaw-state-read-runtime-process-manifest-DvMn2cl1.mjs";
import { I as ensureOpenClawQuarantineStore, K as resolveUpdateRehearsalRoot, O as assertSupportedStateSchemaVersion, St as assertOpenClawStateSchemaRepairAllowed, T as SQLITE_IDLE_HANDLE_TTL_MS, Y as resolveSqliteDatabaseFilePaths, at as registerSqliteCacheExitClose, dt as SqliteRepairableForeignKeyError, et as publishAgentSchemaMetadata, ft as assertSqliteIntegrity, g as assertStateDatabaseIntegrityOnce, j as createStateSchemaAdmission, lt as truncateSqliteWal, pt as isTerminalSqliteIntegrityError, s as openClawStateDatabaseCache, tt as readExistingAgentSchemaMeta, ut as createSqliteTerminalOpenLatch, wt as isExistingOpenClawStateSchema, z as openSqliteReadOnlyDatabase } from "./openclaw-state-read-openclaw-state-db-cache-CpHXuPkl.mjs";
import "./openclaw-state-read-errors-BV4NDRNo.mjs";
import { t as isPromiseLike } from "./openclaw-state-read-promise-like-D7-l5Fsp.mjs";
import { S as disposeNodeSqliteDependents, T as registerNodeSqliteDisposeCallback, a as getNodeSqliteKysely, i as executeSqliteQueryTakeFirstSync, r as executeSqliteQuerySync, x as clearNodeSqliteKyselyCacheForDatabase } from "./openclaw-state-read-kysely-sync-DrKJlREt.mjs";
import { S as getOpenClawDatabaseMaintenanceScope, T as observeOpenClawDatabaseMaintenanceResource, h as OPENCLAW_SQLITE_BUSY_TIMEOUT_MS, n as assertStateDatabaseAccessAllowed } from "./openclaw-state-read-gateway-state-owner-Bj-SghTS.mjs";
import { t as runInDetachedAsyncContext } from "./openclaw-state-read-detached-async-context-BrFwufJ7.mjs";
import { C as captureSqliteSchemaFacts, _ as invalidateSqliteSchemaFacts, b as registerSqliteSchemaMutationListener, d as admitSqliteSchema, f as adoptSqliteSchemaFacts, l as sqlitePrimaryResultCode, m as getAdmittedSqliteSchemaFacts, n as isSqliteCorruptionError, p as canReuseSqliteSchemaInTransaction, r as isSqliteLockError, s as sqliteErrorCode, t as formatSqliteReadOnlyInspectionFailure, x as runSqliteReadOperationSync } from "./openclaw-state-read-sqlite-error-diagnostics-B72btzpi.mjs";
import { a as isPidDefinitelyDead, t as getFileLockProcessStartTime } from "./openclaw-state-read-pid-alive-BppTQRNj.mjs";
import { a as tableExists$2, c as SqliteSchemaMismatchError, d as throwSqliteSchemaMismatches, n as ensureColumn, o as tableHasColumn, u as legacySqliteSchemaIssueMessages } from "./openclaw-state-read-openclaw-state-db-schema-helpers-Cgf5rJqc.mjs";
import { i as setSqliteBusyTimeout } from "./openclaw-state-read-sqlite-busy-timeout-BW3lmGFD.mjs";
import { n as normalizeAgentId } from "./openclaw-state-read-agent-id-BoCs9aqI.mjs";
import { i as runSqliteImmediateTransactionSync, t as assertTransactionUsable } from "./openclaw-state-read-sqlite-transaction-gPY-7Ojc.mjs";
import { n as closeTrackedStateDatabase, o as _usingCtx, r as openTrackedStateDatabase } from "./openclaw-state-read-openclaw-state-db-handle-BSLzO3AU.mjs";
import { L as assertOpenClawStateWriteAllowed, V as withStateDatabaseSchemaMaintenance, _t as createSqliteTableContractReader, a as assertExistingOpenClawStateRuntimeSchema, bt as readSqliteSchemaCookie, gt as collectSqliteSchemaIssues, mt as assertSqliteSchemaTablesPresent, pt as assertSqliteSchemaContains, vt as getCanonicalSqliteNamedIndexContracts, w as assertOpenClawStateDatabaseOwner, yt as getCanonicalSqliteTableNames } from "./openclaw-state-read.worker.js";
import { B as formatCliCommand, F as tryResolveLegacyCompatibilityAgentId, L as listAgentIds, P as tryResolveAmbientOwnerAgentId, T as runManagedStateTransaction, _ as createSqliteSchemaEnsurer, i as recoverOrphanTaskDeliveryRows, n as openOpenClawStateDatabase, p as ensureAgentDatabaseLeaseSchema, r as runOpenClawStateWriteTransaction, s as repairCanonicalSqliteIndexes } from "./openclaw-state-read-openclaw-state-db-Dhtiiltk.mjs";
import { s as parseAgentSessionKey } from "./openclaw-state-read-session-key-CJdIm256.mjs";
import { n as normalizeAccountId } from "./openclaw-state-read-account-id-CsGcZHqp.mjs";
import "./openclaw-state-read-owned-directory-observation-6SUeitZe.mjs";
import "./openclaw-state-read-session-row-changes-CwGi6K3q.mjs";
import { C as readOpenClawAgentDatabaseIdentity, S as isOpenClawAgentDatabasePathCurrent, T as SESSION_PARTICIPANTS_TABLE, r as prepareAgentDeletionPathFence, t as assertAgentDeletionPathFence, u as isReservedSystemAgentId, x as findOpenClawAgentDatabaseIdentity } from "./openclaw-state-read-agent-deletion-journal-kOb8UH8S.mjs";
import { d as runWithSqliteDatabaseAdmissionTurn } from "./openclaw-state-read-sqlite-worker-store-BDES2IEB.mjs";
import fs, { statSync } from "node:fs";
import path from "node:path";
import { isMainThread, threadId } from "node:worker_threads";
import crypto, { createHash, randomUUID } from "node:crypto";
import { AsyncLocalStorage } from "node:async_hooks";
import { hostname } from "node:os";
import { channel } from "node:diagnostics_channel";
import { performance as performance$1 } from "node:perf_hooks";
import { addAbortListener, setMaxListeners } from "node:events";
//#region src/infra/sqlite-native-exclusion.ts
/**
* Acquire native exclusion on the caller's settled, already-owned connection.
* Leaves the transaction open; the caller owns settlement and final close.
* This grants no application authority and does not change journal mode.
*/
function beginSqliteConnectionExclusion(database) {
	database.exec("PRAGMA locking_mode = EXCLUSIVE; BEGIN EXCLUSIVE;");
}
//#endregion
//#region packages/memory-host-sdk/src/host/memory-schema-provenance.ts
const MEMORY_INDEX_CHUNK_PROVENANCE_TABLE = "memory_index_chunk_provenance";
const MEMORY_INDEX_CHUNK_PROVENANCE_SCHEMA_SQL = `
  CREATE TABLE IF NOT EXISTS ${MEMORY_INDEX_CHUNK_PROVENANCE_TABLE} (
    chunk_id TEXT PRIMARY KEY,
    origin_class TEXT NOT NULL CHECK (origin_class IN ('owner', 'agent', 'untrusted', 'system')),
    session_kind TEXT NOT NULL CHECK (session_kind IN ('interactive', 'cron', 'heartbeat', 'subagent', 'unknown')),
    observed_at INTEGER NOT NULL,
    supersedes_key TEXT,
    FOREIGN KEY (chunk_id) REFERENCES memory_index_chunks(id) ON DELETE CASCADE
  ) STRICT;
`;
const ensureProvenanceTable = createSqliteSchemaEnsurer(() => MEMORY_INDEX_CHUNK_PROVENANCE_SCHEMA_SQL, { tables: [MEMORY_INDEX_CHUNK_PROVENANCE_TABLE] });
const retiredProvenanceTrigger = "memory_index_chunk_provenance_after_insert";
const missingChunkIdsSql = `
  SELECT chunk.id
  FROM memory_index_chunks AS chunk
  LEFT JOIN ${MEMORY_INDEX_CHUNK_PROVENANCE_TABLE} AS provenance
    ON provenance.chunk_id = chunk.id
  WHERE provenance.chunk_id IS NULL
`;
function ensureMemoryChunkProvenance(db) {
	const ensure = () => {
		const facts = getAdmittedSqliteSchemaFacts(db);
		if (facts ? facts.triggers.has(retiredProvenanceTrigger) : createSqliteTableContractReader(db)("memory_index_chunks")?.triggers.some(({ name }) => name === retiredProvenanceTrigger)) db.exec(`DROP TRIGGER ${retiredProvenanceTrigger}`);
		ensureProvenanceTable(db);
		backfillMemoryChunkProvenance(db);
	};
	if (db.isTransaction) {
		ensure();
		return;
	}
	runSqliteImmediateTransactionSync(db, ensure);
}
/** Imported rows still need provenance after their physical schema has been admitted. */
function backfillMemoryChunkProvenance(db) {
	const backfill = () => {
		db.exec(`
      WITH missing AS MATERIALIZED (${missingChunkIdsSql}),
      affected AS MATERIALIZED (
        SELECT chunk.path, chunk.source
        FROM missing
        CROSS JOIN memory_index_chunks AS chunk ON chunk.id = missing.id
      )
      UPDATE memory_index_sources
      SET hash = ''
      WHERE EXISTS (
        SELECT 1
        FROM affected
        WHERE affected.path = memory_index_sources.path
          AND affected.source IS memory_index_sources.source
      );

      WITH missing AS MATERIALIZED (${missingChunkIdsSql})
      INSERT OR IGNORE INTO ${MEMORY_INDEX_CHUNK_PROVENANCE_TABLE} (
        chunk_id, origin_class, session_kind, observed_at
      )
      SELECT chunk.id, 'untrusted', 'unknown', chunk.updated_at
      FROM missing
      JOIN memory_index_chunks AS chunk ON chunk.id = missing.id;
    `);
	};
	if (db.isTransaction) {
		backfill();
		return;
	}
	runSqliteImmediateTransactionSync(db, backfill);
}
//#endregion
//#region packages/memory-host-sdk/src/host/memory-schema-recall.ts
const MEMORY_INDEX_CHUNKS_TABLE$1 = "memory_index_chunks";
const MEMORY_INDEX_CHUNK_RECALL_METADATA_TABLE = "memory_index_chunk_recall_metadata";
const MEMORY_INDEX_CHUNK_RECALL_METADATA_SCHEMA_SQL = `
  CREATE TABLE IF NOT EXISTS ${MEMORY_INDEX_CHUNK_RECALL_METADATA_TABLE} (
    chunk_id TEXT PRIMARY KEY,
    importance INTEGER CHECK (importance IS NULL OR importance BETWEEN 1 AND 10),
    triggers TEXT,
    project_key TEXT,
    FOREIGN KEY (chunk_id) REFERENCES ${MEMORY_INDEX_CHUNKS_TABLE$1}(id) ON DELETE CASCADE
  ) STRICT;
`;
function readMemoryChunkColumns(db) {
	const rows = db.prepare(`PRAGMA table_info(${MEMORY_INDEX_CHUNKS_TABLE$1})`).all();
	return new Set(rows.flatMap((row) => typeof row.name === "string" ? [row.name] : []));
}
function tableExists$1(db, tableName) {
	return Boolean(db.prepare("SELECT 1 FROM sqlite_schema WHERE type = 'table' AND name = ? LIMIT 1").get(tableName));
}
function legacyRecallMetadataColumns(db) {
	const columns = readMemoryChunkColumns(db);
	return [
		"importance",
		"triggers",
		"project_key"
	].filter((column) => columns.has(column));
}
function hasLegacyMemoryRecallMetadataColumns(db) {
	return legacyRecallMetadataColumns(db).length > 0;
}
function ensureMemoryRecallMetadataSchema(db) {
	if (legacyRecallMetadataColumns(db).length === 0 && tableExists$1(db, "memory_index_chunk_recall_metadata")) return;
	const ensure = () => {
		db.exec(MEMORY_INDEX_CHUNK_RECALL_METADATA_SCHEMA_SQL);
		const columns = new Set(legacyRecallMetadataColumns(db));
		if (columns.size === 0) return;
		const importance = columns.has("importance") ? "importance" : "NULL";
		const triggers = columns.has("triggers") ? "triggers" : "NULL";
		const projectKey = columns.has("project_key") ? "project_key" : "NULL";
		db.exec(`
      INSERT INTO ${MEMORY_INDEX_CHUNK_RECALL_METADATA_TABLE} (
        chunk_id, importance, triggers, project_key
      )
      SELECT id, ${importance}, ${triggers}, ${projectKey}
      FROM ${MEMORY_INDEX_CHUNKS_TABLE$1}
      WHERE ${importance} IS NOT NULL
         OR ${triggers} IS NOT NULL
         OR ${projectKey} IS NOT NULL
      ON CONFLICT(chunk_id) DO UPDATE SET
        importance=excluded.importance,
        triggers=excluded.triggers,
        project_key=excluded.project_key;
    `);
		for (const column of [
			"project_key",
			"triggers",
			"importance"
		]) if (columns.has(column)) db.exec(`ALTER TABLE ${MEMORY_INDEX_CHUNKS_TABLE$1} DROP COLUMN ${column}`);
	};
	if (db.isTransaction) {
		ensure();
		return;
	}
	runSqliteImmediateTransactionSync(db, ensure);
}
//#endregion
//#region packages/memory-host-sdk/src/host/memory-schema-fts.ts
const MEMORY_INDEX_SOURCES_TABLE = "memory_index_sources";
const MEMORY_INDEX_CHUNKS_TABLE = "memory_index_chunks";
const MEMORY_INDEX_FTS_TABLE = "memory_index_chunks_fts";
const MEMORY_INDEX_PATHS_FTS_TABLE = "memory_index_paths_fts";
function buildMemoryFtsTriggers(name, table, columns, insert, remove) {
	const trigger = (event, clause, body) => ({
		name: `${name}_after_${event}`,
		sql: `
      CREATE TRIGGER IF NOT EXISTS main.${name}_after_${event}
      AFTER ${clause} ON ${table}
      BEGIN
${body}
      END;
    `
	});
	return [
		trigger("insert", "INSERT", insert),
		trigger("update", `UPDATE OF ${columns}`, `${remove}
${insert}`),
		trigger("delete", "DELETE", remove)
	];
}
/** Optional canonical triggers owned by the derived path FTS index. */
const MEMORY_PATH_FTS_TRIGGER_DEFINITIONS = buildMemoryFtsTriggers(MEMORY_INDEX_PATHS_FTS_TABLE, MEMORY_INDEX_SOURCES_TABLE, "id, path, source", `        INSERT INTO ${MEMORY_INDEX_PATHS_FTS_TABLE} (rowid, path, source)
        VALUES (NEW.id, NEW.path, NEW.source);`, `        DELETE FROM ${MEMORY_INDEX_PATHS_FTS_TABLE}
        WHERE rowid = OLD.id;`);
/** Canonical chunks own the optional body index; every mutation addresses its rowid. */
const MEMORY_CHUNK_FTS_TRIGGER_DEFINITIONS = buildMemoryFtsTriggers(MEMORY_INDEX_FTS_TABLE, MEMORY_INDEX_CHUNKS_TABLE, "chunk_rowid, text, id, path, source, model, start_line, end_line", `        INSERT INTO ${MEMORY_INDEX_FTS_TABLE} (rowid, text, id, path, source, model, start_line, end_line)
        VALUES (NEW.chunk_rowid, NEW.text, NEW.id, NEW.path, NEW.source, NEW.model, NEW.start_line, NEW.end_line);`, `        DELETE FROM ${MEMORY_INDEX_FTS_TABLE} WHERE rowid = OLD.chunk_rowid;`);
function dropMemoryChunkFtsTriggers(db) {
	for (const trigger of MEMORY_CHUNK_FTS_TRIGGER_DEFINITIONS) db.exec(`DROP TRIGGER IF EXISTS main.${trigger.name}`);
}
function ensureMemoryChunkFtsTriggers(db) {
	for (const trigger of MEMORY_CHUNK_FTS_TRIGGER_DEFINITIONS) db.exec(trigger.sql);
}
function rebuildMemoryChunkFts(db, ftsTable) {
	db.exec(`
    DELETE FROM ${ftsTable};
    INSERT INTO ${ftsTable} (
      rowid, text, id, path, source, model, start_line, end_line
    )
    SELECT chunk_rowid, text, id, path, source, model, start_line, end_line
    FROM ${MEMORY_INDEX_CHUNKS_TABLE};
  `);
}
/** Drop the canonical source-to-path-FTS maintenance triggers. */
function dropMemoryPathFtsTriggers(db) {
	for (const trigger of MEMORY_PATH_FTS_TRIGGER_DEFINITIONS) db.exec(`DROP TRIGGER IF EXISTS main.${trigger.name}`);
}
/** Install the canonical source-to-path-FTS maintenance triggers. */
function ensureMemoryPathFtsTriggers(db) {
	for (const trigger of MEMORY_PATH_FTS_TRIGGER_DEFINITIONS) db.exec(trigger.sql);
}
const MEMORY_INDEX_CHUNKS_SCHEMA_SQL = `
  CREATE TABLE IF NOT EXISTS ${MEMORY_INDEX_CHUNKS_TABLE} (
    chunk_rowid INTEGER PRIMARY KEY,
    id TEXT NOT NULL UNIQUE,
    path TEXT NOT NULL,
    source TEXT NOT NULL DEFAULT 'memory',
    start_line INTEGER NOT NULL,
    end_line INTEGER NOT NULL,
    hash TEXT NOT NULL,
    model TEXT NOT NULL,
    text TEXT NOT NULL,
    embedding BLOB NOT NULL,
    updated_at INTEGER NOT NULL
  ) STRICT;
`;
function buildMemoryEmbeddingCacheSchema(table) {
	return `
    CREATE TABLE IF NOT EXISTS ${table} (
      provider TEXT NOT NULL,
      model TEXT NOT NULL,
      provider_key TEXT NOT NULL,
      hash TEXT NOT NULL,
      embedding BLOB NOT NULL,
      dims INTEGER,
      updated_at INTEGER NOT NULL,
      PRIMARY KEY (provider, model, provider_key, hash)
    ) STRICT;
  `;
}
//#endregion
//#region packages/memory-host-sdk/src/host/embedding-vector.ts
/** Persistent vectors use IEEE-754 binary64 in little-endian order on every host. */
function encodeMemoryEmbedding(embedding) {
	const bytes = new Uint8Array(embedding.length * 8);
	const view = new DataView(bytes.buffer);
	for (let index = 0; index < embedding.length; index += 1) {
		const coordinate = embedding[index];
		if (typeof coordinate !== "number" || !Number.isFinite(coordinate)) throw new Error("Memory embeddings require finite numeric coordinates");
		view.setFloat64(index * 8, coordinate, true);
	}
	return bytes;
}
/** Invalid derived vectors stay unusable; cache and indexing owners repair them. */
function decodeMemoryEmbedding(bytes) {
	if (bytes.byteLength % 8 !== 0) return [];
	const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
	const embedding = [];
	for (let offset = 0; offset < bytes.byteLength; offset += 8) {
		const coordinate = view.getFloat64(offset, true);
		if (!Number.isFinite(coordinate)) return [];
		embedding.push(coordinate);
	}
	return embedding;
}
//#endregion
//#region packages/memory-host-sdk/src/host/memory-schema-storage-migration.ts
const LEGACY_CHUNK_SCHEMA = `
  CREATE TABLE IF NOT EXISTS memory_index_chunks (
    id TEXT PRIMARY KEY,
    path TEXT NOT NULL,
    source TEXT NOT NULL DEFAULT 'memory',
    start_line INTEGER NOT NULL,
    end_line INTEGER NOT NULL,
    hash TEXT NOT NULL,
    model TEXT NOT NULL,
    text TEXT NOT NULL,
    embedding TEXT NOT NULL,
    updated_at INTEGER NOT NULL
  ) STRICT;
`;
function legacyCacheSchema(table) {
	return `CREATE TABLE IF NOT EXISTS ${table} (
    provider TEXT NOT NULL,
    model TEXT NOT NULL,
    provider_key TEXT NOT NULL,
    hash TEXT NOT NULL,
    embedding TEXT NOT NULL,
    dims INTEGER,
    updated_at INTEGER NOT NULL,
    PRIMARY KEY (provider, model, provider_key, hash)
  ) STRICT;`;
}
const CHUNK_INDEXES = [
	{
		name: "idx_memory_index_chunks_path_source",
		columns: "path, source"
	},
	{
		name: "idx_memory_index_chunks_path",
		columns: "path"
	},
	{
		name: "idx_memory_index_chunks_source",
		columns: "source"
	}
];
const CHUNK_REVISION_TRIGGERS = [
	"insert",
	"update",
	"delete"
].map((event) => ({
	name: `memory_index_chunks_revision_after_${event}`,
	sql: `CREATE TRIGGER IF NOT EXISTS memory_index_chunks_revision_after_${event}
    AFTER ${event.toUpperCase()} ON memory_index_chunks
    BEGIN UPDATE memory_index_state SET revision = revision + 1 WHERE id = 1; END;`
}));
const INLINE_RECALL_COLUMNS = [
	["importance", "importance INTEGER CHECK (importance IS NULL OR importance BETWEEN 1 AND 10)"],
	["triggers", "triggers TEXT"],
	["project_key", "project_key TEXT"]
];
function storageShape(db, table, chunks, readTable) {
	const tableColumns = columns(db, table);
	if (tableColumns.size === 0) return "absent";
	const shape = tableColumns.get("embedding") === "TEXT" ? "legacy" : tableColumns.get("embedding") === "BLOB" ? "binary" : void 0;
	if (!shape || chunks && tableColumns.has("chunk_rowid") !== (shape === "binary")) throw new Error(`Unsupported partial memory storage schema: ${table}`);
	let schema = chunks ? shape === "legacy" ? LEGACY_CHUNK_SCHEMA : MEMORY_INDEX_CHUNKS_SCHEMA_SQL : shape === "legacy" ? legacyCacheSchema(table) : buildMemoryEmbeddingCacheSchema(table);
	if (chunks) {
		const inline = INLINE_RECALL_COLUMNS.filter(([name]) => tableColumns.has(name));
		if (inline.length > 0) schema = schema.replace("updated_at INTEGER NOT NULL", `updated_at INTEGER NOT NULL,\n${inline.map(([, declaration]) => declaration).join(",\n")}`);
	}
	if (shape === "legacy" && db.prepare("SELECT strict FROM pragma_table_list WHERE schema = 'main' AND name = ?").get(table)?.strict === 0) schema = schema.replace(") STRICT;", ");");
	const indexes = chunks ? CHUNK_INDEXES : [{
		name: table === "memory_embedding_cache" ? "idx_memory_embedding_cache_updated_at" : "idx_embedding_cache_updated_at",
		columns: "updated_at"
	}];
	schema += indexes.map((index) => `CREATE INDEX ${index.name} ON ${table}(${index.columns});`).join("\n");
	assertSqliteSchemaContains(db, `memory storage ${table}`, schema, {
		allowCompatibleAdditiveColumns: shape === "binary",
		allowedMissingIndexes: indexes.map((index) => index.name),
		optionalCanonicalTriggerGroups: chunks ? [{
			tableName: table,
			triggers: CHUNK_REVISION_TRIGGERS
		}, ...shape === "binary" ? [{
			tableName: table,
			triggers: MEMORY_CHUNK_FTS_TRIGGER_DEFINITIONS
		}] : []] : []
	}, readTable);
	if (shape === "legacy") assertKnownRebuildDependents(db, table, indexes.map((index) => index.name), chunks ? CHUNK_REVISION_TRIGGERS.map((trigger) => trigger.name) : []);
	return shape;
}
function assertKnownRebuildDependents(db, table, indexes, triggers) {
	const known = /* @__PURE__ */ new Set([...indexes, ...triggers]);
	const dependent = db.prepare(`
    SELECT type, name, tbl_name FROM main.sqlite_schema
    WHERE (type IN ('trigger', 'index') AND tbl_name = ? AND sql IS NOT NULL)
       OR (type IN ('view', 'trigger') AND instr(lower(sql), ?) > 0)
  `).all(table, table).find((row) => row.tbl_name !== table || !known.has(String(row.name)));
	if (dependent) throw new Error(`Memory storage migration cannot rebuild unknown ${String(dependent.type)} ${String(dependent.name)} on ${table}`);
	for (const row of db.prepare("SELECT name FROM main.sqlite_schema WHERE type = 'table'").all()) {
		const name = String(row.name);
		const references = db.prepare(`PRAGMA main.foreign_key_list("${name.replaceAll("\"", "\"\"")}")`).all().filter((key) => key.table === table);
		const knownChild = table === "memory_index_chunks" && ["memory_index_chunk_provenance", "memory_index_chunk_recall_metadata"].includes(name);
		if (references.some((key) => !knownChild || key.from !== "chunk_id" || key.to !== "id" || key.on_delete !== "CASCADE" || key.on_update !== "NO ACTION")) throw new Error(`Memory storage migration cannot rebuild ${table} referenced by an unknown foreign key in ${name}`);
	}
}
function storageShapes(db, cacheTable) {
	const readTable = canReuseSqliteSchemaInTransaction(db) ? createSqliteTableContractReader(db) : void 0;
	return {
		chunks: storageShape(db, "memory_index_chunks", true, readTable),
		cache: storageShape(db, cacheTable, false, readTable)
	};
}
function assertBinaryEmbeddings(db, table) {
	const rows = db.prepare(`SELECT openclaw_memory_embedding_blob_valid(embedding) AS valid FROM ${table}`);
	for (const row of rows.iterate()) if (row.valid === 0) throw new Error(`Memory storage migration found invalid binary embeddings in ${table}`);
}
function copyMemoryStorageRows(db, table, sql) {
	const rows = db.prepare(`SELECT rowid AS storage_rowid FROM ${table}`);
	rows.setReadBigInts(true);
	const copy = db.prepare(sql);
	copy.setReadBigInts(true);
	for (const row of rows.iterate()) {
		if (typeof row.storage_rowid !== "bigint") throw new Error("Invalid memory storage identity during migration");
		copy.run(row.storage_rowid);
	}
}
function markInvalidMemoryEmbeddings(db, sql) {
	const rows = db.prepare(sql);
	rows.setReadBigInts(true);
	const dirtySource = db.prepare(`
    UPDATE main.memory_index_sources SET hash = ''
    WHERE (path, source) IN (
      SELECT path, source FROM main.memory_index_chunks WHERE rowid = ?
    )`);
	dirtySource.setReadBigInts(true);
	let invalid = false;
	for (const row of rows.iterate()) if (row.valid === 0) {
		if (typeof row.storage_rowid !== "bigint") throw new Error("Invalid memory storage identity during migration");
		dirtySource.run(row.storage_rowid);
		invalid = true;
	}
	if (invalid) db.exec(`
      INSERT INTO main.memory_index_meta (key, value)
      VALUES ('memory_vector_rebuild_v1', '1')
      ON CONFLICT(key) DO UPDATE SET value = excluded.value;
    `);
}
function legacyEmbedding(raw) {
	if (typeof raw !== "string") return;
	try {
		const parsed = JSON.parse(raw);
		return Array.isArray(parsed) && parsed.every((value) => typeof value === "number" && Number.isFinite(value)) ? parsed : void 0;
	} catch {
		return;
	}
}
function copyLegacyMemoryEmbeddingCache(db, table, replacement, renewAuthority) {
	const maxEmbeddingBytes = 1048576;
	const rows = db.prepare(`
    SELECT rowid AS storage_rowid,
      CASE WHEN length(CAST(embedding AS BLOB)) <= ${maxEmbeddingBytes}
        THEN embedding ELSE NULL END AS embedding
    FROM ${table} WHERE rowid >= ? ORDER BY rowid LIMIT 128
  `);
	rows.setReadBigInts(true);
	const copy = db.prepare(`
    INSERT INTO ${replacement} (rowid, provider, model, provider_key, hash, embedding, dims, updated_at)
    SELECT rowid, provider, model, provider_key, hash, ?, dims, updated_at
    FROM ${table} WHERE rowid = ?
  `);
	copy.setReadBigInts(true);
	let nextRowid = -9223372036854775808n;
	let skipped = 0;
	const firstSkippedRowids = [];
	while (nextRowid <= 9223372036854775807n) {
		let count = 0;
		for (const row of rows.iterate(nextRowid)) {
			if (typeof row.storage_rowid !== "bigint") throw new Error("Invalid memory storage identity during migration");
			renewAuthority();
			nextRowid = row.storage_rowid + 1n;
			count += 1;
			const embedding = legacyEmbedding(row.embedding ?? null);
			if (embedding === void 0) {
				skipped += 1;
				if (firstSkippedRowids.length < 8) firstSkippedRowids.push(String(row.storage_rowid));
				continue;
			}
			copy.run(encodeMemoryEmbedding(embedding), row.storage_rowid);
		}
		if (count < 128) break;
	}
	return skipped > 0 ? `Skipped ${skipped} ${table} rows with invalid embeddings or embeddings larger than ${maxEmbeddingBytes} bytes (first rowids: ${firstSkippedRowids.join(", ")}). These cache entries will be rebuilt on demand.` : void 0;
}
/** Only migrations/imports interpret the retired JSON representation. */
function registerMemoryEmbeddingMigrationFunctions(db, renewAuthority) {
	let renewedAt = Number.NEGATIVE_INFINITY;
	const renew = () => {
		if (!renewAuthority) return;
		const now = performance.now();
		if (now - renewedAt >= 1e3) {
			renewAuthority();
			renewedAt = now;
		}
	};
	db.function("openclaw_memory_embedding_from_json", { deterministic: true }, (raw) => {
		renew();
		return encodeMemoryEmbedding(legacyEmbedding(raw) ?? []);
	});
	db.function("openclaw_memory_embedding_json_valid", { deterministic: true }, (raw) => {
		renew();
		return Number(legacyEmbedding(raw) !== void 0);
	});
	db.function("openclaw_memory_embedding_blob_valid", { deterministic: true }, (raw) => {
		renew();
		return Number(raw instanceof Uint8Array && raw.byteLength % 8 === 0 && decodeMemoryEmbedding(raw).length * 8 === raw.byteLength);
	});
	return renew;
}
function existingStorageObjects(db, table) {
	return db.prepare(`SELECT sql FROM main.sqlite_schema
    WHERE tbl_name = ? AND type IN ('index', 'trigger') AND sql IS NOT NULL
    ORDER BY type, name`).all(table).map((row) => String(row.sql));
}
function replaceStorageTable(db, table, objects) {
	db.exec(`
    DROP TABLE ${table};
    ALTER TABLE ${table}_storage_migration RENAME TO ${table};
  `);
	for (const sql of objects) db.exec(sql);
}
function columns(db, table) {
	return new Map(db.prepare("SELECT name, type FROM pragma_table_info(?)").all(table).map((row) => [String(row.name), String(row.type).toUpperCase()]));
}
/**
* Convert only memory storage, without provider calls. The agent migration owner
* supplies its admitted transaction with foreign keys disabled before BEGIN.
* Standalone/shadow index owners receive the same atomic conversion here.
*/
function migrateMemoryIndexStorage(db, options = {}) {
	const cacheTable = options.embeddingCacheTable ?? "memory_embedding_cache";
	if (!/^[A-Za-z_][A-Za-z0-9_]*$/u.test(cacheTable)) throw new Error("Invalid memory embedding cache table identifier");
	const shapes = storageShapes(db, cacheTable);
	const migrateChunks = shapes.chunks === "legacy";
	const migrateCache = shapes.cache === "legacy";
	if (!migrateChunks && !migrateCache) return;
	const foreignKeys = Number(db.prepare("PRAGMA foreign_keys").get()?.foreign_keys) !== 0;
	if (migrateChunks && foreignKeys && db.isTransaction) throw new Error("Memory storage migration requires foreign keys disabled before BEGIN");
	if (migrateChunks && foreignKeys) db.exec("PRAGMA foreign_keys = OFF");
	let cacheWarning;
	try {
		runSqliteImmediateTransactionSync(db, () => {
			const current = storageShapes(db, cacheTable);
			if (current.chunks !== shapes.chunks || current.cache !== shapes.cache) throw new Error("Memory storage schema changed before migration admission");
			const renewAuthority = registerMemoryEmbeddingMigrationFunctions(db, options.renewAuthority);
			const chunkObjects = migrateChunks ? existingStorageObjects(db, "memory_index_chunks") : [];
			const cacheObjects = migrateCache ? existingStorageObjects(db, cacheTable) : [];
			if (current.chunks === "binary") assertBinaryEmbeddings(db, "memory_index_chunks");
			if (current.cache === "binary") assertBinaryEmbeddings(db, cacheTable);
			if (migrateChunks) {
				ensureMemoryRecallMetadataSchema(db);
				markInvalidMemoryEmbeddings(db, `
          SELECT rowid AS storage_rowid,
                 openclaw_memory_embedding_json_valid(embedding) AS valid
          FROM memory_index_chunks
        `);
				dropMemoryChunkFtsTriggers(db);
				db.exec(MEMORY_INDEX_CHUNKS_SCHEMA_SQL.replace("CREATE TABLE IF NOT EXISTS", "CREATE TABLE").replace("memory_index_chunks", "memory_index_chunks_storage_migration"));
				copyMemoryStorageRows(db, "memory_index_chunks", `
          INSERT INTO memory_index_chunks_storage_migration (
            chunk_rowid, id, path, source, start_line, end_line, hash, model, text, embedding, updated_at
          )
          SELECT rowid, id, path, source, start_line, end_line, hash, model, text,
                 openclaw_memory_embedding_from_json(embedding), updated_at
          FROM memory_index_chunks WHERE rowid = ?
        `);
				replaceStorageTable(db, "memory_index_chunks", chunkObjects);
				if (db.prepare("SELECT 1 FROM sqlite_schema WHERE type = 'table' AND name = ?").get("memory_index_chunks_fts")) {
					rebuildMemoryChunkFts(db, MEMORY_INDEX_FTS_TABLE);
					ensureMemoryChunkFtsTriggers(db);
				}
			}
			if (migrateCache) {
				const replacement = `${cacheTable}_storage_migration`;
				db.exec(buildMemoryEmbeddingCacheSchema(replacement).replace("CREATE TABLE IF NOT EXISTS", "CREATE TABLE"));
				cacheWarning = copyLegacyMemoryEmbeddingCache(db, cacheTable, replacement, renewAuthority);
				replaceStorageTable(db, cacheTable, cacheObjects);
			}
			if (migrateChunks) {
				for (const table of ["memory_index_chunk_provenance", "memory_index_chunk_recall_metadata"]) if (columns(db, table).size > 0 && db.prepare(`PRAGMA foreign_key_check(${table})`).all().length > 0) throw new Error("Memory storage migration failed foreign key validation");
			}
		});
	} finally {
		if (options.renewAuthority) registerMemoryEmbeddingMigrationFunctions(db);
		if (migrateChunks && foreignKeys) db.exec("PRAGMA foreign_keys = ON");
	}
	if (cacheWarning) {
		if (options.onWarning) options.onWarning(cacheWarning);
		else process.emitWarning(cacheWarning);
	}
}
//#endregion
//#region packages/memory-host-sdk/src/host/memory-schema.ts
const LEGACY_MEMORY_INDEX_SOURCE_COLUMNS = [
	"path",
	"source",
	"hash",
	"mtime",
	"size"
];
const MEMORY_INDEX_SOURCE_COLUMNS = ["id", ...LEGACY_MEMORY_INDEX_SOURCE_COLUMNS];
const MEMORY_INDEX_SOURCE_COLUMN_TYPES = /* @__PURE__ */ new Map([
	["id", "INTEGER"],
	["path", "TEXT"],
	["source", "TEXT"],
	["hash", "TEXT"],
	["mtime", "REAL"],
	["size", "INTEGER"]
]);
function tableColumnInfo(db, tableName) {
	return db.prepare(`PRAGMA main.table_xinfo(${tableName})`).all().flatMap((row) => typeof row.name === "string" && typeof row.type === "string" ? [{
		name: row.name,
		type: row.type.toUpperCase(),
		notnull: Number(row.notnull ?? 0),
		pk: Number(row.pk ?? 0),
		defaultValue: typeof row.dflt_value === "string" ? row.dflt_value : null,
		hidden: Number(row.hidden ?? 0)
	}] : []);
}
function tableHasExactColumns(db, tableName, expected, preparedColumns) {
	const columns = new Set((preparedColumns ?? tableColumnInfo(db, tableName)).map((row) => row.name));
	return columns.size === expected.length && expected.every((column) => columns.has(column));
}
function tableHasPrimaryKey(db, tableName, expectedColumns, preparedColumns) {
	const columns = (preparedColumns ?? tableColumnInfo(db, tableName)).filter((row) => row.pk > 0).toSorted((left, right) => left.pk - right.pk).map((row) => row.name);
	return columns.length === expectedColumns.length && columns.every((column, index) => column === expectedColumns[index]);
}
function tableHasUniqueIndex(db, tableName, expectedColumns) {
	const indexes = db.prepare(`SELECT name, partial FROM pragma_index_list(?) WHERE "unique" = 1`).all(tableName);
	if (indexes.length !== 1) return false;
	return indexes.some((index) => {
		if (typeof index.name !== "string" || Number(index.partial ?? 0) !== 0) return false;
		const columns = db.prepare(`SELECT cid, name, coll, "desc" AS sort_desc, key FROM pragma_index_xinfo(?) ORDER BY seqno`).all(index.name).filter((row) => Number(row.key ?? 0) === 1);
		return columns.length === expectedColumns.length && columns.every((column, columnIndex) => Number(column.cid ?? -1) >= 0 && column.name === expectedColumns[columnIndex] && column.coll === "BINARY" && Number(column.sort_desc ?? 0) === 0);
	});
}
function tableHasNoDeclaredCollations(db, tableName) {
	const row = db.prepare(`SELECT sql FROM sqlite_schema WHERE type = 'table' AND name = ?`).get(tableName);
	return typeof row?.sql === "string" && !/\bCOLLATE\b/iu.test(row.sql);
}
function tableHasSourceColumnContract(db, nullableColumn, preparedColumns) {
	return (preparedColumns ?? tableColumnInfo(db, "memory_index_sources")).every((column) => (column.type === MEMORY_INDEX_SOURCE_COLUMN_TYPES.get(column.name) || column.name === "mtime" && column.type === "INTEGER") && column.defaultValue === (column.name === "source" ? "'memory'" : null) && column.hidden === 0 && (column.name === nullableColumn || column.notnull === 1));
}
function tableHasIntegerRowIdPrimaryKey(db, preparedColumns) {
	if ((preparedColumns ?? tableColumnInfo(db, "memory_index_sources")).find((column) => column.name === "id")?.type !== "INTEGER" || !tableHasPrimaryKey(db, "memory_index_sources", ["id"], preparedColumns)) return false;
	return db.prepare(`SELECT 1 AS found FROM pragma_index_list(?) WHERE origin = 'pk' LIMIT 1`).get(MEMORY_INDEX_SOURCES_TABLE)?.found !== 1;
}
function tableExists(db, tableName) {
	return db.prepare(`SELECT 1 AS found FROM sqlite_master WHERE type = 'table' AND name = ?`).get(tableName)?.found === 1;
}
/** Upgrade canonical memory sources to stable integer identities. */
function migrateMemoryIndexSourcesIdentity(db) {
	if (!tableExists(db, "memory_index_sources")) return;
	const columns = canReuseSqliteSchemaInTransaction(db) ? tableColumnInfo(db, MEMORY_INDEX_SOURCES_TABLE) : void 0;
	if (tableHasExactColumns(db, "memory_index_sources", MEMORY_INDEX_SOURCE_COLUMNS, columns)) {
		if (tableHasSourceColumnContract(db, "id", columns) && tableHasIntegerRowIdPrimaryKey(db, columns) && tableHasNoDeclaredCollations(db, "memory_index_sources") && tableHasUniqueIndex(db, "memory_index_sources", ["path", "source"])) return;
		throw new Error("canonical memory source identity schema is invalid");
	}
	if (!tableHasExactColumns(db, "memory_index_sources", LEGACY_MEMORY_INDEX_SOURCE_COLUMNS, columns)) throw new Error("canonical memory source identity schema is invalid");
	const hasPathPrimaryKey = tableHasPrimaryKey(db, MEMORY_INDEX_SOURCES_TABLE, ["path"], columns);
	const hasPathSourcePrimaryKey = tableHasPrimaryKey(db, MEMORY_INDEX_SOURCES_TABLE, ["path", "source"], columns);
	if (!hasPathPrimaryKey && !hasPathSourcePrimaryKey) throw new Error("canonical memory source identity schema is invalid");
	if (!tableHasSourceColumnContract(db, hasPathPrimaryKey ? "path" : void 0, columns)) throw new Error("canonical memory source identity schema is invalid");
	const rebuildsPathFts = tableExists(db, MEMORY_INDEX_PATHS_FTS_TABLE);
	db.exec("SAVEPOINT migrate_memory_index_sources_identity");
	try {
		dropMemoryPathFtsTriggers(db);
		db.exec(`
      DROP TRIGGER IF EXISTS memory_index_sources_revision_after_insert;
      DROP TRIGGER IF EXISTS memory_index_sources_revision_after_update;
      DROP TRIGGER IF EXISTS memory_index_sources_revision_after_delete;

      ALTER TABLE ${MEMORY_INDEX_SOURCES_TABLE}
        RENAME TO memory_index_sources_identity_migration;
      CREATE TABLE ${MEMORY_INDEX_SOURCES_TABLE} (
        id INTEGER PRIMARY KEY,
        path TEXT NOT NULL,
        source TEXT NOT NULL DEFAULT 'memory',
        hash TEXT NOT NULL,
        mtime REAL NOT NULL,
        size INTEGER NOT NULL,
        UNIQUE (path, source)
      ) STRICT;
      INSERT INTO ${MEMORY_INDEX_SOURCES_TABLE} (id, path, source, hash, mtime, size)
      SELECT rowid, path, source, hash, mtime, size
      FROM memory_index_sources_identity_migration;
      DROP TABLE memory_index_sources_identity_migration;
    `);
		if (rebuildsPathFts) {
			db.exec(`
        DELETE FROM ${MEMORY_INDEX_PATHS_FTS_TABLE};
        INSERT INTO ${MEMORY_INDEX_PATHS_FTS_TABLE} (rowid, path, source)
        SELECT id, path, source FROM ${MEMORY_INDEX_SOURCES_TABLE};
      `);
			ensureMemoryPathFtsTriggers(db);
		}
		db.exec("RELEASE migrate_memory_index_sources_identity");
	} catch (err) {
		db.exec("ROLLBACK TO migrate_memory_index_sources_identity");
		db.exec("RELEASE migrate_memory_index_sources_identity");
		throw err;
	}
}
//#endregion
//#region src/state/openclaw-agent-context-engine-turn-outbox-schema.ts
const CONTEXT_ENGINE_TURN_OUTBOX_TABLE = "context_engine_turn_outbox";
createSqliteSchemaEnsurer(() => extractSqliteTableSchema(OPENCLAW_AGENT_SCHEMA_SQL, CONTEXT_ENGINE_TURN_OUTBOX_TABLE, {
	endMarker: "CREATE TABLE IF NOT EXISTS cache_entries (",
	includeEndMarker: false,
	errorMessage: "OpenClaw context-engine turn outbox schema markers are missing."
}), {
	tables: [CONTEXT_ENGINE_TURN_OUTBOX_TABLE],
	indexes: ["idx_agent_context_engine_turn_outbox_engine"]
});
//#endregion
//#region src/state/openclaw-agent-goal-operations-schema.ts
const SESSION_GOAL_OPERATIONS_TABLE = "session_goal_operations";
createSqliteSchemaEnsurer(() => extractSqliteTableSchema(OPENCLAW_AGENT_SCHEMA_SQL, SESSION_GOAL_OPERATIONS_TABLE, {
	endMarker: "CREATE TABLE IF NOT EXISTS transcript_events (",
	includeEndMarker: false,
	errorMessage: "OpenClaw Goal operation schema markers are missing."
}), {
	tables: [SESSION_GOAL_OPERATIONS_TABLE],
	indexes: ["idx_agent_session_goal_operations_expiry"]
});
//#endregion
//#region src/state/openclaw-agent-message-tool-outcome-schema.ts
const MESSAGE_TOOL_RUN_OUTCOMES_TABLE = "message_tool_run_outcomes";
//#endregion
//#region src/state/openclaw-agent-pending-inputs-schema.ts
const SESSION_PENDING_INPUTS_TABLE = "session_pending_inputs";
const SESSION_INPUT_COMPLETIONS_TABLE = "session_input_completions";
createSqliteSchemaEnsurer(() => extractSqliteTableSchema(OPENCLAW_AGENT_SCHEMA_SQL, SESSION_PENDING_INPUTS_TABLE, {
	endMarker: "-- Processing completion",
	includeEndMarker: false,
	errorMessage: "OpenClaw pending-input schema marker is missing."
}), {
	tables: [SESSION_PENDING_INPUTS_TABLE],
	indexes: ["idx_agent_session_pending_inputs_session"]
});
createSqliteSchemaEnsurer(() => extractSqliteTableSchema(OPENCLAW_AGENT_SCHEMA_SQL, SESSION_INPUT_COMPLETIONS_TABLE, { errorMessage: "OpenClaw input-completion schema marker is missing." }), { tables: [SESSION_INPUT_COMPLETIONS_TABLE] });
//#endregion
//#region src/state/openclaw-agent-board-schema.ts
const BOARD_WIDGETS_SCHEMA_START = "CREATE TABLE IF NOT EXISTS board_widgets (";
const BOARD_WIDGETS_MIGRATION_TABLE = "board_widgets_plugin_kind_migration_new";
const PLUGIN_CONTENT_KIND_CLAUSE_PATTERN = /content_kind\s+IN\s*\(\s*'html'\s*,\s*'mcp-app'\s*,\s*'plugin'\s*\)/iu;
const PLUGIN_PAYLOAD_BRANCH_PATTERN = /\s+OR\s+\(content_kind\s*=\s*'plugin'\s+AND\s+html\s+IS\s+NULL\s+AND\s+descriptor_json\s+IS\s+NOT\s+NULL\s+AND\s+view_generation\s+IS\s+NULL\)/iu;
const OPENCLAW_AGENT_BOARD_SCHEMA_SQL = extractSqliteTableSchema(OPENCLAW_AGENT_SCHEMA_SQL, "board_tabs", {
	endMarker: "CREATE TABLE IF NOT EXISTS session_progress_cards (",
	includeEndMarker: false,
	errorMessage: "OpenClaw agent board schema markers are missing from the canonical schema."
});
const AGENT_V14_BOARD_SCHEMA_SQL = OPENCLAW_AGENT_BOARD_SCHEMA_SQL;
const OPENCLAW_AGENT_SCHEMA_WITHOUT_BOARD_SQL = OPENCLAW_AGENT_SCHEMA_SQL.replace(OPENCLAW_AGENT_BOARD_SCHEMA_SQL, "");
const ensureBoardTables = createSqliteSchemaEnsurer(() => OPENCLAW_AGENT_BOARD_SCHEMA_SQL, {
	tables: ["board_tabs", "board_widgets"],
	indexes: ["idx_agent_board_widgets_tab_position"]
});
function canonicalBoardWidgetsCreateSql() {
	return extractSqliteTableSchema(OPENCLAW_AGENT_BOARD_SCHEMA_SQL, "board_widgets", {
		endMarker: "CREATE INDEX IF NOT EXISTS idx_agent_board_widgets_tab_position",
		includeEndMarker: false,
		errorMessage: "OpenClaw agent board widget schema markers are missing."
	}).trim();
}
function legacyBoardWidgetsCreateSql() {
	const canonical = canonicalBoardWidgetsCreateSql();
	const legacy = canonical.replace(PLUGIN_CONTENT_KIND_CLAUSE_PATTERN, "content_kind IN ('html', 'mcp-app')").replace(PLUGIN_PAYLOAD_BRANCH_PATTERN, "");
	if (legacy === canonical) throw new Error("OpenClaw agent board widget legacy schema derivation failed.");
	return legacy;
}
function normalizeBoardWidgetsCreateSql(sql) {
	return sql.replace(/^CREATE TABLE(?: IF NOT EXISTS)?\s+(?:board_widgets|"board_widgets"|`board_widgets`|\[board_widgets\])\s*\(/iu, "CREATE TABLE board_widgets (").replace(/\s+/gu, " ").replace(/;\s*$/u, "").trim();
}
/** Repair the v14 board constraint inside the caller's schema/write transaction. */
function ensureOpenClawAgentBoardSchemaInTransaction(db) {
	if (!db.isTransaction) throw new Error("board schema ensure requires an active transaction");
	ensureBoardTables(db);
	const sql = getAdmittedSqliteSchemaFacts(db)?.tableSql.get("board_widgets") ?? db.prepare("SELECT sql FROM sqlite_schema WHERE type = 'table' AND name = 'board_widgets'").get()?.sql;
	if (typeof sql !== "string") throw new Error("OpenClaw agent board widget schema is missing after ensure.");
	const normalizedSchema = normalizeBoardWidgetsCreateSql(sql);
	if (normalizedSchema === normalizeBoardWidgetsCreateSql(canonicalBoardWidgetsCreateSql())) return;
	if (normalizedSchema !== normalizeBoardWidgetsCreateSql(legacyBoardWidgetsCreateSql())) throw new Error("OpenClaw agent board widget schema has an unsupported content-kind constraint.");
	if (db.prepare("SELECT 1 FROM sqlite_schema WHERE type = 'table' AND name = ?").get(BOARD_WIDGETS_MIGRATION_TABLE)) throw new Error(`OpenClaw agent board migration table already exists: ${BOARD_WIDGETS_MIGRATION_TABLE}`);
	const migrationCreateSql = canonicalBoardWidgetsCreateSql().replace(BOARD_WIDGETS_SCHEMA_START, `CREATE TABLE ${BOARD_WIDGETS_MIGRATION_TABLE} (`);
	db.exec(`
    ${migrationCreateSql}
    INSERT INTO ${BOARD_WIDGETS_MIGRATION_TABLE} (
      session_key, name, tab_id, title, content_kind, html, descriptor_json, sha256,
      view_generation, revision, size_w, size_h, position, manifest, grant_state,
      granted_sha, created_by, created_at, updated_at
    )
    SELECT
      session_key, name, tab_id, title, content_kind, html, descriptor_json, sha256,
      view_generation, revision, size_w, size_h, position, manifest, grant_state,
      granted_sha, created_by, created_at, updated_at
    FROM board_widgets;
    DROP TABLE board_widgets;
    ALTER TABLE ${BOARD_WIDGETS_MIGRATION_TABLE} RENAME TO board_widgets;
  `);
	db.exec(OPENCLAW_AGENT_BOARD_SCHEMA_SQL);
}
//#endregion
//#region src/state/openclaw-agent-progress-card-schema.ts
const SESSION_PROGRESS_CARDS_TABLE = "session_progress_cards";
const AGENT_PROGRESS_CARD_SCHEMA_SQL = extractSqliteTableSchema(OPENCLAW_AGENT_SCHEMA_WITHOUT_BOARD_SQL, SESSION_PROGRESS_CARDS_TABLE, {
	endMarker: "CREATE TABLE IF NOT EXISTS heartbeat_outcomes (",
	includeEndMarker: false,
	errorMessage: "OpenClaw agent progress-card schema markers are missing."
});
const AGENT_SCHEMA_WITHOUT_PROGRESS_CARD_SQL = OPENCLAW_AGENT_SCHEMA_WITHOUT_BOARD_SQL.replace(AGENT_PROGRESS_CARD_SCHEMA_SQL, "");
/** Ensure the additive progress-card table inside the caller's write transaction. */
function ensureOpenClawAgentProgressCardSchemaInTransaction(db) {
	if (!db.isTransaction) throw new Error("progress-card schema ensure requires an active transaction");
	if (tableExists$2(db, "session_progress_cards")) return;
	db.exec(AGENT_PROGRESS_CARD_SCHEMA_SQL);
}
//#endregion
//#region src/state/openclaw-agent-session-transcript-archive-schema.ts
const SESSION_TRANSCRIPT_ARCHIVES_TABLE = "session_transcript_archives";
createSqliteSchemaEnsurer(() => extractSqliteTableSchema(OPENCLAW_AGENT_SCHEMA_SQL, SESSION_TRANSCRIPT_ARCHIVES_TABLE, {
	endMarker: "CREATE TABLE IF NOT EXISTS transcript_rewrite_watermarks (",
	includeEndMarker: false,
	errorMessage: "OpenClaw session transcript archive schema markers are missing."
}), {
	tables: [SESSION_TRANSCRIPT_ARCHIVES_TABLE, "session_transcript_cold_archives"],
	indexes: ["idx_agent_session_transcript_archives_pending", "idx_agent_session_transcript_archives_retention"]
});
//#endregion
//#region src/state/openclaw-agent-db-schema-compatibility.ts
const AGENT_SCHEMA_COMPATIBILITY = {
	allowCompatibleAdditiveColumns: true,
	allowedMissingTables: [
		"session_reactions",
		"memory_entry_origins",
		"memory_session_tombstones",
		MEMORY_INDEX_CHUNK_PROVENANCE_TABLE,
		MEMORY_INDEX_CHUNK_RECALL_METADATA_TABLE,
		CONTEXT_ENGINE_TURN_OUTBOX_TABLE,
		MESSAGE_TOOL_RUN_OUTCOMES_TABLE,
		SESSION_GOAL_OPERATIONS_TABLE,
		SESSION_PENDING_INPUTS_TABLE,
		SESSION_INPUT_COMPLETIONS_TABLE,
		SESSION_PARTICIPANTS_TABLE,
		SESSION_PROGRESS_CARDS_TABLE,
		SESSION_TRANSCRIPT_ARCHIVES_TABLE,
		"standing_intents",
		"standing_intents_fts",
		...[
			"standing_intents_fts_config",
			"standing_intents_fts_data",
			"standing_intents_fts_docsize",
			"standing_intents_fts_idx"
		]
	],
	allowedMissingColumns: [
		...STARTUP_ADDITIVE_AGENT_COLUMN_DEFINITIONS.map(({ columnName, tableName }) => `${tableName}.${columnName}`),
		"standing_intents.creator_sender",
		...FIRST_USE_ADDITIVE_AGENT_COLUMN_DEFINITIONS.map(({ columnName, tableName }) => `${tableName}.${columnName}`)
	],
	allowedColumnDefinitions: { "conversations.delivery_target": ["delivery_target TEXT NOT NULL DEFAULT ''"] },
	allowedMissingIndexes: [
		"idx_agent_transcript_context_pending",
		"idx_agent_session_nodes_label",
		"idx_agent_session_nodes_entry_not_valid"
	],
	optionalCanonicalTriggerGroups: [{
		tableName: "memory_index_chunks",
		triggers: MEMORY_CHUNK_FTS_TRIGGER_DEFINITIONS
	}, {
		tableName: MEMORY_INDEX_SOURCES_TABLE,
		triggers: MEMORY_PATH_FTS_TRIGGER_DEFINITIONS
	}]
};
//#endregion
//#region src/state/openclaw-agent-db-read-error.ts
const settledReadOpenFailures = resolveGlobalSingleton(Symbol.for("openclaw.agentDatabaseSettledReadOpenFailures"), () => /* @__PURE__ */ new WeakSet());
/** Only the native open owner can classify an unreadable store after successful cleanup. */
function recordOpenClawAgentDatabaseReadOpenFailure(error) {
	if (error !== null && typeof error === "object" && sqlitePrimaryResultCode(error) !== void 0) settledReadOpenFailures.add(error);
}
/** Record schema-owner facts after a failed query or admission, never infer them from error prose. */
function classifyOpenClawAgentDatabaseReadError(db, error) {
	try {
		const missingTables = collectSqliteSchemaIssues(db, OPENCLAW_AGENT_SCHEMA_SQL, AGENT_SCHEMA_COMPATIBILITY).filter((issue) => issue.code === "missing-table").map((issue) => issue.objectName);
		return missingTables.length > 0 ? new SessionMetadataUnavailableError("table-missing", { cause: error }, missingTables) : error;
	} catch {
		return error;
	}
}
//#endregion
//#region src/state/openclaw-agent-canonical-validation-schema.ts
const validationTables = /* @__PURE__ */ new Set([
	"session_nodes",
	"session_windows",
	"session_key_contract",
	"session_canonical_validation_pending"
]);
const definitionsSql = `SELECT name, sql FROM main.sqlite_schema
  WHERE name = 'session_canonical_validation_pending'
    OR (type = 'trigger' AND tbl_name IN (
      'session_nodes', 'session_windows', 'session_key_contract', 'session_canonical_validation_pending'
    ))`;
const validatedSchemas = resolveGlobalSingleton(Symbol.for("openclaw.agentCanonicalValidationSchemas"), () => /* @__PURE__ */ new WeakMap());
const expectedDefinitions = /* @__PURE__ */ new Map([["session_canonical_validation_pending", normalizeSchemaSql(extractSqliteTableSchema(OPENCLAW_AGENT_SCHEMA_SQL, "session_canonical_validation_pending"))]]);
function readDefinitions(database, schema) {
	const definitions = /* @__PURE__ */ new Map();
	const pending = "session_canonical_validation_pending";
	const rows = schema ? [...schema.tableSql.has(pending) ? [{
		name: pending,
		sql: schema.tableSql.get(pending)
	}] : [], ...Array.from(schema.triggers).flatMap(([name, trigger]) => name === pending || validationTables.has(trigger.table) ? [{
		name,
		sql: trigger.sql
	}] : [])] : database.prepare(definitionsSql).all();
	for (const row of rows) {
		if (typeof row.name !== "string" || typeof row.sql !== "string") throw new Error("Session canonical validation schema has an unreadable definition");
		definitions.set(row.name, normalizeSchemaSql(row.sql));
	}
	return definitions;
}
/** Require the canonical admission schema before consuming its pending work. */
function assertCanonicalSessionValidationSchema(database) {
	const schema = getAdmittedSqliteSchemaFacts(database);
	const cookie = schema?.schemaVersion ?? readSqliteSchemaCookie(database);
	if (typeof cookie !== "number") throw new Error("Session canonical validation schema version is unavailable");
	const cached = validatedSchemas.get(database);
	if (cached && (schema ? cached.schema === schema : !cached.schema && cached.cookie === cookie)) return;
	validatedSchemas.delete(database);
	const actual = readDefinitions(database, schema);
	for (const name of /* @__PURE__ */ new Set([...expectedDefinitions.keys(), ...actual.keys()])) if (expectedDefinitions.get(name) !== actual.get(name)) throw classifyOpenClawAgentDatabaseReadError(database, /* @__PURE__ */ new Error(`Session canonical validation schema is missing or drifted: ${name}; run openclaw doctor --fix with the compatible build.`));
	if (schema || !database.isTransaction) validatedSchemas.set(database, {
		cookie,
		schema
	});
}
/** Writable admission may carry this assertion from its validated physical sibling. */
function adoptCanonicalSessionValidationSchema(database) {
	const schema = getAdmittedSqliteSchemaFacts(database);
	if (!schema) throw new Error("Canonical schema handoff requires admitted schema facts");
	validatedSchemas.set(database, {
		cookie: schema.schemaVersion,
		schema
	});
}
/** The schema owner installs the pending queue before seeding imported keys. */
function canonicalSessionValidationSchemaSql(schema = OPENCLAW_AGENT_SCHEMA_SQL) {
	return extractSqliteTableSchema(schema, "session_canonical_validation_pending", {
		endMarker: "CREATE TABLE IF NOT EXISTS conversations (",
		includeEndMarker: false
	});
}
/** Historical migration preflights cannot require the schema-21 validation projection. */
function withoutCanonicalSessionValidationSchema(schema) {
	if (!schema.includes("CREATE TABLE IF NOT EXISTS session_canonical_validation_pending (")) return schema;
	return schema.replace(canonicalSessionValidationSchemaSql(schema), "");
}
//#endregion
//#region src/state/openclaw-agent-canonical-validation-receipt.ts
const canonicalReceiptAdmission = {
	name: "agent.canonical-validation-receipt",
	schemaDependent: true,
	read: (value) => value === null || typeof value === "string" ? value : void 0
};
function hasReceiptColumn(db) {
	const { tableName, columnName } = CANONICAL_READY_COLUMN_DEFINITION;
	return tableHasColumn(db, tableName, columnName);
}
function physicalReceipt(database) {
	const physical = findOpenClawAgentDatabaseIdentity(database);
	if (!physical || typeof physical.identity !== "string") return;
	return JSON.stringify([
		1,
		database.agentId,
		physical.identity,
		physical.birthtime
	]);
}
/** Canonical proof follows this file generation; it never certifies physical integrity. */
function hasPersistedOpenClawAgentCanonicalValidation(database) {
	const receipt = physicalReceipt(database);
	return receipt !== void 0 && getSqliteDatabaseAdmission(database.db, canonicalReceiptAdmission) === receipt;
}
/** Schema admission and worker read-open load proof; runtime misses use canonical validation. */
function loadOpenClawAgentCanonicalValidationReceipt(database) {
	const receipt = physicalReceipt(database);
	if (!receipt) return false;
	let persisted = getSqliteDatabaseAdmission(database.db, canonicalReceiptAdmission);
	if (persisted === void 0) {
		if (!hasReceiptColumn(database.db)) return false;
		assertCanonicalSessionValidationSchema(database.db);
		persisted = executeSqliteQueryTakeFirstSync(database.db, getNodeSqliteKysely(database.db).selectFrom("session_key_contract").select("canonical_ready").where("id", "=", 1))?.canonical_ready ?? null;
		publishSqliteDatabaseAdmission(database.db, canonicalReceiptAdmission, persisted);
	}
	return persisted === receipt;
}
//#endregion
//#region src/state/openclaw-agent-db-validation-facts.ts
const agentDatabaseValidationKey = {
	name: "agent.completed-validation",
	read(value) {
		return isRecord(value) ? value : void 0;
	}
};
function createOpenClawAgentDatabaseValidationReceipt(database, canonicalReady) {
	const { identity, birthtime } = readOpenClawAgentDatabaseIdentity(database);
	if (typeof identity !== "string" || birthtime === void 0) throw new Error("Only persistent agent databases retain integrity validation");
	const validation = {
		agentId: database.agentId,
		identity,
		birthtime,
		receiptId: randomUUID(),
		integrityVerifiedAt: readSqliteDatabaseIntegrityVerification(database.db)?.verifiedAt,
		valid: new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT),
		canonicalReady: new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT)
	};
	if (canonicalReady) Atomics.store(new Int32Array(validation.canonicalReady), 0, 1);
	Atomics.store(new Int32Array(validation.valid), 0, 1);
	return validation;
}
//#endregion
//#region src/state/openclaw-agent-db-validation-cache.ts
const validatedPaths = resolveGlobalSingleton(Symbol.for("openclaw.agentDatabaseValidatedPaths"), () => /* @__PURE__ */ new Map(), () => clearOpenClawAgentDatabaseValidationCache());
const validationObservations = resolveGlobalSingleton(Symbol.for("openclaw.agentDatabaseValidationObservations"), () => /* @__PURE__ */ new Map());
function releaseValidationObservation(pathname) {
	validationObservations.get(pathname)?.close();
}
const validationBindings = resolveGlobalSingleton(Symbol.for("openclaw.agentDatabaseValidationBindings"), () => /* @__PURE__ */ new WeakMap());
function bindValidationLifetime(database, validation) {
	const current = validationBindings.get(database.db);
	if (!database.db.isOpen || current?.validation === validation) return;
	current?.unregister();
	const key = readOpenClawAgentDatabaseIdentity(database).canonicalPath;
	const unobserve = registerSqliteSchemaMutationListener(database.db, (observed) => {
		const revoke = (schema) => {
			if (schema && (!observed || schema.facts.schemaVersion !== observed.schemaVersion || schema.facts.userVersion !== observed.userVersion)) Atomics.store(new Int32Array(schema.valid), 0, 0);
		};
		revoke(validation.schema);
		const published = validatedPaths.get(key)?.validation;
		if (published?.schema && published.agentId === validation.agentId && published.identity === validation.identity) revoke(published.schema);
	});
	const unregister = registerNodeSqliteDisposeCallback(database.db, (reason) => {
		if (reason === "replace") Atomics.store(new Int32Array(validation.valid), 0, 0);
		validationBindings.delete(database.db);
		unobserve();
		unregister();
	});
	validationBindings.set(database.db, {
		validation,
		unregister: () => {
			unobserve();
			unregister();
		}
	});
}
/** Consume only a live physical owner's schema proof at connection admission. */
function adoptOpenClawAgentDatabaseSchema(database, reuseIntegrity = true, required = false) {
	const validation = getOpenClawAgentDatabaseValidation(database);
	const schema = validation?.schema;
	const admitted = reuseIntegrity && schema && !database.db.isTransaction ? getAdmittedSqliteSchemaFacts(database.db) : void 0;
	const adopted = Boolean(reuseIntegrity && schema && Atomics.load(new Int32Array(schema.valid), 0) === 1 && (admitted?.schemaVersion === schema.facts.schemaVersion && admitted.userVersion === schema.facts.userVersion || adoptSqliteSchemaFacts(database.db, schema.facts)) && Atomics.load(new Int32Array(schema.valid), 0) === 1);
	if (required && !adopted) throw new Error("Agent schema admission changed before handle adoption; retry the operation");
	if (adopted) {
		adoptCanonicalSessionValidationSchema(database.db);
		if (validation?.integrityVerifiedAt !== void 0) {
			if (readSqliteDatabaseIntegrityVerification(database.db) === void 0) recordSqliteDatabaseIntegrity(database.db, validation.integrityVerifiedAt);
			if (getSqliteDatabaseAdmission(database.db, agentDatabaseValidationKey)?.receiptId !== validation.receiptId) publishSqliteDatabaseAdmission(database.db, agentDatabaseValidationKey, validation);
		}
	}
	return adopted;
}
function matchesValidation(database, validation) {
	return validation.agentId === database.agentId && validation.identity === findOpenClawAgentDatabaseIdentity(database)?.identity && validation.birthtime === findOpenClawAgentDatabaseIdentity(database)?.birthtime && Atomics.load(new Int32Array(validation.valid), 0) === 1;
}
function hasRevokedOpenClawAgentDatabaseValidation(pathname, received) {
	const previous = validatedPaths.get(resolveDatabasePathKey(pathname));
	return received !== void 0 && Atomics.load(new Int32Array(received.valid), 0) !== 1 || previous?.revoked === true || previous?.validation !== void 0 && Atomics.load(new Int32Array(previous.validation.valid), 0) !== 1;
}
function getOpenClawAgentDatabaseValidation(database) {
	const pathname = readOpenClawAgentDatabaseIdentity(database).canonicalPath;
	let entry = validatedPaths.get(pathname);
	if (entry?.revoked) return;
	if (!entry?.integrityVerified || !entry.validation || entry.validation.schema && Atomics.load(new Int32Array(entry.validation.schema.valid), 0) !== 1 || !matchesValidation(database, entry.validation)) {
		const validation = getSqliteDatabaseAdmission(database.db, agentDatabaseValidationKey);
		if (validation && matchesValidation(database, validation)) {
			if (entry && (entry.agentId === void 0 || entry.agentId === database.agentId) && (!entry.validation || matchesValidation(database, entry.validation))) {
				entry.agentId = database.agentId;
				if (entry.validation && entry.validation.receiptId === validation.receiptId) entry.validation.schema = validation.schema;
				else entry.validation = validation;
				entry.integrityVerified = true;
			} else {
				entry = {
					agentId: database.agentId,
					validation,
					integrityVerified: true
				};
				validatedPaths.set(pathname, entry);
			}
		}
	}
	if (!entry?.integrityVerified || !entry.validation || !matchesValidation(database, entry.validation)) return;
	bindValidationLifetime(database, entry.validation);
	return entry.validation;
}
/** The receiving opener must adopt this proof against its own physical file identity. */
function getOpenClawAgentDatabaseValidationForTransfer(database) {
	const pathname = validatedPaths.has(database.path) ? database.path : resolveDatabasePathKey(database.path);
	const entry = validatedPaths.get(pathname);
	if (!entry?.integrityVerified || entry.validation?.agentId !== database.agentId || Atomics.load(new Int32Array(entry.validation.valid), 0) !== 1) return;
	return entry.validation;
}
/** Retire a replaced file's proof before capturing its successor's publication guard. */
function retireReplacedAgentValidation(agentId, pathname, expectedIdentity) {
	if (!expectedIdentity) return;
	const retainedValidation = getOpenClawAgentDatabaseValidationForTransfer({
		agentId,
		path: pathname
	});
	if (retainedValidation && retainedValidation.identity !== expectedIdentity.physicalIdentity) invalidateOpenClawAgentDatabaseValidation(pathname, retainedValidation.identity);
}
function captureValidationTransfer(database, schemaRequired) {
	const pathname = resolveDatabasePathKey(database.path);
	const existing = validatedPaths.get(pathname);
	const captured = existing?.agentId === database.agentId ? existing : {
		...existing,
		agentId: database.agentId,
		integrityVerified: existing?.integrityVerified ?? false
	};
	validatedPaths.set(pathname, captured);
	const capturedValidation = captured.validation;
	const wasValid = capturedValidation ? Atomics.load(new Int32Array(capturedValidation.valid), 0) : void 0;
	return (identity, value) => {
		const received = agentDatabaseValidationKey.read(value);
		if (!received || received.agentId !== database.agentId || received.identity !== identity || typeof received.birthtime !== "string" || typeof received.receiptId !== "string" || received.receiptId.length === 0) return "invalid";
		const schema = received.schema;
		const valid = Atomics.load(new Int32Array(received.valid), 0);
		const schemaValid = schema && Atomics.load(new Int32Array(schema.valid), 0);
		if (valid !== 0 && valid !== 1 || schemaRequired && (!schema || schemaValid !== 0 && schemaValid !== 1)) return "invalid";
		if (schemaRequired && schemaValid !== 1 || validatedPaths.get(pathname) !== captured || capturedValidation && wasValid === 1 && Atomics.load(new Int32Array(capturedValidation.valid), 0) !== 1 || captured.validation !== capturedValidation && captured.validation && (captured.validation.identity !== identity || Atomics.load(new Int32Array(captured.validation.valid), 0) !== 1) || Atomics.load(new Int32Array(received.valid), 0) !== 1) {
			if (schemaRequired && validatedPaths.get(pathname)?.revoked) Atomics.store(new Int32Array(received.valid), 0, 0);
			return "stale";
		}
		if (captured.integrityVerified && captured.validation?.agentId === database.agentId && captured.validation.identity === identity && captured.validation.birthtime === received.birthtime && Atomics.load(new Int32Array(captured.validation.valid), 0) === 1) {
			const currentSchema = captured.validation.schema;
			if (currentSchema && schema && schemaValid === 1 && Atomics.load(new Int32Array(currentSchema.valid), 0) === 1 && currentSchema.facts.schemaVersion === schema.facts.schemaVersion && currentSchema.facts.userVersion === schema.facts.userVersion) return "accepted";
			if (currentSchema) Atomics.store(new Int32Array(currentSchema.valid), 0, 0);
			captured.validation.schema = schema;
			return "accepted";
		}
		if (hasRevokedOpenClawAgentDatabaseValidation(pathname)) Atomics.store(new Int32Array(received.canonicalReady), 0, 0);
		const aliases = captured.validation?.identity === identity ? [...validatedPaths].flatMap(([candidate, entry]) => entry.validation?.agentId === database.agentId && entry.validation.identity === identity ? [candidate] : []) : [];
		if (wasValid !== 0) invalidateOpenClawAgentDatabaseValidation(pathname);
		else for (const alias of aliases) {
			const superseded = validatedPaths.get(alias)?.validation;
			if (superseded && superseded.receiptId !== received.receiptId) Atomics.store(new Int32Array(superseded.valid), 0, 0);
		}
		validatedPaths.set(pathname, {
			validation: received,
			integrityVerified: true
		});
		for (const alias of aliases) validatedPaths.set(alias, {
			validation: received,
			integrityVerified: true
		});
		return "accepted";
	};
}
/** An admitted runtime acquisition must receive a current schema, never fall back to host scans. */
function captureOpenClawAgentDatabaseAdmissionPublication(database) {
	const receive = captureValidationTransfer(database, true);
	return (identity, received) => {
		const result = receive(identity, received);
		if (result === "invalid") throw new AgentDatabaseSchemaAdmissionInvalidError();
		const schema = getOpenClawAgentDatabaseValidationForTransfer(database)?.schema;
		if (result === "stale" || !schema || Atomics.load(new Int32Array(schema.valid), 0) !== 1) throw new AgentDatabaseSchemaAdmissionChangedError();
	};
}
/** An alias may consume the exact acknowledged physical receipt without revoking it again. */
function captureOpenClawAgentDatabaseAliasPublication(database) {
	const publish = captureOpenClawAgentDatabaseAdmissionPublication(database);
	return (identity, received) => {
		const current = getOpenClawAgentDatabaseValidationForTransfer(database);
		if (isRecord(received) && received.agentId === database.agentId && received.identity === identity && current?.identity === identity && typeof received.receiptId === "string" && received.receiptId.length > 0 && current.receiptId === received.receiptId && current.valid === received.valid && current.schema && isRecord(received.schema) && current.schema.valid === received.schema.valid && Atomics.load(new Int32Array(current.schema.valid), 0) === 1) return;
		publish(identity, received);
	};
}
function canonicalValidationReceipt(database) {
	const pathname = findOpenClawAgentDatabaseIdentity(database)?.canonicalPath;
	if (!database.db.isOpen || !pathname) return;
	const validation = validatedPaths.get(pathname)?.validation;
	if (!validation || !matchesValidation({
		...database,
		path: pathname
	}, validation)) return;
	bindValidationLifetime({
		...database,
		path: pathname
	}, validation);
	return validation;
}
/** A clean pending table needs proof from this admitted physical generation. */
function hasOpenClawAgentCanonicalValidation(database) {
	const validation = canonicalValidationReceipt(database);
	if (validation) return Atomics.load(new Int32Array(validation.canonicalReady), 0) === 1 && Atomics.load(new Int32Array(validation.valid), 0) === 1;
	const pathname = findOpenClawAgentDatabaseIdentity(database)?.canonicalPath;
	if (!pathname || database.db.isTransaction || validatedPaths.get(pathname)?.validation !== void 0 || hasRevokedOpenClawAgentDatabaseValidation(pathname) || !hasPersistedOpenClawAgentCanonicalValidation(database)) return false;
	const canonical = createOpenClawAgentDatabaseValidationReceipt(database, true);
	const entry = validatedPaths.get(pathname) ?? { integrityVerified: false };
	entry.validation = canonical;
	validatedPaths.set(pathname, entry);
	bindValidationLifetime({
		...database,
		path: pathname
	}, canonical);
	return true;
}
/** Publish successful canonical proof only when its outer transaction has committed. */
function markOpenClawAgentCanonicalValidation(database) {
	const validation = canonicalValidationReceipt(database);
	if (!validation) return false;
	const publish = () => {
		if (Atomics.load(new Int32Array(validation.valid), 0) === 1) Atomics.store(new Int32Array(validation.canonicalReady), 0, 1);
	};
	if (database.db.isTransaction) return stageSqliteTransactionState(database.db, {
		stage: () => {},
		rollback: () => {},
		commit: publish
	});
	publish();
	return Atomics.load(new Int32Array(validation.valid), 0) === 1;
}
function adoptOpenClawAgentDatabaseValidation(database, validation) {
	if (!matchesValidation(database, validation)) return false;
	if (getOpenClawAgentDatabaseValidation(database)) return true;
	const pathname = readOpenClawAgentDatabaseIdentity(database).canonicalPath;
	if (hasRevokedOpenClawAgentDatabaseValidation(pathname)) Atomics.store(new Int32Array(validation.canonicalReady), 0, 0);
	invalidateOpenClawAgentDatabaseValidation(pathname);
	validatedPaths.set(pathname, {
		validation,
		integrityVerified: true
	});
	bindValidationLifetime(database, validation);
	return true;
}
function isOpenClawAgentCanonicalStoreEmpty(database) {
	if (database.db.isTransaction || (getAdmittedSqliteSchemaFacts(database.db)?.userVersion ?? readSqliteUserVersion(database.db)) < 21) return false;
	assertCanonicalSessionValidationSchema(database.db);
	return database.db.prepare(`SELECT
    EXISTS(SELECT 1 FROM session_nodes) OR
    EXISTS(SELECT 1 FROM session_canonical_validation_pending) AS populated`).get()?.populated === 0;
}
function setOpenClawAgentDatabaseValidation(database) {
	const pathname = readOpenClawAgentDatabaseIdentity(database).canonicalPath;
	const revoked = hasRevokedOpenClawAgentDatabaseValidation(pathname);
	let validation = createOpenClawAgentDatabaseValidationReceipt(database, isOpenClawAgentCanonicalStoreEmpty(database) || !revoked && !database.db.isTransaction && loadOpenClawAgentCanonicalValidationReceipt(database));
	const entry = validatedPaths.get(pathname);
	if (!revoked && entry && (entry.agentId === void 0 || entry.agentId === database.agentId) && (!entry.validation || matchesValidation(database, entry.validation))) {
		if (entry.validation) {
			if (validation.integrityVerifiedAt !== void 0) entry.validation.integrityVerifiedAt = validation.integrityVerifiedAt;
			Atomics.store(new Int32Array(entry.validation.canonicalReady), 0, Atomics.load(new Int32Array(validation.canonicalReady), 0));
			validation = entry.validation;
		}
		entry.validation = validation;
		entry.integrityVerified = true;
	} else {
		invalidateOpenClawAgentDatabaseValidation(pathname);
		validatedPaths.set(pathname, {
			validation,
			integrityVerified: true
		});
	}
	bindValidationLifetime(database, validation);
	publishOpenClawAgentDatabaseSchema(database);
	return validation;
}
/** The open/migration owner calls this only after complete canonical schema validation. */
function publishOpenClawAgentDatabaseSchema(database) {
	const validation = getOpenClawAgentDatabaseValidation(database);
	const facts = getAdmittedSqliteSchemaFacts(database.db);
	if (validation && facts && !database.db.isTransaction) {
		let valid = validation.schema?.valid;
		if (!valid || Atomics.load(new Int32Array(valid), 0) !== 1) {
			valid = new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT);
			Atomics.store(new Int32Array(valid), 0, 1);
		}
		validation.schema = {
			facts,
			valid
		};
		publishSqliteDatabaseAdmission(database.db, agentDatabaseValidationKey, validation);
	}
}
function invalidateOpenClawAgentDatabaseValidation(pathname, identity = validatedPaths.get(resolveDatabasePathKey(pathname))?.validation?.identity) {
	const resolved = resolveDatabasePathKey(pathname);
	const paths = /* @__PURE__ */ new Set([resolved]);
	if (identity) {
		for (const [candidate, entry] of validatedPaths) if (entry.validation?.identity === identity) paths.add(candidate);
	}
	for (const candidate of paths) {
		releaseValidationObservation(candidate);
		const entry = validatedPaths.get(candidate);
		const validation = entry?.validation;
		if (validation) Atomics.store(new Int32Array(validation.valid), 0, 0);
		validatedPaths.set(candidate, {
			agentId: entry?.agentId,
			validation,
			integrityVerified: false,
			revoked: true
		});
	}
}
function clearOpenClawAgentDatabaseValidationCache(rootPath) {
	const rootKey = rootPath === void 0 ? void 0 : resolveDatabasePathKey(rootPath);
	for (const pathname of validatedPaths.keys()) if (rootKey === void 0 || isPathInside(rootKey, pathname)) {
		invalidateOpenClawAgentDatabaseValidation(pathname);
		validatedPaths.delete(pathname);
	}
}
//#endregion
//#region src/cli/quote-cli-arg.ts
function quotePowerShellArg(value) {
	return `'${value.replace(/['‘-‛]/gu, "$&$&")}'`;
}
function quoteCliArg(value) {
	if (/^[A-Za-z0-9_/:=.,@%+-]+$/.test(value)) return value;
	return `'${value.replaceAll("'", "'\\''")}'`;
}
//#endregion
//#region src/infra/sqlite-recovery-files.ts
/** Offline SQLite recovery preserves journals before moving the main pathname. */
function planSqliteRecoveryMoves(sourcePaths) {
	const timestampSuffix = `.corrupt-${Date.now()}`;
	for (let attempt = 0; attempt < 100; attempt += 1) {
		const suffix = attempt === 0 ? timestampSuffix : `${timestampSuffix}.${attempt}`;
		const moves = sourcePaths.map((sourcePath) => ({
			destinationPath: `${sourcePath}${suffix}`,
			sourcePath
		}));
		if (moves.every((move) => !fs.lstatSync(move.destinationPath, { throwIfNoEntry: false }))) return moves;
	}
	throw new Error(`Could not choose recovery paths for ${sourcePaths[0] ?? "SQLite files"}`);
}
//#endregion
//#region src/infra/state-migrations.agent-owner-guidance.ts
function formatAgentDatabaseCorruptionRepairHint(agentId, error) {
	if (formatSqliteReadOnlyInspectionFailure(error).includes("creating its private snapshot:")) return;
	if (!collectNestedErrorCandidates(error).some((candidate) => isSqliteCorruptionError(candidate) || ["SQLITE_CORRUPT", "SQLITE_NOTADB"].includes(sqliteErrorCode(candidate) ?? "") || candidate instanceof Error && isTerminalSqliteIntegrityError(candidate))) return;
	return `Stop the Gateway, back up this database and its SQLite sidecars, then run "${formatCliCommand(`openclaw doctor --session-sqlite recover --session-sqlite-agent ${quoteCliArg(agentId)}`)}" against the same state/config. Recovery repairs supported index corruption or preserves damaged files with a .corrupt-<timestamp> suffix. Restore a verified backup if you need the previous sessions, then restart the Gateway.`;
}
function formatAgentDatabaseOwnershipRepairHint(pathname) {
	const moves = planSqliteRecoveryMoves(resolveSqliteDatabaseFilePaths(pathname).filter((file) => fs.lstatSync(file, { throwIfNoEntry: false })));
	moves.sort((a, b) => Number(a.sourcePath === pathname) - Number(b.sourcePath === pathname));
	const action = moves.map(({ sourcePath, destinationPath }) => process.platform === "win32" ? `Move-Item -LiteralPath ${quotePowerShellArg(sourcePath)} -Destination ${quotePowerShellArg(destinationPath)} -ErrorAction Stop` : `mv -n -- ${quoteCliArg(sourcePath)} ${quoteCliArg(destinationPath)}`).join(process.platform === "win32" ? "; " : " && ");
	return `Preserve and inspect this database before accepting a fresh agent. With all OpenClaw processes stopped, the explicit quarantine move is${process.platform === "win32" ? " (PowerShell)" : ""}:\n${action}\nThen run openclaw doctor --fix and restart the Gateway.`;
}
//#endregion
//#region src/state/agent-database-admission.ts
const refusalCauses = /* @__PURE__ */ new WeakMap();
const refusalsByState = /* @__PURE__ */ new Map();
const startupFtsRepairs = /* @__PURE__ */ new Map();
function recordAgentDatabaseStartupFtsRepair(key, statePath, message) {
	if (message === void 0 && startupFtsRepairs.has(key)) throw new Error("Startup FTS repair was already attempted. Run openclaw doctor --fix.");
	startupFtsRepairs.set(key, {
		statePath,
		message
	});
	if (message) createSubsystemLogger("state/agent-db").warn(message);
}
const preparation = new AsyncLocalStorage();
function createAgentDatabaseInspectionRefusal(params) {
	const candidateSnapshotCapacity = resolveUpdateRehearsalRoot(process.env) && params.reason.includes("creating its private snapshot:") && /(?:code=(?:ENOSPC|EDQUOT)\b|errcode=13\b)/u.test(params.reason);
	const locked = !params.pending && isSqliteLockError(params.cause);
	const refusal = {
		agentId: params.agentId,
		paths: params.paths,
		code: params.pending ? "agent-database-inspection-pending" : "agent-database-inspection-failed",
		reason: locked ? "database locked by another process" : params.reason,
		repairHint: locked ? "Close other processes accessing this database, then restart the Gateway to retry admission. Lock contention does not require database repair." : candidateSnapshotCapacity ? "Free space in the reported snapshot cache, then retry the update. This candidate snapshot failure does not require repairing the serving database." : params.pending ? "Sessions remain unavailable until background inspection and preparation finish. If they cannot complete, stop the Gateway, run \"openclaw doctor --fix\", and restart." : `Sessions remain unavailable. ${formatAgentDatabaseCorruptionRepairHint(params.agentId, params.cause) ?? "Stop the Gateway, run \"openclaw doctor --fix\" to inspect and repair this agent database, and restart."}`
	};
	refusalCauses.set(refusal, params.cause);
	return refusal;
}
function stateKey(options) {
	return resolveOpenClawStateSqlitePath(options.env ?? process.env);
}
function sameKnownState(left, right) {
	if (left === right) return true;
	const leftIdentity = openClawStateDatabaseCache.getKnownOpenClawStateDatabaseIdentity(left);
	const rightIdentity = openClawStateDatabaseCache.getKnownOpenClawStateDatabaseIdentity(right);
	return Boolean(leftIdentity && rightIdentity && leftIdentity.key === rightIdentity.key);
}
/** Capture only the live preparation whose native command must report fresh journal facts. */
function captureAgentDatabasePreparationJournal(agentId, options = {}) {
	const scope = preparation.getStore();
	if (!scope || scope.refusal.agentId !== normalizeAgentId(agentId) || !sameKnownState(scope.key, stateKey(options))) return;
	const assertCurrent = () => {
		if (!scope.active) throw new Error(`Agent database preparation has ended: ${agentId}`);
		scope.assertCurrent();
	};
	assertCurrent();
	return (present) => {
		assertCurrent();
		if (present !== false) throw new Error(`Agent ${scope.refusal.agentId} was deleted during startup inspection`);
	};
}
/** Ownership is derived from the inspected file; missing or corrupt metadata keeps normal refusal. */
function inspectAgentDatabaseAdmission(params) {
	const agentId = normalizeAgentId(params.agentId);
	const owner = params.metadata;
	if (owner?.role !== "agent" || !owner.agentId || owner.agentId === agentId) return;
	return {
		agentId,
		paths: [params.path],
		embeddedOwnerId: owner.agentId,
		code: "agent-database-ownership-mismatch",
		reason: `Refused agent ${agentId}: database ${params.path} belongs to agent ${owner.agentId}; requested agent ${agentId}.`,
		repairHint: formatAgentDatabaseOwnershipRepairHint(params.path)
	};
}
function canIsolateAgentDatabase(config, agentId) {
	return listAgentIds(config).includes(agentId) && !isReservedSystemAgentId(agentId) && agentId !== tryResolveAmbientOwnerAgentId(config) && agentId !== tryResolveLegacyCompatibilityAgentId(config);
}
function readAgentDatabaseAdmissionRefusal(agentId, options = {}) {
	return readSelectedAgentDatabaseAdmissionRefusal(stateKey(options), normalizeAgentId(agentId), agentId);
}
function readSelectedAgentDatabaseAdmissionRefusal(key, agentId, requestedAgentId) {
	const refusal = refusalsByState.get(key)?.refusals.get(agentId);
	const scope = preparation.getStore();
	if (scope && scope.key === key && scope.refusal.agentId === agentId) {
		if (!scope.active) throw new Error(`Agent database preparation has ended: ${requestedAgentId}`);
		scope.assertCurrent();
		if (scope.refusal === refusal) return;
	}
	return refusal;
}
var AgentDatabaseAdmissionError = class extends Error {
	constructor(refusal) {
		super(`Agent ${refusal.agentId} (${refusal.paths.join(", ")}): ${refusal.reason}\n${refusal.repairHint}`, { cause: refusalCauses.get(refusal) });
		this.refusal = refusal;
		this.name = "AgentDatabaseAdmissionError";
	}
};
function assertAgentDatabaseAdmitted(agentId, options = {}) {
	const refusal = readAgentDatabaseAdmissionRefusal(agentId, options);
	if (refusal) throw new AgentDatabaseAdmissionError(refusal);
}
/** Capture only the selector; refusal decisions and the caller's preparation remain live. */
function captureAgentDatabaseAdmission(agentId, options = {}) {
	const key = stateKey(options);
	const normalizedAgentId = normalizeAgentId(agentId);
	return () => {
		const refusal = readSelectedAgentDatabaseAdmissionRefusal(key, normalizedAgentId, agentId);
		if (refusal) throw new AgentDatabaseAdmissionError(refusal);
	};
}
createSubsystemLogger("gateway/admission");
resolveGlobalSingleton(Symbol.for("openclaw.gatewayReloadWaitingRoots"), () => new AsyncLocalStorage());
function createShutdownCleanupController() {
	const controller = new AbortController();
	setMaxListeners(0, controller.signal);
	return controller;
}
const GATEWAY_WORK_ADMISSION_STATE = resolveGlobalSingleton(Symbol.for("openclaw.gatewayWorkAdmissionState"), () => ({
	restartDrainReason: void 0,
	restartDrainController: new AbortController(),
	shutdownCleanupController: createShutdownCleanupController(),
	restartSignalPending: false,
	restartSignalGeneration: 0,
	suspendPhase: "accepting",
	suspendGeneration: 0,
	activeRootWork: /* @__PURE__ */ new Set(),
	currentRootWork: new AsyncLocalStorage(),
	suspendOpenWaiters: /* @__PURE__ */ new Set(),
	suspendListeners: /* @__PURE__ */ new Set()
}));
function getGatewayRestartDrainSignal() {
	return GATEWAY_WORK_ADMISSION_STATE.restartDrainController.signal;
}
/** Grace has settled; release idle retention without revoking accepted cleanup work. */
function getGatewayShutdownCleanupSignal() {
	return GATEWAY_WORK_ADMISSION_STATE.shutdownCleanupController.signal;
}
//#endregion
//#region src/infra/update-doctor-migration-attribution.ts
const captures = new AsyncLocalStorage();
/** Raw descriptors stay in the child even while our native writer holds exclusion. */
function readUpdateDoctorGeneration(pathname) {
	const value = JSON.parse(runSqliteReadOnlyWorkerSync(pathname, void 0, "update-generation"));
	if (!value || typeof value !== "object" || !("generation" in value)) throw new Error("Database generation child returned an invalid observation.");
	const generation = value.generation;
	const emptyReaderAlternate = "emptyReaderAlternate" in value ? value.emptyReaderAlternate : void 0;
	if (generation !== null && (typeof generation !== "string" || !/^[a-f0-9]{64}$/u.test(generation)) || emptyReaderAlternate !== void 0 && (typeof emptyReaderAlternate !== "string" || !/^[a-f0-9]{64}$/u.test(emptyReaderAlternate))) throw new Error("Database generation child returned an invalid observation.");
	return {
		generation,
		...emptyReaderAlternate !== void 0 ? { emptyReaderAlternate } : {}
	};
}
/** Only a one-shot existing ledger writer opts in. Ordinary Doctor writes remain unknown. */
function runUpdateDoctorAttributedStateWrite(db, pathname, operation, close) {
	const capture = captures.getStore();
	if (!capture) throw new Error("Attributed update write requires its original Doctor capture.");
	try {
		const maintenance = getOpenClawDatabaseMaintenanceScope();
		if (!maintenance?.ownsSchemaMaintenance) throw new Error("Attributed update write requires schema maintenance custody.");
		const assertCurrent = () => {
			maintenance.assertAdmission();
			assertStateDatabaseAccessAllowed(pathname);
			capture.assertCurrent();
		};
		assertCurrent();
		const expected = capture.expected(pathname);
		if (typeof expected !== "string" || db.isTransaction) throw new Error("Attributed update write requires an existing captured source and settled writer.");
		const identity = fs.lstatSync(pathname);
		const before = readUpdateDoctorGeneration(pathname);
		assertCurrent();
		if (before.generation !== expected && before.emptyReaderAlternate !== expected) throw new Error("SQLite receipt source changed after update capture.");
		readSqliteSchemaCookie(db);
		beginSqliteConnectionExclusion(db);
		db.exec("ROLLBACK");
		const locked = readUpdateDoctorGeneration(pathname);
		assertCurrent();
		if (locked.generation !== before.generation && locked.emptyReaderAlternate !== before.generation) throw new Error("SQLite receipt source changed before native exclusion.");
		const value = operation();
		if (isPromiseLike(value) || db.isTransaction) throw new Error("Attributed update write must commit synchronously.");
		assertCurrent();
		truncateSqliteWal(db, pathname);
		try {
			close();
		} catch (error) {
			throw new SqliteCoordinatorError("Receipt writer cleanup failed", error);
		}
		const after = readUpdateDoctorGeneration(pathname);
		assertCurrent();
		const currentIdentity = fs.lstatSync(pathname);
		if (after.generation === null || identity.dev !== currentIdentity.dev || identity.ino !== currentIdentity.ino) throw new Error("Receipt source was replaced during publication.");
		capture.accept(pathname, expected, after.generation);
		return value;
	} catch (error) {
		capture.refuse("Predecessor stop receipt publication could not be verified.");
		throw error;
	}
}
//#endregion
//#region src/state/openclaw-state-db-existing-write.ts
function assertExistingOpenClawStateSchemaMetadata(db, pathname, version) {
	const metadata = assertOpenClawStateDatabaseOwner(db, { pathname });
	if (version < 1 || metadata?.schema_version !== version) throw new Error("Existing-state schema metadata is inconsistent.");
}
/** Validate only the stable storage subset used by an existing-schema owner.
* This read neither repairs nor grants write authority; callers retain their
* actual handle, generation, lease and publication checks. */
function assertExistingOpenClawStateSchema(db, pathname, schemaSql, compatibility) {
	const version = assertSupportedStateSchemaVersion(db, pathname);
	assertExistingOpenClawStateSchemaMetadata(db, pathname, version);
	assertStateDatabaseIntegrityOnce(db, pathname);
	assertSqliteSchemaContains(db, pathname, schemaSql, compatibility);
	return version;
}
/** A synchronous write to an already-compatible, caller-owned schema subset.
* No database bootstrap, schema repair, journal-mode setup, cached publication or WAL timer.
* First-use owners may install their declared additive tables; existing objects
* must already match. This never opens or migrates the full runtime schema.
* The admitted native connection owns transaction serialization.
*/
function runExistingOpenClawStateWriteTransaction(operation, options, contract) {
	const prepared = prepareExistingOpenClawStateWriter(options, contract);
	const write = () => {
		const writer = createExistingOpenClawStateWriter(prepared, contract);
		return runWithSqliteCleanup({ release: writer.close }, "Existing-state write", () => writer.run(operation, options));
	};
	return contract.recoverTaskDeliveryOrphans ? withStateDatabaseSchemaMaintenance({ databasePath: prepared.pathname }, write) : write();
}
function prepareExistingOpenClawStateWriter(options, contract) {
	if (options.database || options.readOnly) throw new Error("Existing-state writes require their own tracked writable connection.");
	const env = options.env ?? process.env;
	const pathname = resolveDatabasePath({
		path: options.path,
		env
	});
	isExistingOpenClawStateSchema(pathname);
	if (contract.recoverTaskDeliveryOrphans) assertOpenClawStateSchemaRepairAllowed(pathname);
	const original = fs.lstatSync(pathname);
	if (!original.isFile()) throw new Error("Existing-state write requires a regular database file.");
	return {
		env,
		pathname,
		original
	};
}
function createExistingOpenClawStateWriter({ env, pathname, original }, contract) {
	const assertSameFile = () => {
		const current = fs.lstatSync(pathname);
		if (!current.isFile() || current.dev !== original.dev || current.ino !== original.ino) throw new Error("Existing-state database generation changed.");
	};
	assertSameFile();
	openClawStateDatabaseCache.assertOpenClawStateDatabaseFreshOpenAllowedAtPath(pathname, env);
	const db = openTrackedStateDatabase(pathname, {
		existingOnly: true,
		...contract.recoverTaskDeliveryOrphans ? { enableForeignKeyConstraints: false } : {}
	});
	const admission = createStateSchemaAdmission(`state.subset:${createHash("sha256").update(JSON.stringify([contract.schemaSql, contract.schemaCompatibility])).digest("hex")}`, (value) => typeof value === "number" ? value : void 0);
	const ensureAdditiveSchema = contract.initializeAdditiveSchema ? createSqliteSchemaEnsurer(() => contract.schemaSql, {
		tables: getCanonicalSqliteTableNames(contract.schemaSql),
		indexes: getCanonicalSqliteNamedIndexContracts(contract.schemaSql).map(({ name }) => name)
	}) : void 0;
	let closed = false;
	const close = () => {
		closed = true;
		if (!db.isOpen) return;
		clearNodeSqliteKyselyCacheForDatabase(db);
		closeTrackedStateDatabase(db);
	};
	return {
		run(operation, currentOptions) {
			if (closed || !db.isOpen) throw new Error("Existing-state writer is closed.");
			if (currentOptions.database || currentOptions.readOnly) throw new Error("Existing-state writes require their own tracked writable connection.");
			const currentEnv = currentOptions.env ?? process.env;
			if (resolveDatabasePath({
				path: currentOptions.path,
				env: currentEnv
			}) !== pathname) throw new Error("Existing-state writer cannot change its database path.");
			assertSameFile();
			const existingSchema = isExistingOpenClawStateSchema(pathname);
			const busyTimeoutMs = currentOptions.busyTimeoutMs ?? contract.busyTimeoutMs ?? 5e3;
			setSqliteBusyTimeout(db, busyTimeoutMs);
			const write = () => runManagedStateTransaction(db, () => {
				assertSameFile();
				assertOpenClawStateWriteAllowed({
					database: db,
					databasePath: pathname,
					env: currentEnv
				});
				const priorVersion = admission.get(db);
				const needsAdmission = priorVersion === void 0;
				if (existingSchema) assertExistingOpenClawStateRuntimeSchema(db, pathname);
				const validate = () => assertExistingOpenClawStateSchema(db, pathname, needsAdmission && contract.initializeAdditiveSchema ? "" : contract.schemaSql, contract.schemaCompatibility);
				let version;
				let recoveryChanges = [];
				if (priorVersion !== void 0) version = priorVersion;
				else try {
					version = validate();
				} catch (error) {
					if (!contract.recoverTaskDeliveryOrphans || !(error instanceof SqliteRepairableForeignKeyError)) throw error;
					recoveryChanges = recoverOrphanTaskDeliveryRows(db, pathname);
					version = validate();
				}
				if (needsAdmission && contract.initializeAdditiveSchema) {
					assertSqliteSchemaContains(db, pathname, contract.schemaSql, {
						...contract.schemaCompatibility,
						allowedMissingTables: getCanonicalSqliteTableNames(contract.schemaSql)
					});
					admitSqliteSchema(db);
					ensureAdditiveSchema?.(db);
					assertSqliteSchemaContains(db, pathname, contract.schemaSql, contract.schemaCompatibility);
				}
				if (needsAdmission) {
					admitSqliteSchema(db);
					admission.publish(db, version);
				}
				const value = operation({
					db,
					path: pathname,
					recoveryChanges
				});
				assertSameFile();
				if (contract.recoverTaskDeliveryOrphans) assertSqliteIntegrity(db, pathname);
				return value;
			}, {
				beginLockFailureReporting: contract.beginLockFailureReporting,
				busyTimeoutMs,
				databaseLabel: pathname,
				operationLabel: contract.operationLabel
			});
			return contract.attributeUpdateWrite ? runUpdateDoctorAttributedStateWrite(db, pathname, write, close) : write();
		},
		assertSettled() {
			assertSameFile();
			assertTransactionUsable(db);
			if (db.isOpen && db.isTransaction) throw new Error("Existing-state writer retained an unsettled transaction");
			if (db.isOpen) assertNoActiveSqliteReaders(db, "Existing-state writer");
		},
		close
	};
}
//#endregion
//#region src/state/openclaw-agent-db-existing-write.ts
const existingAgentLeaseSchema = [
	"schema_meta",
	"state_leases",
	"agent_database_leases"
].map((table) => extractSqliteTableSchema(OPENCLAW_STATE_SCHEMA_SQL, table, {
	endMarker: ") STRICT;",
	errorMessage: "Existing agent lease schema is unavailable."
})).join("\n");
function withExistingAgentLeaseWrite(maintenance, options, operation) {
	return runExistingOpenClawStateWriteTransaction(({ db }) => {
		maintenance.assertOwnedInTransaction(db);
		const result = operation(db);
		maintenance.assertOwnedInTransaction(db);
		return result;
	}, options, {
		operationLabel: "agent.database.maintenance.admission",
		schemaSql: existingAgentLeaseSchema,
		schemaCompatibility: { allowedMissingColumns: ["agent_database_leases.provenance"] }
	});
}
//#endregion
//#region src/state/openclaw-agent-db-lease-provenance.ts
let boot;
function mayShareAgentDatabaseFile(left, right) {
	if (left === right) return true;
	try {
		const first = fs.statSync(left, {
			bigint: true,
			throwIfNoEntry: false
		});
		const second = fs.statSync(right, {
			bigint: true,
			throwIfNoEntry: false
		});
		return !first || !second || first.dev === second.dev && first.ino === second.ino;
	} catch {
		return true;
	}
}
function agentDatabaseLeaseStaleReason(row) {
	if (isPidDefinitelyDead(row.owner_pid)) return "owner-pid-dead";
	const currentStartTime = getFileLockProcessStartTime(row.owner_pid);
	return row.owner_start_time !== null && currentStartTime !== null && row.owner_start_time !== currentStartTime ? "owner-start-time-changed" : void 0;
}
function readAgentDatabaseLeaseProvenance(pathname) {
	try {
		if (boot === void 0) {
			const bootId = process.platform === "linux" ? fs.readFileSync("/proc/sys/kernel/random/boot_id", "utf8").trim() : "";
			boot = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(bootId) ? [
				hostname(),
				bootId,
				fs.readlinkSync("/proc/self/ns/pid"),
				VERSION
			].join("\0") : null;
		}
		if (!boot) return null;
		const file = fs.statSync(pathname, { bigint: true });
		return file.isFile() ? `process-v1:${createHash("sha256").update(`${boot}\0${file.dev}:${file.ino}`).digest("hex")}` : null;
	} catch {
		return null;
	}
}
function isSameBootAgentDatabaseLease(provenance, pathname) {
	return provenance !== null && provenance === readAgentDatabaseLeaseProvenance(pathname);
}
function agentDatabaseLeaseProcessDeathRefusal(row, pathname, staleReason) {
	if (staleReason !== "owner-pid-dead") return "owner-start-time-changed";
	if (row.opened_at <= 0) return "predecessor-admission-incomplete";
	if (row.owner_start_time === null) return "owner-start-time-missing";
	if (row.path !== pathname) return "lease-path-mismatch";
	if (row.provenance === null) return "legacy-provenance-missing";
	return isSameBootAgentDatabaseLease(row.provenance, pathname) ? void 0 : "host-boot-namespace-version-file-mismatch";
}
function agentDatabaseAdmissionProvenanceRefusal(provenance, pathname) {
	return provenance === void 0 ? "native-admission-required" : isSameBootAgentDatabaseLease(provenance, pathname) ? void 0 : "prepared-provenance-mismatch";
}
//#endregion
//#region src/state/openclaw-agent-db-lease.ts
const log = createSubsystemLogger("state/agent-db");
const AGENT_DATABASE_MAINTENANCE_LEASE = {
	scope: "core:agent-database-maintenance",
	key: "global"
};
const maintenanceAuthority = new AsyncLocalStorage();
/** Ordinary agent worker routing cannot borrow native maintenance authority. */
function hasAgentDatabaseMaintenanceAuthority() {
	return maintenanceAuthority.getStore() !== void 0;
}
/** Revalidate the held lease, including immediately before committing a versioned rebuild. */
function assertAgentDatabaseMaintenanceAuthority(expected) {
	const authority = maintenanceAuthority.getStore()?.authority;
	if (!authority || expected && authority !== expected) throw new Error("Agent identity migration requires stopped-writer maintenance; stop active agents and run openclaw doctor --fix.");
	authority.assertOwned();
	maintenanceAuthority.getStore()?.assertScopeCurrent?.();
}
/** Revalidate a maintenance owner when present, without requiring ordinary opens to hold one. */
function assertAgentDatabaseMaintenanceAuthorityIfPresent() {
	maintenanceAuthority.getStore()?.assertScopeCurrent?.();
	maintenanceAuthority.getStore()?.authority.assertOwned();
}
/** Verify the maintenance owner and its independent heartbeat before a synchronous phase. */
function renewAgentDatabaseMaintenanceAuthorityIfPresent() {
	const authority = maintenanceAuthority.getStore()?.authority;
	if (!authority) return;
	if (!authority.renew) throw new Error("Agent database maintenance authority cannot renew its lease.");
	authority.renew();
}
function claimOpenClawAgentDatabaseLease(params, leaseId = randomUUID(), onVerification) {
	const agentId = normalizeAgentId(params.agentId);
	const deletionFence = prepareAgentDeletionPathFence({
		agentId,
		path: params.path
	}, { env: params.env });
	const ownerStartTime = getFileLockProcessStartTime(process.pid);
	runOpenClawStateWriteTransaction((database) => claimAgentDatabaseLeaseInDatabase(database, {
		leaseId,
		agentId,
		path: params.path,
		ownerPid: process.pid,
		ownerStartTime,
		provenance: readAgentDatabaseLeaseProvenance(params.path)
	}, deletionFence, onVerification), {
		env: params.env,
		initializationAgentPaths: [params.path]
	});
	return leaseId;
}
function claimAgentDatabaseLeaseInDatabase(database, owner, deletionFence, onVerification) {
	ensureAgentDatabaseLeaseSchema(database.db);
	const db = getNodeSqliteKysely(database.db);
	const maintenance = executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("state_leases").select("owner").where("scope", "=", AGENT_DATABASE_MAINTENANCE_LEASE.scope).where("lease_key", "=", AGENT_DATABASE_MAINTENANCE_LEASE.key).where("expires_at", ">", Date.now()));
	const authority = maintenanceAuthority.getStore();
	if (maintenance || authority) throw new Error("Agent database maintenance is in progress; retry after openclaw doctor --fix completes.");
	assertAgentDeletionPathFence(database, deletionFence);
	let invalidated = false;
	let hasOtherOwner = false;
	let processDeathRefusal;
	for (const held of readAgentDatabaseLeases(database.db)) {
		const sharesFile = mayShareAgentDatabaseFile(held.path, owner.path);
		const staleReason = sharesFile ? agentDatabaseLeaseStaleReason(held) : void 0;
		if (staleReason) {
			const because = agentDatabaseLeaseProcessDeathRefusal(held, owner.path, staleReason);
			processDeathRefusal ??= because;
			log.info(`agent database stale lease: ${staleReason}; previous release not observed`, {
				agentId: held.agent_id,
				leaseId: held.lease_id,
				path: held.path,
				staleReason,
				ownerPid: held.owner_pid,
				ownerStartTime: held.owner_start_time,
				because: because ?? "same-boot-dead-owner"
			});
			clearAgentDatabaseLeaseVerifications(database.db, held.path);
			invalidated = true;
			executeSqliteQuerySync(database.db, db.deleteFrom("agent_database_leases").where("lease_id", "=", held.lease_id));
		} else if (sharesFile && held.lease_id !== owner.leaseId && (owner.ownerStartTime === null || held.owner_pid !== owner.ownerPid || held.owner_start_time === null || held.owner_start_time !== owner.ownerStartTime)) hasOtherOwner = true;
	}
	onVerification?.(!hasOtherOwner, invalidated, processDeathRefusal ?? (hasOtherOwner ? "live-or-unknown-owner" : void 0));
	executeSqliteQuerySync(database.db, db.insertInto("agent_database_leases").values({
		lease_id: owner.leaseId,
		provenance: owner.provenance,
		agent_id: owner.agentId,
		path: owner.path,
		owner_pid: owner.ownerPid,
		owner_start_time: owner.ownerStartTime,
		opened_at: 0
	}));
}
function releaseOpenClawAgentDatabaseLease(leaseId, options = {}, closeOutcome) {
	const release = (database) => {
		const db = getNodeSqliteKysely(database);
		const held = executeSqliteQueryTakeFirstSync(database, db.selectFrom("agent_database_leases").select("path").where("lease_id", "=", leaseId));
		if (held && !closeOutcome) clearAgentDatabaseLeaseVerifications(database, held.path);
		executeSqliteQuerySync(database, db.deleteFrom("agent_database_leases").where("lease_id", "=", leaseId));
		let receipt;
		if (!held) receipt = "lease-not-held";
		else if (typeof closeOutcome !== "object") receipt = closeOutcome === "uncheckpointed" ? "checkpoint-incomplete" : closeOutcome ?? "close-unconfirmed";
		else if (held.path !== closeOutcome.path) receipt = "path-mismatch";
		else if (hasAgentDatabasePathLease(database, closeOutcome.path)) receipt = "active-leases";
		else receipt = closeOutcome.publishSeal() ? "written" : "verification-missing";
		const publish = () => log.info(`agent database clean-close receipt: ${receipt}`, {
			path: held?.path,
			leaseId,
			receipt
		});
		if (!deferSqlitePostCommitPublication(database, publish)) publish();
	};
	const maintenance = maintenanceAuthority.getStore();
	const databasePath = path.resolve(options.database?.path ?? options.path ?? resolveOpenClawStateSqlitePath(options.env));
	if (maintenance?.databasePath === databasePath) return withExistingAgentLeaseWrite(maintenance.authority, options, release);
	runOpenClawStateWriteTransaction((database) => {
		ensureAgentDatabaseLeaseSchema(database.db);
		release(database.db);
	}, typeof closeOutcome === "object" ? {
		...options,
		initializationAgentPaths: [...options.initializationAgentPaths ?? [], closeOutcome.path]
	} : options);
}
function agentDatabaseLeasePaths(database) {
	const db = getNodeSqliteKysely(database);
	return executeSqliteQuerySync(database, db.selectFrom("agent_database_leases").select("path").distinct()).rows.map((row) => row.path);
}
function hasAgentDatabasePathLease(database, pathname) {
	return agentDatabaseLeasePaths(database).some((held) => mayShareAgentDatabaseFile(held, pathname));
}
/** Record that the claimed native owner completed its admission. */
function recordOpenClawAgentDatabaseAdmission(leaseId, params) {
	runOpenClawStateWriteTransaction((database) => {
		ensureOpenClawQuarantineStore(params.env ?? process.env);
		if (executeSqliteQuerySync(database.db, getNodeSqliteKysely(database.db).updateTable("agent_database_leases").set({ opened_at: Date.now() }).where("lease_id", "=", leaseId).where("agent_id", "=", params.agentId).where("path", "=", params.path).where("owner_pid", "=", process.pid)).numAffectedRows !== 1n) throw new Error(`Agent database open lost its runtime lease: ${params.path}`);
	}, { env: params.env });
}
function clearAgentDatabaseLeaseVerifications(database, pathname) {
	for (const held of /* @__PURE__ */ new Set([pathname, ...agentDatabaseLeasePaths(database)])) if (mayShareAgentDatabaseFile(held, pathname)) {
		invalidateOpenClawAgentDatabaseValidation(held);
		revokeSqliteDatabaseAdmissionsForPath(held);
	}
}
/** An awaited open may consume its scan only while its original runtime claim survives. */
function assertOpenClawAgentDatabaseLease(leaseId, params) {
	const ownerStartTime = getFileLockProcessStartTime(process.pid);
	const held = readAgentDatabaseLeases(openOpenClawStateDatabase({
		env: params.env,
		initializationAgentPaths: [params.path]
	}).db, leaseId)[0];
	if (!held || held.agent_id !== params.agentId || held.path !== params.path || held.owner_pid !== process.pid || held.owner_start_time !== null && ownerStartTime !== null && held.owner_start_time !== ownerStartTime) throw new Error(`Agent database open lost its runtime lease: ${params.path}`);
}
function readAgentDatabaseLeases(database, leaseId) {
	const query = getNodeSqliteKysely(database).selectFrom("agent_database_leases").selectAll();
	return executeSqliteQuerySync(database, leaseId === void 0 ? query : query.where("lease_id", "=", leaseId)).rows;
}
//#endregion
//#region src/state/openclaw-agent-db-close.ts
/** Native handle close uses the lifecycle owner's existing leases and validation. */
function createAgentDatabaseHandleCloser(cache) {
	return function closeCachedOpenClawAgentDatabase(database) {
		try {
			var _usingCtx$1 = _usingCtx();
			const lease = cache.leases.get(database.path);
			const alreadyClosed = !database.db.isOpen;
			const priorCheckpointError = database.walMaintenance.health?.state === "error";
			const seal = _usingCtx$1.u(!alreadyClosed ? prepareSqliteDatabaseCleanClose(database.db) : void 0);
			let clean;
			let retainRuntimeProof;
			try {
				if (!alreadyClosed) setSqliteBusyTimeout(database.db, 0);
				disposeNodeSqliteDependents(database.db);
				database.walMaintenance.close({ checkpointMode: "TRUNCATE" });
				const healthy = !cache.failures.has(database.path) && !priorCheckpointError && database.walMaintenance.health?.state !== "error";
				const pathCurrent = !alreadyClosed && healthy && isOpenClawAgentDatabasePathCurrent(database);
				retainRuntimeProof = healthy && (alreadyClosed || pathCurrent);
				if (database.db.isOpen) database.db.close();
				if (pathCurrent) {
					const { canonicalPath } = readOpenClawAgentDatabaseIdentity(database);
					const closedWithEmptyWal = (statSync(`${canonicalPath}-wal`, { throwIfNoEntry: false })?.size ?? 0) === 0;
					if (seal && closedWithEmptyWal) clean = {
						path: database.path,
						publishSeal: seal.publish
					};
				}
			} catch (error) {
				if (lease) {
					invalidateOpenClawAgentDatabaseValidation(database.path);
					revokeSqliteDatabaseAdmissionsForPath(database.path);
				}
				throw error;
			}
			if (lease) {
				releaseOpenClawAgentDatabaseLease(lease.leaseId, {
					env: lease.env,
					initializationAgentPaths: [database.path]
				}, clean ?? (retainRuntimeProof ? "uncheckpointed" : void 0));
				cache.leases.delete(database.path);
			}
			releaseAgentDeletionDatabaseCleanup(database);
			releaseAgentCreationClaimHandle(database);
			cache.idleTimers.get(database.db)?.[Symbol.dispose]();
			cache.idleTimers.delete(database.db);
		} catch (_) {
			_usingCtx$1.e = _;
		} finally {
			_usingCtx$1.d();
		}
	};
}
//#endregion
//#region src/state/openclaw-agent-canonical-validation-migration.ts
const LEGACY_ENTRY_VALIDITY_TRIGGERS_SQL = `
CREATE TRIGGER IF NOT EXISTS session_nodes_entry_valid_after_insert
AFTER INSERT ON session_nodes
BEGIN
  UPDATE session_nodes SET entry_valid = 0 WHERE session_key = NEW.session_key;
END;

CREATE TRIGGER IF NOT EXISTS session_nodes_entry_valid_after_entry_update
AFTER UPDATE OF entry_json ON session_nodes
BEGIN
  UPDATE session_nodes SET entry_valid = 0 WHERE session_key = NEW.session_key;
END;

CREATE TRIGGER IF NOT EXISTS session_nodes_entry_valid_after_identity_update
AFTER UPDATE OF current_session_id, updated_at ON session_nodes
BEGIN
  UPDATE session_nodes SET entry_valid = 0 WHERE session_key = NEW.session_key;
END;
`;
const LEGACY_CANONICAL_PENDING_TRIGGERS_SQL = `
-- Avoid trigger-local conflict clauses: SQLite inherits the outer writer's
-- conflict policy, including writers that predate this validation projection.
CREATE TRIGGER IF NOT EXISTS session_nodes_canonical_pending_after_insert
AFTER INSERT ON session_nodes
BEGIN
  INSERT INTO session_canonical_validation_pending (session_key)
  SELECT NEW.session_key
  WHERE NOT EXISTS (
    SELECT 1 FROM session_canonical_validation_pending WHERE session_key = NEW.session_key
  );
END;

CREATE TRIGGER IF NOT EXISTS session_nodes_canonical_pending_after_update
AFTER UPDATE OF session_key, current_session_id, entry_json, entry_valid,
  parent_session_key, spawned_by, fork_source_session_key ON session_nodes
WHEN OLD.session_key IS NOT NEW.session_key
  OR OLD.current_session_id IS NOT NEW.current_session_id
  OR OLD.entry_json IS NOT NEW.entry_json
  OR OLD.entry_valid IS NOT NEW.entry_valid
  OR OLD.parent_session_key IS NOT NEW.parent_session_key
  OR OLD.spawned_by IS NOT NEW.spawned_by
  OR OLD.fork_source_session_key IS NOT NEW.fork_source_session_key
BEGIN
  DELETE FROM session_canonical_validation_pending
  WHERE session_key = OLD.session_key AND OLD.session_key IS NOT NEW.session_key;
  INSERT INTO session_canonical_validation_pending (session_key)
  SELECT NEW.session_key
  WHERE NOT EXISTS (
    SELECT 1 FROM session_canonical_validation_pending WHERE session_key = NEW.session_key
  );
END;

CREATE TRIGGER IF NOT EXISTS session_nodes_canonical_pending_after_delete
AFTER DELETE ON session_nodes
BEGIN
  DELETE FROM session_canonical_validation_pending WHERE session_key = OLD.session_key;
END;

CREATE TRIGGER IF NOT EXISTS session_windows_canonical_pending_after_insert
AFTER INSERT ON session_windows
BEGIN
  INSERT INTO session_canonical_validation_pending (session_key)
  SELECT node.session_key FROM session_nodes AS node
  WHERE node.current_session_id = NEW.session_id
    AND NOT EXISTS (
      SELECT 1 FROM session_canonical_validation_pending AS pending
      WHERE pending.session_key = node.session_key
    );
END;

CREATE TRIGGER IF NOT EXISTS session_windows_canonical_pending_after_update
AFTER UPDATE OF session_id, session_key ON session_windows
WHEN OLD.session_id IS NOT NEW.session_id OR OLD.session_key IS NOT NEW.session_key
BEGIN
  INSERT INTO session_canonical_validation_pending (session_key)
  SELECT node.session_key FROM session_nodes AS node
  WHERE node.current_session_id IN (OLD.session_id, NEW.session_id)
    AND NOT EXISTS (
      SELECT 1 FROM session_canonical_validation_pending AS pending
      WHERE pending.session_key = node.session_key
    );
END;

CREATE TRIGGER IF NOT EXISTS session_windows_canonical_pending_after_delete
AFTER DELETE ON session_windows
BEGIN
  INSERT INTO session_canonical_validation_pending (session_key)
  SELECT node.session_key FROM session_nodes AS node
  WHERE node.current_session_id = OLD.session_id
    AND NOT EXISTS (
      SELECT 1 FROM session_canonical_validation_pending AS pending
      WHERE pending.session_key = node.session_key
    );
END;

CREATE TRIGGER IF NOT EXISTS session_key_contract_canonical_pending_after_insert
AFTER INSERT ON session_key_contract
BEGIN
  INSERT INTO session_canonical_validation_pending (session_key)
  SELECT node.session_key FROM session_nodes AS node
  WHERE NOT EXISTS (
    SELECT 1 FROM session_canonical_validation_pending AS pending
    WHERE pending.session_key = node.session_key
  );
END;

CREATE TRIGGER IF NOT EXISTS session_key_contract_canonical_pending_after_update
AFTER UPDATE OF main_key ON session_key_contract
WHEN OLD.main_key IS NOT NEW.main_key
BEGIN
  INSERT INTO session_canonical_validation_pending (session_key)
  SELECT node.session_key FROM session_nodes AS node
  WHERE NOT EXISTS (
    SELECT 1 FROM session_canonical_validation_pending AS pending
    WHERE pending.session_key = node.session_key
  );
END;

CREATE TRIGGER IF NOT EXISTS session_key_contract_canonical_pending_after_delete
AFTER DELETE ON session_key_contract
BEGIN
  INSERT INTO session_canonical_validation_pending (session_key)
  SELECT node.session_key FROM session_nodes AS node
  WHERE NOT EXISTS (
    SELECT 1 FROM session_canonical_validation_pending AS pending
    WHERE pending.session_key = node.session_key
  );
END;
`;
/** Legacy shape repair precedes the historical schema assertion during offline migration. */
function ensureLegacySessionEntryValidityTriggers(db) {
	db.exec(LEGACY_ENTRY_VALIDITY_TRIGGERS_SQL);
}
/** Historical preflight compares the trigger contract those releases actually wrote. */
function withLegacyCanonicalSessionValidationTriggers(schema) {
	return schema.replace("CREATE TABLE IF NOT EXISTS session_windows (", `${LEGACY_ENTRY_VALIDITY_TRIGGERS_SQL}\nCREATE TABLE IF NOT EXISTS session_windows (`).replace("CREATE TABLE IF NOT EXISTS conversations (", `${LEGACY_CANONICAL_PENDING_TRIGGERS_SQL}\nCREATE TABLE IF NOT EXISTS conversations (`);
}
const LEGACY_CANONICAL_VALIDATION_TRIGGER_NAMES = Object.freeze([...`${LEGACY_ENTRY_VALIDITY_TRIGGERS_SQL}\n${LEGACY_CANONICAL_PENDING_TRIGGERS_SQL}`.matchAll(/CREATE TRIGGER IF NOT EXISTS (\w+)/gu)].map((match) => match[1]));
/** The offline schema owner retires raw-writer tracking before publishing schema 25. */
function migrateCanonicalSessionWriterValidation(db) {
	for (const name of LEGACY_CANONICAL_VALIDATION_TRIGGER_NAMES) db.exec(`DROP TRIGGER IF EXISTS ${name}`);
	ensureColumn(db, "session_key_contract", "canonical_ready TEXT");
	db.exec(`
    INSERT INTO session_canonical_validation_pending (session_key)
    SELECT session_key FROM session_nodes WHERE true
    ON CONFLICT (session_key) DO NOTHING;
    UPDATE session_key_contract SET canonical_ready = NULL WHERE id = 1;
  `);
}
function seedCanonicalSessionValidationPending(db) {
	db.exec(`
    INSERT INTO session_canonical_validation_pending (session_key)
    SELECT node.session_key FROM session_nodes AS node
    WHERE NOT EXISTS (
      SELECT 1 FROM session_canonical_validation_pending AS pending
      WHERE pending.session_key = node.session_key
    );
  `);
}
//#endregion
//#region src/state/openclaw-agent-db-metadata-write.ts
function persistAgentSchemaMetadata(db, agentId, targetVersion) {
	const now = Date.now();
	const metadata = {
		role: "agent",
		schema_version: targetVersion,
		agent_id: agentId,
		app_version: VERSION
	};
	executeSqliteQuerySync(db, getNodeSqliteKysely(db).insertInto("schema_meta").values({
		meta_key: "primary",
		...metadata,
		created_at: now,
		updated_at: now
	}).onConflict((conflict) => conflict.column("meta_key").doUpdateSet({
		...metadata,
		updated_at: now
	}).where((eb) => eb.or([
		eb("schema_meta.schema_version", "!=", targetVersion),
		eb("schema_meta.app_version", "is", null),
		eb("schema_meta.app_version", "!=", VERSION),
		eb("schema_meta.agent_id", "!=", agentId)
	]))));
	publishAgentSchemaMetadata(db, {
		role: "agent",
		schemaVersion: targetVersion,
		agentId
	});
}
//#endregion
//#region src/state/openclaw-agent-db-schema-read.ts
function assertSupportedAgentSchemaVersion(db, pathname, userVersion = getAdmittedSqliteSchemaFacts(db)?.userVersion ?? readSqliteUserVersion(db)) {
	if (userVersion > 27) throw createNewerSqliteSchemaVersionError("OpenClaw agent database", pathname, userVersion, 27);
	return userVersion;
}
function hasAgentDatabaseApplicationSchema(db) {
	const schema = getAdmittedSqliteSchemaFacts(db);
	if (schema) {
		for (const names of [
			schema.tables,
			schema.views,
			schema.indexes,
			schema.triggers.keys()
		]) for (const name of names) if (!name.startsWith("sqlite_")) return true;
		return false;
	}
	return Boolean(db.prepare("SELECT 1 FROM sqlite_master WHERE substr(name, 1, 7) <> 'sqlite_' LIMIT 1").get());
}
/** Persistence gates consume the catalog published by admission or schema maintenance. */
function assertCanonicalAgentPersistenceVersion(db, pathname, userVersion = getAdmittedSqliteSchemaFacts(db)?.userVersion ?? readSqliteUserVersion(db)) {
	const isNewUnownedDatabase = userVersion === 0 && !hasAgentDatabaseApplicationSchema(db);
	if (userVersion < 17 && !isNewUnownedDatabase) throw new OpenClawAgentDatabaseMediaMigrationRequiredError(pathname, userVersion);
	if (userVersion < 27 && !isNewUnownedDatabase) throw new SqliteSchemaMismatchError(`OpenClaw agent database ${pathname} uses schema version ${userVersion}; stop active agents and run openclaw doctor --fix to migrate session identities before using it.`);
}
function assertExistingAgentSchemaOwner(existing, agentId, pathname) {
	if (!existing) return;
	if (existing.role !== "agent") throw new SqliteSchemaMismatchError(`OpenClaw agent database ${pathname} has schema role ${existing.role ?? "unknown"}; expected agent. Run openclaw doctor --fix to inspect and repair its ownership.`);
	if (!existing.agentId) throw new SqliteSchemaMismatchError(`OpenClaw agent database ${pathname} has no agent owner. Run openclaw doctor --fix to inspect and repair its ownership.`);
	if (normalizeAgentId(existing.agentId) !== agentId) throw new SqliteSchemaMismatchError(`OpenClaw agent database ${pathname} belongs to agent ${existing.agentId}; requested agent ${agentId}.`);
}
function assertCurrentAgentSchemaMetadata(metadata, agentId, pathname) {
	if (!metadata) throw new SqliteSchemaMismatchError(`OpenClaw agent database ${pathname} has no schema ownership metadata. Run openclaw doctor --fix to inspect and repair its ownership.`);
	assertExistingAgentSchemaOwner(metadata, agentId, pathname);
	if (metadata.schemaVersion !== 27) throw new SqliteSchemaMismatchError(`OpenClaw agent database ${pathname} metadata schema version ${metadata.schemaVersion ?? "invalid"} does not match 27; run openclaw doctor --fix before using it.`);
}
//#endregion
//#region src/channels/chat-type.ts
function normalizeChatType(raw) {
	const value = normalizeOptionalLowercaseString(raw);
	if (value === "dm") return "direct";
	return value === "direct" || value === "group" || value === "channel" ? value : void 0;
}
//#endregion
//#region src/config/sessions/session-entry-json.ts
function hasValidSessionEntryIdentity(entry) {
	return typeof entry.sessionId === "string" && typeof entry.updatedAt === "number" && Number.isFinite(entry.updatedAt);
}
function parseSqliteSessionEntryRecord(row) {
	try {
		const record = JSON.parse(row.entry_json);
		if (!isRecord(record)) return null;
		if (!hasValidSessionEntryIdentity(record)) return null;
		if (row.current_session_id !== void 0 && row.current_session_id !== record.sessionId || row.updated_at !== void 0 && row.updated_at !== record.updatedAt) return null;
		return record;
	} catch {
		return null;
	}
}
//#endregion
//#region src/routing/conversation-ref.ts
/** Canonicalizes an adapter target into the peer id used by inbound routing. */
function normalizeConversationPeerId(channel, value) {
	let normalized = value.trim();
	const channelPrefix = `${channel.trim().toLowerCase()}:`;
	if (normalized.toLowerCase().startsWith(channelPrefix)) normalized = normalized.slice(channelPrefix.length).trim();
	return normalized.replace(/^(user|channel|group|conversation|room|dm|thread):/i, "").trim();
}
/** Builds an opaque address from canonical transport identity, never from model-session state. */
function buildConversationRef(params) {
	return `conv_${crypto.createHash("sha256").update(JSON.stringify([
		params.channel,
		params.accountId,
		params.kind,
		params.peerId,
		params.parentConversationRef ?? "",
		params.threadId ?? ""
	])).digest("hex").slice(0, 32)}`;
}
//#endregion
//#region src/sessions/session-chat-type-shared.ts
const CANONICAL_PEER_KINDS = /* @__PURE__ */ new Set([
	"direct",
	"dm",
	"group",
	"channel"
]);
function isCanonicalPeerKind(value) {
	return CANONICAL_PEER_KINDS.has(value ?? "");
}
function hasAmbiguousCanonicalSessionPeerShape(scopedSessionKey) {
	const parts = scopedSessionKey.split(":");
	if (parts[0] === "agent") return false;
	return [
		Boolean((parts[0] === "direct" || parts[0] === "dm") && parts[1]),
		Boolean(parts[0] && isCanonicalPeerKind(parts[1]) && parts[2]),
		Boolean(parts[0] && parts[1] && isCanonicalPeerKind(parts[2]) && parts[3]),
		deriveBuiltInLegacySessionChatType(scopedSessionKey) !== void 0
	].filter(Boolean).length > 1;
}
function parseCanonicalSessionPeerShape(scopedSessionKey) {
	const parts = scopedSessionKey.split(":");
	if (parts[0] === "agent" || hasAmbiguousCanonicalSessionPeerShape(scopedSessionKey)) return;
	let channel;
	let peerKind;
	let peerIdStart = 0;
	if (parts[0] === "direct" || parts[0] === "dm") {
		peerKind = parts[0];
		peerIdStart = 1;
	} else if (parts[0] && isCanonicalPeerKind(parts[1])) {
		channel = parts[0];
		peerKind = parts[1];
		peerIdStart = 2;
	} else if (parts[0] && parts[1] && isCanonicalPeerKind(parts[2])) {
		channel = parts[0];
		peerKind = parts[2];
		peerIdStart = 3;
	}
	if (!peerKind || !parts[peerIdStart]) return;
	const chatType = peerKind === "direct" || peerKind === "dm" ? "direct" : peerKind;
	return {
		...channel ? { channel } : {},
		chatType
	};
}
function deriveBuiltInLegacySessionChatType(scopedSessionKey) {
	if (/^group:[^:]+(?::.*)?$/u.test(scopedSessionKey)) return "group";
	if (/^channel:[^:]+(?::.*)?$/u.test(scopedSessionKey)) return "channel";
	if (/^(?:whatsapp:)?[^:]+@g\.us$/.test(scopedSessionKey)) return "group";
	if (/^discord:(?:[^:]+:)?guild-[^:]+:channel-[^:]+$/.test(scopedSessionKey)) return "channel";
}
/** Best-effort classification across canonical and legacy session-key formats. */
function deriveSessionChatTypeFromKey(sessionKey, deriveLegacySessionChatTypes = []) {
	const raw = normalizeLowercaseStringOrEmpty(sessionKey);
	if (!raw) return "unknown";
	const scopedSessionKey = parseAgentSessionKey(raw)?.rest ?? raw;
	const canonical = parseCanonicalSessionPeerShape(scopedSessionKey)?.chatType;
	if (canonical) return canonical;
	const builtInLegacy = deriveBuiltInLegacySessionChatType(scopedSessionKey);
	if (builtInLegacy) return builtInLegacy;
	for (const deriveLegacySessionChatType of deriveLegacySessionChatTypes) {
		const derived = deriveLegacySessionChatType(scopedSessionKey);
		if (derived) return derived;
	}
	return "unknown";
}
//#endregion
//#region src/state/creator-namespace-migration.ts
/** Doctor and versioned upgrades alone may qualify historical creation seams. */
function migrateLegacySessionCreator(entry) {
	const legacy = entry;
	const actor = entry.createdActor ?? (isRecord(legacy.createdBy) ? {
		...legacy.createdBy,
		type: "human",
		source: "unknown"
	} : void 0);
	if (actor?.type !== "human") return entry;
	const source = actor.source === "profile" || actor.source === "channel" || actor.source === "unknown" ? actor.source : entry.createdVia === "operator" || entry.createdVia === "run" ? "profile" : entry.createdVia === "channel" ? "channel" : "unknown";
	if (actor === entry.createdActor && source === actor.source && !legacy.createdBy) return entry;
	const migrated = {
		...legacy,
		createdActor: {
			...actor,
			source
		}
	};
	delete migrated.createdBy;
	return migrated;
}
//#endregion
//#region src/state/openclaw-agent-db-session-migrations.ts
function assertSupportedAgentMigrationSchemas(db, pathname, userVersion) {
	if (userVersion < 8 && [
		"sessions",
		"session_entries",
		"transcript_events"
	].some((table) => tableExists$2(db, table)) || tableExists$2(db, "session_transcript_files") || readSqliteTableColumns(db, "session_transcript_fts")?.has("session_key")) throw new SqliteSchemaMismatchError(`OpenClaw agent database ${pathname} contains an unreleased session schema (version ${userVersion}). Preserve a complete copy of your state directory and configuration, including shared agent registration. Run "openclaw doctor --fix" with OpenClaw 2026.9.7 against that copy. If a store is held, follow Doctor's explicit agent-restoration instructions, then rerun Doctor before retrying the upgrade.`);
	const acpParentStreamColumns = readSqliteTableColumns(db, "acp_parent_stream_events");
	const trajectoryColumns = readSqliteTableColumns(db, "trajectory_runtime_events");
	const memorySourceColumns = readSqliteTableColumns(db, "memory_index_sources");
	if (acpParentStreamColumns && !acpParentStreamColumns.has("session_id") || trajectoryColumns?.has("event_id") || memorySourceColumns?.has("source_kind")) throw new SqliteSchemaMismatchError(`OpenClaw agent database ${pathname} has an unsupported legacy schema. Upgrades from pre-July-2026 state are no longer migrated; restore a backup produced by a July 2026 or newer release before retrying.`);
}
/** Backfill one generation token without copying or rewriting transcript rows. */
function migrateSessionTranscriptGenerations(db, previousVersion) {
	if (previousVersion >= 13) return;
	const insert = db.prepare(`INSERT OR IGNORE INTO transcript_rewrite_watermarks (session_id, generation, updated_at)
     SELECT session_id, lower(hex(randomblob(16))), ?
     FROM transcript_events
     GROUP BY session_id`);
	insert.setReadBigInts(true);
	insert.run(Date.now());
}
function migrateSessionTranscriptActiveProjection(db, previousVersion) {
	if (previousVersion >= 10) return;
	const columns = readSqliteTableColumns(db, "session_transcript_index_state");
	if (columns && !columns.has("active_event_count")) db.exec("ALTER TABLE session_transcript_index_state ADD COLUMN active_event_count INTEGER NOT NULL DEFAULT 0;");
	if (columns && !columns.has("active_message_count")) db.exec("ALTER TABLE session_transcript_index_state ADD COLUMN active_message_count INTEGER NOT NULL DEFAULT 0;");
	db.exec(`
    DELETE FROM session_transcript_active_events;
    UPDATE session_transcript_index_state
    SET needs_rebuild = 1,
        active_event_count = 0,
        active_message_count = 0,
        updated_at = ${Date.now()};
  `);
}
function inferMigratedChatType(params) {
	const explicit = normalizeChatType(normalizeOptionalString(params.entry.chatType)) ?? normalizeChatType(params.persistedChatType);
	if (explicit) return explicit;
	const keyType = deriveSessionChatTypeFromKey(params.sessionKey);
	if (keyType !== "unknown") return keyType;
	const target = params.deliveryTarget?.toLowerCase();
	if (target?.startsWith("channel:") || /^[^:]+:channel:/u.test(target ?? "")) return "channel";
	if (/^(?:[^:]+:)?(?:group|room):/u.test(target ?? "") || normalizeOptionalString(params.entry.groupId)) return "group";
	return "direct";
}
function migratedConversation(entry, persistedChatType, sessionKey) {
	const canonicalDelivery = asOptionalRecord(entry.delivery);
	const delivery = asOptionalRecord(canonicalDelivery?.context) ?? asOptionalRecord(entry.deliveryContext);
	const origin = asOptionalRecord(canonicalDelivery?.origin) ?? asOptionalRecord(entry.origin);
	const deliveryRouteTarget = normalizeOptionalString(delivery?.to);
	const originTarget = normalizeOptionalString(origin?.from);
	const kind = inferMigratedChatType({
		entry,
		persistedChatType,
		sessionKey,
		deliveryTarget: deliveryRouteTarget ?? originTarget
	});
	const deliveryTarget = deliveryRouteTarget ?? (kind === "direct" ? originTarget : void 0);
	if (!deliveryTarget) return;
	const routeOwnsTarget = Boolean(deliveryRouteTarget);
	const channel = (routeOwnsTarget ? normalizeOptionalString(delivery?.channel) ?? normalizeOptionalString(entry.channel) ?? normalizeOptionalString(entry.lastChannel) ?? normalizeOptionalString(origin?.provider) : normalizeOptionalString(origin?.provider))?.toLowerCase();
	const accountId = normalizeAccountId(routeOwnsTarget ? normalizeOptionalString(delivery?.accountId) ?? normalizeOptionalString(entry.lastAccountId) ?? normalizeOptionalString(origin?.accountId) : normalizeOptionalString(origin?.accountId));
	const threadIdRaw = routeOwnsTarget ? delivery?.threadId : origin?.threadId;
	const threadId = typeof threadIdRaw === "number" && Number.isFinite(threadIdRaw) ? String(threadIdRaw) : normalizeOptionalString(threadIdRaw);
	const peerId = channel ? normalizeConversationPeerId(channel, deliveryTarget) : void 0;
	if (!channel || !peerId) return;
	return {
		conversationRef: buildConversationRef({
			channel,
			accountId,
			kind,
			peerId,
			threadId
		}),
		channel,
		accountId,
		kind,
		peerId,
		deliveryTarget,
		threadId,
		nativeChannelId: normalizeOptionalString(origin?.nativeChannelId),
		nativeDirectUserId: normalizeOptionalString(origin?.nativeDirectUserId),
		label: normalizeOptionalString(entry.displayName) ?? normalizeOptionalString(entry.label) ?? normalizeOptionalString(entry.subject) ?? normalizeOptionalString(entry.groupId)
	};
}
/** Backfills canonical external addresses once when conversation routing becomes active. */
function backfillSessionConversations(db) {
	if (!readSqliteTableColumns(db, "session_entries") || !readSqliteTableColumns(db, "sessions") || !readSqliteTableColumns(db, "conversations")) return;
	if (!readSqliteTableColumns(db, "session_conversations")) db.exec(`
      CREATE TABLE session_conversations (
        session_id TEXT NOT NULL,
        conversation_id TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'primary' CHECK (role IN ('primary', 'participant', 'related')),
        route_context_json TEXT,
        first_seen_at INTEGER NOT NULL,
        last_seen_at INTEGER NOT NULL,
        PRIMARY KEY (session_id, conversation_id, role),
        FOREIGN KEY (session_id) REFERENCES sessions(session_id) ON DELETE CASCADE,
        FOREIGN KEY (conversation_id) REFERENCES conversations(conversation_id) ON DELETE CASCADE
      );
    `);
	db.exec(`
    UPDATE sessions
    SET primary_conversation_id = NULL
    WHERE primary_conversation_id IN (
      SELECT conversation_id FROM conversations WHERE delivery_target = ''
    );
    DELETE FROM session_conversations
    WHERE conversation_id IN (
      SELECT conversation_id FROM conversations WHERE delivery_target = ''
    );
    DELETE FROM conversations WHERE delivery_target = '';
  `);
	const rows = db.prepare(`
        SELECT
          se.session_id,
          se.entry_json,
          se.session_key,
          se.updated_at,
          s.session_scope,
          CASE WHEN se.session_key = s.session_key THEN s.chat_type END AS persisted_chat_type
        FROM session_entries AS se
        INNER JOIN sessions AS s ON s.session_id = se.session_id
        ORDER BY se.updated_at ASC, se.session_key ASC;
      `).all();
	const upsertConversation = db.prepare(`
    INSERT INTO conversations (
      conversation_id, channel, account_id, kind, peer_id, delivery_target,
      parent_conversation_id, thread_id, native_channel_id,
      native_direct_user_id, label, metadata_json, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, NULL, ?, ?, ?, ?, NULL, ?, ?)
    ON CONFLICT(conversation_id) DO UPDATE SET
      channel = excluded.channel,
      account_id = excluded.account_id,
      kind = excluded.kind,
      peer_id = excluded.peer_id,
      delivery_target = excluded.delivery_target,
      thread_id = excluded.thread_id,
      native_channel_id = excluded.native_channel_id,
      native_direct_user_id = excluded.native_direct_user_id,
      label = excluded.label,
      updated_at = excluded.updated_at;
  `);
	const deleteMatchingRelated = db.prepare(`
    DELETE FROM session_conversations
    WHERE session_id = ? AND conversation_id = ? AND role = 'related';
  `);
	const demotePrimary = db.prepare(`
    UPDATE session_conversations SET role = 'related', last_seen_at = ?
    WHERE session_id = ? AND role = 'primary';
  `);
	const linkConversation = db.prepare(`
    INSERT INTO session_conversations (
      session_id, conversation_id, role, first_seen_at, last_seen_at
    ) VALUES (?, ?, ?, ?, ?)
    ON CONFLICT(session_id, conversation_id, role) DO UPDATE SET
      last_seen_at = excluded.last_seen_at;
  `);
	const updatePrimary = db.prepare("UPDATE sessions SET primary_conversation_id = ? WHERE session_id = ?");
	for (const statement of [
		upsertConversation,
		deleteMatchingRelated,
		demotePrimary,
		linkConversation,
		updatePrimary
	]) statement.setReadBigInts(true);
	for (const row of rows) {
		const sessionId = normalizeOptionalString(row.session_id);
		const entry = typeof row.entry_json === "string" ? safeParseJsonRecord(row.entry_json) : void 0;
		const updatedAt = typeof row.updated_at === "number" ? row.updated_at : Date.now();
		const conversation = entry ? migratedConversation(entry, normalizeOptionalString(row.persisted_chat_type), normalizeOptionalString(row.session_key)) : void 0;
		if (!sessionId || !conversation) continue;
		const role = row.session_scope === "shared-main" && conversation.kind === "direct" ? "participant" : "primary";
		upsertConversation.run(conversation.conversationRef, conversation.channel, conversation.accountId, conversation.kind, conversation.peerId, conversation.deliveryTarget, conversation.threadId ?? null, conversation.nativeChannelId ?? null, conversation.nativeDirectUserId ?? null, conversation.label ?? null, updatedAt, updatedAt);
		if (role === "primary") {
			demotePrimary.run(updatedAt, sessionId);
			deleteMatchingRelated.run(sessionId, conversation.conversationRef);
		}
		linkConversation.run(sessionId, conversation.conversationRef, role, updatedAt, updatedAt);
		if (role === "primary") updatePrimary.run(conversation.conversationRef, sessionId);
	}
}
function readSqliteTableColumns(db, tableName) {
	if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(tableName)) throw new Error(`invalid SQLite table identifier: ${tableName}`);
	if (!tableExists$2(db, tableName)) return null;
	const rows = db.prepare(`PRAGMA table_info(${tableName})`).all();
	return new Set(rows.flatMap((row) => typeof row.name === "string" ? [row.name] : []));
}
/** Installs same-version session projections on first updated-binary open. */
function ensureSessionAdditiveColumns(db) {
	for (const { tableName, columnName, dataType } of STARTUP_ADDITIVE_AGENT_COLUMN_DEFINITIONS) ensureColumn(db, tableName, `${columnName} ${dataType}`);
	if (tableExists$2(db, "session_conversations") && !getAdmittedSqliteSchemaFacts(db)?.triggers.has("session_conversations_route_context_invalidate_after_update")) db.exec(`
      CREATE TRIGGER IF NOT EXISTS session_conversations_route_context_invalidate_after_update
      AFTER UPDATE OF role, last_seen_at ON session_conversations
      WHEN NEW.route_context_json IS OLD.route_context_json
      BEGIN
        UPDATE session_conversations
        SET route_context_json = NULL
        WHERE session_id = NEW.session_id
          AND conversation_id = NEW.conversation_id
          AND role = NEW.role;
      END;
    `);
}
/** Adds the v11 exact delivery target before the conversation backfill writes canonical rows. */
function migrateConversationDeliveryTargetColumn(db) {
	ensureColumn(db, "conversations", "delivery_target TEXT NOT NULL DEFAULT ''");
}
/** Adds the validity projection and settles only rows left pending by older writers. */
function ensureSessionEntryValidityProjection(db) {
	const columns = readSqliteTableColumns(db, "session_nodes");
	if (!columns) return;
	if (!columns.has("entry_valid")) db.exec("ALTER TABLE session_nodes ADD COLUMN entry_valid INTEGER NOT NULL DEFAULT 0 CHECK (entry_valid IN (-1, 0, 1))");
	const selectPending = db.prepare("SELECT current_session_id, entry_json, session_key, updated_at FROM session_nodes WHERE entry_valid = 0 ORDER BY session_key LIMIT 256");
	const update = db.prepare("UPDATE session_nodes SET entry_valid = ? WHERE session_key = ?");
	update.setReadBigInts(true);
	while (true) {
		const rows = selectPending.all();
		if (rows.length === 0) break;
		for (const row of rows) update.run(parseSqliteSessionEntryRecord(row) ? 1 : -1, row.session_key);
	}
}
function migrateSessionCreatorNamespaces(db, previousVersion) {
	if (previousVersion >= 19 || !tableExists$2(db, "session_nodes")) return;
	const update = db.prepare("UPDATE session_nodes SET entry_json = ?, created_actor_type = ?, created_actor_id = ? WHERE session_key = ?");
	update.setReadBigInts(true);
	const rows = db.prepare(`SELECT session_key, entry_json FROM session_nodes
    WHERE json_valid(entry_json) AND (json_extract(entry_json, '$.createdActor.type') = 'human'
      OR (json_type(entry_json, '$.createdActor') IS NULL AND json_type(entry_json, '$.createdBy') = 'object'))`);
	for (const row of rows.all()) {
		const entry = migrateLegacySessionCreator(JSON.parse(row.entry_json));
		update.run(JSON.stringify(entry), entry.createdActor?.type ?? null, entry.createdActor?.id ?? null, row.session_key);
	}
}
//#endregion
//#region src/state/openclaw-agent-json-predicate-schema.ts
/** Derived fields introduced together by agent schema 26. JSON remains canonical. */
const AGENT_JSON_PREDICATE_COLUMNS = {
	session_nodes: ["session_started_at", "has_optional_references"],
	transcript_events: [
		"navigation_type",
		"navigation_custom_type",
		"navigation_display",
		"message_role",
		"navigation_last_type",
		"navigation_last_custom_type",
		"navigation_valid"
	],
	context_engine_turn_outbox: ["payload_state"]
};
const COLUMN_DECLARATIONS = {
	session_started_at: "INTEGER",
	has_optional_references: "INTEGER NOT NULL DEFAULT 0",
	payload_state: "TEXT",
	navigation_type: "TEXT",
	navigation_custom_type: "TEXT",
	navigation_display: "INTEGER NOT NULL DEFAULT 0",
	message_role: "TEXT",
	navigation_last_type: "TEXT",
	navigation_last_custom_type: "TEXT",
	navigation_valid: "INTEGER NOT NULL DEFAULT 1"
};
/** Historical admission compares the schema before predicate columns existed. */
function withoutAgentJsonPredicateColumns(schema) {
	let historicalSchema = schema;
	for (const [column, declaration] of Object.entries(COLUMN_DECLARATIONS)) historicalSchema = historicalSchema.replace(`  ${column} ${declaration},\n`, "");
	return historicalSchema;
}
/** Runs once inside the versioned migration transaction, never on runtime reads. */
function migrateAgentJsonPredicatesInTransaction(database) {
	ensureColumn(database, "session_nodes", "session_started_at INTEGER");
	ensureColumn(database, "session_nodes", "has_optional_references INTEGER NOT NULL DEFAULT 0");
	database.exec(`
    UPDATE session_nodes SET
      session_started_at = CASE WHEN json_valid(entry_json)
        THEN CAST(json_extract(entry_json, '$.sessionStartedAt') AS INTEGER) END,
      has_optional_references = CASE WHEN NOT json_valid(entry_json) OR instr(entry_json, char(0)) > 0 THEN 1
        WHEN json_type(entry_json, '$.previousSessionId') IS NOT NULL
          OR json_type(entry_json, '$.usageFamilySessionIds') IS NOT NULL
          OR json_type(entry_json, '$.compactionCheckpoints') IS NOT NULL THEN 1
        ELSE 0 END;
  `);
	if (tableExists$2(database, "context_engine_turn_outbox")) {
		ensureColumn(database, "context_engine_turn_outbox", "payload_state TEXT");
		database.exec(`
      UPDATE context_engine_turn_outbox SET payload_state = CASE
        WHEN json_valid(payload_json) THEN CASE
          WHEN json_type(payload_json, '$.state') = 'text'
          THEN json_extract(payload_json, '$.state') END END;
    `);
	}
	for (const column of AGENT_JSON_PREDICATE_COLUMNS.transcript_events) ensureColumn(database, "transcript_events", `${column} ${COLUMN_DECLARATIONS[column]}`);
	database.exec(`
    WITH source AS (
      SELECT session_id, seq, CASE WHEN event_json IS NOT NULL THEN event_json
        ELSE json_extract(navigation_json, '$.navigation') END AS event
      FROM transcript_events
    ), navigation AS (
      SELECT session_id, seq, coalesce(json_valid(event), 0) AS valid,
        CASE WHEN json_valid(event) THEN event ELSE '{}' END AS event
      FROM source
    ), fields AS (
      SELECT session_id, seq, valid,
        json_extract(event, '$.type') AS first_type,
        json_extract(event, '$.customType') AS first_custom_type,
        CASE WHEN json_type(event, '$.display') = 'true' THEN 1 ELSE 0 END AS display,
        json_extract(event, '$.message.role') AS role,
        (SELECT value FROM json_each(event) WHERE key = 'type' ORDER BY id DESC LIMIT 1) AS last_type,
        (SELECT value FROM json_each(event) WHERE key = 'customType' ORDER BY id DESC LIMIT 1) AS last_custom_type
      FROM navigation
    )
    UPDATE transcript_events SET
      navigation_type = CASE WHEN fields.first_type IN ('session', 'message', 'reset', 'compaction', 'custom_message', 'custom') THEN fields.first_type END,
      navigation_custom_type = CASE WHEN fields.first_custom_type IN ('openclaw.runtime-context', 'openclaw.cache-ttl') THEN fields.first_custom_type END,
      navigation_display = fields.display,
      message_role = CASE WHEN fields.role IN ('user', 'assistant', 'toolResult', 'system') THEN fields.role END,
      navigation_last_type = CASE WHEN fields.last_type IN ('session', 'message', 'reset', 'compaction', 'custom_message', 'custom') THEN fields.last_type END,
      navigation_last_custom_type = CASE WHEN fields.last_custom_type IN ('openclaw.runtime-context', 'openclaw.cache-ttl') THEN fields.last_custom_type END,
      navigation_valid = fields.valid
    FROM fields WHERE transcript_events.session_id = fields.session_id AND transcript_events.seq = fields.seq;
  `);
}
//#endregion
//#region src/state/openclaw-agent-outbox-sequence-migration.ts
/** Historical admission and migration witnesses retain the pre-sequence contract. */
function withoutOutboxEnqueueSequence(schema) {
	return schema.replace("  enqueue_sequence INTEGER PRIMARY KEY,\n  advancement_key TEXT NOT NULL UNIQUE,", "  advancement_key TEXT NOT NULL PRIMARY KEY,");
}
/** Rebuild within the schema owner's exclusive migration transaction. */
function migrateOutboxEnqueueSequenceInTransaction(database) {
	if (!tableExists$2(database, "context_engine_turn_outbox") || tableHasColumn(database, "context_engine_turn_outbox", "enqueue_sequence")) return null;
	const started = performance.now();
	const facts = getAdmittedSqliteSchemaFacts(database) ?? captureSqliteSchemaFacts(database);
	const objects = [...facts.indexDefinitions.values(), ...facts.triggers.values()].filter(({ table }) => table === "context_engine_turn_outbox");
	const schema = extractSqliteTableSchema(OPENCLAW_AGENT_SCHEMA_SQL, "context_engine_turn_outbox");
	database.exec(`
    ${schema.replace("IF NOT EXISTS context_engine_turn_outbox", "context_engine_turn_outbox_sequence_migration")}
    INSERT INTO context_engine_turn_outbox_sequence_migration
      (enqueue_sequence, advancement_key, engine_id, owner_plugin_id, session_id,
       payload_json, payload_state, attempt_count, last_attempt_at, last_error, created_at)
    SELECT rowid, advancement_key, engine_id, owner_plugin_id, session_id,
       payload_json, payload_state, attempt_count, last_attempt_at, last_error, created_at
    FROM context_engine_turn_outbox;
    DROP TABLE context_engine_turn_outbox;
    ALTER TABLE context_engine_turn_outbox_sequence_migration RENAME TO context_engine_turn_outbox;
  `);
	for (const object of objects) if (object.sql !== null) database.exec(object.sql);
	return performance.now() - started;
}
//#endregion
//#region src/state/openclaw-agent-session-participants-schema.ts
function sessionParticipantsSchemaSql() {
	return extractSqliteTableSchema(OPENCLAW_AGENT_SCHEMA_SQL, SESSION_PARTICIPANTS_TABLE, {
		endMarker: "CREATE TABLE IF NOT EXISTS session_key_contract (",
		includeEndMarker: false,
		errorMessage: "OpenClaw session participant schema markers are missing."
	});
}
createSqliteSchemaEnsurer(sessionParticipantsSchemaSql, { tables: [SESSION_PARTICIPANTS_TABLE] });
//#endregion
//#region src/state/openclaw-agent-participants-migration.ts
const LEGACY_PARTICIPANTS_SCHEMA = `CREATE TABLE IF NOT EXISTS session_participants (
  session_key TEXT NOT NULL,
  actor_type TEXT NOT NULL,
  actor_id TEXT NOT NULL,
  actor_source TEXT,
  contribution_count INTEGER,
  first_prompted_at INTEGER NOT NULL,
  last_prompted_at INTEGER NOT NULL,
  PRIMARY KEY (session_key, actor_type, actor_id),
  FOREIGN KEY (session_key) REFERENCES session_nodes(session_key) ON DELETE CASCADE
) STRICT;`;
const MIGRATION_TABLE = "session_participants_identity_migration";
const LEGACY_PARTICIPANT_OPTIONAL_COLUMNS = ["session_participants.actor_source", "session_participants.contribution_count"];
/** Historical structural/media validation must not require a future identity key. */
function withLegacySessionParticipantsSchema(sql) {
	return withoutCanonicalSessionValidationSchema(sql).replace(sessionParticipantsSchemaSql().trim(), LEGACY_PARTICIPANTS_SCHEMA);
}
function migrateSessionParticipantsSchema(database, pathname) {
	if (!tableExists$2(database, "session_participants")) return;
	assertSqliteSchemaContains(database, pathname, LEGACY_PARTICIPANTS_SCHEMA, { allowedMissingColumns: LEGACY_PARTICIPANT_OPTIONAL_COLUMNS });
	if (tableExists$2(database, MIGRATION_TABLE)) throw new Error(`Participant migration table already exists: ${MIGRATION_TABLE}`);
	if (database.prepare(`SELECT name FROM sqlite_schema
    WHERE (type IN ('trigger', 'index') AND tbl_name = 'session_participants' AND sql IS NOT NULL)
       OR (type IN ('view', 'trigger') AND sql LIKE '%session_participants%')`).all().length > 0) throw new Error("Participant migration cannot rebuild unknown indexes, views, or triggers.");
	for (const table of database.prepare("SELECT name FROM sqlite_schema WHERE type = 'table'").all()) if (database.prepare(`PRAGMA foreign_key_list("${String(table.name).replaceAll("\"", "\"\"")}")`).all().some((key) => key.table === "session_participants")) throw new Error("Participant migration cannot rebuild a table referenced by an unknown foreign key.");
	const source = tableHasColumn(database, "session_participants", "actor_source") ? "actor_source" : "NULL";
	const count = tableHasColumn(database, "session_participants", "contribution_count") ? "coalesce(contribution_count, 1)" : "1";
	const knownAgent = `actor_type = 'agent' AND ${source} = 'agent' AND actor_id <> ''`;
	const knownObservation = `(${knownAgent}) OR (actor_type = 'human' AND ${source} = 'channel')`;
	database.exec(`
    ${sessionParticipantsSchemaSql().replace("IF NOT EXISTS session_participants", MIGRATION_TABLE)}
    INSERT INTO ${MIGRATION_TABLE}
      (session_key, identity_namespace, actor_id, contribution_count, first_prompted_at, last_prompted_at)
    SELECT session_key,
      CASE
        WHEN actor_type = 'human' AND ${source} = 'profile' AND actor_id <> '' THEN json_object('type', 'profile')
        WHEN ${knownAgent} THEN json_object('type', 'agent')
        ELSE json_object('type', 'legacy', 'actorType', actor_type, 'source', ${source})
      END,
      actor_id, ${count},
      CASE WHEN ${knownObservation} THEN first_prompted_at ELSE NULL END,
      CASE WHEN ${knownObservation} THEN last_prompted_at ELSE NULL END
    FROM session_participants;
    DROP TABLE session_participants;
    ALTER TABLE ${MIGRATION_TABLE} RENAME TO session_participants;
  `);
}
//#endregion
//#region src/state/openclaw-agent-session-snapshots-schema.ts
function sessionEntrySnapshotsSchemaSql(schema) {
	return extractSqliteTableSchema(schema, "session_entry_snapshots", {
		endMarker: "CREATE INDEX IF NOT EXISTS idx_agent_session_nodes_updated_at",
		includeEndMarker: false
	});
}
/** Historical admission must validate the representation its reader actually understood. */
function withoutSessionEntrySnapshotsSchema(schema) {
	if (!schema.includes("CREATE TABLE IF NOT EXISTS session_entry_snapshots (")) return schema;
	return schema.replace("  snapshot_revision INTEGER NOT NULL DEFAULT 0,\n", "").replace(sessionEntrySnapshotsSchemaSql(schema), "");
}
//#endregion
//#region src/state/openclaw-agent-transcript-fts-schema.ts
const DEPLOYED_FTS_ROWS_SCHEMA = `CREATE TABLE IF NOT EXISTS session_transcript_fts_rows (
  session_id TEXT NOT NULL,
  fts_rowid INTEGER NOT NULL PRIMARY KEY
) STRICT;

CREATE INDEX IF NOT EXISTS idx_agent_transcript_fts_rows_session
  ON session_transcript_fts_rows(session_id);
`;
const RETIRED_FTS_ROWS = "session_transcript_fts_rows_legacy22";
/** Describe the deployed schema-22 predecessor, independently of the new row-map layout. */
function withDeployedTranscriptFtsRowSchema(legacyStorageSchema) {
	const indexState = extractSqliteTableSchema(legacyStorageSchema, "session_transcript_index_state");
	return legacyStorageSchema.replace(indexState, indexState.replace("  updated_at INTEGER NOT NULL,", "  fts_row_count INTEGER,\n  updated_at INTEGER NOT NULL,")).replace("CREATE VIRTUAL TABLE IF NOT EXISTS session_transcript_fts USING fts5(", `${DEPLOYED_FTS_ROWS_SCHEMA}\nCREATE VIRTUAL TABLE IF NOT EXISTS session_transcript_fts USING fts5(`);
}
/** Preserve the FTS content; replace only its old, possibly incomplete ownership projection. */
function migrateDeployedTranscriptFtsRowsInTransaction(db, schemaSql) {
	if (!db.isTransaction || db.prepare("PRAGMA foreign_keys").get()?.foreign_keys !== 0) throw new Error("Transcript FTS migration requires an admitted transaction with foreign keys off");
	assertSqliteSchemaContains(db, "deployed transcript FTS ownership", DEPLOYED_FTS_ROWS_SCHEMA);
	const columns = db.prepare("PRAGMA table_xinfo(session_transcript_fts_rows)").all();
	if (columns.length !== 2 || columns.some((column) => column.name !== "session_id" && column.name !== "fts_rowid")) throw new Error("Transcript FTS migration cannot discard unknown row-map columns");
	const dependents = db.prepare(`SELECT name FROM sqlite_schema
    WHERE (tbl_name = 'session_transcript_fts_rows' AND sql IS NOT NULL
      AND type IN ('index', 'trigger') AND name != 'idx_agent_transcript_fts_rows_session')
      OR (type IN ('view', 'trigger') AND sql LIKE '%session_transcript_fts_rows%')`).all();
	const children = db.prepare(`SELECT schema.name FROM sqlite_schema AS schema
    JOIN pragma_foreign_key_list(schema.name) AS fk
    WHERE schema.type = 'table' AND fk."table" = 'session_transcript_fts_rows'`).all();
	if (dependents.length || children.length) throw new Error("Transcript FTS migration cannot discard unknown row-map dependencies");
	if (db.prepare("SELECT 1 FROM sqlite_schema WHERE name = ?").get(RETIRED_FTS_ROWS)) throw new Error("Transcript FTS migration table already exists");
	db.exec(`ALTER TABLE session_transcript_fts_rows RENAME TO ${RETIRED_FTS_ROWS}`);
	db.exec(extractSqliteTableSchema(schemaSql, "session_transcript_fts_rows", {
		endMarker: "INSERT OR IGNORE INTO memory_index_state",
		includeEndMarker: false
	}));
	db.exec(`INSERT INTO session_transcript_fts_rows (id, session_id, message_id)
    SELECT rowid, session_id, message_id FROM session_transcript_fts`);
	db.exec(`UPDATE session_transcript_index_state AS state SET needs_rebuild = 1
    WHERE needs_rebuild = 0 AND (
      fts_row_count IS NULL
      OR fts_row_count != (SELECT count(*) FROM ${RETIRED_FTS_ROWS} AS old WHERE old.session_id = state.session_id)
      OR EXISTS (
        SELECT 1 FROM ${RETIRED_FTS_ROWS} AS old
        WHERE old.session_id = state.session_id AND NOT EXISTS (
          SELECT 1 FROM session_transcript_fts_rows AS current
          WHERE current.id = old.fts_rowid AND current.session_id = old.session_id))
      OR EXISTS (
        SELECT 1 FROM session_transcript_fts_rows AS current
        WHERE current.session_id = state.session_id AND NOT EXISTS (
          SELECT 1 FROM ${RETIRED_FTS_ROWS} AS old
          WHERE old.fts_rowid = current.id AND old.session_id = current.session_id))
    );
    DROP TABLE ${RETIRED_FTS_ROWS};
    ALTER TABLE session_transcript_index_state DROP COLUMN fts_row_count;`);
}
//#endregion
//#region src/state/openclaw-agent-storage-schema.ts
const LEGACY_STORAGE_TABLES = {
	transcript_events: `CREATE TABLE IF NOT EXISTS transcript_events (
  session_id TEXT NOT NULL,
  seq INTEGER NOT NULL,
  event_json TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  PRIMARY KEY (session_id, seq),
  FOREIGN KEY (session_id) REFERENCES "session_windows"(session_id) ON DELETE CASCADE
) STRICT;`,
	memory_index_chunks: `CREATE TABLE IF NOT EXISTS memory_index_chunks (
  id TEXT PRIMARY KEY,
  path TEXT NOT NULL,
  source TEXT NOT NULL DEFAULT 'memory',
  start_line INTEGER NOT NULL,
  end_line INTEGER NOT NULL,
  hash TEXT NOT NULL,
  model TEXT NOT NULL,
  text TEXT NOT NULL,
  embedding TEXT NOT NULL,
  updated_at INTEGER NOT NULL
) STRICT;`,
	memory_embedding_cache: `CREATE TABLE IF NOT EXISTS memory_embedding_cache (
  provider TEXT NOT NULL,
  model TEXT NOT NULL,
  provider_key TEXT NOT NULL,
  hash TEXT NOT NULL,
  embedding TEXT NOT NULL,
  dims INTEGER,
  updated_at INTEGER NOT NULL,
  PRIMARY KEY (provider, model, provider_key, hash)
) STRICT;`
};
/** Preserve historical storage contracts before the admitted schema-23 cutover. */
function withLegacyAgentStorageSchema(schema, version = 21) {
	let historicalSchema = withoutSessionEntrySnapshotsSchema(schema);
	for (const [table, legacySchema] of Object.entries(LEGACY_STORAGE_TABLES)) historicalSchema = historicalSchema.replace(extractSqliteTableSchema(historicalSchema, table), legacySchema);
	if (historicalSchema.includes("CREATE TABLE IF NOT EXISTS session_transcript_fts_rows (")) historicalSchema = historicalSchema.replace(extractSqliteTableSchema(historicalSchema, "session_transcript_fts_rows", {
		endMarker: "INSERT OR IGNORE INTO memory_index_state",
		includeEndMarker: false
	}), "");
	return version === 22 ? withDeployedTranscriptFtsRowSchema(historicalSchema) : historicalSchema;
}
//#endregion
//#region src/state/openclaw-agent-session-sharing-schema.ts
const SUGGESTIONS_SCHEMA_START = "CREATE TABLE IF NOT EXISTS session_suggestions (";
const sessionSharingSchema = extractSqliteTableSchema(AGENT_SCHEMA_WITHOUT_PROGRESS_CARD_SQL, "session_members", {
	endMarker: "CREATE TABLE IF NOT EXISTS heartbeat_outcomes (",
	includeEndMarker: false,
	errorMessage: "OpenClaw agent session-sharing schema markers are missing."
});
const sessionSuggestionsStart = sessionSharingSchema.indexOf(SUGGESTIONS_SCHEMA_START);
if (sessionSuggestionsStart === -1) throw new Error("OpenClaw agent session-suggestions schema marker is missing.");
const AGENT_V14_SESSION_SHARING_SCHEMA_SQL = sessionSharingSchema.slice(0, sessionSuggestionsStart);
const AGENT_V14_ADDITIVE_SCHEMA_SQL = sessionSharingSchema.slice(sessionSuggestionsStart);
const AGENT_V14_CORE_SCHEMA_SQL = withLegacySessionParticipantsSchema(withLegacyAgentStorageSchema(withLegacyCanonicalSessionValidationTriggers(withoutAgentJsonPredicateColumns(withoutOutboxEnqueueSequence(AGENT_SCHEMA_WITHOUT_PROGRESS_CARD_SQL.replace(sessionSharingSchema, ""))))));
//#endregion
//#region src/state/openclaw-agent-db-schema-helpers.ts
/** Compare historical migration targets against only the representation they support. */
function getOpenClawAgentMigrationSchema(targetVersion) {
	const sequenceSchemaSql = targetVersion < 27 ? withoutOutboxEnqueueSequence(OPENCLAW_AGENT_SCHEMA_SQL) : OPENCLAW_AGENT_SCHEMA_SQL;
	const predicateSchemaSql = targetVersion < 26 ? withoutAgentJsonPredicateColumns(sequenceSchemaSql) : sequenceSchemaSql;
	const canonicalSchemaSql = targetVersion < 25 ? withLegacyCanonicalSessionValidationTriggers(predicateSchemaSql) : predicateSchemaSql;
	const sessionSchemaSql = targetVersion < 24 ? withoutSessionEntrySnapshotsSchema(canonicalSchemaSql) : canonicalSchemaSql;
	const targetSchemaSql = targetVersion < 23 ? withLegacyAgentStorageSchema(sessionSchemaSql, targetVersion) : sessionSchemaSql;
	return targetVersion < 18 ? withLegacySessionParticipantsSchema(targetSchemaSql) : targetVersion < 21 ? withoutCanonicalSessionValidationSchema(targetSchemaSql) : targetSchemaSql;
}
function migratedSessionColumn(columns, columnName, fallback) {
	return columns.has(columnName) ? columnName : fallback;
}
function hasRetiredAgentStateLeaseSchema(database) {
	return Boolean(database.prepare("SELECT 1 FROM main.sqlite_schema WHERE name = 'state_leases'").get());
}
function assertOpenClawAgentSchemaContains(database, pathname, schemaSql, participantSchema = "current", allowStartupIndexRepair = false) {
	const compatibility = {
		...AGENT_SCHEMA_COMPATIBILITY,
		allowedMissingTables: [...AGENT_SCHEMA_COMPATIBILITY.allowedMissingTables, ...participantSchema === "legacy" ? ["session_transcript_cold_archives"] : []],
		allowedMissingColumns: [...AGENT_SCHEMA_COMPATIBILITY.allowedMissingColumns, ...participantSchema === "legacy" ? LEGACY_PARTICIPANT_OPTIONAL_COLUMNS : []]
	};
	if (!allowStartupIndexRepair) {
		assertSqliteSchemaContains(database, pathname, schemaSql, compatibility);
		return false;
	}
	const repairableIndexes = new Set(getCanonicalSqliteNamedIndexContracts(schemaSql).map((index) => index.name));
	const issues = collectSqliteSchemaIssues(database, schemaSql, compatibility);
	if (issues.some((issue) => issue.code !== "missing-or-drifted-index" || !repairableIndexes.has(issue.objectName))) throwSqliteSchemaMismatches(pathname, legacySqliteSchemaIssueMessages(issues));
	return issues.length > 0;
}
function assertOpenClawAgentCurrentRuntimeSchema(database, options) {
	const agentId = normalizeAgentId(options.agentId);
	assertCurrentAgentSchemaMetadata(readExistingAgentSchemaMeta(database), agentId, options.pathname);
	if (hasRetiredAgentStateLeaseSchema(database)) throw new SqliteSchemaMismatchError(`OpenClaw agent database ${options.pathname} retains retired state_leases storage; run openclaw doctor --fix before using it.`);
	assertOpenClawAgentSchemaContains(database, options.pathname, OPENCLAW_AGENT_SCHEMA_SQL);
}
function hasAnyCanonicalTable(database, schemaSql) {
	const tableNames = getCanonicalSqliteTableNames(schemaSql);
	const placeholders = tableNames.map(() => "?").join(", ");
	return Boolean(database.prepare(`SELECT 1 FROM main.sqlite_schema
         WHERE type = 'table' AND name IN (${placeholders})
         LIMIT 1`).get(...tableNames));
}
function repairAndAssertAgentSchemaGroup(database, pathname, schemaSql) {
	repairCanonicalSqliteIndexes(database, pathname, schemaSql, { verifyPhysicalIntegrity: false });
	assertOpenClawAgentSchemaContains(database, pathname, schemaSql, "legacy");
}
/** Ensure the additive session-key contract table inside the caller's transaction. */
function ensureSessionKeyContractSchemaInTransaction(db) {
	if (tableExists$2(db, "session_key_contract") && db.prepare("SELECT 1 FROM session_key_contract WHERE id = 1").get()) return;
	db.exec(extractSqliteTableSchema(OPENCLAW_AGENT_SCHEMA_SQL, "session_key_contract", {
		endMarker: "CREATE TABLE IF NOT EXISTS session_windows (",
		includeEndMarker: false,
		errorMessage: "OpenClaw agent session-key contract schema markers are missing."
	}));
}
function ensureSessionReactionsSchemaInTransaction(db) {
	const schema = getAdmittedSqliteSchemaFacts(db);
	if (schema?.tables.has("session_reactions") && schema.indexes.has("idx_agent_session_reactions_message")) return;
	db.exec(extractSqliteTableSchema(OPENCLAW_AGENT_SCHEMA_SQL, "session_reactions", {
		endMarker: "CREATE TABLE IF NOT EXISTS board_tabs (",
		includeEndMarker: false,
		errorMessage: "OpenClaw agent session-reactions schema markers are missing."
	}));
}
function repairAndAssertOpenClawAgentV14SchemaForMigration(database, options) {
	const userVersion = readSqliteUserVersion(database);
	if (userVersion !== 14) throw new SqliteSchemaMismatchError(`OpenClaw agent database ${options.pathname} uses schema version ${userVersion}; expected 14 before migrating it.`);
	const agentId = normalizeAgentId(options.agentId);
	const metadata = readExistingAgentSchemaMeta(database);
	if (!metadata) throw new SqliteSchemaMismatchError(`OpenClaw agent database ${options.pathname} has no schema ownership metadata. Run openclaw doctor --fix to inspect and repair its ownership.`);
	assertExistingAgentSchemaOwner(metadata, agentId, options.pathname);
	if (metadata.schemaVersion !== 14) throw new SqliteSchemaMismatchError(`OpenClaw agent database ${options.pathname} metadata schema version ${metadata.schemaVersion ?? "invalid"} does not match 14; repair the ownership metadata before migrating it.`);
	ensureSessionAdditiveColumns(database);
	ensureSessionEntryValidityProjection(database);
	ensureLegacySessionEntryValidityTriggers(database);
	ensureSessionKeyContractSchemaInTransaction(database);
	repairAndAssertAgentSchemaGroup(database, options.pathname, AGENT_V14_CORE_SCHEMA_SQL);
	if (hasAnyCanonicalTable(database, AGENT_V14_SESSION_SHARING_SCHEMA_SQL)) repairAndAssertAgentSchemaGroup(database, options.pathname, AGENT_V14_SESSION_SHARING_SCHEMA_SQL);
	if (hasAnyCanonicalTable(database, AGENT_V14_ADDITIVE_SCHEMA_SQL)) repairAndAssertAgentSchemaGroup(database, options.pathname, AGENT_V14_ADDITIVE_SCHEMA_SQL);
	if (hasAnyCanonicalTable(database, AGENT_V14_BOARD_SCHEMA_SQL)) {
		assertSqliteSchemaTablesPresent(database, options.pathname, AGENT_V14_BOARD_SCHEMA_SQL);
		ensureOpenClawAgentBoardSchemaInTransaction(database);
		repairAndAssertAgentSchemaGroup(database, options.pathname, AGENT_V14_BOARD_SCHEMA_SQL);
	}
	if (hasAnyCanonicalTable(database, AGENT_PROGRESS_CARD_SCHEMA_SQL)) {
		assertSqliteSchemaTablesPresent(database, options.pathname, AGENT_PROGRESS_CARD_SCHEMA_SQL);
		ensureOpenClawAgentProgressCardSchemaInTransaction(database);
		repairAndAssertAgentSchemaGroup(database, options.pathname, AGENT_PROGRESS_CARD_SCHEMA_SQL);
	}
}
const RETIRED_AGENT_STATE_LEASE_SCHEMA_SQL = `
CREATE TABLE state_leases (
  scope TEXT NOT NULL,
  lease_key TEXT NOT NULL,
  owner TEXT NOT NULL,
  expires_at INTEGER,
  heartbeat_at INTEGER,
  payload_json TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  PRIMARY KEY (scope, lease_key)
) STRICT;
`;
function migrateRetiredAgentStateLeaseSchema(db, pathname, targetVersion) {
	if (targetVersion < 17 || !hasRetiredAgentStateLeaseSchema(db)) return;
	assertSqliteSchemaContains(db, pathname, RETIRED_AGENT_STATE_LEASE_SCHEMA_SQL);
	db.exec("DROP TABLE state_leases;");
}
function assertAgentSchemaVersion(db, options, schemaSql) {
	const metadata = readExistingAgentSchemaMeta(db);
	assertExistingAgentSchemaOwner(metadata, options.agentId, options.pathname);
	if (readSqliteUserVersion(db) !== options.version || metadata?.schemaVersion !== options.version) throw new SqliteSchemaMismatchError(`OpenClaw agent database ${options.pathname} did not converge on schema version ${options.version}.`);
	assertOpenClawAgentSchemaContains(db, options.pathname, schemaSql, options.version < 18 ? "legacy" : "current");
}
function finishAgentSchemaMigration(db, agentId, pathname, targetVersion, schemaSql, requiresMaintenance, assertMigration) {
	db.exec(`PRAGMA user_version = ${targetVersion};`);
	persistAgentSchemaMetadata(db, agentId, targetVersion);
	assertAgentSchemaVersion(db, {
		agentId,
		pathname,
		version: targetVersion
	}, schemaSql);
	if (requiresMaintenance && db.prepare("PRAGMA foreign_key_check").all().length > 0) throw new Error(`Agent schema migration failed foreign key validation for ${pathname}.`);
	assertMigration();
}
function hasLegacyMemoryChunkProvenanceTrigger(db) {
	return Boolean(db.prepare("SELECT 1 FROM sqlite_schema WHERE type = 'trigger' AND name = 'memory_index_chunk_provenance_after_insert'").get());
}
function hasPendingMemoryChunkMetadataMigration(db) {
	return hasLegacyMemoryRecallMetadataColumns(db) || hasLegacyMemoryChunkProvenanceTrigger(db);
}
function hasPendingSessionKeyContractSchemaMigration(db) {
	const sessionNodeColumns = readSqliteTableColumns(db, "session_nodes");
	if (!sessionNodeColumns) return false;
	const hasContractTable = tableExists$2(db, "session_key_contract");
	return !sessionNodeColumns.has("entry_valid") || !hasContractTable;
}
function hasPendingCurrentVersionAgentDatabaseMigration(database) {
	return !tableExists$2(database, "session_reactions") || hasPendingMemoryChunkMetadataMigration(database) || hasPendingSessionKeyContractSchemaMigration(database) || hasRetiredAgentStateLeaseSchema(database) || hasPendingAgentStartupColumns((getAdmittedSqliteSchemaFacts(database) ?? captureSqliteSchemaFacts(database)).tableSql);
}
//#endregion
//#region src/state/openclaw-agent-db-lifecycle.ts
const agentDbLog = createSubsystemLogger("state/agent-db");
const OPENCLAW_AGENT_DB_SLOW_OPEN_MS = 1e3;
const cache = resolveGlobalSingleton(Symbol.for("openclaw.agentDatabaseLifecycle"), () => ({
	databases: /* @__PURE__ */ new Map(),
	borrowers: /* @__PURE__ */ new WeakMap(),
	idleTimers: /* @__PURE__ */ new WeakMap(),
	failures: /* @__PURE__ */ new Map(),
	leases: /* @__PURE__ */ new Map(),
	terminal: createSqliteTerminalOpenLatch({ closeByPath: (pathname) => closeOpenClawAgentDatabaseByPath(pathname) }),
	unregisterExitClose: null,
	pending: /* @__PURE__ */ new Map(),
	activePending: /* @__PURE__ */ new Set(),
	retainedCloses: /* @__PURE__ */ new Set()
}));
const closeCachedOpenClawAgentDatabase = createAgentDatabaseHandleCloser(cache);
function registerAgentDatabaseHandle(database, leaseId, env) {
	cache.leases.set(database.path, {
		leaseId,
		env
	});
	cache.databases.set(database.path, database);
}
function logResourceCloseFailure(pathname, error) {
	agentDbLog.warn("Agent database resource close failed", {
		path: pathname,
		error
	});
}
function unregisterUnusedAgentDatabaseExitClose() {
	if (cache.databases.size === 0 && cache.retainedCloses.size === 0) {
		cache.unregisterExitClose?.();
		cache.unregisterExitClose = null;
	}
}
/** Each physical-open generator owns these checkpoints across any integrity await. */
function startAgentDatabaseOpenTiming(agentId, pathname, admissionMode, diagnostics) {
	const startedAt = performance$1.now();
	let elapsedMs = 0;
	const phaseDurationsMs = {
		open: 0,
		validation: 0,
		configuration: 0,
		schema: 0,
		registration: 0
	};
	return (phase) => {
		const completedMs = Math.floor(performance$1.now() - startedAt);
		phaseDurationsMs[phase] = completedMs - elapsedMs;
		elapsedMs = completedMs;
		if (phase === "validation" && diagnostics.integrityGateReason) agentDbLog.info("agent database integrity gate", {
			agentId,
			path: pathname,
			pid: process.pid,
			threadId,
			isMainThread,
			admissionMode,
			...diagnostics
		});
		if (phase === "registration" && elapsedMs >= OPENCLAW_AGENT_DB_SLOW_OPEN_MS) agentDbLog.warn("slow OpenClaw agent database open", {
			agentId,
			elapsedMs,
			path: pathname,
			pid: process.pid,
			threadId,
			isMainThread,
			admissionMode,
			phaseDurationsMs,
			...diagnostics,
			thresholdMs: OPENCLAW_AGENT_DB_SLOW_OPEN_MS
		});
	};
}
function retainFailedAgentDatabaseClose(agentId, pathname, close) {
	const retained = {
		agentId,
		path: pathname,
		close: () => {
			close();
			cache.retainedCloses.delete(retained);
		}
	};
	cache.retainedCloses.add(retained);
	getOpenClawDatabaseMaintenanceScope()?.own(retained, "agent-handles", retained.close);
	cache.unregisterExitClose ??= registerSqliteCacheExitClose(closeOpenClawAgentDatabases);
}
function revokePendingAgentDatabaseOpen(pathname, expectedAgentId) {
	for (const pending of cache.activePending) if (pending.path === pathname && (expectedAgentId === void 0 || pending.agentId === expectedAgentId)) pending.controller.abort(/* @__PURE__ */ new Error(`Agent database open was revoked: ${pathname}`));
}
function retainAgentDatabase(db) {
	observeOpenClawDatabaseMaintenanceResource(db);
	const borrowers = cache.borrowers.get(db) ?? /* @__PURE__ */ new Set();
	const borrower = {};
	borrowers.add(borrower);
	cache.borrowers.set(db, borrowers);
	return () => {
		if (borrowers.delete(borrower) && borrowers.size === 0) cache.idleTimers.get(db)?.refresh();
	};
}
/** Activity and final borrower release use the same idle or post-grace eviction. */
function refreshAgentDatabaseIdleTimer(database) {
	const existing = cache.idleTimers.get(database.db);
	if (existing) {
		existing.refresh();
		return;
	}
	const cleanupSignal = getGatewayShutdownCleanupSignal();
	const closeIdle = () => {
		if (cache.databases.get(database.path) !== database) {
			cache.idleTimers.get(database.db)?.[Symbol.dispose]();
			cache.idleTimers.delete(database.db);
			return;
		}
		if (database.db.isOpen && cache.borrowers.get(database.db)?.size) return;
		if (database.db.isOpen && database.db.isTransaction) {
			timer.refresh();
			return;
		}
		try {
			closeCachedOpenClawAgentDatabase(database);
			cache.databases.delete(database.path);
			cache.failures.delete(database.path);
			unregisterUnusedAgentDatabaseExitClose();
		} catch (error) {
			logResourceCloseFailure(database.path, error);
			timer.refresh();
		}
	};
	const refresh = () => {
		if (cleanupSignal.aborted) runInDetachedAsyncContext(() => queueMicrotask(closeIdle));
		else timer.refresh();
	};
	const timer = runInDetachedAsyncContext(() => setTimeout(closeIdle, SQLITE_IDLE_HANDLE_TTL_MS));
	const cleanupListener = addAbortListener(cleanupSignal, refresh);
	timer.unref();
	cache.idleTimers.set(database.db, {
		refresh,
		[Symbol.dispose]() {
			clearTimeout(timer);
			cleanupListener[Symbol.dispose]();
		}
	});
}
/** Dispose only this publication; a later admission at the same path is independent. */
async function closeMaintenanceAgentDatabase(database) {
	await database.walMaintenance.stop();
	if (cache.databases.get(database.path) !== database) return;
	closeCachedOpenClawAgentDatabase(database);
	cache.databases.delete(database.path);
	cache.failures.delete(database.path);
}
/** A lifecycle scope closes its exact connection and retains its borrow until disposal succeeds. */
function createAgentDatabaseScopeOwnedClose(database, owner) {
	const release = retainAgentDatabase(database.db);
	return async () => {
		if (cache.databases.get(database.path) === database) await closeOpenClawAgentDatabaseByPathAsync(database.path, database.agentId);
		else if (database.db.isOpen) throw new Error(`${owner} lost its database close owner.`);
		release();
	};
}
/** Close one cached agent database identified by its exact resolved pathname. */
function closeOpenClawAgentDatabaseByPath(pathname, expectedAgentId) {
	const resolvedPath = path.resolve(pathname);
	revokeAgentDatabaseResources({
		path: resolvedPath,
		agentId: expectedAgentId
	}, logResourceCloseFailure);
	revokePendingAgentDatabaseOpen(resolvedPath, expectedAgentId);
	for (const retained of cache.retainedCloses) if (retained.path === resolvedPath && (expectedAgentId === void 0 || retained.agentId === expectedAgentId)) retained.close();
	const database = cache.databases.get(resolvedPath);
	if (!database || expectedAgentId !== void 0 && database.agentId !== expectedAgentId) return false;
	closeCachedOpenClawAgentDatabase(database);
	cache.databases.delete(resolvedPath);
	cache.failures.delete(resolvedPath);
	unregisterUnusedAgentDatabaseExitClose();
	return true;
}
function closeOpenClawAgentDatabases(rootPath) {
	revokeAgentDatabaseResources({ rootPath }, logResourceCloseFailure);
	for (const pathname of cache.pending.keys()) if (rootPath === void 0 || isPathInside(rootPath, pathname)) revokePendingAgentDatabaseOpen(pathname);
	for (const retained of cache.retainedCloses) if (rootPath === void 0 || isPathInside(rootPath, retained.path)) retained.close();
	for (const pathname of cache.databases.keys()) if (rootPath === void 0 || isPathInside(rootPath, pathname)) closeOpenClawAgentDatabaseByPath(pathname);
}
/** Latch background verification damage so later opens fail without rescanning. */
function recordOpenClawAgentDatabaseOpenFailure(pathname, error, generation) {
	const recorded = cache.terminal.record(pathname, error, generation);
	if (recorded) invalidateOpenClawAgentDatabaseValidation(pathname);
	return recorded;
}
async function drainPendingAgentDatabaseOpens(selection) {
	while (true) {
		const pending = [...cache.activePending].filter((owner) => matchesAgentDatabaseClose(selection, owner));
		if (pending.length === 0) return;
		for (const owner of pending) revokePendingAgentDatabaseOpen(owner.path, selection.agentId);
		await Promise.allSettled(pending.map((owner) => owner.promise));
	}
}
/** Drain the exact retained owner before deletion, quarantine, or file replacement. */
async function closeOpenClawAgentDatabaseByPathAsync(pathname, expectedAgentId) {
	const selection = {
		path: path.resolve(pathname),
		agentId: expectedAgentId
	};
	revokePendingAgentDatabaseOpen(selection.path, expectedAgentId);
	return drainAgentDatabaseResources(selection, async () => {
		await drainPendingAgentDatabaseOpens(selection);
		const database = cache.databases.get(selection.path);
		if (database && (expectedAgentId === void 0 || database.agentId === expectedAgentId)) await database.walMaintenance.stop();
		return closeOpenClawAgentDatabaseByPath(selection.path, expectedAgentId);
	});
}
/** Read a database's durable role and agent owner without mutating it. */
function inspectOpenClawAgentDatabaseOwner(pathname, options) {
	let db;
	try {
		const resolvedPath = path.resolve(pathname);
		const opened = cache.databases.get(resolvedPath);
		if (!options?.revalidateSchema && opened?.db.isOpen && !cache.failures.has(resolvedPath)) {
			runSqliteReadOperationSync(opened.db, () => assertSupportedAgentSchemaVersion(opened.db, pathname));
			refreshAgentDatabaseIdleTimer(opened);
			return {
				status: "owned",
				agentId: opened.agentId
			};
		}
		db = openSqliteReadOnlyDatabase(pathname, { readOnly: true });
		setSqliteBusyTimeout(db, OPENCLAW_SQLITE_BUSY_TIMEOUT_MS);
		if (options?.revalidateSchema) invalidateSqliteSchemaFacts(db);
		assertSupportedAgentSchemaVersion(db, pathname);
		const existing = readExistingAgentSchemaMeta(db);
		if (!existing) return { status: "unowned" };
		if (existing.role !== "agent" || !existing.agentId) return { status: "unreadable" };
		return {
			status: "owned",
			agentId: normalizeAgentId(existing.agentId)
		};
	} catch {
		return { status: "unreadable" };
	} finally {
		db?.close();
	}
}
//#endregion
//#region src/state/openclaw-agent-write-admission.ts
const reservationDiagnostics = channel("openclaw.agent-database.reservation");
function observeWriteAdmission(operation, timing, run, caller, worker) {
	const observed = timing ?? {};
	observed.operation ??= operation;
	observed.caller ??= caller;
	observed.worker ??= worker;
	if (timing) return run(observed);
	const enqueuedAt = performance$1.now();
	const report = (outcome) => {
		if (observed.reentrant !== false || observed.startedAt === void 0 || observed.finishedAt === void 0 || observed.finishedAt - enqueuedAt < 1e3 && !reservationDiagnostics.hasSubscribers) return;
		const completedAt = performance$1.now();
		const fields = {
			operation,
			...caller ? { caller } : {},
			...worker ? {
				workerOperations: [...worker.operations],
				...worker.transactionCount !== void 0 ? { transactionCount: worker.transactionCount } : {}
			} : {},
			...observed.blockingOperation ? { blockingOperation: observed.blockingOperation } : {},
			...observed.blockingCaller ? { blockingCaller: observed.blockingCaller } : {},
			...observed.blockingWorker ? { blockingWorkerOperations: [...observed.blockingWorker.operations] } : {},
			outcome,
			pid: process.pid,
			threadId,
			isMainThread,
			reentrant: false,
			elapsedMs: Math.round(completedAt - enqueuedAt),
			queueWaitMs: Math.round(observed.startedAt - enqueuedAt),
			writerExecutionMs: Math.round(observed.finishedAt - observed.startedAt),
			completionDelayMs: Math.round(completedAt - observed.finishedAt)
		};
		if (reservationDiagnostics.hasSubscribers) reservationDiagnostics.publish(fields);
		if (observed.finishedAt - enqueuedAt < 1e3) return;
		try {
			getChildLogger({ subsystem: "session-sqlite" }).warn(fields, "slow agent database reservation");
		} catch {}
	};
	return run(observed).then((value) => {
		report("ok");
		return value;
	}, (error) => {
		report("error");
		throw error;
	});
}
function runOpenClawAgentWriteAdmission(options, run, reentrant = false, timing, signal, caller) {
	return runOpenClawAgentPathWriteAdmission(resolveOpenClawAgentSqlitePath(options), run, reentrant, timing, signal, caller);
}
/** A captured physical actor needs no logical agent or ambient path resolution. */
function runOpenClawAgentPathWriteAdmission(pathname, run, reentrant = false, timing, signal, caller) {
	const identity = readDatabasePathIdentitySync(pathname);
	const storePath = identity.canonicalPath;
	const assertCurrent = () => {
		if (identity.key.startsWith("file:")) try {
			assertExistingDatabaseIdentity(pathname, identity.key, identity.birthtime);
		} catch (cause) {
			throw new Error("Agent database target changed before write admission", { cause });
		}
		else if (readDatabasePathIdentitySync(pathname).canonicalPath !== storePath) throw new Error("Agent database target changed before write admission");
	};
	return observeWriteAdmission("direct", timing, (observed) => {
		const holder = agentDatabaseWriteAdmissionState.queues.get(storePath)?.holder;
		observed.blockingOperation = holder?.operation;
		observed.blockingCaller = holder?.caller;
		observed.blockingWorker = holder?.worker;
		return runWithSqliteDatabaseAdmissionTurn([pathname], () => runQueuedStoreWrite({
			queues: agentDatabaseWriteAdmissionState.queues,
			storePath,
			label: "agent database write admission",
			reentrant: reentrant && !agentDatabaseWriteAdmissionState.queues.get(storePath)?.holder?.worker,
			fn: async () => {
				assertCurrent();
				const queue = agentDatabaseWriteAdmissionState.queues.get(storePath);
				const previousHolder = queue.holder;
				queue.holder = observed;
				try {
					return await run(identity, assertCurrent);
				} finally {
					queue.holder = previousHolder;
				}
			},
			timing: observed,
			signal
		}), [], signal);
	}, caller);
}
/** Reserve a native write permit without admitting inherited foreground callbacks. */
async function runOpenClawAgentWorkerWrite(options, run, timing, signal, priority, caller) {
	if (priority === "background") {
		const storePath = readDatabasePathIdentitySync(resolveOpenClawAgentSqlitePath(options)).canonicalPath;
		let draining;
		while (draining = agentDatabaseWriteAdmissionState.queues.get(storePath)?.drainPromise) await racePromiseWithAbortSignal(draining, signal, (aborted) => aborted.reason);
	}
	const worker = { operations: /* @__PURE__ */ new Set() };
	return observeWriteAdmission("worker", timing, (observed) => runOpenClawAgentWriteAdmission(options, () => withSqliteWorkerReservationObservation(worker, run), true, observed, signal), caller, worker);
}
//#endregion
export { migrateCanonicalSessionWriterValidation as $, sessionEntrySnapshotsSchemaSql as A, setOpenClawAgentDatabaseValidation as At, migrateSessionCreatorNamespaces as B, migrateMemoryIndexStorage as Bt, hasPendingCurrentVersionAgentDatabaseMigration as C, getOpenClawAgentDatabaseValidationForTransfer as Ct, repairAndAssertOpenClawAgentV14SchemaForMigration as D, markOpenClawAgentCanonicalValidation as Dt, migratedSessionColumn as E, invalidateOpenClawAgentDatabaseValidation as Et, assertSupportedAgentMigrationSchemas as F, canonicalSessionValidationSchemaSql as Ft, parseSqliteSessionEntryRecord as G, migrateSessionTranscriptGenerations as H, ensureMemoryChunkProvenance as Ht, backfillSessionConversations as I, classifyOpenClawAgentDatabaseReadError as It, assertExistingAgentSchemaOwner as J, assertCanonicalAgentPersistenceVersion as K, ensureSessionAdditiveColumns as L, recordOpenClawAgentDatabaseReadOpenFailure as Lt, migrateSessionParticipantsSchema as M, loadOpenClawAgentCanonicalValidationReceipt as Mt, migrateOutboxEnqueueSequenceInTransaction as N, adoptCanonicalSessionValidationSchema as Nt, withLegacyAgentStorageSchema as O, publishOpenClawAgentDatabaseSchema as Ot, migrateAgentJsonPredicatesInTransaction as P, assertCanonicalSessionValidationSchema as Pt, ensureLegacySessionEntryValidityTriggers as Q, ensureSessionEntryValidityProjection as R, ensureOpenClawAgentBoardSchemaInTransaction as Rt, getOpenClawAgentMigrationSchema as S, getOpenClawAgentDatabaseValidation as St, migrateRetiredAgentStateLeaseSchema as T, hasRevokedOpenClawAgentDatabaseValidation as Tt, readSqliteTableColumns as U, migrateSessionTranscriptActiveProjection as V, ensureMemoryRecallMetadataSchema as Vt, normalizeConversationPeerId as W, hasAgentDatabaseApplicationSchema as X, assertSupportedAgentSchemaVersion as Y, persistAgentSchemaMetadata as Z, assertOpenClawAgentCurrentRuntimeSchema as _, recordAgentDatabaseStartupFtsRepair as _t, closeOpenClawAgentDatabaseByPathAsync as a, hasAgentDatabaseMaintenanceAuthority as at, ensureSessionReactionsSchemaInTransaction as b, captureOpenClawAgentDatabaseAdmissionPublication as bt, inspectOpenClawAgentDatabaseOwner as c, renewAgentDatabaseMaintenanceAuthorityIfPresent as ct, registerAgentDatabaseHandle as d, assertAgentDatabaseAdmitted as dt, seedCanonicalSessionValidationPending as et, retainAgentDatabase as f, canIsolateAgentDatabase as ft, assertAgentSchemaVersion as g, inspectAgentDatabaseAdmission as gt, startAgentDatabaseOpenTiming as h, createAgentDatabaseInspectionRefusal as ht, closeMaintenanceAgentDatabase as i, claimOpenClawAgentDatabaseLease as it, withoutSessionEntrySnapshotsSchema as j, agentDatabaseValidationKey as jt, migrateDeployedTranscriptFtsRowsInTransaction as k, retireReplacedAgentValidation as kt, recordOpenClawAgentDatabaseOpenFailure as l, agentDatabaseAdmissionProvenanceRefusal as lt, revokePendingAgentDatabaseOpen as m, captureAgentDatabasePreparationJournal as mt, cache as n, assertAgentDatabaseMaintenanceAuthorityIfPresent as nt, closeOpenClawAgentDatabases as o, recordOpenClawAgentDatabaseAdmission as ot, retainFailedAgentDatabaseClose as p, captureAgentDatabaseAdmission as pt, assertCurrentAgentSchemaMetadata as q, closeCachedOpenClawAgentDatabase as r, assertOpenClawAgentDatabaseLease as rt, createAgentDatabaseScopeOwnedClose as s, releaseOpenClawAgentDatabaseLease as st, runOpenClawAgentWorkerWrite as t, assertAgentDatabaseMaintenanceAuthority as tt, refreshAgentDatabaseIdleTimer as u, getGatewayRestartDrainSignal as ut, assertOpenClawAgentSchemaContains as v, adoptOpenClawAgentDatabaseSchema as vt, hasPendingMemoryChunkMetadataMigration as w, hasOpenClawAgentCanonicalValidation as wt, finishAgentSchemaMigration as x, captureOpenClawAgentDatabaseAliasPublication as xt, ensureSessionKeyContractSchemaInTransaction as y, adoptOpenClawAgentDatabaseValidation as yt, migrateConversationDeliveryTargetColumn as z, migrateMemoryIndexSourcesIdentity as zt };
