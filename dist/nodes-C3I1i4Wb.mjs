import { r as asNullableRecord } from "./record-coerce-DItp3I4t.mjs";
import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty, s as normalizeNullableString } from "./string-coerce-CIXf7egm.mjs";
import { _ as normalizeUniqueTrimmedStringList } from "./string-normalization-_gRhJUDw.mjs";
import { t as pruneMapToMaxSize } from "./map-size-CNcWiFKu.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { r as PAIRING_SCOPE, t as ADMIN_SCOPE } from "./operator-scopes-D-CL26h0.mjs";
import { i as GATEWAY_CLIENT_NAMES, r as GATEWAY_CLIENT_MODES } from "./client-info-B_ICKCYw.mjs";
import { n as awaitWithinDeadline, t as ABSOLUTE_DEADLINE_EXPIRED } from "./absolute-deadline-BXzjx6E8.mjs";
import { t as ErrorCodes } from "./gateway-error-details-D85F07e9.mjs";
import { An as validateNodeInvokeResultParams, En as validateNodeEventParams, Fn as validateNodePairRemoveParams, In as validateNodePendingAckParams, Mn as validateNodePairApproveParams, Nn as validateNodePairListParams, On as validateNodeInvokeParams, Pn as validateNodePairRejectParams, Vn as validateNodeRenameParams, jn as validateNodeListParams, kn as validateNodeInvokeProgressParams } from "./src-BRUl7oDv.mjs";
import { M as isBrowserProxyNodeInvokeCommand, N as isPrivateNodeInvokeCommand, j as isAdminOnlyNodeInvokeCommand } from "./node-commands-BLhGKTZa.mjs";
import { l as isForbiddenBrowserProxyMutation } from "./method-scopes-C7g7eSZh.mjs";
import { f as errorShape, p as missingScopeErrorShape } from "./error-codes-DvB36bCj.mjs";
import { a as isForegroundRestrictedPluginNodeCommand, l as resolveNodeCommandAllowlist, o as isNodeCommandAllowed, t as DEFAULT_DANGEROUS_NODE_COMMANDS } from "./node-command-policy-CnGfXM76.mjs";
import { a as missingSystemRunApprovalBinding, d as toSystemRunApprovalMismatchError, i as matchSystemRunApprovalBinding, n as buildSystemRunApprovalBinding, v as resolveSystemRunCommandRequest } from "./system-run-approval-binding-BDEolZhR.mjs";
import { r as listApprovedPairedDeviceRoles } from "./device-pairing-identity-BnU9nqx2.mjs";
import { l as removePairedDeviceRole, t as getPairedDevice } from "./device-pairing-DbLfxuuq.mjs";
import { a as listNodePairing, c as recordPairedNodeHostStats, d as renamePairedNode, i as getPendingNodePairing, l as rejectNodePairing, t as approveNodePairing } from "./device-pairing-node-DvH1kI0G.mjs";
import { n as respondUnavailableOnNodeInvokeErrorWithProvenance, r as parseGatewayPayload } from "./nodes.helpers-i6ZoxrHI.mjs";
import { r as resolveSystemRunApprovalRuntimeContext } from "./system-run-approval-context-B3HNRp6k.mjs";
import { y as ApnsRegistrationPairingChangedError } from "./push-apns-store-9CGb-HCs.mjs";
import { t as assertValidParams } from "./validation-CFv_zneu.mjs";
import { n as EXEC_APPROVAL_RESOLVED_ENTRY_GRACE_MS } from "./exec-approval-lifecycle-CTgxWCaJ.mjs";
import "./exec-approval-manager-BcWaY6OR.mjs";
import { n as respondUnavailableOnThrow } from "./response-Chzawb7u.mjs";
import { a as removePendingNodeAction, i as listPendingNodeActions, n as clearRemovedNodeRuntimeState, o as replacePendingNodeActionsForGeneration, r as enqueuePendingNodeAction, s as reconcileRevokedDeviceWorker, t as acknowledgePendingNodeActions } from "./node-runtime-state-DG7DCGJV.mjs";
import { a as invalidateNodeWakeState, n as NODE_WAKE_RECONNECT_WAIT_MS, r as captureNodeWakeLifecycle, s as releaseNodeWakeLifecycle, t as NODE_WAKE_RECONNECT_RETRY_WAIT_MS } from "./node-wake-state-CWVR-GCk.mjs";
import { i as pairedDeviceHasNonOperatorRole, n as deniesCrossDeviceManagement, o as resolveDeviceManagementAuthz, s as resolveDeviceSessionAuthz, t as emitDeviceManagementSecurityEvent } from "./device-management-security-B6TFYBJm.mjs";
import { i as isNodePairingGenerationCurrent, n as captureNodePairingGeneration, r as captureNodePairingState } from "./device-pairing-node-state-BxpHZHxS.mjs";
import { a as resolveDispatchableNodeSession, i as isNodePairingWorkCurrent, n as maybeWakeNodeWithApns, o as respondPairingChanged, r as waitForNodeReconnect, t as maybeSendNodeWakeNudge } from "./nodes.wake-C0rSsIHu.mjs";
import { t as nodeInvokePolicy } from "./nodes-policy-CTo9Dpfh.mjs";
import { n as invokeNodeWithReadinessRetry, t as applyPluginNodeInvokePolicy } from "./node-invoke-plugin-policy-ZU-EgBiE.mjs";
import { n as refreshConnectedNodeSurfaceCaches, t as nodeReadHandlers } from "./nodes.read-C53DY01F.mjs";
import { randomUUID } from "node:crypto";
//#region src/gateway/server-methods/nodes.event.ts
const nodeEventHandlers = { "node.event": async ({ params, respond, context, client }) => {
	if (!assertValidParams(params, validateNodeEventParams, "node.event", respond)) return;
	const p = params;
	const payloadJSON = typeof p.payloadJSON === "string" ? p.payloadJSON : p.payload !== void 0 ? JSON.stringify(p.payload) : null;
	await respondUnavailableOnThrow(respond, async () => {
		const nodeId = client?.connect?.device?.id ?? client?.connect?.client?.id ?? "node";
		const nodeSession = context.nodeRegistry.get(nodeId);
		const eventConnId = client?.connId;
		const eventPairingGeneration = nodeSession?.pairingGeneration;
		const isEventConnectionCurrent = async () => {
			if (!eventConnId || !eventPairingGeneration) return false;
			const before = resolveDispatchableNodeSession(context.nodeRegistry.getForPairingGeneration(nodeId, eventPairingGeneration));
			if (!before || before.connId !== eventConnId) return false;
			if (!await context.nodeRegistry.isConnectionCurrentPairingState(eventConnId)) return false;
			return resolveDispatchableNodeSession(context.nodeRegistry.getForPairingGeneration(nodeId, eventPairingGeneration))?.connId === eventConnId;
		};
		const { handleNodeEvent } = await import("./server-node-events-Bo8PSHgU.mjs");
		const apnsGeneration = p.event === "push.apns.register" ? await captureNodePairingGeneration(nodeId) : null;
		const presenceAllowed = nodeSession !== void 0 && nodeSession.connId === client?.connId && nodeSession.permissions?.accessibility === true;
		const result = await handleNodeEvent({
			deps: context.deps,
			broadcast: context.broadcast,
			nodeSendToSession: context.nodeSendToSession,
			nodeSubscribe: async (subscriptionNodeId, sessionKey, subscriptionConnId) => {
				if (subscriptionNodeId !== nodeId || !subscriptionConnId || subscriptionConnId !== client?.connId || !await isEventConnectionCurrent()) return;
				context.nodeSubscribe(subscriptionNodeId, sessionKey, subscriptionConnId);
			},
			nodeUnsubscribe: async (subscriptionNodeId, sessionKey, subscriptionConnId) => {
				if (subscriptionNodeId !== nodeId || !subscriptionConnId || subscriptionConnId !== client?.connId || !await isEventConnectionCurrent()) return;
				context.nodeUnsubscribe(subscriptionNodeId, sessionKey, subscriptionConnId);
			},
			broadcastVoiceWakeChanged: context.broadcastVoiceWakeChanged,
			addChatRun: context.addChatRun,
			removeChatRun: context.removeChatRun,
			chatAbortControllers: context.chatAbortControllers,
			dedupe: context.dedupe,
			agentRunSeq: context.agentRunSeq,
			getHealthCache: context.getHealthCache,
			refreshHealthSnapshot: context.refreshHealthSnapshot,
			loadGatewayModelCatalog: context.loadGatewayModelCatalog,
			loadGatewayModelCatalogSnapshot: context.loadGatewayModelCatalogSnapshot,
			authorizeNodeSystemRunEvent: (eventParams) => context.nodeRegistry.authorizeSystemRunEvent({
				nodeId: eventParams.nodeId,
				connId: eventParams.connId,
				runId: eventParams.runId,
				sessionKey: eventParams.sessionKey,
				terminal: eventParams.terminal
			}),
			updateNodePresenceActivity: (activity) => {
				const updated = context.nodeRegistry.updatePresenceActivity(activity);
				return updated?.lastActiveAtMs !== void 0 && updated.presenceUpdatedAtMs !== void 0 ? {
					lastActiveAtMs: updated.lastActiveAtMs,
					presenceUpdatedAtMs: updated.presenceUpdatedAtMs
				} : null;
			},
			clearNodePresenceActivity: (activity) => context.nodeRegistry.clearPresenceActivity(activity),
			updateNodeDesktopAvailability: (availability) => context.nodeRegistry.updateDesktopAvailability(availability),
			updateNodeHostStats: (stats) => {
				const hostStats = context.nodeRegistry.updateHostStats(stats);
				if (hostStats && eventPairingGeneration) recordPairedNodeHostStats({
					nodeId,
					hostStats,
					expectedPairingGeneration: {
						nodeId,
						key: eventPairingGeneration
					}
				}).catch((error) => context.logGateway.warn(`failed to persist node host stats for ${nodeId}: ${formatErrorMessage(error)}`));
				return hostStats;
			},
			logGateway: { warn: context.logGateway.warn }
		}, nodeId, {
			event: p.event,
			payloadJSON
		}, {
			connId: client?.connId,
			deviceId: client?.connect?.device?.id,
			pairingGeneration: eventPairingGeneration ? {
				nodeId,
				key: eventPairingGeneration
			} : void 0,
			presenceAllowed,
			isConnectionCurrent: isEventConnectionCurrent,
			assertApnsRegistrationCurrent: () => {
				const current = apnsGeneration ? context.nodeRegistry.getForPairingGeneration(nodeId, apnsGeneration.key) : void 0;
				if (!current || current !== nodeSession || current.connId !== eventConnId || current.client.invalidated === true) throw new ApnsRegistrationPairingChangedError();
			},
			resolveApnsRegistrationGeneration: async () => {
				if (!apnsGeneration || !client?.connId) return null;
				const before = resolveDispatchableNodeSession(context.nodeRegistry.getForPairingGeneration(nodeId, apnsGeneration.key));
				if (!before || before.connId !== client.connId) return null;
				if (!await isNodePairingGenerationCurrent(apnsGeneration)) return null;
				return resolveDispatchableNodeSession(context.nodeRegistry.getForPairingGeneration(nodeId, apnsGeneration.key))?.connId === client.connId ? apnsGeneration.key : null;
			}
		});
		if (result?.reason === "pairing_changed") {
			respondPairingChanged(respond);
			return;
		}
		respond(true, result ?? { ok: true }, void 0);
	});
} };
//#endregion
//#region src/gateway/node-invoke-system-run-approval-errors.ts
/** Builds a failed system.run approval guard result with a structured code. */
function systemRunApprovalGuardError(params) {
	const details = params.details ? { ...params.details } : {};
	return {
		ok: false,
		message: params.message,
		details: {
			code: params.code,
			...details
		}
	};
}
/** Builds the standard response for system.run calls that still need approval. */
function systemRunApprovalRequired(runId) {
	return systemRunApprovalGuardError({
		code: "APPROVAL_REQUIRED",
		message: "approval required",
		details: { runId }
	});
}
//#endregion
//#region src/gateway/node-invoke-system-run-approval-match.ts
function requestMismatch() {
	return {
		ok: false,
		code: "APPROVAL_REQUEST_MISMATCH",
		message: "approval id does not match request"
	};
}
/** Evaluates whether a node system.run request matches the stored approval binding. */
function evaluateSystemRunApprovalMatch(params) {
	if (params.request.host !== "node") return requestMismatch();
	const actualBinding = buildSystemRunApprovalBinding({
		argv: params.argv,
		cwd: params.binding.cwd,
		agentId: params.binding.agentId,
		sessionKey: params.binding.sessionKey,
		env: params.binding.env
	});
	const expectedBinding = params.request.systemRunBinding;
	if (!expectedBinding) return missingSystemRunApprovalBinding({ actualEnvKeys: actualBinding.envKeys });
	return matchSystemRunApprovalBinding({
		expected: expectedBinding,
		actual: actualBinding.binding,
		actualEnvKeys: actualBinding.envKeys
	});
}
//#endregion
//#region src/gateway/node-invoke-system-run-approval.ts
const BACKEND_BRIDGEABLE_NO_DEVICE_REQUEST_CLIENT_IDS = /* @__PURE__ */ new Set([
	GATEWAY_CLIENT_NAMES.CONTROL_UI,
	GATEWAY_CLIENT_NAMES.WEBCHAT_UI,
	GATEWAY_CLIENT_NAMES.WEBCHAT,
	GATEWAY_CLIENT_NAMES.GATEWAY_CLIENT
]);
function normalizeApprovalDecision(value) {
	const s = normalizeNullableString(value);
	return s === "allow-once" || s === "allow-always" ? s : null;
}
function clientHasApprovals(client) {
	const scopes = Array.isArray(client?.connect?.scopes) ? client?.connect?.scopes : [];
	return scopes.includes("operator.admin") || scopes.includes("operator.approvals");
}
function isTrustedBackendApprovalClient(client) {
	return clientHasApprovals(client) && client?.connect?.client?.id === GATEWAY_CLIENT_NAMES.GATEWAY_CLIENT && client.connect.client.mode === GATEWAY_CLIENT_MODES.BACKEND && client.isDeviceTokenAuth !== true;
}
function canBridgeNoDeviceApprovalFromBackend(params) {
	const requestedByClientId = normalizeNullableString(params.snapshot.requestedByClientId);
	const request = params.snapshot.request;
	return params.snapshot.requestedByDeviceId == null && params.snapshot.requestedByDeviceTokenAuth !== true && !hasChatApprovalReplayBinding(request) && requestedByClientId !== null && BACKEND_BRIDGEABLE_NO_DEVICE_REQUEST_CLIENT_IDS.has(requestedByClientId) && isTrustedBackendApprovalClient(params.client);
}
function hasChatApprovalReplayBinding(request) {
	return normalizeComparableString(request.turnSourceChannel, { lowercase: true }) !== null || normalizeComparableString(request.turnSourceTo) !== null || normalizeComparableString(request.turnSourceAccountId) !== null || normalizeComparableString(request.turnSourceThreadId) !== null;
}
function normalizeComparableString(value, opts = {}) {
	const normalized = typeof value === "number" && Number.isFinite(value) ? String(value) : normalizeNullableString(value);
	if (!normalized) return null;
	return opts.lowercase ? normalized.toLowerCase() : normalized;
}
function matchesRequiredString(params) {
	const expected = normalizeComparableString(params.expected, { lowercase: params.lowercase });
	if (!expected) return false;
	return expected === normalizeComparableString(params.actual, { lowercase: params.lowercase });
}
function matchesOptionalString(params) {
	const expected = normalizeComparableString(params.expected, { lowercase: params.lowercase });
	if (!expected) return true;
	return expected === normalizeComparableString(params.actual, { lowercase: params.lowercase });
}
function canBridgeNoDeviceChatApprovalFromBackend(params) {
	if (params.snapshot.requestedByDeviceId != null || params.snapshot.requestedByDeviceTokenAuth === true || !isTrustedBackendApprovalClient(params.client)) return false;
	const request = params.snapshot.request;
	const plan = request.systemRunPlan ?? null;
	return matchesRequiredString({
		expected: request.turnSourceChannel,
		actual: params.rawParams.turnSourceChannel,
		lowercase: true
	}) && matchesOptionalString({
		expected: request.turnSourceTo,
		actual: params.rawParams.turnSourceTo
	}) && matchesRequiredString({
		expected: plan?.sessionKey ?? request.sessionKey,
		actual: params.rawParams.sessionKey
	}) && matchesOptionalString({
		expected: plan?.agentId ?? request.agentId,
		actual: params.rawParams.agentId
	}) && matchesOptionalString({
		expected: request.turnSourceAccountId,
		actual: params.rawParams.turnSourceAccountId
	}) && matchesOptionalString({
		expected: request.turnSourceThreadId,
		actual: params.rawParams.turnSourceThreadId
	});
}
function pickSystemRunParams(raw) {
	const next = {};
	for (const key of [
		"command",
		"rawCommand",
		"systemRunPlan",
		"cwd",
		"env",
		"timeoutMs",
		"needsScreenRecording",
		"agentId",
		"sessionKey",
		"runId",
		"suppressNotifyOnExit"
	]) if (key in raw) next[key] = raw[key];
	return next;
}
function resolveForwardedRawCommand(plan) {
	const preview = normalizeNullableString(plan.commandPreview);
	if (!preview) return plan.commandText;
	const resolved = resolveSystemRunCommandRequest({
		command: plan.argv,
		rawCommand: preview
	});
	return resolved.ok && resolved.previewText === preview ? preview : plan.commandText;
}
/**
* Gate `system.run` approval flags (`approved`, `approvalDecision`) behind a real
* `exec.approval.*` record. This prevents users with only `operator.write` from
* bypassing node-host approvals by injecting control fields into `node.invoke`.
*/
async function sanitizeSystemRunParamsForForwarding(opts) {
	const obj = asNullableRecord(opts.rawParams);
	if (!obj) return {
		ok: true,
		params: opts.rawParams
	};
	const p = obj;
	const approved = p.approved === true;
	const requestedDecision = normalizeApprovalDecision(p.approvalDecision);
	if (p.approvalSource != null && p.approvalSource !== "ask-fallback") return systemRunApprovalGuardError({
		code: "INVALID_APPROVAL_SOURCE",
		message: "approval source invalid"
	});
	const approvalSource = p.approvalSource === "ask-fallback" ? "ask-fallback" : null;
	if (approvalSource !== null && (p.approved !== void 0 || p.approvalDecision !== void 0)) return systemRunApprovalGuardError({
		code: "APPROVAL_SOURCE_MISMATCH",
		message: "approval source cannot be combined with explicit approval"
	});
	const wantsApprovalOverride = approved || requestedDecision !== null || approvalSource !== null;
	const next = pickSystemRunParams(obj);
	if (!wantsApprovalOverride) {
		const cmdTextResolution = resolveSystemRunCommandRequest({
			command: p.command,
			rawCommand: p.rawCommand
		});
		if (!cmdTextResolution.ok) return {
			ok: false,
			message: cmdTextResolution.message,
			details: cmdTextResolution.details
		};
		return {
			ok: true,
			params: next
		};
	}
	const runId = normalizeNullableString(p.runId);
	if (!runId) return systemRunApprovalGuardError({
		code: "MISSING_RUN_ID",
		message: "approval override requires params.runId"
	});
	const manager = opts.execApprovalManager;
	if (!manager) return systemRunApprovalGuardError({
		code: "APPROVALS_UNAVAILABLE",
		message: "exec approvals unavailable"
	});
	const snapshot = await manager.getSnapshot(runId);
	if (!snapshot) return systemRunApprovalGuardError({
		code: "UNKNOWN_APPROVAL_ID",
		message: "unknown or expired approval id",
		details: { runId }
	});
	const recordedResolutionSource = snapshot.resolutionSource ?? "operator";
	if (recordedResolutionSource !== "operator" && recordedResolutionSource !== "auto-review") return systemRunApprovalGuardError({
		code: "INVALID_APPROVAL_SOURCE",
		message: "approval record source invalid",
		details: { runId }
	});
	if (recordedResolutionSource === "auto-review" && snapshot.decision !== "allow-once") {
		if (snapshot.consumedDecision === "allow-once") return systemRunApprovalRequired(runId);
		return systemRunApprovalGuardError({
			code: "APPROVAL_SOURCE_MISMATCH",
			message: "auto-review source does not match approval decision",
			details: { runId }
		});
	}
	const timedOut = snapshot.resolvedAtMs !== void 0 && snapshot.decision === void 0 && snapshot.consumedDecision === void 0 && snapshot.askFallbackConsumed !== true;
	const nowMs = typeof opts.nowMs === "number" ? opts.nowMs : Date.now();
	const timeoutReplayExpiresAtMs = snapshot.resolvedAtMs === void 0 ? snapshot.expiresAtMs : snapshot.resolvedAtMs + EXEC_APPROVAL_RESOLVED_ENTRY_GRACE_MS;
	if (timedOut ? nowMs > timeoutReplayExpiresAtMs : nowMs > snapshot.expiresAtMs) return systemRunApprovalGuardError({
		code: "APPROVAL_EXPIRED",
		message: "approval expired",
		details: { runId }
	});
	const targetNodeId = normalizeNullableString(opts.nodeId);
	if (!targetNodeId) return systemRunApprovalGuardError({
		code: "MISSING_NODE_ID",
		message: "node.invoke requires nodeId",
		details: { runId }
	});
	const approvalNodeId = normalizeNullableString(snapshot.request.nodeId);
	if (!approvalNodeId) return systemRunApprovalGuardError({
		code: "APPROVAL_NODE_BINDING_MISSING",
		message: "approval id missing node binding",
		details: { runId }
	});
	if (approvalNodeId !== targetNodeId) return systemRunApprovalGuardError({
		code: "APPROVAL_NODE_MISMATCH",
		message: "approval id not valid for this node",
		details: { runId }
	});
	const snapshotDeviceId = snapshot.requestedByDeviceId ?? null;
	const clientDeviceId = opts.client?.connect?.device?.id ?? null;
	if (snapshotDeviceId) {
		if (snapshotDeviceId !== clientDeviceId) return systemRunApprovalGuardError({
			code: "APPROVAL_DEVICE_MISMATCH",
			message: "approval id not valid for this device",
			details: { runId }
		});
	} else if (snapshot.requestedByConnId && snapshot.requestedByConnId !== (opts.client?.connId ?? null) && !canBridgeNoDeviceApprovalFromBackend({
		snapshot,
		client: opts.client
	}) && !canBridgeNoDeviceChatApprovalFromBackend({
		snapshot,
		rawParams: p,
		client: opts.client
	})) return systemRunApprovalGuardError({
		code: "APPROVAL_CLIENT_MISMATCH",
		message: "approval id not valid for this client",
		details: { runId }
	});
	const runtimeContext = resolveSystemRunApprovalRuntimeContext({
		plan: snapshot.request.systemRunPlan ?? null,
		command: p.command,
		rawCommand: p.rawCommand,
		cwd: p.cwd,
		agentId: p.agentId,
		sessionKey: p.sessionKey
	});
	if (!runtimeContext.ok) return {
		ok: false,
		message: runtimeContext.message,
		details: runtimeContext.details
	};
	if (runtimeContext.plan) {
		next.command = [...runtimeContext.plan.argv];
		next.systemRunPlan = runtimeContext.plan;
		next.rawCommand = resolveForwardedRawCommand(runtimeContext.plan);
		if (runtimeContext.cwd) next.cwd = runtimeContext.cwd;
		else delete next.cwd;
		if (runtimeContext.agentId) next.agentId = runtimeContext.agentId;
		else delete next.agentId;
		if (runtimeContext.sessionKey) next.sessionKey = runtimeContext.sessionKey;
		else delete next.sessionKey;
	}
	const approvalMatch = evaluateSystemRunApprovalMatch({
		argv: runtimeContext.argv,
		request: snapshot.request,
		binding: {
			cwd: runtimeContext.cwd,
			agentId: runtimeContext.agentId,
			sessionKey: runtimeContext.sessionKey,
			env: p.env
		}
	});
	if (!approvalMatch.ok) return toSystemRunApprovalMismatchError({
		runId,
		match: approvalMatch
	});
	const decision = manager.projectDecisionIfActive ? manager.projectDecisionIfActive(runId, snapshot.decision ?? null) : snapshot.decision ?? null;
	if ((snapshot.decision === "allow-once" || snapshot.decision === "allow-always") && decision !== snapshot.decision) return systemRunApprovalRequired(runId);
	if (snapshot.decision === "allow-once") {
		if (approvalSource !== null) return systemRunApprovalGuardError({
			code: "APPROVAL_SOURCE_MISMATCH",
			message: "approval source does not match approval record",
			details: { runId }
		});
		if (recordedResolutionSource === "auto-review") {
			if (!runtimeContext.plan) return systemRunApprovalGuardError({
				code: "APPROVAL_PLAN_REQUIRED",
				message: "auto-review approval requires an approved execution plan",
				details: { runId }
			});
		}
		if (typeof manager.consumeAllowOnce !== "function" || !await manager.consumeAllowOnce(runId)) return systemRunApprovalRequired(runId);
		if (recordedResolutionSource === "auto-review") {
			next.approvalSource = "auto-review";
			return {
				ok: true,
				params: next,
				approvalAuthority: {
					recordId: runId,
					decision: "allow-once"
				}
			};
		}
		next.approved = true;
		next.approvalDecision = "allow-once";
		return {
			ok: true,
			params: next,
			approvalAuthority: {
				recordId: runId,
				decision: "allow-once"
			}
		};
	}
	if (snapshot.decision === "allow-always") {
		if (approvalSource !== null) return systemRunApprovalGuardError({
			code: "APPROVAL_SOURCE_MISMATCH",
			message: "approval source does not match approval record",
			details: { runId }
		});
		next.approved = true;
		next.approvalDecision = "allow-always";
		return {
			ok: true,
			params: next,
			approvalAuthority: {
				recordId: runId,
				decision: "allow-always"
			}
		};
	}
	if (timedOut && approvalSource === "ask-fallback" && !approved && requestedDecision === null && clientHasApprovals(opts.client)) {
		if (!runtimeContext.plan) return systemRunApprovalGuardError({
			code: "APPROVAL_PLAN_REQUIRED",
			message: "ask fallback requires an approved execution plan",
			details: { runId }
		});
		if (typeof manager.consumeAskFallback !== "function" || !manager.consumeAskFallback(runId)) return systemRunApprovalRequired(runId);
		next.approvalSource = "ask-fallback";
		return {
			ok: true,
			params: next,
			approvalAuthority: {
				recordId: runId,
				decision: "allow-once"
			}
		};
	}
	return systemRunApprovalRequired(runId);
}
//#endregion
//#region src/gateway/node-invoke-sanitize.ts
/** Sanitizes node.invoke params before forwarding them to a connected node. */
async function sanitizeNodeInvokeParamsForForwarding(opts) {
	if (opts.command === "system.run") return sanitizeSystemRunParamsForForwarding({
		nodeId: opts.nodeId,
		rawParams: opts.rawParams,
		client: opts.client,
		execApprovalManager: opts.execApprovalManager
	});
	return {
		ok: true,
		params: opts.rawParams
	};
}
//#endregion
//#region src/gateway/server-methods/node-command-rejection-hint.ts
function buildNodeCommandRejectionHint(reason, command, node, cfg) {
	const platform = node?.platform ?? "unknown";
	if (reason === "command not declared by node") return `node command not allowed: the node (platform: ${platform}) does not support "${command}"`;
	if (reason === "command not allowlisted") {
		if (command.startsWith("talk.")) return `node command not allowed: "${command}" requires a trusted Talk-capable node`;
		if ((cfg.gateway?.nodes?.commands?.deny ?? []).some((entry) => entry.trim() === command)) return `node command not allowed: "${command}" is blocked by gateway.nodes.commands.deny`;
		if (DEFAULT_DANGEROUS_NODE_COMMANDS.includes(command)) return `node command not allowed: "${command}" requires explicit gateway.nodes.commands.allow opt-in`;
		return `node command not allowed: "${command}" is not in the allowlist for platform "${platform}"`;
	}
	if (reason === "node did not declare commands") {
		if (node?.declaredCommands?.includes(command)) return "node command not allowed: the node's declared command surface is pending approval; run `openclaw nodes pending`, then `openclaw nodes approve <requestId>`";
		return `node command not allowed: the node did not declare any supported commands`;
	}
	return `node command not allowed: ${reason}`;
}
//#endregion
//#region src/gateway/server-methods/nodes.handlers.invoke-progress.ts
const MAX_PROGRESS_CHUNK_BYTES = 16384;
/** Accept one bounded stdout chunk for an active node invocation. */
const handleNodeInvokeProgress = async ({ params, respond, context, client }) => {
	if (!assertValidParams(params, validateNodeInvokeProgressParams, "node.invoke.progress", respond)) return;
	const progress = params;
	const callerNodeId = client?.connect?.device?.id ?? client?.connect?.client?.id;
	if (callerNodeId && callerNodeId !== progress.nodeId) {
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "nodeId mismatch"));
		return;
	}
	if (Buffer.byteLength(progress.chunk, "utf8") > MAX_PROGRESS_CHUNK_BYTES) {
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "progress chunk too large"));
		return;
	}
	respond(true, {
		ok: true,
		ignored: !context.nodeRegistry.handleInvokeProgress({
			...progress,
			connId: client?.connId
		})
	}, void 0);
};
//#endregion
//#region src/gateway/server-methods/nodes.handlers.invoke-result.ts
function normalizeNodeInvokeResultParams(params) {
	if (!params || typeof params !== "object") return params;
	const normalized = { ...params };
	if (normalized.payloadJSON === null) delete normalized.payloadJSON;
	else if (normalized.payloadJSON !== void 0 && typeof normalized.payloadJSON !== "string") {
		if (normalized.payload === void 0) normalized.payload = normalized.payloadJSON;
		delete normalized.payloadJSON;
	}
	if (normalized.error === null) delete normalized.error;
	return normalized;
}
/** Handle a node's response to an earlier gateway `node.invoke` request. */
const handleNodeInvokeResult = async ({ params, respond, context, client }) => {
	const normalizedParams = normalizeNodeInvokeResultParams(params);
	if (!assertValidParams(normalizedParams, validateNodeInvokeResultParams, "node.invoke.result", respond)) return;
	const p = normalizedParams;
	const callerNodeId = client?.connect?.device?.id ?? client?.connect?.client?.id;
	if (callerNodeId && callerNodeId !== p.nodeId) {
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "nodeId mismatch"));
		return;
	}
	if (!context.nodeRegistry.handleInvokeResult({
		id: p.id,
		nodeId: p.nodeId,
		connId: client?.connId,
		ok: p.ok,
		payload: p.payload,
		payloadJSON: p.payloadJSON ?? null,
		error: p.error ?? null
	})) {
		context.logGateway.debug(`late invoke result ignored: id=${p.id} node=${p.nodeId}`);
		respond(true, {
			ok: true,
			ignored: true
		}, void 0);
		return;
	}
	respond(true, { ok: true }, void 0);
};
//#endregion
//#region src/gateway/server-methods/nodes.invoke-authority.ts
function isForwardedNodeInvokeApprovalAuthorityActive(params) {
	const authority = params.authority;
	return !authority || params.manager?.projectDecisionIfActive(authority.recordId, authority.decision) === authority.decision;
}
function resolveNodeInvokeRuntimeAuthorityError(params) {
	const callerIdentity = params.client?.internal?.agentRuntimeIdentity;
	if (callerIdentity && params.context.validateAgentRuntimeApprovalAuthority?.(callerIdentity) !== true) return "agent runtime approval authority closed before node dispatch";
	if (!isForwardedNodeInvokeApprovalAuthorityActive({
		manager: params.context.execApprovalManager,
		authority: params.approvalAuthority
	})) return "approved runtime authority closed before node dispatch";
}
//#endregion
//#region src/gateway/server-methods/nodes.invoke-foreground.ts
/** Queues only commands that iOS explicitly rejected as requiring the foreground. */
function shouldQueueAsPendingForegroundAction(params) {
	const platform = normalizeLowercaseStringOrEmpty(params.platform);
	if (!platform.startsWith("ios") && !platform.startsWith("ipados")) return false;
	if (!isForegroundRestrictedPluginNodeCommand(params.command) && !params.command.startsWith("camera.") && !params.command.startsWith("screen.") && !params.command.startsWith("talk.")) return false;
	const error = params.error && typeof params.error === "object" ? params.error : null;
	const code = normalizeOptionalString(error?.code)?.toUpperCase() ?? "";
	const message = normalizeOptionalString(error?.message)?.toUpperCase() ?? "";
	return code === "NODE_BACKGROUND_UNAVAILABLE" || message.includes("BACKGROUND_UNAVAILABLE");
}
//#endregion
//#region src/gateway/server-methods/nodes.invoke-talk-events.ts
const TALK_PTT_COMMANDS = /* @__PURE__ */ new Set([
	"talk.ptt.start",
	"talk.ptt.stop",
	"talk.ptt.cancel",
	"talk.ptt.once"
]);
const talkPttEventSeqBySessionId = /* @__PURE__ */ new Map();
function emitTalkPttNodeEvent(params) {
	if (!TALK_PTT_COMMANDS.has(params.command)) return;
	const payloadObj = typeof params.payload === "object" && params.payload !== null ? params.payload : {};
	const captureId = normalizeOptionalString(payloadObj.captureId) ?? randomUUID();
	const sessionId = `node:${params.nodeId}:talk:${captureId}`;
	const seq = (talkPttEventSeqBySessionId.get(sessionId) ?? 0) + 1;
	talkPttEventSeqBySessionId.set(sessionId, seq);
	pruneMapToMaxSize(talkPttEventSeqBySessionId, 2048);
	const type = params.command === "talk.ptt.start" ? "capture.started" : params.command === "talk.ptt.cancel" ? "capture.cancelled" : params.command === "talk.ptt.once" ? "capture.once" : "capture.stopped";
	const final = params.command !== "talk.ptt.start";
	const talkEvent = {
		id: `${sessionId}:${seq}`,
		type,
		sessionId,
		captureId,
		seq,
		timestamp: (/* @__PURE__ */ new Date()).toISOString(),
		mode: "stt-tts",
		transport: "managed-room",
		brain: "agent-consult",
		final,
		payload: {
			nodeId: params.nodeId,
			command: params.command,
			status: normalizeOptionalString(payloadObj.status) ?? void 0,
			transcript: normalizeOptionalString(payloadObj.transcript) ?? void 0
		}
	};
	params.context.broadcast("talk.event", {
		nodeId: params.nodeId,
		command: params.command,
		talkEvent
	}, { dropIfSlow: true });
}
//#endregion
//#region src/gateway/server-methods/nodes.pending.ts
function resolveAllowedPendingNodeActions(params) {
	const pending = listPendingNodeActions({
		nodeId: params.nodeId,
		pairingGeneration: params.pairingGeneration,
		ttlMs: nodeInvokePolicy.pendingActionTtlMs
	});
	if (pending.length === 0) return pending;
	const connect = params.client?.connect;
	const declaredCommands = Array.isArray(connect?.commands) ? connect.commands : [];
	const allowlist = resolveNodeCommandAllowlist(params.cfg, {
		platform: connect?.client?.platform,
		deviceFamily: connect?.client?.deviceFamily,
		caps: connect?.caps,
		commands: declaredCommands
	});
	const allowed = pending.filter((entry) => {
		return isNodeCommandAllowed({
			command: entry.command,
			declaredCommands,
			allowlist
		}).ok;
	});
	if (allowed.length !== pending.length) replacePendingNodeActionsForGeneration({
		nodeId: params.nodeId,
		pairingGeneration: params.pairingGeneration,
		replacement: allowed,
		ttlMs: nodeInvokePolicy.pendingActionTtlMs
	});
	return allowed;
}
function toPendingParamsJSON(params) {
	try {
		return JSON.stringify(params);
	} catch {
		return;
	}
}
const nodePendingActionHandlers = {
	"node.pending.pull": async ({ params, respond, client, context }) => {
		if (!assertValidParams(params, validateNodeListParams, "node.pending.pull", respond)) return;
		const nodeId = client?.connect?.device?.id ?? client?.connect?.client?.id;
		const trimmedNodeId = normalizeOptionalString(nodeId) ?? "";
		if (!trimmedNodeId) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "nodeId required"));
			return;
		}
		await respondUnavailableOnThrow(respond, async () => {
			const generation = await captureNodePairingGeneration(trimmedNodeId);
			if (!generation) {
				respondPairingChanged(respond);
				return;
			}
			const session = context.nodeRegistry.getForPairingGeneration(trimmedNodeId, generation.key);
			if (!session || session.connId !== client?.connId) {
				respondPairingChanged(respond);
				return;
			}
			const pending = resolveAllowedPendingNodeActions({
				nodeId: trimmedNodeId,
				pairingGeneration: generation.key,
				client,
				cfg: context.getRuntimeConfig()
			});
			if (!await isNodePairingGenerationCurrent(generation)) {
				respondPairingChanged(respond);
				return;
			}
			respond(true, {
				nodeId: trimmedNodeId,
				actions: pending.map((entry) => ({
					id: entry.id,
					command: entry.command,
					paramsJSON: entry.paramsJSON ?? null,
					enqueuedAtMs: entry.enqueuedAtMs
				}))
			}, void 0);
		});
	},
	"node.pending.ack": async ({ params, respond, client, context }) => {
		if (!assertValidParams(params, validateNodePendingAckParams, "node.pending.ack", respond)) return;
		const nodeId = client?.connect?.device?.id ?? client?.connect?.client?.id;
		const trimmedNodeId = normalizeOptionalString(nodeId) ?? "";
		if (!trimmedNodeId) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "nodeId required"));
			return;
		}
		await respondUnavailableOnThrow(respond, async () => {
			const generation = await captureNodePairingGeneration(trimmedNodeId);
			if (!generation) {
				respondPairingChanged(respond);
				return;
			}
			const session = context.nodeRegistry.getForPairingGeneration(trimmedNodeId, generation.key);
			if (!session || session.connId !== client?.connId) {
				respondPairingChanged(respond);
				return;
			}
			const ackIds = normalizeUniqueTrimmedStringList(params.ids);
			const remaining = acknowledgePendingNodeActions({
				nodeId: trimmedNodeId,
				pairingGeneration: generation.key,
				ids: ackIds,
				ttlMs: nodeInvokePolicy.pendingActionTtlMs
			});
			if (!await isNodePairingGenerationCurrent(generation)) {
				respondPairingChanged(respond);
				return;
			}
			respond(true, {
				nodeId: trimmedNodeId,
				ackedIds: ackIds,
				remainingCount: remaining.length
			}, void 0);
		});
	}
};
//#endregion
//#region src/gateway/server-methods/nodes.invoke.ts
const nodeInvokeHandlers = {
	"node.invoke": async ({ params, respond, context, client, req, signal }) => {
		if (!assertValidParams(params, validateNodeInvokeParams, "node.invoke", respond)) return;
		const p = params;
		const nodeId = normalizeOptionalString(p.nodeId) ?? "";
		const command = normalizeOptionalString(p.command) ?? "";
		const sessionKey = normalizeOptionalString(p.sessionKey);
		const nodeInvokeStream = client?.internal?.syntheticClient === true && client.internal.pluginRuntimeOwnerId ? client.internal.nodeInvokeStream : void 0;
		if (!nodeId || !command) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "nodeId and command required"));
			return;
		}
		if (isPrivateNodeInvokeCommand(command)) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "node.invoke does not allow private node controls", { details: { command } }));
			return;
		}
		if (command === "system.execApprovals.get" || command === "system.execApprovals.set") {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "node.invoke does not allow system.execApprovals.*; use exec.approvals.node.*", { details: { command } }));
			return;
		}
		if (nodeInvokePolicy.rejectClaudeAgentRun(command, respond)) return;
		if (isBrowserProxyNodeInvokeCommand(command) && isForbiddenBrowserProxyMutation(p.params)) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `node.invoke cannot mutate persistent browser profiles via ${command}`, { details: { command } }));
			return;
		}
		if (isAdminOnlyNodeInvokeCommand(command) && !nodeInvokePolicy.clientHasOperatorAdminScope(client)) {
			respond(false, void 0, missingScopeErrorShape({
				missingScope: ADMIN_SCOPE,
				requiredScopes: [ADMIN_SCOPE]
			}));
			return;
		}
		const invokeDeadlineAtMs = typeof p.timeoutMs === "number" && p.timeoutMs > 0 ? performance.now() + p.timeoutMs : void 0;
		let nodeCommandDispatched = false;
		const resolveRemainingInvokeTimeoutMs = () => invokeDeadlineAtMs === void 0 ? p.timeoutMs : Math.max(0, invokeDeadlineAtMs - performance.now());
		const respondIfInvokeExpired = () => {
			if (invokeDeadlineAtMs === void 0 || resolveRemainingInvokeTimeoutMs() !== 0) return false;
			respondUnavailableOnNodeInvokeErrorWithProvenance(respond, {
				ok: false,
				error: {
					code: "TIMEOUT",
					message: "node invoke timed out"
				}
			}, { nodeCommandDispatched });
			return true;
		};
		await respondUnavailableOnThrow(respond, async () => {
			const generation = await awaitWithinDeadline(() => captureNodePairingGeneration(nodeId), invokeDeadlineAtMs, () => performance.now());
			if (generation === ABSOLUTE_DEADLINE_EXPIRED) {
				respondIfInvokeExpired();
				return;
			}
			if (!generation) {
				respondPairingChanged(respond);
				return;
			}
			const wakeLifecycle = captureNodeWakeLifecycle(nodeId, generation.key);
			const invocationLifecycle = signal ? AbortSignal.any([wakeLifecycle, signal]) : wakeLifecycle;
			let releaseApprovalHandoff;
			try {
				const continuePairingWork = async () => {
					const pairingCurrent = await awaitWithinDeadline(() => isNodePairingWorkCurrent({
						nodeId,
						generation,
						lifecycle: wakeLifecycle
					}), invokeDeadlineAtMs, () => performance.now());
					if (pairingCurrent === ABSOLUTE_DEADLINE_EXPIRED) {
						respondIfInvokeExpired();
						return false;
					}
					if (pairingCurrent) return true;
					respondPairingChanged(respond);
					return false;
				};
				if (respondIfInvokeExpired()) return;
				const cfg = context.getRuntimeConfig();
				let nodeSession = resolveDispatchableNodeSession(context.nodeRegistry.getForPairingGeneration(nodeId, generation.key));
				if (!nodeSession) {
					const wakeReqId = req.id;
					const wakeFlowStartedAtMs = Date.now();
					context.logGateway.info(`node wake start node=${nodeId} req=${wakeReqId} command=${command}`);
					const wake = await awaitWithinDeadline(() => maybeWakeNodeWithApns(nodeId, {
						cfg,
						lifecycle: wakeLifecycle,
						generation
					}), invokeDeadlineAtMs, () => performance.now());
					if (wake === ABSOLUTE_DEADLINE_EXPIRED) {
						respondIfInvokeExpired();
						return;
					}
					context.logGateway.info(`node wake stage=wake1 node=${nodeId} req=${wakeReqId} available=${wake.available} throttled=${wake.throttled} path=${wake.path} durationMs=${wake.durationMs} apnsStatus=${wake.apnsStatus ?? -1} apnsReason=${wake.apnsReason ?? "-"}`);
					if (respondIfInvokeExpired()) return;
					if (wake.available) {
						const waitStartedAtMs = Date.now();
						const remainingTimeoutMs = resolveRemainingInvokeTimeoutMs();
						const waitTimeoutMs = invokeDeadlineAtMs === void 0 ? NODE_WAKE_RECONNECT_WAIT_MS : Math.min(NODE_WAKE_RECONNECT_WAIT_MS, remainingTimeoutMs ?? 0);
						const reconnected = await waitForNodeReconnect({
							nodeId,
							context,
							timeoutMs: waitTimeoutMs,
							lifecycle: wakeLifecycle,
							pairingGeneration: generation.key
						});
						const waitDurationMs = Math.max(0, Date.now() - waitStartedAtMs);
						context.logGateway.info(`node wake stage=wait1 node=${nodeId} req=${wakeReqId} reconnected=${reconnected} timeoutMs=${waitTimeoutMs} durationMs=${waitDurationMs}`);
					}
					if (!await continuePairingWork() || respondIfInvokeExpired()) return;
					nodeSession = resolveDispatchableNodeSession(context.nodeRegistry.getForPairingGeneration(nodeId, generation.key));
					if (!nodeSession && wake.available) {
						const retryWake = await awaitWithinDeadline(() => maybeWakeNodeWithApns(nodeId, {
							force: true,
							cfg,
							lifecycle: wakeLifecycle,
							generation
						}), invokeDeadlineAtMs, () => performance.now());
						if (retryWake === ABSOLUTE_DEADLINE_EXPIRED) {
							respondIfInvokeExpired();
							return;
						}
						context.logGateway.info(`node wake stage=wake2 node=${nodeId} req=${wakeReqId} force=true available=${retryWake.available} throttled=${retryWake.throttled} path=${retryWake.path} durationMs=${retryWake.durationMs} apnsStatus=${retryWake.apnsStatus ?? -1} apnsReason=${retryWake.apnsReason ?? "-"}`);
						if (respondIfInvokeExpired()) return;
						if (retryWake.available) {
							const waitStartedAtMs = Date.now();
							const remainingTimeoutMs = resolveRemainingInvokeTimeoutMs();
							const waitTimeoutMs = invokeDeadlineAtMs === void 0 ? NODE_WAKE_RECONNECT_RETRY_WAIT_MS : Math.min(NODE_WAKE_RECONNECT_RETRY_WAIT_MS, remainingTimeoutMs ?? 0);
							const reconnected = await waitForNodeReconnect({
								nodeId,
								context,
								timeoutMs: waitTimeoutMs,
								lifecycle: wakeLifecycle,
								pairingGeneration: generation.key
							});
							const waitDurationMs = Math.max(0, Date.now() - waitStartedAtMs);
							context.logGateway.info(`node wake stage=wait2 node=${nodeId} req=${wakeReqId} reconnected=${reconnected} timeoutMs=${waitTimeoutMs} durationMs=${waitDurationMs}`);
						}
						if (!await continuePairingWork() || respondIfInvokeExpired()) return;
						nodeSession = resolveDispatchableNodeSession(context.nodeRegistry.getForPairingGeneration(nodeId, generation.key));
					}
					if (!nodeSession) {
						if (respondIfInvokeExpired()) return;
						const totalDurationMs = Math.max(0, Date.now() - wakeFlowStartedAtMs);
						const nudge = await awaitWithinDeadline(() => maybeSendNodeWakeNudge(nodeId, {
							cfg,
							lifecycle: wakeLifecycle,
							generation
						}), invokeDeadlineAtMs, () => performance.now());
						if (nudge === ABSOLUTE_DEADLINE_EXPIRED) {
							respondIfInvokeExpired();
							return;
						}
						if (!await continuePairingWork()) return;
						context.logGateway.info(`node wake nudge node=${nodeId} req=${wakeReqId} sent=${nudge.sent} throttled=${nudge.throttled} reason=${nudge.reason} durationMs=${nudge.durationMs} apnsStatus=${nudge.apnsStatus ?? -1} apnsReason=${nudge.apnsReason ?? "-"}`);
						context.logGateway.warn(`node wake done node=${nodeId} req=${wakeReqId} connected=false reason=not_connected totalMs=${totalDurationMs}`);
						respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, "node not connected", { details: {
							code: "NOT_CONNECTED",
							nodeError: {
								code: "NOT_CONNECTED",
								message: "node not connected"
							},
							nodeCommandDispatched: false
						} }));
						return;
					}
					const totalDurationMs = Math.max(0, Date.now() - wakeFlowStartedAtMs);
					context.logGateway.info(`node wake done node=${nodeId} req=${wakeReqId} connected=true totalMs=${totalDurationMs}`);
				}
				for (const authorizationCfg of [cfg, context.getRuntimeConfig()]) {
					const allowlist = resolveNodeCommandAllowlist(authorizationCfg, {
						...nodeSession,
						approvedCommands: nodeSession.commands
					});
					const allowed = isNodeCommandAllowed({
						command,
						declaredCommands: nodeSession.commands,
						allowlist
					});
					if (!allowed.ok) {
						const hint = buildNodeCommandRejectionHint(allowed.reason, command, nodeSession, authorizationCfg);
						respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, hint, { details: {
							reason: allowed.reason,
							command
						} }));
						return;
					}
				}
				const forwardedParams = await sanitizeNodeInvokeParamsForForwarding({
					nodeId,
					command,
					rawParams: p.params,
					client,
					execApprovalManager: context.execApprovalManager
				});
				if (!forwardedParams.ok) {
					respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, forwardedParams.message, { details: forwardedParams.details ?? null }));
					return;
				}
				if (respondIfInvokeExpired()) return;
				if (forwardedParams.approvalAuthority) {
					const authority = forwardedParams.approvalAuthority;
					releaseApprovalHandoff = context.execApprovalManager?.retainForHandoff(authority.recordId) ?? void 0;
					if (!releaseApprovalHandoff) {
						respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "approved runtime authority closed before node dispatch", { details: { code: "APPROVAL_AUTHORITY_CLOSED" } }));
						return;
					}
				}
				const isForwardedApprovalAuthorityActive = () => isForwardedNodeInvokeApprovalAuthorityActive({
					manager: context.execApprovalManager,
					authority: forwardedParams.approvalAuthority
				});
				const policyResult = await awaitWithinDeadline(() => applyPluginNodeInvokePolicy({
					context,
					client,
					nodeSession,
					command,
					params: forwardedParams.params,
					...sessionKey ? { sessionKey } : {},
					turnSource: {
						channel: p.turnSourceChannel,
						to: p.turnSourceTo,
						accountId: p.turnSourceAccountId,
						threadId: p.turnSourceThreadId
					},
					timeoutMs: p.timeoutMs,
					deadlineAtMs: invokeDeadlineAtMs,
					signal: invocationLifecycle,
					resolveRemainingTimeoutMs: resolveRemainingInvokeTimeoutMs,
					onNodeCommandDispatched: () => {
						nodeCommandDispatched = true;
					},
					idempotencyKey: p.idempotencyKey,
					isInvocationCurrent: () => isNodePairingWorkCurrent({
						nodeId,
						generation,
						lifecycle: wakeLifecycle
					}),
					isApprovalAuthorityActive: isForwardedApprovalAuthorityActive,
					...nodeInvokeStream ? { nodeInvokeStream } : {}
				}), invokeDeadlineAtMs, () => performance.now());
				if (policyResult === ABSOLUTE_DEADLINE_EXPIRED) {
					respondIfInvokeExpired();
					return;
				}
				if (!await continuePairingWork()) return;
				if (policyResult) {
					if (!policyResult.ok) {
						const errorCode = policyResult.unavailable ? ErrorCodes.UNAVAILABLE : ErrorCodes.INVALID_REQUEST;
						respond(false, void 0, errorShape(errorCode, policyResult.message, { details: {
							...policyResult.details,
							...policyResult.code ? { code: policyResult.code } : {}
						} }));
						return;
					}
					const payload = policyResult.payloadJSON ? parseGatewayPayload(policyResult.payloadJSON) : policyResult.payload;
					emitTalkPttNodeEvent({
						context,
						nodeId,
						command,
						payload
					});
					respond(true, {
						ok: true,
						nodeId,
						command,
						payload: policyResult.payload,
						payloadJSON: policyResult.payloadJSON ?? null
					}, void 0);
					return;
				}
				const dispatchSession = resolveDispatchableNodeSession(context.nodeRegistry.getForPairingGeneration(nodeId, generation.key));
				if (!dispatchSession || dispatchSession.connId !== nodeSession.connId) {
					respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, "node connection changed before dispatch", {
						retryable: true,
						details: { code: "ROUTE_CHANGED" }
					}));
					return;
				}
				const resolveDispatchAuthorization = (dispatchCfg) => isNodeCommandAllowed({
					command,
					declaredCommands: dispatchSession.commands,
					allowlist: resolveNodeCommandAllowlist(dispatchCfg, {
						...dispatchSession,
						approvedCommands: dispatchSession.commands
					})
				});
				const dispatchCfg = context.getRuntimeConfig();
				const dispatchAllowed = resolveDispatchAuthorization(dispatchCfg);
				if (!dispatchAllowed.ok) {
					respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, buildNodeCommandRejectionHint(dispatchAllowed.reason, command, dispatchSession, dispatchCfg), { details: {
						reason: dispatchAllowed.reason,
						command
					} }));
					return;
				}
				const dispatchTimeoutMs = resolveRemainingInvokeTimeoutMs();
				if (invokeDeadlineAtMs !== void 0 && dispatchTimeoutMs === 0) {
					respondIfInvokeExpired();
					return;
				}
				const authorityError = resolveNodeInvokeRuntimeAuthorityError({
					context,
					client,
					approvalAuthority: forwardedParams.approvalAuthority
				});
				if (authorityError) {
					respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, authorityError, { details: { code: "APPROVAL_AUTHORITY_CLOSED" } }));
					return;
				}
				const res = await invokeNodeWithReadinessRetry(context.nodeRegistry, {
					nodeId,
					expectedConnId: nodeSession.connId,
					expectedPairingGeneration: generation.key,
					command,
					params: forwardedParams.params,
					timeoutMs: dispatchTimeoutMs,
					deadlineAtMs: invokeDeadlineAtMs,
					signal: invocationLifecycle,
					idempotencyKey: p.idempotencyKey,
					...sessionKey ? { sessionKey } : {},
					...nodeInvokeStream && {
						onProgress: nodeInvokeStream.onProgress,
						idleTimeoutMs: nodeInvokeStream.idleTimeoutMs
					},
					isDispatchAuthorized: () => (nodeInvokeStream?.isRuntimeCurrent() ?? true) && resolveNodeInvokeRuntimeAuthorityError({
						context,
						client,
						approvalAuthority: forwardedParams.approvalAuthority
					}) === void 0,
					onDispatchReady: (invokeId) => {
						nodeCommandDispatched = true;
						nodeInvokeStream?.onDispatchReady(invokeId);
					}
				});
				if (!await continuePairingWork()) return;
				if (!res.ok) {
					if (shouldQueueAsPendingForegroundAction({
						platform: nodeSession.platform,
						command,
						error: res.error
					}) && !client?.internal?.agentRuntimeIdentity && !forwardedParams.approvalAuthority) {
						const paramsJSON = toPendingParamsJSON(forwardedParams.params);
						const queued = enqueuePendingNodeAction({
							nodeId,
							pairingGeneration: generation.key,
							command,
							paramsJSON,
							idempotencyKey: p.idempotencyKey,
							ttlMs: nodeInvokePolicy.pendingActionTtlMs,
							maxPerNode: nodeInvokePolicy.pendingActionMaxPerNode
						});
						const wake = await awaitWithinDeadline(() => maybeWakeNodeWithApns(nodeId, {
							cfg,
							lifecycle: wakeLifecycle,
							generation
						}), invokeDeadlineAtMs, () => performance.now());
						if (wake === ABSOLUTE_DEADLINE_EXPIRED || !await continuePairingWork()) {
							if (wake === ABSOLUTE_DEADLINE_EXPIRED) respondIfInvokeExpired();
							if (queued.created) removePendingNodeAction({
								nodeId,
								pairingGeneration: generation.key,
								actionId: queued.action.id,
								ttlMs: nodeInvokePolicy.pendingActionTtlMs
							});
							return;
						}
						context.logGateway.info(`node pending queued node=${nodeId} req=${req.id} command=${command} queuedId=${queued.action.id} wakePath=${wake.path} wakeAvailable=${wake.available}`);
						respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, "node command queued until iOS returns to foreground", {
							retryable: true,
							details: {
								code: "QUEUED_UNTIL_FOREGROUND",
								queuedActionId: queued.action.id,
								nodeId,
								command,
								wake: {
									path: wake.path,
									available: wake.available,
									throttled: wake.throttled,
									apnsStatus: wake.apnsStatus,
									apnsReason: wake.apnsReason
								},
								nodeError: res.error ?? null
							}
						}));
						return;
					}
					if (!respondUnavailableOnNodeInvokeErrorWithProvenance(respond, res, { nodeCommandDispatched })) return;
					return;
				}
				const payload = res.payloadJSON ? parseGatewayPayload(res.payloadJSON) : res.payload;
				emitTalkPttNodeEvent({
					context,
					nodeId,
					command,
					payload
				});
				respond(true, {
					ok: true,
					nodeId,
					command,
					payload,
					payloadJSON: res.payloadJSON ?? null
				}, void 0);
			} finally {
				releaseApprovalHandoff?.();
				releaseNodeWakeLifecycle(nodeId, wakeLifecycle);
			}
		});
	},
	"node.invoke.progress": handleNodeInvokeProgress,
	"node.invoke.result": handleNodeInvokeResult
};
//#endregion
//#region src/gateway/server-methods/nodes.pairing.ts
function broadcastRemovedNodePairing(params) {
	params.context.broadcast("node.pair.resolved", {
		requestId: "",
		nodeId: params.nodeId,
		decision: "removed",
		ts: Date.now()
	}, { dropIfSlow: true });
}
function emitNodePairingDeniedSecurityEvent(params) {
	emitDeviceManagementSecurityEvent({
		action: "device.pairing.denied",
		outcome: "denied",
		severity: "medium",
		authz: params.authz,
		targetDeviceId: params.nodeId,
		policyId: "gateway.device-pairing",
		decision: "deny",
		controlId: params.controlId,
		reason: params.reason,
		attributes: { role: "node" }
	});
}
async function enforcePendingNodePairingOwnership(params) {
	const action = params.mutation === "approve" ? "approval" : "rejection";
	const controlId = params.mutation === "approve" ? "node.pair.approve" : "node.pair.reject";
	const deniedMessage = `node pairing ${action} denied`;
	const pending = await getPendingNodePairing(params.requestId);
	const sessionAuthz = resolveDeviceSessionAuthz(params.client);
	if (!pending) {
		if (sessionAuthz.callerDeviceId && !sessionAuthz.isAdminCaller) {
			params.respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, deniedMessage));
			return false;
		}
		return true;
	}
	const authz = resolveDeviceManagementAuthz(params.client, pending.nodeId);
	if (!deniesCrossDeviceManagement(authz)) return true;
	params.context.logGateway.warn(`${deniedMessage} node=${pending.nodeId} reason=device-ownership-mismatch`);
	emitNodePairingDeniedSecurityEvent({
		authz,
		nodeId: pending.nodeId,
		controlId,
		reason: "device-ownership-mismatch"
	});
	params.respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, deniedMessage));
	return false;
}
function emitNodeRoleRemovalSecurityEvent(params) {
	const denied = params.reason !== void 0;
	emitDeviceManagementSecurityEvent({
		action: denied ? "device.role.removal_denied" : "device.role.removed",
		outcome: denied ? "denied" : "success",
		severity: "medium",
		authz: params.authz,
		targetDeviceId: params.deviceId,
		policyId: "gateway.device-pairing",
		decision: denied ? "deny" : "allow",
		controlId: "node.pair.remove",
		...params.reason ? { reason: params.reason } : {},
		attributes: {
			role: "node",
			...params.removedDevice !== void 0 ? { removed_device: params.removedDevice } : {}
		}
	});
}
async function removePairedDeviceBackedNode(params) {
	const nodeId = params.nodeId.trim();
	if (!nodeId) return { status: "unknown" };
	const paired = await getPairedDevice(nodeId);
	if (!paired || !listApprovedPairedDeviceRoles(paired).includes("node")) return { status: "unknown" };
	const authz = resolveDeviceManagementAuthz(params.client, nodeId);
	if (deniesCrossDeviceManagement(authz)) {
		params.context.logGateway.warn(`node pairing removal denied node=${nodeId} reason=device-ownership-mismatch`);
		emitNodeRoleRemovalSecurityEvent({
			authz,
			deviceId: nodeId,
			reason: "device-ownership-mismatch"
		});
		return {
			status: "denied",
			message: "node pairing removal denied"
		};
	}
	if (authz.callerDeviceId && !authz.isAdminCaller && pairedDeviceHasNonOperatorRole(paired)) {
		params.context.logGateway.warn(`node pairing removal denied node=${nodeId} reason=role-management-requires-admin`);
		emitNodeRoleRemovalSecurityEvent({
			authz,
			deviceId: nodeId,
			reason: "role-management-requires-admin"
		});
		return {
			status: "denied",
			message: "node pairing removal denied"
		};
	}
	const removed = await removePairedDeviceRole({
		deviceId: nodeId,
		role: "node"
	});
	if (!removed) return { status: "unknown" };
	params.context.logGateway.info(`node pairing removed device-backed node=${removed.deviceId}`);
	emitNodeRoleRemovalSecurityEvent({
		authz,
		deviceId: removed.deviceId,
		removedDevice: removed.removedDevice
	});
	params.context.invalidateClientsForDevice?.(removed.deviceId, {
		role: "node",
		reason: "device-pair-removed"
	});
	return {
		status: "removed",
		nodeId: removed.deviceId
	};
}
//#endregion
//#region src/gateway/server-methods/nodes.ts
const nodeHandlers = {
	"node.pair.list": async ({ params, respond, client }) => {
		if (!assertValidParams(params, validateNodePairListParams, "node.pair.list", respond)) return;
		await respondUnavailableOnThrow(respond, async () => {
			const list = await listNodePairing();
			const authz = resolveDeviceSessionAuthz(client);
			respond(true, authz.callerDeviceId && !authz.isAdminCaller ? {
				pending: list.pending.filter((request) => request.nodeId.trim() === authz.callerDeviceId),
				paired: list.paired.filter((node) => node.nodeId.trim() === authz.callerDeviceId)
			} : list, void 0);
		});
	},
	"node.pair.approve": async ({ params, respond, context, client }) => {
		if (!assertValidParams(params, validateNodePairApproveParams, "node.pair.approve", respond)) return;
		const { requestId } = params;
		const callerScopes = Array.isArray(client?.connect?.scopes) ? client.connect.scopes : [];
		await respondUnavailableOnThrow(respond, async () => {
			if (!await enforcePendingNodePairingOwnership({
				requestId,
				mutation: "approve",
				client,
				context,
				respond
			})) return;
			const pendingApproval = await getPendingNodePairing(requestId);
			const pairingStateBeforeApproval = pendingApproval ? await captureNodePairingState(pendingApproval.nodeId) : null;
			const sessionBeforeApproval = pendingApproval ? context.nodeRegistry.get(pendingApproval.nodeId) : void 0;
			const approved = await approveNodePairing(requestId, { callerScopes });
			if (!approved) {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "unknown requestId"));
				return;
			}
			if ("status" in approved && approved.status === "forbidden") {
				respond(false, void 0, missingScopeErrorShape({
					missingScope: approved.missingScope,
					requiredScopes: approved.missingScope === "operator.pairing" ? [PAIRING_SCOPE] : [PAIRING_SCOPE, approved.missingScope]
				}));
				return;
			}
			if (!("node" in approved)) {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "unknown requestId"));
				return;
			}
			const approvedNode = approved.node;
			invalidateNodeWakeState(approvedNode.nodeId);
			const persistedApprovedState = await captureNodePairingState(approvedNode.nodeId);
			const previousGenerationKey = pairingStateBeforeApproval?.generation?.key;
			const updatedNode = Boolean(sessionBeforeApproval && pairingStateBeforeApproval?.identity.key === approved.pairingIdentity && sessionBeforeApproval.pairingIdentity === approved.pairingIdentity && approved.previousPairingGeneration === previousGenerationKey && sessionBeforeApproval.pairingGeneration === previousGenerationKey) && sessionBeforeApproval && persistedApprovedState?.identity.key === approved.pairingIdentity && persistedApprovedState.generation?.key === approved.nextPairingGeneration ? context.nodeRegistry.updateSurface(approvedNode.nodeId, {
				caps: approvedNode.caps ?? [],
				commands: approvedNode.commands ?? [],
				permissions: approvedNode.permissions
			}, {
				expectedConnId: sessionBeforeApproval.connId,
				expectedPairingIdentity: approved.pairingIdentity,
				...previousGenerationKey ? { expectedPairingGeneration: previousGenerationKey } : {},
				nextPairingGeneration: approved.nextPairingGeneration
			}) : null;
			const resolved = {
				requestId,
				nodeId: approvedNode.nodeId,
				decision: "approved",
				ts: Date.now()
			};
			if (updatedNode) {
				refreshConnectedNodeSurfaceCaches({
					context,
					nodeSession: updatedNode
				});
				if (!await context.nodeRegistry.sendEventForPairingIdentity({
					nodeId: updatedNode.nodeId,
					connId: updatedNode.connId,
					pairingIdentity: approved.pairingIdentity,
					event: "node.pair.resolved",
					payload: resolved
				})) context.logGateway.warn(`node approval refresh was not delivered for ${approvedNode.nodeId}; the current node must republish after reconnect`);
			}
			context.broadcast("node.pair.resolved", resolved, { dropIfSlow: true });
			respond(true, {
				requestId: approved.requestId,
				node: approvedNode
			}, void 0);
		});
	},
	"node.pair.reject": async ({ params, respond, context, client }) => {
		if (!assertValidParams(params, validateNodePairRejectParams, "node.pair.reject", respond)) return;
		const { requestId } = params;
		await respondUnavailableOnThrow(respond, async () => {
			if (!await enforcePendingNodePairingOwnership({
				requestId,
				mutation: "reject",
				client,
				context,
				respond
			})) return;
			const rejected = await rejectNodePairing(requestId);
			if (!rejected) {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "unknown requestId"));
				return;
			}
			context.broadcast("node.pair.resolved", {
				requestId,
				nodeId: rejected.nodeId,
				decision: "rejected",
				ts: Date.now()
			}, { dropIfSlow: true });
			respond(true, rejected, void 0);
		});
	},
	"node.pair.remove": async ({ params, respond, context, client }) => {
		if (!assertValidParams(params, validateNodePairRemoveParams, "node.pair.remove", respond)) return;
		const { nodeId } = params;
		await respondUnavailableOnThrow(respond, async () => {
			const deviceBacked = await removePairedDeviceBackedNode({
				nodeId,
				client,
				context
			});
			if (deviceBacked.status === "denied") {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, deviceBacked.message));
				return;
			}
			if (deviceBacked.status !== "removed") {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "unknown nodeId"));
				return;
			}
			try {
				clearRemovedNodeRuntimeState({
					nodeId: deviceBacked.nodeId,
					context
				});
				await reconcileRevokedDeviceWorker(context, deviceBacked.nodeId);
				broadcastRemovedNodePairing({
					nodeId: deviceBacked.nodeId,
					context
				});
				respond(true, { nodeId: deviceBacked.nodeId }, void 0);
			} finally {
				queueMicrotask(() => {
					context.disconnectClientsForDevice?.(deviceBacked.nodeId, { role: "node" });
				});
			}
		});
	},
	"node.rename": async ({ params, respond, context, client }) => {
		if (!assertValidParams(params, validateNodeRenameParams, "node.rename", respond)) return;
		const { nodeId, displayName } = params;
		await respondUnavailableOnThrow(respond, async () => {
			const authz = resolveDeviceManagementAuthz(client, nodeId);
			if (deniesCrossDeviceManagement(authz)) {
				context.logGateway.warn(`node rename denied node=${authz.normalizedTargetDeviceId} reason=device-ownership-mismatch`);
				emitNodePairingDeniedSecurityEvent({
					authz,
					nodeId: authz.normalizedTargetDeviceId,
					controlId: "node.rename",
					reason: "device-ownership-mismatch"
				});
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "node rename denied"));
				return;
			}
			const trimmed = displayName.trim();
			if (!trimmed) {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "displayName required"));
				return;
			}
			const updated = await renamePairedNode(nodeId, trimmed);
			if (!updated) {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "unknown nodeId"));
				return;
			}
			respond(true, {
				nodeId: updated.nodeId,
				displayName: updated.displayName
			}, void 0);
		});
	},
	...nodeReadHandlers,
	...nodePendingActionHandlers,
	...nodeInvokeHandlers,
	...nodeEventHandlers
};
//#endregion
export { nodeHandlers };
