import { t as inspectDiscordAccount } from "./.setup/account-inspect-8cCu6uPG.mjs";
//#region extensions/discord/account-inspect-api.ts
function inspectDiscordReadOnlyAccount(cfg, accountId) {
	return inspectDiscordAccount({
		cfg,
		accountId
	});
}
//#endregion
export { inspectDiscordReadOnlyAccount };
