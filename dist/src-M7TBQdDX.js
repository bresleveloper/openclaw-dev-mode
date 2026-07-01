import { Compile } from "typebox/compile";
import { Value } from "typebox/value";
//#region packages/llm-core/src/model-contracts/anthropic.ts
function normalizeClaudeModelId(modelId) {
	const normalized = modelId?.trim().toLowerCase() ?? "";
	return (normalized.startsWith("anthropic/") ? normalized.slice(10) : normalized).replace(/[._\s]+/g, "-");
}
const CLAUDE_FABLE_5_THINKING_PROFILE = {
	levels: [
		{ id: "off" },
		{ id: "minimal" },
		{ id: "low" },
		{ id: "medium" },
		{ id: "high" },
		{ id: "xhigh" },
		{ id: "adaptive" },
		{ id: "max" }
	],
	defaultLevel: "high",
	preserveWhenCatalogReasoningFalse: true
};
/** Resolve the canonical normalized Claude model id for one runtime model ref. */
function resolveClaudeModelIdentity(ref) {
	const normalized = normalizeClaudeModelId((typeof ref.params?.canonicalModelId === "string" ? ref.params.canonicalModelId : void 0) ?? ref.id);
	const match = /(?:^|[-/])claude-/.exec(normalized);
	return match ? normalized.slice((match.index ?? 0) + (match[0].startsWith("claude-") ? 0 : 1)) : normalized;
}
/** Resolve Claude Fable 5 through direct ids, cloud ids, or deployment metadata. */
function resolveClaudeFable5ModelIdentity(ref) {
	const normalized = resolveClaudeModelIdentity(ref);
	const match = /(?:^|-)claude-fable-5(?=$|[^a-z0-9])/.exec(normalized);
	if (!match) return;
	return normalized.slice((match.index ?? 0) + (match[0].startsWith("-") ? 1 : 0));
}
/** Return whether a Claude model supports adaptive thinking. */
function supportsClaudeAdaptiveThinking(ref) {
	const modelId = resolveClaudeModelIdentity(ref);
	return /(?:^|-)claude-(?:fable-5|mythos-preview|opus-4-(?:6|7|8)|sonnet-4-6)(?=$|[^a-z0-9])/.test(modelId);
}
/** Return whether a Claude model supports native max effort. */
function supportsClaudeNativeMaxEffort(ref) {
	const modelId = resolveClaudeModelIdentity(ref);
	return /(?:^|-)claude-(?:fable-5|opus-4-(?:6|7|8)|sonnet-4-6)(?=$|[^a-z0-9])/.test(modelId);
}
/** Return whether a Claude model supports native xhigh effort. */
function supportsClaudeNativeXhighEffort(ref) {
	const modelId = resolveClaudeModelIdentity(ref);
	return /(?:^|-)claude-(?:fable-5|opus-4-(?:7|8))(?=$|[^a-z0-9])/.test(modelId);
}
/**
* Fill native Claude effort mappings only when the provider did not publish a
* narrower route-specific contract.
*/
function resolveClaudeNativeThinkingLevelMap(ref) {
	if (ref.thinkingLevelMap !== void 0) return ref.thinkingLevelMap;
	if (!supportsClaudeNativeMaxEffort(ref)) return;
	return {
		xhigh: supportsClaudeNativeXhighEffort(ref) ? "xhigh" : null,
		max: "max"
	};
}
//#endregion
//#region packages/llm-core/src/utils/diagnostics.ts
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
//#endregion
//#region packages/llm-core/src/validation.ts
const validatorCache = /* @__PURE__ */ new WeakMap();
const TYPEBOX_KIND = Symbol.for("TypeBox.Kind");
function isRecord(value) {
	return typeof value === "object" && value !== null;
}
function isJsonSchemaObject(value) {
	return isRecord(value);
}
function hasTypeBoxMetadata(schema) {
	return isRecord(schema) && Object.getOwnPropertySymbols(schema).includes(TYPEBOX_KIND);
}
function getSchemaTypes(schema) {
	if (typeof schema.type === "string") return [schema.type];
	if (Array.isArray(schema.type)) return schema.type.filter((type) => typeof type === "string");
	return [];
}
function matchesJsonType(value, type) {
	switch (type) {
		case "number": return typeof value === "number";
		case "integer": return typeof value === "number" && Number.isInteger(value);
		case "boolean": return typeof value === "boolean";
		case "string": return typeof value === "string";
		case "null": return value === null;
		case "array": return Array.isArray(value);
		case "object": return isRecord(value) && !Array.isArray(value);
		default: return false;
	}
}
function isValidatorSchema(value) {
	return isRecord(value);
}
const JSON_NUMBER_TOKEN_RE = /^[+-]?(?:(?:\d+\.?\d*)|(?:\.\d+))(?:e[+-]?\d+)?$/iu;
function parseJsonNumberString(value) {
	const trimmed = value.trim();
	if (!trimmed || !JSON_NUMBER_TOKEN_RE.test(trimmed)) return;
	const parsed = Number(trimmed);
	return Number.isFinite(parsed) ? parsed : void 0;
}
function parseJsonIntegerString(value) {
	const parsed = parseJsonNumberString(value);
	return parsed !== void 0 && Number.isSafeInteger(parsed) ? parsed : void 0;
}
function getSubSchemaValidator(schema) {
	if (!isValidatorSchema(schema)) return;
	try {
		return getValidator(schema);
	} catch {
		return;
	}
}
function coercePrimitiveByType(value, type) {
	switch (type) {
		case "number":
			if (value === null) return 0;
			if (typeof value === "string" && value.trim() !== "") {
				const parsed = parseJsonNumberString(value);
				if (parsed !== void 0) return parsed;
			}
			if (typeof value === "boolean") return value ? 1 : 0;
			return value;
		case "integer":
			if (value === null) return 0;
			if (typeof value === "string" && value.trim() !== "") {
				const parsed = parseJsonIntegerString(value);
				if (parsed !== void 0) return parsed;
			}
			if (typeof value === "boolean") return value ? 1 : 0;
			return value;
		case "boolean":
			if (value === null) return false;
			if (typeof value === "string") {
				if (value === "true") return true;
				if (value === "false") return false;
			}
			if (typeof value === "number") {
				if (value === 1) return true;
				if (value === 0) return false;
			}
			return value;
		case "string":
			if (value === null) return "";
			if (typeof value === "number" || typeof value === "boolean") return String(value);
			return value;
		case "null":
			if (value === "" || value === 0 || value === false) return null;
			return value;
		default: return value;
	}
}
function applySchemaObjectCoercion(value, schema) {
	const properties = schema.properties;
	const definedKeys = new Set(properties ? Object.keys(properties) : []);
	if (properties) {
		for (const [key, propertySchema] of Object.entries(properties)) if (key in value) value[key] = coerceWithJsonSchema(value[key], propertySchema);
	}
	if (schema.additionalProperties && isJsonSchemaObject(schema.additionalProperties)) {
		for (const [key, propertyValue] of Object.entries(value)) if (!definedKeys.has(key)) value[key] = coerceWithJsonSchema(propertyValue, schema.additionalProperties);
	}
}
function applySchemaArrayCoercion(value, schema) {
	if (Array.isArray(schema.items)) {
		for (let index = 0; index < value.length; index++) {
			const itemSchema = schema.items[index];
			if (itemSchema) value[index] = coerceWithJsonSchema(value[index], itemSchema);
		}
		return;
	}
	if (isJsonSchemaObject(schema.items)) for (let index = 0; index < value.length; index++) value[index] = coerceWithJsonSchema(value[index], schema.items);
}
function coerceWithUnionSchema(value, schemas) {
	for (const schema of schemas) {
		const coerced = coerceWithJsonSchema(structuredClone(value), schema);
		if (getSubSchemaValidator(schema)?.Check(coerced)) return coerced;
	}
	return value;
}
function coerceWithJsonSchema(value, schema) {
	let nextValue = value;
	if (Array.isArray(schema.allOf)) for (const nested of schema.allOf) nextValue = coerceWithJsonSchema(nextValue, nested);
	if (Array.isArray(schema.anyOf)) nextValue = coerceWithUnionSchema(nextValue, schema.anyOf);
	if (Array.isArray(schema.oneOf)) nextValue = coerceWithUnionSchema(nextValue, schema.oneOf);
	const schemaTypes = getSchemaTypes(schema);
	const matchesUnionMember = schemaTypes.length > 1 && schemaTypes.some((schemaType) => matchesJsonType(nextValue, schemaType));
	if (schemaTypes.length > 0 && !matchesUnionMember) for (const schemaType of schemaTypes) {
		const candidate = coercePrimitiveByType(nextValue, schemaType);
		if (candidate !== nextValue) {
			nextValue = candidate;
			break;
		}
	}
	if (schemaTypes.includes("object") && isRecord(nextValue) && !Array.isArray(nextValue)) applySchemaObjectCoercion(nextValue, schema);
	if (schemaTypes.includes("array") && Array.isArray(nextValue)) applySchemaArrayCoercion(nextValue, schema);
	return nextValue;
}
function getValidator(schema) {
	const key = schema;
	const cached = validatorCache.get(key);
	if (cached) return cached;
	const validator = Compile(schema);
	validatorCache.set(key, validator);
	return validator;
}
function formatValidationPath(error) {
	if (error.keyword === "required") {
		const requiredProperty = error.params.requiredProperties?.[0];
		if (requiredProperty) {
			const basePath = error.instancePath.replace(/^\//, "").replace(/\//g, ".");
			return basePath ? `${basePath}.${requiredProperty}` : requiredProperty;
		}
	}
	return error.instancePath.replace(/^\//, "").replace(/\//g, ".") || "root";
}
/** Finds the target tool and validates/coerces a model-emitted tool call. */
function validateToolCall(tools, toolCall) {
	const tool = tools.find((t) => t.name === toolCall.name);
	if (!tool) throw new Error(`Tool "${toolCall.name}" not found`);
	return validateToolArguments(tool, toolCall);
}
/** Validates tool arguments against TypeBox or plain JSON-schema parameters. */
function validateToolArguments(tool, toolCall) {
	const args = structuredClone(toolCall.arguments);
	Value.Convert(tool.parameters, args);
	const validator = getValidator(tool.parameters);
	if (!hasTypeBoxMetadata(tool.parameters) && isJsonSchemaObject(tool.parameters)) {
		const coerced = coerceWithJsonSchema(args, tool.parameters);
		if (coerced !== args) if (isRecord(args) && isRecord(coerced)) {
			for (const key of Object.keys(args)) delete args[key];
			Object.assign(args, coerced);
		} else return validator.Check(coerced) ? coerced : args;
	}
	if (validator.Check(args)) return args;
	const errors = validator.Errors(args).map((error) => `  - ${formatValidationPath(error)}: ${error.message}`).join("\n") || "Unknown validation error";
	throw new Error(`Validation failed for tool "${toolCall.name}":\n${errors}\n\nReceived arguments:\n${JSON.stringify(toolCall.arguments, null, 2)}`);
}
//#endregion
export { formatThrownValue as a, resolveClaudeModelIdentity as c, supportsClaudeNativeMaxEffort as d, supportsClaudeNativeXhighEffort as f, createAssistantMessageDiagnostic as i, resolveClaudeNativeThinkingLevelMap as l, validateToolCall as n, CLAUDE_FABLE_5_THINKING_PROFILE as o, appendAssistantMessageDiagnostic as r, resolveClaudeFable5ModelIdentity as s, validateToolArguments as t, supportsClaudeAdaptiveThinking as u };
