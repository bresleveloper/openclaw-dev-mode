import { asBoolean, asRecord, normalizeOptionalLowercaseString, normalizeOptionalString, normalizeOptionalTrimmedStringList, parseBooleanValue } from "openclaw/plugin-sdk/string-coerce-runtime";
import { buildMeetingConfigAudioCommands, resolveMeetingChromeConfig, resolveMeetingRealtimeConfig } from "openclaw/plugin-sdk/meeting-config";
import { addTimerTimeoutGraceMs, resolvePositiveTimerTimeoutMs } from "openclaw/plugin-sdk/number-runtime";
import { REALTIME_VOICE_AGENT_CONSULT_TOOL_NAME } from "openclaw/plugin-sdk/realtime-voice";
// extensions/google-meet/src/config.ts
function resolveGoogleMeetGatewayOperationTimeoutMs(config) {
	return Math.max(6e4, addTimerTimeoutGraceMs(config.chrome.joinTimeoutMs, 3e4) ?? 1, addTimerTimeoutGraceMs(config.voiceCall.requestTimeoutMs, 1e4) ?? 1);
}
const DEFAULT_GOOGLE_MEET_AUDIO_BUFFER_BYTES = 4096;
const PLAIN_DECIMAL_NUMBER_RE = /^\d+(?:\.\d+)?$/;
const DEFAULT_GOOGLE_MEET_AUDIO_COMMANDS = buildMeetingConfigAudioCommands("blackhole-2ch", "pcm16-24khz", DEFAULT_GOOGLE_MEET_AUDIO_BUFFER_BYTES);
const DEFAULT_GOOGLE_MEET_AUDIO_INPUT_COMMAND = DEFAULT_GOOGLE_MEET_AUDIO_COMMANDS.inputCommand;
const DEFAULT_GOOGLE_MEET_AUDIO_OUTPUT_COMMAND = DEFAULT_GOOGLE_MEET_AUDIO_COMMANDS.outputCommand;
const DEFAULT_GOOGLE_MEET_REALTIME_INSTRUCTIONS = `You are joining a private Google Meet as an OpenClaw voice transport. Keep spoken replies brief and natural. In agent mode, wait for OpenClaw consult results and speak them exactly. In bidi mode, answer directly and call ${REALTIME_VOICE_AGENT_CONSULT_TOOL_NAME} for deeper reasoning, current information, or tools.`;
function resolveOptionalNumber(value) {
	if (typeof value === "number" && Number.isFinite(value)) return value;
	if (typeof value === "string" && value.trim()) {
		const trimmed = value.trim();
		const parsed = PLAIN_DECIMAL_NUMBER_RE.test(trimmed) ? Number(trimmed) : NaN;
		return Number.isFinite(parsed) ? parsed : void 0;
	}
}
function readGoogleMeetEnv(env, name) {
	return normalizeOptionalString(env[name]) ?? normalizeOptionalString(env[name.slice(9)]);
}
function resolveTransport(value, fallback) {
	const normalized = normalizeOptionalLowercaseString(value);
	return normalized === "chrome" || normalized === "chrome-node" || normalized === "twilio" ? normalized : fallback;
}
function resolveMode(value, fallback) {
	const normalized = normalizeOptionalLowercaseString(value);
	if (normalized === "realtime") return "agent";
	return normalized === "agent" || normalized === "bidi" || normalized === "transcribe" ? normalized : fallback;
}
function resolveChromeAudioFormat(value) {
	switch (normalizeOptionalString(value)?.toLowerCase().replaceAll("_", "-")) {
		case "pcm16-24khz":
		case "pcm16-24k":
		case "pcm24":
		case "pcm": return "pcm16-24khz";
		case "g711-ulaw-8khz":
		case "g711-ulaw-8k":
		case "g711-ulaw":
		case "mulaw":
		case "mu-law": return "g711-ulaw-8khz";
		default: return;
	}
}
function resolveGoogleMeetConfig(input) {
	const env = process.env;
	const raw = asRecord(input);
	const defaults = asRecord(raw.defaults);
	const preview = asRecord(raw.preview);
	const chrome = asRecord(raw.chrome);
	const chromeNode = asRecord(raw.chromeNode);
	const twilio = asRecord(raw.twilio);
	const voiceCall = asRecord(raw.voiceCall);
	const realtime = asRecord(raw.realtime);
	const realtimeProvider = normalizeOptionalString(realtime.provider);
	const oauth = asRecord(raw.oauth);
	const auth = asRecord(raw.auth);
	return {
		enabled: asBoolean(raw.enabled) ?? true,
		defaults: { meeting: normalizeOptionalString(defaults.meeting) ?? readGoogleMeetEnv(env, "OPENCLAW_GOOGLE_MEET_DEFAULT_MEETING") },
		preview: { enrollmentAcknowledged: asBoolean(preview.enrollmentAcknowledged) ?? parseBooleanValue(readGoogleMeetEnv(env, "OPENCLAW_GOOGLE_MEET_PREVIEW_ACK")) ?? false },
		defaultTransport: resolveTransport(raw.defaultTransport, "chrome"),
		defaultMode: resolveMode(raw.defaultMode, "agent"),
		chrome: {
			...resolveMeetingChromeConfig(chrome, {
				resolveAudioFormat: (hasCustomCommands) => resolveChromeAudioFormat(chrome.audioFormat) ?? (hasCustomCommands ? "g711-ulaw-8khz" : "pcm16-24khz"),
				waitForInCallMs: 2e4
			}),
			audioBridgeCommand: normalizeOptionalTrimmedStringList(chrome.audioBridgeCommand),
			audioBridgeHealthCommand: normalizeOptionalTrimmedStringList(chrome.audioBridgeHealthCommand)
		},
		chromeNode: { node: normalizeOptionalString(chromeNode.node) },
		twilio: {
			defaultDialInNumber: normalizeOptionalString(twilio.defaultDialInNumber),
			defaultPin: normalizeOptionalString(twilio.defaultPin),
			defaultDtmfSequence: normalizeOptionalString(twilio.defaultDtmfSequence)
		},
		voiceCall: {
			enabled: asBoolean(voiceCall.enabled) ?? true,
			gatewayUrl: normalizeOptionalString(voiceCall.gatewayUrl),
			token: normalizeOptionalString(voiceCall.token),
			requestTimeoutMs: resolvePositiveTimerTimeoutMs(voiceCall.requestTimeoutMs, 3e4),
			dtmfDelayMs: resolvePositiveTimerTimeoutMs(voiceCall.dtmfDelayMs, 12e3),
			postDtmfSpeechDelayMs: resolvePositiveTimerTimeoutMs(voiceCall.postDtmfSpeechDelayMs, 5e3),
			introMessage: normalizeOptionalString(voiceCall.introMessage)
		},
		realtime: resolveMeetingRealtimeConfig(realtime, {
			instructions: DEFAULT_GOOGLE_MEET_REALTIME_INSTRUCTIONS,
			transcriptionProvider: realtimeProvider && realtimeProvider !== "google" ? realtimeProvider : "openai"
		}),
		oauth: {
			clientId: normalizeOptionalString(oauth.clientId) ?? normalizeOptionalString(auth.clientId) ?? readGoogleMeetEnv(env, "OPENCLAW_GOOGLE_MEET_CLIENT_ID"),
			clientSecret: normalizeOptionalString(oauth.clientSecret) ?? normalizeOptionalString(auth.clientSecret) ?? readGoogleMeetEnv(env, "OPENCLAW_GOOGLE_MEET_CLIENT_SECRET"),
			refreshToken: normalizeOptionalString(oauth.refreshToken) ?? readGoogleMeetEnv(env, "OPENCLAW_GOOGLE_MEET_REFRESH_TOKEN"),
			accessToken: normalizeOptionalString(oauth.accessToken) ?? readGoogleMeetEnv(env, "OPENCLAW_GOOGLE_MEET_ACCESS_TOKEN"),
			expiresAt: resolveOptionalNumber(oauth.expiresAt) ?? resolveOptionalNumber(readGoogleMeetEnv(env, "OPENCLAW_GOOGLE_MEET_ACCESS_TOKEN_EXPIRES_AT"))
		},
		auth: {
			provider: "google-oauth",
			clientId: normalizeOptionalString(auth.clientId),
			clientSecret: normalizeOptionalString(auth.clientSecret),
			tokenPath: normalizeOptionalString(auth.tokenPath)
		}
	};
}
export { resolveGoogleMeetGatewayOperationTimeoutMs as i, DEFAULT_GOOGLE_MEET_AUDIO_OUTPUT_COMMAND as n, resolveGoogleMeetConfig as r, DEFAULT_GOOGLE_MEET_AUDIO_INPUT_COMMAND as t };
