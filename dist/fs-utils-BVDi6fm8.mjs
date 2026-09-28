import { assertNoSymlinkParents, readRegularFile, statRegularFile } from "@openclaw/fs-safe/advanced";
import { root as root$1 } from "@openclaw/fs-safe/root";
import { isPathInside, isPathInsideWithRealpath } from "@openclaw/fs-safe/path";
import { walkDirectory as walkDirectory$1 } from "@openclaw/fs-safe/walk";
//#region packages/memory-host-sdk/src/host/fs-utils.ts
/**
* True for missing-file errors emitted by Node or fs-safe.
* The narrowed union stays stable; extra-path authorization handles `not-file` separately.
*/
function isFileMissingError(err) {
	if (!err || typeof err !== "object" || !("code" in err)) return false;
	return err.code === "ENOENT" || err.code === "ENOTDIR" || err.code === "not-file" || err.code === "not-found";
}
//#endregion
export { readRegularFile as a, walkDirectory$1 as c, isPathInsideWithRealpath as i, isFileMissingError as n, root$1 as o, isPathInside as r, statRegularFile as s, assertNoSymlinkParents as t };
