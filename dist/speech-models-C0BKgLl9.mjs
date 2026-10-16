import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import "./string-coerce-runtime-50qKeWeL.mjs";
//#region extensions/google/speech-models.ts
const DEFAULT_GOOGLE_TTS_MODEL = "gemini-3.1-flash-tts-preview";
const DEFAULT_GOOGLE_TTS_VOICE = "Kore";
const GOOGLE_TTS_SAMPLE_RATE = 24e3;
const GOOGLE_AUDIO_PROFILE_PROMPT_TEMPLATE = "audio-profile-v1";
const GOOGLE_TTS_INTERACTIONS_MODELS = ["gemini-3.8-flash-tts", "gemini-3.8-flash-lite-tts"];
const GOOGLE_TTS_GENERATE_CONTENT_MODELS = [
	"gemini-3.1-flash-tts-preview",
	"gemini-2.5-flash-preview-tts",
	"gemini-2.5-pro-preview-tts"
];
const GOOGLE_TTS_MODELS = [...GOOGLE_TTS_INTERACTIONS_MODELS, ...GOOGLE_TTS_GENERATE_CONTENT_MODELS];
const GOOGLE_TTS_MODEL_ALIASES = { "gemini-3.1-flash-tts": "gemini-3.1-flash-tts-preview" };
function normalizeGoogleTtsModel(model) {
	const trimmed = normalizeOptionalString(model);
	if (!trimmed) return DEFAULT_GOOGLE_TTS_MODEL;
	const withoutProvider = trimmed.startsWith("google/") ? trimmed.slice(7) : trimmed;
	return GOOGLE_TTS_MODEL_ALIASES[withoutProvider] ?? withoutProvider;
}
function isGoogleInteractionsTtsModel(model) {
	return GOOGLE_TTS_INTERACTIONS_MODELS.some((candidate) => candidate === model);
}
function assertSupportedGoogleTtsModel(model) {
	if (isGoogleInteractionsTtsModel(model)) return;
	if (model.includes("gemini-3.8-") && model.includes("-tts")) throw new Error(`Google TTS model ${model} is not supported. OpenClaw sends Gemini 3.8 TTS through the Interactions API; supported models: ${GOOGLE_TTS_INTERACTIONS_MODELS.join(", ")}.`);
}
function normalizeGoogleTtsVoiceName(voiceName) {
	return normalizeOptionalString(voiceName) ?? DEFAULT_GOOGLE_TTS_VOICE;
}
function normalizeGooglePromptTemplate(value) {
	const trimmed = normalizeOptionalString(value);
	if (!trimmed) return;
	if (trimmed === "audio-profile-v1") return trimmed;
	throw new Error(`Invalid Google TTS promptTemplate: ${trimmed}`);
}
//#endregion
export { assertSupportedGoogleTtsModel as a, normalizeGoogleTtsModel as c, GOOGLE_TTS_SAMPLE_RATE as i, normalizeGoogleTtsVoiceName as l, GOOGLE_AUDIO_PROFILE_PROMPT_TEMPLATE as n, isGoogleInteractionsTtsModel as o, GOOGLE_TTS_MODELS as r, normalizeGooglePromptTemplate as s, DEFAULT_GOOGLE_TTS_MODEL as t };
