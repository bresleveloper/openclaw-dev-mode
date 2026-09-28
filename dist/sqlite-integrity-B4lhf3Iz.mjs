import { d as toStringifiedError } from "./error-coercion-C787aVxk.mjs";
import { t as openNodeSqliteDatabase } from "./node-sqlite-BO6jRFcG.mjs";
import { i as isSqliteCorruptionError } from "./sqlite-error-diagnostics-C8UyxYRx.mjs";
import { i as sameSqliteFileGeneration, r as readStableSqliteFileGeneration } from "./sqlite-file-generation-bF3ZcoQs.mjs";
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
function runSqliteIntegrityOperationSync(operation) {
	let step = operation.next();
	while (!step.done) {
		try {
			runSqliteIntegrityCheckSync(step.value);
		} catch (error) {
			step = operation.throw(error);
			continue;
		}
		step = operation.next();
	}
	return step.value;
}
const MAX_REPORTED_FOREIGN_KEY_VIOLATIONS = 5;
var SqliteRepairableForeignKeyError = class extends Error {
	constructor(databaseLabel, orphanCount) {
		super(`SQLite foreign_key_check failed for ${databaseLabel}: repairable task_delivery_state.task_id references task_runs.task_id cascade-owned orphans (${orphanCount} rows). Run openclaw doctor --fix to preserve and repair these rows before retrying.`);
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
function assertSqliteIntegrity(database, databaseLabel, check = "integrity_check") {
	const integrityCheck = runSqliteCheck(database, databaseLabel, check);
	runSqliteForeignKeyCheck(database, databaseLabel);
	return { integrityCheck };
}
/** Run integrity checks and preserve whether a failure proves persistent damage. */
function confirmSqliteIntegrity(database, databaseLabel) {
	try {
		assertSqliteIntegrity(database, databaseLabel);
		return { status: "healthy" };
	} catch (error) {
		return failedSqliteIntegrityConfirmation(error);
	}
}
/** Reconfirm an advisory failure against the database currently at a closed path. */
function confirmSqliteFileIntegrity(pathname, databaseLabel) {
	for (let attempt = 0; attempt < 3; attempt += 1) {
		let initial;
		try {
			initial = readStableSqliteFileGeneration(pathname);
		} catch (error) {
			return unboundSqliteIntegrityFailure(error);
		}
		let database;
		try {
			database = openNodeSqliteDatabase(pathname, { readOnly: true });
		} catch (error) {
			return unboundSqliteIntegrityFailure(error);
		}
		let opened;
		try {
			opened = readStableSqliteFileGeneration(pathname);
		} catch {
			const closeError = closeSqliteDatabase(database);
			if (closeError) return unboundSqliteIntegrityFailure(closeError);
			continue;
		}
		if (!sameSqliteFileGeneration(initial, opened)) {
			const closeError = closeSqliteDatabase(database);
			if (closeError) return unboundSqliteIntegrityFailure(closeError);
			continue;
		}
		let confirmation = confirmSqliteIntegrity(database, databaseLabel);
		const closeError = closeSqliteDatabase(database);
		if (closeError && confirmation.status === "healthy") confirmation = failedSqliteIntegrityConfirmation(closeError);
		let final;
		try {
			final = readStableSqliteFileGeneration(pathname);
		} catch {
			continue;
		}
		if (!sameSqliteFileGeneration(opened, final)) continue;
		return bindSqliteIntegrityConfirmation(confirmation, final);
	}
	return unboundSqliteIntegrityFailure(/* @__PURE__ */ new Error(`SQLite file generation did not stabilize during confirmation: ${pathname}`));
}
function bindSqliteIntegrityConfirmation(confirmation, generation) {
	if (confirmation.status === "healthy") return {
		status: "healthy",
		generation
	};
	if (confirmation.terminal) return {
		...confirmation,
		generation,
		terminal: true
	};
	return {
		...confirmation,
		terminal: false
	};
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
function runSqliteCheck(database, databaseLabel, pragma, tableName) {
	const argument = tableName ? `('${tableName.replaceAll("'", "''")}')` : "";
	let rows;
	try {
		rows = database.prepare(`PRAGMA ${pragma}${argument};`).all();
	} catch (error) {
		throw createSqliteIntegrityError(`SQLite ${pragma} failed for ${databaseLabel}: ${error instanceof Error ? error.message : String(error)}`, error);
	}
	const results = rows.map((row) => row[pragma] ?? Object.values(row)[0]);
	if (results.length === 1 && results[0] === "ok") return "ok";
	throw createSqliteIntegrityError(`SQLite ${pragma} failed for ${databaseLabel}: ${results.map((result) => String(result)).join("; ") || "no result"}`);
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
		throw createSqliteIntegrityError(`SQLite foreign_key_check failed for ${databaseLabel}: ${error instanceof Error ? error.message : String(error)}`, error);
	}
	if (violations.length === 0) return;
	if (repairable) throw new SqliteRepairableForeignKeyError(databaseLabel, violationCount);
	const details = violations.map(formatSqliteForeignKeyViolation);
	if (violationCount > MAX_REPORTED_FOREIGN_KEY_VIOLATIONS) details.push("additional violations omitted");
	throw createSqliteIntegrityError(`SQLite foreign_key_check failed for ${databaseLabel}: ${details.join("; ")}`);
}
function readTaskDeliveryCascadeForeignKeyId(database) {
	const statement = database.prepare("PRAGMA foreign_key_list(task_delivery_state);");
	statement.setReadBigInts(true);
	const foreignKeys = statement.all();
	const taskKey = foreignKeys.find((key) => key.table === "task_runs" && key.from === "task_id" && key.to === "task_id" && key.on_delete === "CASCADE");
	return taskKey && typeof taskKey.id === "bigint" && foreignKeys.filter((key) => key.id === taskKey.id).length === 1 ? taskKey.id : void 0;
}
function createSqliteIntegrityError(message, cause) {
	const error = cause === void 0 ? new Error(message) : new Error(message, { cause });
	error.name = "SqliteIntegrityError";
	return error;
}
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
export { isTerminalSqliteIntegrityError as a, sqliteIntegrityCheckSteps as c, confirmSqliteFileIntegrity as i, assertSqliteIntegrity as n, runSqliteIntegrityCheckSync as o, assertSqliteTableIntegrity as r, runSqliteIntegrityOperationSync as s, SqliteRepairableForeignKeyError as t };
