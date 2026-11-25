import { i as listDiscordAccountIds, n as inspectDiscordAccountConfig, v as resolveDiscordAccountAvailability } from "./accounts-DtjvhJUj.mjs";
import { DEFAULT_ACCOUNT_ID } from "openclaw/plugin-sdk/account-id";
import { normalizeSecretInputString } from "openclaw/plugin-sdk/secret-input";
// extensions/discord/src/account-inspect.ts
function inspectDiscordAccountPrimary(params) {
	return inspectDiscordAccountConfig(params, {
		includeName: true,
		resolveFallbackToken: (accountId) => {
			const envToken = accountId === DEFAULT_ACCOUNT_ID ? normalizeSecretInputString(params.envToken ?? process.env.DISCORD_BOT_TOKEN) : void 0;
			return {
				token: envToken?.replace(/^Bot\s+/i, "") ?? "",
				source: envToken ? "env" : "none"
			};
		}
	});
}
function inspectDiscordAccount(params) {
	const account = inspectDiscordAccountPrimary(params);
	return {
		...account,
		...resolveDiscordAccountAvailability({
			account,
			resolveAccounts: () => listDiscordAccountIds(params.cfg).map((accountId) => inspectDiscordAccountPrimary({
				...params,
				accountId
			}))
		})
	};
}
export { inspectDiscordAccount as t };
