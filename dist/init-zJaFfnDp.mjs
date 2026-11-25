import{i as registerContextEngineForOwner,m as CONTEXT_ENGINE_HOST_PARAMS}from"./registry-DZ4yWo65.mjs";import{n as delegateCompactionToRuntime}from"./delegate-GRUjAPTP.mjs";
//!src/context-engine/legacy.ts
var LegacyContextEngine=class{constructor(){this.info={id:`legacy`,name:`Legacy Context Engine`,version:`1.0.0`,acceptedHostParams:[...CONTEXT_ENGINE_HOST_PARAMS]};this.compact=delegateCompactionToRuntime}async ingest(e){return{ingested:false}}async assemble(e){return{messages:e.messages,estimatedTokens:0}}};
//!src/context-engine/legacy.registration.ts
async function registerLegacyContextEngine(){await registerContextEngineForOwner(`legacy`,async()=>new LegacyContextEngine,`core`,{allowSameOwnerRefresh:true})}export{registerLegacyContextEngine as t};