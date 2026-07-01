//#region src/shared/schema-keyword-strip.ts
/** Recursively remove schema keywords unsupported by a target provider/tool surface. */
function stripUnsupportedSchemaKeywords(schema, unsupportedKeywords) {
	if (!schema || typeof schema !== "object") return schema;
	if (Array.isArray(schema)) return schema.map((entry) => stripUnsupportedSchemaKeywords(entry, unsupportedKeywords));
	const obj = schema;
	const cleaned = {};
	for (const [key, value] of Object.entries(obj)) {
		if (unsupportedKeywords.has(key)) continue;
		if (key === "properties" && value && typeof value === "object" && !Array.isArray(value)) {
			cleaned[key] = Object.fromEntries(Object.entries(value).map(([childKey, childValue]) => [childKey, stripUnsupportedSchemaKeywords(childValue, unsupportedKeywords)]));
			continue;
		}
		if (key === "items" && value && typeof value === "object") {
			cleaned[key] = Array.isArray(value) ? value.map((entry) => stripUnsupportedSchemaKeywords(entry, unsupportedKeywords)) : stripUnsupportedSchemaKeywords(value, unsupportedKeywords);
			continue;
		}
		if ((key === "anyOf" || key === "oneOf" || key === "allOf") && Array.isArray(value)) {
			cleaned[key] = value.map((entry) => stripUnsupportedSchemaKeywords(entry, unsupportedKeywords));
			continue;
		}
		cleaned[key] = value;
	}
	return cleaned;
}
//#endregion
//#region src/agents/schema/clean-for-gemini.ts
const GEMINI_UNSUPPORTED_SCHEMA_KEYWORDS = new Set([
	"patternProperties",
	"additionalProperties",
	"$schema",
	"$id",
	"$ref",
	"$defs",
	"definitions",
	"examples",
	"minLength",
	"maxLength",
	"minimum",
	"maximum",
	"multipleOf",
	"pattern",
	"format",
	"minItems",
	"maxItems",
	"uniqueItems",
	"minProperties",
	"maxProperties",
	"not"
]);
const SCHEMA_META_KEYS = [
	"description",
	"title",
	"default"
];
function copySchemaMeta(from, to) {
	for (const key of SCHEMA_META_KEYS) if (key in from && from[key] !== void 0) to[key] = from[key];
}
function tryFlattenLiteralAnyOf(variants) {
	if (variants.length === 0) return null;
	const allValues = [];
	let commonType = null;
	for (const variant of variants) {
		if (!variant || typeof variant !== "object") return null;
		const v = variant;
		let literalValue;
		if ("const" in v) literalValue = v.const;
		else if (Array.isArray(v.enum) && v.enum.length === 1) literalValue = v.enum[0];
		else return null;
		const variantType = typeof v.type === "string" ? v.type : null;
		if (!variantType) return null;
		if (commonType === null) commonType = variantType;
		else if (commonType !== variantType) return null;
		allValues.push(literalValue);
	}
	if (commonType && allValues.length > 0) return {
		type: commonType,
		enum: allValues
	};
	return null;
}
function isNullSchema(variant) {
	if (!variant || typeof variant !== "object" || Array.isArray(variant)) return false;
	const record = variant;
	if ("const" in record && record.const === null) return true;
	if (Array.isArray(record.enum) && record.enum.length === 1) return record.enum[0] === null;
	const typeValue = record.type;
	if (typeValue === "null") return true;
	if (Array.isArray(typeValue) && typeValue.length === 1 && typeValue[0] === "null") return true;
	return false;
}
function stripNullVariants(variants) {
	if (variants.length === 0) return {
		variants,
		stripped: false
	};
	const nonNull = variants.filter((variant) => !isNullSchema(variant));
	return {
		variants: nonNull,
		stripped: nonNull.length !== variants.length
	};
}
function extendSchemaDefs(defs, schema) {
	const defsEntry = schema.$defs && typeof schema.$defs === "object" && !Array.isArray(schema.$defs) ? schema.$defs : void 0;
	const legacyDefsEntry = schema.definitions && typeof schema.definitions === "object" && !Array.isArray(schema.definitions) ? schema.definitions : void 0;
	if (!defsEntry && !legacyDefsEntry) return defs;
	const next = defs ? new Map(defs) : /* @__PURE__ */ new Map();
	if (defsEntry) for (const [key, value] of Object.entries(defsEntry)) next.set(key, value);
	if (legacyDefsEntry) for (const [key, value] of Object.entries(legacyDefsEntry)) next.set(key, value);
	return next;
}
function decodeJsonPointerSegment(segment) {
	return segment.replaceAll("~1", "/").replaceAll("~0", "~");
}
function tryResolveLocalRef(ref, defs) {
	if (!defs) return;
	const match = ref.match(/^#\/(?:\$defs|definitions)\/(.+)$/);
	if (!match) return;
	const name = decodeJsonPointerSegment(match[1] ?? "");
	if (!name) return;
	return defs.get(name);
}
function simplifyUnionVariants(params) {
	const { obj, variants } = params;
	const { variants: nonNullVariants, stripped } = stripNullVariants(variants);
	const flattened = tryFlattenLiteralAnyOf(nonNullVariants);
	if (flattened) {
		const result = {
			type: flattened.type,
			enum: flattened.enum
		};
		copySchemaMeta(obj, result);
		return {
			variants: nonNullVariants,
			simplified: result
		};
	}
	if (stripped && nonNullVariants.length === 1) {
		const lone = nonNullVariants[0];
		if (lone && typeof lone === "object" && !Array.isArray(lone)) {
			const result = { ...lone };
			copySchemaMeta(obj, result);
			return {
				variants: nonNullVariants,
				simplified: result
			};
		}
		return {
			variants: nonNullVariants,
			simplified: lone
		};
	}
	return { variants: stripped ? nonNullVariants : variants };
}
function sanitizeRequiredFields(schema) {
	if (!Array.isArray(schema.required)) return schema;
	if (!schema.properties || typeof schema.properties !== "object" || Array.isArray(schema.properties)) {
		if (schema.type === "object") delete schema.required;
		return schema;
	}
	const properties = schema.properties;
	const required = schema.required.filter((key) => typeof key === "string" && Object.hasOwn(properties, key));
	if (required.length > 0) schema.required = required;
	else delete schema.required;
	return schema;
}
function cleanSchemaForGeminiWithDefs(schema, defs, refStack) {
	if (!schema || typeof schema !== "object") return schema;
	if (Array.isArray(schema)) return schema.map((item) => cleanSchemaForGeminiWithDefs(item, defs, refStack));
	const obj = schema;
	const nextDefs = extendSchemaDefs(defs, obj);
	const refValue = typeof obj.$ref === "string" ? obj.$ref : void 0;
	if (refValue) {
		if (refStack?.has(refValue)) return {};
		const resolved = tryResolveLocalRef(refValue, nextDefs);
		if (resolved) {
			const nextRefStack = refStack ? new Set(refStack) : /* @__PURE__ */ new Set();
			nextRefStack.add(refValue);
			const cleaned = cleanSchemaForGeminiWithDefs(resolved, nextDefs, nextRefStack);
			if (!cleaned || typeof cleaned !== "object" || Array.isArray(cleaned)) return cleaned;
			const result = { ...cleaned };
			copySchemaMeta(obj, result);
			return result;
		}
		const result = {};
		copySchemaMeta(obj, result);
		return result;
	}
	const hasAnyOf = "anyOf" in obj && Array.isArray(obj.anyOf);
	const hasOneOf = "oneOf" in obj && Array.isArray(obj.oneOf);
	let cleanedAnyOf = hasAnyOf ? obj.anyOf.map((variant) => cleanSchemaForGeminiWithDefs(variant, nextDefs, refStack)) : void 0;
	let cleanedOneOf = hasOneOf ? obj.oneOf.map((variant) => cleanSchemaForGeminiWithDefs(variant, nextDefs, refStack)) : void 0;
	if (hasAnyOf) {
		const simplified = simplifyUnionVariants({
			obj,
			variants: cleanedAnyOf ?? []
		});
		cleanedAnyOf = simplified.variants;
		if ("simplified" in simplified) return simplified.simplified;
	}
	if (hasOneOf) {
		const simplified = simplifyUnionVariants({
			obj,
			variants: cleanedOneOf ?? []
		});
		cleanedOneOf = simplified.variants;
		if ("simplified" in simplified) return simplified.simplified;
	}
	const cleaned = {};
	for (const [key, value] of Object.entries(obj)) {
		if (GEMINI_UNSUPPORTED_SCHEMA_KEYWORDS.has(key)) continue;
		if (key === "const") {
			cleaned.enum = [value];
			continue;
		}
		if (key === "required" && Array.isArray(value) && value.length === 0) continue;
		if (key === "type" && (hasAnyOf || hasOneOf)) continue;
		if (key === "type" && Array.isArray(value) && value.every((entry) => typeof entry === "string")) {
			const types = value.filter((entry) => entry !== "null");
			cleaned.type = types.length === 1 ? types[0] : types;
			continue;
		}
		if (key === "properties") if (value && typeof value === "object" && !Array.isArray(value)) cleaned[key] = Object.fromEntries(Object.entries(value).map(([k, v]) => [k, cleanSchemaForGeminiWithDefs(v, nextDefs, refStack)]));
		else cleaned[key] = {};
		else if (key === "items" && value) if (Array.isArray(value)) cleaned[key] = value.map((entry) => cleanSchemaForGeminiWithDefs(entry, nextDefs, refStack));
		else if (typeof value === "object") cleaned[key] = cleanSchemaForGeminiWithDefs(value, nextDefs, refStack);
		else cleaned[key] = value;
		else if (key === "anyOf" && Array.isArray(value)) cleaned[key] = cleanedAnyOf ?? value.map((variant) => cleanSchemaForGeminiWithDefs(variant, nextDefs, refStack));
		else if (key === "oneOf" && Array.isArray(value)) cleaned[key] = cleanedOneOf ?? value.map((variant) => cleanSchemaForGeminiWithDefs(variant, nextDefs, refStack));
		else if (key === "allOf" && Array.isArray(value)) cleaned[key] = value.map((variant) => cleanSchemaForGeminiWithDefs(variant, nextDefs, refStack));
		else cleaned[key] = value;
	}
	if (cleaned.anyOf && Array.isArray(cleaned.anyOf)) {
		const flattened = flattenUnionFallback(cleaned, cleaned.anyOf);
		if (flattened) return sanitizeRequiredFields(flattened);
	}
	if (cleaned.oneOf && Array.isArray(cleaned.oneOf)) {
		const flattened = flattenUnionFallback(cleaned, cleaned.oneOf);
		if (flattened) return sanitizeRequiredFields(flattened);
	}
	return sanitizeRequiredFields(cleaned);
}
/**
* Last-resort flattening for anyOf/oneOf arrays that could not be simplified
* by `simplifyUnionVariants`. Picks a representative type so the schema is
* accepted by Google's restricted JSON Schema validation.
*/
function flattenUnionFallback(obj, variants) {
	const objects = variants.filter((v) => Boolean(v) && typeof v === "object");
	if (objects.length === 0) return;
	const types = new Set(objects.map((v) => v.type).filter(Boolean));
	if (objects.length === 1) {
		const merged = { ...objects[0] };
		copySchemaMeta(obj, merged);
		return merged;
	}
	if (types.size === 1) {
		const merged = { type: Array.from(types)[0] };
		copySchemaMeta(obj, merged);
		return merged;
	}
	const first = objects[0];
	if (first?.type) {
		const merged = { type: first.type };
		copySchemaMeta(obj, merged);
		return merged;
	}
	const merged = {};
	copySchemaMeta(obj, merged);
	return merged;
}
function cleanSchemaForGemini(schema) {
	if (!schema || typeof schema !== "object") return schema;
	if (Array.isArray(schema)) return schema.map(cleanSchemaForGemini);
	return cleanSchemaForGeminiWithDefs(schema, extendSchemaDefs(void 0, schema), void 0);
}
//#endregion
export { cleanSchemaForGemini as n, stripUnsupportedSchemaKeywords as r, GEMINI_UNSUPPORTED_SCHEMA_KEYWORDS as t };
