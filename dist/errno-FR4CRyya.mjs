import { hasNodeErrorCode as hasErrnoCode, isNodeError as isErrno } from "@openclaw/fs-safe/path";
//#region src/infra/errno.ts
/** Classifies missing filesystem paths across Node and fs-safe boundaries. */
function isMissingPathError(err) {
	return hasErrnoCode(err, "ENOENT") || hasErrnoCode(err, "ENOTDIR") || hasErrnoCode(err, "not-found");
}
//#endregion
export { isErrno as n, isMissingPathError as r, hasErrnoCode as t };
