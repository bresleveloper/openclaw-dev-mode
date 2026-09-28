import { D as resolveExpiresAtMsFromDurationMs, a as addTimerTimeoutGraceMs, g as isFutureDateTimestampMs } from "./number-coercion-CLj0HTDM.mjs";
import "./src-CZ2wJvNB.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { t as createSubsystemLogger } from "./subsystem-DleLyu58.mjs";
import { n as GATEWAY_CLIENT_IDS } from "./client-info-B_ICKCYw.mjs";
import { N as isPrivateNodeInvokeCommand } from "./node-commands-BLhGKTZa.mjs";
import { m as parseComputerUseCapabilityDescriptor } from "./computer-use-contract-DzawlQtp.mjs";
import { i as MAX_BUFFERED_BYTES } from "./server-constants-Dx_kHnY5.mjs";
import { f as retainFulfilledNodeCapabilities, l as resolveNodeCommandAllowlist } from "./node-command-policy-CnGfXM76.mjs";
import { a as setActiveNodeContext } from "./active-node-context-Chc0tKJ6.mjs";
import { a as replaceRemoteNodeSkills, i as removeRemoteNodeSkills, r as recordRemoteSkillNodeInfo } from "./remote-skills-CZuGGEXx.mjs";
import { a as removeConnectedNodePluginTools, i as normalizeNodePluginToolDescriptors, o as replaceConnectedNodePluginTools, t as createRegisteredNodePluginToolDescriptorMap } from "./node-plugin-tool-snapshot-CrUFRJIH.mjs";
import { t as intersectNodePermissionSurface } from "./node-pairing-surface-B68Et9XU.mjs";
import { i as NODE_SKILL_NAME_RE } from "./node-skill-constraints-BWWr2p01.mjs";
import { n as logRejectedLargePayload } from "./diagnostic-payload-CxhAhghE.mjs";
import { t as resolveEffectiveComputerUseDescriptor } from "./node-computer-use-descriptor-D_tS4bop.mjs";
import { i as serializeNodeEvent, n as buildNodeInvokeInput, t as buildNodeInvokeCancel } from "./node-invoke-request-QpYVLB31.mjs";
import { a as invokePublicNodeRegistry, c as registerNodeRegistryPrivateRuntime, i as invokeLifecycleNodeRegistry, o as isNodeRegistryPendingInvokeConnectionActive, p as isNodeWorkerHostClientId, r as forgetNodeRunnerInventory, s as reconcileNodeRunnerAvailability, u as settleNodeRegistryPairingGenerationChange } from "./node-registry-private-DQxtvo06.mjs";
import { n as NodeInvokeStreamController } from "./node-registry.invoke-stream-DjYGQ16n.mjs";
import { t as closeGatewayTransportWithGrace } from "./connection-transport-close-KmUFxJkO.mjs";
//#region src/gateway/node-event-payload.ts
const SERIALIZED_EVENT_PAYLOAD = Symbol("openclaw.serializedEventPayload");
/** Serialize an event payload once so fanout can reuse the same JSON string. */
function serializeEventPayload(payload) {
	if (payload === void 0) return null;
	const json = JSON.stringify(payload);
	return typeof json === "string" ? {
		json,
		[SERIALIZED_EVENT_PAYLOAD]: true
	} : null;
}
/** Narrow values created by serializeEventPayload. */
function isSerializedEventPayload(value) {
	return typeof value === "object" && value !== null && Reflect.get(value, SERIALIZED_EVENT_PAYLOAD) === true && typeof Reflect.get(value, "json") === "string";
}
//#endregion
//#region src/gateway/node-registry-pairing.ts
function pairingBindingForSession(node) {
	return {
		identity: node.pairingIdentity,
		...node.pairingGeneration ? { generation: node.pairingGeneration } : {}
	};
}
function pairingStateMatchesBinding(binding, current) {
	if (!current) return false;
	if (binding.identity !== current.identity) return false;
	return !binding.generation || binding.generation === current.generation;
}
function isPublishedPairingCurrent(node, isPairingStateCurrent) {
	if (!isPairingStateCurrent) return true;
	try {
		return Boolean(node.pairingIdentity && isPairingStateCurrent(node.nodeId, {
			identity: node.pairingIdentity,
			...node.pairingGeneration ? { generation: node.pairingGeneration } : {}
		}));
	} catch {
		return false;
	}
}
//#endregion
//#region src/gateway/node-registry.presence.ts
const presenceSources = /* @__PURE__ */ new WeakMap();
function updateNodePresenceActivity(node, params) {
	const source = params.source ?? "system";
	if (!node || !params.connId || node.connId !== params.connId || node.client.socket.readyState !== 1) return null;
	if (source === "app") {
		if (node.clientId !== GATEWAY_CLIENT_IDS.MACOS_APP || node.clientMode !== "node" || !/^(?:darwin|macos(?: \d+(?:\.\d+){0,2})?)$/i.test(node.platform ?? "")) return null;
	} else if (node.permissions?.accessibility !== true) return null;
	const observedAtMs = params.observedAtMs ?? Date.now();
	const lastActiveAtMs = Math.max(0, observedAtMs - params.idleSeconds * 1e3);
	if (presenceSources.get(node) !== source) node.lastActiveAtMs = lastActiveAtMs;
	else if (params.saturated !== true || node.lastActiveAtMs === void 0) node.lastActiveAtMs = Math.max(node.lastActiveAtMs ?? 0, lastActiveAtMs);
	presenceSources.set(node, source);
	node.presenceUpdatedAtMs = observedAtMs;
	return node;
}
function clearNodePresenceActivity(node, connId, source) {
	if (!node || !connId || node.connId !== connId) return null;
	if (source === "system" && presenceSources.get(node) === "app" || node.lastActiveAtMs === void 0 && node.presenceUpdatedAtMs === void 0) return false;
	node.lastActiveAtMs = void 0;
	node.presenceUpdatedAtMs = void 0;
	presenceSources.delete(node);
	return true;
}
//#endregion
//#region src/gateway/node-skill-descriptors.ts
const log$1 = createSubsystemLogger("gateway/node-skills");
function normalizeNodeSkillDescriptors(params) {
	if (params.enabled === false) return [];
	const normalized = [];
	const seen = /* @__PURE__ */ new Set();
	let totalBytes = 0;
	let droppedCount = 0;
	for (const skill of params.skills ?? []) {
		const name = skill.name.trim();
		const description = skill.description.trim();
		const contentBytes = Buffer.byteLength(skill.content, "utf8");
		if (!NODE_SKILL_NAME_RE.test(name) || !description || description.length > 1024 || !skill.content || contentBytes > 65536 || seen.has(name) || normalized.length >= 64 || totalBytes + contentBytes > 524288) {
			droppedCount += 1;
			continue;
		}
		seen.add(name);
		totalBytes += contentBytes;
		normalized.push({
			name,
			description,
			content: skill.content
		});
	}
	if (droppedCount > 0) log$1.warn(`node ${params.nodeId} published ${params.skills?.length ?? 0} skill descriptors; dropped ${droppedCount} invalid or over-limit descriptors`);
	return normalized.toSorted((left, right) => left.name.localeCompare(right.name, "en"));
}
//#endregion
//#region src/gateway/node-registry.ts
const NODE_SESSION_POLICIES = /* @__PURE__ */ new WeakMap();
/** Reads commands withheld by current policy from the live session's declaration. */
function readNodeSessionWithheldCommands(node) {
	return NODE_SESSION_POLICIES.get(node)?.withheldCommands ?? [];
}
const AUTHORIZED_SYSTEM_RUN_EVENT_GRACE_MS = 3e5;
const SLOW_CONSUMER_CLOSE_CODE = 1008;
const FAILED_EVENT_LOG_INTERVAL_MS = 3e4;
const log = createSubsystemLogger("gateway/nodes");
const failedEventLogAtByNode = /* @__PURE__ */ new WeakMap();
/** Registry of currently connected Gateway nodes. */
var NodeRegistry = class {
	constructor(options = {}) {
		this.options = options;
		this.nodesById = /* @__PURE__ */ new Map();
		this.nodesByConn = /* @__PURE__ */ new Map();
		this.eventTransportsByConn = /* @__PURE__ */ new Map();
		this.pendingInvokes = /* @__PURE__ */ new Map();
		this.invokeStreams = new NodeInvokeStreamController({
			pendingInvokes: this.pendingInvokes,
			sendCancel: (requestId, pending) => {
				const node = this.nodesById.get(pending.nodeId);
				if (!node || node.connId !== pending.connId || !pending.onProgress && (!isNodeWorkerHostClientId(node.clientId) || node.clientMode !== "node")) return;
				this.sendEventToSession(node, "node.invoke.cancel", buildNodeInvokeCancel({
					invokeId: requestId,
					nodeId: pending.nodeId
				}));
			},
			isConnectionActive: (pending) => {
				const node = this.nodesById.get(pending.nodeId);
				return isNodeRegistryPendingInvokeConnectionActive({
					registry: this,
					pending,
					currentNode: node
				});
			},
			isCommandAllowed: (nodeId, command) => this.isCommandAllowed(nodeId, command),
			sendInput: (invokeId, pending, seq, payloadJSON) => {
				const node = this.nodesById.get(pending.nodeId);
				return node ? this.sendEventToSession(node, "node.invoke.input", buildNodeInvokeInput({
					invokeId,
					nodeId: pending.nodeId,
					seq,
					payloadJSON
				})) : false;
			},
			onFailedResult: (pending) => {
				if (pending.systemRunEvent) this.forgetAuthorizedSystemRunEvent({
					nodeId: pending.nodeId,
					connId: pending.connId,
					...pending.systemRunEvent
				});
			},
			disconnectPending: (pending) => {
				if (pending.command === "mcp.tools.call.v1") pending.resolve({
					ok: false,
					error: {
						code: "MCP_SERVER_UNAVAILABLE",
						message: "node host disconnected during MCP tool call"
					}
				});
				else pending.resolve({
					ok: false,
					error: {
						code: "DISCONNECTED",
						message: `node disconnected (${pending.command})`
					}
				});
			}
		});
		this.authorizedSystemRunEvents = /* @__PURE__ */ new Map();
		this.pairingGenerationEventChains = /* @__PURE__ */ new Map();
		this.committedConfig = options.getConfig?.();
		registerNodeRegistryPrivateRuntime(this, {
			getNode: (nodeId) => this.nodesById.get(nodeId),
			isCommandAllowed: (nodeId, command) => this.isCommandAllowed(nodeId, command, this.options.getConfig?.()),
			listCurrentConnected: () => this.listCurrentConnected(),
			getCurrentConnected: (nodeId) => this.getCurrentConnected(nodeId),
			hasCurrentPairingStateResolver: Boolean(this.options.resolveCurrentPairingState),
			resolvePairingLease: async (node) => {
				const current = this.nodesById.get(node.nodeId);
				if (!current || current.connId !== node.connId || current.pairingIdentity !== node.pairingIdentity || current.pairingGeneration !== node.pairingGeneration) return {
					status: "stale",
					presenceInvalidated: false
				};
				return await this.resolvePairingLease(this.capturePairingLease(current), { invalidateStale: false });
			},
			pendingInvokes: this.pendingInvokes,
			invokeStreams: this.invokeStreams,
			sendEventToSession: (node, event, payload) => {
				const current = this.nodesById.get(node.nodeId);
				return current?.connId === node.connId ? this.sendEventToSession(current, event, payload) : false;
			},
			rememberAuthorizedSystemRunEvent: (event) => this.rememberAuthorizedSystemRunEvent(event),
			publishActiveNodeContext: () => this.publishActiveNodeContext()
		});
	}
	listConnectedSessions() {
		return [...this.nodesById.values()].filter((node) => node.client.invalidated !== true);
	}
	capturePairingLease(node) {
		return {
			session: node,
			nodeId: node.nodeId,
			connId: node.connId,
			binding: pairingBindingForSession(node)
		};
	}
	currentSessionForLease(lease) {
		const current = this.nodesById.get(lease.nodeId);
		return current === lease.session && current.connId === lease.connId && current.pairingIdentity === lease.binding.identity && current.pairingGeneration === lease.binding.generation && current.client.invalidated !== true ? current : void 0;
	}
	settlePairingLease(params) {
		const current = this.currentSessionForLease(params.lease);
		if (!current) return {
			status: "stale",
			presenceInvalidated: false
		};
		if (params.isCurrent) return {
			status: "current",
			session: current
		};
		return {
			status: "stale",
			presenceInvalidated: params.invalidateStale ? this.invalidateSessionForPairingChange(current) : false
		};
	}
	async resolvePairingLease(lease, options) {
		const resolveCurrentPairingState = this.options.resolveCurrentPairingState;
		if (!resolveCurrentPairingState) {
			const current = this.currentSessionForLease(lease);
			return current ? {
				status: "current",
				session: current
			} : {
				status: "stale",
				presenceInvalidated: false
			};
		}
		let currentPairingState;
		try {
			currentPairingState = await resolveCurrentPairingState(lease.nodeId);
		} catch {
			return { status: "unavailable" };
		}
		let isCurrent = pairingStateMatchesBinding(lease.binding, currentPairingState);
		try {
			if (isCurrent && this.options.isPairingStateCurrent) isCurrent = this.options.isPairingStateCurrent(lease.nodeId, lease.binding);
		} catch {
			return { status: "unavailable" };
		}
		return this.settlePairingLease({
			lease,
			isCurrent,
			invalidateStale: options.invalidateStale
		});
	}
	refreshSessionPolicy(node) {
		const policy = expectDefined(NODE_SESSION_POLICIES.get(node), "registered node policy missing");
		const cfg = this.committedConfig;
		const declaredCommands = node.sessionCommandsCeiling ?? node.declaredCommands;
		const allowlist = cfg ? resolveNodeCommandAllowlist(cfg, {
			...node,
			caps: node.sessionCapsCeiling ?? node.declaredCaps,
			commands: declaredCommands,
			approvedCommands: declaredCommands
		}) : void 0;
		node.commands = policy.approvedCommands.filter((command) => declaredCommands.includes(command) && (!allowlist || allowlist.has(command)));
		if (allowlist) policy.withheldCommands = declaredCommands.filter((command) => !allowlist.has(command));
		node.caps = retainFulfilledNodeCapabilities({
			caps: policy.approvedCaps,
			admittedCommands: node.commands,
			withheldCommands: declaredCommands.filter((command) => !node.commands.includes(command))
		});
		node.computerUse = resolveEffectiveComputerUseDescriptor({
			commands: node.commands,
			declared: node.declaredComputerUse
		});
		Object.assign(node.client.connect, {
			commands: node.commands,
			caps: node.caps,
			computerUse: node.computerUse
		});
		const normalized = normalizeNodePluginToolDescriptors({
			nodeId: node.nodeId,
			tools: node.declaredNodePluginTools,
			allowedCommands: node.commands,
			enabled: cfg?.gateway?.nodes?.pluginTools?.enabled,
			registeredDescriptors: createRegisteredNodePluginToolDescriptorMap(this.options.listRegisteredNodePluginToolCommands?.())
		});
		node.nodePluginTools = normalized.map((entry) => entry.descriptor);
		replaceConnectedNodePluginTools({
			nodeId: node.nodeId,
			displayName: node.displayName,
			platform: node.platform,
			remoteIp: node.remoteIp,
			tools: normalized
		});
		node.nodeSkills = cfg?.gateway?.nodes?.allowSkills === false ? [] : policy.skills;
		recordRemoteSkillNodeInfo(node);
		replaceRemoteNodeSkills({
			nodeId: node.nodeId,
			displayName: node.displayName,
			skills: node.nodeSkills
		});
	}
	isCommandAllowed(nodeId, command, liveConfig) {
		if (!this.committedConfig || isPrivateNodeInvokeCommand(command)) return true;
		const node = this.nodesById.get(nodeId);
		return Boolean(node?.commands.includes(command) && (!liveConfig || resolveNodeCommandAllowlist(liveConfig, node).has(command)));
	}
	refreshRuntimePolicy(config = this.committedConfig) {
		this.committedConfig = config;
		const nodes = this.listConnected();
		for (const node of nodes) this.refreshSessionPolicy(node);
		this.invokeStreams.reconcileRuntimePolicy();
		return nodes;
	}
	/** Register a websocket client as the current connection for its node id. */
	register(client, opts) {
		return this.registerSession(client, opts);
	}
	/** Register a node whose events are delivered by an HTTP polling transport. */
	registerTransport(client, opts, transport) {
		return this.registerSession(client, opts, transport);
	}
	registerSession(client, opts, transport) {
		if (!opts.pairingIdentity) throw new Error("node session registration requires pairing identity");
		const connect = client.connect;
		const nodeId = connect.device?.id ?? connect.client.id;
		const previousSession = this.nodesById.get(nodeId);
		const previousPairingGeneration = previousSession?.pairingGeneration;
		const caps = connect.caps ?? [];
		const commands = connect.commands ?? [];
		const declaredCaps = connect.declaredCaps ?? caps;
		const declaredCommands = connect.declaredCommands ?? commands;
		const computerUse = connect.computerUse === void 0 ? void 0 : parseComputerUseCapabilityDescriptor(connect.computerUse);
		const declaredComputerUseValue = connect.declaredComputerUse;
		const declaredComputerUse = declaredComputerUseValue === void 0 ? computerUse : parseComputerUseCapabilityDescriptor(declaredComputerUseValue);
		const sessionCapsCeiling = connect.sessionCapsCeiling ?? declaredCaps;
		const sessionCommandsCeiling = connect.sessionCommandsCeiling ?? declaredCommands;
		const declaredPermissions = connect.declaredPermissions ?? connect.permissions;
		const permissions = opts.approvedSurface ? intersectNodePermissionSurface({
			approved: opts.approvedSurface.permissions,
			declared: declaredPermissions
		}) : connect.permissions;
		connect.permissions = permissions;
		const pathEnv = connect.pathEnv;
		const declaredNodePluginTools = [];
		const nodePluginTools = [];
		const nodeSkills = [];
		const session = {
			nodeId,
			connId: client.connId,
			pairingIdentity: opts.pairingIdentity,
			...opts.pairingGeneration ? { pairingGeneration: opts.pairingGeneration } : {},
			client,
			clientId: connect.client.id,
			clientMode: connect.client.mode,
			displayName: connect.client.displayName,
			platform: connect.client.platform,
			version: connect.client.version,
			coreVersion: connect.coreVersion,
			uiVersion: connect.uiVersion,
			deviceFamily: connect.client.deviceFamily,
			modelIdentifier: connect.client.modelIdentifier,
			remoteIp: opts.remoteIp,
			declaredCaps,
			sessionCapsCeiling,
			caps,
			declaredCommands,
			sessionCommandsCeiling,
			commands,
			...declaredComputerUse ? { declaredComputerUse } : {},
			...computerUse ? { computerUse } : {},
			declaredNodePluginTools,
			nodePluginTools,
			nodeSkills,
			declaredPermissions,
			permissions,
			pathEnv,
			connectedAtMs: Date.now()
		};
		NODE_SESSION_POLICIES.set(session, {
			approvedCaps: (opts.approvedSurface?.caps ?? caps).filter((cap) => sessionCapsCeiling.includes(cap)),
			approvedCommands: (opts.approvedSurface?.commands ?? commands).filter((command) => sessionCommandsCeiling.includes(command)),
			skills: [],
			withheldCommands: connect.withheldCommands ?? []
		});
		const replacesPresence = previousSession?.lastActiveAtMs !== void 0;
		forgetNodeRunnerInventory(this, client.connId);
		this.nodesById.set(nodeId, session);
		this.nodesByConn.set(client.connId, nodeId);
		if (previousSession && previousSession.connId !== client.connId) this.unregister(previousSession.connId);
		if (previousPairingGeneration && session.pairingGeneration && previousPairingGeneration !== session.pairingGeneration) this.options.onPairingGenerationChanged?.({
			nodeId,
			previousPairingGeneration,
			nextPairingGeneration: session.pairingGeneration,
			preserveSessionState: false
		});
		if (transport) this.eventTransportsByConn.set(client.connId, transport);
		else this.eventTransportsByConn.delete(client.connId);
		this.refreshSessionPolicy(session);
		if (previousSession) this.clearDesktopAvailability(previousSession);
		if (replacesPresence) this.publishActiveNodeContext();
		reconcileNodeRunnerAvailability(this, nodeId);
		return session;
	}
	/** Unregister one connection and reject invokes tied to that connection. */
	unregister(connId) {
		const nodeId = this.nodesByConn.get(connId);
		if (!nodeId) return null;
		this.nodesByConn.delete(connId);
		this.eventTransportsByConn.delete(connId);
		forgetNodeRunnerInventory(this, connId);
		const node = this.nodesById.get(nodeId);
		const unregistersCurrentNode = node?.connId === connId;
		if (unregistersCurrentNode) {
			const hadPresence = node.lastActiveAtMs !== void 0;
			this.nodesById.delete(nodeId);
			this.clearDesktopAvailability(node);
			removeConnectedNodePluginTools(nodeId);
			removeRemoteNodeSkills(nodeId);
			if (hadPresence) this.publishActiveNodeContext();
		}
		this.invokeStreams.handleDisconnect(connId);
		for (const [key, event] of this.authorizedSystemRunEvents) if (event.connId === connId) this.authorizedSystemRunEvents.delete(key);
		reconcileNodeRunnerAvailability(this, nodeId);
		return unregistersCurrentNode ? nodeId : null;
	}
	/** List connected node sessions. */
	listConnected() {
		return this.listConnectedSessions();
	}
	/** Filter connected sessions against an already-loaded pairing-state snapshot. */
	listConnectedForPairingStates(currentPairingStates) {
		return this.listConnectedSessions().filter((node) => {
			const current = currentPairingStates.get(node.nodeId);
			return pairingStateMatchesBinding(pairingBindingForSession(node), current);
		});
	}
	/** Reconcile connected sessions against the pairing owner's committed publication. */
	listCurrentConnectedSync() {
		const isPairingStateCurrent = this.options.isPairingStateCurrent;
		if (!isPairingStateCurrent) return this.listConnected();
		const connected = [];
		let invalidatedPresence = false;
		for (const candidate of this.listConnectedSessions()) {
			const lease = this.capturePairingLease(candidate);
			let isCurrent;
			try {
				isCurrent = isPairingStateCurrent(candidate.nodeId, lease.binding);
			} catch {
				continue;
			}
			const resolution = this.settlePairingLease({
				lease,
				isCurrent,
				invalidateStale: true
			});
			if (resolution.status === "current") connected.push(resolution.session);
			else if (resolution.status === "stale") invalidatedPresence ||= resolution.presenceInvalidated;
		}
		if (invalidatedPresence) this.publishActiveNodeContext();
		return connected;
	}
	/** Resolve persistent pairing state before projecting connected sessions. */
	async listCurrentConnected() {
		return await this.resolveCurrentConnectedSessions(this.listConnectedSessions());
	}
	async getCurrentConnected(nodeId) {
		const node = this.nodesById.get(nodeId);
		return node && node.client.invalidated !== true ? (await this.resolveCurrentConnectedSessions([node]))[0] : void 0;
	}
	async resolveCurrentConnectedSessions(candidates) {
		const resolved = await Promise.all(candidates.map((node) => this.resolvePairingLease(this.capturePairingLease(node), { invalidateStale: true })));
		const connected = [];
		let invalidatedPresence = false;
		for (const result of resolved) if (result.status === "current") connected.push(result.session);
		else if (result.status === "stale") invalidatedPresence ||= result.presenceInvalidated;
		if (invalidatedPresence) this.publishActiveNodeContext();
		return connected;
	}
	invalidateSessionForPairingChange(node, reason = "device-pairing-changed") {
		if (this.nodesById.get(node.nodeId) !== node || node.client.invalidated === true) return false;
		node.client.invalidated = true;
		node.client.invalidatedReason ??= reason;
		this.clearDesktopAvailability(node);
		forgetNodeRunnerInventory(this, node.connId);
		removeConnectedNodePluginTools(node.nodeId);
		removeRemoteNodeSkills(node.nodeId);
		this.invokeStreams.handleDisconnect(node.connId);
		for (const [key, event] of this.authorizedSystemRunEvents) if (event.connId === node.connId) this.authorizedSystemRunEvents.delete(key);
		reconcileNodeRunnerAvailability(this, node.nodeId);
		this.options.onPairingInvalidated?.({
			nodeId: node.nodeId,
			connId: node.connId
		});
		return node.lastActiveAtMs !== void 0;
	}
	/** Immediately retires one exact transport after its persisted pairing authority changes. */
	invalidateConnectionForPairingChange(connId, reason = "device-pairing-changed") {
		const nodeId = this.nodesByConn.get(connId);
		const node = nodeId ? this.nodesById.get(nodeId) : void 0;
		if (!node || node.connId !== connId) return false;
		if (this.invalidateSessionForPairingChange(node, reason)) this.publishActiveNodeContext();
		return node.client.invalidated === true;
	}
	/** Return a connected node session by node id. */
	get(nodeId) {
		return this.getRegisteredSession(nodeId);
	}
	getRegisteredSession(nodeId) {
		const node = this.nodesById.get(nodeId);
		return node?.client.invalidated === true ? void 0 : node;
	}
	/** Return only the session authenticated for the requested persistent pairing generation. */
	getForPairingGeneration(nodeId, pairingGeneration) {
		return this.getRegisteredSessionForPairingGeneration(nodeId, pairingGeneration);
	}
	getRegisteredSessionForPairingGeneration(nodeId, pairingGeneration) {
		const node = this.getRegisteredSession(nodeId);
		return node?.pairingGeneration === pairingGeneration ? node : void 0;
	}
	/** Revalidates that one inbound node connection still owns its persisted pairing state. */
	async isConnectionCurrentPairingState(connId) {
		const nodeId = this.nodesByConn.get(connId);
		const initial = nodeId ? this.nodesById.get(nodeId) : void 0;
		if (!nodeId || !initial || initial.connId !== connId || initial.client.invalidated === true || !this.options.resolveCurrentPairingState) return false;
		const resolution = await this.resolvePairingLease(this.capturePairingLease(initial), { invalidateStale: true });
		if (resolution.status === "stale" && resolution.presenceInvalidated) this.publishActiveNodeContext();
		return resolution.status === "current";
	}
	clearDesktopAvailability(node) {
		if (!node.desktopAvailability) return;
		delete node.desktopAvailability;
		this.options.onDesktopAvailabilityChanged?.(node.nodeId);
	}
	/** Records operational state without publishing activity or retaining it across connections. */
	updateDesktopAvailability(params) {
		const node = this.getRegisteredSession(params.nodeId);
		if (!node || node.connId !== params.connId || node.client.socket.readyState !== 1) return null;
		if (node.desktopAvailability?.state === params.availability.state) return false;
		node.desktopAvailability = { state: params.availability.state };
		this.options.onDesktopAvailabilityChanged?.(node.nodeId);
		return true;
	}
	/** Stores the latest resource snapshot for the exact authenticated node connection. */
	updateHostStats(params) {
		const node = this.getRegisteredSession(params.nodeId);
		if (!node || node.connId !== params.connId) return null;
		node.hostStats = {
			...params.stats,
			updatedAtMs: params.observedAtMs ?? Date.now()
		};
		return node.hostStats;
	}
	/** Updates recent input activity for the exact authenticated node connection. */
	updatePresenceActivity(params) {
		const node = updateNodePresenceActivity(this.getRegisteredSession(params.nodeId), params);
		if (node) this.publishActiveNodeContext();
		return node;
	}
	/** Clears recent input activity for the exact authenticated node connection. */
	clearPresenceActivity(params) {
		const cleared = clearNodePresenceActivity(this.getRegisteredSession(params.nodeId), params.connId);
		if (cleared) this.publishActiveNodeContext();
		return cleared;
	}
	/** Returns the connected node with the freshest reported local input. */
	getActiveNode(connectedNodes = this.listConnected()) {
		let active;
		for (const node of connectedNodes) {
			if (node.lastActiveAtMs === void 0) continue;
			if (!active || node.lastActiveAtMs > (active.lastActiveAtMs ?? 0) || node.lastActiveAtMs === active.lastActiveAtMs && (node.presenceUpdatedAtMs ?? 0) > (active.presenceUpdatedAtMs ?? 0)) active = node;
		}
		return active;
	}
	publishActiveNodeContext() {
		const active = this.getActiveNode(this.listConnectedSessions());
		const lease = active ? this.capturePairingLease(active) : void 0;
		setActiveNodeContext(active ? {
			nodeId: active.nodeId,
			...active.pairingGeneration ? { pairingGeneration: active.pairingGeneration } : {}
		} : null, lease ? {
			prepare: () => this.getCurrentConnected(lease.nodeId),
			isCurrent: () => {
				if (!this.currentSessionForLease(lease)) return false;
				return this.options.isPairingStateCurrent ? this.options.isPairingStateCurrent(lease.nodeId, lease.binding) : true;
			}
		} : void 0);
	}
	/** Probe websocket liveness with ping/pong when the socket supports it. */
	async checkConnectivity(nodeId, timeoutMs = 2e3) {
		const node = this.getRegisteredSession(nodeId);
		if (!node) return {
			ok: false,
			error: {
				code: "NOT_CONNECTED",
				message: "node not connected"
			}
		};
		const currentConnectionResult = (result) => this.nodesById.get(nodeId) === node && node.client.invalidated !== true ? result : {
			ok: false,
			error: {
				code: "NOT_CONNECTED",
				message: "node connection changed during connectivity probe"
			}
		};
		const eventTransport = this.eventTransportsByConn.get(node.connId);
		if (eventTransport) return currentConnectionResult(eventTransport.checkConnectivity ? await eventTransport.checkConnectivity(timeoutMs) : { ok: true });
		const socket = node.client.webSocket;
		if (!this.isNodeWebSocketOpen(node)) return {
			ok: false,
			error: {
				code: "NOT_CONNECTED",
				message: "node socket not open"
			}
		};
		if (!socket) return { ok: true };
		const timeout = Math.max(1, Math.trunc(timeoutMs));
		return await new Promise((resolve) => {
			let settled = false;
			const cleanup = () => {
				socket.off("pong", onPong);
				socket.off("close", onClose);
				socket.off("error", onError);
			};
			const finish = (result) => {
				if (settled) return;
				settled = true;
				clearTimeout(timer);
				cleanup();
				resolve(currentConnectionResult(result));
			};
			const onPong = () => finish({ ok: true });
			const onClose = () => finish({
				ok: false,
				error: {
					code: "NOT_CONNECTED",
					message: "node socket closed during connectivity probe"
				}
			});
			const onError = (err) => finish({
				ok: false,
				error: {
					code: "UNAVAILABLE",
					message: err instanceof Error ? err.message : "node socket error during connectivity probe"
				}
			});
			const timer = setTimeout(() => finish({
				ok: false,
				error: {
					code: "TIMEOUT",
					message: "node connectivity probe timed out"
				}
			}), timeout);
			socket.once("pong", onPong);
			socket.once("close", onClose);
			socket.once("error", onError);
			try {
				socket.ping(void 0, false, (err) => {
					if (err) finish({
						ok: false,
						error: {
							code: "UNAVAILABLE",
							message: err.message
						}
					});
				});
			} catch (err) {
				finish({
					ok: false,
					error: {
						code: "UNAVAILABLE",
						message: err instanceof Error ? err.message : "node ping failed"
					}
				});
			}
		});
	}
	updateNodePluginTools(nodeId, connId, tools) {
		const node = this.nodesById.get(nodeId);
		if (!node || node.connId !== connId || node.client.invalidated === true) return null;
		node.declaredNodePluginTools = [...tools];
		this.refreshSessionPolicy(node);
		return node;
	}
	updateNodeSkills(nodeId, connId, skills) {
		const node = this.nodesById.get(nodeId);
		if (!node || node.connId !== connId || node.client.invalidated === true) return null;
		expectDefined(NODE_SESSION_POLICIES.get(node), "registered node policy missing").skills = normalizeNodeSkillDescriptors({
			nodeId,
			skills
		});
		this.refreshSessionPolicy(node);
		return node;
	}
	updateSurface(nodeId, surface, generationTransition) {
		const node = this.nodesById.get(nodeId);
		if (!node || node.client.invalidated === true || generationTransition !== void 0 && (node.connId !== generationTransition.expectedConnId || node.pairingIdentity !== generationTransition.expectedPairingIdentity || node.pairingGeneration !== generationTransition.expectedPairingGeneration)) return null;
		const policy = expectDefined(NODE_SESSION_POLICIES.get(node), "registered node policy missing");
		const sessionCommandsCeiling = new Set(node.sessionCommandsCeiling ?? node.declaredCommands);
		policy.approvedCommands = surface.commands.filter((command) => sessionCommandsCeiling.has(command));
		if ("caps" in surface) {
			const sessionCapsCeiling = new Set(node.sessionCapsCeiling ?? node.declaredCaps);
			policy.approvedCaps = (surface.caps ?? []).filter((capability) => sessionCapsCeiling.has(capability));
		}
		this.refreshSessionPolicy(node);
		if ("permissions" in surface) {
			node.permissions = surface.permissions === void 0 ? void 0 : intersectNodePermissionSurface({
				approved: surface.permissions,
				declared: node.declaredPermissions
			});
			node.client.connect.permissions = node.permissions;
			if (node.permissions?.accessibility !== true && clearNodePresenceActivity(node, node.connId, "system")) this.publishActiveNodeContext();
		}
		if (generationTransition) {
			const previousPairingGeneration = node.pairingGeneration;
			node.pairingGeneration = generationTransition.nextPairingGeneration;
			settleNodeRegistryPairingGenerationChange({
				registry: this,
				nodeId,
				connId: node.connId,
				nextPairingGeneration: generationTransition.nextPairingGeneration
			});
			reconcileNodeRunnerAvailability(this, nodeId);
			if (previousPairingGeneration) this.options.onPairingGenerationChanged?.({
				nodeId,
				previousPairingGeneration,
				nextPairingGeneration: generationTransition.nextPairingGeneration,
				preserveSessionState: true
			});
			this.publishActiveNodeContext();
		}
		return node;
	}
	async invoke(params) {
		return await invokePublicNodeRegistry(this, params);
	}
	/** Internal cleanup retains its owner through replies without admitting new root work. */
	invokeLifecycle(params) {
		return invokeLifecycleNodeRegistry(this, params);
	}
	/** Send one ordered input frame to a pending streaming invoke. */
	sendInvokeInput(invokeId, payload) {
		this.invokeStreams.sendInput(invokeId, payload);
	}
	/** Synchronous effect fence for callbacks retained across awaited host work. */
	isInvokeCurrent(invokeId, nodeId, connId) {
		return this.invokeStreams.isPending(invokeId, nodeId, connId);
	}
	handleInvokeProgress(params) {
		return this.invokeStreams.handleProgress(params);
	}
	/** Continues only the exact live owner of a pending node invocation. */
	runPendingInvokeContinuation(params) {
		return this.invokeStreams.runPendingContinuation(params);
	}
	/** Authorize an inbound system.run event against a recently issued node invoke. */
	authorizeSystemRunEvent(params) {
		if (!params.connId || !params.sessionKey) return false;
		const connId = params.connId;
		this.pruneAuthorizedSystemRunEvents();
		let match;
		if (params.runId) {
			match = this.matchAuthorizedSystemRunEvent({
				nodeId: params.nodeId,
				connId,
				runId: params.runId,
				sessionKey: params.sessionKey
			});
			if (!match && this.allowsLegacyMacRunIdFallback({
				nodeId: params.nodeId,
				connId
			})) match = this.matchSingleAuthorizedSystemRunEvent({
				nodeId: params.nodeId,
				connId,
				sessionKey: params.sessionKey
			});
		} else {
			if (!this.allowsLegacyMacRunIdFallback({
				nodeId: params.nodeId,
				connId
			})) return false;
			match = this.matchSingleAuthorizedSystemRunEvent({
				nodeId: params.nodeId,
				connId,
				sessionKey: params.sessionKey
			});
		}
		if (!match) return false;
		if (params.terminal) this.authorizedSystemRunEvents.delete(match.key);
		return true;
	}
	rememberAuthorizedSystemRunEvent(event) {
		this.pruneAuthorizedSystemRunEvents();
		const authorized = {
			...event,
			expiresAtMs: this.authorizedSystemRunEventExpiresAt(event.timeoutMs)
		};
		this.authorizedSystemRunEvents.set(this.authorizedSystemRunEventKey(authorized), authorized);
	}
	forgetAuthorizedSystemRunEvent(event) {
		this.authorizedSystemRunEvents.delete(this.authorizedSystemRunEventKey(event));
	}
	authorizedSystemRunEventExpiresAt(timeoutMs) {
		if (typeof timeoutMs !== "number") return null;
		const durationMs = addTimerTimeoutGraceMs(timeoutMs, AUTHORIZED_SYSTEM_RUN_EVENT_GRACE_MS);
		return resolveExpiresAtMsFromDurationMs(durationMs) ?? 0;
	}
	matchAuthorizedSystemRunEvent(params) {
		for (const [key, event] of this.authorizedSystemRunEvents) if (event.nodeId === params.nodeId && event.connId === params.connId && event.runId === params.runId && this.authorizedSystemRunSessionMatches(event, params.sessionKey)) return {
			key,
			event
		};
		return null;
	}
	matchSingleAuthorizedSystemRunEvent(params) {
		let match = null;
		for (const [key, event] of this.authorizedSystemRunEvents) {
			if (event.nodeId !== params.nodeId || event.connId !== params.connId || !this.authorizedSystemRunSessionMatches(event, params.sessionKey)) continue;
			if (match) return null;
			match = {
				key,
				event
			};
		}
		return match;
	}
	authorizedSystemRunSessionMatches(event, sessionKey) {
		return !event.sessionKey || event.sessionKey === sessionKey;
	}
	allowsLegacyMacRunIdFallback(params) {
		const node = this.nodesById.get(params.nodeId);
		return node?.connId === params.connId && node.clientId === "openclaw-macos" && node.platform === "darwin";
	}
	pruneAuthorizedSystemRunEvents(now = Date.now()) {
		for (const [key, event] of this.authorizedSystemRunEvents) if (event.expiresAtMs !== null && !isFutureDateTimestampMs(event.expiresAtMs, { nowMs: now })) this.authorizedSystemRunEvents.delete(key);
	}
	authorizedSystemRunEventKey(params) {
		return `${params.nodeId}\0${params.connId}\0${params.sessionKey ?? ""}\0${params.runId}`;
	}
	handleInvokeResult(params) {
		return this.invokeStreams.handleResult(params);
	}
	sendEvent(nodeId, event, payload) {
		const node = this.nodesById.get(nodeId);
		if (!node) return false;
		return this.sendEventToSession(node, event, payload);
	}
	sendEventRaw(nodeId, event, payloadJSON) {
		const node = this.nodesById.get(nodeId);
		if (!node) return false;
		return this.observeEventSend(node, event, this.sendEventRawInternal(node, event, payloadJSON));
	}
	/** Sends command-free events only to the exact authenticated pairing connection. */
	async sendEventForPairingIdentity(params) {
		const initial = this.nodesById.get(params.nodeId);
		if (!initial || initial.connId !== params.connId || initial.pairingIdentity !== params.pairingIdentity || initial.client.invalidated === true || !this.options.resolveCurrentPairingState) return false;
		const resolution = await this.resolvePairingLease(this.capturePairingLease(initial), { invalidateStale: true });
		if (resolution.status !== "current") {
			if (resolution.status === "stale" && resolution.presenceInvalidated) this.publishActiveNodeContext();
			return false;
		}
		return this.sendEventToSession(resolution.session, params.event, params.payload);
	}
	/** Sends only to a session that still owns the requested persistent pairing generation. */
	async sendEventRawForPairingGeneration(nodeId, pairingGeneration, event, payloadJSON) {
		const send = (this.pairingGenerationEventChains.get(nodeId) ?? Promise.resolve()).then(() => this.sendEventRawForPairingGenerationNow(nodeId, pairingGeneration, event, payloadJSON));
		const tail = send.then(() => void 0, () => void 0);
		this.pairingGenerationEventChains.set(nodeId, tail);
		try {
			return await send;
		} finally {
			if (this.pairingGenerationEventChains.get(nodeId) === tail) this.pairingGenerationEventChains.delete(nodeId);
		}
	}
	async sendEventRawForPairingGenerationNow(nodeId, pairingGeneration, event, payloadJSON) {
		let node = this.getRegisteredSessionForPairingGeneration(nodeId, pairingGeneration);
		if (!node) return false;
		if (this.options.resolveCurrentPairingState) {
			const resolution = await this.resolvePairingLease(this.capturePairingLease(node), { invalidateStale: true });
			if (resolution.status !== "current") {
				if (resolution.status === "stale" && resolution.presenceInvalidated) this.publishActiveNodeContext();
				return false;
			}
			node = resolution.session;
		}
		return this.observeEventSend(node, event, this.sendEventRawInternal(node, event, payloadJSON));
	}
	sendEventInternal(node, event, payload) {
		if (node.client.invalidated === true || !isPublishedPairingCurrent(node, this.options.isPairingStateCurrent)) return false;
		const eventTransport = this.eventTransportsByConn.get(node.connId);
		if (eventTransport) return eventTransport.send(event, payload);
		if (!this.isNodeWebSocketOpen(node)) return false;
		if (this.rejectSlowNodeSocket(node)) return false;
		try {
			node.client.socket.send(serializeNodeEvent(event, payload));
			return true;
		} catch {
			return false;
		}
	}
	sendEventRawInternal(node, event, payloadJSON) {
		if (node.client.invalidated === true || !isPublishedPairingCurrent(node, this.options.isPairingStateCurrent)) return false;
		if (payloadJSON !== null && payloadJSON !== void 0 && !isSerializedEventPayload(payloadJSON)) return false;
		const eventTransport = this.eventTransportsByConn.get(node.connId);
		if (eventTransport) return eventTransport.sendRaw(event, payloadJSON);
		if (!this.isNodeWebSocketOpen(node)) return false;
		if (this.rejectSlowNodeSocket(node)) return false;
		try {
			const payloadFragment = payloadJSON ? `,"payload":${payloadJSON.json}` : "";
			node.client.socket.send(`{"type":"event","event":${JSON.stringify(event)}${payloadFragment}}`);
			return true;
		} catch {
			return false;
		}
	}
	sendEventToSession(node, event, payload) {
		return this.observeEventSend(node, event, this.sendEventInternal(node, event, payload));
	}
	observeEventSend(node, event, sent) {
		if (sent || this.nodesById.get(node.nodeId) !== node || node.client.invalidated === true) return sent;
		const now = Date.now();
		const lastLoggedAt = failedEventLogAtByNode.get(node);
		if (lastLoggedAt === void 0 || now - lastLoggedAt >= FAILED_EVENT_LOG_INTERVAL_MS) {
			failedEventLogAtByNode.set(node, now);
			log.warn("node event delivery failed", {
				nodeId: node.nodeId,
				event
			});
		}
		return sent;
	}
	isNodeWebSocketOpen(node) {
		return node.client.socket.readyState === 1;
	}
	rejectSlowNodeSocket(node) {
		const socket = node.client.socket;
		if (!(socket.bufferedAmount > 52428800)) return false;
		logRejectedLargePayload({
			surface: "gateway.ws.outbound_buffer",
			bytes: socket.bufferedAmount,
			limitBytes: MAX_BUFFERED_BYTES,
			reason: "ws_send_buffer_close"
		});
		closeGatewayTransportWithGrace(socket, SLOW_CONSUMER_CLOSE_CODE, "slow consumer");
		return true;
	}
};
//#endregion
export { readNodeSessionWithheldCommands as n, serializeEventPayload as r, NodeRegistry as t };
