import { S as rebuildMemoryChunkFts, b as ensureMemoryChunkFtsTriggers, d as MEMORY_INDEX_VECTOR_TABLE, g as MEMORY_INDEX_SOURCES_TABLE, i as markInvalidImportedMemoryEmbeddings, l as MEMORY_INDEX_META_TABLE, m as MEMORY_INDEX_FTS_TABLE, o as registerMemoryEmbeddingMigrationFunctions, p as MEMORY_INDEX_CHUNKS_TABLE, s as MEMORY_EMBEDDING_CACHE_TABLE } from "./memory-schema-DY2eOY6N.mjs";
import "./memory-core-host-engine-schema-9m2yhquC.mjs";
import fs from "node:fs";
//#region extensions/memory-core/src/migration/doctor-memory-sidecar-import.ts
const LEGACY_MEMORY_SIDECAR_SCHEMA = "legacy_memory_sidecar";
const LEGACY_MEMORY_VECTOR_TABLE = "chunks_vec";
const MEMORY_INDEX_META_KEY = "memory_index_meta_v1";
const LEGACY_MEMORY_INDEX_TABLES = [
	[
		"meta",
		MEMORY_INDEX_META_TABLE,
		["key", "value"]
	],
	[
		"files",
		MEMORY_INDEX_SOURCES_TABLE,
		[
			"path",
			"source",
			"hash",
			"mtime",
			"size"
		]
	],
	[
		"chunks",
		MEMORY_INDEX_CHUNKS_TABLE,
		[
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
		]
	]
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
		super(`legacy memory ${tableName} rows conflict with existing memory index rows`);
		this.tableName = tableName;
	}
};
function tableExists(db, schema, tableName) {
	return Boolean(db.prepare(`SELECT 1 FROM ${schema}.sqlite_master WHERE name = ?`).get(tableName));
}
function tableHasColumns(db, tableName, expected, exact = false) {
	const rows = db.prepare(`PRAGMA ${LEGACY_MEMORY_SIDECAR_SCHEMA}.table_info(${tableName})`).all();
	const columns = new Set(rows.flatMap((row) => typeof row.name === "string" ? [row.name] : []));
	return (!exact || columns.size === expected.length) && expected.every((column) => columns.has(column));
}
function hasLegacyMemoryIndexTables(db) {
	return LEGACY_MEMORY_INDEX_TABLES.every(([tableName, , columns]) => tableHasColumns(db, tableName, columns, true));
}
function hasLegacyEmbeddingCacheTable(db) {
	return tableHasColumns(db, "embedding_cache", LEGACY_MEMORY_CACHE_COLUMNS, true);
}
function hasLegacyVectorTable(db) {
	return tableHasColumns(db, LEGACY_MEMORY_VECTOR_TABLE, ["id", "embedding"]);
}
function tableRowCount(db, tableName, query = "") {
	const row = db.prepare(`SELECT COUNT(*) AS count FROM ${LEGACY_MEMORY_SIDECAR_SCHEMA}.${tableName} AS legacy ${query}`).get();
	return Number(row?.count ?? 0);
}
function readLegacyVectorEntries(db, tolerateInvalid) {
	if (!tableExists(db, LEGACY_MEMORY_SIDECAR_SCHEMA, LEGACY_MEMORY_VECTOR_TABLE)) return 0;
	try {
		return hasLegacyVectorTable(db) ? tableRowCount(db, LEGACY_MEMORY_VECTOR_TABLE) : void 0;
	} catch (error) {
		if (!tolerateInvalid) throw error;
		return;
	}
}
function assertLegacyDerivedRowsCopied(db, tableName, query) {
	if (tableRowCount(db, tableName, query) > 0) throw new LegacyMemoryDerivedRowsConflictError(tableName);
}
function assertLegacyVectorRowsReferenceChunks(db) {
	if (tableRowCount(db, LEGACY_MEMORY_VECTOR_TABLE, `WHERE NOT EXISTS (
         SELECT 1 FROM main.memory_index_chunks AS chunk
         WHERE chunk.id = legacy.id
       )`) > 0) throw new Error(`legacy memory ${LEGACY_MEMORY_VECTOR_TABLE} rows reference missing chunks`);
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
function readLegacyVectorDimensions(db) {
	const configuredDimensions = readMemoryIndexMetaVectorDimensions(db, LEGACY_MEMORY_SIDECAR_SCHEMA, "meta") ?? readVectorTableSqlDimensions(db, LEGACY_MEMORY_SIDECAR_SCHEMA, LEGACY_MEMORY_VECTOR_TABLE);
	if (configuredDimensions) return configuredDimensions;
	const row = db.prepare(`SELECT length(embedding) AS bytes FROM ${LEGACY_MEMORY_SIDECAR_SCHEMA}.${LEGACY_MEMORY_VECTOR_TABLE} WHERE embedding IS NOT NULL LIMIT 1`).get();
	const bytes = Number(row?.bytes ?? 0);
	return Number.isSafeInteger(bytes) && bytes > 0 && bytes % Float32Array.BYTES_PER_ELEMENT === 0 ? bytes / Float32Array.BYTES_PER_ELEMENT : void 0;
}
function ensureCanonicalVectorTableForLegacyRows(db) {
	if (!hasLegacyVectorTable(db) || tableRowCount(db, LEGACY_MEMORY_VECTOR_TABLE) === 0) return;
	const dimensions = readLegacyVectorDimensions(db);
	if (!dimensions) throw new Error("legacy memory chunks_vec rows require vector dimensions before import");
	const canonicalTableExists = tableExists(db, "main", MEMORY_INDEX_VECTOR_TABLE);
	const canonicalDimensions = (canonicalTableExists ? readVectorTableSqlDimensions(db, "main", "memory_index_chunks_vec") : void 0) ?? readMemoryIndexMetaVectorDimensions(db, "main", "memory_index_meta");
	if (canonicalTableExists && !canonicalDimensions) throw new Error("current memory chunks_vec table requires vector dimensions before legacy import");
	if (canonicalDimensions && canonicalDimensions !== dimensions) throw new Error(`legacy memory chunks_vec dimensions ${dimensions} do not match current memory chunks_vec dimensions ${canonicalDimensions}`);
	if (canonicalTableExists) return;
	db.exec(`CREATE VIRTUAL TABLE IF NOT EXISTS main.${MEMORY_INDEX_VECTOR_TABLE} USING vec0(\n  id TEXT PRIMARY KEY,\n  embedding FLOAT[${dimensions}]\n)`);
}
function copyLegacyMemoryVectorRows(db) {
	if (!hasLegacyVectorTable(db)) return;
	ensureCanonicalVectorTableForLegacyRows(db);
	if (!tableExists(db, "main", "memory_index_chunks_vec")) return;
	assertLegacyVectorRowsReferenceChunks(db);
	assertLegacyDerivedRowsCopied(db, LEGACY_MEMORY_VECTOR_TABLE, `JOIN main.${MEMORY_INDEX_VECTOR_TABLE} AS canonical ON canonical.id = legacy.id
     WHERE canonical.embedding IS NOT legacy.embedding`);
	db.exec(`
    INSERT OR IGNORE INTO main.${MEMORY_INDEX_VECTOR_TABLE} (id, embedding)
    SELECT legacy.id, legacy.embedding
    FROM ${LEGACY_MEMORY_SIDECAR_SCHEMA}.${LEGACY_MEMORY_VECTOR_TABLE} AS legacy
    JOIN main.${MEMORY_INDEX_CHUNKS_TABLE} AS chunk ON chunk.id = legacy.id
    WHERE NOT EXISTS (
      SELECT 1 FROM main.${MEMORY_INDEX_VECTOR_TABLE} AS canonical
      WHERE canonical.id = legacy.id
    );
  `);
	assertLegacyDerivedRowsCopied(db, LEGACY_MEMORY_VECTOR_TABLE, `WHERE NOT EXISTS (
       SELECT 1 FROM main.${MEMORY_INDEX_VECTOR_TABLE} AS canonical
       WHERE canonical.id = legacy.id
         AND canonical.embedding IS legacy.embedding
     )`);
}
function copyLegacyMemoryIndexRows(db, copyVectorRows) {
	registerMemoryEmbeddingMigrationFunctions(db);
	const legacyValue = (column) => column === "embedding" ? "openclaw_memory_embedding_from_json(legacy.embedding)" : `legacy.${column}`;
	db.exec(LEGACY_MEMORY_INDEX_TABLES.map(([legacy, canonical, columns]) => `
        INSERT OR IGNORE INTO main.${canonical} (${columns.join(", ")})
        SELECT ${columns.map(legacyValue).join(", ")} FROM ${LEGACY_MEMORY_SIDECAR_SCHEMA}.${legacy} AS legacy;`).join("\n"));
	for (const [legacy, canonical, columns] of LEGACY_MEMORY_INDEX_TABLES) assertLegacyDerivedRowsCopied(db, legacy, `WHERE NOT EXISTS (
         SELECT 1 FROM main.${canonical} AS canonical WHERE ${columns.map((column, index) => `canonical.${column} ${index === 0 ? "=" : "IS"} ${legacyValue(column)}`).join(" AND ")}
       )`);
	if (tableExists(db, "main", "memory_index_chunks_fts")) {
		rebuildMemoryChunkFts(db, MEMORY_INDEX_FTS_TABLE);
		ensureMemoryChunkFtsTriggers(db);
	}
	if (copyVectorRows) copyLegacyMemoryVectorRows(db);
	if (hasLegacyEmbeddingCacheTable(db)) {
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
      FROM ${LEGACY_MEMORY_SIDECAR_SCHEMA}.embedding_cache;
    `);
		assertLegacyDerivedRowsCopied(db, "embedding_cache", `WHERE NOT EXISTS (
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
       )`);
	}
	markInvalidImportedMemoryEmbeddings(db, LEGACY_MEMORY_SIDECAR_SCHEMA);
}
function importLegacyMemorySidecarIndex(params) {
	const skipped = (reason) => ({
		imported: false,
		reason,
		sources: 0,
		chunks: 0,
		cacheEntries: 0,
		vectorEntries: 0,
		vectorEntriesImported: true
	});
	if (!params.legacySidecarDatabasePath || !fs.existsSync(params.legacySidecarDatabasePath)) return skipped("missing-sidecar");
	params.db.prepare(`ATTACH DATABASE ? AS ${LEGACY_MEMORY_SIDECAR_SCHEMA}`).run(params.legacySidecarDatabasePath);
	try {
		if (!hasLegacyMemoryIndexTables(params.db)) return skipped("legacy-schema-missing");
		const vectorEntries = readLegacyVectorEntries(params.db, !params.copyVectorRows);
		const counts = {
			sources: tableRowCount(params.db, "files"),
			chunks: tableRowCount(params.db, "chunks"),
			cacheEntries: hasLegacyEmbeddingCacheTable(params.db) ? tableRowCount(params.db, "embedding_cache") : 0,
			vectorEntries
		};
		params.db.exec("SAVEPOINT import_legacy_sidecar_memory_index");
		try {
			copyLegacyMemoryIndexRows(params.db, params.copyVectorRows);
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
