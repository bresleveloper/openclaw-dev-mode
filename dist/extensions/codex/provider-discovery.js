//#region extensions/codex/provider-discovery.ts
const codexProviderDiscovery = {
	id: "codex",
	label: "Codex",
	auth: [],
	prepareSyntheticAuth: async ({ config, provider, env, signal, pluginRoot }) => {
		if (provider !== "codex") return;
		const { probeCodexNativeAuth } = await import("./.setup/native-auth-rWbGbMn3.mjs");
		return await probeCodexNativeAuth({
			config,
			env,
			signal,
			pluginRoot
		});
	}
};
//#endregion
export { codexProviderDiscovery as default };
