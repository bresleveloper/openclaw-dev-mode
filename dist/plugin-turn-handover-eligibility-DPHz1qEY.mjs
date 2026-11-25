//!src/plugins/plugin-turn-handover-eligibility.ts
function pluginHandsOverTurns(e){return e?.turnHandover===true&&e.generationOverlap!==true}export{pluginHandsOverTurns as t};