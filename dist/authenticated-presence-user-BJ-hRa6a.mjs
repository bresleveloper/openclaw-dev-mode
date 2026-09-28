import { s as buildControlUiUserAvatarPath } from "./control-ui-resource-routes-DVy_LnYu.mjs";
import "./control-ui-contract-Dup6xL62.mjs";
//#region src/gateway/authenticated-presence-user.ts
function buildAuthenticatedPresenceUser(params) {
	if (!params.authenticatedUserProfile) {
		if (!params.authenticatedUserId) return;
		return {
			id: params.authenticatedUserId,
			...params.authenticatedUserIsTailscaleProvider ? {} : { email: params.authenticatedUserId }
		};
	}
	return {
		id: params.authenticatedUserProfile.profileId,
		identity: {
			type: "profile",
			id: params.authenticatedUserProfile.profileId
		},
		...params.authenticatedUserId && !params.authenticatedUserIsTailscaleProvider ? { email: params.authenticatedUserId } : {},
		...params.authenticatedUserProfile.displayName ? { name: params.authenticatedUserProfile.displayName } : {},
		avatarUrl: buildControlUiUserAvatarPath(params.authenticatedUserProfile.profileId, params.authenticatedUserProfile.avatarRevision)
	};
}
//#endregion
export { buildAuthenticatedPresenceUser as t };
