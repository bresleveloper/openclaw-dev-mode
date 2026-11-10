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
function hasSlackAccountCredentialsFromConfig(config, env) {
	const userIdentity = config?.postAs === "user";
	return hasSlackAccountCredentials({
		config: config ?? {},
		identityTokenConfigured: hasConfiguredAccountValue(userIdentity ? config?.userToken : config?.botToken) || hasConfiguredAccountValue(userIdentity ? env.SLACK_USER_TOKEN : env.SLACK_BOT_TOKEN),
		appTokenConfigured: hasConfiguredAccountValue(config?.appToken) || hasConfiguredAccountValue(env.SLACK_APP_TOKEN)
	});
}
function createSlackAccountConfiguredChecker(allowSecretRefs) {
	return (account) => {
		const hasToken = (key) => Boolean(account[key]?.trim()) || allowSecretRefs && account.config.mode !== "relay" && hasConfiguredSecretInput(account.config[key]);
		return hasSlackAccountCredentials({
			config: account.config,
			identityTokenConfigured: hasToken(account.identity === "user" ? "userToken" : "botToken"),
			appTokenConfigured: hasToken("appToken")
		});
	};
}
const isSlackPluginAccountConfigured = createSlackAccountConfiguredChecker(false);
const isSlackSetupAccountConfigured = createSlackAccountConfiguredChecker(true);
//#endregion
export { isSlackSetupAccountConfigured as i, hasSlackAccountCredentialsFromConfig as n, isSlackPluginAccountConfigured as r, hasSlackAccountCredentials as t };
