import { a as resolveGlobalSingleton } from "./global-singleton-DrXvEBww.mjs";
import { f as readDatabasePathIdentitySync, r as assertExistingDatabaseIdentity } from "./sqlite-worker-identity-DLqVBf5J.mjs";
import { r as assertStateDatabaseAccessAllowed } from "./gateway-state-owner-X3EqhtYx.mjs";
import { i as sqlPublicationAnchor, r as isPostgresSqlConnection } from "./sql-connection-DmQzXTVz.mjs";
import { c as registerNodeSqliteDisposeCallback, t as clearNodeSqliteKyselyCacheForDatabase } from "./kysely-sync-cache-state-Dc7tna9E.mjs";
import { y as prepareSqliteDatabaseCleanClose } from "./sqlite-database-admission-CqdNF9iE.mjs";
import { a as resolveExistingSqliteFileUri, r as openNodeSqliteDatabase } from "./node-sqlite-CYaq-2Hb.mjs";
import { p as withSqliteNativeOpen } from "./sqlite-error-diagnostics-BBfTUJBR.mjs";
import { r as isSqliteWalWorkerMaintained } from "./sqlite-wal-write-admission-Civ4GaI3.mjs";
import { t as _usingCtx } from "./usingCtx-BhiZp_rS.mjs";
//#region src/state/openclaw-state-db-handle.ts
const identities = resolveGlobalSingleton(Symbol.for("openclaw.stateNativeIdentities"), () => /* @__PURE__ */ new WeakMap());
/** Physical identity admitted by the native opener, never a later pathname observation. */
function readTrackedStateDatabaseIdentity(database) {
	return identities.get(sqlPublicationAnchor(database));
}
function openTrackedStateDatabase(pathname, options) {
	const result = openTrackedStateDatabaseResult(pathname, options);
	if (result.status === "unavailable") throw result.error;
	return result.database;
}
/** Native open failure is an ordinary read failure; admitted handles retain their own cleanup. */
function openTrackedStateDatabaseResult(pathname, options) {
	assertStateDatabaseAccessAllowed(pathname);
	try {
		if (options?.expectedIdentity !== void 0) assertExistingDatabaseIdentity(pathname, options.expectedIdentity);
		const location = options?.existingOnly || options?.expectedIdentity !== void 0 ? resolveExistingSqliteFileUri(pathname) : pathname;
		const nativeOptions = options?.readOnly ? {
			readOnly: true,
			timeout: options.timeout
		} : { enableForeignKeyConstraints: options?.enableForeignKeyConstraints };
		const openingIdentity = readDatabasePathIdentitySync(pathname);
		const database = withSqliteNativeOpen(() => openNodeSqliteDatabase(location, nativeOptions));
		try {
			assertStateDatabaseAccessAllowed(pathname);
			if (openingIdentity.key.startsWith("file:")) assertExistingDatabaseIdentity(pathname, openingIdentity.key, openingIdentity.birthtime);
			const identity = openingIdentity.key.startsWith("file:") ? openingIdentity : readDatabasePathIdentitySync(pathname);
			if (identity.key.startsWith("file:")) {
				identities.set(database, identity);
				const unregister = registerNodeSqliteDisposeCallback(database, () => {
					identities.delete(database);
					unregister();
				});
			}
		} catch (error) {
			database.close();
			throw error;
		}
		return {
			status: "available",
			database
		};
	} catch (error) {
		return {
			status: "unavailable",
			error
		};
	}
}
function closeTrackedStateDatabase(database) {
	if (database.isOpen) database.close();
}
/** Finish all native close stages even when a previous stage failed. */
function closeStateDatabaseHandle(database, options) {
	try {
		var _usingCtx$1 = _usingCtx();
		const errors = [];
		if (isPostgresSqlConnection(database.db)) {
			for (const connection of [database.db, database.db.anchor]) {
				if (connection === database.db.anchor && database.db.isOpen) break;
				try {
					if (connection.isOpen) connection.close();
				} catch (error) {
					errors.push(error);
				}
			}
			let cleanupPending = database.db.isOpen || database.db.anchor.isOpen;
			if (!cleanupPending) try {
				database.afterClose?.();
			} catch (error) {
				errors.push(error);
				cleanupPending = true;
			}
			return {
				errors,
				cleanupPending
			};
		}
		const seal = _usingCtx$1.u(prepareSqliteDatabaseCleanClose(database.db));
		const delegated = isSqliteWalWorkerMaintained(database.db);
		const priorCheckpointError = database.walMaintenance?.health?.state === "error";
		let checkpointed = false;
		try {
			checkpointed = database.walMaintenance?.close(options) === true && options?.checkpointMode !== "PASSIVE";
		} catch (error) {
			errors.push(error);
		}
		try {
			clearNodeSqliteKyselyCacheForDatabase(database.db);
		} catch (error) {
			errors.push(error);
		}
		try {
			closeTrackedStateDatabase(database.db);
		} catch (error) {
			errors.push(error);
		}
		let cleanupPending = false;
		if (!database.db.isOpen) try {
			database.afterClose?.();
		} catch (error) {
			errors.push(error);
			cleanupPending = true;
		}
		if (errors.length === 0 && !cleanupPending && options?.checkpointMode !== "PASSIVE" && (checkpointed || delegated && !priorCheckpointError)) seal.publish();
		return {
			errors,
			cleanupPending
		};
	} catch (_) {
		_usingCtx$1.e = _;
	} finally {
		_usingCtx$1.d();
	}
}
//#endregion
export { readTrackedStateDatabaseIdentity as a, openTrackedStateDatabaseResult as i, closeTrackedStateDatabase as n, openTrackedStateDatabase as r, closeStateDatabaseHandle as t };
