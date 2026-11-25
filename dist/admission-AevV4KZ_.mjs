import{AsyncLocalStorage}from"node:async_hooks";
//!src/process/spawn-broker/admission.ts
const admission=new AsyncLocalStorage;function runWithSpawnBrokerAdmission(e,t){return admission.run(e,t)}function getSpawnBrokerAdmission(){return admission.getStore()??`command`}export{runWithSpawnBrokerAdmission as n,getSpawnBrokerAdmission as t};