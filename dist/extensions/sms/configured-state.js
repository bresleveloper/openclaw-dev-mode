import { DEFAULT_ACCOUNT_ID, hasConfiguredAccountValue } from "openclaw/plugin-sdk/account-core";
//#region extensions/sms/configured-state.ts
function hasConfiguredSmsAccount(account, env) {
	const hasAccount = hasConfiguredAccountValue(account?.accountSid ?? env.TWILIO_ACCOUNT_SID);
	const hasToken = hasConfiguredAccountValue(account?.authToken ?? env.TWILIO_AUTH_TOKEN);
	const fromNumber = [env.TWILIO_PHONE_NUMBER, env.TWILIO_SMS_FROM].find((value) => hasConfiguredAccountValue(value));
	const hasSender = hasConfiguredAccountValue(account?.fromNumber ?? fromNumber) || hasConfiguredAccountValue(account?.messagingServiceSid ?? env.TWILIO_MESSAGING_SERVICE_SID);
	return hasAccount && hasToken && hasSender;
}
/** Require a complete Twilio identity and sender, scoped to each enabled account. */
function hasConfiguredSmsChannelState(params) {
	const channel = params.cfg.channels?.sms;
	if (channel?.enabled === false) return false;
	const defaultAccount = channel?.accounts?.[DEFAULT_ACCOUNT_ID];
	const { accounts: _accounts, defaultAccount: _defaultAccount, ...defaults } = channel ?? {};
	if (defaultAccount?.enabled !== false && hasConfiguredSmsAccount(defaultAccount ? {
		...defaults,
		...defaultAccount
	} : channel, params.env ?? process.env)) return true;
	return Object.entries(channel?.accounts ?? {}).some(([accountId, account]) => accountId !== DEFAULT_ACCOUNT_ID && account.enabled !== false && hasConfiguredSmsAccount({
		...defaults,
		...account
	}, {}));
}
//#endregion
export { hasConfiguredSmsChannelState };
