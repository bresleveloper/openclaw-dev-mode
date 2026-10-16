import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { c as asFiniteNumberInRange } from "./number-coercion-CuVhdCBs.mjs";
import { a as asOptionalRecord } from "./record-coerce-TIsquoVR.mjs";
import { d as normalizeResolvedSecretInputString } from "./types.secrets-DsPRn9Dz.mjs";
import "./string-coerce-runtime-50qKeWeL.mjs";
import "./secret-input-BXhRrpGu.mjs";
import { a as resolveSpeechProviderApiKey } from "./tts-provider-helpers-CB19Mjmx.mjs";
import { t as parseSpeechDirectiveNumberOverride } from "./directive-number-B8Ja_oKx.mjs";
import "./speech-provider-BrKfPUGI.mjs";
import { a as normalizeMinimaxTtsBaseUrl, i as minimaxTTS, n as MINIMAX_TTS_MODELS, r as MINIMAX_TTS_VOICES } from "./tts-DwXjPuBY.mjs";
//#region extensions/minimax/speech-provider-factory.ts
const MINIMAX_PORTAL_PROVIDER_ID = "minimax-portal";
const MINIMAX_TOKEN_PLAN_ENV_VARS = [
	"MINIMAX_OAUTH_TOKEN",
	"MINIMAX_CODE_PLAN_KEY",
	"MINIMAX_CODING_API_KEY"
];
function resolveConfiguredPortalTtsBaseUrl(cfg) {
	const providers = asOptionalRecord(asOptionalRecord(cfg?.models)?.providers);
	const portalProvider = asOptionalRecord(providers?.[MINIMAX_PORTAL_PROVIDER_ID]);
	const portalBaseUrl = normalizeOptionalString(portalProvider?.baseUrl);
	return portalBaseUrl ? normalizeMinimaxTtsBaseUrl(portalBaseUrl) : void 0;
}
async function resolveMinimaxTtsApiKey(params) {
	const { resolveProviderAuthProfileApiKey } = await import("./plugin-sdk/provider-auth.js");
	return resolveSpeechProviderApiKey(params.configApiKey, await resolveProviderAuthProfileApiKey({
		cfg: params.cfg,
		provider: MINIMAX_PORTAL_PROVIDER_ID
	}), resolveMinimaxDirectTtsApiKey());
}
function resolveMinimaxDirectTtsApiKey(configApiKey) {
	return resolveSpeechProviderApiKey(configApiKey, ...MINIMAX_TOKEN_PLAN_ENV_VARS.map((envVar) => process.env[envVar]), process.env.MINIMAX_API_KEY);
}
function normalizeMinimaxProviderConfig(rawConfig, cfg) {
	const providers = asOptionalRecord(rawConfig.providers);
	const raw = asOptionalRecord(providers?.minimax) ?? asOptionalRecord(rawConfig.minimax);
	return {
		apiKey: normalizeResolvedSecretInputString({
			value: raw?.apiKey,
			path: "tts.providers.minimax.apiKey"
		}),
		baseUrl: normalizeMinimaxTtsBaseUrl(normalizeOptionalString(raw?.baseUrl) ?? normalizeOptionalString(process.env.MINIMAX_API_HOST) ?? resolveConfiguredPortalTtsBaseUrl(cfg) ?? "https://api.minimax.io"),
		model: normalizeOptionalString(raw?.model) ?? normalizeOptionalString(process.env.MINIMAX_TTS_MODEL) ?? "speech-2.8-hd",
		voiceId: normalizeOptionalString(raw?.voiceId) ?? normalizeOptionalString(process.env.MINIMAX_TTS_VOICE_ID) ?? "English_expressive_narrator",
		speed: normalizeMinimaxSpeed(raw?.speed),
		vol: normalizeMinimaxVolume(raw?.vol),
		pitch: normalizeMinimaxPitch(raw?.pitch)
	};
}
function normalizeMinimaxSpeed(value) {
	return asFiniteNumberInRange(value, {
		min: .5,
		max: 2
	});
}
function normalizeMinimaxVolume(value) {
	return asFiniteNumberInRange(value, {
		min: 0,
		max: 10,
		minExclusive: true
	});
}
function normalizeMinimaxPitch(value) {
	const pitch = asFiniteNumberInRange(value, {
		min: -12,
		max: 12
	});
	return pitch !== void 0 ? Math.trunc(pitch) : void 0;
}
function readMinimaxProviderConfig(config, cfg) {
	return normalizeMinimaxProviderConfig({ minimax: {
		...config,
		apiKey: normalizeOptionalString(config.apiKey)
	} }, cfg);
}
function readMinimaxOverrides(overrides) {
	if (!overrides) return {};
	const normalized = {
		model: normalizeOptionalString(overrides.model),
		voiceId: normalizeOptionalString(overrides.voiceId),
		speed: normalizeMinimaxSpeed(overrides.speed),
		vol: normalizeMinimaxVolume(overrides.vol),
		pitch: normalizeMinimaxPitch(overrides.pitch)
	};
	for (const key of [
		"model",
		"voiceId",
		"speed",
		"vol",
		"pitch"
	]) if (normalized[key] === void 0) delete normalized[key];
	return normalized;
}
function parseDirectiveToken(ctx) {
	switch (ctx.key) {
		case "voice":
		case "voiceid":
		case "voice_id":
		case "minimax_voice":
		case "minimaxvoice":
			if (!ctx.policy.allowVoice) return { handled: true };
			return {
				handled: true,
				overrides: { voiceId: ctx.value }
			};
		case "model":
		case "minimax_model":
		case "minimaxmodel":
			if (!ctx.policy.allowModelId) return { handled: true };
			return {
				handled: true,
				overrides: { model: ctx.value }
			};
		case "speed": return parseSpeechDirectiveNumberOverride({
			ctx,
			overrideKey: "speed",
			range: {
				min: .5,
				max: 2
			},
			warning: (value) => `invalid MiniMax speed "${value}" (0.5-2.0)`
		});
		case "vol":
		case "volume": return parseSpeechDirectiveNumberOverride({
			ctx,
			overrideKey: "vol",
			range: {
				min: 0,
				minExclusive: true,
				max: 10
			},
			warning: (value) => `invalid MiniMax volume "${value}" (must be greater than 0 and at most 10)`
		});
		case "pitch": return parseSpeechDirectiveNumberOverride({
			ctx,
			overrideKey: "pitch",
			range: {
				min: -12,
				max: 12
			},
			warning: (value) => `invalid MiniMax pitch "${value}" (-12 to 12)`
		});
		default: return { handled: false };
	}
}
function buildMinimaxSpeechProvider({ isProviderAuthProfileConfigured }) {
	return {
		id: "minimax",
		label: "MiniMax",
		autoSelectOrder: 40,
		defaultModel: MINIMAX_TTS_MODELS[0],
		models: MINIMAX_TTS_MODELS,
		voices: MINIMAX_TTS_VOICES,
		resolveConfig: ({ rawConfig, cfg }) => normalizeMinimaxProviderConfig(rawConfig, cfg),
		parseDirectiveToken,
		resolveTalkConfig: ({ baseTtsConfig, talkProviderConfig }) => {
			return {
				...normalizeMinimaxProviderConfig(baseTtsConfig),
				...talkProviderConfig.apiKey === void 0 ? {} : { apiKey: normalizeResolvedSecretInputString({
					value: talkProviderConfig.apiKey,
					path: "talk.providers.minimax.apiKey"
				}) },
				...normalizeOptionalString(talkProviderConfig.baseUrl) == null ? {} : { baseUrl: normalizeMinimaxTtsBaseUrl(normalizeOptionalString(talkProviderConfig.baseUrl)) },
				...readMinimaxOverrides({
					...talkProviderConfig,
					model: talkProviderConfig.modelId
				})
			};
		},
		resolveTalkOverrides: ({ params }) => readMinimaxOverrides({
			...params,
			model: params.modelId
		}),
		listVoices: async () => MINIMAX_TTS_VOICES.map((voice) => ({
			id: voice,
			name: voice
		})),
		isConfigured: ({ cfg, providerConfig }) => Boolean(resolveMinimaxDirectTtsApiKey(readMinimaxProviderConfig(providerConfig, cfg).apiKey) || isProviderAuthProfileConfigured({
			cfg,
			provider: MINIMAX_PORTAL_PROVIDER_ID
		})),
		synthesize: async (req) => {
			const config = readMinimaxProviderConfig(req.providerConfig, req.cfg);
			const overrides = readMinimaxOverrides(req.providerOverrides);
			const apiKey = await resolveMinimaxTtsApiKey({
				cfg: req.cfg,
				configApiKey: config.apiKey
			});
			if (!apiKey) throw new Error("MiniMax TTS auth missing");
			const audioBuffer = await minimaxTTS({
				text: req.text,
				apiKey,
				baseUrl: config.baseUrl,
				model: overrides.model ?? config.model,
				voiceId: overrides.voiceId ?? config.voiceId,
				speed: overrides.speed ?? config.speed,
				vol: overrides.vol ?? config.vol,
				pitch: overrides.pitch ?? config.pitch,
				timeoutMs: req.timeoutMs
			});
			if (req.target === "voice-note") {
				const { transcodeAudioBufferToOpus } = await import("./plugin-sdk/media-runtime.js");
				return {
					audioBuffer: await transcodeAudioBufferToOpus({
						audioBuffer,
						inputExtension: "mp3",
						tempPrefix: "tts-minimax-",
						timeoutMs: req.timeoutMs
					}),
					outputFormat: "opus",
					fileExtension: ".opus",
					voiceCompatible: true
				};
			}
			return {
				audioBuffer,
				outputFormat: "mp3",
				fileExtension: ".mp3",
				voiceCompatible: false
			};
		}
	};
}
//#endregion
export { buildMinimaxSpeechProvider as t };
