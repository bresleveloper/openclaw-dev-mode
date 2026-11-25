import path from"node:path";
//!src/infra/safe-cwd.ts
function tryProcessCwd(){try{return process.cwd()}catch{return}}function formatCwdRelativePathOrAbsolute(e,t){const n=tryProcessCwd();return n?path.relative(n,e)||t:e}export{tryProcessCwd as n,formatCwdRelativePathOrAbsolute as t};