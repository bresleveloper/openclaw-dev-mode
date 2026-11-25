import{r as normalizeProviderId}from"./provider-id-A-8WTtLA.mjs";import"./model-ref-parse-CO1d9GQT.mjs";
//!extensions/xai/provider-id.ts
const XAI_PROVIDER_IDS=/* @__PURE__ */ new Set([`xai`,`x-ai`]);function isXaiProviderId(e){return typeof e===`string`&&XAI_PROVIDER_IDS.has(normalizeProviderId(e))}export{isXaiProviderId as t};