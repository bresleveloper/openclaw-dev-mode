import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { m as resolveConfiguredAgentId, p as resolveAmbientOwnerAgentId } from "./agent-scope-config-CDYpzA0r.mjs";
import { r as isIncognitoSessionKey } from "./session-key-CmZ4o9-l.mjs";
import { M as parseAgentSessionKey } from "./session-key-C09ow4h0.mjs";
import { g as resolveSessionAgentId } from "./agent-scope-CG17uXFn.mjs";
import { n as resolvePersistedSessionStoreOwnerForKey } from "./session-store-owner-CnfJSmam.mjs";
import { r as resolveAgentMainSessionKey } from "./main-session-00MgEWj5.mjs";
import { t as ErrorCodes } from "./gateway-error-details-DIefe7Zy.mjs";
import { f as errorShape } from "./error-codes-Dh56LniQ.mjs";
import { n as authorizeGatewaySessionCreation, o as operatorSessionCap, u as resolveGatewayOperatorRoleActor } from "./operator-role-policy-BqPaarjx.mjs";
import { n as resolveSessionMethodScope } from "./session-method-scopes-base-CcbSY8lP.mjs";
import { a as isSessionProfileDependentMethod, i as isRequiredSessionTargetMethod, t as isAgentRunStartMethod } from "./session-method-policy-B_ndZirn.mjs";
import { n as resolveRequestedSessionAgentId } from "./session-request-agent-Bxi11ET4.mjs";
import { i as resolveSessionStoreIdentity } from "./session-store-key-Ci099tm9.mjs";
import { t as SessionMutationAuthorizationChangedError } from "./session-mutation-authorization-error-CCz8QGWh.mjs";
import { a as isGatewayClientProfilePending, i as gatewayClientSessionCreator, t as authenticatedProfileUnavailableError } from "./gateway-client-identity-DnDs09-7.mjs";
import { o as resolveGatewaySessionStoreTarget, s as resolveGatewaySessionStoreTargetWithStore } from "./session-utils-store-lookup-D3SOcr8y.mjs";
import { _ as resolveSessionSharingTarget, b as isSessionCreatorProfile, d as hiddenSessionNotFound, f as isGatewayAdmin, n as authorizeIncognitoSessionTarget, o as authorizeSessionAgentRun, r as authorizeOwnSessionMutation, s as authorizeSessionSharingTarget, y as sharingIdentity } from "./session-sharing-policy-4QkIpHi4.mjs";
import { n as getSessionRowProjection } from "./session-row-projection-access-C2RDnj28.mjs";
import { a as resolveSessionMutationTargets, i as resolveDirectSessionTargets, l as createSessionListEntryFilter, n as readSessionMutationTarget, o as resolveTalkSessionTargetInput, r as resolveDirectIncognitoTargets, t as readProjectedSessionMutationTarget, u as prepareProjectedSessionSharing } from "./session-sharing-target-read-D_4wDbBo.mjs";
//#region src/talk/agent-target.ts
/** Agent-scoped keys own their Talk session; legacy/unscoped aliases use the Talk target. */
function resolveTalkSessionAgentId(config, sessionKey) {
	const normalizedSessionKey = sessionKey ?? void 0;
	const scopedAgentId = parseAgentSessionKey(normalizedSessionKey)?.agentId;
	if (scopedAgentId) return normalizeAgentId(scopedAgentId);
	return resolvePersistedSessionStoreOwnerForKey(config, normalizedSessionKey).kind === "none" ? resolveAmbientOwnerAgentId(config, config.talk?.agentId, {
		surface: "Talk session ownership",
		hint: "Set talk.agentId to the agent that owns unscoped Talk sessions."
	}) : resolveSessionAgentId({
		config,
		sessionKey: normalizedSessionKey
	});
}
//#endregion
//#region src/gateway/talk/session-target.ts
function requirePreparedTalkSessionTarget(target) {
	if (!target) throw new Error("Talk session target was not prepared by the Gateway");
	return target;
}
/** Resolve Talk ownership before aliases collapse, then retain the exact storage target. */
function prepareTalkSessionTarget(cfg, requestedSessionKey) {
	const requestedKey = normalizeOptionalString(requestedSessionKey);
	const owner = resolveTalkSessionAgentId(cfg, requestedKey ?? "main");
	const sessionKey = requestedKey ?? resolveAgentMainSessionKey({
		cfg,
		agentId: owner
	});
	const { agentId, canonicalKey, storePath } = resolveTalkSessionStorageTarget(cfg, sessionKey, owner);
	return Object.freeze({
		agentId,
		sessionKey,
		canonicalKey,
		storePath
	});
}
/** Revalidate a retained owner without consulting the current ambient Talk default. */
function assertTalkSessionStorageTarget(cfg, target) {
	const current = resolveTalkSessionStorageTarget(cfg, target.canonicalKey, target.agentId);
	if (current.agentId !== target.agentId || current.canonicalKey !== target.canonicalKey || current.storePath !== target.storePath) throw new Error("Talk session storage target changed; retry the request");
}
function resolveTalkSessionStorageTarget(cfg, sessionKey, owner) {
	const { agentId, canonicalKey } = resolveSessionStoreIdentity({
		cfg,
		sessionKey,
		agentId: resolveConfiguredAgentId(cfg, owner)
	});
	return {
		agentId,
		canonicalKey,
		storePath: resolveGatewaySessionStoreTargetWithStore({
			cfg,
			key: canonicalKey,
			agentId,
			readOnly: true,
			exactRead: true
		}).storePath
	};
}
//#endregion
//#region src/gateway/session-sharing.ts
function sessionMutationTargetChanged(method, sessionKey) {
	return new SessionMutationAuthorizationChangedError(errorShape(ErrorCodes.INVALID_REQUEST, `session changed before ${method}; retry the request`, { details: {
		code: "SESSION_MUTATION_AUTHORIZATION_CHANGED",
		method,
		sessionKey
	} }));
}
function expectedSessionMutationTargetError(expected, target, method) {
	return expected && (!target || target.agentId !== expected.agentId || target.canonicalKey !== expected.sessionKey || target.storePath !== expected.storePath || target.entry.sessionId?.trim() !== expected.sessionId) ? sessionMutationTargetChanged(method, expected.sessionKey).error : null;
}
const VISIBILITY_AUTHORIZED_METHODS = /* @__PURE__ */ new Set(["sessions.assignOwner"]);
function resolveSessionMutationAuthorization(params) {
	const authorizesAgentRun = isAgentRunStartMethod(params.method, params.requestParams);
	const authorizesRead = resolveSessionMethodScope(params.method, params.requestParams) === "operator.sessions.read";
	const patch = params.method === "sessions.patchMany" && isRecord(params.requestParams) ? params.requestParams.patch : params.method === "sessions.patch" ? params.requestParams : void 0;
	const requiresArchiveOwnership = isRecord(patch) && typeof patch.archived === "boolean";
	const bindsProgressLifecycle = params.method === "progressCard.put" || params.method === "progressCard.refresh";
	const adminBypass = isGatewayAdmin(params.client) && !authorizesAgentRun;
	if (adminBypass && !bindsProgressLifecycle && !params.expectedTarget) return { error: null };
	if (!adminBypass && isGatewayClientProfilePending(params.client) && isSessionProfileDependentMethod(params.method)) return { error: authenticatedProfileUnavailableError() };
	if (params.method === "sessions.describe") {
		const projection = params.sessionRowRead ?? getSessionRowProjection(params.context);
		if (projection) {
			const { cfg, policyConfig } = projection.state;
			for (const target of resolveDirectSessionTargets(params.method, params.requestParams)) {
				const agent = resolveRequestedSessionAgentId(cfg, target.sessionKey, target.agentId);
				if (!agent.ok) return { error: agent.error };
				const row = projection.describe({
					key: target.sessionKey,
					agentId: agent.agentId
				});
				const sharing = prepareProjectedSessionSharing({
					cfg: policyConfig,
					client: params.client,
					isMember: (_target, identityId) => row?.membership.has(identityId) ?? false
				});
				if (row && gatewayClientSessionCreator(params.client) && sharing.sessionCap === "none" && !sharing.isCreator(row.entry.createdActor)) return { error: hiddenSessionNotFound(target.sessionKey) };
			}
		}
		return { error: null };
	}
	if (params.method === "sessions.list") return { error: null };
	let cachedCfg;
	const getCfg = () => cachedCfg ??= params.context.getRuntimeConfig();
	const getPolicyConfig = () => params.context.getCommittedRuntimeConfig?.() ?? getCfg();
	const authorizeTargetAccess = (cfg, target, projection) => {
		const identity = sharingIdentity(params.client, resolveGatewayOperatorRoleActor(params.client));
		return authorizesRead ? createSessionListEntryFilter({
			cfg,
			client: params.client
		})?.(target.storeKey, target.entry) === false ? hiddenSessionNotFound(target.canonicalKey) : null : authorizeSessionSharingTarget({
			cfg,
			client: params.client,
			target,
			requireOwner: requiresArchiveOwnership,
			isMember: projection ? Boolean(identity && projection.hasMembership(target.storePath, target.storeKey, identity.id)) : void 0
		});
	};
	const createLookupCaches = () => ({
		storeCache: /* @__PURE__ */ new Map(),
		targetDiscoveryCache: /* @__PURE__ */ new Map()
	});
	let lookupCaches;
	const resolveAuthorizedTarget = (targetRef, targetCount) => readSessionMutationTarget({
		...params,
		cfg: getCfg(),
		targetRef,
		targetCount,
		lookupCaches: () => lookupCaches ??= createLookupCaches()
	});
	let talkInput;
	let talkSessionTarget;
	try {
		talkInput = resolveTalkSessionTargetInput(params.method, params.requestParams, params.client?.connId);
		if (talkInput?.kind === "relay") {
			assertTalkSessionStorageTarget(getCfg(), talkInput.target);
			talkSessionTarget = talkInput.target;
		} else talkSessionTarget = talkInput && prepareTalkSessionTarget(getCfg(), talkInput.sessionKey);
	} catch (error) {
		return { error: errorShape(ErrorCodes.INVALID_REQUEST, String(error instanceof Error ? error.message : error)) };
	}
	const talkTargets = talkSessionTarget ? [{
		sessionKey: talkSessionTarget.canonicalKey,
		agentId: talkSessionTarget.agentId
	}] : void 0;
	const directTargets = talkTargets ?? resolveDirectSessionTargets(params.method, params.requestParams);
	const hidesForeignSessions = !adminBypass && directTargets.length > 0 && gatewayClientSessionCreator(params.client) && operatorSessionCap(params.client, getPolicyConfig()) === "none";
	const protectedTargets = hidesForeignSessions ? directTargets : talkTargets?.filter((target) => isIncognitoSessionKey(target.sessionKey)) ?? resolveDirectIncognitoTargets(params.method, params.requestParams);
	for (const targetRef of protectedTargets) {
		const resolved = resolveAuthorizedTarget(targetRef, protectedTargets.length);
		if ("error" in resolved) return { error: resolved.error };
		const target = resolved.target;
		const error = authorizeIncognitoSessionTarget({
			client: params.client,
			sessionKey: targetRef.sessionKey,
			target
		});
		if (error) return { error };
		if (hidesForeignSessions && target && !isSessionCreatorProfile(target.entry.createdActor, params.client?.authenticatedUserProfile?.profileId)) return { error: hiddenSessionNotFound(targetRef.sessionKey) };
	}
	const bindsOwnProfile = params.sessionScope === "operator.sessions.write";
	const actor = resolveGatewayOperatorRoleActor(params.client);
	const ownSessionProfileId = bindsOwnProfile && actor?.kind === "operator" ? actor.profileId : void 0;
	const ownProfileError = bindsOwnProfile ? ownSessionProfileId ? authorizeOwnSessionMutation({
		client: params.client,
		target: null,
		expectedProfileId: ownSessionProfileId
	}) : authenticatedProfileUnavailableError() : null;
	if (ownProfileError) return { error: ownProfileError };
	const requestedCreateKey = params.requestParams && typeof params.requestParams === "object" && "key" in params.requestParams ? normalizeOptionalString(params.requestParams.key) : void 0;
	const permitsGeneratedSession = params.method === "sessions.create" && !requestedCreateKey;
	const targetRefs = talkTargets ?? resolveSessionMutationTargets({
		method: params.method,
		requestParams: params.requestParams,
		context: params.context
	}) ?? (bindsOwnProfile && !isRequiredSessionTargetMethod(params.method) ? [] : void 0);
	if (params.expectedTarget && targetRefs?.length !== 1) return { error: sessionMutationTargetChanged(params.method, params.expectedTarget.sessionKey).error };
	if (!targetRefs) {
		if (isRequiredSessionTargetMethod(params.method)) return { error: errorShape(ErrorCodes.INVALID_REQUEST, "session mutation target is unavailable", { details: {
			code: "SESSION_MUTATION_TARGET_REQUIRED",
			method: params.method
		} }) };
		return { error: null };
	}
	if (talkSessionTarget && authorizesAgentRun) {
		const error = authorizeGatewaySessionCreation({
			cfg: getCfg(),
			client: params.client,
			agentId: talkSessionTarget.agentId
		});
		if (error) return { error };
	}
	const authorizedTargets = [];
	for (const targetRef of targetRefs) {
		const resolved = resolveAuthorizedTarget(targetRef, targetRefs.length);
		if ("error" in resolved) return { error: resolved.error };
		const target = resolved.target;
		if (bindsOwnProfile && (params.method === "sessions.patch" || params.method === "sessions.patchMany") && !target) return { error: hiddenSessionNotFound(targetRef.sessionKey) };
		const error = expectedSessionMutationTargetError(params.expectedTarget, target, params.method) ?? authorizeOwnSessionMutation({
			client: params.client,
			target,
			expectedProfileId: ownSessionProfileId
		}) ?? (target && authorizesAgentRun ? authorizeSessionAgentRun({
			cfg: getPolicyConfig(),
			client: params.client,
			target
		}) : null) ?? authorizeIncognitoSessionTarget({
			client: params.client,
			sessionKey: targetRef.sessionKey,
			target
		}) ?? (target && !(VISIBILITY_AUTHORIZED_METHODS.has(params.method) && (operatorSessionCap(params.client, getPolicyConfig()) ?? "write") === "write") ? authorizeTargetAccess(getPolicyConfig(), target, resolved.projection) : null);
		if (error) return { error };
		authorizedTargets.push({
			...targetRef,
			projection: resolved.projection,
			resolved: target ? {
				agentId: target.agentId,
				canonicalKey: target.canonicalKey,
				storeKey: target.storeKey,
				storePath: target.storePath,
				readSource: resolved.preparedReadSource
			} : null,
			sessionId: target?.entry.sessionId?.trim() || null,
			...!target && ["sessions.send", "sessions.create"].includes(params.method) ? { absentTarget: resolveGatewaySessionStoreTarget({
				cfg: getCfg(),
				key: targetRef.sessionKey,
				agentId: targetRef.agentId
			}) } : {},
			...bindsProgressLifecycle || bindsOwnProfile ? { lifecycleRevision: target?.entry.lifecycleRevision } : {}
		});
	}
	return {
		error: null,
		authorization: (() => {
			const targetChanged = (sessionKey) => sessionMutationTargetChanged(params.method, sessionKey);
			const assertTalkTargetCurrent = (cfg) => {
				if (!talkInput || !talkSessionTarget) return;
				let current;
				try {
					if (talkInput.kind === "relay") {
						if (!talkInput.isCurrent()) throw targetChanged(talkSessionTarget.sessionKey);
						assertTalkSessionStorageTarget(cfg, talkSessionTarget);
						current = talkSessionTarget;
					} else current = prepareTalkSessionTarget(cfg, talkInput.sessionKey);
				} catch {
					throw targetChanged(talkSessionTarget.sessionKey);
				}
				if (current.agentId !== talkSessionTarget.agentId || current.sessionKey !== talkSessionTarget.sessionKey || current.canonicalKey !== talkSessionTarget.canonicalKey || current.storePath !== talkSessionTarget.storePath) throw targetChanged(talkSessionTarget.sessionKey);
				const error = authorizesAgentRun && authorizeGatewaySessionCreation({
					cfg: params.context.getCommittedRuntimeConfig?.() ?? cfg,
					client: params.client,
					agentId: current.agentId
				});
				if (error) throw new SessionMutationAuthorizationChangedError(error);
			};
			const assertTargetCurrent = (targetRef, expected, currentCfg, currentLookupCaches, ensuredSessionId) => {
				if (expected?.absentTarget && !expected.created) {
					const currentRoute = resolveGatewaySessionStoreTarget({
						cfg: currentCfg,
						key: targetRef.sessionKey,
						agentId: targetRef.agentId
					});
					if (currentRoute.agentId !== expected.absentTarget.agentId || currentRoute.canonicalKey !== expected.absentTarget.canonicalKey || currentRoute.storePath !== expected.absentTarget.storePath) throw targetChanged(targetRef.sessionKey);
				}
				if (expected?.projection && getSessionRowProjection(params.context) !== expected.projection) throw targetChanged(targetRef.sessionKey);
				const projected = expected?.projection ? readProjectedSessionMutationTarget(targetRef, currentCfg, expected.projection) : void 0;
				if (expected?.projection && projected?.status === "unavailable") throw targetChanged(targetRef.sessionKey);
				const current = projected?.status === "ready" ? projected.target : resolveSessionSharingTarget({
					cfg: currentCfg,
					sessionKey: targetRef.sessionKey,
					agentId: targetRef.agentId,
					...currentLookupCaches,
					exactRead: Boolean(expected?.resolved?.readSource) || !currentLookupCaches || authorizedTargets.length === 1
				});
				const ensuredTarget = talkSessionTarget && authorizesAgentRun && expected?.sessionId === null && ensuredSessionId ? {
					agentId: talkSessionTarget.agentId,
					canonicalKey: talkSessionTarget.canonicalKey,
					storeKey: talkSessionTarget.canonicalKey,
					storePath: talkSessionTarget.storePath
				} : void 0;
				const expectedResolved = expected?.resolved ?? ensuredTarget;
				const expectedReadSource = expected?.resolved?.readSource;
				const expectedSessionId = expected?.sessionId ?? (ensuredTarget ? ensuredSessionId : null);
				if (!(expected !== void 0 && (current === null ? expected.resolved === null && !ensuredSessionId : expectedResolved !== void 0 && expectedResolved !== null && current.agentId === expectedResolved.agentId && current.canonicalKey === expectedResolved.canonicalKey && current.storeKey === expectedResolved.storeKey && (expectedReadSource ? current.readSource?.databaseIdentity === expectedReadSource.databaseIdentity && current.readSource.databaseBirthtime === expectedReadSource.databaseBirthtime && current.readSource.agentId === expectedReadSource.agentId : current.storePath === expectedResolved.storePath) && (current.entry.sessionId?.trim() || null) === expectedSessionId && (!(bindsProgressLifecycle || bindsOwnProfile || expected.created) || current.entry.lifecycleRevision === expected.lifecycleRevision)))) throw targetChanged(targetRef.sessionKey);
				const ownershipError = authorizeOwnSessionMutation({
					client: params.client,
					target: current,
					expectedProfileId: ownSessionProfileId
				});
				if (ownershipError) throw new SessionMutationAuthorizationChangedError(ownershipError);
				if (!current) return;
				const policyConfig = params.context.getCommittedRuntimeConfig?.() ?? currentCfg;
				const visibilityAuthorized = VISIBILITY_AUTHORIZED_METHODS.has(params.method) && (operatorSessionCap(params.client, policyConfig) ?? "write") === "write";
				const error = (authorizesAgentRun ? authorizeSessionAgentRun({
					cfg: policyConfig,
					client: params.client,
					target: current
				}) : null) ?? authorizeIncognitoSessionTarget({
					client: params.client,
					sessionKey: targetRef.sessionKey,
					target: current
				}) ?? (visibilityAuthorized ? null : authorizeTargetAccess(policyConfig, current, projected?.status === "ready" ? expected?.projection : void 0));
				if (error) throw new SessionMutationAuthorizationChangedError(error);
			};
			let createdSessionRecorded = false;
			return {
				...talkSessionTarget ? { talkSessionTarget } : {},
				...authorizedTargets.length === 1 && authorizedTargets[0]?.resolved && authorizedTargets[0].sessionId ? { admittedTarget: Object.freeze({
					agentId: authorizedTargets[0].resolved.agentId,
					sessionKey: authorizedTargets[0].resolved.canonicalKey,
					sessionId: authorizedTargets[0].sessionId
				}) } : {},
				recordCreatedSession: (created) => {
					if (createdSessionRecorded) return;
					let expected = authorizedTargets.find((target) => target.sessionId === null && target.absentTarget?.agentId === created.agentId && target.absentTarget.canonicalKey === created.sessionKey && target.absentTarget.storePath === created.storePath);
					if (!expected && permitsGeneratedSession) {
						expected = {
							sessionKey: created.sessionKey,
							agentId: created.agentId,
							resolved: null,
							sessionId: null
						};
						authorizedTargets.push(expected);
					}
					if (!expected) return;
					createdSessionRecorded = true;
					expected.resolved = {
						agentId: created.agentId,
						canonicalKey: created.sessionKey,
						storeKey: created.sessionKey,
						storePath: created.storePath
					};
					expected.sessionId = created.sessionId;
					expected.lifecycleRevision = created.lifecycleRevision;
					expected.created = true;
				},
				assertCurrent: () => {
					const error = ownSessionProfileId ? authorizeOwnSessionMutation({
						client: params.client,
						target: null,
						expectedProfileId: ownSessionProfileId
					}) : null;
					if (error) throw new SessionMutationAuthorizationChangedError(error);
					const currentCfg = params.context.getRuntimeConfig();
					assertTalkTargetCurrent(currentCfg);
					const currentLookupCaches = createLookupCaches();
					for (const authorized of authorizedTargets) assertTargetCurrent(authorized, authorized, currentCfg, currentLookupCaches);
				},
				assertTargetCurrent: (targetRef) => {
					const sessionKey = normalizeOptionalString(targetRef.sessionKey);
					const agentId = normalizeOptionalString(targetRef.agentId);
					const normalizedTarget = {
						sessionKey: sessionKey ?? targetRef.sessionKey,
						agentId
					};
					const expected = authorizedTargets.find((target) => target.sessionKey === sessionKey && target.agentId === agentId);
					const currentCfg = params.context.getRuntimeConfig();
					assertTalkTargetCurrent(currentCfg);
					assertTargetCurrent(normalizedTarget, expected, currentCfg, void 0, targetRef.ensuredSessionId);
				}
			};
		})()
	};
}
//#endregion
export { resolveTalkSessionAgentId as a, requirePreparedTalkSessionTarget as i, assertTalkSessionStorageTarget as n, prepareTalkSessionTarget as r, resolveSessionMutationAuthorization as t };
