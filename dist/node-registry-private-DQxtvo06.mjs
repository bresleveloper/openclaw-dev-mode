import { F as resolveTimerTimeoutMs } from "./number-coercion-CLj0HTDM.mjs";
import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { c as isRecord, i as asOptionalObjectRecord } from "./record-coerce-DItp3I4t.mjs";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { r as racePromiseWithAbortSignal } from "./abort-signal-Z3A36sLL.mjs";
import { n as GATEWAY_CLIENT_IDS } from "./client-info-B_ICKCYw.mjs";
import { a as formatNodeRunnerUpdateRequired, i as NODE_WORKER_SUPERVISOR_PROTOCOL_FEATURE, n as NODE_RUNNER_UPDATE_REQUIRED_ISSUE, s as resolveNodeWorkerExecutionIssue } from "./node-runner-inventory-DTVspi93.mjs";
import { n as awaitWithinDeadline, t as ABSOLUTE_DEADLINE_EXPIRED } from "./absolute-deadline-BXzjx6E8.mjs";
import { C as NODE_WORKER_PRIVATE_COMMANDS, N as isPrivateNodeInvokeCommand } from "./node-commands-BLhGKTZa.mjs";
import "./server-constants-Dx_kHnY5.mjs";
import { n as sameWorkerProtocolFeatures } from "./worker-build-identity-D_c48Wx_.mjs";
import { i as serializeNodeEvent, r as buildNodeInvokeRequest } from "./node-invoke-request-QpYVLB31.mjs";
import { t as NODE_INVOKE_PAIRING_CHANGED_ABORT } from "./node-registry-private-token-ChofAGxk.mjs";
import { randomUUID } from "node:crypto";
//#region src/gateway/node-registry.system-run.ts
function resolvePendingSystemRunEvent(params) {
	const obj = asOptionalObjectRecord(params.params);
	if (params.command !== "system.run" || !obj) return;
	const runId = normalizeOptionalString(obj.runId) ?? "";
	if (!runId) return;
	const timeoutMs = normalizeSystemRunTimeoutMs(obj.timeoutMs);
	const sessionKey = normalizeOptionalString(obj.sessionKey) ?? "";
	return {
		runId,
		...sessionKey ? { sessionKey } : {},
		...timeoutMs !== void 0 ? { timeoutMs } : {}
	};
}
function normalizeSystemRunInvokeParams(params) {
	if (params.command !== "system.run" || !isRecord(params.params)) return params.params;
	const obj = params.params;
	const normalized = {
		...obj,
		runId: normalizeOptionalString(obj.runId) || randomUUID()
	};
	const timeoutMs = normalizeSystemRunTimeoutMs(obj.timeoutMs);
	if (timeoutMs === void 0) delete normalized.timeoutMs;
	else normalized.timeoutMs = timeoutMs;
	return normalized;
}
/** Normalize system.run timeout values, preserving null for no expiry. */
function normalizeSystemRunTimeoutMs(value) {
	if (value === void 0) return;
	if (typeof value !== "number" || !Number.isFinite(value)) return;
	const timeoutMs = Math.trunc(value);
	return timeoutMs > 0 ? resolveTimerTimeoutMs(timeoutMs, 1) : null;
}
//#endregion
//#region src/gateway/node-runner-inventory-runtime.ts
/** Both first-party hosts run the shared node runtime without changing client identity. */
function isNodeWorkerHostClientId(clientId) {
	return clientId === GATEWAY_CLIENT_IDS.NODE_HOST || clientId === GATEWAY_CLIENT_IDS.MACOS_APP;
}
function sameBundleStatusObservation(left, right) {
	return left?.bundleHash === right?.bundleHash && left?.status.status === right?.status.status && (left?.status.status !== "installed" || right?.status.status === "installed" && left.status.version === right.status.version);
}
function createNodeRunnerStatePublisher(getNode, runnerInventoryByConn) {
	const availableNodeIds = /* @__PURE__ */ new Set();
	const observers = /* @__PURE__ */ new Map();
	let listener = (_nodeId, _change) => {};
	const hasCurrent = (nodeId) => {
		const node = getNode(nodeId);
		return Boolean(node && node.client.invalidated !== true && resolveNodeWorkerSupervisorProof(node, runnerInventoryByConn));
	};
	return {
		hasCurrent,
		reconcile: (nodeId, inventoryChanged) => {
			const available = hasCurrent(nodeId);
			const availabilityChanged = availableNodeIds.has(nodeId) !== available;
			if (available) availableNodeIds.add(nodeId);
			else availableNodeIds.delete(nodeId);
			if (inventoryChanged || availabilityChanged) {
				for (const notify of observers.get(nodeId) ?? []) notify();
				listener(nodeId, {
					inventoryChanged,
					availabilityChanged
				});
			}
		},
		setListener: (next) => {
			listener = next;
		},
		subscribe: (nodeId, notify) => {
			const listeners = observers.get(nodeId) ?? /* @__PURE__ */ new Set();
			listeners.add(notify);
			observers.set(nodeId, listeners);
			return () => {
				listeners.delete(notify);
				if (listeners.size === 0) observers.delete(nodeId);
			};
		}
	};
}
/** Availability wakes admission; only a freshly read pairing-bound proof completes the wait. */
async function waitForNodeRunnerAvailability(publisher, transport, nodeId, options) {
	let changed = createDeferredCore();
	const unsubscribe = publisher.subscribe(nodeId, () => changed.resolve());
	const assertCurrent = () => {
		options.signal.throwIfAborted();
		options.assertCurrent();
	};
	try {
		for (;;) {
			assertCurrent();
			const node = await racePromiseWithAbortSignal(transport.getCurrentNode(nodeId), options.signal);
			assertCurrent();
			if (node && transport.isCurrent(node)) return;
			const issue = transport.getIssue?.(nodeId);
			if (issue) throw new Error(formatNodeRunnerUpdateRequired(nodeId, issue));
			await racePromiseWithAbortSignal(changed.promise, options.signal);
			changed = createDeferredCore();
		}
	} finally {
		unsubscribe();
	}
}
/** Project current connection facts without pairing reads, publications, or execution admission. */
function collectNodeRunnerCatalogState(params) {
	const sessionHostNodeIds = /* @__PURE__ */ new Set();
	const issuesByNodeId = /* @__PURE__ */ new Map();
	const workerSlotsByNodeId = /* @__PURE__ */ new Map();
	const workerBundleByNodeId = /* @__PURE__ */ new Map();
	const { state } = params;
	for (const node of params.connectedNodes) {
		const current = state?.getNode(node.nodeId);
		if (!state || !current || current.connId !== node.connId) continue;
		const proof = resolveNodeWorkerSupervisorProof(current, state.runnerInventoryByConn);
		if (proof && proof.pairingGeneration === node.pairingGeneration) sessionHostNodeIds.add(node.nodeId);
		const issue = resolveNodeRunnerInventoryIssue(current, state.runnerInventoryByConn) ?? (params.requireWorkerExecution && proof ? resolveNodeWorkerExecutionIssue(proof.workerHost) : void 0);
		if (issue) issuesByNodeId.set(node.nodeId, [issue]);
		if (proof) workerSlotsByNodeId.set(node.nodeId, { ...proof.workerHost.capacity });
		const observation = state.bundleStatusByConn.get(node.connId);
		if (observation) workerBundleByNodeId.set(node.nodeId, structuredClone(observation.status));
	}
	return {
		sessionHostNodeIds,
		issuesByNodeId,
		workerSlotsByNodeId,
		workerBundleByNodeId
	};
}
function sameNodeWorkerHostDeclaration(left, right) {
	return left?.enabled === right?.enabled && (left?.enabled !== true || right?.enabled === true && left.capacity.total === right.capacity.total && left.capacity.available === right.capacity.available && left.bundlePrewarm === right.bundlePrewarm && left.bundleRetention === right.bundleRetention && left.bundleStatus === right.bundleStatus && left.portalStream === right.portalStream && left.environmentSession === right.environmentSession && left.preparedWorkspace === right.preparedWorkspace && left.capturedExecPolicy === right.capturedExecPolicy);
}
function resolveNodeWorkerSupervisorProof(node, runnerInventoryByConn) {
	const declaration = runnerInventoryByConn.get(node.connId);
	if (!declaration || !node.pairingIdentity || !node.pairingGeneration || !isNodeWorkerHostClientId(node.clientId) || node.clientMode !== "node" || declaration.nodeId !== node.nodeId || declaration.pairingIdentity !== node.pairingIdentity || declaration.pairingGeneration !== node.pairingGeneration || declaration.clientId !== node.clientId || declaration.clientMode !== node.clientMode || !declaration.protocolFeatures.includes("node-worker-supervisor-v6") || declaration.workerHost?.enabled !== true) return;
	return {
		nodeId: node.nodeId,
		connId: node.connId,
		pairingIdentity: node.pairingIdentity,
		pairingGeneration: node.pairingGeneration,
		clientId: node.clientId,
		clientMode: "node",
		protocolFeature: NODE_WORKER_SUPERVISOR_PROTOCOL_FEATURE,
		workerHost: {
			...declaration.workerHost,
			capacity: { ...declaration.workerHost.capacity }
		},
		commands: [...node.commands]
	};
}
function resolveNodeRunnerInventoryIssue(node, runnerInventoryByConn) {
	const declaration = runnerInventoryByConn.get(node.connId);
	return declaration && node.client.invalidated !== true && declaration.nodeId === node.nodeId && declaration.pairingIdentity === node.pairingIdentity && declaration.pairingGeneration !== void 0 && declaration.pairingGeneration === node.pairingGeneration && isNodeWorkerHostClientId(node.clientId) && declaration.clientId === node.clientId && node.clientMode === "node" && declaration.clientMode === "node" && declaration.protocolFeatures.length === 1 && declaration.protocolFeatures[0] !== "node-worker-supervisor-v6" ? NODE_RUNNER_UPDATE_REQUIRED_ISSUE : void 0;
}
function isNodeWorkerSupervisorProofCurrent(node, runnerInventoryByConn, proof, requirements = {}) {
	if (!node || node.client.invalidated === true || node.connId !== proof.connId) return false;
	const current = resolveNodeWorkerSupervisorProof(node, runnerInventoryByConn);
	return current?.pairingIdentity === proof.pairingIdentity && current.pairingGeneration === proof.pairingGeneration && current.clientId === proof.clientId && current.clientMode === proof.clientMode && current.protocolFeature === proof.protocolFeature && (!requirements.launchEligibility || current.workerHost.capacity.available > 0) && (!requirements.environmentSession || current.workerHost.environmentSession === 1) && (!requirements.preparedWorkspace || current.workerHost.preparedWorkspace === 1) && (!requirements.capturedExecPolicy || !resolveNodeWorkerExecutionIssue(current.workerHost)) && (requirements.commands ?? []).every((command) => current.commands.includes(command));
}
//#endregion
//#region src/gateway/node-registry-private.ts
const NODE_REGISTRY_PRIVATE_STATES = /* @__PURE__ */ new WeakMap();
function updateWorkerRunnerInventory(state, params) {
	const node = state.context.getNode(params.nodeId);
	const publishesRunnerDialect = params.declaration.protocolFeatures.length === 1;
	if (!node || node.client.invalidated === true || node.connId !== params.connId || !isNodeWorkerHostClientId(node.clientId) || node.clientMode !== "node") return null;
	const previous = state.runnerInventoryByConn.get(node.connId);
	if (!publishesRunnerDialect) {
		const inventoryChanged = state.runnerInventoryByConn.delete(node.connId);
		const statusChanged = state.bundleStatusByConn.delete(node.connId);
		const changed = inventoryChanged || statusChanged;
		if (changed) {
			state.context.publishActiveNodeContext();
			state.runnerState.reconcile(node.nodeId, true);
		}
		return { changed };
	}
	const workerHost = "workerHost" in params.declaration ? params.declaration.workerHost : void 0;
	const next = {
		nodeId: node.nodeId,
		connId: node.connId,
		pairingIdentity: node.pairingIdentity,
		...node.pairingGeneration ? { pairingGeneration: node.pairingGeneration } : {},
		clientId: node.clientId,
		clientMode: "node",
		protocolFeatures: [...params.declaration.protocolFeatures],
		...workerHost ? { workerHost: workerHost.enabled ? {
			...workerHost,
			capacity: { ...workerHost.capacity }
		} : { enabled: false } } : {}
	};
	const statusCleared = next.workerHost?.enabled !== true || next.workerHost.bundleRetention === void 0 || next.workerHost.bundleStatus === void 0 ? state.bundleStatusByConn.delete(node.connId) : false;
	const changed = !previous || previous.pairingGeneration !== next.pairingGeneration || !sameWorkerProtocolFeatures(previous.protocolFeatures, next.protocolFeatures) || !sameNodeWorkerHostDeclaration(previous.workerHost, next.workerHost) || statusCleared;
	if (changed) {
		state.runnerInventoryByConn.set(node.connId, next);
		state.context.publishActiveNodeContext();
		state.runnerState.reconcile(node.nodeId, true);
	}
	return { changed };
}
async function invokeNodeRegistryCore(state, params, allowPrivateCommand, isCompletionAuthorized) {
	let timeoutMs = resolveTimerTimeoutMs(params.timeoutMs, 3e4, 0);
	const deadlineAtMs = params.deadlineAtMs ?? (Number.isFinite(params.timeoutMs) && timeoutMs > 0 ? performance.now() + timeoutMs : void 0);
	if (isPrivateNodeInvokeCommand(params.command) && !allowPrivateCommand) return {
		ok: false,
		error: {
			code: "INVALID_REQUEST",
			message: "private node command is not invocable"
		}
	};
	if (params.signal?.aborted) return {
		ok: false,
		error: {
			code: "ABORTED",
			message: "node invoke cancelled"
		}
	};
	let node = state.context.getNode(params.nodeId);
	if (!node) return {
		ok: false,
		error: {
			code: "NOT_CONNECTED",
			message: "node not connected"
		}
	};
	if (node.client.invalidated === true) return {
		ok: false,
		error: {
			code: "PAIRING_CHANGED",
			message: "node pairing changed before dispatch"
		}
	};
	const expectedPairingGeneration = params.expectedPairingGeneration ?? node.pairingGeneration;
	if (state.context.hasCurrentPairingStateResolver && !expectedPairingGeneration) return {
		ok: false,
		error: {
			code: "PAIRING_CHANGED",
			message: "node pairing generation unavailable"
		}
	};
	if (expectedPairingGeneration && node.pairingGeneration !== expectedPairingGeneration) return {
		ok: false,
		error: {
			code: "PAIRING_CHANGED",
			message: "node pairing changed before dispatch"
		}
	};
	if (params.expectedConnId && node.connId !== params.expectedConnId) return {
		ok: false,
		error: {
			code: "ROUTE_CHANGED",
			message: "node connection changed before dispatch"
		}
	};
	if (expectedPairingGeneration && state.context.hasCurrentPairingStateResolver) {
		const pairingNode = node;
		let resolution;
		try {
			resolution = await awaitWithinDeadline(() => racePromiseWithAbortSignal(state.context.resolvePairingLease(pairingNode), params.signal), deadlineAtMs, () => performance.now());
		} catch (error) {
			if (params.signal?.aborted) return {
				ok: false,
				error: {
					code: "ABORTED",
					message: "node invoke cancelled"
				}
			};
			throw error;
		}
		if (resolution === ABSOLUTE_DEADLINE_EXPIRED) return {
			ok: false,
			error: {
				code: "TIMEOUT",
				message: "node invoke timed out"
			}
		};
		if (resolution.status === "unavailable") return {
			ok: false,
			error: {
				code: "UNAVAILABLE",
				message: "node pairing state unavailable before dispatch"
			}
		};
		if (resolution.status !== "current") return {
			ok: false,
			error: {
				code: "PAIRING_CHANGED",
				message: "node pairing changed before dispatch"
			}
		};
		node = resolution.session;
		if (params.expectedConnId && node.connId !== params.expectedConnId) return {
			ok: false,
			error: {
				code: "ROUTE_CHANGED",
				message: "node connection changed before dispatch"
			}
		};
	}
	const requestId = randomUUID();
	const invokeParams = normalizeSystemRunInvokeParams({
		command: params.command,
		params: params.params
	});
	const payload = buildNodeInvokeRequest({
		id: requestId,
		nodeId: params.nodeId,
		command: params.command,
		params: "params" in params ? invokeParams : void 0,
		timeoutMs,
		idempotencyKey: params.idempotencyKey,
		sessionKey: params.sessionKey
	});
	if (params.command === "worker.launch.v1" && Buffer.byteLength(serializeNodeEvent("node.invoke.request", payload), "utf8") > 26214400) return {
		ok: false,
		error: {
			code: "INVALID_REQUEST",
			message: "worker launch exceeds the node payload limit"
		}
	};
	const systemRunEvent = resolvePendingSystemRunEvent({
		command: params.command,
		params: invokeParams
	});
	if (params.signal?.aborted) return {
		ok: false,
		error: {
			code: "ABORTED",
			message: "node invoke cancelled"
		}
	};
	if (params.isDispatchAuthorized?.() === false) return {
		ok: false,
		error: {
			code: "APPROVAL_AUTHORITY_CLOSED",
			message: "runtime authority closed before node dispatch"
		}
	};
	if (!state.context.isCommandAllowed(params.nodeId, params.command)) return {
		ok: false,
		error: {
			code: "POLICY_CHANGED",
			message: "node command is no longer allowed"
		}
	};
	if (deadlineAtMs !== void 0) {
		timeoutMs = Math.max(0, deadlineAtMs - performance.now());
		if (timeoutMs === 0) return {
			ok: false,
			error: {
				code: "TIMEOUT",
				message: "node invoke timed out"
			}
		};
		payload.timeoutMs = Math.ceil(timeoutMs);
	}
	const result = new Promise((resolve, reject) => {
		const pending = {
			nodeId: params.nodeId,
			connId: node.connId,
			command: params.command,
			systemRunEvent,
			resolve,
			reject,
			nextProgressSeq: 0,
			progressChunks: /* @__PURE__ */ new Map(),
			nextInputSeq: 0,
			...params.onProgress ? { onProgress: params.onProgress } : {},
			...isCompletionAuthorized ? { isCompletionAuthorized } : {}
		};
		const generationController = params.expectedPairingGeneration ? new AbortController() : void 0;
		if (params.expectedPairingGeneration && generationController) state.generationBoundInvokes.set(pending, {
			expectedGeneration: params.expectedPairingGeneration,
			controller: generationController
		});
		const signal = generationController ? params.signal ? AbortSignal.any([params.signal, generationController.signal]) : generationController.signal : params.signal;
		const idleTimeoutMs = resolveTimerTimeoutMs(params.idleTimeoutMs, 0, 0);
		state.context.invokeStreams.armPending({
			requestId,
			pending,
			timeoutMs,
			deadlineAtMs,
			idleTimeoutMs,
			...signal ? { signal } : {}
		});
	});
	const pendingAtDispatch = state.context.pendingInvokes.get(requestId);
	if (!pendingAtDispatch) return await result;
	const dispatchDeadlineAtMs = pendingAtDispatch.deadlineAtMs;
	if (!state.context.sendEventToSession(node, "node.invoke.request", payload)) {
		const pending = state.context.pendingInvokes.get(requestId);
		if (pending) {
			state.context.invokeStreams.clearTimers(pending);
			state.context.pendingInvokes.delete(requestId);
			pending.resolve({
				ok: false,
				error: {
					code: "UNAVAILABLE",
					message: "failed to send invoke to node"
				}
			});
		}
		return await result;
	}
	if (systemRunEvent) state.context.rememberAuthorizedSystemRunEvent({
		nodeId: params.nodeId,
		connId: node.connId,
		...systemRunEvent
	});
	params.onDispatchReady?.(requestId, dispatchDeadlineAtMs);
	return await result;
}
function registerNodeRegistryPrivateRuntime(nodeRegistry, context) {
	const state = {};
	state.context = context;
	state.runnerInventoryByConn = /* @__PURE__ */ new Map();
	state.bundleStatusByConn = /* @__PURE__ */ new Map();
	state.runnerState = createNodeRunnerStatePublisher(context.getNode, state.runnerInventoryByConn);
	state.generationBoundInvokes = /* @__PURE__ */ new WeakMap();
	state.invokeCore = async (params, allowPrivateCommand, isCompletionAuthorized) => await invokeNodeRegistryCore(state, params, allowPrivateCommand, isCompletionAuthorized);
	state.updateRunnerInventory = (params) => updateWorkerRunnerInventory(state, params);
	state.workerSupervisorTransport = {
		getCurrentNode: async (nodeId) => {
			const node = await context.getCurrentConnected(nodeId);
			return node ? resolveNodeWorkerSupervisorProof(node, state.runnerInventoryByConn) : void 0;
		},
		listCurrentNodes: async () => {
			return (await context.listCurrentConnected()).flatMap((node) => {
				const proof = resolveNodeWorkerSupervisorProof(node, state.runnerInventoryByConn);
				return proof ? [proof] : [];
			});
		},
		hasCurrentRunner: state.runnerState.hasCurrent,
		isConnected: (nodeId) => {
			const node = context.getNode(nodeId);
			return Boolean(node && node.client.invalidated !== true);
		},
		getIssue: (nodeId) => {
			const node = context.getNode(nodeId);
			return node ? resolveNodeRunnerInventoryIssue(node, state.runnerInventoryByConn) : void 0;
		},
		getBundleStatus: (nodeId) => {
			const node = context.getNode(nodeId);
			const observation = node ? state.bundleStatusByConn.get(node.connId) : void 0;
			return observation ? structuredClone(observation) : void 0;
		},
		acceptBundleStatus: (node, observation) => {
			if (!isNodeWorkerSupervisorProofCurrent(context.getNode(node.nodeId), state.runnerInventoryByConn, node)) return false;
			const currentNode = state.context.getNode(node.nodeId);
			const currentProof = currentNode ? resolveNodeWorkerSupervisorProof(currentNode, state.runnerInventoryByConn) : void 0;
			if (currentProof?.workerHost.bundleRetention !== 1 || currentProof.workerHost.bundleStatus !== 1) return false;
			const previous = state.bundleStatusByConn.get(node.connId);
			if (observation) state.bundleStatusByConn.set(node.connId, structuredClone(observation));
			else state.bundleStatusByConn.delete(node.connId);
			if (!sameBundleStatusObservation(previous, observation)) state.runnerState.reconcile(node.nodeId, true);
			return true;
		},
		isCurrent: (node, requireLaunchEligibility = false, requiredCommands = [], requireCapturedExecPolicy = false) => isNodeWorkerSupervisorProofCurrent(context.getNode(node.nodeId), state.runnerInventoryByConn, node, {
			launchEligibility: requireLaunchEligibility,
			commands: requiredCommands,
			capturedExecPolicy: requireCapturedExecPolicy
		}),
		invoke: async (params) => {
			if (!NODE_WORKER_PRIVATE_COMMANDS.includes(params.command)) return {
				ok: false,
				error: {
					code: "INVALID_REQUEST",
					message: "private node command is not allowed"
				}
			};
			const isProofCurrent = () => params.isDispatchAuthorized() && isNodeWorkerSupervisorProofCurrent(context.getNode(params.node.nodeId), state.runnerInventoryByConn, params.node, {
				environmentSession: params.command === "worker.launch.v1" || params.command === "worker.environment.stop.v1",
				preparedWorkspace: params.command === "worker.workspace.prepare.v1",
				capturedExecPolicy: params.command === "worker.launch.v1"
			});
			if (!isProofCurrent()) return {
				ok: false,
				error: {
					code: "PRIVATE_DIALECT_UNAVAILABLE",
					message: "node worker supervisor dialect is unavailable"
				}
			};
			return await state.invokeCore({
				nodeId: params.node.nodeId,
				expectedConnId: params.node.connId,
				expectedPairingGeneration: params.node.pairingGeneration,
				command: params.command,
				...params.params !== void 0 ? { params: params.params } : {},
				...params.timeoutMs !== void 0 ? { timeoutMs: params.timeoutMs } : {},
				...params.signal ? { signal: params.signal } : {},
				...params.idempotencyKey ? { idempotencyKey: params.idempotencyKey } : {},
				isDispatchAuthorized: isProofCurrent,
				...params.onDispatchReady ? { onDispatchReady: params.onDispatchReady } : {}
			}, true, isProofCurrent);
		}
	};
	NODE_REGISTRY_PRIVATE_STATES.set(nodeRegistry, state);
}
function createNodeRegistryRuntime(create) {
	const nodeRegistry = create();
	const state = NODE_REGISTRY_PRIVATE_STATES.get(nodeRegistry);
	if (!state) throw new Error("node registry private runtime was not initialized during creation");
	return {
		nodeRegistry,
		nodeWorkerSupervisorTransport: state.workerSupervisorTransport
	};
}
function setNodeRunnerStateChangedListener(nodeRegistry, listener) {
	const state = NODE_REGISTRY_PRIVATE_STATES.get(nodeRegistry);
	if (!state) throw new Error("node registry private runtime was not initialized");
	state.runnerState.setListener(listener);
}
function waitForNodeWorkerSupervisor(nodeRegistry, nodeId, options) {
	const state = NODE_REGISTRY_PRIVATE_STATES.get(nodeRegistry);
	if (!state) throw new Error("node registry private runtime was not initialized");
	return waitForNodeRunnerAvailability(state.runnerState, state.workerSupervisorTransport, nodeId, options);
}
function reconcileNodeRunnerAvailability(nodeRegistry, nodeId) {
	const state = NODE_REGISTRY_PRIVATE_STATES.get(nodeRegistry);
	if (!state) throw new Error("node registry private runtime was not initialized");
	state.runnerState.reconcile(nodeId, false);
}
function invokePublicNodeRegistry(nodeRegistry, params) {
	const state = NODE_REGISTRY_PRIVATE_STATES.get(nodeRegistry);
	if (!state) throw new Error("node registry private runtime was not initialized");
	return state.invokeCore(params, false);
}
function invokeLifecycleNodeRegistry(nodeRegistry, params) {
	const state = NODE_REGISTRY_PRIVATE_STATES.get(nodeRegistry);
	if (!state) throw new Error("node registry private runtime was not initialized");
	return state.invokeCore(params, false, params.isDispatchAuthorized);
}
function updateNodeRunnerInventory(params) {
	return NODE_REGISTRY_PRIVATE_STATES.get(params.registry)?.updateRunnerInventory({
		nodeId: params.nodeId,
		connId: params.connId,
		declaration: params.declaration
	}) ?? null;
}
function forgetNodeRunnerInventory(nodeRegistry, connId) {
	const state = NODE_REGISTRY_PRIVATE_STATES.get(nodeRegistry);
	const declaration = state?.runnerInventoryByConn.get(connId);
	if (!state || !declaration || !state.runnerInventoryByConn.delete(connId)) return;
	state.bundleStatusByConn.delete(connId);
	state.runnerState.reconcile(declaration.nodeId, true);
}
/** Capture the catalog's live metadata without reloading pairing or mutating registry state. */
function collectNodeCatalogRuntimeState(registry, connectedNodes, requireWorkerExecution = false) {
	const state = NODE_REGISTRY_PRIVATE_STATES.get(registry);
	return collectNodeRunnerCatalogState({
		connectedNodes,
		requireWorkerExecution,
		state: state && {
			getNode: state.context.getNode,
			runnerInventoryByConn: state.runnerInventoryByConn,
			bundleStatusByConn: state.bundleStatusByConn
		}
	});
}
function isNodeRegistryPendingInvokeConnectionActive(params) {
	const binding = NODE_REGISTRY_PRIVATE_STATES.get(params.registry)?.generationBoundInvokes.get(params.pending);
	return params.currentNode?.connId === params.pending.connId && (!binding || params.currentNode.pairingGeneration === binding.expectedGeneration);
}
function settleNodeRegistryPairingGenerationChange(params) {
	const state = NODE_REGISTRY_PRIVATE_STATES.get(params.registry);
	if (!state) return;
	const inventoryChanged = state.runnerInventoryByConn.delete(params.connId);
	const statusChanged = state.bundleStatusByConn.delete(params.connId);
	if (inventoryChanged || statusChanged) state.runnerState.reconcile(params.nodeId, true);
	for (const pending of state.context.pendingInvokes.values()) {
		const binding = state.generationBoundInvokes.get(pending);
		if (pending.nodeId !== params.nodeId || pending.connId !== params.connId || !binding || binding.expectedGeneration === params.nextPairingGeneration) continue;
		binding.controller.abort(NODE_INVOKE_PAIRING_CHANGED_ABORT);
	}
}
//#endregion
export { invokePublicNodeRegistry as a, registerNodeRegistryPrivateRuntime as c, updateNodeRunnerInventory as d, waitForNodeWorkerSupervisor as f, invokeLifecycleNodeRegistry as i, setNodeRunnerStateChangedListener as l, createNodeRegistryRuntime as n, isNodeRegistryPendingInvokeConnectionActive as o, isNodeWorkerHostClientId as p, forgetNodeRunnerInventory as r, reconcileNodeRunnerAvailability as s, collectNodeCatalogRuntimeState as t, settleNodeRegistryPairingGenerationChange as u };
