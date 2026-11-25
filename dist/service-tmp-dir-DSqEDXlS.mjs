import{n as resolveGatewayStateDir}from"./paths-DJalwizy.mjs";import path from"node:path";import os from"node:os";
//!src/daemon/service-tmp-dir.ts
function resolveServiceTmpDir(e,t){if(t===`darwin`)try{return path.join(resolveGatewayStateDir(e),`tmp`)}catch{}const n=e.TMPDIR?.trim();if(t===`linux`)return n||void 0;return n||os.tmpdir()}export{resolveServiceTmpDir as t};