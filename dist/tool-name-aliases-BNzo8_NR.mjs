import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import "./llm-BoijNIT8.mjs";
import "./string-coerce-runtime-50qKeWeL.mjs";
import { i as streamSimple } from "./stream-CL_UFGCU.mjs";
//#region extensions/ollama/src/tool-name-aliases.ts
const TOOL_CALL_ENVELOPES = [
	"<tool_call>",
	"<tool_calls>",
	"[TOOL_CALLS]",
	"<|tool▁calls▁begin|><|tool▁call▁begin|>function<|tool▁sep|>",
	"{\"name\":\"\",\"arguments\":"
];
const TOOL_CALL_REFERENCE_RE = /(?<![\p{L}\p{N}_./:-])tool_call(?![\p{L}\p{N}_/:-]|\.[\p{L}\p{N}_])/gu;
function normalizeOllamaToolCallName(rawName, options = {}) {
	const trimmed = rawName.trim();
	if (!trimmed) return trimmed;
	const availableToolNames = options.availableToolNames;
	if (availableToolNames?.has(trimmed)) return trimmed;
	const strippedAnySeparator = trimmed.replace(/^(?:functions?|tools?)[./_-]+/iu, "").trim();
	if (availableToolNames && strippedAnySeparator !== trimmed && availableToolNames.has(strippedAnySeparator)) return strippedAnySeparator;
	if (availableToolNames) return trimmed;
	return trimmed.replace(/^(?:functions?|tools?)[./]+/iu, "").trim();
}
function collectToolNames(context) {
	const names = new Set(context.tools?.map((tool) => tool.name));
	for (const message of context.messages) if (message.role === "toolResult") names.add(message.toolName);
	else if (message.role === "assistant") {
		for (const block of message.content) if (block.type === "toolCall") names.add(block.name);
	}
	return names;
}
function mapAssistantNames(message, mapName) {
	return {
		...message,
		content: message.content.map((block) => block.type === "toolCall" ? {
			...block,
			name: mapName(block.name)
		} : block)
	};
}
function restoreStreamNames(stream, fromWire) {
	const mapName = (name) => fromWire.get(name) ?? name;
	const result = stream.result.bind(stream);
	stream.result = async () => mapAssistantNames(await result(), mapName);
	const iterate = stream[Symbol.asyncIterator].bind(stream);
	stream[Symbol.asyncIterator] = async function* () {
		for await (const event of { [Symbol.asyncIterator]: iterate }) if (event.type === "done") yield {
			...event,
			message: mapAssistantNames(event.message, mapName)
		};
		else if (event.type === "error") yield {
			...event,
			error: mapAssistantNames(event.error, mapName)
		};
		else if (event.type === "toolcall_end") yield {
			...event,
			toolCall: {
				...event.toolCall,
				name: mapName(event.toolCall.name)
			},
			partial: mapAssistantNames(event.partial, mapName)
		};
		else yield event.partial ? {
			...event,
			partial: mapAssistantNames(event.partial, mapName)
		} : event;
	};
	return stream;
}
function mapToolChoice(choice, mapName) {
	const mapFunction = (entry) => isRecord(entry) && entry.type === "function" && isRecord(entry.function) && typeof entry.function.name === "string" ? {
		...entry,
		function: {
			...entry.function,
			name: mapName(entry.function.name)
		}
	} : entry;
	if (isRecord(choice) && choice.type === "allowed_tools" && isRecord(choice.allowed_tools) && Array.isArray(choice.allowed_tools.tools)) return {
		...choice,
		allowed_tools: {
			...choice.allowed_tools,
			tools: choice.allowed_tools.tools.map(mapFunction)
		}
	};
	return mapFunction(choice);
}
function wrapOllamaToolNames(baseFn) {
	const underlying = baseFn ?? streamSimple;
	return (model, context, options) => {
		const names = collectToolNames(context);
		const toWire = /* @__PURE__ */ new Map();
		for (const name of [...names].toSorted()) {
			if (!name || !TOOL_CALL_ENVELOPES.some((envelope) => envelope.includes(name))) continue;
			let alias = `openclaw_${name}`;
			while (names.has(alias)) alias = `openclaw_${alias}`;
			toWire.set(name, alias);
			names.add(alias);
		}
		if (toWire.size === 0) return underlying(model, context, options);
		const activeNames = new Set(context.tools?.map((tool) => tool.name));
		const mapName = (name) => toWire.get(normalizeOllamaToolCallName(name, { availableToolNames: activeNames.size ? activeNames : void 0 })) ?? name;
		const instructions = [...toWire].filter(([name]) => activeNames.has(name)).map(([name, alias]) => `${name}: use ${alias}`);
		const toolCallAlias = activeNames.has("tool_call") ? toWire.get("tool_call") : void 0;
		const wireContext = {
			...context,
			systemPrompt: instructions.length ? [
				context.systemPrompt,
				"## Tool wire names\nUse these function names for the tools referenced in instructions; arguments and tool IDs are unchanged:",
				...instructions
			].filter(Boolean).join("\n") : context.systemPrompt,
			tools: context.tools?.map((tool) => ({
				...tool,
				name: mapName(tool.name),
				description: toolCallAlias && (tool.name === "tool_search" || tool.name === "tool_describe") ? tool.description.replace(TOOL_CALL_REFERENCE_RE, toolCallAlias) : tool.description
			})),
			messages: context.messages.map((message) => {
				if (message.role === "assistant") return mapAssistantNames(message, mapName);
				return message.role === "toolResult" ? {
					...message,
					toolName: mapName(message.toolName)
				} : message;
			})
		};
		const providerOptions = { ...options };
		if ("toolChoice" in providerOptions) providerOptions.toolChoice = mapToolChoice(providerOptions.toolChoice, mapName);
		const maybeStream = underlying(model, wireContext, {
			...providerOptions,
			onPayload: async (payload, selectedModel) => {
				const replacement = await options?.onPayload?.(payload, selectedModel);
				const request = replacement === void 0 ? payload : replacement;
				if (isRecord(request) && "tool_choice" in request) request.tool_choice = mapToolChoice(request.tool_choice, mapName);
				return replacement;
			}
		});
		const fromWire = new Map([...toWire].map(([name, alias]) => [alias, name]));
		return "then" in maybeStream ? maybeStream.then((stream) => restoreStreamNames(stream, fromWire)) : restoreStreamNames(maybeStream, fromWire);
	};
}
//#endregion
export { wrapOllamaToolNames as n, normalizeOllamaToolCallName as t };
