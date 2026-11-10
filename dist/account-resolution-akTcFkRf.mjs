//#region src/channels/account-resolution.ts
/** Prefer fresh operational preparation without retrying failures through the legacy hook. */
async function resolveChannelAccount(params) {
	const { config } = params.plugin;
	return config.resolveAccountAsync ? await config.resolveAccountAsync(params.cfg, params.accountId) : config.resolveAccount(params.cfg, params.accountId);
}
async function channelHasConfiguredState(params) {
	const { config } = params.plugin;
	const input = {
		cfg: params.cfg,
		env: params.env
	};
	return config.hasConfiguredStateAsync ? await config.hasConfiguredStateAsync(input) : config.hasConfiguredState?.(input);
}
/** Async hooks own their result; an empty result or failure never retries a legacy hook. */
async function resolveChannelAllowFrom(params) {
	const { config } = params.plugin;
	const input = {
		cfg: params.cfg,
		accountId: params.accountId
	};
	return config.resolveAllowFromAsync ? await config.resolveAllowFromAsync(input) : config.resolveAllowFrom?.(input);
}
async function describeChannelAccount(params) {
	const { config } = params.plugin;
	return config.describeAccountAsync ? await config.describeAccountAsync(params.account, params.cfg) : config.describeAccount?.(params.account, params.cfg);
}
async function resolvePluginDmPolicy(params) {
	const { security } = params.plugin;
	const input = {
		cfg: params.cfg,
		accountId: params.accountId,
		account: params.account
	};
	return security?.resolveDmPolicyAsync ? await security.resolveDmPolicyAsync(input) : security?.resolveDmPolicy?.(input);
}
//#endregion
export { resolvePluginDmPolicy as a, resolveChannelAllowFrom as i, describeChannelAccount as n, resolveChannelAccount as r, channelHasConfiguredState as t };
