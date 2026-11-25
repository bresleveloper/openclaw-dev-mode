import{hasNodeErrorCode as hasErrnoCode,isNodeError as isErrno}from"@openclaw/fs-safe/path";
//!src/infra/errno.ts
function isMissingPathError(e){return hasErrnoCode(e,`ENOENT`)||hasErrnoCode(e,`ENOTDIR`)||hasErrnoCode(e,`not-found`)}function ignoreMissingPath(e){if(hasErrnoCode(e,`ENOENT`))return;throw e}export{isMissingPathError as i,ignoreMissingPath as n,isErrno as r,hasErrnoCode as t};