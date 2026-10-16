import { r as normalizeArrayBackedTrimmedStringList } from "./string-normalization-CECOqf64.mjs";
//#region src/infra/node-pairing-surface.ts
function intersectNodePermissionSurface(params) {
	const entries = [];
	for (const [key, declaredValue] of Object.entries(params.declared ?? {})) {
		const approvedValue = params.approved?.[key];
		if (!declaredValue) entries.push([key, false]);
		else if (approvedValue !== void 0) entries.push([key, approvedValue]);
	}
	return entries.length > 0 ? Object.fromEntries(entries) : void 0;
}
/** Normalize capability/command lists for node approval-surface comparison. */
function normalizeNodeApprovalSurfaceList(value) {
	return normalizeArrayBackedTrimmedStringList(value) ?? [];
}
/** Compare capability/command surfaces as normalized sets, ignoring order and duplicates. */
function sameNodeApprovalSurfaceSet(left, right) {
	const normalizedLeft = new Set(normalizeNodeApprovalSurfaceList(left));
	const normalizedRight = new Set(normalizeNodeApprovalSurfaceList(right));
	return normalizedLeft.size === normalizedRight.size && [...normalizedLeft].every((entry) => normalizedRight.has(entry));
}
/** Compare node permission maps deterministically so key order cannot trigger repairs. */
function sameNodePermissionSurface(left, right) {
	const leftEntries = Object.entries(left ?? {});
	const rightPermissions = right ?? {};
	return leftEntries.length === Object.keys(rightPermissions).length && leftEntries.every(([key, value]) => Object.hasOwn(rightPermissions, key) && rightPermissions[key] === value);
}
//#endregion
export { sameNodePermissionSurface as i, normalizeNodeApprovalSurfaceList as n, sameNodeApprovalSurfaceSet as r, intersectNodePermissionSurface as t };
