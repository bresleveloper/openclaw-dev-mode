import { x as parseStrictFiniteNumber } from "./number-coercion-CuVhdCBs.mjs";
import { s as parseLocalSchemaRefPointer } from "./json-schema-BLReYZIW.mjs";
import { Pointer } from "typebox/schema";
import { Compile as Compile$1 } from "typebox/compile";
//#region packages/llm-core/src/validation.ts
const validatorCache = /* @__PURE__ */ new WeakMap();
/** Maximum string length accepted for schema-gated JSON coercion. */
const MAX_JSON_COERCE_LENGTH = 65536;
function isObjectBackedRecord(value) {
	return typeof value === "object" && value !== null;
}
function isJsonSchemaObject(value) {
	return isObjectBackedRecord(value);
}
function hasSchemaScope(schema) {
	return [
		"$id",
		"id",
		"$defs",
		"definitions"
	].some((key) => key in schema);
}
function resolveRootSchemaRef(schema, root) {
	const tokens = typeof schema.$ref === "string" ? parseLocalSchemaRefPointer(schema.$ref) : void 0;
	const [tableName, name] = tokens ?? [];
	if (!root || tokens?.length !== 2 || tableName !== "$defs" && tableName !== "definitions" || !name || hasSchemaScope(schema)) return;
	const table = tableName === "$defs" ? root.$defs : root.definitions;
	const target = table && Object.hasOwn(table, name) ? table[name] : void 0;
	return isJsonSchemaObject(target) && !hasSchemaScope(target) ? target : void 0;
}
function getSchemaTypes(initialSchema, root) {
	let schema = initialSchema;
	const seen = /* @__PURE__ */ new Set();
	while (schema.type === void 0 && !seen.has(schema)) {
		seen.add(schema);
		const target = resolveRootSchemaRef(schema, root);
		if (!target) break;
		schema = target;
	}
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
		case "object": return isObjectBackedRecord(value) && !Array.isArray(value);
		default: return false;
	}
}
function isValidatorSchema(value) {
	return isObjectBackedRecord(value);
}
function getSubSchemaValidator(schema, root) {
	if (!isValidatorSchema(schema)) return;
	try {
		return getValidator(schema, hasSchemaScope(schema) ? void 0 : root);
	} catch {
		return;
	}
}
function coercePrimitiveByType(value, type) {
	switch (type) {
		case "number":
		case "integer":
			if (value === null) return 0;
			if (typeof value === "string") {
				const parsed = parseStrictFiniteNumber(value);
				if (parsed !== void 0 && (type === "number" || Number.isSafeInteger(parsed))) return parsed;
			}
			if (typeof value === "boolean") return value ? 1 : 0;
			return value;
		case "boolean":
			if (value === null || value === "false" || value === 0) return false;
			if (value === "true" || value === 1) return true;
			return value;
		case "string":
			if (value === null) return "";
			if (typeof value === "number" || typeof value === "boolean") return String(value);
			return value;
		case "array":
		case "object":
			if (typeof value === "string" && value.trim() !== "" && value.length <= MAX_JSON_COERCE_LENGTH) try {
				const parsed = JSON.parse(value);
				if (matchesJsonType(parsed, type)) return parsed;
			} catch {}
			return value;
		case "null":
			if (value === "" || value === 0 || value === false) return null;
			return value;
		default: return value;
	}
}
function applySchemaObjectCoercion(value, schema, root) {
	const properties = schema.properties;
	const propertyKeys = properties ? Object.keys(properties) : [];
	if (properties) {
		for (const [key, propertySchema] of Object.entries(properties)) if (key in value) value[key] = coerceWithJsonSchema(value[key], propertySchema, root);
	}
	if (schema.additionalProperties && isJsonSchemaObject(schema.additionalProperties)) {
		const definedKeys = new Set(propertyKeys);
		for (const [key, propertyValue] of Object.entries(value)) if (!definedKeys.has(key)) value[key] = coerceWithJsonSchema(propertyValue, schema.additionalProperties, root);
	}
}
function applySchemaArrayCoercion(value, schema, root) {
	const items = schema.items;
	if (!isJsonSchemaObject(items)) return;
	for (let index = 0; index < value.length; index++) {
		const itemSchema = Array.isArray(items) ? items[index] : items;
		if (itemSchema) value[index] = coerceWithJsonSchema(value[index], itemSchema, root);
	}
}
function coerceWithUnionSchema(value, schemas, root, refs) {
	if (value === null) {
		for (const schema of schemas) if (getSchemaTypes(schema, root).includes("null")) {
			const validator = getSubSchemaValidator(schema, root);
			if (!validator || validator.Check(value)) return value;
		}
	}
	for (const schema of schemas) {
		const types = getSchemaTypes(schema, root);
		if (value !== null && types.length === 1 && types[0] === "null") continue;
		const coerced = coerceWithJsonSchema(structuredClone(value), schema, root, refs);
		if (getSubSchemaValidator(schema, root)?.Check(coerced)) return coerced;
	}
	return value;
}
function coerceWithJsonSchema(value, schema, contextRoot, refs) {
	if (!isJsonSchemaObject(schema)) return value;
	const root = "$id" in schema || "id" in schema || schema !== contextRoot && hasSchemaScope(schema) ? void 0 : contextRoot;
	let nextValue = value;
	const target = resolveRootSchemaRef(schema, root);
	if (target && !refs?.has(target)) {
		const nextRefs = new Set(refs);
		nextRefs.add(target);
		nextValue = coerceWithJsonSchema(nextValue, target, root, nextRefs);
	}
	if (Array.isArray(schema.allOf)) for (const nested of schema.allOf) nextValue = coerceWithJsonSchema(nextValue, nested, root, refs);
	if (Array.isArray(schema.anyOf)) nextValue = coerceWithUnionSchema(nextValue, schema.anyOf, root, refs);
	if (Array.isArray(schema.oneOf)) nextValue = coerceWithUnionSchema(nextValue, schema.oneOf, root, refs);
	const schemaTypes = getSchemaTypes(schema, root);
	const matchesUnionMember = schemaTypes.length > 1 && schemaTypes.some((schemaType) => matchesJsonType(nextValue, schemaType));
	if (schemaTypes.length > 0 && !matchesUnionMember) for (const schemaType of schemaTypes) {
		if (schemaType === "null" && nextValue !== null && schemaTypes.length > 1) continue;
		const candidate = coercePrimitiveByType(nextValue, schemaType);
		if (candidate !== nextValue) {
			nextValue = candidate;
			break;
		}
	}
	if (schemaTypes.includes("object") && isObjectBackedRecord(nextValue) && !Array.isArray(nextValue)) applySchemaObjectCoercion(nextValue, schema, root);
	if (schemaTypes.includes("array") && Array.isArray(nextValue)) applySchemaArrayCoercion(nextValue, schema, root);
	return nextValue;
}
function getValidator(schema, root) {
	const scope = root ?? schema;
	let validators = validatorCache.get(scope);
	const cached = validators?.get(schema);
	if (cached) return cached;
	const validator = Compile$1(root && root !== schema ? {
		$defs: root.$defs,
		definitions: root.definitions,
		allOf: [schema]
	} : schema);
	if (!validators) {
		validators = /* @__PURE__ */ new WeakMap();
		validatorCache.set(scope, validators);
	}
	validators.set(schema, validator);
	return validator;
}
function formatValidationPath(error) {
	const path = Pointer.Indices(error.instancePath).join(".").replace(/\//g, ".");
	if (error.keyword === "required") {
		const requiredProperty = error.params.requiredProperties?.[0];
		if (requiredProperty) return path ? `${path}.${requiredProperty}` : requiredProperty;
	}
	return path || "root";
}
/** Finds the target tool and validates/coerces a model-emitted tool call. */
function validateToolCall(tools, toolCall) {
	const tool = tools.find((t) => t.name === toolCall.name);
	if (!tool) throw new Error(`Tool "${toolCall.name}" not found`);
	return validateToolArguments(tool, toolCall);
}
function introducesNullValue(previous, converted) {
	if (converted === null) return previous !== null;
	if (!isObjectBackedRecord(previous) || !isObjectBackedRecord(converted)) return false;
	return Object.entries(converted).some(([key, value]) => introducesNullValue(previous[key], value));
}
/** Validates tool arguments against TypeBox or plain JSON-schema parameters. */
function validateToolArguments(tool, toolCall) {
	const args = structuredClone(toolCall.arguments);
	const validator = getValidator(tool.parameters);
	if (isJsonSchemaObject(tool.parameters)) {
		const coerced = coerceWithJsonSchema(args, tool.parameters, tool.parameters);
		if (coerced !== args) {
			if (isObjectBackedRecord(args) && isObjectBackedRecord(coerced)) {
				for (const key of Object.keys(args)) delete args[key];
				Object.assign(args, coerced);
			} else return validator.Check(coerced) ? coerced : args;
		}
	}
	if (validator.Check(args)) return args;
	const converted = validator.Convert(structuredClone(args));
	if (!introducesNullValue(args, converted) && validator.Check(converted)) return converted;
	const errors = validator.Errors(args).map((error) => `  - ${formatValidationPath(error)}: ${error.message}`).join("\n") || "Unknown validation error";
	throw new Error(`Validation failed for tool "${toolCall.name}":\n${errors}\n\nReceived arguments:\n${JSON.stringify(toolCall.arguments, null, 2)}`);
}
//#endregion
export { validateToolCall as n, validateToolArguments as t };
