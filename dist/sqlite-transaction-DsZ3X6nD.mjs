import { a as resolveGlobalSingleton } from "./global-singleton-0m-JziJW.mjs";
import { t as clearNodeSqliteKyselyCacheForDatabase } from "./kysely-sync-cache-state-eUau8Jaa.mjs";
import { n as captureSqliteReaderOwner } from "./sqlite-reader-lifecycle-CYQdd96B.mjs";
import { o as normalizeDatabasePath } from "./sqlite-worker-identity-KSR14F6C.mjs";
import { a as shouldReportSqliteLockFailure, n as readSqliteBusyTimeout, r as runWithSqliteBusyTimeout } from "./sqlite-busy-timeout-DYrW2wFu.mjs";
import { a as isSqliteLockError, d as sqlitePrimaryResultCode, l as sqliteErrorCode, u as sqliteExtendedResultCode } from "./sqlite-error-diagnostics-DCvjvszg.mjs";
import { t as createSubsystemLogger } from "./subsystem-I-uqdx4f.mjs";
import { t as isPromiseLike } from "./promise-like-D7-l5Fsp.mjs";
import { n as discardSqliteTransactionState } from "./sqlite-post-commit-CQ_AyDCk.mjs";
import { isMainThread, threadId } from "node:worker_threads";
import { setTimeout } from "node:timers/promises";
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
	const canonical = location === null ? null : normalizeDatabasePath(location);
	writeAdmissionLocations.set(database, canonical);
	return canonical;
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
	const registrations = [...new Set(nativeLocations.map(normalizeDatabasePath))].map((location) => {
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
function transactionDiagnosticLabels(db, options) {
	let database = options?.databaseLabel;
	if (!database) try {
		database = db ? db.location() ?? ":memory:" : "unavailable";
	} catch {
		database = "unavailable";
	}
	return {
		database,
		operation: options?.operationLabel || captureSqliteReaderOwner()?.operation || "unlabeled",
		...options?.diagnosticContext ? { context: { ...options.diagnosticContext } } : {}
	};
}
function logSlowTransactionHold(params) {
	if (params.elapsedMs < (params.options?.slowTransactionHoldMs ?? DEFAULT_SLOW_TRANSACTION_HOLD_MS)) return;
	(params.options?.logger ?? transactionLog).warn("slow SQLite transaction hold", {
		async: false,
		...transactionDiagnosticLabels(params.db, params.options),
		elapsedMs: params.elapsedMs,
		isMainThread,
		mode: params.mode,
		pid: process.pid,
		threadId,
		thresholdMs: params.options?.slowTransactionHoldMs ?? DEFAULT_SLOW_TRANSACTION_HOLD_MS
	});
}
function logSlowTransactionStep(params) {
	if (params.elapsedMs < slowBusyWaitThresholdMs(params.options)) return;
	(params.options?.logger ?? transactionLog).warn("slow SQLite transaction step", {
		async: false,
		...params.options?.busyTimeoutMs !== void 0 ? { busyTimeoutMs: params.options.busyTimeoutMs } : {},
		...transactionDiagnosticLabels(params.db, params.options),
		elapsedMs: params.elapsedMs,
		isMainThread,
		pid: process.pid,
		step: params.step,
		threadId,
		...params.beginAdmission ? { beginAdmission: { ...params.beginAdmission } } : {}
	});
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
			db: params.db,
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
			(params.options?.logger ?? transactionLog).warn("SQLite transaction lock wait failed", {
				async: false,
				...params.options?.busyTimeoutMs !== void 0 ? { busyTimeoutMs: params.options.busyTimeoutMs } : {},
				...transactionDiagnosticLabels(params.db, params.options),
				code: sqliteErrorCode(error),
				elapsedMs,
				failureKind: "lock-contention",
				isMainThread,
				pid: process.pid,
				...sqliteErrcode !== void 0 ? { sqliteErrcode } : {},
				...sqlitePrimaryCode !== void 0 ? { sqlitePrimaryCode } : {},
				step: params.step,
				threadId,
				...beginAdmission ? { beginAdmission: { ...beginAdmission } } : {}
			});
		}
		throw error;
	}
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
	const aborted = { error };
	db[abortedTransactionSymbol] ??= aborted;
	try {
		discardSqliteTransactionState(db, error);
	} catch (rollbackError) {
		if (db[abortedTransactionSymbol] === aborted) aborted.error = rollbackError;
		throw rollbackError;
	} finally {
		clearNodeSqliteKyselyCacheForDatabase(db);
		try {
			db.close();
		} catch {}
	}
}
function abortImmediateTransaction(db, error, commitStarted) {
	if (db[abortedTransactionSymbol]) return;
	if (!commitStarted && db.isOpen && !db.isTransaction) {
		discardSqliteTransactionState(db, error);
		return;
	}
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
	execTimedTransactionStep({
		db,
		options,
		sql: mode === "immediate" ? "BEGIN IMMEDIATE" : "BEGIN",
		step: "begin"
	});
	const transactionStartedAt = Date.now();
	let commitStarted = false;
	try {
		const result = operation();
		assertSyncTransactionResult(result);
		assertTransactionUsable(db);
		commitStarted = true;
		if (options?.withCommit) assertSyncTransactionResult(options.withCommit(() => commitImmediateTransaction(db, options)));
		else commitImmediateTransaction(db, options);
		return result;
	} catch (error) {
		abortImmediateTransaction(db, error, commitStarted);
		assertTransactionUsable(db);
		throw error;
	} finally {
		try {
			logSlowTransactionHold({
				db,
				elapsedMs: Date.now() - transactionStartedAt,
				mode,
				options
			});
		} catch {}
	}
}
/** Run synchronous reads against one deferred SQLite snapshot. */
function runSqliteDeferredTransactionSync(db, operation, options) {
	return runSqliteTransactionSync(db, operation, "deferred", options);
}
function runSqliteImmediateTransactionSync(db, operation, options) {
	return runSqliteTransactionSync(db, operation, "immediate", options);
}
/** Admit the borrowed worker connection after BEGIN and before its physical commit. */
function runSqliteWorkerTransactionSync(context, operation, options) {
	return runSqliteImmediateTransactionSync(context.database, () => {
		context.admit("transaction");
		return operation();
	}, {
		...options,
		withCommit(commit) {
			context.admit("commit");
			return options?.withCommit ? options.withCommit(commit) : commit();
		}
	});
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
export { runSqliteImmediateTransactionSync as a, runSqliteImmediateTransaction as i, retainSqliteWriteAdmissionService as n, runSqliteWorkerTransactionSync as o, runSqliteDeferredTransactionSync as r, withSqliteWriteAdmissionService as s, assertTransactionUsable as t };
