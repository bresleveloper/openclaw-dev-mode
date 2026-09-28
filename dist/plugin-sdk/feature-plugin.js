import { n as validateJsonSchemaValue } from "../schema-validator-G8odGT6Q.mjs";
import { t as isPluginJsonValue } from "../host-hook-json-BdcyDerH.mjs";
import { t as jsonResult } from "../tool-results-BCM3fdVS.mjs";
import "../common-XfKigJno.mjs";
import { t as definePluginEntry } from "../plugin-entry-BOulgRcx.mjs";
import { r as toolPluginMetadataSymbol } from "../tool-plugin-odJvsmEs.mjs";
//#region src/plugin-sdk/feature-plugin.ts
var FeatureValidationError = class extends Error {
	constructor(code, message) {
		super(message);
		this.code = code;
		this.name = "FeatureValidationError";
	}
};
function validateFeatureValue(schema, value, key, direction) {
	const code = direction === "input" ? "INVALID_INPUT" : "INVALID_OUTPUT";
	if (!isPluginJsonValue(value)) throw new FeatureValidationError(code, `Feature ${direction} must be bounded JSON`);
	const validation = validateJsonSchemaValue({
		schema,
		cacheKey: key,
		value
	});
	if (!validation.ok) throw new FeatureValidationError(code, `Feature ${direction} does not match its schema: ${validation.errors.map((error) => error.text).join("; ").slice(0, 512)}`);
	return value;
}
/** One implementation serves each declared surface without relaying through privileged RPC. */
function defineFeaturePlugin(definition) {
	const { contract } = definition;
	const operations = Object.entries(contract.operations).toSorted(([left], [right]) => left.localeCompare(right));
	const entry = definePluginEntry({
		id: contract.pluginId,
		name: definition.name,
		description: definition.description,
		register(api) {
			if (api.id !== contract.pluginId) throw new Error("Feature contract must belong to the registering plugin");
			let gatewayEvents;
			const events = { emit(event, payload) {
				const schema = contract.events[event];
				if (!schema || !gatewayEvents) throw new Error("Feature event emitter is unavailable until its Gateway service starts");
				const value = validateFeatureValue(schema, payload, `feature:${contract.pluginId}:event:${event}`, "output");
				gatewayEvents.emit(event, value, { scope: "operator.read" });
			} };
			if (Object.keys(contract.events).length > 0) api.registerService({
				id: `${contract.pluginId}:feature-events`,
				start(context) {
					gatewayEvents = context.gatewayEvents;
				},
				stop() {
					gatewayEvents = void 0;
				}
			});
			const handlers = definition.setup(api, events);
			for (const [id, operation] of operations) {
				const name = id;
				const handler = handlers[name];
				if (typeof handler !== "function") throw new Error(`Feature operation ${id} is missing its handler`);
				const invoke = async (input, context) => {
					const signal = context.source === "tool" ? context.signal : void 0;
					signal?.throwIfAborted();
					const value = validateFeatureValue(operation.input, input, `feature:${contract.pluginId}:${id}:input`, "input");
					const result = await handler(value, context);
					signal?.throwIfAborted();
					return validateFeatureValue(operation.output, result, `feature:${contract.pluginId}:${id}:output`, "output");
				};
				const requiredScope = operation.kind === "query" ? "operator.read" : "operator.write";
				api.registerSessionAction({
					id,
					description: operation.description,
					schema: operation.input,
					requiredScopes: [requiredScope],
					async handler(action) {
						try {
							return {
								ok: true,
								result: await invoke(action.payload, {
									source: "session-action",
									action,
									api
								})
							};
						} catch (error) {
							if (error instanceof FeatureValidationError) return {
								ok: false,
								error: error.message,
								code: error.code
							};
							throw error;
						}
					}
				});
				if (operation.tool) {
					const tool = operation.tool;
					api.registerTool((toolContext) => ({
						name: tool.name,
						label: tool.label ?? tool.name,
						description: operation.description,
						parameters: operation.input,
						outputSchema: operation.output,
						execute: async (toolCallId, input, signal, onUpdate) => jsonResult(await invoke(input, {
							source: "tool",
							tool: toolContext,
							toolCallId,
							signal,
							onUpdate,
							api
						}))
					}), {
						name: tool.name,
						...tool.optional ? { optional: true } : {}
					});
				}
				const command = definition.commands?.[name];
				if (command) api.registerCommand({
					name: command.name,
					description: command.description ?? operation.description,
					acceptsArgs: true,
					requireAuth: true,
					requiredScopes: [requiredScope],
					async handler(context) {
						const output = await invoke(command.parse(context), {
							source: "command",
							command: context,
							api
						});
						if (command.format) return command.format(output, context);
						return { text: JSON.stringify(output, null, 2) };
					}
				});
			}
		}
	});
	const metadata = {
		id: contract.pluginId,
		name: definition.name,
		description: definition.description,
		activation: { onStartup: true },
		configSchema: entry.configSchema.jsonSchema ?? {
			type: "object",
			additionalProperties: false
		},
		tools: operations.flatMap(([, operation]) => operation.tool ? [{
			name: operation.tool.name,
			label: operation.tool.label ?? operation.tool.name,
			description: operation.description,
			parameters: operation.input,
			outputSchema: operation.output,
			...operation.tool.optional ? { optional: true } : {}
		}] : [])
	};
	Object.defineProperty(entry, toolPluginMetadataSymbol, {
		value: metadata,
		enumerable: false
	});
	return entry;
}
//#endregion
export { defineFeaturePlugin };
