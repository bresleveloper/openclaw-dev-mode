//!src/shared/pending-promises.ts
function createPendingPromiseTracker(e){return t=>{e.add(t);const settled=()=>e.delete(t);t.then(settled,settled);return t}}export{createPendingPromiseTracker as t};