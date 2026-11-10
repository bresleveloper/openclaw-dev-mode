import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { s as asFiniteNumber } from "./number-coercion-CkhMiRw8.mjs";
import { a as asOptionalRecord } from "./record-coerce-TIsquoVR.mjs";
import { d as normalizeResolvedSecretInputString } from "./types.secrets-Dgbd2kyP.mjs";
import "./string-coerce-runtime-BbIJhy7G.mjs";
import "./secret-input-CHX7JVid.mjs";
import { t as parseSpeechDirectiveNumberOverride } from "./directive-number-9giXJMwx.mjs";
import "./speech-provider-CzD2EA_d.mjs";
import { r as resolveOpenAIProviderConfigRecord } from "./realtime-provider-shared-vbb3-15T.mjs";
import { a as isValidOpenAIModel, c as openaiTTS, i as isCustomOpenAITtsBaseUrl, n as OPENAI_TTS_MODELS, o as isValidOpenAIVoice, r as OPENAI_TTS_VOICES, s as normalizeOpenAITtsBaseUrl } from "./tts-CgW9EDQv.mjs";
//#region extensions/openai/speech-provider.ts
const OPENAI_SPEECH_RESPONSE_FORMATS = [
	"mp3",
	"opus",
	"wav"
];
function resolveOpenAISpeechApiKey(config) {
	return normalizeOptionalString(config.apiKey) ?? normalizeOptionalString(process.env.OPENAI_API_KEY);
}
function normalizeOpenAISpeechResponseFormat(value) {
	const next = normalizeOptionalLowercaseString(value);
	if (!next) return;
	const format = OPENAI_SPEECH_RESPONSE_FORMATS.find((candidate) => candidate === next);
	if (format) return format;
	throw new Error(`Invalid OpenAI speech responseFormat: ${next}`);
}
function isGroqSpeechBaseUrl(baseUrl) {
	const hostname = normalizeLowercaseStringOrEmpty(URL.parse(baseUrl)?.hostname);
	return hostname === "groq.com" || hostname.endsWith(".groq.com");
}
function resolveSpeechResponseFormat(baseUrl, target, configuredFormat) {
	if (configuredFormat) return configuredFormat;
	if (isGroqSpeechBaseUrl(baseUrl)) return "wav";
	return target === "voice-note" ? "opus" : "mp3";
}
function readExtraBody(value) {
	const body = asOptionalRecord(value);
	if (!body || Object.keys(body).length === 0) return;
	return body;
}
function normalizeOpenAISpeechSpeed(value, baseUrl) {
	const speed = asFiniteNumber(value);
	if (speed === void 0) return;
	if (baseUrl !== void 0 && normalizeOpenAITtsBaseUrl(baseUrl) !== "https://api.openai.com/v1") return speed;
	return speed >= .25 && speed <= 4 ? speed : void 0;
}
function normalizeOpenAIProviderConfig(config, source = "raw") {
	const raw = source === "raw" ? resolveOpenAIProviderConfigRecord(config) : config;
	const configuredBaseUrl = normalizeOptionalString(raw?.baseUrl);
	const defaultBaseUrl = normalizeOptionalString(process.env.OPENAI_TTS_BASE_URL) ?? "https://api.openai.com/v1";
	const baseUrl = source === "raw" ? normalizeOpenAITtsBaseUrl(configuredBaseUrl ?? defaultBaseUrl) : configuredBaseUrl ?? normalizeOpenAITtsBaseUrl(defaultBaseUrl);
	return {
		apiKey: source === "raw" ? normalizeResolvedSecretInputString({
			value: raw?.apiKey,
			path: "tts.providers.openai.apiKey"
		}) : normalizeOptionalString(raw?.apiKey),
		baseUrl,
		model: normalizeOptionalString(raw?.model) ?? "gpt-4o-mini-tts",
		voice: normalizeOptionalString(raw?.voice) ?? "coral",
		speed: normalizeOpenAISpeechSpeed(raw?.speed, baseUrl),
		instructions: normalizeOptionalString(raw?.instructions),
		responseFormat: normalizeOpenAISpeechResponseFormat(raw?.responseFormat),
		extraBody: readExtraBody(raw?.extraBody) ?? readExtraBody(raw?.extra_body)
	};
}
function parseDirectiveToken(ctx) {
	const baseUrl = normalizeOptionalString(asOptionalRecord(ctx.providerConfig)?.baseUrl);
	switch (ctx.key) {
		case "voice":
		case "openai_voice":
		case "openaivoice":
			if (!ctx.policy.allowVoice) return { handled: true };
			if (!isValidOpenAIVoice(ctx.value, baseUrl)) return {
				handled: true,
				warnings: [`invalid OpenAI voice "${ctx.value}"`]
			};
			return {
				handled: true,
				overrides: { voice: ctx.value }
			};
		case "model":
		case "openai_model":
		case "openaimodel":
			if (!ctx.policy.allowModelId) return { handled: true };
			if (!isValidOpenAIModel(ctx.value, baseUrl)) return { handled: false };
			return {
				handled: true,
				overrides: { model: ctx.value }
			};
		case "speed":
		case "openai_speed":
		case "openaispeed": {
			const customBaseUrl = isCustomOpenAITtsBaseUrl(baseUrl);
			return parseSpeechDirectiveNumberOverride({
				ctx,
				overrideKey: "speed",
				range: customBaseUrl ? {} : {
					min: .25,
					max: 4
				},
				warning: (value) => customBaseUrl ? `invalid OpenAI-compatible speed "${value}"` : `invalid OpenAI speed "${value}" (0.25-4.0)`
			});
		}
		default: return { handled: false };
	}
}
async function resolveOpenAITtsRequest(req, responseFormatOverride) {
	const config = normalizeOpenAIProviderConfig(req.providerConfig, "resolved");
	const model = normalizeOptionalString(req.providerOverrides?.model) ?? config.model;
	const voice = normalizeOptionalString(req.providerOverrides?.voice) ?? config.voice;
	const speed = normalizeOpenAISpeechSpeed(req.providerOverrides?.speed, config.baseUrl) ?? config.speed;
	const apiKey = resolveOpenAISpeechApiKey(config);
	if (!apiKey) throw new Error("OpenAI API key missing");
	const responseFormat = responseFormatOverride ?? resolveSpeechResponseFormat(config.baseUrl, req.target, config.responseFormat);
	const { resolveGeneratedMediaMaxBytes } = await import("./plugin-sdk/media-generation-runtime.js");
	return {
		text: req.text,
		apiKey,
		baseUrl: config.baseUrl,
		model,
		voice,
		speed,
		instructions: config.instructions,
		responseFormat,
		extraBody: config.extraBody,
		timeoutMs: req.timeoutMs,
		maxBytes: resolveGeneratedMediaMaxBytes(req.cfg, "audio")
	};
}
function buildOpenAISpeechProvider() {
	const isConfigured = ({ providerConfig }) => Boolean(resolveOpenAISpeechApiKey(normalizeOpenAIProviderConfig(providerConfig, "resolved")));
	return {
		id: "openai",
		label: "OpenAI",
		autoSelectOrder: 10,
		defaultModel: OPENAI_TTS_MODELS[0],
		models: OPENAI_TTS_MODELS,
		voices: OPENAI_TTS_VOICES,
		resolveConfig: ({ rawConfig }) => normalizeOpenAIProviderConfig(rawConfig),
		parseDirectiveToken,
		resolveTalkConfig: ({ baseTtsConfig, talkProviderConfig }) => {
			const base = normalizeOpenAIProviderConfig(baseTtsConfig);
			const responseFormat = normalizeOpenAISpeechResponseFormat(talkProviderConfig.responseFormat);
			const baseUrl = normalizeOptionalString(talkProviderConfig.baseUrl) ?? base.baseUrl;
			const speed = normalizeOpenAISpeechSpeed(talkProviderConfig.speed, baseUrl);
			return {
				...base,
				...talkProviderConfig.apiKey === void 0 ? {} : { apiKey: normalizeResolvedSecretInputString({
					value: talkProviderConfig.apiKey,
					path: "talk.providers.openai.apiKey"
				}) },
				baseUrl,
				model: normalizeOptionalString(talkProviderConfig.modelId) ?? base.model,
				voice: normalizeOptionalString(talkProviderConfig.voiceId) ?? base.voice,
				speed: speed ?? base.speed,
				instructions: normalizeOptionalString(talkProviderConfig.instructions) ?? base.instructions,
				responseFormat: responseFormat ?? base.responseFormat
			};
		},
		resolveTalkOverrides: ({ params }) => ({
			...normalizeOptionalString(params.voiceId) == null ? {} : { voice: normalizeOptionalString(params.voiceId) },
			...normalizeOptionalString(params.modelId) == null ? {} : { model: normalizeOptionalString(params.modelId) },
			...asFiniteNumber(params.speed) == null ? {} : { speed: asFiniteNumber(params.speed) }
		}),
		listVoices: async () => OPENAI_TTS_VOICES.map((voice) => ({
			id: voice,
			name: voice
		})),
		isConfigured,
		isConfiguredAsync: async (ctx) => isConfigured(ctx),
		synthesize: async (req) => {
			const params = await resolveOpenAITtsRequest(req);
			const audioBuffer = await openaiTTS(params);
			const fileExtension = `.${params.responseFormat}`;
			const { isVoiceMessageCompatibleAudio } = await import("./plugin-sdk/media-runtime.js");
			return {
				audioBuffer,
				outputFormat: params.responseFormat,
				fileExtension,
				voiceCompatible: req.target === "voice-note" && isVoiceMessageCompatibleAudio({ fileName: `speech${fileExtension}` })
			};
		},
		synthesizeTelephony: async (req) => {
			const params = await resolveOpenAITtsRequest({
				...req,
				target: "telephony"
			}, "pcm");
			return {
				audioBuffer: await openaiTTS(params),
				outputFormat: "pcm",
				sampleRate: 24e3
			};
		}
	};
}
//#endregion
export { buildOpenAISpeechProvider as t };
