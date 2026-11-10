import { t as hasSlackAccountCredentials } from "./account-configured-zcR9TJJN.mjs";
import { a as mergeSlackAccountConfig, g as buildSlackAccountSurfaceFields, o as resolveDefaultSlackAccountId } from "./accounts-msihSF3-.mjs";
import { DEFAULT_ACCOUNT_ID, normalizeAccountId } from "openclaw/plugin-sdk/account-resolution";
import { hasConfiguredSecretInput, normalizeSecretInputString } from "openclaw/plugin-sdk/secret-input";
import { normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
//#region extensions/slack/src/account-inspect.ts
function inspectSlackToken(value, envToken) {
	const token = normalizeSecretInputString(value);
	if (token || hasConfiguredSecretInput(value)) return {
		token,
		source: "config",
		status: token ? "available" : "configured_unavailable"
	};
	return envToken ? {
		token: envToken,
		source: "env",
		status: "available"
	} : {
		source: "none",
		status: "missing"
	};
}
function inspectSlackAccount(params) {
	const accountId = normalizeAccountId(params.accountId ?? resolveDefaultSlackAccountId(params.cfg));
	const merged = mergeSlackAccountConfig(params.cfg, accountId);
	const enabled = params.cfg.channels?.slack?.enabled !== false && merged.enabled !== false;
	const allowEnv = accountId === DEFAULT_ACCOUNT_ID;
	const mode = merged.mode ?? "socket";
	const identity = merged.postAs ?? "bot";
	const isHttpMode = mode === "http";
	const isSocketMode = mode === "socket";
	const envBot = allowEnv ? normalizeSecretInputString(params.envBotToken ?? process.env.SLACK_BOT_TOKEN) : void 0;
	const envApp = allowEnv && isSocketMode ? normalizeSecretInputString(params.envAppToken ?? process.env.SLACK_APP_TOKEN) : void 0;
	const envUser = allowEnv ? normalizeSecretInputString(params.envUserToken ?? process.env.SLACK_USER_TOKEN) : void 0;
	const botCredential = inspectSlackToken(merged.botToken, envBot);
	const appCredential = inspectSlackToken(isSocketMode ? merged.appToken : void 0, envApp);
	const configSigningSecret = inspectSlackToken(merged.signingSecret);
	const userCredential = inspectSlackToken(merged.userToken, envUser);
	return {
		accountId,
		enabled,
		...identity === "user" ? { identity } : {},
		name: normalizeOptionalString(merged.name),
		mode,
		botToken: botCredential.token,
		appToken: appCredential.token,
		...isHttpMode ? { signingSecret: configSigningSecret.token } : {},
		userToken: userCredential.token,
		botTokenSource: botCredential.source,
		appTokenSource: appCredential.source,
		...isHttpMode ? { signingSecretSource: configSigningSecret.source } : {},
		userTokenSource: userCredential.source,
		botTokenStatus: botCredential.status,
		appTokenStatus: appCredential.status,
		...isHttpMode ? { signingSecretStatus: configSigningSecret.status } : {},
		userTokenStatus: userCredential.status,
		configured: hasSlackAccountCredentials({
			config: merged,
			identityTokenConfigured: (identity === "user" ? userCredential : botCredential).status !== "missing",
			appTokenConfigured: appCredential.status !== "missing"
		}),
		config: merged,
		...buildSlackAccountSurfaceFields(merged)
	};
}
//#endregion
export { inspectSlackAccount as t };
