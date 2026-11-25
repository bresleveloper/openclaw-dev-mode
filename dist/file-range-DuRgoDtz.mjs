import{readFileWindowFully}from"@openclaw/fs-safe/advanced";
//!src/config/sessions/file-range.ts
async function readFileRangeAsync(e,t,n){const r=Buffer.alloc(n);const i=await readFileWindowFully(e,r,t);return i===n?r:r.subarray(0,i)}export{readFileRangeAsync as t};