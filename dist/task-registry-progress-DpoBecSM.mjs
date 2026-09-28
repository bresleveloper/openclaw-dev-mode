import { n as createLazyPromise } from "./lazy-promise-DGqyc4Y4.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { s as getGatewayRestartDrainSignal, u as isGatewayRestartDraining, x as runWithGatewayDetachedWorkContinuation } from "./gateway-work-admission-CHv_0noy.mjs";
import { d as getAgentRunLifecycleGeneration, w as resolveProjectedAgentRunProgressState } from "./agent-run-registry-DO6Dg2r0.mjs";
import { t as getGlobalHookRunner } from "./hook-runner-global-tOGjxVvH.mjs";
import { t as getChannelPlugin } from "./registry-D3wOWFDo.mjs";
import "./plugins-BEpDh--e.mjs";
import { E as readTaskBackingInstance } from "./task-registry.store.kernel-BuNI8UuR.mjs";
import { r as isTerminalTaskStatus } from "./task-registry.types-CkM1jc3D.mjs";
import { y as readResidentTaskFlow } from "./task-flow-runtime-internal-DFSz6gyF.mjs";
import { p as getTasksByRunId } from "./task-registry.process-state-Cb_kvrmQ.mjs";
import { C as taskRegistryLog, S as taskProgressBatches, w as tasks } from "./task-registry-state-Cibd1d5c.mjs";
import { a as isSubagentRunLive, j as subagentRuns } from "./subagent-run-liveness-9vTRtoqd.mjs";
import { a as getLatestLiveSubagentRunByChildSessionKey } from "./subagent-registry-read-C2SIiLpb.mjs";
import { a as prepareTaskBackingRead, i as hasResidentTaskBacking } from "./task-backing-authority-CIHk-jEg.mjs";
import { a as formatTaskStatusTitleText } from "./task-status-D1-umRs5.mjs";
import { r as canDeliverToRequesterOrigin, s as resolveTaskDeliveryOwner } from "./task-notification-routing-D8Ldlzcz.mjs";
import { t as shouldAutoDeliverTaskStateChange } from "./task-notification-policy-7pB-BxLh.mjs";
import { i as loadTaskRegistryDeliveryRuntime } from "./task-registry-runtime-loaders-DtafDo1W.mjs";
import { createHash } from "node:crypto";
//#region src/tasks/task-progress-batch.ts
function resolveYieldedTaskProgress(task, runId, hasBacking, readFlow) {
	if (task.runtime !== "subagent" || task.notifyPolicy === "silent") return;
	const backing = readTaskBackingInstance(task.detail);
	const entry = subagentRuns.get(runId);
	const wake = entry?.requesterSettleWake;
	const operationId = wake?.progressOperationId;
	if (backing?.runtime !== "subagent" || !entry || entry.generation !== backing.generation || operationId && !entry.completionRequesterSessionId || (entry.taskRunId ?? entry.runId) !== task.runId || entry.childSessionKey !== task.childSessionKey || entry.requesterSessionKey !== task.ownerKey || entry.requesterAgentId !== void 0 && entry.requesterAgentId !== task.requesterAgentId || entry.killIntent || entry.killReconciliation || entry.execution.suppressSessionEffects || entry.suppressAnnounceReason || entry.requesterTurnRunId || entry.collect === true || wake?.requesterYieldBatch !== true || wake.status !== "pending" && wake.status !== "dispatching" || !operationId && (!shouldAutoDeliverTaskStateChange(task) || wake.status !== "pending" || entry.execution.status === "terminal" && entry.pauseReason !== "sessions_yield") || wake.rearmGeneration === void 0 || !wake.batchRunIds?.includes(runId) || !hasBacking(task)) return;
	const owner = resolveTaskDeliveryOwner(task, readFlow);
	if (!owner.sessionKey || operationId && !owner.agentId || !canDeliverToRequesterOrigin(owner.requesterOrigin)) return;
	return {
		task,
		entry,
		owner,
		key: JSON.stringify([
			owner.sessionKey,
			owner.agentId,
			owner.requesterOrigin,
			...operationId ? [operationId] : [wake.rearmGeneration, wake.batchRunIds]
		]),
		generation: backing.generation,
		operationId,
		requesterSessionId: entry.completionRequesterSessionId
	};
}
function prepareProgressBatch(key, batch, read) {
	if (taskProgressBatches.get(key) !== batch || batch.abortController.signal.aborted || isGatewayRestartDraining() || batch.lifecycleGeneration !== getAgentRunLifecycleGeneration() || !batch.operationId && resolveProjectedAgentRunProgressState({
		sessionKeys: [batch.requesterSessionKey],
		agentId: batch.requesterAgentId
	})) return;
	const rows = [];
	let awaitingTerminal = false;
	let hasPendingWake = false;
	for (const [taskId, member] of batch.members) {
		const task = read.getTaskById(taskId);
		const backing = task ? readTaskBackingInstance(task.detail) : void 0;
		if (!task || task.runtime !== "subagent" || task.notifyPolicy === "silent" || task.runId !== member.taskRunId || task.ownerKey !== batch.requesterSessionKey || backing?.runtime !== "subagent" || backing.generation !== member.generation || task.childSessionKey !== member.childSessionKey) continue;
		const owner = resolveTaskDeliveryOwner(task, read.getTaskFlowById);
		if (owner.agentId !== batch.requesterAgentId || owner.requesterOrigin && JSON.stringify(owner.requesterOrigin) !== JSON.stringify(batch.origin)) continue;
		const latest = getLatestLiveSubagentRunByChildSessionKey(member.childSessionKey);
		if (latest && (latest.taskRunId ?? latest.runId) === task.runId && (latest.runId !== member.runId || latest.generation !== member.generation)) continue;
		const entry = subagentRuns.get(member.runId);
		if (entry && (entry.generation !== member.generation || entry.requesterSessionKey !== batch.requesterSessionKey || entry.completionRequesterSessionId !== batch.requesterSessionId || entry.collect || entry.requesterSettleWake?.progressOperationId && entry.requesterSettleWake.progressOperationId !== batch.operationId)) continue;
		if (resolveYieldedTaskProgress(task, member.runId, read.hasAuthoritativeTaskBacking, read.getTaskFlowById)?.key === key) {
			hasPendingWake = true;
			rows.push({
				task,
				entry: member
			});
		} else if (batch.operationId && isTerminalTaskStatus(task.status)) {
			const wake = entry?.requesterSettleWake;
			hasPendingWake ||= wake?.progressOperationId === batch.operationId && wake.batchRunIds?.includes(member.runId) === true;
			rows.push({
				task,
				entry: member
			});
		} else if (batch.operationId && (entry?.killIntent || entry?.killReconciliation)) awaitingTerminal = true;
	}
	if (rows.length === 0 && !awaitingTerminal) return;
	rows.sort((left, right) => left.task.createdAt - right.task.createdAt || left.task.taskId.localeCompare(right.task.taskId));
	return {
		owner: {
			sessionKey: batch.requesterSessionKey,
			agentId: batch.requesterAgentId,
			requesterOrigin: batch.origin
		},
		origin: batch.origin,
		sessionKey: batch.requesterSessionKey,
		rows,
		complete: Boolean(batch.operationId) && !awaitingTerminal && !hasPendingWake && !batch.requesterContinuation?.isCurrent() && rows.every(({ task }) => isTerminalTaskStatus(task.status)),
		membersKey: JSON.stringify(rows.map(({ task, entry }) => [
			task.taskId,
			task.status,
			entry.runId,
			entry.generation
		]))
	};
}
//#endregion
//#region src/tasks/task-registry-progress.ts
const YIELDED_PROGRESS_COALESCE_MS = 15e3;
const MAX_PROGRESS_BATCHES = 128;
const MAX_PENDING_PROGRESS_ITEMS = 128;
const loadProgressPresentation = createLazyPromise(() => import("./task-progress-presentation-DLb4IXMy.mjs"));
const loadProgressRuntime = createLazyPromise(() => import("./task-registry-progress-runtime-tJocTVAT.mjs"));
const residentProgressRead = {
	getTaskById: (taskId) => tasks.get(taskId),
	getTaskFlowById: readResidentTaskFlow,
	hasAuthoritativeTaskBacking: hasResidentTaskBacking
};
/** Detached presentation consumes prepared public activity, never raw child prose or results. */
function scheduleYieldedSubagentTaskProgress(task, event, prepared) {
	if (event.stream !== "item" && event.stream !== "tool" && event.stream !== "approval" && event.stream !== "execution") return;
	enqueueYieldedTaskProgress(task, event.runId, prepared);
}
/** The handoff itself may be the last event before a child's long-running tool returns. */
function scheduleYieldedSubagentRunProgress(entry) {
	for (const task of getTasksByRunId(entry.taskRunId ?? entry.runId)) enqueueYieldedTaskProgress(task, entry.runId);
}
function enqueueYieldedTaskProgress(task, runId, prepared) {
	const progress = resolveYieldedTaskProgress(task, runId, hasResidentTaskBacking, readResidentTaskFlow);
	if (!progress) return;
	let batch = taskProgressBatches.get(progress.key);
	if (!batch) {
		if (taskProgressBatches.size >= MAX_PROGRESS_BATCHES) {
			taskRegistryLog.warn("Background progress queue is full; activity remains in Tasks");
			return;
		}
		batch = {
			lifecycleGeneration: getAgentRunLifecycleGeneration(),
			requesterSessionKey: progress.entry.requesterSessionKey,
			requesterAgentId: progress.owner.agentId,
			requesterSessionId: progress.requesterSessionId,
			operationId: progress.operationId,
			origin: { ...progress.owner.requesterOrigin },
			abortController: new AbortController(),
			members: /* @__PURE__ */ new Map(),
			pendingItems: /* @__PURE__ */ new Map(),
			revision: 0
		};
		taskProgressBatches.set(progress.key, batch);
	}
	if (!batch.members.has(task.taskId) && batch.members.size >= 32) for (const [taskId] of batch.members) {
		const previous = tasks.get(taskId);
		if (!previous || isTerminalTaskStatus(previous.status)) {
			batch.members.delete(taskId);
			if (batch.members.size < 32) break;
		}
	}
	if (!batch.members.has(task.taskId) && batch.members.size >= 32) return;
	batch.members.set(task.taskId, {
		runId,
		taskRunId: progress.entry.taskRunId ?? progress.entry.runId,
		generation: progress.generation,
		childSessionKey: progress.entry.childSessionKey,
		progressOrigin: progress.entry.progressOrigin
	});
	if (prepared && progress.operationId) {
		const itemKey = JSON.stringify([
			task.taskId,
			progress.generation,
			prepared.itemId
		]);
		batch.pendingItems.delete(itemKey);
		batch.pendingItems.set(itemKey, {
			item: prepared,
			source: {
				taskId: task.taskId,
				runId,
				generation: progress.generation,
				label: formatTaskStatusTitleText(task.label, "Subagent")
			}
		});
		trimPendingItems(batch);
	}
	batch.revision += 1;
	scheduleProgressBatch(progress.key, batch);
}
function trimPendingItems(batch) {
	while (batch.pendingItems.size > MAX_PENDING_PROGRESS_ITEMS) {
		const oldest = batch.pendingItems.keys().next().value;
		if (oldest === void 0) break;
		batch.pendingItems.delete(oldest);
	}
}
async function getTaskProgressBatchesForRuns(entries) {
	const read = await prepareTaskBackingRead();
	if (!read) return [];
	const generations = new Map(entries.map((entry) => [entry.runId, entry.generation]));
	for (const entry of entries) scheduleYieldedSubagentRunProgress(entry);
	return [...taskProgressBatches].flatMap(([key, batch]) => batch.operationId && [...batch.members.values()].some((member) => generations.get(member.runId) === member.generation) && prepareProgressBatch(key, batch, read) ? [{
		key,
		batch
	}] : []);
}
function recordRequesterTaskProgress(key, batch, update) {
	const requester = batch.requesterContinuation;
	if (!requester || !requester.isCurrent() || !prepareProgressBatch(key, batch, residentProgressRead)) return;
	if (update.kind === "plan") batch.pendingPlan = update.plan;
	else {
		const itemId = `requester:${requester.runId}:${update.item.itemId}`;
		batch.pendingItems.delete(itemId);
		batch.pendingItems.set(itemId, { item: {
			...update.item,
			itemId,
			...update.item.toolCallId ? { toolCallId: `requester:${requester.runId}:${update.item.toolCallId}` } : {}
		} });
		trimPendingItems(batch);
	}
	batch.revision += 1;
	scheduleProgressBatch(key, batch);
}
async function flushTaskProgressBatch(key, batch) {
	clearTimeout(batch.timer);
	batch.timer = void 0;
	await batch.publication;
	if (taskProgressBatches.get(key) === batch) {
		clearTimeout(batch.timer);
		batch.timer = void 0;
		await publishProgressBatch(key, batch);
	}
}
/** A confirmed requester final retires only its adopted card, after all edits settle. */
async function completeTaskProgressBatch(key, batch) {
	const continuation = batch.requesterContinuation;
	const { operationId, requesterSessionId, requesterAgentId } = batch;
	const read = await prepareTaskBackingRead();
	const current = read && prepareProgressBatch(key, batch, read);
	if (!read || !current || !continuation?.isCurrent() || !operationId || !requesterSessionId || !requesterAgentId || current.rows.length !== batch.members.size || !current.rows.every(({ task }) => isTerminalTaskStatus(task.status))) return false;
	batch.finalReplyDelivered = true;
	clearTimeout(batch.timer);
	const assertCurrent = () => {
		const fresh = prepareProgressBatch(key, batch, read);
		if (!fresh || fresh.membersKey !== current.membersKey || batch.requesterContinuation !== continuation || !continuation.isCurrent()) throw new Error("Completed task progress owner was superseded");
	};
	try {
		await batch.publication;
		await runWithGatewayDetachedWorkContinuation(async () => {
			const { deleteTaskProgressMessage } = await loadProgressRuntime();
			assertCurrent();
			const outcome = await deleteTaskProgressMessage({
				operationId,
				requesterSessionId,
				sessionKey: batch.requesterSessionKey,
				agentId: requesterAgentId,
				origin: current.origin,
				signal: AbortSignal.any([batch.abortController.signal, getGatewayRestartDrainSignal()]),
				assertCurrent
			});
			if (outcome !== "sent") taskRegistryLog.debug("Completed task progress could not be removed", { outcome });
		}, "tasks:progress-cleanup");
	} finally {
		retireProgressBatch(key, batch);
	}
	return true;
}
function scheduleProgressBatch(key, batch, immediate = false) {
	if (batch.finalReplyDelivered || batch.publication || batch.timer && !immediate) return;
	clearTimeout(batch.timer);
	batch.timer = setTimeout(() => {
		batch.timer = void 0;
		publishProgressBatch(key, batch);
	}, immediate ? 0 : YIELDED_PROGRESS_COALESCE_MS);
	batch.timer.unref?.();
}
function retireProgressBatch(key, batch) {
	if (taskProgressBatches.get(key) !== batch) return;
	taskProgressBatches.delete(key);
	clearTimeout(batch.timer);
	batch.abortController.abort();
}
function reconcileTaskProgressBatches(event) {
	const taskId = event?.kind === "upserted" ? event.task.taskId : event?.kind === "deleted" ? event.taskId : void 0;
	for (const [key, batch] of taskProgressBatches) {
		if (taskId && !batch.members.has(taskId)) continue;
		const current = prepareProgressBatch(key, batch, residentProgressRead);
		if (!current) retireProgressBatch(key, batch);
		else if (event || current.complete) {
			if (event) batch.revision += 1;
			scheduleProgressBatch(key, batch, current.complete || event?.kind === "upserted" && isTerminalTaskStatus(event.task.status));
		}
	}
	if (event?.kind === "upserted") {
		const task = tasks.get(event.task.taskId);
		if (task?.runtime === "subagent" && task.childSessionKey) {
			const entry = getLatestLiveSubagentRunByChildSessionKey(task.childSessionKey);
			if (entry) enqueueYieldedTaskProgress(task, entry.runId);
		}
	} else if (event?.kind === "restored") {
		for (const entry of subagentRuns.values()) if (entry.requesterSettleWake?.requesterYieldBatch) scheduleYieldedSubagentRunProgress(entry);
	}
}
function retireTaskProgressForSession(mutation) {
	for (const [key, batch] of taskProgressBatches) {
		if (batch.requesterAgentId && batch.requesterAgentId !== mutation.agentId) continue;
		if (mutation.previous.sessionKeys.includes(batch.requesterSessionKey) || mutation.kind !== "delete" && mutation.current.sessionKeys.includes(batch.requesterSessionKey)) retireProgressBatch(key, batch);
	}
}
async function ensureProgressTyping(key, batch) {
	if (batch.typingStarted || batch.abortController.signal.aborted) return;
	const read = await prepareTaskBackingRead();
	const current = read && prepareProgressBatch(key, batch, read);
	const requesterSessionId = batch.requesterSessionId;
	const operationId = batch.operationId;
	if (!current || !operationId || !requesterSessionId || !current.owner.agentId || !current.origin.channel || !getChannelPlugin(current.origin.channel)?.heartbeat?.sendTypingGuarded) return;
	try {
		const { startTaskProgressTyping } = await loadProgressRuntime();
		if (!read || !prepareProgressBatch(key, batch, read)) return;
		batch.typingStarted = startTaskProgressTyping({
			operationId,
			requesterSessionId,
			agentId: current.owner.agentId,
			sessionKey: current.sessionKey,
			origin: current.origin,
			signal: AbortSignal.any([batch.abortController.signal, getGatewayRestartDrainSignal()]),
			prepareCurrent: async () => {
				const currentRead = await prepareTaskBackingRead();
				if (!currentRead) throw new Error("Task progress typing owner retired");
				return () => {
					if (!prepareProgressBatch(key, batch, currentRead)) throw new Error("Task progress typing owner retired");
				};
			},
			isExecutionActive: () => {
				if (batch.requesterContinuation?.isCurrent()) return true;
				for (const member of batch.members.values()) {
					const entry = subagentRuns.get(member.runId);
					if (entry?.generation === member.generation && isSubagentRunLive(entry)) return true;
				}
				return false;
			},
			onStopped: () => {
				batch.typingStarted = false;
			},
			onError: (error) => {
				taskRegistryLog.debug("Background typing stopped", { error });
			}
		});
	} catch (error) {
		taskRegistryLog.debug("Background typing was unavailable", { error });
	}
}
function publishProgressBatch(key, batch) {
	if (batch.finalReplyDelivered) return batch.publication ?? Promise.resolve();
	if (batch.publication) return batch.publication;
	const revision = batch.revision;
	const settlePublication = async () => {
		let reschedule = false;
		try {
			reschedule = await finalizeProgressBatch(key, batch, revision);
		} finally {
			if (batch.publication === publication) {
				batch.publication = void 0;
				if (reschedule && taskProgressBatches.get(key) === batch) scheduleProgressBatch(key, batch);
			}
		}
	};
	const publication = runProgressPublication(key, batch).then(settlePublication, async (error) => {
		await settlePublication();
		throw error;
	});
	batch.publication = publication;
	return publication;
}
async function finalizeProgressBatch(key, batch, revision) {
	try {
		if (taskProgressBatches.get(key) !== batch || batch.finalReplyDelivered) return false;
		const read = await prepareTaskBackingRead();
		if (!read) return true;
		const current = prepareProgressBatch(key, batch, read);
		if (!current || (!batch.operationId || current.complete) && batch.revision === revision) {
			retireProgressBatch(key, batch);
			return false;
		}
		return batch.revision !== revision;
	} catch (error) {
		retireProgressBatch(key, batch);
		taskRegistryLog.debug("Progress owner could not settle", { error: formatErrorMessage(error) });
		return false;
	}
}
async function runProgressPublication(key, batch) {
	try {
		if (batch.operationId && getGlobalHookRunner()?.hasHooks("reply_payload_sending")) return;
		await runWithGatewayDetachedWorkContinuation(async () => {
			const read = await prepareTaskBackingRead();
			const fresh = read && prepareProgressBatch(key, batch, read);
			if (!read || !fresh || fresh.rows.length === 0) return null;
			const assertCurrent = () => {
				const current = prepareProgressBatch(key, batch, read);
				if (batch.finalReplyDelivered || !current || current.membersKey !== fresh.membersKey) throw new Error("Background progress was superseded before delivery");
			};
			const progressRuntime = batch.operationId ? await loadProgressRuntime() : void 0;
			const identity = batch.operationId && batch.requesterSessionId && fresh.owner.agentId ? {
				operationId: batch.operationId,
				requesterSessionId: batch.requesterSessionId,
				sessionKey: fresh.sessionKey,
				agentId: fresh.owner.agentId
			} : void 0;
			assertCurrent();
			const initialSnapshot = identity && progressRuntime?.readTaskProgressSnapshot(identity);
			if (batch.operationId && !initialSnapshot) return null;
			const capturedItems = [...batch.pendingItems].filter(([, { source }]) => {
				if (!source) return true;
				return fresh.rows.some(({ task, entry }) => task.taskId === source.taskId && entry.runId === source.runId && entry.generation === source.generation);
			});
			const capturedPlan = batch.pendingPlan;
			const { prepareProgressContent } = await loadProgressPresentation();
			const presentation = await prepareProgressContent(key, fresh.origin, fresh.rows, initialSnapshot, {
				items: capturedItems.map(([, update]) => update),
				plan: capturedPlan
			});
			if (!presentation?.content) return null;
			assertCurrent();
			if (identity && progressRuntime) {
				const origin = fresh.rows[0]?.entry.progressOrigin;
				const publication = await progressRuntime.publishTaskProgressMessage({
					...identity,
					origin: fresh.origin,
					sourceMessageId: origin?.messageId,
					sourceChannelId: origin?.channelId,
					content: presentation.content,
					previousContent: batch.lastPublishedContent,
					snapshot: presentation.snapshot,
					signal: AbortSignal.any([batch.abortController.signal, getGatewayRestartDrainSignal()]),
					assertCurrent
				});
				if (publication !== "sent" && publication !== "unchanged") return null;
			} else {
				const { sendMessage } = await loadTaskRegistryDeliveryRuntime();
				assertCurrent();
				const idempotencyKey = `task-progress:${createHash("sha256").update(key).digest("hex")}:${Date.now()}`;
				await sendMessage({
					channel: fresh.origin.channel,
					to: fresh.origin.to ?? "",
					accountId: fresh.origin.accountId,
					threadId: fresh.origin.threadId,
					content: presentation.content,
					agentId: fresh.owner.agentId,
					idempotencyKey,
					mirror: {
						sessionKey: fresh.sessionKey,
						agentId: fresh.owner.agentId,
						idempotencyKey
					},
					skipQueue: true,
					gatewayOwnedDelivery: true,
					abortSignal: AbortSignal.any([batch.abortController.signal, getGatewayRestartDrainSignal()]),
					assertDirectAdapterHandoff: assertCurrent,
					onPlatformSendDispatch: async () => assertCurrent()
				});
			}
			batch.lastPublishedContent = presentation.content;
			for (const [itemId, update] of capturedItems) if (batch.pendingItems.get(itemId) === update) batch.pendingItems.delete(itemId);
			if (batch.pendingPlan === capturedPlan) batch.pendingPlan = void 0;
			await ensureProgressTyping(key, batch);
			return null;
		}, "tasks:progress");
	} catch (error) {
		taskRegistryLog.debug("Background progress update could not finish; task completion is unaffected", { error: formatErrorMessage(error) });
	}
}
//#endregion
export { recordRequesterTaskProgress as a, scheduleYieldedSubagentTaskProgress as c, reconcileTaskProgressBatches as i, flushTaskProgressBatch as n, retireTaskProgressForSession as o, getTaskProgressBatchesForRuns as r, scheduleYieldedSubagentRunProgress as s, completeTaskProgressBatch as t };
