import { t as inspectDiscordAccount } from "./.setup/account-inspect-CSz5Qodj.mjs";
// extensions/discord/account-inspect-api.ts
function inspectDiscordReadOnlyAccount(cfg, accountId) {
	return inspectDiscordAccount({
		cfg,
		accountId
	});
}
export { inspectDiscordReadOnlyAccount };
