import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { i as resolveGlobalSingleton } from "./global-singleton-Dc_stLtU.mjs";
import { t as hasErrnoCode } from "./errno-CkbDOfLk.mjs";
import { r as getChildLogger } from "./logger--ALOusOG.mjs";
import { u as retainSnapshotWork } from "./sqlite-readonly-location-cleanup-uwwsHidB.mjs";
import { a as prepareSqliteReadOnlyLocationFromOwnedDatabase } from "./sqlite-readonly-location-BpMwSm5l.mjs";
import { i as readDatabasePathIdentitySync } from "./sqlite-worker-identity-CR_ZuhW6.mjs";
import fs from "node:fs";
//#region src/infra/sqlite-snapshot-single-flight.ts
const snapshotFlights = resolveGlobalSingleton(Symbol.for("openclaw.sqliteSnapshotFlights"), () => /* @__PURE__ */ new Map());
async function waitForFlight(promise, signal, withdraw) {
	if (signal?.aborted) {
		withdraw();
		signal.throwIfAborted();
	}
	if (!signal) return promise;
	return await new Promise((resolve, reject) => {
		const release = () => signal.removeEventListener("abort", abort);
		const abort = () => {
			release();
			withdraw();
			reject(signal.reason instanceof Error ? signal.reason : /* @__PURE__ */ new Error("SQLite snapshot aborted"));
		};
		signal.addEventListener("abort", abort, { once: true });
		promise.then((value) => {
			release();
			resolve(value);
		}, (error) => {
			release();
			reject(error instanceof Error ? error : new Error(String(error)));
		});
		if (signal.aborted) abort();
	});
}
function cleanupUnleasedFlight(key, flight) {
	if (flight.waiters > 0 || flight.leases > 0) return;
	if (snapshotFlights.get(key) === flight) snapshotFlights.delete(key);
	if (!flight.base) flight.controller.abort();
}
function releaseFlight(key, flight, asyncCleanup) {
	if (flight.leases > 1 || flight.waiters > 0) {
		flight.leases -= 1;
		return asyncCleanup ? Promise.resolve(true) : true;
	}
	const finish = (cleaned) => {
		if (cleaned) {
			flight.leases -= 1;
			if (snapshotFlights.get(key) === flight) snapshotFlights.delete(key);
		}
		return cleaned;
	};
	return asyncCleanup ? flight.base.cleanupAsync().then(finish) : finish(flight.base.cleanup());
}
function leaseFlight(key, flight, base) {
	flight.leases += 1;
	let active = true;
	let pending;
	return {
		location: base.location,
		cleanupRoot: base.cleanupRoot,
		cleanup: () => {
			if (!active) return true;
			if (pending) return false;
			const cleaned = releaseFlight(key, flight, false);
			active = !cleaned;
			return cleaned;
		},
		cleanupAsync: () => {
			if (!active) return pending ?? Promise.resolve(true);
			pending ??= releaseFlight(key, flight, true).then((cleaned) => {
				active = !cleaned;
				return cleaned;
			}).finally(() => {
				pending = void 0;
			});
			return pending;
		}
	};
}
async function prepareSingleFlightSqliteSnapshot(databasePath, operation, producer, signal, lifecycle) {
	signal?.throwIfAborted();
	const key = `${readDatabasePathIdentitySync(databasePath).key}:${operation}`;
	let flight = snapshotFlights.get(key);
	if (!flight) {
		const controller = new AbortController();
		const waitersDrained = createDeferredCore();
		const produced = Promise.resolve().then(() => producer(controller.signal, (error) => {
			flight.cleanupFailure ??= { error };
		}));
		flight = {
			controller,
			leases: 0,
			waiters: 0,
			promise: produced,
			settled: produced,
			finishWaiters: () => waitersDrained.resolve()
		};
		snapshotFlights.set(key, flight);
		flight.promise = produced.then((base) => {
			flight.base = base;
			if (snapshotFlights.get(key) === flight) snapshotFlights.delete(key);
			return base;
		}, (error) => {
			if (snapshotFlights.get(key) === flight) snapshotFlights.delete(key);
			throw error;
		});
		flight.settled = retainSnapshotWork(flight.promise.then(async (base) => {
			await waitersDrained.promise;
			if (flight.leases === 0) try {
				if (!await base.cleanupAsync()) throw new Error("SQLite orphan snapshot cleanup did not complete");
			} catch (error) {
				flight.cleanupFailure ??= { error };
				try {
					getChildLogger({ subsystem: "infra/sqlite-snapshot" }).warn({ cleanupRoot: base.cleanupRoot }, "SQLite orphan snapshot cleanup failed; retained for cleanup retry.");
				} catch {}
				throw error;
			}
			return base;
		}), () => controller.abort(/* @__PURE__ */ new Error("SQLite snapshot owner stopped")));
		flight.settled.catch(() => void 0);
	}
	lifecycle?.trackProducer?.(flight.settled);
	flight.waiters += 1;
	let waiting = true;
	const withdraw = () => {
		if (!waiting) return;
		waiting = false;
		flight.waiters -= 1;
		if (flight.waiters === 0) flight.finishWaiters();
		cleanupUnleasedFlight(key, flight);
	};
	let outcome;
	try {
		const base = await waitForFlight(flight.promise, signal, withdraw);
		signal?.throwIfAborted();
		outcome = { value: leaseFlight(key, flight, base) };
	} catch (error) {
		outcome = { error };
	}
	withdraw();
	if (flight.waiters === 0 && flight.leases === 0 && !lifecycle?.trackProducer) try {
		await flight.settled;
	} catch {
		if (flight.cleanupFailure) throw flight.cleanupFailure.error;
	}
	if ("error" in outcome) throw outcome.error;
	return outcome.value;
}
//#endregion
//#region src/infra/sqlite-live-snapshot.ts
const liveOwners = resolveGlobalSingleton(Symbol.for("openclaw.sqliteLiveSnapshotOwners"), () => /* @__PURE__ */ new Map());
function readSourceSizes(pathname) {
	const size = (candidate) => {
		try {
			const stat = fs.statSync(candidate);
			return stat.isFile() ? stat.size : 0;
		} catch (error) {
			if (hasErrnoCode(error, "ENOENT")) return 0;
			throw error;
		}
	};
	return {
		sourceMainBytes: size(pathname),
		sourceWalBytes: size(`${pathname}-wal`)
	};
}
function emitLiveSnapshotTelemetry(fields, error) {
	try {
		getChildLogger({ subsystem: "infra/sqlite-snapshot" }).debug({
			...fields,
			errorCode: error && typeof error === "object" && "code" in error ? String(error.code) : void 0
		}, "SQLite snapshot operation completed.");
	} catch {}
}
function registerLiveSqliteSnapshotOwner(options) {
	const identity = readDatabasePathIdentitySync(options.databasePath);
	const registration = {
		assertCurrent: options.assertCurrent,
		database: options.database,
		owner: options.owner
	};
	liveOwners.set(identity.key, registration);
	return () => {
		if (liveOwners.get(identity.key) === registration) liveOwners.delete(identity.key);
	};
}
function prepareSqliteSnapshotFromLiveOwner(databasePath, signal) {
	signal?.throwIfAborted();
	const identity = readDatabasePathIdentitySync(databasePath);
	const owner = liveOwners.get(identity.key);
	if (!owner) return;
	owner.assertCurrent();
	return prepareSingleFlightSqliteSnapshot(identity.canonicalPath, `live-owner:${owner.owner}`, async (flightSignal) => {
		const sizes = readSourceSizes(identity.canonicalPath);
		const started = performance.now();
		try {
			const prepared = await prepareSqliteReadOnlyLocationFromOwnedDatabase(owner.database, owner.assertCurrent, flightSignal);
			emitLiveSnapshotTelemetry({
				...sizes,
				attempt: 1,
				copiedBytes: fs.statSync(prepared.location).size,
				durationMs: Math.max(0, performance.now() - started),
				operation: "online-backup",
				outcome: "success",
				owner: owner.owner,
				waitMs: 0
			});
			return prepared;
		} catch (error) {
			emitLiveSnapshotTelemetry({
				...sizes,
				attempt: 1,
				copiedBytes: 0,
				durationMs: Math.max(0, performance.now() - started),
				operation: "online-backup",
				outcome: "error",
				owner: owner.owner,
				waitMs: 0
			}, error);
			throw error;
		}
	}, signal);
}
//#endregion
export { registerLiveSqliteSnapshotOwner as n, prepareSingleFlightSqliteSnapshot as r, prepareSqliteSnapshotFromLiveOwner as t };
