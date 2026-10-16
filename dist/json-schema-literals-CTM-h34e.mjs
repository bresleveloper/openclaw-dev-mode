import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { isDeepStrictEqual } from "node:util";
//#region src/shared/json-schema-literals.ts
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
/** Keeps only the keys that document a property, dropping every constraint. */
function schemaAnnotationsOnly(schema) {
	if (!isRecord(schema)) return {};
	return Object.fromEntries(Object.entries(schema).filter(([key]) => SCHEMA_ANNOTATION_KEYS.has(key)));
}
/** Const and enum constrain the same value, so retain their intersection. */
function readLiteralSchemaValues(schema) {
	const enumValues = Array.isArray(schema.enum) ? schema.enum : void 0;
	if (Object.hasOwn(schema, "const")) {
		if (!enumValues) return [schema.const];
		return enumValues.some((value) => isDeepStrictEqual(value, schema.const)) ? [schema.const] : [];
	}
	return enumValues;
}
function readLiteralValidationConstraints(schema) {
	return Object.fromEntries(Object.entries(schema).filter(([key]) => key !== "const" && key !== "enum" && !SCHEMA_ANNOTATION_KEYS.has(key)));
}
/** Pools property literals only when every non-annotation constraint agrees. */
function mergeLiteralSchemas(existing, incoming) {
	const existingValues = readLiteralSchemaValues(existing);
	const incomingValues = readLiteralSchemaValues(incoming);
	if (existingValues === void 0 || incomingValues === void 0) return;
	const existingConstraints = readLiteralValidationConstraints(existing);
	const incomingConstraints = readLiteralValidationConstraints(incoming);
	if (!isDeepStrictEqual(existingConstraints, incomingConstraints)) return;
	const combined = [...existingValues, ...incomingValues];
	const values = combined.filter((value, index) => combined.findIndex((candidate) => isDeepStrictEqual(candidate, value)) === index);
	if (values.length === 0) return;
	const merged = {
		...existing,
		enum: values
	};
	delete merged.const;
	return merged;
}
//#endregion
export { readLiteralSchemaValues as n, schemaAnnotationsOnly as r, mergeLiteralSchemas as t };
