import { r as enableNodeSqliteKyselyStatementCache } from "./kysely-sync-cache-state-eUau8Jaa.mjs";
import { i as getSqliteRuntimeCapabilities } from "./bun-sqlite-library-CBSPJxTD.mjs";
import { o as runSqliteReadOperationSync, t as admitSqliteSchema } from "./sqlite-schema-facts-CG0Tk84j.mjs";
import { n as assertExistingDatabaseIdentity, u as readDatabasePathIdentitySync } from "./sqlite-worker-identity-KSR14F6C.mjs";
import { t as openNodeSqliteDatabase } from "./node-sqlite-XIcwmOrl.mjs";
import { t as isPromiseLike } from "./promise-like-D7-l5Fsp.mjs";
import { a as createSqliteLifecycleAggregateError, i as SqliteCoordinatorError, s as throwSqliteLifecycleErrors } from "./sqlite-lifecycle-errors-DuOygjcn.mjs";
import { t as acquireSqliteSnapshotReadToken } from "./sqlite-snapshot-staging-BIgaAYlp.mjs";
import { u as retainSnapshotTempDirectory } from "./sqlite-readonly-location-cleanup-CPS8QEIp.mjs";
import { s as OPENCLAW_SQLITE_BUSY_TIMEOUT_MS } from "./openclaw-state-db-contract-Cm9fKF2T.mjs";
import { t as assertTransactionUsable } from "./sqlite-transaction-DsZ3X6nD.mjs";
import { a as registerSqliteCacheExitClose, o as runInSqliteMaintenanceContext } from "./sqlite-wal-DUSYRhyv.mjs";
import { n as assertSupportedStateSchemaVersion } from "./openclaw-state-db-schema-version-CGQ4F6pb.mjs";
import { T as openTrackedStateDatabaseResult, f as openClawStateDatabaseCache } from "./openclaw-state-db-cache-BKCnj4of.mjs";
import { t as SQLITE_IDLE_HANDLE_TTL_MS } from "./sqlite-handle-lifecycle-dWd9h3ii.mjs";
import { a as isExistingOpenClawStateSchema } from "./openclaw-state-db-schema-policy-BxAJZRG6.mjs";
import { n as assertExistingOpenClawStateRuntimeSchema } from "./openclaw-state-db-existing-schema-C4QR2GGf.mjs";
import path from "node:path";
//#region src/state/openclaw-state-db-read-connection.ts
const retainedReaders = /* @__PURE__ */ new Map();
let unregisterExitClose;
function retireReader(reader) {
	clearTimeout(reader.idleTimer);
	reader.retiring = true;
	reader.connection.close();
	retainedReaders.delete(reader.identity.key);
	if (!retainedReaders.size) {
		unregisterExitClose?.();
		unregisterExitClose = void 0;
	}
}
function scheduleReaderRetirement(reader) {
	if (!getSqliteRuntimeCapabilities().explicitSqliteCloseReleasesNativeResources || retainedReaders.get(reader.identity.key) !== reader) return;
	clearTimeout(reader.idleTimer);
	reader.idleTimer = runInSqliteMaintenanceContext(() => setTimeout(() => {
		try {
			retireReader(reader);
		} catch (error) {
			process.emitWarning(`Idle shared-state reader cleanup failed: ${String(error)}`);
			scheduleReaderRetirement(reader);
		}
	}, SQLITE_IDLE_HANDLE_TTL_MS));
	reader.idleTimer.unref?.();
}
/** The host joins this receipt before allowing replacement or deletion of live state. */
function closeRetainedOpenClawStateReadConnections(identity) {
	const errors = [];
	for (const reader of retainedReaders.values()) if (identity === void 0 || reader.identity.key === identity) try {
		retireReader(reader);
	} catch (error) {
		errors.push(error);
	}
	throwSqliteLifecycleErrors(errors, "Retained shared-state reader cleanup failed.");
}
function borrowStateReadConnection(pathname, expectedIdentity) {
	isExistingOpenClawStateSchema(pathname);
	const identity = readDatabasePathIdentitySync(pathname);
	if (expectedIdentity !== void 0) assertExistingDatabaseIdentity(pathname, expectedIdentity);
	for (const previous of retainedReaders.values()) if (previous.identity.canonicalPath === identity.canonicalPath && previous.identity.key !== identity.key) retireReader(previous);
	if (!identity.key.startsWith("file:")) return openStateReadConnectionResult(pathname, pathname, expectedIdentity);
	let reader = retainedReaders.get(identity.key);
	if (reader?.retiring || reader && !reader.connection.database.db.isOpen) {
		retireReader(reader);
		reader = void 0;
	}
	if (!reader) {
		const opening = openStateReadConnectionResult(pathname, pathname, identity.key);
		if (opening.status === "unavailable") return opening;
		reader = {
			connection: opening.value,
			identity,
			retiring: false
		};
		retainedReaders.set(identity.key, reader);
		unregisterExitClose ??= registerSqliteCacheExitClose(closeRetainedOpenClawStateReadConnections);
	}
	const retained = reader;
	clearTimeout(retained.idleTimer);
	return {
		status: "available",
		value: {
			database: {
				db: retained.connection.database.db,
				path: pathname
			},
			close(keep) {
				if (keep && retained.connection.database.db.isOpen && !retained.connection.database.db.isTransaction) scheduleReaderRetirement(retained);
				else retireReader(retained);
				return true;
			}
		}
	};
}
var SnapshotCleanupIncompleteError = class extends Error {};
function assertStateReadSchema(database, pathname) {
	assertStateReadSchemaForPolicy(database, pathname, isExistingOpenClawStateSchema(pathname, database));
}
function assertStateReadSchemaForPolicy(database, pathname, existingSchema) {
	if (existingSchema) assertExistingOpenClawStateRuntimeSchema(database, pathname);
	else assertSupportedStateSchemaVersion(database, pathname);
}
function withOpenClawStateReadOnlyLocation(operation, pathname, source, openStateSchemaReadAdmission, expectedIdentity, snapshotRoot, retainConnection = false) {
	const result = readOpenClawStateReadOnlyLocation(operation, pathname, source, openStateSchemaReadAdmission, expectedIdentity, snapshotRoot, retainConnection);
	if (result.status === "unavailable") throw result.error;
	return result.value;
}
/** Return a failed read only after its native reader and admission have settled. */
function readOpenClawStateReadOnlyLocation(operation, pathname, source, openStateSchemaReadAdmission, expectedIdentity, snapshotRoot, retainConnection = false) {
	const opening = retainConnection && source === pathname && !snapshotRoot ? borrowStateReadConnection(pathname, expectedIdentity) : openStateReadConnectionResult(pathname, source, expectedIdentity, snapshotRoot, true);
	if (opening.status === "unavailable") return opening;
	const opened = opening.value;
	const errors = [];
	let closeAdmission;
	let result;
	try {
		closeAdmission = openStateSchemaReadAdmission?.(opened.database.db);
		const existingSchema = isExistingOpenClawStateSchema(pathname, opened.database.db);
		try {
			runSqliteReadOperationSync(opened.database.db, () => {
				assertStateReadSchemaForPolicy(opened.database.db, pathname, existingSchema);
				admitSqliteSchema(opened.database.db);
			});
			result = {
				status: "available",
				value: operation(opened.database)
			};
		} catch (error) {
			result = {
				status: "unavailable",
				error
			};
		}
		const location = typeof source === "string" ? source : source.location;
		if (result.status === "available" && location === pathname && isPromiseLike(result.value)) throw new SqliteCoordinatorError("SQLite source read must remain synchronous");
		assertTransactionUsable(opened.database.db);
	} catch (error) {
		errors.push(error);
	}
	try {
		closeAdmission?.();
	} catch (error) {
		errors.push(error);
	}
	try {
		if (!opened.close(errors.length === 0 && result?.status === "available")) throw new SnapshotCleanupIncompleteError("Shared-state snapshot cleanup is incomplete.");
	} catch (error) {
		errors.push(error);
	}
	if (errors.length) {
		if (result?.status === "unavailable" && !errors.includes(result.error)) errors.unshift(result.error);
		throwSqliteLifecycleErrors(errors, "Shared-state read and reader cleanup failed.");
	}
	return result;
}
/** Keep streamed rows on one private reader while callers yield or close the shared writer. */
async function* iterateOpenClawStateDatabaseReadOnly(source, operation, env = process.env) {
	const pathname = source.db.location();
	if (!pathname) throw new Error("Streaming shared-state reads require a filesystem-backed database.");
	openClawStateDatabaseCache.assertOpenClawStateDatabaseFreshOpenAllowedAtPath(pathname, env);
	const opened = openOpenClawStateReadOnlyLocation(pathname, pathname);
	try {
		opened.database.db.exec("BEGIN");
		return yield* operation(opened.database);
	} catch (error) {
		openClawStateDatabaseCache.evictOpenClawStateDatabaseAfterCorruption(source, error);
		throw error;
	} finally {
		try {
			if (opened.database.db.isTransaction) opened.database.db.exec("ROLLBACK");
		} finally {
			opened.close();
		}
	}
}
function openOpenClawStateReadOnlyLocation(pathname, source) {
	const connection = openOpenClawStateReadConnection(pathname, source);
	try {
		runSqliteReadOperationSync(connection.database.db, () => {
			assertStateReadSchema(connection.database.db, pathname);
			admitSqliteSchema(connection.database.db);
		});
	} catch (error) {
		try {
			connection.close();
		} catch (cleanupError) {
			throwSqliteLifecycleErrors([error, cleanupError], "Shared-state reader admission and cleanup failed.");
		}
		throw error;
	}
	return connection;
}
/** Own one native reader; callers retain their runtime or maintenance schema policy. */
function openOpenClawStateReadConnection(pathname, source, expectedIdentity, snapshotRoot) {
	const result = openStateReadConnectionResult(pathname, source, expectedIdentity, snapshotRoot);
	if (result.status === "unavailable") throw result.error;
	return result.value;
}
function openStateReadConnectionResult(pathname, source, expectedIdentity, snapshotRoot, checkSchemaPolicy = false) {
	const snapshot = typeof source === "string" ? void 0 : source;
	const location = typeof source === "string" ? source : source.location;
	const options = {
		readOnly: true,
		timeout: OPENCLAW_SQLITE_BUSY_TIMEOUT_MS
	};
	let releaseToken;
	const cleanupFailedOpen = (error) => {
		const errors = [error];
		try {
			releaseToken?.();
		} catch (cleanupError) {
			errors.push(cleanupError);
		}
		try {
			if (snapshot && !snapshot.cleanup()) errors.push(new SnapshotCleanupIncompleteError("Shared-state snapshot cleanup is incomplete."));
		} catch (cleanupError) {
			errors.push(cleanupError);
		}
		if (errors.length > 1) throw createSqliteLifecycleAggregateError(errors, "Shared-state reader open and cleanup failed.", error);
	};
	let native;
	try {
		if (expectedIdentity !== void 0) assertExistingDatabaseIdentity(location, expectedIdentity);
		releaseToken = snapshotRoot ? acquireSqliteSnapshotReadToken(snapshotRoot) : void 0;
		if (checkSchemaPolicy) isExistingOpenClawStateSchema(pathname);
		if (location === pathname) native = openTrackedStateDatabaseResult(pathname, options);
		else try {
			native = {
				status: "available",
				database: openNodeSqliteDatabase(location, options)
			};
		} catch (error) {
			native = {
				status: "unavailable",
				error
			};
		}
	} catch (error) {
		cleanupFailedOpen(error);
		throw error;
	}
	if (native.status === "unavailable") {
		cleanupFailedOpen(native.error);
		return native;
	}
	const db = native.database;
	let closed = false;
	let closing = false;
	const database = {
		db,
		path: pathname,
		afterClose: () => {
			releaseToken?.();
			if (snapshot && !snapshot.cleanup()) throw new SnapshotCleanupIncompleteError("Shared-state snapshot cleanup is incomplete.");
		}
	};
	const connection = {
		database: {
			db,
			path: pathname
		},
		snapshotSource: snapshot ? { retain() {
			const assertCurrent = () => {
				if (closing || closed) throw new Error("Shared-state snapshot source is closing or closed");
			};
			assertCurrent();
			return {
				location: snapshot.location,
				cleanupRoot: snapshot.cleanupRoot,
				assertCurrent,
				release: retainSnapshotTempDirectory(snapshot.cleanupRoot ?? path.dirname(snapshot.location))
			};
		} } : void 0,
		close() {
			if (closed) return false;
			closing = true;
			const errors = openClawStateDatabaseCache.closeOpenClawStateDatabaseHandle(database);
			if (errors.length === 1 && errors[0] instanceof SnapshotCleanupIncompleteError) return false;
			throwSqliteLifecycleErrors(errors, "Shared-state reader cleanup failed.");
			closed = true;
			return true;
		}
	};
	try {
		enableNodeSqliteKyselyStatementCache(db);
		if (expectedIdentity !== void 0) assertExistingDatabaseIdentity(location, expectedIdentity);
	} catch (error) {
		try {
			if (!connection.close()) throw new SnapshotCleanupIncompleteError("Shared-state snapshot cleanup is incomplete.");
		} catch (cleanupError) {
			throw createSqliteLifecycleAggregateError([error, cleanupError], "Shared-state reader identity and cleanup failed.", error);
		}
		throw error;
	}
	return {
		status: "available",
		value: connection
	};
}
//#endregion
export { withOpenClawStateReadOnlyLocation as a, openOpenClawStateReadOnlyLocation as i, iterateOpenClawStateDatabaseReadOnly as n, openOpenClawStateReadConnection as r, assertStateReadSchema as t };
