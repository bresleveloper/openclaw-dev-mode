import { t as hasSlackAccountCredentials } from "./account-configured-sUohAxZr.mjs";
import { a as resolveDefaultSlackAccountId, i as mergeSlackAccountConfig } from "./accounts-BBHvg0pY.mjs";
import { DEFAULT_ACCOUNT_ID, normalizeAccountId } from "openclaw/plugin-sdk/account-resolution";
import { hasConfiguredSecretInput, normalizeSecretInputString } from "openclaw/plugin-sdk/secret-input";
import { normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
//#region extensions/slack/src/account-inspect.ts
function inspectSlackToken(value) {
	const token = normalizeSecretInputString(value);
	if (token) return {
		token,
		source: "config",
		status: "available"
	};
	if (hasConfiguredSecretInput(value)) return {
		source: "config",
		status: "configured_unavailable"
	};
	return {
		source: "none",
		status: "missing"
	};
}
function resolveInspectedSlackToken(configured, envToken) {
	return configured.status === "missing" && envToken ? {
		token: envToken,
		source: "env",
		status: "available"
	} : configured;
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
	const configBot = inspectSlackToken(merged.botToken);
	const configApp = inspectSlackToken(isSocketMode ? merged.appToken : void 0);
	const configSigningSecret = inspectSlackToken(merged.signingSecret);
	const configUser = inspectSlackToken(merged.userToken);
	const envBot = allowEnv ? normalizeSecretInputString(params.envBotToken ?? process.env.SLACK_BOT_TOKEN) : void 0;
	const envApp = allowEnv && isSocketMode ? normalizeSecretInputString(params.envAppToken ?? process.env.SLACK_APP_TOKEN) : void 0;
	const envUser = allowEnv ? normalizeSecretInputString(params.envUserToken ?? process.env.SLACK_USER_TOKEN) : void 0;
	const botCredential = resolveInspectedSlackToken(configBot, envBot);
	const appCredential = resolveInspectedSlackToken(configApp, envApp);
	const userCredential = resolveInspectedSlackToken(configUser, envUser);
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
		groupPolicy: merged.groupPolicy,
		textChunkLimit: merged.textChunkLimit,
		mediaMaxMb: merged.mediaMaxMb,
		reactionNotifications: merged.reactionNotifications,
		reactionAllowlist: merged.reactionAllowlist,
		replyToMode: merged.replyToMode,
		replyToModeByChatType: merged.replyToModeByChatType,
		actions: merged.actions,
		slashCommand: merged.slashCommand,
		dm: merged.dm,
		channels: merged.channels
	};
}
//#endregion
export { inspectSlackAccount as t };
