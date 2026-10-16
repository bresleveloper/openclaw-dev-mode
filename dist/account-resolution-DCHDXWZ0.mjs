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
//#endregion
export { resolveChannelAccount as n, channelHasConfiguredState as t };
