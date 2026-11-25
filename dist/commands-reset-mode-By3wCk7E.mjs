import{o as normalizeLowercaseStringOrEmpty}from"./string-coerce-CpTFcSwY.mjs";
//!src/auto-reply/reply/commands-reset-mode.ts
function parseSoftResetCommand(e){let t=e;for(const e of[/^\/reset(?:\s|$)/,/^soft(?:\s|$)/]){const n=normalizeLowercaseStringOrEmpty(t).match(e);if(!n)return{matched:false};t=t.slice(n[0].length).trimStart()}return{matched:true,tail:t}}export{parseSoftResetCommand as t};