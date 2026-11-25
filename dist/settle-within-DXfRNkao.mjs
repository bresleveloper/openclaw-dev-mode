import{s as raceWithTimeout}from"./src-De06gkOi.mjs";
//!src/shared/settle-within.ts
async function settlesWithin(e,t){return await raceWithTimeout(e.then(()=>true),t,()=>false,{ref:false})}export{settlesWithin as t};