import crypto from"node:crypto";
//!src/commands/random-token.ts
function randomToken(){return crypto.randomBytes(24).toString(`hex`)}export{randomToken as t};