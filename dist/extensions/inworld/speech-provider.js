import { DEFAULT_INWORLD_MODEL_ID, INWORLD_TTS_MODELS, inworldTTS, listInworldVoices, normalizeInworldBaseUrl } from "./tts.js";
import { normalizeResolvedSecretInputString } from "openclaw/plugin-sdk/secret-input";
import { parseSpeechDirectiveNumberOverride, resolveSpeechProviderApiKey } from "openclaw/plugin-sdk/speech-provider";
import { asFiniteNumberInRange, asOptionalRecord, filterStringRecord, normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
//#region extensions/inworld/speech-provider.ts
function normalizeInworldTemperature(value) {
	return asFiniteNumberInRange(value, {
		min: 0,
		minExclusive: true,
		max: 2
	});
}
function normalizeInworldProviderConfig(rawConfig) {
	const providers = asOptionalRecord(rawConfig.providers);
	const raw = asOptionalRecord(providers?.inworld) ?? asOptionalRecord(rawConfig.inworld);
	return {
		apiKey: normalizeResolvedSecretInputString({
			value: raw?.apiKey,
			path: "tts.providers.inworld.apiKey"
		}),
		baseUrl: normalizeInworldBaseUrl(normalizeOptionalString(raw?.baseUrl)),
		voiceId: normalizeOptionalString(raw?.voiceId) ?? "Sarah",
		modelId: normalizeOptionalString(raw?.modelId) ?? "inworld-tts-1.5-max",
		temperature: normalizeInworldTemperature(raw?.temperature)
	};
}
function readInworldProviderConfig(config) {
	return normalizeInworldProviderConfig({ inworld: {
		...config,
		apiKey: normalizeOptionalString(config.apiKey)
	} });
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
		timeoutMs: req.timeoutMs
	});
}
function parseDirectiveToken(ctx) {
	if (ctx.key === "temperature") return parseSpeechDirectiveNumberOverride({
		ctx,
		overrideKey: "temperature",
		range: {
			min: 0,
			minExclusive: true,
			max: 2
		},
		warning: (value) => `invalid Inworld temperature "${value}"`
	});
	const key = [
		"voice",
		"voiceid",
		"voice_id",
		"inworld_voice",
		"inworldvoice"
	].includes(ctx.key) ? "voiceId" : [
		"model",
		"modelid",
		"model_id",
		"inworld_model",
		"inworldmodel"
	].includes(ctx.key) ? "modelId" : void 0;
	if (!key) return { handled: false };
	return (key === "voiceId" ? ctx.policy.allowVoice : ctx.policy.allowModelId) ? {
		handled: true,
		overrides: { [key]: ctx.value }
	} : { handled: true };
}
function buildInworldSpeechProvider() {
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
				...normalizeInworldTemperature(talkProviderConfig.temperature) == null ? {} : { temperature: normalizeInworldTemperature(talkProviderConfig.temperature) }
			};
		},
		resolveTalkOverrides: ({ params }) => ({
			...filterStringRecord({
				voiceId: normalizeOptionalString(params.voiceId),
				modelId: normalizeOptionalString(params.modelId)
			}),
			...normalizeInworldTemperature(params.temperature) == null ? {} : { temperature: normalizeInworldTemperature(params.temperature) }
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
		isConfigured: ({ providerConfig }) => Boolean(resolveInworldApiKey(readInworldProviderConfig(providerConfig).apiKey)),
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
//#endregion
export { buildInworldSpeechProvider };
