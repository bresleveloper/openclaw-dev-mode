import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { i as logWarn } from "./logger-DskmrSVa.mjs";
import { t as mergeLiteralSchemas } from "./json-schema-literals-CTM-h34e.mjs";
//#region src/gateway/mcp-http.schema.ts
const MCP_LOOPBACK_LOG_PREFIX = "mcp-loopback";
function readLoopbackToolField(tool, key) {
	try {
		return tool[key];
	} catch {
		return;
	}
}
function readMcpLoopbackToolName(tool) {
	return normalizeOptionalString(readLoopbackToolField(tool, "name"));
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
			if (existing === true || schema === true) {
				mergedProps[key] = true;
				continue;
			}
			if (existing === false) {
				mergedProps[key] = schema;
				continue;
			}
			if (schema === false) continue;
			if (areSchemaValuesEquivalent(existing, schema)) continue;
			const mergedLiterals = mergeLiteralSchemas(existing, schema);
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
