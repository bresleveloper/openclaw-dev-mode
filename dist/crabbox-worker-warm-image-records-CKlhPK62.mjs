import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import "./string-coerce-runtime-C_MKhRVt.mjs";
import { createHash } from "node:crypto";
//#region extensions/crabbox/src/crabbox-worker-warm-image-records.ts
function crabboxLegacyWarmImageCaptureSelector(key, record) {
	return `legacy-${createHash("sha256").update(JSON.stringify({
		key,
		record
	})).digest("hex")}`;
}
const legacyLeaseSelector = (key, value) => `legacy-lease-${createHash("sha256").update(JSON.stringify({
	key,
	value
})).digest("hex")}`;
function projectCrabboxLegacyWarmLeases(entries) {
	return entries.map(({ key, value }) => ({
		leaseId: key,
		machineClass: isRecord(value) && typeof value.machineClass === "string" ? value.machineClass : void 0,
		selector: legacyLeaseSelector(key, value)
	}));
}
//#endregion
export { legacyLeaseSelector as n, projectCrabboxLegacyWarmLeases as r, crabboxLegacyWarmImageCaptureSelector as t };
