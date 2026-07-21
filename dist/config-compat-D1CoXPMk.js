import { i as asOptionalRecord, s as readStringField } from "./record-coerce-DHZ4bFlT.js";
import "./string-coerce-runtime-ZbuYDJgZ.js";
import { t as VoiceCallConfigSchema } from "./config-DAK6Fzbw.js";
//#region extensions/voice-call/src/config-compat.ts
/** Version where legacy voice-call config shape support is removed. */
const VOICE_CALL_LEGACY_CONFIG_REMOVAL_VERSION = "2026.6.0";
const asObject = asOptionalRecord;
const getString = readStringField;
/** Read finite numeric config values. */
function getNumber(obj, key) {
	const value = obj?.[key];
	return typeof value === "number" && Number.isFinite(value) ? value : void 0;
}
/** Merge legacy provider-specific values into the canonical providers map. */
function mergeProviderConfig(providersValue, providerId, compatValues) {
	if (Object.keys(compatValues).length === 0) return asObject(providersValue);
	const providers = asObject(providersValue) ?? {};
	const existing = asObject(providers[providerId]) ?? {};
	return {
		...providers,
		[providerId]: {
			...existing,
			...compatValues
		}
	};
}
/** Collect legacy voice-call config keys that should be migrated. */
function collectVoiceCallLegacyConfigIssues(value) {
	const raw = asObject(value) ?? {};
	const realtime = asObject(raw.realtime);
	const realtimeAgentContext = asObject(realtime?.agentContext);
	const twilio = asObject(raw.twilio);
	const streaming = asObject(raw.streaming);
	const issues = [];
	if (raw.provider === "log") issues.push({
		path: "provider",
		replacement: "provider",
		message: "Replace provider \"log\" with \"mock\"."
	});
	if (typeof twilio?.from === "string") issues.push({
		path: "twilio.from",
		replacement: "fromNumber",
		message: "Move twilio.from to fromNumber."
	});
	if (typeof streaming?.sttProvider === "string") issues.push({
		path: "streaming.sttProvider",
		replacement: "streaming.provider",
		message: "Move streaming.sttProvider to streaming.provider."
	});
	if (typeof streaming?.openaiApiKey === "string") issues.push({
		path: "streaming.openaiApiKey",
		replacement: "streaming.providers.openai.apiKey",
		message: "Move streaming.openaiApiKey to streaming.providers.openai.apiKey."
	});
	if (typeof streaming?.sttModel === "string") issues.push({
		path: "streaming.sttModel",
		replacement: "streaming.providers.openai.model",
		message: "Move streaming.sttModel to streaming.providers.openai.model."
	});
	if (typeof streaming?.silenceDurationMs === "number") issues.push({
		path: "streaming.silenceDurationMs",
		replacement: "streaming.providers.openai.silenceDurationMs",
		message: "Move streaming.silenceDurationMs to streaming.providers.openai.silenceDurationMs."
	});
	if (typeof streaming?.vadThreshold === "number") issues.push({
		path: "streaming.vadThreshold",
		replacement: "streaming.providers.openai.vadThreshold",
		message: "Move streaming.vadThreshold to streaming.providers.openai.vadThreshold."
	});
	if (realtimeAgentContext && Object.hasOwn(realtimeAgentContext, "includeSystemPrompt")) issues.push({
		path: "realtime.agentContext.includeSystemPrompt",
		replacement: "realtime.agentContext",
		message: "Remove realtime.agentContext.includeSystemPrompt; realtime context now uses the generated agent prompt."
	});
	return issues;
}
/** Format runtime warnings for legacy voice-call config keys. */
function formatVoiceCallLegacyConfigWarnings(params) {
	const issues = collectVoiceCallLegacyConfigIssues(params.value);
	if (issues.length === 0) return [];
	return [`[voice-call] legacy config keys detected under ${params.configPathPrefix}; runtime loading will not rewrite them, and support for the legacy shape will be removed in ${VOICE_CALL_LEGACY_CONFIG_REMOVAL_VERSION}. Run "${params.doctorFixCommand}".`, ...issues.map((issue) => `[voice-call] ${params.configPathPrefix}.${issue.path}: ${issue.message}`)];
}
/** Migrate legacy voice-call config input to the current canonical shape. */
function migrateVoiceCallLegacyConfigInput(params) {
	const raw = asObject(params.value) ?? {};
	const realtime = asObject(raw.realtime);
	const realtimeAgentContext = asObject(realtime?.agentContext);
	const twilio = asObject(raw.twilio);
	const streaming = asObject(raw.streaming);
	const configPathPrefix = params.configPathPrefix ?? "plugins.entries.voice-call.config";
	const issues = collectVoiceCallLegacyConfigIssues(raw);
	const legacyStreamingOpenAICompat = {};
	const streamingOpenAIApiKey = getString(streaming, "openaiApiKey");
	if (streamingOpenAIApiKey) legacyStreamingOpenAICompat.apiKey = streamingOpenAIApiKey;
	const streamingSttModel = getString(streaming, "sttModel");
	if (streamingSttModel) legacyStreamingOpenAICompat.model = streamingSttModel;
	const streamingSilenceDurationMs = getNumber(streaming, "silenceDurationMs");
	if (streamingSilenceDurationMs !== void 0) legacyStreamingOpenAICompat.silenceDurationMs = streamingSilenceDurationMs;
	const streamingVadThreshold = getNumber(streaming, "vadThreshold");
	if (streamingVadThreshold !== void 0) legacyStreamingOpenAICompat.vadThreshold = streamingVadThreshold;
	const streamingProvider = getString(streaming, "provider");
	const legacyStreamingProvider = getString(streaming, "sttProvider");
	const normalizedStreaming = streaming ? {
		...streaming,
		provider: streamingProvider ?? legacyStreamingProvider,
		providers: mergeProviderConfig(streaming.providers, "openai", legacyStreamingOpenAICompat)
	} : void 0;
	if (normalizedStreaming) {
		delete normalizedStreaming.sttProvider;
		delete normalizedStreaming.openaiApiKey;
		delete normalizedStreaming.sttModel;
		delete normalizedStreaming.silenceDurationMs;
		delete normalizedStreaming.vadThreshold;
	}
	const normalizedTwilio = twilio ? { ...twilio } : void 0;
	if (normalizedTwilio) delete normalizedTwilio.from;
	const normalizedRealtimeAgentContext = realtimeAgentContext ? { ...realtimeAgentContext } : void 0;
	if (normalizedRealtimeAgentContext) delete normalizedRealtimeAgentContext.includeSystemPrompt;
	const normalizedRealtime = realtime ? {
		...realtime,
		agentContext: normalizedRealtimeAgentContext ?? realtime.agentContext
	} : void 0;
	const config = {
		...raw,
		provider: raw.provider === "log" ? "mock" : raw.provider,
		fromNumber: raw.fromNumber ?? (typeof twilio?.from === "string" ? twilio.from : void 0),
		twilio: normalizedTwilio,
		streaming: normalizedStreaming,
		realtime: normalizedRealtime
	};
	const changes = [];
	if (raw.provider === "log") changes.push(`Moved ${configPathPrefix}.provider "log" → "mock".`);
	if (typeof twilio?.from === "string" && typeof raw.fromNumber !== "string") changes.push(`Moved ${configPathPrefix}.twilio.from → ${configPathPrefix}.fromNumber.`);
	if (typeof streaming?.sttProvider === "string") changes.push(`Moved ${configPathPrefix}.streaming.sttProvider → ${configPathPrefix}.streaming.provider.`);
	if (typeof streaming?.openaiApiKey === "string") changes.push(`Moved ${configPathPrefix}.streaming.openaiApiKey → ${configPathPrefix}.streaming.providers.openai.apiKey.`);
	if (typeof streaming?.sttModel === "string") changes.push(`Moved ${configPathPrefix}.streaming.sttModel → ${configPathPrefix}.streaming.providers.openai.model.`);
	if (getNumber(streaming, "silenceDurationMs") !== void 0) changes.push(`Moved ${configPathPrefix}.streaming.silenceDurationMs → ${configPathPrefix}.streaming.providers.openai.silenceDurationMs.`);
	else if (typeof streaming?.silenceDurationMs === "number") changes.push(`Removed invalid ${configPathPrefix}.streaming.silenceDurationMs.`);
	if (getNumber(streaming, "vadThreshold") !== void 0) changes.push(`Moved ${configPathPrefix}.streaming.vadThreshold → ${configPathPrefix}.streaming.providers.openai.vadThreshold.`);
	else if (typeof streaming?.vadThreshold === "number") changes.push(`Removed invalid ${configPathPrefix}.streaming.vadThreshold.`);
	if (realtimeAgentContext && Object.hasOwn(realtimeAgentContext, "includeSystemPrompt")) changes.push(`Removed ${configPathPrefix}.realtime.agentContext.includeSystemPrompt.`);
	return {
		config,
		changes,
		issues
	};
}
/** Normalize legacy voice-call config input without returning migration metadata. */
function normalizeVoiceCallLegacyConfigInput(value) {
	return migrateVoiceCallLegacyConfigInput({ value }).config;
}
/** Parse voice-call plugin config after applying legacy normalization. */
function parseVoiceCallPluginConfig(value) {
	return VoiceCallConfigSchema.parse(normalizeVoiceCallLegacyConfigInput(value));
}
//#endregion
export { parseVoiceCallPluginConfig as i, migrateVoiceCallLegacyConfigInput as n, normalizeVoiceCallLegacyConfigInput as r, formatVoiceCallLegacyConfigWarnings as t };
