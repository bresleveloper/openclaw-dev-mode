import { u as normalizeSortedUniqueTrimmedStringList } from "./string-normalization-D6DKCpwE.mjs";
import { i as isIncognitoSessionKey } from "./incognito-session-key-BWpn88lo.mjs";
import { M as parseAgentSessionKey } from "./session-key-CSDERtm3.mjs";
import { Ng as errorShape, cn as validateEnvironmentsSessionDestroyParams, sn as validateEnvironmentsSessionCreateParams, un as validateEnvironmentsSessionStatusParams } from "./src-pLJQA6J5.mjs";
import { c as resolveSessionStorePathCore } from "./paths-YgcBNLgG.mjs";
import { a as isRuntimeToolAllowed, s as isToolAllowedByPolicyName } from "./tool-policy-match--5jlhAPZ.mjs";
import { t as ErrorCodes } from "./gateway-error-details-Cl-eEOTQ.mjs";
import { c as resolveGatewayPersonalToolParticipant, o as getGatewayToolCallerIdentity, t as captureGatewayToolCallerAssertion } from "./gateway-caller-context-Be176_GV.mjs";
import { r as resolveRequestedSessionAgentId } from "./session-request-agent-ByGzV8Af.mjs";
import { a as resolveSessionStoreIdentity } from "./session-store-key-DKpto8R6.mjs";
import { r as requireSessionRowProjection } from "./session-row-projection-access-BUm5f-cY.mjs";
import { t as prepareSessionMutationFacts } from "./session-sharing-preparation-DAfvBDLL.mjs";
import { c as prepareSessionSharingProfiles, o as prepareProjectedSessionSharing } from "./session-sharing-read-B9_xLej9.mjs";
import { r as defineValidatedGatewayMethod } from "./validation--xIH1Pj-.mjs";
import { r as resolveConversationCapabilityProfile } from "./conversation-capability-profile-BVWQsqkw.mjs";
import { n as isConversationToolAllowed } from "./conversation-tool-policy-pipeline-DNbcwb7L.mjs";
import { t as dispatchUiCommandToRequester } from "./ui-command-D2rR0ag8.mjs";
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
function summarizeWorkerEnvironment(record, now = Date.now(), options = {}) {
	const cleanupPending = record.destroyRequestedAtMs !== null && record.state !== "destroyed";
	const error = record.state === "failed" || record.state === "orphaned" || cleanupPending ? record.error : void 0;
	return {
		id: record.environmentId,
		type: "worker",
		status: error ? "error" : WORKER_STATUS[record.state],
		...record.sharedHost === null ? {} : { trust: record.sharedHost ? "persistent" : "disposable" },
		...record.desktopAvailable ? { desktop: true } : {},
		...record.preparation ? { preparation: {
			purpose: record.preparation.purpose,
			key: record.preparation.key,
			...options.includePreparedDetails ? { details: {
				demandAtMs: record.preparation.demandAtMs,
				expiresAtMs: record.preparation.expiresAtMs,
				consumedAtMs: record.preparation.consumedAtMs,
				...record.preparation.project ? { project: {
					...record.preparation.project.label ? { label: record.preparation.project.label } : {},
					baseCommit: record.preparation.project.baseCommit
				} } : {}
			} } : {}
		} } : {},
		worker: {
			profileId: record.profileId,
			providerId: record.providerId,
			...record.leaseId ? { leaseId: record.leaseId } : {},
			state: record.state,
			...record.startStatus ? { startStatus: record.startStatus } : {},
			...options.includePreparedDetails && record.destroyRequestedAtMs !== null ? { destroyRequestedAtMs: record.destroyRequestedAtMs } : {},
			ageMs: Math.max(0, Math.trunc(now - record.createdAtMs)),
			...record.state === "idle" && record.idleSinceAtMs !== null ? { idleMs: Math.max(0, Math.trunc(now - record.idleSinceAtMs)) } : {},
			attachedSessionIds: normalizeSortedUniqueTrimmedStringList(record.attachedSessionIds),
			tunnelStatus: record.tunnelStatus,
			...error ? { error } : {},
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
			const config = options.context.getRuntimeConfig();
			const readCapabilityEntry = (agentId, query) => {
				const current = requireSessionRowProjection(options.context).readCapabilityEntry({
					...query,
					agentId,
					storePath: resolveSessionStorePathCore(config.session?.store, { agentId })
				});
				if (!current) throw new Error("Conversation capability projection is unavailable");
				return current.entry;
			};
			const capability = resolveConversationCapabilityProfile({
				config,
				...caller.identity,
				preparedSessionCapabilityStore: {
					authoritative: true,
					get: (key) => {
						const agentId = parseAgentSessionKey(key)?.agentId ?? caller.identity.agentId;
						return readCapabilityEntry(agentId, { key });
					},
					getById: (sessionId) => readCapabilityEntry(caller.identity.agentId, { sessionId })
				},
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
async function resolveSessionEnvironmentCaller(options, requested = {}) {
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
	if (isIncognitoSessionKey(resolveSessionStoreIdentity({
		cfg: context.getRuntimeConfig(),
		sessionKey,
		agentId: selected.agentId
	}).canonicalKey)) throw new Error("A persistent conversation is required for an attached environment");
	const profiles = await prepareSessionSharingProfiles(client);
	const read = await prepareSessionMutationFacts({
		cfg: context.getRuntimeConfig(),
		sessionKey,
		agentId: selected.agentId
	});
	try {
		const target = read.readCurrent(context.getRuntimeConfig()).target;
		if (!target || target.entry.incognito === true) throw new Error("A persistent conversation is required for an attached environment");
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
			const cfg = context.getRuntimeConfig();
			const facts = read.readCurrent(cfg);
			if (facts.target?.entry.sessionId !== identity.sessionId || facts.target.entry.lifecycleRevision !== identity.sessionLifecycleRevision) throw new Error("Conversation identity changed before the environment operation");
			if (!owner) {
				const sharing = prepareProjectedSessionSharing({
					cfg,
					client,
					profiles,
					isMember: (_target, id) => facts.membership.has(id)
				});
				const denied = facts.target && sharing.authorizeTarget(facts.target);
				if (denied) throw new Error(denied.message);
			}
		};
		assertCurrent();
		return {
			identity,
			assertCurrent,
			signal,
			release: read.release
		};
	} catch (error) {
		read.release();
		throw error;
	}
}
function failure(error) {
	return errorShape(ErrorCodes.INVALID_REQUEST, error instanceof Error ? error.message : "Conversation environment request failed");
}
const environmentsSessionHandlers = {
	"environments.session.create": defineValidatedGatewayMethod("environments.session.create", validateEnvironmentsSessionCreateParams, async (options) => {
		const { params, respond, context } = options;
		const caller = await resolveSessionEnvironmentCaller(options, params);
		try {
			const { presentation, ...request } = params;
			if (presentation) try {
				resolveGatewayPersonalToolParticipant(options.client?.internal?.agentRuntimeIdentity);
			} catch (error) {
				throw new Error(`${error instanceof Error ? error.message : String(error)} Create the environment without presentation, then show it with screen (desktop_show or portal_show with environmentId) and user set to the requester's requester_profile.id.`, { cause: error });
			}
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
						command: {
							kind: "panel",
							panel: presentation === "desktop" ? "desktop" : "portal",
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
		} finally {
			caller.release();
		}
	}, failure),
	"environments.session.status": defineValidatedGatewayMethod("environments.session.status", validateEnvironmentsSessionStatusParams, async (options) => {
		const { params, respond, context } = options;
		const caller = await resolveSessionEnvironmentCaller(options, params);
		try {
			const result = context.workerEnvironmentService?.getSessionAttachmentStatus(caller.identity.sessionId);
			if (params.environmentId && result?.attachment.environmentId !== params.environmentId) throw new Error("Conversation environment target changed");
			caller.assertCurrent();
			respond(true, result ? {
				attachment: result.attachment,
				closed: result.attachment.closedAtMs !== null,
				environment: summarizeWorkerEnvironment(result.environment)
			} : { attachment: null });
		} finally {
			caller.release();
		}
	}, failure),
	"environments.session.destroy": defineValidatedGatewayMethod("environments.session.destroy", validateEnvironmentsSessionDestroyParams, async (options) => {
		const { params, respond, context } = options;
		const caller = await resolveSessionEnvironmentCaller(options, params);
		try {
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
		} finally {
			caller.release();
		}
	}, failure)
};
//#endregion
export { summarizeWorkerEnvironment as i, resolveSessionEnvironmentCaller as n, captureSessionEnvironmentToolPolicy as r, environmentsSessionHandlers as t };
