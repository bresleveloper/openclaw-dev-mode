import { u as normalizeSortedUniqueTrimmedStringList } from "./string-normalization-_gRhJUDw.mjs";
import { a as isRuntimeToolAllowed, s as isToolAllowedByPolicyName } from "./tool-policy-match-Bv2XOvEF.mjs";
import { t as ErrorCodes } from "./gateway-error-details-D85F07e9.mjs";
import { Bt as validateEnvironmentsSessionCreateParams, Ut as validateEnvironmentsSessionStatusParams, Vt as validateEnvironmentsSessionDestroyParams } from "./src-BRUl7oDv.mjs";
import { f as errorShape } from "./error-codes-DvB36bCj.mjs";
import { n as resolveRequestedSessionAgentId } from "./session-request-agent-DN7PUqhR.mjs";
import { i as getGatewayToolCallerIdentity, t as captureGatewayToolCallerAssertion } from "./gateway-caller-context-DvDb9xl2.mjs";
import { I as authorizeSessionSharingTarget } from "./session-sharing-C4w_but1.mjs";
import { t as resolveConversationCapabilityProfile } from "./conversation-capability-profile-CET85wnK.mjs";
import { n as isConversationToolAllowed } from "./conversation-tool-policy-pipeline-lj6t0cRI.mjs";
import { n as defineValidatedGatewayMethod } from "./validation-CFv_zneu.mjs";
import { i as loadAccessorSessionEntryForGatewayTarget } from "./sessions-shared-DFVq928u.mjs";
import { t as dispatchUiCommandToRequester } from "./ui-command-BF6gZitb.mjs";
//#region src/gateway/worker-environments/environment-summary.ts
const WORKER_STATUS = {
	requested: "starting",
	provisioning: "starting",
	bootstrapping: "starting",
	ready: "available",
	attached: "available",
	idle: "available",
	draining: "stopping",
	destroying: "stopping",
	destroyed: "unavailable",
	failed: "error",
	orphaned: "error"
};
/** Projects a durable worker row without exposing its SSH credential reference. */
function summarizeWorkerEnvironment(record, now = Date.now()) {
	return {
		id: record.environmentId,
		type: "worker",
		status: WORKER_STATUS[record.state],
		...record.sharedHost === null ? {} : { trust: record.sharedHost ? "persistent" : "disposable" },
		...record.desktopAvailable ? { desktop: true } : {},
		...record.preparation ? { preparation: {
			purpose: record.preparation.purpose,
			key: record.preparation.key
		} } : {},
		worker: {
			profileId: record.profileId,
			providerId: record.providerId,
			...record.leaseId ? { leaseId: record.leaseId } : {},
			state: record.state,
			ageMs: Math.max(0, Math.trunc(now - record.createdAtMs)),
			...record.state === "idle" && record.idleSinceAtMs !== null ? { idleMs: Math.max(0, Math.trunc(now - record.idleSinceAtMs)) } : {},
			attachedSessionIds: normalizeSortedUniqueTrimmedStringList(record.attachedSessionIds),
			tunnelStatus: record.tunnelStatus,
			...(record.state === "failed" || record.state === "orphaned") && record.error ? { error: record.error } : {},
			...record.desktopAvailable ? { desktop: true } : {},
			...record.desktopApps.length > 0 ? { desktopApps: [...record.desktopApps] } : {}
		}
	};
}
//#endregion
//#region src/gateway/server-methods/environments.session-tool-policy.ts
/** Delegating a tool through an environment retains both its admitted cap and current policy. */
function captureSessionEnvironmentToolPolicy(options, caller, tool) {
	const ambient = getGatewayToolCallerIdentity();
	const runtime = options.client?.internal?.agentRuntimeIdentity;
	const run = ambient?.operationalRunInstance;
	const assertCapturedToolAllowed = ambient?.assertToolAllowed;
	const inherited = runtime?.sessionSpawnContext?.inheritedToolPolicy;
	const inheritedPolicy = inherited ? {
		allow: [...inherited.allow],
		deny: [...inherited.deny]
	} : void 0;
	return {
		cronExecAskAlways: ambient?.cronExecToolTarget?.ask === "always" || runtime?.cronExecToolTarget?.ask === "always",
		assertAllowed: () => {
			caller.assertCurrent();
			if (ambient) {
				if (!run || !assertCapturedToolAllowed || ambient.agentId !== caller.identity.agentId || ambient.sessionKey !== caller.identity.sessionKey || runtime && (runtime.operationalRunInstance.instanceId !== run.instanceId || runtime.operationalRunInstance.runId !== run.runId)) throw new Error(`Environment ${tool} has no matching captured tool authority`);
				assertCapturedToolAllowed(tool);
			} else if ((runtime || options.client?.internal?.agentToolCaller) && !inheritedPolicy) throw new Error(`Environment ${tool} has no captured tool authority`);
			const capability = resolveConversationCapabilityProfile({
				config: options.context.getRuntimeConfig(),
				...caller.identity,
				modelProvider: runtime?.sessionSpawnContext?.resolvedModel?.provider,
				modelId: runtime?.sessionSpawnContext?.resolvedModel?.model
			});
			if (!isConversationToolAllowed(capability, tool) || inheritedPolicy && (!isRuntimeToolAllowed(tool, inheritedPolicy.allow) || !isToolAllowedByPolicyName(tool, { deny: inheritedPolicy.deny }))) throw new Error(`Conversation policy denies ${tool}`);
		}
	};
}
//#endregion
//#region src/gateway/server-methods/environments.session.ts
/** Binds machine effects to the authenticated conversation and its current incarnation. */
function resolveSessionEnvironmentCaller(options, requested = {}) {
	const { context, client } = options;
	const tool = client?.internal?.agentToolCaller;
	const runtime = client?.internal?.agentRuntimeIdentity;
	const ambient = client?.internal?.syntheticClient ? getGatewayToolCallerIdentity() : void 0;
	const assertAmbient = ambient ? captureGatewayToolCallerAssertion() : void 0;
	const owner = tool ?? runtime ?? (assertAmbient ? ambient : void 0);
	if (!client || client.internal?.syntheticClient && !owner) throw new Error("Conversation environments require an authenticated operator or admitted agent run");
	if (tool && !tool.assertCurrent) throw new Error("Conversation environment tool has no live run authority");
	if (owner && (requested.sessionKey && requested.sessionKey !== owner.sessionKey || requested.agentId && requested.agentId !== owner.agentId)) throw new Error("An agent can only manage its own conversation environment");
	const sessionKey = owner?.sessionKey ?? requested.sessionKey;
	if (!sessionKey) throw new Error("sessionKey is required for operator environment requests");
	const selected = resolveRequestedSessionAgentId(context.getRuntimeConfig(), sessionKey, owner?.agentId ?? requested.agentId);
	if (!selected.ok) throw new Error(selected.error.message);
	const readTarget = () => loadAccessorSessionEntryForGatewayTarget({
		cfg: context.getRuntimeConfig(),
		key: sessionKey,
		agentId: selected.agentId
	});
	const target = readTarget();
	if (!target.entry || target.entry.incognito === true) throw new Error("A persistent conversation is required for an attached environment");
	const identity = {
		sessionId: target.entry.sessionId,
		sessionKey: target.canonicalKey,
		agentId: selected.agentId,
		...target.entry.lifecycleRevision ? { sessionLifecycleRevision: target.entry.lifecycleRevision } : {}
	};
	const signals = [
		options.signal,
		client.connectionSignal,
		...ambient?.approvalSignals ?? []
	].filter((signal) => signal !== void 0);
	const signal = signals.length ? AbortSignal.any(signals) : void 0;
	const assertCurrent = () => {
		signal?.throwIfAborted();
		options.sessionMutationCommitGuard?.();
		options.sessionMutationAuthorization?.assertCurrent();
		if (client.invalidated || options.hasCurrentClientAuthority?.() === false) throw new Error("Conversation environment requester is no longer active");
		tool?.assertCurrent?.();
		if (ambient) {
			if (!assertAmbient || ambient.gatewayContextResolver && ambient.gatewayContextResolver() !== context) throw new Error("Conversation environment tool belongs to a different or retired Gateway");
			assertAmbient();
		}
		if (runtime && context.validateAgentRuntimeApprovalAuthority?.(runtime) !== true) throw new Error("Conversation environment agent run is no longer active");
		const current = readTarget();
		if (current.entry?.sessionId !== identity.sessionId || current.canonicalKey !== identity.sessionKey || current.entry.lifecycleRevision !== identity.sessionLifecycleRevision) throw new Error("Conversation identity changed before the environment operation");
		if (!owner) {
			const denied = authorizeSessionSharingTarget({
				cfg: context.getRuntimeConfig(),
				client,
				target: {
					agentId: identity.agentId,
					canonicalKey: current.canonicalKey,
					entry: current.entry,
					storeKey: current.sessionStoreKey,
					storeKeys: current.target.storeKeys,
					storePath: current.storePath
				}
			});
			if (denied) throw new Error(denied.message);
		}
	};
	assertCurrent();
	return {
		identity,
		assertCurrent,
		signal
	};
}
function failure(error) {
	return errorShape(ErrorCodes.INVALID_REQUEST, error instanceof Error ? error.message : "Conversation environment request failed");
}
const environmentsSessionHandlers = {
	"environments.session.create": defineValidatedGatewayMethod("environments.session.create", validateEnvironmentsSessionCreateParams, async (options) => {
		const { params, respond, context } = options;
		try {
			const caller = resolveSessionEnvironmentCaller(options, params);
			const { presentation, ...request } = params;
			const assertAllowed = presentation ? captureSessionEnvironmentToolPolicy(options, caller, "screen").assertAllowed : caller.assertCurrent;
			assertAllowed();
			const service = context.workerEnvironmentService;
			if (!service) throw new Error("Cloud worker environments are not configured");
			const result = await service.createSessionAttachment({
				...request,
				...caller.identity
			}, assertAllowed, caller.signal, presentation ? async ({ environmentId }) => {
				assertAllowed();
				const dispatched = dispatchUiCommandToRequester({
					client: options.client,
					context,
					params: {
						sessionKey: caller.identity.sessionKey,
						agentId: caller.identity.agentId,
						command: presentation === "desktop" ? {
							kind: "panel",
							panel: "desktop",
							environmentId,
							open: true,
							dock: "right"
						} : {
							kind: "panel",
							panel: "portal",
							environmentId,
							open: true,
							dock: "right"
						}
					}
				});
				if (!dispatched.ok) throw new Error(dispatched.error.message);
				assertAllowed();
			} : void 0);
			assertAllowed();
			respond(true, {
				...result,
				environment: summarizeWorkerEnvironment(result.environment)
			});
		} catch (error) {
			respond(false, void 0, failure(error));
		}
	}),
	"environments.session.status": defineValidatedGatewayMethod("environments.session.status", validateEnvironmentsSessionStatusParams, (options) => {
		const { params, respond, context } = options;
		try {
			const caller = resolveSessionEnvironmentCaller(options, params);
			const result = context.workerEnvironmentService?.getSessionAttachmentStatus(caller.identity.sessionId);
			if (params.environmentId && result?.attachment.environmentId !== params.environmentId) throw new Error("Conversation environment target changed");
			caller.assertCurrent();
			respond(true, result ? {
				attachment: result.attachment,
				closed: result.attachment.closedAtMs !== null,
				environment: summarizeWorkerEnvironment(result.environment)
			} : { attachment: null });
		} catch (error) {
			respond(false, void 0, failure(error));
		}
	}),
	"environments.session.destroy": defineValidatedGatewayMethod("environments.session.destroy", validateEnvironmentsSessionDestroyParams, async (options) => {
		const { params, respond, context } = options;
		try {
			const caller = resolveSessionEnvironmentCaller(options, params);
			const service = context.workerEnvironmentService;
			if (!service) throw new Error("Cloud worker environments are not configured");
			const result = await service.destroySessionAttachment({
				sessionId: caller.identity.sessionId,
				environmentId: params.environmentId
			}, caller.assertCurrent);
			caller.assertCurrent();
			respond(true, {
				stopped: true,
				...result ? { environment: summarizeWorkerEnvironment(result) } : {}
			});
		} catch (error) {
			respond(false, void 0, failure(error));
		}
	})
};
//#endregion
export { summarizeWorkerEnvironment as i, resolveSessionEnvironmentCaller as n, captureSessionEnvironmentToolPolicy as r, environmentsSessionHandlers as t };
