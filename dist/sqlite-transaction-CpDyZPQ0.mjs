import { a as resolveGlobalSingleton } from "./global-singleton-DrXvEBww.mjs";
import { t as createSubsystemLogger } from "./subsystem-mStysHHC.mjs";
import { c as normalizeDatabasePath } from "./sqlite-worker-identity-DLqVBf5J.mjs";
import { t as isPromiseLike } from "./promise-like-D7-l5Fsp.mjs";
import { r as isPostgresSqlConnection, t as assertPostgresTransactionUsable } from "./sql-connection-DmQzXTVz.mjs";
import { t as clearNodeSqliteKyselyCacheForDatabase } from "./kysely-sync-cache-state-Dc7tna9E.mjs";
import { a as shouldReportSqliteLockFailure, n as readSqliteBusyTimeout, r as runWithSqliteBusyTimeout } from "./sqlite-busy-timeout-COlIRjFZ.mjs";
import { c as withSqlitePostCommitPublications, i as prepareSqliteTransactionCommit, n as discardSqliteTransactionState } from "./sqlite-post-commit-22SfWsLt.mjs";
import { p as runSqliteReadOperationSync } from "./sqlite-schema-facts-C8u_9Af1.mjs";
import { n as captureSqliteReaderOwner, r as currentSqliteOperationTiming } from "./sqlite-reader-lifecycle-Cw11HwJP.mjs";
import { a as isSqliteLockError, d as sqlitePrimaryResultCode, l as sqliteErrorCode, u as sqliteExtendedResultCode } from "./sqlite-error-diagnostics-BBfTUJBR.mjs";
import { isMainThread, threadId } from "node:worker_threads";
import { setTimeout } from "node:timers/promises";
//#region src/infra/sqlite-transaction.ts
const DEFAULT_SLOW_BUSY_WAIT_MS = 1e3;
const DEFAULT_SLOW_TRANSACTION_HOLD_MS = 1e3;
const abortedTransactionSymbol = Symbol.for("openclaw.sqliteAbortedTransaction");
function assertTransactionUsable(db) {
	if (isPostgresSqlConnection(db)) {
		assertPostgresTransactionUsable(db);
		return;
	}
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
		callbackKind: "application-transaction",
		...transactionDiagnosticLabels(params.db, params.options),
		elapsedMs: params.elapsedMs,
		phases: {
			prepareMs: params.prepareMs,
			beginMs: params.beginMs,
			sqlMs: Math.max(0, params.elapsedMs - params.hostAdmissionWaitMs - params.databaseAdmissionWaitMs - params.commitMs),
			hostAdmissionWaitMs: params.hostAdmissionWaitMs,
			databaseAdmissionWaitMs: params.databaseAdmissionWaitMs,
			commitMs: params.commitMs
		},
		isMainThread,
		mode: params.mode,
		pid: process.pid,
		threadId,
		thresholdMs: params.options?.slowTransactionHoldMs ?? DEFAULT_SLOW_TRANSACTION_HOLD_MS
	});
}
function logTransactionStep(params, failure) {
	try {
		if (!failure && params.elapsedMs < slowBusyWaitThresholdMs(params.options)) return;
		const sqliteErrcode = failure ? sqliteExtendedResultCode(failure.error) : void 0;
		const sqlitePrimaryCode = failure ? sqlitePrimaryResultCode(failure.error) : void 0;
		(params.options?.logger ?? transactionLog).warn(failure ? "SQLite transaction lock wait failed" : "slow SQLite transaction step", {
			async: false,
			...params.options?.busyTimeoutMs !== void 0 ? { busyTimeoutMs: params.options.busyTimeoutMs } : {},
			...transactionDiagnosticLabels(params.db, params.options),
			...failure ? { code: sqliteErrorCode(failure.error) } : {},
			elapsedMs: params.elapsedMs,
			...failure ? { failureKind: "lock-contention" } : {},
			isMainThread,
			pid: process.pid,
			...sqliteErrcode !== void 0 ? { sqliteErrcode } : {},
			...sqlitePrimaryCode !== void 0 ? { sqlitePrimaryCode } : {},
			step: params.step,
			threadId,
			...params.beginAdmission ? { beginAdmission: { ...params.beginAdmission } } : {}
		});
	} catch {}
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
		logTransactionStep({
			beginAdmission,
			db: params.db,
			elapsedMs,
			options: params.options,
			step: params.step
		});
		return elapsedMs;
	} catch (error) {
		const elapsedMs = Date.now() - startedAt;
		if (isSqliteLockError(error) && shouldReportSqliteLockFailure(params.db) && !(params.step === "begin" && params.options?.beginLockFailureReporting === "suppress")) logTransactionStep({
			beginAdmission,
			db: params.db,
			elapsedMs,
			options: params.options,
			step: params.step
		}, { error });
		throw error;
	}
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
		discardSqliteTransactionState(db, error, "rolled-back");
		return;
	}
	try {
		db.exec("ROLLBACK");
	} catch {
		discardUnsafeConnection(db, error);
	}
}
function runSqliteTransactionSync(db, operation, mode, options) {
	if (db.isTransaction) {
		db.exec("SAVEPOINT openclaw_tx_nested");
		try {
			const result = runSqliteReadOperationSync(db, operation);
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
	const timing = currentSqliteOperationTiming();
	const prepareMs = timing ? Date.now() - timing.preparedAtMs : void 0;
	const beginMs = execTimedTransactionStep({
		db,
		options,
		sql: mode === "immediate" ? "BEGIN IMMEDIATE" : "BEGIN",
		step: "begin"
	});
	if (timing) timing.transactions.count += 1;
	return settleSqliteTransactionSync(db, operation, mode, beginMs, prepareMs, options);
}
/** Settle a reservation acquired by the closed, multi-database worker fence. */
function runSqliteReservedTransactionSync(db, operation, options) {
	if (isPostgresSqlConnection(db)) return db.runTransaction(operation, options, false, true);
	assertTransactionUsable(db);
	if (isMainThread || !db.isTransaction) throw new Error("SQLite reserved settlement requires a worker-owned transaction");
	return settleSqliteTransactionSync(db, operation, "immediate", 0, void 0, options, true);
}
function settleSqliteTransactionSync(db, operation, mode, beginMs, prepareMs, options, reservedSourceFence = false) {
	const timing = currentSqliteOperationTiming();
	const transactionStartedAt = Date.now();
	const admissionWaitBefore = timing?.hostAdmissionWaitMs ?? 0;
	const databaseAdmissionWaitBefore = timing?.databaseAdmissionWaitMs ?? 0;
	let commitMs = 0;
	const commit = () => {
		const startedAt = Date.now();
		const databaseAdmissionWaitBeforeCommit = timing?.databaseAdmissionWaitMs ?? 0;
		try {
			prepareSqliteTransactionCommit(db);
			execTimedTransactionStep({
				db,
				options,
				sql: "COMMIT",
				step: "commit"
			});
		} finally {
			commitMs += Date.now() - startedAt - ((timing?.databaseAdmissionWaitMs ?? 0) - databaseAdmissionWaitBeforeCommit);
		}
	};
	let commitStarted = false;
	try {
		const result = reservedSourceFence ? operation() : runSqliteReadOperationSync(db, operation);
		assertSyncTransactionResult(result);
		assertTransactionUsable(db);
		commitStarted = true;
		if (options?.withCommit) assertSyncTransactionResult(options.withCommit(commit));
		else commit();
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
				options,
				prepareMs,
				beginMs,
				hostAdmissionWaitMs: (timing?.hostAdmissionWaitMs ?? 0) - admissionWaitBefore,
				databaseAdmissionWaitMs: (timing?.databaseAdmissionWaitMs ?? 0) - databaseAdmissionWaitBefore,
				commitMs
			});
		} catch {} finally {
			if (timing) timing.preparedAtMs = Date.now();
		}
	}
}
/** Run synchronous reads against one deferred SQLite snapshot. */
function runSqliteDeferredTransactionSync(db, operation, options) {
	if (isPostgresSqlConnection(db)) return db.runTransaction(operation, options);
	assertTransactionUsable(db);
	return withSqlitePostCommitPublications(db, () => runSqliteTransactionSync(db, operation, "deferred", options));
}
/** Read-only composition reuses the caller's snapshot and rollback owner. */
function runSqliteReadSnapshotSync(db, operation, options) {
	if (isPostgresSqlConnection(db)) {
		assertPostgresTransactionUsable(db);
		if (db.isTransaction) {
			const result = operation();
			assertSyncTransactionResult(result);
			assertPostgresTransactionUsable(db);
			return result;
		}
		return db.runTransaction(operation, options, true);
	}
	assertTransactionUsable(db);
	if (!db.isTransaction) return runSqliteDeferredTransactionSync(db, operation, options);
	const result = runSqliteReadOperationSync(db, operation);
	assertSyncTransactionResult(result);
	assertTransactionUsable(db);
	return result;
}
function runSqliteImmediateTransactionSync(db, operation, options) {
	if (isPostgresSqlConnection(db)) return db.runTransaction(operation, options);
	assertTransactionUsable(db);
	return withSqlitePostCommitPublications(db, () => runSqliteTransactionSync(db, operation, "immediate", options));
}
function runSqliteSingleStatementSync(db, statement) {
	if (isPostgresSqlConnection(db)) return db.runTransaction(statement);
	assertTransactionUsable(db);
	return withSqlitePostCommitPublications(db, () => {
		if (db.isTransaction) return runSqliteTransactionSync(db, statement, "immediate");
		const result = runSqliteReadOperationSync(db, statement);
		assertSyncTransactionResult(result);
		return result;
	});
}
/** Obtain host admission before taking the writer lock; revalidate before physical commit. */
function runSqliteWorkerTransactionSync(context, operation, options) {
	if (isPostgresSqlConnection(context.database)) {
		context.admit("transaction");
		return context.database.runTransaction(operation, {
			...options,
			withCommit(commit) {
				context.admit("commit");
				return options?.withCommit ? options.withCommit(commit) : commit();
			}
		});
	}
	assertTransactionUsable(context.database);
	context.admit("transaction");
	return runSqliteImmediateTransactionSync(context.database, operation, {
		...options,
		withCommit(commit) {
			context.admit("commit");
			return options?.withCommit ? options.withCommit(commit) : commit();
		}
	});
}
/** Prepare outside the transaction; yield for admission without replaying admitted writes. */
async function runSqliteImmediateTransaction(db, prepare, options, admit = (write) => write()) {
	if (isPostgresSqlConnection(db)) {
		assertPostgresTransactionUsable(db);
		if (db.isTransaction) throw new Error("Asynchronous SQLite preparation cannot join an existing transaction");
		const operation = await prepare();
		assertPostgresTransactionUsable(db);
		if (db.isTransaction) throw new Error("SQLite preparation left a transaction open");
		if (!operation) return;
		return await admit(() => {
			assertPostgresTransactionUsable(db);
			if (db.isTransaction) throw new Error("Asynchronous SQLite preparation cannot join an existing transaction");
			return db.runTransaction(operation, options);
		});
	}
	assertTransactionUsable(db);
	if (db.isTransaction) throw new Error("Asynchronous SQLite preparation cannot join an existing transaction");
	const inheritedDeadlineNs = options?.beginDeadlineNs;
	const remainingMs = (() => {
		if (inheritedDeadlineNs !== void 0) return () => Number(inheritedDeadlineNs - process.hrtime.bigint()) / 1e6;
		const deadline = performance.now() + readSqliteBusyTimeout(db);
		return () => deadline - performance.now();
	})();
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
export { runSqliteImmediateTransactionSync as a, runSqliteSingleStatementSync as c, runSqliteImmediateTransaction as i, runSqliteWorkerTransactionSync as l, retainSqliteWriteAdmissionService as n, runSqliteReadSnapshotSync as o, runSqliteDeferredTransactionSync as r, runSqliteReservedTransactionSync as s, assertTransactionUsable as t, withSqliteWriteAdmissionService as u };
