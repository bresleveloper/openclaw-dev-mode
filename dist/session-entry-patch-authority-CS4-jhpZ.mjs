//#region src/config/sessions/session-entry-patch-authority.ts
function assertSessionEntryPatchAuthority(authority) {
	if (authority?.kind === "source" && typeof authority.source.prepareSessionSource !== "function") throw new Error("Session entry source authority requires a prepared source capability; use kind: host for SQLite-free checks or the deprecated patchSessionEntry API for legacy callbacks");
}
//#endregion
export { assertSessionEntryPatchAuthority as t };
