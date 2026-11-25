import{createHash,hash}from"node:crypto";import{Buffer}from"node:buffer";
//!packages/normalization-core/src/node-crypto.ts
function sha256Hex(e){return hash(`sha256`,e,`hex`)}function sha256HexPrefixCore(e,t){return sha256Hex(e).slice(0,t)}export{sha256HexPrefixCore as n,sha256Hex as t};