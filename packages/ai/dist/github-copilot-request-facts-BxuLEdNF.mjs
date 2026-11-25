import { p as hasRuntimeContextMarker } from "./types-DIBUKaTM.mjs";
import "./types.mjs";
// packages/ai/src/providers/github-copilot-request-facts.ts
/** Request facts shared by Copilot transports; identity headers remain plugin-owned. */
function projectCopilotRequestFacts(messages, contentMode, hasImages) {
	const last = messages.findLast((message) => !hasRuntimeContextMarker(message));
	return {
		initiator: last && (last.role !== "user" || contentMode === "nested" && containsContentType(last.content, "tool_result")) ? "agent" : "user",
		hasImages: hasImages ?? messages.some((message) => (message.role === "user" || message.role === "toolResult") && Array.isArray(message.content) && message.content.some((item) => containsContentType(item, "image", contentMode)))
	};
}
function containsContentType(value, type, contentMode = "nested") {
	if (contentMode === "nested" && Array.isArray(value)) return value.some((item) => containsContentType(item, type));
	if (!value || typeof value !== "object") return false;
	return "type" in value && value.type === type || contentMode === "nested" && "content" in value && containsContentType(value.content, type);
}
export { projectCopilotRequestFacts as t };
