import { a as resolveGlobalSingleton } from "./global-singleton-0m-JziJW.mjs";
import { u as readDatabasePathIdentitySync } from "./sqlite-worker-identity-KSR14F6C.mjs";
import { i as mapRetainedOperation, r as flatMapRetainedOperation, t as createRetainedOperation } from "./retained-operation-CODoIe4t.mjs";
import { a as prepareSqliteReadOnlyLocationFromOwnedDatabase } from "./sqlite-readonly-location-OdGkIPCl.mjs";
import { r as getChildLogger } from "./logger-Mnn26Jj7.mjs";
import { c as emitSqliteSnapshotTelemetry, l as sqliteSnapshotSourceFileSize } from "./sqlite-snapshot-staging-BIgaAYlp.mjs";
import { d as retainSnapshotWork, t as SqliteSnapshotCleanupError } from "./sqlite-readonly-location-cleanup-CPS8QEIp.mjs";
import fs from "node:fs";
//#region src/infra/sqlite-snapshot-single-flight.ts
const snapshotFlights = resolveGlobalSingleton(Symbol.for("openclaw.sqliteSnapshotFlights"), () => ({
	unscoped: /* @__PURE__ */ new Map(),
	scoped: /* @__PURE__ */ new WeakMap()
}));
function startCloseProducer(flight) {
	if (flight.producerClose && flight.producerClose.read().status !== "rejected") return flight.producerClose;
	if (flight.startProducerClose) {
		flight.producerClose = flight.startProducerClose();
		flight.producerClose.result.then(() => flight.settled.service(), () => flight.settled.service());
		return flight.producerClose;
	}
	const completion = createRetainedOperation(() => {});
	if (flight.ownedProduction) completion.reject(new SqliteSnapshotCleanupError("SQLite snapshot producer cleanup custody is unavailable"));
	else completion.resolve(void 0);
	return completion.operation;
}
function removeFlight(key, flight) {
	if (flight.flights.get(key) === flight) flight.flights.delete(key);
}
function startReleaseFlight(key, flight) {
	if (flight.leases > 1 || flight.waiters > 0) {
		const retained = createRetainedOperation(() => {});
		flight.leases--;
		retained.resolve(true);
		return retained.operation;
	}
	const cleanup = flight.startCleanup();
	return flatMapRetainedOperation(cleanup, (removed) => {
		if (!removed) return cleanup;
		return mapRetainedOperation(startCloseProducer(flight), () => {
			flight.leases--;
			removeFlight(key, flight);
			return true;
		});
	});
}
function leaseFlight(key, flight, base) {
	flight.leases++;
	let active = true;
	let pending;
	const startCleanup = () => {
		if (pending?.read().status === "pending") return pending;
		let release;
		const retained = createRetainedOperation(() => {
			if (!release || retained.operation.read().status !== "pending") return;
			release.service();
			const outcome = release.read();
			if (outcome.status === "rejected") retained.reject(outcome.error);
			else if (outcome.status === "fulfilled") {
				active = !outcome.value;
				retained.resolve(outcome.value);
			}
		});
		pending = retained.operation;
		if (!active) retained.resolve(true);
		else {
			release = startReleaseFlight(key, flight);
			release.result.then(() => retained.operation.service(), () => retained.operation.service());
			retained.operation.service();
		}
		return retained.operation;
	};
	return {
		location: base.location,
		cleanupRoot: base.cleanupRoot,
		cleanup() {
			if (!active) return true;
			if (pending?.read().status === "pending") return false;
			if (flight.leases > 1 || flight.waiters > 0) {
				flight.leases--;
				active = false;
				return true;
			}
			const cleaned = base.cleanup();
			if (cleaned) {
				flight.leases--;
				active = false;
				removeFlight(key, flight);
			}
			return cleaned;
		},
		cleanupAsync: () => startCleanup().result,
		startCleanup
	};
}
function createFlight(flights, key, producer, ownedProduction) {
	let pendingProducer = producer;
	let servicing = false;
	const settled = createRetainedOperation(() => {
		if (servicing || settled.operation.read().status !== "pending") return;
		servicing = true;
		try {
			if (!flight.production && !flight.outcome) try {
				const startProducer = pendingProducer;
				pendingProducer = void 0;
				if (!startProducer) throw new Error("SQLite snapshot producer has already been consumed");
				const production = startProducer(flight.controller.signal, (error) => {
					flight.cleanupFailure ??= { error };
				});
				flight.production = production.operation;
				flight.startProducerClose = production.startClose;
				flight.production.result.then(() => settled.operation.service(), () => settled.operation.service());
			} catch (error) {
				flight.outcome = { error };
			}
			if (!flight.outcome && flight.production) {
				flight.production.service();
				const produced = flight.production.read();
				if (produced.status === "pending") return;
				if (produced.status === "fulfilled") {
					flight.base = produced.value.base;
					flight.startCleanup = produced.value.startCleanup.bind(produced.value);
					flight.outcome = { value: produced.value.base };
				} else flight.outcome = { error: produced.error };
				flight.production = void 0;
			}
			removeFlight(key, flight);
			for (const waiter of Array.from(flight.listeners)) waiter.service();
			if (flight.waiters > 0 || !flight.outcome) return;
			if ("error" in flight.outcome) settled.reject(flight.outcome.error);
			else if (flight.leases > 0) settled.resolve(flight.outcome.value);
			else {
				if (!flight.cleanup) {
					flight.cleanup = flight.startCleanup();
					flight.cleanup.result.then(() => settled.operation.service(), () => settled.operation.service());
				}
				flight.cleanup.service();
				const removed = flight.cleanup.read();
				if (removed.status === "pending") return;
				if (removed.status === "rejected" || !removed.value) {
					const error = removed.status === "rejected" ? removed.error : /* @__PURE__ */ new Error("SQLite orphan snapshot cleanup did not complete");
					flight.cleanupFailure ??= { error };
					try {
						getChildLogger({ subsystem: "infra/sqlite-snapshot" }).warn({ cleanupRoot: flight.base?.cleanupRoot }, "SQLite orphan snapshot cleanup failed; retained for cleanup retry.");
					} catch {}
					settled.reject(error);
				} else {
					const producerClose = startCloseProducer(flight);
					producerClose.service();
					const joined = producerClose.read();
					if (joined.status === "pending") return;
					if (joined.status === "rejected") {
						flight.cleanupFailure ??= { error: joined.error };
						settled.reject(joined.error);
					} else settled.resolve(flight.outcome.value);
				}
			}
			for (const waiter of Array.from(flight.listeners)) waiter.service();
		} finally {
			servicing = false;
		}
	});
	const flight = {
		flights,
		controller: new AbortController(),
		leases: 0,
		waiters: 0,
		listeners: /* @__PURE__ */ new Set(),
		ownedProduction,
		settled: settled.operation
	};
	retainSnapshotWork(settled.operation.result, () => {
		flight.controller.abort(/* @__PURE__ */ new Error("SQLite snapshot owner stopped"));
		settled.operation.service();
	});
	return flight;
}
function startSnapshotFlight(databasePath, operation, producer, signal, lifecycle, ownedProduction = false) {
	signal?.throwIfAborted();
	const key = `${readDatabasePathIdentitySync(databasePath).key}:${operation}`;
	let flights = snapshotFlights.unscoped;
	if (lifecycle?.scope) {
		const scoped = snapshotFlights.scoped.get(lifecycle.scope);
		if (scoped) flights = scoped;
		else {
			flights = /* @__PURE__ */ new Map();
			snapshotFlights.scoped.set(lifecycle.scope, flights);
		}
	}
	let flight = flights.get(key);
	if (!flight) {
		flight = createFlight(flights, key, producer, ownedProduction);
		flights.set(key, flight);
	}
	const selected = flight;
	lifecycle?.trackProducer?.(selected.settled.result);
	selected.waiters++;
	let waiting = true;
	let servicing = false;
	let closeRequested = false;
	let closed = false;
	let closing;
	const closeReason = /* @__PURE__ */ new Error("SQLite snapshot preparation closed");
	let outcome;
	const retained = createRetainedOperation(() => {
		if (servicing || retained.operation.read().status !== "pending") return;
		servicing = true;
		try {
			if (!outcome && (closeRequested || signal?.aborted)) outcome = { error: signal?.reason instanceof Error ? signal.reason : closeRequested ? closeReason : /* @__PURE__ */ new Error("SQLite snapshot aborted") };
			if (!outcome) {
				selected.settled.service();
				if (!selected.outcome) return;
				outcome = "error" in selected.outcome ? selected.outcome : { value: leaseFlight(key, selected, selected.outcome.value) };
			}
			if (waiting) {
				waiting = false;
				selected.waiters--;
				signal?.removeEventListener("abort", serviceWaiter);
				if (selected.waiters === 0 && selected.leases === 0) {
					removeFlight(key, selected);
					if (!selected.base) selected.controller.abort();
				}
			}
			selected.settled.service();
			if (selected.waiters === 0 && selected.leases === 0 && !lifecycle?.trackProducer) {
				if (selected.settled.read().status === "pending") return;
				if (selected.cleanupFailure) outcome = { error: selected.cleanupFailure.error };
			}
			selected.listeners.delete(retained.operation);
			if ("error" in outcome) retained.reject(outcome.error);
			else retained.resolve(outcome.value);
		} finally {
			servicing = false;
		}
	});
	const serviceWaiter = retained.operation.service.bind(retained.operation);
	selected.listeners.add(retained.operation);
	signal?.addEventListener("abort", serviceWaiter, { once: true });
	queueMicrotask(() => retained.operation.service());
	if (signal?.aborted) retained.operation.service();
	const startClose = () => {
		if (closing?.read().status === "pending") return closing;
		closeRequested = true;
		let leaseClose;
		let producerClose;
		let servicingClose = false;
		const completion = createRetainedOperation(() => {
			if (servicingClose || completion.operation.read().status !== "pending") return;
			servicingClose = true;
			try {
				if (closed) {
					completion.resolve(void 0);
					return;
				}
				retained.operation.service();
				selected.settled.service();
				const alone = selected.waiters === 0 && selected.leases === 0;
				if (!selected.outcome && alone && selected.startProducerClose) {
					if (!producerClose) {
						producerClose = startCloseProducer(selected);
						producerClose.result.then(() => completion.operation.service(), () => completion.operation.service());
					}
					producerClose.service();
					const earlyClose = producerClose.read();
					if (earlyClose.status === "rejected") throw earlyClose.error;
				}
				if (!selected.outcome) return;
				if (outcome && "value" in outcome) {
					if (!leaseClose) {
						leaseClose = outcome.value.startCleanup();
						leaseClose.result.then(() => completion.operation.service(), () => completion.operation.service());
					}
					leaseClose.service();
					const released = leaseClose.read();
					if (released.status === "pending") return;
					if (released.status === "rejected") throw released.error;
					if (!released.value) throw new SqliteSnapshotCleanupError("SQLite snapshot lease cleanup did not complete");
				} else if (!("value" in selected.outcome && (selected.leases > 0 || selected.waiters > 0))) {
					if (!producerClose) {
						producerClose = startCloseProducer(selected);
						producerClose.result.then(() => completion.operation.service(), () => completion.operation.service());
					}
					producerClose.service();
					const joined = producerClose.read();
					if (joined.status === "pending") return;
					if (joined.status === "rejected") throw joined.error;
				}
				closed = true;
				completion.resolve(void 0);
			} catch (error) {
				completion.reject(error);
			} finally {
				servicingClose = false;
			}
		});
		closing = completion.operation;
		retained.operation.result.then(() => completion.operation.service(), () => completion.operation.service());
		selected.settled.result.then(() => completion.operation.service(), () => completion.operation.service());
		completion.operation.service();
		return completion.operation;
	};
	return {
		...retained.operation,
		startClose
	};
}
/** Promise-only producers remain on their existing awaited path, never a sync bridge. */
function startAwaitedSnapshotWork(produce) {
	const retained = createRetainedOperation(() => {});
	Promise.resolve().then(produce).then(retained.resolve, retained.reject);
	return retained.operation;
}
async function prepareSingleFlightSqliteSnapshot(databasePath, operation, producer, signal, lifecycle) {
	return startSnapshotFlight(databasePath, operation, (flightSignal, recordFailure) => ({ operation: startAwaitedSnapshotWork(async () => {
		const base = await producer(flightSignal, recordFailure);
		return {
			base,
			startCleanup: () => startAwaitedSnapshotWork(() => base.cleanupAsync())
		};
	}) }), signal, lifecycle).result;
}
function startSingleFlightSqliteSnapshot(databasePath, operation, producer, signal, lifecycle) {
	return startSnapshotFlight(databasePath, operation, (flightSignal, recordFailure) => {
		const source = producer(flightSignal, recordFailure);
		const retained = createRetainedOperation(() => {
			source.service();
			const outcome = source.read();
			if (outcome.status === "fulfilled") retained.resolve({
				base: outcome.value,
				startCleanup: () => outcome.value.startCleanup()
			});
			else if (outcome.status === "rejected") retained.reject(outcome.error);
		});
		source.result.then(() => retained.operation.service(), () => retained.operation.service());
		return {
			operation: retained.operation,
			startClose: () => source.startClose()
		};
	}, signal, lifecycle, true);
}
//#endregion
//#region src/infra/sqlite-live-snapshot.ts
const liveOwners = resolveGlobalSingleton(Symbol.for("openclaw.sqliteLiveSnapshotOwners"), () => /* @__PURE__ */ new Map());
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
		const sizes = {
			sourceMainBytes: sqliteSnapshotSourceFileSize(identity.canonicalPath),
			sourceWalBytes: sqliteSnapshotSourceFileSize(`${identity.canonicalPath}-wal`)
		};
		const started = performance.now();
		const report = (outcome, copiedBytes, error) => emitSqliteSnapshotTelemetry({
			...sizes,
			attempt: 1,
			copiedBytes,
			durationMs: Math.max(0, performance.now() - started),
			operation: "online-backup",
			outcome,
			owner: owner.owner,
			waitMs: 0
		}, error);
		try {
			const prepared = await prepareSqliteReadOnlyLocationFromOwnedDatabase(owner.database, owner.assertCurrent, flightSignal);
			report("success", fs.statSync(prepared.location).size);
			return prepared;
		} catch (error) {
			report("error", 0, error);
			throw error;
		}
	}, signal);
}
//#endregion
export { startSingleFlightSqliteSnapshot as i, registerLiveSqliteSnapshotOwner as n, prepareSingleFlightSqliteSnapshot as r, prepareSqliteSnapshotFromLiveOwner as t };
