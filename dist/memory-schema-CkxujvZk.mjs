import { o as runSqliteImmediateTransactionSync } from "./sqlite-transaction-DKSXLQhb.mjs";
import { t as assertSqliteSchemaContains } from "./sqlite-schema-contract-BFcZzasN.mjs";
import { t as migrateSqliteSchemaToStrict } from "./sqlite-strict-DxDkCm9i.mjs";
import { t as formatErrorMessage } from "./error-utils-6idLpSHC.mjs";
import { n as decodeMemoryEmbedding, r as encodeMemoryEmbedding } from "./embedding-vector-CGPWflQ5.mjs";
//#region packages/memory-host-sdk/src/host/memory-schema-fts.ts
const MEMORY_INDEX_SOURCES_TABLE = "memory_index_sources";
const MEMORY_INDEX_CHUNKS_TABLE$1 = "memory_index_chunks";
const MEMORY_INDEX_FTS_TABLE = "memory_index_chunks_fts";
const MEMORY_INDEX_PATHS_FTS_TABLE = "memory_index_paths_fts";
/** Check every persisted FTS column declaration and supported table option. */
function ftsTableMatchesSchema(params) {
	const table = params.db.prepare("SELECT type, sql FROM sqlite_schema WHERE type IN ('table', 'view') AND name = ? COLLATE NOCASE").get(params.tableName);
	if (table?.type === "view") throw new Error(`cannot modify ${params.tableName} because it is a view`);
	if (typeof table?.sql !== "string") return "missing";
	const definition = /^\s*CREATE\s+VIRTUAL\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?(?:"[^"]+"|`[^`]+`|\[[^\]]+\]|[^\s(]+)\s+USING\s+fts5\s*\(([\s\S]*)\)\s*$/iu.exec(table.sql)?.[1];
	if (definition === void 0) return "not-fts";
	const declarations = definition.split(",").map((declaration) => declaration.trim().replace(/\s+/g, " ").toLowerCase());
	const expectedDeclarations = params.expectedColumns.map((column, index) => index === 0 ? column : `${column} unindexed`);
	if (declarations.length < expectedDeclarations.length || expectedDeclarations.some((column, index) => declarations[index] !== column)) return "mismatched";
	const options = declarations.slice(expectedDeclarations.length);
	const tokenizerOption = options[0] ?? "";
	if (!(params.tokenizeClause.includes("trigram") ? options.length === 1 && /^tokenize\s*=\s*(['"])trigram case_sensitive 0\1$/u.test(tokenizerOption) : options.length === 0 || options.length === 1 && /^tokenize\s*=\s*(['"])unicode61\1$/u.test(tokenizerOption))) return "mismatched";
	const columns = params.db.prepare("SELECT name FROM pragma_table_info(?) ORDER BY cid").all(params.tableName);
	return columns.length === params.expectedColumns.length && columns.every((column, index) => column.name === params.expectedColumns[index]) ? "matching" : "mismatched";
}
/** Remove only derived FTS state whose persisted schema no longer matches. */
function dropMismatchedFtsTable(params) {
	const status = ftsTableMatchesSchema(params);
	if (status === "missing" || status === "matching") return;
	if (status === "not-fts" && params.tableName !== "memory_index_chunks_fts" && params.tableName !== "memory_index_paths_fts") throw new Error(`Memory FTS table "${params.tableName}" collides with a non-FTS table`);
	if (params.tableName === "memory_index_paths_fts") dropMemoryPathFtsTriggers(params.db);
	if (params.tableName === "memory_index_chunks_fts") dropMemoryChunkFtsTriggers(params.db);
	params.db.exec(`DROP TABLE ${params.tableName}`);
}
/** Optional canonical triggers owned by the derived path FTS index. */
const MEMORY_PATH_FTS_TRIGGER_DEFINITIONS = [
	{
		name: "memory_index_paths_fts_after_insert",
		sql: `
      CREATE TRIGGER IF NOT EXISTS main.memory_index_paths_fts_after_insert
      AFTER INSERT ON ${MEMORY_INDEX_SOURCES_TABLE}
      BEGIN
        INSERT INTO ${MEMORY_INDEX_PATHS_FTS_TABLE} (rowid, path, source)
        VALUES (NEW.id, NEW.path, NEW.source);
      END;
    `
	},
	{
		name: "memory_index_paths_fts_after_update",
		sql: `
      CREATE TRIGGER IF NOT EXISTS main.memory_index_paths_fts_after_update
      AFTER UPDATE OF id, path, source ON ${MEMORY_INDEX_SOURCES_TABLE}
      BEGIN
        DELETE FROM ${MEMORY_INDEX_PATHS_FTS_TABLE}
        WHERE rowid = OLD.id;
        INSERT INTO ${MEMORY_INDEX_PATHS_FTS_TABLE} (rowid, path, source)
        VALUES (NEW.id, NEW.path, NEW.source);
      END;
    `
	},
	{
		name: "memory_index_paths_fts_after_delete",
		sql: `
      CREATE TRIGGER IF NOT EXISTS main.memory_index_paths_fts_after_delete
      AFTER DELETE ON ${MEMORY_INDEX_SOURCES_TABLE}
      BEGIN
        DELETE FROM ${MEMORY_INDEX_PATHS_FTS_TABLE}
        WHERE rowid = OLD.id;
      END;
    `
	}
];
/** Canonical chunks own the optional body index; every mutation addresses its rowid. */
const MEMORY_CHUNK_FTS_TRIGGER_DEFINITIONS = [
	{
		name: "memory_index_chunks_fts_after_insert",
		sql: `
      CREATE TRIGGER IF NOT EXISTS main.memory_index_chunks_fts_after_insert
      AFTER INSERT ON ${MEMORY_INDEX_CHUNKS_TABLE$1}
      BEGIN
        INSERT INTO ${MEMORY_INDEX_FTS_TABLE} (rowid, text, id, path, source, model, start_line, end_line)
        VALUES (NEW.chunk_rowid, NEW.text, NEW.id, NEW.path, NEW.source, NEW.model, NEW.start_line, NEW.end_line);
      END;
    `
	},
	{
		name: "memory_index_chunks_fts_after_update",
		sql: `
      CREATE TRIGGER IF NOT EXISTS main.memory_index_chunks_fts_after_update
      AFTER UPDATE OF chunk_rowid, text, id, path, source, model, start_line, end_line ON ${MEMORY_INDEX_CHUNKS_TABLE$1}
      BEGIN
        DELETE FROM ${MEMORY_INDEX_FTS_TABLE} WHERE rowid = OLD.chunk_rowid;
        INSERT INTO ${MEMORY_INDEX_FTS_TABLE} (rowid, text, id, path, source, model, start_line, end_line)
        VALUES (NEW.chunk_rowid, NEW.text, NEW.id, NEW.path, NEW.source, NEW.model, NEW.start_line, NEW.end_line);
      END;
    `
	},
	{
		name: "memory_index_chunks_fts_after_delete",
		sql: `
      CREATE TRIGGER IF NOT EXISTS main.memory_index_chunks_fts_after_delete
      AFTER DELETE ON ${MEMORY_INDEX_CHUNKS_TABLE$1}
      BEGIN
        DELETE FROM ${MEMORY_INDEX_FTS_TABLE} WHERE rowid = OLD.chunk_rowid;
      END;
    `
	}
];
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
    FROM ${MEMORY_INDEX_CHUNKS_TABLE$1};
  `);
}
/** Reconcile and backfill the derived body index in one atomic savepoint. */
function ensureMemoryChunkFtsSchema(params) {
	if (params.ftsTable.toLowerCase() === "memory_index_paths_fts".toLowerCase()) throw new Error(`Memory body FTS table "${params.ftsTable}" collides with the path FTS index`);
	params.db.exec("SAVEPOINT ensure_memory_index_chunks_fts");
	try {
		dropMismatchedFtsTable({
			db: params.db,
			tableName: params.ftsTable,
			expectedColumns: [
				"text",
				"id",
				"path",
				"source",
				"model",
				"start_line",
				"end_line"
			],
			tokenizeClause: params.tokenizeClause
		});
		params.db.exec(`CREATE VIRTUAL TABLE IF NOT EXISTS ${params.ftsTable} USING fts5(\n  text,\n  id UNINDEXED,\n  path UNINDEXED,\n  source UNINDEXED,\n  model UNINDEXED,\n  start_line UNINDEXED,\n  end_line UNINDEXED\n${params.tokenizeClause});`);
		const rowCounts = params.db.prepare(`SELECT
           (SELECT COUNT(*) FROM ${MEMORY_INDEX_CHUNKS_TABLE$1}) AS canonical_count,
           (SELECT COUNT(*) FROM ${params.ftsTable}) AS derived_count`).get();
		const canonical = params.ftsTable === MEMORY_INDEX_FTS_TABLE;
		if (!(!canonical || MEMORY_CHUNK_FTS_TRIGGER_DEFINITIONS.every((trigger) => params.db.prepare("SELECT 1 FROM sqlite_schema WHERE type = 'trigger' AND name = ?").get(trigger.name))) || rowCounts.canonical_count !== rowCounts.derived_count) rebuildMemoryChunkFts(params.db, params.ftsTable);
		if (canonical) ensureMemoryChunkFtsTriggers(params.db);
		params.db.exec("RELEASE ensure_memory_index_chunks_fts");
	} catch (err) {
		params.db.exec("ROLLBACK TO ensure_memory_index_chunks_fts");
		params.db.exec("RELEASE ensure_memory_index_chunks_fts");
		throw err;
	}
}
function dropDisabledMemoryFts(db, ftsTable, enabled) {
	if (enabled) return;
	dropMemoryPathFtsTriggers(db);
	db.exec(`DROP TABLE IF EXISTS ${MEMORY_INDEX_PATHS_FTS_TABLE}`);
	if (ftsTable === "memory_index_chunks_fts") {
		dropMemoryChunkFtsTriggers(db);
		db.exec(`DROP TABLE IF EXISTS ${ftsTable}`);
	}
}
/** Drop the canonical source-to-path-FTS maintenance triggers. */
function dropMemoryPathFtsTriggers(db) {
	for (const trigger of MEMORY_PATH_FTS_TRIGGER_DEFINITIONS) db.exec(`DROP TRIGGER IF EXISTS main.${trigger.name}`);
}
/** Install the canonical source-to-path-FTS maintenance triggers. */
function ensureMemoryPathFtsTriggers(db) {
	for (const trigger of MEMORY_PATH_FTS_TRIGGER_DEFINITIONS) db.exec(trigger.sql);
}
function ensureMemoryPathFtsSchema(params) {
	params.db.exec("SAVEPOINT ensure_memory_index_paths_fts");
	try {
		dropMismatchedFtsTable({
			db: params.db,
			tableName: MEMORY_INDEX_PATHS_FTS_TABLE,
			expectedColumns: ["path", "source"],
			tokenizeClause: params.tokenizeClause
		});
		params.db.exec(`
      CREATE VIRTUAL TABLE IF NOT EXISTS ${MEMORY_INDEX_PATHS_FTS_TABLE} USING fts5(
        path,
        source UNINDEXED
        ${params.tokenizeClause}
      );
      -- The initial copy and trigger installation share this savepoint. Once
      -- populated, the triggers own completeness; per-row FTS probes are too costly.
      INSERT INTO ${MEMORY_INDEX_PATHS_FTS_TABLE} (rowid, path, source)
      SELECT id, path, source
      FROM ${MEMORY_INDEX_SOURCES_TABLE}
      WHERE NOT EXISTS (SELECT 1 FROM ${MEMORY_INDEX_PATHS_FTS_TABLE} LIMIT 1);
    `);
		ensureMemoryPathFtsTriggers(params.db);
		params.db.exec("RELEASE ensure_memory_index_paths_fts");
	} catch (err) {
		params.db.exec("ROLLBACK TO ensure_memory_index_paths_fts");
		params.db.exec("RELEASE ensure_memory_index_paths_fts");
		throw err;
	}
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
const missingChunkIdsSql = `
  SELECT chunk.id
  FROM memory_index_chunks AS chunk
  LEFT JOIN ${MEMORY_INDEX_CHUNK_PROVENANCE_TABLE} AS provenance
    ON provenance.chunk_id = chunk.id
  WHERE provenance.chunk_id IS NULL
`;
function ensureMemoryChunkProvenance(db) {
	const ensure = () => {
		db.exec("DROP TRIGGER IF EXISTS memory_index_chunk_provenance_after_insert");
		db.exec(MEMORY_INDEX_CHUNK_PROVENANCE_SCHEMA_SQL);
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
		ensure();
		return;
	}
	runSqliteImmediateTransactionSync(db, ensure);
}
//#endregion
//#region packages/memory-host-sdk/src/host/memory-schema-recall.ts
const MEMORY_INDEX_CHUNKS_TABLE = "memory_index_chunks";
const MEMORY_INDEX_CHUNK_RECALL_METADATA_TABLE = "memory_index_chunk_recall_metadata";
const MEMORY_INDEX_CHUNK_RECALL_METADATA_SCHEMA_SQL = `
  CREATE TABLE IF NOT EXISTS ${MEMORY_INDEX_CHUNK_RECALL_METADATA_TABLE} (
    chunk_id TEXT PRIMARY KEY,
    importance INTEGER CHECK (importance IS NULL OR importance BETWEEN 1 AND 10),
    triggers TEXT,
    project_key TEXT,
    FOREIGN KEY (chunk_id) REFERENCES ${MEMORY_INDEX_CHUNKS_TABLE}(id) ON DELETE CASCADE
  ) STRICT;
`;
function readMemoryChunkColumns(db) {
	const rows = db.prepare(`PRAGMA table_info(${MEMORY_INDEX_CHUNKS_TABLE})`).all();
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
      FROM ${MEMORY_INDEX_CHUNKS_TABLE}
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
		]) if (columns.has(column)) db.exec(`ALTER TABLE ${MEMORY_INDEX_CHUNKS_TABLE} DROP COLUMN ${column}`);
	};
	if (db.isTransaction) {
		ensure();
		return;
	}
	runSqliteImmediateTransactionSync(db, ensure);
}
//#endregion
//#region packages/memory-host-sdk/src/host/memory-schema-base.ts
const MEMORY_INDEX_META_TABLE = "memory_index_meta";
const MEMORY_EMBEDDING_CACHE_TABLE = "memory_embedding_cache";
const MEMORY_INDEX_STATE_TABLE = "memory_index_state";
const MEMORY_INDEX_VECTOR_TABLE = "memory_index_chunks_vec";
const MEMORY_INDEX_CHUNKS_SCHEMA_SQL = `
  CREATE TABLE IF NOT EXISTS ${MEMORY_INDEX_CHUNKS_TABLE$1} (
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
const MEMORY_INDEX_DERIVED_TABLES = [
	MEMORY_INDEX_VECTOR_TABLE,
	MEMORY_INDEX_FTS_TABLE,
	MEMORY_INDEX_PATHS_FTS_TABLE,
	MEMORY_INDEX_CHUNK_RECALL_METADATA_TABLE,
	MEMORY_INDEX_CHUNK_PROVENANCE_TABLE,
	MEMORY_INDEX_CHUNKS_TABLE$1,
	MEMORY_INDEX_SOURCES_TABLE,
	MEMORY_INDEX_META_TABLE,
	MEMORY_EMBEDDING_CACHE_TABLE,
	MEMORY_INDEX_STATE_TABLE
];
function buildMemoryIndexStrictSchema(params) {
	const embeddingCacheSql = params.includeEmbeddingCache ? buildMemoryEmbeddingCacheSchema(params.embeddingCacheTable) : "";
	return `
    CREATE TABLE IF NOT EXISTS ${MEMORY_INDEX_META_TABLE} (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    ) STRICT;
    CREATE TABLE IF NOT EXISTS ${MEMORY_INDEX_SOURCES_TABLE} (
      id INTEGER PRIMARY KEY,
      path TEXT NOT NULL,
      source TEXT NOT NULL DEFAULT 'memory',
      hash TEXT NOT NULL,
      mtime REAL NOT NULL,
      size INTEGER NOT NULL,
      UNIQUE (path, source)
    ) STRICT;
    ${MEMORY_INDEX_CHUNKS_SCHEMA_SQL}
    ${MEMORY_INDEX_CHUNK_RECALL_METADATA_SCHEMA_SQL}
    ${MEMORY_INDEX_CHUNK_PROVENANCE_SCHEMA_SQL}
    CREATE TABLE IF NOT EXISTS ${MEMORY_INDEX_STATE_TABLE} (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      revision INTEGER NOT NULL
    ) STRICT;
    ${embeddingCacheSql}
  `;
}
//#endregion
//#region packages/memory-host-sdk/src/host/memory-schema-migration.ts
function assertLegacyMemoryRowsCopied(db, query, tableName) {
	const row = db.prepare(query).get();
	if (Number(row?.missing ?? 0) > 0) throw new Error(`legacy memory ${tableName} rows could not be copied into canonical memory index rows`);
}
function ensureLegacyMemoryMigrationIndexes(db, schema) {
	db.exec(`
    CREATE INDEX IF NOT EXISTS ${schema}.memory_legacy_files_path_source_migration
      ON files(path, source);
    CREATE INDEX IF NOT EXISTS ${schema}.memory_legacy_chunks_path_source_migration
      ON chunks(path, source);
  `);
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
function storageShape(db, table, chunks) {
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
	});
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
	return {
		chunks: storageShape(db, "memory_index_chunks", true),
		cache: storageShape(db, cacheTable, false)
	};
}
function assertBinaryEmbeddings(db, table) {
	if (db.prepare(`SELECT 1 FROM ${table} WHERE openclaw_memory_embedding_blob_valid(embedding) = 0 LIMIT 1`).get()) throw new Error(`Memory storage migration found invalid binary embeddings in ${table}`);
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
}
function existingStorageObjects(db, table) {
	return db.prepare(`SELECT sql FROM main.sqlite_schema
    WHERE tbl_name = ? AND type IN ('index', 'trigger') AND sql IS NOT NULL
    ORDER BY type, name`).all(table).map((row) => String(row.sql));
}
/** Record regeneration debt after a legacy import has verified its canonical copy. */
function markInvalidImportedMemoryEmbeddings(db, schema) {
	if (!/^[A-Za-z_][A-Za-z0-9_]*$/u.test(schema)) throw new Error("Invalid legacy memory schema identifier");
	const invalidChunks = `
    SELECT chunk.path, chunk.source
    FROM ${schema}.chunks AS legacy
    JOIN main.memory_index_chunks AS chunk ON chunk.id = legacy.id
    WHERE openclaw_memory_embedding_json_valid(legacy.embedding) = 0
      AND length(chunk.embedding) = 0`;
	db.exec(`
    UPDATE main.memory_index_sources SET hash = ''
    WHERE (path, source) IN (${invalidChunks});
    INSERT INTO main.memory_index_meta (key, value)
    SELECT 'memory_vector_rebuild_v1', '1' WHERE EXISTS (${invalidChunks})
    ON CONFLICT(key) DO UPDATE SET value = excluded.value;
  `);
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
	try {
		runSqliteImmediateTransactionSync(db, () => {
			const current = storageShapes(db, cacheTable);
			if (current.chunks !== shapes.chunks || current.cache !== shapes.cache) throw new Error("Memory storage schema changed before migration admission");
			registerMemoryEmbeddingMigrationFunctions(db, options.renewAuthority);
			const chunkObjects = migrateChunks ? existingStorageObjects(db, "memory_index_chunks") : [];
			const cacheObjects = migrateCache ? existingStorageObjects(db, cacheTable) : [];
			if (current.chunks === "binary") assertBinaryEmbeddings(db, "memory_index_chunks");
			if (current.cache === "binary") assertBinaryEmbeddings(db, cacheTable);
			if (migrateChunks) {
				ensureMemoryRecallMetadataSchema(db);
				db.exec(`
          UPDATE memory_index_sources SET hash = ''
          WHERE (path, source) IN (
            SELECT path, source FROM memory_index_chunks
            WHERE openclaw_memory_embedding_json_valid(embedding) = 0
          );
          INSERT INTO memory_index_meta (key, value)
          SELECT 'memory_vector_rebuild_v1', '1'
          WHERE EXISTS (
            SELECT 1 FROM memory_index_chunks
            WHERE openclaw_memory_embedding_json_valid(embedding) = 0
          )
          ON CONFLICT(key) DO UPDATE SET value = excluded.value;
        `);
				dropMemoryChunkFtsTriggers(db);
				db.exec(MEMORY_INDEX_CHUNKS_SCHEMA_SQL.replace("CREATE TABLE IF NOT EXISTS", "CREATE TABLE").replace("memory_index_chunks", "memory_index_chunks_storage_migration"));
				db.exec(`
          INSERT INTO memory_index_chunks_storage_migration (
            chunk_rowid, id, path, source, start_line, end_line, hash, model, text, embedding, updated_at
          )
          SELECT rowid, id, path, source, start_line, end_line, hash, model, text,
                 openclaw_memory_embedding_from_json(embedding), updated_at
          FROM memory_index_chunks;
          DROP TABLE memory_index_chunks;
          ALTER TABLE memory_index_chunks_storage_migration RENAME TO memory_index_chunks;
        `);
				for (const sql of chunkObjects) db.exec(sql);
				if (db.prepare("SELECT 1 FROM sqlite_schema WHERE type = 'table' AND name = ?").get("memory_index_chunks_fts")) {
					rebuildMemoryChunkFts(db, MEMORY_INDEX_FTS_TABLE);
					ensureMemoryChunkFtsTriggers(db);
				}
			}
			if (migrateCache) {
				const replacement = `${cacheTable}_storage_migration`;
				db.exec(buildMemoryEmbeddingCacheSchema(replacement).replace("CREATE TABLE IF NOT EXISTS", "CREATE TABLE"));
				db.exec(`
          INSERT INTO ${replacement} (rowid, provider, model, provider_key, hash, embedding, dims, updated_at)
          SELECT rowid, provider, model, provider_key, hash,
                 openclaw_memory_embedding_from_json(embedding), dims, updated_at
          FROM ${cacheTable};
          DROP TABLE ${cacheTable};
          ALTER TABLE ${replacement} RENAME TO ${cacheTable};
        `);
				for (const sql of cacheObjects) db.exec(sql);
			}
			if (migrateChunks) {
				for (const table of ["memory_index_chunk_provenance", "memory_index_chunk_recall_metadata"]) if (columns(db, table).size > 0 && db.prepare(`PRAGMA foreign_key_check(${table})`).all().length > 0) throw new Error("Memory storage migration failed foreign key validation");
			}
		});
	} finally {
		if (options.renewAuthority) registerMemoryEmbeddingMigrationFunctions(db);
		if (migrateChunks && foreignKeys) db.exec("PRAGMA foreign_keys = ON");
	}
}
//#endregion
//#region packages/memory-host-sdk/src/host/memory-schema.ts
const LEGACY_MEMORY_INDEX_TRIGGERS = [
	"memory_files_revision_after_insert",
	"memory_files_revision_after_update",
	"memory_files_revision_after_delete",
	"memory_chunks_revision_after_insert",
	"memory_chunks_revision_after_update",
	"memory_chunks_revision_after_delete"
];
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
function tableColumnInfo(db, tableName, schema = "main") {
	return db.prepare(`PRAGMA ${schema}.table_xinfo(${tableName})`).all().flatMap((row) => typeof row.name === "string" && typeof row.type === "string" ? [{
		name: row.name,
		type: row.type.toUpperCase(),
		notnull: Number(row.notnull ?? 0),
		pk: Number(row.pk ?? 0),
		defaultValue: typeof row.dflt_value === "string" ? row.dflt_value : null,
		hidden: Number(row.hidden ?? 0)
	}] : []);
}
function tableColumns(db, tableName, schema = "main") {
	return new Set(tableColumnInfo(db, tableName, schema).map((row) => row.name));
}
function tableHasExactColumns(db, tableName, expected, schema = "main") {
	const columns = tableColumns(db, tableName, schema);
	return columns.size === expected.length && expected.every((column) => columns.has(column));
}
function tablePrimaryKeyColumns(db, tableName) {
	return tableColumnInfo(db, tableName).filter((row) => row.pk > 0).toSorted((left, right) => left.pk - right.pk).map((row) => row.name);
}
function tableHasPrimaryKey(db, tableName, expectedColumns) {
	const columns = tablePrimaryKeyColumns(db, tableName);
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
function tableHasCanonicalSourceColumnTypes(db) {
	return tableColumnInfo(db, MEMORY_INDEX_SOURCES_TABLE).every((column) => {
		const expectedType = MEMORY_INDEX_SOURCE_COLUMN_TYPES.get(column.name);
		const expectedDefault = column.name === "source" ? "'memory'" : null;
		if (column.type !== expectedType && !(column.name === "mtime" && column.type === "INTEGER") || column.defaultValue !== expectedDefault || column.hidden !== 0) return false;
		return true;
	});
}
function tableHasCanonicalSourceColumns(db) {
	return tableHasCanonicalSourceColumnTypes(db) && tableColumnInfo(db, "memory_index_sources").every((column) => {
		return column.name === "id" || column.notnull === 1;
	});
}
function tableHasLegacySourceColumns(db, hasPathPrimaryKey) {
	return tableHasCanonicalSourceColumnTypes(db) && tableColumnInfo(db, "memory_index_sources").every((column) => {
		return hasPathPrimaryKey && column.name === "path" || column.notnull === 1;
	});
}
function tableHasIntegerRowIdPrimaryKey(db) {
	if (tableColumnInfo(db, "memory_index_sources").find((column) => column.name === "id")?.type !== "INTEGER" || !tableHasPrimaryKey(db, "memory_index_sources", ["id"])) return false;
	return db.prepare(`SELECT 1 AS found FROM pragma_index_list(?) WHERE origin = 'pk' LIMIT 1`).get(MEMORY_INDEX_SOURCES_TABLE)?.found !== 1;
}
function tableExists(db, tableName) {
	return db.prepare(`SELECT 1 AS found FROM sqlite_master WHERE type = 'table' AND name = ?`).get(tableName)?.found === 1;
}
/** Upgrade canonical memory sources to stable integer identities. */
function migrateMemoryIndexSourcesIdentity(db) {
	if (!tableExists(db, "memory_index_sources")) return;
	if (tableHasExactColumns(db, "memory_index_sources", MEMORY_INDEX_SOURCE_COLUMNS)) {
		if (tableHasCanonicalSourceColumns(db) && tableHasIntegerRowIdPrimaryKey(db) && tableHasNoDeclaredCollations(db, "memory_index_sources") && tableHasUniqueIndex(db, "memory_index_sources", ["path", "source"])) return;
		throw new Error("canonical memory source identity schema is invalid");
	}
	if (!tableHasExactColumns(db, "memory_index_sources", LEGACY_MEMORY_INDEX_SOURCE_COLUMNS)) throw new Error("canonical memory source identity schema is invalid");
	const hasPathPrimaryKey = tableHasPrimaryKey(db, MEMORY_INDEX_SOURCES_TABLE, ["path"]);
	const hasPathSourcePrimaryKey = tableHasPrimaryKey(db, MEMORY_INDEX_SOURCES_TABLE, ["path", "source"]);
	if (!hasPathPrimaryKey && !hasPathSourcePrimaryKey) throw new Error("canonical memory source identity schema is invalid");
	if (!tableHasLegacySourceColumns(db, hasPathPrimaryKey)) throw new Error("canonical memory source identity schema is invalid");
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
function hasLegacyMemoryIndexTables(db, schema = "main") {
	return tableHasExactColumns(db, "meta", ["key", "value"], schema) && tableHasExactColumns(db, "files", [
		"path",
		"source",
		"hash",
		"mtime",
		"size"
	], schema) && tableHasExactColumns(db, "chunks", [
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
	], schema);
}
function hasLegacyEmbeddingCacheTable(db, schema = "main") {
	return tableHasExactColumns(db, "embedding_cache", [
		"provider",
		"model",
		"provider_key",
		"hash",
		"embedding",
		"dims",
		"updated_at"
	], schema);
}
function copyLegacyMemoryIndexRows(db, schema, preservedEmbeddingCacheTable) {
	ensureLegacyMemoryMigrationIndexes(db, schema);
	registerMemoryEmbeddingMigrationFunctions(db);
	db.exec(`
    CREATE TEMP TABLE legacy_import_chunk_excluded_sources AS
    SELECT DISTINCT owned.path, owned.source,
      CASE WHEN EXISTS (
        SELECT 1 FROM ${schema}.chunks AS legacy_chunk
        WHERE legacy_chunk.path = owned.path AND legacy_chunk.source IS owned.source
          AND NOT EXISTS (
            SELECT 1 FROM main.${MEMORY_INDEX_CHUNKS_TABLE$1} AS canonical_chunk
            WHERE canonical_chunk.id = legacy_chunk.id
              AND canonical_chunk.path IS legacy_chunk.path AND canonical_chunk.source IS legacy_chunk.source
          )
      ) THEN 1 ELSE 0 END AS force_reindex
    FROM main.${MEMORY_INDEX_CHUNKS_TABLE$1} AS owned
    WHERE EXISTS (
      SELECT 1 FROM ${schema}.files AS legacy_file
      WHERE legacy_file.path = owned.path AND legacy_file.source IS owned.source
    )
    UNION ALL
    SELECT canonical.path, canonical.source, 1 AS force_reindex
    FROM main.${MEMORY_INDEX_SOURCES_TABLE} AS canonical
    JOIN ${schema}.files AS legacy
      ON legacy.path = canonical.path AND legacy.source IS canonical.source
    WHERE (
      canonical.hash IS NOT legacy.hash
      OR canonical.mtime IS NOT legacy.mtime
      OR canonical.size IS NOT legacy.size
    )
      AND NOT EXISTS (
        SELECT 1 FROM main.${MEMORY_INDEX_CHUNKS_TABLE$1} AS chunk
        WHERE chunk.path = canonical.path AND chunk.source IS canonical.source
      );

    CREATE TEMP TABLE legacy_import_dirty_sources AS
    SELECT legacy.path, legacy.source
    FROM ${schema}.files AS legacy
    WHERE NOT EXISTS (
      SELECT 1 FROM main.${MEMORY_INDEX_SOURCES_TABLE} AS canonical
      WHERE canonical.path = legacy.path AND canonical.source IS legacy.source
    )
    UNION
    SELECT legacy.path, legacy.source
    FROM ${schema}.chunks AS legacy
    WHERE EXISTS (
      SELECT 1 FROM ${schema}.files AS owner
      WHERE owner.path = legacy.path AND owner.source IS legacy.source
    )
      AND NOT EXISTS (
        SELECT 1 FROM temp.legacy_import_chunk_excluded_sources AS excluded
        WHERE excluded.path = legacy.path AND excluded.source IS legacy.source
      )
      AND NOT EXISTS (
        SELECT 1 FROM main.${MEMORY_INDEX_CHUNKS_TABLE$1} AS canonical
        WHERE canonical.id = legacy.id
      )
    UNION
    SELECT excluded.path, excluded.source
    FROM temp.legacy_import_chunk_excluded_sources AS excluded
    WHERE excluded.force_reindex = 1;
  `);
	try {
		db.exec(`
      INSERT OR IGNORE INTO main.${MEMORY_INDEX_META_TABLE} (key, value)
      SELECT key, value FROM ${schema}.meta;

      INSERT OR IGNORE INTO main.${MEMORY_INDEX_SOURCES_TABLE} (path, source, hash, mtime, size)
      SELECT path, source, hash, mtime, size
      FROM ${schema}.files;

      INSERT OR IGNORE INTO main.${MEMORY_INDEX_CHUNKS_TABLE$1} (
        id, path, source, start_line, end_line, hash, model, text, embedding, updated_at
      )
      -- Chunks are derived from source rows. Shipped cleanup could leave an
      -- ownerless legacy chunk, which must not become permanently searchable.
      SELECT id, path, source, start_line, end_line, hash, model, text,
             openclaw_memory_embedding_from_json(embedding), updated_at
      FROM ${schema}.chunks AS legacy
      WHERE EXISTS (
        SELECT 1 FROM ${schema}.files AS owner
        WHERE owner.path = legacy.path AND owner.source IS legacy.source
      )
        AND NOT EXISTS (
          SELECT 1 FROM temp.legacy_import_chunk_excluded_sources AS excluded
          WHERE excluded.path = legacy.path AND excluded.source IS legacy.source
        );

      -- Content hashes are SHA-256 hex, so an empty hash cannot match a file.
      -- Imported sources or chunks may be absent from runtime-owned vector
      -- indexes, while excluded sources need a canonical rebuild. Retaining the
      -- dirty source lets sync rebuild every derived row or clean up a deleted file.
      UPDATE main.${MEMORY_INDEX_SOURCES_TABLE}
      SET hash = ''
      WHERE EXISTS (
        SELECT 1 FROM temp.legacy_import_dirty_sources AS dirty
        WHERE dirty.path = main.${MEMORY_INDEX_SOURCES_TABLE}.path
          AND dirty.source IS main.${MEMORY_INDEX_SOURCES_TABLE}.source
      );
    `);
		assertLegacyMemoryRowsCopied(db, `SELECT COUNT(*) AS missing
       FROM ${schema}.meta AS legacy
       WHERE NOT EXISTS (
         SELECT 1 FROM main.${MEMORY_INDEX_META_TABLE} AS canonical
         WHERE canonical.key = legacy.key
       )`, "meta");
		assertLegacyMemoryRowsCopied(db, `SELECT COUNT(*) AS missing
       FROM ${schema}.files AS legacy
       WHERE NOT EXISTS (
         SELECT 1 FROM main.${MEMORY_INDEX_SOURCES_TABLE} AS canonical
         WHERE canonical.path = legacy.path
           AND canonical.source IS legacy.source
       )
       AND NOT EXISTS (
         SELECT 1 FROM temp.legacy_import_chunk_excluded_sources AS excluded
         WHERE excluded.force_reindex = 1
           AND excluded.path = legacy.path
           AND excluded.source IS legacy.source
       )`, "files");
		assertLegacyMemoryRowsCopied(db, `SELECT COUNT(*) AS missing
       FROM ${schema}.chunks AS legacy
       WHERE EXISTS (
         SELECT 1 FROM ${schema}.files AS owner
         WHERE owner.path = legacy.path AND owner.source IS legacy.source
       )
       AND NOT EXISTS (
         SELECT 1 FROM main.${MEMORY_INDEX_CHUNKS_TABLE$1} AS canonical
         WHERE canonical.id = legacy.id
           AND canonical.path IS legacy.path
           AND canonical.source IS legacy.source
       )
       AND NOT EXISTS (
         SELECT 1 FROM temp.legacy_import_chunk_excluded_sources AS excluded
         WHERE excluded.path = legacy.path AND excluded.source IS legacy.source
       )`, "chunks");
		db.exec(`
      INSERT OR IGNORE INTO main.${MEMORY_INDEX_SOURCES_TABLE} (path, source, hash, mtime, size)
      SELECT DISTINCT orphan.path, orphan.source, '', 0, 0 FROM main.${MEMORY_INDEX_CHUNKS_TABLE$1} AS orphan
      WHERE NOT EXISTS (
        SELECT 1 FROM main.${MEMORY_INDEX_SOURCES_TABLE} AS owner
        WHERE owner.path = orphan.path AND owner.source IS orphan.source
      );
    `);
	} finally {
		db.exec("DROP TABLE temp.legacy_import_dirty_sources");
		db.exec("DROP TABLE temp.legacy_import_chunk_excluded_sources");
	}
	if (preservedEmbeddingCacheTable !== "embedding_cache" && hasLegacyEmbeddingCacheTable(db, schema)) {
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
		assertLegacyMemoryRowsCopied(db, `SELECT COUNT(*) AS missing
       FROM ${schema}.embedding_cache AS legacy
       WHERE NOT EXISTS (
         SELECT 1 FROM main.${MEMORY_EMBEDDING_CACHE_TABLE} AS canonical
         WHERE canonical.provider = legacy.provider
           AND canonical.model = legacy.model
           AND canonical.provider_key = legacy.provider_key
           AND canonical.hash = legacy.hash
       )`, "embedding_cache");
	}
	markInvalidImportedMemoryEmbeddings(db, schema);
}
function migrateLegacyMemoryIndexTables(db, preservedEmbeddingCacheTable, ftsTable = MEMORY_INDEX_FTS_TABLE) {
	if (!hasLegacyMemoryIndexTables(db)) return;
	db.exec("SAVEPOINT migrate_legacy_memory_index_tables");
	try {
		copyLegacyMemoryIndexRows(db, "main", preservedEmbeddingCacheTable);
		if (ftsTable !== "chunks_fts" && tableExists(db, ftsTable)) rebuildMemoryChunkFts(db, ftsTable);
		if (preservedEmbeddingCacheTable !== "embedding_cache" && hasLegacyEmbeddingCacheTable(db)) db.exec("DROP TABLE embedding_cache");
		for (const trigger of LEGACY_MEMORY_INDEX_TRIGGERS) db.exec(`DROP TRIGGER IF EXISTS ${trigger}`);
		db.exec(`
      DROP TABLE IF EXISTS chunks_fts;
      DROP TABLE chunks;
      DROP TABLE files;
      DROP TABLE meta;
      RELEASE migrate_legacy_memory_index_tables;
    `);
	} catch (err) {
		db.exec("ROLLBACK TO migrate_legacy_memory_index_tables");
		db.exec("RELEASE migrate_legacy_memory_index_tables");
		throw err;
	}
}
/** Ensure canonical memory index tables and the optional FTS table exist. */
function ensureMemoryIndexSchema(params) {
	const embeddingCacheTable = params.embeddingCacheTable ?? "memory_embedding_cache";
	const ftsTable = params.ftsTable ?? "memory_index_chunks_fts";
	params.db.exec(buildMemoryIndexStrictSchema({
		embeddingCacheTable,
		includeEmbeddingCache: params.cacheEnabled
	}));
	migrateMemoryIndexStorage(params.db, { embeddingCacheTable });
	ensureMemoryRecallMetadataSchema(params.db);
	params.db.exec(`
    INSERT OR IGNORE INTO ${MEMORY_INDEX_STATE_TABLE} (id, revision) VALUES (1, 0);
  `);
	migrateMemoryIndexSourcesIdentity(params.db);
	params.db.exec(`

    CREATE TRIGGER IF NOT EXISTS memory_index_sources_revision_after_insert
    AFTER INSERT ON ${MEMORY_INDEX_SOURCES_TABLE}
    BEGIN
      UPDATE ${MEMORY_INDEX_STATE_TABLE} SET revision = revision + 1 WHERE id = 1;
    END;
    CREATE TRIGGER IF NOT EXISTS memory_index_sources_revision_after_update
    AFTER UPDATE ON ${MEMORY_INDEX_SOURCES_TABLE}
    BEGIN
      UPDATE ${MEMORY_INDEX_STATE_TABLE} SET revision = revision + 1 WHERE id = 1;
    END;
    CREATE TRIGGER IF NOT EXISTS memory_index_sources_revision_after_delete
    AFTER DELETE ON ${MEMORY_INDEX_SOURCES_TABLE}
    BEGIN
      UPDATE ${MEMORY_INDEX_STATE_TABLE} SET revision = revision + 1 WHERE id = 1;
    END;

    CREATE TRIGGER IF NOT EXISTS memory_index_chunks_revision_after_insert
    AFTER INSERT ON ${MEMORY_INDEX_CHUNKS_TABLE$1}
    BEGIN
      UPDATE ${MEMORY_INDEX_STATE_TABLE} SET revision = revision + 1 WHERE id = 1;
    END;
    CREATE TRIGGER IF NOT EXISTS memory_index_chunks_revision_after_update
    AFTER UPDATE ON ${MEMORY_INDEX_CHUNKS_TABLE$1}
    BEGIN
      UPDATE ${MEMORY_INDEX_STATE_TABLE} SET revision = revision + 1 WHERE id = 1;
    END;
    CREATE TRIGGER IF NOT EXISTS memory_index_chunks_revision_after_delete
    AFTER DELETE ON ${MEMORY_INDEX_CHUNKS_TABLE$1}
    BEGIN
      UPDATE ${MEMORY_INDEX_STATE_TABLE} SET revision = revision + 1 WHERE id = 1;
    END;

    CREATE INDEX IF NOT EXISTS idx_memory_index_sources_source
      ON ${MEMORY_INDEX_SOURCES_TABLE}(source);
    CREATE INDEX IF NOT EXISTS idx_memory_index_chunks_path_source
      ON ${MEMORY_INDEX_CHUNKS_TABLE$1}(path, source);
    CREATE INDEX IF NOT EXISTS idx_memory_index_chunks_path
      ON ${MEMORY_INDEX_CHUNKS_TABLE$1}(path);
    CREATE INDEX IF NOT EXISTS idx_memory_index_chunks_source
      ON ${MEMORY_INDEX_CHUNKS_TABLE$1}(source);
  `);
	migrateLegacyMemoryIndexTables(params.db, params.embeddingCacheTable, ftsTable);
	ensureMemoryChunkProvenance(params.db);
	dropDisabledMemoryFts(params.db, ftsTable, params.ftsEnabled);
	if (params.cacheEnabled) {
		const updatedAtIndex = embeddingCacheTable === "memory_embedding_cache" ? "idx_memory_embedding_cache_updated_at" : "idx_embedding_cache_updated_at";
		params.db.exec(`
      CREATE INDEX IF NOT EXISTS ${updatedAtIndex}
        ON ${embeddingCacheTable}(updated_at);
    `);
	}
	migrateSqliteSchemaToStrict(params.db, buildMemoryIndexStrictSchema({
		embeddingCacheTable,
		includeEmbeddingCache: params.cacheEnabled || tableExists(params.db, embeddingCacheTable)
	}), { databaseLabel: "memory index" });
	let ftsAvailable = false;
	let ftsError;
	if (params.ftsEnabled) try {
		const tokenizeClause = (params.ftsTokenizer ?? "unicode61") === "trigram" ? `, tokenize='trigram case_sensitive 0'` : "";
		ensureMemoryChunkFtsSchema({
			db: params.db,
			ftsTable,
			tokenizeClause
		});
		if (ftsTable === "memory_index_chunks_fts") ensureMemoryPathFtsSchema({
			db: params.db,
			tokenizeClause
		});
		ftsAvailable = true;
	} catch (err) {
		if (ftsTable === "memory_index_chunks_fts") {
			dropMemoryChunkFtsTriggers(params.db);
			dropMemoryPathFtsTriggers(params.db);
		}
		const message = formatErrorMessage(err);
		ftsAvailable = false;
		ftsError = message;
	}
	return {
		ftsAvailable,
		...ftsError ? { ftsError } : {}
	};
}
//#endregion
export { dropMemoryPathFtsTriggers as C, rebuildMemoryChunkFts as E, dropMemoryChunkFtsTriggers as S, ensureMemoryPathFtsTriggers as T, MEMORY_INDEX_CHUNKS_TABLE$1 as _, registerMemoryEmbeddingMigrationFunctions as a, MEMORY_INDEX_SOURCES_TABLE as b, MEMORY_INDEX_META_TABLE as c, MEMORY_INDEX_CHUNK_RECALL_METADATA_TABLE as d, ensureMemoryRecallMetadataSchema as f, MEMORY_CHUNK_FTS_TRIGGER_DEFINITIONS as g, ensureMemoryChunkProvenance as h, migrateMemoryIndexStorage as i, MEMORY_INDEX_STATE_TABLE as l, MEMORY_INDEX_CHUNK_PROVENANCE_TABLE as m, migrateMemoryIndexSourcesIdentity as n, MEMORY_EMBEDDING_CACHE_TABLE as o, hasLegacyMemoryRecallMetadataColumns as p, markInvalidImportedMemoryEmbeddings as r, MEMORY_INDEX_DERIVED_TABLES as s, ensureMemoryIndexSchema as t, MEMORY_INDEX_VECTOR_TABLE as u, MEMORY_INDEX_FTS_TABLE as v, ensureMemoryChunkFtsTriggers as w, MEMORY_PATH_FTS_TRIGGER_DEFINITIONS as x, MEMORY_INDEX_PATHS_FTS_TABLE as y };
