import { n as coerceErrorMessage } from "./error-coercion-BwMr25F8.mjs";
import { a as resolveGlobalSingleton } from "./global-singleton-DrXvEBww.mjs";
import { f as readDatabasePathIdentitySync, l as readDatabaseFileIdentity } from "./sqlite-worker-identity-DLqVBf5J.mjs";
import { r as openNodeSqliteDatabase } from "./node-sqlite-CYaq-2Hb.mjs";
import { c as resolveSqliteInspectionSignal, h as runSqliteReadOnlyWorkerSync, i as isSqliteInspectionDeadlineOwnedByCaller, p as runSqliteReadOnlyWorker, r as createScopedSqliteReadOnlyWorker, t as captureSqliteReadOnlyWorkerLaunch } from "./sqlite-readonly-worker-C2DDLw_y.mjs";
import { n as isArtifactPreservingStateRead, t as artifactPreservingReads } from "./artifact-preserving-state-reads-CSUBkGbZ.mjs";
import { i as mapRetainedOperation, r as flatMapRetainedOperation, t as createRetainedOperation } from "./retained-operation-cDWsZqBc.mjs";
import { a as registerRetainedSnapshotTempDirectory, c as removeTempDirectory, d as retainSnapshotWork, l as removeTempDirectoryAsync, n as adoptPreparedLocation, t as SqliteSnapshotCleanupError, u as retainSnapshotTempDirectory } from "./sqlite-readonly-location-cleanup-zmu6YCue.mjs";
import { a as prepareSqliteReadOnlyLocationFromOwnedDatabase } from "./sqlite-readonly-location-Cz5jsVbC.mjs";
import { c as emitSqliteSnapshotTelemetry, l as sqliteSnapshotSourceFileSize, m as resolvePrivateSqliteSnapshotStagingRoot, n as createSqliteSnapshotStagingDirectory, r as createSqliteSnapshotStagingDirectorySync } from "./sqlite-snapshot-staging-B4VrWJSe.mjs";
import { t as captureSqliteSnapshotStagingOwner } from "./sqlite-snapshot-staging-owner-42z7nqrk.mjs";
import { n as isUpdateRehearsalPrivateDatabase } from "./update-rehearsal-paths-CRhoE25Z.mjs";
import fs from "node:fs";
import path from "node:path";
import { AsyncLocalStorage } from "node:async_hooks";
//#region src/infra/sqlite-snapshot-single-flight.ts
const snapshotFlights = resolveGlobalSingleton(Symbol.for("openclaw.sqliteSnapshotFlights"), () => ({
	unscoped: /* @__PURE__ */ new Map(),
	scoped: /* @__PURE__ */ new WeakMap()
}));
function completed(value) {
	const retained = createRetainedOperation(() => {});
	retained.resolve(value);
	return retained.operation;
}
function serviceWhenSettled(source, service) {
	source.result.then(service, service);
}
function createFlight(flights, key, producer) {
	let source;
	let started = false;
	let servicing = false;
	let cleanup;
	let closing;
	let cleanupFailure;
	const production = createRetainedOperation(() => {
		if (servicing || production.operation.read().status !== "pending") return;
		servicing = true;
		try {
			if (!started) {
				started = true;
				source = producer(flight.controller.signal, (error) => cleanupFailure = error);
				serviceWhenSettled(source.operation, serviceFlight);
			}
			source.operation.service();
			const outcome = source.operation.read();
			if (outcome.status === "fulfilled") production.resolve(outcome.value);
			else if (outcome.status === "rejected") production.reject(outcome.error);
		} catch (error) {
			production.reject(error);
		} finally {
			servicing = false;
		}
	});
	const settled = createRetainedOperation(() => {
		production.operation.service();
		const outcome = production.operation.read();
		if (outcome.status === "pending" || settled.operation.read().status !== "pending") return;
		if (flights.get(key) === flight) flights.delete(key);
		if (outcome.status === "rejected") settled.reject(cleanupFailure ?? outcome.error);
		else if (flight.references > 0) settled.resolve(outcome.value);
		else {
			if (!cleanup) {
				cleanup = releaseSnapshot(flight, outcome.value);
				serviceWhenSettled(cleanup, () => settled.operation.service());
			}
			cleanup.service();
			const removed = cleanup.read();
			if (removed.status === "fulfilled") {
				if (removed.value) settled.resolve(outcome.value);
				else settled.reject(new SqliteSnapshotCleanupError("SQLite orphan snapshot cleanup did not complete"));
			} else if (removed.status === "rejected") settled.reject(removed.error);
		}
	});
	function serviceFlight() {
		production.operation.service();
		for (const service of flight.listeners) service();
		settled.operation.service();
	}
	const flight = {
		controller: new AbortController(),
		references: 0,
		listeners: /* @__PURE__ */ new Set(),
		production: production.operation,
		settled: settled.operation,
		closeProducer() {
			closing ??= source?.startClose?.() ?? completed(void 0);
			return closing;
		}
	};
	retainSnapshotWork(settled.operation.result, () => {
		flight.controller.abort(/* @__PURE__ */ new Error("SQLite snapshot owner stopped"));
		serviceFlight();
	});
	return flight;
}
function releaseSnapshot(flight, base) {
	return flatMapRetainedOperation(base.startCleanup(), (removed) => removed ? mapRetainedOperation(flight.closeProducer(), () => true) : completed(false));
}
function leaseFlight(flight, base) {
	let released = false;
	let cleanup;
	const releaseReference = () => {
		if (!released) {
			released = true;
			flight.references--;
		}
		return flight.references === 0;
	};
	const startCleanup = () => {
		cleanup ??= !released && releaseReference() ? releaseSnapshot(flight, base) : completed(true);
		return cleanup;
	};
	return {
		location: base.location,
		cleanupRoot: base.cleanupRoot,
		cleanup() {
			if (released) {
				const outcome = cleanup?.read();
				return !outcome || outcome.status === "fulfilled" && outcome.value;
			}
			if (flight.references > 1) {
				releaseReference();
				return true;
			}
			const removed = base.cleanup();
			if (removed) releaseReference();
			return removed;
		},
		cleanupAsync: () => startCleanup().result,
		startCleanup
	};
}
function startSnapshotFlight(databasePath, operation, producer, signal, lifecycle) {
	signal?.throwIfAborted();
	const key = `${readDatabasePathIdentitySync(databasePath).key}:${operation}`;
	let flights = snapshotFlights.unscoped;
	if (lifecycle?.scope) {
		let scoped = snapshotFlights.scoped.get(lifecycle.scope);
		if (!scoped) {
			scoped = /* @__PURE__ */ new Map();
			snapshotFlights.scoped.set(lifecycle.scope, scoped);
		}
		flights = scoped;
	}
	let flight = flights.get(key);
	if (!flight) {
		flight = createFlight(flights, key, producer);
		flights.set(key, flight);
	}
	const selected = flight;
	selected.references++;
	lifecycle?.trackProducer?.(selected.settled.result);
	let closed = false;
	let withdrew = false;
	let closing;
	const retained = createRetainedOperation(() => {
		if (retained.operation.read().status !== "pending") return;
		if (closed || signal?.aborted) {
			if (!withdrew) {
				withdrew = true;
				selected.references--;
			}
			if (selected.references === 0) {
				selected.controller.abort(signal?.reason);
				if (flights.get(key) === selected) flights.delete(key);
				if (!lifecycle?.trackProducer) {
					selected.settled.service();
					if (selected.settled.read().status === "pending") return;
				}
			}
			retained.reject(signal?.reason ?? /* @__PURE__ */ new Error("SQLite snapshot preparation closed"));
		} else {
			selected.production.service();
			const outcome = selected.production.read();
			if (outcome.status === "pending") return;
			if (outcome.status === "fulfilled") retained.resolve(leaseFlight(selected, outcome.value));
			else {
				selected.references--;
				retained.reject(outcome.error);
			}
		}
		signal?.removeEventListener("abort", service);
		selected.listeners.delete(service);
		selected.settled.service();
	});
	const service = () => retained.operation.service();
	serviceWhenSettled(selected.settled, service);
	selected.listeners.add(service);
	signal?.addEventListener("abort", service, { once: true });
	queueMicrotask(service);
	return {
		...retained.operation,
		startClose() {
			closed = true;
			retained.operation.service();
			const outcome = retained.operation.read();
			closing ??= outcome.status === "fulfilled" ? mapRetainedOperation(outcome.value.startCleanup(), (removed) => {
				if (!removed) throw new SqliteSnapshotCleanupError("SQLite snapshot lease cleanup did not complete");
			}) : selected.references === 0 ? selected.closeProducer() : completed(void 0);
			return closing;
		}
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
			...base,
			startCleanup: () => startAwaitedSnapshotWork(() => base.cleanupAsync())
		};
	}) }), signal, lifecycle).result;
}
function startSingleFlightSqliteSnapshot(databasePath, operation, producer, signal, lifecycle) {
	return startSnapshotFlight(databasePath, operation, (flightSignal, recordFailure) => {
		const source = producer(flightSignal, recordFailure);
		return {
			operation: source,
			startClose: () => source.startClose()
		};
	}, signal, lifecycle);
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
//#region src/infra/sqlite-snapshot-source.ts
/** The inspection scope owns private readers until native close and snapshot disposal settle. */
function openSqliteReadOnlyDatabase(pathname, options = {}) {
	const scope = artifactPreservingReads.getStore();
	if (!scope || !isArtifactPreservingStateRead("agent", pathname)) return openNodeSqliteDatabase(pathname, {
		...options,
		readOnly: true
	});
	const snapshot = isUpdateRehearsalPrivateDatabase(pathname, process.env) ? void 0 : prepareSqliteReadOnlyLocationSync(pathname);
	const release = snapshot ? retainSnapshotTempDirectory(snapshot.cleanupRoot ?? path.dirname(snapshot.location)) : void 0;
	const native = {};
	const close = () => {
		native.close?.();
		release?.();
		if (snapshot && !snapshot.cleanup()) throw new SqliteSnapshotCleanupError("SQLite inspection snapshot cleanup failed.");
		scope.readers.delete(close);
	};
	scope.readers.add(close);
	const db = openNodeSqliteDatabase(snapshot?.location ?? pathname, {
		...options,
		readOnly: true
	});
	const dispose = db.close.bind(db);
	native.close = () => {
		if (db.isOpen) dispose();
	};
	db.close = close;
	return db;
}
async function prepareSqliteReadOnlyLocation(pathname, options = {}) {
	const signal = resolveSqliteInspectionSignal(options.signal);
	const preserveSourceArtifacts = options.preserveSourceArtifacts === true || isArtifactPreservingStateRead("agent", pathname);
	try {
		signal?.throwIfAborted();
		if (!preserveSourceArtifacts && options.allowLiveOwner !== false) {
			const owned = prepareSqliteSnapshotFromLiveOwner(pathname, signal);
			if (owned) return await owned;
		}
		return prepareWorkerSnapshot(pathname, {
			...options,
			preserveSourceArtifacts
		}, signal);
	} catch (error) {
		signal?.throwIfAborted();
		throw error;
	}
}
function startSqliteReadOnlyLocationAsync(inputPathname, options = {}) {
	const signal = resolveSqliteInspectionSignal(options.signal);
	signal?.throwIfAborted();
	const pathname = path.resolve(inputPathname);
	const preserveSourceArtifacts = options.preserveSourceArtifacts === true || isArtifactPreservingStateRead("agent", pathname);
	const expectedSourceIdentity = options.expectedSourceIdentity === void 0 ? void 0 : readDatabaseFileIdentity(options.expectedSourceIdentity);
	if (expectedSourceIdentity && !preserveSourceArtifacts) throw new Error("SQLite source identity requires artifact-preserving preparation");
	const requireCleanup = options.signal !== void 0;
	const { env, cwd } = captureSqliteReadOnlyWorkerLaunch();
	const root = resolvePrivateSqliteSnapshotStagingRoot();
	const deadlineOwnedByCaller = isSqliteInspectionDeadlineOwnedByCaller();
	const staging = captureSqliteSnapshotStagingOwner();
	const runInContext = AsyncLocalStorage.snapshot();
	return startSingleFlightSqliteSnapshot(pathname, `${preserveSourceArtifacts ? "worker-sync" : "worker-async"}:${requireCleanup ? "strict" : "best-effort"}:async-token${expectedSourceIdentity ? `:${JSON.stringify(expectedSourceIdentity)}` : ""}`, (flightSignal) => runInContext(() => {
		const task = staging.start({
			type: "prepare",
			root,
			pathname,
			allowLegacyWorker: false,
			preserveSourceArtifacts,
			expectedSourceIdentity,
			deadlineOwnedByCaller,
			launch: {
				env,
				cwd,
				transport: { kind: "native" }
			}
		}, flightSignal);
		return {
			...mapRetainedOperation(task, (reply) => {
				if (reply.type !== "prepared") throw new Error("SQLite snapshot producer returned an allocation without its prepared location");
				return adoptPreparedLocation(reply.location, reply.directory, requireCleanup);
			}),
			startClose: () => task.startClose()
		};
	}), signal, { scope: staging });
}
/** Promise-only reads retain the token in one child, without another worker or broker. */
async function prepareSqliteReadOnlyLocationAwaited(inputPathname, options) {
	const signal = resolveSqliteInspectionSignal(options.signal);
	const pathname = path.resolve(inputPathname);
	const expectedSourceIdentity = readDatabaseFileIdentity(options.expectedSourceIdentity);
	return prepareSingleFlightSqliteSnapshot(pathname, `worker-sync:strict:awaited-token:${JSON.stringify(expectedSourceIdentity)}`, (flightSignal, recordCleanupFailure) => prepareAwaitedWorkerSnapshot(pathname, {
		signal: flightSignal,
		expectedSourceIdentity
	}, recordCleanupFailure), signal);
}
async function prepareAwaitedWorkerSnapshot(pathname, options, recordCleanupFailure) {
	return useAwaitedSnapshotWorker(options.signal, recordCleanupFailure, async (worker, directory) => {
		const location = await worker.run(pathname, {
			mode: "sync",
			stagingRoot: directory,
			expectedSourceIdentity: readDatabaseFileIdentity(options.expectedSourceIdentity),
			signal: options.signal
		});
		if (typeof location !== "string") throw new Error("SQLite snapshot preparation returned an invalid location");
		options.signal.throwIfAborted();
		return adoptPreparedLocation(location, directory, true);
	}, true);
}
/** Keep raw source-file access and token retirement in one isolated native session. */
function withSqliteSnapshotWorker(signal, inspect) {
	return useAwaitedSnapshotWorker(signal, void 0, inspect, false);
}
async function useAwaitedSnapshotWorker(signal, recordCleanupFailure, inspect, retainPrepared) {
	signal.throwIfAborted();
	const launch = captureSqliteReadOnlyWorkerLaunch();
	let worker = createScopedSqliteReadOnlyWorker({
		...launch,
		retainOnOperationError: true
	});
	let directory;
	let retirement;
	const retire = () => {
		if (retirement && retirement.read().status !== "rejected") return retirement;
		const completion = createRetainedOperation(() => {});
		retirement = completion.operation;
		(async () => {
			if (directory) {
				const recover = worker.isRetired();
				if (recover) {
					await worker.close();
					worker = createScopedSqliteReadOnlyWorker(launch);
				}
				await worker.run(directory, { mode: recover ? "staging-reconcile" : "staging-retire" });
			}
			await worker.close();
			await worker.closed;
			if (directory) await fs.promises.rm(directory, {
				recursive: true,
				force: true,
				maxRetries: 3,
				retryDelay: 20
			});
		})().then(completion.resolve, completion.reject);
		return retirement;
	};
	try {
		const allocated = await worker.run(resolvePrivateSqliteSnapshotStagingRoot(), {
			mode: "staging-create",
			signal
		});
		if (typeof allocated !== "string") throw new Error("SQLite snapshot allocation returned an invalid directory");
		directory = allocated;
		registerRetainedSnapshotTempDirectory(directory, retire);
		signal.throwIfAborted();
		const value = await inspect(worker, directory);
		signal.throwIfAborted();
		if (!retainPrepared && !await removeTempDirectoryAsync(directory)) throw new SqliteSnapshotCleanupError(`SQLite snapshot cleanup failed: ${directory}`);
		return value;
	} catch (error) {
		try {
			if (directory) {
				if (!await removeTempDirectoryAsync(directory)) throw new SqliteSnapshotCleanupError(`SQLite snapshot cleanup failed: ${directory}`);
			} else {
				await worker.close();
				await worker.closed;
			}
		} catch (cleanupError) {
			const failure = new AggregateError([error, cleanupError], "SQLite snapshot preparation and cleanup failed");
			recordCleanupFailure?.(failure);
			throw failure;
		}
		throw error;
	}
}
function prepareWorkerSnapshot(pathname, options, signal) {
	signal?.throwIfAborted();
	const requireCleanup = options.requireCleanup ?? options.signal !== void 0;
	return prepareSingleFlightSqliteSnapshot(pathname, `${options.preserveSourceArtifacts ? "worker-sync" : "worker-async"}:${requireCleanup ? "strict" : "best-effort"}:sync-token`, async (flightSignal, recordCleanupFailure) => {
		let stagingRoot;
		try {
			flightSignal.throwIfAborted();
			stagingRoot = await createSqliteSnapshotStagingDirectory(void 0, false, flightSignal);
			flightSignal.throwIfAborted();
			const location = await runSqliteReadOnlyWorker(pathname, {
				mode: options.preserveSourceArtifacts ? "sync" : "async",
				signal: flightSignal,
				stagingRoot
			});
			flightSignal.throwIfAborted();
			return adoptPreparedLocation(location, stagingRoot, requireCleanup);
		} catch (error) {
			if (stagingRoot && !await removeTempDirectoryAsync(stagingRoot)) {
				const failure = new SqliteSnapshotCleanupError(`${coerceErrorMessage(error)}; SQLite snapshot cleanup failed: ${stagingRoot}`, { cause: error });
				recordCleanupFailure?.(failure);
				throw failure;
			}
			if (error instanceof SqliteSnapshotCleanupError) {
				recordCleanupFailure(error);
				throw error;
			}
			flightSignal.throwIfAborted();
			throw error;
		}
	}, signal);
}
function prepareSqliteReadOnlyLocationSync(pathname) {
	const stagingRoot = createSqliteSnapshotStagingDirectorySync();
	try {
		return adoptPreparedLocation(runSqliteReadOnlyWorkerSync(pathname, stagingRoot), stagingRoot);
	} catch (error) {
		if (!removeTempDirectory(stagingRoot)) throw new SqliteSnapshotCleanupError(`${coerceErrorMessage(error)}; SQLite snapshot cleanup failed: ${stagingRoot}`, { cause: error });
		throw error;
	}
}
async function prepareSqliteSnapshotSource(pathname) {
	const canonicalPath = fs.realpathSync.native(pathname);
	const journalPath = `${canonicalPath}-journal`;
	let journal;
	try {
		journal = fs.lstatSync(journalPath, { bigint: true });
	} catch (error) {
		if (error.code === "ENOENT") return;
		throw error;
	}
	if (!journal.isFile()) throw new Error(`SQLite rollback journal must be a regular file: ${journalPath}`);
	return await prepareSqliteReadOnlyLocation(canonicalPath);
}
async function withSqliteSnapshotSource(pathname, operation) {
	let prepared = await prepareSqliteSnapshotSource(pathname);
	try {
		return await operation(prepared ? prepared.location : pathname);
	} catch (error) {
		if (prepared) throw error;
		prepared = await prepareSqliteSnapshotSource(pathname);
		if (!prepared) throw error;
		return await operation(prepared.location);
	} finally {
		await prepared?.cleanupAsync();
	}
}
/** Fresh bytes without opening SQLite or making another durable private copy. */
function readSqliteSourceContentVersionSync(pathname) {
	return runSqliteReadOnlyWorkerSync(pathname, void 0, "content-version") || void 0;
}
//#endregion
export { readSqliteSourceContentVersionSync as a, withSqliteSnapshotWorker as c, prepareSqliteReadOnlyLocationSync as i, registerLiveSqliteSnapshotOwner as l, prepareSqliteReadOnlyLocation as n, startSqliteReadOnlyLocationAsync as o, prepareSqliteReadOnlyLocationAwaited as r, withSqliteSnapshotSource as s, openSqliteReadOnlyDatabase as t };
