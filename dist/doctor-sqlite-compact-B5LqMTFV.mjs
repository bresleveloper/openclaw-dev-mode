import { t as openNodeSqliteDatabase } from "./node-sqlite-BO6jRFcG.mjs";
import "./openclaw-state-db-contract-dESpOAuZ.mjs";
import { n as assertSqliteIntegrity } from "./sqlite-integrity-B4lhf3Iz.mjs";
import "./openclaw-state-db-BFK9cMiV.mjs";
import fs from "node:fs";
//#region src/commands/doctor-sqlite-compact.ts
/** Shared doctor-only SQLite compaction mechanics. */
/**
* Compact one SQLite file during an explicit offline doctor operation.
*
* Validation runs before the first checkpoint because checkpointing mutates
* the database files. A busy checkpoint is a hard failure, never partial
* success, so VACUUM cannot race an active reader or writer.
*/
function compactDoctorSqliteFile(options) {
	const database = openNodeSqliteDatabase(options.sqlitePath);
	let operationError;
	let result;
	try {
		database.exec(`PRAGMA busy_timeout = ${options.busyTimeoutMs ?? 5e3};`);
		database.exec("PRAGMA trusted_schema = OFF;");
		options.validateBeforeMutation?.(database);
		const before = readCompactSnapshot(database, options.sqlitePath);
		let { integrityCheck } = assertSqliteIntegrity(database, options.sqlitePath);
		if (!(options.operation === "import-finalize" && before.autoVacuum === 2 && before.freelistPages === 0 && before.walSizeBytes === 0)) {
			checkpointDoctorSqliteFile(database, options.sqlitePath);
			database.exec("PRAGMA auto_vacuum = INCREMENTAL;");
			database.exec(options.operation === "import-finalize" && before.autoVacuum !== 0 ? "PRAGMA incremental_vacuum;" : "VACUUM;");
			checkpointDoctorSqliteFile(database, options.sqlitePath);
			({integrityCheck} = assertSqliteIntegrity(database, options.sqlitePath));
		}
		const after = readCompactSnapshot(database, options.sqlitePath);
		const beforeBytes = before.dbSizeBytes + before.walSizeBytes;
		const afterBytes = after.dbSizeBytes + after.walSizeBytes;
		result = {
			after,
			before,
			integrityCheck,
			reclaimedBytes: Math.max(0, beforeBytes - afterBytes)
		};
	} catch (error) {
		operationError = error;
	}
	try {
		database.close();
	} catch (error) {
		operationError ??= error;
	}
	if (operationError === void 0 && result) try {
		options.afterSuccess?.();
	} catch (error) {
		operationError ??= error;
	}
	if (operationError !== void 0) throw operationError instanceof Error ? operationError : /* @__PURE__ */ new Error("SQLite compaction failed with a non-Error value.");
	if (!result) throw new Error(`SQLite compaction produced no result for ${options.sqlitePath}.`);
	return result;
}
function checkpointDoctorSqliteFile(database, sqlitePath) {
	const row = database.prepare("PRAGMA wal_checkpoint(TRUNCATE);").get();
	const busy = readFiniteNumber(row?.busy ?? (row ? Object.values(row)[0] : void 0));
	if (busy === void 0) throw new Error(`SQLite checkpoint returned an invalid result for ${sqlitePath}.`);
	if (busy !== 0) throw new Error(`SQLite checkpoint remained busy for ${sqlitePath}. Stop OpenClaw and retry.`);
}
function readCompactSnapshot(database, sqlitePath) {
	return {
		autoVacuum: readPragmaNumber(database, "auto_vacuum"),
		dbSizeBytes: fileSize(sqlitePath),
		freelistPages: readPragmaNumber(database, "freelist_count"),
		pageSizeBytes: readPragmaNumber(database, "page_size"),
		walSizeBytes: fileSize(`${sqlitePath}-wal`)
	};
}
function readPragmaNumber(database, pragmaName) {
	const row = database.prepare(`PRAGMA ${pragmaName};`).get();
	const value = readFiniteNumber(row?.[pragmaName] ?? (row ? Object.values(row)[0] : void 0));
	if (value === void 0) throw new Error(`SQLite PRAGMA ${pragmaName} returned an invalid result.`);
	return value;
}
function readFiniteNumber(value) {
	if (typeof value === "number" && Number.isFinite(value)) return value;
	if (typeof value === "bigint") {
		const numberValue = Number(value);
		return Number.isFinite(numberValue) ? numberValue : void 0;
	}
}
function fileSize(filePath) {
	try {
		return fs.statSync(filePath).size;
	} catch (error) {
		if (error.code === "ENOENT") return 0;
		throw error;
	}
}
//#endregion
export { compactDoctorSqliteFile as n, checkpointDoctorSqliteFile as t };
