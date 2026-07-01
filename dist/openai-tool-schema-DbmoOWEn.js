import { p as readStringValue } from "./string-coerce-DW4mBlAt.js";
import { r as resolveProviderRequestCapabilities } from "./provider-attribution-8gdGyO--.js";
import { c as shouldOmitEmptyArrayItems } from "./provider-model-compat-DAJmt9jr.js";
import { t as normalizeToolParameterSchema } from "./agent-tools-parameter-schema-DuvCCf3g.js";
//#region src/shared/openai-responses-stream-compat.ts
const OPENAI_RESPONSES_OUTPUT_TEXT_CONTENT_PART_TYPE = "output_text";
const AZURE_RESPONSES_TEXT_CONTENT_PART_TYPE = "text";
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
//#region src/agents/openai-strict-tool-setting.ts
/**
* Strict tool-schema default resolution for native OpenAI-compatible routes.
*
* Compatible providers can support strict schemas without inheriting OpenAI's required default.
*/
const optionalString = readStringValue;
function resolvesToNativeOpenAIStrictTools(model, transport) {
	const capabilities = resolveProviderRequestCapabilities({
		provider: optionalString(model.provider),
		api: optionalString(model.api),
		baseUrl: optionalString(model.baseUrl),
		capability: "llm",
		transport,
		modelId: optionalString(model.id),
		compat: model.compat
	});
	if (!capabilities.usesKnownNativeOpenAIRoute) return false;
	return capabilities.provider === "openai" || capabilities.provider === "azure-openai" || capabilities.provider === "azure-openai-responses";
}
/** Resolve the strict-tool setting for one OpenAI-compatible model/transport. */
function resolveOpenAIStrictToolSetting(model, options) {
	if (resolvesToNativeOpenAIStrictTools(model, options?.transport ?? "stream")) return true;
	if (options?.supportsStrictMode) return false;
}
//#endregion
//#region src/agents/openai-tool-schema.ts
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
export { AZURE_RESPONSES_TEXT_CONTENT_PART_TYPE as a, isResponsesTextContentPartType as c, resolveOpenAIStrictToolSetting as i, isResponsesTextDeltaEventType as l, normalizeOpenAIStrictToolParameters as n, OPENAI_RESPONSES_OUTPUT_TEXT_CONTENT_PART_TYPE as o, resolveOpenAIProjectedToolsStrictToolFlag as r, isAzureResponsesTextDeltaEvent as s, findOpenAIStrictToolProjectionDiagnostics as t, resolveResponsesMessageSnapshotCollapse as u };
