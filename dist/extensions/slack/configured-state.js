import { n as hasSlackAccountCredentialsFromConfig } from "./.setup/account-configured-zcR9TJJN.mjs";
import { DEFAULT_ACCOUNT_ID, mergeAccountConfig } from "openclaw/plugin-sdk/account-core";
//#region extensions/slack/configured-state.ts
/** Resolve Slack activation through its account owner's real transport credential contract. */
function hasConfiguredSlackChannelState(params) {
	const channel = params.cfg.channels?.slack;
	if (channel?.enabled === false) return false;
	const defaultAccount = channel?.accounts?.[DEFAULT_ACCOUNT_ID];
	if (defaultAccount?.enabled !== false) {
		const account = defaultAccount ? mergeAccountConfig({
			channelConfig: channel,
			accountConfig: defaultAccount,
			nestedObjectKeys: ["relay"]
		}) : channel;
		if (hasSlackAccountCredentialsFromConfig(account, params.env ?? process.env)) return true;
	}
	return Object.entries(channel?.accounts ?? {}).some(([accountId, account]) => {
		if (accountId === DEFAULT_ACCOUNT_ID || account.enabled === false) return false;
		return hasSlackAccountCredentialsFromConfig(mergeAccountConfig({
			channelConfig: channel,
			accountConfig: account,
			nestedObjectKeys: ["relay"]
		}), {});
	});
}
//#endregion
export { hasConfiguredSlackChannelState };
