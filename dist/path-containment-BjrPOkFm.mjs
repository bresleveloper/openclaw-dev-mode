import{relative}from"node:path";import{isPathRelativeEscape}from"@openclaw/fs-safe/path";
//!src/templates/path-containment.ts
function templateContainedRelativePath(e,t){const n=relative(e,t);return n!==``&&!isPathRelativeEscape(n)?n:void 0}export{templateContainedRelativePath as t};