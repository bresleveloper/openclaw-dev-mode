import { a as openclaw_plugin_default } from "./.setup/provider-catalog-BNTlqvTm.mjs";
import { applyMetaConnectionConfig } from "./onboard.js";
import { wrapMetaProviderStream } from "./stream.js";
import { resolveMetaThinkingProfile } from "./thinking.js";
import { defineSingleProviderPluginEntry } from "openclaw/plugin-sdk/provider-entry";
import { buildProviderReplayFamilyHooks } from "openclaw/plugin-sdk/provider-model-shared";
var meta_default = defineSingleProviderPluginEntry({
	id: "meta",
	name: "Meta Provider",
	description: "Meta provider plugin",
	manifest: openclaw_plugin_default,
	provider: {
		label: "Meta",
		docsPath: "/providers/meta",
		manifestAuth: {
			applyConfig: applyMetaConnectionConfig,
			noteMessage: "Meta provides Responses API inference.",
			noteTitle: "Meta"
		},
		catalog: {
			discoveryMode: "strict",
			liveModelDiscovery: true
		},
		...buildProviderReplayFamilyHooks({ family: "openai-compatible" }),
		wrapSimpleCompletionStreamFn: wrapMetaProviderStream,
		wrapStreamFn: wrapMetaProviderStream,
		resolveThinkingProfile: resolveMetaThinkingProfile
	}
});
//#endregion
export { meta_default as default };
