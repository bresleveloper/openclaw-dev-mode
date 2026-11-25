import{acquireFileLockSync,createFileLockManager}from"@openclaw/fs-safe/file-lock";
//!src/infra/file-lock-manager.ts
function asFsSafeFileLockRoot(e){return e}export{asFsSafeFileLockRoot as n,createFileLockManager as r,acquireFileLockSync as t};