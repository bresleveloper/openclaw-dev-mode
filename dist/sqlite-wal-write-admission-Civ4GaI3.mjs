import { a as resolveGlobalSingleton } from "./global-singleton-DrXvEBww.mjs";
import { t as assertTransactionUsable } from "./sqlite-transaction-CpDyZPQ0.mjs";
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
export { registerSqliteWalWorkerMaintenance as a, registerDeferredSqliteWalWriteAdmission as i, createSqliteWalMaintenanceScheduler as n, isSqliteWalWorkerMaintained as r, cancelSqliteWalWriteAdmission as t };
