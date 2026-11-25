import { _ as selectDiscordActivitiesRuntimeConfig, i as listDiscordAccountIds, l as resolveDiscordAccount, r as isDiscordAccountEnabledForRuntime } from "./accounts-DtjvhJUj.mjs";
import { t as resolveDiscordProxyFetchForAccount } from "./proxy-fetch-B8cK6FLQ.mjs";
import { t as resolveDiscordActivitiesConfig } from "./config-DDwcUaxT.mjs";
// extensions/discord/src/activities/runtime.ts
var DiscordActivitiesRuntime = class {
	constructor(store, getCurrentConfig, env = process.env) {
		this.store = store;
		this.getCurrentConfig = getCurrentConfig;
		this.env = env;
		this.learnedApplicationIds = /* @__PURE__ */ new Map();
	}
	currentConfig() {
		return selectDiscordActivitiesRuntimeConfig(this.getCurrentConfig());
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
	hasEnabledAccounts() {
		const cfg = this.currentConfig();
		return listDiscordAccountIds(cfg).some((accountId) => this.resolveAccount(accountId, cfg) !== null);
	}
};
let activeRuntime;
function setDiscordActivitiesRuntime(runtime) {
	activeRuntime = runtime;
}
function getDiscordActivitiesRuntime() {
	return activeRuntime;
}
export { getDiscordActivitiesRuntime as n, setDiscordActivitiesRuntime as r, DiscordActivitiesRuntime as t };
