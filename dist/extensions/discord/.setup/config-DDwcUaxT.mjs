import { normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
// extensions/discord/src/activities/config.ts
function resolveDiscordActivitiesConfig(account, env = process.env) {
	if (!account.activities) return {
		enabled: false,
		reason: "not-configured"
	};
	const clientSecret = normalizeOptionalString(account.activities.clientSecret) ?? normalizeOptionalString(env.DISCORD_CLIENT_SECRET);
	if (!clientSecret) return {
		enabled: false,
		reason: "missing-client-secret"
	};
	const applicationId = normalizeOptionalString(account.activities.applicationId);
	return {
		enabled: true,
		clientSecret,
		...applicationId ? { applicationId } : {}
	};
}
export { resolveDiscordActivitiesConfig as t };
