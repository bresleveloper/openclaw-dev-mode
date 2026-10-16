import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { Guard } from "typebox/guard";
import { Check } from "typebox/schema";
//#region packages/normalization-core/src/json-schema.ts
/** Decode a local URI fragment before recognizing or splitting its JSON Pointer. */
function decodeLocalSchemaRefFragment(ref) {
	if (!ref.startsWith("#")) return;
	try {
		return decodeURIComponent(ref.slice(1));
	} catch {
		return;
	}
}
function decodeJsonPointerSegment(segment) {
	return segment.replaceAll("~1", "/").replaceAll("~0", "~");
}
/** Encoded slashes separate tokens; ~1 remains inside a single token. */
function parseLocalSchemaRefPointer(ref) {
	const fragment = decodeLocalSchemaRefFragment(ref);
	return fragment?.startsWith("/") ? fragment.slice(1).split("/").map(decodeJsonPointerSegment) : void 0;
}
/** Remove complete false-schema child groups immediately preceding their aggregate. */
function normalizeTypeBoxValidationErrors(errors) {
	const normalized = [];
	let consecutiveBooleanErrors = 0;
	for (const error of errors) {
		if (error.keyword === "boolean") {
			normalized.push(error);
			consecutiveBooleanErrors += 1;
			continue;
		}
		const properties = error.params?.additionalProperties;
		if (error.keyword === "additionalProperties" && typeof error.schemaPath === "string" && typeof error.instancePath === "string" && Array.isArray(properties) && properties.length > 0 && properties.length <= consecutiveBooleanErrors) {
			if (normalized.slice(-properties.length).every((child, index) => {
				const property = properties[index];
				return typeof property === "string" && child.schemaPath === `${error.schemaPath}/additionalProperties` && child.instancePath === `${error.instancePath}/${property.replace(/~/g, "~0").replace(/\//g, "~1")}`;
			})) normalized.length -= properties.length;
		}
		normalized.push(error);
		consecutiveBooleanErrors = 0;
	}
	return normalized;
}
const schemaMapKeywords = /* @__PURE__ */ new Set([
	"$defs",
	"definitions",
	"dependentSchemas",
	"dependencies",
	"patternProperties",
	"properties"
]);
const schemaValueKeywords = /* @__PURE__ */ new Set([
	"additionalItems",
	"additionalProperties",
	"allOf",
	"anyOf",
	"contains",
	"else",
	"if",
	"items",
	"not",
	"oneOf",
	"prefixItems",
	"propertyNames",
	"then",
	"unevaluatedItems",
	"unevaluatedProperties"
]);
const schemaResourceKeywords = /* @__PURE__ */ new Set([
	"$anchor",
	"$defs",
	"$dynamicAnchor",
	"$id",
	"$recursiveAnchor",
	"$schema",
	"$vocabulary",
	"definitions"
]);
function normalizeSchemaMap(value, options, preserveStringArrays) {
	if (!isRecord(value)) return value;
	return Object.fromEntries(Object.entries(value).map(([key, entry]) => [key, preserveStringArrays && isStringArray(entry) ? entry : normalizeJsonSchemaNode(entry, options)]));
}
function compilesUnicodePattern(pattern) {
	try {
		new RegExp(pattern, "u");
		return true;
	} catch {
		return false;
	}
}
function repairJsonSchemaPatternForUnicodeRegExp(pattern) {
	if (compilesUnicodePattern(pattern)) return pattern;
	const repaired = pattern.replace(/\\([^\\])/g, (match, ch) => {
		if (ch === ":" || ch === "/") return ch;
		return match;
	});
	return compilesUnicodePattern(repaired) ? repaired : pattern;
}
function normalizePatternProperties(value, options) {
	const normalized = /* @__PURE__ */ new Map();
	for (const [pattern, propertySchema] of Object.entries(value)) {
		const repairedPattern = repairJsonSchemaPatternForUnicodeRegExp(pattern);
		const repairedSchema = normalizeJsonSchemaNode(propertySchema, options);
		const existingSchema = normalized.get(repairedPattern);
		normalized.set(repairedPattern, existingSchema === void 0 ? repairedSchema : { allOf: [existingSchema, repairedSchema] });
	}
	return Object.fromEntries(normalized);
}
function expandJsonSchemaTypeArray(schema) {
	const { nullable, type, ...rest } = schema;
	const types = Array.isArray(type) ? [...type] : typeof type === "string" ? [type] : null;
	if (!types) return schema;
	if (nullable === true && !types.includes("null")) types.push("null");
	if (types.length === 1 && !Array.isArray(type)) return schema;
	const entries = Object.entries(rest);
	const resourceEntries = entries.filter(([key]) => schemaResourceKeywords.has(key));
	const branch = Object.fromEntries(entries.filter(([key]) => !schemaResourceKeywords.has(key)));
	return {
		...Object.fromEntries(resourceEntries),
		anyOf: types.map((entry) => Object.assign({}, branch, { type: entry }))
	};
}
function normalizeAdditionalPropertiesSchema(schema) {
	if (!isRecord(schema.additionalProperties) || isRecord(schema.properties) || isRecord(schema.patternProperties)) return schema;
	const { additionalProperties, ...rest } = schema;
	return {
		...rest,
		patternProperties: { ".*": additionalProperties },
		additionalProperties: false
	};
}
function normalizeJsonSchemaNode(schema, options) {
	if (Array.isArray(schema)) return schema.map((entry) => normalizeJsonSchemaNode(entry, options));
	if (!isRecord(schema)) return schema;
	const normalizedSchema = normalizeAdditionalPropertiesSchema(expandJsonSchemaTypeArray(schema.nullable === true && schema.enumIncludesNull === true && Array.isArray(schema.enum) && !schema.enum.some((entry) => entry === null) ? {
		...schema,
		enum: [...schema.enum, null]
	} : schema));
	return Object.fromEntries(Object.entries(normalizedSchema).filter(([key]) => key !== "format" || options.format !== "annotation").map(([key, value]) => {
		if (key === "$dynamicRef" && normalizedSchema.$ref === void 0) return ["$ref", value];
		if (key === "pattern" && typeof value === "string") return [key, repairJsonSchemaPatternForUnicodeRegExp(value)];
		if (key === "patternProperties" && isRecord(value)) return [key, normalizePatternProperties(value, options)];
		if (schemaMapKeywords.has(key)) return [key, normalizeSchemaMap(value, options, key === "dependencies")];
		if (schemaValueKeywords.has(key)) return [key, normalizeJsonSchemaNode(value, options)];
		return [key, value];
	}));
}
function isStringArray(value) {
	return Array.isArray(value) && value.every((entry) => typeof entry === "string");
}
function isJsonValue(value, active = /* @__PURE__ */ new WeakSet(), complete = /* @__PURE__ */ new WeakSet()) {
	if (value === null || typeof value === "string" || typeof value === "boolean") return true;
	if (typeof value === "number") return Number.isFinite(value);
	if (typeof value !== "object") return false;
	let entries;
	try {
		if (Array.isArray(value)) {
			const ownKeys = Reflect.ownKeys(value);
			if (ownKeys.length !== value.length + 1 || ownKeys.some((key) => {
				if (key === "length") return false;
				if (typeof key !== "string") return true;
				const index = Number(key);
				return !Number.isSafeInteger(index) || index < 0 || index >= value.length || String(index) !== key;
			})) return false;
			entries = value;
		} else {
			const prototype = Object.getPrototypeOf(value);
			if (prototype !== Object.prototype && prototype !== null) return false;
			if (Reflect.ownKeys(value).some((key) => typeof key !== "string" || !Object.prototype.propertyIsEnumerable.call(value, key))) return false;
			entries = Object.values(value);
		}
	} catch {
		return false;
	}
	if (complete.has(value)) return true;
	if (active.has(value)) return false;
	active.add(value);
	const valid = entries.every((entry) => isJsonValue(entry, active, complete));
	active.delete(value);
	if (valid) complete.add(value);
	return valid;
}
/** Normalize JSON Schema constructs into the TypeBox runtime subset used by validators. */
function normalizeJsonSchemaForTypeBox(schema, options = {}) {
	return normalizeJsonSchemaNode(schema, options);
}
/** Compare acyclic JSON values using the same equality semantics as TypeBox. */
function jsonSchemaValuesEqual(left, right) {
	if (!isJsonValue(left) || !isJsonValue(right)) return false;
	try {
		return Guard.IsDeepEqual(left, right);
	} catch {
		return false;
	}
}
/** Validate an acyclic JSON value against the canonical normalized schema. */
function isJsonSchemaValueValid(schema, value) {
	if (!isJsonValue(value)) return false;
	try {
		return Check(normalizeJsonSchemaForTypeBox(schema), value);
	} catch {
		return false;
	}
}
//#endregion
export { normalizeJsonSchemaForTypeBox as a, jsonSchemaValuesEqual as i, decodeLocalSchemaRefFragment as n, normalizeTypeBoxValidationErrors as o, isJsonSchemaValueValid as r, parseLocalSchemaRefPointer as s, decodeJsonPointerSegment as t };
