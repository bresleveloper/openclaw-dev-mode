import { DEFAULT_ACCOUNT_ID, hasConfiguredAccountValue, mergeAccountConfig } from "openclaw/plugin-sdk/account-core";
//#region extensions/feishu/configured-state.ts
/** Feishu owns configured account credentials; ambient variables alone are not an account. */
function hasConfiguredFeishuChannelState(params) {
	const channel = params.cfg.channels?.feishu;
	if (!channel || channel.enabled === false) return false;
	const defaultAccount = channel.accounts?.[DEFAULT_ACCOUNT_ID];
	if (defaultAccount?.enabled !== false) {
		const account = defaultAccount ? mergeAccountConfig({
			channelConfig: channel,
			accountConfig: defaultAccount,
			omitKeys: ["defaultAccount"]
		}) : channel;
		if (hasConfiguredAccountValue(account.appId) && hasConfiguredAccountValue(account.appSecret)) return true;
	}
	return Object.entries(channel.accounts ?? {}).some(([accountId, account]) => {
		if (accountId === DEFAULT_ACCOUNT_ID || !account || account.enabled === false) return false;
		const appId = Object.hasOwn(account, "appId") ? account.appId : channel.appId;
		const appSecret = Object.hasOwn(account, "appSecret") ? account.appSecret : channel.appSecret;
		return hasConfiguredAccountValue(appId) && hasConfiguredAccountValue(appSecret);
	});
}
//#endregion
export { hasConfiguredFeishuChannelState };
