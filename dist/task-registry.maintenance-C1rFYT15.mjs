import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { A as parseAgentSessionKey } from "./session-key-CBvmC8zz.mjs";
import { t as createSubsystemLogger } from "./subsystem-DleLyu58.mjs";
import { Rt as resolveCronTaskRecordTimestamp, jt as cronTaskRecordStoreKey } from "./openclaw-state-db-read-connection-Beg0AZE7.mjs";
import { r as isArtifactPreservingStateRead } from "./openclaw-state-db-readonly-CbuLJI4_.mjs";
import { t as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-Dn3_Z_Oi.mjs";
import { l as resolveSessionStorePathCore } from "./paths-CcMbq5NY.mjs";
import { t as sessionChanges } from "./session-row-changes-xuu0eHng.mjs";
import { n as createSqliteWorkerWriteAdmission } from "./sqlite-worker-store-H5HXDD9v.mjs";
import { i as runOpenClawStateWorkerOperation } from "./openclaw-state-worker-store-YAl4mP45.mjs";
import { r as getRuntimeConfig } from "./io.runtime-BN-rPaec.mjs";
import "./config-Ciq2mxdN.mjs";
import { S as runWithGatewayIndependentRootWorkAdmission, l as isGatewayRestartDrainError } from "./gateway-work-admission-CHv_0noy.mjs";
import { c as getAgentRunContext } from "./agent-run-registry-DO6Dg2r0.mjs";
import { t as deriveSessionChatTypeFromKey } from "./session-chat-type-shared-CThMOjN8.mjs";
import { l as sweepExpiredPluginStateEntriesInWorker } from "./plugin-state-store-CgyXRuSI.mjs";
import { n as readSessionBackingFacts, t as readSessionBackingFactsInWorker } from "./session-accessor-l-4ZHvKn.mjs";
import { c as resolveAcpSessionTarget, t as acpSessionActorKey } from "./manager.utils-D-EbA2WL.mjs";
import { E as readTaskBackingInstance, I as compareTasksNewestFirst, N as cloneTaskRecord } from "./task-registry.store.kernel-BuNI8UuR.mjs";
import { r as isTerminalTaskStatus } from "./task-registry.types-CkM1jc3D.mjs";
import { A as getTaskFlowRegistryStore, f as getTaskFlowRegistryRestoreFailure, g as prepareTaskFlowRegistryRead, m as listTaskFlowRecords, w as runTaskFlowRegistryWorkerMutation } from "./task-flow-runtime-internal-DFSz6gyF.mjs";
import { a as summarizeTaskRecords, d as resolveTaskCleanupAfter, i as createEmptyTaskStatusSummary, l as summarizeTaskAuditFindings, n as addTaskStatusSummaryRecord, o as configureTaskAuditTaskProvider, s as listTaskAuditFindings, u as resolveEffectiveTaskCleanupAfter } from "./task-registry.summary-BJx95J9k.mjs";
import { c as loadTaskRegistryStateFromSqliteReadOnlyResult, i as listTaskRegistryRecordsByRuntimeSourceIdFromSqlite } from "./task-registry.store.sqlite-nRmuK0pg.mjs";
import { E as withTaskRegistryMutation, o as ensureTaskRegistryReady, w as tasks } from "./task-registry-state-Cibd1d5c.mjs";
import { l as hasSubagentTaskOwner } from "./subagent-registry-read-C2SIiLpb.mjs";
import { n as isTaskFlowCancellationPending } from "./task-cancellation-state-7hPsgm-K.mjs";
import { n as prepareTaskRegistryRead, r as prepareTaskRegistryReadOwner } from "./task-registry-read-BpKCOEEj.mjs";
import "./task-backing-authority-CIHk-jEg.mjs";
import { n as maybeDeliverTaskTerminalUpdate } from "./task-registry-delivery-cd3nNFSG.mjs";
import { t as getSessionBindingService } from "./session-binding-service-n2QTfkUE.mjs";
import { d as listTasksForFlowId, h as resolveTaskForLookupToken, i as hasActiveTaskForChildSessionKey, r as getTaskById, s as listTaskRecords, t as deleteTaskRecordById } from "./task-registry-query-Cb1HIUfX.mjs";
import { c as markTaskTerminalById, o as markTaskLostById, u as setTaskCleanupAfterById } from "./task-registry-J6rCfMnh.mjs";
import { n as isBackgroundExecTask } from "./background-exec-task-contract-DDYMoYd-.mjs";
import { t as isHarnessOwnedSubagentTask } from "./harness-owned-subagent-task-D9k0l4Sr.mjs";
import "./runtime-internal-BQjc0KPP.mjs";
import { f as tryRecoverTaskBeforeMarkLost, s as getDetachedTaskLifecycleRuntime } from "./detached-task-runtime-DG7veuVf.mjs";
import { t as isAcpTurnActive } from "./active-turns-CLQiPB0K.mjs";
import { n as readAcpSessionEntry, t as listAcpSessionEntries } from "./session-meta-BxRb6CVY.mjs";
import { f as isCronJobActive } from "./active-jobs-BdNx3YyC.mjs";
import { n as isBackgroundExecSessionActive } from "./bash-process-control-r_n7mOhz.mjs";
import { n as formatSubagentRecoveryWedgedReason, r as isSubagentRecoveryWedgedEntry } from "./subagent-recovery-state-owKRDgQi.mjs";
import "./sessions-DE4llkPV.mjs";
import { n as isContextEngineMaintenanceTaskOwnerActive, r as isContextEngineTurnMaintenanceTask } from "./context-engine-maintenance-task-owner-ns85z5cH.mjs";
import { t as resolveTaskFlowMaintenanceAction } from "./task-flow-maintenance-policy-D74gWLqm.mjs";
import { n as summarizeTaskFlowAuditFindings, t as listTaskFlowAuditFindings } from "./task-flow-registry.audit-3plCXhLU.mjs";
import { isDeepStrictEqual } from "node:util";
//#region src/tasks/cron-history-retention.ts
/** Enforces the task-ledger retention bound for terminal cron history. */
const CRON_HISTORY_KEEP_PER_JOB = 2e3;
function isTerminalTask(task) {
	return task.status !== "queued" && task.status !== "running";
}
function collectCronHistoryOverflowTaskIds(tasks) {
	const byStore = /* @__PURE__ */ new Map();
	for (const task of tasks) {
		if (task.runtime !== "cron" || !task.sourceId || !isTerminalTask(task) || task.status === "lost") continue;
		const storeKey = cronTaskRecordStoreKey(task);
		const bySource = byStore.get(storeKey) ?? /* @__PURE__ */ new Map();
		const partition = bySource.get(task.sourceId) ?? {
			history: [],
			quiet: []
		};
		const detail = task.detail;
		(typeof detail === "object" && detail !== null && !Array.isArray(detail) && detail.kind === "cron-run" ? partition.history : partition.quiet).push(task);
		bySource.set(task.sourceId, partition);
		byStore.set(storeKey, bySource);
	}
	const overflow = /* @__PURE__ */ new Set();
	for (const bySource of byStore.values()) for (const partition of bySource.values()) for (const rows of [partition.history, partition.quiet]) {
		rows.sort((left, right) => {
			return resolveCronTaskRecordTimestamp(right) - resolveCronTaskRecordTimestamp(left) || right.createdAt - left.createdAt || right.taskId.localeCompare(left.taskId);
		});
		for (const task of rows.slice(CRON_HISTORY_KEEP_PER_JOB)) overflow.add(task.taskId);
	}
	return overflow;
}
function shouldPruneTerminalTask(task, now, cronHistoryOverflowTaskIds) {
	if (!isTerminalTask(task)) return false;
	if (cronHistoryOverflowTaskIds.has(task.taskId)) return true;
	return now >= resolveEffectiveTaskCleanupAfter(task);
}
//#endregion
//#region src/tasks/task-flow-registry.maintenance.ts
function assertTaskFlowRegistryMaintenanceReady() {
	const restoreFailure = getTaskFlowRegistryRestoreFailure();
	if (restoreFailure) throw new Error(`Task-flow registry restore failed: ${restoreFailure}. Refusing task maintenance.`);
}
function getInspectableTaskFlowAuditSummary() {
	return summarizeTaskFlowAuditFindings(listTaskFlowAuditFindings());
}
function previewTaskFlowRegistryMaintenance() {
	const now = Date.now();
	let reconciled = 0;
	let pruned = 0;
	for (const flow of listTaskFlowRecords()) {
		const action = resolveTaskFlowMaintenanceAction(flow, now, () => listTasksForFlowId(flow.flowId).some(isTaskFlowCancellationPending));
		if (action?.kind === "prune") pruned += 1;
		else if (action) reconciled += 1;
	}
	return {
		reconciled,
		pruned
	};
}
async function runTaskFlowRegistryMaintenance() {
	const now = Date.now();
	const context = captureOpenClawStateWorkerContext();
	const store = getTaskFlowRegistryStore();
	let taskOwner;
	const assertOwnerCurrent = () => {
		context.admission.assertCurrent();
		taskOwner?.assertCurrent();
		if (getTaskFlowRegistryStore() !== store) throw new Error("Task-flow maintenance owner is no longer current.");
	};
	const prepareFlows = async () => {
		assertOwnerCurrent();
		const read = await prepareTaskFlowRegistryRead(context);
		assertOwnerCurrent();
		return read;
	};
	const initial = await prepareFlows();
	if (!initial) throw new Error("Task-flow registry changed while preparing maintenance.");
	let reconciled = 0;
	let pruned = 0;
	for (const flowId of initial.listTaskFlowIds()) {
		const selectedRead = await prepareFlows();
		if (!selectedRead?.isTaskFlowCurrent(flowId)) continue;
		const selected = selectedRead.getTaskFlowById(flowId);
		const selectedAction = selected && resolveTaskFlowMaintenanceAction(selected, now, () => false);
		if (!selectedAction) continue;
		const attempts = selectedAction.kind === "prune" ? 1 : 2;
		for (let attempt = 0; attempt < attempts; attempt += 1) {
			let taskRead;
			if (selectedAction.kind !== "repair") {
				taskOwner ??= await prepareTaskRegistryReadOwner(context);
				taskRead = await prepareTaskRegistryRead(taskOwner);
				assertOwnerCurrent();
				if (!taskRead) break;
			}
			const read = await prepareFlows();
			if (!read?.isTaskFlowCurrent(flowId)) break;
			const current = read.getTaskFlowById(flowId);
			const action = current && resolveTaskFlowMaintenanceAction(current, now, () => taskRead?.hasPendingTasksForFlow(flowId) ?? true);
			if (!current || !action || action.kind !== selectedAction.kind) break;
			const assertMutationAllowed = () => {
				assertOwnerCurrent();
				read.assertOwnerCurrent();
				if (action.kind !== "repair" && (!taskRead || taskRead.hasPendingTasksForFlow(flowId))) throw new Error("Task-flow maintenance has active or unsettled linked tasks.");
			};
			try {
				const result = await runTaskFlowRegistryWorkerMutation({
					flowId,
					admission: context.admission
				}, () => runOpenClawStateWorkerOperation(context, (scope) => scope.execute({
					type: "flows.maintain",
					input: {
						flowId,
						expectedRevision: current.revision,
						action: action.kind,
						now
					}
				}), {
					requireStateLifecycle: true,
					assertCurrent: assertOwnerCurrent,
					createAdmission: createSqliteWorkerWriteAdmission(assertMutationAllowed, [context.admission.databasePath])
				}), async () => {
					assertOwnerCurrent();
					const flow = await store.readFlowAsync(context, flowId);
					assertOwnerCurrent();
					return flow;
				});
				assertOwnerCurrent();
				if (result === "revision_conflict") continue;
				if (result === "reconciled") reconciled += 1;
				else if (result === "pruned") pruned += 1;
			} catch {
				assertOwnerCurrent();
			}
			break;
		}
	}
	return {
		reconciled,
		pruned
	};
}
//#endregion
//#region src/tasks/task-registry-acp-cleanup.ts
const log$1 = createSubsystemLogger("tasks/task-registry-maintenance");
async function loadTaskAcpSessionCloser() {
	const { getAcpSessionManager } = await import("./acp/control-plane/manager.js");
	return async ({ cfg, sessionKey, agentId, reason }) => {
		await getAcpSessionManager().closeSession({
			cfg,
			sessionKey,
			agentId,
			reason,
			discardPersistentState: true,
			clearMeta: true,
			allowBackendUnavailable: true,
			requireAcpSession: false
		});
	};
}
function getNormalizedTaskChildSessionKey(task) {
	return normalizeOptionalString(task.childSessionKey);
}
function getAcpSessionParentKeys(acpEntry) {
	return [normalizeOptionalString(acpEntry.entry?.spawnedBy), normalizeOptionalString(acpEntry.entry?.parentSessionKey)].filter((value) => Boolean(value));
}
function isParentOwnedAcpSessionTask(task, acpEntry) {
	const entry = acpEntry?.entry;
	if (!entry) return false;
	const ownerKey = normalizeOptionalString(task.ownerKey);
	const requesterKey = normalizeOptionalString(task.requesterSessionKey);
	return getAcpSessionParentKeys({ entry }).some((parentKey) => parentKey === ownerKey || parentKey === requesterKey);
}
function isParentOwnedAcpSessionEntry(acpEntry) {
	return getAcpSessionParentKeys(acpEntry).length > 0;
}
function hasActiveSessionBinding(runtime, sessionKey) {
	const listBindings = runtime.listSessionBindingsBySession;
	if (!listBindings) return true;
	try {
		return listBindings(sessionKey).some((binding) => binding.status !== "ended");
	} catch {
		return true;
	}
}
function shouldCloseTerminalAcpSession(runtime, task) {
	if (task.runtime !== "acp" || task.status === "queued" || task.status === "running") return false;
	const sessionKey = getNormalizedTaskChildSessionKey(task);
	if (!sessionKey || runtime.hasActiveTaskForChildSessionKey({
		sessionKey,
		agentId: task.agentId,
		excludeTaskId: task.taskId
	})) return false;
	const acpEntry = runtime.readAcpSessionEntry({
		sessionKey,
		agentId: task.agentId,
		clone: false
	});
	if (!acpEntry || acpEntry.storeReadFailed || !acpEntry.acp) return false;
	if (!isParentOwnedAcpSessionTask(task, acpEntry)) return false;
	if (acpEntry.acp.mode === "oneshot") return true;
	return !hasActiveSessionBinding(runtime, sessionKey);
}
function shouldCloseOrphanedParentOwnedAcpSession(runtime, acpEntry) {
	if (!acpEntry.entry || !acpEntry.acp || !isParentOwnedAcpSessionEntry(acpEntry)) return false;
	const sessionKey = normalizeOptionalString(acpEntry.sessionKey);
	if (!sessionKey || runtime.hasActiveTaskForChildSessionKey({
		sessionKey,
		agentId: acpEntry.agentId
	})) return false;
	if (acpEntry.acp.mode === "oneshot") return true;
	return !hasActiveSessionBinding(runtime, sessionKey);
}
async function cleanupTerminalAcpSession(runtime, task, closeAcpSession, assertOwnerCurrent) {
	assertOwnerCurrent();
	if (!shouldCloseTerminalAcpSession(runtime, task)) return;
	const sessionKey = getNormalizedTaskChildSessionKey(task);
	if (!sessionKey) return;
	const acpEntry = runtime.readAcpSessionEntry({
		sessionKey,
		agentId: task.agentId,
		clone: false
	});
	if (!acpEntry || !closeAcpSession) return;
	assertOwnerCurrent();
	try {
		await closeAcpSession({
			cfg: acpEntry.cfg,
			agentId: acpEntry.agentId,
			sessionKey,
			reason: "terminal-task-cleanup"
		});
	} catch (error) {
		assertOwnerCurrent();
		log$1.warn("Failed to close terminal ACP session during task maintenance", {
			sessionKey,
			taskId: task.taskId,
			error
		});
		return;
	}
	assertOwnerCurrent();
	try {
		await runtime.unbindSessionBindings?.({
			targetSessionKey: sessionKey,
			reason: "terminal-task-cleanup"
		});
	} catch (error) {
		assertOwnerCurrent();
		log$1.warn("Failed to unbind terminal ACP session during task maintenance", {
			sessionKey,
			taskId: task.taskId,
			error
		});
		return;
	}
	assertOwnerCurrent();
}
async function cleanupOrphanedParentOwnedAcpSessions(runtime, closeAcpSession, assertOwnerCurrent) {
	assertOwnerCurrent();
	let acpSessions;
	try {
		acpSessions = await runtime.listAcpSessionEntries({ clone: false });
	} catch (error) {
		assertOwnerCurrent();
		log$1.warn("Failed to list ACP sessions during task maintenance", { error });
		return;
	}
	assertOwnerCurrent();
	const seenSessionKeys = /* @__PURE__ */ new Set();
	for (const acpEntry of acpSessions) {
		const sessionKey = normalizeOptionalString(acpEntry.sessionKey);
		if (!sessionKey) continue;
		const actorKey = acpSessionActorKey(resolveAcpSessionTarget({
			cfg: acpEntry.cfg,
			sessionKey,
			agentId: acpEntry.agentId
		}));
		if (seenSessionKeys.has(actorKey)) continue;
		seenSessionKeys.add(actorKey);
		if (!shouldCloseOrphanedParentOwnedAcpSession(runtime, acpEntry)) continue;
		if (!closeAcpSession) continue;
		assertOwnerCurrent();
		try {
			await closeAcpSession({
				cfg: acpEntry.cfg,
				agentId: acpEntry.agentId,
				sessionKey,
				reason: "orphaned-parent-task-cleanup"
			});
		} catch (error) {
			assertOwnerCurrent();
			log$1.warn("Failed to close orphaned parent-owned ACP session during task maintenance", {
				sessionKey,
				error
			});
			continue;
		}
		assertOwnerCurrent();
		try {
			await runtime.unbindSessionBindings?.({
				targetSessionKey: sessionKey,
				reason: "orphaned-parent-task-cleanup"
			});
		} catch (error) {
			assertOwnerCurrent();
			log$1.warn("Failed to unbind orphaned parent-owned ACP session during task maintenance", {
				sessionKey,
				error
			});
			continue;
		}
		assertOwnerCurrent();
	}
}
//#endregion
//#region src/tasks/task-registry-maintenance-retention.ts
function shouldStampCleanupAfter(task) {
	return isTerminalTaskStatus(task.status) && typeof task.cleanupAfter !== "number";
}
function applyTaskRegistryMaintenanceRetention(taskId, now, cronHistoryOverflowTaskIds, runtime) {
	return withTaskRegistryMutation(() => {
		const current = runtime.getTaskById(taskId);
		if (!current) return;
		if (shouldPruneTerminalTask(current, now, cronHistoryOverflowTaskIds) && runtime.deleteTaskRecordById(current.taskId)) return "pruned";
		if (shouldStampCleanupAfter(current) && runtime.setTaskCleanupAfterById({
			taskId: current.taskId,
			cleanupAfter: resolveTaskCleanupAfter(current)
		})) return "stamped";
	}, () => void 0);
}
//#endregion
//#region src/tasks/task-registry-maintenance-scheduler.ts
const TASK_SWEEP_INTERVAL_MS = 6e4;
function createTaskMaintenanceScheduler(run, onError) {
	let sweeper = null;
	let deferredSweep = null;
	let scheduledSweep = null;
	function startScheduledSweep() {
		if (!sweeper || scheduledSweep) return;
		const admission = new AbortController();
		let admitted = false;
		scheduledSweep = {
			completion: runWithGatewayIndependentRootWorkAdmission(async () => {
				admitted = true;
				await run();
			}, "tasks:maintenance", admission.signal).catch((error) => {
				if (admitted || !admission.signal.aborted && !isGatewayRestartDrainError(error)) onError(error);
			}).finally(() => {
				scheduledSweep = null;
			}),
			cancelAdmission: () => admission.abort()
		};
	}
	return {
		start() {
			if (sweeper) return;
			deferredSweep = setTimeout(() => {
				deferredSweep = null;
				startScheduledSweep();
			}, 5e3);
			deferredSweep.unref?.();
			sweeper = setInterval(startScheduledSweep, TASK_SWEEP_INTERVAL_MS);
			sweeper.unref?.();
		},
		async stop() {
			if (deferredSweep) {
				clearTimeout(deferredSweep);
				deferredSweep = null;
			}
			if (sweeper) {
				clearInterval(sweeper);
				sweeper = null;
			}
			const pending = scheduledSweep;
			pending?.cancelAdmission();
			await pending?.completion;
		}
	};
}
//#endregion
//#region src/tasks/task-registry-maintenance-session-facts.ts
function createBackingSessionLookupContext(runtime, workerOnly = false) {
	return {
		runtime,
		sessionEntriesByPath: /* @__PURE__ */ new Map(),
		sessionChatTypesByKey: /* @__PURE__ */ new Map(),
		workerOnly,
		revision: 0
	};
}
function backingSessionTarget(task, runtime) {
	const sessionKey = task.childSessionKey?.trim();
	if (!sessionKey) return;
	const agentId = runtime.parseAgentSessionKey(sessionKey)?.agentId;
	return {
		sessionKey,
		storePath: runtime.resolveStorePath(void 0, { agentId })
	};
}
/** Acquire only keys requested by the runtime's existing liveness decision. */
async function prepareBackingSessionFacts(context) {
	const scopes = [...context.sessionEntriesByPath].flatMap(([storePath, entries]) => {
		const sessionKeys = [...entries].flatMap(([key, entry]) => entry === void 0 ? [key] : []);
		return sessionKeys.length ? [{
			storePath,
			sessionKeys
		}] : [];
	});
	if (scopes.length === 0) return;
	const revision = context.revision;
	const results = await context.runtime.readSessionBackingFactsInWorker(scopes);
	if (revision !== context.revision) return;
	for (const [index, scope] of scopes.entries()) {
		const facts = results[index];
		if (!facts) continue;
		const entries = context.sessionEntriesByPath.get(scope.storePath) ?? /* @__PURE__ */ new Map();
		for (const key of scope.sessionKeys) entries.set(key, null);
		for (const fact of facts) entries.set(fact.sessionKey, fact.entry);
		context.sessionEntriesByPath.set(scope.storePath, entries);
	}
}
function observeBackingSessionFacts(context) {
	return sessionChanges.subscribe((change) => {
		context.revision += 1;
		if ("all" in change) context.sessionEntriesByPath.clear();
		else for (const entries of context.sessionEntriesByPath.values()) entries.delete(change.sessionKey);
	});
}
function resolveSessionChatType(sessionKey, context) {
	const derive = context.runtime.deriveSessionChatTypeFromKey ?? deriveSessionChatTypeFromKey;
	const cached = context.sessionChatTypesByKey.get(sessionKey);
	if (cached) return cached;
	const chatType = derive(sessionKey);
	context.sessionChatTypesByKey.set(sessionKey, chatType);
	return chatType;
}
function findTaskSessionEntry(task, context) {
	const target = backingSessionTarget(task, context.runtime);
	if (!target) return null;
	const entries = context.sessionEntriesByPath.get(target.storePath) ?? /* @__PURE__ */ new Map();
	if (!entries.has(target.sessionKey)) {
		const facts = context.workerOnly ? void 0 : context.runtime.readSessionBackingFacts({
			storePath: target.storePath,
			sessionKeys: [target.sessionKey]
		});
		entries.set(target.sessionKey, facts ? facts[0]?.entry ?? null : void 0);
		context.sessionEntriesByPath.set(target.storePath, entries);
	}
	return entries.get(target.sessionKey);
}
function getTaskRegistryMaintenanceSnapshot(read) {
	read.assertCurrent();
	const ordered = [...tasks.values()].map((task, insertionIndex) => ({
		task,
		createdAt: task.createdAt,
		insertionIndex
	})).toSorted(compareTasksNewestFirst).map(({ task }) => task);
	return {
		taskIds: ordered.map((task) => task.taskId),
		cronHistoryOverflowTaskIds: collectCronHistoryOverflowTaskIds(ordered)
	};
}
function getTaskRegistryMaintenanceTask(read, taskId, now, cronHistoryOverflowTaskIds) {
	if (!read.isTaskSettled(taskId)) return "needs-preparation";
	const task = tasks.get(taskId);
	if (!task || isTerminalTaskStatus(task.status) && task.runtime !== "acp" && !(task.runtime === "cron" && task.status === "lost") && typeof task.cleanupAfter === "number" && !shouldPruneTerminalTask(task, now, cronHistoryOverflowTaskIds)) return;
	return cloneTaskRecord(task);
}
async function visitTaskRegistryMaintenanceTasks(source, visit, prepareBatch) {
	const prepareRead = async (previous) => {
		previous?.assertOwnerCurrent();
		const read = await source.prepareTaskRegistryRead();
		previous?.assertOwnerCurrent();
		if (!read) throw new Error("Task registry changed while preparing maintenance");
		return read;
	};
	let read = await prepareRead();
	const now = Date.now();
	const { taskIds, cronHistoryOverflowTaskIds } = source.getTaskRegistryMaintenanceSnapshot(read);
	let needsPreparation = false;
	let deferred = 0;
	for (const [index, taskId] of taskIds.entries()) {
		if (index > 0 && index % 25 === 0) {
			await new Promise((resolve) => {
				setImmediate(resolve);
			});
			needsPreparation = true;
		}
		if (needsPreparation) {
			read = await prepareRead(read);
			needsPreparation = false;
		}
		if (prepareBatch && index % 25 === 0) {
			await prepareBatch(taskIds.slice(index, index + 25).flatMap((id) => {
				const task = source.getTaskRegistryMaintenanceTask(read, id, now, cronHistoryOverflowTaskIds);
				return task && task !== "needs-preparation" ? [task] : [];
			}), now);
			read = await prepareRead(read);
		}
		let selected = source.getTaskRegistryMaintenanceTask(read, taskId, now, cronHistoryOverflowTaskIds);
		if (selected === "needs-preparation") {
			read = await prepareRead(read);
			selected = source.getTaskRegistryMaintenanceTask(read, taskId, now, cronHistoryOverflowTaskIds);
			if (selected === "needs-preparation") {
				deferred += 1;
				continue;
			}
		}
		if (selected) {
			await visit(selected, now, cronHistoryOverflowTaskIds, read.assertOwnerCurrent);
			read.assertOwnerCurrent();
			needsPreparation = true;
		}
	}
	return {
		read,
		deferred
	};
}
//#endregion
//#region src/tasks/task-registry.maintenance.ts
const log = createSubsystemLogger("tasks/task-registry-maintenance");
const TASK_RECONCILE_GRACE_MS = 3e5;
const HARNESS_OWNED_SUBAGENT_RECONCILE_GRACE_MS = 18e5;
const TASK_STALE_RUNNING_MS = 18e5;
const maintenanceScheduler = createTaskMaintenanceScheduler(async () => {
	await sweepTaskRegistry();
	await runTaskFlowRegistryMaintenance();
}, (error) => log.warn("Task registry maintenance failed", { error }));
let configuredRuntimeAuthoritative = false;
const backingSessionRuntime = {
	readSessionBackingFacts,
	readSessionBackingFactsInWorker,
	resolveStorePath: resolveSessionStorePathCore,
	parseAgentSessionKey,
	deriveSessionChatTypeFromKey
};
function createCronRecoveryContext() {
	return { taskRowsByJobId: /* @__PURE__ */ new Map() };
}
async function prepareBackingSessionFactsForTasks(tasks, context, now) {
	for (const task of tasks) {
		if (task.runtime !== "subagent" && task.runtime !== "cli") continue;
		shouldMarkLost(task, now, context);
	}
	await prepareBackingSessionFacts(context);
}
function isActiveTask(task) {
	return task.status === "queued" || task.status === "running";
}
function hasLostGraceExpired(task, now) {
	const referenceAt = task.lastEventAt ?? task.startedAt ?? task.createdAt;
	const graceMs = isHarnessOwnedSubagentTask(task) ? HARNESS_OWNED_SUBAGENT_RECONCILE_GRACE_MS : TASK_RECONCILE_GRACE_MS;
	return now - referenceAt >= graceMs;
}
function isRecoverableLostCronTask(task) {
	if (task.status !== "lost") return false;
	const error = task.error?.trim().toLowerCase();
	return Boolean(error?.includes("backing session missing"));
}
function isCronTerminalTaskStatus(status) {
	return status === "succeeded" || status === "failed" || status === "timed_out" || status === "cancelled";
}
function getCronTaskRows(context, jobId) {
	const cached = context.taskRowsByJobId.get(jobId);
	if (cached) return cached;
	let rows;
	try {
		rows = listTaskRegistryRecordsByRuntimeSourceIdFromSqlite({
			runtime: "cron",
			sourceId: jobId
		});
	} catch {
		rows = [];
	}
	context.taskRowsByJobId.set(jobId, rows);
	return rows;
}
function resolveDurableCronTaskRecovery(task, context) {
	if (task.runtime !== "cron" || !isActiveTask(task) && !isRecoverableLostCronTask(task)) return;
	const jobId = task.sourceId?.trim();
	if (!jobId) return;
	if (configuredRuntimeAuthoritative && isCronJobActive(jobId)) return;
	const row = context.taskRowsByTaskId ? context.taskRowsByTaskId.get(task.taskId) : getCronTaskRows(context, jobId).find((candidate) => candidate.taskId === task.taskId || Boolean(task.runId?.trim()) && candidate.runId === task.runId);
	if (!row || !isCronTerminalTaskStatus(row.status)) return;
	const endedAt = resolveCronTaskRecordTimestamp(row);
	return {
		status: row.status,
		endedAt,
		lastEventAt: row.lastEventAt ?? endedAt,
		...row.error !== void 0 ? { error: row.error } : {},
		...row.terminalSummary !== void 0 ? { terminalSummary: row.terminalSummary } : {},
		...row.detail !== void 0 ? { detail: row.detail } : {}
	};
}
function hasActiveCliRun(task) {
	const candidateRunIds = [task.sourceId, task.runId];
	for (const candidate of candidateRunIds) {
		const runId = candidate?.trim();
		if (runId && getAgentRunContext(runId)) return true;
	}
	return false;
}
function hasCliRunIdentity(task) {
	return [task.sourceId, task.runId].some((candidate) => Boolean(candidate?.trim()));
}
function hasBackingSession(task, context) {
	if ((task.runtime === "cron" || task.runtime === "cli" || task.runtime === "acp") && !configuredRuntimeAuthoritative) return true;
	if (task.runtime === "cron") {
		const jobId = task.sourceId?.trim();
		return jobId ? isCronJobActive(jobId) : false;
	}
	if (isBackgroundExecTask(task)) {
		const processSessionId = task.sourceId?.trim();
		return Boolean(processSessionId && isBackgroundExecSessionActive(processSessionId));
	}
	if (isContextEngineTurnMaintenanceTask(task)) return !configuredRuntimeAuthoritative ? true : isContextEngineMaintenanceTaskOwnerActive(task.taskId);
	if (task.runtime === "cli" && hasActiveCliRun(task)) return true;
	if (task.runtime === "cli" && hasCliRunIdentity(task)) return false;
	const childSessionKey = task.childSessionKey?.trim();
	if (!childSessionKey) return !isHarnessOwnedSubagentTask(task);
	if (task.runtime === "acp") return isAcpTurnActive(resolveAcpSessionTarget({
		cfg: getRuntimeConfig(),
		sessionKey: childSessionKey,
		agentId: task.agentId
	}));
	if (task.runtime === "subagent" || task.runtime === "cli") {
		if (task.runtime === "cli") {
			const chatType = resolveSessionChatType(childSessionKey, context);
			if (chatType === "channel" || chatType === "group" || chatType === "direct") return false;
		}
		const registryBackedSubagent = task.runtime === "subagent" && readTaskBackingInstance(task.detail)?.runtime === "subagent";
		if (registryBackedSubagent && task.runId && getAgentRunContext(task.runId)) return true;
		const entry = findTaskSessionEntry(task, context);
		if (entry === void 0) return true;
		if (task.runtime === "subagent" && isSubagentRecoveryWedgedEntry(entry)) return false;
		if (registryBackedSubagent) {
			const taskRunId = task.runId?.trim();
			if (!taskRunId || !configuredRuntimeAuthoritative) return true;
			try {
				return hasSubagentTaskOwner({
					taskRunId,
					childSessionKey,
					requesterSessionKey: task.ownerKey
				});
			} catch (error) {
				log.warn("Unable to establish subagent task ownership during maintenance", {
					taskId: task.taskId,
					error
				});
				return true;
			}
		}
		return entry !== null;
	}
	return true;
}
function resolveTaskLostError(task, context) {
	if (isContextEngineTurnMaintenanceTask(task)) return "owning process exited";
	if (isHarnessOwnedSubagentTask(task)) return "Native subagent stopped reporting progress";
	if (task.runtime === "subagent") {
		const entry = findTaskSessionEntry(task, context);
		if (entry && isSubagentRecoveryWedgedEntry(entry)) return formatSubagentRecoveryWedgedReason(entry);
		if (readTaskBackingInstance(task.detail)?.runtime === "subagent") return "subagent run ownership missing";
	}
	return "backing session missing";
}
function shouldMarkLost(task, now, context) {
	if (!isActiveTask(task)) return false;
	if (!hasLostGraceExpired(task, now)) return false;
	return !hasBackingSession(task, context);
}
function hasTaskLostDecisionInputChanged(before, after) {
	return before.status !== after.status || before.runtime !== after.runtime || before.childSessionKey !== after.childSessionKey || before.sourceId !== after.sourceId || before.runId !== after.runId || before.createdAt !== after.createdAt || before.startedAt !== after.startedAt || before.lastEventAt !== after.lastEventAt || before.ownerKey !== after.ownerKey || !isDeepStrictEqual(before.detail, after.detail);
}
function taskReferenceAt(task) {
	return task.lastEventAt ?? task.startedAt ?? task.createdAt;
}
function markTaskLost(task, now, context) {
	const lostAt = task.endedAt ?? now;
	const cleanupAfter = resolveEffectiveTaskCleanupAfter({
		...task,
		status: "lost",
		endedAt: lostAt
	});
	const updated = markTaskLostById({
		taskId: task.taskId,
		endedAt: lostAt,
		lastEventAt: now,
		error: task.error ?? resolveTaskLostError(task, context),
		cleanupAfter
	}) ?? task;
	maybeDeliverTaskTerminalUpdate(updated.taskId);
	return updated;
}
function markTaskRecovered(task, recovery) {
	const updated = markTaskTerminalById({
		taskId: task.taskId,
		status: recovery.status,
		endedAt: recovery.endedAt,
		lastEventAt: recovery.lastEventAt,
		error: recovery.error,
		...recovery.terminalSummary !== void 0 ? {
			terminalSummary: recovery.terminalSummary,
			preserveTerminalSummary: true
		} : {},
		...recovery.detail !== void 0 ? { detail: recovery.detail } : {}
	}) ?? projectTaskRecovered(task, recovery);
	maybeDeliverTaskTerminalUpdate(updated.taskId);
	return updated;
}
function projectTaskRecovered(task, recovery) {
	const projected = {
		...task,
		status: recovery.status,
		endedAt: recovery.endedAt,
		lastEventAt: recovery.lastEventAt,
		error: recovery.error,
		...recovery.terminalSummary !== void 0 ? { terminalSummary: recovery.terminalSummary } : {},
		...recovery.detail !== void 0 ? { detail: recovery.detail } : {}
	};
	if (recovery.error === void 0) delete projected.error;
	return {
		...projected,
		...typeof projected.cleanupAfter === "number" ? {} : { cleanupAfter: resolveTaskCleanupAfter(projected) }
	};
}
function projectTaskLost(task, now, context) {
	const projected = {
		...task,
		status: "lost",
		endedAt: task.endedAt ?? now,
		lastEventAt: now,
		error: task.error ?? resolveTaskLostError(task, context)
	};
	return {
		...projected,
		...typeof projected.cleanupAfter === "number" ? {} : { cleanupAfter: resolveTaskCleanupAfter(projected) }
	};
}
function reconcileTaskRecordForOperatorInspectionWithContexts(task, context, backingSessionContext, now = Date.now()) {
	const cronRecovery = resolveDurableCronTaskRecovery(task, context);
	if (cronRecovery) return projectTaskRecovered(task, cronRecovery);
	if (!shouldMarkLost(task, now, backingSessionContext)) return task;
	return projectTaskLost(task, now, backingSessionContext);
}
function reconcileTaskRecordForOperatorInspection(task, context = createCronRecoveryContext()) {
	return reconcileTaskRecordForOperatorInspectionWithContexts(task, context, createBackingSessionLookupContext(backingSessionRuntime));
}
function reconcileTaskRecordsForOperatorInspection(tasks) {
	const cronRecoveryContext = createCronRecoveryContext();
	const backingSessionContext = createBackingSessionLookupContext(backingSessionRuntime);
	return tasks.map((task) => reconcileTaskRecordForOperatorInspectionWithContexts(task, cronRecoveryContext, backingSessionContext));
}
function reconcileInspectableTasks() {
	ensureTaskRegistryReady();
	return reconcileTaskRecordsForOperatorInspection(listTaskRecords());
}
/** Reads and reconciles persisted tasks without initializing the process task runtime. */
function listInspectableTasksReadOnly() {
	return inspectTasksReadOnly().tasks;
}
function inspectTasksReadOnly() {
	const loaded = loadTaskRegistryStateFromSqliteReadOnlyResult();
	return {
		state: loaded.state,
		tasks: reconcileTaskRecordsForOperatorInspection([...loaded.snapshot.tasks.values()])
	};
}
const pendingStatusInspections = /* @__PURE__ */ new Map();
/** Coalesce only overlapping inspections; every settled read is replaced by fresh state. */
async function getInspectableTaskStatusSummaryReadOnly() {
	const context = captureOpenClawStateWorkerContext();
	const preserveSourceArtifacts = isArtifactPreservingStateRead();
	const key = `${context.admission.identity.key}:${preserveSourceArtifacts}`;
	let pending = pendingStatusInspections.get(key);
	if (!pending) {
		const now = Date.now();
		pending = (async () => {
			const snapshot = await runOpenClawStateWorkerOperation(context, (scope) => scope.execute({
				type: "tasks.statusSummary",
				input: {
					now,
					preserveSourceArtifacts
				}
			}), { existingOnly: true });
			context.admission.assertCurrent();
			if (!snapshot) return {
				state: "ready",
				...createEmptyTaskStatusSummary()
			};
			const cron = {
				...createCronRecoveryContext(),
				taskRowsByTaskId: snapshot.cronRecoveryRows
			};
			const backing = createBackingSessionLookupContext(backingSessionRuntime, true);
			const stopObserving = observeBackingSessionFacts(backing);
			try {
				await prepareBackingSessionFactsForTasks(snapshot.candidates, backing, now);
				context.admission.assertCurrent();
				for (const [index, task] of snapshot.candidates.entries()) {
					if (index > 0 && index % 25 === 0) {
						await new Promise((resolve) => {
							setImmediate(resolve);
						});
						context.admission.assertCurrent();
					}
					const projected = reconcileTaskRecordForOperatorInspectionWithContexts(task, cron, backing, now);
					addTaskStatusSummaryRecord(snapshot.summary, projected, now);
				}
				return {
					state: snapshot.state,
					...snapshot.summary
				};
			} finally {
				stopObserving();
			}
		})();
		pendingStatusInspections.set(key, pending);
		const clear = () => {
			if (pendingStatusInspections.get(key) === pending) pendingStatusInspections.delete(key);
		};
		pending.then(clear, clear);
	}
	const summary = await pending;
	context.admission.assertCurrent();
	return structuredClone(summary);
}
configureTaskAuditTaskProvider(reconcileInspectableTasks);
function isTaskRestartBlocker(task) {
	return task.status === "running" && !task.endedAt;
}
function getInspectableActiveTaskRestartBlockers() {
	ensureTaskRegistryReady();
	const candidates = listTaskRecords(isTaskRestartBlocker);
	const blockers = [];
	for (const task of reconcileTaskRecordsForOperatorInspection(candidates)) {
		if (!isTaskRestartBlocker(task)) continue;
		const blocker = {
			taskId: task.taskId,
			status: task.status,
			runtime: task.runtime
		};
		if (task.taskKind) blocker.taskKind = task.taskKind;
		if (task.runId) blocker.runId = task.runId;
		if (task.label) blocker.label = task.label;
		if (task.task) blocker.title = task.task;
		blockers.push(blocker);
	}
	return blockers;
}
function getInspectableTaskRegistrySummary(tasks = reconcileInspectableTasks()) {
	return summarizeTaskRecords(tasks);
}
function getInspectableTaskAuditSummary() {
	return summarizeTaskAuditFindings(getInspectableTaskAuditFindings());
}
function getInspectableTaskAuditFindings(tasks = reconcileInspectableTasks()) {
	return listTaskAuditFindings({ tasks });
}
function reconcileTaskLookupToken(token) {
	ensureTaskRegistryReady();
	const task = resolveTaskForLookupToken(token);
	return task ? reconcileTaskRecordForOperatorInspection(task) : void 0;
}
function previewTaskRegistryMaintenance() {
	ensureTaskRegistryReady();
	const now = Date.now();
	let reconciled = 0;
	let recovered = 0;
	let cleanupStamped = 0;
	let pruned = 0;
	const cronRecoveryContext = createCronRecoveryContext();
	const backingSessionContext = createBackingSessionLookupContext(backingSessionRuntime);
	const tasks = listTaskRecords();
	const cronHistoryOverflowTaskIds = collectCronHistoryOverflowTaskIds(tasks);
	for (const task of tasks) {
		if (resolveDurableCronTaskRecovery(task, cronRecoveryContext)) {
			recovered += 1;
			continue;
		}
		if (shouldMarkLost(task, now, backingSessionContext)) {
			reconciled += 1;
			continue;
		}
		if (shouldPruneTerminalTask(task, now, cronHistoryOverflowTaskIds)) {
			pruned += 1;
			continue;
		}
		if (shouldStampCleanupAfter(task)) cleanupStamped += 1;
	}
	return {
		reconciled,
		recovered,
		cleanupStamped,
		pruned
	};
}
function explainActiveTaskRetention(params) {
	if (!hasLostGraceExpired(params.task, params.now)) return {
		decision: "retained",
		reason: "lost_grace_pending"
	};
	if (params.task.runtime === "subagent") {
		const entry = findTaskSessionEntry(params.task, params.context);
		if (entry && isSubagentRecoveryWedgedEntry(entry)) return {
			decision: "would_reconcile",
			reason: "subagent_recovery_wedged",
			detail: formatSubagentRecoveryWedgedReason(entry)
		};
	}
	if (!hasBackingSession(params.task, params.context)) return {
		decision: "would_reconcile",
		reason: params.task.runtime === "subagent" && readTaskBackingInstance(params.task.detail)?.runtime === "subagent" ? "subagent_owner_missing" : "backing_session_missing"
	};
	if (params.task.runtime === "cron" && !configuredRuntimeAuthoritative) return {
		decision: "retained",
		reason: "cron_runtime_not_authoritative"
	};
	if (params.task.runtime === "acp" && !configuredRuntimeAuthoritative) return {
		decision: "retained",
		reason: "acp_runtime_not_authoritative"
	};
	if (params.task.runtime === "cli" && !configuredRuntimeAuthoritative) return {
		decision: "retained",
		reason: "cli_runtime_not_authoritative"
	};
	if (params.task.runtime === "cli" && hasActiveCliRun(params.task)) return {
		decision: "retained",
		reason: "active_cli_run"
	};
	if (isBackgroundExecTask(params.task)) return {
		decision: "retained",
		reason: "active_background_exec"
	};
	return {
		decision: "retained",
		reason: "backing_session_present"
	};
}
function getTaskRegistryMaintenanceDiagnostics() {
	ensureTaskRegistryReady();
	const now = Date.now();
	const cronRecoveryContext = createCronRecoveryContext();
	const backingSessionContext = createBackingSessionLookupContext(backingSessionRuntime);
	const staleRunningTasks = [];
	for (const task of listTaskRecords()) {
		if (task.status !== "running") continue;
		const ageMs = Math.max(0, now - taskReferenceAt(task));
		if (ageMs < TASK_STALE_RUNNING_MS) continue;
		if (resolveDurableCronTaskRecovery(task, cronRecoveryContext)) continue;
		const decision = explainActiveTaskRetention({
			task,
			now,
			context: backingSessionContext
		});
		staleRunningTasks.push({
			taskId: task.taskId,
			runtime: task.runtime,
			status: task.status,
			decision: decision.decision,
			reason: decision.reason,
			ageMs,
			...decision.detail ? { detail: decision.detail } : {},
			...task.childSessionKey ? { childSessionKey: task.childSessionKey } : {},
			...task.runId ? { runId: task.runId } : {}
		});
	}
	return { staleRunningTasks };
}
async function runTaskRegistryMaintenance() {
	let closeAcpSession;
	try {
		closeAcpSession = await loadTaskAcpSessionCloser();
	} catch (error) {
		log.warn("Failed to load ACP session cleanup during task maintenance", { error });
	}
	const acpRuntime = {
		listAcpSessionEntries,
		readAcpSessionEntry,
		hasActiveTaskForChildSessionKey,
		listSessionBindingsBySession: (sessionKey) => getSessionBindingService().listBySession(sessionKey),
		unbindSessionBindings: (input) => getSessionBindingService().unbind(input)
	};
	let reconciled = 0;
	let recovered = 0;
	let cleanupStamped = 0;
	let pruned = 0;
	const cronRecoveryContext = createCronRecoveryContext();
	const backingSessionContext = createBackingSessionLookupContext(backingSessionRuntime, true);
	const recoveryHookRegistered = Boolean(getDetachedTaskLifecycleRuntime().tryRecoverTaskBeforeMarkLost);
	const stopObservingBacking = observeBackingSessionFacts(backingSessionContext);
	try {
		const { read, deferred } = await visitTaskRegistryMaintenanceTasks({
			prepareTaskRegistryRead,
			getTaskRegistryMaintenanceSnapshot,
			getTaskRegistryMaintenanceTask
		}, async (current, now, cronHistoryOverflowTaskIds, assertOwnerCurrent) => {
			if (resolveDurableCronTaskRecovery(current, cronRecoveryContext)) {
				const next = withTaskRegistryMutation(() => {
					const fresh = getTaskById(current.taskId);
					if (!fresh) return;
					const recovery = resolveDurableCronTaskRecovery(fresh, createCronRecoveryContext());
					return recovery ? markTaskRecovered(fresh, recovery) : void 0;
				}, () => void 0);
				if (next && next.status !== current.status) recovered += 1;
				return;
			}
			if (shouldMarkLost(current, now, backingSessionContext)) {
				const recovery = await tryRecoverTaskBeforeMarkLost({
					taskId: current.taskId,
					runtime: current.runtime,
					task: current,
					now
				});
				assertOwnerCurrent();
				const afterRecovery = getTaskById(current.taskId);
				if (!afterRecovery) return;
				const lostContext = recoveryHookRegistered || hasTaskLostDecisionInputChanged(current, afterRecovery) ? createBackingSessionLookupContext(backingSessionRuntime, true) : backingSessionContext;
				lostContext.sessionChatTypesByKey = backingSessionContext.sessionChatTypesByKey;
				const stopObservingLost = observeBackingSessionFacts(lostContext);
				try {
					if (lostContext !== backingSessionContext) await prepareBackingSessionFactsForTasks([afterRecovery], lostContext, now);
					assertOwnerCurrent();
					withTaskRegistryMutation(() => {
						const freshAfterHook = getTaskById(current.taskId);
						if (!freshAfterHook) return;
						const cronRecovery = resolveDurableCronTaskRecovery(freshAfterHook, createCronRecoveryContext());
						if (cronRecovery) {
							if (markTaskRecovered(freshAfterHook, cronRecovery).status !== freshAfterHook.status) recovered += 1;
							return;
						}
						if (hasTaskLostDecisionInputChanged(afterRecovery, freshAfterHook) || !shouldMarkLost(freshAfterHook, now, lostContext)) return;
						if (recovery.recovered) {
							recovered += 1;
							return;
						}
						if (markTaskLost(freshAfterHook, now, lostContext).status === "lost") reconciled += 1;
					}, () => void 0);
				} finally {
					stopObservingLost();
				}
				return;
			}
			if (current.runtime === "acp") {
				await cleanupTerminalAcpSession(acpRuntime, current, closeAcpSession, assertOwnerCurrent);
				assertOwnerCurrent();
			}
			if (shouldPruneTerminalTask(current, now, cronHistoryOverflowTaskIds) || shouldStampCleanupAfter(current)) {
				const result = applyTaskRegistryMaintenanceRetention(current.taskId, now, cronHistoryOverflowTaskIds, {
					getTaskById,
					deleteTaskRecordById,
					setTaskCleanupAfterById
				});
				if (result === "pruned") pruned += 1;
				else if (result === "stamped") cleanupStamped += 1;
			}
		}, (tasks, now) => prepareBackingSessionFactsForTasks(tasks, backingSessionContext, now));
		if (deferred > 0) log.debug("Deferred task maintenance for unsettled mutations", { count: deferred });
		await cleanupOrphanedParentOwnedAcpSessions(acpRuntime, closeAcpSession, read.assertOwnerCurrent);
		try {
			await sweepExpiredPluginStateEntriesInWorker({ assertActive: read.assertOwnerCurrent });
		} catch (error) {
			log.warn("Failed to sweep expired plugin state entries", { error });
		}
		read.assertOwnerCurrent();
		return {
			reconciled,
			recovered,
			cleanupStamped,
			pruned
		};
	} finally {
		stopObservingBacking();
	}
}
async function sweepTaskRegistry() {
	return runTaskRegistryMaintenance();
}
function startTaskRegistryMaintenance() {
	ensureTaskRegistryReady();
	maintenanceScheduler.start();
}
async function stopTaskRegistryMaintenance() {
	await maintenanceScheduler.stop();
}
function configureTaskRegistryMaintenance(options) {
	if (options?.runtimeAuthoritative !== void 0) configuredRuntimeAuthoritative = options.runtimeAuthoritative;
}
//#endregion
export { assertTaskFlowRegistryMaintenanceReady as _, getInspectableTaskRegistrySummary as a, runTaskFlowRegistryMaintenance as b, inspectTasksReadOnly as c, reconcileInspectableTasks as d, reconcileTaskLookupToken as f, sweepTaskRegistry as g, stopTaskRegistryMaintenance as h, getInspectableTaskAuditSummary as i, listInspectableTasksReadOnly as l, startTaskRegistryMaintenance as m, getInspectableActiveTaskRestartBlockers as n, getInspectableTaskStatusSummaryReadOnly as o, runTaskRegistryMaintenance as p, getInspectableTaskAuditFindings as r, getTaskRegistryMaintenanceDiagnostics as s, configureTaskRegistryMaintenance as t, previewTaskRegistryMaintenance as u, getInspectableTaskFlowAuditSummary as v, CRON_HISTORY_KEEP_PER_JOB as x, previewTaskFlowRegistryMaintenance as y };
