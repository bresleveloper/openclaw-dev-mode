import { y as parseStrictNonNegativeInteger } from "./number-coercion-CJQ8TR--.js";
import "./parse-finite-number-Z7n6tXLk.js";
import { y as resolveStateDir } from "./paths-DyelItkH.js";
import { i as formatErrorMessage } from "./errors-DCRXIYSQ.js";
import { t as installProcessWarningFilter } from "./warning-filter-p3Ue6g9S.js";
import { t as createSubsystemLogger } from "./subsystem-yNfG7O3v.js";
import { t as configureSqliteConnectionPragmas } from "./sqlite-wal-BoUtAnjK.js";
import { createRequire } from "node:module";
import { chmodSync, existsSync, mkdirSync, statSync, unlinkSync, writeFileSync } from "node:fs";
import path from "node:path";
import os from "node:os";
import { randomUUID } from "node:crypto";
import { CompiledQuery, IdentifierNode, InsertQueryNode, Kysely, RawNode, SqliteAdapter, SqliteIntrospector, SqliteQueryCompiler, createQueryId } from "kysely";
import { isMainThread, threadId } from "node:worker_threads";
//#region src/infra/kysely-node-sqlite.ts
/** Kysely dialect backed by a node:sqlite DatabaseSync instance. */
var NodeSqliteKyselyDialect = class {
	#config;
	constructor(config) {
		this.#config = Object.freeze({ ...config });
	}
	createDriver() {
		return new NodeSqliteKyselyDriver(this.#config);
	}
	createQueryCompiler() {
		return new SqliteQueryCompiler();
	}
	createAdapter() {
		return new SqliteAdapter();
	}
	createIntrospector(db) {
		return new SqliteIntrospector(db);
	}
};
var NodeSqliteKyselyDriver = class {
	#config;
	#mutex = new ConnectionMutex();
	#db;
	#connection;
	constructor(config) {
		this.#config = Object.freeze({ ...config });
	}
	async init() {
		this.#db = typeof this.#config.database === "function" ? await this.#config.database() : this.#config.database;
		this.#connection = new NodeSqliteKyselyConnection(this.#db);
		await this.#config.onCreateConnection?.(this.#connection);
	}
	async acquireConnection() {
		await this.#mutex.lock();
		return this.#connection;
	}
	async beginTransaction(connection, _settings) {
		const mode = this.#config.transactionMode ?? "deferred";
		await connection.executeQuery(CompiledQuery.raw(`begin ${mode}`));
	}
	async commitTransaction(connection) {
		await connection.executeQuery(CompiledQuery.raw("commit"));
	}
	async rollbackTransaction(connection) {
		await connection.executeQuery(CompiledQuery.raw("rollback"));
	}
	async savepoint(connection, savepointName, compileQuery) {
		await connection.executeQuery(compileQuery(createSavepointCommand("savepoint", savepointName), createQueryId()));
	}
	async rollbackToSavepoint(connection, savepointName, compileQuery) {
		await connection.executeQuery(compileQuery(createSavepointCommand("rollback to", savepointName), createQueryId()));
	}
	async releaseSavepoint(connection, savepointName, compileQuery) {
		await connection.executeQuery(compileQuery(createSavepointCommand("release", savepointName), createQueryId()));
	}
	async releaseConnection() {
		this.#mutex.unlock();
	}
	async destroy() {
		this.#db?.close();
		this.#db = void 0;
		this.#connection = void 0;
	}
};
var NodeSqliteKyselyConnection = class {
	#db;
	constructor(db) {
		this.#db = db;
	}
	executeQuery(compiledQuery) {
		const { sql, parameters } = compiledQuery;
		const stmt = this.#db.prepare(sql);
		const sqliteParameters = parameters;
		if (stmt.columns().length > 0) return Promise.resolve({ rows: stmt.all(...sqliteParameters) });
		const { changes, lastInsertRowid } = stmt.run(...sqliteParameters);
		const baseResult = {
			numAffectedRows: BigInt(changes),
			rows: []
		};
		if (isInsertStatement(sql) && changes > 0) return Promise.resolve({
			...baseResult,
			insertId: BigInt(lastInsertRowid)
		});
		return Promise.resolve(baseResult);
	}
	async *streamQuery(compiledQuery, _chunkSize) {
		const { sql, parameters } = compiledQuery;
		const stmt = this.#db.prepare(sql);
		for (const row of stmt.iterate(...parameters)) yield { rows: [row] };
	}
};
function isInsertStatement(sql) {
	return sql.trimStart().toLowerCase().startsWith("insert");
}
function createSavepointCommand(command, savepointName) {
	return RawNode.createWithChildren([RawNode.createWithSql(`${command} `), IdentifierNode.create(savepointName)]);
}
var ConnectionMutex = class {
	#promise;
	#resolve;
	async lock() {
		while (this.#promise) await this.#promise;
		this.#promise = new Promise((resolve) => {
			this.#resolve = resolve;
		});
	}
	unlock() {
		const resolve = this.#resolve;
		this.#promise = void 0;
		this.#resolve = void 0;
		resolve?.();
	}
};
//#endregion
//#region src/infra/kysely-sync.ts
const kyselyByDatabase = /* @__PURE__ */ new WeakMap();
function getNodeSqliteKysely(db) {
	const existing = kyselyByDatabase.get(db);
	if (existing) return existing;
	const kysely = new Kysely({ dialect: new CompileOnlyNodeSqliteKyselyDialect() });
	kyselyByDatabase.set(db, kysely);
	return kysely;
}
/** Execute a compiled Kysely query synchronously against node:sqlite. */
function executeCompiledSqliteQuerySync(db, compiledQuery) {
	const statement = db.prepare(compiledQuery.sql);
	const parameters = compiledQuery.parameters;
	if (statement.columns().length > 0) return { rows: statement.all(...parameters) };
	const { changes, lastInsertRowid } = statement.run(...parameters);
	const result = {
		numAffectedRows: BigInt(changes),
		rows: []
	};
	if (InsertQueryNode.is(compiledQuery.query) && changes > 0) return {
		...result,
		insertId: BigInt(lastInsertRowid)
	};
	return result;
}
/** Compile and execute a Kysely query synchronously. */
function executeSqliteQuerySync(db, query) {
	return executeCompiledSqliteQuerySync(db, query.compile());
}
/** Execute a Kysely query synchronously and return its first row. */
function executeSqliteQueryTakeFirstSync(db, query) {
	return executeSqliteQuerySync(db, query).rows[0];
}
/** Drop the cached Kysely facade for a DatabaseSync after close/test reset. */
function clearNodeSqliteKyselyCacheForDatabase(db) {
	kyselyByDatabase.delete(db);
}
var CompileOnlyNodeSqliteKyselyDialect = class extends NodeSqliteKyselyDialect {
	constructor() {
		super({ database: createUnavailableDatabase });
	}
	createDriver() {
		return new CompileOnlySqliteDriver();
	}
	createAdapter() {
		return new CompileOnlySqliteAdapter();
	}
};
var CompileOnlySqliteDriver = class {
	async init() {}
	async acquireConnection() {
		throw createCompileOnlyExecutionError();
	}
	async beginTransaction(_connection, _settings) {
		throw createCompileOnlyExecutionError();
	}
	async commitTransaction(_connection) {
		throw createCompileOnlyExecutionError();
	}
	async rollbackTransaction(_connection) {
		throw createCompileOnlyExecutionError();
	}
	async releaseConnection(_connection) {}
	async destroy() {}
};
function createCompileOnlyExecutionError() {
	return /* @__PURE__ */ new Error("getNodeSqliteKysely() returns a compile-only Kysely facade; use executeSqliteQuerySync() to execute node:sqlite queries.");
}
function createUnavailableDatabase() {
	throw createCompileOnlyExecutionError();
}
var CompileOnlySqliteAdapter = class extends SqliteAdapter {
	get supportsMultipleConnections() {
		return true;
	}
};
//#endregion
//#region src/infra/node-sqlite.ts
const require = createRequire(import.meta.url);
/** Load node:sqlite after installing the process warning filter. */
function requireNodeSqlite() {
	installProcessWarningFilter();
	try {
		return require("node:sqlite");
	} catch (err) {
		const message = formatErrorMessage(err);
		throw new Error(`SQLite support is unavailable in this Node runtime (missing node:sqlite). ${message}`, { cause: err });
	}
}
//#endregion
//#region src/infra/private-mode.ts
const CHMOD_UNSUPPORTED_CODES = new Set([
	"ENOTSUP",
	"EOPNOTSUPP",
	"EINVAL"
]);
const PRIVATE_PROBE_FILE_MODE = 384;
function hasRestrictivePermissions(target) {
	try {
		return (statSync(target).mode & 63) === 0;
	} catch {
		return false;
	}
}
function filesystemRejectsChmod(target) {
	let probePath;
	try {
		const probeDir = statSync(target).isDirectory() ? target : path.dirname(target);
		probePath = path.join(probeDir, `.openclaw-chmod-probe-${randomUUID()}`);
		writeFileSync(probePath, "", {
			flag: "wx",
			mode: PRIVATE_PROBE_FILE_MODE
		});
	} catch {
		return false;
	}
	try {
		chmodSync(probePath, PRIVATE_PROBE_FILE_MODE);
		return false;
	} catch (err) {
		return err.code === "EPERM";
	} finally {
		try {
			unlinkSync(probePath);
		} catch {}
	}
}
function canIgnorePrivateChmodError(target, code) {
	if (code && CHMOD_UNSUPPORTED_CODES.has(code)) return true;
	if (code !== "EPERM") return false;
	return hasRestrictivePermissions(target) || filesystemRejectsChmod(target);
}
/**
* Applies a private POSIX mode, reporting unsupported filesystems without
* weakening real permission failures.
*/
function applyPrivateModeSync(target, mode) {
	try {
		chmodSync(target, mode);
		return { applied: true };
	} catch (err) {
		if (!canIgnorePrivateChmodError(target, err.code)) throw err;
		return {
			applied: false,
			error: err
		};
	}
}
//#endregion
//#region src/infra/sqlite-files.ts
/** SQLite main database plus every journal-mode sidecar that can contain database pages. */
const SQLITE_DATABASE_FILE_SUFFIXES = [
	"",
	"-wal",
	"-shm",
	"-journal"
];
/** Resolves the main database and all possible journal-mode sidecar paths. */
function resolveSqliteDatabaseFilePaths(pathname) {
	return SQLITE_DATABASE_FILE_SUFFIXES.map((suffix) => `${pathname}${suffix}`);
}
//#endregion
//#region src/infra/sqlite-transaction.ts
const transactionDepthByDatabase = /* @__PURE__ */ new WeakMap();
const RETRYABLE_COMMIT_ERROR_CODES = new Set(["SQLITE_BUSY", "SQLITE_LOCKED"]);
const MAX_COMMIT_ATTEMPTS = 8;
let nextSavepointId = 0;
function nextSavepointName() {
	nextSavepointId += 1;
	return `openclaw_tx_${nextSavepointId}`;
}
function isPromiseLike(value) {
	return Boolean(value && typeof value.then === "function");
}
function assertSyncTransactionResult(value) {
	if (isPromiseLike(value)) throw new Error("SQLite write transactions must be synchronous; Promise returns are not supported.");
}
function isRetryableCommitError(error) {
	const code = error && typeof error === "object" ? error.code : void 0;
	return typeof code === "string" && RETRYABLE_COMMIT_ERROR_CODES.has(code);
}
function commitImmediateTransaction(db) {
	for (const attempt of Array.from({ length: MAX_COMMIT_ATTEMPTS }, (_, index) => index + 1)) try {
		db.exec("COMMIT");
		return;
	} catch (error) {
		if (!isRetryableCommitError(error) || attempt >= MAX_COMMIT_ATTEMPTS) throw error;
	}
}
function abortImmediateTransaction(db) {
	try {
		db.exec("ROLLBACK");
	} catch {
		try {
			db.close();
		} catch {}
	}
}
function getTransactionDepth(db) {
	return transactionDepthByDatabase.get(db) ?? 0;
}
function setTransactionDepth(db, depth) {
	if (depth <= 0) {
		transactionDepthByDatabase.delete(db);
		return;
	}
	transactionDepthByDatabase.set(db, depth);
}
function runSqliteImmediateTransactionSync(db, operation) {
	const depth = getTransactionDepth(db);
	if (depth > 0) {
		const savepointName = nextSavepointName();
		db.exec(`SAVEPOINT ${savepointName}`);
		setTransactionDepth(db, depth + 1);
		try {
			const result = operation();
			assertSyncTransactionResult(result);
			db.exec(`RELEASE SAVEPOINT ${savepointName}`);
			return result;
		} catch (error) {
			try {
				db.exec(`ROLLBACK TO SAVEPOINT ${savepointName}`);
			} finally {
				db.exec(`RELEASE SAVEPOINT ${savepointName}`);
			}
			throw error;
		} finally {
			setTransactionDepth(db, depth);
		}
	}
	db.exec("BEGIN IMMEDIATE");
	setTransactionDepth(db, 1);
	let transactionStillActive = true;
	let result;
	try {
		result = operation();
		assertSyncTransactionResult(result);
	} catch (error) {
		try {
			abortImmediateTransaction(db);
			transactionStillActive = false;
		} catch {}
		throw error;
	} finally {
		if (!transactionStillActive) setTransactionDepth(db, 0);
	}
	try {
		commitImmediateTransaction(db);
		transactionStillActive = false;
		return result;
	} catch (error) {
		try {
			abortImmediateTransaction(db);
			transactionStillActive = false;
		} catch {}
		throw error;
	} finally {
		if (!transactionStillActive) setTransactionDepth(db, 0);
	}
}
//#endregion
//#region src/infra/sqlite-user-version.ts
function readSqliteUserVersion(db) {
	const row = db.prepare("PRAGMA user_version").get();
	return Number(row?.user_version ?? 0);
}
//#endregion
//#region src/state/openclaw-state-db.paths.ts
/**
* Path helpers for the shared OpenClaw SQLite state database.
*
* Tests get worker-scoped temp state roots unless they explicitly provide
* `OPENCLAW_STATE_DIR`, which prevents parallel Vitest workers from sharing WAL files.
*/
function resolveOpenClawStateRootDir(env) {
	if (env.OPENCLAW_STATE_DIR?.trim()) return resolveStateDir(env);
	if (env.VITEST || env.NODE_ENV === "test") {
		const workerId = parseStrictNonNegativeInteger(env.VITEST_WORKER_ID ?? env.VITEST_POOL_ID ?? "");
		const shardSuffix = workerId !== void 0 ? `${process.pid}-${workerId}` : isMainThread ? String(process.pid) : `${process.pid}-${threadId}`;
		return path.join(os.tmpdir(), "openclaw-test-state", shardSuffix);
	}
	return resolveStateDir(env);
}
/** Resolve the directory that contains the shared state SQLite file. */
function resolveOpenClawStateSqliteDir(env = process.env) {
	return path.join(resolveOpenClawStateRootDir(env), "state");
}
/** Resolve the shared state SQLite file path. */
function resolveOpenClawStateSqlitePath(env = process.env) {
	return path.join(resolveOpenClawStateSqliteDir(env), "openclaw.sqlite");
}
//#endregion
//#region src/state/openclaw-state-schema.generated.ts
/**
* This file was generated from the SQLite schema source.
* Please do not edit it manually.
*/
const OPENCLAW_STATE_SCHEMA_SQL = `CREATE TABLE IF NOT EXISTS auth_profile_stores (
  store_key TEXT NOT NULL PRIMARY KEY,
  store_json TEXT NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS auth_profile_state (
  store_key TEXT NOT NULL PRIMARY KEY,
  state_json TEXT NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS diagnostic_events (
  scope TEXT NOT NULL,
  event_key TEXT NOT NULL,
  payload_json TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  PRIMARY KEY (scope, event_key)
);

CREATE INDEX IF NOT EXISTS idx_diagnostic_events_scope_created
  ON diagnostic_events(scope, created_at, event_key);

CREATE TABLE IF NOT EXISTS diagnostic_stability_bundles (
  bundle_key TEXT NOT NULL PRIMARY KEY,
  reason TEXT NOT NULL,
  generated_at TEXT NOT NULL,
  bundle_json TEXT NOT NULL,
  created_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_diagnostic_stability_bundles_created
  ON diagnostic_stability_bundles(created_at DESC, bundle_key);

CREATE TABLE IF NOT EXISTS state_leases (
  scope TEXT NOT NULL,
  lease_key TEXT NOT NULL,
  owner TEXT NOT NULL,
  expires_at INTEGER,
  heartbeat_at INTEGER,
  payload_json TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  PRIMARY KEY (scope, lease_key)
);

CREATE INDEX IF NOT EXISTS idx_state_leases_expiry
  ON state_leases(expires_at, scope, lease_key)
  WHERE expires_at IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_state_leases_owner
  ON state_leases(owner, updated_at DESC);

CREATE TABLE IF NOT EXISTS exec_approvals_config (
  config_key TEXT NOT NULL PRIMARY KEY,
  raw_json TEXT NOT NULL,
  socket_path TEXT,
  has_socket_token INTEGER NOT NULL,
  default_security TEXT,
  default_ask TEXT,
  default_ask_fallback TEXT,
  auto_allow_skills INTEGER,
  agent_count INTEGER NOT NULL,
  allowlist_count INTEGER NOT NULL,
  updated_at_ms INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS schema_meta (
  meta_key TEXT NOT NULL PRIMARY KEY,
  role TEXT NOT NULL,
  schema_version INTEGER NOT NULL,
  agent_id TEXT,
  app_version TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS device_pairing_pending (
  request_id TEXT NOT NULL PRIMARY KEY,
  device_id TEXT NOT NULL,
  public_key TEXT NOT NULL,
  display_name TEXT,
  platform TEXT,
  device_family TEXT,
  client_id TEXT,
  client_mode TEXT,
  role TEXT,
  roles_json TEXT,
  scopes_json TEXT,
  remote_ip TEXT,
  silent INTEGER,
  is_repair INTEGER,
  ts INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_device_pairing_pending_device
  ON device_pairing_pending(device_id, ts DESC);

CREATE TABLE IF NOT EXISTS device_pairing_paired (
  device_id TEXT NOT NULL PRIMARY KEY,
  public_key TEXT NOT NULL,
  display_name TEXT,
  platform TEXT,
  device_family TEXT,
  client_id TEXT,
  client_mode TEXT,
  role TEXT,
  roles_json TEXT,
  scopes_json TEXT,
  approved_scopes_json TEXT,
  remote_ip TEXT,
  tokens_json TEXT,
  created_at_ms INTEGER NOT NULL,
  approved_at_ms INTEGER NOT NULL,
  last_seen_at_ms INTEGER,
  last_seen_reason TEXT
);

CREATE INDEX IF NOT EXISTS idx_device_pairing_paired_approved
  ON device_pairing_paired(approved_at_ms DESC, device_id);

CREATE TABLE IF NOT EXISTS device_bootstrap_tokens (
  token_key TEXT NOT NULL PRIMARY KEY,
  token TEXT NOT NULL,
  ts INTEGER NOT NULL,
  device_id TEXT,
  public_key TEXT,
  profile_json TEXT,
  redeemed_profile_json TEXT,
  pending_profile_json TEXT,
  issued_at_ms INTEGER NOT NULL,
  last_used_at_ms INTEGER
);

CREATE INDEX IF NOT EXISTS idx_device_bootstrap_tokens_ts
  ON device_bootstrap_tokens(ts);

CREATE TABLE IF NOT EXISTS node_pairing_pending (
  request_id TEXT NOT NULL PRIMARY KEY,
  node_id TEXT NOT NULL,
  display_name TEXT,
  platform TEXT,
  version TEXT,
  core_version TEXT,
  ui_version TEXT,
  device_family TEXT,
  model_identifier TEXT,
  client_id TEXT,
  client_mode TEXT,
  caps_json TEXT,
  commands_json TEXT,
  permissions_json TEXT,
  remote_ip TEXT,
  silent INTEGER,
  ts INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_node_pairing_pending_node
  ON node_pairing_pending(node_id, ts DESC);

CREATE TABLE IF NOT EXISTS node_pairing_paired (
  node_id TEXT NOT NULL PRIMARY KEY,
  token TEXT NOT NULL,
  display_name TEXT,
  platform TEXT,
  version TEXT,
  core_version TEXT,
  ui_version TEXT,
  device_family TEXT,
  model_identifier TEXT,
  client_id TEXT,
  client_mode TEXT,
  caps_json TEXT,
  commands_json TEXT,
  permissions_json TEXT,
  remote_ip TEXT,
  bins_json TEXT,
  created_at_ms INTEGER NOT NULL,
  approved_at_ms INTEGER NOT NULL,
  last_connected_at_ms INTEGER,
  last_seen_at_ms INTEGER,
  last_seen_reason TEXT
);

CREATE INDEX IF NOT EXISTS idx_node_pairing_paired_approved
  ON node_pairing_paired(approved_at_ms DESC, node_id);

CREATE TABLE IF NOT EXISTS device_identities (
  identity_key TEXT NOT NULL PRIMARY KEY,
  device_id TEXT NOT NULL,
  public_key_pem TEXT NOT NULL,
  private_key_pem TEXT NOT NULL,
  created_at_ms INTEGER NOT NULL,
  updated_at_ms INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_device_identities_device
  ON device_identities(device_id, updated_at_ms DESC);

CREATE TABLE IF NOT EXISTS device_auth_tokens (
  device_id TEXT NOT NULL,
  role TEXT NOT NULL,
  token TEXT NOT NULL,
  scopes_json TEXT NOT NULL,
  updated_at_ms INTEGER NOT NULL,
  PRIMARY KEY (device_id, role)
);

CREATE INDEX IF NOT EXISTS idx_device_auth_tokens_updated
  ON device_auth_tokens(updated_at_ms DESC, device_id, role);

CREATE TABLE IF NOT EXISTS android_notification_recent_packages (
  package_name TEXT NOT NULL PRIMARY KEY,
  sort_order INTEGER NOT NULL,
  updated_at_ms INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_android_notification_recent_packages_order
  ON android_notification_recent_packages(sort_order, package_name);

CREATE TABLE IF NOT EXISTS macos_port_guardian_records (
  pid INTEGER NOT NULL PRIMARY KEY,
  port INTEGER NOT NULL,
  command TEXT NOT NULL,
  mode TEXT NOT NULL,
  timestamp REAL NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_macos_port_guardian_records_port
  ON macos_port_guardian_records(port, timestamp DESC);

CREATE TABLE IF NOT EXISTS workspace_setup_state (
  workspace_key TEXT NOT NULL PRIMARY KEY,
  workspace_path TEXT NOT NULL,
  version INTEGER NOT NULL,
  bootstrap_seeded_at TEXT,
  setup_completed_at TEXT,
  updated_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_workspace_setup_state_path
  ON workspace_setup_state(workspace_path);

CREATE TABLE IF NOT EXISTS native_hook_relay_bridges (
  relay_id TEXT NOT NULL PRIMARY KEY,
  pid INTEGER NOT NULL,
  hostname TEXT NOT NULL,
  port INTEGER NOT NULL,
  token TEXT NOT NULL,
  expires_at_ms INTEGER NOT NULL,
  updated_at_ms INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_native_hook_relay_bridges_expires
  ON native_hook_relay_bridges(expires_at_ms, relay_id);

CREATE TABLE IF NOT EXISTS model_capability_cache (
  provider_id TEXT NOT NULL,
  model_id TEXT NOT NULL,
  name TEXT NOT NULL,
  input_text INTEGER NOT NULL,
  input_image INTEGER NOT NULL,
  reasoning INTEGER NOT NULL,
  supports_tools INTEGER,
  context_window INTEGER NOT NULL,
  max_tokens INTEGER NOT NULL,
  cost_input REAL NOT NULL,
  cost_output REAL NOT NULL,
  cost_cache_read REAL NOT NULL,
  cost_cache_write REAL NOT NULL,
  updated_at_ms INTEGER NOT NULL,
  PRIMARY KEY (provider_id, model_id)
);

CREATE INDEX IF NOT EXISTS idx_model_capability_cache_provider_updated
  ON model_capability_cache(provider_id, updated_at_ms DESC, model_id);

CREATE TABLE IF NOT EXISTS agent_model_catalogs (
  catalog_key TEXT NOT NULL PRIMARY KEY,
  agent_dir TEXT NOT NULL,
  raw_json TEXT NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_agent_model_catalogs_agent_dir
  ON agent_model_catalogs(agent_dir, updated_at DESC);

CREATE TABLE IF NOT EXISTS managed_outgoing_image_records (
  attachment_id TEXT NOT NULL PRIMARY KEY,
  session_key TEXT NOT NULL,
  message_id TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT,
  retention_class TEXT,
  alt TEXT NOT NULL,
  original_media_id TEXT NOT NULL,
  original_media_subdir TEXT NOT NULL,
  original_content_type TEXT NOT NULL,
  original_width INTEGER,
  original_height INTEGER,
  original_size_bytes INTEGER,
  original_filename TEXT,
  record_json TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_managed_outgoing_images_session
  ON managed_outgoing_image_records(session_key, created_at DESC, attachment_id);

CREATE INDEX IF NOT EXISTS idx_managed_outgoing_images_message
  ON managed_outgoing_image_records(session_key, message_id, attachment_id)
  WHERE message_id IS NOT NULL;

CREATE TABLE IF NOT EXISTS channel_pairing_requests (
  channel_key TEXT NOT NULL,
  account_id TEXT NOT NULL,
  request_id TEXT NOT NULL,
  code TEXT NOT NULL,
  created_at TEXT NOT NULL,
  last_seen_at TEXT NOT NULL,
  meta_json TEXT,
  PRIMARY KEY (channel_key, account_id, request_id)
);

CREATE INDEX IF NOT EXISTS idx_channel_pairing_requests_code
  ON channel_pairing_requests(channel_key, code);

CREATE INDEX IF NOT EXISTS idx_channel_pairing_requests_created
  ON channel_pairing_requests(channel_key, created_at, request_id);

CREATE TABLE IF NOT EXISTS channel_pairing_allow_entries (
  channel_key TEXT NOT NULL,
  account_id TEXT NOT NULL,
  entry TEXT NOT NULL,
  sort_order INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  PRIMARY KEY (channel_key, account_id, entry)
);

CREATE INDEX IF NOT EXISTS idx_channel_pairing_allow_account
  ON channel_pairing_allow_entries(channel_key, account_id, sort_order, entry);

CREATE TABLE IF NOT EXISTS web_push_subscriptions (
  endpoint_hash TEXT NOT NULL PRIMARY KEY,
  subscription_id TEXT NOT NULL UNIQUE,
  endpoint TEXT NOT NULL,
  p256dh TEXT NOT NULL,
  auth TEXT NOT NULL,
  created_at_ms INTEGER NOT NULL,
  updated_at_ms INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_web_push_subscriptions_updated
  ON web_push_subscriptions(updated_at_ms DESC, subscription_id);

CREATE TABLE IF NOT EXISTS web_push_vapid_keys (
  key_id TEXT NOT NULL PRIMARY KEY,
  public_key TEXT NOT NULL,
  private_key TEXT NOT NULL,
  subject TEXT NOT NULL,
  updated_at_ms INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS apns_registrations (
  node_id TEXT NOT NULL PRIMARY KEY,
  transport TEXT NOT NULL,
  token TEXT,
  relay_handle TEXT,
  send_grant TEXT,
  installation_id TEXT,
  topic TEXT NOT NULL,
  environment TEXT NOT NULL,
  distribution TEXT,
  token_debug_suffix TEXT,
  updated_at_ms INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_apns_registrations_updated
  ON apns_registrations(updated_at_ms DESC, node_id);

CREATE TABLE IF NOT EXISTS node_host_config (
  config_key TEXT NOT NULL PRIMARY KEY,
  version INTEGER NOT NULL,
  node_id TEXT NOT NULL,
  token TEXT,
  display_name TEXT,
  gateway_host TEXT,
  gateway_port INTEGER,
  gateway_tls INTEGER,
  gateway_tls_fingerprint TEXT,
  updated_at_ms INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS voicewake_triggers (
  config_key TEXT NOT NULL,
  position INTEGER NOT NULL,
  trigger TEXT NOT NULL,
  updated_at_ms INTEGER NOT NULL,
  PRIMARY KEY (config_key, position)
);

CREATE INDEX IF NOT EXISTS idx_voicewake_triggers_trigger
  ON voicewake_triggers(config_key, trigger);

CREATE TABLE IF NOT EXISTS voicewake_routing_config (
  config_key TEXT NOT NULL PRIMARY KEY,
  version INTEGER NOT NULL,
  default_target_mode TEXT NOT NULL,
  default_target_agent_id TEXT,
  default_target_session_key TEXT,
  updated_at_ms INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS voicewake_routing_routes (
  config_key TEXT NOT NULL,
  position INTEGER NOT NULL,
  trigger TEXT NOT NULL,
  target_mode TEXT NOT NULL,
  target_agent_id TEXT,
  target_session_key TEXT,
  updated_at_ms INTEGER NOT NULL,
  PRIMARY KEY (config_key, position),
  FOREIGN KEY (config_key) REFERENCES voicewake_routing_config(config_key) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_voicewake_routing_routes_trigger
  ON voicewake_routing_routes(config_key, trigger);

CREATE TABLE IF NOT EXISTS update_check_state (
  state_key TEXT NOT NULL PRIMARY KEY,
  last_checked_at TEXT,
  last_notified_version TEXT,
  last_notified_tag TEXT,
  last_available_version TEXT,
  last_available_tag TEXT,
  auto_install_id TEXT,
  auto_first_seen_version TEXT,
  auto_first_seen_tag TEXT,
  auto_first_seen_at TEXT,
  auto_last_attempt_version TEXT,
  auto_last_attempt_at TEXT,
  auto_last_success_version TEXT,
  auto_last_success_at TEXT,
  updated_at_ms INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS config_health_entries (
  config_path TEXT NOT NULL PRIMARY KEY,
  last_known_good_json TEXT,
  last_promoted_good_json TEXT,
  last_observed_suspicious_signature TEXT,
  updated_at_ms INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS installed_plugin_index (
  index_key TEXT NOT NULL PRIMARY KEY,
  version INTEGER NOT NULL,
  host_contract_version TEXT NOT NULL,
  compat_registry_version TEXT NOT NULL,
  migration_version INTEGER NOT NULL,
  policy_hash TEXT NOT NULL,
  generated_at_ms INTEGER NOT NULL,
  refresh_reason TEXT,
  install_records_json TEXT NOT NULL,
  plugins_json TEXT NOT NULL,
  diagnostics_json TEXT NOT NULL,
  warning TEXT,
  updated_at_ms INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_installed_plugin_index_generated
  ON installed_plugin_index(generated_at_ms DESC, index_key);

CREATE TABLE IF NOT EXISTS gateway_restart_sentinel (
  sentinel_key TEXT NOT NULL PRIMARY KEY,
  version INTEGER NOT NULL,
  kind TEXT NOT NULL,
  status TEXT NOT NULL,
  ts INTEGER NOT NULL,
  session_key TEXT,
  thread_id TEXT,
  delivery_channel TEXT,
  delivery_to TEXT,
  delivery_account_id TEXT,
  message TEXT,
  continuation_json TEXT,
  doctor_hint TEXT,
  stats_json TEXT,
  payload_json TEXT NOT NULL,
  updated_at_ms INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_gateway_restart_sentinel_ts
  ON gateway_restart_sentinel(ts DESC, sentinel_key);

CREATE TABLE IF NOT EXISTS gateway_restart_intent (
  intent_key TEXT NOT NULL PRIMARY KEY,
  kind TEXT NOT NULL,
  pid INTEGER NOT NULL,
  created_at INTEGER NOT NULL,
  reason TEXT,
  force INTEGER,
  wait_ms INTEGER,
  updated_at_ms INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS gateway_restart_handoff (
  handoff_key TEXT NOT NULL PRIMARY KEY,
  kind TEXT NOT NULL,
  version INTEGER NOT NULL,
  intent_id TEXT NOT NULL,
  pid INTEGER NOT NULL,
  process_instance_id TEXT,
  created_at INTEGER NOT NULL,
  expires_at INTEGER NOT NULL,
  reason TEXT,
  restart_trace_started_at INTEGER,
  restart_trace_last_at INTEGER,
  source TEXT NOT NULL,
  restart_kind TEXT NOT NULL,
  supervisor_mode TEXT NOT NULL,
  updated_at_ms INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_gateway_restart_handoff_expiry
  ON gateway_restart_handoff(expires_at, pid);

CREATE TABLE IF NOT EXISTS acp_sessions (
  session_key TEXT NOT NULL PRIMARY KEY,
  session_id TEXT,
  backend TEXT NOT NULL,
  agent TEXT NOT NULL,
  runtime_session_name TEXT NOT NULL,
  identity_json TEXT,
  mode TEXT NOT NULL,
  runtime_options_json TEXT,
  cwd TEXT,
  state TEXT NOT NULL,
  last_activity_at INTEGER NOT NULL,
  last_error TEXT,
  updated_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_acp_sessions_state_activity
  ON acp_sessions(state, last_activity_at DESC, session_key);

CREATE INDEX IF NOT EXISTS idx_acp_sessions_agent_activity
  ON acp_sessions(agent, last_activity_at DESC, session_key);

CREATE TABLE IF NOT EXISTS acp_replay_sessions (
  session_id TEXT NOT NULL PRIMARY KEY,
  session_key TEXT NOT NULL,
  cwd TEXT NOT NULL,
  complete INTEGER NOT NULL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  next_seq INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_acp_replay_sessions_key_updated
  ON acp_replay_sessions(session_key, complete, updated_at DESC, session_id);

CREATE INDEX IF NOT EXISTS idx_acp_replay_sessions_updated
  ON acp_replay_sessions(updated_at DESC, session_id);

CREATE TABLE IF NOT EXISTS acp_replay_events (
  session_id TEXT NOT NULL,
  seq INTEGER NOT NULL,
  at INTEGER NOT NULL,
  session_key TEXT NOT NULL,
  run_id TEXT,
  update_json TEXT NOT NULL,
  PRIMARY KEY (session_id, seq),
  FOREIGN KEY (session_id) REFERENCES acp_replay_sessions(session_id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_acp_replay_events_session_seq
  ON acp_replay_events(session_id, seq);

CREATE TABLE IF NOT EXISTS agent_databases (
  agent_id TEXT NOT NULL,
  path TEXT NOT NULL,
  schema_version INTEGER NOT NULL,
  last_seen_at INTEGER NOT NULL,
  size_bytes INTEGER,
  PRIMARY KEY (agent_id, path)
);

CREATE TABLE IF NOT EXISTS plugin_state_entries (
  plugin_id TEXT NOT NULL,
  namespace TEXT NOT NULL,
  entry_key TEXT NOT NULL,
  value_json TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  expires_at INTEGER,
  PRIMARY KEY (plugin_id, namespace, entry_key)
);

CREATE INDEX IF NOT EXISTS idx_plugin_state_expiry
  ON plugin_state_entries(expires_at)
  WHERE expires_at IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_plugin_state_listing
  ON plugin_state_entries(plugin_id, namespace, created_at, entry_key);

CREATE TABLE IF NOT EXISTS channel_ingress_events (
  queue_name TEXT NOT NULL,
  event_id TEXT NOT NULL,
  channel_id TEXT NOT NULL,
  account_id TEXT NOT NULL,
  status TEXT NOT NULL,
  lane_key TEXT,
  payload_json TEXT NOT NULL,
  metadata_json TEXT,
  received_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  claim_token TEXT,
  claim_owner TEXT,
  claimed_at INTEGER,
  attempts INTEGER NOT NULL DEFAULT 0,
  last_attempt_at INTEGER,
  last_error TEXT,
  failed_reason TEXT,
  failed_at INTEGER,
  completed_at INTEGER,
  completed_metadata_json TEXT,
  PRIMARY KEY (queue_name, event_id)
);

CREATE INDEX IF NOT EXISTS idx_channel_ingress_pending
  ON channel_ingress_events(queue_name, status, received_at, event_id);

CREATE INDEX IF NOT EXISTS idx_channel_ingress_claims
  ON channel_ingress_events(queue_name, status, claimed_at);

CREATE INDEX IF NOT EXISTS idx_channel_ingress_lane
  ON channel_ingress_events(queue_name, status, lane_key);

CREATE TABLE IF NOT EXISTS plugin_blob_entries (
  plugin_id TEXT NOT NULL,
  namespace TEXT NOT NULL,
  entry_key TEXT NOT NULL,
  metadata_json TEXT NOT NULL,
  blob BLOB NOT NULL,
  created_at INTEGER NOT NULL,
  expires_at INTEGER,
  PRIMARY KEY (plugin_id, namespace, entry_key)
);

CREATE INDEX IF NOT EXISTS idx_plugin_blob_expiry
  ON plugin_blob_entries(expires_at)
  WHERE expires_at IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_plugin_blob_listing
  ON plugin_blob_entries(plugin_id, namespace, created_at, entry_key);

CREATE TABLE IF NOT EXISTS media_blobs (
  subdir TEXT NOT NULL,
  id TEXT NOT NULL,
  content_type TEXT,
  size_bytes INTEGER NOT NULL,
  blob BLOB NOT NULL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  PRIMARY KEY (subdir, id)
);

CREATE INDEX IF NOT EXISTS idx_media_blobs_created
  ON media_blobs(created_at);

CREATE TABLE IF NOT EXISTS skill_uploads (
  upload_id TEXT NOT NULL PRIMARY KEY,
  kind TEXT NOT NULL,
  slug TEXT NOT NULL,
  force INTEGER NOT NULL,
  size_bytes INTEGER NOT NULL,
  sha256 TEXT,
  actual_sha256 TEXT,
  received_bytes INTEGER NOT NULL,
  archive_blob BLOB NOT NULL,
  created_at INTEGER NOT NULL,
  expires_at INTEGER NOT NULL,
  committed INTEGER NOT NULL,
  committed_at INTEGER,
  idempotency_key_hash TEXT UNIQUE
);

CREATE INDEX IF NOT EXISTS idx_skill_uploads_expiry
  ON skill_uploads(expires_at);

CREATE INDEX IF NOT EXISTS idx_skill_uploads_idempotency
  ON skill_uploads(idempotency_key_hash)
  WHERE idempotency_key_hash IS NOT NULL;

CREATE TABLE IF NOT EXISTS capture_sessions (
  id TEXT NOT NULL PRIMARY KEY,
  started_at INTEGER NOT NULL,
  ended_at INTEGER,
  mode TEXT NOT NULL,
  source_scope TEXT NOT NULL,
  source_process TEXT NOT NULL,
  proxy_url TEXT
);

CREATE TABLE IF NOT EXISTS capture_blobs (
  blob_id TEXT NOT NULL PRIMARY KEY,
  content_type TEXT,
  encoding TEXT NOT NULL,
  size_bytes INTEGER NOT NULL,
  sha256 TEXT NOT NULL,
  data BLOB NOT NULL,
  created_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS capture_events (
  id INTEGER NOT NULL PRIMARY KEY,
  session_id TEXT NOT NULL,
  ts INTEGER NOT NULL,
  source_scope TEXT NOT NULL,
  source_process TEXT NOT NULL,
  protocol TEXT NOT NULL,
  direction TEXT NOT NULL,
  kind TEXT NOT NULL,
  flow_id TEXT NOT NULL,
  method TEXT,
  host TEXT,
  path TEXT,
  status INTEGER,
  close_code INTEGER,
  content_type TEXT,
  headers_json TEXT,
  data_text TEXT,
  data_blob_id TEXT,
  data_sha256 TEXT,
  error_text TEXT,
  meta_json TEXT,
  FOREIGN KEY (session_id) REFERENCES capture_sessions(id) ON DELETE CASCADE,
  FOREIGN KEY (data_blob_id) REFERENCES capture_blobs(blob_id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS capture_events_session_ts_idx
  ON capture_events(session_id, ts);

CREATE INDEX IF NOT EXISTS capture_events_flow_idx
  ON capture_events(flow_id, ts);

CREATE TABLE IF NOT EXISTS sandbox_registry_entries (
  registry_kind TEXT NOT NULL,
  container_name TEXT NOT NULL,
  session_key TEXT,
  backend_id TEXT,
  runtime_label TEXT,
  image TEXT,
  created_at_ms INTEGER,
  last_used_at_ms INTEGER,
  config_label_kind TEXT,
  config_hash TEXT,
  cdp_port INTEGER,
  no_vnc_port INTEGER,
  entry_json TEXT NOT NULL,
  updated_at INTEGER NOT NULL,
  PRIMARY KEY (registry_kind, container_name)
);

CREATE INDEX IF NOT EXISTS idx_sandbox_registry_updated
  ON sandbox_registry_entries(registry_kind, updated_at DESC, container_name);

CREATE INDEX IF NOT EXISTS idx_sandbox_registry_session
  ON sandbox_registry_entries(registry_kind, session_key, last_used_at_ms DESC, container_name)
  WHERE session_key IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_sandbox_registry_last_used
  ON sandbox_registry_entries(registry_kind, last_used_at_ms DESC, container_name)
  WHERE last_used_at_ms IS NOT NULL;

CREATE TABLE IF NOT EXISTS commitments (
  id TEXT NOT NULL PRIMARY KEY,
  agent_id TEXT NOT NULL,
  session_key TEXT NOT NULL,
  channel TEXT NOT NULL,
  account_id TEXT,
  recipient_id TEXT,
  thread_id TEXT,
  sender_id TEXT,
  kind TEXT NOT NULL,
  sensitivity TEXT NOT NULL,
  source TEXT NOT NULL,
  status TEXT NOT NULL,
  reason TEXT NOT NULL,
  suggested_text TEXT NOT NULL,
  dedupe_key TEXT NOT NULL,
  confidence REAL NOT NULL,
  due_earliest_ms INTEGER NOT NULL,
  due_latest_ms INTEGER NOT NULL,
  due_timezone TEXT NOT NULL,
  source_message_id TEXT,
  source_run_id TEXT,
  created_at_ms INTEGER NOT NULL,
  updated_at_ms INTEGER NOT NULL,
  attempts INTEGER NOT NULL,
  last_attempt_at_ms INTEGER,
  sent_at_ms INTEGER,
  dismissed_at_ms INTEGER,
  snoozed_until_ms INTEGER,
  expired_at_ms INTEGER,
  record_json TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_commitments_scope_due
  ON commitments(agent_id, session_key, status, due_earliest_ms, due_latest_ms);

CREATE INDEX IF NOT EXISTS idx_commitments_status_due
  ON commitments(status, due_earliest_ms, due_latest_ms);

CREATE INDEX IF NOT EXISTS idx_commitments_scope_dedupe
  ON commitments(agent_id, session_key, channel, dedupe_key, status);

CREATE TABLE IF NOT EXISTS cron_run_logs (
  store_key TEXT NOT NULL,
  job_id TEXT NOT NULL,
  seq INTEGER NOT NULL,
  ts INTEGER NOT NULL,
  status TEXT,
  error TEXT,
  summary TEXT,
  diagnostics_summary TEXT,
  delivery_status TEXT,
  delivery_error TEXT,
  delivered INTEGER,
  session_id TEXT,
  session_key TEXT,
  run_id TEXT,
  run_at_ms INTEGER,
  duration_ms INTEGER,
  next_run_at_ms INTEGER,
  model TEXT,
  provider TEXT,
  total_tokens INTEGER,
  entry_json TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  PRIMARY KEY (store_key, job_id, seq)
);

CREATE INDEX IF NOT EXISTS idx_cron_run_logs_store_ts
  ON cron_run_logs(store_key, ts DESC, seq DESC);

CREATE INDEX IF NOT EXISTS idx_cron_run_logs_job_status
  ON cron_run_logs(store_key, job_id, status, ts DESC, seq DESC);

CREATE INDEX IF NOT EXISTS idx_cron_run_logs_delivery
  ON cron_run_logs(store_key, delivery_status, ts DESC, seq DESC)
  WHERE delivery_status IS NOT NULL;

CREATE TABLE IF NOT EXISTS cron_jobs (
  store_key TEXT NOT NULL,
  job_id TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  enabled INTEGER NOT NULL,
  delete_after_run INTEGER,
  created_at_ms INTEGER NOT NULL,
  agent_id TEXT,
  session_key TEXT,
  schedule_kind TEXT NOT NULL,
  schedule_expr TEXT,
  schedule_tz TEXT,
  every_ms INTEGER,
  anchor_ms INTEGER,
  at TEXT,
  stagger_ms INTEGER,
  session_target TEXT NOT NULL,
  wake_mode TEXT NOT NULL,
  payload_kind TEXT NOT NULL,
  payload_message TEXT,
  payload_model TEXT,
  payload_fallbacks_json TEXT,
  payload_thinking TEXT,
  payload_timeout_seconds INTEGER,
  payload_allow_unsafe_external_content INTEGER,
  payload_external_content_source_json TEXT,
  payload_light_context INTEGER,
  payload_tools_allow_json TEXT,
  delivery_mode TEXT,
  delivery_channel TEXT,
  delivery_to TEXT,
  delivery_thread_id TEXT,
  delivery_account_id TEXT,
  delivery_best_effort INTEGER,
  delivery_completion_mode TEXT,
  delivery_completion_to TEXT,
  failure_delivery_mode TEXT,
  failure_delivery_channel TEXT,
  failure_delivery_to TEXT,
  failure_delivery_account_id TEXT,
  failure_alert_disabled INTEGER,
  failure_alert_after INTEGER,
  failure_alert_channel TEXT,
  failure_alert_to TEXT,
  failure_alert_cooldown_ms INTEGER,
  failure_alert_include_skipped INTEGER,
  failure_alert_mode TEXT,
  failure_alert_account_id TEXT,
  next_run_at_ms INTEGER,
  running_at_ms INTEGER,
  last_run_at_ms INTEGER,
  last_run_status TEXT,
  last_error TEXT,
  last_duration_ms INTEGER,
  consecutive_errors INTEGER,
  consecutive_skipped INTEGER,
  schedule_error_count INTEGER,
  last_delivery_status TEXT,
  last_delivery_error TEXT,
  last_delivered INTEGER,
  last_failure_alert_at_ms INTEGER,
  job_json TEXT NOT NULL,
  state_json TEXT NOT NULL DEFAULT '{}',
  runtime_updated_at_ms INTEGER,
  schedule_identity TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  updated_at INTEGER NOT NULL,
  PRIMARY KEY (store_key, job_id)
);

CREATE INDEX IF NOT EXISTS idx_cron_jobs_store_updated
  ON cron_jobs(store_key, sort_order ASC, updated_at DESC, job_id);

CREATE INDEX IF NOT EXISTS idx_cron_jobs_store_order
  ON cron_jobs(store_key, sort_order ASC, updated_at ASC, job_id);

CREATE INDEX IF NOT EXISTS idx_cron_jobs_enabled_next_run
  ON cron_jobs(store_key, enabled, next_run_at_ms, job_id)
  WHERE next_run_at_ms IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_cron_jobs_agent_session
  ON cron_jobs(agent_id, session_key, updated_at DESC, job_id)
  WHERE agent_id IS NOT NULL OR session_key IS NOT NULL;

CREATE TABLE IF NOT EXISTS command_log_entries (
  id TEXT NOT NULL PRIMARY KEY,
  timestamp_ms INTEGER NOT NULL,
  action TEXT NOT NULL,
  session_key TEXT NOT NULL,
  sender_id TEXT NOT NULL,
  source TEXT NOT NULL,
  entry_json TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_command_log_entries_timestamp
  ON command_log_entries(timestamp_ms DESC, id);

CREATE INDEX IF NOT EXISTS idx_command_log_entries_session
  ON command_log_entries(session_key, timestamp_ms DESC, id);

CREATE TABLE IF NOT EXISTS delivery_queue_entries (
  queue_name TEXT NOT NULL,
  id TEXT NOT NULL,
  status TEXT NOT NULL,
  entry_kind TEXT,
  session_key TEXT,
  channel TEXT,
  target TEXT,
  account_id TEXT,
  retry_count INTEGER NOT NULL DEFAULT 0,
  last_attempt_at INTEGER,
  last_error TEXT,
  recovery_state TEXT,
  platform_send_started_at INTEGER,
  entry_json TEXT NOT NULL,
  enqueued_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  failed_at INTEGER,
  PRIMARY KEY (queue_name, id)
);

CREATE INDEX IF NOT EXISTS idx_delivery_queue_pending
  ON delivery_queue_entries(queue_name, status, enqueued_at, id);

CREATE INDEX IF NOT EXISTS idx_delivery_queue_failed
  ON delivery_queue_entries(queue_name, status, failed_at, id);

CREATE INDEX IF NOT EXISTS idx_delivery_queue_session
  ON delivery_queue_entries(queue_name, status, session_key, enqueued_at, id)
  WHERE session_key IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_delivery_queue_target
  ON delivery_queue_entries(queue_name, status, channel, target, enqueued_at, id)
  WHERE channel IS NOT NULL AND target IS NOT NULL;

CREATE TABLE IF NOT EXISTS task_runs (
  task_id TEXT NOT NULL PRIMARY KEY,
  runtime TEXT NOT NULL,
  task_kind TEXT,
  source_id TEXT,
  requester_session_key TEXT,
  owner_key TEXT NOT NULL,
  scope_kind TEXT NOT NULL,
  child_session_key TEXT,
  parent_flow_id TEXT,
  parent_task_id TEXT,
  agent_id TEXT,
  requester_agent_id TEXT,
  run_id TEXT,
  label TEXT,
  task TEXT NOT NULL,
  status TEXT NOT NULL,
  delivery_status TEXT NOT NULL,
  notify_policy TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  started_at INTEGER,
  ended_at INTEGER,
  last_event_at INTEGER,
  cleanup_after INTEGER,
  error TEXT,
  progress_summary TEXT,
  terminal_summary TEXT,
  terminal_outcome TEXT
);

CREATE INDEX IF NOT EXISTS idx_task_runs_run_id ON task_runs(run_id);
CREATE INDEX IF NOT EXISTS idx_task_runs_status ON task_runs(status);
CREATE INDEX IF NOT EXISTS idx_task_runs_runtime_status ON task_runs(runtime, status);
CREATE INDEX IF NOT EXISTS idx_task_runs_cleanup_after ON task_runs(cleanup_after);
CREATE INDEX IF NOT EXISTS idx_task_runs_last_event_at ON task_runs(last_event_at);
CREATE INDEX IF NOT EXISTS idx_task_runs_owner_key ON task_runs(owner_key);
CREATE INDEX IF NOT EXISTS idx_task_runs_parent_flow_id ON task_runs(parent_flow_id);
CREATE INDEX IF NOT EXISTS idx_task_runs_child_session_key ON task_runs(child_session_key);

CREATE TABLE IF NOT EXISTS subagent_runs (
  run_id TEXT NOT NULL PRIMARY KEY,
  child_session_key TEXT NOT NULL,
  controller_session_key TEXT,
  requester_session_key TEXT NOT NULL,
  requester_display_key TEXT NOT NULL,
  requester_origin_json TEXT,
  task TEXT NOT NULL,
  task_name TEXT,
  cleanup TEXT NOT NULL,
  label TEXT,
  model TEXT,
  agent_dir TEXT,
  workspace_dir TEXT,
  run_timeout_seconds INTEGER,
  spawn_mode TEXT,
  created_at INTEGER NOT NULL,
  started_at INTEGER,
  session_started_at INTEGER,
  accumulated_runtime_ms INTEGER,
  ended_at INTEGER,
  outcome_json TEXT,
  archive_at_ms INTEGER,
  cleanup_completed_at INTEGER,
  cleanup_handled INTEGER,
  suppress_announce_reason TEXT,
  expects_completion_message INTEGER,
  announce_retry_count INTEGER,
  last_announce_retry_at INTEGER,
  last_announce_delivery_error TEXT,
  ended_reason TEXT,
  pause_reason TEXT,
  wake_on_descendant_settle INTEGER,
  frozen_result_text TEXT,
  frozen_result_captured_at INTEGER,
  fallback_frozen_result_text TEXT,
  fallback_frozen_result_captured_at INTEGER,
  ended_hook_emitted_at INTEGER,
  pending_final_delivery INTEGER,
  pending_final_delivery_created_at INTEGER,
  pending_final_delivery_last_attempt_at INTEGER,
  pending_final_delivery_attempt_count INTEGER,
  pending_final_delivery_last_error TEXT,
  pending_final_delivery_payload_json TEXT,
  completion_announced_at INTEGER,
  payload_json TEXT NOT NULL DEFAULT '{}'
);

CREATE INDEX IF NOT EXISTS idx_subagent_runs_child_session_key
  ON subagent_runs(child_session_key, created_at DESC, run_id);
CREATE INDEX IF NOT EXISTS idx_subagent_runs_requester_session_key
  ON subagent_runs(requester_session_key, created_at DESC, run_id);
CREATE INDEX IF NOT EXISTS idx_subagent_runs_controller_session_key
  ON subagent_runs(controller_session_key, created_at DESC, run_id);
CREATE INDEX IF NOT EXISTS idx_subagent_runs_archive_at
  ON subagent_runs(archive_at_ms, cleanup_handled, run_id);
CREATE INDEX IF NOT EXISTS idx_subagent_runs_ended_cleanup
  ON subagent_runs(ended_at, cleanup_handled, run_id);

CREATE TABLE IF NOT EXISTS current_conversation_bindings (
  binding_key TEXT NOT NULL PRIMARY KEY,
  binding_id TEXT NOT NULL,
  target_agent_id TEXT NOT NULL,
  target_session_id TEXT,
  target_session_key TEXT NOT NULL,
  channel TEXT NOT NULL,
  account_id TEXT NOT NULL,
  conversation_kind TEXT NOT NULL,
  parent_conversation_id TEXT,
  conversation_id TEXT NOT NULL,
  target_kind TEXT NOT NULL,
  status TEXT NOT NULL,
  bound_at INTEGER NOT NULL,
  expires_at INTEGER,
  metadata_json TEXT,
  record_json TEXT NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_current_conversation_bindings_target
  ON current_conversation_bindings(target_agent_id, target_session_key, updated_at DESC, binding_key);
CREATE INDEX IF NOT EXISTS idx_current_conversation_bindings_conversation
  ON current_conversation_bindings(channel, account_id, conversation_kind, conversation_id);
CREATE INDEX IF NOT EXISTS idx_current_conversation_bindings_expires
  ON current_conversation_bindings(expires_at, binding_key);

CREATE TABLE IF NOT EXISTS plugin_binding_approvals (
  plugin_root TEXT NOT NULL,
  channel TEXT NOT NULL,
  account_id TEXT NOT NULL,
  plugin_id TEXT NOT NULL,
  plugin_name TEXT,
  approved_at INTEGER NOT NULL,
  PRIMARY KEY (plugin_root, channel, account_id)
);

CREATE INDEX IF NOT EXISTS idx_plugin_binding_approvals_plugin
  ON plugin_binding_approvals(plugin_id, approved_at DESC);

CREATE TABLE IF NOT EXISTS tui_last_sessions (
  scope_key TEXT NOT NULL PRIMARY KEY,
  session_key TEXT NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_tui_last_sessions_session_key
  ON tui_last_sessions(session_key, updated_at DESC, scope_key);

CREATE TABLE IF NOT EXISTS task_delivery_state (
  task_id TEXT NOT NULL PRIMARY KEY,
  requester_origin_json TEXT,
  last_notified_event_at INTEGER,
  FOREIGN KEY (task_id) REFERENCES task_runs(task_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS flow_runs (
  flow_id TEXT NOT NULL PRIMARY KEY,
  shape TEXT,
  sync_mode TEXT NOT NULL DEFAULT 'managed',
  owner_key TEXT NOT NULL,
  requester_origin_json TEXT,
  controller_id TEXT,
  revision INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL,
  notify_policy TEXT NOT NULL,
  goal TEXT NOT NULL,
  current_step TEXT,
  blocked_task_id TEXT,
  blocked_summary TEXT,
  state_json TEXT,
  wait_json TEXT,
  cancel_requested_at INTEGER,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  ended_at INTEGER
);

CREATE INDEX IF NOT EXISTS idx_flow_runs_status ON flow_runs(status);
CREATE INDEX IF NOT EXISTS idx_flow_runs_owner_key ON flow_runs(owner_key);
CREATE INDEX IF NOT EXISTS idx_flow_runs_updated_at ON flow_runs(updated_at);

CREATE TABLE IF NOT EXISTS migration_runs (
  id TEXT NOT NULL PRIMARY KEY,
  started_at INTEGER NOT NULL,
  finished_at INTEGER,
  status TEXT NOT NULL,
  report_json TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_migration_runs_started
  ON migration_runs(started_at DESC, id);

CREATE TABLE IF NOT EXISTS migration_sources (
  source_key TEXT NOT NULL PRIMARY KEY,
  migration_kind TEXT NOT NULL,
  source_path TEXT NOT NULL,
  target_table TEXT NOT NULL,
  source_sha256 TEXT,
  source_size_bytes INTEGER,
  source_record_count INTEGER,
  last_run_id TEXT NOT NULL,
  status TEXT NOT NULL,
  imported_at INTEGER NOT NULL,
  removed_source INTEGER NOT NULL DEFAULT 0,
  report_json TEXT NOT NULL,
  FOREIGN KEY (last_run_id) REFERENCES migration_runs(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_migration_sources_path
  ON migration_sources(source_path, migration_kind, target_table);

CREATE INDEX IF NOT EXISTS idx_migration_sources_run
  ON migration_sources(last_run_id, source_path);

CREATE TABLE IF NOT EXISTS backup_runs (
  id TEXT NOT NULL PRIMARY KEY,
  created_at INTEGER NOT NULL,
  archive_path TEXT NOT NULL,
  status TEXT NOT NULL,
  manifest_json TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_backup_runs_created
  ON backup_runs(created_at DESC, id);\n`;
//#endregion
//#region src/state/openclaw-state-db.ts
/**
* Shared OpenClaw SQLite state database lifecycle and metadata writers.
*
* This module owns schema creation, additive migrations for released state
* tables, private file permissions, cached handles, and audit rows for
* migrations/backups that operate on local state.
*/
const OPENCLAW_STATE_SCHEMA_VERSION = 1;
/** Shared timeout used by state and agent SQLite handles before surfacing busy errors. */
const OPENCLAW_SQLITE_BUSY_TIMEOUT_MS = 3e4;
const OPENCLAW_STATE_DIR_MODE = 448;
const OPENCLAW_STATE_FILE_MODE = 384;
const cachedDatabases = /* @__PURE__ */ new Map();
function assertSupportedSchemaVersion(db, pathname) {
	const userVersion = readSqliteUserVersion(db);
	if (userVersion > OPENCLAW_STATE_SCHEMA_VERSION) throw new Error(`OpenClaw state database ${pathname} uses newer schema version ${userVersion}; this OpenClaw build supports ${OPENCLAW_STATE_SCHEMA_VERSION}.`);
}
const stateDbLog = createSubsystemLogger("state/db");
/** Targets already warned about, so chmod-less filesystems warn once per path. */
const chmodWarnedTargets = /* @__PURE__ */ new Set();
function bestEffortChmodSync(target, mode) {
	const result = applyPrivateModeSync(target, mode);
	if (result.applied || chmodWarnedTargets.has(target)) return;
	chmodWarnedTargets.add(target);
	stateDbLog.warn(`skipped permission hardening for ${target}: ${String(result.error)}`);
}
function ensureOpenClawStatePermissions(pathname, env) {
	const dir = path.dirname(pathname);
	const defaultDir = resolveOpenClawStateSqliteDir(env);
	const isDefaultStateDatabase = path.resolve(pathname) === path.resolve(resolveOpenClawStateSqlitePath(env));
	if (isDefaultStateDatabase && dir !== defaultDir) throw new Error(`OpenClaw state database path resolved outside its state dir: ${pathname}`);
	const dirExisted = existsSync(dir);
	mkdirSync(dir, {
		recursive: true,
		mode: OPENCLAW_STATE_DIR_MODE
	});
	if (isDefaultStateDatabase || !dirExisted) bestEffortChmodSync(dir, OPENCLAW_STATE_DIR_MODE);
	for (const candidate of resolveSqliteDatabaseFilePaths(pathname)) if (existsSync(candidate)) bestEffortChmodSync(candidate, OPENCLAW_STATE_FILE_MODE);
}
function tableHasColumn(db, tableName, columnName) {
	return db.prepare(`PRAGMA table_info(${tableName})`).all().some((row) => row.name === columnName);
}
function tablePrimaryKeyColumns(db, tableName) {
	return db.prepare(`PRAGMA table_info(${tableName})`).all().filter((row) => Number(row.pk ?? 0) > 0 && typeof row.name === "string").toSorted((left, right) => Number(left.pk ?? 0) - Number(right.pk ?? 0)).map((row) => row.name);
}
function tableExists(db, tableName) {
	return db.prepare("SELECT 1 AS ok FROM sqlite_master WHERE type = 'table' AND name = ?").get(tableName)?.ok === 1;
}
function ensureColumn(db, tableName, columnSql) {
	const columnName = columnSql.trim().split(/\s+/, 1)[0];
	if (!columnName || !tableExists(db, tableName) || tableHasColumn(db, tableName, columnName)) return false;
	db.exec(`ALTER TABLE ${tableName} ADD COLUMN ${columnSql};`);
	return true;
}
function repairLegacyTaskAgentAttribution(db) {
	if (!tableExists(db, "task_runs") || !tableHasColumn(db, "task_runs", "requester_agent_id")) return;
	db.exec(`
    UPDATE task_runs
    SET
      requester_agent_id = CASE
        WHEN owner_key GLOB 'agent:*:*' THEN substr(
          owner_key,
          7,
          instr(substr(owner_key, 7), ':') - 1
        )
        WHEN requester_session_key GLOB 'agent:*:*' THEN substr(
          requester_session_key,
          7,
          instr(substr(requester_session_key, 7), ':') - 1
        )
        WHEN agent_id <> substr(
          child_session_key,
          7,
          instr(substr(child_session_key, 7), ':') - 1
        ) THEN agent_id
        ELSE NULL
      END,
      agent_id = substr(
        child_session_key,
        7,
        instr(substr(child_session_key, 7), ':') - 1
      )
    WHERE requester_agent_id IS NULL
      AND runtime IN ('subagent', 'acp')
      AND child_session_key GLOB 'agent:*:*'
      AND instr(substr(child_session_key, 7), ':') > 1
      AND (
        owner_key GLOB 'agent:*:*'
        OR requester_session_key GLOB 'agent:*:*'
        OR (
          agent_id IS NOT NULL
          AND agent_id <> substr(
            child_session_key,
            7,
            instr(substr(child_session_key, 7), ':') - 1
          )
        )
      );
  `);
}
function hasCanonicalAgentDatabasesPrimaryKey(db) {
	if (!tableExists(db, "agent_databases")) return true;
	const primaryKey = tablePrimaryKeyColumns(db, "agent_databases");
	return primaryKey.length === 2 && primaryKey[0] === "agent_id" && primaryKey[1] === "path";
}
function canRepairAgentDatabasesPrimaryKey(db) {
	if (!tableExists(db, "agent_databases")) return false;
	return [
		"agent_id",
		"path",
		"schema_version",
		"last_seen_at",
		"size_bytes"
	].every((column) => tableHasColumn(db, "agent_databases", column));
}
function repairAgentDatabasesCompositePrimaryKey(db) {
	if (hasCanonicalAgentDatabasesPrimaryKey(db) || !canRepairAgentDatabasesPrimaryKey(db)) return false;
	db.exec(`
    DROP TABLE IF EXISTS agent_databases_migration_new;
    CREATE TABLE agent_databases_migration_new (
      agent_id TEXT NOT NULL,
      path TEXT NOT NULL,
      schema_version INTEGER NOT NULL,
      last_seen_at INTEGER NOT NULL,
      size_bytes INTEGER,
      PRIMARY KEY (agent_id, path)
    );
    INSERT OR REPLACE INTO agent_databases_migration_new (
      agent_id,
      path,
      schema_version,
      last_seen_at,
      size_bytes
    )
    SELECT
      agent_id,
      path,
      schema_version,
      last_seen_at,
      size_bytes
    FROM agent_databases
    WHERE agent_id IS NOT NULL AND path IS NOT NULL;
    DROP TABLE agent_databases;
    ALTER TABLE agent_databases_migration_new RENAME TO agent_databases;
  `);
	return true;
}
function assertCanonicalStateSchemaShape(db, pathname) {
	if (hasCanonicalAgentDatabasesPrimaryKey(db)) return;
	throw new Error(`OpenClaw state database ${pathname} has a legacy agent database registry schema; run openclaw doctor --fix to migrate it.`);
}
function detectOpenClawStateDatabaseSchemaMigrations(options = {}) {
	const pathname = resolveDatabasePath(options);
	if (!existsSync(pathname)) return [];
	const db = new (requireNodeSqlite()).DatabaseSync(pathname, { readOnly: true });
	try {
		return hasCanonicalAgentDatabasesPrimaryKey(db) ? [] : [{
			kind: "agent-databases-composite-primary-key",
			path: pathname
		}];
	} finally {
		db.close();
	}
}
function repairOpenClawStateDatabaseSchema(options = {}) {
	const env = options.env ?? process.env;
	const pathname = resolveDatabasePath(options);
	if (!existsSync(pathname)) return {
		changes: [],
		warnings: []
	};
	ensureOpenClawStatePermissions(pathname, env);
	const db = new (requireNodeSqlite()).DatabaseSync(pathname);
	db.exec(`PRAGMA busy_timeout = ${OPENCLAW_SQLITE_BUSY_TIMEOUT_MS};`);
	try {
		assertSupportedSchemaVersion(db, pathname);
		return runSqliteImmediateTransactionSync(db, () => repairAgentDatabasesCompositePrimaryKey(db)) ? {
			changes: [`Migrated shared state agent database registry primary key → agent_id,path`],
			warnings: []
		} : {
			changes: [],
			warnings: []
		};
	} catch (err) {
		return {
			changes: [],
			warnings: [`Failed migrating shared state database schema at ${pathname}: ${String(err)}`]
		};
	} finally {
		db.close();
		ensureOpenClawStatePermissions(pathname, env);
	}
}
function backfillCronRunLogEntryJson(db) {
	if (!tableExists(db, "cron_run_logs") || !tableHasColumn(db, "cron_run_logs", "entry_json")) return;
	const rows = db.prepare(`SELECT store_key, job_id, seq, ts
         FROM cron_run_logs
        WHERE entry_json = '{}'`).all();
	if (rows.length === 0) return;
	const update = db.prepare(`UPDATE cron_run_logs
        SET entry_json = ?
      WHERE store_key = ? AND job_id = ? AND seq = ?`);
	for (const row of rows) update.run(JSON.stringify({
		ts: Number(row.ts),
		jobId: row.job_id,
		action: "finished"
	}), row.store_key, row.job_id, row.seq);
}
function parseJsonRecord(value) {
	try {
		const parsed = JSON.parse(value);
		return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : null;
	} catch {
		return null;
	}
}
function textField(record, key) {
	const value = record[key];
	return typeof value === "string" && value.trim() ? value : null;
}
function numberField(record, key) {
	const value = record[key];
	return typeof value === "number" && Number.isFinite(value) ? value : null;
}
function recordField(record, key) {
	const value = record[key];
	return value && typeof value === "object" && !Array.isArray(value) ? value : null;
}
function jsonField(value) {
	return value === void 0 ? null : JSON.stringify(value);
}
function cronSessionTargetField(record) {
	const value = textField(record, "sessionTarget");
	if (!value) return null;
	return value === "main" || value === "isolated" || value === "current" || value.startsWith("session:") ? value : null;
}
function cronWakeModeField(record) {
	const value = textField(record, "wakeMode");
	return value === "now" || value === "next-heartbeat" ? value : null;
}
function booleanField(record, key) {
	const value = record[key];
	return typeof value === "boolean" ? value ? 1 : 0 : null;
}
function failureDestinationField(record, key) {
	if (!record || !Object.hasOwn(record, key)) return null;
	const value = record[key];
	return typeof value === "string" && value.trim() ? value : "";
}
function backfillCronJobsFromJobJson(db) {
	if (!tableExists(db, "cron_jobs") || !tableHasColumn(db, "cron_jobs", "job_json") || !tableHasColumn(db, "cron_jobs", "schedule_kind") || !tableHasColumn(db, "cron_jobs", "payload_kind")) return;
	const rows = db.prepare(`SELECT store_key, job_id, job_json, updated_at
         FROM cron_jobs
        WHERE schedule_kind = 'manual'
           OR payload_kind = 'message'
           OR name = ''`).all();
	if (rows.length === 0) return;
	const update = db.prepare(`UPDATE cron_jobs
        SET name = ?,
            enabled = ?,
            delete_after_run = ?,
            created_at_ms = ?,
            agent_id = ?,
            session_key = ?,
            schedule_kind = ?,
            schedule_expr = ?,
            schedule_tz = ?,
            every_ms = ?,
            anchor_ms = ?,
            at = ?,
            stagger_ms = ?,
            session_target = ?,
            wake_mode = ?,
            payload_kind = ?,
            payload_message = ?,
            payload_model = ?,
            payload_fallbacks_json = ?,
            payload_thinking = ?,
            payload_timeout_seconds = ?,
            payload_allow_unsafe_external_content = ?,
            payload_external_content_source_json = ?,
            payload_light_context = ?,
            payload_tools_allow_json = ?,
            delivery_mode = ?,
            delivery_channel = ?,
            delivery_to = ?,
            delivery_thread_id = ?,
            delivery_account_id = ?,
            delivery_best_effort = ?,
            delivery_completion_mode = ?,
            delivery_completion_to = ?,
            failure_delivery_mode = ?,
            failure_delivery_channel = ?,
            failure_delivery_to = ?,
            failure_delivery_account_id = ?,
            failure_alert_disabled = ?,
            failure_alert_after = ?,
            failure_alert_channel = ?,
            failure_alert_to = ?,
            failure_alert_cooldown_ms = ?,
            failure_alert_include_skipped = ?,
            failure_alert_mode = ?,
            failure_alert_account_id = ?,
            runtime_updated_at_ms = ?
      WHERE store_key = ?
        AND job_id = ?`);
	for (const row of rows) {
		const job = parseJsonRecord(row.job_json);
		if (!job) continue;
		const schedule = recordField(job, "schedule");
		const payload = recordField(job, "payload");
		const scheduleKind = textField(schedule ?? {}, "kind");
		const payloadKind = textField(payload ?? {}, "kind");
		const isAt = scheduleKind === "at" && textField(schedule ?? {}, "at");
		const isEvery = scheduleKind === "every" && numberField(schedule ?? {}, "everyMs") != null;
		const isCron = scheduleKind === "cron" && textField(schedule ?? {}, "expr");
		const isSystemEvent = payloadKind === "systemEvent" && textField(payload ?? {}, "text");
		const isAgentTurn = payloadKind === "agentTurn" && textField(payload ?? {}, "message");
		if (!schedule || !payload || !isAt && !isEvery && !isCron || !isSystemEvent && !isAgentTurn) continue;
		const fallbackTime = Number(row.updated_at) || 0;
		const delivery = recordField(job, "delivery");
		const completionDestination = delivery ? recordField(delivery, "completionDestination") : null;
		const failureDestination = delivery ? recordField(delivery, "failureDestination") : null;
		const failureAlertValue = job.failureAlert;
		const failureAlert = failureAlertValue && typeof failureAlertValue === "object" && !Array.isArray(failureAlertValue) ? failureAlertValue : null;
		update.run(textField(job, "name") ?? row.job_id, job.enabled === false ? 0 : 1, booleanField(job, "deleteAfterRun"), numberField(job, "createdAtMs") ?? fallbackTime, textField(job, "agentId"), textField(job, "sessionKey"), scheduleKind, isCron ? textField(schedule, "expr") : null, isCron ? textField(schedule, "tz") : null, isEvery ? numberField(schedule, "everyMs") : null, isEvery ? numberField(schedule, "anchorMs") : null, isAt ? textField(schedule, "at") : null, isCron ? numberField(schedule, "staggerMs") : null, cronSessionTargetField(job) ?? (payloadKind === "agentTurn" ? "isolated" : "main"), cronWakeModeField(job) ?? "now", payloadKind, isSystemEvent ? textField(payload, "text") : textField(payload, "message"), isAgentTurn ? textField(payload, "model") : null, isAgentTurn ? jsonField(payload.fallbacks) : null, isAgentTurn ? textField(payload, "thinking") : null, isAgentTurn ? numberField(payload, "timeoutSeconds") : null, isAgentTurn && typeof payload.allowUnsafeExternalContent === "boolean" ? payload.allowUnsafeExternalContent ? 1 : 0 : null, isAgentTurn ? jsonField(payload.externalContentSource) : null, isAgentTurn && typeof payload.lightContext === "boolean" ? payload.lightContext ? 1 : 0 : null, isAgentTurn ? jsonField(payload.toolsAllow) : null, delivery ? textField(delivery, "mode") : null, delivery ? textField(delivery, "channel") : null, delivery ? textField(delivery, "to") : null, delivery ? textField(delivery, "threadId") : null, delivery ? textField(delivery, "accountId") : null, delivery && typeof delivery.bestEffort === "boolean" ? delivery.bestEffort ? 1 : 0 : null, completionDestination ? textField(completionDestination, "mode") : null, completionDestination ? textField(completionDestination, "to") : null, failureDestinationField(failureDestination, "mode"), failureDestinationField(failureDestination, "channel"), failureDestinationField(failureDestination, "to"), failureDestinationField(failureDestination, "accountId"), failureAlertValue === false ? 1 : failureAlert ? 0 : null, failureAlert ? numberField(failureAlert, "after") : null, failureAlert ? textField(failureAlert, "channel") : null, failureAlert ? textField(failureAlert, "to") : null, failureAlert ? numberField(failureAlert, "cooldownMs") : null, failureAlert && typeof failureAlert.includeSkipped === "boolean" ? failureAlert.includeSkipped ? 1 : 0 : null, failureAlert ? textField(failureAlert, "mode") : null, failureAlert ? textField(failureAlert, "accountId") : null, numberField(job, "updatedAtMs") ?? fallbackTime, row.store_key, row.job_id);
	}
}
function metadataStringField(record, key) {
	return textField(record, key);
}
function backfillDeliveryQueueEntriesFromEntryJson(db) {
	if (!tableExists(db, "delivery_queue_entries") || !tableHasColumn(db, "delivery_queue_entries", "entry_json") || !tableHasColumn(db, "delivery_queue_entries", "retry_count")) return;
	const rows = db.prepare(`SELECT queue_name, id, entry_json
         FROM delivery_queue_entries
        WHERE retry_count = 0
           OR last_attempt_at IS NULL
           OR last_error IS NULL
           OR recovery_state IS NULL
           OR platform_send_started_at IS NULL
           OR entry_kind IS NULL
           OR session_key IS NULL
           OR channel IS NULL
           OR target IS NULL
           OR account_id IS NULL`).all();
	if (rows.length === 0) return;
	const update = db.prepare(`UPDATE delivery_queue_entries
        SET entry_kind = COALESCE(?, entry_kind),
            session_key = COALESCE(?, session_key),
            channel = COALESCE(?, channel),
            target = COALESCE(?, target),
            account_id = COALESCE(?, account_id),
            retry_count = ?,
            last_attempt_at = COALESCE(?, last_attempt_at),
            last_error = COALESCE(?, last_error),
            recovery_state = COALESCE(?, recovery_state),
            platform_send_started_at = COALESCE(?, platform_send_started_at)
      WHERE queue_name = ?
        AND id = ?`);
	for (const row of rows) {
		const entry = parseJsonRecord(row.entry_json);
		if (!entry) continue;
		const session = recordField(entry, "session");
		const route = recordField(entry, "route");
		const deliveryContext = recordField(entry, "deliveryContext");
		update.run(metadataStringField(entry, "kind"), metadataStringField(entry, "sessionKey") ?? (session ? metadataStringField(session, "key") : null), metadataStringField(entry, "channel") ?? (route ? metadataStringField(route, "channel") : null) ?? (deliveryContext ? metadataStringField(deliveryContext, "channel") : null), metadataStringField(entry, "to") ?? (route ? metadataStringField(route, "to") : null) ?? (deliveryContext ? metadataStringField(deliveryContext, "to") : null), metadataStringField(entry, "accountId") ?? (route ? metadataStringField(route, "accountId") : null) ?? (deliveryContext ? metadataStringField(deliveryContext, "accountId") : null), numberField(entry, "retryCount") ?? 0, numberField(entry, "lastAttemptAt"), metadataStringField(entry, "lastError"), metadataStringField(entry, "recoveryState"), numberField(entry, "platformSendStartedAt"), row.queue_name, row.id);
	}
}
function ensureAdditiveStateColumns(db) {
	ensureColumn(db, "node_pairing_pending", "client_id TEXT");
	ensureColumn(db, "node_pairing_pending", "client_mode TEXT");
	ensureColumn(db, "node_pairing_paired", "client_id TEXT");
	ensureColumn(db, "node_pairing_paired", "client_mode TEXT");
	ensureColumn(db, "cron_run_logs", "status TEXT");
	ensureColumn(db, "cron_run_logs", "error TEXT");
	ensureColumn(db, "cron_run_logs", "summary TEXT");
	ensureColumn(db, "cron_run_logs", "diagnostics_summary TEXT");
	ensureColumn(db, "cron_run_logs", "delivery_status TEXT");
	ensureColumn(db, "cron_run_logs", "delivery_error TEXT");
	ensureColumn(db, "cron_run_logs", "delivered INTEGER");
	ensureColumn(db, "cron_run_logs", "session_id TEXT");
	ensureColumn(db, "cron_run_logs", "session_key TEXT");
	ensureColumn(db, "cron_run_logs", "run_id TEXT");
	ensureColumn(db, "cron_run_logs", "run_at_ms INTEGER");
	ensureColumn(db, "cron_run_logs", "duration_ms INTEGER");
	ensureColumn(db, "cron_run_logs", "next_run_at_ms INTEGER");
	ensureColumn(db, "cron_run_logs", "model TEXT");
	ensureColumn(db, "cron_run_logs", "provider TEXT");
	ensureColumn(db, "cron_run_logs", "total_tokens INTEGER");
	ensureColumn(db, "cron_run_logs", "entry_json TEXT NOT NULL DEFAULT '{}'");
	ensureColumn(db, "cron_run_logs", "created_at INTEGER NOT NULL DEFAULT 0");
	backfillCronRunLogEntryJson(db);
	ensureColumn(db, "cron_jobs", "description TEXT");
	ensureColumn(db, "cron_jobs", "name TEXT NOT NULL DEFAULT ''");
	ensureColumn(db, "cron_jobs", "enabled INTEGER NOT NULL DEFAULT 1");
	ensureColumn(db, "cron_jobs", "delete_after_run INTEGER");
	ensureColumn(db, "cron_jobs", "created_at_ms INTEGER NOT NULL DEFAULT 0");
	ensureColumn(db, "cron_jobs", "agent_id TEXT");
	ensureColumn(db, "cron_jobs", "session_key TEXT");
	ensureColumn(db, "cron_jobs", "schedule_kind TEXT NOT NULL DEFAULT 'manual'");
	ensureColumn(db, "cron_jobs", "schedule_expr TEXT");
	ensureColumn(db, "cron_jobs", "schedule_tz TEXT");
	ensureColumn(db, "cron_jobs", "every_ms INTEGER");
	ensureColumn(db, "cron_jobs", "anchor_ms INTEGER");
	ensureColumn(db, "cron_jobs", "at TEXT");
	ensureColumn(db, "cron_jobs", "stagger_ms INTEGER");
	ensureColumn(db, "cron_jobs", "session_target TEXT NOT NULL DEFAULT 'main'");
	ensureColumn(db, "cron_jobs", "wake_mode TEXT NOT NULL DEFAULT 'auto'");
	ensureColumn(db, "cron_jobs", "payload_kind TEXT NOT NULL DEFAULT 'message'");
	ensureColumn(db, "cron_jobs", "payload_message TEXT");
	ensureColumn(db, "cron_jobs", "payload_model TEXT");
	ensureColumn(db, "cron_jobs", "payload_fallbacks_json TEXT");
	ensureColumn(db, "cron_jobs", "payload_thinking TEXT");
	ensureColumn(db, "cron_jobs", "payload_timeout_seconds INTEGER");
	ensureColumn(db, "cron_jobs", "payload_allow_unsafe_external_content INTEGER");
	ensureColumn(db, "cron_jobs", "payload_external_content_source_json TEXT");
	ensureColumn(db, "cron_jobs", "payload_light_context INTEGER");
	ensureColumn(db, "cron_jobs", "payload_tools_allow_json TEXT");
	ensureColumn(db, "cron_jobs", "delivery_mode TEXT");
	ensureColumn(db, "cron_jobs", "delivery_channel TEXT");
	ensureColumn(db, "cron_jobs", "delivery_to TEXT");
	ensureColumn(db, "cron_jobs", "delivery_thread_id TEXT");
	ensureColumn(db, "cron_jobs", "delivery_account_id TEXT");
	ensureColumn(db, "cron_jobs", "delivery_best_effort INTEGER");
	ensureColumn(db, "cron_jobs", "delivery_completion_mode TEXT");
	ensureColumn(db, "cron_jobs", "delivery_completion_to TEXT");
	ensureColumn(db, "cron_jobs", "failure_delivery_mode TEXT");
	ensureColumn(db, "cron_jobs", "failure_delivery_channel TEXT");
	ensureColumn(db, "cron_jobs", "failure_delivery_to TEXT");
	ensureColumn(db, "cron_jobs", "failure_delivery_account_id TEXT");
	ensureColumn(db, "cron_jobs", "failure_alert_disabled INTEGER");
	ensureColumn(db, "cron_jobs", "failure_alert_after INTEGER");
	ensureColumn(db, "cron_jobs", "failure_alert_channel TEXT");
	ensureColumn(db, "cron_jobs", "failure_alert_to TEXT");
	ensureColumn(db, "cron_jobs", "failure_alert_cooldown_ms INTEGER");
	ensureColumn(db, "cron_jobs", "failure_alert_include_skipped INTEGER");
	ensureColumn(db, "cron_jobs", "failure_alert_mode TEXT");
	ensureColumn(db, "cron_jobs", "failure_alert_account_id TEXT");
	ensureColumn(db, "cron_jobs", "next_run_at_ms INTEGER");
	ensureColumn(db, "cron_jobs", "running_at_ms INTEGER");
	ensureColumn(db, "cron_jobs", "last_run_at_ms INTEGER");
	ensureColumn(db, "cron_jobs", "last_run_status TEXT");
	ensureColumn(db, "cron_jobs", "last_error TEXT");
	ensureColumn(db, "cron_jobs", "last_duration_ms INTEGER");
	ensureColumn(db, "cron_jobs", "consecutive_errors INTEGER");
	ensureColumn(db, "cron_jobs", "consecutive_skipped INTEGER");
	ensureColumn(db, "cron_jobs", "schedule_error_count INTEGER");
	ensureColumn(db, "cron_jobs", "last_delivery_status TEXT");
	ensureColumn(db, "cron_jobs", "last_delivery_error TEXT");
	ensureColumn(db, "cron_jobs", "last_delivered INTEGER");
	ensureColumn(db, "cron_jobs", "last_failure_alert_at_ms INTEGER");
	ensureColumn(db, "cron_jobs", "state_json TEXT NOT NULL DEFAULT '{}'");
	ensureColumn(db, "cron_jobs", "runtime_updated_at_ms INTEGER");
	ensureColumn(db, "cron_jobs", "schedule_identity TEXT");
	ensureColumn(db, "cron_jobs", "sort_order INTEGER NOT NULL DEFAULT 0");
	backfillCronJobsFromJobJson(db);
	ensureColumn(db, "sandbox_registry_entries", "session_key TEXT");
	ensureColumn(db, "sandbox_registry_entries", "backend_id TEXT");
	ensureColumn(db, "sandbox_registry_entries", "runtime_label TEXT");
	ensureColumn(db, "sandbox_registry_entries", "image TEXT");
	ensureColumn(db, "sandbox_registry_entries", "created_at_ms INTEGER");
	ensureColumn(db, "sandbox_registry_entries", "last_used_at_ms INTEGER");
	ensureColumn(db, "sandbox_registry_entries", "config_label_kind TEXT");
	ensureColumn(db, "sandbox_registry_entries", "config_hash TEXT");
	ensureColumn(db, "sandbox_registry_entries", "cdp_port INTEGER");
	ensureColumn(db, "sandbox_registry_entries", "no_vnc_port INTEGER");
	ensureColumn(db, "delivery_queue_entries", "entry_kind TEXT");
	ensureColumn(db, "delivery_queue_entries", "session_key TEXT");
	ensureColumn(db, "delivery_queue_entries", "channel TEXT");
	ensureColumn(db, "delivery_queue_entries", "target TEXT");
	ensureColumn(db, "delivery_queue_entries", "account_id TEXT");
	ensureColumn(db, "delivery_queue_entries", "retry_count INTEGER NOT NULL DEFAULT 0");
	ensureColumn(db, "delivery_queue_entries", "last_attempt_at INTEGER");
	ensureColumn(db, "delivery_queue_entries", "last_error TEXT");
	ensureColumn(db, "delivery_queue_entries", "recovery_state TEXT");
	ensureColumn(db, "delivery_queue_entries", "platform_send_started_at INTEGER");
	backfillDeliveryQueueEntriesFromEntryJson(db);
	ensureColumn(db, "commitments", "account_id TEXT");
	ensureColumn(db, "commitments", "recipient_id TEXT");
	ensureColumn(db, "commitments", "thread_id TEXT");
	ensureColumn(db, "commitments", "sender_id TEXT");
	ensureColumn(db, "commitments", "kind TEXT NOT NULL DEFAULT 'followup'");
	ensureColumn(db, "commitments", "sensitivity TEXT NOT NULL DEFAULT 'normal'");
	ensureColumn(db, "commitments", "source TEXT NOT NULL DEFAULT 'unknown'");
	ensureColumn(db, "commitments", "reason TEXT NOT NULL DEFAULT ''");
	ensureColumn(db, "commitments", "suggested_text TEXT NOT NULL DEFAULT ''");
	ensureColumn(db, "commitments", "dedupe_key TEXT NOT NULL DEFAULT ''");
	ensureColumn(db, "commitments", "confidence REAL NOT NULL DEFAULT 0");
	ensureColumn(db, "commitments", "due_timezone TEXT NOT NULL DEFAULT 'UTC'");
	ensureColumn(db, "commitments", "source_message_id TEXT");
	ensureColumn(db, "commitments", "source_run_id TEXT");
	ensureColumn(db, "commitments", "created_at_ms INTEGER NOT NULL DEFAULT 0");
	ensureColumn(db, "commitments", "attempts INTEGER NOT NULL DEFAULT 0");
	ensureColumn(db, "commitments", "last_attempt_at_ms INTEGER");
	ensureColumn(db, "commitments", "sent_at_ms INTEGER");
	ensureColumn(db, "commitments", "dismissed_at_ms INTEGER");
	ensureColumn(db, "commitments", "snoozed_until_ms INTEGER");
	ensureColumn(db, "commitments", "expired_at_ms INTEGER");
	ensureColumn(db, "current_conversation_bindings", "target_agent_id TEXT NOT NULL DEFAULT 'main'");
	ensureColumn(db, "current_conversation_bindings", "target_session_id TEXT");
	ensureColumn(db, "current_conversation_bindings", "conversation_kind TEXT NOT NULL DEFAULT 'channel'");
	ensureColumn(db, "device_bootstrap_tokens", "pending_profile_json TEXT");
	ensureColumn(db, "gateway_restart_handoff", "restart_trace_started_at INTEGER");
	ensureColumn(db, "gateway_restart_handoff", "restart_trace_last_at INTEGER");
	ensureColumn(db, "gateway_restart_intent", "reason TEXT");
	ensureColumn(db, "gateway_restart_sentinel", "delivery_channel TEXT");
	ensureColumn(db, "gateway_restart_sentinel", "delivery_to TEXT");
	ensureColumn(db, "gateway_restart_sentinel", "delivery_account_id TEXT");
	ensureColumn(db, "gateway_restart_sentinel", "message TEXT");
	ensureColumn(db, "gateway_restart_sentinel", "continuation_json TEXT");
	ensureColumn(db, "gateway_restart_sentinel", "doctor_hint TEXT");
	ensureColumn(db, "gateway_restart_sentinel", "stats_json TEXT");
	runSqliteImmediateTransactionSync(db, () => {
		if (ensureColumn(db, "task_runs", "requester_agent_id TEXT")) repairLegacyTaskAgentAttribution(db);
	});
	ensureColumn(db, "subagent_runs", "task_name TEXT");
}
function ensureSchema(db, pathname) {
	assertSupportedSchemaVersion(db, pathname);
	ensureAdditiveStateColumns(db);
	assertCanonicalStateSchemaShape(db, pathname);
	db.exec(OPENCLAW_STATE_SCHEMA_SQL);
	ensureAdditiveStateColumns(db);
	db.exec(`PRAGMA user_version = ${OPENCLAW_STATE_SCHEMA_VERSION};`);
	const now = Date.now();
	executeSqliteQuerySync(db, getNodeSqliteKysely(db).insertInto("schema_meta").values({
		meta_key: "primary",
		role: "global",
		schema_version: OPENCLAW_STATE_SCHEMA_VERSION,
		agent_id: null,
		app_version: null,
		created_at: now,
		updated_at: now
	}).onConflict((conflict) => conflict.column("meta_key").doUpdateSet({
		role: "global",
		schema_version: OPENCLAW_STATE_SCHEMA_VERSION,
		agent_id: null,
		app_version: null,
		updated_at: now
	})));
}
function resolveDatabasePath(options = {}) {
	return path.resolve(options.path ?? resolveOpenClawStateSqlitePath(options.env ?? process.env));
}
/** Open or return a cached shared state database after schema and migration checks. */
function openOpenClawStateDatabase(options = {}) {
	const env = options.env ?? process.env;
	const pathname = resolveDatabasePath(options);
	const cached = cachedDatabases.get(pathname);
	if (cached?.db.isOpen) return cached;
	if (cached) {
		cached.walMaintenance.close();
		clearNodeSqliteKyselyCacheForDatabase(cached.db);
		cachedDatabases.delete(pathname);
	}
	ensureOpenClawStatePermissions(pathname, env);
	const db = new (requireNodeSqlite()).DatabaseSync(pathname);
	const walMaintenance = (() => {
		let maintenance;
		try {
			maintenance = configureSqliteConnectionPragmas(db, {
				busyTimeoutMs: OPENCLAW_SQLITE_BUSY_TIMEOUT_MS,
				databaseLabel: "openclaw-state",
				databasePath: pathname,
				foreignKeys: true,
				synchronous: "NORMAL"
			});
			ensureSchema(db, pathname);
			return maintenance;
		} catch (err) {
			maintenance?.close();
			db.close();
			throw err;
		}
	})();
	ensureOpenClawStatePermissions(pathname, env);
	const database = {
		db,
		path: pathname,
		walMaintenance
	};
	cachedDatabases.set(pathname, database);
	return database;
}
/** Run a synchronous immediate transaction against the shared state database. */
function runOpenClawStateWriteTransaction(operation, options = {}) {
	const database = openOpenClawStateDatabase(options);
	const result = runSqliteImmediateTransactionSync(database.db, () => operation(database));
	try {
		ensureOpenClawStatePermissions(database.path, options.env ?? process.env);
	} catch {}
	return result;
}
/** Close all cached shared state database handles. */
function closeOpenClawStateDatabase() {
	for (const database of cachedDatabases.values()) {
		database.walMaintenance.close();
		clearNodeSqliteKyselyCacheForDatabase(database.db);
		if (database.db.isOpen) database.db.close();
	}
	cachedDatabases.clear();
}
//#endregion
export { getNodeSqliteKysely as _, repairOpenClawStateDatabaseSchema as a, resolveOpenClawStateSqlitePath as c, resolveSqliteDatabaseFilePaths as d, applyPrivateModeSync as f, executeSqliteQueryTakeFirstSync as g, executeSqliteQuerySync as h, openOpenClawStateDatabase as i, readSqliteUserVersion as l, clearNodeSqliteKyselyCacheForDatabase as m, closeOpenClawStateDatabase as n, runOpenClawStateWriteTransaction as o, requireNodeSqlite as p, detectOpenClawStateDatabaseSchemaMigrations as r, resolveOpenClawStateSqliteDir as s, OPENCLAW_SQLITE_BUSY_TIMEOUT_MS as t, runSqliteImmediateTransactionSync as u };
