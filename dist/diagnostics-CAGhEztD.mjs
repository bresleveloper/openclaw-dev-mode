import { Guard } from "typebox/guard";
//#region packages/llm-core/src/utils/provider-refusal.ts
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
//#endregion
//#region packages/llm-core/src/utils/diagnostics.ts
/** True when the provider explicitly refused the request payload. */
function isProviderRefusalAssistantError(message) {
	return Boolean(message?.diagnostics?.some((diagnostic) => diagnostic.type === "provider_refusal"));
}
//#endregion
export { readProviderRefusalReview as n, isProviderRefusalAssistantError as t };
