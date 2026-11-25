import { t as openclaw_plugin_default } from "./.setup/openclaw.plugin-N7cAUo3f.mjs";
import { transcribeOpenAiCompatibleAudio } from "openclaw/plugin-sdk/media-understanding";
import { defineSingleProviderPluginEntry } from "openclaw/plugin-sdk/provider-entry";
import { createPayloadPatchStreamWrapper } from "openclaw/plugin-sdk/provider-stream-shared";
// extensions/groq/index.ts
const DEFAULT_GROQ_AUDIO_BASE_URL = "https://api.groq.com/openai/v1";
const DEFAULT_GROQ_AUDIO_MODEL = "whisper-large-v3-turbo";
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
		api.registerMediaUnderstandingProvider({
			id: "groq",
			capabilities: ["audio"],
			defaultModels: { audio: DEFAULT_GROQ_AUDIO_MODEL },
			autoPriority: { audio: 20 },
			transcribeAudio: (req) => transcribeOpenAiCompatibleAudio({
				...req,
				defaultBaseUrl: DEFAULT_GROQ_AUDIO_BASE_URL,
				defaultModel: DEFAULT_GROQ_AUDIO_MODEL
			})
		});
	}
});
export { groq_default as default };
