import "./operator-scopes-D-CL26h0.mjs";
import { t as ErrorCodes } from "./gateway-error-details-D85F07e9.mjs";
import "./user-profile-constants-DfyZS95p.mjs";
import { f as errorShape } from "./error-codes-DvB36bCj.mjs";
import { n as ensureProfileForEmail, s as resolveUserProfileId } from "./user-profiles-CRttx6hj.mjs";
import { i as prepareUserProfileRoleAuthority } from "./user-channel-identity-operations-BY1hMzdF.mjs";
import { f as resolveOperatorRolePolicyForAssignment, u as resolveGatewayOperatorRoleActor } from "./operator-role-policy-Bt6aG_wj.mjs";
import { i as readGatewayRequestMutationAuthority } from "./session-mutation-guards-C6eaGrAi.mjs";
//#region src/gateway/server-methods/users-profile-access.ts
function resolveAuthenticatedProfileId(client) {
	if (client?.authenticatedUserProfile?.profileId) return resolveUserProfileId(client.authenticatedUserProfile.profileId);
	if (client?.authenticatedGitHubIdentitySync) return;
	const authenticatedUserId = client?.authenticatedUserId;
	if (!authenticatedUserId) return;
	if (client.authenticatedUserIsTailscaleProvider) return;
	return ensureProfileForEmail(authenticatedUserId).id;
}
function canMutateProfile(client, profileId) {
	if (client?.connect.scopes?.includes("operator.admin")) return true;
	const authenticatedProfileId = resolveAuthenticatedProfileId(client);
	return authenticatedProfileId !== void 0 && authenticatedProfileId === resolveUserProfileId(profileId);
}
function requireProfileMutationAccess(client, profileId, respond) {
	if (canMutateProfile(client, profileId)) return true;
	respond(false, void 0, errorShape(ErrorCodes.FORBIDDEN, "profile edits require the owning user or operator.admin"));
	return false;
}
async function prepareUserProfileAdministration(options) {
	const { client, context } = options;
	const lifetime = readGatewayRequestMutationAuthority(options);
	const assertLifetime = lifetime.assertLifetimeCurrent;
	assertLifetime();
	const actor = resolveGatewayOperatorRoleActor(client);
	const authenticatedProfileId = client?.authenticatedUserProfile?.profileId;
	const sharedOwner = actor === void 0 && authenticatedProfileId === "gateway-owner";
	const role = actor?.kind === "operator" && actor.profileId ? await prepareUserProfileRoleAuthority(actor.profileId) : void 0;
	const assertCurrent = () => {
		assertLifetime();
		if (options.client !== client || options.context !== context) throw new Error("Gateway requester authority changed");
		const currentActor = resolveGatewayOperatorRoleActor(client);
		if (client?.authenticatedUserProfile?.profileId !== authenticatedProfileId || currentActor?.kind !== actor?.kind || (currentActor?.kind === "operator" ? currentActor.profileId : void 0) !== (actor?.kind === "operator" ? actor.profileId : void 0)) throw new Error("Gateway requester profile changed");
		if (client?.connect && ((client.connect.role ?? "operator") !== "operator" || !client.connect.scopes?.includes("operator.admin"))) throw new Error("Profile administration requires operator.admin");
		if (actor?.kind === "operator" && (!role || !role.isCurrent())) throw new Error("Gateway administrator profile authority changed");
		lifetime.expectedProfileBinding?.assertCurrent();
		const cfg = context.getRuntimeConfig();
		const policy = actor?.kind === "system" ? void 0 : resolveOperatorRolePolicyForAssignment(sharedOwner ? authenticatedProfileId : role?.profileId, role?.role ?? null, cfg);
		if (policy && !policy.scopes.includes("operator.admin")) throw new Error("Profile administration requires operator.admin");
	};
	assertCurrent();
	return assertCurrent;
}
//#endregion
export { requireProfileMutationAccess as n, resolveAuthenticatedProfileId as r, prepareUserProfileAdministration as t };
