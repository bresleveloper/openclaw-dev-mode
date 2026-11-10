import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { t as VERSION } from "./version-jg_14gWz.mjs";
import { l as resolveQuarantineStorePath } from "./openclaw-state-db.paths-D3nUb_uk.mjs";
import { o as OPENCLAW_DATABASE_SCHEMA_DOCS_URL } from "./openclaw-state-db-contract-QlwTsE6j.mjs";
import { m as applyPrivateModeSync } from "./gateway-state-owner-X3EqhtYx.mjs";
import { b as publishSqliteDatabaseAdmission, c as getSqliteDatabaseAdmission, g as invalidateSqliteDatabaseCleanClose, s as getOrLoadSqliteDatabaseAdmissionForPath, z as revokeSqliteDatabaseAdmissionsForPath } from "./sqlite-database-admission-CqdNF9iE.mjs";
import { r as openNodeSqliteDatabase } from "./node-sqlite-CYaq-2Hb.mjs";
import { a as sameSqliteFileGeneration, n as parseSqliteFileGeneration, o as serializeSqliteFileGeneration } from "./sqlite-file-generation-Cmk6kG35.mjs";
import { h as runSqliteReadOnlyWorkerSync, p as runSqliteReadOnlyWorker } from "./sqlite-readonly-worker-C2DDLw_y.mjs";
import { a as runSqliteImmediateTransactionSync } from "./sqlite-transaction-CpDyZPQ0.mjs";
import { x as OpenClawQuarantineReadCleanupError } from "./openclaw-state-worker-error-B93Lf_P2.mjs";
import { t as openSqliteReadOnlyDatabase } from "./sqlite-snapshot-source-DQdkM3YQ.mjs";
import { existsSync, mkdirSync } from "node:fs";
import path from "node:path";
//#region src/infra/sqlite-file-generation-worker.ts
/** Raw descriptor closes must not release a sibling connection's process-wide SQLite locks. */
function readSqliteFileGenerationSync(pathname) {
	return parseSqliteFileGeneration(runSqliteReadOnlyWorkerSync(pathname, void 0, "file-generation"));
}
async function readSqliteFileGeneration(pathname, signal) {
	return parseSqliteFileGeneration(await runSqliteReadOnlyWorker(pathname, {
		mode: "file-generation",
		signal
	}));
}
//#endregion
//#region src/state/openclaw-quarantine-store.ts
const OPENCLAW_QUARANTINE_SCHEMA_VERSION = 2;
const OPENCLAW_QUARANTINE_BUSY_TIMEOUT_MS = 5e3;
const OPENCLAW_QUARANTINE_DIR_MODE = 448;
const OPENCLAW_QUARANTINE_FILE_MODE = 384;
const quarantineSchemaAdmission = {
	name: "openclaw.quarantine.schema",
	schemaDependent: true,
	read(value) {
		if (typeof value !== "object" || value === null || !("version" in value) || typeof value.version !== "number") return;
		return { version: value.version };
	}
};
function quarantineDecisionAdmission(pathname) {
	return {
		name: `openclaw.quarantine.decision:${path.resolve(pathname)}`,
		read: (value) => value === null || isQuarantineDecision(value) ? value : void 0
	};
}
function isQuarantineDecision(value) {
	return isRecord(value) && (value.kind === "agent" || value.kind === "state") && typeof value.reason === "string" && typeof value.quarantinedAt === "number" && (value.verifiedGenerationJson === null || typeof value.verifiedGenerationJson === "string");
}
function configureQuarantineWriter(database, storePath) {
	database.exec(`
    PRAGMA journal_mode = DELETE;
    PRAGMA synchronous = FULL;
  `);
	const userVersion = readQuarantineSchemaVersion(database, storePath);
	if (userVersion === OPENCLAW_QUARANTINE_SCHEMA_VERSION) return;
	if (userVersion === 1) runSqliteImmediateTransactionSync(database, () => database.exec(`
      ALTER TABLE quarantined_databases ADD COLUMN verified_generation TEXT;
      PRAGMA user_version = ${OPENCLAW_QUARANTINE_SCHEMA_VERSION};
    `));
	else if (userVersion !== OPENCLAW_QUARANTINE_SCHEMA_VERSION) runSqliteImmediateTransactionSync(database, () => database.exec(`
    CREATE TABLE IF NOT EXISTS quarantined_databases (
      path TEXT NOT NULL PRIMARY KEY,
      kind TEXT NOT NULL,
      reason TEXT NOT NULL,
      quarantined_at INTEGER NOT NULL,
      writer_app_version TEXT,
      verified_generation TEXT
    ) STRICT;
    PRAGMA user_version = ${OPENCLAW_QUARANTINE_SCHEMA_VERSION};
    `));
	database.exec(`CREATE TABLE IF NOT EXISTS agent_integrity_verifications (
    path TEXT NOT NULL PRIMARY KEY, dev TEXT NOT NULL, ino TEXT NOT NULL,
    app_version TEXT NOT NULL, verified_at INTEGER NOT NULL,
    clean_close INTEGER NOT NULL CHECK (clean_close IN (0, 1))
  ) STRICT;`);
	publishSqliteDatabaseAdmission(database, quarantineSchemaAdmission, { version: OPENCLAW_QUARANTINE_SCHEMA_VERSION });
}
function readQuarantineSchemaVersion(database, storePath, fresh = false) {
	const admitted = fresh ? void 0 : getSqliteDatabaseAdmission(database, quarantineSchemaAdmission);
	if (admitted) return admitted.version;
	const userVersion = database.prepare("PRAGMA user_version").get()?.user_version;
	if (typeof userVersion !== "number" || !Number.isInteger(userVersion)) throw new Error(`OpenClaw quarantine store ${storePath} has an invalid schema version.`);
	if (userVersion > OPENCLAW_QUARANTINE_SCHEMA_VERSION) throw new Error(`OpenClaw quarantine store ${storePath} uses newer schema version ${userVersion}.`);
	if (userVersion !== 0) publishSqliteDatabaseAdmission(database, quarantineSchemaAdmission, { version: userVersion });
	return userVersion;
}
function withQuarantineWriter(env, operation) {
	const storePath = resolveQuarantineStorePath(env);
	const existed = existsSync(storePath);
	const dir = path.dirname(storePath);
	mkdirSync(dir, {
		recursive: true,
		mode: OPENCLAW_QUARANTINE_DIR_MODE
	});
	applyPrivateModeSync(dir, OPENCLAW_QUARANTINE_DIR_MODE);
	const database = openNodeSqliteDatabase(storePath, { timeout: OPENCLAW_QUARANTINE_BUSY_TIMEOUT_MS });
	let completed = false;
	try {
		if (!existed) applyPrivateModeSync(storePath, OPENCLAW_QUARANTINE_FILE_MODE);
		configureQuarantineWriter(database, storePath);
		const result = operation(database);
		completed = true;
		return result;
	} finally {
		if (database.isOpen) database.close();
		if (completed || !existed) applyPrivateModeSync(storePath, OPENCLAW_QUARANTINE_FILE_MODE);
	}
}
/** Its existence preserves prior state ownership even when an external agent is not configured. */
function ensureOpenClawQuarantineStore(env) {
	if (!existsSync(resolveQuarantineStorePath(env))) withQuarantineWriter(env, () => {});
}
/** Runtime guards share the owner's decision; explicit repair may inspect disk. */
function readOpenClawDatabaseQuarantine(pathname, options = {}) {
	const storePath = resolveQuarantineStorePath(options.env ?? process.env);
	const load = () => readPersistedQuarantineDecision(pathname, storePath, options.fresh) ?? null;
	const decision = options.fresh ? load() : getOrLoadSqliteDatabaseAdmissionForPath(storePath, quarantineDecisionAdmission(pathname), load);
	return decision ? resolveQuarantineDecision(decision, pathname, storePath) : void 0;
}
function readPersistedQuarantineDecision(pathname, storePath, fresh = false) {
	if (!existsSync(storePath)) return;
	const database = openSqliteReadOnlyDatabase(storePath, { timeout: OPENCLAW_QUARANTINE_BUSY_TIMEOUT_MS });
	let outcome;
	try {
		outcome = { value: readQuarantineDecision(database, pathname, storePath, fresh) };
	} catch (error) {
		outcome = { error };
	}
	try {
		database.close();
	} catch (closeError) {
		let quarantine;
		let readError = "error" in outcome ? outcome.error : void 0;
		if ("value" in outcome && outcome.value) try {
			quarantine = resolveQuarantineDecision(outcome.value, pathname, storePath);
		} catch (error) {
			readError = error;
		}
		throw new OpenClawQuarantineReadCleanupError(readError === void 0 ? [closeError] : [readError, closeError], quarantine);
	}
	if ("error" in outcome) throw outcome.error;
	return outcome.value;
}
function readQuarantineDecision(database, pathname, storePath, fresh = false) {
	const userVersion = readQuarantineSchemaVersion(database, storePath, fresh);
	if (userVersion === 0) return;
	const generationColumn = userVersion >= 2 ? ", verified_generation" : "";
	const row = database.prepare(`SELECT kind, reason, quarantined_at${generationColumn} FROM quarantined_databases WHERE path = ? LIMIT 1`).get(path.resolve(pathname));
	if (!row) return;
	const verifiedGenerationJson = userVersion >= 2 ? row.verified_generation : void 0;
	if (row.kind !== "agent" && row.kind !== "state" || typeof row.reason !== "string" || typeof row.quarantined_at !== "number" || !Number.isInteger(row.quarantined_at) || verifiedGenerationJson !== void 0 && verifiedGenerationJson !== null && typeof verifiedGenerationJson !== "string") throw new Error(`OpenClaw quarantine store ${storePath} contains an invalid row.`);
	return {
		kind: row.kind,
		quarantinedAt: row.quarantined_at,
		reason: row.reason,
		verifiedGenerationJson: typeof verifiedGenerationJson === "string" ? verifiedGenerationJson : null
	};
}
function resolveQuarantineDecision(decision, pathname, storePath) {
	if (decision.verifiedGenerationJson !== null) {
		let verifiedGeneration;
		try {
			verifiedGeneration = parseSqliteFileGeneration(decision.verifiedGenerationJson);
		} catch {
			throw new Error(`OpenClaw quarantine store ${storePath} contains an invalid row.`);
		}
		try {
			const currentGeneration = readSqliteFileGenerationSync(path.resolve(pathname));
			if (!sameSqliteFileGeneration(verifiedGeneration, currentGeneration)) return;
		} catch {
			return;
		}
	}
	return {
		kind: decision.kind,
		quarantinedAt: decision.quarantinedAt,
		reason: decision.reason
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
	const failure = /* @__PURE__ */ new Error(`OpenClaw ${kind} database ${pathname} is quarantined after integrity verification failed: ${quarantine.reason ?? "unknown integrity error"}. Restore the database from a backup or repair it, then run openclaw doctor --fix to clear the quarantine. See ${OPENCLAW_DATABASE_SCHEMA_DOCS_URL}.`);
	failure.name = "SqliteIntegrityError";
	if (cleanupFailure) failure.cause = cleanupFailure;
	return failure;
}
function recordOpenClawDatabaseQuarantine(options) {
	const serializedGeneration = options.generation ? serializeSqliteFileGeneration(options.generation) : null;
	const quarantinedAt = Date.now();
	try {
		const recorded = withQuarantineWriter(options.env ?? process.env, (database) => runSqliteImmediateTransactionSync(database, () => {
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
            `).run(path.resolve(options.path), options.kind, options.reason, quarantinedAt, VERSION, serializedGeneration);
			publishSqliteDatabaseAdmission(database, quarantineDecisionAdmission(options.path), {
				kind: options.kind,
				quarantinedAt,
				reason: options.reason,
				verifiedGenerationJson: serializedGeneration
			});
			return true;
		}, {
			databaseLabel: resolveQuarantineStorePath(options.env ?? process.env),
			operationLabel: "quarantine.record"
		}));
		if (recorded) revokeSqliteDatabaseAdmissionsForPath(options.path);
		return recorded;
	} catch {
		return false;
	}
}
function clearOpenClawDatabaseQuarantine(pathname, options = {}) {
	const env = options.env ?? process.env;
	try {
		invalidateSqliteDatabaseCleanClose(pathname);
		if (!existsSync(resolveQuarantineStorePath(env))) return true;
		return withQuarantineWriter(env, (database) => runSqliteImmediateTransactionSync(database, () => {
			database.prepare("DELETE FROM quarantined_databases WHERE path = ?").run(path.resolve(pathname));
			publishSqliteDatabaseAdmission(database, quarantineDecisionAdmission(pathname), null);
			return true;
		}, {
			databaseLabel: resolveQuarantineStorePath(env),
			operationLabel: "quarantine.clear"
		}));
	} catch {
		return false;
	}
}
//#endregion
export { readSqliteFileGeneration as a, recordOpenClawDatabaseQuarantine as i, ensureOpenClawQuarantineStore as n, readSqliteFileGenerationSync as o, readOpenClawDatabaseQuarantineFailure as r, clearOpenClawDatabaseQuarantine as t };
