import { p as readResidentUserProfileId } from "./user-profile-list-BdNJnrJe.mjs";
//#region src/gateway/server-methods/user-preference-events.ts
function publishUserPreferencesChanged(context, profileId, keys) {
	if (!keys.length || !context.getClientConnIds) return;
	const canonicalProfileId = readResidentUserProfileId(profileId);
	if (!canonicalProfileId) return;
	const connIds = context.getClientConnIds((client) => {
		const connectedProfileId = client.authenticatedUserProfile?.profileId;
		return Boolean(connectedProfileId && (connectedProfileId === canonicalProfileId || readResidentUserProfileId(connectedProfileId) === canonicalProfileId));
	});
	if (connIds?.size) context.broadcastToConnIds("users.prefs.changed", {
		profileId: canonicalProfileId,
		keys
	}, connIds);
}
//#endregion
export { publishUserPreferencesChanged as t };
