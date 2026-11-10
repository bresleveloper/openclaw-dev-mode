import { groqMediaUnderstandingProvider } from "./media-understanding-provider.js";
import { t as openclaw_plugin_default } from "./.setup/openclaw.plugin-B7n8WBLz.mjs";
import { defineSingleProviderPluginEntry } from "openclaw/plugin-sdk/provider-entry";
import { createPayloadPatchStreamWrapper } from "openclaw/plugin-sdk/provider-stream-shared";
//#region extensions/groq/index.ts
function wrapGroqParsedReasoning(streamFn) {
	return createPayloadPatchStreamWrapper(streamFn, ({ model, payload }) => {
		if (model.id.startsWith("qwen/") && model.reasoning && payload.reasoning_effort !== "none") payload.reasoning_format = "parsed";
	});
}
var groq_default = defineSingleProviderPluginEntry({
	id: "groq",
	name: "Groq Provider",
	description: "Bundled Groq provider plugin",
	manifest: openclaw_plugin_default,
	provider: {
		label: "Groq",
		docsPath: "/providers/groq",
		catalog: {
			liveModelDiscovery: true,
			discoveryMode: "strict"
		},
		wrapStreamFn: (ctx) => wrapGroqParsedReasoning(ctx.streamFn),
		wrapSimpleCompletionStreamFn: (ctx) => wrapGroqParsedReasoning(ctx.streamFn)
	},
	register(api) {
		api.registerMediaUnderstandingProvider(groqMediaUnderstandingProvider);
	}
});
//#endregion
export { groq_default as default };
