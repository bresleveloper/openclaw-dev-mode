import{t as normalizeConversationReadInvocationOrigin}from"./conversation-read-origin-ByHFzN6I.mjs";
//!src/gateway/conversation-read-origin.ts
function resolveGatewayConversationReadOrigin(e){if(e.client?.internal?.agentRuntimeIdentity)return`delegated`;return normalizeConversationReadInvocationOrigin(e.requestedOrigin)}export{resolveGatewayConversationReadOrigin as t};