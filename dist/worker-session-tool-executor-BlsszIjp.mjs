import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { r as sha256HexPrefixCore } from "./node-crypto-BG4u3UnX.mjs";
import { t as sha256Base64Url } from "./crypto-digest-y6oZN-_F.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { g as readRuntimeConfig } from "./runtime-snapshot-BBYDJbw9.mjs";
import { o as composeSessionSourceAssertion } from "./session-source-authority-fdILH-PW.mjs";
import "./session-key-CSDERtm3.mjs";
import "./agent-limits-CB2bq0ey.mjs";
import { f as getWorkerTurnToolSurface, u as getWorkerTurnExecutionIdentityCapability } from "./placement-turn-claim-events-C-F0mgX3.mjs";
import { H as PlacedSessionsSendSchema, U as PlacedSessionsSpawnSchema } from "./worker-admission-DKoRQV__.mjs";
import { f as withGatewayToolCallerIdentity } from "./gateway-caller-context-Be176_GV.mjs";
import { t as jsonResult } from "./tool-results-BCM3fdVS.mjs";
import { i as copyAgentToolMetadata, n as bindAgentToolExecutionLocation, s as getAgentToolExecutionLocation, y as getBeforeToolCallHookContext } from "./agent-tool-metadata-Dj6F-G24.mjs";
import "./common-BofcG96e.mjs";
import { n as sessionDeliveryChannel } from "./delivery-context.read-CR06zOJ4.mjs";
import { l as withSessionEntryReadOnlyInWorker } from "./session-entry-read-runtime-CgqUrGct.mjs";
import "./config-B3oiWDlr.mjs";
import { r as resolveGatewaySessionStoreTargetInWorker } from "./session-utils-store-worker-u3lCvEEg.mjs";
import { c as rewrapToolWithBeforeToolCallHook, f as runWithToolExecutionValidation, t as buildBlockedToolResult } from "./agent-tools.before-tool-call-CtP0G8Wg.mjs";
import { t as bindAgentToolSourceExecutionGuard } from "./agent-tool-source-execution-guard-iFSXyZre.mjs";
import { n as createPortalOperations } from "./portal-service-3Aa4OnnY.mjs";
import { p as selectDelegatedToolPolicy } from "./subagent-capabilities-l3WVTf-e.mjs";
import { t as runAgentHarnessAfterToolCallHook } from "./hook-helpers-C0CV-oid.mjs";
import { c as runWithGatewayToolCleanupContext, i as callInProcessGatewayToolWithCreation, n as callAgentToolGatewayRequest, u as withAgentToolGatewayRuntimeIdentity } from "./in-process-gateway-DaAxH7mK.mjs";
import { c as runWithScopedSessionAccess, d as SessionPortalToolSchema, f as createPresenceTool, l as createAvailablePortalTools, o as createSessionsSendTool, p as PRESENCE_QUERY_TIMEOUT_MS, t as createSessionsSpawnTool, u as formatPortalResult } from "./sessions-spawn-tool-DhFS9chG.mjs";
import { d as buildSubagentExecutionSessionSpawnContext } from "./subagent-spawn-cleanup-Csz52Q2U.mjs";
import { h as resolveSenderRestrictedSpawnError } from "./spawn-thread-binding-eSCqchmA.mjs";
import { a as serializeWorkerSessionToolError, i as parseWorkerSessionToolResult, o as serializeWorkerSessionToolResult, r as executeWorkerSessionToolWithReplay, s as workerSessionToolErrorResult, t as WorkerSessionToolOutcomeUnknownError } from "./worker-session-tool-result-CIep8T6p.mjs";
import { isDeepStrictEqual } from "node:util";
import { Value } from "typebox/value";
//#region src/gateway/worker-environments/worker-portal-tool-executor.ts
/** Executes worker portals only while their exact placement and turn retain authority. */
function createWorkerPortalToolExecutor(params) {
	return async (request, source, assertSource) => {
		const assertPortalAuthority = () => {
			assertSource();
			if (!params.placements.isWorkerTurnToolAuthorized(source.turnClaim, "portal")) throw new Error("Worker session tool authority changed");
			const environment = params.environments.get(request.identity.environmentId);
			if (!environment || environment.state !== "attached" || environment.ownerEpoch !== request.identity.ownerEpoch || environment.attachedSessionIds.length !== 1 || environment.attachedSessionIds[0] !== source.sessionId) throw new Error("Worker source environment changed before portal operation");
			if (!environment.nodeDeviceId || environment.sshEndpoint !== null) throw new Error("Portals require a node-backed cloud-worker placement; move the session back to the gateway with sessions.move");
			return environment;
		};
		const environment = assertPortalAuthority();
		const service = params.portals.getService();
		if (!service) throw new Error("Gateway portals are unavailable");
		request.signal?.throwIfAborted();
		const portals = createPortalOperations(service, {
			environmentId: environment.environmentId,
			ownerEpoch: environment.ownerEpoch,
			assertCurrent: () => {
				assertPortalAuthority();
				request.signal?.throwIfAborted();
			},
			ownershipError: "Worker portal is not owned by the active environment",
			prepareTarget: async (remotePort) => ({
				...await params.portals.carrier.open({
					environmentId: environment.environmentId,
					ownerEpoch: environment.ownerEpoch,
					remotePort
				}),
				origin: environment.profileId
			})
		}, params.portals.onChanged);
		if (request.request.action === "list") return formatPortalResult({
			action: "list",
			result: portals.list()
		});
		if (request.request.action === "close") {
			const id = request.request.id;
			if (!id) throw new Error("portal id required");
			return formatPortalResult({
				action: "close",
				id,
				result: await portals.close(id)
			});
		}
		const remotePort = request.request.port;
		if (remotePort === void 0) throw new Error("portal port required");
		return formatPortalResult({
			action: "open",
			result: await portals.open({
				...request.request,
				port: remotePort
			})
		});
	};
}
//#endregion
//#region src/gateway/worker-environments/worker-session-tool-topology.ts
async function readWorkerSessionToolEntry(sessionKey, agentId) {
	const target = await resolveGatewaySessionStoreTargetInWorker({
		cfg: readRuntimeConfig(),
		key: sessionKey,
		agentId
	});
	return {
		...target,
		storePath: target.readSource?.path ?? target.storePath,
		entry: target.store[target.canonicalKey]
	};
}
async function resolveWorkerSessionToolSource(params) {
	const identity = params.identity;
	const claim = identity.turnClaim;
	if (!identity.sessionId || !claim || claim.owner.kind !== "worker") throw new Error("Worker session operation requires an active source turn");
	const authority = await params.placements.prepareTurnClaimAuthority(claim);
	try {
		const source = authority.identity;
		const assertCurrent = () => {
			if (!authority.isCurrent()) throw new Error("Worker source session placement changed");
		};
		const bound = getWorkerTurnExecutionIdentityCapability(params.placements, claim)?.sessionTarget;
		const loaded = bound ? {
			canonicalKey: bound.sessionKey,
			entry: await withSessionEntryReadOnlyInWorker(bound, assertCurrent, async (read) => {
				if (!read.ok) throw read.error;
				return read.value;
			})
		} : await readWorkerSessionToolEntry(source.sessionKey, source.agentId);
		assertCurrent();
		if (loaded.canonicalKey !== source.sessionKey || loaded.entry?.sessionId !== identity.sessionId || loaded.entry.archivedAt !== void 0) throw new Error("Worker source session incarnation changed");
		return {
			agentId: source.agentId,
			sessionKey: source.sessionKey,
			sessionId: identity.sessionId,
			turnClaim: {
				...claim,
				owner: claim.owner
			},
			entry: loaded.entry
		};
	} finally {
		authority.release();
	}
}
async function resolveWorkerSessionToolTarget(params) {
	const loaded = await readWorkerSessionToolEntry(params.requestedSessionKey);
	const entry = loaded.entry;
	const targetSessionId = entry?.sessionId;
	if (loaded.canonicalKey !== params.requestedSessionKey || !targetSessionId || !entry || entry.archivedAt !== void 0 || targetSessionId === params.source.sessionId) throw new Error("Worker sessions_send target is not an exact live session");
	const sourceParent = normalizeOptionalString(params.source.entry.parentSessionKey) ?? normalizeOptionalString(params.source.entry.spawnedBy);
	const sourceParentId = normalizeOptionalString(params.source.entry.parentSessionId);
	const targetParent = normalizeOptionalString(entry.parentSessionKey) ?? normalizeOptionalString(entry.spawnedBy);
	const targetParentId = normalizeOptionalString(entry.parentSessionId);
	const parentToChild = targetParent === params.source.sessionKey && targetParentId === params.source.sessionId;
	const childToParent = sourceParent === loaded.canonicalKey && sourceParentId === targetSessionId;
	const parent = Boolean(sourceParent && sourceParentId && sourceParent === targetParent && sourceParentId === targetParentId) && sourceParent && sourceParentId ? await readWorkerSessionToolEntry(sourceParent) : void 0;
	const siblingToSibling = Boolean(parent && parent.canonicalKey === sourceParent && parent.entry?.sessionId === sourceParentId && parent.entry?.archivedAt === void 0);
	if (!parentToChild && !childToParent && !siblingToSibling) throw new Error("Worker sessions_send target is outside the authorized session tree");
	return {
		agentId: loaded.agentId,
		sessionKey: loaded.canonicalKey,
		sessionId: targetSessionId,
		storePath: loaded.storePath,
		...siblingToSibling && parent && sourceParent && sourceParentId ? { topologyParent: {
			agentId: parent.agentId,
			sessionKey: sourceParent,
			sessionId: sourceParentId,
			storePath: parent.storePath
		} } : {}
	};
}
async function assertWorkerSessionToolChild(params) {
	const loaded = await readWorkerSessionToolEntry(params.childSessionKey, params.targetAgentId);
	const parent = normalizeOptionalString(loaded.entry?.parentSessionKey) ?? normalizeOptionalString(loaded.entry?.spawnedBy);
	const parentSessionId = normalizeOptionalString(loaded.entry?.parentSessionId);
	if (loaded.canonicalKey !== params.childSessionKey || loaded.storePath !== params.storePath || loaded.entry?.sessionId !== params.childSessionId || loaded.entry.archivedAt !== void 0 || parent !== params.sourceSessionKey || parentSessionId !== params.sourceSessionId) throw new Error("Spawned cloud child session incarnation changed");
}
//#endregion
//#region src/gateway/worker-environments/worker-session-tool-send.ts
async function executeWorkerSessionSend(operation) {
	const config = readRuntimeConfig();
	const executeFencedSend = async () => {
		const assertCurrentTarget = async () => {
			const target = await resolveWorkerSessionToolTarget({
				source: operation.source,
				requestedSessionKey: operation.request.sessionKey
			});
			if (target.sessionId !== operation.target.sessionId || target.storePath !== operation.target.storePath || target.topologyParent?.sessionKey !== operation.target.topologyParent?.sessionKey || target.topologyParent?.sessionId !== operation.target.topologyParent?.sessionId || target.topologyParent?.storePath !== operation.target.topologyParent?.storePath) throw new Error("Worker sessions_send target incarnation changed");
			operation.assertSource();
		};
		await assertCurrentTarget();
		const tool = createSessionsSendTool({
			agentSessionKey: operation.source.sessionKey,
			agentId: operation.source.agentId,
			agentSessionId: operation.source.sessionId,
			assertSourceCurrent: operation.assertSource,
			agentChannel: sessionDeliveryChannel(operation.source.entry),
			expectedTargetSessionId: operation.target.sessionId,
			expectedTargetStorePath: operation.target.storePath,
			completionOwner: "caller",
			idempotencyKey: operation.idempotencyKey,
			config,
			...operation.signal ? { signal: operation.signal } : {},
			callGateway: async (request) => {
				await assertCurrentTarget();
				return operation.callGateway(request);
			}
		});
		return executeWorkerSessionToolWithReplay(async (replay) => {
			operation.assertSource();
			if (replay) await assertCurrentTarget();
			const { toolCallId, ...args } = operation.request;
			return tool.execute(toolCallId, {
				...args,
				sessionKey: operation.target.sessionKey
			});
		});
	};
	const topologyParent = operation.target.topologyParent;
	if (!topologyParent) return await executeFencedSend();
	return await runWithScopedSessionAccess({
		cfg: config,
		agentId: topologyParent.agentId,
		storePath: topologyParent.storePath,
		expectedSessionId: topologyParent.sessionId,
		targetSessionKey: topologyParent.sessionKey,
		...operation.signal ? { signal: operation.signal } : {},
		run: executeFencedSend
	});
}
//#endregion
//#region src/gateway/worker-environments/worker-session-tool-source.ts
function prepareWorkerSessionToolRequest(binding, toolName, toolCallId, raw) {
	if (toolName === "sessions_spawn" && Value.Check(PlacedSessionsSpawnSchema, raw)) return {
		...binding,
		toolName,
		request: {
			...raw,
			toolCallId
		}
	};
	if (toolName === "sessions_send" && Value.Check(PlacedSessionsSendSchema, raw)) return {
		...binding,
		toolName,
		request: {
			...raw,
			toolCallId
		}
	};
	if (toolName === "portal" && Value.Check(SessionPortalToolSchema, raw)) {
		if ((raw.title?.length ?? 0) > 256 || (raw.description?.length ?? 0) > 8192 || (raw.path?.length ?? 0) > 1024 || (raw.id?.length ?? 0) > 256) return;
		return {
			...binding,
			toolName,
			request: {
				...raw,
				toolCallId
			}
		};
	}
}
function createWorkerSessionToolSourceRunner(params) {
	return async (operation) => {
		const startArgs = operation.request.request.arguments;
		if (!isRecord(startArgs)) throw new Error("Worker tool arguments must be an object");
		const capability = getWorkerTurnExecutionIdentityCapability(params.placements, operation.source.turnClaim);
		if (!capability) throw new Error("Worker source turn has no operational owner");
		const assertToolCurrent = composeSessionSourceAssertion([capability.receiptAuthority], (assertSource) => {
			assertSource();
			operation.request.signal?.throwIfAborted();
			if (!params.placements.isWorkerTurnToolAuthorized(operation.source.turnClaim, operation.request.toolName)) throw new Error("Worker tool authority changed");
		});
		return await runWithScopedSessionAccess({
			cfg: readRuntimeConfig(),
			agentId: operation.source.agentId,
			storePath: capability.sessionTarget.storePath,
			expectedSessionId: operation.source.sessionId,
			targetSessionKey: operation.source.sessionKey,
			...operation.request.signal ? { signal: operation.request.signal } : {},
			run: () => capability.run((owner) => withGatewayToolCallerIdentity({
				...owner,
				gatewayContextResolver: params.resolveGatewayContext,
				approvalAuthority: owner.delegatedAuthority,
				receiptAuthority: assertToolCurrent,
				workerTurnClaim: owner.turnClaim,
				workerTurnExecutionIdentityCapability: capability,
				...operation.request.signal ? { approvalSignals: [operation.request.signal] } : {}
			}, async () => {
				const assertSource = composeSessionSourceAssertion([assertToolCurrent], (assertCurrent) => {
					assertCurrent();
					const source = operation.source;
					if (source.agentId !== owner.agentId || source.sessionKey !== owner.sessionKey) throw new Error("Worker source turn owner changed");
				});
				const callGateway = async (request, sessionSpawnContext) => {
					assertSource();
					return await capability.run(() => callAgentToolGatewayRequest(withAgentToolGatewayRuntimeIdentity({
						...request,
						...operation.request.signal ? { signal: operation.request.signal } : {}
					}, {
						kind: "agentRuntime",
						agentId: owner.agentId,
						sessionKey: owner.sessionKey,
						operationalRunInstance: owner.operationalRunInstance,
						delegatedAuthority: {
							kind: "worker",
							...owner.delegatedAuthority,
							turnClaim: owner.turnClaim
						},
						executionIdentity: owner.executionIdentityToken,
						sessionSpawnContext
					})));
				};
				assertSource();
				const startedAt = Date.now();
				const request = operation.request;
				let result;
				let errorMessage;
				try {
					const sourceTool = typeof request.tool === "function" ? request.tool({
						assertSource,
						callGateway,
						collectExecutionIdentity: owner.executionIdentityToken !== void 0
					}) : request.tool;
					const tool = rewrapToolWithBeforeToolCallHook(bindAgentToolSourceExecutionGuard(sourceTool, assertSource), getBeforeToolCallHookContext(sourceTool) ?? {
						...operation.source,
						config: readRuntimeConfig(),
						runId: request.identity.runId ?? void 0
					}, request.approvalMode ? { approvalMode: request.approvalMode } : {});
					result = await runWithToolExecutionValidation(request.request.toolCallId, (args) => {
						if (typeof request.tool !== "function" && !Value.Check(tool.parameters, args)) throw new Error(`Invalid ${request.toolName} arguments`);
					}, () => tool.execute(request.request.toolCallId, request.request.arguments, request.signal, request.onUpdate));
					assertSource();
					return result;
				} catch (error) {
					errorMessage = workerSessionToolErrorResult(error).details.error;
					throw error;
				} finally {
					runAgentHarnessAfterToolCallHook({
						toolName: request.toolName,
						toolCallId: request.request.toolCallId,
						runId: request.identity.runId ?? void 0,
						agentId: owner.agentId,
						sessionKey: owner.sessionKey,
						sessionId: operation.source.sessionId,
						startArgs,
						result,
						error: errorMessage,
						startedAt
					});
				}
			}))
		});
	};
}
//#endregion
//#region src/gateway/worker-environments/worker-session-tool-executor.ts
function operationKey(operationSeed, purpose) {
	return sha256Base64Url(`openclaw.worker-session-tool-operation.v1\0${operationSeed}\0${purpose}`);
}
function createWorkerSessionToolExecutor(params, definitions) {
	const inFlight = /* @__PURE__ */ new Map();
	const executePortal = createWorkerPortalToolExecutor(params);
	const runWithSource = createWorkerSessionToolSourceRunner(params);
	const runTool = (source, request, execute) => {
		const { toolCallId, ...args } = request.request;
		return runWithSource({
			source,
			request: {
				...request,
				approvalMode: "deny",
				request: {
					toolCallId,
					arguments: args
				},
				tool: (authority) => copyAgentToolMetadata(definitions[request.toolName], {
					...definitions[request.toolName],
					execute: (id, raw, signal, onUpdate) => {
						const prepared = prepareWorkerSessionToolRequest({
							...request,
							signal,
							onUpdate
						}, request.toolName, id, raw);
						if (!prepared) return Promise.resolve(buildBlockedToolResult({
							reason: `Tool call blocked because before_tool_call returned invalid ${request.toolName} input.`,
							toolCallId: id,
							runId: request.identity.runId ?? void 0
						}));
						return execute(authority, prepared);
					}
				})
			}
		});
	};
	const spawn = async (operation, { assertSource, callGateway, collectExecutionIdentity }) => {
		if (params.delegatedToolPolicyActive) return jsonResult({
			status: "forbidden",
			error: "Worker-originated child spawning cannot preserve this delegated execution grant. Start the helper from a Gateway-side native session."
		});
		const restrictedError = resolveSenderRestrictedSpawnError({
			inheritedToolPolicySource: params.inheritedToolPolicySource,
			visible: true
		});
		if (restrictedError) return jsonResult({
			status: "forbidden",
			error: restrictedError
		});
		const targetAgentId = normalizeAgentId(operation.request.agentId ?? operation.source.agentId);
		selectDelegatedToolPolicy({
			config: readRuntimeConfig(),
			requesterSessionKey: operation.source.sessionKey,
			requesterAgentId: operation.source.agentId,
			targetAgentId,
			inheritedToolPolicySource: params.inheritedToolPolicySource
		});
		const sourceEnvironment = params.environments.get(operation.identity.environmentId);
		if (!sourceEnvironment || sourceEnvironment.state !== "attached" || sourceEnvironment.ownerEpoch !== operation.identity.ownerEpoch || !isDeepStrictEqual(sourceEnvironment.attachedSessionIds, [operation.source.sessionId])) throw new Error("Worker source environment changed before child spawn");
		const toolRuntime = getWorkerTurnToolSurface(operation.identity);
		const surface = await toolRuntime?.getSurface(operation.identity);
		assertSource();
		if (!surface || !toolRuntime) throw new Error("Worker tool surface is unavailable");
		const authorizedTools = surface.tools.map((tool) => tool.definition.name).filter((name) => params.placements.isWorkerTurnToolAuthorized(operation.source.turnClaim, name));
		const inheritedPublicationTool = toolRuntime.getInheritedPublicationToolName();
		if (inheritedPublicationTool) authorizedTools.push(inheritedPublicationTool);
		const gatewayCall = async (method, requestParams) => {
			if (method !== "sessions.create") return await runWithGatewayToolCleanupContext(() => callAgentToolGatewayRequest({
				method,
				params: requestParams,
				timeoutMs: null
			}), params.resolveGatewayContext);
			assertSource();
			let loaded = await readWorkerSessionToolEntry(operation.childSessionKey, targetAgentId);
			let createResponse;
			let creationAttempted = false;
			if (loaded.entry?.sessionId) {
				const parent = normalizeOptionalString(loaded.entry.parentSessionKey) ?? normalizeOptionalString(loaded.entry.spawnedBy);
				const parentSessionId = normalizeOptionalString(loaded.entry.parentSessionId);
				if (loaded.canonicalKey !== operation.childSessionKey || parent !== operation.source.sessionKey || parentSessionId !== operation.source.sessionId) throw new Error("Cloud child idempotency key is already owned by another session");
			} else {
				const { source } = operation;
				const createParams = {
					...requestParams,
					...source.entry.permissionMode ? { permissionMode: source.entry.permissionMode } : {},
					key: operation.childSessionKey
				};
				delete createParams.task;
				creationAttempted = true;
				try {
					createResponse = await callInProcessGatewayToolWithCreation("sessions.create", createParams, {
						via: "spawn",
						actor: {
							type: "agent",
							id: source.agentId
						},
						requesterSessionKey: source.sessionKey,
						inheritedToolPolicy: {
							version: 1,
							allow: authorizedTools,
							deny: [...params.inheritedToolDenylist ?? []]
						}
					}, {
						resolveGatewayContext: params.resolveGatewayContext,
						sessionMutationCommitGuard: assertSource,
						...operation.signal ? { signal: operation.signal } : {},
						timeoutMs: null
					});
				} catch (error) {
					loaded = await readWorkerSessionToolEntry(operation.childSessionKey, targetAgentId);
					if (!loaded.entry?.sessionId) throw error;
				}
				loaded = await readWorkerSessionToolEntry(operation.childSessionKey, targetAgentId);
			}
			const childSessionId = loaded.entry?.sessionId;
			if (!childSessionId) {
				const error = /* @__PURE__ */ new Error("Cloud child session creation did not persist an incarnation");
				throw creationAttempted ? new WorkerSessionToolOutcomeUnknownError(error) : error;
			}
			const assertChild = () => assertWorkerSessionToolChild({
				childSessionKey: operation.childSessionKey,
				childSessionId,
				sourceSessionKey: operation.source.sessionKey,
				sourceSessionId: operation.source.sessionId,
				targetAgentId,
				storePath: loaded.storePath
			});
			try {
				await assertChild();
			} catch (error) {
				if (creationAttempted) throw new WorkerSessionToolOutcomeUnknownError(error);
				throw error;
			}
			try {
				const config = readRuntimeConfig();
				return await runWithScopedSessionAccess({
					cfg: config,
					agentId: targetAgentId,
					storePath: loaded.storePath,
					expectedSessionId: childSessionId,
					targetSessionKey: operation.childSessionKey,
					...operation.signal ? { signal: operation.signal } : {},
					run: async () => {
						await assertChild();
						const assertActiveChildPlacement = () => {
							const placement = params.placements.get(childSessionId);
							if (placement?.state !== "active" || placement.sessionKey !== operation.childSessionKey) throw new Error("Cloud child placement did not become active");
							const environment = params.environments.get(placement.environmentId);
							if (environment?.state !== "attached" || environment.ownerEpoch !== placement.activeOwnerEpoch || environment.attachedSessionIds.length !== 1 || environment.attachedSessionIds[0] !== childSessionId || environment.profileId !== sourceEnvironment.profileId || environment.providerId !== sourceEnvironment.providerId || !isDeepStrictEqual(environment.profileSnapshot, sourceEnvironment.profileSnapshot)) throw new Error("Cloud child placement does not match its parent profile");
						};
						const childPlacement = await params.placements.getAsync(childSessionId);
						assertSource();
						if (childPlacement?.state !== "active") try {
							await params.dispatchChild({
								sessionId: childSessionId,
								sessionKey: operation.childSessionKey,
								agentId: targetAgentId,
								profileId: sourceEnvironment.profileId,
								executionMode: "worker-turn",
								inheritedProfile: {
									providerId: sourceEnvironment.providerId,
									profileSnapshot: sourceEnvironment.profileSnapshot
								}
							}, void 0, assertSource);
						} catch (error) {
							try {
								assertActiveChildPlacement();
							} catch {
								throw new WorkerSessionToolOutcomeUnknownError(error);
							}
						}
						assertActiveChildPlacement();
						assertSource();
						await assertChild();
						const childRunId = operationKey(operation.operationSeed, "initial-task");
						const sessionSpawnContext = collectExecutionIdentity ? buildSubagentExecutionSessionSpawnContext({
							enabled: true,
							backend: "subagent",
							parentAgentId: operation.source.agentId,
							requesterRef: operation.source.sessionKey,
							controllerRef: operation.source.sessionKey,
							depth: (operation.source.entry.spawnDepth ?? 0) + 1,
							maxDepth: config.agents?.defaults?.subagents?.maxSpawnDepth ?? 5,
							targetAgentId,
							sandbox: "inherit",
							inheritedToolAllowlist: authorizedTools,
							inheritedToolDenylist: params.inheritedToolDenylist
						}) : void 0;
						const run = await executeWorkerSessionToolWithReplay(async () => {
							assertSource();
							await assertChild();
							assertSource();
							assertActiveChildPlacement();
							return callGateway({
								method: "agent",
								agentRunTracking: "native_subagent",
								params: {
									sessionKey: operation.childSessionKey,
									sessionId: childSessionId,
									expectedExistingSessionId: childSessionId,
									message: operation.request.task,
									deliver: false,
									sessionEffects: "visible",
									idempotencyKey: `worker-session-spawn:${childRunId}`
								},
								...operation.signal ? { signal: operation.signal } : {},
								timeoutMs: null
							}, sessionSpawnContext);
						});
						const runId = typeof run.runId === "string" ? run.runId : void 0;
						return {
							...createResponse ?? {
								ok: true,
								key: loaded.canonicalKey,
								sessionId: childSessionId,
								entry: loaded.entry
							},
							...run,
							runStarted: Boolean(runId),
							...runId ? { runId } : {}
						};
					}
				});
			} catch (error) {
				throw error instanceof WorkerSessionToolOutcomeUnknownError ? error : new WorkerSessionToolOutcomeUnknownError(error);
			}
		};
		const tool = createSessionsSpawnTool({
			agentSessionKey: operation.source.sessionKey,
			requesterTurnRunId: operation.identity.runId ?? void 0,
			requesterAgentIdOverride: operation.source.agentId,
			inheritedToolAllowlist: authorizedTools,
			inheritedToolDenylist: params.inheritedToolDenylist,
			inheritedToolPolicySource: params.inheritedToolPolicySource,
			callGateway: gatewayCall,
			expectedParentSessionId: operation.source.sessionId,
			...operation.signal ? { signal: operation.signal } : {}
		});
		const { toolCallId, ...args } = operation.request;
		return await tool.execute(toolCallId, {
			...args,
			expectsCompletionMessage: false,
			visible: true,
			worktree: true
		});
	};
	return async (request) => {
		const source = await resolveWorkerSessionToolSource({
			identity: request.identity,
			placements: params.placements
		});
		if (request.toolName === "portal") return await runTool(source, request, async (authority, prepared) => {
			if (prepared.toolName !== "portal") throw new Error("Worker tool policy changed the tool identity");
			return executePortal(prepared, source, authority.assertSource);
		});
		const requestDigest = sha256Base64Url(`openclaw.worker-session-tool-request.v1\0${JSON.stringify({
			toolName: request.toolName,
			sourceSessionId: source.sessionId,
			...request.toolName === "sessions_spawn" ? {
				task: request.request.task,
				label: request.request.label ?? null,
				agentId: request.request.agentId ?? null,
				model: request.request.model ?? null,
				runTimeoutSeconds: request.request.runTimeoutSeconds ?? null
			} : {
				sessionKey: request.request.sessionKey,
				message: request.request.message,
				timeoutSeconds: request.request.timeoutSeconds ?? null
			}
		})}`);
		const started = await params.placements.beginWorkerSessionToolOperation({
			claim: source.turnClaim,
			toolName: request.toolName,
			toolCallId: request.request.toolCallId,
			requestDigest
		}, () => {
			request.signal?.throwIfAborted();
			if (!params.placements.isWorkerTurnToolAuthorized(source.turnClaim, request.toolName)) throw new Error("Worker session tool authority changed");
		});
		if (started.kind === "completed") return parseWorkerSessionToolResult(started.resultJson);
		if (started.kind === "unknown" || started.kind === "conflict" || started.kind === "capacity") {
			const message = {
				unknown: "The prior operation outcome is unknown; it was not replayed",
				conflict: "Worker tool call id was reused",
				capacity: "Too many worker session operations are already in progress"
			}[started.kind];
			return workerSessionToolErrorResult(new Error(message));
		}
		if (started.kind === "unauthorized") throw new Error("Worker session tool authority changed");
		const sourceClaimId = source.turnClaim.claimId;
		const operationIdentity = {
			sourceSessionId: source.sessionId,
			sourceClaimId,
			toolCallId: request.request.toolCallId,
			requestDigest
		};
		const inFlightKey = `${source.sessionId}\0${sourceClaimId}\0${request.request.toolCallId}`;
		if (started.kind === "in-progress") {
			const existing = inFlight.get(inFlightKey);
			return existing ? parseWorkerSessionToolResult(await existing) : workerSessionToolErrorResult(/* @__PURE__ */ new Error("Worker session operation is already in progress"));
		}
		const operation = (async () => {
			let result;
			let failed = false;
			try {
				result = await runTool(source, request, async (authority, prepared) => {
					if (prepared.toolName !== "sessions_spawn" && prepared.toolName !== "sessions_send") throw new Error("Worker tool policy changed the tool identity");
					if (prepared.toolName === "sessions_spawn") {
						const childKey = `agent:${normalizeAgentId(prepared.request.agentId ?? source.agentId)}:dashboard:cloud-${sha256HexPrefixCore(`openclaw.worker-session-tool-operation.v1\0${started.operationSeed}\0child-session`, 32)}`;
						if (!await params.placements.bindWorkerSessionToolOperationChild({
							...operationIdentity,
							childSessionKey: childKey
						})) throw new Error("Worker child spawn operation changed before execution");
						return await spawn({
							source,
							identity: prepared.identity,
							request: prepared.request,
							operationSeed: started.operationSeed,
							childSessionKey: childKey,
							signal: prepared.signal
						}, authority);
					}
					return await executeWorkerSessionSend({
						assertSource: authority.assertSource,
						callGateway: authority.callGateway,
						source,
						target: await resolveWorkerSessionToolTarget({
							source,
							requestedSessionKey: prepared.request.sessionKey
						}),
						request: prepared.request,
						idempotencyKey: `worker-session-send:${operationKey(started.operationSeed, "target-send")}`,
						signal: prepared.signal
					});
				});
			} catch (error) {
				if (error instanceof WorkerSessionToolOutcomeUnknownError || request.signal?.aborted) {
					if (!await params.placements.abandonWorkerSessionToolOperation(operationIdentity)) return serializeWorkerSessionToolError(/* @__PURE__ */ new Error("Worker session operation lost ownership"));
					return serializeWorkerSessionToolError(error instanceof WorkerSessionToolOutcomeUnknownError ? error : /* @__PURE__ */ new Error("Worker session operation outcome is unknown after cancellation"));
				}
				failed = true;
				result = workerSessionToolErrorResult(error);
			}
			const resultJson = serializeWorkerSessionToolResult(result);
			return await params.placements.completeWorkerSessionToolOperation({
				...operationIdentity,
				resultJson,
				failed
			}) ? resultJson : serializeWorkerSessionToolError(/* @__PURE__ */ new Error("Worker session operation lost ownership"));
		})();
		inFlight.set(inFlightKey, operation);
		try {
			return parseWorkerSessionToolResult(await operation);
		} finally {
			inFlight.delete(inFlightKey);
		}
	};
}
function createWorkerWorkshopCallRetention() {
	const calls = /* @__PURE__ */ new Map();
	return (toolCallId, args, execute) => {
		const digest = JSON.stringify(args);
		const prior = calls.get(toolCallId);
		if (prior && prior.digest !== digest) throw new Error("Workshop tool call id was reused with different arguments.");
		if (!prior && calls.size >= 64) throw new Error("This turn reached its Workshop operation limit. Continue in a fresh turn.");
		const result = prior?.result ?? execute();
		calls.set(toolCallId, {
			digest,
			result
		});
		return result;
	};
}
async function createWorkerGatewayTools(params) {
	const claim = params.identity.turnClaim;
	const capability = claim && getWorkerTurnExecutionIdentityCapability(params.placements, claim);
	if (!claim || !capability) throw new Error("Worker source turn has no operational owner");
	const source = capability.sessionTarget;
	const toolOptions = {
		agentSessionKey: source.sessionKey,
		workerPlacement: true
	};
	const portal = createAvailablePortalTools({
		workerScoped: true,
		sessionPortalTarget: {
			agentId: source.agentId,
			sessionKey: source.sessionKey,
			environmentId: params.identity.environmentId,
			assertCurrent: capability.receiptAuthority
		}
	})[0];
	const presence = createPresenceTool({ assertSourceCurrent: capability.assertPresenceSourceCurrent });
	bindAgentToolExecutionLocation(presence, {
		kind: "gateway",
		connectionScoped: true,
		timeout: { minimumMs: PRESENCE_QUERY_TIMEOUT_MS }
	});
	const assertAuthorized = (name) => {
		capability.receiptAuthority();
		if (!params.placements.isWorkerTurnToolAuthorized(claim, name)) throw new Error("Worker tool authority changed");
	};
	const authorizeTool = (tool, execute) => copyAgentToolMetadata(tool, {
		...tool,
		execute: async (...args) => {
			assertAuthorized(tool.name);
			const result = await execute(...args);
			assertAuthorized(tool.name);
			return result;
		}
	});
	const definitions = {
		sessions_spawn: createSessionsSpawnTool(toolOptions),
		sessions_send: createSessionsSendTool(toolOptions),
		portal
	};
	const execute = createWorkerSessionToolExecutor(params, definitions);
	const adapters = Object.values(definitions).map((tool) => {
		const bound = authorizeTool(tool, (toolCallId, raw, signal, onUpdate) => {
			const operation = prepareWorkerSessionToolRequest({
				identity: params.identity,
				signal,
				onUpdate
			}, tool.name, toolCallId, raw);
			if (!operation) throw new Error(`Invalid ${tool.name} arguments`);
			return execute(operation);
		});
		bindAgentToolExecutionLocation(bound, {
			kind: "gateway",
			...tool.name === "portal" && params.portalAvailable === false ? { unavailableReason: "this placement has no portal transport" } : {},
			replay: tool.name === "sessions_spawn" || tool.name === "sessions_send",
			...tool.name === "sessions_spawn" ? { timeout: { minimumMs: 9e5 } } : tool.name === "sessions_send" ? { timeout: {
				argument: "timeoutSeconds",
				defaultSeconds: 30,
				paddingMs: 6e4
			} } : {}
		});
		return bound;
	});
	const adapterNames = new Set(adapters.map((tool) => tool.name));
	const runWithSource = createWorkerSessionToolSourceRunner(params);
	const retainWorkshopCall = createWorkerWorkshopCallRetention();
	const tools = [
		...adapters,
		presence,
		...params.skillWorkshop ? [params.skillWorkshop] : []
	];
	const preparedTools = await (params.prepareTools?.(tools) ?? tools);
	capability.receiptAuthority();
	return preparedTools.map((tool) => {
		if (getAgentToolExecutionLocation(tool).kind === "placement" || adapterNames.has(tool.name)) return tool;
		return authorizeTool(tool, (toolCallId, args, signal, onUpdate) => {
			const invoke = () => runWithSource({
				source: {
					...source,
					turnClaim: claim
				},
				request: {
					tool,
					toolName: tool.name,
					...tool.name === "presence" || tool.name === "skill_workshop" ? { approvalMode: "deny" } : {},
					identity: params.identity,
					signal,
					onUpdate,
					request: {
						toolCallId,
						arguments: args
					}
				}
			});
			return tool.name === "skill_workshop" ? retainWorkshopCall(toolCallId, args, invoke) : invoke();
		});
	});
}
//#endregion
export { createWorkerGatewayTools, createWorkerSessionToolExecutor, createWorkerWorkshopCallRetention };
