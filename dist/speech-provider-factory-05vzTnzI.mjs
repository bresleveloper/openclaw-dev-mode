import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { S as parseStrictInteger, c as asFiniteNumberInRange, f as asSafeIntegerInRange, x as parseStrictFiniteNumber } from "./number-coercion-CuVhdCBs.mjs";
import { n as parseBooleanValue, t as asBoolean } from "./boolean-BEb0Fdt8.mjs";
import { a as asOptionalRecord } from "./record-coerce-TIsquoVR.mjs";
import { d as normalizeResolvedSecretInputString } from "./types.secrets-DsPRn9Dz.mjs";
import "./string-coerce-runtime-50qKeWeL.mjs";
import "./number-runtime-CgyXj1A5.mjs";
import "./secret-input-BXhRrpGu.mjs";
import { a as resolveSpeechProviderApiKey, i as requireInRange, n as normalizeLanguageCode, r as normalizeSeed, t as normalizeApplyTextNormalization } from "./tts-provider-helpers-CB19Mjmx.mjs";
import "./speech-provider-BrKfPUGI.mjs";
import { n as isValidElevenLabsVoiceId, r as normalizeElevenLabsBaseUrl } from "./shared-C4zbmF0I.mjs";
import { i as resolveElevenLabsApiKeyWithProfileFallback } from "./config-compat-CXt80ClX.mjs";
import "./config-api-DRaEsdrR.mjs";
import { n as elevenLabsTTSStream, t as elevenLabsTTS } from "./tts-Ceky-9V6.mjs";
//#region extensions/elevenlabs/speech-provider-factory.ts
const DEFAULT_ELEVENLABS_VOICE_ID = "pMsXgVXv3BLzUgSXRplE";
const DEFAULT_ELEVENLABS_MODEL_ID = "eleven_multilingual_v2";
const DEFAULT_ELEVENLABS_VOICE_SETTINGS = {
	stability: .5,
	similarityBoost: .75,
	style: 0,
	useSpeakerBoost: true,
	speed: 1
};
const ELEVENLABS_TTS_MODELS = [
	"eleven_v3",
	"eleven_multilingual_v2",
	"eleven_flash_v2_5",
	"eleven_flash_v2",
	"eleven_turbo_v2_5",
	"eleven_monolingual_v1"
];
function normalizeElevenLabsTtsModelId(value) {
	switch (value) {
		case "eleven_turbo_v2_5": return "eleven_flash_v2_5";
		case "eleven_turbo_v2": return "eleven_flash_v2";
		default: return value;
	}
}
function normalizeElevenLabsSeed(value) {
	return asSafeIntegerInRange(value, {
		min: 0,
		max: 4294967295
	});
}
function normalizeElevenLabsLatencyTier(value) {
	return asSafeIntegerInRange(value, {
		min: 0,
		max: 4
	});
}
const ELEVENLABS_OUTPUT_FAMILIES = /* @__PURE__ */ new Set([
	"opus",
	"mp3",
	"pcm",
	"ulaw",
	"alaw",
	"wav"
]);
function resolveElevenLabsOutputPlan(req) {
	const outputFormat = normalizeOptionalString(req.providerOverrides?.outputFormat) ?? (req.target === "voice-note" ? "opus_48000_64" : "mp3_44100_128");
	const family = outputFormat.trim().toLowerCase().split("_", 1)[0];
	return {
		outputFormat,
		fileExtension: family && ELEVENLABS_OUTPUT_FAMILIES.has(family) ? `.${family}` : ".bin",
		voiceCompatible: family === "opus"
	};
}
function definedSettings(settings) {
	const defined = { ...settings };
	for (const key in defined) if (defined[key] === void 0) delete defined[key];
	return defined;
}
function normalizeVoiceSettings(raw) {
	return definedSettings({
		stability: asFiniteNumberInRange(raw?.stability, {
			min: 0,
			max: 1
		}),
		similarityBoost: asFiniteNumberInRange(raw?.similarityBoost, {
			min: 0,
			max: 1
		}),
		style: asFiniteNumberInRange(raw?.style, {
			min: 0,
			max: 1
		}),
		useSpeakerBoost: asBoolean(raw?.useSpeakerBoost),
		speed: asFiniteNumberInRange(raw?.speed, {
			min: .5,
			max: 2
		})
	});
}
function normalizeElevenLabsProviderConfig(rawConfig) {
	const providers = asOptionalRecord(rawConfig.providers);
	const raw = asOptionalRecord(providers?.elevenlabs) ?? asOptionalRecord(rawConfig.elevenlabs);
	const rawVoiceSettings = asOptionalRecord(raw?.voiceSettings);
	return {
		apiKey: normalizeResolvedSecretInputString({
			value: raw?.apiKey,
			path: "tts.providers.elevenlabs.apiKey"
		}),
		baseUrl: normalizeElevenLabsBaseUrl(normalizeOptionalString(raw?.baseUrl)),
		voiceId: normalizeOptionalString(raw?.voiceId) ?? DEFAULT_ELEVENLABS_VOICE_ID,
		modelId: normalizeElevenLabsTtsModelId(normalizeOptionalString(raw?.modelId)) ?? DEFAULT_ELEVENLABS_MODEL_ID,
		seed: normalizeElevenLabsSeed(raw?.seed),
		applyTextNormalization: normalizeOptionalString(raw?.applyTextNormalization),
		languageCode: normalizeOptionalString(raw?.languageCode),
		voiceSettings: {
			...DEFAULT_ELEVENLABS_VOICE_SETTINGS,
			...normalizeVoiceSettings(rawVoiceSettings)
		}
	};
}
function readElevenLabsProviderConfig(config) {
	return normalizeElevenLabsProviderConfig({ elevenlabs: {
		...config,
		apiKey: normalizeOptionalString(config.apiKey)
	} });
}
function resolveElevenLabsApiKey(...candidates) {
	return resolveSpeechProviderApiKey(...candidates, resolveElevenLabsApiKeyWithProfileFallback() ?? void 0, process.env.XI_API_KEY);
}
function resolveElevenLabsTalkApiKey(config) {
	if (config.apiKey === void 0) return resolveElevenLabsApiKey();
	return normalizeResolvedSecretInputString({
		value: config.apiKey,
		path: "talk.providers.elevenlabs.apiKey"
	});
}
function parseDirectiveToken(ctx, formatErrorMessage) {
	try {
		const overrides = { ...ctx.currentOverrides };
		switch (ctx.key) {
			case "voiceid":
			case "voice_id":
			case "elevenlabs_voice":
			case "elevenlabsvoice":
				if (!ctx.policy.allowVoice) return { handled: true };
				if (!isValidElevenLabsVoiceId(ctx.value)) return {
					handled: true,
					warnings: [`invalid ElevenLabs voiceId "${ctx.value}"`]
				};
				overrides.voiceId = ctx.value;
				break;
			case "model":
			case "modelid":
			case "model_id":
			case "elevenlabs_model":
			case "elevenlabsmodel":
				if (!ctx.policy.allowModelId) return { handled: true };
				overrides.modelId = normalizeElevenLabsTtsModelId(ctx.value);
				break;
			case "stability":
			case "similarity":
			case "similarityboost":
			case "similarity_boost":
			case "style":
			case "speed": {
				if (!ctx.policy.allowVoiceSettings) return { handled: true };
				const setting = ctx.key.startsWith("similarity") ? "similarityBoost" : ctx.key;
				const value = parseStrictFiniteNumber(ctx.value);
				if (value == null) return {
					handled: true,
					warnings: [`invalid ${setting} value`]
				};
				requireInRange(value, setting === "speed" ? .5 : 0, setting === "speed" ? 2 : 1, setting);
				overrides.voiceSettings = {
					...asOptionalRecord(overrides.voiceSettings),
					[setting]: value
				};
				break;
			}
			case "speakerboost":
			case "speaker_boost":
			case "usespeakerboost":
			case "use_speaker_boost": {
				if (!ctx.policy.allowVoiceSettings) return { handled: true };
				const value = parseBooleanValue(ctx.value);
				if (value == null) return {
					handled: true,
					warnings: ["invalid useSpeakerBoost value"]
				};
				overrides.voiceSettings = {
					...asOptionalRecord(overrides.voiceSettings),
					useSpeakerBoost: value
				};
				break;
			}
			case "normalize":
			case "applytextnormalization":
			case "apply_text_normalization":
				if (!ctx.policy.allowNormalization) return { handled: true };
				overrides.applyTextNormalization = normalizeApplyTextNormalization(ctx.value);
				break;
			case "language":
			case "languagecode":
			case "language_code":
				if (!ctx.policy.allowNormalization) return { handled: true };
				overrides.languageCode = normalizeLanguageCode(ctx.value);
				break;
			case "seed":
				if (!ctx.policy.allowSeed) return { handled: true };
				overrides.seed = normalizeSeed(parseStrictInteger(ctx.value) ?? NaN);
				break;
			default: return { handled: false };
		}
		return {
			handled: true,
			overrides
		};
	} catch (error) {
		return {
			handled: true,
			warnings: [formatErrorMessage(error)]
		};
	}
}
async function listElevenLabsVoices(params) {
	const normalizedBaseUrl = normalizeElevenLabsBaseUrl(params.baseUrl);
	const { assertOkOrThrowProviderError, readProviderJsonResponse } = await import("./plugin-sdk/provider-http.js");
	const { fetchWithSsrFGuard, ssrfPolicyFromHttpBaseUrlAllowedHostname } = await import("./plugin-sdk/ssrf-runtime.js");
	const { response, release } = await fetchWithSsrFGuard({
		url: `${normalizedBaseUrl}/v1/voices`,
		init: { headers: { "xi-api-key": params.apiKey } },
		timeoutMs: params.timeoutMs,
		policy: ssrfPolicyFromHttpBaseUrlAllowedHostname(normalizedBaseUrl),
		auditContext: "elevenlabs.voices"
	});
	try {
		await assertOkOrThrowProviderError(response, "ElevenLabs voices API error");
		const json = await readProviderJsonResponse(response, "elevenlabs.voices");
		return Array.isArray(json.voices) ? json.voices.map((voice) => ({
			id: voice.voice_id?.trim() ?? "",
			name: normalizeOptionalString(voice.name),
			category: normalizeOptionalString(voice.category),
			description: normalizeOptionalString(voice.description)
		})).filter((voice) => voice.id.length > 0) : [];
	} finally {
		await release();
	}
}
function resolveElevenLabsTtsRequest(req, options) {
	const config = readElevenLabsProviderConfig(req.providerConfig);
	const overrides = req.providerOverrides ?? {};
	const apiKey = resolveElevenLabsApiKey(config.apiKey);
	if (!apiKey) throw new Error("ElevenLabs API key missing");
	return {
		text: req.text,
		apiKey,
		baseUrl: config.baseUrl,
		voiceId: normalizeOptionalString(overrides.voiceId) ?? config.voiceId,
		modelId: normalizeElevenLabsTtsModelId(normalizeOptionalString(overrides.modelId)) ?? config.modelId,
		outputFormat: options.outputFormat,
		seed: normalizeElevenLabsSeed(overrides.seed) ?? config.seed,
		applyTextNormalization: normalizeOptionalString(overrides.applyTextNormalization) ?? config.applyTextNormalization,
		languageCode: normalizeOptionalString(overrides.languageCode) ?? config.languageCode,
		latencyTier: options.latencyTier,
		voiceSettings: {
			...config.voiceSettings,
			...normalizeVoiceSettings(asOptionalRecord(overrides.voiceSettings))
		},
		timeoutMs: req.timeoutMs
	};
}
function buildElevenLabsSpeechProvider({ formatErrorMessage }) {
	return {
		id: "elevenlabs",
		label: "ElevenLabs",
		autoSelectOrder: 20,
		defaultModel: DEFAULT_ELEVENLABS_MODEL_ID,
		models: ELEVENLABS_TTS_MODELS,
		resolveConfig: ({ rawConfig }) => normalizeElevenLabsProviderConfig(rawConfig),
		parseDirectiveToken: (ctx) => parseDirectiveToken(ctx, formatErrorMessage),
		resolveTalkConfig: ({ baseTtsConfig, talkProviderConfig }) => {
			const base = normalizeElevenLabsProviderConfig(baseTtsConfig);
			const talkVoiceSettings = asOptionalRecord(talkProviderConfig.voiceSettings);
			const resolvedTalkApiKey = resolveElevenLabsTalkApiKey(talkProviderConfig);
			return {
				...base,
				...resolvedTalkApiKey === void 0 ? {} : { apiKey: resolvedTalkApiKey },
				...normalizeOptionalString(talkProviderConfig.baseUrl) == null ? {} : { baseUrl: normalizeElevenLabsBaseUrl(normalizeOptionalString(talkProviderConfig.baseUrl)) },
				...definedSettings({
					voiceId: normalizeOptionalString(talkProviderConfig.voiceId),
					modelId: normalizeElevenLabsTtsModelId(normalizeOptionalString(talkProviderConfig.modelId)),
					seed: normalizeElevenLabsSeed(talkProviderConfig.seed),
					applyTextNormalization: normalizeApplyTextNormalization(normalizeOptionalString(talkProviderConfig.applyTextNormalization)),
					languageCode: normalizeLanguageCode(normalizeOptionalString(talkProviderConfig.languageCode))
				}),
				voiceSettings: {
					...base.voiceSettings,
					...normalizeVoiceSettings(talkVoiceSettings)
				}
			};
		},
		resolveTalkOverrides: ({ params }) => {
			const normalize = normalizeOptionalString(params.normalize);
			const language = normalizeLowercaseStringOrEmpty(normalizeOptionalString(params.language));
			const latencyTier = normalizeElevenLabsLatencyTier(params.latencyTier);
			const voiceSettings = normalizeVoiceSettings({
				speed: params.speed,
				stability: params.stability,
				similarityBoost: params.similarity,
				style: params.style,
				useSpeakerBoost: params.speakerBoost
			});
			return {
				...definedSettings({
					voiceId: normalizeOptionalString(params.voiceId),
					modelId: normalizeElevenLabsTtsModelId(normalizeOptionalString(params.modelId)),
					outputFormat: normalizeOptionalString(params.outputFormat),
					seed: normalizeElevenLabsSeed(params.seed)
				}),
				...normalize == null ? {} : { applyTextNormalization: normalizeApplyTextNormalization(normalize) },
				languageCode: normalizeLanguageCode(language),
				...latencyTier == null ? {} : { latencyTier },
				...Object.keys(voiceSettings).length === 0 ? {} : { voiceSettings }
			};
		},
		listVoices: async (req) => {
			const config = req.providerConfig ? readElevenLabsProviderConfig(req.providerConfig) : void 0;
			const apiKey = resolveElevenLabsApiKey(req.apiKey, config?.apiKey);
			if (!apiKey) throw new Error("ElevenLabs API key missing");
			return listElevenLabsVoices({
				apiKey,
				baseUrl: req.baseUrl ?? config?.baseUrl,
				timeoutMs: req.timeoutMs
			});
		},
		isConfigured: ({ providerConfig }) => Boolean(resolveElevenLabsApiKey(readElevenLabsProviderConfig(providerConfig).apiKey)),
		synthesize: async (req) => {
			const overrides = req.providerOverrides ?? {};
			const outputPlan = resolveElevenLabsOutputPlan(req);
			return {
				audioBuffer: await elevenLabsTTS(resolveElevenLabsTtsRequest(req, {
					outputFormat: outputPlan.outputFormat,
					latencyTier: normalizeElevenLabsLatencyTier(overrides.latencyTier)
				})),
				...outputPlan
			};
		},
		streamSynthesize: async (req) => {
			const overrides = req.providerOverrides ?? {};
			const outputPlan = resolveElevenLabsOutputPlan(req);
			const stream = await elevenLabsTTSStream(resolveElevenLabsTtsRequest(req, {
				outputFormat: outputPlan.outputFormat,
				latencyTier: normalizeElevenLabsLatencyTier(overrides.latencyTier)
			}));
			return {
				audioStream: stream.audioStream,
				...outputPlan,
				release: stream.release
			};
		},
		synthesizeTelephony: async (req) => {
			const outputFormat = "pcm_22050";
			return {
				audioBuffer: await elevenLabsTTS(resolveElevenLabsTtsRequest(req, { outputFormat })),
				outputFormat,
				sampleRate: 22050
			};
		}
	};
}
//#endregion
export { buildElevenLabsSpeechProvider as t };
