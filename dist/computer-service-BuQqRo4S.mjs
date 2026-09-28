import { t as getActivePluginGatewayNodePolicyRegistry } from "./runtime-state-C5tDvNBc.mjs";
import { v as NODE_WORKER_DESKTOP_COMPUTER_COMMAND } from "./node-commands-BLhGKTZa.mjs";
import { O as validateAgentRunDelegatedAuthority, s as getActiveAgentRunDelegatedAuthority } from "./agent-run-registry-DO6Dg2r0.mjs";
import { m as parseComputerUseCapabilityDescriptor } from "./computer-use-contract-DzawlQtp.mjs";
import { s as isComputerObservationAction } from "./computer-tool-shared-B6dQ6PvX.mjs";
import { l as resolveNodeCommandAllowlist, o as isNodeCommandAllowed } from "./node-command-policy-CnGfXM76.mjs";
import { n as parseNodeWorkerComputerInput } from "./node-computer-protocol-DyPyYkCS.mjs";
import { n as WorkerRunnerUnavailableError } from "./tunnel-contract-C4XjTxW-.mjs";
import { n as invokeNodeWithReadinessRetry, t as applyPluginNodeInvokePolicy } from "./node-invoke-plugin-policy-ZU-EgBiE.mjs";
import { randomUUID } from "node:crypto";
//#region src/gateway/worker-environments/computer-transport.ts
const COMPUTER_COMMANDS = ["screen.snapshot", "computer.act"];
function payload(result) {
	if (!result.ok) throw new Error(result.error?.message ?? "Session desktop command failed");
	return result.payloadJSON ? JSON.parse(result.payloadJSON) : result.payload;
}
/** Captures one environment's desktop under its placement or conversation attachment owner. */
function createEnvironmentComputerTransportOwner(options) {
	return async (source) => {
		source.assertCurrent();
		const environment = options.store.get(source.environmentId);
		if (!environment?.nodeDeviceId || !environment.desktop && !environment.sharedHost) return;
		const context = options.resolveGatewayContext();
		const nodeTransport = options.getNodeTransport();
		if (!context || !nodeTransport) throw new Error("Session desktop Gateway is unavailable");
		const node = context.nodeRegistry.get(environment.nodeDeviceId);
		if (!node) throw new WorkerRunnerUnavailableError();
		const environmentIsCurrent = (current) => {
			const currentNode = context.nodeRegistry.get(node.nodeId);
			return options.resolveGatewayContext() === context && options.getNodeTransport() === nodeTransport && current?.leaseId === environment.leaseId && current?.ownerEpoch === environment.ownerEpoch && current?.nodeDeviceId === node.nodeId && currentNode?.connId === node.connId && currentNode?.pairingGeneration === node.pairingGeneration && currentNode.client.invalidated !== true;
		};
		const sourceIsCurrent = () => {
			try {
				source.assertCurrent();
			} catch {
				return false;
			}
			const currentEnvironment = options.store.get(environment.environmentId);
			return environmentIsCurrent(currentEnvironment) && currentEnvironment?.ownerEpoch === source.ownerEpoch && [
				"ready",
				"idle",
				"attached"
			].includes(currentEnvironment.state) && currentEnvironment.destroyRequestedAtMs === null;
		};
		const assertPlacement = () => {
			if (!sourceIsCurrent()) throw new Error("Session desktop placement authority changed");
		};
		assertPlacement();
		const privateNode = environment.sharedHost ? void 0 : await nodeTransport.getCurrentNode(node.nodeId);
		assertPlacement();
		if (!environment.sharedHost && !privateNode) throw new Error("Session desktop node lacks the current private worker protocol");
		let computerUse = node.computerUse;
		if (privateNode) {
			const result = await nodeTransport.invoke({
				node: privateNode,
				command: NODE_WORKER_DESKTOP_COMPUTER_COMMAND,
				params: { operation: "capabilities" },
				isDispatchAuthorized: sourceIsCurrent
			});
			assertPlacement();
			if (!nodeTransport.isCurrent(privateNode)) throw new Error("Session desktop private node owner changed");
			if (!result.ok) {
				options.warn("Session computer control is unavailable; enable the desktop provider and reprovision the worker.");
				return;
			}
			computerUse = parseComputerUseCapabilityDescriptor(payload(result));
		} else if (!COMPUTER_COMMANDS.every((command) => node.commands.includes(command))) return;
		if (!computerUse) return;
		const registry = getActivePluginGatewayNodePolicyRegistry();
		if (privateNode && !registry?.nodeInvokePolicies.some((entry) => entry.policy.commands.includes("computer.act"))) {
			options.warn("Session computer control is unavailable; enable its provider plugin on the Gateway.");
			return;
		}
		const policyOwners = COMPUTER_COMMANDS.map((command) => {
			const entry = registry?.nodeInvokePolicies.find((item) => item.policy.commands.includes(command));
			const policy = entry?.policy;
			const plugin = registry?.plugins.find((item) => item.id === entry?.pluginId);
			return () => registry?.nodeInvokePolicies.find((item) => item.policy.commands.includes(command)) === entry && entry?.policy === policy && (!plugin || registry?.plugins.includes(plugin) && plugin.enabled && plugin.status === "loaded");
		});
		const descriptor = {
			nodeId: node.nodeId,
			computerUse
		};
		const providerGeneration = computerUse.provider.generation;
		let closed = false;
		let closing;
		const activeBindings = /* @__PURE__ */ new Set();
		const resourceBindingIsCurrent = () => environmentIsCurrent(options.store.get(environment.environmentId)) && (!privateNode || nodeTransport.isCurrent(privateNode));
		const bindingIsCurrent = () => (!privateNode || nodeTransport.isCurrent(privateNode)) && getActivePluginGatewayNodePolicyRegistry() === registry && policyOwners.every((isCurrent) => isCurrent()) && (privateNode !== void 0 || context.nodeRegistry.get(node.nodeId)?.computerUse?.provider.generation === providerGeneration);
		const parseRequest = (request) => {
			if (request.nodeId !== node.nodeId) throw new Error("Computer control is bound to this session's desktop");
			const close = request.command === "computer.act" && request.commandParams.action === "__close_execution";
			const input = parseNodeWorkerComputerInput(JSON.stringify(close ? {
				operation: "close",
				executionId: request.commandParams.executionId,
				reason: request.commandParams.reason
			} : {
				operation: request.command === "screen.snapshot" ? "snapshot" : "act",
				providerGeneration,
				params: request.commandParams
			}));
			if (input.operation === "capabilities") throw new Error("Session computer cannot request another capability probe");
			return input;
		};
		const send = async (input, params) => {
			const isCurrent = () => resourceBindingIsCurrent() && params.isDispatchAuthorized();
			if (!isCurrent()) throw new Error("Session computer authority closed before dispatch");
			const command = input.operation === "snapshot" ? "screen.snapshot" : "computer.act";
			const commandParams = input.operation === "close" ? {
				action: "__close_execution",
				executionId: input.executionId,
				reason: input.reason
			} : input.params;
			return privateNode ? await nodeTransport.invoke({
				node: privateNode,
				command: NODE_WORKER_DESKTOP_COMPUTER_COMMAND,
				params: input,
				...params,
				isDispatchAuthorized: isCurrent
			}) : await invokeNodeWithReadinessRetry(input.operation === "close" ? { invoke: (request) => context.nodeRegistry.invokeLifecycle({
				...request,
				isDispatchAuthorized: isCurrent
			}) } : context.nodeRegistry, {
				nodeId: node.nodeId,
				expectedConnId: node.connId,
				expectedPairingGeneration: node.pairingGeneration,
				command,
				params: commandParams,
				sessionKey: source.sessionKey,
				...params,
				isDispatchAuthorized: isCurrent
			});
		};
		return {
			descriptor,
			bind(operationalRunInstance) {
				const authority = getActiveAgentRunDelegatedAuthority(operationalRunInstance);
				if (!authority || operationalRunInstance.runId !== source.runId) throw new Error("Session computer requires the exact admitted run");
				const identity = {
					kind: "agentRuntime",
					agentId: source.agentId,
					sessionKey: source.sessionKey,
					operationalRunInstance,
					delegatedAuthority: source.turnClaim?.owner.kind === "worker" ? {
						...authority,
						kind: "worker",
						turnClaim: source.turnClaim
					} : {
						...authority,
						kind: "local"
					}
				};
				let execution;
				let bindingClosed = false;
				let bindingClosing;
				const inFlight = /* @__PURE__ */ new Set();
				const inputControllers = /* @__PURE__ */ new Set();
				let releaseControlListener;
				let inputNeedsObservation = false;
				let controlGeneration = 0;
				const lifetime = new AbortController();
				const assertCurrent = () => {
					if (closed || bindingClosed || !bindingIsCurrent() || !validateAgentRunDelegatedAuthority(authority)) throw new Error("Session computer run authority closed");
					assertPlacement();
				};
				assertCurrent();
				const execute = async (input, request, assertAuthorized) => {
					const isInput = input.operation === "act" && !isComputerObservationAction(input.params.action, input.params.action === "browser_dialog" ? input.params.dialogAction : void 0);
					const controller = new AbortController();
					if (isInput) inputControllers.add(controller);
					const assertInvocationCurrent = () => {
						assertCurrent();
						assertAuthorized?.();
						if (isInput && options.desktopRegistry?.hasController(environment.environmentId, environment.ownerEpoch)) throw new Error("Computer input paused while the operator has control; release control in the Desktop panel to resume");
						if (isInput && inputNeedsObservation) throw new Error("COMPUTER_STALE_OBSERVATION: take a fresh screenshot after the operator releases control");
						controller.signal.throwIfAborted();
					};
					const command = input.operation === "snapshot" ? "screen.snapshot" : "computer.act";
					const commandParams = input.params;
					const isCurrent = () => {
						try {
							assertInvocationCurrent();
							return true;
						} catch {
							return false;
						}
					};
					const signal = AbortSignal.any([
						lifetime.signal,
						controller.signal,
						...request.signal ? [request.signal] : []
					]);
					try {
						assertInvocationCurrent();
						const dispatch = async (params) => {
							const actual = parseNodeWorkerComputerInput(JSON.stringify({
								...input,
								params: params.params
							}));
							if (actual.operation === "capabilities" || actual.operation === "close" || actual.params.executionId !== execution?.physicalId) throw new Error("Computer policy cannot replace the session execution owner");
							return await send(actual, {
								timeoutMs: params.timeoutMs,
								signal: params.signal,
								idempotencyKey: params.idempotencyKey,
								isDispatchAuthorized: () => isCurrent() && params.isDispatchAuthorized(),
								onDispatchReady: params.onDispatchReady
							});
						};
						const commandIsAllowed = () => {
							const currentNode = context.nodeRegistry.get(node.nodeId);
							const declaredCommands = privateNode ? [...COMPUTER_COMMANDS] : currentNode?.commands ?? [];
							return isNodeCommandAllowed({
								command,
								declaredCommands,
								allowlist: resolveNodeCommandAllowlist(context.getRuntimeConfig(), {
									...currentNode,
									approvedCommands: declaredCommands
								})
							}).ok;
						};
						const result = await applyPluginNodeInvokePolicy({
							context,
							client: null,
							agentRuntimeIdentity: identity,
							nodeSession: node,
							command,
							params: commandParams,
							sessionKey: source.sessionKey,
							timeoutMs: request.timeoutMs,
							idempotencyKey: request.idempotencyKey,
							signal,
							isInvocationCurrent: isCurrent,
							isApprovalAuthorityActive: isCurrent,
							privateTransport: {
								...privateNode ? { commands: COMPUTER_COMMANDS } : {},
								isCurrent,
								invoke: dispatch
							}
						});
						assertInvocationCurrent();
						if (result) {
							if (!result.ok) throw new Error(result.message ?? "Session computer action denied");
							return result.payloadJSON ? JSON.parse(result.payloadJSON) : result.payload;
						}
						if (privateNode && command === "computer.act" || !commandIsAllowed()) throw new Error("Session computer command has no active policy or permission");
						const raw = await dispatch({
							params: commandParams,
							timeoutMs: request.timeoutMs,
							signal,
							idempotencyKey: request.idempotencyKey,
							isDispatchAuthorized: () => isCurrent() && commandIsAllowed()
						});
						assertInvocationCurrent();
						return payload(raw);
					} finally {
						inputControllers.delete(controller);
					}
				};
				const binding = { close(reason) {
					if (bindingClosing) return bindingClosing;
					bindingClosed = true;
					lifetime.abort();
					releaseControlListener?.();
					bindingClosing = (async () => {
						await Promise.allSettled(inFlight);
						if (!execution || !resourceBindingIsCurrent()) {
							activeBindings.delete(binding);
							return { ok: true };
						}
						const result = await send({
							operation: "close",
							executionId: execution.physicalId,
							reason: reason.slice(0, 64)
						}, { isDispatchAuthorized: resourceBindingIsCurrent });
						if (!resourceBindingIsCurrent()) throw new Error("Session computer cleanup owner changed");
						const output = payload(result);
						activeBindings.delete(binding);
						return output;
					})();
					return bindingClosing;
				} };
				return {
					computerUse,
					async resolveNode(query, signal) {
						signal?.throwIfAborted();
						assertCurrent();
						if (query !== void 0 && query !== node.nodeId) throw new Error("Computer control is bound to this session's desktop");
						return descriptor;
					},
					async invoke(request, assertAuthorized) {
						const input = parseRequest(request);
						const logicalId = input.operation === "close" ? input.executionId : input.params.executionId;
						if (execution && logicalId !== execution.logicalId) throw new Error("Session computer execution owner changed");
						if (input.operation === "close") return binding.close(input.reason);
						assertCurrent();
						request.signal?.throwIfAborted();
						execution ??= {
							logicalId,
							physicalId: randomUUID()
						};
						activeBindings.add(binding);
						releaseControlListener ??= options.desktopRegistry?.onControlChanged(environment.environmentId, environment.ownerEpoch, (controlled) => {
							inputNeedsObservation = true;
							controlGeneration += 1;
							if (controlled) for (const controller of inputControllers) controller.abort(/* @__PURE__ */ new Error("Computer input paused while the operator has control"));
						});
						input.params.executionId = execution.physicalId;
						const observedControlGeneration = controlGeneration;
						const operation = execute(input, request, assertAuthorized).then((result) => {
							if (input.operation === "snapshot" && controlGeneration === observedControlGeneration && !options.desktopRegistry?.hasController(environment.environmentId, environment.ownerEpoch)) inputNeedsObservation = false;
							return result;
						});
						inFlight.add(operation);
						operation.finally(() => inFlight.delete(operation)).catch(() => {});
						return operation;
					}
				};
			},
			close(reason) {
				if (closing) return closing;
				closed = true;
				closing = (async () => {
					const failures = (await Promise.allSettled([...activeBindings].map((binding) => binding.close(reason)))).filter((result) => result.status === "rejected");
					if (failures.length) throw new AggregateError(failures.map((failure) => failure.reason), "Session computer cleanup failed");
				})();
				return closing;
			}
		};
	};
}
/** Placement admission retains its exact turn claim; attachments use the same transport owner. */
function createWorkerComputerTransportOwner(options) {
	const create = createEnvironmentComputerTransportOwner(options);
	return (claim) => {
		const placement = options.placements.get(claim.sessionId);
		if (placement?.state !== "active" || !options.placements.validateTurnClaim(claim)) return Promise.reject(/* @__PURE__ */ new Error("Session desktop placement is no longer active"));
		return create({
			environmentId: placement.environmentId,
			ownerEpoch: placement.activeOwnerEpoch,
			sessionId: claim.sessionId,
			sessionKey: placement.sessionKey,
			agentId: placement.agentId,
			runId: claim.runId,
			turnClaim: claim,
			assertCurrent() {
				const current = options.placements.get(claim.sessionId);
				const environment = options.store.get(placement.environmentId);
				if (!options.placements.validateTurnClaim(claim) || current?.state !== "active" || current.generation !== claim.placementGeneration || current.sessionKey !== placement.sessionKey || current.agentId !== placement.agentId || current.environmentId !== placement.environmentId || current.activeOwnerEpoch !== placement.activeOwnerEpoch || environment?.state !== "attached" || environment.attachedSessionIds.length !== 1 || environment.attachedSessionIds[0] !== claim.sessionId) throw new Error("Session desktop placement authority changed");
			}
		});
	};
}
//#endregion
//#region src/gateway/worker-environments/computer-service.ts
/** Owns prepared computer lifetimes across conversation, worker-connection, and Gateway closure. */
function createWorkerComputerService(options) {
	const create = createWorkerComputerTransportOwner(options);
	const createAttached = createEnvironmentComputerTransportOwner(options);
	const attachedOwners = /* @__PURE__ */ new Map();
	const owners = /* @__PURE__ */ new Map();
	const closeOwner = (owner, reason) => {
		if (owner.closing) return owner.closing;
		owner.transport = void 0;
		owner.connection?.signal.removeEventListener("abort", owner.connection.abort);
		owner.closing = (async () => {
			try {
				await owner.prepared;
				await owner.closeComputer?.(reason);
			} finally {
				if (owners.get(owner.claimId) === owner) owners.delete(owner.claimId);
			}
		})();
		return owner.closing;
	};
	const unregister = options.placements.registerTurnClaimClosedHandler((claim) => {
		const owner = owners.get(claim.claimId);
		if (owner) closeOwner(owner, "turn-closed").catch(() => options.warn("Session computer cleanup failed after turn closure."));
	});
	let stopped = false;
	return {
		prepareAttached: (authority) => {
			if (stopped) return Promise.reject(/* @__PURE__ */ new Error("Session computer owner closed"));
			const prepared = createAttached({
				...authority,
				assertCurrent: () => {
					if (stopped) throw new Error("Session computer owner closed");
					authority.assertCurrent();
				}
			}).then((computer) => computer ? {
				...computer,
				close: async (reason) => {
					await computer.close(reason);
					attachedOwners.delete(prepared);
				}
			} : void 0);
			attachedOwners.set(prepared, authority);
			prepared.then((computer) => {
				if (!computer) attachedOwners.delete(prepared);
			}, () => attachedOwners.delete(prepared));
			return prepared;
		},
		closeEnvironment: async (environmentId, ownerEpoch) => {
			const failures = (await Promise.allSettled([...attachedOwners].filter(([, source]) => source.environmentId === environmentId && (ownerEpoch === void 0 || source.ownerEpoch === ownerEpoch)).map(async ([prepared]) => (await prepared.catch(() => void 0))?.close("environment-stopped")))).flatMap((result) => result.status === "rejected" ? [result.reason] : []);
			if (failures.length) throw new AggregateError(failures, "Attached computer cleanup failed");
		},
		prepare: (claim) => {
			if (stopped || !options.placements.validateTurnClaim(claim)) return Promise.reject(/* @__PURE__ */ new Error("Session computer owner closed"));
			const prior = owners.get(claim.claimId);
			if (prior) return prior.prepared;
			const prepared = create(claim).then((computer) => {
				if (!computer) return;
				owner.closeComputer = (reason) => computer.close(reason);
				const assertOwner = () => {
					if (stopped || owner.closing || owners.get(claim.claimId) !== owner) throw new Error("Session computer owner replaced");
				};
				return {
					...computer,
					bind(run) {
						assertOwner();
						const transport = computer.bind(run);
						const bound = {
							computerUse: transport.computerUse,
							async resolveNode(query, signal) {
								assertOwner();
								const result = await transport.resolveNode(query, signal);
								assertOwner();
								return result;
							},
							async invoke(request, assertAuthorized) {
								assertOwner();
								const result = await transport.invoke(request, () => {
									assertOwner();
									assertAuthorized?.();
								});
								assertOwner();
								return result;
							}
						};
						owner.transport = bound;
						return bound;
					},
					close: (reason) => closeOwner(owner, reason)
				};
			});
			const owner = {
				claimId: claim.claimId,
				prepared
			};
			owners.set(claim.claimId, owner);
			return prepared;
		},
		execute: (async ({ identity, request, signal, assertCurrent }) => {
			assertCurrent();
			const claim = identity.turnClaim;
			const owner = claim ? owners.get(claim.claimId) : void 0;
			const computer = await owner?.prepared;
			assertCurrent();
			if (!computer || !owner?.transport || owner.closing || owners.get(owner.claimId) !== owner || !signal || owner.connection && owner.connection.signal !== signal) throw new Error("Session computer connection is unavailable; start a new turn");
			signal.throwIfAborted();
			if (!owner.connection) {
				const abort = () => {
					closeOwner(owner, "worker-disconnect").catch(() => options.warn("Session computer cleanup failed after worker disconnect."));
				};
				owner.connection = {
					signal,
					abort
				};
				signal.addEventListener("abort", abort, { once: true });
			}
			const result = await owner.transport.invoke({
				nodeId: computer.descriptor.nodeId,
				command: request.command,
				commandParams: JSON.parse(request.paramsJson),
				timeoutMs: request.timeoutMs,
				idempotencyKey: request.idempotencyKey,
				signal
			}, assertCurrent);
			assertCurrent();
			return { resultJson: JSON.stringify(result) };
		}),
		close: async () => {
			stopped = true;
			unregister();
			const failures = (await Promise.allSettled([...[...owners.values()].map((owner) => closeOwner(owner, "gateway-stop")), ...[...attachedOwners.keys()].map(async (prepared) => (await prepared.catch(() => void 0))?.close("gateway-stop"))])).filter((result) => result.status === "rejected");
			if (failures.length) throw new AggregateError(failures.map((failure) => failure.reason), "Session computer cleanup failed");
		}
	};
}
//#endregion
export { createWorkerComputerService };
