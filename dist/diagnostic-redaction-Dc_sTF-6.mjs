import { p as redactSecrets } from "./redact-DJ8j6ADa.mjs";
import { t as sanitizeDiagnosticPayload } from "./payload-redaction-N9xicL2K.mjs";
//#region src/agents/diagnostic-redaction.ts
function redactAgentDiagnosticPayload(value) {
	return redactSecrets(sanitizeDiagnosticPayload(value));
}
//#endregion
export { redactAgentDiagnosticPayload as t };
