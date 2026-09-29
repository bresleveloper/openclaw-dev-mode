import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { s as getGatewayRestartDrainSignal } from "./gateway-work-admission-CHv_0noy.mjs";
import { d as getAgentRunLifecycleGeneration } from "./agent-run-registry-DO6Dg2r0.mjs";
import { f as onAgentEvent } from "./agent-events-BOSJcayE.mjs";
import { E as readTaskBackingInstance, q as sameTaskRunScope } from "./task-registry.store.kernel-BuNI8UuR.mjs";
import { C as taskRegistryLog, S as taskProgressBatches } from "./task-registry-state-Cibd1d5c.mjs";
import { j as subagentRuns } from "./subagent-run-liveness-9vTRtoqd.mjs";
import { a as getLatestLiveSubagentRunByChildSessionKey } from "./subagent-registry-read-C2SIiLpb.mjs";
import { a as prepareTaskBackingRead } from "./task-backing-authority-CIHk-jEg.mjs";
import { s as resolveTaskDeliveryOwner } from "./task-notification-routing-D910r5az.mjs";
import { a as recordRequesterTaskProgress, n as flushTaskProgressBatch, r as getTaskProgressBatchesForRuns, s as scheduleYieldedSubagentRunProgress, t as completeTaskProgressBatch } from "./task-registry-progress-Dd95X-K3.mjs";
import { createHash } from "node:crypto";
//#region src/tasks/task-progress-requester.ts
function isCurrentContinuation(key, batch, continuation) {
	return taskProgressBatches.get(key) === batch && batch.requesterContinuation === continuation && batch.requesterSessionId === continuation.requesterSessionId && batch.lifecycleGeneration === getAgentRunLifecycleGeneration() && !batch.abortController.signal.aborted && continuation.isCurrent();
}
function logProgressFailure(error) {
	taskRegistryLog.debug("Requester progress update could not finish; task completion is unaffected", { error: formatErrorMessage(error) });
}
/** Observe the admitted requester turn without changing its delivery outcome. */
async function withTaskProgressRequesterContinuation(params, run) {
	let batches;
	try {
		batches = await getTaskProgressBatchesForRuns(params.entries);
	} catch (error) {
		logProgressFailure(error);
		return await run();
	}
	if (batches.length === 0) return await run();
	const bindings = [];
	let unsubscribe;
	try {
		const [{ normalizeAgentPlanSteps }, { readPreparedTaskActivityItem }] = await Promise.all([import("./streaming-D5RvSnYg.mjs"), import("./task-registry-activity-DDI-ETGI.mjs")]);
		for (const { key, batch } of batches) {
			if (taskProgressBatches.get(key) !== batch || batch.requesterSessionId !== params.requesterSessionId || batch.lifecycleGeneration !== getAgentRunLifecycleGeneration() || batch.abortController.signal.aborted || !params.isCurrent()) continue;
			const continuation = {
				runId: params.runId,
				requesterSessionId: params.requesterSessionId,
				isCurrent: params.isCurrent
			};
			batch.requesterContinuation = continuation;
			bindings.push({
				key,
				batch,
				continuation
			});
		}
		if (bindings.length > 0) unsubscribe = onAgentEvent((event) => {
			if (event.runId !== params.runId || event.stream !== "item" && event.stream !== "plan") return;
			try {
				const item = event.stream === "item" ? readPreparedTaskActivityItem(event) : void 0;
				const plan = event.stream === "plan" && event.data.phase === "update" ? {
					steps: normalizeAgentPlanSteps(event.data.steps),
					explanation: typeof event.data.explanation === "string" ? event.data.explanation : void 0,
					...event.data.explanationFormat === "plain" ? { explanationFormat: "plain" } : {}
				} : void 0;
				if (!item && !plan) return;
				for (const { key, batch, continuation } of bindings) {
					if (!isCurrentContinuation(key, batch, continuation)) continue;
					if (item) recordRequesterTaskProgress(key, batch, {
						kind: "item",
						item
					});
					else if (plan) recordRequesterTaskProgress(key, batch, {
						kind: "plan",
						plan
					});
				}
			} catch (error) {
				logProgressFailure(error);
			}
		});
	} catch (error) {
		logProgressFailure(error);
	}
	let finalDelivered = false;
	try {
		const result = await run();
		finalDelivered = result.delivered && result.requesterVisibleFinalDelivered === true;
		return result;
	} finally {
		unsubscribe?.();
		await Promise.all(bindings.map(async ({ key, batch, continuation }) => {
			if (batch.requesterContinuation !== continuation) return;
			try {
				if (!finalDelivered || !await completeTaskProgressBatch(key, batch)) await flushTaskProgressBatch(key, batch);
			} catch (error) {
				logProgressFailure(error);
			} finally {
				if (batch.requesterContinuation === continuation) batch.requesterContinuation = void 0;
			}
		}));
	}
}
/** A further yield inherits only the receipt attached to this exact resumed turn. */
function captureTaskProgressContinuationForRequesterTurn(params) {
	const requesterSessionKey = params.requesterSessionKey.trim();
	const requesterTurnRunId = params.requesterTurnRunId.trim();
	if (!requesterSessionKey || !requesterTurnRunId) return;
	try {
		for (const [key, batch] of taskProgressBatches) {
			const continuation = batch.requesterContinuation;
			if (batch.operationId && batch.requesterSessionKey === requesterSessionKey && (params.requesterAgentId === void 0 || batch.requesterAgentId === params.requesterAgentId) && continuation?.runId === requesterTurnRunId && isCurrentContinuation(key, batch, continuation)) return { operationId: batch.operationId };
		}
	} catch (error) {
		logProgressFailure(error);
	}
}
/** A turn-scoped capability transfers only a positively identified existing card. */
async function createTaskProgressContinuation(params) {
	try {
		const read = await prepareTaskBackingRead();
		return read ? createPreparedTaskProgressContinuation(params, read) : void 0;
	} catch (error) {
		logProgressFailure(error);
		return;
	}
}
function createPreparedTaskProgressContinuation(params, read) {
	const accepted = params.acceptedSessionSpawns.map((spawn) => ({
		spawn,
		entry: getLatestLiveSubagentRunByChildSessionKey(spawn.childSessionKey)
	}));
	if (accepted.some(({ spawn, entry }) => !entry || (entry.taskRunId ?? entry.runId) !== spawn.runId)) return;
	const rows = accepted.flatMap(({ spawn, entry }) => {
		const task = entry && !entry.collect && !entry.suppressAnnounceReason && !entry.execution.suppressSessionEffects ? read.getTasksByRunId(entry.taskRunId ?? entry.runId).find((candidate) => candidate.runtime === "subagent" && candidate.childSessionKey === spawn.childSessionKey && candidate.ownerKey === params.requesterSessionKey && candidate.notifyPolicy !== "silent" && readTaskBackingInstance(candidate.detail)?.generation === entry.generation && read.hasAuthoritativeTaskBacking(candidate)) : void 0;
		return entry && task && entry.generation !== void 0 ? [{
			entry,
			task,
			generation: entry.generation,
			wakeGeneration: entry.requesterSettleWake?.rearmGeneration
		}] : [];
	});
	const first = rows[0];
	const owner = first ? resolveTaskDeliveryOwner(first.task, read.getTaskFlowById) : void 0;
	const requesterSessionId = first?.entry.completionRequesterSessionId;
	if (!first || !owner?.agentId || !owner.requesterOrigin || !requesterSessionId || rows.length > 32) return;
	const agentId = owner.agentId;
	const origin = { ...owner.requesterOrigin };
	const audience = JSON.stringify([
		owner.agentId,
		owner.sessionKey,
		origin
	]);
	const lifecycleGeneration = getAgentRunLifecycleGeneration();
	const controller = new AbortController();
	const signal = AbortSignal.any([controller.signal, getGatewayRestartDrainSignal()]);
	let used = false;
	const assertCurrent = () => {
		signal.throwIfAborted();
		read.assertCurrent();
		if (getAgentRunLifecycleGeneration() !== lifecycleGeneration) throw new Error("Progress handoff lifecycle was replaced");
		for (const row of rows) {
			const entry = subagentRuns.get(row.entry.runId);
			const task = read.getTaskById(row.task.taskId);
			const currentOwner = task ? resolveTaskDeliveryOwner(task, read.getTaskFlowById) : void 0;
			if (entry !== row.entry || entry.generation !== row.generation || entry.requesterSessionKey !== params.requesterSessionKey || entry.completionRequesterSessionId !== requesterSessionId || entry.killIntent || entry.killReconciliation || entry.execution.suppressSessionEffects || entry.suppressAnnounceReason || entry.collect || !task || !sameTaskRunScope(task, row.task) || readTaskBackingInstance(task.detail)?.generation !== row.generation || task.notifyPolicy === "silent" || !read.hasAuthoritativeTaskBacking(task) || JSON.stringify([
				currentOwner?.agentId,
				currentOwner?.sessionKey,
				currentOwner?.requesterOrigin
			]) !== audience || params.requesterAgentId && currentOwner?.agentId !== params.requesterAgentId || (params.onAdopted ? entry.requesterTurnRunId !== params.requesterTurnRunId || entry.requesterTurnYielded !== true : entry.requesterSettleWake?.requesterYieldBatch !== true || entry.requesterSettleWake.status !== "pending" || entry.requesterSettleWake.rearmGeneration !== row.wakeGeneration)) throw new Error("Progress handoff owner was replaced");
		}
	};
	try {
		assertCurrent();
	} catch {
		return;
	}
	return {
		adopt: async (receipt) => {
			if (used || signal.aborted) return false;
			used = true;
			try {
				const { adoptTaskProgressMessage } = await import("./task-registry-progress-runtime-B4L5Z2MT.mjs");
				assertCurrent();
				const operationId = `task-progress:${createHash("sha256").update(JSON.stringify([
					requesterSessionId,
					params.requesterTurnRunId,
					receipt.messageId
				])).digest("hex")}`;
				if (!await adoptTaskProgressMessage({
					operationId,
					requesterSessionId,
					sessionKey: params.requesterSessionKey,
					agentId,
					origin,
					receipt: structuredClone(receipt),
					signal,
					assertCurrent
				})) return false;
				assertCurrent();
				if (params.onAdopted) params.onAdopted({ operationId });
				else {
					const { attachRequesterProgressPresentation } = await import("./subagent-registry-WbeCeGgw.mjs");
					assertCurrent();
					attachRequesterProgressPresentation({
						operationId,
						members: rows.map((row) => {
							if (row.wakeGeneration === void 0) throw new Error("Progress handoff has no yielded batch");
							return {
								runId: row.entry.runId,
								generation: row.generation,
								rearmGeneration: row.wakeGeneration
							};
						}),
						assertCurrent
					});
					for (const row of rows) scheduleYieldedSubagentRunProgress(row.entry);
				}
				return true;
			} catch (error) {
				taskRegistryLog.debug("Existing progress card could not transfer", { error: formatErrorMessage(error) });
				return false;
			}
		},
		close: () => {
			controller.abort();
		}
	};
}
//#endregion
export { createTaskProgressContinuation as n, withTaskProgressRequesterContinuation as r, captureTaskProgressContinuationForRequesterTurn as t };
