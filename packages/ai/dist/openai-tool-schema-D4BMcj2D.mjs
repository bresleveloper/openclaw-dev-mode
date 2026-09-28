import { n as normalizeLowercaseStringOrEmpty } from "./string-coerce-fsri9iCu.mjs";
import { o as isRecord } from "./record-coerce-DwRYMj3t.mjs";
import { i as uniqueValues, t as normalizeStringEntries } from "./string-normalization-J9ZiLfGO.mjs";
//#region packages/ai/src/providers/schema-walk.ts
/** Resume child schema walks on a heap stack, never through recursive yield delegation. */
function evaluateSchemaWalk(walk) {
	const parents = [];
	let current = walk;
	let value;
	try {
		while (true) {
			const step = current.next(value);
			if (!step.done) {
				parents.push(current);
				current = step.value;
				value = void 0;
				continue;
			}
			value = step.value;
			const parent = parents.pop();
			if (!parent) return value;
			current = parent;
		}
	} finally {
		let parent;
		while (parent = parents.pop()) parent.return(void 0);
	}
}
//#endregion
//#region packages/ai/src/providers/clean-for-gemini.ts
const GEMINI_UNSUPPORTED_SCHEMA_KEYWORDS = /* @__PURE__ */ new Set([
	"~optional",
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
function stringifyGeminiEnumValue(value) {
	if (typeof value === "string") return value;
	if (typeof value === "number" && Number.isFinite(value)) return String(value);
	if (typeof value === "boolean") return String(value);
}
function cleanGeminiEnumValues(value) {
	if (!Array.isArray(value)) return;
	const values = value.flatMap((entry) => {
		const stringified = stringifyGeminiEnumValue(entry);
		return stringified === void 0 ? [] : [stringified];
	});
	const unique = [...new Set(values)];
	return unique.length > 0 ? unique : void 0;
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
			kind: "simplified",
			value: result
		};
	}
	if (stripped && nonNullVariants.length === 1) {
		const lone = nonNullVariants[0];
		if (lone && typeof lone === "object" && !Array.isArray(lone)) {
			const result = { ...lone };
			copySchemaMeta$1(obj, result);
			return {
				kind: "simplified",
				value: result
			};
		}
		return {
			kind: "simplified",
			value: lone
		};
	}
	return {
		kind: "variants",
		value: stripped ? nonNullVariants : variants
	};
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
function* cleanSchemaArray(schemas, defs, refStack, ancestors, result) {
	result.length = schemas.length;
	for (let index = 0; index < result.length; index += 1) if (index in schemas) result[index] = yield cleanSchemaForGeminiWithDefs(schemas[index], defs, refStack, ancestors);
	return result;
}
function* cleanSchemaForGeminiWithDefs(schema, defs, refStack, ancestors) {
	if (!schema || typeof schema !== "object") return schema;
	if (ancestors.has(schema)) throw new TypeError("Tool schema contains a circular reference.");
	ancestors.add(schema);
	try {
		if (Array.isArray(schema)) {
			const result = [];
			yield cleanSchemaArray(schema, defs, refStack, ancestors, result);
			return result;
		}
		const obj = schema;
		const nextDefs = extendSchemaDefs$1(defs, obj);
		const refValue = typeof obj.$ref === "string" ? obj.$ref : void 0;
		if (refValue) {
			if (refStack?.has(refValue)) return {};
			const resolved = tryResolveLocalRef$1(refValue, nextDefs);
			if (resolved) {
				const nextRefStack = refStack ? new Set(refStack) : /* @__PURE__ */ new Set();
				nextRefStack.add(refValue);
				const cleaned = yield cleanSchemaForGeminiWithDefs(resolved, nextDefs, nextRefStack, /* @__PURE__ */ new Set());
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
		let cleanedAnyOf;
		if (hasAnyOf) {
			const variants = obj.anyOf;
			cleanedAnyOf = [];
			yield cleanSchemaArray(variants, nextDefs, refStack, ancestors, cleanedAnyOf);
		}
		let cleanedOneOf;
		if (hasOneOf) {
			const variants = obj.oneOf;
			cleanedOneOf = [];
			yield cleanSchemaArray(variants, nextDefs, refStack, ancestors, cleanedOneOf);
		}
		if (hasAnyOf) {
			const simplified = simplifyUnionVariants({
				obj,
				variants: cleanedAnyOf ?? []
			});
			if (simplified.kind === "simplified") return simplified.value;
			cleanedAnyOf = simplified.value;
		}
		if (hasOneOf) {
			const simplified = simplifyUnionVariants({
				obj,
				variants: cleanedOneOf ?? []
			});
			if (simplified.kind === "simplified") return simplified.value;
			cleanedOneOf = simplified.value;
		}
		const cleaned = {};
		for (const [key, value] of Object.entries(obj)) {
			if (GEMINI_UNSUPPORTED_SCHEMA_KEYWORDS.has(key)) continue;
			if (key === "const") {
				const enumValues = cleanGeminiEnumValues([value]);
				if (enumValues) cleaned.enum = enumValues;
				continue;
			}
			if (key === "enum") {
				const enumValues = cleanGeminiEnumValues(value);
				if (enumValues) cleaned.enum = enumValues;
				continue;
			}
			if (key === "required" && Array.isArray(value) && value.length === 0) continue;
			if (key === "type" && (hasAnyOf || hasOneOf)) continue;
			if (key === "type" && Array.isArray(value) && value.every((entry) => typeof entry === "string")) {
				const types = value.filter((entry) => entry !== "null");
				cleaned.type = types.length === 1 ? types[0] : types;
				continue;
			}
			if (key === "properties") {
				if (value && typeof value === "object" && !Array.isArray(value)) {
					const entries = Object.entries(value);
					for (const entry of entries) entry[1] = yield cleanSchemaForGeminiWithDefs(entry[1], nextDefs, refStack, ancestors);
					cleaned[key] = Object.fromEntries(entries);
				} else cleaned[key] = {};
			} else if (key === "items" && value) {
				if (Array.isArray(value)) {
					const result = [];
					yield cleanSchemaArray(value, nextDefs, refStack, ancestors, result);
					cleaned[key] = result;
				} else if (typeof value === "object") cleaned[key] = yield cleanSchemaForGeminiWithDefs(value, nextDefs, refStack, ancestors);
				else cleaned[key] = value;
			} else if (key === "anyOf" && Array.isArray(value)) cleaned[key] = cleanedAnyOf;
			else if (key === "oneOf" && Array.isArray(value)) cleaned[key] = cleanedOneOf;
			else if (key === "allOf" && Array.isArray(value)) {
				const result = [];
				yield cleanSchemaArray(value, nextDefs, refStack, ancestors, result);
				cleaned[key] = result;
			} else cleaned[key] = value;
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
	} finally {
		ancestors.delete(schema);
	}
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
	return evaluateSchemaWalk(cleanSchemaForGeminiWithDefs(schema, void 0, void 0, /* @__PURE__ */ new Set()));
}
//#endregion
//#region packages/ai/src/providers/clean-for-llamacpp-gbnf.ts
/** llama.cpp rejects grammar repetitions whose expanded rule count reaches 2000. */
const LLAMACPP_GBNF_MAX_REPETITION_THRESHOLD = 2e3;
const SCHEMA_MAP_KEYS$2 = /* @__PURE__ */ new Set([
	"$defs",
	"definitions",
	"dependentSchemas",
	"patternProperties",
	"properties"
]);
const SCHEMA_CHILD_KEYS = /* @__PURE__ */ new Set([
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
function cleanSchemaNode(node) {
	if (Array.isArray(node)) {
		let changed = false;
		const entries = node.map((entry) => {
			const next = cleanSchemaNode(entry);
			changed ||= next !== entry;
			return next;
		});
		return changed ? entries : node;
	}
	if (!isRecord(node)) return node;
	let changed = false;
	const cleaned = {};
	for (const [key, value] of Object.entries(node)) {
		if (key === "pattern") {
			changed = true;
			continue;
		}
		if (key === "maxLength" && typeof value === "number" && value >= 2e3) {
			changed = true;
			continue;
		}
		let next = value;
		if (SCHEMA_MAP_KEYS$2.has(key) && isRecord(value)) {
			let mapChanged = false;
			next = Object.fromEntries(Object.entries(value).map(([childKey, childValue]) => {
				const cleanedChild = cleanSchemaNode(childValue);
				mapChanged ||= cleanedChild !== childValue;
				return [childKey, cleanedChild];
			}));
			if (!mapChanged) next = value;
		} else if (SCHEMA_CHILD_KEYS.has(key)) next = cleanSchemaNode(value);
		cleaned[key] = next;
		changed ||= next !== value;
	}
	return changed ? cleaned : node;
}
function collectSchemaViolations(node, path, violations) {
	if (Array.isArray(node)) {
		node.forEach((entry, index) => collectSchemaViolations(entry, `${path}[${index}]`, violations));
		return;
	}
	if (!isRecord(node)) return;
	if ("pattern" in node) violations.push(`${path}.pattern`);
	if (typeof node.maxLength === "number" && node.maxLength >= 2e3) violations.push(`${path}.maxLength`);
	for (const [key, value] of Object.entries(node)) if (SCHEMA_MAP_KEYS$2.has(key) && isRecord(value)) for (const [childKey, childValue] of Object.entries(value)) collectSchemaViolations(childValue, `${path}.${key}.${childKey}`, violations);
	else if (SCHEMA_CHILD_KEYS.has(key)) collectSchemaViolations(value, `${path}.${key}`, violations);
}
/** Removes JSON Schema constraints that llama.cpp cannot compile into GBNF. */
function cleanSchemaForLlamacppGbnf(schema) {
	return cleanSchemaNode(schema);
}
/** Reports schema paths that llama.cpp cannot compile into GBNF. */
function findLlamacppGbnfSchemaViolations(schema, path) {
	const violations = [];
	collectSchemaViolations(schema, path, violations);
	return violations;
}
//#endregion
//#region packages/ai/src/providers/schema-keyword-strip.ts
const SCHEMA_MAP_KEYS$1 = /* @__PURE__ */ new Set([
	"$defs",
	"definitions",
	"dependentSchemas",
	"dependencies",
	"patternProperties",
	"properties"
]);
/** Containers whose value is a single nested schema. */
const SCHEMA_OBJECT_KEYS$1 = /* @__PURE__ */ new Set([
	"additionalItems",
	"additionalProperties",
	"contains",
	"contentSchema",
	"else",
	"if",
	"items",
	"not",
	"propertyNames",
	"then",
	"unevaluatedItems",
	"unevaluatedProperties"
]);
/** Containers whose value is a list of nested schemas. */
const SCHEMA_ARRAY_KEYS$1 = /* @__PURE__ */ new Set([
	"allOf",
	"anyOf",
	"items",
	"oneOf",
	"prefixItems"
]);
function* stripSchemaArray(schemas, unsupportedKeywords, ancestors, result) {
	result.length = schemas.length;
	for (let index = 0; index < result.length; index += 1) if (index in schemas) result[index] = yield stripSchemaKeywords(schemas[index], unsupportedKeywords, ancestors);
	return result;
}
function* stripSchemaKeywords(schema, unsupportedKeywords, ancestors) {
	if (!schema || typeof schema !== "object") return schema;
	if (ancestors.has(schema)) throw new TypeError("Tool schema contains a circular reference.");
	ancestors.add(schema);
	try {
		if (Array.isArray(schema)) {
			const result = [];
			yield stripSchemaArray(schema, unsupportedKeywords, ancestors, result);
			return result;
		}
		const obj = schema;
		const cleaned = {};
		for (const [key, value] of Object.entries(obj)) {
			if (unsupportedKeywords.has(key)) continue;
			if (SCHEMA_MAP_KEYS$1.has(key) && value && typeof value === "object" && !Array.isArray(value)) {
				const entries = Object.entries(value);
				for (const entry of entries) entry[1] = yield stripSchemaKeywords(entry[1], unsupportedKeywords, ancestors);
				cleaned[key] = Object.fromEntries(entries);
			} else if (SCHEMA_ARRAY_KEYS$1.has(key) && Array.isArray(value)) {
				const result = [];
				yield stripSchemaArray(value, unsupportedKeywords, ancestors, result);
				cleaned[key] = result;
			} else if (SCHEMA_OBJECT_KEYS$1.has(key) && value && typeof value === "object") cleaned[key] = yield stripSchemaKeywords(value, unsupportedKeywords, ancestors);
			else cleaned[key] = value;
		}
		return cleaned;
	} finally {
		ancestors.delete(schema);
	}
}
/** Remove schema keywords unsupported by a target provider/tool surface. */
function stripUnsupportedSchemaKeywords(schema, unsupportedKeywords) {
	return evaluateSchemaWalk(stripSchemaKeywords(schema, unsupportedKeywords, /* @__PURE__ */ new Set()));
}
//#endregion
//#region packages/ai/src/providers/tool-schema-normalization-cache.ts
let preparedSchemas;
/** Only synchronous conversion owns these fresh projections; no facts survive its return. */
function withPreparedToolSchemaNormalization(schemas, convert) {
	const previous = preparedSchemas;
	preparedSchemas = schemas;
	try {
		return convert();
	} finally {
		preparedSchemas = previous;
	}
}
function createBoundedSchemaCache(maxEntries) {
	const schemas = /* @__PURE__ */ new WeakMap();
	return {
		get(source, key) {
			return schemas.get(source)?.find((entry) => entry.key === key)?.value;
		},
		remember(source, key, value) {
			const entries = schemas.get(source) ?? [];
			schemas.set(source, [{
				key,
				value
			}, ...entries.filter((entry) => entry.key !== key)].slice(0, maxEntries));
			return value;
		}
	};
}
/** Prepared variants cannot evict direct callers' identity-preserving cache entries. */
function createToolSchemaNormalizationCache(maxEntries) {
	const directCache = createBoundedSchemaCache(maxEntries);
	const preparedCache = createBoundedSchemaCache(maxEntries);
	return {
		get(source, key) {
			const prepared = preparedSchemas?.get(source);
			if (!prepared) return directCache.get(source, key);
			const entry = preparedCache.get(prepared.source, key);
			return entry?.inputJson === prepared.inputJson ? JSON.parse(entry.outputJson) : void 0;
		},
		remember(source, key, value) {
			const prepared = preparedSchemas?.get(source);
			if (!prepared) return directCache.remember(source, key, value);
			const outputJson = JSON.stringify(value);
			if (outputJson !== void 0) preparedCache.remember(prepared.source, key, {
				inputJson: prepared.inputJson,
				outputJson
			});
			return value;
		}
	};
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
const toolParameterSchemaCache = createToolSchemaNormalizationCache(8);
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
function normalizeArraySchemaItems(schema, mode) {
	if (Array.isArray(schema)) {
		if (mode === "add") return schema;
		const entries = schema.map((entry) => normalizeArraySchemaItems(entry, "omit"));
		return entries.some((entry, index) => entry !== schema[index]) ? entries : schema;
	}
	if (!isRecord(schema)) return schema;
	const missingItems = mode !== "omit" && schema.type === "array" && schema.items === void 0;
	let changed = missingItems;
	const normalized = { ...schema };
	if (missingItems) {
		if (mode === "add") normalized.items = {};
		else delete normalized.items;
	}
	const allowsArray = schema.type === "array" || Array.isArray(schema.type) && schema.type.includes("array");
	const normalizeValue = (value, valueMode) => {
		if (!Array.isArray(value)) return normalizeArraySchemaItems(value, valueMode);
		const entries = value.map((entry) => normalizeArraySchemaItems(entry, valueMode));
		return entries.some((entry, index) => entry !== value[index]) ? entries : value;
	};
	for (const [key, value] of Object.entries(normalized)) {
		if (mode !== "add" && key === "items" && allowsArray && isRecord(value) && isTrulyEmptySchema(value)) {
			delete normalized.items;
			changed = true;
			continue;
		}
		let next = value;
		if (SCHEMA_MAP_KEYS.has(key) && isRecord(value)) {
			const entries = Object.entries(value);
			for (const entry of entries) entry[1] = normalizeArraySchemaItems(entry[1], mode);
			if (entries.some(([entryKey, entry]) => entry !== value[entryKey])) next = Object.fromEntries(entries);
		} else if (SCHEMA_OBJECT_KEYS.has(key) || SCHEMA_ARRAY_KEYS.has(key)) {
			const valueMode = SCHEMA_OBJECT_KEYS.has(key) || Array.isArray(value) ? mode : "add";
			if (valueMode === mode || mode !== "omit") next = normalizeValue(value, valueMode);
		}
		if (next !== value) {
			setOwnSchemaProperty(normalized, key, next);
			changed = true;
		}
	}
	return changed ? normalized : schema;
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
			const index = /^(?:0|[1-9]\d*)$/.test(key) ? Number(key) : -1;
			if (index < 0 || index >= current.length) return;
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
			const entries = Object.entries(value);
			for (const entry of entries) entry[1] = inlineLocalSchemaRefsWithDefs(entry[1], nextDefs, refStack, state, rootDocument);
			setOwnSchemaProperty(result, key, Object.fromEntries(entries));
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
	const schemaRecord = schema;
	return inlineLocalSchemaRefsWithDefs(schema, Array.isArray(schema) ? extendSchemaDefs(void 0, schemaRecord) : void 0, void 0, { unresolvedLocalRefs: false }, schema);
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
	const entries = Object.entries(schema);
	let normalized;
	for (const [key, value] of entries) {
		if (key === "nullable" || OPENAPI_SCHEMA_ANNOTATION_KEYS.has(key)) {
			normalized ??= Object.fromEntries(entries);
			delete normalized[key];
			changed = true;
			continue;
		}
		if (SCHEMA_LITERAL_KEYS.has(key) || key === "components") continue;
		let next = value;
		if (SCHEMA_MAP_KEYS.has(key) && isRecord(value)) {
			let mapChanged = false;
			const mapEntries = Object.entries(value);
			for (const entry of mapEntries) {
				const nextEntry = normalizeOpenApiSchemaKeywords(entry[1]);
				mapChanged ||= nextEntry !== entry[1];
				entry[1] = nextEntry;
			}
			next = mapChanged ? Object.fromEntries(mapEntries) : value;
		} else if (SCHEMA_OBJECT_KEYS.has(key) && isRecord(value)) next = normalizeOpenApiSchemaKeywords(value);
		else if (SCHEMA_ARRAY_KEYS.has(key) && Array.isArray(value)) {
			const nextEntries = value.map(normalizeOpenApiSchemaKeywords);
			(normalized ??= Object.fromEntries(entries))[key] = nextEntries;
			changed ||= nextEntries.some((entry, index) => entry !== value[index]);
			continue;
		}
		if (next !== value) {
			(normalized ??= Object.fromEntries(entries))[key] = next;
			changed = true;
		}
	}
	if (nullable) {
		normalized ??= Object.fromEntries(entries);
		if (hasOpenApiComposition(normalized)) return wrapNullableComposedSchema(normalized);
		if ("type" in normalized) {
			const nextType = appendNullSchemaType(normalized.type);
			if (nextType !== normalized.type) normalized.type = nextType;
		}
		if (Array.isArray(normalized.enum) && !normalized.enum.includes(null)) normalized.enum = [...normalized.enum, null];
	}
	return changed || nullable ? normalized ?? schema : schema;
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
	const isLlamacppGbnfProfile = normalizedToolSchemaProfile === "llamacpp";
	function applyProviderCleaning(s) {
		let arrayItemsCompatibleSchema = normalizeArraySchemaItems(s, omitEmptyArrayItems ? "normalize" : "add");
		if (isLlamacppGbnfProfile) arrayItemsCompatibleSchema = cleanSchemaForLlamacppGbnf(arrayItemsCompatibleSchema);
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
	const mergedProperties = isRecord(schemaRecord.properties) ? { ...schemaRecord.properties } : {};
	const requiredCounts = /* @__PURE__ */ new Map();
	let objectVariants = 0;
	for (const entry of variants) {
		if (!entry || typeof entry !== "object") continue;
		const props = entry.properties;
		if (!props || typeof props !== "object") continue;
		objectVariants += 1;
		for (const [key, value] of Object.entries(props)) setOwnSchemaProperty(mergedProperties, key, mergePropertySchemas(Object.hasOwn(mergedProperties, key) ? mergedProperties[key] : void 0, value));
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
	const cached = toolParameterSchemaCache.get(schema, cacheKey);
	if (cached) return cached;
	return toolParameterSchemaCache.remember(schema, cacheKey, normalizeToolParameterSchemaUncached(schema, options));
}
//#endregion
//#region packages/ai/src/providers/openai-tool-schema-compat.ts
const OPENAI_STRICT_COMPAT_SCHEMA_MAP_KEYS = /* @__PURE__ */ new Set([
	"$defs",
	"definitions",
	"dependentSchemas",
	"dependencies",
	"patternProperties",
	"properties"
]);
const OPENAI_NULLABLE_ANNOTATION_KEYS = /* @__PURE__ */ new Set([
	"default",
	"description",
	"examples",
	"format",
	"title"
]);
const OPENAI_STRICT_COMPAT_SCHEMA_NESTED_KEYS = /* @__PURE__ */ new Set([
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
]);
function normalizeOpenAIStrictCompatSchemaMap(schema) {
	if (!schema || typeof schema !== "object" || Array.isArray(schema)) return schema;
	let changed = false;
	const normalized = Object.fromEntries(Object.entries(schema).map(([key, value]) => {
		const next = normalizeOpenAIStrictCompatSchemaRecursive(value, { promoteEmptyObject: false });
		changed ||= next !== value;
		return [key, next];
	}));
	return changed ? normalized : schema;
}
function normalizeOpenAIStrictCompatSchemaRecursive(schema, options) {
	if (Array.isArray(schema)) {
		let changed = false;
		const normalized = schema.map((entry) => {
			const next = normalizeOpenAIStrictCompatSchemaRecursive(entry, { promoteEmptyObject: false });
			changed ||= next !== entry;
			return next;
		});
		return changed ? normalized : schema;
	}
	if (!schema || typeof schema !== "object") return schema;
	const record = schema;
	let changed = false;
	let hadNullType = false;
	const entries = Object.entries(record).flatMap(([key, value]) => {
		if (value === null && (OPENAI_NULLABLE_ANNOTATION_KEYS.has(key) || key === "type")) {
			hadNullType ||= key === "type";
			changed = true;
			return [];
		}
		const next = OPENAI_STRICT_COMPAT_SCHEMA_MAP_KEYS.has(key) ? normalizeOpenAIStrictCompatSchemaMap(value) : OPENAI_STRICT_COMPAT_SCHEMA_NESTED_KEYS.has(key) ? normalizeOpenAIStrictCompatSchemaRecursive(value, { promoteEmptyObject: false }) : value;
		changed ||= next !== value;
		return [[key, next]];
	});
	const normalized = Object.fromEntries(entries);
	if (Object.keys(normalized).length === 0) {
		if (!options.promoteEmptyObject) return schema;
		return {
			type: "object",
			properties: {},
			required: [],
			additionalProperties: false
		};
	}
	const hasObjectShapeHints = normalized.properties && typeof normalized.properties === "object" && !Array.isArray(normalized.properties) || Array.isArray(normalized.required);
	const hasArrayShapeHints = "items" in normalized;
	if (!("type" in normalized) && hasObjectShapeHints !== hasArrayShapeHints) {
		normalized.type = hasObjectShapeHints ? "object" : "array";
		changed = true;
	} else if (hadNullType && !("type" in normalized)) normalized.type = null;
	if (normalized.type === "object" && !("properties" in normalized)) {
		normalized.properties = {};
		changed = true;
	}
	const hasEmptyProperties = normalized.properties && typeof normalized.properties === "object" && !Array.isArray(normalized.properties) && Object.keys(normalized.properties).length === 0;
	if (normalized.type === "object" && !Array.isArray(normalized.required) && hasEmptyProperties) {
		normalized.required = [];
		changed = true;
	}
	if (normalized.type === "object" && hasEmptyProperties && !("additionalProperties" in normalized)) {
		normalized.additionalProperties = false;
		changed = true;
	}
	return changed ? normalized : schema;
}
/** Repairs recoverable OpenAI tool-schema shapes before canonical normalization. */
function normalizeOpenAIStrictCompatSchema(schema) {
	return normalizeOpenAIStrictCompatSchemaRecursive(schema, { promoteEmptyObject: true });
}
/** Finds schema paths that violate OpenAI strict tool-schema requirements. */
function findOpenAIStrictSchemaViolations(schema, path, options) {
	if (Array.isArray(schema)) {
		if (options?.requireObjectRoot) return [`${path}.type`];
		return schema.flatMap((item, index) => findOpenAIStrictSchemaViolations(item, `${path}[${index}]`));
	}
	if (!schema || typeof schema !== "object") return options?.requireObjectRoot ? [`${path}.type`] : [];
	const record = schema;
	const violations = [];
	for (const key of [
		"anyOf",
		"oneOf",
		"allOf"
	]) if (key in record) violations.push(`${path}.${key}`);
	if (Array.isArray(record.type)) violations.push(`${path}.type`);
	const properties = record.properties && typeof record.properties === "object" && !Array.isArray(record.properties) ? record.properties : void 0;
	if (record.type === "object") {
		if (record.additionalProperties !== false) violations.push(`${path}.additionalProperties`);
		const required = Array.isArray(record.required) ? record.required.filter((entry) => typeof entry === "string") : void 0;
		if (!required) violations.push(`${path}.required`);
		else if (properties) {
			const requiredSet = new Set(required);
			for (const key of Object.keys(properties)) if (!requiredSet.has(key)) violations.push(`${path}.required.${key}`);
		}
	}
	for (const key of OPENAI_STRICT_COMPAT_SCHEMA_MAP_KEYS) {
		const schemaMap = record[key];
		if (!schemaMap || typeof schemaMap !== "object" || Array.isArray(schemaMap)) continue;
		for (const [entryKey, value] of Object.entries(schemaMap)) violations.push(...findOpenAIStrictSchemaViolations(value, `${path}.${key}.${entryKey}`));
	}
	for (const key of OPENAI_STRICT_COMPAT_SCHEMA_NESTED_KEYS) {
		const value = record[key];
		if (value && typeof value === "object") violations.push(...findOpenAIStrictSchemaViolations(value, `${path}.${key}`));
	}
	return violations;
}
//#endregion
//#region packages/ai/src/providers/openai-tool-schema.ts
/**
* OpenAI strict JSON-schema normalization for tool inventories and request payloads.
*
* Caches normalized object inputs by provider compatibility so repeated inventory builds preserve identity.
*/
const strictOpenAISchemaCache = createToolSchemaNormalizationCache(8);
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
/** Normalizes a tool parameter schema into the OpenAI strict JSON-schema subset. */
function normalizeStrictOpenAIJsonSchema(schema, modelCompat) {
	const schemaInput = schema ?? {};
	if (!schemaInput || typeof schemaInput !== "object") return normalizeStrictOpenAIJsonSchemaRecursive(normalizeToolParameterSchema(schemaInput, { modelCompat: resolveToolSchemaModelCompat(modelCompat) }), 0);
	const cacheKey = resolveStrictOpenAISchemaCacheKey(modelCompat);
	const cached = strictOpenAISchemaCache.get(schemaInput, cacheKey);
	if (cached !== void 0) return cached;
	return strictOpenAISchemaCache.remember(schemaInput, cacheKey, normalizeStrictOpenAIJsonSchemaRecursive(normalizeToolParameterSchema(schemaInput, { modelCompat: resolveToolSchemaModelCompat(modelCompat) }), 0));
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
	const normalized = Object.fromEntries(Object.entries(record).map(([key, value]) => {
		const next = normalizeStrictOpenAIJsonSchemaRecursive(value, key === "properties" ? depth : depth + 1);
		changed ||= next !== value;
		return [key, next];
	}));
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
		const violations = findOpenAIStrictSchemaViolations(normalizeStrictOpenAIJsonSchema(tool.parameters), `${tool.name}.parameters`);
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
/** Resolves strict mode for the projected tools that will be emitted in the request payload. */
function resolveOpenAIProjectedToolsStrictToolFlag(projection, strict) {
	if (strict !== true) return strict === false ? false : void 0;
	return projection.tools.every((tool) => isStrictOpenAIJsonSchemaCompatible(tool.parameters));
}
//#endregion
export { GEMINI_UNSUPPORTED_SCHEMA_KEYWORDS as _, resolveOpenAIProjectedToolsStrictToolFlag as a, extractToolSchemaModelCompat as c, shouldOmitEmptyArrayItems as d, withPreparedToolSchemaNormalization as f, findLlamacppGbnfSchemaViolations as g, cleanSchemaForLlamacppGbnf as h, normalizeStrictOpenAIJsonSchema as i, normalizeToolParameterSchema as l, LLAMACPP_GBNF_MAX_REPETITION_THRESHOLD as m, isStrictOpenAIJsonSchemaCompatible as n, findOpenAIStrictSchemaViolations as o, stripUnsupportedSchemaKeywords as p, normalizeOpenAIStrictToolParameters as r, normalizeOpenAIStrictCompatSchema as s, findOpenAIStrictToolProjectionDiagnostics as t, resolveUnsupportedToolSchemaKeywords as u, cleanSchemaForGemini as v };
