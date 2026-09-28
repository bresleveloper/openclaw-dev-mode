import { i as resolveGlobalSingleton } from "./global-singleton-Dc_stLtU.mjs";
import { o as normalizeWindowsPathPreservingCase } from "./path-guards-D5kuI0Tv.mjs";
import { t as createSubsystemLogger } from "./subsystem-DleLyu58.mjs";
import { t as clearNodeSqliteKyselyCacheForDatabase } from "./kysely-sync-cache-state-CFxglP-_.mjs";
import { t as isPromiseLike } from "./promise-like-D7-l5Fsp.mjs";
import { a as isSqliteLockError, d as sqlitePrimaryResultCode, l as sqliteErrorCode, u as sqliteExtendedResultCode } from "./sqlite-error-diagnostics-C8UyxYRx.mjs";
import { a as shouldReportSqliteLockFailure, n as readSqliteBusyTimeout, r as runWithSqliteBusyTimeout } from "./sqlite-busy-timeout-DYrW2wFu.mjs";
import { n as discardSqliteTransactionState } from "./sqlite-post-commit-DJbkHzN8.mjs";
import path from "node:path";
import { setTimeout } from "node:timers/promises";
import { isMainThread, threadId } from "node:worker_threads";
//#region src/infra/sqlite-transaction.ts
const DEFAULT_SLOW_BUSY_WAIT_MS = 1e3;
const DEFAULT_SLOW_TRANSACTION_HOLD_MS = 1e3;
const abortedTransactionSymbol = Symbol.for("openclaw.sqliteAbortedTransaction");
function assertTransactionUsable(db) {
	const aborted = db[abortedTransactionSymbol];
	if (aborted) throw aborted.error;
}
const transactionLog = createSubsystemLogger("sqlite/transaction");
const writeAdmissionServices = resolveGlobalSingleton(Symbol.for("openclaw.sqliteWriteAdmissionServices"), () => /* @__PURE__ */ new Map());
const writeAdmissionLocations = /* @__PURE__ */ new WeakMap();
function writeAdmissionLocation(database) {
	const cached = writeAdmissionLocations.get(database);
	if (cached !== void 0) return cached;
	const location = database.location();
	const canonical = location === null ? null : normalizeWriteAdmissionLocation(location);
	writeAdmissionLocations.set(database, canonical);
	return canonical;
}
function normalizeWriteAdmissionLocation(location) {
	const normalized = process.platform === "win32" ? normalizeWindowsPathPreservingCase(location) : location;
	return process.platform === "win32" && !path.win32.isAbsolute(normalized) ? location : normalized;
}
/** Keep worker-owned lock holders serviceable across connections and module graphs. */
async function withSqliteWriteAdmissionService(database, service, operation) {
	const location = writeAdmissionLocation(database);
	if (location === null) throw new Error("SQLite write admission service requires a file-backed database");
	const release = retainSqliteWriteAdmissionService([location], service);
	try {
		return await operation();
	} finally {
		release();
	}
}
/** Locations come from the retained native owner; registration grants no write authority. */
function retainSqliteWriteAdmissionService(nativeLocations, service) {
	const registrations = [...new Set(nativeLocations.map(normalizeWriteAdmissionLocation))].map((location) => {
		const services = writeAdmissionServices.get(location) ?? /* @__PURE__ */ new Set();
		const retained = () => service();
		services.add(retained);
		writeAdmissionServices.set(location, services);
		return {
			location,
			services,
			retained
		};
	});
	return () => {
		for (const { location, services, retained } of registrations) {
			services.delete(retained);
			if (services.size === 0 && writeAdmissionServices.get(location) === services) writeAdmissionServices.delete(location);
		}
	};
}
/** Native coordinator waits must keep the same worker's current-authority grants serviceable. */
function sqliteWriteAdmissionServicesForLocation(location) {
	return writeAdmissionServices.get(normalizeWriteAdmissionLocation(location));
}
function execNativeBegin(db, diagnostics) {
	const startedAt = Date.now();
	diagnostics.nativeAttempts += 1;
	try {
		db.exec("BEGIN IMMEDIATE");
	} finally {
		diagnostics.nativeMs += Date.now() - startedAt;
	}
}
function beginImmediateTransaction(db, diagnostics) {
	const location = writeAdmissionServices.size > 0 ? writeAdmissionLocation(db) : null;
	const services = location === null ? void 0 : writeAdmissionServices.get(location);
	if (!services) {
		execNativeBegin(db, diagnostics);
		return;
	}
	const deadline = performance.now() + readSqliteBusyTimeout(db);
	while (true) try {
		runWithSqliteBusyTimeout(db, Math.min(25, Math.max(0, Math.ceil(deadline - performance.now()))), () => execNativeBegin(db, diagnostics));
		return;
	} catch (error) {
		if (!isSqliteLockError(error) || performance.now() >= deadline) throw error;
		for (const service of services) {
			const startedAt = Date.now();
			diagnostics.serviceCalls += 1;
			try {
				service();
			} finally {
				diagnostics.serviceMs += Date.now() - startedAt;
			}
		}
		if (performance.now() >= deadline) throw error;
	}
}
function assertSyncTransactionResult(value) {
	if (isPromiseLike(value)) throw new Error("SQLite write transactions must be synchronous; Promise returns are not supported.");
}
function slowBusyWaitThresholdMs(options) {
	if (options?.busyTimeoutMs === void 0 || options.busyTimeoutMs <= 0) return DEFAULT_SLOW_BUSY_WAIT_MS;
	return Math.min(DEFAULT_SLOW_BUSY_WAIT_MS, options.busyTimeoutMs);
}
function slowTransactionHoldThresholdMs(options) {
	return options?.slowTransactionHoldMs ?? DEFAULT_SLOW_TRANSACTION_HOLD_MS;
}
function transactionLogger(options) {
	return options?.logger ?? transactionLog;
}
function logSlowTransactionHold(params) {
	if (params.elapsedMs < slowTransactionHoldThresholdMs(params.options)) return;
	transactionLogger(params.options).warn("slow SQLite transaction hold", {
		async: false,
		...params.options?.databaseLabel ? { database: params.options.databaseLabel } : {},
		elapsedMs: params.elapsedMs,
		isMainThread,
		...params.options?.operationLabel ? { operation: params.options.operationLabel } : {},
		pid: process.pid,
		threadId,
		thresholdMs: slowTransactionHoldThresholdMs(params.options)
	});
}
/** The lifecycle lock precedes BEGIN, so transaction hold diagnostics cannot see this wait. */
function logSlowSqliteCoordinatorWait(elapsedMs, options) {
	if (!isMainThread || elapsedMs <= 100) return;
	transactionLogger(void 0).warn("slow SQLite coordinator lock wait", {
		async: false,
		database: options.databaseLabel,
		elapsedMs,
		isMainThread,
		operation: options.operationLabel,
		pid: process.pid,
		threadId,
		thresholdMs: 100
	});
}
function logSlowTransactionStep(params) {
	if (params.elapsedMs < slowBusyWaitThresholdMs(params.options)) return;
	transactionLogger(params.options).warn("slow SQLite transaction lock wait", {
		async: false,
		...params.options?.busyTimeoutMs !== void 0 ? { busyTimeoutMs: params.options.busyTimeoutMs } : {},
		...params.options?.databaseLabel ? { database: params.options.databaseLabel } : {},
		elapsedMs: params.elapsedMs,
		isMainThread,
		...params.options?.operationLabel ? { operation: params.options.operationLabel } : {},
		pid: process.pid,
		step: params.step,
		threadId,
		...beginAdmissionLogFields(params.beginAdmission)
	});
}
function beginAdmissionLogFields(diagnostics) {
	return diagnostics ? { beginAdmission: {
		nativeAttempts: diagnostics.nativeAttempts,
		nativeMs: diagnostics.nativeMs,
		serviceCalls: diagnostics.serviceCalls,
		serviceMs: diagnostics.serviceMs
	} } : {};
}
function execTimedTransactionStep(params) {
	const startedAt = Date.now();
	const beginAdmission = params.sql === "BEGIN IMMEDIATE" ? {
		nativeAttempts: 0,
		nativeMs: 0,
		serviceCalls: 0,
		serviceMs: 0
	} : void 0;
	try {
		if (beginAdmission) beginImmediateTransaction(params.db, beginAdmission);
		else params.db.exec(params.sql);
		const elapsedMs = Date.now() - startedAt;
		logSlowTransactionStep({
			beginAdmission,
			elapsedMs,
			options: params.options,
			step: params.step
		});
		return elapsedMs;
	} catch (error) {
		const elapsedMs = Date.now() - startedAt;
		if (isSqliteLockError(error) && shouldReportSqliteLockFailure(params.db)) {
			const sqliteErrcode = sqliteExtendedResultCode(error);
			const sqlitePrimaryCode = sqlitePrimaryResultCode(error);
			transactionLogger(params.options).warn("SQLite transaction lock wait failed", {
				async: false,
				...params.options?.busyTimeoutMs !== void 0 ? { busyTimeoutMs: params.options.busyTimeoutMs } : {},
				...params.options?.databaseLabel ? { database: params.options.databaseLabel } : {},
				code: sqliteErrorCode(error),
				elapsedMs,
				failureKind: "lock-contention",
				isMainThread,
				...params.options?.operationLabel ? { operation: params.options.operationLabel } : {},
				pid: process.pid,
				...sqliteErrcode !== void 0 ? { sqliteErrcode } : {},
				...sqlitePrimaryCode !== void 0 ? { sqlitePrimaryCode } : {},
				step: params.step,
				threadId,
				...beginAdmissionLogFields(beginAdmission)
			});
		}
		throw error;
	}
}
function beginTransaction(db, options, mode) {
	execTimedTransactionStep({
		db,
		options,
		sql: mode === "immediate" ? "BEGIN IMMEDIATE" : "BEGIN",
		step: "begin"
	});
}
function commitImmediateTransaction(db, options) {
	execTimedTransactionStep({
		db,
		options,
		sql: "COMMIT",
		step: "commit"
	});
}
function discardUnsafeConnection(db, error) {
	db[abortedTransactionSymbol] ??= { error };
	discardSqliteTransactionState(db, error);
	clearNodeSqliteKyselyCacheForDatabase(db);
	try {
		db.close();
	} catch {}
}
function abortImmediateTransaction(db, error) {
	if (db[abortedTransactionSymbol]) return;
	try {
		db.exec("ROLLBACK");
	} catch {
		discardUnsafeConnection(db, error);
	}
}
function runSqliteTransactionSync(db, operation, mode, options) {
	assertTransactionUsable(db);
	if (db.isTransaction) {
		db.exec("SAVEPOINT openclaw_tx_nested");
		try {
			const result = operation();
			assertSyncTransactionResult(result);
			assertTransactionUsable(db);
			db.exec("RELEASE SAVEPOINT openclaw_tx_nested");
			return result;
		} catch (error) {
			const failure = db[abortedTransactionSymbol];
			if (failure) throw failure.error;
			try {
				db.exec("ROLLBACK TO SAVEPOINT openclaw_tx_nested");
				db.exec("RELEASE SAVEPOINT openclaw_tx_nested");
			} catch {
				discardUnsafeConnection(db, error);
			}
			throw error;
		}
	}
	beginTransaction(db, options, mode);
	const transactionStartedAt = Date.now();
	try {
		const result = operation();
		assertSyncTransactionResult(result);
		assertTransactionUsable(db);
		logSlowTransactionHold({
			elapsedMs: Date.now() - transactionStartedAt,
			options
		});
		if (options?.withCommit) assertSyncTransactionResult(options.withCommit(() => commitImmediateTransaction(db, options)));
		else commitImmediateTransaction(db, options);
		return result;
	} catch (error) {
		abortImmediateTransaction(db, error);
		assertTransactionUsable(db);
		throw error;
	}
}
/** Run synchronous reads against one deferred SQLite snapshot. */
function runSqliteDeferredTransactionSync(db, operation, options) {
	return runSqliteTransactionSync(db, operation, "deferred", options);
}
function runSqliteImmediateTransactionSync(db, operation, options) {
	return runSqliteTransactionSync(db, operation, "immediate", options);
}
/** Prepare outside the transaction; yield for admission without replaying admitted writes. */
async function runSqliteImmediateTransaction(db, prepare, options, admit = (write) => write()) {
	assertTransactionUsable(db);
	if (db.isTransaction) throw new Error("Asynchronous SQLite preparation cannot join an existing transaction");
	const deadline = performance.now() + readSqliteBusyTimeout(db);
	const inheritedDeadlineNs = options?.beginDeadlineNs;
	const remainingMs = inheritedDeadlineNs === void 0 ? () => deadline - performance.now() : () => Number(inheritedDeadlineNs - process.hrtime.bigint()) / 1e6;
	let entered = false;
	while (true) {
		const operation = await prepare();
		assertTransactionUsable(db);
		if (db.isTransaction) throw new Error("SQLite preparation left a transaction open");
		if (!operation) return;
		try {
			return await admit(() => {
				assertTransactionUsable(db);
				if (db.isTransaction) throw new Error("Asynchronous SQLite preparation cannot join an existing transaction");
				return runWithSqliteBusyTimeout(db, 0, (restore) => runSqliteImmediateTransactionSync(db, () => {
					entered = true;
					restore();
					return operation();
				}, options), { lockFailureReporting: "suppress" });
			});
		} catch (error) {
			if (entered || !isSqliteLockError(error) || remainingMs() <= 0) throw error;
			await setTimeout(Math.min(25, Math.max(0, remainingMs())));
			assertTransactionUsable(db);
			if (remainingMs() <= 0) throw error;
		}
	}
}
//#endregion
export { runSqliteImmediateTransaction as a, withSqliteWriteAdmissionService as c, runSqliteDeferredTransactionSync as i, logSlowSqliteCoordinatorWait as n, runSqliteImmediateTransactionSync as o, retainSqliteWriteAdmissionService as r, sqliteWriteAdmissionServicesForLocation as s, assertTransactionUsable as t };
