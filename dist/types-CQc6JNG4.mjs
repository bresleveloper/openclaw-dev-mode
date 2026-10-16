//#region packages/llm-core/src/types.ts
/** Stable error codes for provider outcomes that cannot be replayed safely. */
const PROVIDER_POST_DISPATCH_AMBIGUITY_ERROR_CODE = "PROVIDER_POST_DISPATCH_AMBIGUITY";
const PROVIDER_FAILURE_WITH_OUTPUT_ERROR_CODE = "PROVIDER_FAILURE_WITH_OUTPUT";
/** Pre-dispatch argument rejection; callers still enforce output and effect guards. */
const MALFORMED_TOOL_CALL_ARGUMENTS_ERROR_CODE = "malformed_tool_call_arguments";
const DEFAULT_MISSING_TOOL_RESULT_TEXT = "Tool call interrupted before a result was recorded; its outcome is unknown. Retry only if the operation is read-only or idempotent. If it may have had side effects, verify the current state first instead of repeating it.";
const RUNTIME_CONTEXT_CUSTOM_TYPE = "openclaw.runtime-context";
const RUNTIME_CONTEXT_BEGIN_MARKER = "<<<BEGIN_OPENCLAW_INTERNAL_CONTEXT>>>";
const RUNTIME_CONTEXT_END_MARKER = "<<<END_OPENCLAW_INTERNAL_CONTEXT>>>";
const RUNTIME_CONTEXT_HEADER = "OpenClaw runtime context:";
const RUNTIME_CONTEXT_FOOTER = "End OpenClaw runtime context.";
const ESCAPED_RUNTIME_CONTEXT_FOOTER = "[[RUNTIME_CONTEXT_FOOTER_ESCAPED]]";
/** Identifies the exact delimiter envelope emitted by shipped transcript carriers. */
function hasLegacyRuntimeContextEnvelope(content) {
	return content.startsWith(`<<<BEGIN_OPENCLAW_INTERNAL_CONTEXT>>>\n`) && content.endsWith(`\n<<<END_OPENCLAW_INTERNAL_CONTEXT>>>`);
}
/** Prevent untrusted carrier content from terminating its provider projection. */
function escapeRuntimeContextFooter(content) {
	return content.replaceAll(RUNTIME_CONTEXT_FOOTER, ESCAPED_RUNTIME_CONTEXT_FOOTER);
}
/** Builds the human-readable projection used only at provider boundaries. */
function labelRuntimeContextText(content) {
	return `${RUNTIME_CONTEXT_HEADER}\n${escapeRuntimeContextFooter(content)}\n${RUNTIME_CONTEXT_FOOTER}`;
}
/** Labels runtime context once while preserving structured text blocks. */
function labelRuntimeContextContent(content) {
	if (typeof content === "string") return labelRuntimeContextText(content);
	if (content.length === 0) return [{
		type: "text",
		text: `${RUNTIME_CONTEXT_HEADER}\n${RUNTIME_CONTEXT_FOOTER}`
	}];
	return content.map((block, index) => ({
		...block,
		text: [
			...index === 0 ? [RUNTIME_CONTEXT_HEADER] : [],
			escapeRuntimeContextFooter(block.text),
			...index === content.length - 1 ? [RUNTIME_CONTEXT_FOOTER] : []
		].join("\n")
	}));
}
/** Flattens already-labeled runtime context for string-only provider messages. */
function runtimeContextContentToText(content) {
	return typeof content === "string" ? content : content.map((block) => block.text).join("\n");
}
/** Identifies trusted runtime context independently of its provider-compatible shape. */
function hasRuntimeContextMarker(message) {
	return message.role === "user" && (message.runtimeContext !== void 0 || message.runtimeContextCarrier === true);
}
/** Distinguishes trusted runtime context while preserving user-role plugin compatibility. */
function isRuntimeContextMessage(message) {
	return (typeof message.content === "string" || Array.isArray(message.content) && message.content.every((part) => typeof part === "object" && part !== null && "type" in part && part.type === "text" && "text" in part && typeof part.text === "string")) && hasRuntimeContextMarker(message);
}
/** Reads canonical metadata while accepting the shipped v2026.9.7 carrier fields. */
function readRuntimeContextMetadata(message) {
	if (message.runtimeContext !== void 0) return message.runtimeContext;
	return message.runtimeContextCarrierRetained === void 0 ? {} : { retained: message.runtimeContextCarrierRetained };
}
/** Updates canonical retention and its shipped compatibility projection together. */
function setRuntimeContextRetention(message, retained) {
	message.runtimeContext = {
		...readRuntimeContextMetadata(message),
		retained
	};
	message.runtimeContextCarrier = true;
	message.runtimeContextCarrierRetained = retained;
}
//#endregion
export { runtimeContextContentToText as _, RUNTIME_CONTEXT_BEGIN_MARKER as a, RUNTIME_CONTEXT_FOOTER as c, hasLegacyRuntimeContextEnvelope as d, hasRuntimeContextMarker as f, readRuntimeContextMetadata as g, labelRuntimeContextText as h, PROVIDER_POST_DISPATCH_AMBIGUITY_ERROR_CODE as i, RUNTIME_CONTEXT_HEADER as l, labelRuntimeContextContent as m, MALFORMED_TOOL_CALL_ARGUMENTS_ERROR_CODE as n, RUNTIME_CONTEXT_CUSTOM_TYPE as o, isRuntimeContextMessage as p, PROVIDER_FAILURE_WITH_OUTPUT_ERROR_CODE as r, RUNTIME_CONTEXT_END_MARKER as s, DEFAULT_MISSING_TOOL_RESULT_TEXT as t, escapeRuntimeContextFooter as u, setRuntimeContextRetention as v };
