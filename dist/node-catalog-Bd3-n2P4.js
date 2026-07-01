import { a as normalizeLowercaseStringOrEmpty } from "./string-coerce-DW4mBlAt.js";
import { c as normalizeSortedUniqueTrimmedStringList } from "./string-normalization-CRyoFBPt.js";
import { h as sameNodePermissionSurface, m as sameNodeApprovalSurfaceSet } from "./node-pairing-mMAtozCU.js";
import { s as hasEffectivePairedDeviceRole } from "./device-pairing-DBBF4i61.js";
//#region src/gateway/node-catalog.ts
function uniqueSortedStrings(...items) {
	return normalizeSortedUniqueTrimmedStringList(items.flatMap((item) => item ?? []));
}
function buildDevicePairingSource(entry) {
	return {
		nodeId: entry.deviceId,
		displayName: entry.displayName,
		platform: entry.platform,
		clientId: entry.clientId,
		clientMode: entry.clientMode,
		remoteIp: entry.remoteIp,
		approvedAtMs: entry.approvedAtMs,
		lastSeenAtMs: entry.lastSeenAtMs,
		lastSeenReason: entry.lastSeenReason
	};
}
function buildApprovedNodeSource(entry) {
	return {
		nodeId: entry.nodeId,
		displayName: entry.displayName,
		platform: entry.platform,
		version: entry.version,
		coreVersion: entry.coreVersion,
		uiVersion: entry.uiVersion,
		remoteIp: entry.remoteIp,
		deviceFamily: entry.deviceFamily,
		modelIdentifier: entry.modelIdentifier,
		caps: entry.caps ?? [],
		commands: entry.commands ?? [],
		permissions: entry.permissions,
		approvedAtMs: entry.approvedAtMs,
		lastConnectedAtMs: entry.lastConnectedAtMs,
		lastSeenAtMs: entry.lastSeenAtMs,
		lastSeenReason: entry.lastSeenReason
	};
}
function buildPendingNodeSource(entry) {
	return {
		requestId: entry.requestId,
		nodeId: entry.nodeId,
		displayName: entry.displayName,
		platform: entry.platform,
		version: entry.version,
		coreVersion: entry.coreVersion,
		uiVersion: entry.uiVersion,
		clientId: entry.clientId,
		clientMode: entry.clientMode,
		remoteIp: entry.remoteIp,
		deviceFamily: entry.deviceFamily,
		modelIdentifier: entry.modelIdentifier,
		caps: uniqueSortedStrings(entry.caps),
		commands: uniqueSortedStrings(entry.commands),
		permissions: entry.permissions
	};
}
function resolveCurrentPendingNodePairing(params) {
	const { pending, nodePairing, live } = params;
	if (!pending || !live) return pending;
	const declaredPermissions = !nodePairing && live.declaredPermissions === void 0 ? pending.permissions : live.declaredPermissions;
	return sameNodeApprovalSurfaceSet(pending.caps, live.declaredCaps) && sameNodeApprovalSurfaceSet(pending.commands, live.declaredCommands) && sameNodePermissionSurface(pending.permissions, declaredPermissions) ? pending : void 0;
}
function resolveEffectiveLastSeen(params) {
	const candidates = [
		params.live?.connectedAtMs ? {
			atMs: params.live.connectedAtMs,
			reason: "connect"
		} : void 0,
		params.nodePairing?.lastSeenAtMs ? {
			atMs: params.nodePairing.lastSeenAtMs,
			reason: params.nodePairing.lastSeenReason
		} : void 0,
		params.nodePairing?.lastConnectedAtMs ? {
			atMs: params.nodePairing.lastConnectedAtMs,
			reason: "connect"
		} : void 0,
		params.devicePairing?.lastSeenAtMs ? {
			atMs: params.devicePairing.lastSeenAtMs,
			reason: params.devicePairing.lastSeenReason
		} : void 0
	].filter((entry) => entry !== void 0);
	let newest;
	for (const candidate of candidates) if (!newest || candidate.atMs > newest.atMs) newest = candidate;
	if (!newest) return {};
	return {
		lastSeenAtMs: newest.atMs,
		lastSeenReason: newest.reason
	};
}
function buildEffectiveKnownNode(entry) {
	const { nodeId, devicePairing, nodePairing, pendingNodePairing, live } = entry;
	const lastSeen = resolveEffectiveLastSeen({
		live,
		devicePairing,
		nodePairing
	});
	return {
		nodeId,
		displayName: live?.displayName ?? nodePairing?.displayName ?? devicePairing?.displayName ?? pendingNodePairing?.displayName,
		platform: live?.platform ?? nodePairing?.platform ?? devicePairing?.platform ?? pendingNodePairing?.platform,
		version: live?.version ?? nodePairing?.version ?? pendingNodePairing?.version,
		coreVersion: live?.coreVersion ?? nodePairing?.coreVersion ?? pendingNodePairing?.coreVersion,
		uiVersion: live?.uiVersion ?? nodePairing?.uiVersion ?? pendingNodePairing?.uiVersion,
		clientId: live?.clientId ?? devicePairing?.clientId ?? pendingNodePairing?.clientId,
		clientMode: live?.clientMode ?? devicePairing?.clientMode ?? pendingNodePairing?.clientMode,
		deviceFamily: live?.deviceFamily ?? nodePairing?.deviceFamily ?? pendingNodePairing?.deviceFamily,
		modelIdentifier: live?.modelIdentifier ?? nodePairing?.modelIdentifier ?? pendingNodePairing?.modelIdentifier,
		remoteIp: live?.remoteIp ?? nodePairing?.remoteIp ?? devicePairing?.remoteIp ?? pendingNodePairing?.remoteIp,
		caps: live ? uniqueSortedStrings(live.caps) : uniqueSortedStrings(nodePairing?.caps),
		commands: live ? uniqueSortedStrings(live.commands) : uniqueSortedStrings(nodePairing?.commands),
		pathEnv: live?.pathEnv,
		permissions: live?.permissions ?? nodePairing?.permissions,
		approvalState: pendingNodePairing ? nodePairing ? "pending-reapproval" : "pending-approval" : nodePairing ? "approved" : "unapproved",
		pendingRequestId: pendingNodePairing?.requestId,
		pendingDeclaredCaps: pendingNodePairing?.caps,
		pendingDeclaredCommands: pendingNodePairing?.commands,
		pendingDeclaredPermissions: pendingNodePairing?.permissions,
		connectedAtMs: live?.connectedAtMs,
		lastSeenAtMs: lastSeen.lastSeenAtMs,
		lastSeenReason: lastSeen.lastSeenReason,
		approvedAtMs: nodePairing?.approvedAtMs ?? devicePairing?.approvedAtMs,
		paired: Boolean(devicePairing ?? nodePairing),
		connected: Boolean(live)
	};
}
function compareKnownNodes(left, right) {
	if (left.connected !== right.connected) return left.connected ? -1 : 1;
	const leftName = normalizeLowercaseStringOrEmpty(left.displayName ?? left.nodeId);
	const rightName = normalizeLowercaseStringOrEmpty(right.displayName ?? right.nodeId);
	if (leftName < rightName) return -1;
	if (leftName > rightName) return 1;
	return left.nodeId.localeCompare(right.nodeId);
}
/** Builds a node catalog keyed by node id from pairing stores and live sessions. */
function createKnownNodeCatalog(params) {
	const devicePairingById = new Map(params.pairedDevices.filter((entry) => hasEffectivePairedDeviceRole(entry, "node")).map((entry) => [entry.deviceId, buildDevicePairingSource(entry)]));
	const nodePairingById = new Map((params.pairedNodes ?? []).map((entry) => [entry.nodeId, buildApprovedNodeSource(entry)]));
	const pendingNodePairingById = /* @__PURE__ */ new Map();
	for (const entry of params.pendingNodes ?? []) if (!pendingNodePairingById.has(entry.nodeId)) pendingNodePairingById.set(entry.nodeId, buildPendingNodeSource(entry));
	const liveById = new Map(params.connectedNodes.map((entry) => [entry.nodeId, entry]));
	const nodeIds = new Set([
		...devicePairingById.keys(),
		...nodePairingById.keys(),
		...pendingNodePairingById.keys(),
		...liveById.keys()
	]);
	const entriesById = /* @__PURE__ */ new Map();
	for (const nodeId of nodeIds) {
		const devicePairing = devicePairingById.get(nodeId);
		const nodePairing = nodePairingById.get(nodeId);
		const live = liveById.get(nodeId);
		const pendingNodePairing = resolveCurrentPendingNodePairing({
			pending: pendingNodePairingById.get(nodeId),
			nodePairing,
			live
		});
		entriesById.set(nodeId, {
			nodeId,
			devicePairing,
			nodePairing,
			pendingNodePairing,
			live,
			effective: buildEffectiveKnownNode({
				nodeId,
				devicePairing,
				nodePairing,
				pendingNodePairing,
				live
			})
		});
	}
	return { entriesById };
}
/** Lists known nodes with connected nodes first and deterministic display ordering. */
function listKnownNodes(catalog) {
	return [...catalog.entriesById.values()].map((entry) => entry.effective).toSorted(compareKnownNodes);
}
/** Returns the merged catalog entry for diagnostics that need source details. */
function getKnownNodeEntry(catalog, nodeId) {
	return catalog.entriesById.get(nodeId) ?? null;
}
/** Returns the effective node row shown to gateway clients. */
function getKnownNode(catalog, nodeId) {
	return getKnownNodeEntry(catalog, nodeId)?.effective ?? null;
}
//#endregion
export { getKnownNode as n, listKnownNodes as r, createKnownNodeCatalog as t };
