//!extensions/memory-core/recall-operation-api.ts
const pruneRecallEntries=({input:e},t)=>{for(const n of e.keys){t.delete(0,n);t.delete(1,n)}};export{pruneRecallEntries};