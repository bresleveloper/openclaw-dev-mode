import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { b as parseFiniteNumber, c as asFiniteNumberInRange, f as asSafeIntegerInRange } from "./number-coercion-CkhMiRw8.mjs";
import { a as asOptionalRecord } from "./record-coerce-TIsquoVR.mjs";
import { d as normalizeResolvedSecretInputString } from "./types.secrets-Dgbd2kyP.mjs";
import "./string-coerce-runtime-BbIJhy7G.mjs";
import "./secret-input-CHX7JVid.mjs";
import { i as normalizeElevenLabsRealtimeBaseUrl } from "./shared-DZDHzIqN.mjs";
import { i as resolveElevenLabsApiKeyWithProfileFallback } from "./config-compat-CPg6wQ30.mjs";
import "./config-api-DQS_0XFM.mjs";
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
function normalizeMinimumDurationMs(value) {
	const parsed = parseFiniteNumber(value);
	return asSafeIntegerInRange(parsed, {
		min: 50,
		max: 2e3
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
		minSpeechDurationMs: normalizeMinimumDurationMs(raw.minSpeechDurationMs ?? raw.min_speech_duration_ms),
		minSilenceDurationMs: normalizeMinimumDurationMs(raw.minSilenceDurationMs ?? raw.min_silence_duration_ms)
	};
}
function readErrorDetail(event) {
	return normalizeOptionalString(event.error) ?? normalizeOptionalString(event.message) ?? normalizeOptionalString(event.code) ?? "ElevenLabs realtime transcription error";
}
function resolveElevenLabsRealtimeApiKey(config) {
	return config.apiKey ?? resolveElevenLabsApiKeyWithProfileFallback() ?? normalizeOptionalString(process.env.XI_API_KEY);
}
function buildElevenLabsRealtimeTranscriptionProvider({ createRealtimeTranscriptionWebSocketSession }) {
	const isConfigured = ({ providerConfig }) => Boolean(resolveElevenLabsRealtimeApiKey(normalizeProviderConfig(providerConfig)));
	return {
		id: "elevenlabs",
		label: "ElevenLabs Realtime Transcription",
		aliases: ["elevenlabs-realtime", "scribe-v2-realtime"],
		defaultModel: ELEVENLABS_REALTIME_DEFAULT_MODEL,
		autoSelectOrder: 40,
		resolveConfig: ({ rawConfig }) => normalizeProviderConfig(rawConfig),
		isConfigured,
		isConfiguredAsync: async (ctx) => isConfigured(ctx),
		createSession: (req) => {
			const config = normalizeProviderConfig(req.providerConfig);
			const apiKey = resolveElevenLabsRealtimeApiKey(config);
			if (!apiKey) throw new Error("ElevenLabs API key missing");
			const baseUrl = normalizeElevenLabsRealtimeBaseUrl(config.baseUrl);
			const sampleRate = config.sampleRate ?? ELEVENLABS_REALTIME_DEFAULT_SAMPLE_RATE;
			const commitStrategy = config.commitStrategy ?? ELEVENLABS_REALTIME_DEFAULT_COMMIT_STRATEGY;
			const callbacks = { ...req };
			let pendingTimestampEcho;
			return createRealtimeTranscriptionWebSocketSession({
				providerId: "elevenlabs",
				callbacks,
				url: () => {
					const url = new URL(`${normalizeElevenLabsRealtimeBaseUrl(baseUrl)}/v1/speech-to-text/realtime`);
					url.searchParams.set("model_id", config.modelId ?? ELEVENLABS_REALTIME_DEFAULT_MODEL);
					url.searchParams.set("audio_format", config.audioFormat ?? ELEVENLABS_REALTIME_DEFAULT_AUDIO_FORMAT);
					url.searchParams.set("commit_strategy", commitStrategy);
					url.searchParams.set("include_timestamps", "false");
					url.searchParams.set("include_language_detection", "false");
					if (config.languageCode) url.searchParams.set("language_code", config.languageCode);
					if (config.vadSilenceThresholdSecs != null) url.searchParams.set("vad_silence_threshold_secs", String(config.vadSilenceThresholdSecs));
					if (config.vadThreshold != null) url.searchParams.set("vad_threshold", String(config.vadThreshold));
					if (config.minSpeechDurationMs != null) url.searchParams.set("min_speech_duration_ms", String(config.minSpeechDurationMs));
					if (config.minSilenceDurationMs != null) url.searchParams.set("min_silence_duration_ms", String(config.minSilenceDurationMs));
					return url.toString();
				},
				headers: { "xi-api-key": apiKey },
				connectTimeoutMessage: "ElevenLabs realtime transcription connection timeout",
				reconnectLimitMessage: "ElevenLabs realtime transcription reconnect limit reached",
				sendAudio: (audio, transport) => {
					transport.sendJson({
						message_type: "input_audio_chunk",
						audio_base_64: audio.toString("base64"),
						sample_rate: sampleRate,
						...commitStrategy === "manual" ? { commit: true } : {}
					});
				},
				onClose: (transport) => {
					transport.sendJson({
						message_type: "input_audio_chunk",
						audio_base_64: "",
						sample_rate: sampleRate,
						commit: true
					});
				},
				onMessage: (event, transport) => {
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
							if (event.text) callbacks.onPartial?.(event.text);
							return;
						case "committed_transcript":
						case "committed_transcript_with_timestamps":
							if (event.text) {
								const hasTimestamps = event.message_type !== "committed_transcript";
								const isEcho = hasTimestamps && pendingTimestampEcho === event.text;
								pendingTimestampEcho = hasTimestamps ? void 0 : event.text;
								if (!isEcho) callbacks.onTranscript?.(event.text);
							}
							return;
						default: if (isError) callbacks.onError?.(new Error(readErrorDetail(event)));
					}
				}
			});
		}
	};
}
//#endregion
export { buildElevenLabsRealtimeTranscriptionProvider as t };
