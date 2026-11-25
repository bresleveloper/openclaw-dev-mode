import path from"node:path";
//!src/cli/update-cli/node-runner.ts
function resolveNodeRunner(){const e=path.basename(process.execPath).trim().toLowerCase();return process.versions.bun||e===`node`||e===`node.exe`?process.execPath:`node`}export{resolveNodeRunner as t};