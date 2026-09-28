import { b as parseFiniteNumber } from "./number-coercion-CLj0HTDM.mjs";
import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { n as parseBooleanValue } from "./boolean-C30ltbL7.mjs";
import { l as normalizeResolvedSecretInputString } from "./types.secrets-B5xWSzLp.mjs";
import "./string-coerce-runtime-C_MKhRVt.mjs";
import "./secret-input-DTg0P0Pk.mjs";
import { o as XAI_IMAGE_MODELS, r as XAI_DEFAULT_IMAGE_MODEL } from "./model-definitions-DA8Fbxqz.mjs";
import { _ as normalizeXaiRealtimeProviderConfig, i as XAI_REALTIME_DEFAULT_MODEL, m as XAI_REALTIME_VOICES } from "./realtime-voice-config-BZr_Tp5F.mjs";
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
export { XAI_VIDEO_ASPECT_RATIOS as a, createXaiImageGenerationProviderMetadata as c, createXaiRealtimeVoiceProviderMetadata as d, createXaiVideoGenerationProviderMetadata as f, XAI_SUPPORTED_IMAGE_ASPECT_RATIOS as i, createXaiMediaUnderstandingProviderMetadata as l, normalizeXaiRealtimeTranscriptionProviderConfig as m, DEFAULT_XAI_VIDEO_MODEL as n, XAI_VIDEO_DEFAULT_TIMEOUT_MS as o, isXaiVideo15Model as p, XAI_IMAGE_DEFAULT_TIMEOUT_MS as r, assertXaiRealtimeVoiceRequestSupported as s, DEFAULT_XAI_VIDEO_BASE_URL as t, createXaiRealtimeTranscriptionProviderMetadata as u };
