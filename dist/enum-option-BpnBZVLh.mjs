import { c as normalizeOptionalLowercaseString } from "./string-coerce-1VuiLaaR.mjs";
import { t as formatHumanList } from "./human-list-Do_69QrK.mjs";
//#region src/shared/enum-option.ts
function createEnumOptionParser(ErrorType = Error) {
	return (raw, allowed, label) => {
		const normalized = normalizeOptionalLowercaseString(raw);
		if (!normalized) return;
		const value = allowed.find((entry) => entry.toLowerCase() === normalized);
		if (value === void 0) throw new ErrorType(`${label} must be one of ${formatHumanList(allowed)}`);
		return value;
	};
}
//#endregion
export { createEnumOptionParser as t };
