import { i as openclaw_plugin_default, r as isModernCohereModelId } from "./.setup/models-DxsOE4Aq.mjs";
import { applyCohereConfig } from "./onboard.js";
import { COHERE_LIVE_MODEL_DISCOVERY } from "./provider-catalog.js";
import { wrapCohereProviderStream } from "./stream.js";
import { defineSingleProviderPluginEntry } from "openclaw/plugin-sdk/provider-entry";
//#region extensions/cohere/index.ts
var cohere_default = defineSingleProviderPluginEntry({
	id: "cohere",
	name: "Cohere Provider",
	description: "Cohere provider plugin",
	manifest: openclaw_plugin_default,
	provider: {
		label: "Cohere",
		docsPath: "/providers/cohere",
		manifestAuth: { applyConfig: applyCohereConfig },
		catalog: {
			discoveryMode: "strict",
			liveModelDiscovery: COHERE_LIVE_MODEL_DISCOVERY
		},
		wrapStreamFn: wrapCohereProviderStream,
		wrapSimpleCompletionStreamFn: wrapCohereProviderStream,
		isModernModelRef: ({ modelId }) => isModernCohereModelId(modelId)
	}
});
//#endregion
export { cohere_default as default };
