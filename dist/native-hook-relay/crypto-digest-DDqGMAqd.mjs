import{closeSync,openSync}from"node:fs";import{createHash,hash}from"node:crypto";import{sha256FileSync}from"@openclaw/fs-safe/durability";
//!src/infra/crypto-digest.ts
function sha256Base64Url(e){return hash(`sha256`,e,`base64url`)}function sha256FileSync$1(e){const t=openSync(e,`r`);try{return sha256FileSync(t).digest}finally{closeSync(t)}}export{sha256FileSync$1 as n,sha256Base64Url as t};