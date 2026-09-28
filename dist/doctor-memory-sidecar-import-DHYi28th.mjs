import { E as rebuildMemoryChunkFts, _ as MEMORY_INDEX_CHUNKS_TABLE, a as registerMemoryEmbeddingMigrationFunctions, b as MEMORY_INDEX_SOURCES_TABLE, c as MEMORY_INDEX_META_TABLE, o as MEMORY_EMBEDDING_CACHE_TABLE, r as markInvalidImportedMemoryEmbeddings, u as MEMORY_INDEX_VECTOR_TABLE, v as MEMORY_INDEX_FTS_TABLE, w as ensureMemoryChunkFtsTriggers } from "./memory-schema-CkxujvZk.mjs";
import "./memory-core-host-engine-schema-emU_afev.mjs";
import fs from "node:fs";
//#region extensions/memory-core/src/migration/doctor-memory-sidecar-import.ts
const LEGACY_MEMORY_SIDECAR_SCHEMA = "legacy_memory_sidecar";
const LEGACY_MEMORY_VECTOR_TABLE = "chunks_vec";
const MEMORY_INDEX_META_KEY = "memory_index_meta_v1";
const LEGACY_MEMORY_SOURCE_COLUMNS = [
	"path",
	"source",
	"hash",
	"mtime",
	"size"
];
const LEGACY_MEMORY_CHUNK_COLUMNS = [
	"id",
	"path",
	"source",
	"start_line",
	"end_line",
	"hash",
	"model",
	"text",
	"embedding",
	"updated_at"
];
const LEGACY_MEMORY_CACHE_COLUMNS = [
	"provider",
	"model",
	"provider_key",
	"hash",
	"embedding",
	"dims",
	"updated_at"
];
var LegacyMemoryDerivedRowsConflictError = class extends Error {
	constructor(tableName) {
		super(`legacy memory ${tableName} rows conflict with canonical memory index rows`);
		this.tableName = tableName;
	}
};
function tableExists(db, schema, tableName) {
	return Boolean(db.prepare(`SELECT 1 FROM ${schema}.sqlite_master WHERE name = ?`).get(tableName));
}
function tableColumns(db, tableName, schema = "main") {
	const rows = db.prepare(`PRAGMA ${schema}.table_info(${tableName})`).all();
	return new Set(rows.flatMap((row) => typeof row.name === "string" ? [row.name] : []));
}
function tableHasColumns(db, tableName, expected, schema = "main", exact = false) {
	const columns = tableColumns(db, tableName, schema);
	return (!exact || columns.size === expected.length) && expected.every((column) => columns.has(column));
}
function hasLegacyMemoryIndexTables(db, schema = "main") {
	return tableHasColumns(db, "meta", ["key", "value"], schema, true) && tableHasColumns(db, "files", LEGACY_MEMORY_SOURCE_COLUMNS, schema, true) && tableHasColumns(db, "chunks", LEGACY_MEMORY_CHUNK_COLUMNS, schema, true);
}
function hasLegacyEmbeddingCacheTable(db, schema = "main") {
	return tableHasColumns(db, "embedding_cache", LEGACY_MEMORY_CACHE_COLUMNS, schema, true);
}
function hasLegacyVectorTable(db, schema = "main") {
	return tableHasColumns(db, LEGACY_MEMORY_VECTOR_TABLE, ["id", "embedding"], schema);
}
function tableRowCount(db, schema, tableName) {
	const row = db.prepare(`SELECT COUNT(*) AS count FROM ${schema}.${tableName}`).get();
	return Number(row?.count ?? 0);
}
function readLegacySidecarCounts(db, schema, options) {
	const vectorEntries = readLegacyVectorEntries(db, schema, !options.copyVectorRows);
	return {
		sources: tableRowCount(db, schema, "files"),
		chunks: tableRowCount(db, schema, "chunks"),
		cacheEntries: hasLegacyEmbeddingCacheTable(db, schema) ? tableRowCount(db, schema, "embedding_cache") : 0,
		vectorEntries
	};
}
function readLegacyVectorEntries(db, schema, tolerateInvalid) {
	if (!tableExists(db, schema, LEGACY_MEMORY_VECTOR_TABLE)) return 0;
	try {
		return hasLegacyVectorTable(db, schema) ? tableRowCount(db, schema, LEGACY_MEMORY_VECTOR_TABLE) : void 0;
	} catch (error) {
		if (!tolerateInvalid) throw error;
		return;
	}
}
function assertLegacyDerivedRowsCopied(db, query, tableName) {
	const row = db.prepare(query).get();
	if (Number(row?.missing ?? 0) > 0) throw new LegacyMemoryDerivedRowsConflictError(tableName);
}
function assertLegacyVectorRowsReferenceChunks(db, schema) {
	const row = db.prepare(`SELECT COUNT(*) AS missing
       FROM ${schema}.${LEGACY_MEMORY_VECTOR_TABLE} AS legacy
       WHERE NOT EXISTS (
         SELECT 1 FROM main.${MEMORY_INDEX_CHUNKS_TABLE} AS chunk
         WHERE chunk.id = legacy.id
       )`).get();
	if (Number(row?.missing ?? 0) > 0) throw new Error(`legacy memory ${LEGACY_MEMORY_VECTOR_TABLE} rows reference missing chunks`);
}
function readMemoryIndexMetaVectorDimensions(db, schema, tableName) {
	if (!tableExists(db, schema, tableName)) return;
	const meta = db.prepare(`SELECT value FROM ${schema}.${tableName} WHERE key = ?`).get(MEMORY_INDEX_META_KEY);
	if (typeof meta?.value !== "string") return;
	try {
		const parsed = JSON.parse(meta.value);
		const dimensions = Number(parsed.vectorDims);
		return Number.isSafeInteger(dimensions) && dimensions > 0 ? dimensions : void 0;
	} catch {}
}
function readVectorTableSqlDimensions(db, schema, tableName) {
	const row = db.prepare(`SELECT sql FROM ${schema}.sqlite_master WHERE name = ?`).get(tableName);
	if (typeof row?.sql !== "string") return;
	const match = /embedding\s+FLOAT\[(\d+)\]/i.exec(row.sql);
	const dimensions = Number(match?.[1] ?? 0);
	return Number.isSafeInteger(dimensions) && dimensions > 0 ? dimensions : void 0;
}
function readLegacyVectorDimensions(db, schema) {
	const configuredDimensions = readMemoryIndexMetaVectorDimensions(db, schema, "meta") ?? readVectorTableSqlDimensions(db, schema, LEGACY_MEMORY_VECTOR_TABLE);
	if (configuredDimensions) return configuredDimensions;
	const row = db.prepare(`SELECT length(embedding) AS bytes FROM ${schema}.${LEGACY_MEMORY_VECTOR_TABLE} WHERE embedding IS NOT NULL LIMIT 1`).get();
	const bytes = Number(row?.bytes ?? 0);
	return Number.isSafeInteger(bytes) && bytes > 0 && bytes % Float32Array.BYTES_PER_ELEMENT === 0 ? bytes / Float32Array.BYTES_PER_ELEMENT : void 0;
}
function readCanonicalVectorDimensions(db) {
	return readVectorTableSqlDimensions(db, "main", "memory_index_chunks_vec") ?? readMemoryIndexMetaVectorDimensions(db, "main", "memory_index_meta");
}
function ensureCanonicalVectorTableForLegacyRows(db, schema) {
	if (!hasLegacyVectorTable(db, schema) || tableRowCount(db, schema, LEGACY_MEMORY_VECTOR_TABLE) === 0) return;
	const dimensions = readLegacyVectorDimensions(db, schema);
	if (!dimensions) throw new Error("legacy memory chunks_vec rows require vector dimensions before import");
	if (tableExists(db, "main", "memory_index_chunks_vec")) {
		const canonicalDimensions = readCanonicalVectorDimensions(db);
		if (!canonicalDimensions) throw new Error("canonical memory chunks_vec table requires vector dimensions before legacy import");
		if (canonicalDimensions !== dimensions) throw new Error(`legacy memory chunks_vec dimensions ${dimensions} do not match canonical memory chunks_vec dimensions ${canonicalDimensions}`);
		return;
	}
	const canonicalMetaDimensions = readMemoryIndexMetaVectorDimensions(db, "main", MEMORY_INDEX_META_TABLE);
	if (canonicalMetaDimensions && canonicalMetaDimensions !== dimensions) throw new Error(`legacy memory chunks_vec dimensions ${dimensions} do not match canonical memory chunks_vec dimensions ${canonicalMetaDimensions}`);
	db.exec(`CREATE VIRTUAL TABLE IF NOT EXISTS main.${MEMORY_INDEX_VECTOR_TABLE} USING vec0(\n  id TEXT PRIMARY KEY,\n  embedding FLOAT[${dimensions}]\n)`);
}
function copyLegacyMemoryVectorRows(db, schema) {
	if (!hasLegacyVectorTable(db, schema)) return;
	ensureCanonicalVectorTableForLegacyRows(db, schema);
	if (!tableExists(db, "main", "memory_index_chunks_vec")) return;
	assertLegacyVectorRowsReferenceChunks(db, schema);
	assertLegacyDerivedRowsCopied(db, `SELECT COUNT(*) AS missing
     FROM ${schema}.${LEGACY_MEMORY_VECTOR_TABLE} AS legacy
     JOIN main.${MEMORY_INDEX_VECTOR_TABLE} AS canonical ON canonical.id = legacy.id
     WHERE canonical.embedding IS NOT legacy.embedding`, LEGACY_MEMORY_VECTOR_TABLE);
	db.exec(`
    INSERT OR IGNORE INTO main.${MEMORY_INDEX_VECTOR_TABLE} (id, embedding)
    SELECT legacy.id, legacy.embedding
    FROM ${schema}.${LEGACY_MEMORY_VECTOR_TABLE} AS legacy
    JOIN main.${MEMORY_INDEX_CHUNKS_TABLE} AS chunk ON chunk.id = legacy.id
    WHERE NOT EXISTS (
      SELECT 1 FROM main.${MEMORY_INDEX_VECTOR_TABLE} AS canonical
      WHERE canonical.id = legacy.id
    );
  `);
	assertLegacyDerivedRowsCopied(db, `SELECT COUNT(*) AS missing
     FROM ${schema}.${LEGACY_MEMORY_VECTOR_TABLE} AS legacy
     WHERE NOT EXISTS (
       SELECT 1 FROM main.${MEMORY_INDEX_VECTOR_TABLE} AS canonical
       WHERE canonical.id = legacy.id
         AND canonical.embedding IS legacy.embedding
     )`, LEGACY_MEMORY_VECTOR_TABLE);
}
function copyLegacyMemoryIndexRows(db, schema, options) {
	registerMemoryEmbeddingMigrationFunctions(db);
	db.exec(`
    INSERT OR IGNORE INTO main.${MEMORY_INDEX_META_TABLE} (key, value)
    SELECT key, value FROM ${schema}.meta;

    INSERT OR IGNORE INTO main.${MEMORY_INDEX_SOURCES_TABLE} (path, source, hash, mtime, size)
    SELECT path, source, hash, mtime, size FROM ${schema}.files;

    INSERT OR IGNORE INTO main.${MEMORY_INDEX_CHUNKS_TABLE} (
      id, path, source, start_line, end_line, hash, model, text, embedding, updated_at
    )
    SELECT id, path, source, start_line, end_line, hash, model, text,
           openclaw_memory_embedding_from_json(embedding), updated_at
    FROM ${schema}.chunks;
  `);
	assertLegacyDerivedRowsCopied(db, `SELECT COUNT(*) AS missing
     FROM ${schema}.meta AS legacy
     WHERE NOT EXISTS (
       SELECT 1 FROM main.${MEMORY_INDEX_META_TABLE} AS canonical
       WHERE canonical.key = legacy.key AND canonical.value IS legacy.value
     )`, "meta");
	assertLegacyDerivedRowsCopied(db, `SELECT COUNT(*) AS missing
     FROM ${schema}.files AS legacy
     WHERE NOT EXISTS (
       SELECT 1 FROM main.${MEMORY_INDEX_SOURCES_TABLE} AS canonical
       WHERE canonical.path = legacy.path
         AND canonical.source IS legacy.source
         AND canonical.hash IS legacy.hash
         AND canonical.mtime IS legacy.mtime
         AND canonical.size IS legacy.size
     )`, "files");
	assertLegacyDerivedRowsCopied(db, `SELECT COUNT(*) AS missing
     FROM ${schema}.chunks AS legacy
     WHERE NOT EXISTS (
       SELECT 1 FROM main.${MEMORY_INDEX_CHUNKS_TABLE} AS canonical
       WHERE canonical.id = legacy.id
         AND canonical.path IS legacy.path
         AND canonical.source IS legacy.source
         AND canonical.start_line IS legacy.start_line
         AND canonical.end_line IS legacy.end_line
         AND canonical.hash IS legacy.hash
         AND canonical.model IS legacy.model
         AND canonical.text IS legacy.text
         AND canonical.embedding IS openclaw_memory_embedding_from_json(legacy.embedding)
         AND canonical.updated_at IS legacy.updated_at
     )`, "chunks");
	if (tableExists(db, "main", "memory_index_chunks_fts")) {
		rebuildMemoryChunkFts(db, MEMORY_INDEX_FTS_TABLE);
		ensureMemoryChunkFtsTriggers(db);
	}
	if (options.copyVectorRows) copyLegacyMemoryVectorRows(db, schema);
	if (hasLegacyEmbeddingCacheTable(db, schema)) {
		db.exec(`
      CREATE TABLE IF NOT EXISTS main.${MEMORY_EMBEDDING_CACHE_TABLE} (
        provider TEXT NOT NULL,
        model TEXT NOT NULL,
        provider_key TEXT NOT NULL,
        hash TEXT NOT NULL,
        embedding BLOB NOT NULL,
        dims INTEGER,
        updated_at INTEGER NOT NULL,
        PRIMARY KEY (provider, model, provider_key, hash)
      ) STRICT;
      INSERT OR IGNORE INTO main.${MEMORY_EMBEDDING_CACHE_TABLE} (
        provider, model, provider_key, hash, embedding, dims, updated_at
      )
      SELECT provider, model, provider_key, hash, openclaw_memory_embedding_from_json(embedding), dims, updated_at
      FROM ${schema}.embedding_cache;
    `);
		assertLegacyDerivedRowsCopied(db, `SELECT COUNT(*) AS missing
       FROM ${schema}.embedding_cache AS legacy
       WHERE NOT EXISTS (
         SELECT 1 FROM main.${MEMORY_EMBEDDING_CACHE_TABLE} AS canonical
         WHERE canonical.provider = legacy.provider
           AND canonical.model = legacy.model
           AND canonical.provider_key = legacy.provider_key
           AND canonical.hash = legacy.hash
           AND canonical.dims IS legacy.dims
           AND (
             canonical.embedding IS openclaw_memory_embedding_from_json(legacy.embedding)
             OR (
               openclaw_memory_embedding_blob_valid(canonical.embedding) = 1
               AND length(canonical.embedding) = canonical.dims * 8
               AND CASE WHEN openclaw_memory_embedding_json_valid(legacy.embedding) = 1
                   THEN json_array_length(legacy.embedding) = legacy.dims ELSE 0 END
             )
           )
       )`, "embedding_cache");
	}
	markInvalidImportedMemoryEmbeddings(db, schema);
}
function importLegacyMemorySidecarIndex(params) {
	if (!params.legacySidecarDatabasePath || !fs.existsSync(params.legacySidecarDatabasePath)) return {
		imported: false,
		reason: "missing-sidecar",
		sources: 0,
		chunks: 0,
		cacheEntries: 0,
		vectorEntries: 0,
		vectorEntriesImported: true
	};
	params.db.prepare(`ATTACH DATABASE ? AS ${LEGACY_MEMORY_SIDECAR_SCHEMA}`).run(params.legacySidecarDatabasePath);
	try {
		if (!hasLegacyMemoryIndexTables(params.db, LEGACY_MEMORY_SIDECAR_SCHEMA)) return {
			imported: false,
			reason: "legacy-schema-missing",
			sources: 0,
			chunks: 0,
			cacheEntries: 0,
			vectorEntries: 0,
			vectorEntriesImported: true
		};
		const counts = readLegacySidecarCounts(params.db, LEGACY_MEMORY_SIDECAR_SCHEMA, { copyVectorRows: params.copyVectorRows });
		params.db.exec("SAVEPOINT import_legacy_sidecar_memory_index");
		try {
			copyLegacyMemoryIndexRows(params.db, LEGACY_MEMORY_SIDECAR_SCHEMA, { copyVectorRows: params.copyVectorRows });
			params.db.exec("RELEASE import_legacy_sidecar_memory_index");
			return {
				imported: true,
				...counts,
				vectorEntriesImported: counts.vectorEntries === 0 || !params.requireVectorRows || params.copyVectorRows && counts.vectorEntries !== void 0
			};
		} catch (err) {
			params.db.exec("ROLLBACK TO import_legacy_sidecar_memory_index");
			params.db.exec("RELEASE import_legacy_sidecar_memory_index");
			throw err;
		}
	} finally {
		params.db.exec(`DETACH DATABASE ${LEGACY_MEMORY_SIDECAR_SCHEMA}`);
	}
}
//#endregion
export { LegacyMemoryDerivedRowsConflictError, importLegacyMemorySidecarIndex };
