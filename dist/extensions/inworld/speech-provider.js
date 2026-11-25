import { DEFAULT_INWORLD_MODEL_ID, INWORLD_DELIVERY_MODES, INWORLD_TTS_MODELS, inworldTTS, listInworldVoices, normalizeInworldBaseUrl } from "./tts.js";
import { normalizeResolvedSecretInputString } from "openclaw/plugin-sdk/secret-input";
import { createSpeechDirectiveParser, resolveSpeechProviderApiKey } from "openclaw/plugin-sdk/speech-provider";
import { asFiniteNumberInRange, asOptionalRecord, filterStringRecord, normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
// extensions/inworld/speech-provider.ts
function normalizeInworldTemperature(value) {
	return asFiniteNumberInRange(value, {
		min: 0,
		minExclusive: true,
		max: 2
	});
}
const INWORLD_SPEAKING_RATE_RANGE = {
	min: .5,
	max: 1.5
};
function normalizeInworldSpeakingRate(value) {
	return asFiniteNumberInRange(value, INWORLD_SPEAKING_RATE_RANGE);
}
function normalizeInworldDeliveryMode(value) {
	const normalized = normalizeOptionalString(value)?.toUpperCase();
	return INWORLD_DELIVERY_MODES.find((mode) => mode === normalized);
}
function normalizeInworldProviderConfig(rawConfig) {
	const providers = asOptionalRecord(rawConfig.providers);
	const raw = asOptionalRecord(providers?.inworld);
	return {
		apiKey: normalizeResolvedSecretInputString({
			value: raw?.apiKey,
			path: "tts.providers.inworld.apiKey"
		}),
		baseUrl: normalizeInworldBaseUrl(normalizeOptionalString(raw?.baseUrl)),
		voiceId: normalizeOptionalString(raw?.voiceId) ?? "Sarah",
		modelId: normalizeOptionalString(raw?.modelId) ?? "inworld-tts-1.5-max",
		temperature: normalizeInworldTemperature(raw?.temperature),
		speakingRate: normalizeInworldSpeakingRate(raw?.speakingRate),
		deliveryMode: normalizeInworldDeliveryMode(raw?.deliveryMode)
	};
}
function readInworldProviderConfig(config) {
	return normalizeInworldProviderConfig({ providers: { inworld: {
		...config,
		apiKey: normalizeOptionalString(config.apiKey)
	} } });
}
function resolveInworldApiKey(primary, fallback) {
	return resolveSpeechProviderApiKey(primary, fallback, process.env.INWORLD_API_KEY);
}
async function synthesizeInworld(req) {
	const config = readInworldProviderConfig(req.providerConfig);
	const overrides = req.providerOverrides;
	const apiKey = resolveInworldApiKey(config.apiKey);
	if (!apiKey) throw new Error("Inworld API key missing");
	return inworldTTS({
		text: req.text,
		apiKey,
		baseUrl: config.baseUrl,
		voiceId: normalizeOptionalString(overrides?.voiceId ?? overrides?.voice) ?? config.voiceId,
		modelId: normalizeOptionalString(overrides?.modelId ?? overrides?.model) ?? config.modelId,
		audioEncoding: req.audioEncoding,
		...req.sampleRateHertz === void 0 ? {} : { sampleRateHertz: req.sampleRateHertz },
		temperature: normalizeInworldTemperature(overrides?.temperature) ?? config.temperature,
		speakingRate: normalizeInworldSpeakingRate(overrides?.speakingRate ?? overrides?.speed) ?? config.speakingRate,
		deliveryMode: normalizeInworldDeliveryMode(overrides?.deliveryMode) ?? config.deliveryMode,
		timeoutMs: req.timeoutMs
	});
}
const parseDirectiveToken = createSpeechDirectiveParser({
	temperature: [
		"allowVoiceSettings",
		["temperature"],
		{ number: {
			range: {
				min: 0,
				minExclusive: true,
				max: 2
			},
			warning: (value) => `invalid Inworld temperature "${value}"`
		} }
	],
	voiceId: ["allowVoice", [
		"voice",
		"voiceid",
		"voice_id",
		"inworld_voice",
		"inworldvoice"
	]],
	modelId: ["allowModelId", [
		"model",
		"modelid",
		"model_id",
		"inworld_model",
		"inworldmodel"
	]],
	speakingRate: [
		"allowVoiceSettings",
		[
			"speed",
			"speaking_rate",
			"speakingrate",
			"inworld_speed",
			"inworldspeed"
		],
		{ number: {
			range: INWORLD_SPEAKING_RATE_RANGE,
			warning: (value) => `invalid Inworld speaking rate "${value}" (0.5-1.5)`
		} }
	],
	deliveryMode: [
		"allowVoiceSettings",
		[
			"delivery",
			"delivery_mode",
			"deliverymode",
			"inworld_delivery"
		],
		{ parse: ({ value }) => {
			const deliveryMode = normalizeInworldDeliveryMode(value);
			return deliveryMode ? {
				handled: true,
				overrides: { deliveryMode }
			} : {
				handled: true,
				warnings: [`invalid Inworld delivery mode "${value}" (stable, balanced, creative)`]
			};
		} }
	]
});
function buildInworldSpeechProvider() {
	const isConfigured = ({ providerConfig }) => Boolean(resolveInworldApiKey(readInworldProviderConfig(providerConfig).apiKey));
	return {
		id: "inworld",
		label: "Inworld",
		autoSelectOrder: 30,
		defaultModel: DEFAULT_INWORLD_MODEL_ID,
		models: INWORLD_TTS_MODELS,
		resolveConfig: ({ rawConfig }) => normalizeInworldProviderConfig(rawConfig),
		parseDirectiveToken,
		resolveTalkConfig: ({ baseTtsConfig, talkProviderConfig }) => {
			const base = normalizeInworldProviderConfig(baseTtsConfig);
			const resolvedApiKey = talkProviderConfig.apiKey === void 0 ? void 0 : normalizeResolvedSecretInputString({
				value: talkProviderConfig.apiKey,
				path: "talk.providers.inworld.apiKey"
			});
			return {
				...base,
				...filterStringRecord({
					apiKey: resolvedApiKey,
					baseUrl: normalizeOptionalString(talkProviderConfig.baseUrl) ? normalizeInworldBaseUrl(normalizeOptionalString(talkProviderConfig.baseUrl)) : void 0,
					voiceId: normalizeOptionalString(talkProviderConfig.voiceId),
					modelId: normalizeOptionalString(talkProviderConfig.modelId)
				}),
				temperature: normalizeInworldTemperature(talkProviderConfig.temperature) ?? base.temperature,
				speakingRate: normalizeInworldSpeakingRate(talkProviderConfig.speakingRate) ?? base.speakingRate,
				deliveryMode: normalizeInworldDeliveryMode(talkProviderConfig.deliveryMode) ?? base.deliveryMode
			};
		},
		resolveTalkOverrides: ({ params }) => ({
			...filterStringRecord({
				voiceId: normalizeOptionalString(params.voiceId),
				modelId: normalizeOptionalString(params.modelId)
			}),
			...normalizeInworldTemperature(params.temperature) == null ? {} : { temperature: normalizeInworldTemperature(params.temperature) },
			...normalizeInworldSpeakingRate(params.speed) == null ? {} : { speakingRate: normalizeInworldSpeakingRate(params.speed) }
		}),
		listVoices: async (req) => {
			const config = req.providerConfig ? readInworldProviderConfig(req.providerConfig) : void 0;
			const apiKey = resolveInworldApiKey(req.apiKey, config?.apiKey);
			if (!apiKey) throw new Error("Inworld API key missing");
			return listInworldVoices({
				apiKey,
				baseUrl: req.baseUrl ?? config?.baseUrl,
				timeoutMs: req.timeoutMs
			});
		},
		isConfigured,
		isConfiguredAsync: async (ctx) => isConfigured(ctx),
		synthesize: async (req) => {
			const useOpus = req.target === "voice-note";
			const audioEncoding = useOpus ? "OGG_OPUS" : "MP3";
			return {
				audioBuffer: await synthesizeInworld({
					...req,
					audioEncoding
				}),
				outputFormat: audioEncoding.toLowerCase(),
				fileExtension: useOpus ? ".ogg" : ".mp3",
				voiceCompatible: useOpus
			};
		},
		synthesizeTelephony: async (req) => {
			const sampleRate = 22050;
			return {
				audioBuffer: await synthesizeInworld({
					...req,
					audioEncoding: "PCM",
					sampleRateHertz: sampleRate
				}),
				outputFormat: "pcm",
				sampleRate
			};
		}
	};
}
export { buildInworldSpeechProvider };
