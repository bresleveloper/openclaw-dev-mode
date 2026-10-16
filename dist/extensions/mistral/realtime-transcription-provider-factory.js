import { asOptionalRecord, normalizeOptionalString, parseFiniteNumber } from "openclaw/plugin-sdk/string-coerce-runtime";
import { normalizeResolvedSecretInputString, normalizeSecretInput } from "openclaw/plugin-sdk/secret-input";
//#region extensions/mistral/realtime-transcription-provider-factory.ts
const MISTRAL_REALTIME_DEFAULT_BASE_URL = "wss://api.mistral.ai";
const MISTRAL_REALTIME_DEFAULT_MODEL = "voxtral-mini-transcribe-realtime-2602";
const MISTRAL_REALTIME_DEFAULT_SAMPLE_RATE = 8e3;
const MISTRAL_REALTIME_DEFAULT_ENCODING = "pcm_mulaw";
const MISTRAL_REALTIME_DEFAULT_DELAY_MS = 800;
const MISTRAL_REALTIME_CONNECT_TIMEOUT_MS = 1e4;
const MISTRAL_REALTIME_CLOSE_TIMEOUT_MS = 5e3;
const MISTRAL_REALTIME_MAX_RECONNECT_ATTEMPTS = 5;
const MISTRAL_REALTIME_RECONNECT_DELAY_MS = 1e3;
const MISTRAL_REALTIME_MAX_QUEUED_BYTES = 2097152;
const MISTRAL_REALTIME_SPEECH_CONTENT = /[\p{L}\p{N}]/u;
const MISTRAL_REALTIME_MAX_PARTIAL_TRANSCRIPT_BYTES = 262144;
const MISTRAL_REALTIME_PARTIAL_TRANSCRIPT_OVERFLOW_MESSAGE = "Mistral realtime transcription exceeded the 256 KiB in-progress transcript limit";
function readNestedMistralConfig(rawConfig) {
	const raw = asOptionalRecord(rawConfig);
	const providers = asOptionalRecord(raw?.providers);
	return asOptionalRecord(providers?.mistral ?? raw?.mistral ?? raw) ?? {};
}
function normalizeMistralEncoding(value) {
	const normalized = normalizeOptionalString(value)?.toLowerCase();
	if (!normalized) return;
	switch (normalized) {
		case "pcm":
		case "linear16":
		case "pcm_s16le": return "pcm_s16le";
		case "pcm_s32le":
		case "pcm_f16le":
		case "pcm_f32le": return normalized;
		case "mulaw":
		case "ulaw":
		case "g711_ulaw":
		case "g711-mulaw":
		case "pcm_mulaw": return "pcm_mulaw";
		case "alaw":
		case "g711_alaw":
		case "g711-alaw":
		case "pcm_alaw": return "pcm_alaw";
		default: throw new Error(`Invalid Mistral realtime transcription encoding: ${normalized}`);
	}
}
function normalizeMistralRealtimeBaseUrl(value) {
	const raw = normalizeOptionalString(value ?? process.env.MISTRAL_REALTIME_BASE_URL);
	if (!raw) return MISTRAL_REALTIME_DEFAULT_BASE_URL;
	const url = new URL(raw);
	url.protocol = url.protocol === "http:" ? "ws:" : url.protocol === "https:" ? "wss:" : url.protocol;
	url.pathname = url.pathname.replace(/\/v1\/?$/, "").replace(/\/+$/, "");
	return url.toString().replace(/\/+$/, "");
}
function toMistralRealtimeWsUrl(config) {
	const base = new URL(`${normalizeMistralRealtimeBaseUrl(config.baseUrl)}/`);
	const url = new URL("v1/audio/transcriptions/realtime", base);
	url.searchParams.set("model", config.model);
	if (config.targetStreamingDelayMs != null) url.searchParams.set("target_streaming_delay_ms", String(config.targetStreamingDelayMs));
	return url.toString();
}
function normalizeProviderConfig(config) {
	const raw = readNestedMistralConfig(config);
	return {
		apiKey: normalizeMistralApiKey(raw.apiKey),
		baseUrl: normalizeOptionalString(raw.baseUrl),
		model: normalizeOptionalString(raw.model ?? raw.sttModel),
		sampleRate: parseFiniteNumber(raw.sampleRate ?? raw.sample_rate),
		encoding: normalizeMistralEncoding(raw.encoding),
		targetStreamingDelayMs: parseFiniteNumber(raw.targetStreamingDelayMs ?? raw.target_streaming_delay_ms ?? raw.delayMs)
	};
}
function normalizeMistralApiKey(value) {
	const resolved = normalizeResolvedSecretInputString({
		value,
		path: "plugins.entries.voice-call.config.streaming.providers.mistral.apiKey"
	});
	return normalizeSecretInput(resolved) || void 0;
}
function readErrorDetail(event) {
	const message = event.error?.message;
	if (typeof message === "string") return message;
	if (message && typeof message === "object") return JSON.stringify(message);
	if (typeof event.error?.code === "number") return `Mistral realtime transcription error (${event.error.code})`;
	return "Mistral realtime transcription error";
}
function measureTranscriptDeltaBytes(partialText, delta) {
	const previousCodeUnit = partialText.charCodeAt(partialText.length - 1);
	const nextCodeUnit = delta.charCodeAt(0);
	const completesSplitSurrogatePair = previousCodeUnit >= 55296 && previousCodeUnit <= 56319 && nextCodeUnit >= 56320 && nextCodeUnit <= 57343;
	return Buffer.byteLength(delta, "utf8") - (completesSplitSurrogatePair ? 2 : 0);
}
function createMistralRealtimeTranscriptionSession(config, createRealtimeTranscriptionWebSocketSession) {
	let partialText = "";
	let partialBytes = 0;
	let hasFinalSegment = false;
	let terminal = false;
	const clearPartial = () => {
		partialText = "";
		partialBytes = 0;
	};
	const emitFinalTranscript = (text, source) => {
		if (!text.trim() || source === "pending" && !MISTRAL_REALTIME_SPEECH_CONTENT.test(text)) return;
		hasFinalSegment ||= source === "segment";
		config.onTranscript?.(text);
	};
	const failTerminal = (error, transport) => {
		if (terminal) return;
		terminal = true;
		clearPartial();
		transport.closeNow();
		try {
			config.onError?.(error);
		} catch {}
	};
	const handleEvent = (event, transport) => {
		if (terminal) return;
		if (event.type === "session.created") {
			clearPartial();
			hasFinalSegment = false;
			transport.sendJson({
				type: "session.update",
				session: { audio_format: {
					encoding: config.encoding,
					sample_rate: config.sampleRate
				} }
			});
			transport.markReady();
			return;
		}
		if (!transport.isReady() && event.type === "error") {
			transport.failConnect(new Error(readErrorDetail(event)));
			return;
		}
		switch (event.type) {
			case "transcription.text.delta":
				if (event.text) {
					const deltaBytes = measureTranscriptDeltaBytes(partialText, event.text);
					if (deltaBytes > MISTRAL_REALTIME_MAX_PARTIAL_TRANSCRIPT_BYTES - partialBytes) {
						failTerminal(/* @__PURE__ */ new Error(MISTRAL_REALTIME_PARTIAL_TRANSCRIPT_OVERFLOW_MESSAGE), transport);
						return;
					}
					partialText += event.text;
					partialBytes += deltaBytes;
					config.onPartial?.(partialText);
				}
				return;
			case "transcription.segment":
				if (event.text?.trim()) {
					emitFinalTranscript(event.text, "segment");
					clearPartial();
				}
				return;
			case "transcription.done": {
				terminal = true;
				const source = hasFinalSegment ? "pending" : "terminal";
				const terminalText = source === "pending" ? partialText : event.text?.trim() ? event.text : partialText;
				clearPartial();
				try {
					emitFinalTranscript(terminalText, source);
				} finally {
					transport.closeNow();
				}
				return;
			}
			case "error": failTerminal(new Error(readErrorDetail(event)), transport);
		}
	};
	return createRealtimeTranscriptionWebSocketSession({
		providerId: "mistral",
		callbacks: config,
		url: () => toMistralRealtimeWsUrl(config),
		headers: { Authorization: `Bearer ${config.apiKey}` },
		connectTimeoutMs: MISTRAL_REALTIME_CONNECT_TIMEOUT_MS,
		closeTimeoutMs: MISTRAL_REALTIME_CLOSE_TIMEOUT_MS,
		maxReconnectAttempts: MISTRAL_REALTIME_MAX_RECONNECT_ATTEMPTS,
		reconnectDelayMs: MISTRAL_REALTIME_RECONNECT_DELAY_MS,
		maxQueuedBytes: MISTRAL_REALTIME_MAX_QUEUED_BYTES,
		connectTimeoutMessage: "Mistral realtime transcription connection timeout",
		reconnectLimitMessage: "Mistral realtime transcription reconnect limit reached",
		sendAudio: (audio, transport) => {
			transport.sendJson({
				type: "input_audio.append",
				audio: audio.toString("base64")
			});
		},
		onClose: (transport) => {
			transport.sendJson({ type: "input_audio.flush" });
			transport.sendJson({ type: "input_audio.end" });
		},
		onMessage: handleEvent
	});
}
function buildMistralRealtimeTranscriptionProvider({ createRealtimeTranscriptionWebSocketSession }) {
	return {
		id: "mistral",
		label: "Mistral Realtime Transcription",
		aliases: ["mistral-realtime", "voxtral-realtime"],
		defaultModel: MISTRAL_REALTIME_DEFAULT_MODEL,
		autoSelectOrder: 45,
		resolveConfig: ({ rawConfig }) => normalizeProviderConfig(rawConfig),
		isConfigured: ({ providerConfig }) => Boolean(normalizeProviderConfig(providerConfig).apiKey || normalizeMistralApiKey(process.env.MISTRAL_API_KEY)),
		createSession: (req) => {
			const config = normalizeProviderConfig(req.providerConfig);
			const apiKey = config.apiKey || normalizeMistralApiKey(process.env.MISTRAL_API_KEY);
			if (!apiKey) throw new Error("Mistral API key missing");
			return createMistralRealtimeTranscriptionSession({
				...req,
				apiKey,
				baseUrl: normalizeMistralRealtimeBaseUrl(config.baseUrl),
				model: config.model ?? MISTRAL_REALTIME_DEFAULT_MODEL,
				sampleRate: config.sampleRate ?? MISTRAL_REALTIME_DEFAULT_SAMPLE_RATE,
				encoding: config.encoding ?? MISTRAL_REALTIME_DEFAULT_ENCODING,
				targetStreamingDelayMs: config.targetStreamingDelayMs ?? MISTRAL_REALTIME_DEFAULT_DELAY_MS
			}, createRealtimeTranscriptionWebSocketSession);
		}
	};
}
//#endregion
export { buildMistralRealtimeTranscriptionProvider };
