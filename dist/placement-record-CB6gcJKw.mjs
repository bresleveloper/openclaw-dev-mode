import { t as sessionChanges } from "./session-row-changes-xuu0eHng.mjs";
//#region src/gateway/worker-environments/placement-record.ts
const FORCED_WORKER_ABANDONMENT_ERROR = "Worker result abandoned by forced operator teardown";
function isForceAbandonedWorkerPlacement(placement) {
	return placement?.state === "failed" && placement.recoveryError === "Worker result abandoned by forced operator teardown";
}
function serializeWorkerSessionTurnClaim(claim) {
	if (claim.owner.kind !== "worker") throw new Error("Worker claim identity requires a worker-owned claim");
	return JSON.stringify([
		claim.sessionId,
		claim.owner.environmentId,
		claim.owner.ownerEpoch,
		claim.runId,
		claim.claimId,
		claim.placementGeneration
	]);
}
function sameWorkerSessionTurnClaim(left, right) {
	if (left.owner.kind !== "worker" || right.owner.kind !== "worker") throw new Error("Worker claim identity requires a worker-owned claim");
	return left.sessionId === right.sessionId && left.owner.environmentId === right.owner.environmentId && left.owner.ownerEpoch === right.owner.ownerEpoch && left.runId === right.runId && left.claimId === right.claimId && left.placementGeneration === right.placementGeneration;
}
function placementTurnOwner(placement) {
	return {
		kind: placement.executionMode === "remote-exec" ? "local" : "worker",
		environmentId: placement.environmentId,
		ownerEpoch: placement.activeOwnerEpoch
	};
}
function reportPlacementTransition(observer, placement) {
	try {
		sessionChanges.emit({
			agentId: placement.agentId,
			sessionKey: placement.sessionKey
		});
		observer?.(placement);
	} catch {}
}
function projectWorkerSessionTurnClaim(record) {
	const claim = record.turnClaim;
	return claim?.owner === "worker" && (record.state === "active" || record.state === "draining") && record.environmentId && record.activeOwnerEpoch === claim.ownerEpoch ? {
		sessionId: record.sessionId,
		claimId: claim.claimId,
		runId: claim.runId,
		placementGeneration: claim.generation,
		owner: {
			kind: "worker",
			environmentId: record.environmentId,
			ownerEpoch: claim.ownerEpoch
		}
	} : void 0;
}
function required(value, field) {
	const normalized = value.trim();
	if (!normalized) throw new Error(`Worker session placement ${field} must be a non-empty string`);
	return normalized;
}
function normalizeWorkerPlacementExecutionMode(value) {
	if (value === null || value === void 0 || value === "worker-turn") return "worker-turn";
	if (value === "remote-exec") return value;
	throw new Error(`Invalid worker placement execution mode: ${value}`);
}
function nullableRequired(value, field) {
	return value === null ? null : required(value, field);
}
function normalizeEpoch(value, field) {
	if (!Number.isSafeInteger(value) || value < 1) throw new Error(`Worker session placement ${field} must be a positive safe integer`);
	return value;
}
function normalizeCursor(value, field) {
	if (value !== null && (!Number.isSafeInteger(value) || value < 0)) throw new Error(`Worker session placement ${field} must be a non-negative safe integer`);
	return value;
}
function normalizeTimestamp(value, field) {
	if (value !== null && (!Number.isSafeInteger(value) || value < 0)) throw new Error(`Worker session placement ${field} must be a non-negative safe integer`);
	return value;
}
function advanceCursor(current, value, field) {
	if (value === void 0) return current;
	const next = normalizeCursor(value, field);
	if (next === null || current === null) return next ?? current;
	return Math.max(current, next);
}
function normalizeIdentity(input) {
	return {
		sessionId: required(input.sessionId, "session id"),
		agentId: required(input.agentId, "agent id"),
		sessionKey: required(input.sessionKey, "session key")
	};
}
function nextGeneration(generation) {
	const next = generation + 1;
	if (!Number.isSafeInteger(next)) throw new Error("Worker session placement generation is exhausted");
	return next;
}
function assertRecordShape(record) {
	if (record.state === "reclaimed" || record.state === "failed") {
		normalizeTimestamp(record.terminalAtMs, "terminal timestamp");
		if (record.state === "reclaimed" && record.terminalReason !== null) throw new Error("Reclaimed worker session placement cannot retain a terminal reason");
		if (record.terminalReason !== null) required(record.terminalReason, "terminal reason");
	} else if (record.terminalReason !== null || record.terminalAtMs !== null) throw new Error(`Worker session placement ${record.state} cannot retain terminal facts`);
	if (record.state === "local" || record.state === "requested") {
		if (record.environmentId !== null || record.activeOwnerEpoch !== null || record.workspaceBaseManifestRef !== null || record.remoteWorkspaceDir !== null || record.workerBundleHash !== null || record.lastTranscriptAckCursor !== null || record.lastLiveEventAckCursor !== null || record.recoveryError !== null) throw new Error(`Worker session placement ${record.state} cannot retain worker metadata`);
	} else if (record.state === "provisioning") {
		if (record.activeOwnerEpoch !== null || record.workspaceBaseManifestRef !== null || record.remoteWorkspaceDir !== null || record.workerBundleHash !== null || record.lastTranscriptAckCursor !== null || record.lastLiveEventAckCursor !== null || record.recoveryError !== null) throw new Error("Provisioning worker session placement can only retain an environment id");
	} else if (record.state === "syncing") {
		if (!record.environmentId || record.activeOwnerEpoch !== null || record.workspaceBaseManifestRef !== null || record.remoteWorkspaceDir !== null || !record.workerBundleHash || record.lastTranscriptAckCursor !== null || record.lastLiveEventAckCursor !== null || record.recoveryError !== null) throw new Error("Syncing worker session placement requires an environment and bundle");
	} else if (record.state === "starting") {
		if (!record.environmentId || record.activeOwnerEpoch !== null || !record.workspaceBaseManifestRef || !record.remoteWorkspaceDir || !record.workerBundleHash || record.lastTranscriptAckCursor !== null || record.lastLiveEventAckCursor !== null || record.recoveryError !== null) throw new Error("Starting worker session placement requires complete workspace metadata");
	} else if (record.state === "active" || record.state === "draining" || record.state === "reconciling" || record.state === "reclaimed") {
		if (!record.environmentId || record.activeOwnerEpoch === null || !record.workspaceBaseManifestRef || !record.remoteWorkspaceDir || !record.workerBundleHash || record.recoveryError !== null) throw new Error(`Worker session placement ${record.state} requires complete worker ownership`);
		normalizeEpoch(record.activeOwnerEpoch, "active owner epoch");
	} else if (!record.recoveryError) throw new Error("Failed worker session placement requires a recovery error");
	if (record.turnClaim?.owner === "local" && record.state !== "local" && record.state !== "requested" && record.state !== "failed" && !(record.executionMode === "remote-exec" && (record.state === "active" || record.state === "draining"))) throw new Error("Local turn claim requires local, dispatch-barrier, or failed placement");
	if (record.turnClaim?.owner === "worker") {
		const workerMayFinish = record.state === "active" || record.state === "draining";
		if (record.executionMode !== "worker-turn" || !workerMayFinish || record.activeOwnerEpoch !== record.turnClaim.ownerEpoch) throw new Error("Worker turn claim requires the active or draining worker owner epoch");
	}
}
function isCurrentPlacementTurnClaim(record, claim) {
	const persisted = record.turnClaim;
	if (!persisted || persisted.claimId !== claim.claimId || persisted.runId !== claim.runId || persisted.generation !== claim.placementGeneration || persisted.owner !== claim.owner.kind) return false;
	if (claim.owner.kind === "worker") return persisted.ownerEpoch === claim.owner.ownerEpoch && record.executionMode === "worker-turn" && (record.state === "active" || record.state === "draining") && record.environmentId === claim.owner.environmentId && record.activeOwnerEpoch === claim.owner.ownerEpoch;
	if (record.state === "active" || record.state === "draining") return record.executionMode === "remote-exec" && claim.owner.environmentId === record.environmentId && claim.owner.ownerEpoch === record.activeOwnerEpoch;
	if (record.state === "failed" && record.executionMode === "remote-exec" && record.environmentId && record.activeOwnerEpoch !== null) return claim.owner.environmentId === record.environmentId && claim.owner.ownerEpoch === record.activeOwnerEpoch;
	return (record.state === "local" || record.state === "requested" || record.state === "failed") && claim.owner.environmentId === void 0 && claim.owner.ownerEpoch === void 0;
}
function resolvePlacementTurnEnvironment(record, claim) {
	if (!isCurrentPlacementTurnClaim(record, claim) || record.state !== "active" && record.state !== "draining" || !record.environmentId || record.activeOwnerEpoch === null) return;
	return {
		environmentId: record.environmentId,
		ownerEpoch: record.activeOwnerEpoch
	};
}
//#endregion
export { resolvePlacementTurnEnvironment as _, isForceAbandonedWorkerPlacement as a, normalizeEpoch as c, normalizeWorkerPlacementExecutionMode as d, nullableRequired as f, required as g, reportPlacementTransition as h, isCurrentPlacementTurnClaim as i, normalizeIdentity as l, projectWorkerSessionTurnClaim as m, advanceCursor as n, nextGeneration as o, placementTurnOwner as p, assertRecordShape as r, normalizeCursor as s, FORCED_WORKER_ABANDONMENT_ERROR as t, normalizeTimestamp as u, sameWorkerSessionTurnClaim as v, serializeWorkerSessionTurnClaim as y };
