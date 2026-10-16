import { a as runSqliteImmediateTransactionSync } from "./sqlite-transaction-DsZ3X6nD.mjs";
import { C as ensureMemoryRecallMetadataSchema, E as ensureMemoryChunkProvenance, S as MEMORY_INDEX_CHUNK_RECALL_METADATA_TABLE, _ as dropMemoryChunkFtsTriggers, b as ensureMemoryPathFtsTriggers, m as MEMORY_INDEX_PATHS_FTS_TABLE, p as MEMORY_INDEX_FTS_TABLE, v as dropMemoryPathFtsTriggers, x as rebuildMemoryChunkFts, y as ensureMemoryChunkFtsTriggers } from "./memory-schema-BA04oCjG.mjs";
import "./memory-core-host-engine-schema-C2UMfTcl.mjs";
import { t as markMemoryVectorIndexClean } from "./manager-vector-rebuild-state-DWrs_Mbx.mjs";
import "./sqlite-worker-runtime-BFi6Nryt.mjs";
//#region extensions/memory-core/src/memory/manager-db-kernel.ts
const MEMORY_REINDEX_SCHEMA = "memory_reindex";
function tableExists(db, schema, tableName) {
	return db.prepare(`SELECT 1 AS ok FROM ${schema}.sqlite_master WHERE type = 'table' AND name = ?`).get(tableName)?.ok === 1;
}
function readTableSql(db, schema, tableName) {
	const row = db.prepare(`SELECT sql FROM ${schema}.sqlite_master WHERE type = 'table' AND name = ?`).get(tableName);
	return typeof row?.sql === "string" && row.sql.trim() ? row.sql : null;
}
function readMemoryDatabaseRevision(db) {
	const row = db.prepare("SELECT revision FROM memory_index_state WHERE id = ?").get(1);
	if (typeof row?.revision !== "number" || !Number.isSafeInteger(row.revision)) throw new Error("Memory index revision is missing or invalid");
	return row.revision;
}
var MemoryIndexRevisionConflictError = class extends Error {
	constructor(..._args) {
		super(..._args);
		this.name = "MemoryIndexRevisionConflictError";
	}
};
function replaceMemoryVectorTable(db) {
	const tableName = "memory_index_chunks_vec";
	const createSql = readTableSql(db, MEMORY_REINDEX_SCHEMA, tableName);
	if (!createSql) {
		try {
			db.exec(`DROP TABLE IF EXISTS main.${tableName}`);
		} catch {}
		return;
	}
	db.exec(`DROP TABLE IF EXISTS main.${tableName}`);
	db.exec(createSql);
	db.exec(`INSERT INTO main.${tableName} (id, embedding) SELECT id, embedding FROM ${MEMORY_REINDEX_SCHEMA}.${tableName}`);
}
function replaceMemoryChunkFtsTable(db) {
	const createSql = readTableSql(db, MEMORY_REINDEX_SCHEMA, MEMORY_INDEX_FTS_TABLE);
	db.exec(`DROP TABLE IF EXISTS main.${MEMORY_INDEX_FTS_TABLE}`);
	if (!createSql) return;
	db.exec(createSql);
	rebuildMemoryChunkFts(db, MEMORY_INDEX_FTS_TABLE);
	ensureMemoryChunkFtsTriggers(db);
}
function replaceMemoryPathFtsTable(db) {
	const createSql = readTableSql(db, MEMORY_REINDEX_SCHEMA, MEMORY_INDEX_PATHS_FTS_TABLE);
	db.exec(`DROP TABLE IF EXISTS main.${MEMORY_INDEX_PATHS_FTS_TABLE}`);
	if (!createSql) return;
	db.exec(createSql);
	db.exec(`INSERT INTO main.${MEMORY_INDEX_PATHS_FTS_TABLE} (rowid, path, source) SELECT id, path, source FROM main.memory_index_sources`);
}
/** The admitted connection owns ATTACH, atomic replacement, COMMIT and DETACH. */
function publishMemoryDatabaseTables(params) {
	ensureMemoryRecallMetadataSchema(params.targetDb);
	ensureMemoryChunkProvenance(params.targetDb);
	params.targetDb.prepare(`ATTACH DATABASE ? AS ${MEMORY_REINDEX_SCHEMA}`).run(params.sourcePath);
	try {
		runSqliteImmediateTransactionSync(params.targetDb, () => {
			params.onBegin?.();
			const liveRevision = readMemoryDatabaseRevision(params.targetDb);
			if (liveRevision !== params.expectedRevision) throw new MemoryIndexRevisionConflictError(`Memory index changed while full reindex was building (expected revision ${params.expectedRevision}, found ${liveRevision}); retry the full reindex.`);
			const publishesPathFts = tableExists(params.targetDb, MEMORY_REINDEX_SCHEMA, MEMORY_INDEX_PATHS_FTS_TABLE);
			dropMemoryPathFtsTriggers(params.targetDb);
			dropMemoryChunkFtsTriggers(params.targetDb);
			params.targetDb.prepare("DELETE FROM main.memory_index_meta WHERE key = ?").run(params.metaKey);
			params.targetDb.prepare(`INSERT INTO main.memory_index_meta (key, value)
           SELECT key, value FROM ${MEMORY_REINDEX_SCHEMA}.memory_index_meta WHERE key = ?`).run(params.metaKey);
			params.targetDb.exec(`
        DELETE FROM main.memory_index_sources;
        INSERT INTO main.memory_index_sources (id, path, source, hash, mtime, size)
        SELECT id, path, source, hash, mtime, size
        FROM ${MEMORY_REINDEX_SCHEMA}.memory_index_sources;

        DELETE FROM main.memory_index_chunks;
        INSERT INTO main.memory_index_chunks (
          chunk_rowid, id, path, source, start_line, end_line, hash, model, text, embedding, updated_at
        )
        SELECT
          chunk_rowid, id, path, source, start_line, end_line, hash, model, text, embedding, updated_at
        FROM ${MEMORY_REINDEX_SCHEMA}.memory_index_chunks;

        DELETE FROM main.${MEMORY_INDEX_CHUNK_RECALL_METADATA_TABLE};
        INSERT INTO main.${MEMORY_INDEX_CHUNK_RECALL_METADATA_TABLE} (
          chunk_id, importance, triggers, project_key
        )
        SELECT chunk_id, importance, triggers, project_key
        FROM ${MEMORY_REINDEX_SCHEMA}.${MEMORY_INDEX_CHUNK_RECALL_METADATA_TABLE};

        DELETE FROM main.memory_index_chunk_provenance;
        INSERT INTO main.memory_index_chunk_provenance (
          chunk_id, origin_class, session_kind, observed_at, supersedes_key
        )
        SELECT chunk_id, origin_class, session_kind, observed_at, supersedes_key
        FROM ${MEMORY_REINDEX_SCHEMA}.memory_index_chunk_provenance;
      `);
			replaceMemoryChunkFtsTable(params.targetDb);
			replaceMemoryPathFtsTable(params.targetDb);
			if (publishesPathFts) ensureMemoryPathFtsTriggers(params.targetDb);
			replaceMemoryVectorTable(params.targetDb);
			if (params.vectorIndexComplete) markMemoryVectorIndexClean(params.targetDb);
		}, { withCommit: params.withCommit });
	} finally {
		params.targetDb.exec(`DETACH DATABASE ${MEMORY_REINDEX_SCHEMA}`);
	}
}
//#endregion
export { tableExists as i, publishMemoryDatabaseTables as n, readMemoryDatabaseRevision as r, MemoryIndexRevisionConflictError as t };
