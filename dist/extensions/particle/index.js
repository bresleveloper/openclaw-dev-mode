import { n as openclaw_plugin_default, t as applyParticleConfig } from "./.setup/onboard-CjoABAqk.mjs";
import { defineSingleProviderPluginEntry } from "openclaw/plugin-sdk/provider-entry";
import { buildProviderReplayFamilyHooks } from "openclaw/plugin-sdk/provider-model-shared";
//#region extensions/particle/index.ts
var particle_default = defineSingleProviderPluginEntry({
	id: "particle",
	name: "Particle Provider",
	description: "Particle model provider",
	manifest: openclaw_plugin_default,
	provider: {
		label: "Particle",
		docsPath: "/providers/particle",
		manifestAuth: { applyConfig: applyParticleConfig },
		catalog: {
			liveModelDiscovery: true,
			discoveryMode: "strict"
		},
		...buildProviderReplayFamilyHooks({ family: "openai-compatible" })
	}
});
//#endregion
export { particle_default as default };
