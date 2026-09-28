import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { rmSync } from "node:fs";
//#region src/tts/tts-provider-helpers.ts
const TEMP_FILE_CLEANUP_DELAY_MS = 3e5;
/** Resolve the first non-blank API key in provider-defined precedence order. */
function resolveSpeechProviderApiKey(...candidates) {
	for (const candidate of candidates) {
		const apiKey = normalizeOptionalString(candidate);
		if (apiKey) return apiKey;
	}
}
function requireInRange(value, min, max, label) {
	if (!Number.isFinite(value) || value < min || value > max) throw new Error(`${label} must be between ${min} and ${max}`);
}
function normalizeLanguageCode(code) {
	const normalized = normalizeOptionalLowercaseString(code);
	if (!normalized) return;
	if (!/^[a-z]{2}$/.test(normalized)) throw new Error("languageCode must be a 2-letter ISO 639-1 code (e.g. en, de, fr)");
	return normalized;
}
function normalizeApplyTextNormalization(mode) {
	const normalized = normalizeOptionalLowercaseString(mode);
	if (!normalized) return;
	if (normalized === "auto" || normalized === "on" || normalized === "off") return normalized;
	throw new Error("applyTextNormalization must be one of: auto, on, off");
}
function normalizeSeed(seed) {
	if (seed == null) return;
	const next = Math.floor(seed);
	if (!Number.isFinite(next) || next < 0 || next > 4294967295) throw new Error("seed must be between 0 and 4294967295");
	return next;
}
function scheduleCleanup(tempDir, delayMs = TEMP_FILE_CLEANUP_DELAY_MS) {
	setTimeout(() => {
		try {
			rmSync(tempDir, {
				recursive: true,
				force: true
			});
		} catch {}
	}, delayMs).unref();
}
//#endregion
export { resolveSpeechProviderApiKey as a, requireInRange as i, normalizeLanguageCode as n, scheduleCleanup as o, normalizeSeed as r, normalizeApplyTextNormalization as t };
