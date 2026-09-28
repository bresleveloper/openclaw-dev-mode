import { i as extractErrorCode, t as coerceErrorMessage } from "./error-coercion-C787aVxk.mjs";
import { i as resolveGlobalSingleton } from "./global-singleton-Dc_stLtU.mjs";
import { c as isRecord, i as asOptionalObjectRecord } from "./record-coerce-DItp3I4t.mjs";
//#region src/infra/sqlite-error-diagnostics.ts
const STORAGE_ERRORS = [
	[
		"SQLITE_BUSY",
		"database is locked",
		5
	],
	[
		"SQLITE_LOCKED",
		"database table is locked",
		6
	],
	[
		"SQLITE_READONLY",
		"attempt to write a readonly database",
		8
	],
	[
		"SQLITE_IOERR",
		"disk I/O error",
		10
	],
	[
		"SQLITE_FULL",
		"database or disk is full",
		13
	],
	[
		"transcript_writer_fenced",
		"session writer claim changed before transcript persistence",
		-1
	]
];
/** Classify native errors before flattening; legacy rows require exact known messages. */
function classifyGatewayStorageFailure(error) {
	const fields = typeof error === "string" ? { message: error } : isRecord(error) ? error : {};
	const code = fields.errorCode ?? fields.code;
	const nativeCode = fields.errcode;
	const primaryCode = typeof nativeCode === "number" && Number.isInteger(nativeCode) && nativeCode >= 0 ? nativeCode & 255 : void 0;
	return (STORAGE_ERRORS.find(([name, , number]) => primaryCode === number || typeof code === "string" && (code === name || name.startsWith("SQLITE_") && code.startsWith(`${name}_`))) ?? STORAGE_ERRORS.find(([, message]) => [
		fields.errstr,
		fields.errorMessage,
		fields.message
	].some((value) => typeof value === "string" && value.trim() === message)))?.[0];
}
const SQLITE_INSPECTION_OPERATIONS = {
	coordinator: "acquiring its state-handles coordinator",
	source: "opening the source database",
	snapshot: "creating its private snapshot"
};
const inspectionOperations = resolveGlobalSingleton(Symbol.for("openclaw.sqliteInspectionOperations"), () => /* @__PURE__ */ new WeakMap());
const nativeOpenFailures = resolveGlobalSingleton(Symbol.for("openclaw.sqliteNativeOpenFailures"), () => /* @__PURE__ */ new WeakSet());
function markSqliteNativeOpenFailure(error) {
	if (error !== null && typeof error === "object") nativeOpenFailures.add(error);
}
/** Record the native effect without changing its error or tagging surrounding authority checks. */
function withSqliteNativeOpen(open) {
	try {
		return open();
	} catch (error) {
		markSqliteNativeOpenFailure(error);
		throw error;
	}
}
function isSqliteNativeOpenFailure(error) {
	return error !== null && typeof error === "object" && nativeOpenFailures.has(error);
}
function markSqliteInspectionOperation(error, operation) {
	if (error !== null && typeof error === "object" && !inspectionOperations.has(error)) inspectionOperations.set(error, operation);
	return error;
}
function withSqliteInspectionOperation(operation, run) {
	try {
		return run();
	} catch (error) {
		throw markSqliteInspectionOperation(error, operation);
	}
}
function formatSqliteReadOnlyInspectionFailure(error) {
	const message = coerceErrorMessage(error);
	const { suffix, operation } = readSqliteErrorDetails(error);
	const details = `${message}${suffix}`;
	return operation === void 0 ? details : `failed while ${SQLITE_INSPECTION_OPERATIONS[operation]}: ${details}`;
}
function formatSqliteErrorCodeSuffix(error) {
	return readSqliteErrorDetails(error).suffix;
}
function readSqliteErrorDetails(error) {
	const details = /* @__PURE__ */ new Set();
	let operation;
	for (let current = error, depth = 0; depth < 8 && isRecord(current); depth += 1) {
		operation = inspectionOperations.get(current) ?? operation;
		const code = extractErrorCode(current);
		if (code && /^[A-Z0-9_]{1,64}$/u.test(code)) details.add(`code=${code}`);
		const { errcode } = current;
		if (typeof errcode === "number" && Number.isInteger(errcode) && errcode >= 0 && errcode <= 2147483647) details.add(`errcode=${errcode}`);
		current = current.cause;
	}
	return {
		suffix: details.size > 0 ? ` (${[...details].join(", ")})` : "",
		operation
	};
}
const SQLITE_LOCK_ERROR_CODES = /* @__PURE__ */ new Set(["SQLITE_BUSY", "SQLITE_LOCKED"]);
const SQLITE_BUSY_RESULT_CODE = 5;
const SQLITE_LOCKED_RESULT_CODE = 6;
const SQLITE_CORRUPT_RESULT_CODE = 11;
const SQLITE_NOTADB_RESULT_CODE = 26;
const SQLITE_PRIMARY_RESULT_CODE_MASK = 255;
function sqliteErrorCode(error) {
	const code = asOptionalObjectRecord(error)?.code;
	return typeof code === "string" ? code : void 0;
}
function sqliteExtendedResultCode(error) {
	const errcode = asOptionalObjectRecord(error)?.errcode;
	return typeof errcode === "number" && Number.isInteger(errcode) ? errcode : void 0;
}
function sqlitePrimaryResultCode(error) {
	const errcode = sqliteExtendedResultCode(error);
	return errcode === void 0 ? void 0 : errcode & SQLITE_PRIMARY_RESULT_CODE_MASK;
}
function isSqliteLockError(error) {
	const code = sqliteErrorCode(error);
	if (code !== void 0 && SQLITE_LOCK_ERROR_CODES.has(code)) return true;
	const primaryCode = sqlitePrimaryResultCode(error);
	return primaryCode === SQLITE_BUSY_RESULT_CODE || primaryCode === SQLITE_LOCKED_RESULT_CODE;
}
/** Report proven file damage (corrupt page or non-database header), not transient failure. */
function isSqliteCorruptionError(error) {
	const primaryCode = sqlitePrimaryResultCode(error);
	return primaryCode === SQLITE_CORRUPT_RESULT_CODE || primaryCode === SQLITE_NOTADB_RESULT_CODE;
}
//#endregion
export { isSqliteLockError as a, markSqliteNativeOpenFailure as c, sqlitePrimaryResultCode as d, withSqliteInspectionOperation as f, isSqliteCorruptionError as i, sqliteErrorCode as l, formatSqliteErrorCodeSuffix as n, isSqliteNativeOpenFailure as o, withSqliteNativeOpen as p, formatSqliteReadOnlyInspectionFailure as r, markSqliteInspectionOperation as s, classifyGatewayStorageFailure as t, sqliteExtendedResultCode as u };
