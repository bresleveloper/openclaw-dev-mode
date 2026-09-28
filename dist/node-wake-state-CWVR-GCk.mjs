//#region src/gateway/node-wake-state-store.ts
const nodeWakeStateByOwner = /* @__PURE__ */ new Map();
const nodeWakeOwnerBySignal = /* @__PURE__ */ new WeakMap();
function nodeWakeStateKey(nodeId, pairingGeneration) {
	return JSON.stringify([nodeId.trim(), pairingGeneration?.trim() || null]);
}
//#endregion
//#region src/gateway/node-wake-state.ts
const NODE_WAKE_RECONNECT_WAIT_MS = 3e3;
const NODE_WAKE_RECONNECT_RETRY_WAIT_MS = 12e3;
function getOrCreateNodeWakeOwner(nodeId, pairingGeneration) {
	const normalizedNodeId = nodeId.trim();
	const stateKey = nodeWakeStateKey(normalizedNodeId, pairingGeneration);
	const existing = nodeWakeStateByOwner.get(stateKey);
	if (existing) return existing;
	const created = {
		nodeId: normalizedNodeId,
		stateKey
	};
	nodeWakeStateByOwner.set(stateKey, created);
	return created;
}
function deleteIdleNodeWakeOwner(owner) {
	if (owner.lifecycle?.users || owner.inFlightWake || owner.lastWakeAtMs !== void 0 || owner.lastNudgeAtMs !== void 0) return;
	owner.lifecycle?.controller.abort();
	if (owner.lifecycle) nodeWakeOwnerBySignal.delete(owner.lifecycle.controller.signal);
	nodeWakeStateByOwner.delete(owner.stateKey);
}
function captureNodeWakeLifecycle(nodeId, pairingGeneration) {
	const owner = getOrCreateNodeWakeOwner(nodeId, pairingGeneration);
	if (!owner.lifecycle || owner.lifecycle.controller.signal.aborted) {
		owner.lifecycle = {
			controller: new AbortController(),
			users: 0
		};
		nodeWakeOwnerBySignal.set(owner.lifecycle.controller.signal, owner);
	}
	owner.lifecycle.users += 1;
	return owner.lifecycle.controller.signal;
}
function isNodeWakeLifecycleCurrent(nodeId, lifecycle, pairingGeneration) {
	const owner = nodeWakeOwnerBySignal.get(lifecycle);
	const expectedStateKey = nodeWakeStateKey(nodeId, pairingGeneration);
	return !lifecycle.aborted && owner?.nodeId === nodeId.trim() && owner.stateKey === expectedStateKey && nodeWakeStateByOwner.get(expectedStateKey) === owner && owner.lifecycle?.controller.signal === lifecycle;
}
function releaseNodeWakeLifecycle(nodeId, lifecycle) {
	const owner = nodeWakeOwnerBySignal.get(lifecycle);
	if (owner?.nodeId !== nodeId.trim() || nodeWakeStateByOwner.get(owner.stateKey) !== owner || owner.lifecycle?.controller.signal !== lifecycle) return;
	owner.lifecycle.users = Math.max(0, owner.lifecycle.users - 1);
	deleteIdleNodeWakeOwner(owner);
}
/** Owns wake dedupe and throttle state while the caller owns APNs policy and I/O. */
async function runNodeWakeAttempt(params) {
	const owner = getOrCreateNodeWakeOwner(params.nodeId, params.pairingGeneration);
	if (owner.inFlightWake) return await owner.inFlightWake;
	if (!params.force && owner.lastWakeAtMs !== void 0 && performance.now() - owner.lastWakeAtMs < params.throttleMs) return {
		available: true,
		throttled: true,
		path: "throttled",
		durationMs: 0
	};
	const attempt = params.attempt(() => {
		owner.lastWakeAtMs = performance.now();
	});
	owner.inFlightWake = attempt;
	try {
		return await attempt;
	} finally {
		if (owner.inFlightWake === attempt) owner.inFlightWake = void 0;
		deleteIdleNodeWakeOwner(owner);
	}
}
/** Owns reconnect-nudge throttling while the caller owns APNs policy and I/O. */
async function runNodeWakeNudgeAttempt(params) {
	const owner = getOrCreateNodeWakeOwner(params.nodeId, params.pairingGeneration);
	if (owner.lastNudgeAtMs !== void 0 && performance.now() - owner.lastNudgeAtMs < params.throttleMs) return params.throttled();
	const result = await params.attempt();
	if (result.reason === "sent") owner.lastNudgeAtMs = performance.now();
	deleteIdleNodeWakeOwner(owner);
	return result;
}
function clearNodeWakeState(nodeId) {
	const normalizedNodeId = nodeId.trim();
	for (const owner of nodeWakeStateByOwner.values()) {
		if (owner.nodeId !== normalizedNodeId) continue;
		owner.lastWakeAtMs = void 0;
		owner.inFlightWake = void 0;
		owner.lastNudgeAtMs = void 0;
		deleteIdleNodeWakeOwner(owner);
	}
}
function invalidateNodeWakeState(nodeId) {
	const normalizedNodeId = nodeId.trim();
	for (const owner of nodeWakeStateByOwner.values()) {
		if (owner.nodeId !== normalizedNodeId) continue;
		owner.lifecycle?.controller.abort();
		if (owner.lifecycle) nodeWakeOwnerBySignal.delete(owner.lifecycle.controller.signal);
		nodeWakeStateByOwner.delete(owner.stateKey);
	}
}
//#endregion
export { invalidateNodeWakeState as a, runNodeWakeAttempt as c, clearNodeWakeState as i, runNodeWakeNudgeAttempt as l, NODE_WAKE_RECONNECT_WAIT_MS as n, isNodeWakeLifecycleCurrent as o, captureNodeWakeLifecycle as r, releaseNodeWakeLifecycle as s, NODE_WAKE_RECONNECT_RETRY_WAIT_MS as t };
