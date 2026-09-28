import { s as resolveUserProfileId } from "./user-profiles-CRttx6hj.mjs";
//#region src/gateway/server-methods/user-preference-events.ts
function publishUserPreferencesChanged(context, profileId, keys) {
	if (!keys.length || !context.getClientConnIds) return;
	const canonicalProfileId = resolveUserProfileId(profileId);
	if (!canonicalProfileId) return;
	const connIds = context.getClientConnIds((client) => {
		const connectedProfileId = client.authenticatedUserProfile?.profileId;
		return Boolean(connectedProfileId && (connectedProfileId === canonicalProfileId || resolveUserProfileId(connectedProfileId) === canonicalProfileId));
	});
	if (connIds?.size) context.broadcastToConnIds("users.prefs.changed", {
		profileId: canonicalProfileId,
		keys
	}, connIds);
}
//#endregion
export { publishUserPreferencesChanged as t };
