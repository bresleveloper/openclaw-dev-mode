import { a as runSqliteImmediateTransactionSync } from "./sqlite-transaction-CpDyZPQ0.mjs";
import { a as tableExists$1 } from "./openclaw-state-db-schema-helpers-C7eId980.mjs";
import { C as MEMORY_INDEX_CHUNK_RECALL_METADATA_TABLE, D as ensureMemoryChunkProvenance, S as rebuildMemoryChunkFts, b as ensureMemoryChunkFtsTriggers, h as MEMORY_INDEX_PATHS_FTS_TABLE, m as MEMORY_INDEX_FTS_TABLE, r as stageMemoryIndexSchemaExtension, v as dropMemoryChunkFtsTriggers, w as ensureMemoryRecallMetadataSchema, x as ensureMemoryPathFtsTriggers, y as dropMemoryPathFtsTriggers } from "./memory-schema-DY2eOY6N.mjs";
import "./sqlite-worker-runtime-Da3qtgYL.mjs";
import "./memory-core-host-engine-schema-9m2yhquC.mjs";
import { n as markMemoryVectorIndexClean } from "./manager-vector-rebuild-state-C9-1fnZd.mjs";
//#region extensions/memory-core/src/memory/manager-db-kernel.ts
const MEMORY_REINDEX_SCHEMA = "memory_reindex";
function tableExists(db, schema, tableName) {
	if (schema === "main") return tableExists$1(db, tableName);
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
			const ftsSchemas = new Map([MEMORY_INDEX_FTS_TABLE, MEMORY_INDEX_PATHS_FTS_TABLE].map((table) => [table, readTableSql(params.targetDb, MEMORY_REINDEX_SCHEMA, table)]));
			stageMemoryIndexSchemaExtension(params.targetDb, { ftsAvailable: Boolean(ftsSchemas.get("memory_index_chunks_fts") && ftsSchemas.get("memory_index_paths_fts")) });
			dropMemoryPathFtsTriggers(params.targetDb);
			dropMemoryChunkFtsTriggers(params.targetDb);
			params.targetDb.prepare("DELETE FROM main.memory_index_meta WHERE key = ?").run(params.metaKey);
			params.targetDb.prepare(`INSERT INTO main.memory_index_meta (key, value)
           SELECT key, value FROM ${MEMORY_REINDEX_SCHEMA}.memory_index_meta WHERE key = ?`).run(params.metaKey);
			params.targetDb.exec(Object.entries({
				memory_index_sources: "id, path, source, hash, mtime, size",
				memory_index_chunks: "chunk_rowid, id, path, source, start_line, end_line, hash, model, text, embedding, updated_at",
				[MEMORY_INDEX_CHUNK_RECALL_METADATA_TABLE]: "chunk_id, importance, triggers, project_key",
				memory_index_chunk_provenance: "chunk_id, origin_class, session_kind, observed_at, supersedes_key"
			}).map(([table, columns]) => `DELETE FROM main.${table};\nINSERT INTO main.${table} (${columns})\nSELECT ${columns} FROM ${MEMORY_REINDEX_SCHEMA}.${table};`).join("\n"));
			for (const [table, createSql] of ftsSchemas) {
				params.targetDb.exec(`DROP TABLE IF EXISTS main.${table}`);
				if (!createSql) continue;
				params.targetDb.exec(createSql);
				if (table === "memory_index_chunks_fts") {
					rebuildMemoryChunkFts(params.targetDb, table);
					ensureMemoryChunkFtsTriggers(params.targetDb);
				} else params.targetDb.exec(`INSERT INTO main.${MEMORY_INDEX_PATHS_FTS_TABLE} (rowid, path, source) SELECT id, path, source FROM main.memory_index_sources`);
			}
			if (ftsSchemas.get("memory_index_paths_fts")) ensureMemoryPathFtsTriggers(params.targetDb);
			replaceMemoryVectorTable(params.targetDb);
			if (params.vectorIndexComplete) markMemoryVectorIndexClean(params.targetDb);
		}, { withCommit: params.withCommit });
	} finally {
		params.targetDb.exec(`DETACH DATABASE ${MEMORY_REINDEX_SCHEMA}`);
	}
}
//#endregion
export { tableExists as i, publishMemoryDatabaseTables as n, readMemoryDatabaseRevision as r, MemoryIndexRevisionConflictError as t };
