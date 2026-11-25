import{l as normalizeOptionalString}from"./string-coerce-CpTFcSwY.mjs";import{n as isHttpUrl}from"./url-protocol-BLfSvQhh.mjs";
//!src/cron/webhook-url.ts
function normalizeHttpWebhookUrl(e){const t=normalizeOptionalString(e);if(!t)return null;const n=URL.parse(t);return n&&isHttpUrl(n)&&!n.username&&!n.password?t:null}export{normalizeHttpWebhookUrl as t};