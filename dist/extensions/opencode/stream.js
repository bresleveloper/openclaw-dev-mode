import { isRecord } from "openclaw/plugin-sdk/string-coerce-runtime";
import { streamSimple } from "openclaw/plugin-sdk/llm";
//#region extensions/opencode/stream.ts
const WEB_SEARCH = "web_search";
const WEB_SEARCH_ALIAS = "openclaw_web_search";
function payloadFunctions(payload) {
	const choice = isRecord(payload.tool_choice) ? payload.tool_choice : void 0;
	return [
		...Array.isArray(payload.tools) ? payload.tools : [],
		...Array.isArray(payload.input) ? payload.input : [],
		...Array.isArray(choice?.tools) ? choice.tools : [],
		choice
	].filter((item) => isRecord(item) && (item.type === "function" || item.type === "function_call") && typeof item.name === "string");
}
function rewriteDynamicRecordSchemas(payload) {
	const fieldsByTool = /* @__PURE__ */ new Map();
	for (const tool of payloadFunctions(payload)) {
		if (tool.type !== "function" || !isRecord(tool.parameters)) continue;
		const properties = tool.parameters.properties;
		if (!isRecord(properties)) continue;
		const fields = [];
		for (const [name, schema] of Object.entries(properties)) {
			if (!isRecord(schema)) continue;
			const patterns = schema.patternProperties;
			if (isRecord(schema.properties) && Object.keys(schema.properties).length > 0 || !isRecord(patterns) || Object.keys(patterns).length !== 1 || !Object.hasOwn(patterns, "^.*$")) continue;
			const valueSchema = patterns["^.*$"];
			const jsonValues = !isRecord(valueSchema) || valueSchema.type !== "string";
			const description = typeof schema.description === "string" ? `${schema.description} ` : "";
			properties[name] = {
				...schema,
				type: "array",
				description: `${description}Provide as key/value entries.${jsonValues ? " JSON-encode every value, including strings." : ""}`,
				items: {
					type: "object",
					properties: {
						key: { type: "string" },
						value: jsonValues ? {
							type: "string",
							description: "JSON-encoded value, including JSON encoding for string values."
						} : valueSchema
					},
					required: ["key", "value"],
					additionalProperties: false
				},
				properties: void 0,
				patternProperties: void 0,
				additionalProperties: void 0,
				required: void 0
			};
			fields.push([name, jsonValues]);
		}
		fieldsByTool.set(tool.name, fields);
	}
	return fieldsByTool;
}
function transformArguments(toolName, args, fields, toWire) {
	for (const [name, jsonValues] of fields.get(toolName) ?? []) {
		const value = args[name];
		if (toWire) {
			if (isRecord(value)) args[name] = Object.entries(value).map(([key, item]) => ({
				key,
				value: jsonValues || typeof item !== "string" ? JSON.stringify(item) ?? "null" : item
			}));
			continue;
		}
		if (!Array.isArray(value)) continue;
		const entries = [];
		const keys = /* @__PURE__ */ new Set();
		let valid = true;
		for (const entry of value) {
			if (!isRecord(entry) || typeof entry.key !== "string" || typeof entry.value !== "string" || keys.has(entry.key)) {
				valid = false;
				break;
			}
			keys.add(entry.key);
			let item = entry.value;
			if (jsonValues) try {
				item = JSON.parse(entry.value);
			} catch {
				valid = false;
				break;
			}
			entries.push([entry.key, item]);
		}
		if (valid) args[name] = Object.fromEntries(entries);
	}
}
function transformCall(call, state, toWire) {
	if (typeof call.name !== "string") return;
	let toolName = call.name;
	if (!toWire && state.alias && toolName === state.alias) call.name = toolName = WEB_SEARCH;
	const serialized = typeof call.arguments === "string";
	try {
		const args = serialized ? JSON.parse(call.arguments) : !toWire && isRecord(call.arguments) ? { ...call.arguments } : call.arguments;
		if (isRecord(args)) {
			transformArguments(toolName, args, state.fields, toWire);
			call.arguments = serialized ? JSON.stringify(args) : args;
		}
	} catch {}
}
function aliasWebSearch(payload) {
	const functions = payloadFunctions(payload);
	const names = new Set(functions.map((item) => item.name));
	if (!names.has(WEB_SEARCH)) return;
	let alias = WEB_SEARCH_ALIAS;
	for (let suffix = 2; names.has(alias); suffix += 1) alias = `${WEB_SEARCH_ALIAS}_${suffix}`;
	for (const item of functions) if (item.name === WEB_SEARCH) item.name = alias;
	return alias;
}
function restoreMessage(message, state) {
	const restored = {
		...message,
		content: message.content.map((block) => ({ ...block }))
	};
	for (const block of restored.content) if (block.type === "toolCall") transformCall(block, state, false);
	return restored;
}
function restoreEvent(event, state) {
	const restored = { ...event };
	if ("partial" in restored && restored.partial) restored.partial = restoreMessage(restored.partial, state);
	if (restored.type === "toolcall_delta") {
		const call = restored.partial.content[restored.contentIndex];
		if (call?.type === "toolCall" && (state.fields.get(call.name)?.length ?? 0) > 0) restored.delta = "";
	} else if (restored.type === "toolcall_end") {
		restored.toolCall = { ...restored.toolCall };
		transformCall(restored.toolCall, state, false);
	} else if (restored.type === "done") restored.message = restoreMessage(restored.message, state);
	else if (restored.type === "error") restored.error = restoreMessage(restored.error, state);
	return restored;
}
function wrapResponseStream(stream, state) {
	return {
		async *[Symbol.asyncIterator]() {
			for await (const event of stream) yield restoreEvent(event, state);
		},
		async result() {
			return restoreMessage(await stream.result(), state);
		}
	};
}
function wrapOpencodeProviderStream(ctx) {
	const underlying = ctx.streamFn ?? streamSimple;
	return (model, context, options) => {
		if (model.api !== "openai-responses") return underlying(model, context, options);
		const originalOnPayload = options?.onPayload;
		const state = { fields: /* @__PURE__ */ new Map() };
		const maybeStream = underlying(model, context, {
			...options,
			async onPayload(payload, payloadModel) {
				const finalPayload = await originalOnPayload?.(payload, payloadModel) ?? payload;
				state.fields = /* @__PURE__ */ new Map();
				state.alias = void 0;
				if (isRecord(finalPayload)) {
					state.fields = rewriteDynamicRecordSchemas(finalPayload);
					for (const call of payloadFunctions(finalPayload)) if (call.type === "function_call") transformCall(call, state, true);
					state.alias = aliasWebSearch(finalPayload);
				}
				return finalPayload;
			}
		});
		const wrap = (stream) => wrapResponseStream(stream, state);
		return maybeStream && typeof maybeStream === "object" && "then" in maybeStream ? Promise.resolve(maybeStream).then(wrap) : wrap(maybeStream);
	};
}
//#endregion
export { wrapOpencodeProviderStream };
