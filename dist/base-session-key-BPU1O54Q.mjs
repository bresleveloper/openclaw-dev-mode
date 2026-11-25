import{t as buildAgentSessionKey}from"./resolve-route-BPnc6WIx.mjs";
//!src/infra/outbound/base-session-key.ts
function buildOutboundBaseSessionKey(e){const{cfg:t,...n}=e;return buildAgentSessionKey({...n,mainKey:t.session?.mainKey,dmScope:t.session?.dmScope??`main`,groupScope:t.session?.groupScope??`per-group`,identityLinks:t.session?.identityLinks})}export{buildOutboundBaseSessionKey as t};