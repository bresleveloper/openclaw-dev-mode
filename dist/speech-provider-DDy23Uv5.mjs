import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { s as asFiniteNumber } from "./number-coercion-CuVhdCBs.mjs";
import { a as asOptionalRecord, s as filterStringRecord } from "./record-coerce-TIsquoVR.mjs";
import { d as normalizeResolvedSecretInputString } from "./types.secrets-DsPRn9Dz.mjs";
import "./string-coerce-runtime-50qKeWeL.mjs";
import "./secret-input-BXhRrpGu.mjs";
import { a as resolveSpeechProviderApiKey } from "./tts-provider-helpers-CB19Mjmx.mjs";
import "./speech-provider-BrKfPUGI.mjs";
import { c as isAzureSpeechVoiceCompatible, l as listAzureSpeechVoices, o as azureSpeechTTS, r as DEFAULT_AZURE_SPEECH_TELEPHONY_FORMAT, s as inferAzureSpeechFileExtension, u as normalizeAzureSpeechBaseUrl } from "./tts-DV3btF51.mjs";
//#region extensions/azure-speech/speech-provider.ts
function readAzureSpeechEnvApiKey() {
	return normalizeOptionalString(process.env.AZURE_SPEECH_KEY) ?? normalizeOptionalString(process.env.AZURE_SPEECH_API_KEY) ?? normalizeOptionalString(process.env.SPEECH_KEY);
}
function readAzureSpeechEnvRegion() {
	return normalizeOptionalString(process.env.AZURE_SPEECH_REGION) ?? normalizeOptionalString(process.env.SPEECH_REGION);
}
function resolveAzureSpeechConfigRecord(rawConfig) {
	const providers = asOptionalRecord(rawConfig.providers);
	return asOptionalRecord(providers?.["azure-speech"]) ?? asOptionalRecord(providers?.azure) ?? asOptionalRecord(rawConfig["azure-speech"]) ?? asOptionalRecord(rawConfig.azure);
}
function normalizeAzureSpeechProviderConfig(rawConfig) {
	const raw = resolveAzureSpeechConfigRecord(rawConfig);
	const region = normalizeOptionalString(raw?.region) ?? readAzureSpeechEnvRegion();
	const endpoint = normalizeOptionalString(raw?.endpoint) ?? normalizeOptionalString(process.env.AZURE_SPEECH_ENDPOINT);
	const baseUrl = normalizeAzureSpeechBaseUrl({
		baseUrl: normalizeOptionalString(raw?.baseUrl),
		endpoint,
		region
	});
	return {
		apiKey: normalizeResolvedSecretInputString({
			value: raw?.apiKey,
			path: "tts.providers.azure-speech.apiKey"
		}),
		region,
		endpoint,
		baseUrl,
		voice: normalizeOptionalString(raw?.voice ?? raw?.voiceId) ?? "en-US-JennyNeural",
		lang: normalizeOptionalString(raw?.lang ?? raw?.languageCode) ?? "en-US",
		outputFormat: normalizeOptionalString(raw?.outputFormat) ?? "audio-24khz-48kbitrate-mono-mp3",
		voiceNoteOutputFormat: normalizeOptionalString(raw?.voiceNoteOutputFormat) ?? "ogg-24khz-16bit-mono-opus",
		timeoutMs: asFiniteNumber(raw?.timeoutMs)
	};
}
function readAzureSpeechProviderConfig(config) {
	const defaults = normalizeAzureSpeechProviderConfig({});
	const region = normalizeOptionalString(config.region) ?? defaults.region;
	const endpoint = normalizeOptionalString(config.endpoint) ?? defaults.endpoint;
	const baseUrl = normalizeAzureSpeechBaseUrl({
		baseUrl: normalizeOptionalString(config.baseUrl) ?? defaults.baseUrl,
		endpoint,
		region
	});
	return {
		apiKey: normalizeOptionalString(config.apiKey) ?? defaults.apiKey,
		region,
		endpoint,
		baseUrl,
		voice: normalizeOptionalString(config.voice ?? config.voiceId) ?? defaults.voice,
		lang: normalizeOptionalString(config.lang ?? config.languageCode) ?? defaults.lang,
		outputFormat: normalizeOptionalString(config.outputFormat) ?? defaults.outputFormat,
		voiceNoteOutputFormat: normalizeOptionalString(config.voiceNoteOutputFormat) ?? defaults.voiceNoteOutputFormat,
		timeoutMs: asFiniteNumber(config.timeoutMs) ?? defaults.timeoutMs
	};
}
function parseDirectiveToken(ctx) {
	const key = [
		"voice",
		"voiceid",
		"voice_id",
		"azure_voice",
		"azurevoice",
		"azure_speech_voice"
	].includes(ctx.key) ? "voice" : [
		"lang",
		"language",
		"language_code",
		"languagecode",
		"azure_lang",
		"azure_language"
	].includes(ctx.key) ? "lang" : [
		"output_format",
		"outputformat",
		"azure_format",
		"azure_output_format"
	].includes(ctx.key) ? "outputFormat" : void 0;
	if (!key) return { handled: false };
	return (key === "voice" ? ctx.policy.allowVoice : ctx.policy.allowVoiceSettings) ? {
		handled: true,
		overrides: {
			...ctx.currentOverrides,
			[key]: ctx.value
		}
	} : { handled: true };
}
function resolveApiKey(...candidates) {
	return resolveSpeechProviderApiKey(...candidates, readAzureSpeechEnvApiKey());
}
async function resolveAzureSpeechTtsRequest(req, outputFormatOverride) {
	const config = readAzureSpeechProviderConfig(req.providerConfig);
	const overrides = req.providerOverrides;
	const voice = normalizeOptionalString(overrides?.voice ?? overrides?.voiceId);
	const lang = normalizeOptionalString(overrides?.lang ?? overrides?.languageCode);
	const outputFormat = normalizeOptionalString(overrides?.outputFormat);
	const apiKey = resolveApiKey(config.apiKey);
	if (!apiKey) throw new Error("Azure Speech API key missing");
	const { resolveGeneratedMediaMaxBytes } = await import("./plugin-sdk/media-generation-runtime.js");
	return {
		text: req.text,
		apiKey,
		baseUrl: config.baseUrl,
		endpoint: config.endpoint,
		region: config.region,
		voice: voice ?? config.voice,
		lang: lang ?? config.lang,
		outputFormat: outputFormatOverride ?? outputFormat ?? (req.target === "voice-note" ? config.voiceNoteOutputFormat : config.outputFormat),
		timeoutMs: config.timeoutMs ?? req.timeoutMs,
		maxBytes: resolveGeneratedMediaMaxBytes(req.cfg, "audio")
	};
}
function buildAzureSpeechProvider() {
	return {
		id: "azure-speech",
		label: "Azure Speech",
		aliases: ["azure"],
		autoSelectOrder: 30,
		resolveConfig: ({ rawConfig }) => normalizeAzureSpeechProviderConfig(rawConfig),
		parseDirectiveToken,
		resolveTalkConfig: ({ baseTtsConfig, talkProviderConfig }) => {
			const base = normalizeAzureSpeechProviderConfig(baseTtsConfig);
			const apiKey = talkProviderConfig.apiKey === void 0 ? void 0 : normalizeResolvedSecretInputString({
				value: talkProviderConfig.apiKey,
				path: "talk.providers.azure-speech.apiKey"
			});
			const region = normalizeOptionalString(talkProviderConfig.region);
			const endpoint = normalizeOptionalString(talkProviderConfig.endpoint ?? talkProviderConfig.baseUrl);
			const baseUrl = normalizeAzureSpeechBaseUrl({
				baseUrl: normalizeOptionalString(talkProviderConfig.baseUrl),
				endpoint,
				region: region ?? base.region
			});
			return {
				...base,
				...filterStringRecord({
					apiKey,
					region,
					endpoint,
					baseUrl,
					voice: normalizeOptionalString(talkProviderConfig.voiceId),
					lang: normalizeOptionalString(talkProviderConfig.languageCode),
					outputFormat: normalizeOptionalString(talkProviderConfig.outputFormat)
				})
			};
		},
		resolveTalkOverrides: ({ params }) => filterStringRecord({
			voice: normalizeOptionalString(params.voiceId),
			lang: normalizeOptionalString(params.languageCode),
			outputFormat: normalizeOptionalString(params.outputFormat)
		}) ?? {},
		listVoices: async (req) => {
			const config = req.providerConfig ? readAzureSpeechProviderConfig(req.providerConfig) : void 0;
			const apiKey = resolveApiKey(req.apiKey, config?.apiKey);
			if (!apiKey) throw new Error("Azure Speech API key missing");
			return listAzureSpeechVoices({
				apiKey,
				baseUrl: req.baseUrl ?? config?.baseUrl,
				endpoint: config?.endpoint,
				region: config?.region ?? readAzureSpeechEnvRegion(),
				timeoutMs: config?.timeoutMs ?? req.timeoutMs
			});
		},
		isConfigured: ({ providerConfig }) => {
			const config = readAzureSpeechProviderConfig(providerConfig);
			return Boolean(resolveApiKey(config.apiKey) && (config.baseUrl || config.region || config.endpoint));
		},
		synthesize: async (req) => {
			const params = await resolveAzureSpeechTtsRequest(req);
			const audioBuffer = await azureSpeechTTS(params);
			const outputFormat = params.outputFormat;
			return {
				audioBuffer,
				outputFormat,
				fileExtension: inferAzureSpeechFileExtension(outputFormat),
				voiceCompatible: isAzureSpeechVoiceCompatible(outputFormat)
			};
		},
		synthesizeTelephony: async (req) => {
			const params = await resolveAzureSpeechTtsRequest({
				...req,
				target: "telephony"
			}, DEFAULT_AZURE_SPEECH_TELEPHONY_FORMAT);
			return {
				audioBuffer: await azureSpeechTTS(params),
				outputFormat: DEFAULT_AZURE_SPEECH_TELEPHONY_FORMAT,
				sampleRate: 8e3
			};
		}
	};
}
//#endregion
export { buildAzureSpeechProvider as t };
