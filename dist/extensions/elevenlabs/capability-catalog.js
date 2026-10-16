import { n as resolveElevenLabsApiKeyWithProfileFallback } from "./.setup/config-compat-ClsSqmpW.mjs";
import { normalizeResolvedSecretInputString } from "openclaw/plugin-sdk/secret-input";
import { asBoolean, asFiniteNumberInRange, asOptionalRecord, asSafeIntegerInRange, normalizeLowercaseStringOrEmpty, normalizeOptionalString, parseBooleanValue, parseFiniteNumber } from "openclaw/plugin-sdk/string-coerce-runtime";
import { parseStrictFiniteNumber, parseStrictInteger } from "openclaw/plugin-sdk/number-runtime";
import { MAX_AUDIO_BYTES, normalizeApplyTextNormalization, normalizeLanguageCode, normalizeSeed, requireInRange, resolveSpeechProviderApiKey } from "openclaw/plugin-sdk/speech-provider";
//#region extensions/elevenlabs/shared.ts
const DEFAULT_ELEVENLABS_BASE_URL = "https://api.elevenlabs.io";
function isValidElevenLabsVoiceId(voiceId) {
	return /^[a-zA-Z0-9]{10,40}$/.test(voiceId);
}
function normalizeElevenLabsBaseUrlWithProtocols(baseUrl, allowedProtocols) {
	const trimmed = baseUrl?.trim();
	if (!trimmed) return DEFAULT_ELEVENLABS_BASE_URL;
	const normalized = trimmed.replace(/\/+$/, "");
	let parsed;
	try {
		parsed = new URL(normalized);
	} catch {
		throw new Error("Invalid ElevenLabs baseUrl: value is not a valid URL");
	}
	if (!allowedProtocols.includes(parsed.protocol)) throw new Error(`Invalid ElevenLabs baseUrl: unsupported scheme "${parsed.protocol}" (expected ${allowedProtocols.join(" or ")})`);
	return normalized;
}
function normalizeElevenLabsBaseUrl(baseUrl) {
	return normalizeElevenLabsBaseUrlWithProtocols(baseUrl, ["http:", "https:"]);
}
function normalizeElevenLabsRealtimeBaseUrl(baseUrl) {
	const url = new URL(normalizeElevenLabsBaseUrlWithProtocols(baseUrl, [
		"http:",
		"https:",
		"ws:",
		"wss:"
	]));
	if (url.protocol === "http:" || url.protocol === "https:") url.protocol = url.protocol === "http:" ? "ws:" : "wss:";
	return url.toString().replace(/\/+$/, "");
}
//#endregion
//#region extensions/elevenlabs/realtime-transcription-provider-factory.ts
const ELEVENLABS_REALTIME_DEFAULT_MODEL = "scribe_v2_realtime";
const ELEVENLABS_REALTIME_DEFAULT_AUDIO_FORMAT = "ulaw_8000";
const ELEVENLABS_REALTIME_DEFAULT_SAMPLE_RATE = 8e3;
const ELEVENLABS_REALTIME_DEFAULT_COMMIT_STRATEGY = "vad";
function readNestedElevenLabsConfig(rawConfig) {
	const raw = asOptionalRecord(rawConfig);
	const providers = asOptionalRecord(raw?.providers);
	return asOptionalRecord(providers?.elevenlabs ?? raw?.elevenlabs ?? raw) ?? {};
}
function normalizeCommitStrategy(value) {
	const normalized = normalizeOptionalString(value)?.toLowerCase();
	if (!normalized) return;
	if (normalized === "manual" || normalized === "vad") return normalized;
	throw new Error(`Invalid ElevenLabs realtime transcription commit strategy: ${normalized}`);
}
function normalizePositiveSafeInteger(value) {
	const parsed = parseFiniteNumber(value);
	return asSafeIntegerInRange(parsed, { min: 1 });
}
function normalizeFiniteRange(value, min, max) {
	const parsed = parseFiniteNumber(value);
	return asFiniteNumberInRange(parsed, {
		min,
		max
	});
}
function normalizeIntegerRange(value, min, max) {
	const parsed = parseFiniteNumber(value);
	return asSafeIntegerInRange(parsed, {
		min,
		max
	});
}
function normalizeProviderConfig(config) {
	const raw = readNestedElevenLabsConfig(config);
	return {
		apiKey: normalizeResolvedSecretInputString({
			value: raw.apiKey,
			path: "plugins.entries.voice-call.config.streaming.providers.elevenlabs.apiKey"
		}),
		baseUrl: normalizeOptionalString(raw.baseUrl),
		modelId: normalizeOptionalString(raw.modelId ?? raw.model ?? raw.sttModel),
		audioFormat: normalizeOptionalString(raw.audioFormat ?? raw.audio_format ?? raw.encoding),
		sampleRate: normalizePositiveSafeInteger(raw.sampleRate ?? raw.sample_rate),
		languageCode: normalizeOptionalString(raw.languageCode ?? raw.language),
		commitStrategy: normalizeCommitStrategy(raw.commitStrategy ?? raw.commit_strategy),
		vadSilenceThresholdSecs: normalizeFiniteRange(raw.vadSilenceThresholdSecs ?? raw.vad_silence_threshold_secs, .3, 3),
		vadThreshold: normalizeFiniteRange(raw.vadThreshold ?? raw.vad_threshold, .1, .9),
		minSpeechDurationMs: normalizeIntegerRange(raw.minSpeechDurationMs ?? raw.min_speech_duration_ms, 50, 2e3),
		minSilenceDurationMs: normalizeIntegerRange(raw.minSilenceDurationMs ?? raw.min_silence_duration_ms, 50, 2e3)
	};
}
function toElevenLabsRealtimeWsUrl(config) {
	const url = new URL(`${normalizeElevenLabsRealtimeBaseUrl(config.baseUrl)}/v1/speech-to-text/realtime`);
	url.searchParams.set("model_id", config.modelId);
	url.searchParams.set("audio_format", config.audioFormat);
	url.searchParams.set("commit_strategy", config.commitStrategy);
	url.searchParams.set("include_timestamps", "false");
	url.searchParams.set("include_language_detection", "false");
	if (config.languageCode) url.searchParams.set("language_code", config.languageCode);
	if (config.vadSilenceThresholdSecs != null) url.searchParams.set("vad_silence_threshold_secs", String(config.vadSilenceThresholdSecs));
	if (config.vadThreshold != null) url.searchParams.set("vad_threshold", String(config.vadThreshold));
	if (config.minSpeechDurationMs != null) url.searchParams.set("min_speech_duration_ms", String(config.minSpeechDurationMs));
	if (config.minSilenceDurationMs != null) url.searchParams.set("min_silence_duration_ms", String(config.minSilenceDurationMs));
	return url.toString();
}
function readErrorDetail(event) {
	return normalizeOptionalString(event.error) ?? normalizeOptionalString(event.message) ?? normalizeOptionalString(event.code) ?? "ElevenLabs realtime transcription error";
}
function createElevenLabsRealtimeTranscriptionSession(config, createRealtimeTranscriptionWebSocketSession) {
	let pendingTimestampEcho;
	const sendAudioChunk = (audio, transport) => {
		transport.sendJson({
			message_type: "input_audio_chunk",
			audio_base_64: audio.toString("base64"),
			sample_rate: config.sampleRate,
			...config.commitStrategy === "manual" ? { commit: true } : {}
		});
	};
	const handleEvent = (event, transport) => {
		if (event.message_type === "session_started") {
			pendingTimestampEcho = void 0;
			transport.markReady();
			return;
		}
		const isError = typeof event.error === "string" || event.message_type?.includes("error");
		if (!transport.isReady() && isError) {
			transport.failConnect(new Error(readErrorDetail(event)));
			return;
		}
		switch (event.message_type) {
			case "partial_transcript":
				if (event.text) config.onPartial?.(event.text);
				return;
			case "committed_transcript":
			case "committed_transcript_with_timestamps":
				if (event.text) {
					const hasTimestamps = event.message_type !== "committed_transcript";
					const isEcho = hasTimestamps && pendingTimestampEcho === event.text;
					pendingTimestampEcho = hasTimestamps ? void 0 : event.text;
					if (!isEcho) config.onTranscript?.(event.text);
				}
				return;
			default: if (isError) config.onError?.(new Error(readErrorDetail(event)));
		}
	};
	return createRealtimeTranscriptionWebSocketSession({
		providerId: "elevenlabs",
		callbacks: config,
		url: () => toElevenLabsRealtimeWsUrl(config),
		headers: { "xi-api-key": config.apiKey },
		connectTimeoutMessage: "ElevenLabs realtime transcription connection timeout",
		reconnectLimitMessage: "ElevenLabs realtime transcription reconnect limit reached",
		sendAudio: sendAudioChunk,
		onClose: (transport) => {
			transport.sendJson({
				message_type: "input_audio_chunk",
				audio_base_64: "",
				sample_rate: config.sampleRate,
				commit: true
			});
		},
		onMessage: handleEvent
	});
}
function resolveElevenLabsRealtimeApiKey(config) {
	return config.apiKey ?? resolveElevenLabsApiKeyWithProfileFallback() ?? normalizeOptionalString(process.env.XI_API_KEY);
}
function buildElevenLabsRealtimeTranscriptionProvider({ createRealtimeTranscriptionWebSocketSession }) {
	return {
		id: "elevenlabs",
		label: "ElevenLabs Realtime Transcription",
		aliases: ["elevenlabs-realtime", "scribe-v2-realtime"],
		defaultModel: ELEVENLABS_REALTIME_DEFAULT_MODEL,
		autoSelectOrder: 40,
		resolveConfig: ({ rawConfig }) => normalizeProviderConfig(rawConfig),
		isConfigured: ({ providerConfig }) => Boolean(resolveElevenLabsRealtimeApiKey(normalizeProviderConfig(providerConfig))),
		createSession: (req) => {
			const config = normalizeProviderConfig(req.providerConfig);
			const apiKey = resolveElevenLabsRealtimeApiKey(config);
			if (!apiKey) throw new Error("ElevenLabs API key missing");
			return createElevenLabsRealtimeTranscriptionSession({
				...req,
				apiKey,
				baseUrl: normalizeElevenLabsRealtimeBaseUrl(config.baseUrl),
				modelId: config.modelId ?? ELEVENLABS_REALTIME_DEFAULT_MODEL,
				audioFormat: config.audioFormat ?? ELEVENLABS_REALTIME_DEFAULT_AUDIO_FORMAT,
				sampleRate: config.sampleRate ?? ELEVENLABS_REALTIME_DEFAULT_SAMPLE_RATE,
				commitStrategy: config.commitStrategy ?? ELEVENLABS_REALTIME_DEFAULT_COMMIT_STRATEGY,
				languageCode: config.languageCode,
				vadSilenceThresholdSecs: config.vadSilenceThresholdSecs,
				vadThreshold: config.vadThreshold,
				minSpeechDurationMs: config.minSpeechDurationMs,
				minSilenceDurationMs: config.minSilenceDurationMs
			}, createRealtimeTranscriptionWebSocketSession);
		}
	};
}
//#endregion
//#region extensions/elevenlabs/tts.ts
function assertElevenLabsVoiceSettings(settings) {
	requireInRange(settings.stability, 0, 1, "stability");
	requireInRange(settings.similarityBoost, 0, 1, "similarityBoost");
	requireInRange(settings.style, 0, 1, "style");
	requireInRange(settings.speed, .5, 2, "speed");
}
function resolveElevenLabsAcceptHeader(outputFormat) {
	const normalized = outputFormat.trim().toLowerCase();
	if (!normalized || normalized.startsWith("mp3_")) return "audio/mpeg";
}
function normalizeElevenLabsLatencyTier$1(latencyTier) {
	if (latencyTier === void 0 || !Number.isFinite(latencyTier)) return;
	if (!Number.isSafeInteger(latencyTier)) throw new Error("latencyTier must be an integer");
	requireInRange(latencyTier, 0, 4, "latencyTier");
	return latencyTier;
}
function prepareElevenLabsTtsRequest(params) {
	const { text, baseUrl, voiceId, modelId, outputFormat, seed, applyTextNormalization, languageCode, latencyTier, voiceSettings } = params;
	if (!isValidElevenLabsVoiceId(voiceId)) throw new Error("Invalid voiceId format");
	assertElevenLabsVoiceSettings(voiceSettings);
	const normalizedLanguage = normalizeLanguageCode(languageCode);
	const normalizedNormalization = normalizeApplyTextNormalization(applyTextNormalization);
	const normalizedSeed = normalizeSeed(seed);
	const normalizedBaseUrl = normalizeElevenLabsBaseUrl(baseUrl);
	const normalizedLatencyTier = normalizeElevenLabsLatencyTier$1(latencyTier);
	const url = new URL(`${normalizedBaseUrl}/v1/text-to-speech/${voiceId}${params.stream ? "/stream" : ""}`);
	if (outputFormat) url.searchParams.set("output_format", outputFormat);
	const supportsStreamingLatency = modelId.trim().toLowerCase() !== "eleven_v3";
	if (normalizedLatencyTier !== void 0 && supportsStreamingLatency) url.searchParams.set("optimize_streaming_latency", normalizedLatencyTier.toString());
	return {
		url,
		normalizedBaseUrl,
		acceptHeader: resolveElevenLabsAcceptHeader(outputFormat),
		body: JSON.stringify({
			text,
			model_id: modelId,
			seed: normalizedSeed,
			apply_text_normalization: normalizedNormalization,
			language_code: normalizedLanguage,
			voice_settings: {
				stability: voiceSettings.stability,
				similarity_boost: voiceSettings.similarityBoost,
				style: voiceSettings.style,
				use_speaker_boost: voiceSettings.useSpeakerBoost,
				speed: voiceSettings.speed
			}
		})
	};
}
async function requestElevenLabsTts(params, stream) {
	const { url, normalizedBaseUrl, acceptHeader, body } = prepareElevenLabsTtsRequest({
		...params,
		stream
	});
	const { assertOkOrThrowProviderError } = await import("openclaw/plugin-sdk/provider-http");
	const { fetchWithSsrFGuard, ssrfPolicyFromHttpBaseUrlAllowedHostname } = await import("openclaw/plugin-sdk/ssrf-runtime");
	const result = await fetchWithSsrFGuard({
		url: url.toString(),
		init: {
			method: "POST",
			headers: {
				"xi-api-key": params.apiKey,
				"Content-Type": "application/json",
				...acceptHeader ? { Accept: acceptHeader } : {}
			},
			body
		},
		timeoutMs: params.timeoutMs,
		policy: ssrfPolicyFromHttpBaseUrlAllowedHostname(normalizedBaseUrl),
		auditContext: stream ? "elevenlabs.tts.stream" : "elevenlabs.tts"
	});
	try {
		await assertOkOrThrowProviderError(result.response, "ElevenLabs API error");
		return result;
	} catch (error) {
		await result.release();
		throw error;
	}
}
async function elevenLabsTTS(params) {
	const { readProviderBinaryResponse } = await import("openclaw/plugin-sdk/provider-http");
	const { response, release } = await requestElevenLabsTts(params, false);
	try {
		return await readProviderBinaryResponse(response, "ElevenLabs API error", "audio");
	} finally {
		await release();
	}
}
async function elevenLabsTTSStream(params) {
	const { createBoundedProviderBinaryStream } = await import("openclaw/plugin-sdk/provider-binary-stream");
	const { assertProviderBinaryResponseContent } = await import("openclaw/plugin-sdk/provider-http");
	const { response, release } = await requestElevenLabsTts(params, true);
	let handedOff = false;
	try {
		assertProviderBinaryResponseContent(response, "ElevenLabs API error", "audio");
		if (!response.body) throw new Error("ElevenLabs API response missing audio stream");
		const boundedStream = createBoundedProviderBinaryStream(response.body, {
			maxBytes: MAX_AUDIO_BYTES,
			createOverflowError: ({ maxBytes }) => /* @__PURE__ */ new Error(`ElevenLabs API error: audio response exceeds ${maxBytes} bytes`),
			createReleaseError: () => /* @__PURE__ */ new Error("ElevenLabs TTS stream released"),
			cleanup: release
		});
		handedOff = true;
		return {
			audioStream: boundedStream.stream,
			release: boundedStream.release
		};
	} finally {
		if (!handedOff) await release();
	}
}
//#endregion
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
	const { assertOkOrThrowProviderError, readProviderJsonResponse } = await import("openclaw/plugin-sdk/provider-http");
	const { fetchWithSsrFGuard, ssrfPolicyFromHttpBaseUrlAllowedHostname } = await import("openclaw/plugin-sdk/ssrf-runtime");
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
//#region extensions/elevenlabs/capability-catalog.ts
var capability_catalog_default = ((context) => ({
	speechProviders: [buildElevenLabsSpeechProvider(context)],
	realtimeTranscriptionProviders: [buildElevenLabsRealtimeTranscriptionProvider(context)]
}));
//#endregion
export { capability_catalog_default as default };
