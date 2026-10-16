import path from "node:path";
import { readRegularFile as readRegularFile$1, statRegularFile } from "@openclaw/fs-safe/advanced";
import { root as root$1 } from "@openclaw/fs-safe/root";
import { isPathInside as isPathInside$1 } from "@openclaw/fs-safe/path";
import { walkDirectory as walkDirectory$1 } from "@openclaw/fs-safe/walk";
//#region packages/memory-host-sdk/src/host/fs-utils.ts
function normalizeComparablePath(pathname) {
	const resolved = path.resolve(pathname);
	return process.platform === "win32" ? resolved.toLowerCase() : resolved;
}
/**
* True for missing-file errors emitted by Node or fs-safe.
* The narrowed union stays stable; extra-path authorization handles `not-file` separately.
*/
function isFileMissingError(err) {
	if (!err || typeof err !== "object" || !("code" in err)) return false;
	return err.code === "ENOENT" || err.code === "ENOTDIR" || err.code === "not-file" || err.code === "not-found";
}
//#endregion
export { root$1 as a, readRegularFile$1 as i, isPathInside$1 as n, statRegularFile as o, normalizeComparablePath as r, walkDirectory$1 as s, isFileMissingError as t };
