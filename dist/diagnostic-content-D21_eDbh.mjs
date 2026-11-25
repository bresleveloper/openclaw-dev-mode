import{r as truncateUtf16Safe}from"./utf16-slice-DA3Mllbx.mjs";import{s as redactSensitiveText}from"./redact-CUiSDpWK.mjs";
//!src/infra/diagnostic-content.ts
const MAX_DIAGNOSTIC_CONTENT_CHARS=131072;function truncateDiagnosticContent(e){return truncateUtf16Safe(redactSensitiveText(e),MAX_DIAGNOSTIC_CONTENT_CHARS)}export{truncateDiagnosticContent as t};