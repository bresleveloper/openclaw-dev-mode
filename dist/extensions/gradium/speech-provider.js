import { GRADIUM_VOICES, normalizeGradiumBaseUrl } from "./shared.js";
import { gradiumTTS } from "./tts.js";
import { normalizeResolvedSecretInputString } from "openclaw/plugin-sdk/secret-input";
import { resolveSpeechProviderApiKey } from "openclaw/plugin-sdk/speech-provider";
import { asOptionalRecord, normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
//#region extensions/gradium/speech-provider.ts
function normalizeGradiumProviderConfig(rawConfig) {
	const providers = asOptionalRecord(rawConfig.providers);
	const raw = asOptionalRecord(providers?.gradium) ?? asOptionalRecord(rawConfig.gradium);
	return {
		apiKey: normalizeResolvedSecretInputString({
			value: raw?.apiKey,
			path: "tts.providers.gradium.apiKey"
		}),
		baseUrl: normalizeGradiumBaseUrl(normalizeOptionalString(raw?.baseUrl)),
		voiceId: normalizeOptionalString(raw?.voiceId) ?? "YTpq7expH9539ERJ"
	};
}
function readGradiumProviderConfig(config) {
	return normalizeGradiumProviderConfig({ gradium: {
		...config,
		apiKey: normalizeOptionalString(config.apiKey)
	} });
}
function resolveGradiumApiKey(configApiKey) {
	return resolveSpeechProviderApiKey(normalizeOptionalString(configApiKey), process.env.GRADIUM_API_KEY);
}
async function synthesizeGradium(req, outputFormat) {
	const config = readGradiumProviderConfig(req.providerConfig);
	const apiKey = resolveGradiumApiKey(config.apiKey);
	if (!apiKey) throw new Error("Gradium API key missing");
	const { resolveGeneratedMediaMaxBytes } = await import("openclaw/plugin-sdk/media-generation-runtime");
	return await gradiumTTS({
		text: req.text,
		apiKey,
		baseUrl: config.baseUrl,
		voiceId: normalizeOptionalString(req.providerOverrides?.voiceId) ?? config.voiceId,
		outputFormat,
		timeoutMs: req.timeoutMs,
		maxBytes: resolveGeneratedMediaMaxBytes(req.cfg, "audio")
	});
}
function isGradiumProviderConfigured(config) {
	if (!resolveGradiumApiKey(config.apiKey)) return false;
	try {
		normalizeGradiumBaseUrl(normalizeOptionalString(config.baseUrl));
		return true;
	} catch {
		return false;
	}
}
function parseDirectiveToken(ctx) {
	if (![
		"voice",
		"voice_id",
		"voiceid",
		"gradium_voice",
		"gradiumvoice"
	].includes(ctx.key)) return { handled: false };
	return ctx.policy.allowVoice ? {
		handled: true,
		overrides: {
			...ctx.currentOverrides,
			voiceId: ctx.value
		}
	} : { handled: true };
}
function buildGradiumSpeechProvider() {
	return {
		id: "gradium",
		label: "Gradium",
		autoSelectOrder: 30,
		voices: GRADIUM_VOICES.map((v) => v.id),
		resolveConfig: ({ rawConfig }) => normalizeGradiumProviderConfig(rawConfig),
		parseDirectiveToken,
		listVoices: async () => GRADIUM_VOICES.map((v) => ({
			id: v.id,
			name: v.name
		})),
		isConfigured: ({ providerConfig }) => isGradiumProviderConfigured(providerConfig),
		synthesize: async (req) => {
			const wantsVoiceNote = req.target === "voice-note";
			const outputFormat = wantsVoiceNote ? "opus" : "wav";
			return {
				audioBuffer: await synthesizeGradium(req, outputFormat),
				outputFormat,
				fileExtension: wantsVoiceNote ? ".opus" : ".wav",
				voiceCompatible: wantsVoiceNote
			};
		},
		synthesizeTelephony: async (req) => ({
			audioBuffer: await synthesizeGradium(req, "ulaw_8000"),
			outputFormat: "ulaw_8000",
			sampleRate: 8e3
		})
	};
}
//#endregion
export { buildGradiumSpeechProvider };
