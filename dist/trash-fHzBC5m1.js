import { l as movePathToTrash$1 } from "./fs-safe-RNq3oO57.js";
import { n as resolvePreferredOpenClawTmpDir } from "./tmp-openclaw-dir-uPgNO8da.js";
import "./temp-path-bur_3WeJ.js";
import "./browser-config-DCrASvM0.js";
import os from "node:os";
//#region extensions/browser/src/browser/trash.ts
/**
* Trash helpers for Browser-owned files constrained to user and OpenClaw temp
* roots.
*/
/** Moves a path to trash only when it lives under allowed Browser roots. */
async function movePathToTrash(targetPath) {
	return await movePathToTrash$1(targetPath, { allowedRoots: [os.homedir(), resolvePreferredOpenClawTmpDir()] });
}
//#endregion
export { movePathToTrash as t };
