import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { u as normalizeSortedUniqueTrimmedStringList } from "./string-normalization-_gRhJUDw.mjs";
import { A as filterPublicNodeCommands } from "./node-commands-BLhGKTZa.mjs";
import { n as hasEffectivePairedDeviceRole } from "./device-pairing-identity-BnU9nqx2.mjs";
import "./device-pairing-DbLfxuuq.mjs";
import { i as sameNodePermissionSurface, r as sameNodeApprovalSurfaceSet } from "./node-pairing-surface-B68Et9XU.mjs";
//#region src/gateway/node-catalog.ts
function uniqueSortedStrings(...items) {
	return normalizeSortedUniqueTrimmedStringList(items.flatMap((item) => item ?? []));
}
function firstNormalizedString(...values) {
	for (const value of values) {
		const normalized = normalizeOptionalString(value);
		if (normalized !== void 0) return normalized;
	}
}
function hasAddressableId(value) {
	return normalizeOptionalString(value) !== void 0;
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
		commands: filterPublicNodeCommands(uniqueSortedStrings(entry.commands)),
		permissions: entry.permissions
	};
}
function resolveCurrentPendingNodePairing(params) {
	const { pending, nodePairing, live } = params;
	if (!pending || !live) return pending;
	const declaredPermissions = !nodePairing && live.declaredPermissions === void 0 ? pending.permissions : live.declaredPermissions;
	return sameNodeApprovalSurfaceSet(pending.caps, live.declaredCaps) && sameNodeApprovalSurfaceSet(pending.commands, live.declaredCommands) && sameNodePermissionSurface(pending.permissions, declaredPermissions) ? pending : void 0;
}
function maxDefinedTimestamp(...values) {
	const defined = values.filter((value) => value !== void 0);
	return defined.length > 0 ? Math.max(...defined) : void 0;
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
		lastSeenReason: normalizeOptionalString(newest.reason)
	};
}
function buildEffectiveKnownNode(entry) {
	const { nodeId, devicePairing, nodePairing, pendingNodePairing, live, sessionHost, workerSlots, workerBundle, issues } = entry;
	const lastSeen = resolveEffectiveLastSeen({
		live,
		devicePairing,
		nodePairing
	});
	const lastConnectedAtMs = maxDefinedTimestamp(nodePairing?.lastConnectedAtMs, live?.connectedAtMs);
	const lastDisconnectedAtMs = live ? void 0 : nodePairing?.lastDisconnectedAtMs;
	const hostStats = live ? live.hostStats : nodePairing?.lastHostStats;
	return {
		nodeId,
		displayName: firstNormalizedString(nodePairing?.displayName, live?.displayName, devicePairing?.displayName, pendingNodePairing?.displayName),
		platform: firstNormalizedString(live?.platform, nodePairing?.platform, devicePairing?.platform, pendingNodePairing?.platform),
		version: firstNormalizedString(live?.version, nodePairing?.version, pendingNodePairing?.version),
		coreVersion: firstNormalizedString(live?.coreVersion, nodePairing?.coreVersion, pendingNodePairing?.coreVersion),
		uiVersion: firstNormalizedString(live?.uiVersion, nodePairing?.uiVersion, pendingNodePairing?.uiVersion),
		clientId: firstNormalizedString(live?.clientId, devicePairing?.clientId, pendingNodePairing?.clientId),
		clientMode: firstNormalizedString(live?.clientMode, devicePairing?.clientMode, pendingNodePairing?.clientMode),
		deviceFamily: firstNormalizedString(live?.deviceFamily, nodePairing?.deviceFamily, pendingNodePairing?.deviceFamily),
		modelIdentifier: firstNormalizedString(live?.modelIdentifier, nodePairing?.modelIdentifier, pendingNodePairing?.modelIdentifier),
		remoteIp: firstNormalizedString(live?.remoteIp, nodePairing?.remoteIp, devicePairing?.remoteIp, pendingNodePairing?.remoteIp),
		caps: live ? uniqueSortedStrings(live.caps) : uniqueSortedStrings(nodePairing?.caps),
		commands: filterPublicNodeCommands(live ? uniqueSortedStrings(live.commands) : uniqueSortedStrings(entry.approvedCommands)),
		computerUse: live?.computerUse,
		sessionHost,
		...hostStats ? { hostStats: structuredClone(hostStats) } : {},
		...live && workerSlots ? { workerSlots: { ...workerSlots } } : {},
		...live && workerBundle ? { workerBundle: structuredClone(workerBundle) } : {},
		...issues?.length ? { issues: [...issues] } : {},
		nodePluginTools: live?.nodePluginTools,
		pathEnv: live?.pathEnv,
		permissions: live?.permissions ?? nodePairing?.permissions,
		approvalState: pendingNodePairing ? nodePairing ? "pending-reapproval" : "pending-approval" : nodePairing ? "approved" : "unapproved",
		pendingRequestId: pendingNodePairing?.requestId,
		pendingDeclaredCaps: pendingNodePairing?.caps,
		pendingDeclaredCommands: pendingNodePairing?.commands,
		pendingDeclaredPermissions: pendingNodePairing?.permissions,
		connectedAtMs: live?.connectedAtMs,
		lastConnectedAtMs,
		lastDisconnectedAtMs,
		lastActiveAtMs: live?.lastActiveAtMs,
		presenceUpdatedAtMs: live?.presenceUpdatedAtMs,
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
	const devicePairingById = new Map(params.pairedDevices.filter((entry) => hasAddressableId(entry.deviceId) && hasEffectivePairedDeviceRole(entry, "node")).map((entry) => [entry.deviceId, entry]));
	const nodePairingById = new Map((params.pairedNodes ?? []).filter((entry) => hasAddressableId(entry.nodeId)).map((entry) => [entry.nodeId, {
		node: entry,
		commands: filterPublicNodeCommands(entry.commands ?? [])
	}]));
	const pendingNodePairingById = /* @__PURE__ */ new Map();
	for (const entry of params.pendingNodes ?? []) {
		if (!hasAddressableId(entry.nodeId)) continue;
		if (!pendingNodePairingById.has(entry.nodeId)) pendingNodePairingById.set(entry.nodeId, buildPendingNodeSource(entry));
	}
	const liveById = new Map(params.connectedNodes.map((entry) => [entry.nodeId, entry]));
	const nodeIds = /* @__PURE__ */ new Set([
		...devicePairingById.keys(),
		...nodePairingById.keys(),
		...pendingNodePairingById.keys(),
		...liveById.keys()
	]);
	const catalog = /* @__PURE__ */ new Map();
	for (const nodeId of nodeIds) {
		const devicePairing = devicePairingById.get(nodeId);
		const approved = nodePairingById.get(nodeId);
		const nodePairing = approved?.node;
		const live = liveById.get(nodeId);
		const pendingNodePairing = resolveCurrentPendingNodePairing({
			pending: pendingNodePairingById.get(nodeId),
			nodePairing,
			live
		});
		catalog.set(nodeId, buildEffectiveKnownNode({
			nodeId,
			devicePairing,
			nodePairing,
			approvedCommands: approved?.commands,
			pendingNodePairing,
			live,
			sessionHost: live ? params.sessionHostNodeIds?.has(nodeId) === true : nodePairing?.sessionHost === true,
			workerSlots: params.workerSlotsByNodeId?.get(nodeId),
			workerBundle: params.workerBundleByNodeId?.get(nodeId),
			issues: params.issuesByNodeId?.get(nodeId)
		}));
	}
	return catalog;
}
/** Lists known nodes with connected nodes first and deterministic display ordering. */
function listKnownNodes(catalog) {
	return [...catalog.values()].toSorted(compareKnownNodes);
}
/** Returns the effective node row shown to gateway clients. */
function getKnownNode(catalog, nodeId) {
	return catalog.get(nodeId) ?? null;
}
//#endregion
export { getKnownNode as n, listKnownNodes as r, createKnownNodeCatalog as t };
