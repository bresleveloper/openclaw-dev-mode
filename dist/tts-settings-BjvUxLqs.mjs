import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { c as isRecord, t as asNonArrayRecord } from "./record-coerce-TIsquoVR.mjs";
import { l as getRuntimeConfigSourceSnapshot, o as getRuntimeConfigSnapshot, w as selectApplicableRuntimeConfig } from "./runtime-snapshot-DYptB0Cf.mjs";
import { a as resolveTtsPrefsPathValue, i as resolveTtsAutoModeFromPrefs, l as normalizeTtsAutoMode, r as resolveEffectiveTtsConfig, t as readTtsPrefs } from "./tts-config-CxmNZyL1.mjs";
import { i as normalizeCapabilityProviderId } from "./provider-registry-shared-Cov0065J.mjs";
//#region src/tts/speaker.ts
/** Populate canonical and legacy speaker voice fields together. */
function withSpeakerSelectionCompat(config) {
	const next = config ? { ...config } : {};
	const speakerVoice = normalizeOptionalString(next.speakerVoice);
	const speakerVoiceId = normalizeOptionalString(next.speakerVoiceId);
	const voice = normalizeOptionalString(next.voice);
	const voiceName = normalizeOptionalString(next.voiceName);
	const voiceId = normalizeOptionalString(next.voiceId);
	const canonicalVoice = speakerVoice ?? (speakerVoiceId ? void 0 : voice ?? voiceName);
	const canonicalVoiceId = speakerVoiceId ?? (speakerVoice ? void 0 : voiceId);
	if (canonicalVoice) {
		next.speakerVoice = canonicalVoice;
		next.voice = canonicalVoice;
		next.voiceName = canonicalVoice;
	}
	if (canonicalVoiceId) {
		next.speakerVoiceId = canonicalVoiceId;
		next.voiceId = canonicalVoiceId;
	}
	return next;
}
/** Fill legacy speaker fields only when callers have not set them explicitly. */
function withSpeakerSelectionFallbackCompat(config) {
	const next = config ? { ...config } : {};
	const speakerVoice = normalizeOptionalString(next.speakerVoice);
	const speakerVoiceId = normalizeOptionalString(next.speakerVoiceId);
	if (speakerVoice) {
		next.voice ??= speakerVoice;
		next.voiceName ??= speakerVoice;
	}
	if (speakerVoiceId) next.voiceId ??= speakerVoiceId;
	return next;
}
//#endregion
//#region src/tts/tts-settings.ts
const DEFAULT_TTS_TIMEOUT_MS = 3e4;
const DEFAULT_TTS_MAX_LENGTH = 1500;
const DEFAULT_TTS_SUMMARIZE = true;
const DEFAULT_MAX_TEXT_LENGTH = 4096;
let machinePrefsPathResolver = () => void 0;
function setTtsMachinePrefsPathResolver(resolver) {
	machinePrefsPathResolver = resolver ?? (() => void 0);
}
function normalizeConfiguredSpeechProviderId(providerId) {
	const normalized = normalizeCapabilityProviderId(providerId);
	if (!normalized) return;
	return normalized === "edge" ? "microsoft" : normalized;
}
function normalizeTtsPersonaId(personaId) {
	return normalizeOptionalLowercaseString(personaId ?? void 0);
}
function resolveModelOverridePolicy(overrides) {
	const enabled = overrides?.enabled ?? true;
	return {
		enabled,
		allowText: enabled && (overrides?.allowText ?? true),
		allowProvider: enabled && (overrides?.allowProvider ?? false),
		allowVoice: enabled && (overrides?.allowVoice ?? true),
		allowModelId: enabled && (overrides?.allowModelId ?? true),
		allowVoiceSettings: enabled && (overrides?.allowVoiceSettings ?? true),
		allowNormalization: enabled && (overrides?.allowNormalization ?? true),
		allowSeed: enabled && (overrides?.allowSeed ?? true)
	};
}
function resolveTtsRuntimeConfig(cfg) {
	return selectApplicableRuntimeConfig({
		inputConfig: cfg,
		runtimeConfig: getRuntimeConfigSnapshot(),
		runtimeSourceConfig: getRuntimeConfigSourceSnapshot()
	}) ?? cfg;
}
function asProviderConfig(value) {
	return withSpeakerSelectionCompat(asNonArrayRecord(value));
}
function normalizeProviderConfigMap(value) {
	const rawMap = asNonArrayRecord(value);
	if (Object.keys(rawMap).length === 0) return;
	const next = {};
	for (const [providerId, providerConfig] of Object.entries(rawMap)) {
		const normalized = normalizeConfiguredSpeechProviderId(providerId) ?? providerId;
		next[normalized] = asProviderConfig(providerConfig);
	}
	return next;
}
function collectTtsPersonas(raw) {
	const rawPersonas = asNonArrayRecord(raw.personas);
	const personas = {};
	for (const [id, value] of Object.entries(rawPersonas)) {
		const normalizedId = normalizeTtsPersonaId(id);
		if (!normalizedId || !isRecord(value)) continue;
		const persona = value;
		personas[normalizedId] = {
			...persona,
			id: normalizedId,
			provider: normalizeConfiguredSpeechProviderId(persona.provider) ?? persona.provider,
			providers: normalizeProviderConfigMap(persona.providers)
		};
	}
	return personas;
}
const TTS_CONFIG_RESERVED_KEYS = /* @__PURE__ */ new Set([
	"auto",
	"enabled",
	"maxTextLength",
	"mode",
	"modelOverrides",
	"persona",
	"personas",
	"prefsPath",
	"provider",
	"providers",
	"summaryModel",
	"timeoutMs"
]);
function isTtsConfigReservedKey(key) {
	return TTS_CONFIG_RESERVED_KEYS.has(key);
}
function collectDirectProviderConfigEntries(raw) {
	const entries = normalizeProviderConfigMap(raw.providers) ?? {};
	for (const [key, value] of Object.entries(raw)) {
		if (isTtsConfigReservedKey(key)) continue;
		if (!isRecord(value)) continue;
		const normalized = normalizeConfiguredSpeechProviderId(key) ?? key;
		entries[normalized] ??= asProviderConfig(value);
	}
	return entries;
}
function resolveTtsConfig(cfgInput, contextOrAgentId) {
	const cfg = resolveTtsRuntimeConfig(cfgInput);
	const raw = resolveEffectiveTtsConfig(cfg, contextOrAgentId);
	const providerSource = raw.provider ? "config" : "default";
	const timeoutMs = raw.timeoutMs ?? 3e4;
	const timeoutMsSource = raw.timeoutMs === void 0 ? "default" : "config";
	return {
		auto: normalizeTtsAutoMode(raw.auto) ?? (raw.enabled ? "always" : "off"),
		mode: raw.mode ?? "final",
		provider: normalizeConfiguredSpeechProviderId(raw.provider) ?? "",
		providerSource,
		persona: normalizeTtsPersonaId(raw.persona),
		personas: collectTtsPersonas(raw),
		summaryModel: normalizeOptionalString(raw.summaryModel),
		modelOverrides: resolveModelOverridePolicy(raw.modelOverrides),
		providerConfigs: collectDirectProviderConfigEntries(raw),
		prefsPath: raw.prefsPath,
		maxTextLength: raw.maxTextLength ?? DEFAULT_MAX_TEXT_LENGTH,
		timeoutMs,
		timeoutMsSource,
		rawConfig: raw,
		sourceConfig: cfg
	};
}
function resolveTtsPrefsPath(config) {
	return resolveTtsPrefsPathValue(config.prefsPath, machinePrefsPathResolver);
}
function resolveTtsAutoMode(params) {
	const sessionAuto = normalizeTtsAutoMode(params.sessionAuto);
	if (sessionAuto) return sessionAuto;
	return resolveTtsAutoModeFromPrefs(readTtsPrefs(params.prefsPath)) ?? params.config.auto;
}
function resolveTtsPersonaIdFromPrefs(config, prefs) {
	if (prefs.tts && Object.hasOwn(prefs.tts, "persona")) return normalizeTtsPersonaId(prefs.tts.persona);
	return normalizeTtsPersonaId(config.persona);
}
function resolveTtsPersonaFromPrefs(config, prefs) {
	const personaId = resolveTtsPersonaIdFromPrefs(config, prefs);
	return personaId ? config.personas[personaId] : void 0;
}
function resolveTtsSettingsSnapshot(params) {
	const config = resolveTtsConfig(params.cfg, {
		agentId: params.agentId,
		channelId: params.channelId,
		accountId: params.accountId
	});
	const prefsPath = resolveTtsPrefsPath(config);
	const prefs = readTtsPrefs(prefsPath);
	const personaId = resolveTtsPersonaIdFromPrefs(config, prefs);
	const persona = personaId ? config.personas[personaId] : void 0;
	const prefsProvider = normalizeConfiguredSpeechProviderId(prefs.tts?.provider);
	const personaProvider = normalizeConfiguredSpeechProviderId(persona?.provider);
	const configuredProvider = config.providerSource === "config" ? normalizeConfiguredSpeechProviderId(config.provider) ?? config.provider : void 0;
	const providerPreference = prefsProvider ? {
		provider: prefsProvider,
		source: "prefs"
	} : personaProvider ? {
		provider: personaProvider,
		source: "persona"
	} : configuredProvider ? {
		provider: configuredProvider,
		source: "config"
	} : void 0;
	return {
		autoMode: normalizeTtsAutoMode(params.sessionAuto) ?? resolveTtsAutoModeFromPrefs(prefs) ?? config.auto,
		config,
		maxLength: prefs.tts?.maxLength ?? DEFAULT_TTS_MAX_LENGTH,
		...persona ? { persona } : {},
		...personaId ? { personaId } : {},
		...providerPreference ? {
			preferredProvider: providerPreference.provider,
			providerPreference
		} : {},
		prefsPath,
		summarize: prefs.tts?.summarize ?? DEFAULT_TTS_SUMMARIZE
	};
}
function buildTtsSystemPromptHint(cfg, agentId, options) {
	const settings = resolveTtsSettingsSnapshot({
		cfg,
		agentId
	});
	if (settings.autoMode === "off") return;
	const structured = options?.messageToolOnly === true;
	return [
		"Voice (TTS) is enabled.",
		settings.autoMode === "inbound" ? "Only use TTS when the user's last message includes audio/voice." : settings.autoMode === "tagged" ? structured ? "Use TTS only through message(action=send) speech fields." : "Only use TTS when you include [[tts:key=value]] directives or a [[tts:text]]...[[/tts:text]] block." : void 0,
		settings.persona ? `Active TTS persona: ${settings.persona.label ?? settings.persona.id}${settings.persona.description ? ` - ${settings.persona.description}` : ""}.` : void 0,
		`Keep spoken text ≤${settings.maxLength} chars to avoid auto-summary (summary ${settings.summarize ? "on" : "off"}).`,
		structured ? "If workspace context (especially MEMORY.md) tells you not to use TTS or to use a local voice workflow, follow that workspace instruction instead." : "If workspace context (especially MEMORY.md) tells you not to use [[tts:...]] or to use a local/non-tagged voice workflow, follow that workspace instruction instead.",
		structured ? "Use message(action=send) with voiceText and optional voiceProvider/voiceId." : "Use [[tts:...]] and optional [[tts:text]]...[[/tts:text]] to control voice/expressiveness."
	].filter(Boolean).join("\n");
}
function isTtsEnabled(config, prefsPath, sessionAuto) {
	return resolveTtsAutoMode({
		config,
		prefsPath,
		sessionAuto
	}) !== "off";
}
function getTtsPersona(config, prefsPath) {
	return resolveTtsPersonaFromPrefs(config, readTtsPrefs(prefsPath));
}
function listTtsPersonas(config) {
	return Object.values(config.personas).toSorted((left, right) => left.id.localeCompare(right.id));
}
function resolveTtsPersonaList(cfg) {
	const config = resolveTtsConfig(cfg);
	return {
		active: getTtsPersona(config, resolveTtsPrefsPath(config))?.id ?? null,
		personas: listTtsPersonas(config).map((persona) => ({
			id: persona.id,
			label: persona.label,
			description: persona.description,
			provider: persona.provider,
			fallbackPolicy: persona.fallbackPolicy,
			providers: Object.keys(persona.providers ?? {})
		}))
	};
}
function getTtsMaxLength(prefsPath) {
	return readTtsPrefs(prefsPath).tts?.maxLength ?? DEFAULT_TTS_MAX_LENGTH;
}
function isSummarizationEnabled(prefsPath) {
	return readTtsPrefs(prefsPath).tts?.summarize ?? DEFAULT_TTS_SUMMARIZE;
}
//#endregion
export { withSpeakerSelectionFallbackCompat as S, resolveTtsPrefsPath as _, getTtsPersona as a, setTtsMachinePrefsPathResolver as b, isTtsEnabled as c, normalizeTtsPersonaId as d, resolveModelOverridePolicy as f, resolveTtsPersonaList as g, resolveTtsPersonaFromPrefs as h, getTtsMaxLength as i, listTtsPersonas as l, resolveTtsConfig as m, asProviderConfig as n, isSummarizationEnabled as o, resolveTtsAutoMode as p, buildTtsSystemPromptHint as r, isTtsConfigReservedKey as s, DEFAULT_TTS_TIMEOUT_MS as t, normalizeConfiguredSpeechProviderId as u, resolveTtsRuntimeConfig as v, withSpeakerSelectionCompat as x, resolveTtsSettingsSnapshot as y };
