import { n as resolveGlobalMap } from "./global-singleton-Dc_stLtU.mjs";
import { s as removeRemoteNodeInfo } from "./remote-3_oGYmdR.mjs";
import { a as reconcileDeviceWorker } from "./device-provider-meDSQEul.mjs";
import { t as clearNodePendingWork } from "./node-pending-work-DABiMyV_.mjs";
import { a as invalidateNodeWakeState } from "./node-wake-state-CWVR-GCk.mjs";
import { randomUUID } from "node:crypto";
//#region src/gateway/device-worker-revocation.ts
async function reconcileRevokedDeviceWorker(context, deviceId) {
	const environmentIds = await reconcileDeviceWorker(context.workerEnvironmentService, deviceId);
	for (const environmentId of environmentIds) try {
		await context.workerPlacementDispatchService?.reconcileActive?.(environmentId);
	} catch {
		context.logGateway.warn(`device worker placement reconciliation failed device=${deviceId} environment=${environmentId}`);
	}
}
//#endregion
//#region src/gateway/node-runtime-state.ts
const pendingNodeActionsById = resolveGlobalMap(Symbol.for("openclaw.pendingNodeActions"), "close-and-restart");
function prunePendingNodeActions(params) {
	const queue = pendingNodeActionsById.get(params.nodeId) ?? [];
	const minTimestampMs = params.nowMs - params.ttlMs;
	const live = queue.filter((entry) => entry.enqueuedAtMs >= minTimestampMs);
	if (live.length === 0) {
		pendingNodeActionsById.delete(params.nodeId);
		return [];
	}
	pendingNodeActionsById.set(params.nodeId, live);
	return params.pairingGeneration ? live.filter((entry) => entry.pairingGeneration === params.pairingGeneration) : live;
}
function replacePendingNodeActionsForGeneration(params) {
	const next = [...prunePendingNodeActions({
		nodeId: params.nodeId,
		nowMs: params.nowMs ?? Date.now(),
		ttlMs: params.ttlMs
	}).filter((entry) => entry.pairingGeneration !== params.pairingGeneration), ...params.replacement];
	if (next.length === 0) {
		pendingNodeActionsById.delete(params.nodeId);
		return;
	}
	pendingNodeActionsById.set(params.nodeId, next);
}
function enqueuePendingNodeAction(params) {
	const nowMs = params.nowMs ?? Date.now();
	const queue = prunePendingNodeActions({
		nodeId: params.nodeId,
		nowMs,
		ttlMs: params.ttlMs,
		pairingGeneration: params.pairingGeneration
	});
	const existing = queue.find((entry) => entry.idempotencyKey === params.idempotencyKey);
	if (existing) return {
		action: existing,
		created: false
	};
	const action = {
		id: randomUUID(),
		nodeId: params.nodeId,
		pairingGeneration: params.pairingGeneration,
		command: params.command,
		paramsJSON: params.paramsJSON,
		idempotencyKey: params.idempotencyKey,
		enqueuedAtMs: nowMs
	};
	queue.push(action);
	if (queue.length > params.maxPerNode) queue.splice(0, queue.length - params.maxPerNode);
	replacePendingNodeActionsForGeneration({
		nodeId: params.nodeId,
		pairingGeneration: params.pairingGeneration,
		replacement: queue,
		ttlMs: params.ttlMs,
		nowMs
	});
	return {
		action,
		created: true
	};
}
function listPendingNodeActions(params) {
	return prunePendingNodeActions({
		nodeId: params.nodeId,
		nowMs: params.nowMs ?? Date.now(),
		ttlMs: params.ttlMs,
		pairingGeneration: params.pairingGeneration
	});
}
function acknowledgePendingNodeActions(params) {
	const pending = prunePendingNodeActions({
		nodeId: params.nodeId,
		pairingGeneration: params.pairingGeneration,
		nowMs: Date.now(),
		ttlMs: params.ttlMs
	});
	if (params.ids.length === 0) return pending;
	const ids = new Set(params.ids);
	const remaining = pending.filter((entry) => !ids.has(entry.id));
	replacePendingNodeActionsForGeneration({
		...params,
		replacement: remaining
	});
	return remaining;
}
function removePendingNodeAction(params) {
	const pending = prunePendingNodeActions({
		nodeId: params.nodeId,
		pairingGeneration: params.pairingGeneration,
		nowMs: Date.now(),
		ttlMs: params.ttlMs
	});
	const remaining = pending.filter((entry) => entry.id !== params.actionId);
	if (remaining.length === pending.length) return;
	replacePendingNodeActionsForGeneration({
		...params,
		replacement: remaining
	});
}
function clearPendingNodeActions(nodeId) {
	pendingNodeActionsById.delete(nodeId);
}
function clearRemovedNodeRuntimeState(params) {
	clearPendingNodeActions(params.nodeId);
	clearNodePendingWork(params.nodeId);
	invalidateNodeWakeState(params.nodeId);
	params.context.nodeRegistry.updateSurface(params.nodeId, {
		caps: [],
		commands: [],
		permissions: void 0
	});
	removeRemoteNodeInfo(params.nodeId);
}
//#endregion
export { removePendingNodeAction as a, listPendingNodeActions as i, clearRemovedNodeRuntimeState as n, replacePendingNodeActionsForGeneration as o, enqueuePendingNodeAction as r, reconcileRevokedDeviceWorker as s, acknowledgePendingNodeActions as t };
