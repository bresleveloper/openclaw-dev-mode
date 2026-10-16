import { p as normalizeTrimmedStringList } from "./string-normalization-CECOqf64.mjs";
//#region src/shared/device-auth.ts
/** Normalize a device-auth role id without changing its case or namespace. */
function normalizeDeviceAuthRole(role) {
	return role.trim();
}
/** Normalize device-auth scopes, dedupe/sort them, and include implied operator scopes. */
function normalizeDeviceAuthScopes(scopes) {
	const out = new Set(normalizeTrimmedStringList(scopes));
	if (out.has("operator.admin")) {
		out.add("operator.read");
		out.add("operator.write");
	} else if (out.has("operator.write")) out.add("operator.read");
	return [...out].toSorted();
}
//#endregion
export { normalizeDeviceAuthScopes as n, normalizeDeviceAuthRole as t };
