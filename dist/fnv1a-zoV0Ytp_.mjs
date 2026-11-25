//!src/shared/fnv1a.ts
function fnv1aUtf16(e){let t=2166136261;for(let n=0;n<e.length;n+=1){t^=e.charCodeAt(n);t=Math.imul(t,16777619)}return t>>>0}export{fnv1aUtf16 as t};