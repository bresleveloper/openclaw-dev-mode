import { i as listDiscordAccountIds, l as resolveDiscordAccount } from "./accounts-DtjvhJUj.mjs";
import { t as fetchDiscordJson } from "./oauth-http-DdVyzSbo.mjs";
import { t as resolveDiscordActivitiesConfig } from "./config-DDwcUaxT.mjs";
// extensions/discord/src/identity-link.ts
function credentials(cfg, accountId) {
	if (!listDiscordAccountIds(cfg).includes(accountId)) return;
	const account = resolveDiscordAccount({
		cfg,
		accountId
	});
	const oauth = resolveDiscordActivitiesConfig(account.config);
	const applicationId = oauth.enabled ? oauth.applicationId ?? account.config.applicationId : void 0;
	return account.enabled && oauth.enabled && applicationId ? {
		applicationId,
		clientSecret: oauth.clientSecret
	} : void 0;
}
const discordIdentityLink = { async prepare(cfg, accountId) {
	const credential = credentials(cfg, accountId);
	if (!credential) return;
	return {
		isCurrent(current) {
			const value = credentials(current, accountId);
			return value?.applicationId === credential.applicationId && value?.clientSecret === credential.clientSecret;
		},
		authorizationUrl({ state, redirectUri }) {
			const url = new URL("https://discord.com/oauth2/authorize");
			url.search = new URLSearchParams({
				client_id: credential.applicationId,
				redirect_uri: redirectUri,
				response_type: "code",
				scope: "identify",
				state,
				prompt: "consent"
			}).toString();
			return url.href;
		},
		async exchange({ code, redirectUri, signal, assertCurrent }) {
			assertCurrent();
			const token = await fetchDiscordJson({
				url: "https://discord.com/api/oauth2/token",
				auditContext: "discord-profile-link-token",
				init: {
					method: "POST",
					signal,
					headers: { "Content-Type": "application/x-www-form-urlencoded" },
					body: new URLSearchParams({
						grant_type: "authorization_code",
						client_id: credential.applicationId,
						client_secret: credential.clientSecret,
						code,
						redirect_uri: redirectUri
					})
				}
			});
			assertCurrent();
			const accessToken = token.body?.access_token;
			if (!token.ok || typeof accessToken !== "string" || !accessToken) throw new Error("Discord sign-in could not be verified. Try connecting again.");
			const user = await fetchDiscordJson({
				url: "https://discord.com/api/v10/users/@me",
				auditContext: "discord-profile-link-user",
				init: {
					signal,
					headers: { Authorization: "Bearer " + accessToken }
				}
			});
			assertCurrent();
			const senderId = user.body?.id;
			if (!user.ok || typeof senderId !== "string" || !/^[0-9]{17,20}$/.test(senderId) || user.body?.bot === true) throw new Error("Discord did not return a verified personal account. Try connecting again.");
			return { senderId };
		}
	};
} };
export { discordIdentityLink };
