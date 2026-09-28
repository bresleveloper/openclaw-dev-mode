import { c as normalizeOptionalLowercaseString } from "./string-coerce-CIXf7egm.mjs";
import { r as serializeEventPayload, t as NodeRegistry } from "./node-registry-zajLqj5_.mjs";
import { l as setNodeRunnerStateChangedListener, n as createNodeRegistryRuntime } from "./node-registry-private-DQxtvo06.mjs";
import { n as GATEWAY_EVENT_NODE_RUNNER_INVENTORY_CHANGED } from "./events-J-3spXBQ.mjs";
import { a as isPairedDeviceNodeBindingCurrent, s as resolveCurrentPairedDeviceNodeBinding } from "./device-pairing-node-state-BxpHZHxS.mjs";
//#region src/gateway/server-node-subscriptions.ts
/** Manages node subscriptions to gateway session events. */
function createNodeSubscriptionManager() {
	const nodeSubscriptions = /* @__PURE__ */ new Map();
	const sessionSubscribers = /* @__PURE__ */ new Map();
	const toPayloadJSON = (payload) => {
		try {
			return serializeEventPayload(payload);
		} catch {
			return;
		}
	};
	const settleFanout = async (entries, createSend) => {
		await Promise.allSettled(Array.from(entries, (entry) => Promise.resolve().then(createSend(entry))));
	};
	const subscribe = (nodeId, pairingGeneration, sessionKey) => {
		const normalizedNodeId = nodeId.trim();
		const normalizedPairingGeneration = pairingGeneration.trim();
		const normalizedSessionKey = sessionKey.trim();
		if (!normalizedNodeId || !normalizedPairingGeneration || !normalizedSessionKey) return;
		let nodeEntry = nodeSubscriptions.get(normalizedNodeId);
		if (nodeEntry?.pairingGeneration !== normalizedPairingGeneration) {
			unsubscribeAll(normalizedNodeId);
			nodeEntry = void 0;
		}
		if (!nodeEntry) {
			nodeEntry = {
				pairingGeneration: normalizedPairingGeneration,
				sessionKeys: /* @__PURE__ */ new Set()
			};
			nodeSubscriptions.set(normalizedNodeId, nodeEntry);
		}
		if (nodeEntry.sessionKeys.has(normalizedSessionKey)) return;
		nodeEntry.sessionKeys.add(normalizedSessionKey);
		let sessionMap = sessionSubscribers.get(normalizedSessionKey);
		if (!sessionMap) {
			sessionMap = /* @__PURE__ */ new Map();
			sessionSubscribers.set(normalizedSessionKey, sessionMap);
		}
		sessionMap.set(normalizedNodeId, normalizedPairingGeneration);
	};
	const unsubscribe = (nodeId, pairingGeneration, sessionKey) => {
		const normalizedNodeId = nodeId.trim();
		const normalizedPairingGeneration = pairingGeneration.trim();
		const normalizedSessionKey = sessionKey.trim();
		if (!normalizedNodeId || !normalizedPairingGeneration || !normalizedSessionKey) return;
		const nodeEntry = nodeSubscriptions.get(normalizedNodeId);
		if (nodeEntry?.pairingGeneration !== normalizedPairingGeneration) return;
		nodeEntry.sessionKeys.delete(normalizedSessionKey);
		if (nodeEntry.sessionKeys.size === 0) nodeSubscriptions.delete(normalizedNodeId);
		const sessionMap = sessionSubscribers.get(normalizedSessionKey);
		if (sessionMap?.get(normalizedNodeId) === normalizedPairingGeneration) sessionMap.delete(normalizedNodeId);
		if (sessionMap?.size === 0) sessionSubscribers.delete(normalizedSessionKey);
	};
	function unsubscribeAll(nodeId, pairingGeneration) {
		const normalizedNodeId = nodeId.trim();
		const nodeEntry = nodeSubscriptions.get(normalizedNodeId);
		if (!nodeEntry || pairingGeneration !== void 0 && nodeEntry.pairingGeneration !== pairingGeneration.trim()) return;
		for (const sessionKey of nodeEntry.sessionKeys) {
			const sessionMap = sessionSubscribers.get(sessionKey);
			if (sessionMap?.get(normalizedNodeId) === nodeEntry.pairingGeneration) sessionMap.delete(normalizedNodeId);
			if (sessionMap?.size === 0) sessionSubscribers.delete(sessionKey);
		}
		nodeSubscriptions.delete(normalizedNodeId);
	}
	const updatePairingGeneration = (params) => {
		const normalizedNodeId = params.nodeId.trim();
		const previousPairingGeneration = params.previousPairingGeneration.trim();
		const nextPairingGeneration = params.nextPairingGeneration.trim();
		const nodeEntry = nodeSubscriptions.get(normalizedNodeId);
		if (!nodeEntry || !previousPairingGeneration || nodeEntry.pairingGeneration !== previousPairingGeneration) return;
		if (!params.preserveSubscriptions || !nextPairingGeneration) {
			unsubscribeAll(normalizedNodeId, previousPairingGeneration);
			return;
		}
		nodeEntry.pairingGeneration = nextPairingGeneration;
		for (const sessionKey of nodeEntry.sessionKeys) sessionSubscribers.get(sessionKey)?.set(normalizedNodeId, nextPairingGeneration);
	};
	const sendToSession = async (sessionKey, event, payload, sendEvent) => {
		const normalizedSessionKey = sessionKey.trim();
		if (!normalizedSessionKey || !sendEvent) return;
		const subscribers = sessionSubscribers.get(normalizedSessionKey);
		if (!subscribers || subscribers.size === 0) return;
		const payloadJSON = toPayloadJSON(payload);
		if (payloadJSON === void 0) return;
		await settleFanout(subscribers, ([nodeId, pairingGeneration]) => () => sendEvent({
			nodeId,
			pairingGeneration,
			event,
			payloadJSON
		}));
	};
	const sendToAllSubscribed = async (event, payload, sendEvent) => {
		if (!sendEvent) return;
		const payloadJSON = toPayloadJSON(payload);
		if (payloadJSON === void 0) return;
		await settleFanout(nodeSubscriptions, ([nodeId, subscription]) => () => sendEvent({
			nodeId,
			pairingGeneration: subscription.pairingGeneration,
			event,
			payloadJSON
		}));
	};
	return {
		subscribe,
		unsubscribe,
		unsubscribeAll,
		hasSubscribers: (sessionKey) => sessionSubscribers.has(sessionKey.trim()),
		updatePairingGeneration,
		sendToSession,
		sendToAllSubscribed
	};
}
//#endregion
//#region src/gateway/talk/nodes.ts
const TALK_CAPABILITY = "talk";
const TALK_COMMAND_PREFIX = "talk.";
/** Returns true when any connected node can handle talk routing. */
async function hasConnectedTalkNode(registry) {
	return (await registry.listCurrentConnected()).some(isTalkCapableNode);
}
function isTalkCapableNode(node) {
	return node.caps.some((capability) => normalizeOptionalLowercaseString(capability) === TALK_CAPABILITY) || node.commands.some((command) => normalizeOptionalLowercaseString(command)?.startsWith(TALK_COMMAND_PREFIX));
}
//#endregion
//#region src/gateway/server-node-session-runtime.ts
/** Creates node registry/subscription runtime state for a gateway server. */
function createGatewayNodeSessionRuntime(params) {
	const nodeSubscriptions = createNodeSubscriptionManager();
	const { nodeRegistry, nodeWorkerSupervisorTransport } = createNodeRegistryRuntime(() => new NodeRegistry({
		listRegisteredNodePluginToolCommands: params.listRegisteredNodePluginToolCommands,
		getConfig: params.getConfig,
		resolveCurrentPairingState: params.resolveCurrentPairingState ?? resolveCurrentPairedDeviceNodeBinding,
		isPairingStateCurrent: params.isPairingStateCurrent ?? isPairedDeviceNodeBindingCurrent,
		onPairingInvalidated: params.onPairingInvalidated,
		onDesktopAvailabilityChanged: (nodeId) => {
			params.broadcast(GATEWAY_EVENT_NODE_RUNNER_INVENTORY_CHANGED, { nodeId }, { dropIfSlow: true });
		},
		onPairingGenerationChanged: (change) => {
			nodeSubscriptions.updatePairingGeneration({
				...change,
				preserveSubscriptions: change.preserveSessionState
			});
			params.onPairingGenerationChanged?.(change);
		}
	}));
	setNodeRunnerStateChangedListener(nodeRegistry, (nodeId, change) => {
		params.onRunnerStateChanged?.(nodeId, change);
		if (change.inventoryChanged || change.availabilityChanged) params.broadcast(GATEWAY_EVENT_NODE_RUNNER_INVENTORY_CHANGED, { nodeId }, { dropIfSlow: true });
		if (change.availabilityChanged) params.broadcast("sessions.changed", { reason: "runner-availability" }, { dropIfSlow: true });
	});
	const nodePresenceTimers = /* @__PURE__ */ new Map();
	const sessionEventSubscribers = params.sessionEventSubscribers;
	const sessionMessageSubscribers = params.sessionMessageSubscribers;
	const nodeSendEvent = (opts) => {
		return nodeRegistry.sendEventRawForPairingGeneration(opts.nodeId, opts.pairingGeneration, opts.event, opts.payloadJSON ?? null);
	};
	const nodeSendToSession = (sessionKey, event, payload) => {
		nodeSubscriptions.sendToSession(sessionKey, event, payload, nodeSendEvent);
	};
	const nodeSendToAllSubscribed = (event, payload) => {
		nodeSubscriptions.sendToAllSubscribed(event, payload, nodeSendEvent);
	};
	const resolveSubscriptionGeneration = (nodeId, connId) => {
		const node = nodeRegistry.get(nodeId);
		return connId && node?.connId === connId ? node.pairingGeneration : void 0;
	};
	const nodeSubscribe = (nodeId, sessionKey, connId) => {
		const pairingGeneration = resolveSubscriptionGeneration(nodeId, connId);
		if (pairingGeneration) nodeSubscriptions.subscribe(nodeId, pairingGeneration, sessionKey);
	};
	const nodeUnsubscribe = (nodeId, sessionKey, connId) => {
		const pairingGeneration = resolveSubscriptionGeneration(nodeId, connId);
		if (pairingGeneration) nodeSubscriptions.unsubscribe(nodeId, pairingGeneration, sessionKey);
	};
	const sendVoiceWakeEventToCurrentNodes = (event, payload) => {
		const payloadJSON = serializeEventPayload(payload);
		for (const node of nodeRegistry.listConnected()) {
			const pairingGeneration = node.pairingGeneration;
			if (!pairingGeneration) {
				if (node.pairingIdentity) nodeRegistry.sendEventForPairingIdentity({
					nodeId: node.nodeId,
					connId: node.connId,
					pairingIdentity: node.pairingIdentity,
					event,
					payload
				}).catch(() => void 0);
				continue;
			}
			nodeRegistry.sendEventRawForPairingGeneration(node.nodeId, pairingGeneration, event, payloadJSON).catch(() => void 0);
		}
	};
	const broadcastVoiceWakeChanged = (triggers) => {
		params.broadcast("voicewake.changed", { triggers }, { dropIfSlow: true });
		sendVoiceWakeEventToCurrentNodes("voicewake.changed", { triggers });
	};
	const broadcastVoiceWakeRoutingChanged = (config) => {
		params.broadcast("voicewake.routing.changed", { config }, { dropIfSlow: true });
		sendVoiceWakeEventToCurrentNodes("voicewake.routing.changed", { config });
	};
	const hasTalkNodeConnected = () => hasConnectedTalkNode(nodeRegistry);
	return {
		nodeRegistry,
		nodeWorkerSupervisorTransport,
		nodePresenceTimers,
		sessionEventSubscribers,
		sessionMessageSubscribers,
		nodeHasSessionSubscribers: nodeSubscriptions.hasSubscribers,
		nodeSendToSession,
		nodeSendToAllSubscribed,
		nodeSubscribe,
		nodeUnsubscribe,
		nodeUnsubscribeAll: nodeSubscriptions.unsubscribeAll,
		broadcastVoiceWakeChanged,
		broadcastVoiceWakeRoutingChanged,
		hasTalkNodeConnected
	};
}
//#endregion
export { createGatewayNodeSessionRuntime };
