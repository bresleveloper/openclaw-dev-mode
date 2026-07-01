//#region src/agents/tool-schema-json-projection.ts
function isJsonValue(value) {
	if (value === null) return true;
	switch (typeof value) {
		case "boolean":
		case "number":
		case "string": return true;
		case "object":
			if (Array.isArray(value)) return value.every(isJsonValue);
			return Object.values(value).every(isJsonValue);
		default: return false;
	}
}
function isJsonObject(value) {
	return value !== null && typeof value === "object" && !Array.isArray(value);
}
function serializeToolInputSchema(value, path) {
	let text;
	try {
		text = JSON.stringify(value);
	} catch {
		return {
			schema: {},
			violations: [`${path} is not JSON-serializable`]
		};
	}
	if (!text) return {
		schema: {},
		violations: [`${path} is not JSON-serializable`]
	};
	const parsed = JSON.parse(text);
	if (!isJsonValue(parsed)) return {
		schema: {},
		violations: [`${path} is not a JSON value`]
	};
	return {
		schema: parsed,
		violations: []
	};
}
const schemaMapKeywords = new Set([
	"$defs",
	"definitions",
	"dependencies",
	"dependentSchemas",
	"patternProperties",
	"properties"
]);
function findDynamicSchemaKeywordViolations(schema, path) {
	if (Array.isArray(schema)) return schema.flatMap((entry, index) => findDynamicSchemaKeywordViolations(entry, `${path}[${index}]`));
	if (!isJsonObject(schema)) return [];
	const violations = [];
	for (const key of ["$dynamicRef", "$dynamicAnchor"]) if (key in schema) violations.push(`${path}.${key}`);
	for (const [key, value] of Object.entries(schema)) {
		if (!value || typeof value !== "object") continue;
		if (schemaMapKeywords.has(key) && isJsonObject(value)) for (const [schemaName, childSchema] of Object.entries(value)) violations.push(...findDynamicSchemaKeywordViolations(childSchema, `${path}.${key}.${schemaName}`));
		else violations.push(...findDynamicSchemaKeywordViolations(value, `${path}.${key}`));
	}
	return violations;
}
/** Projects one runtime tool input schema to JSON and reports runtime incompatibilities. */
function projectRuntimeToolInputSchema(schema, path = "parameters") {
	const projection = serializeToolInputSchema(schema, path);
	const violations = [...projection.violations];
	if (!isJsonObject(projection.schema)) violations.push(`${path} must be a JSON object schema`);
	else if (projection.schema.type !== void 0 && projection.schema.type !== "object") violations.push(`${path}.type must be "object"`);
	violations.push(...findDynamicSchemaKeywordViolations(projection.schema, path));
	return {
		schema: projection.schema,
		violations
	};
}
//#endregion
export { projectRuntimeToolInputSchema as t };
