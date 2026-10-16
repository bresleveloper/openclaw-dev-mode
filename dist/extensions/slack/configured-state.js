import { t as hasSlackAccountCredentials } from "./.setup/account-configured-sUohAxZr.mjs";
import { DEFAULT_ACCOUNT_ID, hasConfiguredAccountValue, mergeAccountConfig } from "openclaw/plugin-sdk/account-core";
//#region extensions/slack/configured-state.ts
function hasConfiguredSlackAccount(account, env) {
	const userIdentity = account?.postAs === "user";
	return hasSlackAccountCredentials({
		config: account ?? {},
		identityTokenConfigured: hasConfiguredAccountValue(userIdentity ? account?.userToken : account?.botToken) || hasConfiguredAccountValue(userIdentity ? env.SLACK_USER_TOKEN : env.SLACK_BOT_TOKEN),
		appTokenConfigured: hasConfiguredAccountValue(account?.appToken) || hasConfiguredAccountValue(env.SLACK_APP_TOKEN)
	});
}
/** Resolve Slack activation through its account owner's real transport credential contract. */
function hasConfiguredSlackChannelState(params) {
	const channel = params.cfg.channels?.slack;
	if (channel?.enabled === false) return false;
	const defaultAccount = channel?.accounts?.[DEFAULT_ACCOUNT_ID];
	if (defaultAccount?.enabled !== false) {
		if (hasConfiguredSlackAccount(defaultAccount ? mergeAccountConfig({
			channelConfig: channel,
			accountConfig: defaultAccount,
			nestedObjectKeys: ["relay"]
		}) : channel, params.env ?? process.env)) return true;
	}
	return Object.entries(channel?.accounts ?? {}).some(([accountId, account]) => {
		if (accountId === DEFAULT_ACCOUNT_ID || account.enabled === false) return false;
		return hasConfiguredSlackAccount(mergeAccountConfig({
			channelConfig: channel,
			accountConfig: account,
			nestedObjectKeys: ["relay"]
		}), {});
	});
}
//#endregion
export { hasConfiguredSlackChannelState };
