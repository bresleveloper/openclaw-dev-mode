import{n as captureChannelReadScope}from"./channel-read-authority-DKyClWAP.mjs";import fs from"node:fs/promises";
//!src/media/temp-files.ts
async function unlinkIfExists(e){if(!e)return;const t=captureChannelReadScope();if(t){await t.discardResource(e);return}try{await fs.unlink(e)}catch{}}export{unlinkIfExists as t};