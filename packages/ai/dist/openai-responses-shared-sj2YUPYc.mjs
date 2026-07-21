import { n as getAiTransportHost } from "./host-4t713IeR.mjs";
import { n as calculateCost, r as clampThinkingLevel } from "./model-utils-DgmOla96.mjs";
import { t as headersToRecord } from "./headers-B_e4-1J0.mjs";
import { n as parseStreamingJson } from "./json-parse-DzNSIQBq.mjs";
import { t as sanitizeSurrogates } from "./sanitize-unicode-DT5o51ur.mjs";
import { C as normalizeLowercaseStringOrEmpty, b as stripSystemPromptCacheBoundary, c as isRecord, i as extractToolResultText, n as describeToolResultMediaPlaceholder, t as transformMessages, w as normalizeOptionalString } from "./transform-messages-BhGF_fF4.mjs";
import { a as withFirstStreamEventTimeout, i as getFirstStreamEventTimeoutMs, r as getFirstStreamEventTimeoutHandler, t as createFirstStreamEventAbortController } from "./stream-first-event-timeout-RjWszj8c.mjs";
import { t as projectOpenAITools } from "./openai-tool-projection-BknoV11q.mjs";
import { t as shortHash } from "./hash-CHgqbJmD.mjs";
import { createHash } from "node:crypto";
//#region packages/normalization-core/src/string-normalization.ts
/** Coerces entries to strings, trims them, and drops empty results. */
function normalizeStringEntries(list) {
	return (list ?? []).map((entry) => normalizeOptionalString(String(entry)) ?? "").filter(Boolean);
}
/** Returns first-seen unique values while preserving insertion order. */
function uniqueValues(values) {
	return [...new Set(values)];
}
/** Returns first-seen unique strings while preserving insertion order. */
function uniqueStrings(values) {
	return uniqueValues(values);
}
//#endregion
//#region packages/ai/src/providers/clean-for-gemini.ts
const GEMINI_UNSUPPORTED_SCHEMA_KEYWORDS = /* @__PURE__ */ new Set([
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
function copySchemaMeta$1(from, to) {
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
function extendSchemaDefs$1(defs, schema) {
	const defsEntry = schema.$defs && typeof schema.$defs === "object" && !Array.isArray(schema.$defs) ? schema.$defs : void 0;
	const legacyDefsEntry = schema.definitions && typeof schema.definitions === "object" && !Array.isArray(schema.definitions) ? schema.definitions : void 0;
	if (!defsEntry && !legacyDefsEntry) return defs;
	const next = defs ? new Map(defs) : /* @__PURE__ */ new Map();
	if (defsEntry) for (const [key, value] of Object.entries(defsEntry)) next.set(key, value);
	if (legacyDefsEntry) for (const [key, value] of Object.entries(legacyDefsEntry)) next.set(key, value);
	return next;
}
function decodeJsonPointerSegment$1(segment) {
	return segment.replaceAll("~1", "/").replaceAll("~0", "~");
}
function tryResolveLocalRef$1(ref, defs) {
	if (!defs) return;
	const match = ref.match(/^#\/(?:\$defs|definitions)\/(.+)$/);
	if (!match) return;
	const name = decodeJsonPointerSegment$1(match[1] ?? "");
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
		copySchemaMeta$1(obj, result);
		return {
			variants: nonNullVariants,
			simplified: result
		};
	}
	if (stripped && nonNullVariants.length === 1) {
		const lone = nonNullVariants[0];
		if (lone && typeof lone === "object" && !Array.isArray(lone)) {
			const result = { ...lone };
			copySchemaMeta$1(obj, result);
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
	const nextDefs = extendSchemaDefs$1(defs, obj);
	const refValue = typeof obj.$ref === "string" ? obj.$ref : void 0;
	if (refValue) {
		if (refStack?.has(refValue)) return {};
		const resolved = tryResolveLocalRef$1(refValue, nextDefs);
		if (resolved) {
			const nextRefStack = refStack ? new Set(refStack) : /* @__PURE__ */ new Set();
			nextRefStack.add(refValue);
			const cleaned = cleanSchemaForGeminiWithDefs(resolved, nextDefs, nextRefStack);
			if (!cleaned || typeof cleaned !== "object" || Array.isArray(cleaned)) return cleaned;
			const result = { ...cleaned };
			copySchemaMeta$1(obj, result);
			return result;
		}
		const result = {};
		copySchemaMeta$1(obj, result);
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
		copySchemaMeta$1(obj, merged);
		return merged;
	}
	if (types.size === 1) {
		const merged = { type: Array.from(types)[0] };
		copySchemaMeta$1(obj, merged);
		return merged;
	}
	const first = objects[0];
	if (first?.type) {
		const merged = { type: first.type };
		copySchemaMeta$1(obj, merged);
		return merged;
	}
	const merged = {};
	copySchemaMeta$1(obj, merged);
	return merged;
}
function cleanSchemaForGemini(schema) {
	if (!schema || typeof schema !== "object") return schema;
	if (Array.isArray(schema)) return schema.map(cleanSchemaForGemini);
	return cleanSchemaForGeminiWithDefs(schema, extendSchemaDefs$1(void 0, schema), void 0);
}
//#endregion
//#region packages/ai/src/providers/schema-keyword-strip.ts
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
//#region packages/ai/src/providers/agent-tools-parameter-schema.ts
/**
* Normalizes model-facing tool parameter schemas across provider quirks.
* Handles local JSON Schema refs, OpenAPI nullable syntax, top-level unions,
* and provider-specific unsupported keyword stripping.
*/
/** Extracts the compat record whether callers pass a model (`{ compat }`) or the compat itself. */
function extractToolSchemaModelCompat(modelOrCompat) {
	if (!modelOrCompat || typeof modelOrCompat !== "object") return;
	if ("compat" in modelOrCompat) {
		const compat = modelOrCompat.compat;
		return compat && typeof compat === "object" ? compat : void 0;
	}
	return modelOrCompat;
}
/** JSON Schema keywords this model/provider rejects in tool schemas. */
function resolveUnsupportedToolSchemaKeywords(modelOrCompat) {
	const keywords = extractToolSchemaModelCompat(modelOrCompat)?.unsupportedToolSchemaKeywords ?? [];
	return new Set(normalizeStringEntries(keywords.filter((keyword) => typeof keyword === "string")));
}
/** Whether empty `items: {}` on array schemas must be omitted for this model/provider. */
function shouldOmitEmptyArrayItems(modelOrCompat) {
	return extractToolSchemaModelCompat(modelOrCompat)?.omitEmptyArrayItems === true;
}
const MAX_TOOL_PARAMETER_SCHEMA_CACHE_ENTRIES_PER_SCHEMA = 8;
const toolParameterSchemaCache = /* @__PURE__ */ new WeakMap();
function resolveToolParameterSchemaCacheKey(options) {
	const normalizedProvider = normalizeLowercaseStringOrEmpty(options?.modelProvider);
	const normalizedModelId = normalizeLowercaseStringOrEmpty(options?.modelId);
	const toolSchemaProfile = normalizeLowercaseStringOrEmpty(options?.modelCompat?.toolSchemaProfile);
	const unsupportedKeywords = Array.from(resolveUnsupportedToolSchemaKeywords(options?.modelCompat)).toSorted();
	const omitEmptyArrayItems = shouldOmitEmptyArrayItems(options?.modelCompat);
	return JSON.stringify([
		normalizedProvider,
		normalizedModelId,
		toolSchemaProfile,
		unsupportedKeywords,
		omitEmptyArrayItems
	]);
}
function getCachedToolParameterSchema(schema, key) {
	return toolParameterSchemaCache.get(schema)?.find((entry) => entry.key === key)?.value;
}
function rememberCachedToolParameterSchema(schema, key, value) {
	const entries = toolParameterSchemaCache.get(schema) ?? [];
	toolParameterSchemaCache.set(schema, [{
		key,
		value
	}, ...entries.filter((entry) => entry.key !== key)].slice(0, MAX_TOOL_PARAMETER_SCHEMA_CACHE_ENTRIES_PER_SCHEMA));
	return value;
}
function isGeminiModelId(modelId) {
	return /(?:^|[/:])gemini(?:$|[-/:.])/.test(modelId);
}
function extractEnumValues(schema) {
	if (!schema || typeof schema !== "object") return;
	const record = schema;
	if (Array.isArray(record.enum)) return record.enum;
	if ("const" in record) return [record.const];
	const variants = Array.isArray(record.anyOf) ? record.anyOf : Array.isArray(record.oneOf) ? record.oneOf : null;
	if (variants) {
		const values = variants.flatMap((variant) => {
			return extractEnumValues(variant) ?? [];
		});
		return values.length > 0 ? values : void 0;
	}
}
function mergePropertySchemas(existing, incoming) {
	if (!existing) return incoming;
	if (!incoming) return existing;
	const existingEnum = extractEnumValues(existing);
	const incomingEnum = extractEnumValues(incoming);
	if (existingEnum || incomingEnum) {
		const values = uniqueValues([...existingEnum ?? [], ...incomingEnum ?? []]);
		const merged = {};
		for (const source of [existing, incoming]) {
			if (!source || typeof source !== "object") continue;
			const record = source;
			for (const key of [
				"title",
				"description",
				"default"
			]) if (!(key in merged) && key in record) merged[key] = record[key];
		}
		const types = new Set(values.map((value) => typeof value));
		if (types.size === 1) merged.type = Array.from(types)[0];
		merged.enum = values;
		return merged;
	}
	return existing;
}
function setOwnSchemaProperty(target, key, value) {
	Object.defineProperty(target, key, {
		value,
		enumerable: true,
		configurable: true,
		writable: true
	});
}
function hasTopLevelArrayKeyword(schemaRecord, key) {
	return Array.isArray(schemaRecord[key]);
}
function getFlattenableVariantKey(schemaRecord) {
	if (hasTopLevelArrayKeyword(schemaRecord, "anyOf")) return "anyOf";
	if (hasTopLevelArrayKeyword(schemaRecord, "oneOf")) return "oneOf";
	return null;
}
function getTopLevelConditionalKey(schemaRecord) {
	return getFlattenableVariantKey(schemaRecord) ?? (hasTopLevelArrayKeyword(schemaRecord, "allOf") ? "allOf" : null);
}
function hasTopLevelObjectSchema(schemaRecord, conditionalKey) {
	return schemaRecord.type === "object" && isRecord(schemaRecord.properties) && conditionalKey === null;
}
function isObjectLikeSchemaMissingType(schemaRecord, conditionalKey) {
	return !("type" in schemaRecord) && (isRecord(schemaRecord.properties) || Array.isArray(schemaRecord.required)) && conditionalKey === null;
}
function isTypedObjectSchemaMissingValidProperties(schemaRecord, conditionalKey) {
	return schemaRecord.type === "object" && !isRecord(schemaRecord.properties) && conditionalKey === null;
}
function isTrulyEmptySchema(schemaRecord) {
	return Object.keys(schemaRecord).length === 0;
}
function normalizeArraySchemasMissingItems(schema) {
	if (!isRecord(schema)) return schema;
	let changed = false;
	const nextSchema = { ...schema };
	if (nextSchema.type === "array" && nextSchema.items === void 0) {
		nextSchema.items = {};
		changed = true;
	}
	const normalizeSchemaValue = (key) => {
		if (!(key in nextSchema)) return;
		const value = nextSchema[key];
		if (Array.isArray(value)) {
			const normalized = value.map(normalizeArraySchemasMissingItems);
			if (normalized.some((entry, index) => entry !== value[index])) {
				nextSchema[key] = normalized;
				changed = true;
			}
			return;
		}
		const normalized = normalizeArraySchemasMissingItems(value);
		if (normalized !== value) {
			nextSchema[key] = normalized;
			changed = true;
		}
	};
	for (const key of [
		"items",
		"contains",
		"additionalProperties",
		"propertyNames",
		"not",
		"if",
		"then",
		"else"
	]) normalizeSchemaValue(key);
	for (const key of [
		"anyOf",
		"oneOf",
		"allOf",
		"prefixItems"
	]) normalizeSchemaValue(key);
	for (const key of [
		"properties",
		"patternProperties",
		"dependentSchemas",
		"$defs",
		"definitions"
	]) {
		const value = nextSchema[key];
		if (!isRecord(value)) continue;
		let entriesChanged = false;
		const normalizedEntries = Object.entries(value).map(([entryKey, entryValue]) => {
			const normalizedEntryValue = normalizeArraySchemasMissingItems(entryValue);
			if (normalizedEntryValue !== entryValue) entriesChanged = true;
			return [entryKey, normalizedEntryValue];
		});
		if (entriesChanged) {
			nextSchema[key] = Object.fromEntries(normalizedEntries);
			changed = true;
		}
	}
	return changed ? nextSchema : schema;
}
function schemaAllowsArrayType(schema) {
	const type = schema.type;
	return type === "array" || Array.isArray(type) && type.includes("array");
}
const ARRAY_ITEMS_SCHEMA_OBJECT_KEYS = /* @__PURE__ */ new Set([
	"additionalProperties",
	"contains",
	"else",
	"if",
	"items",
	"not",
	"propertyNames",
	"then"
]);
const ARRAY_ITEMS_SCHEMA_ARRAY_KEYS = /* @__PURE__ */ new Set([
	"allOf",
	"anyOf",
	"oneOf",
	"prefixItems"
]);
const ARRAY_ITEMS_SCHEMA_MAP_KEYS = /* @__PURE__ */ new Set([
	"$defs",
	"definitions",
	"dependentSchemas",
	"patternProperties",
	"properties"
]);
function stripEmptyArrayItemsFromArraySchemas(schema) {
	if (Array.isArray(schema)) {
		let changed = false;
		const entries = schema.map((entry) => {
			const next = stripEmptyArrayItemsFromArraySchemas(entry);
			changed ||= next !== entry;
			return next;
		});
		return changed ? entries : schema;
	}
	if (!isRecord(schema)) return schema;
	let changed = false;
	const entries = Object.entries(schema).flatMap(([key, value]) => {
		if (key === "items" && schemaAllowsArrayType(schema) && isRecord(value) && isTrulyEmptySchema(value)) {
			changed = true;
			return [];
		}
		if (ARRAY_ITEMS_SCHEMA_OBJECT_KEYS.has(key)) {
			const next = stripEmptyArrayItemsFromArraySchemas(value);
			changed ||= next !== value;
			return [[key, next]];
		}
		if (ARRAY_ITEMS_SCHEMA_ARRAY_KEYS.has(key) && Array.isArray(value)) {
			const next = stripEmptyArrayItemsFromArraySchemas(value);
			changed ||= next !== value;
			return [[key, next]];
		}
		if (ARRAY_ITEMS_SCHEMA_MAP_KEYS.has(key) && isRecord(value)) {
			let mapChanged = false;
			const next = Object.fromEntries(Object.entries(value).map(([entryKey, entryValue]) => {
				const entryNext = stripEmptyArrayItemsFromArraySchemas(entryValue);
				mapChanged ||= entryNext !== entryValue;
				return [entryKey, entryNext];
			}));
			changed ||= mapChanged;
			return [[key, mapChanged ? next : value]];
		}
		return [[key, value]];
	});
	return changed ? Object.fromEntries(entries) : schema;
}
function copySchemaMeta(from, to) {
	for (const key of [
		"title",
		"description",
		"default"
	]) if (key in from && from[key] !== void 0) to[key] = from[key];
}
function extendSchemaDefs(defs, schema) {
	const defsEntry = schema.$defs && typeof schema.$defs === "object" && !Array.isArray(schema.$defs) ? schema.$defs : void 0;
	const legacyDefsEntry = schema.definitions && typeof schema.definitions === "object" && !Array.isArray(schema.definitions) ? schema.definitions : void 0;
	if (!defsEntry && !legacyDefsEntry) return defs;
	const next = defs ? {
		$defs: new Map(defs.$defs),
		definitions: new Map(defs.definitions)
	} : {
		$defs: /* @__PURE__ */ new Map(),
		definitions: /* @__PURE__ */ new Map()
	};
	if (defsEntry) for (const [key, value] of Object.entries(defsEntry)) next.$defs.set(key, value);
	if (legacyDefsEntry) for (const [key, value] of Object.entries(legacyDefsEntry)) next.definitions.set(key, value);
	return next;
}
function decodeJsonPointerSegment(segment) {
	return segment.replaceAll("~1", "/").replaceAll("~0", "~");
}
function resolveJsonPointerPath(value, segments) {
	let current = value;
	for (const segment of segments) {
		if (!current || typeof current !== "object") return;
		const key = decodeJsonPointerSegment(segment);
		if (Array.isArray(current)) {
			const index = Number(key);
			if (!Number.isInteger(index) || index < 0 || index >= current.length) return;
			current = current[index];
			continue;
		}
		const record = current;
		if (!Object.hasOwn(record, key)) return;
		current = record[key];
	}
	return current;
}
function resolveLocalJsonPointer(rootDocument, ref) {
	if (!ref.startsWith("#/")) return;
	return resolveJsonPointerPath(rootDocument, ref.slice(2).split("/"));
}
const SCHEMA_MAP_KEYS = /* @__PURE__ */ new Set([
	"$defs",
	"definitions",
	"dependentSchemas",
	"patternProperties",
	"properties"
]);
const SCHEMA_OBJECT_KEYS = /* @__PURE__ */ new Set([
	"additionalProperties",
	"contains",
	"else",
	"if",
	"items",
	"not",
	"propertyNames",
	"then"
]);
const SCHEMA_ARRAY_KEYS = /* @__PURE__ */ new Set([
	"allOf",
	"anyOf",
	"items",
	"oneOf",
	"prefixItems"
]);
const SCHEMA_LITERAL_KEYS = /* @__PURE__ */ new Set([
	"const",
	"default",
	"enum",
	"examples"
]);
function tryResolveLocalRef(ref, defs, rootDocument) {
	const match = ref.match(/^#\/(\$defs|definitions)\/([^/]+)(?:\/(.*))?$/);
	if (match && defs) {
		const namespace = match[1] === "$defs" ? defs.$defs : defs.definitions;
		const name = decodeJsonPointerSegment(match[2] ?? "");
		const resolved = name ? namespace.get(name) : void 0;
		if (resolved !== void 0) return resolveJsonPointerPath(resolved, match[3] ? match[3].split("/") : []);
	}
	return resolveLocalJsonPointer(rootDocument, ref);
}
function inlineLocalSchemaRefsWithDefs(schema, defs, refStack, state, rootDocument) {
	if (!schema || typeof schema !== "object") return schema;
	if (Array.isArray(schema)) return schema.map((entry) => inlineLocalSchemaRefsWithDefs(entry, defs, refStack, state, rootDocument));
	const obj = schema;
	const nextDefs = extendSchemaDefs(defs, obj);
	const refValue = typeof obj.$ref === "string" ? obj.$ref : void 0;
	if (refValue) {
		if (refStack?.has(refValue)) return {};
		const resolved = tryResolveLocalRef(refValue, nextDefs, rootDocument);
		if (resolved === void 0) {
			if (refValue.startsWith("#/")) state.unresolvedLocalRefs = true;
			return { ...obj };
		}
		const nextRefStack = refStack ? new Set(refStack) : /* @__PURE__ */ new Set();
		nextRefStack.add(refValue);
		const inlined = inlineLocalSchemaRefsWithDefs(resolved, nextDefs, nextRefStack, state, rootDocument);
		if (!inlined || typeof inlined !== "object" || Array.isArray(inlined)) return inlined;
		const result = { ...inlined };
		copySchemaMeta(obj, result);
		if (obj.nullable === true) result.nullable = true;
		return result;
	}
	const result = {};
	for (const [key, value] of Object.entries(obj)) {
		if (key === "$defs" || key === "definitions" || key === "components") continue;
		if (SCHEMA_LITERAL_KEYS.has(key)) {
			setOwnSchemaProperty(result, key, value);
			continue;
		}
		if (SCHEMA_MAP_KEYS.has(key) && isRecord(value)) {
			setOwnSchemaProperty(result, key, Object.fromEntries(Object.entries(value).map(([entryKey, entryValue]) => [entryKey, inlineLocalSchemaRefsWithDefs(entryValue, nextDefs, refStack, state, rootDocument)])));
			continue;
		}
		if (SCHEMA_OBJECT_KEYS.has(key) && isRecord(value)) {
			setOwnSchemaProperty(result, key, inlineLocalSchemaRefsWithDefs(value, nextDefs, refStack, state, rootDocument));
			continue;
		}
		if (SCHEMA_ARRAY_KEYS.has(key) && Array.isArray(value)) {
			setOwnSchemaProperty(result, key, value.map((entry) => inlineLocalSchemaRefsWithDefs(entry, nextDefs, refStack, state, rootDocument)));
			continue;
		}
		setOwnSchemaProperty(result, key, value);
	}
	if (state.unresolvedLocalRefs) {
		if ("$defs" in obj) result.$defs = obj.$defs;
		if ("definitions" in obj) result.definitions = obj.definitions;
		if ("components" in obj) result.components = obj.components;
	}
	return result;
}
/** Inline local $ref pointers so providers receive self-contained tool schemas. */
function inlineLocalToolSchemaRefs(schema) {
	if (!schema || typeof schema !== "object") return schema;
	return inlineLocalSchemaRefsWithDefs(schema, extendSchemaDefs(void 0, schema), void 0, { unresolvedLocalRefs: false }, schema);
}
const OPENAPI_SCHEMA_ANNOTATION_KEYS = /* @__PURE__ */ new Set([
	"discriminator",
	"externalDocs",
	"readOnly",
	"writeOnly",
	"xml",
	"example"
]);
function appendNullSchemaType(type) {
	if (type === "null") return type;
	if (typeof type === "string") return [type, "null"];
	if (Array.isArray(type)) return type.includes("null") ? type : [...type, "null"];
	return type;
}
function isNullSchemaLike(schema) {
	if (!isRecord(schema)) return false;
	if (schema.type === "null") return true;
	if (Array.isArray(schema.type) && schema.type.includes("null")) return true;
	if ("const" in schema && schema.const === null) return true;
	return Array.isArray(schema.enum) && schema.enum.includes(null);
}
function hasOpenApiComposition(schema) {
	return [
		"allOf",
		"anyOf",
		"oneOf"
	].some((key) => Array.isArray(schema[key]));
}
function schemaCompositionAlreadyAllowsNull(schema) {
	return Array.isArray(schema.anyOf) && schema.anyOf.some(isNullSchemaLike) || Array.isArray(schema.oneOf) && schema.oneOf.some(isNullSchemaLike);
}
function wrapNullableComposedSchema(schema) {
	if (schemaCompositionAlreadyAllowsNull(schema)) return schema;
	const wrapped = { anyOf: [schema, { type: "null" }] };
	copySchemaMeta(schema, wrapped);
	return wrapped;
}
function normalizeOpenApiSchemaKeywords(schema) {
	if (Array.isArray(schema)) {
		let changed = false;
		const normalized = schema.map((entry) => {
			const next = normalizeOpenApiSchemaKeywords(entry);
			changed ||= next !== entry;
			return next;
		});
		return changed ? normalized : schema;
	}
	if (!isRecord(schema)) return schema;
	let changed = false;
	const nullable = schema.nullable === true;
	const normalized = {};
	for (const [key, value] of Object.entries(schema)) {
		if (key === "nullable" || OPENAPI_SCHEMA_ANNOTATION_KEYS.has(key)) {
			changed = true;
			continue;
		}
		if (SCHEMA_LITERAL_KEYS.has(key)) {
			normalized[key] = value;
			continue;
		}
		if (SCHEMA_MAP_KEYS.has(key) && isRecord(value)) {
			let mapChanged = false;
			const next = Object.fromEntries(Object.entries(value).map(([entryKey, entryValue]) => {
				const nextEntry = normalizeOpenApiSchemaKeywords(entryValue);
				mapChanged ||= nextEntry !== entryValue;
				return [entryKey, nextEntry];
			}));
			normalized[key] = mapChanged ? next : value;
			changed ||= mapChanged;
			continue;
		}
		if (key === "components") {
			normalized[key] = value;
			continue;
		}
		if (SCHEMA_OBJECT_KEYS.has(key) && isRecord(value)) {
			const next = normalizeOpenApiSchemaKeywords(value);
			normalized[key] = next;
			changed ||= next !== value;
			continue;
		}
		if (SCHEMA_ARRAY_KEYS.has(key) && Array.isArray(value)) {
			const next = value.map(normalizeOpenApiSchemaKeywords);
			normalized[key] = next;
			changed ||= next.some((entry, index) => entry !== value[index]);
			continue;
		}
		normalized[key] = value;
	}
	if (nullable) {
		if (hasOpenApiComposition(normalized)) return wrapNullableComposedSchema(normalized);
		if ("type" in normalized) {
			const nextType = appendNullSchemaType(normalized.type);
			if (nextType !== normalized.type) normalized.type = nextType;
		}
		if (Array.isArray(normalized.enum) && !normalized.enum.includes(null)) normalized.enum = [...normalized.enum, null];
	}
	return changed || nullable ? normalized : schema;
}
function normalizeToolParameterSchemaUncached(schema, options) {
	const inlinedSchema = normalizeOpenApiSchemaKeywords(inlineLocalToolSchemaRefs(schema));
	const schemaRecord = inlinedSchema && typeof inlinedSchema === "object" ? inlinedSchema : void 0;
	if (!schemaRecord) return inlinedSchema;
	const normalizedProvider = normalizeLowercaseStringOrEmpty(options?.modelProvider);
	const normalizedModelId = normalizeLowercaseStringOrEmpty(options?.modelId);
	const normalizedToolSchemaProfile = normalizeLowercaseStringOrEmpty(options?.modelCompat?.toolSchemaProfile);
	const isGeminiProvider = normalizedProvider.includes("google") || normalizedProvider.includes("gemini") || isGeminiModelId(normalizedModelId) || normalizedToolSchemaProfile === "gemini";
	const isAnthropicProvider = normalizedProvider.includes("anthropic");
	const unsupportedToolSchemaKeywords = resolveUnsupportedToolSchemaKeywords(options?.modelCompat);
	const omitEmptyArrayItems = shouldOmitEmptyArrayItems(options?.modelCompat);
	function applyProviderCleaning(s) {
		const normalizedSchema = normalizeArraySchemasMissingItems(s);
		const arrayItemsCompatibleSchema = omitEmptyArrayItems ? stripEmptyArrayItemsFromArraySchemas(normalizedSchema) : normalizedSchema;
		if (isGeminiProvider && !isAnthropicProvider) {
			const geminiCompatibleSchema = cleanSchemaForGemini(arrayItemsCompatibleSchema);
			return unsupportedToolSchemaKeywords.size > 0 ? stripUnsupportedSchemaKeywords(geminiCompatibleSchema, unsupportedToolSchemaKeywords) : geminiCompatibleSchema;
		}
		if (unsupportedToolSchemaKeywords.size > 0) return stripUnsupportedSchemaKeywords(arrayItemsCompatibleSchema, unsupportedToolSchemaKeywords);
		return arrayItemsCompatibleSchema;
	}
	const conditionalKey = getTopLevelConditionalKey(schemaRecord);
	const flattenableVariantKey = getFlattenableVariantKey(schemaRecord);
	if (hasTopLevelObjectSchema(schemaRecord, conditionalKey)) return applyProviderCleaning(schemaRecord);
	if (isObjectLikeSchemaMissingType(schemaRecord, conditionalKey)) return applyProviderCleaning({
		...schemaRecord,
		type: "object",
		properties: isRecord(schemaRecord.properties) ? schemaRecord.properties : {}
	});
	if (isTypedObjectSchemaMissingValidProperties(schemaRecord, conditionalKey)) return applyProviderCleaning({
		...schemaRecord,
		properties: {}
	});
	if (!flattenableVariantKey) {
		if (isTrulyEmptySchema(schemaRecord)) return applyProviderCleaning({
			type: "object",
			properties: {}
		});
		if (conditionalKey === "allOf") return applyProviderCleaning(inlinedSchema);
		return applyProviderCleaning(inlinedSchema);
	}
	const variants = schemaRecord[flattenableVariantKey];
	const mergedProperties = {};
	const requiredCounts = /* @__PURE__ */ new Map();
	let objectVariants = 0;
	for (const entry of variants) {
		if (!entry || typeof entry !== "object") continue;
		const props = entry.properties;
		if (!props || typeof props !== "object") continue;
		objectVariants += 1;
		for (const [key, value] of Object.entries(props)) {
			if (!(key in mergedProperties)) {
				mergedProperties[key] = value;
				continue;
			}
			mergedProperties[key] = mergePropertySchemas(mergedProperties[key], value);
		}
		const required = Array.isArray(entry.required) ? entry.required : [];
		for (const key of required) {
			if (typeof key !== "string") continue;
			requiredCounts.set(key, (requiredCounts.get(key) ?? 0) + 1);
		}
	}
	const baseRequired = Array.isArray(schemaRecord.required) ? schemaRecord.required.filter((key) => typeof key === "string") : void 0;
	const mergedRequired = baseRequired && baseRequired.length > 0 ? baseRequired : objectVariants > 0 ? Array.from(requiredCounts.entries()).filter(([, count]) => count === objectVariants).map(([key]) => key) : void 0;
	const nextSchema = { ...schemaRecord };
	return applyProviderCleaning({
		type: "object",
		...typeof nextSchema.title === "string" ? { title: nextSchema.title } : {},
		...typeof nextSchema.description === "string" ? { description: nextSchema.description } : {},
		properties: Object.keys(mergedProperties).length > 0 ? mergedProperties : schemaRecord.properties ?? {},
		...mergedRequired && mergedRequired.length > 0 ? { required: mergedRequired } : {},
		additionalProperties: "additionalProperties" in schemaRecord ? schemaRecord.additionalProperties : true
	});
}
/** Return a provider-compatible JSON schema for a model-facing tool. */
function normalizeToolParameterSchema(schema, options) {
	if (!schema || typeof schema !== "object") return normalizeToolParameterSchemaUncached(schema, options);
	const cacheKey = resolveToolParameterSchemaCacheKey(options);
	const cached = getCachedToolParameterSchema(schema, cacheKey);
	if (cached) return cached;
	return rememberCachedToolParameterSchema(schema, cacheKey, normalizeToolParameterSchemaUncached(schema, options));
}
//#endregion
//#region packages/ai/src/providers/openai-reasoning-effort.ts
/**
* OpenAI-compatible reasoning-effort normalization. Different GPT families
* expose different accepted effort enums, so callers map requested values here
* before constructing provider payloads.
*/
const GPT_5_REASONING_EFFORTS = [
	"minimal",
	"low",
	"medium",
	"high"
];
const GPT_51_REASONING_EFFORTS = [
	"none",
	"low",
	"medium",
	"high"
];
const GPT_52_REASONING_EFFORTS = [
	"none",
	"low",
	"medium",
	"high",
	"xhigh"
];
const GPT_56_REASONING_EFFORTS = [
	"none",
	"low",
	"medium",
	"high",
	"xhigh",
	"max"
];
const GPT_CODEX_REASONING_EFFORTS = [
	"low",
	"medium",
	"high",
	"xhigh"
];
const GPT_PRO_REASONING_EFFORTS = [
	"medium",
	"high",
	"xhigh"
];
const GPT_5_PRO_REASONING_EFFORTS = ["high"];
const GPT_51_CODEX_MAX_REASONING_EFFORTS = [
	"none",
	"medium",
	"high",
	"xhigh"
];
const GPT_51_CODEX_MINI_REASONING_EFFORTS = ["medium"];
const GENERIC_REASONING_EFFORTS = [
	"low",
	"medium",
	"high"
];
function normalizeModelId(id) {
	return normalizeLowercaseStringOrEmpty(id ?? "").replace(/-\d{4}-\d{2}-\d{2}$/u, "");
}
/** Return whether a model is the GPT-5.4 mini family. */
function isOpenAIGpt54MiniModel(model) {
	const id = normalizeModelId(typeof model.id === "string" ? model.id : void 0);
	return /^gpt-5\.4-mini(?:-|$)/u.test(id);
}
/** Return whether a model is the GPT-5.5 family. */
function isOpenAIGpt55Model(model) {
	const id = normalizeModelId(typeof model.id === "string" ? model.id : void 0);
	const name = normalizeModelId(typeof model.name === "string" ? model.name : void 0);
	return /^gpt-5\.5(?:-|$)/u.test(id) || /^gpt-5\.5(?:\s|\(|-|$)/u.test(name);
}
/** Return whether a model is the GPT-5.6 family. */
function isOpenAIGpt56Model(model) {
	const id = normalizeModelId(typeof model.id === "string" ? model.id : void 0);
	const name = normalizeModelId(typeof model.name === "string" ? model.name : void 0);
	return /^gpt-5\.6(?:-|$)/u.test(id) || /^gpt-5\.6(?:\s|\(|-|$)/u.test(name);
}
/** Normalize user-facing reasoning effort names to API effort names. */
function normalizeOpenAIReasoningEffort(effort) {
	return effort === "minimal" ? "minimal" : effort;
}
function readCompatReasoningEfforts(compat) {
	if (!compat || typeof compat !== "object") return;
	if (compat.supportsReasoningEffort === false) return [];
	const raw = compat.supportedReasoningEfforts;
	if (!Array.isArray(raw)) return;
	const supported = uniqueStrings(normalizeStringEntries(raw.filter((value) => typeof value === "string")));
	return supported.length > 0 ? supported : void 0;
}
function isDisabledReasoningEffort(effort) {
	return effort === "none" || effort === "off";
}
/** Resolve the reasoning efforts accepted by a specific OpenAI-compatible model. */
function resolveOpenAISupportedReasoningEfforts(model) {
	const compatEfforts = readCompatReasoningEfforts(model.compat);
	if (compatEfforts) return compatEfforts;
	const id = normalizeModelId(typeof model.id === "string" ? model.id : void 0);
	if (/^gpt-5\.6(?:-|$)/u.test(id)) return GPT_56_REASONING_EFFORTS;
	if (id === "gpt-5.1-codex-mini") return GPT_51_CODEX_MINI_REASONING_EFFORTS;
	if (id === "gpt-5.1-codex-max") return GPT_51_CODEX_MAX_REASONING_EFFORTS;
	if (/^gpt-5(?:\.\d+)?-codex(?:-|$)/u.test(id)) return GPT_CODEX_REASONING_EFFORTS;
	if (id === "gpt-5-pro") return GPT_5_PRO_REASONING_EFFORTS;
	if (/^gpt-5\.[2-9](?:\.\d+)?-pro(?:-|$)/u.test(id)) return GPT_PRO_REASONING_EFFORTS;
	if (/^gpt-5\.[2-9](?:\.\d+)?(?:-|$)/u.test(id)) return GPT_52_REASONING_EFFORTS;
	if (/^gpt-5\.1(?:-|$)/u.test(id)) return GPT_51_REASONING_EFFORTS;
	if (/^gpt-5(?:-|$)/u.test(id)) return GPT_5_REASONING_EFFORTS;
	return GENERIC_REASONING_EFFORTS;
}
/** Return whether a model accepts a requested reasoning effort. */
function supportsOpenAIReasoningEffort(model, effort) {
	return resolveOpenAISupportedReasoningEfforts(model).includes(normalizeOpenAIReasoningEffort(effort));
}
/** Resolve a requested reasoning effort to the closest value supported by the model. */
function resolveOpenAIReasoningEffortForModel(params) {
	const requested = normalizeOpenAIReasoningEffort(params.effort);
	const normalized = normalizeOpenAIReasoningEffort(params.fallbackMap?.[requested] ?? requested);
	const supported = resolveOpenAISupportedReasoningEfforts(params.model);
	if (supported.includes(normalized)) return normalized;
	if (requested === "off" && supported.includes("none")) return "none";
	if (isDisabledReasoningEffort(requested) || isDisabledReasoningEffort(normalized)) return;
	if (requested === "minimal" && supported.includes("low")) return "low";
	if ((requested === "minimal" || requested === "low") && supported.includes("medium")) return "medium";
	if (requested === "xhigh" && supported.includes("high")) return "high";
	if (requested === "max" && supported.includes("xhigh")) return "xhigh";
	return supported.find((effort) => effort !== "none");
}
//#endregion
//#region packages/ai/src/providers/openai-responses-stream-compat.ts
const OPENAI_RESPONSES_OUTPUT_TEXT_CONTENT_PART_TYPE = "output_text";
const AZURE_RESPONSES_TEXT_CONTENT_PART_TYPE = "text";
const OPENAI_RESPONSES_OUTPUT_TEXT_DELTA_EVENT_TYPE = "response.output_text.delta";
const AZURE_RESPONSES_TEXT_DELTA_EVENT_TYPE = "response.text.delta";
function isResponsesTextContentPartType(type) {
	return type === "output_text" || type === "text";
}
function isResponsesTextDeltaEventType(type) {
	return type === "response.output_text.delta" || type === "response.text.delta";
}
function isAzureResponsesTextDeltaEventType(type) {
	return type === AZURE_RESPONSES_TEXT_DELTA_EVENT_TYPE;
}
function isAzureResponsesTextDeltaEvent(event) {
	return isAzureResponsesTextDeltaEventType(event.type) && typeof event.delta === "string";
}
function resolveResponsesMessageSnapshotCollapse(params) {
	const { prior, nextText } = params;
	if (!prior?.text || !nextText || prior.phase !== params.nextPhase) return { kind: "keep" };
	if (nextText.length > prior.text.length && nextText.startsWith(prior.text)) return {
		kind: "extend",
		text: nextText
	};
	return { kind: "keep" };
}
//#endregion
//#region packages/ai/src/providers/openai-tool-schema.ts
/**
* OpenAI strict JSON-schema normalization for tool inventories and request payloads.
*
* Caches normalized object inputs by provider compatibility so repeated inventory builds preserve identity.
*/
const MAX_STRICT_SCHEMA_CACHE_ENTRIES_PER_SCHEMA = 8;
let strictOpenAISchemaCache = /* @__PURE__ */ new WeakMap();
function resolveToolSchemaModelCompat(compat) {
	if (!compat) return;
	const unsupportedToolSchemaKeywords = Array.isArray(compat.unsupportedToolSchemaKeywords) ? compat.unsupportedToolSchemaKeywords.filter((keyword) => typeof keyword === "string") : [];
	if (unsupportedToolSchemaKeywords.length === 0 && compat.omitEmptyArrayItems !== true) return;
	return {
		...unsupportedToolSchemaKeywords.length > 0 ? { unsupportedToolSchemaKeywords } : {},
		...compat.omitEmptyArrayItems === true ? { omitEmptyArrayItems: true } : {}
	};
}
function resolveStrictOpenAISchemaCacheKey(modelCompat) {
	const compat = resolveToolSchemaModelCompat(modelCompat);
	return JSON.stringify([[...compat?.unsupportedToolSchemaKeywords ?? []].toSorted(), shouldOmitEmptyArrayItems(compat)]);
}
function readCachedStrictOpenAISchema(schema, key) {
	return strictOpenAISchemaCache.get(schema)?.find((entry) => entry.key === key)?.value;
}
function rememberStrictOpenAISchema(schema, key, value) {
	const entries = strictOpenAISchemaCache.get(schema) ?? [];
	strictOpenAISchemaCache.set(schema, [{
		key,
		value
	}, ...entries.filter((entry) => entry.key !== key)].slice(0, MAX_STRICT_SCHEMA_CACHE_ENTRIES_PER_SCHEMA));
	return value;
}
function clearOpenAIToolSchemaCacheForTest() {
	strictOpenAISchemaCache = /* @__PURE__ */ new WeakMap();
}
/** Normalizes a tool parameter schema into the OpenAI strict JSON-schema subset. */
function normalizeStrictOpenAIJsonSchema(schema, modelCompat) {
	const schemaInput = schema ?? {};
	if (!schemaInput || typeof schemaInput !== "object") return normalizeStrictOpenAIJsonSchemaRecursive(normalizeToolParameterSchema(schemaInput, { modelCompat: resolveToolSchemaModelCompat(modelCompat) }), 0);
	const cacheKey = resolveStrictOpenAISchemaCacheKey(modelCompat);
	const cached = readCachedStrictOpenAISchema(schemaInput, cacheKey);
	if (cached !== void 0) return cached;
	return rememberStrictOpenAISchema(schemaInput, cacheKey, normalizeStrictOpenAIJsonSchemaRecursive(normalizeToolParameterSchema(schemaInput, { modelCompat: resolveToolSchemaModelCompat(modelCompat) }), 0));
}
function normalizeStrictOpenAIJsonSchemaRecursive(schema, depth) {
	if (Array.isArray(schema)) {
		let changed = false;
		const normalized = schema.map((entry) => {
			const next = normalizeStrictOpenAIJsonSchemaRecursive(entry, depth);
			changed ||= next !== entry;
			return next;
		});
		return changed ? normalized : schema;
	}
	if (!schema || typeof schema !== "object") return schema;
	const record = schema;
	let changed = false;
	const normalized = {};
	for (const [key, value] of Object.entries(record)) {
		const next = normalizeStrictOpenAIJsonSchemaRecursive(value, key === "properties" ? depth : depth + 1);
		normalized[key] = next;
		changed ||= next !== value;
	}
	if (normalized.type === "object") {
		const properties = normalized.properties && typeof normalized.properties === "object" && !Array.isArray(normalized.properties) ? normalized.properties : void 0;
		if (properties && Object.keys(properties).length === 0 && !Array.isArray(normalized.required)) {
			normalized.required = [];
			changed = true;
		}
		if (depth === 0 && !("additionalProperties" in normalized)) {
			normalized.additionalProperties = false;
			changed = true;
		}
	}
	return changed ? normalized : schema;
}
/** Normalizes tool parameters using strict OpenAI rules only when strict mode is active. */
function normalizeOpenAIStrictToolParameters(schema, strict, modelCompat) {
	const toolSchemaCompat = resolveToolSchemaModelCompat(modelCompat);
	if (!strict) return normalizeToolParameterSchema(schema ?? {}, { modelCompat: toolSchemaCompat });
	return normalizeStrictOpenAIJsonSchema(schema, toolSchemaCompat);
}
/** Returns whether a schema already satisfies OpenAI strict tool-schema constraints. */
function isStrictOpenAIJsonSchemaCompatible(schema) {
	return isStrictOpenAIJsonSchemaCompatibleRecursive(normalizeStrictOpenAIJsonSchema(schema));
}
/** Returns strict-schema diagnostics for an already materialized OpenAI tool projection. */
function findOpenAIStrictToolProjectionDiagnostics(projection) {
	return [...projection.diagnostics.map((diagnostic) => ({
		toolIndex: diagnostic.toolIndex,
		...diagnostic.toolName ? { toolName: diagnostic.toolName } : {},
		violations: [...diagnostic.violations]
	})), ...projection.tools.flatMap((tool) => {
		const violations = findStrictOpenAIJsonSchemaViolations(normalizeStrictOpenAIJsonSchema(tool.parameters), `${tool.name}.parameters`);
		return violations.length > 0 ? [{
			toolIndex: tool.toolIndex,
			toolName: tool.name,
			violations
		}] : [];
	})];
}
function isStrictOpenAIJsonSchemaCompatibleRecursive(schema) {
	if (Array.isArray(schema)) return schema.every((entry) => isStrictOpenAIJsonSchemaCompatibleRecursive(entry));
	if (!schema || typeof schema !== "object") return true;
	const record = schema;
	if ("anyOf" in record || "oneOf" in record || "allOf" in record) return false;
	if (Array.isArray(record.type)) return false;
	if (record.type === "object" && record.additionalProperties !== false) return false;
	if (record.type === "object") {
		const properties = record.properties && typeof record.properties === "object" && !Array.isArray(record.properties) ? record.properties : {};
		const required = Array.isArray(record.required) ? record.required.filter((entry) => typeof entry === "string") : void 0;
		if (!required) return false;
		const requiredSet = new Set(required);
		if (Object.keys(properties).some((key) => !requiredSet.has(key))) return false;
	}
	return Object.entries(record).every(([key, entry]) => {
		if (key === "properties" && entry && typeof entry === "object" && !Array.isArray(entry)) return Object.values(entry).every((value) => isStrictOpenAIJsonSchemaCompatibleRecursive(value));
		return isStrictOpenAIJsonSchemaCompatibleRecursive(entry);
	});
}
function findStrictOpenAIJsonSchemaViolations(schema, path) {
	if (Array.isArray(schema)) return schema.flatMap((entry, index) => findStrictOpenAIJsonSchemaViolations(entry, `${path}[${index}]`));
	if (!schema || typeof schema !== "object") return [];
	const record = schema;
	const violations = [];
	for (const key of [
		"anyOf",
		"oneOf",
		"allOf"
	]) if (key in record) violations.push(`${path}.${key}`);
	if (Array.isArray(record.type)) violations.push(`${path}.type`);
	if (record.type === "object") {
		if (record.additionalProperties !== false) violations.push(`${path}.additionalProperties`);
		const properties = record.properties && typeof record.properties === "object" && !Array.isArray(record.properties) ? record.properties : {};
		const required = Array.isArray(record.required) ? record.required.filter((entry) => typeof entry === "string") : void 0;
		if (!required) violations.push(`${path}.required`);
		else {
			const requiredSet = new Set(required);
			for (const key of Object.keys(properties)) if (!requiredSet.has(key)) violations.push(`${path}.required.${key}`);
		}
	}
	if (record.properties && typeof record.properties === "object" && !Array.isArray(record.properties)) for (const [key, value] of Object.entries(record.properties)) violations.push(...findStrictOpenAIJsonSchemaViolations(value, `${path}.properties.${key}`));
	for (const [key, value] of Object.entries(record)) {
		if (key === "properties") continue;
		if (value && typeof value === "object") violations.push(...findStrictOpenAIJsonSchemaViolations(value, `${path}.${key}`));
	}
	return violations;
}
/** Resolves strict mode for the projected tools that will be emitted in the request payload. */
function resolveOpenAIProjectedToolsStrictToolFlag(projection, strict) {
	if (strict !== true) return strict === false ? false : void 0;
	return projection.tools.every((tool) => isStrictOpenAIJsonSchemaCompatible(tool.parameters));
}
//#endregion
//#region packages/ai/src/providers/openai-responses-tools.ts
const LOG_SUBSYSTEM = "llm/openai-responses";
const MAX_STRICT_TOOL_DOWNGRADE_DIAGNOSTIC_KEYS = 64;
const loggedStrictToolDowngradeDiagnosticKeys = /* @__PURE__ */ new Set();
/** Converts and returns the projection used to reconcile tool choices. */
function convertResponsesToolPayload(tools, options) {
	const projection = projectOpenAITools(tools);
	const strict = resolveResponsesStrictToolFlag(projection, resolveResponsesStrictToolSetting(options), options?.model);
	return {
		projection,
		tools: sortResponsesToolsByName(projection.tools).map((tool) => {
			const result = {
				type: "function",
				name: tool.name,
				description: tool.description,
				parameters: normalizeOpenAIStrictToolParameters(tool.parameters, strict === true, options?.model?.compat)
			};
			if (strict !== void 0) result.strict = strict;
			return result;
		})
	};
}
function resolveResponsesStrictToolSetting(options) {
	if (options?.strict !== void 0) return options.strict;
	if (options?.model) return getAiTransportHost().resolveOpenAIStrictToolSetting(options.model, {
		transport: "stream",
		supportsStrictMode: options.supportsStrictMode
	});
	return false;
}
function resolveResponsesStrictToolFlag(projection, strictSetting, model) {
	const strict = resolveOpenAIProjectedToolsStrictToolFlag(projection, strictSetting);
	if (strictSetting === true && strict === false && model) getAiTransportHost().logDebug(LOG_SUBSYSTEM, () => {
		const diagnostics = findOpenAIStrictToolProjectionDiagnostics(projection);
		if (!shouldLogStrictToolDowngradeDiagnostic(diagnostics, model)) return null;
		const sample = diagnostics.slice(0, 5).map((entry) => ({
			tool: entry.toolName ?? `tool[${entry.toolIndex}]`,
			violations: entry.violations.slice(0, 8)
		}));
		return {
			message: `OpenAI responses tool schema strict mode downgraded to strict=false for ${model.provider ?? "unknown"}/${model.id ?? "unknown"} because ${diagnostics.length} tool schema(s) are not strict-compatible`,
			data: {
				provider: model.provider,
				model: model.id,
				incompatibleToolCount: diagnostics.length,
				sample
			}
		};
	});
	return strict;
}
function shouldLogStrictToolDowngradeDiagnostic(diagnostics, model) {
	const key = createHash("sha256").update(JSON.stringify({
		provider: model.provider,
		model: model.id,
		diagnostics: diagnostics.map((entry) => ({
			toolIndex: entry.toolIndex,
			toolName: entry.toolName ?? null,
			violations: entry.violations
		}))
	})).digest("hex");
	if (loggedStrictToolDowngradeDiagnosticKeys.has(key)) return false;
	if (loggedStrictToolDowngradeDiagnosticKeys.size >= MAX_STRICT_TOOL_DOWNGRADE_DIAGNOSTIC_KEYS) loggedStrictToolDowngradeDiagnosticKeys.clear();
	loggedStrictToolDowngradeDiagnosticKeys.add(key);
	return true;
}
function compareToolText(left, right) {
	const leftText = left ?? "";
	const rightText = right ?? "";
	if (leftText < rightText) return -1;
	if (leftText > rightText) return 1;
	return 0;
}
function sortResponsesToolsByName(tools) {
	return tools.toSorted((left, right) => compareToolText(left.name, right.name) || compareToolText(left.description, right.description));
}
//#endregion
//#region packages/ai/src/providers/openai-responses-shared.ts
const EMPTY_TOOL_RESULT_TEXT = "(no output)";
function sanitizeToolResultText(text, fallback) {
	const sanitized = sanitizeSurrogates(text);
	return sanitized.trim().length > 0 ? sanitized : fallback;
}
function normalizeResponsesReasoningReplayItem(params) {
	const next = { ...params.item };
	if (!Array.isArray(next.summary)) next.summary = [];
	if (!params.replayResponsesItemIds) delete next.id;
	return next;
}
function encodeTextSignatureV1(id, phase) {
	const payload = {
		v: 1,
		id
	};
	if (phase) payload.phase = phase;
	return JSON.stringify(payload);
}
function parseTextSignature(signature) {
	if (!signature) return;
	if (signature.startsWith("{")) try {
		const parsed = JSON.parse(signature);
		if (parsed.v === 1) {
			const id = typeof parsed.id === "string" ? parsed.id : void 0;
			const phase = parsed.phase === "commentary" || parsed.phase === "final_answer" ? parsed.phase : void 0;
			if (id !== void 0 || phase !== void 0) return {
				id,
				phase
			};
			return;
		}
	} catch {}
	return { id: signature };
}
function resolveReplayableResponsesMessageId(params) {
	if (!params.textSignatureId) return params.fallbackOrdinal === 0 ? params.fallbackId : `${params.fallbackId}_${params.fallbackOrdinal}`;
	return params.previousReplayItemWasReasoning ? params.textSignatureId : void 0;
}
function isResponsesReasoningEffort(effort) {
	return effort === "minimal" || effort === "low" || effort === "medium" || effort === "high" || effort === "xhigh" || effort === "max";
}
function convertResponsesMessages(model, context, allowedToolCallProviders, options) {
	const messages = [];
	const shouldReplayResponsesItemIds = options?.replayResponsesItemIds ?? true;
	const normalizeIdPart = (part) => {
		const sanitized = part.replace(/[^a-zA-Z0-9_-]/g, "_");
		return (sanitized.length > 64 ? sanitized.slice(0, 64) : sanitized).replace(/_+$/, "");
	};
	const buildForeignResponsesItemId = (itemId) => {
		const normalized = `fc_${shortHash(itemId)}`;
		return normalized.length > 64 ? normalized.slice(0, 64) : normalized;
	};
	const normalizeToolCallId = (id, targetModel, source) => {
		if (!allowedToolCallProviders.has(model.provider)) return normalizeIdPart(id);
		if (!id.includes("|")) return normalizeIdPart(id);
		const [callId, itemId] = id.split("|");
		const normalizedCallId = normalizeIdPart(callId);
		let normalizedItemId = source.provider !== model.provider || source.api !== model.api ? buildForeignResponsesItemId(itemId) : normalizeIdPart(itemId);
		if (!normalizedItemId.startsWith("fc_")) normalizedItemId = normalizeIdPart(`fc_${normalizedItemId}`);
		return `${normalizedCallId}|${normalizedItemId}`;
	};
	const transformedMessages = transformMessages(context.messages, model, normalizeToolCallId);
	if ((options?.includeSystemPrompt ?? true) && context.systemPrompt) {
		const role = model.reasoning ? "developer" : "system";
		messages.push({
			type: "message",
			role,
			content: [{
				type: "input_text",
				text: sanitizeSurrogates(stripSystemPromptCacheBoundary(context.systemPrompt))
			}]
		});
	}
	let msgIndex = 0;
	for (const msg of transformedMessages) {
		if (msg.role === "user") if (typeof msg.content === "string") messages.push({
			type: "message",
			role: "user",
			content: [{
				type: "input_text",
				text: sanitizeSurrogates(msg.content)
			}]
		});
		else {
			const content = msg.content.map((item) => {
				if (item.type === "text") return {
					type: "input_text",
					text: sanitizeSurrogates(item.text)
				};
				return {
					type: "input_image",
					detail: "auto",
					image_url: `data:${item.mimeType};base64,${item.data}`
				};
			});
			if (content.length === 0) continue;
			messages.push({
				type: "message",
				role: "user",
				content
			});
		}
		else if (msg.role === "assistant") {
			const output = [];
			let textFallbackOrdinal = 0;
			const assistantMsg = msg;
			let previousReplayItemWasReasoning = false;
			const isDifferentModel = assistantMsg.model !== model.id && assistantMsg.provider === model.provider && assistantMsg.api === model.api;
			for (const block of msg.content) if (block.type === "thinking") {
				if (block.thinkingSignature) {
					const reasoningItem = normalizeResponsesReasoningReplayItem({
						item: JSON.parse(block.thinkingSignature),
						replayResponsesItemIds: shouldReplayResponsesItemIds
					});
					output.push(reasoningItem);
					previousReplayItemWasReasoning = true;
				}
			} else if (block.type === "text") {
				const textBlock = block;
				const parsedSignature = parseTextSignature(textBlock.textSignature);
				let msgId = shouldReplayResponsesItemIds ? resolveReplayableResponsesMessageId({
					textSignatureId: parsedSignature?.id,
					fallbackId: `msg_${msgIndex}`,
					fallbackOrdinal: textFallbackOrdinal,
					previousReplayItemWasReasoning
				}) : void 0;
				if (!parsedSignature?.id) textFallbackOrdinal += 1;
				if (msgId && msgId.length > 64) msgId = `msg_${shortHash(msgId)}`;
				const messageItem = {
					type: "message",
					role: "assistant",
					content: [{
						type: "output_text",
						text: sanitizeSurrogates(textBlock.text),
						annotations: []
					}],
					status: "completed",
					...msgId ? { id: msgId } : {},
					phase: parsedSignature?.phase
				};
				output.push(messageItem);
				previousReplayItemWasReasoning = false;
			} else if (block.type === "toolCall") {
				const toolCall = block;
				const [callId, itemIdRaw] = toolCall.id.split("|");
				let itemId = shouldReplayResponsesItemIds ? itemIdRaw : void 0;
				if (shouldReplayResponsesItemIds && isDifferentModel && itemId?.startsWith("fc_")) itemId = void 0;
				output.push({
					type: "function_call",
					...itemId ? { id: itemId } : {},
					call_id: callId,
					name: toolCall.name,
					arguments: JSON.stringify(toolCall.arguments)
				});
				previousReplayItemWasReasoning = false;
			}
			if (output.length === 0) continue;
			messages.push(...output);
		} else if (msg.role === "toolResult") {
			const textResult = extractToolResultText(msg.content);
			const sanitizedTextResult = sanitizeSurrogates(textResult);
			const hasImages = msg.content.some((c) => c.type === "image");
			const mediaPlaceholder = describeToolResultMediaPlaceholder(msg.content);
			const hasText = sanitizedTextResult.trim().length > 0;
			const [callId] = msg.toolCallId.split("|");
			let output;
			if (hasImages && model.input.includes("image")) {
				const contentParts = [];
				if (hasText) contentParts.push({
					type: "input_text",
					text: sanitizedTextResult
				});
				else if (mediaPlaceholder === "(see attached media)") contentParts.push({
					type: "input_text",
					text: mediaPlaceholder
				});
				for (const block of msg.content) if (block.type === "image") contentParts.push({
					type: "input_image",
					detail: "auto",
					image_url: `data:${block.mimeType};base64,${block.data}`
				});
				output = contentParts;
			} else output = sanitizeToolResultText(textResult, mediaPlaceholder ?? EMPTY_TOOL_RESULT_TEXT);
			messages.push({
				type: "function_call_output",
				call_id: callId,
				output
			});
		}
		msgIndex++;
	}
	return messages;
}
function createResponsesAssistantOutput(model, api = model.api) {
	return {
		role: "assistant",
		content: [],
		api,
		provider: model.provider,
		model: model.id,
		usage: {
			input: 0,
			output: 0,
			cacheRead: 0,
			cacheWrite: 0,
			totalTokens: 0,
			cost: {
				input: 0,
				output: 0,
				cacheRead: 0,
				cacheWrite: 0,
				total: 0
			}
		},
		stopReason: "stop",
		timestamp: Date.now()
	};
}
function resolveResponsesReasoningEffort(model, reasoning) {
	const clampedReasoning = reasoning ? clampThinkingLevel(model, reasoning) : void 0;
	if (!clampedReasoning || clampedReasoning === "off") return;
	if (clampedReasoning === "max") return supportsOpenAIReasoningEffort(model, "max") ? "max" : "xhigh";
	if (clampedReasoning === "minimal" && model.provider === "openai" && supportsOpenAIReasoningEffort(model, "max")) {
		const effort = resolveOpenAIReasoningEffortForModel({
			model,
			effort: "minimal"
		});
		return isResponsesReasoningEffort(effort) ? effort : void 0;
	}
	return clampedReasoning;
}
function applyCommonResponsesParams(params, model, context, options, config) {
	if (options?.maxTokens) params.max_output_tokens = options.maxTokens;
	if (options?.temperature !== void 0) params.temperature = options.temperature;
	if (context.tools) {
		const converted = convertResponsesToolPayload(context.tools, { model });
		if (converted.tools.length > 0) params.tools = converted.tools;
	}
	if (!model.reasoning) return;
	if (options?.reasoningEffort || options?.reasoningSummary) {
		params.reasoning = {
			effort: options?.reasoningEffort ? model.thinkingLevelMap?.[options.reasoningEffort] ?? options.reasoningEffort : "medium",
			summary: options?.reasoningSummary || "auto"
		};
		params.include = ["reasoning.encrypted_content"];
	} else if ((config?.setDefaultReasoningOff ?? true) && model.thinkingLevelMap?.off !== null) params.reasoning = { effort: model.thinkingLevelMap?.off ?? "none" };
}
function buildResponsesRequestOptions(options) {
	return {
		...options?.signal ? { signal: options.signal } : {},
		...options?.timeoutMs !== void 0 ? { timeout: options.timeoutMs } : {},
		...options?.maxRetries !== void 0 ? { maxRetries: options.maxRetries } : {}
	};
}
function cleanStreamingScratchBuffers(output) {
	for (const block of output.content) {
		delete block.index;
		delete block.partialJson;
	}
}
async function runResponsesStreamLifecycle(params) {
	const { stream, model, output, options } = params;
	let firstEventAbort;
	try {
		const client = params.createClient();
		let requestParams = params.buildParams();
		const nextParams = await options?.onPayload?.(requestParams, model);
		if (nextParams !== void 0) requestParams = nextParams;
		firstEventAbort = createFirstStreamEventAbortController(options?.signal);
		const { data: openaiStream, response } = await client.responses.create(requestParams, {
			...buildResponsesRequestOptions(options),
			signal: firstEventAbort.signal
		}).withResponse();
		await options?.onResponse?.({
			status: response.status,
			headers: headersToRecord(response.headers)
		}, model);
		stream.push({
			type: "start",
			partial: output
		});
		const firstEventTimeoutMs = getFirstStreamEventTimeoutMs(options);
		const onFirstEventTimeout = getFirstStreamEventTimeoutHandler(options);
		await processResponsesStream(openaiStream, output, stream, model, params.processStreamOptions || firstEventTimeoutMs !== void 0 || onFirstEventTimeout !== void 0 ? {
			...params.processStreamOptions,
			firstEventTimeoutMs: params.processStreamOptions?.firstEventTimeoutMs ?? firstEventTimeoutMs,
			abortFirstEventStream: params.processStreamOptions?.abortFirstEventStream ?? firstEventAbort.abort,
			onFirstEventTimeout: params.processStreamOptions?.onFirstEventTimeout ?? onFirstEventTimeout
		} : void 0);
		if (options?.signal?.aborted) throw new Error("Request was aborted");
		if (output.stopReason === "aborted" || output.stopReason === "error") throw new Error("An unknown error occurred");
		stream.push({
			type: "done",
			reason: output.stopReason,
			message: output
		});
		stream.end();
	} catch (error) {
		cleanStreamingScratchBuffers(output);
		output.stopReason = options?.signal?.aborted ? "aborted" : "error";
		output.errorMessage = params.formatError(error);
		stream.push({
			type: "error",
			reason: output.stopReason,
			error: output
		});
		stream.end();
	} finally {
		firstEventAbort?.dispose();
	}
}
async function processResponsesStream(openaiStream, output, stream, model, options) {
	let currentItem = null;
	let currentBlock = null;
	let lastTextBlock = null;
	let pendingMessageText = null;
	const blocks = output.content;
	const blockIndex = () => blocks.length - 1;
	const appendPendingMessageDelta = (delta) => {
		pendingMessageText = `${pendingMessageText ?? ""}${delta}`;
		const priorText = lastTextBlock?.block.text ?? "";
		if (priorText.startsWith(pendingMessageText) || pendingMessageText.startsWith(priorText)) return;
		currentBlock = {
			type: "text",
			text: pendingMessageText
		};
		blocks.push(currentBlock);
		stream.push({
			type: "text_start",
			contentIndex: blockIndex(),
			partial: output
		});
		stream.push({
			type: "text_delta",
			contentIndex: blockIndex(),
			delta: pendingMessageText,
			partial: output
		});
		pendingMessageText = null;
	};
	const guardedStream = withFirstStreamEventTimeout(openaiStream, {
		provider: model.provider,
		api: model.api,
		model: model.id,
		timeoutMs: options?.firstEventTimeoutMs ?? 0,
		stage: "responses",
		abort: options?.abortFirstEventStream,
		onTimeout: options?.onFirstEventTimeout,
		hint: "The provider may be stalled while parsing the tool payload; retry with a smaller tool surface or enable OPENCLAW_DEBUG_MODEL_PAYLOAD=tools to inspect exposed tools."
	});
	for await (const event of guardedStream) if (event.type === "response.created") output.responseId = event.response.id;
	else if (event.type === "response.output_item.added") {
		const item = event.item;
		if (item.type !== "message") {
			lastTextBlock = null;
			pendingMessageText = null;
		}
		if (item.type === "reasoning") {
			currentItem = item;
			currentBlock = {
				type: "thinking",
				thinking: ""
			};
			output.content.push(currentBlock);
			stream.push({
				type: "thinking_start",
				contentIndex: blockIndex(),
				partial: output
			});
		} else if (item.type === "message") {
			currentItem = item;
			if (lastTextBlock) {
				currentBlock = null;
				pendingMessageText = "";
			} else {
				currentBlock = {
					type: "text",
					text: ""
				};
				output.content.push(currentBlock);
				stream.push({
					type: "text_start",
					contentIndex: blockIndex(),
					partial: output
				});
			}
		} else if (item.type === "function_call") {
			currentItem = item;
			currentBlock = {
				type: "toolCall",
				id: `${item.call_id}|${item.id}`,
				name: item.name,
				arguments: {},
				partialJson: item.arguments || ""
			};
			output.content.push(currentBlock);
			stream.push({
				type: "toolcall_start",
				contentIndex: blockIndex(),
				partial: output
			});
		}
	} else if (event.type === "response.reasoning_summary_part.added") {
		if (currentItem && currentItem.type === "reasoning") {
			currentItem.summary = currentItem.summary || [];
			currentItem.summary.push(event.part);
		}
	} else if (event.type === "response.reasoning_summary_text.delta") {
		if (currentItem?.type === "reasoning" && currentBlock?.type === "thinking") {
			currentItem.summary = currentItem.summary || [];
			const lastPart = currentItem.summary[currentItem.summary.length - 1];
			if (lastPart) {
				currentBlock.thinking += event.delta;
				lastPart.text += event.delta;
				stream.push({
					type: "thinking_delta",
					contentIndex: blockIndex(),
					delta: event.delta,
					partial: output
				});
			}
		}
	} else if (event.type === "response.reasoning_summary_part.done") {
		if (currentItem?.type === "reasoning" && currentBlock?.type === "thinking") {
			currentItem.summary = currentItem.summary || [];
			const lastPart = currentItem.summary[currentItem.summary.length - 1];
			if (lastPart) {
				currentBlock.thinking += "\n\n";
				lastPart.text += "\n\n";
				stream.push({
					type: "thinking_delta",
					contentIndex: blockIndex(),
					delta: "\n\n",
					partial: output
				});
			}
		}
	} else if (event.type === "response.reasoning_text.delta") {
		if (currentItem?.type === "reasoning" && currentBlock?.type === "thinking") {
			currentBlock.thinking += event.delta;
			stream.push({
				type: "thinking_delta",
				contentIndex: blockIndex(),
				delta: event.delta,
				partial: output
			});
		}
	} else if (event.type === "response.content_part.added") {
		if (currentItem?.type === "message") {
			currentItem.content = currentItem.content || [];
			if (event.part.type === "output_text" || event.part.type === "text" || event.part.type === "refusal") currentItem.content.push(event.part);
		}
	} else if (event.type === "response.output_text.delta") {
		if (currentItem?.type === "message") {
			if (!currentItem.content || currentItem.content.length === 0) continue;
			const lastPart = currentItem.content[currentItem.content.length - 1];
			if (isResponsesTextContentPartType(lastPart?.type)) {
				lastPart.text += event.delta;
				if (pendingMessageText !== null) appendPendingMessageDelta(event.delta);
				else if (currentBlock?.type === "text") {
					currentBlock.text += event.delta;
					stream.push({
						type: "text_delta",
						contentIndex: blockIndex(),
						delta: event.delta,
						partial: output
					});
				}
			}
		}
	} else if (isAzureResponsesTextDeltaEvent(event)) {
		if (currentItem?.type === "message") {
			currentItem.content = currentItem.content || [];
			let lastPart = currentItem.content[currentItem.content.length - 1];
			if (lastPart?.type !== "text") {
				lastPart = {
					type: "text",
					text: ""
				};
				currentItem.content.push(lastPart);
			}
			lastPart.text += event.delta;
			if (pendingMessageText !== null) appendPendingMessageDelta(event.delta);
			else if (currentBlock?.type === "text") {
				currentBlock.text += event.delta;
				stream.push({
					type: "text_delta",
					contentIndex: blockIndex(),
					delta: event.delta,
					partial: output
				});
			}
		}
	} else if (event.type === "response.refusal.delta") {
		if (currentItem?.type === "message") {
			if (!currentItem.content || currentItem.content.length === 0) continue;
			const lastPart = currentItem.content[currentItem.content.length - 1];
			if (lastPart?.type === "refusal") {
				lastPart.refusal += event.delta;
				if (pendingMessageText !== null) appendPendingMessageDelta(event.delta);
				else if (currentBlock?.type === "text") {
					currentBlock.text += event.delta;
					stream.push({
						type: "text_delta",
						contentIndex: blockIndex(),
						delta: event.delta,
						partial: output
					});
				}
			}
		}
	} else if (event.type === "response.function_call_arguments.delta") {
		if (currentItem?.type === "function_call" && currentBlock?.type === "toolCall") {
			currentBlock.partialJson += event.delta;
			currentBlock.arguments = parseStreamingJson(currentBlock.partialJson);
			stream.push({
				type: "toolcall_delta",
				contentIndex: blockIndex(),
				delta: event.delta,
				partial: output
			});
		}
	} else if (event.type === "response.function_call_arguments.done") {
		if (currentItem?.type === "function_call" && currentBlock?.type === "toolCall") {
			const previousPartialJson = currentBlock.partialJson;
			const doneArguments = typeof event.arguments === "string" ? event.arguments : void 0;
			if (doneArguments !== void 0 && (doneArguments.length > 0 || previousPartialJson === "")) {
				currentBlock.partialJson = doneArguments;
				currentBlock.arguments = parseStreamingJson(currentBlock.partialJson);
			}
			if (doneArguments?.startsWith(previousPartialJson)) {
				const delta = doneArguments.slice(previousPartialJson.length);
				if (delta.length > 0) stream.push({
					type: "toolcall_delta",
					contentIndex: blockIndex(),
					delta,
					partial: output
				});
			}
		}
	} else if (event.type === "response.output_item.done") {
		const item = event.item;
		if (item.type !== "message") {
			lastTextBlock = null;
			pendingMessageText = null;
		}
		if (item.type === "reasoning" && currentBlock?.type === "thinking") {
			const summaryText = item.summary?.map((s) => s.text).join("\n\n") || "";
			const contentText = item.content?.map((c) => c.text).join("\n\n") || "";
			currentBlock.thinking = summaryText || contentText || currentBlock.thinking;
			currentBlock.thinkingSignature = JSON.stringify(item);
			stream.push({
				type: "thinking_end",
				contentIndex: blockIndex(),
				content: currentBlock.thinking,
				partial: output
			});
			currentBlock = null;
		} else if (item.type === "message" && (currentBlock?.type === "text" || pendingMessageText !== null)) {
			const finalText = item.content.map((c) => c.type === "output_text" || c.type === "text" ? c.text : c.refusal).join("");
			const phase = item.phase ?? void 0;
			const collapse = pendingMessageText !== null ? resolveResponsesMessageSnapshotCollapse({
				prior: lastTextBlock && {
					text: lastTextBlock.block.text,
					phase: lastTextBlock.phase
				},
				nextText: finalText,
				nextPhase: phase
			}) : { kind: "keep" };
			pendingMessageText = null;
			if (collapse.kind === "extend" && lastTextBlock) {
				lastTextBlock.block.text = collapse.text;
				lastTextBlock.block.textSignature = encodeTextSignatureV1(item.id, phase);
				stream.push({
					type: "text_end",
					contentIndex: lastTextBlock.index,
					content: collapse.text,
					partial: output
				});
			} else {
				if (currentBlock?.type !== "text") {
					currentBlock = {
						type: "text",
						text: ""
					};
					blocks.push(currentBlock);
					stream.push({
						type: "text_start",
						contentIndex: blockIndex(),
						partial: output
					});
				}
				currentBlock.text = finalText;
				currentBlock.textSignature = encodeTextSignatureV1(item.id, phase);
				lastTextBlock = {
					block: currentBlock,
					index: blockIndex(),
					phase
				};
				stream.push({
					type: "text_end",
					contentIndex: blockIndex(),
					content: currentBlock.text,
					partial: output
				});
			}
			currentBlock = null;
		} else if (item.type === "function_call") {
			const args = currentBlock?.type === "toolCall" && currentBlock.partialJson ? parseStreamingJson(currentBlock.partialJson) : parseStreamingJson(item.arguments || "{}");
			let toolCall;
			if (currentBlock?.type === "toolCall") {
				currentBlock.arguments = args;
				delete currentBlock.partialJson;
				toolCall = currentBlock;
			} else toolCall = {
				type: "toolCall",
				id: `${item.call_id}|${item.id}`,
				name: item.name,
				arguments: args
			};
			currentBlock = null;
			stream.push({
				type: "toolcall_end",
				contentIndex: blockIndex(),
				toolCall,
				partial: output
			});
		}
	} else if (event.type === "response.completed") {
		const response = event.response;
		if (response?.id) output.responseId = response.id;
		if (response?.usage) {
			const inputTokenDetails = response.usage.input_tokens_details;
			const cachedTokens = inputTokenDetails?.cached_tokens || 0;
			const cacheWriteTokens = inputTokenDetails?.cache_write_tokens || 0;
			output.usage = {
				input: Math.max(0, (response.usage.input_tokens || 0) - cachedTokens - cacheWriteTokens),
				output: response.usage.output_tokens || 0,
				cacheRead: cachedTokens,
				cacheWrite: cacheWriteTokens,
				totalTokens: response.usage.total_tokens || 0,
				cost: {
					input: 0,
					output: 0,
					cacheRead: 0,
					cacheWrite: 0,
					total: 0
				}
			};
		}
		calculateCost(model, output.usage);
		if (options?.applyServiceTierPricing) {
			const serviceTier = options.resolveServiceTier ? options.resolveServiceTier(response?.service_tier, options.serviceTier) : response?.service_tier ?? options.serviceTier;
			options.applyServiceTierPricing(output.usage, serviceTier);
		}
		output.stopReason = mapStopReason(response?.status);
		if (output.content.some((b) => b.type === "toolCall") && output.stopReason === "stop") output.stopReason = "toolUse";
	} else if (event.type === "error") throw new Error(event.message ? `Error Code ${event.code}: ${event.message}` : "Unknown error");
	else if (event.type === "response.failed") {
		const error = event.response?.error;
		const details = event.response?.incomplete_details;
		const msg = error ? `${error.code || "unknown"}: ${error.message || "no message"}` : details?.reason ? `incomplete: ${details.reason}` : "Unknown error (no error details in response)";
		throw new Error(msg);
	}
}
function mapStopReason(status) {
	if (!status) return "stop";
	switch (status) {
		case "completed": return "stop";
		case "incomplete": return "length";
		case "failed":
		case "cancelled": return "error";
		case "in_progress":
		case "queued": return "stop";
		default: throw new Error(`Unhandled stop reason: ${String(status)}`);
	}
}
//#endregion
export { extractToolSchemaModelCompat as A, isOpenAIGpt54MiniModel as C, resolveOpenAIReasoningEffortForModel as D, normalizeOpenAIReasoningEffort as E, GEMINI_UNSUPPORTED_SCHEMA_KEYWORDS as F, cleanSchemaForGemini as I, resolveUnsupportedToolSchemaKeywords as M, shouldOmitEmptyArrayItems as N, resolveOpenAISupportedReasoningEfforts as O, stripUnsupportedSchemaKeywords as P, resolveResponsesMessageSnapshotCollapse as S, isOpenAIGpt56Model as T, OPENAI_RESPONSES_OUTPUT_TEXT_DELTA_EVENT_TYPE as _, resolveResponsesReasoningEffort as a, isResponsesTextContentPartType as b, clearOpenAIToolSchemaCacheForTest as c, normalizeOpenAIStrictToolParameters as d, normalizeStrictOpenAIJsonSchema as f, OPENAI_RESPONSES_OUTPUT_TEXT_CONTENT_PART_TYPE as g, AZURE_RESPONSES_TEXT_DELTA_EVENT_TYPE as h, processResponsesStream as i, normalizeToolParameterSchema as j, supportsOpenAIReasoningEffort as k, findOpenAIStrictToolProjectionDiagnostics as l, AZURE_RESPONSES_TEXT_CONTENT_PART_TYPE as m, convertResponsesMessages as n, runResponsesStreamLifecycle as o, resolveOpenAIProjectedToolsStrictToolFlag as p, createResponsesAssistantOutput as r, convertResponsesToolPayload as s, applyCommonResponsesParams as t, isStrictOpenAIJsonSchemaCompatible as u, isAzureResponsesTextDeltaEvent as v, isOpenAIGpt55Model as w, isResponsesTextDeltaEventType as x, isAzureResponsesTextDeltaEventType as y };
