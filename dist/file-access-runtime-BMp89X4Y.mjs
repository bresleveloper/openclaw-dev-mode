import { D as statRegularFileSync } from "./fs-safe-BUXBSN-4.mjs";
import "./boundary-file-read-CCth2Hwg.mjs";
import "./path-guards-CH7noY0Z.mjs";
import "./directory-durability-CqSvP1tc.mjs";
import "./file-descriptor-B4yBUiAP.mjs";
import { r as removePathWithinRoot$1 } from "./fs-safe-remove-DuP7yp5L.mjs";
import "./fs-observation-snapshot-DTptcApl.mjs";
import "./file-range-jGKnMXJ2.mjs";
import "./staged-inputs-B7cE4lVT.mjs";
import "./remote-workspace-file-Bi0P0wVf.mjs";
import { assertNoSymlinkParents as assertNoSymlinkParents$1, assertNoSymlinkParentsSync as assertNoSymlinkParentsSync$1, basenameFromMediaSource as basenameFromMediaSource$1, readFileHandleBounded as readFileHandleBounded$1, readFileWindowFully as readFileWindowFully$1, resolvePathPrefixSync as resolvePathPrefixSync$1, safeFileURLToPath as safeFileURLToPath$1, tempFile as tempFile$1 } from "@openclaw/fs-safe/advanced";
import { inspectPathPermissions as inspectPathPermissions$1 } from "@openclaw/fs-safe/permissions";
import { watch as watch$1 } from "@openclaw/fs-safe/watch";
//#region src/infra/fs-watch-errors.ts
function getFileWatchCapacityCode(error) {
	if (typeof error !== "object" || error === null || !("syscall" in error) || error.syscall !== "watch" || !("code" in error)) return;
	const code = error.code;
	return code === "EMFILE" || code === "ENFILE" || code === "ENOSPC" ? code : void 0;
}
//#endregion
//#region src/plugin-sdk/file-access-runtime.ts
/** Return whether a path resolves to a regular file, treating filesystem errors as missing. */
function fileExists(filePath) {
	try {
		return !statRegularFileSync(filePath).missing;
	} catch {
		return false;
	}
}
const removePathWithinRoot = removePathWithinRoot$1;
//#endregion
export { inspectPathPermissions$1 as a, removePathWithinRoot as c, tempFile$1 as d, watch$1 as f, fileExists as i, resolvePathPrefixSync$1 as l, assertNoSymlinkParentsSync$1 as n, readFileHandleBounded$1 as o, getFileWatchCapacityCode as p, basenameFromMediaSource$1 as r, readFileWindowFully$1 as s, assertNoSymlinkParents$1 as t, safeFileURLToPath$1 as u };
