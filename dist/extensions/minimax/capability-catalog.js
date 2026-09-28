import { normalizeResolvedSecretInputString } from "openclaw/plugin-sdk/secret-input";
import { parseSpeechDirectiveNumberOverride, resolveSpeechProviderApiKey } from "openclaw/plugin-sdk/speech-provider";
import { asFiniteNumberInRange, asOptionalRecord, normalizeOptionalString, readStringField } from "openclaw/plugin-sdk/string-coerce-runtime";
import { resolveTimerTimeoutMs } from "openclaw/plugin-sdk/number-runtime";
//#region extensions/minimax/tts.ts
const DEFAULT_MINIMAX_TTS_BASE_URL = "https://api.minimax.io";
const MINIMAX_TTS_MODELS = [
	"speech-2.8-hd",
	"speech-2.8-turbo",
	"speech-2.6-hd",
	"speech-2.6-turbo",
	"speech-02-hd",
	"speech-02-turbo",
	"speech-01-hd",
	"speech-01-turbo"
];
const MINIMAX_TTS_VOICES = [
	"English_expressive_narrator",
	"Chinese (Mandarin)_Warm_Girl",
	"Chinese (Mandarin)_Lively_Girl",
	"Chinese (Mandarin)_Gentle_Boy",
	"Chinese (Mandarin)_Steady_Boy"
];
function normalizeMinimaxTtsBaseUrl(baseUrl) {
	const trimmed = baseUrl?.trim();
	if (!trimmed) return DEFAULT_MINIMAX_TTS_BASE_URL;
	return trimmed.replace(/\/+$/, "").replace(/\/(?:anthropic|v1)$/i, "");
}
function normalizeMinimaxTtsPitch(pitch) {
	return Math.trunc(pitch);
}
async function minimaxTTS(params) {
	const { text, apiKey, baseUrl, model, voiceId, speed = 1, vol = 1, pitch = 0, format = "mp3", sampleRate = 32e3, timeoutMs } = params;
	const safeTimeoutMs = resolveTimerTimeoutMs(timeoutMs, 1);
	const { assertOkOrThrowProviderError, readProviderJsonObjectResponse } = await import("openclaw/plugin-sdk/provider-http");
	const { fetchWithSsrFGuard, ssrfPolicyFromHttpBaseUrlAllowedHostname } = await import("openclaw/plugin-sdk/ssrf-runtime");
	const { assertMinimaxBaseResp, normalizeMinimaxHexAudio } = await import("./.setup/media-provider-runtime-CV_JkIDY.mjs");
	const controller = new AbortController();
	const timeout = setTimeout(() => controller.abort(), safeTimeoutMs);
	try {
		const { response, release } = await fetchWithSsrFGuard({
			url: `${baseUrl}/v1/t2a_v2`,
			init: {
				method: "POST",
				headers: {
					Authorization: `Bearer ${apiKey}`,
					"Content-Type": "application/json"
				},
				body: JSON.stringify({
					model,
					text,
					stream: false,
					output_format: "hex",
					voice_setting: {
						voice_id: voiceId,
						speed,
						vol,
						pitch: normalizeMinimaxTtsPitch(pitch)
					},
					audio_setting: {
						format,
						sample_rate: sampleRate
					}
				}),
				signal: controller.signal
			},
			timeoutMs: safeTimeoutMs,
			policy: ssrfPolicyFromHttpBaseUrlAllowedHostname(baseUrl),
			auditContext: "minimax.tts"
		});
		try {
			await assertOkOrThrowProviderError(response, "MiniMax TTS API error");
			const body = await readProviderJsonObjectResponse(response, "minimax.tts");
			assertMinimaxBaseResp(body.base_resp, "MiniMax TTS API error");
			const hexAudio = readStringField(asOptionalRecord(body.data), "audio");
			if (!hexAudio) throw new Error("MiniMax TTS API returned no audio data");
			return Buffer.from(normalizeMinimaxHexAudio(hexAudio, "MiniMax TTS API"), "hex");
		} finally {
			await release();
		}
	} finally {
		clearTimeout(timeout);
	}
}
//#endregion
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
function resolveMinimaxTokenPlanEnvKey() {
	return resolveSpeechProviderApiKey(...MINIMAX_TOKEN_PLAN_ENV_VARS.map((envVar) => process.env[envVar]));
}
async function resolveMinimaxPortalProfileToken(cfg) {
	const { resolveProviderAuthProfileApiKey } = await import("openclaw/plugin-sdk/provider-auth");
	return await resolveProviderAuthProfileApiKey({
		cfg,
		provider: MINIMAX_PORTAL_PROVIDER_ID
	});
}
async function resolveMinimaxTtsApiKey(params) {
	return resolveSpeechProviderApiKey(params.configApiKey, await resolveMinimaxPortalProfileToken(params.cfg), resolveMinimaxDirectTtsApiKey());
}
function resolveMinimaxDirectTtsApiKey(configApiKey) {
	return resolveSpeechProviderApiKey(configApiKey, resolveMinimaxTokenPlanEnvKey(), process.env.MINIMAX_API_KEY);
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
	const normalized = normalizeMinimaxProviderConfig({}, cfg);
	return {
		apiKey: normalizeOptionalString(config.apiKey) ?? normalized.apiKey,
		baseUrl: normalizeMinimaxTtsBaseUrl(normalizeOptionalString(config.baseUrl) ?? normalized.baseUrl),
		model: normalizeOptionalString(config.model) ?? normalized.model,
		voiceId: normalizeOptionalString(config.voiceId) ?? normalized.voiceId,
		speed: normalizeMinimaxSpeed(config.speed) ?? normalized.speed,
		vol: normalizeMinimaxVolume(config.vol) ?? normalized.vol,
		pitch: normalizeMinimaxPitch(config.pitch) ?? normalized.pitch
	};
}
function readMinimaxOverrides(overrides) {
	if (!overrides) return {};
	return {
		model: normalizeOptionalString(overrides.model),
		voiceId: normalizeOptionalString(overrides.voiceId),
		speed: normalizeMinimaxSpeed(overrides.speed),
		vol: normalizeMinimaxVolume(overrides.vol),
		pitch: normalizeMinimaxPitch(overrides.pitch)
	};
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
				...normalizeOptionalString(talkProviderConfig.modelId) == null ? {} : { model: normalizeOptionalString(talkProviderConfig.modelId) },
				...normalizeOptionalString(talkProviderConfig.voiceId) == null ? {} : { voiceId: normalizeOptionalString(talkProviderConfig.voiceId) },
				...normalizeMinimaxSpeed(talkProviderConfig.speed) == null ? {} : { speed: normalizeMinimaxSpeed(talkProviderConfig.speed) },
				...normalizeMinimaxVolume(talkProviderConfig.vol) == null ? {} : { vol: normalizeMinimaxVolume(talkProviderConfig.vol) },
				...normalizeMinimaxPitch(talkProviderConfig.pitch) == null ? {} : { pitch: normalizeMinimaxPitch(talkProviderConfig.pitch) }
			};
		},
		resolveTalkOverrides: ({ params }) => ({
			...normalizeOptionalString(params.voiceId) == null ? {} : { voiceId: normalizeOptionalString(params.voiceId) },
			...normalizeOptionalString(params.modelId) == null ? {} : { model: normalizeOptionalString(params.modelId) },
			...normalizeMinimaxSpeed(params.speed) == null ? {} : { speed: normalizeMinimaxSpeed(params.speed) },
			...normalizeMinimaxVolume(params.vol) == null ? {} : { vol: normalizeMinimaxVolume(params.vol) },
			...normalizeMinimaxPitch(params.pitch) == null ? {} : { pitch: normalizeMinimaxPitch(params.pitch) }
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
				const { transcodeAudioBufferToOpus } = await import("openclaw/plugin-sdk/media-runtime");
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
//#region extensions/minimax/capability-catalog.ts
const catalog = (context) => ({ speechProviders: [buildMinimaxSpeechProvider(context)] });
//#endregion
export { catalog as default };
