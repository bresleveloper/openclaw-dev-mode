import { a as asRecord, o as isRecord } from "./record-coerce-CNDovvft.mjs";
import { r as parseLocalSchemaRefPointer } from "./validation-9FSkE8T-.mjs";
import { o as normalizeOptionalString } from "./string-coerce-Cj8sqWHx.mjs";
import { r as getAiTransportHost } from "./host-CWt55nnF.mjs";
import { hash } from "node:crypto";
import { types } from "node:util";
//#region packages/normalization-core/src/node-crypto.ts
function sha256Hex(input) {
	return hash("sha256", input, "hex");
}
function sha256HexPrefixCore(input, length) {
	return sha256Hex(input).slice(0, length);
}
/** Redacts an identifier to a stable hash label, or "-" for missing values. */
function redactIdentifier(value, opts) {
	const trimmed = normalizeOptionalString(value);
	if (!trimmed) return "-";
	const len = opts?.len ?? 12;
	return `sha256:${sha256HexPrefixCore(trimmed, Number.isFinite(len) ? Math.max(1, Math.floor(len)) : 12)}`;
}
//#endregion
//#region packages/ai/src/providers/schema-walk.ts
const SCHEMA_MAP_KEYS = /* @__PURE__ */ new Set([
	"$defs",
	"definitions",
	"dependentSchemas",
	"dependencies",
	"patternProperties",
	"properties"
]);
/** Containers whose value is a single nested schema. */
const SCHEMA_OBJECT_KEYS = /* @__PURE__ */ new Set([
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
const SCHEMA_ARRAY_KEYS = /* @__PURE__ */ new Set([
	"allOf",
	"anyOf",
	"items",
	"oneOf",
	"prefixItems"
]);
const SCHEMA_NESTED_KEYS = new Set([...SCHEMA_OBJECT_KEYS, ...SCHEMA_ARRAY_KEYS].toSorted());
function* walkSchemaArray(schemas, visit, result = []) {
	result.length = schemas.length;
	for (let index = 0; index < result.length; index += 1) if (index in schemas) result[index] = yield visit(schemas[index]);
	return result;
}
function* walkSchemaValue(schema, ancestors, visitObject) {
	if (!schema || typeof schema !== "object") return schema;
	if (ancestors.has(schema)) throw new TypeError("Tool schema contains a circular reference.");
	ancestors.add(schema);
	try {
		return yield Array.isArray(schema) ? walkSchemaArray(schema, (entry) => walkSchemaValue(entry, ancestors, visitObject)) : visitObject(asRecord(schema));
	} finally {
		ancestors.delete(schema);
	}
}
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
//#region packages/ai/src/providers/tool-schema-depth.ts
/** Schema nodes and expanded references share this budget; containers are transparent. */
const MAX_TOOL_SCHEMA_DEPTH = 128;
/** Classify children after toJSON when serializing, or directly when normalizing. */
function toolSchemaChildPosition(position, parent, key, child) {
	if (!position || typeof child !== "boolean" && (!child || typeof child !== "object")) return;
	if (position.kind === "dependencies" && Array.isArray(child)) return;
	if (position.kind !== "schema" || Array.isArray(parent)) return {
		kind: "schema",
		depth: position.depth + 1
	};
	if (SCHEMA_MAP_KEYS.has(key) && isRecord(child)) return {
		kind: key === "dependencies" ? "dependencies" : "map",
		depth: position.depth
	};
	if (SCHEMA_ARRAY_KEYS.has(key) && Array.isArray(child)) return {
		kind: "array",
		depth: position.depth
	};
	return SCHEMA_OBJECT_KEYS.has(key) ? {
		kind: "schema",
		depth: position.depth + 1
	} : void 0;
}
const reportedSchemas = /* @__PURE__ */ new WeakMap();
const truncatedSchemaResults = /* @__PURE__ */ new WeakSet();
function wasToolSchemaTruncated(schema) {
	return schema !== null && typeof schema === "object" && truncatedSchemaResults.has(schema);
}
/** Preserve reduced-validation provenance across schema copies without repeating diagnostics. */
function inheritToolSchemaTruncation(source, result, truncated = false) {
	if (result && typeof result === "object") {
		if (truncated || wasToolSchemaTruncated(source)) truncatedSchemaResults.add(result);
		const names = source && typeof source === "object" ? reportedSchemas.get(source) : void 0;
		if (names) reportedSchemas.set(result, names);
	}
	return result;
}
function reportToolSchemaTruncation(schema, toolName) {
	if (!schema || typeof schema !== "object") return;
	const names = reportedSchemas.get(schema) ?? /* @__PURE__ */ new Set();
	reportedSchemas.set(schema, names);
	if (!toolName || names.has(toolName)) return;
	names.add(toolName);
	getAiTransportHost().logWarn("[tool-schema]", `Tool "${toolName}" schema exceeds 128 nested levels; deep subschemas were replaced with {}. The tool remains available with reduced validation.`);
}
/** Bound schema structure without changing literal data or caching mutable provider inputs. */
function truncateToolSchemaDepth(schema, toolName) {
	const ancestors = /* @__PURE__ */ new Set();
	let truncated = false;
	function visit(node, position) {
		if (!position) return node;
		if (position.kind === "schema" && wasToolSchemaTruncated(node)) truncated = true;
		if (position.kind === "schema" && position.depth > 128) {
			truncated = true;
			return {};
		}
		if (!node || typeof node !== "object") return node;
		if (ancestors.has(node)) throw new TypeError("Tool schema contains a circular reference.");
		ancestors.add(node);
		try {
			if (Array.isArray(node)) {
				let changed = false;
				const entries = node.map((entry, index) => {
					const next = visit(entry, toolSchemaChildPosition(position, node, String(index), entry));
					changed ||= next !== entry;
					return next;
				});
				return changed ? entries : node;
			}
			let changed = false;
			const entries = Object.entries(node).map(([key, value]) => {
				const next = visit(value, toolSchemaChildPosition(position, node, key, value));
				changed ||= next !== value;
				return [key, next];
			});
			return changed ? Object.fromEntries(entries) : node;
		} finally {
			ancestors.delete(node);
		}
	}
	const normalized = visit(schema, {
		kind: "schema",
		depth: 0
	});
	if (truncated) reportToolSchemaTruncation(schema, toolName);
	return inheritToolSchemaTruncation(schema, normalized, truncated);
}
//#endregion
//#region packages/ai/src/providers/tool-schema-refs.ts
function setOwnSchemaProperty(target, key, value) {
	Object.defineProperty(target, key, {
		value,
		enumerable: true,
		configurable: true,
		writable: true
	});
}
function copySchemaMeta(from, to) {
	for (const key of [
		"title",
		"description",
		"default"
	]) if (key in from && from[key] !== void 0) to[key] = from[key];
}
function extendSchemaDefs(defs, schema) {
	const defsEntry = isRecord(schema.$defs) ? schema.$defs : void 0;
	const legacyDefsEntry = isRecord(schema.definitions) ? schema.definitions : void 0;
	if (!defsEntry && !legacyDefsEntry) return defs;
	const next = {
		$defs: new Map(defs?.$defs),
		definitions: new Map(defs?.definitions)
	};
	if (defsEntry) for (const [key, value] of Object.entries(defsEntry)) next.$defs.set(key, value);
	if (legacyDefsEntry) for (const [key, value] of Object.entries(legacyDefsEntry)) next.definitions.set(key, value);
	return next;
}
function resolveJsonPointerPath(value, tokens) {
	let current = value;
	for (const key of tokens) {
		if (!current || typeof current !== "object") return;
		if (Array.isArray(current)) {
			const index = /^(?:0|[1-9]\d*)$/.test(key) ? Number(key) : -1;
			if (index < 0 || index >= current.length) return;
			current = current[index];
			continue;
		}
		if (!isRecord(current) || !Object.hasOwn(current, key)) return;
		current = current[key];
	}
	return current;
}
const SCHEMA_LITERAL_KEYS = /* @__PURE__ */ new Set([
	"const",
	"default",
	"enum",
	"examples"
]);
function tryResolveLocalRef(ref, defs, rootDocument) {
	const tokens = parseLocalSchemaRefPointer(ref);
	if (!tokens) return;
	const [table, name, ...remainingPath] = tokens;
	if (defs && name && (table === "$defs" || table === "definitions")) {
		const resolved = (table === "$defs" ? defs.$defs : defs.definitions).get(name);
		if (resolved !== void 0) return resolveJsonPointerPath(resolved, remainingPath);
	}
	return resolveJsonPointerPath(rootDocument, tokens);
}
function inlineLocalSchemaRefsWithDefs(schema, defs, refStack, state, rootDocument, depth = 0) {
	if (depth > 128) {
		state.truncated = true;
		return {};
	}
	if (Array.isArray(schema)) return schema.map((entry) => inlineLocalSchemaRefsWithDefs(entry, defs, refStack, state, rootDocument, depth + 1));
	if (!isRecord(schema)) return schema;
	const obj = schema;
	const nextDefs = extendSchemaDefs(defs, obj);
	const refValue = typeof obj.$ref === "string" ? obj.$ref : void 0;
	if (refValue) {
		if (refStack?.has(refValue)) return {};
		const resolved = tryResolveLocalRef(refValue, nextDefs, rootDocument);
		if (resolved === void 0) {
			if (refValue.startsWith("#/") || parseLocalSchemaRefPointer(refValue)) state.unresolvedLocalRefs = true;
			return { ...obj };
		}
		const nextRefStack = new Set(refStack);
		nextRefStack.add(refValue);
		const inlined = inlineLocalSchemaRefsWithDefs(resolved, nextDefs, nextRefStack, state, rootDocument, depth + 1);
		if (!isRecord(inlined)) return inlined;
		const result = { ...inlined };
		copySchemaMeta(obj, result);
		if (obj.nullable === true) result.nullable = true;
		return result;
	}
	const result = {};
	for (const [key, value] of Object.entries(obj)) {
		if (key === "$defs" || key === "definitions" || key === "components") continue;
		let next = value;
		if (SCHEMA_MAP_KEYS.has(key) && isRecord(value)) {
			const entries = Object.entries(value);
			for (const entry of entries) {
				if (key === "dependencies" && Array.isArray(entry[1])) continue;
				entry[1] = inlineLocalSchemaRefsWithDefs(entry[1], nextDefs, refStack, state, rootDocument, depth + 1);
			}
			next = Object.fromEntries(entries);
		} else if (SCHEMA_OBJECT_KEYS.has(key) && isRecord(value)) next = inlineLocalSchemaRefsWithDefs(value, nextDefs, refStack, state, rootDocument, depth + 1);
		else if (SCHEMA_ARRAY_KEYS.has(key) && Array.isArray(value)) next = value.map((entry) => inlineLocalSchemaRefsWithDefs(entry, nextDefs, refStack, state, rootDocument, depth + 1));
		setOwnSchemaProperty(result, key, next);
	}
	if (state.unresolvedLocalRefs) {
		for (const key of [
			"$defs",
			"definitions",
			"components"
		]) if (key in obj) result[key] = obj[key];
	}
	return result;
}
/** Inline local $ref pointers so providers receive self-contained tool schemas. */
function inlineLocalToolSchemaRefs(schema, toolName) {
	if (!schema || typeof schema !== "object") return schema;
	const boundedSchema = truncateToolSchemaDepth(schema, toolName);
	const state = {
		unresolvedLocalRefs: false,
		truncated: false
	};
	const schemaRecord = boundedSchema;
	const normalized = inlineLocalSchemaRefsWithDefs(boundedSchema, Array.isArray(boundedSchema) ? extendSchemaDefs(void 0, schemaRecord) : void 0, void 0, state, boundedSchema);
	const bounded = truncateToolSchemaDepth(normalized);
	if (state.truncated || bounded !== normalized) reportToolSchemaTruncation(schema, toolName);
	return inheritToolSchemaTruncation(boundedSchema, bounded, state.truncated);
}
/** Keep compact root definitions. Fall back for scopes or refs we must rewrite. */
function canPreserveRootSchemaRefs(inputSchema) {
	const schema = truncateToolSchemaDepth(inputSchema);
	if (!isRecord(schema) || schema.type !== "object" || !isRecord(schema.properties) || ["$defs", "definitions"].some((key) => key in schema && !isRecord(schema[key])) || [
		"anyOf",
		"oneOf",
		"allOf"
	].some((key) => Array.isArray(schema[key])) || "$ref" in schema) return false;
	let hasRefs = false;
	const ancestors = /* @__PURE__ */ new Set();
	function visit(node, inDefinitions = false) {
		if (!isRecord(node)) return true;
		if (ancestors.has(node) || "$id" in node || "id" in node || "components" in node || node !== schema && ("$defs" in node || "definitions" in node)) return false;
		if ("$ref" in node) {
			if (typeof node.$ref !== "string" || !/^#\/(\$defs|definitions)\/[^/]+$/.test(node.$ref) || node.nullable === true || tryResolveLocalRef(node.$ref, void 0, schema) === void 0) return false;
			hasRefs ||= !inDefinitions;
		}
		ancestors.add(node);
		try {
			for (const [key, value] of Object.entries(node)) if (SCHEMA_MAP_KEYS.has(key) && isRecord(value)) {
				const childInDefinitions = inDefinitions || key === "$defs" || key === "definitions";
				if (!Object.values(value).every((entry) => visit(entry, childInDefinitions))) return false;
			} else if (SCHEMA_ARRAY_KEYS.has(key) && Array.isArray(value)) {
				if (!value.every((entry) => visit(entry, inDefinitions))) return false;
			} else if (SCHEMA_OBJECT_KEYS.has(key) && !visit(value, inDefinitions)) return false;
			return true;
		} finally {
			ancestors.delete(node);
		}
	}
	return visit(schema) && hasRefs;
}
//#endregion
//#region packages/ai/src/providers/tool-schema-json-projection.ts
const publishedSchemas = /* @__PURE__ */ new WeakMap();
function getPublishedRuntimeToolInputSchema(schema) {
	return schema !== null && typeof schema === "object" ? publishedSchemas.get(schema) : void 0;
}
/** Only an owner's detached JSON publication can bypass later schema traversals. */
function publishRuntimeToolInputSchema(schema, path = "parameters", toolName) {
	if (getPublishedRuntimeToolInputSchema(schema)) return projectRuntimeToolInputSchema(schema, path, toolName);
	let json = "";
	const projection = projectToolInputSchema(schema, path, (text) => json = text, toolName);
	if (projection.violations.length > 0 || !isRecord(projection.schema)) return projection;
	inheritToolSchemaTruncation(schema, projection.schema);
	const pending = [projection.schema];
	while (pending.length > 0) {
		const value = pending.pop();
		if (value && typeof value === "object") {
			for (const child of Object.values(value)) pending.push(child);
			Object.freeze(value);
		}
	}
	Object.freeze(projection.violations);
	Object.freeze(projection);
	publishedSchemas.set(projection.schema, Object.freeze({
		projection,
		json,
		fingerprint: sha256Hex(json)
	}));
	return projection;
}
function isNonFiniteNumberValue(value) {
	if (typeof value === "number") return !Number.isFinite(value);
	if (value === null || typeof value !== "object" || !types.isNumberObject(value)) return false;
	return !Number.isFinite(Number.prototype.valueOf.call(value));
}
function projectToolInputSchema(value, path, captureJson, toolName) {
	const nonFiniteNumber = { path: null };
	const ancestors = [];
	const segments = [path];
	let isRoot = true;
	let truncated = false;
	let text;
	try {
		text = JSON.stringify(value, function(key, sourceEntry) {
			let entry = sourceEntry;
			while (ancestors.length > 0 && ancestors[ancestors.length - 1]?.value !== this) {
				const parent = ancestors.pop();
				if (parent) segments.length = parent.pathLength;
			}
			const position = isRoot ? {
				kind: "schema",
				depth: 0
			} : toolSchemaChildPosition(ancestors[ancestors.length - 1]?.position, this, key, entry);
			if (position?.kind === "schema" && wasToolSchemaTruncated(entry)) truncated = true;
			if (position?.kind === "schema" && position.depth > 128) {
				truncated = true;
				entry = {};
			}
			const invalidNumber = nonFiniteNumber.path === null && isNonFiniteNumberValue(entry);
			if (invalidNumber || entry && typeof entry === "object") {
				const prefixLength = segments.length;
				if (!isRoot) {
					if (Array.isArray(this)) segments.push("[", key, "]");
					else segments.push(".", key);
				}
				if (invalidNumber) {
					nonFiniteNumber.path = segments.join("");
					segments.length = prefixLength;
				} else ancestors.push({
					value: entry,
					pathLength: prefixLength,
					position
				});
			}
			isRoot = false;
			return entry;
		});
	} catch {}
	if (!text || nonFiniteNumber.path !== null) return {
		schema: {},
		violations: [`${text ? nonFiniteNumber.path : path} is not JSON-serializable`]
	};
	if (truncated) reportToolSchemaTruncation(value, toolName);
	const schema = inheritToolSchemaTruncation(void 0, JSON.parse(text), truncated);
	captureJson?.(text);
	const violations = [];
	if (!isRecord(schema)) violations.push(`${path} must be a JSON object schema`);
	else if (schema.type !== void 0 && schema.type !== "object") violations.push(`${path}.type must be "object"`);
	if (!inspectJsonSchema(schema, [path], violations)) return {
		schema: {},
		violations: [`${path} is not a JSON value`]
	};
	return {
		schema,
		violations
	};
}
function inspectJsonSchema(schema, path, violations, inspectKeywords = true) {
	if (Array.isArray(schema)) {
		let index = 0;
		for (const entry of schema) {
			path.push("[", index++, "]");
			const valid = inspectJsonSchema(entry, path, violations, inspectKeywords);
			path.length -= 3;
			if (!valid) return false;
		}
		return true;
	}
	if (!isRecord(schema)) return typeof schema !== "number" || Number.isFinite(schema);
	if (inspectKeywords) {
		for (const key of ["$dynamicRef", "$dynamicAnchor"]) if (key in schema) violations.push(`${path.join("")}.${key}`);
	}
	for (const [key, value] of Object.entries(schema)) {
		if (typeof value === "number" && !Number.isFinite(value)) return false;
		if (!value || typeof value !== "object") continue;
		path.push(".", key);
		const inspectChildKeywords = inspectKeywords && !SCHEMA_LITERAL_KEYS.has(key);
		if (inspectChildKeywords && SCHEMA_MAP_KEYS.has(key) && isRecord(value)) for (const [schemaName, childSchema] of Object.entries(value)) {
			path.push(".", schemaName);
			const valid = inspectJsonSchema(childSchema, path, violations);
			path.length -= 2;
			if (!valid) return false;
		}
		else if (!inspectJsonSchema(value, path, violations, inspectChildKeywords)) return false;
		path.length -= 2;
	}
	return true;
}
/** Projects one runtime tool input schema to JSON and reports runtime incompatibilities. */
function projectRuntimeToolInputSchema(schema, path = "parameters", toolName) {
	const published = getPublishedRuntimeToolInputSchema(schema);
	if (published) {
		if (wasToolSchemaTruncated(schema)) reportToolSchemaTruncation(schema, toolName);
		return published.projection;
	}
	return projectToolInputSchema(schema, path, void 0, toolName);
}
/** Package-private preparation; public projections never carry normalization provenance. */
function prepareRuntimeToolInputSchema(schema, path, toolName) {
	if (getPublishedRuntimeToolInputSchema(schema)) return { projection: projectRuntimeToolInputSchema(schema, path, toolName) };
	let inputJson;
	const projection = projectToolInputSchema(schema, path, (text) => {
		inputJson = text;
	}, toolName);
	return {
		projection,
		...schema && typeof schema === "object" && inputJson && projection.violations.length === 0 ? { normalization: {
			source: schema,
			inputJson
		} } : {}
	};
}
//#endregion
export { redactIdentifier as C, walkSchemaValue as S, SCHEMA_MAP_KEYS as _, SCHEMA_LITERAL_KEYS as a, evaluateSchemaWalk as b, inlineLocalToolSchemaRefs as c, inheritToolSchemaTruncation as d, reportToolSchemaTruncation as f, SCHEMA_ARRAY_KEYS as g, wasToolSchemaTruncated as h, publishRuntimeToolInputSchema as i, setOwnSchemaProperty as l, truncateToolSchemaDepth as m, prepareRuntimeToolInputSchema as n, canPreserveRootSchemaRefs as o, toolSchemaChildPosition as p, projectRuntimeToolInputSchema as r, copySchemaMeta as s, getPublishedRuntimeToolInputSchema as t, MAX_TOOL_SCHEMA_DEPTH as u, SCHEMA_NESTED_KEYS as v, sha256Hex as w, walkSchemaArray as x, SCHEMA_OBJECT_KEYS as y };
