import { normalizeLowercaseStringOrEmpty, normalizeStringEntries } from "openclaw/plugin-sdk/string-coerce-runtime";
//#region extensions/signal/src/normalize.ts
function normalizeSignalReactionRecipient(raw) {
	const withoutSignal = raw.trim().replace(/^signal:/i, "").trim();
	return /^uuid:/i.test(withoutSignal) ? withoutSignal.slice(5).trim() : withoutSignal;
}
function normalizeSignalMessagingTarget(raw) {
	const trimmed = raw.trim();
	if (!trimmed) return;
	let normalized = trimmed;
	if (normalizeLowercaseStringOrEmpty(normalized).startsWith("signal:")) normalized = normalized.slice(7).trim();
	if (!normalized) return;
	const lower = normalizeLowercaseStringOrEmpty(normalized);
	if (lower.startsWith("group:")) {
		const id = normalized.slice(6).trim();
		return id ? `group:${id}` : void 0;
	}
	if (lower.startsWith("username:")) {
		const id = normalized.slice(9).trim();
		return id ? normalizeLowercaseStringOrEmpty(`username:${id}`) : void 0;
	}
	if (lower.startsWith("u:")) {
		const id = normalized.slice(2).trim();
		return id ? normalizeLowercaseStringOrEmpty(`username:${id}`) : void 0;
	}
	if (lower.startsWith("uuid:")) {
		const id = normalized.slice(5).trim();
		return id ? normalizeLowercaseStringOrEmpty(id) : void 0;
	}
	return normalizeLowercaseStringOrEmpty(normalized);
}
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const UUID_COMPACT_PATTERN = /^[0-9a-f]{32}$/i;
function looksLikeSignalTargetId(raw, normalized) {
	const candidates = normalizeStringEntries([raw, normalized ?? ""]);
	for (const candidate of candidates) {
		if (/^(signal:)?(group:|username:|u:)/i.test(candidate)) return true;
		if (/^(signal:)?uuid:/i.test(candidate)) {
			const stripped = candidate.replace(/^signal:/i, "").replace(/^uuid:/i, "").trim();
			if (!stripped) continue;
			if (UUID_PATTERN.test(stripped) || UUID_COMPACT_PATTERN.test(stripped)) return true;
			continue;
		}
		const withoutSignalPrefix = candidate.replace(/^signal:/i, "").trim();
		if (UUID_PATTERN.test(withoutSignalPrefix) || UUID_COMPACT_PATTERN.test(withoutSignalPrefix)) return true;
		if (/^\+?\d{3,}$/.test(withoutSignalPrefix)) return true;
	}
	return false;
}
//#endregion
export { normalizeSignalMessagingTarget as n, normalizeSignalReactionRecipient as r, looksLikeSignalTargetId as t };
