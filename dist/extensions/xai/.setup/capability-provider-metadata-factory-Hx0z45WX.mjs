import { n as XAI_DEFAULT_IMAGE_MODEL, r as XAI_IMAGE_MODELS, t as XAI_BASE_URL } from "./model-definitions-BeXcawE4.mjs";
import { normalizeResolvedSecretInputString } from "openclaw/plugin-sdk/secret-input";
import { asFiniteNumberInRange, asOptionalObjectRecord, asSafeIntegerInRange, isRecord, normalizeOptionalString, parseBooleanValue, parseFiniteNumber } from "openclaw/plugin-sdk/string-coerce-runtime";
//#region extensions/xai/realtime-voice-config.ts
const XAI_REALTIME_DEFAULT_MODEL = "grok-voice-latest";
const XAI_REALTIME_CONNECT_TIMEOUT_MS = 1e4;
const XAI_REALTIME_WS_MAX_PAYLOAD_BYTES = 16777216;
const XAI_REALTIME_BASE_RECONNECT_DELAY_MS = 1e3;
const XAI_REALTIME_MAX_PENDING_PLAYBACK_MARKS = 1024;
const XAI_REALTIME_DEFAULT_VAD_THRESHOLD = .85;
const XAI_REALTIME_INPUT_TRANSCRIPTION_MODEL = "grok-transcribe";
const XAI_REALTIME_ACTIVE_RESPONSE_ERROR_PREFIX = "Conversation already has an active response in progress:";
const XAI_REALTIME_NO_ACTIVE_RESPONSE_CANCEL_ERROR = "Cancellation failed: no active response found";
const XAI_REALTIME_VOICES = [
	"eve",
	"ara",
	"rex",
	"sal",
	"leo"
];
function serializeXaiRealtimeToolResult(result) {
	const message = "xAI realtime voice tool result is not JSON-serializable";
	try {
		const serialized = JSON.stringify(result);
		if (typeof serialized === "string") return serialized;
	} catch (cause) {
		throw new Error(message, { cause });
	}
	throw new Error(message);
}
function readNestedXaiConfig(rawConfig) {
	const raw = asOptionalObjectRecord(rawConfig);
	const providers = asOptionalObjectRecord(raw?.providers);
	return asOptionalObjectRecord(providers?.xai ?? raw?.xai ?? raw) ?? {};
}
function normalizeXaiRealtimeBaseUrl(value) {
	return normalizeOptionalString(value ?? process.env.XAI_BASE_URL) ?? XAI_BASE_URL;
}
function normalizeXaiRealtimeVoice(value) {
	const normalized = normalizeOptionalString(value);
	if (!normalized) return;
	const lower = normalized.toLowerCase();
	return XAI_REALTIME_VOICES.includes(lower) ? lower : normalized;
}
function asXaiDurationMs(value) {
	return asSafeIntegerInRange(value, {
		min: 0,
		max: 1e4
	});
}
function asXaiReasoningEffort(value) {
	const normalized = normalizeOptionalString(value);
	if (!normalized) return;
	if (normalized === "high" || normalized === "none") return normalized;
	throw new Error("xAI realtime voice reasoningEffort must be \"high\" or \"none\"");
}
function normalizeXaiRealtimeProviderConfig(config) {
	const raw = readNestedXaiConfig(config);
	return {
		apiKey: normalizeResolvedSecretInputString({
			value: raw.apiKey,
			path: "plugins.entries.voice-call.config.realtime.providers.xai.apiKey"
		}),
		baseUrl: normalizeOptionalString(raw.baseUrl),
		model: normalizeOptionalString(raw.model),
		voice: normalizeXaiRealtimeVoice(raw.speakerVoice ?? raw.voice),
		vadThreshold: asFiniteNumberInRange(raw.vadThreshold, {
			min: .1,
			max: .9
		}),
		silenceDurationMs: asXaiDurationMs(raw.silenceDurationMs),
		prefixPaddingMs: asXaiDurationMs(raw.prefixPaddingMs),
		interruptResponseOnInputAudio: parseBooleanValue(raw.interruptResponseOnInputAudio),
		reasoningEffort: asXaiReasoningEffort(raw.reasoningEffort),
		sessionResumption: parseBooleanValue(raw.sessionResumption)
	};
}
function readXaiRealtimeErrorDetail(error) {
	if (typeof error === "string" && error) return error;
	const record = asOptionalObjectRecord(error);
	return normalizeOptionalString(record?.message) ?? normalizeOptionalString(record?.code) ?? "xAI realtime voice error";
}
function toXaiRealtimeWsUrl(baseUrl, model, conversationId) {
	const url = new URL(normalizeXaiRealtimeBaseUrl(baseUrl));
	url.protocol = url.protocol === "http:" ? "ws:" : "wss:";
	url.pathname = `${url.pathname.replace(/\/+$/, "")}/realtime`;
	url.searchParams.set("model", model);
	if (conversationId) url.searchParams.set("conversation_id", conversationId);
	return url.toString();
}
//#endregion
//#region extensions/xai/capability-provider-metadata-factory.ts
const XAI_IMAGE_DEFAULT_TIMEOUT_MS = 6e5;
const XAI_SUPPORTED_IMAGE_ASPECT_RATIOS = [
	"1:1",
	"16:9",
	"9:16",
	"4:3",
	"3:4",
	"3:2",
	"2:3",
	"2:1",
	"1:2",
	"19.5:9",
	"9:19.5",
	"20:9",
	"9:20"
];
function createXaiImageGenerationProviderMetadata() {
	return {
		id: "xai",
		label: "xAI",
		defaultModel: XAI_DEFAULT_IMAGE_MODEL,
		defaultTimeoutMs: XAI_IMAGE_DEFAULT_TIMEOUT_MS,
		models: [...XAI_IMAGE_MODELS],
		capabilities: {
			generate: {
				maxCount: 4,
				supportsAspectRatio: true,
				supportsResolution: true,
				supportsSize: false
			},
			edit: {
				enabled: true,
				maxCount: 4,
				maxInputImages: 3,
				supportsAspectRatio: true,
				supportsResolution: true,
				supportsSize: false
			},
			geometry: {
				aspectRatios: [...XAI_SUPPORTED_IMAGE_ASPECT_RATIOS],
				resolutions: ["1K", "2K"]
			}
		}
	};
}
function createXaiMediaUnderstandingProviderMetadata() {
	return {
		id: "xai",
		capabilities: ["audio"],
		autoPriority: { audio: 25 }
	};
}
const DEFAULT_XAI_VIDEO_BASE_URL = "https://api.x.ai/v1";
const DEFAULT_XAI_VIDEO_MODEL = "grok-imagine-video";
const XAI_VIDEO_15_MODEL = "grok-imagine-video-1.5";
const XAI_VIDEO_DEFAULT_TIMEOUT_MS = 6e5;
const XAI_VIDEO_ASPECT_RATIOS = /* @__PURE__ */ new Set([
	"1:1",
	"16:9",
	"9:16",
	"4:3",
	"3:4",
	"3:2",
	"2:3"
]);
const XAI_VIDEO_15_CAPABILITIES = {
	imageToVideo: {
		enabled: true,
		maxVideos: 1,
		maxInputImages: 1,
		maxDurationSeconds: 15,
		aspectRatios: [...XAI_VIDEO_ASPECT_RATIOS],
		resolutions: [
			"480P",
			"720P",
			"1080P"
		],
		supportsAspectRatio: true,
		supportsResolution: true
	},
	videoToVideo: { enabled: false }
};
const XAI_VIDEO_15_MODEL_IDS = /* @__PURE__ */ new Set([
	XAI_VIDEO_15_MODEL,
	"grok-imagine-video-1.5-preview",
	"grok-imagine-video-1.5-2026-05-30"
]);
function isXaiVideo15Model(model) {
	const normalized = normalizeOptionalString(model);
	return normalized ? XAI_VIDEO_15_MODEL_IDS.has(normalized) : false;
}
function createXaiVideoGenerationProviderMetadata(context) {
	return {
		id: "xai",
		label: "xAI",
		defaultModel: DEFAULT_XAI_VIDEO_MODEL,
		defaultTimeoutMs: XAI_VIDEO_DEFAULT_TIMEOUT_MS,
		models: [DEFAULT_XAI_VIDEO_MODEL, XAI_VIDEO_15_MODEL],
		catalogByModel: { [XAI_VIDEO_15_MODEL]: {
			capabilities: XAI_VIDEO_15_CAPABILITIES,
			modes: ["imageToVideo"]
		} },
		isConfigured: (ctx) => context.isProviderApiKeyConfigured({
			provider: "xai",
			...ctx
		}),
		capabilities: {
			generate: {
				maxVideos: 1,
				maxDurationSeconds: 15,
				aspectRatios: [...XAI_VIDEO_ASPECT_RATIOS],
				resolutions: ["480P", "720P"],
				supportsAspectRatio: true,
				supportsResolution: true
			},
			imageToVideo: {
				enabled: true,
				maxVideos: 1,
				maxInputImages: 7,
				maxDurationSeconds: 15,
				aspectRatios: [...XAI_VIDEO_ASPECT_RATIOS],
				resolutions: ["480P", "720P"],
				supportsAspectRatio: true,
				supportsResolution: true
			},
			videoToVideo: {
				enabled: true,
				maxVideos: 1,
				maxInputVideos: 1,
				maxDurationSeconds: 10,
				supportsAspectRatio: false,
				supportsResolution: false
			}
		},
		resolveModelCapabilities: ({ model }) => isXaiVideo15Model(model) ? XAI_VIDEO_15_CAPABILITIES : void 0
	};
}
function normalizeRealtimeTranscriptionEncoding(value) {
	const normalized = normalizeOptionalString(value)?.toLowerCase();
	if (!normalized) return;
	if (normalized === "ulaw" || normalized === "g711_ulaw" || normalized === "g711-mulaw") return "mulaw";
	if (normalized === "g711_alaw" || normalized === "g711-alaw") return "alaw";
	if (normalized === "pcm" || normalized === "mulaw" || normalized === "alaw") return normalized;
	throw new Error(`Invalid xAI realtime transcription encoding: ${normalized}`);
}
function normalizeXaiRealtimeTranscriptionProviderConfig(config) {
	const raw = isRecord(config) ? config : void 0;
	const nested = (isRecord(raw?.providers) ? raw.providers : void 0)?.xai ?? raw?.xai ?? raw;
	const xai = isRecord(nested) ? nested : {};
	return {
		apiKey: normalizeResolvedSecretInputString({
			value: xai.apiKey,
			path: "plugins.entries.voice-call.config.streaming.providers.xai.apiKey"
		}),
		baseUrl: normalizeOptionalString(xai.baseUrl),
		sampleRate: parseFiniteNumber(xai.sampleRate ?? xai.sample_rate),
		encoding: normalizeRealtimeTranscriptionEncoding(xai.encoding),
		interimResults: parseBooleanValue(xai.interimResults ?? xai.interim_results),
		endpointingMs: parseFiniteNumber(xai.endpointingMs ?? xai.endpointing ?? xai.silenceDurationMs),
		language: normalizeOptionalString(xai.language)
	};
}
function createXaiRealtimeTranscriptionProviderMetadata(context) {
	return {
		id: "xai",
		label: "xAI Realtime Transcription",
		aliases: ["xai-realtime", "grok-stt-streaming"],
		autoSelectOrder: 25,
		resolveConfig: ({ rawConfig }) => normalizeXaiRealtimeTranscriptionProviderConfig(rawConfig),
		isConfigured: ({ providerConfig, cfg }) => Boolean(normalizeXaiRealtimeTranscriptionProviderConfig(providerConfig).apiKey ?? normalizeOptionalString(process.env.XAI_API_KEY)) || context.isProviderAuthProfileConfigured({
			provider: "xai",
			cfg
		})
	};
}
const XAI_REALTIME_AUDIO_FORMAT_G711_ULAW_8KHZ = {
	encoding: "g711_ulaw",
	sampleRateHz: 8e3,
	channels: 1
};
const XAI_REALTIME_AUDIO_FORMAT_PCM16_24KHZ = {
	encoding: "pcm16",
	sampleRateHz: 24e3,
	channels: 1
};
function createXaiRealtimeVoiceProviderMetadata(context) {
	return {
		id: "xai",
		label: "xAI Grok Voice",
		aliases: ["xai-realtime-voice", "grok-voice"],
		defaultModel: XAI_REALTIME_DEFAULT_MODEL,
		voices: XAI_REALTIME_VOICES,
		autoSelectOrder: 25,
		capabilities: {
			transports: ["gateway-relay"],
			inputAudioFormats: [XAI_REALTIME_AUDIO_FORMAT_G711_ULAW_8KHZ, XAI_REALTIME_AUDIO_FORMAT_PCM16_24KHZ],
			outputAudioFormats: [XAI_REALTIME_AUDIO_FORMAT_G711_ULAW_8KHZ, XAI_REALTIME_AUDIO_FORMAT_PCM16_24KHZ],
			supportsBargeIn: true,
			handlesInputAudioBargeIn: true,
			supportsToolCalls: true,
			supportsSessionResumption: true
		},
		resolveConfig: ({ rawConfig }) => normalizeXaiRealtimeProviderConfig(rawConfig),
		isConfigured: ({ providerConfig, cfg, agentId }) => hasXaiRealtimeApiKeyInput(normalizeXaiRealtimeProviderConfig(providerConfig).apiKey, cfg, agentId, context)
	};
}
function assertXaiRealtimeVoiceRequestSupported(req) {
	const config = normalizeXaiRealtimeProviderConfig(req.providerConfig);
	if (req.autoRespondToAudio === false) throw new Error("xAI realtime voice requires automatic server-VAD responses; use consultRouting: \"provider-direct\"");
	if ((req.interruptResponseOnInputAudio ?? config.interruptResponseOnInputAudio) === false) throw new Error("xAI realtime voice requires automatic server-VAD interruption handling");
}
function hasXaiRealtimeApiKeyInput(configApiKey, cfg, agentId, { isProviderAuthProfileConfigured, resolveAgentDir }) {
	if (normalizeOptionalString(configApiKey) || normalizeOptionalString(process.env.XAI_API_KEY)) return true;
	return isProviderAuthProfileConfigured({
		provider: "xai",
		cfg,
		...cfg && agentId ? { agentDir: resolveAgentDir(cfg, agentId) } : {}
	});
}
//#endregion
export { XAI_REALTIME_WS_MAX_PAYLOAD_BYTES as C, serializeXaiRealtimeToolResult as D, readXaiRealtimeErrorDetail as E, toXaiRealtimeWsUrl as O, XAI_REALTIME_NO_ACTIVE_RESPONSE_CANCEL_ERROR as S, normalizeXaiRealtimeProviderConfig as T, XAI_REALTIME_CONNECT_TIMEOUT_MS as _, XAI_VIDEO_ASPECT_RATIOS as a, XAI_REALTIME_INPUT_TRANSCRIPTION_MODEL as b, createXaiImageGenerationProviderMetadata as c, createXaiRealtimeVoiceProviderMetadata as d, createXaiVideoGenerationProviderMetadata as f, XAI_REALTIME_BASE_RECONNECT_DELAY_MS as g, XAI_REALTIME_ACTIVE_RESPONSE_ERROR_PREFIX as h, XAI_SUPPORTED_IMAGE_ASPECT_RATIOS as i, createXaiMediaUnderstandingProviderMetadata as l, normalizeXaiRealtimeTranscriptionProviderConfig as m, DEFAULT_XAI_VIDEO_MODEL as n, XAI_VIDEO_DEFAULT_TIMEOUT_MS as o, isXaiVideo15Model as p, XAI_IMAGE_DEFAULT_TIMEOUT_MS as r, assertXaiRealtimeVoiceRequestSupported as s, DEFAULT_XAI_VIDEO_BASE_URL as t, createXaiRealtimeTranscriptionProviderMetadata as u, XAI_REALTIME_DEFAULT_MODEL as v, normalizeXaiRealtimeBaseUrl as w, XAI_REALTIME_MAX_PENDING_PLAYBACK_MARKS as x, XAI_REALTIME_DEFAULT_VAD_THRESHOLD as y };
