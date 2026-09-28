import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { t as createSubsystemLogger } from "./subsystem-DleLyu58.mjs";
import { i as stageSqliteTransactionState } from "./sqlite-post-commit-DJbkHzN8.mjs";
import { n as createSqliteLifecycleAggregateError } from "./sqlite-coordinator-z2lO0ops.mjs";
import { p as openClawStateDatabaseCache, r as captureOpenClawStateDatabaseReadAdmission, v as registerOpenClawStateDatabaseLifecycleListener } from "./openclaw-state-db-cache-Ci98mtX8.mjs";
import { s as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-DYMh54HD.mjs";
import { t as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-Dn3_Z_Oi.mjs";
import { a as isSqliteWorkerError } from "./sqlite-worker-contract-DgNznZvn.mjs";
import { Ct as buildManagedTaskFlowPatch, Dt as normalizeRestoredFlowRecord, Ot as prepareTaskMirroredFlowSyncFromCurrent, St as buildFlowRecord, Tt as cloneFlowRecord, bt as areTaskFlowRecordsEqual, kt as selectTaskFlowRecords, wt as buildTaskMirroredFlowCreateFields, xt as assertControllerId } from "./task-registry.store.kernel-BuNI8UuR.mjs";
import { n as isTerminalTaskFlow } from "./task-flow-registry.types-BidrdCoB.mjs";
import { c as upsertTaskFlowRegistryRecordToSqlite, i as loadTaskFlowRegistryStateFromSqlite, n as closeTaskFlowRegistryDatabase, o as syncTaskMirroredFlowInSqlite, r as deleteTaskFlowRegistryRecordFromSqlite, s as updateTaskFlowRegistryRecordInSqlite } from "./task-flow-registry.store.sqlite-DM-mfTLX.mjs";
//#region src/tasks/task-flow-registry.store.ts
const log$1 = createSubsystemLogger("tasks/task-flow-registry");
const defaultFlowRegistryStore = {
	async withSnapshotAsync(context, consume) {
		const { runOpenClawStateWorkerOperation } = await import("./openclaw-state-worker-store-BgU7tLf5.mjs");
		return runOpenClawStateWorkerOperation(context, async (scope) => {
			const snapshot = await scope.execute({
				type: "flows.snapshot",
				input: void 0
			});
			context.admission.assertCurrent();
			return consume(snapshot);
		});
	},
	async readFlowAsync(context, flowId) {
		const { executeOpenClawStateWorker } = await import("./openclaw-state-worker-store-BgU7tLf5.mjs");
		return executeOpenClawStateWorker(context, {
			type: "flows.current",
			input: { flowId }
		});
	},
	loadSnapshot: loadTaskFlowRegistryStateFromSqlite,
	upsertFlow: upsertTaskFlowRegistryRecordToSqlite,
	syncMirroredTask: syncTaskMirroredFlowInSqlite,
	updateFlow: updateTaskFlowRegistryRecordInSqlite,
	deleteFlow: deleteTaskFlowRegistryRecordFromSqlite,
	close: closeTaskFlowRegistryDatabase
};
let configuredFlowRegistryStore = defaultFlowRegistryStore;
function getTaskFlowRegistryStore() {
	return configuredFlowRegistryStore;
}
function configureTaskFlowRegistryRuntime(params) {
	if (params.store) configuredFlowRegistryStore = params.store;
}
function resetTaskFlowRegistryRuntimeForTests() {
	configuredFlowRegistryStore.close?.();
	configuredFlowRegistryStore = defaultFlowRegistryStore;
}
function prepareTaskFlowRecordPublication(params) {
	const { cached, current, applied, write, advance, onCommitted } = params;
	const canonical = current ? cloneFlowRecord(current) : void 0;
	const next = applied || !areTaskFlowRecordsEqual(cached ? normalizeRestoredFlowRecord(cached) : void 0, canonical) ? canonical : cached;
	return {
		stage: () => {
			advance();
			write(next);
		},
		rollback: () => {
			advance();
			write(cached);
		},
		commit: () => {
			onCommitted();
			advance();
		}
	};
}
function tryPersistFlowUpsert(flow, operation) {
	try {
		getTaskFlowRegistryStore().upsertFlow(cloneFlowRecord(flow));
		return true;
	} catch (error) {
		log$1.warn("Failed to persist task-flow registry upsert", {
			operation,
			flowId: flow.flowId,
			error
		});
		return false;
	}
}
function tryPersistFlowDelete(flowId) {
	try {
		getTaskFlowRegistryStore().deleteFlow(flowId);
		return true;
	} catch (error) {
		log$1.warn("Failed to persist task-flow registry delete", {
			flowId,
			error
		});
		return false;
	}
}
if (process.env.VITEST || false) globalThis[Symbol.for("openclaw.taskFlowRegistryStoreTestApi")] = { configureTaskFlowRegistryRuntime };
//#endregion
//#region src/tasks/task-flow-registry.read.ts
/** Read adapters share the registry's projection and publication witnesses. */
function createTaskFlowRegistryReaders(owner) {
	const getTaskFlowById = (flowId) => {
		owner.ensureReady();
		const flow = owner.projection().flows.get(flowId);
		return flow ? cloneFlowRecord(flow) : void 0;
	};
	const listTaskFlowsForOwnerKey = (ownerKey) => {
		owner.ensureReady();
		return selectTaskFlowRecords(owner.projection().flows, ownerKey);
	};
	const findTaskFlowForOwnerLookup = (ownerKey) => {
		const ownerFlows = listTaskFlowsForOwnerKey(ownerKey);
		return ownerFlows.find((flow) => !isTerminalTaskFlow(flow)) ?? ownerFlows[0];
	};
	const prepareTaskFlowRegistryRead = async (context = captureOpenClawStateWorkerContext()) => {
		const store = getTaskFlowRegistryStore();
		const accepted = [];
		for (const pending of owner.pendingWrites.values()) for (const completion of pending.completions) accepted.push(completion);
		const assertOwner = () => {
			context.admission.assertCurrent();
			if (!owner.isCurrentDatabase(context.admission) || getTaskFlowRegistryStore() !== store) throw new Error("Task-flow registry read owner is no longer current.");
		};
		await Promise.all(accepted);
		assertOwner();
		await owner.ensureReadyAsync(context);
		assertOwner();
		for (let attempt = 0;; attempt += 1) {
			const projection = owner.projection();
			if (!projection.dirty && projection.dirtyFlowIds.size === 0) break;
			if (attempt === 3) return;
			let installed = false;
			await store.withSnapshotAsync(context, (snapshot) => {
				assertOwner();
				if (projection.epoch === owner.projection().epoch) {
					owner.installSnapshot(snapshot, context.admission);
					installed = true;
				}
			});
			assertOwner();
			if (installed) break;
		}
		const assertCurrent = () => {
			assertOwner();
			const projection = owner.projection();
			if (projection.dirty || !projection.ready) throw new Error("Task-flow registry read projection is no longer ready.");
		};
		assertCurrent();
		return {
			assertOwnerCurrent: assertOwner,
			assertCurrent,
			listTaskFlowIds() {
				assertCurrent();
				return [...owner.projection().flows.values()].toSorted((left, right) => right.createdAt - left.createdAt).map((flow) => flow.flowId);
			},
			isTaskFlowCurrent(flowId) {
				assertCurrent();
				return !owner.projection().dirtyFlowIds.has(flowId);
			},
			getTaskFlowById(flowId) {
				assertCurrent();
				const projection = owner.projection();
				if (projection.dirtyFlowIds.has(flowId)) throw new Error("Task-flow registry read identity requires preparation.");
				const flow = projection.flows.get(flowId);
				return flow ? cloneFlowRecord(flow) : void 0;
			}
		};
	};
	return {
		prepareTaskFlowRegistryRead,
		getTaskFlowById,
		getTaskMirroredFlowIds(flowIds) {
			owner.ensureReady();
			const mirrored = /* @__PURE__ */ new Set();
			for (const flowId of flowIds) if (owner.projection().flows.get(flowId)?.syncMode === "task_mirrored") mirrored.add(flowId);
			return mirrored;
		},
		listTaskFlowsForOwnerKey,
		findLatestTaskFlowForOwnerKey: (ownerKey) => listTaskFlowsForOwnerKey(ownerKey)[0],
		findTaskFlowForOwnerLookup,
		resolveTaskFlowForLookupToken(token) {
			const lookup = token.trim();
			return lookup ? getTaskFlowById(lookup) ?? findTaskFlowForOwnerLookup(lookup) : void 0;
		},
		listTaskFlowRecords() {
			owner.ensureReady();
			return selectTaskFlowRecords(owner.projection().flows);
		}
	};
}
//#endregion
//#region src/tasks/task-flow-worker-publication.ts
/** A witnessed committed projection write supersedes a held read, including absent ABA. */
async function reconcileTaskFlowWorkerPublication(params) {
	const { pending, assertCurrent, current, read, install } = params;
	const predecessor = pending.readTail;
	const phase = createDeferredCore();
	pending.readTail = phase.promise;
	const witness = { written: false };
	let conflicted = false;
	try {
		await predecessor;
		assertCurrent();
		pending.readers.add(witness);
		const before = current();
		const captured = before && cloneFlowRecord(before);
		const record = await read();
		pending.readers.delete(witness);
		assertCurrent();
		const cached = current();
		conflicted = witness.written || !areTaskFlowRecordsEqual(captured, cached);
		const next = conflicted ? cached : record ? normalizeRestoredFlowRecord(record) : void 0;
		if (!areTaskFlowRecordsEqual(cached, next)) install(next);
	} finally {
		pending.readers.delete(witness);
		if (pending.readTail === phase.promise) delete pending.readTail;
		phase.resolve();
	}
	return !conflicted;
}
//#endregion
//#region src/tasks/task-registry-restore.ts
/** One synchronous restore may reread once; settlement and publication stay with its owner. */
function createSyncRegistryReader(owner) {
	let admission = owner.admission;
	let invalidated = false;
	let retried = false;
	const assertCurrent = () => {
		try {
			admission.assertCurrent();
			if (!owner.isCurrent() || !owner.isCurrentDatabase(admission)) throw new Error(owner.changedMessage);
		} catch (error) {
			invalidated = true;
			throw error;
		}
	};
	return {
		get admission() {
			return admission;
		},
		get invalidated() {
			return invalidated;
		},
		assertCurrent,
		loadSnapshot() {
			if (!owner.isCurrent()) assertCurrent();
			const snapshot = owner.loadSnapshot();
			try {
				assertCurrent();
				return snapshot;
			} catch (error) {
				if (retried || !owner.isCurrent()) throw error;
				retried = true;
				admission = owner.captureAdmission();
				assertCurrent();
				invalidated = false;
				const current = owner.loadSnapshot();
				assertCurrent();
				return current;
			}
		}
	};
}
/** Coalesce preparation; each registry retains its authoritative state and publication. */
function createAsyncRegistryRestore(owner) {
	let pending;
	const ensure = async (context) => {
		context.admission.assertCurrent();
		if (!owner.isCurrentDatabase(context.admission)) return;
		let previous = pending;
		if (previous) try {
			previous.context.admission.assertCurrent();
			if (previous.context.admission.identity.key !== context.admission.identity.key) previous = void 0;
		} catch {
			previous = void 0;
		}
		if (previous) {
			await previous.promise;
			return ensure(context);
		}
		const state = owner.getState(context.admission);
		if (state.status === "ready") {
			owner.onReady?.();
			return;
		}
		if (state.status === "failed") throw state.error;
		const restore = Promise.resolve().then(async () => {
			const receipts = [];
			const reconcile = async () => {
				const errors = [];
				for (let receipt = receipts.shift(); receipt; receipt = receipts.shift()) try {
					if (owner.reconcile) await owner.reconcile(receipt.snapshot, context, receipt.store, receipt.reconcile);
					else await receipt.reconcile();
				} catch (error) {
					errors.push(error);
				}
				if (errors.length === 1) throw errors[0];
				if (errors.length > 1) throw createSqliteLifecycleAggregateError(errors, "Registry restore receipt reconciliation failed", errors[0]);
			};
			let failCurrent;
			try {
				for (;;) {
					failCurrent = void 0;
					context.admission.assertCurrent();
					if (!owner.isCurrentDatabase(context.admission)) {
						await reconcile();
						return;
					}
					const before = owner.getState(context.admission);
					if (before.status === "ready") {
						await reconcile();
						return;
					}
					if (before.status === "failed") throw before.error;
					const revision = owner.getRevision();
					const store = owner.getStore();
					const isCurrent = () => owner.isCurrentDatabase(context.admission) && owner.getState(context.admission) === before && owner.getRevision() === revision && owner.getStore() === store;
					let applied = false;
					failCurrent = () => !applied && isCurrent();
					await store.withSnapshotAsync(context, async (snapshot, reconcileSnapshot) => {
						if (owner.reconcile || reconcileSnapshot) receipts.push({
							snapshot,
							store,
							reconcile: reconcileSnapshot ?? (async () => {})
						});
						owner.received?.(snapshot, context, store);
						context.admission.assertCurrent();
						if (!isCurrent()) return;
						const publish = owner.install(snapshot, context);
						applied = true;
						await publish(reconcile);
					});
				}
			} catch (error) {
				let failure = error;
				const secondary = [];
				let admitted = true;
				try {
					context.admission.assertCurrent();
				} catch (admissionError) {
					admitted = false;
					if (admissionError !== error) secondary.push(admissionError);
				}
				if (admitted && failCurrent?.() && !isSqliteWorkerError(error, "overloaded")) try {
					owner.fail(error, context.admission);
				} catch (restoreError) {
					failure = restoreError;
				}
				try {
					await reconcile();
				} catch (reconciliationError) {
					secondary.push(reconciliationError);
				}
				if (secondary.length > 0) throw createSqliteLifecycleAggregateError([failure, ...secondary], "Registry restore failed with additional lifecycle errors", failure);
				throw failure;
			}
		});
		pending = {
			context,
			promise: restore
		};
		try {
			await restore;
		} finally {
			if (pending?.promise === restore) pending = void 0;
		}
		context.admission.assertCurrent();
		await ensure(context);
	};
	return ensure;
}
//#endregion
//#region src/tasks/task-flow-registry.ts
const log = createSubsystemLogger("tasks/task-flow-registry");
let flows = /* @__PURE__ */ new Map();
let projectionEpoch = 0;
let projectionDirty = false;
const dirtyFlowIds = /* @__PURE__ */ new Set();
const pendingFlowWrites = /* @__PURE__ */ new Map();
function recordFlowProjectionWrite(flowId) {
	for (const [id, pending] of pendingFlowWrites) {
		if (flowId !== void 0 && id !== flowId) continue;
		for (const reader of pending.readers) reader.written = true;
	}
}
registerOpenClawStateDatabaseLifecycleListener((event) => {
	if (event.kind !== "opened") {
		projectionEpoch += 1;
		projectionDirty = true;
	}
});
let taskFlowRegistryRestoreState = { status: "uninitialized" };
/** Event overlays use recorded facts without entering a synchronous projection refresh. */
function readResidentTaskFlow(flowId) {
	return flows.get(flowId);
}
function failTaskFlowRegistryRestore(error, admission) {
	flows = /* @__PURE__ */ new Map();
	recordFlowProjectionWrite();
	const message = formatErrorMessage(error);
	const restoreError = new Error(`Task-flow registry restore failed: ${message}`, { cause: error });
	taskFlowRegistryRestoreState = {
		status: "failed",
		error: restoreError,
		message,
		admission
	};
	log.warn("Failed to restore task-flow registry", {
		error: message,
		consoleMessage: `Failed to restore task-flow registry: ${message}`
	});
	throw restoreError;
}
function getTaskFlowRegistryRestoreState(admission) {
	let requiresRestore = taskFlowRegistryRestoreState.status !== "uninitialized" && taskFlowRegistryRestoreState.admission.identity.key !== admission.identity.key;
	if (taskFlowRegistryRestoreState.status === "ready") try {
		taskFlowRegistryRestoreState.admission.assertCurrent();
	} catch {
		requiresRestore = true;
	}
	if (requiresRestore) {
		taskFlowRegistryRestoreState = { status: "uninitialized" };
		projectionEpoch += 1;
	}
	return taskFlowRegistryRestoreState;
}
function installTaskFlowRegistrySnapshot(snapshot, admission) {
	flows = new Map([...snapshot.flows].map(([id, flow]) => [id, normalizeRestoredFlowRecord(flow)]));
	recordFlowProjectionWrite();
	projectionEpoch += 1;
	projectionDirty = false;
	dirtyFlowIds.clear();
	for (const flowId of pendingFlowWrites.keys()) dirtyFlowIds.add(flowId);
	taskFlowRegistryRestoreState = {
		status: "ready",
		admission
	};
}
function restoreTaskFlowRegistryOnce() {
	const databasePath = resolveOpenClawStateSqlitePath();
	const admission = captureOpenClawStateDatabaseReadAdmission(databasePath);
	const state = getTaskFlowRegistryRestoreState(admission);
	switch (state.status) {
		case "ready": return;
		case "failed": throw state.error;
		case "restoring": throw new Error("Task-flow registry restore is already in progress.");
	}
	const store = getTaskFlowRegistryStore();
	const restoring = taskFlowRegistryRestoreState = {
		status: "restoring",
		admission
	};
	const epoch = projectionEpoch;
	const ownsRestore = () => taskFlowRegistryRestoreState === restoring && getTaskFlowRegistryStore() === store && resolveOpenClawStateSqlitePath() === databasePath;
	const reader = createSyncRegistryReader({
		admission,
		captureAdmission: () => captureOpenClawStateDatabaseReadAdmission(databasePath),
		isCurrent: () => ownsRestore() && projectionEpoch === epoch,
		isCurrentDatabase: isCurrentTaskFlowDatabase,
		loadSnapshot: () => store.loadSnapshot(),
		changedMessage: "Task-flow registry restore changed before publication."
	});
	let installing = false;
	try {
		const restored = reader.loadSnapshot();
		installing = true;
		installTaskFlowRegistrySnapshot(restored, reader.admission);
	} catch (error) {
		if (!installing && (reader.invalidated || !ownsRestore())) {
			if (taskFlowRegistryRestoreState === restoring) taskFlowRegistryRestoreState = state;
			throw error;
		}
		failTaskFlowRegistryRestore(error, reader.admission);
	}
}
function ensureTaskFlowRegistryReady(options) {
	restoreTaskFlowRegistryOnce();
	if (options?.refreshProjection === false || !projectionDirty && dirtyFlowIds.size === 0) return;
	const flowIds = projectionDirty ? void 0 : [...dirtyFlowIds];
	const restored = getTaskFlowRegistryStore().loadSnapshot(flowIds);
	const previous = flows;
	const next = new Map(previous);
	for (const flowId of flowIds ?? next.keys()) if (!restored.flows.has(flowId)) next.delete(flowId);
	for (const [flowId, flow] of restored.flows) next.set(flowId, normalizeRestoredFlowRecord(flow));
	const publication = {
		stage: () => {
			flows = next;
			projectionEpoch += 1;
			projectionDirty = false;
			dirtyFlowIds.clear();
			for (const flowId of pendingFlowWrites.keys()) dirtyFlowIds.add(flowId);
		},
		rollback: () => {
			flows = previous;
			projectionEpoch += 1;
			projectionDirty = true;
		},
		commit: () => {
			recordFlowProjectionWrite();
			projectionEpoch += 1;
		}
	};
	const database = openClawStateDatabaseCache.getOpenClawStateDatabaseIfOpenAtPath(resolveOpenClawStateSqlitePath());
	if (!database || !stageSqliteTransactionState(database.db, publication)) {
		publication.stage();
		recordFlowProjectionWrite();
	}
}
const ensureTaskFlowRegistryReadyAsync = createAsyncRegistryRestore({
	isCurrentDatabase: isCurrentTaskFlowDatabase,
	getState: getTaskFlowRegistryRestoreState,
	getRevision: () => projectionEpoch,
	getStore: getTaskFlowRegistryStore,
	install(snapshot, { admission }) {
		installTaskFlowRegistrySnapshot(snapshot, admission);
		return () => {};
	},
	fail(error, admission) {
		projectionEpoch += 1;
		return failTaskFlowRegistryRestore(error, admission);
	}
});
const { prepareTaskFlowRegistryRead, getTaskFlowById, getTaskMirroredFlowIds, listTaskFlowsForOwnerKey, findLatestTaskFlowForOwnerKey, findTaskFlowForOwnerLookup, resolveTaskFlowForLookupToken, listTaskFlowRecords } = createTaskFlowRegistryReaders({
	projection: () => ({
		flows,
		epoch: projectionEpoch,
		dirty: projectionDirty,
		ready: taskFlowRegistryRestoreState.status === "ready",
		dirtyFlowIds
	}),
	pendingWrites: pendingFlowWrites,
	ensureReady: ensureTaskFlowRegistryReady,
	ensureReadyAsync: ensureTaskFlowRegistryReadyAsync,
	isCurrentDatabase: isCurrentTaskFlowDatabase,
	installSnapshot: installTaskFlowRegistrySnapshot
});
async function reloadTaskFlowRegistryFromStoreAsync(context) {
	context.admission.assertCurrent();
	if (!isCurrentTaskFlowDatabase(context.admission)) return;
	projectionEpoch += 1;
	taskFlowRegistryRestoreState = { status: "uninitialized" };
	await ensureTaskFlowRegistryReadyAsync(context);
}
function isCurrentTaskFlowDatabase(admission) {
	return openClawStateDatabaseCache.getKnownOpenClawStateDatabaseIdentity(resolveOpenClawStateSqlitePath())?.key === admission.identity.key;
}
/** Worker receipts reconcile durable rows without resetting live task or delivery owners. */
function beginTaskFlowRegistryWorkerMutation(context, readCurrent) {
	const { flowId, admission } = context;
	const store = getTaskFlowRegistryStore();
	admission.assertCurrent();
	const pending = pendingFlowWrites.get(flowId) ?? {
		completions: /* @__PURE__ */ new Set(),
		readers: /* @__PURE__ */ new Set()
	};
	const completion = createDeferredCore();
	pending.completions.add(completion.promise);
	pendingFlowWrites.set(flowId, pending);
	dirtyFlowIds.add(flowId);
	projectionEpoch += 1;
	return async () => {
		dirtyFlowIds.add(flowId);
		projectionEpoch += 1;
		let reconciled = false;
		try {
			const assertOwner = () => {
				admission.assertCurrent();
				if (!isCurrentTaskFlowDatabase(admission) || getTaskFlowRegistryStore() !== store) {
					projectionDirty = true;
					throw new Error("Task-flow registry publication owner is no longer current.");
				}
			};
			reconciled = await reconcileTaskFlowWorkerPublication({
				pending,
				assertCurrent: assertOwner,
				current: () => flows.get(flowId),
				read: readCurrent,
				install(next) {
					if (next) flows.set(flowId, next);
					else flows.delete(flowId);
					recordFlowProjectionWrite(flowId);
				}
			});
		} catch (error) {
			context.onPublicationError?.(error);
			log.warn("Failed to reconcile task-flow state after worker operation", {
				flowId,
				error
			});
		} finally {
			pending.completions.delete(completion.promise);
			if (pending.completions.size === 0) {
				pendingFlowWrites.delete(flowId);
				if (reconciled) dirtyFlowIds.delete(flowId);
			}
			completion.resolve();
		}
	};
}
async function runTaskFlowRegistryWorkerMutation(context, mutate, readCurrent) {
	const settle = beginTaskFlowRegistryWorkerMutation(context, readCurrent);
	try {
		return await mutate();
	} catch (error) {
		log.warn("Failed to persist task-flow worker mutation", {
			flowId: context.flowId,
			error
		});
		throw error;
	} finally {
		await settle();
	}
}
function getTaskFlowRegistryRestoreFailure() {
	try {
		ensureTaskFlowRegistryReady();
		return null;
	} catch {
		return taskFlowRegistryRestoreState.status === "failed" ? taskFlowRegistryRestoreState.message : "Task-flow registry restore did not complete.";
	}
}
function writeFlowRecord(next) {
	if (!tryPersistFlowUpsert(next, "create")) return null;
	flows.set(next.flowId, next);
	recordFlowProjectionWrite(next.flowId);
	projectionEpoch += 1;
	return cloneFlowRecord(next);
}
function createFlowRecord(params) {
	ensureTaskFlowRegistryReady();
	return writeFlowRecord(buildFlowRecord(params));
}
function createManagedTaskFlow(params) {
	return createFlowRecord({
		...params,
		syncMode: "managed",
		controllerId: assertControllerId(params.controllerId)
	});
}
function createTaskFlowForTask(params) {
	return createFlowRecord(buildTaskMirroredFlowCreateFields(params));
}
function prepareFlowRecordPublication(flowId, cached, current, applied) {
	return prepareTaskFlowRecordPublication({
		cached,
		current,
		applied,
		write(next) {
			if (next) flows.set(flowId, next);
			else flows.delete(flowId);
		},
		advance: () => {
			projectionEpoch += 1;
		},
		onCommitted: () => recordFlowProjectionWrite(flowId)
	});
}
function updateFlowRecordByIdExpectedRevision(params) {
	ensureTaskFlowRegistryReady();
	const cached = flows.get(params.flowId);
	let result;
	try {
		result = getTaskFlowRegistryStore().updateFlow(params, (observed) => {
			const current = observed.applied ? observed.flow : observed.reason === "revision_conflict" ? observed.current : void 0;
			return prepareFlowRecordPublication(params.flowId, cached, current, observed.applied);
		});
	} catch (error) {
		log.warn("Failed to persist task-flow registry update", {
			flowId: params.flowId,
			error
		});
		return {
			applied: false,
			reason: "persist_failed",
			...cached ? { current: cloneFlowRecord(cached) } : {}
		};
	}
	if (result.applied) return {
		applied: true,
		flow: cloneFlowRecord(result.flow)
	};
	if (result.reason === "invalid_patch") throw result.error;
	return result.reason === "revision_conflict" ? {
		...result,
		current: cloneFlowRecord(result.current)
	} : result;
}
function setFlowWaiting(params) {
	return updateFlowRecordByIdExpectedRevision({
		flowId: params.flowId,
		expectedRevision: params.expectedRevision,
		patch: buildManagedTaskFlowPatch("setWaiting", params)
	});
}
function resumeFlow(params) {
	return updateFlowRecordByIdExpectedRevision({
		flowId: params.flowId,
		expectedRevision: params.expectedRevision,
		patch: buildManagedTaskFlowPatch("resume", params)
	});
}
function finishFlow(params) {
	return updateFlowRecordByIdExpectedRevision({
		flowId: params.flowId,
		expectedRevision: params.expectedRevision,
		patch: buildManagedTaskFlowPatch("finish", params)
	});
}
function failFlow(params) {
	return updateFlowRecordByIdExpectedRevision({
		flowId: params.flowId,
		expectedRevision: params.expectedRevision,
		patch: buildManagedTaskFlowPatch("fail", params)
	});
}
function requestFlowCancel(params) {
	return updateFlowRecordByIdExpectedRevision({
		flowId: params.flowId,
		expectedRevision: params.expectedRevision,
		patch: buildManagedTaskFlowPatch("requestCancel", params)
	});
}
function syncFlowFromTaskResult(task) {
	const flowId = task.parentFlowId?.trim();
	if (!flowId) return {
		ok: true,
		flow: null
	};
	ensureTaskFlowRegistryReady({ refreshProjection: false });
	const cached = flows.get(flowId);
	if (!projectionDirty && !dirtyFlowIds.has(flowId) && (!cached || cached.syncMode !== "task_mirrored")) return {
		ok: true,
		flow: cached ? cloneFlowRecord(cached) : null
	};
	try {
		const result = getTaskFlowRegistryStore().syncMirroredTask(task, (observed) => prepareFlowRecordPublication(flowId, cached, observed.flow ?? void 0, observed.changed));
		return {
			ok: true,
			flow: result.flow ? cloneFlowRecord(result.flow) : null
		};
	} catch (error) {
		const current = getTaskFlowById(flowId);
		if (!current || current.syncMode !== "task_mirrored") return {
			ok: true,
			flow: current ?? null
		};
		log.warn("Failed to persist task-mirrored flow", {
			flowId,
			taskId: task.taskId,
			error
		});
		return {
			ok: false,
			reason: "persist_failed",
			current
		};
	}
}
function prepareTaskMirroredFlowSync(task) {
	const flowId = task.parentFlowId?.trim();
	if (!flowId) return;
	const flow = getTaskFlowById(flowId);
	return flow?.syncMode === "task_mirrored" ? prepareTaskMirroredFlowSyncFromCurrent(task, flow) : void 0;
}
/** Publishes a mirrored flow record already committed by a shared-state transaction. */
function publishTaskFlowAfterAtomicStore(prepared) {
	const next = cloneFlowRecord(prepared.next);
	flows.set(next.flowId, next);
	recordFlowProjectionWrite(next.flowId);
	projectionEpoch += 1;
}
function deleteTaskFlowRecordById(flowId) {
	ensureTaskFlowRegistryReady();
	if (!flows.get(flowId)) return false;
	if (!tryPersistFlowDelete(flowId)) return false;
	flows.delete(flowId);
	recordFlowProjectionWrite(flowId);
	projectionEpoch += 1;
	return true;
}
function resetTaskFlowRegistryForTests() {
	projectionEpoch += 1;
	projectionDirty = false;
	dirtyFlowIds.clear();
	flows = /* @__PURE__ */ new Map();
	recordFlowProjectionWrite();
	taskFlowRegistryRestoreState = { status: "uninitialized" };
	resetTaskFlowRegistryRuntimeForTests();
	getTaskFlowRegistryStore().close?.();
}
if (process.env.VITEST || false) globalThis[Symbol.for("openclaw.taskFlowRegistryTestApi")] = {
	createFlowRecord,
	resetTaskFlowRegistryForTests
};
//#endregion
export { getTaskFlowRegistryStore as A, resumeFlow as C, updateFlowRecordByIdExpectedRevision as D, syncFlowFromTaskResult as E, createAsyncRegistryRestore as O, resolveTaskFlowForLookupToken as S, setFlowWaiting as T, prepareTaskMirroredFlowSync as _, ensureTaskFlowRegistryReady as a, reloadTaskFlowRegistryFromStoreAsync as b, findLatestTaskFlowForOwnerKey as c, getTaskFlowById as d, getTaskFlowRegistryRestoreFailure as f, prepareTaskFlowRegistryRead as g, listTaskFlowsForOwnerKey as h, deleteTaskFlowRecordById as i, createSyncRegistryReader as k, findTaskFlowForOwnerLookup as l, listTaskFlowRecords as m, createManagedTaskFlow as n, ensureTaskFlowRegistryReadyAsync as o, getTaskMirroredFlowIds as p, createTaskFlowForTask as r, failFlow as s, beginTaskFlowRegistryWorkerMutation as t, finishFlow as u, publishTaskFlowAfterAtomicStore as v, runTaskFlowRegistryWorkerMutation as w, requestFlowCancel as x, readResidentTaskFlow as y };
