import{n as isTruthyEnvValue}from"./env-CgAf0Ri-.mjs";
//!src/gateway/server-sidecar-startup-mode.ts
function isChannelStartupSuppressedByEnvironment(e=process.env){return isTruthyEnvValue(e.OPENCLAW_SKIP_CHANNELS)||isTruthyEnvValue(e.OPENCLAW_SKIP_PROVIDERS)}export{isChannelStartupSuppressedByEnvironment as t};