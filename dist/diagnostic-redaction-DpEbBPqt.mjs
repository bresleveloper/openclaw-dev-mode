import { p as redactSecrets } from "./redact-B5EGyLvV.mjs";
import { t as sanitizeDiagnosticPayload } from "./payload-redaction-DPHUXa81.mjs";
//#region src/agents/diagnostic-redaction.ts
function redactAgentDiagnosticPayload(value) {
	return redactSecrets(sanitizeDiagnosticPayload(value));
}
//#endregion
export { redactAgentDiagnosticPayload as t };
