import os from"node:os";
//!extensions/anthropic/session-catalog-home.ts
function resolveClaudeCatalogHomeDir(e=process.env){return e.HOME?.trim()||e.USERPROFILE?.trim()||os.homedir()}export{resolveClaudeCatalogHomeDir as t};