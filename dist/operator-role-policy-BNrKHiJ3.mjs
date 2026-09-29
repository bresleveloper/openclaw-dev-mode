import { t as createSubsystemLogger } from "./subsystem-DleLyu58.mjs";
import { n as registerListener, t as notifyListeners } from "./listeners-BogSNJ-R.mjs";
import { t as ErrorCodes } from "./gateway-error-details-D85F07e9.mjs";
import { a as roleScopesAllow } from "./operator-scope-compat-Ci6GBcmU.mjs";
import "./user-profile-constants-DfyZS95p.mjs";
import { f as errorShape } from "./error-codes-DvB36bCj.mjs";
import { R as readUserProfileAliasRevision } from "./user-profiles-internal-BxQLnWfo.mjs";
import { a as getUserProfileRole } from "./user-profiles-BA6bh7Le.mjs";
//#region src/gateway/gateway-access-revision.ts
let revision = 0;
/** Marks Gateway access decisions stale across asynchronously yielded reads. */
function bumpGatewayAccessRevision() {
	revision += 1;
}
function readGatewayAccessRevision() {
	return revision + readUserProfileAliasRevision();
}
//#endregion
//#region src/gateway/server-methods/session-creation-provenance.ts
function resolveOperatorSessionCreation(client, options = {}) {
	if (options.allowTrustedHint && client?.internal?.sessionCreation) return client.internal.sessionCreation;
	const agentRuntimeIdentity = client?.internal?.agentRuntimeIdentity;
	if (options.allowTrustedHint && agentRuntimeIdentity?.sessionSpawnContext) return {
		via: "spawn",
		actor: {
			type: "agent",
			id: agentRuntimeIdentity.agentId
		},
		requesterSessionKey: agentRuntimeIdentity.sessionKey,
		...agentRuntimeIdentity.sessionSpawnContext.requesterProfileId ? { requesterProfileId: agentRuntimeIdentity.sessionSpawnContext.requesterProfileId } : {},
		...agentRuntimeIdentity.sessionSpawnContext.completionOwnerSessionKey ? { completionOwnerSessionKey: agentRuntimeIdentity.sessionSpawnContext.completionOwnerSessionKey } : {},
		inheritedToolPolicy: agentRuntimeIdentity.sessionSpawnContext.inheritedToolPolicy,
		...agentRuntimeIdentity.sessionSpawnContext.resolvedModel ? { resolvedModel: agentRuntimeIdentity.sessionSpawnContext.resolvedModel } : {},
		...agentRuntimeIdentity.sessionSpawnContext.spawnModelAutoSelection ? { spawnModelAutoSelection: agentRuntimeIdentity.sessionSpawnContext.spawnModelAutoSelection } : {}
	};
	const profileId = client?.authenticatedUserProfile?.profileId;
	return {
		via: "operator",
		...profileId ? { actor: {
			type: "human",
			source: "profile",
			id: profileId
		} } : {}
	};
}
function resolveAgentRunSessionCreation(client) {
	const actor = resolveOperatorSessionCreation(client).actor;
	return {
		via: "run",
		...actor ? { actor } : {}
	};
}
//#endregion
//#region src/gateway/operator-role-policy.ts
const operatorRoleLog = createSubsystemLogger("gateway/operator-roles");
const MAX_OPERATOR_ROLE_ASSIGNMENTS = 1024;
const operatorRoleAssignments = /* @__PURE__ */ new Map();
const reportedUnknownAssignments = /* @__PURE__ */ new Set();
const policyListeners = /* @__PURE__ */ new Set();
let assignmentRevision = 0;
const deniedOperatorRole = {
	sessions: { others: "none" },
	agents: [],
	scopes: []
};
function readOperatorRoleAssignment(profileId) {
	if (operatorRoleAssignments.has(profileId)) return operatorRoleAssignments.get(profileId) ?? null;
	const assignment = getUserProfileRole(profileId);
	if (operatorRoleAssignments.size >= MAX_OPERATOR_ROLE_ASSIGNMENTS) {
		const oldestProfileId = operatorRoleAssignments.keys().next().value;
		if (oldestProfileId !== void 0) {
			operatorRoleAssignments.delete(oldestProfileId);
			for (const reported of reportedUnknownAssignments) if (reported.startsWith(`${oldestProfileId}:`)) reportedUnknownAssignments.delete(reported);
		}
	}
	operatorRoleAssignments.set(profileId, assignment);
	return assignment;
}
/** Drops a changed assignment so subsequent authorization reads the durable owner. */
function invalidateOperatorRolePolicy(profileId) {
	assignmentRevision += 1;
	bumpGatewayAccessRevision();
	operatorRoleAssignments.delete(profileId);
	for (const reported of reportedUnknownAssignments) if (reported.startsWith(`${profileId}:`)) reportedUnknownAssignments.delete(reported);
	notifyListeners([...policyListeners], {
		kind: "assignment",
		profileId
	});
}
function onOperatorRolePolicyChanged(listener) {
	return registerListener(policyListeners, listener);
}
/** Called after this Gateway's committed runtime reader advances, never at tentative activation. */
function publishOperatorRoleConfigChange(context) {
	if (context) notifyListeners([...policyListeners], {
		kind: "config",
		context
	});
}
function readOperatorRolePolicyRevision() {
	return assignmentRevision;
}
/** An enabled role boundary denies missing identity and unresolvable assignments. */
function resolveOperatorRolePolicyForProfile(profileId, cfg) {
	if (!cfg.gateway?.roles || profileId === "gateway-owner") return;
	return resolveOperatorRolePolicyForAssignment(profileId, profileId ? readOperatorRoleAssignment(profileId) : null, cfg);
}
/** Transaction owners supply the authoritative row without consulting the assignment cache. */
function resolveOperatorRolePolicyForAssignment(profileId, assignedRole, cfg) {
	const roles = cfg.gateway?.roles;
	if (!roles || profileId === "gateway-owner") return;
	if (!profileId) return deniedOperatorRole;
	if (assignedRole && Object.hasOwn(roles.definitions, assignedRole)) return roles.definitions[assignedRole];
	if (assignedRole) {
		const reportKey = `${profileId}:${assignedRole}`;
		if (!reportedUnknownAssignments.has(reportKey)) {
			reportedUnknownAssignments.add(reportKey);
			operatorRoleLog.warn(`User profile ${profileId} references unknown Gateway role "${assignedRole}"; ${roles.default ? `applying default role "${roles.default}"` : "denying access"}. Update gateway.roles.definitions or clear the assignment with users.setRole.`);
		}
	}
	return (roles.default ? roles.definitions[roles.default] : void 0) ?? deniedOperatorRole;
}
/** Preserve human-derived restrictions, including ambiguous historical actors; this is not identity proof. */
function resolveCreatorSandbox(cfg, creation) {
	const actor = creation?.actor;
	return actor?.type === "human" && actor.id && resolveOperatorRolePolicyForProfile(actor.id, cfg)?.sandbox === "required" ? "required" : void 0;
}
/** Resolves the current named policy from the connection's verified profile identity. */
function resolveGatewayOperatorRoleActor(client) {
	const actor = client?.internal?.operatorRoleActor;
	if (actor) return actor;
	const profileId = client?.authenticatedUserProfile?.profileId;
	return profileId && profileId !== "gateway-owner" ? {
		kind: "operator",
		profileId
	} : void 0;
}
/** Resolves the current named policy from an authoritative operator or system actor. */
function resolveOperatorRolePolicy(client, cfg) {
	const actor = resolveGatewayOperatorRoleActor(client);
	if (actor?.kind === "system") return;
	return resolveOperatorRolePolicyForProfile(actor?.profileId, cfg);
}
/** A retained caller cannot keep grants removed by the current named role. */
function authorizeCurrentOperatorRoleScopes(client, cfg) {
	const policy = resolveOperatorRolePolicy(client, cfg);
	if (policy && !roleScopesAllow({
		role: "operator",
		requestedScopes: client?.connect.scopes ?? [],
		allowedScopes: policy.scopes
	})) return errorShape(ErrorCodes.FORBIDDEN, "Your operator role changed; reconnect before continuing.");
}
function operatorSessionCap(client, cfg) {
	return resolveOperatorRolePolicy(client, cfg)?.sessions.others;
}
function hasOperatorBoundary(client, cfg) {
	return operatorSessionCap(client, cfg) !== void 0;
}
/** Enforces the owning agent ceiling for session creation and run-start targets. */
function authorizeGatewaySessionCreation(params, prepared) {
	const actor = params.actor ?? ("client" in params ? resolveGatewayOperatorRoleActor(params.client) : void 0);
	if (actor?.kind === "system") return;
	const profileId = actor?.profileId ?? params.profileId;
	const role = prepared ? prepared.policy : resolveOperatorRolePolicyForProfile(profileId, params.cfg);
	if (!role || role.agents === "*" || role.agents.includes(params.agentId)) return;
	return errorShape(ErrorCodes.FORBIDDEN, `Your operator role cannot create sessions for agent "${params.agentId}"; choose an allowed agent or ask a gateway administrator to update your role.`);
}
/** Leave ordinary creation attribution unchanged unless the authenticated person requires isolation. */
function resolveSandboxedSessionCreation(client, cfg) {
	const creation = resolveOperatorSessionCreation(client);
	return resolveCreatorSandbox(cfg, creation) === "required" ? {
		...creation,
		sandbox: "required"
	} : void 0;
}
//#endregion
export { bumpGatewayAccessRevision as _, onOperatorRolePolicyChanged as a, readOperatorRolePolicyRevision as c, resolveOperatorRolePolicy as d, resolveOperatorRolePolicyForAssignment as f, resolveOperatorSessionCreation as g, resolveAgentRunSessionCreation as h, invalidateOperatorRolePolicy as i, resolveCreatorSandbox as l, resolveSandboxedSessionCreation as m, authorizeGatewaySessionCreation as n, operatorSessionCap as o, resolveOperatorRolePolicyForProfile as p, hasOperatorBoundary as r, publishOperatorRoleConfigChange as s, authorizeCurrentOperatorRoleScopes as t, resolveGatewayOperatorRoleActor as u, readGatewayAccessRevision as v };
