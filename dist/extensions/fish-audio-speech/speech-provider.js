import { normalizeResolvedSecretInputString } from "openclaw/plugin-sdk/secret-input";
import { MAX_AUDIO_BYTES, createSpeechDirectiveParser, resolveSpeechProviderApiKey } from "openclaw/plugin-sdk/speech-provider";
import { asBoolean, asFiniteNumberInRange, asOptionalRecord, filterStringRecord, normalizeOptionalString, normalizeTrimmedStringList, parseBooleanValue } from "openclaw/plugin-sdk/string-coerce-runtime";
// extensions/fish-audio-speech/speech-provider.ts
const FISH_AUDIO_BASE_URL = "https://api.fish.audio";
const FISH_AUDIO_VOICES_MAX_BYTES = 2097152;
const FISH_AUDIO_VOICE_PAGE_SIZE = 100;
const FISH_AUDIO_MAX_OWN_VOICE_PAGES = 20;
const FISH_AUDIO_MODELS = [
	"drama-3",
	"drama-3-preview",
	"s2.1-pro-free",
	"s2.1-pro",
	"s2-pro",
	"s1"
];
function normalizeFishAudioBaseUrl(value) {
	const trimmed = value?.trim();
	return trimmed ? trimmed.replace(/\/+$/u, "") : FISH_AUDIO_BASE_URL;
}
async function requestFishAudioTts(params) {
	const { fetchWithSsrFGuard, ssrfPolicyFromHttpBaseUrlAllowedHostname } = await import("openclaw/plugin-sdk/ssrf-runtime");
	return await fetchWithSsrFGuard({
		url: `${params.baseUrl}/v1/tts`,
		init: {
			method: "POST",
			headers: {
				Authorization: `Bearer ${params.apiKey}`,
				"Content-Type": "application/json",
				model: params.model
			},
			body: JSON.stringify({
				text: params.text,
				format: params.format,
				...params.referenceId ? { reference_id: params.referenceId } : {},
				...params.sampleRate == null ? {} : { sample_rate: params.sampleRate },
				...params.latency == null ? {} : { latency: params.latency },
				...params.speed == null ? {} : { prosody: { speed: params.speed } },
				...params.temperature == null ? {} : { temperature: params.temperature },
				...params.topP == null ? {} : { top_p: params.topP },
				...params.normalize == null ? {} : { normalize: params.normalize }
			})
		},
		timeoutMs: params.timeoutMs,
		policy: ssrfPolicyFromHttpBaseUrlAllowedHostname(params.baseUrl),
		auditContext: "fish-audio.tts"
	});
}
async function fishAudioTts(params) {
	const { assertOkOrThrowProviderError, readProviderBinaryResponse } = await import("openclaw/plugin-sdk/provider-http");
	const { response, release } = await requestFishAudioTts(params);
	try {
		await assertOkOrThrowProviderError(response, "Fish Audio TTS API error", { requestHeaders: { Authorization: `Bearer ${params.apiKey}` } });
		return await readProviderBinaryResponse(response, "Fish Audio TTS API error", "audio", { maxBytes: params.maxBytes });
	} finally {
		await release();
	}
}
function parseVoiceItem(value) {
	const item = asOptionalRecord(value);
	const id = normalizeOptionalString(item?.["_id"]);
	if (!id) return;
	const languages = normalizeTrimmedStringList(item?.languages);
	const tags = normalizeTrimmedStringList(item?.tags);
	return {
		id,
		name: normalizeOptionalString(item?.title),
		description: normalizeOptionalString(item?.description),
		category: normalizeOptionalString(item?.visibility),
		locale: languages[0],
		personalities: tags.length > 0 ? tags : void 0
	};
}
const DEFAULT_MODEL = "s2.1-pro";
const DEFAULT_LATENCY = "balanced";
const DEFAULT_TIMEOUT_MS = 24e4;
function normalizeModel(value) {
	const model = normalizeOptionalString(value);
	if (!model) return DEFAULT_MODEL;
	const supported = FISH_AUDIO_MODELS.find((candidate) => candidate === model);
	if (supported) return supported;
	throw new Error(`invalid Fish Audio model "${model}"`);
}
function normalizeLatency(value) {
	const latency = normalizeOptionalString(value)?.toLowerCase();
	if (!latency) return DEFAULT_LATENCY;
	if (latency === "low" || latency === "balanced" || latency === "normal") return latency;
	throw new Error(`invalid Fish Audio latency "${latency}"`);
}
function resolveReferenceId(raw) {
	return normalizeOptionalString(raw?.speakerVoiceId ?? raw?.voiceId ?? raw?.referenceId);
}
function normalizeProviderConfig(rawConfig) {
	const providers = asOptionalRecord(rawConfig.providers);
	const raw = asOptionalRecord(providers?.["fish-audio"]);
	return {
		apiKey: normalizeResolvedSecretInputString({
			value: raw?.apiKey,
			path: "tts.providers.fish-audio.apiKey"
		}),
		baseUrl: normalizeFishAudioBaseUrl(normalizeOptionalString(raw?.baseUrl)),
		model: normalizeModel(raw?.model ?? raw?.modelId),
		referenceId: resolveReferenceId(raw),
		latency: normalizeLatency(raw?.latency),
		speed: asFiniteNumberInRange(raw?.speed, {
			min: .5,
			max: 2
		}),
		temperature: asFiniteNumberInRange(raw?.temperature, {
			min: 0,
			max: 1
		}),
		topP: asFiniteNumberInRange(raw?.topP ?? raw?.top_p, {
			min: 0,
			max: 1
		}),
		normalize: asBoolean(raw?.normalize)
	};
}
function readProviderConfig(config) {
	return normalizeProviderConfig({ providers: { "fish-audio": {
		...config,
		apiKey: normalizeOptionalString(config.apiKey)
	} } });
}
function resolveApiKey(configValue) {
	return resolveSpeechProviderApiKey(configValue, process.env.FISH_API_KEY, process.env.FISH_AUDIO_API_KEY);
}
const parseDirectiveToken = createSpeechDirectiveParser({
	referenceId: ["allowVoice", [
		"voice",
		"voiceid",
		"voice_id",
		"referenceid",
		"reference_id",
		"fish_voice",
		"fishaudio_voice"
	]],
	model: [
		"allowModelId",
		[
			"model",
			"modelid",
			"model_id",
			"fish_model",
			"fishaudio_model"
		],
		{ value: (ctx) => normalizeModel(ctx.value) }
	],
	speed: [
		"allowVoiceSettings",
		["speed", "fish_speed"],
		{ number: {
			range: {
				min: .5,
				max: 2
			},
			warning: (value) => `invalid Fish Audio speed "${value}"`
		} }
	],
	temperature: [
		"allowVoiceSettings",
		["temperature", "fish_temperature"],
		{ number: {
			range: {
				min: 0,
				max: 1
			},
			warning: (value) => `invalid Fish Audio temperature "${value}"`
		} }
	],
	topP: [
		"allowVoiceSettings",
		[
			"top_p",
			"topp",
			"fish_top_p"
		],
		{ number: {
			range: {
				min: 0,
				max: 1
			},
			warning: (value) => `invalid Fish Audio top_p "${value}"`
		} }
	],
	latency: [
		"allowVoiceSettings",
		["latency", "fish_latency"],
		{ value: (ctx) => normalizeLatency(ctx.value) }
	],
	normalize: [
		"allowNormalization",
		["normalize", "fish_normalize"],
		{ parse: (ctx) => {
			const normalize = parseBooleanValue(ctx.value);
			return normalize !== void 0 ? {
				handled: true,
				overrides: { normalize }
			} : {
				handled: true,
				warnings: [`invalid Fish Audio normalize "${ctx.value}"`]
			};
		} }
	]
}, { formatErrorMessage: String });
function resolveFormat(target) {
	if (target === "voice-note") return {
		format: "opus",
		sampleRate: 48e3,
		fileExtension: ".opus",
		voiceCompatible: true
	};
	if (target === "telephony") return {
		format: "pcm",
		sampleRate: 8e3,
		fileExtension: ".pcm",
		voiceCompatible: false
	};
	return {
		format: "mp3",
		sampleRate: 44100,
		fileExtension: ".mp3",
		voiceCompatible: false
	};
}
async function resolveSynthesisRequest(req) {
	const config = readProviderConfig(req.providerConfig);
	const raw = req.providerOverrides ?? {};
	const overrides = {
		model: normalizeOptionalString(raw.model ?? raw.modelId) ? normalizeModel(raw.model ?? raw.modelId) : void 0,
		referenceId: resolveReferenceId(raw),
		latency: normalizeOptionalString(raw.latency) ? normalizeLatency(raw.latency) : void 0,
		speed: asFiniteNumberInRange(raw.speed, {
			min: .5,
			max: 2
		}),
		temperature: asFiniteNumberInRange(raw.temperature, {
			min: 0,
			max: 1
		}),
		topP: asFiniteNumberInRange(raw.topP ?? raw.top_p, {
			min: 0,
			max: 1
		}),
		normalize: asBoolean(raw.normalize)
	};
	const apiKey = resolveApiKey(config.apiKey);
	if (!apiKey) throw new Error("Fish Audio API key missing");
	const output = resolveFormat(req.target);
	const { resolveGeneratedMediaMaxBytes } = await import("openclaw/plugin-sdk/media-generation-runtime");
	return {
		text: req.text,
		apiKey,
		baseUrl: config.baseUrl,
		model: overrides.model ?? config.model,
		referenceId: overrides.referenceId ?? config.referenceId,
		latency: overrides.latency ?? config.latency,
		speed: overrides.speed ?? config.speed,
		temperature: overrides.temperature ?? config.temperature,
		topP: overrides.topP ?? config.topP,
		normalize: overrides.normalize ?? config.normalize,
		timeoutMs: req.timeoutMs,
		maxBytes: resolveGeneratedMediaMaxBytes(req.cfg, "audio"),
		...output
	};
}
function buildFishAudioSpeechProvider() {
	const isConfigured = ({ providerConfig }) => Boolean(resolveApiKey(readProviderConfig(providerConfig).apiKey));
	return {
		id: "fish-audio",
		label: "Fish Audio",
		autoSelectOrder: 28,
		defaultTimeoutMs: DEFAULT_TIMEOUT_MS,
		defaultModel: DEFAULT_MODEL,
		models: FISH_AUDIO_MODELS,
		resolveConfig: ({ rawConfig }) => normalizeProviderConfig(rawConfig),
		parseDirectiveToken,
		resolveTalkConfig: ({ baseTtsConfig, talkProviderConfig }) => {
			return {
				...normalizeProviderConfig(baseTtsConfig),
				...talkProviderConfig.apiKey === void 0 ? {} : { apiKey: normalizeResolvedSecretInputString({
					value: talkProviderConfig.apiKey,
					path: "talk.providers.fish-audio.apiKey"
				}) },
				...filterStringRecord({
					baseUrl: normalizeOptionalString(talkProviderConfig.baseUrl) ? normalizeFishAudioBaseUrl(normalizeOptionalString(talkProviderConfig.baseUrl)) : void 0,
					model: normalizeOptionalString(talkProviderConfig.modelId ?? talkProviderConfig.model) ? normalizeModel(talkProviderConfig.modelId ?? talkProviderConfig.model) : void 0,
					referenceId: resolveReferenceId(talkProviderConfig),
					latency: normalizeOptionalString(talkProviderConfig.latency) ? normalizeLatency(talkProviderConfig.latency) : void 0
				}),
				...asFiniteNumberInRange(talkProviderConfig.speed, {
					min: .5,
					max: 2
				}) == null ? {} : { speed: asFiniteNumberInRange(talkProviderConfig.speed, {
					min: .5,
					max: 2
				}) }
			};
		},
		resolveTalkOverrides: ({ params }) => ({
			...filterStringRecord({
				model: normalizeOptionalString(params.modelId ?? params.model) ? normalizeModel(params.modelId ?? params.model) : void 0,
				referenceId: resolveReferenceId(params)
			}),
			...asFiniteNumberInRange(params.speed, {
				min: .5,
				max: 2
			}) == null ? {} : { speed: asFiniteNumberInRange(params.speed, {
				min: .5,
				max: 2
			}) }
		}),
		listVoices: async (req) => {
			const config = readProviderConfig(req.providerConfig ?? {});
			const apiKey = resolveApiKey(normalizeOptionalString(req.apiKey) ?? config.apiKey);
			if (!apiKey) throw new Error("Fish Audio API key missing");
			const baseUrl = normalizeFishAudioBaseUrl(normalizeOptionalString(req.baseUrl) ?? config.baseUrl);
			const timeoutMs = req.timeoutMs ?? DEFAULT_TIMEOUT_MS;
			const requestVoicePage = async (self, pageNumber) => {
				const url = new URL(`${baseUrl}/model`);
				url.searchParams.set("type", "tts");
				url.searchParams.set("page_size", String(FISH_AUDIO_VOICE_PAGE_SIZE));
				url.searchParams.set("page_number", String(pageNumber));
				if (self) url.searchParams.set("self", "true");
				else url.searchParams.set("sort_by", "score");
				const { assertOkOrThrowProviderError, readProviderJsonResponse } = await import("openclaw/plugin-sdk/provider-http");
				const { fetchWithSsrFGuard, ssrfPolicyFromHttpBaseUrlAllowedHostname } = await import("openclaw/plugin-sdk/ssrf-runtime");
				const requestHeaders = { Authorization: `Bearer ${apiKey}` };
				const { response, release } = await fetchWithSsrFGuard({
					url: url.toString(),
					init: { headers: requestHeaders },
					timeoutMs,
					policy: ssrfPolicyFromHttpBaseUrlAllowedHostname(baseUrl),
					auditContext: "fish-audio.voices"
				});
				try {
					await assertOkOrThrowProviderError(response, "Fish Audio voices API error", { requestHeaders });
					return await readProviderJsonResponse(response, "Fish Audio voices", {
						maxBytes: FISH_AUDIO_VOICES_MAX_BYTES,
						requestHeaders
					});
				} finally {
					await release();
				}
			};
			const own = [];
			for (let pageNumber = 1; pageNumber <= FISH_AUDIO_MAX_OWN_VOICE_PAGES; pageNumber += 1) {
				const payload = await requestVoicePage(true, pageNumber);
				const items = Array.isArray(payload.items) ? payload.items : [];
				own.push(...items.flatMap((item) => parseVoiceItem(item) ?? []));
				if (items.length < FISH_AUDIO_VOICE_PAGE_SIZE || own.length >= (payload.total ?? Number.MAX_SAFE_INTEGER)) break;
			}
			let publicVoices = [];
			try {
				const payload = await requestVoicePage(false, 1);
				publicVoices = (Array.isArray(payload.items) ? payload.items : []).flatMap((item) => parseVoiceItem(item) ?? []);
			} catch {}
			const seen = /* @__PURE__ */ new Set();
			return [...own, ...publicVoices].filter((voice) => {
				if (seen.has(voice.id)) return false;
				seen.add(voice.id);
				return true;
			});
		},
		isConfigured,
		isConfiguredAsync: async (ctx) => isConfigured(ctx),
		synthesize: async (req) => {
			const params = await resolveSynthesisRequest(req);
			return {
				audioBuffer: await fishAudioTts(params),
				outputFormat: params.format,
				fileExtension: params.fileExtension,
				voiceCompatible: params.voiceCompatible
			};
		},
		streamSynthesize: async (req) => {
			const params = await resolveSynthesisRequest(req);
			const streamParams = {
				...params,
				maxBytes: Math.min(params.maxBytes, MAX_AUDIO_BYTES)
			};
			const { createBoundedProviderBinaryStream } = await import("openclaw/plugin-sdk/provider-binary-stream");
			const { assertOkOrThrowProviderError, assertProviderBinaryResponseContent } = await import("openclaw/plugin-sdk/provider-http");
			const { response, release } = await requestFishAudioTts(streamParams);
			try {
				await assertOkOrThrowProviderError(response, "Fish Audio TTS API error", { requestHeaders: { Authorization: `Bearer ${streamParams.apiKey}` } });
				assertProviderBinaryResponseContent(response, "Fish Audio TTS API error", "audio");
				if (!response.body) throw new Error("Fish Audio TTS API response missing audio stream");
				const bounded = createBoundedProviderBinaryStream(response.body, {
					maxBytes: streamParams.maxBytes,
					createOverflowError: ({ maxBytes }) => /* @__PURE__ */ new Error(`Fish Audio TTS API error: audio response exceeds ${maxBytes} bytes`),
					createReleaseError: () => /* @__PURE__ */ new Error("Fish Audio TTS stream released"),
					cleanup: release
				});
				return {
					audioStream: bounded.stream,
					outputFormat: params.format,
					fileExtension: params.fileExtension,
					voiceCompatible: params.voiceCompatible,
					release: bounded.release
				};
			} catch (error) {
				await release();
				throw error;
			}
		},
		synthesizeTelephony: async (req) => {
			return {
				audioBuffer: await fishAudioTts(await resolveSynthesisRequest({
					...req,
					target: "telephony"
				})),
				outputFormat: "pcm",
				sampleRate: 8e3
			};
		}
	};
}
export { buildFishAudioSpeechProvider };
