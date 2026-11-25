import{t as CONFIG_DIR}from"./utils-CVVNdy3C.mjs";import"./text-utility-runtime-Cwo66kPm.mjs";import path from"node:path";
//!extensions/browser/src/browser/trash.ts
async function movePathToTrash(e){const{movePathToTrash:t}=await import(`./plugin-sdk/browser-config.js`);return await t(e,{allowedRoots:[path.join(CONFIG_DIR,`browser`)]})}export{movePathToTrash as t};