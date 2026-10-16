import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { a as resolveGlobalSingleton } from "./global-singleton-0m-JziJW.mjs";
import { a as runInDetachedAsyncContext } from "./async-work-scope-BYeX3gh6.mjs";
import { o as racePromiseWithAbortSignal } from "./src-D1BHGNTj.mjs";
import "./abort-signal-QqAmLWTl.mjs";
import { n as assertExistingDatabaseIdentity } from "./sqlite-worker-identity-KSR14F6C.mjs";
import { t as createSubsystemLogger } from "./subsystem-I-uqdx4f.mjs";
import { s as throwSqliteLifecycleErrors } from "./sqlite-lifecycle-errors-DuOygjcn.mjs";
import { i as isStateDatabaseReadAdmissionInvalidatedError, s as captureOpenClawDatabaseMaintenanceResource, t as StateDatabaseReadAdmissionInvalidatedError } from "./openclaw-state-db-async-lifecycle-DLKxSPCk.mjs";
import { t as captureRuntimeWorkerSource } from "./runtime-worker-generation-DCJaEqeS.mjs";
import { n as resolveRuntimeProcessEntrypointUrl } from "./runtime-process-url-D3H3_asn.mjs";
import { t as findOpenClawStateDatabaseFailure } from "./openclaw-state-db-failure-3stJt7Pa.mjs";
import { n as hydrateOpenClawStateWorkerError } from "./openclaw-state-worker-error-Cmtk9G4_.mjs";
import { _ as registerOpenClawStateDatabaseAsyncResource, f as openClawStateDatabaseCache, g as recordOpenClawStateDatabaseOpenFailure, m as publishOpenClawStateDatabaseWorkerAdmission, n as captureOpenClawStateDatabaseReadAdmission, u as getOpenClawStateDatabaseTerminalFailureAsync, v as registerOpenClawStateDatabaseLifecycleListener } from "./openclaw-state-db-cache-BKCnj4of.mjs";
import { t as SQLITE_IDLE_HANDLE_TTL_MS } from "./sqlite-handle-lifecycle-dWd9h3ii.mjs";
import { c as SqliteWorkerError } from "./sqlite-worker-contract-C51cJHzg.mjs";
import { a as isExistingOpenClawStateSchema, i as getExistingOpenClawStateSchemaPath } from "./openclaw-state-db-schema-policy-BxAJZRG6.mjs";
import { a as isSqliteWorkerStoreAvailable, c as openSharedStateSqliteWorkerStore, d as retireSqliteWorkerActor, f as runSqliteWorkerStoreOperation, i as hasUnclaimedSharedStateSqliteCleanup, r as getSqliteWorkerActorIdentity, t as closeUnclaimedSharedStateSqliteWorkers } from "./sqlite-worker-store-CsIRv3py.mjs";
import { AsyncLocalStorage } from "node:async_hooks";
import { channel } from "node:diagnostics_channel";
import { performance } from "node:perf_hooks";
//#region src/state/openclaw-state-worker-operation.ts
/** A live alias cannot authorize a worker still bound to a vanished opening path. */
function assertOpenClawStateWorkerActorPath(actor) {
	if (openClawStateDatabaseCache.getKnownOpenClawStateDatabaseIdentity(actor.databasePath)?.key !== actor.key) throw new StateDatabaseReadAdmissionInvalidatedError("Shared-state worker opening path changed");
}
function runWithCapturedWorkerContext(context, operation) {
	const maintenance = context.maintenanceScope;
	const run = () => maintenance ? maintenance.run(() => maintenance.track(operation())) : operation();
	return context.runInCapturedSchemaScope ? context.runInCapturedSchemaScope(run) : run();
}
function runWithOpenClawStateWorkerStore(store, context, operation, assertCurrent, createAdmission, signal) {
	const { admission } = context;
	const actor = getSqliteWorkerActorIdentity(store);
	return runSqliteWorkerStoreOperation(store, (scope) => operation(signal ? { execute: (command, options) => scope.execute(command, { signal: options?.signal ? AbortSignal.any([signal, options.signal]) : signal }) } : scope), context, (commandType) => {
		admission.assertCurrent();
		assertOpenClawStateWorkerActorPath(actor);
		assertCurrent?.(commandType);
	}, createAdmission);
}
function assertOpenClawStateWorkerSchemaContext(context) {
	isExistingOpenClawStateSchema(context.admission.databasePath);
	if (getExistingOpenClawStateSchemaPath() !== context.existingSchemaPath) throw new Error("Shared-state worker schema context does not match its caller");
}
/** Only native opening owns the caller scope; a cached actor must not retain it. */
function captureOpenClawStateWorkerOpeningGuard(context, assertCurrent, signal) {
	const admission = {
		assertCurrent,
		signal
	};
	let captured = AsyncLocalStorage.bind(() => {
		context.admission.assertCurrent();
		try {
			assertCurrent?.();
		} catch (error) {
			admission.refusal = { error };
			throw error;
		}
	});
	return {
		admission,
		assertCurrent: () => {
			if (!captured) throw new Error("Shared-state worker opening admission is closed");
			captured();
		},
		async run(open) {
			try {
				return await open();
			} catch (error) {
				if (admission.signal?.aborted) admission.refusal = { error };
				throw error;
			} finally {
				captured = void 0;
				admission.signal = void 0;
			}
		}
	};
}
//#endregion
//#region src/state/openclaw-state-worker-lease.ts
/** Retain a logical actor resource while tracking only acquisition and individual commands. */
function retainOpenClawStateWorkerLease(context, owner, finalize) {
	const maintenance = context.maintenanceScope;
	context.admission.assertCurrent();
	maintenance?.assertAdmission();
	const ready = createDeferredCore();
	const admitted = createDeferredCore();
	const released = createDeferredCore();
	const invocations = /* @__PURE__ */ new Set();
	const operations = /* @__PURE__ */ new Set();
	let retained;
	let releaseOperation;
	let retirement;
	let closing;
	let sealed = false;
	let invalidated = false;
	let store;
	let scope;
	let acquisitionReady = false;
	ready.promise.catch(() => void 0);
	const assertResourceCurrent = () => resource?.assertCurrent();
	const assertInvocation = (invocation) => {
		if (invocation.phase === "closed" || invalidated) throw new SqliteWorkerError("Shared-state worker operation is closed", "closed");
		context.admission.assertCurrent();
		assertResourceCurrent();
	};
	const assertCommandAdmission = (invocation) => {
		assertInvocation(invocation);
		if (invocation.phase !== "accepting") throw new SqliteWorkerError("Shared-state worker operation is closed", "closed");
	};
	const assertNewOperation = () => {
		if (sealed) throw new SqliteWorkerError("Shared-state worker lease is closed", "closed");
		context.admission.assertCurrent();
		maintenance?.assertAdmission();
	};
	const retireNative = () => {
		retirement ??= (async () => {
			await admitted.promise.catch(() => void 0);
			released.resolve();
			const errors = [];
			try {
				await retained;
			} catch (error) {
				errors.push(error);
			}
			try {
				await releaseOperation?.();
			} catch (error) {
				errors.push(error);
			}
			throwSqliteLifecycleErrors(errors, "Shared-state worker lease retirement failed");
		})();
		retirement.catch(() => void 0);
		return retirement;
	};
	const retire = () => {
		sealed = true;
		invalidated = true;
		for (const invocation of invocations) invocation.phase = "closed";
		return retireNative();
	};
	const createOperationScope = (invocation) => ({ execute: (command, options) => {
		try {
			assertCommandAdmission(invocation);
		} catch (error) {
			const rejected = createDeferredCore();
			rejected.reject(error);
			rejected.promise.catch(() => void 0);
			return rejected.promise;
		}
		const run = async () => {
			if (!acquisitionReady) await racePromiseWithAbortSignal(ready.promise, options?.signal);
			assertInvocation(invocation);
			if (!scope) throw new SqliteWorkerError("Shared-state worker lease is not ready", "closed");
			return scope.execute(command, options);
		};
		const result = (resource ? resource.run(run) : run()).catch(async (error) => {
			if (store && !sealed && !isSqliteWorkerStoreAvailable(store)) try {
				await retire();
			} catch (cleanupError) {
				throw new AggregateError([error, cleanupError], "Shared-state operation and retirement failed", { cause: cleanupError });
			}
			throw error;
		});
		invocation.pending.add(result);
		const settled = () => invocation.pending.delete(result);
		result.then(settled, settled);
		return maintenance ? maintenance.track(result) : result;
	} });
	const runOperation = (operation) => {
		try {
			assertNewOperation();
		} catch (error) {
			const rejected = createDeferredCore();
			rejected.reject(error);
			rejected.promise.catch(() => void 0);
			return rejected.promise;
		}
		const invocation = {
			phase: "accepting",
			pending: /* @__PURE__ */ new Set()
		};
		invocations.add(invocation);
		const completion = createDeferredCore();
		operations.add(completion.promise);
		completion.promise.catch(() => void 0);
		const run = async () => {
			try {
				return await operation(createOperationScope(invocation));
			} finally {
				if (invocation.phase === "accepting") invocation.phase = "draining";
				await Promise.allSettled(invocation.pending);
				invocation.phase = "closed";
				invocations.delete(invocation);
			}
		};
		run().then((value) => {
			operations.delete(completion.promise);
			completion.resolve(value);
		}, (error) => {
			operations.delete(completion.promise);
			completion.reject(error);
		});
		return completion.promise;
	};
	const release = () => {
		if (invalidated) return retireNative();
		if (closing) return closing;
		sealed = true;
		closing = (async () => {
			const errors = [];
			const terminal = {
				phase: "accepting",
				pending: /* @__PURE__ */ new Set()
			};
			invocations.add(terminal);
			try {
				await ready.promise;
				await finalize?.(createOperationScope(terminal));
			} catch (error) {
				errors.push(error);
			} finally {
				if (terminal.phase === "accepting") terminal.phase = "draining";
				await Promise.allSettled(terminal.pending);
				terminal.phase = "closed";
				invocations.delete(terminal);
			}
			const results = await Promise.allSettled(operations);
			errors.push(...results.flatMap((result) => result.status === "rejected" ? [result.reason] : []));
			try {
				await retireNative();
			} catch (error) {
				errors.push(error);
			}
			throwSqliteLifecycleErrors(errors, "Shared-state worker lease cleanup failed");
		})();
		closing.catch(() => void 0);
		return closing;
	};
	const lease = {
		ready: ready.promise,
		execute: (command, options) => runOperation((operationScope) => operationScope.execute(command, options)),
		runOperation,
		release,
		retire
	};
	maintenance?.own(lease, "shared-resources", release);
	const resource = maintenance ? captureOpenClawDatabaseMaintenanceResource(lease, maintenance) : void 0;
	const acquire = async () => {
		try {
			const failure = await getOpenClawStateDatabaseTerminalFailureAsync(context);
			if (failure) throw failure;
			context.admission.assertCurrent();
			store = await owner.open(context);
			context.admission.assertCurrent();
			if (!store) throw new Error("Canonical shared-state worker did not open its database");
			releaseOperation = owner.retainOperation(store);
			retained = runWithOpenClawStateWorkerStore(store, context, async (operationScope) => {
				scope = operationScope;
				admitted.resolve();
				await released.promise;
			}, assertResourceCurrent);
			retained.catch(admitted.reject);
			await admitted.promise;
			context.admission.assertCurrent();
			if (invalidated) throw new SqliteWorkerError("Shared-state worker lease is closed", "closed");
		} catch (error) {
			const failure = error instanceof Error ? hydrateOpenClawStateWorkerError(error) : error;
			admitted.reject(failure);
			try {
				await retire();
			} catch (cleanupError) {
				if (cleanupError !== failure) throw new AggregateError([failure, cleanupError], "Shared-state lease acquisition failed", { cause: cleanupError });
			}
			throw failure;
		}
	};
	runWithCapturedWorkerContext(context, acquire).then(() => {
		acquisitionReady = true;
		ready.resolve();
	}, ready.reject);
	return lease;
}
//#endregion
//#region src/state/openclaw-state-worker-owner.ts
const log = createSubsystemLogger("state/worker");
const SHARED_STATE_WORKER_IDLE_INSPECT_MS = 6e4;
function createSharedStateWorkerOwner() {
	const moduleUrl = resolveRuntimeProcessEntrypointUrl("sharedStateStore");
	const stores = /* @__PURE__ */ new Set();
	const activeEntries = /* @__PURE__ */ new Set();
	const retiring = /* @__PURE__ */ new Map();
	const retiringActors = /* @__PURE__ */ new Map();
	const memoryPressure = channel("openclaw.memory.critical");
	let pressureSubscribed = false;
	const refreshPressureSubscription = () => {
		const hasCustody = stores.size > 0 || retiring.size > 0 || retiringActors.size > 0 || activeEntries.size > 0;
		if (hasCustody === pressureSubscribed) return;
		pressureSubscribed = hasCustody;
		if (hasCustody) memoryPressure.subscribe(retireIdleWorkers);
		else memoryPressure.unsubscribe(retireIdleWorkers);
	};
	const matches = (entry, identity) => identity === void 0 || entry.context.admission.identity.key === identity.key;
	const hasActiveActorOperations = (entry) => [...activeEntries].some((active) => entry.actor ? active.actor === entry.actor : active === entry);
	const clearIdleRetirement = (entry) => {
		if (entry.idleTimer) {
			clearTimeout(entry.idleTimer);
			entry.idleTimer = void 0;
		}
	};
	const hasPendingCleanup = (entry) => entry.cleanup?.pending ?? (!entry.context.maintenanceScope && hasUnclaimedSharedStateSqliteCleanup(entry.context.admission.databasePath));
	const retire = (entry) => {
		clearIdleRetirement(entry);
		stores.delete(entry);
		let attempt = retiring.get(entry);
		if (!attempt) {
			attempt = {};
			retiring.set(entry, attempt);
		}
		refreshPressureSubscription();
		if (attempt.pending) return attempt.pending;
		if (entry.actor && retiringActors.has(entry.actor)) return retireActor(entry.actor, entry.context.admission.identity);
		const pending = (entry.store ? entry.store.close() : entry.opening.then((store) => store?.close(), () => entry.cleanup ? entry.cleanup.close() : entry.context.maintenanceScope ? void 0 : closeUnclaimedSharedStateSqliteWorkers(entry.context.admission.databasePath))).catch(async (error) => {
			if (!attempt.actorSettlement) throw error;
			await attempt.actorSettlement;
		});
		attempt.pending = pending;
		const settled = () => {
			attempt.pending = void 0;
			if (!hasPendingCleanup(entry)) retiring.delete(entry);
			refreshPressureSubscription();
		};
		pending.then(settled, settled);
		return pending;
	};
	const scheduleIdleRetirement = (entry) => {
		if (entry.activeOperations !== 0 || entry.idleTimer || entry.context.maintenanceScope || !entry.store || !stores.has(entry)) return;
		const store = entry.store;
		const generation = entry.operationGeneration;
		const deadline = performance.now() + SQLITE_IDLE_HANDLE_TTL_MS;
		const arm = (delay, inspect) => {
			const isCurrentIdle = () => entry.idleTimer === timer && entry.operationGeneration === generation && entry.activeOperations === 0 && stores.has(entry);
			const settle = async () => {
				if (!isCurrentIdle()) return;
				let healthy = false;
				if (inspect) try {
					healthy = await runWithCapturedWorkerContext(entry.context, () => runSqliteWorkerStoreOperation(store, (scope) => scope.execute({
						type: "database.inspectIdle",
						input: void 0
					}), entry.context, () => {
						entry.context.admission.assertCurrent();
						if (!isCurrentIdle()) throw new Error("Shared-state worker resumed before idle inspection");
					})) === "healthy" && isSqliteWorkerStoreAvailable(store);
					entry.context.admission.assertCurrent();
				} catch {
					healthy = false;
				}
				if (!isCurrentIdle()) return;
				entry.idleTimer = void 0;
				const remaining = deadline - performance.now();
				if (healthy && remaining > 0) arm(remaining, false);
				else await retire(entry);
			};
			const timer = runInDetachedAsyncContext(() => setTimeout(() => {
				settle().catch((error) => {
					log.warn("Idle shared-state worker retirement failed", {
						path: entry.context.admission.databasePath,
						error
					});
				});
			}, delay));
			entry.idleTimer = timer;
			timer.unref?.();
		};
		arm(SHARED_STATE_WORKER_IDLE_INSPECT_MS, true);
	};
	const retireAfterFailure = async (entry, error, stage) => {
		try {
			await retire(entry);
		} catch (cleanupError) {
			throw new AggregateError([error, cleanupError], `Shared-state worker ${stage} and cleanup failed`, { cause: cleanupError });
		}
		throw error;
	};
	const retainOperation = (store) => {
		const entry = [...stores].find((candidate) => candidate.store === store);
		if (!entry) throw new Error("Shared-state worker operation lost its actor owner");
		clearIdleRetirement(entry);
		entry.operationGeneration += 1;
		entry.activeOperations += 1;
		activeEntries.add(entry);
		let released = false;
		return () => {
			if (released) return;
			released = true;
			entry.activeOperations -= 1;
			if (entry.activeOperations === 0) activeEntries.delete(entry);
			refreshPressureSubscription();
			if (stores.has(entry) && !isSqliteWorkerStoreAvailable(store) && !hasActiveActorOperations(entry)) {
				const pending = entry.actor ? retireActor(entry.actor, entry.context.admission.identity) : retire(entry);
				pending.catch((error) => {
					log.warn("Shared-state worker retirement failed", {
						path: entry.context.admission.databasePath,
						error
					});
				});
				return pending;
			}
			scheduleIdleRetirement(entry);
		};
	};
	const retainActorSettlement = (attempt, pending) => {
		for (const entry of attempt.entries) {
			const closing = retiring.get(entry);
			if (closing) closing.actorSettlement = pending;
		}
		return pending;
	};
	const retireActor = (actor, identity) => {
		let attempt = retiringActors.get(actor);
		if (!attempt) {
			attempt = {
				identity,
				entries: /* @__PURE__ */ new Set()
			};
			retiringActors.set(actor, attempt);
		}
		for (const entry of [...stores, ...retiring.keys()]) if (entry.actor === actor) {
			attempt.entries.add(entry);
			clearIdleRetirement(entry);
			stores.delete(entry);
		}
		refreshPressureSubscription();
		if (attempt.pending) return retainActorSettlement(attempt, attempt.pending);
		const current = attempt;
		const complete = () => {
			for (const entry of current.entries) {
				clearIdleRetirement(entry);
				stores.delete(entry);
				retiring.delete(entry);
			}
			retiringActors.delete(actor);
			refreshPressureSubscription();
		};
		const pending = retireSqliteWorkerActor(actor).then(complete, (error) => {
			current.pending = void 0;
			if (current.entries.size > 0 && [...current.entries].every((entry) => entry.cleanup?.pending === false)) {
				complete();
				return;
			}
			throw error;
		});
		current.pending = pending;
		return retainActorSettlement(current, pending);
	};
	const joinActorRetirement = async (attempt) => {
		if (!attempt.pending) throw new Error("Shared-state actor cleanup is pending; close the database before reopening");
		await attempt.pending;
	};
	const inspectInvalidEntry = (entry) => {
		const actor = entry.actor;
		let kind = "actor";
		try {
			if (entry.bound && actor) {
				assertOpenClawStateWorkerActorPath(actor);
				if (entry.store && isSqliteWorkerStoreAvailable(entry.store)) kind = "client";
			}
			entry.databaseAdmission.assertCurrent();
		} catch (error) {
			if (!isStateDatabaseReadAdmissionInvalidatedError(error)) throw error;
			if (kind === "client" && openClawStateDatabaseCache.getKnownOpenClawStateDatabaseIdentity(entry.context.admission.databasePath)?.key === actor?.key) kind = "actor";
			return {
				kind,
				error
			};
		}
	};
	const retireInvalidEntry = (entry) => {
		const invalid = inspectInvalidEntry(entry);
		if (!invalid) return;
		if (invalid.kind === "actor") {
			if (hasActiveActorOperations(entry)) throw invalid.error;
			return { pending: entry.opening.then(() => {
				if (hasActiveActorOperations(entry)) throw invalid.error;
				return entry.actor ? retireActor(entry.actor, entry.context.admission.identity) : retire(entry);
			}, () => retire(entry)) };
		}
		if (!stores.has(entry)) return;
		const closing = retire(entry);
		return { pending: entry.activeOperations === 0 ? closing : void 0 };
	};
	async function close(identity) {
		for (const entry of stores.values()) if (matches(entry, identity)) retire(entry);
		const errors = (await Promise.allSettled([...[...retiring.keys()].filter((entry) => matches(entry, identity)).map(retire), ...[...retiringActors].filter(([, attempt]) => !identity || attempt.identity.key === identity.key).map(([actor, attempt]) => retireActor(actor, attempt.identity))])).flatMap((result) => result.status === "rejected" ? [result.reason] : []);
		refreshPressureSubscription();
		if (errors.length) throw new AggregateError(errors, "Failed to close shared-state SQLite workers");
	}
	registerOpenClawStateDatabaseAsyncResource({ close });
	registerOpenClawStateDatabaseLifecycleListener((event) => {
		if (event.kind !== "opened") {
			if (!event.identity) return;
			close(event.identity).catch((error) => {
				log.warn("Shared-state worker retirement failed", {
					path: event.path,
					error
				});
			});
		}
	});
	function retireIdleWorkers() {
		for (const entry of stores) if (entry.idleTimer && entry.store && !entry.context.maintenanceScope && !hasActiveActorOperations(entry)) runInDetachedAsyncContext(() => retire(entry)).catch((error) => {
			log.warn("Idle shared-state worker retirement failed", {
				path: entry.context.admission.databasePath,
				error
			});
		});
	}
	return {
		close,
		retainOperation,
		async openCleanup(databasePath, context, assertOwned, identity) {
			const expectedIdentity = { ...identity };
			assertOwned();
			if (!expectedIdentity.key.startsWith("file:")) return;
			const assertCurrent = () => {
				assertOwned();
				assertExistingDatabaseIdentity(databasePath, expectedIdentity.key, expectedIdentity.birthtime);
				for (const entry of activeEntries) if (matches(entry, expectedIdentity) && entry.store && !isSqliteWorkerStoreAvailable(entry.store)) throw new SqliteWorkerError("Shared-state cleanup is waiting for accepted operations to settle", "unavailable");
			};
			assertCurrent();
			for (const attempt of retiringActors.values()) if (attempt.identity.key === expectedIdentity.key) {
				assertCurrent();
				await joinActorRetirement(attempt);
				assertCurrent();
			}
			for (const entry of /* @__PURE__ */ new Set([...stores, ...retiring.keys()])) if ((stores.has(entry) || retiring.has(entry)) && matches(entry, expectedIdentity) && entry.store && !isSqliteWorkerStoreAvailable(entry.store)) {
				assertCurrent();
				await (entry.actor ? retireActor(entry.actor, expectedIdentity) : retire(entry));
				assertCurrent();
			}
			return openSharedStateSqliteWorkerStore({
				...captureRuntimeWorkerSource(moduleUrl),
				databasePath,
				existingOnly: true
			}, context, assertCurrent);
		},
		async open(context, options = {}) {
			const { existingOnly = false, assertCurrent, preparation, signal } = options;
			const wait = (pending) => racePromiseWithAbortSignal(pending, signal);
			const { admission } = context;
			const source = captureRuntimeWorkerSource(moduleUrl);
			const assertAdmission = () => {
				signal?.throwIfAborted();
				admission.assertCurrent();
				assertCurrent?.();
			};
			assertAdmission();
			assertOpenClawStateWorkerSchemaContext(context);
			let entry;
			let ownsOpening = false;
			for (;;) {
				for (const candidate of /* @__PURE__ */ new Set([...stores, ...retiring.keys()])) {
					if (!matches(candidate, admission.identity)) continue;
					const retirement = retireInvalidEntry(candidate);
					if (retirement) {
						if (retirement.pending) await wait(retirement.pending);
						return this.open(context, options);
					}
					if (stores.has(candidate) && (candidate.context.existingSchemaPath !== context.existingSchemaPath || candidate.source.moduleUrl.href !== source.moduleUrl.href)) {
						await wait(retire(candidate));
						assertAdmission();
					}
				}
				for (const attempt of retiringActors.values()) if (attempt.identity.key === admission.identity.key) {
					await wait(joinActorRetirement(attempt));
					assertAdmission();
				}
				for (const [retiringEntry, attempt] of retiring) if (matches(retiringEntry, admission.identity) && retiringEntry.context.maintenanceScope === context.maintenanceScope) {
					if (inspectInvalidEntry(retiringEntry)?.kind === "client") continue;
					if (!attempt.pending) {
						if (!hasPendingCleanup(retiringEntry)) {
							retiring.delete(retiringEntry);
							refreshPressureSubscription();
							continue;
						}
						throw new Error("Shared-state SQLite cleanup is pending; close the database before reopening");
					}
					try {
						await wait(attempt.pending);
					} catch (error) {
						if (retiring.get(retiringEntry) === attempt) throw error;
					}
					assertAdmission();
				}
				assertAdmission();
				entry = [...stores].find((candidate) => matches(candidate, admission.identity) && candidate.context.maintenanceScope === context.maintenanceScope && candidate.context.existingSchemaPath === context.existingSchemaPath);
				if (!entry || entry.store || entry.openingAdmission.assertCurrent === assertCurrent && entry.openingAdmission.signal === signal) break;
				let rejected;
				try {
					await wait(entry.opening);
				} catch (error) {
					rejected = { error };
				}
				assertAdmission();
				if (rejected && (!entry.openingAdmission.refusal || !Object.is(rejected.error, entry.openingAdmission.refusal.error))) throw rejected.error;
			}
			if (!entry) {
				ownsOpening = true;
				assertAdmission();
				const databaseAdmission = captureOpenClawStateDatabaseReadAdmission(admission.databasePath);
				assertAdmission();
				const openingGuard = captureOpenClawStateWorkerOpeningGuard(context, assertCurrent, signal);
				const open = () => openingGuard.run(() => openSharedStateSqliteWorkerStore({
					...source,
					databasePath: admission.databasePath,
					existingOnly
				}, context, openingGuard.assertCurrent, {
					maintenanceScope: context.maintenanceScope,
					preparation,
					signal,
					retainCleanup: (cleanup) => {
						admitted.cleanup = cleanup;
					}
				}));
				const admitted = {
					source,
					context,
					databaseAdmission,
					openingAdmission: openingGuard.admission,
					existingOnly,
					activeOperations: 0,
					operationGeneration: 0,
					opening: context.maintenanceScope ? open() : runInDetachedAsyncContext(open)
				};
				entry = admitted;
				admitted.opening = admitted.opening.then((store) => {
					if (store) {
						admitted.store = store;
						admitted.actor = getSqliteWorkerActorIdentity(store);
					} else {
						stores.delete(admitted);
						refreshPressureSubscription();
					}
					return store;
				});
				stores.add(entry);
				refreshPressureSubscription();
				context.maintenanceScope?.own(entry, "shared-resources", () => retire(admitted));
				entry.opening.catch(() => {
					stores.delete(admitted);
					if (hasPendingCleanup(admitted) && !retiring.has(admitted)) retiring.set(admitted, {});
					refreshPressureSubscription();
				});
			}
			const store = await (ownsOpening ? entry.opening : wait(entry.opening));
			try {
				admission.assertCurrent();
			} catch (error) {
				return retireAfterFailure(entry, error, "admission");
			}
			assertCurrent?.();
			if (!store) return !existingOnly && entry.existingOnly ? this.open(context, {
				...options,
				existingOnly: false
			}) : void 0;
			if (!stores.has(entry)) return this.open(context, options);
			clearIdleRetirement(entry);
			const actorRetirement = entry.actor ? retiringActors.get(entry.actor) : void 0;
			if (entry.actor && actorRetirement) {
				actorRetirement.entries.add(entry);
				stores.delete(entry);
				refreshPressureSubscription();
				await wait(joinActorRetirement(actorRetirement));
				return this.open(context, options);
			}
			if (!isSqliteWorkerStoreAvailable(store) && !hasActiveActorOperations(entry)) {
				await wait(entry.actor ? retireActor(entry.actor, admission.identity) : retire(entry));
				return this.open(context, options);
			}
			try {
				if (!entry.bound) {
					publishOpenClawStateDatabaseWorkerAdmission(entry.context.admission);
					entry.bound = true;
				}
			} catch (error) {
				return retireAfterFailure(entry, error, "binding");
			}
			const retirement = retireInvalidEntry(entry);
			if (retirement) {
				if (retirement.pending) await wait(retirement.pending);
				return this.open(context, options);
			}
			stores.delete(entry);
			stores.add(entry);
			return store;
		}
	};
}
function getOpenClawStateWorkerOwner() {
	return resolveGlobalSingleton(Symbol.for("openclaw.sharedStateWorkerOwner"), createSharedStateWorkerOwner, (sharedOwner) => sharedOwner.close());
}
//#endregion
//#region src/state/openclaw-state-worker-store.ts
/** Retired cleanup uses the retained owner's backend without renewing read admission. */
function openOpenClawStateWorkerCleanupStore(databasePath, context, assertOwned, identity) {
	return getOpenClawStateWorkerOwner().openCleanup(databasePath, context, assertOwned, identity);
}
async function executeOpenClawStateWorker(context, command) {
	const result = await runOpenClawStateWorkerOperation(context, (scope) => scope.execute(command));
	context.admission.assertCurrent();
	return result;
}
/** Retain the canonical actor for capture callbacks and their terminal writes. */
function createOpenClawStateWorkerLease(context, finalize) {
	return retainOpenClawStateWorkerLease(context, {
		open: (captured) => getOpenClawStateWorkerOwner().open(captured),
		retainOperation: (store) => getOpenClawStateWorkerOwner().retainOperation(store)
	}, finalize);
}
async function runOpenClawStateWorkerOperation(context, operation, options) {
	return runWithCapturedWorkerContext(context, async () => {
		try {
			options?.signal?.throwIfAborted();
			context.admission.assertCurrent();
			options?.assertCurrent?.();
			const failure = await getOpenClawStateDatabaseTerminalFailureAsync(context, options?.signal);
			if (failure) throw failure;
			context.admission.assertCurrent();
			options?.assertCurrent?.();
			const store = await getOpenClawStateWorkerOwner().open(context, options);
			if (!store) {
				options?.signal?.throwIfAborted();
				context.admission.assertCurrent();
				if (options?.existingOnly) return;
				throw new Error("Canonical shared-state worker did not open its database");
			}
			const releaseOperation = getOpenClawStateWorkerOwner().retainOperation(store);
			try {
				options?.signal?.throwIfAborted();
				context.admission.assertCurrent();
				options?.assertCurrent?.();
				return await runWithOpenClawStateWorkerStore(store, context, operation, options?.assertCurrent, options?.createAdmission, options?.signal);
			} finally {
				releaseOperation();
			}
		} catch (error) {
			const hydrated = hydrateOpenClawStateWorkerError(error);
			const failure = findOpenClawStateDatabaseFailure(hydrated, context.admission.databasePath);
			if (failure && !openClawStateDatabaseCache.getOpenClawStateDatabaseRecordedFailure(context.admission.databasePath)) {
				try {
					context.admission.assertCurrent();
				} catch {
					throw hydrated;
				}
				recordOpenClawStateDatabaseOpenFailure(context.admission.databasePath, failure);
			}
			throw hydrated;
		}
	});
}
/** Inspect the existing file without recursively admitting a domain operation. */
async function inspectOpenClawStateDatabaseGeneration(context, generation, signal) {
	return runWithCapturedWorkerContext(context, async () => {
		try {
			const store = await getOpenClawStateWorkerOwner().open(context, {
				existingOnly: true,
				signal
			});
			context.admission.assertCurrent();
			if (!store) return;
			const releaseOperation = getOpenClawStateWorkerOwner().retainOperation(store);
			try {
				context.admission.assertCurrent();
				return await runWithOpenClawStateWorkerStore(store, context, (scope) => scope.execute({
					type: "database.generationMatches",
					input: { generation }
				}), void 0, void 0, signal);
			} finally {
				releaseOperation();
			}
		} catch (error) {
			throw hydrateOpenClawStateWorkerError(error);
		}
	});
}
//#endregion
export { runOpenClawStateWorkerOperation as a, openOpenClawStateWorkerCleanupStore as i, executeOpenClawStateWorker as n, runWithCapturedWorkerContext as o, inspectOpenClawStateDatabaseGeneration as r, createOpenClawStateWorkerLease as t };
