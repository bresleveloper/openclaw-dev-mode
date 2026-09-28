import { c as asFiniteNumberInRange, f as asSafeIntegerInRange } from "./number-coercion-CLj0HTDM.mjs";
import { i as asOptionalObjectRecord } from "./record-coerce-DItp3I4t.mjs";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { n as parseBooleanValue } from "./boolean-C30ltbL7.mjs";
import { l as normalizeResolvedSecretInputString } from "./types.secrets-B5xWSzLp.mjs";
import "./string-coerce-runtime-C_MKhRVt.mjs";
import "./secret-input-DTg0P0Pk.mjs";
import { t as XAI_BASE_URL } from "./model-definitions-DA8Fbxqz.mjs";
//#region extensions/xai/realtime-voice-config.ts
const XAI_REALTIME_DEFAULT_MODEL = "grok-voice-latest";
const XAI_REALTIME_CONNECT_TIMEOUT_MS = 1e4;
const XAI_REALTIME_WS_MAX_PAYLOAD_BYTES = 16777216;
const XAI_REALTIME_MAX_RECONNECT_ATTEMPTS = 5;
const XAI_REALTIME_BASE_RECONNECT_DELAY_MS = 1e3;
const XAI_REALTIME_MAX_PENDING_TOOL_RESULTS = 128;
const XAI_REALTIME_MAX_PENDING_USER_MESSAGES = 128;
const XAI_REALTIME_MAX_PENDING_PLAYBACK_MARKS = 1024;
const XAI_REALTIME_DEFAULT_VAD_THRESHOLD = .85;
const XAI_REALTIME_DEFAULT_PREFIX_PADDING_MS = 333;
const XAI_REALTIME_DEFAULT_SILENCE_DURATION_MS = 500;
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
function asXaiVadThreshold(value) {
	return asFiniteNumberInRange(value, {
		min: .1,
		max: .9
	});
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
		vadThreshold: asXaiVadThreshold(raw.vadThreshold),
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
export { normalizeXaiRealtimeProviderConfig as _, XAI_REALTIME_DEFAULT_PREFIX_PADDING_MS as a, toXaiRealtimeWsUrl as b, XAI_REALTIME_INPUT_TRANSCRIPTION_MODEL as c, XAI_REALTIME_MAX_PENDING_USER_MESSAGES as d, XAI_REALTIME_MAX_RECONNECT_ATTEMPTS as f, normalizeXaiRealtimeBaseUrl as g, XAI_REALTIME_WS_MAX_PAYLOAD_BYTES as h, XAI_REALTIME_DEFAULT_MODEL as i, XAI_REALTIME_MAX_PENDING_PLAYBACK_MARKS as l, XAI_REALTIME_VOICES as m, XAI_REALTIME_BASE_RECONNECT_DELAY_MS as n, XAI_REALTIME_DEFAULT_SILENCE_DURATION_MS as o, XAI_REALTIME_NO_ACTIVE_RESPONSE_CANCEL_ERROR as p, XAI_REALTIME_CONNECT_TIMEOUT_MS as r, XAI_REALTIME_DEFAULT_VAD_THRESHOLD as s, XAI_REALTIME_ACTIVE_RESPONSE_ERROR_PREFIX as t, XAI_REALTIME_MAX_PENDING_TOOL_RESULTS as u, readXaiRealtimeErrorDetail as v, serializeXaiRealtimeToolResult as y };
