import { t as runInDetachedAsyncContext } from "./detached-async-context-D04NzekX.mjs";
import { f as readDatabasePathIdentitySync, r as assertExistingDatabaseIdentity } from "./sqlite-worker-identity-DLqVBf5J.mjs";
import { t as isPromiseLike } from "./promise-like-D7-l5Fsp.mjs";
import { a as createSqliteLifecycleAggregateError, i as SqliteCoordinatorError, s as throwSqliteLifecycleErrors } from "./sqlite-lifecycle-errors-Ca_9goHE.mjs";
import { m as observeOpenClawDatabaseMaintenanceResource } from "./openclaw-state-db-async-lifecycle-CtHZ7B35.mjs";
import { s as OPENCLAW_SQLITE_BUSY_TIMEOUT_MS } from "./openclaw-state-db-contract-QlwTsE6j.mjs";
import { r as isPostgresSqlConnection } from "./sql-connection-DmQzXTVz.mjs";
import { r as enableNodeSqliteKyselyStatementCache } from "./kysely-sync-cache-state-Dc7tna9E.mjs";
import { o as getSqliteRuntimeCapabilities } from "./bun-sqlite-library-CYR1RYZS.mjs";
import { P as resolveSqliteDatabaseFilePath } from "./sqlite-database-admission-CqdNF9iE.mjs";
import { p as runSqliteReadOperationSync } from "./sqlite-schema-facts-C8u_9Af1.mjs";
import { r as openNodeSqliteDatabase } from "./node-sqlite-CYaq-2Hb.mjs";
import { i as isSqliteCorruptionError } from "./sqlite-error-diagnostics-BBfTUJBR.mjs";
import { u as retainSnapshotTempDirectory } from "./sqlite-readonly-location-cleanup-zmu6YCue.mjs";
import { m as openClawStateDatabaseCache } from "./openclaw-state-db-cache-R1v7ogY0.mjs";
import { o as registerSqliteCacheExitClose } from "./sqlite-wal-D2XTertL.mjs";
import { t as assertTransactionUsable } from "./sqlite-transaction-CpDyZPQ0.mjs";
import { t as acquireSqliteSnapshotReadToken } from "./sqlite-snapshot-staging-B4VrWJSe.mjs";
import { r as requireNativeDatabaseFile } from "./physical-facts-Cvtfrs3r.mjs";
import { n as admitStateSchemaFacts, r as assertSupportedStateSchemaVersion } from "./openclaw-state-db-schema-version-CcCTuttF.mjs";
import { t as SQLITE_IDLE_HANDLE_TTL_MS } from "./sqlite-handle-lifecycle-dWd9h3ii.mjs";
import { a as isExistingOpenClawStateSchema } from "./openclaw-state-db-schema-policy-CuEyLsE2.mjs";
import { i as openTrackedStateDatabaseResult } from "./openclaw-state-db-handle-B6qa1Bui.mjs";
import { r as invalidateOpenClawStateRuntimeIntegrity } from "./openclaw-state-db-integrity-admission-BHpYd_s7.mjs";
import { a as isStatePostgres, n as assertStateFileSnapshotAllowed, o as openStatePostgresReadConnection } from "./openclaw-state-db-engine-DST3Q_pv.mjs";
import { a as getSqliteWorkerStateIntegrityAdmission } from "./sqlite-worker-state-context-QuvwmAax.mjs";
import { t as assertExistingOpenClawStateRuntimeSchema } from "./openclaw-state-db-existing-schema-BmPsgSiy.mjs";
import path from "node:path";
//#region src/state/openclaw-state-db-read-schema.ts
function assertStateReadSchemaForPolicy(database, pathname, existingSchema, integrityPolicy, readContentVersionRow) {
	if (isPostgresSqlConnection(database)) {
		if (integrityPolicy !== void 0) requireNativeDatabaseFile("postgres", "integrity");
		assertSupportedStateSchemaVersion(database, pathname, void 0, readContentVersionRow);
		return;
	}
	if (existingSchema) assertExistingOpenClawStateRuntimeSchema(database, pathname, getSqliteWorkerStateIntegrityAdmission(), integrityPolicy);
	else assertSupportedStateSchemaVersion(database, pathname, void 0, readContentVersionRow);
}
//#endregion
//#region src/state/openclaw-state-db-read-connection.ts
const retainedReaders = /* @__PURE__ */ new Map();
const corruptedReaders = /* @__PURE__ */ new WeakSet();
let unregisterExitClose;
function retireReader(reader) {
	if (retainedReaders.get(reader.identity.key) !== reader) return;
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
	reader.idleTimer = runInDetachedAsyncContext(() => setTimeout(() => {
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
	if (isStatePostgres()) return openStateReadConnectionResult(pathname, pathname, expectedIdentity, void 0, true);
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
	if (reader?.borrowed) return openStateReadConnectionResult(pathname, pathname, identity.key);
	if (!reader) {
		const opening = openStateReadConnectionResult(pathname, pathname, identity.key);
		if (opening.status === "unavailable") return opening;
		reader = {
			connection: opening.value,
			identity,
			retiring: false,
			borrowed: false
		};
		retainedReaders.set(identity.key, reader);
		unregisterExitClose ??= registerSqliteCacheExitClose(closeRetainedOpenClawStateReadConnections);
	}
	const retained = reader;
	observeOpenClawDatabaseMaintenanceResource(retained);
	retained.borrowed = true;
	clearTimeout(retained.idleTimer);
	return {
		status: "available",
		value: {
			database: {
				db: retained.connection.database.db,
				path: pathname
			},
			close(keep) {
				retained.borrowed = false;
				if (keep && retained.connection.database.db.isOpen && !retained.connection.database.db.isTransaction) scheduleReaderRetirement(retained);
				else retireReader(retained);
				return true;
			}
		}
	};
}
var SnapshotCleanupIncompleteError = class extends Error {};
function assertStateReadSchema(database, pathname, integrityPolicy) {
	assertStateReadSchemaForPolicy(database, pathname, isExistingOpenClawStateSchema(pathname, database), integrityPolicy);
}
function withOpenClawStateReadOnlyLocation(operation, pathname, source, openStateSchemaReadAdmission, expectedIdentity, snapshotRoot, retainConnection = false, readContentVersionRow) {
	const result = readOpenClawStateReadOnlyLocation(operation, pathname, source, openStateSchemaReadAdmission, expectedIdentity, snapshotRoot, retainConnection, readContentVersionRow);
	if (result.status === "unavailable") throw result.error;
	return result.value;
}
/** Return a failed read only after its native reader and admission have settled. */
function readOpenClawStateReadOnlyLocation(operation, pathname, source, openStateSchemaReadAdmission, expectedIdentity, snapshotRoot, retainConnection = false, readContentVersionRow) {
	const opening = retainConnection && source === pathname && !snapshotRoot ? borrowStateReadConnection(pathname, expectedIdentity) : openStateReadConnectionResult(pathname, source, expectedIdentity, snapshotRoot, true);
	if (opening.status === "unavailable") return opening;
	const opened = opening.value;
	const errors = [];
	let closeAdmission;
	let result;
	try {
		if (openStateSchemaReadAdmission) {
			if (isPostgresSqlConnection(opened.database.db)) requireNativeDatabaseFile("postgres", "repair");
			closeAdmission = openStateSchemaReadAdmission(opened.database.db);
		}
		const existingSchema = isExistingOpenClawStateSchema(pathname, opened.database.db);
		try {
			const read = () => runSqliteReadOperationSync(opened.database.db, () => {
				admitStateSchemaFacts(opened.database.db, pathname);
				assertStateReadSchemaForPolicy(opened.database.db, pathname, existingSchema, void 0, readContentVersionRow);
				return operation(opened.database);
			});
			result = {
				status: "available",
				value: isPostgresSqlConnection(opened.database.db) ? opened.database.db.runTransaction(read, void 0, true) : read()
			};
		} catch (error) {
			if (!isPostgresSqlConnection(opened.database.db) && isSqliteCorruptionError(error)) {
				invalidateOpenClawStateRuntimeIntegrity(opened.database.db);
				corruptedReaders.add(opened.database.db);
			}
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
		const allowDeferredSnapshotCleanup = typeof source !== "string" && errors.length === 0 && result?.status === "available" && !getSqliteRuntimeCapabilities().explicitSqliteCloseReleasesNativeResources;
		if (!opened.close(errors.length === 0 && result?.status === "available" && !corruptedReaders.has(opened.database.db)) && !allowDeferredSnapshotCleanup) throw new SnapshotCleanupIncompleteError("Shared-state snapshot cleanup is incomplete.");
	} catch (error) {
		errors.push(error);
	}
	if (errors.length) {
		if (result?.status === "unavailable" && !errors.includes(result.error)) errors.unshift(result.error);
		throwSqliteLifecycleErrors(errors, "Shared-state read and reader cleanup failed.");
	}
	return result;
}
function openOpenClawStateReadOnlyLocation(pathname, source) {
	const connection = openOpenClawStateReadConnection(pathname, source);
	try {
		runSqliteReadOperationSync(connection.database.db, () => {
			admitStateSchemaFacts(connection.database.db, pathname);
			assertStateReadSchema(connection.database.db, pathname);
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
	const physicalLocation = resolveSqliteDatabaseFilePath(location);
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
		if (isStatePostgres()) {
			if (source !== pathname || snapshotRoot) assertStateFileSnapshotAllowed();
			if (checkSchemaPolicy) isExistingOpenClawStateSchema(pathname);
			const postgres = openStatePostgresReadConnection(pathname, expectedIdentity);
			if (postgres) return {
				status: "available",
				value: postgres
			};
		}
		if (expectedIdentity !== void 0) assertExistingDatabaseIdentity(physicalLocation, expectedIdentity);
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
		if (expectedIdentity !== void 0) assertExistingDatabaseIdentity(physicalLocation, expectedIdentity);
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
export { withOpenClawStateReadOnlyLocation as i, openOpenClawStateReadConnection as n, openOpenClawStateReadOnlyLocation as r, assertStateReadSchema as t };
