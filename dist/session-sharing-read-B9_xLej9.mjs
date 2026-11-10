import { t as isPromiseLike } from "./promise-like-D7-l5Fsp.mjs";
import { i as isIncognitoSessionKey } from "./incognito-session-key-BWpn88lo.mjs";
import "./session-key-CSDERtm3.mjs";
import { Ng as errorShape } from "./src-pLJQA6J5.mjs";
import { t as assertAdmittedRunOperatorAuthority } from "./admitted-run-context-h1ULFETN.mjs";
import { n as operatorScopeSatisfied } from "./operator-scope-compat-Ci6GBcmU.mjs";
import { t as ErrorCodes } from "./gateway-error-details-Cl-eEOTQ.mjs";
import { f as resolveOperatorRolePolicy, o as operatorSessionCap, p as resolveOperatorRolePolicyForAssignment, t as authorizeCurrentOperatorRoleScopes, u as resolveGatewayOperatorRoleActor } from "./operator-role-policy-Coro3qc5.mjs";
import { r as resolveSqliteSessionKey } from "./session-accessor.sqlite-scope-helpers-XTtpZpWK.mjs";
import { t as authenticatedProfileUnavailableError } from "./gateway-client-identity-DXWhtQve.mjs";
import { _ as resolveSessionVisibility, b as isSessionCreatorProfile, c as canManageSessionSharing, d as isGatewayAdmin, h as resolveSessionSharingRole, s as authorizeSessionSharingTarget, v as sharingIdentity, x as prepareSessionCreatorProfile } from "./session-sharing-policy-vx7GWqzs.mjs";
import { n as SessionSharingProfileFactsChangedError, t as SessionMutationAuthorizationChangedError } from "./session-mutation-authorization-error-Cdqn6r49.mjs";
import { o as prepareUserProfileRoleAuthority } from "./user-channel-identity-operations-CAjJ0iFU.mjs";
import { r as prepareGatewayRecipientProfile } from "./expected-profile-Bnus0Sst.mjs";
//#region src/gateway/session-sharing-read.ts
function sharingSnapshot(target, sessionKey) {
	return {
		visibility: target ? resolveSessionVisibility(target.entry) : "draft",
		incognito: target ? target.entry.incognito === true || isIncognitoSessionKey(target.canonicalKey) : isIncognitoSessionKey(sessionKey),
		...target ? { createdActor: target.entry.createdActor } : {}
	};
}
function canReceiveSessionEvent(params) {
	const { cfg, policyConfig = cfg, client, sessionKeys, event } = params;
	const operatorActor = resolveGatewayOperatorRoleActor(client);
	if (operatorActor?.kind === "operator" && authorizeCurrentOperatorRoleScopes(client, policyConfig)) return false;
	if (isGatewayAdmin(client)) return true;
	const identity = sharingIdentity(client, operatorActor);
	if (!identity) return (!operatorScopeSatisfied("operator.sessions.read", client.connect.scopes ?? []) || operatorActor?.kind === "system" || operatorScopeSatisfied("operator.read", client.connect.scopes ?? [])) && (!policyConfig.gateway?.roles || operatorActor?.kind === "system") && event !== "session.suggestion" && event !== "session.typing";
	const sharing = params.prepared.sharing;
	const hidesForeignSessions = sharing.sessionCap === "none";
	const resolveTarget = (sessionKey) => params.prepared.target(sessionKey, params.agentId);
	const visible = sessionKeys.every((sessionKey) => {
		const snapshot = sharingSnapshot(resolveTarget(sessionKey), sessionKey);
		const isCreator = sharing.isCreator(snapshot.createdActor);
		if (snapshot.incognito || hidesForeignSessions && !isCreator) return false;
		if (snapshot.visibility !== "draft" || isCreator) return true;
		if (event !== "session.typing") return false;
		const typingTarget = resolveTarget(sessionKey);
		return typingTarget !== null && canManageSessionSharing(sharing.roleForTarget(typingTarget));
	});
	if (!visible || event !== "session.suggestion") return visible;
	if ((params.payload && typeof params.payload === "object" ? params.payload.suggestion?.author?.id : void 0) === identity.id) return true;
	return sessionKeys.every((sessionKey) => {
		const target = resolveTarget(sessionKey);
		return target !== null && sharing.roleForTarget(target) !== "viewer";
	});
}
/** Share caller facts across synchronous selection/role projection, never across an await. */
function prepareSessionSharing(params, prepared) {
	const identity = sharingIdentity(params.client, resolveGatewayOperatorRoleActor(params.client));
	const isCreator = prepareSessionCreatorProfile(identity?.id, prepared?.aliases);
	const roleForTarget = (target, isMember) => resolveSessionSharingRole({
		...params,
		target,
		isMember: isMember ?? (prepared && Boolean(identity && prepared.isMember(target, identity.id)))
	}, prepared && { value: prepared.sessionCap }, isCreator);
	return {
		isCreator,
		sessionCap: prepared?.sessionCap,
		entryFilter: createSessionListEntryFilter(params, isCreator, prepared),
		roleForTarget,
		authorizeTarget: (target) => authorizeSessionSharingTarget({
			...params,
			target
		}, prepared && {
			value: prepared.sessionCap,
			role: roleForTarget(target)
		})
	};
}
/** Consume live authority or borrow prepared source facts in one synchronous frame. */
function createSessionSharingConsumption(params) {
	const current = {
		sharing: params.sharing,
		profiles: params.getProfiles()
	};
	return Object.assign(current, {
		policy: (cfg, members) => current.sharing || current.profiles ? prepareProjectedSessionSharing({
			cfg,
			client: params.client,
			profiles: current.profiles,
			isMember: (_target, id) => current.sharing ? current.sharing.isMember?.(id) ?? current.sharing.members.some((member) => member.identityId === id) : members?.includes(id) ?? false
		}) : void 0,
		consume: (prepared, consume, profiles = params.getProfiles()) => {
			const previous = {
				sharing: current.sharing,
				profiles: current.profiles
			};
			Object.assign(current, {
				sharing: prepared,
				profiles
			});
			try {
				profiles?.readCurrent();
				prepared?.assertCurrent();
				const result = consume();
				if (isPromiseLike(result)) throw new Error("Sharing authorization consumers must remain synchronous");
				return result;
			} finally {
				Object.assign(current, previous);
			}
		}
	});
}
/** Worker authorization also serves callers without a connection-owned profile projection. */
async function prepareSessionSharingProfiles(client, mode = "selection", options = {}) {
	const actor = resolveGatewayOperatorRoleActor(client);
	const actorKind = actor?.kind;
	const identityId = sharingIdentity(client, actor)?.id;
	const roleProfileId = actor?.kind === "operator" ? actor.profileId : void 0;
	const runAuthority = client?.internal?.operatorRunAuthority;
	const unavailable = () => {
		throw new SessionMutationAuthorizationChangedError(authenticatedProfileUnavailableError());
	};
	const requesterChanged = () => {
		throw new SessionMutationAuthorizationChangedError(errorShape(ErrorCodes.FORBIDDEN, "Gateway requester authority changed"));
	};
	const prepare = async (profileId) => {
		if (!profileId) return () => void 0;
		const retained = client?.preparedSessionProfile;
		if (retained?.aliases.has(profileId)) {
			const canonicalProfileId = retained.profileId;
			return () => {
				const current = client?.preparedSessionProfile;
				if (!current) return unavailable();
				if (!current.aliases.has(profileId) || mode === "selection" && current.profileId !== canonicalProfileId) return requesterChanged();
				return current;
			};
		}
		const prepared = await prepareUserProfileRoleAuthority(profileId, options);
		const profile = prepared && {
			...prepared,
			aliases: new Set(prepared.aliases)
		};
		return () => {
			if (prepared && !prepared.isCurrent()) {
				prepared.readSource();
				throw new SessionSharingProfileFactsChangedError(authenticatedProfileUnavailableError(), prepared.readSource);
			}
			return profile;
		};
	};
	const readProfile = await prepare(identityId);
	const readRoleProfile = roleProfileId === identityId ? readProfile : await prepare(roleProfileId);
	const readCurrent = () => {
		const currentActor = resolveGatewayOperatorRoleActor(client);
		if (currentActor?.kind !== actorKind || currentActor?.kind === "operator" && currentActor.profileId !== roleProfileId || sharingIdentity(client, currentActor)?.id !== identityId || client?.internal?.operatorRunAuthority !== runAuthority) return requesterChanged();
		if (runAuthority) {
			assertAdmittedRunOperatorAuthority(runAuthority);
			runAuthority.assertCurrent();
		}
		return {
			profile: readProfile(),
			roleProfile: readRoleProfile()
		};
	};
	readCurrent();
	return { readCurrent };
}
/** Refresh changed profile facts only before the synchronous consumer has begun effects. */
async function withCurrentSessionSharingProfiles(client, read) {
	let consumed = false;
	let readSource = () => ({});
	for (let attempt = 0;; attempt += 1) {
		const source = readSource();
		try {
			const profiles = await prepareSessionSharingProfiles(client, "custody", source);
			readSource();
			return await read(profiles, () => {
				consumed = true;
			});
		} catch (error) {
			if (consumed || attempt >= 1 || !(error instanceof SessionSharingProfileFactsChangedError)) throw error;
			readSource = error.readSource;
		}
	}
}
function createSessionSharingInputAuthority(ownedParams, authorization, readSharing) {
	const { withCurrent, withPreparedCurrent } = authorization;
	if (!withCurrent || !withPreparedCurrent) return;
	return {
		assertLifetimeCurrent: () => {},
		withCurrent: (consume) => withCurrentSessionSharingProfiles(ownedParams.client, (profiles, beginConsume) => {
			ownedParams.preparedProfiles = profiles;
			return withCurrent(() => {
				beginConsume();
				const read = readSharing();
				return consume({
					agentId: read.storageTarget.agentId,
					storePath: read.storageTarget.storePath,
					sessionKey: resolveSqliteSessionKey(read.target?.storeKey ?? read.storageTarget.canonicalKey, read.storageTarget.agentId),
					entry: read.target?.entry,
					readSource: read.target?.readSource,
					members: read.members
				}, read.assertCurrent);
			});
		}),
		withPreparedCurrent
	};
}
function prepareProjectedSessionSharing(params) {
	const { cfg, client, isMember } = params;
	if (!params.profiles && client?.internal?.syntheticClient) prepareGatewayRecipientProfile(client);
	const actor = resolveGatewayOperatorRoleActor(client);
	const identity = sharingIdentity(client, actor);
	const retained = client?.preparedSessionProfile;
	const { profile, roleProfile } = params.profiles?.readCurrent() ?? {
		profile: identity && retained?.aliases.has(identity.id) ? retained : void 0,
		roleProfile: actor?.kind === "operator" && retained?.aliases.has(actor.profileId) ? retained : void 0
	};
	const policy = actor?.kind === "system" ? void 0 : actor?.kind === "operator" && client?.internal?.operatorRunAuthority ? resolveOperatorRolePolicy(client, cfg) : resolveOperatorRolePolicyForAssignment(roleProfile?.profileId, roleProfile?.role ?? null, cfg, roleProfile?.githubLogin ?? null);
	let cacheKey;
	return {
		...prepareSessionSharing(params, {
			aliases: profile?.aliases ?? /* @__PURE__ */ new Set(),
			sessionCap: policy?.sessions.others,
			isMember
		}),
		policy,
		get cacheKey() {
			return cacheKey ??= JSON.stringify([
				actor,
				identity?.id,
				client?.authenticatedUserProfile?.profileId,
				client?.authenticatedUserId,
				Boolean(client?.authenticatedGitHubIdentitySync),
				client?.connect.scopes?.toSorted(),
				profile?.profileId,
				profile && [...profile.aliases].toSorted(),
				policy,
				Boolean(cfg.gateway?.roles)
			]);
		}
	};
}
function createSessionListEntryFilter(params, isCreator, prepared) {
	const operatorActor = resolveGatewayOperatorRoleActor(params.client);
	const identity = sharingIdentity(params.client, operatorActor);
	if (isGatewayAdmin(params.client) || !identity && operatorActor?.kind === "system") return;
	if (!identity) return params.cfg?.gateway?.roles ? () => false : void 0;
	const sessionCap = prepared ? prepared.sessionCap : params.cfg && operatorSessionCap(params.client, params.cfg);
	return createProfileSessionEntryFilter({
		profileId: identity.id,
		sessionCap
	}, isCreator);
}
function createProfileSessionEntryFilter(params, isCreator) {
	const creatorMatches = isCreator ?? ((actor) => isSessionCreatorProfile(actor, params.profileId));
	return (sessionKey, entry) => entry.incognito !== true && !isIncognitoSessionKey(sessionKey) && (creatorMatches(entry.createdActor) || params.sessionCap !== "none" && resolveSessionVisibility(entry) !== "draft");
}
//#endregion
export { createSessionSharingInputAuthority as a, prepareSessionSharingProfiles as c, createSessionSharingConsumption as i, createProfileSessionEntryFilter as n, prepareProjectedSessionSharing as o, createSessionListEntryFilter as r, prepareSessionSharing as s, canReceiveSessionEvent as t };
