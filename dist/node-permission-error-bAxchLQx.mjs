import { i as asOptionalObjectRecord } from "./record-coerce-TIsquoVR.mjs";
import { r as readNodePermissionRequest } from "./node-permissions-CxFiecbN.mjs";
//#region src/agents/node-permission-error.ts
/** Tool wrappers add context with Error.cause; retain the typed native refusal. */
function readNodePermissionError(error) {
	const seen = /* @__PURE__ */ new Set();
	for (let candidate = error; candidate && !seen.has(candidate);) {
		seen.add(candidate);
		const record = asOptionalObjectRecord(candidate);
		const details = asOptionalObjectRecord(record?.details);
		const permission = readNodePermissionRequest(details?.permissionMissing);
		if (permission) return permission;
		candidate = record?.cause;
	}
}
//#endregion
export { readNodePermissionError as t };
