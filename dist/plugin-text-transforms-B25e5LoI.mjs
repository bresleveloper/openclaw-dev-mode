import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { t as createStreamIteratorWrapper } from "./stream-iterator-wrapper-BKsGhmOL.mjs";
//#region src/agents/plugin-text-transforms.ts
function mergePluginTextTransforms(...transforms) {
	const input = transforms.flatMap((entry) => entry?.input ?? []);
	const output = transforms.flatMap((entry) => entry?.output ?? []);
	if (input.length === 0 && output.length === 0) return;
	return {
		...input.length > 0 ? { input } : {},
		...output.length > 0 ? { output } : {}
	};
}
function applyPluginTextReplacements(text, replacements) {
	if (!replacements || replacements.length === 0 || !text) return text;
	let next = text;
	for (const replacement of replacements) next = next.replace(replacement.from, replacement.to);
	return next;
}
function transformContentText(content, replacements, mode = "content") {
	if (mode === "message" && !isRecord(content)) return content;
	if (typeof content === "string") return applyPluginTextReplacements(content, replacements);
	if (Array.isArray(content)) return content.map((entry) => transformContentText(entry, replacements, mode));
	if (!isRecord(content)) return content;
	if (mode === "arguments") return Object.fromEntries(Object.entries(content).map(([key, entry]) => [key, transformContentText(entry, replacements, mode)]));
	const next = { ...content };
	if (mode === "content" && typeof next.text === "string") next.text = applyPluginTextReplacements(next.text, replacements);
	if (Object.hasOwn(next, "content")) next.content = transformContentText(next.content, replacements);
	if (mode === "content" && next.type === "toolCall" && Object.hasOwn(next, "arguments")) next.arguments = transformContentText(next.arguments, replacements, "arguments");
	if (mode === "message" && typeof next.errorMessage === "string") next.errorMessage = applyPluginTextReplacements(next.errorMessage, replacements);
	return next;
}
function transformAssistantEventText(event, replacements) {
	if (!isRecord(event) || !replacements || replacements.length === 0) return event;
	const next = { ...event };
	if (next.type === "text_delta" && typeof next.delta === "string") next.delta = applyPluginTextReplacements(next.delta, replacements);
	if (next.type === "text_end" && typeof next.content === "string") next.content = applyPluginTextReplacements(next.content, replacements);
	if (next.type === "toolcall_end" && isRecord(next.toolCall) && Object.hasOwn(next.toolCall, "arguments")) next.toolCall = {
		...next.toolCall,
		arguments: transformContentText(next.toolCall.arguments, replacements, "arguments")
	};
	for (const field of [
		"partial",
		"message",
		"error"
	]) if (Object.hasOwn(next, field)) next[field] = transformContentText(next[field], replacements, "message");
	return next;
}
function wrapStreamTextTransforms(stream, replacements) {
	if (!replacements || replacements.length === 0) return stream;
	const originalResult = stream.result.bind(stream);
	stream.result = async () => transformContentText(await originalResult(), replacements, "message");
	const originalAsyncIterator = stream[Symbol.asyncIterator].bind(stream);
	stream[Symbol.asyncIterator] = function() {
		return createStreamIteratorWrapper({
			iterator: originalAsyncIterator(),
			next: async (streamIterator) => {
				const result = await streamIterator.next();
				return result.done ? result : {
					done: false,
					value: transformAssistantEventText(result.value, replacements)
				};
			}
		});
	};
	return stream;
}
function wrapStreamFnTextTransforms(params) {
	return (model, context, options) => {
		const nextContext = params.input?.length ? {
			...context,
			systemPrompt: params.transformSystemPrompt !== false && typeof context.systemPrompt === "string" ? applyPluginTextReplacements(context.systemPrompt, params.input) : context.systemPrompt,
			messages: Array.isArray(context.messages) ? context.messages.map((message) => transformContentText(message, params.input, "message")) : context.messages
		} : context;
		const maybeStream = params.streamFn(model, nextContext, options);
		if (maybeStream && typeof maybeStream === "object" && "then" in maybeStream) return Promise.resolve(maybeStream).then((stream) => wrapStreamTextTransforms(stream, params.output));
		return wrapStreamTextTransforms(maybeStream, params.output);
	};
}
//#endregion
export { mergePluginTextTransforms as n, wrapStreamFnTextTransforms as r, applyPluginTextReplacements as t };
