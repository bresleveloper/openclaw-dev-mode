//#region packages/normalization-core/src/number-coercion.ts
/** Returns a number only when the input is already finite. */
function asFiniteNumber(value) {
	return Number.isFinite(value) ? value : void 0;
}
/** Returns a finite number only when it is zero or greater. */
function asNonNegativeFiniteNumber(value) {
	const number = asFiniteNumber(value);
	return number && number < 0 ? void 0 : number;
}
function normalizeNumericString(value) {
	const trimmed = value.trim();
	return trimmed ? trimmed : void 0;
}
/** Parses only safe integer numbers or base-10 integer strings. */
function parseStrictInteger(value) {
	if (typeof value === "number") return Number.isSafeInteger(value) ? value : void 0;
	if (typeof value !== "string") return;
	const normalized = normalizeNumericString(value);
	if (!normalized || !/^[+-]?\d+$/.test(normalized)) return;
	const parsed = Number(normalized);
	return Number.isSafeInteger(parsed) ? parsed : void 0;
}
/** Conservative upper bound for Node timer delays. */
const MAX_TIMER_TIMEOUT_MS = 2147e6;
/** Clamps finite millisecond values into the Node-safe timer range. */
function clampTimerTimeoutMs(valueMs, minMs = 1) {
	const value = asFiniteNumber(valueMs);
	if (value === void 0) return;
	return Math.min(Math.max(Math.floor(value), Math.max(1, Math.floor(minMs))), MAX_TIMER_TIMEOUT_MS);
}
/** Resolves arbitrary timeout input with fallback and minimum timer bounds. */
function resolveTimerTimeoutMs(valueMs, fallbackMs, minMs = 1) {
	const value = asFiniteNumber(valueMs) ?? asFiniteNumber(fallbackMs);
	const min = Math.max(0, Math.floor(minMs));
	if (value === void 0) return min;
	return Math.min(Math.max(Math.floor(value), min), MAX_TIMER_TIMEOUT_MS);
}
/** Parses strict positive integer values from numbers or strings. */
function parseStrictPositiveInteger(value) {
	const parsed = parseStrictInteger(value);
	return parsed !== void 0 && parsed > 0 ? parsed : void 0;
}
//#endregion
//#region packages/media-core/src/base64.ts
/** Estimates decoded bytes without allocating a cleaned copy of the base64 payload. */
function estimateBase64DecodedBytes(base64) {
	let effectiveLen = base64.length;
	const firstWhitespace = base64.search(/[\x00-\x20]/);
	if (firstWhitespace !== -1) {
		for (let i = firstWhitespace; i < base64.length; i += 1) if (base64.charCodeAt(i) <= 32) effectiveLen -= 1;
	}
	if (effectiveLen === 0) return 0;
	let padding = 0;
	let end = base64.length - 1;
	while (end >= 0 && base64.charCodeAt(end) <= 32) end -= 1;
	if (end >= 0 && base64[end] === "=") {
		padding = 1;
		end -= 1;
		while (end >= 0 && base64.charCodeAt(end) <= 32) end -= 1;
		if (end >= 0 && base64[end] === "=") padding = 2;
	}
	const estimated = Math.floor(effectiveLen * 3 / 4) - padding;
	return Math.max(0, estimated);
}
function base64DataValue(code) {
	if (code >= 65 && code <= 90) return code - 65;
	if (code >= 97 && code <= 122) return code - 97 + 26;
	if (code >= 48 && code <= 57) return code - 48 + 52;
	return code === 43 ? 62 : code === 47 ? 63 : -1;
}
/**
* Normalizes and validates a base64 string, returning canonical no-whitespace
* base64 only when the input has valid alphabet, padding, and length.
*/
function canonicalizeBase64(base64) {
	let out;
	let outLen = 0;
	let padding = 0;
	let sawPadding = false;
	let lastDataValue = 0;
	for (let i = 0; i < base64.length; i += 1) {
		const code = base64.charCodeAt(i);
		if (code <= 32) {
			if (out === void 0) {
				out = Buffer.allocUnsafe(base64.length - 1);
				for (let j = 0; j < i; j += 1) out[j] = base64.charCodeAt(j);
				outLen = i;
			}
			continue;
		}
		if (code === 61) {
			padding += 1;
			if (padding > 2) return;
			sawPadding = true;
		} else {
			const value = base64DataValue(code);
			if (sawPadding || value < 0) return;
			lastDataValue = value;
		}
		if (out !== void 0) {
			out[outLen] = code;
			outLen += 1;
		}
	}
	const cleanedLength = out === void 0 ? base64.length : outLen;
	if (cleanedLength === 0) return;
	const remainder = cleanedLength % 4;
	if (remainder !== 0 && (sawPadding || remainder === 1)) return;
	const effectivePadding = remainder === 0 ? padding : 4 - remainder;
	const padBitMask = effectivePadding === 2 ? 15 : effectivePadding === 1 ? 3 : 0;
	if (padBitMask !== 0 && (lastDataValue & padBitMask) !== 0) return;
	const cleaned = out === void 0 ? base64 : out.subarray(0, outLen).toString("latin1");
	return remainder === 0 ? cleaned : cleaned + "=".repeat(4 - remainder);
}
//#endregion
export { clampTimerTimeoutMs as a, asNonNegativeFiniteNumber as i, estimateBase64DecodedBytes as n, parseStrictPositiveInteger as o, asFiniteNumber as r, resolveTimerTimeoutMs as s, canonicalizeBase64 as t };
