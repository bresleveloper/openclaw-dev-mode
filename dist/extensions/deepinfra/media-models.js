import { t as modelCatalog } from "./.setup/openclaw.plugin-BRaVociw.mjs";
import { normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
//#region extensions/deepinfra/media-models.ts
const DEEPINFRA_BASE_URL = modelCatalog.providers.deepinfra.baseUrl;
const DEFAULT_DEEPINFRA_IMAGE_SIZE = "1024x1024";
const DEFAULT_DEEPINFRA_TTS_VOICE = "af_bella";
const DEEPINFRA_VIDEO_ASPECT_RATIOS = [
	"16:9",
	"4:3",
	"1:1",
	"3:4",
	"9:16"
];
const DEEPINFRA_VIDEO_DURATIONS = [5, 8];
const DEEPINFRA_IMAGE_FALLBACK_MODELS = [
	"black-forest-labs/FLUX-1-schnell",
	"black-forest-labs/FLUX-1-dev",
	"Qwen/Qwen-Image-Max",
	"stabilityai/sdxl-turbo"
];
const DEEPINFRA_TTS_FALLBACK_CATALOG = [
	{
		id: "hexgrad/Kokoro-82M",
		name: "hexgrad/Kokoro-82M",
		tags: ["tts"],
		pricing: { input_characters: .65 }
	},
	{
		id: "Qwen/Qwen3-TTS",
		name: "Qwen/Qwen3-TTS",
		tags: ["tts"],
		pricing: { input_characters: .65 }
	},
	{
		id: "ResembleAI/chatterbox-turbo",
		name: "ResembleAI/chatterbox-turbo",
		tags: ["tts"],
		pricing: { input_characters: 1 }
	},
	{
		id: "sesame/csm-1b",
		name: "sesame/csm-1b",
		tags: ["tts"],
		pricing: { input_characters: 7 }
	}
];
const DEEPINFRA_TTS_FALLBACK_MODELS = DEEPINFRA_TTS_FALLBACK_CATALOG.map(({ id }) => id);
const DEEPINFRA_VIDEO_FALLBACK_MODELS = [
	"Pixverse/Pixverse-T2V",
	"Pixverse/Pixverse-T2V-HD",
	"Wan-AI/Wan2.6-T2V",
	"google/veo-3.1-fast"
];
const DEEPINFRA_STT_FALLBACK_MODELS = ["openai/whisper-large-v3-turbo", "openai/whisper-large-v3"];
const DEEPINFRA_EMBED_FALLBACK_MODELS = ["BAAI/bge-m3"];
const DEEPINFRA_VLM_FALLBACK_MODELS = ["moonshotai/Kimi-K2.5"];
function normalizeDeepInfraModelRef(model, fallback) {
	const value = normalizeOptionalString(model) ?? fallback;
	return value.startsWith("deepinfra/") ? value.slice(10) : value;
}
function normalizeDeepInfraBaseUrl(value, fallback = DEEPINFRA_BASE_URL) {
	return (normalizeOptionalString(value) ?? fallback).replace(/\/+$/u, "");
}
//#endregion
export { DEEPINFRA_BASE_URL, DEEPINFRA_EMBED_FALLBACK_MODELS, DEEPINFRA_IMAGE_FALLBACK_MODELS, DEEPINFRA_STT_FALLBACK_MODELS, DEEPINFRA_TTS_FALLBACK_CATALOG, DEEPINFRA_TTS_FALLBACK_MODELS, DEEPINFRA_VIDEO_ASPECT_RATIOS, DEEPINFRA_VIDEO_DURATIONS, DEEPINFRA_VIDEO_FALLBACK_MODELS, DEEPINFRA_VLM_FALLBACK_MODELS, DEFAULT_DEEPINFRA_IMAGE_SIZE, DEFAULT_DEEPINFRA_TTS_VOICE, normalizeDeepInfraBaseUrl, normalizeDeepInfraModelRef };
