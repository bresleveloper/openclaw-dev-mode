import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { y as resolveTtsSettingsSnapshot } from "./tts-settings-CuXW4C4p.mjs";
//#region src/tts/status-config.ts
const DEFAULT_OPENAI_TTS_BASE_URL = "https://api.openai.com/v1";
const MAX_STATUS_DETAIL_LENGTH = 96;
function normalizeStatusDetail(value, maxLength = MAX_STATUS_DETAIL_LENGTH) {
	if (typeof value !== "string") return;
	const normalized = value.trim().replace(/\s+/g, " ");
	if (!normalized) return;
	return normalized.length > maxLength ? `${truncateUtf16Safe(normalized, maxLength - 3)}...` : normalized;
}
function sanitizeBaseUrlForStatus(value) {
	const raw = normalizeStatusDetail(value, 180);
	if (!raw) return;
	try {
		const parsed = new URL(raw);
		parsed.username = "";
		parsed.password = "";
		parsed.search = "";
		parsed.hash = "";
		return normalizeStatusDetail(parsed.toString().replace(/\/+$/, ""), 120);
	} catch {
		return "[invalid-url]";
	}
}
function isCustomOpenAiTtsBaseUrl(baseUrl) {
	return baseUrl ? baseUrl.replace(/\/+$/, "") !== DEFAULT_OPENAI_TTS_BASE_URL : false;
}
function firstStatusDetail(record, keys) {
	if (!record) return;
	for (const key of keys) {
		const value = normalizeStatusDetail(record[key]);
		if (value) return value;
	}
}
function resolveProviderConfigRecord(raw, provider) {
	const rawRecord = isRecord(raw) ? raw : {};
	const providers = isRecord(raw.providers) ? raw.providers : {};
	if (provider === "microsoft") return {
		...isRecord(rawRecord.edge) ? rawRecord.edge : {},
		...isRecord(rawRecord.microsoft) ? rawRecord.microsoft : {},
		...isRecord(providers.edge) ? providers.edge : {},
		...isRecord(providers.microsoft) ? providers.microsoft : {}
	};
	const direct = rawRecord[provider];
	const providerScoped = providers[provider];
	if (isRecord(providerScoped)) return providerScoped;
	if (isRecord(direct)) return direct;
	return rawRecord;
}
function resolveStatusProviderDetails(raw, provider) {
	if (provider === "auto") return {};
	const record = resolveProviderConfigRecord(raw, provider);
	const sanitizedBaseUrl = sanitizeBaseUrlForStatus(record?.baseUrl);
	const customBaseUrl = provider === "openai" && isCustomOpenAiTtsBaseUrl(sanitizedBaseUrl);
	const details = {};
	const displayName = firstStatusDetail(record, ["displayName"]);
	if (displayName) details.displayName = displayName;
	const model = firstStatusDetail(record, ["model", "modelId"]);
	if (model) details.model = model;
	const voice = firstStatusDetail(record, [
		"speakerVoice",
		"speakerVoiceId",
		"voice",
		"voiceId",
		"voiceName"
	]);
	if (voice) details.voice = voice;
	if (sanitizedBaseUrl && (provider !== "openai" || customBaseUrl)) {
		details.baseUrl = sanitizedBaseUrl;
		details.customBaseUrl = customBaseUrl;
	}
	return details;
}
function resolveStatusTtsSnapshot(params) {
	const settings = resolveTtsSettingsSnapshot(params);
	if (settings.autoMode === "off") return null;
	const provider = settings.preferredProvider ?? "auto";
	return {
		autoMode: settings.autoMode,
		provider,
		...resolveStatusProviderDetails(settings.config.rawConfig ?? {}, provider),
		...settings.personaId ? { persona: settings.personaId } : {},
		maxLength: settings.maxLength,
		summarize: settings.summarize
	};
}
//#endregion
export { resolveStatusTtsSnapshot as t };
