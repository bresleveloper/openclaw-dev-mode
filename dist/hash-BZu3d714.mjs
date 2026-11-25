import crypto from"node:crypto";
//!src/agents/sandbox/hash.ts
function hashTextSha256(e){return crypto.createHash(`sha256`).update(e).digest(`hex`)}export{hashTextSha256 as t};