import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
//#region packages/acp-core/src/session-interaction-mode.ts
/** Returns true for ACP sessions delegated from a parent session instead of user-facing chat. */
function isParentOwnedBackgroundAcpSession(entry) {
	return Boolean(entry?.acp && (normalizeOptionalString(entry.spawnedBy) || normalizeOptionalString(entry.parentSessionKey)));
}
/**
* Only the owning parent skips the A2A flow; unrelated sessions with broad
* visibility still use the normal path when sending to the same target.
*/
function isRequesterParentOfBackgroundAcpSession(entry, requesterSessionKey) {
	if (!isParentOwnedBackgroundAcpSession(entry)) return false;
	const requester = normalizeOptionalString(requesterSessionKey);
	if (!requester) return false;
	const spawnedBy = normalizeOptionalString(entry?.spawnedBy);
	const parentSessionKey = normalizeOptionalString(entry?.parentSessionKey);
	return requester === spawnedBy || requester === parentSessionKey;
}
//#endregion
export { isRequesterParentOfBackgroundAcpSession as n, isParentOwnedBackgroundAcpSession as t };
