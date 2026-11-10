import fs from "node:fs";
//#region src/config/sessions/legacy-store-source.ts
/** A retained file-backed session store needs the legacy startup inspector. */
function isExistingLegacySessionStore(storePath) {
	return !storePath.endsWith(".sqlite") && fs.existsSync(storePath);
}
//#endregion
export { isExistingLegacySessionStore as t };
