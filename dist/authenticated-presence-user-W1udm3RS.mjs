import { s as buildControlUiUserAvatarPath } from "./control-ui-resource-routes-y_jZ6jnp.mjs";
import "./control-ui-contract-B_YMMx3J.mjs";
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
