import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { i as logWarn } from "./logger-BHMMVs5C.mjs";
import { isDeepStrictEqual } from "node:util";
//#region src/gateway/mcp-http.schema.ts
const MCP_LOOPBACK_LOG_PREFIX = "mcp-loopback";
function readLoopbackToolField(tool, key) {
	try {
		return tool[key];
	} catch {
		return;
	}
}
/** Safely reads and normalizes a loopback tool name from plugin-provided tool objects. */
function readMcpLoopbackToolName(tool) {
	const value = readLoopbackToolField(tool, "name");
	if (typeof value !== "string") return;
	return value.trim() || void 0;
}
function readLoopbackToolDescription(tool) {
	const value = readLoopbackToolField(tool, "description");
	return typeof value === "string" ? value : void 0;
}
function readLoopbackToolParameters(tool) {
	let value;
	try {
		value = tool.parameters;
	} catch {
		return;
	}
	if (!isRecord(value)) return {};
	try {
		return { ...value };
	} catch {
		return;
	}
}
function readLiteralSchemaValues(schema) {
	const enumValues = Array.isArray(schema.enum) ? schema.enum : void 0;
	if (Object.hasOwn(schema, "const")) {
		if (!enumValues) return [schema.const];
		return enumValues.some((value) => isDeepStrictEqual(value, schema.const)) ? [schema.const] : [];
	}
	return enumValues;
}
function uniqueLiteralValues(values) {
	return values.filter((value, index) => values.findIndex((candidate) => isDeepStrictEqual(candidate, value)) === index);
}
const SCHEMA_ANNOTATION_KEYS = /* @__PURE__ */ new Set([
	"$comment",
	"default",
	"deprecated",
	"description",
	"example",
	"examples",
	"readOnly",
	"title",
	"writeOnly"
]);
function readLiteralValidationConstraints(schema) {
	return Object.fromEntries(Object.entries(schema).filter(([key]) => key !== "const" && key !== "enum" && !SCHEMA_ANNOTATION_KEYS.has(key)));
}
function mergeLiteralSchemas(existing, incoming) {
	const existingValues = readLiteralSchemaValues(existing);
	const incomingValues = readLiteralSchemaValues(incoming);
	if (existingValues === void 0 || incomingValues === void 0) return;
	const existingConstraints = readLiteralValidationConstraints(existing);
	const incomingConstraints = readLiteralValidationConstraints(incoming);
	if (!isDeepStrictEqual(existingConstraints, incomingConstraints)) return;
	const values = uniqueLiteralValues([...existingValues, ...incomingValues]);
	if (values.length === 0) return;
	const merged = {
		...existing,
		enum: values
	};
	delete merged.const;
	return merged;
}
function flattenUnionSchema(raw, toolName) {
	const variants = raw.anyOf ?? raw.oneOf;
	if (!Array.isArray(variants) || variants.length === 0) return raw;
	const mergedProps = Object.create(null);
	const requiredSets = [];
	for (const variant of variants) {
		if (variant === true) {
			requiredSets.push(/* @__PURE__ */ new Set());
			continue;
		}
		if (!isRecord(variant)) continue;
		const props = isRecord(variant.properties) ? variant.properties : void 0;
		if (props) for (const [key, schema] of Object.entries(props)) {
			if (!isPropertySchema(schema)) {
				warnSchemaOnce(`${MCP_LOOPBACK_LOG_PREFIX}: malformed schema definition for "${toolName}.${key}", ignoring that variant`);
				continue;
			}
			if (!Object.hasOwn(mergedProps, key)) {
				mergedProps[key] = schema;
				continue;
			}
			const existing = mergedProps[key];
			const incoming = schema;
			if (existing === true || incoming === true) {
				mergedProps[key] = true;
				continue;
			}
			if (existing === false) {
				mergedProps[key] = incoming;
				continue;
			}
			if (incoming === false) continue;
			if (areSchemaValuesEquivalent(existing, incoming)) continue;
			if (!isRecord(existing) || !isRecord(incoming)) {
				if (existing !== incoming) warnSchemaOnce(`${MCP_LOOPBACK_LOG_PREFIX}: conflicting schema definitions for "${toolName}.${key}", keeping the first variant`);
				continue;
			}
			if (isDeepStrictEqual(existing, incoming)) continue;
			const mergedLiterals = mergeLiteralSchemas(existing, incoming);
			if (mergedLiterals) {
				mergedProps[key] = mergedLiterals;
				continue;
			}
			warnSchemaOnce(`${MCP_LOOPBACK_LOG_PREFIX}: conflicting schema definitions for "${toolName}.${key}", keeping the first variant`);
		}
		requiredSets.push(new Set(Array.isArray(variant.required) ? variant.required : []));
	}
	const required = requiredSets.length > 0 ? [...requiredSets[0] ?? []].filter((key) => Object.hasOwn(mergedProps, key) && requiredSets.every((set) => set.has(key))) : [];
	const { anyOf: _anyOf, oneOf: _oneOf, ...rest } = raw;
	return {
		...rest,
		type: "object",
		properties: mergedProps,
		required
	};
}
function isPropertySchema(value) {
	return typeof value === "boolean" || isRecord(value);
}
function rememberSchemaPair(left, right, seen) {
	const existing = seen.get(left);
	if (existing?.has(right)) return true;
	const next = existing ?? /* @__PURE__ */ new WeakSet();
	next.add(right);
	if (!existing) seen.set(left, next);
	return false;
}
function areSchemaValuesEquivalent(left, right, seen = /* @__PURE__ */ new WeakMap()) {
	if (Object.is(left, right)) return true;
	if (Array.isArray(left) || Array.isArray(right)) {
		if (!Array.isArray(left) || !Array.isArray(right) || left.length !== right.length) return false;
		if (rememberSchemaPair(left, right, seen)) return true;
		return left.every((value, index) => areSchemaValuesEquivalent(value, right[index], seen));
	}
	if (!isRecord(left) || !isRecord(right)) return false;
	if (rememberSchemaPair(left, right, seen)) return true;
	const leftKeys = Object.keys(left).toSorted();
	const rightKeys = Object.keys(right).toSorted();
	if (leftKeys.length !== rightKeys.length) return false;
	return leftKeys.every((key, index) => key === rightKeys[index] && areSchemaValuesEquivalent(left[key], right[key], seen));
}
const emittedSchemaWarnings = /* @__PURE__ */ new Set();
function warnSchemaOnce(message) {
	if (emittedSchemaWarnings.has(message)) return;
	emittedSchemaWarnings.add(message);
	logWarn(message);
}
/** Builds MCP-compatible tool schemas for loopback-visible gateway tools. */
function buildMcpToolSchema(tools) {
	return tools.flatMap((tool) => {
		const name = readMcpLoopbackToolName(tool);
		if (!name) return [];
		let raw = readLoopbackToolParameters(tool);
		if (!raw) return [];
		if (raw.anyOf || raw.oneOf) raw = flattenUnionSchema(raw, name);
		if (raw.type !== "object") raw.type = "object";
		if (!raw.properties) raw.properties = {};
		return {
			name,
			description: readLoopbackToolDescription(tool),
			inputSchema: raw
		};
	});
}
//#endregion
export { readMcpLoopbackToolName as n, buildMcpToolSchema as t };
