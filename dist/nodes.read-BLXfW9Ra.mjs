import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { Dn as validateNodeDescribeParams, Nn as validateNodeListParams, Vn as validateNodePluginToolsUpdateParams, Wn as validateNodeSkillsUpdateParams } from "./src-l2dWvEsN.mjs";
import { t as ErrorCodes } from "./gateway-error-details-DIefe7Zy.mjs";
import { f as errorShape } from "./error-codes-Dh56LniQ.mjs";
import { i as listDevicePairing } from "./device-pairing-Drmq_Czv.mjs";
import { i as recordRemoteNodeInfo, o as refreshRemoteNodeBins, u as updatePairedNodeSessionHost } from "./remote-Da_JQTVV.mjs";
import { n as projectNodePairing } from "./device-pairing-node.records-Fl7vnrHF.mjs";
import { a as listNodePairing } from "./device-pairing-node-HEhf89hA.mjs";
import { n as NODE_RUNNER_UPDATE_REQUIRED_ISSUE, o as formatNodeRunnerInventoryIssue, s as parseNodeRunnerInventoryDeclaration } from "./node-runner-inventory-BGg-lRhv.mjs";
import { d as updateNodeRunnerInventory, t as collectNodeCatalogRuntimeState } from "./node-registry-private-CyaYRwVd.mjs";
import { f as refreshClientPluginNodeCapability, i as hasAuthorizedClientPluginNodeCapabilityUrl, l as pluginNodeCapabilityScopedHostUrlsConflict } from "./plugin-node-capability-BlHl5bub.mjs";
import { t as assertValidParams } from "./validation-Bu27N0nv.mjs";
import { n as respondUnavailableOnThrow } from "./response-BKwLtoRW.mjs";
import { o as projectPairedDeviceNodeBindings } from "./device-pairing-node-state-BWkfmloU.mjs";
import { n as getKnownNode, r as listKnownNodes, t as createKnownNodeCatalog } from "./node-catalog-BIBvC887.mjs";
import { t as nodeInvokePolicy } from "./nodes-policy-fOzIq_sI.mjs";
import { t as resolveLocalNodeId } from "./local-id-CNgfsz_n.mjs";
//#region src/gateway/server-methods/nodes.read.ts
function safeNodeReadProjection(node, ownDeviceId) {
	if (!node.paired && !node.connected) return null;
	const { pendingRequestId, pendingDeclaredCaps: _pendingDeclaredCaps, pendingDeclaredCommands: _pendingDeclaredCommands, pendingDeclaredPermissions: _pendingDeclaredPermissions, ...safeNode } = node;
	return node.nodeId === ownDeviceId && pendingRequestId ? {
		...safeNode,
		pendingRequestId
	} : safeNode;
}
function respondRunnerInventoryRetry(respond, message) {
	respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, message));
}
async function listNodesForClient(params) {
	const devicePairing = await listDevicePairing();
	const nodePairing = projectNodePairing(devicePairing.paired);
	const connectedNodes = params.context.nodeRegistry.listConnectedForPairingStates(projectPairedDeviceNodeBindings(devicePairing.paired));
	const runtimeState = collectNodeCatalogRuntimeState(params.context.nodeRegistry, connectedNodes);
	const catalog = createKnownNodeCatalog({
		pairedDevices: devicePairing.paired,
		pairedNodes: nodePairing.paired,
		pendingNodes: nodePairing.pending,
		connectedNodes,
		...runtimeState
	});
	const localNodeId = await resolveLocalNodeId().catch((error) => {
		params.context.logGateway.warn(`failed to resolve same-install node-host identity: ${formatErrorMessage(error)}`);
		return null;
	});
	const nodes = (params.nodeId ? [getKnownNode(catalog, params.nodeId)].filter((node) => node !== null) : listKnownNodes(catalog)).map((node) => node.nodeId === localNodeId ? Object.assign({}, node, { gatewayLocal: true }) : node);
	if (nodeInvokePolicy.canReadPendingNodePairing(params.client)) return {
		nodes,
		connectedNodes
	};
	const ownDeviceId = normalizeOptionalString(params.client?.connect?.device?.id);
	return {
		nodes: nodes.map((node) => safeNodeReadProjection(node, ownDeviceId)).filter((node) => node !== null),
		connectedNodes
	};
}
function normalizePluginSurfaceRefreshParams(params) {
	if (!params || typeof params !== "object") return;
	const surface = normalizeOptionalString(params.surface);
	if (!surface) return;
	const observedUrl = normalizeOptionalString(params.observedUrl);
	return {
		surface,
		...observedUrl ? { observedUrl } : {}
	};
}
const handlePluginSurfaceRefresh = ({ params, respond, client }) => {
	const parsed = normalizePluginSurfaceRefreshParams(params);
	if (!parsed) {
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "surface required"));
		return;
	}
	const { surface, observedUrl } = parsed;
	const currentUrl = client?.pluginSurfaceUrls?.[surface];
	const capabilitySurface = client?.pluginNodeCapabilitySurfaces?.[surface] ?? { surface };
	if (client && currentUrl && observedUrl && pluginNodeCapabilityScopedHostUrlsConflict(currentUrl, observedUrl) && hasAuthorizedClientPluginNodeCapabilityUrl({
		client,
		surface: capabilitySurface,
		url: currentUrl
	})) {
		respond(true, {
			surface,
			pluginSurfaceUrls: { [surface]: currentUrl }
		}, void 0);
		return;
	}
	const refreshed = client ? refreshClientPluginNodeCapability({
		client,
		surface: capabilitySurface
	}) : void 0;
	if (!refreshed) {
		respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, `${surface} plugin surface unavailable`));
		return;
	}
	respond(true, {
		surface: refreshed.surface,
		pluginSurfaceUrls: { [refreshed.surface]: refreshed.scopedUrl },
		expiresAtMs: refreshed.expiresAtMs
	}, void 0);
};
function refreshConnectedNodeSurfaceCaches(params) {
	const cfg = params.cfg ?? params.context.getRuntimeConfig();
	const { nodeSession } = params;
	recordRemoteNodeInfo({
		nodeId: nodeSession.nodeId,
		connId: nodeSession.connId,
		displayName: nodeSession.displayName,
		platform: nodeSession.platform,
		deviceFamily: nodeSession.deviceFamily,
		commands: nodeSession.commands,
		remoteIp: nodeSession.remoteIp,
		pairingGeneration: nodeSession.pairingGeneration
	});
	refreshRemoteNodeBins({
		nodeId: nodeSession.nodeId,
		platform: nodeSession.platform,
		deviceFamily: nodeSession.deviceFamily,
		commands: nodeSession.commands,
		cfg
	}).catch((err) => params.context.logGateway.warn(`remote bin probe failed for ${nodeSession.nodeId}: ${formatErrorMessage(err)}`));
}
const nodeReadHandlers = {
	"node.list": async ({ params, respond, client, context }) => {
		if (!assertValidParams(params, validateNodeListParams, "node.list", respond)) return;
		await respondUnavailableOnThrow(respond, async () => {
			const { nodes, connectedNodes } = await listNodesForClient({
				client,
				context
			});
			const activeNodeId = context.nodeRegistry.getActiveNode(connectedNodes)?.nodeId;
			const nodesWithPresence = activeNodeId ? nodes.map((node) => node.nodeId === activeNodeId ? {
				...node,
				active: true
			} : node) : nodes;
			respond(true, {
				ts: Date.now(),
				activeNodeId,
				nodes: nodesWithPresence
			}, void 0);
		});
	},
	"node.describe": async ({ params, respond, client, context }) => {
		if (!assertValidParams(params, validateNodeDescribeParams, "node.describe", respond)) return;
		const { nodeId } = params;
		const id = normalizeOptionalString(nodeId) ?? "";
		if (!id) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "nodeId required"));
			return;
		}
		await respondUnavailableOnThrow(respond, async () => {
			const { nodes, connectedNodes } = await listNodesForClient({
				client,
				context,
				nodeId: id
			});
			const node = nodes[0];
			if (!node) {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "unknown nodeId"));
				return;
			}
			respond(true, {
				ts: Date.now(),
				...node,
				...context.nodeRegistry.getActiveNode(connectedNodes)?.nodeId === id ? { active: true } : {}
			}, void 0);
		});
	},
	"plugin.surface.refresh": handlePluginSurfaceRefresh,
	"node.pluginSurface.refresh": handlePluginSurfaceRefresh,
	"node.pluginTools.update": async ({ params, respond, client, context }) => {
		if (!assertValidParams(params, validateNodePluginToolsUpdateParams, "node.pluginTools.update", respond)) return;
		const nodeId = normalizeOptionalString(client?.connect?.device?.id ?? client?.connect?.client?.id);
		if (!nodeId) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "nodeId required"));
			return;
		}
		const updated = context.nodeRegistry.updateNodePluginTools(nodeId, client?.connId, params.tools);
		if (!updated) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "unknown nodeId"));
			return;
		}
		respond(true, {
			nodeId,
			tools: updated.nodePluginTools
		}, void 0);
	},
	"node.skills.update": async ({ params, respond, client, context }) => {
		if (!assertValidParams(params, validateNodeSkillsUpdateParams, "node.skills.update", respond)) return;
		const nodeId = normalizeOptionalString(client?.connect?.device?.id ?? client?.connect?.client?.id);
		if (!nodeId) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "nodeId required"));
			return;
		}
		const updated = context.nodeRegistry.updateNodeSkills(nodeId, client?.connId, params.skills);
		if (!updated) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "unknown nodeId"));
			return;
		}
		respond(true, {
			nodeId,
			skills: updated.nodeSkills
		}, void 0);
	},
	"node.runnerInventory.update": async ({ params, respond, client, context }) => {
		const declaration = parseNodeRunnerInventoryDeclaration(params);
		if (!declaration) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "invalid node runner inventory"));
			return;
		}
		const nodeId = normalizeOptionalString(client?.connect?.device?.id);
		const updated = nodeId ? updateNodeRunnerInventory({
			registry: context.nodeRegistry,
			nodeId,
			connId: client?.connId,
			declaration
		}) : null;
		if (!nodeId || !updated) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "unknown nodeId"));
			return;
		}
		if (declaration.protocolFeatures.length === 1 && declaration.protocolFeatures[0] !== "node-worker-supervisor-v6") {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, formatNodeRunnerInventoryIssue(nodeId, NODE_RUNNER_UPDATE_REQUIRED_ISSUE)));
			return;
		}
		const connId = client?.connId;
		const currentSession = context.nodeRegistry.get(nodeId);
		const pairingGeneration = currentSession && currentSession.connId === connId ? currentSession.pairingGeneration : void 0;
		if (!connId || !pairingGeneration) {
			const pendingSurface = (await listNodePairing()).pending.find((entry) => entry.nodeId === nodeId);
			respondRunnerInventoryRetry(respond, pendingSurface ? `node capability surface is awaiting operator approval; run \`openclaw nodes approve ${pendingSurface.requestId}\` (see \`openclaw nodes pending\`), then this node retries automatically` : "node runner inventory publication is not current; retry after pairing completes");
			return;
		}
		const sessionHost = "workerHost" in declaration && declaration.workerHost.enabled;
		try {
			if (!await updatePairedNodeSessionHost({
				nodeId,
				sessionHost,
				expectedPairingGeneration: {
					nodeId,
					key: pairingGeneration
				},
				isConnectionCurrent: () => {
					const current = context.nodeRegistry.get(nodeId);
					return current?.connId === connId && current.pairingGeneration === pairingGeneration && current.client.invalidated !== true;
				}
			})) {
				respondRunnerInventoryRetry(respond, "node runner inventory publication lost its pairing ownership; retry");
				return;
			}
		} catch (error) {
			context.logGateway.warn(`failed to persist runner host consent for ${nodeId}: ${formatErrorMessage(error)}`);
			respondRunnerInventoryRetry(respond, "node runner inventory persistence failed; retry");
			return;
		}
		respond(true, { nodeId }, void 0);
	}
};
//#endregion
export { refreshConnectedNodeSurfaceCaches as n, nodeReadHandlers as t };
