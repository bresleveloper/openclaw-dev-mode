import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { n as createSqliteLifecycleAggregateError } from "./sqlite-coordinator-z2lO0ops.mjs";
import { E as readTaskBackingInstance, O as selectCurrentCanonicalTaskBacking, T as readManagedTaskBacking, b as createAcpTaskBackingDetail, w as hasAuthoritativeTaskBackingFromRecords, x as createManagedTaskBackingDetail } from "./task-registry.store.kernel-BuNI8UuR.mjs";
import { d as getTaskFlowById, g as prepareTaskFlowRegistryRead, p as getTaskMirroredFlowIds, y as readResidentTaskFlow } from "./task-flow-runtime-internal-DFSz6gyF.mjs";
import { o as ensureTaskRegistryReady, w as tasks, x as taskIdsByRelatedSessionKey } from "./task-registry-state-Cibd1d5c.mjs";
import { n as prepareTaskRegistryRead } from "./task-registry-read-BpKCOEEj.mjs";
//#region src/tasks/task-backing-authority.ts
/** Side effects use both admitted projections; their synchronous guards never reopen storage. */
async function prepareTaskBackingRead() {
	const [taskRead, flowRead] = await Promise.allSettled([prepareTaskRegistryRead(), prepareTaskFlowRegistryRead()]);
	const errors = [taskRead, flowRead].flatMap((result) => result.status === "rejected" ? [result.reason] : []);
	if (errors.length === 1) throw errors[0];
	if (errors.length > 1) throw createSqliteLifecycleAggregateError(errors, "Task backing read preparation failed", errors[0]);
	if (taskRead.status !== "fulfilled" || flowRead.status !== "fulfilled" || !taskRead.value || !flowRead.value) return;
	const task = taskRead.value;
	const flow = flowRead.value;
	const assertCurrent = () => {
		task.assertCurrent();
		flow.assertCurrent();
	};
	assertCurrent();
	return {
		assertCurrent,
		getTasksByRunId: task.getTasksByRunId,
		getTaskById(taskId) {
			assertCurrent();
			if (!task.isTaskCurrent(taskId)) return;
			const record = task.getTaskById(taskId);
			return record?.parentFlowId && !flow.isTaskFlowCurrent(record.parentFlowId) ? void 0 : record;
		},
		getTaskFlowById: flow.getTaskFlowById,
		hasAuthoritativeTaskBacking(record) {
			assertCurrent();
			if (!task.isTaskCurrent(record.taskId) || record.parentFlowId && !flow.isTaskFlowCurrent(record.parentFlowId)) return false;
			return hasAuthoritativeTaskBackingFromRecords(record, {
				isManagedFlow: (flowId) => flow.getTaskFlowById(flowId)?.syncMode === "managed",
				resolveCurrentCanonicalBacking: (scope) => {
					if (!task.isChildSessionCurrent(scope.childSessionKey)) return;
					const candidates = task.listTaskRecordsForChildSessionKey(scope.childSessionKey);
					if (candidates.some((candidate) => candidate.parentFlowId && !flow.isTaskFlowCurrent(candidate.parentFlowId))) return;
					return selectCurrentCanonicalTaskBacking({
						...scope,
						candidates,
						isTaskMirroredFlow: (flowId) => flow.getTaskFlowById(flowId)?.syncMode === "task_mirrored"
					});
				}
			});
		}
	};
}
function resolveCurrentCanonicalBacking(params) {
	ensureTaskRegistryReady();
	const candidates = [...taskIdsByRelatedSessionKey.get(params.childSessionKey) ?? []].flatMap((taskId) => {
		const task = tasks.get(taskId);
		return task ? [task] : [];
	});
	let mirroredFlowIds;
	return selectCurrentCanonicalTaskBacking({
		...params,
		candidates,
		isTaskMirroredFlow: (flowId) => {
			mirroredFlowIds ??= getTaskMirroredFlowIds(candidates.flatMap((task) => task.parentFlowId ? [task.parentFlowId.trim()] : []));
			return mirroredFlowIds.has(flowId);
		}
	});
}
function createNextAcpTaskBackingDetail(params) {
	ensureTaskRegistryReady();
	const candidateIds = taskIdsByRelatedSessionKey.get(params.childSessionKey) ?? [];
	let mirroredFlowIds;
	const isCanonicalBackingTask = (task) => {
		const firstFlowId = task.parentFlowId?.trim();
		if (!firstFlowId) return false;
		mirroredFlowIds ??= getTaskMirroredFlowIds((function* () {
			yield firstFlowId;
			for (const taskId of candidateIds) {
				const flowId = tasks.get(taskId)?.parentFlowId?.trim();
				if (flowId) yield flowId;
			}
		})());
		return mirroredFlowIds.has(firstFlowId);
	};
	let generation = 0;
	let existingGeneration;
	for (const taskId of candidateIds) {
		const task = tasks.get(taskId);
		const instance = task ? readTaskBackingInstance(task.detail) : void 0;
		if (task && (normalizeOptionalString(task.ownerKey) === params.childSessionKey || normalizeOptionalString(task.childSessionKey) === params.childSessionKey) && instance?.runtime === "acp" && isCanonicalBackingTask(task)) {
			generation = Math.max(generation, instance.generation);
			if (instance.instanceId === params.instanceId) existingGeneration = Math.max(existingGeneration ?? 0, instance.generation);
		}
	}
	return createAcpTaskBackingDetail(params.instanceId, existingGeneration ?? generation + 1);
}
function resolveManagedTaskBackingDetail(params) {
	const current = resolveCurrentCanonicalBacking(params);
	return createManagedTaskBackingDetail(current);
}
function getManagedTaskBackingInstance(task) {
	const flowId = task.parentFlowId?.trim();
	return flowId && getTaskFlowById(flowId)?.syncMode === "managed" ? readManagedTaskBacking(task.detail)?.instance : void 0;
}
/** A managed projection may control a child only while its exact canonical instance is current. */
function hasAuthoritativeTaskBacking(task) {
	return hasAuthoritativeTaskBackingFromRecords(task, {
		isManagedFlow: (flowId) => getTaskFlowById(flowId)?.syncMode === "managed",
		resolveCurrentCanonicalBacking
	});
}
/** Presentation ingestion consumes recorded facts; durable mutations recheck the canonical rows. */
function hasResidentTaskBacking(task) {
	return hasAuthoritativeTaskBackingFromRecords(task, {
		isManagedFlow: (flowId) => readResidentTaskFlow(flowId)?.syncMode === "managed",
		resolveCurrentCanonicalBacking: (scope) => selectCurrentCanonicalTaskBacking({
			...scope,
			candidates: [...taskIdsByRelatedSessionKey.get(scope.childSessionKey) ?? []].flatMap((taskId) => {
				const candidate = tasks.get(taskId);
				return candidate ? [candidate] : [];
			}),
			isTaskMirroredFlow: (flowId) => readResidentTaskFlow(flowId)?.syncMode === "task_mirrored"
		})
	});
}
//#endregion
export { prepareTaskBackingRead as a, hasResidentTaskBacking as i, getManagedTaskBackingInstance as n, resolveManagedTaskBackingDetail as o, hasAuthoritativeTaskBacking as r, createNextAcpTaskBackingDetail as t };
