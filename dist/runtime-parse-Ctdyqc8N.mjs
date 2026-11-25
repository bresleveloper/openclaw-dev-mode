import{o as normalizeLowercaseStringOrEmpty}from"./string-coerce-CpTFcSwY.mjs";
//!src/daemon/runtime-parse.ts
function parseKeyValueOutput(e,t){const n={};for(const r of e.split(/\r?\n/)){const e=r.trim();if(!e)continue;const i=e.indexOf(t);if(i<=0)continue;const a=normalizeLowercaseStringOrEmpty(e.slice(0,i));n[a]=e.slice(i+t.length).trim()}return n}export{parseKeyValueOutput as t};