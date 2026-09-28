import { r as normalizeArrayBackedTrimmedStringList } from "./string-normalization-_gRhJUDw.mjs";
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
	if (normalizedLeft.size !== normalizedRight.size) return false;
	for (const entry of normalizedLeft) if (!normalizedRight.has(entry)) return false;
	return true;
}
/** Compare node permission maps deterministically so key order cannot trigger repairs. */
function sameNodePermissionSurface(left, right) {
	const leftEntries = Object.entries(left ?? {}).toSorted(([leftKey], [rightKey]) => leftKey.localeCompare(rightKey));
	const rightEntries = Object.entries(right ?? {}).toSorted(([leftKey], [rightKey]) => leftKey.localeCompare(rightKey));
	if (leftEntries.length !== rightEntries.length) return false;
	return leftEntries.every(([key, value], index) => {
		const rightEntry = rightEntries[index];
		return rightEntry !== void 0 && rightEntry[0] === key && rightEntry[1] === value;
	});
}
//#endregion
export { sameNodePermissionSurface as i, normalizeNodeApprovalSurfaceList as n, sameNodeApprovalSurfaceSet as r, intersectNodePermissionSurface as t };
