import{a as raceWithTimeout}from"./src-CY_qXgOR.mjs";
//!src/shared/settle-within.ts
async function settlesWithin(e,t){return await raceWithTimeout(e.then(()=>true),t,()=>false,{ref:false})}export{settlesWithin as t};