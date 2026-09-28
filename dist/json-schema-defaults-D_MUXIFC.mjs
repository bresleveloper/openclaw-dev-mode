import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { t as isBlockedObjectKey } from "./prototype-keys-CuYw53fZ.mjs";
import { r as normalizeJsonSchemaForTypeBox } from "./json-schema-Cq3X13VY.mjs";
import { Compile } from "typebox/schema";
//#region src/shared/json-schema-defaults.ts
const schemaResourceIds = /* @__PURE__ */ new WeakMap();
let nextSchemaResourceId = 1;
const schemaMapKeywords = /* @__PURE__ */ new Set([
	"$defs",
	"definitions",
	"dependentSchemas",
	"patternProperties",
	"properties"
]);
const schemaValueKeywords = /* @__PURE__ */ new Set([
	"additionalItems",
	"additionalProperties",
	"contains",
	"else",
	"if",
	"items",
	"not",
	"propertyNames",
	"then",
	"unevaluatedItems",
	"unevaluatedProperties"
]);
const schemaArrayKeywords = /* @__PURE__ */ new Set([
	"allOf",
	"anyOf",
	"oneOf",
	"prefixItems"
]);
const schemaCombinatorKeywords = /* @__PURE__ */ new Set([
	"allOf",
	"anyOf",
	"oneOf"
]);
const jsonSchemaTypes = /* @__PURE__ */ new Set([
	"array",
	"boolean",
	"integer",
	"null",
	"number",
	"object",
	"string"
]);
const schemaStringKeywords = /* @__PURE__ */ new Set([
	"$anchor",
	"$comment",
	"$dynamicAnchor",
	"$dynamicRef",
	"$id",
	"$schema",
	"$ref",
	"contentEncoding",
	"contentMediaType",
	"description",
	"format",
	"pattern",
	"title"
]);
const schemaNumberKeywords = /* @__PURE__ */ new Set([
	"exclusiveMaximum",
	"exclusiveMinimum",
	"maximum",
	"minimum",
	"multipleOf"
]);
const schemaIntegerKeywords = /* @__PURE__ */ new Set([
	"maxContains",
	"maxItems",
	"maxLength",
	"maxProperties",
	"minContains",
	"minItems",
	"minLength",
	"minProperties"
]);
const schemaBooleanKeywords = /* @__PURE__ */ new Set([
	"deprecated",
	"readOnly",
	"uniqueItems",
	"writeOnly"
]);
const JSON_POINTER_ARRAY_INDEX_SEGMENT = /^(0|[1-9]\d*)$/;
function schemaTypeIncludes(schema, type) {
	return schema.type === type || Array.isArray(schema.type) && schema.type.includes(type);
}
function schemaResourceRefKey(resourceRoot, ref, baseId) {
	if (!isRecord(resourceRoot)) return `boolean:${String(resourceRoot)}:${baseId ?? ""}:${ref}`;
	let id = schemaResourceIds.get(resourceRoot);
	if (id === void 0) {
		id = nextSchemaResourceId++;
		schemaResourceIds.set(resourceRoot, id);
	}
	return `schema:${id}:${baseId ?? ""}:${ref}`;
}
function validateTypeKeyword(type, path) {
	if (typeof type === "string") return jsonSchemaTypes.has(type) ? void 0 : `${path}.type: unsupported JSON Schema type`;
	if (Array.isArray(type) && type.length > 0) {
		if (type.find((entry) => typeof entry !== "string" || !jsonSchemaTypes.has(entry)) !== void 0) return `${path}.type: unsupported JSON Schema type`;
		return new Set(type).size === type.length ? void 0 : `${path}.type: expected unique JSON Schema types`;
	}
	return `${path}.type: expected string or non-empty string array`;
}
function decodePointerSegment(segment) {
	let decodedSegment;
	try {
		decodedSegment = decodeURIComponent(segment);
	} catch {
		decodedSegment = segment;
	}
	return decodedSegment.replace(/~1/g, "/").replace(/~0/g, "~");
}
function parseJsonPointerArrayIndex(segment) {
	if (!JSON_POINTER_ARRAY_INDEX_SEGMENT.test(segment)) return;
	const index = Number(segment);
	return Number.isSafeInteger(index) ? index : void 0;
}
function resolveLocalAnchor(schema, anchor, isRoot = true) {
	if (!isRecord(schema)) return;
	if (!isRoot && typeof schema.$id === "string") return;
	if (schema.$anchor === anchor || schema.$dynamicAnchor === anchor) return schema;
	return visitSchemaChildren(schema, (child) => resolveLocalAnchor(child, anchor, false));
}
function resolveLocalRef(resourceRoot, ref, resourceBaseId) {
	if (isRecord(resourceRoot) && typeof resourceRoot.$id === "string" && resourceRoot.$id !== "") {
		if (ref === resourceRoot.$id) return {
			found: true,
			schema: resourceRoot,
			resourceRoot,
			resourceBaseId
		};
		if (ref.startsWith(`${resourceRoot.$id}#`)) return resolveLocalRef(resourceRoot, ref.slice(resourceRoot.$id.length), resourceBaseId);
	}
	if (ref === "#") return {
		found: true,
		schema: resourceRoot,
		resourceRoot,
		resourceBaseId
	};
	if (ref.startsWith("#/")) {
		let current = resourceRoot;
		let currentResourceRoot = resourceRoot;
		let currentResourceBaseId = resourceBaseId;
		for (const segment of ref.slice(2).split("/").map(decodePointerSegment)) {
			if (Array.isArray(current)) {
				const index = parseJsonPointerArrayIndex(segment);
				if (index === void 0) return { found: false };
				current = current[index];
			} else if (isRecord(current)) current = current[segment];
			else return { found: false };
			if (isRecord(current) && typeof current.$id === "string") {
				currentResourceRoot = current;
				currentResourceBaseId = resolveSchemaId(current.$id, currentResourceBaseId);
			}
		}
		return typeof current === "boolean" || isRecord(current) ? {
			found: true,
			schema: current,
			resourceRoot: currentResourceRoot,
			resourceBaseId: currentResourceBaseId
		} : { found: false };
	}
	if (ref.startsWith("#")) {
		let anchor;
		try {
			anchor = decodeURIComponent(ref.slice(1));
		} catch {
			return { found: false };
		}
		const resolved = resolveLocalAnchor(resourceRoot, anchor);
		return resolved === void 0 ? { found: false } : {
			found: true,
			schema: resolved,
			resourceRoot,
			resourceBaseId
		};
	}
	return { found: false };
}
function splitResourceRef(ref) {
	const hashIndex = ref.indexOf("#");
	return hashIndex === -1 ? {
		resource: ref,
		fragment: ""
	} : {
		resource: ref.slice(0, hashIndex),
		fragment: ref.slice(hashIndex)
	};
}
function stripFragment(id) {
	return splitResourceRef(id).resource;
}
function resolveSchemaId(id, baseId) {
	if (!baseId) return stripFragment(id);
	try {
		return stripFragment(new URL(id, baseId).href);
	} catch {
		return stripFragment(id);
	}
}
function resolveSchemaResourceRef(schema, ref, baseId) {
	const refParts = splitResourceRef(ref);
	const resolvedRefResource = refParts.resource === "" ? refParts.resource : resolveSchemaId(refParts.resource, baseId);
	const seen = /* @__PURE__ */ new Set();
	const visit = (current, baseIdLocal) => {
		if (!isRecord(current) || seen.has(current)) return { found: false };
		seen.add(current);
		let currentBaseId = baseIdLocal;
		if (typeof current.$id === "string" && current.$id !== "") {
			const resolvedId = resolveSchemaId(current.$id, baseIdLocal);
			currentBaseId = resolvedId;
			if (resolvedRefResource === resolvedId || refParts.resource === stripFragment(current.$id)) return refParts.fragment ? resolveLocalRef(current, refParts.fragment, currentBaseId) : {
				found: true,
				schema: current,
				resourceRoot: current,
				resourceBaseId: currentBaseId
			};
		}
		return visitSchemaChildren(current, (child) => {
			const resolved = visit(child, currentBaseId);
			return resolved.found ? resolved : void 0;
		}) ?? { found: false };
	};
	return visit(schema, void 0);
}
function resolveSchemaRef(root, resourceRoot, ref, baseId) {
	const localTarget = resolveLocalRef(resourceRoot, ref, baseId);
	return localTarget.found ? localTarget : resolveSchemaResourceRef(root, ref, baseId);
}
function isStringArray(value) {
	return Array.isArray(value) && value.every((entry) => typeof entry === "string");
}
function visitSchemaChildren(schema, visit) {
	for (const key of schemaMapKeywords) {
		const value = schema[key];
		if (!isRecord(value)) continue;
		for (const entry of Object.values(value)) {
			const resolved = visit(entry);
			if (resolved !== void 0) return resolved;
		}
	}
	if (isRecord(schema.dependencies)) {
		for (const entry of Object.values(schema.dependencies)) if (!isStringArray(entry)) {
			const resolved = visit(entry);
			if (resolved !== void 0) return resolved;
		}
	}
	for (const key of schemaValueKeywords) {
		const value = schema[key];
		if (typeof value === "boolean" || isRecord(value)) {
			const resolved = visit(value);
			if (resolved !== void 0) return resolved;
			continue;
		}
		if (key === "items" && Array.isArray(value)) for (const entry of value) {
			const resolved = visit(entry);
			if (resolved !== void 0) return resolved;
		}
	}
	for (const key of schemaArrayKeywords) {
		const value = schema[key];
		if (!Array.isArray(value)) continue;
		for (const entry of value) {
			const resolved = visit(entry);
			if (resolved !== void 0) return resolved;
		}
	}
}
function hasDuplicateJsonValues(values) {
	const seen = /* @__PURE__ */ new Set();
	for (const value of values) {
		const key = JSON.stringify(value);
		if (seen.has(key)) return true;
		seen.add(key);
	}
	return false;
}
function validateSchemaKeywordShapes(schema, path) {
	for (const key of schemaStringKeywords) {
		const value = schema[key];
		if (value !== void 0 && typeof value !== "string") return `${path}.${key}: expected string`;
	}
	for (const key of schemaNumberKeywords) {
		const value = schema[key];
		if (value !== void 0 && typeof value !== "number") return `${path}.${key}: expected number`;
	}
	for (const key of schemaIntegerKeywords) {
		const value = schema[key];
		if (value !== void 0 && (!Number.isInteger(value) || typeof value === "number" && value < 0)) return `${path}.${key}: expected non-negative integer`;
	}
	for (const key of schemaBooleanKeywords) {
		const value = schema[key];
		if (value !== void 0 && typeof value !== "boolean") return `${path}.${key}: expected boolean`;
	}
	if (schema.multipleOf !== void 0 && typeof schema.multipleOf === "number" && schema.multipleOf <= 0) return `${path}.multipleOf: expected positive number`;
	if (schema.required !== void 0) {
		if (!isStringArray(schema.required)) return `${path}.required: expected string array`;
		if (new Set(schema.required).size !== schema.required.length) return `${path}.required: expected unique string array`;
	}
	if (schema.enum !== void 0) {
		if (!Array.isArray(schema.enum)) return `${path}.enum: expected array`;
		if (schema.enum.length === 0 || hasDuplicateJsonValues(schema.enum)) return `${path}.enum: expected non-empty array with unique values`;
	}
	for (const key of schemaCombinatorKeywords) {
		const value = schema[key];
		if (Array.isArray(value) && value.length === 0) return `${path}.${key}: expected non-empty schema array`;
	}
	if (schema.dependentRequired !== void 0) {
		if (!isRecord(schema.dependentRequired)) return `${path}.dependentRequired: expected string array map`;
		for (const [key, value] of Object.entries(schema.dependentRequired)) if (!isStringArray(value)) return `${path}.dependentRequired.${key}: expected string array`;
	}
	if (schema.dependencies !== void 0) {
		if (!isRecord(schema.dependencies)) return `${path}.dependencies: expected schema or string array map`;
		for (const [key, value] of Object.entries(schema.dependencies)) if (!isStringArray(value) && typeof value !== "boolean" && !isRecord(value)) return `${path}.dependencies.${key}: expected schema or string array`;
	}
}
function findJsonSchemaNodeError(schema, path, root, resourceRoot, resourceBaseId) {
	if (typeof schema === "boolean") return;
	if (!isRecord(schema)) return `${path}: schema must be an object or boolean`;
	if (Object.hasOwn(schema, "type")) {
		const typeError = validateTypeKeyword(schema.type, path);
		if (typeError) return typeError;
	}
	if (schema.nullable !== void 0) {
		if (typeof schema.nullable !== "boolean") return `${path}.nullable: expected boolean`;
		if (!Object.hasOwn(schema, "type")) return `${path}.nullable: expected type`;
	}
	const keywordError = validateSchemaKeywordShapes(schema, path);
	if (keywordError) return keywordError;
	const currentResourceRoot = typeof schema.$id === "string" ? schema : resourceRoot;
	const currentResourceBaseId = typeof schema.$id === "string" ? resolveSchemaId(schema.$id, resourceBaseId) : resourceBaseId;
	if (typeof schema.$ref === "string") {
		if (!resolveSchemaRef(root, currentResourceRoot, schema.$ref, currentResourceBaseId).found) return `${path}.$ref: unresolved ref`;
	}
	if (typeof schema.$dynamicRef === "string") {
		if (!resolveSchemaRef(root, currentResourceRoot, schema.$dynamicRef, currentResourceBaseId).found) return `${path}.$dynamicRef: unresolved ref`;
	}
	for (const key of schemaMapKeywords) {
		const value = schema[key];
		if (value === void 0) continue;
		if (!isRecord(value)) return `${path}.${key}: expected schema map`;
		for (const [entryKey, entry] of Object.entries(value)) {
			const error = findJsonSchemaNodeError(entry, `${path}.${key}.${entryKey}`, root, currentResourceRoot, currentResourceBaseId);
			if (error) return error;
		}
	}
	if (isRecord(schema.dependencies)) for (const [key, value] of Object.entries(schema.dependencies)) {
		if (isStringArray(value)) continue;
		const error = findJsonSchemaNodeError(value, `${path}.dependencies.${key}`, root, currentResourceRoot, currentResourceBaseId);
		if (error) return error;
	}
	for (const key of schemaValueKeywords) {
		const value = schema[key];
		if (value === void 0 || typeof value === "boolean") continue;
		if (Array.isArray(value)) {
			if (key !== "items") return `${path}.${key}: expected schema`;
			for (const [index, entry] of value.entries()) {
				const error = findJsonSchemaNodeError(entry, `${path}.${key}.${index}`, root, currentResourceRoot, currentResourceBaseId);
				if (error) return error;
			}
			continue;
		}
		const error = findJsonSchemaNodeError(value, `${path}.${key}`, root, currentResourceRoot, currentResourceBaseId);
		if (error) return error;
	}
	for (const key of schemaArrayKeywords) {
		const value = schema[key];
		if (value === void 0) continue;
		if (!Array.isArray(value)) return `${path}.${key}: expected schema array`;
		for (const [index, entry] of value.entries()) {
			const error = findJsonSchemaNodeError(entry, `${path}.${key}.${index}`, root, currentResourceRoot, currentResourceBaseId);
			if (error) return error;
		}
	}
}
/** Return the first structural JSON Schema error that would make validation/defaulting unsafe. */
function findJsonSchemaShapeError(schema) {
	return findJsonSchemaNodeError(schema, "<schema>", schema, schema, void 0);
}
function cloneDefault(value) {
	if (value === void 0 || value === null) return value;
	return structuredClone(value);
}
function getDefault(schema) {
	if (!isRecord(schema) || !Object.hasOwn(schema, "default")) return;
	return cloneDefault(schema.default);
}
function schemaWithResourceContext(schema, resourceRoot) {
	if (!isRecord(schema) || !isRecord(resourceRoot)) return schema;
	return {
		...schema,
		...typeof resourceRoot.$id === "string" && schema.$id === void 0 ? { $id: resourceRoot.$id } : {},
		...isRecord(resourceRoot.$defs) ? { $defs: resourceRoot.$defs } : {},
		...isRecord(resourceRoot.definitions) ? { definitions: resourceRoot.definitions } : {}
	};
}
function inlineLocalRefsForMatch(schema, root, resourceRoot, resourceBaseId, resolvingRefs = /* @__PURE__ */ new Set()) {
	if (Array.isArray(schema)) return schema.map((entry) => inlineLocalRefsForMatch(entry, root, resourceRoot, resourceBaseId, resolvingRefs));
	if (!isRecord(schema)) return schema;
	const currentResourceRoot = typeof schema.$id === "string" ? schema : resourceRoot;
	const currentResourceBaseId = typeof schema.$id === "string" ? resolveSchemaId(schema.$id, resourceBaseId) : resourceBaseId;
	if (isRecord(schema) && typeof schema.$ref === "string") {
		const refKey = schemaResourceRefKey(currentResourceRoot, schema.$ref, currentResourceBaseId);
		const target = resolvingRefs.has(refKey) ? { found: false } : resolveSchemaRef(root, currentResourceRoot, schema.$ref, currentResourceBaseId);
		if (target.found) {
			const { $ref: _$ref, ...siblingSchema } = schema;
			resolvingRefs.add(refKey);
			const inlinedTarget = inlineLocalRefsForMatch(target.schema, root, target.resourceRoot, target.resourceBaseId, resolvingRefs);
			resolvingRefs.delete(refKey);
			if (Object.keys(siblingSchema).length === 0) return inlinedTarget;
			return { allOf: [inlinedTarget, inlineLocalRefsForMatch(siblingSchema, root, currentResourceRoot, currentResourceBaseId, resolvingRefs)] };
		}
	}
	return Object.fromEntries(Object.entries(schema).map(([key, value]) => {
		if (schemaMapKeywords.has(key) && isRecord(value)) return [key, Object.fromEntries(Object.entries(value).map(([entryKey, entry]) => [entryKey, inlineLocalRefsForMatch(entry, root, currentResourceRoot, currentResourceBaseId, resolvingRefs)]))];
		if (key === "dependencies" && isRecord(value)) return [key, Object.fromEntries(Object.entries(value).map(([entryKey, entry]) => [entryKey, isStringArray(entry) ? entry : inlineLocalRefsForMatch(entry, root, currentResourceRoot, currentResourceBaseId, resolvingRefs)]))];
		if (schemaValueKeywords.has(key) || schemaArrayKeywords.has(key)) return [key, inlineLocalRefsForMatch(value, root, currentResourceRoot, currentResourceBaseId, resolvingRefs)];
		return [key, value];
	}));
}
function schemaMatches(schema, value, root, resourceRoot, resourceBaseId) {
	try {
		const matchSchema = inlineLocalRefsForMatch(schema, root, resourceRoot, resourceBaseId);
		return Compile(normalizeJsonSchemaForTypeBox(schemaWithResourceContext(matchSchema, resourceRoot))).Check(value);
	} catch {
		return false;
	}
}
function applyObjectPropertyDefaults(schema, value, root, resolvingRefs, currentResourceRoot, currentResourceBaseId) {
	const properties = isRecord(schema.properties) ? schema.properties : {};
	for (const [key, propertySchema] of Object.entries(properties)) {
		if (isBlockedObjectKey(key)) continue;
		const currentValue = value[key];
		const defaultedValue = applySchemaDefaults(propertySchema, currentValue, root, resolvingRefs, currentResourceRoot, currentResourceBaseId);
		if (defaultedValue !== currentValue || currentValue === void 0) {
			if (defaultedValue !== void 0) value[key] = defaultedValue;
		}
	}
	const patternMatchedKeys = /* @__PURE__ */ new Set();
	if (isRecord(schema.patternProperties)) for (const [pattern, propertySchema] of Object.entries(schema.patternProperties)) {
		let regex;
		try {
			regex = new RegExp(pattern);
		} catch {
			continue;
		}
		for (const key of Object.keys(value)) {
			if (isBlockedObjectKey(key) || !regex.test(key)) continue;
			patternMatchedKeys.add(key);
			value[key] = applySchemaDefaults(propertySchema, value[key], root, resolvingRefs, currentResourceRoot, currentResourceBaseId);
		}
	}
	if (isRecord(schema.additionalProperties)) {
		const additionalSchema = schema.additionalProperties;
		for (const key of Object.keys(value)) {
			if (isBlockedObjectKey(key) || Object.hasOwn(properties, key) || patternMatchedKeys.has(key)) continue;
			value[key] = applySchemaDefaults(additionalSchema, value[key], root, resolvingRefs, currentResourceRoot, currentResourceBaseId);
		}
	}
	return value;
}
function applyObjectDependencyDefaults(schema, value, root, resolvingRefs, currentResourceRoot, currentResourceBaseId) {
	let nextValue = value;
	if (isRecord(schema.dependencies)) for (const [key, dependencySchema] of Object.entries(schema.dependencies)) {
		if (!Object.hasOwn(nextValue, key) || isStringArray(dependencySchema)) continue;
		nextValue = applySchemaDefaults(dependencySchema, nextValue, root, resolvingRefs, currentResourceRoot, currentResourceBaseId);
	}
	if (isRecord(schema.dependentSchemas)) for (const [key, dependentSchema] of Object.entries(schema.dependentSchemas)) {
		if (!Object.hasOwn(nextValue, key)) continue;
		nextValue = applySchemaDefaults(dependentSchema, nextValue, root, resolvingRefs, currentResourceRoot, currentResourceBaseId);
	}
	return nextValue;
}
function applyObjectConditionalDefaults(schema, value, root, resolvingRefs, currentResourceRoot, currentResourceBaseId) {
	if (!(typeof schema.if === "boolean" || isRecord(schema.if))) return value;
	const branch = schemaMatches(schema.if, value, root, currentResourceRoot, currentResourceBaseId) ? schema.then : schema.else;
	if (!(typeof branch === "boolean" || isRecord(branch))) return value;
	return applySchemaDefaults(branch, value, root, resolvingRefs, currentResourceRoot, currentResourceBaseId);
}
function countSchemaNodes(schema, seen = /* @__PURE__ */ new Set()) {
	if (typeof schema === "boolean" || !isRecord(schema) || seen.has(schema)) return 1;
	seen.add(schema);
	let count = 1;
	visitSchemaChildren(schema, (child) => {
		count += countSchemaNodes(child, seen);
	});
	return count;
}
function applyObjectApplicatorDefaults(schema, value, root, resolvingRefs, currentResourceRoot, currentResourceBaseId) {
	let nextValue = applyObjectPropertyAndDependencyDefaults(schema, value, root, resolvingRefs, currentResourceRoot, currentResourceBaseId);
	nextValue = applyObjectConditionalDefaults(schema, nextValue, root, resolvingRefs, currentResourceRoot, currentResourceBaseId);
	return applyObjectPropertyAndDependencyDefaults(schema, nextValue, root, resolvingRefs, currentResourceRoot, currentResourceBaseId);
}
function applyObjectPropertyAndDependencyDefaults(schema, value, root, resolvingRefs, currentResourceRoot, currentResourceBaseId) {
	let nextValue = value;
	const maxIterations = countSchemaNodes(schema);
	for (let index = 0; index < maxIterations; index++) {
		const before = JSON.stringify(nextValue);
		nextValue = applyObjectPropertyDefaults(schema, nextValue, root, resolvingRefs, currentResourceRoot, currentResourceBaseId);
		nextValue = applyObjectDependencyDefaults(schema, nextValue, root, resolvingRefs, currentResourceRoot, currentResourceBaseId);
		if (JSON.stringify(nextValue) === before) break;
	}
	return nextValue;
}
function applySchemaDefaults(schema, valueInput, root = schema, resolvingRefs = /* @__PURE__ */ new Set(), resourceRoot = root, resourceBaseId) {
	let value = valueInput;
	if (value === void 0) {
		const defaultValue = getDefault(schema);
		if (defaultValue !== void 0) value = defaultValue;
	}
	if (!isRecord(schema)) return value;
	const currentResourceRoot = typeof schema.$id === "string" ? schema : resourceRoot;
	const currentResourceBaseId = typeof schema.$id === "string" ? resolveSchemaId(schema.$id, resourceBaseId) : resourceBaseId;
	let nextValue = value;
	const refKey = typeof schema.$ref === "string" ? schemaResourceRefKey(currentResourceRoot, schema.$ref, currentResourceBaseId) : void 0;
	if (typeof schema.$ref === "string" && refKey !== void 0 && !resolvingRefs.has(refKey)) {
		const target = resolveSchemaRef(root, currentResourceRoot, schema.$ref, currentResourceBaseId);
		if (target.found) {
			resolvingRefs.add(refKey);
			nextValue = applySchemaDefaults(target.schema, nextValue, root, resolvingRefs, target.resourceRoot, target.resourceBaseId);
			resolvingRefs.delete(refKey);
		}
	}
	const composedSchemas = [...Array.isArray(schema.allOf) ? schema.allOf : []];
	for (const branch of composedSchemas) nextValue = applySchemaDefaults(branch, nextValue, root, resolvingRefs, currentResourceRoot, currentResourceBaseId);
	const hasObjectApplicators = isRecord(schema.properties) || isRecord(schema.patternProperties) || isRecord(schema.additionalProperties) || isRecord(schema.dependencies) || isRecord(schema.dependentSchemas) || typeof schema.if === "boolean" || isRecord(schema.if);
	if ((schemaTypeIncludes(schema, "object") || hasObjectApplicators) && isRecord(nextValue)) {
		nextValue = applyObjectApplicatorDefaults(schema, nextValue, root, resolvingRefs, currentResourceRoot, currentResourceBaseId);
		return nextValue;
	}
	if ((schemaTypeIncludes(schema, "array") || schema.items !== void 0 || schema.prefixItems !== void 0) && Array.isArray(nextValue)) {
		const tupleSchemas = Array.isArray(schema.prefixItems) ? schema.prefixItems : Array.isArray(schema.items) ? schema.items : null;
		if (tupleSchemas) {
			const result = nextValue.slice();
			for (const [index, itemSchema] of tupleSchemas.entries()) {
				const defaultedValue = applySchemaDefaults(itemSchema, result[index], root, resolvingRefs, currentResourceRoot, currentResourceBaseId);
				if (defaultedValue !== void 0) result[index] = defaultedValue;
			}
			const restSchema = isRecord(schema.items) ? schema.items : isRecord(schema.additionalItems) ? schema.additionalItems : null;
			if (restSchema) for (let index = tupleSchemas.length; index < result.length; index++) result[index] = applySchemaDefaults(restSchema, result[index], root, resolvingRefs, currentResourceRoot, currentResourceBaseId);
			return result;
		}
		if (!isRecord(schema.items)) return nextValue;
		return nextValue.map((item) => applySchemaDefaults(schema.items, item, root, resolvingRefs, currentResourceRoot, currentResourceBaseId));
	}
	return nextValue;
}
/** Apply schema defaults to a config value while preserving caller-owned value shape. */
function applyJsonSchemaDefaults(schema, value) {
	return applySchemaDefaults(schema, value);
}
//#endregion
export { findJsonSchemaShapeError as n, applyJsonSchemaDefaults as t };
