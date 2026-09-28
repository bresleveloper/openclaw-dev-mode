import { c as asFiniteNumberInRange } from "./number-coercion-CLj0HTDM.mjs";
import { i as asOptionalObjectRecord } from "./record-coerce-DItp3I4t.mjs";
import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { l as normalizeResolvedSecretInputString } from "./types.secrets-B5xWSzLp.mjs";
import "./string-coerce-runtime-C_MKhRVt.mjs";
import "./secret-input-DTg0P0Pk.mjs";
import { t as XAI_BASE_URL } from "./model-definitions-DA8Fbxqz.mjs";
//#region extensions/xai/speech-provider-metadata-factory.ts
const XAI_SPEECH_RESPONSE_FORMATS = [
	"mp3",
	"wav",
	"pcm",
	"mulaw",
	"alaw"
];
const XAI_TTS_FALLBACK_VOICES = [
	"ara",
	"eve",
	"leo",
	"rex",
	"sal"
];
function normalizeXaiTtsBaseUrl(baseUrl) {
	return normalizeOptionalString(baseUrl)?.replace(/\/+$/, "") ?? XAI_BASE_URL;
}
function isValidXaiTtsVoice(voice) {
	return normalizeOptionalString(voice) !== void 0;
}
function normalizeXaiLanguageCode(value) {
	const normalized = normalizeOptionalString(value)?.toLowerCase();
	if (!normalized) return;
	if (normalized === "auto" || /^[a-z]{2,3}(?:-[a-z]{2,4})?$/.test(normalized)) return normalized;
	throw new Error(`xAI language must be "auto" or a BCP-47 tag (e.g. "en", "pt-br", "zh-cn"); got: ${normalized}`);
}
function normalizeXaiSpeechSpeed(value) {
	return asFiniteNumberInRange(value, {
		min: .7,
		max: 1.5
	});
}
function normalizeXaiSpeechResponseFormat(value) {
	const next = normalizeLowercaseStringOrEmpty(value);
	if (!next) return;
	const format = XAI_SPEECH_RESPONSE_FORMATS.find((candidate) => candidate === next);
	if (format) return format;
	throw new Error(`Invalid xAI speech responseFormat: ${next}`);
}
function resolveXaiSpeechResponseFormat(target, configuredFormat) {
	return target === "voice-note" ? "mp3" : configuredFormat ?? "mp3";
}
function xaiSpeechResponseFormatToFileExtension(format) {
	switch (format) {
		case "wav": return ".wav";
		case "pcm": return ".pcm";
		case "mulaw": return ".mulaw";
		case "alaw": return ".alaw";
		default: return ".mp3";
	}
}
function normalizeXaiSpeechProviderConfig(rawConfig) {
	const providers = asOptionalObjectRecord(rawConfig.providers);
	const xai = asOptionalObjectRecord(providers?.xai ?? rawConfig.xai ?? rawConfig) ?? {};
	return {
		apiKey: normalizeResolvedSecretInputString({
			value: xai.apiKey,
			path: "tts.providers.xai.apiKey"
		}),
		baseUrl: normalizeXaiTtsBaseUrl(normalizeOptionalString(xai.baseUrl) ?? normalizeOptionalString(process.env.XAI_BASE_URL) ?? XAI_BASE_URL),
		voiceId: normalizeOptionalString(xai.voiceId ?? xai.voice) ?? "eve",
		language: normalizeXaiLanguageCode(xai.language ?? xai.languageCode),
		speed: normalizeXaiSpeechSpeed(xai.speed),
		responseFormat: normalizeXaiSpeechResponseFormat(xai.responseFormat)
	};
}
function readXaiSpeechProviderConfig(config) {
	const normalized = normalizeXaiSpeechProviderConfig({});
	return {
		apiKey: normalizeOptionalString(config.apiKey) ?? normalized.apiKey,
		baseUrl: normalizeOptionalString(config.baseUrl) ?? normalized.baseUrl,
		voiceId: normalizeOptionalString(config.voiceId ?? config.voice) ?? normalized.voiceId,
		language: normalizeXaiLanguageCode(config.language ?? config.languageCode) ?? normalized.language,
		speed: normalizeXaiSpeechSpeed(config.speed) ?? normalized.speed,
		responseFormat: normalizeXaiSpeechResponseFormat(config.responseFormat) ?? normalized.responseFormat
	};
}
function readXaiSpeechOverrides(overrides) {
	if (!overrides) return {};
	return {
		voiceId: normalizeOptionalString(overrides.voiceId ?? overrides.voice),
		language: normalizeXaiLanguageCode(overrides.language),
		speed: normalizeXaiSpeechSpeed(overrides.speed)
	};
}
function resolveDirectXaiAudioApiKey(configApiKey) {
	return normalizeOptionalString(configApiKey) ?? normalizeOptionalString(process.env.XAI_API_KEY);
}
function parseXaiSpeechDirectiveToken(ctx) {
	switch (ctx.key) {
		case "voice":
		case "voice_id":
		case "voiceid":
		case "xai_voice":
		case "xaivoice":
			if (!ctx.policy.allowVoice) return { handled: true };
			if (!isValidXaiTtsVoice(ctx.value)) return {
				handled: true,
				warnings: [`invalid xAI voice "${ctx.value}"`]
			};
			return {
				handled: true,
				overrides: { voiceId: ctx.value }
			};
		default: return { handled: false };
	}
}
function createXaiSpeechProviderMetadata(context) {
	return {
		id: "xai",
		label: "xAI",
		autoSelectOrder: 25,
		models: [],
		voices: XAI_TTS_FALLBACK_VOICES,
		resolveConfig: ({ rawConfig }) => normalizeXaiSpeechProviderConfig(rawConfig),
		parseDirectiveToken: parseXaiSpeechDirectiveToken,
		resolveTalkConfig: ({ baseTtsConfig, talkProviderConfig }) => {
			const base = normalizeXaiSpeechProviderConfig(baseTtsConfig);
			const responseFormat = normalizeXaiSpeechResponseFormat(talkProviderConfig.responseFormat);
			return {
				...base,
				...talkProviderConfig.apiKey === void 0 ? {} : { apiKey: normalizeResolvedSecretInputString({
					value: talkProviderConfig.apiKey,
					path: "talk.providers.xai.apiKey"
				}) },
				...normalizeOptionalString(talkProviderConfig.baseUrl) === void 0 ? {} : { baseUrl: normalizeXaiTtsBaseUrl(normalizeOptionalString(talkProviderConfig.baseUrl)) },
				...normalizeOptionalString(talkProviderConfig.voiceId) === void 0 ? {} : { voiceId: normalizeOptionalString(talkProviderConfig.voiceId) },
				...normalizeXaiLanguageCode(talkProviderConfig.language ?? talkProviderConfig.languageCode) === void 0 ? {} : { language: normalizeXaiLanguageCode(talkProviderConfig.language ?? talkProviderConfig.languageCode) },
				...normalizeXaiSpeechSpeed(talkProviderConfig.speed) === void 0 ? {} : { speed: normalizeXaiSpeechSpeed(talkProviderConfig.speed) },
				...responseFormat === void 0 ? {} : { responseFormat }
			};
		},
		resolveTalkOverrides: ({ params }) => ({
			...normalizeOptionalString(params.voiceId ?? params.voice) === void 0 ? {} : { voiceId: normalizeOptionalString(params.voiceId ?? params.voice) },
			...normalizeXaiLanguageCode(params.language ?? params.languageCode) === void 0 ? {} : { language: normalizeXaiLanguageCode(params.language ?? params.languageCode) },
			...normalizeXaiSpeechSpeed(params.speed) === void 0 ? {} : { speed: normalizeXaiSpeechSpeed(params.speed) }
		}),
		isConfigured: ({ providerConfig, cfg }) => Boolean(resolveDirectXaiAudioApiKey(readXaiSpeechProviderConfig(providerConfig).apiKey)) || context.isProviderAuthProfileConfigured({
			provider: "xai",
			cfg
		})
	};
}
//#endregion
export { normalizeXaiTtsBaseUrl as a, resolveDirectXaiAudioApiKey as c, normalizeXaiLanguageCode as i, resolveXaiSpeechResponseFormat as l, createXaiSpeechProviderMetadata as n, readXaiSpeechOverrides as o, isValidXaiTtsVoice as r, readXaiSpeechProviderConfig as s, XAI_TTS_FALLBACK_VOICES as t, xaiSpeechResponseFormatToFileExtension as u };
