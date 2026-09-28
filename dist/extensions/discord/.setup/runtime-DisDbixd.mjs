import { c as resolveDiscordAccount, g as selectDiscordActivitiesRuntimeConfig, n as isDiscordAccountEnabledForRuntime, r as listDiscordAccountIds } from "./accounts-CwJQoLjM.mjs";
import { z as resolveDiscordProxyFetchForAccount } from "./send.shared-VNvWfX2T.mjs";
import { normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
//#region extensions/discord/src/activities/config.ts
function resolveDiscordActivitiesConfig(account, env = process.env) {
	if (!account.activities) return {
		enabled: false,
		reason: "not-configured"
	};
	const clientSecret = normalizeOptionalString(account.activities.clientSecret) ?? normalizeOptionalString(env.DISCORD_CLIENT_SECRET);
	if (!clientSecret) return {
		enabled: false,
		reason: "missing-client-secret"
	};
	const applicationId = normalizeOptionalString(account.activities.applicationId);
	return {
		enabled: true,
		clientSecret,
		...applicationId ? { applicationId } : {}
	};
}
//#endregion
//#region extensions/discord/src/activities/runtime.ts
var DiscordActivitiesRuntime = class {
	constructor(store, startupConfig, getCurrentConfig, env = process.env) {
		this.store = store;
		this.startupConfig = startupConfig;
		this.getCurrentConfig = getCurrentConfig;
		this.env = env;
		this.learnedApplicationIds = /* @__PURE__ */ new Map();
	}
	currentConfig() {
		return selectDiscordActivitiesRuntimeConfig(this.getCurrentConfig?.() ?? this.startupConfig);
	}
	registerApplicationId(accountId, applicationId) {
		const trimmed = applicationId.trim();
		if (trimmed) this.learnedApplicationIds.set(accountId, trimmed);
	}
	resolveAccount(accountId, cfg = this.currentConfig()) {
		const account = resolveDiscordAccount({
			cfg,
			accountId
		});
		if (!listDiscordAccountIds(cfg).includes(account.accountId) || !isDiscordAccountEnabledForRuntime(account, cfg) || account.tokenStatus !== "available") return null;
		const activities = resolveDiscordActivitiesConfig(account.config, this.env);
		if (!activities.enabled) return null;
		const applicationId = activities.applicationId ?? this.learnedApplicationIds.get(account.accountId) ?? account.config.applicationId?.trim();
		if (!applicationId) return null;
		const { clientSecret } = activities;
		const bot = account.token.trim();
		return {
			accountId: account.accountId,
			applicationId,
			botAuth: bot,
			clientSecret,
			proxyFetch: resolveDiscordProxyFetchForAccount(account, cfg)
		};
	}
	resolveHttpAccount(applicationId) {
		const cfg = this.currentConfig();
		const accounts = listDiscordAccountIds(cfg).map((accountId) => this.resolveAccount(accountId, cfg)).filter((account) => account !== null);
		if (applicationId) return accounts.find((account) => account.applicationId === applicationId) ?? null;
		return accounts.length === 1 ? accounts[0] ?? null : null;
	}
	hasEnabledAccounts(cfg = this.currentConfig()) {
		return listDiscordAccountIds(cfg).some((accountId) => this.resolveAccount(accountId, cfg) !== null);
	}
	isAccountEnabled(accountId, cfg = this.currentConfig()) {
		return this.resolveAccount(accountId, cfg) !== null;
	}
};
let activeRuntime;
function setDiscordActivitiesRuntime(runtime) {
	activeRuntime = runtime;
}
function getDiscordActivitiesRuntime() {
	return activeRuntime;
}
//#endregion
export { getDiscordActivitiesRuntime as n, setDiscordActivitiesRuntime as r, DiscordActivitiesRuntime as t };
