import { DEFAULT_ACCOUNT_ID, hasConfiguredAccountValue, mergeAccountConfig } from "openclaw/plugin-sdk/account-core";
//#region extensions/nextcloud-talk/configured-state.ts
function hasConfiguredNextcloudAccount(account, env) {
	return Boolean(account?.baseUrl?.trim() && (hasConfiguredAccountValue(account.botSecret) || hasConfiguredAccountValue(account.botSecretFile) || hasConfiguredAccountValue(env.NEXTCLOUD_TALK_BOT_SECRET)));
}
/** Require a Nextcloud server plus its account-owned bot credential. */
function hasConfiguredNextcloudTalkChannelState(params) {
	const channel = params.cfg.channels?.["nextcloud-talk"];
	if (channel?.enabled === false) return false;
	const defaultAccount = channel?.accounts?.[DEFAULT_ACCOUNT_ID];
	if (defaultAccount?.enabled !== false) {
		if (hasConfiguredNextcloudAccount(defaultAccount ? mergeAccountConfig({
			channelConfig: channel,
			accountConfig: defaultAccount,
			omitKeys: ["defaultAccount"]
		}) : channel, params.env ?? process.env)) return true;
	}
	return Object.entries(channel?.accounts ?? {}).some(([accountId, account]) => accountId !== DEFAULT_ACCOUNT_ID && account.enabled !== false && hasConfiguredNextcloudAccount(mergeAccountConfig({
		channelConfig: channel,
		accountConfig: account,
		omitKeys: ["defaultAccount"]
	}), {}));
}
//#endregion
export { hasConfiguredNextcloudTalkChannelState };
