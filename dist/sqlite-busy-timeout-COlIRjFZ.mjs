import { a as resolveGlobalSingleton } from "./global-singleton-DrXvEBww.mjs";
import { c as registerNodeSqliteDisposeCallback } from "./kysely-sync-cache-state-Dc7tna9E.mjs";
//#region src/infra/sqlite-busy-timeout.ts
const lockFailureReportingByDatabase = /* @__PURE__ */ new WeakMap();
const { busyTimeoutByDatabase, trackedDatabases } = resolveGlobalSingleton(Symbol.for("openclaw.sqliteBusyTimeout"), () => ({
	busyTimeoutByDatabase: /* @__PURE__ */ new WeakMap(),
	trackedDatabases: /* @__PURE__ */ new WeakSet()
}));
function rememberSqliteBusyTimeout(database, busyTimeoutMs) {
	if (!trackedDatabases.has(database)) {
		trackedDatabases.add(database);
		registerNodeSqliteDisposeCallback(database, () => busyTimeoutByDatabase.delete(database));
	}
	busyTimeoutByDatabase.set(database, busyTimeoutMs);
}
function normalizeSqliteNonNegativeInteger(value, label) {
	if (!Number.isInteger(value) || value < 0) throw new Error(`${label} must be a non-negative integer`);
	return value;
}
function readSqliteBusyTimeout(database) {
	const known = busyTimeoutByDatabase.get(database);
	if (known !== void 0) return known;
	const row = database.prepare("PRAGMA busy_timeout").get();
	const value = row?.busy_timeout ?? row?.timeout;
	const busyTimeoutMs = typeof value === "bigint" ? Number(value) : Number(value ?? 0);
	rememberSqliteBusyTimeout(database, busyTimeoutMs);
	return busyTimeoutMs;
}
/** All policy changes on a managed connection go through this owner. */
function setSqliteBusyTimeout(database, busyTimeoutMs) {
	const normalizedTimeoutMs = normalizeSqliteNonNegativeInteger(busyTimeoutMs, "busyTimeoutMs");
	if (busyTimeoutByDatabase.get(database) === normalizedTimeoutMs) return;
	database.exec(`PRAGMA busy_timeout = ${normalizedTimeoutMs}`);
	rememberSqliteBusyTimeout(database, normalizedTimeoutMs);
}
function shouldReportSqliteLockFailure(database) {
	return lockFailureReportingByDatabase.get(database) !== "suppress";
}
/** Run with a temporary busy policy; restore early when write admission finishes. */
function runWithSqliteBusyTimeout(database, busyTimeoutMs, operation, options = {}) {
	const normalizedTimeoutMs = normalizeSqliteNonNegativeInteger(busyTimeoutMs, "busyTimeoutMs");
	const previousBusyTimeoutMs = readSqliteBusyTimeout(database);
	const previousLockFailureReporting = lockFailureReportingByDatabase.get(database);
	if (options.lockFailureReporting) lockFailureReportingByDatabase.set(database, options.lockFailureReporting);
	setSqliteBusyTimeout(database, normalizedTimeoutMs);
	let restored = false;
	const restore = () => {
		if (restored) return;
		if (database.isOpen && previousBusyTimeoutMs !== normalizedTimeoutMs) setSqliteBusyTimeout(database, previousBusyTimeoutMs);
		if (previousLockFailureReporting) lockFailureReportingByDatabase.set(database, previousLockFailureReporting);
		else lockFailureReportingByDatabase.delete(database);
		restored = true;
	};
	try {
		return operation(restore);
	} finally {
		restore();
	}
}
//#endregion
export { shouldReportSqliteLockFailure as a, setSqliteBusyTimeout as i, readSqliteBusyTimeout as n, runWithSqliteBusyTimeout as r, normalizeSqliteNonNegativeInteger as t };
