import { l as normalizeOptionalString } from "../../string-coerce-CIXf7egm.mjs";
import "../../string-coerce-runtime-C_MKhRVt.mjs";
import { a as normalizeXaiTtsBaseUrl, c as resolveDirectXaiAudioApiKey, l as resolveXaiSpeechResponseFormat, o as readXaiSpeechOverrides, s as readXaiSpeechProviderConfig, t as XAI_TTS_FALLBACK_VOICES, u as xaiSpeechResponseFormatToFileExtension } from "../../speech-provider-metadata-factory-UbZbU00a.mjs";
import { t as createXaiSpeechProviderMetadata } from "../../speech-provider-metadata-B5HDsgTz.mjs";
import { n as xaiTTS, r as xaiTTSStream, t as listXaiTtsVoices } from "../../tts-Gj9-isDj.mjs";
//#region extensions/xai/speech-provider.ts
async function resolveXaiSpeechSynthesisRequest(req, forcedResponseFormat) {
	const config = readXaiSpeechProviderConfig(req.providerConfig);
	const overrides = readXaiSpeechOverrides(req.providerOverrides);
	const { resolveGeneratedMediaMaxBytes } = await import("../../plugin-sdk/media-generation-runtime.js");
	return {
		text: req.text,
		apiKey: await resolveXaiAudioApiKey(config.apiKey, req.cfg),
		baseUrl: config.baseUrl,
		voiceId: overrides.voiceId ?? config.voiceId,
		language: overrides.language ?? config.language,
		speed: overrides.speed ?? config.speed,
		responseFormat: forcedResponseFormat ?? resolveXaiSpeechResponseFormat(req.target, config.responseFormat),
		timeoutMs: req.timeoutMs,
		maxBytes: resolveGeneratedMediaMaxBytes(req.cfg, "audio")
	};
}
function buildXaiSpeechProvider() {
	return {
		...createXaiSpeechProviderMetadata(),
		listVoices: async (req) => {
			const config = readXaiSpeechProviderConfig(req.providerConfig ?? {});
			const apiKey = await resolveOptionalXaiAudioApiKey(normalizeOptionalString(req.apiKey) ?? config.apiKey, req.cfg);
			if (!apiKey) return XAI_TTS_FALLBACK_VOICES.map((voice) => ({
				id: voice,
				name: voice
			}));
			return await listXaiTtsVoices({
				apiKey,
				baseUrl: normalizeXaiTtsBaseUrl(normalizeOptionalString(req.baseUrl) ?? config.baseUrl)
			});
		},
		synthesize: async (req) => {
			const params = await resolveXaiSpeechSynthesisRequest(req);
			return {
				audioBuffer: await xaiTTS(params),
				outputFormat: params.responseFormat,
				fileExtension: xaiSpeechResponseFormatToFileExtension(params.responseFormat),
				voiceCompatible: false
			};
		},
		streamSynthesize: async (req) => {
			const params = await resolveXaiSpeechSynthesisRequest(req);
			const stream = await xaiTTSStream(params);
			return {
				audioStream: stream.audioStream,
				outputFormat: params.responseFormat,
				fileExtension: xaiSpeechResponseFormatToFileExtension(params.responseFormat),
				voiceCompatible: false,
				release: stream.release
			};
		},
		synthesizeTelephony: async (req) => {
			const params = await resolveXaiSpeechSynthesisRequest(req, "pcm");
			return {
				audioBuffer: await xaiTTS(params),
				outputFormat: "pcm",
				sampleRate: 24e3
			};
		}
	};
}
async function resolveOptionalXaiAudioApiKey(configApiKey, cfg) {
	const direct = resolveDirectXaiAudioApiKey(configApiKey);
	if (direct) return direct;
	if (!cfg) return;
	const { resolveApiKeyForProvider } = await import("../../plugin-sdk/provider-auth-runtime.js");
	const auth = await resolveApiKeyForProvider({
		provider: "xai",
		cfg
	});
	return normalizeOptionalString(auth?.apiKey);
}
async function resolveXaiAudioApiKey(configApiKey, cfg) {
	const apiKey = await resolveOptionalXaiAudioApiKey(configApiKey, cfg);
	if (apiKey) return apiKey;
	throw new Error("xAI credentials missing for TTS. Sign in with `openclaw onboard --auth-choice xai-oauth`, or run `openclaw onboard --auth-choice xai-api-key`, or set XAI_API_KEY.");
}
//#endregion
export { buildXaiSpeechProvider };
