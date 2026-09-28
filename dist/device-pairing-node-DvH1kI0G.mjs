import "./src-CZ2wJvNB.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { n as executeDevicePairingMutation, r as withCurrentDevicePairingSnapshot, t as DevicePairingAuthorityRefusedError } from "./device-pairing-worker-DPa4iZOd.mjs";
import { a as samePendingReconnectMetadata, c as toPublicPendingRequest, i as samePendingApprovalSurface, n as projectNodePairing, o as toPairedNode, s as toPendingSnapshot } from "./device-pairing-node.records-6nbBdP9Q.mjs";
//#region src/infra/device-pairing-node.ts
const activeCleanupRevisionClaims = /* @__PURE__ */ new Map();
let nextCleanupClaimGeneration = 0;
function buildCleanupRevisionClaimKey(baseDir, observed) {
	return `${baseDir ?? ""}\0${observed.nodeId}\0${observed.requestId}\0${observed.revision ?? ""}`;
}
function addCleanupClaim(claim) {
	const key = buildCleanupRevisionClaimKey(claim.baseDir, claim.observed);
	const generations = activeCleanupRevisionClaims.get(key) ?? /* @__PURE__ */ new Set();
	generations.add(claim.generation);
	activeCleanupRevisionClaims.set(key, generations);
}
function cleanupClaimIsActive(claim) {
	const key = buildCleanupRevisionClaimKey(claim.baseDir, claim.observed);
	return activeCleanupRevisionClaims.get(key)?.has(claim.generation) === true;
}
function removeCleanupClaim(claim) {
	const key = buildCleanupRevisionClaimKey(claim.baseDir, claim.observed);
	const generations = activeCleanupRevisionClaims.get(key);
	generations?.delete(claim.generation);
	if (!generations || generations.size === 0) activeCleanupRevisionClaims.delete(key);
}
function invalidateCleanupClaimsThrough(claim, device, pending) {
	const key = buildCleanupRevisionClaimKey(claim.baseDir, toPendingSnapshot(device, pending));
	const generations = activeCleanupRevisionClaims.get(key);
	if (!generations) return;
	for (const generation of generations) if (generation <= claim.generation) generations.delete(generation);
	if (generations.size === 0) activeCleanupRevisionClaims.delete(key);
}
async function listNodePairing(baseDir, options) {
	return expectDefined(await withCurrentDevicePairingSnapshot(baseDir, (paired) => ({ start: () => projectNodePairing(paired, options) })), "node pairing snapshot");
}
/** Claim pending revisions in the same owner interval that acquires their current snapshot. */
async function beginNodePairingConnect(nodeId, baseDir) {
	return expectDefined(await withCurrentDevicePairingSnapshot(baseDir, (paired) => ({ start: () => {
		const device = paired.find((entry) => entry.deviceId === nodeId.trim());
		const pairedNode = device ? toPairedNode(device) : null;
		const pending = device?.pendingNodeSurface;
		if (!device || !pairedNode || !pending) return { pairedNode };
		const claim = {
			baseDir,
			generation: ++nextCleanupClaimGeneration,
			nodeId: device.deviceId,
			observed: toPendingSnapshot(device, pending)
		};
		addCleanupClaim(claim);
		return {
			pairedNode,
			cleanupClaim: claim
		};
	} })), "node reconnect snapshot");
}
async function releaseNodePairingCleanupClaim(claim) {
	removeCleanupClaim(claim);
}
async function finalizeNodePairingCleanupClaim(claim) {
	if (!cleanupClaimIsActive(claim)) return [];
	try {
		return await executeDevicePairingMutation({
			type: "node.finalizeCleanup",
			input: { observed: claim.observed }
		}, {
			baseDir: claim.baseDir,
			assertCurrent: () => {
				if (!cleanupClaimIsActive(claim)) throw new DevicePairingAuthorityRefusedError("node reconnect cleanup claim changed");
			}
		});
	} catch (error) {
		if (error instanceof DevicePairingAuthorityRefusedError) return [];
		throw error;
	} finally {
		removeCleanupClaim(claim);
	}
}
function requestNodePairing(req, baseDir) {
	return executeDevicePairingMutation({
		type: "node.request",
		input: {
			req,
			nowMs: Date.now()
		}
	}, { baseDir });
}
/** An unchanged reconnect supersedes earlier cleanup ownership without writing the row. */
async function reusePendingNodePairingForReconnect(req, cleanupClaim, baseDir) {
	return await withCurrentDevicePairingSnapshot(baseDir, (paired) => ({ start: () => {
		const nodeId = req.nodeId.trim();
		const device = paired.find((entry) => entry.deviceId === nodeId);
		const pending = device?.pendingNodeSurface;
		if (!device || !pending || !samePendingApprovalSurface(pending, {
			...req,
			nodeId
		}) || !samePendingReconnectMetadata(pending, req)) return null;
		if (cleanupClaim) invalidateCleanupClaimsThrough(cleanupClaim, device, pending);
		return {
			status: "pending",
			request: toPublicPendingRequest(device, pending),
			created: false
		};
	} })) ?? null;
}
async function approveNodePairing(requestId, options, baseDir) {
	try {
		return await executeDevicePairingMutation({
			type: "node.approve",
			input: {
				requestId,
				callerScopes: options.callerScopes,
				nowMs: Date.now()
			}
		}, {
			baseDir,
			admit: (facts) => {
				if (!isRecord(facts) || facts.kind !== "node-pending" || typeof facts.nodeId !== "string" || typeof facts.requestId !== "string" || facts.revision !== void 0 && typeof facts.revision !== "string") throw new Error("invalid node pending admission facts");
				const key = buildCleanupRevisionClaimKey(baseDir, {
					nodeId: facts.nodeId,
					requestId: facts.requestId,
					revision: facts.revision
				});
				if ((activeCleanupRevisionClaims.get(key)?.size ?? 0) > 0) throw new DevicePairingAuthorityRefusedError("node reconnect owns pending revision");
			}
		});
	} catch (error) {
		if (error instanceof DevicePairingAuthorityRefusedError) return null;
		throw error;
	}
}
function rejectNodePairing(requestId, baseDir) {
	return executeDevicePairingMutation({
		type: "node.reject",
		input: { requestId }
	}, { baseDir });
}
async function getPendingNodePairing(requestId, baseDir) {
	return await withCurrentDevicePairingSnapshot(baseDir, (paired) => ({ start: () => {
		const device = paired.find((entry) => entry.pendingNodeSurface?.requestId === requestId);
		return device ? {
			requestId,
			nodeId: device.deviceId
		} : null;
	} })) ?? null;
}
function recordPairedNodeConnection(nodeId, connectedAtMs, baseDir, expectedPairingGeneration) {
	return executeDevicePairingMutation({
		type: "node.recordConnection",
		input: {
			nodeId,
			connectedAtMs,
			expectedPairingGeneration
		}
	}, { baseDir });
}
function recordPairedNodeHostStats(params) {
	const { baseDir, ...input } = params;
	return executeDevicePairingMutation({
		type: "node.recordHostStats",
		input
	}, { baseDir });
}
async function recordPairedNodeDisconnection(params) {
	const { baseDir, ...input } = params;
	return { recorded: await executeDevicePairingMutation({
		type: "node.recordDisconnection",
		input
	}, { baseDir }) };
}
function renamePairedNode(nodeId, displayName, baseDir) {
	return executeDevicePairingMutation({
		type: "node.rename",
		input: {
			nodeId,
			displayName
		}
	}, { baseDir });
}
//#endregion
export { listNodePairing as a, recordPairedNodeHostStats as c, renamePairedNode as d, requestNodePairing as f, getPendingNodePairing as i, rejectNodePairing as l, beginNodePairingConnect as n, recordPairedNodeConnection as o, reusePendingNodePairingForReconnect as p, finalizeNodePairingCleanupClaim as r, recordPairedNodeDisconnection as s, approveNodePairing as t, releaseNodePairingCleanupClaim as u };
