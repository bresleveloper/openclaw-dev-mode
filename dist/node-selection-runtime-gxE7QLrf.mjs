import{r as createLazyRuntimeModule}from"./lazy-runtime-Ds6M7vp4.mjs";import"./node-resolve-CW8wgPJI.mjs";
//!src/plugin-sdk/node-selection-runtime.ts
const loadNodeExecRuntime=createLazyRuntimeModule(()=>import(`./node-exec-availability-DDSlzo5p.mjs`));async function loadNodeExecAvailability(e){return(await loadNodeExecRuntime()).loadNodeExecAvailability(e)}export{loadNodeExecAvailability as t};