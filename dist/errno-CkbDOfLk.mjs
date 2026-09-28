//#region src/infra/errno.ts
/** Type guard for NodeJS.ErrnoException (any object with a `code` property). */
function isErrno(err) {
	return Boolean(err && typeof err === "object" && "code" in err);
}
/** Checks whether an errno-shaped value has the exact code. */
function hasErrnoCode(err, code) {
	return isErrno(err) && err.code === code;
}
/** Classifies missing filesystem paths across Node and fs-safe boundaries. */
function isMissingPathError(err) {
	return hasErrnoCode(err, "ENOENT") || hasErrnoCode(err, "ENOTDIR") || hasErrnoCode(err, "not-found");
}
//#endregion
export { isErrno as n, isMissingPathError as r, hasErrnoCode as t };
