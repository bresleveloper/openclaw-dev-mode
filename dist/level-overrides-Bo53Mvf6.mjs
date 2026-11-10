import { f as normalizeVerboseLevel, u as normalizeTraceLevel } from "./thinking.shared-Be8dhC75.mjs";
import "./thinking-BCNoGfZ5.mjs";
//#region src/sessions/level-overrides.ts
function parseLevelOverride(raw, normalize, error) {
	if (raw === null || raw === void 0) return {
		ok: true,
		value: raw
	};
	const normalized = typeof raw === "string" ? normalize(raw) : void 0;
	return normalized ? {
		ok: true,
		value: normalized
	} : {
		ok: false,
		error
	};
}
function parseVerboseOverride(raw) {
	return parseLevelOverride(raw, normalizeVerboseLevel, "invalid verboseLevel (use \"on\"|\"off\"|\"full\")");
}
function applyVerboseOverride(entry, level) {
	if (level === void 0) return;
	if (level === null) {
		delete entry.verboseLevel;
		return;
	}
	entry.verboseLevel = level;
}
function parseTraceOverride(raw) {
	return parseLevelOverride(raw, normalizeTraceLevel, "invalid traceLevel (use \"on\"|\"off\"|\"raw\")");
}
function applyTraceOverride(entry, level) {
	if (level === void 0) return;
	if (level === null) {
		delete entry.traceLevel;
		return;
	}
	entry.traceLevel = level;
}
//#endregion
export { parseVerboseOverride as i, applyVerboseOverride as n, parseTraceOverride as r, applyTraceOverride as t };
