import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { t as formatHumanList } from "./human-list-Beo_KoiT.mjs";
//#region src/cli/enum-filter.ts
/** Parses an optional exact-match CLI enum before command-owned work begins. */
function parseCliEnumFilter(raw, flag, values) {
	const normalized = normalizeOptionalString(raw);
	if (normalized === void 0) return;
	const match = values.find((value) => value === normalized);
	if (!match) throw new Error(`${flag} must be ${formatHumanList(values)}.`);
	return match;
}
//#endregion
export { parseCliEnumFilter as t };
