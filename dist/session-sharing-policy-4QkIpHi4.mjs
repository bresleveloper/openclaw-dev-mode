import { n as ok, t as err } from "./result-BQGgYouL.mjs";
import { r as isIncognitoSessionKey } from "./session-key-CmZ4o9-l.mjs";
import "./session-key-C09ow4h0.mjs";
import "./user-profile-constants-DfyZS95p.mjs";
import { n as operatorScopeSatisfied } from "./operator-scope-compat-Ci6GBcmU.mjs";
import { u as readUserProfileAliases } from "./user-profile-list-CtETKur7.mjs";
import { t as ErrorCodes } from "./gateway-error-details-DIefe7Zy.mjs";
import { f as errorShape } from "./error-codes-Dh56LniQ.mjs";
import { d as resolveOperatorRolePolicy, n as authorizeGatewaySessionCreation, o as operatorSessionCap, u as resolveGatewayOperatorRoleActor } from "./operator-role-policy-BqPaarjx.mjs";
import { s as sessionCreatorProfileId } from "./session-entry-provenance-Bfs2J1E7.mjs";
import { n as isSessionMember } from "./sessions-DNhLX2Ep.mjs";
import { a as isGatewayClientProfilePending, t as authenticatedProfileUnavailableError } from "./gateway-client-identity-DnDs09-7.mjs";
import { t as findCanonicalStoreMatch } from "./session-utils-store-selection-DW7mpK3L.mjs";
import { a as prepareGatewaySessionStoreTargetsReadOnly, s as resolveGatewaySessionStoreTargetWithStore } from "./session-utils-store-lookup-D3SOcr8y.mjs";
//#region src/gateway/session-creator.ts
/** Namespace qualification precedes aliases; responsibility and participation never grant access. */
function isSessionCreatorProfile(actor, profileId) {
	return prepareSessionCreatorProfile(profileId)(actor);
}
/** One read-only synchronous fan-out only; prepare again after awaits or profile/storage changes. */
function prepareSessionCreatorProfile(profileId, aliases) {
	let callerAliases = aliases;
	return (actor) => {
		const creatorId = sessionCreatorProfileId(actor);
		return Boolean(creatorId && profileId && (creatorId === profileId || (callerAliases ??= readUserProfileAliases(profileId)).has(creatorId)));
	};
}
//#endregion
//#region src/gateway/session-sharing-policy.ts
function resolveSessionVisibility(entry) {
	return entry.visibility ?? "shared";
}
/** Compare access facts only after the caller has preserved the canonical target. */
function hasSessionReadAccessChanged(previous, current) {
	return !previous?.sessionId?.trim() || previous.sessionId !== current.sessionId || previous.lifecycleRevision !== current.lifecycleRevision || sessionCreatorProfileId(previous.createdActor) !== sessionCreatorProfileId(current.createdActor) || resolveSessionVisibility(previous) !== resolveSessionVisibility(current) || previous.incognito === true !== (current.incognito === true);
}
function isGatewayAdmin(client) {
	return client?.connect?.scopes?.includes("operator.admin") === true;
}
function allowedSessionVisibilities(cfg) {
	const policy = cfg.session?.sharing;
	return [
		"shared",
		...policy?.readOnly === false ? [] : ["read-only"],
		...policy?.suggest === false ? [] : ["suggest"],
		...policy?.drafts === false ? [] : ["draft"]
	];
}
function isSessionVisibilityAllowed(cfg, visibility) {
	return allowedSessionVisibilities(cfg).includes(visibility);
}
function resolveSessionSharingTarget(params) {
	return toSessionSharingTarget(resolveGatewaySessionStoreTargetWithStore({
		cfg: params.cfg,
		key: params.sessionKey,
		agentId: params.agentId,
		clone: false,
		projection: "list",
		readConsistency: "latest",
		exactRead: params.exactRead ?? !params.storeCache,
		...params.storeCache ? { storeCache: params.storeCache } : {},
		...params.targetDiscoveryCache ? { targetDiscoveryCache: params.targetDiscoveryCache } : {}
	}));
}
function toSessionSharingTarget(target) {
	const match = findCanonicalStoreMatch(target.store, target.storeKeys);
	return match ? {
		agentId: target.agentId,
		canonicalKey: target.canonicalKey,
		entry: match.entry,
		storeKey: match.key,
		storeKeys: target.storeKeys,
		storePath: target.storePath,
		readSource: target.capturedReadSource
	} : null;
}
/** Prepare one synchronous batch while retaining each target's failure for ordered consumption. */
function prepareSessionSharingTargets(params) {
	return prepareGatewaySessionStoreTargetsReadOnly({
		cfg: params.cfg,
		targets: params.targets.map(({ sessionKey, agentId }) => ({
			key: sessionKey,
			agentId
		})),
		projection: "list"
	}).map((result) => {
		if (!result.ok) return result;
		try {
			return ok(toSessionSharingTarget(result.value));
		} catch (error) {
			return err(error);
		}
	});
}
function sharingIdentity(client, actor) {
	const operator = actor?.kind === "operator" ? { id: actor.profileId } : void 0;
	const profile = client?.authenticatedUserProfile;
	const identity = profile ? { id: profile.profileId } : operator;
	return identity?.id === "gateway-owner" ? void 0 : identity;
}
function resolveSessionSharingRole(params, preparedCap, isCreator) {
	if (isGatewayAdmin(params.client)) return "admin";
	const operatorActor = resolveGatewayOperatorRoleActor(params.client);
	const identity = sharingIdentity(params.client, operatorActor);
	if (!identity) return params.client?.authenticatedGitHubIdentitySync || params.cfg?.gateway?.roles && operatorActor?.kind !== "system" ? "viewer" : "owner";
	if ((isCreator ?? prepareSessionCreatorProfile(identity.id))(params.target.entry.createdActor)) return "owner";
	const sessionCap = preparedCap ? preparedCap.value : params.cfg && operatorSessionCap(params.client, params.cfg);
	if (sessionCap === "write" && resolveSessionVisibility(params.target.entry) !== "draft" && params.target.entry.incognito !== true && !isIncognitoSessionKey(params.target.canonicalKey)) return "member";
	if (sessionCap === "none") return "viewer";
	return params.isMember ?? isSessionMember({
		agentId: params.target.agentId,
		sessionKey: params.target.storeKey,
		storePath: params.target.storePath
	}, identity.id) ? "member" : "viewer";
}
function canManageSessionSharing(role) {
	return role === "admin" || role === "owner";
}
function hiddenSessionNotFound(sessionKey, incognito = false) {
	const label = incognito ? "Incognito session" : "Session";
	return errorShape(ErrorCodes.INVALID_REQUEST, `${label} "${sessionKey}" was not found.`);
}
function isIncognitoSessionTarget(params) {
	return params.target ? params.target.entry.incognito === true || isIncognitoSessionKey(params.target.canonicalKey) : isIncognitoSessionKey(params.sessionKey);
}
function isResolvedIncognitoSession(params) {
	return isIncognitoSessionTarget({
		sessionKey: params.sessionKey,
		target: resolveSessionSharingTarget(params)
	});
}
function authorizeIncognitoSessionTarget(params) {
	if (!isIncognitoSessionTarget(params)) return null;
	if (isGatewayAdmin(params.client)) return null;
	if (isGatewayClientProfilePending(params.client)) return authenticatedProfileUnavailableError();
	if (!sharingIdentity(params.client, resolveGatewayOperatorRoleActor(params.client))) return null;
	return hiddenSessionNotFound(params.sessionKey, true);
}
function canAccessIncognitoSession(params) {
	if (isGatewayAdmin(params.client)) return true;
	return authorizeIncognitoSessionTarget({
		client: params.client,
		sessionKey: params.sessionKey,
		target: resolveSessionSharingTarget(params)
	}) === null;
}
function authorizeResolvedSessionMutation(params) {
	return authorizeSessionMutationTarget(params, () => resolveSessionSharingTarget(params));
}
/** Prepared facts carry no decision; current caller and configuration still determine access. */
function authorizePreparedSessionMutation(params, facts, prepared) {
	return authorizeSessionMutationTarget(params, () => facts.target, {
		...prepared,
		membership: facts.membership
	});
}
function authorizeSessionMutationTarget(params, readTarget, prepared) {
	if (isGatewayAdmin(params.client) && !params.cfg.gateway?.roles) return null;
	if (isGatewayClientProfilePending(params.client)) return authenticatedProfileUnavailableError();
	const target = readTarget();
	if (target) {
		const agentError = authorizeSessionAgentRun({
			cfg: params.cfg,
			client: params.client,
			target
		}, prepared);
		if (agentError) return agentError;
	}
	if (isGatewayAdmin(params.client)) return null;
	const incognitoError = authorizeIncognitoSessionTarget({
		client: params.client,
		sessionKey: params.sessionKey,
		target
	});
	if (incognitoError) return incognitoError;
	if (!target) return null;
	const sharing = {
		cfg: params.cfg,
		client: params.client,
		target
	};
	if (!prepared) return authorizeSessionSharingTarget(sharing);
	const identity = sharingIdentity(params.client, resolveGatewayOperatorRoleActor(params.client));
	const cap = { value: prepared.policy?.sessions.others };
	return authorizeSessionSharingTarget(sharing, {
		...cap,
		role: resolveSessionSharingRole({
			...sharing,
			isMember: Boolean(identity && prepared.membership.has(identity.id))
		}, cap, prepareSessionCreatorProfile(identity?.id, prepared.aliases))
	});
}
/** Narrow mutation admission never borrows write access from sharing or membership. */
function authorizeOwnSessionMutation(params) {
	if (params.expectedProfileId === void 0) return null;
	const actor = resolveGatewayOperatorRoleActor(params.client);
	return actor?.kind === "operator" && actor.profileId.trim() && operatorScopeSatisfied("operator.sessions.write", params.client?.connect?.scopes ?? []) && actor.profileId === params.expectedProfileId && (!params.target || (params.isCreator ? params.isCreator(params.target.entry.createdActor) : isSessionCreatorProfile(params.target.entry.createdActor, actor.profileId))) ? null : errorShape(ErrorCodes.FORBIDDEN, "Session-scoped writes require your own session.");
}
function authorizeSessionAgentRun(params, prepared) {
	const agentError = authorizeGatewaySessionCreation({
		cfg: params.cfg,
		client: params.client,
		agentId: params.target.agentId
	}, prepared);
	if (agentError) return agentError;
	if (params.cfg.gateway?.roles && params.target.entry?.sandbox !== "required" && (prepared ? prepared.policy : resolveOperatorRolePolicy(params.client, params.cfg))?.sandbox === "required") return errorShape(ErrorCodes.FORBIDDEN, `Your operator role requires a sandboxed session; create a new session instead of running in "${params.target.canonicalKey}".`);
	return null;
}
function authorizeSessionSharingTarget(params, prepared) {
	const visibility = resolveSessionVisibility(params.target.entry);
	const sessionCap = prepared ? prepared.value : params.cfg && operatorSessionCap(params.client, params.cfg);
	const role = prepared?.role ?? resolveSessionSharingRole(params, { value: sessionCap });
	if (sessionCap === "none" && role !== "owner" && role !== "admin") return hiddenSessionNotFound(params.target.canonicalKey);
	if (params.requireOwner && !canManageSessionSharing(role)) return errorShape(ErrorCodes.FORBIDDEN, "Only the session creator or an admin can archive or restore this session.");
	return (visibility === "draft" ? canManageSessionSharing(role) : role !== "viewer" || visibility === "shared" && !(sessionCap === "view" || sessionCap === "suggest")) ? null : errorShape(ErrorCodes.INVALID_REQUEST, `session is ${visibility} for this connection`, { details: {
		code: "SESSION_PARTICIPATION_REQUIRED",
		sessionKey: params.target.canonicalKey,
		visibility
	} });
}
//#endregion
export { resolveSessionSharingTarget as _, authorizeResolvedSessionMutation as a, isSessionCreatorProfile as b, canAccessIncognitoSession as c, hiddenSessionNotFound as d, isGatewayAdmin as f, resolveSessionSharingRole as g, prepareSessionSharingTargets as h, authorizePreparedSessionMutation as i, canManageSessionSharing as l, isSessionVisibilityAllowed as m, authorizeIncognitoSessionTarget as n, authorizeSessionAgentRun as o, isResolvedIncognitoSession as p, authorizeOwnSessionMutation as r, authorizeSessionSharingTarget as s, allowedSessionVisibilities as t, hasSessionReadAccessChanged as u, resolveSessionVisibility as v, prepareSessionCreatorProfile as x, sharingIdentity as y };
