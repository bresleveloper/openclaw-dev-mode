import{t as isChannelStartupSuppressedByEnvironment}from"./server-sidecar-startup-mode-BI8_B2ko.mjs";
//!src/gateway/server-startup-secret-surfaces.ts
function resolveGatewayStartupSourceConfig(e,t){if(!isChannelStartupSuppressedByEnvironment(t)||!e.channels)return e;return{...e,channels:void 0}}export{resolveGatewayStartupSourceConfig as t};