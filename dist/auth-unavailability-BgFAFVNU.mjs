import { N as resolveProfileUnusableUntilForDisplay, O as readAuthProfileUsageStats } from "./user-model-account-authority-DFFjC5J5.mjs";
import "./usage-CRucybdr.mjs";
//#region src/commands/models/auth-unavailability.ts
function listUnavailableAuthProfiles(store) {
	const now = Date.now();
	return Object.keys(store.usageStats ?? {}).flatMap((profileId) => {
		const until = resolveProfileUnusableUntilForDisplay(store, profileId);
		if (!until || now >= until) return [];
		const stats = readAuthProfileUsageStats(store, profileId);
		const kind = typeof stats?.disabledUntil === "number" && now < stats.disabledUntil ? "disabled" : "cooldown";
		return [{
			profileId,
			provider: store.profiles[profileId]?.provider,
			kind,
			reason: kind === "disabled" ? stats?.disabledReason : stats?.cooldownReason,
			classification: kind === "cooldown" ? stats?.cooldownClassification : void 0,
			until,
			remainingMs: until - now
		}];
	});
}
//#endregion
export { listUnavailableAuthProfiles as t };
