import { r as getAsyncWorkSignal } from "./async-work-scope-BYeX3gh6.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { t as isPromiseLike } from "./promise-like-D7-l5Fsp.mjs";
import { r as isIncognitoSessionKey } from "./session-key-CmZ4o9-l.mjs";
import { M as parseAgentSessionKey } from "./session-key-C09ow4h0.mjs";
import { u as withPluginRuntimeRegistryScope } from "./gateway-request-scope-BSmCVVpP.mjs";
import { a as isRuntimeToolAllowed, s as isToolAllowedByPolicyName } from "./tool-policy-match-Dn8gpf-E.mjs";
import { n as sessionChanges } from "./session-row-changes-BcJIdta8.mjs";
import { f as isOperatorScope } from "./operator-scopes-DsrPoRc4.mjs";
import "./user-profile-constants-DfyZS95p.mjs";
import { R as onUserProfilesChanged } from "./user-profiles-internal-DlO1LBbo.mjs";
import { t as ErrorCodes } from "./gateway-error-details-DIefe7Zy.mjs";
import { f as errorShape, p as missingScopeErrorShape } from "./error-codes-Dh56LniQ.mjs";
import { a as onOperatorRolePolicyChanged, d as resolveOperatorRolePolicy, t as authorizeCurrentOperatorRoleScopes, u as resolveGatewayOperatorRoleActor } from "./operator-role-policy-BqPaarjx.mjs";
import { n as captureGatewayOperatorRunAuthority } from "./operator-run-authority-BPRn5nuX.mjs";
import { o as prepareUserProfileRoleAuthority } from "./user-channel-identity-operations-COzOBly4.mjs";
import { m as withCanonicalSessionValidationDeferral } from "./session-canonical-key-D1TSJMmX.mjs";
import { r as onSessionIdentityMutation } from "./session-lifecycle-events-qdejgRzS.mjs";
import { i as gatewayStartupUnavailableDetails } from "./startup-unavailable-D0-EeFjq.mjs";
import { n as resolveSessionMethodScope } from "./session-method-scopes-base-CcbSY8lP.mjs";
import { n as authorizeOperatorScopesForMethod, r as authorizeOperatorScopesForRequiredScope, s as resolveLeastPrivilegeOperatorScopesForMethod } from "./method-scopes-BrMPjfvW.mjs";
import { s as sessionMutationTargetFields } from "./session-method-policy-B_ndZirn.mjs";
import { n as resolveRequestedSessionAgentId } from "./session-request-agent-Bxi11ET4.mjs";
import { a as getGatewayToolCallerIdentity, t as captureGatewayToolCallerAssertion } from "./gateway-caller-context-DWr-fdGt.mjs";
import { l as holdsCronManagementGrant } from "./cron-creator-authority-grant-B3kDRd63.mjs";
import { t as SessionMutationAuthorizationChangedError } from "./session-mutation-authorization-error-CCz8QGWh.mjs";
import { n as isInProcessSessionRun } from "./in-process-session-run-DJj6aWRy.mjs";
import { n as authorizeAuthenticatedProfileForMethod } from "./gateway-client-identity-DnDs09-7.mjs";
import { f as isGatewayAdmin, r as authorizeOwnSessionMutation } from "./session-sharing-policy-4QkIpHi4.mjs";
import { n as getSessionRowProjection } from "./session-row-projection-access-C2RDnj28.mjs";
import { d as prepareSessionSharing, i as resolveDirectSessionTargets, r as resolveDirectIncognitoTargets } from "./session-sharing-target-read-D_4wDbBo.mjs";
import { t as resolveSessionMutationAuthorization } from "./session-sharing-t7UPtrZq.mjs";
import { n as gatewayRouterUploadPolicyError } from "./core-handlers-DFkL5laR.mjs";
import { t as resolveSessionResourceToolPolicy } from "./session-resource-tool-policy-Ct8eb4ab.mjs";
import { n as parseGatewayRole, t as isRoleAuthorizedForMethod } from "./role-policy-DjGeFe84.mjs";
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
	assertInvocationCurrent?.();
	const input = params.requestParams;
	const sessionKey = isRecord(input) && typeof input.sessionKey === "string" ? input.sessionKey : "";
	const parsed = parseAgentSessionKey(sessionKey);
	if (!parsed || sessionKey !== sessionKey.trim() || isIncognitoSessionKey(sessionKey) || isRecord(input) && input.agentId !== void 0 && input.agentId !== parsed.agentId) denied("This operation requires a canonical, non-incognito sessionKey and its matching agentId.");
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
		assertInvocationCurrent?.();
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
		const assertCurrent = () => {
			if (invocationClosed) denied();
			assertInvocationCurrent?.();
			assertRun();
			assertActor();
		};
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
		assertCurrent();
		return {
			target,
			sandboxRequired,
			assertCurrent,
			retain: () => retain(false),
			retainSession: () => retain(true),
			release: () => {
				invocationClosed = true;
				captured?.release();
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
/** Applies the router-owned authorization fence before any transport or typed dispatch. */
async function authorizeGatewayRequestPreDispatch(params) {
	const signal = params.methodRegistry.isObservation(params.method) ? getAsyncWorkSignal() : void 0;
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
	while (true) {
		signal?.throwIfAborted();
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
		} catch (error) {
			if (error instanceof SessionMutationAuthorizationChangedError) return { error: error.error };
			throw error;
		}
		const unavailableError = startupError();
		if (unavailableError) return { error: unavailableError };
		if (params.method.startsWith("sessions.groups.")) {
			const { ensureSessionGroupCatalog } = await import("./session-group-catalog-K0lllTmS.mjs");
			await ensureSessionGroupCatalog();
			const groupProjection = getSessionRowProjection(params.context);
			if (groupProjection) do
				await groupProjection.prepareMembership();
			while (groupProjection.needsMembershipPreparation());
			params.expectedProfileBinding?.assertCurrent();
		}
		const sessionPolicy = params.methodRegistry.getSessionAccess?.(params.method);
		if (params.consumeSessionTurn && (params.method !== "chat.send" || sessionPolicy)) throw new Error("Session turn consumers require core chat.send admission");
		const projection = !sessionPolicy && resolveDirectSessionTargets(params.method, params.requestParams).length > 0 && (params.consumeSessionTurn || !isGatewayAdmin(params.client)) ? getSessionRowProjection(params.context) : void 0;
		const authorizeSession = (sessionRowRead) => sessionPolicy ? { error: null } : resolveSessionMutationAuthorization({
			client: params.client ?? null,
			method: params.method,
			requestParams: params.requestParams,
			context: params.context,
			sessionRowRead,
			sessionScope: scopeAuthorization.sessionScope
		});
		const authorizeSessionAndConsume = params.consumeSessionTurn ? (sessionRowRead) => {
			const currentAuthorization = authorizeMethod();
			const currentError = currentAuthorization.error ?? startupError();
			if (currentError) return { error: currentError };
			try {
				params.expectedProfileBinding?.assertCurrent();
				params.assertInvocationCurrent?.();
			} catch (error) {
				if (error instanceof SessionMutationAuthorizationChangedError) return { error: error.error };
				throw error;
			}
			if (currentAuthorization.sessionScope !== scopeAuthorization.sessionScope) return { error: errorShape(ErrorCodes.FORBIDDEN, "Gateway requester authority changed") };
			if (!sessionRowRead) return { error: errorShape(ErrorCodes.UNAVAILABLE, "Session facts are unavailable") };
			const result = authorizeSession(sessionRowRead);
			if (result.error) return result;
			const { target, consume } = params.consumeSessionTurn;
			const admitted = result.authorization?.admittedTarget;
			const row = admitted && sessionRowRead.describe({
				key: admitted.sessionKey,
				agentId: admitted.agentId
			});
			if (!admitted || admitted.sessionId !== target.sessionId || admitted.sessionKey !== target.sessionKey || target.agentId !== void 0 && admitted.agentId !== target.agentId || row?.storedEntry?.sessionId !== target.sessionId) return { error: errorShape(ErrorCodes.FORBIDDEN, "Session changed before file read") };
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
		const preparedSessionMutation = projection && !subscriptionAccessOnly ? await projection.withPreparedExactRows((cfg) => {
			signal?.throwIfAborted();
			return resolveDirectSessionTargets(params.method, params.requestParams).flatMap((target) => {
				const agent = resolveRequestedSessionAgentId(cfg, target.sessionKey, target.agentId);
				return agent.ok ? [{
					key: target.sessionKey,
					agentId: agent.agentId
				}] : [];
			});
		}, authorizeSessionAndConsume) : withCanonicalSessionValidationDeferral(() => authorizeSessionAndConsume());
		params.markSessionSubscribePhase?.("accessFacts");
		signal?.throwIfAborted();
		if (preparedSessionMutation.kind === "pending") {
			const { certifySessionCanonicalValidationPending } = await import("./session-canonical-validation-readiness-XoC4K97O.mjs");
			signal?.throwIfAborted();
			await certifySessionCanonicalValidationPending(preparedSessionMutation.database);
			continue;
		}
		const sessionMutation = preparedSessionMutation.value;
		if (sessionMutation.error) return { error: sessionMutation.error };
		if (params.consumeSessionTurn) return {
			error: null,
			sessionScope: scopeAuthorization.sessionScope
		};
		let sessionAccessAuthority;
		if (sessionPolicy) try {
			sessionAccessAuthority = await prepareGatewaySessionAccessAuthority({
				policy: sessionPolicy,
				requestParams: params.requestParams,
				client: params.client ?? null,
				context: params.context,
				ownSessionOnly: scopeAuthorization.sessionScope === "operator.sessions.write",
				hasCurrentClientAuthority: params.hasCurrentClientAuthority,
				assertInvocationCurrent: params.assertInvocationCurrent
			});
			params.expectedProfileBinding?.assertCurrent();
			sessionAccessAuthority.assertCurrent();
		} catch (error) {
			sessionAccessAuthority?.release();
			if (error instanceof SessionMutationAuthorizationChangedError) return { error: error.error };
			throw error;
		}
		if (params.client?.connect.role === "node" && (!params.client.connId || !await params.context.nodeRegistry.isConnectionCurrentPairingState(params.client.connId))) return { error: errorShape(ErrorCodes.UNAVAILABLE, "node pairing changed before request dispatch", {
			retryable: true,
			details: { code: "PAIRING_CHANGED" }
		}) };
		const currentAuthorization = authorizeMethod();
		const currentError = currentAuthorization.error ?? startupError();
		if (currentError) {
			sessionAccessAuthority?.release();
			return { error: currentError };
		}
		try {
			params.expectedProfileBinding?.assertCurrent();
		} catch (error) {
			sessionAccessAuthority?.release();
			if (error instanceof SessionMutationAuthorizationChangedError) return { error: error.error };
			throw error;
		}
		if (currentAuthorization.sessionScope !== scopeAuthorization.sessionScope) {
			sessionAccessAuthority?.release();
			return { error: errorShape(ErrorCodes.FORBIDDEN, "Gateway requester authority changed") };
		}
		return {
			error: null,
			sessionScope: scopeAuthorization.sessionScope,
			...sessionAccessAuthority ? { sessionAccessAuthority } : {},
			...sessionMutation.authorization ? { sessionMutationAuthorization: sessionMutation.authorization } : {}
		};
	}
}
//#endregion
export { authorizeGatewayRequestPreDispatch as t };
