import{c as normalizeOptionalLowercaseString}from"./string-coerce-CpTFcSwY.mjs";import{t as findRegisteredChannelPluginEntry}from"./registry-lookup-CvgX042x.mjs";
//!src/channels/registry-normalize.ts
function normalizeAnyChannelId(e){const t=normalizeOptionalLowercaseString(e);if(!t)return null;return findRegisteredChannelPluginEntry(t)?.plugin.id??null}export{normalizeAnyChannelId as t};