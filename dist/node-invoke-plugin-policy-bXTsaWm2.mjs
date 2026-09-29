import { a as asOptionalRecord } from "./record-coerce-DItp3I4t.mjs";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { t as getActivePluginGatewayNodePolicyRegistry } from "./runtime-state-C5tDvNBc.mjs";
import { i as getPluginRuntimeGatewayRequestScope } from "./gateway-request-scope-BLBH-Gpf.mjs";
import { h as sleep } from "./utils-aKqR_F_U.mjs";
import { n as recordRuntimeActionDecision } from "./runtime-action-decision-DdRNB2jf.mjs";
import { i as sanitizeExecApprovalWarningText, n as sanitizeExecApprovalDisplayText } from "./exec-approval-text-sanitize-B7wKpPNH.mjs";
import { t as sanitizeApprovalScope } from "./approval-scope-CfvRogZm.mjs";
import { f as resolvePluginApprovalTimeoutMs } from "./plugin-approvals-DV5u4TwS.mjs";
import { t as resolveCanonicalPluginApprovalRequestAllowedDecisions } from "./plugin-approval-canonical-decisions-QZU5yCd0.mjs";
import { l as resolveNodeCommandAllowlist, o as isNodeCommandAllowed } from "./node-command-policy-CnGfXM76.mjs";
import "./node-registry.invoke-stream-DjYGQ16n.mjs";
import { t as ApprovalObserverClosedError } from "./exec-approval-lifecycle-CTgxWCaJ.mjs";
import { t as bindApprovalRequesterMetadata } from "./approval-shared-Dq8WeEIr.mjs";
import { t as handlePendingPluginApprovalRequest } from "./plugin-approval-request-delivery-B_YPXKg6.mjs";
import { randomUUID } from "node:crypto";
//#region src/gateway/node-invoke-placement-grant.ts
function isBindingCurrentForOwner(owner, binding) {
	try {
		owner.assertCurrent(binding);
		return true;
	} catch {
		return false;
	}
}
function resolveNodeInvokePlacementGrant(params) {
	const binding = params.requestedDecisions?.includes("allow-always") === true && params.owner && params.approvalScope !== void 0 && params.risk?.level === "high" && params.nodeSession.pairingGeneration && params.runtime ? params.runtime.resolveBinding({
		pluginId: params.pluginId,
		command: params.command,
		approvalScope: params.approvalScope,
		agentId: params.owner.agentId,
		sessionKey: params.owner.sessionKey,
		nodeId: params.nodeSession.nodeId,
		pairingGeneration: params.nodeSession.pairingGeneration
	}) : null;
	const currentBinding = binding && params.owner && isBindingCurrentForOwner(params.owner, binding) ? binding : null;
	if (currentBinding && params.runtime) {
		const existing = params.runtime.validate(currentBinding);
		if (existing.outcome === "consumed") return {
			kind: "granted",
			binding: currentBinding,
			approvalId: existing.grant.mintedByApprovalId
		};
	}
	return {
		kind: "prompt",
		binding: currentBinding,
		allowedDecisions: params.requestedDecisions?.includes("allow-always") === true && !currentBinding ? params.requestedDecisions.filter((decision) => decision !== "allow-always") : params.requestedDecisions
	};
}
function retainResolvedNodeInvokePlacementGrant(params) {
	if (params.decision !== "allow-always" || !params.binding) return true;
	if (!params.owner || !isBindingCurrentForOwner(params.owner, params.binding) || params.runtime?.validate(params.binding).outcome !== "consumed") return false;
	params.authorization.binding = params.binding;
	return true;
}
function consumeNodeInvokePlacementGrant(params) {
	if (!params.authorization.binding) return "not-required";
	try {
		return params.runtime?.consume(params.authorization.binding).outcome === "consumed" ? "consumed" : "rejected";
	} catch {
		return "rejected";
	}
}
//#endregion
//#region src/gateway/node-invoke-plugin-approval.ts
function sanitizeOptionalMeta(value) {
	const normalized = normalizeOptionalString(value);
	return normalized ? sanitizeExecApprovalDisplayText(normalized) : null;
}
function normalizeRouteThreadId(value) {
	if (typeof value === "number" && Number.isFinite(value)) return value;
	return normalizeOptionalString(value) ?? null;
}
function resolveNodeInvokeTurnSourceFields(turnSource) {
	return {
		turnSourceChannel: normalizeOptionalString(turnSource?.channel) ?? null,
		turnSourceTo: normalizeOptionalString(turnSource?.to) ?? null,
		turnSourceAccountId: normalizeOptionalString(turnSource?.accountId) ?? null,
		turnSourceThreadId: normalizeRouteThreadId(turnSource?.threadId)
	};
}
function createPluginNodeInvokeApprovalRuntime(params) {
	const manager = params.context.pluginApprovalManager;
	if (!manager) return;
	return { async request(input) {
		const timeoutMs = resolvePluginApprovalTimeoutMs(input.timeoutMs);
		const turnSource = resolveNodeInvokeTurnSourceFields(params.turnSource);
		const callerIdentity = params.callerIdentity;
		const invocationSessionKey = params.client?.internal?.pluginRuntimeOwnerId === params.pluginId ? params.client.internal.nodeInvokeApprovalSessionKey : void 0;
		if (!params.isCurrent()) throw new Error("agent runtime approval authority is no longer active");
		const requestedDecisions = input.allowedDecisions === void 0 ? void 0 : resolveCanonicalPluginApprovalRequestAllowedDecisions({ allowedDecisions: input.allowedDecisions });
		const scopedAuthority = params.placementGrantAuthority;
		const placementGrantOwner = scopedAuthority ? {
			agentId: scopedAuthority.agentId,
			sessionKey: scopedAuthority.sessionKey,
			assertCurrent: (binding) => scopedAuthority.assertCurrent({
				pluginId: binding.pluginId,
				command: binding.command,
				nodeId: binding.nodeId,
				workspace: {
					workspaceDir: binding.cwd,
					environmentId: binding.environmentId,
					sessionId: binding.sessionId,
					ownerEpoch: binding.ownerEpoch,
					sessionKey: binding.sessionKey
				}
			})
		} : void 0;
		const placementGrantResolution = resolveNodeInvokePlacementGrant({
			runtime: params.context.placementStandingGrants,
			requestedDecisions,
			owner: placementGrantOwner,
			pluginId: params.pluginId,
			command: params.command,
			...params.approvalScope ? { approvalScope: params.approvalScope } : {},
			risk: params.risk,
			nodeSession: params.nodeSession
		});
		if (placementGrantResolution.kind === "granted") {
			params.standingGrantAuthorization.binding = placementGrantResolution.binding;
			return {
				id: placementGrantResolution.approvalId,
				decision: "allow-always"
			};
		}
		const { allowedDecisions, binding: placementGrant } = placementGrantResolution;
		const request = {
			pluginId: params.pluginId,
			title: truncateUtf16Safe(sanitizeExecApprovalDisplayText(normalizeOptionalString(input.title) ?? ""), 80),
			description: truncateUtf16Safe(sanitizeExecApprovalWarningText(normalizeOptionalString(input.description) ?? ""), 256),
			scope: input.scope ? sanitizeApprovalScope(input.scope) : null,
			severity: input.severity ?? "warning",
			...allowedDecisions === void 0 ? {} : { allowedDecisions },
			toolName: sanitizeOptionalMeta(input.toolName),
			toolCallId: normalizeOptionalString(input.toolCallId) ?? null,
			agentId: callerIdentity?.agentId ?? scopedAuthority?.agentId ?? sanitizeOptionalMeta(input.agentId),
			sessionKey: callerIdentity?.sessionKey ?? scopedAuthority?.sessionKey ?? invocationSessionKey ?? normalizeOptionalString(input.sessionKey) ?? null,
			runId: callerIdentity?.operationalRunInstance.runId ?? scopedAuthority?.runId ?? null,
			placementGrant,
			turnSourceChannel: turnSource.turnSourceChannel,
			turnSourceTo: turnSource.turnSourceTo,
			turnSourceAccountId: turnSource.turnSourceAccountId,
			turnSourceThreadId: turnSource.turnSourceThreadId
		};
		const record = manager.create(request, timeoutMs, `plugin:${randomUUID()}`);
		if (callerIdentity) {
			record.agentRuntimeDelegatedAuthority = callerIdentity.delegatedAuthority;
			if (callerIdentity.executionIdentity) record.executionIdentityToken = callerIdentity.executionIdentity;
		}
		if (placementGrant && placementGrantOwner) record.approvalAuthority = () => {
			placementGrantOwner.assertCurrent(placementGrant);
			return true;
		};
		bindApprovalRequesterMetadata({
			record,
			client: params.client
		});
		const respond = () => {};
		const { decision: decisionPromise } = await manager.register(record, timeoutMs);
		await handlePendingPluginApprovalRequest({
			manager,
			record,
			respond,
			context: params.context,
			twoPhase: false,
			forwardRequest: params.context.forwardPluginApprovalRequest,
			getIosPushDelivery: () => params.context.pluginApprovalIosPushDelivery,
			source: "node-policy"
		});
		let decision = manager.projectDecisionIfActive(record.id, await decisionPromise);
		if (!params.isCurrent()) return {
			id: record.id,
			decision: null
		};
		if (decision === "allow-once" && !await manager.consumeAllowOnce(record.id, `plugin.node.invoke:${record.id}`)) return {
			id: record.id,
			decision: null
		};
		decision = manager.projectDecisionIfActive(record.id, decision);
		if (!retainResolvedNodeInvokePlacementGrant({
			runtime: params.context.placementStandingGrants,
			decision,
			binding: placementGrant,
			owner: placementGrantOwner,
			authorization: params.standingGrantAuthorization
		})) return {
			id: record.id,
			decision: null
		};
		return {
			id: record.id,
			decision
		};
	} };
}
//#endregion
//#region src/gateway/node-invoke-readiness.ts
const READINESS_RETRY_DELAYS_MS = [
	100,
	250,
	500,
	1e3
];
/** Recover only an explicit rejection before native execution, inside the RPC's authority. */
async function invokeNodeWithReadinessRetry(registry, request) {
	let deadlineAtMs = request.deadlineAtMs ?? (request.timeoutMs !== void 0 && Number.isFinite(request.timeoutMs) && request.timeoutMs > 0 ? performance.now() + request.timeoutMs : void 0);
	const timedOut = () => ({
		ok: false,
		error: {
			code: "TIMEOUT",
			message: "node invoke timed out"
		}
	});
	for (let attempt = 0;; attempt += 1) {
		const timeoutMs = deadlineAtMs === void 0 ? request.timeoutMs : Math.max(0, deadlineAtMs - performance.now());
		if (deadlineAtMs !== void 0 && timeoutMs === 0) return timedOut();
		const result = await registry.invoke({
			...request,
			timeoutMs,
			deadlineAtMs,
			onDispatchReady: (invokeId, dispatchDeadlineAtMs) => {
				if (dispatchDeadlineAtMs !== void 0 && (deadlineAtMs === void 0 || dispatchDeadlineAtMs < deadlineAtMs)) deadlineAtMs = dispatchDeadlineAtMs;
				request.onDispatchReady?.(invokeId, dispatchDeadlineAtMs);
			}
		});
		const delayMs = READINESS_RETRY_DELAYS_MS[attempt];
		if (result.ok || result.error?.code !== "NODE_NOT_READY" || delayMs === void 0) return result;
		try {
			await sleep(deadlineAtMs === void 0 ? delayMs : Math.min(delayMs, Math.max(0, deadlineAtMs - performance.now())), request.signal);
		} catch (error) {
			if (deadlineAtMs !== void 0 && performance.now() >= deadlineAtMs) return timedOut();
			if (request.signal?.aborted) return {
				ok: false,
				error: {
					code: "ABORTED",
					message: "node invoke cancelled"
				}
			};
			throw error;
		}
	}
}
//#endregion
//#region src/gateway/node-invoke-plugin-policy.ts
function parseScopes(client) {
	return Array.isArray(client?.connect?.scopes) ? client.connect.scopes.filter((scope) => typeof scope === "string") : [];
}
function parsePayload(payloadJSON, payload) {
	if (!payloadJSON) return payload;
	try {
		return JSON.parse(payloadJSON);
	} catch {
		return payload;
	}
}
function findDangerousPluginNodeCommand(registry, command) {
	const normalizedCommand = command.trim();
	if (!normalizedCommand) return null;
	return registry?.nodeHostCommands?.find((entry) => entry.command.dangerous === true && entry.command.command.trim() === normalizedCommand) ?? null;
}
function validateRiskClassification(value) {
	const family = normalizeOptionalString(value?.family);
	if (value?.level !== "ordinary" && value?.level !== "high" || !family || !/^[a-z0-9][a-z0-9._-]{0,63}$/u.test(family)) return null;
	return {
		level: value.level,
		family
	};
}
function resolveStandingApprovalScope(value) {
	const approval = asOptionalRecord(value);
	const scope = normalizeOptionalString(approval?.scope);
	return approval?.kind === "placement" && scope && /^[a-z0-9][a-z0-9._-]{0,63}$/u.test(scope) ? scope : void 0;
}
/** Applies the registered plugin policy for a node.invoke command, if one exists. */
async function applyPluginNodeInvokePolicy(params) {
	const registry = getActivePluginGatewayNodePolicyRegistry();
	const callerIdentity = params.agentRuntimeIdentity ?? params.client?.internal?.agentRuntimeIdentity;
	const token = callerIdentity?.executionIdentity;
	const isCallerRuntimeAuthorityActive = () => !callerIdentity || params.context.validateAgentRuntimeApprovalAuthority?.(callerIdentity) === true;
	const decisionOccurrenceId = randomUUID();
	let receiptOrdinal = 0;
	const recordNodeDecision = (input) => {
		receiptOrdinal += 1;
		recordRuntimeActionDecision({
			token,
			family: "node",
			operation: "invoke",
			outcome: input.outcome,
			coverageState: input.coverageState,
			reasonCode: input.reasonCode,
			owner: "node-runtime",
			decisionBoundary: "gateway.node-invoke-plugin-policy",
			policyRefs: [
				"node:pairing",
				"node:command-capability",
				"plugin:node-invoke-policy"
			],
			summary: input.summary,
			missingEvidence: input.missingEvidence,
			remediation: input.remediation ?? [],
			discriminator: JSON.stringify([
				input.pluginId,
				params.nodeSession.nodeId,
				params.command,
				decisionOccurrenceId,
				receiptOrdinal
			])
		});
	};
	const trustedTurnSource = callerIdentity ? params.turnSource : void 0;
	const entry = registry?.nodeInvokePolicies?.find((candidate) => candidate.policy.commands.includes(params.command));
	if (!entry) {
		const dangerousCommand = findDangerousPluginNodeCommand(registry, params.command);
		if (dangerousCommand) {
			recordNodeDecision({
				pluginId: dangerousCommand.pluginId,
				outcome: "denied",
				coverageState: "enforced",
				reasonCode: "node_plugin_policy_missing",
				summary: "A dangerous plugin-owned node command was denied because its policy was missing."
			});
			return {
				ok: false,
				code: "PLUGIN_POLICY_MISSING",
				message: `node.invoke ${params.command} is registered as dangerous by plugin ${dangerousCommand.pluginId} but has no plugin node.invoke policy`,
				details: { nodeCommandDispatched: false }
			};
		}
		return null;
	}
	let risk;
	if (entry.policy.classifyRisk) {
		try {
			risk = validateRiskClassification(entry.policy.classifyRisk({
				command: params.command,
				params: params.params
			})) ?? void 0;
		} catch {}
		if (!risk) {
			recordNodeDecision({
				pluginId: entry.pluginId,
				outcome: "denied",
				coverageState: "enforced",
				reasonCode: "node_risk_classification_failed",
				summary: "A plugin-owned node command was denied before transport after risk classification failed."
			});
			return {
				ok: false,
				code: "PLUGIN_POLICY_RISK_CLASSIFICATION_FAILED",
				message: `node.invoke ${params.command} arguments could not be classified by plugin ${entry.pluginId}`,
				details: { nodeCommandDispatched: false }
			};
		}
	}
	const approvalScope = resolveStandingApprovalScope(entry.policy.standingApproval);
	let nodeCommandDispatched = false;
	let nodeGateDecisionRecorded = false;
	const standingGrantAuthorization = {};
	const pluginRecord = registry?.plugins.find((record) => record.id === entry.pluginId);
	const policy = entry.policy;
	const isPluginCurrent = () => getActivePluginGatewayNodePolicyRegistry() === registry && entry.policy === policy && registry?.nodeInvokePolicies.includes(entry) === true && (!pluginRecord || registry.plugins.includes(pluginRecord) && pluginRecord.enabled && pluginRecord.status === "loaded");
	const dispatchNode = async (override = {}, sessionAuthority) => {
		const deny = (reasonCode, result) => {
			nodeGateDecisionRecorded = true;
			recordNodeDecision({
				pluginId: entry.pluginId,
				outcome: "denied",
				coverageState: "enforced",
				reasonCode,
				summary: "A plugin-owned node command was denied at the Gateway dispatch gate."
			});
			return result;
		};
		sessionAuthority?.assertCurrent();
		if (!isCallerRuntimeAuthorityActive()) return deny("node_runtime_authority_closed", {
			ok: false,
			code: "APPROVAL_AUTHORITY_CLOSED",
			message: "agent runtime approval authority closed before node dispatch"
		});
		if (params.isInvocationCurrent && !await params.isInvocationCurrent()) return deny("node_pairing_changed", {
			ok: false,
			code: "PAIRING_CHANGED",
			message: "node pairing changed before dispatch"
		});
		const currentNode = params.nodeSession.pairingGeneration ? params.context.nodeRegistry.getForPairingGeneration(params.nodeSession.nodeId, params.nodeSession.pairingGeneration) : params.context.nodeRegistry.get(params.nodeSession.nodeId);
		if (!currentNode || currentNode.connId !== params.nodeSession.connId) return deny("node_route_changed", {
			ok: false,
			code: "ROUTE_CHANGED",
			message: "node connection changed before dispatch"
		});
		if (currentNode.client.invalidated === true) return deny("node_pairing_changed", {
			ok: false,
			code: "PAIRING_CHANGED",
			message: "node pairing changed before dispatch"
		});
		const resolveCommandAuthorization = () => {
			const declaredCommands = params.privateTransport?.commands ? [...params.privateTransport.commands] : currentNode.commands;
			return isNodeCommandAllowed({
				command: params.command,
				declaredCommands,
				allowlist: resolveNodeCommandAllowlist(params.context.getRuntimeConfig(), {
					...currentNode,
					approvedCommands: declaredCommands
				})
			});
		};
		const allowed = resolveCommandAuthorization();
		if (!allowed.ok) return deny("node_command_revoked", {
			ok: false,
			code: "NODE_COMMAND_REVOKED",
			message: `node command not allowed at dispatch: ${allowed.reason}`,
			details: {
				command: params.command,
				reason: allowed.reason
			}
		});
		const remainingTimeoutMs = params.resolveRemainingTimeoutMs?.();
		if (remainingTimeoutMs === 0 && params.timeoutMs !== 0) return deny("node_dispatch_timeout", {
			ok: false,
			code: "TIMEOUT",
			message: "node invoke timed out"
		});
		const requestedTimeoutMs = override.timeoutMs ?? params.timeoutMs;
		const timeoutMs = typeof remainingTimeoutMs === "number" && remainingTimeoutMs > 0 ? typeof requestedTimeoutMs === "number" && requestedTimeoutMs > 0 ? Math.min(requestedTimeoutMs, remainingTimeoutMs) : remainingTimeoutMs : requestedTimeoutMs;
		const deadlineAtMs = params.deadlineAtMs === void 0 ? void 0 : typeof requestedTimeoutMs === "number" && requestedTimeoutMs > 0 ? Math.min(params.deadlineAtMs, performance.now() + requestedTimeoutMs) : params.deadlineAtMs;
		sessionAuthority?.assertCurrent();
		if (params.privateTransport?.isCurrent() === false) return deny("node_private_owner_closed", {
			ok: false,
			code: "PRIVATE_OWNER_CLOSED",
			message: "private node invocation owner closed before dispatch"
		});
		if (!isPluginCurrent()) return deny("node_plugin_replaced", {
			ok: false,
			code: "PLUGIN_POLICY_CHANGED",
			message: "node plugin policy changed before dispatch"
		});
		if (!isCallerRuntimeAuthorityActive()) return deny("node_runtime_authority_closed", {
			ok: false,
			code: "APPROVAL_AUTHORITY_CLOSED",
			message: "agent runtime approval authority closed before node dispatch"
		});
		if (params.isApprovalAuthorityActive?.() === false) return deny("node_approval_authority_closed", {
			ok: false,
			code: "APPROVAL_AUTHORITY_CLOSED",
			message: "approved runtime authority closed before node dispatch"
		});
		recordNodeDecision({
			pluginId: entry.pluginId,
			outcome: "allowed",
			coverageState: "enforced",
			reasonCode: "node_dispatch_gate_allowed",
			summary: "Gateway node pairing, capability, and plugin policy gates allowed transport dispatch."
		});
		nodeGateDecisionRecorded = true;
		const request = {
			nodeId: params.nodeSession.nodeId,
			expectedConnId: params.nodeSession.connId,
			...params.nodeSession.pairingGeneration ? { expectedPairingGeneration: params.nodeSession.pairingGeneration } : {},
			command: params.command,
			params: override.params ?? params.params,
			timeoutMs,
			...sessionAuthority ? { signal: params.signal ? AbortSignal.any([params.signal, sessionAuthority.signal]) : sessionAuthority.signal } : params.signal ? { signal: params.signal } : {},
			...params.sessionKey ? { sessionKey: params.sessionKey } : {},
			idempotencyKey: override.idempotencyKey ?? params.idempotencyKey,
			...params.nodeInvokeStream && {
				onProgress: params.nodeInvokeStream.onProgress,
				idleTimeoutMs: params.nodeInvokeStream.idleTimeoutMs
			},
			isDispatchAuthorized: () => {
				try {
					sessionAuthority?.assertCurrent();
				} catch {
					return false;
				}
				if (!(isPluginCurrent() && params.privateTransport?.isCurrent() !== false && (params.nodeInvokeStream?.isRuntimeCurrent() ?? true) && isCallerRuntimeAuthorityActive() && params.isApprovalAuthorityActive?.() !== false && resolveCommandAuthorization().ok)) return false;
				const grantOutcome = consumeNodeInvokePlacementGrant({
					runtime: params.context.placementStandingGrants,
					authorization: standingGrantAuthorization
				});
				if (grantOutcome === "rejected") return false;
				if (grantOutcome === "consumed") recordNodeDecision({
					pluginId: entry.pluginId,
					outcome: "allowed",
					coverageState: "enforced",
					reasonCode: "node_placement_standing_grant_consumed",
					summary: "A placement-scoped standing grant authorized the node transport dispatch."
				});
				return true;
			},
			onDispatchReady: (invokeId) => {
				nodeCommandDispatched = true;
				params.onNodeCommandDispatched?.();
				params.nodeInvokeStream?.onDispatchReady(invokeId);
			}
		};
		const res = params.privateTransport ? await params.privateTransport.invoke(request) : await invokeNodeWithReadinessRetry(params.context.nodeRegistry, {
			...request,
			deadlineAtMs
		});
		if (!res.ok) {
			if (nodeCommandDispatched) recordNodeDecision({
				pluginId: entry.pluginId,
				outcome: "unknown",
				coverageState: "unknown",
				reasonCode: "node_action_completion_unknown",
				summary: "The node transport accepted the action but did not report a successful outcome.",
				missingEvidence: ["node.action_completion"],
				remediation: [{
					code: "inspect_node_action",
					text: "Inspect the paired node before retrying an action whose completion is unknown."
				}]
			});
			return {
				ok: false,
				code: res.error?.code,
				message: res.error?.message ?? "node command failed",
				details: { nodeError: res.error ?? null }
			};
		}
		recordNodeDecision({
			pluginId: entry.pluginId,
			outcome: "allowed",
			coverageState: "attribution-only",
			reasonCode: "node_action_completed",
			summary: "The paired node reported successful completion; this is attribution, not authorization."
		});
		return {
			ok: true,
			payload: parsePayload(res.payloadJSON, res.payload),
			payloadJSON: res.payloadJSON ?? null
		};
	};
	const scope = getPluginRuntimeGatewayRequestScope();
	const ownedInvocation = params.nodeInvokeStream && params.client?.internal?.pluginRuntimeOwnerId === entry.pluginId ? scope?.invokeWithSessionNodeAuthority : void 0;
	const invokeOwned = (source, override, createParams) => ownedInvocation && override.workspace ? ownedInvocation({
		pluginId: entry.pluginId,
		command: params.command,
		nodeId: params.nodeSession.nodeId,
		workspace: override.workspace,
		source
	}, async (assertCurrent, signal) => {
		if (params.sessionKey !== override.workspace?.sessionKey) throw new Error("Node launch requires its authenticated outer session");
		return await dispatchNode(createParams ? {
			...override,
			params: createParams()
		} : override, {
			assertCurrent,
			signal
		});
	}) : void 0;
	const invokeNode = async (override = {}) => {
		if (!ownedInvocation || !override.workspace) return await dispatchNode(override);
		const result = await invokeOwned("human-approved", override);
		if (!result) throw new Error("Node launch lost its admitted owner");
		return result;
	};
	let result;
	try {
		result = await entry.policy.handle({
			nodeId: params.nodeSession.nodeId,
			command: params.command,
			params: params.params,
			timeoutMs: params.timeoutMs,
			idempotencyKey: params.idempotencyKey,
			config: params.context.getRuntimeConfig(),
			pluginConfig: entry.pluginConfig,
			node: {
				nodeId: params.nodeSession.nodeId,
				displayName: params.nodeSession.displayName,
				platform: params.nodeSession.platform,
				deviceFamily: params.nodeSession.deviceFamily,
				caps: params.nodeSession.caps,
				commands: params.nodeSession.commands
			},
			client: params.client ? {
				connId: params.client.connId,
				scopes: parseScopes(params.client)
			} : null,
			...risk ? { risk } : {},
			approvals: createPluginNodeInvokeApprovalRuntime({
				context: params.context,
				client: params.client,
				callerIdentity,
				pluginId: entry.pluginId,
				command: params.command,
				...approvalScope ? { approvalScope } : {},
				nodeSession: params.nodeSession,
				risk,
				standingGrantAuthorization,
				...scope?.nodePlacementGrantAuthority ? { placementGrantAuthority: scope.nodePlacementGrantAuthority } : {},
				turnSource: trustedTurnSource,
				isCurrent: () => isPluginCurrent() && isCallerRuntimeAuthorityActive() && params.privateTransport?.isCurrent() !== false && params.isApprovalAuthorityActive?.() !== false
			}),
			invokeNode,
			...ownedInvocation ? { invokeNodeWithSessionFull: async ({ workspace, createParams }) => await invokeOwned("session-full", { workspace }, createParams) } : {}
		});
	} catch (error) {
		if (!(error instanceof ApprovalObserverClosedError) && !nodeCommandDispatched && isCallerRuntimeAuthorityActive()) recordNodeDecision({
			pluginId: entry.pluginId,
			outcome: "denied",
			coverageState: "enforced",
			reasonCode: "node_plugin_policy_failed",
			summary: "The registered plugin policy failed closed before node transport dispatch."
		});
		throw error;
	}
	if (!nodeCommandDispatched && !nodeGateDecisionRecorded && isCallerRuntimeAuthorityActive()) recordNodeDecision({
		pluginId: entry.pluginId,
		outcome: result.ok ? "unknown" : "denied",
		coverageState: result.ok ? "unknown" : "enforced",
		reasonCode: result.ok ? "node_action_callback_missing" : "node_plugin_policy_denied",
		summary: result.ok ? "The plugin policy returned without invoking the expected OpenClaw node callback." : "The registered plugin policy denied node transport dispatch.",
		missingEvidence: result.ok ? ["node.action_callback"] : [],
		remediation: result.ok ? [{
			code: "add_node_action_callback",
			text: "Route the native action through the provided OpenClaw node callback."
		}] : []
	});
	return result.ok ? result : {
		...result,
		details: {
			...result.details,
			nodeCommandDispatched
		}
	};
}
//#endregion
export { invokeNodeWithReadinessRetry as n, applyPluginNodeInvokePolicy as t };
