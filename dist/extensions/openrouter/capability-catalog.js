import { createOpenAiCompatibleSpeechProvider } from "openclaw/plugin-sdk/speech-provider";
import { asOptionalRecord } from "openclaw/plugin-sdk/string-coerce-runtime";
//#region extensions/openrouter/provider-defaults.ts
const OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1";
//#endregion
//#region extensions/openrouter/speech-provider.ts
const DEFAULT_OPENROUTER_TTS_MODEL = "hexgrad/kokoro-82m";
const DEFAULT_OPENROUTER_TTS_VOICE = "af_alloy";
const OPENROUTER_TTS_MODELS = [
	DEFAULT_OPENROUTER_TTS_MODEL,
	"elevenlabs/eleven-turbo-v2",
	"google/gemini-3.1-flash-tts-preview",
	"mistralai/voxtral-mini-tts-2603"
];
const OPENROUTER_TTS_RESPONSE_FORMATS = ["mp3", "pcm"];
function buildOpenRouterSpeechProvider() {
	return createOpenAiCompatibleSpeechProvider({
		id: "openrouter",
		label: "OpenRouter",
		autoSelectOrder: 35,
		models: OPENROUTER_TTS_MODELS,
		voices: [DEFAULT_OPENROUTER_TTS_VOICE],
		defaultModel: DEFAULT_OPENROUTER_TTS_MODEL,
		defaultVoice: DEFAULT_OPENROUTER_TTS_VOICE,
		defaultBaseUrl: OPENROUTER_BASE_URL,
		envKey: "OPENROUTER_API_KEY",
		responseFormats: OPENROUTER_TTS_RESPONSE_FORMATS,
		defaultResponseFormat: "mp3",
		voiceCompatibleResponseFormats: ["mp3"],
		baseUrlPolicy: {
			kind: "canonical",
			aliases: ["https://openrouter.ai/v1"],
			allowCustom: true
		},
		extraHeaders: {
			"HTTP-Referer": "https://openclaw.ai",
			"X-OpenRouter-Title": "OpenClaw"
		},
		apiErrorLabel: "OpenRouter TTS API error",
		missingApiKeyError: "OpenRouter API key missing",
		readExtraConfig: (raw) => ({ provider: asOptionalRecord(raw?.provider) }),
		extraJsonBodyFields: [{ configKey: "provider" }]
	});
}
//#endregion
//#region extensions/openrouter/capability-catalog.ts
var capability_catalog_default = { speechProviders: [buildOpenRouterSpeechProvider()] };
//#endregion
export { capability_catalog_default as default };
