import { _ as getNodeSqliteKysely, d as resolveSqliteDatabaseFilePaths, h as executeSqliteQuerySync, l as readSqliteUserVersion, m as clearNodeSqliteKyselyCacheForDatabase, o as runOpenClawStateWriteTransaction, p as requireNodeSqlite, t as OPENCLAW_SQLITE_BUSY_TIMEOUT_MS, u as runSqliteImmediateTransactionSync } from "./openclaw-state-db-gblCDNfo.js";
import { t as configureSqliteConnectionPragmas } from "./sqlite-wal-BoUtAnjK.js";
import { u as normalizeAgentId } from "./session-key-pTKRJb0m.js";
import { t as resolveOpenClawAgentSqlitePath } from "./openclaw-agent-db.paths-UljqGEbn.js";
import { chmodSync, existsSync, mkdirSync, statSync } from "node:fs";
import path from "node:path";
//#region src/state/openclaw-agent-schema.generated.ts
/**
* This file was generated from the SQLite schema source.
* Please do not edit it manually.
*/
const OPENCLAW_AGENT_SCHEMA_SQL = `CREATE TABLE IF NOT EXISTS schema_meta (
  meta_key TEXT NOT NULL PRIMARY KEY,
  role TEXT NOT NULL,
  schema_version INTEGER NOT NULL,
  agent_id TEXT,
  app_version TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS cache_entries (
  scope TEXT NOT NULL,
  key TEXT NOT NULL,
  value_json TEXT,
  blob BLOB,
  expires_at INTEGER,
  updated_at INTEGER NOT NULL,
  PRIMARY KEY (scope, key)
);

CREATE INDEX IF NOT EXISTS idx_agent_cache_expiry
  ON cache_entries(scope, expires_at, key)
  WHERE expires_at IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_agent_cache_updated
  ON cache_entries(scope, updated_at DESC, key);

CREATE TABLE IF NOT EXISTS auth_profile_store (
  store_key TEXT NOT NULL PRIMARY KEY,
  store_json TEXT NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS auth_profile_state (
  state_key TEXT NOT NULL PRIMARY KEY,
  state_json TEXT NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS memory_index_meta (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS memory_index_sources (
  path TEXT NOT NULL,
  source TEXT NOT NULL DEFAULT 'memory',
  hash TEXT NOT NULL,
  mtime INTEGER NOT NULL,
  size INTEGER NOT NULL,
  PRIMARY KEY (path, source)
);

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
);

CREATE TABLE IF NOT EXISTS memory_embedding_cache (
  provider TEXT NOT NULL,
  model TEXT NOT NULL,
  provider_key TEXT NOT NULL,
  hash TEXT NOT NULL,
  embedding TEXT NOT NULL,
  dims INTEGER,
  updated_at INTEGER NOT NULL,
  PRIMARY KEY (provider, model, provider_key, hash)
);

CREATE TABLE IF NOT EXISTS memory_index_state (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  revision INTEGER NOT NULL
);

INSERT OR IGNORE INTO memory_index_state (id, revision) VALUES (1, 0);

CREATE TRIGGER IF NOT EXISTS memory_index_sources_revision_after_insert
AFTER INSERT ON memory_index_sources
BEGIN
  UPDATE memory_index_state SET revision = revision + 1 WHERE id = 1;
END;

CREATE TRIGGER IF NOT EXISTS memory_index_sources_revision_after_update
AFTER UPDATE ON memory_index_sources
BEGIN
  UPDATE memory_index_state SET revision = revision + 1 WHERE id = 1;
END;

CREATE TRIGGER IF NOT EXISTS memory_index_sources_revision_after_delete
AFTER DELETE ON memory_index_sources
BEGIN
  UPDATE memory_index_state SET revision = revision + 1 WHERE id = 1;
END;

CREATE TRIGGER IF NOT EXISTS memory_index_chunks_revision_after_insert
AFTER INSERT ON memory_index_chunks
BEGIN
  UPDATE memory_index_state SET revision = revision + 1 WHERE id = 1;
END;

CREATE TRIGGER IF NOT EXISTS memory_index_chunks_revision_after_update
AFTER UPDATE ON memory_index_chunks
BEGIN
  UPDATE memory_index_state SET revision = revision + 1 WHERE id = 1;
END;

CREATE TRIGGER IF NOT EXISTS memory_index_chunks_revision_after_delete
AFTER DELETE ON memory_index_chunks
BEGIN
  UPDATE memory_index_state SET revision = revision + 1 WHERE id = 1;
END;

CREATE INDEX IF NOT EXISTS idx_memory_embedding_cache_updated_at
  ON memory_embedding_cache(updated_at);

CREATE INDEX IF NOT EXISTS idx_memory_index_sources_source
  ON memory_index_sources(source);

CREATE INDEX IF NOT EXISTS idx_memory_index_chunks_path_source
  ON memory_index_chunks(path, source);

CREATE INDEX IF NOT EXISTS idx_memory_index_chunks_path
  ON memory_index_chunks(path);

CREATE INDEX IF NOT EXISTS idx_memory_index_chunks_source
  ON memory_index_chunks(source);\n`;
//#endregion
//#region src/state/openclaw-agent-db.ts
/**
* Per-agent SQLite database lifecycle and shared-state registration.
*
* Each opened agent database is schema-owned by one normalized agent id, cached
* per pathname, protected with private file modes, and registered in the shared
* OpenClaw state database for discovery and maintenance.
*/
const OPENCLAW_AGENT_SCHEMA_VERSION = 1;
const OPENCLAW_AGENT_DB_DIR_MODE = 448;
const OPENCLAW_AGENT_DB_FILE_MODE = 384;
const cachedDatabases = /* @__PURE__ */ new Map();
function assertSupportedAgentSchemaVersion(db, pathname) {
	const userVersion = readSqliteUserVersion(db);
	if (userVersion > OPENCLAW_AGENT_SCHEMA_VERSION) throw new Error(`OpenClaw agent database ${pathname} uses newer schema version ${userVersion}; this OpenClaw build supports ${OPENCLAW_AGENT_SCHEMA_VERSION}.`);
}
function ensureOpenClawAgentDatabasePermissions(pathname, options) {
	const dir = path.dirname(pathname);
	const defaultPath = resolveOpenClawAgentSqlitePath({
		agentId: options.agentId,
		env: options.env
	});
	const isDefaultAgentDatabase = path.resolve(pathname) === path.resolve(defaultPath);
	const dirExisted = existsSync(dir);
	mkdirSync(dir, {
		recursive: true,
		mode: OPENCLAW_AGENT_DB_DIR_MODE
	});
	if (isDefaultAgentDatabase || !dirExisted) chmodSync(dir, OPENCLAW_AGENT_DB_DIR_MODE);
	for (const candidate of resolveSqliteDatabaseFilePaths(pathname)) if (existsSync(candidate)) chmodSync(candidate, OPENCLAW_AGENT_DB_FILE_MODE);
}
function readExistingSchemaMeta(db) {
	if (!db.prepare("SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'schema_meta'").get()) return null;
	const row = db.prepare("SELECT role, agent_id FROM schema_meta WHERE meta_key = 'primary'").get();
	if (!row) return null;
	return {
		agentId: typeof row.agent_id === "string" ? row.agent_id : null,
		role: typeof row.role === "string" ? row.role : null
	};
}
function assertExistingSchemaOwner(existing, agentId, pathname) {
	if (!existing) return;
	if (existing.role !== "agent") throw new Error(`OpenClaw agent database ${pathname} has schema role ${existing.role ?? "unknown"}; expected agent.`);
	if (!existing.agentId) throw new Error(`OpenClaw agent database ${pathname} has no agent owner.`);
	if (normalizeAgentId(existing.agentId) !== agentId) throw new Error(`OpenClaw agent database ${pathname} belongs to agent ${existing.agentId}; requested agent ${agentId}.`);
}
function ensureAgentSchema(db, agentId, pathname) {
	assertSupportedAgentSchemaVersion(db, pathname);
	assertExistingSchemaOwner(readExistingSchemaMeta(db), agentId, pathname);
	db.exec(OPENCLAW_AGENT_SCHEMA_SQL);
	const kysely = getNodeSqliteKysely(db);
	db.exec(`PRAGMA user_version = ${OPENCLAW_AGENT_SCHEMA_VERSION};`);
	const now = Date.now();
	executeSqliteQuerySync(db, kysely.insertInto("schema_meta").values({
		meta_key: "primary",
		role: "agent",
		schema_version: OPENCLAW_AGENT_SCHEMA_VERSION,
		agent_id: agentId,
		app_version: null,
		created_at: now,
		updated_at: now
	}).onConflict((conflict) => conflict.column("meta_key").doUpdateSet({
		role: "agent",
		schema_version: OPENCLAW_AGENT_SCHEMA_VERSION,
		agent_id: agentId,
		app_version: null,
		updated_at: now
	})));
}
/** Initialize agent schema/ownership metadata on an independently managed connection. */
function ensureOpenClawAgentDatabaseSchema(db, options) {
	const agentId = normalizeAgentId(options.agentId);
	const databaseOptions = {
		...options,
		agentId
	};
	const pathname = resolveOpenClawAgentSqlitePath(databaseOptions);
	ensureOpenClawAgentDatabasePermissions(pathname, databaseOptions);
	ensureAgentSchema(db, agentId, pathname);
	ensureOpenClawAgentDatabasePermissions(pathname, databaseOptions);
	if (options.register === true) registerAgentDatabase({
		agentId,
		path: pathname,
		env: options.env
	});
}
function registerAgentDatabase(params) {
	let sizeBytes = null;
	try {
		sizeBytes = statSync(params.path).size;
	} catch {
		sizeBytes = null;
	}
	const lastSeenAt = Date.now();
	runOpenClawStateWriteTransaction((database) => {
		const db = getNodeSqliteKysely(database.db);
		executeSqliteQuerySync(database.db, db.insertInto("agent_databases").values({
			agent_id: params.agentId,
			path: params.path,
			schema_version: OPENCLAW_AGENT_SCHEMA_VERSION,
			last_seen_at: lastSeenAt,
			size_bytes: sizeBytes
		}).onConflict((conflict) => conflict.columns(["agent_id", "path"]).doUpdateSet({
			schema_version: OPENCLAW_AGENT_SCHEMA_VERSION,
			last_seen_at: lastSeenAt,
			size_bytes: sizeBytes
		})));
	}, { env: params.env });
}
/** Open or return a cached per-agent database after schema and owner validation. */
function openOpenClawAgentDatabase(options) {
	const agentId = normalizeAgentId(options.agentId);
	const databaseOptions = {
		...options,
		agentId
	};
	const pathname = resolveOpenClawAgentSqlitePath(databaseOptions);
	const cached = cachedDatabases.get(pathname);
	if (cached?.db.isOpen) {
		if (cached.agentId !== agentId) throw new Error(`OpenClaw agent database ${pathname} is already open for agent ${cached.agentId}; requested agent ${agentId}.`);
		registerAgentDatabase({
			agentId,
			path: pathname,
			env: options.env
		});
		return cached;
	}
	if (cached) {
		cached.walMaintenance.close();
		clearNodeSqliteKyselyCacheForDatabase(cached.db);
		cachedDatabases.delete(pathname);
	}
	ensureOpenClawAgentDatabasePermissions(pathname, databaseOptions);
	const db = new (requireNodeSqlite()).DatabaseSync(pathname);
	const walMaintenance = (() => {
		let maintenance;
		try {
			maintenance = configureSqliteConnectionPragmas(db, {
				busyTimeoutMs: OPENCLAW_SQLITE_BUSY_TIMEOUT_MS,
				databaseLabel: `openclaw-agent:${agentId}`,
				databasePath: pathname,
				foreignKeys: true,
				synchronous: "NORMAL"
			});
			ensureAgentSchema(db, agentId, pathname);
			return maintenance;
		} catch (err) {
			maintenance?.close();
			db.close();
			throw err;
		}
	})();
	ensureOpenClawAgentDatabasePermissions(pathname, databaseOptions);
	const database = {
		agentId,
		db,
		path: pathname,
		walMaintenance
	};
	cachedDatabases.set(pathname, database);
	registerAgentDatabase({
		agentId,
		path: pathname,
		env: options.env
	});
	return database;
}
/** Run a synchronous immediate transaction against an agent database. */
function runOpenClawAgentWriteTransaction(operation, options) {
	const database = openOpenClawAgentDatabase(options);
	const result = runSqliteImmediateTransactionSync(database.db, () => operation(database));
	ensureOpenClawAgentDatabasePermissions(database.path, options);
	return result;
}
//#endregion
export { runOpenClawAgentWriteTransaction as n, ensureOpenClawAgentDatabaseSchema as t };
