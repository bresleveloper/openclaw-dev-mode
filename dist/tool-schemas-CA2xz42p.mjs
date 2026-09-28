import { a as asOptionalRecord } from "./record-coerce-DItp3I4t.mjs";
import "./string-coerce-runtime-C_MKhRVt.mjs";
import { c as findUnsupportedSchemaKeywords } from "./provider-tools-BDV45rRZ.mjs";
//#region extensions/clawrouter/tool-schemas.ts
const PERPLEXITY_UNSUPPORTED_SCHEMA_KEYWORDS = /* @__PURE__ */ new Set(["patternProperties", "additionalProperties"]);
const SCHEMA_MAP_KEYS = /* @__PURE__ */ new Set([
	"properties",
	"$defs",
	"definitions",
	"dependentSchemas",
	"dependencies"
]);
const SCHEMA_VALUE_KEYS = /* @__PURE__ */ new Set([
	"items",
	"additionalItems",
	"prefixItems",
	"anyOf",
	"oneOf",
	"allOf",
	"then",
	"else",
	"if",
	"not",
	"contains",
	"propertyNames",
	"unevaluatedItems",
	"unevaluatedProperties",
	"contentSchema"
]);
function isObjectType(type) {
	return type === "object" || Array.isArray(type) && type.includes("object");
}
function normalizeSchemaMap(value) {
	const record = asOptionalRecord(value);
	if (!record) return value;
	return Object.fromEntries(Object.entries(record).map(([key, schema]) => [key, normalizePerplexitySchema(schema)]));
}
function normalizePerplexitySchema(value) {
	if (Array.isArray(value)) return value.map(normalizePerplexitySchema);
	const record = asOptionalRecord(value);
	if (!record) return value;
	const normalized = {};
	for (const [key, child] of Object.entries(record)) {
		if (PERPLEXITY_UNSUPPORTED_SCHEMA_KEYWORDS.has(key)) continue;
		normalized[key] = SCHEMA_MAP_KEYS.has(key) ? normalizeSchemaMap(child) : SCHEMA_VALUE_KEYS.has(key) ? normalizePerplexitySchema(child) : child;
	}
	if (isObjectType(normalized.type) && !("properties" in normalized)) normalized.properties = {};
	return normalized;
}
function findObjectSchemasMissingProperties(schema, path) {
	if (Array.isArray(schema)) return schema.flatMap((child, index) => findObjectSchemasMissingProperties(child, `${path}[${index}]`));
	const record = asOptionalRecord(schema);
	if (!record) return [];
	const violations = isObjectType(record.type) && !("properties" in record) ? [`${path}.properties`] : [];
	for (const [key, child] of Object.entries(record)) {
		if (SCHEMA_MAP_KEYS.has(key)) {
			const schemas = asOptionalRecord(child);
			if (schemas) for (const [name, nestedSchema] of Object.entries(schemas)) violations.push(...findObjectSchemasMissingProperties(nestedSchema, `${path}.${key}.${name}`));
			continue;
		}
		if (SCHEMA_VALUE_KEYS.has(key)) violations.push(...findObjectSchemasMissingProperties(child, `${path}.${key}`));
	}
	return violations;
}
function normalizePerplexityToolSchemas(ctx) {
	return ctx.tools.map((tool) => {
		if (!tool.parameters || typeof tool.parameters !== "object") return tool;
		return {
			...tool,
			parameters: normalizePerplexitySchema(tool.parameters)
		};
	});
}
function inspectPerplexityToolSchemas(ctx) {
	return ctx.tools.flatMap((tool, toolIndex) => {
		const path = `${tool.name}.parameters`;
		const violations = [...findUnsupportedSchemaKeywords(tool.parameters, path, PERPLEXITY_UNSUPPORTED_SCHEMA_KEYWORDS), ...findObjectSchemasMissingProperties(tool.parameters, path)];
		return violations.length > 0 ? [{
			toolName: tool.name,
			toolIndex,
			violations
		}] : [];
	});
}
//#endregion
export { normalizePerplexityToolSchemas as n, inspectPerplexityToolSchemas as t };
