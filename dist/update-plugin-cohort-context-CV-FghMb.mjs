import{AsyncLocalStorage}from"node:async_hooks";
//!src/infra/update-plugin-cohort-context.ts
const pluginCohortPublicationContext=new AsyncLocalStorage;export{pluginCohortPublicationContext as t};