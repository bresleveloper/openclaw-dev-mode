import"./src-0ci69Prg.mjs";import{t as expectDefined}from"./expect-DkJCbmLj.mjs";
//!src/shared/human-list.ts
function formatHumanList(e){if(e.length===0)return``;if(e.length===1)return expectDefined(e[0],`values entry at 0`);if(e.length===2)return`${e[0]} or ${e[1]}`;return`${e.slice(0,-1).join(`, `)}, or ${e.at(-1)}`}export{formatHumanList as t};