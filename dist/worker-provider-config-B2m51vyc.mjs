import{a as normalizeCapabilityProviderId}from"./provider-registry-shared-WqkaV5jB.mjs";
//!src/plugins/worker-provider-id.ts
function normalizeWorkerProviderIds(e){const t=e.map(normalizeCapabilityProviderId).filter(e=>e!==void 0);return[...new Set(t)].toSorted()}
//!src/plugins/worker-provider-config.ts
function collectConfiguredWorkerProviderIds(e){return normalizeWorkerProviderIds(Object.values(e.cloudWorkers?.profiles??{}).map(e=>e.provider))}export{normalizeWorkerProviderIds as n,collectConfiguredWorkerProviderIds as t};