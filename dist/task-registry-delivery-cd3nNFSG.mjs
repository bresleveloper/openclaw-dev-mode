import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { A as parseAgentSessionKey } from "./session-key-CBvmC8zz.mjs";
import { t as createSubsystemLogger } from "./subsystem-DleLyu58.mjs";
import { t as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-Dn3_Z_Oi.mjs";
import { a as isSqliteWorkerError } from "./sqlite-worker-contract-DgNznZvn.mjs";
import { s as getGatewayRestartDrainSignal, u as isGatewayRestartDraining, x as runWithGatewayDetachedWorkContinuation } from "./gateway-work-admission-CHv_0noy.mjs";
import { E as readTaskBackingInstance, M as cloneTaskDeliveryState, N as cloneTaskRecord, P as cloneTaskRecordForObserver, W as pickPreferredRunIdTask } from "./task-registry.store.kernel-BuNI8UuR.mjs";
import { r as isTerminalTaskStatus } from "./task-registry.types-CkM1jc3D.mjs";
import { A as getTaskFlowRegistryStore, D as updateFlowRecordByIdExpectedRevision, d as getTaskFlowById, g as prepareTaskFlowRegistryRead, o as ensureTaskFlowRegistryReadyAsync, w as runTaskFlowRegistryWorkerMutation } from "./task-flow-runtime-internal-DFSz6gyF.mjs";
import { C as updateRunIdIndex, _ as recordTaskRegistryProjectionWrite, d as deleteRelatedSessionKeyIndex, l as deleteOwnerKeyIndex, n as addParentFlowIdIndex, r as addRelatedSessionKeyIndex, t as addOwnerKeyIndex, u as deleteParentFlowIdIndex } from "./task-registry.process-state-Cb_kvrmQ.mjs";
import { i as getTaskRegistryStore, l as tryPersistTaskUpsert } from "./task-registry.store-1Swe_0g5.mjs";
import { C as taskRegistryLog, E as withTaskRegistryMutation, F as retainCommittedTaskFlowEffects, T as tasksWithPendingDelivery, _ as taskDeliveryStates, a as emitTaskRegistryObserverEvent, h as syncFlowFromTaskAfterTaskMutationAsync, m as syncFlowFromTaskAfterTaskMutation, n as assertTaskRegistryRestoreNotFailed, r as bumpTaskRegistryRevision, v as taskFlowSyncOwner, w as tasks } from "./task-registry-state-Cibd1d5c.mjs";
import { n as prepareTaskRegistryRead, r as prepareTaskRegistryReadOwner } from "./task-registry-read-BpKCOEEj.mjs";
import { n as flushTaskActivity, t as clearTaskActivity } from "./task-registry-activity-qvAA4Okp.mjs";
import { a as matchesTaskNotificationTarget, i as captureTaskNotificationTarget, s as prepareTaskRecordUpdate, t as buildManagedFlowCancellationPatch } from "./task-initial-flow.rules-DO4-fPbE.mjs";
import { a as queueBlockedTaskFollowup, c as resolveTaskStateChangeIdempotencyKey, h as shouldUseParentReviewTaskTerminalMessage, i as getPeerTasksForDelivery, l as resolveTaskTerminalIdempotencyKey, m as formatTaskTerminalMessage, n as canDeliverTaskToRequesterOrigin, o as queueTaskSystemEvent, p as formatTaskStateChangeMessage, s as resolveTaskDeliveryOwner, t as canDeliverParentReviewTaskToThreadOrigin } from "./task-notification-routing-D910r5az.mjs";
import { n as shouldAutoDeliverTaskTerminalUpdate, r as shouldSuppressDuplicateTerminalDelivery, t as shouldAutoDeliverTaskStateChange } from "./task-notification-policy-7pB-BxLh.mjs";
import { _ as ensureLinkedTaskFlowRegistryReady, d as listTasksForFlowId } from "./task-registry-query-Cb1HIUfX.mjs";
import { i as loadTaskRegistryDeliveryRuntime } from "./task-registry-runtime-loaders-DXZqiHsn.mjs";
//#region src/tasks/task-executor-mutation-effects.async.ts
const log = createSubsystemLogger("tasks/executor");
function captureTaskMutationContext() {
	const context = captureOpenClawStateWorkerContext();
	const store = getTaskRegistryStore();
	const flowStore = getTaskFlowRegistryStore();
	return {
		context,
		store,
		flowStore,
		assertStores() {
			context.admission.assertCurrent();
			if (getTaskRegistryStore() !== store || getTaskFlowRegistryStore() !== flowStore) throw new Error("Task mutation lost its selected registry owners");
		}
	};
}
/** Report unfinished effects without discarding their existing repair or failure handling. */
async function finishTaskMutation(context, store, flowStore, taskId, options) {
	const task = tasks.get(taskId);
	const flowId = task?.parentFlowId?.trim();
	if (!task || !flowId) return true;
	try {
		await ensureTaskFlowRegistryReadyAsync(context);
		options.assertCurrent();
		const flowSettled = await syncFlowFromTaskAfterTaskMutationAsync(context, store, task, options.operation, flowStore);
		if (options.operation === "update") {
			const cancellationSettled = await finishManagedTaskCancellation(context, store, flowStore, taskId, options.assertCurrent);
			return flowSettled && cancellationSettled;
		}
		return flowSettled;
	} catch (error) {
		if (!isSqliteWorkerError(error, "overloaded")) throw error;
		retainTaskMutationFlowEffects(context, store, flowStore, task, options.operation);
		return false;
	}
}
async function finishManagedTaskCancellation(context, store, flowStore, taskId, assertCurrent) {
	const flowId = tasks.get(taskId)?.parentFlowId?.trim();
	if (!flowId) return true;
	try {
		assertCurrent();
		await ensureTaskFlowRegistryReadyAsync(context);
		assertCurrent();
		let publicationSettled = true;
		await runTaskFlowRegistryWorkerMutation({
			flowId,
			admission: context.admission,
			onPublicationError: () => {
				publicationSettled = false;
			}
		}, () => store.runInitialMutationAsync(context, {
			type: "flows.finalizeTaskCancellation",
			input: {
				taskId,
				flowId,
				now: Date.now()
			}
		}, assertCurrent), async () => {
			assertCurrent();
			const flow = await flowStore.readFlowAsync(context, flowId);
			assertCurrent();
			return flow;
		});
		return publicationSettled;
	} catch (error) {
		if (isSqliteWorkerError(error, "overloaded")) throw error;
		log.warn("Failed to finalize managed flow cancellation from task update", {
			taskId,
			flowId,
			error
		});
		return false;
	}
}
function retainTaskMutationFlowEffects(context, store, flowStore, task, operation) {
	try {
		const owner = taskFlowSyncOwner(task.taskId, flowStore);
		retainCommittedTaskFlowEffects(context, store, task, operation, owner, operation === "update" ? async (retryContext) => {
			await finishManagedTaskCancellation(retryContext, store, flowStore, task.taskId, () => {
				owner.assertCurrent(retryContext, store);
			});
		} : void 0);
	} catch (error) {
		log.warn("Failed to retain committed task flow effects", {
			taskId: task.taskId,
			operation,
			error
		});
	}
}
//#endregion
//#region src/tasks/task-notification-mutation.async.ts
const pendingNotificationMutations = /* @__PURE__ */ new WeakMap();
function pendingFor(mutation) {
	return pendingNotificationMutations.get(mutation.store)?.get(mutation.context.admission.identity.key);
}
/** Retain the original notification store through transport and mutation settlement. */
function captureTaskNotificationMutationOwner(assertDeliveryCurrent) {
	const mutation = captureTaskMutationContext();
	const assertCurrent = () => {
		assertDeliveryCurrent();
		mutation.assertStores();
	};
	const startMutation = (command) => {
		assertCurrent();
		const key = mutation.context.admission.identity.key;
		let byDatabase = pendingNotificationMutations.get(mutation.store);
		if (!byDatabase) {
			byDatabase = /* @__PURE__ */ new Map();
			pendingNotificationMutations.set(mutation.store, byDatabase);
		}
		let pending = byDatabase.get(key);
		if (!pending) {
			pending = /* @__PURE__ */ new Set();
			byDatabase.set(key, pending);
		}
		const owned = pending;
		const databases = byDatabase;
		const operation = Promise.resolve().then(async () => {
			assertCurrent();
			const { settleTaskRecordTransitionAsync } = await import("./task-executor-transition.async-VxvaB2d_.mjs");
			const { receipt } = await settleTaskRecordTransitionAsync(mutation, command, assertCurrent);
			return receipt ? cloneTaskRecord(receipt.task) : null;
		});
		const settlement = operation.finally(() => {
			owned.delete(operation);
			if (owned.size === 0) databases.delete(key);
		});
		owned.add(operation);
		return settlement;
	};
	return {
		async prepare(consume, subagentChildSessionKey) {
			assertCurrent();
			for (;;) {
				const pending = pendingFor(mutation);
				if (pending?.size) {
					await Promise.allSettled(pending);
					assertCurrent();
					continue;
				}
				const owner = await prepareTaskRegistryReadOwner(mutation.context, mutation.store);
				assertCurrent();
				const read = await prepareTaskRegistryRead(owner);
				assertCurrent();
				const flows = await prepareTaskFlowRegistryRead(mutation.context);
				assertCurrent();
				if (!read || !flows) throw new Error("Task notification projections require preparation");
				const consumeCurrent = (readSubagentRun) => {
					assertCurrent();
					if (pendingFor(mutation)?.size) return;
					read.assertCurrent();
					flows.assertCurrent();
					return { value: consume(flows, readSubagentRun) };
				};
				let prepared;
				if (subagentChildSessionKey) {
					const { withPreparedLatestSubagentRunByChildSessionKey } = await import("./subagent-registry-read-Ctlzh751.mjs");
					assertCurrent();
					prepared = await withPreparedLatestSubagentRunByChildSessionKey(subagentChildSessionKey, mutation.context, consumeCurrent);
				} else prepared = consumeCurrent();
				if (prepared) return prepared.value;
			}
		},
		bindStateChange: (task, eventAt) => {
			assertCurrent();
			const input = {
				taskId: task.taskId,
				expectedTask: captureTaskNotificationTarget(task),
				eventAt
			};
			let acknowledgement;
			return () => {
				assertCurrent();
				acknowledgement ??= startMutation({
					type: "tasks.acknowledgeStateChange",
					input
				});
				return acknowledgement;
			};
		},
		updateDelivery: (task, outcome) => startMutation({
			type: "tasks.updateNotificationDelivery",
			input: {
				taskId: task.taskId,
				expectedTask: captureTaskNotificationTarget(task),
				...outcome
			}
		})
	};
}
async function settleNotificationMutationAfterPreparationFailure(pending, preparationError) {
	if (!pending) return;
	const [settlement] = await Promise.allSettled([pending]);
	if (settlement.status === "rejected") throw new AggregateError([preparationError, settlement.reason], "Task notification preparation and persistence failed", { cause: preparationError });
}
//#endregion
//#region src/tasks/task-registry-delivery-admission.ts
function runTaskDeliveryWithDetachedAdmission(taskId, deliver) {
	const pending = runAdmittedTaskDelivery(taskId, deliver);
	pending.catch((error) => {
		taskRegistryLog.warn("Background task notification failed", {
			taskId,
			error
		});
	});
	return pending;
}
async function runAdmittedTaskDelivery(taskId, deliver) {
	let admitted = false;
	try {
		return await runWithGatewayDetachedWorkContinuation(async () => {
			admitted = true;
			const restartSignal = getGatewayRestartDrainSignal();
			let active = true;
			try {
				return await deliver(() => {
					if (!active || getGatewayRestartDrainSignal() !== restartSignal) throw new Error("Task delivery no longer owns its Gateway continuation");
				});
			} finally {
				active = false;
			}
		}, "tasks:delivery");
	} catch (error) {
		if (!admitted && isGatewayRestartDraining()) {
			assertTaskRegistryRestoreNotFailed();
			const current = tasks.get(taskId);
			return current ? cloneTaskRecord(current) : null;
		}
		throw error;
	}
}
//#endregion
//#region src/tasks/task-registry-mutation.ts
function syncManagedFlowCancellationFromTask(task) {
	const flowId = task.parentFlowId?.trim();
	if (!flowId) return;
	let flow = getTaskFlowById(flowId);
	const now = Date.now();
	for (let attempt = 0; attempt < 2; attempt += 1) {
		const patch = buildManagedFlowCancellationPatch(task, flow, () => listTasksForFlowId(flowId), now);
		if (!flow || !patch) return;
		const result = updateFlowRecordByIdExpectedRevision({
			flowId,
			expectedRevision: flow.revision,
			patch
		});
		if (result.applied || result.reason === "not_found") return;
		flow = result.current;
	}
}
function updateTask(taskId, patch) {
	return updateTaskWithPublication(taskId, patch)?.task ?? null;
}
function updateTaskWithPublication(taskId, patch) {
	return withTaskRegistryMutation(() => {
		const current = tasks.get(taskId);
		if (!current) return null;
		const { task: next, becomesTerminal, persisted } = prepareTaskRecordUpdate(current, patch);
		ensureLinkedTaskFlowRegistryReady(current);
		ensureLinkedTaskFlowRegistryReady(next);
		if (persisted) {
			if (becomesTerminal) flushTaskActivity(taskId);
			if (!tryPersistTaskUpsert(next, "update")) return null;
		}
		return publishTaskRecordUpdate(current, next, persisted);
	}, () => null);
}
/** Reuse the update publication owner after a shared create/reuse kernel commits. */
function publishTaskRecordUpdate(current, next, persisted) {
	const taskId = next.taskId;
	const published = persisted ? next : current;
	const becomesTerminal = !isTerminalTaskStatus(current.status) && isTerminalTaskStatus(next.status);
	const sessionIndexChanged = normalizeOptionalString(current.requesterSessionKey) !== normalizeOptionalString(next.requesterSessionKey) || normalizeOptionalString(current.ownerKey) !== normalizeOptionalString(next.ownerKey) || normalizeOptionalString(current.childSessionKey) !== normalizeOptionalString(next.childSessionKey);
	const parentFlowIndexChanged = current.parentFlowId?.trim() !== next.parentFlowId?.trim();
	if (persisted) {
		const indexedCurrent = tasks.get(taskId);
		tasks.set(taskId, next);
		recordTaskRegistryProjectionWrite("task", taskId);
		bumpTaskRegistryRevision();
		if (becomesTerminal) clearTaskActivity(taskId);
		updateRunIdIndex(indexedCurrent, next);
		if (sessionIndexChanged) {
			deleteOwnerKeyIndex(taskId, current);
			addOwnerKeyIndex(taskId, next);
			deleteRelatedSessionKeyIndex(taskId, current);
			addRelatedSessionKeyIndex(taskId, next);
		}
		if (parentFlowIndexChanged) {
			deleteParentFlowIdIndex(taskId, current);
			addParentFlowIdIndex(taskId, next);
		}
	}
	syncFlowFromTaskAfterTaskMutation(next, "update");
	try {
		syncManagedFlowCancellationFromTask(next);
	} catch (error) {
		taskRegistryLog.warn("Failed to finalize managed flow cancellation from task update", {
			taskId,
			flowId: next.parentFlowId,
			error
		});
	}
	emitTaskRegistryObserverEvent(() => ({
		kind: "upserted",
		task: cloneTaskRecordForObserver(next),
		previous: cloneTaskRecordForObserver(current)
	}));
	return {
		task: cloneTaskRecord(next),
		isCurrent: () => tasks.get(taskId) === published
	};
}
function getTaskDeliveryState(taskId) {
	const state = taskDeliveryStates.get(taskId);
	return state ? cloneTaskDeliveryState(state) : void 0;
}
//#endregion
//#region src/tasks/task-registry-delivery.ts
function resolveMissingOwnerDeliveryStatus(task) {
	return task.scopeKind === "system" ? "not_applicable" : "parent_missing";
}
function maybeDeliverTaskTerminalUpdate(taskId) {
	return runTaskDeliveryWithDetachedAdmission(taskId, async (assertCurrent) => maybeDeliverTaskTerminalUpdateUnderAdmission(taskId, assertCurrent));
}
function isSubagentSettlementPending(task, readSubagentRun) {
	if (task.runtime !== "subagent" || !task.runId || !task.childSessionKey || !readSubagentRun) return false;
	const entry = readSubagentRun();
	const backing = readTaskBackingInstance(task.detail);
	return Boolean(entry?.requesterSettleWake && (entry.taskRunId ?? entry.runId) === task.runId && entry.requesterSessionKey === task.ownerKey && (backing?.runtime !== "subagent" || entry.generation === backing.generation));
}
function prepareTaskTerminalDelivery(taskId, expectedTask, mutation, flows, readSubagentRun) {
	const latest = tasks.get(taskId);
	if (!matchesTaskNotificationTarget(latest, expectedTask) || !shouldAutoDeliverTaskTerminalUpdate(latest) || isSubagentSettlementPending(latest, readSubagentRun)) return { result: latest ? cloneTaskRecord(latest) : null };
	const peers = latest.runId ? getPeerTasksForDelivery(latest) : [];
	const isSubagentCancellation = latest.runtime === "subagent" && latest.status === "cancelled";
	const preferred = pickPreferredRunIdTask(isSubagentCancellation ? peers.filter((candidate) => shouldAutoDeliverTaskTerminalUpdate(candidate)) : peers);
	const peerDeliveryCovered = isSubagentCancellation && peers.some((candidate) => candidate.taskId !== latest.taskId && (candidate.deliveryStatus === "delivered" || candidate.deliveryStatus === "session_queued"));
	if (shouldSuppressDuplicateTerminalDelivery({
		task: latest,
		preferredTaskId: preferred?.taskId,
		peerDeliveryCovered
	})) return { pending: mutation.updateDelivery(latest, {
		kind: "terminal",
		deliveryStatus: "not_applicable"
	}) };
	const owner = resolveTaskDeliveryOwner(latest, flows.getTaskFlowById);
	const ownerSessionKey = owner.sessionKey?.trim();
	if (!ownerSessionKey) return { pending: mutation.updateDelivery(latest, {
		kind: "terminal",
		deliveryStatus: resolveMissingOwnerDeliveryStatus(latest)
	}) };
	const shouldRouteParentReview = shouldUseParentReviewTaskTerminalMessage(latest);
	const shouldDeliverParentReviewDirect = canDeliverParentReviewTaskToThreadOrigin(latest, owner);
	const canDeliverDirect = canDeliverTaskToRequesterOrigin(owner) || shouldDeliverParentReviewDirect;
	const sessionEventText = formatTaskTerminalMessage(latest, shouldRouteParentReview ? { surface: "parent_session" } : void 0);
	if (shouldRouteParentReview && !shouldDeliverParentReviewDirect || !canDeliverDirect) {
		let deliveryStatus = shouldRouteParentReview && canDeliverDirect ? "pending" : "session_queued";
		try {
			queueTaskSystemEvent(latest, sessionEventText, owner);
			if (latest.terminalOutcome === "blocked") queueBlockedTaskFollowup(latest, owner);
		} catch (error) {
			taskRegistryLog.warn("Failed to queue background task session delivery", {
				taskId,
				ownerKey: latest.ownerKey,
				error
			});
			deliveryStatus = "failed";
		}
		return { pending: mutation.updateDelivery(latest, {
			kind: "terminal",
			deliveryStatus
		}) };
	}
	return {
		latest,
		owner,
		ownerSessionKey,
		shouldDeliverParentReviewDirect,
		sessionEventText
	};
}
async function finishTerminalNotificationMutation(taskId, pending) {
	try {
		return await pending;
	} catch (error) {
		taskRegistryLog.warn("Failed to persist background task delivery", {
			taskId,
			error
		});
		return null;
	}
}
async function maybeDeliverTaskTerminalUpdateUnderAdmission(taskId, assertDeliveryCurrent) {
	let claim;
	let expectedTask;
	let retiredClaimError;
	const assertCurrent = () => {
		assertDeliveryCurrent();
		if (claim && tasksWithPendingDelivery.get(taskId) !== claim) {
			retiredClaimError ??= /* @__PURE__ */ new Error("Task terminal delivery no longer owns its pending claim");
			throw retiredClaimError;
		}
	};
	const mutation = captureTaskNotificationMutationOwner(assertCurrent);
	try {
		const early = await mutation.prepare(() => {
			const current = tasks.get(taskId);
			if (!current || !shouldAutoDeliverTaskTerminalUpdate(current) || tasksWithPendingDelivery.has(taskId)) return current ? cloneTaskRecord(current) : null;
			claim = Symbol("task terminal delivery");
			tasksWithPendingDelivery.set(taskId, claim);
			expectedTask = captureTaskNotificationTarget(current);
		});
		if (!claim || !expectedTask) return early ?? null;
		const target = expectedTask;
		const subagentChildSessionKey = target.runtime === "subagent" ? target.childSessionKey : void 0;
		let initialMutation;
		let prepared;
		try {
			prepared = await mutation.prepare((flows, readSubagentRun) => {
				const result = prepareTaskTerminalDelivery(taskId, target, mutation, flows, readSubagentRun);
				if ("pending" in result) initialMutation = result.pending;
				return result;
			}, subagentChildSessionKey);
		} catch (error) {
			await settleNotificationMutationAfterPreparationFailure(initialMutation, error);
			throw error;
		}
		if ("result" in prepared) return prepared.result;
		if ("pending" in prepared) return await finishTerminalNotificationMutation(taskId, prepared.pending);
		let startedMutation;
		let deliverySettled = false;
		try {
			const { sendMessage, prepareTaskControlUiSessionUrl } = await loadTaskRegistryDeliveryRuntime();
			const resolveTaskControlUiSessionUrl = target.childSessionKey ? await prepareTaskControlUiSessionUrl(assertCurrent) : void 0;
			assertCurrent();
			const invocation = {};
			let immediate;
			try {
				immediate = await mutation.prepare((flows, readSubagentRun) => {
					const fresh = prepareTaskTerminalDelivery(taskId, target, mutation, flows, readSubagentRun);
					prepared = fresh;
					if ("result" in fresh) return fresh.result;
					if ("pending" in fresh) {
						startedMutation = fresh.pending;
						return;
					}
					const { latest, owner, ownerSessionKey, shouldDeliverParentReviewDirect, sessionEventText } = fresh;
					const requesterAgentId = owner.agentId;
					const inspectUrl = latest.childSessionKey ? resolveTaskControlUiSessionUrl?.({
						sessionKey: latest.childSessionKey,
						fallbackAgentId: parseAgentSessionKey(latest.childSessionKey)?.agentId ?? requesterAgentId
					}) : void 0;
					const directEventText = shouldDeliverParentReviewDirect ? sessionEventText : formatTaskTerminalMessage(latest);
					const idempotencyKey = resolveTaskTerminalIdempotencyKey(latest, owner);
					assertCurrent();
					const current = tasks.get(taskId);
					if (!matchesTaskNotificationTarget(current, target)) return current ? cloneTaskRecord(current) : null;
					invocation.send = {
						facts: fresh,
						pending: sendMessage({
							channel: owner.requesterOrigin?.channel,
							to: owner.requesterOrigin?.to ?? "",
							accountId: owner.requesterOrigin?.accountId,
							threadId: owner.requesterOrigin?.threadId,
							content: inspectUrl ? `${directEventText}\nInspect: ${inspectUrl}` : directEventText,
							agentId: requesterAgentId,
							idempotencyKey,
							mirror: {
								sessionKey: ownerSessionKey,
								agentId: requesterAgentId,
								idempotencyKey
							}
						})
					};
				}, subagentChildSessionKey);
			} catch (error) {
				if (!invocation.send) {
					await settleNotificationMutationAfterPreparationFailure(startedMutation, error);
					throw error;
				}
				invocation.cleanupFailure = { error };
			}
			if (!invocation.send) return startedMutation ? await finishTerminalNotificationMutation(taskId, startedMutation) : immediate ?? null;
			const { latest: sentTask, owner, ownerSessionKey } = invocation.send.facts;
			const sendResult = await invocation.send.pending.catch((error) => {
				if (invocation.cleanupFailure) throw new AggregateError([invocation.cleanupFailure.error, error], "Task delivery and coordinator cleanup failed", { cause: invocation.cleanupFailure.error });
				throw error;
			});
			deliverySettled = sendResult.deliveryStatus !== "suppressed" || sendResult.suppressionReason === "adapter_returned_no_identity";
			if (invocation.cleanupFailure) taskRegistryLog.warn("Background task delivery settled after coordinator cleanup failed", {
				taskId,
				error: invocation.cleanupFailure.error
			});
			let afterDelivery;
			try {
				afterDelivery = await mutation.prepare((flows) => {
					const afterSend = tasks.get(taskId);
					if (!matchesTaskNotificationTarget(afterSend, target) || !shouldAutoDeliverTaskTerminalUpdate(afterSend)) return afterSend ? cloneTaskRecord(afterSend) : null;
					let deliveryStatus = "delivered";
					if (sendResult.deliveryStatus === "suppressed") {
						if (sendResult.suppressionReason !== "adapter_returned_no_identity") throw new Error(`background task update suppressed: ${sendResult.suppressionReason ?? "unknown reason"}`);
						taskRegistryLog.warn("Background task update delivery was not confirmed", {
							taskId,
							ownerKey: ownerSessionKey,
							requesterOrigin: owner.requesterOrigin,
							suppressionReason: sendResult.suppressionReason
						});
						deliveryStatus = "failed";
					} else if (afterSend.terminalOutcome === "blocked") queueBlockedTaskFollowup(afterSend, resolveTaskDeliveryOwner(afterSend, flows.getTaskFlowById));
					startedMutation = mutation.updateDelivery(sentTask, {
						kind: "terminal",
						deliveryStatus
					});
				});
			} catch (error) {
				await settleNotificationMutationAfterPreparationFailure(startedMutation, error);
				throw error;
			}
			return startedMutation ? await finishTerminalNotificationMutation(taskId, startedMutation) : afterDelivery ?? null;
		} catch (error) {
			const previous = prepared;
			taskRegistryLog.warn("Failed to deliver background task update", {
				taskId,
				..."owner" in previous ? {
					ownerKey: previous.ownerSessionKey,
					requesterOrigin: previous.owner.requesterOrigin
				} : {},
				error
			});
			if (startedMutation) return await finishTerminalNotificationMutation(taskId, startedMutation);
			if (deliverySettled) return await mutation.prepare(() => null);
			let fallbackMutation;
			let fallback;
			try {
				fallback = await mutation.prepare((flows, readSubagentRun) => {
					const beforeFallback = tasks.get(taskId);
					if (!matchesTaskNotificationTarget(beforeFallback, target) || !shouldAutoDeliverTaskTerminalUpdate(beforeFallback) || isSubagentSettlementPending(beforeFallback, readSubagentRun)) return beforeFallback ? cloneTaskRecord(beforeFallback) : null;
					try {
						const fallbackOwner = resolveTaskDeliveryOwner(beforeFallback, flows.getTaskFlowById);
						const sessionEventText = formatTaskTerminalMessage(beforeFallback, shouldUseParentReviewTaskTerminalMessage(beforeFallback) ? { surface: "parent_session" } : void 0);
						queueTaskSystemEvent(beforeFallback, sessionEventText, fallbackOwner);
						if (beforeFallback.terminalOutcome === "blocked") queueBlockedTaskFollowup(beforeFallback, fallbackOwner);
					} catch (fallbackError) {
						taskRegistryLog.warn("Failed to queue background task fallback event", {
							taskId,
							ownerKey: beforeFallback.ownerKey,
							error: fallbackError
						});
					}
					fallbackMutation = mutation.updateDelivery(beforeFallback, {
						kind: "terminal",
						deliveryStatus: "failed"
					});
				}, subagentChildSessionKey);
			} catch (fallbackError) {
				await settleNotificationMutationAfterPreparationFailure(fallbackMutation, fallbackError);
				throw fallbackError;
			}
			return fallbackMutation ? await finishTerminalNotificationMutation(taskId, fallbackMutation) : fallback ?? null;
		}
	} catch (error) {
		if (!retiredClaimError || error !== retiredClaimError) throw error;
		return null;
	} finally {
		if (claim && tasksWithPendingDelivery.get(taskId) === claim) tasksWithPendingDelivery.delete(taskId);
	}
}
function maybeDeliverTaskStateChangeUpdate(task, latestEvent) {
	const expectedTask = captureTaskNotificationTarget(task);
	const requestedEvent = latestEvent ? Object.freeze({ ...latestEvent }) : void 0;
	return runTaskDeliveryWithDetachedAdmission(expectedTask.taskId, async (assertCurrent) => maybeDeliverTaskStateChangeUpdateUnderAdmission(expectedTask, requestedEvent, assertCurrent));
}
function prepareTaskStateChangeDelivery(expectedTask, latestEvent, mutation, flows) {
	const { taskId } = expectedTask;
	const current = tasks.get(taskId);
	if (!matchesTaskNotificationTarget(current, expectedTask) || !shouldAutoDeliverTaskStateChange(current)) return { result: current ? cloneTaskRecord(current) : null };
	const deliveryState = getTaskDeliveryState(taskId);
	if (!latestEvent || (deliveryState?.lastNotifiedEventAt ?? 0) >= latestEvent.at) return { result: cloneTaskRecord(current) };
	const event = latestEvent;
	const eventText = formatTaskStateChangeMessage(current, event);
	if (!eventText) return { result: cloneTaskRecord(current) };
	try {
		const owner = resolveTaskDeliveryOwner(current, flows.getTaskFlowById);
		const ownerSessionKey = owner.sessionKey?.trim();
		if (!ownerSessionKey) return {
			current,
			pending: mutation.updateDelivery(current, {
				kind: "missingStateOwner",
				deliveryStatus: resolveMissingOwnerDeliveryStatus(current)
			})
		};
		const acknowledge = mutation.bindStateChange(current, event.at);
		const prepared = {
			current,
			latestEvent: event,
			owner,
			ownerSessionKey,
			eventText,
			acknowledge
		};
		if (!canDeliverTaskToRequesterOrigin(owner)) {
			queueTaskSystemEvent(current, eventText, owner);
			return {
				...prepared,
				queued: acknowledge()
			};
		}
		return {
			...prepared,
			queued: false
		};
	} catch (error) {
		taskRegistryLog.warn("Failed to deliver background task state change", {
			taskId,
			ownerKey: current.ownerKey,
			error
		});
		return { result: cloneTaskRecord(current) };
	}
}
async function maybeDeliverTaskStateChangeUpdateUnderAdmission(expectedTask, latestEvent, assertCurrent) {
	const { taskId } = expectedTask;
	const mutation = captureTaskNotificationMutationOwner(assertCurrent);
	let pendingMutation;
	let initial;
	try {
		initial = await mutation.prepare((flows) => {
			const prepared = prepareTaskStateChangeDelivery(expectedTask, latestEvent, mutation, flows);
			if ("pending" in prepared) pendingMutation = prepared.pending;
			else if (!("result" in prepared) && prepared.queued) pendingMutation = prepared.queued;
			return prepared;
		});
	} catch (error) {
		await settleNotificationMutationAfterPreparationFailure(pendingMutation, error);
		throw error;
	}
	if ("result" in initial) return initial.result;
	try {
		if ("pending" in initial) return await initial.pending;
		if (initial.queued) return await initial.queued;
		const { sendMessage } = await loadTaskRegistryDeliveryRuntime();
		const invocation = {};
		let immediate;
		try {
			immediate = await mutation.prepare((flows) => {
				assertCurrent();
				const fresh = prepareTaskStateChangeDelivery(expectedTask, latestEvent, mutation, flows);
				if ("result" in fresh) return fresh.result;
				if ("pending" in fresh) {
					pendingMutation = fresh.pending;
					return;
				}
				if (fresh.queued) {
					pendingMutation = fresh.queued;
					return;
				}
				const { current, latestEvent: event, owner, ownerSessionKey, eventText } = fresh;
				const requesterAgentId = owner.agentId;
				const idempotencyKey = resolveTaskStateChangeIdempotencyKey({
					task: current,
					latestEvent: event,
					owner
				});
				invocation.send = {
					facts: fresh,
					pending: sendMessage({
						channel: owner.requesterOrigin?.channel,
						to: owner.requesterOrigin?.to ?? "",
						accountId: owner.requesterOrigin?.accountId,
						threadId: owner.requesterOrigin?.threadId,
						content: eventText,
						agentId: requesterAgentId,
						idempotencyKey,
						mirror: {
							sessionKey: ownerSessionKey,
							agentId: requesterAgentId,
							idempotencyKey
						}
					})
				};
			});
		} catch (error) {
			if (!invocation.send) {
				await settleNotificationMutationAfterPreparationFailure(pendingMutation, error);
				throw error;
			}
			invocation.cleanupFailure = { error };
		}
		if (!invocation.send) return pendingMutation ? await pendingMutation : immediate ?? null;
		const { current, owner, acknowledge } = invocation.send.facts;
		const sendResult = await invocation.send.pending.catch((error) => {
			if (invocation.cleanupFailure) throw new AggregateError([invocation.cleanupFailure.error, error], "Task state-change delivery and coordinator cleanup failed", { cause: invocation.cleanupFailure.error });
			throw error;
		});
		if (invocation.cleanupFailure) taskRegistryLog.warn("Background task state change settled after coordinator cleanup failed", {
			taskId,
			error: invocation.cleanupFailure.error
		});
		if (sendResult.deliveryStatus === "suppressed") {
			if (sendResult.suppressionReason !== "adapter_returned_no_identity") throw new Error(`background task state change suppressed: ${sendResult.suppressionReason ?? "unknown reason"}`);
			taskRegistryLog.warn("Background task state change delivery was not confirmed", {
				taskId,
				ownerKey: current.ownerKey,
				requesterOrigin: owner.requesterOrigin,
				suppressionReason: sendResult.suppressionReason
			});
		}
		return await acknowledge();
	} catch (error) {
		taskRegistryLog.warn("Failed to deliver background task state change", {
			taskId,
			ownerKey: initial.current.ownerKey,
			error
		});
		const readCurrent = () => {
			const current = tasks.get(taskId);
			return current ? cloneTaskRecord(current) : null;
		};
		try {
			return await mutation.prepare(readCurrent);
		} catch {
			return readCurrent();
		}
	}
}
//#endregion
export { updateTaskWithPublication as a, retainTaskMutationFlowEffects as c, updateTask as i, maybeDeliverTaskTerminalUpdate as n, captureTaskMutationContext as o, publishTaskRecordUpdate as r, finishTaskMutation as s, maybeDeliverTaskStateChangeUpdate as t };
