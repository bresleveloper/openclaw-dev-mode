import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { i as resolveGlobalSingleton } from "./global-singleton-Dc_stLtU.mjs";
import { t as err } from "./result-BQGgYouL.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { i as stageSqliteTransactionState, t as deferSqlitePostCommitPublication } from "./sqlite-post-commit-DJbkHzN8.mjs";
import { n as createSqliteLifecycleAggregateError } from "./sqlite-coordinator-z2lO0ops.mjs";
import { _ as registerOpenClawStateDatabaseAsyncResource, p as openClawStateDatabaseCache } from "./openclaw-state-db-cache-Ci98mtX8.mjs";
import { t as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-Dn3_Z_Oi.mjs";
import { x as runWithGatewayDetachedWorkContinuation } from "./gateway-work-admission-CHv_0noy.mjs";
import { c as getAgentRunContext, d as getAgentRunLifecycleGeneration } from "./agent-run-registry-DO6Dg2r0.mjs";
import { f as onAgentEvent, h as registerAgentEventLifecycleRotationHandler } from "./agent-events-BOSJcayE.mjs";
import { r as onSessionIdentityMutation } from "./session-lifecycle-events-DiXxneBV.mjs";
import { n as restoreAgentSchemaInspectionError } from "./openclaw-agent-schema-inspection-response-q57qjoFT.mjs";
import { B as isEquivalentTaskRecord, D as sameTaskBackingInstance, E as readTaskBackingInstance, H as matchesTaskPersistenceReceipt, L as filterTasksByRunScope, N as cloneTaskRecord, P as cloneTaskRecordForObserver, T as readManagedTaskBacking, U as normalizeTaskTimestamps, it as resolveTaskTerminalOutcome, j as captureTaskPersistenceReceipt, nt as normalizeTaskSummary, q as sameTaskRunScope } from "./task-registry.store.kernel-BuNI8UuR.mjs";
import { r as isTerminalTaskStatus, s as parseTaskNotifyPolicy } from "./task-registry.types-CkM1jc3D.mjs";
import { A as getTaskFlowRegistryStore, p as getTaskMirroredFlowIds } from "./task-flow-runtime-internal-DFSz6gyF.mjs";
import { t as captureTaskExecutionOwner } from "./task-execution-owner-CARpGK5P.mjs";
import { C as updateRunIdIndex, _ as recordTaskRegistryProjectionWrite, d as deleteRelatedSessionKeyIndex, f as getTaskRegistryProcessState, i as addRunIdIndex, l as deleteOwnerKeyIndex, m as getTasksByRunScope, n as addParentFlowIdIndex, p as getTasksByRunId, r as addRelatedSessionKeyIndex, s as clearTaskProgressBatches, t as addOwnerKeyIndex, u as deleteParentFlowIdIndex } from "./task-registry.process-state-Cb_kvrmQ.mjs";
import { a as onTaskRegistryChange, c as tryPersistTaskDeliveryStateUpsert, i as getTaskRegistryStore, l as tryPersistTaskUpsert } from "./task-registry.store-1Swe_0g5.mjs";
import { C as taskRegistryLog, E as withTaskRegistryMutation, M as setTaskRegistryListenerStarter, N as setTaskRegistryListenerStop, O as claimTaskRegistryListenerStart, _ as taskDeliveryStates, a as emitTaskRegistryObserverEvent, c as invalidateTaskRegistryProjection, m as syncFlowFromTaskAfterTaskMutation, o as ensureTaskRegistryReady, p as runTaskRegistryWorkerMutation, r as bumpTaskRegistryRevision, v as taskFlowSyncOwner, w as tasks } from "./task-registry-state-Cibd1d5c.mjs";
import { j as subagentRuns } from "./subagent-run-liveness-9vTRtoqd.mjs";
import { O as onSubagentRegistryPersisted } from "./subagent-registry-read-C2SIiLpb.mjs";
import { t as isProvisionalSubagentKillTask } from "./task-cancellation-state-7hPsgm-K.mjs";
import { i as hasResidentTaskBacking, n as getManagedTaskBackingInstance, r as hasAuthoritativeTaskBacking } from "./task-backing-authority-CIHk-jEg.mjs";
import { n as flushTaskActivity, s as recordTaskActivityEvent, t as clearTaskActivity } from "./task-registry-activity-qvAA4Okp.mjs";
import { c as matchesTaskAgentEventTarget, d as captureTaskAgentEventTarget, i as recoverTaskAgentEventPublication, l as prepareTaskAgentEventUpdate, n as selectExistingTaskForCreate, o as captureTaskAgentEventChange, s as captureTaskAgentEventLineage, t as runTaskCreateOperation, u as readTaskAgentEventCommittedTarget } from "./task-registry-create.operation-C5br7RkB.mjs";
import { a as updateTaskWithPublication, c as retainTaskMutationFlowEffects, i as updateTask, n as maybeDeliverTaskTerminalUpdate, r as publishTaskRecordUpdate, s as finishTaskMutation, t as maybeDeliverTaskStateChangeUpdate } from "./task-registry-delivery-cd3nNFSG.mjs";
import { c as runTaskRecordTransitionOperation } from "./task-initial-flow.rules-DO4-fPbE.mjs";
import { _ as ensureLinkedTaskFlowRegistryReady, g as assertParentFlowLinkAllowed, m as resetTaskRegistryForTests } from "./task-registry-query-Cb1HIUfX.mjs";
import { r as loadTaskRegistryControlRuntime } from "./task-registry-runtime-loaders-DXZqiHsn.mjs";
import { c as scheduleYieldedSubagentTaskProgress, i as reconcileTaskProgressBatches, o as retireTaskProgressForSession } from "./task-registry-progress-Dd95X-K3.mjs";
import { n as isBackgroundExecTask } from "./background-exec-task-contract-DDYMoYd-.mjs";
import { t as isHarnessOwnedSubagentTask } from "./harness-owned-subagent-task-D9k0l4Sr.mjs";
import { isDeepStrictEqual } from "node:util";
import { AsyncLocalStorage } from "node:async_hooks";
import crypto from "node:crypto";
//#region src/tasks/task-registry-agent-event-delivery.ts
function publishTaskAgentEventDelivery(delivery, assertCurrent) {
	const { receipt } = delivery;
	try {
		assertCurrent();
	} catch {
		return;
	}
	const current = tasks.get(receipt.task.taskId);
	if (!current || !delivery.isCurrent() || !isEquivalentTaskRecord(current, receipt.task)) return;
	if (receipt.task.deliveryStatus === "not_applicable" || receipt.task.notifyPolicy === "silent") return;
	if (receipt.nextEvent) maybeDeliverTaskStateChangeUpdate(receipt.task, receipt.nextEvent);
	if (isTerminalTaskStatus(receipt.task.status)) maybeDeliverTaskTerminalUpdate(receipt.task.taskId);
}
//#endregion
//#region src/tasks/task-run-owner.ts
function getTaskRunOwner(task) {
	const owner = getTaskRegistryProcessState().runOwners.get(task.taskId);
	return owner && sameTaskRunScope(owner.task, task) ? owner : void 0;
}
function bindTaskRunOwner(task, cancel) {
	return withTaskRegistryMutation(() => bindCurrentTaskRunOwner(task, cancel));
}
function bindCurrentTaskRunOwner(task, cancel) {
	const state = getTaskRegistryProcessState();
	const registeredTask = state.tasks.get(task.taskId);
	if (!registeredTask || !sameTaskRunScope(registeredTask, task)) throw new Error("Task no longer belongs to this live run.");
	const executionOwner = captureTaskExecutionOwner();
	if (executionOwner && registeredTask.status === "running") updateTask(task.taskId, { executionOwner });
	const owner = {
		task,
		cancel: (reason) => {
			const current = state.tasks.get(task.taskId);
			if (!current || getTaskRunOwner(current) !== owner) return Promise.resolve(err("Task no longer belongs to this live run."));
			return cancel(reason);
		}
	};
	state.runOwners.set(task.taskId, owner);
	return () => {
		if (state.runOwners.get(task.taskId) === owner) state.runOwners.delete(task.taskId);
	};
}
//#endregion
//#region src/tasks/task-registry-agent-events.ts
const pendingEvents = /* @__PURE__ */ new Set();
const pendingByTask = /* @__PURE__ */ new Map();
const drains = /* @__PURE__ */ new Set();
let draining = false;
let active;
registerOpenClawStateDatabaseAsyncResource({ async close(identity) {
	if (!identity || [...pendingEvents].some((pending) => pending.context.admission.identity.key === identity.key)) await Promise.allSettled(drains);
} });
function assertCurrent(pending, input = pending.input) {
	const { source, context, store, flowStore } = pending;
	context.admission.assertCurrent();
	const runContext = getAgentRunContext(source.runId);
	if (getTaskRegistryStore() !== store || getTaskFlowRegistryStore() !== flowStore || getAgentRunLifecycleGeneration() !== source.lifecycleGeneration || runContext && runContext !== source.runContext) throw new Error("Task event no longer belongs to its captured runtime owner");
	if (input.backing?.runtime === "subagent" && (subagentRuns.get(source.runId) !== source.subagent || source.subagent?.generation !== source.subagentGeneration || source.subagent?.childSessionKey !== input.expectedTask.childSessionKey)) throw new Error("Task event subagent backing was replaced");
	const current = tasks.get(input.taskId);
	if (current && !matchesTaskAgentEventTarget(current, input)) throw new Error("Task event selection was replaced");
	if (input.change.kind === "terminal" && current && getTaskRunOwner(current)) throw new Error("Task event cannot terminalize a producer-owned task");
}
function removePendingTaskBatch(pending) {
	const entries = pendingByTask.get(pending.input.taskId);
	entries?.delete(pending);
	if (entries?.size === 0) pendingByTask.delete(pending.input.taskId);
}
function forget(pending) {
	pendingEvents.delete(pending);
	removePendingTaskBatch(pending);
}
function settleNativeEvent(pending, receipt) {
	const database = openClawStateDatabaseCache.getOpenClawStateDatabaseIfOpenAtPath(pending.context.admission.databasePath);
	if (database && stageSqliteTransactionState(database.db, {
		stage() {},
		commit: () => pending.native.resolve(receipt),
		rollback: (error) => {
			invalidateTaskRegistryProjection();
			pending.native.reject(error);
		}
	})) return;
	pending.native.resolve(receipt);
}
function advanceCommittedLineage(pending, facts) {
	const next = readTaskAgentEventCommittedTarget(facts, pending.input);
	if (pending.committedTarget) return;
	pending.committedTarget = next;
	for (const entry of pendingByTask.get(pending.input.taskId) ?? []) if (entry !== pending && entry !== active && entry.store === pending.store && entry.context.admission.identity.key === pending.context.admission.identity.key && sameSource(entry.source, pending.source) && isDeepStrictEqual(entry.input.expectedTask, pending.input.expectedTask) && isDeepStrictEqual(entry.input.backing, pending.input.backing)) entry.input = {
		...entry.input,
		expectedTask: next
	};
}
function reportFailure(pending, error) {
	taskRegistryLog.warn(pending.receipt || pending.committedTarget ? "Task agent event committed before follow-up failed" : "Failed to persist accepted task agent event", {
		taskId: pending.input.taskId,
		runId: pending.source.runId,
		error
	});
}
function retainCommittedEventAfterResultFailure(pending) {
	const facts = pending.phase.kind === "granted" ? pending.phase.owner.settlement?.committed?.facts : void 0;
	if (!pending.receipt && facts !== void 0) {
		pending.commitFacts = facts;
		advanceCommittedLineage(pending, facts);
	}
}
function prepareNativeEventConsumption() {
	const store = getTaskRegistryStore();
	const pending = [...pendingEvents].filter((entry) => entry.store === store && entry.phase.kind !== "consumed");
	if (!pending.length) return;
	const claimed = pending.filter((entry) => entry.phase.kind !== "granted" && entry.phase.kind !== "native");
	for (const entry of claimed) entry.phase = { kind: "native" };
	let released = false;
	const release = () => {
		if (released) return;
		released = true;
		for (const entry of claimed) if (entry.phase.kind === "native") entry.phase = { kind: entry === active ? "worker" : "waiting" };
	};
	try {
		if (pending.some((entry) => entry.phase.kind === "granted")) store.settleAgentEventWrites((deadlineMs) => {
			for (const entry of pending) {
				if (entry.phase.kind !== "granted") continue;
				const completed = entry.phase.owner.waitForSettlement(deadlineMs);
				if (completed.committed) advanceCommittedLineage(entry, completed.committed.facts);
			}
		});
	} catch (error) {
		release();
		throw error;
	}
	return {
		release,
		consume() {
			for (const entry of claimed) {
				try {
					assertCurrent(entry);
				} catch (error) {
					entry.phase = { kind: "consumed" };
					removePendingTaskBatch(entry);
					entry.native.reject(error);
					continue;
				}
				const current = tasks.get(entry.input.taskId);
				const receipt = current && hasAuthoritativeTaskBacking(current) ? prepareTaskAgentEventUpdate(current, entry.input) : null;
				const publication = receipt ? updateTaskWithPublication(receipt.task.taskId, receipt.patch) : null;
				if (receipt && !publication) throw new Error("Failed to persist accepted task event before synchronous mutation");
				if (receipt) advanceCommittedLineage(entry, captureTaskAgentEventLineage(receipt));
				entry.phase = { kind: "consumed" };
				removePendingTaskBatch(entry);
				settleNativeEvent(entry, receipt);
				if (receipt && publication) {
					const publish = () => {
						try {
							assertCurrent(entry, {
								...entry.input,
								expectedTask: captureTaskPersistenceReceipt(receipt.task)
							});
						} catch {
							return;
						}
						const latest = tasks.get(entry.input.taskId);
						if (latest && publication.isCurrent() && isEquivalentTaskRecord(latest, receipt.task)) entry.delivery = {
							receipt,
							isCurrent: publication.isCurrent
						};
					};
					const database = openClawStateDatabaseCache.getOpenClawStateDatabaseIfOpenAtPath(entry.context.admission.databasePath);
					if (!database || !deferSqlitePostCommitPublication(database.db, publish)) publish();
				}
			}
		}
	};
}
const taskAgentEventMutations = {
	prepare: prepareNativeEventConsumption,
	pendingTaskIds() {
		const taskIds = [];
		for (const [taskId, entries] of pendingByTask) for (const entry of entries) if (entry.phase.kind !== "consumed") {
			taskIds.push(taskId);
			break;
		}
		return taskIds;
	},
	pending(taskId) {
		const entries = taskId === void 0 ? pendingEvents : pendingByTask.get(taskId);
		for (const entry of entries ?? []) if (entry.phase.kind !== "consumed") return true;
		return false;
	},
	async captureReadFence(admission) {
		const store = getTaskRegistryStore();
		const accepted = [...pendingEvents].filter((entry) => entry.store === store && entry.context.admission.identity.key === admission.identity.key);
		const errors = (await Promise.allSettled(accepted.map((entry) => entry.completion.promise))).flatMap((result) => result.status === "rejected" ? [result.reason] : []);
		if (errors.length === 1) throw errors[0];
		if (errors.length > 1) throw createSqliteLifecycleAggregateError(errors, "Accepted task events failed to settle", errors[0]);
	}
};
async function persist(pending) {
	const { input, context, store, flowStore } = pending;
	const taskId = input.taskId;
	const scope = {
		taskId,
		runId: input.expectedTask.runId,
		childSessionKey: input.expectedTask.childSessionKey
	};
	let flowEffectsSettled = false;
	let publicationFailure;
	try {
		try {
			await runTaskRegistryWorkerMutation({
				scope,
				admission: context.admission,
				readIdentity: "preserved",
				prepare: async () => {
					const owner = taskFlowSyncOwner(taskId);
					while (pending.phase.kind !== "consumed") if (await owner.prepare(context, store, 1)) return;
				},
				onPublicationError: (error) => {
					publicationFailure = { error };
				},
				publicationRecords: () => new Map(pending.publication && pending.phase.kind !== "consumed" ? [[taskId, pending.publication.task]] : []),
				recoverPublication: (snapshot) => {
					if (pending.commitFacts === void 0 || pending.receipt || pending.phase.kind === "consumed") return;
					pending.publication = recoverTaskAgentEventPublication(pending.commitFacts, input, snapshot.tasks.get(taskId));
					return pending.publication?.task;
				},
				beforeObservers: async (assertCurrentPublication) => {
					if (pending.publication && pending.phase.kind !== "consumed") {
						const assertCurrentOwners = () => {
							assertCurrentPublication();
							if (getTaskRegistryStore() !== store || getTaskFlowRegistryStore() !== flowStore) throw new Error("Task event publication owners changed");
						};
						assertCurrentOwners();
						const current = tasks.get(taskId);
						if (pending.publication.becomesTerminal && current && isEquivalentTaskRecord(current, pending.publication.task)) clearTaskActivity(taskId);
						await finishTaskMutation(context, store, flowStore, taskId, {
							operation: "update",
							assertCurrent: assertCurrentOwners
						});
						assertCurrentOwners();
						flowEffectsSettled = true;
					}
				},
				forcePublish: () => pending.publication?.task,
				onPublished: (task) => {
					if (pending.publication && pending.phase.kind !== "consumed" && isEquivalentTaskRecord(task, pending.publication.task)) pending.delivery = {
						receipt: pending.publication,
						isCurrent: () => tasks.get(taskId) === task
					};
				}
			}, async (beginRecovery) => {
				if (pending.phase.kind === "consumed" || pending.phase.kind === "native") return await pending.native.promise;
				assertCurrent(pending);
				const current = tasks.get(taskId);
				if (!current || !matchesTaskAgentEventTarget(current, input)) return null;
				if (input.change.kind === "terminal") flushTaskActivity(taskId);
				pending.phase = { kind: "worker" };
				while (true) try {
					pending.receipt = await store.runAgentEventMutationAsync(context, input, () => {
						if (pending.phase.kind === "native" || pending.phase.kind === "consumed") throw pending.claimed;
						assertCurrent(pending);
					}, (owner) => {
						beginRecovery();
						pending.lineageResident = tasks.get(taskId);
						pending.phase = {
							kind: "granted",
							owner
						};
					});
					pending.publication = pending.receipt ?? void 0;
					if (pending.receipt) advanceCommittedLineage(pending, captureTaskAgentEventLineage(pending.receipt));
					if (pending.receipt?.cleanupError) throw restoreAgentSchemaInspectionError(pending.receipt.cleanupError);
					return pending.receipt;
				} catch (error) {
					if (error !== pending.claimed) {
						retainCommittedEventAfterResultFailure(pending);
						throw error;
					}
					if (pending.phase.kind !== "worker") return await pending.native.promise;
				}
			}, () => store.loadMutationSnapshotAsync(context, scope));
		} catch (error) {
			if (publicationFailure) throw createSqliteLifecycleAggregateError([error, publicationFailure.error], "Task event mutation and publication failed", error);
			throw error;
		}
		if (publicationFailure) throw publicationFailure.error;
	} finally {
		if (!flowEffectsSettled && pending.committedTarget && pending.phase.kind !== "consumed") {
			const current = tasks.get(taskId);
			if (current && matchesTaskAgentEventTarget(current, {
				...input,
				expectedTask: pending.committedTarget
			})) retainTaskMutationFlowEffects(context, store, flowStore, current, "update");
		}
	}
}
function startDrain() {
	if (draining) return;
	draining = true;
	const operation = runWithGatewayDetachedWorkContinuation(async () => {
		try {
			while (active = pendingEvents.values().next().value) {
				const entry = active;
				try {
					await Promise.resolve();
					if (entry.phase.kind === "consumed") await entry.native.promise;
					else await persist(entry);
					entry.completion.resolve();
				} catch (error) {
					entry.completion.reject(error);
					reportFailure(entry, error);
				} finally {
					forget(entry);
					active = void 0;
					const delivery = entry.delivery;
					if (delivery) publishTaskAgentEventDelivery(delivery, () => assertCurrent(entry, {
						...entry.input,
						expectedTask: captureTaskPersistenceReceipt(delivery.receipt.task)
					}));
				}
			}
		} finally {
			draining = false;
		}
	}, "tasks:agent-events").catch((error) => {
		draining = false;
		for (const entry of pendingEvents) {
			entry.completion.reject(error);
			reportFailure(entry, error);
			forget(entry);
		}
	});
	drains.add(operation);
	operation.finally(() => drains.delete(operation));
}
function sameSource(left, right) {
	return left.runId === right.runId && left.lifecycleGeneration === right.lifecycleGeneration && left.runContext === right.runContext && left.subagent === right.subagent && left.subagentGeneration === right.subagentGeneration;
}
/** At most one active batch and four ordered pending batches per live task identity. */
function enqueueTaskAgentEvent(initialTask, event) {
	let task = initialTask;
	const runId = event.runId;
	const subagent = subagentRuns.get(runId);
	const source = {
		runId,
		lifecycleGeneration: event.lifecycleGeneration ?? getAgentRunLifecycleGeneration(),
		runContext: getAgentRunContext(runId),
		subagent,
		subagentGeneration: subagent?.generation
	};
	const entries = pendingByTask.get(task.taskId);
	const store = getTaskRegistryStore();
	const flowStore = getTaskFlowRegistryStore();
	const resident = tasks.get(task.taskId);
	const owned = [...entries ?? []].filter((entry) => entry.store === store && entry.flowStore === flowStore && sameSource(source, entry.source));
	for (const entry of owned) if (entry.phase.kind === "granted" && !entry.committedTarget) {
		const facts = entry.phase.owner.settlement?.committed?.facts;
		if (facts !== void 0) advanceCommittedLineage(entry, facts);
	}
	const committed = owned.find((entry) => entry.phase.kind === "granted" && resident !== void 0 && entry.lineageResident === resident && entry.committedTarget && entry.committedTarget.createdAt !== entry.input.expectedTask.createdAt && matchesTaskPersistenceReceipt(task, entry.input.expectedTask) && isDeepStrictEqual(task.backing, entry.input.backing));
	if (committed?.committedTarget) task = {
		...task,
		createdAt: committed.committedTarget.createdAt
	};
	const matches = (entry) => sameSource(source, entry.source) && matchesTaskPersistenceReceipt(task, entry.committedTarget ?? entry.input.expectedTask) && isDeepStrictEqual(task.backing, entry.input.backing);
	for (const entry of entries ?? []) if (entry !== active && entry.phase.kind === "waiting" && !matches(entry)) {
		const error = /* @__PURE__ */ new Error("Queued task event identity was replaced before admission");
		entry.completion.reject(error);
		entry.native.reject(error);
		reportFailure(entry, error);
		forget(entry);
	}
	const matching = [...pendingByTask.get(task.taskId) ?? []].filter(matches);
	if (matching.some((entry) => entry.input.change.kind === "terminal")) return false;
	const lastAcceptedAt = matching.reduce((at, entry) => Math.max(at, entry.input.change.at), task.lastEventAt ?? task.startedAt ?? task.createdAt);
	if (!(event.stream === "lifecycle" || event.stream === "error" || event.stream === "tool" && event.data.phase === "start" || event.ts - lastAcceptedAt >= 6e4)) return true;
	const backing = task.backing;
	const change = captureTaskAgentEventChange(task, event, !getTaskRunOwner(task) && !(task.runtime === "subagent" && backing?.runtime === "subagent"));
	if (!change) return true;
	if (change.kind === "start" && (task.status !== "queued" || matching.some((entry) => entry.input.change.kind === "start"))) change.kind = "progress";
	const previous = matching.at(-1);
	if (change.kind === "progress" && previous?.phase.kind === "waiting" && previous !== active && previous.input.change.kind === "progress") {
		previous.input.change = {
			...change,
			toolStarts: previous.input.change.toolStarts + change.toolStarts,
			refreshError: previous.input.change.refreshError || change.refreshError,
			patch: {
				...previous.input.change.patch,
				...change.patch
			}
		};
		return true;
	}
	const context = captureOpenClawStateWorkerContext();
	const entry = {
		input: {
			taskId: task.taskId,
			expectedTask: captureTaskPersistenceReceipt(task),
			backing,
			change
		},
		source,
		context,
		store,
		flowStore,
		phase: { kind: "waiting" },
		native: createDeferredCore(),
		completion: createDeferredCore(),
		claimed: /* @__PURE__ */ new Error("Task event was claimed by synchronous registry mutation")
	};
	entry.native.promise.catch(() => void 0);
	entry.completion.promise.catch(() => void 0);
	pendingEvents.add(entry);
	const taskEvents = pendingByTask.get(task.taskId) ?? /* @__PURE__ */ new Set();
	taskEvents.add(entry);
	pendingByTask.set(task.taskId, taskEvents);
	startDrain();
	return true;
}
//#endregion
//#region src/tasks/task-registry-lifecycle.ts
function selectEventTargets(evt) {
	const candidates = getTasksByRunScope({
		runId: evt.runId,
		sessionKey: evt.sessionKey
	});
	const canonicalRunId = subagentRuns.get(evt.runId)?.taskRunId;
	if (canonicalRunId && canonicalRunId !== evt.runId) candidates.push(...getTasksByRunScope({
		runId: canonicalRunId,
		runtime: "subagent",
		sessionKey: evt.sessionKey
	}).filter((task) => readTaskBackingInstance(task.detail)?.runtime === "subagent"));
	const selected = new Map(candidates.map((record) => [record.taskId, {
		...captureTaskAgentEventTarget(record),
		record
	}]));
	for (const pending of getTaskRegistryProcessState().projection.pending) {
		const physicalRun = pending.scope.runId === evt.runId;
		if (!physicalRun && (!canonicalRunId || pending.scope.runId !== canonicalRunId)) continue;
		if (pending.readEventTarget) {
			const committed = pending.readEventTarget();
			if (!committed || !physicalRun && (committed.runtime !== "subagent" || committed.backing?.runtime !== "subagent") || !filterTasksByRunScope([committed], { sessionKey: evt.sessionKey }).length) continue;
			const record = tasks.get(committed.taskId);
			selected.set(committed.taskId, {
				...committed,
				...record && matchesTaskPersistenceReceipt(record, committed) && isDeepStrictEqual(readTaskBackingInstance(record.detail), committed.backing) ? { record } : {}
			});
			continue;
		}
		if (!physicalRun) continue;
		const current = tasks.get(pending.scope.taskId);
		if (current && !selected.has(current.taskId)) {
			const rebound = {
				...current,
				runId: pending.scope.runId,
				childSessionKey: pending.scope.childSessionKey ?? current.childSessionKey
			};
			if (filterTasksByRunScope([rebound], { sessionKey: evt.sessionKey }).length) selected.set(current.taskId, {
				...captureTaskAgentEventTarget(rebound),
				record: rebound
			});
		}
	}
	return [...selected.values()];
}
function ensureListener() {
	if (!claimTaskRegistryListenerStart(taskAgentEventMutations)) return;
	const stop = onAgentEvent((event) => {
		if (event.stream === "lifecycle" && event.data.phase === "start") reconcileTaskProgressBatches();
		for (const task of selectEventTargets(event)) {
			const backing = task.backing;
			const subagent = subagentRuns.get(event.runId);
			if (isTerminalTaskStatus(task.status) || task.record && !hasResidentTaskBacking(task.record) || task.runtime === "subagent" && backing?.runtime === "subagent" && (subagent?.generation !== backing.generation || subagent?.childSessionKey !== task.childSessionKey)) continue;
			if (enqueueTaskAgentEvent(task, event) && task.record) {
				const prepared = recordTaskActivityEvent(task.record, event);
				scheduleYieldedSubagentTaskProgress(task.record, event, prepared);
			}
		}
	});
	const stopTasks = onTaskRegistryChange(reconcileTaskProgressBatches);
	const stopRuns = onSubagentRegistryPersisted(() => reconcileTaskProgressBatches());
	const stopIdentity = onSessionIdentityMutation(retireTaskProgressForSession);
	setTaskRegistryListenerStop(() => {
		stop();
		stopTasks();
		stopRuns();
		stopIdentity();
	});
	reconcileTaskProgressBatches({ kind: "restored" });
}
setTaskRegistryListenerStarter(ensureListener);
registerAgentEventLifecycleRotationHandler("tasks:progress", clearTaskProgressBatches);
//#endregion
//#region src/tasks/cron-task-contract.ts
/** Durable task kind stamped by the current cron task-ledger owner. */
const CRON_TASK_KIND = "automation_run";
//#endregion
//#region src/tasks/task-cancellation-context.ts
function captureTaskSelection(task) {
	return {
		taskId: task.taskId,
		scopeKind: task.scopeKind,
		ownerKey: task.ownerKey,
		requesterAgentId: task.requesterAgentId,
		runtime: task.runtime,
		runId: task.runId,
		childSessionKey: task.childSessionKey,
		sourceId: task.sourceId,
		createdAt: task.createdAt
	};
}
const contexts = resolveGlobalSingleton(Symbol.for("openclaw.taskCancellationContext"), () => ({
	caller: new AsyncLocalStorage(),
	prepared: new AsyncLocalStorage()
}));
/** Carry caller authority through runtime handoffs without extending the public cancel request. */
async function withTaskCancellationContext(assertCurrent, operation, options = {}) {
	const parent = contexts.caller.getStore();
	const inherited = parent?.isActive() ? parent : void 0;
	const inheritedControl = inherited ? contexts.prepared.getStore() : void 0;
	const selected = options.selectedTask && captureTaskSelection(options.selectedTask);
	const selectedBacking = options.selectedTask && readTaskBackingInstance(options.selectedTask.detail);
	let active = true;
	const context = {
		isActive: () => active,
		prepareRead: () => {
			if (!active) throw new Error("Cancellation is no longer authorized.");
			return inheritedControl?.prepareRead?.() ?? inherited?.prepareRead() ?? options.prepareRead?.();
		},
		assertSelected: (task) => {
			inherited?.assertSelected(task);
			if (!selected) return;
			const backing = task && readTaskBackingInstance(task.detail);
			if (!task || task.taskId !== selected.taskId || task.scopeKind !== selected.scopeKind || task.ownerKey !== selected.ownerKey || task.requesterAgentId !== selected.requesterAgentId || task.runtime !== selected.runtime || task.runId !== selected.runId || task.childSessionKey !== selected.childSessionKey || task.sourceId !== selected.sourceId || task.createdAt !== selected.createdAt || (selectedBacking ? !backing || !sameTaskBackingInstance(selectedBacking, backing) : backing !== void 0)) throw new Error("Task changed while cancellation was in progress.");
		},
		assertCurrent: (task) => {
			if (!active) throw new Error("Cancellation is no longer authorized.");
			inheritedControl?.assertCurrent();
			inherited?.assertCurrent(task);
			assertCurrent(task);
		}
	};
	try {
		return await contexts.prepared.exit(() => contexts.caller.run(context, operation));
	} finally {
		active = false;
	}
}
/** Undefined keeps ready callers in the current frame; consumers recheck after a pending read. */
function prepareTaskCancellationRead() {
	const prepared = contexts.prepared.getStore();
	return prepared ? prepared.prepareRead?.() : contexts.caller.getStore()?.prepareRead();
}
/** Bind the assertion to the cancellation owner's task snapshot before it yields. */
function prepareTaskCancellationControl(task) {
	const context = contexts.caller.getStore();
	if (!context) return;
	context.assertSelected(task);
	const target = task && {
		taskId: task.taskId,
		scopeKind: task.scopeKind,
		ownerKey: task.ownerKey,
		requesterAgentId: task.requesterAgentId
	};
	return {
		prepareRead: context.prepareRead,
		assertCurrent: () => {
			if (!target) throw new Error("Task is no longer available for cancellation.");
			context.assertCurrent(target);
		}
	};
}
function withTaskCancellationControl(control, operation) {
	return control ? contexts.prepared.run(control, operation) : operation();
}
function captureTaskCancellationControl() {
	return contexts.prepared.getStore();
}
//#endregion
//#region src/tasks/task-registry-transition.native.ts
/** Legacy adapters retain insertion-order selection and per-row commit/publication. */
function transitionTaskRecordsByRunNative(transition) {
	return withTaskRegistryMutation(() => {
		ensureTaskRegistryReady();
		const matches = getTasksByRunScope(transition.params);
		const taskId = transition.kind === "state" ? transition.params.taskId : void 0;
		const selectedTask = taskId !== void 0 ? matches.find((task) => task.taskId === taskId.trim()) : void 0;
		if (taskId !== void 0 && !selectedTask) return [];
		const selectedBacking = selectedTask ? readTaskBackingInstance(selectedTask.detail) : void 0;
		const selections = matches.map(captureTaskPersistenceReceipt);
		const updated = [];
		for (const selected of selections) {
			const result = runTaskRecordTransitionOperation({
				...transition,
				taskId: selected.taskId,
				now: Date.now(),
				selection: selected
			}, {
				readCurrent: () => {
					const beforeRestore = tasks.get(selected.taskId);
					if (beforeRestore) ensureLinkedTaskFlowRegistryReady(beforeRestore);
					const current = tasks.get(selected.taskId);
					if (current && selectedTask && current.taskId !== selectedTask.taskId) {
						const managedBacking = getManagedTaskBackingInstance(current);
						if (!selectedBacking || !managedBacking || readManagedTaskBacking(current.detail)?.taskId !== selectedTask.taskId || !sameTaskBackingInstance(managedBacking, selectedBacking)) return;
					}
					return current;
				},
				hasAuthoritativeBacking: hasAuthoritativeTaskBacking,
				write: (operation) => operation(),
				beforePersist(receipt) {
					if (receipt.persisted && receipt.becomesTerminal) flushTaskActivity(receipt.task.taskId);
				},
				upsertTask: (task) => tryPersistTaskUpsert(task, "update"),
				deferCommit: (publish) => publish(),
				onCommitted(receipt) {
					publishTaskRecordUpdate(receipt.previous, receipt.task, receipt.persisted);
					if (receipt.deliver) {
						maybeDeliverTaskStateChangeUpdate(receipt.task, receipt.nextEvent);
						maybeDeliverTaskTerminalUpdate(receipt.task.taskId);
					}
				}
			});
			if (result) updated.push(cloneTaskRecord(result.task));
		}
		return updated;
	}, () => []);
}
//#endregion
//#region src/tasks/task-registry-create.native.ts
var TaskCreateRejected = class extends Error {};
/** The deprecated synchronous adapter retains its process insertion-order selection. */
function createTaskRecord(params) {
	return withTaskRegistryMutation(() => {
		ensureTaskRegistryReady();
		try {
			const created = runTaskCreateOperation({
				params,
				taskId: crypto.randomUUID(),
				now: Date.now()
			}, {
				readSelection(identity) {
					assertParentFlowLinkAllowed({
						...identity,
						parentFlowId: params.parentFlowId
					});
					let mirroredFlowIds;
					const selectCurrent = () => {
						const candidates = params.runId?.trim() ? getTasksByRunId(params.runId) : [];
						return selectExistingTaskForCreate({
							...params,
							...identity,
							candidates,
							isTaskMirroredFlow: (flowId) => {
								mirroredFlowIds ??= getTaskMirroredFlowIds(candidates.flatMap((task) => task.parentFlowId ? [task.parentFlowId.trim()] : []));
								return mirroredFlowIds.has(flowId);
							}
						});
					};
					const selected = selectCurrent();
					let existing = selected;
					if (selected) {
						const receipt = captureTaskPersistenceReceipt(selected);
						ensureLinkedTaskFlowRegistryReady(selected);
						existing = selectCurrent();
						if (!existing || !matchesTaskPersistenceReceipt(existing, receipt)) throw new TaskCreateRejected();
					}
					return {
						existing,
						deliveryState: existing ? taskDeliveryStates.get(existing.taskId) : void 0
					};
				},
				write: (operation) => operation(),
				upsertDelivery(deliveryState) {
					if (!tryPersistTaskDeliveryStateUpsert(deliveryState)) throw new TaskCreateRejected();
				},
				upsertTask(task, deliveryState) {
					if (!tryPersistTaskUpsert(task, tasks.has(task.taskId) ? "update" : "create", deliveryState)) throw new TaskCreateRejected();
				},
				deferCommit: (publish) => publish(),
				onCommitted(commit) {
					if (commit.kind === "delivery") {
						taskDeliveryStates.set(commit.task.taskId, commit.deliveryState);
						recordTaskRegistryProjectionWrite("delivery", commit.task.taskId);
						bumpTaskRegistryRevision();
						return;
					}
					const { result } = commit;
					if (result.mutation === "reused") return;
					if (result.mutation === "updated") {
						publishTaskRecordUpdate(result.previous, result.task, result.persisted);
						return;
					}
					const record = result.task;
					const taskId = record.taskId;
					tasks.set(taskId, record);
					recordTaskRegistryProjectionWrite("task", taskId);
					bumpTaskRegistryRevision();
					if (result.deliveryState) taskDeliveryStates.set(taskId, result.deliveryState);
					addRunIdIndex(taskId, record.runId);
					addOwnerKeyIndex(taskId, record);
					addParentFlowIdIndex(taskId, record);
					addRelatedSessionKeyIndex(taskId, record);
					syncFlowFromTaskAfterTaskMutation(record, "create");
					emitTaskRegistryObserverEvent(() => ({
						kind: "upserted",
						task: cloneTaskRecordForObserver(record)
					}));
					if (isTerminalTaskStatus(record.status)) maybeDeliverTaskTerminalUpdate(taskId);
				}
			});
			return cloneTaskRecord(created.task);
		} catch (error) {
			if (error instanceof TaskCreateRejected) return null;
			throw error;
		}
	}, () => null);
}
//#endregion
//#region src/tasks/task-registry-record-api.ts
function setTaskCleanupAfterById(params) {
	ensureTaskRegistryReady();
	return updateTask(params.taskId, { cleanupAfter: params.cleanupAfter });
}
function markTaskTerminalById(params) {
	ensureTaskRegistryReady();
	const patch = {
		status: params.status,
		...params.childSessionKey !== void 0 ? { childSessionKey: params.childSessionKey?.trim() || void 0 } : {},
		endedAt: params.endedAt,
		lastEventAt: params.lastEventAt ?? params.endedAt,
		...params.terminalSummary !== void 0 ? { terminalSummary: params.preserveTerminalSummary ? params.terminalSummary ?? void 0 : normalizeTaskSummary(params.terminalSummary) } : {},
		...params.terminalOutcome !== void 0 ? { terminalOutcome: resolveTaskTerminalOutcome({
			status: params.status,
			terminalOutcome: params.terminalOutcome
		}) } : {},
		...params.detail !== void 0 ? { detail: structuredClone(params.detail) } : {}
	};
	if (Object.hasOwn(params, "error")) patch.error = params.error;
	return updateTask(params.taskId, patch);
}
function markTaskLostById(params) {
	ensureTaskRegistryReady();
	return updateTask(params.taskId, {
		status: "lost",
		endedAt: params.endedAt,
		lastEventAt: params.lastEventAt ?? params.endedAt,
		...params.error !== void 0 ? { error: params.error } : {},
		...params.cleanupAfter !== void 0 ? { cleanupAfter: params.cleanupAfter } : {}
	});
}
function updateTaskStateByRunId(params) {
	return transitionTaskRecordsByRunNative({
		kind: "state",
		params
	});
}
function updateTaskDeliveryByRunId(params) {
	return transitionTaskRecordsByRunNative({
		kind: "delivery",
		params
	});
}
function markTaskRunningByRunId(params) {
	return updateTaskStateByRunId({
		runId: params.runId,
		taskId: params.taskId,
		runtime: params.runtime,
		sessionKey: params.sessionKey,
		status: "running",
		startedAt: params.startedAt,
		lastEventAt: params.lastEventAt,
		progressSummary: params.progressSummary,
		eventSummary: params.eventSummary
	});
}
function recordTaskProgressByRunId(params) {
	return updateTaskStateByRunId({
		runId: params.runId,
		taskId: params.taskId,
		runtime: params.runtime,
		sessionKey: params.sessionKey,
		childSessionKey: params.childSessionKey,
		lastEventAt: params.lastEventAt,
		progressSummary: params.progressSummary,
		eventSummary: params.eventSummary
	});
}
function finalizeTaskRecordByRunId(params) {
	return updateTaskStateByRunId({
		runId: params.runId,
		taskId: params.taskId,
		runtime: params.runtime,
		sessionKey: params.sessionKey,
		childSessionKey: params.childSessionKey,
		status: params.status,
		startedAt: params.startedAt,
		endedAt: params.endedAt,
		lastEventAt: params.lastEventAt,
		error: params.error,
		clearError: params.clearError,
		progressSummary: params.progressSummary,
		terminalSummary: params.terminalSummary,
		preserveTerminalSummary: params.preserveTerminalSummary,
		terminalOutcome: params.terminalOutcome,
		detail: params.detail,
		suppressDelivery: params.suppressDelivery
	});
}
function setTaskRunDeliveryStatusByRunId(params) {
	return updateTaskDeliveryByRunId(params);
}
function updateTaskNotifyPolicyById(params) {
	const notifyPolicy = parseTaskNotifyPolicy(params.notifyPolicy);
	ensureTaskRegistryReady();
	return updateTask(params.taskId, {
		notifyPolicy,
		lastEventAt: Date.now()
	});
}
function linkTaskToFlowById(params) {
	return withTaskRegistryMutation(() => {
		ensureTaskRegistryReady();
		const flowId = params.flowId.trim();
		if (!flowId) return null;
		const current = tasks.get(params.taskId);
		if (!current) return null;
		if (current.parentFlowId?.trim()) return cloneTaskRecord(current);
		assertParentFlowLinkAllowed({
			ownerKey: current.ownerKey,
			scopeKind: current.scopeKind,
			parentFlowId: flowId
		});
		return updateTask(params.taskId, { parentFlowId: flowId });
	}, () => null);
}
//#endregion
//#region src/tasks/task-registry-cancel.ts
function ensureTaskCancellationReady(task) {
	const runId = task.runId?.trim();
	const linkedTasks = runId && (task.runtime === "acp" || task.runtime === "subagent") ? getTasksByRunScope({
		runId,
		runtime: task.runtime,
		sessionKey: task.childSessionKey
	}) : [task];
	for (const linkedTask of linkedTasks.length > 0 ? linkedTasks : [task]) ensureLinkedTaskFlowRegistryReady(linkedTask);
}
async function cancelTaskById(params) {
	for (let pending = prepareTaskCancellationRead(); pending; pending = prepareTaskCancellationRead()) await pending;
	const notCancelledFromCache = (reason) => {
		const current = tasks.get(params.taskId.trim());
		return {
			found: true,
			cancelled: false,
			reason,
			...current ? { task: cloneTaskRecord(current) } : {}
		};
	};
	const prepared = withTaskRegistryMutation(() => {
		ensureTaskRegistryReady();
		const task = tasks.get(params.taskId.trim());
		if (!task) return { result: {
			found: false,
			cancelled: false,
			reason: "Task not found."
		} };
		const isProvisionalSubagentKill = task.runtime === "subagent" && task.status === "cancelled" && task.error === "Subagent run killed.";
		if (!isProvisionalSubagentKill && isTerminalTaskStatus(task.status)) return { result: {
			found: true,
			cancelled: false,
			reason: "Task is already terminal.",
			task: cloneTaskRecord(task)
		} };
		try {
			const control = prepareTaskCancellationControl(task);
			control?.assertCurrent();
			if (!hasAuthoritativeTaskBacking(task)) return { result: {
				found: true,
				cancelled: false,
				reason: "Task backing ownership could not be verified.",
				task: cloneTaskRecord(task)
			} };
			const managedBacking = getManagedTaskBackingInstance(task);
			const subagentBacking = managedBacking ?? readTaskBackingInstance(task.detail);
			ensureTaskCancellationReady(task);
			return {
				task,
				managedBacking,
				subagentBacking,
				isProvisionalSubagentKill,
				control
			};
		} catch (error) {
			return { result: {
				found: true,
				cancelled: false,
				reason: formatErrorMessage(error),
				task: cloneTaskRecord(task)
			} };
		}
	}, () => {
		return { result: tasks.get(params.taskId.trim()) ? notCancelledFromCache("Task persistence failed.") : {
			found: false,
			cancelled: false,
			reason: "Task not found."
		} };
	});
	if ("result" in prepared) return prepared.result;
	const { task, managedBacking, subagentBacking, control } = prepared;
	const assertCurrentControl = () => (prepareTaskCancellationControl(tasks.get(task.taskId)) ?? control)?.assertCurrent();
	let isProvisionalSubagentKill = prepared.isProvisionalSubagentKill;
	const notCancelled = (reason) => withTaskRegistryMutation(() => notCancelledFromCache(reason), () => notCancelledFromCache(reason));
	const requestedReason = params.reason?.trim();
	const cancellationError = requestedReason && requestedReason !== "Subagent run killed." ? requestedReason : "Cancelled by operator.";
	const childSessionKey = task.childSessionKey?.trim();
	const promoteCancellation = () => withTaskRegistryMutation(() => {
		const eventAt = Date.now();
		const current = tasks.get(task.taskId) ?? task;
		if (task.runtime === "acp") {
			const currentBacking = getManagedTaskBackingInstance(current) ?? readTaskBackingInstance(current.detail);
			if (!hasAuthoritativeTaskBacking(current) || subagentBacking && (!currentBacking || !sameTaskBackingInstance(subagentBacking, currentBacking))) return notCancelled("Task backing changed while cancellation was in progress.");
		}
		const endedAt = isProvisionalSubagentKill ? current.endedAt ?? eventAt : eventAt;
		const updated = (task.runtime === "acp" || task.runtime === "subagent") && task.runId?.trim() ? updateTaskStateByRunId({
			runId: task.runId,
			...task.runtime === "acp" ? { taskId: task.taskId } : {},
			runtime: task.runtime,
			sessionKey: childSessionKey,
			status: "cancelled",
			endedAt,
			lastEventAt: eventAt,
			error: cancellationError
		}).find((record) => record.taskId === task.taskId) ?? null : updateTask(task.taskId, {
			status: "cancelled",
			endedAt,
			lastEventAt: eventAt,
			error: cancellationError
		});
		if (!updated) return notCancelled("Task persistence failed.");
		maybeDeliverTaskTerminalUpdate(updated.taskId);
		return {
			found: true,
			cancelled: true,
			task: updated
		};
	}, () => notCancelledFromCache("Task persistence failed."));
	try {
		if (isBackgroundExecTask(task)) {
			const processSessionId = task.sourceId?.trim();
			const { cancelBackgroundExecSession } = await loadTaskRegistryControlRuntime();
			for (let pending = control?.prepareRead?.(); pending; pending = control?.prepareRead?.()) await pending;
			assertCurrentControl();
			if (!processSessionId || !cancelBackgroundExecSession(processSessionId)) return notCancelled("Background command has no active cancellation handle.");
		} else if (task.runtime === "cli") {
			const owner = getTaskRunOwner(task);
			if (!owner) return notCancelled("Task has no live run owner. Use openclaw tasks audit to inspect its state.");
			const result = await withTaskCancellationControl(control, () => owner.cancel(cancellationError));
			return result.ok ? {
				found: true,
				cancelled: true,
				task: result.value
			} : notCancelled(result.error);
		} else {
			if (task.runtime === "cron") {
				const { cancelActiveCronTaskRun } = await loadTaskRegistryControlRuntime();
				for (let pending = control?.prepareRead?.(); pending; pending = control?.prepareRead?.()) await pending;
				assertCurrentControl();
				if (!cancelActiveCronTaskRun({
					runId: task.runId,
					reason: params.reason?.trim() || "Cancelled by operator."
				})) {
					if (task.taskKind === "automation_run" || childSessionKey) return notCancelled("Cron task has no active cancellation handle.");
				}
			}
			if (task.runtime === "cron") {} else if (!childSessionKey) return notCancelled(isHarnessOwnedSubagentTask(task) ? "This subagent is controlled by its native harness. Use the parent session's native collaboration tools to stop it." : "Task has no cancellable child session.");
			else if (task.runtime === "acp") {
				const { getAcpSessionManager } = await loadTaskRegistryControlRuntime();
				for (let pending = control?.prepareRead?.(); pending; pending = control?.prepareRead?.()) await pending;
				assertCurrentControl();
				if (subagentBacking?.runtime !== "acp") return notCancelled("ACP task execution cannot be verified. Select its current task or use ACP session controls.");
				await withTaskCancellationControl(control, () => getAcpSessionManager().cancelSession({
					cfg: params.cfg,
					sessionKey: childSessionKey,
					agentId: task.agentId,
					reason: params.reason?.trim() || "task-cancel",
					expectedRunId: task.runId,
					expectedInstanceId: subagentBacking.instanceId,
					...managedBacking?.runtime === "acp" ? { expectedOwnerKey: task.ownerKey } : {}
				}));
				const settled = withTaskRegistryMutation(() => {
					const current = tasks.get(task.taskId);
					if (current && isTerminalTaskStatus(current.status)) return current.status === "cancelled" ? {
						found: true,
						cancelled: true,
						task: cloneTaskRecord(current)
					} : notCancelled(`Task became ${current.status} while cancellation was in progress.`);
				}, () => notCancelledFromCache("Task persistence failed."));
				if (settled) return settled;
			} else if (task.runtime === "subagent") {
				const { killSubagentRunAdmin } = await loadTaskRegistryControlRuntime();
				for (let pending = control?.prepareRead?.(); pending; pending = control?.prepareRead?.()) await pending;
				assertCurrentControl();
				const reconcile = (result) => withTaskRegistryMutation(() => {
					const current = tasks.get(task.taskId);
					if (current?.status === "cancelled" && current.error === "Subagent run killed.") isProvisionalSubagentKill = true;
					let reason;
					if (current?.status === "succeeded") reason = "Subagent completed while cancellation was in progress.";
					else if (current && isTerminalTaskStatus(current.status) && current.status !== "cancelled") reason = `Subagent became ${current.status} while cancellation was in progress.`;
					else if (current?.status === "cancelled" && !isProvisionalSubagentKill) reason = "Subagent was cancelled while cancellation was in progress.";
					else if (result.found && result.targetState?.state === "terminal") {
						if (!finalizeTaskRecordByRunId({
							runId: task.runId?.trim() || result.runId,
							runtime: "subagent",
							sessionKey: childSessionKey,
							...result.targetState.task
						}).find((candidate) => candidate.taskId === task.taskId)) reason = "Subagent became terminal, but task state reconciliation failed to persist.";
						else if (result.targetState.task.status === "cancelled" && result.targetState.task.error === "Subagent run killed.") isProvisionalSubagentKill = true;
						else reason = result.targetState.task.status === "succeeded" ? "Subagent completed while cancellation was in progress." : `Subagent became ${result.targetState.task.status} while cancellation was in progress.`;
					}
					if (result.found && result.error) reason = `${reason ? `${reason} ` : ""}Subagent cancellation incomplete: ${result.error}`;
					if (reason) return notCancelled(reason);
					if (result.found && result.targetState?.state === "finalizing") return notCancelled("Subagent completion is still being finalized.");
					if (!result.found || !result.killed && !isProvisionalSubagentKill) return notCancelled(result.found ? "Subagent was not running." : "Subagent task not found.");
					return promoteCancellation();
				}, () => {
					let reason = result.found && result.targetState?.state === "terminal" ? "Subagent became terminal, but task state reconciliation failed to persist." : "Task persistence failed.";
					if (result.found && result.error) reason += ` Subagent cancellation incomplete: ${result.error}`;
					return notCancelledFromCache(reason);
				});
				let cancellation = notCancelled("Subagent cancellation result was not published.");
				await withTaskCancellationControl(control, () => killSubagentRunAdmin({
					cfg: params.cfg,
					sessionKey: childSessionKey,
					expectedTaskRunId: task.runId,
					expectedOwnerKey: task.ownerKey,
					...subagentBacking?.runtime === "subagent" ? { expectedGeneration: subagentBacking.generation } : {},
					onResult: (result) => {
						cancellation = reconcile(result);
					}
				}));
				return cancellation;
			} else return notCancelled("Task runtime does not support cancellation yet.");
		}
		return promoteCancellation();
	} catch (error) {
		return notCancelled(formatErrorMessage(error));
	}
}
function assertTaskCancellationReadyById(taskId) {
	return withTaskRegistryMutation(() => {
		ensureTaskRegistryReady();
		const task = tasks.get(taskId.trim());
		if (!task) return null;
		if (!isTerminalTaskStatus(task.status) || isProvisionalSubagentKillTask(task)) ensureTaskCancellationReady(task);
		return cloneTaskRecord(task);
	}, () => null);
}
//#endregion
//#region src/tasks/task-registry-publication.ts
/** Publishes a record already committed by a cross-owner shared-state transaction. */
function publishTaskRecordAfterAtomicStore(record, options) {
	const next = normalizeTaskTimestamps(cloneTaskRecord(record));
	const current = tasks.get(next.taskId);
	const becomesTerminal = current !== void 0 && !isTerminalTaskStatus(current.status) && isTerminalTaskStatus(next.status);
	if (becomesTerminal) flushTaskActivity(next.taskId);
	if (current) {
		deleteOwnerKeyIndex(next.taskId, current);
		deleteParentFlowIdIndex(next.taskId, current);
		deleteRelatedSessionKeyIndex(next.taskId, current);
	}
	const indexedCurrent = tasks.get(next.taskId);
	tasks.set(next.taskId, next);
	recordTaskRegistryProjectionWrite("task", next.taskId);
	bumpTaskRegistryRevision();
	if (becomesTerminal) clearTaskActivity(next.taskId);
	addOwnerKeyIndex(next.taskId, next);
	addParentFlowIdIndex(next.taskId, next);
	addRelatedSessionKeyIndex(next.taskId, next);
	updateRunIdIndex(indexedCurrent, next);
	const emit = () => emitTaskRegistryObserverEvent(() => ({
		kind: "upserted",
		task: cloneTaskRecordForObserver(next),
		...current ? { previous: cloneTaskRecordForObserver(current) } : {}
	}));
	if (options?.deferredObserverEvents) options.deferredObserverEvents.push(emit);
	else emit();
	return cloneTaskRecord(next);
}
//#endregion
//#region src/tasks/task-registry.ts
if (process.env.VITEST || false) globalThis[Symbol.for("openclaw.taskRegistryTestApi")] = {
	maybeDeliverTaskStateChangeUpdate,
	resetTaskRegistryForTests
};
//#endregion
export { withTaskCancellationContext as _, linkTaskToFlowById as a, getTaskRunOwner as b, markTaskTerminalById as c, setTaskRunDeliveryStatusByRunId as d, updateTaskNotifyPolicyById as f, prepareTaskCancellationRead as g, prepareTaskCancellationControl as h, finalizeTaskRecordByRunId as i, recordTaskProgressByRunId as l, captureTaskCancellationControl as m, assertTaskCancellationReadyById as n, markTaskLostById as o, createTaskRecord as p, cancelTaskById as r, markTaskRunningByRunId as s, publishTaskRecordAfterAtomicStore as t, setTaskCleanupAfterById as u, CRON_TASK_KIND as v, bindTaskRunOwner as y };
