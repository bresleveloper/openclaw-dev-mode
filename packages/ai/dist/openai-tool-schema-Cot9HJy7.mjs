import { o as isRecord, s as isStringArray } from "./record-coerce-BgUo6bj4.mjs";
import { r as parseLocalSchemaRefPointer } from "./validation-BbkEkv9b.mjs";
import { r as normalizeLowercaseStringOrEmpty } from "./string-coerce-CpcyRbc6.mjs";
import { i as uniqueValues, n as normalizeStringEntries, t as filterStringEntries } from "./string-normalization-CS77PHD3.mjs";
import { _ as SCHEMA_ARRAY_KEYS, a as SCHEMA_LITERAL_KEYS, b as SCHEMA_OBJECT_KEYS, c as extendSchemaDefs, f as inheritToolSchemaTruncation, g as wasToolSchemaTruncated, h as truncateToolSchemaDepth, i as publishRuntimeToolInputSchema, l as inlineLocalToolSchemaRefs, o as canPreserveRootSchemaRefs, p as reportToolSchemaTruncation, s as copySchemaMeta$1, t as getPublishedRuntimeToolInputSchema, u as setOwnSchemaProperty, v as SCHEMA_MAP_KEYS, x as walkSchemaValue, y as SCHEMA_NESTED_KEYS } from "./tool-schema-json-projection-Do42m3b7.mjs";
// packages/ai/src/providers/openai-function-tool.ts
function prepareOpenAIFunctionTool(name, description, parameters, strict, mutableParameters = false) {
	const descriptor = {
		name,
		description,
		parameters: mutableParameters && getPublishedRuntimeToolInputSchema(parameters) ? structuredClone(parameters) : parameters,
		...strict !== void 0 ? { strict } : {}
	};
	return {
		responses: {
			type: "function",
			...descriptor
		},
		completions: {
			type: "function",
			function: descriptor
		}
	};
}
// packages/ai/src/providers/clean-for-gemini.ts
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
function copySchemaMeta(from, to) {
	for (const key of SCHEMA_META_KEYS) if (key in from && from[key] !== void 0) to[key] = from[key];
	return to;
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
		if (!variantType || commonType !== null && commonType !== variantType) return null;
		commonType = variantType;
		allValues.push(literalValue);
	}
	if (commonType && allValues.length > 0) return {
		type: commonType,
		enum: allValues
	};
	return null;
}
function isNullSchema(variant) {
	if (!isRecord(variant)) return false;
	if ("const" in variant && variant.const === null) return true;
	if (Array.isArray(variant.enum) && variant.enum.length === 1) return variant.enum[0] === null;
	const typeValue = variant.type;
	return typeValue === "null" || Array.isArray(typeValue) && typeValue.length === 1 && typeValue[0] === "null";
}
function tryResolveLocalRef(ref, defs) {
	if (!defs) return;
	const tokens = parseLocalSchemaRefPointer(ref);
	const [table, name] = tokens ?? [];
	if (tokens?.length !== 2 || table !== "$defs" && table !== "definitions" || !name) return;
	return defs[table].get(name);
}
function sanitizeRequiredFields(schema) {
	if (!Array.isArray(schema.required)) return schema;
	if (!isRecord(schema.properties)) {
		if (schema.type === "object") delete schema.required;
		return schema;
	}
	const properties = schema.properties;
	const required = schema.required.filter((key) => typeof key === "string" && Object.hasOwn(properties, key));
	if (required.length > 0) schema.required = required;
	else delete schema.required;
	return schema;
}
function cleanSchemaForGeminiWithDefs(schema, defs, refStack, budget, depth = 0) {
	if (depth > 128) {
		budget.truncated = true;
		return {};
	}
	return walkSchemaValue(schema, (obj) => {
		const nextDefs = extendSchemaDefs(defs, obj);
		const visit = (value) => cleanSchemaForGeminiWithDefs(value, nextDefs, refStack, budget, depth + 1);
		const refValue = typeof obj.$ref === "string" ? obj.$ref : void 0;
		if (refValue) {
			if (refStack?.has(refValue)) return {};
			const resolved = tryResolveLocalRef(refValue, nextDefs);
			if (resolved) {
				const nextRefStack = new Set(refStack);
				nextRefStack.add(refValue);
				const cleaned = cleanSchemaForGeminiWithDefs(resolved, nextDefs, nextRefStack, budget, depth + 1);
				if (!cleaned || typeof cleaned !== "object" || Array.isArray(cleaned)) return cleaned;
				return copySchemaMeta(obj, { ...cleaned });
			}
			return copySchemaMeta(obj, {});
		}
		const unions = {};
		for (const key of ["anyOf", "oneOf"]) {
			const variants = obj[key];
			if (Array.isArray(variants)) unions[key] = variants.map(visit);
		}
		for (const key of ["anyOf", "oneOf"]) {
			const variants = unions[key];
			if (variants) {
				const nonNullVariants = variants.filter((variant) => !isNullSchema(variant));
				const stripped = nonNullVariants.length !== variants.length;
				const flattened = tryFlattenLiteralAnyOf(nonNullVariants);
				if (flattened) return copySchemaMeta(obj, flattened);
				if (stripped && nonNullVariants.length === 1) {
					const lone = nonNullVariants[0];
					return isRecord(lone) ? copySchemaMeta(obj, { ...lone }) : lone;
				}
				unions[key] = stripped ? nonNullVariants : variants;
			}
		}
		const cleaned = {};
		for (const [key, value] of Object.entries(obj)) {
			if (GEMINI_UNSUPPORTED_SCHEMA_KEYWORDS.has(key)) continue;
			if (key === "const" || key === "enum") {
				const type = isStringArray(obj.type) ? obj.type.find((entry) => entry !== "null") : obj.type;
				const enumInput = key === "const" ? [value] : value;
				if (Array.isArray(enumInput) && (type === void 0 || type === "string")) {
					const values = enumInput.filter((entry) => typeof entry === "string" || typeof entry === "boolean" || typeof entry === "number" && Number.isFinite(entry)).map(String);
					const unique = [...new Set(values)];
					if (unique.length > 0) cleaned.enum = unique;
				}
				continue;
			}
			if (key === "required" && Array.isArray(value) && value.length === 0) continue;
			if (key === "type" && (unions.anyOf || unions.oneOf)) continue;
			if (key === "type" && isStringArray(value)) {
				const type = value.find((entry) => entry !== "null");
				if (type) cleaned.type = type;
				continue;
			}
			if (key === "properties") {
				if (value && typeof value === "object" && !Array.isArray(value)) {
					const entries = Object.entries(value);
					for (const entry of entries) entry[1] = visit(entry[1]);
					cleaned[key] = Object.fromEntries(entries);
				} else cleaned[key] = {};
			} else if ((key === "items" || key === "allOf") && Array.isArray(value)) cleaned[key] = value.map(visit);
			else if (key === "items" && value && typeof value === "object") cleaned[key] = visit(value);
			else if ((key === "anyOf" || key === "oneOf") && Array.isArray(value)) cleaned[key] = unions[key];
			else cleaned[key] = value;
		}
		for (const variants of [cleaned.anyOf, cleaned.oneOf]) if (Array.isArray(variants)) {
			const flattened = flattenUnionFallback(cleaned, variants);
			if (flattened) return sanitizeRequiredFields(flattened);
		}
		return sanitizeRequiredFields(cleaned);
	});
}
/**
* Last-resort flattening for anyOf/oneOf arrays that could not be simplified
* by the initial union pass. Picks a representative type so the schema is
* accepted by Google's restricted JSON Schema validation.
*/
function flattenUnionFallback(obj, variants) {
	const objects = variants.filter((v) => Boolean(v) && typeof v === "object");
	if (objects.length === 0) return;
	const types = new Set(objects.map((v) => v.type).filter(Boolean));
	const first = objects[0];
	const type = types.size === 1 ? Array.from(types)[0] : first?.type;
	return copySchemaMeta(obj, objects.length === 1 ? { ...first } : type ? { type } : {});
}
function cleanSchemaForGemini(schema, toolName) {
	const budget = { truncated: false };
	const boundedSchema = truncateToolSchemaDepth(schema, toolName);
	const normalized = cleanSchemaForGeminiWithDefs(boundedSchema, void 0, void 0, budget);
	if (budget.truncated) reportToolSchemaTruncation(schema, toolName);
	return inheritToolSchemaTruncation(boundedSchema, normalized, budget.truncated);
}
// packages/ai/src/providers/clean-for-llamacpp-gbnf.ts
/** llama.cpp rejects grammar repetitions whose expanded rule count reaches 2000. */
const LLAMACPP_GBNF_MAX_REPETITION_THRESHOLD = 2e3;
/** Removes JSON Schema constraints that llama.cpp cannot compile into GBNF. */
function cleanSchemaForLlamacppGbnf(schema, toolName) {
	const bounded = truncateToolSchemaDepth(schema, toolName);
	return inheritToolSchemaTruncation(bounded, cleanSchema(bounded));
}
function cleanSchema(schema) {
	if (Array.isArray(schema)) {
		let changed = false;
		const entries = schema.map((entry) => {
			const next = cleanSchema(entry);
			changed ||= next !== entry;
			return next;
		});
		return changed ? entries : schema;
	}
	if (!isRecord(schema)) return schema;
	let changed = false;
	const cleaned = {};
	for (const [key, value] of Object.entries(schema)) {
		if (key === "pattern") {
			changed = true;
			continue;
		}
		if (key === "maxLength" && typeof value === "number" && value >= 2e3) {
			changed = true;
			continue;
		}
		let next = value;
		if (SCHEMA_MAP_KEYS.has(key) && isRecord(value)) {
			let mapChanged = false;
			next = Object.fromEntries(Object.entries(value).map(([childKey, childValue]) => {
				const cleanedChild = cleanSchema(childValue);
				mapChanged ||= cleanedChild !== childValue;
				return [childKey, cleanedChild];
			}));
			if (!mapChanged) next = value;
		} else if (key !== "contentSchema" && SCHEMA_NESTED_KEYS.has(key)) next = cleanSchema(value);
		cleaned[key] = next;
		changed ||= next !== value;
	}
	return changed ? cleaned : schema;
}
function collectSchemaViolations(node, path, violations) {
	if (Array.isArray(node)) {
		node.forEach((entry, index) => collectSchemaViolations(entry, `${path}[${index}]`, violations));
		return;
	}
	if (!isRecord(node)) return;
	if ("pattern" in node) violations.push(`${path}.pattern`);
	if (typeof node.maxLength === "number" && node.maxLength >= 2e3) violations.push(`${path}.maxLength`);
	for (const [key, value] of Object.entries(node)) if (SCHEMA_MAP_KEYS.has(key) && isRecord(value)) for (const [childKey, childValue] of Object.entries(value)) collectSchemaViolations(childValue, `${path}.${key}.${childKey}`, violations);
	else if (key !== "contentSchema" && SCHEMA_NESTED_KEYS.has(key)) collectSchemaViolations(value, `${path}.${key}`, violations);
}
/** Reports schema paths that llama.cpp cannot compile into GBNF. */
function findLlamacppGbnfSchemaViolations(schema, path) {
	const violations = [];
	collectSchemaViolations(truncateToolSchemaDepth(schema), path, violations);
	return violations;
}
// packages/ai/src/providers/schema-keyword-strip.ts
function stripSchemaKeywords(schema, unsupportedKeywords) {
	const visit = (value) => stripSchemaKeywords(value, unsupportedKeywords);
	return walkSchemaValue(schema, (obj) => {
		const cleaned = {};
		for (const [key, value] of Object.entries(obj)) {
			if (unsupportedKeywords.has(key)) continue;
			if (SCHEMA_MAP_KEYS.has(key) && value && typeof value === "object" && !Array.isArray(value)) {
				const entries = Object.entries(value);
				for (const entry of entries) if (key !== "dependencies" || !Array.isArray(entry[1])) entry[1] = visit(entry[1]);
				cleaned[key] = Object.fromEntries(entries);
			} else if (SCHEMA_ARRAY_KEYS.has(key) && Array.isArray(value)) cleaned[key] = value.map(visit);
			else if (SCHEMA_OBJECT_KEYS.has(key) && value && typeof value === "object") cleaned[key] = visit(value);
			else cleaned[key] = value;
		}
		return cleaned;
	});
}
/** Remove schema keywords unsupported by a target provider/tool surface. */
function stripUnsupportedSchemaKeywords(schema, unsupportedKeywords) {
	const bounded = truncateToolSchemaDepth(schema);
	return inheritToolSchemaTruncation(bounded, stripSchemaKeywords(bounded, unsupportedKeywords));
}
// packages/ai/src/providers/tool-schema-normalization-cache.ts
let preparedSchemas;
/** Request preparation already detached and depth-bounded these schemas. */
function isPreparedToolSchemaNormalization(schema) {
	return schema !== null && typeof schema === "object" && preparedSchemas?.has(schema) === true;
}
const MAX_CACHE_ENTRIES_PER_SCHEMA = 8;
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
function createBoundedSchemaCache() {
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
			}, ...entries.filter((entry) => entry.key !== key)].slice(0, MAX_CACHE_ENTRIES_PER_SCHEMA));
			return value;
		}
	};
}
/** Prepared variants cannot evict direct callers' identity-preserving cache entries. */
function createToolSchemaNormalizationCache() {
	const directCache = createBoundedSchemaCache();
	const preparedCache = createBoundedSchemaCache();
	return {
		get(source, key) {
			const prepared = preparedSchemas?.get(source);
			if (!prepared) return inheritToolSchemaTruncation(source, directCache.get(source, key));
			const entry = preparedCache.get(prepared.source, key);
			return entry?.inputJson === prepared.inputJson && entry.inputTruncated === wasToolSchemaTruncated(source) ? inheritToolSchemaTruncation(source, JSON.parse(entry.outputJson), entry.truncated) : void 0;
		},
		remember(source, key, value) {
			const result = inheritToolSchemaTruncation(source, value);
			const prepared = preparedSchemas?.get(source);
			if (!prepared) {
				const published = getPublishedRuntimeToolInputSchema(source) ? publishRuntimeToolInputSchema(result) : void 0;
				return directCache.remember(source, key, published?.violations.length === 0 ? published.schema : result);
			}
			const outputJson = JSON.stringify(result);
			if (outputJson !== void 0) preparedCache.remember(prepared.source, key, {
				inputJson: prepared.inputJson,
				inputTruncated: wasToolSchemaTruncated(source),
				outputJson,
				truncated: wasToolSchemaTruncated(result)
			});
			return result;
		}
	};
}
// packages/ai/src/providers/tool-schema-normalization.ts
const OPENAPI_SCHEMA_ANNOTATION_KEYS = /* @__PURE__ */ new Set([
	"discriminator",
	"externalDocs",
	"readOnly",
	"writeOnly",
	"xml",
	"example"
]);
function isNullSchemaLike(schema) {
	if (!isRecord(schema)) return false;
	if (schema.type === "null") return true;
	if (Array.isArray(schema.type) && schema.type.includes("null")) return true;
	if ("const" in schema && schema.const === null) return true;
	return Array.isArray(schema.enum) && schema.enum.includes(null);
}
const OPENAI_NULLABLE_ANNOTATION_KEYS = /* @__PURE__ */ new Set([
	"default",
	"description",
	"examples",
	"format",
	"title"
]);
function inferUnionBranchType(schema) {
	const types = /* @__PURE__ */ new Set();
	const values = "const" in schema ? [schema.const] : schema.enum;
	if (Array.isArray(values)) for (const value of values) types.add(value === null ? "null" : Array.isArray(value) ? "array" : typeof value);
	for (const [type, keywords] of [
		["number", [
			"minimum",
			"maximum",
			"exclusiveMinimum",
			"exclusiveMaximum",
			"multipleOf"
		]],
		["string", [
			"minLength",
			"maxLength",
			"pattern",
			"format"
		]],
		["object", ["properties", "required"]],
		["array", ["items"]]
	]) if (keywords.some((key) => key in schema)) types.add(type);
	return types.size === 1 ? types.values().next().value : void 0;
}
const publishedNormalizations = createToolSchemaNormalizationCache();
function normalizeToolSchemaRecursive(schema, profile, depth = 0, inferBranchType = false) {
	const mapProfile = profile === "strict-map" ? "strict" : profile === "compat-map" ? "compat" : profile === "openapi-map" ? "openapi" : profile === "moonshot-map" ? "moonshot" : void 0;
	if (Array.isArray(schema)) {
		if (mapProfile) return schema;
		let changed = false;
		const normalized = schema.map((entry) => {
			const next = normalizeToolSchemaRecursive(entry, profile, profile === "strict" ? depth : 1, inferBranchType);
			changed ||= next !== entry;
			return next;
		});
		return changed ? normalized : schema;
	}
	if (!isRecord(schema)) return schema;
	const record = schema;
	let changed = false;
	let hadNullType = false;
	const nullable = profile === "openapi" && record.nullable === true;
	const entries = [];
	for (const [key, value] of Object.entries(record)) {
		if (profile === "compat" && value === null && (OPENAI_NULLABLE_ANNOTATION_KEYS.has(key) || key === "type")) {
			hadNullType ||= key === "type";
			changed = true;
			continue;
		}
		if (profile === "openapi") {
			if (key === "nullable" || OPENAPI_SCHEMA_ANNOTATION_KEYS.has(key)) {
				changed = true;
				continue;
			}
			if (SCHEMA_LITERAL_KEYS.has(key) || key === "components") {
				entries.push([key, value]);
				continue;
			}
			let next = value;
			if (SCHEMA_MAP_KEYS.has(key) && isRecord(value)) next = normalizeToolSchemaRecursive(value, "openapi-map", 1);
			else if (SCHEMA_OBJECT_KEYS.has(key) && isRecord(value)) next = normalizeToolSchemaRecursive(value, profile, 1);
			else if (SCHEMA_ARRAY_KEYS.has(key) && Array.isArray(value)) {
				const nextEntries = value.map((entry) => normalizeToolSchemaRecursive(entry, profile, 1));
				changed ||= nextEntries.some((entry, index) => entry !== value[index]);
				entries.push([key, nextEntries]);
				continue;
			}
			changed ||= next !== value;
			entries.push([key, next]);
			continue;
		}
		let next = value;
		if (profile === "strict") {
			if (SCHEMA_MAP_KEYS.has(key)) next = normalizeToolSchemaRecursive(value, "strict-map", depth);
			else if (SCHEMA_NESTED_KEYS.has(key)) next = normalizeToolSchemaRecursive(value, profile, depth + 1);
		} else if (mapProfile) next = normalizeToolSchemaRecursive(value, mapProfile, profile === "strict-map" ? depth + 1 : 1);
		else if (SCHEMA_MAP_KEYS.has(key)) next = normalizeToolSchemaRecursive(value, profile === "moonshot" ? "moonshot-map" : "compat-map", 1);
		else if (SCHEMA_NESTED_KEYS.has(key)) next = normalizeToolSchemaRecursive(value, profile === "moonshot" ? "moonshot" : "compat", 1, profile === "moonshot" && (key === "anyOf" || key === "oneOf"));
		changed ||= next !== value;
		entries.push([key, next]);
	}
	const normalized = Object.fromEntries(entries);
	if (mapProfile) return changed ? normalized : schema;
	if (profile === "moonshot") {
		if (inferBranchType && !("type" in normalized)) {
			const type = inferUnionBranchType(normalized);
			if (type) {
				normalized.type = type;
				changed = true;
			}
		}
		return changed ? normalized : schema;
	}
	if (profile === "openapi") {
		if (nullable) {
			if ([
				normalized.allOf,
				normalized.anyOf,
				normalized.oneOf
			].some(Array.isArray)) {
				if (Array.isArray(normalized.anyOf) && normalized.anyOf.some(isNullSchemaLike) || Array.isArray(normalized.oneOf) && normalized.oneOf.some(isNullSchemaLike)) return normalized;
				const wrapped = { anyOf: [normalized, { type: "null" }] };
				copySchemaMeta$1(normalized, wrapped);
				return wrapped;
			}
			const type = normalized.type;
			if (typeof type === "string" && type !== "null") normalized.type = [type, "null"];
			else if (Array.isArray(type) && !type.includes("null")) normalized.type = [...type, "null"];
			if (Array.isArray(normalized.enum) && !normalized.enum.includes(null)) normalized.enum = [...normalized.enum, null];
		}
		return changed || nullable ? normalized : schema;
	}
	if (profile === "compat") {
		if (Object.keys(normalized).length === 0) {
			if (depth !== 0) return schema;
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
	}
	const hasEmptyProperties = isRecord(normalized.properties) && Object.keys(normalized.properties).length === 0;
	if (normalized.type === "object" && !Array.isArray(normalized.required) && hasEmptyProperties) {
		normalized.required = [];
		changed = true;
	}
	if (normalized.type === "object" && (profile === "strict" ? depth === 0 : hasEmptyProperties) && !("additionalProperties" in normalized)) {
		normalized.additionalProperties = false;
		changed = true;
	}
	return changed ? normalized : schema;
}
function normalizeToolSchema(schema, profile, toolName) {
	const source = schema && typeof schema === "object" && getPublishedRuntimeToolInputSchema(schema) ? schema : void 0;
	if (source) {
		if (wasToolSchemaTruncated(source)) reportToolSchemaTruncation(source, toolName);
		const cached = publishedNormalizations.get(source, profile);
		if (cached !== void 0) return cached;
	}
	const bounded = source ?? truncateToolSchemaDepth(schema, toolName);
	const normalized = inheritToolSchemaTruncation(bounded, normalizeToolSchemaRecursive(bounded, profile));
	return source ? publishedNormalizations.remember(source, profile, normalized) : normalized;
}
// packages/ai/src/providers/agent-tools-parameter-schema.ts
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
const toolParameterSchemaCache = createToolSchemaNormalizationCache();
function extractEnumValues(schema, requireAllVariants = false) {
	if (!schema || typeof schema !== "object") return;
	const record = schema;
	if (Array.isArray(record.enum)) return record.enum;
	if ("const" in record) return [record.const];
	const variants = Array.isArray(record.anyOf) ? record.anyOf : Array.isArray(record.oneOf) ? record.oneOf : null;
	if (variants) {
		let complete = true;
		const values = variants.flatMap((variant) => {
			const extracted = extractEnumValues(variant, requireAllVariants);
			complete &&= extracted !== void 0;
			return extracted ?? [];
		});
		return (!requireAllVariants || complete) && values.length > 0 ? values : void 0;
	}
}
function isUnconstrainedStringSchema(schema) {
	return isRecord(schema) && schema.type === "string" && Object.keys(schema).every((key) => [
		"type",
		"title",
		"description",
		"default",
		"examples"
	].includes(key));
}
function mergePropertySchemas(existing, incoming, allowUnconstrainedString) {
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
		if (allowUnconstrainedString) {
			if (isStringArray(existingEnum) && isUnconstrainedStringSchema(incoming)) return {
				...incoming,
				...merged
			};
			if (isStringArray(incomingEnum) && isUnconstrainedStringSchema(existing)) return {
				...existing,
				...merged
			};
		}
		const types = new Set(values.map((value) => typeof value));
		if (types.size === 1) merged.type = Array.from(types)[0];
		merged.enum = values;
		return merged;
	}
	return existing;
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
		if (mode !== "add" && key === "items" && allowsArray && isRecord(value) && Object.keys(value).length === 0) {
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
/** Return a provider-compatible JSON schema for a model-facing tool. */
function normalizeToolParameterSchema(schema, options) {
	const normalizedProvider = normalizeLowercaseStringOrEmpty(options?.modelProvider);
	const normalizedModelId = normalizeLowercaseStringOrEmpty(options?.modelId);
	const normalizedToolSchemaProfile = normalizeLowercaseStringOrEmpty(options?.modelCompat?.toolSchemaProfile);
	const unsupportedToolSchemaKeywords = resolveUnsupportedToolSchemaKeywords(options?.modelCompat);
	const omitEmptyArrayItems = shouldOmitEmptyArrayItems(options?.modelCompat);
	const source = schema && typeof schema === "object" ? schema : void 0;
	const cacheKey = source ? JSON.stringify([
		normalizedProvider,
		normalizedModelId,
		normalizedToolSchemaProfile,
		[...unsupportedToolSchemaKeywords].toSorted(),
		omitEmptyArrayItems
	]) : "";
	if (source) {
		const cached = toolParameterSchemaCache.get(source, cacheKey);
		if (cached) {
			if (wasToolSchemaTruncated(cached)) reportToolSchemaTruncation(source, options?.toolName);
			return cached;
		}
	}
	const prepared = getPublishedRuntimeToolInputSchema(schema) || isPreparedToolSchemaNormalization(schema);
	const boundedSchema = prepared ? schema : truncateToolSchemaDepth(schema, options?.toolName);
	if (prepared && wasToolSchemaTruncated(schema)) reportToolSchemaTruncation(schema, options?.toolName);
	const isGeminiProvider = normalizedProvider.includes("google") || normalizedProvider.includes("gemini") || /(?:^|[/:])gemini(?:$|[-/:.])/.test(normalizedModelId) || normalizedToolSchemaProfile === "gemini";
	const isAnthropicProvider = normalizedProvider.includes("anthropic");
	const isLlamacppGbnfProfile = normalizedToolSchemaProfile === "llamacpp";
	const inlinedSchema = normalizeToolSchema(normalizedProvider === "openai" && !isGeminiProvider && !isLlamacppGbnfProfile && ![
		"$ref",
		"$defs",
		"definitions"
	].some((key) => unsupportedToolSchemaKeywords.has(key)) && canPreserveRootSchemaRefs(boundedSchema) ? boundedSchema : inlineLocalToolSchemaRefs(boundedSchema, options?.toolName), "openapi");
	const rememberResult = (normalized) => {
		const result = inheritToolSchemaTruncation(inlinedSchema, normalized);
		return source ? toolParameterSchemaCache.remember(source, cacheKey, result) : result;
	};
	const schemaRecord = inlinedSchema && typeof inlinedSchema === "object" ? inlinedSchema : void 0;
	if (!schemaRecord) return rememberResult(inlinedSchema);
	function applyProviderCleaning(s) {
		let arrayItemsCompatibleSchema = normalizeArraySchemaItems(s, omitEmptyArrayItems ? "normalize" : "add");
		if (isLlamacppGbnfProfile) arrayItemsCompatibleSchema = cleanSchemaForLlamacppGbnf(arrayItemsCompatibleSchema);
		if (isGeminiProvider && !isAnthropicProvider) arrayItemsCompatibleSchema = cleanSchemaForGemini(arrayItemsCompatibleSchema);
		if (unsupportedToolSchemaKeywords.size > 0) arrayItemsCompatibleSchema = stripUnsupportedSchemaKeywords(arrayItemsCompatibleSchema, unsupportedToolSchemaKeywords);
		return rememberResult(arrayItemsCompatibleSchema);
	}
	const flattenableVariantKey = Array.isArray(schemaRecord.anyOf) ? "anyOf" : Array.isArray(schemaRecord.oneOf) ? "oneOf" : void 0;
	if (!flattenableVariantKey && !Array.isArray(schemaRecord.allOf)) {
		const hasProperties = isRecord(schemaRecord.properties);
		if (schemaRecord.type === "object") return applyProviderCleaning(hasProperties ? schemaRecord : {
			...schemaRecord,
			properties: {}
		});
		if (!("type" in schemaRecord) && (hasProperties || Array.isArray(schemaRecord.required))) return applyProviderCleaning({
			...schemaRecord,
			type: "object",
			properties: hasProperties ? schemaRecord.properties : {}
		});
	}
	if (!flattenableVariantKey) return applyProviderCleaning(Object.keys(schemaRecord).length === 0 ? {
		type: "object",
		properties: {}
	} : inlinedSchema);
	const variants = schemaRecord[flattenableVariantKey];
	const rootProperties = isRecord(schemaRecord.properties) ? schemaRecord.properties : {};
	const mergedProperties = { ...rootProperties };
	const propertyAlternatives = /* @__PURE__ */ new Map();
	const requiredCounts = /* @__PURE__ */ new Map();
	let objectVariants = 0;
	for (const entry of variants) {
		if (!entry || typeof entry !== "object") continue;
		const props = entry.properties;
		if (!props || typeof props !== "object") continue;
		objectVariants += 1;
		for (const [key, value] of Object.entries(props)) {
			const alternatives = propertyAlternatives.get(key);
			if (alternatives) alternatives.push(value);
			else propertyAlternatives.set(key, [value]);
		}
		const required = Array.isArray(entry.required) ? entry.required : [];
		for (const key of required) {
			if (typeof key !== "string") continue;
			requiredCounts.set(key, (requiredCounts.get(key) ?? 0) + 1);
		}
	}
	for (const [key, alternatives] of propertyAlternatives) {
		const allowUnconstrainedString = !Object.hasOwn(rootProperties, key) && alternatives.every((alternative) => isUnconstrainedStringSchema(alternative) || isStringArray(extractEnumValues(alternative, true)));
		let merged = Object.hasOwn(mergedProperties, key) ? mergedProperties[key] : void 0;
		for (const alternative of alternatives) merged = mergePropertySchemas(merged, alternative, allowUnconstrainedString);
		setOwnSchemaProperty(mergedProperties, key, merged);
	}
	const baseRequired = filterStringEntries(schemaRecord.required);
	const mergedRequired = baseRequired.length > 0 ? baseRequired : objectVariants > 0 ? Array.from(requiredCounts.entries()).filter(([, count]) => count === objectVariants).map(([key]) => key) : void 0;
	return applyProviderCleaning({
		type: "object",
		...typeof schemaRecord.title === "string" ? { title: schemaRecord.title } : {},
		...typeof schemaRecord.description === "string" ? { description: schemaRecord.description } : {},
		properties: Object.keys(mergedProperties).length > 0 ? mergedProperties : schemaRecord.properties ?? {},
		...mergedRequired && mergedRequired.length > 0 ? { required: mergedRequired } : {},
		additionalProperties: "additionalProperties" in schemaRecord ? schemaRecord.additionalProperties : true
	});
}
// packages/ai/src/providers/openai-tool-schema-compat.ts
/** Repairs recoverable OpenAI tool-schema shapes before canonical normalization. */
function normalizeOpenAIStrictCompatSchema(schema, toolName) {
	return normalizeToolSchema(schema, "compat", toolName);
}
/** Finds nested open dictionaries whose keys compatibility normalization closes. */
function findCompatClosedObjectPaths(schema, path) {
	return collectCompatClosedObjectPaths(truncateToolSchemaDepth(schema), path);
}
function collectCompatClosedObjectPaths(schema, path, nested = false) {
	if (Array.isArray(schema)) return schema.flatMap((entry, index) => collectCompatClosedObjectPaths(entry, `${path}[${index}]`, true));
	if (!isRecord(schema)) return [];
	const violations = nested && schema.type === "object" && !("additionalProperties" in schema) && (!isRecord(schema.patternProperties) || Object.keys(schema.patternProperties).length === 0) && (!("properties" in schema) || isRecord(schema.properties) && Object.keys(schema.properties).length === 0) ? [path] : [];
	for (const key of SCHEMA_MAP_KEYS) {
		const map = schema[key];
		if (isRecord(map)) for (const [name, child] of Object.entries(map)) violations.push(...collectCompatClosedObjectPaths(child, `${path}.${key}.${name}`, true));
	}
	for (const key of SCHEMA_NESTED_KEYS) violations.push(...collectCompatClosedObjectPaths(schema[key], `${path}.${key}`, true));
	return violations;
}
/**
* Returns whether a regex pattern contains a lookahead or lookbehind group.
* Escaped parentheses, character classes, and named groups are not lookarounds.
*/
function hasRegexLookaround(pattern) {
	let inCharacterClass = false;
	for (let index = 0; index < pattern.length; index += 1) {
		const char = pattern[index];
		if (char === "\\") index += 1;
		else if (inCharacterClass) inCharacterClass = char !== "]";
		else if (char === "[") inCharacterClass = true;
		else if (char === "(" && /^\?<?[=!]/.test(pattern.slice(index + 1, index + 4))) return true;
	}
	return false;
}
/** Finds schema paths that violate OpenAI strict tool-schema requirements. */
function findOpenAIStrictSchemaViolations(schema, path, options) {
	const bounded = truncateToolSchemaDepth(schema);
	return wasToolSchemaTruncated(bounded) ? [`${path}.depth`] : collectStrictSchemaViolations(bounded, path, options);
}
function collectStrictSchemaViolations(schema, path, options) {
	if (Array.isArray(schema)) {
		if (options?.requireObjectRoot) return [`${path}.type`];
		return schema.flatMap((item, index) => collectStrictSchemaViolations(item, `${path}[${index}]`));
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
	if (typeof record.pattern === "string" && hasRegexLookaround(record.pattern)) violations.push(`${path}.pattern`);
	const properties = isRecord(record.properties) ? record.properties : void 0;
	if (record.type === "object") {
		if (record.additionalProperties !== false) violations.push(`${path}.additionalProperties`);
		const required = Array.isArray(record.required) ? record.required.filter((entry) => typeof entry === "string") : void 0;
		if (!required) violations.push(`${path}.required`);
		else if (properties) {
			const requiredSet = new Set(required);
			for (const key of Object.keys(properties)) if (!requiredSet.has(key)) violations.push(`${path}.required.${key}`);
		}
	}
	for (const key of SCHEMA_MAP_KEYS) {
		const schemaMap = record[key];
		if (!isRecord(schemaMap)) continue;
		for (const [entryKey, value] of Object.entries(schemaMap)) violations.push(...collectStrictSchemaViolations(value, `${path}.${key}.${entryKey}`));
	}
	for (const key of SCHEMA_NESTED_KEYS) {
		const value = record[key];
		if (value && typeof value === "object") violations.push(...collectStrictSchemaViolations(value, `${path}.${key}`));
	}
	return violations;
}
// packages/ai/src/providers/openai-tool-schema.ts
const strictOpenAISchemaCache = createToolSchemaNormalizationCache();
const publishedStrictCompatibility = /* @__PURE__ */ new WeakMap();
function resolveToolSchemaModelCompat(compat) {
	if (!compat) return;
	const unsupportedToolSchemaKeywords = filterStringEntries(compat.unsupportedToolSchemaKeywords);
	if (unsupportedToolSchemaKeywords.length === 0 && compat.omitEmptyArrayItems !== true) return;
	return {
		...unsupportedToolSchemaKeywords.length > 0 ? { unsupportedToolSchemaKeywords } : {},
		...compat.omitEmptyArrayItems === true ? { omitEmptyArrayItems: true } : {}
	};
}
/** Normalizes a tool parameter schema into the OpenAI strict JSON-schema subset. */
function normalizeStrictOpenAIJsonSchema(schema, modelCompat) {
	const schemaInput = schema ?? {};
	const cacheable = typeof schemaInput === "object";
	const cacheCompat = cacheable ? resolveToolSchemaModelCompat(modelCompat) : void 0;
	const cacheKey = cacheable ? JSON.stringify([[...cacheCompat?.unsupportedToolSchemaKeywords ?? []].toSorted(), shouldOmitEmptyArrayItems(cacheCompat)]) : "";
	if (cacheable) {
		const cached = strictOpenAISchemaCache.get(schemaInput, cacheKey);
		if (cached !== void 0) return cached;
	}
	const normalized = normalizeToolSchema(normalizeToolParameterSchema(schemaInput, { modelCompat: resolveToolSchemaModelCompat(modelCompat) }), "strict");
	return cacheable ? strictOpenAISchemaCache.remember(schemaInput, cacheKey, normalized) : normalized;
}
/** Normalizes tool parameters using strict OpenAI rules only when strict mode is active. */
function normalizeOpenAIStrictToolParameters(schema, strict, modelCompat) {
	const toolSchemaCompat = resolveToolSchemaModelCompat(modelCompat);
	if (!strict) return normalizeToolParameterSchema(schema ?? {}, { modelCompat: toolSchemaCompat });
	return normalizeStrictOpenAIJsonSchema(schema, toolSchemaCompat);
}
/** Returns whether a schema already satisfies OpenAI strict tool-schema constraints. */
function isStrictOpenAIJsonSchemaCompatible(schema) {
	const publishedSchema = getPublishedRuntimeToolInputSchema(schema)?.projection.schema;
	const source = publishedSchema && typeof publishedSchema === "object" ? publishedSchema : void 0;
	const cached = source ? publishedStrictCompatibility.get(source) : void 0;
	if (cached !== void 0) return cached;
	const compatible = findOpenAIStrictSchemaViolations(normalizeStrictOpenAIJsonSchema(schema), "parameters").length === 0;
	if (source) publishedStrictCompatibility.set(source, compatible);
	return compatible;
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
/** Resolves strict mode for the projected tools that will be emitted in the request payload. */
function resolveOpenAIProjectedToolsStrictToolFlag(projection, strict) {
	if (strict !== true) return strict === false ? false : void 0;
	return projection.tools.every((tool) => isStrictOpenAIJsonSchemaCompatible(tool.parameters));
}
export { cleanSchemaForLlamacppGbnf as _, resolveOpenAIProjectedToolsStrictToolFlag as a, cleanSchemaForGemini as b, normalizeOpenAIStrictCompatSchema as c, resolveUnsupportedToolSchemaKeywords as d, shouldOmitEmptyArrayItems as f, LLAMACPP_GBNF_MAX_REPETITION_THRESHOLD as g, stripUnsupportedSchemaKeywords as h, normalizeStrictOpenAIJsonSchema as i, extractToolSchemaModelCompat as l, withPreparedToolSchemaNormalization as m, isStrictOpenAIJsonSchemaCompatible as n, findCompatClosedObjectPaths as o, normalizeToolSchema as p, normalizeOpenAIStrictToolParameters as r, findOpenAIStrictSchemaViolations as s, findOpenAIStrictToolProjectionDiagnostics as t, normalizeToolParameterSchema as u, findLlamacppGbnfSchemaViolations as v, prepareOpenAIFunctionTool as x, GEMINI_UNSUPPORTED_SCHEMA_KEYWORDS as y };
