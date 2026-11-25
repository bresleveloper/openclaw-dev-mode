import{l as normalizeOptionalString}from"./string-coerce-CpTFcSwY.mjs";
//!src/gateway/probe-target.ts
function resolveGatewayProbeTarget(e){const t=e.gateway?.mode===`remote`?`remote`:`local`;const n=normalizeOptionalString(e.gateway?.remote?.url)??``;const r=t===`remote`&&!n;return{gatewayMode:t,mode:t===`remote`&&!r?`remote`:`local`,remoteUrlMissing:r}}export{resolveGatewayProbeTarget as t};