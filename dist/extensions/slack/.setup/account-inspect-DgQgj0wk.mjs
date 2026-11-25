import { t as hasSlackAccountCredentials } from "./account-configured-35y0-Hso.mjs";
import { _ as buildSlackAccountSurfaceFields, a as mergeSlackAccountConfig, o as resolveDefaultSlackAccountId } from "./accounts-EaPP0fFY.mjs";
import { DEFAULT_ACCOUNT_ID, normalizeAccountId } from "openclaw/plugin-sdk/account-resolution";
import { normalizeSecretInputString, resolveSecretInputString } from "openclaw/plugin-sdk/secret-input";
import { normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
// extensions/slack/src/account-inspect.ts
function inspectSlackToken(value, envToken) {
	const credential = resolveSecretInputString({
		value,
		path: "Slack token",
		mode: "inspect"
	});
	return credential.status !== "missing" ? {
		token: credential.value,
		source: "config",
		status: credential.status
	} : envToken ? {
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
export { inspectSlackAccount as t };
