import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { t as isBlockedObjectKey } from "./prototype-keys-CuYw53fZ.mjs";
//#region src/config/merge-missing.ts
/** Fill undefined fields in place; newly assigned values retain their source references. */
function mergeMissing(target, source) {
	for (const [key, value] of Object.entries(source)) {
		if (value === void 0 || isBlockedObjectKey(key)) continue;
		const existing = target[key];
		if (existing === void 0) {
			target[key] = value;
			continue;
		}
		if (isRecord(existing) && isRecord(value)) mergeMissing(existing, value);
	}
}
//#endregion
export { mergeMissing as t };
