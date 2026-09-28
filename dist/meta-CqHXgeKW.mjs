import { f as asSafeIntegerInRange, s as asFiniteNumber } from "./number-coercion-CLj0HTDM.mjs";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
//#region packages/acp-core/src/meta.ts
function readMetaValue(meta, keys, normalize) {
	if (!meta) return;
	for (const key of keys) {
		const normalized = normalize(meta[key]);
		if (normalized !== void 0) return normalized;
	}
}
/** Reads the first present string metadata value from a current-to-legacy key list. */
function readMetadataString(meta, keys) {
	return readMetaValue(meta, keys, normalizeOptionalString);
}
/** Reads the first boolean metadata value without dropping false. */
function readBool(meta, keys) {
	return readMetaValue(meta, keys, (value) => typeof value === "boolean" ? value : void 0);
}
/** Reads the first finite numeric metadata value from a current-to-legacy key list. */
function readMetadataNumber(meta, keys) {
	return readMetaValue(meta, keys, asFiniteNumber);
}
/** Reads the first safe non-negative integer metadata value, preserving zero. */
function readNonNegativeInteger(meta, keys) {
	return readMetaValue(meta, keys, (value) => asSafeIntegerInRange(value, { min: 0 }));
}
//#endregion
export { readNonNegativeInteger as i, readMetadataNumber as n, readMetadataString as r, readBool as t };
