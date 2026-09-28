import { resolveTimerTimeoutMs } from "openclaw/plugin-sdk/number-runtime";
import { normalizeResolvedSecretInputString } from "openclaw/plugin-sdk/secret-input";
import { resolveSpeechProviderApiKey } from "openclaw/plugin-sdk/speech-provider";
import { asOptionalRecord, normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
//#region extensions/xiaomi/speech-provider.ts
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
function normalizeXiaomiTtsBaseUrl(baseUrl) {
	return (baseUrl?.trim() || DEFAULT_XIAOMI_TTS_BASE_URL).replace(/\/+$/, "");
}
function normalizeXiaomiTtsFormat(value) {
	const normalized = normalizeOptionalString(value)?.toLowerCase();
	return XIAOMI_TTS_FORMATS.includes(normalized) ? normalized : void 0;
}
function resolveXiaomiTtsConfigRecord(rawConfig) {
	const providers = asOptionalRecord(rawConfig.providers);
	return asOptionalRecord(providers?.xiaomi) ?? asOptionalRecord(providers?.mimo) ?? asOptionalRecord(rawConfig.xiaomi);
}
function normalizeXiaomiTtsProviderConfig(rawConfig) {
	const raw = resolveXiaomiTtsConfigRecord(rawConfig);
	return {
		apiKey: normalizeResolvedSecretInputString({
			value: raw?.apiKey,
			path: "tts.providers.xiaomi.apiKey"
		}),
		baseUrl: normalizeXiaomiTtsBaseUrl(normalizeOptionalString(raw?.baseUrl) ?? normalizeOptionalString(process.env.XIAOMI_BASE_URL)),
		model: normalizeOptionalString(raw?.model) ?? normalizeOptionalString(raw?.modelId) ?? normalizeOptionalString(process.env.XIAOMI_TTS_MODEL) ?? DEFAULT_XIAOMI_TTS_MODEL,
		voice: normalizeOptionalString(raw?.speakerVoice) ?? normalizeOptionalString(raw?.speakerVoiceId) ?? normalizeOptionalString(raw?.voice) ?? normalizeOptionalString(raw?.voiceId) ?? normalizeOptionalString(process.env.XIAOMI_TTS_VOICE) ?? DEFAULT_XIAOMI_TTS_VOICE,
		format: normalizeXiaomiTtsFormat(raw?.format) ?? normalizeXiaomiTtsFormat(process.env.XIAOMI_TTS_FORMAT) ?? DEFAULT_XIAOMI_TTS_FORMAT,
		style: normalizeOptionalString(raw?.style)
	};
}
function readXiaomiTtsProviderConfig(config) {
	const normalized = normalizeXiaomiTtsProviderConfig({});
	return {
		apiKey: normalizeResolvedSecretInputString({
			value: config.apiKey,
			path: "tts.providers.xiaomi.apiKey"
		}) ?? normalized.apiKey,
		baseUrl: normalizeXiaomiTtsBaseUrl(normalizeOptionalString(config.baseUrl) ?? normalized.baseUrl),
		model: normalizeOptionalString(config.model) ?? normalizeOptionalString(config.modelId) ?? normalized.model,
		voice: normalizeOptionalString(config.speakerVoice) ?? normalizeOptionalString(config.speakerVoiceId) ?? normalizeOptionalString(config.voice) ?? normalizeOptionalString(config.voiceId) ?? normalized.voice,
		format: normalizeXiaomiTtsFormat(config.format) ?? normalized.format,
		style: normalizeOptionalString(config.style) ?? normalized.style
	};
}
function resolveXiaomiTtsProviderConfig(config) {
	const providerConfig = readXiaomiTtsProviderConfig(config);
	const resolvedKey = resolveSpeechProviderApiKey(providerConfig.apiKey, process.env.XIAOMI_API_KEY);
	return {
		...providerConfig,
		apiKey: resolvedKey
	};
}
function readXiaomiTtsOverrides(overrides) {
	if (!overrides) return {};
	return {
		model: normalizeOptionalString(overrides.model) ?? normalizeOptionalString(overrides.modelId),
		voice: normalizeOptionalString(overrides.speakerVoice) ?? normalizeOptionalString(overrides.speakerVoiceId) ?? normalizeOptionalString(overrides.voice) ?? normalizeOptionalString(overrides.voiceId),
		format: normalizeXiaomiTtsFormat(overrides.format),
		style: normalizeOptionalString(overrides.style)
	};
}
function parseDirectiveToken(ctx) {
	switch (ctx.key) {
		case "voice":
		case "voiceid":
		case "voice_id":
		case "mimo_voice":
		case "xiaomi_voice":
			if (!ctx.policy.allowVoice) return { handled: true };
			return {
				handled: true,
				overrides: { voice: ctx.value }
			};
		case "model":
		case "mimo_model":
		case "xiaomi_model":
			if (!ctx.policy.allowModelId) return { handled: true };
			return {
				handled: true,
				overrides: { model: ctx.value }
			};
		case "style":
		case "mimo_style":
		case "xiaomi_style":
			if (!ctx.policy.allowVoiceSettings) return { handled: true };
			return {
				handled: true,
				overrides: { style: ctx.value }
			};
		case "format":
		case "responseformat":
		case "response_format": {
			if (!ctx.policy.allowVoiceSettings) return { handled: true };
			const format = normalizeXiaomiTtsFormat(ctx.value);
			if (!format) return {
				handled: true,
				warnings: [`invalid Xiaomi TTS format "${ctx.value}"`]
			};
			return {
				handled: true,
				overrides: { format }
			};
		}
		default: return { handled: false };
	}
}
function buildXiaomiTtsMessages(params) {
	const style = normalizeOptionalString(params.style);
	return [...style ? [{
		role: "user",
		content: style
	}] : [], {
		role: "assistant",
		content: params.text
	}];
}
function isXiaomiVoiceDesignModel(model) {
	return model === XIAOMI_TTS_VOICE_DESIGN_MODEL;
}
function resolveXiaomiVoiceDesignStyle(style) {
	return normalizeOptionalString(style) ?? DEFAULT_XIAOMI_TTS_VOICE_DESIGN_STYLE;
}
function buildXiaomiTtsAudio(params) {
	if (isXiaomiVoiceDesignModel(params.model)) return { format: params.format };
	return {
		format: params.format,
		voice: params.voice
	};
}
async function xiaomiTTS(params) {
	const { text, apiKey, baseUrl, model, voice, format, style, timeoutMs } = params;
	const requestTimeoutMs = resolveTimerTimeoutMs(timeoutMs, 1);
	const { canonicalizeBase64 } = await import("openclaw/plugin-sdk/media-runtime");
	const { assertOkOrThrowProviderError, readProviderJsonResponse } = await import("openclaw/plugin-sdk/provider-http");
	const { fetchWithSsrFGuard, ssrfPolicyFromHttpBaseUrlAllowedHostname } = await import("openclaw/plugin-sdk/ssrf-runtime");
	const controller = new AbortController();
	const timeout = setTimeout(() => controller.abort(), requestTimeoutMs);
	const resolvedStyle = isXiaomiVoiceDesignModel(model) ? resolveXiaomiVoiceDesignStyle(style) : style;
	try {
		const { response, release } = await fetchWithSsrFGuard({
			url: `${baseUrl}/chat/completions`,
			init: {
				method: "POST",
				headers: {
					"api-key": apiKey,
					"Content-Type": "application/json"
				},
				body: JSON.stringify({
					model,
					messages: buildXiaomiTtsMessages({
						text,
						style: resolvedStyle
					}),
					audio: buildXiaomiTtsAudio({
						model,
						voice,
						format
					})
				}),
				signal: controller.signal
			},
			timeoutMs: requestTimeoutMs,
			policy: ssrfPolicyFromHttpBaseUrlAllowedHostname(baseUrl),
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
			return Buffer.from(canonicalAudio, "base64");
		} finally {
			await release();
		}
	} finally {
		clearTimeout(timeout);
	}
}
function buildXiaomiSpeechProvider() {
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
		isConfigured: ({ providerConfig }) => Boolean(resolveXiaomiTtsProviderConfig(providerConfig).apiKey),
		synthesize: async (req) => {
			const config = resolveXiaomiTtsProviderConfig(req.providerConfig);
			const overrides = readXiaomiTtsOverrides(req.providerOverrides);
			if (!config.apiKey) throw new Error("Xiaomi API key missing");
			const outputFormat = overrides.format ?? config.format;
			const audioBuffer = await xiaomiTTS({
				text: req.text,
				apiKey: config.apiKey,
				baseUrl: config.baseUrl,
				model: overrides.model ?? config.model,
				voice: overrides.voice ?? config.voice,
				format: outputFormat,
				style: overrides.style ?? config.style,
				timeoutMs: req.timeoutMs
			});
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
//#endregion
export { buildXiaomiSpeechProvider };
