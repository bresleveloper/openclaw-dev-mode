//#region packages/llm-core/src/utils/diagnostics.ts
/** Formats arbitrary thrown values into diagnostic-safe text. */
function formatThrownValue(value) {
	if (value instanceof Error) return value.message || value.name;
	if (typeof value === "string") return value;
	return String(value);
}
/** Extracts serializable diagnostic error fields from Error and non-Error throws. */
function extractDiagnosticError(error) {
	if (!(error instanceof Error)) return {
		name: "ThrownValue",
		message: formatThrownValue(error)
	};
	const code = error.code;
	return {
		name: error.name || void 0,
		message: error.message || error.name,
		stack: error.stack,
		code: typeof code === "string" || typeof code === "number" ? code : void 0
	};
}
/** Creates a timestamped assistant-message diagnostic entry. */
function createAssistantMessageDiagnostic(type, error, details) {
	return {
		type,
		timestamp: Date.now(),
		error: extractDiagnosticError(error),
		details
	};
}
/** Appends a diagnostic while preserving existing message diagnostics. */
function appendAssistantMessageDiagnostic(message, diagnostic) {
	message.diagnostics = [...message.diagnostics ?? [], diagnostic];
}
//#endregion
export { formatThrownValue as i, createAssistantMessageDiagnostic as n, extractDiagnosticError as r, appendAssistantMessageDiagnostic as t };
