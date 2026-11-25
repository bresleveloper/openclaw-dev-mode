//!extensions/memory-core/src/workspace-file-mode.ts
function resolveWorkspaceCreationMode(e){return e===void 0?384:Number.parseInt(e,8)&~process.umask()&438}export{resolveWorkspaceCreationMode as t};