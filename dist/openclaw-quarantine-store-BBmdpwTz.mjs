import { t as hasErrnoCode } from "./errno-CkbDOfLk.mjs";
import { t as VERSION } from "./version-BkM1aB4w.mjs";
import { i as getNodeSqliteKysely, n as executeSqliteQuerySync, r as executeSqliteQueryTakeFirstSync } from "./kysely-sync-Bn6Qrpbz.mjs";
import { t as openNodeSqliteDatabase } from "./node-sqlite-BO6jRFcG.mjs";
import { t as applyPrivateModeSync } from "./private-mode-B6dWGRb2.mjs";
import { o as runSqliteImmediateTransactionSync } from "./sqlite-transaction-DKSXLQhb.mjs";
import { a as OPENCLAW_DATABASE_SCHEMA_DOCS_URL } from "./openclaw-state-db-contract-dESpOAuZ.mjs";
import { a as serializeSqliteFileGeneration, i as sameSqliteFileGeneration, r as readStableSqliteFileGeneration, t as parseSqliteFileGeneration } from "./sqlite-file-generation-bF3ZcoQs.mjs";
import { n as OpenClawQuarantineReadCleanupError } from "./openclaw-quarantine-error-C9XbnAvW.mjs";
import { o as resolveOpenClawStateSqliteDir } from "./openclaw-state-db.paths-DYMh54HD.mjs";
import { existsSync, mkdirSync, realpathSync, statSync } from "node:fs";
import path from "node:path";
//#region src/state/openclaw-quarantine-store.ts
const OPENCLAW_QUARANTINE_SCHEMA_VERSION = 2;
const OPENCLAW_QUARANTINE_BUSY_TIMEOUT_MS = 5e3;
const OPENCLAW_QUARANTINE_DIR_MODE = 448;
const OPENCLAW_QUARANTINE_FILE_MODE = 384;
function resolveAgentIntegrityPath(pathname) {
	try {
		return realpathSync.native(pathname);
	} catch (error) {
		if (!hasErrnoCode(error, "ENOENT")) throw error;
		return path.resolve(pathname);
	}
}
/** The lease owner consumes this receipt under the shared writer admission. */
function readOpenClawAgentIntegrityVerification(pathname, env = process.env, consume = false) {
	const read = (database) => {
		const query = getNodeSqliteKysely(database);
		const row = executeSqliteQueryTakeFirstSync(database, query.selectFrom("agent_integrity_verifications").selectAll().where("path", "=", resolveAgentIntegrityPath(pathname)));
		if (consume) {
			const current = statSync(pathname, {
				bigint: true,
				throwIfNoEntry: false
			});
			executeSqliteQuerySync(database, query.updateTable("agent_integrity_verifications").set({ clean_close: 0 }).where((eb) => eb.or([eb("path", "=", resolveAgentIntegrityPath(pathname)), ...current ? [eb.and([eb("dev", "=", String(current.dev)), eb("ino", "=", String(current.ino))])] : []])));
		}
		return row;
	};
	if (consume) return withQuarantineWriter(env, (database) => runSqliteImmediateTransactionSync(database, () => read(database)));
	const storePath = resolveQuarantineStorePath(env);
	if (!existsSync(storePath)) return;
	let database;
	try {
		database = openNodeSqliteDatabase(storePath, { readOnly: true });
		return read(database);
	} catch {
		return;
	} finally {
		database?.close();
	}
}
function canReuseOpenClawAgentIntegrityVerification(pathname, record, migrationPending, reuseRuntimeIntegrity = false) {
	if (migrationPending || !record || !reuseRuntimeIntegrity && record.clean_close !== 1 || record.app_version !== VERSION || record.path !== resolveAgentIntegrityPath(pathname)) return false;
	const current = statSync(pathname, {
		bigint: true,
		throwIfNoEntry: false
	});
	return current !== void 0 && record.dev === String(current.dev) && record.ino === String(current.ino);
}
/** Record the lease owner's full check without certifying a clean close. */
function recordOpenClawAgentIntegrityVerification(pathname, env, identity) {
	const current = statSync(pathname, {
		bigint: true,
		throwIfNoEntry: false
	});
	if (!current || identity !== `${current.dev}:${current.ino}`) return;
	const dev = String(current.dev);
	const ino = String(current.ino);
	withQuarantineWriter(env, (database) => {
		const query = getNodeSqliteKysely(database);
		executeSqliteQuerySync(database, query.insertInto("agent_integrity_verifications").values({
			path: resolveAgentIntegrityPath(pathname),
			dev,
			ino,
			app_version: VERSION,
			verified_at: Date.now(),
			clean_close: 0
		}).onConflict((conflict) => conflict.column("path").doUpdateSet({
			dev,
			ino,
			app_version: VERSION,
			verified_at: Date.now(),
			clean_close: 0
		})));
	});
}
/** Unclean disposal removes the proof that any surviving last closer could certify. */
function clearOpenClawAgentIntegrityVerification(pathname, env = process.env) {
	withQuarantineWriter(env, (database) => runSqliteImmediateTransactionSync(database, () => deleteAgentIntegrityVerification(database, pathname)));
}
function deleteAgentIntegrityVerification(database, pathname) {
	const query = getNodeSqliteKysely(database);
	const stored = executeSqliteQueryTakeFirstSync(database, query.selectFrom("agent_integrity_verifications").select(["dev", "ino"]).where("path", "=", resolveAgentIntegrityPath(pathname)));
	const current = statSync(pathname, {
		bigint: true,
		throwIfNoEntry: false
	});
	executeSqliteQuerySync(database, query.deleteFrom("agent_integrity_verifications").where((eb) => eb.or([eb("path", "=", resolveAgentIntegrityPath(pathname)), ...[stored, current].flatMap((file) => file ? [eb.and([eb("dev", "=", String(file.dev)), eb("ino", "=", String(file.ino))])] : [])])));
}
/** Only the last graceful lease release may publish cleanliness. */
function markOpenClawAgentIntegrityClean(pathname, env, identity) {
	const current = statSync(pathname, {
		bigint: true,
		throwIfNoEntry: false
	});
	if (!current || identity !== `${current.dev}:${current.ino}`) return;
	withQuarantineWriter(env, (database) => {
		const query = getNodeSqliteKysely(database);
		executeSqliteQuerySync(database, query.updateTable("agent_integrity_verifications").set({ clean_close: 1 }).where("path", "=", resolveAgentIntegrityPath(pathname)).where("dev", "=", String(current.dev)).where("ino", "=", String(current.ino)).where("app_version", "=", VERSION));
	});
}
function createOpenClawDatabaseVerificationError(kind, pathname, storedError) {
	const error = /* @__PURE__ */ new Error(`OpenClaw ${kind} database ${pathname} is quarantined after integrity verification failed: ${storedError ?? "unknown integrity error"}. Restore the database from a backup or repair it, then run openclaw doctor --fix to clear the quarantine. See ${OPENCLAW_DATABASE_SCHEMA_DOCS_URL}.`);
	error.name = "SqliteIntegrityError";
	return error;
}
function resolveQuarantineStorePath(env) {
	return path.join(resolveOpenClawStateSqliteDir(env), "openclaw-quarantine.sqlite");
}
function ensureQuarantineStoreDirectory(storePath) {
	const dir = path.dirname(storePath);
	mkdirSync(dir, {
		recursive: true,
		mode: OPENCLAW_QUARANTINE_DIR_MODE
	});
	applyPrivateModeSync(dir, OPENCLAW_QUARANTINE_DIR_MODE);
}
function configureQuarantineWriter(database, storePath) {
	database.exec(`
    PRAGMA busy_timeout = ${OPENCLAW_QUARANTINE_BUSY_TIMEOUT_MS};
    PRAGMA journal_mode = DELETE;
    PRAGMA synchronous = FULL;
  `);
	const userVersion = readQuarantineSchemaVersion(database, storePath);
	if (userVersion > OPENCLAW_QUARANTINE_SCHEMA_VERSION) throw new Error(`OpenClaw quarantine store ${storePath} uses newer schema version ${userVersion}.`);
	if (userVersion === OPENCLAW_QUARANTINE_SCHEMA_VERSION) return;
	if (userVersion === 1) {
		database.exec(`
      BEGIN IMMEDIATE;
      ALTER TABLE quarantined_databases ADD COLUMN verified_generation TEXT;
      PRAGMA user_version = ${OPENCLAW_QUARANTINE_SCHEMA_VERSION};
      COMMIT;
    `);
		return;
	}
	database.exec(`
    BEGIN IMMEDIATE;
    CREATE TABLE IF NOT EXISTS quarantined_databases (
      path TEXT NOT NULL PRIMARY KEY,
      kind TEXT NOT NULL,
      reason TEXT NOT NULL,
      quarantined_at INTEGER NOT NULL,
      writer_app_version TEXT,
      verified_generation TEXT
    ) STRICT;
    PRAGMA user_version = ${OPENCLAW_QUARANTINE_SCHEMA_VERSION};
    COMMIT;
  `);
}
function readQuarantineSchemaVersion(database, storePath) {
	const userVersion = database.prepare("PRAGMA user_version").get()?.user_version;
	if (typeof userVersion !== "number" || !Number.isInteger(userVersion)) throw new Error(`OpenClaw quarantine store ${storePath} has an invalid schema version.`);
	return userVersion;
}
function withQuarantineWriter(env, operation) {
	const storePath = resolveQuarantineStorePath(env);
	const existed = existsSync(storePath);
	ensureQuarantineStoreDirectory(storePath);
	const database = openNodeSqliteDatabase(storePath);
	let completed = false;
	try {
		if (!existed) applyPrivateModeSync(storePath, OPENCLAW_QUARANTINE_FILE_MODE);
		configureQuarantineWriter(database, storePath);
		database.exec(`CREATE TABLE IF NOT EXISTS agent_integrity_verifications (
      path TEXT NOT NULL PRIMARY KEY, dev TEXT NOT NULL, ino TEXT NOT NULL,
      app_version TEXT NOT NULL, verified_at INTEGER NOT NULL,
      clean_close INTEGER NOT NULL CHECK (clean_close IN (0, 1))
    ) STRICT;`);
		const result = operation(database);
		completed = true;
		return result;
	} finally {
		if (database.isOpen) database.close();
		if (completed || !existed) applyPrivateModeSync(storePath, OPENCLAW_QUARANTINE_FILE_MODE);
	}
}
/** Read one authoritative quarantine decision without creating the store. */
function readOpenClawDatabaseQuarantine(pathname, options = {}) {
	const storePath = resolveQuarantineStorePath(options.env ?? process.env);
	if (!existsSync(storePath)) return;
	const database = openNodeSqliteDatabase(storePath);
	let outcome;
	try {
		outcome = { value: readQuarantineDecision(database, pathname, storePath) };
	} catch (error) {
		outcome = { error };
	}
	try {
		database.close();
	} catch (closeError) {
		throw new OpenClawQuarantineReadCleanupError("error" in outcome ? [outcome.error, closeError] : [closeError], "value" in outcome ? outcome.value : void 0);
	}
	if ("error" in outcome) throw outcome.error;
	return outcome.value;
}
/** Reject a known state quarantine while retaining best-effort metadata admission. */
function assertOpenClawStateDatabaseNotQuarantined(pathname, env, onNativeCleanupFailure) {
	let quarantineFailure;
	try {
		quarantineFailure = readOpenClawDatabaseQuarantineFailure("state", pathname, { env });
	} catch (error) {
		if (!(error instanceof OpenClawQuarantineReadCleanupError)) throw error;
		onNativeCleanupFailure?.(error);
		return;
	}
	if (quarantineFailure?.cause instanceof OpenClawQuarantineReadCleanupError) onNativeCleanupFailure?.(quarantineFailure.cause);
	if (quarantineFailure) throw quarantineFailure;
}
function readQuarantineDecision(database, pathname, storePath) {
	database.exec(`PRAGMA busy_timeout = ${OPENCLAW_QUARANTINE_BUSY_TIMEOUT_MS};`);
	const userVersion = readQuarantineSchemaVersion(database, storePath);
	if (userVersion === 0) return;
	if (userVersion > OPENCLAW_QUARANTINE_SCHEMA_VERSION) throw new Error(`OpenClaw quarantine store ${storePath} uses newer schema version ${userVersion}.`);
	const generationColumn = userVersion >= 2 ? ", verified_generation" : "";
	const row = database.prepare(`SELECT kind, reason, quarantined_at${generationColumn} FROM quarantined_databases WHERE path = ? LIMIT 1`).get(path.resolve(pathname));
	if (!row) return;
	if (row.kind !== "agent" && row.kind !== "state" || typeof row.reason !== "string" || typeof row.quarantined_at !== "number" || !Number.isInteger(row.quarantined_at) || row.verified_generation !== void 0 && row.verified_generation !== null && typeof row.verified_generation !== "string") throw new Error(`OpenClaw quarantine store ${storePath} contains an invalid row.`);
	if (typeof row.verified_generation === "string") {
		let verifiedGeneration;
		try {
			verifiedGeneration = parseSqliteFileGeneration(row.verified_generation);
		} catch {
			throw new Error(`OpenClaw quarantine store ${storePath} contains an invalid row.`);
		}
		try {
			const currentGeneration = readStableSqliteFileGeneration(path.resolve(pathname));
			if (!sameSqliteFileGeneration(verifiedGeneration, currentGeneration)) return;
		} catch {
			return;
		}
	}
	return {
		kind: row.kind,
		quarantinedAt: row.quarantined_at,
		reason: row.reason
	};
}
/** Runtime opens refuse recorded damage while tolerating a broken quarantine index. */
function readOpenClawDatabaseQuarantineFailure(kind, pathname, options = {}) {
	let quarantine;
	let cleanupFailure;
	try {
		quarantine = readOpenClawDatabaseQuarantine(pathname, options);
	} catch (error) {
		if (!(error instanceof OpenClawQuarantineReadCleanupError)) return;
		if (!error.quarantine) throw error;
		quarantine = error.quarantine;
		cleanupFailure = error;
	}
	if (!quarantine) return;
	const failure = createOpenClawDatabaseVerificationError(kind, pathname, quarantine.reason);
	if (cleanupFailure) failure.cause = cleanupFailure;
	return failure;
}
/** Persist one authoritative quarantine decision. */
function recordOpenClawDatabaseQuarantine(options) {
	const serializedGeneration = options.generation ? serializeSqliteFileGeneration(options.generation) : null;
	try {
		return withQuarantineWriter(options.env ?? process.env, (database) => runSqliteImmediateTransactionSync(database, () => {
			database.prepare(`
              INSERT INTO quarantined_databases (
                path, kind, reason, quarantined_at, writer_app_version, verified_generation
              ) VALUES (?, ?, ?, ?, ?, ?)
              ON CONFLICT(path) DO UPDATE SET
                kind = excluded.kind,
                reason = excluded.reason,
                quarantined_at = excluded.quarantined_at,
                writer_app_version = excluded.writer_app_version,
                verified_generation = excluded.verified_generation
            `).run(path.resolve(options.path), options.kind, options.reason, Date.now(), VERSION, serializedGeneration);
			if (options.kind === "agent") deleteAgentIntegrityVerification(database, options.path);
			return true;
		}));
	} catch {
		return false;
	}
}
/** Clear one authoritative quarantine decision. */
function clearOpenClawDatabaseQuarantine(pathname, options = {}) {
	const env = options.env ?? process.env;
	if (!existsSync(resolveQuarantineStorePath(env))) return true;
	try {
		return withQuarantineWriter(env, (database) => runSqliteImmediateTransactionSync(database, () => {
			database.prepare("DELETE FROM quarantined_databases WHERE path = ?").run(path.resolve(pathname));
			deleteAgentIntegrityVerification(database, pathname);
			return true;
		}));
	} catch {
		return false;
	}
}
//#endregion
export { markOpenClawAgentIntegrityClean as a, recordOpenClawAgentIntegrityVerification as c, clearOpenClawDatabaseQuarantine as i, recordOpenClawDatabaseQuarantine as l, canReuseOpenClawAgentIntegrityVerification as n, readOpenClawAgentIntegrityVerification as o, clearOpenClawAgentIntegrityVerification as r, readOpenClawDatabaseQuarantineFailure as s, assertOpenClawStateDatabaseNotQuarantined as t, resolveQuarantineStorePath as u };
