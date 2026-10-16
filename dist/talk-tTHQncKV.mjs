import { a as normalizeFastMode, l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { c as asFiniteNumberInRange } from "./number-coercion-CuVhdCBs.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { t as isBlockedObjectKey } from "./prototype-keys-CuYw53fZ.mjs";
import { h as parseSecretRef } from "./types.secrets-DsPRn9Dz.mjs";
import { t as findNormalizedProviderKey } from "./provider-id-D1VImdKk.mjs";
import { c as normalizeThinkLevel } from "./thinking.shared-Jy32Vp-O.mjs";
//#region src/config/talk.ts
function normalizeInteger(value, min) {
	return typeof value === "number" && Number.isInteger(value) && value >= min ? value : void 0;
}
function normalizeTalkProviderConfig(value) {
	if (!isRecord(value)) return;
	const provider = {};
	for (const [key, raw] of Object.entries(value)) {
		const normalized = key === "apiKey" ? normalizeOptionalString(raw) ?? parseSecretRef(raw) ?? void 0 : raw;
		if (normalized !== void 0) provider[key] = normalized;
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
	for (const key of [
		"model",
		"speakerVoice",
		"speakerVoiceId",
		"instructions"
	]) {
		const text = normalizeOptionalString(source[key]);
		if (text) normalized[key] = text;
	}
	if (source.mode === "realtime" || source.mode === "stt-tts" || source.mode === "transcription") normalized.mode = source.mode;
	if (source.transport === "webrtc" || source.transport === "provider-websocket" || source.transport === "gateway-relay" || source.transport === "managed-room") normalized.transport = source.transport;
	const vadThreshold = asFiniteNumberInRange(source.vadThreshold, {
		min: 0,
		max: 1
	});
	if (vadThreshold !== void 0) normalized.vadThreshold = vadThreshold;
	const silenceDurationMs = normalizeInteger(source.silenceDurationMs, 1);
	if (silenceDurationMs !== void 0) normalized.silenceDurationMs = silenceDurationMs;
	const prefixPaddingMs = normalizeInteger(source.prefixPaddingMs, 0);
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
	for (const key of ["agentId", "speechLocale"]) {
		const text = normalizeOptionalString(source[key]);
		if (text) normalized[key] = text;
	}
	if (typeof source.interruptOnSpeech === "boolean") normalized.interruptOnSpeech = source.interruptOnSpeech;
	const consultThinkingLevel = normalizeThinkLevel(normalizeOptionalString(source.consultThinkingLevel));
	if (consultThinkingLevel) normalized.consultThinkingLevel = consultThinkingLevel;
	const consultFastMode = normalizeFastMode(source.consultFastMode);
	if (typeof consultFastMode === "boolean") normalized.consultFastMode = consultFastMode;
	const silenceTimeoutMs = normalizeInteger(source.silenceTimeoutMs, 1);
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
export { resolveActiveTalkProviderConfig as a, normalizeTalkSection as i, normalizeTalkConfig as n, resolveConfiguredTalkRealtimeProviderId as o, normalizeTalkRealtimeConfig as r, resolveConfiguredTalkSpeechProviderId as s, buildTalkConfigResponse as t };
