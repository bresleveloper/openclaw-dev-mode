import { asOptionalRecord, normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
import { resolveTimerTimeoutMs } from "openclaw/plugin-sdk/number-runtime";
import { normalizeResolvedSecretInputString } from "openclaw/plugin-sdk/secret-input";
import { createSpeechDirectiveParser, resolveSpeechProviderApiKey } from "openclaw/plugin-sdk/speech-provider";
// extensions/xiaomi/speech-provider.ts
const DEFAULT_XIAOMI_TTS_BASE_URL = "https://api.xiaomimimo.com/v1";
const DEFAULT_XIAOMI_TTS_MODEL = "mimo-v2.5-tts";
const DEFAULT_XIAOMI_TTS_VOICE = "mimo_default";
const DEFAULT_XIAOMI_TTS_FORMAT = "mp3";
const XIAOMI_TTS_VOICE_DESIGN_MODEL = "mimo-v2.5-tts-voicedesign";
const DEFAULT_XIAOMI_TTS_VOICE_DESIGN_STYLE = "Warm, natural, and friendly voice with clear pronunciation and conversational pacing.";
const XIAOMI_TTS_MODELS = ["mimo-v2.5-tts", XIAOMI_TTS_VOICE_DESIGN_MODEL];
const XIAOMI_TTS_VOICES = [
	"mimo_default",
	"default_zh",
	"default_en",
	"Mia",
	"Chloe",
	"Milo",
	"Dean"
];
const XIAOMI_TTS_FORMATS = ["mp3", "wav"];
function normalizeXiaomiTtsFormat(value) {
	const normalized = normalizeOptionalString(value)?.toLowerCase();
	return XIAOMI_TTS_FORMATS.find((format) => format === normalized);
}
function normalizeXiaomiTtsProviderConfig(rawConfig) {
	const providers = asOptionalRecord(rawConfig.providers);
	const raw = asOptionalRecord(providers?.xiaomi) ?? asOptionalRecord(providers?.mimo);
	const options = readXiaomiTtsOptions(raw);
	return {
		apiKey: normalizeResolvedSecretInputString({
			value: raw?.apiKey,
			path: "tts.providers.xiaomi.apiKey"
		}),
		baseUrl: (normalizeOptionalString(raw?.baseUrl) ?? normalizeOptionalString(process.env.XIAOMI_BASE_URL) ?? DEFAULT_XIAOMI_TTS_BASE_URL).replace(/\/+$/, ""),
		model: options.model ?? normalizeOptionalString(process.env.XIAOMI_TTS_MODEL) ?? DEFAULT_XIAOMI_TTS_MODEL,
		voice: options.voice ?? normalizeOptionalString(process.env.XIAOMI_TTS_VOICE) ?? DEFAULT_XIAOMI_TTS_VOICE,
		format: options.format ?? normalizeXiaomiTtsFormat(process.env.XIAOMI_TTS_FORMAT) ?? DEFAULT_XIAOMI_TTS_FORMAT,
		style: options.style
	};
}
function resolveXiaomiTtsProviderConfig(config) {
	const providerConfig = normalizeXiaomiTtsProviderConfig({ providers: { xiaomi: config } });
	const resolvedKey = resolveSpeechProviderApiKey(providerConfig.apiKey, process.env.XIAOMI_API_KEY);
	return {
		...providerConfig,
		apiKey: resolvedKey
	};
}
function readXiaomiTtsOptions(options) {
	return {
		model: normalizeOptionalString(options?.model) ?? normalizeOptionalString(options?.modelId),
		voice: normalizeOptionalString(options?.speakerVoice) ?? normalizeOptionalString(options?.speakerVoiceId) ?? normalizeOptionalString(options?.voice) ?? normalizeOptionalString(options?.voiceId),
		format: normalizeXiaomiTtsFormat(options?.format),
		style: normalizeOptionalString(options?.style)
	};
}
const parseDirectiveToken = createSpeechDirectiveParser({
	voice: ["allowVoice", [
		"voice",
		"voiceid",
		"voice_id",
		"mimo_voice",
		"xiaomi_voice"
	]],
	model: ["allowModelId", [
		"model",
		"mimo_model",
		"xiaomi_model"
	]],
	style: ["allowVoiceSettings", [
		"style",
		"mimo_style",
		"xiaomi_style"
	]],
	format: [
		"allowVoiceSettings",
		[
			"format",
			"responseformat",
			"response_format"
		],
		{ parse: (ctx) => {
			const format = normalizeXiaomiTtsFormat(ctx.value);
			return format ? {
				handled: true,
				overrides: { format }
			} : {
				handled: true,
				warnings: [`invalid Xiaomi TTS format "${ctx.value}"`]
			};
		} }
	]
});
function buildXiaomiSpeechProvider() {
	const isConfigured = ({ providerConfig }) => Boolean(resolveXiaomiTtsProviderConfig(providerConfig).apiKey);
	return {
		id: "xiaomi",
		label: "Xiaomi MiMo",
		aliases: ["mimo"],
		autoSelectOrder: 45,
		defaultModel: DEFAULT_XIAOMI_TTS_MODEL,
		models: XIAOMI_TTS_MODELS,
		voices: XIAOMI_TTS_VOICES,
		resolveConfig: ({ rawConfig }) => normalizeXiaomiTtsProviderConfig(rawConfig),
		parseDirectiveToken,
		listVoices: async () => XIAOMI_TTS_VOICES.map((voice) => ({
			id: voice,
			name: voice
		})),
		isConfigured,
		isConfiguredAsync: async (ctx) => isConfigured(ctx),
		synthesize: async (req) => {
			const config = resolveXiaomiTtsProviderConfig(req.providerConfig);
			const overrides = readXiaomiTtsOptions(req.providerOverrides);
			if (!config.apiKey) throw new Error("Xiaomi API key missing");
			const outputFormat = overrides.format ?? config.format;
			const text = req.text;
			const model = overrides.model ?? config.model;
			const voice = overrides.voice ?? config.voice;
			const style = overrides.style ?? config.style;
			const requestTimeoutMs = resolveTimerTimeoutMs(req.timeoutMs, 1);
			const { canonicalizeBase64 } = await import("openclaw/plugin-sdk/blob-runtime");
			const { assertOkOrThrowProviderError, readProviderJsonResponse } = await import("openclaw/plugin-sdk/provider-http");
			const { fetchWithSsrFGuard, ssrfPolicyFromHttpBaseUrlAllowedHostname } = await import("openclaw/plugin-sdk/ssrf-runtime");
			const voiceDesign = model === XIAOMI_TTS_VOICE_DESIGN_MODEL;
			const resolvedStyle = normalizeOptionalString(style) ?? (voiceDesign ? DEFAULT_XIAOMI_TTS_VOICE_DESIGN_STYLE : void 0);
			let audioBuffer;
			const { response, release } = await fetchWithSsrFGuard({
				url: `${config.baseUrl}/chat/completions`,
				init: {
					method: "POST",
					headers: {
						"api-key": config.apiKey,
						"Content-Type": "application/json"
					},
					body: JSON.stringify({
						model,
						messages: [...resolvedStyle ? [{
							role: "user",
							content: resolvedStyle
						}] : [], {
							role: "assistant",
							content: text
						}],
						audio: voiceDesign ? { format: outputFormat } : {
							format: outputFormat,
							voice
						}
					})
				},
				timeoutMs: requestTimeoutMs,
				policy: ssrfPolicyFromHttpBaseUrlAllowedHostname(config.baseUrl),
				auditContext: "xiaomi.tts"
			});
			try {
				await assertOkOrThrowProviderError(response, "Xiaomi TTS API error");
				const body = await readProviderJsonResponse(response, "Xiaomi TTS API");
				const root = asOptionalRecord(body);
				const choices = Array.isArray(root?.choices) ? root.choices : [];
				const firstChoice = asOptionalRecord(choices[0]);
				const message = asOptionalRecord(firstChoice?.message);
				const audio = asOptionalRecord(message?.audio);
				const audioData = normalizeOptionalString(audio?.data);
				if (!audioData) throw new Error("Xiaomi TTS API returned no audio data");
				const canonicalAudio = canonicalizeBase64(audioData);
				if (!canonicalAudio) throw new Error("Xiaomi TTS API returned malformed base64 audio data");
				audioBuffer = Buffer.from(canonicalAudio, "base64");
			} finally {
				await release();
			}
			if (req.target === "voice-note") {
				const { transcodeAudioBufferToOpus } = await import("openclaw/plugin-sdk/media-runtime");
				return {
					audioBuffer: await transcodeAudioBufferToOpus({
						audioBuffer,
						inputExtension: outputFormat,
						tempPrefix: "tts-xiaomi-",
						timeoutMs: req.timeoutMs
					}),
					outputFormat: "opus",
					fileExtension: ".opus",
					voiceCompatible: true
				};
			}
			return {
				audioBuffer,
				outputFormat,
				fileExtension: `.${outputFormat}`,
				voiceCompatible: false
			};
		}
	};
}
export { buildXiaomiSpeechProvider };
