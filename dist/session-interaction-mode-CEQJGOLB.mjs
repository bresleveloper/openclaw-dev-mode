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
	if (!entry?.acp) return false;
	const requester = normalizeOptionalString(requesterSessionKey);
	if (!requester) return false;
	return requester === normalizeOptionalString(entry.spawnedBy) || requester === normalizeOptionalString(entry.parentSessionKey);
}
//#endregion
export { isRequesterParentOfBackgroundAcpSession as n, isParentOwnedBackgroundAcpSession as t };
