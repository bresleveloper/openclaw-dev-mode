import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { n as readLiteralSchemaValues, r as schemaAnnotationsOnly, t as mergeLiteralSchemas } from "./json-schema-literals-CTM-h34e.mjs";
import { isDeepStrictEqual } from "node:util";
import { GEMINI_UNSUPPORTED_SCHEMA_KEYWORDS, cleanSchemaForGemini, cleanSchemaForLlamacppGbnf, findLlamacppGbnfSchemaViolations, findOpenAIStrictSchemaViolations, normalizeOpenAIStrictCompatSchema, stripUnsupportedSchemaKeywords } from "@openclaw/ai/internal/tool-schema";
//#region src/plugin-sdk/provider-tools.ts
/**
* Finds unsupported JSON-schema keywords and reports their nested schema paths.
*/
function findUnsupportedSchemaKeywords(schema, path, unsupportedKeywords) {
	if (!schema || typeof schema !== "object") return [];
	if (Array.isArray(schema)) return schema.flatMap((item, index) => findUnsupportedSchemaKeywords(item, `${path}[${index}]`, unsupportedKeywords));
	const record = schema;
	const violations = [];
	if (isRecord(record.properties)) for (const [key, value] of Object.entries(record.properties)) violations.push(...findUnsupportedSchemaKeywords(value, `${path}.properties.${key}`, unsupportedKeywords));
	for (const [key, value] of Object.entries(record)) {
		if (key === "properties") continue;
		if (unsupportedKeywords.has(key)) violations.push(`${path}.${key}`);
		if (value && typeof value === "object") violations.push(...findUnsupportedSchemaKeywords(value, `${path}.${key}`, unsupportedKeywords));
	}
	return violations;
}
function normalizeToolSchemasIfChanged(ctx, normalizeSchema) {
	return ctx.tools.map((tool) => {
		if (!tool.parameters || typeof tool.parameters !== "object") return tool;
		const parameters = normalizeSchema(tool.parameters);
		return parameters === tool.parameters ? tool : {
			...tool,
			parameters
		};
	});
}
function inspectToolSchemas(ctx, inspect) {
	return ctx.tools.flatMap((tool, toolIndex) => {
		const violations = inspect(tool.parameters, `${tool.name}.parameters`);
		return violations.length > 0 ? [{
			toolName: tool.name,
			toolIndex,
			violations
		}] : [];
	});
}
/**
* Rewrites tool schemas into Gemini-compatible JSON schema before provider dispatch.
*/
function normalizeGeminiToolSchemas(ctx) {
	return ctx.tools.map((tool) => {
		if (!tool.parameters || typeof tool.parameters !== "object") return tool;
		return {
			...tool,
			parameters: cleanSchemaForGemini(tool.parameters)
		};
	});
}
/**
* Reports Gemini-incompatible schema keywords without mutating tool definitions.
*/
function inspectGeminiToolSchemas(ctx) {
	return inspectToolSchemas(ctx, (schema, path) => findUnsupportedSchemaKeywords(schema, path, GEMINI_UNSUPPORTED_SCHEMA_KEYWORDS));
}
/** Rewrites tool schemas into the JSON Schema subset accepted by llama.cpp GBNF. */
function normalizeLlamacppGbnfToolSchemas(ctx) {
	return normalizeToolSchemasIfChanged(ctx, cleanSchemaForLlamacppGbnf);
}
/** Reports tool-schema constraints that llama.cpp GBNF cannot compile. */
function inspectLlamacppGbnfToolSchemas(ctx) {
	return inspectToolSchemas(ctx, findLlamacppGbnfSchemaViolations);
}
/**
* Rewrites OpenAI-native tool schemas to satisfy strict object-schema requirements.
*/
function normalizeOpenAIToolSchemas(ctx) {
	if (!shouldApplyOpenAIToolCompat(ctx)) return ctx.tools;
	return ctx.tools.map((tool) => {
		if (tool.parameters != null && typeof tool.parameters !== "object") return tool;
		return {
			...tool,
			parameters: normalizeOpenAIStrictCompatSchema(tool.parameters ?? {})
		};
	});
}
function shouldApplyOpenAIToolCompat(ctx) {
	const provider = (ctx.model?.provider ?? ctx.provider ?? "").trim().toLowerCase();
	const api = (ctx.model?.api ?? ctx.modelApi ?? "").trim().toLowerCase();
	const baseUrl = (ctx.model?.baseUrl ?? "").trim().toLowerCase();
	if (provider === "openai") {
		if (api === "openai-responses") return !baseUrl || isOpenAIResponsesBaseUrl(baseUrl);
		return api === "openai-chatgpt-responses" && (!baseUrl || isOpenAIResponsesBaseUrl(baseUrl) || isOpenAICodexBaseUrl(baseUrl));
	}
	return false;
}
function isOpenAIResponsesBaseUrl(baseUrl) {
	return /^https:\/\/api\.openai\.com(?:\/v1)?(?:\/|$)/i.test(baseUrl);
}
function isOpenAICodexBaseUrl(baseUrl) {
	return /^https:\/\/chatgpt\.com\/backend-api(?:\/|$)/i.test(baseUrl);
}
/**
* Reports OpenAI strict-schema diagnostics for transports that enforce them before dispatch.
*/
function inspectOpenAIToolSchemas(ctx) {
	if (!shouldApplyOpenAIToolCompat(ctx)) return [];
	return [];
}
/**
* DeepSeek rejects union keywords in tool schemas.
*/
const DEEPSEEK_UNSUPPORTED_SCHEMA_KEYWORDS = /* @__PURE__ */ new Set(["anyOf", "oneOf"]);
function isNullSchemaVariant(schema) {
	if (!isRecord(schema)) return false;
	return schema.type === "null" || Array.isArray(schema.type) && schema.type.length === 1 && schema.type[0] === "null" || schema.const === null || Array.isArray(schema.enum) && schema.enum.length === 1 && schema.enum[0] === null;
}
function normalizeDeepSeekSchema(schema) {
	if (Array.isArray(schema)) {
		let changed = false;
		const normalized = schema.map((entry) => {
			const next = normalizeDeepSeekSchema(entry);
			changed ||= next !== entry;
			return next;
		});
		return changed ? normalized : schema;
	}
	if (!schema || typeof schema !== "object") return schema;
	const record = schema;
	const unionKey = Array.isArray(record.anyOf) ? "anyOf" : Array.isArray(record.oneOf) ? "oneOf" : void 0;
	let changed = unionKey !== void 0;
	const normalized = Object.fromEntries(Object.entries(record).filter(([key]) => key !== unionKey).map(([key, value]) => {
		const next = normalizeDeepSeekSchema(value);
		changed ||= next !== value;
		return [key, next];
	}));
	if (!unionKey) return changed ? normalized : schema;
	const normalizedVariants = record[unionKey].map((entry) => normalizeDeepSeekSchema(entry));
	const nonNullVariants = normalizedVariants.filter((entry) => !isNullSchemaVariant(entry));
	const hasNullVariant = nonNullVariants.length < normalizedVariants.length || nonNullVariants.some((entry) => {
		if (!isObjectSchemaVariant(entry) || !Array.isArray(entry.type) || !entry.type.includes("null")) return false;
		const literals = readLiteralSchemaValues(entry);
		return literals === void 0 || literals.includes(null);
	});
	if (nonNullVariants.length > 1 && nonNullVariants.every(isStringConstVariant)) return {
		...normalized,
		type: "string",
		enum: nonNullVariants.map((entry) => entry.const),
		...hasNullVariant ? { nullable: true } : {}
	};
	const selected = nonNullVariants.length > 1 && nonNullVariants.every(isObjectSchemaVariant) ? flattenObjectVariants(nonNullVariants) ?? nonNullVariants[0] : nonNullVariants[0] ?? normalizedVariants[0];
	if (!isRecord(selected)) return normalized;
	const nullableObject = hasNullVariant && nonNullVariants.length > 0 && nonNullVariants.every(isObjectSchemaVariant);
	let selectedSchema = selected;
	if (nullableObject) {
		selectedSchema = {
			...selected,
			type: ["object", "null"]
		};
		const literals = readLiteralSchemaValues(selected);
		if (literals) {
			selectedSchema.enum = literals.includes(null) ? literals : [...literals, null];
			delete selectedSchema.const;
		}
	}
	const merged = {
		...selectedSchema,
		...normalized
	};
	if (hasNullVariant && !nullableObject) merged.nullable = true;
	return merged;
}
function isStringConstVariant(entry) {
	return isRecord(entry) && typeof entry.const === "string";
}
function isObjectSchemaVariant(entry) {
	return isRecord(entry) && (entry.type === "object" || Array.isArray(entry.type) && entry.type.includes("object") && entry.type.every((type) => type === "object" || type === "null"));
}
function flattenObjectVariants(variants) {
	const properties = Object.create(null);
	let required;
	for (const variant of variants) {
		const variantProperties = variant.properties;
		if (!isRecord(variantProperties)) return;
		for (const [key, value] of Object.entries(variantProperties)) {
			if (!Object.hasOwn(properties, key)) {
				properties[key] = value;
				continue;
			}
			const existing = properties[key];
			if (isDeepStrictEqual(existing, value)) continue;
			const pooled = isRecord(existing) && isRecord(value) ? mergeLiteralSchemas(existing, value) : void 0;
			if (pooled) properties[key] = pooled;
		}
		const variantRequired = Array.isArray(variant.required) ? variant.required.filter((key) => typeof key === "string") : [];
		required = required === void 0 ? variantRequired : required.filter((key) => variantRequired.includes(key));
	}
	for (const key of Object.keys(properties)) if (variants.some((variant) => acceptsUndeclaredKey(variant, key))) properties[key] = schemaAnnotationsOnly(properties[key]);
	const flattened = {
		type: "object",
		properties
	};
	if (required && required.length > 0) flattened.required = required;
	return flattened;
}
function acceptsUndeclaredKey(variant, key) {
	const declared = variant.properties;
	if (isRecord(declared) && Object.hasOwn(declared, key)) return false;
	if (variant.additionalProperties !== false) return true;
	const patternProperties = variant.patternProperties;
	if (!isRecord(patternProperties)) return false;
	return Object.keys(patternProperties).some((pattern) => {
		try {
			return new RegExp(pattern).test(key);
		} catch {
			return false;
		}
	});
}
/**
* Rewrites DeepSeek-incompatible union schemas into the closest accepted shape.
*/
function normalizeDeepSeekToolSchemas(ctx) {
	return normalizeToolSchemasIfChanged(ctx, normalizeDeepSeekSchema);
}
/**
* Reports DeepSeek-incompatible union schema paths without mutating tool definitions.
*/
function inspectDeepSeekToolSchemas(ctx) {
	return inspectToolSchemas(ctx, (schema, path) => findUnsupportedSchemaKeywords(schema, path, DEEPSEEK_UNSUPPORTED_SCHEMA_KEYWORDS));
}
/**
* Returns the normalizer and inspector pair for a provider tool-schema compatibility family.
*/
function buildProviderToolCompatFamilyHooks(family) {
	switch (family) {
		case "deepseek": return {
			normalizeToolSchemas: normalizeDeepSeekToolSchemas,
			inspectToolSchemas: inspectDeepSeekToolSchemas
		};
		case "gemini": return {
			normalizeToolSchemas: normalizeGeminiToolSchemas,
			inspectToolSchemas: inspectGeminiToolSchemas
		};
		case "llamacpp-gbnf": return {
			normalizeToolSchemas: normalizeLlamacppGbnfToolSchemas,
			inspectToolSchemas: inspectLlamacppGbnfToolSchemas
		};
		case "openai": return {
			normalizeToolSchemas: normalizeOpenAIToolSchemas,
			inspectToolSchemas: inspectOpenAIToolSchemas
		};
	}
	throw new Error("Unsupported provider tool compatibility family");
}
//#endregion
export { normalizeOpenAIToolSchemas as _, cleanSchemaForLlamacppGbnf as a, findUnsupportedSchemaKeywords as c, inspectLlamacppGbnfToolSchemas as d, inspectOpenAIToolSchemas as f, normalizeOpenAIStrictCompatSchema as g, normalizeLlamacppGbnfToolSchemas as h, cleanSchemaForGemini as i, inspectDeepSeekToolSchemas as l, normalizeGeminiToolSchemas as m, GEMINI_UNSUPPORTED_SCHEMA_KEYWORDS as n, findLlamacppGbnfSchemaViolations as o, normalizeDeepSeekToolSchemas as p, buildProviderToolCompatFamilyHooks as r, findOpenAIStrictSchemaViolations as s, DEEPSEEK_UNSUPPORTED_SCHEMA_KEYWORDS as t, inspectGeminiToolSchemas as u, stripUnsupportedSchemaKeywords as v };
