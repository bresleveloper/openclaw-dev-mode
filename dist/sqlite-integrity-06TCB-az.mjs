import { f as toStringifiedError } from "./error-coercion-BwMr25F8.mjs";
import { M as recordSqliteDatabaseIntegrity, it as findSqlClosingParenthesis, st as normalizeSchemaSql } from "./sqlite-database-admission-CqdNF9iE.mjs";
import { h as captureSqliteSchemaFacts } from "./sqlite-schema-facts-C8u_9Af1.mjs";
import { r as openNodeSqliteDatabase } from "./node-sqlite-CYaq-2Hb.mjs";
import { i as isSqliteCorruptionError } from "./sqlite-error-diagnostics-BBfTUJBR.mjs";
import { a as sameSqliteFileGeneration, i as readStableSqliteFileGeneration } from "./sqlite-file-generation-Cmk6kG35.mjs";
import { performance } from "node:perf_hooks";
//#region src/infra/sqlite-integrity.ts
/** The gate includes the driver's check, awaited lifetime, and admission revalidation. */
function* sqliteIntegrityCheckSteps(database, databaseLabel, diagnostics) {
	const startedAt = performance.now();
	const check = {
		database,
		databaseLabel
	};
	if (diagnostics) {
		check.timing = {};
		diagnostics.integrityGateMode = "full";
		delete diagnostics.integrityCheckSyncMs;
		delete diagnostics.integrityOutsideCheckMs;
		delete diagnostics.integrityWorkerCheckMs;
		delete diagnostics.integrityWorkerLifetimeMs;
		delete diagnostics.integrityOutsideWorkerMs;
	}
	try {
		yield check;
		if (diagnostics) diagnostics.integrityGateOutcome = "healthy";
	} catch (error) {
		if (diagnostics) diagnostics.integrityGateOutcome = "failed";
		throw error;
	} finally {
		if (diagnostics) {
			diagnostics.integrityGateMs = Math.floor(performance.now() - startedAt);
			if (check.timing?.syncElapsedMs !== void 0) {
				diagnostics.integrityCheckSyncMs = Math.floor(check.timing.syncElapsedMs);
				diagnostics.integrityOutsideCheckMs = diagnostics.integrityGateMs - diagnostics.integrityCheckSyncMs;
			}
			if (check.timing?.workerCheckElapsedMs !== void 0) diagnostics.integrityWorkerCheckMs = Math.floor(check.timing.workerCheckElapsedMs);
			if (check.timing?.workerLifetimeElapsedMs !== void 0) {
				diagnostics.integrityWorkerLifetimeMs = Math.floor(check.timing.workerLifetimeElapsedMs);
				diagnostics.integrityOutsideWorkerMs = diagnostics.integrityGateMs - diagnostics.integrityWorkerLifetimeMs;
			}
		}
	}
}
/** Measure only the calling driver's synchronous check, excluding admission and resumption. */
function runSqliteIntegrityCheckSync(check) {
	const timing = check.timing;
	const startedAt = timing ? performance.now() : 0;
	try {
		assertSqliteIntegrity(check.database, check.databaseLabel);
	} finally {
		if (timing) timing.syncElapsedMs = performance.now() - startedAt;
	}
}
/** Run the same admission steps synchronously when the caller cannot yield. */
function runSqliteIntegrityOperationSync(operation, beforeResume, repairIntegrityError) {
	beforeResume?.();
	let step = operation.next();
	while (!step.done) {
		let failure;
		try {
			runSqliteIntegrityCheckSync(step.value);
		} catch (error) {
			failure = { error };
		}
		beforeResume?.();
		if (failure && repairIntegrityError) {
			const original = failure.error;
			try {
				if (repairIntegrityError(step.value, original)) failure = void 0;
			} catch (repairError) {
				if (original instanceof Error) original.message += ` Startup FTS repair failed: ${String(repairError)}`;
			}
		}
		step = failure ? operation.throw(failure.error) : operation.next();
	}
	return step.value;
}
const MAX_REPORTED_FOREIGN_KEY_VIOLATIONS = 5;
var SqliteRepairableForeignKeyError = class extends Error {
	constructor(databaseLabel, orphanCount) {
		super(`SQLite foreign_key_check failed for ${databaseLabel}: repairable task_delivery_state.task_id references task_runs.task_id cascade-owned orphans (${orphanCount} rows). Run openclaw doctor --fix to migrate this legacy state before retrying.`);
		this.name = "SqliteRepairableForeignKeyError";
		this.repair = {
			kind: "task-delivery-orphans",
			relation: "task_delivery_state.task_id",
			parentTable: "task_runs",
			orphanCount
		};
	}
};
/** Return whether a named integrity failure proves persistent database damage. */
function isTerminalSqliteIntegrityError(error) {
	if (error.name !== "SqliteIntegrityError") return false;
	if (!error.cause) return true;
	return isSqliteCorruptionError(error.cause);
}
/** Require structural, table/index, and referential consistency before trusting a database. */
function assertSqliteIntegrity(database, databaseLabel, options = "integrity_check") {
	const check = typeof options === "string" ? options : "integrity_check";
	const settings = typeof options === "object" ? options : {};
	let staleFts = false;
	try {
		runSqliteCheck(database, databaseLabel, check, void 0, settings.allFindings || settings.ftsSchemas !== void 0);
	} catch (error) {
		if (!settings.ftsSchemas || !(error instanceof SqliteIntegrityError) || !error.findings || !classifySqliteFtsIntegrityFindings(database, error.findings, settings.ftsSchemas)) throw error;
		staleFts = true;
	}
	runSqliteForeignKeyCheck(database, databaseLabel);
	if (check === "integrity_check" && !staleFts) recordSqliteDatabaseIntegrity(database);
	return { integrityCheck: "ok" };
}
/** Only exact, owned FTS definitions may treat their inverted index as derived data. */
function classifySqliteFtsIntegrityFindings(database, findings, schemas) {
	const names = /* @__PURE__ */ new Set();
	for (const finding of findings) {
		if (finding === "ok") continue;
		const match = typeof finding === "string" ? /^malformed inverted index for FTS5 table main\.([A-Za-z_][A-Za-z0-9_]*)$/u.exec(finding) : null;
		if (!match?.[1]) return;
		names.add(match[1]);
	}
	if (names.size === 0) return;
	const definitions = /* @__PURE__ */ new Map();
	for (const schema of schemas) for (const match of schema.matchAll(/CREATE VIRTUAL TABLE (?:IF NOT EXISTS )?([A-Za-z_][A-Za-z0-9_]*) USING fts5\s*\(/gu)) {
		const name = match[1];
		const end = findSqlClosingParenthesis(schema, match.index + match[0].length - 1);
		const variants = definitions.get(name) ?? /* @__PURE__ */ new Set();
		variants.add(normalizeSchemaSql(schema.slice(match.index, end + 1)));
		definitions.set(name, variants);
	}
	const tables = captureSqliteSchemaFacts(database).tableSql;
	for (const name of names) {
		const sql = tables.get(name);
		if (typeof sql !== "string" || !definitions.get(name)?.has(normalizeSchemaSql(sql))) return;
	}
	return [...names].toSorted();
}
/** Reconfirm an advisory failure against the database currently at a closed path. */
function confirmSqliteFileIntegrity(pathname, databaseLabel) {
	for (let attempt = 0; attempt < 3; attempt += 1) {
		let initial;
		let database;
		try {
			initial = readStableSqliteFileGeneration(pathname);
			database = openNodeSqliteDatabase(pathname, { readOnly: true });
		} catch (error) {
			return unboundSqliteIntegrityFailure(error);
		}
		let opened;
		try {
			opened = readStableSqliteFileGeneration(pathname);
		} catch {}
		if (!opened || !sameSqliteFileGeneration(initial, opened)) {
			const closeError = closeSqliteDatabase(database);
			if (closeError) return unboundSqliteIntegrityFailure(closeError);
			continue;
		}
		let confirmation;
		try {
			assertSqliteIntegrity(database, databaseLabel);
			confirmation = { status: "healthy" };
		} catch (error) {
			confirmation = failedSqliteIntegrityConfirmation(error);
		}
		const closeError = closeSqliteDatabase(database);
		if (closeError && confirmation.status === "healthy") confirmation = failedSqliteIntegrityConfirmation(closeError);
		let final;
		try {
			final = readStableSqliteFileGeneration(pathname);
		} catch {
			continue;
		}
		if (!sameSqliteFileGeneration(opened, final)) continue;
		if (confirmation.status === "healthy") return {
			status: "healthy",
			generation: final
		};
		return confirmation.terminal ? {
			...confirmation,
			generation: final,
			terminal: true
		} : {
			...confirmation,
			terminal: false
		};
	}
	return unboundSqliteIntegrityFailure(/* @__PURE__ */ new Error(`SQLite file generation did not stabilize during confirmation: ${pathname}`));
}
function failedSqliteIntegrityConfirmation(error) {
	const normalized = toStringifiedError(error);
	return {
		status: "failed",
		error: normalized,
		terminal: isTerminalSqliteIntegrityError(normalized)
	};
}
function unboundSqliteIntegrityFailure(error) {
	return {
		status: "failed",
		error: toStringifiedError(error),
		terminal: false
	};
}
function closeSqliteDatabase(database) {
	try {
		database.close();
		return;
	} catch (error) {
		return toStringifiedError(error);
	}
}
/** Require table and associated index consistency before trusting indexed reads. */
function assertSqliteTableIntegrity(database, databaseLabel, tableName) {
	runSqliteCheck(database, `${databaseLabel} table ${tableName}`, "integrity_check", tableName);
}
/** Maintenance must see every finding before deciding that only derived indexes need repair. */
function readSqliteIntegrityFindings(database) {
	return readSqliteCheckFindings(database, "integrity_check", void 0, true);
}
function readSqliteCheckFindings(database, pragma, tableName, allFindings = false) {
	const argument = tableName ? `('${tableName.replaceAll("'", "''")}')` : allFindings ? "(2147483647)" : "";
	return database.prepare(`PRAGMA ${pragma}${argument};`).all().map((row) => row[pragma] ?? Object.values(row)[0]);
}
function runSqliteCheck(database, databaseLabel, pragma, tableName, allFindings = false) {
	let results;
	try {
		results = readSqliteCheckFindings(database, pragma, tableName, allFindings);
	} catch (error) {
		throw new SqliteIntegrityError(`SQLite ${pragma} failed for ${databaseLabel}: ${error instanceof Error ? error.message : String(error)}`, error);
	}
	if (results.length === 1 && results[0] === "ok") return "ok";
	throw new SqliteIntegrityError(`SQLite ${pragma} failed for ${databaseLabel}: ${results.map((result) => String(result)).join("; ") || "no result"}`, void 0, results);
}
function runSqliteForeignKeyCheck(database, databaseLabel) {
	let violationCount = 0;
	let repairable = true;
	let taskDeliveryForeignKeyId;
	const violations = [];
	try {
		const statement = database.prepare("PRAGMA foreign_key_check;");
		statement.setReadBigInts(true);
		for (const violation of statement.iterate()) {
			violationCount += 1;
			retainSortedForeignKeyViolation(violations, violation);
			if (repairable) {
				if (violation.table === "task_delivery_state" && violation.parent === "task_runs") {
					taskDeliveryForeignKeyId ??= readTaskDeliveryCascadeForeignKeyId(database);
					repairable = violation.fkid === taskDeliveryForeignKeyId;
				} else repairable = false;
			}
		}
	} catch (error) {
		throw new SqliteIntegrityError(`SQLite foreign_key_check failed for ${databaseLabel}: ${error instanceof Error ? error.message : String(error)}`, error);
	}
	if (violations.length === 0) return;
	if (repairable) throw new SqliteRepairableForeignKeyError(databaseLabel, violationCount);
	const details = violations.map(formatSqliteForeignKeyViolation);
	if (violationCount > MAX_REPORTED_FOREIGN_KEY_VIOLATIONS) details.push("additional violations omitted");
	throw new SqliteIntegrityError(`SQLite foreign_key_check failed for ${databaseLabel}: ${details.join("; ")}`);
}
function readTaskDeliveryCascadeForeignKeyId(database) {
	const statement = database.prepare("PRAGMA foreign_key_list(task_delivery_state);");
	statement.setReadBigInts(true);
	const foreignKeys = statement.all();
	const taskKey = foreignKeys.find((key) => key.table === "task_runs" && key.from === "task_id" && key.to === "task_id" && key.on_delete === "CASCADE");
	return taskKey && typeof taskKey.id === "bigint" && foreignKeys.filter((key) => key.id === taskKey.id).length === 1 ? taskKey.id : void 0;
}
var SqliteIntegrityError = class extends Error {
	constructor(message, cause, findings) {
		super(cause === void 0 ? `${message}. Stop the Gateway, run "openclaw doctor --fix" to inspect and repair this database, and restart. Only if Doctor still cannot repair the offline database, preserve the database and WAL and restore a verified backup.` : message, cause === void 0 ? void 0 : { cause });
		this.findings = findings;
		this.name = "SqliteIntegrityError";
	}
};
function retainSortedForeignKeyViolation(retained, violation) {
	retained.push(violation);
	retained.sort(compareSqliteForeignKeyViolations);
	if (retained.length > MAX_REPORTED_FOREIGN_KEY_VIOLATIONS) retained.pop();
}
function compareSqliteForeignKeyViolations(left, right) {
	const tableOrder = Buffer.compare(Buffer.from(left.table), Buffer.from(right.table));
	if (tableOrder !== 0) return tableOrder;
	if (left.rowid === null || right.rowid === null) {
		if (left.rowid !== right.rowid) return left.rowid === null ? -1 : 1;
	} else if (left.rowid !== right.rowid) return left.rowid < right.rowid ? -1 : 1;
	const parentOrder = Buffer.compare(Buffer.from(left.parent), Buffer.from(right.parent));
	if (parentOrder !== 0) return parentOrder;
	if (left.fkid === right.fkid) return 0;
	return left.fkid < right.fkid ? -1 : 1;
}
function formatSqliteForeignKeyViolation(violation) {
	const row = violation.rowid === null ? "row without rowid" : `row ${violation.rowid.toString()}`;
	return `${violation.table} ${row} references ${violation.parent} (foreign key ${violation.fkid.toString()})`;
}
//#endregion
export { classifySqliteFtsIntegrityFindings as a, readSqliteIntegrityFindings as c, sqliteIntegrityCheckSteps as d, assertSqliteTableIntegrity as i, runSqliteIntegrityCheckSync as l, SqliteRepairableForeignKeyError as n, confirmSqliteFileIntegrity as o, assertSqliteIntegrity as r, isTerminalSqliteIntegrityError as s, SqliteIntegrityError as t, runSqliteIntegrityOperationSync as u };
