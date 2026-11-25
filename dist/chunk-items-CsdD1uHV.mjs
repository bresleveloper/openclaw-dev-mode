//!src/utils/chunk-items.ts
function chunkItems(e,t){if(t<=0)return[Array.from(e)];const n=[];for(let r=0;r<e.length;r+=t)n.push(e.slice(r,r+t));return n}export{chunkItems as t};