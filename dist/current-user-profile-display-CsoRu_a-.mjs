import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { n as getUserProfileDisplay } from "./user-profile-list-CtETKur7.mjs";
import { s as buildControlUiUserAvatarPath } from "./control-ui-resource-routes-y_jZ6jnp.mjs";
import "./control-ui-contract-B_YMMx3J.mjs";
//#region src/gateway/current-user-profile-display.ts
function resolveCurrentUserProfileDisplay(senderId, readDisplay = getUserProfileDisplay) {
	try {
		const profile = readDisplay(senderId);
		if (!profile) return { kind: "unresolved" };
		const label = normalizeOptionalString(profile.displayName);
		return {
			kind: "resolved",
			profileId: profile.id,
			...label ? { label } : {},
			avatarUrl: buildControlUiUserAvatarPath(profile.id, profile.avatarRevision),
			hasUploadedAvatar: profile.hasAvatar
		};
	} catch {
		return { kind: "unresolved" };
	}
}
//#endregion
export { resolveCurrentUserProfileDisplay as t };
