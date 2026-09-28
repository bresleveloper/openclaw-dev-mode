import { _ as inspectDiscordAccountTokenState, o as mergeDiscordAccountConfig, r as listDiscordAccountIds, s as resolveDefaultDiscordAccountId, u as resolveDiscordAccountConfig, v as resolveDiscordAccountAvailability } from "./accounts-CwJQoLjM.mjs";
import { DEFAULT_ACCOUNT_ID, normalizeAccountId } from "openclaw/plugin-sdk/account-id";
import { normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
import { normalizeSecretInputString } from "openclaw/plugin-sdk/secret-input";
//#region extensions/discord/src/account-inspect.ts
function inspectDiscordAccountPrimary(params) {
	const accountId = normalizeAccountId(params.accountId ?? resolveDefaultDiscordAccountId(params.cfg));
	const merged = mergeDiscordAccountConfig(params.cfg, accountId);
	const enabled = params.cfg.channels?.discord?.enabled !== false && merged.enabled !== false;
	const accountConfig = resolveDiscordAccountConfig(params.cfg, accountId);
	const hasAccountToken = Boolean(accountConfig && Object.hasOwn(accountConfig, "token"));
	return inspectDiscordAccountTokenState({
		base: {
			accountId,
			enabled,
			name: normalizeOptionalString(merged.name)
		},
		config: merged,
		accountToken: accountConfig?.token,
		hasAccountToken,
		channelToken: params.cfg.channels?.discord?.token,
		resolveFallbackToken: () => {
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
//#endregion
export { inspectDiscordAccount as t };
