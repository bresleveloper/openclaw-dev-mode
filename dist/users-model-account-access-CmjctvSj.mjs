import { f as ModelAccountConnectAuthorityError } from "./openclaw-state-worker-error-B93Lf_P2.mjs";
import { W as isUserModelAuthProfileId } from "./user-model-account-authority-DFFjC5J5.mjs";
import { t as splitTrailingAuthProfile } from "./model-ref-profile-BNjB2hED.mjs";
import { s as SESSION_WRITE_SCOPE, u as WRITE_SCOPE } from "./operator-scopes-BO7_XQCg.mjs";
import { a as roleScopesAllow } from "./operator-scope-compat-Ci6GBcmU.mjs";
import { w as UserProfileNotFoundError } from "./user-profiles-internal-CBUpoSHj.mjs";
import { p as resolveOperatorRolePolicyForAssignment } from "./operator-role-policy-Coro3qc5.mjs";
import { t as hasCurrentPersonalGatewaySource } from "./gateway-personal-caller-BLfLqLHg.mjs";
import { a as isGatewayClientProfilePending } from "./gateway-client-identity-DXWhtQve.mjs";
import { c as prepareUserProfileSelectionAuthority, o as prepareUserProfileRoleAuthority, s as prepareUserProfileRolePolicyAuthority } from "./user-channel-identity-operations-CAjJ0iFU.mjs";
import { a as prepareUserModelAccountAuthority } from "./user-model-account-operations-DIqTwy80.mjs";
import { a as readGatewayRequestMutationAuthority } from "./session-mutation-guards-ClTdEKsf.mjs";
import { t as ensureProfileIdForEmail } from "./user-profile-email-DqpKPiAg.mjs";
//#region src/gateway/server-methods/users-model-account-access.ts
/** Capture human authority once; every later privileged use rechecks this exact connection. */
async function prepareUserModelAccountAction(options, profileId, requiredScope = WRITE_SCOPE) {
	const { client, context } = options;
	const profileReference = client?.authenticatedUserProfile?.profileId;
	const userReference = client?.authenticatedUserId;
	const connectionId = client?.connId;
	const assertConnectionCurrent = () => {
		if (!hasCurrentPersonalGatewaySource(client, context) || client.connId !== connectionId || client.invalidated || client.connectionSignal?.aborted || client.connect.role !== "operator" || options.signal?.aborted || isGatewayClientProfilePending(client) || client.authenticatedUserProfile?.profileId !== profileReference || client.authenticatedUserId !== userReference) throw new ModelAccountConnectAuthorityError();
	};
	assertConnectionCurrent();
	const actorReference = profileReference ?? (userReference && !client?.authenticatedGitHubIdentitySync && !client?.authenticatedUserIsTailscaleProvider ? await ensureProfileIdForEmail(userReference, {}, assertConnectionCurrent) : void 0);
	const actorIdentity = actorReference ? await (profileReference ? prepareUserProfileRolePolicyAuthority(actorReference) : prepareUserProfileRoleAuthority(actorReference)) : void 0;
	assertConnectionCurrent();
	if (!actorIdentity) throw new ModelAccountConnectAuthorityError();
	const actor = actorIdentity.profileId;
	if (!profileReference && userReference && await ensureProfileIdForEmail(userReference, {}, assertConnectionCurrent) !== actor) throw new ModelAccountConnectAuthorityError();
	const ownerReference = profileId ?? actor;
	const ownerIdentity = ownerReference === actor || ownerReference === actorReference ? actorIdentity : await prepareUserProfileSelectionAuthority(ownerReference);
	assertConnectionCurrent();
	if (!ownerIdentity) throw new UserProfileNotFoundError(ownerReference);
	const owner = ownerIdentity.profileId;
	const assertCurrent = (roles) => {
		assertConnectionCurrent();
		if (!actorIdentity.isCurrent() || !ownerIdentity.isCurrent()) throw new ModelAccountConnectAuthorityError();
		const scope = actor === owner ? requiredScope : "operator.admin";
		const assignment = roles?.find((entry) => entry.profileId === actor);
		if (roles && !assignment) throw new ModelAccountConnectAuthorityError();
		const role = resolveOperatorRolePolicyForAssignment(actor, assignment ? assignment.role : actorIdentity.role, context.getRuntimeConfig(), actorIdentity.githubLogin ?? null);
		if (![client?.connect.scopes ?? [], ...role ? [role.scopes] : []].every((allowedScopes) => roleScopesAllow({
			role: "operator",
			requestedScopes: [scope],
			allowedScopes
		}))) throw new ModelAccountConnectAuthorityError();
	};
	assertCurrent();
	return {
		owner,
		actorProfileId: actor,
		assertCurrent
	};
}
/** Preview and commit share the same self-owned selection; scope follows the requested action. */
async function preparePersonalModelAccountSelection(options, authProfileId, requiredScope = "operator.write") {
	const action = await prepareUserModelAccountAction(options, void 0, requiredScope);
	const account = await prepareUserModelAccountAuthority({
		profileId: action.owner,
		authProfileId
	});
	const assertCurrent = () => {
		action.assertCurrent();
		if (!account?.isCurrent()) throw new ModelAccountConnectAuthorityError();
	};
	assertCurrent();
	return {
		owner: action.owner,
		authProfileId,
		assertCurrent
	};
}
/** New personal selections require the human owner; inherited pins need no new selection. */
function preparePersonalModelSelection(options, model) {
	const authProfileId = typeof model === "string" ? splitTrailingAuthProfile(model).profile : void 0;
	if (!authProfileId || !isUserModelAuthProfileId(authProfileId)) return;
	return preparePersonalModelAccountSelection(options, authProfileId);
}
/** Default use follows this creation's admitted scope; explicit account selection stays write-scoped. */
async function prepareSessionModelAccountAccess(options, model) {
	const personalModelSelection = preparePersonalModelSelection(options, model);
	if (personalModelSelection) return { personalModelSelection: await personalModelSelection };
	const { client } = options;
	return { personalAccountDefaults: hasCurrentPersonalGatewaySource(client, options.context) && client.authenticatedUserProfile ? await prepareUserModelAccountAction(options, void 0, readGatewayRequestMutationAuthority(options).sessionScope === "operator.sessions.write" ? SESSION_WRITE_SCOPE : WRITE_SCOPE) : void 0 };
}
//#endregion
export { prepareUserModelAccountAction as i, preparePersonalModelSelection as n, prepareSessionModelAccountAccess as r, preparePersonalModelAccountSelection as t };
