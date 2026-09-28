import { t as XAI_BASE_URL } from "./model-definitions-BeXcawE4.mjs";
import { m as normalizeXaiRealtimeTranscriptionProviderConfig, u as createXaiRealtimeTranscriptionProviderMetadata } from "./capability-provider-metadata-factory-VkSZouOh.mjs";
import { t as xaiUserAgentHeaderFor } from "./xai-user-agent-82PmYLBQ.mjs";
import { isRecord, normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
//#region extensions/xai/realtime-transcription-provider-factory.ts
const XAI_REALTIME_STT_DEFAULT_SAMPLE_RATE = 8e3;
const XAI_REALTIME_STT_DEFAULT_ENCODING = "mulaw";
const XAI_REALTIME_STT_DEFAULT_ENDPOINTING_MS = 800;
const XAI_REALTIME_STT_CONNECT_TIMEOUT_MS = 1e4;
const XAI_REALTIME_STT_CLOSE_TIMEOUT_MS = 5e3;
const XAI_REALTIME_STT_MAX_RECONNECT_ATTEMPTS = 5;
const XAI_REALTIME_STT_RECONNECT_DELAY_MS = 1e3;
const XAI_REALTIME_STT_MAX_QUEUED_BYTES = 2097152;
function normalizeXaiRealtimeBaseUrl(value) {
	return normalizeOptionalString(value ?? process.env.XAI_BASE_URL) ?? XAI_BASE_URL;
}
function toXaiRealtimeWsUrl(config) {
	const url = new URL(normalizeXaiRealtimeBaseUrl(config.baseUrl));
	url.protocol = url.protocol === "http:" ? "ws:" : "wss:";
	url.pathname = `${url.pathname.replace(/\/+$/, "")}/stt`;
	url.searchParams.set("sample_rate", String(config.sampleRate));
	url.searchParams.set("encoding", config.encoding);
	url.searchParams.set("interim_results", String(config.interimResults));
	url.searchParams.set("endpointing", String(config.endpointingMs));
	if (config.language) url.searchParams.set("language", config.language);
	return url.toString();
}
function readErrorDetail(value) {
	if (typeof value === "string") return value;
	const record = isRecord(value) ? value : void 0;
	const message = normalizeOptionalString(record?.message);
	const code = normalizeOptionalString(record?.code);
	return message ?? code ?? "xAI realtime transcription error";
}
function readTranscriptText(event) {
	return normalizeOptionalString(event.text ?? event.transcript);
}
function createXaiRealtimeTranscriptionSession(config, createRealtimeTranscriptionWebSocketSession) {
	let lastTranscript;
	let speechStarted = false;
	const emitTranscript = (text) => {
		if (text === lastTranscript) return;
		lastTranscript = text;
		config.onTranscript?.(text);
	};
	const handleEvent = (event, transport) => {
		if (event.type === "transcript.created") {
			transport.markReady();
			return;
		}
		if (!transport.isReady() && event.type === "error") {
			transport.failConnect(new Error(readErrorDetail(event.error ?? event.message)));
			return;
		}
		switch (event.type) {
			case "transcript.partial": {
				const text = readTranscriptText(event);
				if (!text) return;
				if (!speechStarted) {
					lastTranscript = void 0;
					speechStarted = true;
					config.onSpeechStart?.();
				}
				if (event.is_final && event.speech_final) {
					emitTranscript(text);
					speechStarted = false;
					return;
				}
				config.onPartial?.(text);
				return;
			}
			case "transcript.done": {
				const text = readTranscriptText(event);
				if (text) emitTranscript(text);
				transport.closeNow();
				return;
			}
			case "error": config.onError?.(new Error(readErrorDetail(event.error ?? event.message)));
		}
	};
	return createRealtimeTranscriptionWebSocketSession({
		providerId: "xai",
		callbacks: config,
		url: () => toXaiRealtimeWsUrl(config),
		headers: async () => {
			return {
				Authorization: `Bearer ${config.resolveApiKey ? await config.resolveApiKey() : config.apiKey}`,
				...xaiUserAgentHeaderFor(config.baseUrl)
			};
		},
		connectTimeoutMs: XAI_REALTIME_STT_CONNECT_TIMEOUT_MS,
		closeTimeoutMs: XAI_REALTIME_STT_CLOSE_TIMEOUT_MS,
		maxReconnectAttempts: XAI_REALTIME_STT_MAX_RECONNECT_ATTEMPTS,
		reconnectDelayMs: XAI_REALTIME_STT_RECONNECT_DELAY_MS,
		maxQueuedBytes: XAI_REALTIME_STT_MAX_QUEUED_BYTES,
		connectTimeoutMessage: "xAI realtime transcription connection timeout",
		connectClosedBeforeReadyMessage: "xAI realtime transcription connection closed before ready",
		reconnectLimitMessage: "xAI realtime transcription reconnect limit reached",
		sendAudio: (audio, transport) => {
			transport.sendBinary(audio);
		},
		onClose: (transport) => {
			transport.sendJson({ type: "audio.done" });
		},
		onMessage: handleEvent
	});
}
function buildXaiRealtimeTranscriptionProvider(runtime) {
	return {
		...createXaiRealtimeTranscriptionProviderMetadata(runtime),
		createSession: (req) => {
			const config = normalizeXaiRealtimeTranscriptionProviderConfig(req.providerConfig);
			const seedApiKey = normalizeOptionalString(config.apiKey) ?? normalizeOptionalString(process.env.XAI_API_KEY);
			return createXaiRealtimeTranscriptionSession({
				...req,
				apiKey: seedApiKey ?? "",
				resolveApiKey: () => resolveXaiRealtimeApiKey(config.apiKey, req.cfg, runtime.resolveApiKeyForProvider),
				baseUrl: normalizeXaiRealtimeBaseUrl(config.baseUrl),
				sampleRate: config.sampleRate ?? XAI_REALTIME_STT_DEFAULT_SAMPLE_RATE,
				encoding: config.encoding ?? XAI_REALTIME_STT_DEFAULT_ENCODING,
				interimResults: config.interimResults ?? true,
				endpointingMs: config.endpointingMs ?? XAI_REALTIME_STT_DEFAULT_ENDPOINTING_MS,
				language: config.language
			}, runtime.createRealtimeTranscriptionWebSocketSession);
		}
	};
}
async function resolveXaiRealtimeApiKey(configApiKey, cfg, resolveApiKeyForProvider) {
	const direct = normalizeOptionalString(configApiKey) ?? normalizeOptionalString(process.env.XAI_API_KEY);
	if (direct) return direct;
	const auth = await resolveApiKeyForProvider({
		provider: "xai",
		cfg
	});
	const oauthKey = normalizeOptionalString(auth?.apiKey);
	if (oauthKey) return oauthKey;
	throw new Error("xAI credentials missing for realtime STT. Sign in with `openclaw onboard --auth-choice xai-oauth`, or run `openclaw onboard --auth-choice xai-api-key`, or set XAI_API_KEY.");
}
//#endregion
export { buildXaiRealtimeTranscriptionProvider };
