import { t as installProcessWarningFilter } from "./warning-filter-p3Ue6g9S.js";
import { n as configureSqliteWalMaintenance, t as configureSqliteConnectionPragmas } from "./sqlite-wal-BoUtAnjK.js";
import { r as normalizeOptionalString } from "./string-utils-BtCofrRx.js";
import "./fs-utils-B-YGVvwo.js";
import "./internal-DYu9FgcQ.js";
import "./read-file-Ct9Hg2Gy.js";
import "./backend-config-CNg8FV-B.js";
import { t as formatErrorMessage } from "./error-utils-C9KhFRGg.js";
import { createRequire } from "node:module";
//#region packages/memory-host-sdk/src/host/memory-schema.ts
const MEMORY_INDEX_META_TABLE = "memory_index_meta";
const MEMORY_INDEX_SOURCES_TABLE = "memory_index_sources";
const MEMORY_INDEX_CHUNKS_TABLE = "memory_index_chunks";
const MEMORY_EMBEDDING_CACHE_TABLE = "memory_embedding_cache";
const MEMORY_INDEX_STATE_TABLE = "memory_index_state";
const MEMORY_INDEX_FTS_TABLE = "memory_index_chunks_fts";
const MEMORY_INDEX_VECTOR_TABLE = "memory_index_chunks_vec";
const LEGACY_MEMORY_INDEX_TRIGGERS = [
	"memory_files_revision_after_insert",
	"memory_files_revision_after_update",
	"memory_files_revision_after_delete",
	"memory_chunks_revision_after_insert",
	"memory_chunks_revision_after_update",
	"memory_chunks_revision_after_delete"
];
const MEMORY_INDEX_SOURCE_COLUMNS = [
	"path",
	"source",
	"hash",
	"mtime",
	"size"
];
function tableHasExactColumns(db, tableName, expected) {
	const rows = db.prepare(`PRAGMA table_info(${tableName})`).all();
	const columns = new Set(rows.flatMap((row) => typeof row.name === "string" ? [row.name] : []));
	return columns.size === expected.length && expected.every((column) => columns.has(column));
}
function tablePrimaryKeyColumns(db, tableName) {
	return db.prepare(`PRAGMA table_info(${tableName})`).all().flatMap((row) => typeof row.name === "string" && typeof row.pk === "number" && row.pk > 0 ? [{
		name: row.name,
		pk: row.pk
	}] : []).toSorted((left, right) => left.pk - right.pk).map((row) => row.name);
}
function tableHasPrimaryKey(db, tableName, expectedColumns) {
	const columns = tablePrimaryKeyColumns(db, tableName);
	return columns.length === expectedColumns.length && columns.every((column, index) => column === expectedColumns[index]);
}
function assertLegacyRowsCopied(db, query, tableName) {
	const row = db.prepare(query).get();
	if (Number(row?.missing ?? 0) > 0) throw new Error(`legacy memory ${tableName} rows conflict with canonical memory index rows`);
}
function migrateCanonicalMemoryIndexSourcesPrimaryKey(db) {
	if (!tableHasExactColumns(db, "memory_index_sources", MEMORY_INDEX_SOURCE_COLUMNS) || tableHasPrimaryKey(db, "memory_index_sources", ["path", "source"])) return;
	if (!tableHasPrimaryKey(db, "memory_index_sources", ["path"])) return;
	db.exec("SAVEPOINT migrate_memory_index_sources_primary_key");
	try {
		db.exec(`
      DROP TRIGGER IF EXISTS memory_index_sources_revision_after_insert;
      DROP TRIGGER IF EXISTS memory_index_sources_revision_after_update;
      DROP TRIGGER IF EXISTS memory_index_sources_revision_after_delete;

      ALTER TABLE ${MEMORY_INDEX_SOURCES_TABLE}
        RENAME TO memory_index_sources_path_pk_migration;
      CREATE TABLE ${MEMORY_INDEX_SOURCES_TABLE} (
        path TEXT NOT NULL,
        source TEXT NOT NULL DEFAULT 'memory',
        hash TEXT NOT NULL,
        mtime INTEGER NOT NULL,
        size INTEGER NOT NULL,
        PRIMARY KEY (path, source)
      );
      INSERT INTO ${MEMORY_INDEX_SOURCES_TABLE} (path, source, hash, mtime, size)
      SELECT path, source, hash, mtime, size FROM memory_index_sources_path_pk_migration;
      DROP TABLE memory_index_sources_path_pk_migration;
      RELEASE migrate_memory_index_sources_primary_key;
    `);
	} catch (err) {
		db.exec("ROLLBACK TO migrate_memory_index_sources_primary_key");
		db.exec("RELEASE migrate_memory_index_sources_primary_key");
		throw err;
	}
}
function migrateLegacyMemoryIndexTables(db, preservedEmbeddingCacheTable) {
	if (!(tableHasExactColumns(db, "meta", ["key", "value"]) && tableHasExactColumns(db, "files", [
		"path",
		"source",
		"hash",
		"mtime",
		"size"
	]) && tableHasExactColumns(db, "chunks", [
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
	]))) return;
	db.exec("SAVEPOINT migrate_legacy_memory_index_tables");
	try {
		db.exec(`
      INSERT OR IGNORE INTO ${MEMORY_INDEX_META_TABLE} (key, value)
      SELECT key, value FROM meta;

      INSERT OR IGNORE INTO ${MEMORY_INDEX_SOURCES_TABLE} (path, source, hash, mtime, size)
      SELECT path, source, hash, mtime, size FROM files;

      INSERT OR IGNORE INTO ${MEMORY_INDEX_CHUNKS_TABLE} (
        id, path, source, start_line, end_line, hash, model, text, embedding, updated_at
      )
      SELECT id, path, source, start_line, end_line, hash, model, text, embedding, updated_at
      FROM chunks;
    `);
		assertLegacyRowsCopied(db, `SELECT COUNT(*) AS missing
       FROM meta AS legacy
       WHERE NOT EXISTS (
         SELECT 1 FROM ${MEMORY_INDEX_META_TABLE} AS canonical
         WHERE canonical.key = legacy.key AND canonical.value IS legacy.value
       )`, "meta");
		assertLegacyRowsCopied(db, `SELECT COUNT(*) AS missing
       FROM files AS legacy
       WHERE NOT EXISTS (
         SELECT 1 FROM ${MEMORY_INDEX_SOURCES_TABLE} AS canonical
         WHERE canonical.path = legacy.path
           AND canonical.source IS legacy.source
           AND canonical.hash IS legacy.hash
           AND canonical.mtime IS legacy.mtime
           AND canonical.size IS legacy.size
       )`, "files");
		assertLegacyRowsCopied(db, `SELECT COUNT(*) AS missing
       FROM chunks AS legacy
       WHERE NOT EXISTS (
         SELECT 1 FROM ${MEMORY_INDEX_CHUNKS_TABLE} AS canonical
         WHERE canonical.id = legacy.id
           AND canonical.path IS legacy.path
           AND canonical.source IS legacy.source
           AND canonical.start_line IS legacy.start_line
           AND canonical.end_line IS legacy.end_line
           AND canonical.hash IS legacy.hash
           AND canonical.model IS legacy.model
           AND canonical.text IS legacy.text
           AND canonical.embedding IS legacy.embedding
           AND canonical.updated_at IS legacy.updated_at
       )`, "chunks");
		if (preservedEmbeddingCacheTable !== "embedding_cache" && tableHasExactColumns(db, "embedding_cache", [
			"provider",
			"model",
			"provider_key",
			"hash",
			"embedding",
			"dims",
			"updated_at"
		])) {
			db.exec(`
        CREATE TABLE IF NOT EXISTS ${MEMORY_EMBEDDING_CACHE_TABLE} (
          provider TEXT NOT NULL,
          model TEXT NOT NULL,
          provider_key TEXT NOT NULL,
          hash TEXT NOT NULL,
          embedding TEXT NOT NULL,
          dims INTEGER,
          updated_at INTEGER NOT NULL,
          PRIMARY KEY (provider, model, provider_key, hash)
        );
        INSERT OR IGNORE INTO ${MEMORY_EMBEDDING_CACHE_TABLE} (
          provider, model, provider_key, hash, embedding, dims, updated_at
        )
        SELECT provider, model, provider_key, hash, embedding, dims, updated_at
        FROM embedding_cache;
      `);
			assertLegacyRowsCopied(db, `SELECT COUNT(*) AS missing
         FROM embedding_cache AS legacy
         WHERE NOT EXISTS (
           SELECT 1 FROM ${MEMORY_EMBEDDING_CACHE_TABLE} AS canonical
           WHERE canonical.provider = legacy.provider
             AND canonical.model = legacy.model
             AND canonical.provider_key = legacy.provider_key
             AND canonical.hash = legacy.hash
             AND canonical.embedding IS legacy.embedding
             AND canonical.dims IS legacy.dims
             AND canonical.updated_at IS legacy.updated_at
         )`, "embedding_cache");
			db.exec("DROP TABLE embedding_cache");
		}
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
	params.db.exec(`
    CREATE TABLE IF NOT EXISTS ${MEMORY_INDEX_META_TABLE} (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS ${MEMORY_INDEX_SOURCES_TABLE} (
      path TEXT NOT NULL,
      source TEXT NOT NULL DEFAULT 'memory',
      hash TEXT NOT NULL,
      mtime INTEGER NOT NULL,
      size INTEGER NOT NULL,
      PRIMARY KEY (path, source)
    );
    CREATE TABLE IF NOT EXISTS ${MEMORY_INDEX_CHUNKS_TABLE} (
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
    );
    CREATE TABLE IF NOT EXISTS ${MEMORY_INDEX_STATE_TABLE} (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      revision INTEGER NOT NULL
    );
    INSERT OR IGNORE INTO ${MEMORY_INDEX_STATE_TABLE} (id, revision) VALUES (1, 0);
  `);
	migrateCanonicalMemoryIndexSourcesPrimaryKey(params.db);
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
    AFTER INSERT ON ${MEMORY_INDEX_CHUNKS_TABLE}
    BEGIN
      UPDATE ${MEMORY_INDEX_STATE_TABLE} SET revision = revision + 1 WHERE id = 1;
    END;
    CREATE TRIGGER IF NOT EXISTS memory_index_chunks_revision_after_update
    AFTER UPDATE ON ${MEMORY_INDEX_CHUNKS_TABLE}
    BEGIN
      UPDATE ${MEMORY_INDEX_STATE_TABLE} SET revision = revision + 1 WHERE id = 1;
    END;
    CREATE TRIGGER IF NOT EXISTS memory_index_chunks_revision_after_delete
    AFTER DELETE ON ${MEMORY_INDEX_CHUNKS_TABLE}
    BEGIN
      UPDATE ${MEMORY_INDEX_STATE_TABLE} SET revision = revision + 1 WHERE id = 1;
    END;

    CREATE INDEX IF NOT EXISTS idx_memory_index_sources_source
      ON ${MEMORY_INDEX_SOURCES_TABLE}(source);
    CREATE INDEX IF NOT EXISTS idx_memory_index_chunks_path_source
      ON ${MEMORY_INDEX_CHUNKS_TABLE}(path, source);
    CREATE INDEX IF NOT EXISTS idx_memory_index_chunks_path
      ON ${MEMORY_INDEX_CHUNKS_TABLE}(path);
    CREATE INDEX IF NOT EXISTS idx_memory_index_chunks_source
      ON ${MEMORY_INDEX_CHUNKS_TABLE}(source);
  `);
	migrateLegacyMemoryIndexTables(params.db, params.embeddingCacheTable);
	if (params.cacheEnabled) {
		const updatedAtIndex = embeddingCacheTable === "memory_embedding_cache" ? "idx_memory_embedding_cache_updated_at" : "idx_embedding_cache_updated_at";
		params.db.exec(`
      CREATE TABLE IF NOT EXISTS ${embeddingCacheTable} (
        provider TEXT NOT NULL,
        model TEXT NOT NULL,
        provider_key TEXT NOT NULL,
        hash TEXT NOT NULL,
        embedding TEXT NOT NULL,
        dims INTEGER,
        updated_at INTEGER NOT NULL,
        PRIMARY KEY (provider, model, provider_key, hash)
      );
      CREATE INDEX IF NOT EXISTS ${updatedAtIndex}
        ON ${embeddingCacheTable}(updated_at);
    `);
	}
	let ftsAvailable = false;
	let ftsError;
	if (params.ftsEnabled) try {
		const tokenizeClause = (params.ftsTokenizer ?? "unicode61") === "trigram" ? `, tokenize='trigram case_sensitive 0'` : "";
		params.db.exec(`CREATE VIRTUAL TABLE IF NOT EXISTS ${ftsTable} USING fts5(\n  text,\n  id UNINDEXED,\n  path UNINDEXED,\n  source UNINDEXED,\n  model UNINDEXED,\n  start_line UNINDEXED,\n  end_line UNINDEXED\n${tokenizeClause});`);
		params.db.exec(`
        INSERT INTO ${ftsTable} (
          text, id, path, source, model, start_line, end_line
        )
        SELECT text, id, path, source, model, start_line, end_line
        FROM ${MEMORY_INDEX_CHUNKS_TABLE}
        WHERE NOT EXISTS (SELECT 1 FROM ${ftsTable} LIMIT 1);
      `);
		ftsAvailable = true;
	} catch (err) {
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
//#region packages/memory-host-sdk/src/host/sqlite-vec-platform-variant.ts
const PLATFORM_VARIANTS = {
	"linux-x64": {
		pkg: "sqlite-vec-linux-x64",
		file: "vec0.so"
	},
	"linux-arm64": {
		pkg: "sqlite-vec-linux-arm64",
		file: "vec0.so"
	},
	"darwin-x64": {
		pkg: "sqlite-vec-darwin-x64",
		file: "vec0.dylib"
	},
	"darwin-arm64": {
		pkg: "sqlite-vec-darwin-arm64",
		file: "vec0.dylib"
	},
	"win32-x64": {
		pkg: "sqlite-vec-windows-x64",
		file: "vec0.dll"
	}
};
/** Resolve the installed sqlite-vec native extension for the current platform if present. */
function resolveSqliteVecPlatformVariant() {
	const entry = PLATFORM_VARIANTS[`${process.platform}-${process.arch}`];
	if (!entry) return;
	try {
		const extensionPath = createRequire(import.meta.url).resolve(`${entry.pkg}/${entry.file}`);
		return {
			pkg: entry.pkg,
			extensionPath
		};
	} catch {
		return;
	}
}
//#endregion
//#region packages/memory-host-sdk/src/host/sqlite-vec.ts
const SQLITE_VEC_MODULE_ID = "sqlite-vec";
const SQLITE_VEC_CONFIG_HINT = "Set agents.defaults.memorySearch.store.vector.extensionPath, or an agent-specific memorySearch.store.vector.extensionPath, to a sqlite-vec loadable extension path.";
async function loadSqliteVecModule() {
	return import(SQLITE_VEC_MODULE_ID);
}
function isMissingSqliteVecPackageError(err) {
	const message = formatErrorMessage(err);
	const code = err && typeof err === "object" && "code" in err ? err.code : void 0;
	return /Cannot find (?:package|module) ['"]sqlite-vec['"]/u.test(message) && (code === void 0 || code === "ERR_MODULE_NOT_FOUND" || code === "MODULE_NOT_FOUND");
}
function assertSqliteVecAvailable(db, source) {
	try {
		const row = db.prepare("SELECT vec_version() AS version").get();
		if (typeof row?.version !== "string" || row.version.trim().length === 0) throw new Error("vec_version() did not return a version");
	} catch (err) {
		throw new Error(`sqlite-vec health check failed after loading ${source}`, { cause: err });
	}
}
function loadExtensionAndVerify(db, extensionPath) {
	db.loadExtension(extensionPath);
	assertSqliteVecAvailable(db, extensionPath);
}
async function loadSqliteVecExtension(params) {
	try {
		const resolvedPath = normalizeOptionalString(params.extensionPath);
		params.db.enableLoadExtension(true);
		if (resolvedPath) {
			loadExtensionAndVerify(params.db, resolvedPath);
			return {
				ok: true,
				extensionPath: resolvedPath
			};
		}
		try {
			const sqliteVec = await loadSqliteVecModule();
			const extensionPath = sqliteVec.getLoadablePath();
			sqliteVec.load(params.db);
			assertSqliteVecAvailable(params.db, extensionPath);
			return {
				ok: true,
				extensionPath
			};
		} catch (err) {
			const variant = resolveSqliteVecPlatformVariant();
			if (!variant) {
				if (!isMissingSqliteVecPackageError(err)) throw err;
				return {
					ok: false,
					error: `sqlite-vec package is not installed. ${SQLITE_VEC_CONFIG_HINT} Original error: ${formatErrorMessage(err)}`
				};
			}
			try {
				loadExtensionAndVerify(params.db, variant.extensionPath);
				return {
					ok: true,
					extensionPath: variant.extensionPath
				};
			} catch (variantErr) {
				const message = formatErrorMessage(variantErr);
				if (!isMissingSqliteVecPackageError(err)) {
					const packageMessage = formatErrorMessage(err);
					return {
						ok: false,
						error: `sqlite-vec package failed to load, and platform variant ${variant.pkg} failed to load from ${variant.extensionPath}. ${SQLITE_VEC_CONFIG_HINT} Package error: ${packageMessage}. Variant error: ${message}`
					};
				}
				return {
					ok: false,
					error: `sqlite-vec platform variant ${variant.pkg} failed to load from ${variant.extensionPath}. ${SQLITE_VEC_CONFIG_HINT} Original error: ${message}`
				};
			}
		}
	} catch (err) {
		return {
			ok: false,
			error: formatErrorMessage(err)
		};
	}
}
//#endregion
//#region packages/memory-host-sdk/src/host/sqlite.ts
const require = createRequire(import.meta.url);
const sqliteWalMaintenanceByDb = /* @__PURE__ */ new WeakMap();
function requireNodeSqlite() {
	installProcessWarningFilter();
	try {
		return require("node:sqlite");
	} catch (err) {
		const message = formatErrorMessage(err);
		throw new Error(`SQLite support is unavailable in this Node runtime (missing node:sqlite). ${message}`, { cause: err });
	}
}
function configureMemorySqliteWalMaintenance(db, options) {
	const existing = sqliteWalMaintenanceByDb.get(db);
	if (existing) return existing;
	const maintenance = options?.busyTimeoutMs === void 0 ? configureSqliteWalMaintenance(db, options) : configureSqliteConnectionPragmas(db, options);
	sqliteWalMaintenanceByDb.set(db, maintenance);
	return maintenance;
}
function closeMemorySqliteWalMaintenance(db) {
	const maintenance = sqliteWalMaintenanceByDb.get(db);
	if (!maintenance) return true;
	sqliteWalMaintenanceByDb.delete(db);
	return maintenance.close();
}
//#endregion
export { MEMORY_EMBEDDING_CACHE_TABLE as a, MEMORY_INDEX_META_TABLE as c, MEMORY_INDEX_VECTOR_TABLE as d, ensureMemoryIndexSchema as f, loadSqliteVecExtension as i, MEMORY_INDEX_SOURCES_TABLE as l, configureMemorySqliteWalMaintenance as n, MEMORY_INDEX_CHUNKS_TABLE as o, requireNodeSqlite as r, MEMORY_INDEX_FTS_TABLE as s, closeMemorySqliteWalMaintenance as t, MEMORY_INDEX_STATE_TABLE as u };
