import { a as resolveGlobalSingleton } from "./global-singleton-DrXvEBww.mjs";
import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { r as getAsyncWorkSignal, t as AsyncWorkScope } from "./async-work-scope-BH2yUdBz.mjs";
import { t as hasErrnoCode } from "./errno-FR4CRyya.mjs";
import { d as sleepWithAbort } from "./src-Bzfi3cQM.mjs";
import { r as assertExistingDatabaseIdentity } from "./sqlite-worker-identity-DLqVBf5J.mjs";
import { t as isPromiseLike } from "./promise-like-D7-l5Fsp.mjs";
import { i as SqliteCoordinatorError, s as throwSqliteLifecycleErrors } from "./sqlite-lifecycle-errors-Ca_9goHE.mjs";
import { n as existingPathOrUndefined, r as resolveDatabasePath } from "./openclaw-state-db.paths-D3nUb_uk.mjs";
import { l as getOpenClawDatabaseMaintenanceScope, m as observeOpenClawDatabaseMaintenanceResource, o as allowsMaintenanceLiveAuthorityReads, p as maintenanceOwnerMayCopySourcesInProcess, t as StateDatabaseReadAdmissionInvalidatedError } from "./openclaw-state-db-async-lifecycle-CtHZ7B35.mjs";
import { n as StateDatabaseAdmissionPendingError } from "./gateway-state-owner-record-DMIM5DCR.mjs";
import { c as getStateDatabaseSchemaLease } from "./gateway-state-owner-X3EqhtYx.mjs";
import { r as isPostgresSqlConnection } from "./sql-connection-DmQzXTVz.mjs";
import { S as readSqliteDatabaseCleanClose } from "./sqlite-database-admission-CqdNF9iE.mjs";
import { p as runSqliteReadOperationSync } from "./sqlite-schema-facts-C8u_9Af1.mjs";
import { o as resolveImmutableSqliteFileUri } from "./node-sqlite-CYaq-2Hb.mjs";
import { d as runScopedSqliteReadOnlyOperation } from "./sqlite-readonly-worker-C2DDLw_y.mjs";
import { n as isArtifactPreservingStateRead, r as withArtifactPreservingStateReads, t as artifactPreservingReads } from "./artifact-preserving-state-reads-CSUBkGbZ.mjs";
import { d as retainSnapshotWork, i as deferSqliteSnapshotCleanupAfterRead, t as SqliteSnapshotCleanupError, u as retainSnapshotTempDirectory } from "./sqlite-readonly-location-cleanup-zmu6YCue.mjs";
import { m as openClawStateDatabaseCache, n as borrowOpenClawStateDatabaseForAsyncRead, r as captureOpenClawStateDatabaseReadAdmission, w as retainOpenClawStateDatabaseForIndependentRead, x as requireOpenClawStateDatabaseIdentity, y as registerOpenClawStateDatabaseAsyncResource } from "./openclaw-state-db-cache-R1v7ogY0.mjs";
import { a as prepareSqliteReadOnlyLocationFromOwnedDatabase, s as prepareSqliteReadOnlyLocationSyncInProcess } from "./sqlite-readonly-location-Cz5jsVbC.mjs";
import { r as requireNativeDatabaseFile } from "./physical-facts-Cvtfrs3r.mjs";
import { a as readSqliteSourceContentVersionSync, c as withSqliteSnapshotWorker, i as prepareSqliteReadOnlyLocationSync, n as prepareSqliteReadOnlyLocation, o as startSqliteReadOnlyLocationAsync, r as prepareSqliteReadOnlyLocationAwaited } from "./sqlite-snapshot-source-DQdkM3YQ.mjs";
import { n as isUpdateRehearsalPrivateDatabase } from "./update-rehearsal-paths-CRhoE25Z.mjs";
import { a as isExistingOpenClawStateSchema } from "./openclaw-state-db-schema-policy-CuEyLsE2.mjs";
import { n as captureOpenClawStateReadWorkerContext } from "./openclaw-state-worker-context-BDhKaXgP.mjs";
import { t as acquireWithWait } from "./acquire-with-wait-JZafJKyw.mjs";
import { a as isStatePostgres, n as assertStateFileSnapshotAllowed } from "./openclaw-state-db-engine-DST3Q_pv.mjs";
import { i as withOpenClawStateReadOnlyLocation, r as openOpenClawStateReadOnlyLocation, t as assertStateReadSchema } from "./openclaw-state-db-read-connection-D53a_-IZ.mjs";
import { t as isManagedStateTransaction } from "./openclaw-state-db-transaction-BR8tupS1.mjs";
import { n as decodeOpenClawStateReadReply, t as captureOpenClawStateReadSource } from "./openclaw-state-read-worker-Bp1MZPYo.mjs";
import fs, { lstatSync } from "node:fs";
import path from "node:path";
import { isMainThread } from "node:worker_threads";
import { AsyncLocalStorage } from "node:async_hooks";
//#region src/state/openclaw-state-db-content-version.ts
const versions = /* @__PURE__ */ new WeakMap();
/** Returned metadata also invalidates rows when a write races cached hash selection. */
function readAdmittedStateContentVersion(pathname, env) {
	const assertCurrent = () => {
		getOpenClawDatabaseMaintenanceScope()?.assertReadAdmission();
		openClawStateDatabaseCache.assertOpenClawStateDatabaseFreshOpenAllowedAtPath(pathname, env);
	};
	assertCurrent();
	if (existingPathOrUndefined(pathname) === void 0) return;
	const scope = getOpenClawDatabaseMaintenanceScope();
	const fingerprint = () => {
		const canonical = fs.realpathSync.native(pathname);
		return [
			"",
			"-wal",
			"-journal"
		].map((suffix) => {
			const stat = fs.lstatSync(canonical + suffix, {
				bigint: true,
				throwIfNoEntry: false
			});
			const identity = stat && [
				stat.dev,
				stat.ino,
				stat.size,
				stat.mtimeNs,
				stat.ctimeNs
			];
			return `${canonical}:${identity?.join(":")}`;
		}).join("|");
	};
	const before = fingerprint();
	const previous = scope && versions.get(scope);
	const version = previous?.fingerprint === before ? previous.version : readSqliteSourceContentVersionSync(pathname);
	if (scope && version !== void 0 && before === fingerprint()) versions.set(scope, {
		fingerprint: before,
		version
	});
	assertCurrent();
	return version && `${isExistingOpenClawStateSchema(pathname)}:${version}:${fingerprint()}`;
}
//#endregion
//#region src/state/openclaw-state-db-readonly-reuse.ts
const maintenanceReaders = /* @__PURE__ */ new WeakMap();
/** Mutable maintenance owns this live reader until drainage; each guard queries current rows. */
function withMaintenanceOpenClawStateDatabaseReadOnly(operation, pathname) {
	const scope = getOpenClawDatabaseMaintenanceScope();
	if (!scope || !allowsMaintenanceLiveAuthorityReads(scope, pathname)) return { reused: false };
	scope.assertReadAdmission();
	let readers = maintenanceReaders.get(scope);
	if (!readers) {
		readers = /* @__PURE__ */ new Map();
		maintenanceReaders.set(scope, readers);
	}
	let reader = readers.get(pathname);
	if (!reader) {
		const admission = captureOpenClawStateDatabaseReadAdmission(pathname);
		assertExistingDatabaseIdentity(pathname, admission.identity.key, admission.identity.birthtime);
		const connection = openOpenClawStateReadOnlyLocation(pathname, pathname);
		let closed = false;
		const close = () => {
			if (closed) return;
			if (!connection.close()) throw new Error("Maintenance authority reader cleanup is incomplete");
			closed = true;
			readers.delete(pathname);
			unregister();
		};
		const unregister = registerOpenClawStateDatabaseAsyncResource({ async close(identity) {
			if (!identity || identity.key === admission.identity.key || identity.canonicalPath === admission.identity.canonicalPath) close();
		} });
		scope.own(connection, "shared-handles", close);
		reader = { read(readOperation) {
			admission.assertCurrent();
			assertExistingDatabaseIdentity(pathname, admission.identity.key, admission.identity.birthtime);
			const value = runSqliteReadOperationSync(connection.database.db, () => {
				assertStateReadSchema(connection.database.db, pathname);
				return readOperation(connection.database);
			});
			if (isPromiseLike(value)) throw new SqliteCoordinatorError("SQLite maintenance authority read must remain synchronous");
			return value;
		} };
		readers.set(pathname, reader);
	}
	return {
		reused: true,
		value: reader.read(operation)
	};
}
/** Current-authority guards can borrow their writer; discovery sees committed rows. */
function withCachedOpenClawStateDatabaseReadOnly(operation, pathname, currentAuthority) {
	return openClawStateDatabaseCache.withCachedOpenClawStateDatabase(pathname, { readOnly: true }, (opened) => {
		if (!opened.db.isOpen) return { reused: false };
		const ownedTransaction = currentAuthority && isManagedStateTransaction(opened.db);
		if (opened.db.isTransaction && !ownedTransaction) return { reused: false };
		try {
			if (isExistingOpenClawStateSchema(pathname, opened.db)) assertStateReadSchema(opened.db, pathname);
			observeOpenClawDatabaseMaintenanceResource(opened.db);
			const value = operation(opened);
			if (ownedTransaction && isPromiseLike(value)) throw new SqliteCoordinatorError("SQLite current-authority read must remain synchronous");
			return {
				reused: true,
				value
			};
		} catch (error) {
			openClawStateDatabaseCache.evictOpenClawStateDatabaseAfterCorruption(opened, error);
			throw error;
		}
	}) ?? { reused: false };
}
/** A native read borrow can avoid copying only while its original physical path still matches. */
function canReadWarmNativeSourceIndependently(database, pathname, admittedIdentity) {
	const identity = requireOpenClawStateDatabaseIdentity(database);
	if (identity.key !== admittedIdentity) return false;
	try {
		assertExistingDatabaseIdentity(pathname, identity.key);
		return true;
	} catch {
		return false;
	}
}
//#endregion
//#region src/state/openclaw-state-read-operation.ts
/** Owns query admission and release together, so a later reader can release an earlier slot. */
function startOpenClawStateReadOperation(command, selection) {
	const { pathname, snapshot, scopes, context, preserveArtifacts, preferIndependentWarmRead, controller, signal, receipt } = selection;
	const resume = AsyncLocalStorage.snapshot();
	const result = createDeferredCore();
	result.promise.catch(() => void 0);
	let outcome = { status: "pending" };
	let source;
	let transport;
	let unregisterSource;
	let unregister;
	let borrowed;
	let prepared;
	let preparation;
	let preparationClose;
	let startPreparedCleanup;
	let releasePreparedSource;
	let expectedIdentity;
	let expectedSourceIdentity;
	let awaitedOnly = selection.snapshotPreparation === "awaited";
	let producerSettled = false;
	let value;
	const errors = [];
	const acceptanceErrors = [];
	let producerStep;
	let cleanupStep;
	let cleanupAttempt;
	let transportStopped = false;
	let cleaned = false;
	let servicing = false;
	const assertReadLifetime = () => {
		signal.throwIfAborted();
		context.maintenanceScope?.assertAdmission();
		context.admission.assertCurrent();
		snapshot?.assertCurrent?.();
		borrowed?.assertCurrent();
		if (expectedIdentity !== void 0) assertExistingDatabaseIdentity(pathname, expectedIdentity);
		if (expectedSourceIdentity) assertExistingDatabaseIdentity(pathname, expectedSourceIdentity.key, expectedSourceIdentity.birthtime);
		if (scopes.some((scope) => !scope.active)) throw new Error("Shared-state read scope is closed");
	};
	const authority = {
		signal,
		assertCurrent() {
			assertReadLifetime();
			openClawStateDatabaseCache.assertOpenClawStateDatabaseOpenAllowed(pathname, "cached-read");
		}
	};
	function settle(cleanupErrors = []) {
		if (outcome.status !== "pending") return;
		try {
			throwSqliteLifecycleErrors([
				...errors,
				...[...new Set(acceptanceErrors)].filter((error) => !errors.includes(error)),
				...cleanupErrors
			], "Shared-state read and cleanup failed");
			outcome = {
				status: "fulfilled",
				value
			};
			result.resolve(value);
		} catch (error) {
			let mapped;
			try {
				mapped = selection.mapError ? selection.mapError(error, receipt.phase) : error;
			} catch (mappingError) {
				mapped = mappingError;
			}
			outcome = {
				status: "rejected",
				error: mapped
			};
			result.reject(mapped);
		}
	}
	function finishCleanup(error) {
		const attempt = cleanupAttempt;
		cleanupAttempt = void 0;
		cleanupStep = void 0;
		if (error) attempt?.reject(error.error);
		else attempt?.resolve();
		if (producerSettled) settle(error ? [error.error] : []);
	}
	function release() {
		borrowed?.release();
		borrowed = void 0;
		snapshot?.release?.();
		cleaned = true;
		unregister?.();
		for (const scope of scopes) scope.resources.delete(resource);
		unregisterSource?.();
		finishCleanup();
	}
	function acceptCleanup(success) {
		if (!success) throw new Error(`Shared-state read snapshot cleanup failed: ${prepared?.cleanupRoot ?? pathname}`);
		prepared = void 0;
		startPreparedCleanup = void 0;
		closePreparation();
	}
	function startPreparationClose() {
		if (!preparation) return;
		if (!preparationClose || preparationClose.read().status === "rejected") {
			preparationClose = preparation.startClose();
			preparationClose.result.then(service, service);
		}
		return preparationClose;
	}
	function closePreparation() {
		const closing = startPreparationClose();
		if (!closing) {
			release();
			return;
		}
		waitRetained("cleanup", closing, () => {
			preparation = void 0;
			preparationClose = void 0;
			release();
		});
	}
	function cleanupPrepared() {
		if (!prepared) {
			closePreparation();
			return;
		}
		releasePreparedSource?.();
		if (startPreparedCleanup) waitRetained("cleanup", startPreparedCleanup(), acceptCleanup);
		else {
			const pending = prepared.cleanupAsync();
			cleanupStep = void 0;
			waitAwaited(pending, acceptCleanup, finishCleanup);
		}
	}
	function waitProducer() {
		cleanupStep = () => {
			if (!producerSettled) {
				if (signal.aborted) {
					const closing = startPreparationClose();
					closing?.service();
					const joined = closing?.read();
					if (joined?.status === "rejected") throw joined.error;
				}
				return false;
			}
			cleanupStep = void 0;
			cleanupPrepared();
			return true;
		};
	}
	function cleanup() {
		if (cleaned) return Promise.resolve();
		if (cleanupAttempt) return cleanupAttempt.promise;
		const attempt = createDeferredCore();
		attempt.promise.catch(() => void 0);
		cleanupAttempt = attempt;
		try {
			if (!transportStopped && transport) waitRetained("cleanup", transport.startClose(), () => {
				transportStopped = true;
				waitProducer();
			});
			else waitProducer();
		} catch (error) {
			finishCleanup({ error });
		}
		service();
		return attempt.promise;
	}
	function finishProducer(error) {
		producerStep = void 0;
		producerSettled = true;
		if (error) errors.push(error.error);
		cleanup();
	}
	function service() {
		if (servicing) return;
		servicing = true;
		try {
			resume(() => {
				let changed;
				do {
					try {
						changed = producerStep?.() ?? false;
					} catch (error) {
						finishProducer({ error });
						changed = true;
					}
					try {
						changed = (cleanupStep?.() ?? false) || changed;
					} catch (error) {
						finishCleanup({ error });
						changed = true;
					}
				} while (changed);
			});
		} finally {
			servicing = false;
		}
	}
	function waitRetained(lane, operation, accept) {
		const step = () => {
			operation.service();
			const next = operation.read();
			if (next.status === "pending") return false;
			if (lane === "producer") producerStep = void 0;
			else cleanupStep = void 0;
			if (next.status === "rejected") throw next.error;
			accept(next.value);
			return true;
		};
		if (lane === "producer") producerStep = step;
		else cleanupStep = step;
		operation.result.then(service, service);
	}
	function waitAwaited(pending, accept, fail) {
		pending.then((next) => resume(() => {
			try {
				accept(next);
			} catch (error) {
				fail({ error });
			}
			service();
		}), (error) => resume(() => {
			fail({ error });
			service();
		}));
	}
	function query() {
		if (!snapshot && !prepared || snapshot?.cleanClose) expectedIdentity = context.admission.identity.key;
		if (prepared) {
			authority.assertCurrent();
			releasePreparedSource = retainSnapshotTempDirectory(prepared.cleanupRoot ?? path.dirname(prepared.location));
		}
		receipt.phase = command.type === "admit" ? "before-read" : "unobserved";
		if (!transport) throw new Error("Shared-state read transport is unavailable");
		waitRetained("producer", transport.startRead({
			context,
			location: snapshot?.cleanClose ? resolveImmutableSqliteFileUri(snapshot.location) : prepared?.location ?? snapshot?.location ?? pathname,
			checkFreshAdmission: !borrowed,
			expectedIdentity,
			snapshotRoot: prepared?.cleanupRoot ?? snapshot?.cleanupRoot
		}, authority), acceptReadOutcome);
	}
	function consumeReadOutcome(readOutcome) {
		const admitted = "error" in readOutcome ? readOutcome.sourceAdmitted : readOutcome.value.type === "admit" ? void 0 : readOutcome.value.sourceAdmitted;
		if (admitted === true) receipt.phase = "read";
		else if (admitted === false && receipt.phase !== "read") receipt.phase = "before-read";
		try {
			authority.assertCurrent();
			if (admitted) borrowed?.observe();
		} catch (error) {
			if (!("error" in readOutcome)) throw error;
			acceptanceErrors.push(error);
		}
		if ("error" in readOutcome) throw readOutcome.error;
		return readOutcome.value;
	}
	function acceptReadOutcome(readOutcome) {
		value = consumeReadOutcome(readOutcome);
		finishProducer();
	}
	const resource = { close() {
		controller.abort(/* @__PURE__ */ new Error("Shared-state read admission closed"));
		return resume(cleanup);
	} };
	try {
		source = captureOpenClawStateReadSource();
		transport = source.createTransport(command, selection.onChunk, selection.onChunkAsync, awaitedOnly);
		unregister = registerOpenClawStateDatabaseAsyncResource({ async close(identity) {
			if (!identity || identity.key === context.admission.identity.key || identity.canonicalPath === context.admission.identity.canonicalPath) await resource.close();
		} });
		context.maintenanceScope?.own(resource, "shared-resources", () => resource.close());
		for (const scope of scopes) scope.resources.add(resource);
		unregisterSource = source.own(service, () => resource.close());
		assertReadLifetime();
		if (snapshot) openClawStateDatabaseCache.assertOpenClawStateDatabaseOpenAllowed(pathname, "cached-read");
		if (command.type === "admit") query();
		else {
			const native = !snapshot && preserveArtifacts ? borrowOpenClawStateDatabaseForAsyncRead(pathname, "cached-read") : void 0;
			borrowed = native ?? (!snapshot && !preserveArtifacts ? retainOpenClawStateDatabaseForIndependentRead(pathname, "cached-read") : void 0);
			const independentWarmSource = native && preferIndependentWarmRead && canReadWarmNativeSourceIndependently(native.database, pathname, context.admission.identity.key);
			if (!snapshot && !borrowed && !existingPathOrUndefined(pathname)) finishProducer();
			else if (native && !independentWarmSource) {
				if (isPostgresSqlConnection(native.database.db)) requireNativeDatabaseFile("postgres", "file-snapshot");
				awaitedOnly = true;
				waitAwaited(prepareSqliteReadOnlyLocationFromOwnedDatabase(native.database.db, authority.assertCurrent, authority.signal, "async"), (location) => {
					prepared = location;
					query();
				}, finishProducer);
			} else if (!snapshot && preserveArtifacts && !independentWarmSource) {
				const sourceIdentity = { key: context.admission.identity.key };
				expectedSourceIdentity = sourceIdentity;
				authority.assertCurrent();
				if (selection.snapshotPreparation === "awaited" && command.type === "plugins.metadata.read" && context.maintenanceScope?.ownsSchemaMaintenance !== true && !getStateDatabaseSchemaLease(pathname)) {
					const capturedCommand = structuredClone(command);
					receipt.phase = "unobserved";
					waitAwaited(withSqliteSnapshotWorker(signal, (worker, stagingRoot) => {
						authority.assertCurrent();
						return runScopedSqliteReadOnlyOperation(worker, pathname, {
							type: "stateSnapshot.read",
							input: {
								stagingRoot,
								expectedSourceIdentity: sourceIdentity,
								command: capturedCommand,
								context: {
									environment: context.environment,
									existingSchemaPath: context.existingSchemaPath
								}
							}
						}, {
							source: "canonical",
							expectedIdentity: sourceIdentity.key,
							env: context.environment,
							signal
						}).then((reply) => consumeReadOutcome(decodeOpenClawStateReadReply(reply)));
					}), (reply) => {
						value = reply;
						finishProducer();
					}, finishProducer);
				} else waitRetained("producer", transport.startValidateFresh(context, authority), () => {
					authority.assertCurrent();
					if (selection.snapshotPreparation === "awaited") {
						waitAwaited(prepareSqliteReadOnlyLocationAwaited(pathname, {
							signal: authority.signal,
							expectedSourceIdentity: sourceIdentity
						}), (location) => {
							prepared = location;
							query();
						}, finishProducer);
						return;
					}
					preparation = startSqliteReadOnlyLocationAsync(pathname, {
						preserveSourceArtifacts: preserveArtifacts,
						signal: authority.signal,
						expectedSourceIdentity
					});
					waitRetained("producer", preparation, (location) => {
						prepared = location;
						startPreparedCleanup = () => location.startCleanup();
						query();
					});
				});
				awaitedOnly ||= selection.snapshotPreparation === "awaited";
			} else query();
		}
	} catch (error) {
		finishProducer({ error });
	}
	service();
	return awaitedOnly ? {
		kind: "awaited-only",
		result: result.promise
	} : {
		kind: "retained",
		operation: {
			result: result.promise,
			read: () => outcome,
			service() {
				source?.service();
				service();
			}
		}
	};
}
//#endregion
//#region src/state/openclaw-state-read-scope.ts
/** Normal drainage and explicit abort retain the selected callback's context. */
function bindRetainedReadScope(scope) {
	const context = scope.work.run(() => AsyncLocalStorage.snapshot());
	return {
		run: (operation) => context(() => runRetainedReadScope(scope, () => scope.work.track(operation))),
		abort: (reason) => context(() => scope.work.beginClose(reason))
	};
}
/** Closing retains custody for accepted readers, but never admits a new reader. */
function assertRetainedReadScopeAdmission(pathname, scopes) {
	if (scopes.some((scope) => scope?.path === pathname && (!scope.active || scope.work.isClosing))) throw new StateDatabaseReadAdmissionInvalidatedError("Shared-state read scope is closing or closed; retry the operation in a current scope.");
}
function createRetainedReadScope(pathname, identity, cleanup) {
	let pending;
	let unregister;
	const scope = {
		path: pathname,
		active: true,
		work: new AsyncWorkScope(),
		resources: /* @__PURE__ */ new Set(),
		close() {
			if (!scope.active) return Promise.resolve();
			unregister ??= registerOpenClawStateDatabaseAsyncResource({ async close(current) {
				if (!current || current.key === identity.key || current.canonicalPath === identity.canonicalPath) await scope.close();
			} });
			return pending ??= (async () => {
				await scope.work.drain();
				const settled = await Promise.allSettled([...scope.resources].map((resource) => resource.close()));
				throwSqliteLifecycleErrors(settled.flatMap((result) => result.status === "rejected" ? [result.reason] : []), "Shared-state read scope drainage failed");
				await cleanup?.();
				scope.active = false;
				unregister?.();
			})().finally(() => {
				pending = void 0;
			});
		}
	};
	return scope;
}
async function runRetainedReadScope(scope, operation) {
	let result;
	const errors = [];
	try {
		result = await operation();
	} catch (error) {
		errors.push(error);
	}
	try {
		await scope.close();
	} catch (error) {
		errors.push(error);
	}
	throwSqliteLifecycleErrors(errors, "Shared-state read scope and cleanup failed");
	return result;
}
/** Leave synchronous admission before native cleanup can reenter a reader. */
function runSynchronousReadScope(scope, operation) {
	let result;
	let failed = false;
	let failure;
	const cleanupErrors = [];
	try {
		result = operation();
		if (isPromiseLike(result)) throw new SqliteCoordinatorError("SQLite metadata snapshot scope must remain synchronous");
	} catch (error) {
		failed = true;
		failure = error;
	} finally {
		scope.leave();
		for (const reader of scope.readers.values()) try {
			if (!reader.close()) cleanupErrors.push(/* @__PURE__ */ new Error("Shared-state metadata snapshot cleanup is incomplete."));
		} catch (error) {
			cleanupErrors.push(error);
		}
		scope.readers.clear();
	}
	if (cleanupErrors.length) throw new AggregateError(failed ? [failure, ...cleanupErrors] : cleanupErrors, "Shared-state metadata snapshot cleanup failed.");
	if (failed) throw failure;
	return result;
}
//#endregion
//#region src/state/openclaw-state-db-readonly.ts
const disposableStateReads = resolveGlobalSingleton(Symbol.for("openclaw.disposableStateReads"), () => new AsyncLocalStorage());
const stateSnapshotReads = resolveGlobalSingleton(Symbol.for("openclaw.stateSnapshotReads"), () => new AsyncLocalStorage());
/** Stable identity and private bytes for reads within the enclosing snapshot scope. */
function getActiveOpenClawStateDatabaseReadSnapshot(options = {}) {
	const current = stateSnapshotReads.getStore();
	return current?.path === resolveReadOnlyPath(options) ? current : void 0;
}
/** Resolve a composite read from one online snapshot without redirecting live writers. */
async function withOpenClawStateDatabaseReadSnapshot(operation, options = {}) {
	assertStateFileSnapshotAllowed();
	const pathname = resolveReadOnlyPath(options);
	const current = stateSnapshotReads.getStore();
	if (current?.active && current.path === pathname || !existingPathOrUndefined(pathname)) return await operation();
	const env = options.env ?? process.env;
	const callerSignal = getAsyncWorkSignal();
	const controller = new AbortController();
	const admissionSignal = callerSignal ? AbortSignal.any([callerSignal, controller.signal]) : controller.signal;
	const assertHostAdmission = () => openClawStateDatabaseCache.assertOpenClawStateDatabaseFreshOpenAllowedAtPath(pathname, env);
	let closeSnapshotWork;
	const run = async () => {
		let admission;
		let prepared;
		let cleanClose;
		try {
			admission = await acquireWithWait({
				acquire: () => {
					admissionSignal.throwIfAborted();
					assertHostAdmission();
					return captureOpenClawStateDatabaseReadAdmission(pathname);
				},
				shouldRetry: (error) => error instanceof StateDatabaseAdmissionPendingError && error.databasePath === pathname,
				deadlineMs: performance.now() + (options.admissionTimeoutMs ?? 0),
				pollIntervalMs: 250,
				sleep: (ms) => sleepWithAbort(ms, admissionSignal)
			});
			admissionSignal.throwIfAborted();
			cleanClose = options.reuseCleanClose === true && readSqliteDatabaseCleanClose(pathname);
			if (cleanClose) prepared = {
				location: pathname,
				cleanupAsync: async () => true
			};
			else if (isArtifactPreservingStateRead() && maintenanceOwnerMayCopySourcesInProcess(getOpenClawDatabaseMaintenanceScope(), pathname) && !openClawStateDatabaseCache.isOpenClawStateDatabaseOpen(pathname)) prepared = prepareSqliteReadOnlyLocationSyncInProcess(pathname);
			else prepared = await prepareSqliteReadOnlyLocation(pathname, {
				preserveSourceArtifacts: isArtifactPreservingStateRead(),
				signal: controller.signal
			});
		} catch (error) {
			throw new Error(`Cannot read shared state for discovery: ${pathname}. Retry after the current state operation completes. ${String(error)}`, { cause: error });
		}
		const releaseSource = cleanClose ? () => {} : retainSnapshotTempDirectory(prepared.cleanupRoot ?? path.dirname(prepared.location));
		let readSucceeded = false;
		const snapshot = Object.assign(createRetainedReadScope(pathname, admission.identity, async () => {
			releaseSource();
			let cause;
			try {
				if (await prepared.cleanupAsync()) return;
			} catch (error) {
				if (readSucceeded && deferSqliteSnapshotCleanupAfterRead(error, prepared.cleanupRoot)) return;
				cause = error;
			}
			throw new SqliteSnapshotCleanupError(`Shared-state discovery snapshot cleanup failed: ${prepared.cleanupRoot ?? pathname}`, { cause });
		}), {
			location: prepared.location,
			cleanupRoot: prepared.cleanupRoot,
			env,
			cleanClose
		});
		const lifecycle = stateSnapshotReads.run(snapshot, () => bindRetainedReadScope(snapshot));
		closeSnapshotWork = lifecycle.abort;
		const closeFromCaller = () => lifecycle.abort(callerSignal?.reason);
		callerSignal?.addEventListener("abort", closeFromCaller, { once: true });
		if (callerSignal?.aborted) closeFromCaller();
		try {
			return await lifecycle.run(async () => {
				controller.signal.throwIfAborted();
				assertHostAdmission();
				admission.assertCurrent();
				const result = await operation();
				readSucceeded = true;
				return result;
			});
		} finally {
			callerSignal?.removeEventListener("abort", closeFromCaller);
		}
	};
	return await retainSnapshotWork(run(), () => {
		controller.abort(/* @__PURE__ */ new Error("Shared-state snapshot admission closed"));
		closeSnapshotWork?.(controller.signal.reason);
	});
}
/** The caller owns this private database and removes its files after the scope closes. */
async function withDisposableOpenClawStateReads(pathname, operation) {
	const resolvedPath = resolveReadOnlyPath({ path: pathname });
	const scope = createRetainedReadScope(resolvedPath, captureOpenClawStateDatabaseReadAdmission(resolvedPath).identity);
	return await runRetainedReadScope(scope, () => disposableStateReads.run([...disposableStateReads.getStore() ?? [], scope], operation));
}
function requiresArtifactPreservingSnapshot(pathname) {
	const required = isArtifactPreservingStateRead("shared", pathname) && !isUpdateRehearsalPrivateDatabase(pathname, process.env) && !disposableStateReads.getStore()?.some((scope) => scope.active && scope.path === pathname);
	if (required) assertStateFileSnapshotAllowed();
	return required;
}
const synchronousReadSnapshots = resolveGlobalSingleton(Symbol.for("openclaw.synchronousStateReadSnapshots"), () => ({ current: void 0 }));
/** One synchronous metadata operation shares private bytes, never later admission reads. */
function withSynchronousArtifactPreservingStateSnapshot(operation, options) {
	if (options?.current) {
		const pathname = resolveReadOnlyPath(options.current);
		const inherited = synchronousReadSnapshots.current;
		const inheritedAuthority = synchronousReadSnapshots.currentAuthorityPath;
		if (inherited && inheritedAuthority === pathname) return operation();
		return stateSnapshotReads.exit(() => {
			synchronousReadSnapshots.current = void 0;
			synchronousReadSnapshots.currentAuthorityPath = pathname;
			try {
				return withArtifactPreservingStateReads(() => withSynchronousArtifactPreservingStateSnapshot(operation));
			} finally {
				synchronousReadSnapshots.current = inherited;
				synchronousReadSnapshots.currentAuthorityPath = inheritedAuthority;
			}
		});
	}
	if (!isArtifactPreservingStateRead() || synchronousReadSnapshots.current) return operation();
	const readers = /* @__PURE__ */ new Map();
	synchronousReadSnapshots.current = readers;
	return runSynchronousReadScope({
		readers,
		leave: () => {
			synchronousReadSnapshots.current = void 0;
		}
	}, operation);
}
function resolveReadOnlyPath(options) {
	const pathname = resolveDatabasePath(options);
	assertRetainedReadScopeAdmission(pathname, [stateSnapshotReads.getStore(), ...disposableStateReads.getStore() ?? []]);
	isExistingOpenClawStateSchema(pathname);
	return pathname;
}
function withOpenClawStateDatabaseReadOnlyIfOpen(operation, pathname, currentAuthority = false) {
	const snapshot = stateSnapshotReads.getStore();
	if (snapshot?.active && snapshot.path === pathname) {
		openClawStateDatabaseCache.assertOpenClawStateDatabaseFreshOpenAllowedAtPath(pathname, snapshot.env);
		return {
			reused: true,
			value: withOpenClawStateReadOnlyLocation(operation, pathname, snapshot.cleanClose ? resolveImmutableSqliteFileUri(snapshot.location) : snapshot.location)
		};
	}
	if (isArtifactPreservingStateRead("agent", pathname) && (requiresArtifactPreservingSnapshot(pathname) || isUpdateRehearsalPrivateDatabase(pathname, process.env))) return { reused: false };
	if (isStatePostgres() && !currentAuthority) return { reused: false };
	return withCachedOpenClawStateDatabaseReadOnly(operation, pathname, currentAuthority || synchronousReadSnapshots.currentAuthorityPath === pathname);
}
function withFreshOpenClawStateDatabaseReadOnly(operation, options, pathname) {
	const env = options.env ?? process.env;
	openClawStateDatabaseCache.assertOpenClawStateDatabaseFreshOpenAllowedAtPath(pathname, env);
	if (synchronousReadSnapshots.currentAuthorityPath === pathname) {
		const maintained = withMaintenanceOpenClawStateDatabaseReadOnly(operation, pathname);
		if (maintained.reused) return maintained.value;
	}
	const readers = synchronousReadSnapshots.current;
	if (readers && requiresArtifactPreservingSnapshot(pathname)) {
		let opened = readers.get(pathname);
		if (!opened) {
			opened = openOpenClawStateReadOnlyLocation(pathname, prepareSqliteReadOnlyLocationSync(pathname));
			readers.set(pathname, opened);
		}
		assertStateReadSchema(opened.database.db, pathname);
		const result = operation(opened.database);
		if (isPromiseLike(result)) throw new SqliteCoordinatorError("SQLite metadata snapshot read must remain synchronous");
		return result;
	}
	const prepared = requiresArtifactPreservingSnapshot(pathname) ? prepareSqliteReadOnlyLocationSync(pathname) : void 0;
	return withOpenClawStateReadOnlyLocation(operation, pathname, prepared ?? pathname, void 0, void 0, void 0, !isMainThread && !getOpenClawDatabaseMaintenanceScope());
}
/** Read shared state without joining writers; admission inherits artifact preservation. */
function withOpenClawStateDatabaseReadOnly(operation, options = {}) {
	const pathname = resolveReadOnlyPath(options);
	if (synchronousReadSnapshots.current?.has(pathname)) return withFreshOpenClawStateDatabaseReadOnly(operation, options, pathname);
	const reused = withOpenClawStateDatabaseReadOnlyIfOpen(operation, pathname);
	if (reused.reused) return reused.value;
	return withFreshOpenClawStateDatabaseReadOnly(operation, options, pathname);
}
/** A missing pathname is not absence while this read owner can serve retained state. */
function isOpenClawStateDatabaseDefinitelyAbsent(env = process.env) {
	try {
		const pathname = resolveReadOnlyPath({ env });
		const snapshot = stateSnapshotReads.getStore();
		if (synchronousReadSnapshots.current?.has(pathname) || snapshot?.active && snapshot.path === pathname || openClawStateDatabaseCache.getCachedOpenClawStateDatabase(pathname)?.db.isOpen) return false;
		try {
			lstatSync(pathname);
			return false;
		} catch (error) {
			return hasErrnoCode(error, "ENOENT");
		}
	} catch {
		return false;
	}
}
/** Read existing shared state while preserving non-missing filesystem failures. */
function withExistingOpenClawStateDatabaseReadOnly(operation, options = {}) {
	const pathname = resolveReadOnlyPath(options);
	if (synchronousReadSnapshots.current?.has(pathname)) return withFreshOpenClawStateDatabaseReadOnly(operation, options, pathname);
	const reused = withOpenClawStateDatabaseReadOnlyIfOpen(operation, pathname);
	if (reused.reused) return reused.value;
	const existingPath = existingPathOrUndefined(pathname);
	return existingPath === void 0 ? void 0 : withFreshOpenClawStateDatabaseReadOnly(operation, options, existingPath);
}
function isStateReadReply(reply, type) {
	return reply.ok && reply.type === type;
}
/** Fixed reads observe committed state unless their owner explicitly selected a snapshot. */
function executeExistingOpenClawStateRead(options, command, readOptions = {}) {
	const type = command.type;
	const { context, current, live, mapError } = readOptions;
	const receipt = { phase: "before-read" };
	let completion;
	try {
		context?.admission.assertCurrent();
		const execute = () => startRetainedOpenClawStateRead(options, command, receipt, readOptions);
		const read = live ? () => artifactPreservingReads.run(false, () => stateSnapshotReads.exit(execute)) : current ? () => stateSnapshotReads.exit(execute) : execute;
		completion = context?.runInCapturedSchemaScope ? context.runInCapturedSchemaScope(read) : read();
	} catch (error) {
		throw mapError ? mapError(error, receipt.phase) : error;
	}
	return (completion.kind === "retained" ? completion.operation.result : completion.result).then((reply) => {
		if (!reply || isStateReadReply(reply, type)) return reply;
		throw new Error(`Unexpected shared-state read reply for ${type}`);
	});
}
function startRetainedOpenClawStateRead(options, command, receipt, { context: capturedContext, signal, current, live, mapError, preferIndependentWarmRead, snapshotPreparation, onChunk, onChunkAsync }) {
	const currentRead = current || live;
	const pathname = resolveReadOnlyPath(options);
	const inherited = stateSnapshotReads.getStore();
	const snapshot = inherited?.active && inherited.path === pathname ? inherited : void 0;
	const scopes = [...snapshot ? [snapshot] : [], ...(disposableStateReads.getStore() ?? []).filter((scope) => scope.active && scope.path === pathname)];
	const env = snapshot?.env ?? options.env;
	const context = capturedContext ?? captureOpenClawStateReadWorkerContext({
		path: pathname,
		env
	});
	if (capturedContext) {
		if (context.admission.databasePath !== pathname) throw new Error("Shared-state read context does not match its selected source");
		context.maintenanceScope?.assertAdmission();
		context.admission.assertCurrent();
	}
	const preserveArtifacts = requiresArtifactPreservingSnapshot(pathname);
	const controller = new AbortController();
	const readSignal = signal ? AbortSignal.any([signal, controller.signal]) : controller.signal;
	const run = () => {
		const inheritedSource = currentRead ? void 0 : synchronousReadSnapshots.current?.get(pathname)?.snapshotSource?.retain();
		return startOpenClawStateReadOperation(command, {
			pathname,
			snapshot: inheritedSource ?? snapshot,
			scopes,
			context,
			preserveArtifacts,
			preferIndependentWarmRead,
			snapshotPreparation,
			onChunk,
			onChunkAsync,
			controller,
			signal: readSignal,
			receipt,
			mapError
		});
	};
	const tracked = scopes.reduceRight((operation, scope) => () => scope.work.run(() => {
		const completion = operation();
		const result = completion.kind === "retained" ? completion.operation.result : completion.result;
		scope.work.track(() => result).catch(() => void 0);
		return completion;
	}), run);
	const maintenance = context.maintenanceScope;
	let completion;
	if (maintenance) maintenance.run(() => {
		const accepted = tracked();
		completion = accepted;
		return accepted.kind === "retained" ? accepted.operation.result : accepted.result;
	});
	else completion = tracked();
	if (!completion) throw new Error("Shared-state read maintenance scope did not start its operation");
	const result = completion.kind === "retained" ? completion.operation.result : completion.result;
	retainSnapshotWork(result, () => controller.abort(/* @__PURE__ */ new Error("Shared-state read admission closed")));
	return completion;
}
/** Read existing shared state without creating or updating its SQLite sidecars. */
function withExistingOpenClawStateDatabaseArtifactPreservingReadOnly(operation, options = {}, openStateSchemaReadAdmission) {
	assertStateFileSnapshotAllowed();
	if (openStateSchemaReadAdmission) return withExistingOpenClawStateDatabaseCurrentReadOnly(operation, options, openStateSchemaReadAdmission);
	return withArtifactPreservingStateReads(() => withExistingOpenClawStateDatabaseReadOnly(operation, options));
}
/** Publication guards need current rows, never an inherited discovery snapshot. */
function withExistingOpenClawStateDatabaseCurrentReadOnly(operation, options = {}, openStateSchemaReadAdmission) {
	const pathname = resolveReadOnlyPath(options);
	return stateSnapshotReads.exit(() => {
		if (!openStateSchemaReadAdmission) {
			const reused = withOpenClawStateDatabaseReadOnlyIfOpen(operation, pathname, true);
			if (reused.reused) return reused.value;
		}
		if (existingPathOrUndefined(pathname) === void 0) return;
		openClawStateDatabaseCache.assertOpenClawStateDatabaseFreshOpenAllowedAtPath(pathname, options.env ?? process.env);
		const directRead = (isStatePostgres() || options.allowNativeRead) && !isArtifactPreservingStateRead() && !openStateSchemaReadAdmission;
		if (!directRead) assertStateFileSnapshotAllowed();
		return withOpenClawStateReadOnlyLocation(operation, pathname, directRead ? pathname : prepareSqliteReadOnlyLocationSync(pathname), openStateSchemaReadAdmission);
	});
}
/** Preserve source artifacts while allowing the caller to progress during snapshot preparation. */
function withExistingOpenClawStateDatabaseArtifactPreservingReadOnlyAsync(operation, options = {}) {
	assertStateFileSnapshotAllowed();
	return withArtifactPreservingStateReads(async () => {
		const pathname = resolveReadOnlyPath(options);
		const reused = withOpenClawStateDatabaseReadOnlyIfOpen(operation, pathname);
		if (reused.reused) return reused.value;
		if (existingPathOrUndefined(pathname) === void 0) return;
		const env = options.env ?? process.env;
		openClawStateDatabaseCache.assertOpenClawStateDatabaseFreshOpenAllowedAtPath(pathname, env);
		if (!requiresArtifactPreservingSnapshot(pathname)) return withOpenClawStateReadOnlyLocation(operation, pathname, pathname);
		const prepared = await prepareSqliteReadOnlyLocation(pathname, { preserveSourceArtifacts: true });
		try {
			openClawStateDatabaseCache.assertOpenClawStateDatabaseFreshOpenAllowedAtPath(pathname, env);
		} catch (error) {
			prepared.cleanup();
			throw error;
		}
		return withOpenClawStateReadOnlyLocation(operation, pathname, prepared);
	});
}
function readCurrentOpenClawStateDatabaseContentVersion(options = {}) {
	const pathname = resolveReadOnlyPath(options);
	const env = options.env ?? process.env;
	return stateSnapshotReads.exit(() => readAdmittedStateContentVersion(pathname, env));
}
/** Current guards leave discovery snapshots after validating their inherited read admission. */
function withCurrentOpenClawStateReadScope(options, operation) {
	const pathname = resolveReadOnlyPath(options);
	return stateSnapshotReads.exit(() => operation(pathname));
}
//#endregion
export { withCurrentOpenClawStateReadScope as a, withExistingOpenClawStateDatabaseArtifactPreservingReadOnlyAsync as c, withOpenClawStateDatabaseReadOnly as d, withOpenClawStateDatabaseReadSnapshot as f, withMaintenanceOpenClawStateDatabaseReadOnly as h, readCurrentOpenClawStateDatabaseContentVersion as i, withExistingOpenClawStateDatabaseCurrentReadOnly as l, canReadWarmNativeSourceIndependently as m, getActiveOpenClawStateDatabaseReadSnapshot as n, withDisposableOpenClawStateReads as o, withSynchronousArtifactPreservingStateSnapshot as p, isOpenClawStateDatabaseDefinitelyAbsent as r, withExistingOpenClawStateDatabaseArtifactPreservingReadOnly as s, executeExistingOpenClawStateRead as t, withExistingOpenClawStateDatabaseReadOnly as u };
