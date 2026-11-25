//!src/infra/map-size.ts
function pruneMapToMaxSize(e,t){if(Number.isNaN(t)||t===Number.POSITIVE_INFINITY)return;const n=Math.max(0,Math.floor(t));if(n<=0){e.clear();return}for(const t of e.keys()){if(e.size<=n)break;e.delete(t)}}
//!src/shared/regexp.ts
function escapeRegExp(e){return e.replace(/[.*+?^${}()|[\]\\]/g,`\\$&`)}export{pruneMapToMaxSize as n,escapeRegExp as t};