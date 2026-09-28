import { t as CONFIG_DIR } from "./utils-aKqR_F_U.mjs";
import "./text-utility-runtime-D7I29NA0.mjs";
import path from "node:path";
//#region extensions/browser/src/browser/trash.ts
/**
* Trash helpers for data under the Browser-owned config subtree.
*/
/** Moves a path to trash only when it lives under allowed Browser roots. */
async function movePathToTrash(targetPath) {
	const { movePathToTrash: movePathToTrashWithAllowedRoots } = await import("./plugin-sdk/browser-config.js");
	return await movePathToTrashWithAllowedRoots(targetPath, { allowedRoots: [path.join(CONFIG_DIR, "browser")] });
}
//#endregion
export { movePathToTrash as t };
