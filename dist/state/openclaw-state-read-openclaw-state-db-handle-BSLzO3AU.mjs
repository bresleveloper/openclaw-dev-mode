import { s as resolveGlobalSingleton } from "./openclaw-state-read-listeners-C6ALBiqg.mjs";
import { Dt as assertExistingDatabaseIdentity, Pt as readDatabasePathIdentitySync, _ as prepareSqliteDatabaseCleanClose } from "./openclaw-state-read-sqlite-database-admission-BXby_hL9.mjs";
import { d as isPostgresSqlConnection, f as sqlPublicationAnchor } from "./openclaw-state-read-sqlite-reader-lifecycle-CGTFS3iz.mjs";
import { T as registerNodeSqliteDisposeCallback, x as clearNodeSqliteKyselyCacheForDatabase } from "./openclaw-state-read-kysely-sync-DrKJlREt.mjs";
import { j as resolveExistingSqliteFileUri, k as openNodeSqliteDatabase, n as assertStateDatabaseAccessAllowed } from "./openclaw-state-read-gateway-state-owner-Bj-SghTS.mjs";
import { u as withSqliteNativeOpen } from "./openclaw-state-read-sqlite-error-diagnostics-B72btzpi.mjs";
import { t as assertTransactionUsable } from "./openclaw-state-read-sqlite-transaction-gPY-7Ojc.mjs";
import { setImmediate } from "node:timers/promises";
//#region src/infra/sqlite-wal-write-admission.ts
const admissions = resolveGlobalSingleton(Symbol.for("openclaw.sqliteWalWriteAdmissions"), () => /* @__PURE__ */ new WeakMap());
/** A worker-maintained writer never checkpoints inline; its maintenance owner ticks instead. */
function registerSqliteWalWorkerMaintenance(database, execute, cancel) {
	database.exec("PRAGMA wal_autocheckpoint = 0;");
	const stopCheckpointTick = admissions.get(database)?.stopCheckpointTick;
	admissions.set(database, {
		execute,
		cancel
	});
	stopCheckpointTick?.();
}
function isSqliteWalWorkerMaintained(database) {
	return admissions.get(database)?.execute !== void 0;
}
function cancelSqliteWalWriteAdmission(database) {
	return admissions.get(database)?.cancel?.();
}
function createSqliteWalMaintenanceScheduler(database, operation, prepare, observe, onError, pageBudget, stopCheckpointTick) {
	const existingAdmission = admissions.get(database);
	admissions.set(database, {
		...existingAdmission,
		stopCheckpointTick
	});
	let pending;
	return () => {
		if (!pending) {
			const run = async () => {
				let remaining = pageBudget();
				let continuation = false;
				while (true) {
					const request = prepare(remaining);
					if (!request || remaining === 0 && admissions.get(database)?.execute) return;
					request.continuation = continuation;
					let result;
					const admitted = () => {
						if (prepare(remaining)) result = operation(request);
					};
					const admission = admissions.get(database);
					if (admission?.execute) {
						result = await admission.execute(request);
						if (!prepare(remaining)) return;
						if (result?.checkpoint) observe(result.checkpoint);
					} else if (admission?.admit) await admission.admit(admitted);
					else admitted();
					const reclaimed = result?.reclaimedPages ?? 0;
					remaining -= reclaimed;
					if (reclaimed <= 0 || remaining <= 0) return;
					continuation = true;
					await setImmediate();
				}
			};
			pending = run().catch((error) => {
				if (prepare(0)) onError(error);
			}).finally(() => {
				pending = void 0;
			});
		}
		return pending;
	};
}
/** Retained Workers drain timer work only while their parent grants write admission. */
function registerDeferredSqliteWalWriteAdmission(database) {
	const existing = admissions.get(database)?.flush;
	if (existing) return existing;
	let pending;
	const flush = (assertCurrent) => {
		const current = pending;
		pending = void 0;
		if (current) try {
			assertCurrent();
			current.operation();
			current.resolve();
		} catch (error) {
			current.reject(error);
		}
		if (database.isOpen && database.isTransaction) assertTransactionUsable(database);
	};
	admissions.set(database, {
		stopCheckpointTick: admissions.get(database)?.stopCheckpointTick,
		admit: (operation) => new Promise((resolve, reject) => {
			pending = {
				operation,
				resolve,
				reject
			};
		}),
		flush,
		cancel: () => {
			pending?.resolve();
			pending = void 0;
		}
	});
	return flush;
}
//#endregion
//#region \0@oxc-project+runtime@0.152.0/helpers/esm/usingCtx.js
function _usingCtx() {
	var r = "function" == typeof SuppressedError ? SuppressedError : function(r, e) {
		var n = Error();
		return n.name = "SuppressedError", n.error = r, n.suppressed = e, n;
	}, e = {}, n = [];
	function using(r, e) {
		if (null != e) {
			if (Object(e) !== e) throw new TypeError("using declarations can only be used with objects, functions, null, or undefined.");
			if (r) var o = e[Symbol.asyncDispose || Symbol["for"]("Symbol.asyncDispose")];
			if (void 0 === o && (o = e[Symbol.dispose || Symbol["for"]("Symbol.dispose")], r)) var t = o;
			if ("function" != typeof o) throw new TypeError("Object is not disposable.");
			t && (o = function o() {
				try {
					t.call(e);
				} catch (r) {
					return Promise.reject(r);
				}
			}), n.push({
				v: e,
				d: o,
				a: r
			});
		} else r && n.push({
			d: e,
			a: r
		});
		return e;
	}
	return {
		e,
		u: using.bind(null, !1),
		a: using.bind(null, !0),
		d: function d() {
			var o, t = this.e, s = 0;
			function next() {
				for (; o = n.pop();) try {
					if (!o.a && 1 === s) return s = 0, n.push(o), Promise.resolve().then(next);
					if (o.d) {
						var r = o.d.call(o.v);
						if (o.a) return s |= 2, Promise.resolve(r).then(next, err);
					} else s |= 1;
				} catch (r) {
					return err(r);
				}
				if (1 === s) return t !== e ? Promise.reject(t) : Promise.resolve();
				if (t !== e) throw t;
			}
			function err(n) {
				return t = t !== e ? new r(n, t) : n, next();
			}
			return next();
		}
	};
}
//#endregion
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
export { readTrackedStateDatabaseIdentity as a, createSqliteWalMaintenanceScheduler as c, registerSqliteWalWorkerMaintenance as d, openTrackedStateDatabaseResult as i, isSqliteWalWorkerMaintained as l, closeTrackedStateDatabase as n, _usingCtx as o, openTrackedStateDatabase as r, cancelSqliteWalWriteAdmission as s, closeStateDatabaseHandle as t, registerDeferredSqliteWalWriteAdmission as u };
