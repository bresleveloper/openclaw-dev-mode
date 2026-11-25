import{channel}from"node:diagnostics_channel";
//!src/gateway/control-ui-session-pr-diagnostics.ts
const diagnostics=channel(`openclaw.gateway.session-pr`);function recordSessionPrDiagnostic(e,t,n){if(diagnostics.hasSubscribers)diagnostics.publish({phase:e,sessionKey:t?.params.sessionKey,receiptsOnly:t?.taskReceiptsOnly===true,...n})}export{recordSessionPrDiagnostic as t};