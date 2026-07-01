import { l as movePathToTrash$1 } from "./fs-safe-aqmM_n6V.js";
import { n as resolvePreferredOpenClawTmpDir } from "./tmp-openclaw-dir-DOKojISm.js";
import "./temp-path-BbDdjtr4.js";
import "./browser-config-BPzc9xWq.js";
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
