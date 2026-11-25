import"./read-only-account-inspect-4uoZOhnK.mjs";
//!src/plugin-sdk/directory-runtime.ts
function resolveDirectoryAllowlistEntries(e){return e.entries.map(t=>{const n=e.parseInput(t);if(n.id)return e.buildIdResolved({input:t,parsed:n,match:e.findById(e.lookup,n.id)});return e.resolveNonId({input:t,parsed:n,lookup:e.lookup})??e.buildUnresolved(t)})}export{resolveDirectoryAllowlistEntries as t};