import{i as validateR2Settings,t as describeR2Target}from"./settings-rIOFhCaP.mjs";
//!extensions/cloudflare/api.ts
const r2StorageProvider={id:`r2`,label:`Cloudflare R2`,validateSettings:validateR2Settings,describeTarget:describeR2Target,async open(e){const{openR2Backend:t}=await import(`./extensions/cloudflare/runtime-api.js`);return t(e)}};export{r2StorageProvider as t};