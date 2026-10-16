import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { a as asOptionalRecord } from "./record-coerce-TIsquoVR.mjs";
import { ContentBlockSchema } from "@modelcontextprotocol/sdk/types.js";
//#region src/gateway/mcp-app-transcript.ts
function readDescriptor(value) {
	const record = asOptionalRecord(value);
	const viewId = normalizeOptionalString(record?.viewId);
	const serverName = normalizeOptionalString(record?.serverName);
	const toolName = normalizeOptionalString(record?.toolName);
	const uiResourceUri = normalizeOptionalString(record?.uiResourceUri);
	const toolCallId = normalizeOptionalString(record?.toolCallId);
	const rawResultMetaState = record?.resultMetaState;
	const resultMetaState = rawResultMetaState === "unavailable" ? rawResultMetaState : void 0;
	if (!viewId || viewId.length > 128 || !serverName || serverName.length > 256 || !toolName || toolName.length > 256 || !uiResourceUri?.startsWith("ui://") || uiResourceUri.length > 2048 || !toolCallId || toolCallId.length > 512 || rawResultMetaState !== void 0 && resultMetaState === void 0) return;
	return {
		viewId,
		serverName,
		toolName,
		uiResourceUri,
		toolCallId,
		...resultMetaState ? { resultMetaState } : {}
	};
}
function readToolInputFromMessage(value, toolCallId, modelToolName) {
	const message = asOptionalRecord(value);
	if (normalizeOptionalString(message?.role)?.toLowerCase() !== "assistant") return;
	const content = Array.isArray(message?.content) ? message.content : [];
	for (const blockValue of content) {
		const block = asOptionalRecord(blockValue);
		if ((normalizeOptionalString(block?.id) ?? normalizeOptionalString(block?.toolCallId)) !== toolCallId) continue;
		const type = normalizeOptionalString(block?.type)?.toLowerCase();
		if (type !== "toolcall" && type !== "tool_call" && type !== "tooluse" && type !== "tool_use") continue;
		if ((normalizeOptionalString(block?.name) ?? normalizeOptionalString(block?.toolName) ?? normalizeOptionalString(block?.tool_name)) !== modelToolName) continue;
		return { input: block?.arguments ?? block?.input ?? block?.args ?? {} };
	}
}
function readCallToolResult(message, details) {
	const content = Array.isArray(message.content) ? message.content.flatMap((value) => {
		const parsed = ContentBlockSchema.safeParse(value);
		return parsed.success ? [parsed.data] : [];
	}) : [];
	const structuredContent = asOptionalRecord(details.structuredContent);
	return {
		content,
		...structuredContent ? { structuredContent } : {},
		...message.isError === true || details.status === "error" ? { isError: true } : {}
	};
}
function matchesLookup(rawDescriptor, lookup) {
	if ("viewId" in lookup) return normalizeOptionalString(rawDescriptor?.viewId) === lookup.viewId;
	const descriptor = lookup.descriptor;
	return normalizeOptionalString(rawDescriptor?.serverName) === descriptor.serverName && normalizeOptionalString(rawDescriptor?.toolName) === descriptor.toolName && normalizeOptionalString(rawDescriptor?.uiResourceUri) === descriptor.uiResourceUri && normalizeOptionalString(rawDescriptor?.toolCallId) === descriptor.toolCallId;
}
function readTranscriptResult(value, lookup) {
	const message = asOptionalRecord(value);
	if (!message || normalizeOptionalString(message.role)?.toLowerCase() !== "toolresult") return;
	const details = asOptionalRecord(message.details);
	if (!details) return;
	const preview = asOptionalRecord(details.mcpAppPreview);
	const rawDescriptor = asOptionalRecord(preview?.mcpApp);
	if (!matchesLookup(rawDescriptor, lookup)) return;
	const descriptor = readDescriptor(rawDescriptor);
	const modelToolName = normalizeOptionalString(message.toolName) ?? normalizeOptionalString(message.tool_name);
	if (!descriptor || !modelToolName) return { kind: "unavailable" };
	if (normalizeOptionalString(message.toolCallId) !== descriptor.toolCallId || normalizeOptionalString(details.mcpServer) !== descriptor.serverName || normalizeOptionalString(details.mcpTool) !== descriptor.toolName || descriptor.resultMetaState === "unavailable") return { kind: "unavailable" };
	return {
		kind: "restorable",
		value: {
			descriptor,
			modelToolName,
			toolResult: readCallToolResult(message, details)
		}
	};
}
/** Searches the full active transcript without retaining its messages in memory. */
function selectMcpAppReconstructionData(visitTranscript, lookup) {
	let resultRead;
	let resultIndex = -1;
	let messageIndex = 0;
	visitTranscript((message) => {
		const read = readTranscriptResult(message, lookup);
		if (read) {
			resultRead = read;
			resultIndex = messageIndex;
		}
		messageIndex += 1;
	});
	if (!resultRead || resultRead.kind === "unavailable") return;
	const resolvedResult = resultRead.value;
	let input;
	messageIndex = 0;
	visitTranscript((message) => {
		if (messageIndex < resultIndex) input = readToolInputFromMessage(message, resolvedResult.descriptor.toolCallId, resolvedResult.modelToolName) ?? input;
		messageIndex += 1;
	});
	if (!input) return;
	const { modelToolName: _modelToolName, ...reconstruction } = resolvedResult;
	return {
		...reconstruction,
		toolInput: input.input
	};
}
//#endregion
export { selectMcpAppReconstructionData };
