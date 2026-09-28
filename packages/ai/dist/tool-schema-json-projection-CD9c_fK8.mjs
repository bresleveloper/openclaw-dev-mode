import { o as isRecord } from "./record-coerce-DwRYMj3t.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { types } from "node:util";
//#region packages/ai/src/providers/tool-schema-json-projection.ts
function isNonFiniteNumberValue(value) {
	if (typeof value === "number") return !Number.isFinite(value);
	if (value === null || typeof value !== "object" || !types.isNumberObject(value)) return false;
	return !Number.isFinite(Number.prototype.valueOf.call(value));
}
function serializeToolInputSchema(value, path, captureJson) {
	const nonFiniteNumber = { path: null };
	const ancestors = [];
	const pathLengths = [];
	const segments = [path];
	let isRoot = true;
	let text;
	try {
		text = JSON.stringify(value, function(key, entry) {
			const invalidNumber = nonFiniteNumber.path === null && isNonFiniteNumberValue(entry);
			if (invalidNumber || entry && typeof entry === "object") {
				while (ancestors.length > 0 && ancestors[ancestors.length - 1] !== this) {
					ancestors.pop();
					segments.length = expectDefined(pathLengths.pop(), "schema ancestor path length");
				}
				const prefixLength = segments.length;
				if (!isRoot) {
					if (Array.isArray(this)) segments.push("[", key, "]");
					else segments.push(".", key);
				}
				if (invalidNumber) {
					nonFiniteNumber.path = segments.join("");
					segments.length = prefixLength;
				} else {
					ancestors.push(entry);
					pathLengths.push(prefixLength);
				}
			}
			isRoot = false;
			return entry;
		});
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
	if (nonFiniteNumber.path !== null) return {
		schema: {},
		violations: [`${nonFiniteNumber.path} is not JSON-serializable`]
	};
	const schema = JSON.parse(text);
	captureJson?.(text);
	return {
		schema,
		violations: []
	};
}
const schemaMapKeywords = /* @__PURE__ */ new Set([
	"$defs",
	"definitions",
	"dependencies",
	"dependentSchemas",
	"patternProperties",
	"properties"
]);
function inspectJsonSchema(schema, path, violations) {
	if (Array.isArray(schema)) {
		let index = 0;
		for (const entry of schema) {
			path.push("[", index++, "]");
			const valid = inspectJsonSchema(entry, path, violations);
			path.length -= 3;
			if (!valid) return false;
		}
		return true;
	}
	if (!isRecord(schema)) return typeof schema !== "number" || Number.isFinite(schema);
	for (const key of ["$dynamicRef", "$dynamicAnchor"]) if (key in schema) violations.push(`${path.join("")}.${key}`);
	for (const key of Object.keys(schema)) {
		const value = schema[key];
		if (typeof value === "number" && !Number.isFinite(value)) return false;
		if (!value || typeof value !== "object") continue;
		path.push(".", key);
		if (schemaMapKeywords.has(key) && isRecord(value)) for (const schemaName of Object.keys(value)) {
			const childSchema = value[schemaName];
			if (childSchema === void 0) return false;
			path.push(".", schemaName);
			const valid = inspectJsonSchema(childSchema, path, violations);
			path.length -= 2;
			if (!valid) return false;
		}
		else if (!inspectJsonSchema(value, path, violations)) return false;
		path.length -= 2;
	}
	return true;
}
/** Projects one runtime tool input schema to JSON and reports runtime incompatibilities. */
function projectRuntimeToolInputSchema(schema, path = "parameters") {
	return projectToolInputSchema(schema, path);
}
/** Package-private preparation; public projections never carry normalization provenance. */
function prepareRuntimeToolInputSchema(schema, path) {
	let inputJson;
	const projection = projectToolInputSchema(schema, path, (text) => {
		inputJson = text;
	});
	return {
		projection,
		...schema && typeof schema === "object" && inputJson && projection.violations.length === 0 ? { normalization: {
			source: schema,
			inputJson
		} } : {}
	};
}
function projectToolInputSchema(schema, path, captureJson) {
	const projection = serializeToolInputSchema(schema, path, captureJson);
	const violations = [...projection.violations];
	if (!isRecord(projection.schema)) violations.push(`${path} must be a JSON object schema`);
	else if (projection.schema.type !== void 0 && projection.schema.type !== "object") violations.push(`${path}.type must be "object"`);
	if (!inspectJsonSchema(projection.schema, [path], violations)) return {
		schema: {},
		violations: [`${path} is not a JSON value`]
	};
	return {
		schema: projection.schema,
		violations
	};
}
//#endregion
export { projectRuntimeToolInputSchema as n, prepareRuntimeToolInputSchema as t };
