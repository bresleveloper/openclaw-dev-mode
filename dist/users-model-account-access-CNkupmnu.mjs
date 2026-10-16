import { t as splitTrailingAuthProfile } from "./model-ref-profile-BNjB2hED.mjs";
import { s as SESSION_WRITE_SCOPE, u as WRITE_SCOPE } from "./operator-scopes-DsrPoRc4.mjs";
import { v as isUserModelAuthProfileId } from "./profile-usage-stats-BLwxBqRR.mjs";
import { w as UserProfileNotFoundError } from "./user-profiles-internal-DlO1LBbo.mjs";
import { r as isUserModelAuthProfileOwner } from "./user-model-accounts-sYn17idc.mjs";
import { a as roleScopesAllow } from "./operator-scope-compat-Ci6GBcmU.mjs";
import { p as resolveOperatorRolePolicyForProfile } from "./operator-role-policy-BqPaarjx.mjs";
import { o as prepareUserProfileRoleAuthority, s as prepareUserProfileSelectionAuthority } from "./user-channel-identity-operations-COzOBly4.mjs";
import { a as readGatewayRequestMutationAuthority } from "./session-mutation-guards-CxCbIrod.mjs";
import { t as isIneligiblePersonalGatewayCaller } from "./gateway-personal-caller-CPQUGI4q.mjs";
import { a as isGatewayClientProfilePending } from "./gateway-client-identity-DnDs09-7.mjs";
import { t as ModelAccountConnectAuthorityError } from "./model-account-connect-wfMmajkJ.mjs";
import { t as ensureProfileIdForEmail } from "./user-profile-email-Bp-r4diT.mjs";
//#region src/gateway/server-methods/users-model-account-access.ts
/** Capture human authority once; every later privileged use rechecks this exact connection. */
async function prepareUserModelAccountAction(options, profileId, requiredScope = WRITE_SCOPE) {
	const { client, context } = options;
	const profileReference = client?.authenticatedUserProfile?.profileId;
	const userReference = client?.authenticatedUserId;
	const connectionId = client?.connId;
	const assertConnectionCurrent = () => {
		if (!client?.connId || client.connId !== connectionId || client.invalidated || client.connectionSignal?.aborted || client.connect.role !== "operator" || isIneligiblePersonalGatewayCaller(client) || options.signal?.aborted || isGatewayClientProfilePending(client) || !context.getClientConnIds?.((current) => current === client).has(client.connId) || client.authenticatedUserProfile?.profileId !== profileReference || client.authenticatedUserId !== userReference) throw new ModelAccountConnectAuthorityError();
	};
	assertConnectionCurrent();
	const actorReference = profileReference ?? (userReference && !client?.authenticatedGitHubIdentitySync && !client?.authenticatedUserIsTailscaleProvider ? await ensureProfileIdForEmail(userReference, {}, assertConnectionCurrent) : void 0);
	const actorIdentity = actorReference ? await (profileReference ? prepareUserProfileSelectionAuthority(actorReference) : prepareUserProfileRoleAuthority(actorReference)) : void 0;
	assertConnectionCurrent();
	if (!actorIdentity) throw new ModelAccountConnectAuthorityError();
	const actor = actorIdentity.profileId;
	if (!profileReference && userReference && await ensureProfileIdForEmail(userReference, {}, assertConnectionCurrent) !== actor) throw new ModelAccountConnectAuthorityError();
	const ownerReference = profileId ?? actor;
	const ownerIdentity = ownerReference === actor || ownerReference === actorReference ? actorIdentity : await prepareUserProfileSelectionAuthority(ownerReference);
	assertConnectionCurrent();
	if (!ownerIdentity) throw new UserProfileNotFoundError(ownerReference);
	const owner = ownerIdentity.profileId;
	const assertCurrent = () => {
		assertConnectionCurrent();
		if (!actorIdentity.isCurrent() || !ownerIdentity.isCurrent()) throw new ModelAccountConnectAuthorityError();
		const scope = actor === owner ? requiredScope : "operator.admin";
		const role = resolveOperatorRolePolicyForProfile(actor, context.getRuntimeConfig());
		if (![client?.connect.scopes ?? [], ...role ? [role.scopes] : []].every((allowedScopes) => roleScopesAllow({
			role: "operator",
			requestedScopes: [scope],
			allowedScopes
		}))) throw new ModelAccountConnectAuthorityError();
	};
	assertCurrent();
	return {
		owner,
		assertCurrent
	};
}
/** Preview and commit share the same self-owned selection; scope follows the requested action. */
async function preparePersonalModelAccountSelection(options, authProfileId, requiredScope = "operator.write") {
	const action = await prepareUserModelAccountAction(options, void 0, requiredScope);
	const assertCurrent = () => {
		action.assertCurrent();
		if (!isUserModelAuthProfileOwner({
			profileId: action.owner,
			authProfileId
		})) throw new ModelAccountConnectAuthorityError();
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
	return { personalAccountDefaults: client?.connId && client.authenticatedUserProfile && !isIneligiblePersonalGatewayCaller(client) ? await prepareUserModelAccountAction(options, void 0, readGatewayRequestMutationAuthority(options).sessionScope === "operator.sessions.write" ? SESSION_WRITE_SCOPE : WRITE_SCOPE) : void 0 };
}
//#endregion
export { prepareUserModelAccountAction as i, preparePersonalModelSelection as n, prepareSessionModelAccountAccess as r, preparePersonalModelAccountSelection as t };
