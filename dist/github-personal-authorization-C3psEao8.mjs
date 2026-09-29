import { a as roleScopesAllow } from "./operator-scope-compat-Ci6GBcmU.mjs";
import { s as resolvePersonalGitHubOwner } from "./user-github-connections-Bepgzp4W.mjs";
import { d as resolveOperatorRolePolicy, p as resolveOperatorRolePolicyForProfile } from "./operator-role-policy-BNrKHiJ3.mjs";
import { i as loadGatewaySessionEntryReadOnly } from "./session-utils-store-DDuAGjCc.mjs";
import { E as createSessionListEntryFilter, it as isSyntheticGatewayCaller, rt as isIneligiblePersonalGatewayCaller, t as resolveSessionMutationAuthorization, tt as isGatewayClientProfilePending } from "./session-sharing-C4w_but1.mjs";
import "./session-utils-CJ7A982R.mjs";
import { i as GitHubPublicationSessionChangedError } from "./github-publication-failure-B1jd4XaP.mjs";
//#region src/gateway/server-methods/github-personal-authorization.ts
/** Intersect the live role ceiling with the socket grant, preserving scope implications. */
function currentGitHubClient(options, scope, owner) {
	const { client, context } = options;
	if (options.signal?.aborted || client?.connId && !isSyntheticGatewayCaller(client) && !context.getClientConnIds?.((current) => current === client).has(client.connId)) throw new Error("GitHub request connection is no longer current; reconnect and try again.");
	if (!client) return null;
	if (isGatewayClientProfilePending(client)) throw new Error("Authenticated profile verification is unavailable; retry the request.");
	const cfg = context.getRuntimeConfig();
	const policy = owner ? resolveOperatorRolePolicyForProfile(owner, cfg) : resolveOperatorRolePolicy(client, cfg);
	const granted = client.connect.scopes ?? [];
	const scopes = policy ? [.../* @__PURE__ */ new Set([...granted, ...policy.scopes])].filter((candidate) => [granted, policy.scopes].every((allowedScopes) => roleScopesAllow({
		role: "operator",
		requestedScopes: [candidate],
		allowedScopes
	}))) : granted;
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
		...owner && client.authenticatedUserProfile ? { authenticatedUserProfile: {
			...client.authenticatedUserProfile,
			profileId: owner
		} } : {}
	};
}
/** Shared reads do not require a person; absence never substitutes for failed authentication. */
function prepareGitHubPublicationOptionsRead(options, { sessionKey, agentId: requestedAgentId }) {
	const targetDiscoveryCache = /* @__PURE__ */ new Map();
	const resolveEligibility = () => {
		currentGitHubClient(options, "operator.read");
		const client = options.client;
		if (!client?.connId || isIneligiblePersonalGatewayCaller(client)) return { kind: "ineligible" };
		if (!client.authenticatedUserProfile) return { kind: "absent" };
		return {
			kind: "eligible",
			action: preparePersonalGitHubAction(options)
		};
	};
	const personal = resolveEligibility();
	const currentClient = () => {
		const current = resolveEligibility();
		if (current.kind !== personal.kind || current.kind === "eligible" && personal.kind === "eligible" && current.action.owner !== personal.action.owner) throw new Error("GitHub profile changed; retry publication options.");
		return currentGitHubClient(options, "operator.read", current.kind === "eligible" ? current.action.owner : void 0);
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
			lifecycleRevision: loaded.entry.lifecycleRevision ?? null
		} : null;
	};
	const session = readSession(sessionKey, requestedAgentId);
	if (!session) throw new Error("GitHub publication session was not found.");
	return {
		personal,
		session,
		currentSession: () => {
			const current = readSession(session.sessionKey, session.agentId);
			if (!current || current.sessionId !== session.sessionId || current.lifecycleRevision !== session.lifecycleRevision) throw new Error("GitHub publication session access changed; select the session again.");
			return session;
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
