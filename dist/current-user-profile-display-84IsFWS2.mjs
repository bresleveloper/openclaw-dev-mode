import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { n as getResidentUserProfileDisplay } from "./user-profile-list-BdNJnrJe.mjs";
import { s as buildControlUiUserAvatarPath } from "./control-ui-resource-routes-B42sqIG-.mjs";
import "./control-ui-contract-IX_0OA0h.mjs";
//#region src/gateway/current-user-profile-display.ts
function resolveCurrentUserProfileDisplay(senderId, readDisplay = getResidentUserProfileDisplay) {
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
