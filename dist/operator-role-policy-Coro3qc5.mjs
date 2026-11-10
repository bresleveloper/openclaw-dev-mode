import { n as registerListener, t as notifyListeners } from "./listeners-BogSNJ-R.mjs";
import { t as createSubsystemLogger } from "./subsystem-mStysHHC.mjs";
import "./user-profile-constants-DfyZS95p.mjs";
import { Ng as errorShape } from "./src-pLJQA6J5.mjs";
import { m as readUserProfileAliasRevision } from "./user-profile-events-CXjmX5Qy.mjs";
import { t as assertAdmittedRunOperatorAuthority } from "./admitted-run-context-h1ULFETN.mjs";
import { a as roleScopesAllow } from "./operator-scope-compat-Ci6GBcmU.mjs";
import { t as ErrorCodes } from "./gateway-error-details-Cl-eEOTQ.mjs";
import { t as profileCatalogPath } from "./user-profile-identity.read-DXpuvx74.mjs";
import { h as readResidentUserProfileRevision, t as captureResidentUserProfileAccess } from "./user-profile-list-BdNJnrJe.mjs";
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
//#region src/gateway/operator-role-policy.ts
const operatorRoleLog = createSubsystemLogger("gateway/operator-roles");
const reportedUnknownAssignments = /* @__PURE__ */ new Set();
const policyListeners = /* @__PURE__ */ new Set();
let assignmentRevision = 0;
const deniedOperatorRole = {
	sessions: { others: "none" },
	agents: [],
	scopes: []
};
/** Publishes a committed assignment change to retained authorization consumers. */
function invalidateOperatorRolePolicy(profileId) {
	assignmentRevision += 1;
	bumpGatewayAccessRevision();
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
/** Resolve names once for both authorization and the administrative profile projection. */
function resolveOperatorRoleSelection(profileId, assignedRole, cfg, githubLogin) {
	const roles = cfg.gateway?.roles;
	if (!roles || !profileId || profileId === "gateway-owner") return { roleSource: "default" };
	if (assignedRole && Object.hasOwn(roles.definitions, assignedRole)) return {
		effectiveRole: assignedRole,
		roleSource: "assigned"
	};
	const login = githubLogin?.toLowerCase();
	if (login) {
		for (const [configuredLogin, role] of Object.entries(roles.assignments?.byGithubLogin ?? {})) if (configuredLogin.trim().toLowerCase() === login && Object.hasOwn(roles.definitions, role)) return {
			effectiveRole: role,
			roleSource: "githubLogin"
		};
	}
	return {
		effectiveRole: roles.default,
		roleSource: "default"
	};
}
/** An enabled role boundary denies missing identity and unresolvable assignments. */
function resolveOperatorRolePolicyForProfile(profileId, cfg, assignment) {
	if (!cfg.gateway?.roles || profileId === "gateway-owner") return;
	const profile = profileId && !assignment ? captureResidentUserProfileAccess(profileId).assertCurrent() : void 0;
	return resolveOperatorRolePolicyForAssignment(profileId, assignment ? assignment.role : profile?.role ?? null, cfg, profile ? profile.githubLogin ?? null : profileId && cfg.gateway.roles.assignments?.byGithubLogin ? readResidentUserProfileRevision(profileId, profileCatalogPath({}))?.githubLogin ?? null : null);
}
/** Transaction and prepared-profile owners supply the current assignment. */
function resolveOperatorRolePolicyForAssignment(profileId, assignedRole, cfg, githubLogin) {
	const roles = cfg.gateway?.roles;
	if (!roles || profileId === "gateway-owner") return;
	if (!profileId) return deniedOperatorRole;
	const selection = resolveOperatorRoleSelection(profileId, assignedRole, cfg, githubLogin);
	if (assignedRole && selection.roleSource !== "assigned") {
		const reportKey = `${profileId}:${assignedRole}`;
		if (!reportedUnknownAssignments.has(reportKey)) {
			if (reportedUnknownAssignments.size >= 1024) reportedUnknownAssignments.clear();
			reportedUnknownAssignments.add(reportKey);
			operatorRoleLog.warn(`User profile ${profileId} references unknown Gateway role "${assignedRole}"; ${selection.effectiveRole ? `applying ${selection.roleSource} role "${selection.effectiveRole}"` : "denying access"}. Update gateway.roles.definitions or clear the assignment with users.setRole.`);
		}
	}
	return (selection.effectiveRole ? roles.definitions[selection.effectiveRole] : void 0) ?? deniedOperatorRole;
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
	const authority = client?.internal?.operatorRunAuthority;
	if (actor?.kind === "operator" && authority) {
		assertAdmittedRunOperatorAuthority(authority);
		authority.assertCurrent();
		if (authority.profileId !== actor.profileId) throw new Error("Gateway requester profile changed");
		if (!cfg.gateway?.roles || authority.profileId === "gateway-owner") return;
		if (!authority.readCurrentRoleAssignment) throw new Error("Operator role assignment was not prepared");
		return resolveOperatorRolePolicyForAssignment(authority.profileId, authority.readCurrentRoleAssignment(), cfg, authority.readCurrentGithubLogin?.() ?? null);
	}
	const prepared = client?.preparedSessionProfile;
	if (actor?.kind === "operator" && prepared?.aliases.has(actor.profileId)) return resolveOperatorRolePolicyForAssignment(prepared.profileId, prepared.role, cfg, prepared.githubLogin ?? null);
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
function hasOperatorBoundary(client, cfg, prepared) {
	if ((prepared ? prepared.sessionCap : operatorSessionCap(client, cfg)) !== void 0) return true;
	if (resolveGatewayOperatorRoleActor(client)?.kind === "system") return false;
	const scopes = client?.connect?.scopes ?? [];
	return roleScopesAllow({
		role: "operator",
		requestedScopes: ["operator.sessions.read"],
		allowedScopes: scopes
	}) && !roleScopesAllow({
		role: "operator",
		requestedScopes: ["operator.read"],
		allowedScopes: scopes
	});
}
/** Enforces the owning agent ceiling for session creation and run-start targets. */
function authorizeGatewaySessionCreation(params, prepared) {
	const actor = params.actor ?? ("client" in params ? resolveGatewayOperatorRoleActor(params.client) : void 0);
	if (actor?.kind === "system") return;
	const profileId = actor?.profileId ?? params.profileId;
	const role = prepared ? prepared.policy : "client" in params ? resolveOperatorRolePolicy(params.client ?? null, params.cfg) : resolveOperatorRolePolicyForProfile(profileId, params.cfg);
	if (!role || role.agents === "*" || role.agents.includes(params.agentId)) return;
	return errorShape(ErrorCodes.FORBIDDEN, `Your operator role cannot create sessions for agent "${params.agentId}"; choose an allowed agent or ask a gateway administrator to update your role.`);
}
/** Agents the caller's named operator role allows, or undefined when the role does not restrict agents. */
function resolveOperatorRoleAgents(client, cfg) {
	const role = resolveOperatorRolePolicy(client, cfg);
	return role && role.agents !== "*" ? role.agents : void 0;
}
//#endregion
export { readGatewayAccessRevision as _, onOperatorRolePolicyChanged as a, readOperatorRolePolicyRevision as c, resolveOperatorRoleAgents as d, resolveOperatorRolePolicy as f, bumpGatewayAccessRevision as g, resolveOperatorRoleSelection as h, invalidateOperatorRolePolicy as i, resolveCreatorSandbox as l, resolveOperatorRolePolicyForProfile as m, authorizeGatewaySessionCreation as n, operatorSessionCap as o, resolveOperatorRolePolicyForAssignment as p, hasOperatorBoundary as r, publishOperatorRoleConfigChange as s, authorizeCurrentOperatorRoleScopes as t, resolveGatewayOperatorRoleActor as u };
