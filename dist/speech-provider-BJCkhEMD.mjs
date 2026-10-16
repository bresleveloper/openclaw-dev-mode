import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { a as asOptionalRecord } from "./record-coerce-TIsquoVR.mjs";
import { d as normalizeResolvedSecretInputString } from "./types.secrets-DsPRn9Dz.mjs";
import { t as retryAsync } from "./retry-DH6xHyXB.mjs";
import "./string-coerce-runtime-50qKeWeL.mjs";
import "./secret-input-BXhRrpGu.mjs";
import "./speech-provider-BrKfPUGI.mjs";
import { n as resolveGoogleEnvApiKey } from "./gemini-auth-ms1_pxuH.mjs";
import { t as GOOGLE_PREBUILT_VOICES } from "./voice-catalog-D5KYybOO.mjs";
import { a as assertSupportedGoogleTtsModel, c as normalizeGoogleTtsModel, i as GOOGLE_TTS_SAMPLE_RATE, l as normalizeGoogleTtsVoiceName, o as isGoogleInteractionsTtsModel, r as GOOGLE_TTS_MODELS, s as normalizeGooglePromptTemplate, t as DEFAULT_GOOGLE_TTS_MODEL } from "./speech-models-C0BKgLl9.mjs";
import { n as readGoogleTtsSpeakers } from "./speech-dialogue-CfuQrPCc.mjs";
import { a as synthesizeGoogleTtsPcmOnce, i as renderGoogleAudioProfilePrompt, n as isOpenClawGoogleAudioProfilePrompt, o as wrapPcm16MonoToWav, r as prepareGoogleInteractionsSynthesis, t as isGoogleTtsRetryableError } from "./speech-synthesis-DS38PIlK.mjs";
//#region extensions/google/speech-provider.ts
function resolveGoogleTtsApiKey(params) {
	return params.providerConfig.apiKey ?? normalizeResolvedSecretInputString({
		value: params.cfg?.models?.providers?.google?.apiKey,
		path: "models.providers.google.apiKey"
	}) ?? resolveGoogleEnvApiKey();
}
function normalizeGoogleTtsProviderConfig(rawConfig) {
	const providers = asOptionalRecord(rawConfig.providers);
	const raw = asOptionalRecord(providers?.google) ?? asOptionalRecord(rawConfig.google);
	return {
		...readGoogleTtsProviderConfig(raw ?? {}),
		apiKey: normalizeResolvedSecretInputString({
			value: raw?.apiKey,
			path: "tts.providers.google.apiKey"
		})
	};
}
function readGoogleTtsProviderConfig(config) {
	const promptTemplate = normalizeGooglePromptTemplate(config.promptTemplate);
	const personaPrompt = normalizeOptionalString(config.personaPrompt);
	const speakers = readGoogleTtsSpeakers(config.speakers);
	return {
		apiKey: normalizeOptionalString(config.apiKey),
		baseUrl: normalizeOptionalString(config.baseUrl),
		model: normalizeGoogleTtsModel(config.model),
		voiceName: normalizeGoogleTtsVoiceName(config.voiceName ?? config.voice),
		audioProfile: normalizeOptionalString(config.audioProfile),
		speakerName: normalizeOptionalString(config.speakerName),
		...speakers ? { speakers } : {},
		...promptTemplate ? { promptTemplate } : {},
		...personaPrompt ? { personaPrompt } : {}
	};
}
function readGoogleTtsOverrides(overrides) {
	if (!overrides) return {};
	return {
		model: normalizeOptionalString(overrides.model),
		voiceName: normalizeOptionalString(overrides.voiceName ?? overrides.voice),
		audioProfile: normalizeOptionalString(overrides.audioProfile),
		speakerName: normalizeOptionalString(overrides.speakerName)
	};
}
function parseDirectiveToken(ctx) {
	switch (ctx.key) {
		case "voicename":
		case "voice_name":
		case "google_voice":
		case "googlevoice":
			if (!ctx.policy.allowVoice) return { handled: true };
			return {
				handled: true,
				overrides: { voiceName: ctx.value }
			};
		case "google_model":
		case "googlemodel":
			if (!ctx.policy.allowModelId) return { handled: true };
			return {
				handled: true,
				overrides: { model: ctx.value }
			};
		default: return { handled: false };
	}
}
async function synthesizeConfiguredGoogleTts(req) {
	const config = readGoogleTtsProviderConfig(req.providerConfig);
	const overrides = readGoogleTtsOverrides(req.providerOverrides);
	const apiKey = resolveGoogleTtsApiKey({
		cfg: req.cfg,
		providerConfig: config
	});
	if (!apiKey) throw new Error("Google API key missing");
	const { sanitizeConfiguredModelProviderRequest } = await import("./plugin-sdk/provider-http.js");
	const params = {
		text: req.text,
		apiKey,
		baseUrl: config.baseUrl ?? normalizeOptionalString(req.cfg?.models?.providers?.google?.baseUrl),
		request: sanitizeConfiguredModelProviderRequest(req.cfg?.models?.providers?.google?.request),
		model: normalizeGoogleTtsModel(overrides.model ?? config.model),
		voiceName: normalizeGoogleTtsVoiceName(overrides.voiceName ?? config.voiceName),
		audioProfile: overrides.audioProfile ?? config.audioProfile,
		speakerName: overrides.speakerName ?? config.speakerName,
		speakers: config.speakers,
		personaPrompt: config.personaPrompt,
		timeoutMs: req.timeoutMs
	};
	return retryAsync(() => synthesizeGoogleTtsPcmOnce(params), {
		attempts: 2,
		minDelayMs: 0,
		shouldRetry: isGoogleTtsRetryableError
	});
}
function buildGoogleSpeechProvider() {
	return {
		id: "google",
		label: "Google",
		autoSelectOrder: 50,
		defaultModel: DEFAULT_GOOGLE_TTS_MODEL,
		models: GOOGLE_TTS_MODELS,
		voices: GOOGLE_PREBUILT_VOICES,
		resolveConfig: ({ rawConfig }) => normalizeGoogleTtsProviderConfig(rawConfig),
		parseDirectiveToken,
		resolveTalkConfig: ({ baseTtsConfig, talkProviderConfig }) => {
			return {
				...normalizeGoogleTtsProviderConfig(baseTtsConfig),
				...talkProviderConfig.apiKey === void 0 ? {} : { apiKey: normalizeResolvedSecretInputString({
					value: talkProviderConfig.apiKey,
					path: "talk.providers.google.apiKey"
				}) },
				...normalizeOptionalString(talkProviderConfig.baseUrl) == null ? {} : { baseUrl: normalizeOptionalString(talkProviderConfig.baseUrl) },
				...normalizeOptionalString(talkProviderConfig.modelId) == null ? {} : { model: normalizeGoogleTtsModel(talkProviderConfig.modelId) },
				...normalizeOptionalString(talkProviderConfig.voiceId) == null ? {} : { voiceName: normalizeGoogleTtsVoiceName(talkProviderConfig.voiceId) }
			};
		},
		resolveTalkOverrides: ({ params }) => ({
			...normalizeOptionalString(params.voiceId) == null ? {} : { voiceName: normalizeGoogleTtsVoiceName(params.voiceId) },
			...normalizeOptionalString(params.modelId) == null ? {} : { model: normalizeGoogleTtsModel(params.modelId) }
		}),
		listVoices: async () => GOOGLE_PREBUILT_VOICES.map((voice) => ({
			id: voice,
			name: voice
		})),
		isConfigured: ({ cfg, providerConfig }) => Boolean(resolveGoogleTtsApiKey({
			cfg,
			providerConfig: readGoogleTtsProviderConfig(providerConfig)
		})),
		prepareSynthesis: (ctx) => {
			const config = readGoogleTtsProviderConfig(ctx.providerConfig);
			const overrides = readGoogleTtsOverrides(ctx.providerOverrides);
			const model = normalizeGoogleTtsModel(overrides.model ?? config.model);
			assertSupportedGoogleTtsModel(model);
			if (isGoogleInteractionsTtsModel(model)) return prepareGoogleInteractionsSynthesis(ctx.text);
			if (!(config.promptTemplate === "audio-profile-v1" || Boolean(config.personaPrompt)) || isOpenClawGoogleAudioProfilePrompt(ctx.text)) return;
			return { text: renderGoogleAudioProfilePrompt({
				text: ctx.text,
				persona: ctx.persona,
				personaPrompt: config.personaPrompt
			}) };
		},
		synthesize: async (req) => {
			const pcm = await synthesizeConfiguredGoogleTts(req);
			if (req.target === "voice-note") {
				const { transcodeAudioBufferToOpus } = await import("./plugin-sdk/media-runtime.js");
				return {
					audioBuffer: await transcodeAudioBufferToOpus({
						audioBuffer: wrapPcm16MonoToWav(pcm),
						inputExtension: "wav",
						tempPrefix: "tts-google-",
						timeoutMs: req.timeoutMs
					}),
					outputFormat: "opus",
					fileExtension: ".opus",
					voiceCompatible: true
				};
			}
			return {
				audioBuffer: wrapPcm16MonoToWav(pcm),
				outputFormat: "wav",
				fileExtension: ".wav",
				voiceCompatible: false
			};
		},
		synthesizeTelephony: async (req) => {
			return {
				audioBuffer: await synthesizeConfiguredGoogleTts(req),
				outputFormat: "pcm",
				sampleRate: GOOGLE_TTS_SAMPLE_RATE
			};
		}
	};
}
//#endregion
export { buildGoogleSpeechProvider as t };
