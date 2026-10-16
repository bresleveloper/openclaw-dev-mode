import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { Type } from "typebox";
//#region src/agents/schema/tool-output-schema.ts
const INPUT_DISCRIMINATOR = "x-openclaw-input-discriminator";
const MAX_REFERENCE_SCAN_NODES = 4096;
const MAX_REFERENCE_SCAN_DEPTH = 64;
const SCHEMA_MAP_KEYS = [
	"$defs",
	"definitions",
	"dependencies",
	"dependentSchemas",
	"patternProperties",
	"properties"
];
const SCHEMA_VALUE_KEYS = [
	"additionalItems",
	"additionalProperties",
	"allOf",
	"anyOf",
	"contains",
	"contentSchema",
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
];
function canNarrowOutputSchema(schema) {
	let remaining = MAX_REFERENCE_SCAN_NODES;
	const active = /* @__PURE__ */ new WeakSet();
	const completedSchemas = /* @__PURE__ */ new WeakSet();
	const completedContainers = /* @__PURE__ */ new WeakSet();
	const visit = (value, depth, map = false) => {
		if (--remaining < 0 || depth > MAX_REFERENCE_SCAN_DEPTH) return false;
		if (value === null || typeof value !== "object") return true;
		if (active.has(value)) return false;
		const completed = map || Array.isArray(value) ? completedContainers : completedSchemas;
		if (completed.has(value)) return true;
		active.add(value);
		try {
			if (Array.isArray(value)) {
				for (const child of value) if (!visit(child, depth + 1)) return false;
			} else if (isRecord(value)) {
				if (map) {
					for (const key in value) if (--remaining < 0 || Object.hasOwn(value, key) && !visit(value[key], depth + 1)) return false;
				} else {
					if ([
						"$ref",
						"$dynamicRef",
						"$recursiveRef"
					].some((key) => Object.hasOwn(value, key))) return false;
					for (const key of SCHEMA_MAP_KEYS) if (Object.hasOwn(value, key) && !visit(value[key], depth + 1, true)) return false;
					for (const key of SCHEMA_VALUE_KEYS) if (Object.hasOwn(value, key) && !visit(value[key], depth + 1)) return false;
				}
			}
			completed.add(value);
			return true;
		} finally {
			active.delete(value);
		}
	};
	return visit(schema, 0);
}
/** Derive the complete output union and its input-dependent branches together. */
function defineToolOutputSchema(options) {
	const variants = [];
	const mapping = Object.fromEntries(Object.entries(options.variants).map(([value, schema]) => {
		let index = variants.indexOf(schema);
		if (index === -1) index = variants.push(schema) - 1;
		return [value, index];
	}));
	if (!options.inputProperty || variants.length === 0) throw new TypeError("Tool output variants require an input property and at least one branch.");
	return Type.Union(variants, { [INPUT_DISCRIMINATOR]: {
		version: 1,
		inputProperty: options.inputProperty,
		mapping
	} });
}
/** Read the annotation and conservatively determine whether its branches can be narrowed. */
function readToolOutputSchemaVariants(schema) {
	if (!isRecord(schema) || !Object.hasOwn(schema, INPUT_DISCRIMINATOR)) return;
	const annotation = schema[INPUT_DISCRIMINATOR];
	if (!isRecord(annotation) || annotation.version !== 1 || typeof annotation.inputProperty !== "string" || !annotation.inputProperty || !isRecord(annotation.mapping) || !Array.isArray(schema.anyOf) || schema.anyOf.length === 0) throw new TypeError("Invalid tool output input-discriminator annotation.");
	const mapping = /* @__PURE__ */ new Map();
	for (const [value, index] of Object.entries(annotation.mapping)) {
		if (typeof index !== "number" || !Number.isInteger(index) || index < 0 || index >= schema.anyOf.length) throw new TypeError("Invalid tool output input-discriminator branch.");
		mapping.set(value, index);
	}
	if (mapping.size === 0) throw new TypeError("Tool output input-discriminator mapping must not be empty.");
	return {
		inputProperty: annotation.inputProperty,
		mapping,
		variants: schema.anyOf,
		canNarrow: canNarrowOutputSchema(schema)
	};
}
function captureToolOutputSelection(inputProperty, input) {
	const value = isRecord(input) && Object.hasOwn(input, inputProperty) ? input[inputProperty] : void 0;
	return {
		inputProperty,
		value: typeof value === "string" ? value : void 0
	};
}
/** Missing, dynamic, or unmapped input values retain the complete output contract. */
function selectToolOutputSchema(schema, input) {
	if (!isRecord(schema)) return schema;
	const discriminator = readToolOutputSchemaVariants(schema);
	if (!discriminator?.canNarrow) return schema;
	const { value } = captureToolOutputSelection(discriminator.inputProperty, input);
	const index = value === void 0 ? void 0 : discriminator.mapping.get(value);
	if (index === void 0) return schema;
	if (schema.allOf !== void 0 && !Array.isArray(schema.allOf)) throw new TypeError("Invalid tool output allOf constraint.");
	return {
		...schema,
		allOf: [...schema.allOf ?? [], { $ref: `#/anyOf/${index}` }]
	};
}
//#endregion
export { selectToolOutputSchema as i, defineToolOutputSchema as n, readToolOutputSchemaVariants as r, captureToolOutputSelection as t };
