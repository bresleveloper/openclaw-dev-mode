import { asNonArrayRecord, asOptionalObjectRecord, readNonEmptyStringPreservingWhitespace } from "openclaw/plugin-sdk/string-coerce-runtime";
import { sanitizeToolResult } from "openclaw/plugin-sdk/agent-harness-runtime";
import { parseDateStringTimestampMs, resolveOptionalIntegerOption } from "openclaw/plugin-sdk/number-runtime";
// extensions/copilot/src/usage-bridge.ts
function normalizeCopilotUsage(data) {
	const source = asOptionalObjectRecord(data);
	if (!source) return;
	const input = resolveOptionalIntegerOption(source.inputTokens, { min: 0 });
	const output = resolveOptionalIntegerOption(source.outputTokens, { min: 0 });
	const cacheRead = resolveOptionalIntegerOption(source.cacheReadTokens, { min: 0 });
	const cacheWrite = resolveOptionalIntegerOption(source.cacheWriteTokens, { min: 0 });
	return {
		cacheRead,
		cacheWrite,
		input,
		output,
		total: (input ?? 0) + (output ?? 0) + (cacheRead ?? 0) + (cacheWrite ?? 0)
	};
}
// extensions/copilot/src/event-bridge-transcript.ts
function buildAssistantMessage(params) {
	const event = params.event;
	const text = event ? event.data.content || params.assistantTexts.at(-1) || "" : "";
	const reasoningText = event?.data.reasoningText ?? params.reasoningText;
	const toolRequests = event?.data.toolRequests ?? [];
	const content = [];
	if (reasoningText) content.push({
		thinking: reasoningText,
		type: "thinking"
	});
	if (text) content.push({
		text,
		type: "text"
	});
	for (const request of toolRequests) content.push({
		arguments: asNonArrayRecord(request.arguments),
		id: request.toolCallId,
		name: request.name,
		type: "toolCall"
	});
	const api = params.modelRef.api ?? "openai-responses";
	const model = event?.data.model ?? params.modelRef.id;
	const provider = params.modelRef.provider;
	const stopReason = toolRequests.length > 0 ? "toolUse" : "stop";
	const timestamp = params.now();
	const fallbackOutputTokens = event?.data.outputTokens;
	const usage = params.usage ?? normalizeCopilotUsage({ outputTokens: fallbackOutputTokens });
	return {
		api,
		content,
		model,
		provider,
		role: "assistant",
		stopReason,
		timestamp,
		usage: {
			cacheRead: usage?.cacheRead ?? 0,
			cacheWrite: usage?.cacheWrite ?? 0,
			cost: {
				cacheRead: 0,
				cacheWrite: 0,
				input: 0,
				output: 0,
				total: 0
			},
			input: usage?.input ?? 0,
			output: usage?.output ?? 0,
			totalTokens: usage?.total ?? 0
		}
	};
}
function buildAssistantProjectionGroup(group, modelRef, resolveTimestamp, usageByApiCallId, latestUsage, forTranscript) {
	const messages = group.chunks.flatMap((chunk) => {
		const message = buildAssistantMessage({
			event: chunk.event,
			modelRef,
			now: () => resolveTimestamp(chunk.event),
			reasoningText: forTranscript ? chunk.transcriptReasoningText : chunk.reasoningText,
			usage: resolveAssistantUsage(chunk.event, latestUsage, usageByApiCallId),
			assistantTexts: forTranscript ? chunk.transcriptAssistantTexts : chunk.assistantTexts
		});
		return message.content.length > 0 ? [message] : [];
	});
	const replayIncomplete = group.chunks.some(({ event }) => event.data.citations !== void 0 || event.data.serverTools !== void 0 || event.data.reasoningWireField !== void 0 || event.data.reasoningOpaque !== void 0 || event.data.encryptedContent !== void 0 || event.data.toolRequests?.some((request) => request.type === "custom") === true);
	const last = messages.at(-1);
	if (!last) return {
		message: void 0,
		replayIncomplete,
		toolCallIds: []
	};
	const narrative = [];
	let terminalThinking;
	const toolCallsById = /* @__PURE__ */ new Map();
	for (const message of messages) for (const part of message.content) {
		if (part.type === "toolCall") {
			toolCallsById.set(part.id, part);
			continue;
		}
		if (part.type === "thinking") {
			terminalThinking = part;
			continue;
		}
		const previous = narrative.at(-1);
		if (part.type === "text" && previous?.type === "text") narrative[narrative.length - 1] = {
			...previous,
			text: previous.text + part.text
		};
		else narrative.push(part);
	}
	const content = [
		...terminalThinking ? [terminalThinking] : [],
		...narrative,
		...toolCallsById.values()
	];
	const toolCallIds = [...toolCallsById.keys()];
	return {
		message: {
			...last,
			content,
			stopReason: toolCallIds.length > 0 ? "toolUse" : "stop"
		},
		replayIncomplete,
		toolCallIds
	};
}
function resolveAssistantUsage(event, latest, byApiCallId) {
	const apiCallId = readNonEmptyStringPreservingWhitespace(event?.data.apiCallId);
	return apiCallId ? byApiCallId.get(apiCallId) ?? latest : latest;
}
function resolveEventTimestamp(timestamp, now) {
	return parseDateStringTimestampMs(timestamp) ?? now();
}
function hasOwnKeys(value) {
	return Boolean(value && typeof value === "object" && Object.keys(value).length > 0);
}
function projectSdkUserMetadata(attachments, source) {
	const summaries = (attachments ?? []).map((attachment) => {
		const { data: _data, payload: _payload, text: _text, ...summary } = attachment;
		return summary;
	});
	const media = (attachments ?? []).flatMap((attachment) => {
		if (attachment.type === "file") return [{
			path: attachment.path,
			contentType: attachment.mimeType
		}];
		return attachment.type === "selection" ? [{
			path: attachment.filePath,
			kind: "document"
		}] : [];
	});
	if (!source && summaries.length === 0) return;
	return {
		...source ? { copilotSource: source } : {},
		...summaries.length > 0 ? { copilotAttachments: summaries } : {},
		...media.length > 0 ? { media } : {}
	};
}
function projectToolResultDetails(data) {
	const result = data.result;
	const sanitizedContents = result?.contents ? sanitizeToolResult({ content: result.contents }).content : void 0;
	const binaryResultsForLlm = result?.binaryResultsForLlm?.map((entry) => {
		const { data: _data, ...descriptor } = entry;
		return descriptor;
	});
	const citableSources = result?.citableSources?.map((source) => Object.assign({}, source, { content: sanitizeToolDetailText(source.content) }));
	return sanitizeToolResult({
		...result?.detailedContent ? { content: [{
			type: "text",
			text: result.detailedContent
		}] } : {},
		...result?.structuredContent ? { structuredContent: result.structuredContent } : {},
		...sanitizedContents ? { contents: sanitizedContents } : {},
		...binaryResultsForLlm?.length ? { binaryResultsForLlm } : {},
		...citableSources?.length ? { citableSources } : {},
		...data.mcpMeta || result?.mcpMeta ? { mcpMeta: data.mcpMeta ?? result?.mcpMeta } : {}
	});
}
function sanitizeToolDetailText(text) {
	const value = sanitizeToolResult({ content: [{
		type: "text",
		text
	}] }).content?.[0]?.text;
	return typeof value === "string" ? value : "";
}
// extensions/copilot/src/session-restrictions.ts
const COPILOT_ISOLATED_EXCLUDED_TOOLS = [
	"builtin:*",
	"mcp:*",
	"custom:*"
];
/** Disable every ambient SDK capability for a prompt-only or settled final turn. */
function createCopilotIsolatedSessionRestrictions() {
	return {
		availableTools: [],
		coauthorEnabled: false,
		customAgents: [],
		customAgentsLocalOnly: true,
		embeddingCacheStorage: "in-memory",
		enableConfigDiscovery: false,
		enableFileHooks: false,
		enableHostGitOperations: false,
		enableOnDemandInstructionDiscovery: false,
		enableSessionStore: false,
		enableSkills: false,
		excludedTools: [...COPILOT_ISOLATED_EXCLUDED_TOOLS],
		includeSubAgentStreamingEvents: false,
		infiniteSessions: { enabled: false },
		instructionDirectories: [],
		manageScheduleEnabled: false,
		mcpOAuthTokenStorage: "in-memory",
		mcpServers: {},
		memory: { enabled: false },
		pluginDirectories: [],
		remoteSession: "off",
		requestCanvasRenderer: false,
		requestExtensions: false,
		skillDirectories: [],
		skipCustomInstructions: true,
		skipEmbeddingRetrieval: true,
		tools: []
	};
}
export { projectSdkUserMetadata as a, resolveEventTimestamp as c, hasOwnKeys as i, sanitizeToolDetailText as l, buildAssistantMessage as n, projectToolResultDetails as o, buildAssistantProjectionGroup as r, resolveAssistantUsage as s, createCopilotIsolatedSessionRestrictions as t, normalizeCopilotUsage as u };
