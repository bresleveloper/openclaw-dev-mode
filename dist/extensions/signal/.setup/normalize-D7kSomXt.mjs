import { normalizeLowercaseStringOrEmpty, normalizeStringEntries } from "openclaw/plugin-sdk/string-coerce-runtime";
//#region extensions/signal/src/normalize.ts
function normalizeSignalReactionRecipient(raw) {
	const withoutSignal = raw.trim().replace(/^signal:/i, "").trim();
	return /^uuid:/i.test(withoutSignal) ? withoutSignal.slice(5).trim() : withoutSignal;
}
function normalizeSignalMessagingTarget(raw) {
	const normalized = raw.trim().replace(/^signal:/i, "").trim();
	const prefix = /^(group|username|u|uuid):/i.exec(normalized)?.[0];
	if (!prefix) return normalizeLowercaseStringOrEmpty(normalized) || void 0;
	const id = normalized.slice(prefix.length).trim();
	if (!id) return;
	switch (prefix.toLowerCase()) {
		case "group:": return `group:${id}`;
		case "username:":
		case "u:": return normalizeLowercaseStringOrEmpty(`username:${id}`);
		default: return normalizeLowercaseStringOrEmpty(id);
	}
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
