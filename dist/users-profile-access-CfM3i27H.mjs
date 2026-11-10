import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import "./user-profile-constants-DfyZS95p.mjs";
import { Ng as errorShape } from "./src-pLJQA6J5.mjs";
import "./operator-scopes-BO7_XQCg.mjs";
import { t as ErrorCodes } from "./gateway-error-details-Cl-eEOTQ.mjs";
import { p as resolveOperatorRolePolicyForAssignment, u as resolveGatewayOperatorRoleActor } from "./operator-role-policy-Coro3qc5.mjs";
import { o as prepareUserProfileRoleAuthority } from "./user-channel-identity-operations-CAjJ0iFU.mjs";
import { a as readGatewayRequestMutationAuthority } from "./session-mutation-guards-ClTdEKsf.mjs";
import { t as ensureProfileIdForEmail } from "./user-profile-email-DqpKPiAg.mjs";
//#region src/gateway/server-methods/users-profile-access.ts
async function prepareAuthenticatedProfile(options, includeProfile = false) {
	const { client } = options;
	const lifetime = readGatewayRequestMutationAuthority(options);
	const profileReference = client?.authenticatedUserProfile?.profileId;
	const email = client?.authenticatedUserId;
	const sync = client?.authenticatedGitHubIdentitySync;
	const provider = client?.authenticatedUserIsTailscaleProvider;
	const connectionId = client?.connId;
	const role = client?.connect.role;
	const scopes = [...client?.connect.scopes ?? []];
	const assertConnection = () => {
		lifetime.assertLifetimeCurrent();
		lifetime.expectedProfileBinding?.assertCurrent();
		if (options.client !== client || client?.connId !== connectionId || client?.connect.role !== role || scopes.some((scope) => !client?.connect.scopes?.includes(scope)) || client?.connectionSignal?.aborted || client?.authenticatedUserProfile?.profileId !== profileReference || client?.authenticatedUserId !== email || client?.authenticatedGitHubIdentitySync !== sync || client?.authenticatedUserIsTailscaleProvider !== provider) throw new Error("Gateway requester profile changed");
	};
	assertConnection();
	const legacyEmail = !profileReference && !sync && !provider ? email : void 0;
	const reference = profileReference ?? (legacyEmail ? await ensureProfileIdForEmail(legacyEmail, {}, assertConnection) : void 0);
	assertConnection();
	const profile = reference ? await prepareUserProfileRoleAuthority(reference, { includeProfile }) : void 0;
	assertConnection();
	if (legacyEmail && await ensureProfileIdForEmail(legacyEmail, {}, assertConnection) !== profile?.profileId) throw new Error("Gateway requester profile changed");
	const assertCurrent = () => {
		assertConnection();
		if (profile && !profile.isCurrent()) throw new Error("Gateway requester profile changed");
	};
	assertCurrent();
	return {
		profileId: profile?.profileId,
		listItem: profile?.listItem,
		assertCurrent
	};
}
async function prepareProfileMutationAccess(options, profileId) {
	const requester = await prepareAuthenticatedProfile(options);
	requester.assertCurrent();
	const target = options.client?.connect.scopes?.includes("operator.admin") ? void 0 : await prepareUserProfileRoleAuthority(profileId);
	const assertCurrent = () => {
		requester.assertCurrent();
		if (options.client?.connect.scopes?.includes("operator.admin") || target?.isCurrent() && requester.profileId === target.profileId) return;
		throw new Error("profile edits require the owning user or operator.admin");
	};
	try {
		assertCurrent();
		return assertCurrent;
	} catch (error) {
		options.respond(false, void 0, errorShape(ErrorCodes.FORBIDDEN, formatErrorMessage(error)));
		return;
	}
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
		const policy = actor?.kind === "system" ? void 0 : resolveOperatorRolePolicyForAssignment(sharedOwner ? authenticatedProfileId : role?.profileId, role?.role ?? null, cfg, role?.githubLogin ?? null);
		if (policy && !policy.scopes.includes("operator.admin")) throw new Error("Profile administration requires operator.admin");
	};
	assertCurrent();
	return assertCurrent;
}
//#endregion
export { prepareProfileMutationAccess as n, prepareUserProfileAdministration as r, prepareAuthenticatedProfile as t };
