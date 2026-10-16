import { asBoolean, asRecord, normalizeOptionalLowercaseString, normalizeOptionalString, normalizeOptionalTrimmedStringList, parseBooleanValue, readStringValue } from "openclaw/plugin-sdk/string-coerce-runtime";
import { addTimerTimeoutGraceMs, asPositiveFiniteNumber, resolvePositiveTimerTimeoutMs } from "openclaw/plugin-sdk/number-runtime";
import { REALTIME_VOICE_AGENT_CONSULT_TOOL_NAME, resolveRealtimeVoiceAgentConsultToolPolicy } from "openclaw/plugin-sdk/realtime-voice";
//#region extensions/google-meet/src/config.ts
function resolveGoogleMeetGatewayOperationTimeoutMs(config) {
	return Math.max(6e4, addTimerTimeoutGraceMs(config.chrome.joinTimeoutMs, 3e4) ?? 1, addTimerTimeoutGraceMs(config.voiceCall.requestTimeoutMs, 1e4) ?? 1);
}
const SOX_DEFAULT_BUFFER_BYTES = 8192;
const SOX_MIN_BUFFER_BYTES = 17;
const DEFAULT_GOOGLE_MEET_AUDIO_BUFFER_BYTES = SOX_DEFAULT_BUFFER_BYTES / 2;
const PLAIN_DECIMAL_NUMBER_RE = /^\d+(?:\.\d+)?$/;
function buildGoogleMeetAudioCommands(backend, format, bufferBytes) {
	const pipeWire = backend === "pipewire-pulse" || backend === "auto" && process.platform === "linux";
	const sampleRate = format === "g711-ulaw-8khz" ? 8e3 : 24e3;
	const bits = format === "g711-ulaw-8khz" ? 8 : 16;
	if (pipeWire) {
		const pulseFormat = format === "g711-ulaw-8khz" ? "ulaw" : "s16le";
		const latencyMs = Math.max(1, Math.ceil(bufferBytes / (sampleRate * Math.ceil(bits / 8)) * 1e3));
		const common = [
			"--device=openclaw_meeting_audio",
			`--format=${pulseFormat}`,
			`--rate=${sampleRate}`,
			"--channels=1",
			`--latency-msec=${latencyMs}`
		];
		return {
			inputCommand: [
				"parec",
				"--raw",
				...common
			],
			outputCommand: [
				"pacat",
				"--raw",
				"--playback",
				...common
			]
		};
	}
	const wire = format === "g711-ulaw-8khz" ? [
		"-t",
		"raw",
		"-r",
		"8000",
		"-c",
		"1",
		"-e",
		"mu-law",
		"-b",
		"8",
		"-"
	] : [
		"-t",
		"raw",
		"-r",
		"24000",
		"-c",
		"1",
		"-e",
		"signed-integer",
		"-b",
		"16",
		"-L",
		"-"
	];
	const withBuffer = (executable, args) => [
		executable,
		"-q",
		"--buffer",
		String(bufferBytes),
		...args
	];
	return {
		inputCommand: withBuffer("sox", [
			"-t",
			"coreaudio",
			"BlackHole 2ch",
			...wire
		]),
		outputCommand: withBuffer("sox", [
			...wire,
			"-t",
			"coreaudio",
			"BlackHole 2ch"
		])
	};
}
const DEFAULT_GOOGLE_MEET_AUDIO_COMMANDS = buildGoogleMeetAudioCommands("blackhole-2ch", "pcm16-24khz", DEFAULT_GOOGLE_MEET_AUDIO_BUFFER_BYTES);
const DEFAULT_GOOGLE_MEET_AUDIO_INPUT_COMMAND = DEFAULT_GOOGLE_MEET_AUDIO_COMMANDS.inputCommand;
const DEFAULT_GOOGLE_MEET_AUDIO_OUTPUT_COMMAND = DEFAULT_GOOGLE_MEET_AUDIO_COMMANDS.outputCommand;
const DEFAULT_GOOGLE_MEET_REALTIME_INSTRUCTIONS = `You are joining a private Google Meet as an OpenClaw voice transport. Keep spoken replies brief and natural. In agent mode, wait for OpenClaw consult results and speak them exactly. In bidi mode, answer directly and call ${REALTIME_VOICE_AGENT_CONSULT_TOOL_NAME} for deeper reasoning, current information, or tools.`;
const DEFAULT_GOOGLE_MEET_REALTIME_INTRO_MESSAGE = "Say exactly: I'm here and listening.";
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
function resolveProvidersConfig(value) {
	const raw = asRecord(value);
	const providers = {};
	for (const [key, entry] of Object.entries(raw)) {
		const providerId = normalizeOptionalLowercaseString(key);
		if (!providerId) continue;
		providers[providerId] = asRecord(entry);
	}
	return providers;
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
function resolveRealtimeStrategy(value, fallback) {
	const normalized = normalizeOptionalLowercaseString(value);
	return normalized === "agent" || normalized === "bidi" ? normalized : fallback;
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
function resolveAudioBufferBytes(value, fallback) {
	return Math.max(SOX_MIN_BUFFER_BYTES, Math.trunc(asPositiveFiniteNumber(value) ?? fallback));
}
function resolveAudioBackend(value) {
	const normalized = normalizeOptionalLowercaseString(value)?.replaceAll("_", "-");
	return normalized === "blackhole-2ch" || normalized === "pipewire-pulse" ? normalized : "auto";
}
function resolveGoogleMeetConfig(input) {
	const env = process.env;
	const raw = asRecord(input);
	const defaults = asRecord(raw.defaults);
	const preview = asRecord(raw.preview);
	const chrome = asRecord(raw.chrome);
	const configuredAudioInputCommand = normalizeOptionalTrimmedStringList(chrome.audioInputCommand);
	const configuredAudioOutputCommand = normalizeOptionalTrimmedStringList(chrome.audioOutputCommand);
	const hasCustomAudioCommand = configuredAudioInputCommand !== void 0 || configuredAudioOutputCommand !== void 0;
	const audioFormat = resolveChromeAudioFormat(chrome.audioFormat) ?? (hasCustomAudioCommand ? "g711-ulaw-8khz" : "pcm16-24khz");
	const audioBufferBytes = resolveAudioBufferBytes(chrome.audioBufferBytes, DEFAULT_GOOGLE_MEET_AUDIO_BUFFER_BYTES);
	const audioBackend = resolveAudioBackend(chrome.audioBackend);
	const audioCommands = buildGoogleMeetAudioCommands(audioBackend, audioFormat, audioBufferBytes);
	const chromeNode = asRecord(raw.chromeNode);
	const twilio = asRecord(raw.twilio);
	const voiceCall = asRecord(raw.voiceCall);
	const realtime = asRecord(raw.realtime);
	const realtimeProvider = normalizeOptionalString(realtime.provider);
	const resolvedRealtimeProvider = realtimeProvider ?? "openai";
	const oauth = asRecord(raw.oauth);
	const auth = asRecord(raw.auth);
	return {
		enabled: asBoolean(raw.enabled) ?? true,
		defaults: { meeting: normalizeOptionalString(defaults.meeting) ?? readGoogleMeetEnv(env, "OPENCLAW_GOOGLE_MEET_DEFAULT_MEETING") },
		preview: { enrollmentAcknowledged: asBoolean(preview.enrollmentAcknowledged) ?? parseBooleanValue(readGoogleMeetEnv(env, "OPENCLAW_GOOGLE_MEET_PREVIEW_ACK")) ?? false },
		defaultTransport: resolveTransport(raw.defaultTransport, "chrome"),
		defaultMode: resolveMode(raw.defaultMode, "agent"),
		chrome: {
			audioBackend,
			audioFormat,
			audioBufferBytes,
			launch: asBoolean(chrome.launch) ?? true,
			browserProfile: normalizeOptionalString(chrome.browserProfile),
			guestName: normalizeOptionalString(chrome.guestName) ?? "OpenClaw Agent",
			reuseExistingTab: asBoolean(chrome.reuseExistingTab) ?? true,
			autoJoin: asBoolean(chrome.autoJoin) ?? true,
			joinTimeoutMs: resolvePositiveTimerTimeoutMs(chrome.joinTimeoutMs, 3e4),
			waitForInCallMs: resolvePositiveTimerTimeoutMs(chrome.waitForInCallMs, 2e4),
			audioInputCommand: configuredAudioInputCommand ?? audioCommands.inputCommand,
			audioOutputCommand: configuredAudioOutputCommand ?? audioCommands.outputCommand,
			audioInputCommandOverride: configuredAudioInputCommand,
			audioOutputCommandOverride: configuredAudioOutputCommand,
			bargeInInputCommand: normalizeOptionalTrimmedStringList(chrome.bargeInInputCommand),
			bargeInRmsThreshold: asPositiveFiniteNumber(chrome.bargeInRmsThreshold) ?? 650,
			bargeInPeakThreshold: asPositiveFiniteNumber(chrome.bargeInPeakThreshold) ?? 2500,
			bargeInCooldownMs: resolvePositiveTimerTimeoutMs(chrome.bargeInCooldownMs, 900),
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
		realtime: {
			strategy: resolveRealtimeStrategy(realtime.strategy, "agent"),
			provider: resolvedRealtimeProvider,
			transcriptionProvider: normalizeOptionalString(realtime.transcriptionProvider) ?? (realtimeProvider && realtimeProvider !== "google" ? resolvedRealtimeProvider : "openai"),
			voiceProvider: normalizeOptionalString(realtime.voiceProvider),
			model: normalizeOptionalString(realtime.model),
			instructions: normalizeOptionalString(realtime.instructions) ?? DEFAULT_GOOGLE_MEET_REALTIME_INSTRUCTIONS,
			introMessage: readStringValue(realtime.introMessage)?.trim() ?? DEFAULT_GOOGLE_MEET_REALTIME_INTRO_MESSAGE,
			agentId: normalizeOptionalString(realtime.agentId),
			toolPolicy: resolveRealtimeVoiceAgentConsultToolPolicy(realtime.toolPolicy, "safe-read-only"),
			providers: resolveProvidersConfig(realtime.providers)
		},
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
//#endregion
export { resolveGoogleMeetGatewayOperationTimeoutMs as i, DEFAULT_GOOGLE_MEET_AUDIO_OUTPUT_COMMAND as n, resolveGoogleMeetConfig as r, DEFAULT_GOOGLE_MEET_AUDIO_INPUT_COMMAND as t };
