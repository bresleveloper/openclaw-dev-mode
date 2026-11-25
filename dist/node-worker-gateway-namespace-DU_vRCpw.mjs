import{createHash}from"node:crypto";
//!src/gateway/worker-environments/node-worker-gateway-namespace.ts
function nodeWorkerGatewayNamespace(e){return`gateway-${createHash(`sha256`).update(e).digest(`hex`).slice(0,32)}`}export{nodeWorkerGatewayNamespace as t};