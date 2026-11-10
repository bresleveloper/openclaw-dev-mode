import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty, t as hasNonEmptyString } from "./string-coerce-1VuiLaaR.mjs";
import { u as normalizeSortedUniqueTrimmedStringList } from "./string-normalization-D6DKCpwE.mjs";
import { t as freezeJsonSnapshot } from "./immutable-data-DqJSDH8t.mjs";
import { j as filterPublicNodeCommands } from "./node-commands-Bxo-2Y4j.mjs";
import { a as readDevicePairingNodeSnapshot } from "./device-pairing-store-readonly-Cbi-VDom.mjs";
import { i as sameNodePermissionSurface, r as sameNodeApprovalSurfaceSet } from "./node-pairing-surface-DkE1CvYJ.mjs";
import { n as projectNodePairing } from "./device-pairing-node.records-TSjeSKgU.mjs";
import { l as readNodeCatalogRevision, t as collectNodeCatalogRuntimeState } from "./node-registry-private-Dv3TwbYd.mjs";
//#region src/gateway/node-catalog.ts
function uniqueSortedStrings(...items) {
	return normalizeSortedUniqueTrimmedStringList(items.flatMap((item) => item ?? []));
}
function firstNormalizedString(...values) {
	return normalizeOptionalString(values.find(hasNonEmptyString));
}
function maxDefinedTimestamp(...values) {
	const defined = values.filter((value) => value !== void 0);
	return defined.length > 0 ? Math.max(...defined) : void 0;
}
function resolveEffectiveLastSeen(live, devicePairing, nodePairing) {
	const candidates = [
		live?.connectedAtMs ? {
			atMs: live.connectedAtMs,
			reason: "connect"
		} : void 0,
		nodePairing?.lastSeenAtMs ? {
			atMs: nodePairing.lastSeenAtMs,
			reason: nodePairing.lastSeenReason
		} : void 0,
		nodePairing?.lastConnectedAtMs ? {
			atMs: nodePairing.lastConnectedAtMs,
			reason: "connect"
		} : void 0,
		devicePairing?.lastSeenAtMs ? {
			atMs: devicePairing.lastSeenAtMs,
			reason: devicePairing.lastSeenReason
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
function compareKnownNodes(left, right) {
	if (left.connected !== right.connected) return left.connected ? -1 : 1;
	const leftName = normalizeLowercaseStringOrEmpty(left.displayName ?? left.nodeId);
	const rightName = normalizeLowercaseStringOrEmpty(right.displayName ?? right.nodeId);
	if (leftName < rightName) return -1;
	if (leftName > rightName) return 1;
	return left.nodeId.localeCompare(right.nodeId);
}
function createKnownNodeCatalog(params) {
	const devicePairingById = new Map(params.pairedDevices.filter((entry) => hasNonEmptyString(entry.deviceId)).map((entry) => [entry.deviceId, entry]));
	const nodePairingById = new Map((params.pairedNodes ?? []).filter((entry) => hasNonEmptyString(entry.nodeId)).map((entry) => [entry.nodeId, {
		node: entry,
		commands: filterPublicNodeCommands(entry.commands ?? [])
	}]));
	const pendingNodePairingById = /* @__PURE__ */ new Map();
	for (const entry of params.pendingNodes ?? []) {
		if (!hasNonEmptyString(entry.nodeId)) continue;
		if (!pendingNodePairingById.has(entry.nodeId)) pendingNodePairingById.set(entry.nodeId, {
			...entry,
			caps: uniqueSortedStrings(entry.caps),
			commands: filterPublicNodeCommands(uniqueSortedStrings(entry.commands))
		});
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
		let pendingNodePairing = pendingNodePairingById.get(nodeId);
		if (pendingNodePairing && live) {
			const declaredPermissions = !nodePairing && live.declaredPermissions === void 0 ? pendingNodePairing.permissions : live.declaredPermissions;
			if (!sameNodeApprovalSurfaceSet(pendingNodePairing.caps, live.declaredCaps) || !sameNodeApprovalSurfaceSet(pendingNodePairing.commands, live.declaredCommands) || !sameNodePermissionSurface(pendingNodePairing.permissions, declaredPermissions)) pendingNodePairing = void 0;
		}
		const workerSlots = params.workerSlotsByNodeId?.get(nodeId);
		const workerBundle = params.workerBundleByNodeId?.get(nodeId);
		const issues = params.issuesByNodeId?.get(nodeId);
		const lastSeen = resolveEffectiveLastSeen(live, devicePairing, nodePairing);
		const lastConnectedAtMs = maxDefinedTimestamp(nodePairing?.lastConnectedAtMs, live?.connectedAtMs);
		const lastDisconnectedAtMs = live ? void 0 : nodePairing?.lastDisconnectedAtMs;
		const hostStats = live ? live.hostStats : nodePairing?.lastHostStats;
		const nodeMetadata = (key) => firstNormalizedString(live?.[key], nodePairing?.[key], pendingNodePairing?.[key]);
		catalog.set(nodeId, {
			nodeId,
			displayName: firstNormalizedString(nodePairing?.displayName, live?.displayName, devicePairing?.displayName, pendingNodePairing?.displayName),
			platform: firstNormalizedString(live?.platform, nodePairing?.platform, devicePairing?.platform, pendingNodePairing?.platform),
			version: nodeMetadata("version"),
			coreVersion: nodeMetadata("coreVersion"),
			uiVersion: nodeMetadata("uiVersion"),
			clientId: firstNormalizedString(live?.clientId, devicePairing?.clientId, pendingNodePairing?.clientId),
			clientMode: firstNormalizedString(live?.clientMode, devicePairing?.clientMode, pendingNodePairing?.clientMode),
			deviceFamily: nodeMetadata("deviceFamily"),
			modelIdentifier: nodeMetadata("modelIdentifier"),
			remoteIp: firstNormalizedString(live?.remoteIp, nodePairing?.remoteIp, devicePairing?.remoteIp, pendingNodePairing?.remoteIp),
			caps: live ? uniqueSortedStrings(live.caps) : uniqueSortedStrings(nodePairing?.caps),
			commands: filterPublicNodeCommands(live ? uniqueSortedStrings(live.commands) : uniqueSortedStrings(approved?.commands)),
			computerUse: live?.computerUse,
			sessionHost: live ? params.sessionHostNodeIds?.has(nodeId) === true : nodePairing?.sessionHost === true,
			...live && params.deviceFolderNodeIds?.has(nodeId) ? { workerHost: { deviceFolders: true } } : {},
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
		});
	}
	return catalog;
}
/** Lists known nodes with connected nodes first and deterministic display ordering. */
function listKnownNodes(catalog) {
	return [...catalog.values()].toSorted(compareKnownNodes);
}
//#endregion
//#region src/gateway/node-catalog-read.ts
const preparedCatalogs = /* @__PURE__ */ new WeakMap();
/** Pairing publications and registry mutations own the lifetime of these read-only projections. */
async function readKnownNodeCatalog(registry, view = "nodes") {
	const pairing = await readDevicePairingNodeSnapshot();
	const revision = readNodeCatalogRevision(registry);
	let prepared = preparedCatalogs.get(registry);
	if (!prepared || prepared.pairing !== pairing || prepared.revision !== revision || prepared.connectedNodes.some((node) => node.client.invalidated === true)) {
		prepared = {
			pairing,
			revision,
			connectedNodes: registry.listConnectedForPairingStates(pairing.bindings),
			views: /* @__PURE__ */ new Map()
		};
		preparedCatalogs.set(registry, prepared);
	}
	let result = prepared.views.get(view);
	if (!result) {
		const nodePairing = projectNodePairing(pairing.paired);
		const catalog = createKnownNodeCatalog({
			pairedDevices: pairing.paired.filter((device) => pairing.bindings.has(device.deviceId)),
			pairedNodes: nodePairing.paired,
			pendingNodes: view === "nodes" ? nodePairing.pending : void 0,
			connectedNodes: prepared.connectedNodes,
			...collectNodeCatalogRuntimeState(registry, prepared.connectedNodes, view === "worker-environments")
		});
		result = Object.freeze({
			nodes: freezeJsonSnapshot(structuredClone(listKnownNodes(catalog))),
			connectedNodes: Object.freeze(prepared.connectedNodes)
		});
		prepared.views.set(view, result);
	}
	return result;
}
//#endregion
export { readKnownNodeCatalog as t };
