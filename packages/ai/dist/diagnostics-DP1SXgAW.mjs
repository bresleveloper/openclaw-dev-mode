import { Guard } from "typebox/guard";
// packages/llm-core/src/utils/diagnostics.ts
const encoder = new TextEncoder();
function isBoundedText(value, maxBytes) {
	return typeof value === "string" && value.length <= maxBytes && value.trim().length > 0 && encoder.encode(value).byteLength <= maxBytes;
}
/** Keep exact provider text. Truncation must never make an invalid continuation usable. */
function readProviderRefusalReview(value) {
	if (!Guard.IsObjectNotArray(value) || !isBoundedText(value.explanation, 65536)) return;
	const continuation = Guard.IsObjectNotArray(value.continuation) ? value.continuation.message : void 0;
	return {
		explanation: value.explanation,
		...isBoundedText(continuation, 1024) ? { continuation: { message: continuation } } : {},
		...typeof value.errorType === "string" && value.errorType.trim() ? { errorType: value.errorType } : {}
	};
}
/** True when the provider explicitly refused the request payload. */
function isProviderRefusalAssistantError(message) {
	return Boolean(message?.diagnostics?.some((diagnostic) => diagnostic.type === "provider_refusal"));
}
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
/** Records only the presence of hidden reasoning; never copies its content. */
function recordSuppressedReasoning(message) {
	if (!message.diagnostics?.some((entry) => entry.type === "reasoning_suppressed")) appendAssistantMessageDiagnostic(message, {
		type: "reasoning_suppressed",
		timestamp: Date.now()
	});
	if (message.stopReason !== "stop" && message.stopReason !== "length" || message.content.some((block) => block.type === "toolCall" || block.type === "text" && block.text.trim())) return;
	return /* @__PURE__ */ new Error(`${message.provider}/${message.model} returned only reasoning while configured reasoning: false. Set reasoning: true for this model in models.providers.${message.provider}.models or choose a non-thinking model.` + (message.stopReason === "length" ? " The output token limit was reached before an answer." : ""));
}
export { isProviderRefusalAssistantError as a, formatThrownValue as i, createAssistantMessageDiagnostic as n, readProviderRefusalReview as o, extractDiagnosticError as r, recordSuppressedReasoning as s, appendAssistantMessageDiagnostic as t };
