import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { o as stringifyCodeModeJsonSafe, u as createCodeModeResultReference } from "./code-mode-json-Cek5lI0P.mjs";
import { n as ToolInputError } from "./tool-input-error-mjW74R8m.mjs";
import { randomUUID } from "node:crypto";
//#region src/agents/code-mode-results.ts
const stores = /* @__PURE__ */ new WeakMap();
const MAX_RESULTS = 64;
function disposeCodeModeResults(owner) {
	stores.get(owner)?.close();
}
/** Capture the result-store lifetime; an old cell must never adopt its replacement. */
function createCodeModeResultsAccess(ctx, config) {
	const owner = ctx.catalogRef;
	const catalog = owner?.current;
	const scope = JSON.stringify([
		ctx.agentId,
		ctx.runId,
		ctx.sessionId,
		ctx.sessionKey,
		catalog?.counterScope
	]);
	const maxBytes = Math.min(config.memoryLimitBytes, config.maxSnapshotBytes);
	let initialStore = owner ? stores.get(owner) : void 0;
	if (owner && catalog && !initialStore && !ctx.abortSignal?.aborted) {
		const signal = ctx.abortSignal;
		const created = {
			scope,
			maxBytes,
			bytes: 0,
			entries: /* @__PURE__ */ new Map(),
			close: () => {
				created.entries.clear();
				created.bytes = 0;
				signal?.removeEventListener("abort", created.close);
				if (stores.get(owner) === created) stores.delete(owner);
			}
		};
		stores.set(owner, created);
		signal?.addEventListener("abort", created.close, { once: true });
		initialStore = created;
	}
	const capturedStore = initialStore;
	const currentStore = () => {
		ctx.abortSignal?.throwIfAborted();
		if (!owner?.current || !capturedStore || owner.current.counterScope !== catalog?.counterScope || stores.get(owner) !== capturedStore) throw new ToolInputError("Code Mode results are unavailable after the run catalog changed or closed.");
		if (JSON.stringify([
			ctx.agentId,
			ctx.runId,
			ctx.sessionId,
			ctx.sessionKey,
			owner.current.counterScope
		]) !== scope || capturedStore.scope !== scope) throw new ToolInputError("Code Mode results belong to a different run or session.");
		return capturedStore;
	};
	const find = (id) => {
		if (typeof id !== "string" || !id) throw new ToolInputError("results reference id must be a non-empty string.");
		const store = currentStore();
		const entry = store.entries.get(id);
		if (!entry) throw new ToolInputError("Code Mode result is unavailable or expired; fetch fresh data if needed.");
		return {
			store,
			entry,
			id
		};
	};
	const retainJson = (json, networkContent) => {
		const bytes = Buffer.byteLength(json, "utf8");
		const store = currentStore();
		const allowance = Math.min(store.maxBytes, maxBytes);
		if (bytes > allowance) return { reason: "Not retained: result exceeds the data allowance. Return less data." };
		if (store.entries.size >= MAX_RESULTS || bytes > allowance - store.bytes) return { reason: "Not retained: result-store capacity exceeded. Delete references or return less data." };
		const id = `result_${randomUUID()}`;
		const reference = createCodeModeResultReference(id, json, JSON.parse(json));
		store.entries.set(id, {
			json,
			bytes,
			networkContent
		});
		store.bytes += bytes;
		return {
			reference,
			release: () => {
				if (store.entries.delete(id)) store.bytes -= bytes;
			}
		};
	};
	return {
		save(value, networkContent) {
			const retained = retainJson(stringifyCodeModeJsonSafe(value), networkContent);
			if ("reason" in retained) throw new ToolInputError("Code Mode results capacity exceeded; delete saved references or save a smaller value. Existing references are unchanged.");
			return retained.reference;
		},
		retain(source, networkContent) {
			if (source.kind !== "complete") return { reason: "Not retained: result exceeds the data allowance. Return less data." };
			try {
				return retainJson(source.json, networkContent);
			} catch (error) {
				if (error instanceof ToolInputError) return { reason: "Not retained: run catalog is unavailable or changed. Return less data." };
				throw error;
			}
		},
		load(id) {
			const { entry } = find(id);
			return {
				value: JSON.parse(entry.json),
				networkContent: entry.networkContent
			};
		},
		delete(id) {
			const { store, entry, id: key } = find(id);
			store.entries.delete(key);
			store.bytes -= entry.bytes;
			return true;
		}
	};
}
//#endregion
//#region src/agents/tool-schema-hints.ts
/** Bounded TypeScript-style hints for model-visible tool input and output schemas. */
const MAX_TOOL_SCHEMA_DECLARATION_CHARS = 32768;
const MAX_COMPACT_INPUT_HINT_CHARS = 300;
const MAX_COMPACT_OUTPUT_HINT_CHARS = 800;
const MAX_COMPACT_INPUT_SCHEMA_PROPERTIES = 16;
const MAX_COMPACT_OUTPUT_SCHEMA_PROPERTIES = 22;
const MAX_COMPACT_SCHEMA_PROPERTY_NAME_CHARS = 128;
const MAX_COMPACT_INPUT_DEPTH = 4;
const MAX_COMPACT_OUTPUT_DEPTH = 6;
const MAX_COMPACT_UNION_TYPES = 5;
const MAX_COMPACT_ENUM_VALUES = 8;
const MAX_COMPACT_ENUM_CHARS = 96;
const IDENTIFIER_RE = /^[A-Za-z_$][A-Za-z0-9_$]*$/u;
const NUMERIC_INPUT_BOUNDS = [
	["minimum", ">="],
	["maximum", "<="],
	["exclusiveMinimum", ">"],
	["exclusiveMaximum", "<"]
];
const UNSUPPORTED_SHAPE_KEYWORDS = [
	"$ref",
	"$dynamicRef",
	"$recursiveRef",
	"allOf",
	"patternProperties",
	"unevaluatedProperties",
	"dependentSchemas",
	"dependencies",
	"if",
	"then",
	"else",
	"prefixItems",
	"unevaluatedItems"
];
const INPUT_LIMITS = {
	maxChars: MAX_COMPACT_INPUT_HINT_CHARS,
	maxDepth: MAX_COMPACT_INPUT_DEPTH,
	maxProperties: MAX_COMPACT_INPUT_SCHEMA_PROPERTIES,
	numericInputConstraints: true
};
const OUTPUT_LIMITS = {
	maxChars: MAX_COMPACT_OUTPUT_HINT_CHARS,
	maxDepth: MAX_COMPACT_OUTPUT_DEPTH,
	maxProperties: MAX_COMPACT_OUTPUT_SCHEMA_PROPERTIES,
	numericInputConstraints: false
};
const UNKNOWN_HINT = {
	text: "unknown",
	complete: false
};
function completeHint(text) {
	return {
		text,
		complete: true
	};
}
function withSupportedShape(schema, hint) {
	return UNSUPPORTED_SHAPE_KEYWORDS.some((key) => Object.hasOwn(schema, key)) ? {
		...hint,
		complete: false
	} : hint;
}
function normalizeNullableSchemaForHint(schema) {
	if (!Object.hasOwn(schema, "nullable")) return schema;
	if (typeof schema.nullable !== "boolean") return;
	const types = typeof schema.type === "string" ? [schema.type] : Array.isArray(schema.type) && schema.type.every((value) => typeof value === "string") ? schema.type : void 0;
	if (!types) return;
	if (!schema.nullable) return schema;
	return {
		...schema,
		nullable: false,
		type: [.../* @__PURE__ */ new Set([...types, "null"])]
	};
}
function renderPrimitive(value) {
	if (value === null || typeof value === "string" || typeof value === "boolean" || typeof value === "number" && Number.isFinite(value)) return JSON.stringify(value);
}
function compactLiteralUnion(values, limits) {
	if (!Array.isArray(values) || values.length === 0 || values.length > (limits.declaration ? 256 : MAX_COMPACT_ENUM_VALUES)) return;
	const rendered = values.map(renderPrimitive);
	if (rendered.some((value) => value === void 0)) return;
	const result = [...new Set(rendered)].join(" | ");
	return result.length <= (limits.declaration ? limits.maxChars : MAX_COMPACT_ENUM_CHARS) ? completeHint(result) : void 0;
}
function compactSchemaUnion(schema, depth, limits) {
	const hasAnyOf = Object.hasOwn(schema, "anyOf");
	const hasOneOf = Object.hasOwn(schema, "oneOf");
	if (!hasAnyOf && !hasOneOf) return;
	if (hasAnyOf && hasOneOf) return UNKNOWN_HINT;
	const variants = hasAnyOf ? schema.anyOf : schema.oneOf;
	if (!Array.isArray(variants) || variants.length === 0 || variants.length > (limits.declaration ? 256 : MAX_COMPACT_ENUM_VALUES)) return UNKNOWN_HINT;
	if ([
		"const",
		"enum",
		"type",
		"properties",
		"required",
		"additionalProperties",
		"items"
	].some((key) => Object.hasOwn(schema, key))) return UNKNOWN_HINT;
	const literalVariants = variants.map((variant) => {
		if (!isRecord(variant) || !Object.hasOwn(variant, "const") || UNSUPPORTED_SHAPE_KEYWORDS.some((key) => Object.hasOwn(variant, key))) return;
		return variant.const;
	});
	if (literalVariants.every((value) => value !== void 0)) {
		const literalUnion = compactLiteralUnion(literalVariants, limits);
		if (literalUnion) return literalUnion;
	}
	if (variants.length > (limits.declaration ? 256 : MAX_COMPACT_UNION_TYPES)) return UNKNOWN_HINT;
	const rendered = variants.map((variant) => compactSchemaType(variant, depth + 1, limits));
	if (rendered.some((hint) => !hint.complete)) return UNKNOWN_HINT;
	return completeHint([...new Set(rendered.map((hint) => hint.text))].join(" | "));
}
function insertLexicallyBounded(values, value, limit) {
	if (limit <= 0) return;
	let low = 0;
	let high = values.length;
	while (low < high) {
		const middle = Math.floor((low + high) / 2);
		if ((values[middle] ?? "").localeCompare(value) < 0) low = middle + 1;
		else high = middle;
	}
	if (low >= limit) return;
	values.splice(low, 0, value);
	if (values.length > limit) values.pop();
}
function compactObjectHint(schema, depth, limits) {
	if (limits.declaration) {
		const properties = isRecord(schema.properties) ? schema.properties : {};
		const required = new Set(Array.isArray(schema.required) ? schema.required : []);
		const keys = [.../* @__PURE__ */ new Set([...Object.keys(properties), ...required])];
		if (keys.length > limits.maxProperties || !keys.every((key) => typeof key === "string" && key.length <= MAX_COMPACT_SCHEMA_PROPERTY_NAME_CHARS)) return UNKNOWN_HINT;
		const fields = keys.toSorted().map((key) => {
			const hint = compactSchemaType(properties[key], depth, limits);
			return (IDENTIFIER_RE.test(key) ? key : JSON.stringify(key)) + (required.has(key) ? "" : "?") + ": " + (hint.complete ? hint.text : "unknown");
		});
		if (schema.additionalProperties !== false) {
			const extra = compactSchemaType(schema.additionalProperties, depth, limits);
			fields.push("[key: string]: " + (keys.length === 0 && extra.complete ? extra.text : "unknown"));
		}
		return completeHint(fields.length ? "{ " + fields.join("; ") + " }" : "Record<string, never>");
	}
	if (!isRecord(schema.properties)) {
		const requiredValues = Array.isArray(schema.required) ? schema.required : [];
		return !(requiredValues.length > limits.maxProperties || requiredValues.some((value) => typeof value === "string")) && schema.additionalProperties === false ? completeHint("{}") : {
			text: "{ ... }",
			complete: false
		};
	}
	const properties = schema.properties;
	const requiredValues = Array.isArray(schema.required) ? schema.required : [];
	const invalidRequired = requiredValues.length <= limits.maxProperties && requiredValues.some((value) => typeof value !== "string");
	const required = new Set(requiredValues.slice(0, limits.maxProperties).filter((value) => typeof value === "string"));
	const requiredKeys = [];
	let missingRequired = false;
	for (const key of required) {
		if (key.length > MAX_COMPACT_SCHEMA_PROPERTY_NAME_CHARS) {
			missingRequired = true;
			continue;
		}
		if (!Object.hasOwn(properties, key)) {
			missingRequired = true;
			continue;
		}
		insertLexicallyBounded(requiredKeys, key, limits.maxProperties);
	}
	const optionalLimit = limits.maxProperties - requiredKeys.length;
	const optionalKeys = [];
	let optionalCount = 0;
	let oversizedOptionalKey = false;
	for (const key in properties) {
		if (!Object.hasOwn(properties, key) || required.has(key)) continue;
		optionalCount += 1;
		if (key.length > MAX_COMPACT_SCHEMA_PROPERTY_NAME_CHARS) {
			oversizedOptionalKey = true;
			continue;
		}
		insertLexicallyBounded(optionalKeys, key, optionalLimit);
	}
	const keys = [...requiredKeys, ...optionalKeys];
	const structurallyIncomplete = requiredValues.length > limits.maxProperties || invalidRequired || missingRequired || oversizedOptionalKey || optionalCount > optionalLimit;
	let omitted = structurallyIncomplete || schema.additionalProperties === true || isRecord(schema.additionalProperties);
	let complete = !structurallyIncomplete && schema.additionalProperties === false;
	let body = "";
	for (const key of keys) {
		const name = IDENTIFIER_RE.test(key) ? key : JSON.stringify(key);
		const propertyHint = compactSchemaType(properties[key], depth, limits);
		complete &&= propertyHint.complete;
		const part = `${name}${required.has(key) ? "" : "?"}: ${propertyHint.text}`;
		const next = body ? `${body}; ${part}` : part;
		if (next.length + 4 > limits.maxChars) {
			omitted = true;
			complete = false;
			break;
		}
		body = next;
	}
	if (!body) return keys.length === 0 && !omitted ? {
		text: "{}",
		complete
	} : {
		text: "{ ... }",
		complete: false
	};
	return {
		text: `{ ${body}${omitted ? "; ..." : ""} }`,
		complete
	};
}
function compactSchemaType(schema, depth = 0, limits = INPUT_LIMITS) {
	if (limits.remainingNodes && --limits.remainingNodes.value < 0) return UNKNOWN_HINT;
	if (!isRecord(schema)) return limits.declaration && schema === false ? completeHint("never") : UNKNOWN_HINT;
	if (limits.declaration && UNSUPPORTED_SHAPE_KEYWORDS.some((key) => Object.hasOwn(schema, key))) return UNKNOWN_HINT;
	if (Object.keys(schema).length === 0) return completeHint("unknown");
	if (depth >= limits.maxDepth) return UNKNOWN_HINT;
	const normalizedNullableSchema = normalizeNullableSchemaForHint(schema);
	if (!normalizedNullableSchema) return UNKNOWN_HINT;
	if (normalizedNullableSchema !== schema) return compactSchemaType(normalizedNullableSchema, depth, limits);
	const finish = (hint) => withSupportedShape(schema, hint);
	const schemaUnion = compactSchemaUnion(schema, depth, limits);
	if (schemaUnion) return finish(schemaUnion);
	const literal = renderPrimitive(schema.const);
	if (literal !== void 0) return finish(completeHint(literal));
	const enumUnion = compactLiteralUnion(schema.enum, limits);
	if (enumUnion) return finish(enumUnion);
	const type = schema.type;
	if (Array.isArray(type)) {
		if (type.length === 0 || type.length > MAX_COMPACT_UNION_TYPES || !type.every((value) => typeof value === "string")) return UNKNOWN_HINT;
		const rendered = type.map((value) => compactSchemaType({
			...schema,
			type: value
		}, depth + 1, limits));
		if (rendered.some((hint) => !hint.complete)) return UNKNOWN_HINT;
		return finish(completeHint([...new Set(rendered.map((hint) => hint.text))].join(" | ")));
	}
	if (type === "integer" || type === "number") {
		if (!limits.numericInputConstraints) return finish(completeHint("number"));
		const constraints = type === "integer" ? ["integer"] : [];
		for (const [key, operator] of NUMERIC_INPUT_BOUNDS) {
			const bound = schema[key];
			if (bound === void 0) continue;
			if (typeof bound !== "number" || !Number.isFinite(bound)) return UNKNOWN_HINT;
			constraints.push(`${operator} ${bound}`);
		}
		return finish(completeHint(`number${constraints.length > 0 ? ` /* ${constraints.join(", ")} */` : ""}`));
	}
	if (type === "array") {
		const itemHint = compactSchemaType(schema.items, depth + 1, limits);
		return finish({
			text: `Array<${itemHint.text}>`,
			complete: itemHint.complete
		});
	}
	if (type === "object") return finish(compactObjectHint(schema, depth + 1, limits));
	if (type === "string" || type === "boolean" || type === "null") return finish(completeHint(type));
	return UNKNOWN_HINT;
}
/** Full bounded declaration from the same schema as the compact hints.
* Unsupported shapes remain unknown; runtime validation still owns constraints.
*/
function toolSchemaDeclaration(schema) {
	const limits = {
		maxChars: MAX_TOOL_SCHEMA_DECLARATION_CHARS,
		maxDepth: 12,
		maxProperties: 256,
		numericInputConstraints: true,
		declaration: true,
		remainingNodes: { value: 4096 }
	};
	const hint = compactSchemaType(schema, 0, limits);
	return hint.complete && hint.text.length <= limits.maxChars ? hint.text : "unknown";
}
/** Compact one tool input schema. Unknown inputs remain explicit for safe describe fallback. */
function compactToolInputHint(schema) {
	if (!isRecord(schema)) return "unknown";
	const hint = schema.type === "object" ? compactObjectHint(schema, 0, INPUT_LIMITS) : compactSchemaType(schema, 0, INPUT_LIMITS);
	return hint.text.length <= INPUT_LIMITS.maxChars ? hint.text : "unknown";
}
/** Compact one trusted output schema. Omit incomplete hints instead of inviting field guesses. */
function compactToolOutputHint(schema) {
	const hint = compactSchemaType(schema, 0, OUTPUT_LIMITS);
	return hint.complete && hint.text.length <= OUTPUT_LIMITS.maxChars ? hint.text : void 0;
}
//#endregion
//#region src/agents/tool-contract-error.ts
const failures = /* @__PURE__ */ new WeakMap();
function markToolContractFailure(error, code) {
	failures.set(error, code);
	return error;
}
function getToolContractFailureCode(error) {
	return error instanceof Error ? failures.get(error) : void 0;
}
//#endregion
export { compactToolOutputHint as a, disposeCodeModeResults as c, compactToolInputHint as i, markToolContractFailure as n, toolSchemaDeclaration as o, MAX_TOOL_SCHEMA_DECLARATION_CHARS as r, createCodeModeResultsAccess as s, getToolContractFailureCode as t };
