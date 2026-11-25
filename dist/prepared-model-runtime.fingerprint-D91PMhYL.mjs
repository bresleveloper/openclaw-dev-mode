import{t as stableStringify}from"./stable-stringify-Cy0VZ0ci.mjs";import{t as sha256Base64Url}from"./crypto-digest-T8X5EZni.mjs";
//!src/agents/prepared-model-runtime.fingerprint.ts
const fingerprintPreparedRuntimeFacts=e=>sha256Base64Url(stableStringify(e));export{fingerprintPreparedRuntimeFacts as t};