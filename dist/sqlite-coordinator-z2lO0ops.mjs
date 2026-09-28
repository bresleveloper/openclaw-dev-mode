import { i as resolveGlobalSingleton } from "./global-singleton-Dc_stLtU.mjs";
import { d as sameFileIdentity } from "./fs-safe-advanced-CJC-NYf3.mjs";
import "./path-guards-D5kuI0Tv.mjs";
import { t as openNodeSqliteDatabase } from "./node-sqlite-BO6jRFcG.mjs";
import { t as applyPrivateModeSync } from "./private-mode-B6dWGRb2.mjs";
import { a as isSqliteLockError, p as withSqliteNativeOpen } from "./sqlite-error-diagnostics-C8UyxYRx.mjs";
import { t as SQLITE_IDLE_HANDLE_TTL_MS } from "./sqlite-handle-lifecycle-dWd9h3ii.mjs";
import { s as sqliteWriteAdmissionServicesForLocation } from "./sqlite-transaction-DKSXLQhb.mjs";
import fs from "node:fs";
import path from "node:path";
import { AsyncLocalStorage } from "node:async_hooks";
//#region src/infra/sqlite-coordinator.ts
const SqliteCoordinatorError = resolveGlobalSingleton(Symbol.for("openclaw.sqliteCoordinatorError"), () => class CoordinatorError extends Error {
	constructor(message, cause) {
		super(message);
		this.cause = cause;
		this.name = "SqliteCoordinatorError";
	}
});
function createSqliteLifecycleAggregateError(errors, message, cause) {
	return new AggregateError(errors, message, { cause });
}
/** Keep the first failure as the cause while retaining independent cleanup errors. */
function throwSqliteLifecycleErrors(errors, message) {
	if (errors.length === 1) throw errors[0];
	if (errors.length > 1) throw createSqliteLifecycleAggregateError(errors, message, errors[0]);
}
function runWithSqliteCoordinator(coordinator, operationLabel, operation) {
	let result;
	try {
		result = operation();
		if (result && typeof result.then === "function") throw new SqliteCoordinatorError(`${operationLabel} must remain synchronous`);
	} catch (operationError) {
		let releaseFailed = false;
		let releaseError;
		try {
			coordinator.release();
		} catch (error) {
			releaseFailed = true;
			releaseError = error;
		}
		if (releaseFailed) throw createSqliteLifecycleAggregateError([operationError, releaseError], `${operationLabel} and coordinator release both failed`, operationError);
		throw operationError;
	}
	try {
		coordinator.release();
	} catch (releaseError) {
		throw new SqliteCoordinatorError(`${operationLabel} completed, but releasing its coordinator failed`, releaseError);
	}
	return result;
}
function ensurePrivateSqliteCoordinatorDirectory(directoryPath, coordinatorLabel) {
	try {
		fs.mkdirSync(directoryPath, {
			mode: 448,
			recursive: true
		});
	} catch (error) {
		if (error.code !== "EEXIST") throw error;
	}
	const stats = fs.lstatSync(directoryPath);
	if (stats.isSymbolicLink() || !stats.isDirectory()) throw new SqliteCoordinatorError(`${coordinatorLabel} directory must be a real directory`);
	const uid = typeof process.getuid === "function" ? process.getuid() : void 0;
	if (uid !== void 0 && stats.uid !== uid) throw new SqliteCoordinatorError(`${coordinatorLabel} directory belongs to another user`);
	if (process.platform !== "win32") {
		if ((stats.mode & 4095) !== 448) applyPrivateModeSync(directoryPath, 448);
		const secured = fs.lstatSync(directoryPath);
		if (secured.isSymbolicLink() || !secured.isDirectory() || (secured.mode & 63) !== 0) throw new SqliteCoordinatorError(`${coordinatorLabel} directory permissions are not private`);
	}
}
const coordinatorPool = resolveGlobalSingleton(Symbol.for("openclaw.sqliteCoordinatorPool"), () => ({
	runInCoordinatorPoolContext: AsyncLocalStorage.snapshot(),
	idleCoordinators: /* @__PURE__ */ new Map(),
	failedIdleCloses: /* @__PURE__ */ new Map(),
	exitCloseRegistered: false,
	closeOnExit: closeIdleCoordinatorsOnExit
}), () => closeIdleCoordinatorPool(), "close-only");
const { runInCoordinatorPoolContext, idleCoordinators, failedIdleCloses } = coordinatorPool;
function updateCoordinatorExitClose() {
	const needed = idleCoordinators.size > 0 || failedIdleCloses.size > 0;
	if (needed && !coordinatorPool.exitCloseRegistered) process.once("exit", coordinatorPool.closeOnExit);
	else if (!needed && coordinatorPool.exitCloseRegistered) process.removeListener("exit", coordinatorPool.closeOnExit);
	coordinatorPool.exitCloseRegistered = needed;
}
function takeIdleCoordinator(location) {
	const idle = idleCoordinators.get(location);
	if (idle) {
		idleCoordinators.delete(location);
		clearTimeout(idle.timer);
		updateCoordinatorExitClose();
	}
	return idle;
}
function closeIdleCoordinatorDatabase(database, location) {
	try {
		if (database.isOpen) database.close();
	} finally {
		if (database.isOpen) failedIdleCloses.set(database, location);
		else failedIdleCloses.delete(database);
		updateCoordinatorExitClose();
	}
}
function closeIdleCoordinatorsOnExit() {
	const databases = new Map(failedIdleCloses);
	for (const [location] of idleCoordinators) {
		const idle = takeIdleCoordinator(location);
		if (idle) databases.set(idle.database, location);
	}
	for (const [database, location] of databases) try {
		closeIdleCoordinatorDatabase(database, location);
	} catch {}
}
function closeIdleCoordinatorPool(include = () => true) {
	const databases = new Map([...failedIdleCloses].filter(([, location]) => include(location)));
	for (const [location] of idleCoordinators) {
		if (!include(location)) continue;
		const idle = takeIdleCoordinator(location);
		if (idle) databases.set(idle.database, location);
	}
	const errors = [];
	for (const [database, location] of databases) try {
		closeIdleCoordinatorDatabase(database, location);
	} catch (error) {
		errors.push(error);
	}
	throwSqliteLifecycleErrors(errors, "Idle SQLite coordinator cleanup failed");
}
function readCoordinatorIdentity(location) {
	try {
		const identity = fs.lstatSync(location, { bigint: true });
		return identity.isFile() && identity.dev !== 0n && identity.ino !== 0n ? identity : void 0;
	} catch {
		return;
	}
}
function matchesCoordinatorIdentity(left, right) {
	return right !== void 0 && sameFileIdentity(left, right) && left.birthtimeNs === right.birthtimeNs && left.mode === right.mode && left.uid === right.uid && left.gid === right.gid;
}
function retainIdleCoordinator(location, database, identity) {
	const previous = takeIdleCoordinator(location);
	if (previous) closeIdleCoordinatorDatabase(previous.database, location);
	const timer = runInCoordinatorPoolContext(() => setTimeout(() => {
		if (idleCoordinators.get(location)?.timer !== timer) return;
		const idle = takeIdleCoordinator(location);
		if (!idle) return;
		try {
			closeIdleCoordinatorDatabase(idle.database, location);
		} catch (error) {
			process.emitWarning(new SqliteCoordinatorError("Idle SQLite coordinator close failed", error));
		}
	}, SQLITE_IDLE_HANDLE_TTL_MS));
	timer.unref();
	idleCoordinators.set(location, {
		database,
		identity,
		timer
	});
	updateCoordinatorExitClose();
	return true;
}
function tryAcquireSqliteCoordinator(location, mode, options) {
	const busyTimeoutMs = Math.max(0, Math.trunc(options.busyTimeoutMs ?? 0));
	const reusableLocation = location !== "" && location !== ":memory:" && !location.startsWith("file:") ? path.resolve(location) : void 0;
	const poolLocation = reusableLocation && (options.keepAlive || idleCoordinators.has(reusableLocation)) ? reusableLocation : void 0;
	const before = poolLocation ? readCoordinatorIdentity(poolLocation) : void 0;
	const idle = poolLocation ? takeIdleCoordinator(poolLocation) : void 0;
	const reused = idle && matchesCoordinatorIdentity(idle.identity, before) ? idle : void 0;
	if (poolLocation && idle && !reused) closeIdleCoordinatorDatabase(idle.database, poolLocation);
	const database = reused?.database ?? withSqliteNativeOpen(() => openNodeSqliteDatabase(location));
	let identity;
	try {
		const services = mode === "exclusive" ? sqliteWriteAdmissionServicesForLocation(location) : void 0;
		const deadline = performance.now() + busyTimeoutMs;
		for (;;) {
			const attemptTimeout = services ? Math.min(25, Math.max(0, Math.ceil(deadline - performance.now()))) : busyTimeoutMs;
			try {
				database.exec(`PRAGMA busy_timeout = ${attemptTimeout}; PRAGMA journal_mode = MEMORY; ${mode === "exclusive" ? "BEGIN EXCLUSIVE;" : "BEGIN; SELECT rootpage FROM sqlite_schema LIMIT 1;"}`);
				break;
			} catch (error) {
				if (!services || !isSqliteLockError(error) || performance.now() >= deadline) throw error;
				for (const service of services) service();
			}
		}
		if (poolLocation && before) {
			if (matchesCoordinatorIdentity(before, readCoordinatorIdentity(poolLocation))) identity = before;
			else if (reused) throw new SqliteCoordinatorError("SQLite coordinator changed during acquisition");
		}
	} catch (error) {
		if (poolLocation) closeIdleCoordinatorDatabase(database, poolLocation);
		else database.close();
		if (isSqliteLockError(error)) return null;
		throw error;
	}
	let released = false;
	return {
		get closed() {
			return released || !database.isOpen;
		},
		release: (releaseOptions) => {
			if (released || !database.isOpen) return;
			const errors = [];
			if (database.isTransaction) try {
				database.exec("ROLLBACK");
				if (poolLocation && database.isTransaction) throw new SqliteCoordinatorError("SQLite coordinator rollback left its transaction open");
			} catch (error) {
				errors.push(error);
			}
			let retained = false;
			if (errors.length === 0 && options.keepAlive && releaseOptions?.keepAlive !== false && poolLocation && identity && !failedIdleCloses.has(database)) try {
				retained = retainIdleCoordinator(poolLocation, database, identity);
			} catch (error) {
				errors.push(error);
			}
			if (!retained && database.isOpen) try {
				if (poolLocation) closeIdleCoordinatorDatabase(database, poolLocation);
				else database.close();
			} catch (error) {
				errors.push(error);
			}
			released = retained || !database.isOpen;
			if (errors.length === 1) throw errors[0];
			if (errors.length > 1) throw new AggregateError(errors, "SQLite coordinator rollback and close both failed");
		}
	};
}
/** Hold a raw exclusive transaction until release for cross-process coordination. */
function tryAcquireExclusiveSqliteCoordinator(location, options = {}) {
	return tryAcquireSqliteCoordinator(location, "exclusive", options);
}
/** Retain a read lock for a live handle; no rows or journal files are written. */
function tryAcquireSharedSqliteCoordinator(location, options = {}) {
	return tryAcquireSqliteCoordinator(location, "shared", options);
}
//#endregion
export { throwSqliteLifecycleErrors as a, runWithSqliteCoordinator as i, createSqliteLifecycleAggregateError as n, tryAcquireExclusiveSqliteCoordinator as o, ensurePrivateSqliteCoordinatorDirectory as r, tryAcquireSharedSqliteCoordinator as s, SqliteCoordinatorError as t };
