import{t as resolveConfigDir}from"./config-dir-B-JTDLFb.mjs";import path from"node:path";
//!src/media/store-path.ts
function getMediaDir(e=process.env){return path.join(resolveConfigDir(e),`media`)}export{getMediaDir as t};