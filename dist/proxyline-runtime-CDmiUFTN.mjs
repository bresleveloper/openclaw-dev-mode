import{createRequire}from"node:module";
//!src/infra/net/proxyline-runtime.ts
function loadProxyline(){return createRequire(import.meta.url)(`@openclaw/proxyline`)}export{loadProxyline as t};