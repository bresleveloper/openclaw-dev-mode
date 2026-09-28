import { i as resolveGlobalSingleton } from "./global-singleton-Dc_stLtU.mjs";
import { a as runInDetachedAsyncContext } from "./async-work-scope-CWk2dk1h.mjs";
import { t as createSubsystemLogger } from "./subsystem-DleLyu58.mjs";
import { t as SQLITE_IDLE_HANDLE_TTL_MS } from "./sqlite-handle-lifecycle-dWd9h3ii.mjs";
import { _ as registerOpenClawStateDatabaseAsyncResource, d as getOpenClawStateDatabaseTerminalFailureAsync, m as publishOpenClawStateDatabaseWorkerAdmission, v as registerOpenClawStateDatabaseLifecycleListener } from "./openclaw-state-db-cache-Ci98mtX8.mjs";
import { i as isExistingOpenClawStateSchema, r as getExistingOpenClawStateSchemaPath } from "./openclaw-state-db-schema-policy-BpQ7rCsk.mjs";
import { t as resolveRuntimeProcessEntrypointUrl } from "./runtime-process-url-q9v1M311.mjs";
import { n as hydrateOpenClawStateWorkerError } from "./openclaw-state-worker-error-DLFiBmPG.mjs";
import { t as captureRuntimeWorkerSource } from "./runtime-worker-generation-Bj2WcDkG.mjs";
import { a as isSqliteWorkerStoreAvailable, d as runSqliteWorkerStoreOperation, i as hasUnclaimedSharedStateSqliteCleanup, r as getSqliteWorkerActorIdentity, s as openSharedStateSqliteWorkerStore, t as closeUnclaimedSharedStateSqliteWorkers, u as retireSqliteWorkerActor } from "./sqlite-worker-store-H5HXDD9v.mjs";
import { performance } from "node:perf_hooks";
import { channel } from "node:diagnostics_channel";
//#region src/state/openclaw-state-worker-operation.ts
function runWithCapturedWorkerContext(context, operation) {
	const maintenance = context.maintenanceScope;
	const run = () => maintenance ? maintenance.run(() => maintenance.track(operation())) : operation();
	return context.runInCapturedSchemaScope ? context.runInCapturedSchemaScope(run) : run();
}
function runWithOpenClawStateWorkerStore(store, context, operation, assertCurrent, createAdmission, requireStateLifecycle = false) {
	const { admission } = context;
	return runSqliteWorkerStoreOperation(store, operation, context, (commandType) => {
		admission.assertCurrent();
		assertCurrent?.(commandType);
	}, createAdmission, requireStateLifecycle);
}
//#endregion
//#region src/state/openclaw-state-worker-store.ts
const log = createSubsystemLogger("state/worker");
const SHARED_STATE_WORKER_IDLE_INSPECT_MS = 6e4;
function createSharedStateWorkerOwner() {
	const moduleUrl = resolveRuntimeProcessEntrypointUrl("sharedStateStore");
	const stores = /* @__PURE__ */ new Set();
	const activeEntries = /* @__PURE__ */ new Set();
	const retiring = /* @__PURE__ */ new Map();
	const retiringActors = /* @__PURE__ */ new Map();
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
					}, void 0, true)) === "healthy" && isSqliteWorkerStoreAvailable(store);
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
			if (stores.has(entry) && !isSqliteWorkerStoreAvailable(store) && !hasActiveActorOperations(entry)) {
				(entry.actor ? retireActor(entry.actor, entry.context.admission.identity) : retire(entry)).catch((error) => {
					log.warn("Shared-state worker retirement failed", {
						path: entry.context.admission.databasePath,
						error
					});
				});
				return;
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
		if (attempt.pending) return retainActorSettlement(attempt, attempt.pending);
		const current = attempt;
		const complete = () => {
			for (const entry of current.entries) {
				clearIdleRetirement(entry);
				stores.delete(entry);
				retiring.delete(entry);
			}
			retiringActors.delete(actor);
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
	async function close(identity) {
		for (const entry of stores.values()) if (matches(entry, identity)) retire(entry);
		const errors = (await Promise.allSettled([...[...retiring.keys()].filter((entry) => matches(entry, identity)).map(retire), ...[...retiringActors].filter(([, attempt]) => !identity || attempt.identity.key === identity.key).map(([actor, attempt]) => retireActor(actor, attempt.identity))])).flatMap((result) => result.status === "rejected" ? [result.reason] : []);
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
	channel("openclaw.memory.critical").subscribe(() => {
		for (const entry of stores) if (entry.idleTimer && entry.store && !entry.context.maintenanceScope && !hasActiveActorOperations(entry)) runInDetachedAsyncContext(() => retire(entry)).catch((error) => {
			log.warn("Idle shared-state worker retirement failed", {
				path: entry.context.admission.databasePath,
				error
			});
		});
	});
	return {
		close,
		retainOperation,
		openCleanup(databasePath, context, assertOwned) {
			return openSharedStateSqliteWorkerStore({
				...captureRuntimeWorkerSource(moduleUrl),
				databasePath,
				existingOnly: true
			}, context, assertOwned);
		},
		async open(context, options = {}) {
			const { existingOnly = false, assertCurrent, preparation } = options;
			const { admission } = context;
			const source = captureRuntimeWorkerSource(moduleUrl);
			const assertAdmission = () => {
				admission.assertCurrent();
				assertCurrent?.();
			};
			assertAdmission();
			isExistingOpenClawStateSchema(admission.databasePath);
			if (getExistingOpenClawStateSchemaPath() !== context.existingSchemaPath) throw new Error("Shared-state worker schema context does not match its caller");
			let entry;
			for (;;) {
				for (const candidate of stores) if (matches(candidate, admission.identity) && (candidate.context.existingSchemaPath !== context.existingSchemaPath || candidate.source.moduleUrl.href !== source.moduleUrl.href)) {
					await retire(candidate);
					assertAdmission();
				}
				for (const attempt of retiringActors.values()) if (attempt.identity.key === admission.identity.key) {
					await joinActorRetirement(attempt);
					assertAdmission();
				}
				for (const [retiringEntry, attempt] of retiring) if (matches(retiringEntry, admission.identity) && retiringEntry.context.maintenanceScope === context.maintenanceScope) {
					if (!attempt.pending) {
						if (!hasPendingCleanup(retiringEntry)) {
							retiring.delete(retiringEntry);
							continue;
						}
						throw new Error("Shared-state SQLite cleanup is pending; close the database before reopening");
					}
					try {
						await attempt.pending;
					} catch (error) {
						if (retiring.get(retiringEntry) === attempt) throw error;
					}
					assertAdmission();
				}
				assertAdmission();
				entry = [...stores].find((candidate) => matches(candidate, admission.identity) && candidate.context.maintenanceScope === context.maintenanceScope && candidate.context.existingSchemaPath === context.existingSchemaPath);
				if (!entry || entry.store || entry.openingAdmission.assertCurrent === assertCurrent) break;
				let rejected;
				try {
					if (!await entry.opening) stores.delete(entry);
				} catch (error) {
					rejected = { error };
				}
				assertAdmission();
				if (rejected && (!entry.openingAdmission.refusal || !Object.is(rejected.error, entry.openingAdmission.refusal.error))) throw rejected.error;
			}
			if (!entry) {
				const openingAdmission = { assertCurrent };
				const assertOpeningAdmission = () => {
					admission.assertCurrent();
					try {
						assertCurrent?.();
					} catch (error) {
						openingAdmission.refusal = { error };
						throw error;
					}
				};
				const admitted = {
					source,
					context,
					openingAdmission,
					existingOnly,
					activeOperations: 0,
					operationGeneration: 0,
					opening: runInDetachedAsyncContext(() => openSharedStateSqliteWorkerStore({
						...source,
						databasePath: admission.databasePath,
						existingOnly
					}, context, assertOpeningAdmission, {
						maintenanceScope: context.maintenanceScope,
						preparation,
						retainCleanup: (cleanup) => {
							admitted.cleanup = cleanup;
						}
					}))
				};
				entry = admitted;
				admitted.opening = admitted.opening.then((store) => {
					if (store) {
						admitted.store = store;
						admitted.actor = getSqliteWorkerActorIdentity(store);
					}
					return store;
				});
				stores.add(entry);
				context.maintenanceScope?.own(entry, "shared-resources", () => retire(admitted));
				entry.opening.catch(() => {
					stores.delete(admitted);
					if (hasPendingCleanup(admitted) && !retiring.has(admitted)) retiring.set(admitted, {});
				});
			}
			const store = await entry.opening;
			try {
				admission.assertCurrent();
			} catch (error) {
				try {
					await retire(entry);
				} catch (cleanupError) {
					throw new AggregateError([error, cleanupError], "Shared-state worker admission and cleanup failed", { cause: cleanupError });
				}
				throw error;
			}
			assertCurrent?.();
			if (!store) {
				stores.delete(entry);
				return !existingOnly && entry.existingOnly ? this.open(context, {
					...options,
					existingOnly: false
				}) : void 0;
			}
			if (!stores.has(entry)) return this.open(context, options);
			clearIdleRetirement(entry);
			const actorRetirement = entry.actor ? retiringActors.get(entry.actor) : void 0;
			if (entry.actor && actorRetirement) {
				actorRetirement.entries.add(entry);
				stores.delete(entry);
				await joinActorRetirement(actorRetirement);
				return this.open(context, options);
			}
			if (!isSqliteWorkerStoreAvailable(store) && !hasActiveActorOperations(entry)) {
				await (entry.actor ? retireActor(entry.actor, admission.identity) : retire(entry));
				return this.open(context, options);
			}
			try {
				if (!entry.bound) {
					publishOpenClawStateDatabaseWorkerAdmission(entry.context.admission);
					entry.bound = true;
				}
			} catch (error) {
				try {
					await retire(entry);
				} catch (cleanupError) {
					throw new AggregateError([error, cleanupError], "Shared-state worker binding and cleanup failed", { cause: cleanupError });
				}
				throw error;
			}
			stores.delete(entry);
			stores.add(entry);
			return store;
		}
	};
}
function owner() {
	return resolveGlobalSingleton(Symbol.for("openclaw.sharedStateWorkerOwner"), createSharedStateWorkerOwner, (sharedOwner) => sharedOwner.close());
}
/** Retired cleanup uses the retained owner's backend without renewing read admission. */
function openOpenClawStateWorkerCleanupStore(databasePath, context, assertOwned) {
	return owner().openCleanup(databasePath, context, assertOwned);
}
async function executeOpenClawStateWorker(context, command) {
	const result = await runOpenClawStateWorkerOperation(context, (scope) => scope.execute(command));
	context.admission.assertCurrent();
	return result;
}
async function runOpenClawStateWorkerOperation(context, operation, options) {
	return runWithCapturedWorkerContext(context, () => runAdmittedOpenClawStateWorkerOperation(context, operation, options));
}
async function runAdmittedOpenClawStateWorkerOperation(context, operation, options) {
	try {
		context.admission.assertCurrent();
		options?.assertCurrent?.();
		const failure = await getOpenClawStateDatabaseTerminalFailureAsync(context);
		if (failure) throw failure;
		context.admission.assertCurrent();
		options?.assertCurrent?.();
		const store = await owner().open(context, options);
		context.admission.assertCurrent();
		if (!store) {
			if (options?.existingOnly) return;
			throw new Error("Canonical shared-state worker did not open its database");
		}
		const releaseOperation = owner().retainOperation(store);
		try {
			context.admission.assertCurrent();
			options?.assertCurrent?.();
			return await runWithOpenClawStateWorkerStore(store, context, operation, options?.assertCurrent, options?.createAdmission, options?.requireStateLifecycle === true || options?.createAdmission !== void 0);
		} finally {
			releaseOperation();
		}
	} catch (error) {
		if (error instanceof Error) throw hydrateOpenClawStateWorkerError(error);
		throw error;
	}
}
/** Inspect the existing file without recursively admitting a domain operation. */
async function inspectOpenClawStateDatabase(context, command) {
	return runWithCapturedWorkerContext(context, () => inspectAdmittedOpenClawStateDatabase(context, command));
}
async function inspectAdmittedOpenClawStateDatabase(context, command) {
	try {
		const store = await owner().open(context, { existingOnly: true });
		context.admission.assertCurrent();
		if (!store) return;
		const releaseOperation = owner().retainOperation(store);
		try {
			context.admission.assertCurrent();
			return await runWithOpenClawStateWorkerStore(store, context, (scope) => scope.execute(command));
		} finally {
			releaseOperation();
		}
	} catch (error) {
		if (error instanceof Error) throw hydrateOpenClawStateWorkerError(error);
		throw error;
	}
}
//#endregion
export { runOpenClawStateWorkerOperation as i, inspectOpenClawStateDatabase as n, openOpenClawStateWorkerCleanupStore as r, executeOpenClawStateWorker as t };
