import path from"node:path";import{root}from"@openclaw/fs-safe/root";
//!src/agents/exec-scratch.ts
async function prepareAgentExecScratch(e){const t=await root(e,{symlinks:`reject`});await t.mkdir(`.openclaw/tmp`);const n=path.join(t.rootReal,`.openclaw`,`tmp`);return{TMPDIR:n,TMP:n,TEMP:n}}export{prepareAgentExecScratch as t};