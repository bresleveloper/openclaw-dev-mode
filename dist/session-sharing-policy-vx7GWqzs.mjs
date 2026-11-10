import { i as isIncognitoSessionKey } from "./incognito-session-key-BWpn88lo.mjs";
import "./session-key-CSDERtm3.mjs";
import "./user-profile-constants-DfyZS95p.mjs";
import { Ng as errorShape } from "./src-pLJQA6J5.mjs";
import { c as resolveSessionStorePathCore } from "./paths-YgcBNLgG.mjs";
import { n as operatorScopeSatisfied } from "./operator-scope-compat-Ci6GBcmU.mjs";
import { t as ErrorCodes } from "./gateway-error-details-Cl-eEOTQ.mjs";
import { f as readResidentUserProfileAliases } from "./user-profile-list-BdNJnrJe.mjs";
import { f as resolveOperatorRolePolicy, n as authorizeGatewaySessionCreation, o as operatorSessionCap, u as resolveGatewayOperatorRoleActor } from "./operator-role-policy-Coro3qc5.mjs";
import { m as sessionCreatorProfileId } from "./session-entry-lineage-B7Mubzwj.mjs";
import { a as resolveSessionStoreIdentity } from "./session-store-key-DKpto8R6.mjs";
import { a as isGatewayClientProfilePending, t as authenticatedProfileUnavailableError } from "./gateway-client-identity-DXWhtQve.mjs";
import { n as captureSessionSharingMemoryFacts, r as readSessionSharingMemoryFacts, t as SessionMutationFactsUnavailableError } from "./session-sharing-incognito-DepuXzQy.mjs";
import { i as resolveGatewaySessionStoreTargetWithStoreAsync, o as withGatewaySessionStoreTarget, s as withQualifiedGatewaySessionStoreTarget } from "./session-utils-store-lookup-DlW2SGlr.mjs";
import { t as findCanonicalStoreMatch } from "./session-utils-store-selection-DIMLgaMc.mjs";
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
		return Boolean(creatorId && profileId && (creatorId === profileId || (callerAliases ??= readResidentUserProfileAliases(profileId)).has(creatorId)));
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
function captureSessionSharingIncognitoTarget(params) {
	if (!isIncognitoSessionKey(params.sessionKey)) return;
	const { agentId, canonicalKey } = resolveSessionStoreIdentity(params);
	const storePath = resolveSessionStorePathCore(params.cfg.session?.store, { agentId });
	return readSessionSharingMemoryFacts({
		agentId,
		sessionKey: canonicalKey,
		resolved: { storePath }
	});
}
function resolveIncognitoSessionSharingTarget(params) {
	return captureSessionSharingIncognitoTarget(params)?.target ?? null;
}
async function resolveSessionSharingTargetAsync(params) {
	const captured = captureSessionSharingIncognitoTarget(params);
	if (captured) return captured.target;
	const target = await resolveGatewaySessionStoreTargetWithStoreAsync({
		cfg: params.cfg,
		key: params.sessionKey,
		agentId: params.agentId,
		clone: false,
		projection: "list",
		readConsistency: "latest",
		exactRead: params.exactRead ?? !params.storeCache,
		...params.storeCache ? { storeCache: params.storeCache } : {},
		...params.targetDiscoveryCache ? { targetDiscoveryCache: params.targetDiscoveryCache } : {}
	});
	if (target.capturedReadSource) params.onReadSource?.(target.capturedReadSource);
	return toSessionSharingTarget(target);
}
/** Fresh entry and membership consumed under the existing physical reader owner. */
async function withSessionSharingTarget(params, consume, retainedSelection) {
	if (isIncognitoSessionKey(params.sessionKey)) {
		const { agentId, canonicalKey } = resolveSessionStoreIdentity(params);
		let active = true;
		const facts = captureSessionSharingMemoryFacts({
			agentId,
			sessionKey: canonicalKey,
			resolved: { storePath: resolveSessionStorePathCore(params.cfg.session?.store, { agentId }) }
		}, () => {
			if (!active) throw new SessionMutationFactsUnavailableError();
		});
		try {
			const { target, members } = facts.readCurrent();
			return await consume({
				target,
				storageTarget: {
					agentId,
					canonicalKey,
					storePath: facts.location.path
				},
				members,
				assertCurrent: facts.assertCurrent
			});
		} finally {
			active = false;
		}
	}
	const read = (selected, membership, assertCurrent, _related, selection) => {
		const target = toSessionSharingTarget(selected);
		return consume({
			selection,
			target,
			storageTarget: {
				agentId: selected.agentId,
				canonicalKey: selected.canonicalKey,
				storePath: selected.storePath
			},
			members: target ? membership.get(target.storeKey) ?? [] : [],
			assertCurrent
		});
	};
	if (retainedSelection) return withQualifiedGatewaySessionStoreTarget({
		target: retainedSelection.target,
		logicalStorePath: retainedSelection.logicalStorePath,
		env: retainedSelection.env,
		preparedSource: retainedSelection.source,
		includeMembership: true,
		readOptions: { snapshotFields: [] },
		consume: (target, membership, assertCurrent) => read(target, membership, assertCurrent, [], retainedSelection)
	});
	return withGatewaySessionStoreTarget({
		cfg: params.cfg,
		key: params.sessionKey,
		agentId: params.agentId,
		projection: "list",
		includeMembership: true
	}, read);
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
	if (params.isMember === void 0) throw new SessionMutationFactsUnavailableError();
	return params.isMember ? "member" : "viewer";
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
function isResolvedIncognitoSession(params, target) {
	return isIncognitoSessionTarget({
		sessionKey: params.sessionKey,
		target
	});
}
function authorizeIncognitoSessionTarget(params) {
	if (!isIncognitoSessionTarget(params)) return null;
	if (isGatewayAdmin(params.client)) return null;
	if (isGatewayClientProfilePending(params.client)) return authenticatedProfileUnavailableError();
	if (!sharingIdentity(params.client, resolveGatewayOperatorRoleActor(params.client))) return null;
	return hiddenSessionNotFound(params.sessionKey, true);
}
async function authorizeResolvedSessionMutationAsync(params) {
	if (isGatewayAdmin(params.client) && !params.cfg.gateway?.roles) return null;
	if (isGatewayClientProfilePending(params.client)) return authenticatedProfileUnavailableError();
	const { prepareSessionSharingProfiles, prepareProjectedSessionSharing } = await import("./session-sharing-read-B-L8AusG.mjs");
	const profiles = await prepareSessionSharingProfiles(params.client);
	return withSessionSharingTarget(params, ({ target, members, assertCurrent }) => {
		assertCurrent();
		const sharing = prepareProjectedSessionSharing({
			...params,
			profiles,
			isMember: (_target, identityId) => members.some((member) => member.identityId === identityId)
		});
		return authorizePreparedSessionMutation(params, {
			target,
			membership: new Set(members.map((member) => member.identityId))
		}, {
			policy: sharing.policy,
			aliases: profiles.readCurrent().profile?.aliases ?? /* @__PURE__ */ new Set()
		});
	});
}
/** Prepared facts carry no decision; current caller and configuration still determine access. */
function authorizePreparedSessionMutation(params, facts, prepared) {
	const authorizesAgentRun = prepared.authorizesAgentRun !== false;
	if (isGatewayAdmin(params.client) && (!authorizesAgentRun || !params.cfg.gateway?.roles)) return null;
	if (isGatewayClientProfilePending(params.client)) return authenticatedProfileUnavailableError();
	const target = facts.target;
	if (target && authorizesAgentRun) {
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
	const identity = sharingIdentity(params.client, resolveGatewayOperatorRoleActor(params.client));
	const cap = { value: prepared.policy?.sessions.others };
	return authorizeSessionSharingTarget(sharing, {
		...cap,
		role: resolveSessionSharingRole({
			...sharing,
			isMember: Boolean(identity && facts.membership.has(identity.id))
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
	if (params.requireOwner && !canManageSessionSharing(role)) return errorShape(ErrorCodes.FORBIDDEN, `Only the session creator or an admin can ${params.ownerAction ?? "archive or restore this session"}.`);
	return (visibility === "draft" ? canManageSessionSharing(role) : role !== "viewer" || visibility === "shared" && !(sessionCap === "view" || sessionCap === "suggest")) ? null : errorShape(ErrorCodes.INVALID_REQUEST, `session is ${visibility} for this connection`, { details: {
		code: "SESSION_PARTICIPATION_REQUIRED",
		sessionKey: params.target.canonicalKey,
		visibility
	} });
}
//#endregion
export { resolveSessionVisibility as _, authorizeResolvedSessionMutationAsync as a, isSessionCreatorProfile as b, canManageSessionSharing as c, isGatewayAdmin as d, isResolvedIncognitoSession as f, resolveSessionSharingTargetAsync as g, resolveSessionSharingRole as h, authorizePreparedSessionMutation as i, hasSessionReadAccessChanged as l, resolveIncognitoSessionSharingTarget as m, authorizeIncognitoSessionTarget as n, authorizeSessionAgentRun as o, isSessionVisibilityAllowed as p, authorizeOwnSessionMutation as r, authorizeSessionSharingTarget as s, allowedSessionVisibilities as t, hiddenSessionNotFound as u, sharingIdentity as v, prepareSessionCreatorProfile as x, withSessionSharingTarget as y };
