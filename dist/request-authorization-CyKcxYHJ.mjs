import { r as getAsyncWorkSignal } from "./async-work-scope-BH2yUdBz.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { s as raceWithTimeout } from "./src-Bzfi3cQM.mjs";
import { d as withPluginRuntimeRegistryScope } from "./gateway-request-scope-1BXD1G3l.mjs";
import { t as isPromiseLike } from "./promise-like-D7-l5Fsp.mjs";
import { a as sessionChanges } from "./session-row-changes-vFaNnKNM.mjs";
import { i as isIncognitoSessionKey } from "./incognito-session-key-BWpn88lo.mjs";
import { M as parseAgentSessionKey } from "./session-key-CSDERtm3.mjs";
import { w as tryResolveAmbientOwnerAgentId } from "./agent-scope-config-fjA2T9Gz.mjs";
import { i as listAgentIds } from "./agent-roster-gkYP38su.mjs";
import "./user-profile-constants-DfyZS95p.mjs";
import { Ng as errorShape, Pg as missingScopeErrorShape } from "./src-pLJQA6J5.mjs";
import { c as resolveSessionStorePathCore } from "./paths-YgcBNLgG.mjs";
import { _ as readAgentDatabaseAdmissionRefusal, m as listAgentDatabaseAdmissionRefusals, s as createAgentDatabaseAdmissionErrorShape } from "./agent-database-admission-CeDA0ojh.mjs";
import { c as onUserProfilesChanged } from "./user-profile-events-CXjmX5Qy.mjs";
import { t as isPerAgentSessionStoreConfig } from "./session-store-config-ugPrOKRi.mjs";
import { n as resolveSessionStoreCompatibilityAgentId } from "./legacy.default-agent-owner-Blrs2q29.mjs";
import { a as isRuntimeToolAllowed, s as isToolAllowedByPolicyName } from "./tool-policy-match--5jlhAPZ.mjs";
import { f as isOperatorScope } from "./operator-scopes-BO7_XQCg.mjs";
import { n as resolveSessionMethodScope } from "./session-method-scopes-base-DP0bm9jg.mjs";
import { n as authorizeOperatorScopesForMethod, r as authorizeOperatorScopesForRequiredScope, s as resolveLeastPrivilegeOperatorScopesForMethod } from "./method-scopes-Bcx3NDQr.mjs";
import { l as sessionMutationTargetFields } from "./session-method-policy-B7o-3I76.mjs";
import { i as prepareSqliteTargetFromSessionStorePath } from "./session-sqlite-target-DJQA0Ssz.mjs";
import { t as ErrorCodes } from "./gateway-error-details-Cl-eEOTQ.mjs";
import { a as onOperatorRolePolicyChanged, f as resolveOperatorRolePolicy, t as authorizeCurrentOperatorRoleScopes, u as resolveGatewayOperatorRoleActor } from "./operator-role-policy-Coro3qc5.mjs";
import { o as getGatewayToolCallerIdentity, t as captureGatewayToolCallerAssertion } from "./gateway-caller-context-Be176_GV.mjs";
import { r as onSessionIdentityMutation } from "./session-lifecycle-events-76OxWRqj.mjs";
import { r as resolveRequestedSessionAgentId } from "./session-request-agent-ByGzV8Af.mjs";
import { n as authorizeAuthenticatedProfileForMethod } from "./gateway-client-identity-DXWhtQve.mjs";
import { d as isGatewayAdmin, r as authorizeOwnSessionMutation } from "./session-sharing-policy-vx7GWqzs.mjs";
import { t as SessionMutationAuthorizationChangedError } from "./session-mutation-authorization-error-Cdqn6r49.mjs";
import { n as getSessionRowProjection } from "./session-row-projection-access-BUm5f-cY.mjs";
import { n as captureSessionMutationRouting } from "./session-sharing-preparation-DAfvBDLL.mjs";
import { i as resolveDirectSessionTargets, n as resolveChatSendAuthorizationParams, r as resolveDirectIncognitoTargets, t as readSessionSharingStringParam } from "./session-sharing-target-input-Cob8P56S.mjs";
import { o as prepareUserProfileRoleAuthority } from "./user-channel-identity-operations-CAjJ0iFU.mjs";
import { s as prepareSessionSharing } from "./session-sharing-read-B9_xLej9.mjs";
import "./session-sharing-DuL10izq.mjs";
import { r as captureGatewayOperatorRunAuthority } from "./operator-run-authority-BcrXDfhQ.mjs";
import { i as gatewayStartupUnavailableDetails } from "./startup-unavailable-D0-EeFjq.mjs";
import { l as holdsCronManagementGrant } from "./cron-creator-authority-grant-BdRpVx3w.mjs";
import { n as isInProcessSessionRun } from "./in-process-session-run-1xLeAqeJ.mjs";
import { t as resolveSessionMutationAuthorizationAsync } from "./session-sharing-authorization-async-DhG3gR3C.mjs";
import { n as gatewayRouterUploadPolicyError } from "./core-handlers-CbFk9Z4X.mjs";
import { t as resolveSessionResourceToolPolicy } from "./session-resource-tool-policy-BQ2L6SEx.mjs";
import { t as resolveAgentIdOrRespondError } from "./agent-id-shared-BTlRmOxU.mjs";
import { n as parseGatewayRole, t as isRoleAuthorizedForMethod } from "./role-policy-Cast0qMC.mjs";
//#region src/gateway/session-access-authority.ts
function denied(message = "Session access changed; reopen the session before continuing.") {
	throw new SessionMutationAuthorizationChangedError(errorShape(ErrorCodes.FORBIDDEN, message, { details: { code: "SESSION_ACCESS_CHANGED" } }));
}
var SessionAccessPreparationPendingError = class extends SessionMutationAuthorizationChangedError {
	constructor() {
		super(errorShape(ErrorCodes.UNAVAILABLE, "Session access is refreshing; retry the operation shortly.", {
			retryable: true,
			details: { code: "SESSION_ACCESS_REFRESHING" }
		}));
	}
};
/** Prepare session/profile facts through resident owners; retain the original source authority. */
async function prepareGatewaySessionAccessAuthority(request) {
	const params = {
		...request,
		policy: { ...request.policy }
	};
	const assertInvocationCurrent = params.assertInvocationCurrent;
	const assertPreparationSourceCurrent = params.assertPreparationCurrent ?? assertInvocationCurrent;
	assertPreparationSourceCurrent?.();
	const input = params.requestParams;
	const sessionKey = isRecord(input) && typeof input.sessionKey === "string" ? input.sessionKey : "";
	const parsed = parseAgentSessionKey(sessionKey);
	if (!parsed || sessionKey !== sessionKey.trim() || isIncognitoSessionKey(sessionKey) || isRecord(input) && input.agentId !== void 0 && input.agentId !== parsed.agentId) denied("This operation requires a full, non-incognito sessionKey and its matching agentId.");
	const client = params.client;
	const initialActor = resolveGatewayOperatorRoleActor(client);
	const actor = initialActor ? { ...initialActor } : void 0;
	const profileId = actor?.kind === "operator" ? actor.profileId : client?.authenticatedUserProfile?.profileId;
	const originalGrant = client?.internal?.operatorAccessAuthority;
	const originalRun = client?.internal?.operatorRunAuthority;
	const originalScopes = [...client?.connect.scopes ?? []];
	const tool = client?.internal?.agentToolCaller;
	const runtime = client?.internal?.agentRuntimeIdentity;
	const ambient = client?.internal?.syntheticClient ? getGatewayToolCallerIdentity() : void 0;
	const assertAmbient = ambient ? captureGatewayToolCallerAssertion() : void 0;
	const owner = tool ?? runtime ?? (assertAmbient ? ambient : void 0);
	const inherited = runtime?.sessionSpawnContext?.inheritedToolPolicy;
	const inheritedPolicy = inherited ? {
		allow: [...inherited.allow],
		deny: [...inherited.deny]
	} : void 0;
	if (!client || client.internal?.syntheticClient && !owner || tool && !tool.assertCurrent) denied("Session resources require an authenticated operator or an admitted agent run.");
	if (owner && (owner.sessionKey !== sessionKey || owner.agentId !== parsed.agentId)) denied("An agent can only access resources in its own conversation.");
	const assertRun = () => {
		tool?.assertCurrent?.();
		if (ambient) {
			if (!assertAmbient || ambient.agentId !== parsed.agentId || ambient.sessionKey !== sessionKey || ambient.gatewayContextResolver && ambient.gatewayContextResolver() !== params.context) denied();
			assertAmbient();
		}
		if (runtime && params.context.validateAgentRuntimeApprovalAuthority?.(runtime) !== true) denied();
		const requiredTool = params.policy.requiredTool;
		if (requiredTool && owner) {
			if (ambient) {
				if (!ambient.assertToolAllowed || !ambient.operationalRunInstance || runtime && (runtime.operationalRunInstance.instanceId !== ambient.operationalRunInstance.instanceId || runtime.operationalRunInstance.runId !== ambient.operationalRunInstance.runId)) denied();
				ambient.assertToolAllowed(requiredTool);
			} else if (!inheritedPolicy) denied();
			if (inheritedPolicy && (!isRuntimeToolAllowed(requiredTool, inheritedPolicy.allow) || !isToolAllowedByPolicyName(requiredTool, { deny: inheritedPolicy.deny }))) denied();
		}
	};
	assertRun();
	originalGrant?.assertCurrent();
	originalRun?.assertCurrent();
	const projection = getSessionRowProjection(params.context);
	if (!projection) denied("Session access is unavailable during Gateway startup; retry when it is ready.");
	const assertIngress = () => {
		assertPreparationSourceCurrent?.();
		assertRun();
		originalGrant?.assertCurrent();
		originalRun?.assertCurrent();
		const currentActor = resolveGatewayOperatorRoleActor(client);
		if (params.hasCurrentClientAuthority?.() === false || currentActor?.kind !== actor?.kind || currentActor?.kind === "operator" && currentActor.profileId !== profileId || JSON.stringify(client.connect.scopes ?? []) !== JSON.stringify(originalScopes) || client.internal?.operatorAccessAuthority !== originalGrant || client.internal?.operatorRunAuthority !== originalRun) denied();
	};
	const captured = await captureGatewayOperatorRunAuthority({
		client,
		context: params.context,
		hasCurrentClientAuthority: params.hasCurrentClientAuthority,
		sourceAuthority: originalGrant ?? null
	});
	try {
		assertIngress();
		const profile = profileId ? await prepareUserProfileRoleAuthority(profileId) : void 0;
		assertIngress();
		captured?.authority.assertCurrent();
		if (actor?.kind !== "system" && (!profile || profile.profileId !== profileId)) denied("This operation requires a current authenticated profile.");
		await projection.prepareMembership();
		assertIngress();
		captured?.authority.assertCurrent();
		const query = {
			agentId: parsed.agentId,
			key: sessionKey
		};
		const original = projection.sharingTarget(query);
		if (!original?.entry.sessionId || original.canonicalKey !== sessionKey) denied("The requested session is unavailable; open an existing session first.");
		const target = Object.freeze({
			agentId: original.agentId,
			sessionKey: original.canonicalKey,
			sessionId: original.entry.sessionId,
			...original.entry.lifecycleRevision ? { lifecycleRevision: original.entry.lifecycleRevision } : {}
		});
		const policyClient = {
			...client,
			connect: {
				...client.connect,
				scopes: originalScopes
			},
			internal: {
				...client.internal,
				operatorRoleActor: actor,
				...captured ? { operatorRunAuthority: captured.authority } : {}
			}
		};
		const resolveToolPolicy = (current) => params.policy.requiredTool ? resolveSessionResourceToolPolicy({
			config: params.context.getRuntimeConfig(),
			client: policyClient,
			current,
			readPreparedSessionEntry: (sourceQuery) => projection.sharingTarget(sourceQuery)?.entry,
			toolName: params.policy.requiredTool
		}) : void 0;
		const toolPolicy = resolveToolPolicy(original);
		const currentRole = () => actor?.kind === "system" || profileId === "gateway-owner" ? void 0 : resolveOperatorRolePolicy(policyClient, params.context.getRuntimeConfig());
		const sandboxRequired = currentRole()?.sandbox === "required" || toolPolicy?.sandboxRequired === true;
		let sessionRetired = false;
		let actorRetired = false;
		let invocationClosed = false;
		const assertSession = () => {
			if (sessionRetired) denied();
			if (getSessionRowProjection(params.context) !== projection) {
				sessionRetired = true;
				denied();
			}
			const state = projection.sharingTargetState(query);
			if (state.status === "pending") throw new SessionAccessPreparationPendingError();
			const current = state.status === "ready" ? state.target : void 0;
			if (!current || current.storePath !== original.storePath || current.generation !== original.generation || current.entry.sessionId !== target.sessionId || current.entry.lifecycleRevision !== target.lifecycleRevision) {
				sessionRetired = true;
				denied();
			}
			return current;
		};
		const assertActor = () => {
			if (actorRetired) denied();
			try {
				captured?.authority.assertCurrent();
				originalGrant?.assertCurrent();
				if (profile && !profile.isCurrent()) denied();
				const role = currentRole();
				if (role && role.agents !== "*" && !role.agents.includes(target.agentId)) denied();
				const current = assertSession();
				const currentToolPolicy = resolveToolPolicy(current);
				if (currentToolPolicy?.sandboxRequired !== toolPolicy?.sandboxRequired || currentToolPolicy?.sandboxed !== toolPolicy?.sandboxed) denied("The session's current tool policy does not allow this operation.");
				const sharing = prepareSessionSharing({
					cfg: params.context.getRuntimeConfig(),
					client: policyClient
				}, {
					aliases: new Set(profile?.aliases ?? []),
					sessionCap: role?.sessions.others,
					isMember: (row, identity) => projection.hasMembership(row.storePath, row.storeKey, identity)
				});
				if (params.ownSessionOnly && authorizeOwnSessionMutation({
					client: policyClient,
					target: current,
					expectedProfileId: profileId,
					isCreator: sharing.isCreator
				}) || sharing.authorizeTarget(current)) denied();
			} catch (error) {
				if (error instanceof SessionAccessPreparationPendingError) throw error;
				actorRetired = true;
				throw error;
			}
		};
		const assertAccessCurrent = (assertRequestCurrent) => {
			if (invocationClosed) denied();
			assertRequestCurrent?.();
			assertRun();
			assertActor();
		};
		const assertCurrent = () => assertAccessCurrent(assertInvocationCurrent);
		const assertPreparationCurrent = () => assertAccessCurrent(assertPreparationSourceCurrent);
		const retain = (sessionOnly) => {
			assertCurrent();
			const assert = sessionOnly ? assertSession : assertActor;
			assert();
			const releaseSource = sessionOnly ? void 0 : captured?.authority.retain?.();
			const controller = new AbortController();
			const releases = [];
			let released = false;
			let preparing = false;
			const release = () => {
				if (released) return;
				released = true;
				for (const unsubscribe of releases.splice(0)) unsubscribe();
				releaseSource?.();
				controller.abort(/* @__PURE__ */ new Error("Session access borrow released"));
			};
			const check = () => {
				if (released) return;
				try {
					assert();
				} catch (error) {
					if (error instanceof SessionAccessPreparationPendingError) {
						if (!preparing) {
							preparing = true;
							Promise.resolve().then(async () => {
								if (released) return;
								await projection.prepareMembership();
								preparing = false;
								if (!released) check();
							}).catch(() => {
								preparing = false;
							});
						}
						return;
					}
					controller.abort(error);
					release();
				}
			};
			releases.push(sessionChanges.subscribe(check), onSessionIdentityMutation((change) => {
				if (change.agentId === target.agentId && change.previous.sessionId === target.sessionId && change.previous.sessionKeys.includes(target.sessionKey)) sessionRetired = true;
				check();
			}));
			if (!sessionOnly) {
				releases.push(onUserProfilesChanged(check), onOperatorRolePolicyChanged(check));
				const sourceSignal = captured?.authority.signal ?? originalGrant?.signal;
				if (sourceSignal) {
					sourceSignal.addEventListener("abort", check, { once: true });
					releases.push(() => sourceSignal.removeEventListener("abort", check));
				}
			}
			check();
			return {
				signal: controller.signal,
				assertCurrent: () => {
					controller.signal.throwIfAborted();
					assert();
				},
				release
			};
		};
		assertPreparationCurrent();
		return {
			assertPreparationCurrent,
			authority: {
				target,
				sandboxRequired,
				assertCurrent,
				retain: () => retain(false),
				retainSession: () => retain(true),
				release: () => {
					invocationClosed = true;
					captured?.release();
				}
			}
		};
	} catch (error) {
		captured?.release();
		throw error;
	}
}
//#endregion
//#region src/gateway/server-methods/method-authorization.ts
function authorizeGatewayMethod(method, client, params, methodRegistry, context) {
	if (!client?.connect || method === "health") return { error: null };
	const roleRaw = client.connect.role ?? "operator";
	const role = parseGatewayRole(roleRaw);
	if (!role) return { error: errorShape(ErrorCodes.INVALID_REQUEST, `unauthorized role: ${roleRaw}`) };
	const scopes = client.connect.scopes ?? [];
	if (!isRoleAuthorizedForMethod(role, method)) return { error: errorShape(ErrorCodes.INVALID_REQUEST, `unauthorized role: ${role}`) };
	if (role === "node") return { error: null };
	if (client.invalidated) return { error: errorShape(ErrorCodes.FORBIDDEN, "Gateway requester authority changed") };
	if (resolveGatewayOperatorRoleActor(client)?.kind === "operator") {
		const roleError = authorizeCurrentOperatorRoleScopes(client, (context.getCommittedRuntimeConfig ?? context.getRuntimeConfig)());
		if (roleError) return { error: roleError };
	}
	if (method === "device.scopes.requestUpgrade" || method === "device.scopes.waitUpgrade") return { error: null };
	if (scopes.includes("operator.admin")) return { error: null };
	const registeredScope = methodRegistry.getScope(method);
	let scopeAuth = isOperatorScope(registeredScope) ? authorizeOperatorScopesForRequiredScope(registeredScope, scopes, methodRegistry.getSessionAccess?.(method)?.allowOwnSessionScope ? "operator.sessions.write" : resolveSessionMethodScope(method, params), method) : authorizeOperatorScopesForMethod(method, scopes, params);
	if (!scopeAuth.allowed && isInProcessSessionRun(method, params)) scopeAuth = authorizeOperatorScopesForRequiredScope(scopeAuth.missingScope, scopes, "operator.sessions.write", method);
	if (!scopeAuth.allowed) {
		const runtimeIdentity = client.internal?.agentRuntimeIdentity;
		if (runtimeIdentity?.cronManagementGrant && holdsCronManagementGrant(runtimeIdentity.cronManagementGrant, runtimeIdentity, method)) return { error: null };
		const resolvedRequiredScopes = isOperatorScope(registeredScope) ? [registeredScope] : resolveLeastPrivilegeOperatorScopesForMethod(method, params);
		return { error: missingScopeErrorShape({
			missingScope: scopeAuth.missingScope,
			requiredScopes: resolvedRequiredScopes.length > 0 ? resolvedRequiredScopes : [scopeAuth.missingScope]
		}) };
	}
	return {
		error: null,
		sessionScope: scopeAuth.sessionScope
	};
}
//#endregion
//#region src/gateway/server-methods/request-authorization.ts
const STARTUP_READ_WAIT_MS = 2e4;
const startupReadMethods = /* @__PURE__ */ new Set([
	"sessions.list",
	"sessions.resolve",
	"sessions.describe",
	"models.list"
]);
function startupReadAgents(method, requestParams, cfg) {
	const refusals = listAgentDatabaseAdmissionRefusals();
	const targets = resolveDirectSessionTargets(method, requestParams);
	if (targets.length > 0) return targets.flatMap((target) => {
		const resolved = resolveRequestedSessionAgentId(cfg, target.sessionKey, target.agentId);
		return resolved.ok ? [resolved.agentId] : refusals.filter((refusal) => refusal === resolved.error.details).map(({ agentId }) => agentId);
	});
	const agentId = readSessionSharingStringParam(requestParams, "agentId");
	if (method === "models.list") {
		const resolved = resolveAgentIdOrRespondError({
			rawAgentId: agentId ?? tryResolveAmbientOwnerAgentId(cfg),
			cfg,
			respond: () => {}
		});
		return resolved ? [resolved.agentId] : [];
	}
	return agentId ? [agentId] : listAgentIds(cfg);
}
async function prepareStartupReadAgents(method, requestParams, cfg, signal) {
	const agents = startupReadAgents(method, requestParams, cfg);
	if (method === "models.list" && !readSessionSharingStringParam(requestParams, "sessionKey")) return agents;
	const targets = await Promise.all(agents.map((agentId) => prepareSqliteTargetFromSessionStorePath(resolveSessionStorePathCore(cfg.session?.store, { agentId }), {
		agentId,
		defaultAgentId: isPerAgentSessionStoreConfig(cfg.session?.store) ? agentId : resolveSessionStoreCompatibilityAgentId(cfg)
	}, signal)));
	return [.../* @__PURE__ */ new Set([...agents, ...targets.flatMap(({ agentId }) => agentId ?? [])])];
}
/** Applies the router-owned authorization fence before any transport or typed dispatch. */
async function authorizeGatewayRequestPreDispatch(params) {
	const assertPreparationCurrent = params.assertPreparationCurrent ?? params.assertInvocationCurrent;
	const signal = params.methodRegistry.isObservation(params.method) ? getAsyncWorkSignal() : void 0;
	let startupReadSignal;
	let startupReadDeadline;
	let startupReadResult;
	signal?.throwIfAborted();
	if (params.context.ensureSessionRowProjection) {
		params.markSessionSubscribePhase?.("projectionReadiness");
		await params.context.ensureSessionRowProjection();
	}
	params.markSessionSubscribePhase?.("accessFacts");
	const authorizeMethod = () => withPluginRuntimeRegistryScope(params.methodRegistry.pluginRegistry, () => authorizeGatewayMethod(params.method, params.client, params.requestParams, params.methodRegistry, params.context));
	const startupError = () => params.context.unavailableGatewayMethods?.has(params.method) ? errorShape(ErrorCodes.UNAVAILABLE, `${params.method} unavailable during gateway startup`, {
		retryable: true,
		retryAfterMs: 500,
		details: {
			...gatewayStartupUnavailableDetails(),
			method: params.method
		}
	}) : null;
	let assertChatRoutingCurrent;
	while (true) {
		signal?.throwIfAborted();
		startupReadSignal?.throwIfAborted();
		const scopeAuthorization = authorizeMethod();
		if (scopeAuthorization.error) return { error: scopeAuthorization.error };
		const uploadError = gatewayRouterUploadPolicyError(params, params.methodRegistry);
		if (uploadError) return { error: uploadError };
		const profileError = await authorizeAuthenticatedProfileForMethod({
			client: params.client,
			sessionScope: scopeAuthorization.sessionScope,
			requiresProfile: () => params.expectedProfileBinding !== void 0 || params.methodRegistry.requiresAuthenticatedProfile(params.method) || resolveDirectIncognitoTargets(params.method, params.requestParams).length > 0 || sessionMutationTargetFields(params.method).length > 0 && (params.context.getCommittedRuntimeConfig ?? params.context.getRuntimeConfig)().gateway?.roles !== void 0
		});
		if (profileError) return { error: profileError };
		try {
			params.expectedProfileBinding?.assertCurrent();
			assertPreparationCurrent?.();
		} catch (error) {
			if (error instanceof SessionMutationAuthorizationChangedError) return { error: error.error };
			throw error;
		}
		const unavailableError = startupError();
		if (unavailableError) return { error: unavailableError };
		const startup = startupReadMethods.has(params.method) && (params.method !== "sessions.list" || readSessionSharingStringParam(params.requestParams, "agentId")) ? params.context.agentDatabaseStartup : void 0;
		if (startup?.hasPendingAgents) {
			startupReadSignal ??= AbortSignal.any([
				params.signal,
				params.client?.connectionSignal,
				getAsyncWorkSignal()
			].filter((candidate) => candidate !== void 0));
			startupReadSignal.throwIfAborted();
			const cfg = params.context.getRuntimeConfig();
			const previous = startupReadResult?.cfg === cfg ? startupReadResult : void 0;
			startupReadResult = void 0;
			if (!previous || previous.timedOut) {
				const remainingMs = (startupReadDeadline ??= performance.now() + STARTUP_READ_WAIT_MS) - performance.now();
				if (remainingMs <= 0) {
					const refusal = (previous?.agents ?? startupReadAgents(params.method, params.requestParams, cfg)).map((agentId) => readAgentDatabaseAdmissionRefusal(agentId)).find(Boolean);
					if (refusal) return { error: createAgentDatabaseAdmissionErrorShape(refusal) };
					if (!previous?.agents) return { error: errorShape(ErrorCodes.UNAVAILABLE, "Session database discovery did not finish before the startup read deadline. Retry the request.", {
						retryable: true,
						retryAfterMs: 500
					}) };
				} else {
					const observation = new AbortController();
					const waitSignal = AbortSignal.any([startupReadSignal, observation.signal]);
					let agents;
					let waited = false;
					try {
						const timedOut = await raceWithTimeout(async () => {
							agents = await prepareStartupReadAgents(params.method, params.requestParams, cfg, waitSignal);
							waitSignal.throwIfAborted();
							if (params.context.getRuntimeConfig() !== cfg) return false;
							const waiting = agents.flatMap((agentId) => {
								const wait = startup.waitForAgentPreparation(agentId, { signal: waitSignal });
								return wait ? [wait] : [];
							});
							waited = waiting.length > 0;
							await Promise.all(waiting);
							return false;
						}, remainingMs, () => {
							startupReadDeadline = 0;
							return true;
						}, {
							signal: startupReadSignal,
							ref: false
						});
						if (timedOut || !waited) startupReadResult = {
							cfg,
							agents,
							timedOut
						};
					} finally {
						observation.abort();
					}
					continue;
				}
			}
		}
		if (params.method.startsWith("sessions.groups.")) {
			const { ensureSessionGroupCatalog } = await import("./session-group-catalog-Bwf6ti6j.mjs");
			await ensureSessionGroupCatalog();
			const groupProjection = getSessionRowProjection(params.context);
			if (groupProjection) do
				await groupProjection.prepareMembership();
			while (groupProjection.needsMembershipPreparation());
			params.expectedProfileBinding?.assertCurrent();
		}
		const sessionPolicy = params.methodRegistry.getSessionAccess?.(params.method);
		if (params.consumeSessionTurn && (params.method !== "chat.send" || sessionPolicy)) throw new Error("Session turn consumers require core chat.send admission");
		let requestParams = params.requestParams;
		if (params.method === "chat.send" && !sessionPolicy) {
			const cfg = params.context.getRuntimeConfig();
			const normalized = resolveChatSendAuthorizationParams(cfg, requestParams);
			if (!normalized.ok) return { error: normalized.error };
			if (!assertChatRoutingCurrent) {
				const routing = captureSessionMutationRouting(cfg, void 0, resolveDirectSessionTargets(params.method, requestParams));
				assertChatRoutingCurrent = () => routing(params.context.getRuntimeConfig());
			}
			assertChatRoutingCurrent();
			requestParams = normalized.value;
		}
		const projection = !sessionPolicy && resolveDirectSessionTargets(params.method, requestParams).length > 0 && (params.consumeSessionTurn || params.method === "chat.send" || !isGatewayAdmin(params.client)) ? getSessionRowProjection(params.context) : void 0;
		const sessionAuthorizationParams = {
			client: params.client ?? null,
			method: params.method,
			requestParams,
			context: params.context,
			sessionScope: scopeAuthorization.sessionScope
		};
		const assertSessionInvocationCurrent = () => {
			assertPreparationCurrent?.();
			assertChatRoutingCurrent?.();
		};
		const authorizeCurrent = (assertCurrent, release) => {
			const current = authorizeMethod();
			const authorizationError = current.error ?? startupError();
			if (authorizationError) {
				release?.();
				return authorizationError;
			}
			try {
				params.expectedProfileBinding?.assertCurrent();
				assertCurrent?.();
			} catch (error) {
				release?.();
				if (error instanceof SessionMutationAuthorizationChangedError) return error.error;
				throw error;
			}
			if (current.sessionScope !== scopeAuthorization.sessionScope) {
				release?.();
				return errorShape(ErrorCodes.FORBIDDEN, "Gateway requester authority changed");
			}
			return null;
		};
		const workerSessionMutation = sessionPolicy ? { error: null } : await resolveSessionMutationAuthorizationAsync({
			...sessionAuthorizationParams,
			assertInvocationCurrent: assertSessionInvocationCurrent
		});
		let transferred = false;
		try {
			const authorizeSession = () => workerSessionMutation;
			const authorizeSessionAndConsume = params.consumeSessionTurn ? (sessionRowRead) => {
				if (!sessionRowRead) return { error: errorShape(ErrorCodes.UNAVAILABLE, "Session facts are unavailable") };
				const result = authorizeSession();
				if (result.error) return result;
				const { target, consume } = params.consumeSessionTurn;
				const admitted = result.authorization?.admittedTarget;
				const row = admitted && sessionRowRead.describe({
					key: admitted.sessionKey,
					agentId: admitted.agentId
				});
				if (!admitted || admitted.sessionId !== target.sessionId || admitted.sessionKey !== target.sessionKey || target.agentId !== void 0 && admitted.agentId !== target.agentId || row?.storedEntry?.sessionId !== target.sessionId) return { error: errorShape(ErrorCodes.FORBIDDEN, "Session changed before file read") };
				const error = authorizeCurrent(() => {
					params.assertInvocationCurrent?.();
					result.authorization?.assertCurrent();
				});
				if (error) return { error };
				const value = consume(row.storedEntry);
				if (isPromiseLike(value)) {
					Promise.resolve(value).catch(() => {});
					throw new Error("Session turn authority consumers must remain synchronous");
				}
				return result;
			} : authorizeSession;
			const subscriptionAccessOnly = params.method === "sessions.messages.subscribe" && resolveDirectIncognitoTargets(params.method, params.requestParams).length === 0;
			if (projection && subscriptionAccessOnly) {
				params.markSessionSubscribePhase?.("accessFacts");
				while (projection.needsMembershipPreparation()) await projection.prepareMembership();
			}
			params.markSessionSubscribePhase?.(subscriptionAccessOnly ? "accessFacts" : "projectionReadiness");
			const sessionMutation = projection && params.consumeSessionTurn && !subscriptionAccessOnly ? await projection.withPreparedExactRows((cfg) => {
				signal?.throwIfAborted();
				assertChatRoutingCurrent?.();
				return resolveDirectSessionTargets(params.method, requestParams).flatMap((target) => {
					const agent = resolveRequestedSessionAgentId(cfg, target.sessionKey, target.agentId);
					return agent.ok ? [{
						key: target.sessionKey,
						agentId: agent.agentId
					}] : [];
				});
			}, authorizeSessionAndConsume) : authorizeSessionAndConsume();
			params.markSessionSubscribePhase?.("accessFacts");
			signal?.throwIfAborted();
			if (sessionMutation.error) {
				workerSessionMutation.authorization?.release?.();
				return { error: sessionMutation.error };
			}
			if (params.consumeSessionTurn) {
				sessionMutation.authorization?.release?.();
				return {
					error: null,
					sessionScope: scopeAuthorization.sessionScope
				};
			}
			let sessionAccessAuthority;
			if (sessionPolicy) try {
				const preparedAccess = await prepareGatewaySessionAccessAuthority({
					policy: sessionPolicy,
					requestParams: params.requestParams,
					client: params.client ?? null,
					context: params.context,
					ownSessionOnly: scopeAuthorization.sessionScope === "operator.sessions.write",
					hasCurrentClientAuthority: params.hasCurrentClientAuthority,
					assertInvocationCurrent: params.assertInvocationCurrent,
					assertPreparationCurrent
				});
				sessionAccessAuthority = preparedAccess.authority;
				params.expectedProfileBinding?.assertCurrent();
				preparedAccess.assertPreparationCurrent();
			} catch (error) {
				workerSessionMutation.authorization?.release?.();
				sessionAccessAuthority?.release();
				if (error instanceof SessionMutationAuthorizationChangedError) return { error: error.error };
				throw error;
			}
			if (params.client?.connect.role === "node" && (!params.client.connId || !await params.context.nodeRegistry.isConnectionCurrentPairingState(params.client.connId))) {
				workerSessionMutation.authorization?.release?.();
				return { error: errorShape(ErrorCodes.UNAVAILABLE, "node pairing changed before request dispatch", {
					retryable: true,
					details: { code: "PAIRING_CHANGED" }
				}) };
			}
			const error = authorizeCurrent(assertSessionInvocationCurrent, () => {
				sessionAccessAuthority?.release();
				workerSessionMutation.authorization?.release?.();
			});
			if (error) return { error };
			transferred = true;
			return {
				error: null,
				sessionScope: scopeAuthorization.sessionScope,
				...sessionAccessAuthority ? { sessionAccessAuthority } : {},
				...sessionMutation.authorization ? { sessionMutationAuthorization: sessionMutation.authorization } : {}
			};
		} finally {
			if (!transferred) workerSessionMutation.authorization?.release?.();
		}
	}
}
//#endregion
export { authorizeGatewayRequestPreDispatch as t };
