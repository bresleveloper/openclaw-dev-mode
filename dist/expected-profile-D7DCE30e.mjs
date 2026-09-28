import { t as ErrorCodes } from "./gateway-error-details-D85F07e9.mjs";
import { f as errorShape } from "./error-codes-DvB36bCj.mjs";
import { s as readUserProfileIdentity } from "./user-profile-list-B5pNqyXa.mjs";
import { a as prepareUserProfileSelectionAuthority } from "./user-channel-identity-operations-BY1hMzdF.mjs";
import { t as SessionMutationAuthorizationChangedError } from "./session-mutation-authorization-error-CCz8QGWh.mjs";
//#region src/gateway/expected-profile.ts
/** Prepare at identity lifecycle boundaries; serialization must never query profile storage. */
function prepareGatewayRecipientProfile(client, prepared) {
	client.preparedRecipientProfileId = void 0;
	client.preparedSessionProfile = void 0;
	if (client.connectionKind === "worker" || (client.connect.role ?? "operator") !== "operator") return;
	try {
		const attached = client.authenticatedUserProfile?.profileId;
		const profile = prepared ? prepared.identity : attached ? readUserProfileIdentity(attached) : void 0;
		if (profile && profile.profileId.length <= 128) {
			client.preparedSessionProfile = profile;
			client.preparedRecipientProfileId = profile.profileId;
		}
	} catch {}
}
var ExpectedProfileMismatchError = class extends SessionMutationAuthorizationChangedError {};
/** Request-local selection precondition, independent of socket and accepted-run lifetime. */
async function createExpectedProfileBinding(expectedProfileId, client, assertRequestCurrent) {
	if (expectedProfileId === void 0) return;
	let prepared;
	const authenticatedUserId = client?.authenticatedUserId;
	const synchronizeProfile = client?.authenticatedGitHubIdentitySync;
	let profileReference = client?.authenticatedUserProfile?.profileId;
	try {
		assertRequestCurrent?.();
		if (!profileReference && synchronizeProfile) {
			await synchronizeProfile();
			assertRequestCurrent?.();
			if (client?.authenticatedUserId !== authenticatedUserId || client?.authenticatedGitHubIdentitySync !== synchronizeProfile) throw new Error("Gateway requester identity changed");
			profileReference = client?.authenticatedUserProfile?.profileId;
		}
		prepared = profileReference ? await prepareUserProfileSelectionAuthority(profileReference) : void 0;
		assertRequestCurrent?.();
	} catch {
		prepared = void 0;
	}
	let invoked = false;
	const resolvedProfileError = (profileId) => {
		if (profileId === expectedProfileId) return;
		return errorShape(ErrorCodes.INVALID_REQUEST, "Selected account changed or is unavailable. Select the account again before retrying.", { details: {
			reason: "EXPECTED_PROFILE_MISMATCH",
			execution: invoked ? "may_have_executed" : "not_started"
		} });
	};
	const currentError = () => {
		let resolvedProfileId;
		try {
			resolvedProfileId = client?.authenticatedUserId === authenticatedUserId && client?.authenticatedUserProfile?.profileId === profileReference && prepared?.isCurrent() ? prepared.profileId : void 0;
		} catch {}
		return resolvedProfileError(resolvedProfileId);
	};
	return {
		assertCurrent: () => {
			assertRequestCurrent?.();
			const error = currentError();
			if (error) throw new ExpectedProfileMismatchError(error);
		},
		/** Compare a profile resolved by the storage owner on its transaction connection. */
		assertMatchesResolvedProfile: (profileId) => {
			const error = resolvedProfileError(profileId);
			if (error) throw new ExpectedProfileMismatchError(error);
		},
		markInvoked: () => {
			invoked = true;
		},
		guardResponse: (respond) => (...args) => {
			const mismatch = currentError();
			if (mismatch) respond(false, void 0, mismatch);
			else respond(...args);
		}
	};
}
//#endregion
export { createExpectedProfileBinding as n, prepareGatewayRecipientProfile as r, ExpectedProfileMismatchError as t };
