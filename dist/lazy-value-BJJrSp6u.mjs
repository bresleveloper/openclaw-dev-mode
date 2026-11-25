//!src/plugin-sdk/lazy-value.ts
function createCachedLazyValueGetter(e){let t=false;let n;return()=>{if(!t){n=typeof e===`function`?e():e;t=true}return n}}export{createCachedLazyValueGetter as t};