import { a as roleScopesAllow, n as operatorScopeSatisfied, t as intersectOperatorScopes } from "./operator-scope-compat-Ci6GBcmU.mjs";
import { d as resolveOperatorRolePolicy, f as resolveOperatorRolePolicyForAssignment, p as resolveOperatorRolePolicyForProfile } from "./operator-role-policy-BqPaarjx.mjs";
import { o as prepareUserProfileRoleAuthority } from "./user-channel-identity-operations-COzOBly4.mjs";
import { i as hasCurrentGatewayOperatorAccess } from "./operator-access-policy-DIBw5efa.mjs";
import { a as readGatewayRequestMutationAuthority } from "./session-mutation-guards-CxCbIrod.mjs";
import { n as isSyntheticGatewayCaller, t as isIneligiblePersonalGatewayCaller } from "./gateway-personal-caller-CPQUGI4q.mjs";
import { a as isGatewayClientProfilePending } from "./gateway-client-identity-DnDs09-7.mjs";
import { i as loadGatewaySessionEntryReadOnly } from "./session-utils-store-BX-eWQU_.mjs";
import { l as createSessionListEntryFilter } from "./session-sharing-target-read-D_4wDbBo.mjs";
import { t as resolveSessionMutationAuthorization } from "./session-sharing-t7UPtrZq.mjs";
import { s as resolvePersonalGitHubOwner } from "./user-github-connections-spLT1Bzo.mjs";
import { a as GitHubPublicationSessionChangedError } from "./github-publication-failure-3qOmYAmh.mjs";
import "./session-utils-CwljFiKR.mjs";
//#region src/gateway/server-methods/github-personal-authorization.ts
/** Intersect the live role ceiling with the socket grant, preserving scope implications. */
function currentGitHubClient(options, scope, owner) {
	const { client, context } = options;
	if (options.signal?.aborted || client?.invalidated || client?.connectionSignal?.aborted || !hasCurrentGatewayOperatorAccess(client?.internal?.operatorAccessAuthority) || client?.connId && !isSyntheticGatewayCaller(client) && !context.getClientConnIds?.((current) => current === client).has(client.connId)) throw new Error("GitHub request connection is no longer current; reconnect and try again.");
	if (!client) return null;
	if (isGatewayClientProfilePending(client)) throw new Error("Authenticated profile verification is unavailable; retry the request.");
	const cfg = context.getRuntimeConfig();
	const profileId = typeof owner === "string" ? owner : owner?.profileId;
	const policy = typeof owner === "object" ? resolveOperatorRolePolicyForAssignment(owner.profileId, owner.role, cfg, owner.githubLogin ?? null) : profileId ? resolveOperatorRolePolicyForProfile(profileId, cfg) : resolveOperatorRolePolicy(client, cfg);
	const granted = client.connect.scopes ?? [];
	const scopes = policy ? intersectOperatorScopes(granted, policy.scopes) : granted;
	if (client.connect.role !== "operator" || !roleScopesAllow({
		role: "operator",
		requestedScopes: [scope],
		allowedScopes: scopes
	})) throw new Error(`GitHub requires current ${scope} permission.`);
	return {
		...client,
		connect: {
			...client.connect,
			scopes
		},
		...profileId && client.authenticatedUserProfile ? { authenticatedUserProfile: {
			...client.authenticatedUserProfile,
			profileId
		} } : {}
	};
}
/** Shared reads do not require a person; absence never substitutes for failed authentication. */
async function prepareGitHubPublicationOptionsRead(options, { sessionKey, agentId: requestedAgentId }) {
	const targetDiscoveryCache = /* @__PURE__ */ new Map();
	const authority = readGatewayRequestMutationAuthority(options);
	const client = options.client;
	const profileReference = client?.authenticatedUserProfile?.profileId;
	const userId = client?.authenticatedUserId;
	const access = client?.internal?.operatorAccessAuthority;
	const assertConnection = () => {
		authority.assertCurrent();
		if (client?.authenticatedUserProfile?.profileId !== profileReference || client?.authenticatedUserId !== userId || client?.internal?.operatorAccessAuthority !== access) throw new Error("GitHub profile changed; retry publication options.");
	};
	assertConnection();
	currentGitHubClient(options, "operator.sessions.read");
	const profile = profileReference ? await prepareUserProfileRoleAuthority(profileReference) : void 0;
	assertConnection();
	if (profileReference && !profile) throw new Error("Authenticated profile verification is unavailable; retry the request.");
	const currentClient = () => {
		assertConnection();
		if (profile && !profile.isCurrent()) throw new Error("GitHub profile changed; retry publication options.");
		return currentGitHubClient(options, "operator.sessions.read", profile);
	};
	const eligibleClient = currentClient();
	const personal = !eligibleClient?.connId || isIneligiblePersonalGatewayCaller(eligibleClient) || !operatorScopeSatisfied("operator.read", eligibleClient.connect.scopes ?? []) ? { kind: "ineligible" } : !profile ? { kind: "absent" } : {
		kind: "eligible",
		action: preparePersonalGitHubAction(options)
	};
	const readSession = (key, agentId) => {
		const loaded = loadGatewaySessionEntryReadOnly(key, {
			agentId,
			targetDiscoveryCache
		});
		const filter = createSessionListEntryFilter({
			cfg: options.context.getRuntimeConfig(),
			client: currentClient()
		});
		return loaded.entry && filter?.(loaded.canonicalKey, loaded.entry) !== false ? {
			sessionId: loaded.entry.sessionId,
			sessionKey: loaded.canonicalKey,
			agentId: loaded.agentId,
			lifecycleRevision: loaded.entry.lifecycleRevision ?? null,
			archivedAt: loaded.entry.archivedAt ?? null
		} : null;
	};
	const session = readSession(sessionKey, requestedAgentId);
	if (!session) throw new Error("GitHub publication session was not found.");
	const readCurrent = () => {
		const current = readSession(session.sessionKey, session.agentId);
		if (!current || current.sessionId !== session.sessionId || current.lifecycleRevision !== session.lifecycleRevision) throw new Error("GitHub publication session access changed; select the session again.");
		return current;
	};
	return {
		personal,
		session,
		sessionScoped: authority.sessionScope === "operator.sessions.read",
		currentSession: readCurrent,
		assertSessionUnchanged: (snapshot) => {
			if (readCurrent().archivedAt !== snapshot.archivedAt) throw new Error("GitHub publication session access changed; select the session again.");
		}
	};
}
/** Authority stays in this direct connection closure; a profile or request id alone grants nothing. */
function preparePersonalGitHubAction(options, scope = "operator.read") {
	const { client, context } = options;
	const resolveOwner = () => {
		if (!client?.connId || client.connect?.role !== "operator" || isIneligiblePersonalGatewayCaller(client) || options.signal?.aborted || !context.getClientConnIds?.((current) => current === client).has(client.connId)) throw new Error("My GitHub requires a current authenticated human Gateway connection.");
		const profile = client.authenticatedUserProfile?.profileId;
		const owner = profile ? resolvePersonalGitHubOwner(profile) : void 0;
		if (!owner) throw new Error("My GitHub requires a verified durable user profile; sign in and try again.");
		currentGitHubClient(options, scope, owner);
		return owner;
	};
	const owner = resolveOwner();
	return {
		owner,
		assertCurrent: () => {
			if (resolveOwner() !== owner) throw new Error("My GitHub owner changed; retry from your current profile.");
		}
	};
}
function preparePersonalGitHubSessionAction(options, { sessionKey, agentId }) {
	const action = preparePersonalGitHubAction(options, "operator.write");
	const targetDiscoveryCache = /* @__PURE__ */ new Map();
	const initial = loadGatewaySessionEntryReadOnly(sessionKey, {
		agentId,
		targetDiscoveryCache
	});
	if (!initial.entry?.sessionId) throw new Error("GitHub publication session was not found.");
	const sessionId = initial.entry.sessionId;
	const lifecycleRevision = initial.entry.lifecycleRevision ?? null;
	const assertCurrent = () => {
		action.assertCurrent();
		const current = loadGatewaySessionEntryReadOnly(initial.canonicalKey, {
			agentId: initial.agentId,
			targetDiscoveryCache
		});
		if (current.entry?.sessionId !== sessionId || (current.entry.lifecycleRevision ?? null) !== lifecycleRevision || current.entry.archivedAt !== void 0 || current.canonicalKey !== initial.canonicalKey) throw new GitHubPublicationSessionChangedError();
		const { error } = resolveSessionMutationAuthorization({
			client: currentGitHubClient(options, "operator.write", action.owner),
			method: "sessions.github.publish",
			requestParams: {
				sessionKey: initial.canonicalKey,
				agentId: initial.agentId
			},
			context: options.context
		});
		if (error) throw new Error(error.message);
	};
	assertCurrent();
	return {
		...action,
		assertCurrent,
		sessionId,
		lifecycleRevision,
		sessionKey: initial.canonicalKey,
		agentId: initial.agentId
	};
}
//#endregion
export { preparePersonalGitHubAction as n, preparePersonalGitHubSessionAction as r, prepareGitHubPublicationOptionsRead as t };
