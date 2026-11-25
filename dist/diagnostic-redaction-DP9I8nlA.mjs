import{i as redactSecrets}from"./redact-CUiSDpWK.mjs";import{t as sanitizeDiagnosticPayload}from"./payload-redaction-D9V_wI0L.mjs";
//!src/agents/diagnostic-redaction.ts
function redactAgentDiagnosticPayload(e){return redactSecrets(sanitizeDiagnosticPayload(e))}export{redactAgentDiagnosticPayload as t};