import { c as asFiniteNumberInRange } from "./number-coercion-CLj0HTDM.mjs";
import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { a as normalizeFastMode, l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { t as isBlockedObjectKey } from "./prototype-keys-CuYw53fZ.mjs";
import { t as findNormalizedProviderKey } from "./provider-id-DCtsDflE.mjs";
import { a as coerceSecretRef } from "./types.secrets-B5xWSzLp.mjs";
import { s as normalizeThinkLevel } from "./thinking.shared-BKzBCWpI.mjs";
//#region src/config/talk.ts
function normalizeTalkSecretInput(value) {
	if (typeof value === "string") {
		const trimmed = value.trim();
		return trimmed.length > 0 ? trimmed : void 0;
	}
	return coerceSecretRef(value) ?? void 0;
}
function normalizePositiveInteger(value) {
	if (typeof value !== "number" || !Number.isInteger(value) || value <= 0) return;
	return value;
}
function normalizeNonNegativeInteger(value) {
	if (typeof value !== "number" || !Number.isInteger(value) || value < 0) return;
	return value;
}
function normalizeTalkProviderConfig(value) {
	if (!isRecord(value)) return;
	const provider = {};
	for (const [key, raw] of Object.entries(value)) {
		if (raw === void 0) continue;
		if (key === "apiKey") {
			const normalized = normalizeTalkSecretInput(raw);
			if (normalized !== void 0) provider.apiKey = normalized;
			continue;
		}
		provider[key] = raw;
	}
	return provider;
}
function normalizeTalkProviders(value) {
	if (!isRecord(value)) return;
	const providers = {};
	for (const [rawProviderId, providerConfig] of Object.entries(value)) {
		const providerId = normalizeOptionalString(rawProviderId);
		if (!providerId) continue;
		const normalizedProvider = normalizeTalkProviderConfig(providerConfig);
		if (!normalizedProvider) continue;
		providers[providerId] = {
			...providers[providerId],
			...normalizedProvider
		};
	}
	return Object.keys(providers).length > 0 ? providers : void 0;
}
function normalizeTalkRealtimeConfig(value) {
	if (!isRecord(value)) return;
	const source = value;
	const normalized = {};
	const provider = normalizeOptionalString(source.provider);
	if (provider) normalized.provider = provider;
	const providers = normalizeTalkProviders(source.providers);
	if (providers) normalized.providers = providers;
	const model = normalizeOptionalString(source.model);
	if (model) normalized.model = model;
	const speakerVoice = normalizeOptionalString(source.speakerVoice);
	const speakerVoiceId = normalizeOptionalString(source.speakerVoiceId);
	if (speakerVoice) normalized.speakerVoice = speakerVoice;
	if (speakerVoiceId) normalized.speakerVoiceId = speakerVoiceId;
	const instructions = normalizeOptionalString(source.instructions);
	if (instructions) normalized.instructions = instructions;
	if (source.mode === "realtime" || source.mode === "stt-tts" || source.mode === "transcription") normalized.mode = source.mode;
	if (source.transport === "webrtc" || source.transport === "provider-websocket" || source.transport === "gateway-relay" || source.transport === "managed-room") normalized.transport = source.transport;
	const vadThreshold = asFiniteNumberInRange(source.vadThreshold, {
		min: 0,
		max: 1
	});
	if (vadThreshold !== void 0) normalized.vadThreshold = vadThreshold;
	const silenceDurationMs = normalizePositiveInteger(source.silenceDurationMs);
	if (silenceDurationMs !== void 0) normalized.silenceDurationMs = silenceDurationMs;
	const prefixPaddingMs = normalizeNonNegativeInteger(source.prefixPaddingMs);
	if (prefixPaddingMs !== void 0) normalized.prefixPaddingMs = prefixPaddingMs;
	const reasoningEffort = normalizeOptionalString(source.reasoningEffort);
	if (reasoningEffort) normalized.reasoningEffort = reasoningEffort;
	if (source.brain === "agent-consult" || source.brain === "direct-tools" || source.brain === "none") normalized.brain = source.brain;
	if (source.consultRouting === "provider-direct" || source.consultRouting === "force-agent-consult") normalized.consultRouting = source.consultRouting;
	return Object.keys(normalized).length > 0 ? normalized : void 0;
}
function activeProviderFromTalk(talk) {
	const providerIds = Object.keys(talk.providers ?? {});
	const provider = normalizeOptionalString(talk.provider ?? (providerIds.length === 1 ? providerIds[0] : void 0));
	if (!provider || isBlockedObjectKey(provider.toLowerCase())) return;
	return talk.providers ? findNormalizedProviderKey(talk.providers, provider) : provider;
}
/** Resolve the explicitly selected or sole authored Talk speech provider. */
function resolveConfiguredTalkSpeechProviderId(config) {
	return config.talk ? activeProviderFromTalk(config.talk) : void 0;
}
/** Resolve the explicitly selected or sole authored Talk realtime provider. */
function resolveConfiguredTalkRealtimeProviderId(config) {
	return config.talk?.realtime ? activeProviderFromTalk(config.talk.realtime) : void 0;
}
/**
* Normalize persisted Talk config into the canonical provider/providers shape.
* Legacy flat provider fields are ignored here so core config stays provider-agnostic.
*/
function normalizeTalkSection(value) {
	if (!isRecord(value)) return;
	const source = value;
	const normalized = {};
	const agentId = normalizeOptionalString(source.agentId);
	if (agentId) normalized.agentId = agentId;
	const speechLocale = normalizeOptionalString(source.speechLocale);
	if (speechLocale) normalized.speechLocale = speechLocale;
	if (typeof source.interruptOnSpeech === "boolean") normalized.interruptOnSpeech = source.interruptOnSpeech;
	const consultThinkingLevel = normalizeThinkLevel(normalizeOptionalString(source.consultThinkingLevel));
	if (consultThinkingLevel) normalized.consultThinkingLevel = consultThinkingLevel;
	const rawConsultFastMode = source.consultFastMode;
	const consultFastMode = typeof rawConsultFastMode === "boolean" || typeof rawConsultFastMode === "string" ? normalizeFastMode(rawConsultFastMode) : void 0;
	if (typeof consultFastMode === "boolean") normalized.consultFastMode = consultFastMode;
	const silenceTimeoutMs = normalizePositiveInteger(source.silenceTimeoutMs);
	if (silenceTimeoutMs !== void 0) normalized.silenceTimeoutMs = silenceTimeoutMs;
	const providers = normalizeTalkProviders(source.providers);
	const realtime = normalizeTalkRealtimeConfig(source.realtime);
	const provider = normalizeOptionalString(source.provider);
	if (providers) normalized.providers = providers;
	if (realtime) normalized.realtime = realtime;
	if (provider) normalized.provider = provider;
	return Object.keys(normalized).length > 0 ? normalized : void 0;
}
/** Return a config copy with `talk` normalized when a valid Talk section is present. */
function normalizeTalkConfig(config) {
	if (!config.talk) return config;
	const normalizedTalk = normalizeTalkSection(config.talk);
	if (!normalizedTalk) return config;
	return {
		...config,
		talk: normalizedTalk
	};
}
/**
* Resolve the single active Talk speech provider and its provider-owned config.
* Ambiguous multi-provider config stays unresolved until `talk.provider` names one.
*/
function resolveActiveTalkProviderConfig(talk) {
	const selectedProvider = resolveConfiguredTalkSpeechProviderId({ talk });
	if (!selectedProvider || !talk) return;
	const normalizedTalk = normalizeTalkSection(talk);
	const provider = findNormalizedProviderKey(normalizedTalk?.providers, selectedProvider) ?? selectedProvider;
	return {
		provider,
		config: normalizedTalk?.providers?.[provider] ?? {}
	};
}
/**
* Build the gateway `talk.config` payload from canonical Talk config.
* The response includes canonical provider data plus the resolved provider when selection is unambiguous.
*/
function buildTalkConfigResponse(normalized) {
	if (!normalized) return;
	const payload = {};
	if (typeof normalized?.agentId === "string") payload.agentId = normalized.agentId;
	if (typeof normalized?.interruptOnSpeech === "boolean") payload.interruptOnSpeech = normalized.interruptOnSpeech;
	if (typeof normalized?.silenceTimeoutMs === "number") payload.silenceTimeoutMs = normalized.silenceTimeoutMs;
	if (typeof normalized?.consultThinkingLevel === "string") payload.consultThinkingLevel = normalized.consultThinkingLevel;
	if (typeof normalized?.consultFastMode === "boolean") payload.consultFastMode = normalized.consultFastMode;
	if (typeof normalized?.speechLocale === "string") payload.speechLocale = normalized.speechLocale;
	if (normalized?.providers && Object.keys(normalized.providers).length > 0) payload.providers = normalized.providers;
	if (normalized?.realtime && Object.keys(normalized.realtime).length > 0) payload.realtime = normalized.realtime;
	const resolved = resolveActiveTalkProviderConfig(normalized);
	const activeProvider = resolved?.provider;
	if (activeProvider) payload.provider = activeProvider;
	if (resolved) payload.resolved = resolved;
	return Object.keys(payload).length > 0 ? payload : void 0;
}
//#endregion
export { resolveConfiguredTalkRealtimeProviderId as a, resolveActiveTalkProviderConfig as i, normalizeTalkConfig as n, resolveConfiguredTalkSpeechProviderId as o, normalizeTalkSection as r, buildTalkConfigResponse as t };
