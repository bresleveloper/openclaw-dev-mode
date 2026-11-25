import { createLazyRuntimeModule } from "openclaw/plugin-sdk/lazy-runtime";
// extensions/codex/provider-discovery.ts
/** Native login facts belong to Codex, never to an OpenClaw bearer profile. */
const loadNativeAuth = createLazyRuntimeModule(() => import("./.setup/native-auth-Ci6Lt0Wf.mjs"));
const codexProviderDiscovery = {
	id: "codex",
	label: "Codex",
	auth: [],
	prepareSyntheticAuth: async ({ config, provider, env, signal, pluginRoot }) => {
		if (provider !== "codex") return;
		const { probeCodexNativeAuth } = await loadNativeAuth();
		return await probeCodexNativeAuth({
			config,
			env,
			signal,
			pluginRoot
		});
	}
};
export { codexProviderDiscovery as default };
