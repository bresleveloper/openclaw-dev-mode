import { DEFAULT_ACCOUNT_ID, createAccountListHelpers, hasConfiguredAccountValue, normalizeAccountId } from "openclaw/plugin-sdk/account-core";
//#region extensions/nextcloud-talk/configured-state.ts
const { listAccountIds: listNextcloudTalkAccountIds, resolveDefaultAccountId: resolveDefaultNextcloudTalkAccountId, resolveAccountConfig: mergeNextcloudTalkAccountConfig } = createAccountListHelpers("nextcloud-talk", {
	normalizeAccountId,
	omitKeys: ["defaultAccount"],
	hasImplicitDefaultAccount: (cfg) => {
		const channel = cfg.channels?.["nextcloud-talk"];
		return Boolean(channel?.baseUrl?.trim() && (hasConfiguredAccountValue(channel.botSecret) || channel.botSecretFile?.trim() || process.env.NEXTCLOUD_TALK_BOT_SECRET?.trim()));
	}
});
function hasConfiguredNextcloudAccount(account, env) {
	return Boolean(account?.baseUrl?.trim() && (hasConfiguredAccountValue(account.botSecret) || hasConfiguredAccountValue(account.botSecretFile) || hasConfiguredAccountValue(env.NEXTCLOUD_TALK_BOT_SECRET)));
}
/** Require a Nextcloud server plus its account-owned bot credential. */
function hasConfiguredNextcloudTalkChannelState(params) {
	const channel = params.cfg.channels?.["nextcloud-talk"];
	if (channel?.enabled === false) return false;
	if ((channel?.accounts?.[DEFAULT_ACCOUNT_ID])?.enabled !== false) {
		if (hasConfiguredNextcloudAccount(mergeNextcloudTalkAccountConfig(params.cfg, DEFAULT_ACCOUNT_ID), params.env ?? process.env)) return true;
	}
	return Object.entries(channel?.accounts ?? {}).some(([accountId, account]) => accountId !== DEFAULT_ACCOUNT_ID && account.enabled !== false && hasConfiguredNextcloudAccount(mergeNextcloudTalkAccountConfig(params.cfg, accountId), {}));
}
//#endregion
export { hasConfiguredNextcloudTalkChannelState, listNextcloudTalkAccountIds, mergeNextcloudTalkAccountConfig, resolveDefaultNextcloudTalkAccountId };
