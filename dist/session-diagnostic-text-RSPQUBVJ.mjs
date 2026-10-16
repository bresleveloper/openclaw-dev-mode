import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
//#region src/config/sessions/session-diagnostic-text.ts
const MAX_SESSION_DIAGNOSTIC_TEXT_CHARS = 140;
/** Bound diagnostic text before it crosses a worker or logging boundary. */
function boundSessionDiagnosticText(value) {
	const oneLine = value.replace(/\s+/g, " ").trim();
	return oneLine.length > MAX_SESSION_DIAGNOSTIC_TEXT_CHARS ? `${truncateUtf16Safe(oneLine, 137)}...` : oneLine;
}
//#endregion
export { boundSessionDiagnosticText as t };
