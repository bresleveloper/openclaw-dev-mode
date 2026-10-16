import { acquireFileLockSync, createFileLockManager } from "@openclaw/fs-safe/file-lock";
//#region src/infra/file-lock-manager.ts
/** Recover the full runtime Root type for core-only lockRoot use. */
function asFsSafeFileLockRoot(root) {
	return root;
}
//#endregion
export { asFsSafeFileLockRoot as n, createFileLockManager as r, acquireFileLockSync as t };
