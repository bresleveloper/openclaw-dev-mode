import{l as isRecord}from"./record-coerce-BTbqdJ3-.mjs";import{t as isBlockedObjectKey}from"./prototype-keys-Dc7Yq32J.mjs";
//!src/config/merge-missing.ts
function mergeMissing(e,t){for(const[n,r]of Object.entries(t)){if(r===void 0||isBlockedObjectKey(n))continue;const t=e[n];if(t===void 0){e[n]=r;continue}if(isRecord(t)&&isRecord(r))mergeMissing(t,r)}}export{mergeMissing as t};