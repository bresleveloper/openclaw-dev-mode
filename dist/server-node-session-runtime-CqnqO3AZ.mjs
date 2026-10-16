import { c as normalizeOptionalLowercaseString } from "./string-coerce-1VuiLaaR.mjs";
import { r as serializeEventPayload, t as NodeRegistry } from "./node-registry-CuiJDygJ.mjs";
import { l as setNodeRunnerStateChangedListener, n as createNodeRegistryRuntime } from "./node-registry-private-CyaYRwVd.mjs";
import { n as GATEWAY_EVENT_NODE_RUNNER_INVENTORY_CHANGED } from "./events-D023Lo1g.mjs";
import { a as isPairedDeviceNodeBindingCurrent, s as resolveCurrentPairedDeviceNodeBinding } from "./device-pairing-node-state-BWkfmloU.mjs";
import { t as isLiveTextAppend } from "./live-text-continuity-CerU9eca.mjs";
//#region src/gateway/server-node-subscriptions.ts
/** Manages node subscriptions to gateway session events. */
function createNodeSubscriptionManager() {
	const nodeSubscriptions = /* @__PURE__ */ new Map();
	const sessionSubscribers = /* @__PURE__ */ new Map();
	const liveTextGroups = /* @__PURE__ */ new WeakMap();
	const isPublicationCurrent = (publication) => {
		try {
			return publication.isCurrent?.() !== false;
		} catch {
			return false;
		}
	};
	const currentSubscription = (nodeId, recipient) => {
		for (const [key, subscription] of recipient.subscriptions) if (sessionSubscribers.get(key)?.get(nodeId) === subscription && subscription.pairingGeneration === recipient.pairingGeneration) return subscription;
	};
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
				sessionKeys: /* @__PURE__ */ new Map()
			};
			nodeSubscriptions.set(normalizedNodeId, nodeEntry);
		}
		if (nodeEntry.sessionKeys.has(normalizedSessionKey)) return;
		const subscription = { pairingGeneration: normalizedPairingGeneration };
		nodeEntry.sessionKeys.set(normalizedSessionKey, subscription);
		let sessionMap = sessionSubscribers.get(normalizedSessionKey);
		if (!sessionMap) {
			sessionMap = /* @__PURE__ */ new Map();
			sessionSubscribers.set(normalizedSessionKey, sessionMap);
		}
		sessionMap.set(normalizedNodeId, subscription);
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
		if (sessionMap?.get(normalizedNodeId)?.pairingGeneration === normalizedPairingGeneration) sessionMap.delete(normalizedNodeId);
		if (sessionMap?.size === 0) sessionSubscribers.delete(normalizedSessionKey);
	};
	function unsubscribeAll(nodeId, pairingGeneration) {
		const normalizedNodeId = nodeId.trim();
		const nodeEntry = nodeSubscriptions.get(normalizedNodeId);
		if (!nodeEntry || pairingGeneration !== void 0 && nodeEntry.pairingGeneration !== pairingGeneration.trim()) return;
		for (const sessionKey of nodeEntry.sessionKeys.keys()) {
			const sessionMap = sessionSubscribers.get(sessionKey);
			if (sessionMap?.get(normalizedNodeId)?.pairingGeneration === nodeEntry.pairingGeneration) sessionMap.delete(normalizedNodeId);
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
		for (const subscription of nodeEntry.sessionKeys.values()) subscription.pairingGeneration = nextPairingGeneration;
	};
	const sendToSession = async (sessionKey, event, payload, sendEvent, opts) => {
		const normalizedSessionKey = sessionKey.trim();
		if (!normalizedSessionKey || !sendEvent) return;
		const sessionKeys = [...new Set((opts?.sessionKeys ?? [normalizedSessionKey]).map((key) => key.trim()).filter(Boolean))];
		const subscribers = /* @__PURE__ */ new Map();
		for (const key of sessionKeys) for (const [nodeId, subscription] of sessionSubscribers.get(key) ?? []) {
			let recipient = subscribers.get(nodeId);
			if (!recipient) {
				recipient = {
					pairingGeneration: subscription.pairingGeneration,
					subscriptions: /* @__PURE__ */ new Map()
				};
				subscribers.set(nodeId, recipient);
			}
			recipient.subscriptions.set(key, subscription);
		}
		const liveText = opts?.liveText;
		if (liveText?.settle && !liveText.group.aborted) {
			for (const publication of liveTextGroups.get(liveText.group)?.pending ?? []) if (sessionKeys.some((key) => publication.sessionKeys.includes(key)) && isPublicationCurrent(publication)) publication.settled = true;
		}
		if (!subscribers.size) return;
		if (!liveText?.projection) {
			const payloadJSON = toPayloadJSON(payload);
			if (payloadJSON === void 0) return;
			return settleFanout(subscribers, ([nodeId, recipient]) => {
				return () => sendEvent({
					nodeId,
					pairingGeneration: recipient.pairingGeneration,
					event,
					payloadJSON,
					preparePayload: () => currentSubscription(nodeId, recipient) ? { payloadJSON } : void 0
				});
			});
		}
		if (liveText.group.aborted) return;
		const projection = liveText.projection;
		const streamKey = projection.key;
		let group = liveTextGroups.get(liveText.group);
		if (!group) {
			group = {
				publications: /* @__PURE__ */ new Map(),
				receipts: /* @__PURE__ */ new WeakMap(),
				pending: /* @__PURE__ */ new Set()
			};
			liveTextGroups.set(liveText.group, group);
			const retiredGroup = group;
			liveText.group.addEventListener("abort", () => {
				retiredGroup.publications.clear();
				if (retiredGroup.pending.size === 0) retiredGroup.receipts = /* @__PURE__ */ new WeakMap();
				liveTextGroups.delete(liveText.group);
			}, { once: true });
		}
		const latest = group.publications.get(streamKey);
		const previousPublication = latest?.sourceEpoch === liveText.sourceEpoch ? latest : void 0;
		const publication = {
			sourceEpoch: liveText.sourceEpoch,
			text: projection.text?.snapshot,
			version: projection.version,
			sessionKeys,
			isCurrent: liveText.isCurrent,
			settled: false
		};
		group.publications.set(streamKey, publication);
		const snapshot = projection.snapshot || projection.text !== void 0 && !isLiveTextAppend(previousPublication?.text, projection.text);
		let snapshotJSON;
		let deltaJSON;
		group.pending.add(publication);
		try {
			await settleFanout(subscribers, ([nodeId, recipient]) => {
				return () => sendEvent({
					nodeId,
					pairingGeneration: recipient.pairingGeneration,
					event,
					preparePayload: (connId) => {
						const subscription = currentSubscription(nodeId, recipient);
						if (!subscription || !publication.settled && (liveText.group.aborted || !isPublicationCurrent(publication))) return;
						const receipt = group.receipts.get(subscription)?.get(streamKey);
						const payloadJSON = !snapshot && receipt?.connId === connId && receipt.publication === previousPublication && Object.is(previousPublication?.version, publication.version) ? deltaJSON ??= toPayloadJSON(projection.delta(payload)) : snapshotJSON ??= toPayloadJSON(payload);
						if (payloadJSON === void 0) return;
						return {
							payloadJSON,
							onSent: () => {
								if (!liveText.group.aborted || publication.settled) {
									let receipts = group.receipts.get(subscription);
									if (!receipts) {
										receipts = /* @__PURE__ */ new Map();
										group.receipts.set(subscription, receipts);
									}
									receipts.set(streamKey, {
										connId,
										publication
									});
								}
							}
						};
					}
				});
			});
		} finally {
			group.pending.delete(publication);
			if (liveText.group.aborted && group.pending.size === 0) group.receipts = /* @__PURE__ */ new WeakMap();
		}
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
	const sessionEventSubscribers = params.sessionEventSubscribers;
	const sessionMessageSubscribers = params.sessionMessageSubscribers;
	const nodeSendEvent = (opts) => {
		return nodeRegistry.sendEventRawForPairingGeneration(opts.nodeId, opts.pairingGeneration, opts.event, opts.payloadJSON ?? null, opts.preparePayload);
	};
	const nodeSendToSession = (sessionKey, event, payload, opts) => nodeSubscriptions.sendToSession(sessionKey, event, payload, nodeSendEvent, opts);
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
