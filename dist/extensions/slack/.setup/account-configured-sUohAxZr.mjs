import { hasConfiguredAccountValue } from "openclaw/plugin-sdk/account-resolution";
import { hasConfiguredSecretInput } from "openclaw/plugin-sdk/secret-input";
//#region extensions/slack/src/account-configured.ts
function hasSlackAccountCredentials(params) {
	if (!params.identityTokenConfigured) return false;
	const mode = params.config.mode ?? "socket";
	if (mode === "http") return hasConfiguredAccountValue(params.config.signingSecret);
	if (mode === "relay") {
		const relay = params.config.relay;
		return hasConfiguredAccountValue(relay?.url) && hasConfiguredAccountValue(relay?.authToken) && hasConfiguredAccountValue(relay?.gatewayId);
	}
	return params.appTokenConfigured;
}
function isSlackPluginAccountConfigured(account) {
	const identityToken = account.identity === "user" ? account.userToken : account.botToken;
	return hasSlackAccountCredentials({
		config: account.config,
		identityTokenConfigured: Boolean(identityToken?.trim()),
		appTokenConfigured: Boolean(account.appToken?.trim())
	});
}
function isSlackSetupAccountConfigured(account) {
	if (account.config.mode === "relay") return isSlackPluginAccountConfigured(account);
	const identityToken = account.identity === "user" ? account.userToken : account.botToken;
	const configuredIdentityToken = account.identity === "user" ? account.config.userToken : account.config.botToken;
	return hasSlackAccountCredentials({
		config: account.config,
		identityTokenConfigured: Boolean(identityToken?.trim()) || hasConfiguredSecretInput(configuredIdentityToken),
		appTokenConfigured: Boolean(account.appToken?.trim()) || hasConfiguredSecretInput(account.config.appToken)
	});
}
//#endregion
export { isSlackPluginAccountConfigured as n, isSlackSetupAccountConfigured as r, hasSlackAccountCredentials as t };
